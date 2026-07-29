/* ====================================================
   INITIALIZE ON DOM LOAD
   ==================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeSkills();
    initializeStatistics();
    initializeBackToTop();
    initializeForm();
    initializeMouseGlow();
    initializeSmoothScroll();
    initializeTypingAnimation();
});

/* ====================================================
   NAVIGATION & SCROLL EFFECTS
   ==================================================== */

function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    // Active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinksContainer.style.display = 
                navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Close mobile menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                navLinksContainer.style.display = 'none';
            }
        });
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ====================================================
   TYPING ANIMATION
   ==================================================== */

function initializeTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const text = typingText.textContent;
    typingText.textContent = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 300);
}

/* ====================================================
   SCROLL ANIMATIONS
   ==================================================== */

function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all project cards and skill categories
    document.querySelectorAll('.project-card, .skill-category, .ml-card, .soft-skill-card, .exp-item, .stat-card').forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

/* ====================================================
   SKILLS SECTION
   ==================================================== */

function initializeSkills() {
    const skillCategories = document.querySelectorAll('.skill-category');

    skillCategories.forEach(category => {
        const header = category.querySelector('.skill-header');
        
        header.addEventListener('click', () => {
            // Close other categories
            skillCategories.forEach(otherCategory => {
                if (otherCategory !== category && otherCategory.classList.contains('active')) {
                    otherCategory.classList.remove('active');
                }
            });

            // Toggle current category
            category.classList.toggle('active');

            // Animate progress bars when opened
            if (category.classList.contains('active')) {
                const progressBars = category.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
        });

        // Open first category by default
        if (category === skillCategories[0]) {
            category.classList.add('active');
        }
    });
}

/* ====================================================
   STATISTICS COUNTER ANIMATION
   ==================================================== */

function initializeStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                animateCounter(stat, target);
            });
        }
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        observer.observe(statNumbers[0].closest('.stat-card'));
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / 50);
}

/* ====================================================
   BACK TO TOP BUTTON
   ==================================================== */

function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ====================================================
   CONTACT FORM
   ==================================================== */

function initializeForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            // Validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email', 'error');
                return;
            }

            // Show success message
            showNotification('Message sent successfully! I will get back to you soon.', 'success');

            // Reset form
            this.reset();
        });
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 0.5rem;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/* ====================================================
   MOUSE GLOW EFFECT
   ==================================================== */

function initializeMouseGlow() {
    const mouseGlow = document.getElementById('mouseGlow');
    const heroRight = document.querySelector('.hero-right');

    if (!mouseGlow || !heroRight) return;

    heroRight.addEventListener('mousemove', (e) => {
        const rect = heroRight.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mouseGlow.style.left = (x - 150) + 'px';
        mouseGlow.style.top = (y - 150) + 'px';
    });

    heroRight.addEventListener('mouseenter', () => {
        mouseGlow.style.opacity = '1';
    });

    heroRight.addEventListener('mouseleave', () => {
        mouseGlow.style.opacity = '0';
    });
}

/* ====================================================
   MAGNETIC BUTTON HOVER
   ==================================================== */

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseout', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
});

/* ====================================================
   PARALLAX EFFECT
   ==================================================== */

window.addEventListener('scroll', () => {
    const gradientOrbs = document.querySelectorAll('.gradient-orb');
    const scrollY = window.scrollY;

    gradientOrbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.1);
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

/* ====================================================
   PROJECT CARD TILT EFFECT
   ==================================================== */

function initializeProjectTilt() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeProjectTilt);

/* ====================================================
   SCROLL PROGRESS INDICATOR
   ==================================================== */

function initializeScrollProgress() {
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #38BDF8, #6366F1, #14B8A6);
        z-index: 1000;
        width: 0;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

document.addEventListener('DOMContentLoaded', initializeScrollProgress);

/* ====================================================
   LAZY LOADING IMAGES
   ==================================================== */

function initializeLazyLoading() {
    const images = document.querySelectorAll('img');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
}

document.addEventListener('DOMContentLoaded', initializeLazyLoading);

/* ====================================================
   ACCESSIBILITY
   ==================================================== */

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navLinksContainer = document.querySelector('.nav-links');
        
        if (navLinksContainer && navLinksContainer.style.display === 'flex') {
            mobileMenuToggle.classList.remove('active');
            navLinksContainer.style.display = 'none';
        }
    }
});

// Focus visible style for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ====================================================
   PERFORMANCE OPTIMIZATION
   ==================================================== */

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for high-frequency events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Use throttle for scroll events
const throttledScroll = throttle(() => {
    // Scroll event logic
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

/* ====================================================
   UTILITY FUNCTIONS
   ==================================================== */

// Get scroll position
function getScrollPosition() {
    return {
        x: window.scrollX || window.pageXOffset,
        y: window.scrollY || window.pageYOffset
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add animation to element
function addAnimation(element, animationName, duration = 0.6) {
    element.style.animation = `${animationName} ${duration}s ease forwards`;
}

/* ====================================================
   PRINT STYLES
   ==================================================== */

const printStyles = `
    @media print {
        .navbar,
        .back-to-top,
        .scroll-indicator,
        .contact-form {
            display: none;
        }

        body {
            background: white;
            color: black;
        }

        .glass {
            background: transparent;
            border: 1px solid #ccc;
        }

        a {
            color: #0066cc;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);

/* ====================================================
   SERVICE WORKER (Optional - for PWA)
   ==================================================== */

if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js');
}

/* ====================================================
   ANALYTICS (Optional)
   ==================================================== */

// Add your analytics code here
// Example: Google Analytics, Mixpanel, etc.

/* ====================================================
   CUSTOM CURSOR (Optional Enhancement)
   ==================================================== */

function initializeCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #38BDF8;
        border-radius: 50%;
        pointer-events: none;
        display: none;
        z-index: 9999;
        opacity: 0.5;
        transition: all 0.1s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = (e.clientX - 10) + 'px';
        cursor.style.top = (e.clientY - 10) + 'px';
        cursor.style.display = 'block';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });

    // Change cursor on hover of interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .skill-header, .project-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.left = (event.clientX - 15) + 'px';
            cursor.style.top = (event.clientY - 15) + 'px';
            cursor.style.opacity = '0.8';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.opacity = '0.5';
        });
    });
}

// Uncomment to enable custom cursor
// document.addEventListener('DOMContentLoaded', initializeCustomCursor);

/* ====================================================
   ERROR HANDLING
   ==================================================== */

window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    // Send error to monitoring service
});

/* ====================================================
   LOG INITIALIZATION
   ==================================================== */

console.log('%cPortfolio Loaded Successfully ✨', 'color: #38BDF8; font-size: 16px; font-weight: bold;');
console.log('%cHamza Maqsood - AI Engineer', 'color: #6366F1; font-size: 14px;');
console.log('%cLet\'s build intelligent AI solutions together!', 'color: #14B8A6; font-size: 12px; font-style: italic;');

/* ====================================================
   END OF JAVASCRIPT
   ==================================================== */
