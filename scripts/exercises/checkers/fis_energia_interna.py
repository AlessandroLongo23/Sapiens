"""Checker for fis-energia-interna (specs/exercises/fis-energia-interna.md), written from the spec and the lesson
108-fis-energia-interna.md, not from the generator.

Monatomic perfect gas: U = (3/2) n R T with T in kelvin; ΔU = (3/2) n R ΔT, where ΔT is the same in kelvin and in
degrees Celsius; U = (3/2) p V with V in cubic metres; between two states ΔU = (3/2)(p_B V_B − p_A V_A) whatever the
path; T = 2U / (3 n R); two gases in an insulated vessel reach T_f = (n_1 T_1 + n_2 T_2) / (n_1 + n_2).
"""
import re

from sympy import Rational

from checkers._fis_cinetica import GASES, R_GAS, expect, parse, prose, q, run, sig_of

CASE_RANGES = {
    2: {"riscaldamento": (0.40, 0.60), "raffreddamento": (0.40, 0.60)},
}

MONO = "(" + "|".join(k for k, v in GASES.items() if v[1]) + ")"
R_NOTE = r" \(\$R = 8\{,\}31\\,\\text\{J/\(mol\}\\cdot\\text\{K\)\}\$\)"
H = Rational(3, 2)


def moles(errs, s, hi="9.99"):
    n = parse(s)
    if sig_of(s) != 3 or s.endswith("0") or not Rational("1.01") <= n <= Rational(hi):
        errs.append(f"moles {s} out of the spec")
    return n


def kelvin(errs, s, lo, hi):
    T = parse(s)
    if T.q != 1 or T % 10 == 0 or not lo <= T <= hi:
        errs.append(f"temperature {s} out of the spec")
    return T


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un recipiente contiene " + q("mol") + " di " + MONO + ", un gas monoatomico, a " + q("K") + r"\. Quanto vale l'energia interna del gas\?" + R_NOTE, s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    n, T = moles(errs, m.group(1)), kelvin(errs, m.group(3), 151, 999)
    expect(sample, errs, H * n * R_GAS * T, "J", 3)
    return m.group(2)


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un recipiente " + q("mol") + " di " + MONO + ", un gas monoatomico, passano da " + q("C") + " a " + q("C") + r"\. Di quanto cambia l'energia interna del gas\?" + R_NOTE, s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    n = moles(errs, m.group(1))
    ti, tf = parse(m.group(3)), parse(m.group(4))
    lo, d = min(ti, tf), abs(tf - ti)
    if ti.q != 1 or tf.q != 1 or not -40 <= lo <= 60 or not 21 <= d <= 199 or d % 10 == 0:
        errs.append("temperatures out of the spec")
    expect(sample, errs, H * n * R_GAS * (tf - ti), "J", 3, signed=True)
    return "raffreddamento" if tf < ti else "riscaldamento"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una bombola di " + q("L") + " contiene " + MONO + ", un gas monoatomico, alla pressione di " + q("Pa") + r"\. Quanto vale l'energia interna del gas\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    V, p = parse(m.group(1)), parse(m.group(3))
    if sig_of(m.group(1)) != 3 or m.group(1).endswith("0") or not Rational("1.01") <= V <= Rational("9.99"):
        errs.append("volume out of the spec")
    if sig_of(m.group(3)) != 3 or p % 1000 or (p / 1000) % 10 == 0 or not 61000 <= p <= 499000:
        errs.append("pressure out of the spec")
    expect(sample, errs, H * p * V / 1000, "J", 3)
    return m.group(2)


STATE = r"\(" + q("L") + ", " + q("kPa") + r"\)"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas perfetto monoatomico passa dallo stato A " + STATE + " allo stato B " + STATE + r" lungo il cammino della figura, che passa per C\. Di quanto cambia la sua energia interna\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    VA, pA, VB, pB = (parse(x) for x in m.groups())
    for V in (VA, VB):
        if not Rational("1.1") <= V <= Rational("7.9") or (V * 10) % 10 == 0 or (V * 10).q != 1:
            errs.append(f"volume {V} out of the spec")
    for p in (pA, pB):
        if p.q != 1 or p % 10 == 0 or not 61 <= p <= 399:
            errs.append(f"pressure {p} out of the spec")
    if abs(VA - VB) < Rational(3, 2) or abs(pA - pB) < 60:
        errs.append("the two states are too close")
    dU = H * (pB * VB - pA * VA)  # kPa · L = J
    if abs(dU) < 50:
        errs.append("change under 50 J")
    scene = sample.get("scene") or {}
    data = scene.get("data", {})
    states = {st["nome"]: (Rational(str(st["V"])), Rational(str(st["p"]))) for st in data.get("stati", [])}
    if scene.get("type") != "piano-pv" or states.get("A") != (VA, pA) or states.get("B") != (VB, pB) or states.get("C") != (VB, pA):
        errs.append("the scene does not draw the states of the text")
    if [(leg["da"], leg["a"]) for leg in data.get("tratti", [])] != [("A", "C"), ("C", "B")] or "area" in data:
        errs.append("the scene does not draw the path A, C, B")
    if data.get("V", {}).get("passo", 0) * data.get("V", {}).get("celle", 0) < max(VA, VB) or data.get("p", {}).get("passo", 0) * data.get("p", {}).get("celle", 0) < max(pA, pB):
        errs.append("a state falls outside the axes")
    expect(sample, errs, dU, "J", 3, signed=True)
    return "aumenta" if dU > 0 else "diminuisce"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"L'energia interna di " + q("mol") + " di " + MONO + ", un gas monoatomico, è " + q("J") + r"\. Qual è la temperatura del gas, in kelvin\?" + R_NOTE, s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    n, U = moles(errs, m.group(1)), parse(m.group(3))
    if sig_of(m.group(3)) != 3:
        errs.append("energy not with three figures")
    T = 2 * U / (3 * n * R_GAS)
    if not 148 <= T <= 1005:
        errs.append(f"temperature {float(T)} out of range")
    expect(sample, errs, T, "K", 3)
    return m.group(2)


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un recipiente rigido e isolato è diviso in due da una parete che conduce il calore\. Da una parte ci sono " + q("mol") + " di " + MONO + " a " + q("K")
        + ", dall'altra " + q("mol") + " di " + MONO + " a " + q("K") + r"\. I due gas sono monoatomici\. Quale temperatura raggiungono\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    n1, n2 = moles(errs, m.group(1), "5.99"), moles(errs, m.group(4), "5.99")
    T1, T2 = kelvin(errs, m.group(3), 201, 599), kelvin(errs, m.group(6), 201, 599)
    if m.group(2) == m.group(5) or abs(n1 - n2) < Rational(1, 2) or abs(T1 - T2) < 80:
        errs.append("the two gases are too alike")
    expect(sample, errs, (n1 * T1 + n2 * T2) / (n1 + n2), "K", 3)
    return "primo più caldo" if T1 > T2 else "secondo più caldo"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    return run(LEVELS, sample)
