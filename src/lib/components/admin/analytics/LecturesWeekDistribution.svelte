<script>
	import { lecturesStore } from '$lib/stores/lectures.js';
	import { themeStore } from '$lib/components/shared/ui/theme/theme.js';
	import { designSystem } from '$lib/const/appearance.js';
    import { ceilToMultiple } from '$lib/utils/math.js';
	import { onMount } from 'svelte';
	import { Calendar } from 'lucide-svelte';
	import * as d3 from 'd3';

	import ChartTooltip from '$lib/components/graphs/ChartTooltip.svelte';
	
	let container;
	let svg;
	let width;
	let height = 350; 
	
	let tooltipVisible = $state(false);
	let tooltipData = $state({
		day: '',
		count: 0,
		x: 0,
		y: 0
	});
	
	let weekdayDistribution = $derived.by(() => {
		const daysOfWeek = [
			{ short: 'Mon', full: 'Monday' },
			{ short: 'Tue', full: 'Tuesday' },
			{ short: 'Wed', full: 'Wednesday' },
			{ short: 'Thu', full: 'Thursday' },
			{ short: 'Fri', full: 'Friday' },
			{ short: 'Sat', full: 'Saturday' },
			{ short: 'Sun', full: 'Sunday' }
		];
		
		const days = daysOfWeek.map((day, index) => ({
			day: day.short,
			fullDay: day.full,
			dayIndex: index,
			count: 0
		}));
		
		$lecturesStore.lectures.forEach(lecture => {
			const date = new Date(lecture.date);
			const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
			days[dayIndex].count++;
		});
		
		return days;
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
		
		const margin = { top: 50, right: 50, bottom: 50, left: 50 };
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;
		const radius = Math.min(chartWidth, chartHeight) / 2;
		
		const g = svg.append('g')
			.attr('transform', `translate(${width/2},${height/2})`);
		
		const angleScale = d3.scaleBand()
			.domain(weekdayDistribution.map(d => d.dayIndex))
			.range([Math.PI / 2, 2 * Math.PI + Math.PI / 2])
			.padding(0.2);
			
		const maxValue = d3.max(weekdayDistribution, d => d.count) || 1;
		const radiusScale = d3.scaleLinear()
			.domain([0, maxValue])
			.nice()
			.range([30, radius]);
		
		
		const maxCount = ceilToMultiple(d3.max(weekdayDistribution, d => d.count), 5) || 1;
		const tickCount = 3; 
		const gridCircles = Array.from({ length: tickCount + 1 }, (_, i) => 
			Math.round(i * maxCount / tickCount)
		);
		
		g.selectAll('.grid-circle')
			.data(gridCircles)
			.join('circle')
			.attr('class', 'grid-circle')
			.attr('r', d => radiusScale(d))
			.attr('fill', 'none')
			.attr('stroke', $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light)
			.attr('stroke-dasharray', '10, 10'); 
			
		
		g.append('circle')
			.attr('r', 30)
			.attr('fill', $themeStore === 'dark' ? '#121212' : 'white')
			.attr('stroke', 'none');
			
		
		g.selectAll('.grid-label')
			.data(gridCircles)
			.join('text')
			.attr('class', 'grid-label')
			.attr('y', d => -radiusScale(d) - 7) 
			.attr('x', 0) 
			.attr('dy', '0.35em')
			.attr('text-anchor', 'middle')
			.attr('font-size', '10px')
			.attr('fill', $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.chart.text)
			.text(d => d);
			
		
		g.selectAll('.day-label')
			.data(weekdayDistribution)
			.join('text')
			.attr('class', 'day-label')
			.each(function(d) {
				const angle = angleScale(d.dayIndex) + angleScale.bandwidth() / 2 - Math.PI;
				const labelRadius = radius + 30; 
				const x = labelRadius * Math.cos(angle);
				const y = labelRadius * Math.sin(angle);
				
				let textAnchor;
				if (angle > -Math.PI/4 && angle < Math.PI/4) {
					textAnchor = 'start'; 
				} else if (angle > Math.PI*3/4 || angle < -Math.PI*3/4) {
					textAnchor = 'end'; 
				} else {
					textAnchor = 'middle'; 
				}
				
				d3.select(this)
					.attr('x', x)
					.attr('y', y)
					.attr('text-anchor', textAnchor)
					.attr('dominant-baseline', angle > 0 && angle < Math.PI ? 'hanging' : 'auto');
			})
			.attr('font-size', '11px')
			.attr('fill', $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.chart.text)
			.text(d => d.day);
			
    
	const colorScale = d3.scaleSequential()
		.domain([7, 0]) 
		.interpolator(d3.interpolateRainbow);

	
	const bars = g.selectAll('.radial-bar')
		.data(weekdayDistribution)
		.join('path')
		.attr('class', 'radial-bar')
		.attr('fill', d => {
			const color = d3.rgb(colorScale(d.dayIndex));
			return `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;
		})
		.attr('stroke', d => colorScale(d.dayIndex))
		.attr('stroke-width', 1)
		.attr('d', d => {
			const startAngle = angleScale(d.dayIndex);
			const endAngle = startAngle + angleScale.bandwidth();
			const innerRadius = 30; 
			const outerRadius = radiusScale(d.count);
			
			const arc = d3.arc()
				.innerRadius(innerRadius)
				.outerRadius(outerRadius)
				.startAngle(startAngle - Math.PI / 2)
				.endAngle(endAngle - Math.PI / 2)
				.padAngle(0.03) 
				.padRadius(radius)
				.cornerRadius(4); 
				
			return arc();
		});
			
		
		bars.on('mouseover', function(event, d) {
			const rect = container.getBoundingClientRect();
			const [x, y] = d3.pointer(event, container);
			
			tooltipData = {
				day: d.fullDay, 
				count: d.count,
				x: x,
				y: y
			};
			tooltipVisible = true;
		})
		.on('mousemove', function(event) {
			const [x, y] = d3.pointer(event, container);
			
			tooltipData = {
				...tooltipData,
				x: x + 19,
				y: y - 70
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
		if (!$lecturesStore.loading && weekdayDistribution && container) {
			createChart();
		}
	});
	
	$effect(() => {
		if ($themeStore && container) {
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
			<Calendar class="w-5 h-5 text-[#F5BD0B]" />
		</div>
		<div class="flex-1">
			<h2 class="text-base font-semibold text-[#111827] dark:text-white leading-tight">Weekday Distribution</h2>
			<p class="text-xs sm:text-sm text-[#6B7280] dark:text-[#A0A0A0] mt-0.5">Number of lectures by day of the week</p>
		</div>
	</div>
	
	<div class="p-3 sm:p-5 relative">
		<div class="w-full h-[350px] sm:h-[350px] pl-0" bind:this={container}>
			
		</div>
		
		<ChartTooltip visible={tooltipVisible} x={tooltipData.x} y={tooltipData.y} position="top">
			<div class="p-3">
				<p class="text-sm font-medium text-[#111827] dark:text-white">{tooltipData.day}</p>
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
