// Downloads a photo of each element for the periodic table's cards, with its author and licence.
//
//   node scripts/tavola-periodica/foto.mjs
//
// The photo is the image of the element's item on Wikidata (P18), a file on Wikimedia Commons; author and licence
// come from the file's page there. Writes the images (480 px wide, WebP) in public/tavola-periodica/elementi/ and
// src/lib/tools/elementi-foto.json. An element in SKIP has no photo: its image on Wikidata is not a sample of the
// element. An element in PICK uses the file named here in place of the one on Wikidata.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_DIR = path.join(root, 'public/tavola-periodica/elementi');
const OUT_JSON = path.join(root, 'src/lib/tools/elementi-foto.json');
const AGENT = { 'user-agent': 'sapiens-tavola-periodica/1.0 (https://github.com/AlessandroLongo23)' };
/** Asked of Commons, then brought down to OUT_WIDTH: the card is 21 rem wide, twice that for dense screens. */
const WIDTH = 640;
const OUT_WIDTH = 480;

/** Atomic numbers left without a photo, with the reason. */
const SKIP = new Map([
	[84, 'an antistatic brush that contains polonium, not the element'],
	[85, 'vials, the element is not visible'],
	[86, 'a laboratory apparatus'],
	[87, 'a label, the element is not visible'],
	[101, 'the cell of a periodic table'],
	[102, 'the cell of a periodic table'],
	[103, 'the cell of a periodic table'],
	[104, 'the cell of a periodic table'],
	[105, 'the cell of a periodic table'],
	[115, 'an artist’s drawing of an experiment']
]);
/** Atomic number → file on Commons, where the image on Wikidata is not the one to show. */
const PICK = new Map([]);

const elements = JSON.parse(await readFile(path.join(root, 'src/lib/tools/elementi.json'), 'utf8'));

const sparql = 'SELECT ?z ?image WHERE { ?item wdt:P31 wd:Q11344; wdt:P1086 ?z; wdt:P18 ?image } ORDER BY ?z';
const wd = await (await fetch(`https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}`, { headers: { ...AGENT, accept: 'application/sparql-results+json' } })).json();
const files = new Map();
for (const row of wd.results.bindings) {
	const z = Math.round(Number(row.z.value));
	if (!files.has(z)) files.set(z, decodeURIComponent(row.image.value.split('/').pop()).replaceAll('_', ' '));
}
for (const [z, file] of PICK) files.set(z, file);
for (const z of SKIP.keys()) files.delete(z);

/** The text of a field of Commons, which comes as HTML, sometimes with a style sheet inside. */
const strip = (html) =>
	(html ?? '')
		.replace(/<style[\s\S]*?<\/style>/g, '')
		.replace(/<[^>]+>/g, '')
		.replace(/\.mw-parser-output[^}]*\}/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&#0?39;|&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/\s*\((talk|Diskussion)\)/g, '')
		.replace(/\s+/g, ' ')
		.trim();

await mkdir(OUT_DIR, { recursive: true });
const photos = {};
const todo = [...files.entries()];
for (let i = 0; i < todo.length; i += 20) {
	const batch = todo.slice(i, i + 20);
	const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=${WIDTH}&titles=${encodeURIComponent(batch.map(([, f]) => `File:${f}`).join('|'))}`;
	const data = await (await fetch(url, { headers: AGENT })).json();
	const normalized = new Map((data.query.normalized ?? []).map((n) => [n.to, n.from]));
	for (const page of Object.values(data.query.pages)) {
		const title = (normalized.get(page.title) ?? page.title).replace(/^File:/, '');
		const found = batch.find(([, f]) => f === title || f === page.title.replace(/^File:/, ''));
		const info = page.imageinfo?.[0];
		if (!found || !info) {
			console.warn('senza dati:', page.title);
			continue;
		}
		const [z] = found;
		const el = elements[z - 1];
		const meta = info.extmetadata;
		const name = `${el.symbol.toLowerCase()}.webp`;
		const res = await fetch(info.thumburl, { headers: AGENT });
		if (!res.ok) {
			console.warn(`${el.symbol}: ${res.status} ${info.thumburl}`);
			continue;
		}
		const image = await sharp(Buffer.from(await res.arrayBuffer())).resize({ width: OUT_WIDTH, withoutEnlargement: true }).webp({ quality: 76 }).toBuffer({ resolveWithObject: true });
		await writeFile(path.join(OUT_DIR, name), image.data);
		photos[el.symbol] = {
			src: `/tavola-periodica/elementi/${name}`,
			width: image.info.width,
			height: image.info.height,
			author: strip(meta.Artist?.value).slice(0, 90) || 'autore non indicato',
			licence: strip(meta.LicenseShortName?.value) || 'licenza non indicata',
			licenceUrl: meta.LicenseUrl?.value ?? null,
			page: info.descriptionurl
		};
	}
}

const ordered = Object.fromEntries(elements.filter((el) => photos[el.symbol]).map((el) => [el.symbol, photos[el.symbol]]));
await writeFile(OUT_JSON, `{\n${Object.entries(ordered).map(([k, v]) => `\t${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n')}\n}\n`);
console.log(`${Object.keys(ordered).length} foto in ${path.relative(root, OUT_DIR)}`);
