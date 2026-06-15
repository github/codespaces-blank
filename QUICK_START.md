# ⚡ Quick Start Guide - YouTube Automation Agent

**Complete setup in 10 minutes!**

## 🚀 Quick Setup (TL;DR)

```bash
# 1. Install
npm install

# 2. Get YouTube OAuth (from Google Cloud Console)
# → https://console.cloud.google.com/
# → Create project → Enable YouTube Data API v3
# → Create OAuth Desktop credentials

# 3. Configure
cp config/credentials.example.json config/credentials.json
# Edit config/credentials.json with your OAuth credentials

# 4. Setup (interactive wizard)
npm run setup
# Follow the prompts:
#   - Paste authorization URL in browser
#   - Copy authorization code back to terminal
#   - Choose AI provider (OpenAI or Gemini)
#   - Configure channel settings

# 5. Start
npm start
# Visit: http://localhost:3456
```

---

## 📋 Commands Quick Reference

```bash
# Installation
npm install              # Install all dependencies

# Setup & Configuration
npm run setup            # Interactive setup wizard
npm run credentials:setup # Setup credentials only

# Running
npm start                # Start main application
npm run dev              # Development mode with hot reload

# Individual Agents
npm run agent:strategy   # Run content strategy agent
npm run agent:script     # Run script writer agent
npm run agent:thumbnail  # Run thumbnail designer agent
npm run agent:seo        # Run SEO optimizer agent
npm run agent:production # Run production agent
npm run agent:publishing # Run publishing agent
npm run agent:analytics  # Run analytics agent

# Workflows
npm run workflow:daily   # Run daily content pipeline
npm run workflow:weekly  # Run weekly strategy review

# Database
npm run db:init          # Initialize database

# Testing
npm test                 # Run tests
```

---

## 🔗 Important URLs

| Purpose | URL |
|---------|-----|
| Dashboard | http://localhost:3456 |
| Health Check | http://localhost:3456/health |
| Schedule | http://localhost:3456/schedule |
| Analytics | http://localhost:3456/analytics |
| Google Cloud | https://console.cloud.google.com/ |
| YouTube API Docs | https://developers.google.com/youtube/v3 |

---

## 🔑 Get Your API Keys

### YouTube OAuth (Required)
1. Visit: https://console.cloud.google.com/
2. Create project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials (Desktop app)
5. Download JSON file
6. Extract `client_id` and `client_secret`

### OpenAI (Optional - Recommended)
1. Visit: https://platform.openai.com/api-keys
2. Create API key
3. Add $5-10 credits
4. Use in setup wizard

### Google Gemini (Free Alternative)
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Get API Key"
3. Use in setup wizard (FREE tier: 60 req/min)

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `index.js` | Main application |
| `setup.js` | Interactive setup wizard |
| `config/credentials.json` | OAuth credentials (YOUR FILE) |
| `config/tokens.json` | YouTube refresh tokens (AUTO-CREATED) |
| `.env` | Environment configuration |
| `data/youtube_automation.db` | SQLite database |
| `logs/main.log` | Application logs |

---

## ✅ Verify Installation

```bash
# Check application health
curl http://localhost:3456/health

# View logs
tail -f logs/main.log

# Check database
ls -lh data/youtube_automation.db

# Test content generation
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Test Topic", "style": "tutorial"}'
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `Cannot find module` | Run `npm install` |
| `Port 3456 already in use` | Change PORT in `.env` or `lsof -ti:3456 \| xargs kill -9` |
| `Authorization code invalid` | Expires in 10 min, run `npm run setup` again |
| `YouTube API quota exceeded` | Wait 24h or upgrade quota in Google Cloud |
| `GEMINI_API_KEY missing` | Get free key: https://makersuite.google.com/app/apikey |
| `Database error` | Run `mkdir -p data/` and `npm run setup` |

---

## 📖 Full Documentation

- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Complete step-by-step guide
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Checklist format
- **[README.md](README.md)** - Full feature documentation

---

## 🎯 Next Steps

After setup completes:

1. **Access Dashboard:** http://localhost:3456
2. **Generate First Video:** Use the dashboard or API
3. **View Schedule:** http://localhost:3456/schedule
4. **Check Analytics:** http://localhost:3456/analytics
5. **Deploy to Production:** See INSTALLATION_GUIDE.md

---

## 🆘 Need Help?

- Check **INSTALLATION_GUIDE.md** troubleshooting section
- Review **logs/main.log** for errors
- Visit [GitHub Issues](https://github.com/darkzOGx/youtube-automation-agent/issues)
- Check [YouTube API Docs](https://developers.google.com/youtube/v3)

---

## 💡 Pro Tips

✅ **Use Gemini API** for free tier with 60 requests/minute  
✅ **Set up PM2** for production: `pm2 start index.js`  
✅ **Enable backups:** Configure daily database backups  
✅ **Monitor logs:** `tail -f logs/main.log`  
✅ **Set realistic posting:** Start with 1 video/day to avoid quota issues  

---

**Ready to automate your YouTube channel?** 🚀

```bash
npm start
```

Visit: **http://localhost:3456**
