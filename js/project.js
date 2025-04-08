document.addEventListener('DOMContentLoaded', function() {
    // Background container setup
    const backgroundContainer = document.createElement('div');
    backgroundContainer.id = 'background-animation';
    backgroundContainer.style.position = 'fixed';
    backgroundContainer.style.top = '0';
    backgroundContainer.style.left = '0';
    backgroundContainer.style.width = '100%';
    backgroundContainer.style.height = '100%';
    backgroundContainer.style.zIndex = '-1';
    backgroundContainer.style.pointerEvents = 'none';
    document.body.prepend(backgroundContainer);

    // P5.js Animation Configuration
    const backgroundSketch = new p5((p) => {
        let particles = [];
        const particleCount = 300;
        let connectionThreshold = 50;
        let noiseScale = 0.01;
        let noiseStrength = 0.8;
        let timeOffset = 0;
        
        p.setup = function() {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.parent('background-animation');
            
            // Initialize particles
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: 0,
                    vy: 0,
                    size: p.random(4, 10),
                    color: p.color(0, p.random(150, 255), p.random(100, 200), 120)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            timeOffset += 0.003;
            
            // Update and display particles
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                
                // Update position based on noise
                const angle = p.noise(particle.x * noiseScale, particle.y * noiseScale, timeOffset) * p.TWO_PI * 2;
                particle.vx = p.cos(angle) * noiseStrength;
                particle.vy = p.sin(angle) * noiseStrength;
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
                
                // Draw connections between particles
                for (let j = i + 1; j < particles.length; j++) {
                    const other = particles[j];
                    const d = p.dist(particle.x, particle.y, other.x, other.y);
                    if (d < connectionThreshold) {
                        const alpha = p.map(d, 0, connectionThreshold, 80, 0);
                        p.stroke(0, 255, 136, alpha);
                        p.strokeWeight(0.5);
                        p.line(particle.x, particle.y, other.x, other.y);
                    }
                }
                
                // Draw particle
                p.noStroke();
                p.fill(particle.color);
                p.ellipse(particle.x, particle.y, particle.size);
            }
        };
        
        p.windowResized = function() {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
        };
        
        p.mouseMoved = function() {
            // Mouse interaction
            let closest = null;
            let closestDist = Infinity;
            
            for (const particle of particles) {
                const d = p.dist(p.mouseX, p.mouseY, particle.x, particle.y);
                if (d < closestDist && d < 100) {
                    closest = particle;
                    closestDist = d;
                }
            }
            
            if (closest) {
                const angle = p.atan2(closest.y - p.mouseY, closest.x - p.mouseX);
                closest.vx += p.cos(angle) * 1.5;
                closest.vy += p.sin(angle) * 1.5;
            }
        };
    });

    // Scroll event listener
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero .content');
        const mainTitle = document.querySelector('.main-title');
        const typewriterText = document.querySelector('.typewriter');
        const contentOverlay = document.getElementById('content-overlay');
        const viewportHeight = window.innerHeight;
        
        // Enhanced hero content animation with faster fade
        if (scrollY < viewportHeight) {
            const opacity = Math.max(1 - scrollY / (viewportHeight / 3), 0);
            const translateY = scrollY * 0.5;
            
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translateY(${translateY}px)`;
            
            if (mainTitle) {
                mainTitle.style.opacity = Math.max(1 - scrollY / (viewportHeight / 4), 0);
                mainTitle.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
            
            if (typewriterText) {
                typewriterText.style.opacity = Math.max(1 - scrollY / (viewportHeight / 3.5), 0);
                typewriterText.style.transform = `translateY(${scrollY * 0.4}px)`;
            }
        }
        
        // Content overlay
        contentOverlay.style.opacity = scrollY > viewportHeight ? 1 : 0;
        
        // Section visibility on scroll
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < viewportHeight * 0.75) {
                section.style.opacity = 1;
            }
        });
    });

    // Initialize sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.transition = 'opacity 0.5s ease';
        section.style.opacity = 0;
    });

    // Force initial scroll event
    window.dispatchEvent(new Event('scroll'));
});
