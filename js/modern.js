// =====================================================
// Modern Portfolio JavaScript - Ryan Tobin
// =====================================================

// Global variables for theme switching
let particlesMaterial = null;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initNavigation();
    initThemeToggle();
    initHeroCanvas();
    initTextRotation();
    initScrollAnimations();
    initWorkTabs();
    initSmoothScroll();
    initParallax();
});

// Global function to update particle color
function updateParticleColor(theme) {
    if (particlesMaterial) {
        const newColor = theme === 'light' ? 0x0066cc : 0x64ffda;
        particlesMaterial.color.setHex(newColor);
    }
}

// Preloader
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.style.overflow = 'visible';
        }, 1000);
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.9;
        cursorY += (mouseY - cursorY) * 0.9;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor hover effects
    const links = document.querySelectorAll('a, button, .project-card-small');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            follower.classList.add('active');
        });
        link.addEventListener('mouseleave', () => {
            follower.classList.remove('active');
        });
    });
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'visible';
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'visible';
        });
    });
    
    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        rootMargin: '-50% 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Update particle color for initial theme (delay to ensure canvas is initialized)
    setTimeout(() => updateParticleColor(currentTheme), 100);
    
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
        updateParticleColor(theme);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Hero Canvas Animation (Three.js)
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !window.THREE) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material - with theme-aware color
    const getParticleColor = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? '#0066cc' : '#64ffda';
    };
    
    particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: getParticleColor(),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 3;
    
    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        
        // Mouse parallax
        particlesMesh.rotation.y += mouseX * 0.001;
        particlesMesh.rotation.x += mouseY * 0.001;
        
        renderer.render(scene, camera);
    }
    animate();
    
    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Text Rotation
function initTextRotation() {
    const rotatingText = document.getElementById('rotating-text');
    if (!rotatingText) return;
    
    const words = ['web', 'future', 'cloud', 'data'];
    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % words.length;
        rotatingText.style.opacity = '0';
        
        setTimeout(() => {
            rotatingText.textContent = words[currentIndex];
            rotatingText.style.opacity = '1';
        }, 300);
    }, 3000);
}

// Scroll Animations
function initScrollAnimations() {
    // Add animation classes to elements first
    document.querySelectorAll('.section-header').forEach(el => el.classList.add('fade-in'));
    document.querySelectorAll('.about-text, .work-tabs').forEach(el => el.classList.add('slide-in-left'));
    document.querySelectorAll('.about-image, .work-panels').forEach(el => el.classList.add('slide-in-right'));
    document.querySelectorAll('.project-card').forEach(el => el.classList.add('fade-in'));
    document.querySelectorAll('.project-card-small').forEach(el => el.classList.add('fade-in'));
    
    // Make all sections visible by default (remove fade-in effect if causing issues)
    document.querySelectorAll('.about, .work, .projects, .contact').forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    });
    
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
}

// Work Tabs
function initWorkTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const workPanels = document.querySelectorAll('.work-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update panels
            workPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Navbar height
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax Effects
function initParallax() {
    const parallaxElements = document.querySelectorAll('.floating-card, .project-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// GSAP Animations (if loaded)
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero text animation
    gsap.timeline()
        .from('.hero-intro', { opacity: 0, y: 30, duration: 1, delay: 1.5 })
        .from('.hero-name', { opacity: 0, y: 30, duration: 1 }, '-=0.5')
        .from('.hero-tagline', { opacity: 0, y: 30, duration: 1 }, '-=0.5')
        .from('.hero-description', { opacity: 0, y: 30, duration: 1 }, '-=0.5')
        .from('.hero-cta', { opacity: 0, y: 30, duration: 1 }, '-=0.5')
        .from('.floating-card', { opacity: 0, scale: 0.8, duration: 1 }, '-=0.5');
    
    // Section animations
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}