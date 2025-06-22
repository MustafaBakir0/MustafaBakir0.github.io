// Section 8: Health & Wellness - A Proactive Approach

$(document).ready(function() {
    // Initialize the page
    initSection8();
    
    // Add event listeners
    addEventListeners();
    
    // Start animations
    startAnimations();
});

function initSection8() {
    console.log('Initializing Section 8: Health & Wellness');
    
    // Generate random star positions
    generateStars();
    
    // Initialize biometric data
    initializeBiometrics();
    
    // Set up AI physician interface
    setupPhysicianInterface();
}

function generateStars() {
    // Generate random star positions for the background
    const stars = document.querySelectorAll('.stars');
    
    stars.forEach(star => {
        const starCount = 50;
        let starPositions = '';
        
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            starPositions += `${x}% ${y}%, `;
        }
        
        star.style.setProperty('--star-positions', starPositions);
    });
}

function initializeBiometrics() {
    // Simulate real-time biometric data updates
    setInterval(() => {
        updateHeartRate();
        updateStressLevel();
        updateMetabolicRate();
        updateSleepQuality();
    }, 3000);
    
    // Initial update
    updateHeartRate();
    updateStressLevel();
    updateMetabolicRate();
    updateSleepQuality();
}

function updateHeartRate() {
    const heartRateNumber = document.querySelector('.heart-rate-number');
    const statusIndicator = document.querySelector('.heart-rate-card .status-indicator');
    const statusText = document.querySelector('.heart-rate-card .status-text');
    
    // Simulate realistic heart rate variations
    const baseRate = 72;
    const variation = Math.floor(Math.random() * 20) - 10;
    const newRate = Math.max(60, Math.min(100, baseRate + variation));
    
    // Animate the number change
    animateNumber(heartRateNumber, newRate);
    
    // Update status based on heart rate
    if (newRate < 65) {
        statusIndicator.className = 'status-indicator low';
        statusText.textContent = 'Low';
    } else if (newRate > 85) {
        statusIndicator.className = 'status-indicator high';
        statusText.textContent = 'High';
    } else {
        statusIndicator.className = 'status-indicator normal';
        statusText.textContent = 'Normal';
    }
}

function updateStressLevel() {
    const stressNumber = document.querySelector('.stress-number');
    const meterIndicator = document.querySelector('.meter-indicator');
    const statusIndicator = document.querySelector('.stress-level-card .status-indicator');
    const statusText = document.querySelector('.stress-level-card .status-text');
    
    // Simulate stress level variations
    const baseStress = 23;
    const variation = Math.floor(Math.random() * 30) - 15;
    const newStress = Math.max(5, Math.min(80, baseStress + variation));
    
    // Animate the number change
    animateNumber(stressNumber, newStress);
    
    // Update meter indicator position
    const angle = (newStress / 100) * 180 + 150; // Convert percentage to angle
    meterIndicator.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    
    // Update status
    if (newStress < 20) {
        statusIndicator.className = 'status-indicator low';
        statusText.textContent = 'Low';
    } else if (newStress > 50) {
        statusIndicator.className = 'status-indicator high';
        statusText.textContent = 'High';
    } else {
        statusIndicator.className = 'status-indicator normal';
        statusText.textContent = 'Normal';
    }
}

function updateMetabolicRate() {
    const metabolicNumber = document.querySelector('.metabolic-number');
    
    // Simulate metabolic rate variations
    const baseRate = 1847;
    const variation = Math.floor(Math.random() * 200) - 100;
    const newRate = Math.max(1600, Math.min(2100, baseRate + variation));
    
    // Animate the number change
    animateNumber(metabolicNumber, newRate);
}

function updateSleepQuality() {
    const sleepScore = document.querySelector('.sleep-score');
    
    // Simulate sleep quality variations
    const baseScore = 92;
    const variation = Math.floor(Math.random() * 10) - 5;
    const newScore = Math.max(85, Math.min(98, baseScore + variation));
    
    // Animate the number change
    animateNumber(sleepScore, newScore);
}

function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent.replace(/,/g, ''));
    const difference = newValue - currentValue;
    const steps = 20;
    const stepValue = difference / steps;
    let currentStep = 0;
    
    const animation = setInterval(() => {
        currentStep++;
        const currentDisplayValue = Math.round(currentValue + (stepValue * currentStep));
        
        if (currentStep >= steps) {
            element.textContent = newValue.toLocaleString();
            clearInterval(animation);
        } else {
            element.textContent = currentDisplayValue.toLocaleString();
        }
    }, 50);
}

function setupPhysicianInterface() {
    // Simulate AI physician messages
    const messages = [
        "Your biometrics are looking excellent today. I recommend a 15-minute meditation session to maintain your optimal stress levels.",
        "I notice your heart rate is slightly elevated. Consider taking a short walk to help regulate it.",
        "Your sleep quality has improved by 5% this week. Keep up the good work with your evening routine.",
        "Your metabolic rate is in the optimal range. This indicates good energy balance and health.",
        "I recommend increasing your water intake today. Your hydration levels are slightly below optimal."
    ];
    
    let messageIndex = 0;
    
    setInterval(() => {
        const messageText = document.querySelector('.message-text');
        const messageBubble = document.querySelector('.message-bubble');
        
        // Fade out current message
        messageBubble.style.opacity = '0';
        
        setTimeout(() => {
            messageText.textContent = messages[messageIndex];
            messageBubble.style.opacity = '1';
            messageIndex = (messageIndex + 1) % messages.length;
        }, 500);
    }, 8000);
    
    // Update recommendation cards
    updateRecommendations();
}

function updateRecommendations() {
    const recommendations = [
        { icon: 'fas fa-spa', title: 'Meditation', duration: '15 min' },
        { icon: 'fas fa-walking', title: 'Light Exercise', duration: '30 min' },
        { icon: 'fas fa-tint', title: 'Hydration', duration: '2L today' },
        { icon: 'fas fa-bed', title: 'Sleep', duration: '8 hours' },
        { icon: 'fas fa-apple-alt', title: 'Nutrition', duration: 'Balanced' },
        { icon: 'fas fa-heart', title: 'Cardio', duration: '20 min' }
    ];
    
    setInterval(() => {
        const recCards = document.querySelectorAll('.recommendation-card');
        
        recCards.forEach((card, index) => {
            const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)];
            const icon = card.querySelector('.rec-icon i');
            const title = card.querySelector('.rec-title');
            const duration = card.querySelector('.rec-duration');
            
            // Animate the change
            card.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                icon.className = randomRec.icon;
                title.textContent = randomRec.title;
                duration.textContent = randomRec.duration;
                card.style.transform = 'scale(1)';
            }, 200);
        });
    }, 10000);
}

function addEventListeners() {
    // Interactive card hover effects
    $('.interactive-card').hover(
        function() {
            $(this).addClass('hovered');
            const wellnessType = $(this).data('wellness');
            showWellnessInfo(wellnessType);
        },
        function() {
            $(this).removeClass('hovered');
            hideWellnessInfo();
        }
    );
    
    // Biometric card interactions
    $('.biometric-card').click(function() {
        const cardType = $(this).hasClass('heart-rate-card') ? 'heart' :
                        $(this).hasClass('stress-level-card') ? 'stress' :
                        $(this).hasClass('metabolic-card') ? 'metabolic' : 'sleep';
        
        showDetailedView(cardType);
    });
    
    // Feature card interactions
    $('.feature-card').hover(
        function() {
            $(this).find('.feature-glow').addClass('active');
        },
        function() {
            $(this).find('.feature-glow').removeClass('active');
        }
    );
    
    // Recommendation card interactions
    $('.recommendation-card').click(function() {
        const title = $(this).find('.rec-title').text();
        const duration = $(this).find('.rec-duration').text();
        
        showRecommendationDetails(title, duration);
    });
}

function showWellnessInfo(type) {
    const info = {
        monitoring: "Real-time biometric tracking with clinical-grade accuracy",
        analysis: "AI-powered pattern recognition for early health insights",
        prevention: "Proactive health management and risk assessment",
        guidance: "Personalized wellness recommendations and coaching"
    };
    
    // Create or update info tooltip
    let tooltip = $('.wellness-tooltip');
    if (tooltip.length === 0) {
        tooltip = $('<div class="wellness-tooltip"></div>');
        $('body').append(tooltip);
    }
    
    tooltip.text(info[type]).fadeIn(300);
}

function hideWellnessInfo() {
    $('.wellness-tooltip').fadeOut(300);
}

function showDetailedView(type) {
    const details = {
        heart: {
            title: "Heart Rate Analysis",
            description: "Real-time monitoring of cardiovascular health with AI-powered insights",
            data: "Current: 72 BPM | Average: 70 BPM | Trend: Stable"
        },
        stress: {
            title: "Stress Level Assessment",
            description: "Comprehensive stress monitoring using multiple biometric indicators",
            data: "Current: 23% | Average: 25% | Trend: Improving"
        },
        metabolic: {
            title: "Metabolic Rate Tracking",
            description: "Continuous monitoring of energy expenditure and metabolic health",
            data: "Current: 1,847 kcal | Average: 1,850 kcal | Trend: Optimal"
        },
        sleep: {
            title: "Sleep Quality Analysis",
            description: "Advanced sleep pattern analysis for optimal rest and recovery",
            data: "Current: 92/100 | Average: 89/100 | Trend: Improving"
        }
    };
    
    const detail = details[type];
    
    // Create detailed view modal
    const modal = $(`
        <div class="detail-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${detail.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${detail.description}</p>
                    <div class="data-display">
                        <h4>Current Data</h4>
                        <p>${detail.data}</p>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    $('body').append(modal);
    modal.fadeIn(300);
    
    // Close modal functionality
    modal.find('.close-modal, .detail-modal').click(function() {
        modal.fadeOut(300, function() {
            modal.remove();
        });
    });
}

function showRecommendationDetails(title, duration) {
    const recommendations = {
        'Meditation': {
            description: "Guided meditation session to reduce stress and improve mental clarity",
            benefits: ["Reduces stress", "Improves focus", "Better sleep"]
        },
        'Light Exercise': {
            description: "Low-impact physical activity to boost energy and improve circulation",
            benefits: ["Increases energy", "Better circulation", "Mood improvement"]
        },
        'Hydration': {
            description: "Maintain optimal hydration levels for peak physical and mental performance",
            benefits: ["Better focus", "Improved energy", "Clearer skin"]
        },
        'Sleep': {
            description: "Optimize your sleep schedule for maximum recovery and performance",
            benefits: ["Better recovery", "Improved memory", "Enhanced mood"]
        },
        'Nutrition': {
            description: "Balanced nutrition plan tailored to your health goals and preferences",
            benefits: ["Sustained energy", "Better health", "Optimal performance"]
        },
        'Cardio': {
            description: "Cardiovascular exercise to strengthen heart health and boost endurance",
            benefits: ["Heart health", "Increased stamina", "Better mood"]
        }
    };
    
    const rec = recommendations[title] || {
        description: "Personalized recommendation for optimal health and wellness",
        benefits: ["Improved health", "Better performance", "Enhanced wellbeing"]
    };
    
    const modal = $(`
        <div class="recommendation-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title} - ${duration}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${rec.description}</p>
                    <div class="benefits">
                        <h4>Benefits:</h4>
                        <ul>
                            ${rec.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="start-activity">Start ${title}</button>
                </div>
            </div>
        </div>
    `);
    
    $('body').append(modal);
    modal.fadeIn(300);
    
    // Close modal functionality
    modal.find('.close-modal, .recommendation-modal').click(function() {
        modal.fadeOut(300, function() {
            modal.remove();
        });
    });
    
    // Start activity button
    modal.find('.start-activity').click(function() {
        alert(`Starting ${title} session. Your AI physician will guide you through the process.`);
        modal.fadeOut(300, function() {
            modal.remove();
        });
    });
}

function startAnimations() {
    // Animate elements on scroll
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        $('.biometric-card, .feature-card, .interactive-card').each(function() {
            const elementTop = $(this).offset().top;
            const elementVisible = 150;
            
            if (scrolled + windowHeight > elementTop + elementVisible) {
                $(this).addClass('animate-in');
            }
        });
    });
    
    // Trigger initial animation check
    $(window).scroll();
    
    // Floating particles animation
    animateParticles();
}

function animateParticles() {
    const particles = document.querySelectorAll('.health-particle');
    
    particles.forEach((particle, index) => {
        // Create random movement patterns
        const keyframes = [
            { transform: 'translateY(0) scale(1)', opacity: 0.8 },
            { transform: 'translateY(-20px) scale(1.2)', opacity: 1 },
            { transform: 'translateY(-40px) scale(1)', opacity: 0.8 },
            { transform: 'translateY(-20px) scale(1.1)', opacity: 1 },
            { transform: 'translateY(0) scale(1)', opacity: 0.8 }
        ];
        
        const options = {
            duration: 4000 + (index * 500),
            iterations: Infinity,
            easing: 'ease-in-out'
        };
        
        particle.animate(keyframes, options);
    });
}

// Add CSS for modals and tooltips
const additionalCSS = `
    .wellness-tooltip {
        position: fixed;
        background: rgba(0, 255, 255, 0.9);
        color: #000;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        max-width: 250px;
        z-index: 10000;
        pointer-events: none;
        display: none;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 255, 255, 0.3);
    }
    
    .detail-modal, .recommendation-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        z-index: 10000;
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        backdrop-filter: blur(15px);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        padding-bottom: 1rem;
    }
    
    .modal-header h3 {
        color: #00ff88;
        font-size: 1.5rem;
        font-weight: 300;
    }
    
    .close-modal {
        background: none;
        border: none;
        color: #ffffff;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .close-modal:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #00ff88;
    }
    
    .modal-body p {
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }
    
    .data-display, .benefits {
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.2);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .data-display h4, .benefits h4 {
        color: #00ff88;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }
    
    .benefits ul {
        list-style: none;
        padding: 0;
    }
    
    .benefits li {
        color: rgba(255, 255, 255, 0.8);
        padding: 0.3rem 0;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .benefits li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #00ff88;
        font-weight: bold;
    }
    
    .start-activity {
        background: linear-gradient(45deg, #00ff88, #00ffff);
        border: none;
        color: #000;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-size: 1rem;
        font-weight: 300;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
    }
    
    .start-activity:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 255, 136, 0.4);
    }
    
    .biometric-card.animate-in,
    .feature-card.animate-in,
    .interactive-card.animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .feature-glow.active {
        animation: feature-glow-active 1s ease-in-out infinite;
    }
    
    @keyframes feature-glow-active {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
        50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; }
    }
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Update tooltip position on mouse move
$(document).mousemove(function(e) {
    const tooltip = $('.wellness-tooltip');
    if (tooltip.is(':visible')) {
        tooltip.css({
            left: e.pageX + 15,
            top: e.pageY - 15
        });
    }
}); 