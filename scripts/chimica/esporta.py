"""
Esporta gli esercizi di chimica per il sito.

  .venv/bin/python esporta.py [id ...] [--n 80]

Per ogni generatore (tutti, se non se ne indica nessuno) genera `n` esercizi per livello, tiene solo quelli che
passano il `check()` del generatore e il controllo indipendente (come `campioni.py`), e scrive:

- `src/lib/exercises/chimica/pools/<id>.json`: l'insieme da cui pesca il generatore del sito
  (`src/lib/exercises/chimica/<id>.ts`), con i disegni come riferimenti;
- `scripts/chimica/.svg-sito/<file>.svg`: i disegni, nei soli colori chiari, con il nome preso dal contenuto
  (lo stesso disegno in più esercizi è un file solo). `pubblica.mts` li carica nel bucket `figure`.

Esce con 1 se un esercizio non passa i controlli.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
POOLS = ROOT / 'src/lib/exercises/chimica/pools'
SVG = HERE / '.svg-sito'

from campioni import genera  # noqa: E402
from figure import light  # noqa: E402

GENERATORS = ['mole-massa-molare', 'geometria-molecolare-vsepr', 'alcani-nomenclatura', 'isomeria', 'gruppi-funzionali', 'amminoacidi-legame-peptidico']


def store(svg: str, alt: str) -> dict:
	svg = light(svg)
	file = f'chimica-{hashlib.sha1(svg.encode()).hexdigest()[:16]}.svg'
	path = SVG / file
	if not path.exists():
		path.write_text(svg)
	w, h = re.search(r"width='([\d.]+)px' height='([\d.]+)px'", svg).groups()
	return {'file': file, 'width': round(float(w)), 'height': round(float(h)), 'alt': alt}


def convert(s: dict) -> dict:
	options = []
	for o in s['options']:
		opt = {'latex': o.get('latex', ''), 'values': o['values'], 'text': o.get('text') or o.get('latex', '')}
		if o.get('svg'):
			opt['figure'] = store(o['svg'], opt['text'])
		options.append(opt)
	out = {
		'generatorId': s['generatorId'], 'level': s['level'], 'seed': s['seed'],
		'prompt': s['prompt'], 'problem': s.get('problem') or '',
		'solution': s['solution'], 'steps': s['steps'],
		'answer': {'kind': 'choice', 'options': options, 'correct': s['correct']},
		'params': s.get('params', {}), 'format': 'text',
	}
	if s.get('figura'):
		out['figure'] = store(s['figura'], 'La molecola della domanda')
	if s.get('figuraSoluzione'):
		out['solutionFigure'] = store(s['figuraSoluzione'], 'La soluzione sul disegno della molecola')
	return out


def main() -> int:
	ap = argparse.ArgumentParser()
	ap.add_argument('ids', nargs='*')
	ap.add_argument('--n', type=int, default=80)
	args = ap.parse_args()
	POOLS.mkdir(parents=True, exist_ok=True)
	SVG.mkdir(exist_ok=True)
	bad = 0
	for gen_id in args.ids or GENERATORS:
		gen, good, failures = genera(gen_id, args.n, quiet=True)
		bad += len(failures)
		items = [convert(s) for s in good]
		pool = {'id': gen.ID, 'title': gen.TITLE, 'levels': {str(k): v[0] for k, v in gen.LEVELS.items()}, 'items': items}
		path = POOLS / f'{gen.ID}.json'
		path.write_text(json.dumps(pool, ensure_ascii=False, separators=(',', ':')))
		print(f'{gen.ID}: {len(items)} esercizi, {len(failures)} scartati, {path.stat().st_size / 1e3:.0f} kB')
	print(f'{len(list(SVG.glob("*.svg")))} disegni in {SVG}')
	return 1 if bad else 0


if __name__ == '__main__':
	sys.exit(main())
