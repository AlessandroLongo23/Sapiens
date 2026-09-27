/** Lower case without accents, so "equivalenze" finds "Equivalenze" and "unita" finds "unità". */
export const normalise = (text: string) =>
	text
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{M}/gu, '');
