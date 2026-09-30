"""Helpers for the checkers of the chapter on the mole (chemistry, second year, group 27: chim-formula-minima,
chim-volume-molare, gas-ideali, chim-pressioni-parziali), written from the specs and the lessons 35-38, not from
src/lib/exercises/v2/chim-mole.ts.

Atomic masses: the table of lesson 01 (docs/lezioni/chimica/riscritte/01-mole-massa-molare.md), copied here as exact
rationals. Constants of the chemistry README ("Il biennio"): V_m = 22,4 L/mol, R = 0,0821 L·atm/(mol·K) and
8,31 J/(mol·K), N_A = 6,02 · 10^23, T = t + 273, 1 atm = 760 mmHg.

Quantities are read as the lessons write them: decimal comma {,}, scientific notation "2{,}69 \\cdot 10^{22}", the unit
after a thin space. A result is rounded half up to n significant figures and written plain when 0,01 <= x < 10^n,
otherwise in scientific notation; a value within 1e-9 of a tie is refused.
"""
import re
from math import gcd

from sympy import Rational, floor, log

from checkers._vettori import BANNED, prose

A = {
    "H": Rational("1.01"), "C": Rational("12.01"), "N": Rational("14.01"), "O": Rational("16.00"),
    "Na": Rational("22.99"), "Mg": Rational("24.31"), "P": Rational("30.97"), "S": Rational("32.07"),
    "Cl": Rational("35.45"), "K": Rational("39.10"), "Ca": Rational("40.08"), "Fe": Rational("55.85"),
}
NAMES = {"idrogeno": "H", "carbonio": "C", "azoto": "N", "ossigeno": "O", "sodio": "Na", "magnesio": "Mg",
         "fosforo": "P", "zolfo": "S", "cloro": "Cl", "potassio": "K", "calcio": "Ca", "ferro": "Fe"}
VM = Rational("22.4")
R_ATM = Rational("0.0821")
R_SI = Rational("8.31")
NA = Rational("6.02") * 10**23

UNITS = {
    "g": r"\text{g}", "gmol": r"\text{g/mol}", "mol": r"\text{mol}", "L": r"\text{L}", "mL": r"\text{mL}",
    "atm": r"\text{atm}", "kPa": r"\text{kPa}", "mmHg": r"\text{mmHg}", "K": r"\text{K}", "C": r"^\circ\text{C}",
    "gL": r"\text{g/L}", "pct": r"\%", "molecole": r"\text{molecole}", "atomi": r"\text{atomi}",
}
NUMBER = r"\d+(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?"


def unit_re(u):
    return re.escape(r"\," + UNITS[u])


def quantity(u):
    """A regex for a quantity in prose: $<number>\\,<unit>$, the number captured."""
    return r"\$(" + NUMBER + ")" + unit_re(u) + r"\$"


def value(s):
    m = re.fullmatch(r"(\d+(?:\{,\}\d+)?)(?: \\cdot 10\^\{(-?\d+)\})?", s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    r = Rational(m.group(1).replace("{,}", "."))
    return r * Rational(10) ** int(m.group(2)) if m.group(2) else r


def sig_of(s):
    """Significant figures of a plain datum as written ("0{,}761" 3, "5{,}60" 3, "22{,}4" 3)."""
    return len(s.replace("{,}", "").lstrip("0"))


def rounded(x, n):
    x = Rational(x)
    if x <= 0:
        return None
    e = int(floor(log(x, 10).evalf(60)))
    if Rational(10) ** e > x:
        e -= 1
    if Rational(10) ** (e + 1) <= x:
        e += 1
    y = x / Rational(10) ** (e - n + 1)
    fl = int(floor(y.evalf(60)))
    frac = (y - fl).evalf(60)
    if abs(frac - Rational(1, 2)) < Rational(1, 10**9):
        return None
    m = fl + 1 if frac > Rational(1, 2) else fl
    if m >= 10**n:
        m //= 10
        e += 1
    digits = str(m)
    if -2 <= e < n:
        k = n - 1 - e
        if k == 0:
            return digits
        s = digits.rjust(k + 1, "0")
        return s[: len(s) - k] + "{,}" + s[len(s) - k:]
    mant = digits[0] + ("{,}" + digits[1:] if n > 1 else "")
    return f"{mant} \\cdot 10^{{{e}}}"


def check_options(sample, errs, right, u):
    a = sample["answer"]
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return []
    opts = [o["latex"] for o in a["options"]]
    if len(opts) != 4 or len(set(opts)) != 4:
        errs.append(f"need four distinct options: {opts}")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct index out of range")
        return opts
    want = right + r"\," + UNITS[u]
    if opts[c] != want:
        errs.append(f"correct option {opts[c]!r} != expected {want!r}")
    vals = []
    for o in opts:
        m = re.fullmatch("(" + NUMBER + ")" + unit_re(u), o)
        if not m:
            errs.append(f"option {o!r} is not a quantity in {u}")
            continue
        vals.append(value(m.group(1)))
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")
    return opts


def answer(sample, errs, truth, n, u):
    want = rounded(truth, n)
    if want is None:
        errs.append(f"{truth} too close to a rounding boundary")
        return None
    check_options(sample, errs, want, u)
    return want


# ---------------------------------------------------------------- formulas

def parse_tex_formula(s):
    """\\mathrm{C_6H_{12}O_6} → [("C", 6), ("H", 12), ("O", 6)]."""
    m = re.fullmatch(r"\\mathrm\{(.*)\}", s.strip())
    if not m:
        raise ValueError(f"not a formula: {s!r}")
    body = m.group(1)
    out = []
    for el, sub1, sub2 in re.findall(r"([A-Z][a-z]?)(?:_(\d)|_\{(\d+)\})?", body):
        k = int(sub1 or sub2 or 1)
        if el not in A:
            raise ValueError(f"unknown element {el}")
        out.append((el, k))
    rebuilt = "".join(e + ("" if k == 1 else (f"_{k}" if k < 10 else f"_{{{k}}}")) for e, k in out)
    if rebuilt != body:
        raise ValueError(f"formula not written canonically: {body!r}")
    return out


def molar(f):
    return sum(A[e] * k for e, k in f)


def reduce_formula(f):
    g = 0
    for _, k in f:
        g = gcd(g, k)
    return [(e, k // g) for e, k in f], g


def formula_options(sample, errs):
    a = sample["answer"]
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return [], None
    fs = []
    for o in a["options"]:
        try:
            fs.append(parse_tex_formula(o["latex"]))
        except ValueError as e:
            errs.append(str(e))
    if len(fs) != 4 or len({tuple(f) for f in fs}) != 4:
        errs.append("need four distinct formulas")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(fs):
        errs.append("correct index out of range")
        return fs, None
    return fs, fs[c]


def common(sample, errs):
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")


def text(sample):
    return prose(sample["problem"])
