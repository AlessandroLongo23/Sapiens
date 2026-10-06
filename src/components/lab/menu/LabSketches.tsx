import type { ReactNode } from 'react';

/*
 * Pencil sketches for the labs and experiments that have no photo yet: line drawings in a
 * 160 × 120 box, strokes in the current colour.
 */

const SKETCHES: Record<string, ReactNode> = {
	// labs
	chimica: (
		<>
			<path d="M70 18V44L50 78H98L78 44V18" strokeWidth={2} />
			<path d="M66 18H82M56 68H92" />
			<path d="M44 82H104M52 82L46 108M96 82L102 108" />
			<path d="M64 108H84M70 108V96H78V108" />
			<path d="M74 94C70 90 72 86 74 84C76 86 78 90 74 94Z" />
		</>
	),
	fisica: (
		<>
			<path d="M22 100H140L22 44Z" strokeWidth={2} />
			<g transform="rotate(25.3 70 70)">
				<rect x="56" y="54" width="30" height="14" rx="2" />
				<circle cx="62" cy="71" r="3.5" />
				<circle cx="80" cy="71" r="3.5" />
			</g>
			<path d="M112 100A28 28 0 0 0 115 87" />
		</>
	),
	elettronica: (
		<>
			<path d="M30 30H72M88 30H130V90H30V30" strokeWidth={2} />
			<path d="M72 22V38M80 26V34" strokeWidth={2} />
			<path d="M30 48V52l-6 3 12 5 -12 5 12 5 -6 3V76" />
			<circle cx="130" cy="60" r="9" />
			<path d="M124 54L136 66M136 54L124 66" />
		</>
	),
	// experiments
	'saggi-alla-fiamma': (
		<>
			<path d="M70 108H90M76 108V70H84V108" strokeWidth={2} />
			<path d="M80 66C66 54 72 38 80 22C88 38 94 54 80 66Z" strokeWidth={2} />
			<path d="M80 58C74 52 76 44 80 36C84 44 86 52 80 58Z" />
			<path d="M128 26L96 46" />
			<circle cx="93" cy="48" r="3" />
		</>
	),
	titolazione: (
		<>
			<path d="M76 8H84V70L81 78H79L76 70Z" strokeWidth={2} />
			<path d="M76 20H80M76 30H80M76 40H80M76 50H80" />
			<path d="M80 84V88" strokeDasharray="1 3" />
			<path d="M72 92L58 112H102L88 92V88H72Z" strokeWidth={2} />
			<path d="M63 106H97" />
			<path d="M84 60H112V14H120" />
		</>
	),
	'pila-daniell': (
		<>
			<path d="M24 56V104H70V56M90 56V104H136V56" strokeWidth={2} />
			<path d="M26 74H68M92 74H134" />
			<path d="M50 60V40M110 60V40" strokeWidth={2.5} />
			<path d="M60 64V50H100V64" strokeWidth={4} opacity={0.5} />
			<path d="M50 40V24H70M90 24H110V40" />
			<rect x="70" y="16" width="20" height="14" rx="3" />
			<path d="M76 26L84 20" />
		</>
	),
	libero: (
		<>
			<path d="M28 104H50L46 70V62H32V70Z" />
			<path d="M60 104H92L80 80V56H72V80Z" strokeWidth={2} />
			<path d="M104 104V64M116 104V64M104 64H116" />
			<path d="M126 104C126 90 146 90 146 104Z" />
			<path d="M88 30l4 -8 4 8 -4 8Z" />
			<path d="M114 38l3 -6 3 6 -3 6Z" />
			<path d="M60 36l2 -4 2 4 -2 4Z" />
		</>
	)
};

export function Sketch({ id, className = 'h-full w-auto' }: { id: string; className?: string }) {
	const s = SKETCHES[id];
	if (!s) return null;
	return (
		<svg viewBox="0 0 160 120" className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			{s}
		</svg>
	);
}
