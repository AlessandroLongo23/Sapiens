import { Extension, type Editor, type Range } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { Suggestion, type SuggestionProps } from '@tiptap/suggestion';
import { filterSlash, type SlashItem } from './slash-items';

/** What the editor's page hands the one menu SimpleEditor draws. */
export interface SlashHandlers {
	/** The menu opens, or what was typed after the slash changed. */
	show: (props: SuggestionProps<SlashItem, SlashItem>) => void;
	hide: () => void;
	/** Arrows, Enter and Tab while the menu is open; true when the menu used the key. */
	keyDown: (event: KeyboardEvent) => boolean;
	/** A command was chosen: the slash and what followed it are already gone. */
	run: (item: SlashItem, editor: Editor) => void;
}

/**
 * The slash menu of the Simple editor (see ./slash-items): `/` at the start of
 * a line or after a space, never in the middle of a word, in code or in a
 * code block. A space closes it, Escape too, leaving the slash as typed.
 */
export const SlashCommands = Extension.create<{ handlers: SlashHandlers | null }>({
	name: 'slashCommands',
	addOptions() {
		return { handlers: null };
	},
	addProseMirrorPlugins() {
		const handlers = this.options.handlers;
		if (!handlers) return [];
		return [
			Suggestion<SlashItem, SlashItem>({
				editor: this.editor,
				pluginKey: new PluginKey('slashCommands'),
				char: '/',
				allow: ({ state, range }) => {
					const $from = state.doc.resolve(range.from);
					if ($from.parent.type.spec.code) return false;
					return !$from.marks().some((mark) => mark.type.spec.code);
				},
				items: ({ query }) => filterSlash(query),
				command: ({ editor, range, props }) => {
					editor.chain().focus().deleteRange(range as Range).run();
					handlers.run(props, editor);
				},
				floatingUi: { strategy: 'fixed' },
				dismissOnOutsideClick: true,
				render: () => ({
					onStart: handlers.show,
					onUpdate: handlers.show,
					onExit: handlers.hide,
					onKeyDown: ({ event }) => handlers.keyDown(event)
				})
			})
		];
	}
});
