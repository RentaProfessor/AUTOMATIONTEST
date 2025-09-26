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
    
    // Ensure proper initial state
    window.addEventListener('load', function() {
        console.log('Page fully loaded, applying final Safari fixes');
        applySafariMobileFixes();
    });
});

// Navigation functionality - Completely rebuilt for Safari mobile
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;
    
    if (!navToggle || !navMenu || !navOverlay) {
        console.error('Navigation elements not found');
        return;
    }
    
    let isMenuOpen = false;
    let scrollPosition = 0;
    
    // Toggle menu function
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Open menu
    function openMenu() {
        if (isMenuOpen) return;
        
        // Store current scroll position
        scrollPosition = window.pageYOffset;
        
        // Prevent body scroll
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
        body.style.width = '100%';
        body.style.overflow = 'hidden';
        
        // Show menu and overlay
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        navToggle.classList.add('active');
        
        isMenuOpen = true;
        console.log('Menu opened');
    }
    
    // Close menu
    function closeMenu() {
        if (!isMenuOpen) return;
        
        // Hide menu and overlay
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Restore body scroll
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
        
        isMenuOpen = false;
        console.log('Menu closed');
    }
    
    // Menu toggle click
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Overlay click to close
    navOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
    });
    
    // Navigation link clicks with smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's an external link (portfolio.html), let it work normally
            if (!href || !href.startsWith('#')) {
                closeMenu();
                return;
            }
            
            // Prevent default for anchor links
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (!targetSection) {
                console.error(`Section not found: ${targetId}`);
                closeMenu();
                return;
            }
            
            // Close menu first
            closeMenu();
            
            // Immediate scroll after menu closes
            setTimeout(() => {
                scrollToSection(targetSection);
            }, 50);
        });
    });
    
    // Escape key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Simple and reliable scroll function
    function scrollToSection(targetSection) {
        console.log(`=== SCROLL DEBUG ===`);
        console.log(`Target section: ${targetSection.id}`);
        
        // Get the absolute position of the target section from the top of the document
        let elementTop = 0;
        let element = targetSection;
        
        // Calculate absolute position from top of document
        do {
            elementTop += element.offsetTop || 0;
            element = element.offsetParent;
        } while (element);
        
        console.log(`Element absolute top: ${elementTop}px`);
        console.log(`Current scroll position: ${window.pageYOffset}px`);
        
        // Simple offset for navbar
        const offset = 100;
        const targetPosition = Math.max(0, elementTop - offset);
        
        console.log(`Target scroll position: ${targetPosition}px`);
        console.log(`Distance to scroll: ${targetPosition - window.pageYOffset}px`);
        
        // Force immediate scroll - no smooth behavior to ensure it works
        window.scrollTo(0, targetPosition);
        
        // Check if it worked
        setTimeout(() => {
            console.log(`Final scroll position: ${window.pageYOffset}px`);
            console.log(`=== END SCROLL DEBUG ===`);
        }, 100);
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        if (isMenuOpen) {
            // Brief delay to let orientation settle
            setTimeout(() => {
                closeMenu();
            }, 100);
        }
    });
    
    console.log('Navigation initialized successfully');
    
    // DEBUG: Add manual test function to window for testing
    window.testScroll = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            console.log(`Manual test scroll to: ${sectionId}`);
            scrollToSection(section);
        } else {
            console.log(`Section not found: ${sectionId}`);
        }
    };
    
    // DEBUG: List all sections found
    console.log('Available sections:');
    ['home', 'services', 'features', 'about', 'contact'].forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            console.log(`✓ Found section: ${id}`);
        } else {
            console.log(`✗ Missing section: ${id}`);
        }
    });
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
        const topPadding = navbarHeight + safeAreaTop + 30; // Slight reduction - 10px less
        const bottomPadding = safeAreaBottom + 30;
        
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

// Legacy smooth scrolling removed - now handled in navigation function

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
