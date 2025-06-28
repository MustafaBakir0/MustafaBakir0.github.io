// Analytics and Cookie Consent Management for Google Tag Manager

class AnalyticsManager {
    constructor() {
        this.consentGiven = this.getConsentStatus();
        this.init();
    }

    init() {
        if (!this.consentGiven) {
            this.showCookieBanner();
        } else {
            this.loadAnalytics();
        }
    }

    getConsentStatus() {
        return localStorage.getItem('analytics-consent') === 'true';
    }

    setConsentStatus(consent) {
        localStorage.setItem('analytics-consent', consent);
        this.consentGiven = consent;
    }

    showCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h3>🍪 Cookie Notice</h3>
                    <p>This website uses cookies and analytics to improve your experience. We collect anonymous usage data to understand how visitors interact with our site.</p>
                    <div class="cookie-links">
                        <a href="privacy-policy.html" target="_blank">Privacy Policy</a>
                        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank">Opt Out</a>
                    </div>
                </div>
                <div class="cookie-actions">
                    <button class="btn btn-secondary" id="cookie-decline">Decline</button>
                    <button class="btn btn-primary" id="cookie-accept">Accept All</button>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--color-surface);
                border-top: var(--brutalist-border);
                box-shadow: var(--brutalist-shadow);
                z-index: var(--z-modal);
                padding: var(--space-4);
                transform: translateY(100%);
                transition: transform 0.3s ease;
            }
            
            .cookie-banner.show {
                transform: translateY(0);
            }
            
            .cookie-content {
                max-width: var(--container-lg);
                margin: 0 auto;
                display: flex;
                align-items: center;
                gap: var(--space-6);
            }
            
            .cookie-text h3 {
                margin-bottom: var(--space-2);
                color: var(--color-primary);
            }
            
            .cookie-text p {
                margin-bottom: var(--space-3);
                color: var(--color-secondary);
                line-height: 1.5;
            }
            
            .cookie-links {
                display: flex;
                gap: var(--space-4);
                margin-bottom: var(--space-3);
            }
            
            .cookie-links a {
                color: var(--color-accent);
                text-decoration: none;
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-medium);
            }
            
            .cookie-links a:hover {
                text-decoration: underline;
            }
            
            .cookie-actions {
                display: flex;
                gap: var(--space-3);
                flex-shrink: 0;
            }
            
            @media (max-width: 768px) {
                .cookie-content {
                    flex-direction: column;
                    text-align: center;
                    gap: var(--space-4);
                }
                
                .cookie-actions {
                    width: 100%;
                    justify-content: center;
                }
                
                .cookie-links {
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(styles);

        document.body.appendChild(banner);
        
        // Show banner after a short delay
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);

        // Event listeners
        document.getElementById('cookie-accept').addEventListener('click', () => {
            this.acceptCookies();
        });

        document.getElementById('cookie-decline').addEventListener('click', () => {
            this.declineCookies();
        });
    }

    acceptCookies() {
        this.setConsentStatus(true);
        this.hideCookieBanner();
        this.loadAnalytics();
        this.trackEvent('cookie_consent', 'accepted');
    }

    declineCookies() {
        this.setConsentStatus(false);
        this.hideCookieBanner();
        this.trackEvent('cookie_consent', 'declined');
    }

    hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    loadAnalytics() {
        if (!this.consentGiven) return;

        // Google Tag Manager is already loaded via the GTM script
        // We just need to track events and page views
        
        // Track page views
        this.trackPageView();
        
        // Track form submissions
        this.trackFormSubmissions();
        
        // Track project interactions
        this.trackProjectInteractions();
        
        // Track other interactions
        this.trackOtherInteractions();
    }

    trackPageView() {
        if (!this.consentGiven) return;
        
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            page_referrer: document.referrer
        };
        
        // Push to dataLayer for GTM
        if (window.dataLayer) {
            window.dataLayer.push({
                event: 'page_view',
                page_title: pageData.page_title,
                page_location: pageData.page_location,
                page_referrer: pageData.page_referrer
            });
        }
    }

    trackEvent(eventName, eventAction, eventLabel = null, eventValue = null) {
        if (!this.consentGiven) return;
        
        const eventData = {
            event: eventName,
            event_category: 'portfolio_interaction',
            event_action: eventAction,
            event_label: eventLabel,
            event_value: eventValue
        };
        
        // Push to dataLayer for GTM
        if (window.dataLayer) {
            window.dataLayer.push(eventData);
        }
    }

    trackFormSubmissions() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', () => {
                this.trackEvent('form_submit', 'contact_form', 'Contact Form Submission');
            });
        }
    }

    trackProjectInteractions() {
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const projectCard = e.target.closest('.project-card');
                if (projectCard) {
                    const projectName = projectCard.querySelector('h3')?.textContent || 'Unknown Project';
                    this.trackEvent('project_click', projectName, 'Project Link Click');
                }
            });
        });
    }

    trackOtherInteractions() {
        // Track CV download
        const cvDownloadLink = document.querySelector('a[href="my cv.pdf"]');
        if (cvDownloadLink) {
            cvDownloadLink.addEventListener('click', () => {
                this.trackEvent('download', 'resume', 'CV Download');
            });
        }

        // Track social media clicks
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = e.target.textContent.trim().toLowerCase();
                this.trackEvent('social_click', platform, 'Social Media Click');
            });
        });

        // Track navigation clicks
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const section = e.target.textContent.trim();
                this.trackEvent('navigation_click', section, 'Navigation Click');
            });
        });

        // Track experience toggle
        const experienceToggle = document.getElementById('show-more-experience');
        if (experienceToggle) {
            experienceToggle.addEventListener('click', () => {
                this.trackEvent('experience_toggle', 'show_more', 'Experience Section Toggle');
            });
        }

        // Track projects toggle
        const projectsToggle = document.getElementById('show-more-projects');
        if (projectsToggle) {
            projectsToggle.addEventListener('click', () => {
                this.trackEvent('projects_toggle', 'show_more', 'Projects Section Toggle');
            });
        }
    }

    // Custom event tracking methods
    trackDownload(downloadType) {
        this.trackEvent('download', downloadType, 'File Download');
    }

    trackEmailClick() {
        this.trackEvent('email_click', 'contact', 'Email Click');
    }

    trackSocialClick(platform) {
        this.trackEvent('social_click', platform, 'Social Media Click');
    }

    trackScrollDepth(depth) {
        this.trackEvent('scroll_depth', depth, 'Page Scroll Depth');
    }

    trackTimeOnPage(seconds) {
        this.trackEvent('time_on_page', seconds, 'Time Spent on Page');
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.analytics = new AnalyticsManager();
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
            maxScrollDepth = scrollPercent;
            if (window.analytics) {
                window.analytics.trackScrollDepth(scrollPercent);
            }
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        if (window.analytics) {
            window.analytics.trackTimeOnPage(timeSpent);
        }
    });
});

// Export for use in other scripts
window.AnalyticsManager = AnalyticsManager; 