import type { JsonLd as JsonLdData } from '@/lib/seo/jsonld';

/** Structured data, serialised with `<` escaped so the script cannot be closed early. */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] | undefined }) {
	if (!data) return null;
	const items = Array.isArray(data) ? data : [data];
	return items.map((item, i) => (
		<script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }} />
	));
}
