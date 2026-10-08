'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * A question of the landing page: a row that opens on its answer. The answer's height is
 * animated through its grid row, as elsewhere on the site; closed, it is inert. Without
 * scripting every answer is open (`.lp-faq-answer` in landing.css).
 */
export function FaqRow({ index, question, answer }: { index: number; question: string; answer: string }) {
	const [open, setOpen] = useState(false);
	const id = useId();
	return (
		<div>
			<h3>
				<button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className="flex w-full cursor-pointer items-center gap-3 py-4 text-left focus-ring sm:gap-4 sm:py-5">
					<span className="font-mono text-xs text-fg-faint tabular-nums">{String(index + 1).padStart(2, '0')}</span>
					<span className="flex-1 font-display text-lg font-medium leading-snug text-fg-strong sm:text-xl">{question}</span>
					<ChevronDown className={cn('size-5 shrink-0 text-fg-subtle transition-transform duration-300 ease-out-soft motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
				</button>
			</h3>
			<div id={id} inert={!open} className={cn('lp-faq-answer grid transition-[grid-template-rows,opacity] duration-300 ease-out-soft motion-reduce:transition-none', open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
				<div className="overflow-hidden">
					<p className="pb-5 pl-8 pr-1 text-[0.9375rem] leading-relaxed text-fg-muted sm:pb-6 sm:pl-9 sm:pr-9 sm:text-base">{answer}</p>
				</div>
			</div>
		</div>
	);
}
