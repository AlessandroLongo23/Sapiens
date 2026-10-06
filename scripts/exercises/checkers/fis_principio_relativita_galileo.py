"""Checker for fis-principio-relativita-galileo (specs/exercises/fis-principio-relativita-galileo.md), written from the
spec and the lesson 74-fis-principio-relativita-galileo.md, not from the generator.

Between two inertial frames the acceleration, the mass and the force are the same, so an acceleration measured from a
train at constant velocity is (v2 - v1) / dt as from the road, and the total force on a cart is m dv' / dt for the
ground too. The same experiment gives the same result on the train, relative to the train; relative to the ground the
train's velocity is added. Time intervals, lengths, mass, acceleration and force are invariant; position,
displacement, velocity and kinetic energy are relative. A stone dropped from a mast of height h on a ship at V falls
for sqrt(2 h / g), advances V times that for the shore and lands at sqrt(V^2 + 2 g h). A cart pushed from rest to v'
on a train at V gains m ((V + v')^2 - V^2) / 2 of kinetic energy for the ground. g = 49/5.
"""
from sympy import sqrt

from checkers._fis_riferimenti import G, Q, Rational, answer2, answer_exact, answer_word, common, data2, datum, no_scene, num, prose, re

CASE_RANGES = {
    3: {"banco": (0.40, 0.60), "suolo": (0.40, 0.60)},
    4: {"invariante": (0.40, 0.60), "relativa": (0.40, 0.60)},
    5: {"spostamento": (0.40, 0.60), "velocità": (0.40, 0.60)},
}

MS, SEC, MET, KG = Q("m/s"), Q("s"), Q("m"), Q("kg")
KMH = r"\$(\d+)\\,\\text\{km/h\}\$"
INV = {"accelerazione": "l'accelerazione", "forza": "la forza totale", "massa": "la massa", "durata": "la durata del moto"}
REL = {"velocita": "la velocità finale", "spostamento": "lo spostamento", "energia": "l'energia cinetica finale", "posizione": "la posizione finale"}
BODIES = r"(un carrello che accelera sul pavimento del treno|una valigia che scivola sul pavimento del treno e si ferma|un'auto che accelera su una strada accanto ai binari)"


def whole(errs, s, what, lo, hi):
    if not re.fullmatch(r"\d+", s) or s.endswith("0"):
        errs.append(f"{what} {s} is not a whole number without a final zero")
    return datum(errs, s, what, lo, hi)


def level1(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(r"Vista dalla strada, un'auto passa da " + MS + " a " + MS + " in " + SEC + r"\. Quale accelerazione dell'auto misura un passeggero di un treno che viaggia nello stesso verso a " + MS + r" costanti\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    v1, v2, V = whole(errs, m.group(1), "v1", 11, 25), whole(errs, m.group(2), "v2", 13, 37), whole(errs, m.group(4), "V", 5, 23)
    dt = data2(errs, m.group(3), "dt", 2.0, 9.9)
    if not 2 <= v2 - v1 <= 12:
        errs.append("the car gains less than 2 or more than 12 m/s")
    if V > v1 - 2:
        errs.append("the train is not slower than the car")
    answer2(sample, errs, (v2 - v1) / dt, "m/s^2")
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(r"Su un treno che viaggia a " + MS + " costanti un carrello di " + KG + ", fermo su un banco senza attrito, viene spinto e in " + SEC + " raggiunge " + MS + r" rispetto al treno\. Quanto vale la forza totale sul carrello per chi guarda da terra\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    data2(errs, m.group(1), "V", 11, 35)
    mass, dt, vp = data2(errs, m.group(2), "m", 0.11, 0.99), data2(errs, m.group(3), "dt", 0.5, 3.0), data2(errs, m.group(4), "v'", 1.1, 5.0)
    answer2(sample, errs, mass * vp / dt, "N")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(
        r"In un laboratorio a terra una molla lancia un carrello, che parte a " + MS + r" rispetto al banco\. Lo stesso esperimento viene rifatto, identico, su un treno che viaggia a " + MS + r" costanti su un rettilineo, con il carrello lanciato nel verso di marcia\. Con quale velocità parte il carrello rispetto (al banco del treno|al suolo)\?",
        s,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    u, V = data2(errs, m.group(1), "u", 1.1, 4.9), data2(errs, m.group(2), "V", 5.1, 9.9)
    if "{,}" not in m.group(1) or "{,}" not in m.group(2):
        errs.append("level 3 data need one decimal")
    bench = m.group(3) == "al banco del treno"
    answer_exact(sample, errs, u if bench else u + V, "m/s")
    return "banco" if bench else "suolo"


def level4(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(
        r"Un osservatore sulla banchina e uno su un treno che viaggia a " + KMH + r" costanti su un rettilineo studiano " + BODIES + r"\. (Quale di queste grandezze ha lo stesso valore per tutti e due\?|Quale di queste grandezze ha valori diversi per i due osservatori\?)",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    if int(m.group(1)) not in {72, 108, 126, 144, 162, 198, 216, 252}:
        errs.append("train speed not allowed")
    ask_inv = m.group(3).startswith("Quale di queste grandezze ha lo stesso")
    one, three = (INV, REL) if ask_inv else (REL, INV)
    keys = [o["values"][0] for o in sample["answer"]["options"]]
    mine = [k for k in keys if k in one]
    if len(mine) != 1 or sum(k in three for k in keys) != 3:
        errs.append(f"the options {keys} are not one of a kind and three of the other")
        return None
    answer_word(sample, errs, mine[0], {**INV, **REL})
    return "invariante" if ask_inv else "relativa"


def level5(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(
        r"Una nave viaggia a " + MS + r" costanti\. Dalla cima dell'albero, alta " + MET + r" sul ponte, viene lasciato cadere un sasso\. (Di quanto avanza il sasso rispetto alla riva durante la caduta\?|Con quale velocità tocca il ponte, per chi guarda dalla riva\?)",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    V, h = data2(errs, m.group(1), "V", 2.0, 9.9), data2(errs, m.group(2), "h", 5.0, 30)
    if m.group(3).startswith("Di quanto"):
        answer2(sample, errs, V * sqrt(2 * h / G), "m")
        return "spostamento"
    answer2(sample, errs, sqrt(V**2 + 2 * G * h), "m/s")
    return "velocità"


def level6(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(
        r"Su un treno che viaggia a " + MS + " costanti un carrello di " + KG + ", fermo rispetto al treno, viene spinto nel verso di marcia fino a raggiungere " + MS + r" rispetto al treno\. Di quanto aumenta la sua energia cinetica per chi guarda da terra\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    V, mass, vp = data2(errs, m.group(1), "V", 11, 30), data2(errs, m.group(2), "m", 0.11, 0.99), data2(errs, m.group(3), "v'", 1.1, 5.0)
    answer2(sample, errs, mass * ((V + vp) ** 2 - V**2) / 2, "J")
    return None


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
