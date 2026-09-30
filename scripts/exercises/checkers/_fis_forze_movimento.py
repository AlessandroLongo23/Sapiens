"""Helpers for the checkers of "Le forze e il movimento" (physics, second year, group 16: fis-piano-inclinato,
fis-corpi-collegati, fis-moto-proiettili, fis-forza-centripeta, fis-pendolo-molla). Written from the specs and the
lessons 54-58, not from src/lib/exercises/v2/fis-forze-movimento.ts.

Quantities are read as the lessons write them ($4{,}9\\,\\text{m/s}^2$); values are exact (sympy), g = 49/5 m/s²;
answers are rounded half up to two significant figures and refused near a rounding boundary; every option must be
written like the answer, with the same unit and two significant figures.
"""
import re

from sympy import Rational, pi

from checkers._vettori import check_choice, num, round_sig, sig_of

G = Rational(49, 5)
UNITS = {"N": r"\\text\{N\}", "m/s": r"\\text\{m/s\}", "m/s2": r"\\text\{m/s\}\^2", "s": r"\\text\{s\}", "m": r"\\text\{m\}", "kg": r"\\text\{kg\}", "N/m": r"\\text\{N/m\}", "g": r"\\text\{g\}", "km/h": r"\\text\{km/h\}"}
TEX = {"N": r"\text{N}", "m/s": r"\text{m/s}", "m/s2": r"\text{m/s}^2", "s": r"\text{s}", "m": r"\text{m}", "kg": r"\text{kg}", "N/m": r"\text{N/m}", "g": r"\text{g}", "km/h": r"\text{km/h}"}
NUM = r"(\d+(?:\{,\}\d+)?)"


def q(unit):
    """The regex of a quantity in prose: $4{,}9\\,\\text{m/s}^2$, the number captured."""
    return r"\$" + NUM + r"\\," + UNITS[unit] + r"\$"


ANG = r"\$(\d+)\^\\circ\$"
MU = r"\$\\mu_([sd]) = (0\{,\}\d\d)\$"


def rad(d):
    return pi * Rational(d) / 180


def data2(errs, s, what, lo=None, hi=None):
    """A datum with two unambiguous significant figures, optionally inside [lo, hi]."""
    if sig_of(s) != 2 or re.fullmatch(r"\d0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    x = num(s)
    if lo is not None and not lo <= x <= hi:
        errs.append(f"{what} {s} outside [{lo}, {hi}]")
    return x


def answer(sample, errs, truth, unit, lo=Rational(1, 10), hi=99):
    """The right option is the truth rounded to two significant figures, with its unit; all options alike."""
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{truth.evalf(12)} too close to a rounding boundary, or too large")
        return
    if not lo <= truth <= hi:
        errs.append(f"answer {truth.evalf(6)} outside [{lo}, {hi}]")
    right = want + r"\," + TEX[unit]
    for o in check_choice(sample, errs, right):
        m = re.fullmatch(NUM + r"\\," + UNITS[unit], o)
        if not m or sig_of(m.group(1)) != 2:
            errs.append(f"option {o!r} is not written like the answer")


def answer_deg(sample, errs, deg):
    from checkers._vettori import round_deg

    want = round_deg(deg)
    if want is None:
        errs.append("angle too close to a half degree")
        return
    for o in check_choice(sample, errs, f"{want}^\\circ"):
        if not re.fullmatch(r"\d+\^\\circ", o):
            errs.append(f"option {o!r} is not an angle")


def fem(errs, body, *endings):
    """Adjectives agreeing with the body: Una cassa ... ferma, Uno scatolone ... fermo."""
    f = body.startswith("Una")
    if any((e == "a") != f for e in endings):
        errs.append("agreement")


BODY = r"(Una cassa|Uno scatolone|Un blocco di legno|Una valigia)"
