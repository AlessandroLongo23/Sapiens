'use client';

import { useState } from 'react';
import { Esperimento } from '@/components/lab/Esperimento';
import { sessionModel, type Experiment, type Session } from '@/lib/lab/catalog';
import { Lobby } from './Lobby';

/** A session from the menu: a class room waits in the lobby first; alone, the lab's title screen is the way in. */
export function LabSession({ session, title, lab, experiment }: { session: Session; title: string; lab: string; experiment: Experiment }) {
	const [started, setStarted] = useState(session.mode === 'solo');
	if (!started && session.mode === 'classe') return <Lobby settings={session} title={title} lab={lab} onStart={() => setStarted(true)} />;
	return <Esperimento model={sessionModel(session)} quality={session.quality} subtitle={title} experiment={experiment.slug} kit={experiment.kit} />;
}
