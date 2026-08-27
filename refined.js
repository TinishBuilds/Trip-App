// Small interaction refinements kept separate from the demo data layer.
document.querySelectorAll('img').forEach((image) => {
  image.loading = 'lazy';
  image.decoding = 'async';
});

function syncMobileNav(pageId) {
  document.querySelectorAll('.mobile-nav button').forEach((button) => {
    button.classList.toggle('active', button.dataset.page === pageId);
  });
}

document.querySelectorAll('[data-page]').forEach((button) => {
  button.addEventListener('click', () => syncMobileNav(button.dataset.page));
});

// Delegated navigation keeps the sidebar, mobile bar, and inline CTAs in sync even after a re-render.
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-page]');
  if (!trigger) return;
  event.preventDefault();
  navigate(trigger.dataset.page);
  syncMobileNav(trigger.dataset.page);
});

// The whole budget option card is an affordance, not just the tiny switch.
document.querySelector('.cheaper-toggle')?.addEventListener('click', (event) => {
  if (!event.target.closest('#cheap-switch')) document.querySelector('#cheap-switch')?.click();
});
document.querySelector('.match-callout')?.addEventListener('click', () => navigate('opportunities'));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') document.querySelectorAll('.modal-wrap.open').forEach((modal) => modal.classList.remove('open'));
});

document.querySelectorAll('.interest-chips button').forEach((chip) => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

// Keep the board tabs useful in the prototype: the most important filter is fully live.
document.querySelectorAll('.board-tabs > button:not(.add-place)').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.board-tabs > button').forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.textContent.trim().toLowerCase();
    document.querySelectorAll('.place-card').forEach((card) => {
      const isMust = card.querySelector('.tag')?.textContent.includes('MUST');
      card.hidden = filter.startsWith('must') && !isMust;
    });
    if (filter.startsWith('links') || filter.startsWith('notes')) toast('That view is ready for your group’s next notes');
  });
});

// Rebuild from the complete seeded set before applying a category so every filter can be revisited.
document.querySelectorAll('.filter-row .filter').forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    const label = filterButton.textContent.trim().toLowerCase();
    renderOpps('#opportunity-grid', opportunities.length, true);
    document.querySelectorAll('#opportunity-grid .opp-card').forEach((card) => {
      const type = card.querySelector('.tag')?.textContent.toLowerCase() || '';
      const show = label.startsWith('all') || (label.startsWith('student') && type.includes('student')) || (label.startsWith('travel') && type.includes('travel')) || (label.startsWith('local') && type.includes('local')) || (label.startsWith('free') && card.textContent.toLowerCase().includes('free'));
      card.hidden = !show;
    });
document.querySelectorAll('#opportunity-grid .detail-btn').forEach((button) => button.addEventListener('click', () => showDetail(button.dataset.id)));
  });
});

// Use real OpenStreetMap tiles when available; no API key or booking integration is required.
if (window.L && document.querySelector('#live-map')) {
  const routePoints = [
    [35.6762, 139.6993, '1 · Meiji Jingu'],
    [35.6586, 139.7454, '2 · Shibuya Sky'],
    [35.6654, 139.7707, '3 · Tsukiji Outer Market'],
    [35.6492, 139.7897, '4 · teamLab Planets']
  ];
  const routeMap = L.map('live-map', { zoomControl: false, scrollWheelZoom: false, attributionControl: true }).setView([35.67, 139.75], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(routeMap);
  L.control.zoom({ position: 'topright' }).addTo(routeMap);
  L.polyline(routePoints.map((point) => point.slice(0, 2)), { color: '#5a50b8', weight: 4, opacity: .9, dashArray: '8 8' }).addTo(routeMap);
  routePoints.forEach((point) => {
    const icon = L.divIcon({ className: 'route-marker', html: `<span>${point[0] === 35.6762 ? '1' : point[0] === 35.6586 ? '2' : point[0] === 35.6654 ? '3' : '4'}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] });
    L.marker(point.slice(0, 2), { icon }).addTo(routeMap).bindPopup(`<strong>${point[2]}</strong><br><small>Saved by your group</small>`);
  });
  const mapCard = document.querySelector('.map-card');
  mapCard.classList.add('map-live');
  const controls = mapCard.querySelectorAll('.map-controls button');
  controls[0].onclick = () => routeMap.zoomIn();
  controls[1].onclick = () => routeMap.zoomOut();
  controls[2].onclick = () => routeMap.fitBounds(routePoints.map((point) => point.slice(0, 2)), { padding: [35, 35] });
}

if (window.location.hash) {
  const page = document.querySelector(window.location.hash);
  if (page) {
    document.querySelectorAll('.page').forEach((item) => item.classList.toggle('active', item === page));
    syncMobileNav(page.id);
  }
}
