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
	'superiori/matematica/1/numeri-naturali/mcm-MCD': {
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
	'superiori/matematica/1/frazioni/confronto-frazioni': {
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
	'superiori/matematica/1/frazioni/potenze-esponente-negativo': {
		'stessa-base': {
			generator: 'PotenzeEsponenteNegativoEx',
			count: 6,
			args: []
		}
	},
	'superiori/matematica/1/frazioni/conversione': {
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
	}
};
