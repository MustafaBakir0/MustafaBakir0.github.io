// main.js - Combined from your script.js

// Dynamic text animation
const dynamicText = document.querySelector('.typewriter');
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
};

// Start the typing effect when the page loads
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 500);
    
    // Initialize sections with opacity 0 by default for smooth fade-in
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.transition = 'opacity 0.5s ease';
        section.style.opacity = 0;
    });
    
    // Force a scroll event to check initial visibility
    window.dispatchEvent(new Event('scroll'));
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
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        setTimeout(() => {
            alert('Thank you for your message! I will respond shortly.');
            this.reset();
        }, 1000);
    });
}

// Parallax effect for hero content with immediate background visibility
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero .content');
    const mainTitle = document.querySelector('.main-title');
    const typewriterText = document.querySelector('.typewriter');
    const contentOverlay = document.getElementById('content-overlay');
    const viewportHeight = window.innerHeight;

    // Enhanced hero content animation with faster fade
    if (scrollY < viewportHeight) {
        // Calculate opacity based on scroll position - fade out faster
        const opacity = Math.max(1 - scrollY / (viewportHeight / 3), 0);
        const translateY = scrollY * 0.5; // Increased movement effect
        
        // Apply to hero content container
        heroContent.style.opacity = opacity;
        heroContent.style.transform = `translateY(${translateY}px)`;
        
        // Apply separate effects to title and typewriter for more dynamic feel
        if (mainTitle) {
            mainTitle.style.opacity = Math.max(1 - scrollY / (viewportHeight / 4), 0);
            mainTitle.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        
        if (typewriterText) {
            typewriterText.style.opacity = Math.max(1 - scrollY / (viewportHeight / 3.5), 0);
            typewriterText.style.transform = `translateY(${scrollY * 0.4}px)`;
        }
    }

    // Content overlay - immediately visible when scrolling past hero
    if (scrollY > viewportHeight) {
        contentOverlay.style.opacity = 1; // Full opacity immediately
    } else {
        contentOverlay.style.opacity = 0;
    }

    // Ensure content is visible
    const contentContainer = document.querySelector('.content-container');
    contentContainer.style.opacity = 1; // Always keep content visible
    
    // Add visible class to sections based on scroll position
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < viewportHeight * 0.75) {
            section.style.opacity = 1;
        }
    });
});

// Skill Tooltips
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', (e) => {
        const skillName = item.getAttribute('data-skill');
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = `${skillName} - ${item.querySelector('.skill-progress').style.width}`;
        
        const rect = item.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.top - 30}px`;
        tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.zIndex = '1000';
        
        document.body.appendChild(tooltip);
        
        item.addEventListener('mouseleave', () => {
            tooltip.remove();
        });
    });
});

window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const heroText = document.querySelector('.hero-content');
    const viewportHeight = window.innerHeight;

    if (heroText) {
        // Calculate opacity based on scroll position
        const opacity = Math.max(1 - scrollY / (viewportHeight / 2), 0);
        heroText.style.opacity = opacity;
    }
});
