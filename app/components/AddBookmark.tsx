"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddBookmark({ user }: { user: any }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const addBookmark = async () => {
    if (!url || !title) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("bookmarks").insert([
      {
        url,
        title,
        user_id: user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error adding bookmark");
    } else {
      setUrl("");
      setTitle("");
      alert("Bookmark added!");
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Add Bookmark</h3>

      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", margin: "5px" }}
      />

      <br />

      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "8px", margin: "5px", width: "250px" }}
      />

      <br />

      <button
        onClick={addBookmark}
        disabled={loading}
        style={{ padding: "8px 16px", marginTop: "10px" }}
      >
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
    </div>
  );
}
