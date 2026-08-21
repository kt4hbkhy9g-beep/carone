// ---------- Header scroll state ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Contact form ----------
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function validateField(field) {
  const wrapper = field.closest('.form-field');
  const isValid = field.checkValidity();
  wrapper.classList.toggle('invalid', !isValid);
  return isValid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const requiredFields = form.querySelectorAll('input[required]');
  let allValid = true;
  requiredFields.forEach(field => {
    if (!validateField(field)) allValid = false;
  });
  if (!allValid) return;

  const data = Object.fromEntries(new FormData(form).entries());

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    // NOTE: replace this with a real endpoint (e.g. your backend, Formspree,
    // Google Sheets webhook, CRM API) to actually receive these leads.
    // For now, leads are kept in the browser's localStorage as a fallback.
    const leads = JSON.parse(localStorage.getItem('lifework_leads') || '[]');
    leads.push({ ...data, submittedAt: new Date().toISOString() });
    localStorage.setItem('lifework_leads', JSON.stringify(leads));

    form.hidden = true;
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Quero receber o link de pagamento';
    alert('Não foi possível enviar seus dados agora. Tente novamente em instantes.');
  }
});

form.querySelectorAll('input[required]').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
});
