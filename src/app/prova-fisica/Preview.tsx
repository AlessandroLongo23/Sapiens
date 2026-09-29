'use client';

import 'katex/dist/katex.min.css';
import { createElement, useEffect, useState, type ComponentType } from 'react';
import { FIGURES } from '@/lib/utils/interactive';
import { SceneFigure } from '@/components/content/exercises/scenes';
import type { SceneRef } from '@/lib/exercises/v2/types';

export function Preview({ figure, scene }: { figure?: string; scene?: SceneRef }) {
	const [Figure, setFigure] = useState<ComponentType<{ alt?: string }> | null>(null);
	const [error, setError] = useState('');
	const missing = figure && !FIGURES[figure] ? `nessuna figura "${figure}" in FIGURES` : '';
	useEffect(() => {
		const load = figure ? FIGURES[figure] : undefined;
		load?.().then((m) => setFigure(() => m.default), (e: Error) => setError(e.message));
	}, [figure]);
	if (missing || error) return <p id="errore">{missing || error}</p>;
	if (scene) return <SceneFigure scene={scene} />;
	return Figure ? <figure className="interactive-figure my-6 flex justify-center" data-pronta="1">{createElement(Figure, { alt: figure })}</figure> : null;
}
