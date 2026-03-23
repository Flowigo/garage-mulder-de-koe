/* ===================================================
   MDK MOTORS — main.js
   Nav scroll / mobile menu / scroll fade-in
   =================================================== */

// ── Sticky nav scroll class ──────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Mobile nav toggle ────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav  = document.querySelector('.nav-mobile');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    // Animate hamburger lines
    const spans = hamburger.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
      spans[1].style.cssText = 'opacity: 0';
      spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });
}

// ── Active nav link ──────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Scroll fade-in ───────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
}

// ── Filter chips ─────────────────────────────────
document.querySelectorAll('.chip-filter').forEach(chip => {
  chip.addEventListener('click', () => {
    const group = chip.closest('.chip-group');
    if (group) group.querySelectorAll('.chip-filter').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// ── Smooth scroll anchors ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Boomerang Video Effect ────────────────────────
function initBoomerang(v) {
  if (!v) return;
  
  const setup = () => {
    v.loop = false;
    v.muted = true;
    let reversing = false;

    function check() {
        if (!reversing && v.currentTime >= v.duration - 0.4) {
            reversing = true;
            v.pause();
        }
        
        if (reversing) {
            if (v.currentTime <= 0.1) {
                reversing = false;
                v.play().catch(() => {});
            } else {
                v.currentTime -= 0.033;
            }
        }
        requestAnimationFrame(check);
    }
    requestAnimationFrame(check);

    // Fallback if requestAnimationFrame misses the threshold
    v.addEventListener('ended', () => {
        if (!reversing) {
            reversing = true;
            v.currentTime = v.duration - 0.1;
        }
    });
  };

  if (v.readyState >= 1) setup();
  else v.addEventListener('loadedmetadata', setup);
}

// Initialize boomerang for all hero videos
document.querySelectorAll('#hero-video, header video').forEach(v => initBoomerang(v));

// Initialize boomerang for all header videos
document.querySelectorAll('header video').forEach(v => initBoomerang(v));
