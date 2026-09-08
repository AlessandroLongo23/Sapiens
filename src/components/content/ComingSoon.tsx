import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Brain, Calculator, Dumbbell, Hammer, Layers, Sigma, Sparkles, Zap } from 'lucide-react';
import type { IconComponent } from '@/lib/utils/icons';
import type { ReactNode } from 'react';

export type ContentKind = 'theory' | 'exercises' | 'flashcards' | 'formulary';

interface Kind {
	title: string;
	text: string;
	button: string;
	main: IconComponent;
	badge: IconComponent;
	accent: string;
	soft: string;
	badgeSoft: string;
	badgeFg: string;
}

const KINDS: Record<ContentKind, Kind> = {
	theory: {
		title: 'Stiamo ancora scrivendo',
		text: 'I nostri autori stanno preparando una lezione chiara e completa per questo argomento. Sapiens non si accontenta di spiegazioni a metà.',
		button: 'Mi serve questa lezione!',
		main: Hammer,
		badge: Sparkles,
		accent: 'text-accent-fg',
		soft: 'bg-accent-soft',
		badgeSoft: 'bg-warn-soft',
		badgeFg: 'text-warn-fg'
	},
	exercises: {
		title: 'Allenamento in costruzione',
		text: "Stiamo selezionando gli esercizi migliori per farti mettere in pratica quello che hai imparato. Un po' di pazienza, stiamo caricando i pesi!",
		button: 'Mi servono esercizi!',
		main: Dumbbell,
		badge: Zap,
		accent: 'text-ok-fg',
		soft: 'bg-ok-soft',
		badgeSoft: 'bg-warn-soft',
		badgeFg: 'text-warn-fg'
	},
	flashcards: {
		title: 'Flashcards in arrivo',
		text: 'Stiamo sintetizzando i concetti chiave per aiutarti a memorizzare tutto velocemente. Presto potrai ripassare in un lampo.',
		button: 'Voglio ripassare!',
		main: Layers,
		badge: Brain,
		accent: 'text-info-fg',
		soft: 'bg-info-soft',
		badgeSoft: 'bg-info-soft',
		badgeFg: 'text-info-fg'
	},
	formulary: {
		title: 'Formulario in stesura',
		text: 'Stiamo raccogliendo tutte le formule essenziali in un unico posto ordinato. Niente più foglietti volanti, promesso.',
		button: 'Mi serve il formulario!',
		main: Calculator,
		badge: Sigma,
		accent: 'text-info-fg',
		soft: 'bg-info-soft',
		badgeSoft: 'bg-warn-soft',
		badgeFg: 'text-warn-fg'
	}
};

const KIND_LABEL: Record<ContentKind, string> = { theory: 'la teoria', exercises: 'gli esercizi', flashcards: 'le flashcards', formulary: 'il formulario' };

/**
 * A lesson section that is not written yet: says so, offers to tell us it is
 * wanted (through the contact page, with the request already filled in),
 * and points back. `footer` is the previous/next row, rendered by the page.
 */
export function ComingSoon({ kind, chapterUrl, theoryUrl, footer, lessonTitle }: { kind: ContentKind; chapterUrl: string; theoryUrl?: string; footer?: ReactNode; lessonTitle?: string }) {
	const k = KINDS[kind];
	const back = kind === 'theory' || !theoryUrl ? { label: 'Torna al capitolo', url: chapterUrl, icon: ArrowLeft } : { label: 'Torna alla teoria', url: theoryUrl, icon: BookOpen };
	const ask = `/contacts?richiesta=${encodeURIComponent(`${KIND_LABEL[kind]}${lessonTitle ? ` di "${lessonTitle}"` : ''}`)}`;
	return (
		<div className="flex h-full flex-col justify-between">
			<div className="mx-auto flex max-w-lg flex-1 animate-rise-in flex-col items-center justify-center px-6 text-center">
				<div className="relative mb-8">
					<div className={`absolute inset-0 -translate-y-2 rounded-full opacity-50 blur-2xl ${k.soft}`} />
					<div className="relative rotate-3 rounded-2xl border border-edge bg-surface p-5 shadow-sm transition-transform duration-500 hover:rotate-0">
						<k.main className={`size-8 ${k.accent}`} aria-hidden="true" />
					</div>
					<div className={`absolute -right-3 -top-3 -rotate-6 rounded-xl border border-edge-soft p-2 shadow-sm ${k.badgeSoft} ${k.badgeFg}`}>
						<k.badge className="size-4" aria-hidden="true" />
					</div>
				</div>
				<h2 className="mb-3 text-2xl font-bold tracking-tight text-fg-strong">{k.title}</h2>
				<p className="mx-auto mb-8 max-w-md leading-relaxed text-fg-muted">{k.text}</p>
				<div className="mx-auto w-full max-w-sm rounded-2xl border border-edge bg-surface-2 p-1">
					<Link href={ask} className="group flex w-full items-center justify-between rounded-xl border border-transparent bg-surface px-4 py-3 text-fg transition-all hover:border-edge hover:shadow-sm focus-ring">
						<span className="pl-1 font-medium">{k.button}</span>
						<span className={`rounded-lg p-1.5 transition-transform group-hover:scale-110 ${k.soft} ${k.accent}`}>
							<ArrowRight className="size-4" aria-hidden="true" />
						</span>
					</Link>
				</div>
				<p className="mt-4 text-xs font-medium text-fg-subtle">Scrivici e daremo priorità a questo contenuto.</p>
				<Link href={back.url} className="mt-6 inline-flex items-center gap-2 rounded text-sm text-fg-subtle transition-colors hover:text-accent-fg focus-ring">
					<back.icon className="size-4" aria-hidden="true" />
					{back.label}
				</Link>
			</div>
			{footer}
		</div>
	);
}
