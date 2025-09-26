export const configs = {
	'superiori/matematica/1/numeri-naturali/operazioni-e-proprieta': {
		'addizione': {
			generator: 'AddizioneEx',
			count: 2,
			args: [2]
		},
		'sottrazione': {
			generator: 'SottrazioneEx',
			count: 2,
			args: [2]
		},
		'moltiplicazione': {
			generator: 'MoltiplicazioneEx',
			count: 2,
			args: [2]
		},
		'divisione': {
			generator: 'DivisioneEx',
			count: 2,
			args: [2]
		}
	},
	'superiori/matematica/1/numeri-naturali/mcm-mcd': {
		'mcm': {
			generator: 'McmEx',
			count: 3,
			args: [3, 15]
		},
		'mcd': {
			generator: 'MCDEx',
			count: 3,
			args: [3, 15]
		}
	},
	'superiori/matematica/1/numeri-naturali/potenze': {
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
	'superiori/matematica/1/numeri-razionali/confronto-frazioni': {
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
	'superiori/matematica/1/numeri-razionali/espressioni-con-frazioni': {
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
	'superiori/matematica/1/numeri-razionali/potenze-esponente-negativo': {
		'stessa-base': {
			generator: 'PotenzeEsponenteNegativoEx',
			count: 6,
			args: []
		}
	},
	'superiori/matematica/1/numeri-razionali/conversione': {
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
	'superiori/matematica/1/insiemi-e-logica/operazioni': {
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
	'superiori/matematica/1/monomi/grado': {
		'grado': {
			generator: 'GradoEx',
			count: 6,
			args: []
		}
	},
	'superiori/matematica/1/monomi/mcm-mcd-monomi': {
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
	'superiori/matematica/1/monomi/operazioni-tra-monomi': {
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
	'superiori/matematica/1/monomi/espressioni-con-monomi': {
		'espressione': {
			generator: 'EspressioneMonomiEx',
			count: 4,
			args: []
		}
	},
	'superiori/matematica/3/equazioni/equazioni-di-i-grado': {
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
	'superiori/matematica/3/equazioni/equazioni-di-ii-grado': {
		'equal-to-zero': {
			generator: 'SecondDegreeEquationEx',
			count: 3,
			args: []
		},
		'different-from-zero': {
			generator: 'SecondDegreeEquationDifferentFromZeroEx',
			count: 0,
			args: []
		}
	},
};
