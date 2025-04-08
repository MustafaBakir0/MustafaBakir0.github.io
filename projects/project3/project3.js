// project3.js - Webster Project sketch

let particles = [];
const particleCount = 100;
let connectionThreshold = 100;
let noiseScale = 0.01;
let noiseStrength = 1;
let timeOffset = 0;

// Create a new p5 instance for the Webster sketch
const websterSketch = new p5((p) => {
    p.setup = function() {
        const container = document.getElementById('webster-sketch-container');
        const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        canvas.parent('webster-sketch-container');
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                vx: 0,
                vy: 0,
                size: p.random(2, 5),
                color: p.color(0, p.random(150, 255), p.random(100, 200), 200)
            });
        }
    };
    
    p.draw = function() {
        p.background(10, 10, 10, 20);
        timeOffset += 0.005;
        
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
                    const alpha = p.map(d, 0, connectionThreshold, 200, 0);
                    p.stroke(0, 255, 136, alpha);
                    p.line(particle.x, particle.y, other.x, other.y);
                }
            }
            
            // Draw particle
            p.noStroke();
            p.fill(particle.color);
            p.ellipse(particle.x, particle.y, particle.size);
        }
    };
    
    // Resize canvas when window is resized
    p.windowResized = function() {
        const container = document.getElementById('webster-sketch-container');
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
    
    // Add mouse interaction
    p.mouseMoved = function() {
        // Find closest particle and push it away from mouse
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
            closest.vx += p.cos(angle) * 2;
            closest.vy += p.sin(angle) * 2;
        }
    };
});
