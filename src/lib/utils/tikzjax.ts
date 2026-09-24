/**
 * TikZJax (https://tikzjax.com) compiles `<script type="text/tikz">` blocks in
 * the browser with a WebAssembly TeX engine. It weighs several megabytes, so it
 * is loaded only on pages that contain a TikZ block and only once such a block
 * is about to scroll into view.
 *
 * TikZJax v1 has no API: it assigns `window.onload`, which compiles every TikZ
 * block in the document. Loaded lazily, it arrives after the load event has
 * fired, so that handler is captured and called by hand, once per page.
 */

const SCRIPT_URL = 'https://tikzjax.com/v1/tikzjax.js';
const FONTS_URL = 'https://tikzjax.com/v1/fonts.css';

type Handler = (this: Window, ev: Event) => unknown;

let loading: Promise<Handler | null> | null = null;

export function loadTikzJax(): Promise<Handler | null> {
	if (typeof window === 'undefined') return Promise.resolve(null);
	if (loading) return loading;

	loading = new Promise<Handler | null>((resolve, reject) => {
		const css = document.createElement('link');
		css.rel = 'stylesheet';
		css.href = FONTS_URL;
		document.head.appendChild(css);

		const previous = window.onload;
		const script = document.createElement('script');
		script.src = SCRIPT_URL;
		script.async = true;
		script.onload = () => {
			const handler = window.onload !== previous && typeof window.onload === 'function' ? (window.onload as Handler) : null;
			window.onload = previous;
			resolve(handler);
		};
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

	// Compiled figures are plain <img>; only the uncompiled ones still carry TikZ source.
	const blocks = Array.from(container.querySelectorAll<HTMLElement>('.tikz-container')).filter((b) => b.querySelector('script[type="text/tikz"]'));
	if (blocks.length === 0) return () => {};

	const run = () => {
		loadTikzJax()
			.then((compile) => {
				// Compiles every `text/tikz` script still in the document; finished ones are already SVG.
				if (compile) return compile.call(window, new Event('load'));
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
