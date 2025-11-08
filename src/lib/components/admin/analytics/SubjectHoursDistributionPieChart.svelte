<script>
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { lecturesStore } from '$lib/stores/lectures.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { themeStore } from '$lib/components/shared/ui/theme/theme.js';
	import { designSystem } from '$lib/const/appearance.js';
	import { formatCurrency } from '$lib/utils/format.svelte';
	import { BookOpen } from 'lucide-svelte';
	import ChartTooltip from '$lib/components/graphs/ChartTooltip.svelte';

	let canvas;
	let chart;
	let canvasContainer;
	let viewMode = $state('hours'); // 'hours' or 'earnings'
	let tooltipVisible = $state(false);
	let tooltipData = $state({
		label: '',
		hours: 0,
		earnings: 0,
		percentage: 0,
		color: '',
		x: 0,
		y: 0
	});

	let subjectDistribution = $derived.by(() => {
		if ($lecturesStore.loading || $subjectsStore.loading) {
			return [];
		}

		const subjectMap = new Map();

		$lecturesStore.lectures.forEach(lecture => {
			const subject = $subjectsStore.subjects.find(s => s.id === lecture.subject_id);
			if (!subject) return;

			const durationHours = lecture.getDuration();
			const earnings = lecture.getEarning();

			const subjectId = subject.id;
			if (subjectMap.has(subjectId)) {
				const existing = subjectMap.get(subjectId);
				existing.hours += durationHours;
				existing.earnings += earnings;
			} else {
				subjectMap.set(subjectId, {
					name: subject.name,
					hours: durationHours,
					earnings: earnings,
					color: subject.hex_color
				});
			}
		});

		return Array.from(subjectMap.values())
			.map(item => ({ name: item.name, hours: item.hours, earnings: item.earnings, color: item.color }))
			.sort((a, b) => {
				const valueA = viewMode === 'hours' ? a.hours : a.earnings;
				const valueB = viewMode === 'hours' ? b.hours : b.earnings;
				return valueB - valueA;
			});
	});

	onMount(() => {
		if (!$lecturesStore.loading && !$subjectsStore.loading && subjectDistribution.length > 0) {
			renderChart();
		}
	});

	$effect(() => {
		if (!$lecturesStore.loading && !$subjectsStore.loading && subjectDistribution.length > 0 && canvas) {
			renderChart();
		}
	});

	$effect(() => {
		if (viewMode && chart) {
			renderChart();
		}
	});

	$effect(() => {
		if ($themeStore && chart) {
			renderChart();
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

	function hexToRgba(hex, alpha) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	function renderChart() {
		if (chart) {
			chart.destroy();
		}

		if (!canvas || subjectDistribution.length === 0) return;

		const ctx = canvas.getContext('2d');
		const total = viewMode === 'hours'
			? subjectDistribution.reduce((sum, item) => sum + item.hours, 0)
			: subjectDistribution.reduce((sum, item) => sum + item.earnings, 0);

		const backgroundColor = subjectDistribution.map(item => 
			hexToRgba(item.color || '#22C55E', 0.7)
		);

		const chartData = {
			labels: subjectDistribution.map(item => item.name),
			datasets: [
				{
					data: subjectDistribution.map(item => viewMode === 'hours' ? item.hours : item.earnings),
					backgroundColor: backgroundColor,
					borderWidth: 0,
				}
			]
		};

		const options = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					position: 'right',
					labels: {
						color: designSystem.colors.chart.text,
						font: {
							size: 12
						},
						padding: 15,
						usePointStyle: true,
						pointStyle: 'circle',
						generateLabels: function(chart) {
							const data = chart.data;
							if (data.labels.length && data.datasets.length) {
								const dataset = data.datasets[0];
								const total = dataset.data.reduce((a, b) => a + b, 0);
								return data.labels.map((label, i) => {
									const value = dataset.data[i];
									const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
									return {
										text: `${label} (${percentage}%)`,
										fillStyle: dataset.backgroundColor[i],
										lineWidth: 0,
										hidden: false,
										index: i
									};
								});
							}
							return [];
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

						const item = subjectDistribution[dataIndex];
						const total = viewMode === 'hours' 
							? subjectDistribution.reduce((sum, item) => sum + item.hours, 0)
							: subjectDistribution.reduce((sum, item) => sum + item.earnings, 0);
						const value = viewMode === 'hours' ? item.hours : item.earnings;
						const percentage = total > 0 ? (value / total) * 100 : 0;

						console.log(t.caretX, t.caretY)

						tooltipData = {
							label: item.name,
							hours: item.hours,
							earnings: item.earnings,
							percentage: percentage,
							color: item.color,
							x: t.caretX + 23,
							y: t.caretY - 90
						};

						tooltipVisible = true;
					}
				}
			}
		};

		chart = new Chart(ctx, {
			type: 'pie',
			data: chartData,
			options: options
		});
	}
</script>

<div class="w-full flex flex-col overflow-hidden bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow">
	<div class="px-5 py-4 sm:p-6 border-b border-[#E5E7EB] dark:border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center gap-4">
		<div class="flex sm:flex-1 items-center">
			<div class="p-2.5 mr-4 rounded-md bg-[#F3E8FF] dark:bg-[#1E1E1E]">
				<BookOpen class="w-5 h-5 text-[#8B5CF6]" />
			</div>
			<div>
				<h2 class="text-base font-semibold text-[#111827] dark:text-white leading-tight">Subject Hours Distribution</h2>
				<p class="text-xs sm:text-sm text-[#6B7280] dark:text-[#A0A0A0] mt-0.5">{viewMode === 'hours' ? 'Hours' : 'Earnings'} by subject</p>
			</div>
		</div>
		
		<div class="flex rounded-md border border-[#E5E7EB] dark:border-[#333333] overflow-hidden">
			<button 
				class="px-3 py-1.5 text-xs font-medium transition-colors {viewMode === 'hours' ? 'bg-[#8B5CF6]/10 text-[#7C3AED] dark:bg-[#8B5CF6]/10 dark:text-[#8B5CF6]' : 'bg-white dark:bg-[#121212] text-[#6B7280] dark:text-[#A0A0A0] hover:bg-[#F9FAFB] dark:hover:bg-[#1E1E1E]'}"
				onclick={() => { if (viewMode !== 'hours') { viewMode = 'hours'; renderChart(); } }}
			>
				By Hours
			</button>
			<button 
				class="px-3 py-1.5 text-xs font-medium transition-colors {viewMode === 'earnings' ? 'bg-[#8B5CF6]/10 text-[#7C3AED] dark:bg-[#8B5CF6]/10 dark:text-[#8B5CF6]' : 'bg-white dark:bg-[#121212] text-[#6B7280] dark:text-[#A0A0A0] hover:bg-[#F9FAFB] dark:hover:bg-[#1E1E1E]'}"
				onclick={() => { if (viewMode !== 'earnings') { viewMode = 'earnings'; renderChart(); } }}
			>
				By Earnings
			</button>
		</div>
	</div>

	<div class="p-4 sm:p-6 relative">
		<div class="w-full h-72 pl-0 sm:pl-0" bind:this={canvasContainer}>
			<canvas bind:this={canvas}></canvas>
		</div>

		<ChartTooltip visible={tooltipVisible} x={tooltipData.x} y={tooltipData.y} position="top">
			<div class="flex flex-row items-center justify-start gap-3 p-3">
				<div class="size-4 rounded-full" style="background: {tooltipData.color};"></div>
				<p class="text-sm font-medium text-[#111827] dark:text-white">{tooltipData.label}</p>
			</div>

			<hr class="w-full border-[#E5E7EB] dark:border-[#2A2A2A]"/>

			<div class="flex flex-col gap-2 p-3">
				<div class="flex items-center justify-between gap-4">
					<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">{viewMode === 'hours' ? 'Hours' : 'Earnings'}</span>
					<span class="text-sm font-medium text-[#111827] dark:text-white">
						{viewMode === 'hours' 
							? `${tooltipData.hours.toFixed(1)}h`
							: formatCurrency(tooltipData.earnings)
						}
					</span>
				</div>

				<div class="flex items-center justify-between gap-4">
					<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">Percentage</span>
					<span class="text-sm font-medium text-[#111827] dark:text-white">
						{tooltipData.percentage.toFixed(1)}%
					</span>
				</div>
			</div>
		</ChartTooltip>
	</div>
</div>

