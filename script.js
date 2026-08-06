const navLinks = document.querySelectorAll('nav a');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function setTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark-theme', isDark);
  themeToggle.innerHTML = `<span class="theme-icon">${isDark ? '☀' : '☾'}</span>`;
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme');
const defaultTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(defaultTheme);

themeToggle.addEventListener('click', () => {
  setTheme(body.classList.contains('dark-theme') ? 'light' : 'dark');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

window.addEventListener('scroll', () => {
  const header = document.querySelector('.topbar');
  header.classList.toggle('scrolled', window.scrollY > 10);
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));
