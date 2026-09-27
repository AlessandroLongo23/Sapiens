import { fail, type Outcome, type Step } from './types';
import { intTex, intText } from './numbers';

/**
 * An IPv4 subnet from an address and its prefix (/26) or subnet mask (255.255.255.192), the way the networking
 * lessons do it: the mask in binary, the AND bit by bit of address and mask for the network address, the host bits
 * set to 1 for the broadcast, the first and last host next to them, and 2^(32 − prefix) − 2 hosts. The /31 (two
 * addresses, both hosts, for a point-to-point link, RFC 3021) and the /32 (one address) are said apart.
 */

const octets = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255);
const dotted = (n: number) => octets(n).join('.');
const bits8 = (x: number) => x.toString(2).padStart(8, '0');
const addrTex = (n: number) => `\\text{${dotted(n)}}`;
const maskOf = (prefix: number) => (prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0);

/** "192.168.1.10" → the 32-bit number, or an error. */
function readAddress(s: string, what: string): number | string {
	const parts = s.trim().split('.');
	if (parts.length !== 4 || parts.some((p) => !/^\d{1,3}$/.test(p))) return `Scrivi ${what} come quattro numeri separati da punti, per esempio 192.168.1.10.`;
	const ns = parts.map(Number);
	if (ns.some((n) => n > 255)) return `Ogni numero ${what === 'l’indirizzo' ? 'dell’indirizzo' : 'della mask'} va da 0 a 255: ${ns.find((n) => n > 255)} è troppo grande.`;
	return ((ns[0] << 24) | (ns[1] << 16) | (ns[2] << 8) | ns[3]) >>> 0;
}

/** "/26", "26", "255.255.255.192" → the prefix length, or an error. */
function readPrefix(s: string): { prefix: number; fromMask: boolean } | string {
	const t = s.trim().replace(/^\//, '');
	if (!t) return 'Scrivi il prefisso, per esempio /24, oppure la subnet mask, per esempio 255.255.255.0.';
	if (/^\d{1,2}$/.test(t)) {
		const p = Number(t);
		if (p > 32) return 'Il prefisso va da 0 a 32, per esempio /24.';
		return { prefix: p, fromMask: false };
	}
	const m = readAddress(t, 'la subnet mask');
	if (typeof m === 'string') return 'Scrivi il prefisso, per esempio /24, oppure la subnet mask, per esempio 255.255.255.0.';
	const b = m.toString(2).padStart(32, '0');
	if (!/^1*0*$/.test(b)) return `Questa non è una subnet mask: in binario è ${octets(m).map(bits8).join('.')}, e gli 1 devono stare tutti a sinistra, senza 0 in mezzo.`;
	return { prefix: b.indexOf('0') === -1 ? 32 : b.indexOf('0'), fromMask: true };
}

/** The four octets of n in binary as table cells, the bits of the host part marked when asked. */
function binCells(n: number, prefix: number, hlHost = false, hlNet = false): string[] {
	return octets(n).map((o, i) => {
		const b = bits8(o);
		const net = Math.max(0, Math.min(8, prefix - 8 * i));
		const netPart = b.slice(0, net);
		const hostPart = b.slice(net);
		const wrap = (x: string, hl: boolean) => (x ? (hl ? `\\hl{\\mathtt{${x}}}` : `\\mathtt{${x}}`) : '');
		return `$${wrap(netPart, hlNet)}${net && hostPart ? '\\,' : ''}${wrap(hostPart, hlHost)}$`;
	});
}

const HEAD = ['', '1° ottetto', '2° ottetto', '3° ottetto', '4° ottetto'];

export function subnet(addressInput: string, prefixInput: string): Outcome {
	// "192.168.1.10/24" in the address field.
	let addrText = addressInput.trim();
	let prefText = prefixInput;
	const slash = /^(.*)\/(\d{1,2})$/.exec(addrText);
	if (slash) {
		addrText = slash[1].trim();
		prefText = slash[2];
	}
	if (!addrText) return fail('Scrivi l’indirizzo IP, per esempio 192.168.1.10.');
	const ip = readAddress(addrText, 'l’indirizzo');
	if (typeof ip === 'string') return fail(ip);
	const p = readPrefix(prefText);
	if (typeof p === 'string') return fail(p);
	const { prefix, fromMask } = p;
	const hostBits = 32 - prefix;
	const mask = maskOf(prefix);
	const network = (ip & mask) >>> 0;
	const broadcast = (network | (~mask >>> 0)) >>> 0;
	const total = 2 ** hostBits;
	const hosts = prefix === 32 ? 1 : prefix === 31 ? 2 : total - 2;
	const first = prefix >= 31 ? network : network + 1;
	const last = prefix >= 31 ? broadcast : broadcast - 1;
	const maskBin = octets(mask).map(bits8).join('.');

	const steps: Step[] = [];
	// The mask.
	steps.push({
		group: 'La subnet mask',
		say: fromMask ? 'Scrivi la mask in binario e conta gli $1$: sono i bit della rete.' : prefix === 32 ? 'Scrivi la mask: tutti i $32$ bit a $1$.' : `Scrivi la mask: $${prefix}$ bit a $1$, poi tutti $0$.`,
		table: { head: HEAD, rows: [['Binario', ...binCells(mask, prefix)], ['Decimale', ...octets(mask).map((o) => `$${o}$`)]] },
		math: [fromMask ? `\\text{prefisso} = \\hl{/${prefix}}` : `/${prefix} = \\hl{${addrTex(mask)}}`],
		then: hostBits === 0 ? 'Tutti i bit sono a $1$: non restano bit per l’host.' : hostBits === 1 ? 'I bit a $1$ indicano la rete, l’ultimo bit, a $0$, indica l’host.' : `I bit a $1$ indicano la rete, i $${hostBits}$ bit a $0$ indicano l’host.`
	});
	// The AND.
	steps.push({
		group: 'L’indirizzo di rete',
		say: 'Scrivi l’indirizzo in binario, un ottetto alla volta.',
		table: { head: HEAD, rows: [['Decimale', ...octets(ip).map((o) => `$${o}$`)], ['Binario', ...binCells(ip, prefix)]] }
	});
	steps.push({
		say: 'Fai l’AND bit a bit tra indirizzo e mask.',
		table: {
			head: HEAD,
			rows: [
				['Indirizzo', ...binCells(ip, prefix)],
				['Mask', ...binCells(mask, prefix)],
				['AND', ...binCells(network, prefix, true)],
				['Rete', ...octets(network).map((o) => `$\\hl{${o}}$`)]
			]
		},
		then: prefix === 32 ? 'Il risultato è $1$ solo dove tutti e due i bit sono $1$: con la mask tutta a $1$, l’indirizzo resta uguale.' : 'Il risultato è $1$ solo dove tutti e due i bit sono $1$: la parte host diventa tutta $0$.'
	});
	// Broadcast, hosts.
	if (prefix <= 30) {
		steps.push({
			group: 'Broadcast e host',
			say: 'Per il broadcast, metti a $1$ tutti i bit dell’host.',
			table: {
				head: HEAD,
				rows: [
					['Rete', ...binCells(network, prefix)],
					['Broadcast', ...binCells(broadcast, prefix, true)],
					['Decimale', ...octets(broadcast).map((o) => `$\\hl{${o}}$`)]
				]
			}
		});
		steps.push({
			say: 'Il primo host viene dopo la rete, l’ultimo prima del broadcast.',
			math: [`${addrTex(network)} + 1 = \\hl{${addrTex(first)}}`, `${addrTex(broadcast)} - 1 = \\hl{${addrTex(last)}}`]
		});
		steps.push({
			say: 'Conta gli host: togli rete e broadcast dagli indirizzi della subnet.',
			math: [`2^{${hostBits}} - 2 = ${intTex(total)} - 2`, `= \\hl{${intTex(hosts)}}`],
			then: `Con $${hostBits}$ bit per l’host la subnet ha $${intTex(total)}$ indirizzi.`
		});
	} else if (prefix === 31) {
		steps.push({
			group: 'Gli host',
			say: 'Con /31 restano due indirizzi, e sono tutti e due host.',
			math: [`\\hl{${addrTex(network)}}`, `\\hl{${addrTex(broadcast)}}`],
			then: 'È il caso dei collegamenti tra due router (RFC 3021): non c’è un indirizzo di broadcast.'
		});
	} else {
		steps.push({
			group: 'Gli host',
			say: 'Con /32 la subnet è un solo indirizzo.',
			math: [`\\hl{${addrTex(ip)}}`],
			then: 'Indica un host preciso, per esempio in una regola di un firewall.'
		});
	}
	if (steps.length <= 5) for (const s of steps) delete s.group;

	let note: string | undefined;
	if (prefix <= 30 && ip === network) note = 'L’indirizzo che hai scritto è quello di rete: non si assegna a un computer.';
	else if (prefix <= 30 && ip === broadcast) note = 'L’indirizzo che hai scritto è il broadcast: non si assegna a un computer.';
	if (note) steps[2].then = `${steps[2].then} ${note}`;

	const rows = [
		{ label: 'Indirizzo di rete', value: `$${addrTex(network)}/${prefix}$` },
		...(prefix <= 30 ? [{ label: 'Indirizzo di broadcast', value: `$${addrTex(broadcast)}$` }] : []),
		{ label: prefix === 32 ? 'Unico host' : 'Primo host', value: `$${addrTex(first)}$` },
		...(prefix === 32 ? [] : [{ label: 'Ultimo host', value: `$${addrTex(last)}$` }]),
		{ label: 'Host utilizzabili', value: `$${intTex(hosts)}$` },
		{ label: 'Subnet mask', value: `$${addrTex(mask)}$` },
		{ label: 'Subnet mask in binario', value: `$\\mathtt{${maskBin}}$` }
	];
	return {
		ok: true,
		rows,
		copy:
			prefix <= 30
				? `Rete ${dotted(network)}/${prefix}, broadcast ${dotted(broadcast)}, host da ${dotted(first)} a ${dotted(last)} (${intText(hosts)}), mask ${dotted(mask)}`
				: `Rete ${dotted(network)}/${prefix}, host da ${dotted(first)} a ${dotted(last)} (${intText(hosts)}), mask ${dotted(mask)}`,
		steps
	};
}
