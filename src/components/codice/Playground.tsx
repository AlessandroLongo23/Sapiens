'use client';

import { useRef, useState } from 'react';
import { Select } from '@/components/ui/Field';
import { PROGRAM_LANGUAGES, readProgramFiles, webAsProject, type ProgramFiles, type ProgramLanguage } from '@/lib/codice/salvati';
import { EXAMPLES, PROJECTS } from './examples';
import { ProjectBench } from './ProjectBench';
import { SavedPrograms, type Program } from './SavedPrograms';
import { Workbench } from './Workbench';

/** What the editor of the tool can hold: one file in a language, or a project. */
type Kind = Exclude<ProgramLanguage, 'web'>;
const KINDS: Kind[] = ['python', 'c', 'cpp', 'javascript', 'project'];

/** An example of a kind: its files, and for a project the file the editor opens. */
const example = (kind: Kind, index: number): { files: ProgramFiles; open?: string } => (kind === 'project' ? { files: PROJECTS[index].files, open: PROJECTS[index].open } : { files: { main: EXAMPLES[kind][index].code } });
const titles = (kind: Kind) => (kind === 'project' ? PROJECTS : EXAMPLES[kind]).map(({ title }) => title);

/**
 * The editor of the tool's page (/strumenti/editor-di-codice): one file in a language, with its example programs,
 * or a project of more files (ProjectBench.tsx), with its list of files and a few projects to start from. "I miei
 * programmi" saves what is written with a name and loads it back (SavedPrograms.tsx).
 */
export function Playground() {
	/** What the bench was made with; `count` makes a new bench when the same program is loaded again. */
	const [start, setStart] = useState<{ language: Kind; files: ProgramFiles; open?: string; count: number }>({ language: 'python', ...example('python', 0), count: 0 });
	const [chosen, setChosen] = useState(0);
	/** The saved program in the editor, with its files as they were saved. */
	const [saved, setSaved] = useState<{ id: string; title: string; files: string } | null>(null);
	const [dirty, setDirty] = useState(false);
	const now = useRef<ProgramFiles>(start.files);
	const { language } = start;

	const open = (program: { language: Kind; files: ProgramFiles; open?: string }, from: { id: string; title: string } | null) => {
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
						const next = e.target.value as Kind;
						setChosen(0);
						open({ language: next, ...example(next, 0) }, null);
					}}
					className="py-1.5 text-sm"
				>
					{KINDS.map((id) => (
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
						open({ language, ...example(language, index) }, null);
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
				program={(): Program => ({ language, files: now.current })}
				onSaved={(program) => {
					setSaved({ id: program.id, title: program.title, files: JSON.stringify(now.current) });
					setDirty(false);
				}}
				onLoad={(program) => {
					const files = readProgramFiles(program.language, program.files);
					if (!files) return;
					// a page saved before the projects opens as the project it is
					const loaded = program.language === 'web' ? { language: 'project' as const, files: webAsProject(files) } : { language: program.language, files };
					open(loaded, { id: program.id, title: program.title });
				}}
				onGone={() => setSaved(null)}
			/>
		</>
	);

	return language === 'project' ? (
		<ProjectBench key={start.count} initial={start.files} open={start.open ?? 'index.html'} layout="explorer" editable toolbar={toolbar} onEdit={edit} />
	) : (
		<Workbench key={start.count} language={language} initial={start.files.main} toolbar={toolbar} onEdit={(code) => edit({ main: code })} />
	);
}
