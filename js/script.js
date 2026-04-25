/* ============================================================
   Mavi Akdeniz – Front-end script
   - Mobile nav
   - Booking storage (localStorage)
   - "Bu Akşam Neredeyiz?" hero & section
   - Upcoming / past shows lists
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'maviakdeniz.bookings.v1';

  /* ---------- Seed sample bookings (only first visit) ---------- */
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };

  const SEED = [
    {
      id: 'seed-1',
      name: 'Salamis Bay Conti Hotel',
      venue: 'Salamis Bay Conti Hotel – Açık Hava Sahnesi',
      city: 'Mağusa',
      date: iso(today),               // BUGÜN
      time: '21:30',
      eventType: 'Otel / Restoran',
      public: true,
      status: 'confirmed',
    },
    {
      id: 'seed-2',
      name: 'Girne Belediyesi',
      venue: 'Girne Antik Limanı',
      city: 'Girne',
      date: iso(addDays(7)),
      time: '20:00',
      eventType: 'Festival / Açık Hava',
      public: true,
      status: 'confirmed',
    },
    {
      id: 'seed-3',
      name: 'Lefkoşa Kültür Merkezi',
      venue: 'Bedesten Sahnesi',
      city: 'Lefkoşa',
      date: iso(addDays(14)),
      time: '21:00',
      eventType: 'Festival / Açık Hava',
      public: true,
      status: 'confirmed',
    },
    {
      id: 'seed-4',
      name: 'Karpaz Gate Marina',
      venue: 'Karpaz Gate Marina',
      city: 'İskele',
      date: iso(addDays(28)),
      time: '22:00',
      eventType: 'Otel / Restoran',
      public: true,
      status: 'confirmed',
    },
    {
      id: 'seed-past-1',
      name: 'Cumhuriyet Bayramı',
      venue: 'Atatürk Meydanı',
      city: 'Lefkoşa',
      date: iso(addDays(-30)),
      time: '20:30',
      eventType: 'Festival / Açık Hava',
      public: true,
      status: 'confirmed',
    },
    {
      id: 'seed-past-2',
      name: 'Kıbrıs Tiyatro Festivali',
      venue: 'Salamis Antik Tiyatro',
      city: 'Mağusa',
      date: iso(addDays(-90)),
      time: '21:00',
      eventType: 'Festival / Açık Hava',
      public: true,
      status: 'confirmed',
    },
  ];

  function loadBookings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    return SEED.slice();
  }

  function saveBookings(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function tonightBooking(list) {
    const t = iso(new Date());
    return list.find((b) => b.date === t && b.public !== false);
  }

  function upcomingBookings(list, limit) {
    const t = iso(new Date());
    const sorted = list
      .filter((b) => b.date >= t && b.public !== false)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
  }

  function pastBookings(list) {
    const t = iso(new Date());
    return list
      .filter((b) => b.date < t)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function formatDate(dStr) {
    const d = new Date(dStr + 'T00:00:00');
    return d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function shortDate(dStr) {
    const d = new Date(dStr + 'T00:00:00');
    const day = d.getDate();
    const month = d.toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase();
    return { day, month };
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    const btn = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Tonight card (homepage section) ---------- */
  function renderTonight(list) {
    const card = document.getElementById('tonight-card');
    if (!card) return;
    const t = tonightBooking(list);
    if (!t) {
      card.classList.add('empty');
      card.innerHTML = `
        <h3>Bu akşam serbestiz</h3>
        <p class="meta">Bir sonraki sahnemiz için <a href="konserler.html" style="color:#2c8c89;text-decoration:underline;">konser takvimini</a> inceleyin veya <a href="rezervasyon.html" style="color:#2c8c89;text-decoration:underline;">rezervasyon yapın</a>.</p>
      `;
      return;
    }
    card.classList.remove('empty');
    card.innerHTML = `
      <p class="label" style="text-transform:uppercase;letter-spacing:0.3em;font-size:0.8rem;opacity:0.85;margin-bottom:0.4rem;">CANLI BU AKŞAM</p>
      <h3>${escapeHtml(t.venue)}</h3>
      <p class="meta">${escapeHtml(t.city)} · Saat ${escapeHtml(t.time)} · ${escapeHtml(t.eventType || '')}</p>
    `;
  }

  /* ---------- Hero overlay tonight ---------- */
  function renderHeroTonight(list) {
    const box = document.getElementById('hero-tonight');
    if (!box) return;
    const t = tonightBooking(list);
    if (!t) {
      box.style.display = 'none';
      return;
    }
    box.innerHTML = `
      <p class="label">Bu Akşam Sahnedeyiz</p>
      <p class="venue">${escapeHtml(t.venue)}</p>
      <p class="meta">${escapeHtml(t.city)} · ${escapeHtml(t.time)} · ${escapeHtml(t.eventType || '')}</p>
    `;
  }

  /* ---------- Upcoming list ---------- */
  function renderUpcoming(list, containerId, limit) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const items = upcomingBookings(list, limit);
    if (!items.length) {
      el.innerHTML = '<p class="muted">Şu anda planlanmış bir konser yok. Bizi sahnenize davet edin!</p>';
      return;
    }
    el.innerHTML = items.map((b) => {
      const sd = shortDate(b.date);
      return `
        <div class="show-card">
          <div class="date"><strong>${sd.day}</strong><small>${sd.month}</small></div>
          <div>
            <h4>${escapeHtml(b.venue)}</h4>
            <p class="where">${escapeHtml(b.city)} · ${escapeHtml(b.time)} · ${escapeHtml(b.eventType || '')}</p>
          </div>
          <span class="pill">${escapeHtml(b.status === 'confirmed' ? 'Onaylı' : 'Beklemede')}</span>
        </div>
      `;
    }).join('');
  }

  /* ---------- Past list ---------- */
  function renderPast(list, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const items = pastBookings(list);
    if (!items.length) {
      el.innerHTML = '<p class="muted">Henüz arşivde konser yok.</p>';
      return;
    }
    el.innerHTML = items.map((b) => {
      const sd = shortDate(b.date);
      return `
        <div class="show-card">
          <div class="date"><strong>${sd.day}</strong><small>${sd.month}</small></div>
          <div>
            <h4>${escapeHtml(b.venue)}</h4>
            <p class="where">${escapeHtml(b.city)} · ${formatDate(b.date)}</p>
          </div>
          <span class="pill">Geçmiş</span>
        </div>
      `;
    }).join('');
  }

  /* ---------- Booking form ---------- */
  function initBookingForm(list) {
    const form = document.getElementById('booking-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const booking = {
        id: 'b-' + Date.now(),
        name: data.name,
        phone: data.phone,
        email: data.email,
        eventType: data.eventType,
        date: data.date,
        time: data.time,
        venue: data.venue,
        city: data.city,
        duration: data.duration,
        guests: data.guests,
        notes: data.notes,
        public: form.querySelector('[name="public"]').checked,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      const all = loadBookings();
      all.push(booking);
      saveBookings(all);
      const status = document.getElementById('form-status');
      if (status) {
        status.textContent =
          'Talebiniz alındı! Onaylandığında ana sayfadaki "Bu Akşam Neredeyiz?" kısmında otomatik olarak görünecektir.';
      }
      form.reset();
    });
  }

  /* ---------- Helpers ---------- */
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    const list = loadBookings();
    renderTonight(list);
    renderHeroTonight(list);
    renderUpcoming(list, 'upcoming-list', 3);
    renderUpcoming(list, 'all-upcoming');
    renderPast(list, 'past-shows');
    initBookingForm(list);
  });
})();
