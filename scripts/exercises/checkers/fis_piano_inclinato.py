"""Checker for fis-piano-inclinato (specs/exercises/fis-piano-inclinato.md), written from the spec and the lesson
54-fis-piano-inclinato.md, not from the generator.

On a smooth incline at alpha the acceleration along it is g sin(alpha), whatever the mass. From rest, a slope of
length l takes sqrt(2 l / a) and ends at sqrt(2 a l). Sliding down with kinetic friction, a = g (sin - mu_d cos).
Launched up a smooth incline at v0, a body stops after v0 / (g sin) and v0^2 / (2 g sin); with friction the
deceleration is g (sin + mu_d cos). g = 49/5 exactly, trigonometry exact with sympy, answers with two significant
figures; the scene is the incline at the angle of the text, with the length when the text gives it.
"""
import re

from sympy import Rational, cos, sin, sqrt, tan

from checkers._vettori import common, prose
from checkers._fis_forze_movimento import ANG, BODY, G, MU, answer, data2, fem, num, q, rad

CASE_RANGES = {
    2: {"tempo": (0.40, 0.60), "velocita": (0.40, 0.60)},
    4: {"spazio": (0.40, 0.60), "tempo": (0.40, 0.60)},
}


def scene(sample, errs, a, length=None):
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "piano-inclinato":
        errs.append("no inclined plane scene")
        return
    if d.get("angolo") != a or d.get("testoAngolo") != f"{a}°":
        errs.append(f"scene angle {d.get('angolo')!r} {d.get('testoAngolo')!r}")
    if length is not None and d.get("lunghezza") != f"{length.replace('{,}', ',')} m":
        errs.append("scene length does not match")
    if length is None and "lunghezza" in d:
        errs.append("scene length not in the text")
    if "forze" in d:
        errs.append("the scene draws forces")


def angle(errs, s, lo, hi):
    a = int(s)
    if not lo <= a <= hi:
        errs.append(f"angle {a} outside {lo}-{hi}")
    return a


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + r" scivola lungo un piano inclinato liscio di " + ANG + r"\. Quanto vale la sua accelerazione\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    a = angle(errs, m.group(2), 10, 60)
    answer(sample, errs, G * sin(rad(a)), "m/s2")
    scene(sample, errs, a)
    return "liscio"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        BODY + r" parte da ferm([ao]) dalla cima di un piano inclinato liscio, lungo " + q("m") + r" e inclinato di " + ANG + r"\. (Quanto tempo impiega ad arrivare in fondo|Con quale velocità arriva in fondo)\?",
        s,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    fem(errs, m.group(1), m.group(2))
    l = data2(errs, m.group(3), "length", Rational(11, 10), Rational(99, 10))
    a = angle(errs, m.group(4), 10, 60)
    acc = G * sin(rad(a))
    if m.group(5).startswith("Quanto tempo"):
        answer(sample, errs, sqrt(2 * l / acc), "s")
        kind = "tempo"
    else:
        answer(sample, errs, sqrt(2 * acc * l), "m/s")
        kind = "velocita"
    scene(sample, errs, a, m.group(3))
    return kind


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + r" scende lungo un piano inclinato di " + ANG + r", con " + MU + r"\. Quanto vale la sua accelerazione\?", s)
    if not m or m.group(3) != "d":
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    a = angle(errs, m.group(2), 15, 60)
    mu = num(m.group(4))
    if not Rational(1, 10) <= mu <= Rational(8, 10):
        errs.append("mu_d outside 0.10-0.80")
    if tan(rad(a)) < Rational(115, 100) * mu:
        errs.append("tan(alpha) under 1.15 mu_d")
    truth = G * (sin(rad(a)) - mu * cos(rad(a)))
    answer(sample, errs, truth, "m/s2", lo=Rational(1, 2))
    scene(sample, errs, a)
    return "attrito"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        BODY + r" viene lanciat([ao]) a " + q("m/s") + r" su per un piano inclinato liscio di " + ANG + r"\. (Quanto spazio percorre lungo il piano prima di fermarsi|Dopo quanto tempo si ferma)\?",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    fem(errs, m.group(1), m.group(2))
    v0 = data2(errs, m.group(3), "speed", Rational(11, 10), Rational(99, 10))
    a = angle(errs, m.group(4), 10, 50)
    dec = G * sin(rad(a))
    scene(sample, errs, a)
    if m.group(5).startswith("Quanto spazio"):
        answer(sample, errs, v0**2 / (2 * dec), "m")
        return "spazio"
    answer(sample, errs, v0 / dec, "s")
    return "tempo"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        BODY + r" viene lanciat([ao]) a " + q("m/s") + r" su per un piano inclinato di " + ANG + r", con " + MU + r"\. Quanto spazio percorre lungo il piano prima di fermarsi\?",
        s,
    )
    if not m or m.group(5) != "d":
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    fem(errs, m.group(1), m.group(2))
    v0 = data2(errs, m.group(3), "speed", Rational(11, 10), Rational(99, 10))
    a = angle(errs, m.group(4), 10, 45)
    mu = num(m.group(6))
    if not Rational(1, 10) <= mu <= Rational(6, 10):
        errs.append("mu_d outside 0.10-0.60")
    answer(sample, errs, v0**2 / (2 * G * (sin(rad(a)) + mu * cos(rad(a)))), "m")
    scene(sample, errs, a)
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
    return errs, kind
