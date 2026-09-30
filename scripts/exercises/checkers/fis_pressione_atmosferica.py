"""Checker for fis-pressione-atmosferica (specs/exercises/fis-pressione-atmosferica.md), written from the spec and the
lesson 29-fis-pressione-atmosferica.md. Each problem is read back from its text; the truth is computed with exact
rationals: 1 hPa = 100 Pa, 1 bar = 10^5 Pa = 1000 hPa, 1 mmHg = 1,33 hPa (as the text says), F = p S,
h = p / (d g) with g = 9,8 N/kg and the densities of the lesson, F = (p0 - p_int) pi r^2 with pi = 3,14.
"""
import re

from sympy import Rational as R

from checkers.forze_comune import common, prose, sig_figs
from checkers._fis_atmosfera import expect_u, parse_num, q

G = R(98, 10)
PI = R(314, 100)
MMHG = R(133, 100)
DENS = {"l'acqua": 1000, "l'olio d'oliva": 920, "l'alcol etilico": 790, "la glicerina": 1260, "il mercurio": 13600}

CASE_RANGES = {
    1: {k: (0.17, 0.33) for k in ["hpa-pa", "pa-hpa", "hpa-bar", "bar-pa"]},
    2: {"mmhg-hpa": (0.40, 0.60), "hpa-mmhg": (0.40, 0.60)},
    3: {"m2": (0.40, 0.60), "cm2": (0.40, 0.60)},
    4: {k: (0.13, 0.27) for k in ["acqua", "olio", "alcol", "glicerina", "mercurio"]},
    5: {"ventosa": (0.40, 0.60), "emisferi": (0.40, 0.60)},
}
LIQ_CASE = {"l'acqua": "acqua", "l'olio d'oliva": "olio", "l'alcol etilico": "alcol", "la glicerina": "glicerina", "il mercurio": "mercurio"}


def fm(rx, s):
    m = re.fullmatch(rx, s)
    return m.groups() if m else None


def p_atm(errs, s, lo=950, hi=1050):
    v = parse_num(s)
    if not (v.is_integer and lo <= v <= hi):
        errs.append(f"pressure {v} hPa outside {lo}-{hi}")
    return v


def level1(sample, errs):
    s = prose(sample["problem"])
    g = fm(r"Un barometro segna " + q("hPa") + r"\. Quanto vale la pressione in pascal\?", s)
    if g:
        p = p_atm(errs, g[0])
        expect_u(errs, sample, p * 100, "Pa", ("exact",))
        return "hpa-pa"
    g = fm(r"La pressione dell'aria è " + q("Pa") + r"\. Quanto vale in ettopascal\?", s)
    if g:
        pa = parse_num(g[0])
        if not ((pa / 100).is_integer and 950 <= pa / 100 <= 1050):
            errs.append(f"pressure {pa} Pa not 950-1050 hPa")
        expect_u(errs, sample, pa / 100, "hPa", ("exact",))
        return "pa-hpa"
    g = fm(r"Un barometro segna " + q("hPa") + r"\. Quanto vale la pressione in bar\?", s)
    if g:
        p = p_atm(errs, g[0])
        expect_u(errs, sample, p / 1000, "bar", ("exact",))
        return "hpa-bar"
    g = fm(r"Un manometro segna " + q("bar") + r"\. Quanto vale la pressione in pascal\?", s)
    if g:
        x = parse_num(g[0])
        if not (2 <= x <= 9 and (2 * x).is_integer and "{," in g[0]):
            errs.append(f"bar {g[0]} not 2,0-9,0 in halves with one decimal")
        expect_u(errs, sample, x * 10**5, "Pa", ("exact",))
        return "bar-pa"
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    given = r" \(\$1\\,\\text\{mmHg\} = 1\{,\}33\\,\\text\{hPa\}\$\)"
    g = fm(r"Un barometro a mercurio segna " + q("mmHg") + r"\. Quanto vale la pressione in ettopascal\?" + given, s)
    if g:
        h = parse_num(g[0])
        if not (h.is_integer and 700 <= h <= 751):
            errs.append(f"height {h} outside 700-751 mmHg")
        expect_u(errs, sample, h * MMHG, "hPa", ("sig", 3))
        return "mmhg-hpa"
    g = fm(r"Le previsioni del tempo danno una pressione di " + q("hPa") + r"\. A quanti millimetri di mercurio corrisponde\?" + given, s)
    if g:
        p = p_atm(errs, g[0], 940, 1040)
        expect_u(errs, sample, p / MMHG, "mmHg", ("sig", 3))
        return "hpa-mmhg"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    tail = r"\. Con quale forza l'aria preme (sulla sua faccia superiore|su una delle sue facce|sulla copertina|sulla piastrella|sullo schermo), se la pressione è " + q("hPa") + r"\?"
    g = fm(r"(Il piano di un tavolo|Una porta|Il vetro di una finestra) misura " + q("m") + " per " + q("m") + tail, s)
    if g:
        a, b, p = parse_num(g[1]), parse_num(g[2]), p_atm(errs, g[4], 990, 1030)
        for x in (g[1], g[2]):
            if sig_figs(x) != 2:
                errs.append(f"side {x} has not two significant figures")
        expect_u(errs, sample, p * 100 * a * b, "N", ("sig", 2))
        return "m2"
    g = fm(r"(La copertina di un libro|Una piastrella|Lo schermo di un tablet) misura " + q("cm") + " per " + q("cm") + tail, s)
    if g:
        a, b, p = parse_num(g[1]), parse_num(g[2]), p_atm(errs, g[4], 990, 1030)
        if not (10 <= a <= 40 and 10 <= b <= 40 and a != b):
            errs.append("sides outside 10-40 cm or equal")
        expect_u(errs, sample, p * 100 * a * b / 10**4, "N", ("sig", 2))
        return "cm2"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    g = fm(r"Quanto sarebbe alta la colonna di un barometro fatto con (.+?) \(densità " + q("kg/m^3") + r"\), quando la pressione atmosferica è " + q("hPa") + r"\?", s)
    if not g or g[0] not in DENS:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    if parse_num(g[1]) != DENS[g[0]]:
        errs.append(f"density of {g[0]} is {g[1]}, the lesson says {DENS[g[0]]}")
    p = p_atm(errs, g[2], 950, 1040)
    expect_u(errs, sample, p * 100 / (DENS[g[0]] * G), "m", ("sig", 2))
    return LIQ_CASE[g[0]]


def level5(sample, errs):
    s = prose(sample["problem"])
    pi = r" \(usa \$\\pi = 3\{,\}14\$\)"
    g = fm(r"Una ventosa ha il raggio di " + q("cm") + r"\. Sotto la ventosa la pressione è " + q("hPa") + r", fuori è " + q("hPa") + r"\. Con quale forza bisogna tirarla per staccarla\?" + pi, s)
    if g:
        r, pin, p0 = parse_num(g[0]), parse_num(g[1]), p_atm(errs, g[2], 990, 1030)
        if sig_figs(g[0]) != 2 or not 1.5 <= r <= 4.5:
            errs.append(f"radius {g[0]} not 1,5-4,5 cm with two figures")
        if not (200 <= pin <= 700 and pin % 10 == 0):
            errs.append(f"inside pressure {pin} not 200-700 hPa")
        expect_u(errs, sample, (p0 - pin) * 100 * PI * (r / 100) ** 2, "N", ("sig", 2))
        return "ventosa"
    g = fm(
        r"Due emisferi di Magdeburgo hanno il diametro di " + q("cm") + r"\. Dentro la sfera è rimasta aria alla pressione di " + q("hPa") + r", fuori la pressione è " + q("hPa")
        + r"\. Con quale forza bisogna tirare un emisfero per staccarlo\?" + pi,
        s,
    )
    if g:
        d, pin, p0 = parse_num(g[0]), parse_num(g[1]), p_atm(errs, g[2], 990, 1030)
        if not (d.is_integer and d % 2 == 0 and 20 <= d <= 60):
            errs.append(f"diameter {d} not an even 20-60 cm")
        if not (10 <= pin <= 100 and pin % 10 == 0):
            errs.append(f"inside pressure {pin} not 10-100 hPa")
        expect_u(errs, sample, (p0 - pin) * 100 * PI * (d / 200) ** 2, "N", ("sig", 2))
        return "emisferi"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
