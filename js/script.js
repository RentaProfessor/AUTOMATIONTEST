// FutureClarity Technologies Website JavaScript
// Handles all interactive features and animations

// IMMEDIATE Mobile gradient text fix AND hero padding fix - runs before any other code
(function() {
    // Fix gradient text flashing on mobile immediately
    const isMobile = window.innerWidth <= 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     ('ontouchstart' in window) ||
                     (navigator.maxTouchPoints > 0);
    
    if (isMobile) {
        // Set up a mutation observer to catch the gradient text element as soon as it's added
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const gradientText = document.querySelector('.gradient-text');
                    const heroContent = document.querySelector('.hero-content');
                    
                    if (gradientText) {
                        // Immediately fix the gradient text for mobile
                        gradientText.textContent = 'Web Design';
                        gradientText.style.opacity = '1';
                        gradientText.style.visibility = 'visible';
                        gradientText.style.transform = 'none';
                        gradientText.style.animation = 'none';
                        gradientText.style.transition = 'none';
                        gradientText.style.willChange = 'auto';
                    }
                    
                    if (heroContent) {
                        // CRITICAL: Immediately disable ALL animations and fix positioning to prevent padding glitch
                        heroContent.style.opacity = '1';
                        heroContent.style.visibility = 'visible';
                        heroContent.style.transform = 'none';
                        heroContent.style.webkitTransform = 'none';
                        heroContent.style.animation = 'none';
                        heroContent.style.webkitAnimation = 'none';
                        heroContent.style.transition = 'none';
                        heroContent.style.webkitTransition = 'none';
                        heroContent.style.willChange = 'auto';
                        heroContent.style.position = 'static';
                        heroContent.style.display = 'block';
                        heroContent.style.animationName = 'none';
                        heroContent.style.animationDuration = '0s';
                        heroContent.style.animationDelay = '0s';
                        heroContent.style.padding = '0';
                        heroContent.style.margin = '0 auto';
                    }
                    
                    // Stop observing once we've fixed both elements
                    if (gradientText && heroContent) {
                        observer.disconnect();
                    }
                }
            });
        });
        
        // Start observing
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
        
        // Also try to fix immediately if the element already exists
        setTimeout(() => {
            const gradientText = document.querySelector('.gradient-text');
            const heroContent = document.querySelector('.hero-content');
            
            if (gradientText) {
                gradientText.textContent = 'Web Design';
                gradientText.style.opacity = '1';
                gradientText.style.visibility = 'visible';
                gradientText.style.transform = 'none';
                gradientText.style.animation = 'none';
                gradientText.style.transition = 'none';
                gradientText.style.willChange = 'auto';
            }
            
            // CRITICAL: Also fix hero content to prevent layout shift and padding glitch
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.visibility = 'visible';
                heroContent.style.transform = 'none';
                heroContent.style.webkitTransform = 'none';
                heroContent.style.animation = 'none';
                heroContent.style.webkitAnimation = 'none';
                heroContent.style.transition = 'none';
                heroContent.style.webkitTransition = 'none';
                heroContent.style.willChange = 'auto';
                heroContent.style.position = 'static';
                heroContent.style.display = 'block';
                heroContent.style.animationName = 'none';
                heroContent.style.animationDuration = '0s';
                heroContent.style.animationDelay = '0s';
                heroContent.style.padding = '0';
                heroContent.style.margin = '0 auto';
            }
        }, 0);
    }
})();

// IMMEDIATE Portfolio page white overlay fix - runs before any other code
(function() {
    // Check if this is the portfolio page
    const isPortfolioPage = document.body.classList.contains('portfolio-page') || 
                           window.location.pathname.includes('portfolio') ||
                           document.querySelector('#portfolio-hero');
    
    if (isPortfolioPage) {
        console.log('Immediate portfolio page white overlay fix initiated');
        
        // Apply immediate CSS fix to prevent white overlay
        const style = document.createElement('style');
        style.id = 'portfolio-immediate-fix';
        style.textContent = `
            .portfolio-page .hero::before,
            .portfolio-page #portfolio-hero::before,
            #portfolio-hero.hero::before {
                display: none !important;
                content: none !important;
                background: none !important;
                background-color: transparent !important;
                background-image: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                position: absolute !important;
                top: -9999px !important;
                left: -9999px !important;
                width: 0 !important;
                height: 0 !important;
                z-index: -1 !important;
            }
        `;
        
        // Insert immediately
        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild(style);
            });
        }
    }
})();

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

// Shared mobile scroll lock state
let FC_SAVED_SCROLL_Y = 0;

function isMobileViewport() {
    return window.innerWidth <= 768;
}

function lockBodyScrollMobile() {
    if (!isMobileViewport()) return;
    if (document.body.style.position === 'fixed') return; // already locked
    
    // Save current scroll position
    FC_SAVED_SCROLL_Y = window.scrollY || window.pageYOffset || 0;
    
    // Apply minimal scroll lock without causing white overlay
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${FC_SAVED_SCROLL_Y}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Prevent touch scrolling but allow menu scrolling
    document.body.style.touchAction = 'none';
    document.body.style.webkitOverflowScrolling = 'auto';
    
    // Ensure no white background appears
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
}

function unlockBodyScrollMobile() {
    if (!isMobileViewport()) return;
    
    // Get saved scroll position
    const topVal = document.body.style.top;
    const saved = topVal ? -parseInt(topVal, 10) || 0 : FC_SAVED_SCROLL_Y;
    
    // Restore all body styles
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.style.touchAction = '';
    document.body.style.webkitOverflowScrolling = '';
    document.body.style.backgroundColor = '';
    document.documentElement.style.backgroundColor = '';
    
    // Restore scroll position
    window.scrollTo(0, saved);
}

function closeMenuIfOpen(navToggle, navMenu) {
    if (!navToggle || !navMenu) return;
    if (navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        // Clear inline styles that could keep overlay visible
        navMenu.style.left = '-100%';
        navMenu.style.transform = '';
        navMenu.style.height = '';
        navMenu.style.maxHeight = '';
        navMenu.style.minHeight = '';
        // Hide closed menu to avoid any overlay interception
        navMenu.style.visibility = 'hidden';
        navMenu.style.pointerEvents = 'none';
        navMenu.setAttribute('aria-hidden', 'true');
        unlockBodyScrollMobile();
    }
}

function showMenu(navMenu) {
    if (!navMenu) return;
    navMenu.style.visibility = 'visible';
    navMenu.style.pointerEvents = 'auto';
    navMenu.removeAttribute('aria-hidden');
}

function hideMenu(navMenu) {
    if (!navMenu) return;
    navMenu.style.visibility = 'hidden';
    navMenu.style.pointerEvents = 'none';
    navMenu.setAttribute('aria-hidden', 'true');
}

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
        // Safety: ensure the mobile menu is hidden on load
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !navMenu.classList.contains('active')) {
            hideMenu(navMenu);
        }
        
        // Fix mobile Safari white overlay issues
        fixMobileSafariOverlay();
        
        // Fix portfolio page specific white overlay issues
        fixPortfolioPageOverlay();
        
        // Additional aggressive fix for portfolio page
        setTimeout(() => {
            fixPortfolioPageOverlay();
        }, 1000);
        
        // Final fix after everything loads
        setTimeout(() => {
            fixPortfolioPageOverlay();
        }, 3000);
    }
});

// Fix mobile Safari white overlay issues
function fixMobileSafariOverlay() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                     /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isSafari) {
        console.log('Applying mobile Safari white overlay fixes');
        
        // Fix body and html background
        document.body.style.backgroundColor = '#f8fafc';
        document.documentElement.style.backgroundColor = '#f8fafc';
        document.body.style.background = '#f8fafc';
        document.documentElement.style.background = '#f8fafc';
        
        // Fix all sections to prevent white overlays
        const sections = document.querySelectorAll('.hero, .services, .features, .about, .contact, .portfolio-grid');
        sections.forEach(section => {
            section.style.backgroundColor = '#f8fafc';
            section.style.background = '#f8fafc';
            section.style.backgroundImage = 'none';
        });
        
        // Fix mobile menu overlay
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navMenu.style.background = 'rgba(255, 255, 255, 0.98)';
            navMenu.style.backgroundImage = 'none';
        }
        
        // Force repaint to clear any stuck overlays
        document.body.offsetHeight;
        
        console.log('Mobile Safari white overlay fixes applied');
    }
}

// Fix portfolio page specific white overlay issues
function fixPortfolioPageOverlay() {
    const isMobile = window.innerWidth <= 768;
    const isPortfolioPage = document.body.classList.contains('portfolio-page');
    
    if (isMobile && isPortfolioPage) {
        console.log('Applying portfolio page specific white overlay fixes');
        
        // Force portfolio page background
        document.body.style.backgroundColor = '#f8fafc';
        document.documentElement.style.backgroundColor = '#f8fafc';
        document.body.style.background = '#f8fafc';
        document.documentElement.style.background = '#f8fafc';
        
        // Fix portfolio hero section specifically
        const portfolioHero = document.querySelector('#portfolio-hero');
        if (portfolioHero) {
            portfolioHero.style.backgroundColor = '#f8fafc';
            portfolioHero.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
            portfolioHero.style.backgroundImage = 'none';
            portfolioHero.style.position = 'relative';
            portfolioHero.style.zIndex = '1';
            portfolioHero.style.overflow = 'visible';
            
            // CRITICAL: Remove the hero pseudo-element that creates white overlay
            const heroBefore = window.getComputedStyle(portfolioHero, '::before');
            if (heroBefore) {
                // Force remove the pseudo-element by setting its content to none
                const style = document.createElement('style');
                style.id = 'portfolio-hero-fix';
                style.textContent = `
                    .portfolio-page .hero::before,
                    .portfolio-page #portfolio-hero::before,
                    #portfolio-hero.hero::before {
                        display: none !important;
                        content: none !important;
                        background: none !important;
                        background-color: transparent !important;
                        background-image: none !important;
                        opacity: 0 !important;
                        visibility: hidden !important;
                        position: absolute !important;
                        top: -9999px !important;
                        left: -9999px !important;
                        width: 0 !important;
                        height: 0 !important;
                        z-index: -1 !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Fix all portfolio sections
        const portfolioSections = document.querySelectorAll('.portfolio-grid, .portfolio-cta');
        portfolioSections.forEach(section => {
            section.style.backgroundColor = '#f8fafc';
            section.style.background = '#f8fafc';
            section.style.backgroundImage = 'none';
            section.style.position = 'relative';
            section.style.zIndex = '1';
        });
        
        // Fix iframe containers that might cause white overlay
        const iframeContainers = document.querySelectorAll('.iframe-container');
        iframeContainers.forEach(container => {
            container.style.backgroundColor = '#f8fafc';
            container.style.background = '#f8fafc';
            container.style.backgroundImage = 'none';
        });
        
        // Fix project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.style.backgroundColor = '#ffffff';
            card.style.background = '#ffffff';
            card.style.backgroundImage = 'none';
        });
        
        // Force repaint to clear any stuck overlays
        document.body.offsetHeight;
        
        console.log('Portfolio page white overlay fixes applied');
    }
}

// Fix mobile viewport and zoom issues for all browsers
function fixChromeZoom() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Function to fix mobile viewport and prevent zoom issues
        function fixMobileViewport() {
            // Set proper viewport height for mobile browsers
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Fix mobile scrolling and prevent white overlays
            document.body.style.overflow = 'auto';
            document.body.style.position = 'relative';
            document.body.style.height = 'auto';
            document.body.style.minHeight = '100vh';
            document.body.style.minHeight = '100dvh';
            
            // Prevent zoom issues
            document.body.style.zoom = '1';
            document.documentElement.style.zoom = '1';
            document.body.style.webkitTextSizeAdjust = '100%';
            document.documentElement.style.webkitTextSizeAdjust = '100%';
            
            // Ensure proper background
            document.body.style.backgroundColor = '#f8fafc';
            document.documentElement.style.backgroundColor = '#f8fafc';
            
            // Fix hero section height
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.height = '100vh';
                hero.style.minHeight = '100vh';
                hero.style.maxHeight = '100vh';
                hero.style.height = `calc(var(--vh, 1vh) * 100)`;
                hero.style.minHeight = `calc(var(--vh, 1vh) * 100)`;
                hero.style.maxHeight = `calc(var(--vh, 1vh) * 100)`;
            }
        }
        
        // Apply immediately
        fixMobileViewport();
        
        // Apply after a brief delay to catch browser defaults
        setTimeout(fixMobileViewport, 100);
        
        // Additional mobile fixes
        setTimeout(() => {
            fixMobileViewport();
        }, 200);
        
        // Fix white block at bottom issue
        setTimeout(() => {
            fixMobileWhiteBlock();
        }, 500);
        
        console.log('Mobile viewport and zoom fixes applied');
    }
}

// Fix mobile white block at bottom issue
function fixMobileWhiteBlock() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        console.log('Fixing mobile white block at bottom');
        
        // Ensure body takes full height
        document.body.style.minHeight = '100vh';
        document.body.style.minHeight = '100dvh';
        document.body.style.height = 'auto';
        
        // Fix footer positioning
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.style.position = 'relative';
            footer.style.zIndex = '1';
            footer.style.marginTop = '0';
            footer.style.paddingTop = '60px';
            footer.style.paddingBottom = '20px';
        }
        
        // Ensure all sections have proper backgrounds
        const sections = document.querySelectorAll('.hero, .services, .features, .about, .contact, .portfolio-grid, .portfolio-cta');
        sections.forEach(section => {
            section.style.position = 'relative';
            section.style.zIndex = '1';
            section.style.marginTop = '0';
            section.style.paddingTop = '40px';
            section.style.paddingBottom = '40px';
        });
        
        // Fix hero section specifically
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.paddingTop = '100px';
            hero.style.paddingBottom = '60px';
            hero.style.marginBottom = '0';
        }
        
        // Ensure no white space between sections
        const allSections = document.querySelectorAll('section');
        allSections.forEach((section, index) => {
            if (index > 0) {
                section.style.marginTop = '0';
            }
        });
        
        console.log('Mobile white block fix applied');
    }
}

// Fix mobile viewport height issues for all browsers
function fixChromeViewportHeight() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        function setViewportHeight() {
            // Set proper viewport height for mobile browsers
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Fix mobile scrolling and prevent white overlays
            document.body.style.overflow = 'auto';
            document.body.style.position = 'relative';
            document.body.style.height = 'auto';
            document.body.style.minHeight = '100vh';
            document.body.style.minHeight = '100dvh';
            document.body.style.backgroundColor = '#f8fafc';
            document.documentElement.style.backgroundColor = '#f8fafc';
            
            // Prevent white overlays during scroll
            document.body.style.background = '#f8fafc';
            document.documentElement.style.background = '#f8fafc';
            
            // Fix hero section height
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.height = `calc(var(--vh, 1vh) * 100)`;
                hero.style.minHeight = `calc(var(--vh, 1vh) * 100)`;
                hero.style.maxHeight = `calc(var(--vh, 1vh) * 100)`;
            }
        }
        
        // Set initial viewport height
        setViewportHeight();
        
        // Update on resize (for when mobile address bar appears/disappears) - DEBOUNCED
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setViewportHeight, 250);
        });
        
        // Update on orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(setViewportHeight, 600);
            setTimeout(fixMobileWhiteBlock, 800);
        });
        
        // Fix mobile scroll issues
        window.addEventListener('scroll', function() {
            // Ensure proper background during scroll
            if (document.body.style.position === 'fixed') {
                document.body.style.backgroundColor = '#f8fafc';
                document.documentElement.style.backgroundColor = '#f8fafc';
            }
        }, { passive: true });
        
        // Fix white block on resize
        window.addEventListener('resize', function() {
            setTimeout(fixMobileWhiteBlock, 300);
        });
        
        console.log('Mobile viewport height and scroll fixes applied');
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

// Emergency function to force close mobile menu if stuck
function forceCloseMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        console.log('Force closing mobile menu to clear white overlay');
        
        // Force close all menu states
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Clear all inline styles that could cause white overlay
        navMenu.style.left = '-100%';
        navMenu.style.transform = '';
        navMenu.style.height = '';
        navMenu.style.maxHeight = '';
        navMenu.style.minHeight = '';
        navMenu.style.width = '';
        navMenu.style.top = '';
        navMenu.style.bottom = '';
        navMenu.style.right = '';
        navMenu.style.position = '';
        navMenu.style.zIndex = '';
        navMenu.style.visibility = 'hidden';
        navMenu.style.pointerEvents = 'none';
        navMenu.setAttribute('aria-hidden', 'true');
        
        // Force unlock body scroll
        unlockBodyScrollMobile();
        
        // Clear any white background that might be stuck
        document.body.style.backgroundColor = '';
        document.documentElement.style.backgroundColor = '';
        document.body.style.background = '';
        document.documentElement.style.background = '';
        
        // Force a repaint to clear any stuck overlays
        document.body.offsetHeight;
        
        console.log('Mobile menu force closed and white overlay cleared');
    }
}

// Auto-detect and fix stuck menu on page load
window.addEventListener('load', function() {
    setTimeout(() => {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            console.log('Detected stuck mobile menu on page load, force closing');
            forceCloseMobileMenu();
        }
    }, 1000);
});

// Emergency escape key handler to force close stuck menu
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && window.innerWidth <= 768) {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            console.log('Escape key pressed, force closing mobile menu');
            forceCloseMobileMenu();
        }
    }
});

// Emergency double-tap handler to force close stuck menu
let lastTouchTime = 0;
document.addEventListener('touchend', function(event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTouchTime;
    
    if (tapLength < 500 && tapLength > 0 && window.innerWidth <= 768) {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            console.log('Double tap detected, force closing mobile menu');
            forceCloseMobileMenu();
        }
    }
    lastTouchTime = currentTime;
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Smooth, reliable anchor navigation with fixed-header offset
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();

            const targetSection = document.querySelector(href);
            if (!targetSection) return;

            const navbar = document.querySelector('.navbar');
            const headerOffset = (navbar ? navbar.offsetHeight : 70) + 10; // small buffer

            // If mobile and menu is open, close menu first, restore scroll, then scroll
            if (isMobileViewport() && navMenu.classList.contains('active')) {
                closeMenuIfOpen(navToggle, navMenu);
                // Ensure we wait for reflow before scrolling
                setTimeout(() => {
                    const top = Math.max(0, targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset);
                    window.scrollTo({ top, behavior: 'smooth' });
                }, 60);
            } else {
                const top = Math.max(0, targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset);
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
    
    // Mobile menu toggle with proper scroll management (MOBILE ONLY)
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            // Only apply mobile menu logic on mobile devices
            if (window.innerWidth <= 768) {
                const isOpening = !navMenu.classList.contains('active');
                
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');

                if (isOpening) {
                    // Menu is opening
                    console.log('Opening mobile menu');
                    lockBodyScrollMobile();
                    showMenu(navMenu);
                    
                    // Add scroll indicators for mobile menu after animation
                    setTimeout(() => {
                        addMobileMenuScrollIndicators();
                        
                        // SAFARI CUTOFF FIX: Additional viewport correction
                        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                                         /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
                        
                        if (isSafari && navMenu.classList.contains('active')) {
                            // Force Safari to recalculate viewport and menu position
                            const viewportHeight = window.innerHeight;
                            const viewportWidth = window.innerWidth;
                            
                            // Apply comprehensive Safari fixes
                            navMenu.style.height = viewportHeight + 'px';
                            navMenu.style.maxHeight = viewportHeight + 'px';
                            navMenu.style.width = viewportWidth + 'px';
                            navMenu.style.top = '0px';
                            navMenu.style.left = '0px';
                            navMenu.style.right = '0px';
                            navMenu.style.bottom = '0px';
                            
                            // Force a repaint to ensure Safari shows the full menu
                            navMenu.offsetHeight; // Trigger reflow
                            navMenu.style.transform = 'translate3d(0, 0, 0)';
                            
                            // Additional Safari-specific positioning
                            navMenu.style.position = 'fixed';
                            navMenu.style.zIndex = '10000';
                            
                            console.log('Applied Safari viewport correction for menu cutoff');
                        }
                    }, 100); // Reduced delay for faster response
                } else {
                    // Menu is closing - restore body scroll and clear inline styles
                    console.log('Closing mobile menu via toggle');
                    closeMenuIfOpen(navToggle, navMenu);
                    hideMenu(navMenu);
                }
            }
        });
    }
    
    // Function to add scroll indicators to mobile menu
    function addMobileMenuScrollIndicators() {
        if (!navMenu || window.innerWidth > 768) return;
        
        // Check if menu content is scrollable
        const isScrollable = navMenu.scrollHeight > navMenu.clientHeight;
        
        if (isScrollable) {
            console.log('Mobile menu is scrollable - adding visual indicators');
            
            // Add visual feedback to show menu is scrollable
            navMenu.style.borderTop = '3px solid rgba(102, 126, 234, 0.3)';
            navMenu.style.borderBottom = '3px solid rgba(102, 126, 234, 0.3)';
            
            // Enhanced Safari support
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                             /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
            
            if (isSafari) {
                // Additional Safari mobile menu improvements
                navMenu.style.webkitOverflowScrolling = 'touch';
                navMenu.style.transform = 'translateZ(0)';
                
                // CRITICAL: Fix Safari menu cutoff issues
                navMenu.style.top = '0px';
                navMenu.style.bottom = '0px';
                navMenu.style.left = '0px';
                navMenu.style.right = '0px';
                navMenu.style.position = 'fixed';
                navMenu.style.minHeight = '100vh';
                navMenu.style.minHeight = '100dvh';
                navMenu.style.maxHeight = '100vh';
                navMenu.style.maxHeight = '100dvh';
                navMenu.style.boxSizing = 'border-box';
                
                console.log('Applied Safari-specific menu cutoff prevention');
            }
            
            // Add scroll event listener for fade effects
            navMenu.addEventListener('scroll', function() {
                const scrollTop = this.scrollTop;
                const scrollHeight = this.scrollHeight;
                const clientHeight = this.clientHeight;
                const scrollBottom = scrollHeight - clientHeight - scrollTop;
                
                // Fade top border when scrolled from top
                const topOpacity = Math.min(scrollTop / 50, 0.5);
                this.style.borderTopColor = `rgba(102, 126, 234, ${0.3 + topOpacity})`;
                
                // Fade bottom border when scrolled to bottom
                const bottomOpacity = Math.min(scrollBottom / 50, 0.5);
                this.style.borderBottomColor = `rgba(102, 126, 234, ${0.3 + bottomOpacity})`;
            });
        }
    }
    
    // Close mobile menu when clicking outside (MOBILE ONLY)
    document.addEventListener('click', function(event) {
        // Only apply on mobile devices
        if (window.innerWidth <= 768 && navToggle && navMenu && !navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            if (navMenu.classList.contains('active')) {
                console.log('Closing mobile menu via outside click');
                closeMenuIfOpen(navToggle, navMenu);
                hideMenu(navMenu);
            }
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
    
    // ENHANCED MOBILE DETECTION - DISABLE TYPING EFFECT ON MOBILE TO PREVENT GLITCHES
    const isMobile = window.innerWidth <= 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     ('ontouchstart' in window) ||
                     (navigator.maxTouchPoints > 0);
    
    if (isMobile) {
        // Immediately set the text without any animation or delay
        gradientText.textContent = 'Web Design';
        gradientText.style.opacity = '1';
        gradientText.style.visibility = 'visible';
        gradientText.style.transform = 'none';
        gradientText.style.animation = 'none';
        return;
    }
    
    const words = ['Web Design', 'AI Automation', 'FutureClarity'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        // Enhanced mobile detection during animation to prevent mobile glitches
        const currentIsMobile = window.innerWidth <= 768 || 
                               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                               ('ontouchstart' in window) ||
                               (navigator.maxTouchPoints > 0);
        
        if (currentIsMobile) {
            gradientText.textContent = 'Web Design';
            gradientText.style.opacity = '1';
            gradientText.style.visibility = 'visible';
            gradientText.style.transform = 'none';
            gradientText.style.animation = 'none';
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

// Portfolio page specific load fix
window.addEventListener('load', function() {
    const isPortfolioPage = document.body.classList.contains('portfolio-page');
    const isMobile = window.innerWidth <= 768;
    
    if (isPortfolioPage && isMobile) {
        console.log('Portfolio page loaded - applying aggressive white overlay fixes');
        
        // Apply fixes immediately
        fixPortfolioPageOverlay();
        
        // Apply fixes with delays to catch any late-loading elements
        setTimeout(fixPortfolioPageOverlay, 500);
        setTimeout(fixPortfolioPageOverlay, 1500);
        setTimeout(fixPortfolioPageOverlay, 3000);
        
        // Force a complete page repaint
        setTimeout(() => {
            document.body.style.display = 'none';
            document.body.offsetHeight; // Trigger reflow
            document.body.style.display = '';
        }, 2000);
    }
});

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
        
        // Periodic check for fullscreen state - WITH CLEANUP TRACKING
        const fullscreenInterval = setInterval(() => {
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
        
        // CRASH PREVENTION: Track interval for cleanup
        if (!window.safariIntervals) window.safariIntervals = [];
        window.safariIntervals.push(fullscreenInterval);
        
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
    
    // CRASH PREVENTION: Global cleanup tracking
    if (!window.iframeCleanupHandlers) {
        window.iframeCleanupHandlers = [];
        window.iframeTimeouts = [];
        window.iframeIntervals = [];
        window.iframeObservers = [];
    }
    
    // Mobile performance optimization: limit concurrent iframe loads
    const isMobile = window.innerWidth <= 768;
    let loadedCount = 0;
    const maxConcurrentLoads = isMobile ? 2 : 4;
    
    // CRASH PREVENTION: Clear any existing handlers first
    cleanupIframeResources();
    
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
        
        // CRASH PREVENTION: Track timeout for cleanup
        window.iframeTimeouts.push(loadingTimeout);
        
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
            
            // CRASH PREVENTION: Track observer for cleanup
            window.iframeObservers.push(observer);
        }
        
        // MOBILE VIDEO INTERACTION FIX - Enable video controls on mobile
        if (isMobile) {
            // CRASH PREVENTION: Create trackable event handlers
            const touchStartHandler = function(e) {
                if (iframe.getAttribute('data-mobile-desktop')) {
                    console.log('Mobile tap detected on iframe container');
                    
                    // Temporarily enable pointer events for interaction
                    iframe.style.setProperty('pointer-events', 'auto', 'important');
                    
                    // Re-disable after a short delay
                    const timeout = setTimeout(() => {
                        iframe.style.setProperty('pointer-events', 'none', 'important');
                    }, 3000); // 3 seconds to allow for video interaction
                    
                    // Track timeout for cleanup
                    window.iframeTimeouts.push(timeout);
                }
            };
            
            const touchEndHandler = function(e) {
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
                    const timeout = setTimeout(() => {
                        iframe.style.setProperty('pointer-events', 'none', 'important');
                        console.log('Mobile iframe pointer events disabled after extended interaction period');
                    }, 5000); // Extended to 5 seconds for better video control access
                    
                    // Track timeout for cleanup
                    window.iframeTimeouts.push(timeout);
                }
            };
            
            // Add event listeners
            container.addEventListener('touchstart', touchStartHandler, { passive: true });
            container.addEventListener('touchend', touchEndHandler, { passive: true });
            
            // CRASH PREVENTION: Track handlers for cleanup
            window.iframeCleanupHandlers.push({
                element: container,
                type: 'touchstart',
                handler: touchStartHandler
            });
            window.iframeCleanupHandlers.push({
                element: container,
                type: 'touchend',
                handler: touchEndHandler
            });
        }
    });
    
    // CRASH PREVENTION: Set up periodic memory cleanup
    setupPeriodicCleanup();
}

// CRASH PREVENTION: Comprehensive resource cleanup function
function cleanupIframeResources() {
    console.log('Cleaning up iframe resources to prevent crashes');
    
    // Clear all tracked timeouts
    if (window.iframeTimeouts) {
        window.iframeTimeouts.forEach(timeout => {
            clearTimeout(timeout);
        });
        window.iframeTimeouts = [];
    }
    
    // Clear all tracked intervals
    if (window.iframeIntervals) {
        window.iframeIntervals.forEach(interval => {
            clearInterval(interval);
        });
        window.iframeIntervals = [];
    }
    
    // Disconnect all tracked observers
    if (window.iframeObservers) {
        window.iframeObservers.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        window.iframeObservers = [];
    }
    
    // Remove all tracked event listeners
    if (window.iframeCleanupHandlers) {
        window.iframeCleanupHandlers.forEach(handler => {
            if (handler.element && handler.type && handler.handler) {
                handler.element.removeEventListener(handler.type, handler.handler);
            }
        });
        window.iframeCleanupHandlers = [];
    }
    
    // Clean up Safari intervals
    if (window.safariIntervals) {
        window.safariIntervals.forEach(interval => {
            clearInterval(interval);
        });
        window.safariIntervals = [];
    }
    
    console.log('Iframe resource cleanup completed');
}

// CRASH PREVENTION: Set up periodic memory cleanup
function setupPeriodicCleanup() {
    // Clean up resources every 5 minutes to prevent memory accumulation
    const cleanupInterval = setInterval(() => {
        console.log('Performing periodic cleanup to prevent crashes');
        
        // Force garbage collection of inactive iframes
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (!iframe.getAttribute('data-loaded') && iframe.style.opacity === '0') {
                // Reset src for inactive iframes to free memory
                const originalSrc = iframe.src;
                iframe.src = 'about:blank';
                setTimeout(() => {
                    iframe.src = originalSrc;
                }, 100);
            }
        });
        
        // Clean up any orphaned timeouts/intervals
        if (window.iframeTimeouts && window.iframeTimeouts.length > 10) {
            console.log('Cleaning up excess timeouts');
            window.iframeTimeouts = window.iframeTimeouts.slice(-5); // Keep only last 5
        }
        
        // Memory usage monitoring
        if (performance.memory) {
            const memoryInfo = performance.memory;
            console.log('Memory usage:', {
                used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024) + 'MB',
                limit: Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            });
            
            // If memory usage is high, force more aggressive cleanup
            if (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit > 0.8) {
                console.warn('High memory usage detected, performing aggressive cleanup');
                cleanupIframeResources();
                
                // Force iframe refresh if memory is critical
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    iframe.src = iframe.src; // Force refresh
                });
            }
        }
    }, 300000); // 5 minutes
    
    // Track this interval too
    if (!window.iframeIntervals) window.iframeIntervals = [];
    window.iframeIntervals.push(cleanupInterval);
    
    // Clean up everything when page unloads
    const unloadHandler = () => {
        console.log('Page unloading, cleaning up all resources');
        cleanupIframeResources();
        
        // Clear all iframes to prevent memory leaks
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.src = 'about:blank';
        });
    };
    
    window.addEventListener('beforeunload', unloadHandler);
    window.addEventListener('pagehide', unloadHandler);
    
    // Also clean up when visibility changes (mobile background/foreground)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('Page hidden, performing cleanup');
            cleanupIframeResources();
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