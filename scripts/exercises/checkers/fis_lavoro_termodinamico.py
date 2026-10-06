"""Checker for fis-lavoro-termodinamico (specs/exercises/fis-lavoro-termodinamico.md), written from the spec and the
lesson 109-fis-lavoro-termodinamico.md, not from the generator.

The work of a gas at constant pressure is W = p (V_f - V_i), in joule with pascal and cubic metres: 1 L = 1e-3 m^3,
1 kPa = 1e3 Pa, 1 atm = 1,01e5 Pa. It is negative in a compression, and the work of the environment on the gas is
its opposite. On the pressure-volume plane (litres and kilopascal, whose product is the joule) the work is the area
under the line, positive to the right: the trapezium under a segment, nothing under a vertical leg, and for a cycle
the enclosed area, positive when the cycle runs clockwise.
"""
import re

from sympy import Rational

from checkers._fis_termo_pv import ATM, SIG2, common, d, expect, on_grid, parse, prose, scene_states, two_sig

CASE_RANGES = {
    2: {"atm": (0.40, 0.60), "kPa": (0.40, 0.60)},
    3: {"gas": (0.40, 0.60), "ambiente": (0.40, 0.60)},
    5: {"isobara-prima": (0.40, 0.60), "isocora-prima": (0.40, 0.60)},
    6: {"rettangolo-orario": (0.17, 0.33), "rettangolo-antiorario": (0.17, 0.33), "triangolo-orario": (0.17, 0.33), "triangolo-antiorario": (0.17, 0.33)},
}

AX_V = {"unita": "L", "passo": 1, "celle": 8, "etichette": 1}
AX_P = {"unita": "kPa", "passo": 50, "celle": 8, "etichette": 2}
SCI = r"\d\{,\}\d \\cdot 10\^\{-?\d+\}"
ONE = r"\d\{,\}\d"


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas si espande alla pressione costante di " + d("Pa") + r": il suo volume passa da " + d("m3") + " a " + d("m3") + r"\. Quanto lavoro compie\?", s)
    if not m or not all(re.fullmatch(SCI, g) for g in m.groups()):
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    p, vi, vf = (parse(g) for g in m.groups())
    if not (110000 <= p <= 590000 and Rational(1, 1000) <= vi <= Rational(6, 1000) and Rational(1, 1000) <= vf - vi <= Rational(5, 1000) and vf < Rational(10, 1000)):
        errs.append("data out of range")
    expect(sample, errs, p * (vf - vi), "J", SIG2)
    return "espansione"


def level2(sample, errs):
    s = prose(sample["problem"])
    tail = r": il suo volume passa da " + d("L") + " a " + d("L") + r"\. Quanto lavoro compie\?"
    if m := re.fullmatch(r"Un gas si espande alla pressione costante di " + d("atm") + tail + r" Usa \$1\\,\\text\{atm\} = 1\{,\}01 \\cdot 10\^\{5\}\\,\\text\{Pa\}\$\.", s):
        kind = "atm"
        if not re.fullmatch(ONE, m.group(1)):
            errs.append("pressure not with one decimal")
        pa = parse(m.group(1))
        if not Rational(11, 10) <= pa <= Rational(49, 10):
            errs.append("pressure out of range")
        p = pa * ATM
    elif m := re.fullmatch(r"Un gas si espande alla pressione costante di " + d("kPa") + tail, s):
        kind = "kPa"
        pk = parse(m.group(1))
        if not re.fullmatch(r"\d{3}", m.group(1)) or pk % 5 != 0 or pk % 10 == 0 or not 105 <= pk <= 495:
            errs.append("pressure in kilopascal not as the spec")
        p = pk * 1000
    else:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    if not (re.fullmatch(ONE, m.group(2)) and re.fullmatch(r"\d{1,2}\{,\}\d", m.group(3))):
        errs.append("volumes not with one decimal")
    vi, vf = parse(m.group(2)), parse(m.group(3))
    if not (Rational(12, 10) <= vi <= 6 and 1 <= vf - vi <= 5):
        errs.append("volumes out of range")
    expect(sample, errs, p * (vf - vi) / 1000, "J", SIG2)
    return kind


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas viene compresso alla pressione costante di " + d("Pa") + r": il suo volume passa da " + d("L") + " a " + d("L") + r"\. Quanto lavoro compie (il gas|l'ambiente sul gas)\?", s)
    if not m or not re.fullmatch(SCI, m.group(1)):
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    p, vi, vf = parse(m.group(1)), parse(m.group(2)), parse(m.group(3))
    two_sig(errs, m.group(1).split(" ")[0], "pressure")
    if not (110000 <= p <= 590000 and 1 <= vf <= 5 and 1 <= vi - vf <= 5):
        errs.append("data out of range")
    w = p * (vf - vi) / 1000
    if w >= 0:
        errs.append("not a compression")
    on_gas = m.group(4) != "il gas"
    want_prompt = "Trova il lavoro compiuto dall'ambiente sul gas." if on_gas else "Trova il lavoro compiuto dal gas."
    if sample["prompt"] != want_prompt:
        errs.append("prompt does not match the question")
    expect(sample, errs, -w if on_gas else w, "J", SIG2)
    return "ambiente" if on_gas else "gas"


def level4(sample, errs):
    s = prose(sample["problem"])
    if s != "Un gas passa dallo stato $A$ allo stato $B$ lungo il segmento del grafico. Quanto lavoro compie?":
        errs.append(f"level 4 text not recognised: {s!r}")
    states, legs = scene_states(sample, errs, AX_V, AX_P, "sotto")
    on_grid(errs, states, 1, 50)
    if [x["nome"] for x in states] != ["A", "B"] or legs != [{"da": "A", "a": "B", "tipo": "retta"}]:
        errs.append("scene is not one segment from A to B")
        return None
    a, b = states
    if not (b["V"] - a["V"] >= 2 and a["p"] != b["p"]):
        errs.append("B is not to the right of A at another pressure")
    expect(sample, errs, Rational(a["p"] + b["p"], 2) * (b["V"] - a["V"]), "J", SIG2)
    return "scende" if a["p"] > b["p"] else "sale"


def level5(sample, errs):
    s = prose(sample["problem"])
    if s != "Un gas passa dallo stato $A$ allo stato $B$ lungo i due tratti del grafico, passando per $C$. Quanto lavoro compie in tutto?":
        errs.append(f"level 5 text not recognised: {s!r}")
    states, legs = scene_states(sample, errs, AX_V, AX_P, "sotto")
    on_grid(errs, states, 1, 50)
    if [x["nome"] for x in states] != ["A", "C", "B"] or legs != [{"da": "A", "a": "C", "tipo": "retta"}, {"da": "C", "a": "B", "tipo": "retta"}]:
        errs.append("scene is not A, C, B with two straight legs")
        return None
    a, c, b = states
    if not (b["V"] - a["V"] >= 2 and a["p"] != b["p"]):
        errs.append("B is not to the right of A at another pressure")
    if (c["V"], c["p"]) == (b["V"], a["p"]):
        kind, p = "isobara-prima", a["p"]
    elif (c["V"], c["p"]) == (a["V"], b["p"]):
        kind, p = "isocora-prima", b["p"]
    else:
        errs.append("C is not a corner between A and B")
        return None
    expect(sample, errs, Rational(p) * (b["V"] - a["V"]), "J", SIG2)
    return kind


def level6(sample, errs):
    s = prose(sample["problem"])
    if s != "Un gas percorre il ciclo del grafico nel verso delle frecce, partendo da $A$. Quanto lavoro compie in un ciclo?":
        errs.append(f"level 6 text not recognised: {s!r}")
    states, legs = scene_states(sample, errs, AX_V, AX_P, "ciclo")
    on_grid(errs, states, 1, 50)
    n = len(states)
    names = [x["nome"] for x in states]
    if n not in (3, 4) or names != list("ABCD"[:n]):
        errs.append("a cycle needs the states A, B, C (and D)")
        return None
    if legs != [{"da": names[i], "a": names[(i + 1) % n], "tipo": "retta"} for i in range(n)]:
        errs.append("the legs do not close the cycle in order")
    vs, ps = sorted({x["V"] for x in states}), sorted({x["p"] for x in states})
    if len(vs) != 2 or len(ps) != 2 or vs[1] - vs[0] < 2 or ps[1] - ps[0] < 100:
        errs.append("the cycle is not a rectangle or a right triangle with sides along the axes")
        return None
    if n == 3 and {(x["V"], x["p"]) for x in states} != {(vs[0], ps[1]), (vs[1], ps[1]), (vs[1], ps[0])}:
        errs.append("the triangle has not its right angle at the top right")
    if (states[0]["V"], states[0]["p"]) != (vs[0], ps[1]):
        errs.append("A is not the top left state")
    # the work is the area enclosed, positive clockwise: minus the shoelace sum with V across and p up
    twice = sum(states[i]["V"] * states[(i + 1) % n]["p"] - states[(i + 1) % n]["V"] * states[i]["p"] for i in range(n))
    w = -Rational(twice, 2)
    expect(sample, errs, w, "J", SIG2)
    return f"{'triangolo' if n == 3 else 'rettangolo'}-{'orario' if w > 0 else 'antiorario'}"


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
