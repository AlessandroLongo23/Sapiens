'use client';

import dynamic from 'next/dynamic';
import { useRef, useSyncExternalStore } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import type { BuildResponse, BuildView } from '@/lib/server/exercises';
import { onCodeLanguage, readCodeLanguage, saveCodeLanguage, type CodeLanguage } from '@/lib/codice/linguaggio';

// The chart and the editor are their own chunks: only a question that asks for one loads it.
const ChartBuilder = dynamic(() => import('@/components/diagramma/LessonChart').then((m) => m.ChartBuilder), { ssr: false, loading: () => <p className="p-4 text-sm text-fg-subtle">Carico il diagramma…</p> });
const Workbench = dynamic(() => import('@/components/codice/Workbench').then((m) => m.Workbench), { ssr: false, loading: () => <p className="p-4 text-sm text-fg-subtle">Carico l&apos;editor…</p> });

const LANGUAGES: { value: CodeLanguage; label: string }[] = [
	{ value: 'python', label: 'Python' },
	{ value: 'cpp', label: 'C++' }
];

/** The language of the programs on the page: the one chosen in the lessons, changed here for every program shown. */
export function useCodeLanguage(): CodeLanguage {
	return useSyncExternalStore(onCodeLanguage, readCodeLanguage, () => 'python');
}

export function CodeLanguageToggle() {
	const language = useCodeLanguage();
	return <ToggleGroup compact label="Linguaggio dei programmi" value={language} onChange={saveCodeLanguage} options={LANGUAGES} />;
}

/**
 * The answer to a question that asks to make something: a flowchart, built by carrying blocks, or a program,
 * written in the editor. It is handed in once, with "Consegna": the chart goes as the lines of its program, the
 * program with what it printed for each input of the question, and the server says whether it is right.
 */
export function BuildAnswer({ build, locked, onSubmit }: { build: BuildView; locked: boolean; onSubmit: (built: BuildResponse) => void }) {
	const language = useCodeLanguage();
	const chart = useRef('');

	if (build.kind === 'chart')
		return (
			<div className="flex w-full flex-col gap-3 text-left" data-build="chart">
				<ChartBuilder start={build.start} code={build.code} onProgram={(text) => (chart.current = text)} />
				<Button onClick={() => onSubmit({ chart: chart.current })} disabled={locked} className="self-center">
					<Check className="size-4" aria-hidden="true" />
					Consegna il diagramma
				</Button>
			</div>
		);

	return (
		<div className="w-full overflow-hidden rounded-xl border border-edge text-left" data-build="program">
			<Workbench
				key={language}
				compact
				language={language}
				initial={build.start[language]}
				toolbar={<CodeLanguageToggle />}
				hand={{ inputs: build.inputs, locked, onHand: (outputs, source) => onSubmit({ language, code: source, outputs }) }}
			/>
		</div>
	);
}
