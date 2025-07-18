// Section 9: The Ecosystem - Your Virtiality

$(document).ready(function() {
    // Initialize the page
    initSection9();
});

function initSection9() {
    // Initialize background effects
    initBackgroundEffects();
    
    // Initialize package interactions
    initPackageInteractions();
    
    // Initialize form functionality
    initFormFunctionality();
    
    // Initialize animations
    initAnimations();
    
    // Initialize responsive behavior
    initResponsiveBehavior();
}

function initBackgroundEffects() {
    // Create dynamic stars
    createDynamicStars();
    
    // Initialize particle system
    initParticleSystem();
    
    // Initialize light ray effects
    initLightRayEffects();
}

function createDynamicStars() {
    const starsContainer = $('.stars-container');
    
    // Generate random star positions
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        $('.stars-near').css('--star-x', x + '%');
        $('.stars-near').css('--star-y', y + '%');
    }
}

function initParticleSystem() {
    // Animate floating particles
    $('.floating-particle').each(function(index) {
        const $particle = $(this);
        const delay = index * 0.5;
        
        $particle.css('animation-delay', delay + 's');
        
        // Add hover effect
        $particle.on('mouseenter', function() {
            $(this).css({
                'transform': 'scale(1.5)',
                'background': 'radial-gradient(circle, #00ffff, transparent)'
            });
        }).on('mouseleave', function() {
            $(this).css({
                'transform': 'scale(1)',
                'background': 'radial-gradient(circle, #00ff88, transparent)'
            });
        });
    });
}

function initLightRayEffects() {
    // Animate light rays with different speeds
    $('.ray').each(function(index) {
        const $ray = $(this);
        const speed = 8 + (index * 2);
        
        $ray.css('animation-duration', speed + 's');
    });
}

function initPackageInteractions() {
    // Package card hover effects
    $('.package-card').on('mouseenter', function() {
        const $card = $(this);
        const $visual = $card.find('.package-visual');
        const $glow = $card.find('.package-glow');
        
        // Enhance glow effect
        $glow.css({
            'transform': 'translate(-50%, -50%) scale(1.3)',
            'opacity': '0.6'
        });
        
        // Animate product models
        animateProductModels($visual);
        
        // Add floating effect
        $card.css('transform', 'translateY(-15px) scale(1.02)');
        
    }).on('mouseleave', function() {
        const $card = $(this);
        const $glow = $card.find('.package-glow');
        
        // Reset glow effect
        $glow.css({
            'transform': 'translate(-50%, -50%) scale(1)',
            'opacity': '0.2'
        });
        
        // Reset card position
        $card.css('transform', 'translateY(0) scale(1)');
    });
    
    // Featured package special effects
    $('.package-card.featured').on('mouseenter', function() {
        const $card = $(this);
        const $badge = $card.find('.featured-badge');
        
        // Animate featured badge
        $badge.css({
            'transform': 'translateX(-50%) scale(1.1)',
            'box-shadow': '0 10px 20px rgba(255, 170, 0, 0.4)'
        });
        
    }).on('mouseleave', function() {
        const $card = $(this);
        const $badge = $card.find('.featured-badge');
        
        // Reset badge
        $badge.css({
            'transform': 'translateX(-50%) scale(1)',
            'box-shadow': 'none'
        });
    });
}

function animateProductModels($visual) {
    // Animate headset
    const $headset = $visual.find('.headset-model');
    $headset.css('animation', 'headset-float 2s ease-in-out infinite');
    
    // Animate suit panels
    const $panels = $visual.find('.suit-panel');
    $panels.each(function(index) {
        const $panel = $(this);
        const delay = index * 0.3;
        $panel.css('animation-delay', delay + 's');
    });
    
    // Animate strider rings
    const $rings = $visual.find('.base-ring');
    $rings.each(function(index) {
        const $ring = $(this);
        const speed = 2 + (index * 0.5);
        $ring.css('animation-duration', speed + 's');
    });
}

function initFormFunctionality() {
    // Form submission
    $('#waitlistForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val();
        const package = $('input[name="package"]:checked').val();
        
        if (validateEmail(email)) {
            submitWaitlist(email, package);
        } else {
            showFormError('Please enter a valid email address.');
        }
    });
    
    // Email input effects
    $('#email').on('focus', function() {
        const $input = $(this);
        const $container = $input.closest('.input-container');
        
        $container.addClass('focused');
        animateInputParticles($container);
        
    }).on('blur', function() {
        const $input = $(this);
        const $container = $input.closest('.input-container');
        
        $container.removeClass('focused');
    });
    
    // Package selector effects
    $('.option-item input[type="radio"]').on('change', function() {
        const $option = $(this).closest('.option-item');
        const $allOptions = $('.option-item');
        
        // Reset all options
        $allOptions.removeClass('selected');
        
        // Select current option
        $option.addClass('selected');
        
        // Animate selection
        animatePackageSelection($option);
    });
    
    // Submit button effects
    $('.submit-button').on('mouseenter', function() {
        const $button = $(this);
        
        // Enhance button glow
        $button.css('box-shadow', '0 25px 50px rgba(0, 255, 136, 0.5)');
        
        // Animate particles
        animateButtonParticles($button);
        
    }).on('mouseleave', function() {
        const $button = $(this);
        $button.css('box-shadow', 'none');
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitWaitlist(email, package) {
    // Show loading state
    const $button = $('.submit-button');
    const originalText = $button.find('.button-text').text();
    
    $button.prop('disabled', true);
    $button.find('.button-text').text('Joining...');
    
    // Simulate API call
    setTimeout(function() {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        $('#waitlistForm')[0].reset();
        $('.option-item').removeClass('selected');
        $('.option-item input[value="core"]').prop('checked', true);
        
        // Reset button
        $button.prop('disabled', false);
        $button.find('.button-text').text(originalText);
        
    }, 2000);
}

function showFormError(message) {
    // Create error element
    const $error = $('<div class="form-error">' + message + '</div>');
    
    // Add error styles
    $error.css({
        'color': '#ff6b6b',
        'font-size': '0.9rem',
        'margin-top': '0.5rem',
        'text-align': 'center',
        'animation': 'error-shake 0.5s ease-in-out'
    });
    
    // Insert error message
    $('.input-container').after($error);
    
    // Remove error after 3 seconds
    setTimeout(function() {
        $error.fadeOut(function() {
            $(this).remove();
        });
    }, 3000);
}

function showSuccessMessage() {
    const $successMessage = $('#successMessage');
    
    $successMessage.fadeIn(500);
    
    // Add entrance animation
    $successMessage.find('.success-content').css({
        'animation': 'success-slide-in 0.6s ease-out'
    });
}

function closeSuccessMessage() {
    const $successMessage = $('#successMessage');
    
    $successMessage.find('.success-content').css({
        'animation': 'success-slide-out 0.4s ease-in'
    });
    
    setTimeout(function() {
        $successMessage.fadeOut(300);
    }, 400);
}

function animateInputParticles($container) {
    const $particles = $container.find('.input-particles .particle');
    
    $particles.each(function(index) {
        const $particle = $(this);
        const delay = index * 0.2;
        
        setTimeout(function() {
            $particle.css({
                'transform': 'translateY(-10px) scale(1.5)',
                'opacity': '1'
            });
            
            setTimeout(function() {
                $particle.css({
                    'transform': 'translateY(0) scale(1)',
                    'opacity': '0.8'
                });
            }, 500);
        }, delay * 1000);
    });
}

function animatePackageSelection($option) {
    // Add selection animation
    $option.css({
        'transform': 'translateY(-3px) scale(1.05)',
        'box-shadow': '0 10px 20px rgba(0, 255, 255, 0.3)'
    });
    
    setTimeout(function() {
        $option.css({
            'transform': 'translateY(-2px) scale(1.02)',
            'box-shadow': '0 5px 15px rgba(0, 255, 255, 0.2)'
        });
    }, 200);
}

function animateButtonParticles($button) {
    const $particles = $button.find('.button-particles .particle');
    
    $particles.each(function(index) {
        const $particle = $(this);
        const delay = index * 0.1;
        
        setTimeout(function() {
            $particle.css({
                'transform': 'translateY(-15px) scale(2)',
                'opacity': '1'
            });
            
            setTimeout(function() {
                $particle.css({
                    'transform': 'translateY(0) scale(1)',
                    'opacity': '0.8'
                });
            }, 600);
        }, delay * 1000);
    });
}

function initAnimations() {
    // Animate elements on scroll
    $(window).on('scroll', function() {
        animateOnScroll();
    });
    
    // Initial animation trigger
    setTimeout(function() {
        animateOnScroll();
    }, 100);
    
    // Hero title animation
    animateHeroTitle();
    
    // Package cards entrance animation
    animatePackageCards();
}

function animateOnScroll() {
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    
    // Animate elements when they come into view
    $('.package-card, .vision-title, .waitlist-form').each(function() {
        const $element = $(this);
        const elementTop = $element.offset().top;
        const elementHeight = $element.outerHeight();
        
        if (scrollTop + windowHeight > elementTop && scrollTop < elementTop + elementHeight) {
            $element.addClass('animate-in');
        }
    });
}

function animateHeroTitle() {
    const $title = $('.hero-title');
    const $lines = $title.find('.title-line');
    
    $lines.each(function(index) {
        const $line = $(this);
        const delay = index * 0.3;
        
        setTimeout(function() {
            $line.css({
                'opacity': '1',
                'transform': 'translateY(0)'
            });
        }, delay * 1000);
    });
}

function animatePackageCards() {
    $('.package-card').each(function(index) {
        const $card = $(this);
        const delay = index * 0.2;
        
        setTimeout(function() {
            $card.css({
                'opacity': '1',
                'transform': 'translateY(0)'
            });
        }, delay * 1000);
    });
}

function initResponsiveBehavior() {
    // Handle window resize
    $(window).on('resize', function() {
        adjustLayout();
    });
    
    // Initial layout adjustment
    adjustLayout();
}

function adjustLayout() {
    const windowWidth = $(window).width();
    
    if (windowWidth <= 768) {
        // Mobile adjustments
        $('.ecosystem-grid').css('grid-template-columns', '1fr');
        $('.package-card.featured').css('transform', 'none');
        
    } else {
        // Desktop adjustments
        $('.ecosystem-grid').css('grid-template-columns', 'repeat(auto-fit, minmax(350px, 1fr))');
        $('.package-card.featured').css('transform', 'scale(1.05)');
    }
}

// Global functions for external access
window.closeSuccessMessage = closeSuccessMessage;

// Add CSS animations dynamically
const additionalStyles = `
    @keyframes headset-float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-5px) rotate(2deg); }
    }
    
    @keyframes error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes success-slide-in {
        0% { transform: translateY(-50px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes success-slide-out {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }
    
    .package-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .package-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .vision-title {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .vision-title.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .waitlist-form {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .waitlist-form.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hero-title .title-line {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .input-container.focused {
        transform: scale(1.02);
    }
    
    .option-item.selected {
        background: rgba(0, 255, 255, 0.15);
        border-color: rgba(0, 255, 255, 0.5);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
