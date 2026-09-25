"""
Genera e verifica gli esercizi di un generatore di chimica.

  .venv/bin/python campioni.py <id> [--n 200] [--salva 12] [--seed 1]

Per ogni livello genera `n` esercizi con seed consecutivi, li passa al `check()` del generatore
(vincoli della specifica) e al controllo indipendente `esercizi/verifica/<id>.py`, stampa i
conteggi per livello e i seed che non passano, ed esce con 1 se qualcosa non passa. I primi `salva`
esercizi di ogni livello finiscono in `docs/lezioni/chimica/esercizi/<id>.json`, per la vetrina.

Il controllo indipendente riceve `opsin(nome_inglese) -> smiles`: i nomi si risolvono in blocco
(OPSIN è un programma Java, una chiamata per nome costerebbe 0,3 s), con due passate.
"""

from __future__ import annotations

import argparse
import importlib
import json
import sys
import traceback
import warnings
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE / 'esercizi'))
OUT = HERE.parents[1] / 'docs/lezioni/chimica/esercizi'

from comune import Rng  # noqa: E402


class Opsin:
	def __init__(self):
		self.cache: dict[str, str] = {}
		self.missing: set[str] = set()

	def __call__(self, name: str) -> str:
		if name in self.cache:
			return self.cache[name]
		self.missing.add(name)
		return ''

	def resolve(self) -> None:
		if not self.missing:
			return
		from py2opsin import py2opsin
		names = sorted(self.missing)
		with warnings.catch_warnings():
			warnings.simplefilter('ignore')
			out = py2opsin(names) if len(names) > 1 else [py2opsin(names[0])]
		self.cache.update(zip(names, out))
		self.missing.clear()


def genera(gen_id: str, n: int, seed: int = 1, quiet: bool = False):
	"""(generatore, esercizi che passano, esercizi scartati): ogni livello, n seed consecutivi, due controlli."""
	mod_name = gen_id.replace('-', '_')
	gen = importlib.import_module(mod_name)
	if not (HERE / 'esercizi/verifica' / f'{mod_name}.py').exists():
		raise SystemExit(f'manca esercizi/verifica/{mod_name}.py')
	verifier = importlib.import_module(f'verifica.{mod_name}')

	samples, failures = [], []
	for level in gen.LEVELS:
		for s in range(seed, seed + n):
			try:
				samples.append(gen.generate(Rng(s * 1000 + level), level))
			except Exception as e:  # noqa: BLE001
				failures.append((level, s, [f'errore di generazione: {e}'], traceback.format_exc(limit=3)))

	opsin = Opsin()
	for s in samples:  # prima passata: raccoglie i nomi
		try:
			verifier.check(s, opsin)
		except Exception:  # noqa: BLE001
			pass
	opsin.resolve()

	good = []
	per_level: dict[int, Counter] = {}
	cases: dict[int, Counter] = {}
	for s in samples:
		errs = list(gen.check(s))
		try:
			v_errs, case = verifier.check(s, opsin)
		except Exception as e:  # noqa: BLE001
			v_errs, case = [f'errore del controllo: {e}'], None
		errs += v_errs
		per_level.setdefault(s['level'], Counter())['ok' if not errs else 'ko'] += 1
		cases.setdefault(s['level'], Counter())[case] += 1
		if errs:
			failures.append((s['level'], s['seed'], errs, None))
		else:
			good.append(s)

	if not quiet:
		for level in gen.LEVELS:
			c = per_level.get(level, Counter())
			print(f'livello {level}: {c["ok"]} ok, {c["ko"]} ko; casi {dict(cases.get(level, {}))}')
		for level, s, errs, tb in failures[:20]:
			print(f'  KO livello {level} seed {s}: {"; ".join(errs)}')
			if tb:
				print(tb)
	return gen, good, failures


def main() -> int:
	ap = argparse.ArgumentParser()
	ap.add_argument('id')
	ap.add_argument('--n', type=int, default=200)
	ap.add_argument('--salva', type=int, default=12)
	ap.add_argument('--seed', type=int, default=1)
	args = ap.parse_args()
	gen, samples, failures = genera(args.id, args.n, args.seed)

	OUT.mkdir(parents=True, exist_ok=True)
	keep = []
	for level in gen.LEVELS:
		keep += [s for s in samples if s['level'] == level][: args.salva]
	payload = {'id': gen.ID, 'titolo': gen.TITLE, 'livelli': {str(k): v[0] for k, v in gen.LEVELS.items()}, 'esercizi': keep}
	(OUT / f'{gen.ID}.json').write_text(json.dumps(payload, ensure_ascii=False))
	print('PASS' if not failures else f'FAIL ({len(failures)})')
	return 1 if failures else 0


if __name__ == '__main__':
	sys.exit(main())
