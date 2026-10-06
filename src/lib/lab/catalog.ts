import type { SubjectTone } from '@/lib/utils/icons';

/*
 * What the labs menu (/laboratorio) offers: the labs, their experiments, and the settings of a session. A session is
 * all in its URL (/laboratorio/<lab>/<experiment>?modo=…), so a teacher can bookmark a set-up or put it on the board.
 */

export type LabStatus = 'ready' | 'soon';

export type Experiment = {
	slug: string;
	title: string;
	status: LabStatus;
	/** A photo from the game (public/lab/copertine); without one the menu draws a sketch. */
	photo?: string;
	/** What the photo shows, handwritten under it on the card (the bench before starting, if not given). */
	caption?: string;
	/** One line: what the student does. */
	summary: string;
	/** For the card: the class year it belongs to, what it teaches. */
	years?: string;
	skills?: string[];
	/** What is on the bench. */
	equipment?: string[];
	/** Hazards, as the notebook states them before starting. */
	safety?: string[];
	steps?: number;
	/**
	 * Its pieces, when they are a file of their own and not part of the rooms': the page loads the room, takes out the
	 * pieces named in `drop` and adds these (scripts/lab/build_fiamma.py).
	 */
	kit?: { url: string; drop: string[] };
};

/** What the rooms' own kit (the copper sulfate experiment's) has that the flame tests do not use. */
const COPPER_ONLY = ['Tripod', 'Beaker', 'AcidBeaker', 'AcidBottle', 'Pipette', 'CuOJar', 'CuOLid', 'Spatula', 'GlassRod', 'Thermometer', 'ConicalFlask', 'Funnel', 'FilterPaper', 'EvapDish'];

export type Lab = {
	slug: string;
	title: string;
	tone: SubjectTone;
	status: LabStatus;
	photo?: string;
	/** What the room has, on the cover. */
	inside: string;
	experiments: Experiment[];
};

export const LABS: Lab[] = [
	{
		slug: 'chimica',
		title: 'Chimica',
		tone: 'chemistry',
		status: 'ready',
		photo: '/lab/copertine/aula.webp',
		inside: 'Banchi da due con gas e lavello, cappa aspirante, doccia di emergenza e un banco di strumenti.',
		experiments: [
			{
				slug: 'solfato-di-rame',
				title: 'Cristalli di solfato di rame',
				status: 'ready',
				photo: '/lab/copertine/kit-solfato.webp',
				summary: "Sciogli l'ossido di rame(II) nell'acido solforico caldo, filtra, concentra e lascia crescere i cristalli.",
				years: 'Biennio',
				skills: ['Sintesi di un sale', 'Filtrazione', 'Cristallizzazione', 'Resa'],
				equipment: ['Becco Bunsen', 'Pipetta tarata da 25 mL', 'Becher e beuta', 'Imbuto e carta da filtro', 'Capsula di porcellana'],
				safety: ['Occhiali di protezione', 'Acido solforico 1 M, corrosivo', 'Vetreria calda'],
				steps: 11
			},
			{
				slug: 'saggi-alla-fiamma',
				title: 'Saggi alla fiamma',
				status: 'ready',
				photo: '/lab/copertine/kit-fiamma.webp',
				caption: 'il cloruro di rame nella fiamma',
				summary: 'Porta sette sali nella fiamma del becco Bunsen con un’ansa al nichel-cromo, impara il colore di ogni metallo e riconosci due campioni incogniti.',
				years: 'Biennio',
				skills: ['Saggi alla fiamma', 'Colori di emissione', 'Riconoscimento di un catione', 'Lavorare senza contaminare'],
				equipment: ['Becco Bunsen', 'Ansa al nichel-cromo', 'Sette cloruri e due campioni incogniti', 'Acido cloridrico 2 M', 'Vetro al cobalto'],
				safety: ['Occhiali di protezione', 'Fiamma libera: capelli raccolti', 'Ansa rovente dopo la fiamma', 'Acido cloridrico 2 M, irritante', 'Cloruro di bario, tossico se ingerito; cloruro di rame, nocivo'],
				steps: 7,
				kit: { url: '/lab/kit/saggi-alla-fiamma.glb', drop: COPPER_ONLY }
			},
			{
				slug: 'titolazione',
				title: 'Titolazione acido-base',
				status: 'ready',
				photo: '/lab/copertine/kit-titolazione.webp',
				caption: 'il viraggio: rosa pallido nella beuta 2',
				summary: 'Trova la concentrazione di una soluzione di acido cloridrico: buretta di NaOH 0,100 mol/L, fenolftaleina, una prova e due titolazioni goccia a goccia.',
				years: 'Triennio',
				skills: ['Titolazione', 'Uso di buretta e pipetta tarata', 'Punto di viraggio', 'Calcolo di una concentrazione'],
				equipment: ['Buretta da 25 mL sul sostegno', 'Pipetta tarata da 25 mL', 'Tre beute da 250 mL', 'NaOH 0,100 mol/L e campione di HCl', 'Fenolftaleina'],
				safety: ['Occhiali di protezione', 'Idrossido di sodio 0,100 mol/L e acido cloridrico diluito: possono irritare occhi e pelle', 'Fenolftaleina in etanolo: lontano dalle fiamme, non va toccata né ingerita'],
				steps: 7,
				kit: { url: '/lab/kit/titolazione.glb', drop: [...COPPER_ONLY, 'Bunsen', 'GasHose', 'Lighter', 'HeatMat'] }
			},
			{ slug: 'pila-daniell', title: 'Pila Daniell', status: 'soon', summary: 'Costruisci una pila con zinco, rame e un ponte salino, e misura la tensione.' },
			{ slug: 'libero', title: 'Laboratorio libero', status: 'soon', summary: 'Tutti i reagenti e gli strumenti, senza una traccia: le reazioni seguono le regole vere.' }
		]
	},
	{
		slug: 'fisica',
		title: 'Fisica',
		tone: 'physics',
		status: 'soon',
		inside: 'Rotaie a cuscino d’aria, piani inclinati, pendoli, un banco ottico con lenti e laser.',
		experiments: []
	},
	{
		slug: 'elettronica',
		title: 'Elettronica',
		tone: 'cs',
		status: 'soon',
		inside: 'Breadboard, alimentatore, multimetro e oscilloscopio: circuiti che funzionano davvero.',
		experiments: []
	}
];

export function findExperiment(lab: string, experiment: string) {
	const l = LABS.find((x) => x.slug === lab);
	const e = l?.experiments.find((x) => x.slug === experiment);
	return l && e ? { lab: l, experiment: e } : null;
}

// ---------------------------------------------------------------------------------------------
// Settings

export type Room = 'aula' | 'banco';
export type Quality = 'auto' | 'alta' | 'leggera';
export type Groups = 'banco' | 'meta' | 'singoli';
export type Bodies = 'urtano' | 'fantasmi';
export type Benches = 'propri' | 'tutti';

export type SoloSettings = { mode: 'solo'; room: Room; quality: Quality };
export type ClassSettings = { mode: 'classe'; seats: 12 | 24; groups: Groups; bodies: Bodies; benches: Benches; signals: boolean; quality: Quality };
export type Session = SoloSettings | ClassSettings;

export const SOLO_DEFAULT: SoloSettings = { mode: 'solo', room: 'aula', quality: 'auto' };
export const CLASS_DEFAULT: ClassSettings = { mode: 'classe', seats: 24, groups: 'meta', bodies: 'fantasmi', benches: 'propri', signals: true, quality: 'auto' };

/** The signals the class can send (no chat, see the vault's decision of 29 September 2026). */
export const SIGNALS = ['Ho finito', 'Aiuto', 'Guarda qui', 'Non ho capito', 'Pronti'];

export function sessionQuery(s: Session) {
	const q = new URLSearchParams({ modo: s.mode, qualita: s.quality });
	if (s.mode === 'solo') q.set('stanza', s.room);
	else {
		q.set('postazioni', String(s.seats));
		q.set('gruppi', s.groups);
		q.set('avatar', s.bodies);
		q.set('banchi', s.benches);
		q.set('segnali', s.signals ? '1' : '0');
	}
	return q.toString();
}

export function parseSession(p: Record<string, string | string[] | undefined>): Session {
	const g = (k: string) => (typeof p[k] === 'string' ? (p[k] as string) : undefined);
	const pick = <T extends string>(v: string | undefined, ok: readonly T[], d: T): T => (ok.includes(v as T) ? (v as T) : d);
	const quality = pick(g('qualita'), ['auto', 'alta', 'leggera'] as const, 'auto');
	if (g('modo') !== 'classe') return { mode: 'solo', room: pick(g('stanza'), ['aula', 'banco'] as const, 'aula'), quality };
	return {
		mode: 'classe',
		seats: g('postazioni') === '12' ? 12 : 24,
		groups: pick(g('gruppi'), ['banco', 'meta', 'singoli'] as const, CLASS_DEFAULT.groups),
		bodies: pick(g('avatar'), ['urtano', 'fantasmi'] as const, CLASS_DEFAULT.bodies),
		benches: pick(g('banchi'), ['propri', 'tutti'] as const, CLASS_DEFAULT.benches),
		signals: g('segnali') !== '0',
		quality
	};
}

/** The scene a session plays in. */
export function sessionModel(s: Session) {
	return s.mode === 'solo' && s.room === 'banco' ? '/lab/esperimento.glb' : '/lab/aula.glb';
}

export const LABELS = {
	room: { aula: 'Aula con la classe', banco: 'Banco singolo' },
	quality: { auto: 'Automatica', alta: 'Alta', leggera: 'Leggera' },
	groups: { banco: 'Un gruppo per banco (4)', meta: 'In coppia, mezzo banco (2)', singoli: 'Da soli' },
	bodies: { urtano: 'Si urtano', fantasmi: 'Si attraversano' },
	benches: { propri: 'Solo il proprio banco', tutti: 'Tutti i banchi' }
} as const;
