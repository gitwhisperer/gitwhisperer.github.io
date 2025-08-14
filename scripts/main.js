// Main JS for interactions and micro‑interactions
(function () {
  const doc = document;
  const $ = (s, r = doc) => r.querySelector(s);
  const $$ = (s, r = doc) => Array.from(r.querySelectorAll(s));

  // Year
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = $('.nav-toggle');
  const navList = $('#nav-menu');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // In‑view animations
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' }
  );
  $$('[data-animate]').forEach((el) => io.observe(el));

  // Parallax elements
  const onMove = (e) => {
    const { clientX: x, clientY: y } = e.touches ? e.touches[0] : e;
    const cx = x / window.innerWidth - 0.5;
    const cy = y / window.innerHeight - 0.5;
    $$('.parallax').forEach((el) => {
      const depth = parseFloat(el.dataset.depth || '0.2');
      el.style.transform = `translate3d(${cx * depth * 20}px, ${cy * depth * 20}px, 0)`;
    });
  };
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });

  // Subtle tilt on cards
  const tiltCards = $$('.tilt');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${py * -4}deg) rotateY(${px * 6}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Contact form handler — mailto fallback
  const form = $('[data-form]');
  const mailtoLink = $('[data-mailto]');
  if (form && mailtoLink) {
  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      // Honeypot
      if ((fd.get('_gotcha') || '').toString().trim() !== '') return;

      const name = (fd.get('name') || '').toString();
      const email = (fd.get('email') || '').toString();
      const message = (fd.get('message') || '').toString();
      const subject = `New project inquiry from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  const status = doc.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
      const endpoint = form.getAttribute('data-endpoint');

      const fallback = () => {
        const href = `mailto:harshittinker1979@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
      };

      if (!endpoint || endpoint.includes('your_form_id')) {
        // No endpoint configured yet — use mailto fallback
        fallback();
        return;
      }

      try {
        if (status) { status.hidden = false; status.textContent = 'Sending…'; status.classList.remove('success'); }
        if (submitBtn) { submitBtn.disabled = true; form.classList.add('is-sending'); }
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: fd
        });
        if (resp.ok) {
          form.reset();
          if (status) { status.textContent = 'Thanks! Your message has been sent.'; status.classList.add('success'); }
          if (submitBtn) { submitBtn.disabled = false; form.classList.remove('is-sending'); }
        } else {
          if (status) status.textContent = 'Could not send via form. Opening your mail app…';
          fallback();
        }
      } catch {
        if (status) status.textContent = 'Network error. Opening your mail app…';
        fallback();
      } finally {
        if (submitBtn) { submitBtn.disabled = false; form.classList.remove('is-sending'); }
      }
    });
  mailtoLink.addEventListener('click', (e) => {
      e.preventDefault();
  const href = `mailto:harshittinker1979@gmail.com?subject=${encodeURIComponent('Project inquiry for Harshit')}`;
      window.location.href = href;
    });
  }

  // Header shadow on scroll
  const onHeaderShadow = () => {
    document.body.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onHeaderShadow, { passive: true });
  onHeaderShadow();

  // Register service worker for PWA niceties
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Use relative path so it registers correctly from subfolders
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // Parallax on scroll (in addition to mouse parallax)
  const scrollParallax = $$('[data-parallax-scroll]');
  const onScrollParallax = () => {
    const y = window.scrollY;
    scrollParallax.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || '0.2');
      el.style.transform = `translate3d(0, ${y * speed * 0.15}px, 0)`;
    });
  };
  window.addEventListener('scroll', onScrollParallax, { passive: true });
  onScrollParallax();

  // Scroll progress bar
  const bar = $('.scroll-progress');
  const onScroll = () => {
    const h = doc.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    if (bar) bar.style.width = `${Math.max(0, Math.min(1, scrolled)) * 100}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active section highlighting
  const sections = ['home','work','services','about','contact'];
  const navLinks = sections.map((id) => $(`.nav-list a[href="#${id}"]`)).filter(Boolean);
  const so = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
  sections.forEach((id) => { const el = doc.getElementById(id); if (el) so.observe(el); });
})();
