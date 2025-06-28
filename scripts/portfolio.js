// Portfolio-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectInteractions();
    initializeSkillInteractions();
});

const initializeProjectInteractions = () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add hover effects and interactions
    projectCards.forEach(card => {
        // Add stagger animation class
        card.classList.add('stagger-item');
        
        // Add click handler for project details
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a link
            if (e.target.tagName === 'A') return;
            
            const projectTitle = card.querySelector('h3').textContent;
            console.log(`Viewing project: ${projectTitle}`);
            
            // You can add modal functionality here
            // showProjectModal(projectTitle);
        });
        
        // Add keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View details for ${card.querySelector('h3').textContent}`);
    });
    
    // Add loading states for project images
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach(img => {
        img.addEventListener('load', () => {
            img.parentElement.classList.add('loaded');
        });
        
        img.addEventListener('error', () => {
            img.parentElement.classList.add('error');
        });
    });
};

const initializeSkillInteractions = () => {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        // Add click handler for skill filtering (future feature)
        tag.addEventListener('click', () => {
            const skillName = tag.textContent;
            console.log(`Filtering by skill: ${skillName}`);
            
            // You can implement skill filtering here
            // filterProjectsBySkill(skillName);
        });
        
        // Add keyboard navigation
        tag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tag.click();
            }
        });
        
        // Make tags focusable
        tag.setAttribute('tabindex', '0');
        tag.setAttribute('role', 'button');
    });
};

// Project filtering functionality (for future use)
const filterProjectsBySkill = (skillName) => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const projectTags = card.querySelectorAll('.project-tag');
        const hasSkill = Array.from(projectTags).some(tag => 
            tag.textContent.toLowerCase().includes(skillName.toLowerCase())
        );
        
        if (hasSkill) {
            card.style.display = 'block';
            card.classList.add('filtered-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('filtered-in');
        }
    });
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
        window.announceToScreenReader(`Filtered projects by ${skillName}`);
    }
};

// Reset project filters
const resetProjectFilters = () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('filtered-in');
    });
    
    if (window.announceToScreenReader) {
        window.announceToScreenReader('Reset project filters');
    }
};

// Project modal functionality (for future use)
const showProjectModal = (projectTitle) => {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">×</button>
                <h2>${projectTitle}</h2>
                <div class="modal-body">
                    <p>Project details would go here...</p>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    // Add close functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            closeBtn.click();
        }
    });
    
    // Add to page and animate in
    document.body.appendChild(modal);
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    });
    
    // Focus management
    closeBtn.focus();
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
        window.announceToScreenReader(`Opened project modal for ${projectTitle}`);
    }
};

// Export functions for global use
window.portfolio = {
    filterProjectsBySkill,
    resetProjectFilters,
    showProjectModal
}; 