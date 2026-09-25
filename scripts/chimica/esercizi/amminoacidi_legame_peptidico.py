"""
Amminoacidi e legame peptidico. Lezione: docs/lezioni/chimica/riscritte/06-amminoacidi-legame-peptidico.md

Gli amminoacidi sono L e si scrivono con lo scheletro davanti: N, carbonio α, C, O, O, poi la catena
laterale (indici 0-4 per lo scheletro, dal 5 in poi la catena laterale). I peptidi si costruiscono
con una reazione di RDKit (`rdChemReactions`) che unisce il carbossile di un amminoacido al gruppo
amminico del successivo e toglie l'acqua; gli errori tipici (niente acqua persa, legame tra i due
carbossili, legame dalla catena laterale, due legami ad anello) sono altre reazioni.

Livelli, ognuno con una difficoltà in più:
1. le parti di un amminoacido: quale gruppo è evidenziato;
2. la catena laterale: apolare, polare neutra, acida o basica;
3. il dipeptide giusto, dati i due amminoacidi e l'ordine;
4. quanti legami peptidici ha un peptide di 3-5 amminoacidi (o quante molecole d'acqua si liberano),
   con le ammidi delle catene laterali di asparagina e glutammina a fare da trappola;
5. la forma che prevale a pH 7, anche per le catene laterali acide e basiche.
"""

from __future__ import annotations

from rdkit import Chem
from rdkit.Chem import rdChemReactions

from comune import Rng, canon, choice, formula, formula_latex, mol_option, mol_svg, sample, text_option

ID = 'amminoacidi-legame-peptidico'
TITLE = 'Amminoacidi e legame peptidico'
LEVELS = {
	1: ('Le parti di un amminoacido', ['un gruppo evidenziato: amminico, carbossilico, carbonio α o catena laterale']),
	2: ('Le catene laterali', ['classificare la catena laterale: apolare, polare neutra, acida, basica']),
	3: ('Il dipeptide giusto', ['due amminoacidi diversi in un ordine dato', 'distrattori: ordine inverso e legami sbagliati']),
	4: ('Contare i legami peptidici', ['peptide da 3 a 5 amminoacidi', 'legami peptidici o molecole d\'acqua']),
	5: ('La forma a pH 7', ['quattro forme dello stesso amminoacido con cariche diverse']),
}

# nome, sigla, catena laterale in SMILES (attaccata al carbonio α L), classe
AA = {
	'Gly': ('glicina', '', 'apolare'),
	'Ala': ('alanina', 'C', 'apolare'),
	'Val': ('valina', 'C(C)C', 'apolare'),
	'Leu': ('leucina', 'CC(C)C', 'apolare'),
	'Ile': ('isoleucina', '[C@@H](C)CC', 'apolare'),
	'Phe': ('fenilalanina', 'Cc1ccccc1', 'apolare'),
	'Met': ('metionina', 'CCSC', 'apolare'),
	'Ser': ('serina', 'CO', 'polare'),
	'Thr': ('treonina', '[C@@H](C)O', 'polare'),
	'Cys': ('cisteina', 'CS', 'polare'),
	'Asn': ('asparagina', 'CC(N)=O', 'polare'),
	'Gln': ('glutammina', 'CCC(N)=O', 'polare'),
	'Asp': ('acido aspartico', 'CC(=O)O', 'acida'),
	'Glu': ('acido glutammico', 'CCC(=O)O', 'acida'),
	'Lys': ('lisina', 'CCCCN', 'basica'),
	'Arg': ('arginina', 'CCCNC(N)=N', 'basica'),
}
CLASSES = {
	'apolare': 'apolare',
	'polare': 'polare neutra',
	'acida': 'acida',
	'basica': 'basica',
}
# Per il livello 2 solo gli amminoacidi che tutti i libri mettono nella stessa classe.
CLEAR = {
	'apolare': ['Ala', 'Val', 'Leu', 'Ile', 'Phe', 'Met'],
	'polare': ['Ser', 'Thr', 'Asn', 'Gln'],
	'acida': ['Asp', 'Glu'],
	'basica': ['Lys', 'Arg'],
}
GROUPS = {
	'amminico': 'il gruppo amminico',
	'carbossilico': 'il gruppo carbossilico',
	'alfa': 'il carbonio α',
	'laterale': 'la catena laterale R',
}


def neutral(code: str) -> str:
	"""La forma senza cariche, scheletro davanti: N, Cα, C, O, O, catena laterale."""
	side = AA[code][1]
	return f'N[C@H](C(=O)O){side}' if side else 'NCC(=O)O'


def article(code: str) -> str:
	name = AA[code][0]
	return f"l'{name}" if name[0] in 'aeiou' else f'la {name}'


def of(code: str) -> str:
	name = AA[code][0]
	return f"dell'{name}" if name[0] in 'aeiou' else f'della {name}'


# ---------------------------------------------------------------------------
# Cariche

ACID = Chem.MolFromSmarts('[CX3](=O)[OX2H1]')
AMINE = Chem.MolFromSmarts('[NX3;H2;!$(NC=O);!$(NC=N)]')
GUAN = Chem.MolFromSmarts('[NX2;H1]=[CX3]([NX3])[NX3]')


def ionize(smiles: str, acids: bool, amines: bool, side: bool = True) -> str:
	"""Toglie H+ ai carbossili e/o lo aggiunge alle basi. `side=False` lascia com'è la catena laterale."""
	mol = Chem.RWMol(Chem.MolFromSmiles(smiles))
	groups = parts(smiles)
	backbone = set(groups['amminico'] + groups['alfa'] + groups['carbossilico'])

	def allowed(i: int) -> bool:
		return side or i in backbone
	if acids:
		for c, _, o in mol.GetSubstructMatches(ACID):
			if allowed(c):
				a = mol.GetAtomWithIdx(o)
				a.SetFormalCharge(-1)
				a.SetNumExplicitHs(0)
				a.SetNoImplicit(True)
	if amines:
		for (n,) in mol.GetSubstructMatches(AMINE):
			if allowed(n):
				mol.GetAtomWithIdx(n).SetFormalCharge(1)
		for n, *_ in mol.GetSubstructMatches(GUAN):
			if allowed(n):
				mol.GetAtomWithIdx(n).SetFormalCharge(1)
	m = mol.GetMol()
	Chem.SanitizeMol(m)
	return Chem.MolToSmiles(m)


def ph7(code: str) -> str:
	return ionize(neutral(code), True, True)


def net_charge(smiles: str) -> int:
	return sum(a.GetFormalCharge() for a in Chem.MolFromSmiles(smiles).GetAtoms())


# ---------------------------------------------------------------------------
# Reazioni

def _rxn(smarts: str) -> rdChemReactions.ChemicalReaction:
	r = rdChemReactions.ReactionFromSmarts(smarts)
	r.Initialize()
	return r


# il carbossile dello scheletro (carbonio α legato a un N) e il gruppo amminico dello scheletro
C_TERM = '[NX3:1][CX4:2][CX3:3](=[OX1:4])[OX2H1:5]'
N_TERM = '[NX3;H2;!$(NC=O):6][CX4:7][CX3:8]=[OX1:9]'
PEPTIDE = _rxn(f'{C_TERM}.{N_TERM}>>[N:1][C:2][C:3](=[O:4])[N:6][C:7][C:8]=[O:9].[O:5]')
NO_WATER = _rxn(f'{C_TERM}.{N_TERM}>>[N:1][C:2][C:3]([O:4])([O:5])[N:6][C:7][C:8]=[O:9]')
ANHYDRIDE = _rxn(f'{C_TERM}.[NX3:6][CX4:7][CX3:8](=[OX1:9])[OX2H1:10]>>[N:1][C:2][C:3](=[O:4])[O:10][C:8](=[O:9])[C:7][N:6].[O:5]')
DKP = _rxn('[NX3;H2:1][CX4:2][CX3:3](=[OX1:4])[OX2H1:5].[NX3;H2:6][CX4:7][CX3:8](=[OX1:9])[OX2H1:10]'
	'>>[N:1]1[C:2][C:3](=[O:4])[N:6][C:7][C:8]1=[O:9].[O:5].[O:10]')
# legami dalla catena laterale: il carbossile di Asp/Glu, l'ε-NH2 della lisina, l'OH di Ser/Thr
SIDE_ACID = _rxn('[CX4;!$(C[NX3]):1][CX3:3](=[OX1:4])[OX2H1:5].' + N_TERM + '>>[C:1][C:3](=[O:4])[N:6][C:7][C:8]=[O:9].[O:5]')
SIDE_AMINE = _rxn(f'{C_TERM}.[NX3;H2;!$(NC=O);!$(N[CX4][CX3]=O):6][CH2:7]>>[N:1][C:2][C:3](=[O:4])[N:6][C:7].[O:5]')
SIDE_OH = _rxn(f'{C_TERM}.[OX2H1:6][CX4:7]>>[N:1][C:2][C:3](=[O:4])[O:6][C:7].[O:5]')


def run(rxn: rdChemReactions.ChemicalReaction, a: str, b: str | None = None) -> str:
	"""L'unico prodotto principale della reazione (senza l'acqua); errore se non è uno solo."""
	reactants = [Chem.MolFromSmiles(a)] + ([Chem.MolFromSmiles(b)] if b else [])
	found = set()
	for products in rxn.RunReactants(tuple(reactants)):
		main = products[0]
		Chem.SanitizeMol(main)
		found.add(Chem.MolToSmiles(main))
	if len(found) != 1:
		raise ValueError(f'reazione con {len(found)} prodotti: {a} + {b}')
	return found.pop()


def peptide(codes: list[str]) -> str:
	"""Il peptide nella sequenza data (N-terminale per primo), un legame peptidico alla volta."""
	smi = neutral(codes[0])
	for code in codes[1:]:
		smi = run(PEPTIDE, smi, neutral(code))
	return smi


def dkp(x: str, y: str) -> str:
	"""Due legami peptidici ad anello (dichetopiperazina): l'errore di chi toglie due molecole d'acqua."""
	return run(DKP, neutral(x), neutral(y))


def wrong_dipeptides(rng: Rng, x: str, y: str) -> list[tuple[str, str]]:
	"""(SMILES, errore) in ordine di preferenza: l'inverso, poi un legame sbagliato."""
	out = [(peptide([y, x]), 'inverso')]
	side = []
	if AA[x][2] == 'acida':
		side.append((run(SIDE_ACID, neutral(x), neutral(y)), 'laterale'))
	if y == 'Lys':
		side.append((run(SIDE_AMINE, neutral(x), neutral(y)), 'laterale'))
	if y in ('Ser', 'Thr'):
		side.append((run(SIDE_OH, neutral(x), neutral(y)), 'estere'))
	out += side
	others = [(run(NO_WATER, neutral(x), neutral(y)), 'acqua'), (run(ANHYDRIDE, neutral(x), neutral(y)), 'anidride'),
		(dkp(x, y), 'anello')]
	out += rng.shuffle(others)
	return out


# ---------------------------------------------------------------------------
# Disegni

# lo scheletro di un amminoacido libero, in forma neutra o carica: N, Cα, C, O, O
BACKBONE = Chem.MolFromSmarts('[NX3H2,NX4H3+][CX4][CX3](=[OX1])[OX2H1,OX1-]')


def parts(smiles: str) -> dict[str, list[int]]:
	"""Gli indici dei quattro gruppi nella molecola scritta con questo SMILES."""
	mol = Chem.MolFromSmiles(smiles)
	matches = mol.GetSubstructMatches(BACKBONE)
	if len(matches) != 1:
		raise ValueError(f'scheletro non unico in {smiles}')
	n, ca, c, o1, o2 = matches[0]
	return {'amminico': [n], 'alfa': [ca], 'carbossilico': [c, o1, o2],
		'laterale': [a.GetIdx() for a in mol.GetAtoms() if a.GetIdx() not in matches[0]]}


def colored(groups: dict[str, list[int]]) -> str:
	lines = [f'{groups["amminico"][0]} blu', f'{groups["alfa"][0]} giallo', ' '.join(map(str, groups['carbossilico'])) + ' rosso']
	if groups['laterale']:
		lines.append(' '.join(map(str, groups['laterale'])) + ' verde')
	return '\n'.join(lines)
PEPTIDE_BOND = Chem.MolFromSmarts('[#7][CX4][CX3](=[OX1])[NX3;H1][CX4]')


def solution_peptide_svg(smiles: str) -> str:
	"""Il peptide con i legami peptidici in giallo, l'N-terminale in blu e il C-terminale in rosso."""
	mol = Chem.MolFromSmiles(smiles)
	bonds = {tuple(m[2:5]) for m in mol.GetSubstructMatches(PEPTIDE_BOND)}
	lines = [' '.join(map(str, b)) + ' giallo' for b in sorted(bonds)]
	n_term = mol.GetSubstructMatches(Chem.MolFromSmarts('[NX3;H2;!$(NC=O)][CX4][CX3](=O)[NX3,OX2H1]'))
	c_term = mol.GetSubstructMatches(Chem.MolFromSmarts('[NX3][CX4][CX3](=[OX1])[OX2H1]'))
	if n_term:
		lines.append(f'{n_term[0][0]} blu')
	if c_term:
		lines.append(f'{c_term[0][2]} {c_term[0][3]} {c_term[0][4]} rosso')
	return mol_svg(smiles, atomi='\n'.join(lines))


def residue_list(codes: list[str], sep: str = '-') -> str:
	return sep.join(codes)


# ---------------------------------------------------------------------------
# Livelli

def level1(rng: Rng) -> dict:
	target = rng.pick(list(GROUPS))
	pool = ['Ala', 'Val', 'Leu', 'Ile', 'Phe', 'Ser', 'Thr', 'Cys', 'Met', 'Asn', 'Gln']
	if target != 'laterale':
		pool = ['Gly', *pool]
	code = rng.pick(pool)
	smi = neutral(code)
	groups = parts(smi)
	atoms = groups[target]
	fig = mol_svg(smi, atomi=' '.join(map(str, atoms)) + ' giallo')
	correct = text_option(GROUPS[target], [target])
	distractors = [text_option(GROUPS[g], [g]) for g in GROUPS if g != target]
	opts, idx = choice(rng, correct, distractors)
	why = {
		'amminico': 'È l\'atomo di azoto con i suoi due idrogeni, $-\\mathrm{NH_2}$: il gruppo amminico.',
		'carbossilico': 'È il gruppo $-\\mathrm{COOH}$: un carbonio con un ossigeno legato due volte e un $-\\mathrm{OH}$.',
		'alfa': 'È il carbonio legato sia all\'azoto del gruppo amminico sia al carbonio del gruppo carbossilico: il carbonio α.',
		'laterale': 'È tutto quello che è attaccato al carbonio α oltre al gruppo amminico, al gruppo carbossilico e all\'idrogeno: la catena laterale.',
	}[target]
	full = mol_svg(smi, atomi=colored(groups))
	steps = [
		'Cerca prima il carbonio α: è il carbonio legato all\'azoto e al carbonio del $-\\mathrm{COOH}$.',
		why,
	]
	params = {'tipo': target, 'amminoacido': code, 'smiles': smi, 'evidenziati': atoms}
	return sample(ID, 1, rng.seed, prompt=f'Nella struttura {of(code)} è evidenziata in giallo una parte della molecola. Quale?',
		figura=fig, options=opts, correct=idx, solution=GROUPS[target], steps=steps, figura_soluzione=full, params=params)


def level2(rng: Rng) -> dict:
	cls = rng.pick(list(CLEAR))
	code = rng.pick(CLEAR[cls])
	smi = ph7(code)
	side = parts(smi)['laterale']
	fig = mol_svg(smi, atomi=' '.join(map(str, side)) + ' verde')
	correct = text_option(CLASSES[cls], [cls])
	distractors = [text_option(CLASSES[c], [c]) for c in CLASSES if c != cls]
	opts, idx = choice(rng, correct, distractors)
	why = {
		'apolare': 'La catena laterale è fatta solo di carbonio e idrogeno' + (' (lo zolfo della metionina è legato a due carboni e non forma legami a idrogeno con l\'acqua)' if code == 'Met' else '') + ': è apolare.',
		'polare': {'Ser': 'La catena laterale ha un gruppo $-\\mathrm{OH}$', 'Thr': 'La catena laterale ha un gruppo $-\\mathrm{OH}$',
			'Asn': 'La catena laterale ha un gruppo ammidico $-\\mathrm{CONH_2}$', 'Gln': 'La catena laterale ha un gruppo ammidico $-\\mathrm{CONH_2}$'}.get(code, '') + ', che forma legami a idrogeno con l\'acqua ma a pH 7 non ha carica: è polare neutra.',
		'acida': 'La catena laterale ha un secondo gruppo carbossilico, che a pH 7 ha perso $\\mathrm{H^+}$ ed è $-\\mathrm{COO^-}$: è acida.',
		'basica': 'La catena laterale ha un gruppo basico ' + ('amminico' if code == 'Lys' else '(il gruppo guanidinico)') + ', che a pH 7 ha acquistato $\\mathrm{H^+}$ ed è carico positivamente: è basica.',
	}[cls]
	steps = ['La catena laterale è la parte in verde, attaccata al carbonio α.', why]
	params = {'tipo': cls, 'amminoacido': code, 'smiles': canon(smi)}
	return sample(ID, 2, rng.seed, prompt=f'Com\'è la catena laterale {of(code)}, disegnata qui nella forma che ha a pH 7?',
		figura=fig, options=opts, correct=idx, solution=CLASSES[cls], steps=steps, params=params)


def level3(rng: Rng) -> dict:
	pool = ['Gly', 'Ala', 'Val', 'Leu', 'Phe', 'Ser', 'Thr', 'Cys', 'Met', 'Asn', 'Gln', 'Asp', 'Glu', 'Lys']
	x, y = rng.sample(pool, 2)
	right = peptide([x, y])
	wrong = wrong_dipeptides(rng, x, y)
	picked, seen = [], {canon(right)}
	for smi, why in wrong:
		c = canon(smi)
		if c not in seen:
			seen.add(c)
			picked.append((smi, why))
		if len(picked) == 3:
			break
	correct = mol_option(right, 'Struttura')
	distractors = [mol_option(s, 'Struttura') | {'errore': why} for s, why in picked]
	opts, idx = choice(rng, correct, distractors)
	for i, o in enumerate(opts, 1):
		o['text'] = f'Struttura {i}'
	seq = f'{x}-{y}'
	f_right = formula(right)
	sum_f = f'{formula_latex(formula(neutral(x)))} + {formula_latex(formula(neutral(y)))}'
	steps = [
		f'In {seq} il primo amminoacido, {AA[x][0]}, è l\'N-terminale: il suo gruppo amminico resta libero.',
		f'Il gruppo carbossilico {of(x)} si lega al gruppo amminico {of(y)}: si forma il legame peptidico $-\\mathrm{{CO-NH}}-$ e si libera una molecola d\'acqua.',
		f'{AA[y][0].capitalize()} è il C-terminale: il suo gruppo carbossilico resta libero.',
		f'Controllo con le formule: ${sum_f} = {formula_latex(f_right)} + \\mathrm{{H_2O}}$.',
	]
	params = {'sequenza': [x, y], 'smiles': canon(right), 'distrattori': [{'smiles': canon(s), 'errore': w} for s, w in picked]}
	return sample(ID, 3, rng.seed, prompt=f'Quale di queste strutture è il dipeptide {seq}?',
		problem=f'{AA[x][0]} ({x}) e {AA[y][0]} ({y}), con {AA[x][0]} all\'N-terminale',
		options=opts, correct=idx, solution=f'Il dipeptide {seq}, con un solo legame peptidico tra il carbossile {of(x)} e il gruppo amminico {of(y)}.',
		steps=steps, figura_soluzione=solution_peptide_svg(right), params=params)


def level4(rng: Rng) -> dict:
	n = rng.int(3, 5)
	pool = ['Gly', 'Ala', 'Val', 'Leu', 'Phe', 'Ser', 'Thr', 'Cys', 'Met', 'Asp', 'Glu', 'Lys']
	codes = [rng.pick(pool) for _ in range(n)]
	# metà delle volte una o due ammidi nelle catene laterali (asparagina, glutammina)
	if rng.next() < 0.5:
		for _ in range(rng.int(1, 2)):
			codes[rng.int(0, n - 1)] = rng.pick(['Asn', 'Gln'])
	smi = peptide(codes)
	side_amides = sum(1 for c in codes if c in ('Asn', 'Gln'))
	right = n - 1
	kind = rng.pick(['legami', 'acqua'])
	wrong = [n, right + side_amides if side_amides else None, n - 2, n + 1]
	wrong = [w for w in wrong if w is not None and w != right and w >= 0]
	picked = []
	for w in wrong:
		if w not in picked:
			picked.append(w)
		if len(picked) == 3:
			break
	correct = text_option(f'${right}$', [str(right)])
	distractors = [text_option(f'${w}$', [str(w)]) for w in picked]
	opts, idx = choice(rng, correct, distractors)
	prompt = {'legami': 'Quanti legami peptidici ci sono in questo peptide?',
		'acqua': 'Quante molecole d\'acqua si liberano quando questo peptide si forma dai suoi amminoacidi?'}[kind]
	steps = [
		f'Il peptide è {residue_list(codes)}: {n} amminoacidi, riconoscibili dai carboni α della catena principale.',
		f'Tra due amminoacidi vicini c\'è un legame peptidico: con {n} amminoacidi i legami sono ${n} - 1 = {right}$.',
	]
	if side_amides:
		steps.append('Le ammidi $-\\mathrm{CONH_2}$ nelle catene laterali di asparagina e glutammina non sono legami peptidici: non uniscono due amminoacidi.')
	if kind == 'acqua':
		steps.append(f'Ogni legame peptidico libera una molecola d\'acqua: le molecole d\'acqua sono {right}.')
	params = {'tipo': kind, 'sequenza': codes, 'smiles': canon(smi), 'risposta': right}
	return sample(ID, 4, rng.seed, prompt=prompt, figura=mol_svg(smi), options=opts, correct=idx,
		solution=f'${right}$', steps=steps, figura_soluzione=solution_peptide_svg(smi), params=params)


def level5(rng: Rng) -> dict:
	cls = rng.pick(['neutra', 'neutra', 'carica'])
	if cls == 'neutra':
		code = rng.pick(['Gly', 'Ala', 'Val', 'Leu', 'Ile', 'Phe', 'Ser', 'Thr', 'Asn', 'Gln', 'Met'])
	else:
		code = rng.pick(['Asp', 'Glu', 'Lys', 'Arg'])
	base = neutral(code)
	right = ionize(base, True, True)
	forms = {
		'neutra': base,
		'cationica': ionize(base, False, True),
		'anionica': ionize(base, True, False),
		'solo scheletro': ionize(base, True, True, side=False),
		'tutta protonata': ionize(base, False, True),
		'tutta deprotonata': ionize(base, True, False),
	}
	if AA[code][2] in ('acida', 'basica'):
		order = ['solo scheletro', 'neutra', 'tutta deprotonata' if AA[code][2] == 'acida' else 'tutta protonata']
	else:
		order = ['neutra', 'cationica', 'anionica']
	correct = mol_option(right, 'Struttura')
	distractors = [mol_option(forms[k], 'Struttura') | {'errore': k} for k in order]
	opts, idx = choice(rng, correct, distractors)
	for i, o in enumerate(opts, 1):
		o['text'] = f'Struttura {i}'
	q = net_charge(right)
	steps = [
		'A pH 7 il gruppo carbossilico ha perso $\\mathrm{H^+}$ ed è $-\\mathrm{COO^-}$; il gruppo amminico lo ha acquistato ed è $-\\mathrm{NH_3^+}$.',
	]
	if AA[code][2] == 'acida':
		steps.append('Anche il carbossile della catena laterale a pH 7 è $-\\mathrm{COO^-}$.')
	elif AA[code][2] == 'basica':
		steps.append('Anche il gruppo basico della catena laterale a pH 7 ha acquistato $\\mathrm{H^+}$ ed è carico positivamente.')
	sign = {0: '0', 1: '+1', -1: '-1'}[q]
	steps.append(f'Carica netta: ${sign}$.' + (' È uno zwitterione: due cariche opposte che si compensano.' if q == 0 else ''))
	params = {'amminoacido': code, 'classe': AA[code][2], 'smiles': canon(right), 'carica': q,
		'distrattori': [{'smiles': canon(forms[k]), 'errore': k} for k in order]}
	return sample(ID, 5, rng.seed, prompt=f'Quale di queste è la forma {of(code)} che prevale in acqua a pH 7?',
		options=opts, correct=idx, solution=f'La forma con carica netta ${sign}$.', steps=steps,
		figura_soluzione=mol_svg(right), params=params)


def generate(rng: Rng, level: int) -> dict:
	return {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}[level](rng)


def check(s: dict) -> list[str]:
	p = s['params']
	errs = []
	if len(s['options']) != 4:
		errs.append('servono 4 opzioni')
	level = s['level']
	if level == 1 and p['tipo'] not in GROUPS:
		errs.append('livello 1: gruppo sconosciuto')
	if level == 2 and p['amminoacido'] not in CLEAR[p['tipo']]:
		errs.append('livello 2: amminoacido fuori dalla sua classe')
	if level == 3 and len(set(p['sequenza'])) != 2:
		errs.append('livello 3: servono due amminoacidi diversi')
	if level == 4 and not 3 <= len(p['sequenza']) <= 5:
		errs.append('livello 4: da 3 a 5 amminoacidi')
	return errs
