'use client';

import { useEffect, useState } from 'react';
import { LabMenu } from './LabMenu';
import { Handoff } from './Handoff';

/**
 * The menu where there is a mouse, the way over to a computer where there is not. A touch-only interactive
 * whiteboard reports no fine pointer either, so the handoff has a way into the menu anyway.
 */
export function LabsGate() {
	const [anyway, setAnyway] = useState(false);
	// the button that opened the menu is gone: focus goes to the menu's first step, not to the top of the page
	useEffect(() => {
		if (anyway) document.getElementById('lab-scelta')?.focus();
	}, [anyway]);
	return (
		<>
			<div className={anyway ? 'block' : 'hidden desk:block'}>
				<LabMenu />
			</div>
			{!anyway && (
				<div className="desk:hidden">
					<Handoff onAnyway={() => setAnyway(true)} />
				</div>
			)}
		</>
	);
}
