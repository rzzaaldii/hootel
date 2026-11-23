// HooTEL JavaScript Interactions

document.addEventListener('DOMContentLoaded', () => {
  // 1. Password visibility toggle (Sign In & Sign Up)
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) {
          icon.classList.toggle('bi-eye');
          icon.classList.toggle('bi-eye-slash');
        }
      }
    });
  });

  // 2. Landing Page Buttons: direct all CTA buttons to sign in page
  if (document.querySelector('.hero-home')) {
    const homeSearchForm = document.querySelector('.hero-home form');
    if (homeSearchForm) {
      homeSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = 'hootel-signin.html';
      });
    }

    const landingActionButtons = document.querySelectorAll(
      '.hero-home .search-bar .field, .hero-home .btn-search, #about .btn-outline-teal, #gallery .btn-book, .hootel-nav .btn-pill'
    );
    landingActionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'hootel-signin.html';
      });
    });
  }

  // 3. Fade-in animation on scroll for Landing Page sections
  const fadeInSections = document.querySelectorAll('.fade-in-section');
  if (fadeInSections.length > 0) {
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      });

      fadeInSections.forEach(section => {
        sectionObserver.observe(section);
      });
    } else {
      fadeInSections.forEach(section => {
        section.classList.add('is-visible');
      });
    }
  }

  // 4. Sign In page: direct to dashboard page on submit
  const signinForm = document.querySelector('.auth-signin form');
  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (signinForm.checkValidity()) {
        window.location.href = 'hootel-dashboard.html';
      } else {
        signinForm.reportValidity();
      }
    });
  }

  // 5. Sign Up page: redirect to sign in page after all biodata fields are filled
  const signupForm = document.querySelector('.auth:not(.auth-signin) form');
  if (signupForm) {
    const pwInput = document.getElementById('pw');
    const pw2Input = document.getElementById('pw2');

    if (pw2Input && pwInput) {
      const validatePasswords = () => {
        if (pwInput.value !== pw2Input.value) {
          pw2Input.setCustomValidity('Passwords do not match');
        } else {
          pw2Input.setCustomValidity('');
        }
      };
      pwInput.addEventListener('input', validatePasswords);
      pw2Input.addEventListener('input', validatePasswords);
    }

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (pwInput && pw2Input && pwInput.value !== pw2Input.value) {
        pw2Input.setCustomValidity('Passwords do not match');
        pw2Input.reportValidity();
        return;
      } else if (pw2Input) {
        pw2Input.setCustomValidity('');
      }

      if (signupForm.checkValidity()) {
        window.location.href = 'hootel-signin.html';
      } else {
        signupForm.reportValidity();
      }
    });
  }

  // 6. Confirm Booking popup animation and redirect to dashboard
  const confirmButtons = document.querySelectorAll('.btn-confirm');
  confirmButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      let popup = document.querySelector('.popup-overlay');
      if (!popup) {
        popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.innerHTML = `
          <div class="popup-card">
            <i class="bi bi-check-circle-fill popup-icon"></i>
            <h3 class="popup-title">Booking Berhasil!</h3>
            <p class="popup-desc">Pemesanan Anda telah berhasil dikonfirmasi. Mengalihkan ke dashboard...</p>
          </div>
        `;
        document.body.appendChild(popup);
      }

      requestAnimationFrame(() => {
        popup.classList.add('show');
      });

      setTimeout(() => {
        window.location.href = 'hootel-dashboard.html';
      }, 2000);
    });
  });
});
