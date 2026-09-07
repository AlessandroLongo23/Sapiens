<script lang="ts">
	import { X } from 'lucide-svelte';
	import { tutorDisplayName, type TutorProfile } from '$lib/tutoring/config';

	import Modal from '$lib/components/ui/modals/Modal.svelte';
	import RequestForm from './RequestForm.svelte';
	import TutorAvatar from './TutorAvatar.svelte';

	/** The request form in a dialog, opened from a tutor card. Closed when `tutor` is null. */
	interface Props {
		tutor: TutorProfile | null;
		initial?: { subject?: string; level?: string; mode?: string };
	}

	let { tutor = $bindable(null), initial = {} }: Props = $props();

	let isOpen = $derived(tutor !== null);

	function close() {
		tutor = null;
	}
</script>

<Modal {isOpen} onClose={close} classes="max-w-2xl sm:px-4" backgroundBlur="xs">
	{#if tutor}
		<div
			class="flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-zinc-500/25 max-h-[calc(100dvh-var(--safe-t)-1rem)] sm:max-h-[90dvh] overflow-hidden"
			role="dialog"
			aria-modal="true"
			aria-labelledby="request-modal-title"
		>
			<div class="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-zinc-500/25">
				<div class="flex items-center gap-3 min-w-0">
					<TutorAvatar {tutor} size="sm" />
					<div class="min-w-0">
						<h2 id="request-modal-title" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">
							Chiedi aiuto a {tutorDisplayName(tutor)}
						</h2>
						<p class="text-sm text-zinc-600 dark:text-zinc-400 truncate">{tutor.headline}</p>
					</div>
				</div>
				<button
					type="button"
					onclick={close}
					class="shrink-0 flex size-[44px] items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
					aria-label="Chiudi"
				>
					<X class="size-5" aria-hidden="true" />
				</button>
			</div>
			<div class="p-4 sm:p-5 overflow-y-auto overscroll-contain pb-safe sm:pb-5">
				<RequestForm {tutor} {initial} />
			</div>
		</div>
	{/if}
</Modal>
