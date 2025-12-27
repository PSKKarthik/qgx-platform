/**
 * QGX Platform - Admin Dashboard Functions
 * Handles admin-specific functionality
 */

// Global variables
let allUsers = [];
let filteredUsers = [];
let systemSettings = {};

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const userData = checkLogin();
    
    if (userData && userData.role === 'admin') {
        // Load admin data
        loadAdminData();
        
        // Load dashboard widgets
        loadActiveUsers();
        loadSecurityAlerts();
        loadAllUsers();
        loadSystemSettings();
        
        // Initialize dashboard features
        initializeDashboard();
    } else {
        // Redirect non-admin users
        window.location.href = 'login.html';
    }
});

// Load admin data
function loadAdminData() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!userData || !userData.name) {
        console.error('No admin data found');
        return;
    }
    
    // Update profile elements
    updateElement('profileName', userData.name);
    updateElement('profileId', userData.id);
    updateElement('welcomeName', userData.name.split(' ')[0]);
    
    // Set profile photo
    const profilePhoto = document.getElementById('profilePhoto');
    if (profilePhoto && userData.photo) {
        const img = profilePhoto.querySelector('img');
        if (img) img.src = userData.photo;
    }
    
    // Load system stats
    if (typeof loadSystemStats === 'function') {
        loadSystemStats();
    }
    
    console.log('Admin data loaded:', userData);
}

// Helper function to update DOM elements
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Navigate between views
function navigateTo(view) {
    // Hide all views
    const views = document.querySelectorAll('.view-container');
    views.forEach(v => v.classList.remove('active'));
    
    // Show selected view
    const viewMap = {
        'dashboard': 'dashboardView',
        'user-management': 'userManagementView',
        'course-management': 'courseManagementView',
        'system-settings': 'systemSettingsView',
        'security-monitor': 'securityMonitorView',
        'forum-moderation': 'forumModerationView',
        'analytics': 'analyticsView',
        'backup': 'backupView',
        'logs': 'logsView'
    };
    
    const viewId = viewMap[view] || 'dashboardView';
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    if (event && event.target) {
        const navItem = event.target.closest('.nav-item');
        if (navItem) navItem.classList.add('active');
    }
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
    
    // Load view-specific data
    if (view === 'security-monitor') {
        loadSecurityMonitor();
    } else if (view === 'analytics') {
        loadAnalytics();
    } else if (view === 'backup') {
        loadBackups();
    } else if (view === 'logs') {
        loadSystemLogs();
    }
    
    console.log(`Navigated to: ${view}`);
}

// Load active users
function loadActiveUsers() {
    const activeUsers = [
        { name: 'Alex Johnson', role: 'Student', activity: 'Taking Quiz', time: '2 mins ago' },
        { name: 'Emma Davis', role: 'Student', activity: 'Viewing Course', time: '5 mins ago' },
        { name: 'Dr. Sarah Mitchell', role: 'Teacher', activity: 'Grading Assignments', time: '8 mins ago' },
        { name: 'Michael Chen', role: 'Student', activity: 'Forum Discussion', time: '12 mins ago' },
        { name: 'Prof. John Smith', role: 'Teacher', activity: 'Creating Assessment', time: '15 mins ago' }
    ];
    
    const container = document.getElementById('activeUsersContent');
    if (!container) return;
    
    container.innerHTML = activeUsers.map(user => `
        <div class="activity-item">
            <div class="activity-icon success">
                <i class="fas fa-${user.role === 'Teacher' ? 'chalkboard-teacher' : 'user-graduate'}"></i>
            </div>
            <div class="activity-details">
                <h4>${user.name}</h4>
                <p>${user.activity}</p>
                <span class="activity-time">${user.time}</span>
            </div>
        </div>
    `).join('');
    
    updateElement('activeUserCount', activeUsers.length);
}

// Load security alerts
function loadSecurityAlerts() {
    const alerts = [
        { type: 'warning', message: 'Multiple failed login attempts from IP 192.168.1.100', time: '30 mins ago' },
        { type: 'info', message: 'Ghost Mode activated by user STU-2025-015', time: '1 hour ago' },
        { type: 'warning', message: 'Unusual API call pattern detected', time: '2 hours ago' }
    ];
    
    const container = document.getElementById('securityAlertsContent');
    if (!container) return;
    
    container.innerHTML = alerts.map(alert => `
        <div class="activity-item">
            <div class="activity-icon ${alert.type}">
                <i class="fas fa-${alert.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="activity-details">
                <p>${alert.message}</p>
                <span class="activity-time">${alert.time}</span>
            </div>
        </div>
    `).join('');
    
    updateElement('securityAlerts', alerts.length);
}

// Update usage stats
function updateUsageStats(days) {
    console.log(`Loading usage stats for last ${days} days`);
    // In a real app, this would fetch data from the server
}

// User Management Functions
function loadAllUsers() {
    // Generate mock users
    allUsers = [];
    const roles = ['student', 'teacher', 'admin'];
    const statuses = ['active', 'inactive', 'suspended'];
    
    for (let i = 1; i <= 50; i++) {
        const role = roles[Math.floor(Math.random() * roles.length)];
        allUsers.push({
            id: `${role.substring(0, 3).toUpperCase()}-2025-${String(i).padStart(3, '0')}`,
            name: `User ${i}`,
            email: `user${i}@qgx.com`,
            role: role,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastLogin: `2025-12-${String(Math.floor(Math.random() * 26) + 1).padStart(2, '0')}`
        });
    }
    
    filteredUsers = [...allUsers];
    displayUsers();
}

function displayUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td><input type="checkbox" class="user-checkbox" value="${user.id}"></td>
            <td>
                <div class="user-cell">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=32" alt="${user.name}" class="user-avatar-small">
                    <div>
                        <div class="user-name">${user.name}</div>
                        <div class="user-id">${user.id}</div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${user.role}</span></td>
            <td><span class="status-badge ${user.status}">${user.status}</span></td>
            <td>${user.lastLogin}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editUser('${user.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteUser('${user.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="action-btn" onclick="viewUserDetails('${user.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterUsers(searchQuery) {
    const roleFilter = document.getElementById('roleFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const query = searchQuery || document.getElementById('userSearch')?.value || '';
    
    filteredUsers = allUsers.filter(user => {
        const matchesSearch = !query || 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.id.toLowerCase().includes(query.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });
    
    displayUsers();
}

function selectAllUsers(checkbox) {
    const checkboxes = document.querySelectorAll('.user-checkbox');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) modal.classList.add('active');
}

function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.classList.remove('active');
        // Clear form
        document.getElementById('newUserName').value = '';
        document.getElementById('newUserEmail').value = '';
        document.getElementById('newUserPassword').value = '';
        document.getElementById('newUserRole').value = 'student';
    }
}

function createUser() {
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const role = document.getElementById('newUserRole').value;
    const password = document.getElementById('newUserPassword').value;
    
    if (!name || !email || !password) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newUser = {
        id: `${role.substring(0, 3).toUpperCase()}-2025-${String(allUsers.length + 1).padStart(3, '0')}`,
        name: name,
        email: email,
        role: role,
        status: 'active',
        lastLogin: new Date().toISOString().split('T')[0]
    };
    
    allUsers.push(newUser);
    filteredUsers = [...allUsers];
    displayUsers();
    closeAddUserModal();
    
    alert(`User created successfully!\n\nName: ${name}\nEmail: ${email}\nRole: ${role}\nID: ${newUser.id}`);
}

function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        alert(`Edit User\n\nUser: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\n\nEdit functionality will be implemented here.`);
    }
}

function deleteUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user && confirm(`Are you sure you want to delete ${user.name}?`)) {
        allUsers = allUsers.filter(u => u.id !== userId);
        filteredUsers = filteredUsers.filter(u => u.id !== userId);
        displayUsers();
        alert('User deleted successfully');
    }
}

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        alert(`User Details\n\nName: ${user.name}\nID: ${user.id}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}\nLast Login: ${user.lastLogin}`);
    }
}

function bulkActions() {
    const selected = Array.from(document.querySelectorAll('.user-checkbox:checked')).map(cb => cb.value);
    
    if (selected.length === 0) {
        alert('Please select users first');
        return;
    }
    
    const action = prompt(`${selected.length} users selected.\n\nChoose action:\n1. Activate\n2. Deactivate\n3. Suspend\n4. Delete\n\nEnter number:`);
    
    if (action) {
        alert(`Bulk action will be applied to ${selected.length} users`);
    }
}

// System Settings Functions
function loadSystemSettings() {
    // Load from localStorage or use defaults
    systemSettings = JSON.parse(localStorage.getItem('systemSettings') || JSON.stringify({
        ghostMode: true,
        voiceControl: true,
        aiGeneration: true,
        maintenanceMode: false,
        xpPerAnswer: 10,
        xpPerfectScore: 50,
        xpDailyBonus: 5,
        xpStreakMultiplier: 1.5
    }));
    
    // Update UI
    Object.keys(systemSettings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = systemSettings[key];
                // Add change listener for toggles
                if (typeof toggleFeature === 'function') {
                    element.addEventListener('change', (e) => {
                        toggleFeature(key, e.target.checked);
                    });
                }
            } else {
                element.value = systemSettings[key];
            }
        }
    });
}

function saveSystemSettings() {
    // Collect all settings
    const settings = {
        ghostMode: document.getElementById('ghostMode')?.checked,
        voiceControl: document.getElementById('voiceControl')?.checked,
        aiGeneration: document.getElementById('aiGeneration')?.checked,
        maintenanceMode: document.getElementById('maintenanceMode')?.checked,
        xpPerAnswer: parseInt(document.getElementById('xpPerAnswer')?.value || 10),
        xpPerfectScore: parseInt(document.getElementById('xpPerfectScore')?.value || 50),
        xpDailyBonus: parseInt(document.getElementById('xpDailyBonus')?.value || 5),
        xpStreakMultiplier: parseFloat(document.getElementById('xpStreakMultiplier')?.value || 1.5)
    };
    
    // Save to localStorage
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    systemSettings = settings;
    
    alert('System settings saved successfully!\n\nThe changes will take effect immediately.');
}

function loadEmailTemplate(type) {
    const templates = {
        'welcome': {
            subject: 'Welcome to QGX Platform',
            body: 'Welcome to QGX Platform! We\'re excited to have you on board.'
        },
        'password-reset': {
            subject: 'Password Reset Request',
            body: 'You have requested to reset your password. Click the link below to continue.'
        },
        'grade-notification': {
            subject: 'New Grade Posted',
            body: 'Your teacher has posted a new grade for your recent assessment.'
        },
        'assessment-reminder': {
            subject: 'Assessment Reminder',
            body: 'This is a reminder that you have an upcoming assessment due soon.'
        }
    };
    
    const template = templates[type];
    if (template) {
        document.getElementById('emailSubject').value = template.subject;
        document.getElementById('emailBody').value = template.body;
    }
}

// Security Monitor Functions
function loadSecurityMonitor() {
    loadGhostModeActivity();
    loadLoginAttempts();
    loadSuspiciousActivity();
    loadRecentActions();
}

function loadGhostModeActivity() {
    const activities = [
        { user: 'STU-2025-015', action: 'Enabled Ghost Mode', time: '1 hour ago', duration: '45 mins' },
        { user: 'STU-2025-023', action: 'Enabled Ghost Mode', time: '3 hours ago', duration: '1.5 hours' },
        { user: 'STU-2025-008', action: 'Disabled Ghost Mode', time: '5 hours ago', duration: '30 mins' }
    ];
    
    const container = document.getElementById('ghostModeActivity');
    if (!container) return;
    
    container.innerHTML = activities.map(activity => `
        <div class="log-item">
            <div class="log-header">
                <span class="log-user">${activity.user}</span>
                <span class="log-time">${activity.time}</span>
            </div>
            <div class="log-content">${activity.action} • Duration: ${activity.duration}</div>
        </div>
    `).join('');
}

function loadLoginAttempts() {
    const attempts = [
        { ip: '192.168.1.100', user: 'STU-2025-001', status: 'success', time: '10 mins ago' },
        { ip: '192.168.1.100', user: 'unknown', status: 'failed', time: '15 mins ago' },
        { ip: '192.168.1.100', user: 'unknown', status: 'failed', time: '20 mins ago' },
        { ip: '10.0.0.50', user: 'TCH-2025-042', status: 'success', time: '25 mins ago' }
    ];
    
    const container = document.getElementById('loginAttempts');
    if (!container) return;
    
    container.innerHTML = attempts.map(attempt => `
        <div class="log-item">
            <div class="log-header">
                <span class="log-user">${attempt.ip}</span>
                <span class="status-badge ${attempt.status}">${attempt.status}</span>
            </div>
            <div class="log-content">User: ${attempt.user} • ${attempt.time}</div>
        </div>
    `).join('');
}

function loadSuspiciousActivity() {
    const activities = [
        { type: 'API Abuse', description: 'Unusual API call pattern detected', severity: 'medium', time: '2 hours ago' },
        { type: 'Data Access', description: 'Unauthorized access attempt to admin panel', severity: 'high', time: '6 hours ago' }
    ];
    
    const container = document.getElementById('suspiciousActivity');
    if (!container) return;
    
    container.innerHTML = activities.map(activity => `
        <div class="log-item">
            <div class="log-header">
                <span class="log-user">${activity.type}</span>
                <span class="severity-badge ${activity.severity}">${activity.severity}</span>
            </div>
            <div class="log-content">${activity.description} • ${activity.time}</div>
        </div>
    `).join('');
}

function loadRecentActions() {
    const actions = [
        { admin: 'ADM-2025-001', action: 'Created new user', target: 'STU-2025-051', time: '30 mins ago' },
        { admin: 'ADM-2025-003', action: 'Updated system settings', target: 'Ghost Mode', time: '1 hour ago' },
        { admin: 'ADM-2025-001', action: 'Deleted user', target: 'STU-2025-050', time: '3 hours ago' }
    ];
    
    const container = document.getElementById('recentActions');
    if (!container) return;
    
    container.innerHTML = actions.map(action => `
        <div class="log-item">
            <div class="log-header">
                <span class="log-user">${action.admin}</span>
                <span class="log-time">${action.time}</span>
            </div>
            <div class="log-content">${action.action}: ${action.target}</div>
        </div>
    `).join('');
}

function exportSecurityLogs() {
    alert('Exporting security logs...\n\nFormat: CSV\nDate Range: Last 30 days\n\nDownload will start...');
}

// Analytics Functions
function loadAnalytics() {
    loadPerformanceMetrics();
}

function loadPerformanceMetrics() {
    const metrics = [
        { label: 'Avg Response Time', value: '245ms', trend: 'positive' },
        { label: 'Database Queries/sec', value: '1,248', trend: 'neutral' },
        { label: 'Cache Hit Rate', value: '94.5%', trend: 'positive' },
        { label: 'Error Rate', value: '0.02%', trend: 'positive' }
    ];
    
    const container = document.getElementById('performanceMetrics');
    if (!container) return;
    
    container.innerHTML = metrics.map(metric => `
        <div class="metric-item">
            <div class="metric-label">${metric.label}</div>
            <div class="metric-value">${metric.value}</div>
            <div class="metric-trend ${metric.trend}">
                <i class="fas fa-arrow-${metric.trend === 'positive' ? 'up' : metric.trend === 'negative' ? 'down' : 'right'}"></i>
            </div>
        </div>
    `).join('');
}

function updateAnalytics(days) {
    console.log(`Loading analytics for last ${days} days`);
}

function exportAnalytics(format) {
    alert(`Exporting analytics...\n\nFormat: ${format.toUpperCase()}\nDownload will start...`);
}

function generateCustomReport() {
    alert('Custom Report Generator\n\nSelect metrics, date range, and visualization options to create a custom analytics report.');
}

// Backup Functions
function loadBackups() {
    const backups = [
        { id: 'BKP-001', date: '2025-12-26 02:00', size: '1.2 GB', type: 'Full', status: 'completed' },
        { id: 'BKP-002', date: '2025-12-25 02:00', size: '1.1 GB', type: 'Full', status: 'completed' },
        { id: 'BKP-003', date: '2025-12-24 02:00', size: '1.1 GB', type: 'Full', status: 'completed' }
    ];
    
    const container = document.getElementById('backupList');
    if (!container) return;
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Backup ID</th>
                    <th>Date & Time</th>
                    <th>Size</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${backups.map(backup => `
                    <tr>
                        <td>${backup.id}</td>
                        <td>${backup.date}</td>
                        <td>${backup.size}</td>
                        <td><span class="type-badge">${backup.type}</span></td>
                        <td><span class="status-badge ${backup.status}">${backup.status}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn" onclick="restoreBackup('${backup.id}')" title="Restore">
                                    <i class="fas fa-undo"></i>
                                </button>
                                <button class="action-btn" onclick="downloadBackup('${backup.id}')" title="Download">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="action-btn" onclick="deleteBackup('${backup.id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function createBackup() {
    if (confirm('Create a new system backup?\n\nThis may take several minutes.')) {
        alert('Creating backup...\n\nYou will be notified when the backup is complete.');
    }
}

function restoreBackup(backupId) {
    if (confirm(`Restore from backup ${backupId}?\n\nWARNING: This will overwrite current data!`)) {
        alert('Restore initiated...\n\nThe system will restart after restoration.');
    }
}

function downloadBackup(backupId) {
    alert(`Downloading backup ${backupId}...\n\nDownload will start...`);
}

function deleteBackup(backupId) {
    if (confirm(`Delete backup ${backupId}?`)) {
        alert('Backup deleted successfully.');
        loadBackups();
    }
}

// System Logs Functions
function loadSystemLogs() {
    const logs = [
        { level: 'INFO', message: 'User login successful: STU-2025-001', time: '2025-12-26 14:30:15' },
        { level: 'WARNING', message: 'High memory usage detected: 85%', time: '2025-12-26 14:25:00' },
        { level: 'INFO', message: 'Assessment created: ASMT-12345', time: '2025-12-26 14:20:45' },
        { level: 'ERROR', message: 'Database connection timeout', time: '2025-12-26 14:15:30' },
        { level: 'INFO', message: 'Scheduled backup completed', time: '2025-12-26 02:00:00' }
    ];
    
    const container = document.getElementById('systemLogs');
    if (!container) return;
    
    container.innerHTML = `
        <div class="logs-container">
            ${logs.map(log => `
                <div class="log-entry ${log.level.toLowerCase()}">
                    <span class="log-level ${log.level.toLowerCase()}">${log.level}</span>
                    <span class="log-time">${log.time}</span>
                    <span class="log-message">${log.message}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function clearLogs() {
    if (confirm('Clear all system logs?\n\nThis action cannot be undone.')) {
        alert('System logs cleared successfully.');
        loadSystemLogs();
    }
}

// Initialize dashboard features
function initializeDashboard() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('active');
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC to close modals/sidebar
        if (e.key === 'Escape') {
            closeAddUserModal();
            
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Close modal when clicking outside
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAddUserModal();
            }
        });
    }
    
    console.log('Admin dashboard initialized');
}

// Additional admin functions
function showAddCourseModal() {
    alert('Add Course functionality will be implemented here.');
}

// Backup and restore functions
function backupSystem() {
    if (!confirm('Create System Backup?\n\nThis will export all platform data including:\n- User accounts\n- System settings\n- Security logs\n- Analytics data\n\nContinue?')) {
        return;
    }
    
    // Collect all data
    const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
            users: JSON.parse(localStorage.getItem('allUsers') || '[]'),
            systemSettings: JSON.parse(localStorage.getItem('systemSettings') || '{}'),
            systemStats: JSON.parse(localStorage.getItem('systemStats') || '{}'),
            ghostAlerts: JSON.parse(localStorage.getItem('ghostModeAlerts') || '[]'),
            analytics: JSON.parse(localStorage.getItem('latestAnalytics') || '{}'),
            logs: JSON.parse(localStorage.getItem('adminLogs') || '[]')
        }
    };
    
    // Create JSON file
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QGX_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Log action
    logAdminAction('System Backup', 'Created full system backup');
    
    alert('System backup created successfully!\n\nFile downloaded as JSON.\nSize: ' + (blob.size / 1024).toFixed(2) + ' KB');
}

function restoreFromBackup() {
    if (!confirm('⚠️ RESTORE FROM BACKUP\n\nThis will OVERWRITE all current data!\n\nMake sure you have a recent backup before proceeding.\n\nContinue?')) {
        return;
    }
    
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backupData = JSON.parse(event.target.result);
                
                // Verify backup format
                if (!backupData.version || !backupData.data) {
                    alert('Invalid backup file format!');
                    return;
                }
                
                // Final confirmation
                if (!confirm(`Restore backup from ${new Date(backupData.timestamp).toLocaleString()}?\n\nThis will replace all current data!`)) {
                    return;
                }
                
                // Restore data
                localStorage.setItem('allUsers', JSON.stringify(backupData.data.users || []));
                localStorage.setItem('systemSettings', JSON.stringify(backupData.data.systemSettings || {}));
                localStorage.setItem('systemStats', JSON.stringify(backupData.data.systemStats || {}));
                localStorage.setItem('ghostModeAlerts', JSON.stringify(backupData.data.ghostAlerts || []));
                localStorage.setItem('latestAnalytics', JSON.stringify(backupData.data.analytics || {}));
                localStorage.setItem('adminLogs', JSON.stringify(backupData.data.logs || []));
                
                // Log action
                logAdminAction('System Restore', `Restored from backup dated ${new Date(backupData.timestamp).toLocaleString()}`);
                
                alert('System restored successfully!\n\nThe page will reload to apply changes.');
                
                // Reload page
                setTimeout(() => location.reload(), 2000);
            } catch (error) {
                alert('Error reading backup file!\n\n' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Admin logging function
function logAdminAction(action, details) {
    const logs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
    const adminData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    const newLog = {
        level: 'INFO',
        message: `${action}: ${details}`,
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: adminData.id || 'ADMIN',
        action: action
    };
    
    logs.unshift(newLog); // Add to beginning
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
        logs.splice(1000);
    }
    
    localStorage.setItem('systemLogs', JSON.stringify(logs));
}
