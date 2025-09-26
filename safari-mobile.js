// Safari Mobile Optimized JavaScript - Minimal and reliable

// IMMEDIATE Safari viewport fix - runs before DOM load
(function() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                     /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isMobile = window.innerWidth <= 768;
    
    if (isSafari && isMobile) {
        // Fix viewport immediately - allow user scaling to zoom out if needed
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.25, user-scalable=yes, viewport-fit=cover');
        }
        
        // Reset any zoom issues
        document.documentElement.style.webkitTextSizeAdjust = '100%';
        document.documentElement.style.textSizeAdjust = '100%';
        
        // Force page to top on load
        window.scrollTo(0, 0);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    console.log('Safari Mobile JS loaded');
    
    // Initialize all functionality
    initNavigation();
    initSafariMobileFixes();
    initSmoothScrolling();
    
    // Ensure proper initial state
    window.addEventListener('load', function() {
        console.log('Page fully loaded, applying final Safari fixes');
        applySafariMobileFixes();
    });
});

// Navigation functionality - Safari mobile optimized
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (!navToggle || !navMenu) return;
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
    
    function openMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Prevent scrolling behind menu on Safari mobile
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

// Safari mobile specific fixes
function initSafariMobileFixes() {
    // Detect Safari mobile
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                     /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isMobile = window.innerWidth <= 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isSafari && isMobile) {
        console.log('Safari mobile detected, applying fixes');
        applySafariMobileFixes();
        
        // Apply fixes on resize and orientation change
        window.addEventListener('resize', debounce(applySafariMobileFixes, 250));
        window.addEventListener('orientationchange', function() {
            setTimeout(applySafariMobileFixes, 500);
        });
    }
}

function applySafariMobileFixes() {
    // Reset text size adjustment
    document.documentElement.style.webkitTextSizeAdjust = '100%';
    document.documentElement.style.textSizeAdjust = '100%';
    
    if (document.body) {
        document.body.style.webkitTextSizeAdjust = '100%';
        document.body.style.textSizeAdjust = '100%';
    }
    
    // Fix viewport height for Safari mobile
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Ensure navbar is visible and properly positioned
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.right = '0';
        navbar.style.zIndex = '9999';
        navbar.style.width = '100%';
        navbar.style.display = 'block';
        navbar.style.visibility = 'visible';
    }
    
    // Ensure hero section proper height and spacing
    const hero = document.querySelector('.hero');
    if (hero) {
        // Use actual viewport height instead of 100vh
        hero.style.minHeight = `${window.innerHeight}px`;
        hero.style.position = 'relative';
        hero.style.overflow = 'visible';
    }
    
    // Fix safe area insets
    const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top')) || 0;
    const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom')) || 0;
    
    // Update navbar height with safe area
    if (navbar) {
        navbar.style.paddingTop = `${safeAreaTop}px`;
        navbar.style.height = `${70 + safeAreaTop}px`;
    }
    
    // Update hero padding - proper spacing to fill screen nicely
    if (hero) {
        const navbarHeight = 70; // Base navbar height
        const topPadding = navbarHeight + safeAreaTop + 80; // Good spacing for full screen
        const bottomPadding = safeAreaBottom + 60;
        
        hero.style.paddingTop = `${topPadding}px`;
        hero.style.paddingBottom = `${bottomPadding}px`;
        hero.style.marginTop = '0';
    }
    
    // Fix hero content to ensure it's visible
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.position = 'relative';
        heroContent.style.zIndex = '2';
        heroContent.style.visibility = 'visible';
        heroContent.style.opacity = '1';
    }
    
    // Prevent zoom on input focus (Safari mobile specific issue)
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.style.fontSize = '16px';
    });
    
    // Force scroll to top to ensure navbar is accessible
    window.scrollTo(0, 0);
    
    console.log('Safari mobile fixes applied - navbar accessible, viewport fixed');
}

// Smooth scrolling for anchor links - Safari compatible
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            // Calculate offset for fixed navbar
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top')) || 0;
            const offset = navbarHeight + safeAreaTop + 20; // 20px buffer
            
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            // Use native smooth scrolling with fallback
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            } else {
                // Fallback for older Safari versions
                animateScrollTo(Math.max(0, targetPosition), 600);
            }
        });
    });
}

// Fallback smooth scroll animation for older Safari
function animateScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;
    
    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
        
        window.scrollTo(0, startY + distance * ease);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Utility function for debouncing
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

// Form handling - Safari mobile optimized
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Re-enable after delay (in case of form submission issues)
                setTimeout(() => {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
        
        // Prevent zoom on input focus for Safari mobile
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    // Temporarily disable viewport scaling to prevent zoom
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        const originalContent = viewport.getAttribute('content');
                        viewport.setAttribute('content', originalContent + ', user-scalable=no');
                        
                        // Restore after blur
                        input.addEventListener('blur', function() {
                            viewport.setAttribute('content', originalContent);
                        }, { once: true });
                    }
                }
            });
        });
    }
});

// Handle Safari mobile keyboard appearance
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        // Detect if keyboard is showing (height change indicates keyboard)
        const currentHeight = window.innerHeight;
        const isKeyboardVisible = currentHeight < (window.screen.height * 0.75);
        
        if (isKeyboardVisible) {
            document.body.classList.add('keyboard-visible');
        } else {
            document.body.classList.remove('keyboard-visible');
        }
    }
});

// Prevent layout shift during page load
window.addEventListener('load', function() {
    // Ensure all images are loaded and positioned correctly
    const images = document.querySelectorAll('img');
    let imagesLoaded = 0;
    
    if (images.length === 0) {
        finalizePage();
        return;
    }
    
    images.forEach(img => {
        if (img.complete) {
            imagesLoaded++;
        } else {
            img.addEventListener('load', function() {
                imagesLoaded++;
                if (imagesLoaded === images.length) {
                    finalizePage();
                }
            });
            img.addEventListener('error', function() {
                imagesLoaded++;
                if (imagesLoaded === images.length) {
                    finalizePage();
                }
            });
        }
    });
    
    if (imagesLoaded === images.length) {
        finalizePage();
    }
});

function finalizePage() {
    // Final Safari mobile adjustments
    applySafariMobileFixes();
    
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('page-loaded');
    
    console.log('Page finalized for Safari mobile');
}

// Handle Safari mobile scroll performance
if (window.innerWidth <= 768) {
    let ticking = false;
    
    function updateScrollEffects() {
        // Minimal scroll effects for performance
        const scrollY = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            if (scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }, { passive: true });
}

// Error handling for Safari mobile
window.addEventListener('error', function(e) {
    console.log('Error caught:', e.error);
    // Continue gracefully without breaking functionality
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.log('Unhandled promise rejection:', e.reason);
    e.preventDefault(); // Prevent default browser error handling
});

console.log('Safari Mobile JavaScript initialized successfully');
