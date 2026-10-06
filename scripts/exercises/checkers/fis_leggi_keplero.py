"""Checker for fis-leggi-keplero (specs/exercises/fis-leggi-keplero.md), written from the spec and the lesson
93-fis-leggi-keplero.md, not from the generator.

First law: a = (r_p + r_a)/2 and e = (r_a - r_p)/(r_a + r_p). Second law at the ends of the major axis:
v_p r_p = v_a r_a. Third law around the Sun in years and astronomical units: T^2 = a^3; around another body
(T_2/T_1)^2 = (a_2/a_1)^3.
"""
import re

from sympy import Rational, sqrt

from checkers._vettori import common, prose
from checkers._fis_keplero_newton import answer, dec, fmt, is_sci, mantissa, q, qs, two, whole

CASE_RANGES = {3: {"afelio": (0.40, 0.60), "perielio": (0.40, 0.60)}}
BODY = r"(?:Un asteroide|Una cometa|Una sonda)"
ONE = r"\d\{,\}\d"


def distances(errs, sp, sa):
    """r_p from 0,3 to 4,9 AU and r_a up to 9,9 AU, one decimal each, r_a between 1,3 and 12 times r_p."""
    for s in (sp, sa):
        if not re.fullmatch(ONE, s):
            errs.append(f"distance {s} is not written with one decimal")
    rp, ra = dec(sp), dec(sa)
    if not (Rational(3, 10) <= rp <= Rational(49, 10) and Rational(8, 10) <= ra <= Rational(99, 10)):
        errs.append("distances out of range")
    if not Rational(13, 10) * rp <= ra <= 12 * rp:
        errs.append("r_a must be between 1,3 and 12 times r_p")
    return rp, ra


def orbit(sample, errs, sp, sa, rp, ra, speed=None):
    scene = sample.get("scene") or {}
    data = scene.get("data", {})
    comma = lambda s: s.replace("{,}", ",")
    if scene.get("type") != "orbita-perielio-afelio":
        errs.append("scene missing")
        return
    if data.get("rp") != comma(sp) + " UA" or data.get("ra") != comma(sa) + " UA":
        errs.append("scene with other distances")
    if abs(Rational(str(data.get("e"))) - (ra - rp) / (ra + rp)) > Rational(1, 1000):
        errs.append("scene with another eccentricity")
    want = {} if speed is None else {speed[0]: comma(speed[1]) + " km/s"}
    for key in ("vp", "va"):
        if data.get(key) != want.get(key):
            errs.append(f"scene: {key} should be {want.get(key)!r}")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + r" gira attorno al Sole su un'orbita ellittica: al perielio dista dal Sole " + q("UA") + r", all'afelio " + q("UA") + r"\. Quanto vale il semiasse maggiore dell'orbita\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    rp, ra = distances(errs, m.group(1), m.group(2))
    a = (rp + ra) / 2
    if (a * 10).q != 1:
        errs.append("the semi-major axis has more than one decimal")
    whole_, tenth = divmod(int(a * 10), 10)
    answer(sample, errs, f"{whole_}{{,}}{tenth}", "UA")
    orbit(sample, errs, m.group(1), m.group(2), rp, ra)
    return "semiasse"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + r" gira attorno al Sole su un'orbita ellittica: al perielio dista dal Sole " + q("UA") + r", all'afelio " + q("UA") + r"\. Quanto vale l'eccentricità dell'orbita\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    rp, ra = distances(errs, m.group(1), m.group(2))
    answer(sample, errs, fmt((ra - rp) / (ra + rp), 2), "")
    orbit(sample, errs, m.group(1), m.group(2), rp, ra)
    return "eccentricita"


def level3(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(BODY + r" gira attorno al Sole: al perielio dista dal Sole " + q("UA") + r" e ha una velocità di " + q("km/s") + r"; all'afelio dista " + q("UA") + r"\. Con quale velocità passa all'afelio\?", s):
        sp, sv, sa = m.groups()
        rp, ra = distances(errs, sp, sa)
        v = whole(errs, sv, 11, 99, "v_p")
        out, kind, speed = v * rp / ra, "afelio", ("vp", sv)
    elif m := re.fullmatch(BODY + r" gira attorno al Sole: all'afelio dista dal Sole " + q("UA") + r" e ha una velocità di " + q("km/s") + r"; al perielio dista " + q("UA") + r"\. Con quale velocità passa al perielio\?", s):
        sa, sv, sp = m.groups()
        rp, ra = distances(errs, sp, sa)
        v = two(errs, sv, "v_a")
        if v < 1:
            errs.append("v_a under 1,1 km/s")
        out, kind, speed = v * ra / rp, "perielio", ("va", sv)
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    if not Rational(1, 2) <= out <= 99:
        errs.append("speed outside 0,5-99 km/s")
    right = fmt(out, 2)
    if right is not None and is_sci(right):
        errs.append("the speed should be written without a power of ten")
    answer(sample, errs, right, "km/s")
    orbit(sample, errs, sp, sa, rp, ra, speed)
    return kind


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + r" gira attorno al Sole su un'orbita con il semiasse maggiore di " + q("UA") + r"\. Quanto dura un suo giro attorno al Sole\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    a = two(errs, m.group(1), "a") if "{,}" in m.group(1) else whole(errs, m.group(1), 11, 21, "a")
    if a < 1:
        errs.append("a under 1,1 AU")
    T = sqrt(a**3)
    if T > 99:
        errs.append("period over 99 years")
    answer(sample, errs, fmt(T, 2), "anni")
    return "periodo"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + r" impiega " + q("anni") + r" a compiere un giro attorno al Sole\. Quanto vale il semiasse maggiore della sua orbita\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    T = two(errs, m.group(1), "T") if "{,}" in m.group(1) else whole(errs, m.group(1), 11, 99, "T")
    if T < 1:
        errs.append("T under 1,1 years")
    answer(sample, errs, fmt((T**2) ** Rational(1, 3), 2), "UA")
    return "semiasse"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Due lune girano attorno allo stesso pianeta su orbite circolari\. La prima ha un'orbita di raggio " + qs("km") + r" e un periodo di " + q("d") + r"\. La seconda ha un'orbita di raggio " + qs("km") + r"\. Quanto vale il periodo della seconda luna\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    if m.group(2) != "5" or m.group(5) != "5":
        errs.append("the radii must be in 10^5 km")
    a1, a2 = mantissa(errs, m.group(1), 2, "a_1"), mantissa(errs, m.group(4), 2, "a_2")
    T1 = two(errs, m.group(3), "T_1")
    if T1 < 1:
        errs.append("T_1 under 1,1 days")
    ratio = a2 / a1
    if Rational(4, 5) < ratio < Rational(5, 4):
        errs.append("radii too close")
    T2 = T1 * sqrt(ratio**3)
    if not Rational(1, 5) <= T2 <= 99:
        errs.append("T_2 outside 0,2-99 days")
    right = fmt(T2, 2)
    if right is not None and is_sci(right):
        errs.append("the period should be written without a power of ten")
    answer(sample, errs, right, "d")
    return "lune"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if lvl > 3 and sample.get("scene"):
        errs.append("levels 4 to 6 have no scene")
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
