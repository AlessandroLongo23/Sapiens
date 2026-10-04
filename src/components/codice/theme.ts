import { HighlightStyle, syntaxHighlighting, syntaxTree } from '@codemirror/language';
import { Prec, RangeSetBuilder, type Extension } from '@codemirror/state';
import { Decoration, EditorView, ViewPlugin, type DecorationSet, type ViewUpdate } from '@codemirror/view';
import { tags } from '@lezer/highlight';

import type { ThemeId } from './settings';

interface Colors {
	fg: string;
	keyword: string;
	storage: string;
	function: string;
	type: string;
	variable: string;
	string: string;
	escape: string;
	number: string;
	comment: string;
	gutter: string;
	gutterActive: string;
	selection: string;
	cursor: string;
	bracket1: string;
	bracket2: string;
	bracket3: string;
}

/**
 * The colours of each theme, for the site's light theme and for its dark one. The background is always the site's
 * paper: a theme is the colours of the code on it.
 *
 * Modern, the default, is VS Code's own: Light Modern and Dark Modern, read from Cursor's theme files
 * (extensions/theme-defaults/themes, 3 October 2026). The token colours of Dark Modern come from Dark+ and Dark (VS),
 * those of Light Modern from Light+ and Light (VS). GitHub, One (Atom's One Light and One Dark) and Solarized are
 * written from their published palettes; a few colours are darker or lighter than the original so that comments
 * and selections can be seen on the site's paper.
 */
const PALETTES: Record<ThemeId, { light: Colors; dark: Colors }> = {
	modern: {
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
	},
	github: {
		light: {
			fg: '#24292F',
			keyword: '#CF222E',
			storage: '#CF222E',
			function: '#8250DF',
			type: '#953800',
			variable: '#24292F',
			string: '#0A3069',
			escape: '#0550AE',
			number: '#0550AE',
			comment: '#6E7781',
			gutter: '#8C959F',
			gutterActive: '#24292F',
			selection: '#B6E3FF',
			cursor: '#24292F',
			bracket1: '#0550AE',
			bracket2: '#1A7F37',
			bracket3: '#953800'
		},
		dark: {
			fg: '#C9D1D9',
			keyword: '#FF7B72',
			storage: '#FF7B72',
			function: '#D2A8FF',
			type: '#FFA657',
			variable: '#C9D1D9',
			string: '#A5D6FF',
			escape: '#79C0FF',
			number: '#79C0FF',
			comment: '#8B949E',
			gutter: '#6E7681',
			gutterActive: '#C9D1D9',
			selection: '#1F4273',
			cursor: '#C9D1D9',
			bracket1: '#79C0FF',
			bracket2: '#56D364',
			bracket3: '#E3B341'
		}
	},
	one: {
		light: {
			fg: '#383A42',
			keyword: '#A626A4',
			storage: '#A626A4',
			function: '#4078F2',
			type: '#C18401',
			variable: '#E45649',
			string: '#50A14F',
			escape: '#0184BC',
			number: '#986801',
			comment: '#8A8B91',
			gutter: '#9D9D9F',
			gutterActive: '#383A42',
			selection: '#D3D5DC',
			cursor: '#526FFF',
			bracket1: '#4078F2',
			bracket2: '#A626A4',
			bracket3: '#C18401'
		},
		dark: {
			fg: '#ABB2BF',
			keyword: '#C678DD',
			storage: '#C678DD',
			function: '#61AFEF',
			type: '#E5C07B',
			variable: '#E06C75',
			string: '#98C379',
			escape: '#56B6C2',
			number: '#D19A66',
			comment: '#7F848E',
			gutter: '#636D83',
			gutterActive: '#ABB2BF',
			selection: '#3E4451',
			cursor: '#528BFF',
			bracket1: '#61AFEF',
			bracket2: '#C678DD',
			bracket3: '#E5C07B'
		}
	},
	solarized: {
		light: {
			fg: '#586E75',
			keyword: '#859900',
			storage: '#268BD2',
			function: '#268BD2',
			type: '#B58900',
			variable: '#586E75',
			string: '#2AA198',
			escape: '#CB4B16',
			number: '#D33682',
			comment: '#839496',
			gutter: '#93A1A1',
			gutterActive: '#586E75',
			selection: '#DDD6C1',
			cursor: '#586E75',
			bracket1: '#268BD2',
			bracket2: '#859900',
			bracket3: '#B58900'
		},
		dark: {
			fg: '#93A1A1',
			keyword: '#859900',
			storage: '#268BD2',
			function: '#268BD2',
			type: '#B58900',
			variable: '#93A1A1',
			string: '#2AA198',
			escape: '#CB4B16',
			number: '#D33682',
			comment: '#657B83',
			gutter: '#586E75',
			gutterActive: '#93A1A1',
			selection: '#0A4A5A',
			cursor: '#93A1A1',
			bracket1: '#268BD2',
			bracket2: '#859900',
			bracket3: '#B58900'
		}
	}
};

const vars = (colors: Colors) => Object.fromEntries(Object.entries(colors).map(([name, value]) => [`--code-${name}`, value]));
const v = (name: keyof Colors) => `var(--code-${name})`;

const chrome = EditorView.theme({
	'&': { color: v('fg'), backgroundColor: 'transparent', height: '100%' },
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
export const editorLook: Extension = [chrome, syntaxHighlighting(highlight), Prec.highest(extras)];

/** The colours of one theme: every colour above is a variable, and this gives them their values. */
export const themeColors = (theme: ThemeId): Extension => EditorView.theme({ '&': vars(PALETTES[theme].light), '.dark &': vars(PALETTES[theme].dark) });

/** The size of the code's text, in pixels at the browser's own text size: it grows with it. */
export const textSize = (size: number): Extension => EditorView.theme({ '&': { fontSize: `${size / 16}rem` } });

/** A theme's colours for the picture of it in the settings. */
export const themeSample = (theme: ThemeId) => PALETTES[theme];
