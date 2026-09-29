'use client';

import { useSyncExternalStore, type Ref } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { ZAINO_ROOT } from '@/lib/config/site';
import { cn } from '@/lib/utils/cn';

export const TRASH_PATH = `${ZAINO_ROOT}/cestino`;

/**
 * The way to the trash, with how much is in it. A note thrown from its menu lands here: `bump` changes when one does,
 * and the icon gives a little under it.
 */
export function TrashLink({ ref, count, bump = 0, className }: { ref?: Ref<HTMLAnchorElement>; count: number; bump?: number; className?: string }) {
	return (
		<Link
			ref={ref}
			href={TRASH_PATH}
			aria-label={count > 0 ? `Cestino, ${count} ${count === 1 ? 'elemento' : 'elementi'}` : 'Cestino'}
			title="Cestino"
			className={cn('relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-edge bg-surface text-fg-muted shadow-paper transition-colors hover:bg-surface-2 hover:text-fg focus-ring', className)}
		>
			<Trash2 key={bump} className={cn('size-[18px]', bump > 0 && 'zn-bin-bump')} aria-hidden="true" />
			{count > 0 && (
				<span className="label-mono absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-inverse px-1 text-center text-[0.625rem] leading-5 text-inverse-fg tabular-nums" aria-hidden="true">
					{count > 99 ? '99+' : count}
				</span>
			)}
		</Link>
	);
}

const noSubscription = () => () => {};

/**
 * The trash that comes up from the bottom of the screen while a note is dragged: a note held over it crumples, and
 * let go there it is thrown in. It also comes up for a note thrown from its menu when the trash in the toolbar is out
 * of view, with `label` in place of the hint. Decorative for assistive tech: the note's menu has "Elimina la nota".
 */
export function DropBin({ ref, shown, over, bump = 0, label }: { ref?: Ref<HTMLDivElement>; shown: boolean; over: boolean; bump?: number; label?: string }) {
	// Only in the browser, and only after hydration: the server has no document.body to portal into.
	const client = useSyncExternalStore(noSubscription, () => true, () => false);
	if (!client) return null;
	return createPortal(
		<div className="pointer-events-none fixed inset-x-0 z-40 flex justify-center above-tabbar md:bottom-8" style={{ '--tabbar-h': '4.75rem' } as React.CSSProperties} aria-hidden="true">
			<div ref={ref} className="zn-drop-bin" data-shown={shown || undefined} data-over={over || undefined}>
				<Trash2 key={bump} className={cn('zn-drop-bin-icon size-5', bump > 0 && 'zn-bin-bump')} />
				<span>{label ?? (over ? 'Lascia per eliminare' : 'Trascina qui per eliminare')}</span>
			</div>
		</div>,
		document.body
	);
}
