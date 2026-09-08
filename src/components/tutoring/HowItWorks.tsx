import type { IconComponent } from '@/lib/utils/icons';

export interface Step {
	icon: IconComponent;
	title: string;
	text: string;
}

/** Numbered cards explaining how the marketplace works. */
export function HowItWorks({ steps }: { steps: Step[] }) {
	return (
		<ol className="grid gap-5 md:grid-cols-3">
			{steps.map(({ icon: Icon, title, text }, i) => (
				<li key={title} className="space-y-3 rounded-2xl border border-edge bg-surface p-6">
					<div className="flex items-center gap-3">
						<span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-fg">
							<Icon className="size-5" aria-hidden="true" />
						</span>
						<span className="text-sm font-medium text-fg-subtle">Passo {i + 1}</span>
					</div>
					<h3 className="text-lg font-semibold text-fg">{title}</h3>
					<p className="text-sm leading-relaxed text-fg-muted">{text}</p>
				</li>
			))}
		</ol>
	);
}
