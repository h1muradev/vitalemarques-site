(() => {
  const header = document.getElementById("header");
  const mobileBtn = document.getElementById("mobile-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const year = document.getElementById("year");

  // Ano no footer
  if (year) year.textContent = new Date().getFullYear();

  // Header scrolled
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  const closeMenu = () => {
    if (!mobileMenu || !mobileBtn) return;
    mobileMenu.classList.remove("active");
    mobileBtn.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!mobileMenu || !mobileBtn) return;
    mobileMenu.classList.add("active");
    mobileBtn.setAttribute("aria-expanded", "true");
  };

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("active");
      isOpen ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (e) => {
      const clickedInside = mobileMenu.contains(e.target) || mobileBtn.contains(e.target);
      if (!clickedInside) closeMenu();
    });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
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

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }
})();