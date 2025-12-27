// ==================== QGX PLATFORM - MAIN APPLICATION CONTROLLER ====================
// Handles initialization, navigation, data management, and utilities

// ==================== APPLICATION STATE ====================
const AppState = {
    currentUser: null,
    currentPage: null,
    isLoading: false,
    cache: new Map(),
    config: {
        cacheExpiration: 300000, // 5 minutes
        debounceDelay: 300,
        loadingDelay: 200
    }
};

// ==================== APPLICATION INITIALIZATION ====================
class QGXApp {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Detect current page
            this.detectCurrentPage();
            
            // Initialize based on page type
            if (this.isAuthPage()) {
                this.initAuthPage();
            } else if (this.isDashboardPage()) {
                await this.initDashboardPage();
            } else if (this.isSplashPage()) {
                this.initSplashPage();
            }

            // Set up global event listeners
            this.setupGlobalListeners();
            
            // Initialize theme
            this.initializeTheme();
            
            console.log('✅ QGX Platform initialized successfully');
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        AppState.currentPage = page.replace('.html', '');
        
        console.log(`📄 Current page: ${AppState.currentPage}`);
        return AppState.currentPage;
    }

    isAuthPage() {
        return AppState.currentPage === 'login';
    }

    isDashboardPage() {
        return ['student', 'teacher', 'admin'].includes(AppState.currentPage);
    }

    isSplashPage() {
        return AppState.currentPage === 'index' || AppState.currentPage === '';
    }

    initAuthPage() {
        console.log('🔐 Initializing authentication page');
        // Auth page initialization handled by auth.js
    }

    async initDashboardPage() {
        console.log('📊 Initializing dashboard page');
        
        // Check authentication
        const user = checkLogin();
        if (!user) {
            console.warn('⚠️ No authenticated user found, redirecting to login');
            window.location.href = 'login.html';
            return;
        }

        AppState.currentUser = user;
        
        // Verify user role matches page
        if (!this.verifyUserAccess(user.role)) {
            console.error('❌ Unauthorized access attempt');
            this.showMessage('Access denied. Redirecting...', 'error');
            setTimeout(() => logout(), 1500);
            return;
        }

        // Load mock data
        await this.loadMockData();
        
        // Initialize role-specific functionality
        this.initializeRoleSpecificFeatures();
    }

    initSplashPage() {
        console.log('🎨 Initializing splash page');
        // Splash page is mostly CSS-driven
    }

    verifyUserAccess(userRole) {
        const pageRoleMap = {
            'student': 'student',
            'teacher': 'teacher',
            'admin': 'admin'
        };
        
        const requiredRole = pageRoleMap[AppState.currentPage];
        return userRole === requiredRole;
    }

    initializeRoleSpecificFeatures() {
        const role = AppState.currentUser?.role;
        
        switch(role) {
            case 'student':
                if (typeof loadStudentData === 'function') {
                    loadStudentData();
                }
                break;
            case 'teacher':
                if (typeof loadTeacherData === 'function') {
                    loadTeacherData();
                }
                break;
            case 'admin':
                if (typeof loadAdminData === 'function') {
                    loadAdminData();
                }
                break;
        }
    }

    setupGlobalListeners() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            console.log('🔙 Navigation: popstate event');
            this.handlePopState(e);
        });

        // Handle before unload (save state)
        window.addEventListener('beforeunload', () => {
            this.saveCurrentState();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('👁️ Page hidden');
            } else {
                console.log('👁️ Page visible');
                this.checkSessionValidity();
            }
        });

        // Handle online/offline
        window.addEventListener('online', () => {
            this.showMessage('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showMessage('No internet connection', 'warning');
        });
    }

    handlePopState(event) {
        console.log('Handling browser navigation', event.state);
        // Reload page data if needed
        if (this.isDashboardPage()) {
            this.refreshDashboardData();
        }
    }

    saveCurrentState() {
        if (AppState.currentUser) {
            const state = {
                lastVisit: new Date().toISOString(),
                page: AppState.currentPage,
                timestamp: Date.now()
            };
            localStorage.setItem('lastState', JSON.stringify(state));
        }
    }

    checkSessionValidity() {
        const user = checkLogin();
        if (!user && this.isDashboardPage()) {
            console.warn('⚠️ Session expired');
            this.showMessage('Session expired. Please login again.', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }

    initializeTheme() {
        // Apply dark theme (default for QGX Platform)
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// ==================== NAVIGATION SYSTEM ====================
class NavigationManager {
    static navigate(page, saveState = true) {
        console.log(`🧭 Navigating to: ${page}`);
        
        if (saveState) {
            const currentState = {
                page: AppState.currentPage,
                timestamp: Date.now()
            };
            window.history.pushState(currentState, '', page);
        }
        
        window.location.href = page;
    }

    static showLoading(message = 'Loading...') {
        AppState.isLoading = true;
        
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'global-loading';
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="spinner spinner-lg"></div>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
        
        // Add CSS if not exists
        if (!document.getElementById('loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(5px);
                }
                .loading-content {
                    text-align: center;
                }
                .loading-content p {
                    color: white;
                    margin-top: 20px;
                    font-size: 16px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    static hideLoading() {
        AppState.isLoading = false;
        const loadingOverlay = document.getElementById('global-loading');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    static async transitionTo(page, data = null) {
        this.showLoading('Preparing page...');
        
        try {
            // Save any pending data
            if (data) {
                sessionStorage.setItem('transitionData', JSON.stringify(data));
            }
            
            // Simulate transition delay for smooth UX
            await Utils.sleep(AppState.config.loadingDelay);
            
            // Navigate
            this.navigate(page);
        } catch (error) {
            console.error('Navigation error:', error);
            this.hideLoading();
            app.showMessage('Navigation failed', 'error');
        }
    }
}

// ==================== DATA MANAGEMENT ====================
class DataManager {
    static async loadMockData() {
        console.log('📦 Loading mock data from JSON files');
        
        const dataFiles = [
            'users',
            'courses',
            'assessments',
            'timetable',
            'forum',
            'system'
        ];

        const data = {};
        
        for (const file of dataFiles) {
            try {
                const cached = AppState.cache.get(file);
                if (cached && !this.isCacheExpired(cached)) {
                    console.log(`✅ Using cached data for ${file}`);
                    data[file] = cached.data;
                    continue;
                }

                const response = await fetch(`../data/${file}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const jsonData = await response.json();
                data[file] = jsonData;
                
                // Cache the data
                AppState.cache.set(file, {
                    data: jsonData,
                    timestamp: Date.now()
                });
                
                console.log(`✅ Loaded ${file}.json`);
            } catch (error) {
                console.warn(`⚠️ Could not load ${file}.json:`, error.message);
                // Use fallback data
                data[file] = this.getFallbackData(file);
            }
        }

        // Store in global scope for access by other modules
        window.mockData = data;
        return data;
    }

    static isCacheExpired(cachedItem) {
        return Date.now() - cachedItem.timestamp > AppState.config.cacheExpiration;
    }

    static getFallbackData(type) {
        console.log(`🔄 Using fallback data for ${type}`);
        
        const fallbacks = {
            users: { students: [], teachers: [], admins: [] },
            courses: { courses: [] },
            assessments: { assessments: [] },
            timetable: { weeklySchedule: {}, liveClassSessions: [], assessmentDates: [] },
            forum: { threads: [] },
            system: { features: {}, xpConfiguration: {}, systemSettings: {} }
        };
        
        return fallbacks[type] || {};
    }

    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`💾 Saved to localStorage: ${key}`);
            return true;
        } catch (error) {
            console.error('localStorage save failed:', error);
            return false;
        }
    }

    static getFromLocalStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('localStorage read failed:', error);
            return defaultValue;
        }
    }

    static clearCache() {
        AppState.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    static saveUserProgress(userId, progressData) {
        const key = `progress_${userId}`;
        const existing = this.getFromLocalStorage(key, {});
        
        const updated = {
            ...existing,
            ...progressData,
            lastUpdated: new Date().toISOString()
        };
        
        return this.saveToLocalStorage(key, updated);
    }

    static getUserProgress(userId) {
        return this.getFromLocalStorage(`progress_${userId}`, {});
    }
}

// ==================== UTILITY FUNCTIONS ====================
class Utils {
    // Date & Time Formatting
    static formatDate(dateString, format = 'short') {
        const date = new Date(dateString);
        
        if (format === 'short') {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } else if (format === 'long') {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } else if (format === 'time') {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (format === 'datetime') {
            return `${this.formatDate(dateString, 'short')} ${this.formatDate(dateString, 'time')}`;
        }
        
        return date.toISOString();
    }

    static timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }

        return 'just now';
    }

    static formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (mins === 0) {
            return `${hours} hr${hours > 1 ? 's' : ''}`;
        }
        
        return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min`;
    }

    // Percentage Calculations
    static calculatePercentage(value, total, decimals = 1) {
        if (total === 0) return 0;
        return parseFloat(((value / total) * 100).toFixed(decimals));
    }

    static formatPercentage(value, total, decimals = 1) {
        return `${this.calculatePercentage(value, total, decimals)}%`;
    }

    // Number Formatting
    static formatNumber(num, decimals = 0) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    static abbreviateNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Random Data Generation
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomFloat(min, max, decimals = 2) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    }

    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static generateId(prefix = 'ID') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 9);
        return `${prefix}-${timestamp}-${random}`;
    }

    static generateColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    // Input Validation
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /[0-9]/.test(password);
    }

    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static validateRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    // String Utilities
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    static truncate(str, length = 50, suffix = '...') {
        if (str.length <= length) return str;
        return str.substring(0, length - suffix.length) + suffix;
    }

    static slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Array Utilities
    static groupBy(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            if (!result[group]) {
                result[group] = [];
            }
            result[group].push(item);
            return result;
        }, {});
    }

    static sortBy(array, key, ascending = true) {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
        });
    }

    static unique(array) {
        return [...new Set(array)];
    }

    // Async Utilities
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static debounce(func, delay = 300) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    static throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Local Storage with Expiration
    static setWithExpiry(key, value, ttl) {
        const item = {
            value: value,
            expiry: Date.now() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    static getWithExpiry(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            if (Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        } catch {
            return null;
        }
    }

    // DOM Utilities
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    }

    static fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.max(1 - (progress / duration), 0);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ==================== ERROR HANDLING ====================
class ErrorHandler {
    static handle(error, context = 'Application') {
        console.error(`❌ Error in ${context}:`, error);
        
        // Log to console with stack trace
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }

        // Determine error type and show appropriate message
        let userMessage = 'An unexpected error occurred';
        
        if (error instanceof TypeError) {
            userMessage = 'A data processing error occurred';
        } else if (error instanceof ReferenceError) {
            userMessage = 'A reference error occurred';
        } else if (error.message?.includes('fetch')) {
            userMessage = 'Network error. Please check your connection.';
        } else if (error.message?.includes('localStorage')) {
            userMessage = 'Storage error. Please clear your browser cache.';
        }

        // Show user-friendly message
        if (typeof app !== 'undefined') {
            app.showMessage(userMessage, 'error');
        }

        // Log to server (in production)
        this.logToServer(error, context);

        return {
            handled: true,
            userMessage,
            originalError: error
        };
    }

    static logToServer(error, context) {
        // In production, send error logs to server
        if (window.location.hostname !== 'localhost') {
            try {
                // Mock API call - replace with actual endpoint
                const errorLog = {
                    message: error.message,
                    stack: error.stack,
                    context,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                };
                
                console.log('📡 Would send error log to server:', errorLog);
                // fetch('/api/logs/error', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(errorLog)
                // });
            } catch (logError) {
                console.error('Failed to log error to server:', logError);
            }
        }
    }

    static handleNetworkError(error) {
        console.error('🌐 Network error:', error);
        
        if (!navigator.onLine) {
            app.showMessage('You are offline. Please check your internet connection.', 'error');
        } else {
            app.showMessage('Network error. Please try again.', 'error');
        }
    }

    static handleValidationError(field, message) {
        console.warn(`⚠️ Validation error in ${field}: ${message}`);
        app.showMessage(message, 'warning');
    }

    static recover(fallbackAction, errorMessage = 'Recovering...') {
        try {
            return fallbackAction();
        } catch (error) {
            console.error('Recovery failed:', error);
            app.showMessage(errorMessage, 'error');
            return null;
        }
    }
}

// ==================== PERFORMANCE OPTIMIZATION ====================
class PerformanceManager {
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    static optimizeAnimations() {
        // Reduce animations on low-end devices
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-normal', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
    }

    static measurePerformance(label) {
        const startTime = performance.now();
        
        return {
            end: () => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
                return duration;
            }
        };
    }

    static async loadComponentLazy(componentName) {
        const perf = this.measurePerformance(`Load ${componentName}`);
        
        try {
            // Simulate lazy loading
            await Utils.sleep(100);
            console.log(`✅ Component ${componentName} loaded`);
            perf.end();
        } catch (error) {
            console.error(`Failed to load component ${componentName}:`, error);
        }
    }
}

// ==================== GLOBAL APP INSTANCE ====================
QGXApp.prototype.loadMockData = async function() {
    return await DataManager.loadMockData();
};

QGXApp.prototype.refreshDashboardData = function() {
    console.log('🔄 Refreshing dashboard data');
    DataManager.clearCache();
    this.loadMockData().then(() => {
        this.initializeRoleSpecificFeatures();
    });
};

QGXApp.prototype.showMessage = function(message, type = 'info') {
    console.log(`📢 Message (${type}): ${message}`);
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add CSS if not exists
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .toast-success { border-left: 4px solid #4ade80; }
            .toast-error { border-left: 4px solid #f87171; }
            .toast-warning { border-left: 4px solid #fbbf24; }
            .toast-info { border-left: 4px solid #4facfe; }
            .toast-success i { color: #4ade80; }
            .toast-error i { color: #f87171; }
            .toast-warning i { color: #fbbf24; }
            .toast-info i { color: #4facfe; }
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

QGXApp.prototype.getMessageIcon = function(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
};

QGXApp.prototype.handleError = function(message, error) {
    ErrorHandler.handle(error, message);
};

// ==================== EXPORT UTILITIES TO GLOBAL SCOPE ====================
window.QGXApp = QGXApp;
window.NavigationManager = NavigationManager;
window.DataManager = DataManager;
window.Utils = Utils;
window.ErrorHandler = ErrorHandler;
window.PerformanceManager = PerformanceManager;
window.AppState = AppState;

// ==================== AUTO-INITIALIZE ====================
let app;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new QGXApp();
        window.app = app;
    });
} else {
    app = new QGXApp();
    window.app = app;
}

// ==================== GLOBAL ERROR HANDLING ====================
window.addEventListener('error', (event) => {
    ErrorHandler.handle(event.error, 'Global Error');
});

window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handle(event.reason, 'Unhandled Promise Rejection');
});

console.log('🚀 QGX Platform Main Controller loaded');
