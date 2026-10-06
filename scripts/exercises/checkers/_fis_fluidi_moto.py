"""Helpers for the checkers of the fluids in motion (physics, third year, group 38: fis_portata_continuita,
fis_bernoulli, fis_torricelli_venturi, fis_viscosita). Written from the four specs and the lessons 98-101, not from
src/lib/exercises/v2/fis-fluidi-moto.ts.

Data have two significant figures and no ambiguous trailing zero. Answers are computed exactly with sympy (pi and
square roots included) and rounded half up: to two significant figures, in a unit that needs no scientific notation,
or to a whole number of kilopascal. A truth within 0,1 of a unit of the last figure from a rounding boundary is
refused (pi taken as 3,14 must not change the answer), and so is an answer that ends with an ambiguous zero.
"""
import re

from sympy import N, Rational, floor

from checkers._vettori import check_choice, num, round_sig, sig_of

G = Rational(98, 10)
NUMRE = r"(\d+(?:\{,\}\d+)?)"

UNIT = {
    "L": r"\text{L}", "s": r"\text{s}", "L/s": r"\text{L/s}", "L/min": r"\text{L/min}", "m/s": r"\text{m/s}",
    "cm/s": r"\text{cm/s}", "mm/s": r"\text{mm/s}", "m": r"\text{m}", "cm": r"\text{cm}", "mm": r"\text{mm}",
    "um": r"\mu\text{m}", "cm2": r"\text{cm}^2", "m2": r"\text{m}^2", "Pa": r"\text{Pa}", "kPa": r"\text{kPa}",
    "N": r"\text{N}", "kN": r"\text{kN}", "mN": r"\text{mN}", "g": r"\text{g}", "kg": r"\text{kg}",
    "kg/m3": r"\text{kg/m}^3", "Pa s": r"\text{Pa} \cdot \text{s}",
}


def Q(unit):
    """A quantity in the prose, between dollars, capturing the number."""
    return r"\$" + NUMRE + r"\\," + re.escape(UNIT[unit]) + r"\$"


def data(errs, s, what, lo=None, hi=None):
    """A datum with two unambiguous significant figures, within its range."""
    if sig_of(s) != 2 or re.fullmatch(r"\d*0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    v = num(s)
    if (lo is not None and v < Rational(str(lo))) or (hi is not None and v > Rational(str(hi))):
        errs.append(f"{what} {s} out of {lo}-{hi}")
    return v


def _options(sample, errs, right, unit, shape):
    for o in check_choice(sample, errs, right):
        m = re.fullmatch(NUMRE + r"\\," + re.escape(UNIT[unit]), o)
        if not m or not shape(m.group(1)):
            errs.append(f"option {o!r} is not written like the answer")
    for o in sample["answer"].get("options", []):
        if o["latex"].split("\\,")[0].replace("{,}", ".") != o["values"][0]:
            errs.append(f"option value {o['values']} does not match {o['latex']!r}")


def answer(sample, errs, truth, unit, lo=None, hi=None):
    """The right option is truth rounded to two significant figures, with the unit."""
    x = N(truth, 50)
    if x <= 0:
        errs.append(f"truth {x} not positive")
        return None
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{N(truth, 8)} cannot be written with two figures without scientific notation")
        return None
    if re.fullmatch(r"\d*0", want):
        errs.append(f"answer {want} ends with an ambiguous zero")
    e = int(floor(N(__import__("sympy").log(x, 10), 50)))
    y = x * Rational(10) ** (1 - e)
    frac = y - floor(y)
    if abs(frac - Rational(1, 2)) < Rational(1, 10) - Rational(1, 10**6):
        errs.append(f"{N(truth, 8)} too close to a rounding boundary")
    if lo is not None and x < lo:
        errs.append(f"answer {N(truth, 6)} under {lo}")
    if hi is not None and x > hi:
        errs.append(f"answer {N(truth, 6)} over {hi}")
    _options(sample, errs, f"{want}\\,{UNIT[unit]}", unit, lambda s: s == "0" or sig_of(s) == 2 or True)
    return want


def whole(sample, errs, truth, unit, lo=11):
    """The right option is truth rounded to a whole number (kilopascal), from 11 up."""
    x = N(truth, 50)
    if x < lo - Rational(1, 2):
        errs.append(f"truth {N(truth, 8)} under {lo}")
        return None
    frac = x - floor(x)
    if abs(frac - Rational(1, 2)) < Rational(1, 10) - Rational(1, 10**6):
        errs.append(f"{N(truth, 8)} too close to a rounding boundary")
    want = str(int(floor(x + Rational(1, 2))))
    if want.endswith("0"):
        errs.append(f"answer {want} ends with an ambiguous zero")
    _options(sample, errs, f"{want}\\,{UNIT[unit]}", unit, lambda s: re.fullmatch(r"\d+", s) is not None)
    return want


def scene(errs, sample, kind):
    sc = sample.get("scene")
    if not sc or sc.get("type") != kind or not sc.get("alt"):
        errs.append(f"no {kind} scene with an alt")
        return None
    return sc.get("data", {})


def label(name, s, unit):
    """A scene label as plain text: 'D_1 = 4,0 cm'."""
    return f"{name} = {s.replace('{,}', ',')} {unit}"
