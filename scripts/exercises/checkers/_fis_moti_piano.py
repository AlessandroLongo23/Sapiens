"""Helpers for the checkers of the chapter "I moti nel piano" (physics, second year, group 14), written from the specs
and the lessons 45-49, not from src/lib/exercises/v2/fis-moti-piano.ts.

Data are read as the lessons write them (decimal comma {,}, the unit after a thin space) and must have two significant
figures without ambiguous zeros; answers are rounded half up with sympy's exact arithmetic (round_sig of _vettori) and
refused near a rounding boundary; every option is a quantity with two significant figures in the answer's unit.
"""
import re

from sympy import Rational, pi

from checkers._vettori import check_choice, common, num, prose, round_deg, round_sig, sig_of

__all__ = ["Q", "DEG", "rad", "data2", "answer", "answer_deg", "prose", "common", "num", "Rational", "pi", "round_sig", "round_deg"]


def unit_re(unit):
    """A unit as the lessons write it: \\text{m/s}, or \\text{m/s}^2 for "m/s^2"."""
    if unit.endswith("^2"):
        return r"\\text\{" + re.escape(unit[:-2]) + r"\}\^2"
    return r"\\text\{" + re.escape(unit) + r"\}"


def unit_tex(unit):
    return "\\text{" + unit[:-2] + "}^2" if unit.endswith("^2") else "\\text{" + unit + "}"


# A quantity inside $...$: $4{,}5\,\text{m/s}$ -> "4{,}5"
Q = lambda unit: r"\$(\d+(?:\{,\}\d+)?)\\," + unit_re(unit) + r"\$"
DEG = r"\$(\d+)\^\\circ\$"


def rad(d):
    return pi * Rational(d) / 180


def data2(errs, s, what, lo=None, hi=None):
    """A datum with two unambiguous significant figures, optionally inside [lo, hi]."""
    x = num(s)
    if sig_of(s) != 2 or re.fullmatch(r"\d+0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    if lo is not None and not Rational(str(lo)) <= x <= Rational(str(hi)):
        errs.append(f"{what} {s} outside {lo}-{hi}")
    return x


def answer(sample, errs, truth, unit):
    """The right option is truth rounded to two significant figures, with the unit; all options are written alike."""
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{truth.evalf(12)} too close to a rounding boundary, or 100 or more")
        return None
    right = f"{want}\\," + unit_tex(unit)
    for o in check_choice(sample, errs, right):
        m = re.fullmatch(r"(-?\d+(?:\{,\}\d+)?)\\," + unit_re(unit), o)
        if not m or sig_of(m.group(1)) != 2:
            errs.append(f"option {o!r} is not written like the answer")
    return want


def answer_deg(sample, errs, deg):
    want = round_deg(deg)
    if want is None:
        errs.append("angle too close to a half degree")
        return None
    for o in check_choice(sample, errs, f"{want}^\\circ"):
        if not re.fullmatch(r"\d+\^\\circ", o):
            errs.append(f"option {o!r} is not an angle")
    return want
