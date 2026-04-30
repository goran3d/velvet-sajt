const photos = [
    '../assets/img/slika11.jpg',
    '../assets/img/slika8.jpg',
    '../assets/img/slika12.jpg',
    '../assets/img/renderi.jpg',
    '../assets/img/singl-pamuk.jpg',
    '../assets/img/slika16.jpg',
    '../assets/img/slika28.jpg',
    '../assets/img/slika15.jpg',
    '../assets/img/slika29.jpg',
    '../assets/img/slika30.jpg',
    '../assets/img/slika18.jpg',
    '../assets/img/slika1.jpg',
    '../assets/img/slika19.jpg',
    '../assets/img/slika25.jpg',
    '../assets/img/slika27.jpg',
    '../assets/img/slika3.jpg',
    '../assets/img/slika22.jpg',
    '../assets/img/slika6.jpg',
    '../assets/img/slika7.jpg',
    '../assets/img/slika23.jpg',
    '../assets/img/slika21.jpg',
    '../assets/img/slika5.jpg',
];

const mainImage = document.getElementById('mainImage');
const thumbnailContainer = document.getElementById('thumbnailContainer');
let currentIndex = 0;
let intervalId = null;
const INTERVAL_MS = 2000;
const GAP = 12;

function showImage(index, animate = true) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (animate && !reducedMotion) {
        mainImage.classList.add('fade-out');
        setTimeout(() => {
            mainImage.src = photos[index];
            mainImage.alt = `Photo ${index + 1}`;
            mainImage.classList.remove('fade-out');
        }, 250);
    } else {
        mainImage.src = photos[index];
        mainImage.alt = `Photo ${index + 1}`;
    }

    updateActiveThumbnail(index);
    currentIndex = index;
}

function updateActiveThumbnail(activeIndex) {
    document.querySelectorAll('.thumbnail').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === activeIndex);
    });
}

function getContainerWidth() {
    const w = window.innerWidth;
    let maxWidth;

    if (w <= 768) {
        maxWidth = 548;
    } else if (w <= 1200) {
        maxWidth = 900;
    } else {
        maxWidth = 1100;
    }

    return Math.min(maxWidth, w - 64);
}

function calculateThumbSize() {
    const totalPhotos = photos.length;
    const containerWidth = getContainerWidth();

    if (totalPhotos <= 15) {
        const maxPerRow = Math.floor((containerWidth + GAP) / (40 + GAP));
        const perRow = Math.min(totalPhotos, maxPerRow);
        const size = Math.floor((containerWidth - (perRow - 1) * GAP) / perRow);
        return Math.max(size, 40);
    } else {
        const half = Math.ceil(totalPhotos / 2);
        const maxPerRow = Math.floor((containerWidth + GAP) / (40 + GAP));
        const perRow = Math.min(half, maxPerRow);
        const size = Math.floor((containerWidth - (perRow - 1) * GAP) / perRow);
        return Math.max(size, 40);
    }
}

function generateThumbnails() {
    const thumbSize = calculateThumbSize();
    thumbnailContainer.style.setProperty('--thumb-size', `${thumbSize}px`);

    thumbnailContainer.innerHTML = '';
    photos.forEach((photo, index) => {
        const thumb = document.createElement('img');
        thumb.className = 'thumbnail';
        thumb.src = photo;
        thumb.alt = `Thumbnail ${index + 1}`;
        thumb.dataset.index = index;

        thumb.addEventListener('click', () => {
            showImage(index);
            resetInterval();
        });

        thumbnailContainer.appendChild(thumb);
    });
}

function nextRandomImage() {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * photos.length);
    } while (nextIndex === currentIndex && photos.length > 1);

    showImage(nextIndex);
}

function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextRandomImage, INTERVAL_MS);
}

function init() {
    if (photos.length > 0 && mainImage && thumbnailContainer) {
        mainImage.src = photos[0];
        mainImage.alt = 'Photo 1';

        generateThumbnails();
        updateActiveThumbnail(0);

        if (photos.length > 1) {
            intervalId = setInterval(nextRandomImage, INTERVAL_MS);
        }
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        generateThumbnails();
    }, 150);
});

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
} else {
    init();
}