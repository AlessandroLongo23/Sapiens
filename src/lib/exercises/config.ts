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
	'high_school/math/insiemi-e-logica/insiemi-operazioni': {
		'intersezione': {
			generator: 'IntersezioneEx',
			count: 2,
			args: []
		},
		'unione': {
			generator: 'UnioneEx',
			count: 2,
			args: []
		},
		'differenza': {
			generator: 'DifferenzaEx',
			count: 2,
			args: []
		},
		'espressione': {
			generator: 'EspressioneEx',
			count: 2,
			args: []
		}
	},
	'high_school/math/numeri-naturali/numeri-naturali-operazioni': {
		'addizione': {
			generator: 'AddizioneEx',
			count: 2,
			args: []
		},
		'sottrazione': {
			generator: 'SottrazioneEx',
			count: 2,
			args: []
		},
		'moltiplicazione': {
			generator: 'MoltiplicazioneEx',
			count: 2,
			args: []
		},
		'divisione': {
			generator: 'DivisioneEx',
			count: 2,
			args: []
		}
	},
	'high_school/math/numeri-naturali/numeri-naturali-mcm-mcd': {
		'mcm': {
			generator: 'McmEx',
			count: 3,
			args: []
		},
		'mcd': {
			generator: 'MCDEx',
			count: 3,
			args: []
		}
	},
	'high_school/math/numeri-naturali/numeri-naturali-potenze': {
		'same-base': {
			generator: 'PotenzaExSameBase',
			count: 2,
			args: [3]
		},
		'same-exponent': {
			generator: 'PotenzaExSameExponent',
			count: 2,
			args: [2]
		},
		// 'different-base-exponent': {
		// 	generator: 'PotenzaExGeneral',
		// 	count: 2,
		// 	args: [2]
		// }
	},
	'high_school/math/numeri-razionali/numeri-razionali-confronto-frazioni': {
		'stesso-numeratore': {
			generator: 'StessoNumeratoreEx',
			count: 2,
			args: []
		},
		'stesso-denominatore': {
			generator: 'StessoDenominatoreEx',
			count: 2,
			args: []
		},
		'numeratore-e-denominatore-diversi': {
			generator: 'NumeratoreEDenominatoreDiversoEx',
			count: 2,
			args: []
		}
	},
	'high_school/math/numeri-razionali/numeri-razionali-espressioni': {
		'addizione-e-sottrazione': {
			generator: 'AddizioneESottrazioneEx',
			count: 2,
			args: []
		},
		'moltiplicazione-e-divisione': {
			generator: 'MoltiplicazioneEDivisioneEx',
			count: 2,
			args: []
		},
		'potenze': {
			generator: 'PotenzeEx',
			count: 2,
			args: []
		},
	},
	'high_school/math/numeri-razionali/numeri-razionali-potenze': {
		'stessa-base': {
			generator: 'PotenzeEsponenteNegativoEx',
			count: 6,
			args: []
		}
	},
	'high_school/math/numeri-razionali-conversione': {
		'finito': {
			generator: 'FinitoEx',
			count: 2,
			args: []
		},
		'periodico-semplice': {
			generator: 'PeriodicoSempliceEx',
			count: 2,
			args: []
		},
		'periodico-misto': {
			generator: 'PeriodicoMistoEx',
			count: 2,
			args: []
		},
	},
	'high_school/math/monomi-polinomi/monomi-grado': {
		'grado': {
			generator: 'GradoEx',
			count: 6,
			args: []
		}
	},
	'high_school/math/monomi-polinomi/monomi-mcm-mcd': {
		'mcm': {
			generator: 'McmMonomiEx',
			count: 2,
			args: []
		},
		'mcd': {
			generator: 'McdMonomiEx',
			count: 2,
			args: []
		}
	},
	'high_school/math/monomi-polinomi/monomi-operazioni': {
		'somma-e-sottrazione': {
			generator: 'SommaESottrazioneMonomiEx',
			count: 2,
			args: []
		},
		'moltiplicazione-e-divisione': {
			generator: 'MoltiplicazioneEDivisioneMonomiEx',
			count: 2,
			args: []
		},
		'potenze': {
			generator: 'PotenzeMonomiEx',
			count: 2,
			args: []
		}
	},
	'high_school/math/monomi-polinomi/monomi-espressioni': {
		'espressione': {
			generator: 'EspressioneMonomiEx',
			count: 4,
			args: []
		}
	},
	'high_school/math/equazioni-sistemi/equazioni-primo-grado': {
		'equal-to-zero': {
			generator: 'FirstDegreeEquationEx',
			count: 3,
			args: []
		},
		'different-from-zero': {
			generator: 'FirstDegreeEquationDifferentFromZeroEx',
			count: 3,
			args: []
		}
	},
	'high_school/math/equazioni-sistemi/equazioni-secondo-grado': {
		'equal-to-zero': {
			generator: 'SecondDegreeEquationEx',
			count: 0,
			args: []
		},
		'different-from-zero': {
			generator: 'SecondDegreeEquationDifferentFromZeroEx',
			count: 3,
			args: []
		}
	},
};
