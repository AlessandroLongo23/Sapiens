import { Color, Mesh, MeshBasicMaterial, Object3D, Quaternion, SphereGeometry, Vector3 } from 'three';
import type { LabScene } from './scene';
import { FreeLab, REACH, keyOf, type Use } from './free';
import { parseNumber, type BookPage, type FieldDef, type Notebook, type NotebookTask, type Verdict } from './notebook';
import { bookOf } from '../quaderno/pagine';
import { curled, type Side } from './grasp';
import { frameFrom } from './hands';
import type { EsperimentoSnapshot, Readout } from './esperimento';
import type { LiquidBody } from './liquid';
import {
	BURETTE,
	CONCORDANT,
	DROP,
	FLASKS,
	SAMPLE,
	apply,
	atEndPoint,
	beyond,
	concentration,
	concordant,
	emptyLevel,
	initial,
	inBurette,
	look,
	onScale,
	quality,
	readsRight,
	type FlaskId,
	type TitState
} from '@/lib/lab/titolazione';

/*
 * The acid-base titration, as a game: a burette of sodium hydroxide on its stand, three flasks, a sample of
 * hydrochloric acid to find the concentration of, and phenolphthalein.
 *
 * The student works with the two hands of the free lab (free.ts). The beaker of base pours into the burette through
 * its funnel; the pipette draws the sample up to its mark (the wheel, and a lens on the meniscus, as in the copper
 * sulfate experiment) and empties into a flask; the dropper adds the indicator. Under the burette, a free hand swirls
 * the flask and goes on until its key stops it, while the wheel works the stopcock and the other key gives one drop
 * or shuts it. The burette is read by the student: a lens on the scale, the value written with the wheel.
 *
 * The chemistry is not here: what is in the burette and in each flask, and what colour a flask shows, are in
 * lib/lab/titolazione.ts, a state changed only by actions. This file moves the hands, draws what the state says and
 * reads the steps off it for the notebook.
 */

type Phase = { text: string | (() => string); hint: string | (() => string); check: () => boolean; then?: () => void; once?: boolean };
type StepDef = { id: string; title: string; why: string; phases: Phase[] };
/** A titration: the flask it is done in (from the first drop), and the two readings as the student wrote them. */
type Run = { flask: FlaskId | null; vi: number | null; vf: number | null };

const up = new Vector3(0, 1, 0);
const fmt = (x: number, d = 2) => x.toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
/** mL a second through the stopcock, by how far it is open (0 to 1): drops at first, then a thread, then a stream. */
const rate = (open: number) => (open < 0.04 ? 0 : 1.4 * Math.pow(open, 2.3));
/** Under this the burette drips; over it, it runs. */
const DRIP = 0.2;
/** How the flask is swirled: the circle's radius (metres), turns a second, how far it leans (radians). */
const SWIRL = { r: 0.006, hz: 2.1, lean: 0.03 };
const CLEAR = new Color('#a8cbe0');
const PINK = new Color('#f59ac6');
const FUCHSIA = new Color('#c4157c');
const NAMES = ['Prima', 'Seconda', 'Terza'];

export class Titolazione {
	readonly free: FreeLab;
	/** The chemistry: plain data, changed only by lib/lab/titolazione.ts's actions. */
	readonly state: TitState;
	private steps: StepDef[];
	private step = 0;
	private phase = 0;
	private listeners = new Set<() => void>();
	private snap: EsperimentoSnapshot;
	private emitT = 0;

	goggles = false;
	private notes = new Map<string, boolean>();
	private latched = new Set<Phase>();
	private told = new Set<string>();

	/** How far the stopcock is open, 0 to 1; the fraction of a drop that has formed at the tip. */
	opening = 0;
	private dripT = 0;
	private streaming = false;
	/** The hand on the stopcock, the one asked for it last, and how long since it last did anything. */
	private cockHand: Side | null = null;
	private cockPref: Side = 'L';
	private cockT = 9;
	private sayT = 0;
	/** The hand that swirls the flask under the burette. */
	swirl: Side | null = null;
	private swirlNode: Object3D | null = null;
	private swirlT = 0;
	private swirlK = 0;
	/** The hand that holds the pipette in the sample while it draws. */
	drawing: Side | null = null;
	private drawPending = 0;
	readonly runs: Run[] = [
		{ flask: null, vi: null, vf: null },
		{ flask: null, vi: null, vf: null },
		{ flask: null, vi: null, vf: null }
	];
	private misread = 0;
	private miscalc = 0;
	private report: { rows: [string, string][]; notes: { good: boolean; text: string }[] } | null = null;

	/** Where the burette's tip is, and where a flask stands under it. */
	private tip = new Vector3();
	private spot = new Vector3();
	private clouds = new Map<FlaskId, Mesh>();
	private flaskNodes = new Map<FlaskId, Object3D>();

	constructor(
		private s: LabScene,
		private notebook: Notebook,
		seed = 1
	) {
		this.state = initial(seed);
		this.free = new FreeLab(s, notebook);
		this.free.uses = (o) => this.uses(o);
		this.free.refuse = (o) => (!this.goggles && o.name !== 'Goggles' ? 'Prima indossa gli occhiali di protezione.' : null);
		// the body stays still while a hand swirls, draws or the eyes are on the scale
		const busy = s.handsBusy;
		s.handsBusy = () => busy() || this.swirl !== null || this.drawing !== null;
		for (const name of ['Burette', 'BuretteCock', 'BuretteStand', 'GasTap']) {
			const n = s.nodes.get(name);
			if (n) n.userData.fixed = true;
		}
		const burette = this.N('Burette');
		burette.updateWorldMatrix(true, false);
		burette.getWorldPosition(this.tip);
		// what stands under the burette stands where the waste beaker does at the start
		const waste = s.rest.get('WasteBeaker');
		this.spot.set(this.tip.x, waste ? waste.position.y : this.tip.y - 0.157, this.tip.z);
		for (const id of FLASKS) {
			const node = this.N(`Flask${id}`);
			this.flaskNodes.set(id, node);
			// the base that has just fallen, before it is mixed: a pink cloud under the surface. Drawn before the liquid,
			// which then lies over it
			const cloud = new Mesh(new SphereGeometry(1, 20, 14), new MeshBasicMaterial({ color: '#ee6aae', transparent: true, opacity: 0, depthWrite: false }));
			cloud.renderOrder = 0.5;
			cloud.visible = false;
			cloud.userData.noPick = true;
			cloud.raycast = () => {};
			node.add(cloud);
			this.clouds.set(id, cloud);
		}
		const held = (side: Side) => this.hands.held(side) !== null;
		const f = (id: FlaskId) => this.state.flasks[id];

		/** The flask a titration is done in, or the one that is ready for it: with its sample, and not titrated yet. */
		const flaskOf = (k: number): FlaskId | null => this.runs[k].flask ?? FLASKS.find((id) => f(id).acid > 0 && !this.runs.some((r) => r.flask === id)) ?? null;
		const started = (k: number) => this.runs[k].flask !== null;
		const sample = (k: number): Phase => ({
			text: 'Con la pipetta, metti 25,0 mL del campione di HCl in una beuta pulita.',
			hint: "Prendi la pipetta, punta il becher con il campione e premi il tasto della mano che la tiene: {gira su} per aspirare fino alla tacca, poi lo stesso tasto. Punta la beuta e premi di nuovo per svuotare la pipetta nella beuta.",
			check: () => started(k) || flaskOf(k) !== null
		});
		const dye = (k: number): Phase => ({
			text: 'Aggiungi due gocce di fenolftaleina.',
			hint: 'Prendi il contagocce, punta la beuta e premi il tasto della mano che lo tiene: una goccia a ogni pressione.',
			check: () => started(k) || (flaskOf(k) !== null && f(flaskOf(k)!).drops >= 2)
		});
		const place = (k: number): Phase => ({
			text: 'Metti la beuta sotto la buretta, sulla piastrella bianca.',
			hint: 'Sposta prima il becher degli scarti. Poi, con la beuta in mano, punta la buretta e premi il tasto della mano che la tiene.',
			check: () => started(k) || (flaskOf(k) !== null && this.under() === this.flaskNodes.get(flaskOf(k)!))
		});
		const first = (k: number): Phase => ({
			text: () => `Leggi il volume iniziale${this.runs[k].vi !== null ? `: ${fmt(this.runs[k].vi!)} mL` : '.'}`,
			hint: 'Punta la buretta e premi {Q} o {E} (o apri il quaderno con B, pagina Letture): scrivi nella tabella il valore dove il fondo del menisco tocca la scala.',
			check: () => started(k) || this.runs[k].vi !== null
		});
		const titrate = (k: number): Phase => ({
			text: k === 0 ? 'Fai scendere NaOH agitando, finché il rosa non sparisce più.' : 'Titola: veloce fino a 1 mL prima del valore di prova, poi goccia a goccia.',
			hint: () => {
				// how much the trial took is the student's to work out, in the notebook
				const trial = this.notebook.number('v1');
				if (k === 0) return "Punta la beuta e premi {Q} o {E} per agitarla con una mano. Poi {gira su} per aprire il rubinetto: quando il rosa tarda a sparire, chiudi e vai a gocce con il tasto dell'altra mano.";
				if (trial === null) return 'Calcola nel quaderno quanto NaOH è servito nella prova (volume finale meno iniziale). Poi lascia scendere veloce fino a 1 mL prima, e continua una goccia alla volta, agitando.';
				return `Nella prova sono serviti ${fmt(trial)} mL: lascia scendere fino a circa ${fmt(Math.max(0, (this.runs[k].vi ?? 0) + trial - 1), 1)} mL sulla scala (a rubinetto chiuso si vede nel quaderno, con B), poi una goccia alla volta, agitando.`;
			},
			check: () => this.runs[k].vf !== null || (started(k) && atEndPoint(f(this.runs[k].flask!)) && this.opening === 0)
		});
		const last = (k: number): Phase => ({
			text: () => `Leggi il volume finale${this.runs[k].vf !== null ? `: ${fmt(this.runs[k].vf!)} mL` : '.'}`,
			hint: 'Ferma la beuta, punta la buretta e premi {Q} o {E}: scrivi il valore nella tabella del quaderno.',
			check: () => this.runs[k].vf !== null
		});
		const refill = (k: number): Phase => ({
			text: 'Riempi di nuovo la buretta: menisco tra 0 e 5 mL, imbuto tolto.',
			hint: "Togli la beuta titolata e rimetti sotto il becher degli scarti. Rimetti l'imbuto (con l'imbuto in mano, punta la buretta), versa NaOH fin sopra lo zero, togli l'imbuto e apri il rubinetto finché il menisco è tra 0 e 5 mL.",
			check: () => started(k) || (onScale(this.state) && this.state.burette.level <= 5 && !this.funnelOn() && this.opening === 0)
		});
		const again = (k: number): StepDef => ({
			id: `run${k}`,
			title: `${k === 1 ? 'Seconda' : 'Terza'} titolazione`,
			why:
				k === 1
					? "Ora si sa dove cade il viraggio: si può scendere in fretta fin quasi a quel volume e poi andare a gocce. Una beuta pulita, un campione nuovo, la buretta di nuovo piena."
					: `Un valore solo non basta: due titolazioni accurate devono dare lo stesso volume, entro ${fmt(CONCORDANT)} mL. Il risultato è la loro media.`,
			phases: [refill(k), sample(k), dye(k), place(k), first(k), titrate(k), last(k)]
		});

		this.steps = [
			{
				id: 'goggles',
				title: 'Sicurezza',
				why: "L'idrossido di sodio e l'acido cloridrico, anche diluiti, possono irritare gli occhi: gli occhiali si indossano prima di toccare qualsiasi cosa sul banco.",
				phases: [{ text: 'Indossa gli occhiali di protezione.', hint: 'Sono sul banco, a sinistra. Puntali e premi {Q} o {E}: li indossa la mano sinistra o la destra.', check: () => this.goggles }]
			},
			{
				id: 'burette',
				title: 'Prepara la buretta',
				why: "La buretta è già avvinata, cioè sciacquata con la stessa soluzione, che così non si diluisce. Si riempie di NaOH 0,100 mol/L fin sopra lo zero. Nella punta resta dell'aria: va fatta uscire, altrimenti una parte del volume letto sulla scala riempie la punta e non arriva nella beuta.",
				phases: [
					{
						text: "Versa NaOH nella buretta, attraverso l'imbuto, fin sopra lo zero.",
						hint: 'Prendi il becher con NaOH, punta la buretta e premi il tasto della mano che lo tiene: {Q} la sinistra, {E} la destra.',
						check: () => this.state.burette.level <= 0,
						once: true
					},
					{ text: "Togli l'imbuto dalla buretta.", hint: "Appoggia il becher, punta l'imbuto e prendilo; poi posalo sul banco. Se resta lì, una goccia che scende dall'imbuto falsa la lettura.", check: () => !this.funnelOn() },
					{
						text: 'Apri il rubinetto sul becher degli scarti finché dalla punta non esce più aria.',
						hint: 'Punta il rubinetto azzurro della buretta e {gira su}: la mano libera lo apre. {Gira giù} per chiuderlo.',
						check: () => this.state.burette.air <= 0,
						once: true
					},
					{ text: 'Porta il menisco sulla scala, tra 0 e 5 mL, e chiudi.', hint: 'Lo zero è in alto e la scala cresce verso il basso. Non serve lo zero esatto: basta un valore che si legge bene.', check: () => onScale(this.state) && this.state.burette.level <= 5 && this.opening === 0 }
				]
			},
			{
				id: 'sample',
				title: 'Il campione',
				why: `La pipetta tarata dà ${SAMPLE},0 mL esatti quando il menisco è sulla tacca. La beuta può essere bagnata di acqua distillata: le moli di acido non cambiano. La fenolftaleina è incolore fino a pH 8 circa e rosa sopra: qui vira con la prima goccia di base in eccesso.`,
				phases: [sample(0), dye(0)]
			},
			{
				id: 'run0',
				title: 'Titolazione di prova',
				why: "La prima serve a sapere dove cade il viraggio: si scende in fretta e lo si supera di poco. Dove cade la base compare un rosa che sparisce agitando; vicino alla fine sparisce sempre più lentamente.",
				phases: [place(0), first(0), titrate(0), last(0)]
			},
			again(1),
			again(2),
			{
				id: 'calc',
				title: 'Riordina e calcola',
				why: "Il rubinetto si lascia chiuso e il banco libero. Poi i conti, nel quaderno: la reazione è HCl + NaOH → NaCl + H₂O, una mole di base per una di acido, quindi c(HCl) · 25,0 mL = 0,100 mol/L · V(NaOH).",
				phases: [
					{ text: 'Chiudi il rubinetto e appoggia quello che hai in mano.', hint: 'Punta il banco e {clic con la} mano che tiene qualcosa.', check: () => this.opening === 0 && !held('L') && !held('R') && !this.swirl, once: true },
					{ text: 'Calcola il NaOH usato in ogni titolazione.', hint: 'Apri il quaderno con B, pagina Letture: volume finale meno volume iniziale, riga per riga.', check: () => [1, 2, 3].every((n) => this.notebook.number(`v${n}`) !== null) },
					{ text: 'Calcola la media delle due titolazioni accurate.', hint: 'Pagina Calcoli. La titolazione di prova non entra nella media.', check: () => this.notebook.number('media') !== null },
					{ text: "Calcola la concentrazione dell'acido.", hint: 'Pagina Calcoli: c(HCl) = 0,100 mol/L · V medio / 25,0 mL.', check: () => this.notebook.number('conc') !== null }
				]
			}
		];
		this.book();
		const prev = s.onUpdate;
		s.onUpdate = (dt) => {
			prev(dt);
			this.update(dt);
		};
		this.free.subscribe(() => this.emit());
		this.snap = this.build();
		this.page();
	}

	// ---------------------------------------------------------------------------------------------
	// state for the page

	subscribe = (fn: () => void) => {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	};

	getSnapshot = () => this.snap;

	private emit() {
		this.snap = this.build();
		for (const fn of this.listeners) fn();
	}

	private get done() {
		return this.step >= this.steps.length;
	}

	private textOf(p: Phase) {
		return typeof p.text === 'string' ? p.text : p.text();
	}

	private build(): EsperimentoSnapshot {
		const def = this.steps[Math.min(this.step, this.steps.length - 1)];
		const pip = this.s.liquids.get('Pipette');
		const mark = Number(this.s.nodes.get('Pipette')?.userData.mark ?? 0.32);
		return {
			...this.free.getSnapshot(),
			step: this.step,
			total: this.steps.length,
			stepTitle: this.done ? 'Risultati' : def.title,
			objective: this.done ? 'Esperimento concluso' : this.textOf(def.phases[this.phase]),
			readouts: this.readouts(),
			lens: this.drawing && pip ? { vol: pip.contents.vol, offsetMm: (pip.localLevel() - mark) * 1000, ok: Math.abs(pip.contents.vol - SAMPLE) <= 0.12 } : null,
			goggles: this.goggles,
			night: 0,
			done: this.done
		};
	}

	/** The colour of a flask, in the student's words. */
	private colourOf(id: FlaskId) {
		const l = look(this.state.flasks[id]);
		if (l.pink > 0.6) return 'fucsia';
		if (l.pink > 0.28) return 'rosa';
		if (l.pink > 0.004) return 'rosa pallido';
		return l.cloud > 0.08 ? 'rosa dove cade la base' : 'incolore';
	}

	private readouts(): Readout[] {
		const out: Readout[] = [];
		const r = rate(this.opening);
		if (this.opening > 0) out.push({ label: 'Rubinetto', value: r <= 0 ? 'chiuso' : r < DRIP ? 'goccia a goccia' : r < 0.6 ? 'filo sottile' : 'aperto', tone: r >= 0.6 ? 'warn' : undefined });
		const under = this.under();
		const id = under?.userData.flask as FlaskId | undefined;
		if (id && this.state.flasks[id].acid > 0) {
			const colour = this.colourOf(id);
			out.push({ label: `Beuta ${id}`, value: colour, tone: colour === 'rosa pallido' ? 'ok' : colour === 'fucsia' ? 'warn' : undefined });
		}
		return out;
	}

	private page() {
		if (this.report) {
			this.notebook.draw({
				kicker: 'Esperimento concluso',
				title: "La concentrazione dell'acido",
				intro: "HCl + NaOH → NaCl + H₂O, una mole di base per una di acido. Al punto equivalente le moli di NaOH aggiunte sono quelle di HCl nella beuta; il viraggio lo segnala, con lo scarto di una goccia. c(HCl) · 25,0 mL = 0,100 mol/L · V(NaOH).",
				rows: this.report.rows,
				steps: 'Come è andata',
				tasks: this.report.notes.map((n) => ({ text: n.text, state: n.good ? 'done' : 'bad' })),
				hint: '',
				done: null
			});
			return;
		}
		const def = this.steps[this.step];
		const now = def.phases[this.phase];
		const tasks: NotebookTask[] = def.phases.map((p, i) => ({ text: this.textOf(p), state: i < this.phase ? 'done' : i === this.phase ? 'now' : 'todo' }));
		// the readings stay readable once taken
		this.notebook.draw({
			kicker: `Passo ${this.step + 1} di ${this.steps.length}`,
			title: def.title,
			intro: def.why,
			tasks,
			hint: typeof now.hint === 'string' ? now.hint : now.hint(),
			done: null,
			keep: def.id.startsWith('run'),
			outline: this.steps.map((x, i) => ({ title: x.title, state: i < this.step ? 'done' : i === this.step ? 'now' : 'todo' }))
		});
	}

	private say(kind: 'info' | 'warn' | 'ok', text: string) {
		this.free.say(kind, text);
	}

	/** Says it once in the whole experiment (or once per `key`). */
	private once(key: string, kind: 'info' | 'warn' | 'ok', text: string) {
		if (this.told.has(key)) return;
		this.told.add(key);
		this.say(kind, text);
	}

	private note(text: string, good: boolean) {
		if (!this.notes.has(text)) this.notes.set(text, good);
	}

	private N(name: string): Object3D {
		return this.s.nodes.get(name)!;
	}

	private L(name: string): LiquidBody {
		return this.s.liquids.get(name)!;
	}

	private get hands() {
		return this.s.hands;
	}

	private sideOf(name: string): Side | null {
		if (this.hands.held('L')?.name === name) return 'L';
		if (this.hands.held('R')?.name === name) return 'R';
		return null;
	}

	/** The volume of base a titration took, by the student's own readings, or null. */
	titre(k: number) {
		const r = this.runs[k];
		return r.vi !== null && r.vf !== null ? r.vf - r.vi : null;
	}

	/** The titration in hand: the first one without its final reading (3 when all are done). */
	private get current() {
		const k = this.runs.findIndex((r) => r.vf === null);
		return k < 0 ? this.runs.length : k;
	}

	/** Whether the funnel is in the burette's mouth. */
	private funnelOn() {
		const funnel = this.s.nodes.get('Funnel');
		if (!funnel || this.s.held.has(funnel)) return false;
		const p = funnel.getWorldPosition(new Vector3());
		return Math.hypot(p.x - this.tip.x, p.z - this.tip.z) < 0.012 && p.y > this.tip.y + 0.25;
	}

	/** What stands under the burette's tip: a flask, the waste beaker, or nothing. */
	private under(): Object3D | null {
		// the flask a hand swirls is under it: its mouth is kept there
		if (this.swirlNode) return this.swirlNode;
		const p = new Vector3();
		for (const n of [...this.flaskNodes.values(), this.N('WasteBeaker')]) {
			if (this.s.held.has(n)) continue;
			n.getWorldPosition(p);
			if (Math.hypot(p.x - this.spot.x, p.z - this.spot.z) < 0.014 && Math.abs(p.y - this.spot.y) < 0.012) return n;
		}
		return null;
	}

	// ---------------------------------------------------------------------------------------------
	// what can be done

	/** A control a free hand works where it stands: Q for the left hand and E for the right. */
	private byHand(o: Object3D, verb: Use['verb'], text: string, run: (side: Side) => Promise<void> | void, exclusive = false): Use[] {
		const free = (['L', 'R'] as Side[]).filter((side) => !this.hands.held(side));
		if (!free.length) return (['Q', 'E'] as const).map((input) => ({ input, verb, text: 'Serve una mano libera', blocked: true, why: 'Ti serve una mano libera: appoggia qualcosa.', exclusive }));
		return free.map((side) =>
			this.hands.distance(side, o) <= REACH
				? { input: keyOf(side), verb, text, exclusive, run: () => run(side) }
				: { input: keyOf(side), verb, text: 'Troppo lontano', blocked: true, why: 'Non ci arrivi: avvicinati.', exclusive }
		);
	}

	/** What a tool in `side`'s hand does to `o`, if the hand reaches. */
	private withTool(side: Side, o: Object3D, verb: Use['verb'], text: string, run: () => Promise<void> | void, why = ''): Use {
		if (why) return { input: keyOf(side), verb, text, blocked: true, why };
		return this.hands.distance(side, o) <= REACH ? { input: keyOf(side), verb, text, run } : { input: keyOf(side), verb, text: 'Troppo lontano', blocked: true, why: 'Non ci arrivi: avvicinati.' };
	}

	/** Why the stopcock cannot let anything through now, or ''. */
	private cannotRun(): string {
		if (inBurette(this.state) <= 0.001) return 'La buretta è vuota: riempila di NaOH.';
		const under = this.under();
		if (!under) return "Sotto la buretta non c'è niente: metti il becher degli scarti, o la beuta con il campione.";
		const id = under.userData.flask as FlaskId | undefined;
		const k = this.current;
		const going = k < this.runs.length ? this.runs[k].flask : null;
		if (!id) {
			// what is read on the scale must all be in the flask: nothing goes to waste between the two readings
			if (going !== null) return `C'è una titolazione in corso: rimetti sotto la buretta la beuta ${going}.`;
			return this.state.waste > 62 ? 'Il becher degli scarti è quasi pieno: svuotalo.' : '';
		}
		const f = this.state.flasks[id];
		if (this.runs.some((r) => r.flask === id && r.vf !== null) || k >= this.runs.length) return 'Questa beuta è già titolata: toglila e metti sotto il becher degli scarti, o una beuta nuova con il campione.';
		if (going !== null && going !== id) return `Stai titolando la beuta ${going}: finisci quella.`;
		if (f.acid <= 0) return 'Questa beuta è vuota: prima il campione di acido, con la pipetta.';
		if (f.drops <= 0) return "Senza indicatore non vedresti il viraggio: aggiungi due gocce di fenolftaleina.";
		if (this.funnelOn()) return "Togli l'imbuto dalla buretta: una goccia che scende dall'imbuto falserebbe il volume.";
		if (this.state.burette.air > 0) return "Nella punta della buretta c'è ancora aria: falla uscire nel becher degli scarti.";
		if (this.runs[k].flask === null) {
			const level = this.state.burette.level;
			if (level < 0) return 'Il menisco è sopra lo zero: fai scendere NaOH nel becher degli scarti finché è sulla scala, poi leggi il volume iniziale.';
			if (level > 5) return "Nella buretta non c'è abbastanza NaOH per una titolazione: riempila fino a un valore tra 0 e 5 mL.";
			if (this.runs[k].vi === null) return 'Prima leggi il volume iniziale sulla buretta.';
		}
		if (this.state.burette.level >= BURETTE.scale - 1e-6) return 'Il menisco è alla fine della scala: da qui in giù non si legge più.';
		return '';
	}

	/** The wheel on the stopcock. */
	private cockWheel(exclusive = false): Use {
		const r = rate(this.opening);
		const how = r <= 0 ? 'chiuso' : r < DRIP ? 'goccia a goccia' : r < 0.6 ? 'filo sottile' : 'aperto';
		return { input: 'W', verb: 'turn', text: 'Apri o chiudi il rubinetto', target: exclusive ? undefined : `Rubinetto della buretta · ${how}`, exclusive, wheel: (d) => this.turnCock(-d * 0.0012) };
	}

	/** A key on the stopcock: one drop when it is shut, shut at once when it is open. */
	private cockKey(side: Side, exclusive = false): Use {
		if (this.hands.held(side)) return { input: keyOf(side), verb: 'turn', text: 'Serve una mano libera', blocked: true, why: 'Per il rubinetto ti serve una mano libera: appoggia quello che tiene.', exclusive };
		return { input: keyOf(side), verb: 'turn', text: this.opening > 0 ? 'Chiudi il rubinetto' : 'Una goccia', exclusive, run: () => this.cockPress(side) };
	}

	private uses(o: Object3D | null): Use[] {
		// filling the pipette: the wheel draws, its hand's key stops at the mark
		if (this.drawing) {
			const pip = this.L('Pipette');
			return [
				{ input: 'W', verb: 'draw', text: 'Aspira o lascia scendere', exclusive: true, target: `Pipetta · ${fmt(pip.contents.vol)} mL`, wheel: (d) => this.pull(d) },
				{ input: keyOf(this.drawing), verb: 'confirm', text: 'Il menisco è sulla tacca', exclusive: true, run: () => this.confirmDraw() }
			];
		}
		// a hand swirls the flask: its key stops it, the wheel and the other key work the stopcock, wherever the eyes are
		if (this.swirl) {
			const other: Side = this.swirl === 'L' ? 'R' : 'L';
			const id = this.swirlNode?.userData.flask as FlaskId;
			return [{ input: keyOf(this.swirl), verb: 'confirm', text: 'Ferma la beuta', exclusive: true, target: `Beuta ${id} · ${this.colourOf(id)}`, run: () => this.stopSwirl() }, this.cockKey(other, true), this.cockWheel(true)];
		}
		if (!o) return [];
		const name = o.name;
		if (!this.goggles) return name === 'Goggles' ? this.byHand(o, 'wear', 'Indossa', (side) => this.wear(side), true) : [];

		const naoh = this.sideOf('NaOHBeaker');
		const pipette = this.sideOf('Pipette');
		const dropper = this.sideOf('Indicator');
		const burette = this.N('Burette');

		if (name === 'BuretteCock') return [this.cockKey('L'), this.cockKey('R'), this.cockWheel()];

		const onBurette = name === 'Burette' || name === 'BuretteStand' || (name === 'Funnel' && this.funnelOn());
		if (onBurette) {
			const out: Use[] = [];
			if (naoh) {
				const k = this.current;
				const going = k < this.runs.length && this.runs[k].flask !== null;
				const why = going ? "C'è una titolazione in corso: la buretta si riempie dopo la lettura finale." : !this.funnelOn() ? "Senza imbuto la bocca della buretta è troppo stretta: rimetti l'imbuto." : this.state.burette.level <= -BURETTE.above * 0.5 ? 'La buretta è già piena fin sopra lo zero.' : this.opening > 0 ? 'Chiudi prima il rubinetto.' : '';
				out.push(this.withTool(naoh, burette, 'pour', 'Versa nella buretta', () => this.fill(naoh), why));
			}
			if (this.sideOf('SampleBeaker')) out.push({ input: keyOf(this.sideOf('SampleBeaker')!), verb: 'pour', text: 'Questo è il campione', blocked: true, why: "Questo è il campione di acido: nella buretta va l'idrossido di sodio." });
			// what a hand holds that can stand under the tip goes there
			for (const side of ['L', 'R'] as Side[]) {
				const h = this.hands.held(side);
				if (!h || (!h.userData.flask && h.name !== 'WasteBeaker')) continue;
				const taken = this.under();
				out.push(this.withTool(side, burette, 'insert', 'Metti sotto la buretta', () => this.putUnder(side, h), taken ? "Sotto la buretta c'è già qualcosa: toglilo prima." : ''));
			}
			// the reading is written in the notebook: either key that is left opens it at its page
			if (name === 'Burette') for (const input of ['Q', 'E'] as const) if (!out.some((u) => u.input === input)) out.push({ input, verb: 'read', text: 'Leggi il livello', run: () => this.openReadings() });
			return out;
		}

		const flask = o.userData.flask as FlaskId | undefined;
		if (flask && !this.s.held.has(o)) {
			const f = this.state.flasks[flask];
			const isUnder = this.under() === o;
			const done = this.runs.some((r) => r.flask === flask);
			const out: Use[] = [];
			if (pipette) {
				const pip = this.L('Pipette').contents;
				const why = isUnder ? 'Togli la beuta da sotto la buretta: la pipetta non ci passa.' : done ? 'Questa beuta è già stata titolata.' : f.acid > 0 ? 'Questa beuta ha già il suo campione: 25,0 mL, non di più.' : pip.vol < 0.5 ? 'La pipetta è vuota: riempila dal becher con il campione.' : Math.abs(pip.vol - SAMPLE) > 0.12 ? 'Nella pipetta non ci sono 25,0 mL: porta il menisco sulla tacca.' : '';
				out.push(this.withTool(pipette, o, 'pour', `Svuota nella beuta ${flask}`, () => this.drain(pipette, o), why));
			}
			if (dropper) {
				const why = isUnder ? "Togli la beuta da sotto la buretta per aggiungere l'indicatore." : f.acid <= 0 ? "Prima il campione di acido: l'indicatore va nella soluzione." : '';
				out.push(this.withTool(dropper, o, 'pour', 'Aggiungi una goccia', () => this.drip(dropper, o, flask), why));
			}
			if (isUnder && f.acid > 0) for (const u of this.byHand(o, 'stir', 'Agita la beuta', (side) => this.startSwirl(side, o))) if (!out.some((x) => x.input === u.input)) out.push(u);
			return out;
		}

		if (name === 'SampleBeaker' && pipette && !this.s.held.has(o)) {
			const pip = this.L('Pipette').contents;
			return [pip.vol < 0.5 ? this.withTool(pipette, o, 'draw', 'Immergi nel campione', () => this.dip(pipette), this.L('SampleBeaker').contents.vol < 27 ? 'Nel becher resta poco campione: riempilo dalla bottiglia.' : '') : this.withTool(pipette, o, 'pour', 'Rimetti il campione', () => this.drain(pipette, o))];
		}
		if (name === 'NaOHBeaker' && pipette && !this.s.held.has(o)) return [{ input: keyOf(pipette), verb: 'draw', text: 'Questo è NaOH', blocked: true, why: "Questo è l'idrossido di sodio, che va nella buretta. Con la pipetta si misura il campione di acido." }];
		if (name === 'WasteBeaker' && this.state.waste > 30 && !this.s.held.has(o)) return this.byHand(o, 'pour', 'Svuota gli scarti', () => this.emptyWaste());

		// the stock bottles fill their beaker again
		for (const [bottle, beaker] of [['NaOHBottle', 'NaOHBeaker'], ['SampleBottle', 'SampleBeaker']] as const) {
			const side = this.sideOf(beaker);
			if (name === bottle && side) return [this.withTool(side, o, 'pour', 'Riempi il becher', () => this.restock(beaker), this.L(beaker).contents.vol > 70 ? "Nel becher ce n'è ancora abbastanza." : '')];
		}
		return [];
	}

	// ---------------------------------------------------------------------------------------------
	// actions

	private async wear(side: Side) {
		this.N('Goggles').visible = false;
		this.goggles = true;
		await this.hands.gesture(side);
		this.note('Occhiali indossati prima di iniziare', true);
		this.say('ok', 'Occhiali indossati. Ora puoi lavorare al banco.');
	}

	/** A direction in the student's own terms: so much towards the side of the hand, so much up, so much back. */
	private toHand(side: Side, out: number, rise: number, back: number) {
		const yaw = this.s.player.yaw;
		const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
		const fwd = new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
		return right.multiplyScalar((side === 'R' ? 1 : -1) * out).addScaledVector(up, rise).addScaledVector(fwd, -back).normalize();
	}

	/** Takes the tool in `side`'s hand to a pose, its origin at `at` and turned `q`, and keeps it there. */
	private async tool(side: Side, at: Vector3, q: Quaternion, dur: number, lift = 0) {
		const to = () => this.hands.palmFor(side, at, q);
		this.hands.drive(side, to);
		await this.hands.carry(side, to, dur, lift);
	}

	/** A reading taken before the titration starts no longer holds once the level has moved. */
	private levelMoved() {
		const k = this.current;
		if (k < this.runs.length && this.runs[k].flask === null && this.runs[k].vi !== null) {
			this.runs[k].vi = null;
			this.notebook.clear(`vi${k + 1}`);
			this.say('info', 'Il livello nella buretta è cambiato: il volume iniziale va letto di nuovo.');
			this.page();
		}
	}

	/** Sodium hydroxide from the beaker into the burette, through the funnel, until it is above the zero. */
	private async fill(side: Side) {
		const funnel = this.N('Funnel');
		const stopAt = -BURETTE.above * 0.6;
		const got = await this.free.pour(side, funnel, {
			receive: (c) => void apply(this.state, { type: 'fill', ml: c.vol }),
			stop: () => this.state.burette.level <= stopAt
		});
		if (got < 0.05) return;
		this.levelMoved();
		if (this.state.burette.level <= 0) this.say('ok', "La buretta è piena fin sopra lo zero. Togli l'imbuto, poi fai scendere il menisco sulla scala.");
		else if (this.L('NaOHBeaker').contents.vol < 1) this.say('info', 'Il becher è vuoto e la buretta non è ancora piena: riempi il becher dalla bottiglia di NaOH e versa ancora.');
		else this.say('info', 'La buretta non è ancora piena fin sopra lo zero: versa ancora.');
	}

	private async restock(beaker: 'NaOHBeaker' | 'SampleBeaker') {
		await this.s.anim.wait(0.5);
		this.L(beaker).contents.vol = 100;
		this.say('ok', beaker === 'NaOHBeaker' ? 'Becher riempito: 100 mL di NaOH 0,100 mol/L.' : 'Becher riempito: 100 mL del campione.');
	}

	private async emptyWaste() {
		await this.s.anim.wait(0.4);
		this.state.waste = 0;
		this.say('ok', 'Scarti versati nel recipiente dei rifiuti acquosi.');
	}

	/** A flask or the waste beaker from the hand to its place under the burette's tip. */
	private async putUnder(side: Side, node: Object3D) {
		const rest = this.s.rest.get(node.name);
		const q = new Quaternion().setFromAxisAngle(up, this.s.player.yaw);
		if (rest) q.multiply(rest.quaternion);
		this.hands.drop(side, this.spot.clone(), q);
		this.s.held.delete(node);
		await this.s.anim.wait(0.12);
		const id = node.userData.flask as FlaskId | undefined;
		if (id && this.state.flasks[id].acid > 0 && this.state.flasks[id].drops <= 0) this.say('info', 'Nella beuta manca la fenolftaleina: senza indicatore il viraggio non si vede.');
	}

	// the stopcock

	private turnCock(by: number) {
		if (by > 0 && this.opening === 0) {
			const free = (['L', 'R'] as Side[]).some((side) => !this.hands.held(side));
			const why = free ? this.cannotRun() : 'Per il rubinetto ti serve una mano libera: appoggia qualcosa.';
			if (why) {
				// one notch of the wheel is many calls: said once a second
				if (this.sayT <= 0) this.say('info', why);
				this.sayT = 1.2;
				return;
			}
		}
		this.opening = Math.max(0, Math.min(1, this.opening + by));
		if (this.opening < 0.04 && by < 0) this.opening = 0;
		this.cockT = 0;
	}

	private cockPress(side: Side) {
		this.cockPref = side;
		this.cockT = 0;
		if (this.opening > 0) {
			this.opening = 0;
			return;
		}
		const why = this.cannotRun();
		if (why) return this.say('info', why);
		this.deliver(DROP, true);
	}

	/** Lets `ml` through the stopcock into what stands under the tip. */
	private deliver(ml: number, drop: boolean) {
		const under = this.under();
		if (!under) return void (this.opening = 0);
		const id = under.userData.flask as FlaskId | undefined;
		const b = this.state.burette;
		// into a flask, no further than the end of the scale
		const room = id ? Math.max(0, BURETTE.scale - b.level) : ml;
		const events = apply(this.state, { type: 'run', ml: Math.min(ml, room), into: id ?? 'waste' });
		const ran = events.find((e) => e.type === 'ran');
		const k = this.current;
		if (id && ran && ran.type === 'ran' && ran.delivered > 0 && k < this.runs.length && this.runs[k].flask === null) {
			this.runs[k].flask = id;
			this.once('first', 'info', 'Dove cade la base compare un rosa che sparisce: agita la beuta mentre scende.');
		}
		if (!id) this.levelMoved();
		if (events.some((e) => e.type === 'primed')) this.say('ok', "L'aria è uscita dalla punta: da ora il volume letto sulla scala è quello che esce.");
		if (drop && ran && ran.type === 'ran' && ran.delivered > 0) this.s.drops.spawn(this.tip.clone().add(new Vector3(0, -0.002, 0)), new Vector3(0, -0.15, 0), this.floorOf(under));
		if (inBurette(this.state) <= 0.001) {
			this.opening = 0;
			this.say('warn', 'La buretta è vuota.');
		} else if (id && b.level >= BURETTE.scale - 1e-6) {
			this.opening = 0;
			this.say('warn', 'Il menisco è arrivato a 25 mL, la fine della scala: chiuso. Questa titolazione ha superato di molto il viraggio: leggi comunque il volume finale.');
		} else if (!id && this.state.waste > 62) {
			this.opening = 0;
			this.say('warn', 'Il becher degli scarti è quasi pieno: chiuso. Svuotalo.');
		}
	}

	/** The height a drop falls to in what stands under the tip: its liquid, or its bottom. */
	private floorOf(under: Object3D) {
		const lq = this.s.liquids.get(under.name);
		return lq && lq.contents.vol > 0.05 ? lq.level() : under.getWorldPosition(new Vector3()).y + 0.003;
	}

	// the flask under the burette

	/** A free hand takes the flask by its neck and swirls it under the tip, until `stopSwirl`. */
	private async startSwirl(side: Side, node: Object3D) {
		const q0 = node.getWorldQuaternion(new Quaternion());
		// the hand goes to the flask and closes on it where it stands: taken at once, as things are from the bench, the
		// flask would fly to the hand and back
		if (!(await this.hands.take(side, node, 'carry'))) return;
		this.s.held.add(node);
		this.swirl = side;
		this.swirlNode = node;
		this.swirlT = 0;
		this.swirlK = 0;
		const lean = new Quaternion();
		const axis = new Vector3();
		// the wrist does not always hold the flask as upright as asked: what counts is that its mouth stays under the
		// tip, so where the mouth really is, against where it should be, moves the hand's target (as for pouring)
		const fix = new Vector3();
		const mouth = new Vector3();
		const top = this.L(node.name).profile.top;
		const to = () => {
			const a = this.swirlT * Math.PI * 2 * SWIRL.hz;
			const k = this.swirlK;
			const round = new Vector3(Math.cos(a) * SWIRL.r * k, 0.004 * k, Math.sin(a) * SWIRL.r * k);
			node.updateWorldMatrix(true, false);
			mouth.set(0, top, 0).applyMatrix4(node.matrixWorld);
			const miss = new Vector3(this.spot.x + round.x - mouth.x, 0, this.spot.z + round.z - mouth.z);
			fix.addScaledVector(miss, 0.2);
			if (fix.length() > 0.07) fix.setLength(0.07);
			// it leans outwards as it goes round, as a flask swirled by the neck does
			lean.setFromAxisAngle(axis.set(-Math.sin(a), 0, Math.cos(a)).negate(), SWIRL.lean * k);
			return this.hands.palmFor(side, this.spot.clone().add(round).add(fix), lean.clone().multiply(q0));
		};
		this.hands.exact(side, true);
		this.hands.drive(side, to, 30);
		this.swirlQ.copy(q0);
		await this.s.anim.wait(0.25);
	}

	private swirlQ = new Quaternion();

	private async stopSwirl() {
		const side = this.swirl;
		const node = this.swirlNode;
		if (!side || !node) return;
		const k0 = this.swirlK;
		this.stopping = true;
		await this.s.anim.run(0.3, (k) => (this.swirlK = k0 * (1 - k)));
		this.stopping = false;
		this.swirl = null;
		this.swirlNode = null;
		this.hands.exact(side, false);
		this.hands.drop(side, this.spot.clone(), this.swirlQ.clone());
		this.s.held.delete(node);
		await this.s.anim.wait(0.12);
	}

	private stopping = false;
	/** How far from the middle of the flask's mouth the last drop of indicator left the nozzle, metres (for the tests). */
	dropAt = 0;

	// the pipette

	/** How the pipette stands while it draws or empties: leaning a little towards its hand and away from the eyes. */
	private pipetteQ(side: Side, lean = 0.24, away = 0.14) {
		const axis = this.toHand(side, lean, 1, -away);
		const now = this.N('Pipette').getWorldQuaternion(new Quaternion());
		return new Quaternion().setFromUnitVectors(up.clone().applyQuaternion(now), axis).multiply(now);
	}

	/** The pipette's tip into the sample; then the wheel fills it (update). */
	private async dip(side: Side) {
		const h = this.hands;
		const b = this.N('SampleBeaker').getWorldPosition(new Vector3());
		const q = this.pipetteQ(side);
		const top = this.L('SampleBeaker').profile.top;
		const above = new Vector3(b.x, b.y + top + 0.03, b.z);
		const inside = new Vector3(b.x, b.y + 0.004, b.z);
		await h.carry(side, () => h.palmFor(side, above, q), 0.8, 0.05);
		await h.carry(side, () => h.palmFor(side, inside, q), 0.5);
		h.drive(side, () => h.palmFor(side, inside, q));
		this.drawing = side;
		this.drawPending = 0;
		this.say('info', '{Gira su} per far salire il campione. Se superi la tacca, {gira giù} e fallo scendere piano.');
	}

	/** The wheel on the pipette: how much is still to draw (or to let down), mL. */
	private pull(delta: number) {
		const most = Math.abs(delta) >= 50 ? 1.2 : 0.4;
		this.drawPending = Math.max(-most * 0.3, Math.min(most, this.drawPending - delta * 0.012));
	}

	private async confirmDraw() {
		const v = this.L('Pipette').contents.vol;
		if (Math.abs(v - SAMPLE) > 0.12) {
			this.say('warn', v < SAMPLE ? 'Il menisco è ancora sotto la tacca: aspira ancora un poco.' : 'Il menisco è sopra la tacca: lascia scendere il liquido goccia a goccia.');
			return;
		}
		const side = this.drawing!;
		this.drawing = null;
		this.drawPending = 0;
		// on the mark is 25.00 mL: what the lens let through either side stays in the beaker, or comes from it
		const pip = this.L('Pipette').contents;
		const src = this.L('SampleBeaker').contents;
		if (v > SAMPLE) src.add(pip.take(v - SAMPLE));
		else pip.add(src.take(SAMPLE - v));
		this.say('ok', 'Menisco sulla tacca: nella pipetta ci sono 25,0 mL del campione.');
		const h = this.hands;
		const b = this.N('SampleBeaker').getWorldPosition(new Vector3());
		const q = this.pipetteQ(side);
		await this.tool(side, new Vector3(b.x, b.y + this.L('SampleBeaker').profile.top + 0.04, b.z), q, 0.5);
		await this.free.away(side);
		await h.carry(side, () => this.free.hold(side), 0.5);
	}

	/** The pipette empties against the wall of a flask, or back into the sample. */
	private async drain(side: Side, into: Object3D) {
		const h = this.hands;
		const b = into.getWorldPosition(new Vector3());
		const q = this.pipetteQ(side, 0.14, 0.04);
		const prof = this.L(into.name).profile;
		const top = prof.top;
		// the tip against the wall on the side of the hand that holds the pipette, as far out as the mouth lets it
		const out = Math.max(0, Math.min(0.02, prof.radiusAt(top) - 0.007));
		const wall = this.toHand(side, 1, 0, 0).multiplyScalar(out);
		const at = (y: number) => new Vector3(b.x + wall.x, b.y + y, b.z + wall.z);
		const low = Math.max(0.012, top - 0.035);
		await h.carry(side, () => h.palmFor(side, at(top + 0.03), q), 0.8, 0.05);
		await h.carry(side, () => h.palmFor(side, at(low), q), 0.4);
		h.drive(side, () => h.palmFor(side, at(low), q));
		const pip = this.L('Pipette');
		const flask = into.userData.flask as FlaskId | undefined;
		await this.s.anim.until((dt) => {
			const c = pip.contents.take(Math.min(pip.contents.vol, 5.5 * dt));
			if (flask) apply(this.state, { type: 'sample', flask, ml: c.vol });
			else this.L(into.name).contents.add(c);
			return pip.contents.vol <= 0.001;
		});
		await this.s.anim.wait(0.3);
		await this.tool(side, at(top + 0.06), q, 0.4);
		await this.free.away(side);
		await h.carry(side, () => this.free.hold(side), 0.5);
		if (flask) this.say('ok', `Nella beuta ${flask} ci sono ${fmt(this.state.flasks[flask].vol, 1)} mL del campione. Ora l'indicatore.`);
	}

	/** The dropper bottle, upside down over the flask's mouth: one drop. */
	private async drip(side: Side, node: Object3D, flask: FlaskId) {
		const h = this.hands;
		const bottle = this.N('Indicator');
		const tipH = Number(bottle.userData.tip ?? 0.08);
		const b = node.getWorldPosition(new Vector3());
		const mouth = new Vector3(b.x, b.y + this.L(node.name).profile.top + 0.022, b.z);
		// its axis, from the base to the tip: tipped over towards the other side, the nozzle down, as far as a wrist turns
		const axis = this.toHand(side, -1, -0.62, 0.1);
		h.exact(side, true);
		const q = h.aim(side, axis, mouth);
		const origin = mouth.clone().addScaledVector(axis, -tipH);
		await this.free.above(side, origin.clone().add(new Vector3(0, 0.03, 0)), q, 0.6);
		await this.tool(side, origin, q, 0.25);
		// the wrist may hold it turned a little differently: the nozzle, not the base, is what must be over the mouth
		const nozzle = () => {
			bottle.updateWorldMatrix(true, false);
			return new Vector3(0, tipH, 0).applyMatrix4(bottle.matrixWorld);
		};
		origin.add(mouth.clone().sub(nozzle()));
		await this.tool(side, origin, q, 0.18);
		h.press(side, true);
		await this.s.anim.wait(0.16);
		const from = nozzle();
		this.dropAt = Math.hypot(from.x - mouth.x, from.z - mouth.z);
		this.s.drops.spawn(from, new Vector3(0, -0.1, 0), this.floorOf(node));
		apply(this.state, { type: 'indicator', flask, drops: 1 });
		const n = this.state.flasks[flask].drops;
		await this.s.anim.wait(0.22);
		h.press(side, false);
		await this.tool(side, origin.clone().add(new Vector3(0, 0.03, 0)), q, 0.2);
		await this.free.away(side);
		h.exact(side, false);
		await h.carry(side, () => this.free.hold(side), 0.4);
		if (n === 2) this.say('ok', 'Due gocce di fenolftaleina: la soluzione acida resta incolore.');
		else if (n === 5) {
			this.note("Troppa fenolftaleina in una beuta: è un acido debole, e consuma un po' di base", false);
			this.say('warn', "Bastano due gocce: l'indicatore è un acido debole, e in eccesso consuma un po' di base.");
		}
	}

	// the notebook: the readings and the sums are the student's

	/** The notebook's own pages for this experiment, and what it asks of the bench. */
	private book() {
		const ml: Omit<FieldDef, 'id'> = { kind: 'number', step: 0.05, decimals: 2, placeholder: '…' };
		const row = (n: number, name: string): (string | FieldDef)[] => [name, { id: `vi${n}`, ...ml }, { id: `vf${n}`, ...ml, seed: `vi${n}` }, { id: `v${n}`, ...ml }];
		const forms: BookPage[] = [
			{
				kind: 'form',
				id: 'letture',
				tab: 'Letture',
				title: 'Le letture della buretta',
				blocks: [
					{ type: 'burette' },
					{ type: 'table', head: ['Titolazione', 'V iniziale (mL)', 'V finale (mL)', 'NaOH usato (mL)'], rows: [row(1, 'Prova'), row(2, 'Seconda'), row(3, 'Terza')] },
					{
						type: 'swatches',
						title: 'La fenolftaleina nella beuta',
						items: [
							{ label: 'incolore', color: '#dfeaf0', note: "c'è ancora acido" },
							{ label: 'rosa pallido', color: '#f7c4dc', note: 'il viraggio' },
							{ label: 'fucsia', color: '#c4157c', note: 'troppa base' }
						]
					}
				]
			},
			{
				kind: 'form',
				id: 'conti',
				tab: 'Calcoli',
				title: "La concentrazione dell'acido",
				blocks: [
					{ type: 'text', text: 'HCl + NaOH → NaCl + H₂O: una mole di base per una di acido. Al punto equivalente le moli di NaOH scese dalla buretta sono quelle di HCl nella beuta.' },
					{ type: 'text', text: 'c(HCl) · 25,0 mL = 0,100 mol/L · V(NaOH)' },
					{
						type: 'fields',
						items: [
							{ label: 'Media delle due titolazioni accurate', field: { id: 'media', kind: 'number', unit: 'mL', step: 0.01, decimals: 2, width: 7 } },
							{ label: "Concentrazione dell'acido, c(HCl)", field: { id: 'conc', kind: 'number', unit: 'mol/L', step: 0.0001, decimals: 4, width: 8 } }
						]
					},
					{ type: 'heading', text: 'I passaggi' },
					{ type: 'lines', id: 'passaggi', rows: 12, placeholder: 'Scrivi qui i conti…' }
				]
			}
		];
		const nb = this.notebook;
		nb.setPages(bookOf('titolazione', forms));
		nb.live.burette = () => {
			const why = this.cannotRead();
			return why ? { why } : { level: this.state.burette.level };
		};
		nb.live.warn = () => (this.opening > 0 ? 'Il rubinetto della buretta è aperto: la soluzione sta scendendo.' : '');
		nb.blocked = (id) => this.blocked(id);
		nb.verify = (id, text) => this.judge(id, text);
	}

	/** Why the burette cannot be read now, or ''. */
	private cannotRead() {
		if (this.opening > 0) return 'Chiudi prima il rubinetto: il livello si legge fermo.';
		if (inBurette(this.state) <= 0.001) return 'La buretta è vuota.';
		if (!onScale(this.state)) return this.state.burette.level < 0 ? "Il menisco è sopra lo zero, dove non c'è scala: fai scendere un po' di soluzione nel becher degli scarti." : 'Il menisco è sotto la fine della scala: qui non si legge.';
		if (this.funnelOn()) return "Togli prima l'imbuto: una goccia che scende dall'imbuto cambierebbe il livello mentre leggi.";
		return '';
	}

	/** Q or E on the burette: the notebook, at the page of the readings, with the cursor in the blank that is next. */
	private openReadings() {
		const why = this.cannotRead();
		if (why) return this.say('info', why);
		if (this.hands.held('L') || this.hands.held('R')) return this.say('info', 'La lettura si scrive nel quaderno, e per scrivere servono le mani libere: posa quello che tieni.');
		const k = this.current;
		this.notebook.show('letture', k < this.runs.length ? `${this.runs[k].flask === null ? 'vi' : 'vf'}${k + 1}` : undefined);
		this.once('read', 'info', 'Leggi il fondo del menisco. La scala cresce verso il basso; tra due tacche stima la metà, 0,05 mL.');
	}

	/** Why a blank of the readings cannot be written in now (it is not its turn, or the burette cannot be read). */
	private blocked(id: string) {
		const m = /^(vi|vf)([123])$/.exec(id);
		if (!m) return '';
		const k = Number(m[2]) - 1;
		const cur = this.current;
		if (k > cur) return 'Questa riga è di una titolazione che non hai ancora cominciato.';
		if (k < cur) return 'Questa titolazione è finita: le sue letture non si cambiano.';
		const r = this.runs[k];
		if (m[1] === 'vi' && r.flask !== null) return 'La titolazione è cominciata: il volume iniziale si leggeva prima della prima goccia.';
		if (m[1] === 'vf' && r.flask === null) return 'Il volume finale si legge al viraggio: prima la titolazione.';
		const why = this.cannotRead();
		if (why) return why;
		if (m[1] === 'vf') {
			const f = this.state.flasks[r.flask!];
			// the scale can be looked at in the middle of a titration, but the final volume is the one at the end point
			if (!atEndPoint(f)) return f.base + f.fresh > f.acid ? "Il rosa c'è: agita ancora qualche secondo, deve restare uguale in tutta la soluzione." : 'La soluzione è ancora incolore: il volume finale si scrive al viraggio.';
		}
		return '';
	}

	/** What a value written in the notebook is worth: a reading against the meniscus, a sum against the student's own data. */
	private judge(id: string, text: string): Verdict {
		const v = parseNumber(text);
		const read = /^(vi|vf)([123])$/.exec(id);
		const calc = /^v([123])$/.exec(id);
		if (!read && !calc && id !== 'media' && id !== 'conc') return null;
		if (v === null) return { ok: false, hint: 'Scrivi un numero, con la virgola per i decimali.' };
		const wrong = (hint: string): Verdict => {
			this.miscalc++;
			this.note('Un calcolo sbagliato al primo tentativo', false);
			return { ok: false, hint };
		};
		if (read) return this.takeReading(Number(read[2]) - 1, read[1] as 'vi' | 'vf', v);
		if (calc) {
			const t = this.titre(Number(calc[1]) - 1);
			if (t === null) return { ok: false, hint: 'Prima servono le due letture di questa titolazione.' };
			return Math.abs(v - t) < 0.006 ? { ok: true } : wrong('Il NaOH usato è il volume finale meno quello iniziale.');
		}
		if (id === 'media') {
			const a = this.notebook.number('v2');
			const b = this.notebook.number('v3');
			if (a === null || b === null) return { ok: false, hint: 'Prima il NaOH usato nella seconda e nella terza titolazione, nella pagina delle letture.' };
			return Math.abs(v - (a + b) / 2) < 0.0076 ? { ok: true } : wrong('La media è la somma dei due volumi accurati divisa per due. La prova non conta.');
		}
		const mean = this.notebook.number('media');
		if (mean === null) return { ok: false, hint: 'Prima la media dei due volumi.' };
		return Math.abs(v - concentration(mean)) < 0.00011 ? { ok: true } : wrong('c(HCl) = 0,100 mol/L · V medio / 25,0 mL. Scrivila con quattro decimali.');
	}

	/** A reading written in the table, against the meniscus: taken if it is within half a division. */
	private takeReading(k: number, which: 'vi' | 'vf', v: number): Verdict {
		const level = this.state.burette.level;
		if (!readsRight(v, level)) {
			this.misread++;
			this.note('Una lettura della buretta sbagliata al primo tentativo', false);
			const far = Math.abs(v - level) > 0.3;
			return { ok: false, hint: far ? 'Non è questo. Parti dal numero sopra il menisco e conta le tacche in giù: 0,1 mL ciascuna.' : v < level ? 'Quasi: il fondo del menisco è un poco più in basso. Ogni tacca vale 0,1 mL.' : 'Quasi: il fondo del menisco è un poco più in alto. Ogni tacca vale 0,1 mL.' };
		}
		const r = this.runs[k];
		let hint: string;
		if (which === 'vi') {
			r.vi = v;
			hint = `Volume iniziale: ${fmt(v)} mL. Ora la titolazione.`;
		} else {
			r.vf = v;
			// a titration started without its first reading (the state allows it only from a saved game)
			if (r.vi === null) r.vi = 0;
			const f = this.state.flasks[r.flask!];
			const q = quality(f);
			const over = beyond(f);
			hint = k === 0 ? 'Ora sai dove cade il viraggio: le prossime due si fanno goccia a goccia.' : q === 'drop' ? "Rosa pallido con l'ultima goccia: viraggio preciso." : q === 'good' ? 'Viraggio superato di poco, due o tre gocce.' : `Il rosa è carico: hai superato il viraggio di circa ${fmt(over, 1)} mL.`;
			if (k > 0) this.note(q === 'drop' ? `${NAMES[k]} titolazione: viraggio preso con una goccia` : q === 'good' ? `${NAMES[k]} titolazione: viraggio superato di poco` : `${NAMES[k]} titolazione: viraggio superato di ${fmt(over, 1)} mL`, q === 'drop' || q === 'good');
		}
		this.page();
		return { ok: true, hint };
	}

	private finish() {
		const rows: [string, string][] = this.runs.map((r, k) => [`${k === 0 ? 'Prova' : `${k + 1}ª`} · beuta ${r.flask}`, `${fmt(r.vi!)} → ${fmt(r.vf!)} = ${fmt(this.titre(k)!)} mL`]);
		const a = this.titre(1)!;
		const b = this.titre(2)!;
		// the student's own mean and result, as written in the notebook
		const mean = this.notebook.number('media') ?? (a + b) / 2;
		const c = this.notebook.number('conc') ?? concentration(mean);
		const err = (Math.abs(c - this.state.cAcid) / this.state.cAcid) * 100;
		rows.push(['Media delle due accurate', `${fmt(mean)} mL`]);
		rows.push(['c(HCl), il tuo risultato', `${fmt(c, 4)} mol/L`]);
		rows.push(['Valore vero', `${fmt(this.state.cAcid, 4)} mol/L (errore ${fmt(err, 1)}%)`]);
		this.note(concordant(a, b) ? `Le due titolazioni accurate concordano entro ${fmt(CONCORDANT)} mL` : `Le due titolazioni accurate non concordano: ${fmt(Math.abs(a - b))} mL di differenza`, concordant(a, b));
		if (this.misread === 0) this.note('Tutte le letture della buretta giuste al primo tentativo', true);
		if (this.miscalc === 0) this.note('Tutti i calcoli giusti al primo tentativo', true);
		this.note(err <= 1 ? "Concentrazione trovata entro l'1% dal valore vero" : err <= 3 ? `Concentrazione trovata, errore: ${fmt(err, 1)}%` : `Concentrazione lontana dal valore vero, errore: ${fmt(err, 1)}%`, err <= 3);
		this.report = { rows, notes: [...this.notes.entries()].map(([text, good]) => ({ text, good })) };
		this.say('ok', `Il campione è acido cloridrico ${fmt(c, 4)} mol/L. Le beute titolate vanno nei rifiuti acquosi.`);
	}

	// ---------------------------------------------------------------------------------------------
	// every frame: the stopcock, the flasks, the levels, the notebook

	private update(dt: number) {
		const s = this.s;
		const st = this.state;
		this.notebook.update(dt);
		this.sayT = Math.max(0, this.sayT - dt);
		this.cockT += dt;

		// what a hand was doing ends if the thing is no longer in it
		if (this.swirl && this.hands.held(this.swirl) !== this.swirlNode) {
			this.swirl = null;
			this.swirlNode = null;
		}
		if (this.drawing && this.sideOf('Pipette') !== this.drawing) this.drawing = null;
		if (this.swirl && !this.stopping) {
			this.swirlT += dt;
			this.swirlK = Math.min(1, this.swirlK + dt / 0.35);
		}

		// the stopcock: nothing under it, or nothing that may be titrated, and it is shut
		if (this.opening > 0) {
			const why = this.cannotRun();
			if (why) {
				this.opening = 0;
				this.say('info', why);
			}
		}
		const r = rate(this.opening);
		const under = this.under();
		let stream = false;
		if (r > 0 && under) {
			if (r < DRIP) {
				this.dripT += (r * dt) / DROP;
				while (this.dripT >= 1 && this.opening > 0) {
					this.dripT -= 1;
					this.deliver(DROP, true);
				}
			} else {
				this.dripT = 0;
				this.deliver(r * dt, false);
				stream = this.opening > 0 && st.burette.air <= 0;
			}
		} else this.dripT = 0;
		if (stream && under) s.stream.set(this.tip, new Vector3(), this.floorOf(under), r * 0.6, CLEAR, 0.55);
		else if (this.streaming) s.stream.set(null, new Vector3(), 0, 0, CLEAR, 0);
		this.streaming = stream;
		const cock = s.nodes.get('BuretteCock');
		if (cock) cock.rotation.z = (this.opening > 0 ? 0.25 + 0.75 * this.opening : 0) * (Math.PI / 2);

		// a free hand on the stopcock while it is open, or has just been worked
		const want = this.opening > 0 || this.cockT < 0.7;
		if (this.cockHand && (this.hands.held(this.cockHand) || !this.hands.reaching(this.cockHand)) && this.cockT > 0.5) this.cockHand = null;
		if (want && !this.cockHand && cock && !this.free.getSnapshot().busy) {
			const order: Side[] = this.cockPref === 'L' ? ['L', 'R'] : ['R', 'L'];
			const side = order.find((x) => !this.hands.held(x) && x !== this.swirl && this.hands.distance(x, cock) <= REACH);
			if (side) {
				this.cockHand = side;
				void this.hands.reach(side, () => this.cockFrame(side, cock), curled(0.5), 0.3);
			}
		} else if (!want && this.cockHand) {
			const side = this.cockHand;
			this.cockHand = null;
			if (this.hands.reaching(side)) void this.hands.retire(side);
		}

		// the pipette fills from the sample, and empties back into it, at the pace of the wheel
		if (this.drawing) {
			const pip = this.L('Pipette');
			const src = this.L('SampleBeaker');
			if (this.drawPending > 0) {
				const d = Math.min(this.drawPending, 4 * dt, Math.max(0, 28.5 - pip.contents.vol));
				pip.contents.add(src.contents.take(d));
				this.drawPending -= d;
				if (pip.contents.vol >= 28.4) {
					this.drawPending = 0;
					this.say('warn', 'Fermati: il liquido non deve arrivare nella propipetta.');
				}
			} else if (this.drawPending < 0) {
				const d = Math.min(-this.drawPending, 1.2 * dt, pip.contents.vol);
				src.contents.add(pip.contents.take(d));
				this.drawPending += d;
				if (pip.contents.vol <= 0) this.drawPending = 0;
			}
		}

		// the flasks: what has fallen in mixes, and each shows its colour
		for (const id of FLASKS) {
			const node = this.flaskNodes.get(id)!;
			const swirled = this.swirlNode === node && this.swirlK > 0.5;
			apply(st, { type: 'mix', flask: id, dt, swirl: swirled });
			const f = st.flasks[id];
			const lq = this.L(node.name);
			lq.contents.vol = f.vol;
			const l = look(f);
			const tint = (lq.tint ??= { color: new Color(), opacity: 0.26 });
			// the first trace of pink is already plain to see, as it is against a white tile
			const seen = l.pink > 0.004 ? Math.min(1, 0.5 + l.pink * 1.8) : 0;
			tint.color.copy(CLEAR).lerp(PINK, seen);
			if (l.pink > 0.3) tint.color.lerp(FUCHSIA, Math.min(1, (l.pink - 0.3) / 0.6));
			tint.opacity = 0.26 + 0.2 * seen + 0.32 * l.pink;
			const cloud = this.clouds.get(id)!;
			cloud.visible = l.cloud > 0.01 && f.vol > 1;
			if (cloud.visible) {
				const rr = 0.006 + 0.011 * l.cloud;
				const a = swirled ? this.swirlT * Math.PI * 2 * SWIRL.hz * 0.6 : 0;
				// under the surface, where the base falls; swirled, it is drawn out round the flask
				cloud.scale.set(rr * (swirled ? 1.5 : 1), rr * 0.55, rr);
				cloud.rotation.y = -a;
				cloud.position.set(swirled ? Math.cos(a) * 0.008 : 0, lq.localLevel() - rr * 0.4, swirled ? Math.sin(a) * 0.008 : 0);
				(cloud.material as MeshBasicMaterial).opacity = 0.55 * Math.min(1, l.cloud * 1.6);
			}
		}
		// the burette's column and the waste, as the state has them
		const bl = this.L('Burette');
		const node = this.N('Burette');
		const z0 = Number(node.userData.zero);
		const z25 = Number(node.userData.full);
		const lv = st.burette.level;
		const y = lv <= BURETTE.scale ? z0 - (lv / BURETTE.scale) * (z0 - z25) : z25 - ((lv - BURETTE.scale) / BURETTE.below) * (z25 - bl.profile.bottom - 0.004);
		bl.contents.vol = lv >= emptyLevel - 1e-6 ? 0 : bl.profile.volumeBelow(y) * 1e6;
		this.L('WasteBeaker').contents.vol = st.waste;

		// the end point, said when it comes
		const k = this.current;
		if (k < this.runs.length && this.runs[k].flask !== null) {
			const f = st.flasks[this.runs[k].flask!];
			if (atEndPoint(f) && this.opening === 0) {
				const q = quality(f);
				this.once(`end${k}`, q === 'drop' || q === 'good' ? 'ok' : 'warn', q === 'drop' || q === 'good' ? 'Il rosa resta in tutta la soluzione: è il viraggio. Ferma la beuta e leggi il volume finale.' : 'La soluzione è fucsia: il viraggio è già passato. Leggi comunque il volume finale.');
			} else if (beyond(f) > -0.6 && beyond(f) < 0 && look(f).cloud > 0.3) this.once(`near${k}`, 'info', 'Il rosa tarda a sparire: il viraggio è vicino. Chiudi il rubinetto e continua una goccia alla volta.');
		}

		// the notebook ticks what the lab has reached
		for (const def of this.steps) for (const ph of def.phases) if (ph.once && !this.latched.has(ph) && ph.check()) this.latched.add(ph);
		let moved = false;
		for (let guard = 0; guard < 16 && !this.done && !this.free.getSnapshot().busy; guard++) {
			const def = this.steps[this.step];
			const ph = def.phases[this.phase];
			if (!(this.latched.has(ph) || ph.check())) break;
			ph.then?.();
			moved = true;
			if (this.phase < def.phases.length - 1) {
				this.phase++;
				continue;
			}
			this.step++;
			this.phase = 0;
			if (this.done) this.finish();
		}
		if (moved) {
			this.page();
			this.emit();
			if (this.done) this.free.openBook('steps');
		}
		this.emitT += dt;
		if (this.emitT > 0.15) {
			this.emitT = 0;
			this.emit();
		}
	}

	/** Where a hand is on the stopcock's handle: from its own side, fingers to the handle. */
	private cockFrame(side: Side, cock: Object3D) {
		const sign = side === 'R' ? 1 : -1;
		const at = cock.getWorldPosition(new Vector3());
		// the handle is on the student's side of the burette
		const yaw = this.s.player.yaw;
		const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
		const back = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
		// from its own side and a little above, so that it keeps clear of the hand on the flask
		const p = at.clone().addScaledVector(back, 0.06).addScaledVector(right, sign * 0.075).add(new Vector3(0, 0.022, 0));
		const F = back.clone().multiplyScalar(-0.55).addScaledVector(right, -sign).addScaledVector(up, -0.25).normalize();
		const N = back.clone().multiplyScalar(-1).addScaledVector(up, -0.5);
		return { p, q: frameFrom(F, N) };
	}
}
