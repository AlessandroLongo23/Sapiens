"""
Prepara le figure di chimica di lezioni e formulari per il sito.

  .venv/bin/python pubblica_figure.py <file.md> ...

Per ogni blocco ```molecola, ```molecole, ```reazione e ```molecola3d: compila il disegno con RDKit (figure.py),
lo salva nei soli colori chiari in `.svg-sito/` con il nome che il sito si aspetta, e riscrive nel file le righe
`% svg: <file> <larghezza>x<altezza>` e, per il 3D, `% xyz:` con le coordinate. Il nome del file è quello di
`figureFile(figure, chemCompiler(kind))` in src/lib/content/figures.ts: stesso hash (FNV-1a sui caratteri UTF-16
di `chem<versione>:<tipo>\\n<codice>`), stessa riduzione del nome. Se il blocco cambia, cambia il file, e il sito
smette di mostrare il disegno vecchio finché non si ripubblica. `pubblica.mts` carica poi gli SVG nel bucket.
"""

from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path

from rdkit import Chem

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
SVG = HERE / '.svg-sito'

from figure import KINDS, compile_block, light  # noqa: E402

CHEM_COMPILER = 1  # uguale a CHEM_COMPILER in src/lib/content/figures.ts
META = re.compile(r'^%\s*(nome|alt|svg|xyz):\s*(.*)$')
FENCE = re.compile(r'^```(' + '|'.join(sorted(KINDS, key=len, reverse=True)) + r')\n(.*?)^```', re.S | re.M)


def fnv(text: str) -> str:
	h = 0x811C9DC5
	units = text.encode('utf-16-le')
	for i in range(0, len(units), 2):
		h ^= units[i] | (units[i + 1] << 8)
		h = (h * 0x01000193) & 0xFFFFFFFF
	return f'{h:08x}'


def base_name(name: str) -> str:
	s = unicodedata.normalize('NFD', name)
	s = re.sub('[̀-ͯ]', '', s).lower()
	s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
	return s or 'figura'


def split(block: str) -> tuple[dict, str]:
	lines = block.replace('\r\n', '\n').replace('\r', '\n').split('\n')
	meta, i = {}, 0
	while i < len(lines):
		m = META.match(lines[i].strip())
		if not m:
			break
		meta[m.group(1)] = m.group(2).strip()
		i += 1
	return meta, '\n'.join(lines[i:]).strip()


def xyz(molblock: str) -> str:
	mol = Chem.MolFromMolBlock(molblock, removeHs=False)
	conf = mol.GetConformer()
	return '; '.join(f'{a.GetSymbol()} {p[0]:.3f} {p[1]:.3f} {p[2]:.3f}' for a, p in zip(mol.GetAtoms(), conf.GetPositions()))


def publish_file(path: Path) -> int:
	text = path.read_text()
	count = 0

	def repl(m: re.Match) -> str:
		nonlocal count
		kind, body = m.group(1), m.group(2)
		meta, code = split(body)
		fig = compile_block(kind, f'% nome: {meta.get("nome", "")}\n% alt: {meta.get("alt", "")}\n{code}')
		svg = light(fig['svg'])
		file = f'{base_name(meta["nome"])}-{fnv(f"chem{CHEM_COMPILER}:{kind}" + chr(10) + code)}.svg'
		(SVG / file).write_text(svg)
		lines = [f'% nome: {meta["nome"]}', f'% alt: {meta["alt"]}', f'% svg: {file} {fig["width"]}x{fig["height"]}']
		if kind == 'molecola3d':
			lines.append(f'% xyz: {xyz(fig["dati"]["molblock"])}')
		count += 1
		return f'```{kind}\n' + '\n'.join(lines) + '\n' + code + '\n```'

	new = FENCE.sub(repl, text)
	if new != text:
		path.write_text(new)
	return count


if __name__ == '__main__':
	SVG.mkdir(exist_ok=True)
	for p in sys.argv[1:]:
		print(f'{p}: {publish_file(Path(p))} figure')
