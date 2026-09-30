"""Checker for fis-moto-armonico (specs/exercises/fis-moto-armonico.md), written from the spec and the lesson
49-fis-moto-armonico.md, not from the generator.

The amplitude is half the distance between the two ends; the period is the time over the number of complete
oscillations; starting from x = A, x = A cos(omega t) with omega = 2 pi / T and the angle in radians; v_max = omega A
and a_max = omega^2 A with A in metres (omega = 2 pi f or 2 pi / T); from v_max and a_max, omega = a / v, T = 2 pi / omega
and A = v / omega. Exact values with sympy, rounded half up to two significant figures.
"""
import re

from sympy import Integer, Rational, cos, pi

from checkers._fis_moti_piano import Q, answer, common, data2, prose

CASE_RANGES = {
    1: {"ampiezza": (0.40, 0.60), "periodo": (0.40, 0.60)},
    3: {"frequenza": (0.40, 0.60), "periodo": (0.40, 0.60)},
    4: {"frequenza": (0.40, 0.60), "periodo": (0.40, 0.60)},
    5: {"periodo": (0.40, 0.60), "ampiezza": (0.40, 0.60)},
}

BODY = r"(Un peso appeso a una molla|Il pistone di un motore|L'ago di una macchina da cucire)"
FRACTIONS = {Rational(p, q) for p, q in [(1, 8), (1, 6), (1, 3), (3, 8), (5, 8), (2, 3), (5, 6), (7, 8), (1, 12), (5, 12), (7, 12), (11, 12)]}


def level1(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(BODY + r" si muove di moto armonico tra due punti distanti " + Q("cm") + r"\. Quanto vale l'ampiezza del moto\?", s):
        answer(sample, errs, data2(errs, m.group(2), "D", 2.2, 60) / 2, "cm")
        return "ampiezza"
    if m := re.fullmatch(BODY + r" si muove di moto armonico e compie \$(\d+)\$ oscillazioni complete in " + Q("s") + r"\. Quanto vale il periodo del moto\?", s):
        N = int(m.group(2))
        if not (11 <= N <= 60 and N % 10):
            errs.append("number of oscillations outside the rule")
        T = data2(errs, m.group(3), "time", 2, 99) / Integer(N)
        if not Rational(1, 10) <= T <= 5:
            errs.append("period outside 0,1-5 s")
        answer(sample, errs, T, "s")
        return "periodo"
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un corpo si muove di moto armonico con ampiezza " + Q("cm") + " e periodo " + Q("s") + r"; all'istante \$t = 0\$ si trova nell'estremità \$x = A\$\. Dove si trova all'istante \$t = (\d+(?:\{,\}\d+)?)\\,\\text\{s\}\$\?",
        s,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    A, T, t = data2(errs, m.group(1), "A", 2.0, 20), data2(errs, m.group(2), "T", 1.2, 9.6), data2(errs, m.group(3), "t")
    if t / T not in FRACTIONS:
        errs.append(f"t/T = {t / T} is not one of the allowed fractions")
    phase = 2 * pi * t / T
    if abs(cos(phase)) < Rational(1, 5):
        errs.append("cosine too close to zero")
    answer(sample, errs, A * cos(phase), "cm")
    return None


def level34(sample, errs, what):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un corpo oscilla di moto armonico con ampiezza " + Q("cm") + r" e (frequenza " + Q("Hz") + "|periodo " + Q("s") + r")\. Quanto vale la sua " + what + r" massima\?", s)
    if not m:
        errs.append(f"text not recognised: {s!r}")
        return None
    A = data2(errs, m.group(1), "A", 1.1, 60) / 100
    if m.group(3):
        w, kind = 2 * pi * data2(errs, m.group(3), "f", 0.2, 9.9 if what == "velocità" else 5.0), "frequenza"
    else:
        w, kind = 2 * pi / data2(errs, m.group(4), "T", 0.2, 5.0), "periodo"
    if what == "velocità":
        if w * A < Rational(1, 100):
            errs.append("speed under 0,01 m/s")
        answer(sample, errs, w * A, "m/s")
    else:
        if w**2 * A < Rational(5, 100):
            errs.append("acceleration under 0,05 m/s^2")
        answer(sample, errs, w**2 * A, "m/s^2")
    return kind


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Nel moto armonico di un corpo la velocità massima è " + Q("m/s") + " e l'accelerazione massima è " + Q("m/s^2") + r"\. Quanto vale (il periodo|l'ampiezza)\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    v, a = data2(errs, m.group(1), "v", 0.11, 9.9), data2(errs, m.group(2), "a", 0.5, 99)
    w = a / v
    if not Rational(1, 2) <= w <= 50:
        errs.append("omega outside 0,5-50 rad/s")
    if v / w < Rational(1, 100):
        errs.append("amplitude under 1 cm")
    if m.group(3) == "il periodo":
        answer(sample, errs, 2 * pi / w, "s")
        return "periodo"
    answer(sample, errs, v / w, "m")
    return "ampiezza"


LEVELS = {1: level1, 2: level2, 3: lambda s, e: level34(s, e, "velocità"), 4: lambda s, e: level34(s, e, "accelerazione"), 5: level5}


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
