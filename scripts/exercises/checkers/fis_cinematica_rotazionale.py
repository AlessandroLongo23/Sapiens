"""Checker for fis-cinematica-rotazionale (specs/exercises/fis-cinematica-rotazionale.md), written from the spec and
the lesson 86-fis-cinematica-rotazionale.md, not from the generator.

alpha_m = (omega - omega0) / dt, with n revolutions per minute worth 2 pi n / 60 rad/s; omega = omega0 + alpha t;
theta = omega0 t + alpha t^2 / 2; a turn is 2 pi rad; omega^2 = omega0^2 + 2 alpha dtheta; a_t = alpha r and
a_c = omega^2 r with r in metres. Exact values with sympy (pi symbolic), answers rounded half up to two significant
figures.
"""
import re

from checkers._fis_rotazioni import Q, Rational, answer, common, data2, pi, prose, sqrt

CASE_RANGES = {
    1: {"da fermo": (0.40, 0.60), "varia": (0.40, 0.60)},
    3: {"velocità": (0.40, 0.60), "arresto": (0.40, 0.60)},
    4: {"da fermo": (0.40, 0.60), "con velocità iniziale": (0.40, 0.60)},
    5: {"frenata": (0.40, 0.60), "partenza": (0.40, 0.60)},
    6: {"angolo": (0.40, 0.60), "velocità": (0.40, 0.60)},
    7: {"tangenziale": (0.40, 0.60), "centripeta": (0.40, 0.60)},
}

BODY = r"(Un disco|Una ruota|Una puleggia|Un volano)"
body = r"(un disco|una ruota|una puleggia|un volano)"
RPM = (120, 180, 240, 300, 450, 600, 900, 1200)
MOTOR = {
    "Il cestello di una lavatrice": ("parte da fermo e raggiunge", "sua"),
    "Il disco di una smerigliatrice": ("parte da fermo e raggiunge", "sua"),
    "La punta di un trapano": ("parte da ferma e raggiunge", "sua"),
    "Le lame di un frullatore": ("partono da ferme e raggiungono", "loro"),
}


def level1(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(BODY + " parte da fermo e in " + Q("s") + " raggiunge la velocità angolare di " + Q("rad/s") + r"\. Quanto vale la sua accelerazione angolare media\?", s):
        dt, w = data2(errs, m.group(2), "dt", 1.1, 20), data2(errs, m.group(3), "omega", 1.1, 40)
        a = w / dt
        if a < Rational(1, 10):
            errs.append("acceleration under 0,1 rad/s^2")
        answer(sample, errs, a, "rad/s^2")
        return "da fermo"
    m = re.fullmatch("La velocità angolare di " + body + " passa da " + Q("rad/s") + " a " + Q("rad/s") + " in " + Q("s") + r"\. Quanto vale, in modulo, la sua accelerazione angolare media\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    w0, w, dt = data2(errs, m.group(2), "omega0", 1.1, 40), data2(errs, m.group(3), "omega", 1.1, 40), data2(errs, m.group(4), "dt", 1.1, 20)
    if abs(w - w0) < Rational(1, 5) * max(w, w0):
        errs.append("the two angular velocities are too close")
    if min(w, w0) < Rational(1, 4) * max(w, w0):
        errs.append("the smaller angular velocity is under a quarter of the larger")
    a = abs(w - w0) / dt
    if a < Rational(1, 10):
        errs.append("acceleration under 0,1 rad/s^2")
    answer(sample, errs, a, "rad/s^2")
    return "varia"


def level2(sample, errs):
    s = prose(sample["problem"])
    for who, (verb, poss) in MOTOR.items():
        if m := re.fullmatch(re.escape(f"{who} {verb} i ") + r"\$(\d+)\$ giri al minuto in " + Q("s") + re.escape(f". Quanto vale la {poss} accelerazione angolare media?"), s):
            n = int(m.group(1))
            if n not in RPM:
                errs.append("revolutions per minute not in the list")
            dt = data2(errs, m.group(2), "dt", 2, 20)
            answer(sample, errs, 2 * pi * n / 60 / dt, "rad/s^2")
            return "giri al minuto"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch("Una ruota gira a " + Q("rad/s") + " e accelera, con accelerazione angolare costante di " + Q("rad/s^2") + ", per " + Q("s") + r"\. Quale velocità angolare raggiunge\?", s):
        w0, a, t = data2(errs, m.group(1), "omega0", 1.1, 40), data2(errs, m.group(2), "alpha", 0.5, 9.9), data2(errs, m.group(3), "t", 1.1, 9.9)
        answer(sample, errs, w0 + a * t, "rad/s")
        return "velocità"
    m = re.fullmatch("Le pale di un ventilatore girano a " + Q("rad/s") + r"\. Spento il motore, rallentano con accelerazione angolare costante di modulo " + Q("rad/s^2") + r"\. Dopo quanto tempo si fermano\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    w0, a = data2(errs, m.group(1), "omega0", 1.1, 40), data2(errs, m.group(2), "alpha", 0.5, 9.9)
    if w0 / a < Rational(1, 2):
        errs.append("stops in less than half a second")
    answer(sample, errs, w0 / a, "s")
    return "arresto"


def level4(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch("Un disco parte da fermo con accelerazione angolare costante di " + Q("rad/s^2") + r"\. Di quale angolo ruota in " + Q("s") + r"\?", s):
        a, t = data2(errs, m.group(1), "alpha", 0.5, 9.9), data2(errs, m.group(2), "t", 1.1, 9.9)
        answer(sample, errs, a * t**2 / 2, "rad")
        return "da fermo"
    m = re.fullmatch("Una ruota gira a " + Q("rad/s") + " e accelera, con accelerazione angolare costante di " + Q("rad/s^2") + ", per " + Q("s") + r"\. Di quale angolo ruota in questo tempo\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    w0, a, t = data2(errs, m.group(1), "omega0", 1.1, 20), data2(errs, m.group(2), "alpha", 0.5, 9.9), data2(errs, m.group(3), "t", 1.1, 9.9)
    answer(sample, errs, w0 * t + a * t**2 / 2, "rad")
    return "con velocità iniziale"


def level5(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch("Le pale di un ventilatore girano a " + Q("rad/s") + r"\. Spento il motore, rallentano con accelerazione angolare costante e si fermano in " + Q("s") + r"\. Quanti giri fanno prima di fermarsi\?", s):
        w0, t = data2(errs, m.group(1), "omega0", 5, 60), data2(errs, m.group(2), "t", 2, 20)
        # alpha = -omega0 / t, theta = omega0 t + alpha t^2 / 2 = omega0 t / 2
        turns = (w0 * t - w0 / t * t**2 / 2) / (2 * pi)
        kind = "frenata"
    elif m := re.fullmatch("Una mola parte da ferma con accelerazione angolare costante di " + Q("rad/s^2") + r"\. Quanti giri fa nei primi " + Q("s") + r"\?", s):
        a, t = data2(errs, m.group(1), "alpha", 0.5, 9.9), data2(errs, m.group(2), "t", 2, 20)
        turns = a * t**2 / 2 / (2 * pi)
        kind = "partenza"
    else:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    if turns < 1:
        errs.append("less than one turn")
    answer(sample, errs, turns, "giri")
    return kind


def level6(sample, errs):
    s = prose(sample["problem"])
    start = "Un volano parte da fermo con accelerazione angolare costante di " + Q("rad/s^2") + r"\. "
    if m := re.fullmatch(start + "Di quale angolo ha ruotato quando la sua velocità angolare è " + Q("rad/s") + r"\?", s):
        a, w = data2(errs, m.group(1), "alpha", 0.5, 9.9), data2(errs, m.group(2), "omega", 2, 40)
        th = w**2 / (2 * a)
        if th < 1:
            errs.append("angle under 1 rad")
        answer(sample, errs, th, "rad")
        return "angolo"
    if m := re.fullmatch(start + "Quale velocità angolare ha dopo aver ruotato di " + Q("rad") + r"\?", s):
        a, th = data2(errs, m.group(1), "alpha", 0.5, 9.9), data2(errs, m.group(2), "dtheta", 2, 60)
        answer(sample, errs, sqrt(2 * a * th), "rad/s")
        return "velocità"
    errs.append(f"level 6 text not recognised: {s!r}")
    return None


def level7(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch("Un disco ruota con accelerazione angolare di " + Q("rad/s^2") + r"\. Quanto vale l'accelerazione tangenziale di un punto a " + Q("cm") + r" dall'asse\?", s):
        a, r = data2(errs, m.group(1), "alpha", 0.5, 20), data2(errs, m.group(2), "r", 11, 99) / 100
        if a * r < Rational(1, 10):
            errs.append("acceleration under 0,1 m/s^2")
        answer(sample, errs, a * r, "m/s^2")
        return "tangenziale"
    if m := re.fullmatch("In un certo istante un disco gira con velocità angolare " + Q("rad/s") + r"\. Quanto vale l'accelerazione centripeta di un punto a " + Q("cm") + r" dall'asse\?", s):
        w, r = data2(errs, m.group(1), "omega", 1.1, 20), data2(errs, m.group(2), "r", 11, 99) / 100
        if w**2 * r < Rational(1, 10):
            errs.append("acceleration under 0,1 m/s^2")
        answer(sample, errs, w**2 * r, "m/s^2")
        return "centripeta"
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
