"""Checker for fis-energia-gravitazionale (specs/exercises/fis-energia-gravitazionale.md), written from the spec and
the lesson 97-fis-energia-gravitazionale.md, not from the generator.

The gravitational potential energy of a body of mass m at distance r from the centre of a body of mass M is
-G M m / r, zero at infinity. From the surface (r = R) to a height h it grows by G M m (1/R - 1/(R + h)). With gravity
alone, v^2/2 - G M / r is constant: a projectile fired straight up from the surface at v0 stops where
G M / r = G M / R - v0^2 / 2. On a circular orbit the total energy is -G M m / (2 r). The escape speed from the
surface is sqrt(2 G M / R). G = 6,67 · 10^-11, three significant figures.
"""
import re

from mpmath import mp
from sympy import Rational

from checkers._vettori import common, prose
from checkers._fis_campo_orbite import BODY, BODY_CAP, G, answer, body_mass, data3, mpf, no_scene, q, scene
from checkers._fis_campo_orbite import density as body_density

MASS = Rational(10) ** 22, Rational(10) ** 28
SAT = Rational(100), Rational(10) ** 5


def orbit_ratio(errs, M, r):
    """The satellite is outside any body of that mass that could exist: beyond the radius of a sphere of 6000 kg/m³."""
    r0 = (3 * float(M) / (4 * float(mp.pi) * 6000)) ** (1 / 3)
    if not 1.05 <= float(r) / r0 <= 11.5:
        errs.append(f"distance {float(r) / r0:.2f} radii of the densest body, outside 1.05-11.5")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un satellite di " + q("kg") + r" si trova a " + q("m") + r" dal centro di " + BODY + r" di massa " + q("kg") + r"\. Quanto vale la sua energia potenziale gravitazionale\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass = data3(errs, m.group(1), "satellite", *SAT)
    r = data3(errs, m.group(2), "distance")
    M = data3(errs, m.group(4), "mass", *MASS)
    orbit_ratio(errs, M, r)
    body_mass(errs, m.group(3), M)
    no_scene(sample, errs)
    answer(sample, errs, -G * M * mass / r, "J")
    return "potenziale"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        BODY_CAP + r" ha massa " + q("kg") + r" e raggio " + q("m") + r"\. Una sonda di " + q("kg") + r" viene portata dalla superficie a una quota di " + q("m") + r"\. Di quanto aumenta la sua energia potenziale gravitazionale\?",
        s,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    M = data3(errs, m.group(2), "mass", *MASS)
    R = data3(errs, m.group(3), "radius")
    mass = data3(errs, m.group(4), "probe", *SAT)
    h = data3(errs, m.group(5), "height")
    body_density(errs, M, R)
    body_mass(errs, m.group(1), M)
    if not Rational(14, 100) <= h / R <= Rational(5, 2):
        errs.append(f"height {float(h / R):.3f} radii, outside 0.14-2.5")
    scene(sample, errs, (R + h) / R, False, {"R": m.group(3), "h": m.group(5)})
    answer(sample, errs, G * M * mass * (1 / R - 1 / (R + h)), "J")
    return "variazione"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        BODY_CAP + r" senza atmosfera ha massa " + q("kg") + r" e raggio " + q("m") + r"\. Dalla sua superficie un proiettile viene lanciato in verticale a " + q("m/s") + r"\. A quale distanza dal centro si ferma, prima di ricadere\?",
        s,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    M = data3(errs, m.group(2), "mass", *MASS)
    R = data3(errs, m.group(3), "radius")
    v0 = data3(errs, m.group(4), "speed")
    body_density(errs, M, R)
    body_mass(errs, m.group(1), M)
    u0 = G * M / R
    half = v0**2 / 2
    if not Rational(2, 10) * u0 <= half <= Rational(9, 10) * u0:
        errs.append(f"kinetic energy {float(half / u0):.3f} of G M / R, outside 0.2-0.9")
    scene(sample, errs, Rational(22, 10), False, {"R": m.group(3)}, launch=True)
    answer(sample, errs, G * M / (u0 - half), "m")
    return "lancio"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un satellite di " + q("kg") + r" percorre un'orbita circolare di raggio " + q("m") + r" intorno a " + BODY + r" di massa " + q("kg") + r"\. Quanto vale la sua energia totale\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass = data3(errs, m.group(1), "satellite", *SAT)
    r = data3(errs, m.group(2), "radius")
    M = data3(errs, m.group(4), "mass", *MASS)
    orbit_ratio(errs, M, r)
    body_mass(errs, m.group(3), M)
    no_scene(sample, errs)
    answer(sample, errs, -G * M * mass / (2 * r), "J")
    return "orbita"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY_CAP + r" ha massa " + q("kg") + r" e raggio " + q("m") + r"\. Quanto vale la velocità di fuga dalla sua superficie\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    M = data3(errs, m.group(2), "mass", *MASS)
    R = data3(errs, m.group(3), "radius")
    body_density(errs, M, R)
    body_mass(errs, m.group(1), M)
    no_scene(sample, errs)
    answer(sample, errs, mp.sqrt(mpf(2 * G * M / R)), "m/s")
    return "fuga"


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
