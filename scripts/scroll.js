/**
 * Scroll Animations - Smooth reveal on scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.scroll-reveal, .about-block, .timeline-item, .project-item, .skill-category-card, .section-header'
    );

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth parallax for hero (subtle)
    const hero = document.querySelector('.hero-section');
    let ticking = false;

    if (hero) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    if (scrolled < window.innerHeight) {
                        const heroContent = hero.querySelector('.hero-content');
                        const heroImage = hero.querySelector('.hero-image');

                        if (heroContent) {
                            heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
                            heroContent.style.opacity = 1 - (scrolled * 0.001);
                        }
                        if (heroImage) {
                            heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
});
