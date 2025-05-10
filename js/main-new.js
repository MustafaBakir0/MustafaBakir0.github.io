// resonance-interactions.js - Enhanced interactions and effects for Resonance theme

document.addEventListener('DOMContentLoaded', function() {
    // smooth scroll for navigation now handled by optimized-core.js

    // enhanced project card hover effects
    const projectItems = document.querySelectorAll('.project-item');

    // Reset function to ensure clean state for all projects
    function resetAllProjects() {
        projectItems.forEach(card => {
            card.style.transform = '';
            card.style.boxShadow = '';
            card.style.border = '';
            
            const cardImage = card.querySelector('img');
            if (cardImage) {
                cardImage.style.backgroundImage = '';
            }
        });
    }

    // Reset all projects initially (in case of any stuck states)
    resetAllProjects();
    projectItems.forEach(item => {
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
            // Reset this card's effects
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
    
    // Initialize sections with full visibility
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.transition = 'opacity 0.8s ease, filter 0.8s ease, transform 0.8s ease';
        section.style.opacity = 1;
        section.style.filter = 'none';
        section.style.transform = 'none';
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