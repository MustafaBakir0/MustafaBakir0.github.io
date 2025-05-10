/**
 * Load More Functionality for Projects and Skills
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize load more for projects
  initLoadMore();
});

function initLoadMore() {
  // Project load more button
  const loadMoreBtn = document.getElementById('load-more-projects');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', toggleProjects);
  }
  
  // Set animation delay for each hidden project
  const hiddenProjects = document.querySelectorAll('.hidden-projects .project-item');
  hiddenProjects.forEach((item, index) => {
    item.style.setProperty('--item-index', index);
  });
}

function toggleProjects() {
  const hiddenProjects = document.querySelector('.hidden-projects');
  const loadMoreBtn = document.getElementById('load-more-projects');
  
  if (hiddenProjects) {
    hiddenProjects.classList.toggle('visible');
    
    if (loadMoreBtn) {
      if (hiddenProjects.classList.contains('visible')) {
        loadMoreBtn.textContent = 'Show Fewer Projects';
      } else {
        loadMoreBtn.textContent = 'Load More Projects';
      }
    }
  }
}