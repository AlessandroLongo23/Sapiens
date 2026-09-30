"""Checker for chim-pressioni-parziali (specs/exercises/chim-pressioni-parziali.md), written from the spec and the lesson
38-chim-pressioni-parziali.md, not from the generator.

Dalton: p_tot = p_1 + p_2 + ...; mole fraction x_1 = n_1 / n_tot and p_1 = x_1 p_tot; with the equation of state
p_1 = n_1 R T / V (R = 0,0821, T = t + 273); a gas over water has p = p_atm - p_H2O, with 1 atm = 760 mmHg. Molar
masses from lesson 01. The vapour pressures are checked against this checker's own copy of the table.
"""
import re

from sympy import Rational

from checkers._chim_mole import R_ATM, answer, check_options, common, molar, parse_tex_formula, quantity, sig_of, text, value

KPA = quantity("kPa")
MOL = quantity("mol")
G = quantity("g")
L = quantity("L")
ML = quantity("mL")
ATM = quantity("atm")
MMHG = quantity("mmHg")
DEG = r"\$(\d+)\\,\^\\circ\\text\{C\}\$"
GAS = r"di ([a-z ]+), \$(.+?)\$"
OF = r"(?:del |dell')([a-z ]+)"
VAPOUR = {18: "15.5", 19: "16.5", 20: "17.5", 21: "18.7", 22: "19.8", 23: "21.1", 24: "22.4", 25: "23.8", 26: "25.2", 27: "26.7", 28: "28.3", 30: "31.8"}

CASE_RANGES = {1: {"totale": (0.40, 0.60), "mancante": (0.40, 0.60)}, 3: {"totale": (0.40, 0.60), "parziale": (0.40, 0.60)}}


def three(s, errs, lo, hi, what):
    v = value(s)
    if sig_of(s) != 3 or not lo <= v <= hi:
        errs.append(f"{what} {s} not three figures in {lo}-{hi}")
    return v


def tenth(s, errs):
    if not re.fullmatch(r"\d+\{,\}\d", s):
        errs.append(f"pressure {s} without one decimal")
    return value(s)


def kpa_answer(sample, errs, x):
    whole = int(x * 10)
    if x * 10 != whole:
        errs.append("kPa result not in tenths")
    txt = f"{whole // 10}{{,}}{whole % 10}"
    check_options(sample, errs, txt, "kPa")


def level1(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Una miscela contiene ([a-z ]+), ([a-z ]+) e ([a-z ]+), con pressioni parziali " + KPA + ", " + KPA + " e " + KPA + r"\. Qual è la pressione totale della miscela\?", s):
        ps = [tenth(m.group(i), errs) for i in (4, 5, 6)]
        kpa_answer(sample, errs, sum(ps))
        return "totale"
    if m := re.fullmatch(r"Una miscela di ([a-z ]+), ([a-z ]+) e ([a-z ]+) ha pressione totale " + KPA + r"\. Le pressioni parziali dei primi due gas sono " + KPA + " e " + KPA + r"\. Qual è la pressione parziale " + OF + r"\?", s):
        if m.group(7) != m.group(3):
            errs.append("the gas asked is not the third one")
        tot, a, b = (tenth(m.group(i), errs) for i in (4, 5, 6))
        if tot - a - b <= 0:
            errs.append("negative partial pressure")
        kpa_answer(sample, errs, tot - a - b)
        return "mancante"
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


def level2(sample, errs):
    m = re.fullmatch(r"Una miscela contiene " + MOL + " " + GAS + ", e " + MOL + " " + GAS + ", alla pressione totale di " + ATM + r"\. Qual è la pressione parziale " + OF + r"\?", text(sample))
    if not m:
        errs.append(f"level 2 text not recognised: {text(sample)!r}")
        return None
    if m.group(8) != m.group(2):
        errs.append("the gas asked is not the first one")
    n1 = three(m.group(1), errs, Rational(1, 10), 5, "n1")
    n2 = three(m.group(4), errs, Rational(1, 10), 5, "n2")
    p = three(m.group(7), errs, Rational(1, 2), 5, "p")
    answer(sample, errs, n1 / (n1 + n2) * p, 3, "atm")
    return "frazione molare"


def level3(sample, errs):
    m = re.fullmatch(r"Un recipiente di " + L + " contiene " + MOL + " " + GAS + ", e " + MOL + " " + GAS + ", a " + DEG + r"\. Qual è (la pressione totale della miscela|la pressione parziale " + OF + r")\?", text(sample))
    if not m:
        errs.append(f"level 3 text not recognised: {text(sample)!r}")
        return None
    V = three(m.group(1), errs, 1, Rational("99.9"), "V")
    n1 = three(m.group(2), errs, Rational(1, 10), 2, "n1")
    n2 = three(m.group(5), errs, Rational(1, 10), 2, "n2")
    T = int(m.group(8)) + 273
    total = m.group(9).startswith("la pressione totale")
    if not total and m.group(10) != m.group(3):
        errs.append("the gas asked is not the first one")
    answer(sample, errs, (n1 + n2 if total else n1) * R_ATM * T / V, 3, "atm")
    return "totale" if total else "parziale"


def level4(sample, errs):
    m = re.fullmatch(r"Una bombola contiene " + G + " " + GAS + ", e " + G + " " + GAS + ", alla pressione totale di " + ATM + r"\. Qual è la pressione parziale " + OF + r"\?", text(sample))
    if not m:
        errs.append(f"level 4 text not recognised: {text(sample)!r}")
        return None
    if m.group(8) != m.group(2):
        errs.append("the gas asked is not the first one")
    m1 = three(m.group(1), errs, 1, Rational("99.9"), "m1")
    m2 = three(m.group(4), errs, 1, Rational("99.9"), "m2")
    n1 = m1 / molar(parse_tex_formula(m.group(3)))
    n2 = m2 / molar(parse_tex_formula(m.group(6)))
    p = three(m.group(7), errs, Rational(1, 2), 5, "p")
    answer(sample, errs, n1 / (n1 + n2) * p, 3, "atm")
    return "grammi"


def level5(sample, errs):
    m = re.fullmatch(
        r"Si raccolgono " + ML + r" di (idrogeno|ossigeno|azoto) sopra l'acqua, a " + DEG + r", con la pressione atmosferica di " + MMHG + r"\. A " + DEG
        + r" la tensione di vapore dell'acqua è " + MMHG + r"\. Quante moli di (idrogeno|ossigeno|azoto) sono state raccolte\?",
        text(sample),
    )
    if not m:
        errs.append(f"level 5 text not recognised: {text(sample)!r}")
        return None
    if m.group(2) != m.group(7) or m.group(3) != m.group(5):
        errs.append("gas or temperature repeated differently")
    tc = int(m.group(3))
    pw = value(m.group(6))
    if tc not in VAPOUR or pw != Rational(VAPOUR[tc]):
        errs.append(f"vapour pressure {pw} at {tc} °C not the table's")
    V = three(m.group(1), errs, 100, 999, "V") / 1000
    patm = value(m.group(4))
    if not 735 <= patm <= 775:
        errs.append("atmospheric pressure out of range")
    answer(sample, errs, (patm - pw) / 760 * V / (R_ATM * (tc + 273)), 3, "mol")
    return "sopra l’acqua"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


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
