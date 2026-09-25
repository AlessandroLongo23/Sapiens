"""
La geometria delle molecole (teoria VSEPR). Lezione: docs/lezioni/chimica/riscritte/02-geometria-molecolare-vsepr.md

Il generatore lavora su un elenco curato di molecole: per ognuna, scritti a mano, l'atomo centrale,
le sue coppie solitarie, la geometria, l'angolo di legame dei libri (solo dove tutti gli angoli
intorno al centro sono uguali) e la polarità. Il controllo indipendente non si fida di questi dati:
ricava le coppie solitarie dal grafo RDKit e conferma la geometria sulle coordinate 3D.

Livelli, ognuno con una difficoltà in più:
1. atomo centrale senza coppie solitarie e con soli legami semplici: la geometria dal disegno;
2. atomo centrale con coppie solitarie (geometria dei domini diversa da quella della molecola);
3. doppi e tripli legami sull'atomo centrale (contano come un solo dominio);
4. l'angolo di legame previsto (180°, 120°, 109,5°, circa 107°, circa 104,5°);
5. molecola polare o apolare, con il perché.

Le molecole che il campo di forza sbaglia (SO3 esce piramidale, CH3- piano, PCl5 senza forma) o che
non ha parametri (BeCl2, SF6, XeF2) non sono nell'elenco: il controllo 3D le boccerebbe.
"""

from __future__ import annotations

from comune import Rng, choice, mol_svg, sample, text_option

ID = 'geometria-molecolare-vsepr'
TITLE = 'La geometria delle molecole (VSEPR)'
LEVELS = {
	1: ('Senza coppie solitarie', ['atomo centrale senza coppie solitarie', 'solo legami semplici sull\'atomo centrale']),
	2: ('Con coppie solitarie', ['atomo centrale con 1 o 2 coppie solitarie', 'solo legami semplici sull\'atomo centrale']),
	3: ('Legami doppi e tripli', ['almeno un legame doppio o triplo sull\'atomo centrale']),
	4: ('L\'angolo di legame', ['molecola con tutti gli angoli uguali intorno all\'atomo centrale']),
	5: ('Polare o apolare', ['molecola neutra', 'polarità netta: legami chiaramente polari o apolari']),
}

GEOMETRIE = ['lineare', 'triangolare planare', 'tetraedrica', 'piramidale triangolare', 'piegata', 'quadrata planare']

# Una riga per molecola:
# (nome, formula in LaTeX, SMILES, indice dell'atomo centrale, coppie solitarie, legame multiplo sul
#  centro, geometria, angolo (i, j, k) con gli H aggiunti dopo gli atomi pesanti, angolo dei libri,
#  polarità, motivo, domanda sull'atomo evidenziato invece che sulla molecola)
# polarità None: la molecola non va al livello 5 (ione, o legami quasi apolari in una molecola polare).
_POOL = [
	('metano', 'CH_4', 'C', 0, 0, False, 'tetraedrica', (1, 0, 2), 109.5, 'apolare', 'apolari', False),
	('tetraclorometano (tetracloruro di carbonio)', 'CCl_4', 'ClC(Cl)(Cl)Cl', 1, 0, False, 'tetraedrica', (0, 1, 2), 109.5, 'apolare', 'compensati', False),
	('tetrafluorometano', 'CF_4', 'FC(F)(F)F', 1, 0, False, 'tetraedrica', (0, 1, 2), 109.5, 'apolare', 'compensati', False),
	('clorometano', 'CH_3Cl', 'CCl', 0, 0, False, 'tetraedrica', None, None, 'polare', 'non-compensati', False),
	('fluorometano', 'CH_3F', 'CF', 0, 0, False, 'tetraedrica', None, None, 'polare', 'non-compensati', False),
	('diclorometano', 'CH_2Cl_2', 'ClCCl', 1, 0, False, 'tetraedrica', None, None, 'polare', 'non-compensati', False),
	('triclorometano (cloroformio)', 'CHCl_3', 'ClC(Cl)Cl', 1, 0, False, 'tetraedrica', None, None, 'polare', 'non-compensati', False),
	('silano', 'SiH_4', '[SiH4]', 0, 0, False, 'tetraedrica', (1, 0, 2), 109.5, 'apolare', 'apolari', False),
	('tetracloruro di silicio', 'SiCl_4', 'Cl[Si](Cl)(Cl)Cl', 1, 0, False, 'tetraedrica', (0, 1, 2), 109.5, 'apolare', 'compensati', False),
	('ione ammonio', 'NH_4^+', '[NH4+]', 0, 0, False, 'tetraedrica', (1, 0, 2), 109.5, None, None, False),
	('trifluoruro di boro', 'BF_3', 'FB(F)F', 1, 0, False, 'triangolare planare', (0, 1, 2), 120, 'apolare', 'compensati', False),
	('tricloruro di boro', 'BCl_3', 'ClB(Cl)Cl', 1, 0, False, 'triangolare planare', (0, 1, 2), 120, 'apolare', 'compensati', False),
	('ammoniaca', 'NH_3', 'N', 0, 1, False, 'piramidale triangolare', (1, 0, 2), 107, 'polare', 'non-compensati', False),
	('acqua', 'H_2O', 'O', 0, 2, False, 'piegata', (1, 0, 2), 104.5, 'polare', 'non-compensati', False),
	('solfuro di idrogeno (acido solfidrico)', 'H_2S', 'S', 0, 2, False, 'piegata', None, None, None, None, False),
	('fosfina', 'PH_3', 'P', 0, 1, False, 'piramidale triangolare', None, None, None, None, False),
	('tricloruro di fosforo', 'PCl_3', 'ClP(Cl)Cl', 1, 1, False, 'piramidale triangolare', None, None, 'polare', 'non-compensati', False),
	('trifluoruro di azoto', 'NF_3', 'FN(F)F', 1, 1, False, 'piramidale triangolare', None, None, None, None, False),
	('difluoruro di ossigeno', 'OF_2', 'FOF', 1, 2, False, 'piegata', None, None, None, None, False),
	('dicloruro di zolfo', 'SCl_2', 'ClSCl', 1, 2, False, 'piegata', None, None, None, None, False),
	('ione ossonio', 'H_3O^+', '[OH3+]', 0, 1, False, 'piramidale triangolare', None, None, None, None, False),
	('diossido di carbonio (anidride carbonica)', 'CO_2', 'O=C=O', 1, 0, True, 'lineare', (0, 1, 2), 180, 'apolare', 'compensati', False),
	('disolfuro di carbonio', 'CS_2', 'S=C=S', 1, 0, True, 'lineare', (0, 1, 2), 180, 'apolare', 'apolari', False),
	('solfuro di carbonile', 'COS', 'O=C=S', 1, 0, True, 'lineare', None, None, 'polare', 'non-compensati', False),
	('cianuro di idrogeno (acido cianidrico)', 'HCN', 'C#N', 0, 0, True, 'lineare', (2, 0, 1), 180, 'polare', 'non-compensati', False),
	('etino (acetilene)', 'C_2H_2', 'C#C', 0, 0, True, 'lineare', (2, 0, 1), 180, 'apolare', 'apolari', True),
	('metanale (formaldeide)', 'CH_2O', 'C=O', 0, 0, True, 'triangolare planare', None, None, 'polare', 'non-compensati', False),
	('etene (etilene)', 'C_2H_4', 'C=C', 0, 0, True, 'triangolare planare', None, None, 'apolare', 'apolari', True),
	('dicloruro di carbonile (fosgene)', 'COCl_2', 'O=C(Cl)Cl', 1, 0, True, 'triangolare planare', None, None, 'polare', 'non-compensati', False),
	('diossido di zolfo (anidride solforosa)', 'SO_2', 'O=S=O', 1, 1, True, 'piegata', None, None, 'polare', 'non-compensati', False),
]
KEYS = ('nome', 'f', 'smiles', 'centro', 'coppie', 'multiplo', 'geo', 'angolo', 'gradi', 'pol', 'motivo', 'atomo')
POOL = [dict(zip(KEYS, row)) for row in _POOL]

# Elettroni di valenza, solo per scrivere i passaggi della soluzione.
VALENZA = {'H': 1, 'B': 3, 'C': 4, 'Si': 4, 'N': 5, 'P': 5, 'O': 6, 'S': 6, 'F': 7, 'Cl': 7}
NOMI_ATOMO = {'B': 'boro', 'C': 'carbonio', 'Si': 'silicio', 'N': 'azoto', 'P': 'fosforo', 'O': 'ossigeno', 'S': 'zolfo'}

ANGOLI = {180: '$180^\\circ$', 120: '$120^\\circ$', 109.5: '$109{,}5^\\circ$', 107: 'circa $107^\\circ$',
	104.5: 'circa $104{,}5^\\circ$', 90: '$90^\\circ$'}

MOTIVI = {
	('polare', 'non-compensati'): 'Polare: ha legami polari e la sua geometria non ne annulla l\'effetto',
	('apolare', 'compensati'): 'Apolare: ha legami polari, ma la geometria simmetrica ne annulla l\'effetto',
	('apolare', 'apolari'): 'Apolare: i suoi legami sono apolari (differenza di elettronegatività minore di $0{,}4$)',
	('polare', 'basta'): 'Polare: ha legami polari, e questo basta',
}


# ---------------------------------------------------------------------------
# Scelta della molecola

def for_level(level: int) -> list[dict]:
	if level == 1:
		return [m for m in POOL if m['coppie'] == 0 and not m['multiplo']]
	if level == 2:
		return [m for m in POOL if m['coppie'] > 0 and not m['multiplo']]
	if level == 3:
		return [m for m in POOL if m['multiplo']]
	if level == 4:
		return [m for m in POOL if m['angolo']]
	return [m for m in POOL if m['pol']]


def pick_molecule(rng: Rng, level: int) -> dict:
	pool = for_level(level)
	if level == 4:
		# prima l'angolo, poi la molecola: se no le coppie solitarie uscirebbero 2 volte su 14
		value = rng.pick(sorted({m['gradi'] for m in pool}))
		pool = [m for m in pool if m['gradi'] == value]
	return rng.pick(pool)


def symbols(m: dict) -> list[str]:
	"""Simboli degli atomi con gli H aggiunti in fondo, nell'ordine degli indici."""
	from rdkit import Chem
	return [a.GetSymbol() for a in Chem.AddHs(Chem.MolFromSmiles(m['smiles'])).GetAtoms()]


def center_symbol(m: dict) -> str:
	return symbols(m)[m['centro']]


ARTICOLI = {None: ('il ', "l'", 'lo ', 'la '), 'di': ('del ', "dell'", 'dello ', 'della '), 'in': ('nel ', "nell'", 'nello ', 'nella ')}
FEMMINILI = {'fosfina'}


def named(m: dict, prep: str | None = None) -> str:
	"""Articolo, nome e formula: "del metano, $\\mathrm{CH_4}$", "dell'acqua, ...", "dello ione ammonio, ..."."""
	n = m['nome']
	il, l, lo, la = ARTICOLI[prep]
	art = lo if n.startswith('ione') else l if n[0] in 'aeiou' else la if n.split()[0] in FEMMINILI else il
	return f'{art}{n}, $\\mathrm{{{m["f"]}}}$'


# ---------------------------------------------------------------------------
# Distrattori, dagli errori tipici

def wrong_geometries(m: dict) -> list[tuple[str, str]]:
	"""(geometria sbagliata, errore) in ordine di preferenza."""
	g, lp, multi = m['geo'], m['coppie'], m['multiplo']
	if g == 'tetraedrica':
		return [('quadrata planare', 'disegno piatto'), ('piramidale triangolare', 'confonde le geometrie'),
			('triangolare planare', 'conta male i domini')]
	if g == 'triangolare planare' and multi:
		return [('tetraedrica', 'doppio legame contato come due domini'), ('piramidale triangolare', 'confonde le geometrie'),
			('lineare', 'conta male i domini')]
	if g == 'triangolare planare':
		return [('piramidale triangolare', 'confonde con l\'ammoniaca'), ('tetraedrica', 'conta male i domini'),
			('piegata', 'conta male i domini')]
	if g == 'piramidale triangolare':
		return [('tetraedrica', 'geometria dei domini'), ('triangolare planare', 'ignora la coppia solitaria'),
			('piegata', 'conta male le coppie solitarie')]
	if g == 'piegata' and lp == 2:
		return [('tetraedrica', 'geometria dei domini'), ('lineare', 'ignora le coppie solitarie'),
			('piramidale triangolare', 'conta male le coppie solitarie')]
	if g == 'piegata':
		return [('lineare', 'ignora la coppia solitaria'), ('triangolare planare', 'geometria dei domini'),
			('tetraedrica', 'doppio legame contato come due domini')]
	# lineare
	return [('tetraedrica', 'doppio legame contato come due domini'), ('piegata', 'confonde con l\'acqua'),
		('triangolare planare', 'conta male i domini')]


def wrong_angles(m: dict) -> list[tuple[float, str]]:
	a = m['gradi']
	return {
		180: [(120, 'conta male i domini'), (109.5, 'legame multiplo contato come due domini'), (104.5, 'confonde con l\'acqua')],
		120: [(109.5, 'confonde con il tetraedro'), (90, 'disegno piatto'), (107, 'confonde con l\'ammoniaca')],
		109.5: [(90, 'disegno piatto'), (120, 'conta male i domini'), (107, 'confonde con l\'ammoniaca')],
		107: [(109.5, 'ignora la spinta della coppia solitaria'), (120, 'ignora la coppia solitaria'), (104.5, 'confonde con l\'acqua')],
		104.5: [(109.5, 'ignora la spinta delle coppie solitarie'), (107, 'confonde con l\'ammoniaca'), (180, 'ignora le coppie solitarie')],
	}[a]


# ---------------------------------------------------------------------------
# Spiegazione

def count_steps(m: dict) -> list[str]:
	"""Il conto dei domini sull'atomo centrale, come nel procedimento della lezione."""
	sym = center_symbol(m)
	nb, bonds, charge = m['_legati'], m['_elettroni_legami'], m['_carica']
	v = VALENZA[sym]
	e = v - charge
	lp = m['coppie']
	name = NOMI_ATOMO[sym]
	art = "l'" if name[0] in 'aeiou' else 'lo ' if name[0] == 'z' else 'il '
	coppie = {0: 'nessuna coppia solitaria', 1: 'una coppia solitaria', 2: 'due coppie solitarie'}[lp]
	first = f'L\'atomo centrale è {art}{name}, con {v} elettroni di valenza'
	if charge:
		first += f'; con la carica {"positiva" if charge > 0 else "negativa"} ne ha {e}'
	rest = 'non resta nessun elettrone, quindi' if e == bonds else f'restano {e - bonds} elettroni, cioè'
	first += f'. È legato a {nb} atomi e mette {bonds} elettroni nei legami: {rest} {coppie}.'
	steps = [first]
	if m['multiplo']:
		steps.append('Ogni legame, semplice, doppio o triplo, conta come un solo dominio.')
	sn = nb + lp
	dom = {2: 'lungo una retta, a $180^\\circ$', 3: 'ai vertici di un triangolo, a $120^\\circ$',
		4: 'ai vertici di un tetraedro, a $109{,}5^\\circ$'}[sn]
	steps.append(f'Numero sterico: ${nb} + {lp} = {sn}$. I domini si dispongono {dom}.')
	if lp:
		steps.append(f'La geometria della molecola si legge dai soli atomi: con {coppie} è {m["geo"]}.')
	else:
		steps.append(f'Senza coppie solitarie la geometria della molecola è quella dei domini: {m["geo"]}.')
	return steps


def annotate(m: dict) -> dict:
	"""Legami e carica dell'atomo centrale, per i passaggi: dal SMILES scritto nell'elenco."""
	from rdkit import Chem
	mol = Chem.AddHs(Chem.MolFromSmiles(m['smiles']))
	a = mol.GetAtomWithIdx(m['centro'])
	return m | {
		'_legati': a.GetDegree(),
		'_elettroni_legami': int(sum(b.GetBondTypeAsDouble() for b in a.GetBonds())),
		'_carica': a.GetFormalCharge(),
	}


def figure(m: dict) -> str:
	return mol_svg(m['smiles'], idrogeni='tutti', carboni='si', atomi=f'{m["centro"]} giallo')


# ---------------------------------------------------------------------------

def generate(rng: Rng, level: int) -> dict:
	m = annotate(pick_molecule(rng, level))
	params = {
		'livello': level, 'smiles': m['smiles'], 'centro': m['centro'], 'nome': m['nome'],
		'coppie': m['coppie'], 'geometria': m['geo'],
	}
	steps = count_steps(m)
	fig = figure(m)

	if level <= 3:
		correct = text_option(m['geo'])
		picked = wrong_geometries(m)
		opts, idx = choice(rng, correct, [text_option(g) | {'errore': why} for g, why in picked])
		params['tipo'] = 'geometria'
		params['errori'] = {g: why for g, why in picked}
		where = f'intorno all\'atomo di carbonio evidenziato, {named(m, "in")}' if m['atomo'] else named(m, 'di')
		return sample(ID, level, rng.seed,
			prompt=f'Qual è la geometria {where}?',
			problem='Nel disegno ci sono gli atomi e i legami; le coppie solitarie non sono disegnate.',
			figura=fig, options=opts, correct=idx, solution=m['geo'], steps=steps, params=params)

	if level == 4:
		i, j, k = m['angolo']
		sy = symbols(m)
		label = f'{sy[i]}–{sy[j]}–{sy[k]}'
		correct = text_option(ANGOLI[m['gradi']], [str(m['gradi'])])
		picked = wrong_angles(m)
		opts, idx = choice(rng, correct, [text_option(ANGOLI[a], [str(a)]) | {'errore': why} for a, why in picked])
		params |= {'tipo': 'angolo', 'angolo': list(m['angolo']), 'gradi': m['gradi'],
			'errori': {str(a): why for a, why in picked}}
		why = {
			180: 'Due domini stanno da parti opposte: l\'angolo è di $180^\\circ$.',
			120: 'Tre domini nello stesso piano: l\'angolo è di $120^\\circ$.',
			109.5: 'Quattro domini uguali ai vertici di un tetraedro: l\'angolo è di $109{,}5^\\circ$.',
			107: 'La coppia solitaria occupa più spazio di una coppia di legame e stringe gli angoli: circa $107^\\circ$ invece di $109{,}5^\\circ$.',
			104.5: 'Le due coppie solitarie stringono gli angoli più di una: circa $104{,}5^\\circ$.',
		}[m['gradi']]
		return sample(ID, level, rng.seed,
			prompt=f'Quanto vale l\'angolo di legame {label} {named(m, "in")}?',
			problem='Nel disegno le coppie solitarie non sono disegnate, e gli angoli del disegno non sono quelli veri.',
			figura=fig, options=opts, correct=idx, solution=ANGOLI[m['gradi']], steps=steps + [why], params=params)

	correct_key = (m['pol'], m['motivo'])
	keys = list(MOTIVI)
	correct = text_option(MOTIVI[correct_key], list(correct_key))
	others = [text_option(MOTIVI[k], list(k)) for k in keys if k != correct_key]
	opts, idx = choice(rng, correct, others)
	params |= {'tipo': 'polarita', 'polarita': m['pol'], 'motivo': m['motivo']}
	pol_step = {
		'non-compensati': 'I legami sono polari e la geometria non è simmetrica: i loro effetti non si annullano, la molecola è polare.',
		'compensati': 'I legami sono polari, ma sono disposti in modo simmetrico intorno all\'atomo centrale: i loro effetti si annullano e la molecola è apolare.',
		'apolari': 'La differenza di elettronegatività tra gli atomi legati è minore di $0{,}4$: i legami sono apolari, e la molecola è apolare.',
	}[m['motivo']]
	return sample(ID, level, rng.seed,
		prompt=f'{named(m)[0].upper()}{named(m)[1:]}, è polare o apolare? Perché?',
		problem='Nel disegno le coppie solitarie non sono disegnate.',
		figura=fig, options=opts, correct=idx, solution=MOTIVI[correct_key], steps=steps + [pol_step], params=params)


def check(s: dict) -> list[str]:
	p = s['params']
	errs = []
	level = s['level']
	m = next((x for x in POOL if x['smiles'] == p['smiles']), None)
	if m is None:
		return ['molecola fuori dall\'elenco']
	if level == 1 and (m['coppie'] or m['multiplo']):
		errs.append('livello 1: niente coppie solitarie e niente legami multipli')
	if level == 2 and (not m['coppie'] or m['multiplo']):
		errs.append('livello 2: servono coppie solitarie e soli legami semplici')
	if level == 3 and not m['multiplo']:
		errs.append('livello 3: serve un legame multiplo sull\'atomo centrale')
	if level == 4 and not m['angolo']:
		errs.append('livello 4: serve un angolo unico')
	if level == 5 and not m['pol']:
		errs.append('livello 5: serve una polarità netta')
	if len(s['options']) != 4:
		errs.append('servono 4 opzioni')
	return errs
