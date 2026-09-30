"""Helpers for the checkers of the gas generators (chemistry, group 26: chim-teoria-cinetica, chim-pressione-gas,
chim-legge-boyle, chim-legge-charles-gay-lussac, chim-equazione-generale-gas, chim-principio-avogadro), written from
the specs and the lessons 29-34, not from src/lib/exercises/v2/chim-gas.ts.

Quantities are read as the lessons write them: decimal comma {,}, scientific notation "1{,}7 \\cdot 10^{5}", a minus
sign for temperatures below zero, the unit after a thin space. Values are exact (sympy Rational); a result is rounded
half up to n significant figures (the physics helpers' `rounded`, checkers/_fis_calore.py) and compared with the
option marked correct.
"""
import re

from sympy import Rational, sqrt

from checkers._fis_calore import rounded
from checkers._vettori import BANNED, prose

UNITS = {
    "atm": r"\text{atm}",
    "kPa": r"\text{kPa}",
    "mmHg": r"\text{mmHg}",
    "bar": r"\text{bar}",
    "Pa": r"\text{Pa}",
    "N": r"\text{N}",
    "L": r"\text{L}",
    "mL": r"\text{mL}",
    "m3": r"\text{m}^3",
    "cm3": r"\text{cm}^3",
    "cm2": r"\text{cm}^2",
    "K": r"\text{K}",
    "C": r"^\circ\text{C}",
    "ms": r"\text{m/s}",
    "g": r"\text{g}",
    "pct": r"\%",
}

# Relative atomic masses of lesson 01 (and He, Ar, F, which the texts write).
MASS = {"H": Rational("1.01"), "He": Rational("4.00"), "C": Rational("12.01"), "N": Rational("14.01"), "O": Rational("16.00"),
        "F": Rational("19.00"), "S": Rational("32.07"), "Cl": Rational("35.45"), "Ar": Rational("39.95")}

NUMBER = r"-?\d+(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?"


def unit_re(u):
    return re.escape(r"\," + UNITS[u])


def quantity(u):
    """A regex for a quantity in prose, $<number>\\,<unit>$, the number captured."""
    return r"\$(" + NUMBER + ")" + unit_re(u) + r"\$"


def value(s):
    """The exact value of a number as written: "4{,}5", "-18", "3{,}8 \\cdot 10^{2}"."""
    m = re.fullmatch(r"(-?\d+(?:\{,\}\d+)?)(?: \\cdot 10\^\{(-?\d+)\})?", s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    r = Rational(m.group(1).replace("{,}", "."))
    return r * Rational(10) ** int(m.group(2)) if m.group(2) else r


def sig_of(s):
    """Significant figures of a datum as written ("0{,}150" has 3, "4{,}5" 2)."""
    return len(s.replace("{,}", "").replace("-", "").lstrip("0"))


def formula_mass(f):
    """Relative molecular mass of a formula like "CO_2", "NH_3", "H_2O" (no brackets)."""
    total = Rational(0)
    for el, n in re.findall(r"([A-Z][a-z]?)(?:_\{?(\d+)\}?)?", f):
        total += MASS[el] * (int(n) if n else 1)
    return total


def options(sample, errs):
    """The four options: distinct text, distinct values, a valid index. Returns (latex list, correct index)."""
    a = sample["answer"]
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return [], None
    opts = [o["latex"] for o in a["options"]]
    if len(opts) != 4 or len(set(opts)) != 4:
        errs.append(f"need four distinct options: {opts}")
    vals = [o["values"][0] for o in a["options"]]
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct index out of range")
        return opts, None
    return opts, c


def answer(sample, errs, truth, n, u):
    """The correct option must be `truth` rounded to n significant figures, with the unit u; every option a quantity in u."""
    want = rounded(truth, n)
    if want is None:
        errs.append(f"{truth} too close to a rounding boundary")
        return None
    if re.fullmatch(r"\d*0", want):
        errs.append(f"{want} ends with an ambiguous zero")
    opts, c = options(sample, errs)
    if c is None:
        return want
    right = want + ("" if u == "n" else r"\," + UNITS[u])
    if opts[c] != right:
        errs.append(f"correct option {opts[c]!r} != expected {right!r}")
    vals = []
    for o in opts:
        m = re.fullmatch("(" + NUMBER + ")" + ("" if u == "n" else unit_re(u)), o)
        if not m:
            errs.append(f"option {o!r} is not a quantity in {u}")
            continue
        vals.append(value(m.group(1)))
    if len(set(vals)) != len(vals):
        errs.append("two options with the same number")
    return want


def answer_int(sample, errs, truth, u):
    """The correct option is the whole number `truth` (maybe negative) with the unit u."""
    if Rational(truth).q != 1:
        errs.append(f"{truth} is not a whole number")
        return
    opts, c = options(sample, errs)
    if c is None:
        return
    right = str(int(truth)) + r"\," + UNITS[u]
    if opts[c] != right:
        errs.append(f"correct option {opts[c]!r} != expected {right!r}")
    for o in opts:
        if not re.fullmatch(r"-?\d+" + unit_re(u), o):
            errs.append(f"option {o!r} is not a whole number in {u}")


def answer_label(sample, errs, want):
    """The correct option's value is the label `want`."""
    opts, c = options(sample, errs)
    if c is None:
        return
    got = sample["answer"]["options"][c]["values"][0]
    if got != want:
        errs.append(f"correct option value {got!r} != expected {want!r}")


def common(sample, errs):
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")


def text(sample):
    return prose(sample["problem"])


__all__ = ["UNITS", "MASS", "NUMBER", "quantity", "value", "sig_of", "formula_mass", "options", "answer", "answer_int",
           "answer_label", "common", "text", "rounded", "Rational", "sqrt", "re"]
