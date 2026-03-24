(() => {
  const header = document.getElementById("header");
  const mobileBtn = document.getElementById("mobile-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const year = document.getElementById("year");
  const heroBg = document.querySelector(".hero-bg, .page-hero-bg");

  if (year) year.textContent = new Date().getFullYear();

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  const handleScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);

    if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.08}px)`;

    const total = document.documentElement.scrollHeight - window.innerHeight;
    const value = total > 0 ? (window.scrollY / total) * 100 : 0;
    progress.style.width = `${Math.min(value, 100)}%`;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  const closeMenu = () => {
    if (!mobileMenu || !mobileBtn) return;
    mobileMenu.classList.remove("active");
    mobileBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!mobileMenu || !mobileBtn) return;
    mobileMenu.classList.add("active");
    mobileBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.contains("active") ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = mobileMenu.contains(event.target);
      const clickedOnButton = mobileBtn.contains(event.target);
      if (!clickedInsideMenu && !clickedOnButton) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const cards = document.querySelectorAll(".service-card, .process-card, .reason-card, .plan-preview-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 960) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  const pageName = document.title.split("|")[0].trim();
  const waLinks = document.querySelectorAll('a[href*="wa.me/"]');

  const buildMessage = (topic, label) => encodeURIComponent(
    `Olá, equipe Vital & Marques!\n\n` +
    `Vim pelo site e quero falar sobre: ${topic}.\n` +
    `Botão clicado: ${label}.\n` +
    `Página: ${pageName}.\n\n` +
    `Podem me enviar uma orientação inicial e próximos passos?`
  );

  waLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const label = link.dataset.waTopic || link.textContent.replace(/\s+/g, " ").trim() || "Atendimento";
      const topic = link.dataset.waTopic || "Assessoria contábil estratégica";
      link.href = `https://wa.me/556130253145?text=${buildMessage(topic, label)}`;
    });
  });
})();
