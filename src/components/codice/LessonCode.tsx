'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import type { CodeBlock, Language } from '@/lib/codice/blocco';
import { LANGUAGES } from './runtime';
import { SavedPrograms, type Program } from './SavedPrograms';
import { WebBench } from './WebBench';
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
 * "Salva" in a lesson: what the student wrote goes among their programs (SavedPrograms.tsx), to be opened again in
 * the editor of the tools. Nothing is loaded here: the block is the lesson's.
 */
function Save({ program }: { program: () => Program }) {
	const [saved, setSaved] = useState<{ id: string; title: string } | null>(null);
	return <SavedPrograms label="Salva" current={saved} dirty program={program} onSaved={({ id, title }) => setSaved({ id, title })} onGone={() => setSaved(null)} />;
}

/**
 * A program in a lesson (a ```codice block, lib/codice/blocco.ts): the editor with the program, and a tab for each
 * language it is written in. Choosing a language chooses it for every program on the page, and for the next visit.
 * A web page has its three files and what the page looks like.
 */
export function LessonCode({ block }: { block: CodeBlock }) {
	return block.page ? <LessonPage page={block.page} /> : <LessonProgram block={block} />;
}

function LessonPage({ page }: { page: NonNullable<CodeBlock['page']> }) {
	const now = useRef(page.files);
	return (
		<WebBench
			compact
			initial={page.files}
			solution={page.solution}
			checks={page.checks.length ? page.checks : undefined}
			onEdit={(files) => (now.current = files)}
			toolbar={<Save program={() => ({ language: 'web', files: now.current })} />}
		/>
	);
}

function LessonProgram({ block }: { block: CodeBlock }) {
	const subscribe = useCallback((notify: () => void) => {
		window.addEventListener(EVENT, notify);
		return () => window.removeEventListener(EVENT, notify);
	}, []);
	const chosen = useSyncExternalStore(subscribe, readLanguage, () => null);
	const variant = block.variants.find((v) => v.language === chosen) ?? block.variants[0];
	/** What is written now, by language: the tab of another language starts from its own program. */
	const now = useRef<Record<string, string>>({});
	const { language } = variant;

	return (
		<Workbench
			key={variant.language}
			compact
			language={variant.language}
			initial={variant.code}
			solution={variant.solution}
			tests={block.tests.length ? block.tests : undefined}
			onEdit={(code) => (now.current[language] = code)}
			toolbar={
				<>
					{block.variants.length > 1 ? (
						<ToggleGroup compact label="Linguaggio" value={language} onChange={saveLanguage} options={block.variants.map((v) => ({ value: v.language, label: LANGUAGES[v.language] }))} />
					) : (
						<span className="label-mono px-1 text-fg-subtle">{LANGUAGES[language]}</span>
					)}
					<Save program={() => ({ language, files: { main: now.current[language] ?? variant.code } })} />
				</>
			}
		/>
	);
}
