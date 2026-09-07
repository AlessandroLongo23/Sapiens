<script lang="ts">
	import { Home, UsersRound, BadgeCheck, MapPin, Monitor, GraduationCap, Clock, ArrowLeft } from 'lucide-svelte';
	import { SITE_NAME, TUTORING_ROOT } from '$lib/config/site';
	import {
		formatRate,
		levelName,
		subjectName,
		tutorDisplayName,
		whereLine,
		type TutorProfile
	} from '$lib/tutoring/config';

	import Seo from '$lib/components/seo/Seo.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import TutorAvatar from '$lib/components/tutoring/TutorAvatar.svelte';
	import RequestForm from '$lib/components/tutoring/RequestForm.svelte';

	let { data } = $props();
	let tutor = $derived(data.tutor as TutorProfile);

	let name = $derived(tutorDisplayName(tutor));
	let rate = $derived(formatRate(tutor.hourly_rate));
	let path = $derived(`${TUTORING_ROOT}/${tutor.slug}`);
	let subjectsLine = $derived(tutor.subjects.slice(0, 3).map(subjectName).join(', '));
	let onlineOnly = $derived(tutor.modes.includes('online') && !tutor.modes.includes('in_person'));

	let title = $derived(`${name}, ripetizioni di ${subjectsLine} | ${SITE_NAME}`);
	let description = $derived(
		`${name}: ${tutor.headline || 'tutor su Sapiens'}. ${whereLine(tutor)}${rate ? `, ${rate} indicativi` : ''}. Livelli: ${tutor.levels.map(levelName).join(', ')}. Chiedi aiuto e organizzate le lezioni tra voi.`
	);

	let breadcrumbItems = $derived([
		{ label: 'Home', path: '/', icon: Home },
		{ label: 'Ripetizioni', path: TUTORING_ROOT, icon: UsersRound },
		{ label: name, path }
	]);

	let paragraphs = $derived(tutor.bio.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean));
</script>

<Seo {title} {description} {path} type="article" />

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		<Breadcrumb items={breadcrumbItems} />

		<div class="grid lg:grid-cols-[1fr_minmax(20rem,26rem)] gap-8 lg:gap-10 items-start">
			<article class="space-y-8">
				<header class="flex flex-col sm:flex-row sm:items-start gap-5">
					<TutorAvatar {tutor} size="lg" />
					<div class="space-y-3 min-w-0">
						<div>
							<h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2 flex-wrap">
								{name}
								{#if tutor.verified}
									<span class="inline-flex items-center gap-1 text-sm font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 rounded-full px-2.5 py-0.5">
										<BadgeCheck class="size-4" aria-hidden="true" />
										Identità verificata
									</span>
								{/if}
							</h1>
							{#if tutor.headline}
								<p class="mt-1 text-lg text-zinc-600 dark:text-zinc-400">{tutor.headline}</p>
							{/if}
						</div>

						<dl class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-700 dark:text-zinc-300">
							<div class="flex items-center gap-1.5">
								{#if onlineOnly}
									<Monitor class="size-4 text-zinc-400" aria-hidden="true" />
								{:else}
									<MapPin class="size-4 text-zinc-400" aria-hidden="true" />
								{/if}
								<dt class="sr-only">Dove</dt>
								<dd>{whereLine(tutor)}</dd>
							</div>
							{#if tutor.education}
								<div class="flex items-center gap-1.5">
									<GraduationCap class="size-4 text-zinc-400" aria-hidden="true" />
									<dt class="sr-only">Formazione</dt>
									<dd>{tutor.education}</dd>
								</div>
							{/if}
							{#if tutor.years_experience > 0}
								<div class="flex items-center gap-1.5">
									<Clock class="size-4 text-zinc-400" aria-hidden="true" />
									<dt class="sr-only">Esperienza</dt>
									<dd>{tutor.years_experience} {tutor.years_experience === 1 ? 'anno' : 'anni'} di ripetizioni</dd>
								</div>
							{/if}
						</dl>

						{#if rate}
							<p class="text-zinc-900 dark:text-zinc-100">
								<span class="text-2xl font-semibold">{rate}</span>
								<span class="text-sm text-zinc-500 dark:text-zinc-400 ml-1">prezzo indicativo, da concordare con il tutor</span>
							</p>
						{/if}
					</div>
				</header>

				<section aria-labelledby="materie" class="space-y-3">
					<h2 id="materie" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Materie e livelli</h2>
					<ul class="flex flex-wrap gap-2" aria-label="Materie">
						{#each tutor.subjects as subject (subject)}
							<li class="px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-zinc-900 border border-zinc-500/25 text-zinc-800 dark:text-zinc-200">
								{subjectName(subject)}
							</li>
						{/each}
					</ul>
					<ul class="flex flex-wrap gap-2" aria-label="Livelli">
						{#each tutor.levels as level (level)}
							<li class="px-3 py-1.5 rounded-full text-sm bg-crimson-50 dark:bg-crimson-900/20 border border-crimson-200 dark:border-crimson-800 text-crimson-700 dark:text-crimson-200">
								{levelName(level)}
							</li>
						{/each}
					</ul>
				</section>

				{#if paragraphs.length > 0}
					<section aria-labelledby="presentazione" class="space-y-3">
						<h2 id="presentazione" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Presentazione</h2>
						<div class="prose prose-zinc dark:prose-invert max-w-none">
							{#each paragraphs as paragraph, i (i)}
								<p>{paragraph}</p>
							{/each}
						</div>
					</section>
				{/if}

				<a
					href={TUTORING_ROOT}
					class="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors"
				>
					<ArrowLeft class="size-4" aria-hidden="true" />
					Tutti i tutor
				</a>
			</article>

			<aside class="lg:sticky lg:top-6 rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-4" aria-labelledby="chiedi-aiuto">
				<div>
					<h2 id="chiedi-aiuto" class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Chiedi aiuto a {name}</h2>
					<p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
						Il tutor riceve il messaggio, non i tuoi contatti, e ha 48 ore per accettare.
					</p>
				</div>
				<RequestForm {tutor} compact />
			</aside>
		</div>
	</div>
</div>
