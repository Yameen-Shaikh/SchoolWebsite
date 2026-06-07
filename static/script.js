document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
                // Optional: stop observing once revealed
                // scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to reveal on scroll
    const revealElements = document.querySelectorAll('.section, .card, .benefit-card, .activity-card, .pattern, .step');
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        scrollObserver.observe(el);
    });
});
