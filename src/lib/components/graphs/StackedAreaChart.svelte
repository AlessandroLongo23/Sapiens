<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { formatCurrency } from '$lib/utils/format.svelte.js';
	import { themeStore } from '$lib/components/shared/ui/theme/theme.ts';
	import { designSystem } from '$lib/const/appearance.js';
	
	let { 
		data = [], 
		width = 800, 
		height = 300, 
		tension = 0.4, 
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
		
		d3.select(container).selectAll('*').remove();
		
		
		const containerWidth = container.getBoundingClientRect().width;
		width = containerWidth;
		
		
		svg = d3.select(container)
			.append('svg')
			.attr('width', '100%')  
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMinYMin meet') 
			.style('overflow', 'visible');
			
		const margin = { top: 10, right: 10, bottom: 30, left: 60 }; 
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;
		
		
		const months = [...new Set(data.map(d => d.month))];
		const subjects = [...new Set(data.map(d => d.subject))];
		
		
		const subjectData = {};
		subjects.forEach(subject => {
			subjectData[subject] = [];
		});
		
		
		data.forEach(item => {
			if (subjectData[item.subject]) {
				subjectData[item.subject].push({
					month: item.month,
					earnings: item.earnings
				});
			}
		});
		
		
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
			
			
			subjectData[subject].sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
		});
		
		
		const xScale = d3.scalePoint()
			.domain(months)
			.range([0, chartWidth])
			.padding(0);  
			
		
		const maxEarnings = d3.max(Object.values(subjectData).flat(), d => d.earnings);
		
		const yScale = d3.scaleLinear()
			.domain([0, maxEarnings])
			.nice()
			.range([chartHeight, 0]);
			
		
		const colorScale = d3.scaleOrdinal()
			.domain(subjects)
			.range([
				'#FF6B6B', 
				'#48BFE3', 
				'#06D6A0', 
				'#FFD166', 
				'#9D4EDD', 
				'#FB5607', 
				'#118AB2', 
				'#6A4C93', 
				'#EF476F', 
				'#80ED99', 
				'#F29E4C', 
				'#B298DC'  
			]);
			
		
		const g = svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);
			
		
		
		const line = d3.line()
			.x(d => xScale(d.month)) 
			.y(d => yScale(d.earnings))
			.curve(d3.curveCardinal.tension(tension));
			
		
		const area = d3.area()
			.x(d => xScale(d.month)) 
			.y0(chartHeight)
			.y1(d => yScale(d.earnings))
			.curve(d3.curveCardinal.tension(tension));
			
		
		Object.entries(subjectData).forEach(([subject, values]) => {
			const color = d3.rgb(colorScale(subject));
			
			
			const gradientId = `gradient-${subject.replace(/\s+/g, '-').toLowerCase()}`;
			
			
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
			
			
			g.append('path')
				.datum(values)
				.attr('class', `area-${subject.replace(/\s+/g, '-').toLowerCase()}`)
				.attr('fill', `url(#${gradientId})`)
				.attr('opacity', 0.7)
				.attr('d', area);
			
			
			g.append('path')
				.datum(values)
				.attr('class', `line-${subject.replace(/\s+/g, '-').toLowerCase()}`)
				.attr('fill', 'none')
				.attr('stroke', color.toString())
				.attr('stroke-width', 2)
				.attr('d', line);
			
			
			g.selectAll(`.point-${subject.replace(/\s+/g, '-').toLowerCase()}`)
				.data(values.filter(d => d.earnings > 0)) 
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
					
					d3.select(this)
						.attr('r', 6);
						
					
					const details = subjects.map(subj => {
						const dataPoint = subjectData[subj].find(item => item.month === d.month);
						return {
							subject: subj,
							earnings: dataPoint ? dataPoint.earnings : 0,
							color: colorScale(subj),
							isHighlighted: subj === subject
						};
					}).filter(detail => detail.earnings > 0);
					
					
					const xPos = xScale(d.month);
					mouseLine.attr('d', `M${xPos},${chartHeight} ${xPos},0`)
						.style('opacity', '1');
						
					onHover({
						month: d.month,
						details,
						x: xPos + margin.left,
						y: event.clientY - container.getBoundingClientRect().top  
					});
				})
				.on('mouseout', function(event) {
					d3.select(this)
						.attr('r', 4);
				});
		});
			
		
		g.append('g')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(d3.axisBottom(xScale))
			.selectAll('text')
			.attr('fill', $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.chart.text)
			.attr('font-size', '11px');
			
		
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
			
		
		const mouseG = g.append('g').attr('class', 'mouse-over-effects');
		
		
		const mouseLine = mouseG.append('path')
			.attr('class', 'mouse-line')
			.style('stroke', $themeStore === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)')
			.style('stroke-width', '1px')
			.style('opacity', '0');
			
		
		mouseG.append('rect')
			.attr('width', chartWidth)
			.attr('height', chartHeight)
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.on('mouseout', function(event) {
				
				mouseLine.style('opacity', '0');
				onMouseOut();
			})
			.on('mouseover', function() {
				mouseLine.style('opacity', '1');
			})
			.on('mousemove', function(event) {
				const mouse = d3.pointer(event);
				const xPos = mouse[0];
				
				
				const monthWidth = chartWidth / months.length;
				const monthIndex = Math.min(
					Math.floor(xPos / monthWidth),
					months.length - 1
				);
				
				if (monthIndex >= 0 && monthIndex < months.length) {
					const month = months[monthIndex];
					
					
					const details = subjects.map(subj => {
						const dataPoint = subjectData[subj].find(item => item.month === month);
						return {
							subject: subj,
							earnings: dataPoint ? dataPoint.earnings : 0,
							color: colorScale(subj),
							isHighlighted: false 
						};
					}).filter(detail => detail.earnings > 0);
					
					
					const xPos = xScale(month);
					mouseLine.attr('d', `M${xPos},${chartHeight} ${xPos},0`);
					
					
					onHover({
						month,
						details,
						x: xPos + margin.left,
						y: mouse[1] + margin.top
					});
				}
			});
			
		
	}
</script>

<div class="w-full h-full" style="min-height: 300px;" bind:this={container}></div>
