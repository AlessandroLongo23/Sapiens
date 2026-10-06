"""Checker for fis-portata-continuita (specs/exercises/fis-portata-continuita.md), written from the spec and the lesson
98-fis-portata-continuita.md, not from the generator. The problem is read back from its text.

q = ΔV/Δt; q = S·v, with 1 cm²·m/s = 0,1 L/s; S1·v1 = S2·v2; for round pipes v2 = v1·(D1/D2)²; q = π r² v with
r = D/2; a pipe that splits into n equal branches carries v·(D/D2)²/n in each.
"""
import re

from sympy import Rational, pi, sqrt

from checkers._fis_fluidi_moto import Q, answer, data, label, scene
from checkers._vettori import common, prose

CASE_RANGES = {3: {"stringe": (0.60, 0.80), "allarga": (0.20, 0.40)}, 4: {"cm": (0.40, 0.60), "mm": (0.40, 0.60)}}


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(?:Un rubinetto riempie una tanica|Una pompa riempie un bidone|Una fontana riempie un secchio) da " + Q("L") + " in " + Q("s") + r"\. Qual è la portata (?:del rubinetto|della pompa|della fontana)\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    V, dt = data(errs, m.group(1), "volume", 11, 99), data(errs, m.group(2), "time", 11, 99)
    answer(sample, errs, V / dt, "L/s")
    return "portata"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un tubo di sezione " + Q("cm2") + " l'acqua scorre alla velocità di " + Q("m/s") + r"\. Qual è la portata, in litri al secondo\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    S, v = data(errs, m.group(1), "section", 1.1, 25), data(errs, m.group(2), "speed", 0.5, 6)
    # S cm² = S·10⁻⁴ m²; m³/s = 10³ L/s
    answer(sample, errs, S * Rational(1, 10**4) * v * 1000, "L/s")
    return "portata"


def pipe(sample, errs, ratio, labels):
    d = scene(errs, sample, "tubo-sezioni")
    if d is None:
        return
    if abs(Rational(str(d.get("rapporto"))) - ratio) > Rational(1, 1000):
        errs.append(f"scene ratio {d.get('rapporto')} != {ratio.evalf(5)}")
    if d.get("etichette") != labels:
        errs.append(f"scene labels {d.get('etichette')} != {labels}")
    if d.get("salita"):
        errs.append("the pipe of this level is horizontal")


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un tubo di sezione " + Q("cm2") + " l'acqua scorre a " + Q("m/s") + r"\. Più avanti il tubo (si stringe|si allarga) fino a una sezione di " + Q("cm2") + r"\. Con che velocità scorre l'acqua nel secondo tratto\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    S1, v1, S2 = data(errs, m.group(1), "S1"), data(errs, m.group(2), "v1"), data(errs, m.group(4), "S2")
    kind = "stringe" if m.group(3) == "si stringe" else "allarga"
    big, small = max(S1, S2), min(S1, S2)
    if (kind == "stringe") != (S1 > S2):
        errs.append("the text says the opposite of the sections")
    if not Rational(3, 2) <= big / small <= 8:
        errs.append(f"ratio of the sections {big / small} out of 1,5-8")
    answer(sample, errs, v1 * S1 / S2, "m/s")
    pipe(sample, errs, sqrt(S2 / S1), {"uno": label("S_1", m.group(1), "cm²"), "due": label("S_2", m.group(4), "cm²"), "v1": label("v_1", m.group(2), "m/s"), "v2": "v_2 = ?"})
    return kind


def level4(sample, errs):
    s = prose(sample["problem"])
    for u in ("cm", "mm"):
        m = re.fullmatch(r"In un tubo di diametro " + Q(u) + " l'acqua scorre a " + Q("m/s") + r"\. Il tubo termina con un ugello di diametro " + Q(u) + r"\. Con che velocità esce l'acqua dall'ugello\?", s)
        if m:
            break
    else:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    D1, v1, D2 = data(errs, m.group(1), "D1"), data(errs, m.group(2), "v1", 0.3, 3), data(errs, m.group(3), "D2")
    if not Rational(13, 10) <= D1 / D2 <= 4:
        errs.append(f"ratio of the diameters {D1 / D2} out of 1,3-4")
    answer(sample, errs, v1 * (D1 / D2) ** 2, "m/s")
    pipe(sample, errs, D2 / D1, {"uno": label("D_1", m.group(1), u), "due": label("D_2", m.group(3), u), "v1": label("v_1", m.group(2), "m/s"), "v2": "v_2 = ?"})
    return u


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un tubo di diametro interno " + Q("cm") + " l'acqua scorre a " + Q("m/s") + r"\. Quanti litri al minuto porta il tubo\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    D, v = data(errs, m.group(1), "diameter", 1.1, 5), data(errs, m.group(2), "speed", 0.2, 2.5)
    r = D / 2 / 100  # m
    answer(sample, errs, pi * r**2 * v * 1000 * 60, "L/min")
    return "portata"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un tubo di diametro " + Q("cm") + " porta acqua alla velocità di " + Q("m/s") + r" e si divide in \$(\d)\$ tubi uguali, ciascuno di diametro " + Q("cm") + r"\. Con che velocità scorre l'acqua in ciascuno dei tubi più piccoli\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    D, v, n, D2 = data(errs, m.group(1), "D"), data(errs, m.group(2), "v", 0.5, 4), int(m.group(3)), data(errs, m.group(4), "D2")
    if n not in (2, 3, 4, 6):
        errs.append(f"{n} branches")
    if not Rational(12, 10) <= D / D2 <= Rational(35, 10):
        errs.append(f"ratio of the diameters {D / D2} out of 1,2-3,5")
    answer(sample, errs, v * (D / D2) ** 2 / n, "m/s")
    return "rami"


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
