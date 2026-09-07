<script lang="ts">
	import { Home, UsersRound, BookOpen, MapPin, BadgeCheck, MousePointerClick, Send, Handshake, Mail, Inbox, ArrowRight } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authState } from '$lib/state/auth.svelte';
	import { SITE_NAME, TUTORING_ROOT } from '$lib/config/site';
	import { subjectName, type TutorProfile } from '$lib/tutoring/config';
	import {
		EMPTY_FILTERS,
		activeFilterCount,
		applyFilters,
		citiesOf,
		filtersFromParams,
		paramsFromFilters,
		type TutorFilters as Filters
	} from '$lib/tutoring/filter';

	import Seo from '$lib/components/seo/Seo.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import TutorCard from '$lib/components/tutoring/TutorCard.svelte';
	import TutorFilters from '$lib/components/tutoring/TutorFilters.svelte';
	import RequestModal from '$lib/components/tutoring/RequestModal.svelte';

	let { data } = $props();
	let tutors = $derived(data.tutors as TutorProfile[]);

	// Filters live in the URL. The cached HTML is rendered with none; after
	// hydration the first effect reads the query string, and every later change
	// rewrites it in place (no history entry per keystroke).
	let filters = $state<Filters>({ ...EMPTY_FILTERS });
	let appliedSearch = '';

	$effect(() => {
		const search = page.url.search;
		if (search === appliedSearch) return;
		appliedSearch = search;
		filters = filtersFromParams(page.url.searchParams);
	});

	$effect(() => {
		const query = paramsFromFilters(filters).toString();
		const search = query ? `?${query}` : '';
		if (!browser || search === appliedSearch) return;
		appliedSearch = search;
		goto(`${TUTORING_ROOT}${search}`, { replaceState: true, keepFocus: true, noScroll: true });
	});

	let cities = $derived(citiesOf(tutors));
	let results = $derived(applyFilters(tutors, filters, { subjectName }));
	let subjectCount = $derived(new Set(tutors.flatMap((t) => t.subjects)).size);
	let verifiedCount = $derived(tutors.filter((t) => t.verified).length);

	let requestTutor = $state<TutorProfile | null>(null);

	const breadcrumbItems = [
		{ label: 'Home', path: '/', icon: Home },
		{ label: 'Ripetizioni', path: TUTORING_ROOT, icon: UsersRound }
	];

	const description =
		'Trova un tutor per matematica, fisica, chimica e informatica, online o in presenza, per medie, superiori e università. Scegli il profilo, invia la richiesta e organizzate le lezioni tra voi: nessuna commissione sulle lezioni.';

	const steps = [
		{
			icon: MousePointerClick,
			title: 'Scegli il tutor',
			text: 'Filtra per materia, livello e città e leggi i profili. I cognomi e i contatti restano privati.'
		},
		{
			icon: Send,
			title: 'Invia la richiesta',
			text: 'Racconta di cosa hai bisogno. Il tutor riceve il messaggio, non i tuoi contatti, e ha 48 ore per rispondere.'
		},
		{
			icon: Handshake,
			title: 'Vi mettiamo in contatto',
			text: 'Se accetta, ricevete i contatti a vicenda e concordate orari e prezzo direttamente. Sapiens non trattiene nulla sulle lezioni.'
		}
	];
</script>

<Seo title="Ripetizioni private: tutor online e in presenza | {SITE_NAME}" {description} path={TUTORING_ROOT} />

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		<header class="mb-8 sm:mb-10" in:fade={{ duration: 300 }}>
			<Breadcrumb items={breadcrumbItems} />

			<div class="flex items-start gap-6">
				<div class="hidden sm:flex items-center justify-center size-28 lg:size-32 shrink-0 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-500/25 text-crimson-500 dark:text-crimson-400">
					<UsersRound class="size-14 lg:size-16" aria-hidden="true" />
				</div>

				<div class="flex-1 space-y-4">
					<div class="space-y-2">
						<div class="flex items-center gap-3">
							<UsersRound class="size-8 text-crimson-500 dark:text-crimson-400 sm:hidden" aria-hidden="true" />
							<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Ripetizioni</h1>
						</div>
						<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
							Tutor di matematica, fisica, chimica e informatica per medie, superiori e università. Scegli il profilo,
							chiedi aiuto e, se il tutor accetta, organizzate le lezioni tra voi.
						</p>
					</div>

					<div class="flex flex-wrap gap-3">
						<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
							<UsersRound class="size-4 text-crimson-500" aria-hidden="true" />
							<span class="font-medium">{tutors.length} tutor</span>
						</div>
						<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
							<BookOpen class="size-4 text-teal-500" aria-hidden="true" />
							<span class="font-medium">{subjectCount} {subjectCount === 1 ? 'materia' : 'materie'}</span>
						</div>
						<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
							<MapPin class="size-4 text-indigo-500" aria-hidden="true" />
							<span class="font-medium">{cities.length} città</span>
						</div>
						{#if authState.user}
							<a href="/richieste" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-crimson-600 text-white text-sm font-medium hover:bg-crimson-700 transition-colors">
								<Inbox class="size-4" aria-hidden="true" />
								Le tue richieste
							</a>
						{/if}
						{#if verifiedCount > 0}
							<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
								<BadgeCheck class="size-4 text-sky-500" aria-hidden="true" />
								<span class="font-medium">{verifiedCount} {verifiedCount === 1 ? 'verificato' : 'verificati'}</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</header>

		<div class="space-y-6" in:fade={{ duration: 400, delay: 100 }}>
			<TutorFilters bind:filters {cities} resultCount={results.length} />

			{#if tutors.length === 0}
				<div class="rounded-2xl border border-dashed border-zinc-500/30 bg-white/60 dark:bg-zinc-900/60 p-10 text-center space-y-3">
					<UsersRound class="size-10 mx-auto text-zinc-400" aria-hidden="true" />
					<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">I primi tutor stanno arrivando</h2>
					<p class="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
						Stiamo verificando i primi profili. Nel frattempo puoi chiedere una lezione individuale dalla pagina contatti.
					</p>
					<a href="/contacts" class="inline-flex items-center gap-2 text-crimson-600 dark:text-crimson-400 font-medium hover:underline">
						<Mail class="size-4" aria-hidden="true" />
						Scrivici
					</a>
				</div>
			{:else if results.length === 0}
				<div class="rounded-2xl border border-dashed border-zinc-500/30 bg-white/60 dark:bg-zinc-900/60 p-10 text-center space-y-3" role="status">
					<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Nessun tutor con questi filtri</h2>
					<p class="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
						Prova a togliere la città o a cercare solo la materia: molti tutor fanno lezione anche online.
					</p>
					{#if activeFilterCount(filters) > 0}
						<button
							type="button"
							onclick={() => (filters = { ...EMPTY_FILTERS, sort: filters.sort })}
							class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:border-crimson-300 dark:hover:border-crimson-800 transition-colors"
						>
							Azzera i filtri
						</button>
					{/if}
				</div>
			{:else}
				<ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6" aria-label="Tutor disponibili">
					{#each results as tutor, index (tutor.id)}
						<li in:fly|global={{ y: 16, duration: 300, delay: Math.min(index, 8) * 40 }} class="h-full">
							<TutorCard {tutor} highlightSubject={filters.subject} onRequest={(t) => (requestTutor = t)} />
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<section class="mt-14 sm:mt-20" aria-labelledby="come-funziona">
			<h2 id="come-funziona" class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Come funziona</h2>
			<ol class="grid md:grid-cols-3 gap-5">
				{#each steps as step, i (step.title)}
					{@const Icon = step.icon}
					<li class="rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 p-6 space-y-3">
						<div class="flex items-center gap-3">
							<span class="flex items-center justify-center size-10 rounded-xl bg-crimson-50 dark:bg-crimson-900/30 text-crimson-600 dark:text-crimson-300">
								<Icon class="size-5" aria-hidden="true" />
							</span>
							<span class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Passo {i + 1}</span>
						</div>
						<h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
						<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{step.text}</p>
					</li>
				{/each}
			</ol>
			<p class="mt-5 text-sm text-zinc-500 dark:text-zinc-400 max-w-3xl">
				Come ordiniamo i tutor: con l'ordine "Consigliati" mostriamo prima i profili con identità verificata, poi i più
				recenti. Nessun tutor paga per salire in classifica. Gli altri ordinamenti seguono il prezzo indicativo o la data
				di iscrizione.
			</p>
		</section>

		<section class="mt-10 rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4" aria-labelledby="sei-un-tutor">
			<div class="flex-1 space-y-1">
				<h2 id="sei-un-tutor" class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Dai ripetizioni?</h2>
				<p class="text-sm text-zinc-600 dark:text-zinc-400">
					Studenti universitari e laureati in materie scientifiche possono aprire un profilo gratuito. Nessuna
					commissione sulle lezioni: i contatti degli studenti arrivano solo quando accetti una richiesta.
				</p>
			</div>
			<a
				href="{TUTORING_ROOT}/diventa-tutor"
				class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-zinc-500/25 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-800 dark:text-zinc-100 hover:border-crimson-300 dark:hover:border-crimson-800 transition-colors"
			>
				Scopri come funziona
				<ArrowRight class="size-4" aria-hidden="true" />
			</a>
		</section>
	</div>
</div>

<RequestModal bind:tutor={requestTutor} initial={{ subject: filters.subject, level: filters.level, mode: filters.mode }} />
