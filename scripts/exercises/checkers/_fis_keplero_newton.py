"""Helpers for the checkers of group 36 (physics, third year: fis-sistemi-cosmologici, fis-leggi-keplero,
fis-gravitazione-universale). Written from the specs and the lessons 92-94, not from
src/lib/exercises/v2/fis-keplero-newton.ts.

Numbers are read as the lessons write them: a decimal with the comma ($0{,}586\\,\\text{UA}$) or a mantissa and a
power of ten ($5{,}97 \\cdot 10^{24}\\,\\text{kg}$). Values are exact (sympy); G = 6,67 · 10⁻¹¹, the Earth's mass
5,97 · 10²⁴ kg and radius 6,37 · 10⁶ m, the year 365,25 days. A result is rounded half up to n significant figures
and written plainly when it is between 0,01 and 1000 and is not a whole number ending with a zero, otherwise in
scientific notation; a value within 10⁻⁹ of a rounding boundary is refused.
"""
import re

from sympy import N, Rational, floor, log

from checkers._vettori import check_choice

G = Rational(667, 10**13)
M_T = Rational(597, 100) * 10**24
R_T = Rational(637, 100) * 10**6
YEAR = Rational(36525, 100)

DEC = r"\d+(?:\{,\}\d+)?"
SCI = DEC + r" \\cdot 10\^\{-?\d+\}"
UNITS = {"N": r"\\text\{N\}", "kg": r"\\text\{kg\}", "m": r"\\text\{m\}", "km": r"\\text\{km\}", "UA": r"\\text\{UA\}", "anni": r"\\text\{anni\}", "d": r"\\text\{d\}", "km/s": r"\\text\{km/s\}", "m/s2": r"\\text\{m/s\}\^2"}
TEX = {"N": r"\text{N}", "kg": r"\text{kg}", "m": r"\text{m}", "km": r"\text{km}", "UA": r"\text{UA}", "anni": r"\text{anni}", "d": r"\text{d}", "km/s": r"\text{km/s}", "m/s2": r"\text{m/s}^2"}


def q(unit=""):
    """A plain quantity in prose, the number captured: $0{,}586\\,\\text{UA}$, or $0{,}66$ without unit."""
    return r"\$(" + DEC + ")" + (r"\\," + UNITS[unit] if unit else "") + r"\$"


def qs(unit):
    """A quantity in scientific notation in prose, mantissa and exponent captured."""
    return r"\$(" + DEC + r") \\cdot 10\^\{(-?\d+)\}\\," + UNITS[unit] + r"\$"


def dec(s):
    if not re.fullmatch(DEC, s):
        raise ValueError(f"not a number: {s!r}")
    return Rational(s.replace("{,}", "."))


def sig(s):
    return len(s.replace("{,}", "").lstrip("0"))


def mantissa(errs, s, figures, what):
    """A mantissa between 1 and 10 with the given figures and no zero at the end."""
    x = dec(s)
    if sig(s) != figures or s.endswith("0") or not 1 <= x < 10:
        errs.append(f"{what} {s}: not a mantissa with {figures} figures")
    return x


def whole(errs, s, lo, hi, what):
    if not re.fullmatch(r"\d+", s) or s.endswith("0") or not lo <= int(s) <= hi:
        errs.append(f"{what} {s}: not a whole number in [{lo}, {hi}] without a final zero")
    return Rational(s)


def two(errs, s, what):
    """A datum with two significant figures, 1,1 to 9,9 or 0,11 to 0,99, no zero at the end."""
    if not re.fullmatch(r"[1-9]\{,\}[1-9]|0\{,\}[1-9][1-9]", s):
        errs.append(f"{what} {s}: not a two-figure datum")
    return dec(s)


def exact_dec(r):
    """An exact terminating decimal as the lessons write it, without useless zeros."""
    r = Rational(r)
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 12:
            raise ValueError(f"{r} is not a terminating decimal")
    s = str(int(r * 10**k)).rjust(k + 1, "0")
    return s[: len(s) - k] + ("{,}" + s[len(s) - k :] if k else "")


def fmt(x, n):
    """x > 0 rounded half up to n significant figures, as the lessons write it; None near a rounding boundary."""
    v = N(x, 60)
    if not v > 0:
        return None
    e = int(floor(log(v, 10)))
    if N(Rational(10) ** e - v, 60) > 0:
        e -= 1
    if N(v - Rational(10) ** (e + 1), 60) >= 0:
        e += 1
    z = N(x * Rational(10) ** (n - 1 - e), 60)
    fl = int(floor(z))
    frac = z - fl
    if abs(frac - Rational(1, 2)) < Rational(1, 10**9):
        return None
    r = fl + 1 if frac > Rational(1, 2) else fl
    if r >= 10**n:
        r //= 10
        e += 1
    k = n - 1 - e
    if -2 <= e <= 2 and k >= 0:
        s = str(r).rjust(k + 1, "0")
        plain = s[: len(s) - k] + ("{,}" + s[len(s) - k :] if k else "")
        if not re.fullmatch(r"\d*0", plain):
            return plain
    digits = str(r)
    return digits[0] + ("{,}" + digits[1:] if n > 1 else "") + r" \cdot 10^{" + str(e) + "}"


def is_sci(tex):
    return r"\cdot 10^" in tex


def answer(sample, errs, right_number, unit, tail=None, tails=None):
    """The right option is `right_number` with its unit (and its words); every option is written the same way, and
    the solution ends with the right option."""
    if right_number is None:
        errs.append("answer too close to a rounding boundary")
        return
    u = (r"\," + TEX[unit]) if unit else ""
    right = right_number + u + ((r"\ \text{" + tail + "}") if tail else "")
    shape = "(?:" + SCI + "|" + DEC + ")" + ((r"\\," + UNITS[unit]) if unit else "")
    if tails:
        shape += r"\\ \\text\{(?:" + "|".join(tails) + r")\}"
    for o in check_choice(sample, errs, right):
        if not re.fullmatch(shape, o):
            errs.append(f"option {o!r} is not written like the answer")
    if not sample["solution"].endswith(right):
        errs.append(f"solution {sample['solution']!r} does not end with {right!r}")
