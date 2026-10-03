'use client';

import { useState } from 'react';
import { Select } from '@/components/ui/Field';
import { EXAMPLES } from './examples';
import { LANGUAGES, type Language } from './runtime';
import { Workbench } from './Workbench';

/** The trial page's editor: a language, one of its example programs, and the workbench on it. */
export function Playground() {
	const [language, setLanguage] = useState<Language>('python');
	const [example, setExample] = useState(0);
	const examples = EXAMPLES[language];

	return (
		<Workbench
			key={`${language}:${example}`}
			language={language}
			initial={examples[example].code}
			toolbar={
				<>
					<div className="w-28">
						<Select
							aria-label="Linguaggio"
							value={language}
							onChange={(e) => {
								setLanguage(e.target.value as Language);
								setExample(0);
							}}
							className="py-1.5 text-sm"
						>
							{(Object.keys(LANGUAGES) as Language[]).map((id) => (
								<option key={id} value={id}>
									{LANGUAGES[id]}
								</option>
							))}
						</Select>
					</div>
					<div className="w-56 max-w-full">
						<Select aria-label="Esempio" value={example} onChange={(e) => setExample(Number(e.target.value))} className="py-1.5 text-sm">
							{examples.map(({ title }, i) => (
								<option key={title} value={i}>
									{title}
								</option>
							))}
						</Select>
					</div>
				</>
			}
		/>
	);
}
