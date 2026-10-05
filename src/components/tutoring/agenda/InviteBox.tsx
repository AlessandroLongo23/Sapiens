'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, Copy, Link2, Send } from 'lucide-react';
import { Button, buttonClass } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { fieldClass } from '@/components/ui/Field';
import { cn } from '@/lib/utils/cn';

const noSubscription = () => () => {};

/** The invite of a student who has not joined yet: the link to send, with a button that copies it. */
export function InviteBox({ code, name }: { code: string; name: string }) {
	const [copied, setCopied] = useState(false);
	// The address is built in the browser, after hydration: the same link works on every domain the site answers from.
	const origin = useSyncExternalStore(noSubscription, () => window.location.origin, () => '');
	const url = `${origin}/invito-tutor/${code}`;
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		} catch {
			// Clipboard refused: the link is in the field, to copy by hand.
		}
	};
	return (
		<Card as="section" tone="info" className="space-y-3 p-5" aria-labelledby="invito">
			<h2 id="invito" className="flex items-center gap-2 font-sans text-base font-semibold text-fg">
				<Link2 className="size-5" aria-hidden="true" />
				Manda l&apos;invito a {name}
			</h2>
			<p className="text-sm text-fg-muted">Finché non lo accetta dal suo account, puoi già fissare le lezioni. Compiti, progressi e messaggi arrivano dopo. Il link vale una volta sola.</p>
			<div className="flex flex-col gap-2 sm:flex-row">
				<input readOnly value={url} aria-label="Link di invito" data-invite-link onFocus={(e) => e.target.select()} className={cn(fieldClass, 'min-w-0 flex-1 font-mono text-sm')} />
				<Button onClick={copy}>
					{copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
					{copied ? 'Copiato' : 'Copia il link'}
				</Button>
				<a href={`https://wa.me/?text=${encodeURIComponent(`Ciao! Ti seguo anche su Sapiens: apri questo link dal tuo account per vedere lezioni e compiti. ${url}`)}`} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary')}>
					<Send className="size-4" aria-hidden="true" />
					WhatsApp
				</a>
			</div>
		</Card>
	);
}
