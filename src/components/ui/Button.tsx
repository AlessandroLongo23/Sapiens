import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const VARIANTS: Record<ButtonVariant, string> = {
	primary: 'bg-accent text-white shadow-key hover:bg-accent-hover active:translate-y-px active:shadow-none focus-ring-offset',
	secondary: 'bg-surface border border-edge-strong text-fg shadow-paper hover:bg-surface-2 hover:border-fg-faint active:translate-y-px active:bg-surface-3 focus-ring-offset',
	ghost: 'text-fg-muted hover:bg-surface-3 hover:text-fg active:bg-surface-3 focus-ring',
	inverse: 'bg-inverse text-inverse-fg shadow-key hover:opacity-90 active:translate-y-px focus-ring-offset',
	link: 'text-accent-fg hover:underline underline-offset-2 focus-ring rounded'
};

const SIZES: Record<ButtonSize, string> = {
	sm: 'min-h-[36px] px-3 py-1.5 text-sm gap-1.5',
	md: 'min-h-[44px] px-4 py-2 text-sm gap-2',
	lg: 'min-h-[48px] px-6 py-3 text-base gap-2',
	icon: 'size-[44px] shrink-0'
};

/** The classes of a button, for elements that must look like one (labels, plain anchors). */
export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className = ''): string {
	return cn(
		'inline-flex items-center justify-center rounded-xl font-semibold transition-[background-color,border-color,transform,box-shadow] duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0',
		VARIANTS[variant],
		variant !== 'link' && SIZES[size],
		className
	);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	children?: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading = false, className, children, disabled, type = 'button', ...rest }: ButtonProps) {
	return (
		<button type={type} disabled={disabled || loading} className={buttonClass(variant, size, className)} {...rest}>
			{loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
			{children}
		</button>
	);
}

interface LinkButtonProps {
	href: string;
	variant?: ButtonVariant;
	size?: ButtonSize;
	className?: string;
	children: ReactNode;
	target?: string;
	rel?: string;
	'aria-label'?: string;
	title?: string;
}

export function LinkButton({ href, variant = 'primary', size = 'md', className, children, ...rest }: LinkButtonProps) {
	return (
		<Link href={href} className={buttonClass(variant, size, cn('no-underline', className))} {...rest}>
			{children}
		</Link>
	);
}
