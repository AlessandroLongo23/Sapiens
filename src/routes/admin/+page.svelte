<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { 
		LayoutDashboard, 
		Pencil, 
		BookOpen, 
		Layers, 
		FileText, 
		GraduationCap,
		CheckCircle2,
		FlaskConical,
		ScrollText,
		Dumbbell,
		ChevronRight,
		TrendingUp
	} from 'lucide-svelte';

	let { data } = $props();
	let stats = $derived(data.stats);

	// Refs for D3 charts
	let donutChartRef = $state<HTMLDivElement>();
	let barChartRef = $state<HTMLDivElement>();
	let completionGaugeRef = $state<HTMLDivElement>();

	// Calculate percentages
	let theoryPercent = $derived(stats ? Math.round((stats.topicsWithTheory / stats.topics) * 100) || 0 : 0);
	let formularyPercent = $derived(stats ? Math.round((stats.topicsWithFormulary / stats.topics) * 100) || 0 : 0);
	let exercisesPercent = $derived(stats ? Math.round((stats.topicsWithExercises / stats.topics) * 100) || 0 : 0);

	// Full completion (all three)
	let fullyComplete = $derived(stats ? Math.min(stats.topicsWithTheory, stats.topicsWithFormulary, stats.topicsWithExercises) : 0);
	let completionPercent = $derived(stats ? Math.round((fullyComplete / stats.topics) * 100) || 0 : 0);

	onMount(() => {
		if (stats) {
			createDonutChart();
			createBarChart();
			createCompletionGauge();
		}
	});

	function createDonutChart() {
		if (!donutChartRef || !stats) return;

		const width = 200;
		const height = 200;
		const radius = Math.min(width, height) / 2;

		d3.select(donutChartRef).selectAll('*').remove();

		const svg = d3.select(donutChartRef)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`);

		const data = [
			{ label: 'Teoria', value: stats.topicsWithTheory, color: '#EC4899' },
			{ label: 'Formulario', value: stats.topicsWithFormulary, color: '#8B5CF6' },
			{ label: 'Esercizi', value: stats.topicsWithExercises, color: '#06B6D4' },
		];

		const pie = d3.pie<{ label: string; value: number; color: string }>()
			.value(d => d.value)
			.sort(null);

		const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
			.innerRadius(radius * 0.55)
			.outerRadius(radius * 0.9);

		const arcs = svg.selectAll('arc')
			.data(pie(data))
			.enter()
			.append('g');

		arcs.append('path')
			.attr('d', arc)
			.attr('fill', d => d.data.color)
			.attr('stroke', 'transparent')
			.style('stroke-width', '2px')
			.style('opacity', 0.9)
			.transition()
			.duration(800)
			.attrTween('d', function(d) {
				const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return function(t) {
					return arc(interpolate(t)) || '';
				};
			});

		// Center text
		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '-0.2em')
			.attr('class', 'fill-zinc-800 dark:fill-zinc-200 font-bold')
			.style('font-size', '28px')
			.text(stats.topics);

		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '1.2em')
			.attr('class', 'fill-zinc-500')
			.style('font-size', '12px')
			.text('Topic');
	}

	function createBarChart() {
		if (!barChartRef || !stats) return;

		const margin = { top: 20, right: 20, bottom: 30, left: 10 };
		const width = 280 - margin.left - margin.right;
		const height = 180 - margin.top - margin.bottom;

		d3.select(barChartRef).selectAll('*').remove();

		const svg = d3.select(barChartRef)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const data = stats.levelBreakdown.map(l => ({
			name: l.title.split(' ')[1] || l.title.substring(0, 8),
			value: l.topics,
			ready: l.readyTopics
		}));

		const x = d3.scaleBand()
			.domain(data.map(d => d.name))
			.range([0, width])
			.padding(0.3);

		const y = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.value) || 10])
			.range([height, 0]);

		// Background bars (total)
		svg.selectAll('.bar-bg')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar-bg')
			.attr('x', d => x(d.name) || 0)
			.attr('width', x.bandwidth())
			.attr('y', height)
			.attr('height', 0)
			.attr('rx', 6)
			.attr('fill', '#27272a')
			.transition()
			.duration(600)
			.attr('y', d => y(d.value))
			.attr('height', d => height - y(d.value));

		// Foreground bars (ready)
		svg.selectAll('.bar-fg')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar-fg')
			.attr('x', d => x(d.name) || 0)
			.attr('width', x.bandwidth())
			.attr('y', height)
			.attr('height', 0)
			.attr('rx', 6)
			.attr('fill', '#EC4899')
			.transition()
			.delay(300)
			.duration(600)
			.attr('y', d => y(d.ready))
			.attr('height', d => height - y(d.ready));

		// X axis labels
		svg.append('g')
			.attr('transform', `translate(0, ${height + 8})`)
			.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
			.attr('text-anchor', 'middle')
			.attr('class', 'fill-zinc-400')
			.style('font-size', '11px')
			.text(d => d.name);
	}

	function createCompletionGauge() {
		if (!completionGaugeRef || !stats) return;

		const width = 140;
		const height = 80;
		const radius = 60;

		d3.select(completionGaugeRef).selectAll('*').remove();

		const svg = d3.select(completionGaugeRef)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height})`);

		const arcGenerator = d3.arc<{ startAngle: number; endAngle: number }>()
			.innerRadius(radius * 0.7)
			.outerRadius(radius);

		// Background arc
		svg.append('path')
			.datum({ startAngle: -Math.PI / 2, endAngle: Math.PI / 2 })
			.attr('d', arcGenerator)
			.attr('fill', '#27272a');

		// Foreground arc
		const endAngle = -Math.PI / 2 + (Math.PI * completionPercent / 100);
		
		svg.append('path')
			.datum({ startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 })
			.attr('fill', '#10B981')
			.transition()
			.duration(1000)
			.attrTween('d', function() {
				const interpolate = d3.interpolate(-Math.PI / 2, endAngle);
				return function(t) {
					return arcGenerator({ startAngle: -Math.PI / 2, endAngle: interpolate(t) }) || '';
				};
			});

		// Percentage text
		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '-0.5em')
			.attr('class', 'fill-zinc-100 font-bold')
			.style('font-size', '20px')
			.text(`${completionPercent}%`);
	}
</script>

<svelte:head>
	<title>Dashboard Admin - Sapiens</title>
</svelte:head>

<div class="h-screen overflow-hidden flex flex-col p-6 lg:p-8">
	<!-- Header -->
	<header class="flex items-center justify-between mb-6 flex-shrink-0">
		<div class="flex items-center gap-4">
			<div class="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
				<LayoutDashboard class="size-7" />
			</div>
			<div>
				<h1 class="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
					Dashboard Admin
				</h1>
				<p class="text-sm text-zinc-500 dark:text-zinc-400">
					Panoramica dei contenuti e strumenti di gestione
				</p>
			</div>
		</div>

		<a 
			href="/admin/desk" 
			class="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all duration-200 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5"
		>
			<Pencil class="size-4" />
			<span>Apri Desk</span>
			<ChevronRight class="size-4 transition-transform group-hover:translate-x-0.5" />
		</a>
	</header>

	<!-- Main Grid -->
	{#if stats}
		<div class="flex-1 grid grid-cols-12 gap-4 lg:gap-6 min-h-0">
			
			<!-- Left Column: Key Metrics -->
			<div class="col-span-12 lg:col-span-3 flex flex-col gap-4">
				<!-- Quick Stats Cards -->
				<div class="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
					<div class="bg-white dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm">
						<div class="flex items-center gap-3">
							<div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
								<GraduationCap class="size-5" />
							</div>
							<div>
								<p class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.levels}</p>
								<p class="text-xs text-zinc-500">Livelli</p>
							</div>
						</div>
					</div>

					<div class="bg-white dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm">
						<div class="flex items-center gap-3">
							<div class="p-2 rounded-xl bg-teal-500/10 text-teal-500">
								<BookOpen class="size-5" />
							</div>
							<div>
								<p class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.subjects}</p>
								<p class="text-xs text-zinc-500">Materie</p>
							</div>
						</div>
					</div>

					<div class="bg-white dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm">
						<div class="flex items-center gap-3">
							<div class="p-2 rounded-xl bg-amber-500/10 text-amber-500">
								<Layers class="size-5" />
							</div>
							<div>
								<p class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.chapters}</p>
								<p class="text-xs text-zinc-500">Capitoli</p>
							</div>
						</div>
					</div>

					<div class="bg-white dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm">
						<div class="flex items-center gap-3">
							<div class="p-2 rounded-xl bg-rose-500/10 text-rose-500">
								<FileText class="size-5" />
							</div>
							<div>
								<p class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.topics}</p>
								<p class="text-xs text-zinc-500">Topic</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Completion Gauge -->
				<div class="bg-white dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm flex-1 flex flex-col items-center justify-center">
					<p class="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Completezza Totale</p>
					<div bind:this={completionGaugeRef}></div>
					<p class="text-xs text-zinc-500 mt-2 text-center">
						Topic con teoria, formulario<br/>ed esercizi pronti
					</p>
				</div>
			</div>

			<!-- Center Column: Main Visualization -->
			<div class="col-span-12 lg:col-span-5 flex flex-col gap-4">
				<!-- Donut Chart Card -->
				<div class="bg-white dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm flex-1">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
							Distribuzione Contenuti
						</h2>
						<TrendingUp class="size-5 text-zinc-400" />
					</div>

					<div class="flex items-center justify-center gap-8">
						<div bind:this={donutChartRef}></div>

						<div class="space-y-4">
							<div class="flex items-center gap-3">
								<div class="size-3 rounded-full bg-rose-500"></div>
								<div>
									<p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Teoria</p>
									<p class="text-xs text-zinc-500">{stats.topicsWithTheory} topic ({theoryPercent}%)</p>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-3 rounded-full bg-violet-500"></div>
								<div>
									<p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Formulario</p>
									<p class="text-xs text-zinc-500">{stats.topicsWithFormulary} topic ({formularyPercent}%)</p>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-3 rounded-full bg-cyan-500"></div>
								<div>
									<p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Esercizi</p>
									<p class="text-xs text-zinc-500">{stats.topicsWithExercises} topic ({exercisesPercent}%)</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Progress Bars -->
				<div class="bg-white dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm">
					<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
						Avanzamento per Tipo
					</h2>

					<div class="space-y-5">
						<div>
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center gap-2">
									<ScrollText class="size-4 text-rose-500" />
									<span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Teoria</span>
								</div>
								<span class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{theoryPercent}%</span>
							</div>
							<div class="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
								<div 
									class="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-1000 ease-out"
									style="width: {theoryPercent}%"
								></div>
							</div>
						</div>

						<div>
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center gap-2">
									<FlaskConical class="size-4 text-violet-500" />
									<span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Formulario</span>
								</div>
								<span class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{formularyPercent}%</span>
							</div>
							<div class="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
								<div 
									class="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-1000 ease-out"
									style="width: {formularyPercent}%"
								></div>
							</div>
						</div>

						<div>
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center gap-2">
									<Dumbbell class="size-4 text-cyan-500" />
									<span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Esercizi</span>
								</div>
								<span class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{exercisesPercent}%</span>
							</div>
							<div class="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
								<div 
									class="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
									style="width: {exercisesPercent}%"
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column: Level Breakdown -->
			<div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
				<!-- Bar Chart -->
				<div class="bg-white dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm">
					<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
						Topic per Livello
					</h2>
					<div class="flex items-center justify-center">
						<div bind:this={barChartRef}></div>
					</div>
					<div class="flex items-center justify-center gap-6 mt-4 text-xs">
						<div class="flex items-center gap-2">
							<div class="size-2.5 rounded bg-zinc-700"></div>
							<span class="text-zinc-500">Totali</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="size-2.5 rounded bg-rose-500"></div>
							<span class="text-zinc-500">Completi</span>
						</div>
					</div>
				</div>

				<!-- Level Cards -->
				<div class="bg-white dark:bg-zinc-800/50 rounded-2xl p-5 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm flex-1 overflow-auto">
					<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
						Dettaglio Livelli
					</h2>

					<div class="space-y-3">
						{#each stats.levelBreakdown as level}
							{@const levelPercent = level.topics > 0 ? Math.round((level.readyTopics / level.topics) * 100) : 0}
							<div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
								<div class="flex items-center justify-between mb-2">
									<h3 class="font-medium text-zinc-800 dark:text-zinc-200 text-sm">
										{level.title}
									</h3>
									<div class="flex items-center gap-1.5">
										{#if levelPercent === 100}
											<CheckCircle2 class="size-4 text-green-500" />
										{/if}
										<span class="text-xs font-medium px-2 py-0.5 rounded-full {levelPercent >= 75 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : levelPercent >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}">
											{levelPercent}%
										</span>
									</div>
								</div>
								<div class="flex items-center gap-4 text-xs text-zinc-500">
									<span>{level.subjects} materie</span>
									<span>•</span>
									<span>{level.chapters} capitoli</span>
									<span>•</span>
									<span>{level.readyTopics}/{level.topics} pronti</span>
								</div>
								<div class="mt-2 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
									<div 
										class="h-full bg-rose-500 rounded-full transition-all duration-500"
										style="width: {levelPercent}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Empty State -->
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center">
				<div class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6 inline-block">
					<LayoutDashboard class="size-12 text-zinc-400" />
				</div>
				<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
					Nessun dato disponibile
				</h2>
				<p class="text-zinc-500 max-w-md">
					Non è stato possibile caricare i dati dei contenuti. 
					Verifica la connessione al database.
				</p>
			</div>
		</div>
	{/if}
</div>

