const body = document.body;
const themeSwitcher = document.getElementById('theme-switcher');
const scrollUp = document.getElementById('scroll-up');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

// ── Tema ──
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

// ── Quiz ──
function initQuiz() {
	const root = document.getElementById('quiz-root');
	if (!root || root._quizInit) return;
	root._quizInit = true;

	const quizId = root.dataset.quizId || 'default';
	const storageKey = `quiz_${quizId}_state`;

	const items = Array.from(root.querySelectorAll('.quiz-item'));
	const counter = root.querySelector('.quiz-counter');
	const progressBar = root.querySelector('.quiz-progress-bar');
	const resultDiv = root.querySelector('.quiz-result');
	const scoreText = root.querySelector('.quiz-score-text');
	const resetBtn = root.querySelector('.quiz-reset');
	const shareBtn = root.querySelector('.quiz-share');
	const questionsEl = root.querySelector('.quiz-questions');
	const total = items.length;

	let current = 0;
	let correct = 0;

	// Load state if exists
	const savedState = localStorage.getItem(storageKey);
	if (savedState) {
		try {
			const s = JSON.parse(savedState);
			if (s.current < total) {
				current = s.current;
				correct = s.correct;
			}
		} catch(e){}
	}

	function saveState() {
		localStorage.setItem(storageKey, JSON.stringify({ current, correct }));
	}

	function shuffleOptions(item) {
		if (item.dataset.shuffled) return;
		const optionsContainer = item.querySelector('.quiz-options');
		const buttons = Array.from(optionsContainer.children);
		for (let i = buttons.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			optionsContainer.appendChild(buttons[j]);
		}
		item.dataset.shuffled = '1';
	}

	function triggerConfetti() {
		if (window.confetti) {
			window.confetti({ zIndex: 99999, particleCount: 150, spread: 80, origin: { y: 0.6 } });
		} else {
			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
			script.onload = () => window.confetti({ zIndex: 99999, particleCount: 150, spread: 80, origin: { y: 0.6 } });
			document.head.appendChild(script);
		}
	}

	function showItem(idx) {
		items.forEach((item, i) => {
			if (i === idx) {
				item.classList.add('active');
				shuffleOptions(item);
			} else {
				item.classList.remove('active');
			}
		});
		counter.textContent = `${idx + 1} / ${total}`;
		progressBar.style.width = `${((idx + 1) / total) * 100}%`;
		saveState();
		
		// Wait a bit to ensure scrolling is smooth or just let user see it
	}

	function finish() {
		items.forEach(item => item.classList.remove('active'));
		resultDiv.hidden = false;
		progressBar.style.width = '100%';
		const pct = Math.round((correct / total) * 100);
		const emoji = pct === 100 ? '🎉' : pct >= 70 ? '👍' : pct >= 40 ? '💪' : '📖';
		scoreText.textContent = `${emoji}  ${correct} z ${total} správně — ${pct} %`;
		counter.textContent = `Hotovo!`;
		if (pct === 100) triggerConfetti();
		localStorage.removeItem(storageKey);
	}

	questionsEl.addEventListener('click', e => {
		const btn = e.target.closest('.quiz-opt');
		const nextBtn = e.target.closest('.quiz-next');

		if (nextBtn) {
			current++;
			if (current < total) showItem(current);
			else finish();
			return;
		}

		if (!btn) return;
		const item = btn.closest('.quiz-item');
		if (!item || !item.classList.contains('active') || item.dataset.answered) return;
		item.dataset.answered = '1';

		const correctIdx = parseInt(item.dataset.correct);
		const chosenIdx = parseInt(btn.dataset.idx);
		const feedbackWrap = item.querySelector('.quiz-feedback-wrap');
		const feedback = item.querySelector('.quiz-feedback');
		const isCorrect = chosenIdx === correctIdx;

		item.querySelectorAll('.quiz-opt').forEach(b => {
			b.disabled = true;
			if (parseInt(b.dataset.idx) === correctIdx) b.classList.add('correct');
			else if (b === btn && !isCorrect) b.classList.add('wrong');
		});

		if (isCorrect) correct++;
		feedback.textContent = isCorrect ? '✓ Správně!' : '✗ Špatně';
		feedback.className = 'quiz-feedback ' + (isCorrect ? 'ok' : 'err');
		if (isCorrect) {
			feedbackWrap.style.borderLeftColor = 'var(--code-green)';
		} else {
			feedbackWrap.style.borderLeftColor = 'var(--code-red)';
		}
		feedbackWrap.hidden = false;
	});

	resetBtn.addEventListener('click', () => {
		current = 0;
		correct = 0;
		localStorage.removeItem(storageKey);
		items.forEach(item => {
			delete item.dataset.answered;
			delete item.dataset.shuffled;
			item.querySelectorAll('.quiz-opt').forEach(b => {
				b.disabled = false;
				b.classList.remove('correct', 'wrong');
			});
			item.querySelector('.quiz-feedback-wrap').hidden = true;
			item.querySelector('.quiz-feedback').className = 'quiz-feedback';
		});
		resultDiv.hidden = true;
		showItem(0);
	});

	if (shareBtn) {
		shareBtn.addEventListener('click', async () => {
			const pct = Math.round((correct / total) * 100);
			const text = `🎯 Získal(a) jsem ${correct}/${total} (${pct} %) v kvízu na nebrecime.cz! Zkus to taky: ${window.location.href}`;
			try {
				if (navigator.share) {
					await navigator.share({ title: 'Můj kvízový výsledek', text, url: window.location.href });
				} else {
					await navigator.clipboard.writeText(text);
					const originalText = shareBtn.textContent;
					shareBtn.textContent = 'Zkopírováno!';
					setTimeout(() => shareBtn.textContent = originalText, 2000);
				}
			} catch(err) {
				console.error(err);
			}
		});
	}

	showItem(current);
}

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
initQuiz();

// ── Swup ──
const swup = new Swup({ containers: ['#swup'] });

swup.hooks.on('page:view', () => {
	new SmoothScroll('a[href*="#"]');
	updateScrollUp();
	initLightbox();
	initQuiz();
	initSearch();
});

swup.hooks.on('visit:start', () => {
	const modal = document.getElementById('search-modal');
	if (modal && !modal.hidden) {
		modal.classList.remove('open');
		modal.hidden = true;
	}
});

// ── Search Modal ──
function initSearch() {
	const trigger = document.getElementById('search-trigger');
	if (!trigger) return;

	const modal = document.getElementById('search-modal');
	const backdrop = modal.querySelector('.search-backdrop');
	const input = document.getElementById('topic-search');
	const resultsList = document.getElementById('search-results');
	const noResults = document.getElementById('search-no-results');
	const allLinks = Array.from(document.querySelectorAll('main nav a[data-search]'));

	function openModal() {
		modal.hidden = false;
		requestAnimationFrame(() => modal.classList.add('open'));
		input.focus();
		input.value = '';
		renderResults('');
	}

	function closeModal() {
		modal.classList.remove('open');
		modal.addEventListener('transitionend', () => { modal.hidden = true; }, { once: true });
	}

	function renderResults(q) {
		const filtered = q
			? allLinks.filter(a => a.dataset.search.includes(q))
			: allLinks;

		resultsList.innerHTML = '';
		filtered.forEach(a => {
			const clone = a.cloneNode(true);
			clone.removeAttribute('hidden');
			clone.style.removeProperty('display');
			resultsList.appendChild(clone);
		});

		noResults.hidden = filtered.length > 0;
	}

	trigger.addEventListener('click', e => { e.preventDefault(); openModal(); });
	backdrop.addEventListener('click', closeModal);

	input.addEventListener('input', () => {
		renderResults(input.value.trim().toLowerCase());
	});

	resultsList.addEventListener('click', e => {
		if (e.target.closest('a')) closeModal();
	});

	document.addEventListener('keydown', e => {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			modal.hidden ? openModal() : closeModal();
		}
		if (e.key === 'Escape' && !modal.hidden) closeModal();
	});
}

initSearch();
