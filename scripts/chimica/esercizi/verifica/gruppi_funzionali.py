"""
Controllo indipendente di gruppi-funzionali: non importa niente dal generatore e non usa SMARTS.

I gruppi si riconoscono con le regole della lezione applicate al grafo della molecola (vicini di
ogni atomo, ordine dei legami, idrogeni), come farebbe uno studente:

- un O con un doppio legame a un C è un carbonile; cosa c'è attaccato a quel C decide la classe
  (un O con H: acido; un O legato a un altro C: estere; un N: ammide; solo C e H: aldeide se il C
  ha un H, chetone se ha due C);
- un O con due legami semplici: con un H è un alcol (C con soli legami semplici) o un fenolo (C
  dell'anello aromatico), purché quel C non sia un carbonile; con due C, nessuno dei quali è un
  carbonile, è un etere;
- un N non aromatico, neutro, legato solo a C: ammide se uno dei C è un carbonile, se no ammina;
- un alogeno legato a un C con soli legami semplici: alogenuro alchilico.

Poi si controlla che:
- il nome inglese di ogni molecola, letto da OPSIN, dia la molecola disegnata;
- i gruppi trovati dal generatore siano quelli trovati qui;
- gli atomi cerchiati appartengano al gruppo della risposta e a nessun gruppo dei distrattori;
- nelle domande "struttura" la molecola giusta contenga la classe e le altre no;
- nelle domande "quanti" e "quali" la risposta sia il numero o l'insieme dei tipi trovati qui.
"""
from rdkit import Chem

HALOGENS = {9, 17, 35, 53}
# Le coppie della lezione: al livello 3 almeno un distrattore deve essere il gemello della risposta.
PAIRS = {frozenset(p) for p in [('aldeide', 'chetone'), ('acido', 'estere'), ('estere', 'etere'),
	('ammide', 'ammina'), ('alcol', 'fenolo')]}


def carbonyl_oxygen(c):
	"""L'O legato con doppio legame al carbonio c (con nessun altro vicino), o None."""
	if c.GetAtomicNum() != 6:
		return None
	for b in c.GetBonds():
		o = b.GetOtherAtom(c)
		if o.GetAtomicNum() == 8 and b.GetBondType() == Chem.BondType.DOUBLE and o.GetDegree() == 1:
			return o
	return None


def only_single(atom):
	return all(b.GetBondType() == Chem.BondType.SINGLE for b in atom.GetBonds())


def instances(smiles):
	"""[(classe, insieme di indici)] per ogni gruppo della molecola."""
	mol = Chem.MolFromSmiles(smiles)
	out = []
	for atom in mol.GetAtoms():
		z = atom.GetAtomicNum()
		i = atom.GetIdx()
		nbs = list(atom.GetNeighbors())
		if z in HALOGENS and len(nbs) == 1 and nbs[0].GetAtomicNum() == 6 and only_single(nbs[0]) and not nbs[0].GetIsAromatic():
			out.append(('alogenuro', {i}))
		if z == 8 and not atom.GetIsAromatic() and only_single(atom):
			hs = atom.GetTotalNumHs()
			if hs == 1 and len(nbs) == 1 and nbs[0].GetAtomicNum() == 6 and carbonyl_oxygen(nbs[0]) is None:
				c = nbs[0]
				if c.GetIsAromatic():
					out.append(('fenolo', {i}))
				elif only_single(c):
					out.append(('alcol', {i}))
			if hs == 0 and len(nbs) == 2 and all(n.GetAtomicNum() == 6 for n in nbs) and all(carbonyl_oxygen(n) is None for n in nbs):
				out.append(('etere', {i}))
		if z == 7 and not atom.GetIsAromatic() and atom.GetFormalCharge() == 0 and only_single(atom) \
			and all(n.GetAtomicNum() == 6 for n in nbs):
			if not any(carbonyl_oxygen(n) is not None for n in nbs):
				out.append(('ammina', {i}))
		o = carbonyl_oxygen(atom)
		if o is not None and not atom.GetIsAromatic():
			others = [n for n in nbs if n.GetIdx() != o.GetIdx()]
			hetero = [n for n in others if n.GetAtomicNum() != 6]
			for n in hetero:
				if n.GetAtomicNum() == 8 and n.GetTotalNumHs() == 1:
					out.append(('acido', {i, o.GetIdx(), n.GetIdx()}))
				elif n.GetAtomicNum() == 8 and n.GetDegree() == 2:
					out.append(('estere', {i, o.GetIdx(), n.GetIdx()}))
				elif n.GetAtomicNum() == 7:
					out.append(('ammide', {i, o.GetIdx(), n.GetIdx()}))
			if not hetero:
				carbons = sum(1 for n in others if n.GetAtomicNum() == 6)
				if atom.GetTotalNumHs() >= 1:
					out.append(('aldeide', {i, o.GetIdx()}))
				elif carbons == 2:
					out.append(('chetone', {i, o.GetIdx()}))
	return out


def kinds(smiles):
	return {k for k, _ in instances(smiles)}


def check_name(entry_smiles, name_en, opsin, errs):
	got = opsin(name_en)
	if not got or Chem.CanonSmiles(got) != Chem.CanonSmiles(entry_smiles):
		errs.append(f'OPSIN legge {name_en} come {got}, non {entry_smiles}')


def check(sample, opsin):
	p = sample['params']
	errs = []
	opts = sample['options']
	right = opts[sample['correct']]
	values = [tuple(o['values']) for o in opts]
	if len(set(values)) != 4:
		errs.append('opzioni ripetute')
	tipo = p['tipo']

	if tipo == 'struttura':
		answer = p['risposta']
		mols = p['molecole']
		check_name(mols[0]['smiles'], mols[0]['nome_en'], opsin, errs)
		for m in mols[1:]:
			check_name(m['smiles'], m['nome_en'], opsin, errs)
		if right['values'][0] != Chem.CanonSmiles(mols[0]['smiles']):
			errs.append('l\'opzione giusta non è la molecola della soluzione')
		for i, o in enumerate(opts):
			has = answer in kinds(o['values'][0])
			if i == sample['correct'] and not has:
				errs.append(f'la molecola giusta non contiene {answer}')
			if i != sample['correct'] and has:
				errs.append(f'un distrattore contiene {answer}')
			if len(kinds(o['values'][0])) != 1:
				errs.append('una molecola semplice ha più tipi di gruppo')
		if sample['level'] == 3 and not any(frozenset((answer, d)) in PAIRS for d in p['distrattori']):
			errs.append('livello 3: manca il gemello')
		return errs, tipo

	smiles = p['smiles']
	check_name(smiles, p['nome_en'], opsin, errs)
	found = instances(smiles)
	mine = {k for k, _ in found}
	theirs = set(p['gruppi'])
	if mine != theirs:
		errs.append(f'gruppi diversi: qui {sorted(mine)}, generatore {sorted(theirs)}')
	for k, hits in p['gruppi'].items():
		if len(hits) != sum(1 for kk, _ in found if kk == k):
			errs.append(f'{k}: numero di occorrenze diverso')

	if tipo == 'nome':
		answer = right['values'][0]
		if answer != p['risposta']:
			errs.append('l\'opzione giusta non è la risposta')
		marked = set(p['segnati'])
		if not marked:
			errs.append('niente di cerchiato')
		own = [atoms for k, atoms in found if k == answer]
		if not own or not marked <= set().union(*own) or not any(atoms <= marked for atoms in own):
			errs.append(f'gli atomi cerchiati non sono un gruppo {answer}')
		for i, o in enumerate(opts):
			if i == sample['correct']:
				continue
			d = o['values'][0]
			if d == answer:
				errs.append('un distrattore è la risposta')
			if any(k == d and marked & atoms for k, atoms in found):
				errs.append(f'gli atomi cerchiati fanno parte anche di un gruppo {d}')
		if sample['level'] in (1, 3) and len(mine) != 1:
			errs.append('la molecola semplice ha più tipi di gruppo')
		if sample['level'] == 3 and not any(frozenset((answer, o['values'][0])) in PAIRS for o in opts):
			errs.append('livello 3: manca il gemello')
		if sample['level'] == 4:
			if len(mine) < 2:
				errs.append('livello 4: la molecola ha meno di due tipi di gruppo')
	elif tipo == 'quanti':
		if right['values'][0] != str(len(mine)):
			errs.append(f'i tipi di gruppo sono {len(mine)}, non {right["values"][0]}')
	elif tipo == 'quali':
		if set(right['values']) != mine:
			errs.append(f'i gruppi sono {sorted(mine)}, non {right["values"]}')
		for i, o in enumerate(opts):
			if i != sample['correct'] and set(o['values']) == mine:
				errs.append('un distrattore è l\'insieme giusto')
	else:
		errs.append(f'tipo sconosciuto {tipo}')
	return errs, tipo
