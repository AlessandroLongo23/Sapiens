'use client';

import { useMemo } from 'react';
import { ALTEZZA, LARGHEZZA, TAGLIO, differenza, filmato, scritti } from '@/lib/informatica/fotogrammi';
import { ComandiPassi, Contatori, Figura, Frase, usePassi } from '../informatica';
import { GrigliaPixel } from './multimedia';

/**
 * "Quanti pixel cambiano davvero da un fotogramma al successivo?" Ten frames of 16 × 9 pixels: on the left the
 * frame as it is seen, on the right only the pixels that are not those of the frame before, which is all a file
 * needs to write. The first frame and the one after the cut have to be written in full.
 */
const PIXEL = LARGHEZZA * ALTEZZA;
/** A pixel that is the same as in the frame before: nothing to write. */
const UGUALE = '#b9b9b9';

export default function VideoFotogrammiDifferenza({ alt }: { alt?: string }) {
	const { fotogrammi, cambi, totali, frasi } = useMemo(() => {
		const fotogrammi = filmato();
		const cambi = fotogrammi.map((f, i) => differenza(i ? fotogrammi[i - 1] : null, f));
		const totali = scritti(fotogrammi);
		const ultimo = fotogrammi.length - 1;
		const frasi = cambi.map(({ quanti }, i) => {
			if (i === 0) return `Il primo fotogramma non ha un precedente con cui confrontarsi: va scritto per intero, tutti i ${PIXEL} pixel. È un fotogramma chiave.`;
			if (i === TAGLIO) return `Cambio di scena: nessun pixel è rimasto com'era, ${quanti} su ${PIXEL}. Le differenze qui non fanno risparmiare niente, e si scrive un nuovo fotogramma chiave.`;
			if (i === ultimo) return `In ${fotogrammi.length} fotogrammi ho scritto ${totali[i]} pixel. Scrivendoli tutti per intero sarebbero stati ${fotogrammi.length} · ${PIXEL} = ${fotogrammi.length * PIXEL}: più di quattro volte tanto.`;
			if (i < TAGLIO) return `La palla si è spostata: cambiano ${quanti} pixel su ${PIXEL}, i 4 che ha lasciato e i 4 in cui è entrata. Il cielo, il prato e il sole sono quelli di prima e non si riscrivono.`;
			return `L'automobile avanza di un pixel: ne cambiano solo ${quanti}, uno dietro e uno davanti. Meno movimento c'è, meno c'è da scrivere.`;
		});
		return { fotogrammi, cambi, totali, frasi };
	}, []);
	const passi = usePassi(fotogrammi.length, { ritmo: 1300 });
	const i = passi.passo;
	const intero = fotogrammi[i];
	const diverso = useMemo(() => intero.map((riga, r) => riga.map((colore, c) => (cambi[i].cambiato[r][c] ? colore : UGUALE))), [intero, cambi, i]);
	const chiave = i === 0 || i === TAGLIO;

	return (
		<Figura>
			<div className="grid w-full max-w-xl grid-cols-2 gap-3 sm:gap-5">
				<figure className="m-0 flex flex-col items-center gap-1.5">
					<GrigliaPixel pixel={intero} lato={272} label={alt ?? `Il fotogramma ${i + 1} di ${fotogrammi.length}, di ${LARGHEZZA} per ${ALTEZZA} pixel`} />
					<figcaption className="label-mono text-center text-fg-subtle">Fotogramma {i + 1}</figcaption>
				</figure>
				<figure className="m-0 flex flex-col items-center gap-1.5">
					<GrigliaPixel pixel={diverso} lato={272} label={`I pixel del fotogramma ${i + 1} diversi dal precedente: ${cambi[i].quanti} su ${PIXEL}. Gli altri sono in grigio`} />
					<figcaption className="label-mono text-center text-fg-subtle">{chiave ? 'Da scrivere: tutto' : 'Da scrivere'}</figcaption>
				</figure>
			</div>
			<Frase tutte={frasi}>{frasi[i]}</Frase>
			<Contatori voci={{ 'pixel cambiati': `${cambi[i].quanti} su ${PIXEL}`, 'scritti finora': `${totali[i]} su ${(i + 1) * PIXEL}` }} />
			<ComandiPassi passi={passi} />
		</Figura>
	);
}
