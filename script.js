const navLinks = document.querySelectorAll('nav a');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';
document.body.appendChild(cursorFollower);

const cursorTrail = document.createElement('div');
cursorTrail.className = 'cursor-trail';
document.body.appendChild(cursorTrail);

const contactButton = document.querySelector('.contact-panel .button.button-large');
const hero = document.querySelector('.hero');
const heroOverlay = hero ? hero.querySelector('.hero-overlay') : null;
const heroButtons = hero ? hero.querySelectorAll('.hero-actions .button') : [];
let isPointerDown = false;
let currentPopped = null;

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

const trailColors = ['rgba(220, 220, 220, 0.9)', 'rgba(200, 200, 200, 0.8)', 'rgba(235, 235, 235, 0.85)', 'rgba(190, 190, 190, 0.8)'];

function spawnTrailDot(x, y) {
  const dot = document.createElement('div');
  dot.className = 'cursor-trail-dot';
  const size = 6 + Math.random() * 4;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;
  dot.style.left = `${x - size / 2}px`;
  dot.style.top = `${y - size / 2}px`;
  dot.style.background = trailColors[Math.floor(Math.random() * trailColors.length)];
  cursorTrail.appendChild(dot);
  dot.addEventListener('animationend', () => dot.remove());
}

window.addEventListener('pointermove', (event) => {
  targetX = event.clientX;
  targetY = event.clientY;
  cursorFollower.style.opacity = '0.95';
  spawnTrailDot(event.clientX, event.clientY);

  if (isPointerDown && contactButton) {
    const hovered = document.elementFromPoint(event.clientX, event.clientY) === contactButton;
    contactButton.classList.toggle('drag-active', hovered);
  }

  if (isPointerDown && hero) {
    const el = document.elementFromPoint(event.clientX, event.clientY);
    const hoveredButton = el && el.closest && el.closest('.hero-actions .button');
    if (hoveredButton && heroButtons && heroButtons.length) {
      if (currentPopped !== hoveredButton) {
        if (currentPopped) currentPopped.classList.remove('pop');
        hoveredButton.classList.add('pop');
        hero.classList.add('blur-active');
        currentPopped = hoveredButton;
      }
    } else {
      if (currentPopped) {
        currentPopped.classList.remove('pop');
        currentPopped = null;
      }
      hero.classList.remove('blur-active');
    }
  }
});

window.addEventListener('pointerdown', () => {
  isPointerDown = true;
  cursorFollower.classList.add('active');
});

window.addEventListener('pointerup', () => {
  isPointerDown = false;
  cursorFollower.classList.remove('active');
  if (contactButton) contactButton.classList.remove('drag-active');
  if (currentPopped) {
    currentPopped.classList.remove('pop');
    currentPopped = null;
  }
  if (hero) hero.classList.remove('blur-active');
});

window.addEventListener('pointerleave', () => {
  cursorFollower.style.opacity = '0';
});

window.addEventListener('pointerenter', () => {
  cursorFollower.style.opacity = '0.95';
});

if (contactButton) {
  contactButton.addEventListener('pointerenter', () => {
    if (isPointerDown) contactButton.classList.add('drag-active');
  });

  contactButton.addEventListener('pointerleave', () => {
    contactButton.classList.remove('drag-active');
  });
}

// Add pointer handlers for hero buttons so they react when dragging over them
if (heroButtons && heroButtons.length) {
  heroButtons.forEach((btn) => {
    btn.addEventListener('pointerenter', (e) => {
      if (isPointerDown) {
        btn.classList.add('pop');
        if (hero) hero.classList.add('blur-active');
        currentPopped = btn;
      }
    });

    btn.addEventListener('pointerleave', () => {
      btn.classList.remove('pop');
      if (hero) hero.classList.remove('blur-active');
      if (currentPopped === btn) currentPopped = null;
    });
  });
}

function animateCursor() {
  currentX += (targetX - currentX) * 0.12;
  currentY += (targetY - currentY) * 0.12;
  cursorFollower.style.left = `${currentX}px`;
  cursorFollower.style.top = `${currentY}px`;
  requestAnimationFrame(animateCursor);
}

animateCursor();

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
