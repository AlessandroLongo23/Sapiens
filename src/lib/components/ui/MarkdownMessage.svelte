<script lang="ts">
    import katex from 'katex';
    import 'katex/dist/katex.min.css';

    interface Props {
        content: string;
        class?: string;
    }

    let { content, class: className = '' }: Props = $props();

    /**
     * Renders markdown content with LaTeX support.
     * Handles:
     * - Block LaTeX: $$...$$ or \[...\]
     * - Inline LaTeX: $...$ or \(...\)
     * - Bold: **text**
     * - Italic: *text*
     * - Code: `code`
     * - Headers: # ## ###
     * - Lists: - or 1.
     * - Line breaks
     */
    let renderedContent = $derived.by(() => {
        if (!content) return '';

        let html = content;

        // Process block LaTeX first ($$...$$ and \[...\])
        html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_, latex) => {
            try {
                return `<div class="katex-block my-4">${katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false })}</div>`;
            } catch (e) {
                return `<div class="katex-error text-red-500">${latex}</div>`;
            }
        });

        html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_, latex) => {
            try {
                return `<div class="katex-block my-4">${katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false })}</div>`;
            } catch (e) {
                return `<div class="katex-error text-red-500">${latex}</div>`;
            }
        });

        // Process inline LaTeX ($...$ and \(...\))
        // Be careful not to match currency like $10
        html = html.replace(/\$([^\$\n]+?)\$/g, (match, latex) => {
            // Skip if it looks like currency (number after $)
            if (/^\d/.test(latex.trim())) return match;
            try {
                return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false });
            } catch (e) {
                return match;
            }
        });

        html = html.replace(/\\\(([\s\S]*?)\\\)/g, (_, latex) => {
            try {
                return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false });
            } catch (e) {
                return latex;
            }
        });

        // Process code blocks ```
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
            return `<pre class="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 overflow-x-auto my-3"><code class="text-sm text-zinc-800 dark:text-zinc-200">${escapeHtml(code.trim())}</code></pre>`;
        });

        // Process inline code `code`
        html = html.replace(/`([^`]+)`/g, '<code class="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-rose-500 dark:text-rose-400 font-mono">$1</code>');

        // Process headers
        html = html.replace(/^### (.+)$/gm, '<h4 class="font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">$1</h4>');
        html = html.replace(/^## (.+)$/gm, '<h3 class="font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-2 text-lg">$1</h3>');
        html = html.replace(/^# (.+)$/gm, '<h2 class="font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-3 text-xl">$1</h2>');

        // Process bold and italic
        html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong class="font-semibold text-zinc-900 dark:text-zinc-100">$1</strong>');
        html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');

        // Process unordered lists
        html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
        
        // Process ordered lists
        html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

        // Wrap consecutive list items
        html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => {
            if (match.includes('list-disc')) {
                return `<ul class="my-2 space-y-1">${match}</ul>`;
            } else {
                return `<ol class="my-2 space-y-1">${match}</ol>`;
            }
        });

        // Process horizontal rules
        html = html.replace(/^---$/gm, '<hr class="my-4 border-zinc-200 dark:border-zinc-700">');

        // Process line breaks (but not inside pre tags)
        html = html.replace(/\n/g, '<br>');
        
        // Clean up extra br tags after block elements
        html = html.replace(/<\/(h[234]|pre|ul|ol|div|hr)><br>/g, '</$1>');
        html = html.replace(/<br><(h[234]|pre|ul|ol)/g, '<$1');

        return html;
    });

    function escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
</script>

<div class="markdown-message {className}">
    {@html renderedContent}
</div>

<style>
    .markdown-message :global(.katex) {
        font-size: 1em;
    }

    .markdown-message :global(.katex-block) {
        overflow-x: auto;
        padding: 0.5rem 0;
    }

    .markdown-message :global(.katex-block .katex) {
        font-size: 1.1em;
    }
</style>

