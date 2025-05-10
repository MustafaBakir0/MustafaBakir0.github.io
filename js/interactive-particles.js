/**
 * Interactive Particle System
 * Features:
 * - Particles float around
 * - Particles escape from mouse cursor
 * - Click spawns new particles
 * - Spawned particles fade out after a lifetime
 */

class InteractiveParticleSystem {
  constructor() {
    // Configuration
    this.config = {
      // Base particles
      baseParticleCount: 35,
      
      // Particle settings
      particleMinSize: 1,
      particleMaxSize: 4,
      particleOpacity: 0.7,
      
      // Colors (dreamy purple theme)
      particleColors: [
        '#bea3ff', // Main purple
        '#a28dff', // Lighter purple
        '#9f87ed', // Medium purple
        '#c9b3ff', // Pale purple
        '#8678db'  // Darker purple
      ],
      
      // Connections between particles
      drawConnections: true,
      connectionDistance: 140,
      connectionOpacity: 0.15,
      
      // Mouse interaction
      mouseRepelRadius: 120,
      mouseRepelStrength: 0.12,
      
      // Click spawning
      spawnOnClick: true,
      spawnCount: 8,
      spawnLifetime: 5000, // milliseconds
      
      // Motion settings
      baseSpeed: 0.7,
      
      // Performance settings
      mobileParticleCount: 20,
      skipFramesForConnections: 2,
      
      // Mobile detection
      isMobile: function() {
        return window.innerWidth < 768 || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
      }
    };
    
    // State
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.width = 0;
    this.height = 0;
    this.mouseX = null;
    this.mouseY = null;
    this.lastClick = null;
    this.frameCount = 0;
    this.isRunning = true;
    this.initialized = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.createParticles = this.createParticles.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.animate = this.animate.bind(this);
    
    // Initialize
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.init);
    } else {
      this.init();
    }
  }
  
  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'interactive-particles-canvas';
    this.ctx = this.canvas.getContext('2d');
    
    // Style the canvas
    Object.assign(this.canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '1',
      opacity: '0',
      transition: 'opacity 1.5s ease'
    });
    
    // Add to DOM
    const container = document.createElement('div');
    container.className = 'interactive-particles';
    container.appendChild(this.canvas);
    document.body.appendChild(container);
    
    // Set dimensions
    this.resize();
    
    // Create initial particles
    this.createParticles();
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseleave', this.handleMouseLeave);
    
    // Enable click interaction if configured
    if (this.config.spawnOnClick) {
      document.addEventListener('click', this.handleClick);
      
      // Make canvas receive pointer events for clicks but only over the hero section
      const hero = document.querySelector('.hero');
      if (hero) {
        this.canvas.style.pointerEvents = 'auto';
        container.style.zIndex = '1';
        container.style.pointerEvents = 'none';
        
        // Only the hero area should detect clicks
        hero.style.position = 'relative';
        hero.style.zIndex = '2';
        hero.style.pointerEvents = 'auto';
      }
    }
    
    // Start animation
    this.animate();
    
    // Fade in
    setTimeout(() => {
      this.canvas.style.opacity = '1';
    }, 300);
    
    this.initialized = true;
  }
  
  createParticles(count, isTemporary = false, x = null, y = null) {
    // Determine base count
    const baseCount = this.config.isMobile() ? 
                     this.config.mobileParticleCount : 
                     this.config.baseParticleCount;
    
    // Use provided count or default
    const particleCount = count || baseCount;
    
    // Array to hold new particles
    const newParticles = [];
    
    // Current time for temporary particles
    const now = Date.now();
    
    for (let i = 0; i < particleCount; i++) {
      // Random size with bias toward smaller particles
      const size = Math.pow(Math.random(), 2) * (this.config.particleMaxSize - this.config.particleMinSize) + this.config.particleMinSize;
      
      // Select random color from palette
      const color = this.config.particleColors[Math.floor(Math.random() * this.config.particleColors.length)];
      
      // Create particle object
      const particle = {
        // Position - either random or around click point
        x: x !== null ? x + (Math.random() - 0.5) * 60 : Math.random() * this.width,
        y: y !== null ? y + (Math.random() - 0.5) * 60 : Math.random() * this.height,
        
        // Size properties
        size: size,
        originalSize: size,
        
        // Velocity - slightly faster for click-spawned particles
        vx: (Math.random() - 0.5) * (isTemporary ? 2 : 1) * this.config.baseSpeed,
        vy: (Math.random() - 0.5) * (isTemporary ? 2 : 1) * this.config.baseSpeed,
        
        // Appearance
        opacity: Math.random() * 0.5 + 0.2,
        color: color,
        
        // Animation properties
        growing: Math.random() > 0.5,
        pulseSpeed: Math.random() * 0.01 + 0.005,
        angleOffset: Math.random() * Math.PI * 2,
        
        // Lifecycle (for temporary particles)
        isTemporary: isTemporary,
        createdAt: isTemporary ? now : null,
        lifetime: isTemporary ? this.config.spawnLifetime * (0.8 + Math.random() * 0.4) : null,
      };
      
      newParticles.push(particle);
    }
    
    // Add new particles to the system
    if (isTemporary) {
      this.particles = [...this.particles, ...newParticles];
    } else {
      this.particles = newParticles;
    }
    
    return newParticles;
  }
  
  resize() {
    // Get dimensions and device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    // Update canvas size
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    // Re-create particles for new dimensions
    if (this.initialized) {
      this.createParticles();
    }
  }
  
  handleResize() {
    // Debounce resize
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.resize();
    }, 200);
  }
  
  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }
  
  handleMouseLeave() {
    this.mouseX = null;
    this.mouseY = null;
  }
  
  handleClick(e) {
    // Only spawn particles in the hero section
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const heroRect = hero.getBoundingClientRect();
    
    // Check if click is inside hero section
    if (
      e.clientX >= heroRect.left && 
      e.clientX <= heroRect.right && 
      e.clientY >= heroRect.top && 
      e.clientY <= heroRect.bottom
    ) {
      // Spawn particles at click location
      this.createParticles(this.config.spawnCount, true, e.clientX, e.clientY);
      
      // Store last click time
      this.lastClick = Date.now();
    }
  }
  
  drawParticles() {
    const ctx = this.ctx;
    const now = Date.now() * 0.001; // Time in seconds for animation
    
    this.particles.forEach(particle => {
      // Calculate fade for temporary particles
      let opacity = particle.opacity;
      if (particle.isTemporary && particle.createdAt) {
        const age = Date.now() - particle.createdAt;
        const lifeFraction = age / particle.lifetime;
        
        // Fade in quickly, fade out more slowly
        if (lifeFraction < 0.2) {
          // Fade in
          opacity = opacity * (lifeFraction / 0.2);
        } else if (lifeFraction > 0.6) {
          // Fade out
          opacity = opacity * (1 - (lifeFraction - 0.6) / 0.4);
        }
      }
      
      // Get pulsing size based on time
      const pulse = Math.sin(now + particle.angleOffset) * 0.5 + 0.5;
      const pulsedSize = particle.originalSize * (1 + pulse * 0.3);
      
      // Create glow effect
      ctx.save();
      ctx.shadowBlur = pulsedSize * 3;
      ctx.shadowColor = particle.color;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, pulsedSize, 0, Math.PI * 2);
      
      // Create gradient fill
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, pulsedSize
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'rgba(190, 163, 255, 0)');
      
      // Apply opacity
      ctx.globalAlpha = opacity;
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Restore context
      ctx.globalAlpha = 1;
      ctx.restore();
    });
  }
  
  drawConnections() {
    // Skip some frames for performance
    if (this.frameCount % this.config.skipFramesForConnections !== 0) return;
    
    const ctx = this.ctx;
    const particles = this.particles;
    const connectionDist = this.config.connectionDistance;
    
    ctx.beginPath();
    ctx.strokeStyle = `rgba(190, 163, 255, ${this.config.connectionOpacity})`;
    ctx.lineWidth = 0.6;
    
    // Draw connections between particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDist) {
          // Opacity based on distance
          const opacity = 1 - (dist / connectionDist);
          ctx.globalAlpha = opacity * this.config.connectionOpacity;
          
          // Draw line
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    
    // Reset opacity
    ctx.globalAlpha = 1;
  }
  
  updateParticles() {
    const now = Date.now();
    const mouseX = this.mouseX;
    const mouseY = this.mouseY;
    const repelRadius = this.config.mouseRepelRadius;
    const repelStrength = this.config.mouseRepelStrength;
    
    // Filter out dead temporary particles
    this.particles = this.particles.filter(p => {
      if (p.isTemporary && p.createdAt) {
        const age = now - p.createdAt;
        return age < p.lifetime;
      }
      return true;
    });
    
    // Update each particle
    this.particles.forEach(p => {
      // Apply mouse repulsion
      if (mouseX !== null && mouseY !== null) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < repelRadius) {
          const force = (1 - dist / repelRadius) * repelStrength;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }
      
      // Apply velocity with damping
      p.vx *= 0.99;
      p.vy *= 0.99;
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Boundary behavior: wrap around edges
      if (p.x > this.width + 20) p.x = -20;
      else if (p.x < -20) p.x = this.width + 20;
      
      if (p.y > this.height + 20) p.y = -20;
      else if (p.y < -20) p.y = this.height + 20;
    });
  }
  
  animate() {
    this.frameCount++;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw
    this.updateParticles();
    this.drawParticles();
    
    if (this.config.drawConnections) {
      this.drawConnections();
    }
    
    // Continue animation
    requestAnimationFrame(this.animate);
  }
  
  // Public method to add particles
  addParticles(count, x, y) {
    return this.createParticles(count, true, x, y);
  }
}

// Initialize particle system
const particleSystem = new InteractiveParticleSystem();