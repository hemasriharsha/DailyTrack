# 🚀 DailyTracker Deployment Guide

## Overview
DailyTracker is a full-stack productivity application with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js API
- **Database**: SQLite (better-sqlite3)
- **Deployment**: Netlify (recommended) or Vercel

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Git installed
- Netlify or Vercel account (free tier works)

---

## 🏗️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:8080/`

### 3. Database
The SQLite database will be automatically created in the `data/` directory on first run.

---

## 🌐 Deploy to Netlify (Recommended)

### Option 1: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify**
   ```bash
   netlify init
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Git (Automatic)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Netlify will auto-detect the `netlify.toml` configuration
   - Click "Deploy site"

3. **Done!** Your site will be live at `https://your-site-name.netlify.app`

---

## 🔧 Environment Variables

For production, you can set environment variables in Netlify:

1. Go to Site settings → Environment variables
2. Add any custom variables (optional):
   - `PING_MESSAGE`: Custom ping message for health check

---

## 📊 Database Considerations

### For Netlify Deployment:
- **Note**: Netlify Functions are stateless, so SQLite data will reset on each deployment
- **Recommended**: For production, migrate to a cloud database:
  - **Turso** (SQLite-compatible, edge database) - Recommended
  - **PlanetScale** (MySQL)
  - **Supabase** (PostgreSQL)
  - **MongoDB Atlas**

### Quick Migration to Turso (SQLite Edge Database):

1. **Install Turso CLI**
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. **Create Database**
   ```bash
   turso db create dailytracker
   turso db show dailytracker
   ```

3. **Get Connection URL**
   ```bash
   turso db show dailytracker --url
   ```

4. **Update Code** (modify `server/db/index.ts` to use Turso URL)

---

## 🧪 Testing Production Build Locally

```bash
# Build the project
npm run build

# Test the production build
npm run start
```

---

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run format.fix` - Format code with Prettier

---

## 🔍 API Endpoints

### Goals
- `GET /api/goals` - Get all goals
- `GET /api/goals/archived` - Get archived goals
- `GET /api/goals/:id` - Get single goal
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Archive goal

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Archive habit
- `POST /api/habits/:id/toggle` - Toggle habit completion

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/archived` - Get archived notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Archive note

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:8080 | xargs kill
```

### Database Issues
Delete the `data/` directory and restart the server to recreate the database.

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **Backend**: Express.js, Node.js
- **Database**: SQLite (better-sqlite3)
- **Deployment**: Netlify Functions
- **State Management**: React Context API
- **HTTP Client**: Fetch API

---

## 🎯 Next Steps

1. ✅ Deploy to Netlify
2. 🔄 Migrate to cloud database (Turso recommended)
3. 🔐 Add authentication (Auth0, Clerk, or Supabase Auth)
4. 📱 Add PWA support for mobile
5. 🌙 Enhance dark mode
6. 📊 Add analytics and insights
7. 🔔 Add notifications and reminders

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 🤝 Support

For issues or questions, please create an issue in the GitHub repository.

**Happy Tracking! 🎉**
