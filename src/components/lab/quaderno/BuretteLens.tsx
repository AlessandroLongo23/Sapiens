'use client';

/**
 * A lens on the burette, in the notebook's page of readings: the scale round the meniscus, a line every 0.1 mL and
 * the numbers growing downwards. The meniscus is where it is: the page does not say what it reads.
 */
export function BuretteLens({ level }: { level: number }) {
	// a millilitre and more either side: two numbers are always in sight, so which way the scale runs can be seen
	const SPAN = 1.12;
	const H = 300;
	const W = 190;
	const y = (ml: number) => H / 2 + ((ml - level) / SPAN) * (H / 2);
	const ticks: number[] = [];
	for (let i = Math.ceil((level - SPAN) * 10 - 1e-9); i <= Math.floor((level + SPAN) * 10 + 1e-9); i++) if (i >= 0 && i <= 250) ticks.push(i);
	const m = y(level);
	return (
		<div className="shrink-0">
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="rounded-[28px] shadow-[0_6px_24px_rgba(10,10,20,0.45)]">
				<defs>
					<clipPath id="burette-lens">
						<rect width={W} height={H} rx="28" />
					</clipPath>
				</defs>
				<g clipPath="url(#burette-lens)">
					<rect width={W} height={H} fill="#eef3f5" />
					{/* the tube, and the liquid from the meniscus down */}
					<rect x="26" y="0" width="92" height={H} fill="#ffffff" opacity="0.7" />
					<path d={`M26 ${m - 7} Q72 ${m + 7} 118 ${m - 7} L118 ${H} L26 ${H} Z`} fill="#b7d6ea" opacity="0.8" />
					<rect x="26" y="0" width="2.5" height={H} fill="#8fa4b0" />
					<rect x="115.5" y="0" width="2.5" height={H} fill="#8fa4b0" />
					{ticks.map((i) => {
						const long = i % 10 === 0;
						const mid = i % 5 === 0;
						return (
							<g key={i}>
								<rect x="30" y={y(i / 10) - (long ? 1.4 : 1)} width={long ? 84 : mid ? 58 : 38} height={long ? 2.8 : 2} fill="#1d4f91" />
								{long && (
									<text x="150" y={y(i / 10) + 8} textAnchor="middle" fontSize="23" fontWeight="700" fill="#1d4f91" fontFamily="ui-sans-serif, system-ui">
										{i / 10}
									</text>
								)}
							</g>
						);
					})}
					{/* the meniscus over the marks, in another colour: a mark it sits on still shows */}
					<path d={`M27 ${m - 7} Q72 ${m + 7} 117 ${m - 7}`} fill="none" stroke="#39434d" strokeWidth="1.6" />
				</g>
				<rect x="1.5" y="1.5" width={W - 3} height={H - 3} rx="27" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="3" />
			</svg>
		</div>
	);
}
