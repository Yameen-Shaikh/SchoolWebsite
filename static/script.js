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

