import { getFontEmbedCSS } from 'html-to-image';

/**
 * A picture of a note's page, for the paper crumple (NoteCrumple). The page's markup goes into an SVG next to the
 * site's own stylesheets, once, and the browser draws it: about a tenth of a second. html-to-image's `toPng` copies
 * every computed style onto every node instead, which on a page of formulas (well over a thousand nodes) made a 35 MB
 * SVG and took three seconds. html-to-image still embeds the fonts, which an SVG drawn as an image cannot fetch.
 *
 * The CSS custom properties hold: `:root` rules match the SVG's root, and the page sits inside the classes of <html>
 * (the dark theme) and <body>.
 */
export async function photographPage(page: HTMLElement, width: number): Promise<string> {
	const rect = page.getBoundingClientRect();
	const scale = width / rect.width;

	// The site's @font-face rules point at files an SVG image may not load; later in the sheet than the embedded ones,
	// they would win and leave the fallback fonts. Only the embedded ones go in.
	const fonts = await getFontEmbedCSS(page, { preferredFontFormat: 'woff2' });
	let css = '';
	for (const sheet of Array.from(document.styleSheets)) {
		let rules: CSSRuleList;
		try {
			rules = sheet.cssRules;
		} catch {
			continue; // A stylesheet from another origin: nothing of it is on the page.
		}
		for (const rule of Array.from(rules)) if (!(rule instanceof CSSFontFaceRule)) css += rule.cssText + '\n';
	}

	const markup = new XMLSerializer().serializeToString(page.cloneNode(true));
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width * scale}" height="${rect.height * scale}" viewBox="0 0 ${rect.width} ${rect.height}">` +
		`<style><![CDATA[${(fonts + css).replaceAll(']]>', '')}]]></style>` +
		`<foreignObject width="100%" height="100%">` +
		`<div xmlns="http://www.w3.org/1999/xhtml" class="${document.documentElement.className}" style="width:${rect.width}px;height:${rect.height}px">` +
		`<div class="${document.body.className}">${markup}</div></div>` +
		`</foreignObject></svg>`;

	const image = new Image();
	image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	await image.decode();
	const canvas = document.createElement('canvas');
	canvas.width = Math.round(rect.width * scale);
	canvas.height = Math.round(rect.height * scale);
	const context = canvas.getContext('2d');
	if (!context) throw new Error('No 2D canvas.');
	context.drawImage(image, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL('image/png');
}
