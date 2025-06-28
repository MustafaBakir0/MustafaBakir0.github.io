// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});

const initializeContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
    
    // Initialize form state
    updateSubmitButton();
};

const validateField = (field) => {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(field);
    
    // Validation rules
    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
            
        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'subject':
            if (!value) {
                isValid = false;
                errorMessage = 'Subject is required';
            } else if (value.length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters';
            }
            break;
            
        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const showFieldError = (field, message) => {
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    // Insert after the field
    field.parentNode.appendChild(errorElement);
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
        window.announceToScreenReader(`Error: ${message}`);
    }
};

const clearFieldError = (field) => {
    field.classList.remove('error');
    
    // Remove error message
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.remove();
    }
};

const updateSubmitButton = () => {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea');
    
    const isValid = Array.from(inputs).every(input => {
        if (input.hasAttribute('required')) {
            return input.value.trim() !== '';
        }
        return true;
    });
    
    submitBtn.disabled = !isValid;
    submitBtn.textContent = submitBtn.disabled ? 'Please fill all required fields' : 'Send Message';
};

const handleFormSubmission = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Validate all fields
    const isValid = Array.from(inputs).every(input => validateField(input));
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Sending...';
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Submit to Formspree
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showSuccessMessage(form);
            form.reset();
        } else {
            throw new Error('Submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage(form);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Send Message';
    }
};

const showSuccessMessage = (form) => {
    // Remove existing messages
    clearMessages(form);
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <h4>Message Sent Successfully!</h4>
        <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
    `;
    successMessage.setAttribute('role', 'alert');
    
    // Insert before form
    form.parentNode.insertBefore(successMessage, form);
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
        window.announceToScreenReader('Message sent successfully');
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 5000);
};

const showErrorMessage = (form) => {
    // Remove existing messages
    clearMessages(form);
    
    // Create error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error';
    errorMessage.innerHTML = `
        <h4>Message Could Not Be Sent</h4>
        <p>There was an error sending your message. Please try again or contact me directly.</p>
    `;
    errorMessage.setAttribute('role', 'alert');
    
    // Insert before form
    form.parentNode.insertBefore(errorMessage, form);
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
        window.announceToScreenReader('Error: Message could not be sent');
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.remove();
        }
    }, 5000);
};

const clearMessages = (form) => {
    const messages = form.parentNode.querySelectorAll('.form-success, .form-error');
    messages.forEach(message => message.remove());
};

// Input sanitization
const sanitizeInput = (input) => {
    return input
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim();
};

// Character counter for message field
const initializeCharacterCounter = () => {
    const messageField = document.querySelector('textarea[name="message"]');
    if (!messageField) return;
    
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
        font-size: 0.875rem;
        color: var(--color-text-muted);
        text-align: right;
        margin-top: 0.25rem;
    `;
    
    messageField.parentNode.appendChild(counter);
    
    const updateCounter = () => {
        const length = messageField.value.length;
        const maxLength = 1000; // Set your desired max length
        counter.textContent = `${length}/${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = 'var(--color-warning)';
        } else {
            counter.style.color = 'var(--color-text-muted)';
        }
    };
    
    messageField.addEventListener('input', updateCounter);
    updateCounter(); // Initial count
};

// Initialize character counter
document.addEventListener('DOMContentLoaded', initializeCharacterCounter);

// Export functions for testing
window.contactForm = {
    validateField,
    isValidEmail,
    showFieldError,
    clearFieldError,
    handleFormSubmission
}; 