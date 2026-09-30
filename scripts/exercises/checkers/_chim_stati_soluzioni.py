"""Helpers for the checkers of chemistry group 22 (chim-stati-aggregazione, chim-modello-particellare,
chim-sostanze-miscugli, chim-soluzioni-percentuale), written from the specs and the lessons 14-17, not from
src/lib/exercises/v2/chim-materia.ts.

Problems are prose lines (\\text{...} stacked in an array, with $...$ formulas) and sometimes a table; options are
plain text (\\text{...} or a gathered of \\text{...} lines) or quantities "183\\,\\text{mL}", "26{,}5\\%". Values are
exact (sympy Rational); results are rounded half up to n significant figures as the lessons write them (rounded() of
the heat checkers, which follows the same rule).
"""
import re

from sympy import Rational

from checkers._fis_calore import rounded
from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

__all__ = ["check_choice", "common", "option_text", "prose_and_extra", "rounded", "num", "qty", "texts", "setup", "right_text"]

NUM = r"-?\d+(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?"
UNITS = {r"\text{mL}": "mL", r"\text{L}": "L", r"\text{g}": "g", r"\text{K}": "K", r"^\circ\text{C}": "C", r"\%": "%"}


def num(s):
    """The exact value of a number as written: "-114", "4{,}5", "1{,}7 \\cdot 10^{3}"."""
    m = re.fullmatch(r"(-?\d+(?:\{,\}\d+)?)(?: \\cdot 10\^\{(-?\d+)\})?", s.strip())
    if not m:
        raise ValueError(f"not a number: {s!r}")
    r = Rational(m.group(1).replace("{,}", "."))
    return r * Rational(10) ** int(m.group(2)) if m.group(2) else r


def qty(latex):
    """A quantity option: (written number, unit) from "183\\,\\text{mL}" or "26{,}5\\%"."""
    s = latex.strip()
    if s.endswith(r"\%"):
        return s[:-2], "%"
    m = re.fullmatch(r"(" + NUM + r")\\,(\\text\{[^}]*\}|\^\\circ\\text\{C\})", s)
    if not m or m.group(2) not in UNITS:
        raise ValueError(f"not a quantity: {latex!r}")
    return m.group(1), UNITS[m.group(2)]


def texts(sample):
    return [option_text(o["latex"]) for o in sample["answer"]["options"]]


def setup(sample):
    """(errors, prose, extra lines) with the common checks done."""
    errs = []
    common(sample, errs)
    prose, extra = prose_and_extra(sample["problem"])
    return errs, prose, extra


def right_text(sample, errs, want):
    """The option whose text is `want` must be the only one with that text and the one marked correct."""
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)


def right_qty(sample, errs, want, unit):
    """The correct option is the number `want` (as written) with `unit`, and the four options are distinct."""
    opts = sample["answer"]["options"]
    parsed = []
    for o in opts:
        try:
            parsed.append(qty(o["latex"]))
        except ValueError as e:
            errs.append(str(e))
            return
    keys = [(num(n), u) for n, u in parsed]
    if len(set(keys)) != 4:
        errs.append(f"options not distinct: {parsed}")
    check_choice(sample["answer"], lambda o: qty(o["latex"]) == (want, unit), errs)
