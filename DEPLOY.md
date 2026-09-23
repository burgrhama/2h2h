# 🚀 Deployment Guide

Your "2 HIGH 2 HANDLE" game is ready to deploy! Here are your options:

---

## Option 1: Vercel (Recommended - Free)

### Prerequisites
- Vercel account (free at vercel.com)
- GitHub account with your code pushed

### Steps
1. Push to GitHub:
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/2high2handle.git
git push -u origin main
```

2. Visit https://vercel.com/new
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"
6. Your site is live! 🎉

### Custom Domain
- Add your domain in Vercel dashboard
- Point DNS to Vercel nameservers

---

## Option 2: Netlify (Free)

### Quick Deploy
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Or use GitHub
1. Push code to GitHub
2. Visit https://netlify.com
3. Click "New site from Git"
4. Select your repo
5. Auto-detects build settings
6. Deploy!

---

## Option 3: Docker Deployment

### Build Image
```bash
docker build -t 2high2handle:latest .
```

### Run Locally
```bash
docker run -p 3000:3000 2high2handle:latest
```

Visit http://localhost:3000

### Deploy to Cloud
**AWS ECS** | **Google Cloud Run** | **Azure Container Instances** | **DigitalOcean App Platform**

Example (Google Cloud Run):
```bash
docker build -t gcr.io/YOUR_PROJECT/2high2handle .
docker push gcr.io/YOUR_PROJECT/2high2handle
gcloud run deploy 2high2handle --image gcr.io/YOUR_PROJECT/2high2handle
```

---

## Option 4: Railway.app (Easiest for beginners)

1. Visit https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway auto-detects Node app
5. Click "Deploy"
6. Get instant live URL
7. Free tier available

---

## Option 5: Render.com (Free tier)

1. Visit https://render.com
2. Create new "Web Service"
3. Connect GitHub repo
4. Build command: `npm run build`
5. Start command: `npm start`
6. Deploy

---

## Option 6: Self-Hosted (Advanced)

### VPS on DigitalOcean / Linode / Hetzner

```bash
# SSH into server
ssh root@your_server_ip

# Install Node
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone https://github.com/YOUR/2high2handle.git
cd 2high2handle

# Install & build
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "2high2handle"
pm2 startup
pm2 save

# Use Nginx as reverse proxy
sudo apt install nginx
# Configure to proxy :3000
sudo systemctl start nginx
```

---

## RECOMMENDED: Deploy to Vercel (30 seconds)

**Most suitable for your use case:**

1. **Fastest deployment**: Automatic deploys on every git push
2. **No credit card needed**: Free tier covers your traffic
3. **Built-in analytics**: Monitor your game usage
4. **Environment variables**: Easy secret management
5. **Preview deployments**: Test before going live
6. **Global CDN**: Ultra-fast anywhere in the world
7. **Custom domain**: Add your own domain instantly

### Quick Steps:
```bash
# 1. Create GitHub repo
# 2. Push your code
git push origin main

# 3. Visit vercel.com/new
# 4. Import from GitHub
# 5. Click "Deploy"
# 6. Done! Your URL appears instantly
```

**Your deployed URL will look like:**
```
https://2high2handle.vercel.app
https://2high2handle-YOUR-USERNAME.vercel.app
https://your-custom-domain.com
```

---

## Environment Variables

If you add Supabase later, create `.env.production`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### In Vercel Dashboard:
Settings → Environment Variables → Add your keys

---

## Performance Optimization

Your app is already optimized:
- ✅ 308KB JS (94KB gzipped)
- ✅ CSS-in-JS with Tailwind (built-in)
- ✅ Lazy component loading ready
- ✅ Image optimization ready
- ✅ Font optimization included

---

## Monitor After Deployment

### Vercel Analytics
- View page load times
- Monitor real user metrics
- Track deployment history

### Netlify Analytics
- Unique visitors
- Traffic sources
- Popular pages

---

## Next Steps After Deployment

1. **Test the live URL** - Create room, join from another tab
2. **Share the link** - Send to friends to play
3. **Add custom domain** (optional)
4. **Set up Supabase** (for real multiplayer)
5. **Monitor analytics** - See how many people play

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Docker Guide**: https://docs.docker.com

---

**Status**: Ready to deploy! Pick your option above and go live in minutes. 🚀💜
