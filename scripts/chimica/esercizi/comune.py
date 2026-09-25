"""
Base comune dei generatori di esercizi di chimica.

Stesso contratto dei generatori di matematica (`src/lib/exercises/v2/types.ts`), in Python perché
le molecole si disegnano con RDKit: un generatore è una funzione pura di (rng, livello), lo stesso
seed dà sempre lo stesso esercizio, e `params` contiene tutto quello che serve al controllo
indipendente (`verifica/<id>.py`) per rifare i conti. Le differenze:

- gli esercizi sono sempre a scelta multipla;
- la domanda può avere un disegno (`figura`, SVG) e ogni opzione può essere un disegno (`svg`) o
  testo con formule (`latex`, con `$...$` per le formule dentro il testo);
- la soluzione può avere un disegno (`figuraSoluzione`), per esempio la catena numerata;
- `values` di un'opzione identifica cosa rappresenta: per una molecola il SMILES canonico.

Un modulo generatore definisce `ID`, `TITLE`, `LEVELS` ({livello: (etichetta, [vincoli])}),
`generate(rng, level) -> dict` e `check(sample) -> list[str]` (i vincoli della specifica).
"""

from __future__ import annotations

import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from rdkit import Chem  # noqa: E402
from rdkit.Chem import Descriptors, rdMolDescriptors  # noqa: E402

from figure import draw_mol, themable  # noqa: E402


class Rng:
	"""Il solo generatore di numeri casuali ammesso: deterministico dato il seed."""

	def __init__(self, seed: int):
		self.seed = seed
		self._r = random.Random(seed)

	def int(self, a: int, b: int) -> int:
		return self._r.randint(a, b)

	def pick(self, xs):
		return xs[self._r.randrange(len(xs))]

	def sample(self, xs, k: int):
		return self._r.sample(list(xs), k)

	def shuffle(self, xs: list) -> list:
		xs = list(xs)
		self._r.shuffle(xs)
		return xs

	def next(self) -> float:
		return self._r.random()


def canon(smiles: str) -> str:
	mol = Chem.MolFromSmiles(smiles)
	if mol is None:
		raise ValueError(f'SMILES non valido: {smiles}')
	return Chem.MolToSmiles(mol)


def formula(smiles: str) -> str:
	return rdMolDescriptors.CalcMolFormula(Chem.MolFromSmiles(smiles))


def formula_latex(f: str) -> str:
	"""C6H12O6 → C_{6}H_{12}O_{6}, in \\mathrm."""
	import re
	return r'\mathrm{' + re.sub(r'(\d+)', r'_{\1}', f) + '}'


def molar_mass(smiles: str) -> float:
	return Descriptors.MolWt(Chem.MolFromSmiles(smiles))


def mol_svg(smiles: str, **opts) -> str:
	"""Una molecola disegnata come nelle lezioni; `opts` sono le opzioni dei blocchi ```molecola."""
	svg, _, _ = draw_mol({'smiles': smiles, **{k: str(v) for k, v in opts.items()}})
	return themable(svg)


def mol_option(smiles: str, text: str, **opts) -> dict:
	"""Un'opzione disegnata. `text` è quello che legge la sintesi vocale (il disegno non si legge)."""
	return {'svg': mol_svg(smiles, **opts), 'text': text, 'values': [canon(smiles)]}


def text_option(latex: str, values: list[str] | None = None) -> dict:
	return {'latex': latex, 'text': latex, 'values': values if values is not None else [latex]}


def choice(rng: Rng, correct: dict, distractors: list[dict]) -> tuple[list[dict], int]:
	"""Opzioni mescolate e indice della giusta. I valori devono essere tutti diversi."""
	options = rng.shuffle([correct, *distractors])
	keys = [tuple(o['values']) for o in options]
	if len(set(keys)) != len(keys):
		raise ValueError(f'opzioni ripetute: {keys}')
	return options, options.index(correct)


def sample(gen_id: str, level: int, seed: int, *, prompt: str, options: list[dict], correct: int,
	solution: str, steps: list[str], params: dict, problem: str = '', figura: str | None = None,
	figura_soluzione: str | None = None) -> dict:
	return {
		'generatorId': gen_id, 'level': level, 'seed': seed,
		'prompt': prompt, 'problem': problem, 'figura': figura,
		'options': options, 'correct': correct,
		'solution': solution, 'steps': steps, 'figuraSoluzione': figura_soluzione, 'params': params,
	}
