"""Checker for fis-energia-rotazionale (specs/exercises/fis-energia-rotazionale.md), written from the spec and the
lesson 89-fis-energia-rotazionale.md, not from the generator.

K_rot = I w^2 / 2; for a round body I = c m r^2; a body rolling without slipping at v has K = (1 + c) m v^2 / 2,
reaches the bottom of a drop h at sqrt(2 g h / (1 + c)), goes down an incline at beta with a = g sin(beta) / (1 + c)
and climbs (1 + c) v^2 / (2 g).
"""
import re

from sympy import Rational, pi, sin, sqrt

from checkers._fis_momento_angolare import G, Q, params_match, SHAPE_RE, answer, comma, data, shape
from checkers._vettori import common, prose

CASE_RANGES = {n: {k: (0.12, 0.40) for k in ("anello", "cilindro", "sfera", "sfera-cava")} for n in (2, 3, 4, 5, 6)}

CAP = SHAPE_RE.replace("un", "Un")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(?:Un volano|Una ruota|Una mola) ha momento d'inerzia " + Q("kg·m²") + " e ruota a " + Q("rad/s") + r"\. Quanto vale la sua energia cinetica di rotazione\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    I, w = data(errs, m.group(1), "I"), data(errs, m.group(2), "omega")
    if not (Rational(11, 100) <= I <= Rational(99, 10) and Rational(11, 10) <= w <= 30):
        errs.append("data out of range")
    params_match(sample, errs, I=I, omega=w)
    answer(sample, errs, I * w**2 / 2, "J", lo=1)
    return "volano"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(CAP + " di massa " + Q("kg") + " e raggio " + Q("cm") + " ruota intorno al suo asse a " + Q("rad/s") + r"\. Quanto vale la sua energia cinetica di rotazione\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    key, c = shape(m.group(1))
    mass, r, w = data(errs, m.group(2), "mass"), data(errs, m.group(3), "radius"), data(errs, m.group(4), "omega")
    if not (Rational(11, 100) <= mass <= Rational(99, 10) and 11 <= r <= 45 and 11 <= w <= 99):
        errs.append("data out of range")
    params_match(sample, errs, forma=key, m=mass, r=r, omega=w)
    answer(sample, errs, c * mass * (r / 100) ** 2 * w**2 / 2, "J", lo=1)
    return key


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(CAP + " di massa " + Q("kg") + " rotola senza strisciare a " + Q("m/s") + r"\. Quanto vale la sua energia cinetica totale\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    key, c = shape(m.group(1))
    mass, v = data(errs, m.group(2), "mass"), data(errs, m.group(3), "speed")
    if not (Rational(11, 100) <= mass <= Rational(99, 10) and Rational(11, 10) <= v <= Rational(99, 10)):
        errs.append("data out of range")
    params_match(sample, errs, forma=key, m=mass, v=v)
    answer(sample, errs, (1 + c) * mass * v**2 / 2, "J", lo=1)
    return key


def scene(sample, errs, key, want):
    sc = sample.get("scene") or {}
    d = dict(sc.get("data", {}))
    if sc.get("type") != "rotolamento-piano":
        errs.append("no incline scene")
        return
    d.pop("nome", None)
    if d != {"forma": key, **want}:
        errs.append(f"the scene does not match the data: {d}")


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(CAP + " parte da fermo e rotola senza strisciare lungo una discesa, scendendo di " + Q("m") + r"\. Con che velocità arriva in fondo\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    key, c = shape(m.group(1))
    h = data(errs, m.group(2), "drop")
    if not Rational(11, 100) <= h <= Rational(99, 10):
        errs.append("drop out of range")
    params_match(sample, errs, forma=key, h=h)
    answer(sample, errs, sqrt(2 * G * h / (1 + c)), "m/s")
    scene(sample, errs, key, {"testoH": comma(m.group(2)) + " m"})
    return key


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(CAP + r" rotola senza strisciare lungo un piano inclinato di \$(\d+)\^\\circ\$\. Con quale accelerazione scende il suo centro di massa\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    key, c = shape(m.group(1))
    beta = int(m.group(2))
    if beta % 5 or not 15 <= beta <= 60:
        errs.append("angle out of range")
    params_match(sample, errs, forma=key, beta=Rational(beta))
    answer(sample, errs, G * sin(pi * beta / 180) / (1 + c), "m/s²")
    scene(sample, errs, key, {"angolo": beta, "testoAngolo": f"{beta}°"})
    return key


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(CAP + " rotola senza strisciare su un pavimento a " + Q("m/s") + r" e imbocca una rampa\. Di quanto sale prima di fermarsi\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    key, c = shape(m.group(1))
    v = data(errs, m.group(2), "speed")
    if not Rational(11, 10) <= v <= Rational(99, 10):
        errs.append("speed out of range")
    params_match(sample, errs, forma=key, v=v)
    answer(sample, errs, (1 + c) * v**2 / (2 * G), "m", lo=Rational(1, 10))
    return key


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
    if lvl not in (4, 5) and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
