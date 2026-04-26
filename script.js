const yearEl = document.getElementById("year");
const themeBtn = document.getElementById("themeToggle");
const header = document.getElementById("siteHeader");
const progressBar = document.getElementById("scrollProgress");
const nav = document.getElementById("siteNav");
const menuToggle = document.getElementById("menuToggle");

yearEl.textContent = String(new Date().getFullYear());

const savedTheme = localStorage.getItem("theme");
const isDarkByDefault = savedTheme !== "light";
if (isDarkByDefault) {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
} else {
  themeBtn.textContent = "🌙";
}

themeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
});

if (menuToggle && nav) {
  const closeMenu = () => {
    document.body.classList.remove("mobile-nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("mobile-nav-open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function updateScroll() {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + "%";
  if (header) header.classList.toggle("scrolled", scrollTop > 12);
}

updateScroll();
window.addEventListener("scroll", updateScroll, { passive: true });

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in-view"));
}

if (!prefersReducedMotion) {
  document.querySelectorAll(".project.tilt").forEach((card) => {
    let raf = 0;
    const reset = () => {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
    };

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      const rotY = px * 8;
      const rotX = -py * 8;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });
    });

    card.addEventListener("mouseleave", reset);
  });
}
