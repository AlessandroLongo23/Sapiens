'use client';

import { AndamentoPeriodico } from './chim3-D-andamenti';

/** Lesson 59 (Raggio atomico ed energia di ionizzazione): the two properties along a period or down a group. */
export default function RaggioIonizzazioneAndamenti({ alt }: { alt?: string }) {
	return <AndamentoPeriodico props={['raggio', 'ionizzazione']} alt={alt} />;
}
