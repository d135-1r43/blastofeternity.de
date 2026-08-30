import type { Action } from 'svelte/action';

/**
 * Reveals an element once, the first time it scrolls into view.
 *
 * `use:reveal` sets `data-reveal="hidden"` immediately and flips it to `"shown"`
 * on intersection; app.css does the rest. Anything the browser cannot observe
 * (no IntersectionObserver, JS off, reduced motion) is simply shown.
 */
export const reveal: Action<HTMLElement, number | undefined> = (node, delay = 0) => {
	if (typeof IntersectionObserver === 'undefined') return;

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduced) return;

	node.dataset.reveal = 'hidden';
	if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				node.dataset.reveal = 'shown';
				observer.disconnect();
			}
		},
		{ rootMargin: '0px 0px -12% 0px', threshold: 0.06 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
