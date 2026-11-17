(() => {
  const photos = Array.from(document.querySelectorAll('.photo'));
  const viewer = document.querySelector('.lightbox');
  if (!photos.length || !viewer || typeof viewer.showModal !== 'function') return;

  const image = viewer.querySelector('.lightbox-image');
  const caption = viewer.querySelector('.lightbox-caption');
  const count = viewer.querySelector('.lightbox-count');
  const announcement = viewer.querySelector('.lightbox-announcement');
  let current = 0;

  function show(index) {
    current = (index + photos.length) % photos.length;
    const source = photos[current].querySelector('img');
    image.src = photos[current].href;
    image.alt = source.alt;
    caption.textContent = source.alt;
    count.textContent = `${current + 1} / ${photos.length}`;
    announcement.textContent = `Photograph ${current + 1} of ${photos.length}: ${source.alt}`;
  }

  photos.forEach((photo, index) => {
    photo.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      show(index);
      viewer.showModal();
      document.body.classList.add('viewer-open');
    });
  });
  viewer.querySelector('.lightbox-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  viewer.addEventListener('close', () => document.body.classList.remove('viewer-open'));
})();
