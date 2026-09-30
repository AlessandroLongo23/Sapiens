"""Checker for fis-forza-centripeta (specs/exercises/fis-forza-centripeta.md), written from the spec and the lesson
57-fis-forza-centripeta.md, not from the generator.

On a circle of radius r at speed v the centripetal force is m v^2 / r; with the period T, v = 2 pi r / T. On a flat
curve friction holds the car up to mu_s m g, so v_max = sqrt(mu_s g r). A disc held by a hanging mass M at rest
through a hole: m v^2 / r = M g. At the top of a vertical circle T + m g = m v^2 / r: the least speed is sqrt(g r),
and the tension m v^2 / r - m g. g = 49/5 exactly, answers with two significant figures.
"""
import re

from sympy import Rational, pi, sqrt

from checkers._vettori import common, num, prose
from checkers._fis_forze_movimento import G, answer, data2, q

CASE_RANGES = {5: {"velocita": (0.40, 0.60), "tensione": (0.40, 0.60)}}
TINY = Rational(11, 100), Rational(99, 100)
SMALL = Rational(11, 10), Rational(99, 10)


def tiny_or_small(errs, s, what):
    x = data2(errs, s, what)
    if not (TINY[0] <= x <= TINY[1] or SMALL[0] <= x <= SMALL[1]):
        errs.append(f"{what} {s} outside 0.11-0.99 and 1.1-9.9")
    return x


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una pallina di " + q("kg") + r", legata a un filo, gira su un tavolo orizzontale liscio lungo una circonferenza di raggio " + q("m") + ", a " + q("m/s") + r"\. Quanto vale la tensione del filo\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass = data2(errs, m.group(1), "mass", *TINY)
    r = tiny_or_small(errs, m.group(2), "radius")
    v = data2(errs, m.group(3), "speed", *SMALL)
    answer(sample, errs, mass * v**2 / r, "N")
    return "filo"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una pallina di " + q("kg") + r", legata a un filo, gira su un tavolo orizzontale liscio lungo una circonferenza di raggio " + q("m") + r", e compie un giro ogni " + q("s") + r"\. Quanto vale la tensione del filo\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    mass = data2(errs, m.group(1), "mass", *TINY)
    r = tiny_or_small(errs, m.group(2), "radius")
    T = tiny_or_small(errs, m.group(3), "period")
    answer(sample, errs, mass * (2 * pi * r / T) ** 2 / r, "N")
    return "periodo"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un'auto percorre una curva piana di raggio " + q("m") + r"; tra le gomme e l'asfalto \$\\mu_s = (0\{,\}\d\d)\$\. Qual è la velocità più alta con cui può affrontare la curva senza slittare\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    r = data2(errs, m.group(1), "radius", 11, 99)
    mu = num(m.group(2))
    if not Rational(20, 100) <= mu <= Rational(99, 100):
        errs.append("mu_s outside 0.20-0.99")
    answer(sample, errs, sqrt(mu * G * r), "m/s")
    return "curva"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un disco di " + q("kg") + r" scivola su un tavolo a cuscino d'aria, legato a un filo che passa per un foro al centro del tavolo e regge un pesetto di " + q("kg") + r", fermo\. Il disco gira su una circonferenza di raggio " + q("m") + r"\. Con quale velocità\?",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    md = data2(errs, m.group(1), "disc", *TINY)
    mh = data2(errs, m.group(2), "hanging mass", *TINY)
    r = data2(errs, m.group(3), "radius", *TINY)
    answer(sample, errs, sqrt(mh * G * r / md), "m/s", lo=Rational(1, 2))
    return "disco"


def level5(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Un secchio d'acqua viene fatto girare in verticale, su una circonferenza di raggio " + q("m") + r"\. Qual è la velocità più piccola che deve avere nel punto più alto perché l'acqua non cada\?", s):
        r = tiny_or_small(errs, m.group(1), "radius")
        answer(sample, errs, sqrt(G * r), "m/s")
        return "velocita"
    if m := re.fullmatch(r"Una pallina di " + q("kg") + r", legata a un filo lungo " + q("m") + r", gira in verticale\. Nel punto più alto ha una velocità di " + q("m/s") + r"\. Quanto vale lì la tensione del filo\?", s):
        mass = data2(errs, m.group(1), "mass", *TINY)
        r = tiny_or_small(errs, m.group(2), "radius")
        v = data2(errs, m.group(3), "speed", *SMALL)
        if v**2 < Rational(13, 10) * G * r:
            errs.append("v^2 under 1.3 g r")
        answer(sample, errs, mass * v**2 / r - mass * G, "N")
        return "tensione"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if sample.get("scene"):
        errs.append("this generator has no scenes")
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
