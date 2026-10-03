import { ConeGeometry, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from 'three';
import type { LabScene } from './scene';
import { FreeLab, REACH, keyOf, type FreeSnapshot, type Use } from './free';
import type { Notebook, NotebookTask } from './notebook';
import { ease, orient } from './anim';
import type { Side } from './grasp';
import { SOLID_BULK, type LiquidBody } from './liquid';
import { SPATULA_AXIS } from './hands';

/*
 * The whole experiment, as a game: copper(II) sulfate crystals from copper(II) oxide and dilute sulfuric acid.
 *
 *   CuO(s) + H₂SO₄(aq) → CuSO₄(aq) + H₂O(l)
 *
 * The student works with two hands (free.ts): the mouse buttons take and put down, Q and E use the left and the
 * right hand. A tool in hand does something to what the crosshair points at, on its hand's key: the pipette draws
 * from the acid, the lighter lights the burner, the rod stirs. A free hand turns the gas tap and puts the goggles on,
 * on its key too; the wheel turns the air collar and sets the flame. Nothing tells the student what to press but the
 * prompt in the corner; what to do is in the notebook on the bench, which ticks each step off when the lab reaches
 * it, in whatever way it was reached.
 *
 * Under the steps runs a small simulation: the heat balance of what sits on the gauze, the rate at which the oxide
 * dissolves (faster when hot and stirred), the moles of acid and copper, filtration and evaporation. Times are
 * compressed: heating takes seconds, not minutes, and the crystals grow in a time-lapse.
 */

export type Readout = { label: string; value: string; tone?: 'hot' | 'ok' | 'warn' };

export type EsperimentoSnapshot = FreeSnapshot & {
	step: number;
	total: number;
	stepTitle: string;
	/** What to do now, in the notebook's words. */
	objective: string;
	readouts: Readout[];
	/** The pipette's neck against the mark, while it draws. */
	lens: { vol: number; offsetMm: number; ok: boolean } | null;
	goggles: boolean;
	/** 0 to 1 while the two days pass. */
	night: number;
	done: boolean;
};

/**
 * A phase is done when its `check` holds as the notebook reaches it. Two marks let the student work out of order:
 * `once` is something done once and for all, which counts from whenever it was done, even before its turn (the collar
 * closed to light the burner, though it is open again by the time the notebook gets there); `prep` is a preparation
 * for the phases after it in its step, taken as done when one of those is (`missed` then says how it was skipped).
 */
type Phase = { text: string; hint: string; check: () => boolean; then?: () => void; once?: boolean; prep?: boolean; missed?: () => void };
type StepDef = { id: string; title: string; why: string; phases: Phase[] };

const M_CUO = 79.55;
const M_PENTA = 249.68;
const PORTION = 0.5;
/** The oxide in the jar at the start, grams, and how far its surface is above the jar's bottom then, metres. */
const JAR = { grams: 100, depth: 0.037 };
const P_MAX = 420;
const LOSS = 2.8;
const HOT = 50;
/** From the upright shoulder to the mouth poured into: the pouring hand sits a little short of it. */
const POUR_REACH = 0.86;
const CONTAINERS = ['Beaker', 'AcidBeaker', 'ConicalFlask', 'EvapDish', 'Funnel'];

const up = new Vector3(0, 1, 0);
const fmt = (x: number, d = 1) => x.toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });

export class Esperimento {
	readonly free: FreeLab;
	private steps: StepDef[];
	private step = 0;
	private phase = 0;
	private listeners = new Set<() => void>();
	private snap: EsperimentoSnapshot;
	private emitT = 0;

	goggles = false;
	gas = 0.6;
	air = 0.5;
	gasOpen = false;
	lit = false;
	private leakT = 0;
	private leakWarned = false;
	private airHold = 0;
	private soot = 0;
	private sootWarned = false;
	private boilWarned = false;
	private notes = new Map<string, boolean>();
	/** The phases marked `once` that have been done, whenever that was. */
	private seen = new Set<Phase>();
	private portions = 0;
	/** The oxide left in the jar, grams: its surface goes down as the spatula takes from it. */
	private jar = JAR.grams;
	private full = false;
	/** Whether the spatula carries powder: the hand then holds it level (hands.ts, toolHold). */
	private get loaded() {
		return this.full;
	}
	private set loaded(on: boolean) {
		this.full = on;
		const sp = this.s.nodes.get('Spatula');
		if (sp) sp.userData.full = on;
	}
	private drawing: Side | null = null;
	private drawPending = 0;
	private measured = false;
	private poured = false;
	private evap0 = 0;
	private quality = 1;
	private rested = false;
	private night = 0;
	private cuInDish = 0;
	private cuoExcess = 0;
	private report: { rows: [string, string][]; notes: { good: boolean; text: string }[] } | null = null;
	private residue: Mesh;
	private sootDisc: Mesh;

	constructor(
		private s: LabScene,
		private notebook: Notebook
	) {
		this.free = new FreeLab(s, notebook);
		this.free.uses = (o) => this.uses(o);
		// the thermometer goes into a container held in the other hand too
		// and the spatula takes from the jar and tips into the beaker held in the other hand too
		this.free.together = (side, mine, other) => {
			if (mine.name === 'Thermometer' && (other.name === 'Beaker' || other.name === 'EvapDish')) return { verb: 'insert', text: 'Metti il termometro', run: () => this.thermometerInto(side, other) };
			if (mine.name === 'Spatula' && other.name === 'CuOJar' && !this.loaded) return this.scoopUse(side);
			if (mine.name === 'Spatula' && other.name === 'Beaker' && this.loaded) return this.dumpUse(side, other);
			return null;
		};
		this.free.refuse = (o) => this.refuse(o);
		// and while the pipette stands in the acid, the hand anchored to the beaker
		const busy = s.handsBusy;
		s.handsBusy = () => busy() || this.drawing !== null;
		for (const name of ['Bunsen', 'GasTap', 'Tripod']) {
			const n = s.nodes.get(name);
			if (n) n.userData.fixed = true;
		}
		const acid = this.L('AcidBeaker');
		acid.contents.vol = 40;
		acid.contents.acid = 0.04;
		// the black residue on the filter paper
		this.residue = new Mesh(new ConeGeometry(0.014, 0.022, 24, 1, true), new MeshStandardMaterial({ color: '#23201d', roughness: 1, side: 2 }));
		this.residue.rotation.x = Math.PI;
		this.residue.visible = false;
		this.residue.userData.noPick = true;
		s.nodes.get('Funnel')?.add(this.residue);
		// soot under the beaker, from a yellow flame
		this.sootDisc = new Mesh(new ConeGeometry(0.024, 0.0005, 32, 1, false), new MeshStandardMaterial({ color: '#0b0b0b', roughness: 1, transparent: true, opacity: 0 }));
		this.sootDisc.userData.noPick = true;
		this.sootDisc.position.y = -0.0003;
		s.nodes.get('Beaker')?.add(this.sootDisc);
		// in the funnel the paper holds the solid (the residue above): it does not settle in the stem
		this.L('Funnel').settles = false;

		const held = (name: string) => this.sideOf(name) !== null;
		const beaker = () => this.L('Beaker').contents;
		this.steps = [
			{
				id: 'goggles',
				title: 'Sicurezza',
				why: "L'acido solforico, anche diluito, irrita gli occhi: gli occhiali si indossano prima di toccare qualsiasi cosa sul banco.",
				phases: [{ text: 'Indossa gli occhiali di protezione.', hint: 'Sono sul banco, a sinistra. Puntali e premi {Q} o {E}: li indossa la mano sinistra o la destra.', check: () => this.goggles }]
			},
			{
				id: 'pipette',
				title: "Preleva l'acido",
				why: "La pipetta tarata misura un volume preciso. Il tecnico ha già versato un po' di acido in un becher: dalla bottiglia non si pipetta mai. Il fondo del menisco deve toccare la tacca.",
				phases: [
					{ text: 'Prendi la pipetta da 25 mL.', hint: 'È distesa sul banco, davanti a te.', check: () => held('Pipette'), prep: true },
					{ text: "Immergi la punta nell'acido.", hint: 'Con la pipetta in mano punta il becher piccolo con H₂SO₄ e premi il tasto della mano che la tiene: {Q} la sinistra, {E} la destra.', check: () => this.drawing !== null || this.measured, prep: true },
					{
						text: 'Aspira fino alla tacca dei 25 mL.',
						hint: "{Su}: la propipetta aspira. {Giù}: l'acido scende piano. Quando il menisco tocca la tacca premi il tasto della mano che tiene la pipetta.",
						check: () => this.measured
					}
				]
			},
			{
				id: 'transfer',
				title: "Trasferisci l'acido",
				why: 'La pipetta si svuota appoggiando la punta alla parete del becher. La goccia che resta nella punta non si soffia fuori: la taratura ne tiene conto.',
				phases: [
					{ text: 'Svuota la pipetta nel becher da 100 mL.', hint: 'Con la pipetta piena punta il becher vuoto e premi il tasto della mano che la tiene.', check: () => beaker().vol >= 24.5 },
					{ text: 'Appoggia la pipetta sul banco.', hint: 'Punta il banco e {clic con la} mano che la tiene.', check: () => !held('Pipette') }
				]
			},
			{
				id: 'setup',
				title: 'Prepara il riscaldamento',
				why: 'Il vetro non va mai sulla fiamma diretta: la reticella con il centro ceramico distribuisce il calore sul fondo del becher.',
				phases: [
					{ text: 'Metti il becher sulla reticella del treppiede.', hint: 'Prendi il becher, punta il centro della reticella e {clic} per appoggiarlo.', check: () => this.onGauze() === 'Beaker' },
					{ text: 'Metti il termometro nel becher.', hint: 'Prendi il termometro, punta il becher e premi il tasto della mano che lo tiene: {Q} la sinistra, {E} la destra.', check: () => this.thermoIn() === 'Beaker' }
				]
			},
			{
				id: 'light',
				title: 'Accendi il becco Bunsen',
				why: 'Si accende con la ghiera chiusa: la fiamma gialla si vede bene ed è stabile. Aprendo la ghiera entra aria, la combustione diventa completa e la fiamma azzurra è molto più calda.',
				phases: [
					{ text: "Chiudi la ghiera dell'aria del becco Bunsen.", hint: 'Punta il becco Bunsen e {gira giù}.', check: () => this.air < 0.1, once: true, prep: true, missed: () => this.note("Becco acceso con la ghiera dell'aria aperta", false) },
					{ text: 'Prendi l’accendigas.', hint: 'È sul banco, vicino al bordo.', check: () => held('Lighter'), once: true, prep: true },
					{ text: 'Apri il rubinetto del gas.', hint: 'Punta il rubinetto giallo dietro il becco e premi {Q} o {E}: lo gira la mano libera.', check: () => this.gasOpen, prep: true },
					{ text: "Accendi subito con l'accendigas.", hint: "Punta il becco Bunsen e premi il tasto della mano con l'accendigas: il gas non deve uscire a lungo senza fiamma.", check: () => this.lit },
					{ text: 'Apri la ghiera finché la fiamma diventa azzurra.', hint: 'Punta il becco Bunsen e {gira su}.', check: () => this.airHold > 0.6, once: true }
				]
			},
			{
				id: 'heat',
				title: "Scalda l'acido",
				why: "A freddo l'ossido di rame reagisce molto lentamente. Intorno ai 60 °C la reazione è rapida; l'acido però non deve bollire, perché schizza.",
				phases: [
					{
						text: 'Scalda fino a circa 60 °C.',
						hint: 'Guarda il termometro. Per regolare la fiamma punta il rubinetto e {gira}.',
						check: () => beaker().temp >= 55,
						once: true,
						then: () => this.say('ok', `L'acido è a ${fmt(beaker().temp, 0)} °C. Abbassa un po' la fiamma per restare tra 60 e 80 °C.`)
					}
				]
			},
			{
				id: 'react',
				title: "Aggiungi l'ossido di rame(II)",
				why: "L'ossido nero reagisce con l'acido e la soluzione diventa azzurra per gli ioni Cu²⁺. Si mette ossido in eccesso: quando resta polvere nera sul fondo, tutto l'acido ha reagito.",
				phases: [
					{
						text: "Aggiungi l'ossido con la spatola, una punta alla volta, e mescola finché resta polvere nera sul fondo.",
						hint: 'Con il tasto della mano che tiene la spatola ({Q} la sinistra, {E} la destra): sul barattolo prendi una punta, sul becher la versi. Poi con la bacchetta in mano, lo stesso tasto sul becher per mescolare.',
						check: () => {
							const b = beaker();
							const g = this.s.grains.get('Beaker');
							return b.acid < 0.0004 && b.solid > 0.15 && !!g && g.swirl < 0.05;
						},
						then: () => {
							this.note('Ossido aggiunto fino a lasciarne in eccesso', true);
							this.say('ok', "Resta polvere nera sul fondo anche mescolando: l'acido è finito e l'ossido in eccesso non reagisce più.");
						}
					}
				]
			},
			{
				id: 'off',
				title: 'Spegni il becco Bunsen',
				why: 'La fiamma si spegne chiudendo il gas al rubinetto, mai soffiandoci sopra.',
				phases: [{ text: 'Chiudi il rubinetto del gas.', hint: 'Punta il rubinetto e premi {Q} o {E} con una mano libera.', check: () => !this.gasOpen && !this.lit }]
			},
			{
				id: 'filter',
				title: 'Filtra',
				why: "La carta da filtro trattiene l'ossido di rame in eccesso; nella beuta passa solo la soluzione di solfato di rame, il filtrato.",
				phases: [
					{ text: "Piega la carta da filtro e mettila nell'imbuto.", hint: "Prendi la carta, punta l'imbuto sulla beuta e premi il tasto della mano che la tiene.", check: () => this.paperIn() },
					{
						text: "Versa la miscela nell'imbuto.",
						hint: "Il becher deve raffreddarsi un poco prima di prenderlo; togli il termometro. Poi punta l'imbuto e premi il tasto della mano che tiene il becher.",
						check: () => this.poured
					},
					{
						text: 'Aspetta che la soluzione passi nella beuta.',
						hint: 'Goccia dopo goccia: nel frattempo appoggia il becher.',
						check: () => this.L('Funnel').contents.vol <= 0.01 && this.L('ConicalFlask').contents.vol > 1,
						then: () => this.say('ok', `Filtrato raccolto: ${fmt(this.L('ConicalFlask').contents.vol, 1)} mL di soluzione azzurra limpida.`)
					}
				]
			},
			{
				id: 'evaporate',
				title: 'Concentra la soluzione',
				why: "Evaporando parte dell'acqua la soluzione diventa satura. Ci si ferma a circa un terzo del volume: se l'acqua evapora tutta resta una polvere, non dei cristalli.",
				phases: [
					{ text: "Togli l'imbuto dalla beuta e appoggialo.", hint: "Prendi l'imbuto e appoggialo sul banco.", check: () => !this.funnelOnFlask() && !held('Funnel') },
					{ text: 'Metti la capsula di porcellana sulla reticella.', hint: 'Prendila e appoggiala al centro della reticella.', check: () => this.onGauze() === 'EvapDish' },
					{
						text: 'Versa il filtrato nella capsula.',
						hint: 'Prendi la beuta, punta la capsula e premi il tasto della mano che la tiene.',
						check: () => this.L('EvapDish').contents.vol > 1 && this.L('ConicalFlask').contents.vol < 0.5,
						then: () => {
							this.evap0 = this.L('EvapDish').contents.vol;
							this.say('info', `Nella capsula ci sono ${fmt(this.evap0, 1)} mL di soluzione. Falla evaporare fino a circa ${fmt(this.evap0 / 3, 0)} mL.`);
						}
					},
					{ text: 'Apri il gas e riaccendi il becco Bunsen.', hint: "Il rubinetto con il tasto della mano libera, poi il becco con il tasto della mano che tiene l'accendigas.", check: () => this.lit },
					{
						text: 'Fai evaporare fino a circa un terzo del volume.',
						hint: 'Guarda il livello nella capsula; puoi alzare la fiamma dal rubinetto {con la rotella}.',
						check: () => this.evap0 > 0 && this.L('EvapDish').contents.vol <= this.evap0 / 3,
						then: () => {
							this.note('Evaporazione fermata a un terzo del volume', true);
							this.say('ok', 'Ora basta: la soluzione è quasi satura. Spegni il gas.');
						}
					},
					{ text: 'Spegni il gas.', hint: 'Punta il rubinetto e premi {Q} o {E}.', check: () => !this.gasOpen }
				]
			},
			{
				id: 'crystallize',
				title: 'Cristallizza',
				why: 'Raffreddandosi, la soluzione satura non tiene più disciolto tutto il solfato: si formano i cristalli azzurri di solfato di rame pentaidrato, CuSO₄·5H₂O.',
				phases: [{ text: 'Lascia riposare la capsula per due giorni.', hint: 'Punta la capsula e premi {Q} o {E}.', check: () => this.rested }]
			}
		];
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

	private build(): EsperimentoSnapshot {
		const def = this.steps[Math.min(this.step, this.steps.length - 1)];
		const pip = this.L('Pipette');
		const mark = Number(this.s.nodes.get('Pipette')?.userData.mark ?? 0.32);
		return {
			...this.free.getSnapshot(),
			step: this.step,
			total: this.steps.length,
			stepTitle: this.done ? 'Risultati' : def.title,
			objective: this.done ? 'Esperimento concluso' : def.phases[this.phase].text,
			readouts: this.readouts(),
			lens: this.drawing ? { vol: pip.contents.vol, offsetMm: (pip.localLevel() - mark) * 1000, ok: Math.abs(pip.contents.vol - 25) <= 0.12 } : null,
			goggles: this.goggles,
			night: this.night,
			done: this.done
		};
	}

	private readouts(): Readout[] {
		const out: Readout[] = [];
		const th = this.thermoIn();
		const g = this.onGauze();
		if (th) {
			const t = this.L(th).contents.temp;
			out.push({ label: 'Termometro', value: `${fmt(t, 0)} °C`, tone: t >= 90 ? 'warn' : t >= 50 ? 'hot' : undefined });
		}
		if (this.lit || this.gasOpen) out.push({ label: 'Fiamma', value: !this.lit ? 'gas senza fiamma' : this.air > 0.6 ? 'azzurra' : this.air > 0.3 ? 'poca aria' : 'gialla', tone: !this.lit ? 'warn' : undefined });
		const id = this.steps[this.step]?.id;
		if (g === 'EvapDish' && (id === 'evaporate' || id === 'crystallize')) {
			const d = this.L('EvapDish').contents;
			if (d.vol > 0) out.push({ label: 'Nella capsula', value: `${fmt(d.vol, 1)} mL` });
		}
		return out;
	}

	/** The notebook's pages: the step, why it is done so, its phases; at the end, the results. */
	private page() {
		if (this.report) {
			this.notebook.draw({
				kicker: 'Esperimento concluso',
				title: 'I tuoi cristalli',
				intro: 'Cristalli azzurri di CuSO₄·5H₂O: ogni unità di sale lega cinque molecole d’acqua, che danno il colore.',
				rows: this.report.rows,
				steps: 'Come è andata',
				tasks: this.report.notes.map((n) => ({ text: n.text, state: n.good ? 'done' : 'bad' })),
				hint: '',
				done: null
			});
			return;
		}
		const def = this.steps[this.step];
		const tasks: NotebookTask[] = def.phases.map((p, i) => ({ text: p.text, state: i < this.phase ? 'done' : i === this.phase ? 'now' : 'todo' }));
		this.notebook.draw({
			kicker: `Passo ${this.step + 1} di ${this.steps.length}`,
			title: def.title,
			intro: def.why,
			tasks,
			hint: def.phases[this.phase].hint,
			done: null
		});
	}

	private say(kind: 'info' | 'warn' | 'ok', text: string) {
		this.free.say(kind, text);
	}

	private note(text: string, good: boolean) {
		if (!this.notes.has(text)) this.notes.set(text, good);
	}

	private L(name: string): LiquidBody {
		return this.s.liquids.get(name)!;
	}

	private N(name: string): Object3D {
		return this.s.nodes.get(name)!;
	}

	private get hands() {
		return this.s.hands;
	}

	// ---------------------------------------------------------------------------------------------
	// where things are

	private sideOf(name: string): Side | null {
		if (this.hands.held('L')?.name === name) return 'L';
		if (this.hands.held('R')?.name === name) return 'R';
		return null;
	}

	/**
	 * The wheel on the pipette's filler: it asks for a little more acid, or a little less. What is asked and not yet
	 * drawn is kept small, so the pipette stops when the wheel does: a notch of a mouse wheel's worth, and for the
	 * fine steps of a trackpad a tenth of a second's. Without the limit a long swipe went on drawing after it ended.
	 */
	private pull(delta: number) {
		const up = Math.abs(delta) >= 50 ? 1.2 : 0.4;
		this.drawPending = Math.max(-up * 0.3, Math.min(up, this.drawPending - delta * 0.012));
	}

	/**
	 * A control a free hand works where it stands (the tap, the goggles): Q for the left hand and E for the right,
	 * each when it is free and reaches.
	 */
	private byHand(o: Object3D, verb: Use['verb'], text: string, run: (side: Side) => Promise<void> | void, exclusive = false): Use[] {
		const free = (['L', 'R'] as Side[]).filter((side) => !this.hands.held(side));
		if (!free.length) return (['Q', 'E'] as const).map((input) => ({ input, verb, text: 'Serve una mano libera', blocked: true, why: 'Ti serve una mano libera: appoggia qualcosa.', exclusive }));
		return free.map((side) =>
			this.hands.distance(side, o) <= REACH
				? { input: keyOf(side), verb, text, exclusive, run: () => run(side) }
				: { input: keyOf(side), verb, text: 'Troppo lontano', blocked: true, why: 'Non ci arrivi: avvicinati.', exclusive }
		);
	}

	/** What stands on the gauze. */
	private onGauze(): 'Beaker' | 'EvapDish' | null {
		const c = this.s.gauzeCenter;
		for (const name of ['Beaker', 'EvapDish'] as const) {
			const n = this.s.nodes.get(name);
			if (!n || this.s.held.has(n)) continue;
			const p = n.getWorldPosition(new Vector3());
			if (Math.hypot(p.x - c.x, p.z - c.z) < 0.04 && Math.abs(p.y - this.s.gauzeTop) < 0.012) return name;
		}
		return null;
	}

	private thermoIn(): string | null {
		const p = this.s.nodes.get('Thermometer')?.parent;
		return p && (p.name === 'Beaker' || p.name === 'EvapDish') ? p.name : null;
	}

	private paperIn() {
		return this.s.nodes.get('FilterPaper')?.parent?.name === 'Funnel';
	}

	/** The container the funnel rests in (free.ts, seat), or null: on the bench, or in a hand. */
	private funnelHost() {
		return this.free.hostOf(this.N('Funnel'))?.name ?? null;
	}

	private funnelOnFlask() {
		return this.funnelHost() === 'ConicalFlask';
	}

	private tempOf(name: string) {
		return this.s.liquids.get(name)?.contents.temp ?? 20;
	}

	private label(o: Object3D) {
		return (o.userData.label as string) ?? o.name;
	}

	/** «nel becher», «nella capsula»: where something goes, for the prompt. */
	private into(name: string) {
		return name === 'Funnel' ? "nell'imbuto" : name === 'EvapDish' ? 'nella capsula' : name === 'ConicalFlask' ? 'nella beuta' : 'nel becher';
	}

	// ---------------------------------------------------------------------------------------------
	// what can be done

	private refuse(o: Object3D): string | null {
		if (!this.goggles && o.name !== 'Goggles') return 'Prima indossa gli occhiali di protezione.';
		if (['Beaker', 'EvapDish'].includes(o.name) && this.tempOf(o.name) > HOT) return `Scotta: è a ${fmt(this.tempOf(o.name), 0)} °C. Aspetta che si raffreddi un poco.`;
		if (o.name === 'Funnel' && this.L('Funnel').contents.vol > 0.01) return "L'imbuto è ancora pieno: aspetta che il liquido passi.";
		return null;
	}

	/** The actions on what the crosshair points at, with what the hands hold. */
	private uses(o: Object3D | null): Use[] {
		const out: Use[] = [];
		const L = this.hands.held('L');
		const R = this.hands.held('R');
		const tool = (name: string) => this.sideOf(name);

		// filling the pipette: the wheel draws, F stops at the mark
		if (this.drawing) {
			const pip = this.L('Pipette');
			return [
				{ input: 'W', verb: 'draw', text: 'Aspira o lascia scendere', exclusive: true, target: `Pipetta · ${fmt(pip.contents.vol, 2)} mL`, wheel: (d) => this.pull(d) },
				{ input: keyOf(this.drawing), verb: 'confirm', text: 'Il menisco è sulla tacca', exclusive: true, run: () => this.confirmDraw() }
			];
		}
		if (!o) return out;
		const name = o.name;
		if (!this.goggles) {
			if (name === 'Goggles') out.push(...this.byHand(o, 'wear', 'Indossa', (side) => this.wear(side), true));
			return out;
		}

		// the gas tap: a free hand turns it, the wheel sets the flame
		if (name === 'GasTap' || name === 'GasTapHandle') {
			// the hand goes to the lever, on top
			out.push(...this.byHand(this.N('GasTapHandle'), 'turn', this.gasOpen ? 'Chiudi il gas' : 'Apri il gas', (side) => this.tap(side, !this.gasOpen)));
			if (this.gasOpen && this.lit) out.push({ input: 'W', verb: 'turn', text: 'Regola la fiamma', target: `Rubinetto del gas · fiamma ${Math.round(this.gas * 100)}%`, wheel: (d) => (this.gas = Math.max(0.15, Math.min(1, this.gas - d * 0.0012))) });
			return out;
		}

		// the burner: the wheel turns the air collar, the lighter lights it
		if (name === 'Bunsen' || name === 'BunsenCollar') {
			const lighter = tool('Lighter');
			if (lighter) out.push({ input: keyOf(lighter), verb: 'light', text: 'Accendi', run: () => this.strike(lighter) });
			out.push({ input: 'W', verb: 'turn', text: "Gira la ghiera dell'aria", target: `Becco Bunsen · aria ${Math.round(this.air * 100)}%`, wheel: (d) => (this.air = Math.max(0, Math.min(1, this.air - d * 0.0012))) });
			return out;
		}

		// what stands in a container (the paper in the funnel, the thermometer in the beaker) stands for it, for a tool
		const c = (name === 'FilterPaper' || name === 'Thermometer') && o.parent && CONTAINERS.includes(o.parent.name) ? o.parent : o;
		const cname = c.name;
		const on = c === o ? undefined : this.label(c);

		const pipette = tool('Pipette');
		if (pipette && CONTAINERS.includes(cname) && !this.s.held.has(c)) {
			const pip = this.L('Pipette').contents;
			if (cname === 'AcidBeaker' && pip.vol < 0.5) out.push({ target: on, input: keyOf(pipette), verb: 'draw', text: "Immergi nell'acido", run: () => this.dip(pipette) });
			else if (pip.vol >= 0.5 && cname !== 'Funnel')
				out.push({ target: on, input: keyOf(pipette), verb: 'pour', text: cname === 'AcidBeaker' ? "Rimetti l'acido" : `Svuota ${this.into(cname)}`, run: () => this.drain(pipette, c) });
			return out;
		}

		const thermo = tool('Thermometer');
		if (thermo && (cname === 'Beaker' || cname === 'EvapDish') && !this.s.held.has(c)) {
			out.push({ target: on, input: keyOf(thermo), verb: 'insert', text: 'Metti il termometro', run: () => this.thermometerInto(thermo, c) });
			return out;
		}

		const spatula = tool('Spatula');
		if (spatula) {
			if (cname === 'CuOJar' && !this.loaded) out.push({ target: on, input: keyOf(spatula), ...this.scoopUse(spatula) });
			if (cname === 'Beaker' && this.loaded) out.push({ target: on, input: keyOf(spatula), ...this.dumpUse(spatula, c) });
			if (out.length) return out;
		}

		const rod = tool('GlassRod');
		if (rod && CONTAINERS.includes(cname) && cname !== 'Funnel' && !this.s.held.has(c) && this.L(cname).contents.vol > 0.5) {
			out.push({ target: on, input: keyOf(rod), verb: 'stir', text: 'Mescola', run: () => this.free.stir(rod, c, 3) });
			return out;
		}

		const paper = tool('FilterPaper');
		if (paper && cname === 'Funnel' && !this.paperIn()) {
			out.push({ target: on, input: keyOf(paper), verb: 'fold', text: "Piega e metti nell'imbuto", run: () => this.fold(paper, c) });
			return out;
		}

		// pouring from a held container into one standing on the bench: each hand's container on its own key
		if (CONTAINERS.includes(cname) && !this.s.held.has(c)) {
			for (const side of ['L', 'R'] as Side[]) {
				const h = side === 'R' ? R : L;
				if (!h || h.name === 'Funnel' || h.name === 'Pipette' || !CONTAINERS.includes(h.name) || this.L(h.name).contents.vol < 0.3) continue;
				const into = this.into(cname);
				let why = '';
				const mouth = c.getWorldPosition(new Vector3()).add(new Vector3(0, this.L(cname).profile.top, 0));
				if (mouth.distanceTo(this.s.avatar.reachOrigin(side)) > POUR_REACH) why = 'Troppo lontano: avvicinati per versare.';
				else if (cname === 'Funnel' && !this.funnelHost()) why = "Prima metti l'imbuto su un recipiente.";
				else if (cname === 'Funnel' && !this.paperIn()) why = "Prima metti la carta da filtro nell'imbuto.";
				else if (h.name === 'ConicalFlask' && this.funnelOnFlask()) why = "Prima togli l'imbuto dalla beuta.";
				else if (h.name === 'Beaker' && this.thermoIn() === 'Beaker') why = 'Prima togli il termometro dal becher.';
				else if (cname === this.funnelHost()) why = "Qui si versa attraverso l'imbuto.";
				out.push({ target: on, input: keyOf(side), verb: 'pour', text: why ? why.replace(/\.$/, '') : `Versa ${into}`, blocked: !!why, why, run: () => this.pourInto(side, c) });
			}
			if (out.length) return out;
		}

		// the dish, once the solution is concentrated
		if (cname === 'EvapDish' && this.steps[this.step]?.id === 'crystallize' && !this.gasOpen) {
			for (const input of ['Q', 'E'] as const) out.push({ target: on, input, verb: 'wait', text: 'Lascia riposare due giorni', run: () => this.timelapse() });
		}
		return out;
	}

	// ---------------------------------------------------------------------------------------------
	// actions

	/** The goggles leave the bench and are on: no reach, the hand only comes up and goes back down. */
	private async wear(side: Side) {
		this.N('Goggles').visible = false;
		this.goggles = true;
		await this.hands.gesture(side);
		this.note('Occhiali indossati prima di iniziare', true);
		this.say('ok', 'Occhiali indossati. Ora puoi lavorare al banco.');
	}

	private async tap(side: Side, open: boolean) {
		// the lever turns by itself while the hand makes its gesture: no reach to it
		const handle = this.N('GasTapHandle');
		const a0 = handle.rotation.y;
		const a1 = open ? -Math.PI / 2 : 0;
		await Promise.all([this.hands.gesture(side), this.s.anim.run(0.45, (k) => (handle.rotation.y = a0 + (a1 - a0) * k))]);
		this.gasOpen = open;
		if (open) {
			this.leakT = 0;
			this.leakWarned = false;
			if (!this.lit) this.say('info', 'Il gas esce: accendi subito.');
		} else {
			if (this.lit) this.say('ok', 'Gas chiuso: la fiamma si spegne.');
			this.lit = false;
		}
	}

	/**
	 * A direction in the student's own terms, for a tool's axis from its tip to the hand: so much towards the side of
	 * the hand that holds it, so much up, so much back towards the student. Fixed in the room it would be right for one
	 * hand, facing one way.
	 */
	private toHand(side: Side, out: number, rise: number, back: number) {
		const yaw = this.s.player.yaw;
		const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
		const fwd = new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
		return right.multiplyScalar((side === 'R' ? 1 : -1) * out).addScaledVector(up, rise).addScaledVector(fwd, -back).normalize();
	}

	/**
	 * Takes the tool in `side`'s hand to a pose, its origin (the tip) at `at` and turned `q`, and keeps it there: left to
	 * itself between two moves, a hand goes back to where it holds things.
	 */
	private async tool(side: Side, at: Vector3, q: Quaternion, dur: number, lift = 0) {
		const to = () => this.hands.palmFor(side, at, q);
		this.hands.drive(side, to);
		await this.hands.carry(side, to, dur, lift);
	}

	/**
	 * The lighter's nozzle to the burner's mouth, under the gauze and between the tripod's legs: it comes in level from
	 * the side of the hand that holds it, a little from the student's side, with the wrist prone. From that side the
	 * wrist follows best: from straight in front the nozzle stayed 4 cm off.
	 */
	private async strike(side: Side) {
		const h = this.hands;
		const lighter = this.N('Lighter');
		const anchor = this.s.worldOf('FlameAnchor');
		const axis = this.toHand(side, 1, 0.1, 0.45);
		const tip = anchor.clone().addScaledVector(axis.clone().setY(0).normalize(), 0.012).add(new Vector3(0, 0.01, 0));
		h.exact(side, true);
		// the wrist prone: the back of the hand up
		const q = h.prone(side, axis);
		const back = tip.clone().addScaledVector(axis, 0.07);
		await this.tool(side, back, q, 0.6, 0.02);
		await this.tool(side, tip, q, 0.3);
		// the nozzle settles on the mouth before the spark
		await this.s.anim.wait(0.15);
		const lf = this.s.lighterFlame;
		const follow = () => {
			lighter.updateMatrixWorld();
			lf.group.position.set(0, 0, 0).applyMatrix4(lighter.matrixWorld);
		};
		// the thumb pushes the trigger in
		const trigger = this.s.nodes.get('LighterTrigger');
		h.press(side, true);
		if (trigger) trigger.position.z -= 0.003;
		lf.gas = 0.25;
		await this.s.anim.run(0.35, () => follow());
		const was = this.lit;
		if (this.gasOpen) {
			this.lit = true;
			this.s.flame.ignite();
		}
		await this.s.anim.run(0.25, () => follow());
		lf.gas = 0;
		h.press(side, false);
		if (trigger) trigger.position.z += 0.003;
		await this.tool(side, back, q, 0.25);
		h.drive(side, null);
		h.exact(side, false);
		await h.carry(side, () => this.free.hold(side), 0.5);
		if (!this.gasOpen) return this.say('info', 'Solo una scintilla: il gas è chiuso. Apri il rubinetto, poi accendi subito.');
		if (was) return;
		this.say('ok', this.air < 0.3 ? 'Acceso! La fiamma è gialla e tremolante: poca aria, combustione incompleta.' : 'Acceso!');
		this.note(this.leakT < 4 ? 'Acceso subito dopo aver aperto il gas' : 'Il gas è uscito a lungo prima di accendere', this.leakT < 4);
	}

	/**
	 * How the pipette stands while it draws or empties: leaning a little towards the hand that holds it and away from
	 * the eyes (`side` and `away`, as slopes), so the arm is not in front of the beaker. About its own axis it stays
	 * turned as the hand holds it: a turn fixed in the room asks the wrist for more than it has, and the hand, with the
	 * pipette, stops centimetres short of the beaker.
	 */
	private pipetteQ(side: Side, lean = 0.24, away = 0.14) {
		const yaw = this.s.player.yaw;
		const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
		const fwd = new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
		const axis = up.clone().addScaledVector(right, (side === 'R' ? 1 : -1) * lean).addScaledVector(fwd, away).normalize();
		const now = this.N('Pipette').getWorldQuaternion(new Quaternion());
		return new Quaternion().setFromUnitVectors(up.clone().applyQuaternion(now), axis).multiply(now);
	}

	/** The pipette's tip into the acid; then the wheel fills it (update). */
	private async dip(side: Side) {
		const h = this.hands;
		const acid = this.N('AcidBeaker').getWorldPosition(new Vector3());
		const q = this.pipetteQ(side);
		const above = new Vector3(acid.x, acid.y + 0.09, acid.z);
		const inAcid = new Vector3(acid.x, acid.y + 0.004, acid.z);
		await h.carry(side, () => h.palmFor(side, above, q), 0.8, 0.05);
		await h.carry(side, () => h.palmFor(side, inAcid, q), 0.5);
		h.drive(side, () => h.palmFor(side, inAcid, q));
		this.drawing = side;
		this.drawPending = 0;
		this.say('info', "{Gira su} per far salire l'acido. Se superi la tacca, {gira giù} e fallo scendere piano.");
	}

	private async confirmDraw() {
		const v = this.L('Pipette').contents.vol;
		if (Math.abs(v - 25) > 0.12) {
			this.say('warn', v < 25 ? 'Il menisco è ancora sotto la tacca: aspira ancora un poco.' : "Il menisco è sopra la tacca: lascia scendere l'acido goccia a goccia.");
			return;
		}
		const side = this.drawing!;
		this.drawing = null;
		this.measured = true;
		this.drawPending = 0;
		this.note('Volume di acido misurato con precisione sulla tacca', true);
		this.say('ok', 'Perfetto: 25,0 mL di H₂SO₄ 1 mol/L, cioè 25 mmol di acido.');
		const h = this.hands;
		const acid = this.N('AcidBeaker').getWorldPosition(new Vector3());
		const q = this.pipetteQ(side);
		await this.tool(side, new Vector3(acid.x, acid.y + 0.1, acid.z), q, 0.5);
		await this.free.away(side);
		await h.carry(side, () => this.free.hold(side), 0.5);
	}

	/** The pipette empties against the wall of a container. */
	private async drain(side: Side, into: Object3D) {
		const h = this.hands;
		const b = into.getWorldPosition(new Vector3());
		const q = this.pipetteQ(side, 0.14, 0.04);
		const top = this.L(into.name).profile.top;
		// the tip against the wall on the side of the hand that holds the pipette
		const yaw = this.s.player.yaw;
		const wall = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(side === 'R' ? 0.02 : -0.02);
		const at = (y: number) => new Vector3(b.x + wall.x, b.y + y, b.z + wall.z);
		await h.carry(side, () => h.palmFor(side, at(top + 0.03), q), 0.8, 0.05);
		await h.carry(side, () => h.palmFor(side, at(Math.max(0.012, top - 0.035)), q), 0.4);
		h.drive(side, () => h.palmFor(side, at(Math.max(0.012, top - 0.035)), q));
		const pip = this.L('Pipette');
		const dst = this.L(into.name);
		await this.s.anim.until((dt) => {
			dst.contents.add(pip.contents.take(Math.min(pip.contents.vol, 5.5 * dt)));
			return pip.contents.vol <= 0.001;
		});
		await this.s.anim.wait(0.3);
		await this.tool(side, at(top + 0.06), q, 0.4);
		await this.free.away(side);
		await h.carry(side, () => this.free.hold(side), 0.5);
		if (into.name === 'Beaker') this.say('ok', `Nel becher ci sono ${fmt(dst.contents.vol, 1)} mL di acido solforico 1 mol/L.`);
		else if (into.name === 'AcidBeaker') this.measured = false;
	}

	/** The thermometer leans in a container and stays there; a container held in the other hand comes to the middle first. */
	private async thermometerInto(side: Side, host: Object3D) {
		const hostSide = this.sideOf(host.name);
		const release = hostSide ? await this.free.present(hostSide) : null;
		const hp = host.getWorldPosition(new Vector3());
		// it leans on the rim towards the hand that holds it and a little away from the eyes, the bulb on the bottom at
		// the other side; inside the glass all the way (the wall less the thermometer's own radius)
		const prof = this.L(host.name).profile;
		const lean = this.toHand(side, 1, 0, -0.5);
		const rim = Math.max(0.004, prof.radiusAt(prof.top) - 0.006);
		const foot = Math.min(0.012, Math.max(0, prof.radiusAt(prof.bottom + 0.006) - 0.008));
		const bulb = hp.clone().addScaledVector(lean, -foot).add(new Vector3(0, prof.bottom + 0.003, 0));
		const axis = hp.clone().addScaledVector(lean, rim).add(new Vector3(0, prof.top, 0)).sub(bulb).normalize();
		const h = this.hands;
		const t = this.N('Thermometer');
		h.exact(side, true);
		const q = h.aim(side, axis, bulb);
		// its tip comes over the middle of the mouth and goes down from there to its place, so it never crosses the glass
		const above = new Vector3(hp.x, hp.y + prof.top + 0.05, hp.z);
		await this.free.above(side, above, q, 0.8);
		h.drive(side, null);
		// where it stands in the container, in the container's own frame: one held in a hand moves a little meanwhile
		host.updateMatrixWorld(true);
		const local = { p: bulb.clone().applyMatrix4(host.matrixWorld.clone().invert()), q: host.getWorldQuaternion(new Quaternion()).invert().multiply(q) };
		await h.place(side, bulb, q);
		h.exact(side, false);
		this.s.held.delete(t);
		host.attach(t);
		if (release) {
			t.position.copy(local.p);
			t.quaternion.copy(local.q);
			release();
		}
		this.say('info', `Il termometro segna ${fmt(this.L(host.name).contents.temp, 0)} °C.`);
	}

	/**
	 * The spatula's scoop opens towards its local -Z. At work it lies level, in line with the forearm (the handle
	 * towards the hand and the student), the scoop open upwards; `roll` turns it over about its own axis, the way the
	 * forearm turns the palm down. The hand holds it along the fingers (grip.ts, WAND), and so can follow the whole turn.
	 */
	private spatulaLevel(side: Side, roll = 0) {
		const axis = this.toHand(side, SPATULA_AXIS.out, -0.04, SPATULA_AXIS.back);
		return new Quaternion().setFromAxisAngle(axis, (side === 'R' ? 1 : -1) * roll).multiply(orient(axis, new Vector3(0, -1, 0)));
	}

	/** Taking oxide from the jar: not from an empty one. */
	private scoopUse(side: Side): Omit<Use, 'input'> {
		const why = this.jar < PORTION ? 'Il barattolo è vuoto.' : '';
		return { verb: 'scoop', text: why ? 'Il barattolo è vuoto' : 'Prendi una punta di ossido', blocked: !!why, why, run: () => this.scoop(side) };
	}

	/** Tipping it into the beaker: not once the powder or the liquid is up to the rim. */
	private dumpUse(side: Side, into: Object3D): Omit<Use, 'input'> {
		const b = this.L(into.name);
		const why = Math.max(b.bedVol, b.filled) + PORTION / SOLID_BULK > b.capacity * 0.97 ? 'Il becher è pieno fino all’orlo.' : '';
		return { verb: 'scoop', text: why ? 'Il becher è pieno' : "Versa l'ossido", blocked: !!why, why, run: () => this.dump(side, into) };
	}

	/** The jar's powder, as low as what is left of it; gone when the jar is empty. */
	private jarLevel() {
		const pw = this.N('CuOJar').getObjectByName('CuOPowder');
		if (!pw) return;
		if (pw.userData.y0 === undefined) pw.userData.y0 = pw.position.y;
		pw.position.y = (pw.userData.y0 as number) - this.jarDrop();
		pw.visible = this.jar >= PORTION;
	}

	/** How far the powder's surface has gone down in the jar, metres. */
	private jarDrop() {
		return JAR.depth * (1 - this.jar / JAR.grams);
	}

	/** The scoop goes down into the powder, the handle up and back towards the hand, and comes out level and full. */
	private async scoop(side: Side) {
		const h = this.hands;
		// a jar held in the other hand comes to the middle first, its mouth tipped towards the spatula: so near the
		// body the hand cannot come down into it from above
		const jarSide = this.sideOf('CuOJar');
		const release = jarSide ? await this.free.present(jarSide, 0.06, this.toHand(side, 0.45, 0, 0.9).multiplyScalar(0.9)) : null;
		const jarNode = this.N('CuOJar');
		jarNode.updateMatrixWorld(true);
		const jar = jarNode.getWorldPosition(new Vector3());
		// the spatula works along the jar's own axis
		const along = up.clone().transformDirection(jarNode.matrixWorld);
		const lean = new Quaternion().setFromUnitVectors(up, along);
		const at = (y: number) => jar.clone().addScaledVector(along, y);
		h.exact(side, true);
		const level = this.spatulaLevel(side);
		const dip = lean.clone().multiply(orient(this.toHand(side, 0.3, 0.75, 0.6), new Vector3(0, -1, 0)));
		await this.free.above(side, at(0.11), dip, 0.7);
		// a moment over the mouth: the tip settles on the jar's axis before it goes down
		await this.s.anim.wait(0.15);
		// as far down as the powder now is
		const drop = this.jarDrop();
		const fill = () => {
			this.N('SpatulaPowder').visible = true;
			this.loaded = true;
			this.jar = Math.max(0, this.jar - PORTION);
			this.jarLevel();
		};
		if (jarSide) {
			// the two hands meet: the spatula stays over the mouth and the jar comes up round its tip, then down again.
			// Where the tip really is sets where the jar goes, so the tip stays on the jar's axis whatever the wrist does
			const sp = this.N('Spatula');
			const q = jarNode.getWorldQuaternion(new Quaternion());
			let depth = 0.11;
			h.drive(jarSide, () => h.palmFor(jarSide, sp.getWorldPosition(new Vector3()).addScaledVector(along, -depth), q));
			await this.s.anim.run(0.6, (k) => (depth = 0.11 - (0.045 + drop) * k), ease.inOut);
			fill();
			await this.s.anim.run(0.5, (k) => (depth = 0.065 - drop + (0.075 + drop) * k), ease.inOut);
			await this.tool(side, sp.getWorldPosition(new Vector3()), level, 0.4);
		} else {
			await this.tool(side, at(0.04 - drop), dip, 0.5);
			fill();
			await this.tool(side, at(0.13), dip, 0.45);
			await this.tool(side, at(0.14), level, 0.4);
		}
		await this.free.away(side);
		h.exact(side, false);
		release?.();
		if (jarSide) h.drive(jarSide, null);
		await h.carry(side, () => this.free.hold(side), 0.5);
	}

	/**
	 * Level over the mouth of the container, then the forearm turns the palm down and the spatula rolls over about its
	 * own axis, well past a quarter turn: the powder falls when the scoop is past upright. Then back.
	 */
	private async dump(side: Side, into: Object3D) {
		const h = this.hands;
		// a beaker held in the other hand comes to the middle first
		const hostSide = this.sideOf(into.name);
		const release = hostSide ? await this.free.present(hostSide) : null;
		const bk = into.getWorldPosition(new Vector3());
		const top = this.L(into.name).profile.top;
		const over = new Vector3(bk.x, bk.y + top + 0.022, bk.z);
		const TURN = (150 * Math.PI) / 180;
		h.exact(side, true);
		await this.free.above(side, over, this.spatulaLevel(side), 0.7);
		let roll = 0;
		h.drive(side, () => h.palmFor(side, over, this.spatulaLevel(side, roll)));
		const sp = this.N('Spatula');
		const beaker = this.L(into.name);
		let fell = false;
		await this.s.anim.run(
			0.7,
			(k) => {
				roll = TURN * k;
				// past upright the powder cannot stay on the scoop: by where the scoop really is (the hand trails the
				// pose asked of it), or at the end of the turn
				sp.updateMatrixWorld();
				const open = new Vector3(0, 0, -1).transformDirection(sp.matrixWorld).y;
				if (!fell && (open < -0.17 || k >= 1)) {
					fell = true;
					this.N('SpatulaPowder').visible = false;
					this.loaded = false;
					// the middle of the scoop, along the spatula's axis
					const origin = new Vector3(0, 0.012, 0).applyMatrix4(sp.matrixWorld);
					for (let i = 0; i < 26; i++) {
						const p = origin.clone().add(new Vector3((Math.random() - 0.5) * 0.006, (Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.006));
						this.s.powder.spawn(p, new Vector3((Math.random() - 0.5) * 0.05, -Math.random() * 0.1, (Math.random() - 0.5) * 0.05), beaker.level());
					}
				}
			},
			ease.inOut
		);
		await this.s.anim.wait(0.35);
		beaker.contents.solid += PORTION;
		this.portions++;
		// and back, the scoop open upwards again
		await this.s.anim.run(0.55, (k) => (roll = TURN * (1 - k)), ease.inOut);
		await this.free.away(side);
		h.exact(side, false);
		release?.();
		await h.carry(side, () => this.free.hold(side), 0.5);
		// how much has gone in so far, so that each spatula is seen to count; what to do with it, the first times
		const so = `${this.portions === 1 ? 'Una punta di spatola' : `${this.portions} punte di spatola`}: ${fmt(this.portions * PORTION, 1)} g di ossido nel becher.`;
		const tip = beaker.contents.temp < 40 ? 'A freddo reagisce poco: scalda e mescola.' : 'Mescola con la bacchetta: la polvere nera scompare e la soluzione si colora di azzurro.';
		this.say('info', this.portions <= 3 ? `${so} ${tip}` : so);
	}

	/** The paper folds into a cone over the funnel and goes in. */
	private async fold(side: Side, funnel: Object3D) {
		const h = this.hands;
		const paper = this.N('FilterPaper');
		const sheet = this.N('FilterPaperSheet') as Mesh;
		const apex = funnel.getWorldPosition(new Vector3()).add(new Vector3(0, 0.005, 0));
		const fq = funnel.getWorldQuaternion(new Quaternion());
		const above = apex.clone().add(new Vector3(0, 0.1, 0));
		await h.carry(side, () => h.palmFor(side, above, fq), 0.8, 0.04);
		const infl = sheet.morphTargetInfluences;
		await this.s.anim.run(0.9, (k) => {
			if (infl) infl[0] = k;
		});
		await h.place(side, apex, fq);
		this.s.held.delete(paper);
		funnel.attach(paper);
		// from now on it is part of the funnel: the crosshair on it takes the funnel
		paper.userData.partOf = 'Funnel';
		this.say('info', "La carta piegata in quattro forma un cono: da un lato tre strati, dall'altro uno.");
	}

	private async pourInto(side: Side, to: Object3D) {
		const from = this.hands.held(side)!;
		const fromName = from.name;
		await this.free.pour(side, to);
		if (to.name === 'Funnel' && fromName === 'Beaker') {
			const bk = this.L('Beaker');
			this.cuoExcess += this.L('Funnel').contents.solid;
			bk.contents.solid = 0;
			const g = this.s.grains.get('Beaker');
			if (g) g.grams = 0;
			if (bk.contents.vol < 1) {
				this.poured = true;
				this.say('info', 'La soluzione azzurra passa attraverso la carta; la polvere nera resta nel filtro.');
			}
		}
	}

	private async timelapse() {
		const s = this.s;
		const dish = this.L('EvapDish');
		const c = dish.contents;
		this.cuInDish = c.cu;
		const v0 = c.vol;
		const cu0 = c.cu;
		const hour = this.N('ClockHour');
		const minute = this.N('ClockMinute');
		const second = this.N('ClockSecond');
		this.say('info', 'Due giorni dopo…');
		await s.anim.run(
			10,
			(k) => {
				const hr = 10 + 48 * k;
				hour.rotation.z = -((hr % 12) / 12) * Math.PI * 2;
				minute.rotation.z = -(hr % 1) * Math.PI * 2;
				second.rotation.z = -((hr * 60) % 1) * Math.PI * 2;
				const day = Math.max(0, Math.cos(((hr - 13) / 24) * Math.PI * 2));
				const light = Math.min(1, day * 1.6);
				s.look?.daylight(light);
				this.night = 1 - light;
				s.crystals.set(k, this.quality);
				// the mother liquor evaporates and is finally poured off, leaving the crystals
				c.vol = v0 * (1 - 0.82 * k);
				c.cu = cu0 * (1 - 0.72 * k * this.quality);
				c.temp = 20;
			},
			ease.linear
		);
		second.rotation.z = 0;
		s.look?.daylight(1);
		this.night = 0;
		this.rested = true;
		this.finish();
	}

	private finish() {
		const theoretical = 0.025 * M_PENTA;
		const obtained = this.cuInDish * 0.72 * this.quality * M_PENTA;
		const f = (x: number, d = 2) => fmt(x, d);
		this.report = {
			rows: [
				['Acido solforico', '25 mmol'],
				['Ossido di rame aggiunto', `${f(this.portions * PORTION, 1)} g`],
				['Ossido in eccesso, nel filtro', `${f(this.cuoExcess, 2)} g`],
				['Resa teorica', `${f(theoretical)} g`],
				['Cristalli ottenuti', `${f(obtained)} g, ${f((obtained / theoretical) * 100, 0)}%`]
			],
			notes: [...this.notes.entries()].map(([text, good]) => ({ text, good }))
		};
		this.say('ok', 'Ecco i tuoi cristalli di solfato di rame pentaidrato!');
	}

	// ---------------------------------------------------------------------------------------------
	// simulation

	private update(dt: number) {
		const s = this.s;
		this.notebook.update(dt);
		s.flame.gas = this.lit ? this.gas : 0;
		s.flame.air = this.air;
		const collar = s.nodes.get('BunsenCollar');
		if (collar) collar.rotation.y = (1 - this.air) * Math.PI * 0.6;

		// gas escaping unlit
		if (this.gasOpen && !this.lit) {
			this.leakT += dt;
			if (this.leakT > 6 && !this.leakWarned) {
				this.leakWarned = true;
				this.note('Il gas è uscito a lungo prima di accendere', false);
				this.say('warn', 'Il gas sta uscendo senza fiamma! Accendi subito o chiudi il rubinetto.');
			}
		}

		// the pipette fills from the acid, and empties back into it, at the pace of the wheel
		if (this.drawing) {
			const pip = this.L('Pipette');
			const acid = this.L('AcidBeaker');
			if (this.drawPending > 0) {
				const d = Math.min(this.drawPending, 4 * dt, Math.max(0, 28.5 - pip.contents.vol));
				pip.contents.add(acid.contents.take(d));
				this.drawPending -= d;
				if (pip.contents.vol >= 28.4) {
					this.drawPending = 0;
					this.say('warn', "Fermati: l'acido non deve arrivare nella propipetta.");
				}
			} else if (this.drawPending < 0) {
				const d = Math.min(-this.drawPending, 1.2 * dt, pip.contents.vol);
				acid.contents.add(pip.contents.take(d));
				this.drawPending += d;
				if (pip.contents.vol <= 0) this.drawPending = 0;
			}
		}

		// heat balance of each vessel with liquid
		const gauze = this.onGauze();
		for (const [name, lq] of s.liquids) {
			const c = lq.contents;
			if (c.vol <= 0 || !CONTAINERS.includes(name)) continue;
			const heated = gauze === name && this.lit;
			const P = heated ? P_MAX * this.gas * (0.45 + 0.55 * this.air) : 0;
			const C = c.vol * 4.18 + (name === 'EvapDish' ? 60 : 30);
			// off the flame, time runs faster: the student does not wait minutes for glass to cool
			const loss = heated ? LOSS : LOSS * 3;
			c.temp += ((P - loss * (c.temp - 20)) / C) * dt;
			let evap = 0;
			if (c.temp >= 100) {
				c.temp = 100;
				const excess = P - LOSS * 80;
				if (excess > 0) evap = (excess / 2260) * 12;
			} else if (c.temp > 60) evap = 0.012 * ((c.temp - 60) / 40);
			if (evap > 0) c.vol = Math.max(0.05, c.vol - evap * dt);
			const bub = s.bubbles.get(name);
			if (bub) bub.rate = c.temp > 92 ? (c.temp - 92) * 5 + (c.temp >= 100 ? 40 : 0) : 0;
			if (gauze === name) {
				s.steam.source.copy(lq.node.getWorldPosition(new Vector3()));
				s.steam.source.y = lq.level() + 0.004;
				s.steam.radius = lq.profile.radiusAt(lq.localLevel()) * 0.7;
				s.steam.rate = c.temp > 55 ? ((c.temp - 55) / 45) * 22 + (c.temp >= 100 ? 25 : 0) : 0;
				if (heated && this.air < 0.35) {
					this.soot += dt * 0.05;
					if (this.soot > 0.25 && !this.sootWarned) {
						this.sootWarned = true;
						this.note('Scaldato con la fiamma gialla: fuliggine sul fondo', false);
						this.say('warn', "La fiamma gialla scalda poco e sporca il fondo di fuliggine: apri la ghiera dell'aria.");
					}
				}
				const id = this.steps[this.step]?.id;
				if (name === 'Beaker' && c.temp >= 99.5 && (id === 'heat' || id === 'react') && !this.boilWarned) {
					this.boilWarned = true;
					this.note("L'acido ha bollito e ha schizzato", false);
					this.say('warn', "L'acido bolle e schizza! Abbassa subito la fiamma dal rubinetto.");
				}
			}
		}
		if (!gauze) s.steam.rate = 0;
		(this.sootDisc.material as MeshStandardMaterial).opacity = Math.min(0.85, this.soot);
		if (s.gauzeMat) {
			const target = this.lit && gauze !== null ? s.flame.reach * (0.5 + 1.8 * this.air) * this.gas : this.lit ? s.flame.reach * this.gas : 0;
			s.gauzeMat.emissiveIntensity += (target - s.gauzeMat.emissiveIntensity) * Math.min(1, dt * 1.5);
		}

		// the reaction in the beaker
		const b = this.L('Beaker');
		const bc = b.contents;
		const grains = s.grains.get('Beaker');
		if (grains) {
			if (bc.solid > 0 && bc.acid > 0) {
				const k = 0.04 * Math.exp((bc.temp - 20) / 18) * (0.25 + 2.6 * grains.swirl);
				const dm = Math.min(bc.solid, k * dt, bc.acid * M_CUO);
				bc.solid -= dm;
				bc.acid -= dm / M_CUO;
				bc.cu += dm / M_CUO;
				if (bc.acid < 1e-6) bc.acid = 0;
			}
			grains.grams = bc.solid;
			b.murk = grains.swirl * Math.min(1, bc.solid / 0.25);
		}

		// the thermometer's column
		const th = s.nodes.get('Thermometer');
		const col = s.nodes.get('ThermoColumn');
		const inside = this.thermoIn();
		if (th && col) {
			const T = inside ? this.L(inside).contents.temp : 20;
			const shown = col.userData.shown ?? 20;
			const v = shown + (T - shown) * Math.min(1, dt * 3);
			col.userData.shown = v;
			col.scale.y = Number(th.userData.h0) + v * Number(th.userData.k);
		}

		// filtration: the funnel drains into the container it rests in, while there is room
		const fl = this.L('Funnel');
		const under = fl.contents.vol > 0 ? this.funnelHost() : null;
		if (under) {
			const flask = this.L(under);
			const moved = fl.contents.take(Math.min(fl.contents.vol, 1.8 * dt, Math.max(0, flask.capacity * 0.95 - flask.contents.vol)));
			flask.contents.add(moved);
			if (Math.random() < 0.5) {
				const tip = this.N('Funnel').getWorldPosition(new Vector3()).add(new Vector3(0, -0.07, 0));
				s.drops.spawn(tip, new Vector3(0, -0.05, 0), flask.level());
			}
		}
		this.residue.visible = fl.contents.solid > 0.01;
		if (this.residue.visible) {
			const k = Math.min(1, 0.5 + fl.contents.solid);
			this.residue.scale.setScalar(k);
			this.residue.position.y = 0.017 * k;
		}

		// the flame, blue once the collar is open
		const id = this.steps[this.step]?.id;
		this.airHold = this.lit && this.air >= 0.72 ? this.airHold + dt : 0;
		if (id === 'evaporate' && this.evap0 > 0 && this.quality === 1) {
			const d = this.L('EvapDish').contents;
			if (d.vol < this.evap0 * 0.2) {
				this.quality = 0.55;
				this.note('Evaporato troppo: cristalli piccoli e crosta sul bordo', false);
				this.say('warn', 'Stai evaporando troppo: si forma una crosta sul bordo. Spegni il gas!');
			}
		}

		// what is done once and for all counts from now on, wherever the notebook is
		for (const st of this.steps) for (const ph of st.phases) if (ph.once && !this.seen.has(ph) && ph.check()) this.seen.add(ph);
		// the notebook ticks what the lab has reached, in order
		const holds = (ph: Phase) => this.seen.has(ph) || ph.check();
		let moved = false;
		for (let guard = 0; guard < 12 && !this.done && !this.free.getSnapshot().busy; guard++) {
			const phases = this.steps[this.step].phases;
			const ph = phases[this.phase];
			if (!holds(ph)) {
				// a preparation skipped, when what it prepared is done already
				if (!ph.prep || !phases.slice(this.phase + 1).some((x) => !x.prep && holds(x))) break;
				ph.missed?.();
			} else ph.then?.();
			moved = true;
			if (this.phase < this.steps[this.step].phases.length - 1) this.phase++;
			else {
				this.step++;
				this.phase = 0;
			}
		}
		if (moved) {
			this.page();
			this.emit();
			if (this.done) this.notebook.open = true;
		}

		this.emitT += dt;
		if (this.emitT > 0.15) {
			this.emitT = 0;
			this.emit();
		}
	}
}
