"""Checker for fis-primo-principio (specs/exercises/fis-primo-principio.md), written from the spec and the lesson
50-fis-primo-principio.md, not from the generator.

At constant velocity the total force is zero. Level 1: the air on a parachute, or a rope lifting a load, equals the
weight m * 49/5. Level 2: dragging at constant velocity, the rope's tension equals mu_d * m g, so mu_d = T / (m g).
Level 3: a suitcase pulled along a handle at alpha: the braking force equals F cos(alpha), and F = F_x / cos(alpha).
Level 4: two perpendicular ropes, the friction equals sqrt(F1^2 + F2^2). Exact trigonometry with sympy.
"""
import re

from sympy import Rational, cos, pi, sqrt

from checkers._dinamica import ANG, G, KG, NW, answer2, data2, no_scene, scene_forces
from checkers._vettori import common, num, prose

CASE_RANGES = {
    1: {"paracadute": (0.40, 0.60), "fune": (0.40, 0.60)},
    2: {"coefficiente": (0.40, 0.60), "forza": (0.40, 0.60)},
    3: {"frenante": (0.40, 0.60), "maniglia": (0.40, 0.60)},
}

LOADS = {"Un secchio": "o", "Una cassetta": "a", "Un sacco di sabbia": "o"}


def rad(d):
    return pi * Rational(d) / 180


def level1(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Un pacco di " + KG + r" scende con il paracadute a velocità costante\. Quanto vale la forza dell'aria sul pacco e sul paracadute, di massa trascurabile\?", s):
        kind, mass = "paracadute", data2(errs, m.group(1), "mass")
    elif m := re.fullmatch(r"(Un secchio|Una cassetta|Un sacco di sabbia) di " + KG + r" viene sollevat([ao]) con una fune a velocità costante\. Quanto vale la tensione della fune\?", s):
        kind, mass = "fune", data2(errs, m.group(2), "mass")
        if LOADS[m.group(1)] != m.group(3):
            errs.append("agreement")
    else:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    if not Rational(11, 10) <= mass <= Rational(99, 10):
        errs.append("mass outside 1,1-9,9 kg")
    answer2(sample, errs, mass * G, "N")
    no_scene(sample, errs)
    return kind


def level2(sample, errs):
    s = prose(sample["problem"])
    head = r"Una cassetta di " + KG + r" è trascinata sul pavimento con una fune orizzontale, a velocità costante; "
    if m := re.fullmatch(head + r"la tensione della fune è di " + NW + r"\. Quanto vale il coefficiente di attrito dinamico\?", s):
        mass, F = data2(errs, m.group(1), "mass"), data2(errs, m.group(2), "force")
        ratio = F / (mass * G)
        if not Rational(1, 10) <= ratio <= Rational(8, 10):
            errs.append("coefficient outside 0,10-0,80")
        answer2(sample, errs, ratio, "", low=Rational(0))
        scene_forces(sample, errs, "blocco-forze", [("T", None, m.group(2).replace("{,}", "."), 0)])
        return "coefficiente"
    if m := re.fullmatch(head + r"il coefficiente di attrito dinamico è \$\\mu_d = (0\{,\}\d\d)\$\. Quanto vale la tensione della fune\?", s):
        mass, mu = data2(errs, m.group(1), "mass"), num(m.group(2))
        if not Rational(10, 100) <= mu <= Rational(60, 100):
            errs.append("mu outside 0,10-0,60")
        answer2(sample, errs, mu * mass * G, "N")
        no_scene(sample, errs)
        return "forza"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Una valigia su rotelle è tirata a velocità costante con una forza di " + NW + r", lungo la maniglia inclinata di " + ANG + r" sull'orizzontale\. Quanto vale la forza che frena la valigia, parallela al pavimento\?", s):
        F, a = data2(errs, m.group(1), "force"), int(m.group(2))
        kind, truth = "frenante", F * cos(rad(a))
        scene_forces(sample, errs, "blocco-forze", [("F", None, m.group(1).replace("{,}", "."), a)])
    elif m := re.fullmatch(r"Una valigia su rotelle è tirata a velocità costante lungo la maniglia inclinata di " + ANG + r" sull'orizzontale; la forza che frena la valigia, parallela al pavimento, è di " + NW + r"\. Con quale forza è tirata la maniglia\?", s):
        a, Fx = int(m.group(1)), data2(errs, m.group(2), "force")
        kind, truth = "maniglia", Fx / cos(rad(a))
        no_scene(sample, errs)
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    if not 25 <= a <= 60:
        errs.append("angle outside 25-60")
    answer2(sample, errs, truth, "N")
    return kind


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Due ragazzi tirano una cassa sul pavimento con due funi orizzontali perpendicolari tra loro, con forze di " + NW + " e " + NW + r"\. La cassa striscia a velocità costante\. Quanto vale l'attrito\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    F1, F2 = data2(errs, m.group(1), "force"), data2(errs, m.group(2), "force")
    if F1 == F2 or min(F1, F2) < Rational(4, 10) * max(F1, F2):
        errs.append("forces equal or too different")
    answer2(sample, errs, sqrt(F1**2 + F2**2), "N")
    scene_forces(sample, errs, "punto-forze", [("F", "1", m.group(1), 0), ("F", "2", m.group(2), 90)])
    return "funi"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4}


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
