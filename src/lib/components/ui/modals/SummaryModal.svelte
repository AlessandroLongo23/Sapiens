<script lang="ts">
	import { CheckCircle2, XCircle, RotateCcw, BookOpen, ArrowRight } from 'lucide-svelte';
	import { exercise_messages } from '$lib/const/microcopy.js';

	import Sheet from '$lib/components/ui/Sheet.svelte';

	/**
	 * End of an exercise session: the score, and what to do next. A sheet on
	 * phones, a centred card on wider screens. Dismissing it (backdrop,
	 * Escape) hands control back to the page through `onClose`.
	 */
	interface Props {
		isOpen: boolean;
		correctCount?: number;
		totalCount?: number;
		/** Where "Torna alla teoria" goes. */
		href?: string;
		/** The next lesson, when there is one. */
		nextHref?: string | null;
		/** Starts a new session with fresh exercises; the button is hidden without it. */
		onRetry?: () => void;
		onClose?: () => void;
	}

	let {
		isOpen = $bindable(false),
		correctCount = 0,
		totalCount = 0,
		href = '',
		nextHref = null,
		onRetry,
		onClose
	}: Props = $props();

	let incorrectCount = $derived(Math.max(0, totalCount - correctCount));
	let percent = $derived(totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0);

	// One line of encouragement, picked from the pool that matches the score.
	let message = $derived.by(() => {
		let pool;
		switch (true) {
			case percent < 25:
				pool = $exercise_messages[0];
				break;
			case percent < 50:
				pool = $exercise_messages[1];
				break;
			case percent < 75:
				pool = $exercise_messages[2];
				break;
			case percent < 100:
				pool = $exercise_messages[3];
				break;
			default:
				pool = $exercise_messages[4];
		}
		return pool[Math.floor(Math.random() * pool.length)];
	});

	// Score ring.
	const RADIUS = 44;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
	let dashOffset = $derived(CIRCUMFERENCE * (1 - percent / 100));
	let ringClass = $derived(
		percent >= 75 ? 'stroke-green-500' : percent >= 50 ? 'stroke-amber-500' : 'stroke-crimson-500'
	);

	function close() {
		isOpen = false;
		onClose?.();
	}

	const secondary =
		'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-800 px-4 text-sm font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 active:bg-zinc-100 dark:active:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500';
</script>

<Sheet open={isOpen} onClose={close} title={message} align="center" bodyClass="px-5 pb-3">
	<div class="flex flex-col items-center gap-4 pt-1 text-center">
		<p class="text-sm text-zinc-600 dark:text-zinc-400">Ecco il riepilogo della tua sessione</p>

		<div class="relative size-32" role="img" aria-label="{correctCount} risposte corrette su {totalCount}, {percent} per cento">
			<svg viewBox="0 0 100 100" class="size-full -rotate-90" aria-hidden="true">
				<circle cx="50" cy="50" r={RADIUS} class="fill-none stroke-zinc-200 dark:stroke-zinc-700" stroke-width="8" />
				<circle
					cx="50"
					cy="50"
					r={RADIUS}
					class="fill-none {ringClass} transition-[stroke-dashoffset] duration-700 ease-out"
					stroke-width="8"
					stroke-linecap="round"
					stroke-dasharray={CIRCUMFERENCE}
					stroke-dashoffset={dashOffset}
				/>
			</svg>
			<div class="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
				<span class="text-3xl font-bold leading-none text-zinc-900 dark:text-zinc-50">{correctCount}<span class="text-lg text-zinc-400">/{totalCount}</span></span>
				<span class="mt-1 text-xs font-medium text-zinc-500">{percent}%</span>
			</div>
		</div>

		<dl class="flex items-center justify-center gap-6 text-base font-semibold">
			<div class="flex items-center gap-2 text-green-600 dark:text-green-400">
				<CheckCircle2 class="size-5" aria-hidden="true" />
				<dd>{correctCount}</dd>
				<dt class="font-medium">{correctCount === 1 ? 'corretta' : 'corrette'}</dt>
			</div>
			<div class="flex items-center gap-2 text-red-600 dark:text-red-400">
				<XCircle class="size-5" aria-hidden="true" />
				<dd>{incorrectCount}</dd>
				<dt class="font-medium">{incorrectCount === 1 ? 'sbagliata' : 'sbagliate'}</dt>
			</div>
		</dl>
	</div>

	{#snippet footer()}
		<div class="flex flex-col gap-2">
			{#if onRetry}
				<button
					type="button"
					onclick={onRetry}
					class="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-crimson-600 px-4 text-base font-semibold text-white hover:bg-crimson-700 active:bg-crimson-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
				>
					<RotateCcw class="size-5" aria-hidden="true" />
					Riprova con nuovi esercizi
				</button>
			{/if}
			<div class="grid gap-2 {nextHref ? 'grid-cols-2' : 'grid-cols-1'}">
				{#if href}
					<a {href} class={secondary}>
						<BookOpen class="size-4 shrink-0" aria-hidden="true" />
						Torna alla teoria
					</a>
				{/if}
				{#if nextHref}
					<a href={nextHref} class={secondary}>
						Prossima lezione
						<ArrowRight class="size-4 shrink-0" aria-hidden="true" />
					</a>
				{/if}
			</div>
		</div>
	{/snippet}
</Sheet>
