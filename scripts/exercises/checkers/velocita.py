"""Checker for velocita (specs/exercises/velocita.md), written from the spec and the lesson 39-velocita.md, not from
the generator.

The mean velocity is the displacement over the interval, with its sign; the mean speed is the distance travelled over
the interval. 1 m/s = 3,6 km/h. A distance is speed times time with the time in hours; a time is distance over speed,
in minutes. On a trip in two stretches the mean velocity is the total distance over the total time. Exact values with
sympy; rounded answers (levels 4 and 5) are refused near a boundary.
"""
import re

from sympy import Rational

from checkers._cinematica import NUM, answer, answer_sig, dec, fmt, plausible, read, scene_road
from checkers._vettori import common, round_sig

CASE_RANGES = {
    1: {"positiva": (0.40, 0.60), "negativa": (0.40, 0.60)},
    2: {"kmh-ms": (0.40, 0.60), "ms-kmh": (0.40, 0.60)},
    3: {"distanza": (0.40, 0.60), "tempo": (0.40, 0.60)},
    4: {"scalare": (0.40, 0.60), "vettoriale": (0.40, 0.60)},
    5: {"distanze": (0.40, 0.60), "tempi": (0.40, 0.60)},
}


def q(unit):
    tex = {"m": r"\\text\{m\}", "s": r"\\text\{s\}", "min": r"\\text\{min\}", "km": r"\\text\{km\}", "km/h": r"\\text\{km/h\}", "m/s": r"\\text\{m/s\}"}[unit]
    return r"\$(" + NUM + r")\\," + tex + r"\$"


BODY = r"(Un ciclista|Un pedone|Un carrello|Un cane|Un monopattino|Un motorino|Un'auto|Un treno)"
VEHICLE = r"(?:Un'auto|Un treno|Un pullman)"


def two_sig(x):
    """A value with two significant figures, written without trailing zeros (1,5 to 9,5, or 11 to 99)."""
    digits = fmt(abs(x)).replace("{,}", "").lstrip("0")
    return len(digits) == 2


def level1(sample, errs):
    s, other = read(sample["problem"])
    m = re.fullmatch(
        BODY + r" su una strada dritta passa dalla posizione \$s_1 = (" + NUM + r")\\,\\text\{m\}\$ all'istante \$t_1 = (" + NUM + r")\\,\\text\{s\}\$ e dalla posizione \$s_2 = (" + NUM + r")\\,\\text\{m\}\$ all'istante \$t_2 = (" + NUM + r")\\,\\text\{s\}\$\. Qual è la sua velocità media\?",
        s,
    )
    if not m or other:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    s1, t1, s2, t2 = (dec(x) for x in m.groups()[1:])
    if t2 <= t1:
        errs.append("t2 not after t1")
        return None
    v = (s2 - s1) / (t2 - t1)
    if v == 0 or not two_sig(v) or (v * 2).q != 1:
        errs.append(f"velocity {v} not two significant figures in halves")
    answer(sample, errs, v, "m/s")
    plausible(errs, m.group(1), v)
    d = scene_road(sample)
    if d is None or sorted(Rational(str(p["s"])) for p in d.get("punti", [])) != sorted([s1, s2]):
        errs.append("scene does not match the data")
    return "negativa" if v < 0 else "positiva"


def level2(sample, errs):
    s, other = read(sample["problem"])
    if m := re.fullmatch(r"Converti in metri al secondo la velocità di " + q("km/h") + r"\.", s):
        kmh = dec(m.group(1))
        if not ((kmh % 9 == 0 and 18 <= kmh <= 135) or ((kmh / Rational(36, 10)).q == 1 and 5 <= kmh / Rational(36, 10) <= 40)):
            errs.append("km/h outside the rules")
        answer(sample, errs, kmh / Rational(36, 10), "m/s")
        return "kmh-ms"
    if m := re.fullmatch(r"Converti in chilometri all'ora la velocità di " + q("m/s") + r"\.", s):
        ms = dec(m.group(1))
        if not 5 <= ms <= 45 or ms % 10 == 0 or ms.q != 1:
            errs.append("m/s outside the rules")
        answer(sample, errs, ms * Rational(36, 10), "km/h")
        return "ms-kmh"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s, other = read(sample["problem"])
    lead = VEHICLE + r" viaggia a velocità costante di " + q("km/h") + r" su (?:un'autostrada|un binario|una strada) dritt[ao]\. "
    if m := re.fullmatch(lead + r"Quanta strada percorre in " + q("min") + r"\?", s):
        v, M = dec(m.group(1)), dec(m.group(2))
        d = v * M / 60
        if (d * 10).q != 1 or d < 1:
            errs.append("distance not a clean decimal")
        answer(sample, errs, d, "km")
        return "distanza"
    if m := re.fullmatch(lead + r"Quanto tempo impiega a percorrere " + q("km") + r"\?", s):
        v, d = dec(m.group(1)), dec(m.group(2))
        M = d / v * 60
        if M.q != 1:
            errs.append("time not whole minutes")
        answer(sample, errs, M, "min")
        return "tempo"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s, other = read(sample["problem"])
    m = re.fullmatch(
        BODY + r" parte da \$s = (" + NUM + r")\\,\\text\{m\}\$, arriva fino a \$s = (" + NUM + r")\\,\\text\{m\}\$ e torna indietro fino a \$s = (" + NUM + r")\\,\\text\{m\}\$, in tutto in " + q("s") + r"\. Quanto vale la sua (velocità scalare media|velocità media)\?",
        s,
    )
    if not m or other:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    s0, s1, s2, dt = (dec(x) for x in m.groups()[1:5])
    if (s1 - s0) * (s2 - s1) >= 0 or s2 == s0:
        errs.append("not a trip there and partly back")
    scalar = m.group(6) == "velocità scalare media"
    answer_sig(sample, errs, (abs(s1 - s0) + abs(s2 - s1)) / dt if scalar else (s2 - s0) / dt, 2, "m/s")
    plausible(errs, m.group(1), (abs(s1 - s0) + abs(s2 - s1)) / dt)
    if s0 % 10 or s1 % 10 or s2 % 10 or not 0 <= s0 <= 60:
        errs.append("positions not multiples of 10, or the start outside 0-60")
    d = scene_road(sample)
    if d is None or "spostamento" in d or sorted(Rational(str(p["s"])) for p in d.get("punti", [])) != sorted([s0, s1, s2]):
        errs.append("scene does not match the data")
    elif [(Rational(str(l["da"])), Rational(str(l["a"]))) for l in d.get("tratti", [])] != [(s0, s1), (s1, s2)]:
        errs.append("scene legs do not match the data")
    return "scalare" if scalar else "vettoriale"


def level5(sample, errs):
    s, other = read(sample["problem"])
    tail = r", sempre nello stesso verso\. Qual è la sua velocità media su tutto il viaggio\?"
    if m := re.fullmatch(VEHICLE + r" percorre " + q("km") + " a " + q("km/h") + r" e poi altri " + q("km") + " a " + q("km/h") + tail, s):
        d1, v1, d2, v2 = (dec(x) for x in m.groups())
        t1, t2 = d1 / v1, d2 / v2
        kind = "distanze"
    elif m := re.fullmatch(VEHICLE + r" viaggia per " + q("min") + " a " + q("km/h") + r" e poi per " + q("min") + " a " + q("km/h") + tail, s):
        m1, v1, m2, v2 = (dec(x) for x in m.groups())
        t1, t2 = m1 / 60, m2 / 60
        d1, d2 = v1 * t1, v2 * t2
        kind = "tempi"
    else:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    for v in (v1, v2):
        if v % 10 or not 30 <= v <= 130:
            errs.append(f"speed {v} not a multiple of 10 in 30-130")
    if kind == "distanze" and any((4 * x).q != 1 or not Rational(1, 4) <= x <= 3 for x in (t1, t2)):
        errs.append("the times of the stretches are not quarter hours up to 3 h")
    if kind == "tempi" and any(60 * x not in (10, 15, 20, 30, 40, 45, 60, 90) for x in (t1, t2)):
        errs.append("minutes outside the list")
    if t1 == t2 or v1 == v2:
        errs.append("equal times or speeds: the plain average would be right")
    V = (d1 + d2) / (t1 + t2)
    # rounded to the km/h
    fl = int(V)
    frac = V - fl
    if abs(frac - Rational(1, 2)) < Rational(1, 10**6):
        errs.append("answer at a half")
        return kind
    answer(sample, errs, Rational(fl + (1 if frac > Rational(1, 2) else 0)), "km/h")
    return kind


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
