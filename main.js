const revEls = document.querySelectorAll("[data-r]");

if ("IntersectionObserver" in window) {
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: "0px 0px -36px 0px" });

  revEls.forEach((el) => revObs.observe(el));
} else {
  revEls.forEach((el) => el.classList.add("in"));
}

const glFill = document.getElementById("gl-fill");
const gBars = document.querySelectorAll(".gbar");

if ("IntersectionObserver" in window) {
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      setTimeout(() => {
        entry.target.style.width = `${entry.target.dataset.w}%`;
      }, 200);
      barObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  const glObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      setTimeout(() => {
        if (glFill) {
          glFill.style.width = "80%";
        }
      }, 200);
      glObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  gBars.forEach((bar) => barObs.observe(bar));
  if (glFill) {
    glObs.observe(glFill);
  }
} else {
  gBars.forEach((bar) => {
    bar.style.width = `${bar.dataset.w}%`;
  });
  if (glFill) {
    glFill.style.width = "80%";
  }
}

const heroNav = document.getElementById("nav-hero");
const pageNav = document.getElementById("nav-page");
const hero = document.getElementById("hero");
const heroBurger = document.getElementById("burger-hero");
const pageBurger = document.getElementById("burger-page");
const heroMobileNav = document.getElementById("nav-mobile-hero");
const pageMobileNav = document.getElementById("nav-mobile-page");
const rootStyle = getComputedStyle(document.documentElement);
const baseNavTop = parseInt(rootStyle.getPropertyValue("--hero-nav-top"), 10) || 24;
let forcePageNavUntil = 0;

function setNavInteractiveState(container, isActive) {
  if (!container) {
    return;
  }

  container.toggleAttribute("inert", !isActive);
  container.setAttribute("aria-hidden", String(!isActive));
}

function hideMenu(menu, burger) {
  if (menu) {
    menu.classList.remove("open");
  }
  if (burger) {
    burger.setAttribute("aria-expanded", "false");
  }
}

function setHeroNavState(mode) {
  if (mode === "hero") {
    if (heroNav) {
      heroNav.classList.remove("nav-hidden");
      heroNav.classList.add("scrolled");
      heroNav.style.top = `${baseNavTop}px`;
    }

    if (pageNav) {
      pageNav.classList.add("nav-hidden");
    }
    if (pageMobileNav) {
      pageMobileNav.classList.add("nav-hidden");
    }

    setNavInteractiveState(heroNav, true);
    setNavInteractiveState(heroMobileNav, window.innerWidth <= 600);
    setNavInteractiveState(pageNav, false);
    setNavInteractiveState(pageMobileNav, false);
    hideMenu(pageMobileNav, pageBurger);
  } else if (mode === "page") {
    if (heroNav) {
      heroNav.classList.add("nav-hidden");
    }
    if (pageNav) {
      pageNav.classList.remove("nav-hidden");
    }
    if (pageMobileNav) {
      pageMobileNav.classList.remove("nav-hidden");
    }

    setNavInteractiveState(heroNav, false);
    setNavInteractiveState(heroMobileNav, false);
    setNavInteractiveState(pageNav, true);
    setNavInteractiveState(pageMobileNav, window.innerWidth <= 600);
    hideMenu(heroMobileNav, heroBurger);
  } else {
    if (heroNav) {
      heroNav.classList.add("nav-hidden");
    }
    if (pageNav) {
      pageNav.classList.add("nav-hidden");
    }
    if (pageMobileNav) {
      pageMobileNav.classList.add("nav-hidden");
    }

    setNavInteractiveState(heroNav, false);
    setNavInteractiveState(heroMobileNav, false);
    setNavInteractiveState(pageNav, false);
    setNavInteractiveState(pageMobileNav, false);
    hideMenu(heroMobileNav, heroBurger);
    hideMenu(pageMobileNav, pageBurger);
  }
}

function updateHeroNav() {
  const scrollY = window.scrollY;
  const heroHeight = hero ? hero.offsetHeight : 0;
  const navTravel = Math.min(scrollY * 0.18, 18);
  const pageNavStart = Math.max(heroHeight + 88, 0);
  const inHeroPhase = scrollY <= 2;
  const inExitPhase = scrollY > 2 && scrollY < pageNavStart;

  if (Date.now() < forcePageNavUntil && scrollY > 2) {
    if (heroNav) {
      heroNav.style.top = `${baseNavTop}px`;
    }
    setHeroNavState("page");
    return;
  }

  if (inHeroPhase) {
    if (heroNav) {
      heroNav.style.top = `${baseNavTop + navTravel}px`;
    }
    setHeroNavState("hero");
  } else if (inExitPhase) {
    setHeroNavState("hidden");
  } else {
    if (heroNav) {
      heroNav.style.top = `${baseNavTop}px`;
    }
    setHeroNavState("page");
  }
}

window.addEventListener("scroll", updateHeroNav, { passive: true });
window.addEventListener("resize", updateHeroNav);
updateHeroNav();

if (heroBurger && heroMobileNav) {
  heroBurger.addEventListener("click", () => {
    const open = heroMobileNav.classList.toggle("open");
    heroBurger.setAttribute("aria-expanded", String(open));
  });
}

if (pageBurger && pageMobileNav) {
  pageBurger.addEventListener("click", () => {
    const open = pageMobileNav.classList.toggle("open");
    pageBurger.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll(".ml,.nav-mobile a").forEach((link) => {
  link.addEventListener("click", () => {
    hideMenu(heroMobileNav, heroBurger);
    hideMenu(pageMobileNav, pageBurger);
  });
});

function scrollToSection(selector) {
  const target = document.querySelector(selector);
  if (!target) {
    return;
  }

  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
    10
  ) || 56;
  const baseTop = target.getBoundingClientRect().top + window.scrollY;
  let targetTop = baseTop - navHeight - 24;

  if (selector === "#valor") {
    const heroBottom = hero ? hero.offsetHeight : 0;
    targetTop = Math.max(targetTop, heroBottom + 6);
    forcePageNavUntil = Date.now() + 1400;
    setHeroNavState("page");
  }

  window.scrollTo({ top: targetTop, behavior: "smooth" });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function onAnchorClick(event) {
    const id = this.getAttribute("href");
    if (id === "#" || id.startsWith("mailto")) {
      return;
    }

    const target = document.querySelector(id);
    if (!target) {
      return;
    }

    event.preventDefault();
    scrollToSection(id);
  });
});

document.querySelectorAll(".h-chip[data-scroll-to]").forEach((chip) => {
  chip.addEventListener("click", function onChipClick() {
    scrollToSection(this.dataset.scrollTo);
  });
});

const glBtn = document.getElementById("gl-expand-btn");
const glExpand = document.getElementById("gl-expand");
const glClose = document.getElementById("gl-close");
let expanded = false;

if (glBtn && glExpand && glClose) {
  glBtn.addEventListener("click", function onExpandClick() {
    expanded = !expanded;

    if (expanded) {
      glExpand.style.display = "block";
      requestAnimationFrame(() =>
        requestAnimationFrame(() => glExpand.classList.add("open"))
      );
      this.textContent = "Ocultar ←";
      this.style.borderColor = "rgba(255,255,255,.24)";
      this.style.color = "rgba(255,255,255,.72)";
      setTimeout(() => {
        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
          10
        ) || 56;
        const expandTop = glExpand.getBoundingClientRect().top + window.scrollY;
        const targetTop = Math.max(expandTop - navHeight - 20, 0);

        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }, 380);
    } else {
      collapse();
    }
  });

  glClose.addEventListener("click", collapse);
}

function collapse() {
  expanded = false;
  glExpand.classList.remove("open");
  glBtn.textContent = "Ver sistema →";
  glBtn.style.borderColor = "";
  glBtn.style.color = "";
  setTimeout(() => {
    if (!expanded) {
      glExpand.style.display = "none";
    }
  }, 400);
}
