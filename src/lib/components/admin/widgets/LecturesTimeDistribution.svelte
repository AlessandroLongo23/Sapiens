<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	import { themeStore } from '$lib/components/shared/ui/theme/theme.js';
	import { designSystem } from '$lib/stores/appearance.js';
	import ChartTooltip from '$lib/components/graphs/ChartTooltip.svelte';
	import * as ls from 'lucide-svelte';

	let container;
	let svg;
	let width;
	let height = 300; 

	let tooltipVisible = $state(false);
	let tooltipData = $state({
		hour: '',
		count: 0,
		x: 0,
		y: 0
	});

	
	let hourlyDistribution = $derived.by(() => {
		
		const startHour = 6; 
		const endHour = 22;  
		const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => ({
			hour: i + startHour,
			count: 0,
			label: `${i + startHour}:00`
		}));

		
		$lecturesStore.lectures.forEach(lecture => {
			const lectureHour = parseInt(lecture.start_time.split(':')[0]);
			if (lectureHour >= startHour && lectureHour <= endHour) {
				hours[lectureHour - startHour].count++;
			}
		});

		return hours;
	});

	
	function createChart() {
		if (!container) return;
		
		
		d3.select(container).selectAll('svg').remove();
		
		
		const containerWidth = container.getBoundingClientRect().width;
		width = containerWidth;
		
		
		svg = d3.select(container)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.style('overflow', 'visible');
		
		
		const margin = { top: 30, right: 25, bottom: 50, left: 45 };
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;
		
		
		const x = d3.scaleBand()
			.domain(hourlyDistribution.map(d => d.hour))
			.range([0, chartWidth])
			.padding(0.2);
		
		const y = d3.scaleLinear()
			.domain([0, d3.max(hourlyDistribution, d => d.count) || 1])
			.nice()
			.range([chartHeight, 0]);
		
		
		const g = svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);
		
		
		g.append('g')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(d3.axisBottom(x)
				.tickFormat(d => {
					
					const isMobile = window.innerWidth < 640;
					return d % (isMobile ? 4 : 2) === 0 ? `${d}:00` : '';
				}))
			.selectAll('text')
			.attr('fill', $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.chart.text)
			.attr('font-size', window.innerWidth < 640 ? '10px' : '11px')
			.attr('transform', 'rotate(-35)')
			.attr('text-anchor', 'end')
			.attr('dx', '-0.8em')
			.attr('dy', '0.15em');

		
		g.append('g')
			.call(d3.axisLeft(y).ticks(window.innerWidth < 640 ? 4 : 5).tickSize(-chartWidth))
			.selectAll('line')
			.attr('stroke', $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light)
			.attr('stroke-opacity', 0.5);
			
		g.selectAll('.domain')
			.attr('stroke', $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light);
			
		g.selectAll('text')
			.attr('fill', $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.chart.text)
			.attr('font-size', '11px');
		
		
		const bars = g.selectAll('.bar')
			.data(hourlyDistribution)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', d => x(d.hour))
			.attr('y', d => y(d.count))
			.attr('width', x.bandwidth())
			.attr('height', d => chartHeight - y(d.count))
			.attr('fill', 'rgba(245, 158, 11, 0.7)')
			.attr('stroke', '#F59E0B')
			.attr('stroke-width', 1)
			.attr('rx', 2);
			
		
		bars.on('mouseover', function(event, d) {
			const rect = container.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			
			tooltipData = {
				hour: d.label,
				count: d.count,
				x: mouseX,
				y: mouseY
			};
			tooltipVisible = true;
		})
		.on('mousemove', function(event) {
			const rect = container.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			const isMobile = window.innerWidth < 640;
			
			tooltipData = {
				...tooltipData,
				x: mouseX + (isMobile ? 15 : 19),
				y: mouseY - (isMobile ? 60 : 70)
			};
		})
		.on('mouseout', function() {
			tooltipVisible = false;
		});
	}
	
	onMount(() => {
		if (!$lecturesStore.loading && container) {
			createChart();
		}
	});
	
	$effect(() => {
		if (!$lecturesStore.loading && hourlyDistribution && container) {
			createChart();
		}
	});
	
	let resizeTimeout;
	onMount(() => {
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				createChart();
			}, 250);
		});
		
		return () => {
			window.removeEventListener('resize', () => {});
			clearTimeout(resizeTimeout);
		};
	});
</script>

<div class="w-full flex flex-col overflow-hidden bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow">
	<div class="px-5 py-4 sm:p-6 border-b border-[#E5E7EB] dark:border-[#2A2A2A] flex items-center">
		<div class="p-2.5 mr-4 rounded-md bg-[#FEF3C7] dark:bg-[#1E1E1E]">
			<ls.Clock class="w-5 h-5 text-[#F59E0B]" />
		</div>
		<div class="flex-1">
			<h2 class="text-base font-semibold text-[#111827] dark:text-white leading-tight">Lecture Time Distribution</h2>
			<p class="text-xs sm:text-sm text-[#6B7280] dark:text-[#A0A0A0] mt-0.5">When your lectures occur (6 AM - 10 PM)</p>
		</div>
	</div>
	
	<div class="p-3 sm:p-5 relative">
		<div class="w-full h-[350px] sm:h-[300px] pl-0" bind:this={container}>
			
		</div>
		
		<ChartTooltip visible={tooltipVisible} x={tooltipData.x} y={tooltipData.y} position="top">
			<div class="p-3">
				<p class="text-sm font-medium text-[#111827] dark:text-white">{tooltipData.hour}</p>
			</div>
			
			<hr class="w-full border-[#E5E7EB] dark:border-[#2A2A2A]"/>
			
			<div class="flex flex-col gap-2 p-3">
				<div class="flex items-center justify-between gap-4">
					<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">Lectures</span>
					<span class="text-sm font-medium text-[#111827] dark:text-white">
						{tooltipData.count}
					</span>
				</div>
			</div>
		</ChartTooltip>
	</div>
</div>
