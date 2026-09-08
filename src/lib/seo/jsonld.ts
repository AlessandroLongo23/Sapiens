import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION, OG_IMAGE, absoluteUrl } from '@/lib/config/site';
import { plainTitle, nodePath } from '@/lib/seo/slug';
import { levelSchemaLabel } from '@/lib/seo/meta';
import type { ContentNode } from '@/lib/utils/tree';

/**
 * Typed JSON-LD builders. Every builder returns a plain object; the <JsonLd>
 * component serializes it. Nothing here invents data: names, counts and dates
 * come from the content tree, prices from the Stripe plan config.
 */

export type JsonLd = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationJsonLd(): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'EducationalOrganization',
		'@id': ORGANIZATION_ID,
		name: SITE_NAME,
		url: SITE_URL + '/',
		logo: {
			'@type': 'ImageObject',
			url: absoluteUrl('/sapiens/logo.png')
		},
		description: DEFAULT_DESCRIPTION
	};
}

export function webSiteJsonLd(): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: SITE_NAME,
		url: SITE_URL + '/',
		inLanguage: 'it',
		publisher: { '@id': ORGANIZATION_ID }
	};
}

export interface BreadcrumbEntry {
	name: string;
	path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbEntry[]): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: plainTitle(item.name),
			item: absoluteUrl(item.path)
		}))
	};
}

/** Subject page → schema.org Course. */
export function courseJsonLd(subject: ContentNode, ancestors: ContentNode[], description: string): JsonLd {
	const [level] = ancestors;
	const url = absoluteUrl(nodePath(ancestors));
	return {
		'@context': 'https://schema.org',
		'@type': 'Course',
		'@id': url,
		url,
		name: `${plainTitle(subject.title)} per ${levelSchemaLabel(level).toLowerCase()}`,
		description,
		inLanguage: 'it',
		educationalLevel: levelSchemaLabel(level),
		isAccessibleForFree: true,
		teaches: subject.children.map((c) => plainTitle(c.title)),
		provider: { '@id': ORGANIZATION_ID },
		hasCourseInstance: [
			{
				'@type': 'CourseInstance',
				courseMode: 'online',
				courseSchedule: { '@type': 'Schedule', repeatFrequency: 'Self-paced' }
			}
		]
	};
}

export interface LearningResourceOptions {
	description: string;
	resourceType: string;
	/** Whether the whole page is readable without a subscription. */
	free: boolean;
	/** CSS selector of the gated section, only when `free` is false. */
	gatedSelector?: string;
	dateModified?: string | null;
	path?: string;
}

/** Chapter and lesson pages → schema.org LearningResource, with the paywall block when needed. */
export function learningResourceJsonLd(
	node: ContentNode,
	ancestors: ContentNode[],
	options: LearningResourceOptions
): JsonLd {
	const [level, subject] = ancestors;
	const parent = ancestors.length > 1 ? ancestors[ancestors.length - 2] : null;
	const url = absoluteUrl(options.path ?? nodePath(ancestors));

	const data: JsonLd = {
		'@context': 'https://schema.org',
		'@type': 'LearningResource',
		'@id': url,
		url,
		name: plainTitle(node.title),
		description: options.description,
		inLanguage: 'it',
		learningResourceType: options.resourceType,
		educationalLevel: levelSchemaLabel(level),
		about: subject ? { '@type': 'Thing', name: plainTitle(subject.title) } : undefined,
		isPartOf: parent ? { '@id': absoluteUrl(nodePath(ancestors.slice(0, -1))) } : undefined,
		provider: { '@id': ORGANIZATION_ID },
		isAccessibleForFree: options.free
	};

	if (options.dateModified) data.dateModified = options.dateModified;

	if (!options.free && options.gatedSelector) {
		data.hasPart = {
			'@type': 'WebPageElement',
			isAccessibleForFree: false,
			cssSelector: options.gatedSelector
		};
	}

	return data;
}

export interface FaqEntry {
	question: string;
	answer: string;
}

export function faqJsonLd(entries: FaqEntry[]): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: entries.map((e) => ({
			'@type': 'Question',
			name: e.question,
			acceptedAnswer: { '@type': 'Answer', text: e.answer }
		}))
	};
}

export interface OfferEntry {
	name: string;
	description: string;
	price: number;
	currency: string;
	/** ISO 8601 duration of the billing period, e.g. P1M. */
	billingDuration: string;
}

/** Pricing page → Product with one Offer per published plan. */
export function productOffersJsonLd(offers: OfferEntry[], pagePath: string): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: `${SITE_NAME} Premium`,
		description: 'Abbonamento al materiale didattico e ai servizi Premium di Sapiens.',
		brand: { '@type': 'Brand', name: SITE_NAME },
		image: absoluteUrl(OG_IMAGE.path),
		url: absoluteUrl(pagePath),
		offers: offers.map((o) => ({
			'@type': 'Offer',
			name: o.name,
			description: o.description,
			price: o.price.toFixed(2),
			priceCurrency: o.currency,
			availability: 'https://schema.org/InStock',
			url: absoluteUrl(pagePath),
			priceSpecification: {
				'@type': 'UnitPriceSpecification',
				price: o.price.toFixed(2),
				priceCurrency: o.currency,
				billingDuration: o.billingDuration,
				unitCode: 'MON'
			}
		}))
	};
}
