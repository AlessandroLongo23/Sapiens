"""Helpers for the checkers of the uniformly accelerated motion (group 13: moto_uniforme_accelerato,
fis_grafico_velocita_tempo, fis_caduta_libera). Written from the specs and the lessons 42-44, not from
src/lib/exercises/v2/fis-moto-accelerato.ts.

Quantities are read as the lessons write them ($12\\,\\text{m/s}$, $2{,}5\\,\\text{m/s}^2$, $72\\,\\text{km/h}$); values
are exact sympy Rationals; answers are rounded half up to two significant figures with _vettori.round_sig, which
refuses values near a boundary and values of 100 or more.
"""
import re

from sympy import Rational

from checkers._vettori import check_choice, num, round_sig, sig_of

NUM = r"(-?\d+(?:\{,\}\d+)?)"
Q = r"\$" + NUM + r"\\,\\text\{%s\}\$"
MS, M, S, KMH = Q % "m/s", Q % "m", Q % "s", Q % "km/h"
ACC = r"\$" + NUM + r"\\,\\text\{m/s\}\^2\$"
UNIT_TEX = {"m/s": r"\\,\\text\{m/s\}", "m": r"\\,\\text\{m\}", "s": r"\\,\\text\{s\}", "m/s^2": r"\\,\\text\{m/s\}\^2"}
UNIT_OUT = {"m/s": r"\,\text{m/s}", "m": r"\,\text{m}", "s": r"\,\text{s}", "m/s^2": r"\,\text{m/s}^2"}


def data2(errs, s, what, lo=None, hi=None):
    """A datum with two unambiguous significant figures, inside [lo, hi]."""
    if sig_of(s) != 2 or re.fullmatch(r"-?\d0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    x = num(s)
    if lo is not None and not Rational(lo) <= x <= Rational(hi):
        errs.append(f"{what} {s} outside {lo}-{hi}")
    return x


def answer2(sample, errs, truth, unit, positive=True):
    """The right option is truth rounded to two significant figures with the unit; every option is written the same way."""
    if positive and truth <= 0:
        errs.append(f"answer {truth} not positive")
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{float(truth)} too close to a rounding boundary, or too large")
        return None
    for o in check_choice(sample, errs, want + UNIT_OUT[unit]):
        m = re.fullmatch(NUM + UNIT_TEX[unit], o)
        if not m or sig_of(m.group(1)) != 2:
            errs.append(f"option {o!r} is not written like the answer")
    return want


def answer_exact(sample, errs, truth, unit):
    """The right option is the exact value (a reading of a graph), written without useless zeros."""
    from checkers._vettori import fmt_exact

    want = fmt_exact(truth)
    for o in check_choice(sample, errs, want + UNIT_OUT[unit]):
        if not re.fullmatch(NUM + UNIT_TEX[unit], o):
            errs.append(f"option {o!r} is not written like the answer")
    return want


def option_values(sample):
    return [o["latex"] for o in sample["answer"]["options"]]
