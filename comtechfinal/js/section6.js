// Section 6: The World - The Aethel JavaScript

$(document).ready(function() {
    // Initialize particle system
    initializeParticles();
    
    // Initialize interactive cards
    initializeInteractiveCards();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize parallax effects
    initializeParallax();
    
    // Initialize world card animations
    initializeWorldCards();
});

// Particle System
function initializeParticles() {
    const particleLayers = $('.particle-layer');
    
    particleLayers.each(function(index) {
        const layer = $(this);
        const particleCount = 50 + (index * 25);
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(layer, index);
        }
    });
}

function createParticle(layer, layerIndex) {
    const particle = $('<div class="particle"></div>');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = 15 + Math.random() * 20;
    const delay = Math.random() * 10;
    
    particle.css({
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        background: getParticleColor(layerIndex),
        borderRadius: '50%',
        left: x + '%',
        top: y + '%',
        animation: `particle-drift-${layerIndex + 1} ${duration}s linear infinite`,
        animationDelay: delay + 's'
    });
    
    layer.append(particle);
}

function getParticleColor(layerIndex) {
    const colors = [
        'rgba(255, 0, 150, 0.8)',
        'rgba(0, 255, 150, 0.8)',
        'rgba(150, 0, 255, 0.8)',
        'rgba(255, 150, 0, 0.8)',
        'rgba(255, 255, 255, 0.6)'
    ];
    return colors[layerIndex % colors.length];
}

// Interactive Cards
function initializeInteractiveCards() {
    $('.interactive-card').on('click', function() {
        const environment = $(this).data('environment');
        activateEnvironment(environment);
    });
    
    $('.interactive-card').on('mouseenter', function() {
        $(this).addClass('active');
        createRippleEffect($(this));
    });
    
    $('.interactive-card').on('mouseleave', function() {
        $(this).removeClass('active');
    });
}

function activateEnvironment(environment) {
    // Create environment activation effect
    const effect = $('<div class="environment-effect"></div>');
    effect.css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: getEnvironmentColor(environment),
        opacity: 0,
        zIndex: 9999,
        pointerEvents: 'none'
    });
    
    $('body').append(effect);
    
    effect.animate({ opacity: 0.3 }, 500, function() {
        effect.animate({ opacity: 0 }, 500, function() {
            effect.remove();
        });
    });
    
    // Add sound effect (if available)
    playEnvironmentSound(environment);
}

function getEnvironmentColor(environment) {
    const colors = {
        city: 'radial-gradient(circle, rgba(255, 0, 150, 0.3), transparent)',
        garden: 'radial-gradient(circle, rgba(0, 255, 150, 0.3), transparent)',
        market: 'radial-gradient(circle, rgba(150, 0, 255, 0.3), transparent)',
        studio: 'radial-gradient(circle, rgba(255, 150, 0, 0.3), transparent)'
    };
    return colors[environment] || colors.city;
}

function playEnvironmentSound(environment) {
    // Placeholder for sound effects
    console.log(`Playing ${environment} environment sound`);
}

function createRippleEffect(element) {
    const ripple = $('<div class="ripple"></div>');
    ripple.css({
        position: 'absolute',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.3)',
        transform: 'scale(0)',
        animation: 'ripple-animation 0.6s linear',
        pointerEvents: 'none'
    });
    
    element.append(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 1000, 'easeInOutQuart');
        }
    });
}

// Parallax Effects
function initializeParallax() {
    $(window).on('scroll', function() {
        const scrolled = $(window).scrollTop();
        const parallaxElements = $('.floating-elements > div');
        
        parallaxElements.each(function(index) {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            $(this).css('transform', `translateY(${yPos}px)`);
        });
        
        // Parallax for light rays
        const lightRays = $('.light-rays .ray');
        lightRays.each(function(index) {
            const speed = 0.3 + (index * 0.05);
            const xPos = scrolled * speed;
            $(this).css('transform', `translateX(${xPos}px)`);
        });
    });
}

// World Cards
function initializeWorldCards() {
    $('.world-card').each(function(index) {
        const card = $(this);
        
        // Add entrance animation
        card.css({
            opacity: 0,
            transform: 'translateY(50px)'
        });
        
        setTimeout(() => {
            card.animate({
                opacity: 1
            }, 1000);
            card.css('transform', 'translateY(0)');
        }, index * 200);
        
        // Add hover effects
        card.on('mouseenter', function() {
            $(this).find('.card-visual').addClass('active');
            createCardParticles($(this));
        });
        
        card.on('mouseleave', function() {
            $(this).find('.card-visual').removeClass('active');
            removeCardParticles($(this));
        });
    });
}

function createCardParticles(card) {
    const particleContainer = $('<div class="card-particle-container"></div>');
    particleContainer.css({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
    });
    
    card.find('.card-visual').append(particleContainer);
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createCardParticle(particleContainer);
        }, i * 100);
    }
}

function createCardParticle(container) {
    const particle = $('<div class="card-particle"></div>');
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    particle.css({
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        left: x + '%',
        top: y + '%',
        animation: 'card-particle-float 2s ease-out forwards'
    });
    
    container.append(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 2000);
}

function removeCardParticles(card) {
    card.find('.card-particle-container').remove();
}

// Dynamic Background Effects
function initializeDynamicBackground() {
    setInterval(() => {
        updateBackgroundColors();
    }, 5000);
}

function updateBackgroundColors() {
    const colors = [
        'rgba(255, 0, 150, 0.3)',
        'rgba(0, 255, 150, 0.3)',
        'rgba(150, 0, 255, 0.3)',
        'rgba(255, 150, 0, 0.3)'
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    $('.world-background').animate({
        backgroundColor: randomColor
    }, 2000);
}

// Performance Optimization
function optimizePerformance() {
    // Reduce animations on mobile
    if (window.innerWidth < 768) {
        $('.particle-layer').hide();
        $('.floating-elements').hide();
    }
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            $('*').css('animation-play-state', 'paused');
        } else {
            $('*').css('animation-play-state', 'running');
        }
    });
}

// Initialize performance optimization
optimizePerformance();

// Add CSS animations dynamically
const additionalCSS = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes card-particle-float {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
    
    .card-visual.active {
        transform: scale(1.05);
        transition: transform 0.3s ease;
    }
    
    .interactive-card.active {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(255, 0, 150, 0.4);
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize everything when document is ready
$(document).ready(function() {
    initializeDynamicBackground();
    
    // Add loading animation
    $('body').addClass('loaded');
    
    // Initialize intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    $('.world-card, .interactive-card').each(function() {
        observer.observe(this);
    });
});

// Add smooth easing function
$.easing.easeInOutQuart = function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
}; 