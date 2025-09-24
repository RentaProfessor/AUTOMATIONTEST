// FutureClarity Technologies Website JavaScript
// Handles all interactive features and animations

// IMMEDIATE Safari background fix - enhanced for URL re-entry scenarios
(function() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                     /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isSafari) {
        console.log('Immediate Safari background fix initiated');
        
        // Detect navigation type to handle URL re-entry vs reload differently
        const navigationType = performance.getEntriesByType('navigation')[0]?.type || 'navigate';
        const isUrlReentry = navigationType === 'navigate' && !document.referrer;
        const isReload = navigationType === 'reload';
        
        console.log('Safari navigation type:', navigationType, 'URL re-entry:', isUrlReentry, 'Reload:', isReload);
        
        // Function to apply immediate CSS fixes - enhanced for URL re-entry
        const applyImmediateFix = () => {
            const style = document.createElement('style');
            style.id = 'safari-emergency-fix';
            style.textContent = `
                .hero {
                    background-color: #f5f7fa !important;
                    background-image: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    background: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    -webkit-transform: translateZ(0) !important;
                    transform: translateZ(0) !important;
                    will-change: background !important;
                }
            `;
            
            // Insert at the very end of head to override everything
            if (document.head) {
                document.head.appendChild(style);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.head.appendChild(style);
                });
            }
        };
        
        // Apply immediately if head exists
        if (document.head) {
            applyImmediateFix();
        }
        
        // Also apply when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyImmediateFix);
        } else {
            applyImmediateFix();
        }
        
        // Enhanced hero element checking for URL re-entry
        const checkForHero = () => {
            const hero = document.querySelector('.hero');
            if (hero) {
                // For URL re-entry, apply more aggressive fixes
                if (isUrlReentry) {
                    console.log('Applying enhanced URL re-entry fix');
                    hero.style.cssText += `
                        background-color: #f5f7fa !important;
                        background-image: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                        background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                        background: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                        -webkit-transform: translateZ(0) scale(1.0001) !important;
                        transform: translateZ(0) scale(1.0001) !important;
                        -webkit-backface-visibility: hidden !important;
                        backface-visibility: hidden !important;
                        isolation: isolate !important;
                        contain: layout style paint !important;
                    `;
                } else {
                    hero.style.cssText += `
                        background: #f5f7fa !important;
                        background: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    `;
                }
                console.log('Immediate Safari hero fix applied');
            } else {
                setTimeout(checkForHero, 10);
            }
        };
        
        checkForHero();
        
        // Additional fix specifically for URL re-entry after a delay
        if (isUrlReentry) {
            setTimeout(() => {
                const hero = document.querySelector('.hero');
                if (hero) {
                    console.log('Applying delayed URL re-entry background fix');
                    const computedStyle = window.getComputedStyle(hero);
                    const bgColor = computedStyle.backgroundColor;
                    
                    // Check if background is problematic after URL re-entry
                    if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || 
                        (bgColor.includes('rgb') && bgColor.match(/\d+/g)?.every(val => parseInt(val) < 200))) {
                        
                        // Nuclear option for URL re-entry
                        hero.style.cssText = `
                            background-color: #f5f7fa !important;
                            background-image: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                            background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                            background: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                            padding: 140px 0 80px !important;
                            position: relative !important;
                            overflow: hidden !important;
                            margin-top: 0 !important;
                            -webkit-transform: translateZ(0) !important;
                            transform: translateZ(0) !important;
                            -webkit-backface-visibility: hidden !important;
                            backface-visibility: hidden !important;
                            will-change: background !important;
                        `;
                        console.log('Nuclear URL re-entry fix applied');
                    }
                }
            }, 250);
        }
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Chrome mobile zoom fix - must be first
    fixChromeZoom();
    
    // Chrome mobile viewport height fix
    fixChromeViewportHeight();
    
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

// Make Chrome mobile look exactly like Safari mobile
function fixChromeZoom() {
    // Check if it's Chrome mobile
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isMobile = window.innerWidth <= 768;
    
    if (isChrome && isMobile) {
        // Simple function to match Safari appearance
        function matchSafari() {
            // Force same zoom as Safari
            document.body.style.zoom = '1';
            document.documentElement.style.zoom = '1';
            
            // Disable any Chrome scaling
            document.body.style.webkitTextSizeAdjust = '100%';
            document.documentElement.style.webkitTextSizeAdjust = '100%';
            
            // Reset positioning to match Safari
            window.scrollTo(0, 0);
        }
        
        // Apply immediately
        matchSafari();
        
        // Apply after a brief delay to catch Chrome's defaults
        setTimeout(matchSafari, 100);
        
        // Prevent zoom gestures to maintain Safari-like behavior
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('gesturechange', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('gestureend', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        console.log('Chrome mobile matched to Safari appearance');
    }
}

// Fix Chrome mobile viewport height issues
function fixChromeViewportHeight() {
    // Check if it's Chrome mobile
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isMobile = window.innerWidth <= 768;
    
    if (isChrome && isMobile) {
        function setViewportHeight() {
            // Get the actual viewport height
            const vh = window.innerHeight * 0.01;
            // Set the CSS custom property
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Additional Chrome fixes
            const hero = document.querySelector('.hero');
            const navbar = document.querySelector('.navbar');
            
            if (hero && navbar) {
                // Ensure hero starts after navbar
                const navHeight = navbar.offsetHeight;
                hero.style.marginTop = '0px';
                hero.style.paddingTop = '0px';
                
                // Force Chrome to recalculate layout
                hero.style.height = `calc(var(--vh, 1vh) * 100 + 80px)`;
                
                // Force repaint
                hero.offsetHeight;
            }
        }
        
        // Set initial viewport height
        setViewportHeight();
        
        // Update on resize (for when Chrome address bar appears/disappears) - DEBOUNCED
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setViewportHeight, 250); // Increased delay to reduce glitching
        });
        
        // Update on orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(setViewportHeight, 600);
        });
        
        // Update on scroll (Chrome address bar behavior) - REDUCED FREQUENCY
        let scrollTimeout;
        let lastScrollTime = 0;
        window.addEventListener('scroll', function() {
            const now = Date.now();
            if (now - lastScrollTime > 300) { // Throttle to max once per 300ms
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(setViewportHeight, 400);
                lastScrollTime = now;
            }
        }, { passive: true });
        
        console.log('Chrome mobile viewport height fix applied');
    }
}

// ULTIMATE Safari hero background fix - handles all reload scenarios including URL re-entry
function fixSafariHeroBackground() {
    // Enhanced Safari detection (including Safari on iOS and macOS)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                     /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isSafari) {
        const hero = document.querySelector('.hero');
        if (hero) {
            console.log('Applying ULTIMATE Safari hero background fix...');
            
            // Detect if this is a URL re-entry scenario
            const navigationType = performance.getEntriesByType('navigation')[0]?.type || 'navigate';
            const isUrlReentry = navigationType === 'navigate' && !document.referrer;
            
            console.log('Safari fix - Navigation type:', navigationType, 'URL re-entry:', isUrlReentry);
            
            // CRITICAL: Completely reset background properties first
            hero.style.removeProperty('background');
            hero.style.removeProperty('background-image');
            hero.style.removeProperty('background-color');
            
            // Force immediate layout recalculation
            hero.offsetHeight;
            hero.offsetWidth;
            
            // Method 1: AGGRESSIVE background re-application with every Safari prefix
            const applyBackground = () => {
                // Set solid fallback first
                hero.style.setProperty('background-color', '#f5f7fa', 'important');
                
                // Apply all possible gradient formats for maximum Safari compatibility
                hero.style.setProperty('background-image', '-webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 'important');
                hero.style.setProperty('background-image', '-webkit-gradient(linear, left top, right bottom, from(#f5f7fa), to(#c3cfe2))', 'important');
                hero.style.setProperty('background', '-webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 'important');
                hero.style.setProperty('background', 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 'important');
                
                // Enhanced transform for URL re-entry scenarios
                if (isUrlReentry) {
                    hero.style.setProperty('-webkit-transform', 'translateZ(0) scale(1.0001)', 'important');
                    hero.style.setProperty('transform', 'translateZ(0) scale(1.0001)', 'important');
                } else {
                    hero.style.setProperty('-webkit-transform', 'translateZ(0)', 'important');
                    hero.style.setProperty('transform', 'translateZ(0)', 'important');
                }
                
                // Force Safari-specific rendering properties
                hero.style.setProperty('-webkit-backface-visibility', 'hidden', 'important');
                hero.style.setProperty('backface-visibility', 'hidden', 'important');
                hero.style.setProperty('-webkit-transform-style', 'preserve-3d', 'important');
                hero.style.setProperty('transform-style', 'preserve-3d', 'important');
                
                // Additional Safari background fix properties
                hero.style.setProperty('isolation', 'isolate', 'important');
                hero.style.setProperty('contain', 'layout style paint', 'important');
                hero.style.setProperty('will-change', 'background', 'important');
                
                console.log('Safari background properties applied (URL re-entry:', isUrlReentry, ')');
            };
            
            // Apply immediately
            applyBackground();
            
            // Method 2: Multiple timed applications for different Safari reload scenarios
            requestAnimationFrame(() => {
                applyBackground();
                
                // Force multiple repaints with different techniques
                let repaintCount = 0;
                const maxRepaints = 5;
                
                function aggressiveRepaint() {
                    if (repaintCount < maxRepaints) {
                        // Technique 1: Opacity flickering
                        const currentOpacity = getComputedStyle(hero).opacity;
                        hero.style.opacity = repaintCount % 2 === 0 ? '0.9999' : '1';
                        
                        // Technique 2: Transform nudging
                        hero.style.transform = `translateZ(0) translateY(${repaintCount % 2}px)`;
                        
                        repaintCount++;
                        requestAnimationFrame(() => {
                            hero.style.opacity = currentOpacity;
                            hero.style.transform = 'translateZ(0)';
                            
                            if (repaintCount < maxRepaints) {
                                setTimeout(aggressiveRepaint, 20);
                            }
                        });
                    }
                }
                
                aggressiveRepaint();
            });
            
            // Method 3: Delayed verification and re-application
            setTimeout(() => {
                const computedStyle = window.getComputedStyle(hero);
                const bgColor = computedStyle.backgroundColor;
                const bgImage = computedStyle.backgroundImage;
                
                // Check if background is still problematic
                const isBackgroundDark = bgColor.includes('rgb') && 
                    bgColor.match(/\d+/g)?.every(val => parseInt(val) < 200);
                
                const isGradientMissing = !bgImage || bgImage === 'none' || !bgImage.includes('gradient');
                
                if (isBackgroundDark || isGradientMissing) {
                    console.log('Safari background still problematic, applying emergency fix');
                    applyBackground();
                    
                    // Emergency DOM manipulation
                    hero.style.cssText += `
                        background: #f5f7fa !important;
                        background: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    `;
                }
            }, 300);
            
            // Method 4: Extended delayed fix for slow Safari scenarios
            setTimeout(() => {
                applyBackground();
                console.log('Final Safari background verification applied');
            }, 1000);
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

// Create scroll progress bar - COMPLETELY DISABLED
function createScrollProgressBar() {
    // DISABLED - was causing scroll glitches
    return;
}

// Highlight active navigation - COMPLETELY DISABLED
function highlightActiveNavigation() {
    // DISABLED - was causing scroll glitches
    return;
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

// Performance optimization - SCROLL DISABLED
const debouncedScroll = debounce(() => {
    // DISABLED - was causing scroll glitches
}, 10);

const throttledResize = throttle(() => {
    // Expensive resize operations
}, 100);

// DISABLED scroll listener - was causing parallax glitches
// window.addEventListener('scroll', debouncedScroll);
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

// ULTIMATE Safari reload fix - handles all window load scenarios
window.addEventListener('load', function() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                     /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isSafari) {
        console.log('Window loaded - applying ULTIMATE Safari reload fixes');
        
        // Immediate fix on load
        fixSafariHeroBackground();
        
        // Progressive fixes for different Safari reload scenarios - enhanced for URL re-entry
        const navigationType = performance.getEntriesByType('navigation')[0]?.type || 'navigate';
        const isUrlReentry = navigationType === 'navigate' && !document.referrer;
        
        // More aggressive timing for URL re-entry scenarios
        const timeouts = isUrlReentry ? 
            [25, 50, 100, 150, 200, 300, 400, 500, 750, 1000, 1250, 1500, 2000, 2500] :
            [50, 100, 200, 300, 500, 750, 1000, 1500, 2000];
        
        console.log('Safari load fix - URL re-entry detected:', isUrlReentry, 'Using', timeouts.length, 'timeout intervals');
        
        timeouts.forEach((delay, index) => {
            setTimeout(() => {
                const hero = document.querySelector('.hero');
                if (hero) {
                    const computedStyle = window.getComputedStyle(hero);
                    const bgColor = computedStyle.backgroundColor;
                    const bgImage = computedStyle.backgroundImage;
                    
                    // Check multiple conditions for problematic backgrounds
                    const isBackgroundDark = bgColor.includes('rgb') && 
                        bgColor.match(/\d+/g)?.every(val => parseInt(val) < 200);
                    
                    const isGradientMissing = !bgImage || bgImage === 'none' || !bgImage.includes('gradient');
                    
                    const isBackgroundGray = bgColor.includes('128') || bgColor.includes('169') || 
                                           bgColor.includes('136') || bgColor.includes('gray');
                    
                    if (isBackgroundDark || isGradientMissing || isBackgroundGray) {
                        console.log(`Safari background still problematic at ${delay}ms, applying fix #${index + 1}`);
                        fixSafariHeroBackground();
                        
                        // Emergency CSS override for persistent issues
                        if (delay >= 500) {
                            hero.style.cssText += `
                                background-color: #f5f7fa !important;
                                background-image: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                                background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                                background: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                            `;
                        }
                    }
                }
            }, delay);
        });
        
        // Final verification after all attempts
        setTimeout(() => {
            const hero = document.querySelector('.hero');
            if (hero) {
                const computedStyle = window.getComputedStyle(hero);
                const bgColor = computedStyle.backgroundColor;
                console.log('Final Safari background check:', bgColor);
                
                if (bgColor.includes('rgb') && bgColor.match(/\d+/g)?.every(val => parseInt(val) < 200)) {
                    console.warn('Safari background still dark after all attempts, applying nuclear option');
                    
                    // Nuclear option: Replace the entire hero element's background via DOM
                    hero.removeAttribute('style');
                    hero.style.cssText = `
                        background: #f5f7fa !important;
                        background: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                        background-color: #f5f7fa !important;
                        background-image: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                        background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    `;
                }
            }
        }, 3000);
    }
});

// Emergency Safari fix for page visibility changes (handles reload edge cases)
if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(fixSafariHeroBackground, 50);
        }
    });
}

// SAFARI FULLSCREEN BACKGROUND FIX - handles the specific fullscreen dark gray issue
(function() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                     /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isSafari) {
        console.log('Safari fullscreen monitoring initialized');
        
        // Function to apply aggressive fullscreen background fix
        const applyFullscreenFix = () => {
            const hero = document.querySelector('.hero');
            if (hero) {
                console.log('Applying Safari fullscreen background fix');
                
                // CRITICAL: Force background re-render for fullscreen mode
                hero.style.cssText += `
                    background-color: #f5f7fa !important;
                    background-image: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    background: -webkit-linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    -webkit-transform: translateZ(0) scale(1.0001) !important;
                    transform: translateZ(0) scale(1.0001) !important;
                    will-change: background, transform !important;
                `;
                
                // Force multiple repaints for fullscreen
                let repaintCount = 0;
                const fullscreenRepaint = () => {
                    if (repaintCount < 3) {
                        hero.style.transform = `translateZ(0) scale(${1 + (repaintCount * 0.0001)})`;
                        repaintCount++;
                        requestAnimationFrame(() => {
                            hero.style.transform = 'translateZ(0) scale(1.0001)';
                            if (repaintCount < 3) {
                                setTimeout(fullscreenRepaint, 50);
                            }
                        });
                    }
                };
                fullscreenRepaint();
            }
        };
        
        // Monitor fullscreen changes
        document.addEventListener('fullscreenchange', function() {
            console.log('Fullscreen change detected');
            setTimeout(applyFullscreenFix, 100);
            setTimeout(applyFullscreenFix, 300);
            setTimeout(applyFullscreenFix, 600);
        });
        
        document.addEventListener('webkitfullscreenchange', function() {
            console.log('WebKit fullscreen change detected');
            setTimeout(applyFullscreenFix, 100);
            setTimeout(applyFullscreenFix, 300);
            setTimeout(applyFullscreenFix, 600);
        });
        
        // Monitor window resize (fullscreen triggers this)
        let fullscreenResizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(fullscreenResizeTimeout);
            fullscreenResizeTimeout = setTimeout(() => {
                // Check if we're potentially in fullscreen
                if (window.innerHeight === screen.height || 
                    Math.abs(window.innerHeight - screen.height) < 100) {
                    console.log('Potential fullscreen detected via resize');
                    applyFullscreenFix();
                }
            }, 200);
        });
        
        // Periodic check for fullscreen state
        setInterval(() => {
            if (document.fullscreenElement || document.webkitFullscreenElement ||
                window.innerHeight === screen.height) {
                const hero = document.querySelector('.hero');
                if (hero) {
                    const computedStyle = window.getComputedStyle(hero);
                    const bgColor = computedStyle.backgroundColor;
                    
                    // Check if background is dark in fullscreen
                    if (bgColor.includes('rgb') && bgColor.match(/\d+/g)?.every(val => parseInt(val) < 200)) {
                        console.log('Dark background detected in fullscreen, fixing');
                        applyFullscreenFix();
                    }
                }
            }
        }, 2000);
        
        // Apply fix when entering fullscreen programmatically
        const originalRequestFullscreen = Element.prototype.requestFullscreen;
        if (originalRequestFullscreen) {
            Element.prototype.requestFullscreen = function(...args) {
                const result = originalRequestFullscreen.apply(this, args);
                setTimeout(applyFullscreenFix, 500);
                return result;
            };
        }
        
        // Apply fix when entering webkit fullscreen
        const originalWebkitRequestFullscreen = Element.prototype.webkitRequestFullscreen;
        if (originalWebkitRequestFullscreen) {
            Element.prototype.webkitRequestFullscreen = function(...args) {
                const result = originalWebkitRequestFullscreen.apply(this, args);
                setTimeout(applyFullscreenFix, 500);
                return result;
            };
        }
    }
})();

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
        
        // MOBILE DESKTOP VIEW ENFORCEMENT - PREVENT RELOADS + VIDEO SUPPORT
        if (isMobile && !iframe.getAttribute('data-mobile-processed')) {
            // Check if desktop parameters are already present to avoid unnecessary reloads
            const currentUrl = new URL(iframe.src);
            const hasDesktopParams = currentUrl.searchParams.has('desktop') && 
                                   currentUrl.searchParams.has('force_desktop');
            
            // Only modify URL if desktop parameters are missing
            if (!hasDesktopParams) {
                console.log('Adding desktop and video parameters to iframe:', iframe.src);
                currentUrl.searchParams.set('desktop', '1');
                currentUrl.searchParams.set('mobile', '0');
                currentUrl.searchParams.set('width', '1200');
                currentUrl.searchParams.set('viewport', '1200x800');
                currentUrl.searchParams.set('force_desktop', '1');
                
                // Add mobile video support parameters - NO AUTOPLAY to prevent pause button issue
                currentUrl.searchParams.set('autoplay', '0');
                currentUrl.searchParams.set('muted', '1');
                currentUrl.searchParams.set('playsinline', '1');
                currentUrl.searchParams.set('controls', '1');
                currentUrl.searchParams.set('preload', 'metadata');
                
                // Update iframe src only if parameters were missing
                iframe.src = currentUrl.toString();
            }
            
            // ENHANCED: Mobile video playback attributes
            iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; accelerometer; gyroscope; microphone; camera; midi; encrypted-media');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('webkitallowfullscreen', 'true');
            iframe.setAttribute('mozallowfullscreen', 'true');
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-presentation allow-top-navigation');
            
            // Apply mobile-specific iframe attributes for desktop view (non-reloading)
            iframe.setAttribute('data-mobile-desktop', 'true');
            iframe.setAttribute('data-mobile-processed', 'true'); // Prevent reprocessing
            iframe.style.setProperty('width', '400%', 'important');
            iframe.style.setProperty('height', '400%', 'important');
            iframe.style.setProperty('transform', 'scale(0.25)', 'important');
            iframe.style.setProperty('transform-origin', 'top left', 'important');
            iframe.style.setProperty('min-width', '1200px', 'important');
            iframe.style.setProperty('min-height', '800px', 'important');
            
            console.log('Mobile desktop view with video support configured for iframe');
        }
        
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
            
            // MOBILE: Enhanced video support after iframe load
            if (isMobile && this.getAttribute('data-mobile-desktop')) {
                // Keep pointer events disabled for scaling but enable for overlays
                this.style.setProperty('pointer-events', 'none', 'important');
                
                // Add mobile video interaction support
                setTimeout(() => {
                    try {
                        // Send message to iframe for mobile video optimization - NO AUTOPLAY
                        this.contentWindow?.postMessage({
                            type: 'mobile_video_optimization',
                            settings: {
                                autoplay: false,
                                muted: true,
                                playsinline: true,
                                controls: true,
                                preload: 'metadata',
                                paused: true
                            }
                        }, '*');
                        console.log('Mobile video optimization message sent to iframe');
                    } catch (e) {
                        console.log('Cross-origin iframe - video optimization message not sent');
                    }
                }, 500);
                
                console.log('Mobile iframe with video support configured after load');
            }
            
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
                        <a href="${this.src.split('?')[0]}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500; padding: 8px 16px; border: 2px solid var(--primary-color); border-radius: 6px; transition: all 0.3s ease;">
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
        
        // MOBILE VIDEO INTERACTION FIX - Enable video controls on mobile
        if (isMobile) {
            // Add tap interaction for video controls on mobile
            container.addEventListener('touchstart', function(e) {
                if (iframe.getAttribute('data-mobile-desktop')) {
                    console.log('Mobile tap detected on iframe container');
                    
                    // Temporarily enable pointer events for interaction
                    iframe.style.setProperty('pointer-events', 'auto', 'important');
                    
                    // Re-disable after a short delay
                    setTimeout(() => {
                        iframe.style.setProperty('pointer-events', 'none', 'important');
                    }, 3000); // 3 seconds to allow for video interaction
                }
            }, { passive: true });
            
            // Add touch interaction specifically for video areas
            container.addEventListener('touchend', function(e) {
                if (iframe.getAttribute('data-mobile-desktop')) {
                    console.log('Mobile touch end detected - enabling video interaction');
                    
                    // Enable pointer events for a longer period for video interaction
                    iframe.style.setProperty('pointer-events', 'auto', 'important');
                    
                    try {
                        // Send more comprehensive touch event to iframe for video controls
                        iframe.contentWindow?.postMessage({
                            type: 'mobile_touch_event',
                            action: 'touch_end',
                            x: e.changedTouches[0].clientX,
                            y: e.changedTouches[0].clientY,
                            timestamp: Date.now(),
                            videoAction: 'toggle_play_pause'
                        }, '*');
                        
                        // Also send a focus event to help with video interaction
                        iframe.contentWindow?.postMessage({
                            type: 'mobile_video_focus',
                            action: 'enable_interaction'
                        }, '*');
                        
                        console.log('Mobile video interaction messages sent');
                    } catch (err) {
                        console.log('Cross-origin iframe - touch event not sent');
                    }
                    
                    // Keep pointer events enabled longer for video interaction
                    setTimeout(() => {
                        iframe.style.setProperty('pointer-events', 'none', 'important');
                        console.log('Mobile iframe pointer events disabled after extended interaction period');
                    }, 5000); // Extended to 5 seconds for better video control access
                }
            }, { passive: true });
            
            // Memory cleanup for mobile
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