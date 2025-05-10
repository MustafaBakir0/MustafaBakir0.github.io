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

        // Ensure newly visible projects are bright and clear
        const newlyVisibleProjects = hiddenProjects.querySelectorAll('.project-item');
        newlyVisibleProjects.forEach(project => {
          // Ensure each project is bright and visible
          project.style.opacity = '1';
          project.style.filter = 'none';

          // Ensure images are bright
          const img = project.querySelector('img');
          if (img) {
            img.style.filter = 'none';
            img.style.opacity = '1';
          }

          // Ensure overlay is initially hidden
          const overlay = project.querySelector('.project-overlay');
          if (overlay) {
            overlay.style.opacity = '0';
          }
        });
      } else {
        loadMoreBtn.textContent = 'Load More Projects';
      }
    }
  }
}