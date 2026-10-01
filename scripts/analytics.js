/**
 * Analytics - Custom event tracking (placeholder for GTM events)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Track outbound link clicks
    const outboundLinks = document.querySelectorAll('a[target="_blank"]');

    outboundLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    event: 'outbound_click',
                    link_url: link.href,
                    link_text: link.textContent.trim()
                });
            }
        });
    });

    // Track section views
    const sections = document.querySelectorAll('section[id]');
    const trackedSections = new Set();

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !trackedSections.has(entry.target.id)) {
                trackedSections.add(entry.target.id);

                if (typeof dataLayer !== 'undefined') {
                    dataLayer.push({
                        event: 'section_view',
                        section_id: entry.target.id
                    });
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Track form interactions
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        let formStarted = false;

        contactForm.addEventListener('focusin', () => {
            if (!formStarted) {
                formStarted = true;
                if (typeof dataLayer !== 'undefined') {
                    dataLayer.push({
                        event: 'form_start',
                        form_id: 'contact-form'
                    });
                }
            }
        });

        contactForm.addEventListener('submit', () => {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    event: 'form_submit',
                    form_id: 'contact-form'
                });
            }
        });
    }

    // Track resume downloads
    const resumeLink = document.querySelector('a[href*="cv"], a[href*="CV"]');
    if (resumeLink) {
        resumeLink.addEventListener('click', () => {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    event: 'resume_download'
                });
            }
        });
    }
});
