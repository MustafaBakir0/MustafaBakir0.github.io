// Phase 3 - The Synapse Headset JavaScript

$(document).ready(function() {
    // Generate stars dynamically
    generateStars();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize interactive effects
    initInteractiveEffects();
    
    // Parallax effect for background elements
    initParallax();
});

// Generate stars for the background
function generateStars() {
    const starLayers = document.querySelectorAll('.star-layer');
    
    starLayers.forEach((layer, layerIndex) => {
        const starCount = 50 + (layerIndex * 25); // More stars in deeper layers
        const starSize = 1 + (layerIndex * 0.5); // Larger stars in deeper layers
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = starSize + 'px';
            star.style.height = starSize + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (3 + Math.random() * 2) + 's';
            
            // Add twinkling animation
            star.style.animation = `star-twinkle ${3 + Math.random() * 2}s ease-in-out infinite`;
            
            layer.appendChild(star);
        }
    });
}

// Add twinkling animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes star-twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .spec-item, .description-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize interactive effects
function initInteractiveEffects() {
    // Headset hover effects
    const headsetCard = document.querySelector('.headset-card');
    if (headsetCard) {
        headsetCard.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotateY(10deg)';
            this.style.filter = 'drop-shadow(60px 45px 30px rgba(102, 126, 234, 0.5)) drop-shadow(-70px -50px 30px rgba(240, 147, 251, 0.5))';
        });
        
        headsetCard.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg)';
            this.style.filter = 'drop-shadow(46px 36px 24px rgba(102, 126, 234, 0.3)) drop-shadow(-55px -40px 25px rgba(240, 147, 251, 0.3))';
        });
    }
    
    // Feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Spec item interactions
    const specItems = document.querySelectorAll('.spec-item');
    specItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const value = this.querySelector('.spec-value');
            if (value) {
                value.style.color = '#f093fb';
                value.style.textShadow = '0 0 10px rgba(240, 147, 251, 0.5)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const value = this.querySelector('.spec-value');
            if (value) {
                value.style.color = '#667eea';
                value.style.textShadow = 'none';
            }
        });
    });
}

// Initialize parallax effect
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.nebula, .grid-plane');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Add smooth scrolling for navigation links
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

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate hero title on load
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 1s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Animate hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 1s ease-out 0.3s';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 800);
    }
});

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .feature-card, .spec-item, .description-content {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    
    .feature-card.animate-in, .spec-item.animate-in, .description-content.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-card:nth-child(1) { transition-delay: 0.1s; }
    .feature-card:nth-child(2) { transition-delay: 0.2s; }
    .feature-card:nth-child(3) { transition-delay: 0.3s; }
    
    .spec-item:nth-child(1) { transition-delay: 0.1s; }
    .spec-item:nth-child(2) { transition-delay: 0.2s; }
    .spec-item:nth-child(3) { transition-delay: 0.3s; }
    .spec-item:nth-child(4) { transition-delay: 0.4s; }
    .spec-item:nth-child(5) { transition-delay: 0.5s; }
    .spec-item:nth-child(6) { transition-delay: 0.6s; }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease-in;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .feature-icon i {
        transition: all 0.3s ease;
    }
    
    .spec-value {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(animationStyles);

// Add brainwave animation enhancement
function enhanceBrainwaves() {
    const waveLines = document.querySelectorAll('.wave-line');
    
    waveLines.forEach((line, index) => {
        // Add random variations to wave movement
        const randomDelay = Math.random() * 2;
        const randomDuration = 2 + Math.random() * 2;
        
        line.style.animationDelay = randomDelay + 's';
        line.style.animationDuration = randomDuration + 's';
        
        // Add wave amplitude variation
        line.style.height = (1 + Math.random()) + 'px';
    });
}

// Call brainwave enhancement
enhanceBrainwaves();

// Add sensor data simulation
function simulateSensorData() {
    const sensors = document.querySelectorAll('.sensor');
    
    sensors.forEach((sensor, index) => {
        setInterval(() => {
            const intensity = 0.3 + Math.random() * 0.7;
            sensor.style.opacity = intensity;
            sensor.style.transform = `scale(${1 + intensity * 0.5})`;
        }, 1000 + Math.random() * 2000);
    });
}

// Call sensor simulation
simulateSensorData();

// Add responsive behavior
function handleResize() {
    const headsetCard = document.querySelector('.headset-card');
    if (headsetCard) {
        if (window.innerWidth <= 768) {
            headsetCard.style.width = '300px';
            headsetCard.style.height = '300px';
        } else {
            headsetCard.style.width = '400px';
            headsetCard.style.height = '400px';
        }
    }
}

window.addEventListener('resize', handleResize);
handleResize(); // Initial call

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinkElements = navLinks.querySelectorAll('.nav-link');
        navLinkElements.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}); 