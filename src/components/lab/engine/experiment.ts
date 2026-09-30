import { Color, ConeGeometry, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from 'three';
import type { LabScene } from './scene';
import { Contents, type LiquidBody } from './liquid';
import { ease, orient, placePoint, tweenPose, type Pose } from './anim';
import { canHold } from './grasp';

/*
 * The guided experiment: copper(II) sulfate crystals from copper(II) oxide and dilute sulfuric acid.
 *
 *   CuO(s) + H₂SO₄(aq) → CuSO₄(aq) + H₂O(l)
 *
 * The page runs a small simulation under the steps: the heat balance of what sits on the gauze, the rate at
 * which the oxide dissolves (faster when hot and stirred), the moles of acid and copper, filtration and
 * evaporation. Times are compressed: heating takes seconds, not minutes, and the crystals grow in a time-lapse.
 */

export type Control = 'draw' | 'air' | 'gas' | 'rest';
export type Message = { kind: 'info' | 'warn' | 'ok'; text: string } | null;
export type Readout = { label: string; value: string; tone?: 'hot' | 'ok' | 'warn' };
export type Task = { text: string; state: 'done' | 'now' | 'todo' };
export type Report = {
	acid: number;
	cuoAdded: number;
	cuoExcess: number;
	theoretical: number;
	obtained: number;
	yieldPct: number;
	notes: { good: boolean; text: string }[];
};
export type Snapshot = {
	ready: boolean;
	step: number;
	steps: { id: string; title: string }[];
	title: string;
	why: string;
	tasks: Task[];
	controls: Control[];
	draw: { vol: number; offsetMm: number; ok: boolean } | null;
	gas: number;
	air: number;
	lit: boolean;
	readouts: Readout[];
	message: Message;
	busy: boolean;
	goggles: boolean;
	equation: boolean;
	report: Report | null;
};

type Phase = { text: string; targets?: string[]; controls?: Control[] };
type StepDef = { id: string; title: string; why: string; phases: Phase[] };

const STEPS: StepDef[] = [
	{
		id: 'goggles',
		title: 'Sicurezza',
		why: "L'acido solforico, anche diluito, irrita gli occhi: gli occhiali si indossano prima di toccare qualsiasi cosa sul banco.",
		phases: [{ text: 'Indossa gli occhiali di protezione', targets: ['Goggles'] }]
	},
	{
		id: 'pipette',
		title: "Preleva l'acido",
		why: "La pipetta tarata misura un volume preciso. Il tecnico ha già versato un po' di acido in un becher: dalla bottiglia non si pipetta mai. Il fondo del menisco deve toccare la tacca.",
		phases: [
			{ text: "Prendi la pipetta da 25 mL e immergi la punta nell'acido", targets: ['Pipette'] },
			{ text: 'Aspira con la propipetta fino alla tacca, poi conferma', controls: ['draw'] }
		]
	},
	{
		id: 'transfer',
		title: "Trasferisci l'acido",
		why: "La pipetta si svuota appoggiando la punta alla parete del becher. La goccia che resta nella punta non si soffia fuori: la taratura ne tiene conto.",
		phases: [{ text: 'Svuota la pipetta nel becher da 100 mL', targets: ['Beaker'] }]
	},
	{
		id: 'setup',
		title: 'Prepara il riscaldamento',
		why: 'Il vetro non va mai sulla fiamma diretta: la reticella con il centro ceramico distribuisce il calore sul fondo del becher.',
		phases: [
			{ text: 'Metti il becher sulla reticella del treppiede', targets: ['Beaker'] },
			{ text: 'Metti il termometro nel becher', targets: ['Thermometer'] }
		]
	},
	{
		id: 'light',
		title: 'Accendi il becco Bunsen',
		why: "Si accende con la ghiera chiusa: la fiamma gialla si vede bene ed è stabile. Aprendo la ghiera entra aria, la combustione diventa completa e la fiamma azzurra è molto più calda.",
		phases: [
			{ text: "Chiudi la ghiera dell'aria del becco Bunsen", targets: ['Bunsen'] },
			{ text: 'Apri il rubinetto del gas', targets: ['GasTap'] },
			{ text: "Accendi subito con l'accendigas", targets: ['Lighter'] },
			{ text: 'Apri la ghiera finché la fiamma diventa azzurra', controls: ['air'] }
		]
	},
	{
		id: 'heat',
		title: "Scalda l'acido",
		why: "A freddo l'ossido di rame reagisce molto lentamente. Intorno ai 60 °C la reazione è rapida; l'acido però non deve bollire, perché schizza.",
		phases: [{ text: 'Scalda fino a circa 60 °C', controls: ['gas', 'air'] }]
	},
	{
		id: 'react',
		title: "Aggiungi l'ossido di rame(II)",
		why: "L'ossido nero reagisce con l'acido e la soluzione diventa azzurra per gli ioni Cu²⁺. Si mette ossido in eccesso: quando resta polvere nera sul fondo, tutto l'acido ha reagito.",
		phases: [{ text: 'Aggiungi CuO con la spatola, una punta alla volta, e mescola con la bacchetta finché resta polvere nera sul fondo', targets: ['Spatula', 'GlassRod'], controls: ['gas'] }]
	},
	{
		id: 'off',
		title: 'Spegni il becco Bunsen',
		why: 'La fiamma si spegne chiudendo il gas al rubinetto, mai soffiandoci sopra.',
		phases: [{ text: 'Chiudi il rubinetto del gas', targets: ['GasTap'] }]
	},
	{
		id: 'filter',
		title: 'Filtra',
		why: "La carta da filtro trattiene l'ossido di rame in eccesso; nella beuta passa solo la soluzione di solfato di rame, il filtrato.",
		phases: [
			{ text: "Piega la carta da filtro e mettila nell'imbuto", targets: ['FilterPaper'] },
			{ text: "Versa la miscela nell'imbuto", targets: ['Beaker'] },
			{ text: 'Aspetta che la soluzione passi nella beuta' }
		]
	},
	{
		id: 'evaporate',
		title: 'Concentra la soluzione',
		why: "Evaporando parte dell'acqua la soluzione diventa satura. Ci si ferma a circa un terzo del volume: se l'acqua evapora tutta resta una polvere, non dei cristalli.",
		phases: [
			{ text: 'Metti la capsula di porcellana sulla reticella', targets: ['EvapDish'] },
			{ text: 'Versa il filtrato nella capsula', targets: ['ConicalFlask'] },
			{ text: 'Apri il rubinetto del gas', targets: ['GasTap'] },
			{ text: 'Accendi il becco Bunsen', targets: ['Lighter'] },
			{ text: 'Fai evaporare fino a circa un terzo del volume', controls: ['gas', 'air'] },
			{ text: 'Spegni il gas', targets: ['GasTap'] }
		]
	},
	{
		id: 'crystallize',
		title: 'Cristallizza',
		why: 'Raffreddandosi, la soluzione satura non tiene più disciolto tutto il solfato: si formano i cristalli azzurri di solfato di rame pentaidrato, CuSO₄·5H₂O.',
		phases: [{ text: 'Lascia riposare la capsula per due giorni', targets: ['EvapDish'], controls: ['rest'] }]
	},
	{ id: 'report', title: 'Risultati', why: '', phases: [{ text: 'Esperimento concluso' }] }
];

/** What the right hand holds during an action, when it is not the object that was clicked. */
const HAND: Record<string, string | null> = {
	Bunsen: 'BunsenCollar',
	GasTap: 'GasTapHandle',
	'transfer:0:Beaker': 'Pipette',
	'crystallize:0:EvapDish': null
};

const M_CUO = 79.55;
const M_PENTA = 249.68;
const PORTION = 0.5;
const P_MAX = 420;
const LOSS = 2.8;

const up = new Vector3(0, 1, 0);
const toThree = (a: number[]) => new Vector3(a[0], a[2], -a[1]);
const fmt = (x: number, d = 1) => x.toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });

export class Experiment {
	step = 0;
	phase = 0;
	busy = false;
	private hand: string | null = null;
	message: Message = null;
	private msgT = 0;
	gas = 0.9;
	air = 0.5;
	gasOpen = false;
	lit = false;
	goggles = false;
	drawDir: -1 | 0 | 1 = 0;
	private leakT = 0;
	private onGauze: 'Beaker' | 'EvapDish' | null = null;
	private thermoIn: string | null = null;
	private portions = 0;
	private soot = 0;
	private sootWarned = false;
	private boilWarned = false;
	private notes = new Map<string, boolean>();
	private evap0 = 0;
	private quality = 1;
	private report: Report | null = null;
	private residue: Mesh;
	private listeners = new Set<() => void>();
	private snap: Snapshot;
	private emitT = 0;
	private airHold = 0;
	private sootDisc: Mesh;
	private cuInDish = 0;
	private cuoExcess = 0;

	constructor(private s: LabScene) {
		const acid = this.L('AcidBeaker');
		acid.contents.vol = 40;
		acid.contents.acid = 0.04;
		// the residue on the filter paper
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
		s.onPick = (name) => this.pick(name);
		s.onUpdate = (dt) => this.update(dt);
		this.snap = this.build();
		this.enter();
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

	private get def() {
		return STEPS[this.step];
	}

	private get ph() {
		return this.def.phases[this.phase];
	}

	private build(): Snapshot {
		const def = this.def;
		const tasks: Task[] = def.phases.map((p, i) => ({ text: p.text, state: i < this.phase ? 'done' : i === this.phase ? 'now' : 'todo' }));
		const pip = this.L('Pipette');
		const mark = Number(this.s.nodes.get('Pipette')?.userData.mark ?? 0.32);
		const draw = def.id === 'pipette' && this.phase === 1 ? { vol: pip.contents.vol, offsetMm: (pip.localLevel() - mark) * 1000, ok: Math.abs(pip.contents.vol - 25) <= 0.12 } : null;
		return {
			ready: true,
			step: this.step,
			steps: STEPS.map((d) => ({ id: d.id, title: d.title })),
			title: def.title,
			why: def.why,
			tasks,
			controls: this.busy ? [] : (this.ph.controls ?? []),
			draw,
			gas: this.gas,
			air: this.air,
			lit: this.lit,
			readouts: this.readouts(),
			message: this.message,
			busy: this.busy,
			goggles: this.goggles,
			equation: ['react', 'off', 'filter', 'evaporate', 'crystallize', 'report'].includes(def.id),
			report: this.report
		};
	}

	private readouts(): Readout[] {
		const out: Readout[] = [];
		if (this.thermoIn) {
			const t = this.L(this.thermoIn).contents.temp;
			out.push({ label: 'Temperatura', value: `${fmt(t, 0)} °C`, tone: t >= 90 ? 'warn' : t >= 50 ? 'hot' : undefined });
		} else if (this.onGauze && this.lit) {
			out.push({ label: 'Temperatura', value: `${fmt(this.L(this.onGauze).contents.temp, 0)} °C`, tone: 'hot' });
		}
		const id = this.def.id;
		const b = this.L('Beaker').contents;
		if (['transfer', 'setup', 'light', 'heat', 'react', 'off'].includes(id) && b.vol > 0) {
			out.push({ label: 'Nel becher', value: `${fmt(b.vol, 1)} mL` });
		}
		if (id === 'react' || id === 'off') {
			out.push({ label: 'CuO aggiunto', value: `${fmt(this.portions * PORTION, 1)} g` });
			out.push({ label: 'H₂SO₄ rimasto', value: `${fmt(b.acid * 1000, 1)} mmol`, tone: b.acid < 0.0005 ? 'ok' : undefined });
			out.push({ label: 'CuO non disciolto', value: `${fmt(b.solid, 2)} g` });
		}
		if (id === 'filter') {
			out.push({ label: 'Nella beuta', value: `${fmt(this.L('ConicalFlask').contents.vol, 1)} mL` });
		}
		if (id === 'evaporate' || id === 'crystallize') {
			const d = this.L('EvapDish').contents;
			if (d.vol > 0) {
				out.push({ label: 'Nella capsula', value: `${fmt(d.vol, 1)} mL` });
				out.push({ label: 'CuSO₄', value: `${fmt(d.conc, 2)} mol/L` });
			}
		}
		if (this.lit || this.gasOpen) out.push({ label: 'Fiamma', value: !this.lit ? 'gas senza fiamma!' : this.air > 0.6 ? 'azzurra' : this.air > 0.3 ? 'poco aria' : 'gialla', tone: !this.lit ? 'warn' : undefined });
		return out;
	}

	private say(kind: 'info' | 'warn' | 'ok', text: string) {
		this.message = { kind, text };
		this.msgT = kind === 'warn' ? 9 : 7;
		this.emit();
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

	// ---------------------------------------------------------------------------------------------
	// flow of steps

	private next() {
		const def = this.def;
		if (this.phase < def.phases.length - 1) this.phase++;
		else {
			this.step = Math.min(STEPS.length - 1, this.step + 1);
			this.phase = 0;
		}
		this.enter();
	}

	/** Outlines what to use in the phase just entered. The camera is the student's: it never moves by itself. */
	private enter() {
		this.s.setTargets(this.ph.targets ?? []);
		this.emit();
	}

	/**
	 * Runs an action. The right hand first reaches for the object the action moves and takes it; then the object moves
	 * and the hand keeps its grip; at the end the hand lets go. Too far away, nothing happens but a hint.
	 */
	private async run(fn: () => Promise<void>) {
		const node = this.hand ? this.s.nodes.get(this.hand) : undefined;
		const hands = this.s.hands;
		const handed = !!node && canHold(node.name);
		// the hand on the object's side
		const side = handed && node!.getWorldPosition(new Vector3()).sub(this.s.camera.position).dot(this.s.avatar.axes().right) < -0.08 ? 'L' : 'R';
		if (handed && hands.distance(side, node!) > 1.05) {
			this.hand = null;
			this.say('info', 'Non ci arrivi: avvicinati al banco.');
			return;
		}
		this.busy = true;
		this.s.setTargets([]);
		this.emit();
		try {
			if (handed) await hands.take(side, node!, 'follow');
			await fn();
		} finally {
			if (handed) await hands.release(side);
			this.hand = null;
			this.busy = false;
			this.s.setTargets(this.ph.targets ?? []);
			this.emit();
		}
	}

	// ---------------------------------------------------------------------------------------------
	// input

	pick(name: string) {
		if (this.busy) return;
		const ph = this.ph;
		const id = this.def.id;
		const hit = ph.targets?.includes(name) || (id === 'react' && name === 'CuOJar');
		if (hit) {
			this.act(id === 'react' && name === 'CuOJar' ? 'Spatula' : name);
			return;
		}
		const label = (this.s.nodes.get(name)?.userData.label as string) ?? name;
		if (!this.goggles) return this.say('warn', 'Prima indossa gli occhiali di protezione.');
		if (name === 'GasTap' && this.gasOpen) return this.say('info', 'Per regolare il calore usa il cursore della fiamma: il rubinetto si chiude alla fine del riscaldamento.');
		if (!this.s.nodes.get(name)?.userData.pick) return this.say('info', `${label}: fa parte del laboratorio, ma non serve in questo esperimento.`);
		if (this.ph.controls?.length && !ph.targets?.length) return this.say('info', `${label}: non ora. ${this.ph.text}.`);
		this.say('info', `${label}: non ora. Adesso: ${ph.text.charAt(0).toLowerCase() + ph.text.slice(1)}.`);
	}

	setGas(v: number) {
		this.gas = Math.max(0.15, Math.min(1, v));
		this.emit();
	}

	setAir(v: number) {
		this.air = Math.max(0, Math.min(1, v));
		this.emit();
	}

	setDraw(dir: -1 | 0 | 1) {
		this.drawDir = dir;
	}

	confirmDraw() {
		const v = this.L('Pipette').contents.vol;
		if (Math.abs(v - 25) <= 0.12) {
			this.note('Volume di acido misurato con precisione sulla tacca', true);
			this.drawDir = 0;
			this.say('ok', `Perfetto: 25,0 mL di H₂SO₄ 1 mol/L, cioè 25 mmol di acido.`);
			this.next();
		} else if (v < 25) this.say('warn', 'Il menisco è ancora sotto la tacca: aspira ancora un poco.');
		else this.say('warn', "Il menisco è sopra la tacca: lascia scendere l'acido goccia a goccia.");
	}

	rest() {
		if (this.def.id === 'crystallize' && !this.busy) this.act('EvapDish');
	}

	// ---------------------------------------------------------------------------------------------
	// actions

	private act(name: string) {
		const id = this.def.id;
		const key = `${id}:${this.phase}:${name}`;
		this.hand = key in HAND ? HAND[key] : (HAND[name] ?? name);
		switch (key) {
			case 'goggles:0:Goggles':
				return this.run(() => this.wearGoggles());
			case 'pipette:0:Pipette':
				return this.run(() => this.pipetteIntoAcid());
			case 'transfer:0:Beaker':
				return this.run(() => this.pipetteIntoBeaker());
			case 'setup:0:Beaker':
				return this.run(() => this.toGauze('Beaker'));
			case 'setup:1:Thermometer':
				return this.run(() => this.thermometerInto('Beaker'));
			case 'light:0:Bunsen':
				return this.run(() => this.closeCollar());
			case 'light:1:GasTap':
			case 'evaporate:2:GasTap':
				return this.run(() => this.tap(true));
			case 'light:2:Lighter':
			case 'evaporate:3:Lighter':
				return this.run(() => this.strike());
			case 'react:0:Spatula':
				return this.run(() => this.addPortion());
			case 'react:0:GlassRod':
				return this.run(() => this.stir());
			case 'off:0:GasTap':
			case 'evaporate:5:GasTap':
				return this.run(() => this.tap(false));
			case 'filter:0:FilterPaper':
				return this.run(() => this.foldPaper());
			case 'filter:1:Beaker':
				return this.run(() => this.pourIntoFunnel());
			case 'evaporate:0:EvapDish':
				return this.run(() => this.toGauze('EvapDish'));
			case 'evaporate:1:ConicalFlask':
				return this.run(() => this.pourIntoDish());
			case 'crystallize:0:EvapDish':
				return this.run(() => this.timelapse());
		}
	}

	private tween(name: string, to: Pose, dur: number, lift = 0) {
		return tweenPose(this.s.anim, this.N(name), to, dur, lift);
	}

	private home(name: string, dur = 0.9, lift = 0.06) {
		const r = this.s.rest.get(name)!;
		return this.tween(name, { position: r.position.clone(), quaternion: r.quaternion.clone() }, dur, lift);
	}

	private async wearGoggles() {
		const g = this.N('Goggles');
		const cam = this.s.camera;
		const dir = new Vector3();
		cam.getWorldDirection(dir);
		const to = cam.position.clone().addScaledVector(dir, 0.12);
		const q = orient(up.clone(), dir.clone().negate());
		await this.tween('Goggles', { position: to, quaternion: q }, 1.0, 0.1);
		g.visible = false;
		this.goggles = true;
		this.note('Occhiali indossati prima di iniziare', true);
		this.say('ok', 'Occhiali indossati. Ora puoi lavorare al banco.');
		this.next();
	}

	private async pipetteIntoAcid() {
		const acid = this.N('AcidBeaker').position;
		const q = new Quaternion();
		const above = new Vector3(acid.x, acid.y + 0.09, acid.z);
		await this.tween('Pipette', { position: above, quaternion: q }, 1.4, 0.25);
		await this.tween('Pipette', { position: new Vector3(acid.x, acid.y + 0.004, acid.z), quaternion: q }, 0.8);
		this.say('info', "Tieni premuto «Aspira» per far salire l'acido. Se superi la tacca, fallo scendere piano con «Rilascia».");
		this.next();
	}

	private async pipetteIntoBeaker() {
		const b = this.N('Beaker').position;
		const q = orient(new Vector3(0.14, 1, 0.04), new Vector3(0, 0, 1));
		const acid = this.N('AcidBeaker').position;
		await this.tween('Pipette', { position: new Vector3(acid.x, acid.y + 0.09, acid.z), quaternion: new Quaternion() }, 0.6);
		await this.tween('Pipette', { position: new Vector3(b.x + 0.02, b.y + 0.09, b.z + 0.004), quaternion: q }, 1.0, 0.05);
		await this.tween('Pipette', { position: new Vector3(b.x + 0.02, b.y + 0.035, b.z + 0.004), quaternion: q }, 0.5);
		const pip = this.L('Pipette');
		const beaker = this.L('Beaker');
		await this.s.anim.until((dt) => {
			beaker.contents.add(pip.contents.take(Math.min(pip.contents.vol, 5.5 * dt)));
			return pip.contents.vol <= 0.001;
		});
		await this.s.anim.wait(0.4);
		await this.tween('Pipette', { position: new Vector3(b.x + 0.02, b.y + 0.12, b.z + 0.004), quaternion: q }, 0.5);
		await this.home('Pipette', 1.3, 0.12);
		this.say('ok', 'Nel becher ci sono 25,0 mL di acido solforico 1 mol/L.');
		this.next();
	}

	private async toGauze(name: 'Beaker' | 'EvapDish') {
		const g = this.s.gauzeCenter;
		const r = this.s.rest.get(name)!;
		await this.tween(name, { position: new Vector3(g.x, this.s.gauzeTop, g.z), quaternion: r.quaternion.clone() }, 1.1, 0.12);
		this.onGauze = name;
		this.next();
	}

	private thermoPose(host: string): Pose {
		const hp = this.N(host).position;
		const bulb = new Vector3(hp.x - 0.009, hp.y + 0.0045, hp.z + 0.008);
		const lean = new Vector3(hp.x - 0.028, hp.y + 0.074, hp.z - 0.012);
		const q = orient(lean.clone().sub(bulb), new Vector3(0.2, 0, 1));
		return { position: bulb, quaternion: q };
	}

	private async thermometerInto(host: string) {
		const p = this.thermoPose(host);
		await this.tween('Thermometer', { position: p.position.clone().add(new Vector3(0, 0.12, 0)), quaternion: p.quaternion }, 1.1, 0.1);
		await this.tween('Thermometer', p, 0.6);
		this.N(host).attach(this.N('Thermometer'));
		this.thermoIn = host;
		this.say('info', `Il termometro segna ${fmt(this.L(host).contents.temp, 0)} °C: la temperatura della stanza.`);
		this.next();
	}

	private async thermometerOut() {
		if (!this.thermoIn) return;
		const t = this.N('Thermometer');
		this.s.scene.attach(t);
		this.thermoIn = null;
		await this.tween('Thermometer', { position: t.position.clone().add(new Vector3(0, 0.1, 0)), quaternion: t.quaternion.clone() }, 0.5);
		await this.home('Thermometer', 0.9, 0.04);
	}

	private async closeCollar() {
		const a0 = this.air;
		await this.s.anim.run(0.8, (k) => (this.air = a0 * (1 - k)));
		this.air = 0;
		this.say('info', "Ghiera chiusa: il foro dell'aria è coperto.");
		this.next();
	}

	private async tap(open: boolean) {
		const h = this.N('GasTapHandle');
		const a0 = h.rotation.y;
		const a1 = open ? -Math.PI / 2 : 0;
		await this.s.anim.run(0.5, (k) => (h.rotation.y = a0 + (a1 - a0) * k));
		this.gasOpen = open;
		if (open) {
			this.leakT = 0;
			this.say('info', 'Il gas esce: accendi subito.');
		} else {
			this.lit = false;
			this.say('ok', 'Gas chiuso: la fiamma si spegne.');
		}
		this.next();
	}

	private async strike() {
		const lighter = this.N('Lighter');
		const anchor = this.s.worldOf('FlameAnchor');
		const q = orient(new Vector3(0.7, 0.5, 0.55), new Vector3(0, 1, 0));
		const tip = anchor.clone().add(new Vector3(0.012, 0.012, 0.01));
		await this.tween('Lighter', { position: tip, quaternion: q }, 1.0, 0.1);
		const lf = this.s.lighterFlame;
		lf.gas = 0.25;
		const tipWorld = new Vector3();
		const follow = () => {
			lighter.updateMatrixWorld();
			tipWorld.set(0, 0, 0).applyMatrix4(lighter.matrixWorld);
			lf.group.position.copy(tipWorld);
		};
		follow();
		await this.s.anim.run(0.35, () => follow());
		if (this.gasOpen) {
			this.lit = true;
			this.s.flame.ignite();
		}
		await this.s.anim.run(0.25, () => follow());
		lf.gas = 0;
		await this.home('Lighter', 0.9, 0.08);
		this.say('ok', this.air < 0.3 ? 'Acceso! La fiamma è gialla e tremolante: poca aria, combustione incompleta.' : 'Acceso!');
		this.note(this.leakT < 4 ? 'Acceso subito dopo aver aperto il gas' : 'Il gas è uscito a lungo prima di accendere', this.leakT < 4);
		this.next();
	}

	private async addPortion() {
		const jar = this.N('CuOJar').position;
		const bk = this.N('Beaker').position;
		const powder = this.N('SpatulaPowder');
		const dip = orient(new Vector3(0.3, 1, 0.35), new Vector3(0, 0.3, 1));
		await this.tween('Spatula', { position: new Vector3(jar.x, jar.y + 0.1, jar.z), quaternion: dip }, 0.8, 0.05);
		await this.tween('Spatula', { position: new Vector3(jar.x, jar.y + 0.041, jar.z), quaternion: dip }, 0.45);
		powder.visible = true;
		const carry = orient(new Vector3(1, 0.35, 0.35), up.clone());
		await this.tween('Spatula', { position: new Vector3(jar.x, jar.y + 0.13, jar.z), quaternion: carry }, 0.5);
		const over = new Vector3(bk.x + 0.004, bk.y + 0.098, bk.z);
		await this.tween('Spatula', { position: over, quaternion: carry }, 0.8, 0.02);
		const dump = orient(new Vector3(1, 0.5, 0.35), new Vector3(0, -0.5, 1));
		const sp = this.N('Spatula');
		const beaker = this.L('Beaker');
		await this.tween('Spatula', { position: over, quaternion: dump }, 0.35);
		powder.visible = false;
		const origin = new Vector3();
		sp.updateMatrixWorld();
		origin.set(0, 0, 0.012).applyMatrix4(sp.matrixWorld);
		for (let i = 0; i < 26; i++) {
			const p = origin.clone().add(new Vector3((Math.random() - 0.5) * 0.006, (Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.006));
			this.s.powder.spawn(p, new Vector3((Math.random() - 0.5) * 0.05, -Math.random() * 0.1, (Math.random() - 0.5) * 0.05), beaker.level());
		}
		await this.s.anim.wait(0.3);
		beaker.contents.solid += PORTION;
		this.portions++;
		await this.home('Spatula', 0.9, 0.06);
		const t = beaker.contents.temp;
		this.say('info', t < 40 ? 'La polvere nera resta sul fondo: a freddo reagisce poco. Scalda e mescola.' : 'Mescola con la bacchetta: la polvere nera scompare e la soluzione si colora di azzurro.');
	}

	private async stir() {
		const rod = this.N('GlassRod');
		const bk = this.N('Beaker');
		const grains = this.s.grains.get('Beaker')!;
		const c = bk.position;
		const place = (phi: number, lift: number) => {
			const b = new Vector3(c.x + Math.cos(phi) * 0.011, c.y + 0.006 + lift, c.z + Math.sin(phi) * 0.011);
			const axis = new Vector3(-Math.cos(phi) * 0.05 + 0.08, 1, -Math.sin(phi) * 0.05 + 0.05);
			return { position: b, quaternion: orient(axis, new Vector3(0, 0, 1)) };
		};
		const start = place(0, 0.1);
		await this.tween('GlassRod', start, 0.9, 0.08);
		await this.tween('GlassRod', place(0, 0), 0.4);
		await this.s.anim.run(
			2.6,
			(k) => {
				const p = place(k * Math.PI * 2 * 3.2, 0);
				rod.position.copy(p.position);
				rod.quaternion.copy(p.quaternion);
				grains.swirl = 1;
			},
			ease.linear
		);
		await this.tween('GlassRod', place(Math.PI * 2 * 3.2, 0.1), 0.4);
		await this.home('GlassRod', 0.8, 0.04);
	}

	private async foldPaper() {
		const paper = this.N('FilterPaper');
		const sheet = this.N('FilterPaperSheet') as Mesh;
		const infl = sheet.morphTargetInfluences;
		const p0 = paper.position.clone();
		await this.s.anim.run(1.2, (k) => {
			if (infl) infl[0] = k;
			paper.position.set(p0.x, p0.y + 0.06 * k, p0.z);
		});
		const funnel = this.N('Funnel');
		const apex = funnel.position.clone().add(new Vector3(0, 0.005, 0));
		await this.tween('FilterPaper', { position: apex.clone().add(new Vector3(0, 0.1, 0)), quaternion: funnel.quaternion.clone() }, 0.9, 0.04);
		await this.tween('FilterPaper', { position: apex, quaternion: funnel.quaternion.clone() }, 0.5);
		funnel.attach(paper);
		this.say('info', "La carta piegata in quattro forma un cono: da un lato tre strati, dall'altro uno.");
		this.next();
	}

	/**
	 * Pours from a vessel into a point, tilting it about its lip. The liquid flows only when its surface, computed
	 * for the tilted vessel, rises above the lip, so the tilt sets the flow.
	 */
	private async pour(src: string, spoutLocal: Vector3, entry: Vector3, high: number, receive: (c: Contents) => void, surface: () => number, maxTilt = 118) {
		const node = this.N(src);
		const lq = this.L(src);
		const flat = new Vector3(entry.x - node.position.x, 0, entry.z - node.position.z).normalize();
		const yaw = new Quaternion().setFromAxisAngle(up, Math.atan2(-flat.z, flat.x));
		const pivotAt = (tilt: number) => {
			const k = Math.min(1, tilt / 75);
			return entry.clone().addScaledVector(flat, -0.018).add(new Vector3(0, high + (0.03 - high) * k, 0));
		};
		const poseAt = (tilt: number): Pose => {
			const q = yaw.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), (-tilt * Math.PI) / 180));
			return { position: placePoint(pivotAt(tilt), spoutLocal, q), quaternion: q };
		};
		const apply = (p: Pose) => {
			node.position.copy(p.position);
			node.quaternion.copy(p.quaternion);
			node.updateMatrixWorld(true);
		};
		await tweenPose(this.s.anim, node, poseAt(0), 1.2, 0.08);
		let tilt = 0;
		const color = new Color();
		const lip = new Vector3();
		await this.s.anim.until((dt) => {
			const head = lq.level() - pivotAt(tilt).y;
			let flow = 0;
			if (head > -0.0004) {
				flow = Math.min(Math.max(0, lq.contents.vol - 0.15), (head + 0.0004) * 2600 * dt);
				if (lq.contents.vol <= 0.6) flow = lq.contents.vol;
				if (flow > 0) receive(lq.contents.take(flow, true));
			}
			tilt = Math.min(maxTilt, tilt + (flow > 0 ? 9 : 45) * dt * (tilt > 60 && flow === 0 ? 0.6 : 1));
			apply(poseAt(tilt));
			lip.copy(pivotAt(tilt));
			color.copy(lq.material.color);
			this.s.stream.set(flow > 0 ? lip : null, flat, surface(), flow / dt, color, lq.material.opacity);
			return lq.contents.vol <= 0.02 || tilt >= maxTilt;
		});
		this.s.stream.set(null, flat, 0, 0, color, 0);
		await tweenPose(this.s.anim, node, poseAt(0), 0.9);
	}

	private async pourIntoFunnel() {
		await this.thermometerOut();
		this.onGauze = null;
		const funnel = this.N('Funnel');
		const fl = this.L('Funnel');
		const h = Number(funnel.userData.coneHeight);
		const entry = funnel.position.clone().add(new Vector3(0, h + 0.004, 0));
		const bk = this.L('Beaker');
		this.s.grains.get('Beaker')!.swirl = 0.8;
		await this.pour('Beaker', toThree(JSON.parse(this.N('Beaker').userData.spout)), entry, 0.09, (c) => fl.contents.add(c), () => fl.level());
		this.cuoExcess = fl.contents.solid;
		bk.contents.solid = 0;
		this.s.grains.get('Beaker')!.grams = 0;
		await this.home('Beaker', 1.0, 0.05);
		this.next();
		this.say('info', 'La soluzione azzurra passa attraverso la carta; la polvere nera resta nel filtro.');
	}

	private async pourIntoDish() {
		const funnel = this.N('Funnel');
		// lay the funnel on the bench, on its side
		const tiltRad = Math.atan((0.0375 - 0.0033) / 0.135);
		const axis = new Vector3(Math.cos(tiltRad), Math.sin(tiltRad), 0);
		const q = orient(axis, new Vector3(0, 0, 1));
		const contact = new Vector3(0.0375, Number(funnel.userData.coneHeight), 0).applyQuaternion(q);
		const pos = new Vector3(0.62, this.s.benchY - contact.y + 0.002, -0.2);
		await tweenPose(this.s.anim, funnel, { position: pos, quaternion: q }, 1.2, 0.12);
		const dish = this.N('EvapDish');
		const dl = this.L('EvapDish');
		const entry = dish.position.clone().add(new Vector3(0, 0.03, 0));
		await this.pour('ConicalFlask', new Vector3(0.0205, 0.145, 0), entry, 0.16, (c) => dl.contents.add(c), () => dl.level(), 125);
		await this.home('ConicalFlask', 1.1, 0.05);
		this.evap0 = dl.contents.vol;
		this.say('info', `Nella capsula ci sono ${fmt(this.evap0, 1)} mL di soluzione. Riaccendi il becco Bunsen e falla evaporare fino a circa ${fmt(this.evap0 / 3, 0)} mL.`);
		this.next();
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
		const sky = s.skyMat;
		const sky0 = sky?.emissiveIntensity ?? 1;
		const key0 = s.key.intensity;
		const hemi0 = s.hemi.intensity;
		const env0 = s.scene.environmentIntensity;
		this.say('info', 'Due giorni dopo…');
		await s.anim.run(
			9,
			(k) => {
				const h = 10 + 48 * k;
				hour.rotation.z = -((h % 12) / 12) * Math.PI * 2;
				minute.rotation.z = -(h % 1) * Math.PI * 2;
				second.rotation.z = -((h * 60) % 1) * Math.PI * 2;
				const day = Math.max(0, Math.cos(((h - 13) / 24) * Math.PI * 2));
				const light = 0.25 + 0.75 * Math.min(1, day * 1.6);
				if (sky) sky.emissiveIntensity = sky0 * (0.08 + 0.92 * Math.min(1, day * 1.6));
				s.key.intensity = key0 * light;
				s.hemi.intensity = hemi0 * light;
				s.scene.environmentIntensity = env0 * light;
				s.crystals.set(k, this.quality);
				// the mother liquor evaporates and is finally poured off, leaving the crystals
				c.vol = v0 * (1 - 0.82 * k);
				c.cu = cu0 * (1 - 0.72 * k * this.quality);
				c.temp = 20;
			},
			ease.linear
		);
		second.rotation.z = 0;
		this.finish();
		this.next();
	}

	private finish() {
		const theoretical = 0.025 * M_PENTA;
		const obtained = this.cuInDish * 0.72 * this.quality * M_PENTA;
		const notes = [...this.notes.entries()].map(([text, good]) => ({ text, good }));
		this.report = {
			acid: 0.025,
			cuoAdded: this.portions * PORTION,
			cuoExcess: this.cuoExcess,
			theoretical,
			obtained,
			yieldPct: (obtained / theoretical) * 100,
			notes
		};
		this.say('ok', 'Ecco i tuoi cristalli di solfato di rame pentaidrato!');
	}

	// ---------------------------------------------------------------------------------------------
	// simulation

	update(dt: number) {
		const s = this.s;
		if (this.msgT > 0) {
			this.msgT -= dt;
			if (this.msgT <= 0) {
				this.message = null;
				this.emit();
			}
		}
		s.flame.gas = this.lit ? this.gas : 0;
		s.flame.air = this.air;
		const collar = s.nodes.get('BunsenCollar');
		if (collar) collar.rotation.y = (1 - this.air) * Math.PI * 0.6;

		// gas escaping unlit
		if (this.gasOpen && !this.lit) {
			this.leakT += dt;
			if (this.leakT > 6 && this.leakT - dt <= 6) {
				this.note('Il gas è uscito a lungo prima di accendere', false);
				this.say('warn', 'Il gas sta uscendo senza fiamma! Accendi subito o chiudi il rubinetto.');
			}
		}

		// heat balance of each vessel with liquid
		for (const [name, lq] of s.liquids) {
			const c = lq.contents;
			if (c.vol <= 0 || !['Beaker', 'EvapDish', 'ConicalFlask', 'Funnel', 'AcidBeaker', 'Pipette'].includes(name)) continue;
			const heated = this.onGauze === name && this.lit;
			const P = heated ? P_MAX * this.gas * (0.45 + 0.55 * this.air) : 0;
			const C = c.vol * 4.18 + (name === 'EvapDish' ? 60 : 30);
			c.temp += ((P - LOSS * (c.temp - 20)) / C) * dt;
			let evap = 0;
			if (c.temp >= 100) {
				c.temp = 100;
				const excess = P - LOSS * 80;
				if (excess > 0) evap = (excess / 2260) * 12;
			} else if (c.temp > 60) evap = 0.012 * ((c.temp - 60) / 40);
			if (evap > 0) c.vol = Math.max(0.05, c.vol - evap * dt);
			const bub = s.bubbles.get(name);
			if (bub) bub.rate = c.temp > 92 ? (c.temp - 92) * 5 + (c.temp >= 100 ? 40 : 0) : 0;
			if (this.onGauze === name) {
				s.steam.source.copy(lq.node.position);
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
				if (name === 'Beaker' && c.temp >= 99.5 && (this.def.id === 'heat' || this.def.id === 'react') && !this.boilWarned) {
					this.boilWarned = true;
					this.note("L'acido ha bollito e ha schizzato", false);
					this.say('warn', "L'acido bolle e schizza! Abbassa subito la fiamma.");
				}
			}
		}
		if (!this.onGauze) s.steam.rate = 0;
		(this.sootDisc.material as MeshStandardMaterial).opacity = Math.min(0.85, this.soot);
		if (s.gauzeMat) {
			const target = this.lit ? s.flame.reach * (0.5 + 1.8 * this.air) * this.gas : 0;
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

		// pipette
		if (this.def.id === 'pipette' && this.phase === 1 && this.drawDir !== 0) {
			const pip = this.L('Pipette');
			const acid = this.L('AcidBeaker');
			if (this.drawDir > 0) {
				if (pip.contents.vol < 28.5) pip.contents.add(acid.contents.take(3.0 * dt));
				else if (!this.message || this.message.kind !== 'warn') this.say('warn', "Fermati: l'acido non deve arrivare nella propipetta.");
			} else if (pip.contents.vol > 0) acid.contents.add(pip.contents.take(0.32 * dt));
		}

		// thermometer
		const th = s.nodes.get('Thermometer');
		const col = s.nodes.get('ThermoColumn');
		if (th && col) {
			const T = this.thermoIn ? this.L(this.thermoIn).contents.temp : 20;
			const shown = col.userData.shown ?? 20;
			const v = shown + (T - shown) * Math.min(1, dt * 3);
			col.userData.shown = v;
			col.scale.y = Number(th.userData.h0) + v * Number(th.userData.k);
		}

		// filtration: the funnel drains into the flask
		const fl = this.L('Funnel');
		const flask = this.L('ConicalFlask');
		if (fl.contents.vol > 0) {
			const moved = fl.contents.take(Math.min(fl.contents.vol, 1.8 * dt));
			flask.contents.add(moved);
			if (Math.random() < 0.5) {
				const f = this.N('Funnel');
				const tip = f.position.clone().add(new Vector3(0, -0.07, 0));
				s.drops.spawn(tip, new Vector3(0, -0.05, 0), flask.level());
			}
		}
		this.residue.visible = fl.contents.solid > 0.01;
		if (this.residue.visible) {
			const k = Math.min(1, 0.5 + fl.contents.solid);
			this.residue.scale.setScalar(k);
			this.residue.position.y = 0.017 * k;
		}

		// checks that move the experiment on
		const id = this.def.id;
		if (!this.busy) {
			if (id === 'light' && this.phase === 3) {
				this.airHold = this.air >= 0.72 ? this.airHold + dt : 0;
				if (this.airHold > 0.6) {
					this.note('Fiamma azzurra, ghiera aperta', true);
					this.say('ok', 'Fiamma azzurra: vedi il cono interno più chiaro? La zona più calda è appena sopra la sua punta.');
					this.next();
				}
			} else if (id === 'heat' && bc.temp >= 55) {
				this.say('ok', `L'acido è a ${fmt(bc.temp, 0)} °C. Abbassa un po' la fiamma per restare tra 60 e 80 °C.`);
				this.next();
			} else if (id === 'react' && bc.acid < 0.0004 && bc.solid > 0.15 && grains && grains.swirl < 0.05) {
				this.note('Ossido aggiunto fino a lasciarne in eccesso', true);
				this.say('ok', "Resta polvere nera sul fondo anche mescolando: l'acido è finito e l'ossido in eccesso non reagisce più.");
				this.next();
			} else if (id === 'filter' && this.phase === 2 && fl.contents.vol <= 0.01 && flask.contents.vol > 1) {
				this.say('ok', `Filtrato raccolto: ${fmt(flask.contents.vol, 1)} mL di soluzione azzurra limpida.`);
				this.next();
			} else if (id === 'evaporate' && this.phase === 4) {
				const d = this.L('EvapDish').contents;
				if (d.vol <= this.evap0 / 3) {
					this.note('Evaporazione fermata a un terzo del volume', true);
					this.say('ok', 'Ora basta: la soluzione è quasi satura. Spegni il gas.');
					this.next();
				}
			} else if (id === 'evaporate' && this.phase === 5) {
				const d = this.L('EvapDish').contents;
				if (d.vol < this.evap0 * 0.2 && this.quality === 1) {
					this.quality = 0.55;
					this.note('Evaporato troppo: cristalli piccoli e crosta sul bordo', false);
					this.say('warn', 'Stai evaporando troppo: si forma una crosta sul bordo. Spegni il gas!');
				}
			}
		}

		this.emitT += dt;
		if (this.emitT > 0.12) {
			this.emitT = 0;
			this.emit();
		}
	}
}
