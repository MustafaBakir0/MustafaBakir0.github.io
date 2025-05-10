/**
 * Enhanced Interactive Particles
 * A more interactive and dreamy version of the background particles
 */

class EnhancedParticles {
  constructor() {
    // Configuration
    this.config = {
      // Particle settings
      particleCount: 40, // Enough for good effect but not too heavy
      particleMinSize: 1,
      particleMaxSize: 4,
      particleOpacity: 0.6,
      particleBaseColor: '#bea3ff',
      
      // Connection settings
      connectionDistance: 150,
      connectionOpacity: 0.15,
      
      // Motion settings
      motionSpeed: 0.2,
      mouseInfluenceDistance: 150,
      mouseForce: 0.1,
      
      // Visual settings
      particleGlow: true,
      colorVariation: true,
      
      // Performance settings
      mobileParticleCount: 20,
      skipFrames: 2,
      disableOnMobile: false,
      pauseWhenNotVisible: true,
      
      // Determine if device is mobile
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
    this.frameCount = 0;
    this.isRunning = true;
    this.mouseX = null;
    this.mouseY = null;
    this.resizeTimeout = null;
    this.initialized = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.checkVisibility = this.checkVisibility.bind(this);
    
    // Init on DOM load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.init);
    } else {
      this.init();
    }
  }
  
  init() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'interactive-particles-canvas';
    this.ctx = this.canvas.getContext('2d');
    
    // Apply styles
    Object.assign(this.canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '-1',
      opacity: '0',
      transition: 'opacity 1.5s ease'
    });
    
    // Create container and append canvas
    const container = document.createElement('div');
    container.className = 'interactive-particles';
    container.appendChild(this.canvas);
    document.body.appendChild(container);
    
    // Set canvas dimensions
    this.resize();
    
    // Create particles
    this.createParticles();
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('visibilitychange', this.checkVisibility);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseleave', this.handleMouseLeave);
    
    // Add observer to pause when out of viewport if configured
    if (this.config.pauseWhenNotVisible) {
      this.setupVisibilityObserver();
    }
    
    // Start animation loop
    this.animate();
    
    // Fade in canvas
    setTimeout(() => {
      this.canvas.style.opacity = '1';
    }, 300);
    
    this.initialized = true;
  }
  
  setupVisibilityObserver() {
    // Create an intersection observer to pause animation when canvas is out of view
    this.observer = new IntersectionObserver((entries) => {
      // Update animation state based on visibility
      this.isRunning = entries[0].isIntersecting;
      
      // Restart animation if becoming visible
      if (this.isRunning && !this.animationRequest) {
        this.animate();
      }
    }, {
      root: null, // viewport
      threshold: 0.01 // trigger when just 1% is visible
    });
    
    // Start observing the canvas
    this.observer.observe(this.canvas);
  }
  
  createParticles() {
    const count = this.config.isMobile() && this.config.disableOnMobile ? 
                 this.config.mobileParticleCount : 
                 this.config.particleCount;
    
    this.particles = [];
    
    // Color variations
    const colors = [
      '#bea3ff', // Main purple
      '#a28dff', // Lighter purple
      '#9f87ed', // Medium purple
      '#c9b3ff', // Pale purple
      '#8678db'  // Darker purple
    ];
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * (this.config.particleMaxSize - this.config.particleMinSize) + this.config.particleMinSize;
      
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: size,
        originalSize: size,
        vx: Math.random() * 0.3 - 0.15,
        vy: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.config.colorVariation ? colors[Math.floor(Math.random() * colors.length)] : this.config.particleBaseColor,
        growing: Math.random() > 0.5,
        pulseSpeed: Math.random() * 0.01 + 0.005,
        angleOffset: Math.random() * Math.PI * 2
      });
    }
  }
  
  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    // Set canvas dimensions with devicePixelRatio for retina displays
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    // Reset particles for new dimensions
    if (this.initialized) {
      this.createParticles();
    }
  }
  
  handleResize() {
    // Debounce resize to avoid excessive recalculations
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
  
  checkVisibility() {
    // Pause animation when page is not visible
    if (document.hidden) {
      this.isRunning = false;
    } else {
      this.isRunning = true;
      if (!this.animationRequest) {
        this.animate();
      }
    }
  }
  
  drawParticles() {
    const ctx = this.ctx;
    const now = Date.now() * 0.001; // Time in seconds for animation
    
    this.particles.forEach(particle => {
      // Get pulsing size based on time
      const pulse = Math.sin(now + particle.angleOffset) * 0.5 + 0.5;
      const pulsedSize = particle.originalSize * (1 + pulse * 0.3);
      
      // Save context for glow effect
      if (this.config.particleGlow) {
        ctx.save();
        
        // Create glow effect
        ctx.shadowBlur = pulsedSize * 3;
        ctx.shadowColor = particle.color;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, pulsedSize, 0, Math.PI * 2);
      
      // Fill with gradient for more dreamy effect
      if (this.config.particleGlow) {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, pulsedSize
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(190, 163, 255, 0)');
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = `${particle.color}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      }
      
      ctx.fill();
      
      if (this.config.particleGlow) {
        ctx.restore();
      }
    });
  }
  
  drawConnections() {
    const ctx = this.ctx;
    const particles = this.particles;
    const len = particles.length;
    
    // Only draw connections every few frames to improve performance
    if (this.frameCount % this.config.skipFrames !== 0) return;
    
    ctx.beginPath();
    ctx.strokeStyle = `rgba(190, 163, 255, ${this.config.connectionOpacity})`;
    ctx.lineWidth = 0.6;
    
    // More efficient connection drawing - avoid nested loops where possible
    for (let i = 0; i < len; i++) {
      const p1 = particles[i];
      
      // Only check connections with particles we haven't compared yet
      for (let j = i + 1; j < len; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.config.connectionDistance) {
          // Draw connection with opacity based on distance
          const opacity = 1 - (dist / this.config.connectionDistance);
          ctx.globalAlpha = opacity * this.config.connectionOpacity;
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    
    ctx.globalAlpha = 1; // Reset alpha
  }
  
  updateParticles() {
    const width = this.width;
    const height = this.height;
    const mouseX = this.mouseX;
    const mouseY = this.mouseY;
    const mouseInfluence = this.config.mouseInfluenceDistance;
    const mouseForce = this.config.mouseForce;
    
    this.particles.forEach(p => {
      // Handle mouse influence if mouse is active
      if (mouseX !== null && mouseY !== null) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Apply force inversely proportional to distance
        if (dist < mouseInfluence) {
          const force = 1 - dist / mouseInfluence;
          p.vx += (dx / dist) * force * mouseForce;
          p.vy += (dy / dist) * force * mouseForce;
        }
      }
      
      // Apply velocity with damping
      p.vx *= 0.99;
      p.vy *= 0.99;
      
      // Update position
      p.x += p.vx * this.config.motionSpeed;
      p.y += p.vy * this.config.motionSpeed;
      
      // Boundary checking - wrap around edges with padding
      if (p.x > width + 20) p.x = -20;
      else if (p.x < -20) p.x = width + 20;
      
      if (p.y > height + 20) p.y = -20;
      else if (p.y < -20) p.y = height + 20;
      
      // Gently pulse opacity for dreamy effect
      p.opacity = 0.2 + 0.3 * (Math.sin(Date.now() * 0.001 + p.angleOffset) * 0.5 + 0.5);
    });
  }
  
  animate() {
    if (!this.isRunning) return;
    
    this.frameCount++;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw and update
    this.drawParticles();
    this.drawConnections();
    this.updateParticles();
    
    // Request next frame
    this.animationRequest = requestAnimationFrame(this.animate);
  }
  
  destroy() {
    // Clean up
    this.isRunning = false;
    cancelAnimationFrame(this.animationRequest);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.checkVisibility);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
    
    // Clean up observer if it exists
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    // Remove container
    const container = document.querySelector('.interactive-particles');
    if (container) {
      container.parentNode.removeChild(container);
    }
  }
}

// Create and start the enhanced particles
const enhancedParticles = new EnhancedParticles();