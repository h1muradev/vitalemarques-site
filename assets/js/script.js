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
window.addEventListener('scroll', setHeaderState);

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
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('show'));
}

const faqButtons = document.querySelectorAll('.faq-q');
faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;
    const expanded = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(expanded));
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
