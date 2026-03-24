const header = document.getElementById('header');
const mobileBtn = document.getElementById('mobile-btn');
const mobileMenu = document.getElementById('mobile-menu');
const yearEl = document.getElementById('year');

if (yearEl) yearEl.textContent = new Date().getFullYear();

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 14);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    mobileBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      mobileBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item, index) => {
  item.style.setProperty('--delay', `${Math.min(index * 35, 280)}ms`);
});

if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('show'));
}

const faqButtons = document.querySelectorAll('.faq-q');

faqButtons.forEach((button) => {
  const item = button.closest('.faq-item');
  if (item?.classList.contains('open')) {
    const icon = button.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-plus');
      icon.classList.add('fa-minus');
    }
    button.setAttribute('aria-expanded', 'true');
  }
});

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;

    const isOpen = item.classList.contains('open');
    item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(!isOpen));

    const icon = button.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-plus', isOpen);
      icon.classList.toggle('fa-minus', !isOpen);
    }
  });
});

const waLinks = document.querySelectorAll('[data-wa-topic]');
waLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const topic = link.dataset.waTopic;
    if (!topic) return;
    const base = 'Olá! Vim pelo site da Vital & Marques e quero falar sobre: ';
    link.href = `https://wa.me/556130253145?text=${encodeURIComponent(base + topic)}`;
  });
});

const parallaxItems = document.querySelectorAll('[data-parallax]');
if (parallaxItems.length) {
  const updateParallax = () => {
    const y = window.scrollY;
    parallaxItems.forEach((el, idx) => {
      const speed = 0.03 + idx * 0.01;
      el.style.setProperty('--parallax-offset', `${Math.max(-18, y * speed * -0.2)}px`);
    });
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
}
