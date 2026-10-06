"""Helpers for the checkers of the rotation of a rigid body (physics, third year, group 34: fis-cinematica-rotazionale,
fis-momento-inerzia, fis-dinamica-rotazionale), written from the specs and the lessons 86-88, not from
src/lib/exercises/v2/fis-rotazioni.ts.

Data are read as the lessons write them (decimal comma {,}, the unit after a thin space) and must have two significant
figures without ambiguous zeros; answers are rounded half up to two significant figures on exact values (round_sig of
_vettori) and refused near a rounding boundary; every option is a quantity with two significant figures in the answer's
unit. Units made of pieces are written with \\cdot between them and an exponent outside \\text: kg·m^2 is
\\text{kg}\\cdot\\text{m}^2, rad/s^2 is \\text{rad/s}^2.
"""
import re

from sympy import Rational, pi, sqrt

from checkers._vettori import check_choice, common, num, prose, round_sig, sig_of

__all__ = ["Q", "G", "data2", "answer", "prose", "common", "num", "Rational", "pi", "sqrt", "unit_tex"]

G = Rational(98, 10)


def _piece(u):
    return ("\\text{" + u[:-2] + "}^2") if u.endswith("^2") else ("\\text{" + u + "}")


def unit_tex(unit):
    """'kg·m^2' -> \\text{kg}\\cdot\\text{m}^2"""
    return "\\cdot".join(_piece(u) for u in unit.split("·"))


def unit_re(unit):
    return re.escape(unit_tex(unit))


def Q(unit):
    """A quantity inside $...$ in the prose: $4{,}5\\,\\text{rad/s}^2$ -> "4{,}5"."""
    return r"\$(\d+(?:\{,\}\d+)?)\\," + unit_re(unit) + r"\$"


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
    seen = set()
    for o in check_choice(sample, errs, right):
        m = re.fullmatch(r"(\d+(?:\{,\}\d+)?)\\," + unit_re(unit), o)
        if not m or sig_of(m.group(1)) != 2:
            errs.append(f"option {o!r} is not written like the answer")
        elif num(m.group(1)) in seen:
            errs.append(f"two options with the value {m.group(1)}")
        else:
            seen.add(num(m.group(1)))
    return want
