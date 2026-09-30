"""Checker for leggi-newton (specs/exercises/leggi-newton.md), written from the spec and the lesson 51-leggi-newton.md,
not from the generator.

F_tot = m a. Level 1: a = F / m. Level 2: F = m a, or m = F / a. Level 3: two opposite forces, a = |F_r - F_l| / m
towards the larger. Level 4: two perpendicular forces, a = sqrt(F1^2 + F2^2) / m. Level 5: kinetic friction
mu_d m g, a = (F - mu_d m g) / m. Level 6: a car from v (in km/h, divided by 3,6) to rest, or from rest to v, in a time
t: the force is m v / t, in scientific notation with two significant figures. g = 49/5, exact arithmetic.
"""
import re

from sympy import Rational, sqrt

from checkers._dinamica import ACC, G, KG, NW, SEC, answer2, answer_sci, data2, no_scene, scene_forces
from checkers._vettori import common, num, prose

CASE_RANGES = {
    2: {"forza": (0.40, 0.60), "massa": (0.40, 0.60)},
    3: {"destra": (0.35, 0.65), "sinistra": (0.35, 0.65)},
    6: {"frenata": (0.40, 0.60), "partenza": (0.40, 0.60)},
}

CARTS = {"Un carrello": "o", "Una slitta": "a", "Una cassa": "a", "un carrello": "o", "una slitta": "a", "una cassa": "a"}
SMALL = (Rational(11, 10), Rational(99, 10))


def in_small(errs, x, what):
    if not SMALL[0] <= x <= SMALL[1]:
        errs.append(f"{what} outside 1,1-9,9")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Un carrello|Una slitta|Una cassa) di " + KG + r" è tirat([ao]) su un piano orizzontale senza attrito da una forza orizzontale di " + NW + r"\. Quanto vale la sua accelerazione\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    if CARTS[m.group(1)] != m.group(3):
        errs.append("agreement")
    mass, F = data2(errs, m.group(2), "mass"), data2(errs, m.group(4), "force")
    in_small(errs, mass, "mass")
    answer2(sample, errs, F / mass, "acc", low=Rational(0))
    scene_forces(sample, errs, "blocco-forze", [("F", None, m.group(4).replace("{,}", "."), 0)])
    return "accelerazione"


def level2(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Quale forza orizzontale serve per dare a (un carrello|una slitta|una cassa) di " + KG + r", su un piano senza attrito, un'accelerazione di " + ACC + r"\?", s):
        mass, a = data2(errs, m.group(2), "mass"), data2(errs, m.group(3), "acceleration")
        in_small(errs, mass, "mass")
        in_small(errs, a, "acceleration")
        answer2(sample, errs, mass * a, "N")
        no_scene(sample, errs)
        return "forza"
    if m := re.fullmatch(r"(Un carrello|Una slitta|Una cassa), tirat([ao]) su un piano orizzontale senza attrito da una forza orizzontale di " + NW + r", ha un'accelerazione di " + ACC + r"\. Quanto vale la sua massa\?", s):
        if CARTS[m.group(1)] != m.group(2):
            errs.append("agreement")
        F, a = data2(errs, m.group(3), "force"), data2(errs, m.group(4), "acceleration")
        in_small(errs, a, "acceleration")
        answer2(sample, errs, F / a, "kg", low=Rational(1, 2))
        scene_forces(sample, errs, "blocco-forze", [("F", None, m.group(3).replace("{,}", "."), 0)])
        return "massa"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una cassa di " + KG + r" sta su una lastra di ghiaccio, dove l'attrito si trascura\. È tirata verso destra con una forza di " + NW + r" e verso sinistra con una forza di " + NW + r"\. Quanto vale la sua accelerazione\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    mass, r, l = data2(errs, m.group(1), "mass"), data2(errs, m.group(2), "force"), data2(errs, m.group(3), "force")
    in_small(errs, mass, "mass")
    if abs(r - l) < 5:
        errs.append("forces too close")
    side = "destra" if r > l else "sinistra"
    answer2(sample, errs, abs(r - l) / mass, "acc", low=Rational(0), direction=f"verso {side}")
    scene_forces(sample, errs, "blocco-forze", [("F", "1", m.group(2), 0), ("F", "2", m.group(3), 180)])
    return side


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una slitta di " + KG + r" sul ghiaccio, dove l'attrito si trascura, è tirata da due funi orizzontali perpendicolari tra loro, con forze di " + NW + " e " + NW + r"\. Quanto vale la sua accelerazione\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass, F1, F2 = data2(errs, m.group(1), "mass"), data2(errs, m.group(2), "force"), data2(errs, m.group(3), "force")
    in_small(errs, mass, "mass")
    if F1 == F2 or min(F1, F2) < Rational(4, 10) * max(F1, F2):
        errs.append("forces equal or too different")
    answer2(sample, errs, sqrt(F1**2 + F2**2) / mass, "acc", low=Rational(0))
    scene_forces(sample, errs, "punto-forze", [("F", "1", m.group(2), 0), ("F", "2", m.group(3), 90)])
    return "perpendicolari"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una cassa di " + KG + r" striscia sul pavimento, tirata con una forza orizzontale di " + NW + r"; il coefficiente di attrito dinamico è \$\\mu_d = (0\{,\}\d\d)\$\. Quanto vale l'accelerazione della cassa\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    mass, F, mu = data2(errs, m.group(1), "mass"), data2(errs, m.group(2), "force"), num(m.group(3))
    in_small(errs, mass, "mass")
    Fd = mu * mass * G
    if not (Rational(1, 10) <= mu <= Rational(1, 2) and Rational(13, 10) * Fd <= F <= 3 * Fd):
        errs.append("data outside the ranges")
    answer2(sample, errs, (F - Fd) / mass, "acc", low=Rational(0))
    scene_forces(sample, errs, "blocco-forze", [("F", None, m.group(2), 0)])
    return "attrito"


def level6(sample, errs):
    s = prose(sample["problem"])
    mass_re = r"\$(\d\{,\}\d) \\cdot 10\^3\\,\\text\{kg\}\$"
    speed_re = r"\$(\d\d)\\,\\text\{km/h\}\$"
    if m := re.fullmatch(r"Un'auto di " + mass_re + r" viaggia a " + speed_re + r" e si ferma in " + SEC + r" con accelerazione costante\. Quanto vale la forza frenante\?", s):
        kind = "frenata"
    elif m := re.fullmatch(r"Un'auto di " + mass_re + r" parte da ferma e raggiunge " + speed_re + r" in " + SEC + r" con accelerazione costante\. Quanto vale la forza totale sull'auto\?", s):
        kind = "partenza"
    else:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    mant, kmh, t = num(m.group(1)), int(m.group(2)), data2(errs, m.group(3), "time")
    if not Rational(1) <= mant <= Rational(5, 2) or kmh not in (36, 45, 54, 63, 72, 81):
        errs.append("mass or speed outside the ranges")
    in_small(errs, t, "time")
    v = Rational(kmh) * 5 / 18
    answer_sci(sample, errs, mant * 1000 * v / t, "N")
    no_scene(sample, errs)
    return kind


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
