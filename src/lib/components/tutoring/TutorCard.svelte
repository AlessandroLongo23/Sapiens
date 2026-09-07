<script lang="ts">
	import { BadgeCheck, MapPin, Monitor, MessageCircle, ChevronRight } from 'lucide-svelte';
	import { TUTORING_ROOT } from '$lib/config/site';
	import {
		formatRate,
		levelShort,
		subjectName,
		tutorDisplayName,
		whereLine,
		type TutorProfile
	} from '$lib/tutoring/config';

	import TutorAvatar from './TutorAvatar.svelte';

	interface Props {
		tutor: TutorProfile;
		/** Subject id currently filtered: shown first and emphasised on the card. */
		highlightSubject?: string;
		onRequest: (tutor: TutorProfile) => void;
	}

	let { tutor, highlightSubject = '', onRequest }: Props = $props();

	const MAX_SUBJECTS = 3;

	let name = $derived(tutorDisplayName(tutor));
	let rate = $derived(formatRate(tutor.hourly_rate));
	let profileHref = $derived(`${TUTORING_ROOT}/${tutor.slug}`);

	let orderedSubjects = $derived(
		highlightSubject && tutor.subjects.includes(highlightSubject)
			? [highlightSubject, ...tutor.subjects.filter((s: string) => s !== highlightSubject)]
			: tutor.subjects
	);
	let shownSubjects = $derived(orderedSubjects.slice(0, MAX_SUBJECTS));
	let hiddenSubjects = $derived(Math.max(0, orderedSubjects.length - MAX_SUBJECTS));
	let onlineOnly = $derived(tutor.modes.includes('online') && !tutor.modes.includes('in_person'));
</script>

<article
	class="group h-full flex flex-col rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-crimson-200 dark:hover:border-crimson-800 hover:shadow-xl hover:shadow-crimson-500/5 hover:-translate-y-1 relative overflow-hidden"
	aria-labelledby="tutor-{tutor.id}"
>
	<div
		class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-crimson-500 to-crimson-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
		aria-hidden="true"
	></div>

	<div class="p-5 sm:p-6 flex flex-col flex-1 gap-4">
		<div class="flex items-start gap-4">
			<TutorAvatar {tutor} size="md" />
			<div class="min-w-0 flex-1">
				<div class="flex items-start justify-between gap-3">
					<h3 id="tutor-{tutor.id}" class="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
						<a href={profileHref} class="hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 rounded">
							{name}
						</a>
						{#if tutor.verified}
							<span class="inline-flex align-middle ml-1 text-sky-600 dark:text-sky-400" title="Identità verificata">
								<BadgeCheck class="size-5" aria-hidden="true" />
								<span class="sr-only">Identità verificata</span>
							</span>
						{/if}
					</h3>
					{#if rate}
						<p class="shrink-0 text-right">
							<span class="block text-base font-semibold text-zinc-900 dark:text-zinc-100">{rate}</span>
							<span class="block text-xs text-zinc-500 dark:text-zinc-400">indicativo</span>
						</p>
					{/if}
				</div>
				{#if tutor.headline}
					<p class="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{tutor.headline}</p>
				{/if}
			</div>
		</div>

		<ul class="flex flex-wrap gap-2" aria-label="Materie">
			{#each shownSubjects as subject (subject)}
				<li
					class="px-2.5 py-1 rounded-full text-xs font-medium border {subject === highlightSubject
						? 'bg-crimson-50 border-crimson-200 text-crimson-700 dark:bg-crimson-900/30 dark:border-crimson-800 dark:text-crimson-200'
						: 'bg-zinc-50 border-zinc-500/20 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}"
				>
					{subjectName(subject)}
				</li>
			{/each}
			{#if hiddenSubjects > 0}
				<li class="px-2.5 py-1 rounded-full text-xs font-medium text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-500/30">
					+{hiddenSubjects}
				</li>
			{/if}
		</ul>

		<dl class="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
			<div class="flex items-center gap-2">
				<dt class="sr-only">Livelli</dt>
				<dd class="flex flex-wrap gap-x-2 gap-y-0.5">
					{#each tutor.levels as level, i (level)}
						<span>{levelShort(level)}{i < tutor.levels.length - 1 ? ' ·' : ''}</span>
					{/each}
				</dd>
			</div>
			<div class="flex items-center gap-2">
				{#if onlineOnly}
					<Monitor class="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
				{:else}
					<MapPin class="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
				{/if}
				<dt class="sr-only">Dove</dt>
				<dd>{whereLine(tutor)}</dd>
			</div>
		</dl>

		<div class="mt-auto pt-4 border-t border-zinc-500/25 flex items-center justify-between gap-3">
			<a
				href={profileHref}
				class="inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
			>
				Vedi profilo
				<ChevronRight class="size-4" aria-hidden="true" />
			</a>
			<button
				type="button"
				onclick={() => onRequest(tutor)}
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
			>
				<MessageCircle class="size-4" aria-hidden="true" />
				Chiedi aiuto
			</button>
		</div>
	</div>
</article>
