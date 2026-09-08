'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { Button } from '@/components/ui/Button';

/** Goes to the profile editor, after a signup for anonymous visitors. */
export function BecomeTutorButton({ withIcon = false }: { withIcon?: boolean }) {
	const router = useRouter();
	const { user, openModal } = useAuth();
	const start = () => (user ? router.push('/profile-editor') : openModal({ register: true, next: () => router.push('/profile-editor') }));
	return (
		<Button size="lg" onClick={start} className="px-6 py-3.5">
			{withIcon && <GraduationCap className="size-5" aria-hidden="true" />}
			Crea il tuo profilo
			<ArrowRight className="size-4" aria-hidden="true" />
		</Button>
	);
}
