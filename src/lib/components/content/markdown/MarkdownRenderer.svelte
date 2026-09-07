<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import katex from 'katex';
	import 'katex/dist/katex.min.css';
    import { textSelection, type SelectionReport } from '$lib/utils/text-selection';
	import type { Prompt } from '$lib/data/prompts';
	import { aiSidebar } from '$lib/state/ai-sidebar.svelte.js';
	import { layoutState } from '$lib/state/layout.svelte.js';
	import { processTikzWhenVisible } from '$lib/utils/tikzjax';

	import FloatingMenu from './FloatingMenu.svelte';

	let {
		content = '',
		targetSection = '',
		classes = ''
	} = $props();

	let containerElement;
	let activeSection = $state('');
	let expandedGif = $state(null);
	let selectedText = $state('');

	const dispatch = createEventDispatcher();

	function setupLazyLoading() {
		if (!containerElement) return;

		const lazyGifs = containerElement.querySelectorAll('.lazy-gif');
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target as HTMLImageElement;
					img.src = img.dataset.src;
					img.classList.remove('lazy-gif');
					observer.unobserve(img);
				}
			});
		}, {
			rootMargin: '50px 0px',
			threshold: 0.1
		});

		lazyGifs.forEach(gif => observer.observe(gif));
	}

	function setTableColumnCounts() {
		if (!containerElement) return;

		const tables = containerElement.querySelectorAll('.markdown-content table');
		tables.forEach(table => {
			const headerRow = table.querySelector('tr') as HTMLTableRowElement;
			if (headerRow) {
				const columnCount = headerRow.children.length;
				table.style.setProperty('--col-count', columnCount.toString());
			}
		});
	}

	// Wide tables scroll sideways inside their own box instead of pushing
	// the page wider than a phone screen.
	function wrapTables() {
		if (!containerElement) return;
		const tables = containerElement.querySelectorAll('.markdown-content table');
		tables.forEach((table: HTMLTableElement) => {
			if (table.parentElement?.classList.contains('table-scroll')) return;
			const wrap = document.createElement('div');
			wrap.className = 'table-scroll scroll-x';
			table.parentNode?.insertBefore(wrap, table);
			wrap.appendChild(table);
		});
	}

	function handleGifClick(event: MouseEvent) {
		const gifElement = event.target as HTMLImageElement;
		if (gifElement.classList.contains('markdown-gif')) {
			if (expandedGif === gifElement.src) {
				expandedGif = null;
				gifElement.style.width = '';
				gifElement.style.maxWidth = '';
			} else {
				if (expandedGif) {
					const prevGif = containerElement.querySelector(`img[src="${expandedGif}"]`);
					if (prevGif) {
						prevGif.style.width = '';
						prevGif.style.maxWidth = '';
					}
				}
				expandedGif = gifElement.src;
				gifElement.style.width = '100%';
				gifElement.style.maxWidth = '100%';
			}
		}
	}

	let stopTikz: (() => void) | null = null;

	$effect(() => {
		if (content && containerElement) {
			setTimeout(() => {
				const container = containerElement.querySelector('#content-container');
				if (!container) return;

				container.addEventListener('click', handleGifClick);

				setupLazyLoading();

				const inlineMathElements = container.querySelectorAll('.katex-inline');
				inlineMathElements.forEach(el => {
					try {
						const latex = el.textContent;
						el.innerHTML = katex.renderToString(latex, { displayMode: false });
					} catch (e) {
						console.error('KaTeX inline error:', e, el.textContent);
					}
				});

				const displayMathElements = container.querySelectorAll('.katex-display .katex-equation');
				displayMathElements.forEach(el => {
					try {
						const latex = el.textContent;
						const rendered = katex.renderToString(latex, { displayMode: true });
						el.parentElement.innerHTML = rendered;
					} catch (e) {
						console.error('KaTeX display error:', e, el.textContent);
					}
				});

				setTableColumnCounts();
				wrapTables();

				stopTikz?.();
				stopTikz = processTikzWhenVisible(container as HTMLElement);
			}, 100);
		}
	});

	$effect(() => {
		return () => {
			if (containerElement) {
				const container = containerElement.querySelector('#content-container');
				if (container) {
					container.removeEventListener('click', handleGifClick);
				}
			}
		};
	});

	$effect(() => {
		if (targetSection && containerElement) {
			scrollToSection(targetSection);
		}
	});

	function scrollToSection(sectionId: string) {
		if (!containerElement) return;

		const section = containerElement.querySelector(`#${CSS.escape(sectionId)}`);
		if (section) {
			section.scrollIntoView({ behavior: 'smooth', block: 'start' });

			activeSection = sectionId;
			dispatch('sectionActive', { sectionId });
		}
	}

	// The lesson scrolls in the layout's container, not here: the section
	// being read is the last heading that has passed under the sticky header.
	let frame = 0;
	$effect(() => {
		layoutState.scrollY;
		if (!containerElement) return;
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(updateActiveSection);
		return () => cancelAnimationFrame(frame);
	});

	function updateActiveSection() {
		if (!containerElement) return;
		const headings = containerElement.querySelectorAll('h2[id], h3[id], h4[id]');
		const threshold = 140;
		let current = '';
		for (const heading of headings) {
			if (heading.getBoundingClientRect().top <= threshold) current = heading.id;
			else break;
		}
		if (current && current !== activeSection) {
			activeSection = current;
			dispatch('sectionActive', { sectionId: current });
		}
	}

	let menuVisible = $state(false);
    let menuPos = $state({ x: 0, y: 0 });
    let menuTouch = $state(false);

    function onSelect(report: SelectionReport) {
        menuVisible = true;
		selectedText = report.text;
        menuTouch = report.touch;
        // Mouse: above the selection. Finger: below its last line, clear of the OS callout.
        menuPos = report.touch
            ? { x: report.left + report.width / 2, y: report.bottom + 12 }
            : { x: report.left + report.width / 2, y: report.top - 10 };
    }

	function handlePrompt(prompt: Prompt) {
		if (selectedText) {
			aiSidebar.setPendingPrompt(prompt, selectedText);
		}
		hideMenu();
	}

	function hideMenu() {
		menuVisible = false;
		selectedText = '';
	}

	// Hide menu on scroll
	$effect(() => {
		if (typeof window === 'undefined') return;

		window.addEventListener('scroll', hideMenu, true);
		return () => window.removeEventListener('scroll', hideMenu, true);
	});
</script>

<div
	class="markdown-content w-full h-full {classes}"
	bind:this={containerElement}
>
	<div class="max-w-4xl mx-auto" use:textSelection={{ onSelect, onDeselect: () => menuVisible = false }}>
		{#if content}
			<div class="content" id="content-container">
				{@html content}
			</div>
		{:else}
			<div class="p-4 text-center text-zinc-400">
				<p>Caricamento contenuto...</p>
			</div>
		{/if}
	</div>
</div>

<FloatingMenu
	isVisible={menuVisible}
	position={menuPos}
	touch={menuTouch}
	onSelect={handlePrompt}
/>

<style lang="postcss">
	@reference '../../../../app.css';

	:global(.markdown-content h2) {
		@apply text-3xl font-bold text-zinc-950 dark:text-white mb-8 mt-16 pb-3 border-b border-crimson-400/80;
		scroll-margin-top: 1rem;
	}

	:global(.markdown-content h3) {
		@apply text-2xl font-semibold text-zinc-950 dark:text-white mb-4 mt-12 scroll-mt-20;
	}

	:global(.markdown-content h4) {
		@apply text-xl font-medium text-zinc-950 dark:text-white mb-3 mt-7 scroll-mt-16;
	}

	:global(.markdown-content p) {
		@apply text-zinc-700 dark:text-zinc-300 mb-6;
	}

	:global(.markdown-content ul) {
		@apply list-disc ml-6 mb-6 text-zinc-700 dark:text-zinc-300;
	}

	:global(.markdown-content ol) {
		@apply list-decimal ml-6 mb-6 text-zinc-700 dark:text-zinc-300;
	}

	:global(.markdown-content li) {
		@apply mb-2;
	}

	:global(.markdown-content img) {
		@apply mt-4 rounded-lg overflow-hidden border border-zinc-500/25 bg-zinc-800/30 max-w-full h-auto;
	}

	:global(.markdown-content blockquote) {
		@apply border-l-4 border-crimson-500/30 pl-4 italic text-zinc-400 my-4;
	}

	:global(.markdown-content hr) {
		@apply my-8 border-zinc-500/25;
	}

	:global(.markdown-content code) {
		@apply font-mono text-sm bg-zinc-200 px-1.5 py-0.5 rounded text-crimson-400;
	}

	:global(.markdown-content pre) {
		@apply bg-zinc-200/50 p-4 rounded-md overflow-x-auto mb-6 border border-zinc-500/25;
	}

	:global(.markdown-content pre code) {
		@apply bg-transparent p-0 text-zinc-800 dark:text-zinc-200;
	}

	:global(.markdown-content a) {
		@apply text-crimson-400 hover:text-crimson-300 underline;
	}

	:global(.markdown-content table) {
		@apply w-full border-collapse mb-6 bg-zinc-800/20;
		table-layout: fixed;
	}

	:global(.markdown-content .table-scroll) {
		@apply mb-6;
	}

	:global(.markdown-content .table-scroll table) {
		@apply mb-0;
	}

	:global(.markdown-content th) {
		@apply bg-zinc-800 text-left p-2 text-zinc-200 border border-zinc-500/25;
	}

	:global(.markdown-content td) {
		@apply p-2 border border-zinc-500/25 text-zinc-300 text-center align-middle;
		width: calc(100% / var(--col-count, 10));
	}

	:global(.markdown-content tr:nth-child(odd)) {
		@apply bg-zinc-800/30;
	}

	:global(.markdown-content tr:nth-child(even)) {
		@apply bg-zinc-800/10;
	}

	:global(.markdown-content img) {
		@apply object-contain mx-auto block;
		width: 33%;
		height: auto;
		max-width: 33%;
	}

	:global(.markdown-content .markdown-gif) {
		@apply object-contain mx-auto block cursor-default;
		width: 50%;
		height: auto;
		max-width: 50%;
		transition: all 0.2s ease-in-out;
	}

	:global(.markdown-content .markdown-gif.lazy-gif) {
		filter: blur(10px);
		transform: scale(0.95);
	}

	:global(.markdown-content .markdown-gif:not(.lazy-gif)) {
		filter: blur(0);
		transform: scale(1);
	}

	:global(.markdown-content .markdown-gif:hover) {
		transform: scale(1);
	}

	:global(.markdown-content table .markdown-gif) {
		width: 100%;
		max-width: 100%;
	}

	:global(.markdown-content table img) {
		@apply object-contain mx-auto block;
		width: 100%;
		height: auto;
		max-width: 100%;
	}

	:global(.markdown-content table.cols-3 td) {
		width: 33.333%;
	}

	:global(.markdown-content table.cols-3 img) {
		max-width: 120px;
		margin: 0 auto;
	}

	:global(.markdown-content table.cols-4 td) {
		width: 25%;
	}

	:global(.markdown-content table.cols-4 img) {
		max-width: 100px;
		margin: 0 auto;
	}

	:global(.markdown-content table.cols-10 td) {
		width: 10%;
	}

	:global(.markdown-content table.cols-10 img) {
		max-width: 60px;
		margin: 0 auto;
	}

	:global(.markdown-content .katex) {
		@apply text-zinc-700 dark:text-zinc-300;
		font-size: 1.1em;
	}

	:global(.markdown-content .katex-display) {
		@apply my-6 px-2 py-2;
		/* Long formulas scroll sideways; the box, not the page, grows. The
		   vertical padding keeps tall exponents and fractions from being cut. */
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		max-width: 100%;
	}

	:global(.markdown-content .katex-display > .katex) {
		@apply text-zinc-700 dark:text-zinc-300;
		font-size: 1.21em;
	}

	:global(.markdown-content .admonition) {
		@apply shadow-lg;
	}

	:global(.markdown-content .admonition .content) {
		@apply text-zinc-700 dark:text-zinc-300;
	}

	:global(.markdown-content .admonition .content p) {
		@apply mb-4 last:mb-0;
	}

	:global(.markdown-content .admonition .content ul) {
		@apply list-none ml-0 mb-4 last:mb-0;
	}

	:global(.markdown-content .admonition .content ul li) {
		@apply flex items-start mb-2 last:mb-0;
	}

	:global(.markdown-content .admonition .content ul li::before) {
		content: '';
		@apply inline-block w-2 h-2 mr-3 mt-2 bg-zinc-600 rounded-full;
	}

	:global(.markdown-content .admonition .content ol) {
		counter-reset: admonition-ol;
		@apply list-none pl-0 mb-4 last:mb-0;
	}

	:global(.markdown-content .admonition .content ol li) {
		counter-increment: admonition-ol;
		@apply flex items-start mb-2 last:mb-0;
	}

	:global(.markdown-content .admonition .content ol li::before) {
		content: counter(admonition-ol);
		@apply inline-flex items-center justify-center min-w-6 h-6 mr-2 bg-zinc-700 text-white rounded-full text-sm font-semibold;
	}

	:global(.markdown-content .admonition .content code) {
		@apply bg-zinc-800/50;
	}

	:global(.markdown-content .admonition .content pre) {
		@apply bg-zinc-800/30;
	}

	:global(.markdown-content .admonition .content .katex) {
		@apply text-zinc-700 dark:text-zinc-300;
	}

	:global(.markdown-content .tikz-container) {
		@apply my-6 overflow-x-auto;
	}

	:global(.markdown-content .tikz-container svg) {
		@apply max-w-full h-auto;
	}

	/* Phones and tablets: reading sizes, one-column figures, anchors that
	   land under the compact sticky header, tables that scroll sideways. */
	@media (max-width: 1023px) {
		:global(.markdown-content) {
			font-size: 1.0625rem;
			line-height: 1.65;
		}

		:global(.markdown-content h2) {
			font-size: var(--text-2xl);
			line-height: var(--text-2xl--line-height);
			margin-top: 2.5rem;
			margin-bottom: 1.25rem;
			scroll-margin-top: 4.5rem;
		}

		:global(.markdown-content h3) {
			font-size: var(--text-xl);
			line-height: var(--text-xl--line-height);
			margin-top: 2rem;
			margin-bottom: 0.75rem;
			scroll-margin-top: 4.5rem;
		}

		:global(.markdown-content h4) {
			font-size: var(--text-lg);
			line-height: var(--text-lg--line-height);
			margin-top: 1.5rem;
			scroll-margin-top: 4.5rem;
		}

		:global(.markdown-content ul),
		:global(.markdown-content ol) {
			margin-left: 1.25rem;
		}

		:global(.markdown-content table) {
			table-layout: auto;
			width: 100%;
		}

		:global(.markdown-content td),
		:global(.markdown-content th) {
			width: auto;
			min-width: 6rem;
		}

		:global(.markdown-content .katex-display) {
			padding: 0.5rem 0.5rem;
		}
	}

	@media (max-width: 767px) {
		:global(.markdown-content img),
		:global(.markdown-content .markdown-gif) {
			width: 100%;
			max-width: 100%;
		}

		:global(.markdown-content table img),
		:global(.markdown-content table .markdown-gif) {
			max-width: 100%;
		}

		:global(.markdown-content pre) {
			padding: 0.75rem;
		}
	}
</style>
