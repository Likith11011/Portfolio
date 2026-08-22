// --- RESUME MODAL HANDLERS ---
function openResumeModal(event) {
    if (event) event.preventDefault();
    toggleModal(true);
}

function closeResumeModal(event) {
    toggleModal(false);
}

function toggleModal(show) {
    const modal = document.getElementById('resumeModal');
    if (show) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable background scrolling
    }
}

function printResume() {
    const iframe = document.getElementById('resumeIframe');
    if (iframe) {
        try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } catch (e) {
            console.error("Failed to print iframe directly. Opening fallback tab...", e);
            window.open('resume.html', '_blank');
        }
    }
}

// Close Modal on Esc key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        toggleModal(false);
    }
});

// --- INTERSECTION OBSERVER FOR FADE-IN TIMELINE EFFECTS ---
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const cards = document.querySelectorAll('.glass-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const viewObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);
    
    // Set initial transition styles and observe timeline items
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `all 0.6s ease-out ${index * 0.15}s`;
        viewObserver.observe(item);
    });

    // Set initial transition styles and observe glass cards
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        viewObserver.observe(card);
    });
});

// --- DYNAMIC SCROLL NAVBAR SCORING ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '0.5rem 0';
        header.style.background = 'rgba(3, 7, 18, 0.9)';
    } else {
        header.style.padding = '0';
        header.style.background = 'rgba(3, 7, 18, 0.7)';
    }
});
