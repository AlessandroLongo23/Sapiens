export const configs = {
	'superiori/matematica/1/numeri-naturali/operazioni-e-proprieta': {
		'addizione': {
			generator: 'AddizioneEx',
			count: 1,
			args: [2]
		},
		'sottrazione': {
			generator: 'SottrazioneEx',
			count: 1,
			args: [2]
		},
		'moltiplicazione': {
			generator: 'MoltiplicazioneEx',
			count: 1,
			args: [2]
		},
		'divisione': {
			generator: 'DivisioneEx',
			count: 1,
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
	}
};
