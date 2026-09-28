'use client';

import { VennConfronto, type Identity } from './VennConfronto';
import { set, cup, cap, bar } from './insiemi';

/** Lesson 3, "Proprietà delle operazioni": the distributive properties and De Morgan's laws, coloured zone by zone. */
const A = set(0), B = set(1), C = set(2);
const IDENTITIES: Identity[] = [
	{ name: 'Distributiva dell’intersezione', lhs: cap(A, cup(B, C)), rhs: cup(cap(A, B), cap(A, C)), sets: 3 },
	{ name: 'Distributiva dell’unione', lhs: cup(A, cap(B, C)), rhs: cap(cup(A, B), cup(A, C)), sets: 3 },
	{ name: 'De Morgan per l’unione', lhs: bar(cup(A, B)), rhs: cap(bar(A), bar(B)), sets: 2 },
	{ name: 'De Morgan per l’intersezione', lhs: bar(cap(A, B)), rhs: cup(bar(A), bar(B)), sets: 2 }
];

export default function VennProprieta({ alt }: { alt?: string }) {
	return <VennConfronto identities={IDENTITIES} alt={alt} />;
}
