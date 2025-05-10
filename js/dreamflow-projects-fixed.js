/**
 * DreamFlow Projects - Fixed Version
 * Simplified JavaScript for more reliable text centering
 * With added image lazy loading for better performance
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the project layouts
  initProjects();
  
  // Add simple animations for project cards
  setupProjectAnimations();
  
  // Set up lazy loading for project images
  setupLazyLoading();
});

function initProjects() {
  // Get all project items
  const projectItems = document.querySelectorAll('.project-item');
  
  // Make sure the proper classes are applied to container
  const projectsContainer = document.querySelector('.projects-container');
  if (!projectsContainer) return;
  
  // Make sure we're using the projects-flow class
  const projectsWrapper = document.querySelector('.projects-orbit');
  if (projectsWrapper) {
    projectsWrapper.classList.remove('projects-orbit');
    projectsWrapper.classList.add('projects-flow');
  }
  
  // Set first project as featured
  if (projectItems.length > 0 && !projectItems[0].classList.contains('featured')) {
    projectItems[0].classList.add('featured');
    
    // Add featured badge if not present
    if (!projectItems[0].querySelector('.featured-badge')) {
      const badge = document.createElement('div');
      badge.className = 'featured-badge';
      badge.textContent = 'Featured Project';
      projectItems[0].appendChild(badge);
    }
  }
  
  // Add necessary elements to project items
  projectItems.forEach((item, index) => {
    // Add project category if needed
    if (!item.querySelector('.project-category')) {
      const category = document.createElement('div');
      category.className = 'project-category';
      
      // Determine category based on image or index
      const imageSrc = item.querySelector('img')?.getAttribute('src') || '';
      
      let categoryText = 'Project';
      if (imageSrc.includes('lcms')) {
        categoryText = 'Software';
      } else if (imageSrc.includes('DFT')) {
        categoryText = 'Visualization';
      } else if (imageSrc.includes('webster')) {
        categoryText = 'Web Project';
      } else if (imageSrc.includes('filmbg')) {
        categoryText = 'Multimedia';
      } else if (imageSrc.includes('p5')) {
        categoryText = 'Audio';
      }
      
      category.textContent = categoryText;
      item.appendChild(category);
    }
    
    // Add reflection element if needed
    if (!item.querySelector('.light-reflection')) {
      const reflection = document.createElement('div');
      reflection.className = 'light-reflection';
      item.appendChild(reflection);
    }
    
    // Ensure project overlay is positioned correctly
    const overlay = item.querySelector('.project-overlay');
    if (overlay) {
      // Force a layout recalculation
      setTimeout(() => {
        overlay.style.opacity = '0.9';
      }, 10);
    }
  });
}

function setupProjectAnimations() {
  const projectItems = document.querySelectorAll('.project-item');
  
  projectItems.forEach(item => {
    // Set initial opacity for fade-in effect
    item.style.opacity = '0';
    
    // Simple fade-in animation on load
    setTimeout(() => {
      item.style.transition = 'opacity 0.8s ease, transform 0.5s ease';
      item.style.opacity = '1';
    }, 100);
    
    // Add click navigation
    if (item.tagName !== 'A') {
      item.addEventListener('click', function() {
        const link = this.getAttribute('data-link') || this.querySelector('a')?.getAttribute('href');
        if (link) {
          // Animate click
          this.style.transform = 'scale(0.98)';
          setTimeout(() => {
            window.location.href = link;
          }, 200);
        }
      });
    }
    
    // Add focus support for keyboard navigation
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const link = this.getAttribute('href') || this.querySelector('a')?.getAttribute('href');
        if (link) {
          window.location.href = link;
        }
      }
    });
  });
}

// Add lazy loading for project images
function setupLazyLoading() {
  // Check for native lazy loading support
  const hasNativeLazy = 'loading' in HTMLImageElement.prototype;
  
  // Get all project images
  const projectImages = document.querySelectorAll('.project-item img');
  
  projectImages.forEach(img => {
    // Skip images that are already loaded
    if (img.complete) return;
    
    // For hidden projects, we'll use a different approach
    const isInHiddenProject = img.closest('.hidden-projects') !== null;
    
    if (hasNativeLazy && !isInHiddenProject) {
      // Use built-in browser lazy loading
      img.loading = 'lazy';
      
      // Still provide low quality placeholder
      applyImagePlaceholder(img);
    } else {
      // For browsers without native support or hidden projects
      // Use custom lazy loading with IntersectionObserver
      customLazyLoad(img, isInHiddenProject);
    }
  });
}

// Create low-quality placeholders for better UX during loading
function applyImagePlaceholder(img) {
  // Get the original source
  const originalSrc = img.getAttribute('src');
  
  // If it's a small icon or SVG, just leave it alone
  if (originalSrc.includes('icons') || originalSrc.endsWith('.svg')) {
    return;
  }
  
  // Create ultra-low placeholder style as background
  img.style.backgroundColor = '#1a1a2a';
  
  // Fade in once loaded
  img.style.transition = 'opacity 0.5s ease';
  img.style.opacity = '0.3';
  
  img.onload = () => {
    img.style.opacity = '1';
    img.style.backgroundColor = '';
  };
}

// Custom lazy loading for browsers without native support
function customLazyLoad(img, isHidden) {
  // Get the original source
  const originalSrc = img.getAttribute('src');
  
  // Store original src and use a placeholder or tiny version
  img.setAttribute('data-src', originalSrc);
  img.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E');
  
  // Apply placeholder style
  applyImagePlaceholder(img);
  
  if (!isHidden) {
    // Use IntersectionObserver to load when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetImg = entry.target;
          targetImg.src = targetImg.getAttribute('data-src');
          observer.unobserve(targetImg);
        }
      });
    }, {
      rootMargin: '100px', // Start loading when within 100px of viewport
      threshold: 0.01
    });
    
    observer.observe(img);
  } else {
    // For hidden projects, we'll load when they become visible
    const hiddenContainer = img.closest('.hidden-projects');
    
    if (hiddenContainer) {
      // Create a mutation observer to watch for class changes
      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.attributeName === 'class' && 
              hiddenContainer.classList.contains('visible')) {
            // When container becomes visible, load the image
            img.src = img.getAttribute('data-src');
            mutationObserver.disconnect();
          }
        });
      });
      
      // Start observing the hidden container
      mutationObserver.observe(hiddenContainer, { attributes: true });
    }
  }
}