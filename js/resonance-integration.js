/**
 * Resonance Theme - Enhanced Visual Elements
 * Creates a living, breathing interface with dreamscape aesthetics
 */

document.addEventListener('DOMContentLoaded', function() {
  // check if mobile device - disable effects if true
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  
  // initialize all visual effects (except on mobile)
  if (!isMobile) {
    initParallaxLayers();
    initAudioFogElements();
    initHaloCursor();
    initFlashingWords();
    initGrainOverlay();
    initKineticTypography();
    initLiquidHoverEffects();
    initMoonPhasesFooter();
  }
  
  // always apply these (even on mobile)
  applyGlassMorphism();
  removeStudiesTab();
});

// remove studies tab from navigation
function removeStudiesTab() {
  const studiesTab = document.querySelector('nav ul li a[href="studies/index.html"]');
  if (studiesTab && studiesTab.parentElement) {
    studiesTab.parentElement.remove();
  }
}

// 1. parallax floating layers
function initParallaxLayers() {
  // create container for floating layers
  const layersContainer = document.createElement('div');
  layersContainer.className = 'parallax-container';
  layersContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
  `;
  document.body.appendChild(layersContainer);
  
  // add css for parallax layers
  const layerStyle = document.createElement('style');
  layerStyle.textContent = `
    .parallax-layer {
      position: absolute;
      pointer-events: none;
      opacity: 0.08;
      filter: blur(10px);
      transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }
  `;
  document.head.appendChild(layerStyle);
  
  // create different shaped layers
  const layerColors = [
    'rgba(108, 99, 255, 0.2)',
    'rgba(190, 147, 255, 0.2)',
    'rgba(147, 190, 255, 0.2)',
    'rgba(230, 200, 255, 0.2)'
  ];
  
  // create 5 random layers
  for (let i = 0; i < 5; i++) {
    createLayer(i, layersContainer, layerColors);
  }
  
  // parallax movement on mouse move
  document.addEventListener('mousemove', e => {
    if (!layersContainer) return;
    
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // apply different movement to each layer
    const layers = document.querySelectorAll('.parallax-layer');
    layers.forEach((layer, index) => {
      const depth = (index + 1) * 10;
      const moveX = (mouseX - 0.5) * depth;
      const moveY = (mouseY - 0.5) * depth;
      layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
  
  // also move on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const layers = document.querySelectorAll('.parallax-layer');
    
    layers.forEach((layer, index) => {
      const speed = (index + 1) * 0.1;
      layer.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

// helper to create random shaped layer
function createLayer(index, container, colors) {
  const layer = document.createElement('div');
  layer.className = 'parallax-layer';
  
  // random shape (blob, circle, gradient)
  const shapeType = Math.floor(Math.random() * 3);
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // random size and position
  const size = 100 + Math.random() * 300;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  
  layer.style.width = `${size}px`;
  layer.style.height = `${size}px`;
  layer.style.left = `${left}%`;
  layer.style.top = `${top}%`;
  layer.style.opacity = 0.05 + Math.random() * 0.1;
  layer.style.filter = `blur(${10 + Math.random() * 20}px)`;
  layer.style.zIndex = -10 - index;
  
  // different shapes based on type
  if (shapeType === 0) {
    // blob shape
    layer.style.borderRadius = `${30 + Math.random() * 40}% ${30 + Math.random() * 40}% ${30 + Math.random() * 40}% ${30 + Math.random() * 40}%`;
    layer.style.backgroundColor = color;
  } else if (shapeType === 1) {
    // circle
    layer.style.borderRadius = '50%';
    layer.style.backgroundColor = color;
  } else {
    // gradient
    const angle = Math.floor(Math.random() * 360);
    layer.style.background = `linear-gradient(${angle}deg, ${color}, transparent)`;
  }
  
  container.appendChild(layer);
}

// 2. floating "audio fog" elements
function initAudioFogElements() {
  // add css for audio fog
  const fogStyle = document.createElement('style');
  fogStyle.textContent = `
    .audio-fog-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
      opacity: 0.6;
    }
    
    .audio-pulse {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(190, 147, 255, 0.05) 0%, rgba(190, 147, 255, 0) 70%);
      animation: pulseExpand 7s ease-out infinite;
      opacity: 0;
    }
    
    .audio-line {
      position: absolute;
      width: 1px;
      background: linear-gradient(to bottom, rgba(190, 147, 255, 0) 0%, rgba(190, 147, 255, 0.05) 50%, rgba(190, 147, 255, 0) 100%);
      animation: lineWiggle 10s ease-in-out infinite;
      transform-origin: center top;
    }
    
    .audio-fog {
      position: absolute;
      background: linear-gradient(to bottom, rgba(190, 147, 255, 0) 0%, rgba(190, 147, 255, 0.02) 50%, rgba(190, 147, 255, 0) 100%);
      animation: fogDrift 15s ease-in-out infinite;
    }
    
    @keyframes pulseExpand {
      0% { transform: scale(0); opacity: 0.4; }
      100% { transform: scale(5); opacity: 0; }
    }
    
    @keyframes lineWiggle {
      0% { transform: scaleY(0.8) translateX(0); }
      50% { transform: scaleY(1.2) translateX(5px); }
      100% { transform: scaleY(0.8) translateX(0); }
    }
    
    @keyframes fogDrift {
      0% { transform: translateX(-5%) translateY(0); opacity: 0.02; }
      50% { transform: translateX(5%) translateY(10px); opacity: 0.05; }
      100% { transform: translateX(-5%) translateY(0); opacity: 0.02; }
    }
  `;
  document.head.appendChild(fogStyle);
  
  // create container
  const fogContainer = document.createElement('div');
  fogContainer.className = 'audio-fog-container';
  document.body.appendChild(fogContainer);
  
  // create pulses (rings)
  for (let i = 0; i < 5; i++) {
    createRandomPulse(fogContainer);
  }
  
  // create vertical lines
  for (let i = 0; i < 8; i++) {
    createAudioLine(fogContainer);
  }
  
  // create fog veils
  for (let i = 0; i < 4; i++) {
    createFogVeil(fogContainer);
  }
  
  // periodically create new elements
  setInterval(() => {
    if (Math.random() > 0.6) {
      createRandomPulse(fogContainer);
    }
  }, 5000);
}

// helper to create audio pulse ring
function createRandomPulse(container) {
  const pulse = document.createElement('div');
  pulse.className = 'audio-pulse';
  
  // random position
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  
  pulse.style.left = `${left}%`;
  pulse.style.top = `${top}%`;
  pulse.style.width = '10px';
  pulse.style.height = '10px';
  
  // random animation duration
  const duration = 5 + Math.random() * 5;
  pulse.style.animationDuration = `${duration}s`;
  
  container.appendChild(pulse);
  
  // remove after animation completes
  setTimeout(() => {
    pulse.remove();
  }, duration * 1000);
}

// helper to create audio line
function createAudioLine(container) {
  const line = document.createElement('div');
  line.className = 'audio-line';
  
  // random position and size
  const left = Math.random() * 100;
  const height = 50 + Math.random() * 200;
  const top = Math.random() * (100 - height / window.innerHeight * 100);
  
  line.style.left = `${left}%`;
  line.style.top = `${top}%`;
  line.style.height = `${height}px`;
  
  // random animation duration and delay
  const duration = 8 + Math.random() * 7;
  const delay = Math.random() * 5;
  line.style.animationDuration = `${duration}s`;
  line.style.animationDelay = `${delay}s`;
  
  container.appendChild(line);
}

// helper to create fog veil
function createFogVeil(container) {
  const fog = document.createElement('div');
  fog.className = 'audio-fog';
  
  // random position and size
  const width = 200 + Math.random() * 400;
  const height = 100 + Math.random() * 300;
  const left = Math.random() * (100 - width / window.innerWidth * 100);
  const top = Math.random() * (100 - height / window.innerHeight * 100);
  
  fog.style.left = `${left}%`;
  fog.style.top = `${top}%`;
  fog.style.width = `${width}px`;
  fog.style.height = `${height}px`;
  
  // random animation duration and delay
  const duration = 15 + Math.random() * 15;
  const delay = Math.random() * 10;
  fog.style.animationDuration = `${duration}s`;
  fog.style.animationDelay = `${delay}s`;
  
  container.appendChild(fog);
}

// 3. glass morphism cards
function applyGlassMorphism() {
  // add css for glass morphism
  const glassStyle = document.createElement('style');
  glassStyle.textContent = `
    .about-content,
    .contact-content,
    .skill-item,
    .project-item {
      background: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(14px) !important;
      -webkit-backdrop-filter: blur(14px) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
    }
    
    .project-item:hover {
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
    }
    
    .hero-content {
      background: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(14px) !important;
      -webkit-backdrop-filter: blur(14px) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
    }
  `;
  document.head.appendChild(glassStyle);
}

// 4. color-tinted halo cursor
function initHaloCursor() {
  // add css for cursor
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    body {
      cursor: none;
    }
    
    #cursor-ring {
      position: fixed;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid rgba(190, 147, 255, 0.3);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease, background-color 0.3s ease;
      transform: translate(-50%, -50%);
    }
    
    #cursor-trail {
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid rgba(190, 147, 255, 0.15);
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.3s ease;
      transform: translate(-50%, -50%);
    }
    
    a:hover ~ #cursor-ring,
    button:hover ~ #cursor-ring {
      background-color: rgba(108, 99, 255, 0.15);
      width: 50px;
      height: 50px;
      border-color: rgba(108, 99, 255, 0.4);
      box-shadow: 0 0 15px rgba(108, 99, 255, 0.2);
    }
    
    .project-item:hover ~ #cursor-ring {
      background-color: rgba(190, 147, 255, 0.15);
      border-color: rgba(190, 147, 255, 0.4);
      box-shadow: 0 0 15px rgba(190, 147, 255, 0.2);
    }
  `;
  document.head.appendChild(cursorStyle);
  
  // create cursor elements
  const cursorRing = document.createElement('div');
  cursorRing.id = 'cursor-ring';
  document.body.appendChild(cursorRing);
  
  const cursorTrail = document.createElement('div');
  cursorTrail.id = 'cursor-trail';
  document.body.appendChild(cursorTrail);
  
  // update cursor position
  document.addEventListener('mousemove', e => {
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
    
    // trail follows with delay
    setTimeout(() => {
      cursorTrail.style.left = e.clientX + 'px';
      cursorTrail.style.top = e.clientY + 'px';
    }, 100);
  });
  
  // pulse animation
  let pulseInterval;
  const startPulse = () => {
    if (pulseInterval) clearInterval(pulseInterval);
    
    pulseInterval = setInterval(() => {
      cursorRing.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.7 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
      ], {
        duration: 1000,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
      });
    }, 3000);
  };
  
  startPulse();
  
  // hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursorRing.style.opacity = '0';
    cursorTrail.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursorRing.style.opacity = '1';
    cursorTrail.style.opacity = '1';
  });
}

// 5. flashing word highlights
function initFlashingWords() {
  // words to flash
  const flashWords = [
    'buzz', 'silence', 'echo', 'resonance', 'vibration', 
    'dream', 'glow', 'hum', 'pulse', 'drift'
  ];
  
  // add css for flashing words
  const flashStyle = document.createElement('style');
  flashStyle.textContent = `
    .flashword {
      display: inline-block;
      position: relative;
    }
    
    .flashword::after {
      content: '';
      position: absolute;
      top: 0;
      left: -5%;
      width: 110%;
      height: 100%;
      background: rgba(190, 147, 255, 0);
      filter: blur(8px);
      z-index: -1;
      opacity: 0;
    }
    
    .flashword.flash::after {
      animation: wordglow 3s ease-in-out;
    }
    
    @keyframes wordglow {
      0% { background: rgba(190, 147, 255, 0); opacity: 0; }
      50% { background: rgba(190, 147, 255, 0.3); opacity: 0.8; }
      100% { background: rgba(190, 147, 255, 0); opacity: 0; }
    }
  `;
  document.head.appendChild(flashStyle);
  
  // find all paragraphs
  const paragraphs = document.querySelectorAll('p');
  
  // wrap flashwords in spans
  paragraphs.forEach(p => {
    let html = p.innerHTML;
    
    flashWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      html = html.replace(regex, `<span class="flashword">$&</span>`);
    });
    
    p.innerHTML = html;
  });
  
  // randomly trigger flashing
  function randomFlash() {
    const flashwords = document.querySelectorAll('.flashword');
    if (flashwords.length === 0) return;
    
    // pick a random word
    const randomIndex = Math.floor(Math.random() * flashwords.length);
    const word = flashwords[randomIndex];
    
    // if word is in viewport, flash it
    const rect = word.getBoundingClientRect();
    const isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
    
    if (isInViewport) {
      word.classList.add('flash');
      
      // remove class after animation
      setTimeout(() => {
        word.classList.remove('flash');
      }, 3000);
    }
    
    // schedule next flash
    setTimeout(randomFlash, 5000 + Math.random() * 5000);
  }
  
  // start flashing after page loads
  setTimeout(randomFlash, 3000);
}

// 6. animated noise/grain overlay
function initGrainOverlay() {
  // add css for grain overlay
  const grainStyle = document.createElement('style');
  grainStyle.textContent = `
    #grain {
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      mix-blend-mode: overlay;
      opacity: 0.03;
      z-index: 99;
    }
  `;
  document.head.appendChild(grainStyle);
  
  // create grain overlay
  const grain = document.createElement('div');
  grain.id = 'grain';
  document.body.appendChild(grain);
  
  // create grain with canvas
  function createGrain() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // set canvas size
    canvas.width = 256;
    canvas.height = 256;
    
    // create noise pattern
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.floor(Math.random() * 255);
      data[i] = value;     // red
      data[i + 1] = value; // green
      data[i + 2] = value; // blue
      data[i + 3] = 25;    // alpha (very transparent)
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // set as background
    grain.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
    grain.style.backgroundRepeat = 'repeat';
  }
  
  // create initial grain
  createGrain();
  
  // animate grain by recreating it
  setInterval(createGrain, 500);
}

// 7. kinetic typographic elements
function initKineticTypography() {
  // add css for kinetic typography
  const typoStyle = document.createElement('style');
  typoStyle.textContent = `
    .kinetic-text {
      display: inline-block;
      position: relative;
      font-weight: 300;
      letter-spacing: 0.1em;
      color: rgba(190, 147, 255, 0.9);
      text-shadow: 0 0 10px rgba(190, 147, 255, 0.3);
    }
    
    .main-title .kinetic-text {
      animation: textFloat 4s ease-in-out infinite;
      animation-delay: calc(var(--kinetic-index) * 0.1s);
    }
    
    @keyframes textFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-5px) rotate(1deg); }
    }
  `;
  document.head.appendChild(typoStyle);
  
  // find main title and wrap each character
  const mainTitle = document.querySelector('.main-title');
  if (mainTitle) {
    const text = mainTitle.textContent;
    let newHtml = '';
    
    // wrap each character
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        newHtml += ' ';
      } else {
        newHtml += `<span class="kinetic-text" style="--kinetic-index: ${i}">${text[i]}</span>`;
      }
    }
    
    mainTitle.innerHTML = newHtml;
  }
}

// 8. liquid distortion hover effects
function initLiquidHoverEffects() {
  // add css for liquid effects
  const liquidStyle = document.createElement('style');
  liquidStyle.textContent = `
    .project-item {
      transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), filter 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }
    
    .project-item:hover {
      filter: url('#liquid-distortion-filter');
    }
  `;
  document.head.appendChild(liquidStyle);
  
  // create svg filter
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.style.pointerEvents = 'none';
  
  // create filter
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'liquid-distortion-filter');
  
  // turbulence filter primitive
  const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
  turbulence.setAttribute('baseFrequency', '0.01 0.01');
  turbulence.setAttribute('numOctaves', '2');
  turbulence.setAttribute('seed', '1');
  turbulence.setAttribute('type', 'fractalNoise');
  turbulence.setAttribute('result', 'turbulence');
  
  // animated turbulence
  const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  animate.setAttribute('attributeName', 'baseFrequency');
  animate.setAttribute('dur', '30s');
  animate.setAttribute('values', '0.01 0.01;0.02 0.02;0.01 0.01');
  animate.setAttribute('repeatCount', 'indefinite');
  turbulence.appendChild(animate);
  
  // displacement map
  const displacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
  displacementMap.setAttribute('in', 'SourceGraphic');
  displacementMap.setAttribute('in2', 'turbulence');
  displacementMap.setAttribute('scale', '10');
  displacementMap.setAttribute('xChannelSelector', 'R');
  displacementMap.setAttribute('yChannelSelector', 'G');
  
  // add primitives to filter
  filter.appendChild(turbulence);
  filter.appendChild(displacementMap);
  
  // add filter to svg
  svg.appendChild(filter);
  
  // add svg to body
  document.body.appendChild(svg);
}

// 9. moon phases footer
function initMoonPhasesFooter() {
  // add css for moon phases
  const moonStyle = document.createElement('style');
  moonStyle.textContent = `
    .moon-phases {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 15px;
    }
    
    .moon {
      position: relative;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      overflow: hidden;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
      opacity: 0.2;
      transition: all 0.5s ease;
    }
    
    .moon::after {
      content: '';
      position: absolute;
      top: 0;
      left: var(--shift);
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgba(10, 10, 18, 0.9);
    }
    
    .moon.active {
      opacity: 0.9;
      transform: scale(1.2);
      box-shadow: 0 0 10px rgba(190, 147, 255, 0.5);
    }
  `;
  document.head.appendChild(moonStyle);
  
  // create moon phases container
  const footer = document.querySelector('footer');
  if (footer) {
    const moonPhasesContainer = document.createElement('div');
    moonPhasesContainer.className = 'moon-phases';
    
    // create 8 moon phases
    for (let i = 0; i < 8; i++) {
      const moon = document.createElement('div');
      moon.className = 'moon';
      
      // different phase based on index
      const shift = i < 4 ? -i * 3 : (i - 8) * 3;
      moon.style.setProperty('--shift', `${shift}px`);
      
      moonPhasesContainer.appendChild(moon);
    }
    
    footer.appendChild(moonPhasesContainer);
    
    // activate random moon phase on load
    const randomIndex = Math.floor(Math.random() * 8);
    const moons = moonPhasesContainer.querySelectorAll('.moon');
    moons[randomIndex].classList.add('active');
    
    // change active moon on scroll
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + window.innerHeight;
      const docHeight = document.body.offsetHeight;
      const scrollPercentage = scrollPos / docHeight;
      
      // calculate which moon should be active
      const activeMoonIndex = Math.floor(scrollPercentage * 8);
      
      // update active class
      moons.forEach((moon, i) => {
        if (i === activeMoonIndex) {
          moon.classList.add('active');
        } else {
          moon.classList.remove('active');
        }
      });
    });
  }
}