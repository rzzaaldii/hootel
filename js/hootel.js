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

    // Hanya tombol CTA utama (bukan tombol kalender / tamu di search bar)
    const landingActionButtons = document.querySelectorAll(
      '.hero-home .btn-search, #about .btn-outline-teal, #gallery .btn-book, .hootel-nav .btn-pill'
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

  // 7. Kalender Check-in & Check-out (showPicker & Sinkronisasi Label)
  document.querySelectorAll('.field-date-wrap').forEach(wrap => {
    const input = wrap.querySelector('input[type="date"]');
    const btn = wrap.querySelector('.field');
    const label = wrap.querySelector('.checkin-label, .checkout-label');

    // Set batas minimum tanggal mulai hari ini
    if (input) {
      const today = new Date().toISOString().split('T')[0];
      input.min = today;
    }

    // Fungsi membuka kalender bawaan browser
    const triggerCalendar = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!input) return;
      if (typeof input.showPicker === 'function') {
        try {
          input.showPicker();
        } catch (err) {
          input.focus();
        }
      } else {
        input.focus();
      }
    };

    if (btn) btn.addEventListener('click', triggerCalendar);
    wrap.addEventListener('click', (e) => {
      if (e.target !== input) triggerCalendar(e);
    });

    if (input) {
      input.addEventListener('change', () => {
        if (input.value && label) {
          const parts = input.value.split('-');
          if (parts.length === 3) {
            const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            label.textContent = dateObj.toLocaleDateString('en-GB', options);
          }
        }
      });
    }
  });

  // 8. Toggle Dropdown Guest & Room dan Counter Logic
  // 8. Toggle Dropdown Guest & Room dan Counter Logic
  document.querySelectorAll('.field-guest-wrap').forEach(wrap => {
    const toggleBtn = wrap.querySelector('.btn-guest-toggle');
    const dropdown = wrap.querySelector('.guest-dropdown');
    const label = wrap.querySelector('.guest-room-label');
    const guestValEl = wrap.querySelector('.guest-val');
    const roomValEl = wrap.querySelector('.room-val');
    const btnGuestMinus = wrap.querySelector('.btn-guest-minus');
    const btnGuestPlus = wrap.querySelector('.btn-guest-plus');
    const btnRoomMinus = wrap.querySelector('.btn-room-minus');
    const btnRoomPlus = wrap.querySelector('.btn-room-plus');
    const btnApply = wrap.querySelector('.btn-guest-apply');

    let guests = 2;
    let rooms = 1;

    const updateLabel = () => {
      if (guestValEl) guestValEl.textContent = guests;
      if (roomValEl) roomValEl.textContent = rooms;
      if (label) label.textContent = `${guests} Guest, ${rooms} Room`;

      // Redupkan tombol minus jika sudah bernilai minimum (1)
      if (btnGuestMinus) {
        if (guests <= 1) btnGuestMinus.classList.add('disabled');
        else btnGuestMinus.classList.remove('disabled');
      }
      if (btnRoomMinus) {
        if (rooms <= 1) btnRoomMinus.classList.add('disabled');
        else btnRoomMinus.classList.remove('disabled');
      }
    };

    // Inisialisasi awal
    updateLabel();

    const closeDropdown = () => {
      if (dropdown) dropdown.classList.remove('show');
      if (toggleBtn) toggleBtn.classList.remove('active');
    };

    if (toggleBtn && dropdown) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('show');
        document.querySelectorAll('.guest-dropdown.show').forEach(d => d.classList.remove('show'));
        document.querySelectorAll('.btn-guest-toggle.active').forEach(b => b.classList.remove('active'));

        if (!isOpen) {
          dropdown.classList.add('show');
          toggleBtn.classList.add('active');
        } else {
          closeDropdown();
        }
      });

      dropdown.addEventListener('click', (e) => e.stopPropagation());

      if (btnGuestMinus) {
        btnGuestMinus.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (guests > 1) {
            guests--;
            updateLabel();
          }
        });
      }

      if (btnGuestPlus) {
        btnGuestPlus.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          guests++;
          updateLabel();
        });
      }

      if (btnRoomMinus) {
        btnRoomMinus.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (rooms > 1) {
            rooms--;
            updateLabel();
          }
        });
      }

      if (btnRoomPlus) {
        btnRoomPlus.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          rooms++;
          updateLabel();
        });
      }

      // Tombol Selesai
      if (btnApply) {
        btnApply.addEventListener('click', (e) => {
          e.preventDefault();
          closeDropdown();
        });
      }
    }
  });

  // Tutup dropdown jika klik di luar area
  document.addEventListener('click', () => {
    document.querySelectorAll('.guest-dropdown.show').forEach(d => d.classList.remove('show'));
    document.querySelectorAll('.btn-guest-toggle.active').forEach(b => b.classList.remove('active'));
  });
  // Pada Hero Search Form Dashboard: tombol Search tetap menampilkan semua hotel
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Reset pencarian agar semua hotel tetap muncul
      const roomCards = document.querySelectorAll('.room-grid .room-card');
      const search404 = document.getElementById('searchNotFound');
      const notif404 = document.getElementById('notificationNotFound');
      const roomGrid = document.querySelector('.room-grid');
      const heroSection = document.querySelector('.hero');
      if (roomGrid) roomGrid.style.display = '';
      if (search404) search404.style.display = 'none';
      if (notif404) notif404.style.display = 'none';
      if (heroSection) heroSection.style.display = '';
      roomCards.forEach(c => c.style.display = '');
    });
  }

  // FITUR 3 & 4: PENCARIAN DASHBOARD & NOTIFIKASI 404
  const searchInput = document.querySelector('.topbar .searchbox input');
  const roomGrid = document.querySelector('.room-grid');
  const roomCards = document.querySelectorAll('.room-grid .room-card');
  const search404 = document.getElementById('searchNotFound');
  const notif404 = document.getElementById('notificationNotFound');
  const heroSection = document.querySelector('.hero');
  const bellIcon = document.querySelector('.topbar .bell');
  const btnBack = document.getElementById('btnBackToRooms');

  // Fungsi mengembalikan dashboard ke kondisi normal tanpa merusak layout flex
  const showDashboard = () => {
    if (notif404) notif404.style.display = 'none';
    if (search404) search404.style.display = 'none';
    if (heroSection) heroSection.style.display = ''; // Mengembalikan ke display: flex bawaan CSS
    if (roomGrid) roomGrid.style.display = '';       // Mengembalikan ke display: grid bawaan CSS
    roomCards.forEach(c => c.style.display = '');
    if (searchInput) searchInput.value = '';
    if (bellIcon) bellIcon.classList.remove('active');
  };

  // Fungsi menampilkan halaman notifikasi 404 di tengah
  const showNotification = () => {
    if (heroSection) heroSection.style.display = 'none';
    if (roomGrid) roomGrid.style.display = 'none';
    if (search404) search404.style.display = 'none';
    if (notif404) notif404.style.display = 'block';
    if (searchInput) searchInput.value = '';
    if (bellIcon) bellIcon.classList.add('active');
  };

  // 1. Pencarian di Topbar
  if (searchInput && roomCards.length > 0) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();

      // Jika notifikasi sedang terbuka, kembalikan ke dashboard
      if (notif404 && notif404.style.display !== 'none') {
        notif404.style.display = 'none';
        if (heroSection) heroSection.style.display = '';
        if (bellIcon) bellIcon.classList.remove('active');
      }

      let matchCount = 0;
      roomCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = '';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (matchCount === 0) {
        if (roomGrid) roomGrid.style.display = 'none';
        if (search404) search404.style.display = 'block';
      } else {
        if (roomGrid) roomGrid.style.display = '';
        if (search404) search404.style.display = 'none';
      }
    });
  }

  // 2. Bell Notifikasi: Toggle buka/tutup tampilan notifikasi
  if (bellIcon && notif404) {
    bellIcon.addEventListener('click', (e) => {
      e.preventDefault();
      const isNotifOpen = notif404.style.display === 'block';
      if (isNotifOpen) {
        showDashboard();
      } else {
        showNotification();
      }
    });
  }

  // 3. Tombol Kembali ke Dashboard dari Notifikasi
  if (btnBack && notif404) {
    btnBack.addEventListener('click', (e) => {
      e.preventDefault();
      showDashboard();
    });
  }

  // 4. Klik menu Dashboard di Sidebar saat di tampilan notifikasi
  const sidebarDashboardLink = document.querySelector('.sidebar .menu a[href*="dashboard"]');
  if (sidebarDashboardLink) {
    sidebarDashboardLink.addEventListener('click', (e) => {
      const isNotifOpen = notif404 && notif404.style.display === 'block';
      if (isNotifOpen) {
        e.preventDefault();
        showDashboard();
      }
    });
  }
});
