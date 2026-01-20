/**
 * Portfolio - Project list and experience toggle functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Show more projects toggle
    const showMoreProjectsBtn = document.getElementById('show-more-projects');
    const hiddenProjects = document.querySelectorAll('.project-item.project-hidden');

    if (showMoreProjectsBtn && hiddenProjects.length > 0) {
        let projectsVisible = false;

        showMoreProjectsBtn.addEventListener('click', () => {
            projectsVisible = !projectsVisible;

            hiddenProjects.forEach((project, index) => {
                if (projectsVisible) {
                    project.style.display = 'flex';
                    project.classList.remove('project-hidden');
                    // Trigger animation
                    setTimeout(() => {
                        project.classList.add('is-visible');
                    }, index * 100);
                } else {
                    project.classList.remove('is-visible');
                    setTimeout(() => {
                        project.style.display = 'none';
                        project.classList.add('project-hidden');
                    }, 400);
                }
            });

            showMoreProjectsBtn.textContent = projectsVisible
                ? 'Show Less'
                : 'Show More Projects';
        });
    }

    // Show more experience toggle
    const showMoreExpBtn = document.getElementById('show-more-experience');
    const hiddenExperience = document.querySelectorAll('.timeline-item.timeline-hidden');

    if (showMoreExpBtn && hiddenExperience.length > 0) {
        let experienceVisible = false;

        showMoreExpBtn.addEventListener('click', () => {
            experienceVisible = !experienceVisible;

            hiddenExperience.forEach((item, index) => {
                if (experienceVisible) {
                    item.style.display = 'block';
                    item.classList.remove('timeline-hidden');
                    // Trigger animation
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, index * 100);
                } else {
                    item.classList.remove('is-visible');
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.add('timeline-hidden');
                    }, 400);
                }
            });

            showMoreExpBtn.textContent = experienceVisible
                ? 'Show Less'
                : 'Show More Experience';
        });
    }
});
