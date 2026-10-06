import { Html } from '@/components/ui/Html';
import type { SceneProps } from '.';

/**
 * The Cartesian plane of the maths exercises (src/lib/exercises/v2/piano.ts): curves drawn from their formulas, with
 * the window, the axes, dashed lines for the asymptotes and marked points.
 *
 *   { type: 'piano-cartesiano', data: { finestra: [-4, 4, -2, 6], curve: [{ formula: 'y=3^x' }],
 *       punti: [{ x: 0, y: 1 }, { x: 1, y: 3 }] } }
 *
 * Unlike the other scenes it is not drawn here: the server reads the formulas and puts the finished SVG in
 * `data.svg` (`drawnScene`, src/lib/exercises/v2/piano-svg.ts), so the page carries neither the reader of LaTeX
 * nor the sampling of the curves. A scene that did not pass from there shows its description.
 */
export default function PianoCartesiano({ data, alt }: SceneProps) {
	if (typeof data.svg !== 'string') return <p className="text-sm text-fg-muted">{alt}</p>;
	return <Html html={data.svg} className="flex max-w-full justify-center" />;
}
