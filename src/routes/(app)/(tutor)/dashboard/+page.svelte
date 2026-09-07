<script lang="ts">
	import { Clock, CheckCircle2, ShieldAlert, Inbox, UserPen, BadgeCheck, ArrowRight } from 'lucide-svelte';
	import { TUTORING_ROOT } from '$lib/config/site';
	import { subjectName } from '$lib/tutoring/config';

	import Seo from '$lib/components/seo/Seo.svelte';

	let { data } = $props();
	let tutor = $derived(data.tutor);
	let counts = $derived(data.counts);

	const STATUS = {
		draft: { icon: Clock, title: 'Bozza', text: 'Completa il profilo per inviarlo in revisione.', classes: 'border-zinc-300 bg-white dark:bg-zinc-950' },
		pending: { icon: Clock, title: 'In revisione', text: 'Controlliamo il profilo e ti avvisiamo via email quando è pubblico. Nel frattempo puoi ancora modificarlo.', classes: 'border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800' },
		published: { icon: CheckCircle2, title: 'Pubblicato', text: 'Il profilo è visibile nella lista dei tutor. Le richieste degli studenti arrivano qui e via email.', classes: 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800' },
		suspended: { icon: ShieldAlert, title: 'Sospeso', text: 'Il profilo non è visibile. Scrivici dalla pagina contatti per chiarire.', classes: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' }
	} as const;
</script>

<Seo title="Area tutor | Sapiens" path="/dashboard" noindex />

{#if !tutor}
	<section class="rounded-2xl border border-dashed border-zinc-500/30 bg-white dark:bg-zinc-950 p-8 text-center space-y-3">
		<UserPen class="size-10 mx-auto text-zinc-400" aria-hidden="true" />
		<h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Non hai ancora un profilo tutor</h1>
		<p class="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">Racconta cosa insegni, a chi e dove: bastano cinque minuti. Il profilo va in revisione e poi compare nella lista.</p>
		<a href="/profile-editor" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-semibold transition-colors">
			Crea il profilo
			<ArrowRight class="size-4" aria-hidden="true" />
		</a>
	</section>
{:else}
	{@const status = STATUS[tutor.status]}
	{@const StatusIcon = status.icon}
	<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Ciao {tutor.first_name}</h1>

	<div class="grid lg:grid-cols-3 gap-5">
		<section class="lg:col-span-2 rounded-2xl border p-6 {status.classes}" aria-labelledby="stato">
			<div class="flex items-start gap-3">
				<StatusIcon class="size-6 shrink-0 text-zinc-700 dark:text-zinc-200" aria-hidden="true" />
				<div class="space-y-1">
					<h2 id="stato" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
						Profilo: {status.title}
						{#if tutor.verified}
							<span class="inline-flex items-center gap-1 text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 rounded-full px-2 py-0.5">
								<BadgeCheck class="size-3.5" aria-hidden="true" />
								Identità verificata
							</span>
						{/if}
					</h2>
					<p class="text-sm text-zinc-700 dark:text-zinc-300">{status.text}</p>
					{#if tutor.status === 'published'}
						<a href="{TUTORING_ROOT}/{tutor.slug}" class="inline-flex items-center gap-1 text-sm font-medium text-crimson-600 dark:text-crimson-400 hover:underline">Vedi il profilo pubblico <ArrowRight class="size-3.5" aria-hidden="true" /></a>
					{/if}
				</div>
			</div>
		</section>

		<section class="rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-950 p-6" aria-labelledby="richieste">
			<h2 id="richieste" class="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2"><Inbox class="size-4" aria-hidden="true" /> Richieste</h2>
			<dl class="grid grid-cols-2 gap-4">
				<div>
					<dt class="text-xs text-zinc-500 dark:text-zinc-400">In attesa</dt>
					<dd class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{counts.pending}</dd>
				</div>
				<div>
					<dt class="text-xs text-zinc-500 dark:text-zinc-400">Accettate</dt>
					<dd class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{counts.accepted}</dd>
				</div>
			</dl>
			<a href="/leads" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-crimson-600 dark:text-crimson-400 hover:underline">Apri le richieste <ArrowRight class="size-3.5" aria-hidden="true" /></a>
		</section>

		<section class="lg:col-span-3 rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-950 p-6" aria-labelledby="profilo">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div class="space-y-2">
					<h2 id="profilo" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{tutor.first_name} {tutor.last_name.charAt(0)}. · {tutor.headline}</h2>
					<ul class="flex flex-wrap gap-2">
						{#each tutor.subjects as s (s)}
							<li class="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">{subjectName(s)}</li>
						{/each}
					</ul>
				</div>
				<a href="/profile-editor" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-500/25 text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:border-crimson-300 dark:hover:border-crimson-800 transition-colors">
					<UserPen class="size-4" aria-hidden="true" />
					Modifica il profilo
				</a>
			</div>
		</section>
	</div>
{/if}
