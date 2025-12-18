// script.js

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const body = document.body;

// Quiz Elements
const quizToggle = document.querySelector('.quiz-toggle');
const quizContainer = document.querySelector('.quiz-container');
const closeQuiz = document.querySelector('.close-quiz');
const questionText = document.getElementById('question-text');
const quizOptions = document.querySelectorAll('.quiz-option');
const feedbackText = document.getElementById('feedback-text');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const nextQuestionBtn = document.getElementById('next-question');

// Statistics Elements
const statCounts = document.querySelectorAll('.stat-count');

// Skills Elements
const skillItems = document.querySelectorAll('.skill-item');

// Modal Elements
const modals = document.querySelectorAll('.modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const viewProjectButtons = document.querySelectorAll('.view-project-btn');

// Project Filter Elements
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Contact Form
const contactForm = document.getElementById('contactForm');

// Quiz Data
const quizData = [
  {
    question: "What is the atomic number of Carbon?",
    options: ["6", "12", "14", "8"],
    answer: 0,
    explanation: "Carbon has 6 protons in its nucleus, giving it an atomic number of 6."
  },
  {
    question: "Which element is essential for combustion?",
    options: ["Nitrogen", "Oxygen", "Hydrogen", "Carbon Dioxide"],
    answer: 1,
    explanation: "Oxygen supports combustion and is essential for fire to burn."
  },
  {
    question: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    answer: 2,
    explanation: "The Newton (N) is the SI unit of force, named after Sir Isaac Newton."
  },
  {
    question: "Which programming language is primarily used for web development?",
    options: ["Python", "Java", "JavaScript", "C++"],
    answer: 2,
    explanation: "JavaScript is the primary language for interactive web development."
  },
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language"
    ],
    answer: 0,
    explanation: "HTML stands for Hyper Text Markup Language, the standard for creating web pages."
  }
];

let currentQuestionIndex = 0;
let score = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Initialize quiz
  loadQuestion();
  totalQuestionsElement.textContent = quizData.length;
  
  // Initialize skills animation observer
  initSkillsAnimation();
  
  // Initialize statistics counters
  initStatisticsCounters();
});

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.querySelector('i').classList.toggle('fa-bars');
  hamburger.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.querySelector('i').classList.add('fa-bars');
    hamburger.querySelector('i').classList.remove('fa-times');
  });
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  
  // Header background on scroll
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Back to top button visibility
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

// Dark/Light Mode Toggle
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  // Save preference to localStorage
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  
  // Update skill bars if they've already been animated
  if (isDarkMode) {
    // Re-trigger skill animations for dark mode
    skillItems.forEach(item => {
      const percent = item.getAttribute('data-percent');
      const progressBar = item.querySelector('.skill-progress');
      progressBar.style.width = `${percent}%`;
    });
  }
});

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
}

// Back to Top functionality
backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Project Filtering
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    
    // Filter projects
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// Project Modals
viewProjectButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  });
});

// Close Modals
closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});

// Quiz Functions
quizToggle.addEventListener('click', () => {
  quizContainer.classList.toggle('active');
});

closeQuiz.addEventListener('click', () => {
  quizContainer.classList.remove('active');
});

function loadQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;
  
  quizOptions.forEach((option, index) => {
    option.textContent = currentQuestion.options[index];
    option.classList.remove('correct', 'wrong');
    option.disabled = false;
  });
  
  feedbackText.textContent = '';
  nextQuestionBtn.style.display = 'none';
}

quizOptions.forEach(option => {
  option.addEventListener('click', () => {
    const selectedAnswer = parseInt(option.getAttribute('data-answer'));
    const correctAnswer = quizData[currentQuestionIndex].answer;
    
    // Disable all options
    quizOptions.forEach(opt => {
      opt.disabled = true;
    });
    
    // Mark correct/wrong answers
    quizOptions.forEach((opt, index) => {
      if (index === correctAnswer) {
        opt.classList.add('correct');
      } else if (index === selectedAnswer && selectedAnswer !== correctAnswer) {
        opt.classList.add('wrong');
      }
    });
    
    // Update score
    if (selectedAnswer === correctAnswer) {
      score++;
      scoreElement.textContent = score;
      feedbackText.textContent = `Correct! ${quizData[currentQuestionIndex].explanation}`;
      feedbackText.style.color = '#2ed573';
    } else {
      feedbackText.textContent = `Not quite. ${quizData[currentQuestionIndex].explanation}`;
      feedbackText.style.color = '#ff4757';
    }
    
    nextQuestionBtn.style.display = 'block';
  });
});

nextQuestionBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    // Quiz completed
    questionText.textContent = 'Quiz Completed!';
    quizOptions.forEach(option => {
      option.style.display = 'none';
    });
    feedbackText.textContent = `You scored ${score} out of ${quizData.length}!`;
    feedbackText.style.color = 'var(--primary-color)';
    nextQuestionBtn.textContent = 'Restart Quiz';
    nextQuestionBtn.onclick = () => {
      currentQuestionIndex = 0;
      score = 0;
      scoreElement.textContent = '0';
      quizOptions.forEach(option => {
        option.style.display = 'block';
      });
      nextQuestionBtn.textContent = 'Next Question';
      loadQuestion();
    };
  }
});

// Skills Animation
function initSkillsAnimation() {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percent = entry.target.getAttribute('data-percent');
        const progressBar = entry.target.querySelector('.skill-progress');
        const percentText = entry.target.querySelector('.skill-percent');
        
        // Animate progress bar
        progressBar.style.width = `${percent}%`;
        
        // Animate percentage text
        let currentPercent = 0;
        const increment = percent / 50;
        const timer = setInterval(() => {
          currentPercent += increment;
          if (currentPercent >= percent) {
            currentPercent = percent;
            clearInterval(timer);
          }
          percentText.textContent = `${Math.round(currentPercent)}%`;
        }, 30);
        
        skillObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  });
  
  skillItems.forEach(item => skillObserver.observe(item));
}

// Statistics Counters
function initStatisticsCounters() {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        const countElement = entry.target;
        
        // Animate counter
        let currentCount = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
          currentCount += increment;
          if (currentCount >= target) {
            currentCount = target;
            clearInterval(timer);
          }
          countElement.textContent = Math.round(currentCount);
        }, 20);
        
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  });
  
  statCounts.forEach(stat => statsObserver.observe(stat));
}

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form values
  const name = contactForm.querySelector('input[type="text"]').value;
  const email = contactForm.querySelector('input[type="email"]').value;
  const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
  const message = contactForm.querySelector('textarea').value;
  
  // Here you would typically send the form data to a server
  // For now, we'll just show a success message
  alert(`Thank you for your message, ${name}! I will get back to you soon at ${email}.`);
  
  // Reset form
  contactForm.reset();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Close quiz when clicking outside
document.addEventListener('click', (e) => {
  if (!quizToggle.contains(e.target) && !quizContainer.contains(e.target) && quizContainer.classList.contains('active')) {
    quizContainer.classList.remove('active');
  }
});

// Initialize project cards with animation
projectCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  cardObserver.observe(card);
});
