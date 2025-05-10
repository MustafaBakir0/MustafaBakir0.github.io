/**
 * Adaptive Smooth Scrolling and Animation
 * Replaces hard-coded blur effects with adaptive, smooth animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize scroll-based animations
  initScrollAnimations();
  
  // Set up smooth scrolling for all anchor links
  setupSmoothScroll();
});

function initScrollAnimations() {
  // Get all sections
  const sections = document.querySelectorAll('.section');
  
  // Create an intersection observer for animations
  const observerOptions = {
    root: null, // use the viewport
    rootMargin: '0px',
    threshold: 0.1 // trigger when 10% of the element is visible
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Check if the section is intersecting
      if (entry.isIntersecting) {
        // Add visible class to the section
        entry.target.classList.add('section-visible');
        
        // Animate the skills, projects or content inside the section
        animateSection(entry.target);
      } else {
        // Optionally remove the class for re-animation when scrolling back up
        // entry.target.classList.remove('section-visible');
      }
    });
  }, observerOptions);
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Also observe load more buttons to ensure they're always visible
  const loadMoreButtons = document.querySelectorAll('.load-more-btn, .view-all-skills');
  loadMoreButtons.forEach(button => {
    button.classList.add('always-visible');
  });
}

function animateSection(section) {
  // Determine which section we're animating
  const sectionId = section.getAttribute('id');
  
  if (sectionId === 'skills') {
    // Animate skill items
    const skillItems = section.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
      // Skip if it's in the hidden skills section and not visible yet
      if (item.closest('.hidden-skills') && 
          !item.closest('.hidden-skills').classList.contains('visible')) {
        return;
      }
      
      // Staggered animation
      setTimeout(() => {
        item.classList.add('animated');
      }, 100 * index);
    });
  } 
  else if (sectionId === 'work') {
    // Animate project items
    const projectItems = section.querySelectorAll('.project-item');
    projectItems.forEach((item, index) => {
      // Skip if it's in the hidden projects section and not visible yet
      if (item.closest('.hidden-projects') && 
          !item.closest('.hidden-projects').classList.contains('visible')) {
        return;
      }
      
      // Staggered animation
      setTimeout(() => {
        item.classList.add('animated');
      }, 150 * index);
    });
  }
  else if (sectionId === 'about') {
    // Animate bio content
    const bioItems = section.querySelectorAll('.bio-content p');
    bioItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animated');
      }, 200 * index);
    });
  }
}

function setupSmoothScroll() {
  // Select all links with hashes
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      // Skip links that don't actually link to anything
      if (this.getAttribute('href') === '#') return;
      
      const targetId = this.getAttribute('href').split('#')[1];
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Smooth scroll to the target
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });
}

// Handle dynamic content loading (skills and projects)
document.addEventListener('contentLoaded', function(e) {
  // Get the target section
  const targetSection = e.detail.section;
  const targetElement = document.getElementById(targetSection);
  
  if (targetElement) {
    // Re-run animations for newly revealed content
    animateSection(targetElement);
  }
});

// Dispatch custom event when content is loaded
function notifyContentLoaded(sectionId) {
  const event = new CustomEvent('contentLoaded', {
    detail: { section: sectionId }
  });
  document.dispatchEvent(event);
}

// Modify the existing toggleProjects and toggleHiddenSkills functions
window.toggleProjects = function() {
  const hiddenProjects = document.querySelector('.hidden-projects');
  const loadMoreBtn = document.getElementById('load-more-projects');
  
  if (hiddenProjects) {
    hiddenProjects.classList.toggle('visible');
    
    if (hiddenProjects.classList.contains('visible')) {
      // Notify that new content is loaded
      setTimeout(() => {
        notifyContentLoaded('work');
      }, 100); // Small delay to let the CSS transition start
      
      if (loadMoreBtn) {
        loadMoreBtn.textContent = 'Show Fewer Projects';
      }
    } else {
      if (loadMoreBtn) {
        loadMoreBtn.textContent = 'Load More Projects';
      }
    }
  }
};

window.toggleHiddenSkills = function() {
  const hiddenSkills = document.querySelector('.hidden-skills');
  const viewAllButton = document.getElementById('view-all-skills');
  
  if (hiddenSkills) {
    hiddenSkills.classList.toggle('visible');
    
    if (hiddenSkills.classList.contains('visible')) {
      // Notify that new content is loaded
      setTimeout(() => {
        notifyContentLoaded('skills');
      }, 100); // Small delay to let the CSS transition start
      
      if (viewAllButton) {
        viewAllButton.textContent = 'Show Fewer Skills';
      }
    } else {
      if (viewAllButton) {
        viewAllButton.textContent = 'View All Skills';
      }
    }
  }
};