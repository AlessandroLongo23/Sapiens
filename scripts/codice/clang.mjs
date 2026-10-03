import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Puts the C and C++ compiler (@yowasp/clang: Clang and LLD built for WebAssembly, with its headers and libraries) in
 * public/clang, where the compiler's worker (src/components/codice/clang.worker.ts) loads it from the site's own
 * origin. Runs after every `npm install`; the folder is not committed (105 MB, about 20 MB over the network with
 * Brotli). A file already there with the same size is left alone.
 */
const from = join('node_modules', '@yowasp', 'clang', 'gen');
const to = join('public', 'clang');

mkdirSync(to, { recursive: true });
let bytes = 0;
let copied = 0;
for (const file of readdirSync(from)) {
	const size = statSync(join(from, file)).size;
	bytes += size;
	if (existsSync(join(to, file)) && statSync(join(to, file)).size === size) continue;
	copyFileSync(join(from, file), join(to, file));
	copied++;
}
console.log(`clang: compiler in ${to} (${(bytes / 1e6).toFixed(1)} MB, ${copied} files copied)`);
