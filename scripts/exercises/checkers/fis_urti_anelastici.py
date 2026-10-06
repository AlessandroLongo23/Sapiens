"""Checker for fis-urti-anelastici (specs/exercises/fis-urti-anelastici.md), written from the spec and the lesson
83-fis-urti-anelastici.md, not from the generator.

In every collision the total momentum is conserved. Two bodies that stick together leave at
V = (m1 v1 + m2 v2) / (m1 + m2), with signed velocities; with the target at rest the kinetic energy dissipated is
K_i m2 / (m1 + m2); if the bodies separate, V2 = m1 (v1 - V1) / m2; in the ballistic pendulum
v = (m + M) / m * sqrt(2 g h); at right angles V = sqrt(p1^2 + p2^2) / (m1 + m2).
"""
import re

from sympy import Rational, sqrt

from checkers._fis_urti import G, Q, answer, answer_sci, data, in_range, scene_cross
from checkers._vettori import common, prose

CASE_RANGES = {2: {"destra": (0.35, 0.65), "sinistra": (0.35, 0.65)}}

KG, MS, GR, CM = Q("kg"), Q("m/s"), Q("g"), Q("cm")
STUCK = r"Su una rotaia un carrello di " + KG + " si muove a " + MS + " e urta un carrello fermo di " + KG + r"\. Dopo l'urto i due carrelli restano agganciati\. "


def stuck(errs, s, question):
    m = re.fullmatch(STUCK + question, s)
    if not m:
        return None
    m1, v1, m2 = data(errs, m.group(1), "m1"), data(errs, m.group(2), "v1"), data(errs, m.group(3), "m2")
    for x in (m1, v1, m2):
        in_range(errs, x, "1.1", "9.9", "datum")
    return m1, v1, m2


def level1(sample, errs):
    s = prose(sample["problem"])
    got = stuck(errs, s, r"Con che velocità si muovono\?")
    if not got:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    m1, v1, m2 = got
    if abs(m1 - m2) < Rational(15, 100) * max(m1, m2):
        errs.append("masses too close")
    answer(sample, errs, m1 * v1 / (m1 + m2), "m/s")
    return "fermo"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su una rotaia un carrello di " + KG + " si muove verso destra a " + MS + "; un carrello di " + KG + " gli viene incontro a " + MS + r"\. Nell'urto i due restano agganciati\. Qual è la loro velocità dopo l'urto\? Prendi come positivo il verso destra\.", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    m1, v1, m2, v2 = (data(errs, m.group(i), f"datum {i}") for i in range(1, 5))
    for x in (m1, v1, m2, v2):
        in_range(errs, x, "1.1", "9.9", "datum")
    truth = (m1 * v1 - m2 * v2) / (m1 + m2)
    if abs(truth) < Rational(2, 10):
        errs.append("final speed under 0,2 m/s")
    answer(sample, errs, truth, "m/s")
    return "destra" if truth > 0 else "sinistra"


def level3(sample, errs):
    s = prose(sample["problem"])
    got = stuck(errs, s, r"Quanta energia cinetica si dissipa nell'urto\?")
    if not got:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    m1, v1, m2 = got
    V = m1 * v1 / (m1 + m2)
    answer_sci(sample, errs, m1 * v1**2 / 2 - (m1 + m2) * V**2 / 2, "J")
    return "energia"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su una rotaia un carrello di " + KG + " si muove a " + MS + " e urta un carrello fermo di " + KG + r"\. Dopo l'urto il primo carrello prosegue nello stesso verso a " + MS + r"\. Con che velocità parte il secondo carrello\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    m1, v1, m2, V1 = (data(errs, m.group(i), f"datum {i}") for i in range(1, 5))
    in_range(errs, m1, "1.1", "9.9", "m1")
    in_range(errs, m2, "1.1", "9.9", "m2")
    in_range(errs, v1, "2.1", "9.9", "v1")
    V2 = m1 * (v1 - V1) / m2
    if V1 < Rational(2, 10) or V1 >= v1:
        errs.append("the first cart must slow down and keep going forward")
    if V2 <= V1 + Rational(2, 10):
        errs.append("the carts do not separate")
    if m1 * V1**2 + m2 * V2**2 >= Rational(97, 100) * m1 * v1**2:
        errs.append("the collision is not clearly inelastic")
    answer(sample, errs, V2, "m/s")
    return "separati"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un proiettile di " + GR + " si conficca in un blocco di " + KG + r" appeso a due fili\. Il blocco, con il proiettile dentro, sale di " + CM + r"\. Qual era la velocità del proiettile\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    mg, M, hc = data(errs, m.group(1), "bullet"), data(errs, m.group(2), "block"), data(errs, m.group(3), "height")
    in_range(errs, mg, "5.1", 25, "bullet")
    in_range(errs, M, "1.1", "9.9", "block")
    in_range(errs, hc, "2.1", 25, "height")
    mk, h = mg / 1000, hc / 100
    truth = (mk + M) / mk * sqrt(2 * G * h)
    if not 150 <= truth <= 900:
        errs.append("not the speed of a bullet")
    answer_sci(sample, errs, truth, "m/s")
    return "pendolo"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su una pista di ghiaccio un pattinatore di " + KG + " va verso est a " + MS + "; una pattinatrice di " + KG + " va verso nord a " + MS + r"\. I due si scontrano e restano abbracciati\. Con che velocità si muovono subito dopo l'urto\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    m1, v1, m2, v2 = (data(errs, m.group(i), f"datum {i}") for i in range(1, 5))
    in_range(errs, m1, 41, 99, "m1")
    in_range(errs, m2, 41, 99, "m2")
    in_range(errs, v1, "1.1", "9.9", "v1")
    in_range(errs, v2, "1.1", "9.9", "v2")
    p1, p2 = m1 * v1, m2 * v2
    if min(p1, p2) < Rational(4, 10) * max(p1, p2):
        errs.append("one momentum under 40% of the other")
    answer(sample, errs, sqrt(p1**2 + p2**2) / (m1 + m2), "m/s")
    lab = lambda g: g.replace("{,}", ",") + " m/s"
    scene_cross(sample, errs, v1, v2, lab(m.group(2)), lab(m.group(4)))
    return "angolo retto"


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
    if lvl != 6 and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
