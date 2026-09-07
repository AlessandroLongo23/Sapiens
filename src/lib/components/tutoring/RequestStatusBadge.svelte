<script lang="ts">
	import type { RequestStatus } from '$lib/server/tutoring-admin';

	let { status }: { status: RequestStatus } = $props();

	const STYLES: Record<RequestStatus, { label: string; classes: string }> = {
		pending: { label: 'In attesa', classes: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800' },
		accepted: { label: 'Accettata', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800' },
		declined: { label: 'Rifiutata', classes: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700' },
		expired: { label: 'Scaduta', classes: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700' },
		cancelled: { label: 'Annullata', classes: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700' }
	};

	let style = $derived(STYLES[status] ?? STYLES.pending);
</script>

<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {style.classes}">{style.label}</span>
