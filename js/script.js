// FutureClarity Automation Website JavaScript
// Handles all interactive features and animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initAnimations();
    initFormHandling();
    initScrollEffects();
    initTypingEffect();
    initIframeHandling();
    
    console.log('FutureClarity Automation website loaded successfully!');
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Close mobile menu if open
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Navbar scroll effect - DISABLED to keep light theme
    // window.addEventListener('scroll', function() {
    //     const navbar = document.querySelector('.navbar');
    //     if (window.scrollY > 50) {
    //         navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    //         navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    //     } else {
    //         navbar.style.background = 'rgba(255, 255, 255, 0.8)';
    //         navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    //     }
    // });
    }
    




// Animation and scroll effects
function initAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Special animations for specific elements
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                }
                
                if (entry.target.classList.contains('industry-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
                
                if (entry.target.classList.contains('feature-item')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.2}s`;
                    entry.target.style.animation = 'fadeInRight 0.7s ease-out forwards';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .industry-card, .feature-item, .team-member, .contact-item, .dashboard-mockup'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Counter animation
    animateCounters();
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const originalText = counter.textContent.trim();
        
        // Explicitly check for "24/7" and other non-numeric text
        if (originalText === '24/7' || originalText.includes('/') || originalText.includes('Free') || isNaN(parseInt(originalText))) {
            // Display text directly without any animation or observer
            counter.textContent = originalText;
            return; // Exit early, no animation
        }
        
        // Only animate if the text is a pure number
        const target = parseInt(originalText);
        if (!isNaN(target) && target > 0) {
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        } else {
            // Fallback: display original text without animation
            counter.textContent = originalText;
        }
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactRequest();
        });
    }
    
    // Add floating labels
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (input && input.type !== 'submit') {
            input.addEventListener('focus', function() {
                group.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!input.value) {
                    group.classList.remove('focused');
                }
            });
        }
    });
}

// Handle contact form submission
function handleContactRequest() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    const data = {};
    
    // Collect form data
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! We\'ll contact you soon.', 'success');
        
        // Reset form
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Track form submission
        trackEvent('contact_form_submitted', data);
        
    }, 1500);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Choose icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'error') icon = 'times-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Choose colors based on type (Future Clarity theme)
    let backgroundColor, borderColor;
    switch(type) {
        case 'success':
            backgroundColor = '#10b981';
            borderColor = '#059669';
            break;
        case 'warning':
            backgroundColor = '#f59e0b';
            borderColor = '#d97706';
            break;
        case 'error':
            backgroundColor = '#ef4444';
            borderColor = '#dc2626';
            break;
        default:
            backgroundColor = '#3b82f6';
            borderColor = '#2563eb';
    }
    
    // Add styles (Future Clarity dark theme)
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: rgba(17, 24, 39, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid ${borderColor};
        border-left: 4px solid ${backgroundColor};
        color: #ffffff;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 380px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        animation: slideInRight 0.4s ease-out;
        transition: all 0.3s ease;
    `;
    
    // Style the icon
    const iconElement = notification.querySelector('i');
    iconElement.style.cssText = `
        color: ${backgroundColor};
        font-size: 16px;
        flex-shrink: 0;
    `;
    
    // Style the close button
    const notificationCloseBtn = notification.querySelector('.notification-close');
    notificationCloseBtn.style.cssText = `
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
    `;
    
    // Add hover effect to close button
    notificationCloseBtn.addEventListener('mouseenter', () => {
        notificationCloseBtn.style.backgroundColor = 'rgba(156, 163, 175, 0.1)';
        notificationCloseBtn.style.color = '#ffffff';
    });
    
    notificationCloseBtn.addEventListener('mouseleave', () => {
        notificationCloseBtn.style.backgroundColor = 'transparent';
        notificationCloseBtn.style.color = '#9ca3af';
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close button click handler
    notificationCloseBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Scroll effects
function initScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Progress bar on scroll
    createScrollProgressBar();
    
    // Active navigation highlighting
    highlightActiveNavigation();
}

// Create scroll progress bar
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Highlight active navigation
function highlightActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Typing effect for hero section
function initTypingEffect() {
    const gradientText = document.querySelector('.gradient-text');
    if (!gradientText) return;
    
    const words = ['Web Design', 'AI Automation', 'Future Clarity'];
    let wordIndex = 1; // Start with second word since first is already displayed
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            gradientText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            gradientText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }
    
    // Start typing effect after 2.5 seconds (1-2 seconds longer)
    setTimeout(typeEffect, 2500);
}

// Event tracking (replace with actual analytics)
function trackEvent(eventName, data = {}) {
    console.log('Event tracked:', eventName, data);
    
    // Example: Google Analytics
    // gtag('event', eventName, data);
    
    // Example: Facebook Pixel
    // fbq('track', eventName, data);
    
    // Example: Custom analytics
    // analytics.track(eventName, data);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization
const debouncedScroll = debounce(() => {
    // Expensive scroll operations
}, 10);

const throttledResize = throttle(() => {
    // Expensive resize operations
}, 100);

window.addEventListener('scroll', debouncedScroll);
window.addEventListener('resize', throttledResize);

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .nav-menu a.active {
        color: var(--primary-color);
    }
    
    .nav-menu a.active::after {
        width: 100%;
    }
    
    .form-group.focused label {
        transform: translateY(-20px);
        font-size: 0.8rem;
        color: var(--primary-color);
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);

// Initialize on DOM ready
preloadResources();

// Enhanced iframe handling for portfolio with loading states
function initIframeHandling() {
    const iframes = document.querySelectorAll('.iframe-container iframe');
    console.log('Found iframes:', iframes.length);
    
    iframes.forEach((iframe, index) => {
        const container = iframe.closest('.iframe-container');
        console.log(`Iframe ${index + 1}:`, iframe.src);
        
        // Set initial loading state
        iframe.style.opacity = '0';
        
        // Add loading timeout for slow-loading iframes
        const loadingTimeout = setTimeout(() => {
            if (iframe.style.opacity === '0') {
                console.log('Iframe taking too long to load, showing with fade-in:', iframe.src);
                iframe.style.opacity = '1';
                // Hide loading indicator after timeout
                if (container) {
                    container.classList.add('loaded');
                }
            }
        }, 10000); // 10 second timeout
        
        // Handle iframe load success
        iframe.addEventListener('load', function() {
            console.log('Iframe loaded successfully:', this.src);
            clearTimeout(loadingTimeout);
            
            // Change loading message to indicate video loading
            if (container) {
                container.classList.add('video-loading');
            }
            
            // Try to detect when video content is ready
            const checkVideoContent = () => {
                try {
                    // Check if iframe has loaded content and videos
                    const iframeDoc = this.contentDocument || this.contentWindow.document;
                    const videos = iframeDoc.querySelectorAll('video');
                    
                    if (videos.length > 0) {
                        console.log(`Found ${videos.length} videos, checking readiness...`);
                        // If videos exist, wait for them to be ready
                        let videosReady = 0;
                        videos.forEach(video => {
                            if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                                videosReady++;
                            }
                        });
                        
                        if (videosReady === videos.length) {
                            console.log('All videos ready, showing iframe:', this.src);
                            this.style.opacity = '1';
                            this.setAttribute('data-loaded', 'true');
                            if (container) {
                                container.classList.remove('video-loading');
                                container.classList.add('loaded');
                            }
                            return;
                        } else {
                            console.log(`Videos still loading: ${videosReady}/${videos.length} ready`);
                        }
                    }
                } catch (e) {
                    // Cross-origin restrictions prevent access, fall back to delay
                    console.log('Cannot access iframe content (cross-origin), using delay fallback:', this.src);
                }
                
                // Fallback: Extended delay for video content to fully render
                setTimeout(() => {
                    console.log('Showing iframe after extended delay for video content:', this.src);
                    this.style.opacity = '1';
                    this.setAttribute('data-loaded', 'true');
                    
                    // Hide loading indicator after additional delay
                    if (container) {
                        container.classList.remove('video-loading');
                        container.classList.add('loaded');
                    }
                }, 5000); // 5 second delay to allow video content to render
            };
            
            // Check after delays to allow video loading
            setTimeout(checkVideoContent, 2000);
        });
        
        // Handle iframe errors with fallback
        iframe.addEventListener('error', function() {
            console.warn('Iframe failed to load:', this.src);
            clearTimeout(loadingTimeout);
            
            // Show fallback content or error message
            if (container) {
                container.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); color: #666; flex-direction: column; gap: 10px; border-radius: 10px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ffc107;"></i>
                        <p style="margin: 0; font-weight: 500;">Preview Unavailable</p>
                        <a href="${this.src}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500; padding: 8px 16px; border: 2px solid var(--primary-color); border-radius: 6px; transition: all 0.3s ease;">
                            View Live Site <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                `;
            }
        });
        
        // Add intersection observer for lazy loading optimization
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Iframe is visible, ensure it loads
                        const iframe = entry.target;
                        if (iframe.src && !iframe.getAttribute('data-loaded')) {
                            console.log('Iframe in viewport, ensuring load:', iframe.src);
                        }
                        observer.unobserve(iframe);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(iframe);
        }
    });
}

// Export functions for testing
window.FutureClarityApp = {
    trackEvent,
    showNotification,
    initChatbot,
    initNavigation,
    initAnimations,
    initFormHandling,
    initScrollEffects,
    initTypingEffect,
    initIframeHandling
}; 