/**
 * LIKITH B - PORTFOLIO INTERACTIVITY ENGINE
 * 2026 Linear / Vercel Bento Grid Style
 */

document.addEventListener('DOMContentLoaded', () => {
    initNeuralCanvas();
    initSpotlightCards();
    initTypingEffect();
    initScrollObserver();
});

/* ==========================================================================
   1. INTERACTIVE NEURAL PARTICLE CANVAS
   ========================================================================== */
function initNeuralCanvas() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 80);
    const connectionDistance = 130;
    const mouseConnectionDistance = 160;
    
    let mouse = {
        x: null,
        y: null
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 1.8 + 1;
            this.baseAlpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${this.baseAlpha})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update & draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }

            // Connect to mouse cursor
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouseConnectionDistance) {
                    const alpha = (1 - dist / mouseConnectionDistance) * 0.45;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. CURSOR SPOTLIGHT TRACKER
   ========================================================================== */
function initSpotlightCards() {
    const cards = document.querySelectorAll('.spotlight-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   3. DYNAMIC ROTATING TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
    const target = document.getElementById('typedTitle');
    if (!target) return;

    const phrases = [
        "AI & Machine Learning Student",
        "Exploring Deep Learning & Neural Nets",
        "Building Semantic Vector Retrieval Systems",
        "Benchmarking Algorithms in C++ & Python"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 75;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 35;
        } else {
            target.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 75;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2200; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing new
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* ==========================================================================
   4. SKILLS FILTERING
   ========================================================================== */
function filterSkills(category, button) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');

    const skillPills = document.querySelectorAll('.skill-pill');
    
    skillPills.forEach(pill => {
        const pillCat = pill.getAttribute('data-category');
        if (category === 'all' || pillCat === category) {
            pill.style.display = 'inline-flex';
            setTimeout(() => {
                pill.style.opacity = '1';
                pill.style.transform = 'translateY(0) scale(1)';
            }, 10);
        } else {
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => {
                pill.style.display = 'none';
            }, 200);
        }
    });
}

/* ==========================================================================
   5. EMAIL COPY & TOAST NOTIFICATION
   ========================================================================== */
let toastTimeout;
function copyEmail() {
    const email = "likith301206@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        showToast("Email copied to clipboard: " + email);
    }).catch(err => {
        showToast("Email: " + email);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

/* ==========================================================================
   6. SCROLL OBSERVER FOR ACTIVE NAV HIGHLIGHT
   ========================================================================== */
function initScrollObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

/* ==========================================================================
   7. ATS RESUME MODAL & PRINT HANDLER
   ========================================================================== */
function openResumeModal(e) {
    if (e) e.preventDefault();
    toggleModal(true);
}

function closeResumeModal(e) {
    if (e && e.target.id === 'resumeModal') {
        toggleModal(false);
    }
}

function toggleModal(show) {
    const modal = document.getElementById('resumeModal');
    if (!modal) return;
    
    if (show) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function printResume() {
    const iframe = document.getElementById('resumeIframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }
}

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        toggleModal(false);
    }
});
