/**
 * QGX Platform - Student Dashboard Functions
 * Handles student-specific functionality
 */

// Global variables
let currentQuiz = null;
let quizTimer = null;
let voiceRecognition = null;
let selectedAnswers = {};

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const userData = checkLogin();
    
    if (userData) {
        // Load all student data
        loadStudentData();
        
        // Load timetable
        loadTimetable();
        
        // Load assessments
        loadAssessments();
        
        // Generate activity heatmap
        generateHeatmap();
        
        // Initialize dashboard features
        initializeDashboard();
    }
});

// Load student data into dashboard
function loadStudentData() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!userData || !userData.name) {
        console.error('No user data found');
        return;
    }
    
    // Update profile card
    updateElement('profilePhoto', userData.photo, 'img');
    updateElement('profileName', userData.name);
    updateElement('profileId', userData.id);
    updateElement('xpPoints', `${userData.xp} XP`);
    
    // Update student card widget
    updateElement('studentCardName', userData.name);
    updateElement('studentCardId', userData.id);
    updateElement('welcomeName', userData.name.split(' ')[0]);
    
    // Calculate XP progress
    const currentXP = userData.xp || 0;
    const currentLevel = userData.level || 1;
    const xpForNextLevel = currentLevel * 300; // 300 XP per level
    const xpProgress = ((currentXP % 300) / 300) * 100;
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = `${xpProgress}%`;
    }
    
    // Update XP display
    const xpValue = document.querySelector('.xp-value');
    const xpLabel = document.querySelector('.xp-label');
    const xpInfo = document.querySelector('.xp-info');
    
    if (xpValue) {
        xpValue.textContent = `${currentXP % 300} / ${300} XP`;
    }
    
    if (xpLabel) {
        xpLabel.textContent = `Level ${currentLevel}`;
    }
    
    if (xpInfo) {
        const xpNeeded = 300 - (currentXP % 300);
        xpInfo.textContent = `${xpNeeded} XP to next level`;
    }
    
    // Generate performance tags
    generatePerformanceTags(userData);
    
    console.log('Student data loaded:', userData);
}

// Helper function to update DOM elements
function updateElement(id, value, type = 'text') {
    const element = document.getElementById(id);
    if (!element) return;
    
    if (type === 'img') {
        const img = element.querySelector('img');
        if (img) img.src = value;
    } else {
        element.textContent = value;
    }
}

// Generate performance tags based on user data
function generatePerformanceTags(userData) {
    const tagsContainer = document.querySelector('.performance-tags');
    if (!tagsContainer || !userData.badges) return;
    
    tagsContainer.innerHTML = '';
    
    const tagColors = {
        'Fast Learner': 'purple',
        'Perfect Score': 'gold',
        'Consistent': 'blue',
        'Top Performer': 'purple',
        'Quick Thinker': 'gold'
    };
    
    const tagIcons = {
        'Fast Learner': 'fa-bolt',
        'Perfect Score': 'fa-trophy',
        'Consistent': 'fa-check-circle',
        'Top Performer': 'fa-star',
        'Quick Thinker': 'fa-brain'
    };
    
    userData.badges.forEach(badge => {
        const tag = document.createElement('span');
        tag.className = `tag ${tagColors[badge] || 'blue'}`;
        tag.innerHTML = `<i class="fas ${tagIcons[badge] || 'fa-award'}"></i> ${badge}`;
        tagsContainer.appendChild(tag);
    });
}

// Load weekly timetable
function loadTimetable() {
    const timetableData = [
        { time: '8:00 AM', subject: 'Mathematics', room: 'Room 204', teacher: 'Mr. Anderson', type: 'lecture', color: '#667eea' },
        { time: '9:30 AM', subject: 'Physics', room: 'Lab 3', teacher: 'Dr. Martinez', type: 'lab', color: '#f5576c' },
        { time: '11:00 AM', subject: 'Chemistry', room: 'Lab 1', teacher: 'Ms. Thompson', type: 'lab', color: '#4facfe', current: true },
        { time: '1:00 PM', subject: 'English', room: 'Room 105', teacher: 'Mrs. Davis', type: 'lecture', color: '#ffd700' }
    ];
    
    const timelineContainer = document.querySelector('.timetable-widget .widget-content');
    if (!timelineContainer) return;
    
    timelineContainer.innerHTML = '';
    
    timetableData.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item${item.current ? ' active' : ''}`;
        timelineItem.style.borderLeftColor = item.color;
        
        timelineItem.innerHTML = `
            <div class="timeline-time">${item.time}</div>
            <div class="timeline-content">
                <h4>${item.subject}</h4>
                <p>${item.room} • ${item.teacher}</p>
                ${item.current ? '<span class="current-badge">Current</span>' : ''}
            </div>
        `;
        
        // Add click event for live classes
        timelineItem.style.cursor = 'pointer';
        timelineItem.addEventListener('click', () => {
            alert(`Joining ${item.subject} class...\n\nTeacher: ${item.teacher}\nRoom: ${item.room}\n\nThis feature will be implemented soon!`);
        });
        
        timelineContainer.appendChild(timelineItem);
    });
    
    console.log('Timetable loaded');
}

// Load assessments
function loadAssessments() {
    const assessmentsData = [
        {
            id: 'math-quiz-001',
            subject: 'Mathematics',
            title: 'Mathematics Quiz',
            description: 'Chapter 5: Trigonometry',
            date: 'Tomorrow, 9:00 AM',
            icon: 'fa-calculator',
            status: 'upcoming',
            urgent: true,
            questions: generateQuizQuestions('math')
        },
        {
            id: 'physics-test-001',
            subject: 'Physics',
            title: 'Physics Test',
            description: 'Unit 3: Thermodynamics',
            date: 'Dec 28, 11:00 AM',
            icon: 'fa-atom',
            status: 'upcoming',
            questions: generateQuizQuestions('physics')
        },
        {
            id: 'chem-lab-001',
            subject: 'Chemistry',
            title: 'Chemistry Lab Report',
            description: 'Experiment 12',
            date: 'Jan 2, 2:00 PM',
            icon: 'fa-flask',
            status: 'upcoming',
            questions: generateQuizQuestions('chemistry')
        },
        {
            id: 'english-essay-001',
            subject: 'English',
            title: 'English Essay',
            description: 'Literary Analysis',
            date: 'Completed',
            icon: 'fa-book',
            status: 'completed',
            score: 92
        }
    ];
    
    const assessmentsContainer = document.querySelector('.assessments-widget .widget-content');
    if (!assessmentsContainer) return;
    
    assessmentsContainer.innerHTML = '';
    
    // Filter and show only upcoming assessments (first 3)
    const upcomingAssessments = assessmentsData.filter(a => a.status === 'upcoming').slice(0, 3);
    
    upcomingAssessments.forEach(assessment => {
        const assessmentItem = document.createElement('div');
        assessmentItem.className = `assessment-item${assessment.urgent ? ' urgent' : ''}`;
        
        assessmentItem.innerHTML = `
            <div class="assessment-icon">
                <i class="fas ${assessment.icon}"></i>
            </div>
            <div class="assessment-details">
                <h4>${assessment.title}</h4>
                <p>${assessment.description}</p>
                <span class="assessment-date"><i class="fas fa-clock"></i> ${assessment.date}</span>
            </div>
            <button class="assessment-btn" onclick="startAssessment('${assessment.id}')">Start</button>
        `;
        
        assessmentsContainer.appendChild(assessmentItem);
    });
    
    // Store assessments data globally
    window.assessmentsData = assessmentsData;
    
    console.log('Assessments loaded');
}

// Generate quiz questions based on subject
function generateQuizQuestions(subject) {
    const questions = {
        math: [
            {
                id: 1,
                question: 'What is the value of sin(90°)?',
                options: ['0', '1', '-1', 'undefined'],
                correct: 1
            },
            {
                id: 2,
                question: 'In a right triangle, what is cos(0°)?',
                options: ['0', '0.5', '1', 'undefined'],
                correct: 2
            },
            {
                id: 3,
                question: 'What is tan(45°)?',
                options: ['0', '1', '√2', '√3'],
                correct: 1
            },
            {
                id: 4,
                question: 'The hypotenuse of a right triangle is always:',
                options: ['The shortest side', 'The longest side', 'Equal to one leg', 'Half the perimeter'],
                correct: 1
            },
            {
                id: 5,
                question: 'What is the period of sin(x)?',
                options: ['π', '2π', 'π/2', '4π'],
                correct: 1
            }
        ],
        physics: [
            {
                id: 1,
                question: 'The first law of thermodynamics is based on:',
                options: ['Conservation of energy', 'Conservation of mass', 'Conservation of momentum', 'Entropy'],
                correct: 0
            },
            {
                id: 2,
                question: 'Which process has no heat transfer?',
                options: ['Isothermal', 'Adiabatic', 'Isobaric', 'Isochoric'],
                correct: 1
            },
            {
                id: 3,
                question: 'In an ideal gas, temperature is directly proportional to:',
                options: ['Pressure only', 'Volume only', 'Kinetic energy of molecules', 'Potential energy'],
                correct: 2
            }
        ],
        chemistry: [
            {
                id: 1,
                question: 'What is the pH of a neutral solution?',
                options: ['0', '7', '14', '1'],
                correct: 1
            },
            {
                id: 2,
                question: 'Which element has the symbol Fe?',
                options: ['Fluorine', 'Iron', 'Fermium', 'Francium'],
                correct: 1
            },
            {
                id: 3,
                question: 'What type of bond shares electrons?',
                options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'],
                correct: 1
            }
        ]
    };
    
    return questions[subject] || questions.math;
}

// Generate 365-day activity heatmap
function generateHeatmap() {
    const heatmapContainer = document.getElementById('activityHeatmap');
    
    if (!heatmapContainer) return;
    
    heatmapContainer.innerHTML = '';
    
    // Generate activity data for last 84 days (12 weeks)
    const activityData = [];
    const today = new Date();
    
    for (let i = 83; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Generate random activity level (0-4)
        // Higher activity on weekdays, lower on weekends
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const baseLevel = isWeekend ? 1 : 3;
        const randomVariation = Math.floor(Math.random() * 2);
        const level = Math.min(4, Math.max(0, baseLevel + randomVariation - 1));
        
        activityData.push({
            date: date,
            level: level,
            activities: level * 2 + Math.floor(Math.random() * 3)
        });
    }
    
    // Create heatmap cells
    activityData.forEach(day => {
        const cell = document.createElement('div');
        cell.className = `heatmap-cell level-${day.level}`;
        
        const dateStr = day.date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        cell.title = `${dateStr}: ${day.activities} activities`;
        
        // Add hover effect
        cell.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
        });
        
        cell.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        heatmapContainer.appendChild(cell);
    });
    
    console.log('Activity heatmap generated with 84 days of data');
}

// Start assessment/quiz
function startAssessment(assessmentId) {
    const assessmentsData = window.assessmentsData || [];
    const assessment = assessmentsData.find(a => a.id === assessmentId);
    
    if (!assessment) {
        console.error('Assessment not found:', assessmentId);
        return;
    }
    
    if (assessment.status === 'completed') {
        alert(`This assessment is already completed.\n\nYour score: ${assessment.score}/100`);
        return;
    }
    
    if (!assessment.questions || assessment.questions.length === 0) {
        alert('No questions available for this assessment.');
        return;
    }
    
    // Confirm before starting
    if (!confirm(`Start ${assessment.title}?\n\n${assessment.description}\n\nMake sure you're ready before beginning.`)) {
        return;
    }
    
    // Store current quiz
    currentQuiz = {
        ...assessment,
        startTime: new Date(),
        duration: 30 // 30 minutes
    };
    
    selectedAnswers = {};
    
    // Show quiz interface
    showQuizInterface();
}

// Show quiz interface
function showQuizInterface() {
    if (!currentQuiz) return;
    
    // Create quiz modal
    const quizModal = document.createElement('div');
    quizModal.id = 'quizModal';
    quizModal.className = 'quiz-modal';
    
    quizModal.innerHTML = `
        <div class="quiz-container">
            <div class="quiz-header">
                <div class="quiz-info">
                    <h2>${currentQuiz.title}</h2>
                    <p>${currentQuiz.description}</p>
                </div>
                <div class="quiz-controls">
                    <div class="quiz-timer" id="quizTimer">30:00</div>
                    <button class="voice-toggle" id="voiceToggle" onclick="toggleVoiceControl()">
                        <i class="fas fa-microphone-slash"></i>
                    </button>
                    <button class="quiz-close" onclick="closeQuiz()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="quiz-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="quizProgress" style="width: 0%"></div>
                </div>
                <span class="progress-text" id="progressText">Question 1 of ${currentQuiz.questions.length}</span>
            </div>
            
            <div class="quiz-content" id="quizContent">
                <!-- Questions will be inserted here -->
            </div>
            
            <div class="quiz-navigation">
                <button class="nav-btn" id="prevBtn" onclick="previousQuestion()" disabled>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                <div class="question-dots" id="questionDots">
                    <!-- Question indicators will be inserted here -->
                </div>
                <button class="nav-btn primary" id="nextBtn" onclick="nextQuestion()">
                    Next <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            
            <div class="quiz-footer">
                <button class="submit-quiz-btn" id="submitQuizBtn" onclick="submitQuiz()">
                    <i class="fas fa-check-circle"></i> Submit Quiz
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(quizModal);
    
    // Initialize quiz
    currentQuiz.currentQuestion = 0;
    renderQuestion(0);
    renderQuestionDots();
    startQuizTimer();
    
    // Add modal styles dynamically
    addQuizStyles();
    
    console.log('Quiz interface shown');
}

// Render current question
function renderQuestion(questionIndex) {
    const question = currentQuiz.questions[questionIndex];
    const quizContent = document.getElementById('quizContent');
    
    if (!quizContent || !question) return;
    
    quizContent.innerHTML = `
        <div class="question-card">
            <div class="question-number">Question ${questionIndex + 1} of ${currentQuiz.questions.length}</div>
            <h3 class="question-text">${question.question}</h3>
            
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <div class="option-item ${selectedAnswers[question.id] === index ? 'selected' : ''}" 
                         onclick="selectOption(${question.id}, ${index})">
                        <div class="option-radio">
                            <span class="radio-dot"></span>
                        </div>
                        <div class="option-text">${option}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update progress
    const progress = ((questionIndex + 1) / currentQuiz.questions.length) * 100;
    const progressBar = document.getElementById('quizProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `Question ${questionIndex + 1} of ${currentQuiz.questions.length}`;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = questionIndex === 0;
    if (nextBtn) {
        if (questionIndex === currentQuiz.questions.length - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
        }
    }
}

// Render question navigation dots
function renderQuestionDots() {
    const dotsContainer = document.getElementById('questionDots');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    
    currentQuiz.questions.forEach((q, index) => {
        const dot = document.createElement('div');
        dot.className = `question-dot ${selectedAnswers[q.id] !== undefined ? 'answered' : ''} ${index === currentQuiz.currentQuestion ? 'active' : ''}`;
        dot.textContent = index + 1;
        dot.onclick = () => goToQuestion(index);
        dotsContainer.appendChild(dot);
    });
}

// Select an option
function selectOption(questionId, optionIndex) {
    selectedAnswers[questionId] = optionIndex;
    renderQuestion(currentQuiz.currentQuestion);
    renderQuestionDots();
    
    console.log(`Selected option ${optionIndex} for question ${questionId}`);
}

// Navigation functions
function nextQuestion() {
    if (currentQuiz.currentQuestion < currentQuiz.questions.length - 1) {
        currentQuiz.currentQuestion++;
        renderQuestion(currentQuiz.currentQuestion);
        renderQuestionDots();
    }
}

function previousQuestion() {
    if (currentQuiz.currentQuestion > 0) {
        currentQuiz.currentQuestion--;
        renderQuestion(currentQuiz.currentQuestion);
        renderQuestionDots();
    }
}

function goToQuestion(index) {
    currentQuiz.currentQuestion = index;
    renderQuestion(currentQuiz.currentQuestion);
    renderQuestionDots();
}

// Start quiz timer
function startQuizTimer() {
    const duration = currentQuiz.duration * 60; // Convert to seconds
    let timeRemaining = duration;
    
    quizTimer = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        const timerDisplay = document.getElementById('quizTimer');
        if (timerDisplay) {
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Warning colors
            if (timeRemaining <= 60) {
                timerDisplay.style.color = '#f5576c';
            } else if (timeRemaining <= 300) {
                timerDisplay.style.color = '#ffd700';
            }
        }
        
        if (timeRemaining <= 0) {
            clearInterval(quizTimer);
            alert('Time is up! Submitting quiz automatically...');
            submitQuiz();
        }
    }, 1000);
}

// Submit quiz
function submitQuiz() {
    // Check if all questions are answered
    const unanswered = currentQuiz.questions.filter(q => selectedAnswers[q.id] === undefined);
    
    if (unanswered.length > 0) {
        if (!confirm(`You have ${unanswered.length} unanswered question(s).\n\nDo you want to submit anyway?`)) {
            return;
        }
    }
    
    // Calculate score
    let correctAnswers = 0;
    currentQuiz.questions.forEach(q => {
        if (selectedAnswers[q.id] === q.correct) {
            correctAnswers++;
        }
    });
    
    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    
    // Clear timer
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    // Show results
    const quizContent = document.getElementById('quizContent');
    if (quizContent) {
        quizContent.innerHTML = `
            <div class="quiz-results">
                <div class="results-icon">
                    <i class="fas ${score >= 70 ? 'fa-trophy' : 'fa-check-circle'}"></i>
                </div>
                <h2>Quiz Completed!</h2>
                <div class="score-display">
                    <div class="score-circle">
                        <span class="score-value">${score}%</span>
                    </div>
                </div>
                <div class="results-stats">
                    <div class="stat">
                        <i class="fas fa-check"></i>
                        <span>${correctAnswers} Correct</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-times"></i>
                        <span>${currentQuiz.questions.length - correctAnswers} Incorrect</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>+${score} XP</span>
                    </div>
                </div>
                <button class="close-results-btn" onclick="closeQuiz()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        `;
    }
    
    // Update user XP
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.xp = (userData.xp || 0) + score;
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Hide navigation
    const nav = document.querySelector('.quiz-navigation');
    const footer = document.querySelector('.quiz-footer');
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    console.log(`Quiz submitted. Score: ${score}%`);
}

// Close quiz modal
function closeQuiz() {
    if (currentQuiz && quizTimer) {
        if (!confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
            return;
        }
        clearInterval(quizTimer);
    }
    
    const quizModal = document.getElementById('quizModal');
    if (quizModal) {
        quizModal.remove();
    }
    
    currentQuiz = null;
    selectedAnswers = {};
    
    // Stop voice recognition if active
    if (voiceRecognition) {
        voiceRecognition.stop();
        voiceRecognition = null;
    }
}

// Setup voice control
function setupVoiceControl() {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice control is not supported in your browser.\n\nPlease use Chrome, Edge, or Safari.');
        return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceRecognition = new SpeechRecognition();
    
    voiceRecognition.continuous = true;
    voiceRecognition.interimResults = false;
    voiceRecognition.lang = 'en-US';
    
    voiceRecognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        
        console.log('Voice command:', command);
        handleVoiceCommand(command);
    };
    
    voiceRecognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
    };
    
    voiceRecognition.onend = () => {
        // Restart if still active
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle && voiceToggle.classList.contains('active')) {
            voiceRecognition.start();
        }
    };
    
    return true;
}

// Handle voice commands
function handleVoiceCommand(command) {
    // Show feedback
    showVoiceFeedback(command);
    
    // Option selection commands
    if (command.includes('option a') || command.includes('select a')) {
        selectCurrentOption(0);
    } else if (command.includes('option b') || command.includes('select b')) {
        selectCurrentOption(1);
    } else if (command.includes('option c') || command.includes('select c')) {
        selectCurrentOption(2);
    } else if (command.includes('option d') || command.includes('select d')) {
        selectCurrentOption(3);
    }
    // Navigation commands
    else if (command.includes('next question') || command.includes('next')) {
        nextQuestion();
    } else if (command.includes('previous question') || command.includes('previous') || command.includes('back')) {
        previousQuestion();
    }
    // Submit command
    else if (command.includes('submit quiz') || command.includes('submit')) {
        submitQuiz();
    }
}

// Select option for current question
function selectCurrentOption(optionIndex) {
    if (!currentQuiz) return;
    
    const question = currentQuiz.questions[currentQuiz.currentQuestion];
    if (question && optionIndex < question.options.length) {
        selectOption(question.id, optionIndex);
    }
}

// Show voice command feedback
function showVoiceFeedback(command) {
    const feedback = document.createElement('div');
    feedback.className = 'voice-feedback';
    feedback.textContent = `"${command}"`;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Toggle voice control
function toggleVoiceControl() {
    const voiceToggle = document.getElementById('voiceToggle');
    if (!voiceToggle) return;
    
    if (voiceToggle.classList.contains('active')) {
        // Disable voice control
        if (voiceRecognition) {
            voiceRecognition.stop();
        }
        voiceToggle.classList.remove('active');
        voiceToggle.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    } else {
        // Enable voice control
        if (!voiceRecognition) {
            if (!setupVoiceControl()) {
                return;
            }
        }
        
        try {
            voiceRecognition.start();
            voiceToggle.classList.add('active');
            voiceToggle.innerHTML = '<i class="fas fa-microphone"></i>';
            showVoiceFeedback('Voice control activated');
        } catch (error) {
            console.error('Failed to start voice recognition:', error);
        }
    }
}

// Add quiz styles dynamically
function addQuizStyles() {
    if (document.getElementById('quizStyles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'quizStyles';
    styles.textContent = `
        .quiz-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .quiz-container {
            background: #0f0f0f;
            border: 1px solid #1a1a1a;
            border-radius: 20px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            padding: 30px;
        }
        
        .quiz-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #1a1a1a;
        }
        
        .quiz-info h2 {
            font-size: 24px;
            margin-bottom: 8px;
            color: #ffffff;
        }
        
        .quiz-info p {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .quiz-controls {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .quiz-timer {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
            min-width: 70px;
        }
        
        .voice-toggle, .quiz-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            color: #ffffff;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .voice-toggle:hover, .quiz-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .voice-toggle.active {
            background: #f5576c;
        }
        
        .quiz-progress {
            margin-bottom: 30px;
        }
        
        .progress-text {
            display: block;
            text-align: center;
            margin-top: 10px;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .question-card {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 25px;
        }
        
        .question-number {
            font-size: 12px;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        
        .question-text {
            font-size: 20px;
            margin-bottom: 25px;
            color: #ffffff;
            line-height: 1.6;
        }
        
        .options-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .option-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 18px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid transparent;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .option-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: #667eea;
        }
        
        .option-item.selected {
            background: rgba(102, 126, 234, 0.2);
            border-color: #667eea;
        }
        
        .option-radio {
            width: 24px;
            height: 24px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .option-item.selected .option-radio {
            border-color: #667eea;
        }
        
        .radio-dot {
            width: 12px;
            height: 12px;
            background: transparent;
            border-radius: 50%;
        }
        
        .option-item.selected .radio-dot {
            background: #667eea;
        }
        
        .option-text {
            flex: 1;
            font-size: 16px;
            color: #ffffff;
        }
        
        .quiz-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .nav-btn {
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 10px;
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .nav-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .nav-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .nav-btn.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .question-dots {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .question-dot {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .question-dot:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .question-dot.answered {
            background: rgba(102, 126, 234, 0.3);
        }
        
        .question-dot.active {
            background: #667eea;
        }
        
        .quiz-footer {
            text-align: center;
        }
        
        .submit-quiz-btn, .close-results-btn {
            padding: 15px 40px;
            background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
            border: none;
            border-radius: 12px;
            color: #000;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        }
        
        .submit-quiz-btn:hover, .close-results-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
        }
        
        .quiz-results {
            text-align: center;
            padding: 40px 20px;
        }
        
        .results-icon {
            font-size: 80px;
            color: #ffd700;
            margin-bottom: 20px;
        }
        
        .quiz-results h2 {
            font-size: 32px;
            margin-bottom: 30px;
        }
        
        .score-circle {
            width: 200px;
            height: 200px;
            margin: 0 auto 30px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .score-value {
            font-size: 64px;
            font-weight: 700;
            color: #ffffff;
        }
        
        .results-stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .results-stats .stat {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
        }
        
        .results-stats .stat i {
            font-size: 24px;
            color: #667eea;
        }
        
        .voice-feedback {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #667eea;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Navigate to different sections
function navigateTo(section) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    if (event && event.target) {
        const navItem = event.target.closest('.nav-item');
        if (navItem) {
            navItem.classList.add('active');
        }
    }
    
    // Update page title
    const pageTitle = document.querySelector('.page-title');
    const sectionTitles = {
        dashboard: 'Dashboard',
        timetable: 'Timetable',
        assessments: 'Assessments',
        materials: 'Study Materials',
        forums: 'Forums',
        messages: 'Messages',
        settings: 'Settings'
    };
    
    if (pageTitle && sectionTitles[section]) {
        pageTitle.textContent = sectionTitles[section];
    }
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
    
    console.log(`Navigated to: ${section}`);
}

// Quick start assessment
function quickStartAssessment() {
    console.log('Quick start assessment clicked');
    const assessmentsData = window.assessmentsData || [];
    const upcomingAssessments = assessmentsData.filter(a => a.status === 'upcoming');
    
    if (upcomingAssessments.length > 0) {
        startAssessment(upcomingAssessments[0].id);
    } else {
        alert('No upcoming assessments available.');
    }
}

// View notifications
function viewNotifications() {
    console.log('View notifications clicked');
    alert('You have 5 new notifications:\n\n1. New assignment posted\n2. Upcoming test reminder\n3. Forum reply\n4. Badge earned\n5. XP milestone reached');
}

// View full timetable
function viewFullTimetable() {
    console.log('View full timetable clicked');
    navigateTo('timetable');
}

// View all assessments
function viewAllAssessments() {
    console.log('View all assessments clicked');
    navigateTo('assessments');
}

// View all activity
function viewAllActivity() {
    console.log('View all activity clicked');
    alert('Activity History\n\nShowing all your recent activities and achievements.');
}

// Initialize dashboard features
function initializeDashboard() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add intersection observer for widget animations
    const widgets = document.querySelectorAll('.widget');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const widgetObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    widgets.forEach(widget => {
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(20px)';
        widget.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        widgetObserver.observe(widget);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('active');
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for quick search (future feature)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            console.log('Quick search triggered (not implemented)');
        }
        
        // ESC to close sidebar on mobile or close quiz
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
            
            const quizModal = document.getElementById('quizModal');
            if (quizModal) {
                closeQuiz();
            }
        }
    });
    
    console.log('Dashboard initialized');
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadStudentData,
        loadTimetable,
        loadAssessments,
        generateHeatmap,
        startAssessment,
        showQuizInterface,
        setupVoiceControl,
        toggleSidebar,
        navigateTo,
        quickStartAssessment,
        viewNotifications,
        viewFullTimetable,
        viewAllAssessments,
        viewAllActivity,
        initializeDashboard
    };
}