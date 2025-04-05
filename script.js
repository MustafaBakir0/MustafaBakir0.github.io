// script.js
// Dynamic text animation
const dynamicText = document.querySelector('.dynamic-text');
const words = ["Multimedia Artist", "Creative Coder", "Digital Storyteller"];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
    const currentWord = words[wordIndex];
    const h1 = document.querySelector('.main-title');
    
    if (!isDeleting) {
        if(charIndex === 0) h1.classList.add('shift-up');
        dynamicText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        
        if(charIndex < currentWord.length) {
            setTimeout(typeEffect, 100);
        } else {
            setTimeout(() => {
                isDeleting = true;
                typeEffect();
            }, 2000);
        }
    } else {
        dynamicText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        
        if(charIndex > 0) {
            setTimeout(typeEffect, 50);
        } else {
            h1.classList.remove('shift-up');
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 1000);
        }
    }
}

typeEffect();

// Add to script.js
document.querySelectorAll('.project-header').forEach(header => {
    header.addEventListener('click', () => {
        const projectBody = header.nextElementSibling;
        const toggleIcon = header.querySelector('.toggle-icon');
        
        header.classList.toggle('active');
        projectBody.classList.toggle('active');
        
        if (projectBody.classList.contains('active')) {
            toggleIcon.textContent = '-';
        } else {
            toggleIcon.textContent = '+';
        }
    });
});


// Add this to your script.js file

// Project Modal Functionality
document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', () => {
        const projectId = item.getAttribute('data-project');
        const modal = document.getElementById(`${projectId}-modal`);
        modal.classList.add('active');
        
        // Initialize p5 sketch if this is the Webster project (project3)
        if (projectId === 'project3') {
            setTimeout(initWebsterSketch, 100); // Short delay to ensure DOM is ready
        }
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    });
});

document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = closeBtn.closest('.project-modal');
        modal.classList.remove('active');
        
        // Re-enable body scrolling
        document.body.style.overflow = 'auto';
    });
});

// Close modal if clicked outside content
document.querySelectorAll('.project-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Prevent modal content clicks from closing modal
document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});


// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    setTimeout(() => {
        alert('Thank you for your message! I will respond shortly.');
        this.reset();
    }, 1000);
});