import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * The inputs of each tool, by slug. Loaded one per page, so a tool's page ships only its own code; rendered on the
 * server too, so the example and its steps are in the HTML.
 */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
	'calcolo-percentuale': dynamic(() => import('./PercentualeTool').then((m) => m.PercentualeTool)),
	'calcolo-mcm': dynamic(() => import('./McmMcdTool').then((m) => m.McmTool)),
	'calcolo-mcd': dynamic(() => import('./McmMcdTool').then((m) => m.McdTool))
};
