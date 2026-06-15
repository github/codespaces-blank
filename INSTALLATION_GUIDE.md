# 🎬 YouTube Automation Agent - Complete Installation & Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Clone & Install](#step-1-clone--install)
3. [Step 2: Google Cloud Console Setup](#step-2-google-cloud-console-setup)
4. [Step 3: Configure Credentials](#step-3-configure-credentials)
5. [Step 4: OAuth Authorization](#step-4-oauth-authorization)
6. [Step 5: Interactive Setup Wizard](#step-5-interactive-setup-wizard)
7. [Step 6: Start the Application](#step-6-start-the-application)
8. [Verify Installation](#verify-installation)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

---

## Prerequisites

Before starting, ensure you have:

- **Node.js 18.0.0 or higher**
  - Download: https://nodejs.org/
  - Check version: `node --version`
  
- **npm** (comes with Node.js)
  - Check version: `npm --version`
  
- **Git** (for version control)
  - Download: https://git-scm.com/
  - Check version: `git --version`

- **Google Account** (for YouTube API)
  - Personal or business account

- **API Keys** (at least one):
  - OpenAI: https://platform.openai.com/api-keys (optional, ~$5-20/month)
  - OR Google Gemini: https://makersuite.google.com/app/apikey (FREE)

---

## Step 1: Clone & Install

### 1.1 Clone the Repository
```bash
git clone https://github.com/darkzOGx/youtube-automation-agent.git
cd youtube-automation-agent
```

### 1.2 Install Dependencies
```bash
npm install
```

**Expected Output:**
```
up to date, audited 429 packages in 5s
54 packages are looking for funding
```

**Note:** If you see vulnerabilities, you can run `npm audit fix` (optional, not required for operation)

---

## Step 2: Google Cloud Console Setup

This step gets your YouTube API credentials.

### 2.1 Create Google Cloud Project
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a Project** → **New Project**
3. Name it: `YouTube-Automation`
4. Click **Create** and wait for it to load

### 2.2 Enable YouTube Data API v3
1. In the left sidebar, click **APIs & Services** → **Library**
2. Search for: `YouTube Data API v3`
3. Click the result
4. Click **Enable**
5. Wait for it to enable (takes ~30 seconds)

### 2.3 Create OAuth 2.0 Credentials
1. In the left sidebar, click **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. If prompted, click **Configure OAuth consent screen first**
   - Choose **External** user type
   - Click **Create**
   - Fill in app name: `YouTube Automation Agent`
   - Add your email
   - Click **Save & Continue**
   - Click **Add or Remove Scopes** → Add these:
     - `https://www.googleapis.com/auth/youtube`
     - `https://www.googleapis.com/auth/youtube.upload`
     - `https://www.googleapis.com/auth/youtube.readonly`
     - `https://www.googleapis.com/auth/yt-analytics.readonly`
   - Click **Save & Continue** → **Save & Continue** again
   - Click **Back to Dashboard**

4. Now create OAuth credentials:
   - Click **+ Create Credentials** → **OAuth client ID**
   - Choose: **Desktop application**
   - Click **Create**
   - A dialog appears with your credentials

### 2.4 Download JSON File
1. In the **OAuth 2.0 Client IDs** section, click the download icon (⬇️)
2. This downloads a JSON file (e.g., `client_secret_xxx.json`)

### 2.5 Extract Credentials
Open the downloaded JSON file and find:
- `client_id` (looks like: `123456789-xxxxx.apps.googleusercontent.com`)
- `client_secret` (looks like: `GOCSPX-xxxxxxxxxxxxx`)

**Copy these values—you'll need them in Step 3**

---

## Step 3: Configure Credentials

### 3.1 Create config/credentials.json
In the project folder, create (or update) `config/credentials.json`:

```bash
cp config/credentials.example.json config/credentials.json
```

### 3.2 Edit credentials.json
Open `config/credentials.json` and paste:

```json
{
  "youtube": {
    "client_id": "YOUR_CLIENT_ID_HERE",
    "client_secret": "YOUR_CLIENT_SECRET_HERE",
    "redirect_uris": [
      "http://localhost"
    ]
  },
  "openai": {
    "apiKey": "",
    "model": "gpt-4-turbo-preview"
  },
  "channel": {
    "channelName": "Your Channel Name",
    "channelDescription": "Your channel description",
    "defaultCategory": "24",
    "defaultPrivacy": "public",
    "websiteUrl": "",
    "businessEmail": ""
  },
  "content": {
    "contentTypes": [
      "story",
      "explainer",
      "tutorial"
    ],
    "competitorChannels": [],
    "targetAudience": "Your target audience description",
    "postingFrequency": "daily",
    "preferredPostTime": "14:00"
  }
}
```

**Replace:**
- `YOUR_CLIENT_ID_HERE` → Your actual client ID
- `YOUR_CLIENT_SECRET_HERE` → Your actual client secret

### 3.3 Verify File Created
```bash
cat config/credentials.json
```

Should show your credentials (not `YOUR_CLIENT_ID_HERE`)

---

## Step 4: OAuth Authorization

This step connects your YouTube account to the application.

### 4.1 Run Setup Wizard
```bash
npm run setup
```

You'll see output like:
```
🎬 YouTube Automation Agent Setup
════════════════════════════════════════════════════════════

🔗 Please visit this URL to authorize the application:
https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&...
```

### 4.2 Click the Authorization URL
1. Copy the long `https://accounts.google.com/...` URL from terminal
2. Paste it in your browser
3. Sign in with your Google account
4. Click **Allow** to grant permissions
5. You'll see a **redirect page** with an authorization code in the URL:
   ```
   http://localhost/?code=4/0AY0e-g...
   ```

### 4.3 Extract & Paste Authorization Code
1. Look for the `code=` parameter in the URL
2. Copy the code (everything after `code=` until the next `&`)
3. Go back to terminal and paste it when it asks:
   ```
   ? Enter the authorization code: [paste code here]
   ```

### 4.4 Authorization Complete
You should see:
```
✅ YouTube authentication completed!
```

**What just happened:** The system saved `config/tokens.json` with your YouTube refresh token

---

## Step 5: Interactive Setup Wizard

The setup continues automatically. Answer these questions:

### 5.1 AI Service Selection
```
? Select your preferred AI service:
❯ OpenAI (GPT-4/GPT-3.5)
  Google Gemini
  Both (OpenAI primary)
```

**Choose:**
- **OpenAI** if you have an API key and credits
- **Gemini** if you want free tier (60 requests/min)
- **Both** for flexibility

### 5.2 If Choosing OpenAI/Gemini
You'll be asked for your API key:
```
? Enter your OpenAI API Key: [sk-...]
```

**Get your key:**
- **OpenAI:** https://platform.openai.com/api-keys
- **Gemini:** https://makersuite.google.com/app/apikey (click "Get API Key")

### 5.3 TTS Service (Optional)
```
? Select your preferred Text-to-Speech service:
❯ Azure Speech Services (Recommended)
  Google Cloud TTS
  AWS Polly
  Skip TTS Setup
```

**Choose:** `Skip TTS Setup` (you can configure later if needed)

### 5.4 Channel Configuration
```
? Enter your channel name: [your channel name]
? Enter channel description: [description]
? Enter default video category ID (22 = People & Blogs): [22]
? Select default privacy setting: [public]
? Enter your website URL (optional): [leave blank or enter]
? Enter business email (optional): [leave blank or enter]
```

### 5.5 Content Configuration
```
? Select content types to generate:
❯◉ Tutorials
 ◉ Explainers
 ◉ List Videos
 ◯ Reviews
 ◯ Stories
```

**Select** at least 1-2 types

```
? Enter competitor channel IDs (comma-separated): [leave blank]
? Describe your target audience: [e.g., "Tech enthusiasts aged 18-35"]
? Select posting frequency:
❯ Daily
  Every other day
  3 times per week
  Weekly
```

### 5.6 Setup Complete
```
🎉 Setup completed successfully!
You can now run: npm start
```

---

## Step 6: Start the Application

### 6.1 Run the Application
```bash
npm start
```

**Expected output:**
```
🎬 YouTube Automation Agent v1.0
────────────────────────────────────────────
✅ YouTube Automation Agent running on port 3456
────────────────────────────────────────────
📊 Dashboard: http://localhost:3456
🔧 API Health: http://localhost:3456/health
📅 Schedule: http://localhost:3456/schedule
📈 Analytics: http://localhost:3456/analytics
────────────────────────────────────────────
🤖 Automation is active. Content will be generated and posted daily.
```

---

## Verify Installation

### 7.1 Check Dashboard
Open in your browser:
```
http://localhost:3456
```

You should see the YouTube Automation Agent dashboard

### 7.2 Check API Health
```bash
curl http://localhost:3456/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "initialized": true,
  "agents": ["strategy", "scriptWriter", "thumbnailDesigner", ...],
  "timestamp": "2026-06-15T..."
}
```

### 7.3 Check Logs
```bash
tail -f logs/main.log
```

Should show activity logs

### 7.4 Generate Test Content
```bash
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Top 10 JavaScript Tips", "style": "listicle"}'
```

Should return content ID and scheduled publish time

---

## Troubleshooting

### ❌ "Cannot find module" Error
```
Error: Cannot find module 'openai'
```

**Solution:** Run `npm install` again
```bash
npm install
```

### ❌ "YouTube API quota exceeded"
```
Error: YouTube API quota exceeded
```

**Solution:** 
- Check your quota: https://console.cloud.google.com/iam-admin/quotas
- Increase limits in Google Cloud Console
- Wait 24 hours for quota reset

### ❌ "Redirect URI mismatch"
```
Error: redirect_uri_mismatch
```

**Solution:**
- Make sure `redirect_uris` in `config/credentials.json` matches Google Cloud Console
- Usually should be: `["http://localhost"]`

### ❌ "Authorization code is invalid"
```
Error: invalid_grant
```

**Solution:**
- Authorization codes expire after ~10 minutes
- Run `npm run setup` again to get a new authorization URL

### ❌ "GEMINI_API_KEY missing"
```
Error: GEMINI_API_KEY not configured
```

**Solution:**
- Get free key: https://makersuite.google.com/app/apikey
- Add to `config/credentials.json` or `.env` file

### ❌ "Port 3456 already in use"
```
Error: EADDRINUSE: address already in use :::3456
```

**Solution:**
- Change PORT in `.env`: `PORT=3457`
- Or kill process: `lsof -ti:3456 | xargs kill -9`

### ❌ "Database initialization failed"
```
Error: SQLITE_CANTOPEN
```

**Solution:**
- Ensure `data/` directory exists: `mkdir -p data/`
- Check permissions: `chmod 755 data/`
- Run `npm run setup` again

---

## Next Steps

### 🎯 Daily Usage

#### View Content Schedule
```bash
curl http://localhost:3456/schedule
```

#### Get Analytics
```bash
curl http://localhost:3456/analytics
```

#### Generate Content Manually
```bash
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Your Video Topic",
    "style": "tutorial",
    "length": "medium"
  }'
```

#### Publish Video Immediately
```bash
curl -X POST http://localhost:3456/publish/{contentId}
```

### 🚀 Production Deployment

#### Option 1: PM2 (Recommended)
```bash
npm install -g pm2
pm2 start index.js --name "youtube-automation"
pm2 save
pm2 startup
```

#### Option 2: Docker
```bash
docker build -t youtube-automation .
docker run -p 3456:3456 youtube-automation
```

#### Option 3: VPS (DigitalOcean, Linode, AWS)
1. Create VPS (Ubuntu 20.04+)
2. SSH into server
3. Clone repository
4. Follow this guide
5. Use PM2 to keep it running

### 📊 Monitor Performance
```bash
# View logs
tail -f logs/main.log

# Check database stats
curl http://localhost:3456/health

# Monitor system
pm2 logs youtube-automation
```

### 🔄 Backup & Restore

#### Backup Configuration & Database
```bash
tar -czf backup.tar.gz config/ data/ .env
```

#### Restore from Backup
```bash
tar -xzf backup.tar.gz
npm start
```

---

## Project Structure

```
youtube-automation-agent/
├── agents/                          # Content generation AI agents
│   ├── content-strategy-agent.js
│   ├── script-writer-agent.js
│   ├── thumbnail-designer-agent.js
│   ├── seo-optimizer-agent.js
│   ├── production-management-agent.js
│   ├── publishing-scheduling-agent.js
│   └── analytics-optimization-agent.js
├── config/
│   ├── credentials.json             # Your OAuth credentials (private)
│   ├── credentials.example.json     # Template
│   └── tokens.json                  # YouTube tokens (private)
├── data/
│   ├── youtube_automation.db        # SQLite database
│   ├── production/                  # Generated videos
│   ├── scripts/                     # Generated scripts
│   ├── audio/                       # Generated audio files
│   ├── videos/                      # Final videos
│   └── captions/                    # Generated captions
├── database/
│   └── db.js                        # Database management
├── schedules/
│   └── daily-automation.js          # Automation scheduler
├── utils/
│   ├── credential-manager.js        # API key management
│   ├── logger.js                    # Logging system
│   └── ai-video-generator.js        # Video generation
├── logs/
│   └── main.log                     # Application logs
├── .env                             # Environment variables
├── index.js                         # Main application
├── setup.js                         # Setup wizard
├── package.json                     # Dependencies
├── INSTALLATION_GUIDE.md            # This file
├── SETUP_CHECKLIST.md               # Quick checklist
└── README.md                        # Project documentation
```

---

## Environment Variables (.env)

Key variables you can configure:

```env
# Application
NODE_ENV=production          # production | development
PORT=3456                    # Server port
LOG_LEVEL=info              # debug | info | warn | error

# YouTube
YOUTUBE_REGION=US
DEFAULT_PRIVACY_STATUS=public

# Content
AUTO_SHORTEN_CONTENT=true
AUTO_ADD_BACKLINKS=true
PRESERVE_FORMATTING=true
AUTO_RESIZE_IMAGES=true
MAX_IMAGE_WIDTH=1280
MAX_IMAGE_HEIGHT=720
IMAGE_QUALITY=90

# Rate Limiting
GLOBAL_RATE_LIMIT_PER_HOUR=50
DEFAULT_DELAY_BETWEEN_POSTS=60000

# Security
JWT_SECRET=generate-a-random-secret-here

# Analytics
ENABLE_ANALYTICS=true
ANALYTICS_DB_PATH=./data/analytics.db

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads

# Error Handling
RETRY_ATTEMPTS=3
RETRY_DELAY=5000
```

---

## Getting Help

### 📖 Documentation
- [README.md](README.md) - Full feature documentation
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Quick reference checklist

### 🔗 Resources
- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini Docs](https://ai.google.dev/)

### 🐛 Report Issues
- GitHub Issues: https://github.com/darkzOGx/youtube-automation-agent/issues

---

## Summary

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | Clone & Install | 5 min | ✅ |
| 2 | Google Cloud Setup | 10 min | ✅ |
| 3 | Configure Credentials | 5 min | ✅ |
| 4 | OAuth Authorization | 5 min | ✅ |
| 5 | Setup Wizard | 10 min | ✅ |
| 6 | Start Application | 2 min | ✅ |
| **Total** | | **37 min** | ✅ |

---

## Success! 🎉

Your YouTube Automation Agent is now running and ready to:
- Generate AI-powered video content
- Create eye-catching thumbnails
- Optimize SEO
- Schedule automatic uploads
- Analyze performance

**Access your dashboard:** http://localhost:3456

**Let the automation begin!** 🚀
