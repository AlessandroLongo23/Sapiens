"""Checker for fis-leggi-gay-lussac (specs/exercises/fis-leggi-gay-lussac.md), written from the spec and the lesson
103-fis-leggi-gay-lussac.md, not from the generator.

With t in degrees Celsius, V = V0 (1 + t/273) at constant pressure and p = p0 (1 + t/273) at constant volume, V0 and
p0 being the values at 0 °C; with T = t + 273, V1/T1 = V2/T2 and p1/T1 = p2/T2; in a cylinder with a free piston
h1/T1 = h2/T2.
"""
import re

from sympy import Rational

from checkers._fis_gas_leggi import INT, SIG2, SIG3, ZERO_C, common, cylinder, expect, label_number, parse, prose, qty

CASE_RANGES = {}


def three_figures(errs, s, what):
    """A value from 1,01 to 9,99 written with two decimals, not ending in zero."""
    if not re.fullmatch(r"\d\{,\}\d[1-9]", s):
        errs.append(f"{what} {s} is not written as x,xx without a final zero")
    return parse(s)


def kilopascals(errs, s, lo, hi, what):
    v = parse(s)
    if not (v.is_integer and lo <= v <= hi and v % 10 != 0):
        errs.append(f"{what} {s} out of range or ending in zero")
    return v


def whole(errs, s, lo, hi, what):
    v = parse(s)
    if not (v.is_integer and lo <= v <= hi):
        errs.append(f"{what} {s} out of range")
    return v


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas occupa " + qty("L") + r" a \$0\\,\^\\circ\\text\{C\}\$\. Viene scaldato a pressione costante fino a " + qty("C") + r"\. Che volume occupa\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    V0 = three_figures(errs, m.group(1), "volume")
    t = whole(errs, m.group(2), 10, 200, "temperature")
    expect(sample, errs, V0 * (1 + t / ZERO_C), "L", SIG3)
    return "volume"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un recipiente rigido contiene gas alla pressione di " + qty("kPa") + r" quando è a \$0\\,\^\\circ\\text\{C\}\$\. A quale temperatura la pressione arriva a " + qty("kPa") + r"\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    p0 = kilopascals(errs, m.group(1), 101, 299, "pressure at 0 °C")
    p = kilopascals(errs, m.group(2), 102, 598, "pressure")
    t = ZERO_C * (p / p0 - 1)
    if not 15 <= t <= 270:
        errs.append(f"temperature {t} out of range")
    expect(sample, errs, t, "C", INT, plain_answer=False)
    return "temperatura"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas, sotto un pistone libero di scorrere, occupa " + qty("L") + r" a " + qty("C") + r"\. A pressione costante viene (scaldato|raffreddato) fino a " + qty("C") + r"\. Che volume occupa\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    V1 = three_figures(errs, m.group(1), "volume")
    t1 = whole(errs, m.group(2), 5, 40, "initial temperature")
    t2 = whole(errs, m.group(4), -40, 250, "final temperature")
    if abs(t2 - t1) < 20 or t2 == 0:
        errs.append("the two temperatures are too close, or the final one is zero")
    if (m.group(3) == "scaldato") != (t2 > t1):
        errs.append("the verb does not match the temperatures")
    expect(sample, errs, V1 * (t2 + ZERO_C) / (t1 + ZERO_C), "L", SIG3)
    return "scaldato" if t2 > t1 else "raffreddato"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una bombola rigida contiene gas alla pressione di " + qty("kPa") + r" a " + qty("C") + r"\. A quale temperatura, in gradi Celsius, la pressione raggiunge " + qty("kPa") + r"\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    p1 = kilopascals(errs, m.group(1), 101, 299, "initial pressure")
    t1 = whole(errs, m.group(2), 5, 35, "initial temperature")
    p2 = kilopascals(errs, m.group(3), 112, 598, "final pressure")
    if not Rational(11, 10) <= p2 / p1 <= 2:
        errs.append(f"ratio of the pressures {p2 / p1} out of range")
    expect(sample, errs, (t1 + ZERO_C) * p2 / p1 - ZERO_C, "C", INT, signed=True, plain_answer=False)
    return "bombola"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un cilindro con un pistone libero di scorrere contiene gas a " + qty("C") + r", e il pistone è a " + qty("cm") + r" dal fondo\. Il gas viene scaldato fino a " + qty("C") + r"\. Di quanto sale il pistone\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    t1 = whole(errs, m.group(1), 10, 40, "initial temperature")
    h1 = parse(m.group(2))
    if not (15 <= h1 <= 40 and re.fullmatch(r"\d\d\{,\}\d", m.group(2))):
        errs.append(f"height {m.group(2)} not between 15,0 and 40,0 cm with one decimal")
    t2 = whole(errs, m.group(3), 40, 290, "final temperature")
    if not 30 <= t2 - t1 <= 250:
        errs.append("temperature rise out of range")
    h2 = h1 * (t2 + ZERO_C) / (t1 + ZERO_C)
    if h2 - h1 < 1:
        errs.append("the piston rises less than a centimetre")
    expect(sample, errs, h2 - h1, "cm", SIG2)
    before = cylinder(errs, sample.get("scene"), "level 5")
    labels = before.get("etichette", {})
    if Rational(str(before.get("altezza", 0))) != h1 or label_number(labels.get("h", "")) != h1 or label_number(labels.get("gas", "")) != t1 or "prima" in before:
        errs.append("the scene does not show the piston at h1 and the gas at t1")
    after = cylinder(errs, sample.get("solutionScene"), "level 5 solution")
    if abs(Rational(str(after.get("altezza", 0))) - h2) > Rational(1, 1000) or Rational(str(after.get("prima", 0))) != h1:
        errs.append("the solution's scene does not show the piston at h2")
    return "pistone"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
