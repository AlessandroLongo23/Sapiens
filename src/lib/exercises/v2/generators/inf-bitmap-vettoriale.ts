/**
 * Grafica bitmap e grafica vettoriale. Spec: specs/exercises/inf-bitmap-vettoriale.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/83-inf-bitmap-vettoriale.md), all multiple choice
 * of texts: 1. bitmap or vector for a job; 2. reading a small SVG shown under the question (where a circle is, which
 * of two covers the other, how wide it is); 3. the pixels a print needs, inches times dpi; 4. how large a print
 * comes out, in inches and centimetres, and at which density; 5. statements about what the operations do to pixels.
 */
import type { Rng } from '../types';
import { choose, makeCodeGenerator, textOption, type CodeBuilt } from '../inf-codice';
import { asked, situationLevel, statementLevel, type Situation, type Statement } from '../inf-sic';

export const ID = 'inf-bitmap-vettoriale';

// ---------------------------------------------------------------------------
// Level 1: bitmap or vector

const JOBS: Situation[] = [
	{
		id: 'striscione',
		text: (N) => `${N} deve far stampare il logo della scuola su uno striscione largo due metri.`,
		ask: 'Che tipo di file conviene portare in tipografia?',
		right: 'Vettoriale: le forme vengono ricalcolate a ogni dimensione',
		wrong: ['Bitmap: più si ingrandisce, più dettagli compaiono', 'Bitmap: basta scrivere 300 dpi nelle proprietà del file', 'È indifferente: ingrandendo si comportano allo stesso modo', 'Vettoriale: contiene più pixel di una bitmap'],
		why: ['Un logo è fatto di poche forme, e un file vettoriale contiene proprio le forme.', 'A ogni dimensione il calcolatore ricalcola i pixel da accendere, e i bordi restano netti; una bitmap ingrandita così tanto mostrerebbe i suoi quadretti.']
	},
	{
		id: 'tramonto',
		text: (N) => `${N} ha fotografato un tramonto e vuole conservare la foto.`,
		ask: 'Che tipo di immagine è, e perché?',
		right: 'Bitmap: una foto non è fatta di forme, ma di pixel',
		wrong: ['Vettoriale: così si potrà ingrandire senza limiti', 'Vettoriale: le fotocamere salvano elenchi di forme', 'Bitmap: le bitmap non si sgranano mai', 'Vettoriale: una foto ha poche forme e molti colori'],
		why: ['Una fotografia è una griglia di pixel: la fotocamera misura un colore per ogni punto.', 'Descriverla con delle forme richiederebbe più istruzioni che pixel.']
	},
	{
		id: 'icona',
		text: (N) => `${N} disegna un'icona che l'app mostrerà in dieci dimensioni diverse, dal menu allo schermo intero.`,
		ask: 'Come conviene salvarla?',
		right: 'Vettoriale: un solo file resta netto a tutte le dimensioni',
		wrong: ['Bitmap piccola: ingrandendola resta netta', 'Bitmap: le icone sono fotografie in miniatura', 'Vettoriale: pesa di più, quindi ha più qualità', 'È indifferente: contano solo i colori'],
		why: ["Un'icona è fatta di forme e deve servire a molte dimensioni.", 'Dal file vettoriale il calcolatore la ricalcola ogni volta alla misura che serve.']
	},
	{
		id: 'sgranata',
		text: (N) => `${N} ingrandisce molto un'immagine e vede comparire dei quadretti colorati lungo i bordi.`,
		ask: 'Che cosa se ne deduce?',
		right: 'È una bitmap: i quadretti sono i suoi pixel',
		wrong: ['È vettoriale: le forme sono diventate quadrate', 'Il file si è rovinato durante l\'ingrandimento', 'È vettoriale: i quadretti sono le istruzioni', 'Lo schermo ha pochi colori'],
		why: ['Una bitmap ha un numero fissato di pixel: ingrandendola, ogni pixel occupa più spazio fino a diventare un quadretto visibile.', 'Un disegno vettoriale ingrandito viene ricalcolato, e i bordi restano lisci.']
	},
	{
		id: 'peso',
		text: (N) => `${N} confronta due file dello stesso disegno, un cerchio su uno sfondo: uno è una bitmap di 2000 per 2000 pixel, l'altro è vettoriale.`,
		ask: 'Quale dei due pesa meno, e perché?',
		right: 'Il vettoriale: descrive due forme, non quattro milioni di pixel',
		wrong: ['La bitmap: i pixel occupano meno delle forme', 'Pesano uguale: il disegno è lo stesso', 'Il vettoriale: ha meno colori', 'La bitmap: è già a quadretti'],
		why: ['Il peso di una bitmap dipende dal numero dei pixel, quello di un disegno vettoriale dal numero delle forme.', 'Qui le forme sono due, i pixel $2000 \\cdot 2000 = 4\\,000\\,000$.']
	},
	{
		id: 'schermata',
		text: (N) => `${N} cattura una schermata del registro elettronico per mandarla a un compagno.`,
		ask: 'Che tipo di immagine ottiene?',
		right: 'Una bitmap: la schermata è la griglia dei pixel dello schermo',
		wrong: ['Un disegno vettoriale: sullo schermo ci sono testi e riquadri', 'Un disegno vettoriale: le schermate non si sgranano', 'Né l\'una né l\'altro: è un documento di testo', 'Una bitmap, che però si può ingrandire senza limiti'],
		why: ['Catturare lo schermo vuol dire copiare il colore di ogni suo pixel: il risultato è una bitmap.', 'Che sullo schermo ci fossero testi e forme non conta: nel file restano solo i pixel.']
	},
	{
		id: 'ricalco',
		text: (N) => `${N} ha solo una foto del vecchio logo della squadra e vorrebbe ricavarne il file vettoriale.`,
		ask: 'Che cosa deve aspettarsi?',
		right: 'È difficile: un programma deve indovinare le forme dai pixel',
		wrong: ['È immediato: basta cambiare l\'estensione in .svg', 'È immediato: basta ingrandire la foto', 'È impossibile: un logo non si può descrivere con delle forme', 'È immediato: ogni pixel diventa una forma liscia'],
		why: ['Da vettoriale a bitmap si passa esportando; il passaggio inverso chiede di indovinare quali forme hanno prodotto quei pixel.', 'Un programma ci riesce in modo accettabile solo con disegni semplici, a colori piatti.']
	},
	{
		id: 'mappa',
		text: (N) => `${N} prepara la piantina della scuola, fatta di linee, rettangoli e scritte, che andrà sia sul sito sia su un cartellone.`,
		ask: 'Come conviene salvarla?',
		right: 'Vettoriale: linee e scritte restano nette sul sito e sul cartellone',
		wrong: ['Bitmap piccola, da ingrandire per il cartellone', 'Bitmap: le linee sono fatte di pixel', 'Vettoriale, ma solo per il sito: non si può stampare', 'È indifferente: è un disegno in bianco e nero'],
		why: ['La piantina è fatta di forme e deve servire a due dimensioni molto diverse.', 'Dal file vettoriale si ottengono i pixel giusti per lo schermo e per la stampa.']
	},
	{
		id: 'esporta',
		text: (N) => `${N} ha il logo in vettoriale e un sito che accetta solo immagini bitmap.`,
		ask: 'Che cosa conviene fare?',
		right: 'Esportare una bitmap alla misura che serve, e tenere il vettoriale',
		wrong: ['Rinominare il file con l\'estensione di una bitmap', 'Esportare una bitmap minuscola e lasciare che il sito la ingrandisca', 'Cancellare il vettoriale dopo aver esportato la bitmap', 'Rinunciare: da vettoriale a bitmap non si può passare'],
		why: ['Da vettoriale a bitmap si passa esportando, e il programma chiede quanti pixel deve avere il risultato.', 'Il vettoriale si conserva: è l\'originale da cui ottenere, in futuro, bitmap di altre misure.']
	}
];

// ---------------------------------------------------------------------------
// Level 2: reading an SVG

const COLOURS = [
	['red', 'rosso'],
	['blue', 'blu'],
	['gold', 'giallo'],
	['green', 'verde'],
	['gray', 'grigio'],
	['pink', 'rosa']
] as const;
const svg = (...shapes: string[]) => ['<svg viewBox="0 0 100 100">', ...shapes, '</svg>'].join('\n') + '\n';
const circle = (cx: number, cy: number, r: number, fill?: string) => (fill ? `<circle cx="${cx}" cy="${cy}" r="${r}"\n        fill="${fill}"/>` : `<circle cx="${cx}" cy="${cy}" r="${r}"/>`);
const NOTE = 'Il disegno è largo 100 e alto 100.';

function level2(rng: Rng): CodeBuilt {
	const which = rng.next();
	if (which < 0.4) {
		const left = rng.next() < 0.5, top = rng.next() < 0.5;
		const cx = left ? rng.int(15, 35) : rng.int(65, 85);
		const cy = top ? rng.int(15, 35) : rng.int(65, 85);
		const r = rng.int(5, 12);
		const where = (t: boolean, l: boolean) => textOption(`In ${t ? 'alto' : 'basso'} a ${l ? 'sinistra' : 'destra'}`, `${t ? 'alto' : 'basso'}-${l ? 'sinistra' : 'destra'}`);
		const answer = choose(rng, where(top, left), [where(!top, left), where(top, !left), where(!top, !left)]);
		return { ...asked('Leggi il disegno SVG.', `${NOTE} In quale zona del disegno si trova il cerchio?`, answer, [`Il centro del cerchio è in (${cx}, ${cy}): la x dice quanto è lontano dal bordo sinistro, la y quanto è lontano dal bordo in alto.`, `In SVG la y cresce verso il basso: con $y = ${cy}$ il cerchio sta in ${top ? 'alto' : 'basso'}, e con $x = ${cx}$ sta a ${left ? 'sinistra' : 'destra'}.`], { case: 'dove', cx, cy, r }), listing: svg(circle(cx, cy, r)) };
	}
	if (which < 0.7) {
		const [a, b] = [rng.int(0, COLOURS.length - 1), rng.int(0, COLOURS.length - 2)];
		const first = COLOURS[a], second = COLOURS.filter((_, i) => i !== a)[b];
		const y = rng.int(40, 60);
		// the centres closer than the two radii together, and further than their difference: each covers a part of the
		// other; and both circles inside the drawing
		let r1: number, r2: number, x1: number, x2: number;
		do {
			[r1, r2] = [rng.int(14, 24), rng.int(14, 24)];
			x1 = rng.int(r1 + 2, 45);
			x2 = x1 + rng.int(Math.abs(r1 - r2) + 6, r1 + r2 - 8);
		} while (x2 + r2 > 98);
		const o = (id: string, text: string) => textOption(text, id);
		const answer = choose(rng, o('secondo', `Quello ${second[1]}: è scritto per ultimo`), [o('primo', `Quello ${first[1]}: è scritto per primo`), o('entrambi', 'Tutti e due: i cerchi non si toccano'), o('nessuno', 'Nessuno dei due: dove si toccano i colori si mescolano')]);
		return { ...asked('Leggi il disegno SVG.', `${NOTE} I due cerchi si sovrappongono in parte. Quale dei due si vede intero?`, answer, ['Le forme vengono disegnate nell\'ordine in cui sono scritte, e ognuna copre quelle di prima.', `Il cerchio ${second[1]} è scritto per ultimo: si vede intero e copre una parte di quello ${first[1]}.`], { case: 'sopra', first: first[0], second: second[0] }), listing: svg(circle(x1, y, r1, first[0]), circle(x2, y, r2, second[0])) };
	}
	const r = rng.int(6, 24);
	const cx = rng.int(r + 5, 95 - r), cy = rng.int(r + 5, 95 - r);
	const n = (x: number) => textOption(`${x}`);
	if (rng.next() < 0.5) {
		const answer = choose(rng, n(2 * r), [n(r), n(cx), n(r * r), n(cx + r), n(2 * cx), n(r + 2)]);
		return { ...asked('Leggi il disegno SVG.', `${NOTE} Quanto è largo il cerchio, nelle unità del disegno?`, answer, [`L'attributo r è il raggio: ${r}.`, `La larghezza del cerchio è il diametro, due volte il raggio: $2 \\cdot ${r} = ${2 * r}$.`], { case: 'misura', ask: 'larghezza', cx, cy, r }), listing: svg(circle(cx, cy, r)) };
	}
	const answer = choose(rng, n(cx - r), [n(cx), n(cx + r), n(r), n(cy - r), n(cx - 2 * r), n(cx - r + 1)].filter((o) => Number(o.latex) >= 0));
	return { ...asked('Leggi il disegno SVG.', `${NOTE} A che distanza dal bordo sinistro del disegno comincia il cerchio?`, answer, [`Il centro è a ${cx} dal bordo sinistro, e il raggio è ${r}.`, `Il punto più a sinistra del cerchio è a $${cx} - ${r} = ${cx - r}$.`], { case: 'misura', ask: 'sinistra', cx, cy, r }), listing: svg(circle(cx, cy, r)) };
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: pixels, inches, dpi

const DPI = [72, 100, 150, 200, 300, 600];
const PRINTS = ['una foto', 'una locandina', 'la copertina del giornalino', 'una mappa', 'una cartolina'];
const it = (x: number) => (Math.round(x * 100) / 100).toString().replace('.', ',');

function level3(rng: Rng): CodeBuilt {
	const dpi = rng.pick(DPI), what = rng.pick(PRINTS);
	const w = rng.int(2, 12);
	const prompt = 'Calcola i pixel che servono per la stampa.';
	if (rng.next() < 0.5) {
		const n = (x: number) => textOption(`${x} pixel`, `${x}`);
		const answer = choose(rng, n(w * dpi), [n(dpi), n(w + dpi), n(w * dpi * 2), n(Math.round((w * dpi) / 2)), n(w * 100), n(w * dpi + dpi)]);
		return asked(prompt, `${what.charAt(0).toUpperCase()}${what.slice(1)} deve essere larga ${w} pollici sulla carta, con una densità di stampa di ${dpi} dpi. Quanti pixel deve avere in larghezza?`, answer, ['I pixel che servono sono i pollici moltiplicati per la densità, che dice quanti pixel stanno in ogni pollice.', `$${w} \\cdot ${dpi} = ${w * dpi}$ pixel.`], { case: 'larghezza', inches: w, dpi, pixels: w * dpi });
	}
	let h: number;
	do h = rng.int(2, 10);
	while (h === w);
	const d = (a: number, b: number) => textOption(`$${a} \\times ${b}$`, `${a}x${b}`);
	const answer = choose(rng, d(w * dpi, h * dpi), [d(w, h), d(w + dpi, h + dpi), d(w * dpi, h), d(w * 100, h * 100), d(dpi, dpi), d(w * dpi * 2, h * dpi * 2)]);
	return asked(prompt, `Una stampa deve misurare ${w} pollici di larghezza e ${h} di altezza, a ${dpi} dpi. Quanti pixel deve avere l'immagine, larghezza per altezza?`, answer, ['Ogni misura in pollici si moltiplica per la densità.', `Larghezza: $${w} \\cdot ${dpi} = ${w * dpi}$ pixel. Altezza: $${h} \\cdot ${dpi} = ${h * dpi}$ pixel.`], { case: 'dimensioni', inches: [w, h], dpi, pixels: [w * dpi, h * dpi] });
}

function level4(rng: Rng): CodeBuilt {
	const dpi = rng.pick(DPI);
	const k = rng.int(2, 12);
	const px = k * dpi;
	const prompt = 'Calcola quanto viene grande la stampa.';
	const which = rng.next();
	if (which < 0.35) {
		const n = (x: number) => textOption(`${x} pollici`, `${x}`);
		const answer = choose(rng, n(k), [n(px - dpi), n(k * 2), n(dpi), n(px), n(k + 1), n(k * 10)]);
		return asked(prompt, `Un'immagine larga ${px} pixel viene stampata a ${dpi} dpi. Quanti pollici è larga la stampa?`, answer, ['La densità dice quanti pixel stanno in un pollice: i pollici sono i pixel divisi per la densità.', `$${px} : ${dpi} = ${k}$ pollici.`], { case: 'pollici', pixels: px, dpi, inches: k });
	}
	if (which < 0.7) {
		const cm = (x: number) => textOption(`$${it(x).replace(',', '{,}')}$ cm`, it(x));
		const answer = choose(rng, cm(k * 2.54), [cm(k), cm(k * 25.4), cm(k + 2.54), cm(k / 2), cm(px / 100)]);
		return asked(prompt, `Un'immagine larga ${px} pixel viene stampata a ${dpi} dpi. Un pollice è 2,54 cm. Quanti centimetri è larga la stampa?`, answer, [`Prima i pollici: $${px} : ${dpi} = ${k}$.`, `Poi i centimetri: $${k} \\cdot 2{,}54 = ${it(k * 2.54).replace(',', '{,}')}$ cm.`], { case: 'centimetri', pixels: px, dpi, inches: k });
	}
	const n = (x: number) => textOption(`${x} dpi`, `${x}`);
	const answer = choose(rng, n(dpi), [n(px * k), n(px), n(dpi * 2), n(px - k), n(Math.round(dpi / 2)), n(dpi + k)]);
	return asked('Calcola la densità di stampa.', `Un'immagine larga ${px} pixel viene stampata in modo da essere larga ${k} pollici. Con quale densità è stampata?`, answer, ['La densità è il numero di pixel in ogni pollice: i pixel divisi per i pollici.', `$${px} : ${k} = ${dpi}$ dpi.`], { case: 'densità', pixels: px, dpi, inches: k });
}

// ---------------------------------------------------------------------------
// Level 5: what the operations do

const TRUE: Statement[] = [
	{ id: 't-ritaglio', text: 'Ritagliando una bitmap, i pixel che restano sono identici a prima', why: 'È vero: il ritaglio elimina i pixel fuori dal riquadro e non tocca gli altri.' },
	{ id: 't-rimpicciolire', text: 'Rimpicciolendo una bitmap, più pixel vecchi si fondono in ogni pixel nuovo', why: 'È vero: ogni pixel nuovo è la media di più pixel vecchi, e i dettagli fini si perdono.' },
	{ id: 't-originale', text: "Conviene ridimensionare una copia e conservare l'originale", why: "È vero: i pixel eliminati o fusi non si recuperano, e dall'originale si può sempre ripartire." },
	{ id: 't-ingrandire', text: 'Ingrandendo una bitmap, i pixel in più vengono calcolati da quelli vicini', why: 'È vero: il programma li inventa facendo la media dei vicini, senza aggiungere dettagli.' },
	{ id: 't-dpi', text: 'Scrivere 300 dpi nelle proprietà di una bitmap, senza toccare i pixel, cambia solo quanto grande verrà stampata', why: 'È vero: i dpi sono un\'etichetta per la stampa. I dettagli stanno nei pixel.' },
	{ id: 't-schermo', text: 'Sullo schermo la grandezza di una bitmap dipende dal numero dei suoi pixel', why: 'È vero: di solito un pixel dell\'immagine occupa un pixel dello schermo.' },
	{ id: 't-vettoriale', text: 'Un disegno vettoriale viene trasformato in pixel ogni volta che va sullo schermo', why: 'È vero: è la rasterizzazione, rifatta alla dimensione che serve.' },
	{ id: 't-senza-perdita', text: 'Cambiando formato senza perdita, i pixel restano gli stessi', why: 'È vero: vengono solo scritti in un altro modo.' }
];
const FALSE: Statement[] = [
	{ id: 'f-dettagli', text: 'Ingrandendo una bitmap compaiono dettagli che prima non si vedevano', why: 'I pixel in più sono medie dei vicini: i dettagli che non c\'erano non compaiono.' },
	{ id: 'f-recupero', text: "Una bitmap rimpicciolita e salvata si può riportare all'originale ingrandendola", why: 'Rimpicciolendo, più pixel si sono fusi in uno: ingrandire non li separa.' },
	{ id: 'f-dpi', text: 'Aumentando i dpi nelle proprietà di una bitmap, senza toccare i pixel, la stampa diventa più nitida', why: 'Cambiare il numero dei dpi non cambia i pixel: la stampa viene solo più piccola.' },
	{ id: 'f-ritaglio', text: 'Ritagliare una bitmap ne abbassa la qualità in ogni punto', why: 'Il ritaglio elimina i pixel fuori dal riquadro e lascia identici gli altri.' },
	{ id: 'f-sgrana', text: 'Un disegno vettoriale ingrandito dieci volte mostra i suoi pixel', why: 'Un disegno vettoriale non ha pixel suoi: viene ricalcolato a ogni dimensione.' },
	{ id: 'f-peso', text: 'Il peso di un disegno vettoriale dipende dalla dimensione a cui lo si mostra', why: 'Il peso di un disegno vettoriale dipende dal numero delle forme, non dalla dimensione.' },
	{ id: 'f-foto', text: 'Salvare una fotografia in vettoriale la rende ingrandibile senza limiti', why: 'Una fotografia non è fatta di forme: resta una bitmap.' },
	{ id: 'f-y', text: 'In un disegno SVG la y cresce verso l\'alto, come nel piano cartesiano', why: 'In SVG l\'origine è in alto a sinistra e la y cresce verso il basso.' }
];

export default makeCodeGenerator(ID, 'Grafica bitmap e grafica vettoriale', {
	1: { label: 'Bitmap o vettoriale', constraints: ['a job with a name, the right kind of image with its reason, and three of the wrong ones'], build: (rng) => situationLevel(rng, 'Scegli tra bitmap e vettoriale.', JOBS) },
	2: { label: 'Leggere un SVG', constraints: ['a small SVG on a grid of 100 by 100 shown under the question, rows of at most 42 characters', 'where a circle is (y grows downwards); which of two overlapping circles is seen whole (the last written); how wide a circle is, or where it begins'], build: level2 },
	3: { label: 'I pixel per la stampa', constraints: ['inches from 2 to 12 and a density among 72, 100, 150, 200, 300, 600 dpi', 'pixels = inches · dpi, for the width or for both sides'], build: level3 },
	4: { label: 'Quanto viene grande la stampa', constraints: ['built backwards from a whole number of inches', 'inches = pixels : dpi; centimetres = inches · 2,54; dpi = pixels : inches'], build: level4 },
	5: { label: 'Che cosa succede ai pixel', constraints: ['one true statement among three false ones, or one false among three true'], build: (rng) => statementLevel(rng, 'Ragiona su che cosa fanno le operazioni a un\'immagine.', 'sulle immagini', TRUE, FALSE) }
});
