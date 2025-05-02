// resonance-background.js - Dreamy, ambient particle animation

document.addEventListener('DOMContentLoaded', function() {
    // Create or ensure the background container exists
    let backgroundContainer = document.getElementById('background-animation');
    
    if (!backgroundContainer) {
        backgroundContainer = document.createElement('div');
        backgroundContainer.id = 'background-animation';
        backgroundContainer.style.position = 'fixed';
        backgroundContainer.style.top = '0';
        backgroundContainer.style.left = '0';
        backgroundContainer.style.width = '100%';
        backgroundContainer.style.height = '100%';
        backgroundContainer.style.zIndex = '-1';
        backgroundContainer.style.pointerEvents = 'none';
        document.body.prepend(backgroundContainer);
    }

    // P5.js sketch for the dreamy background
    const backgroundSketch = new p5((p) => {
        // particle and system settings
        let particles = [];
        const particleCount = 120; // fewer particles for a more subtle effect
        let connectionThreshold = 100; // increased for more prominent connections
        let noiseScale = 0.0015; // slower movement for dreamy effect
        let noiseStrength = 0.2; // gentler movement
        let timeOffset = 0;
        let mouseInfluenceRadius = 180;
        let mouseInfluenceStrength = 0.08;
        let lastMouseMoveTime = 0;
        let mouseMovementFade = 0;
        
        // cursor trail effect
        let cursorTrail = [];
        const maxTrailLength = 30; // longer trail for dreamy effect
        
        p.setup = function() {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.parent('background-animation');
            
            // initialize particles with dreamy colors
            initializeParticles();
            
            // set the blend mode for a more ethereal look
            p.blendMode(p.SCREEN);
        };
        
        function initializeParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                createParticle();
            }
        }
        
        function createParticle(x = null, y = null, vy = 0) {
            // dreamy color palette - purples, blues and soft pinks
            const colorChoices = [
                [70, 40, 120, 60],  // soft purple
                [50, 60, 150, 50],  // deep blue
                [120, 70, 180, 40], // lavender
                [90, 40, 100, 50],  // dusty purple
                [60, 20, 90, 60]    // deep violet
            ];
            
            const colorChoice = colorChoices[Math.floor(p.random(colorChoices.length))];
            
            particles.push({
                x: x || p.random(p.width),
                y: y || p.random(p.height),
                vx: 0,
                vy: vy || p.random(-0.1, 0.1),
                size: p.random(2, 8),
                baseSize: p.random(2, 8), // to store original size
                opacity: p.random(40, 80),
                lifespan: p.random(200, 500),
                age: 0,
                color: p.color(colorChoice[0], colorChoice[1], colorChoice[2], colorChoice[3]),
                noiseOffsetX: p.random(1000), // individual noise offset for organic movement
                noiseOffsetY: p.random(1000),
                pulseSpeed: p.random(0.01, 0.03), // how fast the particle pulses
                pulseAmount: p.random(0.4, 0.8)  // how much the particle pulses
            });
        }
        
        p.draw = function() {
            p.clear();
            timeOffset += 0.0005; // very slow time progression
            
            // fade the mouse movement influence
            if (p.millis() - lastMouseMoveTime > 100) {
                mouseMovementFade = p.max(0, mouseMovementFade - 0.01);
            }
            
            // occasionally create new particles
            if (p.frameCount % 30 === 0 && particles.length < particleCount) {
                createParticle();
            }
            
            // update and draw connections first (render behind particles)
            drawConnections();
            
            // update and draw particles
            updateParticles();
            
            // draw cursor trail
            drawCursorTrail();
        };
        
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                
                // calculate fade based on particle age
                let fadeRatio = calculateFadeRatio(particle);
                
                for (let j = i + 1; j < particles.length; j++) {
                    const other = particles[j];
                    const d = p.dist(particle.x, particle.y, other.x, other.y);
                    
                    if (d < connectionThreshold) {
                        // more ethereal connections with pulsing
                        let alpha = p.map(d, 0, connectionThreshold, 20, 0);
                        let otherFade = calculateFadeRatio(other);
                        let connectionStrength = fadeRatio * otherFade * alpha;
                        
                        // extract color components
                        const r = p.red(particle.color);
                        const g = p.green(particle.color);
                        const b = p.blue(particle.color);
                        
                        // draw connection with a subtle glow
                        p.stroke(r, g, b, connectionStrength);
                        p.strokeWeight(0.3);
                        p.line(particle.x, particle.y, other.x, other.y);
                    }
                }
            }
        }
        
        function updateParticles() {
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                
                // increase age
                particle.age++;
                
                // calculate fade based on age
                let fadeRatio = calculateFadeRatio(particle);
                
                // remove particles that have completed their lifespan
                if (particle.age >= particle.lifespan) {
                    particles.splice(i, 1);
                    continue;
                }
                
                // mouse influence - gentler for dreamy effect
                applyMouseInfluence(particle);
                
                // update position with perlin noise for organic movement
                updateParticlePosition(particle);
                
                // apply a pulsing effect to particle size
                const pulse = Math.sin(p.frameCount * particle.pulseSpeed) * particle.pulseAmount;
                const currentSize = particle.baseSize + pulse;
                
                // draw particle with ethereal glow
                drawParticle(particle, fadeRatio, currentSize);
            }
        }
        
        function calculateFadeRatio(particle) {
            let fadeRatio;
            const fadeTime = 60;
            
            if (particle.age < fadeTime) {
                // fade in
                fadeRatio = particle.age / fadeTime;
            } else if (particle.age > particle.lifespan - fadeTime) {
                // fade out
                fadeRatio = (particle.lifespan - particle.age) / fadeTime;
            } else {
                // stable
                fadeRatio = 1;
            }
            
            return fadeRatio;
        }
        
        function applyMouseInfluence(particle) {
            const d = p.dist(particle.x, particle.y, p.mouseX, p.mouseY);
            if (d < mouseInfluenceRadius) {
                // softer mouse influence
                const force = (mouseInfluenceRadius - d) / mouseInfluenceRadius;
                const angle = p.atan2(particle.y - p.mouseY, particle.x - p.mouseX);
                const strength = force * mouseInfluenceStrength * (1 + mouseMovementFade * 2);
                
                particle.vx += p.cos(angle) * strength;
                particle.vy += p.sin(angle) * strength;
            }
        }
        
        function updateParticlePosition(particle) {
            // use perlin noise for more organic movement
            const noiseX = p.noise(
                particle.noiseOffsetX + timeOffset,
                particle.y * noiseScale
            ) * 2 - 1;
            
            const noiseY = p.noise(
                particle.x * noiseScale,
                particle.noiseOffsetY + timeOffset
            ) * 2 - 1;
            
            // apply noise influence
            particle.vx += noiseX * noiseStrength;
            particle.vy += noiseY * noiseStrength;
            
            // apply slow upward drift for dreamy effect
            particle.vy -= 0.002;
            
            // update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // dampen velocity
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            
            // wrap around edges with a soft transition
            if (particle.x < -50) particle.x = p.width + 50;
            if (particle.x > p.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = p.height + 50;
            if (particle.y > p.height + 50) particle.y = -50;
        }
        
        function drawParticle(particle, fadeRatio, currentSize) {
            // create ethereal glow effect with multiple layers
            const r = p.red(particle.color);
            const g = p.green(particle.color);
            const b = p.blue(particle.color);
            const a = p.alpha(particle.color) * fadeRatio;
            
            p.noStroke();
            
            // outer glow
            p.fill(r, g, b, a * 0.1);
            p.ellipse(particle.x, particle.y, currentSize * 3);
            
            // middle glow
            p.fill(r, g, b, a * 0.3);
            p.ellipse(particle.x, particle.y, currentSize * 2);
            
            // inner core
            p.fill(r, g, b, a);
            p.ellipse(particle.x, particle.y, currentSize);
        }
        
        function drawCursorTrail() {
            // update cursor trail
            if (p.mouseIsPressed || mouseMovementFade > 0.1) {
                cursorTrail.push({
                    x: p.mouseX,
                    y: p.mouseY,
                    age: 0,
                    maxAge: 40
                });
                
                // limit trail length
                if (cursorTrail.length > maxTrailLength) {
                    cursorTrail.shift();
                }
            }
            
            // draw and update trail
            p.noFill();
            for (let i = cursorTrail.length - 1; i >= 0; i--) {
                const point = cursorTrail[i];
                point.age++;
                
                if (point.age > point.maxAge) {
                    cursorTrail.splice(i, 1);
                    continue;
                }
                
                // calculate fade
                const fadeFactor = 1 - point.age / point.maxAge;
                
                // draw trail point
                p.noStroke();
                p.fill(190, 147, 255, 50 * fadeFactor);
                p.ellipse(point.x, point.y, 5 * fadeFactor);
                
                // connect points
                if (i > 0) {
                    const prevPoint = cursorTrail[i - 1];
                    p.stroke(190, 147, 255, 30 * fadeFactor);
                    p.strokeWeight(1 * fadeFactor);
                    p.line(point.x, point.y, prevPoint.x, prevPoint.y);
                }
            }
        }
        
        // Mouse events for interactivity
        p.mouseMoved = function() {
            lastMouseMoveTime = p.millis();
            mouseMovementFade = 1;
            
            // create subtle particle burst on fast mouse movements
            if (p.frameCount % 5 === 0) {
                createParticle(p.mouseX, p.mouseY, p.random(-0.2, 0.2));
            }
        };
        
        p.mousePressed = function() {
            // create a burst of particles
            for (let i = 0; i < 5; i++) {
                const angle = p.random(p.TWO_PI);
                const distance = p.random(5, 15);
                createParticle(
                    p.mouseX + p.cos(angle) * distance, 
                    p.mouseY + p.sin(angle) * distance, 
                    p.random(-0.3, 0.3)
                );
            }
        };
        
        p.windowResized = function() {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
        };
    });
});