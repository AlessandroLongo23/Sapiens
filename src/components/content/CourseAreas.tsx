'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { binderLabelClass, binderRowClass, binderTabClass } from '@/components/ui/binder-tabs';
import { cn } from '@/lib/utils/cn';

export interface CourseArea {
	/** The area's tone (see `data-subject` in globals.css), which is also its key. */
	tone: string;
	label: string;
	count: number;
}

const ALL = 'tutti';

/**
 * The courses of the university, filtered by area: the title and a binder tab per area
 * on one line (as the years of a high-school subject), and under them the cards. Every
 * card is in the HTML, the others hidden, so search engines still read them. The chosen
 * area is kept in the address (`#area-math`), so a link can open it.
 */
export function CourseAreas({ id, title, areas, courses }: { id: string; title: string; areas: CourseArea[]; courses: { area: string; card: ReactNode }[] }) {
	const keys = [ALL, ...areas.map((a) => a.tone)];
	const [current, setCurrent] = useState(ALL);
	const tabs = useRef<(HTMLButtonElement | null)[]>([]);

	useEffect(() => {
		const fromHash = () => {
			const area = /^#area-([a-z]+)$/.exec(window.location.hash)?.[1];
			if (area && keys.includes(area)) setCurrent(area);
		};
		fromHash();
		window.addEventListener('hashchange', fromHash);
		return () => window.removeEventListener('hashchange', fromHash);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [areas]);

	const choose = (area: string, focus = false) => {
		setCurrent(area);
		history.replaceState(null, '', area === ALL ? window.location.pathname : `#area-${area}`);
		if (focus) tabs.current[keys.indexOf(area)]?.focus();
	};

	// Arrow keys, Home and End move between the tabs, as in any tab list.
	const onKeyDown = (e: KeyboardEvent) => {
		const i = keys.indexOf(current);
		const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: keys.length - 1 }[e.key];
		if (next === undefined) return;
		e.preventDefault();
		choose(keys[(next + keys.length) % keys.length], true);
	};

	const tab = (key: string, label: string, count: number, i: number) => {
		const active = key === current;
		return (
			<button
				key={key}
				ref={(el) => {
					tabs.current[i] = el;
				}}
				type="button"
				role="tab"
				aria-selected={active}
				aria-controls={`${id}-panel`}
				tabIndex={active ? 0 : -1}
				onClick={() => choose(key)}
				data-subject={key === ALL ? undefined : key}
				className={binderTabClass(active, 'items-center')}
			>
				{key !== ALL && <span className="size-2.5 shrink-0 rounded-[3px] bg-tint-cover" aria-hidden="true" />}
				<span className={binderLabelClass(active)}>{label}</span>
				<span className="label-mono hidden text-fg-subtle sm:inline">{count}</span>
			</button>
		);
	};

	return (
		<section className="animate-fade-in" aria-labelledby={id}>
			<div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-edge-strong">
				<h2 id={id} className="pb-3 text-3xl font-semibold text-fg-strong app:max-md:text-2xl">
					{title}
				</h2>
				<div role="tablist" aria-label="Area" className={cn(binderRowClass, 'no-scrollbar max-w-full overflow-x-auto')} onKeyDown={onKeyDown}>
					{tab(ALL, 'Tutti', courses.length, 0)}
					{areas.map((a, i) => tab(a.tone, a.label, a.count, i + 1))}
				</div>
			</div>
			<div id={`${id}-panel`} role="tabpanel" className="grid grid-cols-1 gap-5 pt-6 md:grid-cols-2 lg:grid-cols-3">
				{courses.map(({ area, card }, i) => (
					<div key={i} hidden={current !== ALL && current !== area}>
						{card}
					</div>
				))}
			</div>
		</section>
	);
}
