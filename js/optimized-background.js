/**
 * Optimized Background Effect
 * A more performant version of the particle system
 */

// Configuration - easily adjustable
const config = {
  // Particle settings
  particleCount: 20, // Further reduced from 30
  particleMinSize: 1,
  particleMaxSize: 3,
  particleOpacity: 0.5,
  particleColor: '#bea3ff',
  
  // Connection settings
  connectionDistance: 120, // Reduced connection distance for fewer calculations
  connectionOpacity: 0.12,
  
  // Motion settings
  motionSpeed: 0.2, // Slower motion for smoother appearance
  
  // Performance settings
  mobileParticleCount: 10, // Further reduced for mobile
  skipFrames: 3, // Skip more frames for connections
  disableOnMobile: true, // Option to disable effects on mobile
  pauseWhenNotVisible: true, // Pause animation when not in viewport
  
  // Determine if device is mobile
  isMobile: function() {
    return window.innerWidth < 768 || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0);
  }
};

class OptimizedBackgroundEffect {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.width = 0;
    this.height = 0;
    this.frameCount = 0;
    this.isRunning = true;
    this.resizeTimeout = null;
    this.initialized = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
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
    this.canvas.className = 'background-canvas';
    this.ctx = this.canvas.getContext('2d');
    
    // Apply styles
    Object.assign(this.canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '-1'
    });
    
    // Append to body
    document.body.appendChild(this.canvas);
    
    // Set canvas dimensions
    this.resize();
    
    // Create particles
    this.createParticles();
    
    // Start animation loop
    this.animate();
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('visibilitychange', this.checkVisibility);
    
    // Add observer to pause when out of viewport if configured
    if (config.pauseWhenNotVisible) {
      this.setupVisibilityObserver();
    }
    
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
    const count = config.isMobile() && config.disableOnMobile ? 
                 config.mobileParticleCount : 
                 config.particleCount;
    
    this.particles = [];
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * (config.particleMaxSize - config.particleMinSize) + config.particleMinSize,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.5 + 0.2,
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
    
    this.particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(190, 163, 255, ${particle.opacity})`;
      ctx.fill();
    });
  }
  
  drawConnections() {
    const ctx = this.ctx;
    const particles = this.particles;
    const len = particles.length;
    
    // Only draw connections every few frames to improve performance
    if (this.frameCount % config.skipFrames !== 0) return;
    
    ctx.beginPath();
    ctx.strokeStyle = `rgba(190, 163, 255, ${config.connectionOpacity})`;
    ctx.lineWidth = 0.5;
    
    // More efficient connection drawing - avoid nested loops where possible
    for (let i = 0; i < len; i++) {
      const p1 = particles[i];
      
      // Only check connections with particles we haven't compared yet
      for (let j = i + 1; j < len; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < config.connectionDistance) {
          // Draw connection with opacity based on distance
          const opacity = 1 - (dist / config.connectionDistance);
          ctx.globalAlpha = opacity * config.connectionOpacity;
          
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    
    ctx.globalAlpha = 1; // Reset alpha
    ctx.stroke();
  }
  
  updateParticles() {
    const width = this.width;
    const height = this.height;
    
    this.particles.forEach(p => {
      // Update position
      p.x += p.vx * config.motionSpeed;
      p.y += p.vy * config.motionSpeed;
      
      // Boundary checking - wrap around edges
      if (p.x > width + 10) p.x = -10;
      else if (p.x < -10) p.x = width + 10;
      
      if (p.y > height + 10) p.y = -10;
      else if (p.y < -10) p.y = height + 10;
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
    
    // Clean up observer if it exists
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Create and export the background effect
const backgroundEffect = new OptimizedBackgroundEffect();

// Global control function
window.toggleBackgroundEffect = function(enable) {
  if (enable === undefined) {
    backgroundEffect.isRunning = !backgroundEffect.isRunning;
  } else {
    backgroundEffect.isRunning = enable;
  }
  
  if (backgroundEffect.isRunning && !backgroundEffect.animationRequest) {
    backgroundEffect.animate();
  }
};