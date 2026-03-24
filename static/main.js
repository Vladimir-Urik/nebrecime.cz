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
	if (!root || root.dataset.init) return;
	root.dataset.init = '1';

	const items = Array.from(root.querySelectorAll('.quiz-item'));
	const counter = root.querySelector('.quiz-counter');
	const progressBar = root.querySelector('.quiz-progress-bar');
	const resultDiv = root.querySelector('.quiz-result');
	const scoreText = root.querySelector('.quiz-score-text');
	const resetBtn = root.querySelector('.quiz-reset');
	const questionsEl = root.querySelector('.quiz-questions');
	const total = items.length;

	let current = 0;
	let correct = 0;

	function showItem(idx) {
		items.forEach((item, i) => item.classList.toggle('active', i === idx));
		counter.textContent = `${idx + 1} / ${total}`;
		progressBar.style.width = `${((idx + 1) / total) * 100}%`;
	}

	function finish() {
		items.forEach(item => item.classList.remove('active'));
		resultDiv.hidden = false;
		progressBar.style.width = '100%';
		const pct = Math.round((correct / total) * 100);
		const emoji = pct === 100 ? '🎉' : pct >= 70 ? '👍' : pct >= 40 ? '💪' : '📖';
		scoreText.textContent = `${emoji}  ${correct} z ${total} správně — ${pct} %`;
		counter.textContent = `Hotovo!`;
	}

	// Event delegation — catches bubbled clicks from any button inside
	questionsEl.addEventListener('click', e => {
		const btn = e.target.closest('.quiz-opt');
		if (!btn) return;
		const item = btn.closest('.quiz-item');
		if (!item || !item.classList.contains('active') || item.dataset.answered) return;
		item.dataset.answered = '1';

		const correctIdx = parseInt(item.dataset.correct);
		const chosenIdx = parseInt(btn.dataset.idx);
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

		setTimeout(() => {
			current++;
			if (current < total) showItem(current);
			else finish();
		}, 900);
	});

	resetBtn.addEventListener('click', () => {
		current = 0;
		correct = 0;
		items.forEach(item => {
			delete item.dataset.answered;
			item.querySelectorAll('.quiz-opt').forEach(b => {
				b.disabled = false;
				b.classList.remove('correct', 'wrong');
			});
			item.querySelector('.quiz-feedback').textContent = '';
			item.querySelector('.quiz-feedback').className = 'quiz-feedback';
		});
		resultDiv.hidden = true;
		showItem(0);
	});

	showItem(0);
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
});
