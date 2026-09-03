<script lang="ts">
	import { page } from '$app/state';
	import { ArrowRight } from 'lucide-svelte';
	import type { ContentNode } from '$lib/utils/tree';
	import type { SubjectGuideContent } from '$lib/content/subject-copy';
	import { nodePath, plainTitle, slugify } from '$lib/seo/slug';
	import { levelLong } from '$lib/seo/meta';

	let { guide, subject, ancestors } = $props<{
		guide: SubjectGuideContent;
		subject: ContentNode;
		ancestors: ContentNode[];
	}>();

	let level = $derived(ancestors[0]);
	let tree = $derived((page.data.tree ?? []) as ContentNode[]);

	// Other subjects at the same level
	let siblings = $derived(level.children.filter((s: ContentNode) => s.id !== subject.id));

	// The same subject (or its closest relative) at the other levels
	let otherLevels = $derived(
		tree
			.filter((l) => l.id !== level.id)
			.map((l) => {
				const family = slugify(subject.title).split('-')[0];
				const match =
					l.children.find((s) => s.slug === subject.slug) ??
					l.children.find((s) => slugify(s.title).split('-')[0] === family) ??
					null;
				return { level: l, subject: match };
			})
	);

	const linkClass =
		'inline-flex items-center gap-1.5 text-crimson-600 dark:text-crimson-400 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500';
</script>

<section class="mt-16 max-w-3xl" aria-labelledby="guida-heading">
	{#each guide.sections as section, index}
		<h2
			id={index === 0 ? 'guida-heading' : undefined}
			class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 {index === 0 ? '' : 'mt-10'} mb-4"
		>
			{section.heading}
		</h2>
		{#each section.paragraphs as paragraph}
			<p class="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">{paragraph}</p>
		{/each}
	{/each}

	<nav class="mt-10 pt-6 border-t border-zinc-500/25" aria-label="Collegamenti correlati">
		<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Continua a esplorare</h2>
		<ul class="space-y-2 text-zinc-700 dark:text-zinc-300">
			{#each siblings as sibling (sibling.id)}
				<li>
					<a href={nodePath([level, sibling])} class={linkClass}>
						{plainTitle(sibling.title)} per {levelLong(level)}
						<ArrowRight class="size-4" aria-hidden="true" />
					</a>
				</li>
			{/each}
			{#each otherLevels as entry (entry.level.id)}
				<li>
					{#if entry.subject}
						<a href={nodePath([entry.level, entry.subject])} class={linkClass}>
							{plainTitle(entry.subject.title)} per {levelLong(entry.level)}
							<ArrowRight class="size-4" aria-hidden="true" />
						</a>
					{:else}
						<a href={nodePath([entry.level])} class={linkClass}>
							Tutto il materiale per {levelLong(entry.level)}
							<ArrowRight class="size-4" aria-hidden="true" />
						</a>
					{/if}
				</li>
			{/each}
			<li>
				<a href="/pricing" class={linkClass}>
					Piani Premium: esercizi, flashcard e lezioni individuali
					<ArrowRight class="size-4" aria-hidden="true" />
				</a>
			</li>
		</ul>
	</nav>
</section>
