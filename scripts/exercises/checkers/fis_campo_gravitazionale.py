"""Checker for fis-campo-gravitazionale (specs/exercises/fis-campo-gravitazionale.md), written from the spec and the
lesson 95-fis-campo-gravitazionale.md, not from the generator.

The field in a point is the force on a test mass divided by the mass. At distance r from the centre of a body of mass
M it is G M / r^2, and at a height h above a body of radius R the distance is R + h. At n radii from the centre the
field is the surface one divided by n^2. Between two bodies, on the segment of their centres, the two fields point
opposite ways and the total is the difference of the moduli. G = 6,67 · 10^-11, three significant figures.
"""
import re

from sympy import Rational

from checkers._vettori import common, prose
from checkers._fis_campo_orbite import BODY, BODY_CAP, G, answer, body_mass, data3, density, no_scene, q, scene

CASE_RANGES = {4: {"quota": (0.40, 0.60), "distanza": (0.40, 0.60)}}


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un punto vicino a " + BODY + r" una sonda di " + q("kg") + r" è attirata con una forza di " + q("N") + r"\. Quanto vale il campo gravitazionale in quel punto\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass = data3(errs, m.group(2), "mass", 101, 999)
    F = data3(errs, m.group(3), "force")
    no_scene(sample, errs)
    answer(sample, errs, F / mass, "N/kg", Rational(99, 100), 31)
    return "forza"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY_CAP + r" ha massa " + q("kg") + r" e raggio " + q("m") + r"\. Quanto vale il campo gravitazionale alla sua superficie\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    M = data3(errs, m.group(2), "mass", Rational(10) ** 22, Rational(10) ** 28)
    R = data3(errs, m.group(3), "radius")
    no_scene(sample, errs)
    density(errs, M, R)
    body_mass(errs, m.group(1), M)
    answer(sample, errs, G * M / R**2, "N/kg")
    return "superficie"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY_CAP + r" ha massa " + q("kg") + r" e raggio " + q("m") + r"\. Quanto vale il campo gravitazionale a una quota di " + q("m") + r" sopra la superficie\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    M = data3(errs, m.group(2), "mass", Rational(10) ** 22, Rational(10) ** 28)
    R = data3(errs, m.group(3), "radius")
    h = data3(errs, m.group(4), "height")
    density(errs, M, R)
    body_mass(errs, m.group(1), M)
    if not Rational(7, 100) <= h / R <= Rational(5, 2):
        errs.append(f"height {float(h / R):.3f} radii, outside 0.07-2.5")
    scene(sample, errs, (R + h) / R, False, {"R": m.group(3), "h": m.group(4)})
    answer(sample, errs, G * M / (R + h) ** 2, "N/kg")
    return "quota"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Alla superficie di " + BODY + r" il campo gravitazionale vale " + q("N/kg") + r"\. Quanto vale a una (quota|distanza dal centro) uguale a (un raggio|\d raggi) (del pianeta|della luna)\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    if (m.group(1) == "una luna") != (m.group(5) == "della luna"):
        errs.append("body and its article disagree")
    g0 = data3(errs, m.group(2), "surface field", 1, 30)
    height = m.group(3) == "quota"
    k = 1 if m.group(4) == "un raggio" else int(m.group(4)[0])
    if height and not 1 <= k <= 5 or not height and not 2 <= k <= 6:
        errs.append(f"{k} radii out of range")
    n = k + 1 if height else k
    no_scene(sample, errs)
    answer(sample, errs, g0 / n**2, "N/kg")
    return "quota" if height else "distanza"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Due corpi celesti di masse " + q("kg") + r" e " + q("kg") + r" hanno i centri a " + q("m") + r" di distanza\. Il punto P sta sul segmento che unisce i centri, a " + q("m") + r" dal primo\. Quanto vale il modulo del campo gravitazionale totale in P\?",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    M1 = data3(errs, m.group(1), "first mass", Rational(10) ** 23, Rational(10) ** 26)
    M2 = data3(errs, m.group(2), "second mass", Rational(10) ** 22, Rational(10) ** 25)
    d = data3(errs, m.group(3), "distance", Rational(10) ** 8, Rational(10) ** 9)
    x = data3(errs, m.group(4), "position")
    if not Rational(19, 100) * d <= x <= Rational(81, 100) * d:
        errs.append("P is not between 0.2 and 0.8 of the segment")
    g1 = G * M1 / x**2
    g2 = G * M2 / (d - x) ** 2
    if abs(g1 - g2) < Rational(15, 100) * max(g1, g2):
        errs.append("the two fields nearly cancel")
    no_scene(sample, errs)
    answer(sample, errs, abs(g1 - g2), "N/kg")
    want = "primo" if g1 > g2 else "secondo"
    if not any(f"punta verso il {want} corpo" in st for st in sample["steps"]):
        errs.append(f"the steps should say the field points to the {want} body")
    return "due"


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
