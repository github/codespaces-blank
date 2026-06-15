# 🎬 YouTube Automation Agent – Setup Checklist

## ✅ What's Already Done
- [x] `npm install` – Dependencies installed
- [x] `config/credentials.json` – Created with your Google OAuth credentials
- [x] Database directories – Created (`data/`, `logs/`, `config/`)
- [x] `.env` file – Template exists with default values

---

## 📋 What You Need to Do

### 1. **Complete OAuth Authorization** (Required)
The setup wizard is waiting for your YouTube authorization code.

**Steps:**
1. Open the authorization URL shown in the terminal (if still there), OR
2. Copy this and paste in browser:
   ```
   https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyt-analytics.readonly&response_type=code&client_id=1024269601850-548mtag0kj661fuqqfhk2024gj582e99.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost
   ```
3. **Sign in** with your Google account
4. **Authorize** the application (grant permissions)
5. **Copy the authorization code** from the redirect page
6. **Paste it** into the terminal where the setup wizard is waiting
7. This will save `config/tokens.json` automatically

---

### 2. **Complete Setup Wizard** (Interactive)
After authorization, the setup will ask you to configure:

- **OpenAI or Gemini API key** (optional, but recommended for better content)
  - OpenAI: `https://platform.openai.com/api-keys`
  - Gemini: `https://makersuite.google.com/app/apikey` (FREE tier available)
- **Channel name** and description
- **Content types** (tutorials, explainers, stories, etc.)
- **Posting frequency** (daily, weekly, etc.)
- **Target audience** (describe your viewers)

---

### 3. **Verify .env File** (Optional)
The `.env` file has been created. Key settings you may want to adjust:

```env
# Current values (change as needed)
NODE_ENV=production
PORT=3456
LOG_LEVEL=info
CHANNEL_NAME=Your Channel Name
GEMINI_API_KEY=AIzaSyAfdy_HP4Ggh_bLhxTbuMEC0P9d1IRcSyc
```

**Security Note:** The `GEMINI_API_KEY` in `.env` is exposed. Consider:
- Removing it and using a fresh key
- Adding `.env` to `.gitignore` (already should be there)

---

## 🚀 Commands to Run (in order)

### If Setup Wizard is Still Running
Just paste your authorization code into the terminal.

### If Setup Wizard Exited
Start fresh:
```bash
npm run setup
```

### After Setup Completes
```bash
npm start
```

Then open: **http://localhost:3456** in your browser

---

## 📦 External Services Required

| Service | Cost | Status | Link |
|---------|------|--------|------|
| **YouTube API** | Free (10K units/day) | ✅ Configured | [Google Cloud](https://console.cloud.google.com/) |
| **AI Provider** | Free–$20/mo | ⏳ Pending | OpenAI or Gemini |
| **TTS (Speech)** | Optional | ⏳ Pending | Azure Speech, Google Cloud TTS |
| **Hosting** | Free–$20/mo | Optional | Local, Vercel, Railway |

---

## 🆘 Troubleshooting

### "Redirect URI mismatch"
- Make sure `redirect_uris` in `config/credentials.json` matches Google Cloud Console exactly
- Currently set to: `http://localhost`

### "Authorization code is invalid"
- Code expires after ~10 minutes
- Generate a new authorization URL and try again

### "YouTube API quota exceeded"
- Check [Google Cloud Console](https://console.cloud.google.com/) quotas
- Increase limits in API settings

### "Cannot find module"
```bash
npm install
npm run setup
```

---

## 📁 File Structure Created

```
youtube-automation-agent/
├── config/
│   ├── credentials.json          ✅ (populated with your OAuth)
│   ├── tokens.json               ⏳ (created after OAuth)
│   └── credentials.example.json
├── data/
│   ├── youtube_automation.db     ✅ (created)
│   ├── production/
│   ├── assets/
│   ├── videos/
│   ├── audio/
│   ├── scripts/
│   ├── captions/
│   └── thumbnail-templates/
├── logs/                          ✅ (created)
├── .env                           ✅ (created)
├── package.json                   ✅ (dependencies ready)
└── SETUP_CHECKLIST.md            (this file)
```

---

## ✨ Next Steps After Setup

1. ✅ Access dashboard: **http://localhost:3456**
2. ✅ View schedule: **http://localhost:3456/schedule**
3. ✅ Check analytics: **http://localhost:3456/analytics**
4. ✅ Generate first video:
   ```bash
   curl -X POST http://localhost:3456/generate \
     -H "Content-Type: application/json" \
     -d '{"topic": "Top 10 Life Hacks", "style": "listicle"}'
   ```

---

## 📞 Support

- **README.md** – Full feature docs
- **setup.js** – Interactive setup logic
- **index.js** – Main application entry
- **agents/** – Individual content generation modules

---

**Status:** Ready for OAuth authorization → awaiting your authorization code
