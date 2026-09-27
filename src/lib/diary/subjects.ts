/**
 * School subjects as the diary names and colours them. The key is what an entry stores; the aliases are how a
 * student writes it in a hurry ("mate", "ita", "ed fisica"). Each has its own hue, like the coloured tabs of a
 * paper diary, on the same scale as the subjects of the material (`--hue`, `--chroma`). Pure.
 */

export interface DiarySubject {
	key: string;
	label: string;
	aliases: string[];
	hue: number;
	chroma: number;
}

export const DIARY_SUBJECTS: DiarySubject[] = [
	{ key: 'matematica', label: 'Matematica', aliases: ['matematica', 'mate', 'mat', 'algebra', 'geometria'], hue: 18, chroma: 0.19 },
	{ key: 'fisica', label: 'Fisica', aliases: ['fisica', 'fis'], hue: 252, chroma: 0.15 },
	{ key: 'chimica', label: 'Chimica', aliases: ['chimica', 'chim'], hue: 158, chroma: 0.12 },
	{ key: 'scienze', label: 'Scienze', aliases: ['scienze naturali', 'scienze', 'sci', 'biologia', 'bio'], hue: 140, chroma: 0.12 },
	{ key: 'informatica', label: 'Informatica', aliases: ['informatica', 'info'], hue: 70, chroma: 0.12 },
	{ key: 'italiano', label: 'Italiano', aliases: ['italiano', 'ita', 'grammatica', 'letteratura', 'antologia', 'epica'], hue: 300, chroma: 0.13 },
	{ key: 'latino', label: 'Latino', aliases: ['latino', 'lat'], hue: 40, chroma: 0.1 },
	{ key: 'greco', label: 'Greco', aliases: ['greco'], hue: 60, chroma: 0.1 },
	{ key: 'inglese', label: 'Inglese', aliases: ['inglese', 'ing', 'english'], hue: 228, chroma: 0.12 },
	{ key: 'francese', label: 'Francese', aliases: ['francese', 'fra'], hue: 262, chroma: 0.1 },
	{ key: 'spagnolo', label: 'Spagnolo', aliases: ['spagnolo', 'spa'], hue: 30, chroma: 0.13 },
	{ key: 'tedesco', label: 'Tedesco', aliases: ['tedesco', 'ted'], hue: 200, chroma: 0.08 },
	{ key: 'storia', label: 'Storia', aliases: ['storia', 'geostoria'], hue: 50, chroma: 0.12 },
	{ key: 'geografia', label: 'Geografia', aliases: ['geografia', 'geo'], hue: 110, chroma: 0.1 },
	{ key: 'filosofia', label: 'Filosofia', aliases: ['filosofia', 'filo'], hue: 320, chroma: 0.1 },
	{ key: 'arte', label: 'Arte', aliases: ["storia dell'arte", 'arte', 'disegno'], hue: 350, chroma: 0.13 },
	{ key: 'motoria', label: 'Scienze motorie', aliases: ['scienze motorie', 'educazione fisica', 'ed fisica', 'motoria', 'ginnastica'], hue: 130, chroma: 0.12 },
	{ key: 'diritto', label: 'Diritto', aliases: ['diritto', 'economia'], hue: 210, chroma: 0.08 },
	{ key: 'musica', label: 'Musica', aliases: ['musica'], hue: 280, chroma: 0.12 },
	{ key: 'tecnologia', label: 'Tecnologia', aliases: ['tecnologia', 'tecno'], hue: 75, chroma: 0.1 },
	{ key: 'religione', label: 'Religione', aliases: ['religione', 'irc'], hue: 85, chroma: 0.07 }
];

export const SUBJECT_BY_KEY = new Map(DIARY_SUBJECTS.map((s) => [s.key, s]));

/** The subject whose material Sapiens has: only its entries can be linked to a chapter or a lesson. */
export const MATERIAL_SUBJECT = 'matematica';

/** The tint of a subject, for `style`: the element also needs `data-subject` for the tints to be derived. */
export function subjectStyle(key: string | null | undefined): Record<string, string> | undefined {
	const s = key ? SUBJECT_BY_KEY.get(key) : undefined;
	return s ? { '--hue': String(s.hue), '--chroma': String(s.chroma) } : undefined;
}
