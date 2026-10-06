"""Checker for fis-calori-molari (specs/exercises/fis-calori-molari.md), written from the spec and the lesson
112-fis-calori-molari.md, not from the generator.

A perfect gas whose molecules have l degrees of freedom (3 monatomic, 5 diatomic) has C_V = l/2 R and, by Mayer's
relation, C_p = C_V + R, with R = 8,31 J/(mol K). The heat is Q = n C ΔT with C_V in a rigid vessel and C_p under a
free piston. At constant pressure the gas does the work W = n R ΔT = Q R / C_p and its internal energy grows by
ΔU = Q - W = Q C_V / C_p. A mass becomes moles with n = m / M. Exact arithmetic with sympy; the answer is rounded to
three significant figures and compared with the correct option.
"""
import re

from sympy import Rational

from checkers._fis_calori_adiabatica import GAS, GASES, KIND, R_TEXT, answer, common, cp, cv, gas_kind, quantity, rounded, text, three, value, whole

CASE_RANGES = {
    3: {"biatomico V": (0.40, 0.60), "biatomico p": (0.40, 0.60)},
    4: {"monoatomico V": (0.17, 0.33), "monoatomico p": (0.17, 0.33), "biatomico V": (0.17, 0.33), "biatomico p": (0.17, 0.33)},
    5: {"lavoro": (0.40, 0.60), "energia interna": (0.40, 0.60)},
    6: {"monoatomico V": (0.17, 0.33), "monoatomico p": (0.17, 0.33), "biatomico V": (0.17, 0.33), "biatomico p": (0.17, 0.33)},
}

MOL, K, J, G, GMOL = quantity("mol"), quantity("K"), quantity("J"), quantity("g"), quantity("gmol")
RIGID = r"Una bombola rigida contiene "
PISTON = r"Un cilindro chiuso da un pistone libero di muoversi contiene "
VESSEL = "(" + RIGID + "|" + PISTON + ")"


def moles(s, lo, hi, errs):
    n = value(s)
    if not re.fullmatch(r"\d\{,\}\d[05]", s) or not lo <= n <= hi:
        errs.append(f"moles {s} not {lo}-{hi} in steps of 0,05")
    return n


def condition(vessel, tail, errs):
    """'V' for the rigid vessel, 'p' for the free piston, which must also say "a pressione costante"."""
    c = "V" if vessel == RIGID else "p"
    if (c == "p") != (tail is not None):
        errs.append("vessel and 'a pressione costante' disagree")
    return c


def heat(sample, errs, kinds, conds):
    """Levels 1-3: the heat to go from T1 to T2."""
    m = re.fullmatch(VESSEL + MOL + " di " + GAS + ", un gas " + KIND + ", a " + K + r"\. Quanto calore serve per portarlo a " + K + r"( a pressione costante)?\?" + R_TEXT, text(sample))
    if not m:
        errs.append(f"text not recognised: {text(sample)!r}")
        return None
    c = condition(m.group(1), m.group(7), errs)
    l = gas_kind(m.group(3), m.group(4), errs)
    if m.group(4) not in kinds or c not in conds:
        errs.append(f"{m.group(4)} at constant {c} does not belong to this level")
    n = moles(m.group(2), 1, 4, errs)
    T1 = whole(m.group(5), 270, 320, errs, "T1")
    T2 = whole(m.group(6), 285, 470, errs, "T2")
    if not 15 <= T2 - T1 <= 150:
        errs.append("temperature rise outside 15-150 K")
    answer(sample, errs, n * (cv(l) if c == "V" else cp(l)) * (T2 - T1), 3, "J")
    return f"{m.group(4)} {c}"


def level1(sample, errs):
    return heat(sample, errs, ["monoatomico"], ["V"])


def level2(sample, errs):
    return heat(sample, errs, ["monoatomico"], ["p"])


def level3(sample, errs):
    return heat(sample, errs, ["biatomico"], ["V", "p"])


def given_heat(s, errs):
    Q = whole(s, 201, 999, errs, "Q")
    if Q % 10 == 0:
        errs.append("the heat ends with a zero")
    return Q


def level4(sample, errs):
    m = re.fullmatch(VESSEL + MOL + " di " + GAS + ", un gas " + KIND + r"\. Il gas assorbe " + J + r" di calore( a pressione costante)?\. Di quanto aumenta la sua temperatura\?" + R_TEXT, text(sample))
    if not m:
        errs.append(f"level 4 text not recognised: {text(sample)!r}")
        return None
    c = condition(m.group(1), m.group(6), errs)
    l = gas_kind(m.group(3), m.group(4), errs)
    n = moles(m.group(2), 1, Rational(5, 2), errs)
    Q = given_heat(m.group(5), errs)
    dT = Q / (n * (cv(l) if c == "V" else cp(l)))
    if not 5 <= dT <= 150:
        errs.append("temperature rise outside 5-150 K")
    answer(sample, errs, dT, 3, "K")
    return f"{m.group(4)} {c}"


def level5(sample, errs):
    m = re.fullmatch(PISTON + MOL + " di " + GAS + ", un gas " + KIND + r"\. Il gas assorbe " + J + r" di calore a pressione costante\. (Quanto lavoro compie|Di quanto aumenta la sua energia interna)\?" + R_TEXT, text(sample))
    if not m:
        errs.append(f"level 5 text not recognised: {text(sample)!r}")
        return None
    l = gas_kind(m.group(2), m.group(3), errs)
    n = moles(m.group(1), 1, Rational(5, 2), errs)
    Q = given_heat(m.group(4), errs)
    dT = Q / (n * cp(l))
    if not 5 <= dT <= 150:
        errs.append("temperature rise outside 5-150 K")
    W = n * Rational(831, 100) * dT
    if m.group(5).startswith("Quanto lavoro"):
        answer(sample, errs, W, 3, "J")
        return "lavoro"
    answer(sample, errs, Q - W, 3, "J")
    return "energia interna"


def level6(sample, errs):
    m = re.fullmatch(
        VESSEL + G + " di " + GAS + ", un gas " + KIND + " con massa molare " + GMOL + r"\. Quanto calore serve per aumentare la sua temperatura di " + K + r"( a pressione costante)?\?" + R_TEXT,
        text(sample),
    )
    if not m:
        errs.append(f"level 6 text not recognised: {text(sample)!r}")
        return None
    c = condition(m.group(1), m.group(7), errs)
    l = gas_kind(m.group(3), m.group(4), errs)
    if m.group(5) != GASES[m.group(3)][1]:
        errs.append(f"molar mass {m.group(5)} is not that of {m.group(3)}")
    mass, M = three(m.group(2), errs, "mass"), value(m.group(5))
    if "{,}" not in m.group(2) and m.group(2).endswith("0"):
        errs.append("the mass ends with an ambiguous zero")
    dT = whole(m.group(6), 15, 150, errs, "ΔT")
    if dT % 10 == 0:
        errs.append("ΔT ends with a zero")
    n = mass / M
    if not Rational(49, 100) <= n <= Rational(505, 100):
        errs.append("moles outside 0,5-5")
    C = cv(l) if c == "V" else cp(l)
    want = answer(sample, errs, n * C * dT, 3, "J")
    n3 = rounded(n, 3)
    if n3 is None or rounded(value(n3) * C * dT, 3) != want:
        errs.append("the answer changes if the moles are rounded to three figures first")
    return f"{m.group(4)} {c}"


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
