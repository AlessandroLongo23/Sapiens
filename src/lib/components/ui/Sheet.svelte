<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { X } from 'lucide-svelte';
	import { media } from '$lib/state/media.svelte';
	import { portal } from '$lib/utils/portal';

	/**
	 * Bottom sheet for phones and tablets. It slides up from the bottom
	 * edge over a dimmed backdrop and closes on backdrop tap, Escape, the
	 * close button, or a downward drag on the handle. The body scrolls on
	 * its own without dragging the page behind it, and the panel keeps
	 * clear of the home indicator.
	 */
	interface Props {
		open: boolean;
		onClose: () => void;
		/** Accessible name of the dialog; also the heading unless `hideTitle`. */
		title: string;
		/** The content brings its own header: no title row, just the handle. */
		hideTitle?: boolean;
		/** 'auto' fits the content (up to 85% of the screen); 'full' is a tall panel. */
		size?: 'auto' | 'full';
		/** From `sm` up: keep the panel at the bottom edge, or centre it like a dialog. */
		align?: 'bottom' | 'center';
		/** Extra classes for the scrolling body. */
		bodyClass?: string;
		/** Rendered right of the title. */
		actions?: Snippet;
		footer?: Snippet;
		children: Snippet;
	}

	let {
		open,
		onClose,
		title,
		hideTitle = false,
		size = 'auto',
		align = 'bottom',
		bodyClass = '',
		actions,
		footer,
		children
	}: Props = $props();

	let panel = $state<HTMLElement | null>(null);
	let previousFocus: HTMLElement | null = null;

	// Focus moves into the panel when it opens and back out when it closes.
	$effect(() => {
		if (!open) return;
		previousFocus = document.activeElement as HTMLElement | null;
		tick().then(() => panel?.focus({ preventScroll: true }));
		return () => {
			previousFocus?.focus?.({ preventScroll: true });
			previousFocus = null;
		};
	});

	// Drag the handle down to dismiss. The panel follows the finger and
	// closes once it has travelled far or fast enough.
	let dragY = $state(0);
	let dragging = $state(false);
	let startY = 0;
	let startTime = 0;

	function onPointerDown(event: PointerEvent) {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		// Taps on the title row's buttons are clicks, not drags.
		if ((event.target as HTMLElement).closest('button, a, input, select, textarea')) return;
		dragging = true;
		dragY = 0;
		startY = event.clientY;
		startTime = performance.now();
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragging) return;
		dragY = Math.max(0, event.clientY - startY);
	}

	function onPointerUp() {
		if (!dragging) return;
		dragging = false;
		const speed = dragY / Math.max(performance.now() - startTime, 1);
		const dismiss = dragY > 110 || speed > 0.6;
		dragY = 0;
		if (dismiss) onClose();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.stopPropagation();
			onClose();
		}
	}

	let duration = $derived(media.reducedMotion ? 0 : 260);
	let titleId = `sheet-${Math.random().toString(36).slice(2, 8)}`;
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		use:portal
		class="fixed inset-0 z-50 flex flex-col justify-end sm:items-center {align === 'center' ? 'sm:justify-center' : ''}"
		onkeydown={onKeydown}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="absolute inset-0 bg-black/40 backdrop-blur-[2px] touch-none"
			transition:fade={{ duration }}
			onclick={onClose}
			aria-hidden="true"
		></div>

		<div
			bind:this={panel}
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			tabindex="-1"
			transition:fly={{ y: '100%', duration, easing: cubicOut }}
			class="relative z-10 flex w-full flex-col rounded-t-3xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl shadow-black/30 outline-none sm:max-w-xl sm:rounded-b-3xl {align === 'center' ? 'sm:my-6' : 'sm:mb-6'} {size === 'full'
				? 'h-[calc(100dvh-var(--safe-t)-1.5rem)] sm:h-[min(92dvh,52rem)]'
				: 'max-h-[85dvh]'}"
			style={dragging ? `transform: translateY(${dragY}px); transition: none;` : ''}
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing"
				onpointerdown={onPointerDown}
				onpointermove={onPointerMove}
				onpointerup={onPointerUp}
				onpointercancel={onPointerUp}
			>
				<div class="mx-auto mt-2.5 h-1.5 w-11 rounded-full bg-zinc-300 dark:bg-zinc-700 {align === 'center' ? 'sm:invisible' : ''}" aria-hidden="true"></div>
				{#if hideTitle}
					<h2 id={titleId} class="sr-only">{title}</h2>
					<div class="h-2"></div>
				{:else}
					<div class="flex items-center gap-2 px-4 pt-3 pb-2">
						<h2 id={titleId} class="flex-1 min-w-0 truncate text-base font-semibold">{title}</h2>
						{#if actions}
							{@render actions()}
						{/if}
						<button
							type="button"
							onclick={onClose}
							class="flex size-11 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
							aria-label="Chiudi"
						>
							<X class="size-5" aria-hidden="true" />
						</button>
					</div>
				{/if}
			</div>

			<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain {footer ? '' : 'pb-safe'} {bodyClass}">
				{@render children()}
			</div>

			{#if footer}
				<div class="shrink-0 border-t border-zinc-500/20 bg-white dark:bg-zinc-900 px-4 pt-3 pb-[calc(0.75rem+var(--safe-b))] sm:pb-3 rounded-b-3xl">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
