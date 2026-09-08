import { Home, LibraryBig, SearchX } from 'lucide-react';
import { CONTENT_ROOT } from '@/lib/config/site';
import { LinkButton } from '@/components/ui/Button';
import { NoImmersiveFrame } from '@/components/content/lesson/LessonPresence';

/** The 404 body, rendered inside whichever layout owns the missing page. */
export function NotFoundContent() {
	return (
		<section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
			<NoImmersiveFrame />
			<div className="w-full max-w-md text-center">
				<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-surface-3 ring-1 ring-edge">
					<SearchX className="size-10 text-fg-faint" aria-hidden="true" />
				</div>
				<h1 className="mb-3 text-3xl font-bold text-fg-strong">Pagina non trovata</h1>
				<p className="mb-8 text-fg-muted">L&apos;indirizzo che hai aperto non corrisponde a nessuna pagina. Il materiale potrebbe essere stato spostato.</p>
				<div className="flex flex-col justify-center gap-3 sm:flex-row">
					<LinkButton href={CONTENT_ROOT} size="lg">
						<LibraryBig className="size-4" aria-hidden="true" />
						Materiale didattico
					</LinkButton>
					<LinkButton href="/" variant="secondary" size="lg">
						<Home className="size-4" aria-hidden="true" />
						Torna alla home
					</LinkButton>
				</div>
			</div>
		</section>
	);
}
