// =========================================================
// VITAL & MARQUES — INTERAÇÕES GLOBAIS
// Este arquivo controla: header, menu mobile, reveal,
// FAQ accordion, links de WhatsApp e parallax sutil.
// =========================================================

// -------- Referências principais do DOM --------
const header = document.getElementById('header');
const mobileBtn = document.getElementById('mobile-btn');
const mobileMenu = document.getElementById('mobile-menu');
const yearEl = document.getElementById('year');

// Atualiza automaticamente o ano no rodapé
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -------------------------------------------------
// Header dinâmico: reduz e ganha mais contraste no scroll
// -------------------------------------------------
const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 14);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

// -------------------------------------------------
// Menu mobile: abre/fecha, atualiza aria-expanded
// e bloqueia o scroll do body enquanto aberto
// -------------------------------------------------
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

// -------------------------------------------------
// Reveal on scroll com stagger automático
// Dica: adicione classe .reveal em qualquer bloco novo
// -------------------------------------------------
const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item, index) => {
  item.style.setProperty('--delay', `${Math.min(index * 32, 280)}ms`);
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
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('show'));
}

// -------------------------------------------------
// FAQ Accordion: abre/fecha com ícone + / -
// -------------------------------------------------
const faqButtons = document.querySelectorAll('.faq-q');

// Ajusta estado inicial dos itens já abertos no HTML
faqButtons.forEach((button) => {
  const item = button.closest('.faq-item');
  if (!item?.classList.contains('open')) return;
  const icon = button.querySelector('i');
  if (icon) {
    icon.classList.remove('fa-plus');
    icon.classList.add('fa-minus');
  }
  button.setAttribute('aria-expanded', 'true');
});

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;

    const wasOpen = item.classList.contains('open');
    item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(!wasOpen));

    const icon = button.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-plus', wasOpen);
      icon.classList.toggle('fa-minus', !wasOpen);
    }
  });
});

// -------------------------------------------------
// Links de WhatsApp: injeta texto padrão com assunto
// Edite data-wa-topic no HTML para mudar a mensagem
// -------------------------------------------------
const waLinks = document.querySelectorAll('[data-wa-topic]');
waLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const topic = link.dataset.waTopic;
    if (!topic) return;

    const base = 'Olá! Vim pelo site da Vital & Marques e quero falar sobre: ';
    link.href = `https://wa.me/556130253145?text=${encodeURIComponent(base + topic)}`;
  });
});

// -------------------------------------------------
// Parallax sutil para áreas estratégicas (hero)
// Use data-parallax no HTML onde quiser aplicar
// -------------------------------------------------
const parallaxItems = document.querySelectorAll('[data-parallax]');
if (parallaxItems.length) {
  const updateParallax = () => {
    const y = window.scrollY;
    parallaxItems.forEach((el, idx) => {
      const speed = 0.03 + idx * 0.012;
      const offset = Math.max(-22, y * speed * -0.22);
      el.style.setProperty('--parallax-offset', `${offset}px`);
    });
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
}
