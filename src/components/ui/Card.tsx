import Link from 'next/link';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/** A bordered surface. `tone` picks the semantic border and background of status cards. */
export type CardTone = 'default' | 'ok' | 'warn' | 'danger' | 'info' | 'accent' | 'dashed';

const TONES: Record<CardTone, string> = {
	default: 'border-edge bg-surface shadow-paper',
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

/** A card that is a link: a sheet of paper that lifts off the page on hover. */
export function CardLink({ href, className, children, ...rest }: { href: string; className?: string; children: ReactNode } & Omit<HTMLAttributes<HTMLAnchorElement>, 'href'>) {
	return (
		<Link
			href={href}
			className={cn(
				'group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-edge bg-surface text-left no-underline shadow-paper transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:border-edge-strong hover:shadow-lift focus-ring-offset',
				className
			)}
			{...rest}
		>
			{children}
		</Link>
	);
}
