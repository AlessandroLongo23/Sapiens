'use client';

import GasCilindro from './GasCilindro';

/** The gas cylinder (GasCilindro.tsx) as the lesson on Avogadro's principle opens it: with p constant. */
export default function GasCilindroAvogadro({ alt }: { alt?: string }) {
	return <GasCilindro alt={alt} costante="p" />;
}
