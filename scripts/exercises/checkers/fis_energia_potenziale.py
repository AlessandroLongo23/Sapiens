"""Checker for fis-energia-potenziale (specs/exercises/fis-energia-potenziale.md), written from the spec and the lesson
62-fis-energia-potenziale.md, not from the generator.

U = m g h with h measured from the chosen reference level (negative below it); the work of the weight is
W = U_i - U_f = m g (h_i - h_f); the elastic energy is U = k x^2 / 2 with x in metres, so x = sqrt(2 U / k).
"""
import re

from sympy import Rational, sqrt

from checkers._fis_energia import G, Q, answer, data
from checkers._vettori import common, prose

CASE_RANGES = {
    2: {"sopra": (0.40, 0.60), "sotto": (0.40, 0.60)},
    3: {"sale": (0.40, 0.60), "scende": (0.40, 0.60)},
}

KG, M, NM, CM, JJ = Q("kg"), Q("m"), Q("N/m"), Q("cm"), Q("J")
BODY = r"(Un vaso|Uno zaino|Una cassa|Un vocabolario|Una pianta in vaso)"


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + " di " + KG + r" è su uno scaffale a " + M + r" dal pavimento\. Quanto vale la sua energia potenziale gravitazionale, con il livello di riferimento sul pavimento\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass, h = data(errs, m.group(2), "mass"), data(errs, m.group(3), "height")
    if not (Rational(11, 10) <= mass <= Rational(99, 10) and Rational(3, 10) <= h <= Rational(99, 10)):
        errs.append("data out of range")
    answer(sample, errs, mass * G * h, "J", lo=1, hi=Rational(995, 10))
    return "U"


def level2(sample, errs):
    s = prose(sample["problem"])
    tail = r"\. Quanto vale la sua energia potenziale gravitazionale rispetto al piano di un tavolo alto " + M + r"\?"
    if m := re.fullmatch(r"Una lampada di " + KG + " è appesa a " + M + " dal pavimento" + tail, s):
        mass, h1, table = data(errs, m.group(1), "mass"), data(errs, m.group(2), "height"), data(errs, m.group(3), "table")
        if not (Rational(15, 10) <= h1 <= Rational(29, 10) and Rational(45, 100) <= table <= Rational(95, 100)):
            errs.append("heights out of range")
        answer(sample, errs, mass * G * (h1 - table), "J", lo=1, hi=Rational(995, 10))
        return "sopra"
    if m := re.fullmatch(r"Una borsa di " + KG + " è appoggiata sul pavimento" + tail, s):
        mass, table = data(errs, m.group(1), "mass"), data(errs, m.group(2), "table")
        if not Rational(45, 100) <= table <= Rational(95, 100):
            errs.append("table out of range")
        answer(sample, errs, -mass * G * table, "J", lo=1, hi=Rational(995, 10))
        return "sotto"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    q = r"\. Quanto lavoro compie la forza-peso\?"
    if m := re.fullmatch(r"Una cassa di " + KG + " viene sollevata da " + M + " a " + M + " di altezza" + q, s):
        kind = "sale"
    elif m := re.fullmatch(r"Un sasso di " + KG + " cade da " + M + " a " + M + " di altezza" + q, s):
        kind = "scende"
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    mass, hi, hf = data(errs, m.group(1), "mass"), data(errs, m.group(2), "start"), data(errs, m.group(3), "end")
    if (hf > hi) != (kind == "sale") or hf == hi:
        errs.append("the heights do not match the story")
    if not all(Rational(5, 10) <= x <= Rational(99, 10) for x in (hi, hf)):
        errs.append("heights out of range")
    answer(sample, errs, mass * G * (hi - hf), "J", lo=1, hi=Rational(995, 10))
    return kind


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una molla con costante elastica " + NM + r" viene (allungata|compressa) di " + CM + r"\. Quanta energia potenziale elastica ha\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    k, x = data(errs, m.group(1), "k", 3), data(errs, m.group(3), "x")
    if not (101 <= k <= 999 and Rational(11, 10) <= x <= 25):
        errs.append("data out of range")
    answer(sample, errs, k * (x / 100) ** 2 / 2, "J", lo=Rational(1, 10), hi=Rational(995, 10))
    return "elastica"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una molla con costante elastica " + NM + r" ha un'energia potenziale elastica di " + JJ + r"\. Di quanti centimetri è deformata\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    k, U = data(errs, m.group(1), "k", 3), data(errs, m.group(2), "U")
    if not (101 <= k <= 999 and Rational(11, 100) <= U <= Rational(99, 10)):
        errs.append("data out of range")
    answer(sample, errs, sqrt(2 * U / k) * 100, "cm", lo=Rational(11, 10), hi=40)
    return "deformazione"


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
    if sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
