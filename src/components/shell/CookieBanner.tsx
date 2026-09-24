'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Cookie } from 'lucide-react';
import { useConsent } from '@/lib/consent/consent';
import { useAppMode } from '@/lib/hooks/use-app-mode';
import { loadAnalyticsIfAllowed } from '@/lib/consent/analytics';
import { Button } from '@/components/ui/Button';
import { CheckboxRow } from '@/components/ui/Field';

function Heading({ title, text }: { title: string; text: string }) {
	return (
		<div className="flex items-start gap-3">
			<Cookie className="mt-0.5 size-5 shrink-0 text-accent-fg" strokeWidth={2.25} aria-hidden="true" />
			<div className="flex-1">
				<h2 id="cookie-consent-title" className="text-sm font-semibold">{title}</h2>
				<p id="cookie-consent-text" className="mt-1 text-sm leading-snug text-fg-muted">{text}</p>
			</div>
		</div>
	);
}

/**
 * Cookie banner: a floating card at the bottom of the page, not a wall.
 * "Rifiuta" and "Accetta" are the same size; "Personalizza" opens the
 * per-category view with analytics off by default. Focus moves into the
 * card when it opens and back to where it was when it closes; Escape
 * closes it once a choice exists.
 */
export function CookieBanner() {
	const { hydrated, bannerOpen, customizeOpen, consent, save, openCustomize, closeCustomize, close } = useConsent();
	const card = useRef<HTMLDivElement>(null);
	const app = useAppMode();
	const [analytics, setAnalytics] = useState(false);
	const open = hydrated && bannerOpen;

	// Opening the customize view seeds its checkbox with the stored choice.
	const [wasCustomizing, setWasCustomizing] = useState(customizeOpen);
	if (customizeOpen !== wasCustomizing) {
		setWasCustomizing(customizeOpen);
		if (customizeOpen) setAnalytics(consent?.analytics ?? false);
	}

	if (!open) return null;

	const choose = (allowed: boolean) => {
		save(allowed);
		loadAnalyticsIfAllowed();
	};
	const saveCustom = (e: FormEvent) => {
		e.preventDefault();
		choose(analytics);
	};

	return (
		<div className="pointer-events-none fixed inset-x-3 z-[60] above-tabbar md:inset-x-auto md:bottom-6 md:left-1/2 md:w-[min(40rem,calc(100vw-3rem))] md:-translate-x-1/2" style={{ '--tabbar-h': '4.25rem' } as React.CSSProperties}>
			<div
				ref={card}
				role="region"
				tabIndex={-1}
				aria-labelledby="cookie-consent-title"
				aria-describedby="cookie-consent-text"
				onKeyDown={(e) => e.key === 'Escape' && close()}
				className="pointer-events-auto animate-rise-in rounded-2xl border border-edge bg-surface p-4 text-fg shadow-2xl shadow-black/10 md:p-6 dark:shadow-black/40"
			>
				{customizeOpen ? (
					<form onSubmit={saveCustom} className="flex flex-col gap-5">
						<Heading title="Personalizza i cookie" text="Scegli quali categorie attivare. Le statistiche restano spente finché non le accendi tu." />
						<div className="flex flex-col gap-3">
							<CheckboxRow checked disabled className="bg-surface-2">
								<span className="block text-sm font-medium text-fg">Necessari</span>
								<span className="mt-0.5 block text-xs leading-snug">Accesso all&apos;account, sessione, scelta del tema e questa stessa preferenza. Sempre attivi.</span>
							</CheckboxRow>
							<CheckboxRow checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="bg-surface-2">
								<span className="block text-sm font-medium text-fg">Statistiche</span>
								<span className="mt-0.5 block text-xs leading-snug">Vercel Web Analytics e Speed Insights: quante persone visitano una pagina e quanto è veloce, senza cookie e senza profili individuali. Si caricano solo dopo il tuo sì.</span>
							</CheckboxRow>
						</div>
						<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
							<Button variant="secondary" onClick={closeCustomize} className="order-2 sm:order-1">Annulla</Button>
							<Button type="submit" className="order-1 sm:order-2">Salva preferenze</Button>
						</div>
					</form>
				) : (
					<div className="flex flex-col gap-4">
						<div>
							<Heading
								title="Cookie e privacy"
								text={`Usiamo cookie tecnici per farti accedere a Sapiens e, solo se accetti, statistiche anonime per capire quali lezioni sono più utili. Puoi cambiare idea quando vuoi dal link "Gestisci cookie" ${app ? 'in Profilo' : 'nel footer'}.`}
							/>
							<div className="ml-8 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
								<a href="/privacy" className="rounded underline underline-offset-2 hover:text-fg focus-ring">Privacy</a>
								<a href="/cookie" className="rounded underline underline-offset-2 hover:text-fg focus-ring">Cookie policy</a>
							</div>
						</div>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
							<button type="button" onClick={openCustomize} className="order-2 inline-flex min-h-[44px] items-center justify-center rounded-xl px-3 text-sm font-medium text-fg-muted underline underline-offset-2 hover:text-fg focus-ring sm:order-1">
								Personalizza
							</button>
							<div className="order-1 grid grid-cols-2 gap-2 sm:order-2">
								<Button variant="secondary" onClick={() => choose(false)}>Rifiuta</Button>
								<Button onClick={() => choose(true)}>Accetta</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

/** From the footer or the cookie policy: show the banner again. */
export function CookieManageLink({ className }: { className?: string }) {
	const reopen = useConsent((s) => s.reopen);
	return (
		<button type="button" onClick={reopen} className={className}>
			Gestisci cookie
		</button>
	);
}
