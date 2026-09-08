'use client';

import { useEffect, useMemo, useState } from 'react';
import type katexType from 'katex';
import { escapeHtml } from '@/lib/utils/escape';

type Katex = typeof katexType;

let katexPromise: Promise<Katex> | null = null;
/** KaTeX is loaded once, the first time a reply has to be typeset in the browser. */
const loadKatex = () => (katexPromise ??= import('katex').then((m) => m.default));

function math(katex: Katex | null, tex: string, display: boolean): string {
	if (!katex) return `<span class="text-fg-subtle">${escapeHtml(tex)}</span>`;
	try {
		const html = katex.renderToString(tex.trim(), { displayMode: display, throwOnError: false });
		return display ? `<div class="katex-block my-4 overflow-x-auto py-2">${html}</div>` : html;
	} catch {
		return escapeHtml(tex);
	}
}

/**
 * The subset of markdown the assistant writes (headings, lists, bold,
 * italics, code, rules) with LaTeX, rendered while the reply streams.
 * Block math first, so its contents never meet the inline rules.
 */
export function renderChatMarkdown(text: string, katex: Katex | null): string {
	const blocks: string[] = [];
	// Private-use characters bracket the index, so nothing typed or generated is ever mistaken for a placeholder.
	const keep = (html: string) => `\uE000${blocks.push(html) - 1}\uE001`;
	let html = text
		.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex: string) => keep(math(katex, tex, true)))
		.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex: string) => keep(math(katex, tex, true)))
		.replace(/```(\w*)\n([\s\S]*?)```/g, (_, __, code: string) => keep(`<pre class="my-3 overflow-x-auto rounded-lg bg-surface-3 p-3"><code class="text-sm">${escapeHtml(code.trim())}</code></pre>`))
		.replace(/\$([^$\n]+?)\$/g, (m, tex: string) => (/^\d/.test(tex.trim()) ? m : keep(math(katex, tex, false))))
		.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex: string) => keep(math(katex, tex, false)))
		.replace(/`([^`]+)`/g, (_, code: string) => keep(`<code class="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-sm text-accent-fg">${escapeHtml(code)}</code>`));
	html = escapeHtml(html)
		.replace(/^### (.+)$/gm, '<h4 class="mt-4 mb-2 font-semibold text-fg">$1</h4>')
		.replace(/^## (.+)$/gm, '<h3 class="mt-4 mb-2 text-lg font-bold text-fg">$1</h3>')
		.replace(/^# (.+)$/gm, '<h2 class="mt-4 mb-3 text-xl font-bold text-fg">$1</h2>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-fg">$1</strong>')
		.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
		.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
		.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
		.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<${m.includes('list-disc') ? 'ul' : 'ol'} class="my-2 space-y-1">${m}</${m.includes('list-disc') ? 'ul' : 'ol'}>`)
		.replace(/^---$/gm, '<hr class="my-4 border-edge">')
		.replace(/\n/g, '<br>')
		.replace(/<\/(h[234]|pre|ul|ol|div|hr)><br>/g, '</$1>')
		.replace(/<br><(h[234]|pre|ul|ol)/g, '<$1');
	return html.replace(/\uE000(\d+)\uE001/g, (_, i: string) => blocks[Number(i)]);
}

export function ChatMessage({ content, className }: { content: string; className?: string }) {
	const [katex, setKatex] = useState<Katex | null>(null);
	const needsMath = /\$|\\\(|\\\[/.test(content);
	useEffect(() => {
		if (needsMath && !katex) loadKatex().then(setKatex);
	}, [needsMath, katex]);
	const html = useMemo(() => renderChatMarkdown(content, katex), [content, katex]);
	return <div className={`math-content ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
