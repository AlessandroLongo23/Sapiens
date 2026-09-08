import type { HTMLAttributes } from 'react';

/** Server-rendered HTML (typeset math, lesson bodies) placed in the page. */
export function Html({ html, as: Tag = 'div', ...rest }: { html: string; as?: 'div' | 'span' } & HTMLAttributes<HTMLElement>) {
	return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}
