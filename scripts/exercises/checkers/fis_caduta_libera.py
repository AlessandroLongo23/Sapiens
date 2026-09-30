"""Checker for fis-caduta-libera (specs/exercises/fis-caduta-libera.md), written from the spec and the lesson
44-fis-caduta-libera.md, not from the generator.

Free fall with g = 49/5 m/s², air neglected, axis upwards: v = v0 - g t, y = y0 + v0 t - g t²/2. From rest a body
falls g t²/2 in a time t, reaching g t; from a height h it takes sqrt(2h/g) and arrives at sqrt(2gh). A throw upwards
at v0 rises v0²/(2g) and is back after 2 v0/g; from a height y0 it reaches the ground when y = 0, at
(v0 + sqrt(v0² + 2 g y0))/g. Exact values; answers rounded half up to two significant figures.
"""
import re

from sympy import Rational, sqrt

from checkers._vettori import prose
from checkers._fis_moto import M, MS, S, answer2, data2

CASE_RANGES = {
    1: {"altezza": (0.40, 0.60), "velocita": (0.40, 0.60)},
    4: {"altezza": (0.40, 0.60), "volo": (0.40, 0.60)},
    5: {"sale": (0.40, 0.60), "scende": (0.40, 0.60)},
}
G = Rational(49, 5)
AIR = r" L'aria si trascura\."
BODY = r"(Un vaso|Un sasso|Una mela|Una chiave)"
LEAD1 = r"Un sasso lasciato cadere da fermo (in un pozzo tocca l|da un ponte arriva all)'acqua dopo " + S + r"\. "
THROW = r"(Una palla|Un sasso|Una moneta) viene lanciat([ao]) verticalmente verso l'alto a " + MS + r"\. "


def agree(errs, body, e):
    if (body.startswith("Una")) != (e == "a"):
        errs.append("agreement")


def time1(errs, s):
    """The time of level 1: 0,50 to 0,99 s with two decimals, or 1,1 to 4,4 s."""
    if re.fullmatch(r"0\{,\}\d\d", s):
        t = Rational(s.replace("{,}", "."))
        if not Rational(1, 2) <= t <= Rational(99, 100) or s.endswith("0"):
            errs.append(f"time {s}")
        return t
    return data2(errs, s, "t", "1.1", "4.4")


def level1(s, sample, errs):
    if m := re.fullmatch(LEAD1 + r"Con che velocità, in modulo, arriva all'acqua\?" + AIR, s):
        answer2(sample, errs, G * time1(errs, m.group(2)), "m/s")
        return "velocita"
    if m := re.fullmatch(LEAD1 + r"(Quanto è profondo il pozzo, fino all'acqua|Quanto è alto il ponte sull'acqua)\?" + AIR + r" Si trascura anche il tempo del suono che risale\.", s):
        if m.group(1).startswith("in un pozzo") != m.group(3).startswith("Quanto è profondo"):
            errs.append("story mixed")
        t = time1(errs, m.group(2))
        answer2(sample, errs, G * t**2 / 2, "m")
        return "altezza"
    errs.append(f"level 1 text not recognised: {s!r}")


def fall(s, errs, question):
    m = re.fullmatch(BODY + r" cade da ferm([ao]) da un'altezza di " + M + r"\. " + question + AIR, s)
    if not m:
        return None
    agree(errs, m.group(1), m.group(2))
    return data2(errs, m.group(3), "h", "1.1", 99)


def level2(s, sample, errs):
    h = fall(s, errs, r"Quanto tempo impiega ad arrivare al suolo\?")
    if h is None:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    answer2(sample, errs, sqrt(2 * h / G), "s")
    return "tempo"


def level3(s, sample, errs):
    h = fall(s, errs, r"Con che velocità, in modulo, arriva al suolo\?")
    if h is None:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    answer2(sample, errs, sqrt(2 * G * h), "m/s")
    return "velocita"


def level4(s, sample, errs):
    if m := re.fullmatch(THROW + r"Quanto sale sopra il punto di lancio\?" + AIR, s):
        agree(errs, m.group(1), m.group(2))
        v0 = data2(errs, m.group(3), "v0", "1.1", 30)
        answer2(sample, errs, v0**2 / (2 * G), "m")
        return "altezza"
    if m := re.fullmatch(THROW + r"Dopo quanto tempo torna al punto di lancio\?" + AIR, s):
        agree(errs, m.group(1), m.group(2))
        v0 = data2(errs, m.group(3), "v0", "1.1", 30)
        answer2(sample, errs, 2 * v0 / G, "s")
        return "volo"
    errs.append(f"level 4 text not recognised: {s!r}")


def level5(s, sample, errs):
    m = re.fullmatch(r"Una palla viene lanciata verticalmente verso l'alto a " + MS + r"\. Con l'asse rivolto verso l'alto, quanto vale la sua velocità dopo " + S + r"\?" + AIR, s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    v0, t = data2(errs, m.group(1), "v0", 5, 30), data2(errs, m.group(2), "t", "1.1", 6)
    if t >= 2 * v0 / G:
        errs.append("the ball is already back on the ground")
    v = v0 - G * t
    if abs(v) < 1:
        errs.append("velocity too close to zero")
    answer2(sample, errs, v, "m/s", positive=False)
    return "sale" if v > 0 else "scende"


def level6(s, sample, errs):
    m = re.fullmatch(r"Da un balcone alto " + M + r" una palla viene lanciata verticalmente verso l'alto a " + MS + r", e poi cade fino al suolo\. Dopo quanto tempo tocca il suolo\?" + AIR, s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    y0, v0 = data2(errs, m.group(1), "y0", "1.1", 40), data2(errs, m.group(2), "v0", "1.1", 20)
    # the positive root of y0 + v0 t - g t²/2 = 0
    answer2(sample, errs, (v0 + sqrt(v0**2 + 2 * G * y0)) / G, "s")
    return "balcone"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    from checkers._vettori import common

    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if sample.get("scene"):
        errs.append("no scene expected")
    try:
        kind = LEVELS[lvl](prose(sample["problem"]), sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
