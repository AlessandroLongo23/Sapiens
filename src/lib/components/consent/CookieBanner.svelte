<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { Cookie } from 'lucide-svelte';
	import { consentState } from '$lib/consent/consent.svelte';
	import { loadAnalyticsIfAllowed } from '$lib/consent/analytics';

	/**
	 * Cookie banner: a floating card at the bottom of the page, not a wall.
	 * "Rifiuta" and "Accetta" are the same size; "Personalizza" opens the
	 * per-category view with analytics off by default. Focus moves into the
	 * card when it opens and back to where it was when it closes; Escape
	 * closes it once a choice exists.
	 */

	let card = $state<HTMLElement | null>(null);
	let analyticsChoice = $state(false);
	let previousFocus: HTMLElement | null = null;
	let reduceMotion = $state(false);

	onMount(() => {
		reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
		consentState.hydrate();
		loadAnalyticsIfAllowed();
	});

	$effect(() => {
		if (consentState.bannerOpen) {
			previousFocus = document.activeElement as HTMLElement | null;
			tick().then(() => card?.querySelector<HTMLElement>('button, input:not(:disabled)')?.focus());
		} else if (previousFocus) {
			previousFocus.focus?.();
			previousFocus = null;
		}
	});

	$effect(() => {
		if (consentState.customizeOpen) analyticsChoice = consentState.consent?.analytics ?? false;
	});

	function accept() {
		consentState.acceptAll();
		loadAnalyticsIfAllowed();
	}

	function reject() {
		consentState.rejectAll();
	}

	function saveCustom(e: SubmitEvent) {
		e.preventDefault();
		consentState.saveCustom({ analytics: analyticsChoice });
		loadAnalyticsIfAllowed();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') consentState.close();
	}

	const buttonBase =
		'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900';
	const secondary = `${buttonBase} bg-zinc-100 dark:bg-zinc-800 border border-zinc-500/25 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700`;
	const primary = `${buttonBase} bg-crimson-600 hover:bg-crimson-700 text-white`;
	let flyIn = $derived(reduceMotion ? { duration: 0 } : { y: 24, duration: 240 });
</script>

{#if consentState.hydrated && consentState.bannerOpen}
	<div class="pointer-events-none fixed inset-x-4 bottom-4 z-[60] md:inset-x-auto md:left-1/2 md:bottom-6 md:w-[min(40rem,calc(100vw-3rem))] md:-translate-x-1/2">
		<div
			bind:this={card}
			role="dialog"
			tabindex="-1"
			aria-labelledby="cookie-consent-title"
			aria-describedby="cookie-consent-text"
			onkeydown={onKeydown}
			in:fly={flyIn}
			out:fade={{ duration: reduceMotion ? 0 : 150 }}
			class="pointer-events-auto rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl shadow-black/10 dark:shadow-black/40 p-5 md:p-6"
		>
			{#if consentState.customizeOpen}
				<form onsubmit={saveCustom} class="flex flex-col gap-5">
					<div class="flex items-start gap-3">
						<Cookie class="mt-0.5 size-5 shrink-0 text-crimson-600 dark:text-crimson-400" strokeWidth={2.25} aria-hidden="true" />
						<div class="flex-1">
							<h2 id="cookie-consent-title" class="text-sm font-semibold">Personalizza i cookie</h2>
							<p id="cookie-consent-text" class="mt-1 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
								Scegli quali categorie attivare. Le statistiche restano spente finché non le accendi tu.
							</p>
						</div>
					</div>

					<div class="flex flex-col gap-3">
						<label class="flex items-start gap-3 rounded-xl border border-zinc-500/25 bg-zinc-50 dark:bg-zinc-800/60 p-3 cursor-not-allowed opacity-80">
							<input type="checkbox" checked disabled class="mt-0.5 size-4 rounded border-zinc-400 text-crimson-600 dark:bg-zinc-800 dark:border-zinc-600" />
							<span class="flex-1">
								<span class="block text-sm font-medium">Necessari</span>
								<span class="mt-0.5 block text-xs leading-snug text-zinc-600 dark:text-zinc-400">
									Accesso all'account, sessione, scelta del tema e questa stessa preferenza. Sempre attivi.
								</span>
							</span>
						</label>
						<label class="flex items-start gap-3 rounded-xl border border-zinc-500/25 bg-zinc-50 dark:bg-zinc-800/60 p-3 cursor-pointer">
							<input
								type="checkbox"
								bind:checked={analyticsChoice}
								class="mt-0.5 size-4 rounded border-zinc-400 text-crimson-600 focus:ring-crimson-500 dark:bg-zinc-800 dark:border-zinc-600"
							/>
							<span class="flex-1">
								<span class="block text-sm font-medium">Statistiche</span>
								<span class="mt-0.5 block text-xs leading-snug text-zinc-600 dark:text-zinc-400">
									Vercel Web Analytics e Speed Insights: quante persone visitano una pagina e quanto è veloce, senza cookie e senza profili individuali. Si caricano solo dopo il tuo sì.
								</span>
							</span>
						</label>
					</div>

					<div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
						<button type="button" onclick={() => consentState.closeCustomize()} class="{secondary} order-2 sm:order-1">Annulla</button>
						<button type="submit" class="{primary} order-1 sm:order-2">Salva preferenze</button>
					</div>
				</form>
			{:else}
				<div class="flex flex-col gap-4">
					<div class="flex items-start gap-3">
						<Cookie class="mt-0.5 size-5 shrink-0 text-crimson-600 dark:text-crimson-400" strokeWidth={2.25} aria-hidden="true" />
						<div class="flex-1">
							<h2 id="cookie-consent-title" class="text-sm font-semibold">Cookie e privacy</h2>
							<p id="cookie-consent-text" class="mt-1 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
								Usiamo cookie tecnici per farti accedere a Sapiens e, solo se accetti, statistiche anonime per
								capire quali lezioni sono più utili. Puoi cambiare idea quando vuoi dal link "Gestisci cookie" nel footer.
							</p>
							<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
								<a href="/privacy" class="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500">Privacy</a>
								<a href="/cookie" class="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500">Cookie policy</a>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
						<button type="button" onclick={() => consentState.openCustomize()} class="{secondary} order-3 sm:order-1">Personalizza</button>
						<button type="button" onclick={reject} class="{secondary} order-2">Rifiuta</button>
						<button type="button" onclick={accept} class="{primary} order-1 sm:order-3">Accetta</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
