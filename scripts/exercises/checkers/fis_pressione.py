"""Checker for fis-pressione (specs/exercises/fis-pressione.md), written from the spec and the lesson
26-fis-pressione.md. The problem is read back from its text; the pressure is p = F/S with the area in m²
(1 cm² = 10^-4 m², 1 mm² = 10^-6 m²), the force of a body on a horizontal table its weight m·g with g = 9,8 N/kg.
Every datum has two significant figures (the block's edges and faces excepted), the answer is the exact value rounded
half up to two, and an exact tie is refused.
"""
import re

from sympy import Rational

from checkers._fis_fluidi import G, expect, grab, need
from checkers.forze_comune import common, prose

CASE_RANGES = {
    2: {"cm2": (0.60, 0.80), "mm2": (0.20, 0.40)},
    4: {"forza": (0.40, 0.60), "area": (0.40, 0.60)},
    5: {"massima": (0.40, 0.60), "minima": (0.40, 0.60)},
}

TEN = Rational(10)
AREA = {"m^2": Rational(1), "cm^2": TEN**-4, "mm^2": TEN**-6}
THINGS = ["Una cassa", "Uno scatolone", "Una valigia", "Un baule", "Un mobiletto", "Una lavatrice"]
BODIES = {
    "Un vaso": ("appoggiato", 1, Rational(99, 10)),
    "Una valigia": ("appoggiata", 10, 30),
    "Uno zaino": ("appoggiato", 3, Rational(99, 10)),
    "Una cassa": ("appoggiata", 10, 99),
    "Un televisore": ("appoggiato", 5, 30),
    "Una pila di libri": ("appoggiata", 2, Rational(99, 10)),
}


def level1(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"(.+?) preme sul pavimento con una forza di {Q}, distribuita su una superficie di {Q}\. Quanto vale la pressione sul pavimento\?", s)
    if not g or g[0] not in THINGS:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    F = need(errs, g[1], "N", what="force")
    S = need(errs, g[2], "m^2", what="area")
    if not (10 <= F <= 990 and Rational(1, 100) <= S <= Rational(99, 100)):
        errs.append("data out of range")
    expect(errs, sample, F / S, "Pa")
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"Una forza di {Q} agisce perpendicolarmente su una superficie di {Q}\. Quanto vale la pressione in pascal\?", s)
    if not g:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    F = need(errs, g[0], "N", what="force")
    S, u, _ = g[1]
    need(errs, g[1], u, what="area")
    if u not in ("cm^2", "mm^2"):
        errs.append(f"area in {u}, expected cm^2 or mm^2")
        return None
    expect(errs, sample, F / (S * AREA[u]), "Pa")
    return u.replace("^", "")


def level3(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"(.+?) di massa {Q} è (appoggiat[oa]) su un tavolo orizzontale e lo tocca su una superficie di {Q}\. Che pressione esercita sul tavolo\?", s)
    if not g or g[0] not in BODIES or BODIES[g[0]][0] != g[2]:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    m = need(errs, g[1], "kg", what="mass")
    _, lo, hi = BODIES[g[0]]
    if not lo <= m <= hi:
        errs.append(f"mass {m} not believable for {g[0]}")
    S = need(errs, g[3], "cm^2", what="area")
    expect(errs, sample, m * G / (S * AREA["cm^2"]), "Pa")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"Su una superficie di {Q} agisce una pressione di {Q}\. Quanto vale la forza perpendicolare alla superficie\?", s)
    if g:
        S = need(errs, g[0], "cm^2", what="area")
        p = need(errs, g[1], "kPa", what="pressure")
        expect(errs, sample, p * 1000 * S * AREA["cm^2"], "N")
        return "forza"
    g = grab(r"Quale area deve avere una superficie perché una forza perpendicolare di {Q} eserciti su di essa una pressione di {Q}\? Scrivi il risultato in centimetri quadrati\.", s)
    if g:
        F = need(errs, g[0], "N", what="force")
        p = need(errs, g[1], "kPa", what="pressure")
        truth = F / (p * 1000) / AREA["cm^2"]
        if not 1 <= truth <= 999:
            errs.append(f"area {truth} cm² out of range")
        expect(errs, sample, truth, "cm^2")
        return "area"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    g = grab(
        r"Un blocco di massa {Q} ha la forma di un parallelepipedo con gli spigoli di {Q}, {Q} e {Q}\. Si può appoggiare sul pavimento su una qualunque delle sue facce\. Qual è la pressione (più alta|più bassa) che può esercitare sul pavimento\?",
        s,
    )
    if not g:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    m = need(errs, g[0], "kg", what="mass")
    edges = [need(errs, e, "cm", what="edge") for e in g[1:4]]
    if len(set(edges)) != 3:
        errs.append("two equal edges")
    a, b, c = sorted(edges)
    faces = [a * b, a * c, b * c]
    density = m * 1000 / (a * b * c)  # g/cm³
    if not Rational(45, 100) <= density <= Rational(85, 10):
        errs.append(f"density {float(density):.2f} g/cm³ not believable")
    highest = g[4] == "più alta"
    face = faces[0] if highest else faces[2]
    expect(errs, sample, m * G / (face * AREA["cm^2"]), "Pa")
    return "massima" if highest else "minima"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
