import type { RequestStatus } from '@/lib/server/tutoring-admin';
import { Badge, type BadgeTone } from '@/components/ui/Badge';

const STATUS: Record<RequestStatus, { label: string; tone: BadgeTone }> = {
	pending: { label: 'In attesa', tone: 'warn' },
	accepted: { label: 'Accettata', tone: 'ok' },
	declined: { label: 'Rifiutata', tone: 'neutral' },
	expired: { label: 'Scaduta', tone: 'neutral' },
	cancelled: { label: 'Annullata', tone: 'neutral' }
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
	const s = STATUS[status] ?? STATUS.pending;
	return <Badge tone={s.tone}>{s.label}</Badge>;
}
