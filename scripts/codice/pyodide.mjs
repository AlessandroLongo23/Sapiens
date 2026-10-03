import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Puts Pyodide in public/pyodide, where the Python worker (src/components/codice/python.worker.ts) loads it from the
 * site's own origin: no CDN at run time, so the Content Security Policy stays as it is and no student's address goes
 * to a third party. Runs after every `npm install`; the folder is not committed.
 *
 * The runtime comes from the npm package. The packages a lesson may import (numpy, matplotlib and what they need) are
 * not in it: they are downloaded once from Pyodide's release on jsDelivr, checked against the hashes of the lock file,
 * and kept while the hash matches.
 */
const RUNTIME = ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
const PACKAGES = ['numpy', 'matplotlib'];

const from = join('node_modules', 'pyodide');
const to = join('public', 'pyodide');
const mb = (bytes) => `${(bytes / 1e6).toFixed(1)} MB`;

mkdirSync(to, { recursive: true });
let runtime = 0;
for (const file of RUNTIME) {
	copyFileSync(join(from, file), join(to, file));
	runtime += statSync(join(to, file)).size;
}
console.log(`pyodide: runtime in ${to} (${mb(runtime)})`);

const { version } = JSON.parse(readFileSync(join(from, 'package.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(from, 'pyodide-lock.json'), 'utf8')).packages;
const needed = new Set();
const add = (name) => {
	if (needed.has(name)) return;
	needed.add(name);
	lock[name].depends.forEach(add);
};
PACKAGES.forEach(add);

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
let fetched = 0;
let total = 0;
try {
	for (const name of [...needed].sort()) {
		const { file_name: file, sha256: hash } = lock[name];
		const path = join(to, file);
		if (!existsSync(path) || sha256(readFileSync(path)) !== hash) {
			const response = await fetch(`https://cdn.jsdelivr.net/pyodide/v${version}/full/${file}`);
			if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
			const buffer = Buffer.from(await response.arrayBuffer());
			if (sha256(buffer) !== hash) throw new Error(`${file}: the hash does not match the lock file`);
			writeFileSync(path, buffer);
			fetched++;
		}
		total += statSync(path).size;
	}
	console.log(`pyodide: ${needed.size} packages for ${PACKAGES.join(', ')} (${mb(total)}, ${fetched} downloaded)`);
} catch (error) {
	// An install without the network still works; only the lessons that import these packages will not.
	console.warn(`pyodide: packages not downloaded (${error.message}); numpy and matplotlib will not load`);
}
