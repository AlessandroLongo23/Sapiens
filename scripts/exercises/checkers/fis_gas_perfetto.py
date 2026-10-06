"""Checker for fis-gas-perfetto (specs/exercises/fis-gas-perfetto.md), written from the spec and the lesson
104-fis-gas-perfetto.md, not from the generator.

For a fixed amount of gas p1 V1 / T1 = p2 V2 / T2; p V = n R T with R = 8,31 J/(mol·K), pressures in pascals, volumes
in cubic metres, temperatures in kelvin (T = t + 273); p V = N kB T with kB = 1,38 · 10^-23 J/K; from a rigid cylinder
at constant temperature the moles that leave are (p1 − p2) V / (R T).
"""
import re

from sympy import Rational

from checkers._fis_gas_leggi import K_B, KB_TEXT, R_GAS, R_TEXT, SIG2, SIG3, ZERO_C, common, expect, expect_sci, parse, prose, qty, sig_of

CASE_RANGES = {}


def whole(errs, s, lo, hi, what, no_zero=False):
    v = parse(s)
    if not (v.is_integer and lo <= v <= hi) or (no_zero and v % 10 == 0):
        errs.append(f"{what} {s} out of range")
    return v


def two_figures(errs, s, lo, hi, what):
    v = parse(s)
    if sig_of(s) != 2 or not lo <= v <= hi:
        errs.append(f"{what} {s} has not two figures in range")
    return v


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un gas occupa " + qty("L") + r" a " + qty("C") + r" e alla pressione di " + qty("kPa") + r"\. Viene portato a " + qty("C") + r" e alla pressione di " + qty("kPa") + r", senza che ne esca\. Che volume occupa\?",
        s,
    )
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    V1 = two_figures(errs, m.group(1), Rational(11, 10), Rational(99, 10), "volume")
    t1 = whole(errs, m.group(2), 5, 35, "initial temperature")
    p1 = whole(errs, m.group(3), 101, 299, "initial pressure", no_zero=True)
    t2 = whole(errs, m.group(4), -50, 200, "final temperature")
    p2 = whole(errs, m.group(5), 31, 399, "final pressure", no_zero=True)
    r = p1 / p2
    if abs(t2 - t1) < 15 or t2 == 0:
        errs.append("the two temperatures are too close, or the final one is zero")
    if not (Rational(1, 4) <= r <= 5) or Rational(9, 10) < r < Rational(10, 9):
        errs.append(f"ratio of the pressures {r} out of range")
    expect(sample, errs, V1 * r * (t2 + ZERO_C) / (t1 + ZERO_C), "L", SIG2)
    return "due stati"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un recipiente di " + qty("m3") + r" contiene un gas alla pressione di " + qty("Pa") + r" e alla temperatura di " + qty("K") + r"\. Quante moli di gas contiene\? Usa " + R_TEXT + r"\.", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    V = two_figures(errs, m.group(1), Rational(11, 1000), Rational(99, 1000), "volume")
    p = parse(m.group(2))
    if sig_of(m.group(2)) != 3 or not (101000 <= p <= 499000) or (p / 1000) % 10 == 0:
        errs.append(f"pressure {m.group(2)} out of range")
    T = whole(errs, m.group(3), 251, 399, "temperature", no_zero=True)
    expect(sample, errs, p * V / (R_GAS * T), "mol", SIG2)
    return "moli"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un recipiente da " + qty("L") + r" contiene " + qty("mol") + r" di gas a " + qty("C") + r"\. Quanto vale la pressione del gas\? Usa " + R_TEXT + r"\.", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    VL = two_figures(errs, m.group(1), Rational(11, 10), 99, "volume")
    if VL.is_integer and VL % 10 == 0 and "{,}" not in m.group(1):
        errs.append("volume ending in an ambiguous zero")
    n = two_figures(errs, m.group(2), Rational(11, 10), Rational(99, 10), "moles")
    t = whole(errs, m.group(3), 5, 95, "temperature")
    expect(sample, errs, n * R_GAS * (t + ZERO_C) / (VL / 1000), "Pa", SIG2)
    return "litri" if VL < 10 else "decine di litri"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Quante molecole ci sono in " + qty("cm3") + r" di gas a " + qty("C") + r" e alla pressione di " + qty("Pa") + r"\? Usa " + KB_TEXT + r"\.", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    V = two_figures(errs, m.group(1), Rational(11, 10), Rational(99, 10), "volume")
    t = whole(errs, m.group(2), 5, 95, "temperature")
    if not re.fullmatch(r"\d\{,\}\d \\cdot 10\^\{5\}", m.group(3)):
        errs.append(f"pressure {m.group(3)} not written as x,x · 10^5")
    p = parse(m.group(3))
    if not 110000 <= p <= 990000:
        errs.append("pressure out of range")
    expect_sci(sample, errs, p * V / 10**6 / (K_B * (t + ZERO_C)), 2)
    return "molecole"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Una bombola da " + qty("L") + r" contiene gas a " + qty("C") + r", alla pressione di " + qty("Pa") + r"\. Dopo un certo uso, alla stessa temperatura, la pressione è " + qty("Pa") + r"\. Quante moli di gas sono uscite\? Usa " + R_TEXT + r"\.",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    VL = parse(m.group(1))
    if not (10 <= VL <= 50 and re.fullmatch(r"\d\d\{,\}\d", m.group(1))):
        errs.append(f"volume {m.group(1)} not between 10,0 and 50,0 L with one decimal")
    t = whole(errs, m.group(2), 5, 35, "temperature")
    p1, p2 = parse(m.group(3)), parse(m.group(4))
    for name, p, text in (("p1", p1, m.group(3)), ("p2", p2, m.group(4))):
        if not re.fullmatch(r"\d\{,\}\d[1-9] \\cdot 10\^\{6\}", text):
            errs.append(f"{name} {text} not written as x,xx · 10^6 without a final zero")
    if not (2210000 <= p1 <= 2990000 and 1010000 <= p2 and p1 - p2 >= 1000000):
        errs.append("pressures out of range")
    expect(sample, errs, (p1 - p2) * (VL / 1000) / (R_GAS * (t + ZERO_C)), "mol", SIG3)
    return "bombola"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
