<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { browser } from '$app/environment';

	interface DataPoint {
		label: string;
		value: number;
		color: string;
	}

	interface Props {
		data: DataPoint[];
		centerValue?: number | string;
		centerLabel?: string;
		size?: number;
	}

	let { data, centerValue, centerLabel, size = 180 }: Props = $props();

	let chartRef = $state<HTMLDivElement>();
	let isDark = $state(false);

	onMount(() => {
		// Check for dark mode
		if (browser) {
			isDark = document.documentElement.classList.contains('dark');
			const observer = new MutationObserver(() => {
				isDark = document.documentElement.classList.contains('dark');
				createChart();
			});
			observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		}
		createChart();
	});

	$effect(() => {
		if (data && chartRef) {
			createChart();
		}
	});

	function createChart() {
		if (!chartRef || !data.length) return;

		const width = size;
		const height = size;
		const radius = Math.min(width, height) / 2;

		d3.select(chartRef).selectAll('*').remove();

		const svg = d3.select(chartRef)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`);

		const pie = d3.pie<DataPoint>()
			.value(d => d.value)
			.sort(null)
			.padAngle(0.02);

		const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
			.innerRadius(radius * 0.6)
			.outerRadius(radius * 0.95)
			.cornerRadius(4);

		const arcs = svg.selectAll('arc')
			.data(pie(data))
			.enter()
			.append('g');

		arcs.append('path')
			.attr('d', arc)
			.attr('fill', d => d.data.color)
			.style('opacity', 0.9)
			.attr('stroke', isDark ? '#18181b' : '#ffffff')
			.style('stroke-width', '2px')
			.transition()
			.duration(800)
			.attrTween('d', function(d) {
				const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return function(t) {
					return arc(interpolate(t)) || '';
				};
			});

		// Center text
		if (centerValue !== undefined) {
			svg.append('text')
				.attr('text-anchor', 'middle')
				.attr('dy', centerLabel ? '-0.1em' : '0.35em')
				.attr('fill', isDark ? '#fafafa' : '#18181b')
				.style('font-size', '28px')
				.style('font-weight', '700')
				.text(String(centerValue));
		}

		if (centerLabel) {
			svg.append('text')
				.attr('text-anchor', 'middle')
				.attr('dy', '1.4em')
				.attr('fill', isDark ? '#a1a1aa' : '#71717a')
				.style('font-size', '11px')
				.style('font-weight', '500')
				.text(centerLabel);
		}
	}
</script>

<div bind:this={chartRef} class="flex items-center justify-center"></div>

