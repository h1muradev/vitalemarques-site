(() => {
  const header = document.getElementById("header");
  const mobileBtn = document.getElementById("mobile-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const year = document.getElementById("year");
  const heroBg = document.querySelector(".hero-bg, .page-hero-bg");

  if (year) year.textContent = new Date().getFullYear();

  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.07}px)`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const closeMenu = () => {
    if (!mobileMenu || !mobileBtn) return;
    mobileMenu.classList.remove("active");
    mobileBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("active");
      if (isOpen) {
        closeMenu();
      } else {
        mobileMenu.classList.add("active");
        mobileBtn.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => event.key === "Escape" && closeMenu());

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const pageName = document.title.split("|")[0].trim();
  document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
    const topic = link.dataset.waTopic || "Assessoria Contábil";
    const label = link.textContent.replace(/\s+/g, " ").trim() || "Atendimento";
    const text = encodeURIComponent(
      `Olá, equipe Vital & Marques!\n\n` +
      `Vim pelo site e quero falar sobre: ${topic}.\n` +
      `CTA: ${label}.\n` +
      `Página: ${pageName}.\n\n` +
      `Podemos iniciar com uma orientação para o meu cenário?`
    );
    link.href = `https://wa.me/556130253145?text=${text}`;
  });
})();
