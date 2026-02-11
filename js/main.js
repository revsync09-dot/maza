const translations = {
  de: {
    "nav.home": "Startseite",
    "nav.services": "Leistungen",
    "nav.about": "Über uns",
    "nav.contact": "Kontakt"
  },
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.contact": "Contact"
  },
  es: {
    "nav.home": "Inicio",
    "nav.services": "Servicios",
    "nav.about": "Acerca de",
    "nav.contact": "Contacto"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupLogin();
  setupContactForm();
  setupLanguage();
  setupSmoothScroll();
  setupScrollAnimations();
});

function setupLogin() {
  const overlay = document.getElementById("loginOverlay");
  const guestBtn = document.getElementById("guestBtn");
  const emailForm = document.getElementById("emailForm");
  const socialButtons = document.querySelectorAll(".btn-social");

  if (!overlay) return;

  guestBtn?.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  socialButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const provider = btn.dataset.provider;
      overlay.classList.add("hidden");
      notify(`Anmeldung mit ${provider} erfolgreich`, "success");
    });
  });

  emailForm?.addEventListener("submit", e => {
    e.preventDefault();
    const email = emailForm.querySelector("#email")?.value;
    const password = emailForm.querySelector("#password")?.value;

    if (!email || !password) {
      notify("Bitte alle Felder ausfüllen", "info");
      return;
    }

    overlay.classList.add("hidden");
    notify("Erfolgreich eingeloggt", "success");
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      name: form.querySelector("#name")?.value.trim(),
      phone: form.querySelector("#phone")?.value.trim() || null,
      email: form.querySelector("#email")?.value.trim(),
      subject: form.querySelector("#subject")?.value.trim(),
      message: form.querySelector("#message")?.value.trim(),
      createdAt: new Date().toISOString()
    };

    notify("Vielen Dank! Wir melden uns zeitnah.", "success");
    form.reset();
  });
}

function setupLanguage() {
  const select = document.getElementById("langSelect");
  if (!select) return;

  const saved = localStorage.getItem("lang") || "de";
  select.value = saved;
  applyLanguage(saved);

  select.addEventListener("change", () => {
    const lang = select.value;
    localStorage.setItem("lang", lang);
    applyLanguage(lang);
  });
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang]?.[key]) {
      el.textContent = translations[lang][key];
    }
  });
}

function notify(message, type = "info") {
  const el = document.createElement("div");
  el.className = `notification ${type}`;
  el.textContent = message;

  el.style.position = "fixed";
  el.style.top = "20px";
  el.style.right = "20px";
  el.style.padding = "14px 22px";
  el.style.borderRadius = "8px";
  el.style.color = "#fff";
  el.style.fontWeight = "500";
  el.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
  el.style.zIndex = "2000";
  el.style.background =
    type === "success" ? "#10b981" :
    type === "info" ? "#3b82f6" : "#ef4444";

  document.body.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-10px)";
    el.style.transition = "all 0.3s ease";
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupScrollAnimations() {
  const elements = document.querySelectorAll("[data-aos]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });
}
