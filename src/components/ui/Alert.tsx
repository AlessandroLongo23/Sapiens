import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/** An inline message: an error under a form, a success note after a send. */
export function Alert({ tone, title, children, className }: { tone: 'error' | 'success'; title?: string; children?: ReactNode; className?: string }) {
	const error = tone === 'error';
	return (
		<div
			role={error ? 'alert' : 'status'}
			className={cn('flex items-start gap-3 rounded-xl border px-4 py-3 text-sm', error ? 'border-danger-edge bg-danger-soft text-danger-fg' : 'border-ok-edge bg-ok-soft text-fg', className)}
		>
			{!error && <CheckCircle2 className="size-5 shrink-0 text-ok-fg" aria-hidden="true" />}
			<div className="min-w-0 flex-1">
				{title && <p className="font-semibold text-fg">{title}</p>}
				{children}
			</div>
		</div>
	);
}
