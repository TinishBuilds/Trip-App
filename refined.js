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

if (window.location.hash) {
  const page = document.querySelector(window.location.hash);
  if (page) {
    document.querySelectorAll('.page').forEach((item) => item.classList.toggle('active', item === page));
    syncMobileNav(page.id);
  }
}
