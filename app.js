// ============================================
// PORTFOLIO INTERACTIVITY - v1.1.3
// ============================================

// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CTA Button Actions
document.getElementById('cta-primary')?.addEventListener('click', () => {
    document.querySelector('#projects').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

document.getElementById('cta-secondary')?.addEventListener('click', () => {
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    }

    lastScroll = currentScroll;
});

// ============================================
// NAVBAR ACTIVE SECTION HIGHLIGHT
// ============================================
const sectionIds = ['hero', 'about', 'timeline', 'projects', 'skills', 'personal', 'contact'];
const sectionRatios = {};

const navHighlightObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.target.id) sectionRatios[entry.target.id] = entry.intersectionRatio;
        });
        const activeId = Object.entries(sectionRatios).reduce(
            (best, [id, ratio]) => (ratio > (sectionRatios[best] || 0) ? id : best),
            'hero'
        );
        document.querySelectorAll('.nav-link').forEach((link) => {
            const isActive = link.getAttribute('href') === `#${activeId}`;
            link.classList.toggle('active', isActive);
        });
    },
    {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '-15% 0px -70% 0px'
    }
);

sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) navHighlightObserver.observe(section);
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Once visible, stay visible
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.about-card, .project-card, .skill-category, .fade-in-up').forEach(el => {
    observer.observe(el);
});

// ============================================
// TIMELINE ANIMATION
// ============================================
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 150); // Stagger animation
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});



// ============================================
// 3D TILT EFFECT FOR CARDS
// ============================================
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});



// ============================================
// FLOATING PARTICLES BACKGROUND
// ============================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = `rgba(247, 165, 1, ${Math.random() * 0.3 + 0.1})`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';

        // Random animation
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { opacity: 1, offset: 0.1 },
            { opacity: 1, offset: 0.9 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        particlesContainer.appendChild(particle);
    }
}

// ============================================
// CURSOR TRAIL EFFECT
// ============================================
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    // Only on desktop
    if (window.innerWidth < 768) return;

    cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

    if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
    }
});



// ============================================
// KONAMI CODE EASTER EGG
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Fun surprise animation
    document.body.style.animation = 'rainbow 2s ease infinite';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    console.log('🎉 Konami Code activated! Enjoy the rainbow mode!');

    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 10000);
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    // Add loading animation fade out
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    console.log('%c🦔 Welcome to my portfolio! 🦔', 'font-size: 20px; color: #F7A501; font-weight: bold;');
    console.log('%cTry the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'color: #4A9EFF;');
});



// ============================================
// READING PROGRESS BAR
// ============================================
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.transform = `scaleX(${scrolled / 100})`;
});

// ============================================
// MAGNETIC BUTTONS
// ============================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.classList.add('btn-magnetic');

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// TYPING ANIMATION
// ============================================
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        }
    }

    // Start after a delay
    setTimeout(typeWriter, 1000);
}

// ============================================
// ENHANCED 3D CARD TILT
// ============================================
document.querySelectorAll('.about-card, .project-card, .timeline-content').forEach(card => {
    card.classList.add('card-tilt');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Limit rotation to small angles for subtlety
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
        const rotateY = ((x - centerX) / centerX) * 5;  // Max 5deg

        card.style.setProperty('--tilt-x', `${rotateX}deg`);
        card.style.setProperty('--tilt-y', `${rotateY}deg`);
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ============================================
// CURSOR TRAIL RENDERER
// ============================================
const cursorParticles = [];
const PARTICLE_COUNT = 12;

document.addEventListener('mousemove', (e) => {
    // Only on desktop
    if (window.innerWidth < 768) return;

    createCursorParticle(e.clientX, e.clientY);
});

function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);

    cursorParticles.push({
        element: particle,
        createdAt: Date.now()
    });

    // Cleanup old particles
    if (cursorParticles.length > PARTICLE_COUNT) {
        const old = cursorParticles.shift();
        old.element.remove();
    }

    // Auto cleanup after animation
    setTimeout(() => {
        particle.remove();
        const index = cursorParticles.findIndex(p => p.element === particle);
        if (index > -1) cursorParticles.splice(index, 1);
    }, 800);
}


// ============================================
// PERFORMANCE OPTIMIZATION (EXISTING)
// ============================================
// Debounce function (keep existing)
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

