/**
 * Skills Viewer - For showing all skills with proficiency labels
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the skills section
  initSkills();
  
  // Show all skills by default
  showAllSkills();
});

function initSkills() {
  // Add proficiency labels to skill items
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach(item => {
    // Check if the item already has a proficiency label
    const existingLabel = item.querySelector('.skill-proficiency');
    if (existingLabel) {
      return; // Skip if it already has a proficiency label
    }
    
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
      
      // Remove skill meter if it exists
      const skillMeter = item.querySelector('.skill-meter');
      if (skillMeter) {
        skillMeter.remove();
      }
      
      // Add to skill info
      const skillInfo = item.querySelector('.skill-info');
      if (skillInfo) {
        skillInfo.appendChild(proficiencyLabel);
      }
    }
  });
}

function showAllSkills() {
  // Show all hidden skills by default
  const hiddenSkills = document.querySelector('.hidden-skills');
  if (hiddenSkills) {
    hiddenSkills.classList.add('visible');
    
    // Hide the "View All Skills" button since all skills are now visible by default
    const viewAllButton = document.getElementById('view-all-skills');
    if (viewAllButton) {
      viewAllButton.style.display = 'none';
    }
  }
}