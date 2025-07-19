<script>
	import katex from 'katex';
	import 'katex/dist/katex.min.css';
	
	let { content = '' } = $props();
	
	let containerElement;
	
	function renderMath(text) {
		if (!text) return '';
		
		// Replace display math $$...$$
		let processed = text.replace(/\$\$(.*?)\$\$/g, (match, mathContent) => {
			try {
				return katex.renderToString(mathContent.trim(), { displayMode: true });
			} catch (e) {
				console.error('KaTeX display error:', e);
				return match;
			}
		});
		
		// Replace inline math $...$
		processed = processed.replace(/\$([^$]+?)\$/g, (match, mathContent) => {
			try {
				return katex.renderToString(mathContent.trim(), { displayMode: false });
			} catch (e) {
				console.error('KaTeX inline error:', e);
				return match;
			}
		});
		
		return processed;
	}
	
	$effect(() => {
		if (containerElement && content) {
			containerElement.innerHTML = renderMath(content);
		}
	});
</script>

<div bind:this={containerElement} class="math-content">
	{#if !content}
		<span class="text-zinc-400">Caricamento...</span>
	{/if}
</div>

<style lang="postcss">
	@reference '../../app.css';
    
	:global(.math-content) {
		@apply text-zinc-700 dark:text-zinc-300;
	}
	
	:global(.math-content .katex) {
		@apply text-zinc-700 dark:text-zinc-300;
		font-size: 1.1em;
	}
	
	:global(.math-content .katex-display) {
		@apply my-4;
	}
	
	:global(.math-content .katex-display > .katex) {
		@apply text-zinc-700 dark:text-zinc-300;
		font-size: 1.3em;
	}
</style> 