/**
 * QGX Platform - Admin Dashboard Enhanced Functions
 * Additional functionality for admin operations
 */

// Load system statistics
function loadSystemStats() {
    // Get or initialize system stats
    const stats = JSON.parse(localStorage.getItem('systemStats') || JSON.stringify({
        totalUsers: 450,
        activeUsers: 127,
        systemUptime: 98.5,
        securityAlerts: 3,
        serverLoad: 45,
        totalLogins: 1248,
        assessmentsCreated: 342,
        submissions: 5678,
        avgEngagement: 89,
        userGrowth: 12,
        lastUpdated: new Date().toISOString()
    }));
    
    // Update dashboard stats
    updateElement('totalUsers', stats.totalUsers);
    updateElement('systemHealth', stats.systemUptime + '%');
    updateElement('securityAlerts', stats.securityAlerts);
    updateElement('serverLoad', stats.serverLoad + '%');
    updateElement('activeUserCount', stats.activeUsers);
    
    // Save stats
    localStorage.setItem('systemStats', JSON.stringify(stats));
    
    console.log('System stats loaded:', stats);
}

// Enhanced user management with sorting
let sortColumn = 'name';
let sortDirection = 'asc';

function sortUsers(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    filteredUsers.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        
        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    displayUsers();
}

// Feature toggle with confirmation
function toggleFeature(feature, enabled) {
    const featureNames = {
        ghostMode: 'Ghost Mode',
        voiceControl: 'Voice Control',
        aiGeneration: 'AI Assessment Generation',
        maintenanceMode: 'Maintenance Mode'
    };
    
    const featureName = featureNames[feature] || feature;
    const action = enabled ? 'ENABLE' : 'DISABLE';
    
    // Special warning for maintenance mode
    if (feature === 'maintenanceMode' && enabled) {
        if (!confirm(`⚠️ ENABLE MAINTENANCE MODE\n\nThis will make the platform unavailable to all users except admins.\n\nAre you sure?`)) {
            // Revert toggle
            document.getElementById(feature).checked = false;
            return;
        }
    }
    
    // Confirm change
    if (!confirm(`${action} ${featureName}?\n\nCurrent status: ${enabled ? 'ON' : 'OFF'}\n\nThis change will take effect immediately.`)) {
        // Revert toggle
        document.getElementById(feature).checked = !enabled;
        return;
    }
    
    // Update settings
    systemSettings[feature] = enabled;
    
    // Save to localStorage
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    
    // Log action
    logAdminAction('Feature Toggle', `${action} ${featureName}`);
    
    // Show confirmation
    alert(`✓ ${featureName} ${enabled ? 'enabled' : 'disabled'} successfully!\n\nThe feature is now ${enabled ? 'active' : 'inactive'} across the platform.`);
}

// View Ghost Mode alerts with action buttons
function viewGhostAlerts() {
    const ghostAlerts = JSON.parse(localStorage.getItem('ghostModeAlerts') || JSON.stringify([
        { id: 'GA-001', user: 'STU-2025-015', action: 'Enabled Ghost Mode', time: '1 hour ago', duration: '45 mins', confidence: 85, suspicious: true, resolved: false },
        { id: 'GA-002', user: 'STU-2025-023', action: 'Multiple assessments in Ghost Mode', time: '3 hours ago', duration: '1.5 hours', confidence: 92, suspicious: true, resolved: false },
        { id: 'GA-003', user: 'STU-2025-008', action: 'Disabled Ghost Mode', time: '5 hours ago', duration: '30 mins', confidence: 45, suspicious: false, resolved: true }
    ]));
    
    navigateTo('security-monitor');
    loadGhostModeActivity();
}

function resolveGhostAlert(alertId, action) {
    const ghostAlerts = JSON.parse(localStorage.getItem('ghostModeAlerts') || '[]');
    const alert = ghostAlerts.find(a => a.id === alertId);
    
    if (!alert) return;
    
    const actionText = action === 'action' ? 'Take action on this alert?' : 'Ignore this alert?';
    
    if (!confirm(`${actionText}\n\nUser: ${alert.user}\nActivity: ${alert.action}\nConfidence: ${alert.confidence}%`)) {
        return;
    }
    
    alert.resolved = true;
    alert.actionTaken = action;
    alert.resolvedAt = new Date().toISOString();
    
    // Save changes
    localStorage.setItem('ghostModeAlerts', JSON.stringify(ghostAlerts));
    
    // Log action
    logAdminAction('Ghost Alert Resolved', `${action === 'action' ? 'Took action on' : 'Ignored'} alert ${alertId} - ${alert.user}`);
    
    // Reload display
    loadGhostModeActivity();
    
    alert(`Alert ${action === 'action' ? 'actioned' : 'ignored'} successfully!`);
}

// Generate analytics with PDF export
function generateAnalytics() {
    // Confirm generation
    if (!confirm('Generate Analytics Report?\n\nThis will compile platform usage data, user engagement metrics, and performance trends.\n\nContinue?')) {
        return;
    }
    
    // Show loading
    alert('Generating analytics report...\n\nPlease wait while we compile the data.');
    
    // Simulate data compilation
    setTimeout(() => {
        const analyticsData = {
            period: 'Last 30 Days',
            generatedAt: new Date().toISOString(),
            platformUsage: {
                totalLogins: 1248,
                uniqueUsers: 387,
                avgSessionDuration: '24 mins',
                pageViews: 15234
            },
            userEngagement: {
                assessmentsTaken: 856,
                assessmentsCreated: 342,
                submissions: 5678,
                forumPosts: 234,
                avgEngagement: '89%'
            },
            performanceTrends: {
                avgResponseTime: '245ms',
                cacheHitRate: '94.5%',
                errorRate: '0.02%',
                uptime: '98.5%'
            },
            userGrowth: {
                newUsers: 54,
                growthRate: '12%',
                retentionRate: '87%',
                churnRate: '5%'
            }
        };
        
        // Save to localStorage
        localStorage.setItem('latestAnalytics', JSON.stringify(analyticsData));
        
        // Log action
        logAdminAction('Analytics Generated', 'Generated platform analytics report');
        
        // Offer download options
        const download = confirm('Analytics Report Generated!\n\n📊 Platform Usage:\n- Total Logins: 1,248\n- Unique Users: 387\n- Avg Session: 24 mins\n\n👥 User Engagement:\n- Assessments Taken: 856\n- Submissions: 5,678\n- Avg Engagement: 89%\n\n⚡ Performance:\n- Response Time: 245ms\n- Uptime: 98.5%\n\nDownload as PDF?');
        
        if (download) {
            downloadAnalyticsPDF(analyticsData);
        }
    }, 1500);
}

function downloadAnalyticsPDF(data) {
    // Create downloadable content
    const content = `QGX PLATFORM ANALYTICS REPORT\n${'='.repeat(50)}\n\nGenerated: ${new Date(data.generatedAt).toLocaleString()}\nPeriod: ${data.period}\n\nPLATFORM USAGE\n${'-'.repeat(50)}\nTotal Logins: ${data.platformUsage.totalLogins}\nUnique Users: ${data.platformUsage.uniqueUsers}\nAvg Session Duration: ${data.platformUsage.avgSessionDuration}\nPage Views: ${data.platformUsage.pageViews}\n\nUSER ENGAGEMENT\n${'-'.repeat(50)}\nAssessments Taken: ${data.userEngagement.assessmentsTaken}\nAssessments Created: ${data.userEngagement.assessmentsCreated}\nSubmissions: ${data.userEngagement.submissions}\nForum Posts: ${data.userEngagement.forumPosts}\nAvg Engagement: ${data.userEngagement.avgEngagement}\n\nPERFORMANCE TRENDS\n${'-'.repeat(50)}\nAvg Response Time: ${data.performanceTrends.avgResponseTime}\nCache Hit Rate: ${data.performanceTrends.cacheHitRate}\nError Rate: ${data.performanceTrends.errorRate}\nUptime: ${data.performanceTrends.uptime}\n\nUSER GROWTH\n${'-'.repeat(50)}\nNew Users: ${data.userGrowth.newUsers}\nGrowth Rate: ${data.userGrowth.growthRate}\nRetention Rate: ${data.userGrowth.retentionRate}\nChurn Rate: ${data.userGrowth.churnRate}`;
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QGX_Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Analytics report downloaded!\n\nFile: QGX_Analytics_Report.txt');
}

// Advanced log viewing with filters
let logFilters = {
    level: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
};

function viewLogs() {
    navigateTo('logs');
    loadSystemLogs();
}

function filterLogs() {
    const level = document.getElementById('logLevelFilter')?.value || 'all';
    const search = document.getElementById('logSearch')?.value.toLowerCase() || '';
    const dateFrom = document.getElementById('logDateFrom')?.value || '';
    const dateTo = document.getElementById('logDateTo')?.value || '';
    
    let logs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
    
    // Apply filters
    logs = logs.filter(log => {
        const matchLevel = level === 'all' || log.level === level;
        const matchSearch = !search || log.message.toLowerCase().includes(search) || log.user.toLowerCase().includes(search);
        const matchDateFrom = !dateFrom || log.time >= dateFrom;
        const matchDateTo = !dateTo || log.time <= dateTo + ' 23:59:59';
        
        return matchLevel && matchSearch && matchDateFrom && matchDateTo;
    });
    
    // Update display
    const display = document.getElementById('logsDisplay');
    if (display) {
        display.innerHTML = logs.length > 0 ? logs.map(log => `
            <div class="log-entry ${log.level.toLowerCase()}">
                <span class="log-level ${log.level.toLowerCase()}">${log.level}</span>
                <span class="log-time">${log.time}</span>
                <span class="log-message">${log.message}</span>
            </div>
        `).join('') : '<div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">No logs match the current filters</div>';
    }
}

// Enhanced system logs loading
function loadSystemLogsEnhanced() {
    // Get or initialize logs
    let logs = JSON.parse(localStorage.getItem('systemLogs') || JSON.stringify([
        { level: 'INFO', message: 'User login successful: STU-2025-001', time: '2025-12-26 14:30:15', user: 'STU-2025-001', action: 'Login' },
        { level: 'WARNING', message: 'High memory usage detected: 85%', time: '2025-12-26 14:25:00', user: 'SYSTEM', action: 'Alert' },
        { level: 'INFO', message: 'Assessment created: ASMT-12345', time: '2025-12-26 14:20:45', user: 'TCH-2025-042', action: 'Create' },
        { level: 'ERROR', message: 'Database connection timeout', time: '2025-12-26 14:15:30', user: 'SYSTEM', action: 'Error' },
        { level: 'INFO', message: 'Scheduled backup completed', time: '2025-12-26 02:00:00', user: 'SYSTEM', action: 'Backup' }
    ]));
    
    const container = document.getElementById('systemLogs');
    if (!container) return;
    
    container.innerHTML = `
        <div class="log-filters" style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
            <select class="filter-select" id="logLevelFilter" onchange="filterLogs()" style="flex: 1; min-width: 150px;">
                <option value="all">All Levels</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
            </select>
            <input type="text" class="search-input" id="logSearch" placeholder="Search logs..." onkeyup="filterLogs()" style="flex: 2; min-width: 200px;">
            <input type="date" class="form-input" id="logDateFrom" onchange="filterLogs()" style="flex: 1; min-width: 130px;">
            <input type="date" class="form-input" id="logDateTo" onchange="filterLogs()" style="flex: 1; min-width: 130px;">
        </div>
        <div class="logs-container" id="logsDisplay">
            ${logs.map(log => `
                <div class="log-entry ${log.level.toLowerCase()}">
                    <span class="log-level ${log.level.toLowerCase()}">${log.level}</span>
                    <span class="log-time">${log.time}</span>
                    <span class="log-message">${log.message}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Save logs
    localStorage.setItem('systemLogs', JSON.stringify(logs));
}

// Role change handler
function changeUserRole(userId, newRole) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    const oldRole = user.role;
    
    if (!confirm(`Change role for ${user.name}?\n\nFrom: ${oldRole.toUpperCase()}\nTo: ${newRole.toUpperCase()}\n\nThis action will update user permissions.`)) {
        return;
    }
    
    // Update role and permissions
    user.role = newRole;
    user.permissions = newRole === 'admin' ? ['all'] : newRole === 'teacher' ? ['create', 'grade', 'view'] : ['view', 'submit'];
    
    // Update ID prefix
    const oldId = user.id;
    user.id = `${newRole.substring(0, 3).toUpperCase()}-${user.id.substring(4)}`;
    
    // Save changes
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    displayUsers();
    
    // Log action
    logAdminAction('Role Changed', `Changed ${user.name} from ${oldRole} to ${newRole}`);
    
    alert(`Role updated successfully!\n\n${user.name}\nOld ID: ${oldId}\nNew ID: ${user.id}\nNew Role: ${newRole.toUpperCase()}`);
}

// Ensure functions are globally accessible
if (typeof window !== 'undefined') {
    window.loadSystemStats = loadSystemStats;
    window.sortUsers = sortUsers;
    window.toggleFeature = toggleFeature;
    window.viewGhostAlerts = viewGhostAlerts;
    window.resolveGhostAlert = resolveGhostAlert;
    window.generateAnalytics = generateAnalytics;
    window.downloadAnalyticsPDF = downloadAnalyticsPDF;
    window.viewLogs = viewLogs;
    window.filterLogs = filterLogs;
    window.changeUserRole = changeUserRole;
    window.loadSystemLogsEnhanced = loadSystemLogsEnhanced;
}
