"""Helpers for the checkers of group 42 (physics, third year: fis-calori-molari, fis-trasformazione-adiabatica),
written from the specs and the lessons 112 and 113, not from src/lib/exercises/v2/fis-calori-adiabatica.ts.

Quantities are read as the lessons write them: decimal comma {,}, scientific notation "1{,}35 \\cdot 10^{3}", the unit
after a thin space. Values are exact (sympy Rational, and exact powers for the adiabat); a result is rounded half up to
n significant figures and written plain below 10^n (and from 0,001), otherwise in scientific notation; a value within
1e-9 of a tie is refused. The rounding and the reading of a number are those of _fis_calore.py, used as they are.
"""
import re

from sympy import Rational

from checkers._fis_calore import NUMBER, rounded, value  # noqa: F401 - rounded and value are re-exported
from checkers._vettori import BANNED, prose

R = Rational(831, 100)

# name: (degrees of freedom, molar mass in g/mol as written)
GASES = {
    "elio": (3, "4{,}00"),
    "neon": (3, "20{,}2"),
    "argon": (3, "39{,}9"),
    "azoto": (5, "28{,}0"),
    "ossigeno": (5, "32{,}0"),
    "idrogeno": (5, "2{,}02"),
}
GAS = "(" + "|".join(GASES) + ")"
KIND = "(monoatomico|biatomico)"

UNITS = {
    "K": r"\text{K}",
    "C": r"^\circ\text{C}",
    "J": r"\text{J}",
    "mol": r"\text{mol}",
    "g": r"\text{g}",
    "gmol": r"\text{g/mol}",
    "L": r"\text{L}",
    "atm": r"\text{atm}",
    "Pa": r"\text{Pa}",
}
R_TEXT = r" Usa \$R = 8\{,\}31\\,\\text\{J/\(mol\}\\cdot\\text\{K\)\}\$\."


def unit_re(u):
    return re.escape(r"\," + UNITS[u])


def quantity(u):
    """A regex for a quantity in prose: $<number>\\,<unit>$, the number captured."""
    return r"\$(" + NUMBER + ")" + unit_re(u) + r"\$"


def gas_kind(name, kind, errs):
    """The degrees of freedom of the gas, checked against what the text calls it."""
    l = GASES[name][0]
    if kind != ("monoatomico" if l == 3 else "biatomico"):
        errs.append(f"{name} is not {kind}")
    return l


def cv(l):
    return Rational(l, 2) * R


def cp(l):
    return Rational(l + 2, 2) * R


def gamma(l):
    return Rational(l + 2, l)


def signed(x, n):
    """x rounded to n significant figures with its sign, as written, or None near a tie or at zero."""
    if x == 0:
        return None
    r = rounded(abs(x), n)
    if r is None:
        return None
    return ("-" if x < 0 else "") + r


def number(s):
    """The exact value of a number as written, with an optional minus sign."""
    return -value(s[1:]) if s.startswith("-") else value(s)


def ambiguous(s):
    """A whole number ending in zero, without a comma or a power of ten: 150, 680."""
    return re.fullmatch(r"-?\d*0", s) is not None


def check_options(sample, errs, right, u):
    """Four distinct options with the unit u; the correct one is `right` (a number as written, with its sign)."""
    a = sample["answer"]
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    opts = [o["latex"] for o in a["options"]]
    if len(opts) != 4 or len(set(opts)) != 4:
        errs.append(f"need four distinct options: {opts}")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct index out of range")
        return
    want = right + r"\," + UNITS[u]
    if opts[c] != want:
        errs.append(f"correct option {opts[c]!r} != expected {want!r}")
    vals = []
    for o in opts:
        m = re.fullmatch("(-?" + NUMBER + ")" + unit_re(u), o)
        if not m:
            errs.append(f"option {o!r} is not a quantity in {u}")
            continue
        vals.append(number(m.group(1)))
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")


def answer(sample, errs, truth, n, u, plain_zero=True):
    """The correct option must be `truth` rounded to n figures; a whole result ending in zero is refused."""
    want = signed(truth, n)
    if want is None:
        errs.append(f"{truth} too close to a rounding boundary")
        return None
    if plain_zero and ambiguous(want):
        errs.append(f"result {want} ends with an ambiguous zero")
    check_options(sample, errs, want, u)
    if sample.get("solution", "").count(want + r"\," + UNITS[u]) != 1:
        errs.append("the solution does not show the answer")
    return want


def common(sample, errs):
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")


def text(sample):
    return prose(sample["problem"])


def three(s, errs, what):
    """A datum with three significant figures, as written."""
    if len(s.replace("{,}", "").lstrip("0")) != 3:
        errs.append(f"{what} {s} has not three significant figures")
    return value(s)


def whole(s, lo, hi, errs, what):
    if not re.fullmatch(r"\d+", s):
        errs.append(f"{what} {s} is not a whole number")
        return value(s)
    x = value(s)
    if not lo <= x <= hi:
        errs.append(f"{what} {s} outside {lo}-{hi}")
    return x


def comma(x):
    """A number of a scene's label: decimal comma, as the generators write it there."""
    return x.replace("{,}", ",")
