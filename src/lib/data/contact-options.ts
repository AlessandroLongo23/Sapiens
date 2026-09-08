/** Choices offered on the contact form. */
export const LEVEL_OPTIONS = [
	{ value: 'middle_school', title: 'Scuola media' },
	{ value: 'high_school', title: 'Scuola superiore' },
	{ value: 'university', title: 'Università' }
];

const SCHOOL_SUBJECTS = [
	{ value: 'matematica', title: 'Matematica' },
	{ value: 'fisica', title: 'Fisica' },
	{ value: 'informatica', title: 'Informatica' },
	{ value: 'chimica', title: 'Chimica' },
	{ value: 'altro', title: 'Altro' }
];

export const SUBJECT_OPTIONS_BY_LEVEL: Record<string, { value: string; title: string }[]> = {
	middle_school: SCHOOL_SUBJECTS,
	high_school: SCHOOL_SUBJECTS,
	university: [
		{ value: 'analisi1', title: 'Analisi I' },
		{ value: 'analisi2', title: 'Analisi II' },
		{ value: 'fisica1', title: 'Fisica I' },
		{ value: 'fisica2', title: 'Fisica II' },
		{ value: 'fondamenti_informatica', title: 'Fondamenti di Informatica' },
		{ value: 'teoria_segnali', title: 'Teoria dei Segnali' },
		{ value: 'database', title: 'Database' },
		{ value: 'programmazione', title: 'Programmazione' },
		{ value: 'sistemi_operativi', title: 'Sistemi Operativi' },
		{ value: 'reti_di_calcolatori', title: 'Reti di Calcolatori' },
		{ value: 'altro', title: 'Altro' }
	]
};

export const FREQUENCY_OPTIONS = [
	{ value: 'singola', title: 'Lezione singola', subtitle: 'Una sola lezione' },
	{ value: 'breve', title: '2-5 lezioni', subtitle: 'Supporto a breve termine' },
	{ value: 'lungo', title: 'Supporto continuativo', subtitle: 'Percorso personalizzato' }
];
