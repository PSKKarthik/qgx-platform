# QGX Platform - Project Structure & Workflow

## 📁 File Organization

```
qgx-platform/
│
├── index.html                    # Root redirect to pages/index.html
│
├── pages/                        # All HTML pages
│   ├── index.html               # Splash screen (entry point)
│   ├── login.html               # Authentication page
│   ├── student.html             # Student dashboard
│   ├── teacher.html             # Teacher dashboard
│   └── admin.html               # Admin dashboard
│
├── css/                          # Stylesheets
│   ├── splash.css               # Splash screen styles
│   ├── style.css                # Login page styles
│   └── dashboard.css            # Unified dashboard styles (all roles)
│
├── js/                           # JavaScript modules
│   ├── main.js                  # Core app controller (MUST load first)
│   ├── auth.js                  # Authentication logic
│   ├── student.js               # Student dashboard features
│   ├── teacher.js               # Teacher dashboard features
│   ├── admin.js                 # Admin core functions
│   └── admin-enhanced.js        # Advanced admin features
│
├── data/                         # Mock JSON data
│   ├── users.json               # User database
│   ├── courses.json             # Course catalog
│   ├── assessments.json         # Assessments & submissions
│   ├── timetable.json           # Class schedule
│   ├── forum.json               # Discussion threads
│   └── system.json              # System configuration
│
└── public/                       # Static assets (images, etc.)
```

---

## 🔄 Application Workflow

### 1. Entry Point Flow

```
User visits site
    ↓
index.html (root) → redirects to pages/index.html
    ↓
pages/index.html (Splash Screen)
    ↓
User clicks "START"
    ↓
pages/login.html (Role Selection)
    ↓
User selects role & enters credentials
    ↓
auth.js validates credentials
    ↓
Redirects to appropriate dashboard:
    - Student → student.html
    - Teacher → teacher.html
    - Admin → admin.html
```

### 2. Script Loading Order

**Critical: Scripts MUST load in this order on all dashboard pages:**

```html
<!-- 1. Core Application (FIRST) -->
<script src="../js/main.js" defer></script>

<!-- 2. Authentication (SECOND) -->
<script src="../js/auth.js" defer></script>

<!-- 3. Page-specific (LAST) -->
<script src="../js/student.js" defer></script>
<!-- OR -->
<script src="../js/teacher.js" defer></script>
<!-- OR -->
<script src="../js/admin.js" defer></script>
<script src="../js/admin-enhanced.js" defer></script>
```

**Why this order matters:**
- `main.js` provides: Utils, DataManager, ErrorHandler, PerformanceManager
- `auth.js` uses Utils from main.js for validation
- Role-specific scripts use both main.js utilities and auth.js data

---

## 🎯 Page-by-Page Script Requirements

### pages/index.html (Splash)
```html
<script src="../js/main.js" defer></script>
```
- Only needs main.js for basic utilities
- No authentication required

### pages/login.html (Authentication)
```html
<script src="../js/main.js" defer></script>
<script src="../js/auth.js" defer></script>
```
- main.js for utilities
- auth.js for login validation

### pages/student.html
```html
<script src="../js/main.js" defer></script>
<script src="../js/auth.js" defer></script>
<script src="../js/student.js" defer></script>
```

### pages/teacher.html
```html
<script src="../js/main.js" defer></script>
<script src="../js/auth.js" defer></script>
<script src="../js/teacher.js" defer></script>
```

### pages/admin.html
```html
<script src="../js/main.js"></script>
<script src="../js/auth.js"></script>
<script src="../js/admin.js"></script>
<script src="../js/admin-enhanced.js"></script>
```

---

## 🔐 Authentication Flow

### Login Process

1. **User Input:**
   - Selects role (student/teacher/admin)
   - Enters email and password

2. **Validation (auth.js):**
   ```javascript
   // Check credentials against users.json
   // Validate email format
   // Validate password strength
   ```

3. **Session Creation:**
   ```javascript
   // Store in localStorage:
   localStorage.setItem('userData', JSON.stringify({
       id: user.id,
       name: user.name,
       role: user.role,
       email: user.email
   }));
   ```

4. **Redirect:**
   ```javascript
   // Based on role:
   if (role === 'student') window.location.href = 'student.html';
   if (role === 'teacher') window.location.href = 'teacher.html';
   if (role === 'admin') window.location.href = 'admin.html';
   ```

### Session Verification

Each dashboard page checks:
```javascript
// In main.js - runs on page load
if (!checkLogin()) {
    window.location.href = 'login.html';
}
```

---

## 📊 Data Management

### Data Loading (main.js → DataManager)

```javascript
// On dashboard page load:
DataManager.loadMockData()
    ↓
Fetches from ../data/*.json
    ↓
Caches in AppState.cache (5min expiry)
    ↓
Exposes as window.mockData
    ↓
Role-specific scripts access via window.mockData
```

### Cache Strategy

- **Duration:** 5 minutes (300,000ms)
- **Storage:** In-memory Map (AppState.cache)
- **Expiration:** Checked on each access
- **Fallback:** Returns empty structures if fetch fails

---

## 🎨 Styling Organization

### CSS Files

1. **splash.css** - Only for pages/index.html
   - Particles animation
   - Logo effects
   - Feature cards

2. **style.css** - Only for pages/login.html
   - Role cards
   - Login forms
   - Animations

3. **dashboard.css** - ALL dashboard pages
   - Unified design system
   - CSS variables for colors
   - Component library (cards, buttons, tables, modals)
   - Responsive breakpoints
   - Student, teacher, admin specific styles

### CSS Variables (in dashboard.css)

```css
:root {
    /* Role Colors */
    --color-student: #667eea;
    --color-teacher: #f5576c;
    --color-admin: #4facfe;
    
    /* Status Colors */
    --color-success: #4ade80;
    --color-warning: #fbbf24;
    --color-danger: #f87171;
    --color-info: #60a5fa;
    
    /* Grays */
    --gray-50: #f9fafb;
    --gray-900: #111827;
}
```

---

## 🚀 Deployment Workflow

### Local Development

```bash
# Open in browser - any of these methods:

# Method 1: Python
python -m http.server 8000

# Method 2: Node.js
npx serve

# Method 3: Direct
# Open index.html in browser
```

### Git Workflow

```bash
# Make changes to files
git add .
git commit -m "Description of changes"
git push

# Vercel auto-deploys in ~30 seconds
```

### Vercel Configuration

- **Build Command:** None (static site)
- **Output Directory:** `./`
- **Routes:** Handled by vercel.json
- **Auto-deploy:** Every push to main branch

---

## 🧪 Testing Workflow

### 1. Test Splash Screen
- Visit: `http://localhost:8000/pages/index.html`
- ✅ Particles animating
- ✅ Logo visible
- ✅ START button navigates to login

### 2. Test Login
- Visit: `http://localhost:8000/pages/login.html`
- ✅ All 3 role cards visible
- ✅ Forms appear on role selection
- ✅ Validation works

### 3. Test Student Dashboard
- Login: alex.johnson@qgx.edu / student123
- ✅ Profile loads with XP
- ✅ Timetable displays
- ✅ Quiz system works
- ✅ Voice control toggles
- ✅ Heatmap renders

### 4. Test Teacher Dashboard
- Login: sarah.mitchell@qgx.edu / teacher123
- ✅ Assessment creator works
- ✅ Grading system functional
- ✅ Reports generate
- ✅ Live class scheduler works

### 5. Test Admin Dashboard
- Login: michael.chen@qgx.admin / admin123
- ✅ User management CRUD works
- ✅ System stats display
- ✅ Feature toggles work
- ✅ Ghost alerts show
- ✅ Analytics render
- ✅ Backup/restore works
- ✅ Logs filterable

---

## 🔧 Common Issues & Fixes

### Issue: "ReferenceError: Utils is not defined"
**Fix:** main.js not loaded or loaded after other scripts
```html
<!-- Wrong order -->
<script src="../js/student.js" defer></script>
<script src="../js/main.js" defer></script>

<!-- Correct order -->
<script src="../js/main.js" defer></script>
<script src="../js/student.js" defer></script>
```

### Issue: "Cannot read property 'mockData' of undefined"
**Fix:** Data not loaded yet
```javascript
// Wait for data to load
window.addEventListener('DOMContentLoaded', async () => {
    await window.app.loadMockData();
    // Now use window.mockData
});
```

### Issue: Dashboard redirects to login immediately
**Fix:** Session not saved properly
```javascript
// In auth.js after successful login
localStorage.setItem('userData', JSON.stringify(user));
```

### Issue: CSS not applying
**Fix:** Check file path and dashboard.css loaded
```html
<link rel="stylesheet" href="../css/dashboard.css">
```

---

## 📦 Dependencies

### External Libraries (CDN)

- **Font Awesome 6.5.1**
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  ```

### Browser APIs Used

- **localStorage** - Session persistence
- **sessionStorage** - Transition states
- **fetch API** - Load JSON data
- **Web Speech API** - Voice control (student quiz)
- **IntersectionObserver** - Lazy loading images

---

## 🎯 Key Features by Role

### Student Features
- XP & Leveling system (10 levels)
- Achievement badges (10 types)
- Quiz system with voice control
- Activity heatmap (12 months)
- Progress tracking
- Discussion forum
- Timetable with live classes

### Teacher Features
- AI Assessment Generator
- Rubric-based grading (4 criteria)
- Student progress analytics
- Live class scheduling (Zoom/Teams/Meet)
- Report generation with PDF export
- Bulk grading
- Forum moderation

### Admin Features
- User management (CRUD operations)
- Ghost mode detection (AI-powered)
- System analytics dashboard
- Feature toggles (8 features)
- Backup & restore
- Advanced logging with filters
- Security monitoring
- Platform statistics

---

## 🔒 Security Notes

- Passwords stored in plain text (demo only - use bcrypt in production)
- No HTTPS required for local dev
- Session stored in localStorage (use httpOnly cookies in production)
- Input sanitization via Utils.sanitizeInput()
- XSS prevention in place

---

## 📱 Responsive Breakpoints

```css
/* Desktop First */
@media (max-width: 1200px) { /* Tablet Large */ }
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Mobile Large */ }
@media (max-width: 480px)  { /* Mobile */ }
@media (max-width: 360px)  { /* Mobile Small */ }
```

---

## 🎨 Design System

### Color Palette
- **Student:** Purple gradient (#667eea → #764ba2)
- **Teacher:** Pink gradient (#f5576c → #f093fb)
- **Admin:** Blue gradient (#4facfe → #00f2fe)

### Typography
- **Font:** Apple SF Pro Display
- **Headings:** 600 weight
- **Body:** 400 weight
- **Sizes:** 12px - 32px scale

### Components
- Widget cards with hover effects
- Gradient buttons with icons
- Modal dialogs with backdrop
- Toast notifications (4 types)
- Loading spinners
- Badge indicators
- Sortable data tables
- Form controls

---

**Last Updated:** December 27, 2025
**Version:** 1.0.0
**Status:** Production Ready ✅
