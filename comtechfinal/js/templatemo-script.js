const initBg = (autoplay = true) => {
    const bgImgsNames = ['diagoona-bg-1.jpg', 'diagoona-bg-2.jpg', 'diagoona-bg-3.jpg'];
    const bgImgs = bgImgsNames.map(img => "img/" + img);

    $.backstretch(bgImgs, {duration: 4000, fade: 500});

    if(!autoplay) {
      $.backstretch('pause');  
    }    
}

const setBg = id => {
    $.backstretch('show', id);
}

const setBgOverlay = () => {
    const windowWidth = window.innerWidth;
    const bgHeight = $('body').height();
    const tmBgLeft = $('.tm-bg-left');

    $('.tm-bg').height(bgHeight);

    if(windowWidth > 768) {
        tmBgLeft.css('border-left', `0`)
                .css('border-top', `${bgHeight}px solid transparent`);                
    } else {
        tmBgLeft.css('border-left', `${windowWidth}px solid transparent`)
                .css('border-top', `0`);
    }
}

$(document).ready(function () {
    const autoplayBg = true;	// set Auto Play for Background Images
    initBg(autoplayBg);    
    setBgOverlay();

    const bgControl = $('.tm-bg-control');            
    bgControl.click(function() {
        bgControl.removeClass('active');
        $(this).addClass('active');
        const id = $(this).data('id');                
        setBg(id);
    });

    $(window).on("backstretch.after", function (e, instance, index) {        
        const bgControl = $('.tm-bg-control');
        bgControl.removeClass('active');
        const current = $(".tm-bg-controls-wrapper").find(`[data-id=${index}]`);        
        current.addClass('active');
    });

    $(window).resize(function() {
        setBgOverlay();
    });

    // Discover Button Transition
    $('#discover-btn').click(function() {
        const overlay = $('#transition-overlay');
        const button = $(this);
        
        // Disable button to prevent multiple clicks
        button.prop('disabled', true);
        
        // Create a clone of the button for the transition effect
        const buttonClone = button.clone();
        buttonClone.css({
            position: 'fixed',
            top: button.offset().top,
            left: button.offset().left,
            zIndex: 10000,
            transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        $('body').append(buttonClone);
        
        // Fade out the original button
        button.css({
            transition: 'opacity 0.8s ease',
            opacity: '0'
        });
        
        // Animate the button clone to fill the screen
        setTimeout(() => {
            buttonClone.css({
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                borderRadius: '0',
                opacity: '0.5',
                transform: 'scale(1)'
            });
        }, 100);
        
        // Show the overlay after button animation
        setTimeout(() => {
            overlay.addClass('active');
            buttonClone.remove();
            
            // Generate stars for the holographic effect
            generateStars();
            
            // Show the cyber button after a delay
            setTimeout(() => {
                $('.cyber-button-container').addClass('visible');
            }, 3000); // 3 seconds after overlay appears
            
            // Add futuristic sound effect (optional)
            // You can add audio here if desired
        }, 800);
    });

    // Generate stars for holographic effect
    function generateStars() {
        const starLayers = $('.star-layer');
        
        starLayers.each(function(index) {
            const layer = $(this);
            const starCount = 50 + (index * 25); // More stars in deeper layers
            
            for (let i = 0; i < starCount; i++) {
                const star = $('<div class="star"></div>');
                const size = Math.random() * 3 + 1;
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const delay = Math.random() * 5;
                
                star.css({
                    width: size + 'px',
                    height: size + 'px',
                    left: x + '%',
                    top: y + '%',
                    animationDelay: delay + 's'
                });
                
                layer.append(star);
            }
        });
    }
});