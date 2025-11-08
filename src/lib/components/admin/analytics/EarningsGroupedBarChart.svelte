<script lang="ts">
	import { formatCurrency } from '$lib/utils/format.svelte';
	import { lecturesStore } from '$lib/stores/lectures.js';
	import { themeStore } from '$lib/components/shared/ui/theme/theme.js';
	import { designSystem } from '$lib/const/appearance.js';
	import { parseISO } from 'date-fns';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { ChartColumn } from 'lucide-svelte';
	import type { Lecture } from '$lib/models/Lecture.svelte';

	import ChartTooltip from '$lib/components/graphs/ChartTooltip.svelte';

	type ViewMode = 'monthly' | 'quarterly';

	interface EarningsData {
		year: number;
		month: number;
		quarter: number;
		earnings: number;
	}

	interface TooltipItem {
		year: number;
		earnings: number;
		change: number | null;
		percentage: number | null;
		color: string;
	}

	interface TooltipData {
		title: string;
		items: TooltipItem[];
		x: number;
		y: number;
	}

	interface GroupedDataResult {
		labels: string[];
		datasets: any[];
		years: number[];
	}

	interface YearData {
		year: number;
		earnings: number;
		datasetIndex: number;
	}

	let canvas: HTMLCanvasElement | undefined;
	let chart: Chart | undefined;
	let viewMode: ViewMode = $state('monthly');
	let tooltipVisible = $state(false);
	let tooltipData: TooltipData = $state({
		title: '',
		items: [],
		x: 0,
		y: 0
	});

	// Get all earnings data (not filtered by timeRange)
	function getAllEarningsData(): EarningsData[] {
		const lectures = $lecturesStore.lectures;
		
		if (!lectures?.length) return [];
		
		const earningsByDate: Record<string, EarningsData> = {};
		
		lectures.forEach((lecture: Lecture) => {
			const lectureDate = parseISO(lecture.date);
			const year = lectureDate.getFullYear();
			const month = lectureDate.getMonth();
			const quarter = Math.floor(month / 3);
			
			const key = viewMode === 'monthly' 
				? `${month}-${year}` 
				: `${quarter}-${year}`;
			
			if (!earningsByDate[key]) {
				earningsByDate[key] = {
					year,
					month,
					quarter,
					earnings: 0
				};
			}
			
			earningsByDate[key].earnings += lecture.getEarning();
		});
		
		return Object.values(earningsByDate);
	}

	function prepareGroupedData(): GroupedDataResult {
		const allData = getAllEarningsData();
		
		if (!allData.length) return { labels: [], datasets: [], years: [] };
		
		// Get unique years
		const years = [...new Set(allData.map(d => d.year))].sort((a, b) => a - b);
		
		// Group by month or quarter
		const groupedData: Record<number, Record<number, number>> = {};

		const off = 4
		const step = 222;
		const lightness = 0.7
		const chroma = 0.15
		
		if (viewMode === 'monthly') {
			// 12 months: 0-11
			for (let month = 0; month < 12; month++) {
				groupedData[month] = {};
				years.forEach(year => {
					groupedData[month][year] = 0;
				});
			}
			
			allData.forEach(item => {
				if (groupedData[item.month] && groupedData[item.month][item.year] !== undefined) {
					groupedData[item.month][item.year] = item.earnings;
				}
			});
			
			const labels = [
				'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
				'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
			];
			
			const datasets = years.map((year, yearIndex) => {
				const hue = ((yearIndex + off) * step) % 360;
				const color = `oklch(${lightness} ${chroma} ${hue})`;
				
				return {
					label: year.toString(),
					data: labels.map((_, monthIndex) => groupedData[monthIndex][year] || 0),
					backgroundColor: color,
					borderColor: color,
					borderWidth: 0,
					borderRadius: 8
				};
			});
			
			return { labels, datasets, years };
		} else {
			// 4 quarters: 0-3
			for (let quarter = 0; quarter < 4; quarter++) {
				groupedData[quarter] = {};
				years.forEach(year => {
					groupedData[quarter][year] = 0;
				});
			}
			
			allData.forEach(item => {
				if (groupedData[item.quarter] && groupedData[item.quarter][item.year] !== undefined) {
					groupedData[item.quarter][item.year] += item.earnings;
				}
			});
			
			const labels = ['Q1', 'Q2', 'Q3', 'Q4'];
			
			const datasets = years.map((year, yearIndex) => {
				const hue = ((yearIndex + off) * step) % 360;
				const color = `oklch(${lightness} ${chroma} ${hue})`;
				
				return {
					label: year.toString(),
					data: labels.map((_, quarterIndex) => groupedData[quarterIndex][year] || 0),
					backgroundColor: color,
					borderWidth: 0,
					borderRadius: 8
				};
			});
			
			return { labels, datasets, years };
		}
	}

	$effect(() => {
		const lectures = $lecturesStore.lectures;
		if (lectures?.length && canvas) {
			renderChart();
		}
	});

	$effect(() => {
		if (viewMode) {
			renderChart();
		}
	});

	let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
	onMount(() => {
        if ($lecturesStore.lectures?.length) {
			renderChart();
		}
        
		window.addEventListener('resize', () => {
			if (resizeTimeout) clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				if (chart) renderChart();
			}, 250);
		});
		
		return () => {
			window.removeEventListener('resize', () => {});
			if (resizeTimeout) clearTimeout(resizeTimeout);
		};
	});

	function calculatePercentageChange(current: number, previous: number): number | null {
		if (!previous || previous === 0) return null;
		return ((current - previous) / previous) * 100;
	}

	function renderChart(): void {
		if (chart) {
			chart.destroy();
		}
		
		const ctx = canvas.getContext('2d');
		
		const { labels, datasets, years } = prepareGroupedData();
		
		if (!datasets.length || !labels.length) return;
		
		const chartData = {
			labels: labels,
			datasets: datasets
		};
		
		const options: ChartConfiguration<'bar'>['options'] = {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				mode: 'index',
				intersect: false
			},
			plugins: {
				legend: {
					display: true,
					position: 'top',
					align: 'end',
					labels: {
						usePointStyle: true,
						padding: 15,
						font: {
							size: 12
						},
						color: $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.neutral.gray700,
						generateLabels: function(chart) {
							return chart.data.datasets.map((dataset, index) => ({
								text: dataset.label as string,
								fillStyle: dataset.backgroundColor as string,
								lineWidth: 0,
								hidden: false,
								index: index
							}));
						}
					}
				},
				tooltip: {
					enabled: false,
					external: ({ tooltip: t }) => {
						if (!t.opacity) {
							tooltipVisible = false;
							return;
						}
						
						const dataIndex = t.dataPoints[0]?.dataIndex;
						if (dataIndex === undefined) {
							tooltipVisible = false;
							return;
						}
						
						// Get the label (month or quarter)
						const label = chart.data.labels[dataIndex] as string;
						
						// Get all datasets (years) for this group
						const items: TooltipItem[] = [];
						const years: YearData[] = [];
						
						chart.data.datasets.forEach((dataset, datasetIndex) => {
							const year = parseInt(dataset.label as string);
							const earnings = (dataset.data[dataIndex] as number) || 0;
							
							years.push({ year, earnings, datasetIndex });
						});
						
						// Sort by year to calculate changes
						years.sort((a, b) => a.year - b.year);
						
						years.forEach((item, index) => {
							const previousItem = index > 0 ? years[index - 1] : null;
							const percentageChange = previousItem 
								? calculatePercentageChange(item.earnings, previousItem.earnings)
								: null;
							
							items.push({
								year: item.year,
								earnings: item.earnings,
								change: previousItem ? item.earnings - previousItem.earnings : null,
								percentage: percentageChange,
								color: datasets[item.datasetIndex].backgroundColor
							});
						});
						
						tooltipData = {
							title: label,
							items: items,
							x: t.caretX + 24,
							y: t.caretY - 150
						};
						
						tooltipVisible = true;
					}
				}
			},
			scales: {
				x: {
					grid: {
						color: $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light
					},
					border: {
						display: false
					},
					ticks: {
						color: $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.neutral.gray700
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						color: $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light
					},
					border: {
						display: false
					},
					ticks: {
						color: $themeStore === 'dark' ? designSystem.colors.chart.text : designSystem.colors.neutral.gray700,
						callback: function(value) {
							return formatCurrency(value as number);
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
</script>

<div class="w-full flex flex-col overflow-hidden bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow">
	<div class="px-5 py-4 sm:p-6 border-b border-[#E5E7EB] dark:border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center gap-4">
		<div class="flex sm:flex-1 items-center">
			<div class="p-2.5 mr-4 rounded-md bg-[#F0FDF4] dark:bg-[#1E1E1E]">
				<ChartColumn class="w-5 h-5 text-[#22C55E]" />
			</div>
			<div>
				<h2 class="text-base font-semibold text-[#111827] dark:text-white leading-tight">
					Earnings Overview
				</h2>
				<p class="text-xs sm:text-sm text-[#6B7280] dark:text-[#A0A0A0] mt-0.5">
					{viewMode === 'monthly' ? 'Grouped by month' : 'Grouped by quarter'}
				</p>
			</div>
		</div>
		
		<div class="flex items-center gap-2">
			<div class="flex rounded-md border border-[#E5E7EB] dark:border-[#333333] overflow-hidden">
				<button 
					class="px-3 py-1.5 text-xs font-medium transition-colors
						{viewMode === 'monthly' ? 'bg-[#22C55E]/10 text-[#15803D] dark:bg-[#22C55E]/10 dark:text-[#22C55E]' : 'bg-white dark:bg-[#121212] text-[#6B7280] dark:text-[#A0A0A0] hover:bg-[#F9FAFB] dark:hover:bg-[#1E1E1E]'}"
					onclick={() => { viewMode = 'monthly'; }}
				>
					Monthly
				</button>
				<button 
					class="px-3 py-1.5 text-xs font-medium transition-colors
						{viewMode === 'quarterly' ? 'bg-[#22C55E]/10 text-[#15803D] dark:bg-[#22C55E]/10 dark:text-[#22C55E]' : 'bg-white dark:bg-[#121212] text-[#6B7280] dark:text-[#A0A0A0] hover:bg-[#F9FAFB] dark:hover:bg-[#1E1E1E]'}"
					onclick={() => { viewMode = 'quarterly'; }}
				>
					Quarterly
				</button>
			</div>
		</div>
	</div>

	<div class="p-4 sm:p-6 relative">
		<div class="w-full h-80 pl-0 sm:pl-0">
			<canvas bind:this={canvas}></canvas>
		</div>
		
		<ChartTooltip visible={tooltipVisible} x={tooltipData.x} y={tooltipData.y} position="top">
			<div class="p-3">
				<p class="text-sm font-medium text-[#111827] dark:text-white">
					{tooltipData.title}
				</p>
			</div>
			
			<hr class="w-full border-[#E5E7EB] dark:border-[#2A2A2A]"/>
			
			<div class="flex flex-col gap-2 p-3">
				{#each tooltipData.items as item}
					<div class="flex items-center gap-2">
						<div class="size-2 rounded-full" style="background-color: {item.color};"></div>
						<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">
							{item.year}:
						</span>
						<span class="text-sm font-medium text-[#111827] dark:text-white">
							{formatCurrency(item.earnings)}
						</span>
						{#if item.percentage !== null}
							<span class="text-xs font-medium {item.percentage >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}">
								({item.percentage >= 0 ? '+' : ''}{item.percentage.toFixed(1)}%)
							</span>
						{/if}
					</div>
				{/each}
			</div>
		</ChartTooltip>
	</div>
</div>
