import Link from 'next/link';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/** A bordered surface. `tone` picks the semantic border and background of status cards. */
export type CardTone = 'default' | 'ok' | 'warn' | 'danger' | 'info' | 'accent' | 'dashed';

const TONES: Record<CardTone, string> = {
	default: 'border-edge bg-surface',
	ok: 'border-ok-edge bg-ok-soft',
	warn: 'border-warn-edge bg-warn-soft',
	danger: 'border-danger-edge bg-danger-soft',
	info: 'border-info-edge bg-info-soft',
	accent: 'border-accent-edge bg-accent-soft',
	dashed: 'border-dashed border-edge-strong bg-surface'
};

interface CardProps extends HTMLAttributes<HTMLElement> {
	tone?: CardTone;
	as?: 'div' | 'section' | 'article' | 'li' | 'aside';
	children: ReactNode;
}

export function Card({ tone = 'default', as: Tag = 'div', className, children, ...rest }: CardProps) {
	return (
		<Tag className={cn('rounded-2xl border', TONES[tone], className)} {...rest}>
			{children}
		</Tag>
	);
}

/** A card that is a link: lifts on hover and grows an accent line along its top edge. */
export function CardLink({ href, className, children, ...rest }: { href: string; className?: string; children: ReactNode } & Omit<HTMLAttributes<HTMLAnchorElement>, 'href'>) {
	return (
		<Link
			href={href}
			className={cn(
				'group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-edge bg-surface text-left no-underline transition-all duration-300 hover:-translate-y-1 hover:border-accent-edge hover:shadow-xl hover:shadow-crimson-500/5 focus-ring-offset',
				className
			)}
			{...rest}
		>
			<span className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-crimson-500 to-crimson-400 transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
			{children}
		</Link>
	);
}
