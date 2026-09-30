"""Checker for fis-moto-rettilineo-uniforme (specs/exercises/fis-moto-rettilineo-uniforme.md), written from the spec
and the lesson 40-fis-moto-rettilineo-uniforme.md, not from the generator.

The law of uniform motion is s = s0 + v t, with v signed. On a space-time graph the line meets the s axis at s0 and
its slope is v; on a velocity-time graph the displacement is the area v (t2 - t1). Two bodies meet when s_A = s_B:
coming towards each other the gap closes at vA + vB, in a chase at vA - vB. The graph scenes are read back and must
match the problem: the line through the drawn points, with its slope.
"""
import re

from sympy import Rational

from checkers._cinematica import NUM, answer, dec, plausible, read, scene_road
from checkers._vettori import common

CASE_RANGES = {
    1: {"positiva": (0.40, 0.60), "negativa": (0.40, 0.60)},
    2: {"positiva": (0.40, 0.60), "negativa": (0.40, 0.60)},
    3: {"velocita": (0.40, 0.60), "posizione": (0.40, 0.60)},
    5: {"incontro": (0.40, 0.60), "inseguimento": (0.40, 0.60)},
}

BODY = r"(Un ciclista|Un pedone|Un carrello|Un cane|Un monopattino|Un motorino|Un'auto|Un treno)"


def q(unit):
    tex = {"m": r"\\text\{m\}", "s": r"\\text\{s\}", "m/s": r"\\text\{m/s\}"}[unit]
    return r"\$(" + NUM + r")\\," + tex + r"\$"


def law(s):
    return re.fullmatch(
        BODY + r" si muove di moto rettilineo uniforme con velocità \$v = (" + NUM + r")\\,\\text\{m/s\}\$; all'istante \$t = 0\$ si trova in \$s_0 = (" + NUM + r")\\,\\text\{m\}\$\. (.*)",
        s,
    )


def speed_ok(errs, v):
    a = abs(v)
    if not ((a * 2).q == 1 and (a.q == 2 and Rational(3, 2) <= a <= Rational(19, 2) or a.q == 1 and 11 <= a <= 25)):
        errs.append(f"speed {v} outside the rules")


def level1(sample, errs):
    s, other = read(sample["problem"])
    m = law(s)
    if not m or other:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    v, s0 = dec(m.group(2)), dec(m.group(3))
    mm = re.fullmatch(r"Dove si trova all'istante \$t = (" + NUM + r")\\,\\text\{s\}\$\?", m.group(4))
    if not mm:
        errs.append("level 1 question")
        return None
    t = dec(mm.group(1))
    speed_ok(errs, v)
    plausible(errs, m.group(1), v)
    if s0 == 0 or s0 % 5:
        errs.append("s0 zero or not a multiple of 5")
    answer(sample, errs, s0 + v * t, "m")
    return "negativa" if v < 0 else "positiva"


def level2(sample, errs):
    s, other = read(sample["problem"])
    m = law(s)
    if not m or other:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    v, s0 = dec(m.group(2)), dec(m.group(3))
    mm = re.fullmatch(r"In quale istante passa per la posizione \$s = (" + NUM + r")\\,\\text\{m\}\$\?", m.group(4))
    if not mm:
        errs.append("level 2 question")
        return None
    x = dec(mm.group(1))
    speed_ok(errs, v)
    plausible(errs, m.group(1), v)
    t = (x - s0) / v
    if t.q != 1 or not 3 <= t <= 60:
        errs.append(f"time {t} not a whole number of seconds in 3-60")
    answer(sample, errs, t, "s")
    return "negativa" if v < 0 else "positiva"


def graph(sample):
    sc = sample.get("scene") or {}
    if sc.get("type") != "grafico-dati":
        raise ValueError("no graph scene")
    return sc["data"]


def num(x):
    return Rational(str(x))


def level3(sample, errs):
    s, other = read(sample["problem"])
    m = re.fullmatch(r"Il grafico spazio-tempo di (un ciclista|un pedone|un carrello|un cane|un monopattino|un motorino|un'auto|un treno) in moto rettilineo uniforme è la retta della figura\. (.*)", s)
    if not m or other:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    d = graph(sample)
    x, y = d["x"], d["y"]
    if (x["nome"], x["unita"], y["nome"], y["unita"]) != ("t", "s", "s", "m"):
        errs.append("graph axes")
    pts = [(num(a), num(b)) for a, b in d["punti"]]
    line = d["linea"]
    if len(pts) != 2 or pts[0][0] != 0:
        errs.append("the graph needs the point at t = 0 and one more")
        return None
    (t0, s0), (t1, s1) = pts
    v = (s1 - s0) / t1
    if num(line["m"]) != v or num(line["q"]) != s0 or line["tipo"] != "retta":
        errs.append("the line does not pass through the points")
    for (a, b) in pts:
        if a % num(x["passo"]) or b % num(y["passo"]) or not 0 <= b <= num(y["passo"]) * y["celle"] or not 0 <= a <= num(x["passo"]) * x["celle"]:
            errs.append("a point off the grid nodes or off the sheet")
    if v == 0 or not 1 <= abs(v) <= 25:
        errs.append("velocity outside 1-25")
    plausible(errs, m.group(1), v)
    if m.group(2) == "Quanto vale la sua velocità?":
        answer(sample, errs, v, "m/s")
        return "velocita"
    mm = re.fullmatch(r"Se il moto continua allo stesso modo, dove si trova all'istante \$t = (" + NUM + r")\\,\\text\{s\}\$\?", m.group(2))
    if not mm:
        errs.append("level 3 question")
        return None
    tq = dec(mm.group(1))
    if tq <= num(x["passo"]) * x["celle"]:
        errs.append("the asked instant is inside the graph")
    answer(sample, errs, s0 + v * tq, "m")
    return "posizione"


def level4(sample, errs):
    s, other = read(sample["problem"])
    m = re.fullmatch(
        r"Il grafico velocità-tempo di (un ciclista|un pedone|un carrello|un cane|un monopattino|un motorino|un'auto|un treno) in moto rettilineo uniforme è quello della figura\. Di quanto si sposta tra \$t = (" + NUM + r")\\,\\text\{s\}\$ e \$t = (" + NUM + r")\\,\\text\{s\}\$\?",
        s,
    )
    if not m or other:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    t1, t2 = dec(m.group(2)), dec(m.group(3))
    d = graph(sample)
    if (d["x"]["nome"], d["y"]["nome"], d["y"]["unita"]) != ("t", "v", "m/s"):
        errs.append("graph axes")
    line = d["linea"]
    v = num(line["q"])
    if num(line["m"]) != 0 or v <= 0 or v % num(d["y"]["passo"]):
        errs.append("the velocity line is not horizontal on a grid line")
    if not 0 <= t1 < t2 <= num(d["x"]["passo"]) * d["x"]["celle"]:
        errs.append("interval outside the graph")
    plausible(errs, m.group(1), v)
    if "punti" in d:
        errs.append("points on the velocity graph")
    answer(sample, errs, v * (t2 - t1), "m")
    return "area"


def level5(sample, errs):
    s, other = read(sample["problem"])
    if m := re.fullmatch(
        r"Due ciclisti partono nello stesso istante dalle due estremità di una strada dritta lunga " + q("m") + r" e si vengono incontro: \$A\$ va a " + q("m/s") + r", \$B\$ a " + q("m/s") + r"\. (Dopo quanto tempo si incontrano\?|A che distanza dal punto di partenza di \$A\$ si incontrano\?)",
        s,
    ):
        D, vA, vB = dec(m.group(1)), dec(m.group(2)), dec(m.group(3))
        t = D / (vA + vB)
        kind, askT = "incontro", m.group(4).startswith("Dopo")
        for v in (vA, vB):
            plausible(errs, "Un ciclista", v)
    elif m := re.fullmatch(
        r"Un'auto che va a " + q("m/s") + r" insegue su una strada dritta un camion che va nello stesso verso a " + q("m/s") + r"; all'istante zero il camion è " + q("m") + r" più avanti\. (Dopo quanto tempo l'auto raggiunge il camion\?|Quanta strada percorre l'auto prima di raggiungere il camion\?)",
        s,
    ):
        vA, vB, D = dec(m.group(1)), dec(m.group(2)), dec(m.group(3))
        if vA <= vB:
            errs.append("the car is not faster")
            return None
        t = D / (vA - vB)
        kind, askT = "inseguimento", m.group(4).startswith("Dopo")
    else:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    if t.q != 1 or not 5 <= t <= 60:
        errs.append(f"meeting time {t} not whole in 5-60")
    answer(sample, errs, t if askT else vA * t, "s" if askT else "m")
    d = scene_road(sample)
    if d is None or sorted(num(p["s"]) for p in d.get("punti", [])) != [0, D] or len(d.get("velocita", [])) != 2:
        errs.append("scene does not match the data")
    elif sorted(w["verso"] for w in d["velocita"]) != ([-1, 1] if kind == "incontro" else [1, 1]):
        errs.append("scene velocities point the wrong way")
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
