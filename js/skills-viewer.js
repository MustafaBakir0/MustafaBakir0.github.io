/**
 * Skills Viewer - For showing/hiding additional skills
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the skills section
  initSkills();
  
  // Initialize the view all button if needed
  const viewAllButton = document.getElementById('view-all-skills');
  if (viewAllButton) {
    viewAllButton.addEventListener('click', toggleHiddenSkills);
  }
});

function initSkills() {
  // Add proficiency labels to skill items
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach(item => {
    const skillLevel = item.querySelector('.skill-level');
    const skillName = item.querySelector('.skill-name').textContent;
    
    if (skillLevel) {
      const width = skillLevel.style.width;
      const percentage = parseInt(width);
      
      let proficiency = 'foundational';
      let proficiencyText = 'Foundational';
      
      // Determine proficiency based on percentage
      if (percentage >= 90) {
        proficiency = 'expert';
        proficiencyText = 'Expert';
      } else if (percentage >= 80) {
        proficiency = 'advanced';
        proficiencyText = 'Advanced';
      } else if (percentage >= 60) {
        proficiency = 'intermediate';
        proficiencyText = 'Intermediate';
      }
      
      // Create proficiency label
      const proficiencyLabel = document.createElement('div');
      proficiencyLabel.className = `skill-proficiency ${proficiency}`;
      proficiencyLabel.textContent = proficiencyText;
      
      // Add to skill info
      const skillInfo = item.querySelector('.skill-info');
      if (skillInfo) {
        skillInfo.appendChild(proficiencyLabel);
      }
    }
  });
}

function toggleHiddenSkills() {
  const hiddenSkills = document.querySelector('.hidden-skills');
  const viewAllButton = document.getElementById('view-all-skills');
  
  if (hiddenSkills) {
    hiddenSkills.classList.toggle('visible');
    
    if (viewAllButton) {
      if (hiddenSkills.classList.contains('visible')) {
        viewAllButton.textContent = 'Show Fewer Skills';
      } else {
        viewAllButton.textContent = 'View All Skills';
      }
    }
  }
}