"""Checker for fis-macchine-termiche (specs/exercises/fis-macchine-termiche.md), written from the spec and the lesson
114-fis-macchine-termiche.md, not from the generator.

A heat engine absorbs Q_c from the hot reservoir, gives Q_f to the cold one and does the work W = Q_c - Q_f in a
cycle (absolute values). Its efficiency is W / Q_c = 1 - Q_f / Q_c, a pure number written with two decimals. From the
efficiency: Q_c = W / eta and Q_f = (1 - eta) Q_c. An engine of power P absorbs Q_c = P dt / eta in the time dt. A
rectangular cycle in the pressure-volume plane does the work (p_A - p_D)(V_B - V_A), and 1 kPa * 1 L = 1 J.
"""
import re

from sympy import Rational

from checkers._fis_macchine import ETA, INT, SIG2, common, engine_scene, expect, flow, label, no_scene, parse, prose, q, two_sig

CASE_RANGES = {
    1: {"lavoro": (0.40, 0.60), "ceduto": (0.40, 0.60)},
    4: {"assorbito": (0.40, 0.60), "ceduto": (0.40, 0.60)},
}

MINUTES = {2, 3, 4, 5, 6, 8, 12, 15, 25}


def heat_kj(errs, s, what):
    v = two_sig(errs, s, what)
    if not Rational(11, 10) <= v <= 99:
        errs.append(f"{what} out of range")
    return v


def efficiency(errs, s, lo, hi):
    if not re.fullmatch(r"0\{,\}\d\d", s):
        errs.append(f"efficiency {s} not written with two decimals")
    e = parse(s)
    if not Rational(lo, 100) <= e <= Rational(hi, 100):
        errs.append("efficiency out of range")
    return e


def level1(sample, errs):
    s = prose(sample["problem"])
    head = r"In ogni ciclo una macchina termica assorbe " + q("J") + r" dalla sorgente calda e "
    (d,) = engine_scene(sample, errs, 1)
    if m := re.fullmatch(head + r"cede " + q("J") + r" alla sorgente fredda\. Quanto lavoro compie in un ciclo\?", s):
        Qc, Qf = parse(m.group(1)), parse(m.group(2))
        W = Qc - Qf
        kind = "lavoro"
        flow(errs, d, "freddo", "esce", "Qf = " + label(Qf, "J"))
        flow(errs, d, "lavoro", "esce", "W = ?")
        answer = W
    elif m := re.fullmatch(head + r"compie un lavoro di " + q("J") + r"\. Quanto calore cede alla sorgente fredda in un ciclo\?", s):
        Qc, W = parse(m.group(1)), parse(m.group(2))
        Qf = Qc - W
        kind = "ceduto"
        flow(errs, d, "freddo", "esce", "Qf = ?")
        flow(errs, d, "lavoro", "esce", "W = " + label(W, "J"))
        answer = Qf
    else:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    flow(errs, d, "caldo", "entra", "Qc = " + label(Qc, "J"))
    if not (300 <= Qc <= 1500 and Qc.q == 1 and Qf.q == 1 and W.q == 1):
        errs.append("heats out of range")
    if Qc % 10 == 0 or Qf % 10 == 0 or W % 10 == 0:
        errs.append("a value ends with a zero")
    if not Rational(15, 100) <= W / Qc <= Rational(60, 100):
        errs.append("efficiency out of range")
    expect(sample, errs, answer, "J", INT)
    return kind


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In ogni ciclo una macchina termica assorbe " + q("kJ") + r" dalla sorgente calda e compie un lavoro di " + q("kJ") + r"\. Qual è il suo rendimento\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    Qc, W = heat_kj(errs, m.group(1), "heat"), heat_kj(errs, m.group(2), "work")
    if not Rational(12, 100) <= W / Qc <= Rational(60, 100):
        errs.append("efficiency out of range")
    (d,) = engine_scene(sample, errs, 1)
    flow(errs, d, "caldo", "entra", "Qc = " + label(Qc, "kJ"))
    flow(errs, d, "lavoro", "esce", "W = " + label(W, "kJ"))
    vals = expect(sample, errs, W / Qc, "none", ETA)
    # the lesson's mistake, the fraction lost, is among the options
    lost = 1 - W / Qc
    if vals and not any(abs(v - lost) <= Rational(1, 200) for v in vals):
        errs.append("the fraction lost is not among the options")
    return "lavoro"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In ogni ciclo una macchina termica assorbe " + q("kJ") + r" dalla sorgente calda e cede " + q("kJ") + r" alla sorgente fredda\. Qual è il suo rendimento\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    Qc, Qf = heat_kj(errs, m.group(1), "heat"), heat_kj(errs, m.group(2), "heat")
    if not Rational(40, 100) <= Qf / Qc <= Rational(88, 100):
        errs.append("ratio of the heats out of range")
    (d,) = engine_scene(sample, errs, 1)
    flow(errs, d, "caldo", "entra", "Qc = " + label(Qc, "kJ"))
    flow(errs, d, "freddo", "esce", "Qf = " + label(Qf, "kJ"))
    vals = expect(sample, errs, 1 - Qf / Qc, "none", ETA)
    if any(v > 1 for v in vals):
        errs.append("an option above 1")
    return "calori"


def level4(sample, errs):
    s = prose(sample["problem"])
    head = r"Una macchina termica ha un rendimento di \$(0\{,\}\d\d)\$ e in ogni ciclo "
    (d,) = engine_scene(sample, errs, 1)
    if m := re.fullmatch(head + r"compie un lavoro di " + q("kJ") + r"\. Quanto calore assorbe dalla sorgente calda in un ciclo\?", s):
        eta, W = efficiency(errs, m.group(1), 15, 55), heat_kj(errs, m.group(2), "work")
        flow(errs, d, "caldo", "entra", "Qc = ?")
        flow(errs, d, "lavoro", "esce", "W = " + label(W, "kJ"))
        expect(sample, errs, W / eta, "kJ", SIG2)
        return "assorbito"
    if m := re.fullmatch(head + r"assorbe " + q("kJ") + r" dalla sorgente calda\. Quanto calore cede alla sorgente fredda in un ciclo\?", s):
        eta, Qc = efficiency(errs, m.group(1), 15, 55), heat_kj(errs, m.group(2), "heat")
        flow(errs, d, "caldo", "entra", "Qc = " + label(Qc, "kJ"))
        flow(errs, d, "freddo", "esce", "Qf = ?")
        expect(sample, errs, (1 - eta) * Qc, "kJ", SIG2)
        return "ceduto"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un motore termico ha una potenza di " + q("kW") + r" e un rendimento di \$(0\{,\}\d\d)\$\. Quanto calore assorbe in " + q("min") + r"\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    P = two_sig(errs, m.group(1), "power")
    if not 11 <= P <= 99:
        errs.append("power out of range")
    eta = efficiency(errs, m.group(2), 20, 45)
    minutes = parse(m.group(3))
    if minutes not in MINUTES:
        errs.append("minutes not in the spec's list")
    no_scene(sample, errs)
    vals = expect(sample, errs, P * 1000 * minutes * 60 / eta, "J", SIG2)
    if vals and not any(abs(v - P * 1000 * minutes * 60) <= P * 1000 * minutes * 60 / 20 for v in vals):
        errs.append("the work is not among the options")
    return "potenza"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un gas perfetto compie in senso orario il ciclo rettangolare \$ABCD\$ della figura, tra le pressioni di " + q("kPa") + " e " + q("kPa") + r" e tra i volumi di " + q("L") + " e " + q("L") + r"\. In ogni ciclo assorbe " + q("J") + r" di calore\. Qual è il rendimento del ciclo\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    p1, p2, V1, V2, Qc = (parse(m.group(i)) for i in range(1, 6))
    if p1 not in (100, 150, 200) or p2 % 50 != 0 or not p1 < p2 <= 500:
        errs.append("pressures out of range")
    if not (1 <= V1 <= 4 and V1 < V2 <= 8 and V1.q == 1 and V2.q == 1):
        errs.append("volumes out of range")
    W = (p2 - p1) * (V2 - V1)  # kPa * L = J
    # the heat absorbed is the monatomic gas's, as in the lesson's example 5
    if Qc != Rational(3, 2) * V1 * (p2 - p1) + Rational(5, 2) * p2 * (V2 - V1):
        errs.append("the heat absorbed is not the monatomic gas's")
    if W / Qc < Rational(1, 10):
        errs.append("efficiency under 0,10")
    sc = sample.get("scene") or {}
    if sc.get("type") != "piano-pv" or not sc.get("alt"):
        errs.append("missing scene piano-pv")
    else:
        d = sc["data"]
        want = {"A": (V1, p2), "B": (V2, p2), "C": (V2, p1), "D": (V1, p1)}
        got = {st["nome"]: (Rational(st["V"]), Rational(st["p"])) for st in d.get("stati", [])}
        if got != want:
            errs.append(f"scene states {got} != {want}")
        if [(t["da"], t["a"], t["tipo"]) for t in d.get("tratti", [])] != [("A", "B", "retta"), ("B", "C", "retta"), ("C", "D", "retta"), ("D", "A", "retta")]:
            errs.append("scene legs are not the clockwise rectangle")
        if "area" in d:
            errs.append("the problem's scene shows the area")
        if d["V"]["passo"] * d["V"]["celle"] < V2 or d["p"]["passo"] * d["p"]["celle"] < p2:
            errs.append("the cycle does not fit the axes")
    vals = expect(sample, errs, W / Qc, "none", ETA)
    if any(v > 1 for v in vals):
        errs.append("an option above 1")
    return "rettangolo"


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
