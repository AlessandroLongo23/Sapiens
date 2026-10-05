/**
 * Indirizzi IP e nomi di dominio. Spec: specs/exercises/inf-indirizzi-domini.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/35-inf-indirizzi-domini.md), all multiple choice
 * of text. The addresses and the names are built backwards from their pieces: the four bytes of an IPv4 address,
 * the number of bits, the labels of a domain name. Only the addresses reserved for examples (192.0.2.x,
 * 198.51.100.x, 203.0.113.x, 2001:db8::) and the names of the lesson (the .example domain, esempio.it) are used.
 */
import { NAMES, breakable, choose, makeGenerator, nameOption, neighbourStep, num, rightLabel, shuffle, textOption, type Built } from '../inf-web1';
import type { Rng } from '../types';

export const ID = 'inf-indirizzi-domini';

const PREFIXES = [
	[192, 0, 2],
	[198, 51, 100],
	[203, 0, 113]
];
const plain = (label: string) => textOption(label);
const address = (rng: Rng) => `${rng.pick(PREFIXES).join('.')}.${rng.int(1, 254)}`;

// ---------------------------------------------------------------------------
// Level 1: is it an IPv4 address

type Flaw = 'grande' | 'tre' | 'cinque' | 'virgole';
const FLAW_WHY: Record<Flaw, string> = {
	grande: 'ha un numero più grande di 255',
	tre: 'ha solo tre numeri',
	cinque: 'ha cinque numeri',
	virgole: 'usa le virgole al posto dei punti'
};

/** A valid address: the last byte is often one of the two ends, which students doubt. */
function valid(rng: Rng): string {
	const r = rng.next();
	return `${rng.pick(PREFIXES).join('.')}.${r < 0.15 ? 0 : r < 0.35 ? 255 : rng.int(1, 254)}`;
}

function flawed(rng: Rng, flaw: Flaw): string {
	const p = rng.pick(PREFIXES);
	const x = rng.int(1, 254);
	if (flaw === 'grande') {
		const big = rng.next() < 0.4 ? 256 : rng.int(257, 420);
		return rng.next() < 0.7 ? `${p.join('.')}.${big}` : `${p[0]}.${big}.${p[2]}.${x}`;
	}
	if (flaw === 'tre') return `${p[0]}.${p[1]}.${x}`;
	if (flaw === 'cinque') return `${p.join('.')}.${x}.${rng.int(1, 254)}`;
	return `${p.join(',')},${x}`;
}

function distinct(n: number, make: () => string): string[] {
	const out: string[] = [];
	while (out.length < n) {
		const s = make();
		if (!out.includes(s)) out.push(s);
	}
	return out;
}

function level1(rng: Rng): Built {
	const r = rng.next();
	const prompt = "Controlla com'è scritto ogni indirizzo.";
	const rule = 'Un indirizzo IPv4 è fatto di quattro numeri, ognuno tra 0 e 255, separati da punti.';
	if (r < 0.4) {
		const right = valid(rng);
		const flaws = shuffle(rng, ['grande', 'tre', 'cinque', 'virgole'] as const).slice(0, 3);
		const wrong = flaws.map((f) => flawed(rng, f));
		const answer = choose(rng, plain(right), wrong.map(plain));
		return {
			prompt,
			problem: 'Quale di queste scritture è un indirizzo IPv4?',
			solution: rightLabel(answer),
			steps: [rule, `${right} rispetta la regola${right.endsWith('.255') ? ': 255 è il valore più grande di un byte' : right.endsWith('.0') ? ': anche 0 è un valore di un byte' : ''}.`, `Le altre no: ${wrong.map((w, i) => `${w} ${FLAW_WHY[flaws[i]]}`).join('; ')}.`],
			answer,
			params: { case: 'valido', right, wrong, flaws }
		};
	}
	if (r < 0.8) {
		const flaw = rng.pick(['grande', 'grande', 'tre', 'cinque', 'virgole'] as const);
		const right = flawed(rng, flaw);
		const wrong = distinct(3, () => valid(rng));
		const answer = choose(rng, plain(right), wrong.map(plain));
		return {
			prompt,
			problem: 'Quale di queste scritture non è un indirizzo IPv4?',
			solution: rightLabel(answer),
			steps: [rule, `${right} ${FLAW_WHY[flaw]}: non è un indirizzo IPv4.`, 'Le altre tre hanno quattro numeri tra 0 e 255. Lo 0 e il 255 sono valori di un byte come gli altri.'],
			answer,
			params: { case: 'non valido', right, wrong, flaw }
		};
	}
	const p = rng.pick(PREFIXES);
	const x = rng.int(1, 254);
	const tail = rng.int(1, 0xfff).toString(16);
	const right = `2001:db8::${tail}`;
	const wrong = [`${p.join('.')}.${x}`, `${p.join(':')}:${x}`, `2001.db8.0.${tail}`];
	const answer = choose(rng, plain(right), wrong.map(plain));
	return {
		prompt,
		problem: 'Quale di queste scritture è un indirizzo IPv6?',
		solution: rightLabel(answer),
		steps: ['Un indirizzo IPv6 si scrive in esadecimale, a gruppi separati dai due punti; una fila di gruppi a zero si può sostituire con due volte i due punti.', `${wrong[0]} è un indirizzo IPv4, ${wrong[1]} ha solo quattro gruppi, e ${wrong[2]} usa i punti.`],
		answer,
		params: { case: 'ipv6', right, wrong }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the bytes of an address

const bin8 = (v: number) => v.toString(2).padStart(8, '0');
const reversed = (v: number) => parseInt([...bin8(v)].reverse().join(''), 2);
/** The values a student gets from a byte by a slip: bits read backwards, shifted by one place, the first bit lost, one more. */
const slips = (v: number) => [reversed(v), v >> 1, (v << 1) & 255, v ^ 128, (v + 1) % 256, v ^ 1, v ^ 64];
/** 45 = 32 + 8 + 4 + 1. */
const weights = (v: number) =>
	[128, 64, 32, 16, 8, 4, 2, 1]
		.filter((w) => v & w)
		.join(' + ');
const ORDINALS = ['primo', 'secondo', 'terzo', 'quarto'];

function level2(rng: Rng): Built {
	const kind = rng.pick(['da binario', 'da binario', 'in binario', 'in binario', 'bit'] as const);
	const p = rng.pick(PREFIXES);
	const x = rng.int(3, 252);
	const bytes = [...p, x];
	const dotted = bytes.join('.');
	const prompt = 'Un indirizzo IPv4 è fatto di quattro byte.';
	if (kind === 'da binario') {
		const answer = choose(
			rng,
			plain(dotted),
			slips(x).map((v) => plain(`${p.join('.')}.${v}`))
		);
		return {
			prompt,
			problem: `In binario un indirizzo IPv4 è ${bytes.map(bin8).join(' ')}. Come si scrive in base dieci?`,
			solution: rightLabel(answer),
			steps: ["Ogni gruppo di 8 bit è un byte: si scrive il suo valore in base dieci, con un punto tra un byte e l'altro.", `L'ultimo gruppo, ${bin8(x)}, vale ${weights(x)}${weights(x).includes('+') ? ` = ${x}` : ''}.`, `L'indirizzo è ${dotted}.`],
			answer,
			params: { case: kind, bytes }
		};
	}
	if (kind === 'in binario') {
		const k = rng.pick([0, 1, 2, 3].filter((i) => bytes[i] !== 0));
		const v = bytes[k];
		const answer = choose(rng, plain(bin8(v)), slips(v).map(bin8).map(plain));
		return {
			prompt,
			problem: `Nell'indirizzo ${dotted}, come si scrive in binario, su 8 bit, il ${ORDINALS[k]} numero?`,
			solution: rightLabel(answer),
			steps: [`Il ${ORDINALS[k]} numero è ${v}, e occupa un byte.`, weights(v).includes('+') ? `${v} = ${weights(v)}: si mette 1 al posto di questi pesi e 0 negli altri, da 128 a 1.` : `${v} è uno dei pesi di un byte: si mette 1 al suo posto e 0 negli altri, da 128 a 1.`, `Su 8 bit è ${bin8(v)}.`],
			answer,
			params: { case: kind, bytes, position: k + 1 }
		};
	}
	const k = rng.int(1, 4);
	const what = ['il primo numero', 'i primi due numeri', 'i primi tre numeri', 'tutti e quattro i numeri'][k - 1];
	const bits = (n: number) => textOption(`${n} bit`, String(n));
	const answer = choose(rng, bits(8 * k), [k, 4 * k, 8 * (k + 1), 8 * (k - 1), 10 * k, 256].filter((n) => n > 0).map(bits));
	return {
		prompt,
		problem: `Nell'indirizzo ${dotted}, quanti bit occupa${k > 1 ? 'no' : ''} ${what}?`,
		solution: rightLabel(answer),
		steps: ['Ogni numero di un indirizzo IPv4 è un byte, cioè 8 bit.', k === 1 ? 'Un numero solo occupa 8 bit.' : `${k} numeri occupano ${k} · 8 = ${8 * k} bit${k === 4 ? ': è la lunghezza di un indirizzo IPv4' : ''}.`],
		answer,
		params: { case: kind, bytes, numbers: k }
	};
}

// ---------------------------------------------------------------------------
// Level 3: how many addresses with n bits

const amount = (n: number) => textOption(num(n), String(n));

function level3(rng: Rng): Built {
	const kind = rng.pick(['quanti', 'quanti', 'quanti', 'massimo', 'massimo', 'massimo', 'bit', 'bit', 'bit', 'bit'] as const);
	const prompt = 'Con un bit in più i valori raddoppiano.';
	if (kind === 'bit') {
		const n = rng.int(3, 10);
		const devices = rng.int(2 ** (n - 1) + 1, 2 ** n);
		const bits = (k: number) => textOption(`${k} bit`, String(k));
		const answer = choose(rng, bits(n), [n - 1, n + 1, n - 2, n + 2].map(bits));
		return {
			prompt,
			problem: `Una rete deve dare un indirizzo diverso a ${devices} dispositivi. Quanti bit deve avere, come minimo, un indirizzo?`,
			solution: rightLabel(answer),
			steps: [`Con ${n - 1} bit gli indirizzi diversi sono $2^{${n - 1}} = ${2 ** (n - 1)}$: meno di ${devices}, non bastano.`, `Con ${n} bit sono $2^{${n}} = ${2 ** n}$: bastano.`],
			answer,
			params: { case: kind, devices }
		};
	}
	const n = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16]);
	const total = 2 ** n;
	if (kind === 'quanti') {
		const answer = choose(rng, amount(total), [2 * n, total - 1, total / 2, total * 2, n * n].map(amount));
		return {
			prompt,
			problem: `Una rete usa indirizzi di ${n} bit. Quanti indirizzi diversi si possono scrivere?`,
			solution: rightLabel(answer),
			steps: ['Ogni bit vale 0 oppure 1: a ogni bit in più le scritture diverse raddoppiano.', `Con ${n} bit sono $2^{${n}} = ${String(total)}$.`],
			answer,
			params: { case: kind, bits: n }
		};
	}
	const answer = choose(rng, amount(total - 1), [total, total + 1, total / 2, 2 * n, total - 2].map(amount));
	return {
		prompt,
		problem: `Gli indirizzi di una rete sono numeri di ${n} bit, contati a partire da 0. Qual è il più grande?`,
		solution: rightLabel(answer),
		steps: [`Con ${n} bit i valori diversi sono $2^{${n}} = ${String(total)}$.`, `Si contano a partire da 0: il più grande è ${String(total)} − 1 = ${String(total - 1)}${n === 8 ? '' : ', come 255 è il più grande con 8 bit'}.`],
		answer,
		params: { case: kind, bits: n }
	};
}

// ---------------------------------------------------------------------------
// The names of levels 4, 5 and 6

/** Second-level names under .example, the domain reserved for examples, with a misspelling of each. */
const SECOND: [string, string][] = [
	['scuola', 'scuoia'],
	['liceo', 'licep'],
	['museo', 'muzeo'],
	['biblioteca', 'bibloteca'],
	['teatro', 'teatto'],
	['comune', 'comume'],
	['squadra', 'squarda'],
	['giornale', 'giornalle'],
	['palestra', 'palesta'],
	['cinema', 'cimena']
];
const THIRD = ['classi', 'gite', 'sport', 'eventi', 'archivio', 'segreteria', 'studenti', 'soci'];
const HOSTS = ['www', 'posta', 'foto', 'orario', 'registro', 'mappe', 'blog', 'video'];
/** Names a swindler registers to put a known name on their left. */
const BAITS = ['accesso-clienti', 'area-utenti', 'login-sicuro', 'servizio-avvisi', 'conferma-dati', 'premi-gratis'];

/** The registered name: `scuola.example`, or the `esempio.it` of the lesson. */
function registered(rng: Rng): [second: string, top: string] {
	return rng.next() < 0.12 ? ['esempio', 'it'] : [rng.pick(SECOND)[0], 'example'];
}

// ---------------------------------------------------------------------------
// Level 4: the levels of a domain name

const LEVEL_ASKS = {
	primo: 'qual è il dominio di primo livello?',
	secondo: 'qual è il dominio di secondo livello?',
	registrato: 'quale parte è il nome che il proprietario ha registrato?',
	terzo: 'qual è il dominio di terzo livello?'
} as const;

function level4(rng: Rng): Built {
	const kind = rng.pick(['primo', 'secondo', 'registrato', 'terzo'] as const);
	const [second, top] = registered(rng);
	const labels = [rng.pick(HOSTS), rng.pick(THIRD), second, top];
	const name = labels.join('.');
	const right = { primo: 3, secondo: 2, registrato: 2, terzo: 1 }[kind];
	const answer = choose(
		rng,
		plain(labels[right]),
		labels.filter((_, i) => i !== right).map(plain)
	);
	return {
		prompt: 'Un nome di dominio si legge da destra.',
		problem: `Nel nome di dominio ${name}, ${LEVEL_ASKS[kind]}`,
		solution: rightLabel(answer),
		steps: [
			'Le parti di un nome di dominio si contano da destra verso sinistra, dalla più generale alla più particolare.',
			`L'ultima parte, ${top}, è il primo livello. Quella prima, ${second}, è il secondo livello: è il nome registrato. Poi viene ${labels[1]}, al terzo livello.`,
			`Quello che sta a sinistra di ${second} lo ha scelto il proprietario, senza chiedere a nessuno.`
		],
		answer,
		params: { case: kind, name }
	};
}

// ---------------------------------------------------------------------------
// Level 5: whose site it is

function level5(rng: Rng): Built {
	const prompt = 'Chi è il proprietario si legge a destra.';
	const bait = rng.pick(BAITS);
	if (rng.next() < 0.5) {
		const [second, top] = registered(rng);
		const host = rng.pick(HOSTS);
		const name = `${host}.${second}.${top}.${bait}.example`;
		const answer = choose(rng, nameOption(`${bait}.example`), [`${second}.${top}`, `${host}.${second}`, `${top}.${bait}`].map(nameOption));
		return {
			prompt,
			problem: `Un messaggio ti invita a entrare nel sito ${name}. Quali sono le due parti che dicono chi ha registrato il nome?`,
			solution: rightLabel(answer),
			steps: ['Il nome registrato si legge alla fine: sono le ultime due parti.', `Qui sono ${bait}.example. Tutto quello che sta a sinistra, compreso ${host}.${second}.${top}, lo ha scritto a piacere chi ha registrato quel nome.`, "È uno dei trucchi del phishing: guarda la fine del nome, non l'inizio."],
			answer,
			params: { case: 'inganno', name }
		};
	}
	const second = rng.pick(SECOND)[0];
	const host = rng.pick(HOSTS);
	const right = `${host}.${second}.example`;
	const wrong = shuffle(rng, [`${second}.example.${bait}.example`, `${second}.esempio.it`, `${host}.${second}.${bait}.example`, `www.${second}.example.${bait}.example`]);
	const answer = choose(rng, nameOption(right), wrong.map(nameOption));
	return {
		prompt,
		problem: `Chi ha registrato ${second}.example è il proprietario di uno solo di questi nomi. Quale?`,
		solution: rightLabel(answer),
		steps: ['Il proprietario si riconosce dalle ultime due parti del nome.', `${right} finisce con ${second}.example: la parte ${host} l'ha aggiunta il proprietario.`, `Gli altri nomi contengono la parola ${second}, ma finiscono in un altro modo: li ha registrati qualcun altro.`],
		answer,
		params: { case: 'stesso', registered: `${second}.example`, names: answer.options.map((o) => o.values[0]) }
	};
}

// ---------------------------------------------------------------------------
// Level 6: the DNS

function level6(rng: Rng): Built {
	const kind = rng.pick(['guasto', 'guasto', 'guasto', 'guasto', 'cambio', 'cambio', 'passi', 'passi', 'passi', 'passi'] as const);
	const [second, typo] = rng.pick(SECOND);
	const name = `www.${second}.example`;
	const prompt = 'Il DNS traduce i nomi di dominio in indirizzi IP.';
	if (kind === 'passi') {
		const ip = address(rng);
		const q = neighbourStep(rng, [`Il browser chiede a un server DNS quale indirizzo ha ${name}`, `Il server DNS risponde con l'indirizzo ${ip}`, `Il browser manda la sua richiesta all'indirizzo ${ip}`, 'Il server web risponde con la pagina']);
		return {
			prompt,
			problem: `Scrivi ${name} nel browser. ${q.ask}`,
			solution: rightLabel(q.answer),
			steps: ["I router leggono solo numeri: prima di tutto il browser deve scoprire l'indirizzo IP che corrisponde al nome.", "L'ordine è: domanda al DNS, risposta con l'indirizzo, richiesta a quell'indirizzo, risposta con la pagina."],
			answer: q.answer,
			params: { case: kind, name, ip, step: q.step, after: q.after }
		};
	}
	const pick = (options: Record<string, string>) => {
		const [right, ...others] = Object.keys(options);
		return choose(
			rng,
			textOption(options[right], right),
			others.map((k) => textOption(options[k], k))
		);
	};
	if (kind === 'cambio') {
		const [from, to] = distinct(2, () => address(rng));
		const answer = pick({
			niente: 'Niente: scrive lo stesso nome',
			numero: `Scrivere ${to} al posto del nome`,
			nome: 'Imparare un nome di dominio nuovo',
			fornitore: 'Cambiare fornitore di accesso'
		});
		return {
			prompt,
			problem: `Il sito ${name} viene spostato su un server nuovo, che ha indirizzo ${to} al posto di ${from}. Che cosa deve fare chi visita il sito?`,
			solution: rightLabel(answer),
			steps: ['Il proprietario aggiorna la voce del DNS, che da quel momento fa corrispondere al nome il nuovo indirizzo.', 'Chi scrive il nome riceve dal DNS il numero nuovo, e arriva al server nuovo senza accorgersi di nulla.'],
			answer,
			params: { case: kind, name, from, to }
		};
	}
	const fault = rng.pick(['dns', 'rete', 'nome'] as const);
	const N = rng.pick(NAMES);
	const story = {
		dns: `Una sera, sul telefono di ${N}, nessun sito si apre scrivendo il nome. Funziona invece un servizio che il telefono raggiunge usando direttamente l'indirizzo IP.`,
		rete: `Una sera, sul telefono di ${N}, nessun sito si apre scrivendo il nome. Non funziona neanche un servizio che il telefono raggiunge usando direttamente l'indirizzo IP.`,
		nome: `Sul telefono di ${N} tutti i siti si aprono, tranne uno: ${N} ha scritto www.${typo}.example al posto di ${name}.`
	}[fault];
	const options = {
		dns: 'Il server DNS non risponde',
		rete: 'Il collegamento a Internet è interrotto',
		nome: 'Il nome è sbagliato, e il DNS traduce solo nomi esatti',
		ip: 'I siti hanno cambiato indirizzo IP'
	};
	const answer = choose(
		rng,
		textOption(options[fault], fault),
		(['dns', 'rete', 'nome', 'ip'] as const).filter((f) => f !== fault).map((f) => textOption(options[f], f))
	);
	const steps = {
		dns: ['I pacchetti verso un indirizzo IP arrivano: il collegamento a Internet funziona.', "Manca la traduzione dei nomi: il server DNS non risponde, e senza l'indirizzo il browser non sa dove mandare la richiesta."],
		rete: ['Non arrivano nemmeno i pacchetti mandati direttamente a un indirizzo IP, che non hanno bisogno del DNS.', 'Il guasto non è nella traduzione dei nomi: è il collegamento a Internet che manca.'],
		nome: ['Gli altri siti si aprono: il collegamento a Internet e il DNS funzionano.', 'Il DNS traduce un nome esatto, lettera per lettera, e non indovina che cosa volevi scrivere: con una lettera sbagliata non trova il sito.']
	}[fault];
	return {
		prompt,
		problem: `${story} Qual è la spiegazione più probabile?`,
		solution: rightLabel(answer),
		steps,
		answer,
		params: { case: kind, fault, name, typed: fault === 'nome' ? `www.${typo}.example` : name, person: N }
	};
}

export default makeGenerator(ID, 'Indirizzi IP e nomi di dominio', {
	1: { label: 'Riconoscere un indirizzo IP', constraints: ['un indirizzo IPv4 tra tre scritture sbagliate (4 su 10), la scrittura sbagliata tra tre indirizzi (4 su 10), un indirizzo IPv6 (2 su 10)'], build: (rng) => breakable(level1(rng)) },
	2: { label: 'I byte di un indirizzo', constraints: ["dai 32 bit all'indirizzo (4 su 10), da un numero ai suoi 8 bit (4 su 10), quanti bit occupano i primi numeri (2 su 10)"], build: (rng) => breakable(level2(rng)) },
	3: { label: 'Quanti indirizzi con n bit', constraints: ['quanti indirizzi con n bit, il più grande contando da 0 (3 su 10 ciascuno), quanti bit servono per un numero di dispositivi (4 su 10)'], build: (rng) => breakable(level3(rng)) },
	4: { label: 'I livelli di un nome di dominio', constraints: ['un nome di quattro parti: primo, secondo, terzo livello o nome registrato'], build: (rng) => breakable(level4(rng)) },
	5: { label: 'Di chi è il sito', constraints: ['le due parti che dicono chi ha registrato un nome ingannevole, o il nome che appartiene a chi ha registrato un dominio, metà ciascuno'], build: (rng) => breakable(level5(rng)) },
	6: { label: 'Il DNS', constraints: ['un guasto dedotto da che cosa funziona (4 su 10), il passo vicino tra i quattro (4 su 10), il sito che cambia server (2 su 10)'], build: (rng) => breakable(level6(rng)) }
});
