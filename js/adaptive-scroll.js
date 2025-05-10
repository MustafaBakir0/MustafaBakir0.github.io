/**
 * Adaptive Scroll System
 * Replaces hard-coded scroll animations with adaptive, viewport-based animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the IntersectionObserver
  initIntersectionObserver();
  
  // Handle smooth scrolling for navigation links
  setupSmoothScroll();
  
  // Add scroll detection for content overlay
  setupScrollDetection();
  
  // Handle load more buttons
  setupContentLoaders();
});

function initIntersectionObserver() {
  // Create options for the observer
  const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: '0px',
    threshold: buildThresholdList() // Use multiple thresholds for smoother animations
  };
  
  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Get the intersection ratio (how much of the element is visible)
      const intersectionRatio = entry.intersectionRatio;
      
      // Apply animations based on visibility
      if (intersectionRatio > 0) {
        // Element is at least partially visible
        entry.target.classList.add('section-visible');
        
        // Apply proportional animation based on how much is visible
        applyProportionalAnimation(entry.target, intersectionRatio);
      } else {
        // Element is not visible (optional - can remove this to keep animations permanent)
        // entry.target.classList.remove('section-visible');
      }
    });
  }, observerOptions);
  
  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
  
  // Also observe individual content blocks within sections
  const contentElements = [
    ...document.querySelectorAll('.bio-content p'),
    ...document.querySelectorAll('.skill-item'),
    ...document.querySelectorAll('.project-item')
  ];
  
  contentElements.forEach((element, index) => {
    // Set a data attribute for animation order (used for staggered animations)
    element.setAttribute('data-animate-index', index % 10); // Limit to 10 for repeating patterns
    
    // Observe the element
    observer.observe(element);
  });
  
  // Force initial check
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
}

function applyProportionalAnimation(element, visibilityRatio) {
  // Add the animated class when element becomes visible
  if (visibilityRatio > 0.1 && !element.classList.contains('animated')) {
    element.classList.add('animated');
    
    // Apply staggered animation based on index if it exists
    const animateIndex = element.getAttribute('data-animate-index');
    if (animateIndex) {
      element.style.animationDelay = `${parseInt(animateIndex) * 0.1}s`;
    }
  }
  
  // If this is a section, check for children to animate
  if (element.classList.contains('section') && element.id) {
    animateSectionChildren(element.id, visibilityRatio);
  }
}

function animateSectionChildren(sectionId, visibilityRatio) {
  // Only animate children if section is significantly visible
  if (visibilityRatio < 0.3) return;
  
  const section = document.getElementById(sectionId);
  
  // Animate different elements based on section type
  switch(sectionId) {
    case 'about':
      animateWithDelay(section.querySelectorAll('.bio-content p'), 150);
      break;
      
    case 'work':
      // Only animate visible projects (not hidden ones unless they're shown)
      const visibleProjects = section.querySelectorAll('.projects-flow:not(.hidden-projects) .project-item, .hidden-projects.visible .project-item');
      animateWithDelay(visibleProjects, 150);
      break;
      
    case 'skills':
      // Only animate visible skills
      const visibleSkills = section.querySelectorAll('.skills-row .skill-item, .hidden-skills.visible .skill-item');
      animateWithDelay(visibleSkills, 100);
      
      // Also animate skill bars if they exist
      visibleSkills.forEach(skill => {
        const skillLevel = skill.querySelector('.skill-level');
        if (skillLevel && !skillLevel.classList.contains('animated')) {
          // Get the target width from the style
          const targetWidth = skillLevel.style.width;
          
          // Animate from 0 to target width
          skillLevel.style.width = '0%';
          setTimeout(() => {
            skillLevel.style.width = targetWidth;
            skillLevel.classList.add('animated');
          }, 50);
        }
      });
      break;
      
    case 'contact':
      animateWithDelay(section.querySelectorAll('input, textarea, button'), 150);
      break;
  }
}

function animateWithDelay(elements, delay) {
  elements.forEach((element, index) => {
    if (!element.classList.contains('animated')) {
      setTimeout(() => {
        element.classList.add('animated');
      }, index * delay);
    }
  });
}

function setupSmoothScroll() {
  // Add smooth scroll behavior to all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip empty links
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Add scrolling indicator to body
        document.body.classList.add('is-scrolling');
        
        // Smooth scroll
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
        
        // Remove scrolling indicator after animation completes
        setTimeout(() => {
          document.body.classList.remove('is-scrolling');
        }, 800);
      }
    });
  });
}

function setupScrollDetection() {
  // Handle scroll events for adaptive overlays and effects
  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.clientHeight;
    
    // Calculate scroll percentage (0 to 1)
    const scrollPercentage = scrollTop / (documentHeight - windowHeight);
    
    // Add scrolled class to body at specific scroll point
    if (scrollTop > 50) {
      document.body.classList.add('is-scrolled');
    } else {
      document.body.classList.remove('is-scrolled');
    }
    
    // Handle content overlay opacity
    const contentOverlay = document.getElementById('content-overlay');
    if (contentOverlay) {
      // Start fading in at 70% of first viewport height
      const fadeStart = windowHeight * 0.7;
      
      if (scrollTop > fadeStart) {
        // Calculate opacity based on scroll position
        const fadeRange = windowHeight * 0.5; // Transition over 50% of viewport
        const opacity = Math.min((scrollTop - fadeStart) / fadeRange, 0.8);
        contentOverlay.style.opacity = opacity;
      } else {
        contentOverlay.style.opacity = 0;
      }
    }
  });
}

function setupContentLoaders() {
  // Set up load more projects button
  const loadMoreProjectsBtn = document.getElementById('load-more-projects');
  if (loadMoreProjectsBtn) {
    loadMoreProjectsBtn.addEventListener('click', toggleProjects);
  }
  
  // Set up view all skills button
  const viewAllSkillsBtn = document.getElementById('view-all-skills');
  if (viewAllSkillsBtn) {
    viewAllSkillsBtn.addEventListener('click', toggleHiddenSkills);
  }
  
  // Set animation delay for hidden elements
  document.querySelectorAll('.hidden-projects .project-item, .hidden-skills .skill-item')
    .forEach((item, index) => {
      item.style.setProperty('--item-index', index);
    });
}

function toggleProjects() {
  const hiddenProjects = document.querySelector('.hidden-projects');
  const loadMoreBtn = this;
  
  if (hiddenProjects) {
    hiddenProjects.classList.toggle('visible');
    
    if (hiddenProjects.classList.contains('visible')) {
      loadMoreBtn.textContent = 'Show Fewer Projects';
      
      // Animate newly visible projects with delay
      setTimeout(() => {
        animateWithDelay(hiddenProjects.querySelectorAll('.project-item'), 150);
      }, 300); // Wait for transition to start
      
    } else {
      loadMoreBtn.textContent = 'Load More Projects';
    }
  }
}

function toggleHiddenSkills() {
  const hiddenSkills = document.querySelector('.hidden-skills');
  const viewAllBtn = this;
  
  if (hiddenSkills) {
    hiddenSkills.classList.toggle('visible');
    
    if (hiddenSkills.classList.contains('visible')) {
      viewAllBtn.textContent = 'Show Fewer Skills';
      
      // Animate newly visible skills with delay
      setTimeout(() => {
        const skillItems = hiddenSkills.querySelectorAll('.skill-item');
        animateWithDelay(skillItems, 100);
        
        // Also animate skill levels
        skillItems.forEach(item => {
          const skillLevel = item.querySelector('.skill-level');
          if (skillLevel) {
            skillLevel.style.width = '0%';
            
            // Get the target width
            const percentage = item.querySelector('.skill-percentage')?.textContent || '0%';
            
            setTimeout(() => {
              skillLevel.style.width = percentage;
            }, 100);
          }
        });
      }, 300); // Wait for transition to start
      
    } else {
      viewAllBtn.textContent = 'View All Skills';
    }
  }
}

// Helper function to build threshold list for smoother animations
function buildThresholdList() {
  const thresholds = [];
  const numSteps = 20;
  
  for (let i = 1; i <= numSteps; i++) {
    const ratio = i / numSteps;
    thresholds.push(ratio);
  }
  
  return thresholds;
}