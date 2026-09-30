"""Helpers for the checkers of the heat generators (group 20: fis-equilibrio-termico, fis-propagazione-calore,
fis-passaggi-stato), written from the specs and the lessons 68-70, not from src/lib/exercises/v2/fis-calore.ts.

Quantities are read as the lessons write them: decimal comma {,}, scientific notation "1{,}7 \\cdot 10^{5}", the unit
after a thin space (\\,^\\circ\\text{C}, \\,\\text{kJ}, \\,\\text{J/(kg}\\cdot{}^\\circ\\text{C)}). Values are exact
(sympy Rational); a result is rounded half up to n significant figures and written plain when it is below 10^n (and at
least 0,001), otherwise in scientific notation; a value within 1e-9 of a tie is refused.
"""
import re

from sympy import Rational, floor, log

from checkers._vettori import BANNED, prose

UNITS = {
    "C": r"^\circ\text{C}",
    "J": r"\text{J}",
    "kJ": r"\text{kJ}",
    "g": r"\text{g}",
    "kg": r"\text{kg}",
    "W": r"\text{W}",
    "m": r"\text{m}",
    "cm": r"\text{cm}",
    "mm": r"\text{mm}",
    "m2": r"\text{m}^2",
    "cJ": r"\text{J/(kg}\cdot{}^\circ\text{C)}",
    "Jkg": r"\text{J/kg}",
    "lam": r"\text{W/(m}\cdot\text{K)}",
    "h": r"\text{h}",
    "min": r"\text{min}",
}

C_WATER = Rational(4186)
C_ICE = Rational(2100)
C_STEAM = Rational(2000)
LF = Rational(334000)
LV = Rational(2260000)

NUMBER = r"\d+(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?"


def unit_re(u):
    return re.escape(r"\," + UNITS[u])


def quantity(u):
    """A regex for a quantity in prose: $<number>\\,<unit>$, the number captured."""
    return r"\$(" + NUMBER + ")" + unit_re(u) + r"\$"


def value(s):
    """The exact value of a number as written: "4{,}5", "3{,}8 \\cdot 10^{2}"."""
    m = re.fullmatch(r"(\d+(?:\{,\}\d+)?)(?: \\cdot 10\^\{(-?\d+)\})?", s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    r = Rational(m.group(1).replace("{,}", "."))
    return r * Rational(10) ** int(m.group(2)) if m.group(2) else r


def rounded(x, n):
    """x > 0 rounded to n significant figures, written as the lessons write it, or None near a tie."""
    x = Rational(x) if not hasattr(x, "evalf") else x
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
    if -3 <= e < n:
        k = n - 1 - e
        s = digits.rjust(k + 1, "0")
        whole, dec = (s[: len(s) - k], s[len(s) - k :]) if k else (s, "")
        return whole + ("{,}" + dec if dec else "")
    mant = digits[0] + ("{,}" + digits[1:] if n > 1 else "")
    return f"{mant} \\cdot 10^{{{e}}}"


def check_options(sample, errs, right, u):
    """Four distinct options with the unit u; the correct one is `right` (a number as written)."""
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


def common(sample, errs):
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")


def text(sample):
    return prose(sample["problem"])


def sig_of(s):
    """Significant figures of a datum as written ("0{,}150" has 3, "4{,}5" 2, "18{,}0" 3)."""
    return len(s.replace("{,}", "").lstrip("0"))
