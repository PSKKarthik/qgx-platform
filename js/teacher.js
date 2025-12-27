/**
 * QGX Platform - Teacher Dashboard Functions
 * Handles teacher-specific functionality
 */

// Global variables
let currentClass = '10-A';
let studentsData = [];
let scheduledClasses = [];

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const userData = checkLogin();
    
    if (userData) {
        // Load teacher data
        loadTeacherData();
        
        // Load dashboard widgets
        loadUpcomingClasses();
        loadRecentSubmissions();
        loadStudentList(currentClass);
        loadScheduledClasses();
        
        // Initialize dashboard features
        initializeDashboard();
        
        // Setup form submissions
        setupFormSubmissions();
    }
});

// Setup all form submissions
function setupFormSubmissions() {
    // Schedule class form
    const scheduleForm = document.querySelector('#scheduleModal form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            scheduleClass();
        });
    }
    
    // Assessment creator form
    const assessmentForm = document.querySelector('.assessment-creator');
    if (assessmentForm) {
        // Prevent default form submission
        const inputs = assessmentForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Student search
    const searchInput = document.getElementById('studentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterStudents(e.target.value);
        });
    }
    
    console.log('Form submissions configured');
}

// Load teacher data
function loadTeacherData() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!userData || !userData.name) {
        console.error('No teacher data found');
        return;
    }
    
    // Update profile elements
    updateElement('profileName', userData.name);
    updateElement('profileId', userData.id);
    updateElement('studentCount', `${userData.totalStudents} Students`);
    updateElement('welcomeName', userData.name.split(' ')[0]);
    
    // Update stats
    updateElement('totalStudents', userData.totalStudents || 120);
    updateElement('activeAssessments', userData.activeAssessments || 8);
    updateElement('unreadMessages', 15);
    updateElement('pendingReviews', 23);
    
    // Set profile photo
    const profilePhoto = document.getElementById('profilePhoto');
    if (profilePhoto && userData.photo) {
        const img = profilePhoto.querySelector('img');
        if (img) img.src = userData.photo;
    }
    
    console.log('Teacher data loaded:', userData);
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
        'create-assessment': 'createAssessmentView',
        'student-progress': 'studentProgressView',
        'live-classes': 'liveClassesView'
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
    
    console.log(`Navigated to: ${view}`);
}

// Load upcoming classes
function loadUpcomingClasses() {
    const classesData = [
        {
            time: '9:00 AM',
            subject: 'Mathematics',
            class: '10-A',
            room: 'Room 204',
            students: 30
        },
        {
            time: '11:00 AM',
            subject: 'Statistics',
            class: '12-A',
            room: 'Room 301',
            students: 28
        },
        {
            time: '2:00 PM',
            subject: 'Mathematics',
            class: '10-B',
            room: 'Room 204',
            students: 32
        }
    ];
    
    const container = document.getElementById('upcomingClassesContent');
    if (!container) return;
    
    container.innerHTML = classesData.map(cls => `
        <div class="timeline-item">
            <div class="timeline-time">${cls.time}</div>
            <div class="timeline-content">
                <h4>${cls.subject} - ${cls.class}</h4>
                <p>${cls.room} • ${cls.students} students</p>
            </div>
        </div>
    `).join('');
}

// Load recent submissions
function loadRecentSubmissions() {
    const submissions = [
        {
            id: 'SUB-001',
            student: 'Alex Johnson',
            studentId: 'STU-2025-001',
            assignment: 'Chapter 5 Quiz',
            time: '10 mins ago',
            status: 'pending',
            score: null
        },
        {
            id: 'SUB-002',
            student: 'Emma Davis',
            studentId: 'STU-2025-015',
            assignment: 'Trigonometry Assignment',
            time: '25 mins ago',
            status: 'pending',
            score: null
        },
        {
            id: 'SUB-003',
            student: 'Michael Chen',
            studentId: 'STU-2025-027',
            assignment: 'Calculus Problem Set',
            time: '1 hour ago',
            status: 'pending',
            score: null
        }
    ];
    
    // Store in localStorage for grading
    localStorage.setItem('pendingSubmissions', JSON.stringify(submissions));
    
    const container = document.getElementById('recentSubmissionsContent');
    if (!container) return;
    
    container.innerHTML = submissions.map(sub => `
        <div class="activity-item" style="cursor: pointer;" onclick="gradeSubmission('${sub.id}')">
            <div class="activity-icon info">
                <i class="fas fa-file-upload"></i>
    gradeSubmissions();
}

// Grade submissions function
function gradeSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
    
    if (submissions.length === 0) {
        alert('No pending submissions to grade');
        return;
    }
    
    // Create modal for grading interface
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'gradingModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h3><i class="fas fa-clipboard-check"></i> Grade Submissions</h3>
                <button class="modal-close" onclick="closeGradingModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="grading-tabs">
                    <button class="grading-tab active" onclick="switchGradingTab('pending')">
                        Pending (${submissions.filter(s => s.status === 'pending').length})
                    </button>
                    <button class="grading-tab" onclick="switchGradingTab('graded')">
                        Graded (0)
                    </button>
                </div>
                <div id="gradingContent">
                    ${submissions.map(sub => `
                        <div class="submission-card" data-id="${sub.id}">
                            <div class="submission-header">
                                <div>
                                    <h4>${sub.student}</h4>
                                    <p>${sub.assignment} • ${sub.time}</p>
                                </div>
                                <span class="badge ${sub.status}">${sub.status.toUpperCase()}</span>
                            </div>
                            <div class="submission-content">
                                <div class="rubric-grading">
                                    <h5>Grading Rubric</h5>
                                    <div class="rubric-items">
                                        <div class="rubric-item">
                                            <label>Understanding (40 pts)</label>
                                            <input type="number" class="rubric-input" max="40" min="0" placeholder="0-40" id="${sub.id}-understanding">
                                        </div>
                                        <div class="rubric-item">
                                            <label>Accuracy (30 pts)</label>
                                            <input type="number" class="rubric-input" max="30" min="0" placeholder="0-30" id="${sub.id}-accuracy">
                                        </div>
                                        <div class="rubric-item">
                                            <label>Presentation (20 pts)</label>
                                            <input type="number" class="rubric-input" max="20" min="0" placeholder="0-20" id="${sub.id}-presentation">
                                        </div>
                                        <div class="rubric-item">
                                            <label>Timeliness (10 pts)</label>
                                            <input type="number" class="rubric-input" max="10" min="0" placeholder="0-10" id="${sub.id}-timeliness">
                                        </div>
                                    </div>
                                    <div class="total-score">
                                        Total: <span id="${sub.id}-total">0</span>/100
                                    </div>
                                </div>
                                <div class="feedback-section">
                                    <h5>Feedback</h5>
                                    <div class="feedback-templates">
                                        <button class="template-btn" onclick="applyTemplate('${sub.id}', 'excellent')">
                                            <i class="fas fa-star"></i> Excellent Work
                                        </button>
                                        <button class="template-btn" onclick="applyTemplate('${sub.id}', 'good')">
                                            <i class="fas fa-thumbs-up"></i> Good Job
                                        </button>
                                        <button class="template-btn" onclick="applyTemplate('${sub.id}', 'needswork')">
                                            <i class="fas fa-exclamation-triangle"></i> Needs Improvement
                                        </button>
                                    </div>
                                    <textarea class="feedback-input" id="${sub.id}-feedback" placeholder="Write detailed feedback..."></textarea>
                                </div>
                            </div>
                            <div class="submission-actions">
                                <button class="btn-secondary" onclick="calculateTotal('${sub.id}')">
                                    <i class="fas fa-calculator"></i> Calculate Total
                                </button>
                                <button class="btn-primary" onclick="publishGrade('${sub.id}')">
                                    <i class="fas fa-paper-plane"></i> Publish Grade
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Grade individual submission
function gradeSubmission(submissionId) {
    gradeSubmissions();
    // Auto-scroll to specific submission
    setTimeout(() => {
        const card = document.querySelector(`[data-id="${submissionId}"]`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Close grading modal
function closeGradingModal() {
    const modal = document.getElementById('gradingModal');
    if (modal) modal.remove();
}

// Switch grading tabs
function switchGradingTab(tab) {
    const tabs = document.querySelectorAll('.grading-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter submissions
    const submissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
    const filtered = tab === 'pending' ? 
        submissions.filter(s => s.status === 'pending') : 
        submissions.filter(s => s.status === 'graded');
    
    console.log(`Showing ${filtered.length} ${tab} submissions`);
}

// Apply feedback template
function applyTemplate(submissionId, type) {
    const templates = {
        excellent: 'Excellent work! You have demonstrated a thorough understanding of the concepts. Your answers are well-structured and accurate. Keep up the great work!',
        good: 'Good job! You have shown a solid understanding of the material. There are a few areas that could use improvement, but overall this is strong work.',
        needswork: 'This submission needs improvement. Please review the concepts covered and ensure you understand the key principles. I recommend reviewing the course materials and attempting practice problems.'
    };
    
    const feedback = document.getElementById(`${submissionId}-feedback`);
    if (feedback) {
        feedback.value = templates[type];
    }
}

// Calculate total score
function calculateTotal(submissionId) {
    const understanding = parseInt(document.getElementById(`${submissionId}-understanding`)?.value || 0);
    const accuracy = parseInt(document.getElementById(`${submissionId}-accuracy`)?.value || 0);
    const presentation = parseInt(document.getElementById(`${submissionId}-presentation`)?.value || 0);
    const timeliness = parseInt(document.getElementById(`${submissionId}-timeliness`)?.value || 0);
    
    const total = understanding + accuracy + presentation + timeliness;
    
    const totalElement = document.getElementById(`${submissionId}-total`);
    if (totalElement) {
        totalElement.textContent = total;
        totalElement.style.color = total >= 90 ? '#4ade80' : total >= 70 ? '#fbbf24' : '#f87171';
    }
    
    return total;
}

// Publish grade
function publishGrade(submissionId) {
    const total = calculateTotal(submissionId);
    const feedback = document.getElementById(`${submissionId}-feedback`)?.value;
    
    if (!feedback) {
        alert('Please provide feedback before publishing the grade');
        return;
    }
    
    // Update submission status
    const submissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
    const submission = submissions.find(s => s.id === submissionId);
    
    if (submission) {
        submission.status = 'graded';
        submission.score = total;
        submission.feedback = feedback;
        submission.gradedAt = new Date().toISOString();
        
        localStorage.setItem('pendingSubmissions', JSON.stringify(submissions));
        
        alert(`Grade Published!\n\nStudent: ${submission.student}\nScore: ${total}/100\n\nThe student will be notified of their grade.`);
        
        // Remove the card
        const card = document.querySelector(`[data-id="${submissionId}"]`);
        if (card) card.remove();
        
        // Check if no more pending
        const remaining = document.querySelectorAll('.submission-card').length;
        if (remaining === 0) {
            closeGradingModal();
            loadRecentSubmissions();
        }
    }
            <div class="activity-details">
                <h4>${sub.student}</h4>
                <p>${sub.assignment}</p>
                <span class="activity-time">${sub.time}</span>
            </div>
        </div>
    `).join('');
}

// View all submissions
function viewAllSubmissions() {
    alert('Viewing all submissions...\n\nThis will show a complete list of pending and graded submissions.');
}

// Update performance chart
function updatePerformanceChart(className) {
    console.log(`Loading performance chart for class: ${className}`);
    // In a real app, this would update the chart with actual data
}

// Assessment Creator Functions
function selectInputMethod(method) {
    // Hide all input panels
    document.querySelectorAll('.input-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    
    // Show selected panel
    const panelMap = {
        'text': 'textInputPanel',
        'pdf': 'pdfInputPanel',
        'image': 'imageInputPanel',
        'url': 'urlInputPanel'
    };
    
    const panel = document.getElementById(panelMap[method]);
    if (panel) panel.style.display = 'block';
    
    // Update button states
    document.querySelectorAll('.input-method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.input-method-btn').classList.add('active');
}

// Update question count
function updateQuestionCount(value) {
    const display = document.getElementById('questionCount');
    if (display) display.textContent = value;
}

// Update difficulty distribution
function updateDifficulty(level, value) {
    const display = document.getElementById(`${level}Percent`);
    if (display) display.textContent = value;
}

// Fetch content from URL
function fetchURLContent() {
    const urlInput = document.getElementById('urlInput');
    if (!urlInput || !urlInput.value) {
        alert('Please enter a valid URL');
        return;
    }
    
    alert(`Fetching content from: ${urlInput.value}\n\nThis feature will extract text content from the URL.`);
}

// Generate assessment
function generateAssessment() {
    const content = document.getElementById('assessmentContent').value;
    
    if (!content && !document.getElementById('pdfFile').files.length && 
        !document.getElementById('imageFile').files.length) {
        alert('Please provide content to generate assessment');
        return;
    }
    
    // Show loading state
    const generateBtn = event.target;
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    generateBtn.disabled = true;
    
    // Simulate generation
    setTimeout(() => {
        const questionCount = document.getElementById('questionCount').textContent;
        const preview = document.getElementById('previewContent');
        
        // Generate sample questions
        const questions = [];
        for (let i = 1; i <= parseInt(questionCount); i++) {
            questions.push({
                id: i,
                question: `Sample Question ${i}`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correct: Math.floor(Math.random() * 4)
            });
        }
    // Validate date (must be in the future)
    const selectedDate = new Date(`${date.value}T${time.value}`);
    const now = new Date();
    
    if (selectedDate <= now) {
        alert('Please select a future date and time');
        return;
    }
    
    // Generate meeting link
    const meetingId = `qgx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const meetingLink = `https://meet.qgx.platform/${meetingId}`;
    
    const newClass = {
        id: `CLS-${Date.now()}`,
        class: classSelect.value,
        subject: subject.value,
        date: date.value,
        time: time.value,
        duration: duration.value,
        recording: recording.checked,
        meetingLink: meetingLink,
        status: 'scheduled'
    };
    
    scheduledClasses.push(newClass);
    
    // Save to localStorage
    localStorage.setItem('scheduledClasses', JSON.stringify(scheduledClasses));
    
    // Send notifications to students
    sendClassNotifications(newClass);
    
    loadScheduledClasses();
    closeScheduleModal();
    
    alert(`Class scheduled successfully!\n\n${subject.value} - ${classSelect.value}\n${date.value} at ${time.value}\nDuration: ${duration.value} minutes\nRecording: ${recording.checked ? 'Enabled' : 'Disabled'}\n\nMeeting Link: ${meetingLink}\n\nNotifications sent to all students in ${classSelect.value}`);
}

// Send notifications to students
function sendClassNotifications(classData) {
    const notifications = {
        type: 'live-class-scheduled',
        class: classData.class,
        subject: classData.subject,
        datetime: `${classData.date} ${classData.time}`,
        link: classData.meetingLink,
        sentAt: new Date().toISOString()
    };
    
    // Store notification
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    allNotifications.push(notifications);
    localStorage.setItem('notifications', JSON.stringify(allNotifications));
    
    console.log('Notifications sent to students:', notifications
            <div class="preview-actions">
                <button class="btn-secondary" onclick="regenerateQuestions()">
                    <i class="fas fa-redo"></i> Regenerate
                </button>
                <button class="btn-primary" onclick="saveAssessment()">
                    <i class="fas fa-save"></i> Save Assessment
                </button>
            </div>
        `;
        
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
        
        alert(`Successfully generated ${questionCount} questions!`);
    }, 2000);
}

// Regenerate questions
function regenerateQuestions() {
    generateAssessment();
}

// Save assessment
function saveAssessment() {
    const assessmentData = {
        id: `ASMT-${Date.now()}`,
        title: document.getElementById('assessmentContent')?.value.substring(0, 50) || 'New Assessment',
        questions: document.querySelectorAll('.question-preview').length,
        created: new Date().toISOString(),
        status: 'draft'
    };
    
    // Save to localStorage
    const savedAssessments = JSON.parse(localStorage.getItem('teacherAssessments') || '[]');
    savedAssessments.push(assessmentData);
    localStorage.setItem('teacherAssessments', JSON.stringify(savedAssessments));
    
    alert('Assessment saved successfully!\n\nYou can now assign it to your classes.');
}

// Download assessment as PDF
function downloadAssessmentPDF() {
    const questions = document.querySelectorAll('.question-preview');
    if (questions.length === 0) {
        alert('Please generate questions first');
        return;
    }
    
    alert(`Downloading Assessment PDF\n\nFormat: Professional PDF\nQuestions: ${questions.length}\nIncluding: Answer key, grading rubric, student answer sheet\n\nPDF generation will start...`);
    
    // Simulate PDF download
    console.log('Generating PDF with questions:', questions.length);
}

// Student Progress Functions
function switchClass(className) {
    currentClass = className;
    
    // Update tabs
    document.querySelectorAll('.class-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load student list for this class
    loadStudentList(className);
    loadFlaggedStudents(className);
}

// Load student list
function loadStudentList(className) {
    // Generate mock student data
    studentsData = [];
    for (let i = 1; i <= 30; i++) {
        studentsData.push({
            id: `STU-${className}-${String(i).padStart(3, '0')}`,
            name: `Student ${i}`,
            avatar: `https://ui-avatars.com/api/?name=Student+${i}&background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff`,
            average: Math.floor(Math.random() * 40) + 60 // 60-100
        });
    }
    
    const container = document.getElementById('studentListContent');
    if (!container) return;
    
    container.innerHTML = studentsData.map(student => `
        <div class="student-item" onclick="viewStudentProfile('${student.id}')">
            <div class="student-avatar">
                <img src="${student.avatar}" alt="${student.name}">
            </div>
            <div class="student-details">
                <h4>${student.name}</h4>
                <p>${student.id}</p>
 

// Generate reports function
function generateReports() {
    // Create modal for report generation
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'reportsModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3><i class="fas fa-chart-bar"></i> Generate Reports</h3>
                <button class="modal-close" onclick="closeReportsModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="report-options">
                    <div class="report-type-selector">
                        <h4>Report Type</h4>
                        <div class="report-type-grid">
                            <div class="report-type-card" onclick="selectReportType('class-performance')">
                                <i class="fas fa-users"></i>
                                <h5>Class Performance</h5>
                                <p>Overall class analytics and trends</p>
                            </div>
                            <div class="report-type-card" onclick="selectReportType('individual-student')">
                                <i class="fas fa-user"></i>
                                <h5>Individual Student</h5>
                                <p>Detailed student progress report</p>
                            </div>
                            <div class="report-type-card" onclick="selectReportType('assessment-analysis')">
                                <i class="fas fa-clipboard-list"></i>
                                <h5>Assessment Analysis</h5>
                                <p>Question-by-question breakdown</p>
                            </div>
                            <div class="report-type-card" onclick="selectReportType('attendance')">
                                <i class="fas fa-calendar-check"></i>
                                <h5>Attendance Report</h5>
                                <p>Attendance trends and patterns</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-config" id="reportConfig" style="display: none;">
                        <h4>Report Configuration</h4>
                        <div class="form-group">
                            <label>Select Class</label>
                            <select class="form-input" id="reportClass">
                                <option value="10-A">Class 10-A</option>
                                <option value="10-B">Class 10-B</option>
                                <option value="11-A">Class 11-A</option>
                                <option value="12-A">Class 12-A</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Date Range</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <input type="date" class="form-input" id="reportStartDate" value="2025-12-01">
                                <input type="date" class="form-input" id="reportEndDate" value="2025-12-26">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Include Charts</label>
                            <div style="display: flex; gap: 20px;">
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" id="includePerformance" checked>
                                    Performance Trends
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" id="includeDistribution" checked>
                                    Grade Distribution
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" id="includeComparison" checked>
                                    Class Comparison
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Export Format</label>
                            <div style="display: flex; gap: 10px;">
                                <button class="export-format-btn active" data-format="pdf">
                                    <i class="fas fa-file-pdf"></i> PDF
                                </button>
                                <button class="export-format-btn" data-format="excel">
                                    <i class="fas fa-file-excel"></i> Excel
                                </button>
                                <button class="export-format-btn" data-format="csv">
                                    <i class="fas fa-file-csv"></i> CSV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeReportsModal()">Cancel</button>
                <button class="btn-primary" onclick="generateReport()" id="generateReportBtn" disabled>
                    <i class="fas fa-download"></i> Generate Report
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for export format buttons
    setTimeout(() => {
        document.querySelectorAll('.export-format-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.export-format-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }, 100);
}

// Select report type
let selectedReportType = null;
function selectReportType(type) {
    selectedReportType = type;
    
    // Update UI
    document.querySelectorAll('.report-type-card').forEach(card => {
        card.classList.remove('active');
    });
    event.target.closest('.report-type-card').classList.add('active');
    
    // Show configuration
    document.getElementById('reportConfig').style.display = 'block';
    document.getElementById('generateReportBtn').disabled = false;
}

// Generate report
function generateReport() {
    if (!selectedReportType) {
        alert('Please select a report type');
        return;
    }
    
    const className = document.getElementById('reportClass').value;
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const format = document.querySelector('.export-format-btn.active').dataset.format;
    
    const includeCharts = {
        performance: document.getElementById('includePerformance').checked,
        distribution: document.getElementById('includeDistribution').checked,
        comparison: document.getElementById('includeComparison').checked
    };
    
    // Show loading
    const btn = document.getElementById('generateReportBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;
    
    // Simulate report generation
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        const reportTypes = {
            'class-performance': 'Class Performance Report',
            'individual-student': 'Individual Student Report',
            'assessment-analysis': 'Assessment Analysis Report',
            'attendance': 'Attendance Report'
        };
        
        alert(`Report Generated Successfully!\n\nType: ${reportTypes[selectedReportType]}\nClass: ${className}\nPeriod: ${startDate} to ${endDate}\nFormat: ${format.toUpperCase()}\n\nCharts included:\n${includeCharts.performance ? '✓ Performance Trends\n' : ''}${includeCharts.distribution ? '✓ Grade Distribution\n' : ''}${includeCharts.comparison ? '✓ Class Comparison\n' : ''}\n\nDownload starting...`);
        
        closeReportsModal();
    }, 2000);
}

// Close reports modal
function closeReportsModal() {
    const modal = document.getElementById('reportsModal');
    if (modal) modal.remove();
    selectedReportType = null;
}           </div>
            <div class="student-score">${student.average}%</div>
        </div>
    `).join('');
}

// Filter students
function filterStudents(query) {
    if (!query) {
        loadStudentList(currentClass);
        return;
    }
    
    const filtered = studentsData.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.id.toLowerCase().includes(query.toLowerCase())
    );
    
    const container = document.getElementById('studentListContent');
    if (!container) return;
    
    container.innerHTML = filtered.map(student => `
        <div class="student-item" onclick="viewStudentProfile('${student.id}')">
            <div class="student-avatar">
                <img src="${student.avatar}" alt="${student.name}">
            </div>
            <div class="student-details">
                <h4>${student.name}</h4>
                <p>${student.id}</p>
            </div>
            <div class="student-score">${student.average}%</div>
        </div>
    `).join('');
}

// View student profile
function viewStudentProfile(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (student) {
        alert(`Student Profile\n\nName: ${student.name}\nID: ${student.id}\nAverage: ${student.average}%\n\nDetailed profile will be shown here.`);
    }
}

// Load flagged students
function loadFlaggedStudents(className) {
    const flagged = studentsData
        .filter(s => s.average < 70)
        .slice(0, 5);
    
    const container = document.getElementById('flaggedStudentsContent');
    if (!container) return;
    
    container.innerHTML = flagged.length > 0 ? flagged.map(student => `
        <div class="activity-item">
            <div class="activity-icon warning">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="activity-details">
                <h4>${student.name}</h4>
                <p>Average: ${student.average}% - Below target</p>
            </div>
        </div>
    `).join('') : '<p style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">No students flagged</p>';
}

// Live Classes Functions
function showScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.classList.add('active');
        
        // Set default date to today
        const dateInput = document.getElementById('scheduleDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function scheduleClass() {
    const classSelect = document.getElementById('scheduleClass');
    const subject = document.getElementById('scheduleSubject');
    const date = document.getElementById('scheduleDate');
    const time = document.getElementById('scheduleTime');
    const duration = document.getElementById('scheduleDuration');
    const recording = document.getElementById('scheduleRecording');
    
    if (!subject.value || !date.value || !time.value) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newClass = {
        id: `CLS-${Date.now()}`,
        class: classSelect.value,
        subject: subject.value,
        date: date.value,
        time: time.value,
        duration: duration.value,
        recording: recording.checked,
        status: 'scheduled'
    };
    
    scheduledClasses.push(newClass);
    loadScheduledClasses();
    closeScheduleModal();
    
    alert(`Class scheduled successfully!\n\n${subject.value} - ${classSelect.value}\n${date.value} at ${time.value}\nDuration: ${duration.value} minutes\nRecording: ${recording.checked ? 'Enabled' : 'Disabled'}`);
}

function loadScheduledClasses() {
    // Add some default scheduled classes
    if (scheduledClasses.length === 0) {
        scheduledClasses = [
            {
                id: 'CLS-001',
                class: '10-A',
                subject: 'Mathematics',
                date: '2025-12-27',
                time: '10:00',
                duration: 60,
                recording: true,
                status: 'scheduled'
            },
            {
                id: 'CLS-002',
                class: '11-A',
                subject: 'Advanced Calculus',
                date: '2025-12-28',
                time: '14:00',
                duration: 90,
                recording: true,
                status: 'scheduled'
            }
        ];
    }
    
    const container = document.getElementById('scheduledClassesContent');
    if (!container) return;
    
    container.innerHTML = scheduledClasses.map(cls => {
        const dateObj = new Date(cls.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return `
            <div class="class-schedule-item">
                <div class="class-schedule-time">
                    <div class="date">${formattedDate}</div>
                    <div class="time">${cls.time}</div>
                </div>
                <div class="class-schedule-details">
                    <h4>${cls.subject} - ${cls.class}</h4>
                    <p>Duration: ${cls.duration} minutes • Recording: ${cls.recording ? 'Enabled' : 'Disabled'}</p>
                    <div class="class-actions">
                        <button class="class-action-btn primary" onclick="startLiveClass('${cls.id}')">
                            <i class="fas fa-video"></i> Start
                        </button>
                        <button class="class-action-btn" onclick="editScheduledClass('${cls.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="class-action-btn" onclick="cancelScheduledClass('${cls.id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Load recordings
    loadRecordings();
}

function startLiveClass(classId) {
    const cls = scheduledClasses.find(c => c.id === classId);
    if (cls) {
        alert(`Starting Live Class\n\n${cls.subject} - ${cls.class}\n\nJitsi Meet integration will launch here.\n\nMeeting Room: ${classId}`);
        // In a real app, this would open Jitsi Meet or similar video conferencing
    }
}

function editScheduledClass(classId) {
    alert('Edit scheduled class functionality\n\nThis will open the schedule modal with pre-filled data.');
}

function cancelScheduledClass(classId) {
    if (confirm('Are you sure you want to cancel this scheduled class?')) {
        scheduledClasses = scheduledClasses.filter(c => c.id !== classId);
        loadScheduledClasses();
        alert('Class cancelled successfully.');
    }
}

function loadRecordings() {
    const recordings = [
        {
            id: 'REC-001',
            title: 'Mathematics - Chapter 5 Review',
            date: '2025-12-20',
            duration: '1:15:30',
            size: '450 MB'
        },
        {
            id: 'REC-002',
            title: 'Calculus - Integration Techniques',
            date: '2025-12-18',
            duration: '1:05:20',
            size: '380 MB'
        }
    ];
    
    const container = document.getElementById('recordingsContent');
    if (!container) return;
    
    container.innerHTML = recordings.map(rec => `
        <div class="activity-item">
            <div class="activity-icon success">
                <i class="fas fa-film"></i>
            </div>
            <div class="activity-details">
                <h4>${rec.title}</h4>
                <p>${rec.date} • ${rec.duration} • ${rec.size}</p>
                <div style="margin-top: 10px;">
                    <button class="class-action-btn" onclick="playRecording('${rec.id}')">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button class="class-action-btn" onclick="downloadRecording('${rec.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function playRecording(recordingId) {
    alert(`Playing recording: ${recordingId}\n\nVideo player will open here.`);
}

function downloadRecording(recordingId) {
    alert(`Downloading recording: ${recordingId}\n\nDownload will start...`);
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
            closeScheduleModal();
            
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Close modal when clicking outside
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeScheduleModal();
            }
        });
    }
    
    console.log('Teacher dashboard initialized');
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadTeacherData,
        toggleSidebar,
        navigateTo,
        selectInputMethod,
        updateQuestionCount,
        updateDifficulty,
        generateAssessment,
        switchClass,
        filterStudents,
        viewStudentProfile,
        showScheduleModal,
        closeScheduleModal,
        scheduleClass,
        startLiveClass,
        initializeDashboard
    };
}
