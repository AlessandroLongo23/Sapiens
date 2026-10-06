"""Checker for fis-urti-elastici (specs/exercises/fis-urti-elastici.md), written from the spec and the lesson
84-fis-urti-elastici.md, not from the generator.

A head-on elastic collision conserves momentum and kinetic energy:
V1 = ((m1 - m2) v1 + 2 m2 v2) / (m1 + m2) and V2 = ((m2 - m1) v2 + 2 m1 v1) / (m1 + m2), with signed velocities.
Between equal masses with the target at rest the final velocities are perpendicular: theta2 = 90 - theta1,
V1 = v1 cos(theta1), V2 = v1 sin(theta1).
"""
import re

from sympy import Rational, cos, pi, sin

from checkers._fis_urti import Q, answer, data, in_range
from checkers._vettori import check_choice, common, prose

CASE_RANGES = {
    2: {"avanti": (0.35, 0.65), "indietro": (0.35, 0.65)},
    5: {"prima": (0.40, 0.60), "colpita": (0.40, 0.60)},
}

KG, MS = Q("kg"), Q("m/s")
REST = r"Su una rotaia un carrello di " + KG + " si muove a " + MS + " e urta elasticamente un carrello fermo di " + KG + r"\. "
HIT = r"Su un tavolo da biliardo una boccia a " + MS + r" colpisce di striscio una boccia ferma della stessa massa\. L'urto è elastico, e dopo l'urto la prima boccia si muove in una direzione che forma un angolo di \$(\d+)\^\\circ\$ con quella iniziale\. "


def rest(errs, s, question):
    m = re.fullmatch(REST + question, s)
    if not m:
        return None
    m1, v1, m2 = data(errs, m.group(1), "m1"), data(errs, m.group(2), "v1"), data(errs, m.group(3), "m2")
    for x in (m1, v1, m2):
        in_range(errs, x, "1.1", "9.9", "datum")
    if abs(m1 - m2) < Rational(15, 100) * max(m1, m2):
        errs.append("masses too close")
    return m1, v1, m2


def level1(sample, errs):
    s = prose(sample["problem"])
    got = rest(errs, s, r"Con che velocità parte il carrello che era fermo\?")
    if not got:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    m1, v1, m2 = got
    answer(sample, errs, 2 * m1 * v1 / (m1 + m2), "m/s")
    return "bersaglio"


def level2(sample, errs):
    s = prose(sample["problem"])
    got = rest(errs, s, r"Qual è la velocità del primo carrello dopo l'urto\? Prendi come positivo il verso in cui si muoveva\.")
    if not got:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    m1, v1, m2 = got
    truth = (m1 - m2) * v1 / (m1 + m2)
    if abs(truth) < Rational(2, 10):
        errs.append("final speed under 0,2 m/s")
    answer(sample, errs, truth, "m/s")
    return "avanti" if truth > 0 else "indietro"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su una rotaia un carrello di " + KG + " si muove verso destra a " + MS + "; un carrello di " + KG + " gli viene incontro a " + MS + r"\. L'urto è elastico\. Qual è la velocità del primo carrello dopo l'urto\? Prendi come positivo il verso destra\.", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    m1, v1, m2, speed2 = (data(errs, m.group(i), f"datum {i}") for i in range(1, 5))
    for x in (m1, v1, m2, speed2):
        in_range(errs, x, "1.1", "9.9", "datum")
    if abs(m1 - m2) < Rational(15, 100) * max(m1, m2):
        errs.append("masses too close")
    v2 = -speed2
    truth = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
    if abs(truth) < Rational(2, 10):
        errs.append("final speed under 0,2 m/s")
    answer(sample, errs, truth, "m/s")
    return "frontale"


def hit(sample, errs, s, question):
    m = re.fullmatch(HIT + question, s)
    if not m:
        return None
    v1, theta = data(errs, m.group(1), "v1"), int(m.group(2))
    in_range(errs, v1, "1.1", "9.9", "v1")
    if not 15 <= theta <= 75 or abs(theta - 45) < 6:
        errs.append(f"angle {theta} out of range")
    sc = sample.get("scene") or {}
    vs = sc.get("data", {}).get("vettori", [])
    angs = sc.get("data", {}).get("angoli", [])
    rad = pi * theta / 180
    if sc.get("type") != "vettori-piano" or len(vs) != 2:
        errs.append("the scene must show the incoming velocity and the first ball's direction only")
    else:
        a, b = vs
        ok = (
            a["da"] == [-5, 0] and a["a"] == [-1, 0] and a.get("etichetta") == m.group(1).replace("{,}", ",") + " m/s"
            and b["da"] == [0, 0] and b.get("tratteggiato") is True and not b.get("etichetta")
            and abs(b["a"][0] - float(3 * cos(rad))) < 0.002 and abs(b["a"][1] - float(3 * sin(rad))) < 0.002
            and len(angs) == 1 and angs[0].get("testo") == f"{theta}°" and angs[0].get("vettore") == 1 and angs[0].get("rif") == "x"
        )
        if not ok:
            errs.append("the scene does not match the data")
    return v1, theta


def level4(sample, errs):
    s = prose(sample["problem"])
    got = hit(sample, errs, s, r"Che angolo forma con la direzione iniziale la velocità della boccia colpita\?")
    if not got:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    _, theta = got
    for o in check_choice(sample, errs, f"{90 - theta}^\\circ"):
        if not re.fullmatch(r"\d+\^\\circ", o):
            errs.append(f"option {o!r} is not an angle")
    return "direzione"


def level5(sample, errs):
    s = prose(sample["problem"])
    if got := hit(sample, errs, s, r"Qual è la velocità della prima boccia dopo l'urto\?"):
        kind = "prima"
    elif got := hit(sample, errs, s, r"Con che velocità parte la boccia colpita\?"):
        kind = "colpita"
    else:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    v1, theta = got
    rad = pi * theta / 180
    answer(sample, errs, v1 * (cos(rad) if kind == "prima" else sin(rad)), "m/s")
    return kind


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
    if lvl < 4 and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
