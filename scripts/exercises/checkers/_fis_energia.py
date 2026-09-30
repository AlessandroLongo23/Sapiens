"""Helpers for the checkers of the energy generators (physics, second year, group 18: fis-energia-potenziale, energia,
fis-energia-totale). Written from the specs and the lessons 62-64, not from src/lib/exercises/v2/fis-energia.ts.

g = 49/5 m/s^2 exactly; data with two significant figures and no ambiguous trailing zero (spring constants with three,
not ending in zero); answers rounded half up to two significant figures on exact values (sympy), refused within 1e-9
of a boundary; options written like the answer, with the unit.
"""
import re

from sympy import Rational

from checkers._vettori import check_choice, num, round_sig, sig_of

G = Rational(49, 5)
NUMRE = r"(-?\d+(?:\{,\}\d+)?)"


def Q(unit):
    """A quantity in the prose: $4{,}5\\,\\text{kg}$, capturing the number."""
    return r"\$" + NUMRE + r"\\,\\text\{" + re.escape(unit) + r"\}\$"


def data(errs, s, what, figures=2):
    if sig_of(s) != figures or (figures == 2 and re.fullmatch(r"-?\d0", s)) or (figures == 3 and s.endswith("0")):
        errs.append(f"{what} {s} has not {figures} unambiguous significant figures")
    return num(s)


def answer(sample, errs, truth, unit, lo=None, hi=None):
    """The right option is truth rounded to two significant figures, with the unit; every option is written alike."""
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{truth.evalf(12)} too close to a rounding boundary, or too large")
        return None
    if lo is not None and abs(truth) < lo:
        errs.append(f"answer {truth.evalf(6)} under {lo}")
    if hi is not None and abs(truth) > hi:
        errs.append(f"answer {truth.evalf(6)} over {hi}")
    tail = r"\\,\\text\{" + re.escape(unit) + r"\}" if unit else ""
    right = f"{want}\\,\\text{{{unit}}}" if unit else want
    for o in check_choice(sample, errs, right):
        m = re.fullmatch(NUMRE + tail, o)
        if not m or (m.group(1) != "0" and sig_of(m.group(1)) != 2):
            errs.append(f"option {o!r} is not written like the answer")
    return want


def percent_answer(sample, errs, truth_ratio):
    """A ratio as a whole percentage (two figures), options like '71\\%'."""
    x = truth_ratio * 100
    want = round_sig(x, 2)
    if want is None or "{,}" in want:
        errs.append(f"percentage {x.evalf(8)} not a clean two-figure integer")
        return None
    for o in check_choice(sample, errs, f"{want}\\%"):
        if not re.fullmatch(r"\d+\\%", o):
            errs.append(f"option {o!r} is not a percentage")
    return want
