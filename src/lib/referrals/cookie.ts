import { REFERRAL, normalizeCode } from '@/lib/referrals/config';

/** The code of the invite the visitor chose to use (InviteOffer keeps it in a cookie for a few hours), if any. Browser only. */
export function inviteCode(): string | null {
	if (typeof document === 'undefined') return null;
	const cookie = document.cookie.split('; ').find((c) => c.startsWith(`${REFERRAL.cookie}=`));
	return cookie ? normalizeCode(decodeURIComponent(cookie.slice(REFERRAL.cookie.length + 1))) : null;
}
