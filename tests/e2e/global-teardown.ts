import { existsSync, readFileSync, unlinkSync } from 'node:fs';

export default async function globalTeardown() {
	const file = 'tests/e2e/.stripe-listen.pid';
	if (!existsSync(file)) return;
	const pid = Number(readFileSync(file, 'utf8'));
	try {
		process.kill(pid, 'SIGTERM');
	} catch {
		// Already gone.
	}
	unlinkSync(file);
}
