"""Checker for fis-centro-massa (specs/exercises/fis-centro-massa.md), written from the spec and the lesson
85-fis-centro-massa.md, not from the generator.

The centre of mass is the mean of the positions weighted with the masses, coordinate by coordinate; its velocity is
the mean of the velocities weighted with the masses, with their signs; the centre of mass of a system at rest with no
external force does not move, so a boat M moves back by m l / (m + M) when a person m walks l along it.
"""
import re

from sympy import Rational

from checkers._fis_urti import Q, answer, data, in_range
from checkers._vettori import common, prose

CASE_RANGES = {
    3: {"ascissa": (0.40, 0.60), "ordinata": (0.40, 0.60)},
    4: {"destra": (0.35, 0.65), "sinistra": (0.35, 0.65)},
}

KG, MS, M, CM = Q("kg"), Q("m/s"), Q("m"), Q("cm")
NUM = r"(\d+(?:\{,\}\d+)?)"
PT = r"\((\d);\\,(\d)\)"


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Due sfere di " + KG + " e " + KG + r" sono fissate alle estremità di un'asta di massa trascurabile, lunga " + CM + r"\. A che distanza dalla prima sfera si trova il centro di massa\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    m1, m2, d = data(errs, m.group(1), "m1"), data(errs, m.group(2), "m2"), data(errs, m.group(3), "length")
    in_range(errs, m1, "1.1", "9.9", "m1")
    in_range(errs, m2, "1.1", "9.9", "m2")
    in_range(errs, d, 21, 99, "length")
    if abs(m1 - m2) < Rational(15, 100) * max(m1, m2):
        errs.append("masses too close")
    answer(sample, errs, m2 * d / (m1 + m2), "cm")
    return "asta"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Tre palline di " + KG + ", " + KG + " e " + KG + r" sono allineate lungo l'asse \$x\$: la prima è nell'origine, la seconda in \$x_2 = " + NUM + r"\\,\\text\{m\}\$ e la terza in \$x_3 = " + NUM + r"\\,\\text\{m\}\$\. Qual è l'ascissa del centro di massa\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    m1, m2, m3, x2, x3 = (data(errs, m.group(i), f"datum {i}") for i in range(1, 6))
    for mass in (m1, m2, m3):
        in_range(errs, mass, "1.1", "9.9", "mass")
    in_range(errs, x2, "1.1", "4.9", "x2")
    in_range(errs, x3, "2.1", "9.9", "x3")
    if x3 < x2 + Rational(1, 2):
        errs.append("the third ball is not beyond the second")
    answer(sample, errs, (m2 * x2 + m3 * x3) / (m1 + m2 + m3), "m")
    return "retta"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Tre palline si trovano nei punti \$A" + PT + r"\$, \$B" + PT + r"\$ e \$C" + PT + r"\$ di un piano cartesiano, con le coordinate in metri\. Le loro masse sono, nell'ordine, " + KG + ", " + KG + " e " + KG + r"\. Qual è (l'ascissa|l'ordinata) del centro di massa\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    pts = [(int(m.group(1)), int(m.group(2))), (int(m.group(3)), int(m.group(4))), (int(m.group(5)), int(m.group(6)))]
    ms = []
    for g in (m.group(7), m.group(8), m.group(9)):
        if not re.fullmatch(r"[1-6]\{,\}0", g):
            errs.append(f"mass {g} is not a whole number of kilograms from 1 to 6, written with two figures")
        ms.append(Rational(g.replace("{,}", ".")))
    if len(set(pts)) < 3 or any(not 0 <= c <= 6 for p in pts for c in p):
        errs.append("points not distinct or out of the grid")
    k = 0 if m.group(10) == "l'ascissa" else 1
    total = sum(ms)
    cm = [sum(mass * p[i] for mass, p in zip(ms, pts)) / total for i in (0, 1)]
    mean = Rational(sum(p[k] for p in pts), 3)
    if cm[k] < Rational(1, 2) or abs(cm[0] - cm[1]) < cm[k] / 10 or abs(mean - cm[k]) < cm[k] / 10:
        errs.append("the other coordinate or the plain mean is too close to the answer")
    answer(sample, errs, cm[k], "m")
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "vettori-piano":
        errs.append("no scene")
    elif d.get("vettori") or [(tuple(p["at"]), p["nome"]) for p in d.get("punti", [])] != list(zip(pts, "ABC")):
        errs.append("the scene must show the three points only")
    return "ascissa" if k == 0 else "ordinata"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su una rotaia un carrello di " + KG + " si muove verso destra a " + MS + "; un carrello di " + KG + " gli viene incontro a " + MS + r"\. Qual è la velocità del centro di massa dei due carrelli\? Prendi come positivo il verso destra\.", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    m1, v1, m2, v2 = (data(errs, m.group(i), f"datum {i}") for i in range(1, 5))
    for x in (m1, v1, m2, v2):
        in_range(errs, x, "1.1", "9.9", "datum")
    truth = (m1 * v1 - m2 * v2) / (m1 + m2)
    if abs(truth) < Rational(2, 10):
        errs.append("speed under 0,2 m/s")
    answer(sample, errs, truth, "m/s")
    return "destra" if truth > 0 else "sinistra"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una barca di " + KG + " è ferma su un lago, con a bordo una persona di " + KG + r"\. La persona cammina lungo la barca per " + M + r"\. Di quanto si sposta la barca, se l'attrito con l'acqua è trascurabile\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    boat, person, walk = data(errs, m.group(1), "boat", 3), data(errs, m.group(2), "person"), data(errs, m.group(3), "walk")
    in_range(errs, boat, 101, 299, "boat")
    in_range(errs, person, 41, 99, "person")
    in_range(errs, walk, "1.1", "6.9", "walk")
    answer(sample, errs, person * walk / (person + boat), "m")
    return "barca"


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
    if lvl != 3 and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
