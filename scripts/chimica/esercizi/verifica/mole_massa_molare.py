"""
Controllo indipendente di mole-massa-molare: non importa niente dal generatore né da comune.py.

- La formula si ricava dal SMILES contando gli atomi del grafo uno per uno (con gli idrogeni
  impliciti di ogni atomo), senza CalcMolFormula; le masse con una copia propria della tavola della
  lezione, in frazioni esatte.
- Le opzioni si leggono come numeri (o come formule) dal loro LaTeX, e si confrontano con il valore
  esatto ricalcolato: la giusta deve esserne l'arrotondamento, con le cifre richieste (due decimali
  per le masse molari, tre cifre significative per moli e particelle, un decimale per le
  percentuali); nessun distrattore può avere lo stesso valore.
- I dati della domanda (massa, sostanza, cosa si conta) devono comparire nel testo.
"""
import re
from fractions import Fraction

from rdkit import Chem

TAVOLA = {'H': '1,01', 'C': '12,01', 'N': '14,01', 'O': '16,00', 'Na': '22,99', 'Mg': '24,31',
	'P': '30,97', 'S': '32,07', 'Cl': '35,45', 'K': '39,10', 'Ca': '40,08', 'Fe': '55,85'}
A = {el: Fraction(v.replace(',', '.')) for el, v in TAVOLA.items()}
AVOGADRO = Fraction(6022) * Fraction(10) ** 20
NOMI = {'H': 'idrogeno', 'C': 'carbonio', 'N': 'azoto', 'O': 'ossigeno'}


def atomi(smiles):
	"""Conteggio per elemento visitando il grafo: ogni atomo pesante più i suoi idrogeni."""
	mol = Chem.MolFromSmiles(smiles)
	cnt = {}
	for i in range(mol.GetNumAtoms()):
		at = mol.GetAtomWithIdx(i)
		sym = at.GetSymbol()
		cnt[sym] = cnt.get(sym, 0) + 1
		h = at.GetNumExplicitHs() + at.GetNumImplicitHs()
		if h:
			cnt['H'] = cnt.get('H', 0) + h
	return cnt


def massa_molare(cnt):
	return sum((A[el] * k for el, k in cnt.items()), Fraction(0))


def leggi_formula(tex):
	"""'$\\mathrm{C_{2}H_{6}O}$' → {'C': 2, 'H': 6, 'O': 1}; None se non è una formula."""
	m = re.fullmatch(r'\$\\mathrm\{(.*)\}\$', tex)
	if not m:
		return None
	body = m.group(1).replace('{', '').replace('}', '')
	pieces = re.findall(r'([A-Z][a-z]?)(?:_(\d+))?', body)
	if ''.join(e + ('_' + n if n else '') for e, n in pieces) != body:
		return None
	out = {}
	for e, n in pieces:
		out[e] = out.get(e, 0) + int(n or 1)
	return out, [e for e, _ in pieces]


def leggi_numero(tex):
	"""'$1{,}20 \\cdot 10^{24}\\ \\mathrm{mol}$' → (Fraction, cifre dopo la virgola, cifre significative)."""
	t = tex.strip('$')
	m = re.match(r'^(\d+)(?:\{,\}(\d+))?(?: \\cdot 10\^\{(-?\d+)\})?', t)
	if not m:
		return None
	intero, dec, esp = m.group(1), m.group(2) or '', int(m.group(3) or 0)
	x = Fraction(int(intero + dec), 10 ** len(dec)) * Fraction(10) ** esp
	cifre = (intero + dec).lstrip('0')
	return x, len(dec), len(cifre)


def esponente(x):
	"""La potenza di 10 della prima cifra significativa di x > 0."""
	e = 0
	while x >= 10:
		x, e = x / 10, e + 1
	while x < 1:
		x, e = x * 10, e - 1
	return e


def hill(cnt):
	if 'C' in cnt:
		return ['C'] + (['H'] if 'H' in cnt else []) + sorted(e for e in cnt if e not in 'CH')
	return sorted(cnt)


def vicino(x, esatto, mezzo):
	return abs(x - esatto) <= mezzo


def controlla_numero(opts, correct, esatto, modo, errs, unita=''):
	"""La giusta è l'arrotondamento di `esatto`; i distrattori valgono altro."""
	letti = []
	for o in opts:
		r = leggi_numero(o['latex'])
		if r is None:
			errs.append(f'opzione illeggibile: {o["latex"]}')
			return
		if unita and unita not in o['latex']:
			errs.append(f'manca l\'unità {unita}: {o["latex"]}')
		letti.append(r)
	x, dec, sig = letti[correct]
	if modo == 'decimali2':
		ok_cifre, mezzo = dec == 2, Fraction(1, 200)
	elif modo == 'decimali1':
		ok_cifre, mezzo = dec == 1, Fraction(1, 20)
	else:
		ok_cifre = sig == 3
		mezzo = Fraction(5) * Fraction(10) ** (esponente(x) - 3)  # metà dell'ultima delle tre cifre
	if not ok_cifre:
		errs.append(f'cifre sbagliate nella risposta {opts[correct]["latex"]}')
	if not vicino(x, esatto, mezzo):
		errs.append(f'risposta {opts[correct]["latex"]}, il valore esatto è {float(esatto):.6g}')
	for i, (y, _, _) in enumerate(letti):
		if i != correct and (y == x or vicino(y, esatto, mezzo)):
			errs.append(f'il distrattore {opts[i]["latex"]} vale quanto la risposta')
	if len({l[0] for l in letti}) != len(letti):
		errs.append('opzioni con lo stesso valore')


def check(sample, opsin=None):
	p = sample['params']
	errs = []
	level = sample['level']
	opts, correct = sample['options'], sample['correct']
	cnt = atomi(p['smiles'])
	M = massa_molare(cnt)
	if len(opts) != 4 or not 0 <= correct < 4:
		errs.append('servono 4 opzioni e un indice valido')
		return errs, level
	if Fraction(p['M']) != M:
		errs.append(f'massa molare nei parametri {p["M"]}, ricalcolata {float(M):.2f}')
	testo = ' '.join([sample['prompt'], sample.get('problem') or ''])

	if level == 1:
		letti = [leggi_formula(o['latex']) for o in opts]
		if any(l is None for l in letti):
			return errs + ['formula illeggibile'], 'formula'
		giusta, ordine = letti[correct]
		if giusta != cnt:
			errs.append(f'formula giusta {opts[correct]["latex"]}, dal grafo {cnt}')
		if ordine != hill(cnt):
			errs.append('ordine degli elementi diverso da C, H, alfabetico')
		for i, (f, _) in enumerate(letti):
			if i != correct and f == cnt:
				errs.append(f'il distrattore {opts[i]["latex"]} è la formula giusta')
		if len({tuple(sorted(f.items())) for f, _ in letti}) != 4:
			errs.append('formule ripetute')
		if not any(a.GetAtomicNum() == 6 and a.GetTotalNumHs() for a in Chem.MolFromSmiles(p['smiles']).GetAtoms()):
			errs.append('nessun idrogeno nascosto sul carbonio')
		return errs, 'formula'

	if level == 2:
		controlla_numero(opts, correct, M, 'decimali2', errs, 'g/mol')
		return errs, 'massa molare'

	if level in (3, 4):
		m = Fraction(p['m'])
		mt = p['m'].replace('.', '{,}')
		if f'${mt}\\ \\mathrm{{g}}$' not in testo:
			errs.append(f'la massa {mt} g non è nel testo')
		if p['nome'] not in testo:
			errs.append('il nome della sostanza non è nel testo')
		n = m / M
		if level == 3:
			controlla_numero(opts, correct, n, 'sig3', errs, 'mol')
			return errs, 'moli'
		tipo = p['tipo']
		if tipo == 'molecole':
			k, parola = 1, 'molecole'
		elif tipo == 'atomi':
			k, parola = cnt[p['elemento']], f'atomi di {NOMI[p["elemento"]]}'
		else:
			k, parola = sum(cnt.values()), 'atomi in tutto'
		if parola not in testo:
			errs.append(f'il testo non chiede "{parola}"')
		controlla_numero(opts, correct, n * AVOGADRO * k, 'sig3', errs)
		return errs, tipo

	el = p['elemento']
	if f'di {NOMI[el]}' not in testo or p['nome'] not in testo:
		errs.append("il testo non nomina l'elemento o la sostanza")
	if cnt.get(el, 0) < 2:
		errs.append(f"{el} compare {cnt.get(el, 0)} volte")
	controlla_numero(opts, correct, cnt[el] * A[el] / M * 100, 'decimali1', errs, r'\%')
	return errs, el
