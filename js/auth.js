/**
 * QGX Platform - Authentication & Role Selection
 * Handles user role selection and navigation
 */

// Login as specific role
function loginAs(role) {
    // Validate role
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
        console.error('Invalid role:', role);
        return;
    }

    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }

    // Get demo user data for this role
    const userData = getDemoUser(role);

    // Save to localStorage
    localStorage.setItem('userRole', role);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('loginTime', new Date().toISOString());
    localStorage.setItem('isAuthenticated', 'true');

    // Log the login (for development)
    console.log(`Logged in as: ${role}`);
    console.log('User data:', userData);

    // Role-to-page mapping
    const rolePages = {
        student: 'student.html',
        teacher: 'teacher.html',
        admin: 'admin.html'
    };

    // Simulate loading time and redirect
    setTimeout(() => {
        window.location.href = rolePages[role];
    }, 1000);
}

// Get demo user data based on role
function getDemoUser(role) {
    const demoUsers = {
        student: {
            name: 'Alex Johnson',
            id: 'STU-2025-001',
            email: 'alex.johnson@student.qgx.com',
            xp: 1250,
            level: 5,
            photo: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=667eea&color=fff&size=128',
            class: '10-A',
            grade: '10th Grade',
            completedTests: 12,
            averageScore: 85,
            badges: ['Fast Learner', 'Perfect Score', 'Consistent'],
            courses: ['Mathematics', 'Physics', 'Chemistry', 'English']
        },
        teacher: {
            name: 'Dr. Sarah Mitchell',
            id: 'TCH-2025-042',
            email: 'sarah.mitchell@teacher.qgx.com',
            photo: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=f5576c&color=fff&size=128',
            subjects: ['Mathematics', 'Statistics'],
            classes: ['10-A', '10-B', '11-A', '12-A'],
            totalStudents: 120,
            activeAssessments: 8,
            completedAssessments: 45,
            department: 'Mathematics',
            yearsExperience: 7
        },
        admin: {
            name: 'Michael Chen',
            id: 'ADM-2025-003',
            email: 'michael.chen@admin.qgx.com',
            photo: 'https://ui-avatars.com/api/?name=Michael+Chen&background=4facfe&color=fff&size=128',
            permissions: ['all'],
            role: 'System Administrator',
            totalUsers: 450,
            totalTeachers: 35,
            totalStudents: 410,
            totalAssessments: 230,
            systemUptime: '99.8%',
            lastLogin: new Date().toISOString()
        }
    };

    return demoUsers[role] || null;
}

// Check if user is logged in (call this on dashboard pages)
function checkLogin() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    const loginTime = localStorage.getItem('loginTime');

    // If not authenticated, redirect to login
    if (!isAuthenticated || !userRole) {
        console.log('Not authenticated, redirecting to login...');
        window.location.href = 'login.html';
        return false;
    }

    // Check if session is still valid (24 hours)
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

        if (hoursDiff >= 24) {
            console.log('Session expired, redirecting to login...');
            logout();
            return false;
        }
    }

    // Load user data
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        console.log('User authenticated:', userData);
        return userData;
    }

    return true;
}

// Logout function
function logout() {
    // Clear all localStorage data
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('isAuthenticated');
    
    console.log('User logged out');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Legacy function - calls loginAs for backward compatibility
function selectRole(role) {
    loginAs(role);
}

// Check if user is already logged in
function checkAuth() {
    const userRole = localStorage.getItem('userRole');
    const loginTime = localStorage.getItem('loginTime');

    if (userRole && loginTime) {
        // Check if session is still valid (24 hours)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
            console.log('Valid session found for role:', userRole);
            return true;
        } else {
            // Session expired, clear storage
            clearAuth();
        }
    }
    return false;
}

// Clear authentication data
function clearAuth() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('isAuthenticated');
    console.log('Session cleared');
}

// Demo login function (for future implementation)
function demoLogin(username, password) {
    const demoAccounts = {
        'student@qgx.com': { password: 'student123', role: 'student' },
        'teacher@qgx.com': { password: 'teacher123', role: 'teacher' },
        'admin@qgx.com': { password: 'admin123', role: 'admin' }
    };

    const account = demoAccounts[username];
    
    if (account && account.password === password) {
        loginAs(account.role);
        return true;
    }
    
    return false;
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const roleCards = document.querySelectorAll('.role-card');
    
    // Add click event listeners to role cards
    roleCards.forEach((card) => {
        // Make cards keyboard accessible
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        // Get role from onclick attribute or data attribute
        const onclickAttr = card.getAttribute('onclick');
        let role = null;
        
        if (onclickAttr) {
            // Extract role from onclick="selectRole('student')" or onclick="loginAs('student')"
            const match = onclickAttr.match(/'([^']+)'/);
            if (match) {
                role = match[1];
            }
        }
        
        // Add keyboard event listener
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (role) {
                    loginAs(role);
                }
            }
        });

        // Add focus styles for accessibility
        card.addEventListener('focus', () => {
            card.style.outline = '2px solid #ffffff';
            card.style.outlineOffset = '4px';
        });

        card.addEventListener('blur', () => {
            card.style.outline = 'none';
        });
    });

    // Add animation to cards on scroll (for mobile)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    roleCards.forEach(card => {
        observer.observe(card);
    });

    // Add logout button functionality if it exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loginAs,
        getDemoUser,
        checkLogin,
        logout,
        selectRole,
        checkAuth,
        clearAuth,
        demoLogin
    };
}