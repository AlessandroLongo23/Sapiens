<script>
	import { formatCurrency } from '$lib/utils/format.svelte.js';
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { widgetStyle } from '$lib/stores/appearance.js';
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';

	import ChartTooltip from '$lib/components/ChartTooltip.svelte';

	let canvas;
	let chart;
	let canvasContainer;
	let viewMode = $state('subject'); // 'subject' or 'student'
	let tooltipVisible = $state(false);
	let tooltipData = $state({
		title: '',
		earnings: 0,
		hours: 0,
		x: 0,
		y: 0
	});
	
	onMount(() => {
		renderChart();
		setupCanvasHover();
	});
	
	$effect(() => {
		if (statsStore.topEarnings && canvas) {
			renderChart();
			setupCanvasHover();
		}
	});
	
	function setupCanvasHover() {
		if (!canvasContainer) return;
		
		canvasContainer.onmousemove = (e) => {
			if (!chart) return;
			
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			
			const points = chart.getElementsAtEventForMode(
				{ x, y },
				'nearest',
				{ intersect: false },
				false
			);
			
			if (points.length) {
				const dataIndex = points[0].index;
				updateTooltipData(dataIndex, x, y);
				tooltipVisible = true;
			} else {
				tooltipVisible = false;
			}
		};
		
		canvasContainer.onmouseleave = () => {
			tooltipVisible = false;
		};
	}
	
	function updateTooltipData(dataIndex, x, y) {
		const data = viewMode === 'subject' 
			? statsStore.topEarnings.bySubject 
			: statsStore.topEarnings.byStudent;
		
		const sortedData = [...data].sort((a, b) => b.totalEarnings - a.totalEarnings);
		
		const earnings = sortedData[dataIndex].totalEarnings;
		const hours = sortedData[dataIndex].hours;
		const name = sortedData[dataIndex].name;
		
		tooltipData = {
			title: name,
			earnings: earnings,
			hours: hours,
			x: x,
			y: y
		};
	}
	
	function renderChart() {
		if (chart) {
			chart.destroy();
		}
		
		const ctx = canvas.getContext('2d');
		
		const data = viewMode === 'subject' 
			? statsStore.topEarnings.bySubject 
			: statsStore.topEarnings.byStudent;
		
		const sortedData = [...data].sort((a, b) => b.totalEarnings - a.totalEarnings);
		
		const chartData = {
			labels: sortedData.map(item => item.name),
			datasets: [
				{
					label: 'Earnings',
					data: sortedData.map(item => item.totalEarnings),
					backgroundColor: 'rgba(59, 130, 246, 0.7)',
					borderColor: 'rgba(59, 130, 246, 1)',
					borderWidth: 1,
				}
			]
		};
		
		const options = {
			indexAxis: 'y',
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				mode: 'nearest',
				intersect: false,
				axis: 'y'
			},
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					enabled: false
				}
			},
			scales: {
				x: {
					beginAtZero: true,
					grid: {
						color: '#71717a20',
						drawBorder: false
					},
					ticks: {
						color: '#71717a',
						callback: function(value) {
							return formatCurrency(value);
						}
					}
				},
				y: {
					grid: {
						color: '#71717a20'
					},
					ticks: {
						color: '#71717a'
					}
				}
			}
		};
		
		chart = new Chart(ctx, {
			type: 'bar',
			data: chartData,
			options: options
		});
	}
	
	function toggleViewMode() {
		viewMode = viewMode === 'subject' ? 'student' : 'subject';
		renderChart();
	}
</script>

<div class="w-full flex flex-col overflow-hidden {widgetStyle}">
	<div class="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
		<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
			Top Earnings by {viewMode === 'subject' ? 'Subject' : 'Student'}
		</h2>
		
		<button 
			class="px-3 py-1 text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded transition"
			onclick={toggleViewMode}
		>
			View by {viewMode === 'subject' ? 'Student' : 'Subject'}
		</button>
	</div>
	
	<div class="p-4 relative">
		<div class="w-full h-64" bind:this={canvasContainer}>
			<canvas bind:this={canvas}></canvas>
		</div>
		
		<ChartTooltip visible={tooltipVisible} x={tooltipData.x} y={tooltipData.y} position="left">
			<div class="p-3">
				<p class="text-sm font-medium text-foreground">{tooltipData.title}</p>
			</div>
			
			<hr class="w-full border-border"/>
			
			<div class="flex flex-col gap-2 p-3">
				<div class="flex items-center justify-between gap-4">
					<span class="text-xs text-muted-foreground">Earnings</span>
					<span class="text-sm font-medium text-foreground">
						{formatCurrency(tooltipData.earnings)}
					</span>
				</div>
				
				<div class="flex items-center justify-between gap-4">
					<span class="text-xs text-muted-foreground">Hours</span>
					<span class="text-sm font-medium text-foreground">
						{tooltipData.hours.toFixed(1)}h
					</span>
				</div>
			</div>
		</ChartTooltip>
	</div>
</div> 