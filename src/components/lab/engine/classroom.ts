import { Mesh, Object3D, Quaternion, Vector3, type Scene } from 'three';
import { Avatar } from './avatar';
import { AvatarKit, headMaterial, randomLook, wearHead } from './avatar-kit';

/*
 * The other people in the room (scripts/lab/build_aula.py puts an empty `Station<n>` where each one stands): the
 * classmates at their desks and the teacher behind the bench. Every body is a clone of one loaded avatar, with a
 * head from the kit (avatar-kit.ts) chosen from a seed, so the class looks the same at every visit.
 *
 * For now they are staged, not driven by anyone: the students work at their half of the desk with the same arm IK
 * as the player's (hands moving over the bench, now and then one reaching further), the teacher gestures and turns
 * towards the class. When the shared lab exists, a person's record and pose will come from the network instead.
 */

const UP = new Vector3(0, 1, 0);
const FWD = new Vector3(0, 0, -1);
const RIGHT = new Vector3(1, 0, 0);

type Person = {
	avatar: Avatar;
	role: 'student' | 'teacher';
	/** Its own rhythm, so the class does not move in step. */
	phase: number;
	speed: number;
	yaw: number;
	base: Vector3;
};

export class Classroom {
	readonly people: Person[] = [];
	private time = 0;
	private _p = new Vector3();
	private _q = new Quaternion();
	private _q2 = new Quaternion();

	private constructor(private scene: Scene) {}

	/** Stands someone at every station but the player's. `avatarUrl` and `kitUrl` are the body and the heads. */
	static async create(scene: Scene, root: Object3D, avatarUrl: string, kitUrl: string) {
		const stations: Object3D[] = [];
		root.traverse((o) => {
			if (/^Station/.test(o.name) && !Number(o.userData.player)) stations.push(o);
		});
		const room = new Classroom(scene);
		if (!stations.length) return room;
		const [template, kit] = await Promise.all([Avatar.template(avatarUrl), AvatarKit.load(kitUrl)]);
		const material = headMaterial();
		stations.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
		stations.forEach((st, i) => {
			const avatar = Avatar.fromTemplate(template);
			const teacher = st.userData.role === 'teacher';
			const look = randomLook(teacher ? 1001 : i + 1);
			if (teacher) {
				look.hair = 'corti';
				look.hairColour = 5;
				look.beard = 'barba';
				look.glasses = { style: 'rettangolari', colour: '#2f3440' };
				look.hat = undefined;
			}
			wearHead(avatar.root, kit.head(look, material));
			avatar.showBody();
			st.updateWorldMatrix(true, false);
			const pos = new Vector3().setFromMatrixPosition(st.matrixWorld);
			const q = new Quaternion().setFromRotationMatrix(st.matrixWorld);
			const yaw = 2 * Math.atan2(q.y, q.w);
			avatar.root.position.copy(pos);
			avatar.root.rotation.set(0, yaw, 0);
			avatar.root.updateMatrixWorld(true);
			avatar.root.traverse((o) => {
				if ((o as Mesh).isMesh) (o as Mesh).castShadow = true;
			});
			scene.add(avatar.root);
			room.people.push({ avatar, role: teacher ? 'teacher' : 'student', phase: i * 1.7 + 0.3, speed: 0.8 + ((i * 37) % 10) / 25, yaw, base: pos });
		});
		return room;
	}

	update(dt: number) {
		this.time += dt;
		for (const p of this.people) {
			if (p.role === 'teacher') this.teach(p);
			else this.work(p);
			p.avatar.update(dt);
		}
	}

	/** Palm down over the bench, the fingers forward: the hand's rotation for a side. */
	private palmDown(p: Person, sign: number, roll = -1.3) {
		return this._q.setFromAxisAngle(UP, p.yaw).multiply(this._q2.setFromAxisAngle(FWD.clone().negate(), sign * roll)).clone();
	}

	/** At the desk: both hands over the half in front, moving slowly; now and then one goes further out and back. */
	private work(p: Person) {
		const t = this.time * p.speed + p.phase;
		const R = p.avatar.root;
		const fwd = this._p.copy(FWD).applyAxisAngle(UP, p.yaw).clone();
		const right = RIGHT.clone().applyAxisAngle(UP, p.yaw);
		// a reach every 9 s or so, eased in and out
		const cycle = (t % 9) / 9;
		const reach = cycle > 0.7 ? Math.sin(((cycle - 0.7) / 0.3) * Math.PI) : 0;
		for (const [side, sg] of [
			['R', 1],
			['L', -1]
		] as const) {
			const out = side === 'R' ? reach : 0;
			const target = R.position
				.clone()
				.add(new Vector3(0, 1.0 + 0.04 * Math.sin(t * 1.3 + sg) + 0.06 * out, 0))
				.addScaledVector(fwd, 0.4 + 0.05 * Math.sin(t * 0.9) + 0.18 * out)
				.addScaledVector(right, sg * (0.17 + 0.04 * Math.sin(t * 1.1 + sg * 0.7)) + 0.1 * out);
			p.avatar.setTarget(side, { p: target, q: this.palmDown(p, sg) });
		}
	}

	/** Behind the bench: one hand resting on it, the other gesturing now and then, turning a little to the class. */
	private teach(p: Person) {
		const t = this.time * 0.6 + p.phase;
		const R = p.avatar.root;
		const turn = 0.35 * Math.sin(t * 0.4);
		R.rotation.y = p.yaw + turn;
		const yaw = p.yaw + turn;
		const fwd = FWD.clone().applyAxisAngle(UP, yaw);
		const right = RIGHT.clone().applyAxisAngle(UP, yaw);
		const gesture = Math.max(0, Math.sin(t * 0.7));
		const rest = R.position.clone().add(new Vector3(0, 0.98, 0)).addScaledVector(fwd, 0.38).addScaledVector(right, -0.2);
		p.avatar.setTarget('L', { p: rest, q: this.palmDown({ ...p, yaw }, -1) });
		const hand = R.position
			.clone()
			.add(new Vector3(0, 1.05 + 0.3 * gesture, 0))
			.addScaledVector(fwd, 0.3 + 0.15 * gesture)
			.addScaledVector(right, 0.22 + 0.05 * Math.sin(t * 1.7));
		p.avatar.setTarget('R', { p: hand, q: this.palmDown({ ...p, yaw }, 1, -1.3 + 1.1 * gesture) });
	}

	dispose() {
		for (const p of this.people) this.scene.remove(p.avatar.root);
	}
}
