"""Checker for fis-sistemi-non-inerziali (specs/exercises/fis-sistemi-non-inerziali.md), written from the spec and the
lesson 72-fis-sistemi-non-inerziali.md, not from the generator.

A frame is inertial if it is at rest or in uniform straight motion relative to the ground. In a frame with
acceleration A a free body has acceleration -A: on a braking bus a ball on the smooth floor advances by A t^2 / 2
relative to the bus, with velocity A t, and covers d in sqrt(2 d / A); the bus's own speed does not matter. A pendulum
at rest in a vehicle accelerating horizontally hangs at tan(theta) = A / g. A ball dropped in a lift accelerating
upwards falls with g + A relative to it, downwards with g - A: t = sqrt(2 h / (g +- A)). g = 49/5.
"""
from sympy import atan, sqrt, tan

from checkers._fis_riferimenti import DEG, G, Q, Rational, answer2, answer_deg, answer_word, common, data2, no_scene, pi, prose, re

CASE_RANGES = {
    1: {"si": (0.27, 0.40), "modulo": (0.27, 0.40), "direzione": (0.27, 0.40)},
    2: {"spostamento": (0.40, 0.60), "velocità": (0.40, 0.60)},
    4: {"angolo": (0.40, 0.60), "accelerazione": (0.40, 0.60)},
    5: {"alto": (0.40, 0.60), "basso": (0.40, 0.60)},
}

WORDS = {"si": "sì, la velocità è costante", "modulo": "no, cambia il modulo", "direzione": "no, cambia la direzione", "moto": "no, perché si muove"}
KMH = r"\$(\d+)\\,\\text\{km/h\}\$"
MS, ACC, SEC, MET = Q("m/s"), Q("m/s^2"), Q("s"), Q("m")

# (text, the frame's name, the right answer, the range of the datum or the allowed values)
VEHICLES = [
    (r"Un treno viaggia a " + KMH + r" costanti su un binario rettilineo\.", "del treno", "si", {72, 108, 126, 144, 162, 198, 216, 252, 288}),
    (r"Un ascensore sale a " + MS + r" costanti\.", "dell'ascensore", "si", (1.1, 2.5)),
    (r"Una nave avanza in linea retta a " + MS + r" costanti\.", "della nave", "si", (4.0, 9.9)),
    (r"Un autobus frena su una strada rettilinea con un'accelerazione di modulo " + ACC + r"\.", "dell'autobus", "modulo", (1.1, 4.5)),
    (r"Un aereo accelera su una pista rettilinea con " + ACC + r"\.", "dell'aereo", "modulo", (1.5, 3.5)),
    (r"Un ascensore parte verso l'alto con un'accelerazione di " + ACC + r"\.", "dell'ascensore", "modulo", (0.5, 1.5)),
    (r"Un'auto percorre una curva a " + KMH + r" costanti\.", "dell'auto", "direzione", {36, 54, 72}),
    (r"Una giostra gira a velocità angolare costante e fa un giro ogni " + SEC + r"\.", "della giostra", "direzione", (4.0, 9.9)),
    (r"Un treno percorre una curva a " + MS + r" costanti\.", "del treno", "direzione", (11, 35)),
]


def level1(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    for pattern, frame, kind, allowed in VEHICLES:
        m = re.fullmatch(pattern + " Il sistema di riferimento " + re.escape(frame) + r" è inerziale\?", s)
        if not m:
            continue
        if isinstance(allowed, set):
            if int(m.group(1)) not in allowed:
                errs.append(f"speed {m.group(1)} km/h not allowed")
        else:
            data2(errs, m.group(1), "datum", *allowed)
        answer_word(sample, errs, kind, WORDS)
        return kind
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


BUS = r"Un autobus viaggia a " + MS + r" e comincia a frenare con un'accelerazione di modulo " + ACC + r"\. Un pallone è fermo sul pavimento liscio"


def bus_data(errs, m):
    v0, A = data2(errs, m.group(1), "v0", 11, 25), data2(errs, m.group(2), "A", 1.1, 4.5)
    return v0, A


def level2(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(BUS + r"\. (Di quanto avanza il pallone rispetto all'autobus in|Quale velocità ha il pallone rispetto all'autobus dopo) " + SEC + r"\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    v0, A = bus_data(errs, m)
    t = data2(errs, m.group(4), "t", 1.1, 3.0)
    if A * t > v0 - 1:
        errs.append("the bus stops, or nearly, before the time given")
    if m.group(3).startswith("Di quanto"):
        answer2(sample, errs, A * t**2 / 2, "m")
        return "spostamento"
    answer2(sample, errs, A * t, "m/s")
    return "velocità"


def level3(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(BUS + r", a " + MET + r" dalla parete davanti\. Dopo quanto tempo il pallone tocca la parete\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    v0, A = bus_data(errs, m)
    d = data2(errs, m.group(3), "d", 2.0, 9.9)
    t = sqrt(2 * d / A)
    if A * t > v0 - 1:
        errs.append("the bus stops, or nearly, before the ball reaches the wall")
    answer2(sample, errs, t, "s")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    if m := re.fullmatch(r"Un ciondolo è appeso con un filo al soffitto di un tram, che accelera su un rettilineo con " + ACC + r"\. Quando il ciondolo è fermo rispetto al tram, quale angolo forma il filo con la verticale\?", s):
        A = data2(errs, m.group(1), "A", 1.1, 6.0)
        theta = atan(A / G) * 180 / pi
        if theta < 5:
            errs.append("angle under 5 degrees")
        answer_deg(sample, errs, theta)
        return "angolo"
    if m := re.fullmatch(r"Su un treno che accelera su un rettilineo un ciondolo appeso al soffitto resta fermo rispetto al treno, con il filo inclinato di " + DEG + r" rispetto alla verticale\. Quanto vale l'accelerazione del treno\?", s):
        deg = int(m.group(1))
        if not 4 <= deg <= 35:
            errs.append("angle outside 4-35")
        answer2(sample, errs, G * tan(pi * Rational(deg) / 180), "m/s^2")
        return "accelerazione"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(r"In un ascensore che accelera verso (l'alto|il basso) con " + ACC + r", una pallina viene lasciata cadere da " + MET + r" dal pavimento\. Dopo quanto tempo tocca il pavimento\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    A, h = data2(errs, m.group(2), "A", 1.1, 4.5), data2(errs, m.group(3), "h", 1.1, 2.5)
    up = m.group(1) == "l'alto"
    answer2(sample, errs, sqrt(2 * h / (G + A if up else G - A)), "s")
    return "alto" if up else "basso"


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
