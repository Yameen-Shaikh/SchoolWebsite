// Optional clipboard helper (only if elements exist)
const copyBtn = document.querySelector('#copy-button');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const colorCode = document.querySelector('#color-code')?.textContent;
    if (colorCode) navigator.clipboard.writeText(colorCode);
  });
}

(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const underline = document.querySelector('.nav-underline');
  const links = Array.from(nav.querySelectorAll('.nav__link[data-nav]'));
  if (!underline || links.length === 0) return;

  const sections = links
    .map((a) => {
      const hash = a.getAttribute('href') || '';
      const id = hash.includes('#') ? hash.split('#').pop() : null;
      if (!id) return null;
      return { id, link: a };
    })
    .filter(Boolean);

  function setActiveById(id) {
    sections.forEach(({ id: sid, link }) => {
      if (sid === id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const active = sections.find((s) => s.id === id)?.link;
    if (!active) {
      underline.style.width = '0px';
      return;
    }

    const activeRect = active.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    const x = activeRect.left - navRect.left;
    underline.style.width = `${activeRect.width}px`;
    underline.style.transform = `translateX(${x}px)`;
  }

  // Choose the section closest to the header top
  function pickSection() {
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const y = headerH + 8;

    let best = null;
    let bestDist = Infinity;

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const dist = Math.abs(r.top - y);

      if (r.bottom > y && dist < bestDist) {
        best = s.id;
        bestDist = dist;
      }
    }

    if (!best && sections[0]) {
      // Fallback: top-most visible
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom > y) {
          best = s.id;
          break;
        }
      }
    }

    if (best) setActiveById(best);
  }

  // Initial + on scroll/resize
  document.addEventListener('DOMContentLoaded', () => {
    pickSection();
    window.addEventListener('scroll', pickSection, { passive: true });
    window.addEventListener('resize', pickSection);
  });
})();

(function () {
  const modal = document.querySelector('.media-modal');
  const content = document.getElementById('media-modal-content');
  const closeBtn = modal?.querySelector('.media-modal__close');

  if (!modal || !content) return;

  function openMedia({ type, poster, src }) {
    if (!modal || !content) return;

    content.innerHTML = '';

    if (type === 'image') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Activity preview';
      content.appendChild(img);
    } else if (type === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.poster = poster || '';

      const source = document.createElement('source');
      source.src = src;
      source.type = 'video/mp4';

      video.appendChild(source);
      content.appendChild(video);
    }

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('media-modal--open');
  }

  function closeMedia() {
    if (!modal || !content) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('media-modal--open');
    content.innerHTML = '';
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.activity-open');
    if (btn) {
      const type = btn.getAttribute('data-activity-media');
      if (type === 'image') {
        const img = btn.querySelector('img');
        openMedia({ type: 'image', src: img ? img.src : '' });
      }
      if (type === 'video') {
        const src = btn.getAttribute('data-video-src');
        openMedia({ type: 'video', poster: '/static/images/bg2.jpg', src });
      }
    }

    if (e.target?.dataset?.modalClose === 'true') closeMedia();
    if (e.target === closeBtn) closeMedia();
  });

  closeBtn?.addEventListener('click', closeMedia);
  modal?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMedia();
  });
})();


