"""Helpers for the checkers of group 35 (physics, third year: fis-energia-rotazionale, fis-momento-angolare-def,
fis-conservazione-momento-angolare). Written from the specs and the lessons 89-91, not from
src/lib/exercises/v2/fis-momento-angolare.ts.

g = 49/5 m/s^2 exactly. Data have two significant figures and no ambiguous trailing zero. The round bodies have
I = c m r^2 with c = 1 (ring), 1/2 (solid cylinder), 2/5 (solid sphere), 2/3 (hollow sphere). Answers are rounded
half up to two significant figures on exact values and never end with an ambiguous zero (20, 90); options are written
like the answer, with the unit, and the unit may be a product (kg·m², kg·m²/s, N·m, m/s²).
"""
import re

from sympy import Rational

from checkers._vettori import check_choice, num, round_sig, sig_of

G = Rational(49, 5)
NUMRE = r"(-?\d+(?:\{,\}\d+)?)"
UNIT_TEX = {
    "kg·m²": r"\text{kg}\cdot\text{m}^2",
    "kg·m²/s": r"\text{kg}\cdot\text{m}^2/\text{s}",
    "N·m": r"\text{N}\cdot\text{m}",
    "m/s²": r"\text{m/s}^2",
}
SHAPES = {
    "un anello sottile": ("anello", Rational(1)),
    "un cilindro pieno": ("cilindro", Rational(1, 2)),
    "una sfera piena": ("sfera", Rational(2, 5)),
    "una sfera cava sottile": ("sfera-cava", Rational(2, 3)),
}
SHAPE_RE = "(" + "|".join(SHAPES) + ")"


def unit_tex(unit):
    return UNIT_TEX.get(unit, r"\text{" + unit + "}")


def Q(unit):
    """A quantity in the prose, between dollars, capturing the number."""
    return r"\$" + NUMRE + r"\\," + re.escape(unit_tex(unit)) + r"\$"


def data(errs, s, what, figures=2):
    """A datum as written: `figures` significant figures, no ambiguous trailing zero."""
    if sig_of(s) != figures or re.fullmatch(r"\d*0", s):
        errs.append(f"{what} {s} has not {figures} unambiguous significant figures")
    return num(s)


def shape(text):
    """The body named in the prose (any case of the first letter): (scene key, c)."""
    return SHAPES[text[0].lower() + text[1:]]


def answer(sample, errs, truth, unit, lo=None, hi=None):
    """The right option is `truth` to two significant figures with the unit; every option is written alike."""
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{truth.evalf(12)} too close to a rounding boundary, or 100 and over")
        return None
    if re.fullmatch(r"\d0", want):
        errs.append(f"answer {want} ends with an ambiguous zero")
    if lo is not None and truth < lo:
        errs.append(f"answer {truth.evalf(6)} under {lo}")
    if hi is not None and truth > hi:
        errs.append(f"answer {truth.evalf(6)} over {hi}")
    tail = r"\\," + re.escape(unit_tex(unit))
    for o in check_choice(sample, errs, f"{want}\\,{unit_tex(unit)}"):
        m = re.fullmatch(NUMRE + tail, o)
        if not m or sig_of(m.group(1)) != 2 or re.fullmatch(r"\d0", m.group(1)):
            errs.append(f"option {o!r} is not written like the answer")
    return want


def comma(s):
    """A number of the prose as a drawing writes it: 0{,}85 -> 0,85."""
    return s.replace("{,}", ",")


def params_match(sample, errs, **want):
    """The data read from the text are the ones the sample carries in `params` (numbers as decimal strings)."""
    got = sample.get("params", {})
    for name, value in want.items():
        have = got.get(name)
        same = have == value if isinstance(value, str) else have is not None and Rational(str(have)) == value
        if not same:
            errs.append(f"params.{name} = {have!r} does not match the text ({value})")
