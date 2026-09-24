'use client';

import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { ExternalLink, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';
import { Sheet, sheetActions } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';

/** A typed address as a link: `sapiens.it` becomes `https://sapiens.it`; web, mail, phone and in-page links are kept as typed. */
const normalise = (href: string) => (/^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : `https://${href.replace(/^[a-z][a-z0-9+.-]*:\/*/i, '')}`);

/**
 * Adding or changing a link in the Simple editor: the address, and the text
 * when nothing is selected. Opened by the toolbar or Ctrl+K on the editor it
 * is given; the selection that editor holds is what gets linked.
 */
export function LinkDialog({ editor, onClose }: { editor: Editor | null; onClose: () => void }) {
	return (
		<Sheet open={!!editor} onClose={onClose} title="Collegamento" size="auto" width="sm" align="center">
			{editor && <LinkForm key={String(editor.state.selection.from)} editor={editor} onClose={onClose} />}
		</Sheet>
	);
}

function LinkForm({ editor, onClose }: { editor: Editor; onClose: () => void }) {
	const existing = (editor.getAttributes('link').href as string | undefined) ?? '';
	const empty = editor.state.selection.empty && !existing;
	const [href, setHref] = useState(existing);
	const [text, setText] = useState('');

	const apply = () => {
		const url = href.trim();
		if (!url) return;
		const link = normalise(url);
		const chain = editor.chain().focus();
		if (empty) chain.insertContent({ type: 'text', text: text.trim() || url, marks: [{ type: 'link', attrs: { href: link } }] }).run();
		else chain.extendMarkRange('link').setLink({ href: link }).run();
		onClose();
	};

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				apply();
			}}
		>
			<div className="space-y-1.5">
				<Label htmlFor="link-href">Indirizzo</Label>
				<Input id="link-href" type="url" inputMode="url" autoFocus placeholder="https://" value={href} onChange={(e) => setHref(e.target.value)} />
			</div>
			{empty && (
				<div className="space-y-1.5">
					<Label htmlFor="link-text">Testo da mostrare</Label>
					<Input id="link-text" placeholder="Se lo lasci vuoto, l’indirizzo" value={text} onChange={(e) => setText(e.target.value)} />
				</div>
			)}
			<div className={cn(sheetActions, 'pt-1')}>
				{existing && (
					<>
						<Button
							type="button"
							variant="ghost"
							className="text-danger-fg hover:text-danger-fg sm:mr-auto"
							onClick={() => {
								editor.chain().focus().extendMarkRange('link').unsetLink().run();
								onClose();
							}}
						>
							<Unlink className="size-4" aria-hidden="true" />
							Rimuovi
						</Button>
						<a href={existing} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-fg-muted hover:bg-surface-3 focus-ring">
							<ExternalLink className="size-4" aria-hidden="true" />
							Apri
						</a>
					</>
				)}
				<Button type="button" variant="ghost" onClick={onClose}>
					Annulla
				</Button>
				<Button type="submit" disabled={!href.trim()}>
					{existing ? 'Aggiorna' : 'Aggiungi'}
				</Button>
			</div>
		</form>
	);
}
