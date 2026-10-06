"""Helpers for the checkers of group 44's generators (fis-frigoriferi, fis-entropia, fis-entropia-disordine), written
from the specs and the lessons 117-119, not from src/lib/exercises/v2/fis-frigo-entropia.ts.

Quantities are read as the lessons write them: decimal comma {,}, scientific notation "1{,}7 \\cdot 10^{5}", the unit
after a thin space (\\,\\text{J/K}), a pure number alone. Values are exact (sympy Rational, or a symbolic logarithm);
a result is rounded half up to n significant figures and written plain when it is below 10^n (and at least 0,001),
otherwise in scientific notation, or rounded to d decimals; a value within 1e-9 of a tie is refused. A negative result
keeps its minus sign, and where the sign is the point of the exercise a positive one is written with a plus.
"""
import re

from sympy import Abs, Integer, Rational, floor, log

from checkers._vettori import BANNED, prose

UNITS = {
    "none": "",
    "J": r"\text{J}",
    "K": r"\text{K}",
    "C": r"^\circ\text{C}",
    "JK": r"\text{J/K}",
    "kg": r"\text{kg}",
    "mol": r"\text{mol}",
    "L": r"\text{L}",
    "pct": r"\%",
}

R_GAS = Rational(831, 100)
K_B = Rational(138, 100) * Rational(10) ** -23
C_WATER = Rational(4186)
LF = Rational(334000)
LV = Rational(2260000)
ZERO_C = 273

NUMBER = r"[+-]?\d+(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?"
C_WATER_TEX = r"\$c = 4186\\,\\text\{J/\(kg\}\\cdot\{\}\^\\circ\\text\{C\)\}\$"
LF_TEX = r"\$L_f = 3\{,\}34 \\cdot 10\^\{5\}\\,\\text\{J/kg\}\$"
LV_TEX = r"\$L_v = 2\{,\}26 \\cdot 10\^\{6\}\\,\\text\{J/kg\}\$"


def unit_tex(u):
    return (r"\," + UNITS[u]) if UNITS[u] else ""


def quantity(u, signed=False):
    """A regex for a quantity in prose: $<number>\\,<unit>$, the number captured."""
    num = r"-?\d+(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?" if signed else r"\d+(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?"
    return r"\$(" + num + ")" + re.escape(unit_tex(u)) + r"\$"


def value(s):
    """The exact value of a number as written: "4{,}5", "-3{,}00", "+1{,}25", "3{,}8 \\cdot 10^{2}"."""
    m = re.fullmatch(r"([+-]?)(\d+(?:\{,\}\d+)?)(?: \\cdot 10\^\{(-?\d+)\})?", s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    r = Rational(m.group(2).replace("{,}", "."))
    if m.group(3):
        r *= Rational(10) ** int(m.group(3))
    return -r if m.group(1) == "-" else r


def _sign(x, plus):
    return "-" if x < 0 else ("+" if plus else "")


def rounded(x, n, plus=False):
    """x != 0 rounded to n significant figures, written as the lessons write it, or None near a tie."""
    if x == 0:
        return None
    a = Abs(x)
    e = int(floor(log(a, 10).evalf(60)))
    if (Rational(10) ** e - a).evalf(60) > 0:
        e -= 1
    if (Rational(10) ** (e + 1) - a).evalf(60) <= 0:
        e += 1
    y = a / Rational(10) ** (e - n + 1)
    fl = int(floor(y.evalf(60)))
    frac = (y - fl).evalf(60)
    if abs(frac - Rational(1, 2)) < Rational(1, 10**9):
        return None
    m = fl + 1 if frac > Rational(1, 2) else fl
    if m >= 10**n:
        m //= 10
        e += 1
    digits = str(m)
    sign = _sign(x.evalf(60) if hasattr(x, "evalf") else x, plus)
    if -3 <= e < n:
        k = n - 1 - e
        s = digits.rjust(k + 1, "0")
        whole, dec = (s[: len(s) - k], s[len(s) - k :]) if k else (s, "")
        return sign + whole + ("{,}" + dec if dec else "")
    mant = digits[0] + ("{,}" + digits[1:] if n > 1 else "")
    return f"{sign}{mant} \\cdot 10^{{{e}}}"


def fixed(x, d, plus=False):
    """x rounded to d decimals, or None near a tie or when it rounds to zero."""
    a = Abs(x) * Integer(10) ** d
    fl = int(floor(a.evalf(60)))
    frac = (a - fl).evalf(60)
    if abs(frac - Rational(1, 2)) < Rational(1, 10**9):
        return None
    m = fl + 1 if frac > Rational(1, 2) else fl
    if m == 0:
        return None
    s = str(m).rjust(d + 1, "0")
    whole, dec = (s[: len(s) - d], s[len(s) - d :]) if d else (s, "")
    return _sign(x.evalf(60) if hasattr(x, "evalf") else x, plus) + whole + ("{,}" + dec if dec else "")


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
    want = right + unit_tex(u)
    if opts[c] != want:
        errs.append(f"correct option {opts[c]!r} != expected {want!r}")
    vals = []
    for o in opts:
        m = re.fullmatch("(" + NUMBER + ")" + re.escape(unit_tex(u)), o)
        if not m:
            errs.append(f"option {o!r} is not a quantity in {u}")
            continue
        vals.append(value(m.group(1)))
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")
    return opts


def answer(sample, errs, truth, n, u, plus=False, decimals=None):
    """The expected answer, to n significant figures or (with `decimals`) to that many decimals."""
    want = fixed(truth, decimals, plus) if decimals is not None else rounded(truth, n, plus)
    if want is None:
        errs.append(f"{truth} too close to a rounding boundary")
        return None
    if re.fullmatch(r"[+-]?\d*0", want):
        errs.append(f"the answer {want} ends with an ambiguous zero")
    check_options(sample, errs, want, u)
    return want


def common(sample, errs):
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    # The solution shown to the student ends with the option marked as correct.
    a = sample.get("answer", {})
    opts = a.get("options", [])
    c = a.get("correct")
    if isinstance(c, int) and 0 <= c < len(opts) and sample["solution"] != opts[c]["latex"] and not sample["solution"].endswith(" " + opts[c]["latex"]):
        errs.append(f"the solution {sample['solution']!r} does not end with the correct option {opts[c]['latex']!r}")


def text(sample):
    return prose(sample["problem"])


def no_trailing_zero(errs, s, what):
    """A datum written without an ambiguous final zero: its last digit is not 0 unless it is a decimal."""
    if "{,}" not in s and s.endswith("0"):
        errs.append(f"{what} {s} ends with a zero")


def lab(s):
    """A label of a drawing: decimal comma and a true minus sign."""
    return str(s).replace("{,}", ",").replace(".", ",").replace("-", "−")
