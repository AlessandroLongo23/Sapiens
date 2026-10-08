/**
 * Exercises of the lesson "L'impaginazione di una pagina web" (informatica, third year): flexbox.
 * Spec: specs/exercises/inf-css-layout.md
 *
 * 1. which elements a `display: flex` reaches, and where it must be written; 2. where the elements end up with a
 * direction, a `justify-content` and an `align-items`; 3. the room left over and who takes it; 4. going to a new
 * row; 5. which rule gives a described layout. All multiple choice; the fragments are real HTML and CSS.
 */
import type { ChoiceOption, Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';

export const ID = 'inf-css-layout';

/** Draws again when the numbers leave fewer than four different options. */
function retry(build: (rng: Rng) => CodeBuilt): (rng: Rng) => CodeBuilt {
	return (rng) => {
		for (let i = 1; ; i++) {
			try {
				return build(rng);
			} catch (e) {
				if (i >= 40) throw e;
			}
		}
	};
}

const css = (selector: string, declarations: readonly string[]) => `${selector} {\n${declarations.map((d) => `  ${d};`).join('\n')}\n}\n`;
const px = (n: number) => textOption(`${n} px`, String(n));
/** "Tra 4 elementi ci sono 3 spazi da 20 px: 60 px", and the singular for two elements. */
const spaces = (n: number, gap: number) => (n === 2 ? `Tra 2 elementi c'è 1 spazio da ${gap} px` : `Tra ${n} elementi ci sono ${n - 1} spazi da ${gap} px: ${(n - 1) * gap} px`);

// ---------------------------------------------------------------- 1. container and items

const OUTER = ['nav', 'header', 'section', 'footer', 'main'] as const;
const LISTS = [
	{ inner: 'ul', item: 'li', voices: ['Home', 'Concerti', 'Foto', 'Contatti', 'Gruppo'] },
	{ inner: 'ul', item: 'li', voices: ['Sara', 'Leo', 'Marta', 'Dario'] },
	{ inner: 'div', item: 'p', voices: ['Voce', 'Chitarra', 'Basso', 'Batteria', 'Tastiere'] },
	{ inner: 'div', item: 'article', voices: ['Dicembre', 'Gennaio', 'Marzo', 'Maggio', 'Giugno'] },
	{ inner: 'div', item: 'h3', voices: ['Rock', 'Pop', 'Blues', 'Jazz', 'Folk'] }
] as const;
const CLASSES = ['menu', 'gruppo', 'schede', 'elenco', 'date', 'voci'] as const;

function level1(rng: Rng): CodeBuilt {
	const outer = rng.pick(OUTER);
	const list = rng.pick(LISTS);
	const name = rng.pick(CLASSES);
	const n = rng.int(2, 4);
	const voices = shuffle(rng, list.voices).slice(0, n);
	const page = `<${outer}>\n  <${list.inner} class="${name}">\n${voices.map((v) => `    <${list.item}>${v}</${list.item}>`).join('\n')}\n  </${list.inner}>\n</${outer}>\n`;
	const selectors = { outer, inner: `.${name}`, item: `.${name} ${list.item}` };
	const base = { outer, inner: list.inner, item: list.item, class: name, voices };
	if (rng.int(0, 1) === 0) {
		// the rule is given: which elements go in a row
		const target = rng.pick(['outer', 'inner', 'inner', 'item'] as const);
		const rule = css(selectors[target], ['display: flex']);
		const options = {
			inner: textOption(`I ${n} elementi ${list.item}, uno accanto all'altro`, 'items'),
			outer: textOption(`Nessuno: solo ${list.inner} diventa un elemento flex, e gli elementi ${list.item} restano in colonna`, 'none-outer'),
			item: textOption(`Nessuno: ogni ${list.item} diventa un contenitore, ma resta sotto il precedente`, 'none-item')
		};
		const others = [textOption(`${outer} e ${list.inner}, uno accanto all'altro`, 'outer-inner'), textOption(`Tutti gli elementi dentro ${outer}, su una sola riga`, 'all')];
		return {
			prompt: 'Guarda quale elemento prende la regola, e chi sono i suoi figli diretti.',
			problem: 'Sotto ci sono un pezzo di pagina e una regola del suo foglio di stile. Quali elementi si dispongono in riga?',
			listing: `${page}\n${rule}`,
			solution: options[target].latex,
			steps: [
				`Il selettore ${selectors[target]} prende ${target === 'item' ? `ognuno degli elementi ${list.item}` : target === 'inner' ? `l'elemento ${list.inner} con classe ${name}` : `l'elemento ${outer}`}: è lui che diventa un contenitore flex.`,
				'Elementi flex diventano solo i figli diretti del contenitore, e sono loro a mettersi in riga.',
				target === 'inner' ? `I figli diretti sono i ${n} elementi ${list.item}.` : target === 'outer' ? `L'unico figlio diretto di ${outer} è ${list.inner}: gli elementi ${list.item} sono nipoti e restano come prima.` : `Dentro ogni ${list.item} c'è solo testo, e il loro contenitore ${list.inner} non è flex: restano uno sotto l'altro.`
			],
			answer: choose(rng, options[target], [...(['inner', 'outer', 'item'] as const).filter((k) => k !== target).map((k) => options[k]), ...shuffle(rng, others)]),
			params: { case: 'chi', target, ...base }
		};
	}
	// the layout is given: which rule
	const right = css(selectors.inner, ['display: flex']);
	const wrong = [css(selectors.item, ['display: flex']), css(outer, ['display: flex']), ...shuffle(rng, [css(selectors.inner, ['display: row']), css(selectors.inner, ['flex-direction: row']), css(selectors.item, ['flex-direction: row'])])];
	return {
		prompt: 'Chiediti quale elemento contiene direttamente i pezzi da mettere in riga.',
		problem: `Quale regola mette in riga, uno accanto all'altro, i ${n} elementi ${list.item} di questo pezzo di pagina?`,
		listing: page,
		solution: `La regola con display: flex sul selettore ${selectors.inner}.`,
		steps: [`I ${n} elementi ${list.item} sono figli diretti di ${list.inner}, che ha classe ${name}: il contenitore è lui.`, `Con display: flex nella regola degli elementi ${list.item} ognuno diventa un contenitore, ma non si sposta; nella regola di ${outer} si arriva solo a ${list.inner}.`, 'flex-direction da sola non fa niente se manca display: flex, e display: row non esiste.'],
		solutionListing: right,
		answer: choose(rng, listingOption(right), wrong.map((text) => listingOption(text))),
		params: { case: 'dove', ...base }
	};
}

// ---------------------------------------------------------------- 2. direction and axes

type Place = 'flex-start' | 'center' | 'flex-end';
const PLACES: readonly Place[] = ['flex-start', 'center', 'flex-end'];
const HORIZONTAL: Record<Place, string> = { 'flex-start': 'a sinistra', center: 'al centro in orizzontale', 'flex-end': 'a destra' };
const VERTICAL: Record<Place, string> = { 'flex-start': 'in alto', center: 'al centro in verticale', 'flex-end': 'in basso' };
const BOXES = ['.schede', '.barra', '.pulsanti', '.foto', '.riquadro', '.icone'] as const;

/** Where the elements are: how they are laid, their place across the width and down the height. */
const where = (column: boolean, justify: Place, align: Place) => ({ column, x: column ? align : justify, y: column ? justify : align });
const said = (w: ReturnType<typeof where>) => `${w.column ? 'In colonna' : 'In riga'}, ${HORIZONTAL[w.x]} e ${VERTICAL[w.y]}`;
const key = (w: ReturnType<typeof where>) => `${w.column ? 'column' : 'row'}|${w.x}|${w.y}`;
const flexRule = (selector: string, direction: 'row' | 'column' | null, justify: Place | null, align: Place) => css(selector, ['display: flex', ...(direction ? [`flex-direction: ${direction}`] : []), ...(justify ? [`justify-content: ${justify}`] : []), `align-items: ${align}`]);

function level2(rng: Rng): CodeBuilt {
	const selector = rng.pick(BOXES);
	const column = rng.int(0, 1) === 1;
	const justify = rng.pick(PLACES);
	const align = rng.pick(PLACES);
	const right = where(column, justify, align);
	const base = { selector, column, justify, align };
	const axis = column ? `Con flex-direction: column l'asse principale è verticale` : `In riga l'asse principale è orizzontale`;
	const steps = [`${axis}.`, `justify-content lavora sull'asse principale: gli elementi sono ${column ? VERTICAL[justify] : HORIZONTAL[justify]}.`, `align-items lavora sull'altro asse: gli elementi sono ${column ? HORIZONTAL[align] : VERTICAL[align]}.`];
	if (rng.int(0, 1) === 0) {
		// a value left out is the starting one: row, flex-start
		const direction = column ? 'column' : rng.pick(['row', null] as const);
		const written = justify === 'flex-start' && rng.int(0, 1) === 0 ? null : justify;
		const others = [where(column, align, justify), where(!column, justify, align), where(!column, align, justify), where(column, justify, align === 'center' ? 'flex-end' : 'center'), where(column, justify === 'center' ? 'flex-start' : 'center', align)];
		return {
			prompt: 'Trova prima l’asse principale: lo decide flex-direction.',
			problem: `Il contenitore ${selector} è più largo e più alto dei suoi tre elementi, che non riempiono né la larghezza né l'altezza. Con questa regola, come sono disposti gli elementi e dove si trovano?`,
			listing: flexRule(selector, direction, written, align),
			solution: `${said(right)}.`,
			steps: [...(direction === null || written === null ? [`Una proprietà che non è scritta ha il suo valore di partenza: ${direction === null ? 'flex-direction vale row' : ''}${direction === null && written === null ? ' e ' : ''}${written === null ? 'justify-content vale flex-start' : ''}.`] : []), ...steps],
			answer: choose(
				rng,
				textOption(said(right), key(right)),
				others.map((w) => textOption(said(w), key(w)))
			),
			params: { case: 'dove', ...base, direction, written }
		};
	}
	const direction = column ? 'column' : 'row';
	const text = flexRule(selector, direction, justify, align);
	const wrong = [flexRule(selector, direction, align, justify), flexRule(selector, column ? 'row' : 'column', justify, align), flexRule(selector, column ? 'row' : 'column', align, justify), flexRule(selector, direction, justify, align === 'center' ? 'flex-end' : 'center'), flexRule(selector, direction, justify === 'center' ? 'flex-start' : 'center', align)];
	return {
		prompt: 'Decidi prima la direzione, poi quale proprietà lavora in orizzontale e quale in verticale.',
		problem: `I tre elementi del contenitore ${selector}, più largo e più alto di loro, devono stare ${right.column ? 'in colonna' : 'in riga'}, ${HORIZONTAL[right.x]} e ${VERTICAL[right.y]}. Quale regola li dispone così?`,
		solution: `La regola con flex-direction: ${direction}, justify-content: ${justify} e align-items: ${align}.`,
		steps,
		solutionListing: text,
		answer: choose(rng, listingOption(text), wrong.map((t) => listingOption(t))),
		params: { case: 'regola', ...base, direction, written: justify }
	};
}

// ---------------------------------------------------------------- 3. the room left over

const ITEMS = [
	{ box: '.schede', item: '.scheda', name: 'schede' },
	{ box: '.foto', item: '.immagine', name: 'immagini' },
	{ box: '.menu', item: '.voce', name: 'voci' },
	{ box: '.date', item: '.data', name: 'date' }
] as const;
const GAPS = [10, 12, 16, 20, 24] as const;
const SPACE = ['avanzo', 'flex', 'between', 'tutti'] as const;

function level3(rng: Rng): CodeBuilt {
	const kind = rng.pick(SPACE);
	const { box, item, name } = rng.pick(ITEMS);
	const n = kind === 'between' ? rng.int(3, 5) : rng.int(2, 5);
	if (kind === 'between') {
		// built backwards from the room between two neighbours
		const w = rng.int(6, 16) * 10;
		const between = rng.int(2, 12) * 10;
		const width = n * w + (n - 1) * between;
		return {
			prompt: 'Calcola lo spazio che avanza, poi contalo tra gli elementi.',
			problem: `Il contenitore ${box} ha ${n} ${name}, tutte larghe uguali. Quanto spazio c'è tra una e la successiva?`,
			listing: css(box, ['display: flex', 'justify-content: space-between', `width: ${width}px`]) + css(item, [`width: ${w}px`]),
			solution: `${between} px.`,
			steps: [`Le ${n} ${name} occupano ${n} · ${w} = ${n * w} px, quindi avanzano ${width} - ${n * w} = ${width - n * w} px.`, `Con space-between la prima e l'ultima toccano i bordi, e lo spazio che avanza si divide tra gli elementi: gli spazi sono ${n - 1}.`, `${width - n * w} : ${n - 1} = ${between} px.`],
			answer: choose(rng, px(between), [px((width - n * w) / n), px(width - n * w), px(Math.round((width - n * w) / (n + 1))), px(between + w), px(between / 2)].filter((o) => Number.isInteger(Number(o.values[0])))),
			params: { case: kind, box, item, n, width, w, gap: 0 }
		};
	}
	const gap = rng.pick(GAPS);
	if (kind === 'tutti') {
		const each = rng.int(8, 20) * 10;
		const width = n * each + (n - 1) * gap;
		return {
			prompt: 'Togli prima gli spazi tra gli elementi, poi dividi.',
			problem: `Il contenitore ${box} ha ${n} ${name}, e tutte hanno flex: 1. Quanto è larga ciascuna?`,
			listing: css(box, ['display: flex', `gap: ${gap}px`, `width: ${width}px`]) + css(item, ['flex: 1']),
			solution: `${each} px.`,
			steps: [`${spaces(n, gap)}.`, `Resta ${width} - ${(n - 1) * gap} = ${n * each} px.`, `Con flex: 1 su tutti, lo spazio si divide in parti uguali: ${n * each} : ${n} = ${each} px.`],
			answer: choose(rng, px(each), [px(Math.round(width / n)), px(Math.round((width - n * gap) / n)), px(n * each), px(each - gap), px(each + gap)]),
			params: { case: kind, box, item, n, width, w: 0, gap }
		};
	}
	const w = rng.int(6, 16) * 10;
	const used = n * w + (n - 1) * gap;
	const free = rng.int(3, 30) * 10;
	const width = used + free;
	if (kind === 'avanzo') {
		return {
			prompt: 'Somma le larghezze degli elementi e gli spazi tra loro.',
			problem: `Il contenitore ${box} ha ${n} ${name}, tutte larghe uguali. Quanto spazio avanza nella riga, da distribuire con justify-content?`,
			listing: css(box, ['display: flex', `gap: ${gap}px`, `width: ${width}px`]) + css(item, [`width: ${w}px`]),
			solution: `${free} px.`,
			steps: [`Le ${n} ${name} occupano ${n} · ${w} = ${n * w} px.`, `${spaces(n, gap)}.`, `Avanzano ${width} - ${n * w} - ${(n - 1) * gap} = ${free} px.`],
			answer: choose(rng, px(free), [px(width - n * w), px(width - n * w - n * gap), px(width - w - gap), px(free + w), px(free - gap)].filter((o) => Number(o.values[0]) > 0)),
			params: { case: kind, box, item, n, width, w, gap }
		};
	}
	// one element takes what is left
	const grown = w + free;
	return {
		prompt: 'Togli dalla riga gli altri elementi e gli spazi: il resto è suo.',
		problem: `Il contenitore ${box} ha ${n} ${name}. L'ultima ha anche la classe ultima. Quanto diventa larga l'ultima?`,
		listing: css(box, ['display: flex', `gap: ${gap}px`, `width: ${width}px`]) + css(item, [`width: ${w}px`]) + css('.ultima', ['flex: 1']),
		solution: `${grown} px.`,
		steps: [`Le altre ${n - 1} occupano ${n - 1} · ${w} = ${(n - 1) * w} px.`, `${spaces(n, gap)}.`, `All'ultima resta ${width} - ${(n - 1) * w} - ${(n - 1) * gap} = ${grown} px.`],
		answer: choose(rng, px(grown), [px(free), px(width - (n - 1) * w), px(Math.round(width / n)), px(width - n * w), px(w)].filter((o) => Number(o.values[0]) > 0)),
		params: { case: kind, box, item, n, width, w, gap }
	};
}

// ---------------------------------------------------------------- 4. going to a new row

const WRAP = ['prima-riga', 'righe', 'nowrap'] as const;

function level4(rng: Rng): CodeBuilt {
	const kind = rng.pick(WRAP);
	const { box, item, name } = rng.pick(ITEMS);
	const gap = rng.pick(GAPS);
	const w = rng.int(8, 18) * 10;
	const per = rng.int(2, 4);
	// between the width that holds `per` and the one that would hold one more
	const width = per * w + (per - 1) * gap + rng.int(0, Math.floor((w + gap - 10) / 10)) * 10;
	const count = rng.int(per + 1, 3 * per);
	const rows = Math.ceil(count / per);
	const listing = css(box, ['display: flex', `flex-wrap: ${kind === 'nowrap' ? 'nowrap' : 'wrap'}`, `gap: ${gap}px`, `width: ${width}px`]) + css(item, [`width: ${w}px`]);
	const fits = [`${per} ${name} con ${per - 1} ${per - 1 === 1 ? 'spazio' : 'spazi'} tra loro occupano ${per} · ${w} + ${per - 1} · ${gap} = ${per * w + (per - 1) * gap} px, che sta in ${width}.`, `${per + 1} ne chiederebbero ${(per + 1) * w + per * gap}, più di ${width}: su una riga ne stanno ${per}.`];
	const params = { case: kind, box, item, count, width, w, gap };
	const n = (x: number) => textOption(String(x));
	if (kind === 'prima-riga') {
		return {
			prompt: 'Aggiungi una scheda alla volta, contando anche gli spazi tra l’una e l’altra.',
			problem: `Il contenitore ${box} ha ${count} ${name}, tutte larghe uguali. Quante stanno sulla prima riga?`,
			listing,
			solution: `${per}.`,
			steps: [...fits, 'Con flex-wrap: wrap le altre vanno a capo.'],
			answer: choose(rng, n(per), [n(Math.floor(width / w)), n(per + 1), n(count), n(per - 1), n(per + 2)].filter((o) => Number(o.values[0]) >= 1)),
			params
		};
	}
	if (kind === 'righe') {
		return {
			prompt: 'Trova prima quante ne stanno su una riga.',
			problem: `Il contenitore ${box} ha ${count} ${name}, tutte larghe uguali. Su quante righe si dispongono?`,
			listing,
			solution: `${rows}.`,
			steps: [...fits, `${count} ${name} a ${per} per riga fanno ${rows} righe${count % per ? `: l'ultima ne ha ${count % per}` : ''}.`],
			answer: choose(rng, n(rows), [n(Math.ceil(count / Math.floor(width / w))), n(1), n(rows + 1), n(per), n(count), n(rows - 1)].filter((o) => Number(o.values[0]) >= 1)),
			params
		};
	}
	return {
		prompt: 'Leggi il valore di flex-wrap prima di fare i conti.',
		problem: `Il contenitore ${box} ha ${count} ${name}, e a quella larghezza su una riga ne starebbero ${per}. Che cosa succede alle altre?`,
		listing,
		solution: `Restano sulla stessa riga, e tutte le ${name} si stringono.`,
		steps: ['Con flex-wrap: nowrap gli elementi non vanno mai a capo.', `Le ${count} ${name} restano su una sola riga e si stringono finché ci stanno.`, 'Per mandarle a capo serve flex-wrap: wrap.'],
		answer: choose(rng, textOption(`Restano sulla stessa riga, e tutte le ${name} si stringono`, 'shrink'), [textOption(`Vanno a capo: le righe sono ${rows}`, 'wrap'), textOption('Non vengono mostrate', 'hidden'), textOption(`Vanno a capo, una per riga`, 'one-each')]),
		params
	};
}

// ---------------------------------------------------------------- 5. the whole page

const HEADS = ['header', '.testata', '.barra', '.cima', '.fascia'] as const;
const BODIES = ['.contenuto', '.pagina', '.centro', '.corpo', '.colonne'] as const;
const PAIRS = [
	['il titolo', 'il menu'],
	['il logo', 'il pulsante dei biglietti'],
	['il nome del gruppo', 'i link ai social']
] as const;
const THINGS = ['titolo', 'bottone', 'logo'] as const;
const PAGE = ['intestazione', 'colonne', 'menu', 'centro', 'colonna'] as const;

function level5(rng: Rng): CodeBuilt {
	const kind = rng.pick(PAGE);
	const gap = rng.pick(GAPS);
	let problem: string, right: string, wrong: string[], steps: string[], selector: string;
	let what = '';
	if (kind === 'intestazione') {
		selector = rng.pick(HEADS);
		const [first, second] = rng.pick(PAIRS);
		what = first;
		problem = `Dentro ${selector} ci sono ${first} e ${second}, in quest'ordine. Devono stare sulla stessa riga, ${first} a sinistra e ${second} a destra, centrati in altezza. Quale regola serve?`;
		const rule = (j: string, a: string, extra: string[] = []) => css(selector, ['display: flex', ...extra, `justify-content: ${j}`, `align-items: ${a}`]);
		right = rule('space-between', 'center');
		wrong = [rule('center', 'space-between'), rule('space-between', 'center', ['flex-direction: column']), css(selector, ['justify-content: space-between', 'align-items: center']), rule('flex-start', 'center'), rule('center', 'center')];
		steps = ['Senza display: flex le altre due proprietà non fanno niente.', 'In riga justify-content lavora in orizzontale: space-between manda il primo elemento a sinistra e l’ultimo a destra.', 'align-items lavora in verticale: center li centra in altezza.'];
	} else if (kind === 'colonne') {
		selector = rng.pick(BODIES);
		problem = `Dentro ${selector} ci sono main e aside. Devono stare affiancati, con ${gap} px tra loro, e main deve prendere tutta la larghezza che aside lascia libera. Quali regole servono?`;
		const pair = (boxRules: string[], who: string, whoRules: string[]) => css(selector, boxRules) + css(who, whoRules);
		right = pair(['display: flex', `gap: ${gap}px`], 'main', ['flex: 1']);
		wrong = [pair(['flex: 1'], 'main', ['display: flex', `gap: ${gap}px`]), pair(['display: flex', `gap: ${gap}px`], 'aside', ['flex: 1']), pair(['display: flex', 'flex-direction: column', `gap: ${gap}px`], 'main', ['flex: 1']), pair([`gap: ${gap}px`], 'main', ['display: flex', 'flex: 1']), pair(['display: flex', `gap: ${gap}px`], 'main', ['width: 1'])];
		steps = [`Il contenitore di main e aside è ${selector}: display: flex e gap vanno nella sua regola.`, 'flex: 1 va nella regola dell’elemento che deve allargarsi, cioè main.', 'Con flex-direction: column i due blocchi starebbero uno sotto l’altro.'];
	} else if (kind === 'menu') {
		selector = rng.pick(['nav ul', 'header ul', '.menu ul'] as const);
		const outer = selector.split(' ')[0];
		problem = `Il menu è un elenco ul dentro ${outer}, e le sue voci li devono stare in riga con ${gap} px tra l'una e l'altra. Quale regola serve?`;
		const rule = (s: string, d: string[]) => css(s, d);
		right = rule(selector, ['display: flex', `gap: ${gap}px`]);
		wrong = [rule(outer, ['display: flex', `gap: ${gap}px`]), rule(`${outer} li`, ['display: flex', `gap: ${gap}px`]), rule(selector, ['display: flex', 'flex-direction: column', `gap: ${gap}px`]), rule(selector, [`gap: ${gap}px`]), rule(selector, ['display: flex', `padding: ${gap}px`])];
		steps = ['Le voci li sono figlie dirette di ul: il contenitore flex è ul.', `La regola di ${outer} arriverebbe solo all'elenco, e quella di li farebbe di ogni voce un contenitore.`, 'gap mette lo spazio tra gli elementi, ma solo in un contenitore flex.'];
	} else if (kind === 'centro') {
		selector = rng.pick(['.copertina', '.palco', '.avviso', '.sfondo', '.riquadro'] as const);
		what = rng.pick(THINGS);
		problem = `Il contenitore ${selector} è alto e largo più del ${what} che contiene, il suo unico elemento. Il ${what} deve stare esattamente al centro, in orizzontale e in verticale. Quale regola serve?`;
		right = css(selector, ['display: flex', 'justify-content: center', 'align-items: center']);
		wrong = [css(selector, ['display: flex', 'justify-content: center']), css(selector, ['display: flex', 'align-items: center']), css(selector, ['justify-content: center', 'align-items: center']), css(selector, ['display: flex', 'text-align: center']), css(selector, ['display: flex', 'justify-content: space-between', 'align-items: center'])];
		steps = ['Per centrare su tutti e due gli assi servono tutte e due le proprietà.', 'justify-content: center centra sull’asse principale, align-items: center sull’altro.', 'Senza display: flex nessuna delle due viene applicata.'];
	} else {
		selector = rng.pick(['.schede', '.concerti', 'footer', '.foto', '.date', '.pulsanti', '.icone'] as const);
		problem = `Gli elementi di ${selector}, più stretti del contenitore, devono stare uno sotto l'altro e centrati in orizzontale. Quale regola serve?`;
		const rule = (d: string, p: string) => css(selector, ['display: flex', `flex-direction: ${d}`, `${p}: center`]);
		right = rule('column', 'align-items');
		wrong = [rule('column', 'justify-content'), rule('row', 'align-items'), rule('row', 'justify-content'), css(selector, ['flex-direction: column', 'align-items: center']), css(selector, ['display: flex', 'flex-direction: column', 'align-items: flex-end'])];
		steps = ['Uno sotto l’altro vuol dire flex-direction: column.', 'In colonna l’asse principale è verticale: justify-content centrerebbe in verticale.', 'Per centrare in orizzontale, cioè sull’asse trasversale, serve align-items: center.'];
	}
	// the two mistakes every sample offers, and one more drawn among the others
	const third = rng.int(2, wrong.length - 1);
	return {
		prompt: 'Per ogni proprietà chiediti in quale regola va, e su quale asse lavora.',
		problem,
		solution: 'La regola che mette display: flex sul contenitore e ogni proprietà al suo posto.',
		steps,
		solutionListing: right,
		answer: choose(
			rng,
			listingOption(right),
			[wrong[0], wrong[1], wrong[third]].map((text) => listingOption(text))
		),
		params: { case: kind, selector, gap: kind === 'colonne' || kind === 'menu' ? gap : 0, what, third }
	};
}

const options = (sample: { answer: unknown }) => (sample.answer as { options: ChoiceOption[] }).options;
/** A level of text and fragments has no program. */
const worded = (sample: { params: Record<string, unknown>; answer: unknown }) => [...(sample.params.program ? ['a level of fragments has no program'] : []), ...(options(sample).length === 4 ? [] : ['not four options'])];

export default makeCodeGenerator(ID, 'L’impaginazione di una pagina web', {
	1: { label: 'Contenitore ed elementi', constraints: ['a fragment of a page with a container and 2 to 4 items', 'display: flex reaches the direct children only'], build: retry(level1), check: worded },
	2: { label: 'Direzione e assi', constraints: ['a rule with direction, justify-content and align-items', 'three elements smaller than their container'], build: retry(level2), check: worded },
	3: { label: 'Lo spazio che avanza', constraints: ['widths in whole pixels', 'built backwards from the answer'], build: retry(level3), check: worded },
	4: { label: 'Andare a capo', constraints: ['2 to 4 elements per row', 'the gap is counted between the elements'], build: retry(level4), check: worded },
	5: { label: 'Impaginare la pagina', constraints: ['four rules as options', 'one puts every property in its place'], build: retry(level5), check: worded }
});
