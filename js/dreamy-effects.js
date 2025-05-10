/**
 * Dreamy Effects for Hero Section
 * Adds magical stars and interactive effects
 */

document.addEventListener('DOMContentLoaded', function() {
  // Create magical twinkling stars
  createMagicalStars();
  
  // Add interactive glow effect to hero content
  addInteractiveGlow();
});

/**
 * Creates magical twinkling stars in the hero section
 */
function createMagicalStars() {
  const starsContainer = document.querySelector('.magic-stars');
  if (!starsContainer) return;
  
  // Clear any existing stars
  starsContainer.innerHTML = '';
  
  // Create random stars
  const numberOfStars = Math.max(window.innerWidth / 10, 30); // Responsive number of stars
  
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random properties
    const size = Math.random() * 3 + 1; // 1-4px
    const top = Math.random() * 100; // 0-100%
    const left = Math.random() * 100; // 0-100%
    const duration = Math.random() * 3 + 3; // 3-6s
    const delay = Math.random() * 5; // 0-5s
    const intensity = Math.random() * 0.5 + 0.3; // 0.3-0.8
    
    // Apply properties as CSS variables
    star.style.setProperty('--size', `${size}px`);
    star.style.setProperty('--top', `${top}%`);
    star.style.setProperty('--left', `${left}%`);
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);
    star.style.setProperty('--intensity', intensity);
    
    starsContainer.appendChild(star);
  }
}

/**
 * Adds interactive glow effect to hero content on mouse movement
 */
function addInteractiveGlow() {
  const heroContent = document.querySelector('.hero-content');
  const hero = document.querySelector('.hero');
  
  if (!heroContent || !hero) return;
  
  hero.addEventListener('mousemove', function(e) {
    // Get mouse position relative to hero section
    const rect = hero.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // x position within hero
    const mouseY = e.clientY - rect.top;  // y position within hero
    
    // Calculate position as percentages
    const percentX = mouseX / rect.width;
    const percentY = mouseY / rect.height;
    
    // Calculate distance from center (0-1)
    const centerX = 0.5;
    const centerY = 0.5;
    const distanceX = percentX - centerX;
    const distanceY = percentY - centerY;
    
    // Apply gentle tilt effect
    const tiltAmount = 2; // degrees
    const tiltX = -distanceY * tiltAmount;
    const tiltY = distanceX * tiltAmount;
    
    // Add slight glow where cursor is pointing
    const glowX = percentX * 100;
    const glowY = percentY * 100;
    
    // Apply transforms
    heroContent.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    
    // Dynamic subtle radial glow following cursor
    heroContent.style.backgroundImage = `
      radial-gradient(
        circle at ${glowX}% ${glowY}%, 
        rgba(108, 99, 255, 0.1) 0%, 
        rgba(0, 0, 0, 0) 60%
      )
    `;
  });
  
  // Reset on mouse leave
  hero.addEventListener('mouseleave', function() {
    heroContent.style.transform = '';
    heroContent.style.backgroundImage = '';
  });
  
  // Create a subtle floating animation for main title
  const mainTitle = document.querySelector('.main-title');
  if (mainTitle) {
    // Already has CSS animations, but we can enhance them with parallax effect
    document.addEventListener('scroll', function() {
      const scrollY = window.scrollY;
      
      // Only apply when near the top
      if (scrollY < window.innerHeight) {
        // Subtle parallax effect - title moves at different rate than hero
        const parallaxOffset = scrollY * 0.2;
        mainTitle.style.transform = `translateY(${parallaxOffset}px)`;
      }
    });
  }
}

// Handle window resize
window.addEventListener('resize', function() {
  // Recreate stars for new window size
  createMagicalStars();
});