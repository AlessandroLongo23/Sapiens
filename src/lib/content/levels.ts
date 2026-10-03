import type { ContentNode } from '@/lib/utils/tree';

/**
 * The three levels of `content_nodes`, copied here so the layouts draw the
 * header without reading the database: a page whose own content is static
 * then has nothing to wait for, and is built once per deployment. They are
 * the top of every address on the site and do not change with the lessons;
 * `fetchFlatNodes` logs an error if the table ever disagrees with this list.
 */
export const LEVELS: ContentNode[] = [
	{ id: '6f99e09e-1597-4492-bbb4-635aead2cfe9', parent_id: null, type: 'level', slug: 'middle_school', title: 'Scuola media', position: 0, children: [] },
	{ id: '63d67233-ab3d-4386-9255-ca4fed06599c', parent_id: null, type: 'level', slug: 'high_school', title: 'Scuola superiore', position: 1, children: [] },
	{ id: '8e721e41-6222-4fbc-9f7f-11d73850f056', parent_id: null, type: 'level', slug: 'university', title: 'Università', position: 2, children: [] }
];
