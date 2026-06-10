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
    
    underline.style.width = `${linkRect.width}px`;
    underline.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
  }

  const navObserverOptions = {
    threshold: 0.4,
    rootMargin: "-80px 0px -20% 0px"
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
          const title = targetSection.querySelector(".section__title, .hero__title") || targetSection;
          const offset = 100;
          const targetY = title.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetY,
            behavior: "smooth"
          });
          
          navLinks.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
          updateUnderline(link);
        }
      }
    });
  });

  // --- Media Modal Logic ---
  const modal = document.querySelector(".media-modal");
  const modalContent = document.getElementById("media-modal-content");
  const modalClose = document.querySelector(".media-modal__close");
  const modalBackdrop = document.querySelector(".media-modal__backdrop");

  function openModal(contentHtml) {
    if (!modal || !modalContent) return;
    modalContent.innerHTML = contentHtml;
    modal.classList.add("media-modal--open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent scroll
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("media-modal--open");
    modal.setAttribute("aria-hidden", "true");
    modalContent.innerHTML = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".activity-open").forEach(button => {
    button.addEventListener("click", () => {
      const mediaType = button.getAttribute("data-activity-media");
      let content = "";

      if (mediaType === "video") {
        const videoSrc = button.getAttribute("data-video-src");
        content = `<video controls autoplay class="modal-video"><source src="${videoSrc}" type="video/mp4"></video>`;
      } else {
        const img = button.querySelector("img");
        if (img) {
          content = `<img src="${img.src}" alt="${img.alt}" class="modal-image">`;
        }
      }
      openModal(content);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  
  // Close on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
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

  // --- Mobile Sidebar Logic ---
  const navToggle = document.querySelector('.nav-toggle');
  const sidebarClose = document.querySelector('.sidebar__close');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar__link');

  function toggleSidebar(show) {
    if (show) {
      sidebar.classList.add('sidebar--open');
      sidebarOverlay.classList.add('sidebar-overlay--open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      sidebar.classList.remove('sidebar--open');
      sidebarOverlay.classList.remove('sidebar-overlay--open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (navToggle) navToggle.addEventListener('click', () => toggleSidebar(true));
  if (sidebarClose) sidebarClose.addEventListener('click', () => toggleSidebar(false));
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => toggleSidebar(false));
  });
});