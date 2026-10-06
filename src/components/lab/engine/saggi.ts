import { CanvasTexture, Color, DoubleSide, Group, type Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, MultiplyBlending, Object3D, Path, Quaternion, Shape, ShapeGeometry, SRGBColorSpace, Vector3 } from 'three';
import type { LabScene } from './scene';
import { FreeLab, REACH, keyOf, type Use } from './free';
import type { BookPage, Notebook, NotebookTask, Verdict } from './notebook';
import { bookOf } from '../quaderno/pagine';
import type { Side } from './grasp';
import { orient } from './anim';
import { Plume } from './effects';
import type { EsperimentoSnapshot, Readout } from './esperimento';
import { ANSWERS, CLEAN, IONS, KNOWN, apply, dirt, emission, initial, isClean, seenAs, tainted, truth, verdict, type Ion, type SaggiState, type SampleId } from '@/lib/lab/saggi';

/*
 * The flame tests, as a game: seven known salts, a mixture and two unknown samples, a nichrome wire loop and the
 * burner's blue flame.
 *
 * The student works with the two hands of the free lab (free.ts). The loop in a hand does something to what the
 * crosshair points at, on its hand's key: into the acid, onto a salt, into the flame, where it stays until the same
 * key takes it out. The cobalt glass in the other hand is raised in front of the eyes on its own key. The answer to
 * an unknown sample is written on its card with the wheel and confirmed with Q or E.
 *
 * The chemistry is not here: what is on the loop, what each sample holds and what colour the flame takes are in
 * lib/lab/saggi.ts, a state changed only by actions. This file moves the hands, draws what the state says and reads
 * the steps off it for the notebook.
 */

type Phase = { text: string | (() => string); hint: string; check: () => boolean; then?: () => void; once?: boolean; prep?: boolean; missed?: () => void };
/** `any`: the phases are done in any order, each counting from when it is done. */
type StepDef = { id: string; title: string; why: string; phases: Phase[]; any?: boolean };
type Unknown = 'X' | 'Y';

const up = new Vector3(0, 1, 0);
const REDS: Ion[] = ['Li', 'Ca', 'Sr'];
/** What the cobalt glass lets through, linear RGB: deep blue, with a little of the far red. */
const FILTER = new Color().setRGB(0.07, 0.09, 0.62);
/** The burner's flame, against the one under a gauze; and how far above the burner's mouth the loop goes, metres. */
const FLAME = { size: 1.9, loop: 0.04 };
/** The field of view while the loop is in the flame, degrees: the eyes go to the colour. */
const WATCH = 34;
/** The glass in front of the eyes: its half side and how far from them, metres. */
const GLASS = { half: 0.025, thick: 0.003 };
/** How far from the eyes the glass is held up, metres, and how much it leans (held by a corner, not squared). */
const RAISED = { far: 0.17, up: 0.008, lean: 0.04 };

export class Saggi {
	readonly free: FreeLab;
	/** The chemistry: plain data, changed only by lib/lab/saggi.ts's actions. */
	readonly state: SaggiState;
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
	private notes = new Map<string, boolean>();
	private latched = new Set<Phase>();

	/** The hand that holds the loop in the flame, and where its tip is asked to be. */
	inFlame: Side | null = null;
	private flameAt = new Vector3();
	private flameQ = new Quaternion();
	/** The hand that holds the cobalt glass in front of the eyes. */
	cobaltUp: Side | null = null;
	private viewK = 0;
	/** The samples whose colour was seen with a clean loop; and those looked at through the cobalt glass. */
	readonly seen = new Set<SampleId>();
	readonly tried = new Set<SampleId>();
	readonly throughGlass = new Set<SampleId>();
	private acidDips = 0;
	private cleaned = false;
	private cleanT = 0;
	private watch = { key: '', t: 0 };
	private glassT = 0;
	private told = new Set<string>();
	readonly answers: Record<Unknown, { pick: number; done: boolean; tries: number; wrong: boolean }> = { X: { pick: -1, done: false, tries: 0, wrong: false }, Y: { pick: -1, done: false, tries: 0, wrong: false } };
	private wheelAcc = 0;
	private report: { rows: [string, string][]; notes: { good: boolean; text: string }[] } | null = null;

	private plume = new Plume();
	private view = new Group();
	private viewMat: MeshBasicMaterial;
	private rimMat: MeshBasicMaterial;
	private haze: { u: { value: number }; full: number }[] = [];
	private tipMat: MeshStandardMaterial | null = null;
	private crust: Mesh | null = null;
	private cards = new Map<Unknown, { canvas: HTMLCanvasElement; tex: CanvasTexture }>();

	constructor(
		private s: LabScene,
		private notebook: Notebook,
		private font = 'cursive',
		seed = 1
	) {
		this.state = initial(seed);
		this.free = new FreeLab(s, notebook);
		this.free.uses = (o) => this.uses(o);
		this.free.together = (side, mine, other) => (mine.name === 'WireLoop' && other.name === 'AcidBeaker' ? { verb: 'insert', text: "Immergi nell'acido", run: () => this.dip(side, other) } : null);
		this.free.refuse = (o) => (!this.goggles && o.name !== 'Goggles' ? 'Prima indossa gli occhiali di protezione.' : null);
		// the body stays still while a hand holds the loop in the flame
		const busy = s.handsBusy;
		s.handsBusy = () => busy() || this.inFlame !== null;
		for (const name of ['Bunsen', 'GasTap']) {
			const n = s.nodes.get(name);
			if (n) n.userData.fixed = true;
		}
		const acid = s.liquids.get('AcidBeaker');
		if (acid) acid.contents.vol = 30;

		// with no gauze over it the flame is free, as tall as a real burner's; the coloured flame, and the end of the
		// wire, which glows
		s.flame.size = FLAME.size;
		if (s.look) this.plume.boost = 1.5;
		s.scene.add(this.plume.group);
		const tip = s.nodes.get('WireLoopTip') as Mesh | undefined;
		if (tip) {
			this.tipMat = (tip.material as MeshStandardMaterial).clone();
			this.tipMat.emissive = new Color('#ff5a14');
			this.tipMat.emissiveIntensity = 0;
			tip.material = this.tipMat;
		}
		const crust = s.nodes.get('WireLoopSalt') as Mesh | undefined;
		if (crust) {
			crust.material = (crust.material as MeshStandardMaterial).clone();
			this.crust = crust;
		}
		// the cobalt glass as a filter: a sheet on the glass itself that multiplies what is behind it by its colour. It
		// comes on as the hand brings the glass to the eyes, while the glass's own haze goes
		// (tested against depth: the thumb, nearer the eyes, is in front of it and keeps its colour)
		this.viewMat = new MeshBasicMaterial({ color: '#ffffff', blending: MultiplyBlending, premultipliedAlpha: true, transparent: true, depthWrite: false, toneMapped: false, side: DoubleSide });
		const sheet = new Mesh(new ShapeGeometry(rounded(GLASS.half, 0.0006), 4), this.viewMat);
		sheet.renderOrder = 900;
		const rim = rounded(GLASS.half, 0.0006);
		rim.holes.push(new Path(rounded(GLASS.half - 0.0009, 0.0004).getPoints(4)));
		this.rimMat = new MeshBasicMaterial({ color: '#0b1648', transparent: true, opacity: 0, depthWrite: false, side: DoubleSide });
		const edge = new Mesh(new ShapeGeometry(rim, 4), this.rimMat);
		edge.renderOrder = 901;
		for (const m of [sheet, edge]) {
			m.userData.noPick = true;
			m.raycast = () => {};
		}
		this.view.add(sheet, edge);
		// the plate lies flat in its node, 3 mm thick
		this.view.rotation.x = -Math.PI / 2;
		this.view.position.y = GLASS.thick / 2;
		this.view.visible = false;
		const cobalt = s.nodes.get('CobaltGlass');
		cobalt?.add(this.view);
		cobalt?.traverse((o) => {
			const base = ((o as Mesh).material as Material | undefined)?.userData?.base as { value: number } | undefined;
			if (base && !this.haze.some((h) => h.u === base)) this.haze.push({ u: base, full: base.value });
		});
		for (const id of ['X', 'Y'] as Unknown[]) this.card(id);

		const held = (name: string) => this.sideOf(name) !== null;
		this.steps = [
			{
				id: 'goggles',
				title: 'Sicurezza',
				why: "Si lavora con una fiamma e con acido cloridrico: gli occhiali si indossano prima di toccare qualsiasi cosa sul banco.",
				phases: [{ text: 'Indossa gli occhiali di protezione.', hint: 'Sono sul banco, a sinistra. Puntali e premi {Q} o {E}: li indossa la mano sinistra o la destra.', check: () => this.goggles }]
			},
			{
				id: 'light',
				title: 'Accendi il becco Bunsen',
				why: "Si accende con la ghiera chiusa, poi si apre l'aria. La fiamma azzurra è molto calda e quasi senza colore: solo lì si vede il colore che le dà un sale.",
				phases: [
					{ text: "Chiudi la ghiera dell'aria del becco Bunsen.", hint: 'Punta il becco Bunsen e {gira giù}.', check: () => this.air < 0.1, once: true, prep: true, missed: () => this.note("Becco acceso con la ghiera dell'aria aperta", false) },
					{ text: "Prendi l'accendigas.", hint: 'È sul banco, vicino al bordo.', check: () => held('Lighter'), once: true, prep: true },
					{ text: 'Apri il rubinetto del gas.', hint: 'Punta il rubinetto giallo dietro il becco e premi {Q} o {E}: lo gira la mano libera.', check: () => this.gasOpen, prep: true },
					{ text: "Accendi subito con l'accendigas.", hint: "Punta il becco Bunsen e premi il tasto della mano con l'accendigas: il gas non deve uscire a lungo senza fiamma.", check: () => this.lit },
					{ text: 'Apri la ghiera finché la fiamma diventa azzurra.', hint: 'Punta il becco Bunsen e {gira su}.', check: () => this.airHold > 0.6, once: true }
				]
			},
			{
				id: 'clean',
				title: "Pulisci l'ansa",
				why: "Il filo di nichel-cromo non colora la fiamma, ma quello che ha addosso sì: basta averlo toccato con le dita per lasciarci del sodio. L'acido cloridrico scioglie i residui, e nella fiamma quello che resta evapora.",
				phases: [
					{ text: "Prendi l'ansa al nichel-cromo.", hint: "È sul banco, a sinistra: un filo sottile con un manico di legno. Appoggia prima l'accendigas se ti serve la mano.", check: () => held('WireLoop'), prep: true },
					{ text: "Immergi la punta dell'ansa nell'acido cloridrico.", hint: "Con l'ansa in mano punta il becher con HCl e premi il tasto della mano che la tiene: {Q} la sinistra, {E} la destra.", check: () => this.acidDips > 0, once: true, prep: true },
					{
						text: 'Tienila nella fiamma finché non la colora più.',
						hint: "Punta il becco Bunsen e premi il tasto della mano che tiene l'ansa. Se la fiamma si colora ancora, ripeti: acido, poi fiamma.",
						check: () => this.cleaned,
						once: true,
						then: () => this.note("Ansa pulita prima del primo saggio", true)
					}
				]
			},
			{
				id: 'known',
				title: 'I sette sali',
				why: "Ogni metallo dà alla fiamma un colore suo. Per ogni sale: ansa pulita, bagnata nell'acido, un tocco sul sale, poi sul bordo della fiamma. Tra un sale e l'altro l'ansa si pulisce.",
				any: true,
				phases: KNOWN.map((id) => ({
					// the colour is the student's to write, in the notebook's table
					text: () => `${IONS[id].salt}: ${this.notebook.marks[`col_${id}`] === 'ok' ? this.notebook.values[`col_${id}`] : this.seen.has(id) ? 'visto' : '…'}`,
					hint: "Premi il tasto della mano che tiene l'ansa: sul becher la bagna, su un vetrino tocca il sale, sul becco la porta nella fiamma o la toglie.",
					check: () => this.seen.has(id)
				}))
			},
			{
				id: 'mix',
				title: 'Sodio e potassio insieme',
				why: 'Il giallo del sodio è così intenso che copre il lilla del potassio. Il vetro al cobalto assorbe il giallo: attraverso il vetro resta solo la luce del potassio.',
				phases: [
					{ text: 'Saggia la miscela NaCl + KCl a occhio nudo.', hint: 'Come per gli altri sali: è il vetrino con la targhetta NaCl + KCl.', check: () => this.seen.has('Mix'), once: true },
					{ text: 'Prendi il vetro al cobalto con la mano libera.', hint: 'È la lastrina blu sul banco, a sinistra.', check: () => held('CobaltGlass'), prep: true },
					{
						text: 'Rifai il saggio e guarda la fiamma attraverso il vetro.',
						hint: "Con l'ansa nella fiamma premi il tasto della mano che tiene il vetro: lo alza davanti agli occhi. Guarda la fiamma al centro del vetro.",
						check: () => this.throughGlass.has('Mix'),
						once: true,
						then: () => this.note('Potassio riconosciuto sotto il giallo del sodio, con il vetro al cobalto', true)
					}
				]
			},
			{
				id: 'unknown',
				title: 'I campioni incogniti',
				why: "Due sali senza nome. Saggiali come gli altri e confronta il colore con quelli che hai visto: puoi rifare un sale noto subito dopo, per vederli uno accanto all'altro. Dove c'è giallo, serve il vetro al cobalto.",
				any: true,
				phases: (['X', 'Y'] as Unknown[]).map((id) => ({
					text: () => `Campione ${id}: ${this.answers[id].done ? ANSWERS[this.answers[id].pick].text : '?'}`,
					hint: 'Punta il cartellino dietro il campione: {gira} per scegliere il metallo, poi premi {Q} o {E} per confermare.',
					check: () => this.answers[id].done
				}))
			},
			{
				id: 'tidy',
				title: 'Riordina',
				why: "La fiamma si spegne chiudendo il gas al rubinetto. L'ansa calda si appoggia sul banco, lontano dai campioni.",
				phases: [
					{ text: 'Chiudi il rubinetto del gas.', hint: 'Punta il rubinetto e premi {Q} o {E} con una mano libera.', check: () => !this.gasOpen && !this.lit },
					{ text: "Appoggia l'ansa e il vetro sul banco.", hint: 'Punta il banco e {clic con la} mano che li tiene.', check: () => !held('WireLoop') && !held('CobaltGlass') }
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

	/** The phase the notebook points at: in a step done in any order, the first one still to do. */
	private current() {
		const def = this.steps[Math.min(this.step, this.steps.length - 1)];
		if (!def.any) return def.phases[this.phase];
		return def.phases.find((p) => !this.latched.has(p)) ?? def.phases[def.phases.length - 1];
	}

	private build(): EsperimentoSnapshot {
		const def = this.steps[Math.min(this.step, this.steps.length - 1)];
		return {
			...this.free.getSnapshot(),
			step: this.step,
			total: this.steps.length,
			stepTitle: this.done ? 'Risultati' : def.title,
			objective: this.done ? 'Esperimento concluso' : def.any ? this.objectiveOf(def) : this.textOf(def.phases[this.phase]),
			readouts: this.readouts(),
			lens: null,
			goggles: this.goggles,
			night: 0,
			done: this.done
		};
	}

	private objectiveOf(def: StepDef) {
		const left = def.phases.filter((p) => !this.latched.has(p)).length;
		if (def.id === 'known') return left === def.phases.length ? 'Saggia i sette sali alla fiamma, uno alla volta.' : `Saggia gli altri sali: ne ${left === 1 ? 'manca uno' : `mancano ${left}`}.`;
		return left === def.phases.length ? 'Riconosci i campioni X e Y.' : 'Riconosci il campione che manca.';
	}

	private readouts(): Readout[] {
		const out: Readout[] = [];
		if (this.lit || this.gasOpen) out.push({ label: 'Fiamma', value: !this.lit ? 'gas senza fiamma' : this.air > 0.6 ? 'azzurra' : this.air > 0.3 ? 'poca aria' : 'gialla', tone: !this.lit ? 'warn' : undefined });
		if (this.sideOf('WireLoop')) {
			const l = this.state.loop;
			const value = l.temp > 420 ? 'rovente' : l.wet ? 'bagnata di acido' : dirt(l.load) >= CLEAN ? (l.last ? 'con il sale' : 'da pulire') : this.cleaned ? 'pulita' : 'da pulire';
			out.push({ label: 'Ansa', value, tone: l.temp > 420 ? 'hot' : undefined });
		}
		return out;
	}

	private page() {
		if (this.report) {
			this.notebook.draw({
				kicker: 'Esperimento concluso',
				title: 'I colori della fiamma',
				intro: "Il calore eccita gli elettroni del metallo: tornando al loro livello restituiscono l'energia come luce, di un colore proprio di ogni elemento.",
				rows: this.report.rows,
				steps: 'Come è andata',
				tasks: this.report.notes.map((n) => ({ text: n.text, state: n.good ? 'done' : 'bad' })),
				hint: '',
				done: null
			});
			return;
		}
		const def = this.steps[this.step];
		const now = this.current();
		const tasks: NotebookTask[] = def.phases.map((p, i) => ({
			text: this.textOf(p),
			state: def.any ? (this.latched.has(p) ? 'done' : p === now ? 'now' : 'todo') : i < this.phase ? 'done' : i === this.phase ? 'now' : 'todo'
		}));
		this.notebook.draw({
			kicker: `Passo ${this.step + 1} di ${this.steps.length}`,
			title: def.title,
			intro: def.why,
			tasks,
			hint: now.hint,
			done: null,
			keep: def.any,
			outline: this.steps.map((x, i) => ({ title: x.title, state: i < this.step ? 'done' : i === this.step ? 'now' : 'todo' }))
		});
	}

	/** The notebook's own page for this experiment: the table of the colours, which the student fills in. */
	private book() {
		const css = (c: [number, number, number]) => `rgb(${c.map((x) => Math.round(x * 255)).join(' ')})`;
		const options = KNOWN.map((id) => ({ value: IONS[id].colorName, label: IONS[id].colorName, color: css(IONS[id].color) })).sort((a, b) => a.label.localeCompare(b.label, 'it'));
		const forms: BookPage[] = [
			{
				kind: 'form',
				id: 'colori',
				tab: 'Colori',
				title: 'I colori della fiamma',
				blocks: [
					{ type: 'text', text: "Dopo ogni saggio, con l'ansa appoggiata, scrivi qui il colore che hai visto. Ti servirà per riconoscere i campioni X e Y." },
					{ type: 'table', head: ['Sale', 'Metallo', 'Colore della fiamma'], rows: KNOWN.map((id) => [IONS[id].salt, IONS[id].name, { id: `col_${id}`, kind: 'choice' as const, options, placeholder: 'scegli…' }]) },
					{ type: 'swatches', title: 'La scala dei colori', items: options.map((o) => ({ label: o.label, color: o.color })) }
				]
			}
		];
		this.notebook.setPages(bookOf('saggi-alla-fiamma', forms));
		this.notebook.verify = (id, value): Verdict => {
			const m = /^col_(\w+)$/.exec(id);
			if (!m) return null;
			const ion = m[1] as Ion;
			if (!this.seen.has(ion)) return { ok: false, hint: "Prima porta questo sale nella fiamma, con l'ansa pulita: il colore si scrive dopo averlo visto." };
			const ok = value === IONS[ion].colorName;
			if (ok) queueMicrotask(() => this.page());
			return ok ? { ok } : { ok, hint: 'Non è il colore che ha dato questo sale: rifai il saggio e confrontalo con la scala.' };
		};
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

	private get hands() {
		return this.s.hands;
	}

	private sideOf(name: string): Side | null {
		if (this.hands.held('L')?.name === name) return 'L';
		if (this.hands.held('R')?.name === name) return 'R';
		return null;
	}

	private label(o: Object3D) {
		return (o.userData.label as string) ?? o.name;
	}

	// ---------------------------------------------------------------------------------------------
	// what can be done

	/** A control a free hand works where it stands (the tap, the goggles): Q for the left hand and E for the right. */
	private byHand(o: Object3D, verb: Use['verb'], text: string, run: (side: Side) => Promise<void> | void, exclusive = false): Use[] {
		const free = (['L', 'R'] as Side[]).filter((side) => !this.hands.held(side));
		if (!free.length) return (['Q', 'E'] as const).map((input) => ({ input, verb, text: 'Serve una mano libera', blocked: true, why: 'Ti serve una mano libera: appoggia qualcosa.', exclusive }));
		return free.map((side) =>
			this.hands.distance(side, o) <= REACH
				? { input: keyOf(side), verb, text, exclusive, run: () => run(side) }
				: { input: keyOf(side), verb, text: 'Troppo lontano', blocked: true, why: 'Non ci arrivi: avvicinati.', exclusive }
		);
	}

	/** Raising or lowering the cobalt glass, on the key of the hand that holds it. */
	private glassUse(side: Side, exclusive = false): Use {
		return { input: keyOf(side), verb: 'read', text: this.cobaltUp ? 'Abbassa il vetro' : 'Guarda attraverso il vetro', exclusive, run: () => this.raise(this.cobaltUp ? null : side) };
	}

	/** The wheel on the burner's air collar. */
	private collarUse(exclusive = false): Use {
		return { input: 'W', verb: 'turn', text: "Gira la ghiera dell'aria", target: exclusive ? undefined : `Becco Bunsen · aria ${Math.round(this.air * 100)}%`, exclusive, wheel: (d) => (this.air = Math.max(0, Math.min(1, this.air - d * 0.0012))) };
	}

	private uses(o: Object3D | null): Use[] {
		const loop = this.sideOf('WireLoop');
		const glass = this.sideOf('CobaltGlass');
		// the loop in the flame: its key takes it out, the other hand's raises the glass
		if (this.inFlame) {
			const out: Use[] = [{ input: keyOf(this.inFlame), verb: 'confirm', text: 'Togli dalla fiamma', exclusive: true, target: 'Ansa nella fiamma', run: () => this.leave() }];
			if (glass) out.push(this.glassUse(glass, true));
			out.push(this.collarUse(true));
			return out;
		}
		// the glass up stays up until its key lowers it, whatever the crosshair is on
		const base: Use[] = this.cobaltUp ? [{ ...this.glassUse(this.cobaltUp), target: 'Vetro al cobalto' }] : [];
		const merge = (more: Use[]) => [...base, ...more.filter((u) => !base.some((b) => b.input === u.input))];
		if (!o) return base;
		const name = o.name;
		if (!this.goggles) return name === 'Goggles' ? this.byHand(o, 'wear', 'Indossa', (side) => this.wear(side), true) : [];

		if (name === 'GasTap' || name === 'GasTapHandle') {
			const out = this.byHand(this.N('GasTapHandle'), 'turn', this.gasOpen ? 'Chiudi il gas' : 'Apri il gas', (side) => this.tap(side, !this.gasOpen));
			if (this.gasOpen && this.lit) out.push({ input: 'W', verb: 'turn', text: 'Regola la fiamma', target: `Rubinetto del gas · fiamma ${Math.round(this.gas * 100)}%`, wheel: (d) => (this.gas = Math.max(0.15, Math.min(1, this.gas - d * 0.0012))) });
			return merge(out);
		}

		if (name === 'Bunsen' || name === 'BunsenCollar') {
			const out: Use[] = [];
			const lighter = this.sideOf('Lighter');
			if (lighter && !this.lit) out.push({ input: keyOf(lighter), verb: 'light', text: 'Accendi', run: () => this.strike(lighter) });
			if (loop && !this.lit) out.push({ input: keyOf(loop), verb: 'insert', text: 'Il becco è spento', blocked: true, why: 'Prima accendi il becco Bunsen.' });
			else if (loop) out.push(this.hands.distance(loop, o) <= REACH ? { input: keyOf(loop), verb: 'insert', text: 'Porta nella fiamma', run: () => this.enter(loop) } : { input: keyOf(loop), verb: 'insert', text: 'Troppo lontano', blocked: true, why: 'Non ci arrivi: avvicinati.' });
			if (glass && !this.cobaltUp) out.push(this.glassUse(glass));
			out.push(this.collarUse());
			return merge(out);
		}

		// what the loop does where the crosshair is, if its hand reaches
		const withLoop = (verb: Use['verb'], text: string, run: (side: Side) => Promise<void>): Use[] =>
			!loop ? [] : this.hands.distance(loop, o) <= REACH ? [{ input: keyOf(loop), verb, text, run: () => run(loop) }] : [{ input: keyOf(loop), verb, text: 'Troppo lontano', blocked: true, why: 'Non ci arrivi: avvicinati.' }];

		if (loop && name === 'AcidBeaker' && !this.s.held.has(o)) return merge(withLoop('insert', "Immergi nell'acido", (side) => this.dip(side, o)));

		const sample = o.userData.sample as SampleId | undefined;
		if (sample && name.startsWith('Sample')) {
			const out = withLoop('scoop', 'Tocca il sale', (side) => this.touch(side, o, sample));
			// a sample that has been contaminated can be changed for a fresh one, on the key the loop leaves free
			if (tainted(this.state, sample)) for (const input of ['Q', 'E'] as const) if (!out.some((u) => u.input === input)) out.push({ input, verb: 'confirm', text: 'Chiedi un campione nuovo', run: () => this.replace(o, sample) });
			return merge(out);
		}

		if (sample && name.startsWith('Answer')) {
			const id = sample as Unknown;
			const a = this.answers[id];
			if (a.done) return base;
			const text = a.pick < 0 ? '?' : ANSWERS[a.pick].text;
			const out: Use[] = [{ input: 'W', verb: 'turn', text: 'Scegli il metallo', target: `Campione ${id} · ${text}`, wheel: (d) => this.choose(id, d) }];
			// an answer follows a test: after a wrong one the sample goes back in the flame, and where there is yellow the
			// glass is needed to know what is under it
			const glassFirst = this.tried.has(id) && !!this.state.samples[id].ions.Na && !this.throughGlass.has(id);
			const why =
				a.pick < 0
					? 'Scegli prima il metallo: gira la rotella sul cartellino.'
					: !this.tried.has(id)
						? a.tries > 0
							? `Prima rifai il saggio del campione ${id}: guarda di nuovo il colore.`
							: `Prima saggia il campione ${id} alla fiamma.`
						: glassFirst
							? `Questa fiamma è gialla: prima guardala attraverso il vetro al cobalto, per sapere se sotto il giallo c'è altro.`
							: '';
			const short = a.pick < 0 ? 'Scegli prima il metallo' : glassFirst ? 'Prima guarda con il vetro' : a.tries > 0 ? 'Prima rifai il saggio' : 'Prima saggia il campione';
			for (const input of ['Q', 'E'] as const) out.push({ input, verb: 'confirm', text: why ? short : `Conferma: ${text}`, blocked: !!why, why, run: () => this.confirm(id) });
			return merge(out);
		}
		return base;
	}

	// ---------------------------------------------------------------------------------------------
	// actions: the burner and the goggles, as in the copper sulfate experiment

	private async wear(side: Side) {
		this.N('Goggles').visible = false;
		this.goggles = true;
		await this.hands.gesture(side);
		this.note('Occhiali indossati prima di iniziare', true);
		this.say('ok', 'Occhiali indossati. Ora puoi lavorare al banco.');
	}

	private async tap(side: Side, open: boolean) {
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

	/** A direction in the student's own terms: so much towards the side of the hand, so much up, so much back. */
	private toHand(side: Side, out: number, rise: number, back: number) {
		const yaw = this.s.player.yaw;
		const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
		const fwd = new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
		return right.multiplyScalar((side === 'R' ? 1 : -1) * out).addScaledVector(up, rise).addScaledVector(fwd, -back).normalize();
	}

	/** Takes the tool in `side`'s hand to a pose, its origin (the tip) at `at` and turned `q`, and keeps it there. */
	private async tool(side: Side, at: Vector3, q: Quaternion, dur: number, lift = 0) {
		const to = () => this.hands.palmFor(side, at, q);
		this.hands.drive(side, to);
		await this.hands.carry(side, to, dur, lift);
	}

	/** The lighter's nozzle to the burner's mouth, level, from the side of the hand that holds it. */
	private async strike(side: Side) {
		const h = this.hands;
		const lighter = this.N('Lighter');
		const anchor = this.s.worldOf('FlameAnchor');
		const axis = this.toHand(side, 1, 0.1, 0.45);
		const tip = anchor.clone().addScaledVector(axis.clone().setY(0).normalize(), 0.012).add(new Vector3(0, 0.01, 0));
		h.exact(side, true);
		const q = h.prone(side, axis);
		const back = tip.clone().addScaledVector(axis, 0.07);
		await this.tool(side, back, q, 0.6, 0.02);
		await this.tool(side, tip, q, 0.3);
		await this.s.anim.wait(0.15);
		const lf = this.s.lighterFlame;
		const follow = () => {
			lighter.updateMatrixWorld();
			lf.group.position.set(0, 0, 0).applyMatrix4(lighter.matrixWorld);
		};
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
		this.say('ok', this.air < 0.3 ? 'Acceso! La fiamma è gialla e tremolante: apri la ghiera per farla diventare azzurra.' : 'Acceso!');
		this.note(this.leakT < 4 ? 'Acceso subito dopo aver aperto il gas' : 'Il gas è uscito a lungo prima di accendere', this.leakT < 4);
	}

	// ---------------------------------------------------------------------------------------------
	// actions: the loop

	/** The loop's end into the acid, and out: a beaker held in the other hand comes to the middle first. */
	private async dip(side: Side, beaker: Object3D) {
		const h = this.hands;
		const hostSide = this.sideOf(beaker.name);
		const release = hostSide ? await this.free.present(hostSide) : null;
		const lq = this.s.liquids.get(beaker.name)!;
		const b = beaker.getWorldPosition(new Vector3());
		const axis = this.toHand(side, 0.45, 1, 0.3);
		const inAcid = new Vector3(b.x, b.y + Math.max(lq.profile.bottom + 0.005, lq.localLevel() - 0.012), b.z);
		const above = new Vector3(b.x, b.y + lq.profile.top + 0.045, b.z);
		h.exact(side, true);
		const q = h.aim(side, axis, inAcid);
		await this.free.above(side, above, q, 0.65);
		await this.tool(side, inAcid, q, 0.35);
		for (const e of apply(this.state, { type: 'acid' }))
			if (e.type === 'sizzle') {
				// the hot wire boils the acid it touches
				this.s.steam.source.set(b.x, lq.level() + 0.003, b.z);
				this.s.steam.radius = 0.006;
				this.s.steam.rate = 60;
				void this.s.anim.wait(0.5).then(() => (this.s.steam.rate = 0));
				this.once('sizzle', 'info', "L'ansa rovente sfrigola nell'acido: lasciala raffreddare un momento prima di immergerla.");
			}
		this.acidDips++;
		await this.s.anim.wait(0.4);
		await this.tool(side, above, q, 0.35);
		await this.free.away(side);
		h.exact(side, false);
		release?.();
		await h.carry(side, () => this.free.hold(side), 0.45);
		if (dirt(this.state.loop.load) >= CLEAN) this.once('acid', 'info', "L'acido scioglie quasi tutto, non tutto: quello che resta se ne va nella fiamma.");
	}

	/** The loop's end onto a salt, and back with a little of it. */
	private async touch(side: Side, node: Object3D, sample: SampleId) {
		const h = this.hands;
		const p = node.getWorldPosition(new Vector3()).add(new Vector3(0, 0.0068, 0));
		const axis = this.toHand(side, 0.5, 0.95, 0.4);
		const above = p.clone().add(new Vector3(0, 0.055, 0));
		h.exact(side, true);
		const q = h.aim(side, axis, p);
		await this.free.above(side, above, q, 0.6);
		await this.tool(side, p, q, 0.3);
		const hot = this.state.loop.temp > 400;
		const events = apply(this.state, { type: 'touch', sample });
		// the warning of a contaminated sample is not covered by a lesser remark
		const spoiled = events.some((e) => e.type === 'tainted');
		for (const e of events) {
			if (e.type === 'tainted') {
				const what = e.by.map((i) => IONS[i].name).join(' e ');
				this.note(`${this.label(node)}: contaminato con ${what}, l'ansa non era pulita`, false);
				this.say('warn', `L'ansa non era pulita: nel vetrino è rimasto un po' di ${what}, e da ora questo campione darà anche quel colore. Puoi chiederne uno nuovo: puntalo e premi il tasto della mano libera.`);
			} else if (spoiled) continue;
			else if (e.type === 'picked' && e.dry) this.once('dry', 'info', "L'ansa asciutta raccoglie poco sale e il colore dura un attimo: bagnala prima nell'acido.");
			else if (e.type === 'picked' && hot) this.once('hot', 'info', 'Il sale fonde sul filo ancora caldo e ci resta attaccato.');
		}
		await this.s.anim.wait(0.22);
		await this.tool(side, above, q, 0.3);
		await this.free.away(side);
		h.exact(side, false);
		await h.carry(side, () => this.free.hold(side), 0.45);
	}

	/**
	 * The loop into the edge of the flame, a little above the burner's mouth, where it is hottest: it comes in from the
	 * side of the hand that holds it and stays there (update burns what is on it) until `leave`.
	 */
	private async enter(side: Side) {
		const h = this.hands;
		const anchor = this.s.worldOf('FlameAnchor');
		const axis = this.toHand(side, 1, 0.3, 0.45);
		const flat = axis.clone().setY(0).normalize();
		this.flameAt.copy(anchor).addScaledVector(flat, 0.004).add(new Vector3(0, FLAME.loop, 0));
		h.exact(side, true);
		this.flameQ.copy(h.aim(side, axis, this.flameAt));
		const back = this.flameAt.clone().addScaledVector(axis, 0.08);
		await this.tool(side, back, this.flameQ, 0.55, 0.02);
		await this.tool(side, this.flameAt, this.flameQ, 0.3);
		this.inFlame = side;
		this.watch = { key: '', t: 0 };
		this.cleanT = 0;
		this.glassT = 0;
	}

	private async leave() {
		const side = this.inFlame;
		if (!side) return;
		const h = this.hands;
		this.inFlame = null;
		const axis = up.clone().applyQuaternion(this.flameQ);
		await this.tool(side, this.flameAt.clone().addScaledVector(axis, 0.08), this.flameQ, 0.3);
		h.drive(side, null);
		h.exact(side, false);
		await h.carry(side, () => this.free.hold(side), 0.45);
	}

	/** A fresh sample in place of a contaminated one: the heap is taken away and comes back. */
	private async replace(node: Object3D, sample: SampleId) {
		const heap = node.getObjectByName(`${node.name}Salt`);
		if (heap) await this.s.anim.run(0.25, (k) => heap.scale.setScalar(1 - k));
		apply(this.state, { type: 'replace', sample });
		if (heap) await this.s.anim.run(0.3, (k) => heap.scale.setScalar(k));
		this.say('ok', `Ecco un vetrino nuovo: ${this.label(node)}. Toccalo solo con l'ansa pulita.`);
	}

	/** The glass comes up in front of the eyes in `side`'s hand, or goes back down (null). */
	private raise(side: Side | null) {
		const was = this.cobaltUp;
		this.cobaltUp = side;
		const hand = side ?? was;
		if (hand) {
			const sign = hand === 'R' ? 1 : -1;
			// the hand brings the glass it holds in front of the eyes: its middle on the line of sight, its far face away
			// from them, the pinched corner the lower outer one
			const cam = this.s.camera;
			const to = () => {
				cam.updateMatrixWorld();
				const cq = cam.getWorldQuaternion(new Quaternion());
				const a = new Vector3(0, 0, -1);
				const u = new Vector3(-sign, 1, 0).normalize().applyAxisAngle(a, sign * RAISED.lean);
				const q = cq.clone().multiply(orient(a, u.clone().sub(new Vector3().crossVectors(a, u))));
				const at = new Vector3(0, RAISED.up, -RAISED.far).applyMatrix4(cam.matrixWorld);
				return this.hands.palmFor(hand, at, q);
			};
			this.hands.exact(hand, !!side);
			// unhurried, so that the hand is seen to bring it up and to take it down
			this.hands.drive(hand, side ? to : null, 6.5);
		}
		this.glassT = 0;
		if (side) this.once('glass', 'info', 'Il vetro al cobalto lascia passare il blu e il rosso cupo, non il giallo. Tieni la fiamma al centro del vetro.');
	}

	/** The wheel on a card: one notch, one metal on. */
	private choose(id: Unknown, delta: number) {
		this.wheelAcc += delta;
		const a = this.answers[id];
		const n = ANSWERS.length;
		while (Math.abs(this.wheelAcc) >= 60) {
			const dir = this.wheelAcc > 0 ? 1 : -1;
			this.wheelAcc -= dir * 60;
			a.pick = a.pick < 0 ? (dir > 0 ? 0 : n - 1) : (a.pick + dir + n) % n;
			a.wrong = false;
		}
		this.card(id);
	}

	private confirm(id: Unknown) {
		const a = this.answers[id];
		if (a.pick < 0 || a.done) return;
		const said = ANSWERS[a.pick].id;
		const right = truth(this.state, id);
		if (said === right) {
			a.done = true;
			this.card(id);
			this.note(a.tries === 0 ? `Campione ${id} riconosciuto al primo tentativo` : `Campione ${id}: ${a.tries === 1 ? 'una risposta sbagliata' : `${a.tries} risposte sbagliate`} prima di quella giusta`, a.tries === 0);
			this.say('ok', `Giusto: il campione ${id} contiene ${ANSWERS[a.pick].text}.`);
			return;
		}
		a.tries++;
		a.wrong = true;
		// the next answer needs the sample in the flame again: the colour is looked at, not guessed
		this.tried.delete(id);
		this.throughGlass.delete(id);
		this.card(id);
		const reds = (x: string) => REDS.includes(x as Ion);
		if (id === 'Y' || said === 'NaK' || said === 'Na') this.say('warn', id === 'Y' ? "Non è così. Il giallo del sodio copre tutto: per sapere se sotto c'è anche il potassio, guarda la fiamma attraverso il vetro al cobalto." : `Non è ${ANSWERS[a.pick].text}: il sodio dà un giallo intenso che dura a lungo. Rifai il saggio con l'ansa ben pulita.`);
		else if (reds(said) && reds(right)) this.say('warn', `Non è ${ANSWERS[a.pick].text}. I tre rossi si somigliano: litio più cupo, stronzio rosso pieno, calcio verso l'arancio. Rifalli uno dopo l'altro.`);
		else this.say('warn', `Non è ${ANSWERS[a.pick].text}. Rifai il saggio del campione e poi quello del sale che pensi, uno dopo l'altro, e confronta i colori.`);
	}

	/** Writes a card: the sample's name in print, the answer in pencil, the teacher's red pen once it is confirmed. */
	private card(id: Unknown) {
		let c = this.cards.get(id);
		if (!c) {
			const face = this.s.nodes.get(`Answer${id}Face`) as Mesh | undefined;
			if (!face) return;
			const canvas = document.createElement('canvas');
			canvas.width = 512;
			canvas.height = 356;
			const tex = new CanvasTexture(canvas);
			tex.colorSpace = SRGBColorSpace;
			tex.flipY = false;
			tex.anisotropy = 4;
			face.material = new MeshStandardMaterial({ map: tex, roughness: 0.9 });
			c = { canvas, tex };
			this.cards.set(id, c);
		}
		const a = this.answers[id];
		const g = c.canvas.getContext('2d')!;
		g.fillStyle = '#fbf8ef';
		g.fillRect(0, 0, 512, 356);
		g.strokeStyle = '#c9c2b0';
		g.lineWidth = 6;
		g.strokeRect(10, 10, 492, 336);
		g.fillStyle = '#56606b';
		g.font = '700 58px system-ui, sans-serif';
		g.textBaseline = 'alphabetic';
		g.fillText(`CAMPIONE ${id}`, 34, 86);
		const text = a.pick < 0 ? '?' : ANSWERS[a.pick].text;
		// in pencil until it is confirmed, then in ink
		g.fillStyle = a.pick < 0 ? '#9aa3ad' : a.done ? '#1f2f6f' : '#77808c';
		let size = a.pick < 0 ? 200 : 132;
		g.font = `700 ${size}px ${this.font}`;
		while (g.measureText(text).width > 440 && size > 40) g.font = `700 ${(size -= 6)}px ${this.font}`;
		const w = g.measureText(text).width;
		g.fillText(text, (512 - w) / 2, 292);
		g.strokeStyle = '#c23b33';
		g.lineCap = 'round';
		if (a.done) {
			g.lineWidth = 16;
			g.beginPath();
			g.moveTo(404, 62);
			g.lineTo(432, 96);
			g.lineTo(486, 26);
			g.stroke();
		} else if (a.wrong) {
			g.lineWidth = 12;
			g.beginPath();
			g.moveTo((512 - w) / 2 - 14, 272);
			g.lineTo((512 + w) / 2 + 14, 238);
			g.stroke();
		}
		c.tex.needsUpdate = true;
	}

	private finish() {
		const rows: [string, string][] = KNOWN.map((id) => [`${IONS[id].salt}, ${IONS[id].name}`, IONS[id].colorName]);
		for (const id of ['X', 'Y'] as Unknown[]) rows.push([`Campione ${id}`, ANSWERS[this.answers[id].pick].text]);
		this.report = { rows, notes: [...this.notes.entries()].map(([text, good]) => ({ text, good })) };
		this.say('ok', 'Banco in ordine. I colori che hai visto sono nel quaderno.');
	}

	// ---------------------------------------------------------------------------------------------
	// every frame: the burner, the loop in the flame, what is seen, the notebook

	/** Whether the flame, seen from the eyes, is behind the glass held up. */
	private behindGlass(p: Vector3) {
		const node = this.s.nodes.get('CobaltGlass');
		if (!this.cobaltUp || !node || this.viewK < 0.9) return false;
		// where the line from the eyes to the flame crosses the plate, in the plate's own frame
		const inv = node.matrixWorld.clone().invert();
		const eye = this.s.camera.getWorldPosition(new Vector3()).applyMatrix4(inv);
		const to = p.clone().applyMatrix4(inv);
		const dy = to.y - eye.y;
		if (Math.abs(dy) < 1e-6) return false;
		const k = (GLASS.thick / 2 - eye.y) / dy;
		if (k <= 0 || k >= 1) return false;
		const hit = eye.lerp(to, k);
		return Math.abs(hit.x) < GLASS.half * 0.92 && Math.abs(hit.z) < GLASS.half * 0.92;
	}

	private update(dt: number) {
		const s = this.s;
		this.notebook.update(dt);
		s.flame.gas = this.lit ? this.gas : 0;
		s.flame.air = this.air;
		const collar = s.nodes.get('BunsenCollar');
		if (collar) collar.rotation.y = (1 - this.air) * Math.PI * 0.6;
		if (this.gasOpen && !this.lit) {
			this.leakT += dt;
			if (this.leakT > 6 && !this.leakWarned) {
				this.leakWarned = true;
				this.note('Il gas è uscito a lungo prima di accendere', false);
				this.say('warn', 'Il gas sta uscendo senza fiamma! Accendi subito o chiudi il rubinetto.');
			}
		}
		this.airHold = this.lit && this.air >= 0.72 ? this.airHold + dt : 0;
		s.player.watch = this.inFlame ? WATCH : null;
		if (this.airHold > 0.6) this.once('blue', 'ok', 'Fiamma azzurra: è la più calda, e quasi non ha colore suo.');
		// what a hand was doing ends if the thing is no longer in it (put down from the flame, or with the glass up)
		if (this.inFlame && this.sideOf('WireLoop') !== this.inFlame) {
			this.hands.exact(this.inFlame, false);
			this.inFlame = null;
		}
		if (this.cobaltUp && this.sideOf('CobaltGlass') !== this.cobaltUp) this.raise(null);

		// the hand brings the glass up to the eyes, and its colour comes with it: how far it has come is how near the
		// eyes the glass is
		const cobalt = s.nodes.get('CobaltGlass');
		let near = 0;
		if (cobalt && this.sideOf('CobaltGlass')) {
			const d = cobalt.getWorldPosition(new Vector3()).distanceTo(s.camera.getWorldPosition(new Vector3()));
			near = Math.min(1, Math.max(0, (0.3 - d) / (0.3 - RAISED.far - 0.02)));
		}
		this.viewK = near;
		this.view.visible = this.viewK > 0.02;
		const k = Math.min(1, this.viewK * 1.1);
		this.viewMat.color.setRGB(1, 1, 1).lerp(FILTER, k);
		this.rimMat.opacity = 0.9 * k;
		for (const h of this.haze) h.u.value = h.full * (1 - k);

		// the loop: in the flame it burns what it carries, out of it it cools
		const loopNode = s.nodes.get('WireLoop');
		const tip = loopNode ? loopNode.getWorldPosition(new Vector3()) : this.flameAt;
		const inside = this.inFlame !== null && tip.distanceTo(this.flameAt) < 0.03;
		const burning = inside && this.lit;
		const carried = this.state.loop.last;
		const events = apply(this.state, inside ? { type: 'flame', dt, lit: this.lit } : { type: 'air', dt });
		if (carried && events.some((e) => e.type === 'burnt')) this.once('burnt', 'info', "Il sale è finito e la fiamma torna azzurra: l'ansa è di nuovo pulita.");
		const through = burning && this.behindGlass(tip);
		const em = burning ? emission(this.state, this.air, through) : null;
		this.plume.group.position.copy(tip);
		this.plume.amount = em ? em.amount * (0.6 + 0.4 * this.gas) : 0;
		if (em && em.amount > 0.01) {
			this.plume.color.setRGB(em.color[0], em.color[1], em.color[2], SRGBColorSpace);
			// on the bench its light is the flame's own colour, glass or no glass
			const bare = emission(this.state, this.air);
			this.plume.glow = (this.plume.glow ?? new Color()).setRGB(bare.color[0], bare.color[1], bare.color[2], SRGBColorSpace);
			// what the glass will take away is put back, so that the colour the eye is left with is the one meant
			if (through) this.plume.color.setRGB(Math.min(12, this.plume.color.r / FILTER.r), Math.min(12, this.plume.color.g / FILTER.g), Math.min(12, this.plume.color.b / FILTER.b));
		}
		this.plume.update(s.time, dt);
		if (this.tipMat) this.tipMat.emissiveIntensity = Math.max(0, Math.min(1, (this.state.loop.temp - 450) / 450)) * 1.8;
		if (this.crust) {
			const l = this.state.loop;
			this.crust.visible = !!l.last && dirt(l.load) > 0.2 && l.temp < 700;
			if (this.crust.visible) (this.crust.material as MeshStandardMaterial).color.set(l.last === 'Cu' ? '#3aa9a2' : '#f6f6f1');
		}
		if (burning) this.look(dt, through, carried);

		// the notebook ticks what the lab has reached
		for (const st of this.steps) for (const ph of st.phases) if (ph.once && !this.latched.has(ph) && ph.check()) this.latched.add(ph);
		const holds = (ph: Phase) => this.latched.has(ph) || ph.check();
		let moved = false;
		for (let guard = 0; guard < 16 && !this.done && !this.free.getSnapshot().busy; guard++) {
			const def = this.steps[this.step];
			if (def.any) {
				for (const ph of def.phases)
					if (!this.latched.has(ph) && ph.check()) {
						this.latched.add(ph);
						ph.then?.();
						moved = true;
					}
				if (!def.phases.every((p) => this.latched.has(p))) break;
			} else {
				const ph = def.phases[this.phase];
				if (!holds(ph)) {
					if (!ph.prep || !def.phases.slice(this.phase + 1).some((x) => !x.prep && holds(x))) break;
					ph.missed?.();
				} else ph.then?.();
				if (this.phase < def.phases.length - 1) {
					this.phase++;
					moved = true;
					continue;
				}
			}
			this.step++;
			this.phase = 0;
			moved = true;
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

	/** What the student sees with the loop in the lit flame, and what the notebook can take from it. */
	private look(dt: number, through: boolean, carried: SampleId | null) {
		const st = this.state;
		const em = emission(st, this.air);
		const loaded = dirt(st.loop.load) >= CLEAN;
		if (this.air < 0.6 && loaded) this.once('yellow', 'warn', "Con poca aria la fiamma copre i colori dei sali: {gira su} la ghiera finché diventa azzurra.");
		// clean: nothing colours the blue flame, for a second
		this.cleanT = isClean(st) && this.air >= 0.6 ? this.cleanT + dt : 0;
		if (this.cleanT > 1 && this.acidDips > 0 && !this.cleaned) {
			this.cleaned = true;
			this.say('ok', "La fiamma resta azzurra: l'ansa è pulita.");
		}
		const v = verdict(st, em);
		const key = v.kind + (v.kind === 'none' ? '' : (v.sample ?? '') + (v.kind === 'dirty' ? v.by : ''));
		if (key !== this.watch.key) this.watch = { key, t: 0 };
		else this.watch.t += dt;
		if (v.kind !== 'none' && v.sample) this.tried.add(v.sample);
		if (v.kind === 'dirty' && !v.sample && this.watch.t > 0.5) this.once('trace', 'info', `La fiamma si colora di ${IONS[v.by].colorName}: sull'ansa c'è del ${IONS[v.by].name}, basta averla toccata con le dita. Va pulita.`);
		if (v.kind === 'dirty' && v.sample && this.watch.t > 0.7) {
			const k = `dirty-${v.sample}-${v.by}`;
			if (!this.told.has(k)) this.note("Un saggio fatto con l'ansa sporca", false);
			this.once(k, 'warn', `Il colore non è pulito: nella fiamma c'è anche ${IONS[v.by].name}. Pulisci l'ansa nell'acido e nella fiamma, poi ripeti il saggio.`);
		}
		if (v.kind === 'pure' && this.watch.t > 0.9 && !this.seen.has(v.sample) && !through) {
			this.seen.add(v.sample);
			const node = this.s.nodes.get(`Sample${v.sample}`);
			if (v.sample === 'X' || v.sample === 'Y') this.say('info', `Campione ${v.sample}: guarda bene il colore e confrontalo con quello dei sali noti.`);
			else if (v.sample === 'Mix') this.say('info', 'La miscela dà lo stesso giallo del sodio: il lilla del potassio non si vede.');
			else this.say('ok', `${node ? this.label(node) : v.sample}: fiamma ${seenAs(st, v.sample)}.`);
		}
		// through the glass: sodium is gone; what is left is potassium, if there is any and it has not all gone yet.
		// What counts is what the glass shows now, not what the sample is made of
		const last = st.loop.last ?? carried;
		const behind = emission(st, this.air, true);
		this.glassT = through && em.amount > 0.2 ? this.glassT + dt : 0;
		if (this.glassT > 0.9 && last && !this.throughGlass.has(last)) {
			const ions = st.samples[last].ions;
			const potassium = behind.dominant === 'K' && behind.amount > 0.2;
			if (potassium) {
				this.throughGlass.add(last);
				this.say('ok', ions.Na ? 'Attraverso il vetro il giallo del sodio sparisce e resta un rosso violaceo: è la luce del potassio.' : 'Attraverso il vetro il lilla del potassio diventa un rosso violaceo.');
			} else if (ions.Na && ions.K) {
				// the potassium went first: sodium burns longer
				this.once(`late-${last}-${this.acidDips}`, 'info', 'Il potassio è già finito, resta solo il sodio: ripeti il saggio e alza subito il vetro.');
			} else if (ions.Na && behind.amount < 0.1) {
				this.throughGlass.add(last);
				this.say('info', "Attraverso il vetro la fiamma quasi sparisce: sotto questo giallo non c'è altro.");
			}
		}
	}
}

/** A square with rounded corners, centred, in the XY plane. */
function rounded(half: number, r: number) {
	const s = new Shape();
	s.moveTo(-half + r, -half);
	s.lineTo(half - r, -half);
	s.quadraticCurveTo(half, -half, half, -half + r);
	s.lineTo(half, half - r);
	s.quadraticCurveTo(half, half, half - r, half);
	s.lineTo(-half + r, half);
	s.quadraticCurveTo(-half, half, -half, half - r);
	s.lineTo(-half, -half + r);
	s.quadraticCurveTo(-half, -half, -half + r, -half);
	return s;
}
