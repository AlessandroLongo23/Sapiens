"""Checker for principi-termo (specs/exercises/principi-termo.md), written from the spec and the lesson
110-principi-termo.md, not from the generator.

First law: ΔU = Q - W, with Q positive when the gas absorbs heat and negative when it gives it off, W positive when
the gas does work and negative when the environment does work on the gas. Hence Q = ΔU + W and W = Q - ΔU. At
constant pressure W = p (V_f - V_i), with litres turned into cubic metres. For a monatomic perfect gas
ΔU = 3/2 n R ΔT, so ΔT = 2 ΔU / (3 n R), R = 8,31 J/(mol K). In a cycle ΔU = 0 and W is the heat absorbed minus the
heat given off; with no heat exchanged ΔU = -W; at constant volume ΔU = Q.
"""
import re

from sympy import Rational

from checkers._fis_termo_pv import INT, R_GAS, SIG2, USE_R, common, d, expect, moles, parse, prose, scene_states, three_whole

CASE_RANGES = {
    2: {"cede-compie": (0.23, 0.44), "assorbe-subisce": (0.23, 0.44), "cede-subisce": (0.23, 0.44)},
    3: {"calore": (0.40, 0.60), "lavoro": (0.40, 0.60)},
    5: {"assorbe-compie": (0.17, 0.33), "assorbe-subisce": (0.17, 0.33), "cede-compie": (0.17, 0.33), "cede-subisce": (0.17, 0.33)},
    6: {"ciclo": (0.23, 0.44), "adiabatica": (0.23, 0.44), "isocora": (0.23, 0.44)},
}

HEAT = r"(assorbe|cede) " + d("J") + r" di calore"
WORK = r"(?:compie " + d("J") + r" di lavoro|l'ambiente compie su di esso un lavoro di " + d("J") + r")"
SCI = r"\d\{,\}\d \\cdot 10\^\{-?\d+\}"
ONE = r"\d\{,\}\d"
AX_V = {"unita": "L", "passo": 1, "celle": 10, "etichette": 1}
AX_P = {"unita": "10⁵ Pa", "passo": 1, "celle": 6, "etichette": 1}


def heat_work(errs, verb, q, w_done, w_on):
    """The signed heat and work from the matched words."""
    Q = three_whole(errs, q, "heat")
    Q = Q if verb == "assorbe" else -Q
    W = three_whole(errs, w_done, "work") if w_done is not None else -three_whole(errs, w_on, "work")
    return Q, W, f"{verb}-{'compie' if w_done is not None else 'subisce'}"


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas assorbe " + d("J") + r" di calore e, espandendosi, compie " + d("J") + r" di lavoro\. Di quanto varia la sua energia interna\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    Q, W = three_whole(errs, m.group(1), "heat"), three_whole(errs, m.group(2), "work")
    expect(sample, errs, Q - W, "J", INT)
    return "aumenta" if Q > W else "diminuisce"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas " + HEAT + ", mentre " + WORK + r"\. Di quanto varia la sua energia interna\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    Q, W, kind = heat_work(errs, *m.groups())
    if kind == "assorbe-compie":
        errs.append("level 2 needs at least one negative sign")
    if abs(Q) == abs(W):
        errs.append("heat and work with the same value")
    expect(sample, errs, Q - W, "J", INT)
    return kind


def level3(sample, errs):
    s = prose(sample["problem"])
    head = r"L'energia interna di un gas (aumenta|diminuisce) di " + d("J") + ", mentre "
    if m := re.fullmatch(head + r"(?:il gas compie " + d("J") + r" di lavoro|l'ambiente compie sul gas un lavoro di " + d("J") + r")\. Quanto calore scambia il gas\?", s):
        dU = three_whole(errs, m.group(2), "ΔU") * (1 if m.group(1) == "aumenta" else -1)
        W = three_whole(errs, m.group(3), "work") if m.group(3) is not None else -three_whole(errs, m.group(4), "work")
        if sample["prompt"] != "Trova il calore scambiato, positivo se assorbito.":
            errs.append("prompt does not say the sign convention of the heat")
        expect(sample, errs, dU + W, "J", INT)
        return "calore"
    if m := re.fullmatch(head + r"il gas (assorbe|cede) " + d("J") + r" di calore\. Quanto lavoro compie il gas\?", s):
        dU = three_whole(errs, m.group(2), "ΔU") * (1 if m.group(1) == "aumenta" else -1)
        Q = three_whole(errs, m.group(4), "heat") * (1 if m.group(3) == "assorbe" else -1)
        if sample["prompt"] != "Trova il lavoro del gas, negativo se lo subisce.":
            errs.append("prompt does not say the sign convention of the work")
        expect(sample, errs, Q - dU, "J", INT)
        return "lavoro"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas in un cilindro con il pistone libero, alla pressione costante di " + d("Pa") + ", assorbe " + d("J") + r" di calore e si espande da " + d("L") + " a " + d("L") + r"\. Di quanto varia la sua energia interna\?", s)
    if not m or not re.fullmatch(SCI, m.group(1)) or not re.fullmatch(SCI, m.group(2)) or not re.fullmatch(ONE, m.group(3)) or not re.fullmatch(ONE, m.group(4)):
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    p, Q, vi, vf = (parse(g) for g in m.groups())
    if not (110000 <= p <= 550000 and 1 <= vi <= 5 and 1 <= vf - vi <= 4 and 110 <= Q <= 9900):
        errs.append("data out of range")
    W = p * (vf - vi) / 1000
    if not 2 * W <= Q <= 4 * W:
        errs.append("heat not between two and four times the work")
    states, legs = scene_states(sample, errs, AX_V, AX_P)
    want = [{"nome": "A", "V": float(vi), "p": float(p / 100000)}, {"nome": "B", "V": float(vf), "p": float(p / 100000)}]
    if [(x["nome"], float(x["V"]), float(x["p"])) for x in states] != [(x["nome"], x["V"], x["p"]) for x in want] or legs != [{"da": "A", "a": "B", "tipo": "retta"}]:
        errs.append("the scene is not the isobar of the text")
    expect(sample, errs, Q - W, "J", SIG2)
    return "isobara"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un campione di " + d("mol") + " di gas perfetto monoatomico " + HEAT + ", mentre " + WORK + r"\. Di quanto varia la sua temperatura\?" + USE_R, s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    n = moles(errs, m.group(1))
    Q, W, kind = heat_work(errs, *m.groups()[1:])
    dT = (Q - W) / (Rational(3, 2) * n * R_GAS)
    if not 5 <= abs(dT) <= 400:
        errs.append("ΔT out of range")
    expect(sample, errs, dT, "K", SIG2)
    return kind


def level6(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"In una trasformazione ciclica un gas assorbe in tutto " + d("J") + r" di calore e ne cede in tutto " + d("J") + r"\. Quanto lavoro compie in un ciclo\?", s):
        expect(sample, errs, three_whole(errs, m.group(1), "heat") - three_whole(errs, m.group(2), "heat"), "J", INT)
        return "ciclo"
    if m := re.fullmatch(r"Un gas viene compresso senza scambiare calore con l'ambiente, che compie su di esso un lavoro di " + d("J") + r"\. Di quanto varia la sua energia interna\?", s):
        expect(sample, errs, three_whole(errs, m.group(1), "work"), "J", INT)
        return "adiabatica"
    if m := re.fullmatch(r"Un gas si espande senza scambiare calore con l'ambiente e compie " + d("J") + r" di lavoro\. Di quanto varia la sua energia interna\?", s):
        expect(sample, errs, -three_whole(errs, m.group(1), "work"), "J", INT)
        return "adiabatica"
    if m := re.fullmatch(r"Un gas chiuso in un recipiente rigido (assorbe|cede) " + d("J") + r" di calore\. Di quanto varia la sua energia interna\?", s):
        x = three_whole(errs, m.group(2), "heat")
        expect(sample, errs, x if m.group(1) == "assorbe" else -x, "J", INT)
        return "isocora"
    errs.append(f"level 6 text not recognised: {s!r}")
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
