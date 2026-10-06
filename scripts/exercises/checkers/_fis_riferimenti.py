"""Helpers for the checkers of the chapter "La dinamica e la relatività galileiana" (physics, third year, group 31),
written from the specs and the lessons 72-75, not from src/lib/exercises/v2/fis-riferimenti.ts.

Data are read as the lessons write them (decimal comma {,}, the unit after a thin space, a squared unit with the
exponent outside the text). Answers with two significant figures are rounded half up on exact values (sympy), refused
near a rounding boundary and refused when they would end with an ambiguous zero (40); exact answers are written as
decimals without useless zeros; word answers are checked on the key of the right option.
"""
import re

from sympy import Rational, pi

from checkers._fis_moti_piano import DEG, Q, answer as _answer2, answer_deg, data2, unit_re, unit_tex
from checkers._vettori import check_choice, common, fmt_exact, num, prose, round_sig, sig_of

__all__ = ["Q", "DEG", "QN", "G", "pi", "Rational", "re", "answer2", "answer_deg", "answer_exact", "answer_num", "answer_word", "data2", "datum", "common", "prose", "num", "no_scene", "sig_of"]

G = Rational(49, 5)

# A quantity that may be negative inside $...$: $-3{,}0\,\text{m/s}$ -> "-3{,}0"
QN = lambda unit: r"\$(-?\d+(?:\{,\}\d+)?)\\," + unit_re(unit) + r"\$"


def datum(errs, s, what, lo, hi):
    """A datum inside [lo, hi], with any number of figures."""
    x = num(s)
    if not Rational(str(lo)) <= abs(x) <= Rational(str(hi)):
        errs.append(f"{what} {s} outside {lo}-{hi}")
    return x


def answer2(sample, errs, truth, unit):
    """Two significant figures, with the unit, never ending with an ambiguous zero."""
    want = _answer2(sample, errs, truth, unit)
    if want is not None and re.fullmatch(r"[1-9]0", want):
        errs.append(f"the answer {want} ends with an ambiguous zero")
    for o in sample["answer"].get("options", []):
        m = re.fullmatch(r"(\d+(?:\{,\}\d+)?)\\,.*", o["latex"])
        if m and re.fullmatch(r"[1-9]0", m.group(1)):
            errs.append(f"option {o['latex']!r} ends with an ambiguous zero")
    return want


def answer_num(sample, errs, truth):
    """A pure number with two significant figures (a coefficient)."""
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{truth} too close to a rounding boundary")
        return
    for o in check_choice(sample, errs, want):
        if not re.fullmatch(r"\d+(?:\{,\}\d+)?", o) or sig_of(o) != 2:
            errs.append(f"option {o!r} is not a number with two significant figures")


def answer_exact(sample, errs, truth, unit):
    """An exact terminating decimal with the unit; every option is a positive quantity in the same unit."""
    truth = Rational(truth)
    right = f"{fmt_exact(truth)}\\," + unit_tex(unit)
    for o in check_choice(sample, errs, right):
        if not re.fullmatch(r"\d+(?:\{,\}\d+)?\\," + unit_re(unit), o):
            errs.append(f"option {o!r} is not written like the answer")
    if truth == int(truth) and int(truth) % 10 == 0:
        errs.append(f"the answer {truth} ends with an ambiguous zero")


def answer_word(sample, errs, key, allowed):
    """Word options: four of them, keys among `allowed`, and the right one has the key expected."""
    a = sample["answer"]
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    opts = a["options"]
    keys = [o["values"][0] for o in opts]
    if len(opts) != 4 or len(set(keys)) != 4 or len({o["latex"] for o in opts}) != 4:
        errs.append(f"need four distinct options: {keys}")
    for o in opts:
        if o["values"][0] not in allowed:
            errs.append(f"unknown option {o['values'][0]!r}")
        elif o["latex"] != "\\text{" + allowed[o["values"][0]] + "}":
            errs.append(f"option {o['values'][0]!r} has the wrong text {o['latex']!r}")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct index out of range")
    elif keys[c] != key:
        errs.append(f"correct option {keys[c]!r} != expected {key!r}")


def no_scene(sample, errs):
    if sample.get("scene") or sample.get("solutionScene"):
        errs.append("unexpected scene")
