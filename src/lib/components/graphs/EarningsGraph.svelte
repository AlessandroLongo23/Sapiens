<script>
	import { studentsStore } from '$lib/stores/students/students.js';
	import { subjectsStore } from '$lib/stores/subjects/subjects.js';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	import { formatCurrency } from '$lib/utils/format.svelte.js';
	import { themeStore } from '$lib/components/theme/theme.js';
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { designSystem } from '$lib/stores/appearance.js';
	import { format, parseISO } from 'date-fns';
	import { it } from 'date-fns/locale';
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';

	import ChartTooltip from '$lib/components/graphs/ChartTooltip.svelte';
	import StackedAreaChart from '$lib/components/graphs/StackedAreaChart.svelte';

    let { filterOptions, timeRangeOptions } = $props();

	let canvas;
	let chart;
	let tooltipVisible = $state(false);
	let tooltipData = $state({
		title: '',
		value: 0,
		change: 0,
		details: [],
		x: 0,
		y: 0
	});
	
	// For stacked area chart
	let useStackedArea = $state(false);
	let stackedAreaData = $state([]);
	let stackedTooltipData = $state({
		month: '',
		details: [],
		x: 0,
		y: 0
	});
	
	onMount(() => {
		if (statsStore.earningsByMonth?.length) {
			renderChart();
		}
	});
	
	$effect(() => {
		// Track all reactive inputs used by renderChart
		const months = statsStore.earningsByMonth;
		const subjects = $subjectsStore.subjects;
		const lectures = $lecturesStore.lectures;
		const filterType = statsStore.filterType;
		const filterId = statsStore.filterId;
		const timeRange = statsStore.timeRange;

		// Re-render chart when any of these dependencies change
		if ((canvas || useStackedArea) && months?.length > 0) {
			renderChart();
		}
	});
	
	function prepareStackedAreaData() {
		const months = statsStore.earningsByMonth?.map(item => item.month) || [];
		
		const subjectMap = {};
		$subjectsStore.subjects.forEach(subject => {
			subjectMap[subject.id] = subject.name;
		});
		
		const subjectDataByMonth = {};
		$lecturesStore.lectures.forEach(lecture => {
			const lectureDate = parseISO(lecture.date);
			const monthStr = format(lectureDate, 'MMM yyyy', { locale: it });
			
			if (!months.includes(monthStr)) return;
			
			const startTime = lecture.start_time.split(':');
			const endTime = lecture.end_time.split(':');
			const startHour = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
			const endHour = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;
			const hours = endHour - startHour;
			const earnings = hours * (lecture.hourly_rate || 0);
			
			if (!subjectDataByMonth[monthStr]) {
				subjectDataByMonth[monthStr] = {};
			}
			
			if (!subjectDataByMonth[monthStr][lecture.subject_id]) {
				subjectDataByMonth[monthStr][lecture.subject_id] = 0;
			}
			
			subjectDataByMonth[monthStr][lecture.subject_id] += earnings;
		});
		
		let data = [];
		months.forEach(month => {
			Object.entries(subjectMap).forEach(([subjectId, subjectName]) => {
				const earnings = (subjectDataByMonth[month] && subjectDataByMonth[month][subjectId]) ? 
					subjectDataByMonth[month][subjectId] : 0;
				
				if (earnings > 0) {
					data.push({
						month,
						subject: subjectName,
						earnings
					});
				}
			});
		});
		
		return data;
	}

	function renderChart() {
		if (statsStore.filterType === 'subject' && !statsStore.filterId) {
			useStackedArea = true;
			stackedAreaData = prepareStackedAreaData();
			return;
		}
		
		useStackedArea = false;
		const ctx = canvas.getContext('2d');
		
		if (chart) {
			chart.destroy();
		}
		
		if (statsStore.filterType === 'subject' && !statsStore.filterId) {
			const months = statsStore.earningsByMonth?.map(item => item.month) || [];
			
			const subjectMap = {};
			$subjectsStore.subjects.forEach(subject => {
				subjectMap[subject.id] = subject.name;
			});
			
			const subjectDataByMonth = {};
			$lecturesStore.lectures.forEach(lecture => {
				const lectureDate = parseISO(lecture.date);
				const monthStr = format(lectureDate, 'MMM yyyy', { locale: it });
				
				if (!months.includes(monthStr)) return;
				
				// Calculate lecture earnings
				const startTime = lecture.start_time.split(':');
				const endTime = lecture.end_time.split(':');
				const startHour = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
				const endHour = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;
				const hours = endHour - startHour;
				const earnings = hours * (lecture.hourly_rate || 0);
				
				if (!subjectDataByMonth[monthStr]) {
					subjectDataByMonth[monthStr] = {};
				}
				
				if (!subjectDataByMonth[monthStr][lecture.subject_id]) {
					subjectDataByMonth[monthStr][lecture.subject_id] = 0;
				}
				
				subjectDataByMonth[monthStr][lecture.subject_id] += earnings;
			});
			
			const subjectIds = Object.keys(subjectMap);
			const datasets = subjectIds.map((subjectId, index) => {
				const hue = (index * 137) % 360;
				const color = `hsl(${hue}, 70%, 60%)`;
				
				return {
					label: subjectMap[subjectId],
					data: months.map(month => 
						(subjectDataByMonth[month] && subjectDataByMonth[month][subjectId]) ? 
						subjectDataByMonth[month][subjectId] : 0
					),
					backgroundColor: color,
					borderColor: color,
					borderWidth: 1
				};
			});
			
			const monthlyTotals = months.map(month => {
				let total = 0;
				subjectIds.forEach(subjectId => {
					if (subjectDataByMonth[month] && subjectDataByMonth[month][subjectId]) {
						total += subjectDataByMonth[month][subjectId];
					}
				});
				return total;
			});
			
			const avgEarnings = monthlyTotals.reduce((sum, val) => sum + val, 0) / monthlyTotals.length;
			
			datasets.push({
				label: 'Average',
				data: Array(months.length).fill(avgEarnings),
				borderColor: `${window.matchMedia('(prefers-color-scheme: dark)').matches ? designSystem.colors.chart.avgLine.dark : designSystem.colors.chart.avgLine.light}`,
				backgroundColor: 'transparent',
				borderWidth: 2,
				borderDash: [5, 5],
				fill: false,
				pointRadius: 0,
				pointHoverRadius: 0
			});
			
			const data = {
				labels: months,
				datasets: datasets
			};
			
			const options = {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'index',
					intersect: false
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
						stacked: true,
						grid: {
							color: $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light,
							drawBorder: false
						},
						ticks: {
							color: designSystem.colors.chart.text
						}
					},
					y: {
						stacked: true,
						beginAtZero: true,
						grid: {
							color: $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light,
							drawBorder: false
						},
						ticks: {
							color: designSystem.colors.chart.text,
							callback: function(value) {
								return formatCurrency(value);
							}
						}
					}
				}
			};
			
			chart = new Chart(ctx, {
				type: 'bar',
				data: data,
				options: options
			});
		} else {
			const monthlyData = statsStore.earningsByMonth || [];
			const avgEarnings = monthlyData.length > 0 ? monthlyData.reduce((sum, item) => sum + item.earnings, 0) / monthlyData.length : 0;
			
			const data = {
				labels: monthlyData.map(item => item.month),
				datasets: [
					{
						label: 'Earnings',
						data: monthlyData.map(item => item.earnings),
						backgroundColor: 'rgba(34, 197, 94, 0.15)',
						borderColor: designSystem.colors.primary.green,
						borderWidth: 2,
						fill: true,
						tension: 0.4,
						pointBackgroundColor: designSystem.colors.primary.green,
						pointBorderColor: '#FFFFFF',
						pointBorderWidth: 1.5,
						pointRadius: 4,
						pointHoverRadius: 6,
					},
					{
						label: 'Average',
						data: Array(monthlyData.length).fill(avgEarnings),
						borderColor: `${$themeStore === 'dark' ? designSystem.colors.chart.avgLine.dark : designSystem.colors.chart.avgLine.light}`,
						backgroundColor: 'transparent',
						borderWidth: 2,
						borderDash: [5, 5],
						fill: false,
						pointRadius: 0,
						pointHoverRadius: 0
					}
				]
			};
			
			const options = {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'index',
					intersect: false
				},
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						enabled: false,
						position: 'nearest',
						external: ({ tooltip: t }) => {
							if (!t.opacity) {
								tooltipVisible = false;
								return;
							}
							
							const dataIndex = t.dataPoints[0].dataIndex;
							const currentEarnings = statsStore.earningsByMonth?.[dataIndex]?.earnings || 0;
							const previousEarnings = dataIndex > 0 ? (statsStore.earningsByMonth?.[dataIndex - 1]?.earnings || 0) : currentEarnings;
							const change = currentEarnings - previousEarnings;
							
							const rect = canvas.getBoundingClientRect();

							tooltipData = {
								title: statsStore.earningsByMonth?.[dataIndex]?.month || '',
								value: currentEarnings,
								change: change,
								details: [],
								x: t.caretX,
								y: t.caretY - 116
							};
							
							tooltipVisible = true;
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						grid: {
							color: $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light,
							drawBorder: false
						},
						ticks: {
							color: designSystem.colors.chart.text,
							callback: function(value) {
								return formatCurrency(value);
							}
						}
					},
					x: {
						grid: {
							color: $themeStore === 'dark' ? designSystem.colors.chart.grid.dark : designSystem.colors.chart.grid.light,
							drawBorder: false
						},
						ticks: {
							color: designSystem.colors.chart.text
						}
					}
				}
			};
			
			chart = new Chart(ctx, {
				type: 'line',
				data: data,
				options: options
			});
		}
	}
	
	function handleFilterChange(type, id = null) {
		statsStore.setFilter(type, id);
	}
	
	function handleTimeRangeChange(months) {
		statsStore.setTimeRange(months);
	}
	
	function handleStackedAreaHover(event) {
		const { month, details, x, y } = event;
		
		// Calculate total earnings for the month
		const totalEarnings = details.reduce((sum, d) => sum + d.earnings, 0);
		
		stackedTooltipData = {
			month,
			details,
			totalEarnings,
			x,
			y: y - 70 // Offset to position tooltip above the cursor
		};
		
		tooltipVisible = true;
	}
	
	function handleStackedAreaMouseOut() {
		tooltipVisible = false;
	}
	
	let totalEarnings = $derived.by(() => {
		if (!statsStore.earningsByMonth?.length) return 0;
		return statsStore.earningsByMonth.reduce((sum, item) => sum + item.earnings, 0);
	});

	let totalHours = $derived.by(() => {
		if (!statsStore.hoursByMonth?.length) return 0;
		return statsStore.hoursByMonth.reduce((sum, item) => sum + item.hours, 0);
	});

	let averageMonthlyEarnings = $derived.by(() => {
		if (!statsStore.earningsByMonth?.length) return 0;
		return statsStore.earningsByMonth.reduce((sum, item) => sum + item.earnings, 0) / statsStore.earningsByMonth.length;
	});

	const formatHours = (hours) => {
		const hoursInt = Math.floor(hours);
		const minutes = Math.round((hours - hoursInt) * 60);
		return `${hoursInt}h ${minutes}m`;
	};	
</script>

<div class="relative flex flex-col h-full items-center">
    <div class="absolute top-2 right-2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/90 dark:bg-[#121212] border border-[#E5E7EB] dark:border-[#374151] shadow-sm">
        <div class="flex items-center gap-2">
            <div class="w-8 h-0.5" style="background-image: linear-gradient(to right, #D1D5DB 50%, transparent 50%); background-size: 6px 100%; background-repeat: repeat-x;"></div>
            <span class="text-xs font-medium text-[#6B7280]">Average</span>
        </div>
        <span class="text-sm font-semibold text-[#111827] dark:text-white">
            {formatCurrency(averageMonthlyEarnings)}
        </span>
    </div>
    
    {#if useStackedArea}
        <!-- D3 stacked area chart for all subjects view -->
        <div class="w-full h-full">
            <StackedAreaChart 
                data={stackedAreaData} 
                height={300}
                tension={0.4}
                onHover={handleStackedAreaHover}
                onMouseOut={handleStackedAreaMouseOut}
            />
        </div>
    {:else}
        <!-- Regular Chart.js chart -->
        <canvas bind:this={canvas}></canvas>
    {/if}
    
    <ChartTooltip visible={tooltipVisible} x={useStackedArea ? stackedTooltipData.x : tooltipData.x} y={useStackedArea ? stackedTooltipData.y : tooltipData.y} position="top">
        <div class="p-3">
            <p class="text-sm font-medium text-[#111827] dark:text-white">
                {useStackedArea ? stackedTooltipData.month : tooltipData.title}
            </p>
        </div>
        
        <hr class="w-full border-[#E5E7EB] dark:border-[#374151]"/>
        
        <div class="flex flex-col gap-2 p-3">
            {#if useStackedArea && stackedTooltipData.details?.length > 0}
                {#each stackedTooltipData.details as detail}
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background-color: {detail.color}"></div>
                            <span class="text-xs {detail.isHighlighted ? 'font-semibold text-[#111827] dark:text-white' : 'text-[#6B7280]'}">{detail.subject}</span>
                        </div>
                        
                        <span class="text-sm font-medium {detail.isHighlighted ? 'font-semibold' : ''} text-[#111827] dark:text-white">
                            {formatCurrency(detail.earnings)}
                        </span>
                    </div>
                {/each}
                
                <hr class="w-full border-[#E5E7EB] dark:border-[#374151]"/>
                
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-2">
                        <ls.Equal class="w-3 h-3 text-[#111827] dark:text-white"/>
                        <span class="text-xs text-[#6B7280]">Total</span>
                    </div>
                    
                    <span class="text-sm font-medium text-[#111827] dark:text-white">
                        {formatCurrency(stackedTooltipData.totalEarnings || 0)}
                    </span>
                </div>
            {:else if !useStackedArea}
                {#if tooltipData.details?.length > 0}
                    {#each tooltipData.details as detail}
                        <div class="flex items-center justify-between gap-4">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full" style="background-color: {detail.color}"></div>
                                <span class="text-xs text-[#6B7280]">{detail.label}</span>
                            </div>
                            
                            <span class="text-sm font-medium text-[#111827] dark:text-white">
                                {formatCurrency(detail.value)}
                            </span>
                        </div>
                    {/each}
                    
                    <hr class="w-full border-[#E5E7EB] dark:border-[#374151]"/>
                {/if}
                
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-2">
                        <ls.Equal class="w-3 h-3 text-[#111827] dark:text-white"/>
                        <span class="text-xs text-[#6B7280]">Total</span>
                    </div>
                    
                    <span class="text-sm font-medium text-[#111827] dark:text-white">
                        {formatCurrency(tooltipData.value)}
                    </span>
                </div>
                
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-2">
                        {#if tooltipData.change >= 0}
                            <ls.ArrowUp class="w-3 h-3 text-[#22C55E]"/>
                            <span class="text-xs text-[#6B7280]">Increase</span>
                        {:else}
                            <ls.ArrowDown class="w-3 h-3 text-[#EF4444]"/>
                            <span class="text-xs text-[#6B7280]">Decrease</span>
                        {/if}
                    </div>
                    
                    <span class="text-sm font-medium {tooltipData.change >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}">
                        {formatCurrency(Math.abs(tooltipData.change))}
                    </span>
                </div>
            {/if}
        </div>
    </ChartTooltip>
</div>