/*
   Resume — NATTAWUT SAEDIAW
   Kept from TemplateMo 605: header scroll effect, scroll spy, mobile menu handling.
   Added: reveal on scroll (also starts the skill bars) and the copy-email button.
   Removed: countdown, snowflakes, particles, newsletter.
*/

// Header scroll effect
function handleScroll() {
   const header = document.getElementById('header');
   header.classList.toggle('scrolled', window.scrollY > 50);
}

// Scroll Spy - highlight the nav link of the section on screen
function scrollSpy() {
   const sections = document.querySelectorAll('main section[id]');
   const navLinks = document.querySelectorAll('#mainNav .nav-link');
   if (!sections.length) return;

   const scrollPosition = window.scrollY + 120;
   let currentSection = sections[0].id;

   sections.forEach(section => {
      if (scrollPosition >= section.offsetTop) {
         currentSection = section.id;
      }
   });

   // At the very bottom of the page, the last section is active
   if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      currentSection = sections[sections.length - 1].id;
   }

   navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + currentSection;
      link.classList.toggle('nav-active', isActive);
      if (isActive) {
         link.setAttribute('aria-current', 'true');
      } else {
         link.removeAttribute('aria-current');
      }
   });
}

// Mobile navigation: Bootstrap opens/closes the menu, this closes it after a link is chosen
function setupNavigation() {
   const menu = document.getElementById('mainNav');
   menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
         if (menu.classList.contains('show') && window.bootstrap) {
            bootstrap.Collapse.getOrCreateInstance(menu).hide();
         }
      });
   });
}

// Reveal on scroll: fade-up / slide-in, and skill bars grow when their card appears
function setupReveal() {
   const items = document.querySelectorAll('.reveal');
   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(item => item.classList.add('is-visible'));
      return;
   }

   const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
         }
      });
   }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

   items.forEach(item => observer.observe(item));
}

// Copy email: the address is built from two parts so it is never written out in the page
function setupCopyEmail() {
   const button = document.getElementById('copyEmail');
   const status = document.getElementById('copyStatus');
   if (!button) return;

   const email = button.dataset.user + '@' + button.dataset.domain;
   let timer;

   function showStatus(message) {
      status.textContent = message;
      clearTimeout(timer);
      timer = setTimeout(() => { status.textContent = ''; }, 2500);
   }

   function fallbackCopy() {
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      let ok = false;
      try {
         ok = document.execCommand('copy');
      } catch (err) {
         ok = false;
      }
      document.body.removeChild(field);
      return ok;
   }

   button.addEventListener('click', () => {
      if (navigator.clipboard && window.isSecureContext) {
         navigator.clipboard.writeText(email)
            .then(() => showStatus('Email copied!'))
            .catch(() => showStatus(fallbackCopy() ? 'Email copied!' : 'Could not copy, please copy it from the card.'));
      } else {
         showStatus(fallbackCopy() ? 'Email copied!' : 'Could not copy, please copy it from the card.');
      }
   });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
   setupNavigation();
   setupReveal();
   setupCopyEmail();
   handleScroll();
   scrollSpy();
   window.addEventListener('scroll', () => {
      handleScroll();
      scrollSpy();
   }, { passive: true });
   window.addEventListener('resize', scrollSpy);
});
