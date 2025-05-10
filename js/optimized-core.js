/**
 * Optimized Core Functions
 * Consolidated from multiple files to improve performance
 */

// Performance monitoring (for development only - remove in production)
const perfMonitor = {
  scrollCount: 0,
  lastScrollTime: 0,
  init() {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      this.enabled = true;
      this.createUI();
      setInterval(() => this.updateStats(), 1000);
    }
  },
  createUI() {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;bottom:0;right:0;background:rgba(0,0,0,0.7);color:white;padding:5px;z-index:10000;font-size:12px;';
    div.innerHTML = 'FPS: <span id="fps">0</span> | Scroll: <span id="scroll-count">0</span>/s';
    document.body.appendChild(div);
    this.ui = div;
  },
  updateStats() {
    if (!this.enabled) return;
    document.getElementById('scroll-count').textContent = this.scrollCount;
    this.scrollCount = 0;
  },
  logScroll() {
    if (!this.enabled) return;
    this.scrollCount++;
  }
};

// Initialize core functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize performance monitoring (dev only)
  perfMonitor.init();

  // Initialize about section transitions with visible state
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    aboutSection.style.transition = 'transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease';
    aboutSection.style.transform = 'none';
    aboutSection.style.opacity = '1';
    aboutSection.style.filter = 'none';
  }

  // Initialize optimized intersection observer
  initObserver();

  // Set up a single scroll handler with throttling
  setupThrottledScroll();

  // Set up smooth scroll with a single implementation
  setupSmoothScroll();

  // Initialize expandable content (skills and projects)
  initExpandableContent();

  // Initialize liquid 3D hover effect for projects
  initLiquid3DEffect();
});


// Optimized IntersectionObserver - single implementation
function initObserver() {
  // Create a single observer for all elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const target = entry.target;
      
      // Check if element is intersecting (visible)
      if (entry.isIntersecting) {
        // Add visible class to animate in
        target.classList.add('visible');
        
        // Handle skill item animation
        if (target.classList.contains('skill-item')) {
          animateSkillItem(target);
        }
        
        // Unobserve after animation starts to save resources
        if (!target.classList.contains('section')) {
          observer.unobserve(target);
        }
      }
    });
  }, {
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% visible
  });
  
  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
  
  // Observe animated elements
  document.querySelectorAll('.bio-content p, .skill-item, .project-item:not(.hidden-projects .project-item)').forEach(item => {
    observer.observe(item);
  });
}

// Simple animation for skill items
function animateSkillItem(skillItem) {
  // Just make the skill item visible with animation
  skillItem.classList.add('animated');
}

// Set up a single, throttled scroll handler
function setupThrottledScroll() {
  let ticking = false;
  let lastScrollY = window.scrollY;
  let scrollTimeout;
  
  // Passive true for better performance
  window.addEventListener('scroll', function() {
    lastScrollY = window.scrollY;
    perfMonitor.logScroll();
    
    // Clear any existing timeout to prevent stacking
    clearTimeout(scrollTimeout);
    
    // Only process scroll events when browser can handle it
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll(lastScrollY);
        ticking = false;
      });
      
      ticking = true;
    }
    
    // Process final position after scrolling stops
    scrollTimeout = setTimeout(() => {
      if (lastScrollY !== window.scrollY) {
        lastScrollY = window.scrollY;
        handleScroll(lastScrollY);
      }
    }, 100);
  }, { passive: true });
  
  // Initial check
  handleScroll(window.scrollY);
}

// Main scroll handler - optimized to minimize calculations and DOM updates
function handleScroll(scrollY) {
  // Get viewport dimensions once
  const viewportHeight = window.innerHeight;
  
  // Determine scroll percentage
  const scrollPercentage = Math.min(scrollY / viewportHeight, 1);
  
  // Toggle header class efficiently
  const header = document.querySelector('header');
  if (header) {
    const hasScrolledClass = header.classList.contains('scrolled');
    if (scrollY > 50 && !hasScrolledClass) {
      header.classList.add('scrolled');
    } else if (scrollY <= 50 && hasScrolledClass) {
      header.classList.remove('scrolled');
    }
  }
  
  // Handle hero parallax and content overlay - efficiently
  handleParallaxEffects(scrollY, viewportHeight, scrollPercentage);
}

// Handle parallax and fade effects
function handleParallaxEffects(scrollY, viewportHeight, scrollPercentage) {
  // Store elements in variables to avoid repeated DOM lookups
  const heroContent = document.querySelector('.hero-content');
  const contentOverlay = document.getElementById('content-overlay');
  const aboutSection = document.querySelector('#about');

  // Only run these calculations if we're in the relevant scroll range
  // This avoids unnecessary work when scrolled past these sections
  if (scrollY < viewportHeight * 1.5) {
    // Apply dreamier hero content effects
    if (heroContent && scrollY < viewportHeight) {
      // Apply dreamier fade and movement for hero content
      const opacity = Math.max(1 - (scrollY / (viewportHeight * 0.4)), 0);
      const translateY = scrollY * 0.4;
      const scale = 1 - (scrollY / viewportHeight) * 0.1;
      const blur = Math.min(scrollY / 50, 8);

      // Batch DOM updates into a single reflow/repaint
      // Check if values have actually changed to avoid unnecessary style updates
      if (heroContent._lastOpacity !== opacity ||
          heroContent._lastTranslateY !== translateY ||
          heroContent._lastScale !== scale ||
          heroContent._lastBlur !== blur) {

        heroContent.style.opacity = opacity;
        heroContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
        heroContent.style.filter = `blur(${blur}px)`;

        // Cache last values to avoid redundant updates
        heroContent._lastOpacity = opacity;
        heroContent._lastTranslateY = translateY;
        heroContent._lastScale = scale;
        heroContent._lastBlur = blur;
      }
    }

    // Update content overlay opacity with the same optimization approach
    if (contentOverlay) {
      let overlayOpacity;

      // Start fade in after first half of viewport
      if (scrollY > viewportHeight * 0.5) {
        overlayOpacity = Math.min(
          Math.round((scrollY - viewportHeight * 0.5) / (viewportHeight * 0.5) * 100) / 100,
          0.8
        );
      } else {
        overlayOpacity = 0;
      }

      // Only update if changed
      if (contentOverlay._lastOpacity !== overlayOpacity) {
        contentOverlay.style.opacity = overlayOpacity;
        contentOverlay._lastOpacity = overlayOpacity;
      }
    }

    // No transition needed anymore - about section is always visible
    if (false) {
      // Transition disabled
      const transitionStart = 0;
      const transitionEnd = 0;

      if (scrollY >= transitionStart && scrollY <= transitionEnd) {
        // Calculate progress through transition zone (0 to 1)
        const transitionProgress = (scrollY - transitionStart) / (transitionEnd - transitionStart);

        // Apply transformations based on progress
        const translateY = Math.round(30 * (1 - transitionProgress)); // Move up as we scroll
        const opacity = Math.min(transitionProgress * 1.5, 1); // Fade in
        const blur = Math.max(5 * (1 - transitionProgress), 0); // Reduce blur as we scroll

        // Apply styles
        if (aboutSection._lastTranslateY !== translateY ||
            aboutSection._lastOpacity !== opacity ||
            aboutSection._lastBlur !== blur) {

          aboutSection.style.transform = `translateY(${translateY}px)`;
          aboutSection.style.opacity = opacity;
          aboutSection.style.filter = `blur(${blur}px)`;

          // Cache values
          aboutSection._lastTranslateY = translateY;
          aboutSection._lastOpacity = opacity;
          aboutSection._lastBlur = blur;
        }
      } else if (scrollY > transitionEnd && aboutSection._lastTranslateY !== 0) {
        // Ensure final state when past transition zone
        aboutSection.style.transform = 'translateY(0)';
        aboutSection.style.opacity = 1;
        aboutSection.style.filter = 'blur(0)';

        aboutSection._lastTranslateY = 0;
        aboutSection._lastOpacity = 1;
        aboutSection._lastBlur = 0;
      } else if (scrollY < transitionStart && aboutSection._lastOpacity !== 0) {
        // Ensure initial state when before transition zone
        aboutSection.style.transform = 'translateY(30px)';
        aboutSection.style.opacity = 0;
        aboutSection.style.filter = 'blur(5px)';

        aboutSection._lastTranslateY = 30;
        aboutSection._lastOpacity = 0;
        aboutSection._lastBlur = 5;
      }
    }
  }
}

// Smooth scroll - optimized single implementation
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip empty links
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      e.preventDefault();
      
      // Smooth scroll with native API
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Adjust for header
        behavior: 'smooth'
      });
    });
  });
}

// Initialize expandable content (skills and projects)
function initExpandableContent() {
  // View all skills button
  const viewAllSkillsBtn = document.getElementById('view-all-skills');
  if (viewAllSkillsBtn) {
    viewAllSkillsBtn.addEventListener('click', function() {
      toggleHiddenContent('hidden-skills', this, 'View All Skills', 'Show Fewer Skills');
    });
  }
  
  // Load more projects button
  const loadMoreProjectsBtn = document.getElementById('load-more-projects');
  if (loadMoreProjectsBtn) {
    loadMoreProjectsBtn.addEventListener('click', function() {
      toggleHiddenContent('hidden-projects', this, 'Load More Projects', 'Show Fewer Projects');
    });
  }
}

// Consolidated function to toggle hidden content
function toggleHiddenContent(containerClass, button, showText, hideText) {
  const container = document.querySelector(`.${containerClass}`);
  if (!container) return;

  const isVisible = container.classList.toggle('visible');

  // Update button text
  button.textContent = isVisible ? hideText : showText;

  // Animate new elements if they're now visible
  if (isVisible) {
    // Slight delay to allow transition to start
    setTimeout(() => {
      // Create a new observer for the newly visible elements
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Handle skill items
            if (entry.target.classList.contains('skill-item')) {
              animateSkillItem(entry.target);
            }

            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      // Observe newly visible elements
      container.querySelectorAll('.skill-item, .project-item').forEach(item => {
        observer.observe(item);
      });
    }, 50);
  }
}

// Initialize liquid 3D effect for projects
function initLiquid3DEffect() {
  // Add CSS with high specificity to ensure it works
  const style = document.createElement('style');
  style.textContent = `
    /* Liquid 3D effect styles */
    .project-item {
      --liquid-height: 0%;
      --x-position: 50%;
      --y-position: 50%;
      --rotation-x: 0deg;
      --rotation-y: 0deg;
      --scale: 1;
      --translate-y: 0px;
      transform-style: preserve-3d !important;
      perspective: 1000px !important;
      transform: perspective(1000px) rotateX(var(--rotation-x)) rotateY(var(--rotation-y)) scale3d(var(--scale), var(--scale), var(--scale)) translateY(var(--translate-y)) !important;
      transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
      will-change: transform, box-shadow, filter !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
      overflow: hidden !important;
      border-radius: 8px !important;
      background: rgba(20, 20, 35, 0.2) !important;
    }

    .project-item::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: var(--liquid-height);
      background: linear-gradient(to top,
        rgba(108, 99, 255, 0.5) 0%,
        rgba(190, 147, 255, 0.3) 50%,
        rgba(108, 99, 255, 0) 100%) !important;
      z-index: 1;
      filter: blur(7px);
      transition: height 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      border-radius: 50% 50% 0 0 / 20px;
      transform: translateZ(0px);
    }

    .project-item:hover {
      --liquid-height: 100%;
      --translate-y: -15px;
      --scale: 1.05;
      filter: brightness(1.1) !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
                  0 15px 20px rgba(108, 99, 255, 0.2) !important;
    }

    .project-item img {
      transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
      transform-style: preserve-3d !important;
      transform: translateZ(5px) !important;
    }

    .project-item:hover img {
      filter: contrast(1.1) saturate(1.1) brightness(0.8) !important;
    }

    .project-item .project-overlay {
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease !important;
      transform: translateZ(20px) !important;
      z-index: 2 !important;
      background: linear-gradient(
        to bottom,
        rgba(10, 10, 18, 0) 0%,
        rgba(10, 10, 18, 0.1) 50%,
        rgba(10, 10, 18, 0.5) 100%
      ) !important;
      mix-blend-mode: normal !important;
    }

    .project-item:hover .project-overlay {
      opacity: 1 !important;
    }

    .project-item .project-title {
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease !important;
      transform: translateZ(25px) !important;
      text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5) !important;
      z-index: 3 !important;
    }

    .project-item:hover .project-title {
      opacity: 1 !important;
    }

    .project-item .project-tagline {
      opacity: 0;
      transform: translateZ(22px) translateY(5px) !important;
      transition: opacity 0.3s ease, transform 0.3s ease !important;
      z-index: 3 !important;
    }

    .project-item:hover .project-tagline {
      opacity: 0.9 !important;
      transform: translateZ(22px) translateY(0) !important;
    }

    .project-item .light-reflection {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: radial-gradient(
        circle at var(--x-position) var(--y-position),
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0) 60%
      ) !important;
      opacity: 0;
      transition: opacity 0.4s ease !important;
      pointer-events: none !important;
      z-index: 4 !important;
      mix-blend-mode: overlay !important;
    }

    .project-item:hover .light-reflection {
      opacity: 0.6 !important;
    }

    /* Wave animation for liquid effect */
    @keyframes wave {
      0%, 100% {
        border-radius: 60% 40% 30% 70% / 30% 30% 70% 70%;
      }
      50% {
        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
      }
    }
  `;
  document.head.appendChild(style);

  // Get all project items
  const projectItems = document.querySelectorAll('.project-item');

  // Apply liquid 3D effect to each project
  projectItems.forEach(item => {
    // Add wave animation to the liquid effect using a separate element
    const liquidWave = document.createElement('div');
    liquidWave.className = 'liquid-wave';
    liquidWave.style.cssText = `
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 15px;
      background: rgba(108, 99, 255, 0.3);
      border-radius: 60% 40% 30% 70% / 30% 30% 70% 70%;
      filter: blur(5px);
      animation: wave 8s infinite ease-in-out;
      z-index: 2;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.4s ease;
    `;
    item.appendChild(liquidWave);

    // Ensure light reflection element exists
    if (!item.querySelector('.light-reflection')) {
      const reflection = document.createElement('div');
      reflection.className = 'light-reflection';
      item.appendChild(reflection);
    }

    // Mouse move handler for 3D effect
    item.addEventListener('mousemove', function(e) {
      // Get dimensions of the project item
      const rect = item.getBoundingClientRect();

      // Calculate mouse position relative to the center of the item
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate mouse position as percentage for reflection
      const xPercent = Math.round((mouseX / rect.width) * 100);
      const yPercent = Math.round((mouseY / rect.height) * 100);

      // Calculate rotation angles (limited to ±12 degrees for more subtle effect)
      const rotateY = (((mouseX / rect.width) * 24) - 12).toFixed(1);
      const rotateX = (12 - ((mouseY / rect.height) * 24)).toFixed(1);

      // Apply the 3D transform and light effect using CSS properties
      item.style.setProperty('--x-position', `${xPercent}%`);
      item.style.setProperty('--y-position', `${yPercent}%`);
      item.style.setProperty('--rotation-x', `${rotateX}deg`);
      item.style.setProperty('--rotation-y', `${rotateY}deg`);
      item.style.setProperty('--scale', '1.03');
      item.style.setProperty('--translate-y', '-5px'); // Slight levitation on mouse move

      // Show the liquid wave
      liquidWave.style.opacity = '1';

      // Calculate shadow direction based on mouse position
      const shadowX = ((mouseX / rect.width) - 0.5) * 15;
      const shadowY = ((mouseY / rect.height) - 0.5) * 15;

      // Apply shadow - deeper shadow for more dramatic effect
      item.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.3),
                              0 15px 30px rgba(108, 99, 255, 0.2)`;
    });

    // Mouse leave handler to reset effects
    item.addEventListener('mouseleave', function() {
      // Reset all transforms
      item.style.setProperty('--rotation-x', '0deg');
      item.style.setProperty('--rotation-y', '0deg');
      item.style.setProperty('--scale', '1');
      item.style.setProperty('--translate-y', '0px');

      // Reset shadow
      item.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';

      // Hide the liquid wave
      liquidWave.style.opacity = '0';
    });
  });
}