// make the resonanceApp function globally available
window.resonanceApp = function() {
    return {
        newComment: {
            name: '',
            text: ''
        },
        comments: [],
        descriptionText: 'Resonance is a short sci-fi film set in a future where every person lives with a relentless buzzing in their ears — a quiet agony they cannot escape. In this world, music becomes both cure and craving. Each song radiates a distinct color, its vibrations offering fleeting relief from the endless hum. But as music turns into a form of self-medication, the boundaries begin to dissolve: rave songs spark psychedelic visions, party anthems hit like chemical highs, and listeners find themselves caught in invisible cycles of dependency. Through this story, Resonance sheds light on the dangers of drug abuse and the lesser-seen addiction to constant musical stimulation — the need to always fill silence with sound. It invites reflection on how easily comfort can become captivity, and how often we reach outward to quiet the unrest within.',
        particles: [],
        audioWaveBars: [],
        specialWords: ['buzzing', 'music', 'craving', 'cure', 'relief', 'dependency', 'addiction', 'stimulation', 'comfort', 'captivity'],
        
        init() {
            // init page animations
            this.initAnimations();
            
            // load comments from local storage
            this.loadComments();
            
            // process description text for animation
            this.processDescription();
            
            // initialize custom cursor
            this.initCursor();
            
            // initialize visual effects
            this.initParticles();
            this.initAudioWave();
            this.initColorFlash();
            
            // check if description is in viewport on scroll
            window.addEventListener('scroll', () => this.checkDescriptionVisibility());
            
            // add background image animation on mousemove
            this.initBackgroundAnimation();
            this.checkDescriptionVisibility();

        },
        
        // new function to handle background image movement
        initBackgroundAnimation() {
            // grab bg image
            const bgImage = document.querySelector('.bg-image');
            if (!bgImage) return;
            
            // add subtle parallax effect
            document.addEventListener('mousemove', (e) => {
                const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
                const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
                
                // apply transform with translate
                bgImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            // log success
            console.log('bg image animation initialized');
        },
        
        initAnimations() {
            // intro text animation
            setTimeout(() => {
                if (this.$refs.introText) {
                    this.$refs.introText.style.opacity = '1';
                    this.$refs.introText.style.transform = 'translateY(0)';
                }
            }, 500);
            
            // video container animation
            setTimeout(() => {
                if (this.$refs.videoContainer) {
                    this.$refs.videoContainer.style.opacity = '1';
                    this.$refs.videoContainer.style.transform = 'scale(1)';
                }
            }, 1200);
            
            // comment section animation
            setTimeout(() => {
                if (this.$refs.commentSection) {
                    this.$refs.commentSection.style.opacity = '1';
                    this.$refs.commentSection.style.transform = 'translateY(0)';
                }
            }, 1800);
        },
        
        initCursor() {
            // only on desktop
            if (window.innerWidth > 768) {
                document.addEventListener('mousemove', (e) => {
                    if (this.$refs.cursor) {
                        this.$refs.cursor.style.left = `${e.clientX}px`;
                        this.$refs.cursor.style.top = `${e.clientY}px`;
                    }
                    
                    if (this.$refs.cursorGlow) {
                        this.$refs.cursorGlow.style.left = `${e.clientX}px`;
                        this.$refs.cursorGlow.style.top = `${e.clientY}px`;
                    }
                });
                
                // show glow on hover over interactive elements
                const interactiveElements = document.querySelectorAll('button, input, textarea, .special-word');
                
                interactiveElements.forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        if (this.$refs.cursorGlow) {
                            this.$refs.cursorGlow.style.opacity = '1';
                        }
                        if (this.$refs.cursor) {
                            this.$refs.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                            this.$refs.cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        }
                    });
                    
                    el.addEventListener('mouseleave', () => {
                        if (this.$refs.cursorGlow) {
                            this.$refs.cursorGlow.style.opacity = '0';
                        }
                        if (this.$refs.cursor) {
                            this.$refs.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                            this.$refs.cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        }
                    });
                });
            }
        },
        
        // particles floating in background
        initParticles() {
            // create particles container
            const container = this.$refs.particlesContainer;
            if (!container) return;
            
            // create 50 particles
            for (let i = 0; i < 50; i++) {
                // create particle
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // random position
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                
                // random size (1-5px)
                const size = Math.random() * 4 + 1;
                
                // set styles
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.opacity = Math.random() * 0.5 + 0.1;
                
                // add to container
                container.appendChild(particle);
                
                // store particle data
                this.particles.push({
                    element: particle,
                    x,
                    y,
                    size,
                    speed: Math.random() * 0.5 + 0.1,
                    angle: Math.random() * Math.PI * 2,
                    angleSpeed: (Math.random() - 0.5) * 0.002,
                    glowing: Math.random() > 0.7
                });
            }
            
            // animate particles
            this.animateParticles();
        },
        
        animateParticles() {
            // update each particle
            this.particles.forEach(particle => {
                // update angle
                particle.angle += particle.angleSpeed;
                
                // calculate new position
                particle.x += Math.cos(particle.angle) * particle.speed;
                particle.y += Math.sin(particle.angle) * particle.speed;
                
                // check bounds
                if (particle.x < -particle.size) particle.x = window.innerWidth + particle.size;
                if (particle.x > window.innerWidth + particle.size) particle.x = -particle.size;
                if (particle.y < -particle.size) particle.y = window.innerHeight + particle.size;
                if (particle.y > window.innerHeight + particle.size) particle.y = -particle.size;
                
                // update position
                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
                
                // glowing effect for some particles
                if (particle.glowing) {
                    const glowIntensity = (Math.sin(Date.now() * 0.002) + 1) * 0.5;
                    particle.element.style.boxShadow = `0 0 ${glowIntensity * 5 + 2}px rgba(255, 255, 255, ${glowIntensity * 0.3 + 0.1})`;
                }
            });
            
            // loop animation
            requestAnimationFrame(() => this.animateParticles());
        },
        
        // audio wave visualization
        initAudioWave() {
            const container = this.$refs.audioWave;
            if (!container) return;
            
            const numBars = 50;
            const barWidth = window.innerWidth / numBars;
            
            // create bars
            for (let i = 0; i < numBars; i++) {
                const bar = document.createElement('div');
                bar.classList.add('audio-wave-bar');
                bar.style.left = `${i * barWidth}px`;
                bar.style.width = `${barWidth * 0.8}px`;
                container.appendChild(bar);
                
                this.audioWaveBars.push({
                    element: bar,
                    height: Math.random() * 20 + 5
                });
            }
            
            // animate audio wave
            this.animateAudioWave();
        },
        
        animateAudioWave() {
            this.audioWaveBars.forEach((bar, index) => {
                // calculate height using sin wave
                const time = Date.now() * 0.001;
                const height = Math.sin(time * 2 + index * 0.2) * 15 + 20;
                
                // update height
                bar.element.style.height = `${height}px`;
            });
            
            // loop animation
            requestAnimationFrame(() => this.animateAudioWave());
        },
        
        // color flash effect
        initColorFlash() {
            const flashElement = this.$refs.colorFlash;
            if (!flashElement) return;
            
            // colors array
            const colors = [
                'rgba(255, 0, 0, 0.15)',
                'rgba(0, 255, 0, 0.15)',
                'rgba(0, 0, 255, 0.15)',
                'rgba(255, 255, 0, 0.15)',
                'rgba(255, 0, 255, 0.15)',
                'rgba(0, 255, 255, 0.15)'
            ];
            
            // random flash function
            const randomFlash = () => {
                // random color
                const color = colors[Math.floor(Math.random() * colors.length)];
                flashElement.style.backgroundColor = color;
                
                // show flash
                flashElement.style.opacity = '1';
                
                // hide flash
                setTimeout(() => {
                    flashElement.style.opacity = '0';
                }, 500);
                
                // schedule next flash (4-10 seconds)
                setTimeout(randomFlash, Math.random() * 6000 + 4000);
            };
            
            // start flashing
            setTimeout(randomFlash, 3000);
        },
        
        processDescription() {
            // split text into words
            const words = this.descriptionText.split(' ');
            let html = '';
            
            words.forEach((word, index) => {
                // clean the word from punctuation for checking
                const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
                
                // check if it's a special word
                const isSpecial = this.specialWords.includes(cleanWord);
                
                // determine specific special word class
                let specialClass = '';
                if (cleanWord === 'buzzing') specialClass = 'word-buzz';
                else if (cleanWord === 'music') specialClass = 'word-music';
                else if (cleanWord === 'craving') specialClass = 'word-craving';
                
                // add text-glow class to random words for extra effect
                const hasGlow = Math.random() > 0.8 ? 'text-glow' : '';
                
                // create the word span with appropriate classes
                html += `<span class="word ${isSpecial ? 'special-word ' + specialClass : ''} ${hasGlow}" 
                              style="transition-delay: ${index * 0.02}s">
                            ${word} 
                        </span>`;
            });
            
            const description = this.$refs.description;
            if (description) {
                description.innerHTML = html;
            }
        },
        
        checkDescriptionVisibility() {
            const descElement = this.$refs.description;
            if (!descElement) return;
            
            // check if description is in viewport
            const rect = descElement.getBoundingClientRect();
            
            if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0) {
                // when in view, animate words
                const words = descElement.querySelectorAll('.word');
                
                words.forEach((word, index) => {
                    setTimeout(() => {
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0)';
                    }, index * 20); // staggered animation
                });
                
                // remove scroll listener once animation is triggered
                window.removeEventListener('scroll', this.checkDescriptionVisibility);
            }
        },
        
        submitComment() {
            // validate comment
            if (!this.newComment.text.trim()) return;
            
            // create new comment object
            const comment = {
                id: Date.now(),
                name: this.newComment.name.trim() || 'Anonymous',
                text: this.newComment.text.trim(),
                timestamp: new Date().toISOString()
            };
            
            // add to comments array
            this.comments.unshift(comment);
            
            // save to local storage
            localStorage.setItem('resonanceComments', JSON.stringify(this.comments));
            
            // clear form
            this.newComment = {
                name: '',
                text: ''
            };
            
            // add subtle buzz effect to page
            document.body.style.animation = 'buzz 0.2s';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 200);
        },
        
        loadComments() {
            // load comments from local storage
            const savedComments = localStorage.getItem('resonanceComments');
            if (savedComments) {
                this.comments = JSON.parse(savedComments);
            }
        }
    }
};

// ambient sound effects (very subtle)
document.addEventListener('DOMContentLoaded', function() {
    // create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    
    // only create context when user interacts
    document.body.addEventListener('click', initAudio, { once: true });
    
    function initAudio() {
        const audioCtx = new AudioContext();
        
        // subtle hover sounds for special words
        const specialWords = document.querySelectorAll('.special-word');
        
        specialWords.forEach(word => {
            word.addEventListener('mouseenter', () => {
                // create oscillator
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                
                // set type and frequency based on word
                if (word.classList.contains('word-buzz')) {
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.value = 220;
                } else if (word.classList.contains('word-music')) {
                    oscillator.type = 'sine';
                    oscillator.frequency.value = 440;
                } else if (word.classList.contains('word-craving')) {
                    oscillator.type = 'triangle';
                    oscillator.frequency.value = 330;
                } else {
                    oscillator.type = 'sine';
                    oscillator.frequency.value = 261.63; // C4
                }
                
                // set volume very low
                gainNode.gain.value = 0.03;
                
                // connect nodes
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                // start and stop
                oscillator.start();
                
                setTimeout(() => {
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
                    setTimeout(() => oscillator.stop(), 500);
                }, 200);
            });
        });
    }
});