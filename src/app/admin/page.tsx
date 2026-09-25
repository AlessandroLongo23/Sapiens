import type { Metadata } from 'next';
import { ArrowRight, ChartColumn, LibraryBig, PenLine, UsersRound } from 'lucide-react';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { CardLink } from '@/components/ui/Card';

export const metadata: Metadata = pageMetadata({ title: 'Admin | Sapiens', path: '/admin' });

const SECTIONS = [
	{ href: '/admin/tutors', title: 'Tutor', text: 'Profili in revisione, pubblicazione, verifica.', icon: UsersRound },
	{ href: '/admin/wiki', title: 'Wiki', text: 'Livelli, materie, capitoli e lezioni.', icon: LibraryBig },
	{ href: '/admin/desk', title: 'Desk', text: 'Bozze di lezione generate.', icon: PenLine },
	{ href: '/admin/metriche', title: 'Metriche', text: 'Iscritti, attivazione, ritorno, pagamento.', icon: ChartColumn }
];

export default function AdminPage() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="mb-6 text-3xl font-bold text-fg">Amministrazione</h1>
			<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{SECTIONS.map(({ href, title, text, icon: Icon }) => (
					<li key={href}>
						<CardLink href={href} className="p-5">
							<Icon className="mb-3 size-6 text-accent-fg" aria-hidden="true" />
							<h2 className="flex items-center gap-1 font-semibold text-fg">
								{title} <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
							</h2>
							<p className="text-sm text-fg-muted">{text}</p>
						</CardLink>
					</li>
				))}
			</ul>
		</div>
	);
}
