'use client';

import GasCilindro from './GasCilindro';

/** The gas cylinder (GasCilindro.tsx) as the lesson on Boyle's law opens it: with T constant. */
export default function GasCilindroBoyle({ alt }: { alt?: string }) {
	return <GasCilindro alt={alt} costante="T" />;
}
