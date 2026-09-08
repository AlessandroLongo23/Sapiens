import { LEGAL } from '@/lib/config/legal';

/** The provider's name, address and VAT number, as far as they are configured. */
export const LegalIdentity = () => (
	<>
		<strong>{LEGAL.legalName}</strong>
		{LEGAL.address && `, ${LEGAL.address}`}
		{LEGAL.vatNumber && `, ${LEGAL.vatNumber}`}
	</>
);

/** "o scrivi a …" when a privacy address is configured. */
export const PrivacyEmailLine = () => (LEGAL.privacyEmail ? <> o scrivi a <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a></> : null);
