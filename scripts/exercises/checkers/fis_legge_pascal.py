"""Checker for fis-legge-pascal (specs/exercises/fis-legge-pascal.md), written from the spec and the lesson
27-fis-legge-pascal.md. The problem is read back from its text. Pascal's law: the rise of pressure p = F/S is the same
everywhere in the liquid; in a hydraulic press F1/S1 = F2/S2, the areas in the ratio of the squares of the diameters,
and the volume of liquid is the same, S1·s1 = S2·s2. Weights with g = 9,8 N/kg. Data with two significant figures,
answers rounded half up to two, no ties. From level 2 on the scene must be the press with the text's data.
"""
import re

from sympy import Rational

from checkers._fis_fluidi import G, expect, grab, need, scene
from checkers.forze_comune import common, prose

CASE_RANGES = {
    3: {"stesse-unita": (0.40, 0.60), "unita-diverse": (0.40, 0.60)},
    5: {"sale": (0.40, 0.60), "scende": (0.40, 0.60)},
}

CM2 = Rational(1, 10**4)
LOADS = {"un'auto": ("appoggiata", 800, 2000), "un furgone": ("appoggiato", 2000, 3500), "una cassa": ("appoggiata", 200, 900), "una moto": ("appoggiata", 150, 300)}


def plain(q):
    """The plain-text writing of a datum for the scene's labels, from its digits as the text writes them: 5{,}5 -> 5,5."""
    if "cdot" in q[2]:
        raise ValueError("datum in scientific notation")
    return q[2].replace("{,}", ",").replace("\\,", " ")


def press_scene(errs, sample, a1, a2, labels, diam=False):
    d = scene(errs, sample, "torchio-idraulico")
    if not d:
        return d
    key = "diametri" if diam else "aree"
    got = d.get(key)
    if not got or abs(Rational(str(got[1])) / Rational(str(got[0])) - Rational(a2) / Rational(a1)) > Rational(1, 10**6):
        errs.append(f"scene {key} {got} not in the ratio of the text's")
    if d.get("etichette") != labels:
        errs.append(f"scene labels {d.get('etichette')} != {labels}")
    return d


def level1(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"Una siringa piena d'acqua ha lo stantuffo di area {Q} e la punta chiusa da un tappo di area {Q}\. Si spinge lo stantuffo con una forza di {Q}\. Di quanto aumenta la pressione dell'acqua vicino al tappo\?", s)
    if not g:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    S = need(errs, g[0], "cm^2", what="plunger")
    St = need(errs, g[1], "cm^2", what="cap")
    F = need(errs, g[2], "N", what="force")
    if St >= S:
        errs.append("the cap is not smaller than the plunger")
    expect(errs, sample, F / (S * CM2), "Pa")
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"In un torchio idraulico il pistone piccolo ha l'area di {Q} e quello grande di {Q}\. Sul pistone piccolo si spinge con una forza di {Q}\. Quanto vale la forza che il liquido esercita sul pistone grande\?", s)
    if not g:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    S1 = need(errs, g[0], "cm^2", what="S1")
    S2 = need(errs, g[1], "cm^2", what="S2")
    F1 = need(errs, g[2], "N", what="F1")
    if not 5 <= S2 / S1 <= 200:
        errs.append(f"ratio {S2 / S1} out of 5-200")
    expect(errs, sample, F1 * S2 / S1, "N")
    d = press_scene(errs, sample, S1, S2, [f"S_1 = {plain(g[0])} cm²", f"S_2 = {plain(g[1])} cm²"])
    if d and d.get("forza") != f"F_1 = {plain(g[2])} N":
        errs.append("scene force label differs from the text")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"Un sollevatore idraulico regge (un'auto|un furgone|una cassa|una moto) di {Q}, (appoggiat[oa]) su un pistone di area {Q}\. Il pistone piccolo ha l'area di {Q}\. Con che forza bisogna spingere sul pistone piccolo\?", s)
    if not g or LOADS[g[0]][0] != g[2]:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    M = need(errs, g[1], "kg", what="mass")
    _, lo, hi = LOADS[g[0]]
    if not lo <= M <= hi:
        errs.append(f"mass {M} not believable for {g[0]}")
    v2, u2, _ = g[3]
    S2 = need(errs, g[3], u2, what="S2") * (1 if u2 == "m^2" else CM2)
    if u2 not in ("m^2", "cm^2"):
        errs.append(f"S2 in {u2}")
    S1 = need(errs, g[4], "cm^2", what="S1") * CM2
    if not 10 <= S2 / S1 <= 500:
        errs.append(f"ratio {S2 / S1} out of 10-500")
    expect(errs, sample, M * G * S1 / S2, "N")
    unit2 = "m²" if u2 == "m^2" else "cm²"
    d = press_scene(errs, sample, S1, S2, [f"S_1 = {plain(g[4])} cm²", f"S_2 = {plain(g[3])} {unit2}"])
    if d and d.get("carico") != f"{plain(g[1])} kg":
        errs.append("scene load differs from the text")
    return "unita-diverse" if u2 == "m^2" else "stesse-unita"


def level4(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"In un torchio idraulico i pistoni hanno i diametri di {Q} e di {Q}\. Sul pistone piccolo agisce una forza di {Q}\. Quanto vale la forza sul pistone grande\?", s)
    if not g:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    D1 = need(errs, g[0], "cm", what="D1")
    D2 = need(errs, g[1], "cm", what="D2")
    F1 = need(errs, g[2], "N", what="F1")
    if not 2 <= D2 / D1 <= 15:
        errs.append(f"ratio of the diameters {D2 / D1} out of 2-15")
    expect(errs, sample, F1 * (D2 / D1) ** 2, "N")
    press_scene(errs, sample, D1, D2, [f"D_1 = {plain(g[0])} cm", f"D_2 = {plain(g[1])} cm"], diam=True)
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"In un torchio idraulico il pistone piccolo ha l'area di {Q} e quello grande di {Q}\. Il pistone piccolo scende di {Q}\. Di quanto sale il pistone grande\?", s)
    if g:
        S1 = need(errs, g[0], "cm^2", what="S1")
        S2 = need(errs, g[1], "cm^2", what="S2")
        s1 = need(errs, g[2], "cm", what="s1")
        expect(errs, sample, s1 * S1 / S2, "cm")
        press_scene(errs, sample, S1, S2, [f"S_1 = {plain(g[0])} cm²", f"S_2 = {plain(g[1])} cm²"])
        return "sale"
    g = grab(r"In un torchio idraulico il pistone piccolo ha l'area di {Q} e quello grande di {Q}\. Di quanto deve scendere il pistone piccolo perché quello grande salga di {Q}\?", s)
    if g:
        S1 = need(errs, g[0], "cm^2", what="S1")
        S2 = need(errs, g[1], "cm^2", what="S2")
        s2 = need(errs, g[2], "cm", what="s2")
        truth = s2 * S2 / S1
        if truth > 990:
            errs.append(f"s1 = {truth} cm too long")
        expect(errs, sample, truth, "cm")
        press_scene(errs, sample, S1, S2, [f"S_1 = {plain(g[0])} cm²", f"S_2 = {plain(g[1])} cm²"])
        return "scende"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


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
