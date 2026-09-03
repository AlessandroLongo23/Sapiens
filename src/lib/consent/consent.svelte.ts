import { LEGAL_VERSIONS } from '$lib/config/legal';

/**
 * Cookie consent, following the Garante's guidelines of 10 June 2021:
 * nothing but strictly necessary cookies before a choice; "Rifiuta" as easy
 * as "Accetta"; scrolling is not consent; the choice is kept for six months,
 * then asked again; a link in the footer reopens it any time.
 *
 * The choice lives in a first-party cookie (readable server-side, unlike
 * localStorage). A refusal is recorded too, so the banner does not come back
 * on every page. Bumping `LEGAL_VERSIONS.cookies` invalidates every stored
 * choice, which is how re-consent is asked after a change in the policy.
 */

export const CONSENT_COOKIE = 'sapiens-cookie-consent';
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // six months, the Garante's re-prompt window

export type ConsentCategory = 'necessary' | 'analytics';

export interface Consent {
	necessary: true;
	analytics: boolean;
	version: string;
	timestamp: string;
}

export function readConsentCookie(cookieString: string): Consent | null {
	const row = cookieString.split('; ').find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
	if (!row) return null;
	try {
		const parsed = JSON.parse(decodeURIComponent(row.slice(CONSENT_COOKIE.length + 1))) as Partial<Consent>;
		if (parsed.version !== LEGAL_VERSIONS.cookies) return null;
		if (parsed.necessary !== true) return null;
		if (typeof parsed.analytics !== 'boolean') return null;
		if (typeof parsed.timestamp !== 'string') return null;
		return { necessary: true, analytics: parsed.analytics, version: parsed.version, timestamp: parsed.timestamp };
	} catch {
		return null;
	}
}

function writeConsentCookie(consent: Consent): void {
	if (typeof document === 'undefined') return;
	const value = encodeURIComponent(JSON.stringify(consent));
	const secure = window.location.protocol === 'https:' ? '; Secure' : '';
	document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
}

class ConsentState {
	consent = $state<Consent | null>(null);
	/** True once the cookie has been read in the browser. */
	hydrated = $state(false);
	bannerOpen = $state(false);
	customizeOpen = $state(false);

	hydrate(): void {
		if (typeof document === 'undefined' || this.hydrated) return;
		this.consent = readConsentCookie(document.cookie);
		this.bannerOpen = this.consent === null;
		this.hydrated = true;
	}

	get analyticsAllowed(): boolean {
		return this.consent?.analytics === true;
	}

	#save(analytics: boolean): void {
		const consent: Consent = {
			necessary: true,
			analytics,
			version: LEGAL_VERSIONS.cookies,
			timestamp: new Date().toISOString()
		};
		writeConsentCookie(consent);
		this.consent = consent;
		this.bannerOpen = false;
		this.customizeOpen = false;
	}

	acceptAll(): void {
		this.#save(true);
	}

	rejectAll(): void {
		this.#save(false);
	}

	saveCustom(choice: { analytics: boolean }): void {
		this.#save(choice.analytics);
	}

	openCustomize(): void {
		this.customizeOpen = true;
	}

	closeCustomize(): void {
		this.customizeOpen = false;
	}

	/** From the footer link: show the banner again, on the default view. */
	reopen(): void {
		this.customizeOpen = false;
		this.bannerOpen = true;
	}

	close(): void {
		if (this.consent) this.bannerOpen = false;
	}
}

export const consentState = new ConsentState();
