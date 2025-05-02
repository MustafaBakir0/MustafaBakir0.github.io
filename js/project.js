// resonance-project.js - Dreamlike interactions for Webster Project

document.addEventListener('DOMContentLoaded', function() {
    // Check for existing background animation container
    let backgroundContainer = document.getElementById('background-animation');
    
    if (!backgroundContainer) {
        backgroundContainer = document.createElement('div');
        backgroundContainer.id = 'background-animation';
        backgroundContainer.style.position = 'fixed';
        backgroundContainer.style.top = '0';
        backgroundContainer.style.left = '0';
        backgroundContainer.style.width = '100%';
        backgroundContainer.style.height = '100%';
        backgroundContainer.style.zIndex = '-1';
        backgroundContainer.style.pointerEvents = 'none';
        document.body.prepend(backgroundContainer);
    }
    
    // Initialize sections with selective scroll effects
    const initializeSections = () => {
        // Make hero content fully visible
        const heroContent = document.querySelector('.project-hero-content');
        if (heroContent) {
            heroContent.style.opacity = 1;
            heroContent.style.filter = 'blur(0px)';
            heroContent.style.transform = 'translateY(0)';
            // Set transition properties for smooth effects
            heroContent.style.transition = 'opacity 0.8s ease, filter 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        }
        
        // Project overview can have scroll effects, but initialize visible
        const projectOverview = document.querySelector('.project-overview');
        if (projectOverview) {
            projectOverview.style.opacity = 1;
            projectOverview.style.filter = 'none';
            projectOverview.style.transform = 'none';
            // Set transition properties for smooth effects
            projectOverview.style.transition = 'opacity 0.8s ease, filter 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        }
        
        // Make sure all detail sections are always fully visible
        const detailSections = document.querySelectorAll('.project-content');
        detailSections.forEach(section => {
            section.style.opacity = 1;
            section.style.filter = 'none';
            section.style.transform = 'none';
            // Remove transitions to ensure they never animate
            section.style.transition = 'none';
        });
    };
    
    // Selective scroll effects
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.project-hero-content');
        const projectOverview = document.querySelector('.project-overview');
        const viewportHeight = window.innerHeight;
        
        // Parallax and fade for hero content
        if (heroContent && scrollY < viewportHeight) {
            const opacity = Math.max(1 - (scrollY / (viewportHeight * 0.5)), 0);
            const translateY = scrollY * 0.4;
            const blur = Math.min(scrollY / 80, 3);
            
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translateY(${translateY}px)`;
            heroContent.style.filter = `blur(${blur}px)`;
        }
        
        // Scroll effects for project overview/description only
        if (projectOverview) {
            const rect = projectOverview.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            
            // Check if section is visible
            if (sectionTop < viewportHeight && sectionTop + sectionHeight > 0) {
                // Calculate section position relative to viewport center
                const sectionCenter = sectionTop + (sectionHeight / 2);
                const viewportCenter = viewportHeight / 2;
                
                // Calculate how centered the section is
                const distFromCenter = Math.abs(viewportCenter - sectionCenter) / viewportHeight;
                
                // Create a sweet spot where sections are fully clear
                const sweetSpotSize = 0.15;
                
                // Calculate visibility
                let visibility;
                
                if (distFromCenter < sweetSpotSize) {
                    // Fully visible in the sweet spot
                    visibility = 1;
                } else {
                    // Gradually fade based on distance from sweet spot
                    visibility = 1 - Math.min((distFromCenter - sweetSpotSize) / (0.5 - sweetSpotSize), 1);
                }
                
                // Apply smooth fade and transform for overview only
                projectOverview.style.opacity = Math.max(0.4, visibility);
                
                // Apply subtle transform and blur
                if (distFromCenter < sweetSpotSize) {
                    projectOverview.style.filter = 'blur(0px)';
                } else {
                    const blurAmount = Math.max(0, 2 - (visibility * 2));
                    projectOverview.style.filter = `blur(${blurAmount}px)`;
                }
                
                const translateY = Math.max(0, 15 - (visibility * 15));
                projectOverview.style.transform = `translateY(${translateY}px)`;
            }
        }
        
        // Make sure detail sections are ALWAYS fully visible - NO scroll effects
        const detailSections = document.querySelectorAll('.project-content');
        detailSections.forEach(section => {
            section.style.opacity = 1;
            section.style.filter = 'none';
            section.style.transform = 'none';
        });
        
        // Header transformation on scroll
        const header = document.querySelector('header');
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // Image expand functionality
    function setupExpandableImages() {
        // Find all project images
        const allImages = document.querySelectorAll('.project-image-full img, .gallery-item img, #webster-sketch-container, .project-content img');
        
        allImages.forEach(img => {
            // Skip canvas elements or elements without src attribute
            if ((img.nodeName === 'CANVAS') || (img.nodeName === 'DIV') || !img.src) return;
            
            // Make images appear clickable
            img.style.cursor = 'pointer';
            
            // Add click event
            img.addEventListener('click', function() {
                // Create modal if it doesn't exist
                let modal = document.querySelector('.image-expand-modal');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.className = 'image-expand-modal';
                    document.body.appendChild(modal);
                }
                
                // Clear previous content
                modal.innerHTML = '';
                
                // Create close button
                const closeBtn = document.createElement('button');
                closeBtn.className = 'close-expand-btn';
                closeBtn.innerHTML = '×';
                closeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    modal.classList.remove('active');
                    
                    // Re-enable scrolling
                    document.body.style.overflow = '';
                    
                    // Remove modal after animation completes
                    setTimeout(() => {
                        if (!modal.classList.contains('active')) {
                            modal.style.display = 'none';
                        }
                    }, 500);
                });
                
                // Create expanded image
                const expandedImg = document.createElement('img');
                expandedImg.src = this.src;
                expandedImg.alt = this.alt || 'Expanded image';
                expandedImg.className = 'expanded-image';
                
                // Add elements to modal
                modal.appendChild(closeBtn);
                modal.appendChild(expandedImg);
                
                // Display modal
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                
                // Add active class after a brief delay for animation
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
                
                // Close on click outside image
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closeBtn.click();
                    }
                });
                
                // Add keyboard support for closing
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && modal.classList.contains('active')) {
                        closeBtn.click();
                    }
                });
            });
        });
        
        // Handle the webster sketch container separately if it exists
        const websterContainer = document.querySelector('#webster-sketch-container');
        if (websterContainer && !websterContainer.hasAttribute('data-expandable-initialized')) {
            websterContainer.style.cursor = 'pointer';
            websterContainer.setAttribute('data-expandable-initialized', 'true');
            
            websterContainer.addEventListener('click', function(e) {
                // Don't expand if clicking on a canvas (it's interactive)
                if (e.target.nodeName === 'CANVAS') return;
                
                // Create screenshot of the container
                html2canvas(websterContainer).then(canvas => {
                    // Create modal if it doesn't exist
                    let modal = document.querySelector('.image-expand-modal');
                    if (!modal) {
                        modal = document.createElement('div');
                        modal.className = 'image-expand-modal';
                        document.body.appendChild(modal);
                    }
                    
                    // Clear previous content
                    modal.innerHTML = '';
                    
                    // Create close button
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'close-expand-btn';
                    closeBtn.innerHTML = '×';
                    closeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                        
                        setTimeout(() => {
                            if (!modal.classList.contains('active')) {
                                modal.style.display = 'none';
                            }
                        }, 500);
                    });
                    
                    // Use the canvas as the expanded image
                    canvas.className = 'expanded-image';
                    
                    // Add elements to modal
                    modal.appendChild(closeBtn);
                    modal.appendChild(canvas);
                    
                    // Display modal
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    
                    setTimeout(() => {
                        modal.classList.add('active');
                    }, 10);
                    
                    // Close on click outside
                    modal.addEventListener('click', function(e) {
                        if (e.target === modal) {
                            closeBtn.click();
                        }
                    });
                    
                    // Add keyboard support
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape' && modal.classList.contains('active')) {
                            closeBtn.click();
                        }
                    });
                });
            });
        }
    }
    
    // Load html2canvas for capturing canvas elements
    function loadHtml2Canvas() {
        if (typeof html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = function() {
                setupExpandableImages();
            };
            document.head.appendChild(script);
        } else {
            setupExpandableImages();
        }
    }
    
    // Initialize expandable images
    loadHtml2Canvas();
    
    // Call initialization on page load
    initializeSections();
    
    // Force a scroll event to check initial visibility
    window.dispatchEvent(new Event('scroll'));
});