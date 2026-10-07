/**
 * Audio e video digitali. Spec: specs/exercises/inf-audio-video.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/85-inf-audio-video.md), all multiple choice of
 * text: the bitrate of a sound that is not compressed; from the bitrate of a compressed file to its size; one frame
 * and one second of video that is not compressed; key frames and differences, counted in pixels as in the figure of
 * the lesson; streaming (which version holds, how much data) and the words of the lesson. Every count is built
 * backwards so that the answer is a whole number or has few decimals, and the wrong options are the slips the
 * lesson warns about: bits taken for bytes, minutes not turned into seconds, a channel or the three bytes forgotten.
 */
import { choose, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';
import type { ChoiceAnswer, ChoiceOption, Rng } from '../types';

export const ID = 'inf-audio-video';

/** 1411200 → "1 411 200" (narrow spaces that do not break), 2.5 → "2,5". */
export function it(x: number): string {
	const [whole, decimals] = String(Math.round(x * 1000) / 1000).split('.');
	const grouped = whole.length > 4 ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : whole;
	return decimals ? `${grouped},${decimals}` : grouped;
}
const value = (x: number) => String(Math.round(x * 1000) / 1000);
const amount = (x: number, unit: string): ChoiceOption => textOption(`${it(x)} ${unit}`, value(x));
const rightLabel = (answer: ChoiceAnswer) => answer.options[answer.correct].text ?? '';
/** The right amount and the wrong ones, those that are positive and differ from it. */
const amounts = (rng: Rng, right: number, wrong: number[], unit: string) =>
	choose(
		rng,
		amount(right, unit),
		wrong.filter((x) => x > 0 && value(x) !== value(right)).map((x) => amount(x, unit))
	);
const chance = (rng: Rng, p: number) => rng.next() < p;

// ---------------------------------------------------------------------------
// Level 1: the bitrate of a sound that is not compressed

const RATES = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000, 64000, 88200, 96000];
const DEPTHS = [8, 12, 16, 20, 24];
const CHANNELS = { 1: 'mono (1 canale)', 2: 'stereo (2 canali)' } as const;

function level1(rng: Rng): CodeBuilt {
	const f = rng.pick(RATES);
	const depth = rng.pick(DEPTHS);
	const ch = rng.pick([1, 2] as const);
	const right = (f * depth * ch) / 1000;
	const answer = amounts(rng, right, [(f * depth * (3 - ch)) / 1000, right / 8, f * depth * ch, (f * ch) / 1000, right * 8, (f * depth * ch) / 1024], 'kbit/s');
	return {
		prompt: 'Calcola i bit di un secondo di suono.',
		problem: `Un suono non compresso è ${CHANNELS[ch]}, con frequenza di campionamento ${it(f)} Hz e ${depth} bit per campione. Qual è il suo bitrate? Usa 1 kbit/s = 1000 bit/s.`,
		solution: rightLabel(answer),
		steps: [`Il bitrate è frequenza di campionamento per bit per campione per canali: ${it(f)} · ${depth} · ${ch} = ${it(f * depth * ch)} bit/s.`, `In kbit/s: ${it(f * depth * ch)} : 1000 = ${it(right)}.`, 'Per 8 si divide solo quando si passa dai bit ai byte, e qui si resta in bit.'],
		answer,
		params: { case: ch === 1 ? 'mono' : 'stereo', f, depth, ch }
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the bitrate of a compressed file to its size

const AUDIO_BITRATES = [64, 96, 128, 160, 192, 256, 320];

function level2(rng: Rng): CodeBuilt {
	const kbit = rng.pick(AUDIO_BITRATES);
	const minutes = rng.int(1, 9);
	const seconds = chance(rng, 0.5) ? 0 : rng.pick([15, 30, 45]);
	const t = minutes * 60 + seconds;
	const right = (kbit * t) / 8;
	const duration = `${minutes} ${minutes === 1 ? 'minuto' : 'minuti'}${seconds ? ` e ${seconds} secondi` : ''}`;
	const answer = amounts(rng, right, [kbit * t, (kbit * minutes) / 8, kbit * t * 8, right * 2, kbit * minutes, right / 1000, (kbit * (minutes + seconds)) / 8], 'kB');
	return {
		prompt: 'Porta la durata in secondi, poi passa dai bit ai byte.',
		problem: `Un brano compresso ha bitrate ${kbit} kbit/s e dura ${duration}. Quanto occupa il file? Usa 1 kbit = 1000 bit e 1 kB = 1000 B.`,
		solution: rightLabel(answer),
		steps: [`La durata in secondi: ${minutes} · 60${seconds ? ` + ${seconds}` : ''} = ${t}.`, `I kbit sono ${kbit} · ${t} = ${it(kbit * t)}.`, `Otto bit fanno un byte: ${it(kbit * t)} : 8 = ${it(right)} kB. Frequenza, bit per campione e canali non servono: basta il bitrate.`],
		answer,
		params: { case: seconds ? 'minuti e secondi' : 'minuti', kbit, minutes, seconds }
	};
}

// ---------------------------------------------------------------------------
// Level 3: a frame and a second of video that is not compressed

const SIZES: [number, number][] = [
	[160, 120],
	[320, 180],
	[320, 240],
	[480, 270],
	[640, 360],
	[640, 480],
	[800, 600],
	[960, 540],
	[1280, 720],
	[1280, 960],
	[1600, 900],
	[1920, 1080],
	[2560, 1440],
	[3840, 2160]
];
const FPS = [10, 12, 15, 20, 24, 25, 30, 50, 60];

function level3(rng: Rng): CodeBuilt {
	const [w, h] = rng.pick(SIZES);
	const fps = rng.pick(FPS);
	const frame = w * h * 3;
	if (chance(rng, 0.25)) {
		const answer = amounts(rng, frame, [w * h, w * h * 24, (w + h) * 3, frame * fps, frame / 8, w * h * 8], 'B');
		return {
			prompt: 'Conta i pixel, poi i byte di ogni pixel.',
			problem: `Un video non compresso ha fotogrammi di ${w} × ${h} pixel, a 24 bit per pixel, e ne mostra ${fps} al secondo. Quanti byte occupa un solo fotogramma?`,
			solution: rightLabel(answer),
			steps: [`I pixel di un fotogramma sono ${w} · ${h} = ${it(w * h)}.`, `24 bit sono 3 byte: ${it(w * h)} · 3 = ${it(frame)} B.`, 'I fotogrammi al secondo non entrano nel conto di un fotogramma solo.'],
			answer,
			params: { case: 'fotogramma', w, h, fps }
		};
	}
	const right = frame * fps;
	const answer = amounts(rng, right, [w * h * fps, w * h * 24 * fps, frame, right / 8, (w + h) * 3 * fps, frame * 60], 'B');
	return {
		prompt: 'Prima un fotogramma, poi tutti quelli di un secondo.',
		problem: `Un video non compresso ha fotogrammi di ${w} × ${h} pixel, a 24 bit per pixel, e ne mostra ${fps} al secondo. Quanti byte occupa un secondo di video?`,
		solution: rightLabel(answer),
		steps: [`Un fotogramma: ${w} · ${h} · 3 = ${it(frame)} B, perché 24 bit sono 3 byte.`, `In un secondo i fotogrammi sono ${fps}: ${it(frame)} · ${fps} = ${it(right)} B.`],
		answer,
		params: { case: 'secondo', w, h, fps }
	};
}

// ---------------------------------------------------------------------------
// Level 4: key frames and differences

const GRIDS: [number, number][] = [
	[16, 9],
	[16, 12],
	[20, 15],
	[24, 18],
	[32, 18],
	[32, 24],
	[40, 30]
];

function level4(rng: Rng): CodeBuilt {
	const [w, h] = rng.pick(GRIDS);
	const pixels = w * h;
	const frames = rng.int(6, 20);
	const keys = rng.int(1, 3);
	const changed = rng.int(2, Math.min(30, Math.floor(pixels / 6)));
	const written = keys * pixels + (frames - keys) * changed;
	const whole = frames * pixels;
	const saved = chance(rng, 0.4);
	const story = `Un video ha ${frames} fotogrammi di ${w} × ${h} pixel. ${keys === 1 ? 'Solo il primo è un fotogramma chiave' : `${keys} sono fotogrammi chiave`}, scritti per intero; di ognuno degli altri si scrivono solo i pixel cambiati rispetto al precedente, che sono ${changed}.`;
	const steps = [`Un fotogramma intero ha ${w} · ${h} = ${pixels} pixel: i fotogrammi chiave ne scrivono ${keys} · ${pixels} = ${it(keys * pixels)}.`, `Gli altri fotogrammi sono ${frames} - ${keys} = ${frames - keys}, e scrivono ${frames - keys} · ${changed} = ${it((frames - keys) * changed)} pixel.`, `In tutto ${it(keys * pixels)} + ${it((frames - keys) * changed)} = ${it(written)} pixel.`];
	if (saved) {
		const answer = amounts(rng, whole - written, [written, whole, whole - frames * changed, whole - keys * pixels, (frames - keys) * changed, whole - pixels - (frames - 1) * changed], 'pixel');
		return {
			prompt: 'Conta i pixel scritti nei due modi e fai la differenza.',
			problem: `${story} Quanti pixel in meno si scrivono rispetto a scrivere per intero tutti i fotogrammi?`,
			solution: rightLabel(answer),
			steps: [...steps, `Scritti tutti per intero sarebbero ${frames} · ${pixels} = ${it(whole)}: la differenza è ${it(whole)} - ${it(written)} = ${it(whole - written)} pixel.`],
			answer,
			params: { case: 'risparmio', w, h, frames, keys, changed }
		};
	}
	const answer = amounts(rng, written, [whole, keys * pixels + frames * changed, (frames - keys) * changed, pixels + (frames - 1) * changed, frames * changed, keys * pixels + changed], 'pixel');
	return {
		prompt: 'Conta a parte i fotogrammi chiave e gli altri.',
		problem: `${story} Quanti pixel si scrivono in tutto?`,
		solution: rightLabel(answer),
		steps,
		answer,
		params: { case: 'scritti', w, h, frames, keys, changed }
	};
}

// ---------------------------------------------------------------------------
// Level 5: streaming, and the words of the lesson

const VIDEO_BITRATES = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25];

const TERMS = {
	bitrate: 'Il bitrate',
	codec: 'Il codec',
	contenitore: 'Il contenitore',
	chiave: 'Un fotogramma chiave',
	fotogramma: 'Un fotogramma',
	streaming: 'Lo streaming',
	fps: 'La frequenza dei fotogrammi'
} as const;
type Term = keyof typeof TERMS;

const WHY: Record<Term, string> = {
	bitrate: 'Il bitrate è il numero di bit che servono per ogni secondo di suono o di video.',
	codec: 'Il codec è il metodo con cui un suono o un video viene compresso e poi ricostruito per riprodurlo.',
	contenitore: 'Il contenitore è il file che tiene insieme video, audio e sottotitoli e li sincronizza: la sua estensione non dice quali codec ci sono dentro.',
	chiave: 'Un fotogramma chiave è scritto per intero e non dipende dai precedenti; gli altri contengono solo le differenze.',
	fotogramma: 'Un fotogramma è una delle immagini ferme che, mostrate una dopo l’altra, formano il video.',
	streaming: 'Con lo streaming il video viene riprodotto mentre arriva, senza aspettare di averlo scaricato tutto.',
	fps: 'La frequenza dei fotogrammi dice quanti fotogrammi passano in un secondo, e si misura in fps.'
};

const DESCRIPTIONS: [Term, string][] = [
	['bitrate', 'Dice quanti bit servono per ogni secondo di suono o di video.'],
	['bitrate', 'In un file compresso lo sceglie chi salva: più è basso, più piccolo è il file e più si perde.'],
	['bitrate', 'Si misura in kbit/s o in Mbit/s, e moltiplicato per i secondi e diviso per 8 dà i byte del file.'],
	['codec', 'È il metodo con cui un video viene compresso e poi ricostruito per riprodurlo.'],
	['codec', 'Se al lettore manca, il file si apre ma lo schermo resta nero, oppure non si sente l’audio.'],
	['codec', 'Due file con la stessa estensione possono averne dentro due diversi, e un lettore può conoscerne uno solo.'],
	['contenitore', 'È il file che tiene insieme le immagini, l’audio e i sottotitoli e li mantiene sincronizzati.'],
	['contenitore', 'È quello che l’estensione di un file video dice, senza dire come sono compressi i flussi dentro.'],
	['chiave', 'È scritto per intero, e serve all’inizio del video e a ogni cambio di scena.'],
	['chiave', 'Quando salti a metà di un video, il lettore riparte dal più vicino.'],
	['chiave', 'Non dipende dai fotogrammi precedenti, mentre quelli che lo seguono contengono solo le differenze.'],
	['fotogramma', 'È una delle immagini ferme che, mostrate una dopo l’altra, danno l’impressione del movimento.'],
	['streaming', 'Il video viene riprodotto mentre arriva, senza aspettare di averlo scaricato tutto.'],
	['streaming', 'Regge solo se la connessione è più veloce del bitrate del video; altrimenti il video si ferma a caricare.'],
	['fps', 'Dice quante immagini del video passano in un secondo.'],
	['fps', 'Al cinema vale 24 e nella televisione europea 25.']
];

function level5(rng: Rng): CodeBuilt {
	const roll = rng.next();
	if (roll < 0.2) {
		const d = rng.int(0, DESCRIPTIONS.length - 1);
		const [term, text] = DESCRIPTIONS[d];
		const option = (t: Term) => textOption(TERMS[t], t);
		const answer = choose(
			rng,
			option(term),
			shuffle(
				rng,
				(Object.keys(TERMS) as Term[]).filter((t) => t !== term)
			).map(option)
		);
		return { prompt: 'Riconosci di che cosa si parla.', problem: `${text} Di che cosa si parla?`, solution: rightLabel(answer), steps: [WHY[term]], answer, params: { case: 'parole', term, description: d } };
	}
	if (roll < 0.6) {
		// four versions of a video and a connection: the best one that holds is the fastest under the speed
		for (;;) {
			const versions = shuffle(rng, VIDEO_BITRATES)
				.slice(0, 4)
				.sort((a, b) => a - b);
			const speed = rng.int(versions[0] + 1, versions[3] + 4);
			if (versions.includes(speed)) continue;
			const holding = versions.filter((b) => b < speed);
			const best = Math.max(...holding);
			const option = (b: number) => textOption(`quella a ${b} Mbit/s`, String(b));
			const answer = choose(
				rng,
				option(best),
				versions.filter((b) => b !== best).map(option)
			);
			return {
				prompt: 'Confronta ogni bitrate con la velocità della connessione.',
				problem: `Un video è disponibile in quattro versioni, a ${versions.slice(0, 3).join(', ')} e ${versions[3]} Mbit/s. La tua connessione arriva a ${speed} Mbit/s. Qual è la versione di qualità più alta che vedi in streaming senza interruzioni?`,
				solution: rightLabel(answer),
				steps: ['Lo streaming regge se il bitrate del video è minore della velocità della connessione.', `Sotto ${speed} Mbit/s ${holding.length === 1 ? `c'è solo la versione a ${best}` : `ci sono le versioni a ${holding.join(', ')}`} Mbit/s${holding.length === versions.length ? '' : `: ${versions.length - holding.length === 1 ? 'la più pesante si fermerebbe' : 'le altre si fermerebbero'} a caricare`}.`, `Tra quelle che reggono, la qualità più alta è quella con il bitrate più alto: ${best} Mbit/s.`],
				answer,
				params: { case: 'versione', versions, speed }
			};
		}
	}
	const mbit = rng.pick(VIDEO_BITRATES);
	// minutes that give megabytes with at most one decimal
	const minutes = mbit % 2 === 0 ? rng.int(2, 120) : rng.int(1, 60) * 2;
	const right = (mbit * minutes * 60) / 8;
	const answer = amounts(rng, right, [mbit * minutes * 60, (mbit * minutes) / 8, mbit * minutes * 60 * 8, mbit * minutes, right / 60, right * 2], 'MB');
	return {
		prompt: 'Porta i minuti in secondi, poi passa dai bit ai byte.',
		problem: `Guardi in streaming ${minutes} minuti di un video con bitrate ${mbit} Mbit/s. Quanti dati consumi? Usa 1 Mbit = 1 000 000 bit e 1 MB = 1 000 000 B.`,
		solution: rightLabel(answer),
		steps: [`I secondi sono ${minutes} · 60 = ${it(minutes * 60)}.`, `I Mbit sono ${mbit} · ${it(minutes * 60)} = ${it(mbit * minutes * 60)}.`, `Otto bit fanno un byte: ${it(mbit * minutes * 60)} : 8 = ${it(right)} MB.`],
		answer,
		params: { case: 'dati', mbit, minutes }
	};
}

/** No level has a program: the options are told apart by their numbers and names. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of counts has no program'] : []);

export default makeCodeGenerator(ID, 'Audio e video digitali', {
	1: { label: 'Il bitrate di un suono', constraints: ['a sound that is not compressed', 'the answer in kbit/s, with at most three decimals'], build: level1, check: worded },
	2: { label: 'Dal bitrate alla dimensione', constraints: ['a compressed track, its bitrate and how long it lasts', 'the answer a whole number of kB'], build: level2, check: worded },
	3: { label: 'Un video non compresso', constraints: ['24 bits per pixel', 'the bytes of one frame, or of one second'], build: level3, check: worded },
	4: { label: 'Fotogrammi chiave e differenze', constraints: ['key frames written in full, the others as the pixels that change', 'pixels written, or pixels saved'], build: level4, check: worded },
	5: { label: 'Streaming, codec e contenitore', constraints: ['the best version that holds on a connection', 'the megabytes of some minutes of streaming', 'the words of the lesson'], build: level5, check: worded }
});
