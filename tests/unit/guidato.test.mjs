// The guided exercise of a lesson: a ```guidato block of the lesson's markdown, read into its steps and stops, and
// the answers of its stops as the grader of the exercises judges them. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { guidedFences, parseGuidedBlock, judgeSliders, readConditions } = await jiti.import('../../src/lib/guidato/blocco.ts');
const { gradeGuided, checkGuided, readGuidedRequest } = await jiti.import('../../src/lib/guidato/correzione.ts');
const { answerLatex } = await jiti.import('../../src/lib/guidato/scrittura.ts');

const BLOCK = [
	'% nome: retta-per-due-punti',
	'% titolo: Una retta per due punti',
	'',
	'Trova la retta per $A(0, 1)$ e $B(2, 5)$.',
	'',
	'```tikz',
	'% nome: figura',
	'',
	'\\draw (0,0) -- (1,1);',
	'```',
	'',
	'?? cursore: Porta $m$ finché la retta passa per $B$.',
	'```grafico',
	'% nome: retta-m',
	'% alt: La retta y = mx + 1 con il cursore di m',
	'curva: y=mx+1',
	'cursore: m = 0 da -4 a 4 passo 0,5',
	'```',
	'atteso: m = 2',
	'errore: m = -2 :: La retta scende.',
	'errore: m > 2 :: Troppo ripida.',
	'aiuto: Guarda il punto $B$.',
	'',
	'Il coefficiente angolare è $2$.',
	'',
	'?? scegli: Dove incontra l\'asse $y$?',
	'giusta: In $(0, 1)$',
	'sbagliata: In $(1, 0)$ :: Hai scambiato le coordinate.',
	'spiegazione: Per $x = 0$ resta $q$.',
	'',
	'?? scrivi: Scrivi l\'equazione.',
	'retta: 2*x + 1',
	'mostra: $y = 2x + 1$',
	'errore: 2*x - 1 :: Controlla il segno di $q$.',
	'',
	'?? scrivi: Per quale $x$ vale $0$?',
	'numero: -1/2',
	'errore: 1/2 :: Il segno.',
	'errore: -2 :: Hai diviso al contrario.',
	'',
	'Fine.'
].join('\n');

test('a guided block is found with the blocks it holds', () => {
	const lesson = `# Titolo\n\nPrima.\n\n\`\`\`guidato\n${BLOCK}\n\`\`\`\n\nDopo.\n\n\`\`\`grafico\n% nome: fuori\n\`\`\`\n`;
	const found = guidedFences(lesson);
	assert.equal(found.length, 1);
	assert.equal(found[0].body, BLOCK + '\n');
	assert.equal(lesson.slice(found[0].index, found[0].index + found[0].length), `\`\`\`guidato\n${BLOCK}\n\`\`\``);
	// a block left open is not a block: the lesson's check counts the fences
	assert.deepEqual(guidedFences('```guidato\n% nome: a\n\nTesto.\n'), []);
});

test('the steps and the stops of a block are read in order', () => {
	const { block, errors } = parseGuidedBlock(BLOCK);
	assert.deepEqual(errors, []);
	assert.deepEqual([block.name, block.title], ['retta-per-due-punti', 'Una retta per due punti']);
	assert.deepEqual(block.parts.map((p) => p.kind), ['text', 'slider', 'text', 'choice', 'write', 'write', 'text']);
	// a figure inside the text stays with it, blank lines included
	assert.match(block.parts[0].markdown, /```tikz\n% nome: figura\n\n\\draw/);
	const [, slider, , choice, line, number] = block.parts;
	assert.deepEqual(slider.expected, [{ name: 'm', op: '=', value: 2 }]);
	assert.deepEqual(slider.errors.map((e) => e.when[0].op), ['=', '>']);
	assert.match(slider.plot, /^% nome: retta-m\n/);
	assert.equal(slider.hint, 'Guarda il punto $B$.');
	assert.deepEqual(choice.options.map((o) => o.right), [true, false]);
	assert.equal(choice.explanation, 'Per $x = 0$ resta $q$.');
	assert.deepEqual(line.grading, { grade: 'form', form: 'explicit' });
	assert.deepEqual(line.answer, { kind: 'expression', value: '2*x + 1', latex: '' });
	assert.deepEqual(number.answer, { kind: 'number', value: '-1/2' });
	assert.deepEqual([slider.number, choice.number, line.number, number.number], [1, 2, 3, 4]);
});

test('the kinds of written answer', () => {
	const stop = (lines) => parseGuidedBlock(`% nome: a\n% titolo: A\n\nTesto.\n\n?? scrivi: Domanda?\n${lines}\n\nFine.`);
	assert.deepEqual(stop('numero: 2,5').block.parts[1].answer, { kind: 'number', value: '25/10' });
	assert.deepEqual(stop('insieme: 0; 3/2\nmostra: $x = 0 \\lor x = \\dfrac{3}{2}$').block.parts[1].answer.values, ['0', '3/2']);
	assert.equal(stop('insieme: R\nmostra: $\\mathbb{R}$').block.parts[1].answer.universal, true);
	assert.deepEqual(stop('esclusi: 3\nmostra: $x \\neq 3$').block.parts[1].grading, { grade: 'value', set: 'excluded' });
	assert.deepEqual(stop('espressione: (x-1)*(x+2)\nforma: scomposta').block.parts[1].grading, { grade: 'form', form: 'factored' });
	assert.match(stop('insieme: 0; 2').errors[0], /serve "mostra:"/);
	assert.match(stop('numero: due').errors[0], /numero non letto/);
	assert.match(stop('numero: 2\nforma: scomposta').errors[0], /a un numero/);
	assert.match(stop('errore: 3 :: no').errors[0], /manca la risposta attesa/);
	assert.match(stop('numero: 2\nerrore: 3').errors[0], /errore non letto/);
});

test('what an author gets wrong is said, stop by stop', () => {
	const said = (source) => parseGuidedBlock(source).errors.join(' | ');
	assert.match(said('Testo.\n\n?? scrivi: D?\nnumero: 1\n\nFine.'), /manca "% nome:".*manca "% titolo:"/);
	assert.match(said('% nome: a\n% titolo: A\n\nSolo testo.'), /nessuna fermata/);
	assert.match(said('% nome: a\n% titolo: A\n\n?? scrivi: D?\nnumero: 1\n\nFine.'), /serve la consegna/);
	assert.match(said('% nome: a\n% titolo: A\n\nTesto.\n\n?? scrivi: D?\nnumero: 1'), /dopo l'ultima fermata/);
	assert.match(said('% nome: a\n% titolo: A\n\nTesto.\n\n?? vola: D?\n\nFine.'), /fermata 1: tipo di fermata sconosciuto/);
	assert.match(said('% nome: a\n% titolo: A\n\nTesto.\n\n?? scegli: D?\nsbagliata: A :: no\n\nFine.'), /manca l'opzione giusta/);
	assert.match(said('% nome: a\n% titolo: A\n\nTesto.\n\n?? scegli: D?\ngiusta: A\n\nFine.'), /almeno un'opzione sbagliata/);
	assert.match(said('% nome: a\n% titolo: A\n\nTesto.\n\n?? cursore: D?\natteso: k = 1\n\nFine.'), /serve un blocco ```grafico/);
	assert.match(said('% nome: a\n% titolo: A\n\nTesto.\n\n?? scrivi: D?\nnumero: 1\n\nMezzo.\n\n?? scrivi: \nnumero: 1\nboh: 2\n\nFine.'), /fermata 2: manca la domanda.*fermata 2: riga sconosciuta/);
});

test('sliders are judged where they are left', () => {
	const stop = { expected: readConditions('k = -3'), tolerance: 0, errors: [{ when: readConditions('k = 3') }, { when: readConditions('k > -3 e k < 0') }] };
	assert.deepEqual(judgeSliders(stop, { k: -3 }), { correct: true });
	assert.deepEqual(judgeSliders(stop, { k: 3 }), { correct: false, error: 0 });
	assert.deepEqual(judgeSliders(stop, { k: -1 }), { correct: false, error: 1 });
	assert.deepEqual(judgeSliders(stop, { k: -5 }), { correct: false });
	assert.deepEqual(judgeSliders({ ...stop, tolerance: 0.05 }, { k: -2.96 }), { correct: true });
	assert.equal(readConditions('k = tre'), null);
	assert.deepEqual(readConditions('h = 0,5 e k < -1'), [{ name: 'h', op: '=', value: 0.5 }, { name: 'k', op: '<', value: -1 }]);
});

test('a written answer is graded by the grader of the exercises, foreseen mistakes included', () => {
	const { block } = parseGuidedBlock(BLOCK);
	const [, , , , line, number] = block.parts;
	assert.deepEqual(gradeGuided(number, '-\\frac{1}{2}'), { correct: true });
	assert.deepEqual(gradeGuided(number, 'x=-0{,}5'), { correct: true });
	assert.equal(gradeGuided(number, '-\\frac{2}{4}').correct, true);
	assert.deepEqual(gradeGuided(number, '\\frac{1}{2}'), { correct: false, error: 0 });
	assert.deepEqual(gradeGuided(number, '-2'), { correct: false, error: 1 });
	assert.deepEqual(gradeGuided(number, '7'), { correct: false });
	assert.equal(gradeGuided(number, '1-\\frac{3}{2}').correct, false);
	assert.deepEqual(gradeGuided(line, 'y=2x+1'), { correct: true });
	assert.deepEqual(gradeGuided(line, 'y=1+2x'), { correct: true });
	assert.deepEqual(gradeGuided(line, 'y=2x-1'), { correct: false, error: 0 });
	// the right line, not in the form asked: the grader's own message, not a foreseen mistake
	assert.match(gradeGuided(line, '2x-y+1=0').message, /forma esplicita/);
});

test('the answer of a stop as the lesson writes it', () => {
	assert.equal(answerLatex({ kind: 'number', value: '-3/2' }, { grade: 'value' }), '-\\frac{3}{2}');
	assert.equal(answerLatex({ kind: 'expression', value: '2*x + 1', latex: '' }, { grade: 'form', form: 'explicit' }), 'y=2x+1');
	assert.equal(answerLatex({ kind: 'expression', value: '(1/3)**x - 3', latex: '' }, { grade: 'value' }), '\\left(\\frac{1}{3}\\right)^{x}-3');
	assert.equal(answerLatex({ kind: 'set', values: ['0', '2'], latex: '' }, { grade: 'value' }), '\\left\\lbrace 0;2\\right\\rbrace');
});

test('the check of a block: answers the grader fails, sliders that cannot get there', () => {
	assert.deepEqual(checkGuided(parseGuidedBlock(BLOCK).block), []);
	const said = (lines) => checkGuided(parseGuidedBlock(`% nome: a\n% titolo: A\n\nTesto.\n\n${lines}\n\nFine.`).read).join(' | ');
	assert.match(said('?? scrivi: D?\nnumero: -2\nmostra: $-3$'), /il correttore boccia la risposta attesa/);
	assert.match(said('?? scrivi: D?\nnumero: -2\nerrore: -4/2 :: no'), /è una risposta che il correttore accetta/);
	assert.match(said('?? scrivi: D?\nnumero: -2\nerrore: 3 :: a\nerrore: 6/2 :: b'), /scritto due volte/);
	assert.match(said('?? scrivi: D?\nespressione: 2*x^2'), /sintassi di SymPy/);
	assert.equal(said('?? scrivi: D?\ninsieme: 0; 2\nmostra: $x = 0 \\lor x = 2$\nerrore: 2 :: Ne manca una.\nerrore: vuoto :: Ci sono.'), '');
	assert.equal(said('?? scrivi: D?\nesclusi: 3\nmostra: $x \\neq 3$\nerrore: -3 :: Il segno.'), '');
	const plot = (slider, rest) => `?? cursore: D?\n\`\`\`grafico\n% nome: p\n% alt: P\ncurva: y=x+k\ncursore: ${slider}\n\`\`\`\n${rest}`;
	assert.match(said(plot('k = 0 da -2 a 2 passo 0,5', 'atteso: k = -3')), /fuori dall'intervallo/);
	assert.match(said(plot('k = 0 da -2 a 2 passo 0,5', 'atteso: k = 0,75')), /non si raggiunge con il passo/);
	assert.match(said(plot('k = 1 da -2 a 2 passo 0,5', 'atteso: k = 1')), /partono già/);
	assert.match(said(plot('k = 0 da -2 a 2 passo 0,5', 'atteso: h = 1')), /non ha il cursore h/);
	assert.match(said(plot('k = 0 da -2 a 2 passo 0,5', 'atteso: k = 1\nerrore: k = 1 :: no')), /coincide con la risposta attesa/);
	assert.match(said(plot('k = 0 da -2 a 2 passo 0,5', 'atteso: k = 1\ntolleranza: 0,5')), /tolleranza/);
	assert.equal(said(plot('k = 0 da -2 a 2 passo 0,1', 'atteso: k = 1,3\ntolleranza: 0,05\nerrore: k = -1,3 :: Il segno.')), '');
});

test('what the page sends to be graded is read, or refused', () => {
	const ok = { answer: { kind: 'number', value: '-2' }, grading: { grade: 'value' }, errors: [{ kind: 'number', value: '3' }], latex: '-2' };
	assert.deepEqual(gradeGuided(readGuidedRequest(ok).stop, ok.latex), { correct: true });
	assert.equal(readGuidedRequest({ ...ok, latex: '' }), null);
	assert.equal(readGuidedRequest({ ...ok, latex: 'x'.repeat(2001) }), null);
	assert.equal(readGuidedRequest({ ...ok, grading: { grade: 'run' } }), null);
	assert.equal(readGuidedRequest({ ...ok, answer: { kind: 'number', value: '1e9' } }), null);
	assert.equal(readGuidedRequest({ ...ok, errors: [{ kind: 'set', values: [] }] }), null);
	assert.equal(readGuidedRequest({ ...ok, errors: Array(13).fill({ kind: 'number', value: '1' }) }), null);
});
