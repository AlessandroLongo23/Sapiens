"""Checker for moto-uniforme-accelerato (specs/exercises/moto-uniforme-accelerato.md), written from the spec and the
lesson 42-moto-uniforme-accelerato.md, not from the generator.

With a constant acceleration a: v = v0 + a t, Δs = v0 t + a t²/2, v² = v0² + 2 a Δs. A braking car has a < 0 with the
axis along the motion; it stops after v0/|a| having covered v0²/(2|a|). The stopping distance adds the reaction
v0 t_r. Speeds in km/h are divided by 3,6. Exact rationals; answers rounded half up to two significant figures.
"""
import re

from sympy import Rational, sqrt

from checkers._vettori import prose
from checkers._fis_moto import ACC, KMH, M, MS, S, answer2, data2

CASE_RANGES = {
    1: {"accelera": (0.40, 0.60), "frena": (0.40, 0.60)},
    3: {"accelera": (0.40, 0.60), "frena": (0.40, 0.60)},
    4: {"velocita": (0.40, 0.60), "spazio": (0.40, 0.60)},
    5: {"tempo": (0.40, 0.60), "spazio": (0.40, 0.60)},
}
BODY = r"(Un'auto|Uno scooter|Un treno|Una moto)"
FEM = {"Un'auto": "a", "Una moto": "a", "Uno scooter": "o", "Un treno": "o"}
K36 = Rational(36, 10)
REACTION = {"0{,}55", "0{,}65", "0{,}75", "0{,}85", "0{,}95", "1{,}1", "1{,}2", "1{,}3", "1{,}4", "1{,}5"}


def level1(s, sample, errs):
    if m := re.fullmatch(BODY + " viaggia a " + MS + r" e frena con un'accelerazione costante di modulo " + ACC + r"\. Che velocità ha dopo " + S + r"\?", s):
        v0, a, t = data2(errs, m.group(2), "v0", 5, 40), data2(errs, m.group(3), "a", "1.1", "4.9"), data2(errs, m.group(4), "t", "1.1", 20)
        v = v0 - a * t
        if v < v0 / 5:
            errs.append("the car almost stops")
        answer2(sample, errs, v, "m/s")
        return "frena"
    if m := re.fullmatch(BODY + " viaggia a " + MS + " e accelera per " + S + r" con un'accelerazione costante di " + ACC + r"\. Che velocità raggiunge\?", s):
        v0, t, a = data2(errs, m.group(2), "v0", 5, 40), data2(errs, m.group(3), "t", "1.1", 20), data2(errs, m.group(4), "a", "1.1", "4.9")
        answer2(sample, errs, v0 + a * t, "m/s")
        return "accelera"
    errs.append(f"level 1 text not recognised: {s!r}")


def level2(s, sample, errs):
    m = re.fullmatch(BODY + r" parte da ferm([ao]) con un'accelerazione costante di " + ACC + r"\. Quanta strada percorre nei primi " + S + r"\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    if FEM[m.group(1)] != m.group(2):
        errs.append("agreement")
    a, t = data2(errs, m.group(3), "a", "1.1", 6), data2(errs, m.group(4), "t", "1.1", 12)
    x = a * t**2 / 2
    if x < 1:
        errs.append("distance under 1 m")
    answer2(sample, errs, x, "m")
    return "da-fermo"


def level3(s, sample, errs):
    if m := re.fullmatch(BODY + " viaggia a " + MS + r" e frena con un'accelerazione costante di modulo " + ACC + r"\. Quanta strada percorre nei primi " + S + r" di frenata\?", s):
        v0, a, t = data2(errs, m.group(2), "v0", "1.1", 20), data2(errs, m.group(3), "a", "1.1", "4.9"), data2(errs, m.group(4), "t", "1.1", "9.9")
        if v0 - a * t < v0 / 5:
            errs.append("the car almost stops")
        answer2(sample, errs, v0 * t - a * t**2 / 2, "m")
        return "frena"
    if m := re.fullmatch(BODY + " viaggia a " + MS + " e accelera per " + S + r" con un'accelerazione costante di " + ACC + r"\. Quanta strada percorre in quel tempo\?", s):
        v0, t, a = data2(errs, m.group(2), "v0", "1.1", 20), data2(errs, m.group(3), "t", "1.1", "9.9"), data2(errs, m.group(4), "a", "1.1", "4.9")
        answer2(sample, errs, v0 * t + a * t**2 / 2, "m")
        return "accelera"
    errs.append(f"level 3 text not recognised: {s!r}")


def level4(s, sample, errs):
    if m := re.fullmatch(BODY + " viaggia a " + MS + r" e accelera con un'accelerazione costante di " + ACC + " per un tratto di " + M + r"\. Che velocità ha alla fine del tratto\?", s):
        v0, a, d = data2(errs, m.group(2), "v0", "1.1", 20), data2(errs, m.group(3), "a", "1.1", "4.9"), data2(errs, m.group(4), "ds", "1.1", 99)
        answer2(sample, errs, sqrt(v0**2 + 2 * a * d), "m/s")
        return "velocita"
    if m := re.fullmatch(BODY + " accelera in modo uniforme da " + MS + " a " + MS + r", con un'accelerazione di " + ACC + r"\. Quanta strada percorre mentre accelera\?", s):
        v0, v1, a = data2(errs, m.group(2), "v0", "1.1", 20), data2(errs, m.group(3), "v1", "1.1", 40), data2(errs, m.group(4), "a", "1.1", "4.9")
        if v1 < Rational(13, 10) * v0:
            errs.append("final speed not 30% above the initial one")
        answer2(sample, errs, (v1**2 - v0**2) / (2 * a), "m")
        return "spazio"
    errs.append(f"level 4 text not recognised: {s!r}")


LEAD5 = r"Un'auto viaggia a " + KMH + r" e frena con un'accelerazione costante di modulo " + ACC + r" fino a fermarsi\. "


def level5(s, sample, errs):
    if m := re.fullmatch(LEAD5 + r"In quanto tempo si ferma\?", s):
        v, a = data2(errs, m.group(1), "v", 30, 99) / K36, data2(errs, m.group(2), "a", 3, 8)
        answer2(sample, errs, v / a, "s")
        return "tempo"
    if m := re.fullmatch(LEAD5 + r"Quanta strada percorre durante la frenata\?", s):
        v, a = data2(errs, m.group(1), "v", 30, 99) / K36, data2(errs, m.group(2), "a", 3, 8)
        answer2(sample, errs, v**2 / (2 * a), "m")
        return "spazio"
    errs.append(f"level 5 text not recognised: {s!r}")


def level6(s, sample, errs):
    m = re.fullmatch(
        r"Un'auto viaggia a " + KMH + r" quando il guidatore vede un ostacolo\. Il suo tempo di reazione è " + S + r", poi l'auto frena con un'accelerazione costante di modulo " + ACC + r"\. Quanto vale lo spazio di arresto\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    if m.group(2) not in REACTION:
        errs.append(f"reaction time {m.group(2)}")
    v, tr, a = data2(errs, m.group(1), "v", 30, 99) / K36, Rational(m.group(2).replace("{,}", ".")), data2(errs, m.group(3), "a", 3, 8)
    answer2(sample, errs, v * tr + v**2 / (2 * a), "m")
    return "arresto"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    from checkers._vettori import common

    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if sample.get("scene"):
        errs.append("no scene expected")
    try:
        kind = LEVELS[lvl](prose(sample["problem"]), sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
