"""Checker for fis-legge-boyle (specs/exercises/fis-legge-boyle.md), written from the spec and the lesson
102-fis-legge-boyle.md, not from the generator.

The pressure under a piston that carries a body is p0 + m g / S (S given in cm²); at constant temperature
p1 V1 = p2 V2, and in a cylinder p1 h1 = p2 h2; two states are on the same isotherm when they have the same product
p V; a bubble at depth h is at p0 + d g h and in surface at p0. p0 = 1,01 · 10^5 Pa, g = 9,8 m/s², d = 1000 kg/m³.
"""
import re

from sympy import Rational

from checkers._fis_gas_leggi import G, G_TEXT, NUM, P_ATM, SIG2, SIG3, common, cylinder, expect, label_number, parse, prose, qty, sig_of

CASE_RANGES = {}

AREAS = {10, 20, 25, 40, 50}
PISTON = r"Un cilindro è chiuso da un pistone di massa trascurabile e di area " + qty("cm2")
PA = {120, 150, 180, 240, 300, 360, 450, 600}
VA = {Rational(3, 2), Rational(2), Rational(12, 5), Rational(3), Rational(4), Rational(6), Rational(8)}


def body(errs, area, mass, p0):
    """The piston's area and the body's mass as the spec wants them; returns (S in cm², m in kg, extra in Pa)."""
    S, m = parse(area), parse(mass)
    if S not in AREAS:
        errs.append(f"area {S} not one of the spec's")
    if not (1 <= m <= Rational(19, 2) and (2 * m).is_integer and re.fullmatch(r"\d\{,\}\d", mass)):
        errs.append(f"mass {mass} not a half-kilogram value with one decimal")
    if parse(p0) != P_ATM or p0 != r"1{,}01 \cdot 10^{5}":
        errs.append("atmospheric pressure is not 1,01 · 10^5 Pa")
    return S, m, m * G / (S / 10000)


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(PISTON + r", su cui è appoggiato un corpo di " + qty("kg") + r"\. Fuori c'è la pressione atmosferica, " + qty("Pa") + r"\. Quanto vale la pressione del gas\? Usa " + G_TEXT + r"\.", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    S, mass, extra = body(errs, m.group(1), m.group(2), m.group(3))
    expect(sample, errs, P_ATM + extra, "Pa", SIG3)
    data = cylinder(errs, sample.get("scene"), "level 1")
    labels = data.get("etichette", {})
    if not data.get("corpo") or label_number(labels.get("corpo", "")) != mass or label_number(labels.get("S", "")) != S:
        errs.append("the scene does not show the body and the area of the text")
    if "h" in labels:
        errs.append("the scene gives a height the text does not")
    return "pistone"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas occupa " + qty("L") + r" alla pressione di " + qty("kPa") + r"\. A temperatura costante viene (compresso|lasciato espandere) lentamente fino al volume di " + qty("L") + r"\. Quanto vale la pressione finale\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    V1, p1, V2 = parse(m.group(1)), parse(m.group(2)), parse(m.group(4))
    if sig_of(m.group(1)) != 2 or sig_of(m.group(4)) != 2 or not (Rational(11, 10) <= V1 <= Rational(99, 10) and Rational(11, 10) <= V2 <= Rational(99, 10)):
        errs.append("volumes not between 1,1 and 9,9 L with two figures")
    if not (p1.is_integer and 101 <= p1 <= 299 and p1 % 10 != 0):
        errs.append(f"pressure {p1} out of range or ending in zero")
    r = V1 / V2
    if not (Rational(1, 4) <= r <= 4) or Rational(9, 10) < r < Rational(10, 9):
        errs.append(f"ratio of the volumes {r} out of range")
    if (m.group(3) == "compresso") != (V2 < V1):
        errs.append("the verb does not match the volumes")
    expect(sample, errs, p1 * V1 / V2, "kPa", SIG3)
    return "compressione" if V2 < V1 else "espansione"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        PISTON + r"\. Il gas è alla pressione atmosferica, " + qty("Pa") + r", e il pistone è a " + qty("cm") + r" dal fondo\. Si appoggia sul pistone un corpo di " + qty("kg")
        + r" e si aspetta che il gas torni alla temperatura iniziale\. A che altezza dal fondo si ferma il pistone\? Usa " + G_TEXT + r"\.",
        s,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    S, mass, extra = body(errs, m.group(1), m.group(4), m.group(2))
    h1 = parse(m.group(3))
    if not (20 <= h1 <= 40 and re.fullmatch(r"\d\d\{,\}\d", m.group(3))):
        errs.append(f"height {m.group(3)} not between 20,0 and 40,0 cm with one decimal")
    h2 = h1 * P_ATM / (P_ATM + extra)
    if h1 - h2 < 1:
        errs.append("the piston goes down less than a centimetre")
    expect(sample, errs, h2, "cm", SIG3)
    before = cylinder(errs, sample.get("scene"), "level 3")
    if Rational(str(before.get("altezza", 0))) != h1 or before.get("corpo") or label_number(before.get("etichette", {}).get("h", "")) != h1:
        errs.append("the scene does not show the piston at h1 with nothing on it")
    after = cylinder(errs, sample.get("solutionScene"), "level 3 solution")
    if not after.get("corpo") or abs(Rational(str(after.get("altezza", 0))) - h2) > Rational(1, 1000) or Rational(str(after.get("prima", 0))) != h1:
        errs.append("the solution's scene does not show the piston at h2")
    return "altezza"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas è nello stato \$A\$, con pressione " + qty("kPa") + r" e volume " + qty("L") + r"\. In quale di questi stati lo stesso gas ha la temperatura che ha in \$A\$\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    pA, VA_ = parse(m.group(1)), parse(m.group(2))
    if pA not in PA or VA_ not in VA:
        errs.append("state A not one of the spec's")
    a = sample.get("answer", {})
    if a.get("kind") != "choice" or len(a.get("options", [])) != 4:
        errs.append("need a choice among four states")
        return None
    same, texts = [], set()
    for i, o in enumerate(a["options"]):
        mo = re.fullmatch(r"(" + NUM + r")\\,\\text\{kPa\};\\ (" + NUM + r")\\,\\text\{L\}", o["latex"])
        if not mo:
            errs.append(f"option {o['latex']!r} is not a state")
            continue
        p, V = parse(mo.group(1)), parse(mo.group(2))
        texts.add((p, V))
        if not (p.is_integer and 30 <= p <= 1800 and Rational(1, 2) <= V <= 30 and re.fullmatch(r"\d+\{,\}\d", mo.group(2))):
            errs.append(f"state {o['latex']!r} out of range")
        if [Rational(x) for x in o["values"]] != [p * V, p, V]:
            errs.append("option values differ from the text")
        if p * V == pA * VA_:
            same.append(i)
        if (p, V) == (pA, VA_):
            errs.append("state A among the options")
    if len(texts) != 4:
        errs.append("two options are the same state")
    if same != [a.get("correct")]:
        errs.append(f"states with the product of A: {same}, correct index {a.get('correct')}")
    return "isoterma"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Sul fondo di un lago, a " + qty("m") + r" di profondità, si stacca una bolla d'aria di " + qty("cm3")
        + r"\. Che volume ha quando arriva in superficie, se la temperatura dell'acqua è la stessa a tutte le profondità\? Usa \$d = 1000\\,\\text\{kg/m\}\^3\$, "
        + G_TEXT + r" e \$p_0 = 1\{,\}01 \\cdot 10\^\{5\}\\,\\text\{Pa\}\$\.",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    h, V1 = parse(m.group(1)), parse(m.group(2))
    if not (h.is_integer and 4 <= h <= 45 and h % 10 != 0):
        errs.append(f"depth {h} out of range or ending in zero")
    if sig_of(m.group(2)) != 2 or not Rational(11, 10) <= V1 <= Rational(99, 10):
        errs.append("volume not between 1,1 and 9,9 cm³ with two figures")
    p1 = P_ATM + 1000 * G * h
    expect(sample, errs, V1 * p1 / P_ATM, "cm3", SIG2)
    return "bolla"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
