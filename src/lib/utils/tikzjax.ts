/**
 * TikZJax (https://tikzjax.com) compiles `<script type="text/tikz">` blocks in
 * the browser with a WebAssembly TeX engine. It weighs several megabytes, so it
 * is loaded only on pages that contain a TikZ block and only once such a block
 * is about to scroll into view.
 */

const SCRIPT_URL = 'https://tikzjax.com/v1/tikzjax.js';
const FONTS_URL = 'https://tikzjax.com/v1/fonts.css';

type TikzJaxWindow = Window & { tikzjax?: { process?: () => void } };

let loading: Promise<void> | null = null;

export function loadTikzJax(): Promise<void> {
	if (typeof window === 'undefined') return Promise.resolve();
	if ((window as TikzJaxWindow).tikzjax) return Promise.resolve();
	if (loading) return loading;

	loading = new Promise<void>((resolve, reject) => {
		const css = document.createElement('link');
		css.rel = 'stylesheet';
		css.href = FONTS_URL;
		document.head.appendChild(css);

		const script = document.createElement('script');
		script.src = SCRIPT_URL;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			loading = null;
			reject(new Error('TikZJax could not be loaded'));
		};
		document.head.appendChild(script);
	});

	return loading;
}

/**
 * Watches the TikZ blocks inside `container` and loads + runs TikZJax when the
 * first one approaches the viewport. Returns a cleanup function.
 */
export function processTikzWhenVisible(container: HTMLElement): () => void {
	if (typeof window === 'undefined') return () => {};

	const blocks = Array.from(container.querySelectorAll<HTMLElement>('.tikz-container'));
	if (blocks.length === 0) return () => {};

	const run = () => {
		loadTikzJax()
			.then(() => {
				const tikzjax = (window as TikzJaxWindow).tikzjax;
				if (tikzjax && typeof tikzjax.process === 'function') tikzjax.process();
			})
			.catch((err) => console.error(err));
	};

	if (typeof IntersectionObserver === 'undefined') {
		run();
		return () => {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				observer.disconnect();
				run();
			}
		},
		{ rootMargin: '300px 0px' }
	);
	blocks.forEach((b) => observer.observe(b));

	return () => observer.disconnect();
}
