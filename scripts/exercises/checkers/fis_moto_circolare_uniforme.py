"""Checker for fis-moto-circolare-uniforme (specs/exercises/fis-moto-circolare-uniforme.md), written from the spec and
the lesson 47-fis-moto-circolare-uniforme.md, not from the generator.

f = turns / time, T = 1 / f, with revolutions per minute f = n / 60; v = 2 pi r / T (radius in metres, period in
seconds); omega = 2 pi / T = 2 pi f; v = omega r; all the points of a wheel share omega, so v2 = v1 r2 / r1 and
T = 2 pi r1 / v1. Exact values with sympy, answers rounded half up to two significant figures.
"""
import re

from sympy import Integer, Rational, pi

from checkers._fis_moti_piano import Q, answer, common, data2, prose

CASE_RANGES = {
    1: {"giri al minuto": (0.40, 0.60), "giri nel tempo": (0.40, 0.60)},
    2: {"min": (0.25, 0.42), "m": (0.25, 0.42), "cm": (0.25, 0.42)},
    3: {"periodo": (0.40, 0.60), "frequenza": (0.40, 0.60)},
    4: {"velocità": (0.40, 0.60), "velocità angolare": (0.40, 0.60)},
    5: {"velocità": (0.40, 0.60), "periodo": (0.40, 0.60)},
}


def level1(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Il cestello di una lavatrice in centrifuga fa \$(\d+)\$ giri al minuto\. Quanto dura un giro\?", s):
        n = int(m.group(1))
        if n not in (400, 600, 800, 1000, 1200, 1400, 1600):
            errs.append("spin speed not in the list")
        answer(sample, errs, Rational(60, n), "s")
        return "giri al minuto"
    m = re.fullmatch(r"(Una ruota|Un disco|Una trottola|Una giostra) fa \$(\d+)\$ giri in " + Q("s") + r"\. Quanto vale la frequenza del suo moto\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    N = int(m.group(2))
    if not (11 <= N <= 99 and N % 10):
        errs.append("number of turns outside the rule")
    f = Integer(N) / data2(errs, m.group(3), "time", 2, 99)
    if f < Rational(1, 5):
        errs.append("frequency under 0,2 Hz")
    answer(sample, errs, f, "Hz")
    return "giri nel tempo"


def level2(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Una ruota panoramica di raggio " + Q("m") + " fa un giro in " + Q("min") + r"\. Con quale velocità si muove un seggiolino\?", s):
        r, T, kind = data2(errs, m.group(1), "r", 11, 60), data2(errs, m.group(2), "T", 2, 20) * 60, "min"
    elif m := re.fullmatch(r"Una giostra fa un giro in " + Q("s") + r"\. Con quale velocità si muove un cavallino a " + Q("m") + r" dal centro\?", s):
        T, r, kind = data2(errs, m.group(1), "T", 5, 30), data2(errs, m.group(2), "r", 1.1, 9.9), "m"
    elif m := re.fullmatch(r"Le pale di un ventilatore sono lunghe " + Q("cm") + " e fanno un giro in " + Q("s") + r"\. Con quale velocità si muove la punta di una pala\?", s):
        r, T, kind = data2(errs, m.group(1), "r", 11, 60) / 100, data2(errs, m.group(2), "T", 0.05, 0.99), "cm"
    else:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    v = 2 * pi * r / T
    if v < Rational(1, 10):
        errs.append("speed under 0,1 m/s")
    answer(sample, errs, v, "m/s")
    return kind


def level3(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Un punto si muove di moto circolare uniforme e fa un giro in " + Q("s") + r"\. Quanto vale la sua velocità angolare\?", s):
        answer(sample, errs, 2 * pi / data2(errs, m.group(1), "T", 0.2, 60), "rad/s")
        return "periodo"
    if m := re.fullmatch(r"Un disco gira con la frequenza di " + Q("Hz") + r"\. Quanto vale la sua velocità angolare\?", s):
        answer(sample, errs, 2 * pi * data2(errs, m.group(1), "f", 0.11, 15), "rad/s")
        return "frequenza"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Una ruota di raggio " + Q("m") + r" fa \$(\d+(?:\{,\}\d+)?)\$ giri al minuto\. Con quale velocità si muove un punto del bordo\?", s):
        r, n = data2(errs, m.group(1), "r", 0.11, 2.0), data2(errs, m.group(2), "rpm", 11, 99)
        v = 2 * pi * n / 60 * r
        if v < Rational(1, 10):
            errs.append("speed under 0,1 m/s")
        answer(sample, errs, v, "m/s")
        return "velocità"
    if m := re.fullmatch(r"Un punto percorre una circonferenza di raggio " + Q("m") + " alla velocità costante di " + Q("m/s") + r"\. Quanto vale la sua velocità angolare\?", s):
        r, v = data2(errs, m.group(1), "r", 0.11, 9.9), data2(errs, m.group(2), "v", 1.1, 99)
        answer(sample, errs, v / r, "rad/s")
        return "velocità angolare"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Su una giostra che gira, Anna è seduta a " + Q("m") + " dal centro e va a " + Q("m/s") + "; Bruno è seduto a " + Q("m") + r" dal centro\. (Con quale velocità si muove Bruno\?|Quanto dura un giro della giostra\?)",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    r1, v1, r2 = data2(errs, m.group(1), "r1", 0.5, 5.0), data2(errs, m.group(2), "v1", 0.5, 9.9), data2(errs, m.group(3), "r2", 0.5, 5.0)
    if Rational(10, 13) * r1 < r2 < Rational(13, 10) * r1:
        errs.append("radii too close")
    if m.group(4).startswith("Con quale"):
        answer(sample, errs, v1 * r2 / r1, "m/s")
        return "velocità"
    answer(sample, errs, 2 * pi * r1 / v1, "s")
    return "periodo"


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
    return errs, kind
