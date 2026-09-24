/**
 * Writes an HTML page with 10 samples (spread across levels) for human review.
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/review.mts [generatorId] [outFile] [startSeed]
 *
 * LaTeX is rendered here to MathML with the local katex (throwOnError), so the
 * page needs no stylesheet or script from a CDN and can be published as an
 * Artifact. Parse errors are printed; exit code 1 if any. The questions for the
 * reviewer come from the "Domande per la revisione" section of the spec.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import katexModule from 'katex';
import { getGenerator } from '../../src/lib/exercises/v2/registry';
import { createRng, deriveSeed } from '../../src/lib/exercises/v2/rng';
import type { Sample } from '../../src/lib/exercises/v2/types';

const DEFAULT_OUT = join(tmpdir(), 'review-equazioni.html');
const KATEX_VERSION = '0.18.7';
// Samples per level: 2 + 1 + 1 + 2 + 2 + 2 = 10.
const PER_LEVEL: Record<number, number> = { 1: 2, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2 };

// jiti may hand us the CJS namespace; normalise to the katex object.
const katex = ((katexModule as unknown as { default?: typeof katexModule }).default ?? katexModule) as typeof katexModule;

const esc = (s: string): string =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function main(): Promise<number> {
	const [id = 'equazioni-secondo-grado', outArg = DEFAULT_OUT, seedArg = '1000'] = process.argv.slice(2);
	const gen = await getGenerator(id);
	let seed = Number(seedArg);
	const samples: Sample[] = [];
	for (const level of Object.keys(gen.levels).map(Number)) {
		const want = PER_LEVEL[level] ?? 2;
		const picked: Sample[] = [];
		const cases = new Set<unknown>();
		for (let tries = 0; picked.length < want && tries < 200; tries++, seed++) {
			const s = gen.generate(createRng(seed), level);
			// levels with cases (pura/spuria, delta = 0/delta < 0): show two different ones
			const c = s.params.case;
			if (c !== undefined && picked.length === want - 1 && cases.size === 1 && cases.has(c) && tries < 30) continue;
			if (s.answer.kind === 'choice') s.choice = s.answer;
			else if (gen.toChoice) s.choice = gen.toChoice(s, createRng(deriveSeed(seed, level)));
			cases.add(c);
			picked.push(s);
		}
		samples.push(...picked);
	}

	const answerLatex = (s: Sample): string => {
		const a = s.answer;
		if (a.kind === 'set' || a.kind === 'expression') return a.latex;
		if (a.kind === 'number') return a.value.replace(/^(-?)(\d+)\/(\d+)$/, '$1\\frac{$2}{$3}');
		return a.options[a.correct].latex;
	};
	const errors: string[] = [];
	const tex = (latex: string, display = false): string => {
		try {
			return `<span class="tex${display ? ' display' : ''}">${katex.renderToString(latex, { throwOnError: true, displayMode: display, output: 'mathml' })}</span>`;
		} catch (e) {
			errors.push(`${(e as Error).message} in: ${latex}`);
			return `<code>${esc(latex)}</code>`;
		}
	};

	const specPath = resolve('specs/exercises', `${id}.md`);
	const spec = existsSync(specPath) ? readFileSync(specPath, 'utf8') : '';
	const questions = (spec.split(/^## Domande per la revisione\s*$/m)[1] ?? '')
		.split(/^## /m)[0]
		.split(/\n(?=- )/)
		.map((q) => q.replace(/^- /, '').replace(/\s+/g, ' ').trim())
		.filter(Boolean);
	const inline = (t: string): string => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>');

	const levels = Object.entries(gen.levels)
		.map(([n, l]) => `<li><span class="lvl">${n}</span><div><strong>${esc(l.label)}</strong><p>${l.constraints.map(esc).join('; ')}</p></div></li>`)
		.join('');

	const cards = samples
		.map((s) => {
			const choice = s.choice
				? `<h4>Scelta multipla</h4><ol class="choice" type="A">${s.choice.options
						.map((o, i) => `<li${i === s.choice!.correct ? ' class="ok"' : ''}>${tex(o.latex)}${i === s.choice!.correct ? ' <span class="tag">corretta</span>' : ''}</li>`)
						.join('')}</ol>`
				: '';
			return `<article>
  <header><span class="chip">Livello ${s.level}</span><span class="label">${esc(gen.levels[s.level].label)}</span><span class="meta">seed ${s.seed}${s.params.case ? ` · ${esc(String(s.params.case))}` : ''}</span></header>
  <p class="prompt">${esc(s.prompt)}</p>
  <div class="problem">${tex(s.problem, true)}</div>
  <h4>Passaggi</h4>
  <ol class="steps">${s.steps.map((st) => `<li>${tex(st)}</li>`).join('')}</ol>
  <h4>Risposta attesa</h4>
  <div class="answer">${tex(answerLatex(s))}</div>
  ${choice}
  <details><summary>Parametri</summary><pre>${esc(JSON.stringify(s.params, null, 2))}</pre></details>
</article>`;
		})
		.join('\n');

	const html = `<title>Revisione ${esc(gen.title.toLowerCase())}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=IBM+Plex+Sans:wght@400;500;600&family=Literata:opsz,wght@7..72,500;7..72,600&display=swap">
<style>
:root {
  --ground: #f4f5f7; --card: #ffffff; --ink: #1b2130; --muted: #5d6576; --line: #dde1e8;
  --grid: #e3e8f1; --accent: #2b59c3; --accent-soft: #e7edfa; --ok: #1d7a4f; --ok-soft: #e4f3ea;
  --serif: "Literata", Georgia, serif; --sans: "IBM Plex Sans", system-ui, sans-serif; --mono: "IBM Plex Mono", ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --ground: #12151c; --card: #1a1f29; --ink: #e6e9ef; --muted: #9aa3b4; --line: #2c3342;
    --grid: #232a38; --accent: #8fb0ff; --accent-soft: #1f2a44; --ok: #6fd3a0; --ok-soft: #173327;
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --ground: #12151c; --card: #1a1f29; --ink: #e6e9ef; --muted: #9aa3b4; --line: #2c3342;
  --grid: #232a38; --accent: #8fb0ff; --accent-soft: #1f2a44; --ok: #6fd3a0; --ok-soft: #173327;
}
* { box-sizing: border-box; }
body { background: var(--ground); color: var(--ink); font: 16px/1.55 var(--sans); padding-inline: 16px; }
main { max-width: 760px; margin: 0 auto; padding-block: 32px 72px; display: grid; gap: 28px; }
h1, h2 { font-family: var(--serif); font-weight: 600; text-wrap: balance; margin: 0; }
h1 { font-size: 1.75rem; line-height: 1.2; }
h2 { font-size: 1.25rem; }
h4 { font: 600 .75rem/1 var(--sans); text-transform: uppercase; letter-spacing: .07em; color: var(--muted); margin: 18px 0 8px; }
p { margin: 0; }
.intro { display: grid; gap: 12px; max-width: 65ch; }
.intro .eyebrow { font: 500 .8rem var(--mono); color: var(--accent); }
section { display: grid; gap: 12px; }
.todo { background: var(--accent-soft); border-radius: 8px; padding: 16px 18px; display: grid; gap: 8px; }
.todo ol, .todo ul { margin: 0; padding-left: 1.2em; display: grid; gap: 6px; }
.levels { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.levels li { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; }
.levels p { color: var(--muted); font-size: .9rem; }
.lvl { font: 600 .9rem/28px var(--mono); text-align: center; border: 1px solid var(--line); border-radius: 6px; background: var(--card); }
article { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 18px 20px; overflow-x: auto; }
article header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 10px; }
.chip { font: 600 .75rem var(--mono); color: var(--accent); background: var(--accent-soft); padding: 2px 8px; border-radius: 99px; }
.label { font-weight: 600; }
.meta { font: .78rem var(--mono); color: var(--muted); }
.prompt { margin-top: 10px; color: var(--muted); }
.problem { margin-top: 8px; padding: 14px 12px; border-radius: 6px; overflow-x: auto; font-size: 1.15rem;
  background-color: var(--card);
  background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 18px 18px; border: 1px solid var(--line); }
.steps, .choice { margin: 0; padding-left: 1.4em; display: grid; gap: 8px; }
.steps li, .choice li { overflow-x: auto; }
.choice li.ok { background: var(--ok-soft); border-radius: 6px; padding: 2px 8px; }
.tag { color: var(--ok); font-size: .78rem; font-weight: 600; margin-left: 6px; }
.answer { overflow-x: auto; }
details { margin-top: 14px; }
summary { cursor: pointer; font-size: .85rem; color: var(--muted); }
summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
pre { font: .78rem/1.5 var(--mono); color: var(--muted); white-space: pre-wrap; margin: 8px 0 0; }
code { font: .88em var(--mono); }
.tex.display { display: block; text-align: center; }
math { font-size: 1.05em; }
.samples { display: grid; gap: 18px; }
</style>
<main>
<div class="intro">
  <span class="eyebrow">generatore ${esc(gen.id)}</span>
  <h1>${esc(gen.title)}: ${samples.length} esercizi da rivedere</h1>
  <p>Questi esercizi li produce un generatore, che li costruisce partendo dalla soluzione. Sono già stati controllati tutti con un sistema di calcolo simbolico, 1.000 per livello: i conti tornano. Resta da giudicare se sono esercizi buoni.</p>
</div>
<section class="todo">
  <h2>Cosa guardare</h2>
  <ul>
    <li>Il testo è quello di un libro, senza scritture strane?</li>
    <li>I passaggi sono corretti e nell'ordine in cui si fanno in classe?</li>
    <li>I distrattori della scelta multipla sono errori che uno studente farebbe davvero?</li>
  </ul>
  ${questions.length ? `<p><strong>In particolare:</strong></p><ul>${questions.map((q) => `<li>${inline(q)}</li>`).join('')}</ul>` : ''}
</section>
<section>
  <h2>I livelli</h2>
  <p>Seguono l'ordine del libro, e ogni livello aggiunge una sola difficoltà al precedente.</p>
  <ol class="levels">${levels}</ol>
</section>
<section>
  <h2>Gli esercizi</h2>
  <div class="samples">
${cards}
  </div>
</section>
</main>
`;
	const out = resolve(outArg);
	mkdirSync(dirname(out), { recursive: true });
	writeFileSync(out, html);
	console.log(`wrote ${samples.length} samples to ${out}`);
	if (errors.length) {
		console.error(`${errors.length} KaTeX parse errors:`);
		for (const e of errors) console.error(`  ${e}`);
		return 1;
	}
	return 0;
}

process.exitCode = await main();
