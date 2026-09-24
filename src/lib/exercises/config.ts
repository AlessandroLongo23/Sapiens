export interface ExercisesConfig {
	[key: string]: TopicConfig;
}

export interface TopicConfig {
	[exerciseName: string]: {
		generator: string;
		count: number;
		args: number[];
	}
}

export const configs: ExercisesConfig = {
	'high_school/math/insiemi-e-logica/prime-definizioni': {
		'livello-1': { generator: 'PrimeDefinizioniV2', count: 1, args: [1] },
		'livello-2': { generator: 'PrimeDefinizioniV2', count: 1, args: [2] },
		'livello-3': { generator: 'PrimeDefinizioniV2', count: 1, args: [3] },
		'livello-4': { generator: 'PrimeDefinizioniV2', count: 1, args: [4] },
		'livello-5': { generator: 'PrimeDefinizioniV2', count: 1, args: [5] },
		'livello-6': { generator: 'PrimeDefinizioniV2', count: 1, args: [6] }
	},
	'high_school/math/insiemi-e-logica/insiemi-rappresentazione': {
		'livello-1': { generator: 'InsiemiRappresentazioneV2', count: 1, args: [1] },
		'livello-2': { generator: 'InsiemiRappresentazioneV2', count: 1, args: [2] },
		'livello-3': { generator: 'InsiemiRappresentazioneV2', count: 1, args: [3] },
		'livello-4': { generator: 'InsiemiRappresentazioneV2', count: 1, args: [4] },
		'livello-5': { generator: 'InsiemiRappresentazioneV2', count: 1, args: [5] }
	},
	'high_school/math/insiemi-e-logica/sottoinsiemi-ugualianza': {
		'livello-1': { generator: 'SottoinsiemiUgualianzaV2', count: 1, args: [1] },
		'livello-2': { generator: 'SottoinsiemiUgualianzaV2', count: 1, args: [2] },
		'livello-3': { generator: 'SottoinsiemiUgualianzaV2', count: 1, args: [3] },
		'livello-4': { generator: 'SottoinsiemiUgualianzaV2', count: 1, args: [4] },
		'livello-5': { generator: 'SottoinsiemiUgualianzaV2', count: 1, args: [5] }
	},
	'high_school/math/insiemi-e-logica/insiemi-unione': {
		'livello-1': { generator: 'InsiemiUnioneV2', count: 1, args: [1] },
		'livello-2': { generator: 'InsiemiUnioneV2', count: 1, args: [2] },
		'livello-3': { generator: 'InsiemiUnioneV2', count: 1, args: [3] },
		'livello-4': { generator: 'InsiemiUnioneV2', count: 1, args: [4] },
		'livello-5': { generator: 'InsiemiUnioneV2', count: 1, args: [5] },
		'livello-6': { generator: 'InsiemiUnioneV2', count: 1, args: [6] }
	},
	'high_school/math/insiemi-e-logica/insiemi-operazioni': {
		'livello-1': { generator: 'InsiemiOperazioniV2', count: 1, args: [1] },
		'livello-2': { generator: 'InsiemiOperazioniV2', count: 1, args: [2] },
		'livello-3': { generator: 'InsiemiOperazioniV2', count: 1, args: [3] },
		'livello-4': { generator: 'InsiemiOperazioniV2', count: 1, args: [4] },
		'livello-5': { generator: 'InsiemiOperazioniV2', count: 1, args: [5] },
		'livello-6': { generator: 'InsiemiOperazioniV2', count: 1, args: [6] }
	},
	'high_school/math/numeri-naturali/numeri-naturali-operazioni': {
		'livello-1': { generator: 'NumeriNaturaliOperazioniV2', count: 1, args: [1] },
		'livello-2': { generator: 'NumeriNaturaliOperazioniV2', count: 1, args: [2] },
		'livello-3': { generator: 'NumeriNaturaliOperazioniV2', count: 1, args: [3] },
		'livello-4': { generator: 'NumeriNaturaliOperazioniV2', count: 1, args: [4] },
		'livello-5': { generator: 'NumeriNaturaliOperazioniV2', count: 1, args: [5] },
		'livello-6': { generator: 'NumeriNaturaliOperazioniV2', count: 1, args: [6] }
	},
	'high_school/math/numeri-naturali/numeri-naturali-mcm-mcd': {
		'livello-1': { generator: 'NumeriNaturaliMcmMcdV2', count: 1, args: [1] },
		'livello-2': { generator: 'NumeriNaturaliMcmMcdV2', count: 1, args: [2] },
		'livello-3': { generator: 'NumeriNaturaliMcmMcdV2', count: 1, args: [3] },
		'livello-4': { generator: 'NumeriNaturaliMcmMcdV2', count: 1, args: [4] },
		'livello-5': { generator: 'NumeriNaturaliMcmMcdV2', count: 1, args: [5] },
		'livello-6': { generator: 'NumeriNaturaliMcmMcdV2', count: 1, args: [6] }
	},
	'high_school/math/numeri-naturali/numeri-naturali-potenze': {
		'livello-1': { generator: 'NumeriNaturaliPotenzeV2', count: 1, args: [1] },
		'livello-2': { generator: 'NumeriNaturaliPotenzeV2', count: 1, args: [2] },
		'livello-3': { generator: 'NumeriNaturaliPotenzeV2', count: 1, args: [3] },
		'livello-4': { generator: 'NumeriNaturaliPotenzeV2', count: 1, args: [4] },
		'livello-5': { generator: 'NumeriNaturaliPotenzeV2', count: 1, args: [5] }
	},
	'high_school/math/numeri-razionali/numeri-razionali-confronto-frazioni': {
		'livello-1': { generator: 'NumeriRazionaliConfrontoFrazioniV2', count: 1, args: [1] },
		'livello-2': { generator: 'NumeriRazionaliConfrontoFrazioniV2', count: 1, args: [2] },
		'livello-3': { generator: 'NumeriRazionaliConfrontoFrazioniV2', count: 1, args: [3] },
		'livello-4': { generator: 'NumeriRazionaliConfrontoFrazioniV2', count: 1, args: [4] },
		'livello-5': { generator: 'NumeriRazionaliConfrontoFrazioniV2', count: 1, args: [5] },
		'livello-6': { generator: 'NumeriRazionaliConfrontoFrazioniV2', count: 1, args: [6] }
	},
	'high_school/math/numeri-razionali/numeri-razionali-potenze': {
		'livello-1': { generator: 'NumeriRazionaliPotenzeV2', count: 1, args: [1] },
		'livello-2': { generator: 'NumeriRazionaliPotenzeV2', count: 1, args: [2] },
		'livello-3': { generator: 'NumeriRazionaliPotenzeV2', count: 1, args: [3] },
		'livello-4': { generator: 'NumeriRazionaliPotenzeV2', count: 1, args: [4] },
		'livello-5': { generator: 'NumeriRazionaliPotenzeV2', count: 1, args: [5] },
		'livello-6': { generator: 'NumeriRazionaliPotenzeV2', count: 1, args: [6] }
	},
	'high_school/math/numeri-razionali/numeri-razionali-conversione': {
		'livello-1': { generator: 'NumeriRazionaliConversioneV2', count: 1, args: [1] },
		'livello-2': { generator: 'NumeriRazionaliConversioneV2', count: 1, args: [2] },
		'livello-3': { generator: 'NumeriRazionaliConversioneV2', count: 1, args: [3] },
		'livello-4': { generator: 'NumeriRazionaliConversioneV2', count: 1, args: [4] },
		'livello-5': { generator: 'NumeriRazionaliConversioneV2', count: 1, args: [5] }
	},
	'high_school/math/monomi-polinomi/monomi-grado': {
		'livello-1': { generator: 'MonomiGradoV2', count: 1, args: [1] },
		'livello-2': { generator: 'MonomiGradoV2', count: 1, args: [2] },
		'livello-3': { generator: 'MonomiGradoV2', count: 1, args: [3] },
		'livello-4': { generator: 'MonomiGradoV2', count: 1, args: [4] },
		'livello-5': { generator: 'MonomiGradoV2', count: 1, args: [5] },
		'livello-6': { generator: 'MonomiGradoV2', count: 1, args: [6] }
	},
	'high_school/math/monomi-polinomi/monomi-operazioni': {
		'livello-1': { generator: 'MonomiOperazioniV2', count: 1, args: [1] },
		'livello-2': { generator: 'MonomiOperazioniV2', count: 1, args: [2] },
		'livello-3': { generator: 'MonomiOperazioniV2', count: 1, args: [3] },
		'livello-4': { generator: 'MonomiOperazioniV2', count: 1, args: [4] },
		'livello-5': { generator: 'MonomiOperazioniV2', count: 1, args: [5] },
		'livello-6': { generator: 'MonomiOperazioniV2', count: 1, args: [6] }
	},
	'high_school/math/monomi-polinomi/monomi-mcm-mcd': {
		'livello-1': { generator: 'MonomiMcmMcdV2', count: 1, args: [1] },
		'livello-2': { generator: 'MonomiMcmMcdV2', count: 1, args: [2] },
		'livello-3': { generator: 'MonomiMcmMcdV2', count: 1, args: [3] },
		'livello-4': { generator: 'MonomiMcmMcdV2', count: 1, args: [4] },
		'livello-5': { generator: 'MonomiMcmMcdV2', count: 1, args: [5] }
	},
	'high_school/math/monomi-polinomi/monomi-espressioni': {
		'livello-1': { generator: 'MonomiEspressioniV2', count: 1, args: [1] },
		'livello-2': { generator: 'MonomiEspressioniV2', count: 1, args: [2] },
		'livello-3': { generator: 'MonomiEspressioniV2', count: 1, args: [3] },
		'livello-4': { generator: 'MonomiEspressioniV2', count: 1, args: [4] },
		'livello-5': { generator: 'MonomiEspressioniV2', count: 1, args: [5] }
	},
	'high_school/math/equazioni-sistemi/equazioni-primo-grado': {
		'livello-1': { generator: 'EquazioniPrimoGradoV2', count: 1, args: [1] },
		'livello-2': { generator: 'EquazioniPrimoGradoV2', count: 1, args: [2] },
		'livello-3': { generator: 'EquazioniPrimoGradoV2', count: 1, args: [3] },
		'livello-4': { generator: 'EquazioniPrimoGradoV2', count: 1, args: [4] },
		'livello-5': { generator: 'EquazioniPrimoGradoV2', count: 1, args: [5] },
		'livello-6': { generator: 'EquazioniPrimoGradoV2', count: 1, args: [6] }
	},
	'high_school/math/equazioni-di-secondo-grado/equazioni-secondo-grado': {
		'livello-1': { generator: 'EquazioniSecondoGradoV2', count: 1, args: [1] },
		'livello-2': { generator: 'EquazioniSecondoGradoV2', count: 1, args: [2] },
		'livello-3': { generator: 'EquazioniSecondoGradoV2', count: 1, args: [3] },
		'livello-4': { generator: 'EquazioniSecondoGradoV2', count: 1, args: [4] },
		'livello-5': { generator: 'EquazioniSecondoGradoV2', count: 1, args: [5] },
		'livello-6': { generator: 'EquazioniSecondoGradoV2', count: 1, args: [6] }
	},
	'high_school/math/funzioni/funzioni-iniettive-suriettive-biettive': {
		'livello-1': { generator: 'FunzioniIniettiveSuriettiveBiettiveV2', count: 1, args: [1] },
		'livello-2': { generator: 'FunzioniIniettiveSuriettiveBiettiveV2', count: 1, args: [2] },
		'livello-3': { generator: 'FunzioniIniettiveSuriettiveBiettiveV2', count: 1, args: [3] },
		'livello-4': { generator: 'FunzioniIniettiveSuriettiveBiettiveV2', count: 1, args: [4] },
		'livello-5': { generator: 'FunzioniIniettiveSuriettiveBiettiveV2', count: 1, args: [5] },
		'livello-6': { generator: 'FunzioniIniettiveSuriettiveBiettiveV2', count: 1, args: [6] }
	},
};
