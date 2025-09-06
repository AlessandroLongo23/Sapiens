<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { formatCurrency } from '$lib/utils/format.svelte.js';
	import { themeStore } from '$lib/components/theme/theme.js';
	import { designSystem } from '$lib/stores/appearance.js';
	
	let { 
		data = [], 
		width = 800, 
		height = 300, // Match EarningsGraph default height of 300px
		tension = 0.4, // Default tension similar to EarningsGraph
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
			.attr('width', '100%')  // Use percentage for responsive sizing
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMinYMin meet') // Better handling of aspect ratio
			.style('overflow', 'visible');
			
		const margin = { top: 10, right: 10, bottom: 30, left: 60 }; // Adjusted margins to match EarningsGraph
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;
		
		// Extract months and subject names
		const months = [...new Set(data.map(d => d.month))];
		const subjects = [...new Set(data.map(d => d.subject))];
		
		// Organize data by subject
		const subjectData = {};
		subjects.forEach(subject => {
			subjectData[subject] = [];
		});
		
		// Create a data structure for line charts
		data.forEach(item => {
			if (subjectData[item.subject]) {
				subjectData[item.subject].push({
					month: item.month,
					earnings: item.earnings
				});
			}
		});
		
		// Ensure each subject has entries for all months (with 0 earnings if needed)
		subjects.forEach(subject => {
			const existingMonths = subjectData[subject].map(d => d.month);
			
			months.forEach(month => {
				if (!existingMonths.includes(month)) {
					subjectData[subject].push({
						month,
						earnings: 0
					});
				}
			});
			
			// Sort by month to ensure line continuity
			subjectData[subject].sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
		});
		
		// Create scales - using scalePoint instead of scaleBand for better edge-to-edge display
		const xScale = d3.scalePoint()
			.domain(months)
			.range([0, chartWidth])
			.padding(0);  // No padding to use the entire width
			
		// Find the maximum earnings value across all subjects
		const maxEarnings = d3.max(Object.values(subjectData).flat(), d => d.earnings);
		
		const yScale = d3.scaleLinear()
			.domain([0, maxEarnings])
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
			
		// Create line and area generators
		// Create the line generator with tension parameter (similar to Chart.js)
		const line = d3.line()
			.x(d => xScale(d.month)) // scalePoint already positions at correct x
			.y(d => yScale(d.earnings))
			.curve(d3.curveCardinal.tension(tension));
			
		// Create the area generator with matching tension parameter
		const area = d3.area()
			.x(d => xScale(d.month)) // scalePoint already positions at correct x
			.y0(chartHeight)
			.y1(d => yScale(d.earnings))
			.curve(d3.curveCardinal.tension(tension));
			
		// Create lines for each subject
		Object.entries(subjectData).forEach(([subject, values]) => {
			const color = d3.rgb(colorScale(subject));
			
			// Create unique gradient ID for this subject
			const gradientId = `gradient-${subject.replace(/\s+/g, '-').toLowerCase()}`;
			
			// Create linear gradient
			const gradient = svg.append('defs')
				.append('linearGradient')
				.attr('id', gradientId)
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '0%')
				.attr('y2', '100%');
				
			gradient.append('stop')
				.attr('offset', '0%')
				.attr('stop-color', color.toString())
				.attr('stop-opacity', 0.15);
				
			gradient.append('stop')
				.attr('offset', '100%')
				.attr('stop-color', color.toString())
				.attr('stop-opacity', 0);
			
			// Create area path with gradient fill
			g.append('path')
				.datum(values)
				.attr('class', `area-${subject.replace(/\s+/g, '-').toLowerCase()}`)
				.attr('fill', `url(#${gradientId})`)
				.attr('opacity', 0.7)
				.attr('d', area);
			
			// Create line path on top of area
			g.append('path')
				.datum(values)
				.attr('class', `line-${subject.replace(/\s+/g, '-').toLowerCase()}`)
				.attr('fill', 'none')
				.attr('stroke', color.toString())
				.attr('stroke-width', 2)
				.attr('d', line);
			
			// Add data points
			g.selectAll(`.point-${subject.replace(/\s+/g, '-').toLowerCase()}`)
				.data(values.filter(d => d.earnings > 0)) // Only show points for non-zero values
				.enter()
				.append('circle')
				.attr('class', `point-${subject.replace(/\s+/g, '-').toLowerCase()}`)
				.attr('cx', d => xScale(d.month))
				.attr('cy', d => yScale(d.earnings))
				.attr('r', 4)
				.attr('fill', color.toString())
				.attr('stroke', '#FFFFFF')
				.attr('stroke-width', 1.5)
				.attr('cursor', 'pointer')
				.on('mouseover', function(event, d) {
					// Enlarge the point
					d3.select(this)
						.attr('r', 6);
						
					// Prepare details for tooltip
					const details = subjects.map(subj => {
						const dataPoint = subjectData[subj].find(item => item.month === d.month);
						return {
							subject: subj,
							earnings: dataPoint ? dataPoint.earnings : 0,
							color: colorScale(subj),
							isHighlighted: subj === subject
						};
					}).filter(detail => detail.earnings > 0);
					
					// Show the vertical line
					const xPos = xScale(d.month);
					mouseLine.attr('d', `M${xPos},${chartHeight} ${xPos},0`)
						.style('opacity', '1');
						
					onHover({
						month: d.month,
						details,
						x: xPos + margin.left,
						y: event.clientY - container.getBoundingClientRect().top  // Position tooltip above cursor
					});
				})
				.on('mouseout', function(event) {
					d3.select(this)
						.attr('r', 4);
				});
		});
			
		// Create x-axis - all labels shown
		g.append('g')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(d3.axisBottom(xScale))
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
			
		// Add overlay rectangle for mouse events
		mouseG.append('rect')
			.attr('width', chartWidth)
			.attr('height', chartHeight)
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.on('mouseout', function(event) {
				// Hide tooltip when mouse leaves the chart area
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
					
					// Extract subject data for this month
					const details = subjects.map(subj => {
						const dataPoint = subjectData[subj].find(item => item.month === month);
						return {
							subject: subj,
							earnings: dataPoint ? dataPoint.earnings : 0,
							color: colorScale(subj),
							isHighlighted: false // No subject highlighted when hovering the general area
						};
					}).filter(detail => detail.earnings > 0);
					
					// Get mouse position
					const xPos = xScale(month);
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

<div class="w-full h-full" style="min-height: 300px;" bind:this={container}></div>
