"""
Controllo indipendente di alcani-nomenclatura: non importa niente dal generatore.

- Il nome giusto, tradotto in inglese, letto da OPSIN, deve dare la molecola dell'esercizio.
- Il nome giusto deve essere quello preferito: la catena madre ha tanti atomi quanti la catena più
  lunga della molecola, i numeri sono i più bassi e i sostituenti sono in ordine alfabetico.
- Nelle domande "nome", un distrattore che OPSIN legge come la stessa molecola deve violare una
  regola di preferenza (se no sarebbe un secondo nome giusto).
- Nelle domande "struttura", l'opzione giusta è la molecola del nome e le altre sono molecole diverse.
"""
import re

from rdkit import Chem

IT_EN = [('propil', 'propyl'), ('metil', 'methyl'), ('etil', 'ethyl')]
ROOTS = {'met': 1, 'et': 2, 'prop': 3, 'but': 4, 'pent': 5, 'es': 6, 'ept': 7, 'ott': 8, 'non': 9, 'dec': 10, 'undec': 11, 'dodec': 12}
EN_ROOTS = {1: 'meth', 2: 'eth', 3: 'prop', 4: 'but', 5: 'pent', 6: 'hex', 7: 'hept', 8: 'oct', 9: 'non', 10: 'dec', 11: 'undec', 12: 'dodec'}
NAME = re.compile(r'^((?:\d+(?:,\d+)*-(?:di|tri|tetra)?(?:metil|etil|propil)-?)*)(' + '|'.join(sorted(ROOTS, key=len, reverse=True)) + r')ano$')
PIECE = re.compile(r'(\d+(?:,\d+)*)-(di|tri|tetra)?(metil|etil|propil)')
MULT = {None: 1, '': 1, 'di': 2, 'tri': 3, 'tetra': 4}


def parse(name):
	"""nome → (n, [(locanti, sostituente, moltiplicatore)]) o None se non è un nome di alcano ben scritto."""
	m = NAME.match(name)
	if not m:
		return None
	pieces = [(list(map(int, g[0].split(','))), g[2], g[1]) for g in PIECE.findall(m.group(1))]
	return ROOTS[m.group(2)], pieces


def to_en(name):
	parsed = parse(name)
	if not parsed:
		return None
	n, pieces = parsed
	subs = '-'.join(','.join(map(str, locs)) + '-' + (mult or '') + dict(IT_EN)[sub] for locs, sub, mult in pieces)
	return subs + EN_ROOTS[n] + 'ane'


def longest_chain(mol):
	d = Chem.GetDistanceMatrix(mol)
	return int(d.max()) + 1


def preference_errors(name, smiles):
	"""Le regole che il nome viola, per la molecola data."""
	parsed = parse(name)
	if not parsed:
		return ['nome malformato']
	n, pieces = parsed
	errs = []
	if any(len(locs) != MULT[mult] for locs, _, mult in pieces):
		errs.append('moltiplicatore sbagliato')
	if [p[1] for p in pieces] != sorted(p[1] for p in pieces):
		errs.append('ordine alfabetico')
	mol = Chem.MolFromSmiles(smiles)
	if n != longest_chain(mol):
		errs.append(f'catena di {n}, la più lunga ne ha {longest_chain(mol)}')
	locs = sorted(l for p in pieces for l in p[0])
	rev = sorted(n + 1 - l for l in locs)
	if rev < locs:
		errs.append('numerazione non minima')
	if rev == locs and len(pieces) > 1:
		first = min(pieces, key=lambda p: p[1])
		if min(first[0]) > min(n + 1 - l for l in first[0]):
			errs.append('a parità di numeri, il primo in ordine alfabetico deve avere il numero più basso')
	return errs


def chain_errors(name, smiles, chain):
	"""La catena numerata nella figura della soluzione: indici del SMILES dell'esercizio, un cammino di
	n carboni, e i sostituenti ai numeri del nome."""
	if chain is None:
		return ['manca la catena della figura della soluzione']
	mol = Chem.MolFromSmiles(smiles)
	n, pieces = parse(name)
	errs = []
	if len(chain) != n or len(set(chain)) != n:
		errs.append(f'la catena disegnata ha {len(chain)} atomi, il nome {n}')
	if any(mol.GetBondBetweenAtoms(a, b) is None for a, b in zip(chain, chain[1:])):
		return errs + ['la catena disegnata non è un cammino: la numerazione salta']
	on = set(chain)
	found = sorted(pos for pos, a in enumerate(chain, 1) for nb in mol.GetAtomWithIdx(a).GetNeighbors() if nb.GetIdx() not in on)
	expected = sorted(l for locs, _, _ in pieces for l in locs)
	if found != expected:
		errs.append(f'nella figura i rami stanno a {found}, nel nome a {expected}')
	return errs


def check(sample, opsin):
	p = sample['params']
	errs = []
	target = Chem.CanonSmiles(p['smiles'])
	name = sample['solution']
	en = to_en(name)
	if en is None:
		return [f'nome giusto malformato: {name}'], p['tipo']
	got = opsin(en)
	if not got or Chem.CanonSmiles(got) != target:
		errs.append(f'OPSIN legge {en} come {got}, non {target}')
	errs += [f'nome giusto: {e}' for e in preference_errors(name, target)]
	errs += chain_errors(name, p['smiles'], p.get('catena'))
	opts = sample['options']
	right = opts[sample['correct']]
	if p['tipo'] == 'nome':
		if right['latex'] != name:
			errs.append('l\'opzione giusta non è il nome')
		for i, o in enumerate(opts):
			if i == sample['correct']:
				continue
			if o['latex'] == name:
				errs.append('distrattore uguale al nome giusto')
			w_en = to_en(o['latex'])
			w = opsin(w_en) if w_en else ''
			if w and Chem.CanonSmiles(w) == target and not preference_errors(o['latex'], target):
				errs.append(f'il distrattore {o["latex"]} è un nome valido della stessa molecola')
	else:
		if right['values'][0] != target:
			errs.append('il disegno giusto non è la molecola del nome')
		for i, o in enumerate(opts):
			if i != sample['correct'] and o['values'][0] == target:
				errs.append('un distrattore è la stessa molecola')
		if len({o['values'][0] for o in opts}) != 4:
			errs.append('disegni ripetuti')
		for d in p['distrattori']:
			d_en = to_en(d['nome'])
			got = opsin(d_en) if d_en else ''
			if not got or Chem.CanonSmiles(got) != Chem.CanonSmiles(d['smiles']):
				errs.append(f'il nome del distrattore {d["nome"]} non corrisponde al disegno')
	return errs, p['tipo']
