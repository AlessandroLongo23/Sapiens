"""
Figure di chimica disegnate con RDKit.

Le lezioni di chimica descrivono le figure nel markdown con blocchi propri, sul modello dei blocchi
```tikz: le prime righe `% nome:` e `% alt:` come nei TikZ, poi una riga `chiave: valore` per opzione.
Questo modulo le trasforma in SVG statici (le lettere sono già tracciati, non serve nessun font).

Blocchi:

  ```molecola        una molecola
  smiles: CC(C)CC                       obbligatorio
  idrogeni: tutti                       tutti | no (predefinito: solo quelli degli eteroatomi)
  carboni: si                           scrive la C su ogni carbonio (formula di struttura)
  catena: 0 1 2 3                       indici degli atomi della catena principale: colorati e numerati 1, 2, 3...
  evidenzia: C(=O)O verde; [OH] rosso   SMARTS e colore, separati da "; " (dentro un SMARTS ; va senza spazio)
  atomi: 1 4 giallo                     indici di atomi da colorare (più righe ammesse)
  stereo: si                            scrive R/S e E/Z e colora i centri stereogenici
  numeri: si                            scrive l'indice di ogni atomo (solo per chi scrive le lezioni)
  legenda: 2-metilbutano                testo sotto il disegno
  ruota: 90                             gradi
  scala: 1.2                            lunghezza dei legami rispetto al normale

  ```molecole        una tabella di molecole, una riga per molecola
  colonne: 3
  CCO | etanolo
  CC(=O)O | acido acetico

  (le opzioni di `molecola` valgono per tutte; una riga può aggiungere `| evidenzia: ...`)

  ```reazione        uno schema di reazione
  reazione: CC(=O)O.OCC>[H+]>CC(=O)OCC.O
  sopra: H⁺                             testo sopra la freccia (sostituisce i reagenti in mezzo)
  colora: si                            colora gli atomi secondo il reagente da cui vengono (servono le mappe :n)

  ```molecola3d      una molecola in 3D (modello a sfere e bastoncini, coordinate ottimizzate)
  smiles: N
  angoli: 1-0-2                         angoli di legame da misurare, per indici con gli H aggiunti in fondo

Le molecole si scrivono in SMILES. `python figure.py file.md ...` compila tutti i blocchi dei file e
scrive in `docs/lezioni/chimica/figure/`: un SVG per blocco e `<cartella>-<file>.json` con dimensioni, testo
alternativo e i dati calcolati (formula, massa molare, angoli, coordinate 3D). I nomi delle figure
devono essere unici in tutte le lezioni, perché gli SVG stanno nella stessa cartella.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from rdkit import Chem, RDLogger
from rdkit.Chem import AllChem, Descriptors, rdCIPLabeler, rdChemReactions, rdMolDescriptors, rdMolTransforms
from rdkit.Chem.Draw import rdMolDraw2D

RDLogger.DisableLog('rdApp.*')

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/lezioni/chimica/figure'

# Colori degli atomi e delle evidenziazioni. RDKit scrive i colori come esadecimali: il disegno usa
# questi valori esatti, poi `themable()` li sostituisce con variabili CSS, così la stessa figura
# funziona in chiaro e in scuro (dentro una pagina prende le variabili della pagina; da sola, come
# <img>, usa i valori del suo foglio di stile interno).
INK = (0x1f, 0x23, 0x28)
ATOMS = {
	# numero atomico: (nome della variabile, chiaro, scuro)
	6: ('ink', '#1f2328', '#e6e6e6'),
	1: ('ink', '#1f2328', '#e6e6e6'),
	8: ('o', '#d1242f', '#ff7b72'),
	7: ('n', '#1f5fd1', '#79a8ff'),
	16: ('s', '#9a6700', '#e3b341'),
	15: ('p', '#bc4c00', '#ffa657'),
	17: ('cl', '#1a7f37', '#56d364'),
	9: ('f', '#1b7c83', '#56d4dd'),
	35: ('br', '#8a3b12', '#f0883e'),
	5: ('b', '#a0522d', '#e8a87c'),
}
HIGHLIGHTS = {
	# nome: (chiaro, scuro)
	'giallo': ('#fde68a', '#6b5211'),
	'verde': ('#bbf7d0', '#1f5130'),
	'blu': ('#bfdbfe', '#1e3a66'),
	'rosso': ('#fecaca', '#6b2323'),
	'viola': ('#e9d5ff', '#4b2a6b'),
	'arancione': ('#fed7aa', '#6b3a12'),
	'grigio': ('#e5e7eb', '#3a3f45'),
}
# Colori "segnaposto" per il disegno: uno per variabile, tutti diversi tra loro.
PLACEHOLDER = {}


def _placeholder_colors():
	used = set()
	n = 1
	for name, *_ in list(ATOMS.values()) + [(h,) for h in HIGHLIGHTS] + [('note',)]:
		if name in PLACEHOLDER:
			continue
		while True:
			hexa = f'#{n:02X}{(n * 7) % 256:02X}{(n * 13) % 256:02X}'
			n += 1
			if hexa not in used:
				break
		used.add(hexa)
		PLACEHOLDER[name] = hexa


_placeholder_colors()


def rgb(hexa: str) -> tuple[float, float, float]:
	return tuple(int(hexa[i:i + 2], 16) / 255 for i in (1, 3, 5))


def style_sheet() -> str:
	light = {name: l for name, l, _ in ATOMS.values()} | {h: c[0] for h, c in HIGHLIGHTS.items()} | {'note': '#57606a'}
	dark = {name: d for name, _, d in ATOMS.values()} | {h: c[1] for h, c in HIGHLIGHTS.items()} | {'note': '#9da7b3'}
	fmt = lambda d: ';'.join(f'--mol-{k}:{v}' for k, v in d.items())
	return f'<style>svg{{{fmt(light)}}}@media (prefers-color-scheme:dark){{svg{{{fmt(dark)}}}}}</style>'


def themable(svg: str) -> str:
	"""Colori segnaposto → variabili CSS con il valore chiaro di riserva; niente intestazione XML."""
	light = {name: l for name, l, _ in ATOMS.values()} | {h: c[0] for h, c in HIGHLIGHTS.items()} | {'note': '#57606a'}
	for name, hexa in PLACEHOLDER.items():
		svg = re.sub(hexa, f'var(--mol-{name},{light[name]})', svg, flags=re.I)
	svg = re.sub(r'#000000', f'var(--mol-ink,{light["ink"]})', svg)
	svg = re.sub(r'<\?xml[^>]*\?>\s*', '', svg)
	svg = svg.replace('<!-- END OF HEADER -->', style_sheet())
	svg = re.sub(r"<rect style='opacity:1.0;fill:#FFFFFF[^>]*>\s*", '', svg)
	svg = re.sub(r'\s+xmlns:rdkit=\S+', '', svg)
	svg = re.sub(r'<metadata>.*?</metadata>', '', svg, flags=re.S)
	return re.sub(r'\n\s*', ' ', svg).strip()


def light(svg: str) -> str:
	"""La figura solo nei colori chiari, per il sito: lì il tema scuro la inverte come i TikZ (globals.css),
	e la versione scura interna, che segue il sistema e non il tema scelto, la invertirebbe due volte."""
	return re.sub(r'@media \(prefers-color-scheme:dark\)\{svg\{[^}]*\}\}', '', svg)


def options(d: rdMolDraw2D.MolDraw2D, scala: float = 1.0) -> None:
	o = d.drawOptions()
	o.clearBackground = False
	o.fixedBondLength = 32 * scala
	o.bondLineWidth = 1.6
	o.scaleBondWidth = False
	o.minFontSize = 13
	o.maxFontSize = 18
	o.annotationFontScale = 0.75
	o.multipleBondOffset = 0.18
	o.additionalAtomLabelPadding = 0.08
	o.padding = 0.08
	o.highlightRadius = 0.36
	o.fillHighlights = True
	o.continuousHighlight = True
	o.setAnnotationColour(rgb(PLACEHOLDER['note']))
	palette = {z: rgb(PLACEHOLDER[name]) for z, (name, _, _) in ATOMS.items()}
	o.updateAtomPalette(palette)
	o.setBackgroundColour((1, 1, 1, 0))


def parse_block(text: str) -> tuple[dict, list[str]]:
	"""Righe `% chiave: valore` e `chiave: valore` → dizionario; le altre righe restano a parte."""
	meta, rest = {}, []
	for line in text.strip().splitlines():
		s = line.strip()
		if not s:
			continue
		m = re.match(r'^%\s*(\w+):\s*(.*)$', s)
		if m:
			meta[m.group(1)] = m.group(2).strip()
			continue
		m = re.match(r'^([a-z0-9]+):\s*(.*)$', s)
		if m and '|' not in s:
			key = m.group(1)
			meta[key] = meta[key] + '\n' + m.group(2).strip() if key in meta and key == 'atomi' else m.group(2).strip()
			continue
		rest.append(s)
	return meta, rest


def yes(v: str | None) -> bool:
	return (v or '').strip().lower() in ('si', 'sì', 'yes', 'true', '1')


def mol_from(smiles: str) -> Chem.Mol:
	mol = Chem.MolFromSmiles(smiles)
	if mol is None:
		raise ValueError(f'SMILES non valido: {smiles}')
	return mol


def mol_data(mol: Chem.Mol) -> dict:
	return {
		'smiles': Chem.MolToSmiles(mol),
		'formula': rdMolDescriptors.CalcMolFormula(mol),
		'massa': round(Descriptors.MolWt(mol), 2),
	}


def prepare(meta: dict) -> tuple[Chem.Mol, dict]:
	"""La molecola pronta da disegnare e le evidenziazioni, dalle opzioni del blocco."""
	mol = mol_from(meta['smiles'])
	atom_colors: dict[int, tuple] = {}
	bond_colors: dict[int, tuple] = {}
	radii: dict[int, float] = {}

	def paint(atoms: list[int], color: str) -> None:
		if color not in HIGHLIGHTS:
			raise ValueError(f'colore sconosciuto: {color} (ammessi: {", ".join(HIGHLIGHTS)})')
		c = rgb(PLACEHOLDER[color])
		s = set(atoms)
		for a in s:
			atom_colors[a] = c
		for b in mol.GetBonds():
			if b.GetBeginAtomIdx() in s and b.GetEndAtomIdx() in s:
				bond_colors[b.GetIdx()] = c

	for part in filter(None, (p.strip() for p in re.split(r';\s+|;$', meta.get('evidenzia') or ''))):
		smarts, color = part.rsplit(' ', 1)
		patt = Chem.MolFromSmarts(smarts.strip())
		if patt is None:
			raise ValueError(f'SMARTS non valido: {smarts}')
		matches = mol.GetSubstructMatches(patt)
		if not matches:
			raise ValueError(f'"{smarts}" non compare in {meta["smiles"]}')
		for match in matches:
			paint(list(match), color)

	for line in filter(None, (meta.get('atomi') or '').splitlines()):
		*idx, color = line.split()
		paint([int(i) for i in idx], color)

	if meta.get('catena'):
		chain = [int(i) for i in meta['catena'].split()]
		paint(chain, 'giallo')
		for n, a in enumerate(chain, 1):
			mol.GetAtomWithIdx(a).SetProp('atomNote', str(n))

	if yes(meta.get('stereo')):
		Chem.AssignStereochemistry(mol, cleanIt=True, force=True)
		rdCIPLabeler.AssignCIPLabels(mol)
		for a in mol.GetAtoms():
			if a.HasProp('_CIPCode'):
				a.SetProp('atomNote', f'({a.GetProp("_CIPCode")})')
				if a.GetIdx() not in atom_colors:
					paint([a.GetIdx()], 'viola')
		for b in mol.GetBonds():
			if b.HasProp('_CIPCode'):
				b.SetProp('bondNote', f'({b.GetProp("_CIPCode")})')

	if yes(meta.get('numeri')):
		for a in mol.GetAtoms():
			a.SetProp('atomNote', str(a.GetIdx()))

	if (meta.get('idrogeni') or '').lower() == 'tutti':
		mol = Chem.AddHs(mol)
		# RDKit disegna i legami con gli H: le evidenziazioni restano sugli indici originali.

	return mol, {'atoms': atom_colors, 'bonds': bond_colors, 'radii': radii}


LEGEND = 30  # altezza della riga della legenda, in px


def draw_mol(meta: dict, width: int = -1, height: int = -1) -> tuple[str, int, int]:
	"""Disegna la molecola. Senza misure la tela si adatta alla molecola; la legenda ha una riga sua sotto."""
	legend = meta.get('legenda') or ''
	if legend and width < 0:
		_, w, h = draw_mol({k: v for k, v in meta.items() if k != 'legenda'})
		width, height = max(w, 12 + 9 * len(legend)), h + LEGEND
	mol, hl = prepare(meta)
	d = rdMolDraw2D.MolDraw2DSVG(width, height)
	options(d, float(meta.get('scala') or 1))
	o = d.drawOptions()
	if meta.get('ruota'):
		o.rotate = float(meta['ruota'])
	if yes(meta.get('carboni')):
		for a in mol.GetAtoms():
			if a.GetAtomicNum() == 6:
				o.atomLabels[a.GetIdx()] = 'C'
	if legend:
		o.legendFontSize = 15
		o.legendFraction = LEGEND / height
	rdMolDraw2D.PrepareAndDrawMolecule(
		d, mol,
		legend=legend,
		highlightAtoms=list(hl['atoms']), highlightAtomColors=hl['atoms'],
		highlightBonds=list(hl['bonds']), highlightBondColors=hl['bonds'],
	)
	d.FinishDrawing()
	svg = d.GetDrawingText()
	w, h = re.search(r"width='(\d+)px' height='(\d+)px'", svg).groups()
	return svg, int(w), int(h)


def figure_molecola(meta: dict, rows: list[str]) -> dict:
	svg, w, h = draw_mol(meta)
	return {'svg': themable(svg), 'width': w, 'height': h, 'dati': mol_data(mol_from(meta['smiles']))}


def figure_molecole(meta: dict, rows: list[str]) -> dict:
	"""Una tabella: ogni molecola disegnata nella stessa cella, poi affiancate in una griglia SVG."""
	cols = int(meta.get('colonne') or 3)
	cells, data = [], []
	for row in rows:
		parts = [p.strip() for p in row.split('|')]
		cell = {k: v for k, v in meta.items() if k not in ('nome', 'alt', 'colonne')}
		cell['smiles'] = parts[0]
		cell['legenda'] = parts[1] if len(parts) > 1 else ''
		for extra in parts[2:]:
			k, v = extra.split(':', 1)
			cell[k.strip()] = v.strip()
		cells.append(cell)
		data.append(mol_data(mol_from(cell['smiles'])) | {'legenda': cell['legenda']})
	drawn = [draw_mol(cell) for cell in cells]
	cw = max(w for _, w, _ in drawn) + 16
	ch = max(h for _, _, h in drawn) + 8
	parts = []
	for i, (svg, w, h) in enumerate(drawn):
		inner = re.search(r'<!-- END OF HEADER -->(.*)</svg>', svg, re.S).group(1)
		x, y = (i % cols) * cw + (cw - w) / 2, (i // cols) * ch + (ch - h)
		parts.append(f"<g transform='translate({x:.1f},{y:.1f})'>{inner}</g>")
	rows_n = (len(cells) + cols - 1) // cols
	W, H = cw * min(cols, len(cells)), ch * rows_n
	svg = (f"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' width='{W}px' height='{H}px' viewBox='0 0 {W} {H}'>"
		f"<!-- END OF HEADER -->{''.join(parts)}</svg>")
	return {'svg': themable(svg), 'width': W, 'height': H, 'dati': data}


def figure_reazione(meta: dict, rows: list[str]) -> dict:
	smiles = meta['reazione']
	rxn = rdChemReactions.ReactionFromSmarts(smiles, useSmiles=True)
	d = rdMolDraw2D.MolDraw2DSVG(int(meta.get('larghezza') or 600), int(meta.get('altezza') or 140))
	options(d, float(meta.get('scala') or 1))
	o = d.drawOptions()
	o.includeAtomTags = False
	o.includeRadicals = False
	if yes(meta.get('colora')):
		colors = [rgb(PLACEHOLDER[c]) for c in ('blu', 'arancione', 'verde', 'viola')]
		d.DrawReaction(rxn, highlightByReactant=True, highlightColorsReactants=colors)
	else:
		d.DrawReaction(rxn)
	d.FinishDrawing()
	svg = d.GetDrawingText()
	w, h = re.search(r"width='(\d+)px' height='(\d+)px'", svg).groups()
	reag = [mol_data(m) for m in rxn.GetReactants()]
	prod = [mol_data(m) for m in rxn.GetProducts()]
	for m in (*rxn.GetReactants(), *rxn.GetProducts()):
		for a in m.GetAtoms():
			a.SetAtomMapNum(0)
	return {'svg': themable(svg), 'width': int(w), 'height': int(h), 'dati': {'reagenti': reag, 'prodotti': prod}}


def figure_molecola3d(meta: dict, rows: list[str]) -> dict:
	"""Coordinate 3D (ETKDG, poi MMFF o UFF) e gli angoli richiesti; il disegno 2D fa da riserva."""
	mol = Chem.AddHs(mol_from(meta['smiles']))
	if AllChem.EmbedMolecule(mol, randomSeed=0x5A9) != 0:
		raise ValueError(f'nessuna geometria 3D per {meta["smiles"]}')
	if AllChem.MMFFHasAllMoleculeParams(mol):
		AllChem.MMFFOptimizeMolecule(mol, maxIters=2000)
		field = 'MMFF94'
	elif AllChem.UFFHasAllMoleculeParams(mol):
		AllChem.UFFOptimizeMolecule(mol, maxIters=2000)
		field = 'UFF'
	else:
		raise ValueError(f'nessun campo di forza per {meta["smiles"]}')
	conf = mol.GetConformer()
	angles = []
	for spec in (meta.get('angoli') or '').split():
		i, j, k = (int(x) for x in spec.split('-'))
		angles.append({'atomi': spec, 'gradi': round(rdMolTransforms.GetAngleDeg(conf, i, j, k), 1)})
	flat = draw_mol({**meta, 'idrogeni': 'tutti'})
	return {
		'svg': themable(flat[0]), 'width': flat[1], 'height': flat[2],
		'dati': mol_data(Chem.RemoveHs(mol)) | {'campo': field, 'angoli': angles, 'molblock': Chem.MolToMolBlock(mol)},
	}


KINDS = {'molecola': figure_molecola, 'molecole': figure_molecole, 'reazione': figure_reazione, 'molecola3d': figure_molecola3d}
BLOCK = re.compile(r'^```(' + '|'.join(KINDS) + r')\n(.*?)^```', re.S | re.M)


def compile_block(kind: str, body: str) -> dict:
	meta, rows = parse_block(body)
	if not meta.get('nome') or not meta.get('alt'):
		raise ValueError(f'blocco {kind} senza % nome o % alt')
	fig = KINDS[kind](meta, rows)
	return {'tipo': kind, 'nome': meta['nome'], 'alt': meta['alt']} | fig


def compile_files(paths: list[Path]) -> dict:
	"""Compila i blocchi di ogni file; il manifesto è uno per file (`figure/<cartella>-<file>.json`)."""
	OUT.mkdir(parents=True, exist_ok=True)
	errors = 0
	for path in paths:
		manifest = {}
		for m in BLOCK.finditer(path.read_text()):
			try:
				fig = compile_block(m.group(1), m.group(2))
			except Exception as e:  # noqa: BLE001 — si raccolgono tutti gli errori, poi si esce
				errors += 1
				print(f'{path.name}: {e}', file=sys.stderr)
				continue
			if fig['nome'] in manifest:
				errors += 1
				print(f'{path.name}: nome ripetuto {fig["nome"]}', file=sys.stderr)
			(OUT / f'{fig["nome"]}.svg').write_text(fig['svg'])
			manifest[fig['nome']] = {k: v for k, v in fig.items() if k != 'svg'}
			dati = fig['dati']
			extra = f' {dati["formula"]} M={dati["massa"]}' if isinstance(dati, dict) and 'formula' in dati else ''
			angoli = ' '.join(f'{a["atomi"]}={a["gradi"]}°' for a in dati.get('angoli', [])) if isinstance(dati, dict) else ''
			print(f'{path.name}: {fig["nome"]} {fig["width"]}x{fig["height"]}{extra} {angoli}'.rstrip())
		(OUT / f'{path.parent.name}-{path.stem}.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=1, sort_keys=True))
	return {'errori': errors}


if __name__ == '__main__':
	result = compile_files([Path(p) for p in sys.argv[1:]])
	sys.exit(1 if result['errori'] else 0)
