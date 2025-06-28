// Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeAccessibility();
    initializeExperienceToggle();
    
    console.log('Portfolio loaded successfully');
});

// Experience toggle functionality
const initializeExperienceToggle = () => {
    const showMoreBtn = document.getElementById('show-more-experience');
    const hiddenItems = document.querySelectorAll('.timeline-hidden');
    
    if (showMoreBtn && hiddenItems.length > 0) {
        showMoreBtn.addEventListener('click', () => {
            hiddenItems.forEach(item => {
                item.classList.add('show');
            });
            
            showMoreBtn.style.display = 'none';
            
            // Announce to screen reader
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Showing additional experience items');
            }
        });
    }
};

// Navigation functionality
const initializeNavigation = () => {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    
    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
};

// Scroll effects and animations
const initializeScrollEffects = () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
};

// Animation initialization
const initializeAnimations = () => {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
    const staggerItems = document.querySelectorAll('.stagger-item');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Stagger animation for grid items
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.stagger-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    const staggerContainers = document.querySelectorAll('.projects-grid, .skills-grid');
    staggerContainers.forEach(container => {
        staggerObserver.observe(container);
    });
    
    // Timeline animations
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.timeline-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 200);
                });
            }
        });
    }, observerOptions);
    
    const timelineContainer = document.querySelector('.timeline');
    if (timelineContainer) {
        timelineObserver.observe(timelineContainer);
    }
    
    // Section reveal animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('section-reveal');
    });
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
};

// Accessibility enhancements
const initializeAccessibility = () => {
    // Keyboard navigation for mobile menu
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navToggle.click();
            }
        });
        
        // Trap focus in mobile menu
        const focusableElements = navMenu.querySelectorAll('a, button, input, textarea, select');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }
    
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Announce dynamic content changes
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    
    // Make announcement function globally available
    window.announceToScreenReader = announceToScreenReader;
};

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Get element's position relative to viewport
    getElementPosition: (element) => {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            bottom: rect.bottom + window.pageYOffset,
            right: rect.right + window.pageXOffset
        };
    }
};

// Make utils globally available
window.utils = utils;

// Performance monitoring
const performanceMonitor = {
    startTime: performance.now(),
    
    logLoadTime: () => {
        const loadTime = performance.now() - performanceMonitor.startTime;
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    },
    
    logScrollPerformance: utils.throttle(() => {
        // Monitor scroll performance
        const scrollTime = performance.now();
        requestAnimationFrame(() => {
            const frameTime = performance.now() - scrollTime;
            if (frameTime > 16) { // 60fps threshold
                console.warn(`Slow scroll frame: ${frameTime.toFixed(2)}ms`);
            }
        });
    }, 100)
};

// Initialize performance monitoring
window.addEventListener('load', performanceMonitor.logLoadTime);
window.addEventListener('scroll', performanceMonitor.logScrollPerformance);

// Projects Show More Functionality
const showMoreProjectsBtn = document.getElementById('show-more-projects');
const hiddenProjects = document.querySelectorAll('.project-hidden');

if (showMoreProjectsBtn) {
    showMoreProjectsBtn.addEventListener('click', () => {
        // Add smooth transition to button
        showMoreProjectsBtn.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        showMoreProjectsBtn.style.opacity = '0';
        showMoreProjectsBtn.style.transform = 'translateY(-10px)';
        
        // Reveal projects with staggered animation
        hiddenProjects.forEach((project, index) => {
            setTimeout(() => {
                project.classList.add('show');
                // Add a subtle entrance effect
                project.style.animationDelay = `${index * 0.2}s`;
            }, index * 200);
        });
        
        // Hide button after animation
        setTimeout(() => {
            showMoreProjectsBtn.style.display = 'none';
        }, 500);
    });
} 