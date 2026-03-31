// =========================================================
// VITAL & MARQUES — INTERAÇÕES GLOBAIS (VERSÃO AVANÇADA)
// Interações modernas com foco em fluidez, personalidade visual
// e performance em desktop/mobile.
// =========================================================

(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const header = qs('#header');
  const mobileBtn = qs('#mobile-btn');
  const mobileMenu = qs('#mobile-menu');
  const yearEl = qs('#year');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let lastY = window.scrollY;
  let ticking = false;

  // ===== SANITIZAÇÃO E VALIDAÇÃO =====
  const sanitizeText = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const validateWhatsAppNumber = (number) => {
    const matches = number.match(/^\d{1,15}$/);
    return matches ? number : null;
  };

  const validateTopic = (topic) => {
    if (!topic || typeof topic !== 'string') return null;
    if (topic.length > 200) return topic.substring(0, 200);
    return sanitizeText(topic);
  };

  const initRoundedFavicon = () => {
    const iconLink = qs('link[rel="icon"]');
    if (!iconLink) return;

    const iconHref = iconLink.getAttribute('href');
    if (!iconHref) return;

    const source = new Image();
    source.decoding = 'async';

    source.onload = () => {
      const size = 64;
      const padding = 2;
      const cornerRadius = 14;

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Faz um crop em quadrado com cantos arredondados (estilo app icon).
      const target = size - (padding * 2);
      const scale = Math.max(target / source.width, target / source.height);
      const drawWidth = source.width * scale;
      const drawHeight = source.height * scale;
      const offsetX = (size - drawWidth) / 2;
      const offsetY = (size - drawHeight) / 2;

      const roundedRectPath = (x, y, width, height, radius) => {
        const r = Math.max(0, Math.min(radius, width / 2, height / 2));
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      roundedRectPath(padding, padding, target, target, cornerRadius);
      ctx.clip();
      ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();

      // Borda sutil para destacar no browser tab sem ficar pesada.
      roundedRectPath(padding, padding, target, target, cornerRadius);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.stroke();

      const roundedHref = canvas.toDataURL('image/png');
      iconLink.setAttribute('href', roundedHref);

      const appleIcon = qs('link[rel="apple-touch-icon"]');
      if (appleIcon) appleIcon.setAttribute('href', roundedHref);
    };

    source.src = iconHref;
  };

  const setYear = () => {
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  };

  const injectDynamicStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        z-index: 2000;
        pointer-events: none;
        transform-origin: 0 50%;
        transform: scaleX(0);
        background: linear-gradient(90deg, #79a3de, #4f7bbf 55%, #2f5fa8);
        box-shadow: 0 0 16px rgba(79, 123, 191, 0.45);
      }

      .site-cursor-glow {
        position: fixed;
        inset: auto;
        width: 240px;
        height: 240px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        mix-blend-mode: screen;
        transform: translate(-50%, -50%);
        transition: opacity .24s ease;
        background: radial-gradient(circle, rgba(110, 151, 214, 0.18) 0%, rgba(110, 151, 214, 0.06) 34%, rgba(110, 151, 214, 0) 70%);
      }

      .has-cursor-glow .site-cursor-glow {
        opacity: 1;
      }

      .magnetic-btn {
        will-change: transform;
        transition: transform .16s ease;
      }

      .tilt-card {
        transform-style: preserve-3d;
        will-change: transform;
        transition: transform .22s ease, box-shadow .22s ease;
      }

      .tilt-card.is-tilting {
        box-shadow: 0 20px 40px rgba(12, 29, 57, 0.2);
      }

      .page-ready .hero h1,
      .page-ready .internal-top h1 {
        animation: titleGlowIn .9s cubic-bezier(.2,.72,.2,1);
      }

      @keyframes titleGlowIn {
        0% {
          opacity: 0;
          transform: translateY(18px);
          filter: blur(8px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      }
    `;
    document.head.appendChild(style);
  };

  const initScrollProgress = () => {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, window.scrollY / max);
      progress.style.transform = `scaleX(${ratio})`;
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    return update;
  };

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  };

  const initMobileMenu = () => {
    if (!mobileBtn || !mobileMenu) return;

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      mobileBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    qsa('a', mobileMenu).forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (event) => {
      if (!mobileMenu.classList.contains('active')) return;
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (mobileMenu.contains(target) || mobileBtn.contains(target)) return;
      closeMenu();
    });
  };

  const initSmoothAnchors = () => {
    qsa('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = qs(href);
        if (!target) return;

        event.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
    });
  };

  const initReveal = () => {
    const revealItems = qsa('.reveal');
    if (!revealItems.length) return;

    const groups = new Map();
    revealItems.forEach((item) => {
      const parentSection = item.closest('section') || document.body;
      const list = groups.get(parentSection) || [];
      list.push(item);
      groups.set(parentSection, list);
    });

    groups.forEach((items) => {
      items.forEach((item, index) => {
        item.style.setProperty('--delay', `${Math.min(index * 60, 320)}ms`);
      });
    });

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add('show'));
      return;
    }

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
  };

  const initFAQ = () => {
    qsa('.faq-q').forEach((button) => {
      button.addEventListener('click', () => {
        const faqItem = button.closest('.faq-item');
        const faqList = button.closest('.faq-list');
        if (!faqItem) return;

        if (faqList) {
          qsa('.faq-item.open', faqList).forEach((openItem) => {
            if (openItem === faqItem) return;
            openItem.classList.remove('open');
            const openButton = qs('.faq-q', openItem);
            const openIcon = qs('i', openButton || openItem);
            if (openButton) openButton.setAttribute('aria-expanded', 'false');
            if (openIcon) {
              openIcon.classList.add('fa-plus');
              openIcon.classList.remove('fa-minus');
            }
          });
        }

        const icon = qs('i', button);
        const isOpen = faqItem.classList.toggle('open');
        button.setAttribute('aria-expanded', String(isOpen));

        if (icon) {
          icon.classList.toggle('fa-plus', !isOpen);
          icon.classList.toggle('fa-minus', isOpen);
        }
      });
    });
  };

  const initWhatsAppLinks = () => {
    const whatsappNumber = '556130253145';
    
    // Validar número uma vez
    if (!validateWhatsAppNumber(whatsappNumber)) {
      console.error('WhatsApp number inválido');
      return;
    }

    qsa('[data-wa-topic]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const topic = link.dataset.waTopic;
        const validatedTopic = validateTopic(topic);

        if (!validatedTopic) {
          console.warn('WhatsApp topic inválido ou vazio');
          return;
        }

        const message = `Olá! Vim pelo site da Vital & Marques e quero falar sobre: ${validatedTopic}`;
        link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      });
    });
  };

  const initPortalFallback = () => {
    const fallbackLoginUrl = 'https://onvio.com.br/login/';
    const whatsappNumber = '556130253145';

    const portalSelectors = [
      '.btn-portal',
      '.mobile-nav a',
    ];

    const isPortalLabel = (text) => {
      const value = (text || '').toLowerCase();
      return value.includes('portal do cliente') || value.includes('portal do funcionario');
    };

    const links = qsa(portalSelectors.join(',')).filter((link) => {
      if (!(link instanceof HTMLAnchorElement)) return false;
      return isPortalLabel(link.textContent);
    });

    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const isGenericPortalLink = href.includes('onvio.com.br/login/') || href === '#' || href === '';
      if (!isGenericPortalLink) return;

      link.addEventListener('click', (event) => {
        event.preventDefault();

        const label = (link.textContent || '').toLowerCase();
        const portalType = label.includes('funcionario') ? 'Portal do Funcionario' : 'Portal do Cliente';
        const message = `Ola! Vim pelo site da Vital & Marques e preciso do link de acesso do ${portalType}.`;
        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });

      link.setAttribute('data-portal-fallback', 'true');
      link.setAttribute('href', fallbackLoginUrl);
      link.setAttribute('title', 'Solicite seu acesso com nossa equipe');
    });
  };

  const initParallax = () => {
    if (prefersReducedMotion) return;

    const parallaxItems = qsa('[data-parallax]');
    if (!parallaxItems.length) return;

    const updateParallax = () => {
      const y = window.scrollY;
      parallaxItems.forEach((item, index) => {
        const speed = 0.024 + (index * 0.01);
        const offset = Math.max(-30, y * speed * -0.24);
        item.style.setProperty('--parallax-offset', `${offset}px`);
      });
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
  };

  const initMagneticButtons = () => {
    if (!pointerFine || prefersReducedMotion) return;

    const magneticButtons = qsa('.btn-primary, .btn-secondary, .btn-whatsapp, .btn-portal, .btn-ghost');
    magneticButtons.forEach((button) => {
      button.classList.add('magnetic-btn');

      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
      });

      const reset = () => {
        button.style.transform = '';
      };

      button.addEventListener('pointerleave', reset);
      button.addEventListener('blur', reset);
    });
  };

  const initTiltCards = () => {
    if (!pointerFine || prefersReducedMotion) return;

    const cards = qsa('.feature-card, .premium-card, .plan-card, .service-card, .plan-extra-card, .sobre-processo-item');

    cards.forEach((card) => {
      card.classList.add('tilt-card');

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 8;
        const rotateX = (0.5 - py) * 7;

        card.classList.add('is-tilting');
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  };

  const initCursorGlow = () => {
    if (!pointerFine || prefersReducedMotion) return;

    const glow = document.createElement('div');
    glow.className = 'site-cursor-glow';
    document.body.appendChild(glow);
    document.body.classList.add('has-cursor-glow');

    const moveGlow = (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    };

    window.addEventListener('pointermove', moveGlow, { passive: true });
    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('has-cursor-glow');
    });
    document.addEventListener('mouseenter', () => {
      document.body.classList.add('has-cursor-glow');
    });
  };

  const initScrollLoop = (scrollProgressUpdate) => {
    const onScroll = () => {
      lastY = window.scrollY;
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        setHeaderState(lastY);
        if (scrollProgressUpdate) scrollProgressUpdate();
        ticking = false;
      });
    };

    setHeaderState(lastY);
    if (scrollProgressUpdate) scrollProgressUpdate();
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const initCookieConsent = () => {
    const consentKey = 'vitalemarques_cookie_consent';
    const hasConsent = localStorage.getItem(consentKey);

    if (hasConsent) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-consent show';
    banner.innerHTML = `
      <p>Usamos cookies para melhorar sua experiência no site. Ao continuar navegando, você concorda com nossa <a href="privacidade.html" style="color: #f3dfbc; text-decoration: underline;">Política de Privacidade</a>.</p>
      <button class="cookie-accept">Aceitar</button>
      <button class="cookie-decline">Rejeitar</button>
    `;

    document.body.appendChild(banner);

    const accept = banner.querySelector('.cookie-accept');
    const decline = banner.querySelector('.cookie-decline');

    const handleConsent = (accepted) => {
      localStorage.setItem(consentKey, accepted ? 'accepted' : 'rejected');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 300);
    };

    accept.addEventListener('click', () => handleConsent(true));
    decline.addEventListener('click', () => handleConsent(false));
  };

  const init = () => {
    setYear();
    initRoundedFavicon();
    injectDynamicStyles();

    const scrollProgressUpdate = initScrollProgress();
    initScrollLoop(scrollProgressUpdate);

    initMobileMenu();
    initSmoothAnchors();
    initReveal();
    initFAQ();
    initWhatsAppLinks();
    initPortalFallback();
    initParallax();
    initMagneticButtons();
    initTiltCards();
    initCursorGlow();
    initCookieConsent();

    window.requestAnimationFrame(() => {
      document.body.classList.add('page-ready');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
