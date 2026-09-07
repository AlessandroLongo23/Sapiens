<script lang="ts">
	import { untrack } from 'svelte';
	import { Search, X, SlidersHorizontal } from 'lucide-svelte';
	import {
		SORT_OPTIONS,
		TUTOR_LEVELS,
		TUTOR_MODES,
		TUTOR_SUBJECTS,
		levelName,
		modeName,
		subjectName
	} from '$lib/tutoring/config';
	import { EMPTY_FILTERS, activeFilterCount, type TutorFilters } from '$lib/tutoring/filter';

	import Sheet from '$lib/components/ui/Sheet.svelte';

	/**
	 * Search box, filters and sort order for the tutor list. The state is the
	 * parent's (bound), so the page can keep it in the URL.
	 *
	 * Wide screens show every control inline. Phones show the search box, a
	 * "Filtri" button that opens the controls in a bottom sheet (the count
	 * in its footer follows the choices live), and the applied filters as
	 * chips that can be removed one by one.
	 */
	interface Props {
		filters: TutorFilters;
		/** Cities offered for in-person lessons, for the city filter. */
		cities?: string[];
		resultCount: number;
	}

	let { filters = $bindable(), cities = [], resultCount }: Props = $props();

	const schoolSubjects = TUTOR_SUBJECTS.filter((s) => s.group === 'scuola');
	const universitySubjects = TUTOR_SUBJECTS.filter((s) => s.group === 'università');

	// The text search is committed after a short pause, so typing does not
	// rewrite the URL on every key.
	let query = $state('');
	let debounce: ReturnType<typeof setTimeout> | null = null;
	let sheetOpen = $state(false);

	$effect(() => {
		// URL changes (back button, shared link) refill the box, without
		// touching what the visitor is typing right now.
		const q = filters.q;
		if (q !== untrack(() => query).trim()) query = q;
	});

	function onQueryInput(event: Event) {
		const value = (event.currentTarget as HTMLInputElement).value;
		query = value;
		if (debounce) clearTimeout(debounce);
		debounce = setTimeout(() => {
			filters = { ...filters, q: value.trim() };
		}, 250);
	}

	function clearQuery() {
		if (debounce) clearTimeout(debounce);
		query = '';
		filters = { ...filters, q: '' };
	}

	function set<K extends keyof TutorFilters>(key: K, value: TutorFilters[K]) {
		// A city only makes sense for lessons in person.
		const city = key === 'mode' && value === 'online' ? '' : filters.city;
		filters = { ...filters, city, [key]: value };
	}

	function reset() {
		if (debounce) clearTimeout(debounce);
		query = '';
		filters = { ...EMPTY_FILTERS, sort: filters.sort };
	}

	let active = $derived(activeFilterCount(filters));

	let chips = $derived(
		[
			filters.subject && { key: 'subject' as const, label: subjectName(filters.subject) },
			filters.level && { key: 'level' as const, label: levelName(filters.level) },
			filters.mode && { key: 'mode' as const, label: modeName(filters.mode) },
			filters.city && { key: 'city' as const, label: filters.city },
			filters.q && { key: 'q' as const, label: `“${filters.q}”` }
		].filter(Boolean) as { key: keyof TutorFilters; label: string }[]
	);

	const fieldClass =
		'w-full min-h-[44px] rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/30 outline-none transition';
	const labelClass = 'block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1';
	const chipClass =
		'inline-flex min-h-[36px] items-center gap-1 px-3 py-1 rounded-full bg-crimson-50 dark:bg-crimson-900/30 text-crimson-700 dark:text-crimson-200 border border-crimson-200 dark:border-crimson-800 hover:bg-crimson-100 dark:hover:bg-crimson-900/50 active:bg-crimson-100 dark:active:bg-crimson-900/50 transition-colors whitespace-nowrap';
</script>

{#snippet controls(id: string, stacked: boolean)}
	<div class={stacked ? 'flex flex-col gap-4' : 'grid grid-cols-2 lg:grid-cols-6 gap-3'}>
		<div>
			<label for="{id}-subject" class={labelClass}>Materia</label>
			<select id="{id}-subject" class={fieldClass} value={filters.subject} onchange={(e) => set('subject', e.currentTarget.value)}>
				<option value="">Tutte le materie</option>
				<optgroup label="Scuola">
					{#each schoolSubjects as s (s.id)}
						<option value={s.id}>{s.name}</option>
					{/each}
				</optgroup>
				<optgroup label="Università">
					{#each universitySubjects as s (s.id)}
						<option value={s.id}>{s.name}</option>
					{/each}
				</optgroup>
			</select>
		</div>

		<div>
			<label for="{id}-level" class={labelClass}>Livello</label>
			<select id="{id}-level" class={fieldClass} value={filters.level} onchange={(e) => set('level', e.currentTarget.value)}>
				<option value="">Tutti i livelli</option>
				{#each TUTOR_LEVELS as l (l.id)}
					<option value={l.id}>{l.name}</option>
				{/each}
			</select>
		</div>

		<fieldset class={stacked ? '' : 'col-span-2'}>
			<legend class={labelClass}>Modalità</legend>
			<div class="flex rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-900 p-1" role="group">
				{#each [{ id: '', name: 'Tutte' }, ...TUTOR_MODES] as m (m.id)}
					<button
						type="button"
						onclick={() => set('mode', m.id)}
						aria-pressed={filters.mode === m.id}
						class="flex-1 min-h-[40px] px-2 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors {filters.mode === m.id
							? 'bg-crimson-600 text-white shadow-sm'
							: 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-100 dark:active:bg-zinc-800'}"
					>
						{m.name}
					</button>
				{/each}
			</div>
		</fieldset>

		<div>
			<label for="{id}-city" class={labelClass}>Città</label>
			<select
				id="{id}-city"
				class={fieldClass}
				value={filters.city}
				disabled={cities.length === 0 || filters.mode === 'online'}
				onchange={(e) => set('city', e.currentTarget.value)}
			>
				<option value="">Tutte le città</option>
				{#each cities as city (city)}
					<option value={city}>{city}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="{id}-sort" class={labelClass}>Ordina per</label>
			<select id="{id}-sort" class={fieldClass} value={filters.sort} onchange={(e) => set('sort', e.currentTarget.value as TutorFilters['sort'])}>
				{#each SORT_OPTIONS as o (o.id)}
					<option value={o.id}>{o.name}</option>
				{/each}
			</select>
		</div>
	</div>
{/snippet}

<section
	class="rounded-2xl border border-zinc-500/25 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-3 sm:p-5 space-y-3 sm:space-y-4"
	aria-label="Cerca e filtra i tutor"
>
	<div class="flex gap-2">
		<div class="relative flex-1">
			<label for="tutor-search" class="sr-only">Cerca un tutor</label>
			<Search class="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-zinc-400" aria-hidden="true" />
			<input
				id="tutor-search"
				type="search"
				value={query}
				oninput={onQueryInput}
				placeholder="Nome, materia o città"
				autocomplete="off"
				class="w-full h-12 rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-900 pl-11 pr-10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/30 outline-none transition"
			/>
			{#if query}
				<button
					type="button"
					onclick={clearQuery}
					class="absolute right-1 top-1/2 -translate-y-1/2 flex size-[40px] items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
					aria-label="Cancella la ricerca"
				>
					<X class="size-4" aria-hidden="true" />
				</button>
			{/if}
		</div>

		<!-- Phones: the controls live in a sheet. -->
		<button
			type="button"
			onclick={() => (sheetOpen = true)}
			class="md:hidden relative inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 {active > 0
				? 'border-crimson-300 bg-crimson-50 text-crimson-700 dark:border-crimson-800 dark:bg-crimson-900/30 dark:text-crimson-200'
				: 'border-zinc-500/25 bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 active:bg-zinc-100 dark:active:bg-zinc-800'}"
			aria-haspopup="dialog"
			aria-expanded={sheetOpen}
		>
			<SlidersHorizontal class="size-5" aria-hidden="true" />
			Filtri
			{#if active > 0}
				<span class="flex size-5 items-center justify-center rounded-full bg-crimson-600 text-[11px] font-bold text-white" aria-label="{active} filtri attivi">{active}</span>
			{/if}
		</button>
	</div>

	<div class="hidden md:block">
		{@render controls('filter', false)}
	</div>

	<div class="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
		<span class="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium mr-1">
			<SlidersHorizontal class="hidden md:block size-4 text-zinc-400" aria-hidden="true" />
			{resultCount} tutor
			{#if active > 0}<span class="text-zinc-500 dark:text-zinc-400 font-normal">con i filtri scelti</span>{/if}
		</span>
		{#each chips as chip (chip.key)}
			<button
				type="button"
				onclick={() => (chip.key === 'q' ? clearQuery() : set(chip.key, ''))}
				class={chipClass}
				aria-label="Rimuovi il filtro {chip.label}"
			>
				{chip.label}
				<X class="size-3.5" aria-hidden="true" />
			</button>
		{/each}
		{#if active > 0}
			<button
				type="button"
				onclick={reset}
				class="ml-auto min-h-[36px] text-zinc-600 dark:text-zinc-400 hover:text-crimson-600 dark:hover:text-crimson-400 underline-offset-2 hover:underline transition-colors"
			>
				Azzera filtri
			</button>
		{/if}
	</div>
</section>

<Sheet open={sheetOpen} onClose={() => (sheetOpen = false)} title="Filtra i tutor" bodyClass="px-4 py-2">
	{@render controls('sheet-filter', true)}
	{#snippet footer()}
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={reset}
				disabled={active === 0}
				class="min-h-[48px] px-4 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-100 dark:active:bg-zinc-800 disabled:opacity-40 transition-colors"
			>
				Azzera
			</button>
			<button
				type="button"
				onclick={() => (sheetOpen = false)}
				class="flex-1 min-h-[48px] rounded-xl bg-crimson-600 hover:bg-crimson-700 active:bg-crimson-700 text-white text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
			>
				Mostra {resultCount} {resultCount === 1 ? 'tutor' : 'tutor'}
			</button>
		</div>
	{/snippet}
</Sheet>
