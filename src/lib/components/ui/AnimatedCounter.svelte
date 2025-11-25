<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	interface Props {
		target: number;
		duration?: number;
		easing?: (t: number) => number;
		class?: string;
	}

	let { 
		target, 
		duration = 2000, 
		easing = cubicInOut,
		class: className = '' 
	}: Props = $props();

	const count = tweened(0, {
		duration,
		easing
	});

	$effect(() => {
		count.set(target);
	});
</script>

<span class="tabular-nums {className}">
	{Math.round($count)}
</span>

