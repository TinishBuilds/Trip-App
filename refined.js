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

if (window.location.hash) {
  const page = document.querySelector(window.location.hash);
  if (page) {
    document.querySelectorAll('.page').forEach((item) => item.classList.toggle('active', item === page));
    syncMobileNav(page.id);
  }
}
