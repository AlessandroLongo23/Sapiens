'use client';

import { useRef, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { SORT_OPTIONS, TUTOR_LEVELS, TUTOR_MODES, TUTOR_SUBJECTS, levelName, modeName, subjectName } from '@/lib/tutoring/config';
import { EMPTY_FILTERS, activeFilterCount, type TutorFilters as Filters } from '@/lib/tutoring/filter';
import { cn } from '@/lib/utils/cn';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Label, Select } from '@/components/ui/Field';

const school = TUTOR_SUBJECTS.filter((s) => s.group === 'scuola');
const university = TUTOR_SUBJECTS.filter((s) => s.group === 'università');
const smallLabel = 'mb-1 block text-xs font-medium text-fg-subtle';
const field = 'min-h-[44px] py-2.5 text-sm';

interface Props {
	filters: Filters;
	onChange: (filters: Filters) => void;
	/** Cities offered for in-person lessons, for the city filter. */
	cities: string[];
	resultCount: number;
}

/**
 * Search box, filters and sort order for the tutor list. The state is the
 * page's, which keeps it in the URL. Wide screens show every control
 * inline; phones show the search box, a "Filtri" button that opens the
 * controls in a bottom sheet, and the applied filters as removable chips.
 */
export function TutorFilters({ filters, onChange, cities, resultCount }: Props) {
	// The text search is committed after a short pause, so typing does not rewrite the URL on every key.
	const [query, setQuery] = useState(filters.q);
	const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const active = activeFilterCount(filters);

	// URL changes (back button, shared link) refill the box, without touching what is being typed right now.
	const [urlQuery, setUrlQuery] = useState(filters.q);
	if (filters.q !== urlQuery) {
		setUrlQuery(filters.q);
		if (filters.q !== query.trim()) setQuery(filters.q);
	}

	const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
		// A city only makes sense for lessons in person.
		const city = key === 'mode' && value === 'online' ? '' : filters.city;
		onChange({ ...filters, city, [key]: value });
	};
	const onQuery = (value: string) => {
		setQuery(value);
		if (debounce.current) clearTimeout(debounce.current);
		debounce.current = setTimeout(() => onChange({ ...filters, q: value.trim() }), 250);
	};
	const clearQuery = () => {
		if (debounce.current) clearTimeout(debounce.current);
		setQuery('');
		onChange({ ...filters, q: '' });
	};
	const reset = () => {
		if (debounce.current) clearTimeout(debounce.current);
		setQuery('');
		onChange({ ...EMPTY_FILTERS, sort: filters.sort });
	};

	type ChipKey = 'subject' | 'level' | 'mode' | 'city' | 'q';
	const chips: { key: ChipKey; label: string }[] = (
		[
			['subject', subjectName(filters.subject)],
			['level', levelName(filters.level)],
			['mode', modeName(filters.mode)],
			['city', filters.city],
			['q', `“${filters.q}”`]
		] as [ChipKey, string][]
	)
		.filter(([key]) => filters[key])
		.map(([key, label]) => ({ key, label }));

	const controls = (id: string, stacked: boolean) => (
		<div className={stacked ? 'flex flex-col gap-4' : 'grid grid-cols-2 gap-3 lg:grid-cols-6'}>
			<div>
				<Label htmlFor={`${id}-subject`} className={smallLabel}>Materia</Label>
				<Select id={`${id}-subject`} className={field} value={filters.subject} onChange={(e) => set('subject', e.target.value)}>
					<option value="">Tutte le materie</option>
					<optgroup label="Scuola">{school.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
					<optgroup label="Università">{university.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
				</Select>
			</div>
			<div>
				<Label htmlFor={`${id}-level`} className={smallLabel}>Livello</Label>
				<Select id={`${id}-level`} className={field} value={filters.level} onChange={(e) => set('level', e.target.value)}>
					<option value="">Tutti i livelli</option>
					{TUTOR_LEVELS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
				</Select>
			</div>
			<fieldset className={stacked ? '' : 'col-span-2'}>
				<legend className={smallLabel}>Modalità</legend>
				<ToggleGroup label="Modalità" options={[{ value: '', label: 'Tutte' }, ...TUTOR_MODES.map((m) => ({ value: m.id, label: m.name }))]} value={filters.mode} onChange={(mode) => set('mode', mode)} />
			</fieldset>
			<div>
				<Label htmlFor={`${id}-city`} className={smallLabel}>Città</Label>
				<Select id={`${id}-city`} className={field} value={filters.city} disabled={cities.length === 0 || filters.mode === 'online'} onChange={(e) => set('city', e.target.value)}>
					<option value="">Tutte le città</option>
					{cities.map((c) => <option key={c} value={c}>{c}</option>)}
				</Select>
			</div>
			<div>
				<Label htmlFor={`${id}-sort`} className={smallLabel}>Ordina per</Label>
				<Select id={`${id}-sort`} className={field} value={filters.sort} onChange={(e) => set('sort', e.target.value as Filters['sort'])}>
					{SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
				</Select>
			</div>
		</div>
	);

	return (
		<>
			<section className="space-y-3 rounded-2xl border border-edge bg-surface/80 p-3 backdrop-blur-sm sm:space-y-4 sm:p-5" aria-label="Cerca e filtra i tutor">
				<div className="flex gap-2">
					<div className="relative flex-1">
						<label htmlFor="tutor-search" className="sr-only">Cerca un tutor</label>
						<Search className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-fg-faint" aria-hidden="true" />
						<input id="tutor-search" type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Nome, materia o città" autoComplete="off" className="h-12 w-full rounded-xl border border-edge bg-surface pl-11 pr-10 text-fg outline-none transition placeholder:text-fg-faint focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/30" />
						{query && (
							<button type="button" onClick={clearQuery} className="absolute right-1 top-1/2 flex size-[40px] -translate-y-1/2 items-center justify-center rounded-md text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg" aria-label="Cancella la ricerca">
								<X className="size-4" aria-hidden="true" />
							</button>
						)}
					</div>
					{/* Phones: the controls live in a sheet. */}
					<button type="button" onClick={() => setSheetOpen(true)} className={cn('relative inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-colors focus-ring md:hidden', active > 0 ? 'border-accent-edge bg-accent-soft text-accent-soft-fg' : 'border-edge bg-surface text-fg active:bg-surface-3')} aria-haspopup="dialog" aria-expanded={sheetOpen}>
						<SlidersHorizontal className="size-5" aria-hidden="true" />
						Filtri
						{active > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white" aria-label={`${active} filtri attivi`}>{active}</span>}
					</button>
				</div>
				<div className="hidden md:block">{controls('filter', false)}</div>
				<div className="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
					<span className="mr-1 inline-flex items-center gap-1.5 font-medium text-fg-muted">
						<SlidersHorizontal className="hidden size-4 text-fg-faint md:block" aria-hidden="true" />
						{resultCount} tutor
						{active > 0 && <span className="font-normal text-fg-subtle">con i filtri scelti</span>}
					</span>
					{chips.map((chip) => (
						<button key={chip.key} type="button" onClick={() => (chip.key === 'q' ? clearQuery() : set(chip.key, ''))} className="inline-flex min-h-[36px] items-center gap-1 whitespace-nowrap rounded-full border border-accent-edge bg-accent-soft px-3 py-1 text-accent-soft-fg transition-colors hover:bg-crimson-100 dark:hover:bg-crimson-900/50" aria-label={`Rimuovi il filtro ${chip.label}`}>
							{chip.label}
							<X className="size-3.5" aria-hidden="true" />
						</button>
					))}
					{active > 0 && (
						<button type="button" onClick={reset} className="ml-auto min-h-[36px] text-fg-muted underline-offset-2 transition-colors hover:text-accent-fg hover:underline">
							Azzera filtri
						</button>
					)}
				</div>
			</section>
			<Sheet
				open={sheetOpen}
				onClose={() => setSheetOpen(false)}
				title="Filtra i tutor"
				bodyClass="px-4 py-2"
				footer={
					<div className="flex items-center gap-3">
						<Button variant="ghost" size="lg" onClick={reset} disabled={active === 0}>Azzera</Button>
						<Button size="lg" className="flex-1" onClick={() => setSheetOpen(false)}>Mostra {resultCount} tutor</Button>
					</div>
				}
			>
				{controls('sheet-filter', true)}
			</Sheet>
		</>
	);
}
