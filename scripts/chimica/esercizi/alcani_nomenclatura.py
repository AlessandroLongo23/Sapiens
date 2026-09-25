"""
Nomenclatura IUPAC degli alcani. Lezione: docs/lezioni/chimica/riscritte/alcani-nomenclatura.md

Il generatore costruisce un alcano ramificato e gli dà il nome applicando le regole della lezione:
catena più lunga; a parità, quella con più ramificazioni; numeri più bassi dal primo punto di
differenza; a parità, il numero più basso al sostituente che viene prima in ordine alfabetico.
Le molecole con più catene candidate che darebbero nomi diversi si scartano.

Due tipi di domanda, a caso a ogni livello:
- nome: il disegno nella domanda, quattro nomi tra cui scegliere;
- struttura: il nome nella domanda, quattro disegni tra cui scegliere.

Livelli, ognuno con una difficoltà in più:
1. un solo metile;
2. più metili, con i prefissi di- e tri-;
3. etile e metili insieme: l'ordine alfabetico;
4. la catena più lunga non è quella che sembra (un etile o un propile "in fondo" allunga la catena);
5. tutto insieme, con catene fino a dieci atomi.
"""

from __future__ import annotations

from itertools import combinations

from rdkit import Chem

from comune import Rng, canon, choice, formula, formula_latex, mol_option, mol_svg, sample

ID = 'alcani-nomenclatura'
TITLE = 'Nomenclatura degli alcani'
LEVELS = {
	1: ('Un solo metile', ['un sostituente metile', 'catena principale da 4 a 8 atomi']),
	2: ('Più metili', ['2 o 3 metili, almeno due con lo stesso nome (di-, tri-)', 'catena da 5 a 8 atomi']),
	3: ('Sostituenti diversi', ['almeno un etile e almeno un metile', 'catena da 6 a 9 atomi']),
	4: ('La catena nascosta', ['la catena scritta per costruire la molecola non è la più lunga']),
	5: ('Tutto insieme', ['da 2 a 4 sostituenti', 'catena da 6 a 10 atomi']),
}

ROOT_IT = ['', 'met', 'et', 'prop', 'but', 'pent', 'es', 'ept', 'ott', 'non', 'dec', 'undec', 'dodec']
ROOT_EN = ['', 'meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec', 'undec', 'dodec']
SUB_IT = {1: 'metil', 2: 'etil', 3: 'propil'}
SUB_EN = {1: 'methyl', 2: 'ethyl', 3: 'propyl'}
GROUP = {1: 'metile ($-\\mathrm{CH_3}$)', 2: 'etile ($-\\mathrm{CH_2CH_3}$)', 3: 'propile ($-\\mathrm{CH_2CH_2CH_3}$)'}
MULT_IT = {1: '', 2: 'di', 3: 'tri', 4: 'tetra'}


# ---------------------------------------------------------------------------
# Costruzione

def build(n: int, subs: list[tuple[int, int]]) -> Chem.Mol:
	"""Catena di n carboni (indici 0..n-1) con sostituenti lineari (posizione 1-based, lunghezza)."""
	m = Chem.RWMol()
	for _ in range(n):
		m.AddAtom(Chem.Atom(6))
	for i in range(n - 1):
		m.AddBond(i, i + 1, Chem.BondType.SINGLE)
	for pos, length in subs:
		prev = pos - 1
		for _ in range(length):
			a = m.AddAtom(Chem.Atom(6))
			m.AddBond(prev, a, Chem.BondType.SINGLE)
			prev = a
	mol = m.GetMol()
	Chem.SanitizeMol(mol)
	return mol


def smiles_of(mol: Chem.Mol) -> str:
	return Chem.MolToSmiles(mol)


# ---------------------------------------------------------------------------
# Nomenclatura

def name_parts(n: int, subs: list[tuple[int, int]], lang: str = 'it', alphabetical: bool = True, multipliers: bool = True) -> str:
	"""Il nome dai pezzi. Con `alphabetical=False` o `multipliers=False` produce gli errori tipici."""
	sub_names = SUB_IT if lang == 'it' else SUB_EN
	roots = ROOT_IT if lang == 'it' else ROOT_EN
	groups: dict[int, list[int]] = {}
	for pos, length in subs:
		groups.setdefault(length, []).append(pos)
	order = sorted(groups, key=lambda L: sub_names[L], reverse=not alphabetical)
	mult = MULT_IT if lang == 'it' else {1: '', 2: 'di', 3: 'tri', 4: 'tetra'}
	pieces = []
	for L in order:
		locs = sorted(groups[L])
		pieces.append(','.join(map(str, locs)) + '-' + (mult[len(locs)] if multipliers else '') + sub_names[L])
	parent = roots[n] + ('ano' if lang == 'it' else 'ane')
	return '-'.join(pieces) + parent if pieces else parent


def paths_between_ends(mol: Chem.Mol) -> list[list[int]]:
	ends = [a.GetIdx() for a in mol.GetAtoms() if a.GetDegree() <= 1]
	if mol.GetNumAtoms() == 1:
		return [[0]]
	return [list(Chem.GetShortestPath(mol, i, j)) for i, j in combinations(ends, 2)]


def substituents(mol: Chem.Mol, path: list[int]) -> list[tuple[int, int]] | None:
	"""Sostituenti lungo `path` come (posizione 1-based, lunghezza); None se uno non è lineare."""
	on_path = set(path)
	subs = []
	for pos, a in enumerate(path, 1):
		for nb in mol.GetAtomWithIdx(a).GetNeighbors():
			if nb.GetIdx() in on_path:
				continue
			# ramo lineare: si segue finché c'è un solo atomo nuovo
			length, prev, cur = 1, a, nb
			while True:
				nxt = [x for x in cur.GetNeighbors() if x.GetIdx() != prev]
				if not nxt:
					break
				if len(nxt) > 1:
					return None
				length, prev, cur = length + 1, cur.GetIdx(), nxt[0]
			if length > 3:
				return None
			subs.append((pos, length))
	return subs


def numbering_key(subs: list[tuple[int, int]]) -> tuple:
	"""Chiave da minimizzare: i numeri in ordine, poi i numeri nell'ordine alfabetico dei sostituenti."""
	return (tuple(sorted(p for p, _ in subs)), tuple(p for p, _ in sorted(subs, key=lambda s: (SUB_IT[s[1]], s[0]))))


def name_mol(mol: Chem.Mol) -> dict | None:
	"""Il nome preferito; None se la molecola esce dalle regole della lezione o è ambigua."""
	paths = paths_between_ends(mol)
	longest = max(len(p) for p in paths)
	if longest > 12:
		return None
	candidates = []
	for p in paths:
		if len(p) != longest:
			continue
		for direction in (p, p[::-1]):
			# i rami contano tutti per la regola "più ramificazioni", anche quelli non lineari
			branches = sum(1 for a in direction for nb in mol.GetAtomWithIdx(a).GetNeighbors() if nb.GetIdx() not in set(direction))
			candidates.append((direction, substituents(mol, direction), branches))
	most = max(b for _, _, b in candidates)
	best_chains = [(p, s) for p, s, b in candidates if b == most]
	if any(s is None for _, s in best_chains):
		return None  # la catena da scegliere ha un ramo che la lezione non tratta
	candidates = best_chains
	best = min(numbering_key(s) for _, s in candidates)
	winners = [(p, s) for p, s in candidates if numbering_key(s) == best]
	names = {name_parts(len(p), s) for p, s in winners}
	if len(names) != 1:
		return None
	chain, subs = winners[0]
	return {
		'n': len(chain), 'subs': sorted(subs), 'chain': chain,
		'it': name_parts(len(chain), subs), 'en': name_parts(len(chain), subs, 'en'),
		'reverse': [(len(chain) + 1 - p, L) for p, L in subs],
	}


# ---------------------------------------------------------------------------
# Molecole per livello

def valid_positions(n: int, length: int) -> range:
	"""Un ramo di lunghezza L non allunga la catena se sta tra L+1 e n-L."""
	return range(length + 1, n - length + 1)


def random_subs(rng: Rng, n: int, lengths: list[int]) -> list[tuple[int, int]] | None:
	subs = []
	for L in lengths:
		pos = list(valid_positions(n, L))
		if not pos:
			return None
		subs.append((rng.pick(pos), L))
	if not subs:
		return subs
	# al massimo due rami sullo stesso carbonio
	counts: dict[int, int] = {}
	for p, _ in subs:
		counts[p] = counts.get(p, 0) + 1
	return subs if max(counts.values()) <= 2 else None


def molecule_for(rng: Rng, level: int) -> tuple[Chem.Mol, dict, dict | None]:
	"""(molecola, nome, costruzione ingenua) per il livello; la costruzione serve al livello 4."""
	for _ in range(500):
		naive = None
		if level == 1:
			n = rng.int(4, 8)
			subs = random_subs(rng, n, [1])
		elif level == 2:
			n = rng.int(5, 8)
			subs = random_subs(rng, n, [1] * rng.int(2, 3))
		elif level == 3:
			n = rng.int(6, 9)
			subs = random_subs(rng, n, [2] + [1] * rng.int(1, 2))
		elif level == 4:
			# catena scritta con un ramo "in fondo": etile in 2, propile in 2 o 3
			n0 = rng.int(4, 6)
			L = rng.pick([2, 2, 3])
			pos = rng.pick([2, n0 - 1] if L == 2 else [2, 3, n0 - 1, n0 - 2])
			if not (1 < pos < n0):
				continue
			extra = random_subs(rng, n0, [1] * rng.int(0, 1)) or []
			subs = [(pos, L), *extra]
			naive = {'n': n0, 'subs': subs}
			n = n0
		else:
			n = rng.int(6, 10)
			k = rng.int(2, 4)
			subs = random_subs(rng, n, [rng.pick([1, 1, 2, 3]) for _ in range(k)])
		if not subs:
			continue
		mol = build(n, subs)
		named = name_mol(mol)
		if named is None or named['n'] > 12:
			continue
		lengths = sorted(L for _, L in named['subs'])
		ok = {
			1: lengths == [1],
			2: lengths in ([1, 1], [1, 1, 1]),
			3: 2 in lengths and 1 in lengths and 3 not in lengths,
			4: naive is not None and named['n'] > naive['n'],
			5: 2 <= len(lengths) <= 4 and 6 <= named['n'] <= 10,
		}[level]
		if ok:
			return mol, named, naive
	raise RuntimeError(f'nessuna molecola per il livello {level}')


# ---------------------------------------------------------------------------
# Distrattori

def naive_name(naive: dict) -> str:
	"""Il nome che dà chi prende per principale la catena scritta, numerata dalla parte giusta."""
	n, subs = naive['n'], naive['subs']
	rev = [(n + 1 - p, L) for p, L in subs]
	best = min((subs, rev), key=numbering_key)
	return name_parts(n, best)


def wrong_names(rng: Rng, named: dict, naive: dict | None) -> list[tuple[str, str]]:
	"""(nome sbagliato, errore) in ordine di preferenza, tutti diversi dal nome giusto."""
	n, subs = named['n'], named['subs']
	out: list[tuple[str, str]] = []
	if naive:
		out.append((naive_name(naive), 'catena'))
	rev = name_parts(n, named['reverse'])
	out.append((rev, 'numerazione'))
	if len({L for _, L in subs}) > 1:
		out.append((name_parts(n, subs, alphabetical=False), 'alfabeto'))
	if any(sum(1 for _, L in subs if L == k) > 1 for k in (1, 2, 3)):
		out.append((name_parts(n, subs, multipliers=False), 'prefisso'))
	for dn in rng.shuffle([-1, 1]):
		if 3 <= n + dn <= 12:
			out.append((name_parts(n + dn, subs), 'conteggio'))
	shifted = [(p + 1, L) for p, L in subs]
	if all(p <= n for p, _ in shifted):
		out.append((name_parts(n, shifted), 'posizione'))
	seen, unique = {named['it']}, []
	for name, why in out:
		if name not in seen:
			seen.add(name)
			unique.append((name, why))
	return unique


def isomers(rng: Rng, mol: Chem.Mol, named: dict, k: int = 3) -> list[tuple[Chem.Mol, dict]]:
	"""Molecole diverse con nomi vicini: un ramo spostato, catena di un atomo più lunga o più corta."""
	target = canon(smiles_of(mol))
	n, subs = named['n'], named['subs']
	pool = []
	for _ in range(200):
		kind = rng.pick(['sposta', 'sposta', 'catena', 'altro'])
		new = list(subs)
		nn = n
		if kind == 'sposta':
			i = rng.int(0, len(new) - 1)
			p, L = new[i]
			pos = [q for q in valid_positions(n, L) if q != p]
			if not pos:
				continue
			new[i] = (rng.pick(pos), L)
		elif kind == 'altro':
			# un isomero qualunque con lo stesso numero di carboni, ramificato con metili ed etili
			total = mol.GetNumAtoms()
			nn = rng.int(max(4, total - 4), total)
			rest = total - nn
			new = []
			while rest > 0:
				L = 2 if rest >= 2 and rng.next() < 0.3 else 1
				pos = list(valid_positions(nn, L))
				if not pos:
					break
				new.append((rng.pick(pos), L))
				rest -= L
			if rest:
				continue
		else:
			nn = n + rng.pick([-1, 1])
			if nn < 3 or any(p not in valid_positions(nn, L) for p, L in new):
				continue
		try:
			m = build(nn, new)
		except Exception:  # noqa: BLE001
			continue
		nm = name_mol(m)
		c = canon(smiles_of(m))
		if nm is None or c == target or any(canon(smiles_of(x)) == c for x, _ in pool):
			continue
		pool.append((m, nm))
		if len(pool) == k:
			return pool
	raise RuntimeError('isomeri insufficienti')


# ---------------------------------------------------------------------------
# Spiegazione

def steps_for(named: dict) -> list[str]:
	n, subs = named['n'], named['subs']
	counts: dict[int, int] = {}
	for _, L in subs:
		counts[L] = counts.get(L, 0) + 1
	words = {1: 'un', 2: 'due', 3: 'tre', 4: 'quattro'}
	plural = {1: 'metili ($-\\mathrm{CH_3}$)', 2: 'etili ($-\\mathrm{CH_2CH_3}$)', 3: 'propili ($-\\mathrm{CH_2CH_2CH_3}$)'}
	parts = [f'{words[c]} {plural[L] if c > 1 else GROUP[L]}' for L, c in sorted(counts.items(), key=lambda kv: SUB_IT[kv[0]])]
	groups = parts[0] if len(parts) == 1 else ', '.join(parts[:-1]) + ' e ' + parts[-1]
	verb = "c'è" if len(subs) == 1 else 'ci sono'
	locs = ', '.join(str(p) for p in sorted(p for p, _ in subs))
	rev = ', '.join(str(p) for p in sorted(p for p, _ in named['reverse']))
	steps = [
		f'La catena più lunga ha {n} atomi di carbonio: il nome finisce in "{ROOT_IT[n]}ano".',
		f'Sulla catena {verb} {groups}.',
	]
	if locs != rev:
		steps.append(f'Si numera dalla parte che dà i numeri più bassi: {locs} (dall\'altra parte sarebbero {rev}).')
	elif len(counts) > 1 and sorted(subs) != sorted(named['reverse']):
		steps.append(f'I numeri sono {locs} da tutte e due le parti: il numero più basso va al sostituente che viene prima in ordine alfabetico.')
	else:
		steps.append(f'La molecola è simmetrica: da tutte e due le parti i numeri sono {locs}.')
	if len(counts) > 1:
		order = sorted(counts, key=lambda L: SUB_IT[L])
		names = ' prima di '.join(SUB_IT[L] for L in order)
		mult = any(c > 1 for c in counts.values())
		steps.append(f'I sostituenti si scrivono in ordine alfabetico: {names}' + ('; di- e tri- non contano per l\'ordine.' if mult else '.'))
	steps.append(f'Il nome è {named["it"]}.')
	return steps


def generate(rng: Rng, level: int) -> dict:
	built, _, naive = molecule_for(rng, level)
	smi = smiles_of(built)
	# gli indici degli atomi devono essere quelli del SMILES che si disegna, non della molecola costruita
	mol = Chem.MolFromSmiles(smi)
	named = name_mol(mol)
	kind = rng.pick(['nome', 'struttura'])
	solution_fig = mol_svg(smi, catena=' '.join(map(str, named['chain'])))
	params = {
		'tipo': kind, 'smiles': canon(smi), 'nome': named['it'], 'nome_en': named['en'],
		'n': named['n'], 'sostituenti': named['subs'], 'formula': formula(smi),
		'costruzione': naive, 'catena': named['chain'],
	}
	if kind == 'nome':
		wrong = wrong_names(rng, named, naive)
		first = [w for w in wrong if w[1] in ('catena', 'numerazione')]
		rest = rng.shuffle([w for w in wrong if w not in first])
		picked = (first + rest)[:3]
		correct = {'latex': named['it'], 'text': named['it'], 'values': [named['it']]}
		opts, idx = choice(rng, correct, [{'latex': w, 'text': w, 'values': [w], 'errore': why} for w, why in picked])
		params['errori'] = {w: why for w, why in picked}
		return sample(ID, level, rng.seed, prompt='Qual è il nome IUPAC di questo alcano?',
			figura=mol_svg(smi), options=opts, correct=idx, solution=named['it'],
			steps=steps_for(named), figura_soluzione=solution_fig, params=params)
	others = isomers(rng, mol, named)
	correct = mol_option(smi, 'Formula scheletrica')
	distractors = [mol_option(smiles_of(m), 'Formula scheletrica') | {'nome': nm['it']} for m, nm in others]
	opts, idx = choice(rng, correct, distractors)
	for i, o in enumerate(opts, 1):
		o['text'] = f'Formula scheletrica {i}'
	params['distrattori'] = [{'smiles': canon(smiles_of(m)), 'nome': nm['it']} for m, nm in others]
	return sample(ID, level, rng.seed, prompt=f'Quale di queste molecole è il {named["it"]}?',
		problem=f'${formula_latex(formula(smi))}$', options=opts, correct=idx, solution=named['it'],
		steps=steps_for(named), figura_soluzione=solution_fig, params=params)


def check(s: dict) -> list[str]:
	p = s['params']
	errs = []
	subs = [tuple(x) for x in p['sostituenti']]
	lengths = sorted(L for _, L in subs)
	level = s['level']
	if level == 1 and lengths != [1]:
		errs.append('livello 1: serve un solo metile')
	if level == 2 and (set(lengths) != {1} or not 2 <= len(lengths) <= 3):
		errs.append('livello 2: servono 2 o 3 metili')
	if level == 3 and not (2 in lengths and 1 in lengths):
		errs.append('livello 3: servono etile e metile')
	if level == 4 and not (p['costruzione'] and p['n'] > p['costruzione']['n']):
		errs.append('livello 4: la catena scritta deve essere più corta di quella vera')
	if len(s['options']) != 4:
		errs.append('servono 4 opzioni')
	return errs
