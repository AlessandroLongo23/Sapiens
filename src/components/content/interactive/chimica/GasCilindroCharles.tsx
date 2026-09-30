'use client';

import GasCilindro from './GasCilindro';

/** The gas cylinder (GasCilindro.tsx) as the lesson on the laws of Charles and Gay-Lussac opens it: with p constant. */
export default function GasCilindroCharles({ alt }: { alt?: string }) {
	return <GasCilindro alt={alt} costante="p" />;
}
