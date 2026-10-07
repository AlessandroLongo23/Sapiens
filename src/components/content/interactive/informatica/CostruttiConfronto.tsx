'use client';

import { Fragment, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Caption } from '../kit';
import { Figura } from '../informatica';

/**
 * "Che cosa cambia tra il costrutto che conosco in Python e in C++ e lo stesso costrutto in JavaScript?" The student
 * picks a construct and reads the same fragment in the three languages, side by side; in the JavaScript one the
 * words that are new are marked, and a sentence says what to look at.
 */

interface Costrutto {
	id: string;
	nome: string;
	python: string;
	cpp: string;
	javascript: string;
	/** The words of the JavaScript fragment that the other two languages do not have. */
	nuove: string[];
	frase: string;
}

const COSTRUTTI: Costrutto[] = [
	{
		id: 'variabile',
		nome: 'variabile',
		python: 'posti = 120\nvenduti = 87\nvenduti = venduti + 1',
		cpp: 'const int POSTI = 120;\nint venduti = 87;\nvenduti = venduti + 1;',
		javascript: 'const posti = 120;\nlet venduti = 87;\nvenduti = venduti + 1;',
		nuove: ['const', 'let'],
		frase: 'Una variabile si dichiara con let, un valore che non cambia con const. Il tipo non si scrive, come in Python; il punto e virgola c’è, come nel C++.'
	},
	{
		id: 'leggere',
		nome: 'leggere e scrivere',
		python: 'n = int(input())\nprint("Biglietti:", n)',
		cpp: 'int n;\ncin >> n;\ncout << "Biglietti: " << n;',
		javascript: 'const n = Number(prompt());\nconsole.log("Biglietti:", n);',
		nuove: ['Number', 'prompt', 'console.log'],
		frase: 'Per leggere c’è prompt(), che restituisce un testo come input(): Number() lo trasforma in un numero. Per scrivere c’è console.log(), che separa i valori con uno spazio.'
	},
	{
		id: 'confronti',
		nome: 'confronti',
		python: 'if n == 5 and not pieno:\n    print("ultimo")',
		cpp: 'if (n == 5 && !pieno) {\n    cout << "ultimo";\n}',
		javascript: 'if (n === 5 && !pieno) {\n    console.log("ultimo");\n}',
		nuove: ['==='],
		frase: 'Uguale e diverso si scrivono === e !==, con un segno in più. Per «e», «o», «non» ci sono &&, || e il punto esclamativo, come nel C++.'
	},
	{
		id: 'selezione',
		nome: 'selezione',
		python: 'if liberi == 0:\n    print("esaurito")\nelse:\n    print("aperto")',
		cpp: 'if (liberi == 0) {\n    cout << "esaurito";\n} else {\n    cout << "aperto";\n}',
		javascript: 'if (liberi === 0) {\n    console.log("esaurito");\n} else {\n    console.log("aperto");\n}',
		nuove: ['==='],
		frase: 'La selezione è quella del C++: condizione tra parentesi tonde, blocchi tra graffe. Cambia il confronto di uguaglianza, che ha tre segni.'
	},
	{
		id: 'while',
		nome: 'while',
		python: 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1',
		cpp: 'int n = 3;\nwhile (n > 0) {\n    cout << n << endl;\n    n = n - 1;\n}',
		javascript: 'let n = 3;\nwhile (n > 0) {\n    console.log(n);\n    n = n - 1;\n}',
		nuove: ['let'],
		frase: 'Il ciclo while è identico a quello del C++. Cambia solo la dichiarazione della variabile, con let.'
	},
	{
		id: 'for',
		nome: 'for',
		python: 'for i in range(1, 5):\n    print(i)',
		cpp: 'for (int i = 1; i <= 4; i++) {\n    cout << i << endl;\n}',
		javascript: 'for (let i = 1; i <= 4; i++) {\n    console.log(i);\n}',
		nuove: ['let'],
		frase: 'Il for ha le tre parti di quello del C++, cioè partenza, condizione e passo, con let al posto di int.'
	},
	{
		id: 'funzione',
		nome: 'funzione',
		python: 'def costo(n):\n    return 8 * n\n\nprint(costo(3))',
		cpp: 'int costo(int n) {\n    return 8 * n;\n}\n\ncout << costo(3);',
		javascript: 'function costo(n) {\n    return 8 * n;\n}\n\nconsole.log(costo(3));',
		nuove: ['function'],
		frase: 'Una funzione si definisce con la parola function, senza il tipo dei parametri né quello del valore di ritorno. Il return e la chiamata sono quelli che conosci.'
	},
	{
		id: 'vettore',
		nome: 'vettore',
		python: 'v = [4, 7, 9]\nprint(v[0])\nprint(len(v))',
		cpp: 'const int N = 3;\nint v[N] = {4, 7, 9};\ncout << v[0] << endl;\ncout << N << endl;',
		javascript: 'const v = [4, 7, 9];\nconsole.log(v[0]);\nconsole.log(v.length);',
		nuove: ['length'],
		frase: 'Un vettore si scrive tra parentesi quadre, come una lista di Python, e gli indici partono da 0. Quanti elementi ha lo dice lui: v.length.'
	}
];

const RIGHE = Math.max(...COSTRUTTI.flatMap((c) => [c.python, c.cpp, c.javascript].map((t) => t.split('\n').length)));

/** The fragment with the new words marked: the text is split at each of them. */
function Segnato({ testo, parole }: { testo: string; parole: string[] }) {
	if (!parole.length) return <>{testo}</>;
	const escaped = parole.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	// `===` has no letters at its ends, the other words must not be a part of a longer name
	const pattern = new RegExp(`(${escaped.map((p) => (/^\w/.test(p) ? `\\b${p}\\b` : p)).join('|')})`, 'g');
	return (
		<>
			{testo.split(pattern).map((pezzo, i) =>
				parole.includes(pezzo) ? (
					<mark key={i} className="rounded-[3px] bg-tint-soft px-0.5 font-semibold text-tint-fg">
						{pezzo}
					</mark>
				) : (
					<Fragment key={i}>{pezzo}</Fragment>
				)
			)}
		</>
	);
}

function Riquadro({ linguaggio, testo, parole, acceso = false }: { linguaggio: string; testo: string; parole?: string[]; acceso?: boolean }) {
	return (
		<div role="group" aria-label={`In ${linguaggio}`} className={cn('min-w-0 overflow-hidden rounded-xl border bg-surface shadow-paper', acceso ? 'border-tint-edge' : 'border-edge')}>
			<div className={cn('label-mono border-b px-3 py-1.5', acceso ? 'border-tint-edge bg-tint-soft text-tint-fg' : 'border-edge bg-surface-2 text-fg-subtle')}>{linguaggio}</div>
			<div className="overflow-x-auto px-3 py-2.5 font-mono text-xs [font-variant-ligatures:none] leading-[1.6] whitespace-pre text-fg-strong" style={{ minHeight: `calc(${RIGHE} * 1.6em + 1.25rem)` }}>
				{parole ? <Segnato testo={testo} parole={parole} /> : testo}
			</div>
		</div>
	);
}

export default function CostruttiConfronto() {
	const [scelto, setScelto] = useState('for');
	const costrutto = COSTRUTTI.find((c) => c.id === scelto) ?? COSTRUTTI[0];
	return (
		<Figura>
			<div role="group" aria-label="Il costrutto da confrontare" className="flex max-w-xl flex-wrap justify-center gap-1.5">
				{COSTRUTTI.map((c) => (
					<button
						key={c.id}
						type="button"
						aria-pressed={c.id === costrutto.id}
						onClick={() => setScelto(c.id)}
						className={cn(
							'min-h-9 cursor-pointer rounded-full border px-3.5 text-sm transition-colors focus-ring',
							c.id === costrutto.id ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft font-semibold text-fg-strong' : 'border-edge-strong bg-surface text-fg hover:border-tint-edge'
						)}
					>
						{c.nome}
					</button>
				))}
			</div>
			<div className="grid w-full max-w-3xl gap-3 md:grid-cols-3">
				<Riquadro linguaggio="Python" testo={costrutto.python} />
				<Riquadro linguaggio="C++" testo={costrutto.cpp} />
				<Riquadro linguaggio="JavaScript" testo={costrutto.javascript} parole={costrutto.nuove} acceso />
			</div>
			<div className="grid w-full justify-items-center">
				{/* the longest sentence, unseen, keeps the height of the figure the same for every construct */}
				<p aria-hidden="true" className="invisible col-start-1 row-start-1 m-0 max-w-xl text-center text-sm">
					{COSTRUTTI.reduce((a, c) => (c.frase.length > a.length ? c.frase : a), '')}
				</p>
				<div className="col-start-1 row-start-1 flex justify-center">
					<Caption>{costrutto.frase}</Caption>
				</div>
			</div>
		</Figura>
	);
}
