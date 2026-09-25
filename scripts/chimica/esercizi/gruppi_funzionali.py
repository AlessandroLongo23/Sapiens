"""
I gruppi funzionali. Lezione: docs/lezioni/chimica/riscritte/05-gruppi-funzionali.md

Due raccolte di molecole curate a mano (SMILES, nome italiano, nome inglese che OPSIN rilegge nel
controllo): molecole semplici con un solo tipo di gruppo, e molecole vere (farmaci, aromi,
amminoacidi) con più gruppi. I gruppi di ogni molecola non sono scritti a mano: li trova RDKit con i
SMARTS di `GROUPS`, gli stessi della lezione.

Nelle domande il gruppo da riconoscere è cerchiato con un contorno grigio, uguale per tutti i gruppi:
se avesse il colore della lezione, il colore direbbe già la risposta. Il disegno della soluzione ha
invece i gruppi colorati come nella lezione.

Livelli, ognuno con una difficoltà in più:
1. una molecola semplice con un solo tipo di gruppo, cerchiato: a quale classe appartiene;
2. il nome di una classe e quattro molecole semplici disegnate, senza niente cerchiato: quale la contiene;
3. le coppie che si confondono (aldeide e chetone, acido ed estere, estere ed etere, ammide e
   ammina, alcol e fenolo): i distrattori sono sempre i gruppi "gemelli";
4. una molecola vera con più gruppi, uno cerchiato: i distrattori sono anche gli altri gruppi
   presenti nella stessa molecola;
5. una molecola vera: quanti gruppi diversi contiene, oppure quali.
"""

from __future__ import annotations

import re

from rdkit import Chem
from rdkit.Chem.Draw import rdMolDraw2D

from comune import Rng, canon, choice, mol_svg, sample
from figure import PLACEHOLDER, options as draw_options, rgb, themable

ID = 'gruppi-funzionali'
TITLE = 'I gruppi funzionali'
LEVELS = {
	1: ('Un gruppo solo', ['molecola semplice con un solo tipo di gruppo, cerchiato', 'distrattori non gemelli']),
	2: ('Trova il gruppo', ['il nome della classe e quattro molecole semplici', 'una sola contiene il gruppo']),
	3: ('I gruppi che si confondono', ['distrattori: i gruppi gemelli della risposta']),
	4: ('Molecole vere', ['molecola vera con almeno due tipi di gruppo, uno cerchiato', 'distrattori presenti nella molecola']),
	5: ('Tutti i gruppi', ['molecola vera senza doppi legami C=C fuori dall\'anello', 'quanti o quali gruppi diversi']),
}

# chiave: (nome, SMARTS, colore della lezione). I SMARTS non usano ';' perché nei blocchi figura il
# ';' separa le evidenziazioni: l'AND si scrive '&'. Dove il gruppo è un atomo solo, l'ambiente si
# chiede con un SMARTS ricorsivo $(...), così si colora solo quell'atomo.
GROUPS = {
	'alogenuro': ('alogenuro alchilico', '[$([F,Cl,Br,I][CX4])]', None),
	'alcol': ('alcol', '[OX2H1&$(O[CX4])]', 'blu'),
	'fenolo': ('fenolo', '[OX2H1&$(Oc)]', 'blu'),
	'etere': ('etere', '[OX2&$(O([#6])[#6])&!$(O[#6]=[O,S,N])]', 'grigio'),
	'aldeide': ('aldeide', '[$([CX3H1][#6]),$([CX3H2])]=[OX1]', 'rosso'),
	'chetone': ('chetone', '[CX3&$(C([#6])[#6])]=[OX1]', 'rosso'),
	'acido': ('acido carbossilico', '[$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H1]', 'arancione'),
	'estere': ('estere', '[$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H0&$(O([#6])[#6])]', 'verde'),
	'ammina': ('ammina', '[NX3&+0&!$(N~[!#6&!#1])&!$(N[#6]=[O,S,N])]', 'viola'),
	'ammide': ('ammide', '[CX3](=[OX1])[NX3]', 'giallo'),
}
PATTERNS = {k: Chem.MolFromSmarts(v[1]) for k, v in GROUPS.items()}
ALKENE = Chem.MolFromSmarts('[CX3]=[CX3]')

# I gruppi che gli studenti scambiano: per ogni classe, i distrattori del livello 3 in ordine.
TWINS = {
	'alcol': ['fenolo', 'etere', 'acido'],
	'fenolo': ['alcol', 'etere', 'acido'],
	'etere': ['estere', 'alcol', 'chetone'],
	'aldeide': ['chetone', 'acido', 'estere'],
	'chetone': ['aldeide', 'estere', 'etere'],
	'acido': ['estere', 'alcol', 'aldeide'],
	'estere': ['acido', 'etere', 'chetone'],
	'ammina': ['ammide', 'etere', 'alcol'],
	'ammide': ['ammina', 'chetone', 'estere'],
}

# Perché il gruppo è quello: la regola della lezione, una frase.
RULE = {
	'alogenuro': 'Un alogeno (F, Cl, Br o I) è legato a un carbonio con soli legami semplici: è un alogenuro alchilico.',
	'alcol': 'L\'ossidrile $\\mathrm{-OH}$ è legato a un carbonio con soli legami semplici: è un alcol.',
	'fenolo': 'L\'ossidrile $\\mathrm{-OH}$ è legato direttamente a un carbonio dell\'anello benzenico: è un fenolo.',
	'etere': 'L\'ossigeno è legato a due carboni e nessuno dei due ha un doppio legame con un ossigeno: è un etere.',
	'aldeide': 'Il carbonio del carbonile $\\mathrm{C{=}O}$ è legato ad almeno un idrogeno: è un\'aldeide.',
	'chetone': 'Il carbonio del carbonile $\\mathrm{C{=}O}$ è legato a due carboni: è un chetone.',
	'acido': 'Il carbonio del $\\mathrm{C{=}O}$ porta anche un $\\mathrm{-OH}$: è il carbossile $\\mathrm{-COOH}$ di un acido carbossilico.',
	'estere': 'Il carbonio del $\\mathrm{C{=}O}$ è legato a un ossigeno che a sua volta è legato a un carbonio: è un estere.',
	'ammina': 'L\'azoto è legato solo a carboni e idrogeni, e nessuno di quei carboni ha un $\\mathrm{C{=}O}$: è un\'ammina.',
	'ammide': 'L\'azoto è legato al carbonio di un $\\mathrm{C{=}O}$: è un\'ammide.',
}

# Perché non è il gemello: (risposta, distrattore) → frase.
NOT_TWIN = {
	('alcol', 'fenolo'): 'Non è un fenolo: il carbonio che porta l\'$\\mathrm{-OH}$ non fa parte dell\'anello.',
	('fenolo', 'alcol'): 'Non è un alcol: l\'$\\mathrm{-OH}$ è attaccato all\'anello, e questo cambia le proprietà (un fenolo è più acido).',
	('etere', 'estere'): 'Non è un estere: accanto all\'ossigeno non c\'è nessun $\\mathrm{C{=}O}$.',
	('estere', 'etere'): 'Non è un etere: uno dei due carboni legati all\'ossigeno ha anche un $\\mathrm{C{=}O}$.',
	('aldeide', 'chetone'): 'Non è un chetone: il carbonio del $\\mathrm{C{=}O}$ ha un idrogeno, quindi sta in fondo alla catena.',
	('chetone', 'aldeide'): 'Non è un\'aldeide: il carbonio del $\\mathrm{C{=}O}$ non ha idrogeni, sta in mezzo a due carboni.',
	('acido', 'estere'): 'Non è un estere: dopo il $\\mathrm{C{=}O}$ l\'ossigeno porta un idrogeno, non un carbonio.',
	('estere', 'acido'): 'Non è un acido: dopo il $\\mathrm{C{=}O}$ l\'ossigeno porta un carbonio, non un idrogeno.',
	('ammina', 'ammide'): 'Non è un\'ammide: nessun carbonio legato all\'azoto ha un $\\mathrm{C{=}O}$.',
	('ammide', 'ammina'): 'Non è un\'ammina: l\'azoto è legato al carbonio di un $\\mathrm{C{=}O}$.',
	('acido', 'alcol'): 'Non è un alcol: l\'$\\mathrm{-OH}$ sta su un carbonio che ha anche un $\\mathrm{C{=}O}$, e insieme formano il carbossile.',
}

# Molecole semplici: (SMILES, nome IUPAC italiano, nome tradizionale o '', nome inglese per OPSIN).
SIMPLE = [
	('CCl', 'clorometano', 'cloruro di metile', 'chloromethane'),
	('ClCCl', 'diclorometano', 'cloruro di metilene', 'dichloromethane'),
	('ClC(Cl)Cl', 'triclorometano', 'cloroformio', 'trichloromethane'),
	('CCBr', 'bromoetano', '', 'bromoethane'),
	('CC(C)Br', '2-bromopropano', '', '2-bromopropane'),
	('CCCCCl', '1-clorobutano', '', '1-chlorobutane'),
	('CI', 'iodometano', '', 'iodomethane'),
	('ClC1CCCCC1', 'clorocicloesano', '', 'chlorocyclohexane'),
	('CO', 'metanolo', 'alcol metilico', 'methanol'),
	('CCO', 'etanolo', 'alcol etilico', 'ethanol'),
	('CCCO', 'propan-1-olo', '', 'propan-1-ol'),
	('CC(C)O', 'propan-2-olo', 'alcol isopropilico', 'propan-2-ol'),
	('CCCCO', 'butan-1-olo', '', 'butan-1-ol'),
	('OC1CCCCC1', 'cicloesanolo', '', 'cyclohexanol'),
	('CC(C)(C)O', '2-metilpropan-2-olo', '', '2-methylpropan-2-ol'),
	('OCc1ccccc1', 'fenilmetanolo', 'alcol benzilico', 'phenylmethanol'),
	('OCCO', 'etan-1,2-diolo', 'glicole etilenico', 'ethane-1,2-diol'),
	('Oc1ccccc1', 'fenolo', '', 'phenol'),
	('Cc1ccccc1O', '2-metilfenolo', '', '2-methylphenol'),
	('Cc1ccc(O)cc1', '4-metilfenolo', '', '4-methylphenol'),
	('Oc1ccc(O)cc1', 'benzene-1,4-diolo', 'idrochinone', 'benzene-1,4-diol'),
	('CCc1ccc(O)cc1', '4-etilfenolo', '', '4-ethylphenol'),
	('COC', 'metossimetano', 'dimetiletere', 'methoxymethane'),
	('CCOCC', 'etossietano', 'dietiletere', 'ethoxyethane'),
	('CCOC', 'metossietano', '', 'methoxyethane'),
	('COc1ccccc1', 'metossibenzene', 'anisolo', 'methoxybenzene'),
	('COC(C)(C)C', '2-metossi-2-metilpropano', '', '2-methoxy-2-methylpropane'),
	('CCCOCCC', '1-propossipropano', '', '1-propoxypropane'),
	('C=O', 'metanale', 'formaldeide', 'methanal'),
	('CC=O', 'etanale', 'acetaldeide', 'ethanal'),
	('CCC=O', 'propanale', '', 'propanal'),
	('CCCC=O', 'butanale', '', 'butanal'),
	('O=Cc1ccccc1', 'benzaldeide', '', 'benzaldehyde'),
	('CC(C)C=O', '2-metilpropanale', '', '2-methylpropanal'),
	('CC(C)=O', 'propanone', 'acetone', 'propanone'),
	('CCC(C)=O', 'butan-2-one', '', 'butan-2-one'),
	('CCC(=O)CC', 'pentan-3-one', '', 'pentan-3-one'),
	('CCCC(C)=O', 'pentan-2-one', '', 'pentan-2-one'),
	('O=C1CCCCC1', 'cicloesanone', '', 'cyclohexanone'),
	('CC(=O)c1ccccc1', '1-feniletanone', 'acetofenone', '1-phenylethanone'),
	('OC=O', 'acido metanoico', 'acido formico', 'methanoic acid'),
	('CC(=O)O', 'acido etanoico', 'acido acetico', 'ethanoic acid'),
	('CCC(=O)O', 'acido propanoico', '', 'propanoic acid'),
	('CCCC(=O)O', 'acido butanoico', 'acido butirrico', 'butanoic acid'),
	('OC(=O)c1ccccc1', 'acido benzoico', '', 'benzoic acid'),
	('CC(C)C(=O)O', 'acido 2-metilpropanoico', '', '2-methylpropanoic acid'),
	('COC=O', 'metanoato di metile', '', 'methyl methanoate'),
	('COC(C)=O', 'etanoato di metile', 'acetato di metile', 'methyl ethanoate'),
	('CCOC(C)=O', 'etanoato di etile', 'acetato di etile', 'ethyl ethanoate'),
	('CCCC(=O)OCC', 'butanoato di etile', '', 'ethyl butanoate'),
	('COC(=O)c1ccccc1', 'benzoato di metile', '', 'methyl benzoate'),
	('CCC(=O)OC', 'propanoato di metile', '', 'methyl propanoate'),
	('CN', 'metanammina', 'metilammina', 'methanamine'),
	('CCN', 'etanammina', 'etilammina', 'ethanamine'),
	('CNC', 'N-metilmetanammina', 'dimetilammina', 'N-methylmethanamine'),
	('CN(C)C', 'N,N-dimetilmetanammina', 'trimetilammina', 'N,N-dimethylmethanamine'),
	('Nc1ccccc1', 'benzenammina', 'anilina', 'benzenamine'),
	('CCCN', 'propan-1-ammina', '', 'propan-1-amine'),
	('NC1CCCCC1', 'cicloesanammina', '', 'cyclohexanamine'),
	('NC=O', 'metanammide', 'formammide', 'methanamide'),
	('CC(N)=O', 'etanammide', 'acetammide', 'ethanamide'),
	('CCC(N)=O', 'propanammide', '', 'propanamide'),
	('CNC(C)=O', 'N-metiletanammide', '', 'N-methylethanamide'),
	('NC(=O)c1ccccc1', 'benzammide', '', 'benzamide'),
	('CN(C)C=O', 'N,N-dimetilmetanammide', 'dimetilformammide', 'N,N-dimethylmethanamide'),
]

# Molecole vere: (SMILES, nome con cui la conosci, nome IUPAC inglese per OPSIN, dove si trova).
REAL = [
	('CC(=O)Oc1ccccc1C(=O)O', 'acido acetilsalicilico', '2-acetyloxybenzoic acid', 'il principio attivo dell\'aspirina'),
	('CC(=O)Nc1ccc(O)cc1', 'paracetamolo', 'N-(4-hydroxyphenyl)acetamide', 'un antidolorifico e antifebbrile'),
	('COc1cc(C=O)ccc1O', 'vanillina', '4-hydroxy-3-methoxybenzaldehyde', 'che dà l\'aroma alla vaniglia'),
	('COc1cc(CNC(=O)CCCC/C=C/C(C)C)ccc1O', 'capsaicina', '(6E)-N-[(4-hydroxy-3-methoxyphenyl)methyl]-8-methylnon-6-enamide', 'la molecola piccante del peperoncino'),
	('CNC[C@H](O)c1ccc(O)c(O)c1', 'adrenalina', '4-[(1R)-1-hydroxy-2-(methylamino)ethyl]benzene-1,2-diol', 'un ormone che il corpo libera nei momenti di pericolo'),
	('NCCc1ccc(O)c(O)c1', 'dopamina', '4-(2-aminoethyl)benzene-1,2-diol', 'un messaggero chimico del cervello'),
	('OC(=O)c1ccccc1O', 'acido salicilico', '2-hydroxybenzoic acid', 'usato nelle creme contro i brufoli'),
	('COC(=O)c1ccccc1O', 'salicilato di metile', 'methyl 2-hydroxybenzoate', 'che dà l\'odore alle pomate per i dolori muscolari'),
	('CCOC(=O)c1ccc(N)cc1', 'benzocaina', 'ethyl 4-aminobenzoate', 'un anestetico locale degli spray per il mal di gola'),
	('CCN(CC)CCOC(=O)c1ccc(N)cc1', 'procaina', '2-(diethylamino)ethyl 4-aminobenzoate', 'un anestetico locale usato dai dentisti'),
	('CCN(CC)CC(=O)Nc1c(C)cccc1C', 'lidocaina', '2-(diethylamino)-N-(2,6-dimethylphenyl)acetamide', 'uno degli anestetici locali più usati'),
	('CC(O)C(=O)O', 'acido lattico', '2-hydroxypropanoic acid', 'che si forma nello yogurt e nei muscoli sotto sforzo'),
	('OC(=O)CC(O)(CC(=O)O)C(=O)O', 'acido citrico', '2-hydroxypropane-1,2,3-tricarboxylic acid', 'l\'acido del succo di limone'),
	('O=C[C@H](O)[C@@H](O)[C@H](O)[C@H](O)CO', 'glucosio (forma aperta)', '(2R,3S,4R,5R)-2,3,4,5,6-pentahydroxyhexanal', 'lo zucchero che circola nel sangue'),
	('OCC(=O)[C@@H](O)[C@H](O)[C@H](O)CO', 'fruttosio (forma aperta)', '(3S,4R,5R)-1,3,4,5,6-pentahydroxyhexan-2-one', 'lo zucchero della frutta e del miele'),
	('CC(=O)C(=O)O', 'acido piruvico', '2-oxopropanoic acid', 'che le cellule ricavano dal glucosio'),
	('CCOC(=O)C(C)O', 'lattato di etile', 'ethyl 2-hydroxypropanoate', 'usato come solvente e come aroma'),
	('COc1cc(CCC(C)=O)ccc1O', 'zingerone', '4-(4-hydroxy-3-methoxyphenyl)butan-2-one', 'che dà l\'aroma allo zenzero cotto'),
	('CC(=O)CCc1ccc(O)cc1', 'chetone del lampone', '4-(4-hydroxyphenyl)butan-2-one', 'che dà l\'aroma ai lamponi'),
	('COc1ccccc1O', 'guaiacolo', '2-methoxyphenol', 'che dà l\'odore di fumo ai cibi affumicati'),
	('C[C@H](N)C(=O)O', 'alanina', '(2S)-2-aminopropanoic acid', 'uno degli amminoacidi delle proteine'),
	('N[C@@H](CO)C(=O)O', 'serina', '(2S)-2-amino-3-hydroxypropanoic acid', 'uno degli amminoacidi delle proteine'),
	('N[C@@H](Cc1ccc(O)cc1)C(=O)O', 'tirosina', '(2S)-2-amino-3-(4-hydroxyphenyl)propanoic acid', 'uno degli amminoacidi delle proteine'),
	('COC(=O)c1ccccc1N', 'antranilato di metile', 'methyl 2-aminobenzoate', 'che dà l\'aroma all\'uva'),
	('COC(=O)c1ccc(O)cc1', 'metilparabene', 'methyl 4-hydroxybenzoate', 'un conservante dei cosmetici'),
	('CC(C)(C)NCC(O)c1ccc(O)c(CO)c1', 'salbutamolo', '4-[2-(tert-butylamino)-1-hydroxyethyl]-2-(hydroxymethyl)phenol', 'il farmaco degli spray per l\'asma'),
	('COC(=O)[C@H](Cc1ccccc1)NC(=O)[C@@H](N)CC(=O)O', 'aspartame', '(3S)-3-amino-4-[[(2S)-1-methoxy-1-oxo-3-phenylpropan-2-yl]amino]-4-oxobutanoic acid', 'il dolcificante delle bibite senza zucchero'),
	('C=CCc1ccc(O)c(OC)c1', 'eugenolo', '2-methoxy-4-(prop-2-en-1-yl)phenol', 'che dà l\'aroma ai chiodi di garofano'),
	('CCOc1ccc(NC(C)=O)cc1', 'fenacetina', 'N-(4-ethoxyphenyl)acetamide', 'un antidolorifico di una volta, oggi ritirato'),
	('CC(C)Cc1ccc(cc1)C(C)C(=O)O', 'ibuprofene', '2-[4-(2-methylpropyl)phenyl]propanoic acid', 'un antinfiammatorio'),
	('CC(=O)OCCC(C)C', 'acetato di isoamile', '3-methylbutyl acetate', 'che dà l\'aroma alla banana'),
	('CC(C)[C@@H]1CC[C@@H](C)C[C@H]1O', 'mentolo', '(1R,2S,5R)-5-methyl-2-(propan-2-yl)cyclohexan-1-ol', 'che dà il fresco alla menta'),
	('CCN(CC)C(=O)c1cccc(C)c1', 'DEET', 'N,N-diethyl-3-methylbenzamide', 'il principio attivo di molti repellenti per zanzare'),
	('O=C/C=C/c1ccccc1', 'cinnamaldeide', '(2E)-3-phenylprop-2-enal', 'che dà l\'aroma alla cannella'),
	('Cc1ccc(C(C)C)c(O)c1', 'timolo', '5-methyl-2-(propan-2-yl)phenol', 'che dà l\'aroma al timo'),
]

ORDER = list(GROUPS)


# ---------------------------------------------------------------------------
# Gruppi

def find_groups(smiles: str) -> dict[str, list[tuple[int, ...]]]:
	"""Classe → le occorrenze del gruppo (indici degli atomi), trovate con i SMARTS di GROUPS."""
	mol = Chem.MolFromSmiles(smiles)
	out = {}
	for key, patt in PATTERNS.items():
		hits = mol.GetSubstructMatches(patt)
		if hits:
			out[key] = [tuple(h) for h in hits]
	return out


def has_alkene(smiles: str) -> bool:
	return Chem.MolFromSmiles(smiles).HasSubstructMatch(ALKENE)


def label(key: str) -> str:
	return GROUPS[key][0]


def cap(s: str) -> str:
	return s[:1].upper() + s[1:]


def join(words: list[str]) -> str:
	return words[0] if len(words) == 1 else ', '.join(words[:-1]) + ' e ' + words[-1]


def class_list(keys) -> str:
	return join([label(k) for k in sorted(keys, key=ORDER.index)])


# ---------------------------------------------------------------------------
# Disegni

def marked_svg(smiles: str, atoms: list[int]) -> str:
	"""La molecola con alcuni atomi cerchiati da un contorno grigio, lo stesso per ogni gruppo.

	RDKit riempie i cerchi anche con fillHighlights spento: il riempimento si toglie dall'SVG.
	"""
	mol = Chem.MolFromSmiles(smiles)
	d = rdMolDraw2D.MolDraw2DSVG(-1, -1)
	draw_options(d)
	d.drawOptions().highlightRadius = 0.42
	color = rgb(PLACEHOLDER['note'])
	s = sorted(set(atoms))
	rdMolDraw2D.PrepareAndDrawMolecule(d, mol, highlightAtoms=s, highlightAtomColors={a: color for a in s},
		highlightBonds=[], highlightBondColors={})
	d.FinishDrawing()
	svg = themable(d.GetDrawingText())
	svg, n = re.subn(r"(<ellipse [^>]*style=')fill:var\(--mol-note,[^)]*\);fill-rule:evenodd;([^']*)stroke-width:[\d.]+px",
		r"\1fill:none;\2stroke-width:2px", svg)
	if n != len(s):
		raise ValueError(f'cerchi attesi {len(s)}, trovati {n}')
	return svg


def colored_svg(smiles: str, groups: dict[str, list[tuple[int, ...]]]) -> str:
	"""La molecola con i gruppi colorati come nella lezione (gli alogeni hanno già il loro colore)."""
	lines = []
	for key, hits in groups.items():
		color = GROUPS[key][2]
		if color:
			lines += [' '.join(map(str, h)) + ' ' + color for h in hits]
	return mol_svg(smiles, atomi='\n'.join(lines)) if lines else mol_svg(smiles)


def mol_name(entry) -> str:
	smi, it, common, _ = entry
	return f'{it} ({common})' if common else it


# ---------------------------------------------------------------------------
# Raccolte

def simple_by_class() -> dict[str, list[tuple]]:
	out: dict[str, list[tuple]] = {}
	for entry in SIMPLE:
		g = find_groups(entry[0])
		if len(g) != 1:
			raise ValueError(f'{entry[1]}: servono molecole con un solo tipo di gruppo, trovati {list(g)}')
		out.setdefault(next(iter(g)), []).append(entry)
	return out


SIMPLE_BY_CLASS = simple_by_class()


def group_option(key: str) -> dict:
	return {'latex': cap(label(key)), 'text': cap(label(key)), 'values': [key]}


def pick_distractor_classes(rng: Rng, answer: str, preferred: list[str], avoid: set[str]) -> list[str]:
	out = [k for k in preferred if k != answer and k not in avoid]
	out = list(dict.fromkeys(out))[:3]
	rest = rng.shuffle([k for k in ORDER if k != answer and k not in out and k not in avoid])
	return (out + rest)[:3]


def steps_for(answer: str, distractors: list[str]) -> list[str]:
	steps = [RULE[answer]]
	for d in distractors:
		if (answer, d) in NOT_TWIN:
			steps.append(NOT_TWIN[(answer, d)])
	return steps


# ---------------------------------------------------------------------------
# Livelli

FEMININE = {'aldeide', 'ammina', 'ammide'}


def a(key: str) -> str:
	"""'un alcol', 'un'aldeide', 'un estere'."""
	return ("un'" if key in FEMININE else 'un ') + label(key)


def of(name: str) -> str:
	"""'della vanillina', 'del paracetamolo', 'dell'acido citrico'."""
	if name[0].lower() in 'aeiou':
		return "dell'" + name
	return ('della ' if name.split()[0].endswith('a') else 'del ') + name


def level_marked_simple(rng: Rng, level: int) -> dict:
	"""Livelli 1 e 3 (domanda "nome"): una molecola semplice con il gruppo cerchiato.

	Il nome della molecola compare solo nella soluzione: il suffisso (-olo, -ale, -one...) direbbe la risposta.
	"""
	classes = list(SIMPLE_BY_CLASS) if level == 1 else list(TWINS)
	answer = rng.pick(classes)
	entry = rng.pick(SIMPLE_BY_CLASS[answer])
	smi = entry[0]
	groups = find_groups(smi)
	marked = sorted({x for h in groups[answer] for x in h})
	if level == 1:
		avoid = set(TWINS.get(answer, [])[:1]) | {k for k, v in TWINS.items() if answer in v[:1]}
		distr = rng.shuffle([k for k in ORDER if k != answer and k not in avoid])[:3]
	else:
		distr = TWINS[answer][:3]
	opts, idx = choice(rng, group_option(answer), [group_option(k) for k in distr])
	prompt = ('Questa molecola ha un solo tipo di gruppo funzionale, cerchiato nel disegno. A quale classe di composti appartiene?'
		if level == 1 else 'A quale classe appartiene il gruppo cerchiato? Attenzione ai gruppi che si somigliano.')
	steps = steps_for(answer, distr) + [f'La molecola si chiama {mol_name(entry)}.']
	return sample(ID, level, rng.seed, prompt=prompt, figura=marked_svg(smi, marked),
		options=opts, correct=idx, solution=f'{cap(label(answer))}.',
		steps=steps, figura_soluzione=colored_svg(smi, groups),
		params={'tipo': 'nome', 'smiles': smi, 'nome': entry[1], 'nome_en': entry[3], 'segnati': marked,
			'risposta': answer, 'distrattori': distr, 'gruppi': {k: [list(h) for h in v] for k, v in groups.items()}})


def level_structure(rng: Rng, level: int) -> dict:
	"""Livelli 2 e 3 (domanda "struttura"): il nome della classe, quattro molecole da scegliere."""
	classes = list(SIMPLE_BY_CLASS) if level == 2 else list(TWINS)
	answer = rng.pick(classes)
	if level == 2:
		avoid = set(TWINS.get(answer, [])[:1])
		distr_classes = rng.shuffle([k for k in ORDER if k != answer and k not in avoid])[:3]
	else:
		distr_classes = TWINS[answer][:3]
	right = rng.pick(SIMPLE_BY_CLASS[answer])
	wrong = [rng.pick(SIMPLE_BY_CLASS[k]) for k in distr_classes]

	def option(entry):
		return {'svg': mol_svg(entry[0]), 'text': 'Formula scheletrica', 'values': [canon(entry[0])]}

	opts, idx = choice(rng, option(right), [option(e) for e in wrong])
	for i, o in enumerate(opts, 1):
		o['text'] = f'Formula scheletrica {i}'
	steps = [RULE[answer], f'La molecola giusta si chiama {mol_name(right)}.']
	steps.append('Le altre: ' + '; '.join(f'{e[1]} ({label(k)})' for e, k in zip(wrong, distr_classes)) + '.')
	return sample(ID, level, rng.seed, prompt=f'Quale di queste molecole è {a(answer)}?', options=opts, correct=idx,
		solution=f'{cap(mol_name(right))}.', steps=steps, figura_soluzione=colored_svg(right[0], find_groups(right[0])),
		params={'tipo': 'struttura', 'risposta': answer, 'distrattori': distr_classes,
			'molecole': [{'smiles': canon(e[0]), 'nome': e[1], 'nome_en': e[3]} for e in [right, *wrong]]})


def real_pool(level: int) -> list[tuple]:
	"""Livello 4: almeno due tipi di gruppo. Livello 5: niente C=C, che la lezione non conta tra i gruppi."""
	pool = []
	for entry in REAL:
		g = find_groups(entry[0])
		if level == 4 and len(g) >= 2:
			pool.append(entry)
		if level == 5 and g and not has_alkene(entry[0]):
			pool.append(entry)
	return pool


def level_real_marked(rng: Rng) -> dict:
	smi, name, en, where = rng.pick(real_pool(4))
	groups = find_groups(smi)
	answer = rng.pick(sorted(groups))
	marked = sorted(rng.pick(groups[answer]))
	present = [k for k in groups if k != answer]
	twins = [t for t in TWINS.get(answer, []) if t not in groups]
	distr = pick_distractor_classes(rng, answer, rng.shuffle(present)[:2] + twins, set())
	opts, idx = choice(rng, group_option(answer), [group_option(k) for k in distr])
	steps = steps_for(answer, distr)
	steps.append(f'Nella molecola {of(name)} ci sono anche questi gruppi: {class_list(present)}.')
	return sample(ID, 4, rng.seed,
		prompt=f'Questa è la molecola {of(name)}, {where}. Il gruppo cerchiato è tipico di quale classe di composti?',
		figura=marked_svg(smi, marked), options=opts, correct=idx, solution=f'{cap(label(answer))}.', steps=steps,
		figura_soluzione=colored_svg(smi, groups),
		params={'tipo': 'nome', 'smiles': smi, 'nome': name, 'nome_en': en, 'segnati': marked,
			'risposta': answer, 'distrattori': distr, 'gruppi': {k: [list(h) for h in v] for k, v in groups.items()}})


def level_all_groups(rng: Rng) -> dict:
	smi, name, en, where = rng.pick(real_pool(5))
	groups = find_groups(smi)
	keys = sorted(groups, key=ORDER.index)
	n_kinds = len(keys)
	n_all = sum(len(v) for v in groups.values())
	kind = rng.pick(['quanti', 'quali'])
	steps = [RULE[k] for k in keys]
	if kind == 'quanti':
		cands = ([n_all] if n_all != n_kinds else []) + [n_kinds + 1, n_kinds - 1, n_kinds + 2, n_kinds + 3]
		distr = [c for c in dict.fromkeys(cands) if c >= 1 and c != n_kinds][:3]
		opts, idx = choice(rng, {'latex': f'${n_kinds}$', 'text': str(n_kinds), 'values': [str(n_kinds)]},
			[{'latex': f'${c}$', 'text': str(c), 'values': [str(c)]} for c in distr])
		if n_all != n_kinds:
			steps.append(f'Contando ogni gruppo tutte le volte che compare si arriva a {n_all}, ma la domanda chiede i tipi diversi.')
		prompt = f'Questa è la molecola {of(name)}, {where}. Quanti tipi diversi di gruppi funzionali contiene?'
		solution = f'${n_kinds}$: {class_list(keys)}.'
		extra = {'risposta': n_kinds}
	else:
		sets = []
		for k in rng.shuffle(keys):  # un gruppo scambiato con un suo gemello
			for t in TWINS.get(k, [])[:2]:
				if t not in keys:
					sets.append(tuple(sorted(set(keys) - {k} | {t}, key=ORDER.index)))
		if len(keys) >= 2:  # un gruppo dimenticato
			sets.append(tuple(sorted(set(keys) - {rng.pick(keys)}, key=ORDER.index)))
		for k in rng.shuffle(keys):  # un gruppo in più
			for t in TWINS.get(k, [])[:1]:
				if t not in keys:
					sets.append(tuple(sorted(set(keys) | {t}, key=ORDER.index)))
		right = tuple(keys)
		distr = [s for s in dict.fromkeys(rng.shuffle(sets)) if s != right and s][:3]
		if len(distr) < 3:
			raise ValueError('distrattori insufficienti')

		def opt(s):
			t = cap(class_list(s))
			return {'latex': t, 'text': t, 'values': list(s)}

		opts, idx = choice(rng, opt(right), [opt(s) for s in distr])
		prompt = f'Questa è la molecola {of(name)}, {where}. Quali gruppi funzionali contiene?'
		solution = f'{cap(class_list(keys))}.'
		extra = {'risposta': list(right), 'distrattori': [list(s) for s in distr]}
	return sample(ID, 5, rng.seed, prompt=prompt, figura=mol_svg(smi), options=opts, correct=idx, solution=solution,
		steps=steps, figura_soluzione=colored_svg(smi, groups),
		params={'tipo': kind, 'smiles': smi, 'nome': name, 'nome_en': en,
			'gruppi': {k: [list(h) for h in v] for k, v in groups.items()}} | extra)


def generate(rng: Rng, level: int) -> dict:
	if level == 1:
		return level_marked_simple(rng, 1)
	if level == 2:
		return level_structure(rng, 2)
	if level == 3:
		return level_marked_simple(rng, 3) if rng.pick(['nome', 'struttura']) == 'nome' else level_structure(rng, 3)
	if level == 4:
		return level_real_marked(rng)
	return level_all_groups(rng)


def check(s: dict) -> list[str]:
	p = s['params']
	errs = []
	if len(s['options']) != 4:
		errs.append('servono 4 opzioni')
	level = s['level']
	if level in (1, 2, 3) and p['tipo'] == 'nome' and len(p['gruppi']) != 1:
		errs.append('livelli 1-3: la molecola deve avere un solo tipo di gruppo')
	if level == 3 and not set(p['distrattori']) & set(TWINS[p['risposta']][:1]):
		errs.append('livello 3: manca il gemello tra i distrattori')
	if level == 4 and len(p['gruppi']) < 2:
		errs.append('livello 4: servono almeno due tipi di gruppo')
	if level == 5 and has_alkene(p['smiles']):
		errs.append('livello 5: niente doppi legami C=C')
	return errs
