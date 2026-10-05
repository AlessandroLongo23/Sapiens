import type { ReactNode } from 'react';

/** "Il mio tutor": the student's side of the agenda, on the same squared paper as the rest of their things. */
export default function MyTutorLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative min-h-screen overflow-clip bg-page-alt">
			<div className="grid-paper pointer-events-none absolute inset-x-0 top-0 h-[26rem] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" aria-hidden="true" />
			<div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">{children}</div>
		</div>
	);
}
