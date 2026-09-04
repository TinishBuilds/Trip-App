const shareUrl = 'https://roamtogether.app/t/tokyo-with-the-gang';

function socialToast(message) {
  const toastElement = document.querySelector('#toast');
  toastElement.firstChild.textContent = `${message} `;
  toastElement.classList.add('show');
  window.setTimeout(() => toastElement.classList.remove('show'), 2800);
}

async function shareRecap() {
  const shareData = {
    title: 'Tokyo, with the gang — RoamTogether',
    text: 'Three days, four friends, eighteen saved spots. Save this Tokyo route for your next adventure.',
    url: shareUrl,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      socialToast('Recap shared with your people');
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    socialToast('Public recap link copied');
  } catch (error) {
    if (error?.name !== 'AbortError') socialToast('Share link is ready to copy');
  }
}

document.querySelector('#native-share')?.addEventListener('click', shareRecap);
document.querySelector('#share-recap-top')?.addEventListener('click', shareRecap);
document.querySelector('#copy-recap-link')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(shareUrl);
    socialToast('Public recap link copied');
  } catch {
    socialToast('Copy this link: roamtogether.app/t/tokyo-with-the-gang');
  }
});

document.querySelector('#open-mini-trip')?.addEventListener('click', () => {
  document.querySelector('#mini-trip-modal')?.classList.add('open');
});

document.querySelector('#save-mini-trip')?.addEventListener('click', () => {
  document.querySelector('#mini-trip-modal')?.classList.remove('open');
  socialToast('Adventure saved · Small but mighty badge unlocked!');
});
