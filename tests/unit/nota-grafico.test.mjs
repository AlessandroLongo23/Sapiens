// A graph of the plotter inside a note: how it is written in the note's markdown and drawn where the note is read.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { PLOT_FENCE, plotFence } = await jiti.import('../../src/lib/zaino/plot-block.ts');
const { renderNoteMarkdown } = await jiti.import('../../src/lib/content/note-markdown.ts');
const { decodeState, encodeState, stateOf } = await jiti.import('../../src/lib/grafico/documento.ts');

const code = encodeState(stateOf(['y=x^2']));
const ID = '2a481919-9198-41ca-8e08-07dd96484d14';

test('a graph is a fenced block, with the saved graph it came from on a second line', () => {
	const alone = plotFence({ code, from: null, name: null });
	assert.equal(alone, `\`\`\`plotter\n${code}\n\`\`\``);
	assert.deepEqual(PLOT_FENCE.exec(`${alone}\n\ntesto`).slice(1, 4), [code, undefined, undefined]);
	const loaded = plotFence({ code, from: ID, name: 'La  mia\nparabola' });
	assert.deepEqual(PLOT_FENCE.exec(loaded).slice(1, 4), [code, ID, 'La mia parabola']);
	// an empty block, just added
	assert.equal(PLOT_FENCE.exec(plotFence({ code: '', from: null, name: null }))[1], '');
	// any other fence is code
	assert.equal(PLOT_FENCE.exec('```python\nprint(1)\n```'), null);
	assert.equal(decodeState(PLOT_FENCE.exec(alone)[1]).rows[0].latex, 'y=x^2');
});

test('where a note is read, a graph is a box that carries it', () => {
	const html = renderNoteMarkdown(`Prima\n\n${plotFence({ code, from: ID, name: 'Parabola <b>' })}\n\nDopo`, null);
	assert.match(html, new RegExp(`<div class="note-plot-static" data-plot="${code}"><span>Parabola &lt;b&gt;</span></div>`));
	assert.match(html, /<p>Dopo<\/p>/);
	// a fence that is not a graph stays code, and so does one with something else in the graph's place
	assert.match(renderNoteMarkdown('```plotter\n<script>\n```', null), /<pre><code/);
	assert.match(renderNoteMarkdown('```python\nprint(1)\n```', null), /<pre><code/);
});
