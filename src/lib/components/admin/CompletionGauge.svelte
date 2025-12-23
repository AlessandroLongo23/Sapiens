<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { browser } from '$app/environment';

	interface Props {
		percent: number;
		label?: string;
		size?: number;
	}

	let { percent, label, size = 140 }: Props = $props();

	let chartRef = $state<HTMLDivElement>();
	let isDark = $state(false);

	onMount(() => {
		if (browser) {
			isDark = document.documentElement.classList.contains('dark');
			const observer = new MutationObserver(() => {
				isDark = document.documentElement.classList.contains('dark');
				createGauge();
			});
			observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		}
		createGauge();
	});

	$effect(() => {
		if (chartRef) {
			createGauge();
		}
	});

	function createGauge() {
		if (!chartRef) return;

		const width = size;
		const height = size * 0.6;
		const radius = size / 2 - 10;

		d3.select(chartRef).selectAll('*').remove();

		const svg = d3.select(chartRef)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height - 5})`);

		const bgColor = isDark ? '#27272a' : '#e4e4e7';
		const fgColor = percent >= 75 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#ec4899';
		const textColor = isDark ? '#fafafa' : '#18181b';
		const labelColor = isDark ? '#a1a1aa' : '#71717a';

		const arcGenerator = d3.arc<{ startAngle: number; endAngle: number }>()
			.innerRadius(radius * 0.7)
			.outerRadius(radius)
			.cornerRadius(4);

		// Background arc
		svg.append('path')
			.datum({ startAngle: -Math.PI / 2, endAngle: Math.PI / 2 })
			.attr('d', arcGenerator)
			.attr('fill', bgColor);

		// Foreground arc
		const endAngle = -Math.PI / 2 + (Math.PI * percent / 100);
		
		svg.append('path')
			.datum({ startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 })
			.attr('fill', fgColor)
			.transition()
			.duration(1000)
			.attrTween('d', function() {
				const interpolate = d3.interpolate(-Math.PI / 2, endAngle);
				return function(t) {
					return arcGenerator({ startAngle: -Math.PI / 2, endAngle: interpolate(t) }) || '';
				};
			});

		// Percentage text
		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '-0.6em')
			.attr('fill', textColor)
			.style('font-size', '22px')
			.style('font-weight', '700')
			.text(`${percent}%`);

		// Label
		if (label) {
			svg.append('text')
				.attr('text-anchor', 'middle')
				.attr('dy', '0.8em')
				.attr('fill', labelColor)
				.style('font-size', '10px')
				.style('font-weight', '500')
				.text(label);
		}
	}
</script>

<div bind:this={chartRef} class="flex items-center justify-center"></div>

