"""
Controllo indipendente di amminoacidi-legame-peptidico: non importa niente dal generatore.

Le strutture giuste si ottengono per altre due strade: OPSIN legge il nome inglese dell'amminoacido o
del peptide ("glycyl-L-alanyl-L-serine"), e le regole di sequenza della lezione scrivono lo SMILES a
mano, residuo dopo residuo (N, carbonio α con la catena laterale, C=O, poi il residuo successivo).
Il generatore invece usa una reazione di RDKit. Le strutture si confrontano con l'InChI standard,
che contiene la stereochimica.

- Livello 1: i gruppi si ritrovano con uno SMARTS proprio; gli atomi evidenziati devono essere
  esattamente il gruppo dell'opzione giusta.
- Livello 2: la classe della catena laterale si ricava dal grafo con le regole della lezione (carica
  negativa: acida; positiva: basica; O, N o S-H: polare neutra; solo C e H, o S tra due carboni: apolare).
- Livello 3: il dipeptide giusto per le due strade; i distrattori hanno InChI diverso.
- Livello 4: i legami peptidici si contano con uno SMARTS proprio e devono essere n - 1.
- Livello 5: le quattro opzioni sono lo stesso amminoacido; la giusta non ha carbossili protonati né
  basi libere, e la carica netta sommata sul grafo è (gruppi basici) - (gruppi acidi).
"""
from rdkit import Chem

# sigla: (nome inglese per OPSIN, catena laterale scritta dopo N[C@@H]( ... )C(=O), il residuo L)
RESIDUES = {
	'Gly': ('glycine', None),
	'Ala': ('L-alanine', 'C'),
	'Val': ('L-valine', 'C(C)C'),
	'Leu': ('L-leucine', 'CC(C)C'),
	'Ile': ('L-isoleucine', '[C@@H](C)CC'),
	'Phe': ('L-phenylalanine', 'Cc1ccccc1'),
	'Met': ('L-methionine', 'CCSC'),
	'Ser': ('L-serine', 'CO'),
	'Thr': ('L-threonine', '[C@H](O)C'),
	'Cys': ('L-cysteine', 'CS'),
	'Asn': ('L-asparagine', 'CC(N)=O'),
	'Gln': ('L-glutamine', 'CCC(N)=O'),
	'Asp': ('L-aspartic acid', 'CC(=O)O'),
	'Glu': ('L-glutamic acid', 'CCC(=O)O'),
	'Lys': ('L-lysine', 'CCCCN'),
	'Arg': ('L-arginine', 'CCCNC(N)=N'),
}
ACYL = {'Gly': 'glycyl', 'Ala': 'L-alanyl', 'Val': 'L-valyl', 'Leu': 'L-leucyl', 'Ile': 'L-isoleucyl',
	'Phe': 'L-phenylalanyl', 'Met': 'L-methionyl', 'Ser': 'L-seryl', 'Thr': 'L-threonyl', 'Cys': 'L-cysteinyl',
	'Asn': 'L-asparaginyl', 'Gln': 'L-glutaminyl', 'Asp': 'L-aspartyl', 'Glu': 'L-glutamyl', 'Lys': 'L-lysyl',
	'Arg': 'L-arginyl'}
GROUP_TEXT = {'il gruppo amminico': 'N', 'il gruppo carbossilico': 'COOH', 'il carbonio α': 'CA', 'la catena laterale R': 'R'}
CLASS_TEXT = {'apolare': 'apolare', 'polare neutra': 'polare', 'acida': 'acida', 'basica': 'basica'}

FREE_AA = Chem.MolFromSmarts('[NX3;H2:1][CX4:2][CX3:3](=[OX1:4])[OX2H1:5]')
PH7_BACKBONE = Chem.MolFromSmarts('[NX4H3+][CX4][CX3](=[OX1])[OX1-]')
# legame peptidico: C=O legato a un carbonio α (che porta un N) e a un NH legato a un altro carbonio α
PEPTIDE_BOND = Chem.MolFromSmarts('[CX4]([#7])[CX3](=[OX1])[NX3H1][CX4][CX3]=[OX1]')
COOH = Chem.MolFromSmarts('[CX3](=[OX1])[OX2H1]')
FREE_BASE = Chem.MolFromSmarts('[NX3;+0;H2,H1;!$(N[CX3]=[OX1]);!$(N[CX3]=[NX2]);!$(NC=[NX3+])]')
NEUTRAL_GUAN = Chem.MolFromSmarts('[NX2]=[CX3]([NX3])[NX3]')


def inchi(smiles):
	m = Chem.MolFromSmiles(smiles)
	return Chem.MolToInchi(m) if m else None


def by_rules(seq):
	"""Lo SMILES del peptide scritto a mano dalla sequenza: N-terminale a sinistra, C-terminale a destra."""
	parts = []
	for code in seq:
		side = RESIDUES[code][1]
		parts.append('NCC(=O)' if side is None else f'N[C@@H]({side})C(=O)')
	return ''.join(parts) + 'O'


def by_name(seq, opsin):
	name = '-'.join(ACYL[c] for c in seq[:-1]) + ('-' if len(seq) > 1 else '') + RESIDUES[seq[-1]][0]
	return opsin(name), name


def neutralize(smiles):
	"""Toglie le cariche rimettendo o togliendo H: N+ perde un H, O- ne prende uno."""
	m = Chem.RWMol(Chem.MolFromSmiles(smiles))
	for a in m.GetAtoms():
		q = a.GetFormalCharge()
		if q == 1 and a.GetSymbol() == 'N':
			a.SetFormalCharge(0)
			a.SetNumExplicitHs(max(0, a.GetTotalNumHs() - 1))
			a.SetNoImplicit(True)
		elif q == -1 and a.GetSymbol() == 'O':
			a.SetFormalCharge(0)
			a.SetNumExplicitHs(a.GetTotalNumHs() + 1)
			a.SetNoImplicit(True)
	out = m.GetMol()
	Chem.SanitizeMol(out)
	return Chem.MolToSmiles(out)


def net(smiles):
	return sum(a.GetFormalCharge() for a in Chem.MolFromSmiles(smiles).GetAtoms())


def formula_counts(smiles):
	m = Chem.AddHs(Chem.MolFromSmiles(smiles))
	c = {}
	for a in m.GetAtoms():
		c[a.GetSymbol()] = c.get(a.GetSymbol(), 0) + 1
	return c


def same_aa(smiles, code, opsin):
	"""L'amminoacido disegnato (con o senza cariche) è quello della sigla, stereochimica L compresa."""
	ref = opsin(RESIDUES[code][0])
	return bool(ref) and inchi(neutralize(smiles)) == inchi(ref)


def check_level1(s, opsin):
	p = s['params']
	errs = []
	if not same_aa(p['smiles'], p['amminoacido'], opsin):
		errs.append(f'la molecola non è {p["amminoacido"]}')
	mol = Chem.MolFromSmiles(p['smiles'])
	m = mol.GetSubstructMatches(FREE_AA)
	if len(m) != 1:
		return errs + ['scheletro non trovato'], None
	n, ca, c, o1, o2 = m[0]
	groups = {'N': {n}, 'CA': {ca}, 'COOH': {c, o1, o2}, 'R': set(range(mol.GetNumAtoms())) - set(m[0])}
	lit = set(p['evidenziati'])
	right = GROUP_TEXT.get(s['options'][s['correct']]['latex'])
	if right is None or groups[right] != lit:
		errs.append(f'gli atomi evidenziati {sorted(lit)} non sono {s["options"][s["correct"]]["latex"]}')
	if not lit:
		errs.append('niente di evidenziato')
	texts = [o['latex'] for o in s['options']]
	if sorted(texts) != sorted(GROUP_TEXT):
		errs.append('le opzioni non sono i quattro gruppi')
	if 'var(--mol-giallo' not in (s['figura'] or ''):
		errs.append('la figura non ha l\'evidenziazione')
	return errs, right


def side_class(smiles):
	mol = Chem.MolFromSmiles(smiles)
	m = mol.GetSubstructMatches(PH7_BACKBONE)
	if len(m) != 1:
		return None
	side = [a for a in mol.GetAtoms() if a.GetIdx() not in m[0]]
	if any(a.GetFormalCharge() < 0 for a in side):
		return 'acida'
	if any(a.GetFormalCharge() > 0 for a in side):
		return 'basica'
	if any(a.GetSymbol() in ('O', 'N') or (a.GetSymbol() == 'S' and a.GetTotalNumHs() > 0) for a in side):
		return 'polare'
	return 'apolare'


def check_level2(s, opsin):
	p = s['params']
	errs = []
	if not same_aa(p['smiles'], p['amminoacido'], opsin):
		errs.append(f'la molecola non è {p["amminoacido"]}')
	mol = Chem.MolFromSmiles(p['smiles'])
	if mol.HasSubstructMatch(COOH) or mol.HasSubstructMatch(FREE_BASE) or mol.HasSubstructMatch(NEUTRAL_GUAN):
		errs.append('il disegno non è la forma a pH 7')
	cls = side_class(p['smiles'])
	right = CLASS_TEXT.get(s['options'][s['correct']]['latex'])
	if cls != right:
		errs.append(f'la catena laterale è {cls}, l\'opzione giusta dice {right}')
	if sorted(o['latex'] for o in s['options']) != sorted(CLASS_TEXT):
		errs.append('le opzioni non sono le quattro classi')
	return errs, cls


def check_level3(s, opsin):
	p = s['params']
	errs = []
	seq = p['sequenza']
	rules = inchi(by_rules(seq))
	named, name = by_name(seq, opsin)
	if not named or inchi(named) != rules:
		errs.append(f'OPSIN ({name}) e le regole di sequenza non danno la stessa molecola')
	right = s['options'][s['correct']]['values'][0]
	if inchi(right) != rules:
		errs.append(f'l\'opzione giusta non è {"-".join(seq)}')
	# formula: somma dei due amminoacidi meno H2O
	a, b = formula_counts(by_rules(seq[:1])), formula_counts(by_rules(seq[1:]))
	want = {k: a.get(k, 0) + b.get(k, 0) - {'H': 2, 'O': 1}.get(k, 0) for k in set(a) | set(b)}
	got = formula_counts(right)
	if {k: v for k, v in want.items() if v} != got:
		errs.append('la formula del dipeptide non è la somma meno H2O')
	for i, o in enumerate(s['options']):
		if i != s['correct'] and inchi(o['values'][0]) == rules:
			errs.append('un distrattore è il dipeptide giusto')
	if len({inchi(o['values'][0]) for o in s['options']}) != 4:
		errs.append('strutture ripetute')
	reverse = inchi(by_rules(seq[::-1]))
	has_reverse = any(inchi(o['values'][0]) == reverse for i, o in enumerate(s['options']) if i != s['correct'])
	return errs, 'con inverso' if has_reverse else 'senza inverso'


def check_level4(s, opsin):
	p = s['params']
	errs = []
	seq = p['sequenza']
	named, name = by_name(seq, opsin)
	if not named or inchi(named) != inchi(p['smiles']):
		errs.append(f'il peptide disegnato non è {name}')
	if inchi(by_rules(seq)) != inchi(p['smiles']):
		errs.append('il peptide disegnato non segue le regole di sequenza')
	mol = Chem.MolFromSmiles(p['smiles'])
	bonds = {(m[2], m[4]) for m in mol.GetSubstructMatches(PEPTIDE_BOND)}
	# l'ultimo legame (verso il C-terminale) ha il carbonio α seguito da COOH: lo SMARTS lo copre con [CX3]=O
	if len(bonds) != len(seq) - 1:
		errs.append(f'lo SMARTS trova {len(bonds)} legami peptidici, la sequenza ne vuole {len(seq) - 1}')
	right = s['options'][s['correct']]['latex'].strip('$')
	if right != str(len(bonds)):
		errs.append(f'l\'opzione giusta dice {right}, i legami sono {len(bonds)}')
	if len({o['latex'] for o in s['options']}) != 4:
		errs.append('numeri ripetuti')
	amides = sum(1 for c in seq if c in ('Asn', 'Gln'))
	return errs, f'{p["tipo"]}{" con ammidi laterali" if amides else ""}'


def check_level5(s, opsin):
	p = s['params']
	errs = []
	code = p['amminoacido']
	for o in s['options']:
		if not same_aa(o['values'][0], code, opsin):
			errs.append(f'un\'opzione non è {code}')
	ok = []
	for i, o in enumerate(s['options']):
		m = Chem.MolFromSmiles(o['values'][0])
		if not (m.HasSubstructMatch(COOH) or m.HasSubstructMatch(FREE_BASE) or m.HasSubstructMatch(NEUTRAL_GUAN)):
			ok.append(i)
	if ok != [s['correct']]:
		errs.append(f'le opzioni senza gruppi da ionizzare sono {ok}, la giusta è {s["correct"]}')
	neutral = Chem.MolFromSmiles(opsin(RESIDUES[code][0]) or 'C')
	acids = len(neutral.GetSubstructMatches(COOH))
	bases = len(neutral.GetSubstructMatches(Chem.MolFromSmarts('[NX3;H2;!$(N[CX3]=[OX1]);!$(N[CX3]=[NX2])]'))) + \
		len(neutral.GetSubstructMatches(NEUTRAL_GUAN))
	q = net(s['options'][s['correct']]['values'][0])
	if q != bases - acids:
		errs.append(f'carica netta {q}, attesa {bases - acids}')
	if len({o['values'][0] for o in s['options']}) != 4:
		errs.append('forme ripetute')
	return errs, {0: 'zwitterione', 1: 'carica +1', -1: 'carica -1'}.get(q, str(q))


def check(sample, opsin):
	fn = {1: check_level1, 2: check_level2, 3: check_level3, 4: check_level4, 5: check_level5}[sample['level']]
	errs, case = fn(sample, opsin)
	if len(sample['options']) != 4 or not 0 <= sample['correct'] < 4:
		errs.append('servono 4 opzioni e un indice giusto valido')
	return errs, case
