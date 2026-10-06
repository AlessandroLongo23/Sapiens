"""Checker for fis-satelliti (specs/exercises/fis-satelliti.md), written from the spec and the lesson
96-fis-satelliti.md, not from the generator.

On a circular orbit of radius r around a body of mass M gravity is the centripetal force: v = sqrt(G M / r), and for
a satellite at a height h above a body of radius R the radius of the orbit is R + h. The period is 2 pi r / v, that
is 2 pi sqrt(r^3 / (G M)); so T^2 / r^3 = 4 pi^2 / (G M) (Kepler's third law), which gives the central mass,
4 pi^2 r^3 / (G T^2), and the radius from the period, the cube root of G M T^2 / (4 pi^2). Around the same body, an
orbit n times as wide is run 1/sqrt(n) as fast and takes n sqrt(n) as long. G = 6,67 · 10^-11, three figures.
"""
import re

from mpmath import mp
from sympy import Rational

from checkers._vettori import common, prose
from checkers._fis_campo_orbite import BODY, BODY_CAP, G, answer, body_mass, data3, density, mpf, no_scene, outside, q, scene

CASE_RANGES = {4: {"velocita": (0.40, 0.60), "periodo": (0.40, 0.60)}}
MASS = Rational(10) ** 22, Rational(10) ** 28
RADIUS = r"Un satellite percorre un'orbita circolare di raggio " + q("m") + r" intorno a " + BODY


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(RADIUS + r" di massa " + q("kg") + r"\. Con quale velocità si muove\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    r = data3(errs, m.group(1), "radius")
    M = data3(errs, m.group(3), "mass", *MASS)
    outside(errs, M, r)
    body_mass(errs, m.group(2), M)
    no_scene(sample, errs)
    answer(sample, errs, mp.sqrt(mpf(G * M / r)), "m/s")
    return "raggio"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY_CAP + r" ha massa " + q("kg") + r" e raggio " + q("m") + r"\. Un satellite percorre un'orbita circolare a una quota di " + q("m") + r" sopra la sua superficie\. Con quale velocità si muove\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    M = data3(errs, m.group(2), "mass", *MASS)
    R = data3(errs, m.group(3), "radius")
    h = data3(errs, m.group(4), "height")
    density(errs, M, R)
    body_mass(errs, m.group(1), M)
    if not Rational(5, 100) <= h / R <= Rational(5, 2):
        errs.append(f"height {float(h / R):.3f} radii, outside 0.05-2.5")
    scene(sample, errs, (R + h) / R, True, {"R": m.group(3), "h": m.group(4)})
    answer(sample, errs, mp.sqrt(mpf(G * M / (R + h))), "m/s")
    return "quota"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(RADIUS + r" di massa " + q("kg") + r"\. Quanto tempo impiega a fare un giro\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    r = data3(errs, m.group(1), "radius")
    M = data3(errs, m.group(3), "mass", *MASS)
    outside(errs, M, r)
    body_mass(errs, m.group(2), M)
    no_scene(sample, errs)
    answer(sample, errs, 2 * mp.pi * mp.sqrt(mpf(r**3 / (G * M))), "s")
    return "periodo"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Due satelliti percorrono orbite circolari intorno a (una stessa luna|uno stesso pianeta)\. Il raggio dell'orbita del secondo è (\d) volte quello del primo\. "
        r"(?:Il primo si muove a " + q("m/s") + r"\. Con quale velocità si muove il secondo\?|Il primo fa un giro in " + q("s") + r"\. In quanto tempo fa un giro il secondo\?)",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    n = int(m.group(2))
    if n not in (2, 3, 4, 5, 9):
        errs.append(f"ratio {n} not allowed")
    no_scene(sample, errs)
    if m.group(3):
        v1 = data3(errs, m.group(3), "speed", 1000, 10**5)
        answer(sample, errs, mpf(v1) / mp.sqrt(n), "m/s")
        return "velocita"
    T1 = data3(errs, m.group(4), "period", 1000, 10**5)
    answer(sample, errs, mpf(T1) * n * mp.sqrt(n), "s")
    return "periodo"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(RADIUS + r", e fa un giro in " + q("s") + r"\. Quanto vale la massa (del pianeta|della luna)\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    if (m.group(2) == "una luna") != (m.group(4) == "della luna"):
        errs.append("body and its article disagree")
    r = data3(errs, m.group(1), "radius")
    T = data3(errs, m.group(3), "period")
    M = 4 * mp.pi**2 * mpf(r**3) / (mpf(G) * mpf(T**2))
    if not mp.mpf("9.8e21") <= M <= mp.mpf("1.02e28"):
        errs.append("central mass outside 10^22-10^28 kg (with the slack of the rounded period)")
    outside(errs, M, r, 1.25, 16.5)
    body_mass(errs, m.group(2), M)
    no_scene(sample, errs)
    answer(sample, errs, M, "kg")
    return "massa"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un satellite deve fare un giro intorno a " + BODY + r" di massa " + q("kg") + r" in " + q("s") + r", su un'orbita circolare\. Quale deve essere il raggio dell'orbita\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    M = data3(errs, m.group(2), "mass", *MASS)
    T = data3(errs, m.group(3), "period")
    r = mp.cbrt(mpf(G * M * T**2) / (4 * mp.pi**2))
    outside(errs, M, r, 1.25, 16.5)
    body_mass(errs, m.group(1), M)
    no_scene(sample, errs)
    answer(sample, errs, r, "m")
    return "raggio"


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
    return errs, kind
