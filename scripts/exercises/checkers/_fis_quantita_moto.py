"""Helpers for the checkers of group 32 (physics, third year: fis-forze-conservative-energia, fis-bilancio-energia,
fis-quantita-moto-def, fis-impulso). Written from the specs and the lessons 78-81, not from
src/lib/exercises/v2/fis-quantita-moto.ts.

Quantities in a compound unit are written "3{,}5\\,\\text{N}\\cdot\\text{s}"; values read on a graph are exact decimals
written without useless zeros; a graph is the scene `grafico-spezzata`, whose corners are read back as exact rationals.
"""
import re

from sympy import Rational

from checkers._vettori import check_choice, fmt_exact, round_sig, sig_of

NUMRE = r"(-?\d+(?:\{,\}\d+)?)"
KGMS = r"\text{kg}\cdot\text{m/s}"
NS = r"\text{N}\cdot\text{s}"


def QU(unit_tex):
    """A quantity in the prose in a unit given in LaTeX, capturing the number."""
    return r"\$" + NUMRE + r"\\," + re.escape(unit_tex) + r"\$"


def answer_tex(sample, errs, truth, unit_tex, lo=None, hi=None):
    """The right option is truth rounded to two significant figures, in a unit written in LaTeX."""
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{truth} too close to a rounding boundary, or too large")
        return None
    if lo is not None and abs(truth) < lo:
        errs.append(f"answer {truth} under {lo}")
    if hi is not None and abs(truth) > hi:
        errs.append(f"answer {truth} over {hi}")
    for o in check_choice(sample, errs, want + r"\," + unit_tex):
        m = re.fullmatch(NUMRE + r"\\," + re.escape(unit_tex), o)
        if not m or (m.group(1) != "0" and sig_of(m.group(1)) != 2):
            errs.append(f"option {o!r} is not written like the answer")
    return want


def exact_answer(sample, errs, truth, unit, places=2):
    """The right option is an exact decimal (a value read on a graph, a sum of data), in a plain unit."""
    try:
        want = fmt_exact(Rational(truth))
    except ValueError:
        errs.append(f"{truth} is not a terminating decimal")
        return None
    if "{,}" in want and len(want.split("{,}")[1]) > places:
        errs.append(f"{want} has too many decimals")
    tail = r"\\,\\text\{" + re.escape(unit) + r"\}"
    for o in check_choice(sample, errs, f"{want}\\,\\text{{{unit}}}"):
        if not re.fullmatch(NUMRE + tail, o):
            errs.append(f"option {o!r} is not a quantity in {unit}")
    return want


def graph(sample, errs, key="scene"):
    """The corners of a `grafico-spezzata` scene as exact rationals, and its data."""
    sc = sample.get(key) or {}
    d = sc.get("data", {})
    if sc.get("type") != "grafico-spezzata":
        errs.append(f"{key}: not a grafico-spezzata")
        return [], d
    pts = [(Rational(str(p[0])), Rational(str(p[1]))) for p in d.get("punti", [])]
    if len(pts) < 2 or any(a[0] >= b[0] for a, b in zip(pts, pts[1:])):
        errs.append(f"{key}: corners not in increasing x")
    for ax in ("x", "y"):
        a = d.get(ax, {})
        hi = a.get("passo", 0) * a.get("celle", 0)
        if any(not 0 <= p[0 if ax == "x" else 1] <= hi for p in pts):
            errs.append(f"{key}: a corner is off the sheet")
    if not sc.get("alt"):
        errs.append(f"{key}: no alt")
    return pts, d


def value_at(pts, x):
    for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
        if xa <= x <= xb:
            return ya + (yb - ya) * (x - xa) / (xb - xa)
    raise ValueError(f"{x} outside the graph")


def area_under(pts):
    """The area between the graph and the x axis (trapezia)."""
    return sum((xb - xa) * (ya + yb) / 2 for (xa, ya), (xb, yb) in zip(pts, pts[1:]))


def exact_answer_tex(sample, errs, truth, unit_tex, places=2):
    """The right option is an exact decimal in a unit written in LaTeX (an area read on a graph)."""
    try:
        want = fmt_exact(Rational(truth))
    except ValueError:
        errs.append(f"{truth} is not a terminating decimal")
        return None
    if "{,}" in want and len(want.split("{,}")[1]) > places:
        errs.append(f"{want} has too many decimals")
    for o in check_choice(sample, errs, want + r"\," + unit_tex):
        if not re.fullmatch(NUMRE + r"\\," + re.escape(unit_tex), o):
            errs.append(f"option {o!r} is not a quantity in the unit of the answer")
    return want
