// FutureClarity Technologies Website JavaScript
// Handles all interactive features and animations

document.addEventListener('DOMContentLoaded', function() {
    // Safari hero background fix
    fixSafariHeroBackground();
    
    // Initialize all components
    initNavigation();
    initAnimations();
    initFormHandling();
    initScrollEffects();
    initTypingEffect();
    initIframeHandling();
    
    console.log('FutureClarity Technologies website loaded successfully!');
    
    // MOBILE OPTIMIZATION CHECK
    if (window.innerWidth <= 768) {
        console.log('Mobile optimization active - text animations disabled for better performance');
    }
});

// Fix Safari hero background rendering issue
function fixSafariHeroBackground() {
    // Detect Safari browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
        const hero = document.querySelector('.hero');
        if (hero) {
            // Force redraw by temporarily changing and restoring a property
            const originalTransform = hero.style.transform;
            hero.style.transform = 'translateZ(0)';
            
            // Use requestAnimationFrame to ensure the change is applied
            requestAnimationFrame(() => {
                hero.style.transform = originalTransform;
                
                // Also force a repaint by briefly changing opacity
                requestAnimationFrame(() => {
                    const originalOpacity = hero.style.opacity || '1';
                    hero.style.opacity = '0.99';
                    requestAnimationFrame(() => {
                        hero.style.opacity = originalOpacity;
                    });
                });
            });
        }
    }
}

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
    // MOBILE PERFORMANCE: Disable complex animations on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // On mobile, just show elements without complex animations
        const animatedElements = document.querySelectorAll(
            '.service-card, .industry-card, .feature-item, .team-member, .contact-item, .dashboard-mockup'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
        
        // Simple counter animation for mobile
        animateCounters();
        return; // Exit early on mobile
    }
    
    // DESKTOP ONLY: Complex scroll animations
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
                
                if (entry.target.classList.contains('industry-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.2}s`;
                    entry.target.style.animation = 'fadeInUp 0.5s ease-out forwards';
                }
                
                if (entry.target.classList.contains('feature-item')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.15}s`;
                    entry.target.style.animation = 'fadeInRight 0.5s ease-out forwards';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    // Observe elements for animation (DESKTOP ONLY)
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
    
    // Parallax effect DISABLED - was causing glitchy scroll behavior
    // window.addEventListener('scroll', function() {
    //     const scrolled = window.pageYOffset;
    //     const hero = document.querySelector('.hero');
    //     const heroContent = document.querySelector('.hero-content');
    //     
    //     if (hero && heroContent) {
    //         heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    //     }
    // });
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

// Scroll effects - DISABLED TO PREVENT PULLING
function initScrollEffects() {
    // Smooth scrolling for anchor links - DISABLED
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    //     anchor.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         const target = document.querySelector(this.getAttribute('href'));
    //         if (target) {
    //             target.scrollIntoView({
    //                 behavior: 'smooth',
    //                 block: 'start'
    //             });
    //         }
    //     });
    // });
    
    // Progress bar on scroll - DISABLED
    // createScrollProgressBar();
    
    // Active navigation highlighting - DISABLED
    // highlightActiveNavigation();
}

// Create scroll progress bar (DESKTOP ONLY)
function createScrollProgressBar() {
    // MOBILE PERFORMANCE: Disable scroll progress bar on mobile
    if (window.innerWidth <= 768) {
        return;
    }
    
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

// Typing effect for hero section (DESKTOP ONLY)
function initTypingEffect() {
    const gradientText = document.querySelector('.gradient-text');
    if (!gradientText) return;
    
    // DISABLE TYPING EFFECT ON MOBILE TO PREVENT GLITCHES
    if (window.innerWidth <= 768) {
        gradientText.textContent = 'Web Design';
        return;
    }
    
    const words = ['Web Design', 'AI Automation', 'FutureClarity'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        // Double-check window size during animation to prevent mobile glitches
        if (window.innerWidth <= 768) {
            gradientText.textContent = 'Web Design';
            return;
        }
        
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            gradientText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            gradientText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at end of word
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }
    
    typeEffect();
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

// Additional Safari fix on window load
window.addEventListener('load', function() {
    // Safari sometimes needs a second background fix after all resources load
    setTimeout(fixSafariHeroBackground, 100);
});

// Enhanced iframe handling for portfolio with loading states and crash prevention
function initIframeHandling() {
    const iframes = document.querySelectorAll('.iframe-container iframe');
    console.log('Found iframes:', iframes.length);
    
    // Mobile performance optimization: limit concurrent iframe loads
    const isMobile = window.innerWidth <= 768;
    let loadedCount = 0;
    const maxConcurrentLoads = isMobile ? 2 : 4;
    
    iframes.forEach((iframe, index) => {
        const container = iframe.closest('.iframe-container');
        console.log(`Iframe ${index + 1}:`, iframe.src);
        
        // Set initial loading state
        iframe.style.opacity = '0';
        
        // Add loading timeout for slow-loading iframes (reduced for mobile performance)
        const loadingTimeout = setTimeout(() => {
            if (iframe.style.opacity === '0') {
                console.log('Iframe taking too long to load, showing with fade-in:', iframe.src);
                iframe.style.opacity = '1';
                // Hide loading indicator after timeout
                if (container) {
                    container.classList.add('loaded');
                }
            }
        }, 5000); // 5 second timeout (reduced from 10s for mobile performance)
        
        // Handle iframe load success
        iframe.addEventListener('load', function() {
            console.log('Iframe loaded successfully:', this.src);
            clearTimeout(loadingTimeout);
            
            // Optimized delay for mobile performance
            setTimeout(() => {
                this.style.opacity = '1';
                this.setAttribute('data-loaded', 'true');
                
                // Hide loading indicator
                if (container) {
                    container.classList.add('loaded');
                }
            }, 1000); // Reduced to 1 second for better mobile performance
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
        
        // Add intersection observer for lazy loading optimization with mobile performance
        if ('IntersectionObserver' in window && loadedCount < maxConcurrentLoads) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && loadedCount < maxConcurrentLoads) {
                        // Iframe is visible, ensure it loads
                        const iframe = entry.target;
                        if (iframe.src && !iframe.getAttribute('data-loaded')) {
                            console.log('Iframe in viewport, ensuring load:', iframe.src);
                            loadedCount++;
                        }
                        observer.unobserve(iframe);
                    }
                });
            }, { 
                threshold: isMobile ? 0.3 : 0.1, // Higher threshold for mobile
                rootMargin: isMobile ? '50px' : '100px' // Smaller margin for mobile
            });
            
            observer.observe(iframe);
        }
        
        // Memory cleanup for mobile
        if (isMobile) {
            // Add unload listener to clean up resources
            window.addEventListener('beforeunload', () => {
                iframe.src = 'about:blank';
            });
        }
    });
}

// Export functions for testing
window.FutureClarityTechnologiesApp = {
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