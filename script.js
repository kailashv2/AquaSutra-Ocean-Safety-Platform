// Mobile Menu Toggle with better touch support
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle && navMenu) {
    // Add touch event support
    mobileToggle.addEventListener('click', toggleMobileMenu);
    mobileToggle.addEventListener('touchstart', toggleMobileMenu);
    
    function toggleMobileMenu(e) {
        e.preventDefault();
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scrolling for Navigation Links
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

// Navbar scroll effect is now handled in the optimized scroll function above

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .hero-content, .section-header');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Parallax effect is now handled in the optimized scroll function above

// Button Effects (hover for desktop, touch for mobile)
document.querySelectorAll('.btn-primary, .btn-primary-large').forEach(button => {
    // Desktop hover effects
    button.addEventListener('mouseenter', function() {
        if (!isTouchDevice()) {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        }
    });
    
    button.addEventListener('mouseleave', function() {
        if (!isTouchDevice()) {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
    
    // Touch effects for mobile
    button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    button.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
});

// Utility function to detect touch devices
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Feature Card Effects (responsive to device type)
document.querySelectorAll('.feature-card').forEach(card => {
    // Desktop hover effects
    card.addEventListener('mouseenter', function() {
        if (!isTouchDevice()) {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        if (!isTouchDevice()) {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';
        }
    });
    
    // Touch effects for mobile
    card.addEventListener('touchstart', function() {
        this.style.transform = 'translateY(-4px) scale(1.01)';
        this.style.boxShadow = '0 15px 30px -8px rgb(0 0 0 / 0.2)';
    });
    
    card.addEventListener('touchend', function() {
        setTimeout(() => {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';
        }, 150);
    });
});

// Dashboard Mockup Interactive Elements
document.addEventListener('DOMContentLoaded', () => {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    // Animate chart bars on load
    setTimeout(() => {
        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.animation = 'growUp 0.8s ease-out forwards';
            }, index * 100);
        });
    }, 500);
    
    // Interactive chart bars
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
            this.style.transform = 'scaleY(1.1)';
            this.style.transformOrigin = 'bottom';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
            this.style.transform = 'scaleY(1)';
        });
    });
});

// Floating Cards Animation Enhancement
document.querySelectorAll('.floating-card').forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
        this.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
    });
});

// Ensure Hero Title is immediately visible
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Make title immediately visible
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
        heroTitle.style.visibility = 'visible';
        heroTitle.style.display = 'block';
        heroTitle.style.color = 'black';
        
        // Add smooth transition for future animations
        heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
});

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    updateCounter();
}

// Initialize counter animations when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                if (number) {
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});

// Form Validation and Interaction (for future forms)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Smooth Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Performance Optimization - Debounce Scroll Events
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

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Enhanced Accessibility and Mobile Improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
});

// Prevent zoom on double tap for iOS
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

let lastTouchEnd = 0;

// Optimize scroll performance on mobile
let ticking = false;

function updateScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    // Parallax effect (only on desktop for performance)
    if (!isTouchDevice()) {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.gradient-orb');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

// Replace the old scroll listeners with optimized version
window.addEventListener('scroll', requestScrollUpdate, { passive: true });

// Focus management for keyboard navigation
document.querySelectorAll('.btn-primary, .btn-secondary, .nav-link').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #8B5CF6';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Preload critical resources
function preloadImage(src) {
    const img = new Image();
    img.src = src;
}

// Initialize all animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Initialize any additional interactive elements
    console.log('AquaSutra Premium Website Loaded Successfully! 🚀');
});
