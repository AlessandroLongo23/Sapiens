<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { formatCurrency } from '$lib/utils/format.svelte.js';
	import { themeStore } from '$lib/components/theme/theme.js';
	import { designSystem } from '$lib/stores/appearance.js';
	
	let { 
		data = [], 
		width = 800, 
		height = 400,
		onHover = () => {},
		onMouseOut = () => {}
	} = $props();
	
	let container;
	let svg;
	
	onMount(() => {
		if (container && data.length > 0) {
			renderChart();
		}
	});
	
	$effect(() => {
		if (container && data.length > 0) {
			renderChart();
		}
	});
	
	function renderChart() {
		// Clear previous chart
		d3.select(container).selectAll('*').remove();
		
		// Get container dimensions
		const containerWidth = container.getBoundingClientRect().width;
		width = containerWidth;
		
		// Create SVG
		svg = d3.select(container)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.style('overflow', 'visible');
			
		const margin = { top: 20, right: 20, bottom: 40, left: 60 };
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;
		
		// Extract months and subject names
		const months = [...new Set(data.map(d => d.month))];
		const subjects = [...new Set(data.map(d => d.subject))];
		
		// Create a nested data structure for the stacked area chart
		const stackedData = [];
		months.forEach(month => {
			const monthData = { month };
			subjects.forEach(subject => {
				const entry = data.find(d => d.month === month && d.subject === subject);
				monthData[subject] = entry ? entry.earnings : 0;
			});
			stackedData.push(monthData);
		});
		
		// Create the stack generator
		const stack = d3.stack()
			.keys(subjects)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);
			
		const series = stack(stackedData);
		
		// Create scales
		const xScale = d3.scaleBand()
			.domain(months)
			.range([0, chartWidth])
			.padding(0.1);
			
		const yScale = d3.scaleLinear()
			.domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
			.nice()
			.range([chartHeight, 0]);
			
		// Create color scale with varied colors
		const colorScale = d3.scaleOrdinal()
			.domain(subjects)
			.range([
				'#FF6B6B', // Red
				'#48BFE3', // Blue
				'#06D6A0', // Green
				'#FFD166', // Yellow
				'#9D4EDD', // Purple
				'#FB5607', // Orange
				'#118AB2', // Teal
				'#6A4C93', // Violet
				'#EF476F', // Pink
				'#80ED99', // Mint
				'#F29E4C', // Amber
				'#B298DC'  // Lavender
			]);
			
		// Create the chart group
		const g = svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);
			
		// Create the area generator
		const area = d3.area()
			.x((d, i) => xScale(stackedData[i].month) + xScale.bandwidth() / 2)
			.y0(d => yScale(d[0]))
			.y1(d => yScale(d[1]))
			.curve(d3.curveCardinal);
			
		// Create the stacked areas
		g.selectAll('.area')
			.data(series)
			.enter()
			.append('path')
			.attr('class', 'area')
			.attr('fill', (d, i) => {
				const color = d3.rgb(colorScale(d.key));
				return `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;
			})
			.attr('d', area)
			.attr('stroke', (d, i) => colorScale(d.key))
			.attr('stroke-width', 1.5)
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round');
			
		// Create x-axis
		g.append('g')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(d3.axisBottom(xScale)
				.tickValues(months.filter((_, i) => i % Math.ceil(months.length / 6) === 0))
			)
			.selectAll('text')
			.attr('fill', $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.chart.text)
			.attr('font-size', '11px');
			
		// Create y-axis
		g.append('g')
			.call(d3.axisLeft(yScale)
				.ticks(5)
				.tickFormat(d => formatCurrency(d))
				.tickSize(-chartWidth)
			)
			.selectAll('line')
			.attr('stroke', $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light)
			.attr('stroke-opacity', 0.5);
			
		g.selectAll('.domain')
			.attr('stroke', $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light);
			
		g.selectAll('text')
			.attr('fill', $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.chart.text)
			.attr('font-size', '11px');
			
		// Add invisible overlay for mouse events
		const mouseG = g.append('g').attr('class', 'mouse-over-effects');
		
		// Add vertical line
		const mouseLine = mouseG.append('path')
			.attr('class', 'mouse-line')
			.style('stroke', $themeStore === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)')
			.style('stroke-width', '1px')
			.style('opacity', '0');
			
		// Add overlay rectangle
		mouseG.append('rect')
			.attr('width', chartWidth)
			.attr('height', chartHeight)
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.on('mouseout', function() {
				mouseLine.style('opacity', '0');
				onMouseOut();
			})
			.on('mouseover', function() {
				mouseLine.style('opacity', '1');
			})
			.on('mousemove', function(event) {
				const mouse = d3.pointer(event);
				const xPos = mouse[0];
				
				// Find closest month
				const monthWidth = chartWidth / months.length;
				const monthIndex = Math.min(
					Math.floor(xPos / monthWidth),
					months.length - 1
				);
				
				if (monthIndex >= 0 && monthIndex < months.length) {
					const month = months[monthIndex];
					const monthData = stackedData[monthIndex];
					
					// Extract subject data for this month
					const details = subjects.map(subject => ({
						subject,
						earnings: monthData[subject] || 0,
						color: colorScale(subject)
					})).filter(d => d.earnings > 0);
					
					// Get mouse position
					mouseLine.attr('d', `M${xPos},${chartHeight} ${xPos},0`);
					
					// Calculate tooltip position
					onHover({
						month,
						details,
						x: xPos + margin.left,
						y: mouse[1] + margin.top
					});
				}
			});
			
		// Legend removed as requested
	}
</script>

<div class="w-full h-full" bind:this={container}></div>
