"""Checker for fis-diagramma-corpo-libero (specs/exercises/fis-diagramma-corpo-libero.md), written from the spec and
the lesson 53-fis-diagramma-corpo-libero.md, not from the generator.

Level 1: the number of forces on a body, from a table written again here. Level 2: a crate on a smooth floor pulled
by a rope at alpha, a = F cos(alpha) / m. Level 3: the floor's reaction, P - F sin(alpha) with the rope lifting,
P + F sin(alpha) with a handle pushing down. Level 4: the rope at alpha with kinetic friction,
a = (F cos(alpha) - mu_d (P - F sin(alpha))) / m. Level 5: a scale in a lift reads m (g + a) / g, with a positive when
the acceleration points up (starting upwards, braking downwards). Level 6: from the reading r, a = g (r - m) / m, up if
r > m. g = 49/5, exact trigonometry with sympy.
"""
import re

from sympy import Rational, cos, pi, sin

from checkers._dinamica import ACC, ANG, G, KG, NW, answer2, data2, no_scene, scene_forces
from checkers._vettori import check_choice, common, num, prose

CASE_RANGES = {
    3: {"tira": (0.40, 0.60), "spinge": (0.40, 0.60)},
    5: {"parte-su": (0.18, 0.32), "frena-su": (0.18, 0.32), "parte-giu": (0.18, 0.32), "frena-giu": (0.18, 0.32)},
    6: {"su": (0.40, 0.60), "giu": (0.40, 0.60)},
}

COUNTS = {
    "un libro fermo su un tavolo": 2,
    "una lampada appesa al soffitto con un filo": 2,
    "un disco da hockey che scivola sul ghiaccio, se l'attrito si trascura": 2,
    "un sasso in volo dopo il lancio, se la resistenza dell'aria si trascura": 1,
    "una cassa tirata con una fune orizzontale su un pavimento senza attrito": 3,
    "una cassa trascinata sul pavimento con una fune orizzontale, con l'attrito": 4,
    "un quadro appeso a un chiodo con due fili": 3,
    "una cassa ferma su un piano inclinato, trattenuta dall'attrito": 3,
    "un libro fermo su un tavolo, premuto dall'alto da una mano": 3,
    "una persona in un ascensore che sale a velocità costante": 2,
}
# phase of the lift -> sign of the vertical acceleration
PHASES = {"parte verso l'alto": ("parte-su", 1), "sale e sta frenando": ("frena-su", -1), "parte verso il basso": ("parte-giu", -1), "scende e sta frenando": ("frena-giu", 1)}


def rad(d):
    return pi * Rational(d) / 180


def slant_ok(errs, a):
    if not (20 <= a <= 35 or 55 <= a <= 65):
        errs.append(f"angle {a} outside 20-35 and 55-65")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Quante forze agiscono su (.+)\?", s)
    if not m or m.group(1) not in COUNTS:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    n = COUNTS[m.group(1)]
    opts = check_choice(sample, errs, str(n))
    try:
        ks = [int(o) for o in opts]
    except ValueError:
        errs.append(f"options are not whole numbers: {opts}")
        return None
    if ks != list(range(ks[0], ks[0] + 4)) or ks[0] < 1:
        errs.append(f"options {ks} are not four consecutive numbers from 1")
    no_scene(sample, errs)
    return "conta"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una cassa di " + KG + r" su un pavimento liscio, senza attrito, è tirata con una fune inclinata di " + ANG + r" sull'orizzontale, con una forza di " + NW + r"\. Quanto vale l'accelerazione della cassa\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    mass, a, F = data2(errs, m.group(1), "mass"), int(m.group(2)), data2(errs, m.group(3), "force")
    slant_ok(errs, a)
    if F * sin(rad(a)) >= Rational(8, 10) * mass * G:
        errs.append("the rope lifts the crate too much")
    answer2(sample, errs, F * cos(rad(a)) / mass, "acc", low=Rational(0))
    scene_forces(sample, errs, "blocco-forze", [("F", None, m.group(3), a)])
    return "fune"


def level3(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Una cassa di " + KG + r" è tirata sul pavimento con una fune inclinata di " + ANG + r" sopra l'orizzontale, con una forza di " + NW + r"\. Quanto vale la reazione del pavimento\?", s):
        kind, sign = "tira", -1
    elif m := re.fullmatch(r"Un carrello di " + KG + r" è spinto sul pavimento con un manico inclinato di " + ANG + r" sotto l'orizzontale, con una forza di " + NW + r"\. Quanto vale la reazione del pavimento\?", s):
        kind, sign = "spinge", 1
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    mass, a, F = data2(errs, m.group(1), "mass"), int(m.group(2)), data2(errs, m.group(3), "force")
    slant_ok(errs, a)
    P, Fy = mass * G, F * sin(rad(a))
    if Fy < Rational(15, 100) * P or (sign < 0 and Fy > Rational(8, 10) * P):
        errs.append("vertical component outside the ranges")
    answer2(sample, errs, P + sign * Fy, "N")
    scene_forces(sample, errs, "blocco-forze" if sign < 0 else "punto-forze", [("F", None, m.group(3).replace("{,}", "."), a if sign < 0 else -a)])
    return kind


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una cassa di " + KG + r" è tirata sul pavimento con una fune inclinata di " + ANG + r" sopra l'orizzontale, con una forza di " + NW + r"; il coefficiente di attrito dinamico è \$\\mu_d = (0\{,\}\d\d)\$\. Quanto vale l'accelerazione della cassa\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass, a, F, mu = data2(errs, m.group(1), "mass"), int(m.group(2)), data2(errs, m.group(3), "force"), num(m.group(4))
    if not (20 <= a <= 35 and Rational(1, 10) <= mu <= Rational(1, 2)):
        errs.append("angle or coefficient outside the ranges")
    P = mass * G
    Fx, Fy = F * cos(rad(a)), F * sin(rad(a))
    if Fy > Rational(8, 10) * P:
        errs.append("the rope lifts the crate too much")
    net = Fx - mu * (P - Fy)
    if net < Fx / 4:
        errs.append("friction too close to the pull")
    answer2(sample, errs, net / mass, "acc", low=Rational(0))
    scene_forces(sample, errs, "blocco-forze", [("F", None, m.group(3), a)])
    return "attrito"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una persona di " + KG + r" sta su una bilancia pesapersone in un ascensore che (.+), con un'accelerazione di " + ACC + r"\. Quanto segna la bilancia\?", s)
    if not m or m.group(2) not in PHASES:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    kind, sign = PHASES[m.group(2)]
    mass, a = data2(errs, m.group(1), "mass"), data2(errs, m.group(3), "acceleration")
    if mass < 40 or not Rational(11, 10) <= a <= Rational(39, 10):
        errs.append("mass or acceleration outside the ranges")
    answer2(sample, errs, mass * (G + sign * a) / G, "kg")
    no_scene(sample, errs)
    return kind


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una persona di " + KG + r" sta su una bilancia pesapersone in un ascensore\. Mentre l'ascensore si muove, la bilancia segna " + KG + r"\. Quanto vale l'accelerazione dell'ascensore\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    mass, r = data2(errs, m.group(1), "mass"), data2(errs, m.group(2), "reading")
    d = r - mass
    if mass < 40 or not 2 <= abs(d) <= 20:
        errs.append("mass or reading outside the ranges")
    up = d > 0
    answer2(sample, errs, G * abs(d) / mass, "acc", low=Rational(0), direction="verso l'alto" if up else "verso il basso")
    no_scene(sample, errs)
    return "su" if up else "giu"


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
