"""
Controllo indipendente di geometria-molecolare-vsepr: non importa niente dal generatore e non legge
le coppie solitarie, la geometria o la polarità che il generatore dichiara, se non per confrontarle.

Rifà i conti per due strade diverse da quella del generatore (che usa un elenco scritto a mano):

1. VSEPR dal grafo. Sulla molecola del SMILES, con gli H espliciti, conta per l'atomo centrale gli
   atomi legati e gli elettroni che mette nei legami (uno per ogni unità di ordine di legame), toglie
   la carica formale dagli elettroni di valenza (tavola periodica di RDKit) e ricava le coppie
   solitarie: (valenza - carica - elettroni nei legami) / 2. Numero sterico = legati + coppie; la
   geometria e l'angolo previsto vengono dalla tabella della lezione.
2. Geometria 3D. Coordinate da ETKDG (seme diverso da quello delle figure), ottimizzate con MMFF94
   o, se mancano i parametri, UFF; poi gli angoli intorno all'atomo centrale devono dare la stessa
   forma, con queste tolleranze:
   - lineare: 2 legati, angolo >= 175°;
   - piegata: 2 legati, angolo <= 170°;
   - triangolare planare: 3 legati, somma dei tre angoli >= 357° (atomi nello stesso piano);
   - piramidale triangolare: 3 legati, somma dei tre angoli <= 350°;
   - tetraedrica: 4 legati, tutti e sei gli angoli tra 104° e 115°.
   Per le domande sull'angolo: l'angolo misurato deve stare entro 2,0° dal valore della risposta
   giusta, e la risposta giusta deve essere l'opzione più vicina al valore misurato.
3. Polarità. Momento di dipolo stimato con le cariche parziali di Gasteiger sulle coordinate 3D
   (somma di carica per posizione, in e·Å): polare sopra 0,05, apolare sotto 0,01, in mezzo non si
   decide e l'esercizio non passa. Polarità dei legami con le elettronegatività di Pauling scritte
   qui: polare se la differenza è almeno 0,4 (la soglia della lezione).
"""
from itertools import combinations

from rdkit import Chem, RDLogger
from rdkit.Chem import AllChem, rdMolTransforms

RDLogger.DisableLog('rdApp.*')

# (numero sterico, coppie solitarie) → (geometria della molecola, angolo previsto)
VSEPR = {
	(2, 0): ('lineare', 180),
	(3, 0): ('triangolare planare', 120),
	(3, 1): ('piegata', None),
	(4, 0): ('tetraedrica', 109.5),
	(4, 1): ('piramidale triangolare', 107),
	(4, 2): ('piegata', 104.5),
}
PAULING = {'H': 2.20, 'B': 2.04, 'C': 2.55, 'Si': 1.90, 'N': 3.04, 'P': 2.19, 'O': 3.44, 'S': 2.58, 'F': 3.98, 'Cl': 3.16}
DIPOLO_POLARE, DIPOLO_APOLARE = 0.05, 0.01
SOGLIA_EN = 0.4

_cache: dict[str, Chem.Mol] = {}


def vsepr_from_graph(smiles, center):
	mol = Chem.AddHs(Chem.MolFromSmiles(smiles))
	a = mol.GetAtomWithIdx(center)
	valence = Chem.GetPeriodicTable().GetNOuterElecs(a.GetAtomicNum())
	in_bonds = sum(b.GetBondTypeAsDouble() for b in a.GetBonds())
	free = valence - a.GetFormalCharge() - in_bonds
	if free < 0 or free % 2:
		return None
	lp = int(free // 2)
	multiple = any(b.GetBondTypeAsDouble() > 1 for b in a.GetBonds())
	return {'legati': a.GetDegree(), 'coppie': lp, 'sterico': a.GetDegree() + lp, 'multiplo': multiple,
		'carica': Chem.GetFormalCharge(mol)}


def embed(smiles):
	if smiles in _cache:
		return _cache[smiles]
	mol = Chem.AddHs(Chem.MolFromSmiles(smiles))
	ps = AllChem.ETKDGv3()
	ps.randomSeed = 2027
	if AllChem.EmbedMolecule(mol, ps) != 0:
		raise ValueError(f'nessuna geometria 3D per {smiles}')
	if AllChem.MMFFHasAllMoleculeParams(mol):
		AllChem.MMFFOptimizeMolecule(mol, maxIters=5000)
	elif AllChem.UFFHasAllMoleculeParams(mol):
		AllChem.UFFOptimizeMolecule(mol, maxIters=5000)
	else:
		raise ValueError(f'nessun campo di forza per {smiles}')
	_cache[smiles] = mol
	return mol


def angles_at(mol, center):
	conf = mol.GetConformer()
	nb = [n.GetIdx() for n in mol.GetAtomWithIdx(center).GetNeighbors()]
	return nb, [rdMolTransforms.GetAngleDeg(conf, i, center, k) for i, k in combinations(nb, 2)]


def shape_3d(mol, center):
	"""La forma che si legge dalle coordinate, o None se non corrisponde a nessuna con le tolleranze."""
	nb, angs = angles_at(mol, center)
	if len(nb) == 2:
		return 'lineare' if angs[0] >= 175 else 'piegata' if angs[0] <= 170 else None
	if len(nb) == 3:
		s = sum(angs)
		return 'triangolare planare' if s >= 357 else 'piramidale triangolare' if s <= 350 else None
	if len(nb) == 4:
		return 'tetraedrica' if all(104 <= x <= 115 for x in angs) else None
	return None


def dipole(mol):
	AllChem.ComputeGasteigerCharges(mol)
	pos = mol.GetConformer().GetPositions()
	v = [0.0, 0.0, 0.0]
	for a in mol.GetAtoms():
		q = a.GetDoubleProp('_GasteigerCharge')
		for d in range(3):
			v[d] += q * pos[a.GetIdx()][d]
	return sum(x * x for x in v) ** 0.5


def polar_bonds(mol):
	return any(abs(PAULING[b.GetBeginAtom().GetSymbol()] - PAULING[b.GetEndAtom().GetSymbol()]) >= SOGLIA_EN for b in mol.GetBonds())


def option_is_right(key, polar_mol, has_polar_bonds):
	"""Se l'affermazione (polarità, motivo) è vera per la molecola."""
	label, why = key
	if why == 'non-compensati':
		return label == 'polare' and polar_mol and has_polar_bonds
	if why == 'compensati':
		return label == 'apolare' and not polar_mol and has_polar_bonds
	if why == 'apolari':
		return label == 'apolare' and not polar_mol and not has_polar_bonds
	return False  # "ha legami polari, e questo basta": il ragionamento è sbagliato sempre


def check(sample, opsin=None):
	p = sample['params']
	errs = []
	opts = sample['options']
	right = opts[sample['correct']]
	level = sample['level']
	if len(opts) != 4:
		errs.append('servono 4 opzioni')
	if len({tuple(o['values']) for o in opts}) != len(opts):
		errs.append('opzioni ripetute')

	v = vsepr_from_graph(p['smiles'], p['centro'])
	if v is None:
		return ['elettroni dispari o negativi sull\'atomo centrale'], p.get('tipo')
	if v['coppie'] != p['coppie']:
		errs.append(f'coppie solitarie: il grafo ne dà {v["coppie"]}, il generatore {p["coppie"]}')
	if (v['sterico'], v['coppie']) not in VSEPR:
		return errs + [f'numero sterico {v["sterico"]} fuori dalla lezione'], p.get('tipo')
	geo, angle = VSEPR[(v['sterico'], v['coppie'])]

	mol = embed(p['smiles'])
	shape = shape_3d(mol, p['centro'])
	if shape != geo:
		errs.append(f'la geometria 3D ({shape}) non conferma quella del grafo ({geo})')
	if p['geometria'] != geo:
		errs.append(f'geometria dichiarata {p["geometria"]}, dal grafo {geo}')

	if level == 1 and (v['coppie'] or v['multiplo']):
		errs.append('livello 1 con coppie solitarie o legami multipli')
	if level == 2 and (not v['coppie'] or v['multiplo']):
		errs.append('livello 2 senza coppie solitarie o con legami multipli')
	if level == 3 and not v['multiplo']:
		errs.append('livello 3 senza legami multipli sull\'atomo centrale')

	tipo = p['tipo']
	if tipo == 'geometria':
		if right['values'] != [geo]:
			errs.append(f'risposta giusta {right["values"]}, attesa {geo}')
		for i, o in enumerate(opts):
			if i != sample['correct'] and o['values'] == [geo]:
				errs.append('un distrattore è la risposta giusta')
		return errs, f'{tipo}:{geo}'

	if tipo == 'angolo':
		i, j, k = p['angolo']
		if j != p['centro'] or not all(mol.GetBondBetweenAtoms(j, x) for x in (i, k)):
			errs.append('l\'angolo chiesto non è intorno all\'atomo centrale')
		_, angs = angles_at(mol, p['centro'])
		if max(angs) - min(angs) > 2.0:
			errs.append('gli angoli intorno all\'atomo centrale non sono tutti uguali')
		measured = rdMolTransforms.GetAngleDeg(mol.GetConformer(), i, j, k)
		values = [float(o['values'][0]) for o in opts]
		chosen = values[sample['correct']]
		if angle is None or chosen != angle:
			errs.append(f'risposta giusta {chosen}°, la tabella VSEPR dà {angle}')
		if abs(measured - chosen) > 2.0:
			errs.append(f'angolo misurato {measured:.1f}°, risposta {chosen}°: fuori tolleranza')
		nearest = min(values, key=lambda x: abs(x - measured))
		if nearest != chosen:
			errs.append(f'l\'opzione più vicina al valore misurato ({measured:.1f}°) è {nearest}°, non {chosen}°')
		return errs, f'{tipo}:{chosen}'

	# polarità
	if v['carica']:
		errs.append('domanda di polarità su uno ione')
	mu = dipole(mol)
	if DIPOLO_APOLARE < mu < DIPOLO_POLARE:
		errs.append(f'dipolo {mu:.3f} e·Å: polarità non decidibile')
	polar_mol = mu >= DIPOLO_POLARE
	pb = polar_bonds(mol)
	right_ones = [i for i, o in enumerate(opts) if option_is_right(tuple(o['values']), polar_mol, pb)]
	if right_ones != [sample['correct']]:
		errs.append(f'opzioni vere {right_ones}, risposta giusta {sample["correct"]} (dipolo {mu:.3f}, legami polari {pb})')
	return errs, f'{tipo}:{"polare" if polar_mol else "apolare"}'
