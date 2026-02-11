# KAYRO AI v7.0 — Firebase Auth + Cloud Sync Edition

A premium AI chat interface with Firebase Authentication, cloud data sync, and cross-device support. Developed by **Youssef Hegazy**.

---

## 🔐 Authentication

### Sign-in Methods
- **Google Sign-In** — One-click Google authentication
- **Email/Password** — Register and login with email
- **Forgot Password** — Reset link sent to email

### Cloud Sync (Firestore)
All data is automatically synced to Firebase Firestore:
- ✅ Conversations — all chat history
- ✅ Settings — name, age, custom instructions
- ✅ Preferences — language, theme, background
- ✅ Cross-device — login on any device, get all your data

### How It Works
1. User logs in → `auth.onAuthStateChanged()` fires
2. Data loads from `users/{uid}` document in Firestore
3. Every change is debounced (1.5s) and saved to cloud
4. Offline persistence enabled — works without internet

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 Auth | Google + Email/Password login |
| ☁️ Cloud Sync | Firestore cross-device sync |
| 🎨 Themes | Dark + Light mode |
| 🌌 Backgrounds | Stars, Black, White, Abstract, None |
| ⚙️ Settings | Name, age, custom instructions |
| 🎤 Voice Input | Speech-to-text via mic |
| 🔊 TTS | AI reads messages aloud |
| 🖼️ Image Gen | Pollinations AI |
| 📋 Code Copy | One-click copy on code blocks |
| 🌍 Bilingual | English + Arabic with RTL |
| ⏱️ Temp Chats | One-time conversations |
| 📎 Attachments | Images + files |
| 🧠 AI Model | DeepSeek V3 via OpenRouter |

---

## Firebase Setup

The app uses these Firebase services:
- **Firebase Authentication** — Google + Email/Password
- **Cloud Firestore** — Data storage and sync

### Firestore Rules (recommended)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Enable Auth Providers
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**
3. Enable **Google**
4. Add your domain to Authorized domains

---

## File Structure

```
├── index.html    → Auth screen + Chat UI
├── style.css     → Themes + Glassmorphism + Auth styles
├── script.js     → Firebase Auth + Firestore + AI engine
└── README.md     → Documentation
```

---

## Developer

**Youssef Hegazy** (يوسف حجازي)
