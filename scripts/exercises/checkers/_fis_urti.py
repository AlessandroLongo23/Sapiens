"""Helpers for the checkers of collisions and centre of mass (physics, third year, group 33:
fis-conservazione-quantita-moto, fis-urti-anelastici, fis-urti-elastici, fis-centro-massa). Written from the specs and
the lessons 82-85, not from src/lib/exercises/v2/fis-urti.ts.

g = 49/5 m/s^2 exactly. Data have two significant figures and no ambiguous trailing zero. Answers are exact values
(sympy) rounded half up to two significant figures, refused within 1e-9 of a boundary, never a whole number of tens
("40"); from 100 up they are written in scientific notation, like the lessons. Every option is written like the answer.
"""
import re

from sympy import Rational

from checkers import _fis_energia as E
from checkers import _fis_lavoro as L
from checkers._vettori import round_sig, sig_of

G = Rational(49, 5)
NUMRE = E.NUMRE
Q = E.Q


def SCI(unit):
    """A quantity in the prose written in scientific notation: $6{,}1 \\cdot 10^2\\,\\text{m/s}$, capturing the mantissa
    and the exponent."""
    return r"\$(\d\{,\}\d) \\cdot 10\^(\d)\\,\\text\{" + re.escape(unit) + r"\}\$"


def data(errs, s, what, figures=2):
    """A datum as the problem writes it, with `figures` significant figures and no trailing zero in doubt."""
    if sig_of(s) != figures or ("{,}" not in s and s.endswith("0")):
        errs.append(f"{what} {s} has not {figures} unambiguous significant figures")
    return Rational(s.replace("{,}", "."))


def sci(errs, mant, exp, what):
    if not re.fullmatch(r"[1-9]\{,\}[1-9]", mant):
        errs.append(f"{what}: mantissa {mant} not of two clean figures")
    return Rational(mant.replace("{,}", ".")) * 10 ** int(exp)


def answer(sample, errs, truth, unit):
    """The right option is truth rounded to two significant figures (it may be negative), with the unit."""
    want = E.answer(sample, errs, truth, unit)
    if want is not None and re.fullmatch(r"-?[1-9]0", want):
        errs.append(f"answer {want} is a whole number of tens")
    for o in sample["answer"]["options"]:
        if re.fullmatch(r"-?[1-9]0\\,\\text\{.*\}", o["latex"]):
            errs.append(f"option {o['latex']!r} is a whole number of tens")
    return want


def answer_sci(sample, errs, truth, unit):
    """The same for answers that may reach the hundreds (scientific notation from 100 up); under 100 no option is a
    whole number of tens."""
    L.answer(sample, errs, truth, unit)
    for o in sample["answer"]["options"]:
        if re.fullmatch(r"-?[1-9]0\\,\\text\{.*\}", o["latex"]):
            errs.append(f"option {o['latex']!r} is a whole number of tens")


def in_range(errs, x, lo, hi, what):
    if not Rational(str(lo)) <= x <= Rational(str(hi)):
        errs.append(f"{what} {x} out of range [{lo}, {hi}]")


def scene_cross(sample, errs, v1, v2, l1, l2):
    """The scene of two perpendicular velocities: the first along x, the second along y, in proportion, the longer
    one 4 units long, each with its label; nothing else."""
    sc = sample.get("scene") or {}
    if sc.get("type") != "vettori-piano":
        errs.append("no vector scene")
        return
    vs = sc["data"].get("vettori", [])
    if len(vs) != 2:
        errs.append("the scene must show the two given velocities only")
        return
    k = 4 / max(v1, v2)
    a, b = vs
    ok = (
        a["da"] == [0, 0] and b["da"] == [0, 0]
        and abs(Rational(str(a["a"][0])) - v1 * k) < Rational(1, 500) and a["a"][1] == 0
        and abs(Rational(str(b["a"][1])) - v2 * k) < Rational(1, 500) and b["a"][0] == 0
        and a.get("etichetta") == l1 and b.get("etichetta") == l2
    )
    if not ok:
        errs.append("the scene does not match the data")


def round2(x):
    return round_sig(x, 2)
