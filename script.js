// Initial Data Model for Campus Facilities
// DATA VERSION: bump this to force reset localStorage items
const DATA_VERSION = 'v3_stock10';

const INITIAL_ITEMS = [
  {
    id: 'hdmi-01',
    name: 'Kabel HDMI 2.1 Ultra High Speed (5 Meter)',
    category: 'hdmi',
    specs: 'Support 4K@120Hz / 8K@60Hz, Braided Nylon anti-kusut, Gold-Plated Connector',
    totalStock: 10,
    availableStock: 10,
    location: 'Lab Jaringan & Komputer FST, Kampus IV Tuntungan',
    icon: 'fa-network-wired',
    colorClass: 'badge-hdmi',
    iconColor: '#818cf8',
    condition: 'Sangat Baik'
  },
  {
    id: 'hdmi-02',
    name: 'Kabel HDMI to Type-C Thunderbolt (2 Meter)',
    category: 'hdmi',
    specs: 'Plug-and-play untuk MacBook & Laptop Modern, transmisi 4K 60Hz stabil',
    totalStock: 10,
    availableStock: 10,
    location: 'Pos Sarpras FST Lt. 1, Kampus IV Tuntungan',
    icon: 'fa-cable-car',
    colorClass: 'badge-hdmi',
    iconColor: '#a5b4fc',
    condition: 'Normal'
  },
  {
    id: 'proj-01',
    name: 'Proyektor Epson EB-X51 XGA 3LCD Lumens',
    category: 'proyektor',
    specs: '3,800 ANSI Lumens, Kontras 16.000:1, Dilengkapi remote, kabel power & tas portable',
    totalStock: 10,
    availableStock: 10,
    location: 'Pos Sarpras FST Lt. 1, Kampus IV Tuntungan',
    icon: 'fa-video',
    colorClass: 'badge-proyektor',
    iconColor: '#f472b6',
    condition: 'Optimal / Lensa Bersih'
  },
  {
    id: 'proj-02',
    name: 'Proyektor Mini Portable Anker Nebula DLP',
    category: 'proyektor',
    specs: 'Dilengkapi baterai cadangan & speaker stereo, ideal untuk seminar ruang seminar FST',
    totalStock: 10,
    availableStock: 10,
    location: 'Ruang Riset Mahasiswa FST, Kampus IV Tuntungan',
    icon: 'fa-film',
    colorClass: 'badge-proyektor',
    iconColor: '#f43f5e',
    condition: 'Sangat Baik'
  },
  {
    id: 'cok-01',
    name: 'Cok Sambung / Roll Kabel Uticon 4 Lubang (10 Meter)',
    category: 'coksambung',
    specs: 'Panjang 10M, Switch On/Off per lubang, Arde Kuningan pengaman korsleting, max 2500W',
    totalStock: 10,
    availableStock: 10,
    location: 'Pos Sarpras FST Lt. 1, Kampus IV Tuntungan',
    icon: 'fa-plug-circle-bolt',
    colorClass: 'badge-coksambung',
    iconColor: '#fbbf24',
    condition: 'Layak Pakai'
  },
  {
    id: 'cok-02',
    name: 'Cok Sambung Heavy-Duty Broco 6 Lubang (5 Meter)',
    category: 'coksambung',
    specs: 'Kabel tebal SNI, Dilengkapi surge protector untuk keamanan proyektor & laptop',
    totalStock: 10,
    availableStock: 10,
    location: 'Lab Fisika & Elektronika FST, Kampus IV Tuntungan',
    icon: 'fa-bolt',
    colorClass: 'badge-coksambung',
    iconColor: '#f59e0b',
    condition: 'Sangat Baik'
  }
];

// ============================================================
// MULTI-USER ACCOUNTS DATABASE (localStorage)
// ============================================================
// MULTI-USER ACCOUNTS DATABASE (localStorage)
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
// Migrate existing admin account if outdated name & make all students Ilmu Komputer
accountsDB.forEach(a => {
  if (a.role === 'admin' || a.nim === 'admin') {
    a.name = 'Admin Sarpras FST (Pakdul)';
    a.prodi = 'Koordinator Fasilitas FST Kampus IV Tuntungan';
    a.studentClass = 'Pengelola Sarpras';
  } else if (a.role === 'student') {
    a.prodi = 'S1 Ilmu Komputer (FST)';
    if (!a.studentClass || a.studentClass.startsWith('SI-')) {
      a.studentClass = 'ILKOM-2';
    }
  }
});
function saveAccounts() {
  localStorage.setItem('uinsu_accounts', JSON.stringify(accountsDB));
}
saveAccounts();

// Backward-compat: also keep PRESET_USERS for demo quick-login cards
const PRESET_USERS = {
  student_0: accountsDB.find(a => a.id === 'acct_student_0') || DEFAULT_ACCOUNTS[0],
  student_1: accountsDB.find(a => a.id === 'acct_student_1') || DEFAULT_ACCOUNTS[1],
  admin: accountsDB.find(a => a.role === 'admin') || DEFAULT_ACCOUNTS[2]
};

// Initial Loans Mock Data
const INITIAL_LOANS = [
  {
    id: 'BOOK-FST-001',
    itemId: 'proj-01',
    itemName: 'Proyektor Epson EB-X51 XGA 3LCD Lumens',
    studentName: 'Ahmad Farhan',
    studentNim: '0701222012',
    studentClass: 'ILKOM-1',
    studentProdi: 'S1 Ilmu Komputer (FST)',
    phone: '081234567890',
    qty: 1,
    startTime: '2026-10-14T08:00',
    endTime: '2026-10-14T11:30',
    room: 'Lab Jaringan & Komputasi FST Lt. 2',
    purpose: 'Perkuliahan & Presentasi Kelas',
    notes: 'Kebutuhan presentasi materi Jaringan Komputer',
    status: 'approved', // pending, approved, rejected, returned
    adminNote: 'Disetujui oleh Admin Sarpras FST (Pakdul). Silakan ambil di Pos Sarpras.',
    createdAt: '2026-10-13T08:15'
  },
  {
    id: 'BOOK-FST-002',
    itemId: 'hdmi-01',
    itemName: 'Kabel HDMI 2.1 Ultra High Speed (5 Meter)',
    studentName: 'Ahmad Farhan',
    studentNim: '0701222012',
    studentClass: 'ILKOM-1',
    studentProdi: 'S1 Ilmu Komputer (FST)',
    phone: '081234567890',
    qty: 1,
    startTime: '2026-10-14T13:30',
    endTime: '2026-10-14T16:00',
    room: 'Ruang Kuliah FST-302 Gedung Sains',
    purpose: 'Perkuliahan & Presentasi Kelas',
    notes: 'Untuk proyektor laptop di kelas',
    status: 'pending',
    adminNote: '',
    createdAt: '2026-10-13T10:00'
  },
  {
    id: 'BOOK-FST-003',
    itemId: 'cok-01',
    itemName: 'Cok Sambung / Roll Kabel Uticon 4 Lubang (10 Meter)',
    studentName: 'Siti Nurhaliza',
    studentNim: '0701223088',
    studentClass: 'ILKOM-2',
    studentProdi: 'S1 Ilmu Komputer (FST)',
    phone: '082198765432',
    qty: 1,
    startTime: '2026-10-12T10:00',
    endTime: '2026-10-12T15:00',
    room: 'Ruang Seminar FST Kampus IV Tuntungan',
    purpose: 'Kegiatan Himpunan Mahasiswa (HIMA ILKOM)',
    notes: 'Kebutuhan acara workshop HIMA ILKOM',
    status: 'returned',
    adminNote: 'Telah dikembalikan lengkap dan dicek berfungsi baik.',
    createdAt: '2026-10-12T08:30'
  }
];

// State Management — reset items if data version changed
if (localStorage.getItem('uinsu_data_version') !== DATA_VERSION) {
  localStorage.removeItem('uinsu_items');
  localStorage.removeItem('uinsu_loans');
  localStorage.setItem('uinsu_data_version', DATA_VERSION);
}

let items = JSON.parse(localStorage.getItem('uinsu_items')) || INITIAL_ITEMS;
let loans = JSON.parse(localStorage.getItem('uinsu_loans')) || INITIAL_LOANS;
let currentUser = JSON.parse(localStorage.getItem('uinsu_user')) || null;

// Enforce Auth: Jika belum login, wajib diarahkan ke login.html
if (!currentUser) {
  window.location.replace('login.html');
}

function isLoggedIn() {
  return currentUser !== null;
}
function isAdmin() {
  return isLoggedIn() && currentUser.role === 'admin';
}

// Save helper
function saveState() {
  localStorage.setItem('uinsu_items', JSON.stringify(items));
  localStorage.setItem('uinsu_loans', JSON.stringify(loans));
  if (currentUser) {
    localStorage.setItem('uinsu_user', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('uinsu_user');
  }
  updateUI();
}

// Toast System
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

// Navigation Tabs Handling
const navTabs = document.querySelectorAll('.nav-tab');
navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchView(tab.dataset.target);
  });
});

function switchView(viewId) {
  navTabs.forEach(t => t.classList.toggle('active', t.dataset.target === viewId));
  document.querySelectorAll('.view-panel').forEach(p => {
    p.classList.toggle('active', p.id === viewId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Admin Sub Tabs Handling
const adminSubTabs = document.querySelectorAll('.sub-tab');
adminSubTabs.forEach(sub => {
  sub.addEventListener('click', () => {
    adminSubTabs.forEach(s => s.classList.remove('active'));
    sub.classList.add('active');
    
    document.querySelectorAll('.admin-sub-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === sub.dataset.sub);
    });
  });
});

// Category Filter Handling
let activeCategory = 'all';
const categoryPills = document.querySelectorAll('.category-pills .pill');
categoryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    categoryPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCategory = pill.dataset.category;
    renderCatalog();
  });
});

const searchInput = document.getElementById('catalog-search');
searchInput.addEventListener('input', () => {
  renderCatalog();
});

// Render Catalog Grid
function renderCatalog() {
  const container = document.getElementById('items-grid-container');
  const query = searchInput.value.toLowerCase().trim();

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchText = item.name.toLowerCase().includes(query) ||
                      item.specs.toLowerCase().includes(query) ||
                      item.location.toLowerCase().includes(query);
    return matchCat && matchText;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1;" class="empty-state glass-card">
        <i class="fa-solid fa-magnifying-glass"></i>
        <h3>Fasilitas Tidak Ditemukan</h3>
        <p>Coba kata kunci pencarian lain atau pilih kategori Semua.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isAvailable = item.availableStock > 0;
    const catName = item.category === 'hdmi' ? 'Kabel HDMI' : (item.category === 'proyektor' ? 'Proyektor' : 'Cok Sambung');
    const stockPct = item.totalStock > 0 ? Math.round((item.availableStock / item.totalStock) * 100) : 0;
    const stockBarColor = stockPct > 50 ? '#10b981' : stockPct > 20 ? '#f59e0b' : '#ef4444';
    
    return `
      <div class="equipment-card glass-card" style="${!isAvailable ? 'opacity:0.82; filter:saturate(0.5);' : ''}">
        <div class="card-top">
          <span class="item-badge-category ${item.colorClass}">
            <i class="fa-solid ${item.icon}"></i> ${catName}
          </span>
          <span class="stock-status-pill ${isAvailable ? 'status-ready' : 'status-out'}">
            ${isAvailable
              ? `<i class="fa-solid fa-circle-check"></i> Tersedia: ${item.availableStock}/${item.totalStock}`
              : `<i class="fa-solid fa-ban"></i> STOK HABIS`}
          </span>
          <div class="item-visual-icon" style="color: ${item.iconColor}; position:relative;">
            <i class="fa-solid ${item.icon}"></i>
            ${!isAvailable ? `
              <div style="position:absolute; inset:0; background:rgba(239,68,68,0.18); border-radius:50%; display:flex; align-items:center; justify-content:center;">
              </div>
            ` : ''}
          </div>
        </div>

        ${!isAvailable ? `
          <div style="background: linear-gradient(90deg, #ef4444, #dc2626); color:#fff; text-align:center; padding:8px 0; font-weight:800; font-size:0.88rem; letter-spacing:2px; margin: 0 -1px;">
            <i class="fa-solid fa-triangle-exclamation"></i> STOK HABIS — SEDANG DIPAKAI SEMUA
          </div>
        ` : ''}

        <div class="card-body">
          <h3 class="item-title">${item.name}</h3>
          <p class="item-specs">${item.specs}</p>

          <!-- Stok Visual Bar -->
          <div style="margin-bottom: 10px;">
            <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted); margin-bottom:4px;">
              <span><i class="fa-solid fa-boxes-stacked"></i> Stok Tersisa</span>
              <strong style="color:${stockBarColor};">${item.availableStock} / ${item.totalStock} Unit</strong>
            </div>
            <div style="height:8px; background:#e2e8f0; border-radius:99px; overflow:hidden;">
              <div style="height:100%; width:${stockPct}%; background:${stockBarColor}; border-radius:99px; transition:width 0.5s ease;"></div>
            </div>
          </div>

          <div class="card-meta-list">
            <div class="meta-row">
              <span><i class="fa-solid fa-location-dot"></i> Lokasi Penyimpanan:</span>
              <span>${item.location}</span>
            </div>
            <div class="meta-row">
              <span><i class="fa-solid fa-shield-heart"></i> Kondisi:</span>
              <span class="text-success">${item.condition || 'Bagus'}</span>
            </div>
          </div>

          <div class="card-footer">
            ${isAvailable
              ? `<button class="btn btn-primary btn-block" onclick="openPinjamModal('${item.id}')">
                  <i class="fa-solid fa-hand-holding-hand"></i> Ajukan Pinjam
                </button>`
              : `<button class="btn btn-block" disabled style="background:linear-gradient(90deg,#ef4444,#dc2626); color:#fff; cursor:not-allowed; opacity:0.85; border:none; padding:10px; border-radius:var(--radius-sm); font-weight:700; font-size:0.9rem;">
                  <i class="fa-solid fa-ban"></i> STOK HABIS
                </button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Modal Logic
function openModal(modalId) {
  document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

// Pinjam Facility Modal
let selectedItemToLoan = null;
function openPinjamModal(itemId) {
  selectedItemToLoan = items.find(i => i.id === itemId);
  if (!selectedItemToLoan) return;

  if (!isLoggedIn()) {
    showToast('Anda harus login terlebih dahulu sebagai Mahasiswa untuk mengajukan peminjaman.', 'error');
    openModal('modal-auth');
    return;
  }

  if (isAdmin()) {
    showToast('Anda sedang login sebagai Admin Sarpras. Silakan beralih ke Akun Mahasiswa untuk mengajukan pinjaman.', 'error');
    return;
  }

  // Verification: Peminjam hanya boleh dari Prodi Ilmu Komputer
  if (currentUser.prodi && !currentUser.prodi.toLowerCase().includes('ilmu komputer')) {
    showToast('Akses ditolak: Peminjaman alat fasilitas hanya diizinkan untuk mahasiswa Program Studi Ilmu Komputer!', 'error');
    return;
  }

  document.getElementById('loan-item-id').value = selectedItemToLoan.id;
  document.getElementById('loan-student-name').value = currentUser.name || '';
  document.getElementById('loan-student-nim').value = currentUser.nim || '';
  document.getElementById('loan-student-class').value = currentUser.studentClass || '';
  
  const prodiSelect = document.getElementById('loan-student-prodi');
  if (currentUser.prodi && Array.from(prodiSelect.options).some(o => o.value === currentUser.prodi)) {
    prodiSelect.value = currentUser.prodi;
  } else {
    prodiSelect.value = 'S1 Ilmu Komputer (FST)';
  }

  document.getElementById('loan-phone').value = currentUser.phone || '';
  document.getElementById('loan-qty').max = selectedItemToLoan.availableStock;
  document.getElementById('loan-qty').value = 1;

  // Set default start time to now, end time to 3 hours later
  const now = new Date();
  const later = new Date(now.getTime() + (3 * 60 * 60 * 1000));
  
  const formatTime = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  document.getElementById('loan-start-time').value = formatTime(now);
  document.getElementById('loan-end-time').value = formatTime(later);

  // Preview Box
  document.getElementById('pinjam-item-preview').innerHTML = `
    <div class="preview-icon"><i class="fa-solid ${selectedItemToLoan.icon}"></i></div>
    <div>
      <h4 style="font-weight:700;">${selectedItemToLoan.name}</h4>
      <div style="font-size:0.8rem; color:var(--text-muted);">
        Stok Tersedia: <b style="color:var(--text-primary);">${selectedItemToLoan.availableStock} unit</b> | Lokasi: ${selectedItemToLoan.location}
      </div>
    </div>
  `;

  openModal('modal-pinjam');
}

// Handle Form Submission Pinjam (Booking Alat FST)
document.getElementById('loan-request-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const qty = parseInt(document.getElementById('loan-qty').value);
  if (qty > selectedItemToLoan.availableStock) {
    showToast('Jumlah unit melebihi stok yang tersedia!', 'error');
    return;
  }

  const studentName = document.getElementById('loan-student-name').value.trim() || currentUser.name;
  const studentNim = document.getElementById('loan-student-nim').value.trim() || currentUser.nim;
  const studentClass = document.getElementById('loan-student-class').value.trim();
  const studentProdi = document.getElementById('loan-student-prodi').value;
  const phone = document.getElementById('loan-phone').value.trim();

  // Update current user cached class/prodi if available
  if (currentUser) {
    currentUser.studentClass = studentClass;
    currentUser.prodi = studentProdi;
    currentUser.phone = phone;
    saveState();
  }

  const newLoan = {
    id: 'BOOK-FST-' + Date.now().toString().slice(-4),
    itemId: selectedItemToLoan.id,
    itemName: selectedItemToLoan.name,
    studentName: studentName,
    studentNim: studentNim,
    studentClass: studentClass,
    studentProdi: studentProdi,
    phone: phone,
    qty: qty,
    startTime: document.getElementById('loan-start-time').value,
    endTime: document.getElementById('loan-end-time').value,
    room: document.getElementById('loan-room').value,
    purpose: document.getElementById('loan-purpose').value,
    notes: document.getElementById('loan-notes').value || '-',
    status: 'pending',
    adminNote: '',
    createdAt: new Date().toISOString()
  };

  loans.unshift(newLoan);
  saveState();
  closeModal('modal-pinjam');
  showToast('Booking berhasil dikirim! Menunggu persetujuan (ACC) dari Admin Sarpras FST.', 'success');
  switchView('view-my-loans');
});

// Render Student "My Loans"
function renderMyLoans() {
  const tbody = document.getElementById('my-loans-body');
  const emptyBox = document.getElementById('my-loans-empty');
  const table = document.getElementById('my-loans-table');

  if (!isLoggedIn()) {
    document.getElementById('my-active-badge').textContent = '0';
    document.getElementById('my-profile-summary').innerHTML = `
      <div class="acc-avatar" style="background:var(--border-color);"><i class="fa-solid fa-user-lock"></i></div>
      <div>
        <div style="font-weight:700;">Tamu (Belum Login)</div>
        <div style="font-size:0.78rem; color:var(--text-muted);"><a href="login.html" style="color:var(--primary); font-weight:600;">Klik di sini untuk Masuk / Daftar</a></div>
      </div>
    `;
    table.classList.add('hidden');
    emptyBox.classList.remove('hidden');
    emptyBox.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-user-lock" style="font-size:2.5rem; color:var(--text-muted); margin-bottom:12px;"></i>
        <h3>Belum Masuk Akun</h3>
        <p>Silakan login terlebih dahulu untuk melihat riwayat dan tiket peminjaman Anda.</p>
        <a href="login.html" class="btn btn-primary btn-sm" style="margin-top:12px; display:inline-flex;">
          <i class="fa-solid fa-right-to-bracket"></i> Masuk Sekarang
        </a>
      </div>
    `;
    return;
  }

  const myLoans = loans.filter(l => l.studentNim === currentUser.nim);
  
  // Update badge
  const activeCount = myLoans.filter(l => l.status === 'pending' || l.status === 'approved').length;
  document.getElementById('my-active-badge').textContent = activeCount;

  // Profile Header Card
  document.getElementById('my-profile-summary').innerHTML = `
    <div class="acc-avatar bg-indigo"><i class="fa-solid fa-graduation-cap"></i></div>
    <div style="flex:1;">
      <div style="font-weight:700;">${currentUser.name} <span class="badge" style="background:var(--primary); color:#fff; font-size:0.75rem; margin-left:6px;">Kelas: ${currentUser.studentClass || '-'}</span></div>
      <div style="font-size:0.78rem; color:var(--text-muted);">NIM: ${currentUser.nim} &bull; ${currentUser.prodi} &bull; FST Kampus IV Tuntungan</div>
    </div>
    <button class="btn btn-outline btn-sm text-danger" onclick="logoutUser()" title="Logout dan Ganti Akun" style="border-color:#fca5a5; font-size:0.8rem;">
      <i class="fa-solid fa-right-from-bracket"></i> Logout / Ganti Akun
    </button>
  `;

  if (myLoans.length === 0) {
    table.classList.add('hidden');
    emptyBox.classList.remove('hidden');
    return;
  }

  table.classList.remove('hidden');
  emptyBox.classList.add('hidden');

  tbody.innerHTML = myLoans.map(loan => {
    let statusClass = 'pending';
    let statusLabel = 'Menunggu Verifikasi';
    let statusIcon = 'fa-hourglass-half';

    if (loan.status === 'approved') {
      statusClass = 'approved';
      statusLabel = 'Disetujui / Aktif';
      statusIcon = 'fa-circle-check';
    } else if (loan.status === 'rejected') {
      statusClass = 'rejected';
      statusLabel = 'Ditolak';
      statusIcon = 'fa-circle-xmark';
    } else if (loan.status === 'returned') {
      statusClass = 'returned';
      statusLabel = 'Sudah Kembali';
      statusIcon = 'fa-rotate-left';
    }

    const formatDateTime = (dtStr) => {
      try {
        const d = new Date(dtStr);
        return d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'});
      } catch(e) {
        return dtStr;
      }
    };

    return `
      <tr>
        <td><strong style="color:var(--secondary);">${loan.id}</strong></td>
        <td>
          <div style="font-weight:600;">${loan.itemName}</div>
          <small class="text-muted">Jumlah: ${loan.qty} Unit</small>
        </td>
        <td>${formatDateTime(loan.startTime)}</td>
        <td>${formatDateTime(loan.endTime)}</td>
        <td>
          <div>${loan.room}</div>
          <small class="text-muted">${loan.purpose}</small>
        </td>
        <td>
          <span class="status-tag ${statusClass}">
            <i class="fa-solid ${statusIcon}"></i> ${statusLabel}
          </span>
          ${loan.adminNote ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Catatan: ${loan.adminNote}</div>` : ''}
        </td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="showDigitalTicket('${loan.id}')">
            <i class="fa-solid fa-qrcode"></i> Tiket Digital
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Render Admin Control Center (jika ada di halaman)
function renderAdmin() {
  const lockedNotice = document.getElementById('admin-locked-notice');
  const adminContent = document.getElementById('admin-content-area');
  if (!lockedNotice || !adminContent) return; // Not on admin view

  const adminActive = isAdmin();
  if (!adminActive) {
    lockedNotice.classList.remove('hidden');
    adminContent.classList.add('hidden');
    return;
  }

  lockedNotice.classList.add('hidden');
  adminContent.classList.remove('hidden');

  // Metrics
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const activeLoans = loans.filter(l => l.status === 'approved');
  const returnedLoans = loans.filter(l => l.status === 'returned');
  const totalStockUnits = items.reduce((acc, curr) => acc + curr.totalStock, 0);

  document.getElementById('adm-count-pending').textContent = pendingLoans.length;
  document.getElementById('adm-count-active').textContent = activeLoans.length;
  document.getElementById('adm-count-done').textContent = returnedLoans.length;
  document.getElementById('adm-count-total-stock').textContent = totalStockUnits;
  document.getElementById('pending-count-badge').textContent = pendingLoans.length;

  // Sub 1: Requests Table
  const reqBody = document.getElementById('admin-requests-body');
  if (loans.length === 0) {
    reqBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Belum ada pengajuan peminjaman sama sekali.</td></tr>`;
  } else {
    reqBody.innerHTML = loans.map(loan => {
      let statusBadge = `<span class="status-tag pending"><i class="fa-solid fa-hourglass"></i> Pending</span>`;
      if (loan.status === 'approved') statusBadge = `<span class="status-tag approved"><i class="fa-solid fa-check"></i> Disetujui</span>`;
      if (loan.status === 'rejected') statusBadge = `<span class="status-tag rejected"><i class="fa-solid fa-xmark"></i> Ditolak</span>`;
      if (loan.status === 'returned') statusBadge = `<span class="status-tag returned"><i class="fa-solid fa-rotate-left"></i> Selesai</span>`;

      let actionButtons = '';
      if (loan.status === 'pending') {
        actionButtons = `
          <button class="btn btn-success btn-sm" onclick="approveLoan('${loan.id}')" title="Setujui (ACC) peminjaman ini">
            <i class="fa-solid fa-circle-check"></i> ACC Peminjaman
          </button>
          <button class="btn btn-danger btn-sm" onclick="rejectLoan('${loan.id}')" title="Tolak peminjaman ini">
            <i class="fa-solid fa-circle-xmark"></i> Tolak
          </button>
        `;
      } else if (loan.status === 'approved') {
        actionButtons = `
          <button class="btn btn-primary btn-sm" onclick="markReturned('${loan.id}')" title="Konfirmasi alat telah dikembalikan">
            <i class="fa-solid fa-box-check"></i> Konfirmasi Kembali
          </button>
        `;
      } else {
        actionButtons = `<span class="text-muted" style="font-size:0.8rem;">Tidak ada aksi</span>`;
      }

      return `
        <tr>
          <td><strong style="color:var(--secondary);">${loan.id}</strong></td>
          <td>
            <div style="font-weight:700; color:var(--text-primary);">${loan.studentName}</div>
            <div style="font-size:0.78rem; color:var(--primary); font-weight:600;"><i class="fa-solid fa-chalkboard-user"></i> Kelas: ${loan.studentClass || '-'}</div>
            <small class="text-muted">NIM: ${loan.studentNim} &bull; ${loan.studentProdi || 'FST'} &bull; WA: ${loan.phone}</small>
          </td>
          <td>
            <div style="font-weight:600;">${loan.itemName}</div>
            <small class="text-muted">${loan.qty} Unit</small>
          </td>
          <td>
            <div style="font-size:0.8rem;">Mulai: ${loan.startTime ? loan.startTime.replace('T', ' ') : '-'}</div>
            <div style="font-size:0.8rem; color:var(--accent-amber);">Batas: ${loan.endTime ? loan.endTime.replace('T', ' ') : '-'}</div>
          </td>
          <td>
            <div style="font-weight:500;">${loan.room}</div>
            <small class="text-muted">${loan.purpose}</small>
          </td>
          <td>${statusBadge}</td>
          <td>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              ${actionButtons}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Sub 2: Inventory Stock Table
  const stockBody = document.getElementById('admin-stock-body');
  stockBody.innerHTML = items.map(item => `
    <tr>
      <td><code>${item.id}</code></td>
      <td>
        <div style="font-weight:600;">${item.name}</div>
        <small class="text-muted">${item.specs}</small>
      </td>
      <td><span class="item-badge-category ${item.colorClass}">${item.category.toUpperCase()}</span></td>
      <td><strong>${item.totalStock}</strong></td>
      <td><span class="${item.availableStock > 0 ? 'text-success' : 'text-danger'}" style="font-weight:700;">${item.availableStock}</span></td>
      <td><span class="badge" style="background:rgba(255,255,255,0.08);">${item.condition || 'Bagus'}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="editItemStock('${item.id}')">
          <i class="fa-solid fa-pen-to-square"></i> Ubah Stok
        </button>
      </td>
    </tr>
  `).join('');

  // Sub 3: Log Reports
  const logBody = document.getElementById('admin-logs-body');
  logBody.innerHTML = loans.map(l => `
    <tr>
      <td>${new Date(l.createdAt || Date.now()).toLocaleString('id-ID')}</td>
      <td>${l.studentName} (${l.studentNim})</td>
      <td>${l.itemName} (${l.qty} unit)</td>
      <td><span class="status-tag ${l.status}">${l.status.toUpperCase()}</span></td>
      <td>${l.adminNote || '-'}</td>
    </tr>
  `).join('');
}

// Admin Action: Approve (ACC)
function approveLoan(loanId) {
  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  const item = items.find(i => i.id === loan.itemId);
  if (item) {
    if (item.availableStock < loan.qty) {
      showToast('Stok tidak mencukupi untuk di-ACC!', 'error');
      return;
    }
    item.availableStock -= loan.qty;
  }

  loan.status = 'approved';
  loan.adminNote = 'Telah di-ACC oleh Admin Sarpras FST (Pakdul) pada ' + new Date().toLocaleTimeString('id-ID');
  saveState();
  showToast(`Peminjaman ${loan.id} berhasil di-ACC (Disetujui)!`, 'success');
}

// Admin Action: Reject
function rejectLoan(loanId) {
  const reason = prompt('Masukkan alasan penolakan (opsional):', 'Jadwal bertabrakan / stok diprioritaskan');
  if (reason === null) return;

  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  loan.status = 'rejected';
  loan.adminNote = reason || 'Ditolak oleh admin.';
  saveState();
  showToast(`Peminjaman ${loan.id} ditolak.`, 'error');
}

// Admin Action: Returned
function markReturned(loanId) {
  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  const item = items.find(i => i.id === loan.itemId);
  if (item) {
    item.availableStock = Math.min(item.totalStock, item.availableStock + loan.qty);
  }

  loan.status = 'returned';
  loan.adminNote = 'Barang telah diterima kembali dalam kondisi baik.';
  saveState();
  showToast(`Barang pada peminjaman ${loan.id} berhasil dikembalikan ke gudang!`, 'success');
}

// Admin Action: Edit Item Stock
function editItemStock(itemId) {
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  const newStock = prompt(`Ubah Total Stok untuk "${item.name}":`, item.totalStock);
  if (newStock !== null && !isNaN(newStock) && parseInt(newStock) >= 0) {
    const parsed = parseInt(newStock);
    const diff = parsed - item.totalStock;
    item.totalStock = parsed;
    item.availableStock = Math.max(0, item.availableStock + diff);
    saveState();
    showToast(`Stok ${item.name} berhasil diperbarui.`, 'success');
  }
}

// Modal Digital Pass / QR Ticket
function showDigitalTicket(loanId) {
  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  const passContainer = document.getElementById('pass-content');
  const qrData = encodeURIComponent(`CAMPUS-EQUIP-AUTH:${loan.id}:${loan.studentNim}:${loan.status}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

  passContainer.innerHTML = `
    <div class="ticket-container">
      <div class="ticket-header">
        <span class="ticket-id">${loan.id}</span>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Surat Izin Booking PAKDUL UINSU (FST Tuntungan)</div>
      </div>

      <div class="qr-code-box">
        <img src="${qrUrl}" alt="QR Validasi">
      </div>
      <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:12px;">Tunjukkan QR Code ini ke Admin Sarpras (Pakdul) saat pengambilan dan pengembalian alat.</p>

      <div class="ticket-details">
        <div>
          <span class="detail-label">Peminjam:</span>
          <div class="detail-val">${loan.studentName}</div>
        </div>
        <div>
          <span class="detail-label">NIM & Kelas:</span>
          <div class="detail-val">${loan.studentNim} (${loan.studentClass || 'FST'})</div>
        </div>
        <div>
          <span class="detail-label">Program Studi:</span>
          <div class="detail-val">${loan.studentProdi || 'Fakultas Sains & Teknologi'}</div>
        </div>
        <div>
          <span class="detail-label">Alat / Fasilitas:</span>
          <div class="detail-val">${loan.itemName}</div>
        </div>
        <div>
          <span class="detail-label">Jumlah Unit:</span>
          <div class="detail-val">${loan.qty} Unit</div>
        </div>
        <div>
          <span class="detail-label">Ruangan FST:</span>
          <div class="detail-val">${loan.room}</div>
        </div>
        <div>
          <span class="detail-label">Status ACC:</span>
          <div class="detail-val" style="color: ${loan.status === 'approved' ? '#34d399' : '#fbbf24'}; text-transform: uppercase; font-weight:700;">
            ${loan.status === 'approved' ? 'DI-ACC (DISETUJUI)' : (loan.status === 'pending' ? 'MENUNGGU ACC' : loan.status)}
          </div>
        </div>
      </div>

      <div class="ticket-note">
        ${loan.adminNote ? `<b>Catatan Petugas:</b> ${loan.adminNote}` : 'Harap kembalikan tepat waktu sebelum batas berakhir.'}
      </div>
    </div>
    <button class="btn btn-outline btn-block" onclick="window.print()">
      <i class="fa-solid fa-print"></i> Cetak / Simpan PDF
    </button>
  `;

  openModal('modal-digital-pass');
}

// Modal Add New Item (Admin)
document.getElementById('btn-add-item-modal')?.addEventListener('click', () => {
  document.getElementById('inventory-form').reset();
  openModal('modal-inventory');
});

document.getElementById('inventory-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const cat = document.getElementById('inv-category').value;
  const stock = parseInt(document.getElementById('inv-stock').value);

  let icon = 'fa-network-wired';
  let colorClass = 'badge-hdmi';
  let iconColor = '#818cf8';

  if (cat === 'proyektor') {
    icon = 'fa-video';
    colorClass = 'badge-proyektor';
    iconColor = '#f472b6';
  } else if (cat === 'coksambung') {
    icon = 'fa-plug-circle-bolt';
    colorClass = 'badge-coksambung';
    iconColor = '#fbbf24';
  }

  const newItem = {
    id: document.getElementById('inv-code').value.trim() || 'ITEM-' + Date.now().toString().slice(-4),
    name: document.getElementById('inv-name').value.trim(),
    category: cat,
    specs: document.getElementById('inv-specs').value.trim() || 'Spesifikasi standar sarana perkuliahan.',
    totalStock: stock,
    availableStock: stock,
    location: document.getElementById('inv-location').value.trim() || 'Gudang Sarpras',
    icon: icon,
    colorClass: colorClass,
    iconColor: iconColor,
    condition: 'Baru'
  };

  items.push(newItem);
  saveState();
  closeModal('modal-inventory');
  showToast('Fasilitas baru berhasil didaftarkan ke inventaris!', 'success');
});

// Switch Account / Login Trigger — redirect to login page or switch modal
document.getElementById('btn-show-login')?.addEventListener('click', () => {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  } else {
    // If logged in, open account switcher dialog
    openModal('modal-auth');
  }
});

document.getElementById('role-pill-btn')?.addEventListener('click', () => {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  } else {
    openModal('modal-auth');
  }
});

document.getElementById('btn-quick-admin-login')?.addEventListener('click', () => {
  setUser(PRESET_USERS.admin);
  closeModal('modal-auth');
  window.location.href = 'admin.html';
});

// ============================================================
// MODAL AUTH SYSTEM (LOGIN / REGISTRASI DENGAN NIM / DEMO)
// ============================================================
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.auth-panel').forEach(panel => panel.classList.remove('active'));

  const activeBtn = document.getElementById(`auth-tab-btn-${tab}`);
  const activePanel = document.getElementById(`auth-panel-${tab}`);
  if (activeBtn) activeBtn.classList.add('active');
  if (activePanel) activePanel.classList.add('active');
}

// Handle Login in Modal (Index Page)
document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const idVal = document.getElementById('login-identifier').value.trim();
  const passVal = document.getElementById('login-password').value;

  if (!idVal || !passVal) {
    showToast('Silakan isi NIM / Username dan Password!', 'error');
    return;
  }

  const cleanId = idVal.toLowerCase();
  const cleanPass = passVal.trim();
  const acct = accountsDB.find(a =>
    (a.nim.toLowerCase() === cleanId || a.id.toLowerCase() === cleanId || (a.role === 'admin' && cleanId === 'admin')) &&
    a.password === cleanPass
  );

  if (acct) {
    currentUser = acct;
    saveState();
    closeModal('modal-auth');
    showToast(`Berhasil masuk! Selamat datang, ${acct.name}`, 'success');

    if (acct.role === 'admin') {
      setTimeout(() => { window.location.href = 'admin.html'; }, 400);
    }
  } else {
    showToast('NIM / Username atau Password salah! Periksa kembali.', 'error');
  }
});

// Handle Register Student with NIM in Modal (Index Page)
document.getElementById('register-student-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nim = document.getElementById('reg-nim').value.trim();
  const name = document.getElementById('reg-name').value.trim();
  const studentClass = document.getElementById('reg-class').value.trim();
  const prodi = document.getElementById('reg-prodi').value;
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;
  const passwordConfirm = document.getElementById('reg-password-confirm').value;

  if (!nim || !name || !studentClass || !prodi || !phone || !password) {
    showToast('Harap lengkapi semua kolom pendaftaran!', 'error');
    return;
  }

  if (password.length < 4) {
    showToast('Password minimal 4 karakter!', 'error');
    return;
  }

  if (password !== passwordConfirm) {
    showToast('Konfirmasi password tidak cocok!', 'error');
    return;
  }

  // Validate only Ilmu Komputer
  if (!prodi.toLowerCase().includes('ilmu komputer')) {
    showToast('Peminjaman fasilitas saat ini hanya dibuka untuk mahasiswa Prodi Ilmu Komputer!', 'error');
    return;
  }

  // Check duplicate NIM
  if (accountsDB.find(a => a.nim === nim)) {
    showToast('NIM ' + nim + ' sudah terdaftar! Silakan login.', 'error');
    switchAuthTab('login');
    document.getElementById('login-identifier').value = nim;
    return;
  }

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

  // Log in as new student
  currentUser = newAccount;
  saveState();
  closeModal('modal-auth');
  showToast(`Pendaftaran berhasil! Selamat datang di PAKDUL UINSU, ${name}`, 'success');
});

// Preset Selectors (in modal — for switching accounts while logged in)
document.querySelectorAll('.account-card').forEach(card => {
  card.addEventListener('click', () => {
    const role = card.dataset.role;
    if (role === 'admin') {
      setUser(PRESET_USERS.admin);
      closeModal('modal-auth');
      window.location.href = 'admin.html';
    } else {
      const idx = card.dataset.userIdx;
      setUser(PRESET_USERS[`student_${idx}`]);
      closeModal('modal-auth');
      window.location.href = 'index.html';
    }
  });
});

// Logout User — clear session and redirect to login page
function logoutUser() {
  currentUser = null;
  localStorage.removeItem('uinsu_user');
  showToast('Berhasil logout dari akun.', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 400);
}

function setUser(user) {
  currentUser = user;
  saveState();
  showToast(`Beralih akun ke: ${user.name} (${user.role === 'admin' ? 'Admin' : 'Mahasiswa'})`, 'info');
}

// Export CSV for Admin
document.getElementById('btn-export-csv')?.addEventListener('click', () => {
  if (loans.length === 0) {
    showToast('Tidak ada data peminjaman untuk diekspor.', 'error');
    return;
  }
  let csv = 'ID,Nama Mahasiswa,NIM,No HP,Barang,Jumlah,Mulai,Selesai,Ruang,Tujuan,Status,Catatan Admin\n';
  loans.forEach(l => {
    csv += `"${l.id}","${l.studentName}","${l.studentNim}","${l.phone}","${l.itemName}","${l.qty}","${l.startTime}","${l.endTime}","${l.room}","${l.purpose}","${l.status}","${l.adminNote || ''}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rekap_Peminjaman_Kampus_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data peminjaman berhasil diekspor ke CSV!', 'success');
});

// Update Top Navigation Bar Label
function updateNavUser() {
  const label = document.getElementById('nav-user-label');
  const btn = document.getElementById('btn-show-login');
  const logoutBtn = document.getElementById('btn-logout');

  const loginBtn = document.getElementById('btn-nav-login');

  if (!isLoggedIn()) {
    label.textContent = 'Tamu (Belum Login)';
    if (loginBtn) loginBtn.classList.remove('hidden');
    btn.innerHTML = `<i class="fa-solid fa-user-plus"></i> Daftar Akun (NIM)`;
    btn.onclick = () => {
      localStorage.setItem('uinsu_open_tab', 'register');
      window.location.href = 'login.html';
    };
    btn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
  } else if (currentUser.role === 'admin') {
    if (loginBtn) loginBtn.classList.add('hidden');
    label.innerHTML = `<span style="color:#b45309; font-weight:700;"><i class="fa-solid fa-shield-halved"></i> Admin FST: Pakdul</span>`;
    btn.innerHTML = `<i class="fa-solid fa-gauge-high"></i> Dashboard Admin`;
    btn.onclick = () => { window.location.href = 'admin.html'; };
    if (logoutBtn) logoutBtn.classList.remove('hidden');
  } else {
    if (loginBtn) loginBtn.classList.add('hidden');
    label.innerHTML = `<span style="color:#047857; font-weight:700;"><i class="fa-solid fa-user-graduate"></i> Mhs FST: ${currentUser.name} (${currentUser.studentClass || 'FST'})</span>`;
    btn.innerHTML = `<i class="fa-solid fa-id-card"></i> NIM: ${currentUser.nim}`;
    btn.onclick = () => { openModal('modal-auth'); };
    if (logoutBtn) logoutBtn.classList.remove('hidden');
  }

  // Update Hero Stats
  const total = items.reduce((acc, i) => acc + i.totalStock, 0);
  const ready = items.reduce((acc, i) => acc + i.availableStock, 0);
  const loaned = total - ready;

  document.getElementById('stat-total-items').textContent = total;
  document.getElementById('stat-ready-items').textContent = ready;
  document.getElementById('stat-loaned-items').textContent = loaned;
}

// Master UI Update
function updateUI() {
  updateNavUser();
  renderCatalog();
  renderMyLoans();
  renderAdmin();
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
});
