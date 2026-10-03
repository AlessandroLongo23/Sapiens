'use client';

import { useRef, useState } from 'react';
import { Select } from '@/components/ui/Field';
import type { Page } from '@/lib/codice/blocco';
import { PROGRAM_LANGUAGES, readProgramFiles, type ProgramFiles, type ProgramLanguage } from '@/lib/codice/salvati';
import { EXAMPLES, PAGES } from './examples';
import { SavedPrograms, type Program } from './SavedPrograms';
import { WebBench } from './WebBench';
import { Workbench } from './Workbench';

/** The first program of a language: its example of that number. */
const example = (language: ProgramLanguage, index: number): ProgramFiles => (language === 'web' ? PAGES[index].files : { main: EXAMPLES[language][index].code });
const titles = (language: ProgramLanguage) => (language === 'web' ? PAGES : EXAMPLES[language]).map(({ title }) => title);

/**
 * The editor of the tool's page (/strumenti/editor-di-codice): a language (or a web page), one of its examples, and
 * the bench on it. "I miei programmi" saves what is written with a name and loads it back (SavedPrograms.tsx).
 */
export function Playground() {
	/** What the bench was made with; `count` makes a new bench when the same program is loaded again. */
	const [start, setStart] = useState<Program & { count: number }>({ language: 'python', files: example('python', 0), count: 0 });
	const [chosen, setChosen] = useState(0);
	/** The saved program in the editor, with its files as they were saved. */
	const [saved, setSaved] = useState<{ id: string; title: string; files: string } | null>(null);
	const [dirty, setDirty] = useState(false);
	const now = useRef<ProgramFiles>(start.files);
	const { language } = start;

	const open = (program: Program, from: { id: string; title: string } | null) => {
		now.current = program.files;
		setStart(({ count }) => ({ ...program, count: count + 1 }));
		setSaved(from && { ...from, files: JSON.stringify(program.files) });
		setDirty(false);
	};
	const edit = (files: ProgramFiles) => {
		now.current = files;
		setDirty(saved !== null && JSON.stringify(files) !== saved.files);
	};

	const toolbar = (
		<>
			<div className="w-32">
				<Select
					aria-label="Linguaggio"
					value={language}
					onChange={(e) => {
						const next = e.target.value as ProgramLanguage;
						setChosen(0);
						open({ language: next, files: example(next, 0) }, null);
					}}
					className="py-1.5 text-sm"
				>
					{(Object.keys(PROGRAM_LANGUAGES) as ProgramLanguage[]).map((id) => (
						<option key={id} value={id}>
							{PROGRAM_LANGUAGES[id]}
						</option>
					))}
				</Select>
			</div>
			<div className="w-52 max-w-full">
				<Select
					aria-label="Esempio"
					value={saved ? '' : chosen}
					onChange={(e) => {
						const index = Number(e.target.value);
						setChosen(index);
						open({ language, files: example(language, index) }, null);
					}}
					className="py-1.5 text-sm"
				>
					{saved && <option value="">Esempi</option>}
					{titles(language).map((title, i) => (
						<option key={title} value={i}>
							{title}
						</option>
					))}
				</Select>
			</div>
			<SavedPrograms
				current={saved}
				dirty={dirty}
				program={() => ({ language, files: now.current })}
				onSaved={(program) => {
					setSaved({ id: program.id, title: program.title, files: JSON.stringify(now.current) });
					setDirty(false);
				}}
				onLoad={(program) => {
					const files = readProgramFiles(program.language, program.files);
					if (files) open({ language: program.language, files }, { id: program.id, title: program.title });
				}}
				onGone={() => setSaved(null)}
			/>
		</>
	);

	return language === 'web' ? (
		<WebBench key={start.count} initial={start.files as Page} toolbar={toolbar} onEdit={edit} />
	) : (
		<Workbench key={start.count} language={language} initial={start.files.main} toolbar={toolbar} onEdit={(code) => edit({ main: code })} />
	);
}
