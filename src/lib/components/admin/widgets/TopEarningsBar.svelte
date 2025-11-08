<script>
	import { formatCurrency } from '$lib/utils/format.svelte.js';
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { designSystem } from '$lib/const/appearance.js';
	import { themeStore } from '$lib/components/shared/ui/theme/theme.ts';
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';

	import ChartTooltip from '$lib/components/graphs/ChartTooltip.svelte';

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
		if ((statsStore.topEarnings.bySubject?.length || statsStore.topEarnings.byStudent?.length)) {
			renderChart();
		}
		setupCanvasHover();
	});
	
	$effect(() => {
		const bySubject = statsStore.topEarnings.bySubject;
		const byStudent = statsStore.topEarnings.byStudent;
		if ((bySubject?.length || byStudent?.length) && canvas) {
			renderChart();
			setupCanvasHover();
		}
	});
	
	
	let resizeTimeout;
	onMount(() => {
		window.addEventListener('resize', () => {
			
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				if (chart) renderChart();
			}, 250);
		});
		
		return () => {
			window.removeEventListener('resize', () => {});
			clearTimeout(resizeTimeout);
		};
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
					backgroundColor: 'rgba(34, 197, 94, 0.7)',
					borderColor: designSystem.colors.primary.green,
					borderWidth: 1,
					borderRadius: 4
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
						color: $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light,
						drawBorder: false
					},
					ticks: {
						color: designSystem.colors.chart.text,
						callback: function(value) {
							return formatCurrency(value);
						},
						maxRotation: 0,
						autoSkip: true
					}
				},
				y: {
					grid: {
						color: $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light,
						drawBorder: false
					},
					ticks: {
						color: designSystem.colors.chart.text,
						font: {
							size: 11
						},
						callback: function(value, index) {
							const label = this.getLabelForValue(value);
							
							const maxLength = window.innerWidth < 640 ? 12 : 20;
							if (label && label.length > maxLength) {
								return label.substring(0, maxLength) + '...';
							}
							return label;
						}
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

<div class="w-full flex flex-col overflow-hidden bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow">
	<div class="px-5 py-4 sm:p-6 border-b border-[#E5E7EB] dark:border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center gap-4">
		<div class="flex sm:flex-1 items-center">
			<div class="p-2.5 mr-4 rounded-md bg-[#F0FDF4] dark:bg-[#1E1E1E]">
				<ls.BarChart3 class="w-5 h-5 text-[#22C55E]" />
			</div>
			<div>
				<h2 class="text-base font-semibold text-[#111827] dark:text-white leading-tight">
					Top Earnings by {viewMode === 'subject' ? 'Subject' : 'Student'}
				</h2>
				<p class="text-xs sm:text-sm text-[#6B7280] dark:text-[#A0A0A0] mt-0.5">Showing top performers</p>
			</div>
		</div>
		
		<button 
			class="w-full sm:w-auto px-3 py-1.5 text-xs font-medium border border-[#E5E7EB] dark:border-[#333333] bg-white hover:bg-[#F9FAFB] dark:bg-[#1E1E1E] dark:hover:bg-[#2B2B2B] text-[#4B5563] dark:text-[#A0A0A0] rounded-md transition-colors"
			onclick={toggleViewMode}
		>
			<div class="flex items-center justify-center sm:justify-start gap-2">
				<ls.Repeat class="w-3.5 h-3.5" />
				<span>View by {viewMode === 'subject' ? 'Student' : 'Subject'}</span>
			</div>
		</button>
	</div>
	
	<div class="p-4 sm:p-6 relative">
		<div class="w-full h-72 pl-0 sm:pl-0" bind:this={canvasContainer}>
			<canvas bind:this={canvas}></canvas>
		</div>
		
		<ChartTooltip visible={tooltipVisible} x={tooltipData.x} y={tooltipData.y} position="left">
			<div class="p-3">
				<p class="text-sm font-medium text-[#111827] dark:text-white">{tooltipData.title}</p>
			</div>
			
			<hr class="w-full border-[#E5E7EB] dark:border-[#2A2A2A]"/>
			
			<div class="flex flex-col gap-2 p-3">
				<div class="flex items-center justify-between gap-4">
					<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">Earnings</span>
					<span class="text-sm font-medium text-[#111827] dark:text-white">
						{formatCurrency(tooltipData.earnings)}
					</span>
				</div>
				
				<div class="flex items-center justify-between gap-4">
					<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">Hours</span>
					<span class="text-sm font-medium text-[#111827] dark:text-white">
						{tooltipData.hours.toFixed(1)}h
					</span>
				</div>
			</div>
		</ChartTooltip>
	</div>
</div> 