"""Checker for fis-momento-angolare-def (specs/exercises/fis-momento-angolare-def.md), written from the spec and the
lesson 90-fis-momento-angolare-def.md, not from the generator.

A particle has L = r m v sin(phi) about a pole (m v r on a circle about its centre); a rigid body turning about a
fixed axis has L = I w, with I = c m r^2 for a round body; M = dL/dt, so a flywheel taken from w1 to w2 in dt needs
M = I (w2 - w1) / dt, and a braking torque M stops a wheel in I w / M.
"""
import re

from sympy import Rational, pi, sin

from checkers._fis_momento_angolare import Q, params_match, SHAPE_RE, answer, comma, data, shape
from checkers._vettori import common, prose

CASE_RANGES = {4: {k: (0.12, 0.40) for k in ("anello", "cilindro", "sfera", "sfera-cava")}}
L = "kg·m²/s"
CAP = SHAPE_RE.replace("un", "Un")
R = Rational


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(?:Un sasso legato a una corda|Una pallina legata a un filo|Un modellino di aereo legato a un cavo), di massa " + Q("kg") + ", percorre una circonferenza di raggio " + Q("m") + " alla velocità di " + Q("m/s") + r"\. Quanto vale il suo momento angolare rispetto al centro\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass, r, v = data(errs, m.group(1), "mass"), data(errs, m.group(2), "radius"), data(errs, m.group(3), "speed")
    if not (R(11, 100) <= mass <= R(99, 10) and R(11, 100) <= r <= R(99, 10) and R(11, 10) <= v <= 30):
        errs.append("data out of range")
    params_match(sample, errs, m=mass, v=v, r=r)
    answer(sample, errs, mass * v * r, L, lo=R(1, 10))
    return "circolare"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una particella di massa " + Q("kg") + " si muove a " + Q("m/s") + r"\. In un certo istante si trova a " + Q("m") + r" dal polo \$O\$, e la sua velocità forma un angolo di \$(\d+)\^\\circ\$ con il vettore \$\\vec\{r\}\$ che va da \$O\$ alla particella\. Quanto vale il suo momento angolare rispetto a \$O\$\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    mass, v, r = data(errs, m.group(1), "mass"), data(errs, m.group(2), "speed"), data(errs, m.group(3), "distance")
    phi = int(m.group(4))
    if not (R(11, 100) <= mass <= R(99, 10) and R(11, 100) <= r <= R(99, 10) and R(11, 10) <= v <= 30 and 20 <= phi <= 70 and phi % 5 == 0 and phi != 45):
        errs.append("data out of range")
    params_match(sample, errs, m=mass, v=v, r=r, phi=R(phi))
    answer(sample, errs, r * mass * v * sin(pi * phi / 180), L, lo=R(1, 10))
    sc = sample.get("scene") or {}
    want = {"angolo": phi, "testoR": comma(m.group(3)) + " m", "testoV": comma(m.group(2)) + " m/s", "testoAngolo": f"{phi}°"}
    if sc.get("type") != "particella-polo" or sc.get("data") != want:
        errs.append(f"the scene does not match the data: {sc.get('data')}")
    return "angolo"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(?:Un volano|Una ruota|Una piattaforma girevole) ha momento d'inerzia " + Q("kg·m²") + " e ruota a " + Q("rad/s") + r"\. Quanto vale il suo momento angolare\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    I, w = data(errs, m.group(1), "I"), data(errs, m.group(2), "omega")
    if not (R(11, 100) <= I <= R(99, 10) and R(11, 10) <= w <= 30):
        errs.append("data out of range")
    params_match(sample, errs, I=I, omega=w)
    answer(sample, errs, I * w, L)
    return "rigido"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(CAP + " di massa " + Q("kg") + " e raggio " + Q("cm") + " ruota intorno al suo asse a " + Q("rad/s") + r"\. Quanto vale il suo momento angolare\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    key, c = shape(m.group(1))
    mass, r, w = data(errs, m.group(2), "mass"), data(errs, m.group(3), "radius"), data(errs, m.group(4), "omega")
    if not (R(11, 100) <= mass <= R(99, 10) and 11 <= r <= 45 and R(11, 10) <= w <= 99):
        errs.append("data out of range")
    params_match(sample, errs, forma=key, m=mass, r=r, omega=w)
    answer(sample, errs, c * mass * (r / 100) ** 2 * w, L, lo=R(1, 10))
    return key


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un motore porta un volano con momento d'inerzia " + Q("kg·m²") + " da " + Q("rad/s") + " a " + Q("rad/s") + " in " + Q("s") + r"\. Quanto vale il momento medio applicato dal motore\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    I, w1, w2, dt = (data(errs, m.group(i), n) for i, n in ((1, "I"), (2, "omega1"), (3, "omega2"), (4, "dt")))
    if not (R(11, 100) <= I <= R(99, 10) and R(11, 10) <= w1 <= 30 and w2 <= 60 and 2 * w2 >= 3 * w1 and R(11, 10) <= dt <= 30):
        errs.append("data out of range")
    params_match(sample, errs, I=I, omega1=w1, omega2=w2, dt=dt)
    answer(sample, errs, I * (w2 - w1) / dt, "N·m", lo=R(1, 10))
    return "motore"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una ruota con momento d'inerzia " + Q("kg·m²") + " gira a " + Q("rad/s") + r"\. Un freno le applica un momento costante di " + Q("N·m") + r", contrario alla rotazione\. In quanto tempo la ruota si ferma\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    I, w, M = data(errs, m.group(1), "I"), data(errs, m.group(2), "omega"), data(errs, m.group(3), "M")
    if not (R(11, 100) <= I <= R(99, 10) and R(11, 10) <= w <= 60 and R(11, 100) <= M <= R(99, 10)):
        errs.append("data out of range")
    params_match(sample, errs, I=I, omega=w, M=M)
    answer(sample, errs, I * w / M, "s", lo=R(1, 2))
    return "freno"


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
    if lvl != 2 and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
