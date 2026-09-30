"""Checker for energia (specs/exercises/energia.md), written from the spec and the lesson 63-energia.md, not from the
generator.

Without friction K + U is constant: a fall or a slide from h ends at sqrt(2 g h); a throw at v0 rises v0^2 / (2 g);
a car passing A at v_A reaches B at sqrt(v_A^2 + 2 g (h_A - h_B)); a spring k compressed by x launches a block m at
x sqrt(k / m), which climbs a smooth ramp to k x^2 / (2 m g).
"""
import re

from sympy import Rational, sqrt

from checkers._fis_energia import G, Q, answer, data
from checkers._vettori import common, prose

CASE_RANGES = {1: {"scivolo": (0.40, 0.60), "caduta": (0.40, 0.60)}}

KG, M, MS, NM, CM = Q("kg"), Q("m"), Q("m/s"), Q("N/m"), Q("cm")


def level1(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Un bambino parte da fermo dalla cima di uno scivolo alto " + M + r"\. Con che velocità arriva in fondo, se gli attriti sono trascurabili\?", s):
        kind = "scivolo"
    elif m := re.fullmatch(r"Un sasso viene lasciato cadere da un'altezza di " + M + r"\. Con che velocità arriva al suolo, se la resistenza dell'aria è trascurabile\?", s):
        kind = "caduta"
    else:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    h = data(errs, m.group(1), "height")
    if not Rational(11, 10) <= h <= 99:
        errs.append("height out of range")
    answer(sample, errs, sqrt(2 * G * h), "m/s")
    return kind


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(?:Una palla viene lanciata|Un sasso viene lanciato|Una freccia viene scoccata) verso l'alto a " + MS + r"\. Di quanto sale sopra il punto di lancio, se la resistenza dell'aria è trascurabile\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    v0 = data(errs, m.group(1), "speed")
    if not 2 <= v0 <= 30:
        errs.append("speed out of range")
    answer(sample, errs, v0**2 / (2 * G), "m", lo=Rational(2, 10))
    return "lancio"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un carrello delle montagne russe passa per il punto \$A\$, alto " + M + ", alla velocità di " + MS + r"\. Con che velocità passa per il punto \$B\$, alto " + M + r", se gli attriti sono trascurabili\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    hA, vA, hB = data(errs, m.group(1), "hA"), data(errs, m.group(2), "vA"), data(errs, m.group(3), "hB")
    if not (5 <= hA <= 60 and Rational(11, 10) <= hB and hA - hB >= 3 and Rational(11, 10) <= vA <= 15 and 4 * vA**2 >= 2 * G * (hA - hB)):
        errs.append("data out of range")
    answer(sample, errs, sqrt(vA**2 + 2 * G * (hA - hB)), "m/s")
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "pista-energia":
        errs.append("no track scene")
    elif Rational(str(d.get("hA"))) != hA or Rational(str(d.get("hB"))) != hB or d.get("vA") != m.group(2).replace("{,}", ",") + " m/s":
        errs.append("the scene does not match the data")
    elif d.get("testoA") != m.group(1).replace("{,}", ",") + " m" or d.get("testoB") != m.group(3).replace("{,}", ",") + " m":
        errs.append("the scene labels do not match the data")
    return "pista"


def spring(errs, s, tail):
    m = re.fullmatch(r"Una molla con costante elastica " + NM + ", compressa di " + CM + ", lancia un blocco di " + KG + tail, s)
    if not m:
        return None
    k, x, mass = data(errs, m.group(1), "k", 3), data(errs, m.group(2), "x"), data(errs, m.group(3), "mass")
    if not (101 <= k <= 999 and Rational(11, 10) <= x <= 25 and Rational(11, 100) <= mass <= Rational(99, 10)):
        errs.append("data out of range")
    return k, x / 100, mass


def level4(sample, errs):
    s = prose(sample["problem"])
    got = spring(errs, s, r" su un piano orizzontale liscio\. Con che velocità parte il blocco\?")
    if not got:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    k, x, mass = got
    answer(sample, errs, x * sqrt(k / mass), "m/s", lo=Rational(3, 10), hi=30)
    return "lancio"


def level5(sample, errs):
    s = prose(sample["problem"])
    got = spring(errs, s, r" su un piano liscio, che poi sale in una rampa liscia\. Fino a che altezza, in centimetri, sale il blocco\?")
    if not got:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    k, x, mass = got
    answer(sample, errs, k * x**2 / (2 * mass * G) * 100, "cm", lo=Rational(11, 10), hi=99)
    return "salita"


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
