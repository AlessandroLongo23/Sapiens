<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { media } from '$lib/state/media.svelte';
	import { portal } from '$lib/utils/portal';

	/**
	 * Dialog container. On phones the panel is anchored to the bottom edge
	 * and slides up like a sheet, with its own scrolling and room for the
	 * home indicator; from `sm` up it is centred.
	 */
	let {
		isOpen = $bindable(false),
		classes = '',
		onClose = () => {},
		isInstantTransition = false,
		closeOnOutsideClick = true,
		children,
		backgroundBlur = 'none'
	} = $props();

	// Focus moves into the panel when it opens (so Escape reaches it) and
	// back to where it was when it closes.
	let panel = $state<HTMLElement | null>(null);
	let previousFocus: HTMLElement | null = null;

	$effect(() => {
		if (!isOpen) return;
		previousFocus = document.activeElement as HTMLElement | null;
		tick().then(() => {
			if (panel && !panel.contains(document.activeElement)) panel.focus({ preventScroll: true });
		});
		return () => {
			previousFocus?.focus?.({ preventScroll: true });
			previousFocus = null;
		};
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	let backgroundBlurClasses = {
		none: '',
		xs: 'backdrop-blur-xs',
		sm: 'backdrop-blur-sm',
		md: 'backdrop-blur-md',
		lg: 'backdrop-blur-lg',
		xl: 'backdrop-blur-xl'
	}

	let duration = $derived(isInstantTransition || media.reducedMotion ? 0 : 260);
	let offset = $derived(media.sm ? 15 : '100%');
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		use:portal
		class="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center"
		onkeydown={handleKeydown}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="absolute inset-0 bg-black/25 {backgroundBlurClasses[backgroundBlur]} touch-none"
			onclick={() => closeOnOutsideClick && onClose()}
			role="presentation"
			transition:fade|local={{ duration: isInstantTransition ? 0 : 100 }}
		></div>
		<div
			bind:this={panel}
			tabindex="-1"
			class="relative z-10 w-full max-h-[calc(100dvh-var(--safe-t)-1rem)] sm:max-h-[92dvh] overflow-y-auto overscroll-contain outline-none sm:mx-auto {classes}"
			transition:fly|local={{ duration, y: offset }}
		>
			{@render children()}
		</div>
	</div>
{/if}
