import { Clang } from './clang';
import { Javascript } from './javascript';
import { Python } from './python';
import type { Runtime } from './runtime';
import type { Engine, FromSandbox, ToSandbox } from './sandbox';

/**
 * The sandbox's side of sandbox.ts: the script of the iframe the programs run in (src/app/codice-sandbox/route.ts).
 * It has the runtimes and their workers, takes its orders from the page that made the iframe and sends back what a
 * program prints. scripts/codice/sandbox.mjs builds it, with the workers, into public/codice/sandbox.
 */

/** The site: this script comes from it, the iframe's own origin is no one's. */
const SITE = new URL(import.meta.url).origin;

const runtimes: Partial<Record<Engine, Runtime>> = {};
const MAKE: Record<Engine, () => Runtime> = { python: () => new Python(), clang: () => new Clang(), javascript: () => new Javascript() };
const runtime = (engine: Engine) => (runtimes[engine] ??= MAKE[engine]());

const post = (message: FromSandbox) => parent.postMessage(message, SITE);

addEventListener('message', (event: MessageEvent<ToSandbox>) => {
	if (event.source !== parent || event.origin !== SITE) return;
	const order = event.data;
	const { engine } = order;
	if (!Object.hasOwn(MAKE, engine)) return;
	if (order.op === 'load') {
		void runtime(engine)
			.load()
			.then((ok) => post({ type: 'loaded', engine, request: order.request, ok }));
	} else if (order.op === 'stop') runtime(engine).stop();
	else if (order.op === 'run') {
		const { run } = order;
		void runtime(engine)
			.run(order.job, {
				onChunk: (chunk) => post({ type: 'chunk', run, chunk }),
				onStatus: (text) => post({ type: 'status', run, text }),
				onStart: () => post({ type: 'start', run })
			})
			.then((result) => post({ type: 'result', engine, run, result, ready: runtime(engine).ready }));
	}
});

post({ type: 'ready' });
