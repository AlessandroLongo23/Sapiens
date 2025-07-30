<script>
	import { studentsStore } from '$lib/stores/students/students.js';
	import { subjectsStore } from '$lib/stores/subjects/subjects.js';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	import { formatCurrency } from '$lib/utils/format.svelte.js';
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { widgetStyle } from '$lib/stores/appearance.js';
	import { format, parseISO } from 'date-fns';
	import { it } from 'date-fns/locale';
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';

	import ChartTooltip from '$lib/components/ChartTooltip.svelte';

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
	
	onMount(() => {
		renderChart();
	});
	
	$effect(() => {
		if (statsStore.earningsByMonth && canvas) {
			renderChart();
		}
	});
	
	function renderChart() {
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
			
			// Create a dataset for each subject
			const subjectIds = Object.keys(subjectMap);
			const datasets = subjectIds.map((subjectId, index) => {
				// Generate a color for this subject
				const hue = (index * 137) % 360; // Use golden ratio to distribute colors
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
			
			// Add average line dataset
			datasets.push({
				label: 'Average',
				data: Array(months.length).fill(avgEarnings),
				borderColor: '#71717a',
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
							color: '#71717a20'
						},
						ticks: {
							color: '#71717a'
						}
					},
					y: {
						stacked: true,
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
						backgroundColor: 'rgba(59, 130, 246, 0.2)',
						borderColor: 'rgba(59, 130, 246, 1)',
						borderWidth: 2,
						fill: true,
						tension: 0.4,
					},
					{
						label: 'Average',
						data: Array(monthlyData.length).fill(avgEarnings),
						borderColor: '#71717a',
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
					x: {
						grid: {
							color: '#71717a20',
							drawBorder: false
						},
						ticks: {
							color: '#71717a'
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
    <div class="absolute top-2 right-2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <div class="flex items-center gap-2">
            <div class="w-8 h-0.5 bg-zinc-500 dark:bg-zinc-400" style="background-image: linear-gradient(to right, #71717a 50%, transparent 50%); background-size: 6px 100%; background-repeat: repeat-x;"></div>
            <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">Average</span>
        </div>
        <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {formatCurrency(averageMonthlyEarnings)}
        </span>
    </div>
    
    <canvas bind:this={canvas}></canvas>
    
    <ChartTooltip visible={tooltipVisible} x={tooltipData.x} y={tooltipData.y} position="top">
        <div class="p-3">
            <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">{tooltipData.title}</p>
        </div>
        
        <hr class="w-full border-zinc-200 dark:border-zinc-700"/>
        
        <div class="flex flex-col gap-2 p-3">
            {#if tooltipData.details.length > 0}
                {#each tooltipData.details as detail}
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background-color: {detail.color}"></div>
                            <span class="text-xs text-muted-foreground">{detail.label}</span>
                        </div>
                        
                        <span class="text-sm font-medium text-foreground">
                            {formatCurrency(detail.value)}
                        </span>
                    </div>
                {/each}
                
                <hr class="w-full border-zinc-200 dark:border-zinc-700"/>
            {/if}
            
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <ls.Equal class="w-3 h-3 text-zinc-950 dark:text-zinc-50"/>
                    <span class="text-xs text-zinc-950 dark:text-zinc-50">Balance</span>
                </div>
                
                <span class="text-sm font-medium text-foreground">
                    {formatCurrency(tooltipData.value)}
                </span>
            </div>
            
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    {#if tooltipData.change >= 0}
                        	<ls.ArrowUp class="w-3 h-3 text-green-500"/>
                        <span class="text-xs text-zinc-950 dark:text-zinc-50">Increase</span>
                    {:else}
                        <ls.ArrowDown class="w-3 h-3 text-red-500"/>
                        <span class="text-xs text-zinc-950 dark:text-zinc-50">Decrease</span>
                    {/if}
                </div>
                
                <span class="text-sm font-medium {tooltipData.change >= 0 ? 'text-green-500' : 'text-red-500'}">
                    {formatCurrency(Math.abs(tooltipData.change))}
                </span>
            </div>
        </div>
    </ChartTooltip>
</div>