// ===========================
// Smooth Scroll
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      const offsetTop = target.offsetTop;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ===========================
// Parallax Effect on Hero Section
// ===========================

function initParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroSection = document.querySelector('.animated-gradient-bg');
  if (!heroSection) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;

        if (scrolled < heroHeight) {
          const opacity = 1 - (scrolled / heroHeight) * 0.8;
          heroSection.style.opacity = Math.max(opacity, 0.2);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===========================
// Enhanced Glow Effects on Hover
// ===========================

function initGlowEffects() {
  const cards = document.querySelectorAll('.glass-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.boxShadow = `
        0 0 40px rgba(124, 58, 237, 0.4),
        0 0 60px rgba(236, 72, 153, 0.3),
        0 15px 50px rgba(0, 0, 0, 0.5)
      `;
    });

    card.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });
}

// ===========================
// Cursor Trail Effect (Optional)
// ===========================

function initCursorTrail() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return; // Skip cursor trail if reduced motion is preferred
  }

  // Only on desktop
  if (window.innerWidth < 768) return;

  let mouseX = 0;
  let mouseY = 0;
  let ballX = 0;
  let ballY = 0;
  let speed = 0.15;

  const ball = document.createElement('div');
  ball.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent);
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: screen;
    filter: blur(10px);
    transition: transform 0.1s ease;
  `;
  document.body.appendChild(ball);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    const distX = mouseX - ballX;
    const distY = mouseY - ballY;

    ballX += distX * speed;
    ballY += distY * speed;

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    requestAnimationFrame(animate);
  }

  animate();
}

// ===========================
// Animated Counter for Stats
// ===========================

function animateCounter(element, target, duration = 2000) {
  let startTime = null;
  const startValue = 0;

  // Add suffix based on target value
  const suffix = target === 95 ? '%' : '+';

  function updateCounter(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth acceleration/deceleration
    const easeOutQuad = progress * (2 - progress);
    const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuad);

    element.textContent = currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + suffix;
    }
  }

  requestAnimationFrame(updateCounter);
}

// ===========================
// Stats Section Intersection Observer
// ===========================

function initStatsObserver() {
  const statsNumbers = document.querySelectorAll('.stat-number');
  if (statsNumbers.length === 0) return;

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const target = parseInt(entry.target.dataset.target);

        if (prefersReducedMotion) {
          // Instant display for reduced motion
          const suffix = target === 95 ? '%' : '+';
          entry.target.textContent = target + suffix;
        } else {
          // Animated counter
          animateCounter(entry.target, target, 2000);
        }

        entry.target.dataset.animated = 'true';
      }
    });
  }, observerOptions);

  statsNumbers.forEach(stat => {
    observer.observe(stat);
  });
}

// ===========================
// Intersection Observer for Fade-in Animations
// ===========================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe cards
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe stats cards
  const statsCards = document.querySelectorAll('.stats-card');
  statsCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    observer.observe(card);
  });

  // Observe features main block
  const featuresBlock = document.querySelector('.features-main-block');
  if (featuresBlock) {
    featuresBlock.style.opacity = '0';
    featuresBlock.style.transform = 'translateY(30px)';
    featuresBlock.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(featuresBlock);
  }

  // Observe footer CTA
  const footerCTA = document.querySelector('.footer-gradient');
  if (footerCTA) {
    footerCTA.style.opacity = '0';
    footerCTA.style.transform = 'translateY(30px)';
    footerCTA.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(footerCTA);
  }
}

// ===========================
// Enhanced Glow for Stats Cards
// ===========================

function initStatsGlowEffects() {
  const statsCards = document.querySelectorAll('.stats-card');

  statsCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.boxShadow = `
        0 0 35px rgba(124, 58, 237, 0.5),
        0 0 60px rgba(167, 139, 250, 0.3),
        0 15px 40px rgba(0, 0, 0, 0.4)
      `;
    });

    card.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });
}

// ===========================
// Deep Parallax for Decorations
// ===========================

function initDeepParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const shapes = document.querySelectorAll('.shape');
  const suits = document.querySelectorAll('.suit, .mini-suit');
  const geoShapes = document.querySelectorAll('.geo-shape');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;

        shapes.forEach((shape, index) => {
          const speed = 0.2 + (index * 0.05);
          shape.style.transform = `translateY(${-(scrolled * speed)}px)`;
        });

        suits.forEach((suit, index) => {
          const speed = 0.1 + (index * 0.03);
          suit.style.transform = `translateY(${-(scrolled * speed)}px) rotate(${scrolled * 0.05}deg)`;
        });

        geoShapes.forEach((shape, index) => {
          const speed = 0.15 + (index * 0.04);
          shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===========================
// Lazy Init Decorations
// ===========================

function lazyInitDecorations() {
  const decorationSections = [
    { selector: '.stats-decoration', threshold: 0.1 },
    { selector: '.features-decoration', threshold: 0.1 }
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.visibility = 'visible';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  decorationSections.forEach(({ selector }) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.opacity = '0';
      element.style.visibility = 'hidden';
      element.style.transition = 'opacity 0.6s ease';
      observer.observe(element);
    }
  });
}

// ===========================
// Keyboard Accessibility Enhancement
// ===========================

function initKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll('a, button, .glass-card');

  interactiveElements.forEach(element => {
    // Add keyboard support for cards
    if (element.classList.contains('glass-card')) {
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'article');

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Could add click behavior if cards are clickable
          element.click();
        }
      });
    }
  });
}

// ===========================
// Performance: Debounce Scroll Events
// ===========================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===========================
// Loading Animation (Optional)
// ===========================

function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  }
}

// ===========================
// Analytics Event Tracking (Placeholder)
// ===========================

function trackCTAClick(buttonText) {
  console.log(`CTA clicked: ${buttonText}`);

  // Add analytics tracking here
  // Example: gtag('event', 'click', { 'event_category': 'CTA', 'event_label': buttonText });
}

// Add click tracking to CTA buttons
document.querySelectorAll('.cta-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const buttonText = button.textContent.trim();
    trackCTAClick(buttonText);
  });
});

// ===========================
// Initialize All Features
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  // Core features
  initParallax();
  initGlowEffects();
  initScrollAnimations();
  initKeyboardNavigation();

  // Stats section features
  initStatsObserver();
  initStatsGlowEffects();

  // NEW: Deep parallax и lazy loading
  initDeepParallax();
  lazyInitDecorations();

  // Performance: пауза анимаций за пределами viewport
  initAnimationPausing();

  // Optional features
  // initCursorTrail(); // Uncomment to enable cursor trail

  // Hide loader when page is fully loaded
  window.addEventListener('load', hideLoader);

  // Log initialization
  console.log('🃏 ДЖОКЕР - Site initialized successfully');
});

// ===========================
// Pause Animations Outside Viewport
// ===========================

function initAnimationPausing() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const containers = document.querySelectorAll(
    '.floating-shapes, .card-suits-decoration, .stats-decoration, .features-decoration, .gradient-orbs, .footer-mini-suits, .hero-title-suits'
  );

  if (containers.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const animatedChildren = entry.target.querySelectorAll(
        '.shape, .suit, .mini-suit, .geo-shape, .neon-line, .particle, .orb, .stats-mini-suit, .footer-mini-suit, .title-suit'
      );
      const state = entry.isIntersecting ? 'running' : 'paused';
      animatedChildren.forEach(child => {
        child.style.animationPlayState = state;
      });
    });
  }, { rootMargin: '100px' });

  containers.forEach(container => observer.observe(container));
}

// ===========================
// Handle Resize Events
// ===========================

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    console.log('Window resized, reinitializing features...');
    // Reinitialize features that depend on viewport size
  }, 250);
});

// ===========================
// Error Handling
// ===========================

window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.message);
});

// ===========================
// Easter Egg: Konami Code
// ===========================

(function() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateEasterEgg() {
    console.log('🃏 Easter egg activated!');
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = '';
    }, 3000);
  }
})();
