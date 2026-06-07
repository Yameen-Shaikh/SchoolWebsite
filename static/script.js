document.addEventListener("DOMContentLoaded", () => {
  // --- Scroll Reveal Logic ---
  const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
      }
    });
  }, revealOptions);

  document.querySelectorAll(".section, .card, .benefit-card, .activity-card, .pattern, .step").forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  // --- Live Navbar Underline Logic ---
  const navLinks = document.querySelectorAll(".nav__link");
  const underline = document.querySelector(".nav-underline");
  const navContainer = document.querySelector(".nav");
  const sections = document.querySelectorAll(".hero, #standards, #activities, #benefits, #feedback");

  function updateUnderline(activeLink) {
    if (!activeLink || !underline || !navContainer) return;
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = navContainer.getBoundingClientRect();
    
    // Position underline relative to the nav container
    underline.style.width = `${linkRect.width}px`;
    underline.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
  }

  // Use IntersectionObserver for "Live" section tracking
  const navObserverOptions = {
    threshold: 0.4, // Section is active when 40% is visible
    rootMargin: "-80px 0px -20% 0px" // Offset for navbar height
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id || "home";
        const targetLink = document.querySelector(`.nav__link[data-nav="${sectionId}"]`);
        
        if (targetLink) {
          navLinks.forEach(l => l.classList.remove("active"));
          targetLink.classList.add("active");
          updateUnderline(targetLink);
        }
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // --- Smooth Scroll Redirect ---
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("/#") || href.startsWith("#")) {
        e.preventDefault();
        const id = href.split("#")[1];
        const targetSection = document.getElementById(id) || document.getElementById("home");
        
        if (targetSection) {
          // Scroll to the section title specifically if it exists, else the section top
          const title = targetSection.querySelector(".section__title, .hero__title") || targetSection;
          const offset = 100; // Space for the fixed header
          const targetY = title.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetY,
            behavior: "smooth"
          });
          
          // Force active state and underline move immediately on click
          navLinks.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
          updateUnderline(link);
        }
      }
    });
  });

  // Re-calculate on resize
  window.addEventListener("resize", () => {
    const activeLink = document.querySelector(".nav__link.active");
    if (activeLink) updateUnderline(activeLink);
  });

  // Initial set
  setTimeout(() => {
    const activeLink = document.querySelector(".nav__link.active") || navLinks[0];
    updateUnderline(activeLink);
  }, 500);
});