"""
La mole e la massa molare. Lezione: docs/lezioni/chimica/riscritte/01-mole-massa-molare.md

Ogni esercizio parte da una molecola vera disegnata in formula scheletrica (RDKit), presa da un
elenco curato. La formula bruta si ricava dal grafo di RDKit; le masse si calcolano con la tavola
della lezione (due decimali), non con le masse di RDKit, così i numeri sono quelli che lo studente
trova a mano. I conti sono in Decimal, con arrotondamento a metà per eccesso.

Livelli, ognuno con una difficoltà in più:
1. dal disegno la formula bruta (gli idrogeni sul carbonio non sono scritti);
2. dal disegno la massa molare;
3. dalla massa le moli, n = m/M (la massa molare si ricava dal disegno);
4. dalla massa il numero di molecole o di atomi, N = n · N_A (· atomi per molecola);
5. la composizione percentuale in massa di un elemento.

Formato dei numeri: virgola decimale; masse molari con due decimali; moli e particelle con tre
cifre significative, come la massa data; percentuali con un decimale.
"""

from __future__ import annotations

from decimal import ROUND_HALF_UP, Decimal

from rdkit import Chem

from comune import Rng, canon, choice, mol_svg, sample

ID = 'mole-massa-molare'
TITLE = 'La mole e la massa molare'
LEVELS = {
	1: ('La formula dal disegno', ['molecola organica in formula scheletrica', 'almeno un idrogeno non scritto']),
	2: ('La massa molare', ['molecola organica in formula scheletrica', 'massa molare con due decimali']),
	3: ('Dalla massa alle moli', ['massa con tre cifre significative', 'moli con tre cifre significative']),
	4: ('Molecole e atomi', ['numero di molecole, di atomi di un elemento o di atomi in tutto', 'tre cifre significative']),
	5: ('Composizione percentuale', ['un elemento con almeno due atomi nella molecola', 'percentuale con un decimale']),
}

# La tavola della lezione (docs/lezioni/chimica/riscritte/01-mole-massa-molare.md).
MASSE = {
	'H': Decimal('1.01'), 'C': Decimal('12.01'), 'N': Decimal('14.01'), 'O': Decimal('16.00'),
	'Na': Decimal('22.99'), 'Mg': Decimal('24.31'), 'P': Decimal('30.97'), 'S': Decimal('32.07'),
	'Cl': Decimal('35.45'), 'K': Decimal('39.10'), 'Ca': Decimal('40.08'), 'Fe': Decimal('55.85'),
}
NA = Decimal('6.022e23')
ELEMENTI = {'H': 'idrogeno', 'C': 'carbonio', 'N': 'azoto', 'O': 'ossigeno'}

# Molecole organiche: (SMILES, nome). Ognuna ha idrogeni sul carbonio, che nel disegno non si vedono.
ORGANICHE = [
	('CCO', 'etanolo'),
	('CO', 'metanolo'),
	('CC(=O)O', 'acido acetico'),
	('OC=O', 'acido formico'),
	('CC(C)=O', 'acetone'),
	('OCC(O)CO', 'glicerolo'),
	('CC(O)C(=O)O', 'acido lattico'),
	('NCC(=O)O', 'glicina'),
	('CCOC(C)=O', 'acetato di etile'),
	('CCC', 'propano'),
	('CCCC', 'butano'),
	('c1ccccc1', 'benzene'),
	('C(C1C(C(C(C(O1)O)O)O)O)O', 'glucosio'),
	('Cn1cnc2c1c(=O)n(C)c(=O)n2C', 'caffeina'),
	('CC(=O)Oc1ccccc1C(=O)O', 'acido acetilsalicilico'),
	('CC(=O)Nc1ccc(O)cc1', 'paracetamolo'),
	('COc1cc(C=O)ccc1O', 'vanillina'),
	('OCC(O)C1OC(=O)C(O)=C1O', 'acido ascorbico (vitamina C)'),
	('OC(=O)CC(O)(CC(=O)O)C(=O)O', 'acido citrico'),
	('CC(C)C1CCC(C)CC1O', 'mentolo'),
	('CN1CCCC1c1cccnc1', 'nicotina'),
	('CC(C)Cc1ccc(cc1)C(C)C(=O)O', 'ibuprofene'),
]
# Sostanze piccole, solo dal livello 3: il disegno ha già tutti gli atomi scritti, o quasi.
PICCOLE = [
	('O', 'acqua'),
	('O=C=O', 'anidride carbonica'),
	('C', 'metano'),
	('N', 'ammoniaca'),
	('OO', 'acqua ossigenata'),
	('NC(N)=O', 'urea'),
]
TUTTE = ORGANICHE + PICCOLE

# Quantità in moli da cui si parte (tre cifre significative); la massa data è n · M arrotondata.
MOLI = ['0.0200', '0.0500', '0.100', '0.150', '0.200', '0.250', '0.300', '0.400', '0.500', '0.750',
	'1.20', '1.50', '2.00', '2.50', '3.00', '4.00']


# ---------------------------------------------------------------------------
# Formule e masse

def conta(smiles: str) -> dict[str, int]:
	"""Atomi per elemento, idrogeni compresi, dal grafo di RDKit."""
	mol = Chem.MolFromSmiles(smiles)
	out: dict[str, int] = {}
	for a in mol.GetAtoms():
		out[a.GetSymbol()] = out.get(a.GetSymbol(), 0) + 1
		if a.GetTotalNumHs():
			out['H'] = out.get('H', 0) + a.GetTotalNumHs()
	return out


def idrogeni_scritti(smiles: str) -> int:
	"""Gli idrogeni che il disegno scheletrico mostra: quelli sugli atomi diversi dal carbonio."""
	mol = Chem.MolFromSmiles(smiles)
	return sum(a.GetTotalNumHs() for a in mol.GetAtoms() if a.GetAtomicNum() != 6)


def ordine(c: dict[str, int]) -> list[str]:
	"""Ordine di Hill: C, H, poi alfabetico; senza carbonio tutto alfabetico."""
	if 'C' in c:
		return ['C'] + (['H'] if 'H' in c else []) + sorted(e for e in c if e not in ('C', 'H'))
	return sorted(c)


def formula_tex(c: dict[str, int]) -> str:
	parts = []
	for e in ordine(c):
		if c[e] <= 0:
			continue
		parts.append(e if c[e] == 1 else f'{e}_{{{c[e]}}}')
	return r'\mathrm{' + ''.join(parts) + '}'


def formula_txt(c: dict[str, int]) -> str:
	return ''.join(e + (str(c[e]) if c[e] > 1 else '') for e in ordine(c) if c[e] > 0)


def massa(c: dict[str, int]) -> Decimal:
	return sum((MASSE[e] * n for e, n in c.items() if n > 0), Decimal(0))


# ---------------------------------------------------------------------------
# Numeri

def arrotonda(x: Decimal, cifre: int) -> Decimal:
	"""x con `cifre` cifre significative."""
	if x == 0:
		return x
	e = x.adjusted()
	return x.quantize(Decimal(1).scaleb(e - cifre + 1), rounding=ROUND_HALF_UP)


def decimali(x: Decimal, d: int) -> Decimal:
	return x.quantize(Decimal(1).scaleb(-d), rounding=ROUND_HALF_UP)


def virgola(s: str) -> str:
	return s.replace('.', '{,}')


def num_tex(x: Decimal, cifre: int = 3, scientifica: bool | None = None) -> str:
	"""x con tre cifre significative; notazione scientifica se è molto grande o molto piccolo."""
	x = arrotonda(x, cifre)
	if scientifica is None:
		scientifica = x >= 10000 or x < Decimal('0.001')
	if not scientifica:
		e = x.adjusted()
		return virgola(format(x.quantize(Decimal(1).scaleb(min(0, e - cifre + 1))), 'f'))
	e = x.adjusted()
	mant = arrotonda(x.scaleb(-e), cifre)
	if mant >= 10:
		mant, e = arrotonda(mant / 10, cifre), e + 1
	return virgola(format(mant, 'f')) + rf' \cdot 10^{{{e}}}'


def tex_txt(t: str) -> str:
	"""Il testo per la sintesi vocale."""
	import re
	t = t.replace('$', '').replace('{,}', ',').replace(r'\ ', ' ').replace(r'\%', '%')
	t = re.sub(r' \\cdot 10\^\{(-?\d+)\}', r' per 10 alla \1', t)
	t = re.sub(r'\\mathrm\{([^}]*)\}', r'\1', t)
	return re.sub(r'_\{(\d+)\}', r'\1', t).replace('_', '')


def opzione(latex: str, errore: str | None = None) -> dict:
	o = {'latex': f'${latex}$', 'text': tex_txt(latex), 'values': [latex]}
	if errore:
		o['errore'] = errore
	return o


# ---------------------------------------------------------------------------
# Conti mostrati nella soluzione

def conto_massa(c: dict[str, int]) -> str:
	terms = [(f'{c[e]} \\cdot ' if c[e] > 1 else '') + virgola(str(MASSE[e])) for e in ordine(c)]
	return ' + '.join(terms) + ' = ' + virgola(str(massa(c))) + r'\ \mathrm{g/mol}'


def passi_formula(smiles: str, c: dict[str, int]) -> list[str]:
	scritti = idrogeni_scritti(smiles)
	sul_c = c.get('H', 0) - scritti
	if c['C'] == 1:
		steps = ["Nel disegno c'è un atomo di carbonio: l'estremo della linea senza simbolo."]
	else:
		steps = [f'Nel disegno ci sono {c["C"]} atomi di carbonio: i vertici e gli estremi senza simbolo.']
	altri = [e for e in ordine(c) if e not in ('C', 'H')]
	if altri:
		steps.append('Gli atomi scritti con il loro simbolo sono ' + ', '.join(f'{c[e]} {"atomo" if c[e] == 1 else "atomi"} di {ELEMENTI[e]}' for e in altri) + '.')
	if scritti:
		steps.append(f'Gli idrogeni scritti (sugli atomi diversi dal carbonio) sono {scritti}.')
	steps.append(f'Ogni carbonio ha quattro legami: quelli che non si vedono sono con atomi di idrogeno, e sono {sul_c}.')
	steps.append(f'In tutto gli idrogeni sono {c.get("H", 0)}, e la formula bruta è ${formula_tex(c)}$.')
	return steps


# ---------------------------------------------------------------------------
# Livelli

def livello1(rng: Rng, smi: str, nome: str, c: dict[str, int]) -> tuple:
	scritti = idrogeni_scritti(smi)
	sbagliate: list[tuple[dict, str]] = [({**c, 'H': scritti}, 'impliciti')]
	altri = []
	if scritti:
		altri.append(({**c, 'H': c['H'] - scritti}, 'eteroatomi'))
	altri.append(({**c, 'C': c['C'] - 1 if c['C'] > 1 else c['C'] + 1}, 'carboni'))
	altri.append(({**c, 'C': c['C'] + 1}, 'carboni'))
	altri.append(({**c, 'H': c['H'] + 2}, 'idrogeni'))
	if c['H'] > 2:
		altri.append(({**c, 'H': c['H'] - 2}, 'idrogeni'))
	sbagliate += rng.shuffle(altri)
	visti, distr = {formula_tex(c)}, []
	for f, why in sbagliate:
		t = formula_tex(f)
		if t not in visti and f.get('C', 0) > 0:
			visti.add(t)
			distr.append(opzione(t, why))
	opts, idx = choice(rng, opzione(formula_tex(c)), distr[:3])
	return ('Qual è la formula bruta di questa molecola?', opts, idx, f'${formula_tex(c)}$',
		passi_formula(smi, c), {})


def livello2(rng: Rng, smi: str, nome: str, c: dict[str, int]) -> tuple:
	M = massa(c)
	scritti = idrogeni_scritti(smi)
	cand = [(massa({**c, 'H': scritti}), 'impliciti')]
	altri = [
		(massa({e: 1 for e in c}), 'indici'),
		(massa({**c, 'C': c['C'] - 1 if c['C'] > 1 else c['C'] + 1}), 'carboni'),
		(massa({**c, 'H': c['H'] + 2}), 'idrogeni'),
	]
	if scritti:
		altri.append((massa({**c, 'H': c['H'] - scritti}), 'eteroatomi'))
	cand += rng.shuffle(altri)
	distr, visti = [], {M}
	for x, why in cand:
		if x not in visti:
			visti.add(x)
			distr.append(opzione(virgola(str(x)) + r'\ \mathrm{g/mol}', why))
	opts, idx = choice(rng, opzione(virgola(str(M)) + r'\ \mathrm{g/mol}'), distr[:3])
	steps = passi_formula(smi, c)[-1:] + [f'Si somma la massa di ogni atomo: ${conto_massa(c)}$.']
	return ('Qual è la massa molare di questa molecola?', opts, idx, f'${virgola(str(M))}\\ \\mathrm{{g/mol}}$', steps, {})


def massa_data(rng: Rng, M: Decimal) -> tuple[Decimal, Decimal]:
	"""(massa data con tre cifre significative, moli di partenza) con un conto che torna pulito."""
	for _ in range(100):
		n0 = Decimal(rng.pick(MOLI))
		m = arrotonda(n0 * M, 3)
		if m >= 100 and m % 10 == 0:
			continue  # 450 g: non si capisce se lo zero è significativo
		if m > 1000 or m < Decimal('0.1'):
			continue
		if arrotonda(m / M, 3) == n0:
			return m, n0
	raise RuntimeError('nessuna massa pulita')


def livello3(rng: Rng, smi: str, nome: str, c: dict[str, int]) -> tuple:
	M = massa(c)
	m, n0 = massa_data(rng, M)
	n = m / M
	cand = [(m * M, 'moltiplica'), (M / m, 'inverte')]
	scritti = idrogeni_scritti(smi)
	if 'C' in c and c.get('H', 0) > scritti:
		cand.append((m / massa({**c, 'H': scritti}), 'impliciti'))
	cand.append((m / massa({e: 1 for e in c}), 'indici'))
	if 'C' in c:
		cand.append((m / massa({**c, 'C': c['C'] - 1 if c['C'] > 1 else c['C'] + 1}), 'carboni'))
	else:
		cand.append((m / massa({**c, 'H': c.get('H', 0) + 1}), 'idrogeni'))
	giusta = num_tex(n) + r'\ \mathrm{mol}'
	distr, visti = [], {giusta}
	for x, why in cand:
		t = num_tex(x) + r'\ \mathrm{mol}'
		if t not in visti:
			visti.add(t)
			distr.append(opzione(t, why))
	opts, idx = choice(rng, opzione(giusta), distr[:3])
	mt = num_tex(m)
	steps = [
		f'La formula bruta è ${formula_tex(c)}$, quindi $M = {conto_massa(c)}$.',
		f'$n = \\dfrac{{m}}{{M}} = \\dfrac{{{mt}\\ \\mathrm{{g}}}}{{{virgola(str(M))}\\ \\mathrm{{g/mol}}}} = {giusta}$.',
	]
	prompt = f'Quante moli ci sono in ${mt}\\ \\mathrm{{g}}$ di {nome}? La molecola è questa.'
	return prompt, opts, idx, f'${giusta}$', steps, {'m': str(m), 'n0': str(n0)}


def livello4(rng: Rng, smi: str, nome: str, c: dict[str, int]) -> tuple:
	M = massa(c)
	m, n0 = massa_data(rng, M)
	n = m / M
	tot = sum(c.values())
	multi = [e for e in ordine(c) if c[e] >= 2 and e in ELEMENTI]
	tipo = rng.pick(['molecole', 'atomi', 'atomi', 'totale'] if multi else ['molecole', 'totale'])
	el = None
	if tipo == 'molecole':
		k, cosa = 1, 'molecole'
	elif tipo == 'atomi':
		el = rng.pick(multi)
		k, cosa = c[el], f'atomi di {ELEMENTI[el]}'
	else:
		k, cosa = tot, 'atomi in tutto (di tutti gli elementi)'
	N = n * NA * k
	cand = [(n / NA * k, 'divide'), (m * NA * k, 'massa')]
	cand.append((n * NA, 'molecole') if k > 1 else (n * NA * tot, 'atomi'))
	cand.append((M / m * NA * k, 'inverte'))
	giusta = num_tex(N, scientifica=True)
	distr, visti = [], {giusta}
	for x, why in cand:
		t = num_tex(x, scientifica=True)
		if t not in visti:
			visti.add(t)
			distr.append(opzione(t, why))
	opts, idx = choice(rng, opzione(giusta), distr[:3])
	mt = num_tex(m)
	nt = num_tex(n) + r'\ \mathrm{mol}'
	steps = [
		f'La formula bruta è ${formula_tex(c)}$, quindi $M = {virgola(str(M))}\\ \\mathrm{{g/mol}}$.',
		f'Le moli sono $n = \\dfrac{{{mt}\\ \\mathrm{{g}}}}{{{virgola(str(M))}\\ \\mathrm{{g/mol}}}} = {nt}$.',
		f'Le molecole sono $n \\cdot N_A = {nt} \\cdot 6{{,}}022 \\cdot 10^{{23}}\\ \\mathrm{{mol^{{-1}}}} = {num_tex(n * NA, scientifica=True)}$.',
	]
	if k > 1:
		steps.append(f'Ogni molecola ha {k} {cosa.split(" (")[0]}, quindi il numero va moltiplicato per {k}: ${giusta}$.')
	quanti = 'Quante' if tipo == 'molecole' else 'Quanti'
	prompt = f'{quanti} {cosa} ci sono in ${mt}\\ \\mathrm{{g}}$ di {nome}? La molecola è questa ($N_A = 6{{,}}022 \\cdot 10^{{23}}\\ \\mathrm{{mol^{{-1}}}}$).'
	return prompt, opts, idx, f'${giusta}$', steps, {'m': str(m), 'n0': str(n0), 'tipo': tipo, 'k': k,
		'elemento': el}


def percento(x: Decimal) -> str:
	return virgola(str(decimali(x, 1))) + r'\%'


def livello5(rng: Rng, smi: str, nome: str, c: dict[str, int]) -> tuple:
	M = massa(c)
	multi = [e for e in ordine(c) if c[e] >= 2 and e in ELEMENTI]
	non_h = [e for e in multi if e != 'H']
	el = rng.pick(non_h) if non_h and ('H' not in multi or rng.next() < 0.7) else rng.pick(multi)
	k, A = c[el], MASSE[el]
	pct = k * A / M * 100
	tot = sum(c.values())
	cand = [(A / M * 100, 'indice'), (Decimal(k) / tot * 100, 'atomi'), (k * A / (M - k * A) * 100, 'resto')]
	scritti = idrogeni_scritti(smi)
	if 'C' in c and c.get('H', 0) > scritti:
		cw = {**c, 'H': scritti}
		cand.append((cw.get(el, 0) * A / massa(cw) * 100, 'impliciti'))
	altri = [(c[e] * MASSE[e] / M * 100, 'elemento') for e in ordine(c) if e != el]
	altri.append((100 - pct, 'complemento'))
	giusta = percento(pct)
	distr, visti = [], {giusta}
	first = rng.shuffle(cand[:3]) + cand[3:] + rng.shuffle(altri)
	for x, why in first:
		t = percento(x)
		if t not in visti and 0 < x < 100:
			visti.add(t)
			distr.append(opzione(t, why))
	opts, idx = choice(rng, opzione(giusta), distr[:3])
	steps = [
		f'La formula bruta è ${formula_tex(c)}$, quindi $M = {conto_massa(c)}$.',
		f'Gli atomi di {ELEMENTI[el]} sono {k} e pesano ${k} \\cdot {virgola(str(A))} = {virgola(str(k * A))}$.',
		f'$\\%\\mathrm{{{el}}} = \\dfrac{{{virgola(str(k * A))}}}{{{virgola(str(M))}}} \\cdot 100 = {giusta}$.',
	]
	prompt = f'Qual è la percentuale in massa di {ELEMENTI[el]} in questa sostanza ({nome})?'
	return prompt, opts, idx, f'${giusta}$', steps, {'elemento': el, 'k': k}


def generate(rng: Rng, level: int) -> dict:
	pool = ORGANICHE if level <= 2 else TUTTE
	if level == 5:
		pool = [(s, n) for s, n in TUTTE if any(v >= 2 and e in ELEMENTI for e, v in conta(s).items())]
	smi, nome = rng.pick(pool)
	c = conta(smi)
	fn = {1: livello1, 2: livello2, 3: livello3, 4: livello4, 5: livello5}[level]
	prompt, opts, idx, solution, steps, extra = fn(rng, smi, nome, c)
	if level == 5 and extra['elemento'] != 'H':
		z = Chem.Atom(extra['elemento']).GetAtomicNum()
		fig_sol = mol_svg(smi, evidenzia=f'[#{z}] {"blu" if z == 7 else "rosso" if z == 8 else "giallo"}')
	else:
		fig_sol = mol_svg(smi, idrogeni='tutti', carboni='si')
	params = {
		'smiles': canon(smi), 'nome': nome, 'formula': formula_txt(c), 'atomi': c,
		'M': str(massa(c)), 'errori': {o['values'][0]: o['errore'] for o in opts if 'errore' in o},
	} | extra
	return sample(ID, level, rng.seed, prompt=prompt, problem=nome if level <= 2 else '',
		figura=mol_svg(smi, legenda=nome) if level > 2 else mol_svg(smi), options=opts, correct=idx,
		solution=solution, steps=steps, figura_soluzione=fig_sol, params=params)


def check(s: dict) -> list[str]:
	"""Vincoli della specifica, livello per livello."""
	p, level = s['params'], s['level']
	errs = []
	if len(s['options']) != 4:
		errs.append('servono 4 opzioni')
	c = p['atomi']
	if level <= 2 and (c.get('C', 0) == 0 or c.get('H', 0) <= idrogeni_scritti(p['smiles'])):
		errs.append('livelli 1 e 2: servono idrogeni non scritti sul carbonio')
	if level in (3, 4) and len(Decimal(p['m']).normalize().as_tuple().digits) > 3:
		errs.append('la massa data ha più di tre cifre significative')
	if level == 5 and c.get(p['elemento'], 0) < 2:
		errs.append("livello 5: l'elemento deve comparire almeno due volte")
	return errs
