import { ArrowRight, UserPen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';

/** Placeholder for a tutor without a profile yet, shared by the dashboard and the inbox. */
export function NoProfile({ title, text }: { title: string; text?: string }) {
	return (
		<Card tone="dashed" as="section" className="space-y-3 p-8 text-center">
			<UserPen className="mx-auto size-10 text-fg-faint" aria-hidden="true" />
			<h1 className="text-2xl font-bold text-fg">{title}</h1>
			{text && <p className="mx-auto max-w-md text-fg-muted">{text}</p>}
			<LinkButton href="/profile-editor" size="lg">
				Crea il profilo <ArrowRight className="size-4" aria-hidden="true" />
			</LinkButton>
		</Card>
	);
}
