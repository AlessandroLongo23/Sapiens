<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { browser } from '$app/environment';

	interface LevelData {
		name: string;
		total: number;
		ready: number;
	}

	interface Props {
		data: LevelData[];
		width?: number;
		height?: number;
	}

	let { data, width = 260, height = 160 }: Props = $props();

	let chartRef = $state<HTMLDivElement>();
	let isDark = $state(false);

	onMount(() => {
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

		const margin = { top: 16, right: 16, bottom: 32, left: 16 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		d3.select(chartRef).selectAll('*').remove();

		const svg = d3.select(chartRef)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const x = d3.scaleBand()
			.domain(data.map(d => d.name))
			.range([0, innerWidth])
			.padding(0.35);

		const y = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.total) || 10])
			.range([innerHeight, 0]);

		const bgColor = isDark ? '#27272a' : '#e4e4e7';
		const fgColor = '#ec4899'; // Rose-500
		const textColor = isDark ? '#a1a1aa' : '#71717a';

		// Background bars (total)
		svg.selectAll('.bar-bg')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar-bg')
			.attr('x', d => x(d.name) || 0)
			.attr('width', x.bandwidth())
			.attr('y', innerHeight)
			.attr('height', 0)
			.attr('rx', 6)
			.attr('fill', bgColor)
			.transition()
			.duration(600)
			.attr('y', d => y(d.total))
			.attr('height', d => innerHeight - y(d.total));

		// Foreground bars (ready)
		svg.selectAll('.bar-fg')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar-fg')
			.attr('x', d => x(d.name) || 0)
			.attr('width', x.bandwidth())
			.attr('y', innerHeight)
			.attr('height', 0)
			.attr('rx', 6)
			.attr('fill', fgColor)
			.transition()
			.delay(300)
			.duration(600)
			.attr('y', d => y(d.ready))
			.attr('height', d => innerHeight - y(d.ready));

		// Value labels on bars
		svg.selectAll('.bar-label')
			.data(data)
			.enter()
			.append('text')
			.attr('class', 'bar-label')
			.attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
			.attr('y', d => y(d.total) - 6)
			.attr('text-anchor', 'middle')
			.attr('fill', textColor)
			.style('font-size', '10px')
			.style('font-weight', '600')
			.text(d => d.total);

		// X axis labels
		svg.append('g')
			.attr('transform', `translate(0, ${innerHeight + 10})`)
			.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
			.attr('text-anchor', 'middle')
			.attr('fill', textColor)
			.style('font-size', '11px')
			.style('font-weight', '500')
			.text(d => d.name);
	}
</script>

<div bind:this={chartRef} class="flex items-center justify-center"></div>

