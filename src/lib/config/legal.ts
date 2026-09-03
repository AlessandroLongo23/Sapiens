import { env } from '$env/dynamic/public';
import { SITE_NAME } from '$lib/config/site';

/**
 * Single source of truth for the legal identity behind Sapiens. Every legal
 * page, the signup form and the cookie banner read from here.
 *
 * OWNER: confirm the legal form (ditta individuale, società...) and fill the
 * address and VAT number. Empty fields are simply not rendered.
 */
export const LEGAL = {
	/** Trading name, as shown everywhere. */
	name: SITE_NAME,
	/** Who provides the service and is the data controller (titolare del trattamento). */
	legalName: env.PUBLIC_LEGAL_NAME || 'Alessandro Longo',
	/** Full postal address, one line. */
	address: env.PUBLIC_LEGAL_ADDRESS || '',
	/** Partita IVA, when the activity is registered. */
	vatNumber: env.PUBLIC_LEGAL_VAT || '',
	/** Address for privacy requests; falls back to the contact page when empty. */
	privacyEmail: env.PUBLIC_PRIVACY_EMAIL || env.PUBLIC_CONTACT_EMAIL || '',
	/** Age from which a person can consent to online services on their own in Italy (art. 2-quinquies Codice privacy). */
	digitalConsentAge: 14,
	/** No DPO: the thresholds of art. 37 GDPR (large-scale monitoring or special categories) are not met. */
	dpoDesignated: false,
	supervisoryAuthority: {
		name: 'Garante per la protezione dei dati personali',
		url: 'https://www.garanteprivacy.it'
	}
} as const;

/**
 * Version of each legal document, as a date. Bump on any substantial change:
 * the version is stored with every acceptance so it is clear what a user
 * agreed to, and the cookie banner asks again when its version changes.
 */
export const LEGAL_VERSIONS = {
	terms: '2026-09-03',
	privacy: '2026-09-03',
	cookies: '2026-09-03'
} as const;

/** Services that process personal data on behalf of Sapiens (art. 28 GDPR). */
export interface Processor {
	name: string;
	purpose: string;
	location: string;
	transfer: string;
	privacyUrl: string;
}

export const PROCESSORS: Processor[] = [
	{
		name: 'Supabase, Inc.',
		purpose: 'Database, autenticazione e conservazione degli account',
		location: 'Stati Uniti (server nell’Unione Europea, regione scelta dal titolare)',
		transfer: 'Clausole contrattuali standard (decisione di esecuzione UE 2021/914)',
		privacyUrl: 'https://supabase.com/privacy'
	},
	{
		name: 'Vercel, Inc.',
		purpose: 'Hosting del sito, statistiche di visita e misurazione delle prestazioni',
		location: 'Stati Uniti',
		transfer: 'Clausole contrattuali standard e certificazione Data Privacy Framework',
		privacyUrl: 'https://vercel.com/legal/privacy-policy'
	},
	{
		name: 'Stripe Payments Europe, Ltd.',
		purpose: 'Pagamenti e gestione degli abbonamenti',
		location: 'Irlanda',
		transfer: 'Nessun trasferimento da parte di Sapiens; Stripe applica le proprie garanzie',
		privacyUrl: 'https://stripe.com/it/privacy'
	},
	{
		name: 'Resend, Inc.',
		purpose: 'Invio delle email di servizio e delle richieste di contatto',
		location: 'Stati Uniti',
		transfer: 'Clausole contrattuali standard',
		privacyUrl: 'https://resend.com/legal/privacy-policy'
	},
	{
		name: 'OpenAI, L.L.C.',
		purpose: 'Generazione delle risposte di Sapiens AI (solo per chi usa la chat)',
		location: 'Stati Uniti',
		transfer: 'Clausole contrattuali standard',
		privacyUrl: 'https://openai.com/policies/privacy-policy'
	}
];
