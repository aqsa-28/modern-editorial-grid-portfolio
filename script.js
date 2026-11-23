/**
 * =========================================================
 * INISIALISASI IKON LUCIDE & DATA PORTOFOLIO
 * =========================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // Merender seluruh ikon dari library Lucide
  if (window.lucide?.createIcons) window.lucide.createIcons();

  // Data detail proyek untuk ditampilkan di dalam Modal
  const projectsData = [
    {
      category: 'IoT & Real-Time Web App',
      title: 'Tempora IoT Web Dashboard',
      description:
        'Dashboard monitoring perangkat IoT berbasis web yang menampilkan telemetri waktu nyata, kontrol jadwal perangkat jarak jauh, serta analitik konsumsi daya dengan antarmuka responsif.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'WebSockets', 'REST API'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com'
    },
    {
      category: 'Full-Stack E-Commerce',
      title: 'NexStore Digital Commerce',
      description:
        'Platform toko online modern dengan fitur keranjang belanja dinamis, filter katalog produk instan, manajemen stok, dan integrasi gerbang pembayaran otomatis.',
      tech: ['React.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com'
    },
    {
      category: 'SaaS Analytics Platform',
      title: 'TaskFlow Team Workspace',
      description:
        'Aplikasi manajemen tugas dan kolaborasi tim dengan papan Kanban interaktif, pelacakan progres proyek, serta laporan produktivitas mingguan.',
      tech: ['JavaScript ES6', 'Express.js', 'REST API', 'Figma UI'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com'
    }
  ];

  // ============================
  // MICRO-INTERACTIONS: konfigurasi ringan, tanpa library animasi
  // ============================
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const prefersReducedMotion = () => motionQuery.matches;

  // Animasi muncul saat elemen masuk viewport. Tetap terlihat bila JS/observer tidak tersedia.
  if ('IntersectionObserver' in window && !prefersReducedMotion()) {
    const animatedCards = document.querySelectorAll('.bento-card:not(.hero-card)');
    document.body.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

    animatedCards.forEach((card, index) => {
      card.classList.add('motion-enter');
      card.style.setProperty('--reveal-delay', `${(index % 2) * 75}ms`);
      revealObserver.observe(card);
    });
    motionQuery.addEventListener?.('change', (event) => {
      if (event.matches) animatedCards.forEach(card => card.classList.add('is-visible'));
    });
  }

  // Progres scroll dan navbar berubah halus ketika halaman digulir.
  const scrollProgress = document.getElementById('scrollProgress');
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  let scrollScheduled = false;
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  function updateScrollState() {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
    if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
    navbarWrapper?.classList.toggle('is-scrolled', window.scrollY > 28);

    // Indikator section aktif mengikuti posisi scroll (termasuk ketika memakai menu).
    const sections = navAnchors
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    let activeSection = sections[0]?.id;
    const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 280);
    for (const section of sections) {
      if (section.getBoundingClientRect().top + window.scrollY <= marker) {
        activeSection = section.id;
      }
    }
    navAnchors.forEach(link => {
      const isActive = link.getAttribute('href') === `#${activeSection}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollScheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(updateScrollState);
  }, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  updateScrollState();

  // Menu HP: feedback ikon, aria-expanded, dan tutup saat klik di luar.
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const setMenuOpen = (open) => {
    navLinks.classList.toggle('active', open);
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    mobileMenuBtn.setAttribute('aria-label', open ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi');
  };
  mobileMenuBtn.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('active'));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
  document.addEventListener('pointerdown', event => {
    if (!navLinks.classList.contains('active')) return;
    if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  // Cahaya pointer sangat lembut pada hero, hanya untuk mouse/trackpad.
  const heroCard = document.querySelector('.hero-card');
  if (heroCard && finePointer.matches && !prefersReducedMotion()) {
    let heroFrame = null;
    heroCard.addEventListener('pointermove', event => {
      if (heroFrame) return;
      heroFrame = requestAnimationFrame(() => {
        const rect = heroCard.getBoundingClientRect();
        heroCard.style.setProperty('--glow-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        heroCard.style.setProperty('--glow-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
        heroFrame = null;
      });
    }, { passive: true });
  }

  // Ripple pada tombol, hanya ketika benar-benar diklik/ditap.
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .year-badge').forEach(button => {
    button.classList.add('ripple-host');
    button.addEventListener('pointerdown', event => {
      if (prefersReducedMotion()) return;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      ripple.className = 'micro-ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      ripple.setAttribute('aria-hidden', 'true');
      button.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }, { passive: true });
  });

  // ============================
  // Toast: umpan balik salin email
  // ============================
  const toast = document.getElementById('toastNotification');
  let toastTimeout;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3100);
  }
  document.querySelectorAll('.copy-email-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const email = button.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Email ${email} berhasil disalin!`);
      } catch (error) {
        showToast(`Gagal menyalin otomatis. Email: ${email}`);
      }
    });
  });

  // ============================
  // Skills: hover, tap, dan keyboard
  // ============================
  const skillItems = Array.from(document.querySelectorAll('.skill-item'));
  const skillHint = document.getElementById('skillHint');
  const defaultHint = skillHint.textContent;
  let selectedSkill = null;
  function updateSkillHint(item) {
    skillHint.textContent = item?.dataset.skill || defaultHint;
    skillItems.forEach(skill => skill.classList.toggle('is-selected', skill === selectedSkill));
    if (skillHint.animate && !prefersReducedMotion()) {
      skillHint.animate([
        { opacity: 0.65, transform: 'translateY(3px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 220, easing: 'ease-out' });
    }
  }
  skillItems.forEach(item => {
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `${item.innerText.trim()}: ${item.dataset.skill}`);
    item.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') updateSkillHint(item);
    });
    item.addEventListener('pointerleave', () => updateSkillHint(selectedSkill));
    item.addEventListener('focus', () => updateSkillHint(item));
    item.addEventListener('blur', () => updateSkillHint(selectedSkill));
    item.addEventListener('click', () => {
      selectedSkill = selectedSkill === item ? null : item;
      updateSkillHint(selectedSkill);
    });
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item.click();
      }
    });
  });

  // ============================
  // Modal: transisi, Escape, focus trap, kembali ke pemicu
  // ============================
  const projectModal = document.getElementById('projectModal');
  const contactModal = document.getElementById('contactModal');
  let openDialog = null;
  let dialogTrigger = null;
  function showModal(modal, trigger) {
    if (openDialog) hideModal(openDialog, false);
    dialogTrigger = trigger || document.activeElement;
    openDialog = modal;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close')?.focus({ preventScroll: true });
  }
  function hideModal(modal, restoreFocus = true) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    openDialog = null;
    if (restoreFocus) dialogTrigger?.focus?.({ preventScroll: true });
    dialogTrigger = null;
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (openDialog) {
        event.preventDefault();
        hideModal(openDialog);
      } else setMenuOpen(false);
      return;
    }
    if (event.key !== 'Tab' || !openDialog) return;
    const focusable = Array.from(openDialog.querySelectorAll(
      'a[href]:not([tabindex="-1"]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  [projectModal, contactModal].forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) hideModal(modal);
    });
  });
  document.getElementById('closeProjectModal').addEventListener('click', () => hideModal(projectModal));
  document.getElementById('closeContactModal').addEventListener('click', () => hideModal(contactModal));

  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const modalLiveLink = document.getElementById('modalLiveLink');
  const modalRepoLink = document.getElementById('modalRepoLink');
  document.querySelectorAll('.project-item').forEach(card => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', `Buka detail proyek ${card.querySelector('h3')?.textContent || ''}`);
    const openProject = () => {
      const data = projectsData[Number(card.dataset.project)];
      if (!data) return;
      modalCategory.textContent = data.category;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.description;
      modalLiveLink.href = data.liveUrl;
      modalRepoLink.href = data.repoUrl;
      modalTech.replaceChildren(...data.tech.map(tech => {
        const badge = document.createElement('span');
        badge.textContent = tech;
        return badge;
      }));
      showModal(projectModal, card);
    };
    card.addEventListener('click', openProject);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject();
      }
    });
  });

  const openContactModalBtn = document.getElementById('openContactModalBtn');
  const quickContactForm = document.getElementById('quickContactForm');
  openContactModalBtn.addEventListener('click', () => showModal(contactModal, openContactModalBtn));

  // Tidak ada backend pada berkas asli. Buka email client, JANGAN mengklaim pesan sudah terkirim.
  quickContactForm.addEventListener('submit', event => {
    event.preventDefault();
    const senderName = document.getElementById('senderName').value.trim();
    const senderEmail = document.getElementById('senderEmail').value.trim();
    const senderMessage = document.getElementById('senderMessage').value.trim();
    if (!senderName || !senderEmail || !senderMessage) return;
    const recipient = document.querySelector('.copy-email-btn')?.dataset.email || '';
    const subject = encodeURIComponent(`Kerja sama website dari ${senderName}`);
    const body = encodeURIComponent(`Nama: ${senderName}\nEmail: ${senderEmail}\n\n${senderMessage}`);
    hideModal(contactModal);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    showToast('Draf email dibuka. Tekan Kirim di aplikasi email untuk mengirim pesan.');
  });
});
