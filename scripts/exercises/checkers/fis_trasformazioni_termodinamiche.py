"""Checker for fis-trasformazioni-termodinamiche (specs/exercises/fis-trasformazioni-termodinamiche.md), written from
the spec and the lesson 111-fis-trasformazioni-termodinamiche.md, not from the generator.

Perfect gas, R = 8,31 J/(mol K), temperatures in kelvin. At constant volume W = 0 and Q = ΔU = 3/2 n R ΔT for a
monatomic gas. At constant pressure W = n R ΔT, ΔU = 3/2 n R ΔT, Q = 5/2 n R ΔT. At constant temperature ΔU = 0 and
Q = W = n R T ln(V_B / V_A) = n R T ln(p_A / p_B) = p_A V_A ln(V_B / V_A), negative in a compression. In a cycle the
work is the sum of the works of its legs. Logarithms are natural, computed with sympy.
"""
import re

from sympy import Rational, log

from checkers._fis_termo_pv import R_GAS, SIG2, USE_R, common, d, expect, moles, on_grid, parse, prose, scene_states

CASE_RANGES = {
    3: {"calore": (0.40, 0.60), "energia": (0.40, 0.60)},
    5: {"volumi": (0.40, 0.60), "pressioni": (0.40, 0.60)},
    6: {"isobara-alta": (0.40, 0.60), "isobara-bassa": (0.40, 0.60)},
}

AX_V = {"unita": "L", "passo": 0.5, "celle": 16, "etichette": 2}
AX_P = {"unita": "kPa", "passo": 50, "celle": 8, "etichette": 2}
SCI = r"\d\{,\}\d \\cdot 10\^\{5\}"
ONE = r"\d\{1,2\}\{,\}\d".replace(r"\{1,2\}", "{1,2}")


def temps(errs, a, b):
    ta, tb = parse(a), parse(b)
    if not (re.fullmatch(r"\d{3}", a) and re.fullmatch(r"\d{3}", b) and 250 <= ta <= 350 and 20 <= tb - ta <= 200):
        errs.append("temperatures out of range")
    return ta, tb


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una bombola rigida contiene " + d("mol") + " di gas perfetto monoatomico a " + d("K") + r"\. Quanto calore serve per portare il gas a " + d("K") + r"\?" + USE_R, s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    n = moles(errs, m.group(1))
    ta, tb = temps(errs, m.group(2), m.group(3))
    expect(sample, errs, Rational(3, 2) * n * R_GAS * (tb - ta), "J", SIG2)
    return "isocora"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un cilindro con il pistone libero ci sono " + d("mol") + " di gas perfetto, che viene scaldato a pressione costante da " + d("K") + " a " + d("K") + r"\. Quanto lavoro compie il gas\?" + USE_R, s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    n = moles(errs, m.group(1))
    ta, tb = temps(errs, m.group(2), m.group(3))
    expect(sample, errs, n * R_GAS * (tb - ta), "J", SIG2)
    return "isobara"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un cilindro con il pistone libero ci sono " + d("mol") + " di gas perfetto monoatomico, che viene scaldato a pressione costante da " + d("K") + " a " + d("K") + r"\. (Quanto calore assorbe il gas|Di quanto varia la sua energia interna)\?" + USE_R, s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    n = moles(errs, m.group(1))
    ta, tb = temps(errs, m.group(2), m.group(3))
    heat = m.group(4).startswith("Quanto calore")
    expect(sample, errs, Rational(5 if heat else 3, 2) * n * R_GAS * (tb - ta), "J", SIG2)
    return "calore" if heat else "energia"


def isotherm_head(errs, n, t):
    nn = moles(errs, n)
    tt = parse(t)
    if not (re.fullmatch(r"\d{3}", t) and 250 <= tt <= 400):
        errs.append("temperature out of range")
    return nn * R_GAS * tt


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un campione di " + d("mol") + " di gas perfetto si espande alla temperatura costante di " + d("K") + r": il suo volume passa da " + d("L") + " a " + d("L") + r"\. Quanto lavoro compie il gas\?" + USE_R, s)
    if not m or not re.fullmatch(ONE, m.group(3)) or not re.fullmatch(ONE, m.group(4)):
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    nrt = isotherm_head(errs, m.group(1), m.group(2))
    va, vb = parse(m.group(3)), parse(m.group(4))
    if not (1 <= va <= 4 and 1 <= vb - va <= 6):
        errs.append("volumes out of range")
    expect(sample, errs, nrt * log(vb / va), "J", SIG2)
    return "espansione"


def level5(sample, errs):
    s = prose(sample["problem"])
    head = r"Un campione di " + d("mol") + " di gas perfetto viene compresso lentamente alla temperatura costante di " + d("K") + ": "
    tail = r"\. Quanto lavoro compie il gas\?" + USE_R
    if m := re.fullmatch(head + r"il suo volume passa da " + d("L") + " a " + d("L") + tail, s):
        kind = "volumi"
        if not (re.fullmatch(ONE, m.group(3)) and re.fullmatch(ONE, m.group(4))):
            errs.append("volumes not with one decimal")
        va, vb = parse(m.group(3)), parse(m.group(4))
        if not (2 <= va <= 9 and vb >= 1 and 1 <= va - vb <= 7):
            errs.append("volumes out of range")
        ratio = vb / va
    elif m := re.fullmatch(head + r"la sua pressione passa da " + d("Pa") + " a " + d("Pa") + tail, s):
        kind = "pressioni"
        if not (re.fullmatch(SCI, m.group(3)) and re.fullmatch(SCI, m.group(4))):
            errs.append("pressures not in scientific notation")
        pa, pb = parse(m.group(3)), parse(m.group(4))
        if not (pa >= 100000 and 200000 <= pb <= 900000 and 100000 <= pb - pa <= 700000):
            errs.append("pressures out of range")
        ratio = pa / pb
    else:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    nrt = isotherm_head(errs, m.group(1), m.group(2))
    if ratio >= 1:
        errs.append("not a compression")
    expect(sample, errs, nrt * log(ratio), "J", SIG2)
    return kind


def level6(sample, errs):
    s = prose(sample["problem"])
    if s != "Un gas perfetto percorre il ciclo del grafico nel verso delle frecce: il tratto curvo è un'isoterma. Quanto lavoro compie in un ciclo?":
        errs.append(f"level 6 text not recognised: {s!r}")
    states, legs = scene_states(sample, errs, AX_V, AX_P, "ciclo")
    on_grid(errs, states, "0.5", 50)
    if [x["nome"] for x in states] != ["A", "B", "C"] or [(t["da"], t["a"]) for t in legs] != [("A", "B"), ("B", "C"), ("C", "A")]:
        errs.append("the cycle is not A, B, C and back")
        return None
    a, b, c = ({"V": Rational(str(x["V"])), "p": Rational(x["p"])} for x in states)
    kinds = [t["tipo"] for t in legs]
    if kinds == ["retta", "retta", "isoterma"]:
        # isobar A to B, isochore B to C, isotherm C back to A
        if not (a["p"] == b["p"] and b["V"] == c["V"] and b["V"] > a["V"] and c["p"] < b["p"]):
            errs.append("legs are not an isobar and an isochore")
        if a["p"] * a["V"] != c["p"] * c["V"]:
            errs.append("C and A are not on the same isotherm")
        w = a["p"] * (b["V"] - a["V"]) + a["p"] * a["V"] * log(a["V"] / c["V"])
        kind = "isobara-alta"
    elif kinds == ["isoterma", "retta", "retta"]:
        # isotherm A to B, isobar B to C, isochore C back to A
        if not (b["p"] == c["p"] and c["V"] == a["V"] and b["V"] > a["V"] and b["p"] < a["p"]):
            errs.append("legs are not an isobar and an isochore")
        if a["p"] * a["V"] != b["p"] * b["V"]:
            errs.append("A and B are not on the same isotherm")
        w = a["p"] * a["V"] * log(b["V"] / a["V"]) + b["p"] * (c["V"] - b["V"])
        kind = "isobara-bassa"
    else:
        errs.append(f"legs not as the spec: {kinds}")
        return None
    k = b["V"] / a["V"]
    if k not in (2, 3, 4):
        errs.append("the volume is not doubled, tripled or quadrupled")
    expect(sample, errs, w, "J", SIG2)
    return kind


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
