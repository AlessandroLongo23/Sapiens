import type { IconComponent } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';

const SIZES = {
	sm: { box: 'size-12 rounded-xl', icon: 'size-6' },
	md: { box: 'size-16 rounded-2xl', icon: 'size-8' },
	lg: { box: 'size-28 rounded-3xl lg:size-36', icon: 'size-14 lg:size-[4.5rem]' }
};

/**
 * An icon on a small tilted tab, like a sticker on a notebook's cover. It takes
 * the tint of the nearest `data-subject` or `data-notebook`; `accent` paints it
 * in the brand red instead. Decorative: the text next to it says what it means.
 */
export function Sticker({ icon: Icon, size = 'md', tone = 'tint', className }: { icon: IconComponent; size?: keyof typeof SIZES; tone?: 'tint' | 'accent'; className?: string }) {
	return (
		<span
			className={cn(
				'flex shrink-0 rotate-[-4deg] items-center justify-center border shadow-lift',
				tone === 'tint' ? 'border-tint-edge bg-tint-soft text-tint-fg' : 'border-accent-edge bg-accent-soft text-accent-fg',
				SIZES[size].box,
				className
			)}
			aria-hidden="true"
		>
			<Icon className={SIZES[size].icon} strokeWidth={size === 'lg' ? 1.4 : 1.75} />
		</span>
	);
}
