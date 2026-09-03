<script lang="ts">
	import katex from 'katex';
	import 'katex/dist/katex.min.css';
	import { plainTitle } from '$lib/seo/slug';

	interface Props {
		content?: string;
		class?: string;
	}

	let { content = '', class: className = '' }: Props = $props();

	function escapeAttr(value: string): string {
		return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
	}

	let renderedContent = $derived.by(() => {
		if (!content) return null;

		// Convert double backslashes to single backslashes for LaTeX commands
		// e.g., \\mathbb{N} -> \mathbb{N}
		const normalizedContent = content.replace(/\\\\/g, '\\');

		// Check if the content contains LaTeX commands
		const hasLatex = normalizedContent.includes('\\') && /\\[a-zA-Z]/.test(normalizedContent);

		if (!hasLatex) {
			return null; // Return null to indicate plain text rendering
		}

		// Extract and render LaTeX commands separately from text
		// Match LaTeX commands like \mathbb{N}, \mathbb{Z}, \sum, etc.
		const latexPattern = /(\\[a-zA-Z]+\{[^}]+\}|\\[a-zA-Z]+)/g;
		const parts: Array<{ type: 'text' | 'latex'; content: string }> = [];
		let lastIndex = 0;
		let match;

		latexPattern.lastIndex = 0;

		while ((match = latexPattern.exec(normalizedContent)) !== null) {
			if (match.index > lastIndex) {
				parts.push({
					type: 'text',
					content: normalizedContent.substring(lastIndex, match.index)
				});
			}
			parts.push({
				type: 'latex',
				content: match[0]
			});
			lastIndex = match.index + match[0].length;
		}

		if (lastIndex < normalizedContent.length) {
			parts.push({
				type: 'text',
				content: normalizedContent.substring(lastIndex)
			});
		}

		if (parts.length === 0 || parts.every((p) => p.type === 'text')) {
			return null;
		}

		// Render each part. Only the HTML output is emitted (no MathML twin), and the
		// wrapper carries the readable form so the accessible text is "ℕ", not "N \mathbb{N} N".
		const renderedParts = parts.map((part) => {
			if (part.type === 'latex') {
				try {
					const html = katex.renderToString(part.content, {
						displayMode: false,
						throwOnError: false,
						output: 'html'
					});
					return `<span role="math" aria-label="${escapeAttr(plainTitle(part.content))}">${html}</span>`;
				} catch (e) {
					console.error('KaTeX rendering error:', e, part.content);
					return escapeAttr(plainTitle(part.content));
				}
			}
			return escapeAttr(part.content);
		});

		return renderedParts.join('');
	});
</script>

<span class={className || undefined}>
	{#if renderedContent}
		{@html renderedContent}
	{:else}
		{content}
	{/if}
</span>

<style>
	:global(.katex) {
		font-size: calc(1em + 0.25vw);
	}
</style>
