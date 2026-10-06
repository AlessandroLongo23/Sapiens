"""Checker for fis-enunciati-kelvin-clausius (specs/exercises/fis-enunciati-kelvin-clausius.md), written from the spec
and the lesson 115-fis-enunciati-kelvin-clausius.md, not from the generator.

The lesson's two checks, in order. First the balance of energy: heat given equals heat taken, W = Q_c - Q_f for an
engine, Q_c = Q_f + W for a refrigerator; if it fails, the first law is broken. Then the second law: heat from a
colder body to a hotter one with nothing else is forbidden by Clausius; heat of a single reservoir all turned into
work by a machine that works in cycles is forbidden by Kelvin. An isothermal expansion done once and friction are
allowed. Levels 4 and 5 are the two halves of the proof of equivalence: the hot reservoir gives Q_c - Q_f in all, or
receives Q_f in all.
"""
import re

from sympy import Rational

from checkers._fis_macchine import INT, common, engine_scene, expect, expect_words, flow, label, no_scene, parse, prose, q

CASE_RANGES = {
    1: {"spontaneo": (0.25, 0.42), "inverso": (0.25, 0.42), "bilancio": (0.25, 0.42)},
    2: {"una-sorgente": (0.22, 0.38), "due-sorgenti": (0.13, 0.27), "isoterma": (0.13, 0.27), "attrito": (0.05, 0.15), "bilancio": (0.13, 0.27)},
    3: {k: (0.11, 0.23) for k in ("frigo", "frigo-senza-lavoro", "frigo-bilancio", "macchina", "macchina-una-sorgente", "macchina-bilancio")},
}

ANSWERS = {
    "possibile": "Sì, è possibile",
    "primo": "No: viola il primo principio",
    "clausius": "No: lo vieta Clausius",
    "kelvin": "No: lo vieta Kelvin",
}
SINGLE = r"(dall'acqua di un lago|dall'aria dell'ambiente|da una caldaia|dall'acqua del mare)"
J = q("J")
C = q("C")


def whole(errs, s, lo, hi, what):
    v = parse(s)
    if v.q != 1 or not lo <= v <= hi:
        errs.append(f"{what} {s} out of range")
    return v


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un corpo \$A\$ a " + C + r" è messo a contatto con un corpo \$B\$ a " + C + r", e i due sono isolati dal resto\. Il corpo \$([AB])\$ cede " + J + r" di calore e il corpo \$([AB])\$ ne assorbe " + J + r", senza che nessuno compia lavoro\. È possibile\?",
        s,
    )
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    t = {"A": parse(m.group(1)), "B": parse(m.group(2))}
    giver, taker = m.group(3), m.group(5)
    given, taken = whole(errs, m.group(4), 100, 900, "heat"), parse(m.group(6))
    if giver == taker:
        errs.append("the same body gives and takes")
    if not all(5 <= x <= 95 for x in t.values()) or abs(t["A"] - t["B"]) < 10:
        errs.append("temperatures out of range")
    no_scene(sample, errs)
    if given != taken:
        if t[giver] < t[taker]:
            errs.append("an unbalanced case that also goes from cold to hot")
        expect_words(sample, errs, ANSWERS, "primo")
        return "bilancio"
    if t[giver] > t[taker]:
        expect_words(sample, errs, ANSWERS, "possibile")
        return "spontaneo"
    expect_words(sample, errs, ANSWERS, "clausius")
    return "inverso"


def level2(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    if m := re.fullmatch(r"Una macchina che lavora per cicli assorbe in ogni ciclo " + J + " di calore " + SINGLE + ", compie " + J + r" di lavoro e non cede calore a nessun altro corpo\. È possibile\?", s):
        Q, W = whole(errs, m.group(1), 200, 1000, "heat"), parse(m.group(3))
        if Q != W:
            errs.append("heat and work differ in the single-reservoir case")
        expect_words(sample, errs, ANSWERS, "kelvin")
        return "una-sorgente"
    if m := re.fullmatch(r"Una macchina che lavora per cicli assorbe in ogni ciclo " + J + " di calore da una caldaia, cede " + J + r" all'aria dell'ambiente, più fredda, e compie " + J + r" di lavoro\. È possibile\?", s):
        Qc, Qf, W = whole(errs, m.group(1), 200, 1000, "heat"), parse(m.group(2)), parse(m.group(3))
        if not (0 < Qf < Qc) or W != Qc - Qf:
            errs.append("the two-reservoir engine is not balanced")
        expect_words(sample, errs, ANSWERS, "possibile")
        return "due-sorgenti"
    if m := re.fullmatch(r"Un gas perfetto chiuso in un cilindro si espande una volta sola a temperatura costante: assorbe " + J + " di calore da una sorgente e compie " + J + r" di lavoro\. Alla fine occupa un volume più grande di quello iniziale\. È possibile\?", s):
        if parse(m.group(1)) != parse(m.group(2)):
            errs.append("heat and work differ in the isothermal expansion")
        expect_words(sample, errs, ANSWERS, "possibile")
        return "isoterma"
    if m := re.fullmatch(r"In una frenata l'attrito dei freni di una bicicletta trasforma " + J + r" di lavoro interamente in calore, che scalda i freni e l'aria\. È possibile\?", s):
        expect_words(sample, errs, ANSWERS, "possibile")
        return "attrito"
    if m := re.fullmatch(r"Una macchina che lavora per cicli assorbe in ogni ciclo " + J + " di calore da una caldaia e compie " + J + r" di lavoro, senza ricevere altra energia\. È possibile\?", s):
        Q, W = whole(errs, m.group(1), 200, 1000, "heat"), parse(m.group(2))
        if W <= Q:
            errs.append("the work does not exceed the heat")
        expect_words(sample, errs, ANSWERS, "primo")
        return "bilancio"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    if m := re.fullmatch(r"Un frigorifero assorbe in ogni ciclo " + J + " di calore dal suo interno, riceve " + J + " di lavoro dal motore e cede " + J + r" di calore alla cucina\. Può esistere\?", s):
        Qf, W, Qc = whole(errs, m.group(1), 200, 900, "heat"), whole(errs, m.group(2), 40, 300, "work"), parse(m.group(3))
        if Qc == Qf + W:
            expect_words(sample, errs, ANSWERS, "possibile")
            return "frigo"
        if abs(Qc - Qf - W) < 15:
            errs.append("the imbalance is too small to see")
        expect_words(sample, errs, ANSWERS, "primo")
        return "frigo-bilancio"
    if m := re.fullmatch(r"Un dispositivo che lavora per cicli assorbe in ogni ciclo " + J + " di calore da una cella a " + C + " e cede " + J + " alla stanza, a " + C + r", senza ricevere lavoro\. Può esistere\?", s):
        Q, tc, Q2, th = parse(m.group(1)), parse(m.group(2)), parse(m.group(3)), parse(m.group(4))
        if Q != Q2 or tc >= th:
            errs.append("the device without work is not the forbidden one")
        expect_words(sample, errs, ANSWERS, "clausius")
        return "frigo-senza-lavoro"
    if m := re.fullmatch(r"Un motore che lavora per cicli assorbe in ogni ciclo " + J + " di calore " + SINGLE + " e compie " + J + r" di lavoro\. Non scambia calore con nessun altro corpo\. Può esistere\?", s):
        if parse(m.group(1)) != parse(m.group(3)):
            errs.append("heat and work differ in the single-reservoir case")
        expect_words(sample, errs, ANSWERS, "kelvin")
        return "macchina-una-sorgente"
    if m := re.fullmatch(r"Un motore che lavora per cicli assorbe in ogni ciclo " + J + " di calore da una caldaia, cede " + J + r" all'aria dell'ambiente, più fredda, e compie " + J + r" di lavoro\. Può esistere\?", s):
        Qc, Qf, W = whole(errs, m.group(1), 400, 1500, "heat"), parse(m.group(2)), parse(m.group(3))
        if not 0 < Qf < Qc or not 0 < W < Qc:
            errs.append("heats out of range")
        if W == Qc - Qf:
            expect_words(sample, errs, ANSWERS, "possibile")
            return "macchina"
        if abs(W - (Qc - Qf)) < 15:
            errs.append("the imbalance is too small to see")
        expect_words(sample, errs, ANSWERS, "primo")
        return "macchina-bilancio"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"In ogni ciclo una macchina termica assorbe " + J + " dalla sorgente calda e cede " + J + r" alla sorgente fredda\. Un dispositivo che viola l'enunciato di Clausius riporta i " + J + r" dalla sorgente fredda a quella calda, senza lavoro\. Quanto calore cede in tutto la sorgente calda in un ciclo\?",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    Qc, Qf, back = whole(errs, m.group(1), 400, 1500, "heat"), whole(errs, m.group(2), 200, 1400, "heat"), parse(m.group(3))
    if back != Qf or Qf >= Qc:
        errs.append("the device does not take back the heat given off")
    left, right = engine_scene(sample, errs, 2)
    if left.get("vietato") is not True or right.get("vietato"):
        errs.append("scene: the forbidden device is the left one only")
    flow(errs, left, "freddo", "entra", label(Qf, "J"))
    flow(errs, left, "caldo", "esce", label(Qf, "J"))
    flow(errs, left, "lavoro", None, None)
    flow(errs, right, "caldo", "entra", "Qc = " + label(Qc, "J"))
    flow(errs, right, "freddo", "esce", "Qf = " + label(Qf, "J"))
    flow(errs, right, "lavoro", "esce", "")
    expect(sample, errs, Qc - Qf, "J", INT)
    return "clausius-falso"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Una macchina che viola l'enunciato di Kelvin assorbe in ogni ciclo " + J + r" dalla sorgente calda e li trasforma tutti in lavoro\. Con quel lavoro aziona un frigorifero, che assorbe " + J + r" dalla sorgente fredda\. Quanto calore riceve in tutto la sorgente calda in un ciclo\?",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    W, Qf = whole(errs, m.group(1), 100, 500, "work"), whole(errs, m.group(2), 200, 1000, "heat")
    left, right = engine_scene(sample, errs, 2)
    if left.get("vietato") is not True or right.get("vietato"):
        errs.append("scene: the forbidden engine is the left one only")
    flow(errs, left, "caldo", "entra", "Q = " + label(W, "J"))
    flow(errs, left, "lavoro", "passa", "W = " + label(W, "J"))
    flow(errs, left, "freddo", None, None)
    flow(errs, right, "freddo", "entra", "Qf = " + label(Qf, "J"))
    # the refrigerator's heat to the hot reservoir is one step from the answer: the scene does not give its value
    flow(errs, right, "caldo", "esce", "Qc")
    # hot reservoir: -W to the engine, +(Qf + W) from the refrigerator
    vals = expect(sample, errs, -W + (Qf + W), "J", INT)
    if vals and Rational(Qf + W) not in vals:
        errs.append("the refrigerator's heat is not among the options")
    return "kelvin-falso"


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
