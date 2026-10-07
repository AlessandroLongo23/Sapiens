'use client';

import { letturaRighe } from '@/lib/informatica/file-righe';
import { Celle, ComandiPassi, Figura, Frase, Legenda, Variabili, usePassi } from '../informatica';

/**
 * "Che cosa finisce in `riga` a ogni giro, e da dove riparte la lettura al giro dopo?" The file `voti.txt` of
 * lesson 79, one cell per character with the line break drawn: a placeholder says where the next reading starts, each
 * step reads up to the next line break, and the text read becomes a number that is added to the sum. The last cell,
 * empty and dashed, is the end of the file: when the placeholder is there the loop ends.
 */
const NOME = 'voti.txt';
const { passi: LISTA } = letturaRighe('8\n10\n6\n7\n');
const FRASI = LISTA.map((p) => p.frase);
// the widest row of variables, to keep the height while they change from step to step
const LARGHE = LISTA.reduce((a, b) => (b.variabili.length > a.variabili.length ? b : a)).variabili;

export default function LetturaRighe({ alt }: { alt?: string }) {
	const passi = usePassi(LISTA.length, { ritmo: 2600 });
	const passo = LISTA[passi.passo];
	return (
		<Figura>
			<div className="flex w-full flex-col items-center gap-3">
				<span className="rounded-md border border-edge bg-surface-2 px-2 py-0.5 font-mono text-xs text-fg-muted">{NOME}</span>
				<Celle celle={passo.celle} puntatori={passo.puntatori} passi={LISTA} indici={false} unite max={40} label={alt ?? `Il file ${NOME}, un carattere per casella`} />
				<Legenda stati={{ ordinata: 'già letto', esame: 'la riga letta ora', scartata: 'fine del file' }} />
			</div>
			<div className="grid w-full justify-items-center">
				<div aria-hidden="true" className="invisible col-start-1 row-start-1">
					<Variabili variabili={LARGHE} />
				</div>
				<div className="col-start-1 row-start-1">
					<Variabili variabili={passo.variabili} label="Le variabili del programma" />
				</div>
			</div>
			<Frase tutte={FRASI}>{passo.frase}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}
