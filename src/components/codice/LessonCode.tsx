'use client';

import { useCallback, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { MAIN, type CodeBlock, type Language, type ProjectBlock } from '@/lib/codice/blocco';
import { webAsProject } from '@/lib/codice/salvati';
import { ProjectBench } from './ProjectBench';
import { LANGUAGES } from './runtime';
import { SavedPrograms, type Program } from './SavedPrograms';
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
	// a page of three blocks is a project of three files under the names a page links them by
	const page = block.page;
	const project: ProjectBlock | undefined =
		block.project ??
		(page && {
			files: webAsProject(page.files),
			solution: page.solution && webAsProject(page.solution),
			open: 'index.html',
			create: false,
			tests: [],
			checks: page.checks
		});
	return project ? <LessonProject project={project} /> : <LessonProgram block={block} />;
}

function LessonProject({ project }: { project: ProjectBlock }) {
	const now = useRef(project.files);
	return (
		<ProjectBench
			compact
			layout={project.create ? 'explorer' : 'tabs'}
			editable={project.create}
			initial={project.files}
			open={project.open}
			solution={project.solution}
			tests={project.tests.length ? project.tests : undefined}
			checks={project.checks.length ? project.checks : undefined}
			onEdit={(files) => (now.current = files)}
			toolbar={<Save program={() => ({ language: 'project', files: now.current })} />}
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
	const languages =
		block.variants.length > 1 ? (
			<ToggleGroup compact label="Linguaggio" value={language} onChange={saveLanguage} options={block.variants.map((v) => ({ value: v.language, label: LANGUAGES[v.language] }))} />
		) : (
			<span className="label-mono px-1 text-fg-subtle">{LANGUAGES[language]}</span>
		);

	// with files of data beside it the program is a project: its own file, then the data, the same in every language
	if (block.data) return <LessonData key={language} language={language} code={variant.code} solution={variant.solution} data={block.data} tests={block.tests} toolbar={languages} />;

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
					{languages}
					<Save program={() => ({ language, files: { main: now.current[language] ?? variant.code } })} />
				</>
			}
		/>
	);
}

function LessonData({ language, code, solution, data, tests, toolbar }: { language: Language; code: string; solution: string | null; data: ProjectBlock['files']; tests: ProjectBlock['tests']; toolbar: ReactNode }) {
	const main = MAIN[language];
	const [files] = useState(() => ({ [main]: code, ...data }));
	const [solved] = useState(() => (solution === null ? null : { [main]: solution, ...data }));
	const now = useRef(files);
	return (
		<ProjectBench
			compact
			layout="tabs"
			initial={files}
			open={main}
			solution={solved}
			tests={tests.length ? tests : undefined}
			onEdit={(edited) => (now.current = edited)}
			toolbar={
				<>
					{toolbar}
					<Save program={() => ({ language: 'project', files: now.current })} />
				</>
			}
		/>
	);
}
