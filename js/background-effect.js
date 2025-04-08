document.addEventListener('DOMContentLoaded', function() {
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

    const backgroundSketch = new p5((p) => {
        let particles = [];
        const particleCount = 450;
        let connectionThreshold = 50;
        let noiseScale = 0.005; // Reduced from 0.01 for slower movement
        let noiseStrength = 0.3; // Reduced from 0.8 for gentler movement
        let timeOffset = 0;
        let mouseRepelForce = 10; // Reduced from 5 for more subtle repulsion
        let mouseRepelRadius = 100;
        
        p.setup = function() {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.parent('background-animation');
            
            for (let i = 0; i < particleCount; i++) {
                createParticle();
            }
        };
        
        function createParticle(x = null, y = null, vy = 0) {
            particles.push({
                x: x || p.random(p.width),
                y: y || p.random(p.height),
                vx: 0,
                vy: vy,
                size: p.random(4, 10),
                color: p.color(0, p.random(150, 255), p.random(100, 200), 120)
            });
        }
        
        p.draw = function() {
            p.clear();
            timeOffset += 0.001; // Reduced from 0.003 for slower time progression
            
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                
                // Mouse repulsion
                let d = p.dist(particle.x, particle.y, p.mouseX, p.mouseY);
                if (d < mouseRepelRadius) {
                    let force = (mouseRepelRadius - d) / mouseRepelRadius;
                    let angle = p.atan2(particle.y - p.mouseY, particle.x - p.mouseX);
                    particle.vx += p.cos(angle) * force * mouseRepelForce * 0.1; // Added 0.1 multiplier for gentler effect
                    particle.vy += p.sin(angle) * force * mouseRepelForce * 0.1;
                }
                
                // Update position based on noise
                const angle = p.noise(particle.x * noiseScale, particle.y * noiseScale, timeOffset) * p.TWO_PI * 2;
                particle.vx += p.cos(angle) * noiseStrength * 0.2; // Added 0.2 multiplier for slower movement
                particle.vy += p.sin(angle) * noiseStrength * 0.2;
                
                // Apply velocity
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Dampen velocity more aggressively
                particle.vx *= 0.92;
                particle.vy *= 0.92;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
                
                // Draw connections
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
        
        p.mouseClicked = function() {
            for (let i = 0; i < 5; i++) {
                createParticle(p.mouseX, 0, p.random(0.8, 2)); // Reduced velocity for falling particles
            }
        };
    });
})
