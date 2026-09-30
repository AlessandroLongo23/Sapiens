"""Checker for fis-accelerazione (specs/exercises/fis-accelerazione.md), written from the spec and the lesson
41-fis-accelerazione.md, not from the generator.

The mean acceleration is the change of velocity over the interval, a = (v2 - v1) / (t2 - t1), in m/s^2, with its
sign; speeds in km/h are divided by 3,6 first. From it, v2 = v1 + a dt and dt = (v2 - v1) / a. A body brakes when
velocity and acceleration have opposite signs. Bodies are plausible: a train does not change speed faster than
1,5 m/s^2, nothing here faster than 7 m/s^2.
"""
import re

from sympy import Rational

from checkers._cinematica import NUM, answer, answer_sig, dec, plausible, read
from checkers._vettori import common

CASE_RANGES = {
    3: {"si ferma": (0.40, 0.60), "rallenta": (0.40, 0.60)},
    4: {"velocita": (0.40, 0.60), "tempo": (0.40, 0.60)},
    5: {"frena": (0.40, 0.60), "accelera": (0.40, 0.60)},
}

BODY = r"(Un ciclista|Un pedone|Un carrello|Un cane|Un monopattino|Un motorino|Un'auto|Un treno|Una moto)"


def q(unit):
    tex = {"s": r"\\text\{s\}", "m/s": r"\\text\{m/s\}", "km/h": r"\\text\{km/h\}", "m/s2": r"\\text\{m/s\}\^2"}[unit]
    return r"\$(" + NUM + r")\\," + tex + r"\$"


def real(errs, body, v, a):
    plausible(errs, "Un'auto" if body == "Una moto" else body, v)
    if abs(a) > 7:
        errs.append(f"acceleration {a} beyond 7 m/s^2")
    if body == "Un treno" and abs(a) > Rational(3, 2):
        errs.append("a train at more than 1,5 m/s^2")


def two_sig_tenths(a):
    """1,1 to 6,9 in tenths, no zero after the comma."""
    k = abs(a) * 10
    return k.q == 1 and 11 <= k <= 69 and k % 10 != 0


def level1(sample, errs):
    s, other = read(sample["problem"])
    m = re.fullmatch(BODY + r" passa da " + q("m/s") + " a " + q("m/s") + " in " + q("s") + r"\. Qual è la sua accelerazione media\?", s)
    if not m or other:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    v1, v2, dt = dec(m.group(2)), dec(m.group(3)), dec(m.group(4))
    a = (v2 - v1) / dt
    if not two_sig_tenths(a) or v2 <= v1:
        errs.append(f"acceleration {a} outside the rules")
    real(errs, m.group(1), v2, a)
    answer(sample, errs, a, "m/s2")
    return "media"


def level2(sample, errs):
    s, other = read(sample["problem"])
    tail = r" Qual è la sua accelerazione media\?"
    if m := re.fullmatch(r"(Un'auto|Una moto|Un treno) parte da ferm([ao]) e raggiunge " + q("km/h") + " in " + q("s") + r"\." + tail, s):
        body, v1, v2, dt = m.group(1), Rational(0), dec(m.group(3)), dec(m.group(4))
        if (m.group(2) == "o") != (body == "Un treno"):
            errs.append("agreement")
    elif m := re.fullmatch(r"(Un'auto|Una moto|Un treno) passa da " + q("km/h") + " a " + q("km/h") + " in " + q("s") + r"\." + tail, s):
        body, v1, v2, dt = m.group(1), dec(m.group(2)), dec(m.group(3)), dec(m.group(4))
    else:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    a = (v2 - v1) / Rational(36, 10) / dt
    if (v1 / Rational(36, 10)).q != 1 or (v2 / Rational(36, 10)).q != 1:
        errs.append("speeds are not whole m/s")
    real(errs, body, v2 / Rational(36, 10), a)
    answer_sig(sample, errs, a, 2, "m/s2")
    return "kmh"


def level3(sample, errs):
    s, other = read(sample["problem"])
    tail = r" Qual è la sua accelerazione media\?"
    if m := re.fullmatch(BODY + r" che va a " + q("m/s") + r" frena e si ferma in " + q("s") + r"\." + tail, s):
        v1, v2, dt, kind = dec(m.group(2)), Rational(0), dec(m.group(3)), "si ferma"
    elif m := re.fullmatch(BODY + r" che va a " + q("m/s") + r" frena e in " + q("s") + r" scende a " + q("m/s") + r"\." + tail, s):
        v1, dt, v2, kind = dec(m.group(2)), dec(m.group(3)), dec(m.group(4)), "rallenta"
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    a = (v2 - v1) / dt
    if not two_sig_tenths(a) or not v1 > v2 >= 0:
        errs.append(f"braking {a} outside the rules")
    real(errs, m.group(1), v1, a)
    answer(sample, errs, a, "m/s2")
    return kind


def level4(sample, errs):
    s, other = read(sample["problem"])
    if m := re.fullmatch(BODY + r" va a " + q("m/s") + r" e (frena|accelera) per " + q("s") + r" con un'accelerazione media di " + q("m/s2") + r"\. A che velocità arriva\?", s):
        v1, dt, a = dec(m.group(2)), dec(m.group(4)), dec(m.group(5))
        v2 = v1 + a * dt
        kind = "velocita"
        answer(sample, errs, v2, "m/s")
    elif m := re.fullmatch(BODY + r" va a " + q("m/s") + r" e (frena|accelera) con un'accelerazione media di " + q("m/s2") + r"\. Quanto tempo impiega per (fermarsi|arrivare a " + q("m/s") + r")\?", s):
        v1, a = dec(m.group(2)), dec(m.group(4))
        v2 = Rational(0) if m.group(5) == "fermarsi" else dec(m.group(6))
        dt = (v2 - v1) / a
        kind = "tempo"
        if dt.q != 1 or not 2 <= dt <= 30:
            errs.append(f"time {dt} not whole in 2-30")
        answer(sample, errs, dt, "s")
    else:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    if (m.group(3) == "frena") != (a < 0):
        errs.append("brakes with a positive acceleration, or the other way")
    if v2 < 0 or v2 == v1 or (v2 - v1).q != 1:
        errs.append("final velocity")
    real(errs, m.group(1), max(v1, v2), a)
    return kind


def level5(sample, errs):
    s, other = read(sample["problem"])
    m = re.fullmatch(
        BODY + r" si muove nel verso negativo di una strada dritta\. All'istante \$t_1 = (" + NUM + r")\\,\\text\{s\}\$ la sua velocità è \$v_1 = (" + NUM + r")\\,\\text\{m/s\}\$, all'istante \$t_2 = (" + NUM + r")\\,\\text\{s\}\$ è \$v_2 = (" + NUM + r")\\,\\text\{m/s\}\$\. Qual è la sua accelerazione media\?",
        s,
    )
    if not m or other:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    t1, v1, t2, v2 = (dec(x) for x in m.groups()[1:])
    if not (v1 < 0 and v2 < 0 and t2 > t1):
        errs.append("velocities not negative, or times in the wrong order")
        return None
    a = (v2 - v1) / (t2 - t1)
    if not two_sig_tenths(a):
        errs.append(f"acceleration {a} outside the rules")
    real(errs, m.group(1), min(v1, v2), a)
    answer(sample, errs, a, "m/s2")
    # braking: |v| decreases, the acceleration is positive
    return "frena" if abs(v2) < abs(v1) else "accelera"


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
    if sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
