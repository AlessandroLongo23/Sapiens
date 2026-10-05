'use client';

import { useState } from 'react';
import { Html } from '@/components/ui/Html';
import { cn } from '@/lib/utils/cn';
import { Block, Solution } from '@/components/content/exercises/RunPlayer';
import { BuildAnswer, CodeLanguageToggle, useCodeLanguage } from '@/components/content/exercises/BuildAnswer';
import type { BuildResponse, ExerciseView, Verdict } from '@/lib/server/exercises';

/** One exercise by itself, as the trial page of development shows it: the question, its answers, the verdict. */
export function ExerciseProbe({ exercise, grade }: { exercise: ExerciseView; grade: (key: string, response: { choice?: number; built?: BuildResponse }) => Promise<Verdict> }) {
	const [verdict, setVerdict] = useState<Verdict | null>(null);
	const [chosen, setChosen] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const language = useCodeLanguage();
	const answer = async (response: { choice?: number; built?: BuildResponse }) => {
		setChosen(response.choice ?? -1);
		try {
			setVerdict(await grade(exercise.key, response));
		} catch (e) {
			setError(String(e));
		}
	};
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center" data-code-language={language} data-probe>
			{exercise.promptHtml && <Html html={exercise.promptHtml} className="text-xl font-medium text-fg-strong" />}
			<div className="flex w-full flex-col gap-4">
				{exercise.blocks.map((block, i) => (
					<Block key={i} block={block} />
				))}
			</div>
			<CodeLanguageToggle />
			{exercise.build ? (
				<BuildAnswer build={exercise.build} locked={verdict !== null} onSubmit={(built) => answer({ built })} />
			) : (
				<div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Risposte">
					{exercise.options.map((option, i) => (
						<button
							key={i}
							type="button"
							onClick={() => answer({ choice: i })}
							disabled={verdict !== null}
							aria-label={`Risposta ${i + 1}`}
							data-state={verdict ? (i === verdict.correctIndex ? 'correct' : i === chosen ? 'incorrect' : 'muted') : 'idle'}
							className={cn('min-w-0 rounded-xl border-2 border-edge-strong bg-surface p-3', verdict && i === verdict.correctIndex && 'border-ok bg-ok-soft', verdict && i === chosen && i !== verdict.correctIndex && 'border-danger bg-danger-soft')}
						>
							<Html html={option.html} className="math-content min-w-0 overflow-x-auto" />
						</button>
					))}
				</div>
			)}
			{error && <p className="text-danger-fg">{error}</p>}
			{verdict && (
				<p className={cn('text-lg font-semibold', verdict.correct ? 'text-ok-fg' : 'text-danger-fg')} role="status" data-verdict={verdict.correct ? 'correct' : 'incorrect'}>
					{verdict.correct ? 'Giusto.' : 'Sbagliato.'} {verdict.message}
				</p>
			)}
			{verdict && !verdict.correct && verdict.built && verdict.expectedHtml && <Html html={verdict.expectedHtml} className="w-full max-w-xl text-left" />}
			{verdict && !verdict.correct && <Solution verdict={verdict} />}
		</div>
	);
}
