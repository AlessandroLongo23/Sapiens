import { build, context } from 'esbuild';

/**
 * Builds the scripts of the sandbox the code editor runs its programs in (src/components/codice/sandbox.ts) into
 * public/codice/sandbox: the iframe's script and the three workers. Next does not build them: they run in a page
 * that is not the site's (src/app/codice-sandbox/route.ts), which loads them as files.
 *
 * It runs after every install and before `next dev` and `next build`. While working on those files:
 *
 *     node scripts/codice/sandbox.mjs --watch
 */
const from = 'src/components/codice';
const options = {
	entryPoints: { host: `${from}/sandbox-host.ts`, 'python.worker': `${from}/python.worker.ts`, 'clang.worker': `${from}/clang.worker.ts`, 'wasi.worker': `${from}/wasi.worker.ts` },
	outdir: 'public/codice/sandbox',
	bundle: true,
	format: 'esm',
	target: 'es2022',
	minify: true,
	logLevel: 'warning'
};

if (process.argv.includes('--watch')) {
	await (await context({ ...options, logLevel: 'info' })).watch();
} else {
	await build(options);
	console.log(`sandbox: scripts in ${options.outdir}`);
}
