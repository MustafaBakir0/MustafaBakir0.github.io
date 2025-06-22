// Section 7: The Inhabitants - AI & Humanity Converged JavaScript

$(document).ready(function() {
    // Initialize avatar interactions
    initializeAvatarInteractions();
    
    // Initialize constellation effects
    initializeConstellation();
    
    // Initialize companion cards
    initializeCompanionCards();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize parallax effects
    initializeParallax();
});

// Avatar Interactions
function initializeAvatarInteractions() {
    $('.avatar').on('mouseenter', function() {
        const avatar = $(this);
        const isAI = avatar.hasClass('ai-avatar');
        
        // Add hover effects
        avatar.addClass('hovered');
        
        // Create interaction particles
        createAvatarParticles(avatar, isAI);
        
        // Show avatar details
        showAvatarDetails(avatar);
    });
    
    $('.avatar').on('mouseleave', function() {
        const avatar = $(this);
        
        // Remove hover effects
        avatar.removeClass('hovered');
        
        // Remove particles
        avatar.find('.avatar-particles').remove();
        
        // Hide avatar details
        hideAvatarDetails(avatar);
    });
    
    // Add click interactions
    $('.avatar').on('click', function() {
        const avatar = $(this);
        const avatarType = avatar.hasClass('ai-avatar') ? 'AI' : 'Human';
        const avatarRole = avatar.find('.avatar-label').text();
        
        activateAvatarInteraction(avatar, avatarType, avatarRole);
    });
}

function createAvatarParticles(avatar, isAI) {
    const particleContainer = $('<div class="avatar-particles"></div>');
    particleContainer.css({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 20
    });
    
    avatar.append(particleContainer);
    
    const particleCount = 15;
    const particleColor = isAI ? 'rgba(42, 252, 224, 0.8)' : 'rgba(255, 0, 150, 0.8)';
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            createAvatarParticle(particleContainer, particleColor, isAI);
        }, i * 100);
    }
}

function createAvatarParticle(container, color, isAI) {
    const particle = $('<div class="avatar-particle"></div>');
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    particle.css({
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        background: color,
        borderRadius: '50%',
        left: x + '%',
        top: y + '%',
        animation: isAI ? 'ai-particle-float 2s ease-out forwards' : 'human-particle-float 2s ease-out forwards'
    });
    
    container.append(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 2000);
}

function showAvatarDetails(avatar) {
    const details = $('<div class="avatar-details"></div>');
    const avatarType = avatar.hasClass('ai-avatar') ? 'AI Entity' : 'Human Pioneer';
    const avatarRole = avatar.find('.avatar-label').text();
    
    details.html(`
        <div class="details-content">
            <h4>${avatarRole}</h4>
            <p>${avatarType}</p>
            <div class="status-indicator"></div>
        </div>
    `);
    
    details.css({
        position: 'absolute',
        top: '-80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(46, 13, 63, 0.9)',
        border: '1px solid rgba(42, 252, 224, 0.3)',
        borderRadius: '10px',
        padding: '1rem',
        zIndex: 30,
        minWidth: '150px',
        textAlign: 'center'
    });
    
    avatar.append(details);
    
    details.animate({ opacity: 1 }, 300);
}

function hideAvatarDetails(avatar) {
    const details = avatar.find('.avatar-details');
    details.animate({ opacity: 0 }, 300, function() {
        details.remove();
    });
}

function activateAvatarInteraction(avatar, type, role) {
    // Create interaction effect
    const effect = $('<div class="avatar-interaction-effect"></div>');
    effect.css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: type === 'AI' ? 
            'radial-gradient(circle, rgba(42, 252, 224, 0.2), transparent)' :
            'radial-gradient(circle, rgba(255, 0, 150, 0.2), transparent)',
        opacity: 0,
        zIndex: 9999,
        pointerEvents: 'none'
    });
    
    $('body').append(effect);
    
    effect.animate({ opacity: 1 }, 500, function() {
        effect.animate({ opacity: 0 }, 500, function() {
            effect.remove();
        });
    });
    
    // Show interaction message
    showInteractionMessage(type, role);
}

function showInteractionMessage(type, role) {
    const message = $('<div class="interaction-message"></div>');
    const messages = {
        'AI Historian': 'Sharing knowledge across millennia...',
        'Human Creator': 'Expressing creativity through technology...',
        'AI Strategist': 'Analyzing possibilities beyond human limits...',
        'Human Explorer': 'Discovering new frontiers together...'
    };
    
    message.html(`
        <div class="message-content">
            <h3>${role}</h3>
            <p>${messages[role] || 'Connecting minds across the digital divide...'}</p>
        </div>
    `);
    
    message.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(46, 13, 63, 0.95)',
        border: '2px solid rgba(42, 252, 224, 0.5)',
        borderRadius: '15px',
        padding: '2rem',
        zIndex: 10000,
        textAlign: 'center',
        maxWidth: '400px',
        opacity: 0
    });
    
    $('body').append(message);
    
    message.animate({ opacity: 1 }, 500);
    
    setTimeout(() => {
        message.animate({ opacity: 0 }, 500, function() {
            message.remove();
        });
    }, 3000);
}

// Constellation Effects
function initializeConstellation() {
    // Animate constellation lines
    $('.constellation-lines .line').each(function(index) {
        $(this).css('animation-delay', (index * 0.5) + 's');
    });
    
    // Add constellation interaction
    $('.constellation').on('click', function() {
        createConstellationExplosion();
    });
    
    // Add star interactions
    $('.star').on('mouseenter', function() {
        $(this).addClass('star-hovered');
        createStarConnection($(this));
    });
    
    $('.star').on('mouseleave', function() {
        $(this).removeClass('star-hovered');
        $(this).find('.star-connection').remove();
    });
}

function createConstellationExplosion() {
    const explosion = $('<div class="constellation-explosion"></div>');
    explosion.css({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(42, 252, 224, 0.3), transparent)',
        borderRadius: '50%',
        animation: 'explosion-animation 1s ease-out forwards',
        pointerEvents: 'none'
    });
    
    $('.constellation-scene').append(explosion);
    
    setTimeout(() => {
        explosion.remove();
    }, 1000);
}

function createStarConnection(star) {
    const connection = $('<div class="star-connection"></div>');
    connection.css({
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100px',
        height: '1px',
        background: 'linear-gradient(90deg, #2afce0, transparent)',
        transform: 'translate(-50%, -50%)',
        animation: 'connection-grow 0.5s ease-out forwards'
    });
    
    star.append(connection);
}

// Companion Cards
function initializeCompanionCards() {
    $('.companion-card').each(function(index) {
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
            $(this).addClass('card-hovered');
            createCardParticles($(this));
        });
        
        card.on('mouseleave', function() {
            $(this).removeClass('card-hovered');
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
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createCardParticle(particleContainer);
        }, i * 150);
    }
}

function createCardParticle(container) {
    const particle = $('<div class="card-particle"></div>');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    particle.css({
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        background: 'rgba(42, 252, 224, 0.8)',
        borderRadius: '50%',
        left: x + '%',
        top: y + '%',
        animation: 'card-particle-float 1.5s ease-out forwards'
    });
    
    container.append(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1500);
}

function removeCardParticles(card) {
    card.find('.card-particle-container').remove();
}

// Interactive Elements
function initializeInteractiveElements() {
    $('.interactive-card').on('click', function() {
        const companion = $(this).data('companion');
        activateCompanionInteraction(companion);
    });
    
    $('.interactive-card').on('mouseenter', function() {
        $(this).addClass('interactive-hovered');
        createRippleEffect($(this));
    });
    
    $('.interactive-card').on('mouseleave', function() {
        $(this).removeClass('interactive-hovered');
    });
}

function activateCompanionInteraction(companion) {
    const effects = {
        strategist: 'radial-gradient(circle, rgba(42, 252, 224, 0.3), transparent)',
        friend: 'radial-gradient(circle, rgba(255, 0, 150, 0.3), transparent)',
        mentor: 'radial-gradient(circle, rgba(131, 56, 236, 0.3), transparent)',
        doctor: 'radial-gradient(circle, rgba(255, 190, 11, 0.3), transparent)'
    };
    
    const effect = $('<div class="companion-effect"></div>');
    effect.css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: effects[companion] || effects.strategist,
        opacity: 0,
        zIndex: 9999,
        pointerEvents: 'none'
    });
    
    $('body').append(effect);
    
    effect.animate({ opacity: 1 }, 500, function() {
        effect.animate({ opacity: 0 }, 500, function() {
            effect.remove();
        });
    });
}

function createRippleEffect(element) {
    const ripple = $('<div class="ripple"></div>');
    ripple.css({
        position: 'absolute',
        borderRadius: '50%',
        background: 'rgba(42, 252, 224, 0.3)',
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
        const parallaxElements = $('.grid-layer');
        
        parallaxElements.each(function(index) {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            $(this).css('transform', `rotateX(85deg) translateY(${yPos}px)`);
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

// Add CSS animations dynamically
const additionalCSS = `
    @keyframes ai-particle-float {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes human-particle-float {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes card-particle-float {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-30px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes explosion-animation {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes connection-grow {
        0% {
            width: 0;
            opacity: 0;
        }
        100% {
            width: 100px;
            opacity: 1;
        }
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .avatar.hovered {
        transform: scale(1.15);
        z-index: 25;
    }
    
    .companion-card.card-hovered {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(42, 252, 224, 0.3);
    }
    
    .interactive-card.interactive-hovered {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 30px rgba(42, 252, 224, 0.4);
    }
    
    .star.star-hovered {
        transform: scale(2);
        box-shadow: 0 0 20px rgba(42, 252, 224, 0.8);
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize everything when document is ready
$(document).ready(function() {
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
    
    $('.companion-card, .interactive-card').each(function() {
        observer.observe(this);
    });
});

// Add smooth easing function
$.easing.easeInOutQuart = function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
}; 