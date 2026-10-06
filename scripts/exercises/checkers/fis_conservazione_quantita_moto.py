"""Checker for fis-conservazione-quantita-moto (specs/exercises/fis-conservazione-quantita-moto.md), written from the
spec and the lesson 82-fis-conservazione-quantita-moto.md, not from the generator.

In an isolated system the total momentum does not change. Two bodies at rest that push apart leave with
m1 V1 = m2 V2; a rifle M and its bullet m (grams) the same; two coupled carts moving at v that a spring separates obey
(m1 + m2) v = m1 V1 + m2 V2; a body at rest that bursts into three fragments, two of them along the axes, gives the
third the momentum sqrt(p1^2 + p2^2).
"""
import re

from sympy import Rational, sqrt

from checkers._fis_urti import Q, SCI, answer, data, in_range, scene_cross, sci
from checkers._vettori import common, prose

CASE_RANGES = {1: {"pattinatori": (0.40, 0.60), "carrelli": (0.40, 0.60)}}

KG, MS, GR = Q("kg"), Q("m/s"), Q("g")


def level1(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Due pattinatori, di " + KG + " e " + KG + r", sono fermi sul ghiaccio uno di fronte all'altro e si spingono\. Dopo la spinta il primo si muove a " + MS + r"\. Con che velocità si muove il secondo, se l'attrito è trascurabile\?", s):
        kind, lo, hi = "pattinatori", 41, 99
    elif m := re.fullmatch(r"Due carrelli, di " + KG + " e " + KG + r", sono fermi su una rotaia con una molla compressa in mezzo\. Liberata la molla, il primo parte a " + MS + r"\. Con che velocità parte il secondo, se l'attrito è trascurabile\?", s):
        kind, lo, hi = "carrelli", "1.1", "9.9"
    else:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    m1, m2, v1 = data(errs, m.group(1), "m1"), data(errs, m.group(2), "m2"), data(errs, m.group(3), "v1")
    in_range(errs, m1, lo, hi, "m1")
    in_range(errs, m2, lo, hi, "m2")
    in_range(errs, v1, "1.1", "9.9", "v1")
    if abs(m1 - m2) < Rational(15, 100) * max(m1, m2):
        errs.append("masses too close")
    answer(sample, errs, m1 * v1 / m2, "m/s")
    return kind


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un fucile di " + KG + " spara un proiettile di " + GR + ", che esce dalla canna a " + SCI("m/s") + r"\. Con che velocità arretra il fucile, se chi spara non lo trattiene\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    M, mg = data(errs, m.group(1), "rifle"), data(errs, m.group(2), "bullet")
    v = sci(errs, m.group(3), m.group(4), "speed")
    in_range(errs, M, "2.1", "5.9", "rifle")
    in_range(errs, mg, 11, 49, "bullet")
    in_range(errs, v, 210, 990, "speed")
    truth = mg / 1000 * v / M
    if truth < Rational(2, 10):
        errs.append("recoil under 0,2 m/s")
    answer(sample, errs, truth, "m/s")
    return "rinculo"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su una rotaia un carrello di " + KG + " e uno di " + KG + " viaggiano agganciati a " + MS + r"\. Una molla tra i due li separa: il carrello di " + KG + ", che sta davanti, prosegue a " + MS + r"\. Con che velocità prosegue l'altro carrello\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    m1, m2, v, m2b, v2 = (data(errs, m.group(i), f"datum {i}") for i in range(1, 6))
    if m2 != m2b:
        errs.append("the front cart's mass is written in two ways")
    in_range(errs, m1, "1.1", "9.9", "m1")
    in_range(errs, m2, "1.1", "9.9", "m2")
    in_range(errs, v, "1.1", "4.9", "v")
    in_range(errs, v2, "2.1", "9.9", "v2")
    if v2 < v + 1:
        errs.append("the front cart gains less than 1 m/s")
    truth = ((m1 + m2) * v - m2 * v2) / m1
    if truth < Rational(2, 10):
        errs.append("the rear cart does not keep going forward")
    answer(sample, errs, truth, "m/s")
    return "separazione"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un oggetto fermo esplode in tre frammenti, che si muovono su un piano orizzontale liscio\. Il primo, di " + KG + ", parte a " + MS + r" lungo l'asse \$x\$; il secondo, di " + KG + ", a " + MS + r" lungo l'asse \$y\$\. Il terzo ha massa " + KG + r"\. Con che velocità parte il terzo frammento\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    m1, v1, m2, v2, m3 = (data(errs, m.group(i), f"datum {i}") for i in range(1, 6))
    for mass in (m1, m2, m3):
        in_range(errs, mass, "0.11", "0.99", "mass")
    for vel in (v1, v2):
        in_range(errs, vel, "1.1", "9.9", "speed")
    p1, p2 = m1 * v1, m2 * v2
    if min(p1, p2) < Rational(4, 10) * max(p1, p2):
        errs.append("one momentum under 40% of the other")
    answer(sample, errs, sqrt(p1**2 + p2**2) / m3, "m/s")
    lab = lambda g: g.replace("{,}", ",") + " m/s"
    scene_cross(sample, errs, v1, v2, lab(m.group(2)), lab(m.group(4)))
    return "frammenti"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4}


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
    if lvl != 4 and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
