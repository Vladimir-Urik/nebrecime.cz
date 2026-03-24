const body = document.body;
const themeSwitcher = document.getElementById('theme-switcher');
const scrollUp = document.getElementById('scroll-up');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

// ── Téma ──
themeSwitcher.onclick = () => {
	const next = body.classList.contains('light') ? 'dark' : 'light';
	body.className = next;
	localStorage.setItem('theme', next);
};

// ── Scroll-up ──
const updateScrollUp = () => {
	scrollUp.classList.toggle('hidden', window.scrollY <= 200);
};
window.addEventListener('scroll', updateScrollUp, { passive: true });
updateScrollUp();

// ── Lightbox ──
function initLightbox() {
	document.querySelectorAll('main img:not(.no-lightbox)').forEach(img => {
		img.onclick = () => {
			lightboxImg.src = img.src;
			lightboxImg.alt = img.alt;
			lightbox.classList.add('open');
		};
	});
}

lightbox.onclick = () => lightbox.classList.remove('open');
document.addEventListener('keydown', e => {
	if (e.key === 'Escape') lightbox.classList.remove('open');
});

initLightbox();

// ── Swup – SPA přechody ──
const swup = new Swup({ containers: ['#swup'] });

swup.hooks.on('page:view', () => {
	new SmoothScroll('a[href*="#"]');
	updateScrollUp();
	initLightbox();
});
