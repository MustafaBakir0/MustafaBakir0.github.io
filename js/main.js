// resonance-interactions.js - Enhanced interactions and effects for Resonance theme

document.addEventListener('DOMContentLoaded', function() {
    // smooth scroll for navigation with dreamy easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // add subtle blur effect during scroll
                document.body.classList.add('scrolling');
                
                // smooth scroll with custom cubic-bezier easing for dreamier motion
                const scrollOptions = {
                    behavior: 'smooth',
                    block: 'start'
                };
                
                targetElement.scrollIntoView(scrollOptions);
                
                // remove blur effect after scroll completes
                setTimeout(() => {
                    document.body.classList.remove('scrolling');
                }, 1000);
            }
        });
    });

    // dynamic typing effect with dreamier timing
    const dynamicText = document.querySelector('.dynamic-text');
    if (dynamicText) {
        const words = ["Multimedia Artist", "Creative Coder", "Digital Storyteller"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        
        const typeEffect = () => {
            const currentWord = words[wordIndex];
            const h1 = document.querySelector('.main-title');
            
            if (!isDeleting) {
                // typing
                if (charIndex === 0) h1.classList.add('shift-up');
                dynamicText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                
                // randomize typing speed slightly for more organic feel
                typingDelay = Math.random() * 50 + 80;
                
                if (charIndex === currentWord.length) {
                    // pause at the end of typing
                    isDeleting = true;
                    typingDelay = 2000; // longer pause before deleting
                }
            } else {
                // deleting
                dynamicText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                
                // faster delete speed
                typingDelay = Math.random() * 20 + 40;
                
                if (charIndex === 0) {
                    h1.classList.remove('shift-up');
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typingDelay = 1200; // pause before typing new word
                }
            }
            
            setTimeout(typeEffect, typingDelay);
        };
        
        // start the typing effect with initial delay
        setTimeout(typeEffect, 800);
    }
    
    // enhanced scroll effects
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        const contentOverlay = document.getElementById('content-overlay');
        const viewportHeight = window.innerHeight;
        
        // enhanced parallax and fade for hero content
        if (heroContent && scrollY < viewportHeight) {
            // apply dreamier fade and movement
            const opacity = Math.max(1 - (scrollY / (viewportHeight * 0.4)), 0);
            const translateY = scrollY * 0.4;
            const scale = 1 - (scrollY / viewportHeight) * 0.1;
            const blur = Math.min(scrollY / 50, 8);
            
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
            heroContent.style.filter = `blur(${blur}px)`;
        }
        
        // content overlay with gradual fade in
        if (contentOverlay) {
            if (scrollY > viewportHeight * 0.5) {
                const overlayOpacity = Math.min((scrollY - viewportHeight * 0.5) / (viewportHeight * 0.5), 1);
                contentOverlay.style.opacity = overlayOpacity;
            } else {
                contentOverlay.style.opacity = 0;
            }
        }
        
        // fade in sections with blur effect - improved for center clarity
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const sectionHeight = rect.height;
            
            // check if section is visible
            if (sectionTop < viewportHeight && sectionBottom > 0) {
                // calculate section position relative to viewport center
                const sectionCenter = sectionTop + (sectionHeight / 2);
                const viewportCenter = viewportHeight / 2;
                
                // calculate how centered the section is (0 = perfectly centered, 1 = out of view)
                const distFromCenter = Math.abs(viewportCenter - sectionCenter) / viewportHeight;
                
                // create a sweet spot where sections are fully clear
                const sweetSpotSize = 0.30; // adjust this to control the size of the clear zone
                
                // calculate visibility - fully visible when in sweet spot
                let visibility;
                
                if (distFromCenter < sweetSpotSize) {
                    // fully visible in the sweet spot
                    visibility = 1;
                } else {
                    // gradually fade based on distance from sweet spot
                    visibility = 1 - Math.min((distFromCenter - sweetSpotSize) / (0.5 - sweetSpotSize), 1);
                }
                
                // apply smooth fade, blur and transform transitions
                section.style.opacity = Math.max(0.2, visibility);
                
                // only apply blur when not in the sweet spot
                if (distFromCenter < sweetSpotSize) {
                    section.style.filter = 'blur(0px)';
                } else {
                    const blurAmount = Math.max(0, 5 - (visibility * 5));
                    section.style.filter = `blur(${blurAmount}px)`;
                }
                
                // reduce transform amount when closer to center
                const transformAmount = Math.max(0, 20 - (visibility * 20));
                section.style.transform = `translateY(${transformAmount}px)`;
            }
        });
        
        // parallax effect for background
        const backgroundAnimation = document.getElementById('background-animation');
        if (backgroundAnimation) {
            backgroundAnimation.style.transform = `translateY(${scrollY * 0.2}px)`;
        }
        
        // dreamy header transformation on scroll
        const header = document.querySelector('header');
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // enhanced project card hover effects
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        // mouse enter effect
        item.addEventListener('mouseenter', () => {
            // add subtle glow to other cards
            projectItems.forEach(other => {
                if (other !== item) {
                    other.style.opacity = '0.6';
                    other.style.filter = 'blur(2px)';
                }
            });
        });
        
        // mouse leave effect
        item.addEventListener('mouseleave', () => {
            // restore other cards
            projectItems.forEach(other => {
                other.style.opacity = '';
                other.style.filter = '';
            });
        });
        
        // mouse move effect - subtle parallax
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            // calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            // apply subtle transform
            item.style.transform = `
                translateY(-5px) 
                scale(1.02) 
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
            
            // add dynamic lighting effect
            const image = item.querySelector('img');
            if (image) {
                // calculate light position
                const lightX = (x / rect.width) * 100;
                const lightY = (y / rect.height) * 100;
                
                // apply lighting effect
                image.style.backgroundImage = `
                    radial-gradient(
                        circle at ${lightX}% ${lightY}%, 
                        rgba(255, 255, 255, 0.1), 
                        rgba(0, 0, 0, 0) 60%
                    )
                `;
            }
        });
        
        // reset transform on mouse leave
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            
            const image = item.querySelector('img');
            if (image) {
                image.style.backgroundImage = '';
            }
        });
    });
    
    // skill meter animation
    const skillItems = document.querySelectorAll('.skill-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const skillLevel = skillItem.querySelector('.skill-level');
                
                if (skillLevel) {
                    // get the percentage from the DOM
                    const percentageText = skillItem.querySelector('.skill-percentage').textContent;
                    const percentage = parseInt(percentageText);
                    
                    // animate the skill meter
                    skillLevel.style.width = '0%';
                    setTimeout(() => {
                        skillLevel.style.width = `${percentage}%`;
                    }, 100);
                }
                
                // unobserve after animation
                observer.unobserve(skillItem);
            }
        });
    }, { threshold: 0.2 });
    
    // observe all skill items
    skillItems.forEach(item => {
        observer.observe(item);
    });
    
    // form submission with dreamy effect
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // add submission effect
            this.classList.add('submitting');
            
            // simulate form submission
            setTimeout(() => {
                // simulate success and show message
                const formElements = this.elements;
                for (let i = 0; i < formElements.length; i++) {
                    formElements[i].disabled = true;
                    formElements[i].style.opacity = 0.7;
                }
                
                // create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-icon">✓</div>
                    <p>Thank you for your message! I'll respond shortly.</p>
                `;
                
                // add success message with fade-in effect
                this.style.overflow = 'hidden';
                this.style.height = `${this.offsetHeight}px`;
                this.innerHTML = '';
                this.appendChild(successMessage);
                
                // trigger animation
                setTimeout(() => {
                    successMessage.style.opacity = 1;
                    successMessage.style.transform = 'translateY(0)';
                }, 100);
                
                // reset form after delay
                setTimeout(() => {
                    this.reset();
                    this.innerHTML = '';
                    this.className = '';
                    this.style = '';
                    
                    // rebuild form (alternatively, you could reload the page)
                    const originalFormHTML = `
                        <input type="text" placeholder="Name" required>
                        <input type="email" placeholder="Email" required>
                        <textarea rows="5" placeholder="Message" required></textarea>
                        <button type="submit">Send Message</button>
                    `;
                    this.innerHTML = originalFormHTML;
                    this.classList.remove('submitting');
                }, 5000);
            }, 1500);
        });
    }
    
    // Initialize sections with gentle blur effect
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.transition = 'opacity 0.8s ease, filter 0.8s ease, transform 0.8s ease';
        section.style.opacity = 0;
        section.style.filter = 'blur(5px)';
        section.style.transform = 'translateY(20px)';
    });
    
    // Add additional styles for dreamy scrolling effect
    const style = document.createElement('style');
    style.textContent = `
        /* Dreamy scroll effect */
        body.scrolling * {
            transition: filter 0.6s ease;
        }
        
        body.scrolling .content-container {
            filter: blur(3px);
        }
        
        /* Enhanced header styles */
        header {
            transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        header.scrolled {
            background: rgba(15, 15, 25, 0.7);
            padding: 0.8rem;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }
        
        /* Form submission effect */
        .contact-content .submitting {
            position: relative;
            transition: all 0.6s ease;
        }
        
        .success-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .success-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, rgba(108, 99, 255, 0.7), rgba(190, 147, 255, 0.7));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
            margin-bottom: 1.5rem;
            box-shadow: 0 5px 15px rgba(108, 99, 255, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    // Force a scroll event to check initial visibility
    window.dispatchEvent(new Event('scroll'));
});

// Function to ensure project images are centered
function centerProjectImages() {
  // add css to style tag
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .project-item {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
    }

    .project-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    
    /* Ensure images maintain proper aspect ratio */
    .project-item::before {
      content: '';
      display: block;
      padding-top: 75%; /* 4:3 aspect ratio - adjust if needed */
    }
    
    .project-item img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `;
  document.head.appendChild(styleEl);
  
  // ensure all project images are centered
  document.querySelectorAll('.project-item img').forEach(img => {
    // ensure image has loaded
    if (img.complete) {
      setImgCentering(img);
    } else {
      img.onload = () => setImgCentering(img);
    }
  });
}

// Helper function to set proper centering
function setImgCentering(img) {
  // ensure parent has position relative
  const container = img.closest('.project-item');
  if (container) {
    container.style.position = 'relative';
    
    // check image dimensions to determine optimal centering
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = container.offsetWidth / container.offsetHeight;
    
    // adjust object-fit and position based on ratio comparison
    if (imgRatio > containerRatio) {
      // image is wider than container (proportionally)
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center';
    } else {
      // image is taller than container (proportionally)
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center';
    }
  }
}

// Call this function after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  centerProjectImages();
  
  // recenter on window resize
  window.addEventListener('resize', function() {
    centerProjectImages();
  });
});