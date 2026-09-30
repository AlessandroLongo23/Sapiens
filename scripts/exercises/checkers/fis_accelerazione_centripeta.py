"""Checker for fis-accelerazione-centripeta (specs/exercises/fis-accelerazione-centripeta.md), written from the spec and
the lesson 48-fis-accelerazione-centripeta.md, not from the generator.

a_c = v^2 / r with v in m/s (km/h divided by 3,6 first); a_c = 4 pi^2 r / T^2; the greatest speed for an acceleration
a is sqrt(a r); in the same curve a_c goes with the square of the speed, at the same speed with the inverse of the
radius, on the same merry-go-round (same period) with the radius. Exact values with sympy, rounded half up to two
significant figures.
"""
import re

from sympy import Rational, pi, sqrt

from checkers._fis_moti_piano import Q, answer, common, data2, prose

CASE_RANGES = {5: {"velocità": (0.25, 0.42), "raggio": (0.25, 0.42), "periodo": (0.25, 0.42)}}

FACTORS = {"doppia": 2, "tripla": 3, "dimezzata": Rational(1, 2), "doppio": 2, "triplo": 3, "dimezzato": Rational(1, 2)}


def car(errs, a):
    if not Rational(1, 10) <= a <= Rational(99, 10):
        errs.append("a car's acceleration outside 0,1-9,9 m/s^2")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un'auto percorre una curva di raggio " + Q("m") + " alla velocità costante di " + Q("m/s") + r"\. Quanto vale la sua accelerazione centripeta\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    r, v = data2(errs, m.group(1), "r", 11, 99), data2(errs, m.group(2), "v", 2, 30)
    car(errs, v**2 / r)
    answer(sample, errs, v**2 / r, "m/s^2")
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un'auto percorre una rotonda di raggio " + Q("m") + " alla velocità costante di " + Q("km/h") + r"\. Quanto vale la sua accelerazione centripeta\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    r, v = data2(errs, m.group(1), "r", 11, 99), data2(errs, m.group(2), "v", 11, 99) / Rational(36, 10)
    car(errs, v**2 / r)
    answer(sample, errs, v**2 / r, "m/s^2")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un sasso legato a una corda è fatto girare su una circonferenza orizzontale di raggio " + Q("m") + ", e fa un giro in " + Q("s") + r"\. Quanto vale la sua accelerazione centripeta\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    r, T = data2(errs, m.group(1), "r", 0.2, 2.0), data2(errs, m.group(2), "T", 0.3, 3.0)
    a = 4 * pi**2 * r / T**2
    if a < Rational(1, 2):
        errs.append("acceleration under 0,5 m/s^2")
    answer(sample, errs, a, "m/s^2")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Le gomme di un'auto permettono un'accelerazione centripeta di " + Q("m/s^2") + r" al massimo\. Con quale velocità massima l'auto può percorrere una curva di raggio " + Q("m") + r"\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    a, r = data2(errs, m.group(1), "a", 1.1, 9.9), data2(errs, m.group(2), "r", 11, 99)
    answer(sample, errs, sqrt(a * r), "m/s")
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    a = Q("m/s^2")
    if m := re.fullmatch(r"Un'auto percorre una curva con un'accelerazione centripeta di " + a + r"\. Quanto vale la sua accelerazione se percorre la stessa curva a velocità (doppia|tripla|dimezzata)\?", s):
        a1, k = data2(errs, m.group(1), "a1", 0.5, 9.9), FACTORS[m.group(2)]
        answer(sample, errs, a1 * k**2, "m/s^2")
        return "velocità"
    if m := re.fullmatch(r"Un'auto percorre una curva con un'accelerazione centripeta di " + a + r"\. Quanto vale la sua accelerazione se percorre, alla stessa velocità, una curva di raggio (doppio|triplo|dimezzato)\?", s):
        a1, k = data2(errs, m.group(1), "a1", 0.5, 9.9), FACTORS[m.group(2)]
        answer(sample, errs, a1 / k, "m/s^2")
        return "raggio"
    if m := re.fullmatch(r"Su una giostra un bambino ha un'accelerazione centripeta di " + a + r"\. Quanto vale l'accelerazione di un bambino sulla stessa giostra, a una distanza dal centro (doppia|tripla|dimezzata)\?", s):
        a1, k = data2(errs, m.group(1), "a1", 0.5, 9.9), FACTORS[m.group(2)]
        answer(sample, errs, a1 * k, "m/s^2")
        return "periodo"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


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
