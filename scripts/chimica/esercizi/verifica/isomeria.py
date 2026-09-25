"""
Controllo indipendente di isomeria: non importa niente dal generatore e rifà i conti per un'altra strada.

- Formula bruta: contata dal grafo, atomo per atomo, con gli idrogeni di ogni atomo (niente CalcMolFormula).
- Stessa molecola: confronto degli InChI standard (non dei SMILES canonici); stessi legami ma
  disposizione diversa: InChI uguali senza lo strato stereo (`-SNon`) e diversi con.
- Carboni chirali: la percezione stereo nuova di RDKit (`useLegacyImplementation=False`) e, per
  conto suo, una prova di simmetria: il carbonio è chirale se ha al massimo un H e se nessuna
  simmetria della molecola che lo tiene fermo scambia due dei suoi vicini. Il generatore usa l'algoritmo legacy.
- Priorità CIP: un'implementazione propria, con il digrafo gerarchico, gli atomi duplicati per i
  legami multipli e il confronto sfera per sfera.
- E/Z: le etichette legacy di `AssignStereochemistry` e, per conto suo, le priorità proprie con le
  coordinate 2D del disegno (da che parte del doppio legame sta ciascun gruppo). Il generatore usa `rdCIPLabeler`.
- R/S: le etichette legacy di `AssignStereochemistry` e, per conto suo, le priorità proprie con la
  parità della permutazione dei vicini rispetto al tag chirale. Il generatore usa `rdCIPLabeler`.

Quando le due strade di RDKit (legacy e controllo proprio) non sono d'accordo, il caso lo dice
(`...-divergenza`) e l'esercizio non passa se la risposta giusta non coincide con il controllo proprio.
"""
import re

from rdkit import Chem
from rdkit.Chem import rdDepictor

# ---------------------------------------------------------------------------
# Formula e identità


def counts(mol):
	c = {}
	for a in mol.GetAtoms():
		c[a.GetSymbol()] = c.get(a.GetSymbol(), 0) + 1
		if a.GetTotalNumHs():
			c['H'] = c.get('H', 0) + a.GetTotalNumHs()
	return c


def mol(smiles):
	m = Chem.MolFromSmiles(smiles)
	if m is None:
		raise ValueError(f'SMILES illeggibile: {smiles}')
	return m


def inchi(m, stereo=True):
	return Chem.MolToInchi(m) if stereo else Chem.MolToInchi(m, options='-SNon')


def relation(a, b):
	if counts(a) != counts(b):
		return 'nessuna'
	if inchi(a) == inchi(b):
		return 'stessa'
	if inchi(a, False) == inchi(b, False):
		return 'stereo'
	return 'struttura'


# ---------------------------------------------------------------------------
# Carboni chirali


def chiral_new(m):
	return sorted(i for i, _ in Chem.FindMolChiralCenters(m, includeUnassigned=True, useLegacyImplementation=False)
		if m.GetAtomWithIdx(i).GetAtomicNum() == 6)


def chiral_symmetry(m):
	out = []
	for a in m.GetAtoms():
		if a.GetAtomicNum() != 6 or a.GetDegree() + a.GetTotalNumHs() != 4 or a.GetTotalNumHs() > 1:
			continue
		if any(b.GetBondType() != Chem.BondType.SINGLE for b in a.GetBonds()):
			continue
		marked = Chem.Mol(m)
		marked.GetAtomWithIdx(a.GetIdx()).SetIsotope(99)
		ranks = list(Chem.CanonicalRankAtoms(marked, breakTies=False, includeChirality=False))
		nbr = [ranks[n.GetIdx()] for n in a.GetNeighbors()]
		if len(set(nbr)) == len(nbr):
			out.append(a.GetIdx())
	return out


# ---------------------------------------------------------------------------
# Priorità CIP proprie


class Node:
	__slots__ = ('z', 'kids')

	def __init__(self, z, kids=()):
		self.z = z
		self.kids = list(kids)


def tree(m, atom, parent, depth):
	"""Il ramo che parte da `atom` venendo da `parent`, con duplicati e atomi fantasma (z=0)."""
	a = m.GetAtomWithIdx(atom)
	if depth == 0:
		return Node(a.GetAtomicNum())
	kids = []
	for b in a.GetBonds():
		n = b.GetOtherAtomIdx(atom)
		order = int(b.GetBondTypeAsDouble())
		if n != parent:
			kids.append(tree(m, n, atom, depth - 1))
		# un legame doppio o triplo aggiunge copie dell'atomo all'altra estremità, con tre fantasmi
		for _ in range(order - 1):
			kids.append(Node(m.GetAtomWithIdx(n).GetAtomicNum(), [Node(0), Node(0), Node(0)]))
	kids += [Node(1) for _ in range(a.GetTotalNumHs())]
	while a.GetAtomicNum() > 1 and len(kids) < 3:
		kids.append(Node(0))
	return Node(a.GetAtomicNum(), kids)


def key(node, depth):
	"""Sfere del ramo: sfera 0 l'atomo, sfera 1 l'insieme dei figli, poi gli insiemi dei nipoti
	nell'ordine di precedenza dei figli, e così via."""
	if depth == 0:
		return [((node.z,),)]
	kid_keys = sorted((key(k, depth - 1) for k in node.kids), reverse=True)
	spheres = [((node.z,),), (tuple(sorted((k.z for k in node.kids), reverse=True)),)]
	for d in range(2, depth + 1):
		spheres.append(tuple(s for kk in kid_keys if len(kk) > d - 1 for s in kk[d - 1]))
	return spheres


def branch_keys(m, center, depth=7):
	"""{vicino: chiave} per i vicini (anche H espliciti) di un atomo. Gli anelli aromatici si
	leggono in forma di Kekulé, così i doppi legami danno i loro duplicati."""
	m = Chem.Mol(m)
	Chem.Kekulize(m, clearAromaticFlags=True)
	return {n.GetIdx(): key(tree(m, n.GetIdx(), center, depth), depth) for n in m.GetAtomWithIdx(center).GetNeighbors()}


def branch_counts(m, start, center):
	seen, todo = {start}, [start]
	while todo:
		x = todo.pop()
		for n in m.GetAtomWithIdx(x).GetNeighbors():
			if n.GetIdx() != center and n.GetIdx() not in seen:
				seen.add(n.GetIdx())
				todo.append(n.GetIdx())
	c = {}
	for i in seen:
		a = m.GetAtomWithIdx(i)
		c[a.GetSymbol()] = c.get(a.GetSymbol(), 0) + 1
		if a.GetTotalNumHs():
			c['H'] = c.get('H', 0) + a.GetTotalNumHs()
	return c


def parse_group(text):
	"""CH(CH_3)_2 → {'C': 3, 'H': 7}."""
	s = re.sub(r'[_{}=\\]', '', text)
	stack = [{}]
	for el, n, par, pn in re.findall(r'([A-Z][a-z]?)(\d*)|(\(|\))(\d*)', s):
		if el:
			stack[-1][el] = stack[-1].get(el, 0) + int(n or 1)
		elif par == '(':
			stack.append({})
		else:
			inner = stack.pop()
			for k, v in inner.items():
				stack[-1][k] = stack[-1].get(k, 0) + v * int(pn or 1)
	return stack[0]


def own_rs(m, center):
	"""R/S con le priorità proprie e la parità dei vicini rispetto al tag chirale."""
	mh = Chem.AddHs(m)
	atom = mh.GetAtomWithIdx(center)
	nbrs = [b.GetOtherAtomIdx(center) for b in atom.GetBonds()]
	keys = branch_keys(mh, center)
	ranked = sorted(nbrs, key=lambda n: keys[n], reverse=True)
	if len({str(keys[n]) for n in nbrs}) != 4:
		return None, ranked
	wanted = [ranked[3], ranked[0], ranked[1], ranked[2]]
	perm = [nbrs.index(x) for x in wanted]
	inversions = sum(1 for i in range(4) for j in range(i + 1, 4) if perm[i] > perm[j])
	tag = atom.GetChiralTag()
	if tag not in (Chem.ChiralType.CHI_TETRAHEDRAL_CW, Chem.ChiralType.CHI_TETRAHEDRAL_CCW):
		return None, ranked
	ccw = (tag == Chem.ChiralType.CHI_TETRAHEDRAL_CCW) ^ (inversions % 2 == 1)
	# guardando dal gruppo 4 verso il centro 1→2→3 è antiorario: dall'altra parte è orario, cioè R
	return ('R' if ccw else 'S'), ranked


def legacy_rs(m, center):
	x = Chem.Mol(m)
	Chem.AssignStereochemistry(x, cleanIt=True, force=True)
	a = x.GetAtomWithIdx(center)
	return a.GetProp('_CIPCode') if a.HasProp('_CIPCode') else None


# ---------------------------------------------------------------------------
# E/Z


def cc_double(m):
	return [b for b in m.GetBonds() if b.GetBondType() == Chem.BondType.DOUBLE
		and b.GetBeginAtom().GetAtomicNum() == 6 and b.GetEndAtom().GetAtomicNum() == 6]


def legacy_ez(m):
	x = Chem.Mol(m)
	Chem.AssignStereochemistry(x, cleanIt=True, force=True)
	labels = {Chem.BondStereo.STEREOE: 'E', Chem.BondStereo.STEREOZ: 'Z'}
	return [labels.get(x.GetBondWithIdx(b.GetIdx()).GetStereo()) for b in cc_double(m)]


def own_ez(m):
	"""E/Z dalle priorità proprie e dalle coordinate 2D (che RDKit costruisce rispettando la geometria)."""
	mh = Chem.AddHs(m)
	rdDepictor.Compute2DCoords(mh)
	conf = mh.GetConformer()
	out = []
	for b in cc_double(mh):
		i, j = b.GetBeginAtomIdx(), b.GetEndAtomIdx()
		best = []
		for a, other in ((i, j), (j, i)):
			keys = {n: k for n, k in branch_keys(mh, a).items() if n != other}
			top = sorted(keys, key=lambda n: keys[n], reverse=True)
			if len(top) != 2 or keys[top[0]] == keys[top[1]]:
				best = None
				break
			best.append(top[0])
		if best is None:
			out.append(None)
			continue
		pi, pj = conf.GetAtomPosition(i), conf.GetAtomPosition(j)
		ax, ay = pj.x - pi.x, pj.y - pi.y

		def side(k):
			p = conf.GetAtomPosition(k)
			return ax * (p.y - pi.y) - ay * (p.x - pi.x)

		out.append('Z' if side(best[0]) * side(best[1]) > 0 else 'E')
	return out


def has_potential_ez(m):
	x = Chem.Mol(m)
	Chem.RemoveStereochemistry(x)
	info = Chem.FindPotentialStereo(x)
	return any(s.type == Chem.StereoType.Bond_Double and x.GetBondWithIdx(s.centeredOn).GetBeginAtom().GetAtomicNum() == 6
		and x.GetBondWithIdx(s.centeredOn).GetEndAtom().GetAtomicNum() == 6 for s in info)


# ---------------------------------------------------------------------------


def check(sample, opsin):
	p = sample['params']
	opts = sample['options']
	k = sample['correct']
	errs = []
	case = p['tipo']
	if len({tuple(o['values']) for o in opts}) != 4:
		errs.append('opzioni ripetute')

	if sample['level'] == 1:
		target = mol(p['smiles'])
		same = [i for i, o in enumerate(opts)
			if counts(mol(o['values'][0])) == counts(target) and inchi(mol(o['values'][0])) != inchi(target)]
		if same != [k]:
			errs.append(f'le opzioni con la stessa formula e diverse dalla molecola data sono {same}, la giusta è {k}')
		if any(inchi(mol(o['values'][0])) == inchi(target) for o in opts):
			errs.append('un\'opzione è la molecola data')

	elif sample['level'] == 2:
		a, b = mol(p['smiles_a']), mol(p['smiles_b'])
		rel = relation(a, b)
		if opts[k]['values'][0] != rel:
			errs.append(f'la relazione è {rel}, la risposta giusta dice {opts[k]["values"][0]}')
		if p['smiles_a'] == p['smiles_b']:
			errs.append('i due disegni partono dallo stesso SMILES')
		case = rel

	elif sample['level'] == 3:
		m = mol(p['smiles'])
		new, sym = chiral_new(m), chiral_symmetry(m)
		right = opts[k]['values'][0]
		if str(len(new)) != right:
			errs.append(f'percezione nuova: {len(new)} carboni chirali {new}, la risposta giusta dice {right}')
		if new != sym:
			case = 'chirali-divergenza'
			errs.append(f'percezione nuova {new} e prova di simmetria {sym} non sono d\'accordo')
		values = sorted(int(o['values'][0]) for o in opts)
		if values != list(range(values[0], values[0] + 4)):
			errs.append('le opzioni non sono quattro numeri consecutivi')

	elif sample['level'] == 4:
		want = p['richiesto']
		with_want = []
		for i, o in enumerate(opts):
			m = mol(o['values'][0])
			leg, own = legacy_ez(m), own_ez(m)
			if leg != own:
				case = 'EZ-divergenza'
				errs.append(f'opzione {i}: legacy {leg}, controllo proprio {own}')
			if want in own:
				with_want.append(i)
			if not any(own) and has_potential_ez(m):
				errs.append(f'opzione {i}: il controllo proprio non trova E/Z ma la percezione nuova sì')
			if any(own) and not has_potential_ez(m):
				errs.append(f'opzione {i}: il controllo proprio trova E/Z ma la percezione nuova no')
		if with_want != [k]:
			errs.append(f'gli alcheni {want} sono {with_want}, la risposta giusta è {k}')

	elif sample['level'] == 5:
		m = mol(p['smiles'])
		center = p['centro']
		if chiral_new(m) != [center]:
			errs.append(f'la domanda parla di un solo carbonio chirale, la percezione nuova trova {chiral_new(m)}')
		own, ranked = own_rs(m, center)
		leg = legacy_rs(m, center)
		if own != leg:
			case = 'RS-divergenza'
			errs.append(f'R/S: legacy {leg}, controllo proprio {own}')
		# l'ordine giusto dei gruppi, riconosciuti dalla loro formula
		mh = Chem.AddHs(m)
		order = [branch_counts(mh, n, center) for n in ranked]
		text = opts[k]['latex']
		label = text[0]
		groups = [re.sub(r'^\\mathrm\{|\}$', '', g.strip()) for g in text.split('$')[1].split(' > ')]
		parsed = [parse_group(g) for g in groups]
		if label != own:
			errs.append(f'la risposta giusta dice {label}, il controllo proprio {own}')
		if parsed != order:
			errs.append(f'la risposta giusta ordina {groups}, il controllo proprio {order}')
		for i, o in enumerate(opts):
			if i != k and o['latex'] == text:
				errs.append('un distrattore è uguale alla risposta giusta')

	return errs, case
