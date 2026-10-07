'use client';

import { useId, useState, type ReactNode } from 'react';
import { FileText, Folder, Image as Picture } from 'lucide-react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { cartellaDi, cartelle, dallaRadice, nomeDi, relativo, risolvi, type Esito } from '@/lib/informatica/percorsi-sito';
import { Figura, Frase, Legenda } from '../informatica';
import { Titolino } from './listato';

/**
 * "Che cosa cambia in un percorso relativo quando cambia la pagina in cui è scritto, e che cosa non cambia mai in
 * un indirizzo assoluto?" The folders of the band's site. The student picks the page the link is written in and the
 * file it must reach: the figure writes the relative path, lights the folders it goes through, and writes under it
 * the path from the root of the site and the whole address, which stay the same from every page. The relative path
 * is a field: a path typed there is followed on the tree, and a broken one says where it stops.
 *
 * The paths are src/lib/informatica/percorsi-sito.ts, pure functions with their tests.
 */
const SITO = ['index.html', 'contatti.html', 'concerti/date.html', 'concerti/natale/scaletta.html', 'img/logo.png', 'img/palco.jpg'];
const DOMINIO = 'https://www.fuoritempo.example';
const CARTELLE = cartelle(SITO);
const pagina = (file: string) => file.endsWith('.html');
/** A folder as a sentence names it. */
const detta = (cartella: string) => (cartella ? nomeDi(cartella) : 'la radice del sito');
const dentroA = (cartella: string) => (cartella ? `in ${nomeDi(cartella)}` : 'nella radice del sito');

/** What a path does, one move after the other, and where it ends. */
function racconta(da: string, esito: Esito): string {
	if (esito.tipo === 'vuoto') return 'Il campo è vuoto: scrivi un percorso, oppure tocca un file nell’albero.';
	if (esito.tipo === 'esterno') return 'Un indirizzo che comincia con il protocollo è assoluto: dice da solo dove andare, quindi porta nello stesso posto da qualunque pagina. Serve per i file che stanno su un altro sito.';
	const pezzi: string[] = [];
	for (const mossa of esito.mosse) {
		if (mossa.tipo === 'parti') pezzi.push(mossa.in ? `Parto da ${nomeDi(mossa.in)}, la cartella in cui sta ${nomeDi(da)}.` : `Parto dalla radice del sito, dove sta ${nomeDi(da)}.`);
		else if (mossa.tipo === 'radice') pezzi.push('La barra all’inizio mi porta nella radice del sito, da qualunque pagina parta.');
		else if (mossa.tipo === 'su') pezzi.push(`Con .. salgo ${dentroA(mossa.in)}.`);
		else if (mossa.tipo === 'giu') pezzi.push(`Entro in ${mossa.pezzo}.`);
		else pezzi.push(`Lì trovo ${mossa.pezzo}.`);
	}
	if (esito.tipo === 'manca') pezzi.push(`Qui cerco ${esito.manca}, ma ${dentroA(esito.in)} non c’è niente con questo nome: il link è rotto.`);
	if (esito.tipo === 'fuori') pezzi.push('Un altro .. non ha dove salire: sopra la radice del sito non c’è niente. Il link è rotto.');
	if (esito.tipo === 'cartella') pezzi.push(`Il percorso si ferma su ${detta(esito.percorso)}, che è una cartella: manca il nome del file.`);
	return pezzi.join(' ');
}

const TUTTE = [
	...SITO.filter(pagina).flatMap((da) => SITO.flatMap((a) => [racconta(da, risolvi(SITO, da, relativo(da, a))), racconta(da, risolvi(SITO, da, dallaRadice(a)))])),
	racconta('index.html', { tipo: 'esterno' }),
	racconta('concerti/natale/scaletta.html', risolvi(SITO, 'concerti/natale/scaletta.html', '../../concerti/natale/img/logo.png'))
];

const ARANCIONE = 'border-[oklch(0.64_var(--chroma)_var(--hue))]';
const PARTENZA = `${ARANCIONE} bg-[oklch(0.75_var(--chroma)_var(--hue))] text-ink-950`;
const ARRIVO = 'border-ok-fg bg-ok-fg text-surface';
const PASSATA = `${ARANCIONE} bg-tint-soft text-fg-strong`;
const FERMA = 'border-edge-strong bg-surface text-fg-strong shadow-paper';

type Scelgo = 'partenza' | 'arrivo';

export default function PercorsiSito({ alt }: { alt?: string }) {
	const campo = useId();
	const [da, setDa] = useState('concerti/date.html');
	const [scritto, setScritto] = useState(relativo('concerti/date.html', 'img/logo.png'));
	const [scelgo, setScelgo] = useState<Scelgo>('arrivo');
	const esito = risolvi(SITO, da, scritto);
	const arrivo = esito.tipo === 'file' ? esito.percorso : null;
	/** The folders the path goes through, the one it starts from included. */
	const passate = new Set('mosse' in esito ? esito.mosse.filter((m) => m.tipo !== 'file').map((m) => m.in) : []);
	const rotto = esito.tipo === 'manca' || esito.tipo === 'fuori' || esito.tipo === 'cartella';

	const tocca = (file: string) => {
		if (scelgo === 'arrivo') return setScritto(relativo(da, file));
		// the same file is reached from the new page: the relative path is written again
		setDa(file);
		if (arrivo) setScritto(relativo(file, arrivo));
	};

	const riga = (segno: ReactNode, nome: string, classi: string, nota?: string) => (
		<span className={cn('inline-flex h-7 items-center gap-1.5 rounded-md border-[1.5px] px-2 font-mono text-[12.5px] font-semibold motion-safe:transition-colors motion-safe:duration-150', classi)}>
			{segno}
			{nome}
			{nota && <span className="font-sans text-[11px] font-normal opacity-80">{nota}</span>}
		</span>
	);

	/** A folder with what it holds: its folders first, then its files, as the site lists them. */
	const cartella = (percorso: string): ReactNode => {
		const sotto = CARTELLE.filter((c) => cartellaDi(c) === percorso);
		const suoi = SITO.filter((f) => cartellaDi(f) === percorso);
		return (
			<div key={percorso || '/'} role="listitem" className="flex flex-col gap-1">
				<div data-cartella={percorso || '/'} data-passata={passate.has(percorso) || undefined}>
					{riga(<Folder className="size-3.5 shrink-0" aria-hidden="true" />, percorso ? `${nomeDi(percorso)}/` : '/', cn('rounded-lg', passate.has(percorso) ? PASSATA : 'border-edge bg-surface-2 text-fg'), percorso ? undefined : 'la radice del sito')}
				</div>
				<div role="list" className="ml-3 flex flex-col gap-1 border-l-[1.5px] border-edge-strong pl-3">
					{suoi.map((file) => {
						const parto = file === da;
						const arrivoQui = file === arrivo;
						const fermo = scelgo === 'partenza' && !pagina(file);
						const Segno = pagina(file) ? FileText : Picture;
						return (
							<div key={file} role="listitem">
								<button
									type="button"
									onClick={fermo ? undefined : () => tocca(file)}
									aria-disabled={fermo || undefined}
									aria-label={`${file}${parto ? ', la pagina di partenza' : ''}${arrivoQui ? ', il file di arrivo' : ''}${fermo ? ': un’immagine non contiene link, non può essere la partenza' : ''}`}
									data-file={file}
									data-ruolo={parto && arrivoQui ? 'entrambi' : parto ? 'partenza' : arrivoQui ? 'arrivo' : undefined}
									className="cursor-pointer rounded-md border-0 bg-transparent p-0 focus-ring aria-disabled:cursor-default aria-disabled:opacity-50"
								>
									{riga(<Segno className="size-3.5 shrink-0" aria-hidden="true" />, nomeDi(file), arrivoQui && !parto ? ARRIVO : parto ? PARTENZA : cn(FERMA, !fermo && 'hover:border-tint'), parto && arrivoQui ? 'partenza e arrivo' : parto ? 'partenza' : arrivoQui ? 'arrivo' : undefined)}
								</button>
							</div>
						);
					})}
					{sotto.map(cartella)}
				</div>
			</div>
		);
	};

	const valore = (testo: string | null, righe = 1) => <dd style={{ minHeight: righe * 18 }} className="m-0 min-w-0 font-mono leading-[18px] text-[12.5px] font-medium break-all text-fg-strong">{testo ?? <span className="font-sans font-normal text-fg-faint">nessun file</span>}</dd>;

	return (
		<Figura>
			<ToggleGroup
				label="Con un tocco sull’albero scelgo"
				compact
				value={scelgo}
				onChange={setScelgo}
				options={[
					{ value: 'partenza', label: 'La partenza' },
					{ value: 'arrivo', label: 'L’arrivo' }
				]}
			/>
			<div className="grid w-full max-w-2xl items-start gap-x-8 gap-y-4 sm:grid-cols-[auto_1fr]" role="group" aria-label={alt ?? 'Le cartelle di un sito e il percorso da una pagina a un file'}>
				<section className="flex min-w-0 flex-col gap-1.5">
					<Titolino>Il sito</Titolino>
					<div role="list" data-sito>
						{cartella('')}
					</div>
				</section>
				<section className="flex min-w-0 flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<label htmlFor={campo} className="label-mono text-fg-subtle">
							Percorso relativo, scritto in {nomeDi(da)}
						</label>
						<input
							id={campo}
							value={scritto}
							onChange={(e) => setScritto(e.target.value)}
							spellCheck={false}
							autoCapitalize="none"
							autoCorrect="off"
							aria-invalid={rotto || undefined}
							data-percorso
							className={cn('min-h-9 w-full min-w-0 rounded-lg border bg-surface px-2.5 font-mono text-sm text-fg-strong shadow-paper transition outline-none focus:ring-3', rotto ? 'border-danger focus:ring-danger/20' : 'border-edge-strong focus:border-[oklch(0.64_var(--chroma)_var(--hue))] focus:ring-tint/20')}
						/>
					</div>
					<dl className="m-0 grid grid-cols-1 gap-x-3 gap-y-1 text-xs text-fg-muted" data-indirizzi>
						<dt className="label-mono m-0 text-fg-subtle">Dalla radice del sito</dt>
						{valore(arrivo && dallaRadice(arrivo))}
						<dt className="label-mono m-0 mt-1.5 text-fg-subtle">Indirizzo assoluto</dt>
						{valore(arrivo && `${DOMINIO}${dallaRadice(arrivo)}`, 2)}
					</dl>
				</section>
			</div>
			<Legenda stati={{ scambio: 'pagina di partenza', esame: 'cartelle attraversate', trovata: 'file di arrivo' }} />
			<Frase tutte={TUTTE}>{racconta(da, esito)}</Frase>
		</Figura>
	);
}
