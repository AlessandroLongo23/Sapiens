<script lang="ts">
	import katex from 'katex';
	import 'katex/dist/katex.min.css';

	interface Props {
		content?: string;
		class?: string;
	}

	let { content = '', class: className = '' }: Props = $props();

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
		// Pattern matches: \command{arg} or \command
		const latexPattern = /(\\[a-zA-Z]+\{[^}]+\}|\\[a-zA-Z]+)/g;
		const parts: Array<{ type: 'text' | 'latex'; content: string }> = [];
		let lastIndex = 0;
		let match;

		// Reset regex lastIndex to ensure proper matching
		latexPattern.lastIndex = 0;

		while ((match = latexPattern.exec(normalizedContent)) !== null) {
			// Add text before the LaTeX command
			if (match.index > lastIndex) {
				parts.push({
					type: 'text',
					content: normalizedContent.substring(lastIndex, match.index)
				});
			}
			// Add the LaTeX command
			parts.push({
				type: 'latex',
				content: match[0]
			});
			lastIndex = match.index + match[0].length;
		}

		// Add remaining text
		if (lastIndex < normalizedContent.length) {
			parts.push({
				type: 'text',
				content: normalizedContent.substring(lastIndex)
			});
		}

		// If no LaTeX commands were found, return null for plain text
		if (parts.length === 0 || parts.every((p) => p.type === 'text')) {
			return null;
		}

		// Render each part
		const renderedParts = parts.map((part) => {
			if (part.type === 'latex') {
				try {
					return katex.renderToString(part.content, {
						displayMode: false,
						throwOnError: false
					});
				} catch (e) {
					console.error('KaTeX rendering error:', e, part.content);
					return part.content;
				}
			}
			return part.content;
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

