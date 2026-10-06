"""Checker for fis-temperatura-microscopica (specs/exercises/fis-temperatura-microscopica.md), written from the spec
and the lesson 106-fis-temperatura-microscopica.md, not from the generator.

K_m = (3/2) k_B T with T in kelvin (T = t + 273); T = 2 K_m / (3 k_B); v_qm = sqrt(3 R T / M) with M in kg/mol; for
one gas v_2 / v_1 = sqrt(T_2 / T_1), for two gases at the same temperature v_1 / v_2 = sqrt(M_2 / M_1);
T = M v_qm^2 / (3 R).
"""
import re

from sympy import Rational

from checkers._fis_cinetica import GAS, GASES, K_B, R_GAS, expect, parse, prose, q, run, sig_of, sqrt

CASE_RANGES = {
    2: {"sotto zero": (0.22, 0.38), "sopra zero": (0.62, 0.78)},
    5: {"due temperature": (0.40, 0.60), "due gas": (0.40, 0.60)},
}

KB_NOTE = r" \(\$k_B = 1\{,\}38 \\cdot 10\^\{-23\}\\,\\text\{J/K\}\$\)"
R_NOTE = r" \(\$R = 8\{,\}31\\,\\text\{J/\(mol\}\\cdot\\text\{K\)\}\$\)"
ASK_K = r" Quanto vale l'energia cinetica media di una sua molecola\?"


def whole(errs, s, lo, hi, what):
    v = parse(s)
    if v.q != 1 or v % 10 == 0 or not lo <= abs(v) <= hi:
        errs.append(f"{what} {s} out of the spec")
    return v


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas è alla temperatura di " + q("K") + r"\." + ASK_K + KB_NOTE, s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    T = whole(errs, m.group(1), 101, 999, "temperature")
    expect(sample, errs, Rational(3, 2) * K_B * T, "J", 3)
    return "kelvin"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas è alla temperatura di " + q("C") + r"\." + ASK_K + KB_NOTE, s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    t = whole(errs, m.group(1), 11, 699, "temperature")
    if t < -199:
        errs.append("too cold")
    expect(sample, errs, Rational(3, 2) * K_B * (t + 273), "J", 3)
    return "sotto zero" if t < 0 else "sopra zero"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"L'energia cinetica media delle molecole di un gas è " + q("J") + r"\. Qual è la temperatura del gas, in kelvin\?" + KB_NOTE, s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    K = parse(m.group(1))
    if sig_of(m.group(1)) != 3:
        errs.append("energy not with three figures")
    T = 2 * K / (3 * K_B)
    if not 150 <= T <= 1500:
        errs.append(f"temperature {float(T)} out of range")
    expect(sample, errs, T, "K", 3)
    return "temperatura"


def gas_mass(errs, gas, M):
    if GASES[gas][0] != M:
        errs.append(f"molar mass {M} is not the table's for {gas}")
    return parse(M) / 1000


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un recipiente contiene " + GAS + r" \(massa molare " + q("gmol") + r"\) a " + q("K") + r"\. Quanto vale la velocità quadratica media delle sue (particelle|molecole)\?" + R_NOTE, s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    gas = m.group(1)
    M = gas_mass(errs, gas, m.group(2))
    T = whole(errs, m.group(3), 151, 999, "temperature")
    if (m.group(4) == "particelle") != GASES[gas][1]:
        errs.append("atoms and molecules mixed up")
    expect(sample, errs, sqrt(3 * R_GAS * T / M), "ms", 3)
    return "atomi" if GASES[gas][1] else "molecole"


def level5(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Un gas viene scaldato da " + q("C") + " a " + q("C") + r"\. Di quante volte aumenta la velocità quadratica media delle sue molecole\?", s):
        t1 = whole(errs, m.group(1), 11, 99, "first temperature")
        t2 = whole(errs, m.group(2), 161, 899, "second temperature")
        if t2 - t1 < 150:
            errs.append("temperatures too close")
        expect(sample, errs, sqrt(Rational(t2 + 273) / (t1 + 273)), "", 3)
        return "due temperature"
    m = re.fullmatch(r"Due recipienti alla stessa temperatura contengono " + GAS + r" \(" + q("gmol") + r"\) e " + GAS + r" \(" + q("gmol") + r"\)\. Quante volte è più grande la velocità quadratica media nel gas più leggero\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    Ma, Mb = gas_mass(errs, m.group(1), m.group(2)), gas_mass(errs, m.group(3), m.group(4))
    if Mb / Ma < Rational(13, 10):
        errs.append("the first gas is not clearly the lighter one")
    expect(sample, errs, sqrt(Mb / Ma), "", 3)
    return "due gas"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un recipiente di " + GAS + r" \(massa molare " + q("gmol") + r"\) la velocità quadratica media è " + q("ms") + r"\. Qual è la temperatura del gas, in kelvin\?" + R_NOTE, s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    gas = m.group(1)
    M = gas_mass(errs, gas, m.group(2))
    v = parse(m.group(3))
    if sig_of(m.group(3)) != 3:
        errs.append("speed not with three figures")
    T = M * v**2 / (3 * R_GAS)
    if not 145 <= T <= 1210:
        errs.append(f"temperature {float(T)} out of range")
    expect(sample, errs, T, "K", 3)
    return "atomi" if GASES[gas][1] else "molecole"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    return run(LEVELS, sample)
