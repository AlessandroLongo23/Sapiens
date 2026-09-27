// IPv4 subnets: network, broadcast, hosts from an address and a prefix or a mask, checked on every prefix.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { subnet } = await jiti.import('../../src/lib/tools/subnet.ts');

const value = (o, label) => o.rows.find((r) => r.label === label)?.value.replace(/^\$\\text\{([\d.]+)\}(\/\d+)?\$$/, '$1');

test('a /26', () => {
	const o = subnet('192.168.10.77', '/26');
	assertReadable(o, '/26');
	assert.equal(value(o, 'Indirizzo di rete'), '192.168.10.64');
	assert.equal(value(o, 'Indirizzo di broadcast'), '192.168.10.127');
	assert.equal(value(o, 'Primo host'), '192.168.10.65');
	assert.equal(value(o, 'Ultimo host'), '192.168.10.126');
	assert.equal(value(o, 'Host utilizzabili'), '$62$');
	assert.equal(value(o, 'Subnet mask'), '255.255.255.192');
	assert.equal(value(o, 'Subnet mask in binario'), '$\\mathtt{11111111.11111111.11111111.11000000}$');
	// The AND, octet by octet: the network part and the host part split in the fourth.
	assert.deepEqual(o.steps[2].table.rows[2], ['AND', '$\\mathtt{11000000}$', '$\\mathtt{10101000}$', '$\\mathtt{00001010}$', '$\\mathtt{01}\\,\\hl{\\mathtt{000000}}$']);
	assert.equal(o.steps[0].group, 'La subnet mask');
});

test('the mask instead of the prefix, and the prefix in the address', () => {
	const a = subnet('10.1.2.3', '255.255.240.0');
	const b = subnet('10.1.2.3/20', '');
	assertReadable(a, 'mask');
	assert.deepEqual(a.rows, b.rows);
	assert.equal(value(a, 'Indirizzo di rete'), '10.1.0.0');
	assert.equal(value(a, 'Indirizzo di broadcast'), '10.1.15.255');
	assert.equal(value(a, 'Host utilizzabili'), '$4094$');
	assert.match(a.steps[0].math[0], /prefisso/);
});

test('/31, /32, /0 and the network address itself', () => {
	const p31 = subnet('10.0.0.1', '31');
	assertReadable(p31, '/31');
	assert.equal(value(p31, 'Host utilizzabili'), '$2$');
	assert.equal(value(p31, 'Indirizzo di broadcast'), undefined);
	const p32 = subnet('10.0.0.1', '32');
	assertReadable(p32, '/32');
	assert.equal(value(p32, 'Unico host'), '10.0.0.1');
	const p0 = subnet('1.2.3.4', '0');
	assertReadable(p0, '/0');
	assert.equal(value(p0, 'Host utilizzabili'), '$4\\,294\\,967\\,294$');
	assert.match(subnet('192.168.1.0', '24').steps[2].then, /quello di rete/);
	assert.match(subnet('192.168.1.255', '24').steps[2].then, /broadcast/);
});

test('wrong inputs', () => {
	for (const [a, p] of [
		['', '24'],
		['192.168.1', '24'],
		['192.168.1.300', '24'],
		['192.168.1.1', '33'],
		['192.168.1.1', ''],
		['192.168.1.1', '255.0.255.0'],
		['192.168.1.1', 'abc']
	]) {
		const o = subnet(a, p);
		assert.equal(o.ok, false, `${a} ${p}`);
		assertReadable(o, `${a} ${p}`);
	}
});

test('every prefix, against a computation on numbers', () => {
	const ips = [[192, 168, 10, 77], [10, 20, 30, 40], [172, 16, 255, 1], [255, 255, 255, 255], [0, 0, 0, 0]];
	for (const ip of ips)
		for (let p = 0; p <= 32; p++) {
			const n = ((ip[0] << 24) | (ip[1] << 16) | (ip[2] << 8) | ip[3]) >>> 0;
			const size = 2 ** (32 - p);
			const net = Math.floor(n / size) * size;
			const bc = net + size - 1;
			const dot = (x) => [x >>> 24, (x >>> 16) & 255, (x >>> 8) & 255, x & 255].join('.');
			const o = subnet(ip.join('.'), String(p));
			assert.equal(value(o, 'Indirizzo di rete'), dot(net), `${ip} /${p}`);
			if (p <= 30) {
				assert.equal(value(o, 'Indirizzo di broadcast'), dot(bc), `${ip} /${p}`);
				assert.equal(value(o, 'Primo host'), dot(net + 1));
				assert.equal(value(o, 'Ultimo host'), dot(bc - 1));
			}
			// The mask written out gives the same answer.
			const mask = dot(p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0);
			assert.deepEqual(subnet(ip.join('.'), mask).rows, o.rows, `${ip} ${mask}`);
			if (p % 5 === 1) assertReadable(o, `${ip} /${p}`);
		}
});
