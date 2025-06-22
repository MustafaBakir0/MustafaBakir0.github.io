// Section 4 - Empathic Resonance JavaScript

$(document).ready(function() {
    // Generate stars dynamically
    generateStars();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize avatar interactions
    initAvatarInteractions();
    
    // Initialize emotion interactions
    initEmotionInteractions();
    
    // Parallax effect for background elements
    initParallax();
    
    // Initialize empathic flow effects
    initEmpathicFlow();
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
    const animateElements = document.querySelectorAll('.feature-card, .emotion-item, .description-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize avatar interactions
function initAvatarInteractions() {
    const avatars = document.querySelectorAll('.avatar');
    
    avatars.forEach((avatar, index) => {
        // Add hover effects
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('avatar-1') ? 
                'translateX(-50%) scale(1.05)' : 
                'translateX(50%) scale(1.05)';
            
            // Enhance aura glow
            const aura = this.querySelector('.avatar-aura');
            if (aura) {
                aura.style.opacity = '0.9';
                aura.style.transform = 'scale(1.2)';
            }
        });
        
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('avatar-1') ? 
                'translateX(-50%) scale(1)' : 
                'translateX(50%) scale(1)';
            
            // Reset aura
            const aura = this.querySelector('.avatar-aura');
            if (aura) {
                aura.style.opacity = '0.6';
                aura.style.transform = 'scale(1)';
            }
        });
        
        // Add click interaction for empathic connection
        avatar.addEventListener('click', function() {
            triggerEmpathicConnection(index);
        });
    });
}

// Trigger empathic connection between avatars
function triggerEmpathicConnection(avatarIndex) {
    const connectionLine = document.querySelector('.connection-line');
    const particles = document.querySelectorAll('.particle');
    
    // Enhance connection line
    connectionLine.style.opacity = '1';
    connectionLine.style.transform = 'translate(-50%, -50%) scaleX(1.5)';
    connectionLine.style.background = 'linear-gradient(90deg, transparent, #ffb6c1, #ffdab9, #ffc0cb, #ffb6c1, transparent)';
    
    // Animate particles
    particles.forEach((particle, index) => {
        particle.style.animation = 'particle-float 2s ease-in-out';
        particle.style.opacity = '1';
        particle.style.transform = 'scale(2)';
        
        setTimeout(() => {
            particle.style.animation = `particle-float 6s ease-in-out infinite`;
            particle.style.opacity = '0.6';
            particle.style.transform = 'scale(1)';
        }, 2000);
    });
    
    // Reset connection after animation
    setTimeout(() => {
        connectionLine.style.opacity = '0.3';
        connectionLine.style.transform = 'translate(-50%, -50%) scaleX(0.8)';
        connectionLine.style.background = 'linear-gradient(90deg, transparent, #ffb6c1, #ffdab9, #ffb6c1, transparent)';
    }, 3000);
}

// Initialize emotion interactions
function initEmotionInteractions() {
    const emotionItems = document.querySelectorAll('.emotion-item');
    
    emotionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const emotionType = this.classList[1]; // joy, curiosity, calm, excitement
            triggerEmotionEffect(emotionType);
            
            // Enhance aura
            const aura = this.querySelector('.emotion-aura');
            if (aura) {
                aura.style.opacity = '0.6';
                aura.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            // Reset aura
            const aura = this.querySelector('.emotion-aura');
            if (aura) {
                aura.style.opacity = '0';
                aura.style.transform = 'scale(1)';
            }
        });
        
        item.addEventListener('click', function() {
            const emotionType = this.classList[1];
            simulateEmotionSharing(emotionType);
        });
    });
}

// Trigger emotion effect
function triggerEmotionEffect(emotionType) {
    const avatars = document.querySelectorAll('.avatar');
    const colors = {
        joy: '#ffff00',
        curiosity: '#8a2be2',
        calm: '#00bfff',
        excitement: '#ff4500'
    };
    
    avatars.forEach(avatar => {
        const aura = avatar.querySelector('.avatar-aura');
        if (aura) {
            aura.style.background = `radial-gradient(circle, ${colors[emotionType]}40 0%, transparent 70%)`;
            aura.style.animation = 'aura-pulse 2s ease-in-out';
        }
    });
    
    // Reset after animation
    setTimeout(() => {
        avatars.forEach(avatar => {
            const aura = avatar.querySelector('.avatar-aura');
            if (aura) {
                if (avatar.classList.contains('avatar-1')) {
                    aura.style.background = 'radial-gradient(circle, rgba(255, 182, 193, 0.4) 0%, transparent 70%)';
                } else {
                    aura.style.background = 'radial-gradient(circle, rgba(255, 218, 185, 0.4) 0%, transparent 70%)';
                }
                aura.style.animation = 'aura-pulse 4s ease-in-out infinite';
            }
        });
    }, 2000);
}

// Simulate emotion sharing
function simulateEmotionSharing(emotionType) {
    const flowElements = document.querySelectorAll('.empathic-flow');
    
    flowElements.forEach((flow, index) => {
        flow.style.animation = 'flow-move 1.5s ease-in-out';
        flow.style.opacity = '1';
        flow.style.background = `linear-gradient(90deg, #ffb6c1, #ffdab9, #ffc0cb)`;
        
        setTimeout(() => {
            flow.style.animation = 'flow-move 3s ease-in-out infinite';
            flow.style.opacity = '0.8';
        }, 1500);
    });
    
    // Show emotion feedback
    showEmotionFeedback(emotionType);
}

// Show emotion feedback
function showEmotionFeedback(emotionType) {
    const feedback = document.createElement('div');
    feedback.className = 'emotion-feedback';
    feedback.textContent = `Sharing ${emotionType}...`;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 182, 193, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 20px;
        font-size: 1.2rem;
        z-index: 1000;
        animation: feedback-fade 3s ease-in-out;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Initialize empathic flow effects
function initEmpathicFlow() {
    const flowElements = document.querySelectorAll('.empathic-flow');
    
    // Add random variations to flow timing
    flowElements.forEach((flow, index) => {
        const randomDelay = Math.random() * 2;
        const randomDuration = 2 + Math.random() * 2;
        
        flow.style.animationDelay = randomDelay + 's';
        flow.style.animationDuration = randomDuration + 's';
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
    
    // Animate avatars on load
    const avatars = document.querySelectorAll('.avatar');
    avatars.forEach((avatar, index) => {
        avatar.style.opacity = '0';
        avatar.style.transform = avatar.classList.contains('avatar-1') ? 
            'translateX(-50%) translateY(50px)' : 
            'translateX(50%) translateY(50px)';
        
        setTimeout(() => {
            avatar.style.transition = 'all 1s ease-out';
            avatar.style.opacity = '1';
            avatar.style.transform = avatar.classList.contains('avatar-1') ? 
                'translateX(-50%) translateY(0)' : 
                'translateX(50%) translateY(0)';
        }, 1000 + (index * 500));
    });
});

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .feature-card, .emotion-item, .description-content {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    
    .feature-card.animate-in, .emotion-item.animate-in, .description-content.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-card:nth-child(1) { transition-delay: 0.1s; }
    .feature-card:nth-child(2) { transition-delay: 0.2s; }
    .feature-card:nth-child(3) { transition-delay: 0.3s; }
    
    .emotion-item:nth-child(1) { transition-delay: 0.1s; }
    .emotion-item:nth-child(2) { transition-delay: 0.2s; }
    .emotion-item:nth-child(3) { transition-delay: 0.3s; }
    .emotion-item:nth-child(4) { transition-delay: 0.4s; }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease-in;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .avatar {
        transition: all 0.3s ease;
    }
    
    .avatar-aura {
        transition: all 0.3s ease;
    }
    
    .emotion-aura {
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
    const avatarScene = document.querySelector('.avatar-scene');
    if (avatarScene) {
        if (window.innerWidth <= 768) {
            avatarScene.style.height = '400px';
        } else {
            avatarScene.style.height = '500px';
        }
    }
}

window.addEventListener('resize', handleResize);
handleResize(); // Initial call

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('emotion-item') || 
            focusedElement.classList.contains('avatar')) {
            e.preventDefault();
            focusedElement.click();
        }
    }
});

// Add touch support for mobile
document.addEventListener('touchstart', function(e) {
    const target = e.target.closest('.emotion-item, .avatar');
    if (target) {
        target.style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', function(e) {
    const target = e.target.closest('.emotion-item, .avatar');
    if (target) {
        target.style.transform = '';
    }
});

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