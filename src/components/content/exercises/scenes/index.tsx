'use client';

import type { ComponentType } from 'react';
import type { SceneRef } from '@/lib/exercises/v2/types';
import BloccoForze from './BloccoForze';
import Righello from './Righello';
import CilindroGraduato from './CilindroGraduato';
import Calibro from './Calibro';
import VettoriPiano from './VettoriPiano';
import Bersaglio from './Bersaglio';
import GraficoDati from './GraficoDati';
import Dinamometro from './Dinamometro';
import MollaRighello from './MollaRighello';
import PuntoForze from './PuntoForze';
import RaggioDueMezzi from './RaggioDueMezzi';
import LenteOggetto from './LenteOggetto';
import AstaForze from './AstaForze';
import TorchioIdraulico from './TorchioIdraulico';
import RecipienteLiquido from './RecipienteLiquido';
import TuboAU from './TuboAU';
import FiliCorpo from './FiliCorpo';
import PianoInclinato from './PianoInclinato';
import DinamometriArchimede from './DinamometriArchimede';
import GalleggianteQuote from './GalleggianteQuote';
import RaggiSpecchi from './RaggiSpecchi';
import LastraConduzione from './LastraConduzione';
import CurvaRiscaldamento from './CurvaRiscaldamento';
import PistaEnergia from './PistaEnergia';
import StradaPosizioni from './StradaPosizioni';
import GraficoVelocitaTempo from './GraficoVelocitaTempo';
import CassaFune from './CassaFune';
import FiumeBarca from './FiumeBarca';
import CorpiCollegati from './CorpiCollegati';
import LancioOrizzontale from './LancioOrizzontale';
import CurvaTemperaturaTempo from './CurvaTemperaturaTempo';
import Cromatogramma from './Cromatogramma';
import ManometroAperto from './ManometroAperto';
import ParticelleRiquadri from './ParticelleRiquadri';
import PianoCartesiano from './PianoCartesiano';
import LancioObliquo from './LancioObliquo';
import GraficoForzaSpostamento from './GraficoForzaSpostamento';
import GraficoSpezzata from './GraficoSpezzata';
import MasseAsse from './MasseAsse';
import RotolamentoPiano from './RotolamentoPiano';
import ParticellaPolo from './ParticellaPolo';
import OrbitaEllisse from './OrbitaEllisse';
import ElongazionePianeta from './ElongazionePianeta';
import OrbitaPerielioAfelio from './OrbitaPerielioAfelio';
import MasseAllineate from './MasseAllineate';
import OrbitaPianeta from './OrbitaPianeta';
import TuboSezioni from './TuboSezioni';
import SerbatoioForo from './SerbatoioForo';
import CilindroPistone from './CilindroPistone';
import MolecoleVelocita from './MolecoleVelocita';
import PianoPV from './PianoPV';
import CurvePV from './CurvePV';
import MacchinaTermica from './MacchinaTermica';
import CicloCarnotPV from './CicloCarnotPV';
import SorgentiFlussi from './SorgentiFlussi';
import ScatolaMolecole from './ScatolaMolecole';

/**
 * The drawings of the exercises that change with the numbers (a block on an incline at the exercise's angle): each
 * `SceneRef.type` has a component here that draws `data` with the kit of the interactive figures
 * (src/components/content/interactive/kit.tsx and fisica.tsx), still. They render on the server with the page, so
 * the printable sheet has them too. One file per type in this folder, registered below.
 */
export type SceneProps = { data: Record<string, unknown>; alt: string };

const SCENES: Record<string, ComponentType<SceneProps>> = {
	'blocco-forze': BloccoForze,
	// Physics, first year: quantities and units (group 1).
	'righello': Righello,
	'cilindro-graduato': CilindroGraduato,
	'calibro': Calibro,
	// Physics, first year: errors and uncertainty (group 2).
	'bersaglio': Bersaglio,
	// Physics, first year: graphs (group 3).
	'grafico-dati': GraficoDati,
	// Physics, first year: vectors (group 4).
	'vettori-piano': VettoriPiano,
	// Physics, first year: forces (group 5).
	'dinamometro': Dinamometro,
	'molla-righello': MollaRighello,
	'punto-forze': PuntoForze,
	// Physics, first year: equilibrium of a point (group 6).
	'fili-corpo': FiliCorpo,
	'piano-inclinato': PianoInclinato,
	// Physics, first year: rigid bodies and levers (group 7).
	'asta-forze': AstaForze,
	// Physics, first year: pressure, Pascal and Stevin (group 8).
	'torchio-idraulico': TorchioIdraulico,
	'recipiente-liquido': RecipienteLiquido,
	'tubo-a-u': TuboAU,
	// Physics, first year: atmosphere and Archimedes (group 9).
	'dinamometri-archimede': DinamometriArchimede,
	'galleggiante-quote': GalleggianteQuote,
	// Physics, first year: rays and mirrors (group 10).
	'raggi-specchi': RaggiSpecchi,
	// Physics, first year: refraction and lenses (group 11).
	'raggio-due-mezzi': RaggioDueMezzi,
	'lente-oggetto': LenteOggetto,
	// Physics, second year: kinematics 1 (group 12).
	'strada-posizioni': StradaPosizioni,
	// Physics, second year: kinematics 2 (group 13).
	'grafico-velocita-tempo': GraficoVelocitaTempo,
	// Physics, second year: motion in a plane (group 14).
	'fiume-barca': FiumeBarca,
	// Physics, second year: laws of motion (group 15).
	// Physics, second year: forces and motion (group 16).
	'corpi-collegati': CorpiCollegati,
	'lancio-orizzontale': LancioOrizzontale,
	// Physics, second year: work and power (group 17).
	'cassa-fune': CassaFune,
	// Physics, second year: energy (group 18).
	'pista-energia': PistaEnergia,
	// Physics, second year: temperature (group 19).
	// Physics, second year: heat (group 20).
	'lastra-conduzione': LastraConduzione,
	'curva-riscaldamento': CurvaRiscaldamento,
	// Physics, third year: vector products, projectile, variable force (group 30).
	'lancio-obliquo': LancioObliquo,
	'grafico-forza-spostamento': GraficoForzaSpostamento,
	// Physics, third year: frames of reference (group 31).
	// Physics, third year: conservative forces, momentum, impulse (group 32).
	'grafico-spezzata': GraficoSpezzata,
	// Physics, third year: collisions and centre of mass (group 33).
	// Physics, third year: rotation, kinematics and dynamics (group 34).
	'masse-asse': MasseAsse,
	// Physics, third year: rotational energy and angular momentum (group 35).
	'rotolamento-piano': RotolamentoPiano,
	'particella-polo': ParticellaPolo,
	'orbita-ellisse': OrbitaEllisse,
	// Physics, third year: cosmological systems, Kepler, universal gravitation (group 36).
	'elongazione-pianeta': ElongazionePianeta,
	'orbita-perielio-afelio': OrbitaPerielioAfelio,
	'masse-allineate': MasseAllineate,
	// Physics, third year: gravitational field, satellites, energy (group 37).
	'orbita-pianeta': OrbitaPianeta,
	// Physics, third year: fluid dynamics (group 38).
	'tubo-sezioni': TuboSezioni,
	'serbatoio-foro': SerbatoioForo,
	// Physics, third year: gas laws (group 39).
	'cilindro-pistone': CilindroPistone,
	// Physics, third year: kinetic theory and internal energy (group 40).
	'molecole-velocita': MolecoleVelocita,
	// Physics, third year: work, first law, transformations (group 41).
	'piano-pv': PianoPV,
	// Physics, third year: molar heats and adiabatic (group 42).
	'curve-pv': CurvePV,
	// Physics, third year: heat engines and Carnot (group 43).
	'macchina-termica': MacchinaTermica,
	'ciclo-carnot': CicloCarnotPV,
	// Physics, third year: refrigerators and entropy (group 44).
	'sorgenti-calore': SorgentiFlussi,
	'scatola-molecole': ScatolaMolecole,
	// Chemistry, first two years: measurements (group 21).
	// Chemistry, first two years: matter 1 (group 22).
	'particelle-riquadri': ParticelleRiquadri,
	// Chemistry, first two years: matter 2 (group 23).
	'curva-temperatura-tempo': CurvaTemperaturaTempo,
	'cromatogramma': Cromatogramma,
	// Chemistry, first two years: chemical changes 1 (group 24).
	// Chemistry, first two years: chemical changes 2 (group 25).
	// Chemistry, first two years: gases (group 26).
	'manometro-aperto': ManometroAperto,
	// Chemistry, first two years: the mole (group 27).
	// Chemistry, first two years: the atom (group 28).
	// Chemistry, first two years: water (group 29).
	// Maths: the Cartesian plane, also as an option of a multiple choice (src/lib/exercises/v2/piano.ts).
	'piano-cartesiano': PianoCartesiano,
};

export function SceneFigure({ scene, className }: { scene: SceneRef; className?: string }) {
	const Scene = SCENES[scene.type];
	if (!Scene) return <p className="sr-only">{scene.alt}</p>;
	return (
		<figure className={`scene-figure m-0 flex justify-center ${className ?? ''}`}>
			<Scene data={scene.data} alt={scene.alt} />
		</figure>
	);
}
