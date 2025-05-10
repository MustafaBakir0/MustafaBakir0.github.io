/**
 * Simple and Efficient Typewriter Effect
 * Focused on core functionality and performance
 */

class Typewriter {
  constructor(element, phrases = [], options = {}) {
    // Core elements
    this.element = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;
    
    // Validation
    if (!this.element) {
      console.error('Typewriter: Target element not found');
      return;
    }
    
    // Phrases to display
    this.phrases = phrases;
    
    // Default configuration
    this.config = {
      typeSpeed: 80,            // Base typing speed (ms)
      deleteSpeed: 50,          // Base deletion speed (ms)
      delayAfterPhrase: 2000,   // Pause after completing a phrase (ms)
      delayBeforeTyping: 700,   // Pause before starting a new phrase (ms)
      loop: true,               // Whether to loop through phrases
      titleElement: null,       // Element to apply shift effect to
      cursorChar: '|',          // Cursor character
      cursorBlink: true         // Whether cursor should blink
    };
    
    // Merge options with defaults
    Object.assign(this.config, options);
    
    // Internal state
    this.currentIndex = 0;      // Current phrase index
    this.text = '';             // Current displayed text
    this.isDeleting = false;    // Whether we're deleting or typing
    this.isWaiting = false;     // Whether we're in a delay period
    this.timeout = null;        // Current setTimeout reference
    
    // Initialize
    this.init();
  }
  
  init() {
    // Create cursor element if needed
    if (this.config.cursorChar) {
      this.cursor = document.createElement('span');
      this.cursor.className = 'typewriter-cursor';
      this.cursor.textContent = this.config.cursorChar;
      this.cursor.style.display = 'inline-block';
      this.cursor.style.color = 'var(--accent-color, rgba(190, 147, 255, 0.9))';
      this.cursor.style.marginLeft = '0.1em';
      
      // Add blink animation if enabled
      if (this.config.cursorBlink) {
        this.cursor.style.animation = 'cursor-blink 1s infinite step-end';
        
        // Add keyframe animation if not already in document
        if (!document.getElementById('typewriter-styles')) {
          const style = document.createElement('style');
          style.id = 'typewriter-styles';
          style.textContent = `
            @keyframes cursor-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }
      }
      
      // Add cursor after the element
      this.element.parentNode.insertBefore(this.cursor, this.element.nextSibling);
    }
    
    // Start typing with a small delay
    setTimeout(() => this.tick(), 500);
  }
  
  tick() {
    // Clear any existing timeout
    if (this.timeout) clearTimeout(this.timeout);
    
    // Get current phrase
    const currentPhrase = this.phrases[this.currentIndex];
    
    // Nothing to type
    if (!currentPhrase) return;
    
    // Apply title shift effect if configured
    if (this.config.titleElement) {
      if (this.text.length === 0 && !this.isDeleting) {
        this.config.titleElement.classList.add('shift-up');
      } else if (this.text.length === 0 && this.isDeleting) {
        this.config.titleElement.classList.remove('shift-up');
      }
    }
    
    // Update text based on current state
    if (!this.isDeleting) {
      // Typing forward
      this.text = currentPhrase.substring(0, this.text.length + 1);
      this.element.textContent = this.text;
      
      // Check if finished typing current phrase
      if (this.text === currentPhrase) {
        // Start deletion after delay
        this.isWaiting = true;
        this.timeout = setTimeout(() => {
          this.isWaiting = false;
          this.isDeleting = true;
          this.tick();
        }, this.config.delayAfterPhrase);
        return;
      }
    } else {
      // Deleting
      this.text = currentPhrase.substring(0, this.text.length - 1);
      this.element.textContent = this.text;
      
      // Check if finished deleting
      if (this.text === '') {
        this.isDeleting = false;
        
        // Move to next phrase
        if (this.config.loop) {
          this.currentIndex = (this.currentIndex + 1) % this.phrases.length;
        } else {
          this.currentIndex = Math.min(this.currentIndex + 1, this.phrases.length - 1);
        }
        
        // Wait before typing next phrase
        this.isWaiting = true;
        this.timeout = setTimeout(() => {
          this.isWaiting = false;
          this.tick();
        }, this.config.delayBeforeTyping);
        return;
      }
    }
    
    // Calculate typing speed with slight randomness for natural feel
    const randomVariation = Math.random() * 0.5 + 0.5; // 0.5 to 1.5 multiplier
    const speed = this.isDeleting 
      ? this.config.deleteSpeed * randomVariation
      : this.config.typeSpeed * randomVariation;
    
    // Continue typing
    this.timeout = setTimeout(() => this.tick(), speed);
  }
  
  // Public methods
  
  // Stop the typewriter
  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.isWaiting = true;
  }
  
  // Resume typing
  start() {
    if (this.isWaiting) {
      this.isWaiting = false;
      this.tick();
    }
  }
  
  // Update phrases
  setPhrases(newPhrases) {
    this.phrases = newPhrases;
    this.currentIndex = 0;
    this.text = '';
    this.isDeleting = false;
    this.element.textContent = '';
    this.tick();
  }
}

// Initialize typewriter when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const typewriterElement = document.querySelector('.dynamic-text');
  const titleElement = document.querySelector('.main-title');
  
  if (typewriterElement) {
    const phrases = [
      "Creative Coder",
      "Multimedia Artist",
      "Digital Storyteller"
    ];
    
    new Typewriter(typewriterElement, phrases, {
      typeSpeed: 80,
      deleteSpeed: 50, 
      delayAfterPhrase: 2000,
      delayBeforeTyping: 700,
      titleElement: titleElement
    });
  }
});