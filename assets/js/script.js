(() => {
  const header = document.getElementById("header");
  const mobileBtn = document.getElementById("mobile-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const handleScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
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
      const isOpen = mobileMenu.classList.contains("active");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = mobileMenu.contains(event.target);
      const clickedOnButton = mobileBtn.contains(event.target);

      if (!clickedInsideMenu && !clickedOnButton) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) {
        closeMenu();
      }
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
})();