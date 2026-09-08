import { latexToHtml } from '@/lib/content/latex';

/** A title that may contain LaTeX, typeset on the server. Plain titles render as text. */
export function Latex({ content = '', className }: { content?: string; className?: string }) {
	const html = latexToHtml(content);
	if (!html) return <span className={className}>{content}</span>;
	return <span className={`math-inline ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
