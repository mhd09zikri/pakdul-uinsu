// ============================================================
// ADMIN.JS — Dedicated Control Center Logic for PAKDUL UINSU
// FST Kampus IV Tuntungan — UIN Sumatera Utara Medan
// ============================================================

// DATA VERSION — must match script.js
const DATA_VERSION = 'v6_lokasi_administrasi';

// State verification
let currentUser = JSON.parse(localStorage.getItem('uinsu_user')) || null;

// Ensure only admin can access this page
function checkAdminAuth() {
  if (!currentUser || currentUser.role !== 'admin') {
    // If not logged in as admin, alert and redirect to login
    alert('Halaman ini khusus untuk Administrator Sarpras FST (Pakdul). Silakan login dengan akun admin.');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

if (!checkAdminAuth()) {
  throw new Error('Unauthorized');
}

// Default items — 3 Fasilitas Utama Sederhana
const DEFAULT_ITEMS = [
  {
    id: 'proj-01',
    name: 'Proyektor',
    category: 'proyektor',
    specs: 'Lengkap dengan kabel power, kabel VGA/HDMI, dan remote',
    totalStock: 10,
    availableStock: 10,
    location: 'Ruangan Administrasi FST',
    icon: 'fa-video',
    colorClass: 'badge-proyektor',
    iconColor: '#f472b6',
    condition: 'Optimal / Sangat Baik'
  },
  {
    id: 'hdmi-01',
    name: 'Kabel HDMI',
    category: 'hdmi',
    specs: 'Kabel penghubung proyektor ke laptop',
    totalStock: 10,
    availableStock: 10,
    location: 'Ruangan Administrasi FST',
    icon: 'fa-network-wired',
    colorClass: 'badge-hdmi',
    iconColor: '#818cf8',
    condition: 'Sangat Baik'
  },
  {
    id: 'cok-01',
    name: 'Cok Sambung',
    category: 'coksambung',
    specs: 'Stop kontak / roll kabel untuk kebutuhan listrik di kelas',
    totalStock: 10,
    availableStock: 10,
    location: 'Ruangan Administrasi FST',
    icon: 'fa-plug-circle-bolt',
    colorClass: 'badge-coksambung',
    iconColor: '#fbbf24',
    condition: 'Layak Pakai'
  }
];

const DEFAULT_LOANS = [
  {
    id: 'BOOK-FST-001',
    itemId: 'proj-01',
    itemName: 'Proyektor',
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
    status: 'approved',
    adminNote: 'Disetujui oleh Admin Sarpras FST (Pakdul). Silakan ambil di Ruangan Administrasi FST.',
    createdAt: '2026-10-13T08:15'
  },
  {
    id: 'BOOK-FST-002',
    itemId: 'hdmi-01',
    itemName: 'Kabel HDMI',
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
    itemName: 'Cok Sambung',
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

// Reset items jika versi data berubah (sync dengan script.js)
if (localStorage.getItem('uinsu_data_version') !== DATA_VERSION) {
  localStorage.removeItem('uinsu_items');
  localStorage.removeItem('uinsu_loans');
  localStorage.setItem('uinsu_data_version', DATA_VERSION);
}

let items = JSON.parse(localStorage.getItem('uinsu_items')) || DEFAULT_ITEMS;
let loans = JSON.parse(localStorage.getItem('uinsu_loans')) || DEFAULT_LOANS;
if (loans.length === 0) {
  loans = DEFAULT_LOANS;
  localStorage.setItem('uinsu_loans', JSON.stringify(loans));
}
let accountsDB = JSON.parse(localStorage.getItem('uinsu_accounts')) || [];

function saveState() {
  localStorage.setItem('uinsu_items', JSON.stringify(items));
  localStorage.setItem('uinsu_loans', JSON.stringify(loans));
  localStorage.setItem('uinsu_accounts', JSON.stringify(accountsDB));
  renderAdminDashboard();
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

// Modal handling
function openModal(id) {
  document.getElementById(id).classList.add('show');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// Logout Admin
function logoutAdmin() {
  localStorage.removeItem('uinsu_user');
  showToast('Berhasil keluar dari sesi Administrator.', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 600);
}

// Sub-Tabs Switching & Swipe Gestures
const adminSubTabs = document.querySelectorAll('.sub-tab');
const subTabsContainer = document.querySelector('.admin-sub-tabs');

adminSubTabs.forEach(sub => {
  sub.addEventListener('click', () => {
    adminSubTabs.forEach(s => s.classList.remove('active'));
    sub.classList.add('active');
    
    document.querySelectorAll('.admin-sub-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === sub.dataset.sub);
    });

    // Otomatis geser tab yang diklik agar tampak utuh di layar
    try {
      sub.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } catch (e) {
      // Fallback
    }
  });
});

// Gesture Drag / Swipe Touch di Handphone untuk Navigasi Sub-Tab
if (subTabsContainer) {
  let touchStartX = 0;
  let touchStartScroll = 0;

  subTabsContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartScroll = subTabsContainer.scrollLeft;
  }, { passive: true });

  subTabsContainer.addEventListener('touchmove', (e) => {
    const deltaX = touchStartX - e.touches[0].clientX;
    subTabsContainer.scrollLeft = touchStartScroll + deltaX;
  }, { passive: true });
}

// Render Main Admin Dashboard
function renderAdminDashboard() {
  // Metrics
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const activeLoans = loans.filter(l => l.status === 'approved');
  const returnedLoans = loans.filter(l => l.status === 'returned');
  const totalStockUnits = items.reduce((acc, curr) => acc + curr.totalStock, 0);

  document.getElementById('adm-count-pending').textContent = pendingLoans.length;
  document.getElementById('adm-count-active').textContent = activeLoans.length;
  document.getElementById('adm-count-done').textContent = returnedLoans.length;
  document.getElementById('adm-count-total-stock').textContent = totalStockUnits;
  
  const pendingTabBadge = document.getElementById('pending-tab-badge');
  if (pendingTabBadge) {
    pendingTabBadge.textContent = pendingLoans.length;
  }

  // 1. Table: Permohonan Booking Mahasiswa (ACC)
  renderFilteredLoans();
}

// Filter and render loans dynamically
function filterAdminLoans() {
  renderFilteredLoans();
}

function renderFilteredLoans() {
  const reqBody = document.getElementById('admin-requests-body');
  if (!reqBody) return;

  const searchInput = document.getElementById('admin-booking-search');
  const statusFilter = document.getElementById('admin-status-filter');
  
  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
  const filterVal = statusFilter ? statusFilter.value : 'all';

  let filtered = loans.filter(l => {
    // Filter by status
    if (filterVal !== 'all' && l.status !== filterVal) {
      return false;
    }
    // Search query
    if (query) {
      const matchName = (l.studentName || '').toLowerCase().includes(query);
      const matchNim = (l.studentNim || '').toLowerCase().includes(query);
      const matchClass = (l.studentClass || '').toLowerCase().includes(query);
      const matchItem = (l.itemName || '').toLowerCase().includes(query);
      const matchRoom = (l.room || '').toLowerCase().includes(query);
      const matchId = (l.id || '').toLowerCase().includes(query);
      return matchName || matchNim || matchClass || matchItem || matchRoom || matchId;
    }
    return true;
  });

  if (filtered.length === 0) {
    reqBody.innerHTML = `
      <tr>
        <td colspan="7" style="padding:3.5rem 1rem; text-align:center;">
          <div style="display:flex; flex-direction:column; align-items:center; gap:10px; color:var(--text-muted);">
            <div style="width:54px; height:54px; border-radius:50%; background:#f1f5f9; display:flex; align-items:center; justify-content:center;">
              <i class="fa-solid fa-clipboard-question" style="font-size:1.8rem; color:#94a3b8;"></i>
            </div>
            <div style="font-size:1.05rem; font-weight:700; color:var(--text-primary);">Tidak Ada Data Booking Ditemukan</div>
            <div style="font-size:0.85rem; max-width:400px;">
              ${query ? `Pencarian "${query}" tidak cocok dengan nama mahasiswa atau alat manapun.` : 'Belum ada permohonan peminjaman alat yang diajukan oleh mahasiswa.'}
            </div>
          </div>
        </td>
      </tr>`;
    return;
  }

  reqBody.innerHTML = filtered.map(loan => {
    let statusBadge = `<span class="status-tag pending"><i class="fa-solid fa-hourglass-half"></i> Menunggu ACC</span>`;
    if (loan.status === 'approved') statusBadge = `<span class="status-tag approved"><i class="fa-solid fa-circle-check"></i> Sedang Dipinjam</span>`;
    if (loan.status === 'rejected') statusBadge = `<span class="status-tag rejected"><i class="fa-solid fa-circle-xmark"></i> Ditolak</span>`;
    if (loan.status === 'returned') statusBadge = `<span class="status-tag returned"><i class="fa-solid fa-rotate-left"></i> Selesai Kembali</span>`;

    // Student initial for avatar
    const studentInitials = (loan.studentName || 'M').charAt(0).toUpperCase();

    // Equipment icon lookup
    let itemIcon = 'fa-boxes-stacked';
    let itemColor = '#059669';
    if (loan.itemId && loan.itemId.startsWith('proj')) {
      itemIcon = 'fa-video';
      itemColor = '#db2777';
    } else if (loan.itemId && loan.itemId.startsWith('hdmi')) {
      itemIcon = 'fa-network-wired';
      itemColor = '#4f46e5';
    } else if (loan.itemId && loan.itemId.startsWith('cok')) {
      itemIcon = 'fa-plug-circle-bolt';
      itemColor = '#d97706';
    }

    let actionButtons = '';
    if (loan.status === 'pending') {
      actionButtons = `
        <div style="display:flex; flex-direction:column; gap:6px;">
          <button onclick="approveLoan('${loan.id}')" title="Setujui dan serahkan alat ke mahasiswa"
            style="background:#059669; color:#fff; border:none; padding:7px 12px; font-weight:700; border-radius:6px; display:flex; align-items:center; justify-content:center; gap:6px; font-size:0.82rem; cursor:pointer; box-shadow:0 2px 6px rgba(5,150,105,0.25);">
            <i class="fa-solid fa-check"></i> ACC & Pinjamkan
          </button>
          <button onclick="rejectLoan('${loan.id}')" title="Tolak permohonan booking ini"
            style="background:#fff; color:#dc2626; border:1px solid #fca5a5; padding:6px 12px; font-weight:700; border-radius:6px; display:flex; align-items:center; justify-content:center; gap:6px; font-size:0.8rem; cursor:pointer;">
            <i class="fa-solid fa-xmark"></i> Tolak
          </button>
        </div>
      `;
    } else if (loan.status === 'approved') {
      actionButtons = `
        <button onclick="markReturned('${loan.id}')" title="Konfirmasi bahwa mahasiswa telah mengembalikan alat"
          style="background:#2563eb; color:#fff; border:none; padding:8px 12px; font-weight:700; border-radius:6px; display:flex; align-items:center; justify-content:center; gap:6px; font-size:0.82rem; cursor:pointer; width:100%; box-shadow:0 2px 6px rgba(37,99,235,0.25);">
          <i class="fa-solid fa-arrow-rotate-left"></i> Konfirmasi Kembali
        </button>
      `;
    } else {
      actionButtons = `
        <div style="text-align:center;">
          <span style="font-size:0.75rem; color:var(--text-muted); background:#f1f5f9; padding:3px 8px; border-radius:4px; font-weight:600;">
            <i class="fa-solid fa-check-double"></i> Arsip Selesai
          </span>
        </div>
      `;
    }

    const rowHighlight = loan.status === 'pending' ? 'background: #fffdf5; border-left: 3px solid #f59e0b;' : '';

    return `
      <tr style="${rowHighlight}">
        <td>
          <code style="color:#0f172a; background:#f1f5f9; padding:3px 6px; border-radius:4px; font-weight:700; font-size:0.82rem;">${loan.id}</code>
        </td>
        <td>
          <div class="student-badge-card">
            <div class="student-avatar">${studentInitials}</div>
            <div>
              <div class="student-info-name">
                ${loan.studentName}
              </div>
              <div>
                <span class="student-info-class"><i class="fa-solid fa-chalkboard-user"></i> ${loan.studentClass || 'ILKOM'}</span>
                <span style="font-size:0.75rem; color:#64748b; margin-left:4px;">NIM: <strong>${loan.studentNim}</strong></span>
              </div>
              <div class="student-info-nim">
                <i class="fa-brands fa-whatsapp" style="color:#25d366;"></i> ${loan.phone || '-'}
              </div>
            </div>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <i class="fa-solid ${itemIcon}" style="color:${itemColor}; margin-top:3px; font-size:1rem;"></i>
            <div>
              <div style="font-weight:700; color:var(--text-primary); font-size:0.88rem;">${loan.itemName}</div>
              <span style="display:inline-block; margin-top:2px; background:#f0fdf4; color:#059669; border:1px solid #bbf7d0; border-radius:4px; padding:1px 6px; font-size:0.75rem; font-weight:700;">
                ${loan.qty} Unit
              </span>
            </div>
          </div>
        </td>
        <td>
          <div style="font-size:0.82rem; line-height:1.4;">
            <div><i class="fa-regular fa-clock" style="color:#059669;"></i> Mulai: <strong>${loan.startTime ? loan.startTime.replace('T', ' ') : '-'}</strong></div>
            <div style="margin-top:2px;"><i class="fa-regular fa-hourglass" style="color:#ef4444;"></i> Batas: <span style="color:#b45309; font-weight:700;">${loan.endTime ? loan.endTime.replace('T', ' ') : '-'}</span></div>
          </div>
        </td>
        <td>
          <div style="font-weight:700; font-size:0.85rem; color:var(--text-primary);">
            <i class="fa-solid fa-location-dot" style="color:#059669;"></i> ${loan.room || 'Ruang Kuliah FST'}
          </div>
          <small class="text-muted" style="display:block; font-size:0.78rem; line-height:1.3; margin-top:2px;">
            ${loan.purpose || '-'}
          </small>
        </td>
        <td style="text-align:center;">
          ${statusBadge}
          ${loan.adminNote ? `<div style="font-size:0.7rem; color:#64748b; margin-top:4px; max-width:140px; margin-left:auto; margin-right:auto; line-height:1.2;">${loan.adminNote}</div>` : ''}
        </td>
        <td>
          ${actionButtons}
        </td>
      </tr>
    `;
  }).join('');

  // 2. Table: Inventaris Stock
  const stockBody = document.getElementById('admin-stock-body');
  stockBody.innerHTML = items.map(item => {
    const isHabis = item.availableStock <= 0;
    const stockPct = item.totalStock > 0 ? Math.round((item.availableStock / item.totalStock) * 100) : 0;
    const barColor = stockPct > 50 ? '#10b981' : stockPct > 20 ? '#f59e0b' : '#ef4444';
    return `
    <tr ${isHabis ? 'style="background:rgba(239,68,68,0.05);"' : ''}>
      <td><code>${item.id}</code></td>
      <td>
        <div style="font-weight:600;">${item.name}</div>
        <small class="text-muted">${item.specs}</small>
      </td>
      <td><span class="item-badge-category ${item.colorClass}">${item.category.toUpperCase()}</span></td>
      <td><strong>${item.totalStock}</strong></td>
      <td>
        ${isHabis
          ? `<div style="display:inline-flex; align-items:center; gap:5px; background:#fef2f2; border:1px solid #fca5a5; color:#dc2626; border-radius:6px; padding:3px 10px; font-weight:800; font-size:0.85rem;">
               <i class="fa-solid fa-ban"></i> HABIS
             </div>`
          : `<div>
               <span style="color:${barColor}; font-weight:700; font-size:0.95rem;">${item.availableStock}</span>
               <div style="height:6px; background:#e2e8f0; border-radius:99px; margin-top:4px; width:80px; overflow:hidden;">
                 <div style="height:100%; width:${stockPct}%; background:${barColor}; border-radius:99px;"></div>
               </div>
             </div>`
        }
      </td>
      <td><span class="badge" style="background:rgba(0,0,0,0.06);">${item.condition || 'Bagus'}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="editItemStock('${item.id}')">
          <i class="fa-solid fa-pen-to-square"></i> Ubah Stok
        </button>
      </td>
    </tr>
  `}).join('');

  // 3. Table: Data Mahasiswa Terdaftar (NIM)
  const students = accountsDB.filter(a => a.role !== 'admin');
  const studentBadge = document.getElementById('student-count-badge');
  if (studentBadge) {
    studentBadge.textContent = students.length;
  }

  const studentBody = document.getElementById('admin-students-body');
  if (studentBody) {
    if (students.length === 0) {
      studentBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">Belum ada akun mahasiswa yang terdaftar.</td></tr>`;
    } else {
      studentBody.innerHTML = students.map(st => {
        const studentLoans = loans.filter(l => l.studentNim === st.nim);
        const activeCount = studentLoans.filter(l => l.status === 'approved').length;

        return `
          <tr>
            <td>
              <code style="font-weight:700; color:var(--primary); font-size:0.9rem;">${st.nim}</code>
            </td>
            <td>
              <div style="font-weight:700; color:var(--text-primary);">${st.name}</div>
              <small class="text-muted">ID: ${st.id}</small>
            </td>
            <td>
              <span class="badge" style="background:rgba(5, 150, 105, 0.1); color:#059669; font-weight:700;">
                <i class="fa-solid fa-chalkboard-user"></i> ${st.studentClass || '-'}
              </span>
            </td>
            <td>${st.prodi || 'Fakultas Sains & Teknologi'}</td>
            <td>
              <a href="https://wa.me/${(st.phone || '').replace(/^0/, '62')}" target="_blank" style="color:#059669; text-decoration:none; font-weight:600;">
                <i class="fa-brands fa-whatsapp"></i> ${st.phone || '-'}
              </a>
            </td>
            <td>
              <strong>${studentLoans.length} kali</strong>
              ${activeCount > 0 ? `<div style="font-size:0.75rem; color:#d97706;"><i class="fa-solid fa-clock"></i> ${activeCount} aktif</div>` : ''}
            </td>
            <td>
              <span class="status-tag approved" style="font-size:0.78rem;">
                <i class="fa-solid fa-circle-check"></i> Aktif Terdaftar
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // 4. Table: Log Reports
  const logBody = document.getElementById('admin-logs-body');
  logBody.innerHTML = loans.map(l => `
    <tr>
      <td>${new Date(l.createdAt || Date.now()).toLocaleString('id-ID')}</td>
      <td><strong>${l.studentName}</strong> (${l.studentNim} - ${l.studentClass || 'FST'})</td>
      <td>${l.itemName} (${l.qty} unit)</td>
      <td><span class="status-tag ${l.status}">${l.status.toUpperCase()}</span></td>
      <td>${l.adminNote || '-'}</td>
    </tr>
  `).join('');
}

// Actions: Approve (ACC)
function approveLoan(loanId) {
  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  const item = items.find(i => i.id === loan.itemId);
  if (item) {
    if (item.availableStock < loan.qty) {
      showToast('Stok unit alat tidak mencukupi untuk di-ACC!', 'error');
      return;
    }
    item.availableStock -= loan.qty;
  }

  loan.status = 'approved';
  loan.adminNote = 'Telah di-ACC oleh Admin Sarpras FST (Pakdul) pada ' + new Date().toLocaleTimeString('id-ID');
  saveState();
  showToast(`Booking ${loan.id} berhasil di-ACC (Disetujui)!`, 'success');
}

// Actions: Reject
function rejectLoan(loanId) {
  const reason = prompt('Masukkan alasan penolakan booking (opsional):', 'Jadwal pemakaian bentrok / stok terbatas');
  if (reason === null) return;

  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  loan.status = 'rejected';
  loan.adminNote = reason || 'Ditolak oleh Admin Sarpras.';
  saveState();
  showToast(`Booking ${loan.id} ditolak.`, 'error');
}

// Actions: Mark Returned
function markReturned(loanId) {
  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  const item = items.find(i => i.id === loan.itemId);
  if (item) {
    item.availableStock = Math.min(item.totalStock, item.availableStock + loan.qty);
  }

  loan.status = 'returned';
  loan.adminNote = 'Alat telah diterima kembali dalam kondisi baik & lengkap.';
  saveState();
  showToast(`Alat pada booking ${loan.id} berhasil dikembalikan ke inventaris!`, 'success');
}

// Actions: Edit Stock
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
    showToast(`Stok ${item.name} berhasil diperbarui menjadi ${parsed} unit.`, 'success');
  }
}

// Add Item Handlers
document.getElementById('btn-add-item-modal')?.addEventListener('click', () => {
  document.getElementById('inventory-form').reset();
  openModal('modal-inventory');
});
document.getElementById('btn-quick-add-item')?.addEventListener('click', () => {
  document.getElementById('inventory-form').reset();
  openModal('modal-inventory');
});

// Form Tambah Item Baru
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
    id: document.getElementById('inv-code').value.trim() || 'FST-' + Date.now().toString().slice(-4),
    name: document.getElementById('inv-name').value.trim(),
    category: cat,
    specs: document.getElementById('inv-specs').value.trim() || 'Spesifikasi standar sarana perkuliahan FST.',
    totalStock: stock,
    availableStock: stock,
    location: document.getElementById('inv-location').value.trim() || 'Ruangan Administrasi FST',
    icon: icon,
    colorClass: colorClass,
    iconColor: iconColor,
    condition: 'Baru'
  };

  items.push(newItem);
  saveState();
  closeModal('modal-inventory');
  showToast('Alat baru berhasil didaftarkan ke inventaris FST!', 'success');
});

// Export CSV
document.getElementById('btn-admin-export-csv').addEventListener('click', () => {
  if (loans.length === 0) {
    showToast('Tidak ada data booking untuk diekspor.', 'error');
    return;
  }
  let csv = 'ID Booking,Nama Mahasiswa,NIM,Kelas,Prodi,No WA,Alat,Jumlah,Mulai,Selesai,Ruangan,Keperluan,Status,Catatan Admin\n';
  loans.forEach(l => {
    csv += `"${l.id}","${l.studentName}","${l.studentNim}","${l.studentClass || '-'}","${l.studentProdi || 'FST'}","${l.phone}","${l.itemName}","${l.qty}","${l.startTime}","${l.endTime}","${l.room}","${l.purpose}","${l.status}","${l.adminNote || ''}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rekap_Booking_PAKDUL_FST_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data booking berhasil diekspor ke CSV!', 'success');
});

// ============================================================
// SQL DATABASE QUERY CONSOLE (SIMULATOR)
// ============================================================
function setSampleSql(num) {
  const input = document.getElementById('sql-input-query');
  if (!input) return;

  if (num === 1) {
    input.value = "SELECT nim, nama_lengkap, kelas, prodi, no_telepon FROM users WHERE role = 'student';";
  } else if (num === 2) {
    input.value = "SELECT id, nama_barang, kategori, total_stok, tersedia_stok, lokasi_penyimpanan FROM fasilitas WHERE tersedia_stok > 0;";
  } else if (num === 3) {
    input.value = "SELECT id, student_nim, student_nama, student_kelas, fasilitas_id, jumlah_unit, status FROM peminjaman WHERE status = 'pending';";
  } else if (num === 4) {
    input.value = "SELECT id, student_nim, student_nama, fasilitas_id, waktu_mulai, waktu_selesai, lokasi_ruangan, status FROM peminjaman ORDER BY created_at DESC;";
  }
}

function runSqlQuery() {
  const queryInput = document.getElementById('sql-input-query');
  const infoSpan = document.getElementById('sql-exec-info');
  const resultContainer = document.getElementById('sql-result-container');

  const rawQuery = (queryInput?.value || '').trim();
  if (!rawQuery) {
    showToast('Silakan tuliskan perintah query SQL terlebih dahulu!', 'error');
    return;
  }

  const query = rawQuery.replace(/;+$/, '').trim();
  const qUpper = query.toUpperCase();

  const startTime = performance.now();

  try {
    // 1. SELECT queries
    if (qUpper.startsWith('SELECT')) {
      let targetTable = '';
      if (qUpper.includes('FROM USERS')) targetTable = 'users';
      else if (qUpper.includes('FROM FASILITAS')) targetTable = 'fasilitas';
      else if (qUpper.includes('FROM PEMINJAMAN')) targetTable = 'peminjaman';

      if (!targetTable) {
        throw new Error("Tabel tidak dikenali. Gunakan tabel: 'users', 'fasilitas', atau 'peminjaman'.");
      }

      let data = [];
      if (targetTable === 'users') {
        data = accountsDB.map(u => ({
          id: u.id,
          nim: u.nim,
          nama_lengkap: u.name,
          role: u.role,
          kelas: u.studentClass || '-',
          prodi: u.prodi || 'S1 Ilmu Komputer (FST)',
          no_telepon: u.phone || '-'
        }));
      } else if (targetTable === 'fasilitas') {
        data = items.map(i => ({
          id: i.id,
          nama_barang: i.name,
          kategori: i.category,
          total_stok: i.totalStock,
          tersedia_stok: i.availableStock,
          lokasi_penyimpanan: i.location,
          kondisi: i.condition || 'Bagus'
        }));
      } else if (targetTable === 'peminjaman') {
        data = loans.map(l => ({
          id: l.id,
          fasilitas_id: l.itemId,
          student_nim: l.studentNim,
          student_nama: l.studentName,
          student_kelas: l.studentClass || 'ILKOM-1',
          student_prodi: l.studentProdi || 'S1 Ilmu Komputer (FST)',
          jumlah_unit: l.qty,
          waktu_mulai: l.startTime,
          waktu_selesai: l.endTime,
          lokasi_ruangan: l.room,
          keperluan: l.purpose,
          status: l.status,
          created_at: l.createdAt || '-'
        }));
      }

      // Simple WHERE filter simulation
      if (qUpper.includes('WHERE')) {
        const whereClause = qUpper.split('WHERE')[1].split('ORDER BY')[0].trim();
        if (whereClause.includes("ROLE = 'STUDENT'")) {
          data = data.filter(d => d.role === 'student');
        } else if (whereClause.includes("ROLE = 'ADMIN'")) {
          data = data.filter(d => d.role === 'admin');
        } else if (whereClause.includes("TERSEDIA_STOK > 0")) {
          data = data.filter(d => (d.tersedia_stok || 0) > 0);
        } else if (whereClause.includes("STATUS = 'PENDING'")) {
          data = data.filter(d => d.status === 'pending');
        } else if (whereClause.includes("STATUS = 'APPROVED'")) {
          data = data.filter(d => d.status === 'approved');
        } else if (whereClause.includes("STATUS = 'RETURNED'")) {
          data = data.filter(d => d.status === 'returned');
        }
      }

      // Column projection
      const selectPart = query.substring(6, query.toUpperCase().indexOf('FROM')).trim();
      let columns = [];
      if (selectPart === '*') {
        columns = data.length > 0 ? Object.keys(data[0]) : ['id', 'info'];
      } else {
        columns = selectPart.split(',').map(c => c.trim().toLowerCase());
      }

      const elapsed = (performance.now() - startTime).toFixed(2);
      infoSpan.innerHTML = `<span style="color:#059669; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Query Sukses (${data.length} baris data ditemukan &bull; ${elapsed} ms)</span>`;

      if (data.length === 0) {
        resultContainer.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-muted); background:#f8fafc; border-radius:8px;">Query berhasil dieksekusi, 0 baris data cocok.</div>`;
        return;
      }

      let tableHtml = `<table class="custom-table" style="font-size:0.85rem; width:100%;"><thead><tr>`;
      columns.forEach(col => {
        tableHtml += `<th style="background:#0f172a; color:#38bdf8; text-transform:none; font-family:monospace;">${col}</th>`;
      });
      tableHtml += `</tr></thead><tbody>`;

      data.forEach(row => {
        tableHtml += `<tr>`;
        columns.forEach(col => {
          let val = row[col];
          if (val === undefined) val = '-';
          tableHtml += `<td>${val}</td>`;
        });
        tableHtml += `</tr>`;
      });
      tableHtml += `</tbody></table>`;

      resultContainer.innerHTML = tableHtml;
      showToast('Query SQL berhasil dijalankan!', 'success');
      return;
    }

    // 2. UPDATE / INSERT / DELETE simulation
    if (qUpper.startsWith('UPDATE') || qUpper.startsWith('INSERT') || qUpper.startsWith('DELETE')) {
      const elapsed = (performance.now() - startTime).toFixed(2);
      infoSpan.innerHTML = `<span style="color:#059669; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Perintah DML Sukses diproses (&bull; ${elapsed} ms)</span>`;
      resultContainer.innerHTML = `
        <div style="padding:1.5rem; background:#ecfdf5; border:1px solid #6ee7b7; border-radius:8px; color:#065f46;">
          <h4 style="margin-bottom:6px;"><i class="fa-solid fa-circle-check"></i> Query Execution Successful!</h4>
          <p style="font-size:0.85rem; font-family:monospace; margin:0;">${query}</p>
          <small style="display:block; margin-top:8px; color:#047857;">Operasi SQL DML berhasil disimulasikan pada database PAKDUL UINSU.</small>
        </div>
      `;
      showToast('Perintah SQL berhasil dieksekusi!', 'success');
      return;
    }

    throw new Error('Sintaks SQL tidak didukung. Harap gunakan perintah standar SELECT, INSERT, UPDATE, atau DELETE.');

  } catch (err) {
    infoSpan.innerHTML = `<span style="color:#ef4444; font-weight:700;"><i class="fa-solid fa-circle-xmark"></i> Error Query</span>`;
    resultContainer.innerHTML = `
      <div style="padding:1.2rem; background:#fef2f2; border:1px solid #fca5a5; border-radius:8px; color:#991b1b;">
        <strong><i class="fa-solid fa-triangle-exclamation"></i> SQL Syntax Error:</strong>
        <p style="margin:6px 0 0 0; font-size:0.88rem;">${err.message}</p>
      </div>
    `;
    showToast(err.message, 'error');
  }
}

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  renderAdminDashboard();
});

