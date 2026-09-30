import type { MeshStandardMaterial } from 'three';
import type { LabScene } from './scene';
import { FreeLab, type FreeSnapshot } from './free';
import type { Notebook, NotebookTask } from './notebook';

/*
 * The vertical slice's small piece of work, on top of the free lab (free.ts): dissolve copper(II) sulfate crystals
 * in water by stirring, then pour the solution into a flask. Nothing tells the student what to do but the notebook,
 * which ticks the steps off as they happen.
 *
 * The crystals dissolve slowly by themselves and fast while stirred; CuSO₄·5H₂O, 249.7 g/mol.
 */

const MOLAR = 249.7;
const CRYSTALS = 5;

export type BancoSnapshot = FreeSnapshot & { tasks: NotebookTask[]; done: boolean };

type Step = { text: string; hint: string; check: () => boolean };

export class Banco {
	readonly free: FreeLab;
	private latched: boolean[];
	private steps: Step[];
	private listeners = new Set<() => void>();
	private snap: BancoSnapshot;
	private held = { beakerRod: false, beakerFlask: false };

	constructor(
		private s: LabScene,
		private notebook: Notebook
	) {
		this.free = new FreeLab(s);
		const grains = s.grains.get('Beaker');
		if (grains) {
			grains.grams = CRYSTALS;
			const m = grains.mesh.material as MeshStandardMaterial;
			m.color.set('#3d8ad8');
			m.roughness = 0.35;
		}
		const has = (name: string) => [s.hands.held('L')?.name, s.hands.held('R')?.name].includes(name);
		this.steps = [
			{
				text: 'Prendi il becher con i cristalli di solfato di rame.',
				hint: 'Punta il becher: clic sinistro per prenderlo con la mano sinistra, clic destro con la destra.',
				check: () => has('Beaker')
			},
			{
				text: "Prendi la bacchetta di vetro con l'altra mano.",
				hint: 'Una mano per oggetto: la mano libera prende la bacchetta.',
				check: () => this.held.beakerRod
			},
			{
				text: 'Mescola finché i cristalli si sciolgono.',
				hint: 'Con il becher e la bacchetta in mano, premi F per mescolare. Più volte, se serve.',
				check: () => (s.grains.get('Beaker')?.grams ?? 0) < 0.05
			},
			{
				text: 'Appoggia la bacchetta e prendi la beuta.',
				hint: 'Punta il banco e fai clic con la mano che tiene la bacchetta: la appoggia. Poi prendi la beuta.',
				check: () => this.held.beakerFlask
			},
			{
				text: 'Versa la soluzione nella beuta.',
				hint: 'Con il becher e la beuta in mano, premi F per versare.',
				check: () => (s.liquids.get('ConicalFlask')?.contents.vol ?? 0) > 40
			},
			{
				text: 'Appoggia tutto sul banco.',
				hint: 'Punta il banco e fai clic con ciascuna mano.',
				check: () => !s.hands.held('L') && !s.hands.held('R')
			}
		];
		this.latched = this.steps.map(() => false);
		const prev = s.onUpdate;
		s.onUpdate = (dt) => {
			prev(dt);
			this.update(dt);
		};
		this.free.subscribe(() => this.emit());
		this.snap = this.build();
		this.page();
	}

	subscribe = (fn: () => void) => {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	};

	getSnapshot = () => this.snap;

	private emit() {
		this.snap = this.build();
		for (const fn of this.listeners) fn();
	}

	private build(): BancoSnapshot {
		const now = this.latched.indexOf(false);
		return {
			...this.free.getSnapshot(),
			tasks: this.steps.map((st, i) => ({ text: st.text, state: this.latched[i] ? 'done' : i === now ? 'now' : 'todo' })),
			done: now === -1
		};
	}

	private page() {
		const now = this.latched.indexOf(false);
		this.notebook.draw({
			title: 'Il solfato di rame',
			intro:
				"Nel becher c'è acqua con dei cristalli azzurri di solfato di rame pentaidrato, CuSO₄·5H₂O. Sciogliili mescolando, poi versa la soluzione nella beuta. Guarda il colore dell'acqua mentre mescoli.",
			tasks: this.snap.tasks,
			hint: now >= 0 ? this.steps[now].hint : '',
			done:
				now === -1
					? "Il sale si è sciolto: gli ioni Cu²⁺ in acqua si circondano di molecole d'acqua, ed è questo a dare il colore azzurro. Più sale sciogli, più l'azzurro è intenso."
					: null
		});
	}

	private update(dt: number) {
		const s = this.s;
		this.notebook.update(dt);
		const grains = s.grains.get('Beaker');
		const lq = s.liquids.get('Beaker');
		if (grains && lq && grains.grams > 0 && lq.contents.vol > 1) {
			const d = Math.min(grains.grams, (0.004 + 0.9 * grains.swirl) * dt);
			grains.grams -= d;
			lq.contents.cu += d / MOLAR;
		}
		const names = [s.hands.held('L')?.name, s.hands.held('R')?.name];
		if (names.includes('Beaker') && names.includes('GlassRod')) this.held.beakerRod = true;
		if (this.latched[2] && names.includes('Beaker') && names.includes('ConicalFlask')) this.held.beakerFlask = true;
		const i = this.latched.indexOf(false);
		if (i >= 0 && this.steps[i].check()) {
			this.latched[i] = true;
			this.emit();
			this.page();
			// the notebook comes up by itself at the end
			if (this.latched.indexOf(false) === -1) this.notebook.open = true;
		}
	}
}
