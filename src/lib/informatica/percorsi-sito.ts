/**
 * The paths between the files of a small site, for the figure of the lesson on links and images
 * (components/content/interactive/informatica/PercorsiSito.tsx). No React here: the files of the site, the relative
 * path from a page to a file, and where a path written in a page leads.
 *
 * A file is its path from the root of the site, without the slash in front: `concerti/date.html`. A path written in
 * a page is read as a browser reads the `href` of a link: from the folder of the page, one piece at a time, `..`
 * going up one folder and `.` staying; with a slash in front it starts from the root of the site; with a protocol in
 * front (`https://`) it is the address of another site and no path of this one.
 */

/** One move along a path: where it starts, a folder up, a folder down, or the file at the end. `in` is the folder one is in after the move ('' is the root). */
export interface Mossa {
	tipo: 'parti' | 'radice' | 'su' | 'giu' | 'file';
	in: string;
	/** The piece of the path that makes the move: `..`, `img`, `logo.png`; for `parti` the folder of the page. */
	pezzo: string;
}

export type Esito =
	/** `percorso` is the file reached, from the root. */
	| { tipo: 'file'; percorso: string; mosse: Mossa[] }
	/** The path stops on a folder, not on a file. */
	| { tipo: 'cartella'; percorso: string; mosse: Mossa[] }
	/** A piece names nothing that is there: `manca` is the piece, `in` the folder where it was looked for. */
	| { tipo: 'manca'; manca: string; in: string; mosse: Mossa[] }
	/** A `..` too many: above the root of the site there is nothing to go to. */
	| { tipo: 'fuori'; mosse: Mossa[] }
	/** An address with its protocol: another site. */
	| { tipo: 'esterno' }
	| { tipo: 'vuoto' };

/** The folder of a file, from the root: '' for a file in the root. */
export const cartellaDi = (file: string) => file.split('/').slice(0, -1).join('/');
export const nomeDi = (file: string) => file.split('/').pop() ?? '';

/** Every folder of a site, from the paths of its files: `concerti`, `concerti/natale`. */
export function cartelle(file: readonly string[]): string[] {
	const tutte = new Set<string>();
	for (const f of file) {
		const pezzi = f.split('/').slice(0, -1);
		pezzi.forEach((_, i) => tutte.add(pezzi.slice(0, i + 1).join('/')));
	}
	return [...tutte].sort();
}

/** The relative path that leads from the page `da` to the file `a`: as many `..` as the folders to leave, then the folders to enter and the name. */
export function relativo(da: string, a: string): string {
	const parto = da.split('/').slice(0, -1);
	const arrivo = a.split('/');
	let comuni = 0;
	while (comuni < parto.length && comuni < arrivo.length - 1 && parto[comuni] === arrivo[comuni]) comuni++;
	return [...parto.slice(comuni).map(() => '..'), ...arrivo.slice(comuni)].join('/');
}

/** The path of a file from the root of the site, as it is written in a page: with the slash in front. */
export const dallaRadice = (file: string) => `/${file}`;

/** Where the path `scritto` in the page `da` leads, among the `file` of the site, and the moves it makes. */
export function risolvi(file: readonly string[], da: string, scritto: string): Esito {
	const testo = scritto.trim().split(/[?#]/)[0];
	if (!testo) return { tipo: 'vuoto' };
	if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(testo)) return { tipo: 'esterno' };
	const esistono = new Set(cartelle(file));
	const sono = new Set(file);
	const mosse: Mossa[] = [];
	let qui: string[];
	if (testo.startsWith('/')) {
		qui = [];
		mosse.push({ tipo: 'radice', in: '', pezzo: '/' });
	} else {
		qui = da.split('/').slice(0, -1);
		mosse.push({ tipo: 'parti', in: qui.join('/'), pezzo: qui[qui.length - 1] ?? '' });
	}
	const pezzi = testo.split('/').filter((pezzo, i, tutti) => pezzo !== '' || i === tutti.length - 1);
	for (const [i, pezzo] of pezzi.entries()) {
		const ultimo = i === pezzi.length - 1;
		if (pezzo === '.') continue;
		if (pezzo === '') return { tipo: 'cartella', percorso: qui.join('/'), mosse };
		if (pezzo === '..') {
			if (!qui.length) return { tipo: 'fuori', mosse };
			qui = qui.slice(0, -1);
			mosse.push({ tipo: 'su', in: qui.join('/'), pezzo });
			continue;
		}
		const qua = [...qui, pezzo].join('/');
		if (esistono.has(qua)) {
			qui = [...qui, pezzo];
			mosse.push({ tipo: 'giu', in: qua, pezzo });
		} else if (sono.has(qua) && ultimo) {
			mosse.push({ tipo: 'file', in: qui.join('/'), pezzo });
			return { tipo: 'file', percorso: qua, mosse };
		} else return { tipo: 'manca', manca: pezzo, in: qui.join('/'), mosse };
	}
	return { tipo: 'cartella', percorso: qui.join('/'), mosse };
}
