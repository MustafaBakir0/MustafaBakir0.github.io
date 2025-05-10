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
  
  // Add hover effects for project containers
  setupProjectHoverEffects();
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
      // Make sure overlay is hidden by default for all projects
      overlay.style.opacity = '0';
    }

    // Make sure all project images have no filters by default
    const img = item.querySelector('img');
    if (img) {
      img.style.filter = 'none';
      img.style.opacity = '1';
    }
  });
}

function setupProjectAnimations() {
  const projectItems = document.querySelectorAll('.project-item');
  
  projectItems.forEach(item => {
    // No special opacity manipulation to avoid conflicts with hover effects
    item.style.transition = 'opacity 0.8s ease, transform 0.5s ease';
    
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
  img.style.opacity = '0.8'; // Start with higher opacity

  img.onload = () => {
    img.style.opacity = '1';
    img.style.filter = 'none'; // Ensure no filters are applied
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

// Add hover effects that apply to all projects including dynamically loaded ones
function setupProjectHoverEffects() {
  // Clear any existing styles first
  document.querySelectorAll('.project-item').forEach(item => {
    // Ensure each project item is bright and visible
    item.style.opacity = '1';
    item.style.filter = 'none';

    // Ensure images are bright
    const img = item.querySelector('img');
    if (img) {
      img.style.filter = 'none';
      img.style.opacity = '1';
    }

    // Ensure overlay is initially hidden
    const overlay = item.querySelector('.project-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
    }
  });

  // Add transition styles for project items with higher priority
  const style = document.createElement('style');
  style.textContent = `
    .project-item {
      transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1) !important;
      transform-style: preserve-3d !important;
      transform: perspective(1000px) !important;
      will-change: transform, box-shadow !important;
      backface-visibility: hidden !important;
    }

    .project-item img {
      opacity: 1 !important;
      filter: none !important;
      transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1) !important;
      transform-style: preserve-3d !important;
    }
  `;
  document.head.appendChild(style);

  // Add event listeners for project containers
  const projectsFlow = document.querySelectorAll('.projects-flow');

  // Function to handle 3D panning effect
  function handle3DEffect(e, projectItem) {
    if (!projectItem) return;

    // Get dimensions of the project item
    const rect = projectItem.getBoundingClientRect();

    // Calculate mouse position relative to the center of the item
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Calculate rotation angles (limited to ±15 degrees)
    const rotateY = 15 * mouseX / (rect.width / 2);
    const rotateX = -15 * mouseY / (rect.height / 2);

    // Apply the 3D transform
    projectItem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

    // Add a subtle shadow effect that moves with the tilt
    const shadowX = (mouseX / rect.width) * 20;
    const shadowY = (mouseY / rect.height) * 20;
    projectItem.style.boxShadow = `${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.3)`;
  }

  // Function to reset the 3D effects
  function reset3DEffect(projectItem) {
    if (!projectItem) return;

    // Reset transform
    projectItem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    projectItem.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
  }

  projectsFlow.forEach(container => {
    // Track mouse movement for 3D effect inside each project
    container.addEventListener('mousemove', function(e) {
      const projectItem = e.target.closest('.project-item');
      if (projectItem) {
        handle3DEffect(e, projectItem);
      }
    });

    // Show overlay on hover without dimming other projects
    container.addEventListener('mouseover', function(e) {
      // Find the hovered project if any
      const hoveredProject = e.target.closest('.project-item');

      if (hoveredProject) {
        // Make sure overlay is visible for hovered project
        const overlay = hoveredProject.querySelector('.project-overlay');
        if (overlay) {
          overlay.style.opacity = '1';
        }

        // Make title visible
        const title = hoveredProject.querySelector('.project-title');
        if (title) {
          title.style.opacity = '1';
        }

        // Make tagline visible
        const tagline = hoveredProject.querySelector('.project-tagline');
        if (tagline) {
          tagline.style.opacity = '0.9';
          tagline.style.transform = 'translateY(0)';
        }
      }
    });

    // Hide overlay and reset 3D effect when mouse leaves project
    container.addEventListener('mouseout', function(e) {
      const fromElement = e.target;
      const toElement = e.relatedTarget;

      // Only hide if we're leaving a project item and not entering a child of it
      if (fromElement.closest('.project-item') &&
          (!toElement || !fromElement.closest('.project-item').contains(toElement))) {

        const projectItem = fromElement.closest('.project-item');

        // Reset 3D effect
        reset3DEffect(projectItem);

        // Reset overlay
        const overlay = projectItem.querySelector('.project-overlay');
        if (overlay) {
          overlay.style.opacity = '0';
        }

        // Reset title
        const title = projectItem.querySelector('.project-title');
        if (title) {
          title.style.opacity = '0';
        }

        // Reset tagline
        const tagline = projectItem.querySelector('.project-tagline');
        if (tagline) {
          tagline.style.opacity = '0';
          tagline.style.transform = 'translateY(10px)';
        }
      }
    });
  });
}