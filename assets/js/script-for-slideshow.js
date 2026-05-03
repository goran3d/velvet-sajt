const photos = [
    { src: '../assets/img/roko-futer-5.webp', alt: 'Roko futer u bež i roze boji' },
    { src: '../assets/img/roko-futer-1.webp', alt: 'Roko futer mint, kajsija,bež i svetlo plava' },
    { src: '../assets/img/roko-futer-2.webp', alt: 'Roko futer paleta boja' },
    { src: '../assets/img/roko-futer-4.webp', alt: 'Roko futer oker, braon nijanse' },
    { src: '../assets/img/roko-futer-6.webp', alt: 'Roko futer oker, bež, braon' },
    { src: '../assets/img/roko-futer-9.webp', alt: 'Roko futer svetlije nijanse' },
    { src: '../assets/img/roko-futer-10.webp', alt: 'Roko futer svetlije nijanse zelena, plava, kajsija' },
    { src: '../assets/img/roko-futer-12.webp', alt: 'Roko futer crvena, žuta, plava, ljubičasta' },
    { src: '../assets/img/roko-futer-14.webp', alt: 'Roko futer lila, svetlo plava, bež, puder roze' },
    { src: '../assets/img/roko-futer-18.webp', alt: 'Roko futer pastelne boje duksevi' },
    { src: '../assets/img/roko-futer-13.webp', alt: 'Roko futer oker, braon, bela' },
    { src: '../assets/img/roko-futer-8.webp', alt: 'Roko futer tamna krem' },
    { src: '../assets/img/singl-pamuk.webp', alt: 'Singl pamuk svetle nijanse' },
    { src: '../assets/img/singl-3.webp', alt: 'Singl pamuk svetlije nijanse' },
    { src: '../assets/img/roko-futer-19-velvet-fabrics.webp', alt: 'Roko futer oker, braon, bež, bela, svetla krem' },
    { src: '../assets/img/singl-6.webp', alt: 'Singl pamuk kolekcija različitih nijansi, tamnije i svetlije boje' },
    { src: '../assets/img/roko-futer-3-velvet-fabrics.webp', alt: 'Roko futer čitava lepeza boja' },
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
            mainImage.src = photos[index].src;
            mainImage.alt = photos[index].alt;
            mainImage.classList.remove('fade-out');
        }, 250);
    } else {
        mainImage.src = photos[index].src;
        mainImage.alt = photos[index].alt;
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
        thumb.src = photo.src;
        thumb.alt = photo.alt;
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
        mainImage.src = photos[0].src;
        mainImage.alt = photos[0].alt;

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