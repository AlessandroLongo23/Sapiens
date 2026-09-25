"""
Costruisce la vetrina delle lezioni di chimica: una pagina HTML sola, con lezioni, formulari, figure
ed esercizi, da pubblicare come Artifact.

  .venv/bin/python vetrina.py <uscita.html> [--esercizi 8]

Legge docs/lezioni/chimica/ (lezioni, formulari, figure compilate, esercizi generati) e il modello
vetrina.html. Le figure devono essere già compilate con figure.py e gli esercizi con campioni.py.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
DOCS = HERE.parents[1] / 'docs/lezioni/chimica'

from figure import BLOCK, compile_block, draw_mol, parse_block, themable  # noqa: E402

LEZIONI = [
	('01', 'mole-massa-molare', '2° anno', 'formula e massa molare calcolate dalla struttura'),
	('02', 'geometria-molecolare-vsepr', '3° anno', 'geometria 3D ottimizzata, angoli misurati'),
	('03', 'alcani-nomenclatura', '5° anno', 'catena principale numerata, nomi verificati con OPSIN'),
	('04', 'isomeria', '5° anno', 'R/S ed E/Z calcolati, isomeri a confronto'),
	('05', 'gruppi-funzionali', '5° anno', 'gruppi evidenziati con SMARTS'),
	('06', 'amminoacidi-legame-peptidico', '5° anno', 'reazioni con gli atomi colorati per reagente'),
]


SCALE = 1.4


def slim(svg: str) -> str:
	"""Dentro la pagina i colori li dà la pagina: via il foglio di stile e le proprietà di default."""
	svg = re.sub(r'<style>.*?</style>', '', svg, flags=re.S)
	for default in (';fill-rule:evenodd', ';stroke-linecap:butt', ';stroke-linejoin:miter', ';stroke-opacity:1', ';fill-opacity:1'):
		svg = svg.replace(default, '')
	svg = re.sub(r'var\(--mol-([a-z]+),#[0-9a-fA-F]{6}\)', r'var(--mol-\1)', svg)
	svg = re.sub(r"(\d+\.\d)\d+", r'\1', svg)
	# RDKit disegna a misura di schermo piccolo: nella pagina le molecole stanno meglio più grandi
	svg = re.sub(r"<svg([^>]*?)width='([\d.]+)px' height='([\d.]+)px'",
		lambda m: f"<svg{m.group(1)}width='{float(m.group(2)) * SCALE:.0f}px' height='{float(m.group(3)) * SCALE:.0f}px'", svg, count=1)
	return svg


def text_with_placeholders(path: Path) -> str:
	text = path.read_text()
	text = re.sub(r'^# .*\n\n?', '', text, count=1)

	def repl(m: re.Match) -> str:
		meta, _ = parse_block(m.group(2))
		return f'\n@@F:{meta.get("nome", "?")}@@\n'

	return BLOCK.sub(repl, text)


def main() -> int:
	ap = argparse.ArgumentParser()
	ap.add_argument('out')
	ap.add_argument('--esercizi', type=int, default=8)
	args = ap.parse_args()

	figure, lezioni = {}, []
	for n, slug, anno, rdkit in LEZIONI:
		stem = f'{n}-{slug}'
		lez = DOCS / 'riscritte' / f'{stem}.md'
		form = DOCS / 'formulari' / f'{stem}.md'
		if not lez.exists():
			print(f'manca {lez.name}, la salto', file=sys.stderr)
			continue
		title = lez.read_text().splitlines()[0].lstrip('# ').strip()
		for path in (lez, form):
			if not path.exists():
				continue
			for m in BLOCK.finditer(path.read_text()):
				fig = compile_block(m.group(1), m.group(2))
				figure[fig['nome']] = {'tipo': fig['tipo'], 'alt': fig['alt'], 'svg': slim(fig['svg']), 'dati': fig.get('dati')}
		ex_path = DOCS / 'esercizi' / f'{slug}.json'
		ex = None
		if ex_path.exists():
			ex = json.loads(ex_path.read_text())
			keep = []
			for level in ex['livelli']:
				keep += [e for e in ex['esercizi'] if str(e['level']) == level][: args.esercizi]
			for e in keep:
				for k in ('figura', 'figuraSoluzione'):
					if e.get(k):
						e[k] = slim(e[k])
				for o in e['options']:
					if o.get('svg'):
						o['svg'] = slim(o['svg'])
				e.pop('params', None)
			ex = {'livelli': ex['livelli'], 'esercizi': keep}
		lezioni.append({
			'n': n, 'slug': slug, 'titolo': title, 'anno': anno, 'rdkit': rdkit,
			'lezione': text_with_placeholders(lez),
			'formulario': text_with_placeholders(form) if form.exists() else None,
			'esercizi': ex,
		})

	hero = slim(themable(draw_mol({'smiles': 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', 'scala': '1.25'})[0]))
	data = json.dumps({'lezioni': lezioni, 'figure': figure, 'hero': hero}, ensure_ascii=False).replace('</', '<\\/')
	html = (HERE / 'vetrina.html').read_text().replace('__DATA__', data)
	Path(args.out).write_text(html)
	print(f'{len(lezioni)} lezioni, {len(figure)} figure, {sum(len(l["esercizi"]["esercizi"]) for l in lezioni if l["esercizi"])} esercizi, {len(html) / 1e6:.1f} MB → {args.out}')
	return 0


if __name__ == '__main__':
	sys.exit(main())
