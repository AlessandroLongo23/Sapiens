"""Checker for fis-quantita-moto-def (specs/exercises/fis-quantita-moto-def.md), written from the spec and the lesson
80-fis-quantita-moto-def.md, not from the generator.

The momentum of a body is its mass in kilograms times its velocity in metres per second (1 m/s = 3,6 km/h). In a
bounce the velocity changes sign, so the change of momentum has modulus m (v1 + v2). The total momentum of a system is
the vector sum: on a line the components add with their signs, at right angles the modulus comes from Pythagoras. The
mean total force is the change of momentum over the time.
"""
import re

from sympy import Rational, sqrt

from checkers._fis_energia import Q, answer, data
from checkers._fis_quantita_moto import KGMS, answer_tex
from checkers._vettori import common, num, prose

KG, MS, G_, KMH, S = Q("kg"), Q("m/s"), Q("g"), Q("km/h"), Q("s")
BODIES = {
    "Un carrello": (Rational(11, 10), Rational(99, 10), Rational(11, 10), Rational(99, 10)),
    "Un ciclista con la sua bicicletta": (61, 95, Rational(21, 10), 12),
    "Una palla da bowling": (Rational(41, 10), Rational(72, 10), Rational(11, 10), Rational(99, 10)),
    "Un cane": (11, 45, Rational(11, 10), Rational(99, 10)),
    "Uno skateboard": (Rational(21, 10), Rational(49, 10), Rational(11, 10), Rational(99, 10)),
}


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(" + "|".join(BODIES) + ") di " + KG + " si muove a " + MS + r"\. Quanto vale la sua quantità di moto\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass, v = data(errs, m.group(2), "mass"), data(errs, m.group(3), "speed")
    mlo, mhi, vlo, vhi = BODIES[m.group(1)]
    if not (mlo <= mass <= mhi and vlo <= v <= vhi):
        errs.append("data out of the range of the body")
    answer_tex(sample, errs, mass * v, KGMS, lo=1)
    return "prodotto"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Una palla|Una pallina|Una freccia|Un sasso) di " + G_ + " si muove a " + MS + r"\. Quanto vale la sua quantità di moto\?", s)
    if m:
        g, v = num(m.group(2)), data(errs, m.group(3), "speed")
        if g.q != 1 or not 11 <= g <= 999 or g % 10 == 0 or not Rational(21, 10) <= v <= 60:
            errs.append("data out of range")
        answer_tex(sample, errs, g / 1000 * v, KGMS, lo=Rational(1, 10))
        return "grammi"
    m = re.fullmatch(r"(Una palla|Un pallone|Un disco da hockey) di " + KG + " si muove a " + KMH + r"\. Quanto vale la sua quantità di moto\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    mass, kmh = data(errs, m.group(2), "mass"), num(m.group(3))
    if kmh % 18 != 0 or kmh % 10 == 0 or not 18 <= kmh <= 162 or not Rational(11, 100) <= mass <= Rational(99, 100):
        errs.append("speed not a whole number of m/s, or data out of range")
    answer_tex(sample, errs, mass * kmh * Rational(5, 18), KGMS)
    return "kmh"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una palla da bowling di " + KG + " rotola a " + MS + r"\. A che velocità deve muoversi una palla di " + KG + r" per avere la stessa quantità di moto\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    m1, v1, m2 = data(errs, m.group(1), "mass"), data(errs, m.group(2), "speed"), data(errs, m.group(3), "mass")
    if not m2 < m1:
        errs.append("the second body must be lighter")
    answer(sample, errs, m1 * v1 / m2, "m/s")
    return "inversa"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una palla di " + KG + r" colpisce (un muro|il pavimento|una sponda) alla velocità di " + MS + " e rimbalza indietro, nella stessa direzione, a " + MS + r"\. Quanto vale il modulo della variazione della sua quantità di moto\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass, v1, v2 = data(errs, m.group(1), "mass"), data(errs, m.group(3), "speed"), data(errs, m.group(4), "speed")
    if not v2 <= Rational(85, 100) * v1:
        errs.append("the speed after the bounce must be at least 15% smaller")
    answer_tex(sample, errs, mass * (v1 + v2), KGMS)
    return "rimbalzo"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su una rotaia un carrello di " + KG + " va verso destra a " + MS + ", e un carrello di " + KG + " va verso sinistra a " + MS + r"\. Quanto vale la componente \$p_\{tot,x\}\$ della quantità di moto totale, con l'asse \$x\$ verso destra\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    m1, v1, m2, v2 = (data(errs, m.group(i), "datum") for i in (1, 2, 3, 4))
    p1, p2 = m1 * v1, m2 * v2
    if abs(p1 - p2) < Rational(15, 100) * (p1 + p2):
        errs.append("the two momenta nearly cancel")
    answer_tex(sample, errs, p1 - p2, KGMS, lo=1)
    return "destra" if p1 > p2 else "sinistra"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su un tavolo liscio un disco di " + KG + " si muove verso est a " + MS + ", e un disco di " + KG + " si muove verso nord a " + MS + r"\. Quanto vale il modulo della quantità di moto totale\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    m1, v1, m2, v2 = (data(errs, m.group(i), "datum") for i in (1, 2, 3, 4))
    p1, p2 = m1 * v1, m2 * v2
    if min(p1, p2) < Rational(35, 100) * max(p1, p2):
        errs.append("one momentum is too small beside the other")
    answer_tex(sample, errs, sqrt(p1**2 + p2**2), KGMS)
    sc = sample.get("scene") or {}
    vs = sc.get("data", {}).get("vettori", [])
    if sc.get("type") != "vettori-piano" or len(vs) != 2:
        errs.append("the scene must show the two velocities")
        return "perpendicolari"
    a, b = vs
    if a["a"][1] != 0 or b["a"][0] != 0 or a["a"][0] <= 0 or b["a"][1] <= 0 or a["da"] != [0, 0] or b["da"] != [0, 0]:
        errs.append("the scene's vectors are not east and north from the origin")
    elif abs(Rational(str(a["a"][0])) / Rational(str(b["a"][1])) - v1 / v2) > Rational(1, 100) * v1 / v2:
        errs.append("the scene's vectors are not to scale")
    if a.get("etichetta") != m.group(2).replace("{,}", ",") + " m/s" or b.get("etichetta") != m.group(4).replace("{,}", ",") + " m/s":
        errs.append("the scene's labels do not match the data")
    return "perpendicolari"


def level7(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un'automobile di " + KG + " che viaggia a " + MS + " frena e si ferma in " + S + r"\. Quanto vale il modulo della forza totale media che l'ha frenata\?", s)
    if not m:
        errs.append(f"level 7 text not recognised: {s!r}")
        return None
    mass, v, dt = num(m.group(1)), data(errs, m.group(2), "speed"), data(errs, m.group(3), "time")
    if mass.q != 1 or not 801 <= mass <= 1999 or mass % 10 == 0:
        errs.append("mass out of range")
    answer(sample, errs, mass * v / dt / 1000, "kN")
    return "forza"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}
CASE_RANGES = {2: {"grammi": (0.4, 0.6), "kmh": (0.4, 0.6)}, 5: {"destra": (0.35, 0.65), "sinistra": (0.35, 0.65)}}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if lvl != 6 and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
