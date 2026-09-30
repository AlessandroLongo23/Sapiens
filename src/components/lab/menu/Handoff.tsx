'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, Copy, Mail, Monitor, Share2 } from 'lucide-react';
import { buttonClass } from '@/components/ui/Button';
import { TapedPhoto } from './TapedPhoto';

/*
 * The labs on a device without a mouse (a phone, a tablet): nothing to play, only the way over to a computer. The
 * link travels by the phone's share sheet, by email to oneself, or copied.
 */
const noSub = () => () => {};

export function Handoff({ onAnyway }: { onAnyway: () => void }) {
	const [copied, setCopied] = useState<'' | 'ok' | 'no'>('');
	// read after hydration, so the server's page and the first render agree
	const url = useSyncExternalStore(
		noSub,
		() => window.location.href.split('?')[0],
		() => '/laboratorio'
	);
	const canShare = useSyncExternalStore(
		noSub,
		() => 'share' in navigator,
		() => false
	);
	const mail = `mailto:?subject=${encodeURIComponent('Laboratori di Sapiens')}&body=${encodeURIComponent(`Da aprire sul computer: ${url}`)}`;

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied('ok');
		} catch {
			setCopied('no');
		}
		setTimeout(() => setCopied(''), 4000);
	};

	return (
		<section className="animate-fade-in mx-auto max-w-md" aria-labelledby="lab-computer">
			<div className="rounded-2xl border border-edge bg-surface p-6 shadow-paper">
				<span className="flex size-12 rotate-[-4deg] items-center justify-center rounded-xl border border-accent-edge bg-accent-soft text-accent-fg shadow-lift" aria-hidden="true">
					<Monitor className="size-6" strokeWidth={1.75} />
				</span>
				<h2 id="lab-computer" className="mt-4 font-display text-2xl font-semibold text-fg-strong">
					Si apre dal computer
				</h2>
				<p className="mt-2 text-fg-muted">
					Nel laboratorio cammini, guardi e usi le due mani con il mouse e la tastiera: sul telefono non si può fare bene. Mandati il link e riaprilo sul computer, o sulla LIM della classe.
				</p>
				<div className="mt-6 flex flex-col gap-2.5">
					{canShare && (
						<button type="button" onClick={() => navigator.share({ title: 'Laboratori di Sapiens', url }).catch(() => {})} className={buttonClass('primary', 'lg')}>
							<Share2 className="size-4" aria-hidden="true" /> Manda il link
						</button>
					)}
					<a href={mail} className={buttonClass(canShare ? 'secondary' : 'primary', 'lg')}>
						<Mail className="size-4" aria-hidden="true" /> Mandalo per email
					</a>
					<div className="mt-2 flex items-center gap-2">
						<input
							readOnly
							value={url}
							aria-label="Indirizzo della pagina"
							onFocus={(e) => e.currentTarget.select()}
							className="min-w-0 flex-1 rounded-xl border border-edge bg-surface-2 px-3 py-2 font-mono text-sm text-fg"
						/>
						<button type="button" onClick={copy} className={buttonClass('secondary', 'md', 'shrink-0')}>
							{copied === 'ok' ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
							Copia
						</button>
					</div>
					<p role="status" className="min-h-5 text-sm text-fg-muted">
						{copied === 'ok' ? 'Link copiato.' : copied === 'no' ? 'Non si è potuto copiare: seleziona l’indirizzo qui sopra e copialo.' : ''}
					</p>
				</div>
				<p className="mt-2 border-t border-edge pt-4 text-sm text-fg-muted">
					Sei alla LIM o hai un mouse collegato?{' '}
					<button type="button" onClick={onAnyway} className="font-semibold text-accent-fg underline underline-offset-2 focus-ring">
						Apri comunque il menu
					</button>
				</p>
			</div>
			<TapedPhoto src="/lab/copertine/aula.webp" alt="L'aula di chimica in 3D" caption="l'aula di chimica" tilt={-2} sizes="90vw" className="mx-auto mt-12 w-[88%]" />
		</section>
	);
}
