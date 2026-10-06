"""Checker for fis-sistemi-cosmologici (specs/exercises/fis-sistemi-cosmologici.md), written from the spec and the
lesson 92-fis-sistemi-cosmologici.md, not from the generator.

Ptolemy: at the point of the epicycle nearest to the Earth the planet's speed is v_d - v_e, forwards if positive and
backwards if negative; from radii and periods v_e / v_d = (r/R)(T_d/T_e). Copernicus: an inner planet with greatest
elongation theta is at sin(theta) AU from the Sun; an outer planet with synodic period S has 1/T = 1/T_T - 1/S, an
inner one 1/T = 1/T_T + 1/S, with T_T = 365,25 days.
"""
import re

from sympy import Rational, pi, sin

from checkers._vettori import common, prose
from checkers._fis_keplero_newton import YEAR, answer, dec, fmt, is_sci, q, two, whole

CASE_RANGES = {1: {"avanti": (0.40, 0.60), "indietro": (0.40, 0.60)}}


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"In un modello tolemaico il centro dell'epiciclo avanza sul deferente a " + q("km/s") + r", e il pianeta percorre l'epiciclo a " + q("km/s") + r", nello stesso verso di rotazione\. Visto dalla Terra, come si muove il pianeta nel punto dell'epiciclo più vicino alla Terra\?",
        s,
    )
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    vd = whole(errs, m.group(1), 11, 49, "v_d")
    ve = whole(errs, m.group(2), 11, 49, "v_e")
    diff = abs(vd - ve)
    if diff < 2 or diff % 10 == 0 or (vd + ve) % 10 == 0:
        errs.append("difference under 2, or a result that ends with a zero")
    back = ve > vd
    answer(sample, errs, str(diff), "km/s", tail="indietro" if back else "in avanti", tails=["in avanti", "indietro"])
    return "indietro" if back else "avanti"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"In un modello tolemaico il raggio dell'epiciclo di un pianeta è " + q() + r" volte il raggio del deferente\. Il centro dell'epiciclo fa un giro del deferente in " + q("anni") + r", il pianeta fa un giro dell'epiciclo in " + q("anni") + r"\. Quanto vale il rapporto \$v_e/v_d\$ tra la velocità sull'epiciclo e quella sul deferente\?",
        s,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    if not re.fullmatch(r"0\{,\}[2-8][1-9]", m.group(1)):
        errs.append(f"r/R {m.group(1)} outside 0,21-0,89 or ending with a zero")
    r = dec(m.group(1))
    Td, Te = two(errs, m.group(2), "T_d"), two(errs, m.group(3), "T_e")
    if not (Td >= 1 and Te >= 1) or Td == Te:
        errs.append("periods must be different and between 1,1 and 9,9 years")
    ratio = r * Td / Te
    if not Rational(1, 5) <= ratio <= 9 or abs(ratio - 1) < Rational(8, 100):
        errs.append(f"ratio {float(ratio)} outside 0,2-9 or too close to 1")
    answer(sample, errs, fmt(ratio, 2), "")
    return "indietro" if ratio > 1 else "avanti"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un pianeta interno non si vede mai a più di \$(\d+)\^\\circ\$ dal Sole: è la sua elongazione massima\. La sua orbita è circolare\. Quanto dista dal Sole\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    th = int(m.group(1))
    if not 12 <= th <= 58:
        errs.append("elongation outside 12-58 degrees")
    answer(sample, errs, fmt(sin(pi * th / 180), 2), "UA")
    scene = sample.get("scene") or {}
    if scene.get("type") != "elongazione-pianeta" or scene.get("data", {}).get("angolo") != th or scene.get("data", {}).get("testo") != f"{th}°":
        errs.append("scene missing or with another angle")
    return "elongazione"


def synodic(sample, errs, inner):
    s = prose(sample["problem"])
    if inner:
        pat = r"Un pianeta interno torna nella stessa posizione rispetto al Sole e alla Terra ogni " + q("d") + r": è il suo periodo sinodico\. "
    else:
        pat = r"Un pianeta esterno torna in opposizione ogni " + q("d") + r": è il suo periodo sinodico\. "
    m = re.fullmatch(pat + r"Il periodo della Terra è \$365\{,\}25\\,\\text\{d\}\$\. Quanto dura il giro del pianeta attorno al Sole\?", s)
    if not m:
        errs.append(f"synodic text not recognised: {s!r}")
        return None
    S = whole(errs, m.group(1), 101, 899, "S") if inner else whole(errs, m.group(1), 601, 999, "S")
    T = 1 / (1 / YEAR + 1 / S) if inner else 1 / (1 / YEAR - 1 / S)
    right = fmt(T, 3)
    if right is not None and is_sci(right):
        errs.append("the period should be written without a power of ten")
    answer(sample, errs, right, "d")
    return "interno" if inner else "esterno"


LEVELS = {1: level1, 2: level2, 3: level3, 4: lambda s, e: synodic(s, e, False), 5: lambda s, e: synodic(s, e, True)}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if lvl != 3 and sample.get("scene"):
        errs.append("only level 3 has a scene")
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
