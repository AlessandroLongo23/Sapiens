'use client';

import { useMemo, useState, type KeyboardEvent } from 'react';
import { ArrowDownAZ, LayoutGrid, Palette, Search, X } from 'lucide-react';
import { STICKER_PACKS, STICKERS, stickerUrl, type StickerDef } from '@/lib/zaino/stickers';
import { Sheet } from '@/components/ui/Sheet';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { fieldClass } from '@/components/ui/Field';
import { cn } from '@/lib/utils/cn';
import './stickers.css';

type Order = 'album' | 'name' | 'colour';
const ORDERS = [
	{ value: 'album' as const, label: 'Album', icon: LayoutGrid },
	{ value: 'name' as const, label: 'A–Z', icon: ArrowDownAZ },
	{ value: 'colour' as const, label: 'Colore', icon: Palette }
];

/** On this device only: the stickers picked last and the order chosen, as conveniences that may be lost. */
const RECENT_KEY = 'zaino:adesivi-recenti';
const ORDER_KEY = 'zaino:adesivi-ordine';
const RECENT_MAX = 12;
function load<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}
function save(key: string, value: unknown) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}

const PACK_BY_ID = new Map(STICKER_PACKS.map((p) => [p.id, p]));
const groupOf = (d: StickerDef) => PACK_BY_ID.get(d.pack)?.group ?? 'Altri';
/** The album's headings, in the order their first pack comes in. */
const GROUPS = [...new Set(STICKER_PACKS.map((p) => p.group ?? 'Altri'))];

/** Lower case without accents, so "verità" is found by "verita". */
const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
/** What the search looks through for each sticker: its name, its words, its pack and its heading. */
const HAYSTACK = new Map(STICKERS.map((d) => [d.id, fold([d.name, ...(d.tags ?? []), PACK_BY_ID.get(d.pack)?.name ?? '', groupOf(d)].join(' '))]));
const matches = (d: StickerDef, words: string[]) => words.every((w) => HAYSTACK.get(d.id)!.includes(w));

const hue = (hex: string) => {
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
	const max = Math.max(r, g, b), min = Math.min(r, g, b), c = max - min;
	// Greys and near-blacks go last, darkest first.
	if (c < 0.12) return 400 + (1 - max) * 10;
	const h = max === r ? ((g - b) / c) % 6 : max === g ? (b - r) / c + 2 : (r - g) / c + 4;
	return (h * 60 + 360) % 360;
};
const byName = (a: StickerDef, b: StickerDef) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
const byColour = (a: StickerDef, b: StickerDef) => hue(a.accent) - hue(b.accent) || byName(a, b);

interface Section {
	key: string;
	/** The heading of the packs that start here, in the whole album. */
	lead?: string;
	title?: string;
	items: StickerDef[];
}
/** How many packs each heading has: a heading with one pack does not repeat it. */
const PACKS_IN = new Map(GROUPS.map((g) => [g, STICKER_PACKS.filter((p) => (p.group ?? 'Altri') === g).length]));

/**
 * The album: every sticker, free to use as many times as wanted (the beta has no rewards). Built for a catalog of
 * hundreds: a search over names and words, the headings of the packs as filters, an order to choose, and on top
 * the stickers of the page it was opened from and the ones used last on this device.
 */
export function StickerAlbum({
	open,
	onClose,
	onPick,
	page,
	description = 'Scegli un adesivo, poi attaccalo dove vuoi sul foglio.'
}: {
	open: boolean;
	onClose: () => void;
	onPick: (stickerId: string) => void;
	/** The page of the material it was opened on: its own stickers come first. */
	page?: string;
	description?: string;
}) {
	const [query, setQuery] = useState('');
	const [group, setGroup] = useState<string | null>(null);
	const [order, setOrder] = useState<Order>('album');
	const [recent, setRecent] = useState<string[]>([]);
	// Read on opening, not at mount: the album is on the page from the start, the storage only in the browser.
	const [wasOpen, setWasOpen] = useState(false);
	if (open !== wasOpen) {
		setWasOpen(open);
		if (open) {
			setQuery('');
			setRecent(load<string[]>(RECENT_KEY, []).filter((id) => STICKERS.some((d) => d.id === id)));
			const saved = load<Order>(ORDER_KEY, 'album');
			setOrder(ORDERS.some((o) => o.value === saved) ? saved : 'album');
		}
	}

	const words = useMemo(() => fold(query).split(/\s+/).filter(Boolean), [query]);
	const found = useMemo(() => STICKERS.filter((d) => matches(d, words)), [words]);
	const counts = useMemo(() => {
		const n = new Map<string, number>();
		for (const d of found) n.set(groupOf(d), (n.get(groupOf(d)) ?? 0) + 1);
		return n;
	}, [found]);

	const sections = useMemo<Section[]>(() => {
		const shown = group ? found.filter((d) => groupOf(d) === group) : found;
		if (words.length || order !== 'album') {
			const sorted = order === 'name' ? [...shown].sort(byName) : order === 'colour' ? [...shown].sort(byColour) : shown;
			return [{ key: 'flat', items: sorted }];
		}
		const out: Section[] = [];
		if (!group) {
			const own = page ? STICKERS.filter((d) => d.cover === page) : [];
			if (own.length) out.push({ key: 'page', title: 'Per questa pagina', items: own });
			const used = recent.map((id) => STICKERS.find((d) => d.id === id)!).filter(Boolean);
			if (used.length) out.push({ key: 'recent', title: 'Usati di recente', items: used });
		}
		let last: string | undefined;
		for (const pack of STICKER_PACKS) {
			const g = pack.group ?? 'Altri';
			if (group && g !== group) continue;
			const items = shown.filter((d) => d.pack === pack.id);
			if (!items.length) continue;
			const lead = !group && g !== last ? g : undefined;
			last = g;
			out.push({ key: pack.id, lead, title: PACKS_IN.get(g)! > 1 ? pack.name : undefined, items });
		}
		return out;
	}, [found, group, order, words.length, page, recent]);

	const pick = (id: string) => {
		const next = [id, ...recent.filter((r) => r !== id)].slice(0, RECENT_MAX);
		setRecent(next);
		save(RECENT_KEY, next);
		onPick(id);
	};
	const choose = (value: Order) => {
		setOrder(value);
		save(ORDER_KEY, value);
	};
	const first = sections[0]?.items[0];
	const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && words.length && first) pick(first.id);
		// The first Escape empties the field, the second closes the album.
		if (e.key === 'Escape' && query) {
			e.stopPropagation();
			e.nativeEvent.stopImmediatePropagation();
			setQuery('');
		}
	};
	const total = sections.reduce((n, s) => n + s.items.length, 0);

	const chip = (on: boolean) =>
		cn(
			'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-ring',
			on ? 'border-fg-strong bg-fg-strong text-surface' : 'border-edge bg-surface text-fg-muted hover:border-fg-faint hover:text-fg'
		);

	return (
		<Sheet open={open} onClose={onClose} title="Adesivi" description={description} size="full" width="lg">
			<div className="sticky top-0 z-10 -mx-5 space-y-3 bg-surface px-5 pb-3">
				<div className="flex items-center gap-2">
					<label className="relative min-w-0 flex-1">
						<span className="sr-only">Cerca un adesivo</span>
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-faint" aria-hidden="true" />
						<input
							type="search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={onSearchKey}
							placeholder={`Cerca tra ${STICKERS.length} adesivi`}
							enterKeyHint="search"
							autoComplete="off"
							className={cn(fieldClass, 'py-2 pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden')}
						/>
						{query && (
							<button type="button" onClick={() => setQuery('')} className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-fg-subtle hover:bg-surface-3 hover:text-fg focus-ring" aria-label="Svuota la ricerca">
								<X className="size-4" aria-hidden="true" />
							</button>
						)}
					</label>
					<ToggleGroup options={ORDERS} value={order} onChange={choose} label="Ordine" compact labelClass="max-sm:sr-only" />
				</div>
				<div className="-mx-5 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none]" role="group" aria-label="Sezioni">
					<button type="button" aria-pressed={group === null} onClick={() => setGroup(null)} className={chip(group === null)}>
						Tutti
					</button>
					{GROUPS.map((g) => (
						<button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(group === g ? null : g)} className={chip(group === g)}>
							{g}
							<span className={cn('tabular-nums text-xs', group === g ? 'opacity-70' : 'text-fg-faint')}>{counts.get(g) ?? 0}</span>
						</button>
					))}
				</div>
			</div>

			<div aria-live="polite" className="sr-only">
				{words.length ? (total === 1 ? '1 adesivo trovato' : `${total} adesivi trovati`) : ''}
			</div>
			{total === 0 ? (
				<p className="py-12 text-center text-sm text-fg-muted">
					Nessun adesivo per «{query.trim()}»{group ? ` in ${group}` : ''}.
					{group && (
						<>
							{' '}
							<button type="button" onClick={() => setGroup(null)} className="font-medium text-fg underline underline-offset-2 focus-ring">
								Cerca in tutti
							</button>
						</>
					)}
				</p>
			) : (
				<div className="space-y-6 pt-1">
					{sections.map((s) => (
						<section key={s.key} aria-label={s.title ?? s.lead ?? (words.length ? 'Risultati' : 'Adesivi')}>
							{s.lead && <h3 className={cn('text-base font-semibold text-fg-strong', s.title ? 'mb-3 pt-2' : 'mb-2.5 pt-2')}>{s.lead}</h3>}
							{s.title && <h4 className="label-mono mb-2.5 text-fg-subtle">{s.title}</h4>}
							<ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
								{s.items.map((d) => (
									<li key={d.id} className="sticker-cell">
										<button
											type="button"
											onClick={() => pick(d.id)}
											className="group flex w-full flex-col items-center gap-2 rounded-2xl bg-surface-2 px-2 pb-2.5 pt-3 transition duration-150 hover:bg-surface-3 active:scale-[0.97] focus-ring"
										>
											<StickerThumb d={d} />
											<span className="line-clamp-2 min-h-[2lh] text-center text-xs font-medium leading-snug text-fg-muted group-hover:text-fg">{d.name}</span>
										</button>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			)}
		</Sheet>
	);
}

/** The sticker small, tilted as if lying in the album; its file loads when it scrolls near. */
function StickerThumb({ d }: { d: StickerDef }) {
	const scale = Math.min(84 / d.w, 60 / d.h, 0.7);
	return (
		<span className="sticker-thumb transition-transform duration-150 group-hover:-translate-y-0.5" aria-hidden="true">
			<span style={{ width: d.w, height: d.h, ['--r' as string]: `${d.r}px`, transform: `translate(-50%, -50%) scale(${scale.toFixed(3)}) rotate(-4deg)` }}>
				<span className={cn('sticker-art', d.cut && 'is-cut')}>
					{/* A small SVG already sized: next/image would add nothing. */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={stickerUrl(d)} width={d.cut ? d.w : d.w - 8} height={d.cut ? d.h : d.h - 8} alt="" draggable={false} loading="lazy" decoding="async" />
				</span>
			</span>
		</span>
	);
}
