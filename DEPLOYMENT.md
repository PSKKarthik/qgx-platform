# 🚀 QGX Platform Deployment Guide

Complete step-by-step instructions to deploy your QGX Learning Platform to the web.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub account ([signup here](https://github.com/signup))
- ✅ Git installed on your computer ([download here](https://git-scm.com/downloads))
- ✅ All project files in the `qgx-platform` folder

---

## 🔧 Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Easiest)

1. **Go to GitHub:**
   - Visit [github.com](https://github.com)
   - Click the **"+"** icon → **"New repository"**

2. **Configure Repository:**
   - **Repository name:** `qgx-platform`
   - **Description:** "AI-Powered Educational Platform with Gamification"
   - **Visibility:** Choose **Public** (for free Vercel hosting)
   - **DO NOT** initialize with README (we already have one)
   - Click **"Create repository"**

3. **Connect Your Local Files:**
   ```bash
   # Open terminal in qgx-platform folder
   cd C:\Users\polis\OneDrive\Desktop\qgx-platform
   
   # Initialize Git
   git init
   
   # Add all files
   git add .
   
   # Create initial commit
   git commit -m "Initial QGX platform launch"
   
   # Add GitHub as remote (replace YOUR_USERNAME)
   git remote add origin https://github.com/YOUR_USERNAME/qgx-platform.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### Option B: Using GitHub Desktop (User-Friendly)

1. **Download GitHub Desktop:**
   - Visit [desktop.github.com](https://desktop.github.com)
   - Install and sign in

2. **Create Repository:**
   - Click **"File"** → **"Add Local Repository"**
   - Select `qgx-platform` folder
   - Click **"Create Repository"**
   - Click **"Publish repository"**
   - Name: `qgx-platform`
   - Description: "AI-Powered Educational Platform"
   - Uncheck "Keep this code private"
   - Click **"Publish repository"**

---

## 🌐 Step 2: Deploy to Vercel

### Quick Deploy (Recommended)

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click **"Sign Up"** (use GitHub to sign in)

2. **Import Project:**
   - Click **"Add New Project"**
   - Select **"Import Git Repository"**
   - Find `qgx-platform` in the list
   - Click **"Import"**

3. **Configure Project:**
   - **Project Name:** `qgx-platform` (or customize)
   - **Framework Preset:** Select **"Other"** (static site)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** Leave empty (no build needed)
   - **Output Directory:** `./` (leave default)

4. **Deploy:**
   - Click **"Deploy"**
   - Wait 30-60 seconds
   - ✅ **Your site is live!**

5. **Get Your URL:**
   - Your site will be at: `qgx-platform.vercel.app`
   - Or custom subdomain if you changed the name
   - Vercel will show you the URL on the deployment page

---

## 🔄 Step 3: Set Up Auto-Deploy

**Good news:** Auto-deploy is already configured! 🎉

Every time you push to GitHub:
1. Vercel automatically detects the change
2. Rebuilds your site (takes ~30 seconds)
3. Publishes the updated version
4. Your live site is updated

### To Update Your Site:

```bash
# Make changes to your files
# Then commit and push:

git add .
git commit -m "Update feature X"
git push

# Vercel auto-deploys in ~30 seconds!
```

---

## ✅ Step 4: Test Your Live Site

### Desktop Testing

1. **Open Your Live URL:**
   ```
   https://qgx-platform.vercel.app
   ```

2. **Test Splash Screen:**
   - ✅ Animations working
   - ✅ START button navigates to login

3. **Test Login (3 Roles):**

   **Student:**
   - Email: `alex.johnson@qgx.edu`
   - Password: `student123`
   - ✅ Redirects to student dashboard
   - ✅ Shows XP, level, timetable, assessments

   **Teacher:**
   - Email: `sarah.mitchell@qgx.edu`
   - Password: `teacher123`
   - ✅ Redirects to teacher dashboard
   - ✅ Assessment creator works
   - ✅ Grading system functional

   **Admin:**
   - Email: `michael.chen@qgx.admin`
   - Password: `admin123`
   - ✅ Redirects to admin dashboard
   - ✅ User management works
   - ✅ System stats display

4. **Test Student Features:**
   - ✅ Click quiz → Full-screen interface
   - ✅ Voice control toggle (if microphone available)
   - ✅ Select answers and submit
   - ✅ XP updates
   - ✅ Heatmap displays

5. **Test Teacher Features:**
   - ✅ Create assessment (AI/Manual)
   - ✅ View submissions
   - ✅ Grade with rubrics
   - ✅ Schedule live class
   - ✅ Generate reports

6. **Test Admin Features:**
   - ✅ Create/edit/delete users
   - ✅ Toggle features
   - ✅ View ghost alerts
   - ✅ Generate analytics
   - ✅ Backup/restore system
   - ✅ Filter logs

### Mobile Testing

1. **Open on Phone:**
   - Visit your Vercel URL
   - Test on iOS Safari and Chrome Android

2. **Check Responsive Design:**
   - ✅ Sidebar collapses on mobile
   - ✅ Buttons are touch-friendly (44px min)
   - ✅ Text is readable (16px+)
   - ✅ Quiz interface works
   - ✅ All features accessible

3. **Test Orientation:**
   - ✅ Portrait mode
   - ✅ Landscape mode

---

## 🌍 Step 5: Share Your Platform

### Your Live URLs

**Main Site:**
```
https://qgx-platform.vercel.app
```

**Direct Pages:**
```
https://qgx-platform.vercel.app/pages/login.html
https://qgx-platform.vercel.app/pages/student.html
https://qgx-platform.vercel.app/pages/teacher.html
https://qgx-platform.vercel.app/pages/admin.html
```

### Share Options

**Email Template:**
```
Subject: Check out QGX Learning Platform!

Hi,

I've built an AI-powered educational platform with:
- Student dashboards with XP & gamification
- Teacher tools for assessments & grading
- Admin panel with analytics & security

Try it here: https://qgx-platform.vercel.app

Demo credentials in the README!
```

**Social Media:**
```
🎓 Just launched QGX Platform - an AI-powered learning management system!

✨ Features:
- Voice-controlled quizzes
- Real-time analytics
- Gamification with XP & levels
- Ghost mode security

Try it: https://qgx-platform.vercel.app

#EdTech #WebDev #AI
```

---

## 🎨 Step 6: Custom Domain (Optional)

### Add Your Own Domain

1. **Buy a Domain:**
   - Namecheap, GoDaddy, or Google Domains
   - Example: `qgxplatform.com`

2. **In Vercel:**
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter your domain
   - Follow DNS configuration steps

3. **Update DNS:**
   - Add Vercel's DNS records
   - Wait 24-48 hours for propagation

4. **Done!**
   - Your site now at: `qgxplatform.com`

---

## 📊 Step 7: Monitor Your Deployment

### Vercel Analytics (Free)

1. **Enable Analytics:**
   - Vercel Dashboard → Your Project
   - Analytics tab → Enable

2. **View Metrics:**
   - Page views
   - Visitor count
   - Performance scores
   - Error tracking

### GitHub Insights

1. **Check Commits:**
   - GitHub repo → Insights tab
   - See commit history
   - Track contributors

---

## 🔧 Troubleshooting

### Issue: Pages Return 404

**Solution:**
- Check `vercel.json` routes configuration
- Ensure all HTML files are in `pages/` folder
- Redeploy: `git push`

### Issue: CSS Not Loading

**Solution:**
- Check file paths in HTML (should be `../css/`)
- Clear browser cache (Ctrl+Shift+R)
- Check Vercel build logs

### Issue: JSON Files Not Loading

**Solution:**
- Verify files exist in `data/` folder
- Check console for CORS errors
- Ensure paths in main.js are correct: `../data/`

### Issue: Login Not Working

**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify `auth.js` is loaded
- Check localStorage is enabled

### Issue: Deployment Failed

**Solution:**
- Check Vercel build logs
- Ensure all files are committed to GitHub
- Verify `.gitignore` isn't excluding important files
- Try manual redeploy in Vercel dashboard

---

## 🚀 Advanced: Environment Variables

If you add API keys later:

1. **In Vercel:**
   - Settings → Environment Variables
   - Add key-value pairs

2. **Access in Code:**
   ```javascript
   const apiKey = process.env.API_KEY;
   ```

---

## 📝 Maintenance

### Regular Updates

```bash
# Weekly routine:
git add .
git commit -m "Weekly updates and bug fixes"
git push

# Vercel auto-deploys in ~30 seconds
```

### Backup Strategy

1. **GitHub = Automatic Backup**
   - Every commit is saved
   - Can rollback anytime

2. **Download Backup:**
   - GitHub repo → Code → Download ZIP

3. **Export Data:**
   - Use admin backup feature
   - Downloads `backup-YYYY-MM-DD.json`

---

## 🎯 Success Checklist

After deployment, verify:

- ✅ GitHub repository created
- ✅ All files committed and pushed
- ✅ Vercel project deployed
- ✅ Live URL accessible
- ✅ All 3 roles login successfully
- ✅ Student quiz works
- ✅ Teacher grading works
- ✅ Admin features work
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Fast loading (< 3s)
- ✅ Auto-deploy configured

---

## 🎊 You're Live!

**Congratulations!** Your QGX Platform is now live and accessible worldwide! 🌍

**What's Next?**
- Share with friends and colleagues
- Gather feedback
- Add new features
- Monitor analytics
- Build your user base

---

## 📞 Support

**Need Help?**
- GitHub Issues: Report bugs or ask questions
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Community: Stack Overflow with tag `qgx-platform`

---

**Happy Deploying! 🚀**

*QGX Platform Team*
