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

// Background graph renderer (animated nodes + edges)
(function () {
  const canvas = document.getElementById('bg-graph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const cs = getComputedStyle(document.documentElement);
  const brand = (cs.getPropertyValue('--brand') || '#2dd4bf').trim();
  const brand2 = (cs.getPropertyValue('--brand-2') || '#f59e0b').trim();

  const hexToRgb = (hex) => {
    const v = hex.replace('#','');
    const bigint = parseInt(v.length === 3 ? v.split('').map((c)=>c+c).join('') : v, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  };
  const c1 = hexToRgb(brand);
  const c2 = hexToRgb(brand2);
  const rgba = (c, a) => `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;

  let W = 0, H = 0;
  const setSize = () => {
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  setSize();
  window.addEventListener('resize', () => { setSize(); seed(); drawOnce(); }, { passive: true });

  // Graph
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let nodes = [];
  let edges = [];
  const maxNodes = W >= 1200 ? 80 : W >= 800 ? 60 : 36;
  const maxDist = W >= 1200 ? 150 : 120;

  function seed() {
    nodes = Array.from({ length: maxNodes }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1 + Math.random() * 1.5,
      hue: Math.random() < 0.5 ? c1 : c2
    }));
  }
  seed();

  function step() {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
    }
  }

  function drawOnce() {
    ctx.clearRect(0, 0, W, H);
    // Edges
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x; const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < maxDist) {
          const t = 1 - d / maxDist;
          const col = Math.random() < 0.5 ? c1 : c2;
          ctx.strokeStyle = rgba(col, 0.08 + t * 0.22);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // Nodes
    for (const n of nodes) {
      ctx.fillStyle = rgba(n.hue, 0.25);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    step();
    drawOnce();
    raf = requestAnimationFrame(loop);
  }

  let raf = null;
  if (reduceMotion) {
    drawOnce();
  } else {
    loop();
  }
})();
