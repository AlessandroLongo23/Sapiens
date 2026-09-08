import type { TutorProfile } from '@/lib/tutoring/config';
import { cn } from '@/lib/utils/cn';

const PALETTE = [
	'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
	'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
	'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
	'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
	'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200',
	'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200'
];

const SIZES = { sm: 'size-10 text-sm', md: 'size-14 text-lg', lg: 'size-24 text-3xl' };

const hash = (text: string) => Array.from(text).reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 0);

/** Photo when the tutor has one, otherwise initials on a colour picked from the name, so the same tutor always gets the same colour. */
export function TutorAvatar({ tutor, size = 'md' }: { tutor: Pick<TutorProfile, 'first_name' | 'last_initial' | 'avatar_url'>; size?: keyof typeof SIZES }) {
	if (tutor.avatar_url) {
		// eslint-disable-next-line @next/next/no-img-element
		return <img src={tutor.avatar_url} alt="" className={cn('shrink-0 rounded-full object-cover', SIZES[size])} loading="lazy" />;
	}
	const colour = PALETTE[hash(`${tutor.first_name}${tutor.last_initial}`) % PALETTE.length];
	return (
		<div className={cn('flex shrink-0 select-none items-center justify-center rounded-full font-semibold', SIZES[size], colour)} aria-hidden="true">
			{`${tutor.first_name.charAt(0)}${tutor.last_initial ?? ''}`.toUpperCase()}
		</div>
	);
}
