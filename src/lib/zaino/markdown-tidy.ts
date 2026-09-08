/**
 * Undoes what the WYSIWYG serializer adds to text nobody typed. It encodes
 * `< > &` as entities and escapes `[ ]` in all prose, and marked's autolinker
 * turns a bare URL into a link with itself as the label; none of that is what
 * the student wrote, and Advanced mode shows them the source. Escapes markdown
 * genuinely needs (\* \_ \` \~ \\) are left alone.
 *
 * Decoding `&amp;` means a literally typed `&amp;` comes back as `&`. That is
 * the one accepted regression, and it is safe because notes are rendered with
 * `html: false` (see lib/content/note-markdown), which escapes it again.
 *
 * No TipTap import here: the store and the header call it.
 */
export function tidy(markdown: string): string {
	return (
		markdown
			.replace(/\r\n?/g, '\n')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&')
			// Footnote references, which the serializer escapes as \[^1\].
			.replace(/\\\[\^([^\]\n]+)\\\]/g, '[^$1]')
			// A link whose label is its own href was a bare URL before serialization.
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label: string, href: string) => (label === href ? label : m))
			.replace(/[ \t]+$/gm, '')
			.replace(/\n{3,}/g, '\n\n')
			.trimEnd() + '\n'
	);
}
