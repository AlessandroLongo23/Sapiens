<script lang="ts">
	import type { ContentNode } from '$lib/utils/tree';

	import LevelCard from './LevelCard.svelte';
	import SubjectCard from './SubjectCard.svelte';
	import ChapterCard from './ChapterCard.svelte';
	import TopicCard from './TopicCard.svelte';

	let { node, href } = $props<{ node: ContentNode; href: string }>();
</script>

{#if node.type == 'level'}
	<LevelCard level={node} {href} />
{:else if node.type == 'subject'}
	<SubjectCard subject={node} {href} />
{:else if node.type == 'chapter'}
	<ChapterCard chapter={node} {href} />
{:else if node.type == 'topic'}
	<TopicCard topic={node} {href} />
{/if}
