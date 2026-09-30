"""Shared helpers for the checkers of the chemistry chapter "Dalle trasformazioni chimiche alla teoria atomica"
(first year, group 25: chim-legge-proporzioni-multiple, chim-teoria-atomica-dalton, chim-atomi-molecole-ioni,
chim-formula-chimica).

Written from the lessons 25-28, not from the generators: a formula is read from its LaTeX (\\mathrm{Al_2(SO_4)_3},
\\mathrm{CuSO_4 \\cdot 5H_2O}, \\mathrm{SO_4^{2-}}) with a small recursive parser of its own, and counted atom by atom.
"""
import re
from collections import Counter

from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra  # noqa: F401

MASS = {"H": 1.01, "C": 12.01, "N": 14.01, "O": 16.00, "Na": 22.99, "Mg": 24.31, "P": 30.97, "S": 32.07, "Cl": 35.45, "K": 39.10, "Ca": 40.08, "Fe": 55.85}

ELEMENT_NAME = {
    "idrogeno": "H", "carbonio": "C", "azoto": "N", "ossigeno": "O", "fluoro": "F", "sodio": "Na", "magnesio": "Mg",
    "alluminio": "Al", "fosforo": "P", "zolfo": "S", "cloro": "Cl", "potassio": "K", "calcio": "Ca", "ferro": "Fe",
    "rame": "Cu", "zinco": "Zn", "bario": "Ba", "bromo": "Br", "iodio": "I", "cobalto": "Co",
}


def plain_formula(tex):
    """\\mathrm{Al_2(SO_4)_3} -> ('Al2(SO4)3', None); \\mathrm{SO_4^{2-}} -> ('SO4', -2); keeps ' . ' for hydrates."""
    m = re.fullmatch(r"\\mathrm\{(.*)\}", tex.strip())
    if not m:
        raise ValueError(f"not a formula: {tex!r}")
    s = m.group(1)
    charge = None
    mc = re.search(r"\^\{(\d*)([+-])\}$", s)
    if mc:
        charge = int(mc.group(1) or 1) * (1 if mc.group(2) == "+" else -1)
        s = s[: mc.start()]
    s = s.replace(" \\cdot ", ".")
    s = re.sub(r"_\{(\d+)\}", r"\1", s)
    s = re.sub(r"_(\d)", r"\1", s)
    if re.search(r"[^A-Za-z0-9().]", s):
        raise ValueError(f"unexpected character in {s!r}")
    return s, charge


def count(formula):
    """Atoms of a formula written plainly: 'Ca(OH)2' -> Counter({'O': 2, 'H': 2, 'Ca': 1}); '5H2O' after a dot."""
    total = Counter()
    for i, part in enumerate(formula.split(".")):
        k = 1
        if i:
            m = re.match(r"(\d+)(.*)", part)
            if m:
                k, part = int(m.group(1)), m.group(2)
        c, pos = _group(part, 0)
        if pos != len(part):
            raise ValueError(f"cannot read {formula!r}")
        for e, n in c.items():
            total[e] += k * n
    return total


def _group(s, pos):
    c = Counter()
    while pos < len(s):
        if s[pos] == "(":
            inner, pos = _group(s, pos + 1)
            if pos >= len(s) or s[pos] != ")":
                raise ValueError(f"unbalanced bracket in {s!r}")
            pos += 1
            n, pos = _number(s, pos)
            for e, k in inner.items():
                c[e] += k * n
        elif s[pos] == ")":
            return c, pos
        else:
            m = re.match(r"[A-Z][a-z]?", s[pos:])
            if not m:
                raise ValueError(f"cannot read {s!r} at {pos}")
            pos += len(m.group(0))
            n, pos = _number(s, pos)
            c[m.group(0)] += n
    return c, pos


def _number(s, pos):
    m = re.match(r"\d+", s[pos:])
    if not m:
        return 1, pos
    return int(m.group(0)), pos + len(m.group(0))


def formulas_in(text):
    """Every \\mathrm{...} formula in a text, with the coefficient in front if any: [(k, formula, charge)]."""
    out = []
    for m in re.finditer(r"\$(?:(\d+)\\,)?(\\mathrm\{(?:[^{}]|\{[^{}]*\})*\})\$", text):
        f, q = plain_formula(m.group(2))
        out.append((int(m.group(1)) if m.group(1) else 1, f, q))
    return out


def int_option(o):
    if not re.fullmatch(r"\d+", o["latex"]) or o["values"] != [o["latex"]]:
        raise ValueError(f"not a whole number: {o['latex']!r}")
    return int(o["latex"])
