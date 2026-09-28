'use client';

import { VennConfronto, type Identity } from './VennConfronto';
import { set, cup, cap, bar, minus } from './insiemi';

/** Lesson 64, "Leggi di De Morgan": the two laws, the difference as an intersection and the symmetric difference. */
const A = set(0), B = set(1);
const IDENTITIES: Identity[] = [
	{ name: 'Prima legge', lhs: bar(cup(A, B)), rhs: cap(bar(A), bar(B)), sets: 2 },
	{ name: 'Seconda legge', lhs: bar(cap(A, B)), rhs: cup(bar(A), bar(B)), sets: 2 },
	{ name: 'Differenza', lhs: minus(A, B), rhs: cap(A, bar(B)), sets: 2 },
	{ name: 'Differenza simmetrica', lhs: cup(minus(A, B), minus(B, A)), rhs: minus(cup(A, B), cap(A, B)), sets: 2 }
];

export default function VennDeMorgan({ alt }: { alt?: string }) {
	return <VennConfronto identities={IDENTITIES} alt={alt} />;
}
