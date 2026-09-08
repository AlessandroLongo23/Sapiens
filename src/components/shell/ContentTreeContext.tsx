'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ContentNode } from '@/lib/utils/tree';

const Ctx = createContext<ContentNode[]>([]);

/** The slim content tree, loaded by every layout for the header's level menu; on the error boundary it is empty and the search fetches it on demand. */
export function ContentTreeProvider({ tree, children }: { tree: ContentNode[]; children: ReactNode }) {
	return <Ctx.Provider value={tree}>{children}</Ctx.Provider>;
}

export const useContentTree = () => useContext(Ctx);
