import { Object3D, Quaternion, Vector3, Matrix4 } from 'three';

export type Ease = (t: number) => number;

export const ease = {
	linear: (t: number) => t,
	out: (t: number) => 1 - (1 - t) ** 3,
	in: (t: number) => t * t * t,
	inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
};

type Job = { t: number; dur: number; fn: (k: number, dt: number) => void; ease: Ease; done: () => void };

/** Runs time-based jobs from the render loop; every job is a promise, so actions read as scripts. */
export class Animator {
	private jobs: Job[] = [];

	run(dur: number, fn: (k: number, dt: number) => void, e: Ease = ease.inOut): Promise<void> {
		return new Promise((done) => this.jobs.push({ t: 0, dur: Math.max(dur, 1e-4), fn, ease: e, done }));
	}

	wait(dur: number) {
		return this.run(dur, () => {});
	}

	/** Calls fn every frame until it returns true. */
	until(fn: (dt: number) => boolean): Promise<void> {
		return new Promise((done) =>
			this.jobs.push({
				t: 0,
				dur: Infinity,
				ease: ease.linear,
				fn: (_k, dt) => {
					if (fn(dt)) {
						this.jobs = this.jobs.filter((j) => j.done !== done);
						done();
					}
				},
				done
			})
		);
	}

	update(dt: number) {
		const finished: Job[] = [];
		for (const j of [...this.jobs]) {
			j.t += dt;
			const k = Math.min(1, j.t / j.dur);
			j.fn(j.ease(k), dt);
			if (k >= 1) finished.push(j);
		}
		if (finished.length) {
			this.jobs = this.jobs.filter((j) => !finished.includes(j));
			for (const j of finished) j.done();
		}
	}

	get busy() {
		return this.jobs.length > 0;
	}
}

export type Pose = { position: Vector3; quaternion: Quaternion };

export function poseOf(o: Object3D): Pose {
	return { position: o.position.clone(), quaternion: o.quaternion.clone() };
}

/** Moves an object to a pose, lifting it on the way when `lift` is set so it clears what is on the bench. */
export function tweenPose(anim: Animator, o: Object3D, to: Pose, dur: number, lift = 0, e: Ease = ease.inOut) {
	const p0 = o.position.clone();
	const q0 = o.quaternion.clone();
	return anim.run(
		dur,
		(k) => {
			o.position.lerpVectors(p0, to.position, k);
			if (lift) o.position.y += Math.sin(Math.PI * k) * lift;
			o.quaternion.slerpQuaternions(q0, to.quaternion, k);
		},
		e
	);
}

const _m = new Matrix4();
const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();

/** The rotation that sends local +Y to `yAxis` and local +Z as close as possible to `zHint`. */
export function orient(yAxis: Vector3, zHint: Vector3): Quaternion {
	_y.copy(yAxis).normalize();
	_z.copy(zHint).addScaledVector(_y, -zHint.dot(_y));
	if (_z.lengthSq() < 1e-8) _z.set(0, 0, 1).addScaledVector(_y, -_y.z);
	_z.normalize();
	_x.crossVectors(_y, _z).normalize();
	_m.makeBasis(_x, _y, _z);
	return new Quaternion().setFromRotationMatrix(_m);
}

/** The position that puts the local point `local` of an object with rotation `q` on the world point `world`. */
export function placePoint(world: Vector3, local: Vector3, q: Quaternion) {
	return world.clone().sub(local.clone().applyQuaternion(q));
}
