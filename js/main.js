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

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section, .project-card').forEach(element => {
    observer.observe(element);
});

document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in-section');
})

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://formspree.io/f/manopbzl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.requestFullscreen();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again later. ');
        }
    });
}

const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

document.head.appendChild(style);

if (document.getElementById('particles-js')) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: '#dbeafe' },
      shape: { type: 'circle' },
      opacity: { value: 0.3, random: true },
      size: { value: 4, random: true },
      line_linked: { enable: true, distance: 120, color: '#dbeafe', opacity: 0.2, width: 1 },
      move: { enable: true, speed: 1.2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'repulse' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        repulse: { distance: 80, duration: 0.4 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}
