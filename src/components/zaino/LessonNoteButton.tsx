'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, NotebookPen } from 'lucide-react';
import { Features } from '@/lib/stripe/config';
import { hasFeature } from '@/lib/auth/entitlements';
import { useAuth } from '@/lib/state/auth';
import { cn } from '@/lib/utils/cn';

/**
 * "Prendi appunti" on a lesson: opens the note already started on this lesson,
 * or makes one seeded with its title. This is the only entry into the Zaino
 * from the rest of the site, so it has to work from a standing start — the
 * server side makes a quaderno when the backpack is still empty.
 *
 * The dot says a note already exists, so a student can tell at a glance whether
 * they have been here before.
 */
export function LessonNoteButton({ path, title, className }: { path: string; title: string; className?: string }) {
	const router = useRouter();
	const { user, ready, openModal } = useAuth();
	// Counted per user and lesson, so signing out or moving to another lesson
	// drops the badge without an effect having to clear it.
	const [found, setFound] = useState<{ key: string; count: number }>({ key: '', count: 0 });
	const [busy, setBusy] = useState(false);
	const key = user ? `${user.id}:${path}` : '';

	useEffect(() => {
		if (!key) return;
		const controller = new AbortController();
		fetch(`/api/zaino/lezione?path=${encodeURIComponent(path)}`, { signal: controller.signal })
			.then((r) => (r.ok ? r.json() : { notes: [] }))
			.then((payload) => setFound({ key, count: payload.notes?.length ?? 0 }))
			.catch(() => {});
		return () => controller.abort();
	}, [key, path]);

	const existing = found.key === key ? found.count : 0;

	const open = async () => {
		if (!ready) return;
		if (!user) return openModal({ next: open });
		setBusy(true);
		try {
			const response = await fetch('/api/zaino/lezione', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ path, title })
			});
			const payload = await response.json().catch(() => ({}));
			// A full free plan sends them to the plans, which is the honest answer.
			if (response.status === 402) return router.push('/pricing');
			if (!response.ok || !payload.note) return;
			router.push(`/zaino/nota/${payload.note.id}`);
		} finally {
			setBusy(false);
		}
	};

	// The button is shown to everyone: it is how the section is discovered.
	// The plan check only decides whether it goes to the note or to the plans.
	const locked = !!user && !hasFeature(user, Features.NOTEBOOKS);

	return (
		<button
			type="button"
			onClick={open}
			disabled={busy}
			title={existing > 0 ? 'Riprendi i tuoi appunti' : locked ? 'Gli appunti sono nei piani a pagamento' : 'Prendi appunti su questa lezione'}
			aria-label={existing > 0 ? 'Riprendi i tuoi appunti su questa lezione' : 'Prendi appunti su questa lezione'}
			className={cn(
				'relative flex size-[44px] shrink-0 items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg active:bg-surface-3 disabled:opacity-60 focus-ring',
				className
			)}
		>
			{busy ? (
				<Loader2 className="size-6 animate-spin motion-reduce:animate-none" aria-hidden="true" />
			) : (
				<NotebookPen className="size-6" aria-hidden="true" />
			)}
			{existing > 0 && !busy && (
				<span className="absolute right-2 top-2 size-2 rounded-full bg-accent ring-2 ring-surface" aria-hidden="true" />
			)}
		</button>
	);
}
