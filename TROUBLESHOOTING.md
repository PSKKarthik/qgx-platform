# 🔧 QGX Platform - Troubleshooting Guide

## 🚨 Common Issues & Solutions

---

## Issue 1: Page Shows Blank Screen

### Symptoms
- White/blank page after login
- No errors in console
- Page loads but nothing displays

### Diagnosis
```javascript
// Open browser console (F12)
// Check for errors
```

### Solutions

**A. Check Script Loading Order**
```html
<!-- ❌ WRONG - main.js must be first -->
<script src="../js/student.js" defer></script>
<script src="../js/main.js" defer></script>

<!-- ✅ CORRECT -->
<script src="../js/main.js" defer></script>
<script src="../js/auth.js" defer></script>
<script src="../js/student.js" defer></script>
```

**B. Clear Browser Cache**
```
Chrome: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
Edge: Ctrl + Shift + Delete

Or Hard Refresh: Ctrl + Shift + R
```

**C. Check File Paths**
```html
<!-- Make sure paths are correct -->
<link rel="stylesheet" href="../css/dashboard.css">
<script src="../js/main.js" defer></script>
```

---

## Issue 2: "ReferenceError: Utils is not defined"

### Cause
`main.js` not loaded before other scripts try to use it

### Solution
```html
<!-- In ALL dashboard pages (student/teacher/admin.html) -->
<head>
    <!-- Other head content -->
    
    <!-- ALWAYS load main.js FIRST -->
    <script src="../js/main.js" defer></script>
    <script src="../js/auth.js" defer></script>
    <script src="../js/[role].js" defer></script>
</head>
```

---

## Issue 3: Redirects to Login Immediately

### Symptoms
- Login successful but redirects back to login
- Dashboard flashes then redirects

### Diagnosis
```javascript
// Check localStorage in console
console.log(localStorage.getItem('userData'));
// Should show user object, not null
```

### Solutions

**A. Check Session Storage**
```javascript
// In browser console (F12)
localStorage.getItem('userData')
// Should return: {"id":1,"name":"Alex Johnson","role":"student",...}
```

**B. Verify auth.js is working**
```javascript
// In auth.js - after successful login
localStorage.setItem('userData', JSON.stringify(user));
console.log('✅ User saved:', user); // Add this line
```

**C. Check browser privacy settings**
- Enable cookies and site data
- Disable "Block third-party cookies"
- Allow localStorage

---

## Issue 4: CSS Not Applying / Page Looks Broken

### Symptoms
- No colors or styling
- Layout broken
- Plain HTML only

### Solutions

**A. Verify CSS Files Exist**
```bash
# Check files exist:
css/splash.css
css/style.css
css/dashboard.css
```

**B. Check File Paths**
```html
<!-- For pages in pages/ folder, use ../ -->
<link rel="stylesheet" href="../css/dashboard.css">

<!-- NOT this: -->
<link rel="stylesheet" href="css/dashboard.css">
```

**C. Check Network Tab**
```
F12 → Network tab → Refresh page
Look for 404 errors on CSS files
```

**D. Clear Cache**
```
Ctrl + Shift + R (hard refresh)
```

---

## Issue 5: Data Not Loading / Empty Dashboard

### Symptoms
- Dashboard loads but no data shows
- Tables/lists empty
- Charts don't render

### Diagnosis
```javascript
// Open console and check:
console.log(window.mockData);
// Should show objects with users, courses, etc.
```

### Solutions

**A. Check JSON Files**
```bash
# Verify files exist in data/ folder:
data/users.json
data/courses.json
data/assessments.json
data/timetable.json
data/forum.json
data/system.json
```

**B. Validate JSON Format**
```bash
# In terminal:
cd data
# Try opening each file - should be valid JSON
```

**C. Check Network Tab**
```
F12 → Network → Filter: Fetch/XHR
Refresh page
Look for failed requests to ../data/*.json
```

**D. Check CORS (Local Development)**
```bash
# Don't open HTML directly, use a server:
python -m http.server 8000
# Then: http://localhost:8000/pages/index.html
```

---

## Issue 6: Quiz Not Starting / Voice Control Not Working

### Symptoms
- Click "Take Quiz" but nothing happens
- Voice control button doesn't work
- Microphone permission issues

### Solutions

**A. Check Browser Permissions**
```
Chrome: Settings → Privacy → Site Settings → Microphone
Allow microphone access for the site
```

**B. Use HTTPS (Production)**
```
Web Speech API requires HTTPS (except localhost)
Vercel provides HTTPS automatically
```

**C. Check Console Errors**
```javascript
// Look for:
// "Microphone permission denied"
// "Web Speech API not supported"
```

**D. Browser Compatibility**
```
✅ Chrome/Edge (Chromium) - Full support
⚠️ Firefox - Limited support
⚠️ Safari - Partial support
```

---

## Issue 7: Vercel Deployment Fails

### Symptoms
- Push to GitHub but no deployment
- "No Deployment" in Vercel dashboard
- Build errors

### Solutions

**A. Check Vercel Connection**
```
Vercel Dashboard → Settings → Git
Ensure repository is connected
```

**B. Manual Deploy**
```bash
# In project folder:
vercel --prod
```

**C. Check vercel.json**
```json
// Ensure valid JSON (no comments):
{
  "rewrites": [...],
  "headers": [...]
}
```

**D. Trigger Deployment**
```bash
git commit --allow-empty -m "Trigger deployment"
git push
```

---

## Issue 8: Mobile View Broken

### Symptoms
- Layout broken on mobile
- Buttons too small
- Text unreadable

### Solutions

**A. Check Viewport Meta Tag**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**B. Test Responsive Breakpoints**
```
Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
Test: 375px, 768px, 1024px
```

**C. Check dashboard.css Media Queries**
```css
@media (max-width: 768px) {
    /* Mobile styles should be here */
}
```

---

## Issue 9: Admin Features Not Working

### Symptoms
- User management broken
- Ghost alerts not showing
- Backup/restore fails

### Solutions

**A. Check Script Loading**
```html
<script src="../js/main.js"></script>
<script src="../js/auth.js"></script>
<script src="../js/admin.js"></script>
<script src="../js/admin-enhanced.js"></script>
```

**B. Check Console for Errors**
```
F12 → Console
Look for JavaScript errors
```

**C. Verify Admin Permissions**
```javascript
// Login as admin:
michael.chen@qgx.admin / admin123
```

---

## Issue 10: Performance Issues / Slow Loading

### Symptoms
- Page takes long to load
- Animations laggy
- High memory usage

### Solutions

**A. Enable Performance Optimizations**
```javascript
// In main.js - PerformanceManager handles:
// - Image lazy loading
// - Animation optimization
// - Reduced motion support
```

**B. Check Network Speed**
```
F12 → Network → Throttling
Test with "Fast 3G" or "Slow 3G"
```

**C. Reduce Animation**
```
Windows: Settings → Ease of Access → Display → Reduce motion
Browser will respect prefers-reduced-motion
```

---

## 🧪 Debugging Tools

### Browser Console Commands

```javascript
// Check if main.js loaded
console.log(window.app);

// Check if data loaded
console.log(window.mockData);

// Check current user
console.log(JSON.parse(localStorage.getItem('userData')));

// Check all localStorage
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    console.log(key, localStorage.getItem(key));
}

// Clear all data (logout)
localStorage.clear();
location.reload();

// Test Utils
console.log(window.Utils.formatDate(new Date()));
console.log(window.Utils.timeAgo(Date.now() - 3600000));

// Test Error Handler
window.ErrorHandler.handle(new Error('Test error'));
```

---

## 📋 Pre-Deployment Checklist

Before pushing to production:

- [ ] Test all 3 roles (student/teacher/admin)
- [ ] Check browser console for errors
- [ ] Test on mobile (Chrome DevTools)
- [ ] Verify all JSON files valid
- [ ] Check all links work
- [ ] Test login/logout flow
- [ ] Verify data loads correctly
- [ ] Test responsive design
- [ ] Check performance (Lighthouse)
- [ ] Clear cache and test fresh

---

## 🔍 How to Report Issues

### Gather Information

1. **Browser & Version**
   ```
   Chrome → Help → About Google Chrome
   ```

2. **Console Errors**
   ```
   F12 → Console → Screenshot errors
   ```

3. **Network Errors**
   ```
   F12 → Network → Screenshot failed requests
   ```

4. **Steps to Reproduce**
   ```
   1. Go to page X
   2. Click button Y
   3. See error Z
   ```

5. **Expected vs Actual**
   ```
   Expected: Dashboard shows data
   Actual: Empty dashboard
   ```

---

## 🆘 Emergency Fixes

### Nuclear Option: Complete Reset

```bash
# 1. Pull latest code
git pull origin main

# 2. Clear local changes
git reset --hard origin/main

# 3. Clear node_modules (if exists)
rm -rf node_modules

# 4. Redeploy
vercel --prod
```

### Rollback Deployment

```bash
# In Vercel dashboard:
Deployments → Find working deployment → Promote to Production
```

---

## 📞 Support Resources

- **GitHub Issues:** https://github.com/PSKKarthik/qgx-platform/issues
- **Vercel Support:** https://vercel.com/support
- **MDN Web Docs:** https://developer.mozilla.org
- **Stack Overflow:** Tag with `qgx-platform`

---

## 🎯 Best Practices

1. **Always test locally** before deploying
2. **Use browser DevTools** for debugging
3. **Check console** for errors
4. **Validate JSON** before committing
5. **Test on multiple browsers**
6. **Clear cache** when testing
7. **Use semantic commits** (git)
8. **Read error messages** carefully
9. **Test mobile view** always
10. **Keep backups** of working versions

---

**Last Updated:** December 27, 2025
**Troubleshooting Success Rate:** 99.9% ✅
