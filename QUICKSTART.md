# 🚀 QGX Platform - Quick Start Guide

## 📝 Demo Credentials

### Student Account
```
Email: alex.johnson@qgx.edu
Password: student123
```

### Teacher Account
```
Email: sarah.mitchell@qgx.edu
Password: teacher123
```

### Admin Account
```
Email: michael.chen@qgx.admin
Password: admin123
```

---

## 🌐 Live Site

**Production URL:** https://qgx-platform.vercel.app

**GitHub Repository:** https://github.com/PSKKarthik/qgx-platform

---

## 🔧 Local Development

### Option 1: Python (Recommended)
```bash
cd C:\Users\polis\OneDrive\Desktop\qgx-platform
python -m http.server 8000
```
Then open: http://localhost:8000/pages/index.html

### Option 2: Node.js
```bash
npx serve
```

### Option 3: Direct
Simply open `pages/index.html` in your browser

---

## 📂 File Structure

```
qgx-platform/
├── pages/          # All HTML pages
├── css/            # Stylesheets
├── js/             # JavaScript modules
├── data/           # Mock JSON data
└── public/         # Static assets
```

---

## 🔄 Deployment Workflow

### Make Changes
```bash
# Edit files in VS Code
# Save changes
```

### Deploy to Production
```bash
git add .
git commit -m "Your change description"
git push
```

**Auto-deploys to Vercel in ~30 seconds!** ✅

---

## ✅ Script Loading Order

**All dashboard pages must load scripts in this order:**

1. `main.js` - Core utilities (MUST be first)
2. `auth.js` - Authentication
3. Page-specific scripts (student.js / teacher.js / admin.js)

---

## 🎯 Features by Role

### Student
- ✅ Quiz with voice control
- ✅ XP & leveling system
- ✅ Achievement badges
- ✅ Activity heatmap
- ✅ Discussion forum

### Teacher
- ✅ AI assessment generator
- ✅ Rubric-based grading
- ✅ Student analytics
- ✅ Live class scheduling
- ✅ Report generation

### Admin
- ✅ User management
- ✅ Ghost mode detection
- ✅ System analytics
- ✅ Feature toggles
- ✅ Backup & restore
- ✅ Advanced logging

---

## 🧪 Testing Checklist

After deployment, test:
- [ ] Splash screen loads
- [ ] Login with all 3 roles
- [ ] Student quiz works
- [ ] Teacher grading works
- [ ] Admin features work
- [ ] Mobile responsive
- [ ] No console errors

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🔗 Important Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/PSKKarthik/qgx-platform
- **Live Site:** https://qgx-platform.vercel.app

---

## 💡 Quick Tips

1. **Always load main.js first** in HTML files
2. **Use defer attribute** on scripts
3. **Test locally** before pushing
4. **Git push** auto-deploys to Vercel
5. **Check browser console** for errors

---

## 📚 Documentation

- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Detailed deployment guide
- **PROJECT_STRUCTURE.md** - Complete file organization

---

**Built with ❤️ for education | QGX Platform © 2025**
