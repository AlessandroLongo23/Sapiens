"""Checker for fis-punto-materiale (specs/exercises/fis-punto-materiale.md), written from the spec and the lesson
38-fis-punto-materiale.md, not from the generator.

On a straight road the displacement is the final position minus the initial one, with its sign; the distance
travelled adds the lengths of every stretch, all positive. An interval between two clock times counts minutes, sixty
to the hour. From a table of positions (the body never turns between two readings) the distance adds the absolute
differences of consecutive positions. Every answer is exact.
"""
import re

from sympy import Rational

from checkers._cinematica import NUM, answer, dec, read, scene_road, table_ts
from checkers._vettori import common

CASE_RANGES = {
    1: {"positivo": (0.40, 0.60), "negativo": (0.40, 0.60)},
    3: {"distanza": (0.40, 0.60), "spostamento": (0.40, 0.60)},
    4: {"distanza": (0.40, 0.60), "spostamento": (0.40, 0.60)},
}

QM = r"(" + NUM + r")\\,\\text\{m\}"
BODY = r"(Un ciclista|Un pedone|Un carrello|Un cane|Un monopattino)"


def points(d):
    return sorted(Rational(str(p["s"])) for p in d.get("punti", []))


def level1(sample, errs):
    s, other = read(sample["problem"])
    m = re.fullmatch(BODY + r" si muove su una strada dritta e passa dalla posizione \$s_1 = " + QM + r"\$ alla posizione \$s_2 = " + QM + r"\$\. Quanto vale il suo spostamento\?", s)
    if not m or other:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    s1, s2 = dec(m.group(2)), dec(m.group(3))
    for x in (s1, s2):
        if x == 0 or x % 5 or not -90 <= x <= 150:
            errs.append(f"position {x} outside the rules")
    if s1 == s2:
        errs.append("equal positions")
    answer(sample, errs, s2 - s1, "m")
    d = scene_road(sample)
    if d is None or points(d) != sorted([s1, s2]) or "spostamento" in d:
        errs.append("scene does not match the data")
    sol = scene_road(sample, "solutionScene")
    if sol is None or sol.get("spostamento") != {"da": int(s1), "a": int(s2)}:
        errs.append("solution scene without the displacement")
    return "negativo" if s2 < s1 else "positivo"


TRIP = [
    r"Un autobus parte alle (\d+):(\d\d) e arriva al capolinea alle (\d+):(\d\d)\. Quanto dura il viaggio\?",
    r"Un treno parte alle (\d+):(\d\d) e arriva alla stazione successiva alle (\d+):(\d\d)\. Quanto dura il viaggio\?",
    r"Una gara di corsa comincia alle (\d+):(\d\d) e l'ultimo atleta arriva alle (\d+):(\d\d)\. Quanto dura la gara\?",
]


def level2(sample, errs):
    s, other = read(sample["problem"])
    for pat in TRIP:
        m = re.fullmatch(pat, s)
        if m:
            break
    else:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    h1, m1, h2, m2 = (int(x) for x in m.groups())
    if not (0 <= m1 < 60 and 0 <= m2 < 60):
        errs.append("minutes out of range")
    minutes = (h2 * 60 + m2) - (h1 * 60 + m1)
    if not 12 <= minutes <= 95:
        errs.append(f"duration {minutes} outside 12-95")
    if h2 == h1:
        errs.append("the interval does not cross the hour")
    answer(sample, errs, Rational(minutes), "min")
    if sample.get("scene"):
        errs.append("no scene expected")
    return "orari"


def level3(sample, errs):
    s, other = read(sample["problem"])
    m = re.fullmatch(
        BODY + r" parte da \$s = " + QM + r"\$, arriva fino a \$s = " + QM + r"\$ e poi torna indietro fino a \$s = " + QM + r"\$, sempre sulla stessa strada dritta\. Quanto vale (la distanza percorsa|lo spostamento)\?",
        s,
    )
    if not m or other:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    s0, s1, s2 = dec(m.group(2)), dec(m.group(3)), dec(m.group(4))
    # a real turn: the second stretch goes the other way
    if (s1 - s0) * (s2 - s1) >= 0:
        errs.append("no turn")
    if s2 == s0:
        errs.append("zero displacement")
    for x in (s0, s1, s2):
        if x % 5:
            errs.append("positions not multiples of 5")
    if not 30 <= abs(s1 - s0) <= 200:
        errs.append("first stretch outside 30-200")
    dist = m.group(5) == "la distanza percorsa"
    answer(sample, errs, abs(s1 - s0) + abs(s2 - s1) if dist else s2 - s0, "m")
    d = scene_road(sample)
    if d is None or points(d) != sorted([s0, s1, s2]) or "spostamento" in d or len(d.get("tratti", [])) != 2:
        errs.append("scene does not match the data")
    return "distanza" if dist else "spostamento"


LEAD = r"Un'automobilina telecomandata si muove su un corridoio dritto\. Un sensore misura la sua posizione ogni \$(\d+)\\,\\text\{s\}\$, e tra una misura e la successiva l'automobilina non cambia verso\. "


def level4(sample, errs):
    s, other = read(sample["problem"])
    if len(other) != 1:
        errs.append("level 4 needs one table")
        return None
    tu, su, ts, ss = table_ts(other[0])
    if (tu, su) != ("s", "m") or len(ts) != 6:
        errs.append("table units or size")
        return None
    m = re.fullmatch(LEAD + r"(?:Quanto vale la distanza percorsa in tutti i \$(\d+)\\,\\text\{s\}\$\?|Quanto vale lo spostamento tra \$t = (\d+)\\,\\text\{s\}\$ e \$t = (\d+)\\,\\text\{s\}\$\?)", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    step = int(m.group(1))
    if ts != [step * i for i in range(6)]:
        errs.append("times are not every step")
    diffs = [ss[i + 1] - ss[i] for i in range(5)]
    signs = [1 if x > 0 else -1 for x in diffs if x != 0]
    turns = sum(1 for a, b in zip(signs, signs[1:]) if a != b)
    if turns != 1:
        errs.append(f"the table has {turns} turns, not one")
    if m.group(2):
        if int(m.group(2)) != 5 * step:
            errs.append("total time")
        answer(sample, errs, sum(abs(x) for x in diffs), "m")
        return "distanza"
    t1, t2 = int(m.group(3)), int(m.group(4))
    if t1 not in ts or t2 not in ts or t2 <= t1:
        errs.append("instants not in the table")
        return None
    i, j = ts.index(t1), ts.index(t2)
    # the interval straddles the turn
    part = [x for x in diffs[i:j] if x != 0]
    if not part or all(x > 0 for x in part) or all(x < 0 for x in part):
        errs.append("the interval does not straddle the turn")
    if ss[j] == ss[i]:
        errs.append("zero displacement")
    answer(sample, errs, ss[j] - ss[i], "m")
    return "spostamento"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4}


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
