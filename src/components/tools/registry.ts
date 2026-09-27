import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * The inputs of each tool, by slug. Loaded one per page, so a tool's page ships only its own code; rendered on the
 * server too, so the example and its steps are in the HTML.
 */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
	'calcolo-percentuale': dynamic(() => import('./PercentualeTool').then((m) => m.PercentualeTool)),
	'calcolo-mcm': dynamic(() => import('./McmMcdTool').then((m) => m.McmTool)),
	'calcolo-mcd': dynamic(() => import('./McmMcdTool').then((m) => m.McdTool)),
	'scomposizione-in-fattori-primi': dynamic(() => import('./ScomposizioneTool').then((m) => m.ScomposizioneTool)),
	'calcolatrice-frazioni': dynamic(() => import('./FrazioniTool').then((m) => m.FrazioniTool)),
	'calcolo-espressioni': dynamic(() => import('./EspressioniTool').then((m) => m.EspressioniTool)),
	'calcolo-potenze': dynamic(() => import('./PotenzeTool').then((m) => m.PotenzeTool)),
	'calcolo-radice-quadrata': dynamic(() => import('./RadiceTool').then((m) => m.RadiceTool)),
	'calcolo-proporzioni': dynamic(() => import('./ProporzioniTool').then((m) => m.ProporzioniTool)),
	'equazioni-primo-grado': dynamic(() => import('./EquazioniPrimoGradoTool').then((m) => m.EquazioniPrimoGradoTool)),
	'equazioni-secondo-grado': dynamic(() => import('./EquazioniSecondoGradoTool').then((m) => m.EquazioniSecondoGradoTool)),
	'area-perimetro-quadrato': dynamic(() => import('./GeometriaTool').then((m) => m.QuadratoTool)),
	'area-perimetro-rettangolo': dynamic(() => import('./GeometriaTool').then((m) => m.RettangoloTool)),
	'area-perimetro-triangolo': dynamic(() => import('./GeometriaTool').then((m) => m.TriangoloTool)),
	'area-perimetro-trapezio': dynamic(() => import('./GeometriaTool').then((m) => m.TrapezioTool)),
	'area-perimetro-rombo': dynamic(() => import('./GeometriaTool').then((m) => m.RomboTool)),
	'area-perimetro-parallelogramma': dynamic(() => import('./GeometriaTool').then((m) => m.ParallelogrammaTool)),
	'area-circonferenza-cerchio': dynamic(() => import('./GeometriaTool').then((m) => m.CerchioTool)),
	'teorema-di-pitagora': dynamic(() => import('./PitagoraTool').then((m) => m.PitagoraTool)),
	'media-mediana-moda': dynamic(() => import('./MediaMedianaModaTool').then((m) => m.MediaMedianaModaTool)),
	'gradi-radianti': dynamic(() => import('./GradiRadiantiTool').then((m) => m.GradiRadiantiTool)),
	'equivalenze': dynamic(() => import('./EquivalenzeTool').then((m) => m.EquivalenzeTool)),
	'convertitore-temperatura': dynamic(() => import('./TemperaturaTool').then((m) => m.TemperaturaTool)),
	'convertitore-binario': dynamic(() => import('./BinarioTool').then((m) => m.BinarioTool)),
	'calcolo-media-voti': dynamic(() => import('./MediaVotiTool').then((m) => m.MediaVotiTool))
};
