document.addEventListener('DOMContentLoaded', () => {
    // Gif file paths - using relative paths that work from project directories
    const gifPaths = [
        '../../assets/bg1.gif',
        '../../assets/bg2.gif',
        '../../assets/bg3.gif'
    ];
    
    // Create background container
    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'dreamy-background-container';
    document.body.insertBefore(backgroundContainer, document.body.firstChild);
    
    // Preload GIFs
    const preloadGifs = () => {
        let loadedCount = 0;
        const totalGifs = gifPaths.length;
        
        return new Promise(resolve => {
            gifPaths.forEach(path => {
                const preloadImg = new Image();
                preloadImg.onload = () => {
                    loadedCount++;
                    if (loadedCount === totalGifs) {
                        resolve(); // All images preloaded
                    }
                };
                preloadImg.onerror = () => {
                    loadedCount++; // Count errors too to avoid hanging
                    console.warn(`Failed to preload GIF: ${path}`);
                    if (loadedCount === totalGifs) {
                        resolve();
                    }
                };
                preloadImg.src = path;
            });
        });
    };
    
    // Create and add GIF elements to the page after preloading
    preloadGifs().then(() => {
        gifPaths.forEach((path, index) => {
            const gifElement = document.createElement('img');
            gifElement.src = path;
            gifElement.className = 'dreamy-gif';
            gifElement.alt = ''; // Empty alt for decorative images
            
            // First gif starts as active
            if (index === 0) {
                gifElement.classList.add('active');
                // Set initial opacity for the first GIF
                setTimeout(() => {
                    gifElement.style.opacity = '0.3';
                }, 100);
            }
            
            backgroundContainer.appendChild(gifElement);
        });
        
        // Start rotation after initial setup
        initBackgroundRotation();
    });
    
    // Function to initialize background rotation
    function initBackgroundRotation() {
        // Function to rotate between gifs
        const rotateGifs = () => {
            const gifs = document.querySelectorAll('.dreamy-gif');
            const currentActive = document.querySelector('.dreamy-gif.active');
            
            if (!currentActive) return; // Safety check
            
            const currentIndex = Array.from(gifs).indexOf(currentActive);
            const nextIndex = (currentIndex + 1) % gifs.length;
            
            // Fade out current
            currentActive.style.opacity = '0';
            
            // After fade out, switch active class
            setTimeout(() => {
                currentActive.classList.remove('active');
                gifs[nextIndex].classList.add('active');
                
                // Fade in next
                setTimeout(() => {
                    gifs[nextIndex].style.opacity = '0.3';
                }, 50);
            }, 1000);
        };
        
        // Rotate gifs every 15 seconds
        const rotationInterval = setInterval(rotateGifs, 15000);
        
        // Increase blur on scroll for better content visibility
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollPercentage = Math.min(scrollPosition / (maxScroll * 0.3), 1);
            
            // Calculate blur between 5px (default) and 15px (max)
            const blurValue = 5 + (scrollPercentage * 10);
            
            // Apply to all gifs
            const gifs = document.querySelectorAll('.dreamy-gif');
            gifs.forEach(gif => {
                gif.style.filter = `blur(${blurValue}px) brightness(0.8)`;
            });
        });
        
        // Return the interval ID in case we need to clear it later
        return rotationInterval;
    }
    
    // Remove any existing background animation if it exists
    const existingBg = document.getElementById('background-animation');
    if (existingBg) {
        existingBg.style.display = 'none';
    }
});