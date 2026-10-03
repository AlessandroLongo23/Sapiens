/**
 * A worker of the sandbox. The iframe's origin is not the site's, and a worker can only start from a script of its
 * own origin: so it starts from a line made here, which imports the real script from the site (built by
 * scripts/codice/sandbox.mjs next to this one). The line is a classic script with a dynamic import: Chrome does not
 * start a module worker in a page without an origin.
 */
export function spawn(name: 'python' | 'clang' | 'wasi'): Worker {
	const script = new URL(`./${name}.worker.js`, import.meta.url).href;
	// an import that fails becomes the worker's error, which the runtimes listen for
	const line = `import(${JSON.stringify(script)}).catch((error) => setTimeout(() => { throw error; }));`;
	const start = URL.createObjectURL(new Blob([line], { type: 'text/javascript' }));
	const worker = new Worker(start);
	// every worker says 'ready' when its script has loaded
	worker.addEventListener('message', () => URL.revokeObjectURL(start), { once: true });
	return worker;
}
