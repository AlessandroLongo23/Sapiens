import { build, context } from 'esbuild';

/**
 * Builds the scripts of the sandbox the code editor runs its programs in (src/components/codice/sandbox.ts) into
 * public/codice/sandbox: the iframe's script, the workers, and the script of the preview of a web page. Next does
 * not build them: they run in pages that are not the site's (src/app/codice-sandbox), which load them as files.
 *
 * It runs after every install and before `next dev` and `next build`. While working on those files:
 *
 *     node scripts/codice/sandbox.mjs --watch
 */
const from = 'src/components/codice';
const shared = { outdir: 'public/codice/sandbox', bundle: true, target: 'es2022', minify: true, logLevel: 'warning' };
const builds = [
	// modules: the sandbox's script, and the workers it starts by importing them
	{
		...shared,
		format: 'esm',
		entryPoints: {
			host: `${from}/sandbox-host.ts`,
			'python.worker': `${from}/python.worker.ts`,
			'clang.worker': `${from}/clang.worker.ts`,
			'wasi.worker': `${from}/wasi.worker.ts`,
			'javascript.worker': `${from}/javascript.worker.ts`
		}
	},
	// a classic script: it reads where it comes from in document.currentScript
	{ ...shared, format: 'iife', entryPoints: { pagina: `${from}/pagina.ts` } }
];

if (process.argv.includes('--watch')) {
	for (const options of builds) await (await context({ ...options, logLevel: 'info' })).watch();
} else {
	for (const options of builds) await build(options);
	console.log(`sandbox: scripts in ${shared.outdir}`);
}
