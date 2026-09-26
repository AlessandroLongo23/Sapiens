#!/usr/bin/env node
/**
 * Checks every URL in the sitemap the way Googlebot sees it, and fails on any
 * page that would be a problem in search:
 *
 *   - status other than 200 (redirects included)
 *   - noindex in the robots meta or the X-Robots-Tag header
 *   - canonical missing or different from the sitemap URL
 *   - not exactly one <title> and one <h1>, missing description
 *   - title or description shared with another page
 *   - fewer than --min-words words of visible text
 *   - a path that robots.txt disallows
 *
 * Usage:
 *   node scripts/check-seo.mjs                                  # local server on :3000
 *   node scripts/check-seo.mjs https://sapiens-edu.vercel.app   # production
 *   node scripts/check-seo.mjs <base> --min-words 150 --concurrency 4
 *
 * The sitemap's URLs carry SITE_URL, which locally is not the server being
 * checked: each URL is fetched on <base> with the same path, and its canonical
 * is compared with the URL as the sitemap lists it.
 */

const args = process.argv.slice(2);
const flag = (name, fallback) => {
	const i = args.indexOf(`--${name}`);
	return i >= 0 ? Number(args[i + 1]) : fallback;
};
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? 'http://localhost:3000').replace(/\/+$/, '');
// Below this a page is little more than its menu and footer.
const MIN_WORDS = flag('min-words', 100);
const CONCURRENCY = flag('concurrency', 6);
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const decode = (s) =>
	s
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#x27;|&#39;/g, "'")
		.replace(/&nbsp;/g, ' ');

async function get(url) {
	const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'manual' });
	return { res, body: await res.text() };
}

/** Disallow prefixes that apply to every crawler (the `User-agent: *` group). */
function disallowed(robots) {
	const out = [];
	let applies = false;
	for (const raw of robots.split('\n')) {
		const line = raw.replace(/#.*/, '').trim();
		const [key, ...rest] = line.split(':');
		const value = rest.join(':').trim();
		if (/^user-agent$/i.test(key)) applies = value === '*';
		else if (applies && /^disallow$/i.test(key) && value) out.push(value);
	}
	return out;
}

function inspect(html) {
	const head = html.slice(0, html.indexOf('</head>') + 1 || undefined);
	const titles = [...head.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]).trim());
	const robots = [...head.matchAll(/<meta name="robots" content="([^"]*)"/g)].map((m) => m[1]);
	const canonical = head.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? null;
	const description = decode(head.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '').trim();
	const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
	// Visible text: the body without scripts (the React payload repeats the page), styles, SVG and MathML.
	const text = decode(
		html
			.slice(html.indexOf('<body'))
			.replace(/<(script|style|svg|math|template)[\s\S]*?<\/\1>/g, ' ')
			.replace(/<[^>]+>/g, ' ')
	);
	const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
	return { titles, robots, canonical, description, h1, words };
}

async function pool(items, size, fn) {
	const results = new Array(items.length);
	let next = 0;
	await Promise.all(
		Array.from({ length: Math.min(size, items.length) }, async () => {
			while (next < items.length) {
				const i = next++;
				results[i] = await fn(items[i], i);
			}
		})
	);
	return results;
}

const sitemap = await get(`${base}/sitemap.xml`);
if (sitemap.res.status !== 200) {
	console.error(`sitemap.xml: HTTP ${sitemap.res.status}`);
	process.exit(1);
}
if (sitemap.body.includes('<sitemapindex')) {
	console.error('sitemap.xml is an index of sitemaps: this script reads a single urlset.');
	process.exit(1);
}
const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
const robotsTxt = await get(`${base}/robots.txt`);
const blocked = robotsTxt.res.status === 200 ? disallowed(robotsTxt.body) : [];

console.log(`${locs.length} URL nella sitemap di ${base}, minimo ${MIN_WORDS} parole\n`);

let done = 0;
const pages = await pool(locs, CONCURRENCY, async (loc) => {
	const path = new URL(loc).pathname;
	const problems = [];
	if (blocked.some((p) => path === p || path.startsWith(p.endsWith('/') ? p : p + '/') || (p.endsWith('/') && path.startsWith(p)))) problems.push('bloccata da robots.txt');
	let info = null;
	try {
		const { res, body } = await get(base + path);
		if (res.status !== 200) problems.push(`HTTP ${res.status}${res.headers.get('location') ? ` → ${res.headers.get('location')}` : ''}`);
		else {
			info = inspect(body);
			const header = res.headers.get('x-robots-tag') ?? '';
			if (/noindex/i.test(header)) problems.push(`X-Robots-Tag: ${header}`);
			if (info.robots.some((r) => /noindex/i.test(r))) problems.push(`robots: ${info.robots.join(' | ')}`);
			if (!info.canonical || new URL(info.canonical).href !== new URL(loc).href) problems.push(`canonical ${info.canonical ?? 'assente'}`);
			if (info.titles.length !== 1) problems.push(`${info.titles.length} <title>`);
			if (!info.description) problems.push('description assente');
			if (info.h1 !== 1) problems.push(`${info.h1} <h1>`);
			if (info.words < MIN_WORDS) problems.push(`${info.words} parole`);
		}
	} catch (err) {
		problems.push(`errore: ${err.message}`);
	}
	if (++done % 50 === 0) process.stderr.write(`  ${done}/${locs.length}\n`);
	return { path, info, problems };
});

// Duplicates across pages: Google shows one of them and drops the rest.
for (const key of ['title', 'description']) {
	const seen = new Map();
	for (const p of pages) {
		const value = key === 'title' ? p.info?.titles[0] : p.info?.description;
		if (!value) continue;
		seen.set(value, [...(seen.get(value) ?? []), p]);
	}
	for (const [value, same] of seen) {
		if (same.length < 2) continue;
		for (const p of same) p.problems.push(`${key} uguale ad altre ${same.length - 1} pagine: "${value.slice(0, 60)}"`);
	}
}

const failing = pages.filter((p) => p.problems.length);
for (const p of failing) console.log(`✗ ${p.path}\n    ${p.problems.join('\n    ')}`);

const words = pages.map((p) => p.info?.words ?? 0).sort((a, b) => a - b);
const median = words[Math.floor(words.length / 2)] ?? 0;
console.log(`\n${pages.length - failing.length}/${pages.length} pagine a posto; parole per pagina: minimo ${words[0] ?? 0}, mediana ${median}`);
process.exit(failing.length ? 1 : 0);
