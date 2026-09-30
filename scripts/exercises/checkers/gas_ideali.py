"""Checker for gas-ideali (specs/exercises/gas-ideali.md), written from the spec and the lesson 37-gas-ideali.md, not
from the generator.

p V = n R T with R = 0,0821 L·atm/(mol·K) (atmospheres and litres) or 8,31 J/(mol·K) (pascal and cubic metres),
T = t + 273. n = m / M with the molar masses of lesson 01; M = m R T / (p V); d = p M / (R T). Results with three
significant figures; the temperature of level 4 to the degree.
"""
import re

from sympy import Rational

from checkers._chim_mole import R_ATM, R_SI, answer, check_options, common, molar, parse_tex_formula, quantity, sig_of, text, value

L = quantity("L")
ML = quantity("mL")
MOL = quantity("mol")
G = quantity("g")
ATM = quantity("atm")
KPA = quantity("kPa")
DEG = r"\$(\d+)\\,\^\\circ\\text\{C\}\$"
NAME = r"([a-z ]+)"


def three(s, errs, lo, hi, what):
    v = value(s)
    if sig_of(s) != 3 or not lo <= v <= hi:
        errs.append(f"{what} {s} not three figures in {lo}-{hi}")
    return v


def celsius(s, errs, lo, hi):
    t = int(s)
    if not lo <= t <= hi or t % 10 == 0:
        errs.append(f"temperature {t} out of range or a multiple of 10")
    return t + 273


def level1(sample, errs):
    m = re.fullmatch(r"Che volume occupano " + MOL + " di " + NAME + " a " + DEG + " e " + ATM + r"\?", text(sample))
    if not m:
        errs.append(f"level 1 text not recognised: {text(sample)!r}")
        return None
    n = three(m.group(1), errs, Rational(1, 10), 5, "n")
    T = celsius(m.group(3), errs, 1, 99)
    p = three(m.group(4), errs, Rational(1, 2), 5, "p")
    answer(sample, errs, n * R_ATM * T / p, 3, "L")
    return "volume"


def level2(sample, errs):
    m = re.fullmatch(r"Un recipiente di " + L + " contiene " + G + " di " + NAME + r", \$(.+?)\$, a " + DEG + r"\. Qual è la pressione del gas\?", text(sample))
    if not m:
        errs.append(f"level 2 text not recognised: {text(sample)!r}")
        return None
    V = three(m.group(1), errs, 1, Rational("99.9"), "V")
    mass = three(m.group(2), errs, 1, Rational("99.9"), "m")
    f = parse_tex_formula(m.group(4))
    T = celsius(m.group(5), errs, 1, 99)
    answer(sample, errs, mass / molar(f) * R_ATM * T / V, 3, "atm")
    return "pressione"


def level3(sample, errs):
    m = re.fullmatch(r"Una siringa contiene " + ML + " di " + NAME + " a " + KPA + " e " + DEG + r"\. Quante moli di gas contiene\?", text(sample))
    if not m:
        errs.append(f"level 3 text not recognised: {text(sample)!r}")
        return None
    V = three(m.group(1), errs, 100, 999, "V") / 10**6  # m³
    p = three(m.group(3), errs, 50, 500, "p") * 1000  # Pa
    T = celsius(m.group(4), errs, 1, 99)
    answer(sample, errs, p * V / (R_SI * T), 3, "mol")
    return "SI"


def level4(sample, errs):
    m = re.fullmatch(MOL + " di " + NAME + " occupano " + L + " alla pressione di " + ATM + r"\. A quale temperatura, in gradi Celsius, si trova il gas\?", text(sample))
    if not m:
        errs.append(f"level 4 text not recognised: {text(sample)!r}")
        return None
    n = three(m.group(1), errs, Rational(1, 10), 5, "n")
    V = value(m.group(3))
    if sig_of(m.group(3)) != 3:
        errs.append("V without three figures")
    p = three(m.group(4), errs, Rational(1, 2), 5, "p")
    t = p * V / (n * R_ATM) - 273
    if not 5 <= t <= 205:
        errs.append(f"temperature {float(t)} out of range")
    frac = t - int(t)
    if abs(frac - Rational(1, 2)) < Rational(1, 10**6):
        errs.append("temperature at a rounding tie")
    want = str(int(t + Rational(1, 2)))
    check_options(sample, errs, want, "C")
    return "temperatura"


def level5(sample, errs):
    m = re.fullmatch(r"Un recipiente di " + L + " contiene " + G + " di un gas, a " + DEG + " e " + ATM + r"\. Qual è la massa molare del gas\?", text(sample))
    if not m:
        errs.append(f"level 5 text not recognised: {text(sample)!r}")
        return None
    V = value(m.group(1))
    if sig_of(m.group(1)) != 3:
        errs.append("V without three figures")
    mass = three(m.group(2), errs, Rational(1, 10), Rational("9.99"), "m")
    T = celsius(m.group(3), errs, 1, 99)
    p = three(m.group(4), errs, Rational(1, 2), 2, "p")
    M = mass * R_ATM * T / (p * V)
    # the molar mass is that of the gas of params, within the rounding of V
    f = [(e, int(k) if k else 1) for e, k in re.findall(r"([A-Z][a-z]?)(\d*)", sample["params"]["gas"])]
    if abs(M / molar(f) - 1) > Rational(6, 1000):
        errs.append("molar mass far from the gas of params")
    answer(sample, errs, M, 3, "gmol")
    return "massa molare"


def level6(sample, errs):
    m = re.fullmatch(r"Qual è la densità (?:del |dell')" + NAME + r", \$(.+?)\$, a " + DEG + " e " + ATM + r"\?", text(sample))
    if not m:
        errs.append(f"level 6 text not recognised: {text(sample)!r}")
        return None
    f = parse_tex_formula(m.group(2))
    T = celsius(m.group(3), errs, 1, 199)
    p = three(m.group(4), errs, Rational(1, 2), 5, "p")
    answer(sample, errs, p * molar(f) / (R_ATM * T), 3, "gL")
    return "densità"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
