import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/** Form controls with one look: a rounded field, accent focus ring, 44px tall on touch screens. */
export const fieldClass =
	'w-full rounded-xl border border-edge bg-surface px-3.5 py-2.5 text-fg placeholder:text-fg-faint outline-none transition shadow-paper focus:border-accent focus:ring-3 focus:ring-accent/20 disabled:opacity-60';

export const labelClass = 'block text-sm font-medium text-fg-muted mb-1';

export function Label({ className, children, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
	return (
		<label className={cn(labelClass, className)} {...rest}>
			{children}
		</label>
	);
}

/** A grey aside under a field. */
export function Hint({ children, className }: { children: ReactNode; className?: string }) {
	return <p className={cn('mt-1 text-xs text-fg-subtle', className)}>{children}</p>;
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
	return <input className={cn(fieldClass, className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select className={cn(fieldClass, className)} {...rest}>
			{children}
		</select>
	);
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return <textarea className={cn(fieldClass, 'resize-y', className)} {...rest} />;
}

export const checkboxClass = 'mt-0.5 size-4 shrink-0 rounded border-zinc-400 text-accent-fg focus:ring-crimson-500 dark:border-zinc-600 dark:bg-zinc-800';

/** A checkbox with its text, in a bordered row. */
export function CheckboxRow({ children, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
	return (
		<label className={cn('flex cursor-pointer items-start gap-3 rounded-xl border border-edge p-3 text-sm text-fg-muted', rest.disabled && 'cursor-not-allowed opacity-80', className)}>
			<input type="checkbox" className={checkboxClass} {...rest} />
			<span className="flex-1">{children}</span>
		</label>
	);
}

/** A toggle chip (aria-pressed), for multi-choice lists such as a tutor's subjects. */
export function Chip({ on, className, children, ...rest }: { on: boolean; children: ReactNode } & Omit<InputHTMLAttributes<HTMLButtonElement>, 'type'>) {
	return (
		<button
			type="button"
			aria-pressed={on}
			className={cn(
				'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-ring',
				on ? 'border-accent bg-accent text-white' : 'border-edge bg-surface text-fg-muted hover:border-accent-edge',
				className
			)}
			{...(rest as object)}
		>
			{children}
		</button>
	);
}
