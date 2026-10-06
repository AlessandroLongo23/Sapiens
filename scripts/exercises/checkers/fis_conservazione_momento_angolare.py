"""Checker for fis-conservazione-momento-angolare (specs/exercises/fis-conservazione-momento-angolare.md), written
from the spec and the lesson 91-fis-conservazione-momento-angolare.md, not from the generator.

Without external torque L is constant: I1 w1 = I2 w2 for a body that changes shape (two masses on a light rod have
I = 2 m r^2); a disc at rest dropped on a turning one gives I1 w1 = (I1 + I2) w; a child m running at v along the
tangent who jumps on a solid disc M of radius r at rest gives m v r = (M r^2 / 2 + m r^2) w; at the two ends of an
orbit v_p r_p = v_a r_a; the kinetic energy after a change of shape is (I1 w1)^2 / (2 I2).
"""
import re

from sympy import Rational

from checkers._fis_momento_angolare import params_match, NUMRE, Q, answer, comma, data
from checkers._vettori import common, prose

CASE_RANGES = {1: {"chiude": (0.45, 0.90), "apre": (0.10, 0.55)}, 6: {"chiude": (0.45, 0.90), "apre": (0.10, 0.55)}}
R = Rational
I_U = "kg·m²"

OPEN = r"(?:Una pattinatrice gira su se stessa con le braccia aperte|Un tuffatore ruota in aria con il corpo disteso|Una ragazza gira su uno sgabello girevole con due pesi nelle mani e le braccia aperte)"
CLOSE = r"(?:Stringe le braccia al corpo|Si raggomitola|Porta i pesi al petto)"
FAR = r"(?:Allarga le braccia|Si distende ancora di più, con le braccia sopra la testa|Allunga le braccia del tutto)"


def shape_change(errs, s, question):
    m = re.fullmatch(OPEN + ": il suo momento d'inerzia è " + Q(I_U) + " e la sua velocità angolare " + Q("rad/s") + r"\. (" + CLOSE + "|" + FAR + "), e il momento d'inerzia diventa " + Q(I_U) + r"\. " + question, s)
    if not m:
        return None
    I1, w1, I2 = data(errs, m.group(1), "I1"), data(errs, m.group(2), "omega1"), data(errs, m.group(4), "I2")
    closes = re.fullmatch(CLOSE, m.group(3)) is not None
    if not (R(11, 10) <= I1 <= R(99, 10) and R(11, 10) <= w1 <= R(99, 10)):
        errs.append("data out of range")
    if closes and not (I1 / 4 <= I2 <= R(7, 10) * I1):
        errs.append("closing: I2 must be between a quarter and 70% of I1")
    if not closes and not (R(13, 10) * I1 <= I2 <= R(5, 2) * I1):
        errs.append("opening: I2 must be between 1.3 and 2.5 times I1")
    return I1, w1, I2, "chiude" if closes else "apre"


def level1(sample, errs):
    s = prose(sample["problem"])
    got = shape_change(errs, s, r"Con che velocità angolare ruota adesso\?")
    if not got:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    I1, w1, I2, kind = got
    params_match(sample, errs, caso=kind, I1=I1, I2=I2, omega1=w1)
    answer(sample, errs, I1 * w1 / I2, "rad/s")
    return kind


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Due masse di " + Q("kg") + " sono fissate a un'asta leggera che ruota senza attrito intorno al suo centro a " + Q("rad/s") + "; ciascuna dista " + Q("cm") + r" dall'asse\. Un meccanismo le avvicina fino a " + Q("cm") + r" dall'asse\. Trascura la massa dell'asta: con che velocità angolare ruota adesso il sistema\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    mass, w1, r1, r2 = (data(errs, m.group(i), n) for i, n in ((1, "mass"), (2, "omega1"), (3, "r1"), (4, "r2")))
    if not (R(11, 100) <= mass <= R(5, 2) and R(11, 10) <= w1 <= R(99, 10) and 21 <= r1 <= 99 and R(3, 10) * r1 <= r2 <= R(8, 10) * r1):
        errs.append("data out of range")
    I1, I2 = 2 * mass * (r1 / 100) ** 2, 2 * mass * (r2 / 100) ** 2
    params_match(sample, errs, m=mass, r1=r1, r2=r2, omega1=w1)
    answer(sample, errs, I1 * w1 / I2, "rad/s")
    return "masse"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un disco con momento d'inerzia " + Q(I_U) + " gira a " + Q("rad/s") + r" intorno al suo asse\. Un secondo disco, fermo, con momento d'inerzia " + Q(I_U) + r", cade sul primo lungo lo stesso asse\. Con che velocità angolare girano insieme\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    I1, w1, I2 = data(errs, m.group(1), "I1"), data(errs, m.group(2), "omega1"), data(errs, m.group(3), "I2")
    if not (R(11, 1000) <= I1 <= R(99, 100) and R(11, 10) <= w1 <= 30 and I1 / 4 <= I2 <= 3 * I1):
        errs.append("data out of range")
    params_match(sample, errs, I1=I1, I2=I2, omega1=w1)
    answer(sample, errs, I1 * w1 / (I1 + I2), "rad/s")
    return "dischi"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una giostra è un disco pieno di " + Q("kg") + " e raggio " + Q("m") + r", fermo, libero di ruotare senza attrito intorno al centro\. Un bambino di " + Q("kg") + " corre a " + Q("m/s") + r" lungo la tangente al bordo e ci salta sopra\. Con che velocità angolare parte la giostra\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    M, r, mass, v = data(errs, m.group(1), "M", 3), data(errs, m.group(2), "radius"), data(errs, m.group(3), "mass"), data(errs, m.group(4), "speed")
    if not (101 <= M <= 199 and R(11, 10) <= r <= R(5, 2) and 21 <= mass <= 49 and R(3, 2) <= v <= R(13, 2)):
        errs.append("data out of range")
    params_match(sample, errs, M=M, r=r, m=mass, v=v)
    answer(sample, errs, mass * v * r / (M * r**2 / 2 + mass * r**2), "rad/s")
    return "giostra"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(?:Un asteroide|Una cometa) percorre un'orbita ellittica intorno al Sole\. Al perielio, a \$" + NUMRE + r"\$ milioni di chilometri dal Sole, ha una velocità di " + Q("km/s") + r"\. Che velocità ha all'afelio, a \$" + NUMRE + r"\$ milioni di chilometri dal Sole\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    rp, vp, ra = data(errs, m.group(1), "rp"), data(errs, m.group(2), "vp"), data(errs, m.group(3), "ra")
    if not (11 <= rp <= 99 and ra <= 99 and R(13, 10) * rp <= ra <= 4 * rp and 11 <= vp <= 99):
        errs.append("data out of range")
    params_match(sample, errs, rp=rp, ra=ra, vp=vp)
    answer(sample, errs, vp * rp / ra, "km/s")
    sc = sample.get("scene") or {}
    d = dict(sc.get("data", {}))
    d.pop("nota", None)
    want = {"rp": int(rp), "ra": int(ra), "testoRp": m.group(1), "testoRa": m.group(3), "testoVp": comma(m.group(2)) + " km/s"}
    if sc.get("type") != "orbita-ellisse" or d != want:
        errs.append(f"the scene does not match the data: {d}")
    return "orbita"


def level6(sample, errs):
    s = prose(sample["problem"])
    got = shape_change(errs, s, r"Quanto vale adesso la sua energia cinetica di rotazione\?")
    if not got:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    I1, w1, I2, kind = got
    params_match(sample, errs, caso=kind, I1=I1, I2=I2, omega1=w1)
    answer(sample, errs, (I1 * w1) ** 2 / (2 * I2), "J", lo=1)
    return kind


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
    if lvl != 5 and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
