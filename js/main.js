/* =====================================================
   MAZA — Main JavaScript
   Login, Form Submission, Language Switching
   ===================================================== */

// Language translations (simplified)
const translations = {
  de: {
    'nav.home': 'Startseite',
    'nav.services': 'Leistungen',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
  },
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
  },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initLogin();
  initForms();
  initLanguage();
});

// =====================================================
// LOGIN SYSTEM
// =====================================================

function initLogin() {
  const loginOverlay = document.getElementById('loginOverlay');
  const guestBtn = document.getElementById('guestBtn');
  const socialBtns = document.querySelectorAll('.btn-social');
  const emailForm = document.getElementById('emailForm');

  // Guest access
  guestBtn.addEventListener('click', function() {
    closeLogin();
  });

  // Social login buttons
  socialBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const provider = this.dataset.provider;
      console.log('Sign in with:', provider);
      // Demo: In production, integrate with Supabase
      closeLogin();
      showNotification(`Anmeldung mit ${provider} erfolgreich!`, 'success');
    });
  });

  // Email form submission
  emailForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Email login:', email);
    // Demo: In production, integrate with Supabase Auth
    closeLogin();
    showNotification('Anmeldung erfolgreich!', 'success');
  });
}

function closeLogin() {
  const loginOverlay = document.getElementById('loginOverlay');
  loginOverlay.classList.add('hidden');
}

// =====================================================
// FORM SUBMISSION
// =====================================================

function initForms() {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Collect form data
      const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value || null,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        created_at: new Date().toISOString(),
      };

      // Submit to Supabase (demo mode)
      submitContactForm(formData);
    });
  }
}

function submitContactForm(data) {
  console.log('Submitting contact form:', data);

  // Demo: Show success message
  showNotification('Vielen Dank! Wir melden uns in Kürze bei Ihnen.', 'success');

  // Reset form
  document.getElementById('contactForm').reset();

  // In production, use:
  // window.MazaSupabase.saveContact(data).then(res => {
  //   if (!res.error) {
  //     showNotification('Nachricht erfolgreich versendet!', 'success');
  //     document.getElementById('contactForm').reset();
  //   }
  // });
}

// =====================================================
// LANGUAGE SWITCHING
// =====================================================

function initLanguage() {
  const langSelect = document.getElementById('langSelect');
  const savedLang = localStorage.getItem('mazaLang') || 'de';
  
  if (langSelect) {
    langSelect.value = savedLang;
    applyLanguage(savedLang);
    
    langSelect.addEventListener('change', function() {
      applyLanguage(this.value);
      localStorage.setItem('mazaLang', this.value);
    });
  }
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  
  // Translate UI elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// =====================================================
// UTILITIES
// =====================================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#3b82f6'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 2000;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// AOS (Animate On Scroll) simple implementation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
  observer.observe(el);
});
