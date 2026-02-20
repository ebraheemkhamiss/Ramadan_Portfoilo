// ===================================
// THEME TOGGLE
// ===================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.classList.toggle('dark-theme', currentTheme === 'dark');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// ===================================
// NAVIGATION
// ===================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.style.color = '');
            if (navLink) {
                navLink.style.color = 'var(--primary)';
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ===================================
// PROJECT SLIDER
// ===================================

const sliderTrack = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');
const projectCards = document.querySelectorAll('.project-card');

let currentSlide = 0;
const totalSlides = projectCards.length;
let autoPlayInterval;

// Create dots
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    sliderDots.appendChild(dot);
}

const dots = document.querySelectorAll('.slider-dot');

function updateSlider() {
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetAutoPlay();
}

// Button event listeners
nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
});

// Auto-play slider
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Start auto-play
startAutoPlay();

// Pause auto-play on hover
const projectSlider = document.querySelector('.project-slider');
projectSlider.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

projectSlider.addEventListener('mouseleave', () => {
    startAutoPlay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoPlay();
    }
});

// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================

const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optionally unobserve after reveal
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ===================================
// SKILL PROGRESS BARS ANIMATION
// ===================================

const skillProgressBars = document.querySelectorAll('.skill-progress-fill');

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.style.width;
            progressBar.style.width = '0%';
            
            setTimeout(() => {
                progressBar.style.width = width;
            }, 200);
            
            progressObserver.unobserve(progressBar);
        }
    });
}, {
    threshold: 0.5
});

skillProgressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// ===================================
// CONTACT FORM — EmailJS Integration
// ===================================

// Initialize EmailJS with your Public Key
emailjs.init('f603Wr61rE0ZJUCJv');

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // ── 1. Grab field values
    const nameVal    = document.getElementById('name').value.trim();
    const emailVal   = document.getElementById('email').value.trim();
    const subjectVal = document.getElementById('subject').value.trim();
    const messageVal = document.getElementById('message').value.trim();

    // ── 2. Validate all fields are filled
    if (!nameVal || !emailVal || !subjectVal || !messageVal) {
        showFormNotice('⚠️ Please fill in all fields before sending.', '#f59e0b');
        return;
    }

    // ── 3. Disable button to prevent double-click
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // ── 4. Send via EmailJS
    // Template variables must match what you named them in your EmailJS template:
    //   {{from_name}}  →  nameVal
    //   {{from_email}} →  emailVal   (used as Reply-To in template)
    //   {{subject}}    →  subjectVal
    //   {{message}}    →  messageVal
    emailjs.send(
        'service_b14neos',       // Service ID
        'template_yqcwzuu',      // Template ID
        {
            from_name  : nameVal,
            from_email : emailVal,
            subject    : subjectVal,
            message    : messageVal,
            to_email   : 'ebraheemkhamiss@gmail.com'
        }
    )
    .then(() => {
        // Success
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        showFormNotice('✅ Message sent! I\'ll get back to you soon.', 'var(--primary)');
    })
    .catch((error) => {
        // Failure
        console.error('EmailJS error:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        showFormNotice('❌ Something went wrong. Please try again.', '#ef4444');
    });
});

// Helper: show a temporary floating notice
function showFormNotice(text, bgColor) {
    const notice = document.createElement('div');
    notice.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: ${bgColor};
        color: white;
        padding: 2rem 3rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        font-size: 1.1rem;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    notice.textContent = text;

    if (!document.getElementById('slideInAnimation')) {
        const style = document.createElement('style');
        style.id = 'slideInAnimation';
        style.textContent = `
            @keyframes slideIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to   { opacity: 1; transform: translate(-50%, -50%); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notice);

    setTimeout(() => {
        notice.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => document.body.removeChild(notice), 300);
    }, 3000);
}

// ===================================
// SMOOTH SCROLL
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// STATISTICS COUNTER ANIMATION
// ===================================

const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statElement = entry.target;
            const finalValue = statElement.textContent;
            
            // Only animate if it's a number
            if (!isNaN(parseInt(finalValue))) {
                const duration = 2000;
                const start = 0;
                const end = parseInt(finalValue);
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const currentValue = Math.floor(start + (end - start) * easeOutQuart);
                    
                    statElement.textContent = currentValue;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        statElement.textContent = finalValue;
                    }
                }
                
                requestAnimationFrame(updateCounter);
            }
            
            counterObserver.unobserve(statElement);
        }
    });
}, {
    threshold: 0.5
});

statNumbers.forEach(stat => {
    counterObserver.observe(stat);
});

// ===================================
// PARALLAX EFFECT FOR HERO DECORATION
// ===================================

const heroDecoration = document.querySelector('.hero-decoration');

if (heroDecoration) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        heroDecoration.style.transform = `translate(${rate}px, ${rate}px)`;
    });
}

// ===================================
// CURSOR TRAIL EFFECT (Optional Enhancement)
// ===================================

let lastX = 0;
let lastY = 0;
let cursorTrails = [];

document.addEventListener('mousemove', (e) => {
    // Throttle trail creation
    const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
    );
    
    if (distance > 30) {
        createCursorTrail(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

function createCursorTrail(x, y) {
    // Limit number of trails
    if (cursorTrails.length > 15) {
        const oldTrail = cursorTrails.shift();
        if (oldTrail && oldTrail.parentNode) {
            oldTrail.parentNode.removeChild(oldTrail);
        }
    }
    
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        animation: trailFade 0.8s ease forwards;
    `;
    
    // Add animation if not already added
    if (!document.getElementById('trailAnimation')) {
        const style = document.createElement('style');
        style.id = 'trailAnimation';
        style.textContent = `
            @keyframes trailFade {
                to {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(trail);
    cursorTrails.push(trail);
    
    setTimeout(() => {
        if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
            cursorTrails = cursorTrails.filter(t => t !== trail);
        }
    }, 800);
}

// ===================================
// TYPING EFFECT FOR HERO SUBTITLE (Optional)
// ===================================

const heroSubtitle = document.querySelector('.hero-subtitle');

if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    
    let charIndex = 0;
    
    function typeCharacter() {
        if (charIndex < originalText.length) {
            heroSubtitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeCharacter, 80);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeCharacter, 500);
}

// ===================================
// SCROLL TO TOP BUTTON (Optional)
// ===================================

// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
`;
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: .5rem;
    width: 50px;
    height: 50px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transition: all 0.3s ease;
    z-index: 998;
`;

document.body.appendChild(scrollTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'scale(1.1) translateY(-3px)';
    scrollTopBtn.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'scale(1) translateY(0)';
    scrollTopBtn.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
});
// ===================================
// PRELOADER (Optional)
// ===================================

window.addEventListener('load', () => {
    // Remove any preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
// Initial animations
    document.body.style.opacity = '1';
});

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c Ibrahim Mohammed Ismail - QA Engineer Portfolio', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%c Built with HTML, CSS, and Vanilla JavaScript', 'color: #64748b; font-size: 14px;');
console.log('%c Feel free to reach out! 📧 ebraheemkhamiss@gmail.com', 'color: #f59e0b; font-size: 14px;');
