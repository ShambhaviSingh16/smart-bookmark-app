# 🔖 Smart Bookmark Manager

A modern, secure, and real-time bookmark management web application that allows users to save, organize, and access their personal bookmarks using Google authentication.

Built as part of a Fullstack/GenAI screening task.

---

## 🚀 Live Demo

👉 **Live URL:** *[https://smart-bookmark-applicationn.vercel.app/]*
👉 **GitHub Repo:** [https://github.com/ShambhaviSingh16/smart-bookmark-app](https://github.com/ShambhaviSingh16/smart-bookmark-app/)

---

## ✨ Features

* 🔐 **Google OAuth Authentication** (No email/password)
* ➕ Add bookmarks with title and URL
* 🔒 **User-specific private bookmarks** (RLS enforced)
* ⚡ **Real-time updates** across tabs
* 🗑 Delete your own bookmarks
* 🔍 Search bookmarks instantly
* 🎨 Premium glassmorphism UI
* 📱 Responsive design

---

## 🧰 Tech Stack

**Frontend**

* Next.js (App Router)
* TypeScript
* Tailwind CSS + Custom CSS

**Backend & Services**

* Supabase Authentication (Google OAuth)
* Supabase PostgreSQL Database
* Supabase Realtime
* Row Level Security (RLS)

**Deployment**

* Vercel

---

## 🔐 Authentication Flow

* Users sign in using **Google OAuth only**
* Supabase manages the session securely
* Each bookmark is linked to the authenticated user
* RLS ensures users can only access their own data

---

## 🗄 Database Design

### Table: `bookmarks`

| Column     | Type                   |
| ---------- | ---------------------- |
| id         | uuid (PK)              |
| title      | text                   |
| url        | text                   |
| user_id    | uuid (FK → auth.users) |
| created_at | timestamp              |

---

## 🔒 Security (Row Level Security)

RLS policies ensure:

* ✅ Users can insert their own bookmarks
* ✅ Users can view only their bookmarks
* ✅ Users can delete only their bookmarks

---

## ⚡ Realtime Support

The app subscribes to Supabase realtime changes so that:

* Adding a bookmark in one tab appears in another
* No manual refresh required
* Live sync across sessions

---

## 🧪 Validation & Edge Handling

* URL normalization (`https://` auto-added)
* URL format validation
* Duplicate bookmark prevention
* Loading states and user feedback
* Error handling for failed operations

---

## 📦 Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ShambhaviSingh16/smart-bookmark-app.git
cd smart-bookmark-app
```

### 2️⃣ Install dependencies

```bash
npm install  
```

### 3️⃣ Create environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4️⃣ Run the app

```bash
npm run dev
```

---

## 🚀 Deployment

The application is deployed on **Vercel**.

Steps used:

1. Push code to GitHub
2. Import project into Vercel
3. Add environment variables
4. Deploy

---

## 🧠 Challenges Faced & Solutions

**1. Supabase environment error during Vercel build**

* Issue: `supabaseUrl is required`
* Fix: Added environment variables in Vercel project settings.

**2. Google OAuth redirect handling**

* Ensured correct redirect URL configuration in Supabase.

**3. UI polish for better UX**

* Implemented glassmorphism theme
* Improved button hierarchy
* Added hover micro-interactions

**4. Preventing duplicate bookmarks**

* Implemented client-side normalization and comparison.

---

## 📌 Future Improvements

* ✏️ Edit bookmark feature
* 🏷 Bookmark categories/tags
* 🌙 Dark/light theme toggle
* 📊 Usage analytics
* 🔗 Favicon preview for bookmarks

---

## 👩‍💻 Author

**Shambhavi Singh**

* GitHub: [https://github.com/ShambhaviSingh16](https://github.com/ShambhaviSingh16)
* LinkedIn: *[https://www.linkedin.com/in/shambhavi-singh2023/]*

---

## ⭐ Acknowledgement

Built as part of a Fullstack/GenAI screening assignment using Next.js and Supabase.

---

**If you found this project useful, feel free to ⭐ the repo!**
