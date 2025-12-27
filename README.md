# QGX Learning Platform 🎓

**AI-Powered Educational Platform with Gamification & Real-Time Analytics**

A modern, interactive learning management system featuring role-based dashboards, AI-generated assessments, voice-controlled quizzes, and comprehensive analytics.

![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### For Students
- **Interactive Quizzes** with voice control support
- **XP & Leveling System** with 10 progression levels
- **Achievement Badges** for milestones
- **Activity Heatmap** showing learning patterns
- **Real-time Progress Tracking**
- **Course Timetable** with live class integration
- **Discussion Forum** for peer collaboration

### For Teachers
- **AI Assessment Generator** - Create quizzes instantly
- **Rubric-Based Grading** system
- **Student Progress Analytics**
- **Live Class Scheduling** with Zoom/Teams/Meet integration
- **Custom Report Generation** with PDF export
- **Bulk Grading** with feedback templates

### For Admins
- **User Management** with CRUD operations
- **Ghost Mode Detection** - AI-powered security alerts
- **System Analytics** dashboard
- **Feature Toggles** with confirmation dialogs
- **Backup & Restore** system
- **Advanced Logging** with filtering

## 🚀 Quick Start

### Demo Credentials

**Student Account:**
- Username: `alex.johnson@qgx.edu`
- Password: `student123`

**Teacher Account:**
- Username: `sarah.mitchell@qgx.edu`
- Password: `teacher123`

**Admin Account:**
- Username: `michael.chen@qgx.admin`
- Password: `admin123`

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/qgx-platform.git
cd qgx-platform
```

2. **Open in browser:**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Or simply open pages/index.html in your browser
```

3. **Navigate to:**
```
http://localhost:8000/pages/index.html
```

## 📁 Project Structure

```
qgx-platform/
├── pages/
│   ├── index.html          # Splash screen
│   ├── login.html          # Authentication page
│   ├── student.html        # Student dashboard
│   ├── teacher.html        # Teacher dashboard
│   └── admin.html          # Admin dashboard
├── css/
│   ├── splash.css          # Splash screen styles
│   ├── style.css           # Login page styles
│   └── dashboard.css       # Unified dashboard styles (2800+ lines)
├── js/
│   ├── main.js             # Main application controller
│   ├── auth.js             # Authentication logic
│   ├── student.js          # Student features
│   ├── teacher.js          # Teacher features
│   ├── admin.js            # Admin core functions
│   └── admin-enhanced.js   # Advanced admin features
├── data/
│   ├── users.json          # User database (14 users)
│   ├── courses.json        # Course catalog (5 courses)
│   ├── assessments.json    # Assessments & submissions (20 items)
│   ├── timetable.json      # Class schedule & live sessions
│   ├── forum.json          # Discussion threads (10 threads)
│   └── system.json         # System configuration & logs
└── public/
    └── (assets directory)
```

## 🎨 Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with CSS Grid & Flexbox
- **Icons:** Font Awesome 6.5.1
- **APIs:** Web Speech API for voice control
- **Storage:** localStorage for persistence
- **Fonts:** Apple SF Pro Display system fonts

## 🔧 Core Technologies

### AI Features
- **Ghost Mode Detection** - Behavioral analysis with confidence scoring
- **AI Quiz Generation** - Auto-create assessments from topics
- **Voice Control** - Hands-free quiz navigation

### Gamification
- **XP Points System** - Earn points for activities
- **10 Level Progression** - From Beginner to Grandmaster
- **Achievement Badges** - 10+ unlockable achievements
- **Activity Heatmaps** - Visual learning patterns

### Real-Time Features
- **Live Classes** - Zoom/Teams/Meet integration
- **Instant Grading** - Rubric-based assessment
- **Push Notifications** - Real-time alerts
- **Session Management** - Auto-logout & validation

## 📊 Features Breakdown

### Student Dashboard
| Feature | Description |
|---------|-------------|
| Student Card | Profile with XP, level, and ID |
| Timetable | Weekly class schedule |
| Assessments | Upcoming quizzes and exams |
| Activity Heatmap | 12-month learning visualization |
| Quiz Interface | Full-screen with voice control |
| Forum Access | Peer discussions |

### Teacher Dashboard
| Feature | Description |
|---------|-------------|
| Assessment Creator | 4 input methods (topic, upload, manual, AI) |
| Grading System | Rubric-based with 4 criteria |
| Student Progress | Individual & class analytics |
| Live Classes | Schedule with meeting links |
| Reports | PDF export with charts |

### Admin Dashboard
| Feature | Description |
|---------|-------------|
| User Management | Create, edit, delete, role changes |
| System Stats | Real-time metrics dashboard |
| Feature Toggles | Enable/disable platform features |
| Security Monitor | Ghost alerts with confidence scores |
| Analytics | Platform usage & trends |
| Backup/Restore | Full system data export/import |
| Logs Viewer | Advanced filtering by level/date |

## 🎯 User Roles

### Student
- View courses & assessments
- Take quizzes with voice control
- Track progress & XP
- Participate in forums
- Attend live classes

### Teacher
- Create & grade assessments
- Manage student progress
- Schedule live classes
- Generate reports
- Moderate discussions

### Admin
- Full user management
- System configuration
- Security monitoring
- Analytics & reporting
- Backup & restore
- Feature toggles

## 📱 Responsive Design

- **Desktop:** Full feature set (1200px+)
- **Tablet:** Optimized layout (768px - 1199px)
- **Mobile:** Touch-friendly interface (320px - 767px)
- **Breakpoints:** 1200px, 768px, 480px, 360px

## 🔐 Security Features

- **Session Management** - Auto-logout on inactivity
- **Role-Based Access** - Page-level authorization
- **Ghost Mode** - AI-powered suspicious activity detection
- **Input Sanitization** - XSS prevention
- **Secure Storage** - Encrypted localStorage

## 🎮 Gamification System

### XP Points
- Quiz Completion: 50 XP
- Perfect Score: 75 XP
- Forum Post: 10 XP
- Daily Login: 10 XP
- Week Streak: 100 XP
- Course Completion: 1000 XP

### Levels
1. Beginner (0-499 XP)
2. Learner (500-999 XP)
3. Explorer (1000-1499 XP)
4. Scholar (1500-1999 XP)
5. Expert (2000-2499 XP)
6. Master (2500-2999 XP)
7. Champion (3000-3999 XP)
8. Legend (4000-4999 XP)
9. Guru (5000-9999 XP)
10. Grandmaster (10000+ XP)

### Achievements
- 🎯 First Quiz
- 💯 Perfect Score
- 🔥 Week Streak
- ⚡ Fast Learner
- 💬 Discussion Leader
- 🌟 Top Performer
- 🏆 Study Champion
- 💻 Code Master
- 🧙 Math Wizard
- 📅 Perfect Attendance

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository to Vercel
3. Deploy (auto-detects static site)
4. Get live URL: `qgx-platform.vercel.app`

### Netlify
1. Drag & drop `qgx-platform` folder
2. Auto-deploy
3. Custom domain available

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → Deploy from branch
3. Access at `username.github.io/qgx-platform`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📦 Mock Data

The platform includes comprehensive mock data:

- **14 Users** (10 students, 3 teachers, 1 admin)
- **5 Courses** (CS, Math, Science, History, English)
- **20 Assessments** (Quizzes, assignments, exams)
- **Weekly Schedule** (Monday-Friday classes)
- **6 Live Sessions** (Zoom/Teams/Meet links)
- **10 Forum Threads** (26+ replies)
- **System Logs** (15 activity entries)

## 🎨 Design System

### Colors
- **Student:** #667eea (Purple gradient)
- **Teacher:** #f5576c (Pink gradient)
- **Admin:** #4facfe (Blue gradient)
- **Success:** #4ade80
- **Warning:** #fbbf24
- **Danger:** #f87171

### Typography
- **Font:** Apple SF Pro Display
- **Headings:** 600 weight
- **Body:** 400 weight

### Components
- Unified widget cards
- Gradient buttons
- Modal dialogs
- Toast notifications
- Loading spinners
- Badge indicators
- Data tables
- Form controls

## 🧪 Testing

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile Support
- ✅ iOS Safari
- ✅ Chrome Android
- ✅ Samsung Internet

### Features to Test
1. Login with all 3 roles
2. Quiz with voice control
3. Grading system
4. Ghost mode alerts
5. Analytics export
6. Backup/restore
7. Forum discussions
8. Live class links

## 📈 Performance

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** 90+
- **Cache Strategy:** 5-minute expiration
- **Image Optimization:** Lazy loading
- **Code Splitting:** Role-based modules

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - feel free to use for educational purposes.

## 👨‍💻 Author

QGX Platform Team - Building the future of education

## 🙏 Acknowledgments

- Font Awesome for icons
- Web Speech API for voice control
- Modern CSS for styling

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Email: support@qgx.edu (demo)

## 🔗 Links

- **Live Demo:** [qgx-platform.vercel.app](https://qgx-platform.vercel.app)
- **GitHub:** [github.com/PSKKarthik/qgx-platform](https://github.com/PSKKarthik/qgx-platform)
- **Documentation:** See docs/ folder

---

**Built with ❤️ for education | QGX Platform © 2025**
