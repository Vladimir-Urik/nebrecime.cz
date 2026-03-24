const body = document.body;
const themeSwitcher = document.getElementById('theme-switcher');
const scrollUp = document.getElementById('scroll-up');

// Téma
themeSwitcher.onclick = () => {
	const next = body.classList.contains('light') ? 'dark' : 'light';
	body.className = next;
	localStorage.setItem('theme', next);
};

// Scroll-up
const updateScrollUp = () => {
	if (window.scrollY > 200) {
		scrollUp.classList.remove('hidden');
	} else {
		scrollUp.classList.add('hidden');
	}
};
window.addEventListener('scroll', updateScrollUp, { passive: true });
updateScrollUp();

// Swup – SPA přechody
const swup = new Swup({ containers: ['#swup'] });

swup.hooks.on('page:view', () => {
	// Po přechodu znovu inicializuj smooth scroll
	new SmoothScroll('a[href*="#"]');
	updateScrollUp();
});
