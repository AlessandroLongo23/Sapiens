import { HighlightStyle, syntaxHighlighting, syntaxTree } from '@codemirror/language';
import { Prec, RangeSetBuilder, type Extension } from '@codemirror/state';
import { Decoration, EditorView, ViewPlugin, type DecorationSet, type ViewUpdate } from '@codemirror/view';
import { tags } from '@lezer/highlight';

/**
 * The colours of VS Code's default themes, read from Cursor's own theme files (extensions/theme-defaults/themes,
 * 3 October 2026): Dark Modern in the site's dark theme, Light Modern, its light twin, in the light one. Dark Modern
 * takes its token colours from Dark+ and Dark (VS), Light Modern from Light+ and Light (VS). The background stays the
 * site's paper.
 */
const PALETTE = {
	light: {
		fg: '#3B3B3B',
		keyword: '#AF00DB', // keyword.control
		storage: '#0000FF', // storage.type (def, class, lambda), constant.language, variable.language
		function: '#795E26', // entity.name.function, support.function
		type: '#267F99', // entity.name.class, support.type
		variable: '#001080', // variable, meta.definition.variable.name
		string: '#A31515',
		escape: '#EE0000',
		number: '#098658',
		comment: '#008000',
		gutter: '#6E7681',
		gutterActive: '#171184',
		selection: '#ADD6FF',
		cursor: '#000000',
		bracket1: '#0431FA', // editorBracketHighlight.foreground1-3
		bracket2: '#319331',
		bracket3: '#7B3814'
	},
	dark: {
		fg: '#CCCCCC',
		keyword: '#C586C0',
		storage: '#569CD6',
		function: '#DCDCAA',
		type: '#4EC9B0',
		variable: '#9CDCFE',
		string: '#CE9178',
		escape: '#D7BA7D',
		number: '#B5CEA8',
		comment: '#6A9955',
		gutter: '#6E7681',
		gutterActive: '#CCCCCC',
		selection: '#264F78',
		cursor: '#AEAFAD',
		bracket1: '#FFD700',
		bracket2: '#DA70D6',
		bracket3: '#179FFF'
	}
};

const vars = (colors: Record<string, string>) => Object.fromEntries(Object.entries(colors).map(([name, value]) => [`--code-${name}`, value]));
const v = (name: keyof typeof PALETTE.light) => `var(--code-${name})`;

const chrome = EditorView.theme({
	'&': { ...vars(PALETTE.light), color: v('fg'), backgroundColor: 'transparent', fontSize: '0.9375rem', height: '100%' },
	'.dark &': vars(PALETTE.dark),
	'&.cm-focused': { outline: 'none' },
	'.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.65' },
	'.cm-content': { padding: '0.75rem 0', caretColor: v('cursor') },
	'.cm-line': { padding: '0 0.75rem 0 0.5rem' },
	// opaque: the gutter stays put while a long line scrolls under it
	'.cm-gutters': { backgroundColor: 'var(--surface)', color: v('gutter'), border: 'none' },
	'.cm-lineNumbers .cm-gutterElement': { padding: '0 0.5rem 0 0.75rem', minWidth: '2.25rem' },
	'.cm-activeLine': { backgroundColor: 'color-mix(in oklab, var(--fg) 5%, transparent)' },
	'.cm-activeLineGutter': { backgroundColor: 'transparent', color: v('gutterActive') },
	'.cm-cursor': { borderLeftColor: v('cursor'), borderLeftWidth: '2px' },
	'&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground': { backgroundColor: v('selection') },
	'&.cm-focused .cm-matchingBracket': { backgroundColor: 'color-mix(in oklab, var(--fg) 12%, transparent)', outline: `1px solid ${v('gutter')}` },
	'.cm-py-type': { color: v('type') },
	'.cm-py-self': { color: v('storage') },
	'.cm-bracket-0': { color: v('bracket1') },
	'.cm-bracket-1': { color: v('bracket2') },
	'.cm-bracket-2': { color: v('bracket3') }
});

/** The TextMate scopes of Python, C and C++ in VS Code, on the tags of the Lezer grammars. */
const highlight = HighlightStyle.define([
	{ tag: [tags.controlKeyword, tags.moduleKeyword, tags.keyword, tags.processingInstruction], color: v('keyword') },
	{ tag: [tags.definitionKeyword, tags.operatorKeyword, tags.modifier, tags.bool, tags.null, tags.self, tags.standard(tags.typeName), tags.special(tags.name)], color: v('storage') },
	{ tag: [tags.typeName, tags.namespace], color: v('type') },
	{ tag: [tags.function(tags.variableName), tags.function(tags.definition(tags.variableName)), tags.function(tags.propertyName)], color: v('function') },
	{ tag: tags.definition(tags.className), color: v('type') },
	{ tag: [tags.variableName, tags.propertyName], color: v('variable') },
	{ tag: [tags.string, tags.special(tags.string), tags.character], color: v('string') },
	{ tag: tags.escape, color: v('escape') },
	{ tag: tags.number, color: v('number') },
	{ tag: tags.comment, color: v('comment') },
	{ tag: tags.meta, color: v('function') }
]);

/** Built-in classes, coloured as types the way Pylance does (`int("3")` is a class, not a function). */
const BUILTIN_TYPES = new Set(
	(
		'int float complex str bool bytes bytearray list tuple dict set frozenset range object type slice ' +
		'BaseException Exception ArithmeticError ZeroDivisionError ValueError TypeError IndexError KeyError NameError ' +
		'AttributeError RuntimeError RecursionError StopIteration AssertionError ImportError ModuleNotFoundError ' +
		'OverflowError FileNotFoundError NotImplementedError KeyboardInterrupt'
	).split(' ')
);
const OPEN = new Set(['(', '[', '{']);
const CLOSE = new Set([')', ']', '}']);
const TYPE = Decoration.mark({ class: 'cm-py-type' });
const SELF = Decoration.mark({ class: 'cm-py-self' });
const BRACKETS = [0, 1, 2].map((i) => Decoration.mark({ class: `cm-bracket-${i}` }));

/**
 * What the grammar cannot tell by itself: built-in classes, `self` and `cls`, and VS Code's bracket pair colours
 * (three colours by depth). It walks the whole program, which in a lesson is a few dozen lines.
 */
function decorate(view: EditorView): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	const doc = view.state.doc;
	let depth = 0;
	syntaxTree(view.state).iterate({
		enter: (node) => {
			if (node.name === 'VariableName') {
				const name = doc.sliceString(node.from, node.to);
				if (BUILTIN_TYPES.has(name)) builder.add(node.from, node.to, TYPE);
				else if (name === 'self' || name === 'cls') builder.add(node.from, node.to, SELF);
			} else if (node.to - node.from === 1) {
				const char = doc.sliceString(node.from, node.to);
				if (OPEN.has(char)) builder.add(node.from, node.to, BRACKETS[depth++ % 3]);
				else if (CLOSE.has(char)) builder.add(node.from, node.to, BRACKETS[(depth = Math.max(0, depth - 1)) % 3]);
			}
		}
	});
	return builder.finish();
}

const extras = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;
		constructor(view: EditorView) {
			this.decorations = decorate(view);
		}
		update(update: ViewUpdate) {
			if (update.docChanged || syntaxTree(update.startState) !== syntaxTree(update.state)) this.decorations = decorate(update.view);
		}
	},
	{ decorations: (plugin) => plugin.decorations }
);

/** Highest precedence draws these marks inside the highlighter's, so their colour wins over the token's. */
export const vscodeTheme: Extension = [chrome, syntaxHighlighting(highlight), Prec.highest(extras)];
