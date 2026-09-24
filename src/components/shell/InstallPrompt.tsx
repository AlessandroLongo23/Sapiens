'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { useConsent } from '@/lib/consent/consent';
import { Button } from '@/components/ui/Button';

const VISITS_KEY = 'sapiens:visit-days';
const DISMISSED_KEY = 'sapiens:install-dismissed';

interface InstallEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Counts the distinct days the site was opened on this device; returns the count including today. */
function countVisitDay(): number {
	try {
		const today = new Date().toISOString().slice(0, 10);
		const stored = JSON.parse(localStorage.getItem(VISITS_KEY) ?? 'null') as { days: number; last: string } | null;
		const next = !stored ? { days: 1, last: today } : stored.last === today ? stored : { days: stored.days + 1, last: today };
		localStorage.setItem(VISITS_KEY, JSON.stringify(next));
		return next.days;
	} catch {
		return 0;
	}
}

const isStandalone = () =>
	window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isNativeShell = () => Boolean((window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.());
const isIosSafari = () => /iPhone|iPad|iPod/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

/**
 * Invites the student to add Sapiens to the home screen, from the second day
 * they open it on this device. Chrome and Edge fire `beforeinstallprompt` and
 * get an "Installa" button; Safari on iOS has no such event, so it gets the
 * two taps to do by hand. Hidden when the app is already installed, inside
 * the Capacitor app, while the cookie banner is up, and for good once closed.
 */
export function InstallPrompt() {
	const cookieBannerOpen = useConsent((s) => !s.hydrated || s.bannerOpen);
	const [mode, setMode] = useState<'native' | 'ios' | null>(null);
	const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);

	useEffect(() => {
		if (isStandalone() || isNativeShell()) return;
		const days = countVisitDay();
		let dismissed = false;
		try {
			dismissed = localStorage.getItem(DISMISSED_KEY) === '1';
		} catch {}
		if (dismissed || days < 2) return;

		// A few seconds in, not on the first paint: the student sees the page before being asked anything.
		if (isIosSafari()) {
			const timer = window.setTimeout(() => setMode('ios'), 3000);
			return () => window.clearTimeout(timer);
		}
		const onPrompt = (e: Event) => {
			e.preventDefault();
			setInstallEvent(e as InstallEvent);
			setMode('native');
		};
		const onInstalled = () => setMode(null);
		window.addEventListener('beforeinstallprompt', onPrompt);
		window.addEventListener('appinstalled', onInstalled);
		return () => {
			window.removeEventListener('beforeinstallprompt', onPrompt);
			window.removeEventListener('appinstalled', onInstalled);
		};
	}, []);

	if (!mode || cookieBannerOpen) return null;

	const dismiss = () => {
		try {
			localStorage.setItem(DISMISSED_KEY, '1');
		} catch {}
		setMode(null);
	};
	const install = async () => {
		if (!installEvent) return;
		await installEvent.prompt();
		const { outcome } = await installEvent.userChoice;
		if (outcome === 'accepted') setMode(null);
		else dismiss();
	};

	return (
		<div className="pointer-events-none fixed inset-x-3 z-[55] above-tabbar md:inset-x-auto md:bottom-6 md:left-auto md:right-6 md:w-96" style={{ '--tabbar-h': '4.25rem' } as React.CSSProperties}>
			<div role="region" aria-labelledby="install-title" className="pointer-events-auto relative animate-rise-in rounded-2xl border border-edge bg-surface p-4 pr-12 text-fg shadow-2xl shadow-black/10 dark:shadow-black/40">
				<button type="button" onClick={dismiss} aria-label="Chiudi" className="absolute right-2 top-2 inline-flex size-11 items-center justify-center rounded-xl text-fg-muted hover:text-fg focus-ring">
					<X className="size-5" aria-hidden="true" />
				</button>
				<div className="flex items-start gap-3">
					<Download className="mt-0.5 size-5 shrink-0 text-accent-fg" strokeWidth={2.25} aria-hidden="true" />
					<div className="flex-1">
						<h2 id="install-title" className="text-sm font-semibold">Tieni Sapiens sul telefono</h2>
						{mode === 'ios' ? (
							<p className="mt-1 text-sm leading-snug text-fg-muted">
								Tocca <Share className="inline size-4 align-[-2px]" aria-label="Condividi" /> in basso, poi &quot;Aggiungi alla schermata Home&quot;. Le ultime lezioni che apri restano leggibili anche senza rete.
							</p>
						) : (
							<>
								<p className="mt-1 text-sm leading-snug text-fg-muted">Si apre come un&apos;app, e le ultime lezioni che apri restano leggibili anche senza rete.</p>
								<Button onClick={install} className="mt-3">Installa</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
