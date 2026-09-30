'use client';

import MontagneRusseEnergia from './MontagneRusseEnergia';

/** Lesson 64 (Forze dissipative e conservazione dell'energia totale): the roller coaster of lesson 63 with friction on. */
export default function MontagneRusseAttrito({ alt }: { alt?: string }) {
	return <MontagneRusseEnergia alt={alt} attritoIniziale />;
}
