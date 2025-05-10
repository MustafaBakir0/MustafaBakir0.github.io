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