'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import type { CodeBlock, Language } from '@/lib/codice/blocco';
import { LANGUAGES } from './runtime';
import { Workbench } from './Workbench';

/** The language chosen on this device: every program of every lesson opens in it, when it is written in it. */
const KEY = 'sapiens:linguaggio';
const EVENT = 'sapiens:linguaggio';

function readLanguage(): string | null {
	try {
		return localStorage.getItem(KEY);
	} catch {
		return null;
	}
}

function saveLanguage(language: Language) {
	try {
		localStorage.setItem(KEY, language);
	} catch {
		// not remembered, still used on this page
	}
	window.dispatchEvent(new Event(EVENT));
}

/**
 * A program in a lesson (a ```codice block, lib/codice/blocco.ts): the editor with the program, and a tab for each
 * language it is written in. Choosing a language chooses it for every program on the page, and for the next visit.
 */
export function LessonCode({ block }: { block: CodeBlock }) {
	const subscribe = useCallback((notify: () => void) => {
		window.addEventListener(EVENT, notify);
		return () => window.removeEventListener(EVENT, notify);
	}, []);
	const chosen = useSyncExternalStore(subscribe, readLanguage, () => null);
	const variant = block.variants.find((v) => v.language === chosen) ?? block.variants[0];

	return (
		<Workbench
			key={variant.language}
			compact
			language={variant.language}
			initial={variant.code}
			solution={variant.solution}
			tests={block.tests.length ? block.tests : undefined}
			toolbar={
				block.variants.length > 1 ? (
					<ToggleGroup compact label="Linguaggio" value={variant.language} onChange={saveLanguage} options={block.variants.map((v) => ({ value: v.language, label: LANGUAGES[v.language] }))} />
				) : undefined
			}
		/>
	);
}
