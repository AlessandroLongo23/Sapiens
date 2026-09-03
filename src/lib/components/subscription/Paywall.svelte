<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Lock, Check, ArrowLeft, Loader2 } from 'lucide-svelte';
	import { Features, FeaturesDetails, formatPrice, TRIAL_DAYS } from '$lib/stripe/config';
	import { requiredPlanFor, featuresUnlockedBy, trialAvailable } from '$lib/auth/entitlements';
	import { authState } from '$lib/state/auth.svelte';
	import { requestCheckout } from '$lib/subscription/checkout';

	/**
	 * Shown in place of a Premium feature the visitor cannot use. States the
	 * plan that includes it, what else that plan unlocks, the price and the
	 * trial, and starts the checkout in one click (login first, if needed).
	 * No timers, no fake scarcity: the content behind is what sells it.
	 */

	interface Props {
		feature: Features;
		/** Page to come back to once the plan is active. */
		returnTo: string;
		/** Where the "back" link goes (the lesson's theory, usually). */
		backUrl?: string;
		backLabel?: string;
		/** A one-line, true description of what the feature does. */
		benefit: string;
		/** Rendered, blurred and inert, behind the card. */
		preview?: Snippet;
		/** Narrow version for sidebars. */
		compact?: boolean;
	}

	let { feature, returnTo, backUrl, backLabel = 'Torna alla teoria', benefit, preview, compact = false }: Props = $props();

	const COPY: Record<Features, { subject: string; title: (plan: string) => string }> = {
		[Features.EXERCISES]: { subject: 'esercizi', title: (p) => `Gli esercizi interattivi sono inclusi nel piano ${p}` },
		[Features.FLASHCARDS]: { subject: 'flashcard', title: (p) => `Le flashcard sono incluse nel piano ${p}` },
		[Features.AI_CHAT]: { subject: 'Sapiens AI', title: (p) => `Sapiens AI è incluso nel piano ${p}` },
		[Features.TUTORING]: { subject: 'ripetizioni', title: (p) => `Le ripetizioni 1 a 1 sono incluse nel piano ${p}` },
		[Features.REMOVE_ADS]: { subject: 'navigazione senza pubblicità', title: (p) => `Inclusa nel piano ${p}` },
		[Features.THEORY]: { subject: 'teoria', title: (p) => `Inclusa nel piano ${p}` }
	};

	let plan = $derived(requiredPlanFor(feature));
	let shortName = $derived(plan.name.replace(/^Piano\s+/i, ''));
	let unlocked = $derived(featuresUnlockedBy(plan));
	let withTrial = $derived(!authState.user || trialAvailable(authState.user));

	let busy = $state(false);
	let error = $state<string | null>(null);

	async function upgrade() {
		busy = true;
		error = null;
		try {
			await requestCheckout({ planId: plan.id, returnTo });
		} catch (err) {
			error = err instanceof Error ? err.message : 'Qualcosa è andato storto. Riprova.';
		} finally {
			busy = false;
		}
	}
</script>

<div class="relative {compact ? '' : 'h-full min-h-[60vh]'}" id="paywall">
	{#if preview}
		<div class="pointer-events-none select-none blur-sm opacity-50" aria-hidden="true" inert>
			{@render preview()}
		</div>
	{/if}

	<div class="{preview ? 'absolute inset-0' : ''} flex items-center justify-center {compact ? 'p-3' : 'p-6'}">
		<section
			class="w-full {compact ? 'max-w-sm p-5' : 'max-w-md p-8'} rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-500/25 shadow-xl text-center"
			aria-labelledby="paywall-title"
		>
			<div class="mx-auto {compact ? 'size-11 mb-3' : 'size-16 mb-5'} rounded-full bg-crimson-50 dark:bg-crimson-900/20 text-crimson-600 dark:text-crimson-400 flex items-center justify-center">
				<Lock class={compact ? 'size-5' : 'size-7'} aria-hidden="true" />
			</div>

			<h2 id="paywall-title" class="{compact ? 'text-base' : 'text-2xl'} font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">
				{COPY[feature].title(shortName)}
			</h2>

			<p class="mt-2 {compact ? 'text-sm' : ''} text-zinc-600 dark:text-zinc-400 leading-relaxed">
				{benefit}
			</p>

			{#if unlocked.length > 1 && !compact}
				<ul class="mt-5 text-left text-sm text-zinc-700 dark:text-zinc-300 flex flex-col gap-2" aria-label="Incluso nel piano {shortName}">
					{#each unlocked as f (f)}
						<li class="flex items-center gap-2.5">
							<Check class="size-4 shrink-0 text-crimson-600 dark:text-crimson-400" aria-hidden="true" />
							<span>{FeaturesDetails[f].name}</span>
						</li>
					{/each}
				</ul>
			{/if}

			<p class="mt-5 text-sm text-zinc-600 dark:text-zinc-400">
				<span class="font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(plan.price, plan.currency)} al mese</span>
				{#if withTrial}
					· primi {TRIAL_DAYS} giorni gratis, senza carta
				{/if}
				· disdici quando vuoi
			</p>

			<button
				type="button"
				onclick={upgrade}
				disabled={busy}
				class="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-semibold {compact ? 'py-2.5 text-sm' : 'py-3.5'} px-6 transition-colors disabled:opacity-60 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
			>
				{#if busy}
					<Loader2 class="size-4 animate-spin" aria-hidden="true" />
					<span>Un attimo…</span>
				{:else if withTrial}
					Prova {shortName} gratis per {TRIAL_DAYS} giorni
				{:else}
					Attiva il piano {shortName}
				{/if}
			</button>

			{#if error}
				<p class="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>
			{/if}

			<div class="mt-4 flex flex-col items-center gap-2 text-sm">
				<a href="/pricing" class="text-zinc-600 dark:text-zinc-400 hover:text-crimson-600 dark:hover:text-crimson-400 underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500">
					Confronta tutti i piani
				</a>
				{#if authState.ready && !authState.user}
					<button
						type="button"
						onclick={() => authState.openModal()}
						class="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
					>
						Hai già un abbonamento? Accedi
					</button>
				{/if}
			</div>

			{#if backUrl}
				<a
					href={backUrl}
					class="mt-5 inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
				>
					<ArrowLeft class="size-4" aria-hidden="true" />
					{backLabel}
				</a>
			{/if}
		</section>
	</div>
</div>
