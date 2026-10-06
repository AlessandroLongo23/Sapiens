"""Checker for fis-forze-apparenti (specs/exercises/fis-forze-apparenti.md), written from the spec and the lesson
75-fis-forze-apparenti.md, not from the generator.

In a frame with acceleration A the apparent force on a mass m is m A, opposite to A. A body on the floor does not
slide while m A <= mu_s m g, so the hardest braking is mu_s g and mu_s = A / g. In a lift accelerating upwards the
floor pushes with m (g + A), downwards with m (g - A). In a frame turning at omega the centrifugal force at distance r
is m omega^2 r, with omega = 2 pi / T = 2 pi n / 60 for n turns per minute; a coin stays put while
omega <= sqrt(mu_s g / r), that is r <= mu_s g / omega^2. The Coriolis force acts only on bodies moving relative to
the turning frame and deflects them to the right of their motion if the frame turns counterclockwise (northern
hemisphere), to the left if clockwise (southern hemisphere). g = 49/5.
"""
from sympy import sqrt

from checkers._fis_riferimenti import G, Q, Rational, answer2, answer_num, answer_word, common, data2, no_scene, num, pi, prose, re

CASE_RANGES = {
    1: {"frena": (0.40, 0.60), "parte": (0.40, 0.60)},
    2: {"frenata": (0.40, 0.60), "coefficiente": (0.40, 0.60)},
    3: {"alto": (0.40, 0.60), "basso": (0.40, 0.60)},
    5: {"periodo": (0.40, 0.60), "giri": (0.40, 0.60)},
    6: {"omega": (0.40, 0.60), "raggio": (0.40, 0.60)},
    7: {"piattaforma": (0.33, 0.47), "terra": (0.33, 0.47), "fermo": (0.14, 0.26)},
}

ACC, KG, MET, SEC, RADS = Q("m/s^2"), Q("kg"), Q("m"), Q("s"), Q("rad/s")
MU = r"\$\\mu_s = (0\{,\}\d\d)\$"
SIDES = {"destra": "verso destra", "sinistra": "verso sinistra", "nulla": "è nulla", "esterno": "verso l'esterno"}


def mu_of(errs, s):
    k = num(s)
    if not Rational(15, 100) <= k <= Rational(60, 100):
        errs.append(f"mu {s} outside 0,15-0,60")
    return k


def level1(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(r"Un autobus (frena|parte) con un'accelerazione di modulo " + ACC + r"\. Quanto vale, nel sistema dell'autobus, la forza apparente su uno zaino di " + KG + r" appoggiato su un sedile\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    A, mass = data2(errs, m.group(2), "A", 1.1, 4.9), data2(errs, m.group(3), "m", 2.0, 9.9)
    answer2(sample, errs, mass * A, "N")
    # the direction is in the last step: forwards when the bus brakes, backwards when it starts
    want = "la forza apparente è diretta in avanti" if m.group(1) == "frena" else "la forza apparente è diretta all'indietro"
    if want not in sample["steps"][-1]:
        errs.append("the direction of the apparent force is wrong or missing")
    return m.group(1)


def level2(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    if m := re.fullmatch(r"Una valigia di " + KG + r" è appoggiata sul pavimento di un autobus; il coefficiente di attrito statico è " + MU + r"\. Qual è la frenata più forte che l'autobus può fare senza che la valigia scivoli\?", s):
        data2(errs, m.group(1), "m", 5.0, 25)
        answer2(sample, errs, mu_of(errs, m.group(2)) * G, "m/s^2")
        return "frenata"
    if m := re.fullmatch(r"Una valigia di " + KG + r", appoggiata sul pavimento di un autobus, comincia a scivolare quando la frenata supera " + ACC + r"\. Quanto vale il coefficiente di attrito statico tra la valigia e il pavimento\?", s):
        data2(errs, m.group(1), "m", 5.0, 25)
        answer_num(sample, errs, data2(errs, m.group(2), "A", 1.5, 5.9) / G)
        return "coefficiente"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(r"Un pacco di " + KG + r" è sul pavimento di un ascensore che accelera verso (l'alto|il basso) con " + ACC + r"\. Con quale forza il pavimento sostiene il pacco\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    mass, A = data2(errs, m.group(1), "m", 1.1, 7.9), data2(errs, m.group(3), "A", 1.1, 3.5)
    up = m.group(2) == "l'alto"
    answer2(sample, errs, mass * (G + A if up else G - A), "N")
    return "alto" if up else "basso"


def level4(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(r"Una piattaforma ruota con velocità angolare " + RADS + r"\. Su di essa è fermo un oggetto di " + KG + ", a " + MET + r" dall'asse\. Quanto vale la forza centrifuga sull'oggetto, nel sistema della piattaforma\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    w, mass, r = data2(errs, m.group(1), "omega", 1.5, 6.0), data2(errs, m.group(2), "m", 0.11, 5.0), data2(errs, m.group(3), "r", 0.5, 3.0)
    if Rational(3, 4) < r < Rational(13, 10):
        errs.append("r too close to 1 m: the wrong formulas give almost the same number")
    answer2(sample, errs, mass * w**2 * r, "N")
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    if m := re.fullmatch(r"Una giostra fa un giro ogni " + SEC + r"\. Su un sedile, a " + MET + r" dall'asse, è appoggiato uno zaino di " + KG + r"\. Quanto vale la forza centrifuga sullo zaino, nel sistema della giostra\?", s):
        T, r, mass = data2(errs, m.group(1), "T", 3.0, 9.9), data2(errs, m.group(2), "r", 1.5, 4.0), data2(errs, m.group(3), "m", 1.1, 9.9)
        answer2(sample, errs, mass * (2 * pi / T) ** 2 * r, "N")
        return "periodo"
    if m := re.fullmatch(r"Un piatto fa \$(\d+)\$ giri al minuto\. Su di esso è fermo un oggetto di " + KG + ", a " + MET + r" dall'asse\. Quanto vale la forza centrifuga sull'oggetto, nel sistema del piatto\?", s):
        n = int(m.group(1))
        if n not in {33, 45, 78, 24, 36, 54, 66, 72, 84, 96}:
            errs.append(f"{n} turns per minute not allowed")
        mass, r = data2(errs, m.group(2), "m", 0.11, 0.99), data2(errs, m.group(3), "r", 0.11, 0.45)
        answer2(sample, errs, mass * (2 * pi * Rational(n, 60)) ** 2 * r, "N")
        return "giri"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


def level6(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    if m := re.fullmatch(r"Una moneta è appoggiata su un piatto che ruota, a " + MET + r" dall'asse; il coefficiente di attrito statico è " + MU + r"\. Fino a quale velocità angolare la moneta resta ferma sul piatto\?", s):
        r, k = data2(errs, m.group(1), "r", 0.11, 0.45), mu_of(errs, m.group(2))
        answer2(sample, errs, sqrt(k * G / r), "rad/s")
        return "omega"
    if m := re.fullmatch(r"Un piatto ruota a " + RADS + r"; tra il piatto e una moneta il coefficiente di attrito statico è " + MU + r"\. Fino a quale distanza dall'asse la moneta, appoggiata sul piatto, resta ferma\?", s):
        w, k = data2(errs, m.group(1), "omega", 2.0, 9.9), mu_of(errs, m.group(2))
        answer2(sample, errs, k * G / w**2, "m")
        return "raggio"
    errs.append(f"level 6 text not recognised: {s!r}")
    return None


def level7(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    head = r"Una piattaforma ruota in senso (antiorario|orario), vista dall'alto, a " + RADS + r"\. "
    if m := re.fullmatch(head + r"Una palla viene lanciata sul suo piano liscio\. Vista dalla piattaforma, da che parte la forza di Coriolis devia la palla, rispetto al verso del suo moto\?", s):
        data2(errs, m.group(2), "omega", 0.2, 0.9)
        answer_word(sample, errs, "destra" if m.group(1) == "antiorario" else "sinistra", SIDES)
        return "piattaforma"
    if m := re.fullmatch(head + r"Una cassa è ferma sulla piattaforma\. Nel sistema della piattaforma, come è diretta la forza di Coriolis sulla cassa\?", s):
        data2(errs, m.group(2), "omega", 0.2, 0.9)
        answer_word(sample, errs, "nulla", SIDES)
        return "fermo"
    if m := re.fullmatch(r"(Un vento|Una corrente marina|Un proiettile a lunga gittata) si muove verso (nord|sud|est|ovest) nell'emisfero (nord|sud), lontano dall'equatore\. Da che parte (lo|la) devia la forza di Coriolis, rispetto al verso del moto\?", s):
        if (m.group(4) == "la") != (m.group(1) == "Una corrente marina"):
            errs.append("agreement")
        answer_word(sample, errs, "destra" if m.group(3) == "nord" else "sinistra", SIDES)
        return "terra"
    errs.append(f"level 7 text not recognised: {s!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


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
