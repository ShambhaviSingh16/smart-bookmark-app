"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  // ================= AUTH =================
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ================= FETCH BOOKMARKS =================
  const fetchBookmarks = async () => {
    if (!user) return;

    setLoadingBookmarks(true);

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id) // ✅ CRITICAL
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
    setLoadingBookmarks(false);
  };

  useEffect(() => {
    if (!user) return;

    // initial fetch
    fetchBookmarks();

    // 🔥 realtime subscription
    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    // cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);


  // ================= URL HELPERS =================
  const normalizeUrl = (value: string) => {
    let clean = value.trim();
    if (!clean) return "";

    if (!/^https?:\/\//i.test(clean)) {
      clean = "https://" + clean;
    }

    try {
      const urlObj = new URL(clean);
      return urlObj.toString();
    } catch {
      return clean;
    }
  };

  const isValidUrl = (value: string) => {
    try {
      const u = new URL(value);
      return !!u.hostname && u.hostname.includes(".");
    } catch {
      return false;
    }
  };

  // ================= SIGN IN =================
  const signInWithGoogle = async () => {
    setAuthLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };


  // ================= SIGN OUT =================
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // ================= ADD BOOKMARK =================
  const addBookmark = async () => {
    setMessage("");

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle || !trimmedUrl) {
      setMessage("❌ Please fill all fields");
      return;
    }

    const normalizedUrl = normalizeUrl(trimmedUrl);

    if (!isValidUrl(normalizedUrl)) {
      setMessage("❌ Please enter a valid URL (example: google.com)");
      return;
    }

    // prevent duplicate URLs
    const exists = bookmarks.some(
      (b) =>
        normalizeUrl(b.url).toLowerCase() ===
        normalizedUrl.toLowerCase()
    );

    if (exists) {
      setMessage("⚠️ This bookmark already exists");
      return;
    }

    setAdding(true);

    const { error } = await supabase.from("bookmarks").insert([
      {
        title: trimmedTitle,
        url: normalizedUrl,
        user_id: user.id,
      },
    ]);

    setAdding(false);

    if (error) {
      setMessage("❌ Failed to add bookmark. Please try again.");
      return;
    }

    setTitle("");
    setUrl("");
    setMessage("✅ Bookmark added!");

    fetchBookmarks();
  };

  // ================= DELETE =================
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id).eq("user_id", user.id);
    fetchBookmarks();
  };

  // ================= FILTER =================
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [bookmarks, search]);

  // ================= AUTH UI =================
  if (!user) {
    return (
      <div className="center">
        {/* <div className="authBox"> */}
        <div className="authBox glass">
          <h1 className="title">🔖 Smart Bookmark Manager</h1>

          <button
            className="googleBtn"
            onClick={signInWithGoogle}
            disabled={authLoading}
          >
            {authLoading ? "Signing in..." : "🔐 Continue with Google"}
          </button>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="container">
      {/* HEADER */}
      {/* <div style={{ textAlign: "center" }}>
        <h2>Welcome, {user.email}</h2>
        <button className="logoutBtn" onClick={signOut}>
          Logout
        </button>
      </div> */}

      <div className="glass header">
        <div className="userEmail">
          👋 Welcome, <strong>{user.email}</strong>
        </div>

        <button className="logoutBtn" onClick={signOut}>
          Logout
        </button>
      </div>


      {/* ADD FORM */}
      {/* <div className="card"> */}
      <div className="card glass">
        <h3 className="formTitle">Add Bookmark</h3>

        <input
          className="input"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="input"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          className="addBtn"
          onClick={addBookmark}
          disabled={adding}
        >
          {adding ? "Adding..." : "Add Bookmark"}
        </button>

        {message && (
          <p className={message.startsWith("✅") ? "success" : "error"}>
            {message}
          </p>
        )}
      </div>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="🔍 Search bookmarks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      {loadingBookmarks ? (
        <div className="grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" />
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="empty">
          <h3>📭 No bookmarks yet</h3>
          <p>Add your first bookmark above</p>
        </div>
      ) : (
        <div className="grid">
          {filteredBookmarks.map((b) => (
            // <div key={b.id} className="bookmarkCard">
            <div key={b.id} className="bookmarkCard glass">
              <div className="cardTop">
                <h4 className="cardTitle">{b.title}</h4>

                <span className="urlText" title={b.url}>
                  {b.url.replace(/^https?:\/\//, "")}
                </span>
              </div>

              <div className="cardActions">
                <a
                  className="visitBtnPrimary"
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🚀 Open Site
                </a>

                <button
                  className="deleteBtn"
                  onClick={() => deleteBookmark(b.id)}
                >
                  🗑 Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
