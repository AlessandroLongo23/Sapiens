<script lang="ts">
	import { Phone, Mail, Search, ArrowRight, X, Loader2 } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { TUTORING_ROOT } from '$lib/config/site';
	import { levelName, modeName, subjectName } from '$lib/tutoring/config';
	import { formatDateTime, timeLeft } from '$lib/tutoring/time';
	import type { StudentRequest } from '$lib/server/tutoring-admin';

	import Seo from '$lib/components/seo/Seo.svelte';
	import RequestStatusBadge from '$lib/components/tutoring/RequestStatusBadge.svelte';

	let { data } = $props();
	let requests = $derived(data.requests as StudentRequest[]);

	let busy = $state<string | null>(null);
	let confirmCancel = $state<string | null>(null);
	let error = $state<string | null>(null);

	async function cancel(id: string) {
		if (busy) return;
		busy = id;
		error = null;
		try {
			const response = await fetch(`/api/tutoring/requests/${id}/cancel`, { method: 'POST' });
			const body = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(body.error ?? 'Operazione non riuscita. Riprova.');
			confirmCancel = null;
			await invalidateAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Operazione non riuscita. Riprova.';
		} finally {
			busy = null;
		}
	}

	const tutorName = (r: StudentRequest) => `${r.tutor.first_name}${r.tutor.last_initial ? ` ${r.tutor.last_initial}.` : ''}`;
	const searchAgain = (r: StudentRequest) => `${TUTORING_ROOT}?materia=${encodeURIComponent(r.subject)}&livello=${encodeURIComponent(r.level)}`;
</script>

<Seo title="Le tue richieste | Sapiens" path="/richieste" noindex />

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<header class="mb-6 flex flex-wrap items-end justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Le tue richieste</h1>
				<p class="mt-1 text-zinc-600 dark:text-zinc-400">Il tutor ha 48 ore per rispondere. Se accetta, qui trovi i suoi contatti.</p>
			</div>
			<a href={TUTORING_ROOT} class="inline-flex items-center gap-2 text-sm font-medium text-crimson-600 dark:text-crimson-400 hover:underline">
				<Search class="size-4" aria-hidden="true" />
				Cerca un tutor
			</a>
		</header>

		{#if error}
			<p class="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
		{/if}

		{#if requests.length === 0}
			<section class="rounded-2xl border border-dashed border-zinc-500/30 bg-white dark:bg-zinc-950 p-8 text-center space-y-3">
				<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Nessuna richiesta ancora</h2>
				<p class="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">Scegli un tutor dalla lista e racconta di cosa hai bisogno.</p>
				<a href={TUTORING_ROOT} class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-semibold transition-colors">Trova un tutor <ArrowRight class="size-4" aria-hidden="true" /></a>
			</section>
		{:else}
			<ul class="space-y-4">
				{#each requests as r (r.id)}
					{@const left = timeLeft(r.expires_at)}
					<li class="rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-950 p-5 space-y-3" data-request={r.id}>
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<h2 class="font-semibold text-zinc-900 dark:text-zinc-100">
									{#if r.tutor.published}
										<a href="{TUTORING_ROOT}/{r.tutor.slug}" class="hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors">{tutorName(r)}</a>
									{:else}
										{tutorName(r)}
									{/if}
									<span class="font-normal text-zinc-500"> · {subjectName(r.subject)}</span>
								</h2>
								<p class="text-sm text-zinc-500 dark:text-zinc-400">{levelName(r.level)} · {modeName(r.mode)} · inviata {formatDateTime(r.created_at)}</p>
							</div>
							<div class="flex items-center gap-2">
								{#if r.status === 'pending'}<span class="text-xs text-amber-700 dark:text-amber-300">{left.label}</span>{/if}
								<RequestStatusBadge status={r.status} />
							</div>
						</div>

						{#if r.status === 'accepted' && r.tutor.contact}
							<div class="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4 space-y-2">
								<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{r.tutor.first_name} ha accettato: contattatevi e concordate orari e prezzo.</p>
								<dl class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
									{#if r.tutor.contact.phone}
										<div class="flex items-center gap-2">
											<Phone class="size-4 text-zinc-400" aria-hidden="true" />
											<dt class="sr-only">Telefono</dt>
											<dd><a href="tel:{r.tutor.contact.phone.replace(/\s/g, '')}" class="text-crimson-600 dark:text-crimson-400 hover:underline">{r.tutor.contact.phone}</a></dd>
										</div>
									{/if}
									{#if r.tutor.contact.email}
										<div class="flex items-center gap-2">
											<Mail class="size-4 text-zinc-400" aria-hidden="true" />
											<dt class="sr-only">Email</dt>
											<dd><a href="mailto:{r.tutor.contact.email}" class="text-crimson-600 dark:text-crimson-400 hover:underline">{r.tutor.contact.email}</a></dd>
										</div>
									{/if}
								</dl>
							</div>
						{:else if r.status === 'declined' || r.status === 'expired'}
							<p class="text-sm text-zinc-600 dark:text-zinc-400">
								{r.status === 'declined' ? 'Il tutor non può accettare in questo momento.' : 'Il tutor non ha risposto entro 48 ore.'}
								<a href={searchAgain(r)} class="text-crimson-600 dark:text-crimson-400 hover:underline">Trova un altro tutor</a>.
							</p>
						{/if}

						<blockquote class="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-500/15 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{r.message}</blockquote>

						{#if r.status === 'pending'}
							<div class="flex flex-wrap items-center gap-2">
								{#if confirmCancel === r.id}
									<span class="text-sm text-zinc-700 dark:text-zinc-300">Annullare la richiesta?</span>
									<button type="button" disabled={busy === r.id} onclick={() => cancel(r.id)} class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-semibold disabled:opacity-60">
										{#if busy === r.id}<Loader2 class="size-4 animate-spin" aria-hidden="true" />{/if}
										Sì, annulla
									</button>
									<button type="button" onclick={() => (confirmCancel = null)} class="px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">Tieni</button>
								{:else}
									<button type="button" onclick={() => (confirmCancel = r.id)} class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-500/25 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:border-zinc-500/50 transition-colors">
										<X class="size-4" aria-hidden="true" />
										Annulla richiesta
									</button>
								{/if}
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
