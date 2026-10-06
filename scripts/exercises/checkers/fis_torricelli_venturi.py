"""Checker for fis-torricelli-venturi (specs/exercises/fis-torricelli-venturi.md), written from the spec and the lesson
100-fis-torricelli-venturi.md, not from the generator. The problem is read back from its text.

g = 9,8 m/s², water 1000 kg/m³, air 1,2 kg/m³. Torricelli: v = sqrt(2 g h), h from the free surface down to the hole;
the jet from a hole y above the ground lands 2 sqrt(h y) away; Venturi: p1 − p2 = ½ d (v2² − v1²) with v2 = v1 S1/S2;
Pitot: v = sqrt(2 Δp / d); lift: F = ½ d (vs² − vi²) S.
"""
import re

from sympy import Rational, sqrt

from checkers._fis_fluidi_moto import G, Q, answer, data, label, scene
from checkers._vettori import common, prose

D_W = 1000
D_AIR = Rational(12, 10)
AIR = r"\$1\{,\}2\\,\\text\{kg/m\}\^3\$"


def tank(sample, errs, labels, level=None, hole=None, ground=False):
    d = scene(errs, sample, "serbatoio-foro")
    if d is None:
        return
    if d.get("etichette") != labels:
        errs.append(f"scene labels {d.get('etichette')} != {labels}")
    if level is not None and (Rational(str(d.get("livello"))) != level or Rational(str(d.get("foro"))) != hole):
        errs.append("scene heights differ from the text")
    if bool(d.get("suolo")) != ground:
        errs.append("scene ground does not match the level")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una cisterna aperta è piena d'acqua\. Nella parete c'è un piccolo foro " + Q("m") + r" sotto la superficie libera\. Con che velocità esce l'acqua dal foro\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    h = data(errs, m.group(1), "depth", 0.2, 9)
    answer(sample, errs, sqrt(2 * G * h), "m/s")
    tank(sample, errs, {"h": label("h", m.group(1), "m")})
    return "foro"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un serbatoio aperto è pieno d'acqua fino a " + Q("m") + " dal fondo\. Nella parete c'è un piccolo foro a " + Q("m") + r" dal fondo\. Con che velocità esce l'acqua dal foro\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    H, y = data(errs, m.group(1), "level", 1.1, 6), data(errs, m.group(2), "hole", 0.2, 3)
    if H - y < Rational(3, 10) or y > Rational(7, 10) * H:
        errs.append(f"hole at {y} of {H}: depth too small")
    answer(sample, errs, sqrt(2 * G * (H - y)), "m/s")
    tank(sample, errs, {"H": label("H", m.group(1), "m"), "y": label("y", m.group(2), "m")}, H, y)
    return "profondita"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una botte appoggiata a terra è piena d'acqua fino a " + Q("m") + " dal suolo\. Da un piccolo foro nella parete, a " + Q("m") + r" dal suolo, esce un getto orizzontale\. A che distanza dalla botte il getto tocca terra\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    H, y = data(errs, m.group(1), "level", 1.1, 4), data(errs, m.group(2), "hole", 0.2, 3)
    h = H - y
    if h < Rational(2, 10) or y > Rational(85, 100) * H:
        errs.append(f"hole at {y} of {H}: depth too small")
    # speed sqrt(2 g h), time of fall sqrt(2 y / g)
    answer(sample, errs, sqrt(2 * G * h) * sqrt(2 * y / G), "m")
    tank(sample, errs, {"H": label("H", m.group(1), "m"), "y": label("y", m.group(2), "m")}, H, y, ground=True)
    return "getto"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un tubo di Venturi orizzontale l'acqua scorre a " + Q("m/s") + " nel tratto largo, che ha sezione " + Q("cm2") + r"\. La strozzatura ha sezione " + Q("cm2") + r"\. Quanto vale la differenza di pressione tra il tratto largo e la strozzatura\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    v1, S1, S2 = data(errs, m.group(1), "v1", 0.5, 4), data(errs, m.group(2), "S1", 3, 40), data(errs, m.group(3), "S2", 1.1, 20)
    if not Rational(14, 10) <= S1 / S2 <= 5:
        errs.append(f"ratio of the sections {S1 / S2} out of 1,4-5")
    v2 = v1 * S1 / S2
    answer(sample, errs, Rational(1, 2) * D_W * (v2**2 - v1**2) / 1000, "kPa", lo=1)
    return "venturi"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Il tubo di Pitot di un aereo misura, tra la presa sulla punta e quella sul fianco, una differenza di pressione di " + Q("kPa") + r"\. La densità dell'aria è " + AIR + r"\. A che velocità vola l'aereo rispetto all'aria\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    dp = data(errs, m.group(1), "pressure difference", 0.2, 6)
    answer(sample, errs, sqrt(2 * dp * 1000 / D_AIR), "m/s")
    return "pitot"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In volo l'aria scorre a " + Q("m/s") + " sopra le ali di un aereo e a " + Q("m/s") + " sotto\. Le ali hanno una superficie totale di " + Q("m2") + " e la densità dell'aria è " + AIR + r"\. Quanto vale la portanza\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    vs, vi, S = data(errs, m.group(1), "vs", 40, 99), data(errs, m.group(2), "vi", 30, 94), data(errs, m.group(3), "S", 11, 60)
    if not 5 <= vs - vi <= 20:
        errs.append(f"difference of the speeds {vs - vi} out of 5-20")
    answer(sample, errs, Rational(1, 2) * D_AIR * (vs**2 - vi**2) * S / 1000, "kN")
    return "portanza"


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
