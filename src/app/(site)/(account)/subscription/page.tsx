import { redirect } from 'next/navigation';
import { ACCOUNT_ROOT } from '@/lib/config/site';

/** The subscription moved into the account; the old address still leads there (the terms and Stripe's returns point here). */
export default function SubscriptionPage() {
	redirect(`${ACCOUNT_ROOT}/abbonamento`);
}
