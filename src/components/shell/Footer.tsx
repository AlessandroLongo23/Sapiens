import Link from 'next/link';
import { CookieManageLink } from './CookieBanner';

const COLUMNS = [
	{ title: 'Navigazione', links: [['/', 'Home'], ['/pricing', 'Prezzi'], ['/ripetizioni', 'Ripetizioni'], ['/zaino', 'Zaino'], ['/faq', 'FAQ']] },
	{ title: 'Informazioni', links: [['/contacts', 'Contatti'], ['/faq', 'Domande frequenti']] },
	{ title: 'Legale', links: [['/terms', 'Termini e condizioni'], ['/privacy', 'Privacy'], ['/cookie', 'Cookie policy']] }
];

const linkClass = 'inline-flex min-h-6 items-center py-1 text-left text-sm text-ink-300 transition-colors duration-200 hover:text-white sm:text-base';

export function Footer() {
	return (
		<footer className="relative overflow-hidden border-t border-edge bg-ink-900 text-white">
			<div className="grid-paper pointer-events-none absolute inset-0 [--grid:color-mix(in_oklab,white_5%,transparent)] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
			<div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
				<div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
					<div>
						<p className="mb-4 font-display text-3xl font-semibold tracking-tight text-white">Sapiens</p>
						<p className="mb-6 max-w-xs text-sm leading-relaxed text-ink-300 sm:text-base">Smart help for smart learners. Trasformare le difficoltà in successi, una lezione alla volta.</p>
					</div>
					{COLUMNS.map((col) => (
						<div key={col.title}>
							<h2 className="mb-4 label-mono text-ink-100">{col.title}</h2>
							<nav className="flex flex-col space-y-3" aria-label={col.title}>
								{col.links.map(([href, label]) => (
									<Link key={label} href={href} className={linkClass}>
										{label}
									</Link>
								))}
								{col.title === 'Legale' && <CookieManageLink className={linkClass} />}
							</nav>
						</div>
					))}
				</div>
				<div className="flex flex-col items-center justify-between gap-4 border-t border-edge pt-8 sm:flex-row">
					<div className="text-center sm:text-left">
						<p className="text-xs text-ink-300 sm:text-sm">© {new Date().getFullYear()} Sapiens. Tutti i diritti riservati.</p>
						<p className="mt-1 text-xs text-ink-300">Materiale Didattico Online</p>
					</div>
					<p className="text-xs text-ink-300 sm:text-sm">Fatto con ❤️ per gli studenti</p>
				</div>
			</div>
		</footer>
	);
}
