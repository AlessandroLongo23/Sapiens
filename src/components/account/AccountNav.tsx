'use client';

import { CreditCard, Gift, KeyRound, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { SideNav } from '@/components/ui/SideNav';

export const ACCOUNT_SECTIONS = [
	{ href: ACCOUNT_ROOT, label: 'Profilo', icon: UserRound },
	{ href: `${ACCOUNT_ROOT}/accesso`, label: 'Accesso e sicurezza', icon: KeyRound },
	{ href: `${ACCOUNT_ROOT}/preferenze`, label: 'Preferenze', icon: SlidersHorizontal },
	{ href: `${ACCOUNT_ROOT}/abbonamento`, label: 'Abbonamento', icon: CreditCard },
	{ href: `${ACCOUNT_ROOT}/inviti`, label: 'Invita un amico', icon: Gift },
	{ href: `${ACCOUNT_ROOT}/dati`, label: 'Privacy e dati', icon: ShieldCheck }
];

/** The account's sections, in the shared side navigation. */
export function AccountNav() {
	return <SideNav label="Sezioni dell'account" items={ACCOUNT_SECTIONS.map((s) => ({ ...s, exact: true }))} />;
}
