import type { BookPage, KitItem } from '../engine/notebook';

/*
 * What the notebook's first pages say of each experiment's bench: the instruments and the substances, each with a
 * photo (rendered from the game's own models, scripts/lab/render_kit.py), its name, its formula and what it is for. The pages to fill in
 * are written by each experiment, which knows what to make of the answers.
 */

const img = (name: string) => `/lab/strumenti/${name}.webp`;

const GOGGLES: KitItem = { name: 'Occhiali di protezione', image: img('occhiali'), text: 'Si indossano prima di toccare qualsiasi cosa e si tengono fino alla fine.' };
const BUNSEN: KitItem = { name: 'Becco Bunsen', image: img('becco-bunsen'), text: "Brucia il gas del rubinetto. La ghiera regola l'aria: chiusa, fiamma gialla; aperta, fiamma azzurra e più calda." };
const LIGHTER: KitItem = { name: 'Accendigas', image: img('accendigas'), text: 'Dà la scintilla alla bocca del becco. Si usa subito dopo aver aperto il gas.' };
const PIPETTE: KitItem = { name: 'Pipetta tarata da 25 mL', image: img('pipetta'), text: 'Con il menisco sulla tacca rilascia 25,0 mL esatti. Si aspira con la propipetta, mai con la bocca.' };

export const KIT: Record<string, { title: string; items: KitItem[] }> = {
	'solfato-di-rame': {
		title: 'Strumenti e sostanze',
		items: [
			GOGGLES,
			BUNSEN,
			LIGHTER,
			{ name: 'Treppiede con reticella', image: img('treppiede'), text: 'Regge il becher sopra la fiamma. La reticella distribuisce il calore sul fondo del vetro.' },
			{ name: 'Becher da 100 mL', image: img('becher'), text: "Qui l'acido si scalda e l'ossido di rame reagisce." },
			PIPETTE,
			{ name: 'Spatola', image: img('spatola'), text: "Preleva l'ossido di rame dal barattolo, mezzo grammo per volta." },
			{ name: 'Bacchetta di vetro', image: img('bacchetta'), text: "Per mescolare: l'ossido reagisce prima se è tenuto in sospensione." },
			{ name: 'Termometro', image: img('termometro'), text: "Appoggiato nel becher, dice quando l'acido è caldo ma non bolle." },
			{ name: 'Beuta da 250 mL', image: img('beuta'), text: 'Raccoglie la soluzione che passa dal filtro.' },
			{ name: 'Imbuto e carta da filtro', image: img('imbuto'), text: "La carta piegata in quattro trattiene l'ossido che non ha reagito." },
			{ name: 'Capsula di porcellana', image: img('capsula'), text: 'Larga e bassa: la soluzione evapora in fretta e i cristalli crescono sul fondo.' },
			{ name: 'Acido solforico', image: img('becher-acido'), formula: 'H₂SO₄ 1,00 mol/L', text: "Corrosivo. Reagisce con l'ossido di rame e dà solfato di rame e acqua." },
			{ name: 'Ossido di rame(II)', image: img('ossido-rame'), formula: 'CuO, 79,55 g/mol', text: "Polvere nera, insolubile in acqua. Se ne mette più del necessario: tutto l'acido deve reagire." },
			{ name: 'Solfato di rame pentaidrato', image: img('cristalli'), formula: 'CuSO₄·5H₂O', text: "Il prodotto: cristalli azzurri, 249,68 g/mol. Senza l'acqua di cristallizzazione il sale è bianco." }
		]
	},
	'saggi-alla-fiamma': {
		title: 'Strumenti e sostanze',
		items: [
			GOGGLES,
			BUNSEN,
			LIGHTER,
			{ name: 'Ansa al nichel-cromo', image: img('ansa'), text: 'Un filo che non colora la fiamma e non fonde. Porta nella fiamma un poco di sale.' },
			{ name: 'Portacampioni', image: img('portacampioni'), text: 'Sette cloruri, una miscela e due campioni incogniti, ognuno sul suo vetrino da orologio.' },
			{ name: 'Vetro al cobalto', image: img('vetro-cobalto'), text: 'Assorbe il giallo del sodio: attraverso il vetro si vede il lilla del potassio.' },
			{ name: 'Acido cloridrico', image: img('becher-hcl'), formula: 'HCl 2 mol/L', text: "Irritante. Scioglie i residui sull'ansa e la bagna, così il sale ci resta attaccato." },
			{ name: 'Cloruri dei metalli', image: img('sali'), formula: 'LiCl · NaCl · KCl · CaCl₂ · SrCl₂ · BaCl₂ · CuCl₂', text: 'Sali bianchi (verde azzurro quello di rame). Il cloruro di bario è tossico se ingerito.' }
		]
	},
	titolazione: {
		title: 'Strumenti e sostanze',
		items: [
			GOGGLES,
			{ name: 'Buretta da 25 mL', image: img('buretta'), text: 'Graduata ogni 0,1 mL, con lo zero in alto. Il rubinetto lascia scendere la soluzione a filo o a gocce.' },
			{ name: 'Imbuto della buretta', image: img('imbuto-buretta'), text: 'Per riempirla senza versare fuori. Si toglie prima di leggere.' },
			PIPETTE,
			{ name: 'Beute numerate', image: img('beuta-numerata'), text: 'Una per titolazione. La forma a cono lascia agitare senza schizzi.' },
			{ name: 'Becher degli scarti', image: img('becher-scarti'), text: "Sotto la buretta quando si fa uscire l'aria dalla punta o si porta il menisco sulla scala." },
			{ name: 'Idrossido di sodio', image: img('becher-naoh'), formula: 'NaOH 0,100 mol/L', text: 'Il titolante: la sua concentrazione è nota con tre cifre significative. Va nella buretta.' },
			{ name: 'Campione di acido cloridrico', image: img('becher-campione'), formula: 'HCl, c = ?', text: 'La concentrazione da trovare. Se ne misurano 25,0 mL per ogni beuta.' },
			{ name: 'Fenolftaleina', image: img('contagocce'), text: 'Un indicatore: incolore fino a pH 8 circa, rosa sopra. Ne bastano due gocce.' }
		]
	}
};

/** An experiment's book: its bench, the steps, its own pages to fill in, and two blank pages. */
export function bookOf(experiment: string, forms: BookPage[] = []): BookPage[] {
	const kit = KIT[experiment];
	return [
		...(kit ? [{ kind: 'kit' as const, title: kit.title, items: kit.items }] : []),
		{ kind: 'steps' as const },
		...forms,
		{ kind: 'free' as const, id: 'appunti1', title: 'Appunti' },
		{ kind: 'free' as const, id: 'appunti2', title: 'Appunti' }
	];
}
