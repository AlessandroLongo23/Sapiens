'use client';

import type { Orbital } from '@/lib/orbitali/idrogeno';
import { OrbitalFigure, type OrbitalPreset } from '@/components/orbitali/OrbitalFigure';

/**
 * The figures of the lesson "Orbitali e numeri quantici" (docs/lezioni/chimica, file 52): each is the orbital figure
 * with the parameters its paragraph needs. The lesson goes from a map of probability to the nodes, to the shapes they
 * give, to the quantum numbers that count them. The last figure of the lesson, with every choice open, is
 * OrbitalExplorer in components/orbitali/OrbitalViewer.tsx.
 */

const real = (n: number, l: number, m: number): Orbital => ({ n, l, m, kind: 'reale' });
const turning = (n: number, l: number, m: number): Orbital => ({ n, l, m, kind: 'complesso' });
type Alt = { alt?: string };

/** "L'orbitale è una mappa di probabilità": the ground state as dots in a plane through the nucleus. */
export function Mappa1s({ alt }: Alt) {
	const presets: OrbitalPreset[] = [{ label: '1s', orbital: real(1, 0, 0), note: 'L’orbitale 1s in un piano che passa per il nucleo. I puntini sono fitti vicino al nucleo e si diradano allontanandosi, senza un bordo netto.' }];
	return <OrbitalFigure presets={presets} view="sezione" plane="xy" alt={alt} />;
}

/** "I nodi radiali": one more spherical node at each level. */
export function NodiRadiali({ alt }: Alt) {
	const presets: OrbitalPreset[] = [
		{ label: '1s', orbital: real(1, 0, 0), note: '1s: nessun nodo, una sola nuvola attorno al nucleo.' },
		{ label: '2s', orbital: real(2, 0, 0), note: '2s: un nodo a forma di sfera, qui il cerchio tratteggiato, separa due gusci. Sul nodo non c’è nessun puntino.' },
		{ label: '3s', orbital: real(3, 0, 0), note: '3s: due nodi sferici e tre gusci. A ogni nodo la funzione d’onda cambia segno, e il colore con lei.' }
	];
	return <OrbitalFigure presets={presets} view="sezione" plane="xz" nodes alt={alt} />;
}

/** "Un nodo può essere un piano": the same level, the node turned from a sphere into a plane. */
export function NodoAngolare({ alt }: Alt) {
	const presets: OrbitalPreset[] = [
		{ label: '2s', orbital: real(2, 0, 0), note: '2s: il nodo è una sfera attorno al nucleo, e l’orbitale è uguale in tutte le direzioni.' },
		{ label: '2p', orbital: real(2, 1, 0), note: '2p: il nodo è un piano che passa per il nucleo, qui la linea orizzontale. La nuvola è divisa in due lobi, uno sopra e uno sotto.' }
	];
	return <OrbitalFigure presets={presets} view="sezione" plane="xz" nodes alt={alt} />;
}

/** "Tre orbitali p": the same shape along the three axes. */
export function TreOrbitaliP({ alt }: Alt) {
	const presets: OrbitalPreset[] = [
		{ label: 'x', orbital: real(2, 1, 1), note: 'I due lobi sono lungo l’asse x. Trascina la figura per girarla.' },
		{ label: 'y', orbital: real(2, 1, -1), note: 'I due lobi sono lungo l’asse y: la stessa forma, girata di un quarto di giro attorno all’asse verticale.' },
		{ label: 'z', orbital: real(2, 1, 0), note: 'I due lobi sono lungo l’asse z, quello verticale.' }
	];
	return <OrbitalFigure presets={presets} view="3d" nodes="scelta" alt={alt} />;
}

/** "Gli orbitali d": two angular nodes, five orbitals. */
export function CinqueOrbitaliD({ alt }: Alt) {
	const presets: OrbitalPreset[] = [
		{ label: 'xy', orbital: real(3, 2, -2), note: 'Quattro lobi nel piano xy, tra gli assi. I due nodi sono i piani xz e yz.' },
		{ label: 'xz', orbital: real(3, 2, 1), note: 'Quattro lobi nel piano xz, tra gli assi.' },
		{ label: 'yz', orbital: real(3, 2, -1), note: 'Quattro lobi nel piano yz, tra gli assi.' },
		{ label: 'x²−y²', orbital: real(3, 2, 2), note: 'Quattro lobi nel piano xy, questa volta lungo gli assi x e y.' },
		{ label: 'z²', orbital: real(3, 2, 0), note: 'Due lobi lungo l’asse z e un anello attorno. I due nodi sono due coni, non due piani.' }
	];
	return <OrbitalFigure presets={presets} view="3d" nodes="scelta" alt={alt} />;
}

/** "Più energia, più spazio": the s orbitals of four levels on one scale, opened to see the shells. */
export function LivelliStessaScala({ alt }: Alt) {
	const presets: OrbitalPreset[] = [
		{ label: '1s', orbital: real(1, 0, 0), note: '1s: l’elettrone si trova in media a 79 pm dal nucleo.' },
		{ label: '2s', orbital: real(2, 0, 0), note: '2s: in media a 318 pm dal nucleo, quattro volte più lontano.' },
		{ label: '3s', orbital: real(3, 0, 0), note: '3s: in media a 714 pm dal nucleo.' },
		{ label: '4s', orbital: real(4, 0, 0), note: '4s: in media a 1270 pm dal nucleo, sedici volte la distanza dell’1s.' }
	];
	return <OrbitalFigure presets={presets} view="3d" cut sameScale alt={alt} />;
}

/** "Gli orbitali in moto": the three states of 2p with a definite m. */
export function OrbitaliInMoto({ alt }: Alt) {
	const presets: OrbitalPreset[] = [
		{ label: 'm = +1', orbital: turning(2, 1, 1), note: 'm = +1: i puntini girano attorno all’asse z in senso antiorario, visti dall’alto, più svelti vicino all’asse.' },
		{ label: 'm = 0', orbital: turning(2, 1, 0), note: 'm = 0: i puntini stanno fermi. È l’orbitale 2p_z dei libri.' },
		{ label: 'm = −1', orbital: turning(2, 1, -1), note: 'm = −1: la stessa ciambella, con i puntini che girano nel verso opposto.' }
	];
	return <OrbitalFigure presets={presets} view="3d" alt={alt} />;
}
