// Section 5 - Aura Suit & Strider JavaScript

$(document).ready(function() {
    // Generate stars dynamically
    generateStars();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize hardware interactions
    initHardwareInteractions();
    
    // Initialize particle effects
    initParticleEffects();
    
    // Parallax effect for background elements
    initParallax();
    
    // Initialize movement simulation
    initMovementSimulation();
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

// Initialize hardware interactions
function initHardwareInteractions() {
    // Aura Suit interactions
    const auraSuit = document.querySelector('.aura-suit');
    if (auraSuit) {
        auraSuit.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            
            // Enhance stimulator activity
            const stimulators = this.querySelectorAll('.stimulator');
            stimulators.forEach((stim, index) => {
                stim.style.animation = `stimulator-pulse 0.5s ease-in-out infinite`;
                stim.style.animationDelay = (index * 0.1) + 's';
            });
        });
        
        auraSuit.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            
            // Reset stimulator timing
            const stimulators = this.querySelectorAll('.stimulator');
            stimulators.forEach((stim, index) => {
                stim.style.animation = `stimulator-pulse 2s ease-in-out infinite`;
                stim.style.animationDelay = (index * 0.2) + 's';
            });
        });
        
        // Add click interaction for haptic feedback simulation
        auraSuit.addEventListener('click', function() {
            simulateHapticFeedback();
        });
    }
    
    // Strider Platform interactions
    const striderPlatform = document.querySelector('.strider-platform');
    if (striderPlatform) {
        striderPlatform.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            
            // Enhance movement indicators
            const movementLines = this.querySelectorAll('.movement-line');
            movementLines.forEach((line, index) => {
                line.style.animation = 'movement-flow 1s ease-in-out infinite';
                line.style.animationDelay = (index * 0.2) + 's';
            });
        });
        
        striderPlatform.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            
            // Reset movement indicators
            const movementLines = this.querySelectorAll('.movement-line');
            movementLines.forEach((line, index) => {
                line.style.animation = 'movement-flow 3s ease-in-out infinite';
                line.style.animationDelay = (index * 0.5) + 's';
            });
        });
        
        // Add click interaction for movement simulation
        striderPlatform.addEventListener('click', function() {
            simulateMovement();
        });
    }
}

// Simulate haptic feedback
function simulateHapticFeedback() {
    const stimulators = document.querySelectorAll('.stimulator');
    const feedback = document.createElement('div');
    feedback.className = 'haptic-feedback';
    feedback.textContent = 'Haptic Feedback Active';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(100, 200, 255, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 20px;
        font-size: 1.2rem;
        z-index: 1000;
        animation: feedback-fade 2s ease-in-out;
    `;
    
    document.body.appendChild(feedback);
    
    // Intensify stimulator pulses
    stimulators.forEach((stim, index) => {
        stim.style.animation = `stimulator-pulse 0.3s ease-in-out infinite`;
        stim.style.animationDelay = (index * 0.05) + 's';
        
        setTimeout(() => {
            stim.style.animation = `stimulator-pulse 2s ease-in-out infinite`;
            stim.style.animationDelay = (index * 0.2) + 's';
        }, 2000);
    });
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Simulate movement
function simulateMovement() {
    const platform = document.querySelector('.platform-surface');
    const movementLines = document.querySelectorAll('.movement-line');
    const feedback = document.createElement('div');
    feedback.className = 'movement-feedback';
    feedback.textContent = 'Movement Detected';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(150, 100, 255, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 20px;
        font-size: 1.2rem;
        z-index: 1000;
        animation: feedback-fade 2s ease-in-out;
    `;
    
    document.body.appendChild(feedback);
    
    // Enhance platform rotation
    platform.style.animation = 'platform-rotate 5s linear infinite';
    
    // Intensify movement lines
    movementLines.forEach((line, index) => {
        line.style.animation = 'movement-flow 0.5s ease-in-out infinite';
        line.style.animationDelay = (index * 0.1) + 's';
        
        setTimeout(() => {
            line.style.animation = 'movement-flow 3s ease-in-out infinite';
            line.style.animationDelay = (index * 0.5) + 's';
        }, 2000);
    });
    
    setTimeout(() => {
        platform.style.animation = 'platform-rotate 20s linear infinite';
        feedback.remove();
    }, 2000);
}

// Initialize particle effects
function initParticleEffects() {
    const particles = document.querySelectorAll('.particle');
    
    // Add random variations to particle movement
    particles.forEach((particle, index) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        particle.style.left = randomX + '%';
        particle.style.top = randomY + '%';
        
        // Add random size variations
        const randomSize = 4 + Math.random() * 4;
        particle.style.width = randomSize + 'px';
        particle.style.height = randomSize + 'px';
    });
}

// Initialize movement simulation
function initMovementSimulation() {
    // Simulate walking patterns
    setInterval(() => {
        const movementLines = document.querySelectorAll('.movement-line');
        const randomLine = movementLines[Math.floor(Math.random() * movementLines.length)];
        
        if (randomLine) {
            randomLine.style.animation = 'movement-flow 1s ease-in-out';
            setTimeout(() => {
                randomLine.style.animation = 'movement-flow 3s ease-in-out infinite';
            }, 1000);
        }
    }, 3000);
    
    // Simulate stimulator activity
    setInterval(() => {
        const stimulators = document.querySelectorAll('.stimulator');
        const randomStim = stimulators[Math.floor(Math.random() * stimulators.length)];
        
        if (randomStim) {
            randomStim.style.animation = 'stimulator-pulse 0.5s ease-in-out';
            setTimeout(() => {
                randomStim.style.animation = 'stimulator-pulse 2s ease-in-out infinite';
            }, 500);
        }
    }, 2000);
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
    
    // Animate hardware elements on load
    const hardwareElements = document.querySelectorAll('.aura-suit, .strider-platform');
    hardwareElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            element.style.transition = 'all 1s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 1000 + (index * 500));
    });
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
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease-in;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .aura-suit, .strider-platform {
        transition: all 0.3s ease;
    }
    
    .stimulator {
        transition: all 0.3s ease;
    }
    
    .movement-line {
        transition: all 0.3s ease;
    }
    
    @keyframes feedback-fade {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(animationStyles);

// Add responsive behavior
function handleResize() {
    const hardwareScene = document.querySelector('.hardware-scene');
    if (hardwareScene) {
        if (window.innerWidth <= 768) {
            hardwareScene.style.flexDirection = 'column';
            hardwareScene.style.height = '800px';
            hardwareScene.style.gap = '2rem';
        } else {
            hardwareScene.style.flexDirection = 'row';
            hardwareScene.style.height = '600px';
            hardwareScene.style.gap = '0';
        }
    }
}

window.addEventListener('resize', handleResize);
handleResize(); // Initial call

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('aura-suit') || 
            focusedElement.classList.contains('strider-platform')) {
            e.preventDefault();
            focusedElement.click();
        }
    }
});

// Add touch support for mobile
document.addEventListener('touchstart', function(e) {
    const target = e.target.closest('.aura-suit, .strider-platform');
    if (target) {
        target.style.transform = 'scale(0.98)';
    }
});

document.addEventListener('touchend', function(e) {
    const target = e.target.closest('.aura-suit, .strider-platform');
    if (target) {
        target.style.transform = '';
    }
});

// Add performance optimization
function optimizePerformance() {
    // Reduce animation complexity on mobile
    if (window.innerWidth <= 768) {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 4) {
                particle.style.display = 'none';
            }
        });
        
        const stimulators = document.querySelectorAll('.stimulator');
        stimulators.forEach((stim, index) => {
            if (index > 6) {
                stim.style.display = 'none';
            }
        });
    }
}

// Call performance optimization
optimizePerformance();
window.addEventListener('resize', optimizePerformance); 