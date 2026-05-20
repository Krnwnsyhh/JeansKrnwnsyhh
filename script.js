/* ===================================================
   Toko Jeans Keren - JavaScript
   Fitur: Keranjang, Form, Navbar scroll, Reveal animasi
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. NAVBAR SCROLL EFFECT ─────────────────────
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ── 2. KERANJANG BELANJA ─────────────────────────
  let keranjang = []; // array of { nama, qty }

  // Buat elemen keranjang popup & FAB secara dinamis
  const fab = document.createElement('button');
  fab.id = 'cart-fab';
  fab.innerHTML = '🛒<span id="cart-count"></span>';
  fab.setAttribute('aria-label', 'Lihat keranjang');
  document.body.appendChild(fab);

  const popup = document.createElement('div');
  popup.id = 'keranjang-popup';
  popup.innerHTML = `
    <h4>🛒 Keranjang</h4>
    <ul id="keranjang-list"></ul>
    <button id="keranjang-kosong-btn">Kosongkan</button>
  `;
  document.body.appendChild(popup);

  // Buat toast notifikasi
  const toast = document.createElement('div');
  toast.id = 'toast';
  document.body.appendChild(toast);

  const cartCount   = document.getElementById('cart-count');
  const keranjangList = document.getElementById('keranjang-list');
  const kosongBtn   = document.getElementById('keranjang-kosong-btn');

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function updateKeranjangUI() {
    keranjangList.innerHTML = '';

    if (keranjang.length === 0) {
      keranjangList.innerHTML = '<li style="color:var(--text-muted);font-style:italic">Keranjang kosong</li>';
    } else {
      keranjang.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.nama}</span><span>x${item.qty}</span>`;
        keranjangList.appendChild(li);
      });
    }

    const total = keranjang.reduce((sum, i) => sum + i.qty, 0);
    if (total > 0) {
      cartCount.textContent = total;
      cartCount.style.display = 'flex';
    } else {
      cartCount.style.display = 'none';
    }
  }

  // Toggle popup keranjang saat FAB diklik
  fab.addEventListener('click', () => {
    const isShown = popup.classList.toggle('show');
    if (isShown) updateKeranjangUI();
  });

  // Tutup popup kalau klik di luar
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target !== fab) {
      popup.classList.remove('show');
    }
  });

  // Tombol kosongkan
  kosongBtn.addEventListener('click', () => {
    keranjang = [];
    updateKeranjangUI();
    showToast('Keranjang dikosongkan');
    // Reset semua tombol tambah
    document.querySelectorAll('.btn-tambah').forEach(btn => {
      btn.textContent = '+ Tambah';
      btn.classList.remove('added');
    });
  });

  // Tombol "+ Tambah" di setiap baris produk
  document.querySelectorAll('.btn-tambah').forEach(btn => {
    btn.addEventListener('click', () => {
      const nama = btn.getAttribute('data-nama');

      const existing = keranjang.find(i => i.nama === nama);
      if (existing) {
        existing.qty++;
      } else {
        keranjang.push({ nama, qty: 1 });
      }

      // Feedback visual
      btn.textContent = '✓ Ditambah';
      btn.classList.add('added');
      btn.classList.add('pulse');
      setTimeout(() => btn.classList.remove('pulse'), 400);
      setTimeout(() => {
        btn.textContent = '+ Tambah';
        btn.classList.remove('added');
      }, 1400);

      // Animasi FAB
      fab.classList.add('pulse');
      setTimeout(() => fab.classList.remove('pulse'), 400);

      updateKeranjangUI();
      showToast(`${nama} ditambahkan ke keranjang`);
    });
  });


  // ── 3. FORM KONTAK ───────────────────────────────
  const formKontak = document.getElementById('form-kontak');

  formKontak.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = formKontak.querySelectorAll('input, textarea');
    const nama  = inputs[0].value.trim();
    const wa    = inputs[1].value.trim();
    const pesan = inputs[2].value.trim();

    if (!nama || !wa || !pesan) {
      showToastError('Isi semua field terlebih dahulu!');
      return;
    }

    // Format pesan WhatsApp
    const nomorWA   = '6281234567890'; // ganti sesuai nomor toko
    const pesanWA   = encodeURIComponent(
      `Halo Toko Jeans Keren!\n\nNama: ${nama}\nWA: ${wa}\n\nPesan:\n${pesan}`
    );
    const waURL = `https://wa.me/${nomorWA}?text=${pesanWA}`;

    showToast('Mengarahkan ke WhatsApp...');

    setTimeout(() => {
      window.open(waURL, '_blank');
    }, 800);

    formKontak.reset();
  });

  function showToastError(msg) {
    toast.textContent = msg;
    toast.style.background = 'var(--danger)';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.style.background = '';
    }, 2500);
  }


  // ── 4. SCROLL REVEAL ─────────────────────────────
  // Tambahkan class .reveal ke elemen-elemen yang ingin dianimasikan
  const revealTargets = [
    '.section-produk h2',
    '.section-produk .subjudul',
    'table',
    '.section-cara-pesan h2',
    '.section-cara-pesan .subjudul',
    '.langkah-list li',
    '.section-kontak h2',
    '.section-kontak .subjudul',
    '.kontak-info',
    '#form-kontak',
  ];

  const revealEls = document.querySelectorAll(revealTargets.join(', '));
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger untuk list item
    if (el.closest('.langkah-list')) {
      el.style.transitionDelay = `${i * 0.08}s`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


  // ── 5. SMOOTH ACTIVE NAV LINK ────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--gold)';
      }
    });
  });

});
