<script lang="ts">
	import { Inbox, Check, X, Phone, Mail, Clock, UserPen, ArrowRight, Loader2 } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { levelName, modeName, subjectName } from '$lib/tutoring/config';
	import { formatDateTime, timeLeft } from '$lib/tutoring/time';
	import type { InboxRequest } from '$lib/server/tutoring-admin';

	import Seo from '$lib/components/seo/Seo.svelte';
	import RequestStatusBadge from '$lib/components/tutoring/RequestStatusBadge.svelte';

	/** The tutor's requests: answer the pending ones, keep the contacts of the accepted ones. */
	let { data } = $props();
	let tutor = $derived(data.tutor);
	let requests = $derived(data.requests as InboxRequest[]);

	let pending = $derived(requests.filter((r) => r.status === 'pending'));
	let accepted = $derived(requests.filter((r) => r.status === 'accepted'));
	let archived = $derived(requests.filter((r) => r.status !== 'pending' && r.status !== 'accepted'));

	let busy = $state<string | null>(null);
	let confirmDecline = $state<string | null>(null);
	let error = $state<string | null>(null);

	async function respond(id: string, action: 'accept' | 'decline') {
		if (busy) return;
		busy = id;
		error = null;
		try {
			const response = await fetch(`/api/tutoring/requests/${id}/respond`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action })
			});
			const body = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(body.error ?? 'Operazione non riuscita. Riprova.');
			confirmDecline = null;
			await invalidateAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Operazione non riuscita. Riprova.';
		} finally {
			busy = null;
		}
	}

	const who = (r: InboxRequest) => (r.requester === 'parent' ? 'Un genitore' : 'Uno studente');
</script>

<Seo title="Richieste | Area tutor | Sapiens" path="/leads" noindex />

<header class="mb-6">
	<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Richieste</h1>
	<p class="mt-1 text-zinc-600 dark:text-zinc-400">Hai 48 ore per rispondere. Accettando ricevi i contatti dello studente e lo studente riceve i tuoi.</p>
</header>

{#if !tutor}
	<section class="rounded-2xl border border-dashed border-zinc-500/30 bg-white dark:bg-zinc-950 p-8 text-center space-y-3">
		<UserPen class="size-10 mx-auto text-zinc-400" aria-hidden="true" />
		<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Prima crea il tuo profilo</h2>
		<a href="/profile-editor" class="inline-flex items-center gap-2 text-crimson-600 dark:text-crimson-400 font-medium hover:underline">Crea il profilo <ArrowRight class="size-4" aria-hidden="true" /></a>
	</section>
{:else}
	{#if error}
		<p class="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
	{/if}

	<section class="mb-10" aria-labelledby="in-attesa">
		<h2 id="in-attesa" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
			<Clock class="size-5 text-amber-500" aria-hidden="true" />
			In attesa di risposta
			<span class="text-sm font-normal text-zinc-500">({pending.length})</span>
		</h2>
		{#if pending.length === 0}
			<p class="rounded-2xl border border-dashed border-zinc-500/30 bg-white dark:bg-zinc-950 p-6 text-sm text-zinc-600 dark:text-zinc-400">
				Nessuna richiesta in attesa. {#if tutor.status !== 'published'}Il profilo non è ancora pubblico: le richieste arrivano dopo la pubblicazione.{/if}
			</p>
		{:else}
			<ul class="space-y-4">
				{#each pending as r (r.id)}
					{@const left = timeLeft(r.expires_at)}
					<li class="rounded-2xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-zinc-950 p-5 space-y-4" data-request={r.id}>
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<p class="font-semibold text-zinc-900 dark:text-zinc-100">{who(r)} · {subjectName(r.subject)}</p>
								<p class="text-sm text-zinc-500 dark:text-zinc-400">{levelName(r.level)} · {modeName(r.mode)} · ricevuta {formatDateTime(r.created_at)}</p>
							</div>
							<span class="text-sm font-medium {left.expired ? 'text-red-600' : 'text-amber-700 dark:text-amber-300'}">{left.label}</span>
						</div>
						<blockquote class="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-500/15 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{r.message}</blockquote>
						<p class="text-xs text-zinc-500 dark:text-zinc-400">Nome e telefono compaiono qui, e ti arrivano via email, quando accetti.</p>
						<div class="flex flex-wrap items-center gap-2">
							{#if confirmDecline === r.id}
								<span class="text-sm text-zinc-700 dark:text-zinc-300">Confermi il rifiuto? Lo studente viene avvisato, senza motivazione.</span>
								<button type="button" disabled={busy === r.id} onclick={() => respond(r.id, 'decline')} class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-semibold disabled:opacity-60">Sì, rifiuta</button>
								<button type="button" onclick={() => (confirmDecline = null)} class="px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">Annulla</button>
							{:else}
								<button type="button" disabled={busy === r.id} onclick={() => respond(r.id, 'accept')} class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white text-sm font-semibold transition-colors disabled:opacity-60">
									{#if busy === r.id}<Loader2 class="size-4 animate-spin" aria-hidden="true" />{:else}<Check class="size-4" aria-hidden="true" />{/if}
									Accetta
								</button>
								<button type="button" disabled={busy === r.id} onclick={() => (confirmDecline = r.id)} class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-500/25 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:border-zinc-500/50 transition-colors disabled:opacity-60">
									<X class="size-4" aria-hidden="true" />
									Rifiuta
								</button>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="mb-10" aria-labelledby="accettate">
		<h2 id="accettate" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
			<Check class="size-5 text-emerald-500" aria-hidden="true" />
			Accettate
			<span class="text-sm font-normal text-zinc-500">({accepted.length})</span>
		</h2>
		{#if accepted.length === 0}
			<p class="text-sm text-zinc-500 dark:text-zinc-400">Ancora nessuna.</p>
		{:else}
			<ul class="space-y-4">
				{#each accepted as r (r.id)}
					<li class="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-950 p-5 space-y-3" data-request={r.id}>
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<p class="font-semibold text-zinc-900 dark:text-zinc-100">{r.contact?.name} · {subjectName(r.subject)}</p>
								<p class="text-sm text-zinc-500 dark:text-zinc-400">{levelName(r.level)} · {modeName(r.mode)} · accettata {r.responded_at ? formatDateTime(r.responded_at) : ''}</p>
							</div>
							<RequestStatusBadge status={r.status} />
						</div>
						{#if r.contact}
							<dl class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
								<div class="flex items-center gap-2">
									<Phone class="size-4 text-zinc-400" aria-hidden="true" />
									<dt class="sr-only">Telefono</dt>
									<dd><a href="tel:{r.contact.phone.replace(/\s/g, '')}" class="text-crimson-600 dark:text-crimson-400 hover:underline">{r.contact.phone}</a></dd>
								</div>
								{#if r.contact.email}
									<div class="flex items-center gap-2">
										<Mail class="size-4 text-zinc-400" aria-hidden="true" />
										<dt class="sr-only">Email</dt>
										<dd><a href="mailto:{r.contact.email}" class="text-crimson-600 dark:text-crimson-400 hover:underline">{r.contact.email}</a></dd>
									</div>
								{/if}
							</dl>
						{/if}
						<blockquote class="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-500/15 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{r.message}</blockquote>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	{#if archived.length > 0}
		<section aria-labelledby="archivio">
			<h2 id="archivio" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
				<Inbox class="size-5 text-zinc-400" aria-hidden="true" />
				Archivio
				<span class="text-sm font-normal text-zinc-500">({archived.length})</span>
			</h2>
			<ul class="space-y-2">
				{#each archived as r (r.id)}
					<li class="rounded-xl border border-zinc-500/20 bg-white dark:bg-zinc-950 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-sm" data-request={r.id}>
						<div class="min-w-0">
							<p class="text-zinc-700 dark:text-zinc-300">{who(r)} · {subjectName(r.subject)} · {formatDateTime(r.created_at)}</p>
							<p class="text-xs text-zinc-500 dark:text-zinc-400 truncate" title={r.message}>{r.message}</p>
						</div>
						<RequestStatusBadge status={r.status} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}
{/if}
