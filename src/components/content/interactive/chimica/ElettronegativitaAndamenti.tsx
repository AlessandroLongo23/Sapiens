'use client';

import { AndamentoPeriodico } from './chim3-D-andamenti';

/** Lesson 60 (Affinità elettronica ed elettronegatività): the two properties along a period or down a group. */
export default function ElettronegativitaAndamenti({ alt }: { alt?: string }) {
	return <AndamentoPeriodico props={['elettronegativita', 'affinita']} alt={alt} />;
}
