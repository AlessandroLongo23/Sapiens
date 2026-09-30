"""Helpers for the checkers of work, power and kinetic energy (group 17: lavoro, fis-potenza, fis-energia-cinetica),
written from the specs and the lessons 59-61, not from src/lib/exercises/v2/fis-lavoro.ts.

Results have two significant figures, rounded half up on exact values and refused within 1e-9 of a boundary. They
are written as the lessons write them: a plain decimal from 0,01 to 99 ("35", "3{,}5", "0{,}035"), scientific
notation otherwise ("3{,}5 \\cdot 10^2", "2{,}5 \\cdot 10^{-3}"), the unit after a thin space.
"""
import re

from sympy import Rational, floor, log

from checkers._vettori import check_choice, sig_of

G = Rational(49, 5)
DEC = r"\d+(?:\{,\}\d+)?"


def pow10(n):
    return f"10^{n}" if 0 <= n < 10 else f"10^{{{n}}}"


def sig2(x):
    """Exact x rounded to two significant figures: the latex without unit, or None."""
    x = Rational(x) if not hasattr(x, "evalf") else x
    if x == 0:
        return None
    sign = "-" if x < 0 else ""
    ax = abs(x)
    e = int(floor(log(ax, 10).evalf(50)))
    if Rational(10) ** e > ax:
        e -= 1
    if Rational(10) ** (e + 1) <= ax:
        e += 1
    y = ax / Rational(10) ** (e - 1)
    fl = int(floor(y.evalf(60)))
    frac = (y - fl).evalf(60)
    if abs(frac - Rational(1, 2)) < Rational(1, 10**9):
        return None
    n = fl + 1 if frac > Rational(1, 2) else fl
    if n == 100:
        n, e = 10, e + 1
    r = n * Rational(10) ** (e - 1)
    if Rational(1, 100) <= r < 100:
        if e - 1 >= 0:
            body = str(n * 10 ** (e - 1))
        else:
            s = str(n).rjust(-(e - 1) + 1, "0")
            body = s[: len(s) + (e - 1)] + "{,}" + s[len(s) + (e - 1):]
        return sign + body
    return f"{sign}{n // 10}{{,}}{n % 10} \\cdot {pow10(e)}"


def value_of(latex):
    """The number an option or a datum writes: "3{,}5 \\cdot 10^2" or "0{,}035" or "-12"."""
    m = re.fullmatch(r"(-?)(\d+(?:\{,\}\d+)?)(?: \\cdot 10\^(?:(\d)|\{(-?\d+)\}))?", latex)
    if not m:
        raise ValueError(f"not a number: {latex!r}")
    v = Rational(m.group(2).replace("{,}", "."))
    if m.group(3) or m.group(4):
        v *= Rational(10) ** int(m.group(3) or m.group(4))
    return -v if m.group(1) else v


def well_written(latex):
    """True if latex is how sig2 writes some value (so every option has two significant figures)."""
    try:
        v = value_of(latex)
    except ValueError:
        return False
    return v != 0 and sig2(v) == latex


def answer(sample, errs, truth, unit, zero_ok=False):
    """The right option is truth rounded, with its unit; every option is a quantity written like it."""
    if truth == 0:
        right = f"0\\,\\text{{{unit}}}"
    else:
        want = sig2(truth)
        if want is None:
            errs.append(f"{truth.evalf(12)} too close to a rounding boundary")
            return
        right = f"{want}\\,\\text{{{unit}}}"
    unit_re = re.escape(f"\\,\\text{{{unit}}}")
    for o in check_choice(sample, errs, right):
        m = re.fullmatch(r"(.*)" + unit_re, o)
        if not m:
            errs.append(f"option {o!r} without the unit {unit}")
            continue
        if m.group(1) == "0":
            if not (zero_ok or truth == 0):
                errs.append("a zero option")
            continue
        if not well_written(m.group(1)):
            errs.append(f"option {o!r} is not written with two significant figures")


def data(errs, s, what, sig=2):
    """A datum as written in the problem ("4{,}5", "97"), with `sig` significant figures and no ambiguous zero."""
    if sig_of(s) != sig or ("{,}" not in s and s.endswith("0")):
        errs.append(f"{what} {s} has not {sig} unambiguous significant figures")
    return Rational(s.replace("{,}", "."))
