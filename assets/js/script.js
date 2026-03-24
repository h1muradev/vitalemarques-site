// =========================================================
// VITAL & MARQUES — INTERAÇÕES GLOBAIS
// Este arquivo controla: header ao scroll, menu mobile,
// reveal on scroll, acordeão FAQ, links de WhatsApp
// e parallax suave na hero.
// =========================================================

// ===== Referências principais do DOM =====
const header = document.getElementById('header');
const mobileBtn = document.getElementById('mobile-btn');
const mobileMenu = document.getElementById('mobile-menu');
const yearEl = document.getElementById('year');

// =========================================================
// Ano automático no rodapé
// =========================================================
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// =========================================================
// Header compacto ao rolar a página
// =========================================================
const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 12);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

// =========================================================
// Menu mobile: abre/fecha e trava o scroll do body
// =========================================================
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

// =========================================================
// Reveal on scroll
// Dica para futura edição: qualquer bloco com .reveal
// passa a animar automaticamente na entrada da viewport.
// =========================================================
const revealItems = document.querySelectorAll('.reveal');

revealItems.forEach((item, index) => {
  item.style.setProperty('--delay', `${Math.min(index * 28, 300)}ms`);
});

if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('show'));
}

// =========================================================
// FAQ Accordion com transição suave
// Interação reutilizada na página de contato e de planos para expandir
// respostas sem recarregar a página.
// =========================================================
const faqButtons = document.querySelectorAll('.faq-q');

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const faqItem = button.closest('.faq-item');
    if (!faqItem) return;

    const icon = button.querySelector('i');
    const isOpen = faqItem.classList.toggle('open');

    button.setAttribute('aria-expanded', String(isOpen));

    if (icon) {
      icon.classList.toggle('fa-plus', !isOpen);
      icon.classList.toggle('fa-minus', isOpen);
    }
  });
});

// =========================================================
// Links de WhatsApp com mensagem contextual
// Altere data-wa-topic no HTML para customizar cada CTA.
// =========================================================
const waLinks = document.querySelectorAll('[data-wa-topic]');

waLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const topic = link.dataset.waTopic;
    if (!topic) return;

    const message = `Olá! Vim pelo site da Vital & Marques e quero falar sobre: ${topic}`;
    link.href = `https://wa.me/556130253145?text=${encodeURIComponent(message)}`;
  });
});

// =========================================================
// Parallax leve para elementos estratégicos da hero
// Use data-parallax para aplicar.
// =========================================================
const parallaxItems = document.querySelectorAll('[data-parallax]');

if (parallaxItems.length) {
  const updateParallax = () => {
    const y = window.scrollY;

    parallaxItems.forEach((item, index) => {
      const speed = 0.02 + (index * 0.01);
      const offset = Math.max(-24, y * speed * -0.25);
      item.style.setProperty('--parallax-offset', `${offset}px`);
    });
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
}
