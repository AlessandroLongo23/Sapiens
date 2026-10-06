"""Checker for fis-viscosita (specs/exercises/fis-viscosita.md), written from the spec and the lesson
101-fis-viscosita.md, not from the generator. The problem is read back from its text.

Stokes: F = 6 pi eta r v. Limit speed: m g / (6 pi eta r) without Archimedes' push; for a sphere of density ds,
2 r² g ds / (9 eta); with the push, 2 r² g (ds − dfl) / (9 eta). g = 9,8 m/s². Liquids of the spec: glycerine 1,5 Pa·s
and 1260 kg/m³, honey 10 and 1400, castor oil 0,99 and 960; air 1,8 · 10⁻⁵ Pa·s. Spheres: steel 7800, aluminium 2700,
glass 2500 kg/m³.
"""
import re

from sympy import Rational, pi

from checkers._fis_fluidi_moto import G, Q, answer, data
from checkers._vettori import common, num, prose, round_sig

CASE_RANGES = {1: {k: (0.23, 0.43) for k in ["glicerina", "miele", "ricino"]}}

LIQ = {"nella glicerina": ("glicerina", "1{,}5", 1260), "nel miele": ("miele", "10", 1400), "nell'olio di ricino": ("ricino", "0{,}99", 960)}
LIQ_RX = "(" + "|".join(LIQ) + ")"
SOL = {"d'acciaio": 7800, "d'alluminio": 2700, "di vetro": 2500}
ETA = r"\$\\eta = " + r"(\d+(?:\{,\}\d+)?)" + r"\\,\\text\{Pa\} \\cdot \\text\{s\}\$"
PAS = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{Pa\} \\cdot \\text\{s\}\$"
KGM3 = r"\$(\d+)\\,\\text\{kg/m\}\^3\$"
ETA_AIR = Rational(18, 10**6)
AIR_TEX = r"\$1\{,\}8 \\cdot 10\^\{-5\}\\,\\text\{Pa\} \\cdot \\text\{s\}\$"


def liquid(errs, where, eta_text):
    name, eta, d = LIQ[where]
    if eta_text != eta:
        errs.append(f"viscosity of {name} written {eta_text}, the spec says {eta}")
    return name, num(eta), d


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una sferetta di raggio " + Q("mm") + " scende " + LIQ_RX + r" \(" + ETA + r"\) alla velocità di " + Q("cm/s") + r"\. Quanto vale la forza di attrito viscoso sulla sferetta\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    r = data(errs, m.group(1), "radius", 0.5, 5)
    name, eta, _ = liquid(errs, m.group(2), m.group(3))
    v = data(errs, m.group(4), "speed", 0.5, 9)
    answer(sample, errs, 6 * pi * eta * (r / 1000) * (v / 100) * 1000, "mN", lo=Rational(1, 10))
    return name


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una sferetta d'acciaio di massa " + Q("g") + " e raggio " + Q("mm") + " cade " + LIQ_RX + r" \(" + ETA + r"\)\. Trascurando la spinta di Archimede, quanto vale la sua velocità limite\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    mass = data(errs, m.group(1), "mass")
    r = data(errs, m.group(2), "radius", 1.1, 4)
    name, eta, _ = liquid(errs, m.group(3), m.group(4))
    # the mass is that of a steel sphere of that radius, to two figures
    steel = round_sig(7800 * Rational(4, 3) * pi * (r / 1000) ** 3 * 1000, 2)
    if steel != m.group(1):
        errs.append(f"mass {m.group(1)} g is not that of a steel sphere of radius {r} mm ({steel} g)")
    answer(sample, errs, (mass / 1000) * G / (6 * pi * eta * (r / 1000)) * 100, "cm/s", lo=Rational(1, 10))
    return name


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una gocciolina d'acqua \(" + KGM3 + r"\) di raggio " + Q("um") + " scende nell'aria, che ha viscosità " + AIR_TEX + r"\. La spinta di Archimede è trascurabile\. Quanto vale la velocità limite della gocciolina\?", s)
    if not m or m.group(1) != "1000":
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    r = data(errs, m.group(2), "radius", 3, 28)
    answer(sample, errs, 2 * (r / 10**6) ** 2 * G * 1000 / (9 * ETA_AIR) * 1000, "mm/s")
    return "goccia"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una sferetta (d'acciaio|d'alluminio|di vetro) \(" + KGM3 + r"\) di raggio " + Q("mm") + " cade " + LIQ_RX + ", che ha densità " + KGM3 + " e viscosità " + PAS + r"\. Quanto vale la sua velocità limite, tenendo conto della spinta di Archimede\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    ds = SOL[m.group(1)]
    if int(m.group(2)) != ds:
        errs.append(f"density of the sphere {m.group(2)}, the spec says {ds}")
    r = data(errs, m.group(3), "radius", 0.5, 3)
    name, eta, dfl = liquid(errs, m.group(4), m.group(6))
    if int(m.group(5)) != dfl:
        errs.append(f"density of {name} {m.group(5)}, the spec says {dfl}")
    answer(sample, errs, 2 * (r / 1000) ** 2 * G * (ds - dfl) / (9 * eta) * 1000, "mm/s", lo=Rational(1, 2))
    return name


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un cilindro pieno di un olio di densità " + KGM3 + r" una sferetta d'acciaio \(" + KGM3 + r"\) di raggio " + Q("mm") + " scende alla velocità costante di " + Q("mm/s") + r"\. Quanto vale la viscosità dell'olio\?", s)
    if not m or m.group(2) != "7800":
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    dfl = int(m.group(1))
    if dfl not in (880, 920, 960):
        errs.append(f"oil density {dfl} not in the spec")
    r, v = data(errs, m.group(3), "radius", 0.5, 2.5), data(errs, m.group(4), "speed", 1.1, 99)
    answer(sample, errs, 2 * (r / 1000) ** 2 * G * (7800 - dfl) / (9 * v / 1000), "Pa s", lo=Rational(1, 10), hi=Rational(99, 10))
    return "viscosita"


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
