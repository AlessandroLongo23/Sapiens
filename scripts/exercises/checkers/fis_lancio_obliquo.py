"""Checker for fis-lancio-obliquo (specs/exercises/fis-lancio-obliquo.md), written from the spec and the lesson
76-fis-lancio-obliquo.md, not from the generator.

Launched at v0 with an angle alpha above the horizontal: the components are v0 cos(alpha) and v0 sin(alpha); from the
ground the body rises to (v0 sin alpha)^2 / 2g, flies for 2 v0 sin(alpha) / g and lands v0^2 sin(2 alpha) / g away;
the speed that gives a range L is sqrt(g L / sin(2 alpha)). From a height h the flight lasts
(v0y + sqrt(v0y^2 + 2 g h)) / g and the range is v0x times that. g = 49/5 exactly, exact trigonometry with sympy,
answers with two significant figures; the scene has the data of the text and no answer.
"""
import re

from sympy import Rational, cos, sin, sqrt

from checkers._vettori import common, prose
from checkers._fis_forze_movimento import G, answer, data2, q, rad

CASE_RANGES = {1: {"orizzontale": (0.40, 0.60), "verticale": (0.40, 0.60)}}
BODY = r"(Un pallone viene calciato|Una palla viene lanciata|Un sasso viene lanciato)"
ANG = r"\$(\d+)\^\\circ\$"
GROUND_ANGLES = {20, 25, 30, 35, 40, 50, 55, 60, 65, 70}
HIGH_ANGLES = {20, 25, 30, 35, 40, 50, 55, 60}
QUESTIONS = {
    2: "Quale altezza massima raggiunge?",
    3: "Dopo quanto tempo ricade a terra?",
    4: "A che distanza dal punto di lancio ricade a terra?",
}


def lab(s, unit):
    return f"{s.replace('{,}', ',')} {unit}"


def speed(errs, s):
    v = data2(errs, s, "speed")
    if not (5 <= v < 10 or 10 < v <= 35):
        errs.append(f"speed {s} outside 5-35 m/s")
    return v


def angle(errs, s, allowed):
    a = int(s)
    if a not in allowed:
        errs.append(f"angle {a} not allowed")
    return a


def scene(sample, errs, key, want, forbid=()):
    sc = sample.get(key) or {}
    d = sc.get("data", {})
    if sc.get("type") != "lancio-obliquo":
        errs.append(f"{key} is not lancio-obliquo")
        return d
    for k, val in want.items():
        if d.get(k) != val:
            errs.append(f"{key} {k} = {d.get(k)!r}, expected {val!r}")
    for k in forbid:
        if k in d:
            errs.append(f"{key} gives away {k}")
    return d


def path_ok(errs, d, L, h):
    p = d.get("traiettoria") or {}
    if abs(float(p.get("L", -1)) - float(L)) > 1e-3 or abs(float(p.get("h", -1)) - float(h)) > 1e-3:
        errs.append("solution path does not match")


def launched(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + r" da terra a " + q("m/s") + r", con un angolo di " + ANG + r" sull'orizzontale\. (.*)", s)
    if not m:
        errs.append(f"level {sample['level']} text not recognised: {s!r}")
        return None
    _, v0s, angs, question = m.groups()
    v0 = speed(errs, v0s)
    a = angle(errs, angs, GROUND_ANGLES)
    vx, vy = v0 * cos(rad(a)), v0 * sin(rad(a))
    lvl = sample["level"]
    want = {"angolo": a, "alfa": f"{a}°", "v0": lab(v0s, "m/s")}
    scene(sample, errs, "scene", want, forbid=("L", "h", "traiettoria"))
    if lvl == 1:
        if question == "Quanto vale la componente orizzontale della velocità iniziale?":
            answer(sample, errs, vx, "m/s")
            return "orizzontale"
        if question == "Quanto vale la componente verticale della velocità iniziale?":
            answer(sample, errs, vy, "m/s")
            return "verticale"
        errs.append(f"level 1 question {question!r}")
        return None
    if question != QUESTIONS[lvl]:
        errs.append(f"level {lvl} question {question!r}")
        return None
    if lvl == 2:
        h = vy**2 / (2 * G)
        answer(sample, errs, h, "m", lo=Rational(1, 5))
    elif lvl == 3:
        answer(sample, errs, 2 * vy / G, "s")
    else:
        L = v0**2 * sin(rad(2 * a)) / G
        answer(sample, errs, L, "m")
        d = scene(sample, errs, "solutionScene", want)
        path_ok(errs, d, L, 0)
    return "lancio"


def inverse(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + r" da terra con un angolo di " + ANG + r" sull'orizzontale e ricade a terra a " + q("m") + r" dal punto di lancio\. Con quale velocità è partit([ao])\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    body, angs, Ls, e = m.groups()
    if (e == "a") != body.startswith("Una"):
        errs.append("agreement")
    a = angle(errs, angs, GROUND_ANGLES)
    L = data2(errs, Ls, "range")
    v0 = sqrt(G * L / sin(rad(2 * a)))
    answer(sample, errs, v0, "m/s", lo=3, hi=35)
    scene(sample, errs, "scene", {"angolo": a, "alfa": f"{a}°", "L": lab(Ls, "m")}, forbid=("v0", "h", "traiettoria"))
    return "inverso"


def from_height(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Una palla viene lanciata da un balcone alto|Un sasso viene lanciato dalla cima di una scogliera alta) " + q("m") + r", a " + q("m/s") + r", con un angolo di " + ANG + r" sopra l'orizzontale\. A che distanza dalla base tocca il suolo\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    place, hs, v0s, angs = m.groups()
    h = data2(errs, hs, "height")
    if not 2 <= h <= 60:
        errs.append(f"height {hs} outside 2-60 m")
    if place.startswith("Una palla") != (h < 10):
        errs.append("place does not match the height")
    v0 = speed(errs, v0s)
    a = angle(errs, angs, HIGH_ANGLES)
    vx, vy = v0 * cos(rad(a)), v0 * sin(rad(a))
    tv = (vy + sqrt(vy**2 + 2 * G * h)) / G
    L = vx * tv
    answer(sample, errs, L, "m")
    want = {"angolo": a, "alfa": f"{a}°", "v0": lab(v0s, "m/s"), "h": lab(hs, "m")}
    scene(sample, errs, "scene", want, forbid=("L", "traiettoria"))
    d = scene(sample, errs, "solutionScene", want)
    path_ok(errs, d, L, h)
    return "quota"


LEVELS = {1: launched, 2: launched, 3: launched, 4: launched, 5: inverse, 6: from_height}


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
