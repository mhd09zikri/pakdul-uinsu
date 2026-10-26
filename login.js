// ============================================================
// LOGIN.JS — Authentication Logic for PAKDUL UINSU
// FST Kampus IV Tuntungan — UIN Sumatera Utara Medan
// ============================================================

// ============================================================
// MULTI-USER ACCOUNTS DATABASE
// ============================================================
const DEFAULT_ACCOUNTS = [
  {
    id: 'acct_student_0',
    role: 'student',
    name: 'Ahmad Farhan',
    nim: '0701222012',
    studentClass: 'ILKOM-1',
    prodi: 'S1 Ilmu Komputer (FST)',
    phone: '081234567890',
    password: '123'
  },
  {
    id: 'acct_student_1',
    role: 'student',
    name: 'Siti Nurhaliza',
    nim: '0701223088',
    studentClass: 'ILKOM-2',
    prodi: 'S1 Ilmu Komputer (FST)',
    phone: '082198765432',
    password: '123'
  },
  {
    id: 'acct_admin',
    role: 'admin',
    name: 'Admin Sarpras FST (Pakdul)',
    nim: 'admin',
    nip: '198402122010121003',
    studentClass: 'Pengelola Sarpras',
    prodi: 'Koordinator Fasilitas FST Kampus IV Tuntungan',
    phone: '081122334455',
    password: 'admin'
  }
];

// Load or initialize accounts database
let accountsDB = JSON.parse(localStorage.getItem('uinsu_accounts')) || DEFAULT_ACCOUNTS;
const existingAdmin = accountsDB.find(a => a.role === 'admin' || a.nim === 'admin');
if (existingAdmin) {
  existingAdmin.name = 'Admin Sarpras FST (Pakdul)';
  existingAdmin.prodi = 'Koordinator Fasilitas FST Kampus IV Tuntungan';
  existingAdmin.studentClass = 'Pengelola Sarpras';
}
function saveAccounts() {
  localStorage.setItem('uinsu_accounts', JSON.stringify(accountsDB));
}
saveAccounts();

// ============================================================
// TOAST SYSTEM
// ============================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <div>${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================================
// TAB SWITCHING (Login / Register / Demo)
// ============================================================
let currentTab = 'login';

function switchToTab(tab) {
  currentTab = tab;

  // Hide all forms
  document.getElementById('ig-login-form').classList.remove('ig-form-active');
  document.getElementById('ig-register-form').classList.remove('ig-form-active');
  document.getElementById('ig-demo-panel').classList.remove('ig-form-active');

  // Show target
  if (tab === 'login') {
    document.getElementById('ig-login-form').classList.add('ig-form-active');
    // Re-animate
    document.getElementById('ig-login-form').style.animation = 'none';
    document.getElementById('ig-login-form').offsetHeight; // trigger reflow
    document.getElementById('ig-login-form').style.animation = '';
  } else if (tab === 'register') {
    document.getElementById('ig-register-form').classList.add('ig-form-active');
    document.getElementById('ig-register-form').style.animation = 'none';
    document.getElementById('ig-register-form').offsetHeight;
    document.getElementById('ig-register-form').style.animation = '';
  } else if (tab === 'demo') {
    document.getElementById('ig-demo-panel').classList.add('ig-form-active');
    document.getElementById('ig-demo-panel').style.animation = 'none';
    document.getElementById('ig-demo-panel').offsetHeight;
    document.getElementById('ig-demo-panel').style.animation = '';
  }

  // Update tab buttons
  document.querySelectorAll('.ig-auth-tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`ig-tab-btn-${tab}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update switch card text
  const switchCard = document.getElementById('ig-switch-card');
  if (tab === 'register') {
    switchCard.innerHTML = `<p>Sudah punya akun? <a href="javascript:void(0)" onclick="switchToTab('login')"><strong>Masuk</strong></a></p>`;
  } else {
    switchCard.innerHTML = `<p>Belum punya akun? <a href="javascript:void(0)" onclick="switchToTab('register')"><strong>Daftar Akun Baru (NIM)</strong></a></p>`;
  }
}

// ============================================================
// PASSWORD VISIBILITY TOGGLE & QUICK FILL
// ============================================================
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}

function quickFill(user, pass) {
  const idInput = document.getElementById('ig-login-id');
  const passInput = document.getElementById('ig-login-pass');
  idInput.value = user;
  passInput.value = pass;
  idInput.focus();
  showToast(`Kredensial terisi otomatis: ${user}`, 'info');
}

// ============================================================
// LOGIN FORM HANDLER
// ============================================================
document.getElementById('ig-login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const identifier = document.getElementById('ig-login-id').value.trim();
  const password = document.getElementById('ig-login-pass').value;

  if (!identifier || !password) {
    showToast('Silakan isi NIM/Username dan Password.', 'error');
    return;
  }

  // Show loader
  const btn = document.getElementById('ig-btn-login');
  const btnText = btn.querySelector('.ig-btn-text');
  const btnLoader = btn.querySelector('.ig-btn-loader');
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  btn.disabled = true;

  // Simulate network delay
  setTimeout(() => {
    // Find account (case-insensitive & trimmed)
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();
    const account = accountsDB.find(a =>
      (a.nim.toLowerCase() === cleanId || a.id.toLowerCase() === cleanId || (a.role === 'admin' && cleanId === 'admin')) &&
      a.password === cleanPass
    );

    if (account) {
      // Success
      localStorage.setItem('uinsu_user', JSON.stringify(account));
      showToast(`Selamat datang, ${account.name}!`, 'success');

      // Redirect based on role
      setTimeout(() => {
        if (account.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 400);
    } else {
      // Fail
      showToast('NIM/Username atau Password salah! Silakan periksa kembali.', 'error');
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
      btn.disabled = false;

      // Shake animation
      const card = document.querySelector('.ig-card-main');
      card.style.animation = 'shakeCard 0.4s ease';
      setTimeout(() => card.style.animation = '', 400);
    }
  }, 300);
});

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shakeCard {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

// ============================================================
// REGISTER FORM HANDLER
// ============================================================
document.getElementById('ig-register-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const nim = document.getElementById('ig-reg-nim').value.trim();
  const name = document.getElementById('ig-reg-name').value.trim();
  const studentClass = (document.getElementById('ig-reg-class')?.value || 'FST-1').trim();
  const prodi = document.getElementById('ig-reg-prodi').value.trim();
  const phone = document.getElementById('ig-reg-phone').value.trim();
  const password = document.getElementById('ig-reg-pass').value;
  const confirmPass = document.getElementById('ig-reg-pass-confirm').value;

  if (!nim || !name || !studentClass || !prodi || !phone || !password) {
    showToast('Semua field wajib diisi!', 'error');
    return;
  }

  if (password.length < 4) {
    showToast('Password minimal 4 karakter.', 'error');
    return;
  }

  if (password !== confirmPass) {
    showToast('Password dan konfirmasi tidak cocok!', 'error');
    return;
  }

  // Check duplicate NIM
  if (accountsDB.find(a => a.nim === nim)) {
    showToast('NIM sudah terdaftar! Silakan login.', 'error');
    return;
  }

  // Validate only Ilmu Komputer
  if (!prodi.toLowerCase().includes('ilmu komputer')) {
    showToast('Peminjaman alat saat ini hanya diperuntukkan bagi mahasiswa Prodi Ilmu Komputer!', 'error');
    return;
  }

  // Show loader
  const btn = e.target.querySelector('.ig-btn-primary');
  const btnText = btn.querySelector('.ig-btn-text');
  const btnLoader = btn.querySelector('.ig-btn-loader');
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  btn.disabled = true;

  setTimeout(() => {
    const newAccount = {
      id: 'acct_student_' + Date.now(),
      role: 'student',
      name: name,
      nim: nim,
      studentClass: studentClass,
      prodi: prodi,
      phone: phone,
      password: password
    };

    accountsDB.push(newAccount);
    saveAccounts();

    // Auto-login
    localStorage.setItem('uinsu_user', JSON.stringify(newAccount));

    showToast('Akun berhasil dibuat! Selamat datang di PAKDUL UINSU, ' + name + '!', 'success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  }, 1200);
});

// ============================================================
// DEMO QUICK LOGIN CARDS
// ============================================================
document.querySelectorAll('.ig-demo-card').forEach(card => {
  card.addEventListener('click', () => {
    const role = card.dataset.role;
    let account;

    if (role === 'admin') {
      account = accountsDB.find(a => a.id === 'acct_admin') || DEFAULT_ACCOUNTS[2];
    } else {
      const idx = parseInt(card.dataset.idx);
      const targetId = `acct_student_${idx}`;
      account = accountsDB.find(a => a.id === targetId) || DEFAULT_ACCOUNTS[idx];
    }

    if (account) {
      // Visual feedback: add active state
      card.style.background = '#d1fae5';
      card.style.borderColor = '#059669';
      card.style.transform = 'scale(0.97)';

      localStorage.setItem('uinsu_user', JSON.stringify(account));
      showToast(`Masuk sebagai ${account.name} (${account.role === 'admin' ? 'Admin' : 'Mahasiswa'})`, 'success');

      setTimeout(() => {
        if (account.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 600);
    }
  });
});

// ============================================================
// PHONE SLIDESHOW
// ============================================================
let currentSlide = 0;
const slides = document.querySelectorAll('.ig-slide');
const dots = document.querySelectorAll('.ig-slide-dots .dot');
const totalSlides = slides.length;

function goToSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentSlide = index;
}

function nextSlide() {
  goToSlide((currentSlide + 1) % totalSlides);
}

// Auto rotate
let slideInterval = setInterval(nextSlide, 3500);

// Dot click handlers
dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    goToSlide(idx);
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3500);
  });
});

// ============================================================
// AUTO-REDIRECT IF ALREADY LOGGED IN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const existingUser = JSON.parse(localStorage.getItem('uinsu_user'));
  if (existingUser) {
    if (existingUser.role === 'admin') {
      window.location.href = 'admin.html';
      return;
    } else {
      window.location.href = 'index.html';
      return;
    }
  }

  // Check requested tab (e.g. from register button or URL hash)
  const openTab = localStorage.getItem('uinsu_open_tab') || (window.location.hash ? window.location.hash.replace('#', '') : null);
  if (openTab === 'register' || openTab === 'demo') {
    switchToTab(openTab);
    localStorage.removeItem('uinsu_open_tab');
  }
});
