"""
Isomeria. Lezione: docs/lezioni/chimica/riscritte/04-isomeria.md

Livelli, ognuno con una difficoltà in più:
1. isomeri o no: quattro disegni, uno solo ha la stessa formula della molecola data; i distrattori
   hanno gli stessi carboni ma idrogeni diversi, un carbonio in più o in meno, oppure lo stesso
   disegno con un ossigeno al posto di un carbonio (o il contrario);
2. la relazione tra due molecole disegnate: la stessa molecola (disegnata in un altro modo, con un
   SMILES casuale e ruotata), isomeri di struttura, stereoisomeri, non isomeri;
3. quanti carboni chirali ha la molecola disegnata (molecole costruite a caso e molecole vere);
4. quale di quattro alcheni disegnati è E (o Z): tra i distrattori l'isomero geometrico, un alchene
   che "sembra" della configurazione giusta guardando la catena ma non lo è per le priorità, e un
   alchene che non ha isomeri E/Z;
5. R o S dell'unico carbonio chirale della molecola, insieme all'ordine delle priorità: i distrattori mettono i
   gruppi in ordine di massa (l'errore più comune) o sbagliano il verso.

Le molecole si costruiscono a caso con RDKit. Il generatore usa il CIP labeler nuovo
(`rdCIPLabeler`) per R/S ed E/Z, i ranghi CIP legacy per l'ordine dei gruppi e l'algoritmo legacy
per i carboni chirali; il controllo indipendente usa le strade opposte.
"""

from __future__ import annotations

import re

from rdkit import Chem
from rdkit.Chem import Descriptors, rdCIPLabeler
from rdkit.Chem.Draw import rdMolDraw2D

from comune import Rng, canon, formula, formula_latex, mol_option, mol_svg, sample, text_option
from figure import figure_molecole

ID = 'isomeria'
TITLE = 'Isomeria'
LEVELS = {
	1: ('Isomeri o no', ['quattro disegni, uno solo con la stessa formula bruta della molecola data', 'da 4 a 6 carboni']),
	2: ('Che relazione c\'è', ['due molecole disegnate: stessa molecola, isomeri di struttura, stereoisomeri o non isomeri']),
	3: ('Carboni chirali', ['contare i carboni chirali, da 0 a 4', 'molecole costruite a caso o molecole vere']),
	4: ('E o Z', ['quattro alcheni disegnati, uno solo con la configurazione chiesta']),
	5: ('R o S', ['configurazione dell\'unico carbonio chirale e ordine delle priorità']),
}

# ---------------------------------------------------------------------------
# Molecole costruite a caso

FAMILIES = [('alcano',), ('alcol', 'etere'), ('alchene', 'ciclo'), ('carbonile',)]


def family_of(kind: str) -> tuple:
	return next(f for f in FAMILIES if kind in f)


def carbon_tree(rng: Rng, n: int) -> Chem.RWMol:
	m = Chem.RWMol()
	m.AddAtom(Chem.Atom(6))
	for _ in range(n - 1):
		limit = 3 if rng.next() < 0.85 else 4
		free = [a.GetIdx() for a in m.GetAtoms() if a.GetDegree() < limit]
		new = m.AddAtom(Chem.Atom(6))
		m.AddBond(rng.pick(free), new, Chem.BondType.SINGLE)
	return m


def finish(m: Chem.RWMol) -> Chem.Mol | None:
	try:
		mol = m.GetMol()
		Chem.SanitizeMol(mol)
		return Chem.MolFromSmiles(Chem.MolToSmiles(mol))
	except Exception:  # noqa: BLE001
		return None


def build(rng: Rng, kind: str, n: int) -> Chem.Mol | None:
	"""Una molecola a caso del tipo dato con n atomi di carbonio."""
	m = carbon_tree(rng, n)
	carbons = [a.GetIdx() for a in m.GetAtoms()]
	if kind == 'alcol':
		free = [i for i in carbons if m.GetAtomWithIdx(i).GetDegree() < 4]
		o = m.AddAtom(Chem.Atom(8))
		m.AddBond(rng.pick(free), o, Chem.BondType.SINGLE)
	elif kind == 'etere':
		if n < 2:
			return None
		b = rng.pick(list(m.GetBonds()))
		i, j = b.GetBeginAtomIdx(), b.GetEndAtomIdx()
		m.RemoveBond(i, j)
		o = m.AddAtom(Chem.Atom(8))
		m.AddBond(i, o, Chem.BondType.SINGLE)
		m.AddBond(o, j, Chem.BondType.SINGLE)
	elif kind == 'alchene':
		ok = [b for b in m.GetBonds() if b.GetBeginAtom().GetDegree() <= 3 and b.GetEndAtom().GetDegree() <= 3]
		if not ok:
			return None
		rng.pick(ok).SetBondType(Chem.BondType.DOUBLE)
	elif kind == 'ciclo':
		mol = m.GetMol()
		dist = Chem.GetDistanceMatrix(mol)
		pairs = [(i, j) for i in carbons for j in carbons if i < j and 2 <= dist[i][j] <= 5
			and m.GetAtomWithIdx(i).GetDegree() < 4 and m.GetAtomWithIdx(j).GetDegree() < 4]
		if not pairs:
			return None
		# anelli da 5 e 6 più spesso di quelli da 3 e 4
		big = [p for p in pairs if dist[p[0]][p[1]] >= 4]
		i, j = rng.pick(big if big and rng.next() < 0.8 else pairs)
		m.AddBond(i, j, Chem.BondType.SINGLE)
	elif kind == 'carbonile':
		free = [i for i in carbons if m.GetAtomWithIdx(i).GetDegree() <= 2]
		o = m.AddAtom(Chem.Atom(8))
		m.AddBond(rng.pick(free), o, Chem.BondType.DOUBLE)
	return finish(m)


def inchi(mol: Chem.Mol) -> str:
	return Chem.MolToInchi(mol)


def smi(mol: Chem.Mol) -> str:
	return Chem.MolToSmiles(mol)


def same_formula_other(rng: Rng, mol: Chem.Mol, kinds: tuple, n: int, avoid: set[str]) -> Chem.Mol:
	target = formula(smi(mol))
	for _ in range(300):
		other = build(rng, rng.pick(list(kinds)), n)
		if other is not None and formula(smi(other)) == target and inchi(other) not in avoid:
			return other
	raise RuntimeError('nessun isomero')


def swap_element(rng: Rng, mol: Chem.Mol) -> Chem.Mol | None:
	"""Lo stesso disegno con un ossigeno al posto di un carbonio, o un carbonio al posto dell'ossigeno."""
	m = Chem.RWMol(mol)
	oxygens = [a.GetIdx() for a in m.GetAtoms() if a.GetAtomicNum() == 8]
	if oxygens:
		m.GetAtomWithIdx(oxygens[0]).SetAtomicNum(6)
	else:
		ok = [a.GetIdx() for a in m.GetAtoms() if a.GetDegree() <= 2 and not a.GetIsAromatic()
			and all(b.GetBondType() == Chem.BondType.SINGLE for b in a.GetBonds())]
		if not ok:
			return None
		m.GetAtomWithIdx(rng.pick(ok)).SetAtomicNum(8)
	for a in m.GetAtoms():
		a.SetNoImplicit(False)
		a.SetNumExplicitHs(0)
	return finish(m)


def move_atom(rng: Rng, mol: Chem.Mol) -> Chem.Mol | None:
	"""Un atomo in fondo a un ramo staccato e riattaccato altrove: stessa formula, altro scheletro."""
	m = Chem.RWMol(mol)
	ends = [a.GetIdx() for a in m.GetAtoms() if a.GetDegree() == 1
		and a.GetBonds()[0].GetBondType() == Chem.BondType.SINGLE]
	if not ends:
		return None
	e = rng.pick(ends)
	old = m.GetAtomWithIdx(e).GetNeighbors()[0].GetIdx()
	m.RemoveBond(e, old)
	limit = 2 if m.GetAtomWithIdx(e).GetAtomicNum() == 8 else 3
	free = [a.GetIdx() for a in m.GetAtoms() if a.GetIdx() not in (e, old) and a.GetAtomicNum() == 6
		and a.GetDegree() + sum(b.GetBondTypeAsDouble() - 1 for b in a.GetBonds()) < limit + 1]
	if not free:
		return None
	m.AddBond(rng.pick(free), e, Chem.BondType.SINGLE)
	return finish(m)


def stereo_elements(mol: Chem.Mol) -> tuple[list[int], list[int]]:
	"""(carboni chirali, doppi legami con E/Z) possibili, anche non specificati (algoritmo legacy)."""
	centers = [i for i, _ in Chem.FindMolChiralCenters(mol, includeUnassigned=True, useLegacyImplementation=True)]
	m = Chem.Mol(mol)
	Chem.FindPotentialStereoBonds(m, cleanIt=True)
	bonds = [b.GetIdx() for b in m.GetBonds() if b.GetStereo() == Chem.BondStereo.STEREOANY]
	return centers, bonds


def with_stereo(rng: Rng, mol: Chem.Mol) -> Chem.Mol | None:
	"""La molecola con il suo unico elemento stereo fissato a caso; None se non ne ha esattamente uno."""
	centers, bonds = stereo_elements(mol)
	if len(centers) + len(bonds) != 1:
		return None
	from rdkit.Chem.EnumerateStereoisomers import EnumerateStereoisomers
	options = [Chem.MolFromSmiles(Chem.MolToSmiles(x)) for x in EnumerateStereoisomers(mol)]
	options = [x for x in options if x is not None]
	if len(options) != 2:
		return None
	return rng.pick(options)


def invert(mol: Chem.Mol) -> Chem.Mol:
	m = Chem.Mol(mol)
	for a in m.GetAtoms():
		if a.GetChiralTag() in (Chem.ChiralType.CHI_TETRAHEDRAL_CW, Chem.ChiralType.CHI_TETRAHEDRAL_CCW):
			a.InvertChirality()
	for b in m.GetBonds():
		if b.GetStereo() == Chem.BondStereo.STEREOE:
			b.SetStereo(Chem.BondStereo.STEREOZ)
		elif b.GetStereo() == Chem.BondStereo.STEREOZ:
			b.SetStereo(Chem.BondStereo.STEREOE)
	return Chem.MolFromSmiles(Chem.MolToSmiles(m))


def random_smiles(rng: Rng, mol: Chem.Mol) -> str:
	"""Un SMILES non canonico: stesso composto, atomi in un altro ordine, quindi un altro disegno."""
	order = rng.shuffle(list(range(mol.GetNumAtoms())))
	m = Chem.RenumberAtoms(mol, order)
	return Chem.MolToSmiles(m, canonical=False)


def cip_labels(mol: Chem.Mol) -> dict:
	m = Chem.Mol(mol)
	rdCIPLabeler.AssignCIPLabels(m)
	atoms = {a.GetIdx(): a.GetProp('_CIPCode') for a in m.GetAtoms() if a.HasProp('_CIPCode')}
	bonds = {b.GetIdx(): b.GetProp('_CIPCode') for b in m.GetBonds() if b.HasProp('_CIPCode')}
	return {'atomi': atoms, 'legami': bonds}


def formula_text(f: str) -> str:
	return f'${formula_latex(f)}$'


# ---------------------------------------------------------------------------
# Livello 1: isomeri o no

def level1(rng: Rng) -> dict:
	for _ in range(200):
		kind = rng.pick(['alcano', 'alcol', 'etere', 'alchene', 'ciclo', 'carbonile'])
		n = rng.int(4, 6)
		target = build(rng, kind, n)
		if target is None:
			continue
		t_formula = formula(smi(target))
		seen = {inchi(target)}
		try:
			right = same_formula_other(rng, target, family_of(kind), n, seen)
		except RuntimeError:
			continue
		seen.add(inchi(right))
		wrong: list[tuple[Chem.Mol, str]] = []
		# stessi carboni (e stesso ossigeno), idrogeni diversi
		other_h = {'alcano': ('alchene', 'ciclo'), 'alcol': ('carbonile',), 'etere': ('carbonile',),
			'alchene': ('alcano',), 'ciclo': ('alcano',), 'carbonile': ('alcol', 'etere')}[kind]
		# un carbonio in più o in meno, stesso tipo
		cands = [
			(lambda: build(rng, rng.pick(list(other_h)), n), 'idrogeni'),
			(lambda: build(rng, rng.pick(list(family_of(kind))), n + rng.pick([-1, 1])), 'carboni'),
			(lambda: swap_element(rng, target), 'elemento'),
		]
		for make, why in cands:
			for _ in range(50):
				d = make()
				if d is None or formula(smi(d)) == t_formula or inchi(d) in seen:
					continue
				seen.add(inchi(d))
				wrong.append((d, why))
				break
		if len(wrong) == 3:
			break
	else:
		raise RuntimeError('livello 1: nessuna molecola')

	correct = mol_option(smi(right), 'Molecola')
	distractors = [mol_option(smi(d), 'Molecola') | {'errore': why} for d, why in wrong]
	opts, idx = choice_fixed(rng, correct, distractors)
	for i, o in enumerate(opts, 1):
		o['text'] = f'Molecola {i}'
	steps = [f'La molecola disegnata è {formula_text(t_formula)}: questa è la formula da cercare tra le quattro.']
	for i, o in enumerate(opts, 1):
		f = formula(o['values'][0])
		if i - 1 == idx:
			steps.append(f'Molecola {i}: {formula_text(f)}, la stessa formula con gli atomi legati in un altro modo. È un isomero.')
		else:
			why = describe_difference(t_formula, f, o['errore'])
			steps.append(f'Molecola {i}: {formula_text(f)}, {why}. Non è un isomero.')
	params = {
		'tipo': 'isomero', 'smiles': canon(smi(target)), 'formula': t_formula,
		'opzioni': [o['values'][0] for o in opts],
	}
	return sample(ID, 1, rng.seed, prompt='Quale di queste molecole è un isomero della molecola disegnata?',
		figura=mol_svg(smi(target)), options=opts, correct=idx,
		solution=f'La molecola {idx + 1}, l\'unica con formula {formula_text(t_formula)}.', steps=steps, params=params)


def atom_counts(f: str) -> dict[str, int]:
	return {el: int(n or 1) for el, n in re.findall(r'([A-Z][a-z]?)(\d*)', f)}


def describe_difference(target: str, other: str, why: str) -> str:
	t, o = atom_counts(target), atom_counts(other)
	if why == 'idrogeni':
		return 'con gli stessi atomi di carbonio, ma un numero diverso di idrogeni'
	if why == 'carboni':
		return 'con un atomo di carbonio in più' if o.get('C', 0) > t.get('C', 0) else 'con un atomo di carbonio in meno'
	if o.get('O', 0) > t.get('O', 0):
		return 'con uno scheletro simile, ma un ossigeno dove la molecola data ha un carbonio'
	return 'con uno scheletro simile, ma un carbonio dove la molecola data ha l\'ossigeno'


def choice_fixed(rng: Rng, correct: dict, distractors: list[dict]) -> tuple[list[dict], int]:
	from comune import choice
	return choice(rng, correct, distractors)


# ---------------------------------------------------------------------------
# Livello 2: che relazione c'è

RELATIONS = [
	('stessa', 'Sono la stessa molecola'),
	('struttura', 'Sono isomeri di struttura'),
	('stereo', 'Sono stereoisomeri'),
	('nessuna', 'Non sono isomeri'),
]


def pair_for(rng: Rng, case: str) -> tuple[Chem.Mol, Chem.Mol]:
	for _ in range(400):
		kind = rng.pick(['alcano', 'alcol', 'etere', 'alchene', 'ciclo', 'carbonile'])
		n = rng.int(4, 6)
		a = build(rng, kind, n)
		if a is None:
			continue
		if case == 'stereo' or (case == 'stessa' and rng.next() < 0.5):
			a = with_stereo(rng, a)
			if a is None:
				continue
			return a, (invert(a) if case == 'stereo' else Chem.Mol(a))
		if case == 'stessa':
			return a, Chem.Mol(a)
		if case == 'struttura':
			b = move_atom(rng, a) if rng.next() < 0.6 else build(rng, rng.pick(list(family_of(kind))), n)
			if b is None or formula(smi(b)) != formula(smi(a)):
				continue
			if Chem.MolToInchi(b, options='-SNon') == Chem.MolToInchi(a, options='-SNon'):
				continue
			return a, b
		# non isomeri: lo stesso scheletro con un atomo in più, in meno o cambiato, o un doppio legame
		mode = rng.pick(['elemento', 'carbonio', 'legame'])
		if mode == 'elemento':
			b = swap_element(rng, a)
		elif mode == 'carbonio':
			m = Chem.RWMol(a)
			free = [x.GetIdx() for x in m.GetAtoms() if x.GetAtomicNum() == 6 and x.GetTotalNumHs() > 0]
			c = m.AddAtom(Chem.Atom(6))
			m.AddBond(rng.pick(free), c, Chem.BondType.SINGLE)
			b = finish(m)
		else:
			m = Chem.RWMol(a)
			ok = [x for x in m.GetBonds() if x.GetBondType() == Chem.BondType.SINGLE
				and x.GetBeginAtom().GetTotalNumHs() > 0 and x.GetEndAtom().GetTotalNumHs() > 0
				and x.GetBeginAtom().GetAtomicNum() == 6 and x.GetEndAtom().GetAtomicNum() == 6]
			if not ok:
				continue
			rng.pick(ok).SetBondType(Chem.BondType.DOUBLE)
			b = finish(m)
		if b is None or formula(smi(b)) == formula(smi(a)):
			continue
		for x in (a, b):
			Chem.RemoveStereochemistry(x)
		return a, b
	raise RuntimeError(f'livello 2: nessuna coppia {case}')


def level2(rng: Rng) -> dict:
	case = rng.pick([c for c, _ in RELATIONS])
	for _ in range(50):
		a, b = pair_for(rng, case)
		# niente molecole troppo simmetriche (il ciclopentano disegnato due volte è sempre uguale)
		if len(set(Chem.CanonicalRankAtoms(a, breakTies=False))) < 3:
			continue
		s1, s2 = random_smiles(rng, a), random_smiles(rng, b)
		for _ in range(10):
			if s2 != s1:
				break
			s2 = random_smiles(rng, b)
		if s2 != s1:
			break
	else:
		raise RuntimeError('livello 2: disegni tutti uguali')
	r1 = rng.pick([0, 0, 30, 330])
	r2 = rng.pick([90, 120, 150, 180, 210, 240, 270])
	fig = figure_molecole({'colonne': '2'}, [f'{s1} | A | ruota: {r1}', f'{s2} | B | ruota: {r2}'])['svg']
	opts = [text_option(t, [c]) for c, t in RELATIONS]
	idx = [c for c, _ in RELATIONS].index(case)
	fa, fb = formula(smi(a)), formula(smi(b))
	steps = [f'Formula di A: {formula_text(fa)}; formula di B: {formula_text(fb)}.']
	if case == 'nessuna':
		steps.append('Le formule sono diverse: le due molecole non sono isomeri, per quanto si somiglino.')
	else:
		steps.append('Le formule sono uguali: le due molecole sono isomeri, oppure sono la stessa molecola.')
		if case == 'struttura':
			steps.append('Seguendo i legami, gli atomi sono uniti in un ordine diverso (cambia la catena, la posizione di un gruppo o il gruppo funzionale): sono isomeri di struttura.')
		else:
			steps.append('Seguendo i legami, gli atomi sono uniti nello stesso ordine: B ha la stessa catena e gli stessi gruppi di A, disegnati girati o piegati in un altro modo.')
			la, lb = cip_labels(a), cip_labels(b)
			da = sorted(la['atomi'].values()) + sorted(la['legami'].values())
			db = sorted(lb['atomi'].values()) + sorted(lb['legami'].values())
			if da:
				what = 'il carbonio chirale' if la['atomi'] else 'il doppio legame'
				steps.append(f'Resta da guardare la disposizione nello spazio: {what} è {", ".join(da)} in A e {", ".join(db)} in B.')
			if case == 'stessa':
				steps.append('Anche la disposizione nello spazio è la stessa: è la stessa molecola.' if da else 'Nessun carbonio chirale né doppio legame con isomeri E/Z: è la stessa molecola.')
			else:
				steps.append('Le configurazioni sono opposte: sono stereoisomeri.')
	params = {
		'tipo': 'relazione', 'caso': case, 'smiles_a': s1, 'smiles_b': s2,
		'canon_a': canon(smi(a)), 'canon_b': canon(smi(b)),
	}
	return sample(ID, 2, rng.seed, prompt='Che relazione c\'è tra le molecole A e B?', figura=fig,
		options=opts, correct=idx, solution=RELATIONS[idx][1] + '.', steps=steps, params=params)


# ---------------------------------------------------------------------------
# Livello 3: quanti carboni chirali

REAL = [
	('CC(C)C1CCC(C)CC1O', 'il mentolo'),
	('CC1=CCC(CC1=O)C(=C)C', 'il carvone'),
	('CC1=CCC(CC1)C(=C)C', 'il limonene'),
	('CC(C)Cc1ccc(cc1)C(C)C(=O)O', "l'ibuprofene"),
	('CNCC(O)c1ccc(O)c(O)c1', "l'adrenalina"),
	('CC(O)C(N)C(=O)O', 'la treonina'),
	('CCC(C)C(N)C(=O)O', "l'isoleucina"),
	('OCC(O)C(O)C(O)C(O)C=O', 'il glucosio, nella forma a catena aperta'),
	('OCC(O)CO', 'il glicerolo'),
	('OC(=O)CC(O)(CC(=O)O)C(=O)O', "l'acido citrico"),
	('CNC(C)C(O)c1ccccc1', "l'efedrina"),
	('CC1(C)C2CCC1(C)C(=O)C2', 'la canfora'),
	('OC(C(O)C(=O)O)C(=O)O', "l'acido tartarico"),
	('COc1ccc2cc(ccc2c1)C(C)C(=O)O', 'il naprossene'),
	('OC(CC(=O)O)C(=O)O', "l'acido malico"),
	('NC(Cc1ccccc1)C(=O)O', 'la fenilalanina'),
	('CC(C)CC(N)C(=O)O', 'la leucina'),
	('NCC(=O)O', 'la glicina'),
	('CC(=O)Oc1ccccc1C(=O)O', "l'acido acetilsalicilico (l'aspirina)"),
]


def chiral_carbons(mol: Chem.Mol) -> list[int]:
	return sorted(i for i, _ in Chem.FindMolChiralCenters(mol, includeUnassigned=True, useLegacyImplementation=True)
		if mol.GetAtomWithIdx(i).GetAtomicNum() == 6)


def random_chiral_candidate(rng: Rng) -> Chem.Mol | None:
	n = rng.int(4, 8)
	m = carbon_tree(rng, n)
	for _ in range(rng.int(0, 2)):
		z = rng.pick([8, 8, 17, 35])
		free = [a.GetIdx() for a in m.GetAtoms() if a.GetAtomicNum() == 6 and a.GetDegree() < 4]
		x = m.AddAtom(Chem.Atom(z))
		m.AddBond(rng.pick(free), x, Chem.BondType.SINGLE)
	if rng.next() < 0.25:
		ok = [b for b in m.GetBonds() if b.GetBeginAtom().GetAtomicNum() == 6 and b.GetEndAtom().GetAtomicNum() == 6
			and b.GetBeginAtom().GetDegree() <= 3 and b.GetEndAtom().GetDegree() <= 3]
		if ok:
			rng.pick(ok).SetBondType(Chem.BondType.DOUBLE)
	return finish(m)


def level3(rng: Rng) -> dict:
	name = ''
	if rng.next() < 0.4:
		s, name = rng.pick(REAL)
		mol = Chem.MolFromSmiles(s)
	else:
		want = rng.pick([0, 1, 1, 2, 2, 3])
		for _ in range(500):
			mol = random_chiral_candidate(rng)
			if mol is not None and len(chiral_carbons(mol)) == want:
				break
		else:
			raise RuntimeError('livello 3: nessuna molecola')
	centers = chiral_carbons(mol)
	k = len(centers)
	start = rng.int(max(0, k - 3), k)
	values = list(range(start, start + 4))
	opts = [text_option(f'${v}$', [str(v)]) for v in values]
	idx = values.index(k)
	s = smi(mol)
	mol = Chem.MolFromSmiles(s)
	centers = chiral_carbons(mol)
	sol_fig = mol_svg(s, atomi=' '.join(map(str, centers)) + ' giallo') if centers else mol_svg(s)
	steps = [
		'Un carbonio chirale è legato a quattro gruppi tutti diversi. Non lo sono i $\\mathrm{CH_3}$ e i $\\mathrm{CH_2}$ (hanno almeno due idrogeni) né i carboni con un doppio legame (hanno tre gruppi).',
		'Per ogni altro carbonio si guardano i quattro gruppi interi, fino in fondo, non solo l\'atomo legato direttamente.',
	]
	if k:
		steps.append('C\'è un solo carbonio chirale, colorato nel disegno della soluzione.' if k == 1 else f'I carboni chirali sono {k}, colorati nel disegno della soluzione.')
	else:
		steps.append(f'Nessun carbonio ha quattro gruppi diversi: la molecola non ha carboni chirali.')
	params = {'tipo': 'chirali', 'smiles': s, 'nome': name, 'centri': centers, 'n': k}
	return sample(ID, 3, rng.seed, prompt='Quanti carboni chirali ha questa molecola?' + (f' È {name}.' if name else ''),
		figura=mol_svg(s), options=opts, correct=idx, solution=f'${k}$', steps=steps,
		figura_soluzione=sol_fig, params=params)


# ---------------------------------------------------------------------------
# Livello 4: E o Z

# (frammento SMILES con l'atomo di attacco per primo, testo, è un gruppo di carbonio)
ALK = {
	'H': ('', 'H', False),
	'CH3': ('C', 'CH_3', True),
	'C2H5': ('CC', 'CH_2CH_3', True),
	'C3H7': ('CCC', 'CH_2CH_2CH_3', True),
	'iPr': ('C(C)C', 'CH(CH_3)_2', True),
	'CH2OH': ('CO', 'CH_2OH', True),
	'COOH': ('C(=O)O', 'COOH', True),
	'Cl': ('Cl', 'Cl', False),
	'Br': ('Br', 'Br', False),
}
CARBON_GROUPS = ['CH3', 'C2H5', 'C3H7', 'iPr', 'CH2OH', 'COOH']


def alkene(a: str, b: str, c: str, d: str, same_side_ac: bool | None) -> Chem.Mol:
	"""C1(a)(b)=C2(c)(d); `same_side_ac` dice se a e c stanno dalla stessa parte (None: niente stereo)."""
	m = Chem.RWMol()
	c1 = m.AddAtom(Chem.Atom(6))
	c2 = m.AddAtom(Chem.Atom(6))
	m.AddBond(c1, c2, Chem.BondType.DOUBLE)
	att = {}
	for key, carbon, g in (('a', c1, a), ('b', c1, b), ('c', c2, c), ('d', c2, d)):
		frag = ALK[g][0]
		if not frag:
			att[key] = None
			continue
		fm = Chem.MolFromSmiles(frag)
		offset = m.GetNumAtoms()
		for atom in fm.GetAtoms():
			m.AddAtom(Chem.Atom(atom.GetAtomicNum()))
		for bond in fm.GetBonds():
			m.AddBond(bond.GetBeginAtomIdx() + offset, bond.GetEndAtomIdx() + offset, bond.GetBondType())
		m.AddBond(carbon, offset, Chem.BondType.SINGLE)
		att[key] = offset
	mol = m.GetMol()
	Chem.SanitizeMol(mol)
	# la percezione stereo va fatta prima di fissare cis/trans, se no MolToSmiles la rifà e li cancella
	Chem.AssignStereochemistry(mol, cleanIt=True, force=True)
	if same_side_ac is not None:
		same = same_side_ac
		r1 = att['a']
		if r1 is None:
			r1, same = att['b'], not same
		r2 = att['c']
		if r2 is None:
			r2, same = att['d'], not same
		bond = mol.GetBondBetweenAtoms(c1, c2)
		bond.SetStereoAtoms(r1, r2)
		bond.SetStereo(Chem.BondStereo.STEREOCIS if same else Chem.BondStereo.STEREOTRANS)
	return Chem.MolFromSmiles(Chem.MolToSmiles(mol))


def ez_label(mol: Chem.Mol) -> str | None:
	labels = cip_labels(mol)['legami']
	return next(iter(labels.values()), None)


def higher(g1: str, g2: str) -> str:
	"""Il gruppo con la priorità più alta tra i due su un carbonio del doppio legame: negli alcheni di
	questo livello si confrontano solo un gruppo e un H, o un alogeno e un gruppo di carbonio."""
	if g2 == 'H':
		return g1
	if g1 == 'H':
		return g2
	return g1 if not ALK[g1][2] else g2


def g_tex(g: str) -> str:
	return f'$\\mathrm{{{ALK[g][1]}}}$'


def stereo_alkene(rng: Rng, trap: bool) -> tuple[str, str, str, str]:
	"""Gruppi (a, b, c, d) di un alchene con isomeri E/Z. Con `trap` la catena inganna: a e d sono
	carboni, c è un alogeno che vince su d; senza, a e c sono carboni e b, d sono H."""
	if trap:
		return rng.pick(CARBON_GROUPS[:4]), 'H', rng.pick(['Cl', 'Br']), rng.pick(CARBON_GROUPS[:4])
	return rng.pick(CARBON_GROUPS), 'H', rng.pick(CARBON_GROUPS), 'H'


def level4(rng: Rng) -> dict:
	target = rng.pick(['E', 'Z'])
	for _ in range(300):
		trap = rng.next() < 0.5
		a, b, c, d = stereo_alkene(rng, trap)
		# per la trappola la catena di carbonio è a–d; senza trappola è a–c
		want_chain_same = rng.next() < 0.5
		right = alkene(a, b, c, d, (not want_chain_same) if trap else want_chain_same)
		if ez_label(right) is None:
			continue
		if ez_label(right) != target:
			right = invert(right)
		if ez_label(right) != target:
			continue
		iso = invert(right)
		# un alchene che "sembra" della configurazione chiesta guardando la catena
		if trap:
			a2, b2, c2, d2 = stereo_alkene(rng, False)
			look = alkene(a2, b2, c2, d2, target == 'E')
			look = look if ez_label(look) != target else invert(look)
			look_why = 'altro'
		else:
			a2, b2, c2, d2 = stereo_alkene(rng, True)
			# catena a2–d2 dalla stessa parte se target è Z: sembra Z, ma è E (e viceversa)
			look = alkene(a2, b2, c2, d2, not (target == 'Z'))
			look_why = 'catena'
		if ez_label(look) == target or ez_label(look) is None:
			continue
		g = rng.pick(CARBON_GROUPS[:3])
		flat = alkene(g, g, rng.pick(CARBON_GROUPS[:4]), 'H', None) if rng.next() < 0.5 else alkene('H', 'H', rng.pick(CARBON_GROUPS + ['Cl']), rng.pick(CARBON_GROUPS[:3]), None)
		if ez_label(flat) is not None:
			continue
		mols = [right, iso, look, flat]
		if len({inchi(x) for x in mols}) == 4:
			break
	else:
		raise RuntimeError('livello 4: nessun alchene')
	correct = mol_option(smi(right), 'Alchene')
	distractors = [mol_option(smi(iso), 'Alchene') | {'errore': 'isomero'},
		mol_option(smi(look), 'Alchene') | {'errore': look_why},
		mol_option(smi(flat), 'Alchene') | {'errore': 'senza'}]
	from comune import choice
	opts, idx = choice(rng, correct, distractors)
	for i, o in enumerate(opts, 1):
		o['text'] = f'Alchene {i}'
	h1, h2 = higher(a, b), higher(c, d)
	lo1, lo2 = (b if h1 == a else a), (d if h2 == c else c)
	word = 'dalla stessa parte' if target == 'Z' else 'da parti opposte'
	steps = [
		f'Nell\'alchene {idx + 1}, sul primo carbonio del doppio legame {g_tex(h1)} ha la priorità più alta di {g_tex(lo1)}; sul secondo {g_tex(h2)} ha la priorità più alta di {g_tex(lo2)}.',
		f'I due gruppi con la priorità più alta stanno {word} del doppio legame: l\'alchene {idx + 1} è {target}.',
	]
	for i, o in enumerate(opts, 1):
		if i - 1 == idx:
			continue
		if o['errore'] == 'isomero':
			steps.append(f'L\'alchene {i} è l\'isomero geometrico dell\'alchene {idx + 1}: è {"E" if target == "Z" else "Z"}.')
		elif o['errore'] == 'catena':
			steps.append(f'Nell\'alchene {i} le catene di carbonio stanno {word}, ma su un carbonio c\'è un alogeno, che ha la priorità più alta: l\'alchene è {"E" if target == "Z" else "Z"}.')
		elif o['errore'] == 'senza':
			steps.append(f'L\'alchene {i} ha un carbonio del doppio legame con due gruppi uguali: non ha isomeri E/Z.')
		else:
			steps.append(f'L\'alchene {i} è {"E" if target == "Z" else "Z"}.')
	sol = mol_svg(smi(right), stereo='si')
	params = {'tipo': 'EZ', 'richiesto': target, 'opzioni': [o['values'][0] for o in opts],
		'errori': [o.get('errore', 'giusta') for o in opts]}
	return sample(ID, 4, rng.seed, prompt=f'Quale di questi alcheni è {target}?', options=opts, correct=idx,
		solution=f'L\'alchene {idx + 1}.', steps=steps, figura_soluzione=sol, params=params)


# ---------------------------------------------------------------------------
# Livello 5: R o S

# (frammento con l'atomo di attacco per primo, testo)
HETERO = {'OH': ('O', 'OH'), 'NH2': ('N', 'NH_2'), 'Cl': ('Cl', 'Cl'), 'Br': ('Br', 'Br'), 'OCH3': ('OC', 'OCH_3')}
CARBON = {
	'CH3': ('C', 'CH_3'), 'C2H5': ('CC', 'CH_2CH_3'), 'C3H7': ('CCC', 'CH_2CH_2CH_3'),
	'iPr': ('C(C)C', 'CH(CH_3)_2'), 'tBu': ('C(C)(C)C', 'C(CH_3)_3'), 'vinile': ('C=C', 'CH{=}CH_2'),
	'COOH': ('C(=O)O', 'COOH'), 'CHO': ('C=O', 'CHO'), 'CH2OH': ('CO', 'CH_2OH'), 'CH2Cl': ('CCl', 'CH_2Cl'),
	'COCH3': ('C(C)=O', 'COCH_3'), 'fenile': ('c1ccccc1', 'C_6H_5'),
}
GROUPS = HETERO | CARBON


def group_mass(g: str) -> float:
	return Descriptors.MolWt(Chem.MolFromSmiles(GROUPS[g][0])) - 1.008


def group_formula(g: str) -> str:
	return formula(GROUPS[g][0])


def ranking_tex(order: list[str]) -> str:
	return ' > '.join(f'\\mathrm{{{GROUPS[g][1]}}}' if g != 'H' else '\\mathrm{H}' for g in order)


def drawn_sense(mol: Chem.Mol, center: int, order: list[int]) -> tuple[str, str]:
	"""Dal disegno: verso di 1 → 2 → 3 (orario/antiorario) e dove sta l'idrogeno (dietro/davanti)."""
	p = rdMolDraw2D.PrepareMolForDrawing(mol)
	conf = p.GetConformer()
	pts = [conf.GetAtomPosition(i) for i in order[:3]]
	area = sum(pts[i].x * pts[(i + 1) % 3].y - pts[(i + 1) % 3].x * pts[i].y for i in range(3))
	sense = 'antiorario' if area > 0 else 'orario'
	h = 'dietro'
	for bd in p.GetAtomWithIdx(center).GetBonds():
		if bd.GetBeginAtomIdx() == center and bd.GetBondDir() == Chem.BondDir.BEGINDASH:
			h = 'davanti'
	return sense, h


def level5(rng: Rng) -> dict:
	for _ in range(500):
		hetero = rng.pick(list(HETERO)) if rng.next() < 0.75 else None
		carbons = rng.sample(list(CARBON), 3 if hetero is None else 2)
		groups = ([hetero] if hetero else []) + carbons
		formulas = [group_formula(g) for g in groups]
		if len(set(formulas)) != 3:
			continue
		masses = [group_mass(g) for g in groups]
		if min(abs(x - y) for i, x in enumerate(masses) for y in masses[i + 1:]) < 1:
			continue
		groups = rng.shuffle(groups)
		tag = rng.pick(['@', '@@'])
		s = f'[C{tag}H]({GROUPS[groups[0]][0]})({GROUPS[groups[1]][0]}){GROUPS[groups[2]][0]}'
		mol = Chem.MolFromSmiles(s)
		if mol is None:
			continue
		label = cip_labels(mol)['atomi'].get(0)
		if label not in ('R', 'S'):
			continue
		# attacchi dei gruppi: vicini del centro in ordine di SMILES
		atts = sorted(n.GetIdx() for n in mol.GetAtomWithIdx(0).GetNeighbors())
		m2 = Chem.Mol(mol)
		Chem.AssignStereochemistry(m2, cleanIt=True, force=True)
		ranks = {g: int(m2.GetAtomWithIdx(a).GetProp('_CIPRank')) for g, a in zip(groups, atts)}
		cip = sorted(groups, key=lambda g: -ranks[g]) + ['H']
		by_mass = sorted(groups, key=lambda g: -group_mass(g)) + ['H']
		if by_mass == cip:
			continue
		break
	else:
		raise RuntimeError('livello 5: nessun centro')
	att_of = dict(zip(groups, atts))
	sense, h = drawn_sense(mol, 0, [att_of[g] for g in cip[:3]])
	read = ('R' if sense == 'orario' else 'S')
	if h == 'davanti':
		read = 'S' if read == 'R' else 'R'
	other = 'S' if label == 'R' else 'R'

	def opt(lab: str, order: list[str], why: str) -> dict:
		tex = f'{lab}, con priorità ${ranking_tex(order)}$'
		return {'latex': tex, 'text': tex, 'values': [f'{lab}|{">".join(order)}'], 'errore': why}

	correct = opt(label, cip, 'giusta')
	distractors = [opt(other, cip, 'verso'), opt(label, by_mass, 'massa'), opt(other, by_mass, 'massa e verso')]
	from comune import choice
	opts, idx = choice(rng, correct, distractors)
	names = ['1', '2', '3']
	steps = [
		'Priorità dei quattro gruppi, guardando prima l\'atomo legato al carbonio chirale e, a parità, gli atomi successivi: '
		+ ', '.join(f'{n} ${ranking_tex([g])}$' for n, g in zip(names, cip[:3])) + ', 4 $\\mathrm{H}$.',
		f'Attenzione: in ordine di massa sarebbe ${ranking_tex(by_mass)}$, ma la priorità non dipende dalla massa del gruppo.',
		f'Nel disegno, seguendo 1 → 2 → 3 si gira in senso {sense}.',
		('L\'idrogeno, che non è disegnato, sta dietro al foglio (un legame del carbonio chirale è un cuneo pieno): il verso si legge così com\'è.'
			if h == 'dietro' else
			'Un legame del carbonio chirale è un cuneo tratteggiato: l\'idrogeno viene verso di te, e il verso va invertito.'),
		f'La configurazione è {label}.',
	]
	params = {'tipo': 'RS', 'smiles': s, 'centro': 0, 'gruppi': groups, 'testi': {g: GROUPS[g][1] for g in groups},
		'etichetta': label, 'priorita': cip, 'massa': by_mass, 'letto': read, 'verso': sense, 'idrogeno': h}
	# il carbonio chirale non si colora: il cerchio coprirebbe l'inizio del cuneo
	return sample(ID, 5, rng.seed, prompt='Il carbonio chirale di questa molecola è R o S? Scegli la risposta con l\'ordine di priorità giusto.',
		figura=mol_svg(s), options=opts, correct=idx, solution=f'{label}.', steps=steps,
		figura_soluzione=mol_svg(s, stereo='si'), params=params)


# ---------------------------------------------------------------------------

def generate(rng: Rng, level: int) -> dict:
	return {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}[level](rng)


def check(s: dict) -> list[str]:
	p = s['params']
	errs = []
	if len(s['options']) != 4:
		errs.append('servono 4 opzioni')
	if len({tuple(o['values']) for o in s['options']}) != 4:
		errs.append('opzioni ripetute')
	if s['level'] == 3 and not 0 <= p['n'] <= 4:
		errs.append('livello 3: da 0 a 4 carboni chirali')
	if s['level'] == 5 and p['letto'] != p['etichetta']:
		errs.append(f'livello 5: il disegno letto con la regola della lezione dà {p["letto"]}, il CIP labeler {p["etichetta"]}')
	if s['level'] == 5 and p['priorita'] == p['massa']:
		errs.append('livello 5: l\'ordine per massa deve essere diverso da quello delle priorità')
	return errs
