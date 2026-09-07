<script lang="ts">
	import { BadgeCheck, ExternalLink, Loader2 } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { TUTORING_ROOT } from '$lib/config/site';
	import { levelShort, modeName, subjectName } from '$lib/tutoring/config';
	import { formatDateTime } from '$lib/tutoring/time';
	import type { TutorRow, TutorStatus } from '$lib/server/tutoring-admin';

	import Seo from '$lib/components/seo/Seo.svelte';

	let { data } = $props();
	let tutors = $derived(data.tutors as TutorRow[]);

	type Filter = 'pending' | 'published' | 'suspended' | 'all';
	let filter = $state<Filter>('pending');
	let shown = $derived(filter === 'all' ? tutors : tutors.filter((t) => t.status === filter));
	let counts = $derived({
		pending: tutors.filter((t) => t.status === 'pending' || t.status === 'draft').length,
		published: tutors.filter((t) => t.status === 'published').length,
		suspended: tutors.filter((t) => t.status === 'suspended').length,
		all: tutors.length
	});

	let busy = $state<string | null>(null);
	let error = $state<string | null>(null);

	async function review(id: string, patch: { status?: TutorStatus; verified?: boolean }) {
		if (busy) return;
		busy = id;
		error = null;
		try {
			const response = await fetch(`/api/admin/tutors/${id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(patch)
			});
			const body = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(body.error ?? 'Operazione non riuscita.');
			await invalidateAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Operazione non riuscita.';
		} finally {
			busy = null;
		}
	}

	const STATUS_LABEL: Record<TutorStatus, string> = { draft: 'Bozza', pending: 'In revisione', published: 'Pubblicato', suspended: 'Sospeso' };
	const STATUS_CLASS: Record<TutorStatus, string> = {
		draft: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
		pending: 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
		published: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
		suspended: 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
	};
	const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-zinc-500/25 hover:border-zinc-500/50 transition-colors disabled:opacity-60';
</script>

<Seo title="Tutor | Admin | Sapiens" path="/admin/tutors" noindex />

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<header class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Tutor</h1>
			<p class="mt-1 text-zinc-600 dark:text-zinc-400">Pubblica i profili in revisione, sospendi quelli che non vanno, segna l'identità verificata.</p>
		</div>
		<div class="flex gap-1 rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-950 p-1" role="group" aria-label="Filtra per stato">
			{#each [['pending', 'In revisione'], ['published', 'Pubblicati'], ['suspended', 'Sospesi'], ['all', 'Tutti']] as [id, label] (id)}
				<button type="button" aria-pressed={filter === id} onclick={() => (filter = id as Filter)} class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {filter === id ? 'bg-crimson-600 text-white' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}">
					{label} ({counts[id as Filter]})
				</button>
			{/each}
		</div>
	</header>

	{#if error}
		<p class="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
	{/if}

	{#if shown.length === 0}
		<p class="rounded-2xl border border-dashed border-zinc-500/30 bg-white dark:bg-zinc-950 p-8 text-center text-zinc-600 dark:text-zinc-400">Nessun tutor in questo stato.</p>
	{:else}
		<ul class="space-y-3">
			{#each shown as t (t.id)}
				<li class="rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-950 p-5 grid lg:grid-cols-[1fr_auto] gap-4" data-tutor={t.slug}>
					<div class="space-y-2 min-w-0">
						<div class="flex flex-wrap items-center gap-2">
							<h2 class="font-semibold text-zinc-900 dark:text-zinc-100">{t.first_name} {t.last_name}</h2>
							<span class="px-2 py-0.5 rounded-full text-xs font-medium {STATUS_CLASS[t.status]}">{STATUS_LABEL[t.status]}</span>
							{#if t.verified}
								<span class="inline-flex items-center gap-1 text-xs text-sky-700 dark:text-sky-300"><BadgeCheck class="size-3.5" aria-hidden="true" /> verificato</span>
							{/if}
							{#if t.status === 'published'}
								<a href="{TUTORING_ROOT}/{t.slug}" class="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-crimson-600" target="_blank" rel="noopener">profilo <ExternalLink class="size-3" aria-hidden="true" /></a>
							{/if}
						</div>
						<p class="text-sm text-zinc-700 dark:text-zinc-300">{t.headline}</p>
						<p class="text-xs text-zinc-500 dark:text-zinc-400">
							{t.subjects.map(subjectName).join(', ')} · {t.levels.map(levelShort).join(', ')} · {t.modes.map(modeName).join(', ')}{t.city ? ` a ${t.city}` : ''}
							{t.hourly_rate != null ? ` · ${t.hourly_rate} €/h` : ''} · {t.education ?? 'formazione non indicata'}
						</p>
						<p class="text-xs text-zinc-500 dark:text-zinc-400">{t.contact_email ?? 'nessuna email'} · {t.contact_phone ?? 'nessun telefono'} · creato {formatDateTime(t.created_at)}</p>
						<details class="text-sm text-zinc-700 dark:text-zinc-300">
							<summary class="cursor-pointer text-zinc-500">Presentazione completa</summary>
							<p class="mt-2 whitespace-pre-wrap">{t.bio}</p>
						</details>
					</div>
					<div class="flex lg:flex-col flex-wrap gap-2 items-start">
						{#if t.status !== 'published'}
							<button type="button" disabled={busy === t.id} onclick={() => review(t.id, { status: 'published' })} class="{btn} bg-crimson-600 border-crimson-600 text-white hover:bg-crimson-700">
								{#if busy === t.id}<Loader2 class="size-4 animate-spin" aria-hidden="true" />{/if}
								Pubblica
							</button>
						{/if}
						{#if t.status === 'published'}
							<button type="button" disabled={busy === t.id} onclick={() => review(t.id, { status: 'suspended' })} class="{btn} text-zinc-800 dark:text-zinc-100">Sospendi</button>
						{/if}
						{#if t.status === 'suspended'}
							<button type="button" disabled={busy === t.id} onclick={() => review(t.id, { status: 'pending' })} class="{btn} text-zinc-800 dark:text-zinc-100">Rimetti in revisione</button>
						{/if}
						<button type="button" disabled={busy === t.id} onclick={() => review(t.id, { verified: !t.verified })} class="{btn} text-zinc-800 dark:text-zinc-100">
							<BadgeCheck class="size-4" aria-hidden="true" />
							{t.verified ? 'Togli verifica' : 'Segna verificato'}
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
