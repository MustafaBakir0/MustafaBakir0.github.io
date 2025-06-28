// Scroll animations and smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    initializeParallaxEffects();
});

const initializeScrollAnimations = () => {
    // Stagger animations for project cards
    const projectCards = document.querySelectorAll('.project-card');
    const skillsCards = document.querySelectorAll('.skill-category-card');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.stagger-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 150);
                });
            }
        });
    }, { threshold: 0.1 });
    
    // Observe containers
    const projectsGrid = document.querySelector('.projects-grid');
    const skillsGrid = document.querySelector('.skills-grid');
    const timeline = document.querySelector('.timeline');
    
    if (projectsGrid) staggerObserver.observe(projectsGrid);
    if (skillsGrid) staggerObserver.observe(skillsGrid);
    if (timeline) staggerObserver.observe(timeline);
    
    // Timeline specific animations
    if (timeline) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.timeline-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.1 });
        
        timelineObserver.observe(timeline);
    }
};

const initializeParallaxEffects = () => {
    const heroSection = document.querySelector('#home');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
};

// Smooth scroll to sections
const smoothScrollTo = (targetId, offset = 80) => {
    const target = document.querySelector(targetId);
    if (target) {
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
};

// Scroll progress indicator
const initializeScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--color-accent);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
};

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', initializeScrollProgress); 