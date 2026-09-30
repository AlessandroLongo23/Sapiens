"""Checker for fis-equilibrio-termico (specs/exercises/fis-equilibrio-termico.md), written from the spec and the lesson
68-fis-equilibrio-termico.md, not from the generator.

In an insulated calorimeter the heat given by the hot body is taken by the cold one: c1 m1 (t1 - te) = c2 m2 (te - t2),
so te = (c1 m1 t1 + c2 m2 t2) / (c1 m1 + c2 m2); for water with water the specific heat cancels. The calorimeter
itself counts as m_eq grams of water more, with the cold water. The specific heat of a sample is
c_x = c_water (m_a + m_eq) (te - ta) / (m_x (tx - te)), with the significant figures of te - ta. Exact arithmetic with
sympy; the answer is rounded as the spec says and compared with the correct option.
"""
import re

from sympy import Rational

from checkers._fis_calore import C_WATER, answer, common, quantity, sig_of, text, value

CASE_RANGES = {
    1: {"acqua": (0.40, 0.60), "metallo": (0.40, 0.60)},
    4: {"massa": (0.40, 0.60), "temperatura": (0.40, 0.60)},
    6: {"equivalente": (0.40, 0.60), "calore specifico": (0.40, 0.60)},
}

METALS = {"ferro": 449, "alluminio": 897, "rame": 385, "piombo": 129, "argento": 233}
MET = "(" + "|".join(METALS) + ")"
C = quantity("C")
KG = quantity("kg")
G = quantity("g")
CJ = quantity("cJ")
CW = r"Il calore specifico dell'acqua è \$4186\\,\\text\{J/\(kg\}\\cdot\{\}\^\\circ\\text\{C\)\}\$\."


def whole(s, lo, hi, errs, what):
    if not re.fullmatch(r"\d+", s):
        errs.append(f"{what} {s} is not a whole number")
    v = value(s)
    if not lo <= v <= hi:
        errs.append(f"{what} {s} outside {lo}-{hi}")
    return v


def mass2(s, errs, lo=Rational(11, 100)):
    v = value(s)
    if not re.fullmatch(r"0\{,\}[1-9][1-9]", s) or v < lo:
        errs.append(f"mass {s} is not 0,11-0,99 kg with two significant figures")
    return v


def one_decimal(s, errs, what):
    if not re.fullmatch(r"\d+\{,\}\d", s):
        errs.append(f"{what} {s} has not one decimal")
    return value(s)


def level1(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Un pezzo di metallo caldo viene immerso in " + KG + r" d'acqua, in un calorimetro isolato\. L'acqua si scalda da " + C + " a " + C + r"\. Quanto calore ha ceduto il metallo\? " + CW, s):
        mass = mass2(m.group(1), errs)
        ti, tf = whole(m.group(2), 10, 25, errs, "ti"), whole(m.group(3), 13, 55, errs, "tf")
        if not 3 <= tf - ti <= 30:
            errs.append("temperature rise outside 3-30")
        Q = C_WATER * mass * (tf - ti) / 1000
        kind = "acqua"
    elif m := re.fullmatch(r"Un pezzo di " + MET + " di " + KG + ", a " + C + r", viene immerso nell'acqua di un calorimetro isolato e si raffredda fino a " + C + r"\. Quanto calore assorbe l'acqua\? Il calore specifico del " + MET + " è " + CJ + r"\.", s):
        if m.group(1) != m.group(5) or value(m.group(6)) != METALS[m.group(1)]:
            errs.append("metal or specific heat")
        mass = mass2(m.group(2), errs)
        th, te = whole(m.group(3), 60, 200, errs, "th"), whole(m.group(4), 15, 40, errs, "te")
        Q = METALS[m.group(1)] * mass * (th - te) / 1000
        kind = "metallo"
    else:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    if not 1 <= Q < 100:
        errs.append("Q outside 1-100 kJ")
    answer(sample, errs, Q, 2, "kJ")
    return kind


def level2(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"In una bacinella si versano " + KG + " d'acqua a " + C + " e " + KG + " d'acqua a " + C + r"\. Trascurando la bacinella e l'aria, a quale temperatura arriva l'acqua\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    m1, m2 = value(m.group(1)), value(m.group(3))
    for x in (m.group(1), m.group(3)):
        if not re.fullmatch(r"[1-9]\{,\}[1-9]", x):
            errs.append(f"mass {x} not 1,1-9,9 kg")
    if m1 == m2:
        errs.append("equal masses")
    t1, t2 = whole(m.group(2), 40, 95, errs, "t1"), whole(m.group(4), 5, 30, errs, "t2")
    te = (m1 * t1 + m2 * t2) / (m1 + m2)
    if te.q != 1:
        errs.append("te is not a whole number")
    if te - t2 < 3 or t1 - te < 3 or te < 10:
        errs.append("te too close to a starting temperature")
    answer(sample, errs, te, 2, "C")
    return "acqua"


def level3(sample, errs):
    s = text(sample)
    m = re.fullmatch(
        r"Un pezzo di " + MET + " di " + KG + ", a " + C + ", viene immerso in " + KG + " d'acqua a " + C + r"\. Il calore specifico del " + MET + " è " + CJ
        + r", quello dell'acqua \$4186\\,\\text\{J/\(kg\}\\cdot\{\}\^\\circ\\text\{C\)\}\$\. Trascurando il recipiente, a quale temperatura arrivano\?",
        s,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    if m.group(1) != m.group(6) or value(m.group(7)) != METALS[m.group(1)]:
        errs.append("metal or specific heat")
    c1 = METALS[m.group(1)]
    m1, m2 = mass2(m.group(2), errs), mass2(m.group(4), errs, Rational(20, 100))
    t1 = whole(m.group(3), 60, 250, errs, "t1")
    t2 = one_decimal(m.group(5), errs, "t2")
    if t2.q != 1 or not 10 <= t2 <= 25:
        errs.append("t2 not a whole number of degrees in 10-25")
    te = (c1 * m1 * t1 + C_WATER * m2 * t2) / (c1 * m1 + C_WATER * m2)
    if te - t2 < Rational(1, 2):
        errs.append("te too close to t2")
    answer(sample, errs, te, 3, "C")
    return m.group(1)


def level4(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Quanta acqua a " + C + " bisogna aggiungere a " + KG + " d'acqua a " + C + " per ottenere acqua a " + C + r"\? Si trascurano il recipiente e l'aria\.", s):
        t1, m2, t2, te = whole(m.group(1), 50, 95, errs, "t1"), value(m.group(2)), whole(m.group(3), 5, 25, errs, "t2"), whole(m.group(4), 10, 90, errs, "te")
        if not re.fullmatch(r"[1-9]\{,\}[1-9]", m.group(2)):
            errs.append("mass not 1,1-9,9")
        if not t2 + 5 <= te <= t1 - 5:
            errs.append("te not 5 degrees inside")
        m1 = m2 * (te - t2) / (t1 - te)
        if not Rational(1, 10) <= m1 < 10:
            errs.append("mass outside 0,1-10 kg")
        answer(sample, errs, m1, 2, "kg")
        return "massa"
    if m := re.fullmatch(KG + " d'acqua calda vengono mescolati con " + KG + " d'acqua a " + C + r", e la temperatura finale è " + C + r"\. Qual era la temperatura dell'acqua calda\? Si trascurano il recipiente e l'aria\.", s):
        m1, m2 = value(m.group(1)), value(m.group(2))
        for x in (m.group(1), m.group(2)):
            if not re.fullmatch(r"[1-9]\{,\}[1-9]", x):
                errs.append("mass not 1,1-9,9")
        if m1 == m2:
            errs.append("equal masses")
        t2, te = whole(m.group(3), 5, 25, errs, "t2"), whole(m.group(4), 10, 90, errs, "te")
        t1 = te + m2 * (te - t2) / m1
        if t1 >= Rational(995, 10) or t1 < 35 or t1 - te < 5:
            errs.append("hot water temperature out of range")
        answer(sample, errs, t1, 2, "C")
        return "temperatura"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def specific(errs, ma, meq, ta, mx, tx, te):
    da = te - ta
    n = 3 if da >= 10 else 2
    return C_WATER * (ma + meq) * da / (mx * (tx - te)), n


def level5(sample, errs):
    s = text(sample)
    m = re.fullmatch(
        r"Un calorimetro contiene " + KG + " d'acqua a " + C + r"\. Un campione di metallo di " + KG + ", scaldato a " + C
        + r", viene immerso nell'acqua, e la temperatura di equilibrio è " + C + r"\. Trascurando il calorimetro, quanto vale il calore specifico del metallo\? " + CW,
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    for x in (m.group(1), m.group(3)):
        if not re.fullmatch(r"0\{,\}\d\d\d", x) or sig_of(x) != 3:
            errs.append(f"mass {x} not in kg with three figures")
    ma, mx = value(m.group(1)), value(m.group(3))
    ta, tx, te = one_decimal(m.group(2), errs, "ta"), one_decimal(m.group(4), errs, "tx"), one_decimal(m.group(5), errs, "te")
    if not (Rational(1, 10) <= ma <= Rational(3, 10) and Rational(1, 10) <= mx <= Rational(1, 2) and 12 <= ta <= 25 and 80 <= tx <= 100 and te - ta >= 2):
        errs.append("data outside the ranges")
    c, n = specific(errs, ma, 0, ta, mx, tx, te)
    answer(sample, errs, c, n, "cJ")
    return "calore specifico"


def level6(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Un calorimetro contiene " + G + " d'acqua a " + C + r"\. Si versano " + G + " d'acqua a " + C + r", e la temperatura di equilibrio è " + C + r"\. Quanto vale l'equivalente in acqua del calorimetro\?", s):
        mc, mh = whole(m.group(1), 150, 300, errs, "mc"), whole(m.group(3), 80, 200, errs, "mh")
        tc, th, te = one_decimal(m.group(2), errs, "tc"), one_decimal(m.group(4), errs, "th"), one_decimal(m.group(5), errs, "te")
        if not (12 <= tc <= 25 and 50 <= th <= 80 and tc < te < th):
            errs.append("temperatures outside the ranges")
        meq = mh * (th - te) / (te - tc) - mc
        if not 10 <= meq < Rational(995, 10):
            errs.append("water equivalent outside 10-99 g")
        answer(sample, errs, meq, 2, "g")
        return "equivalente"
    if m := re.fullmatch(
        r"Un calorimetro con equivalente in acqua di " + G + " contiene " + G + " d'acqua a " + C + r"\. Un campione di metallo di " + G + ", scaldato a " + C
        + r", viene immerso, e la temperatura di equilibrio è " + C + r"\. Quanto vale il calore specifico del metallo\? " + CW,
        s,
    ):
        meq, ma, mx = whole(m.group(1), 10, 60, errs, "meq"), whole(m.group(2), 150, 300, errs, "ma"), whole(m.group(4), 100, 500, errs, "mx")
        ta, tx, te = one_decimal(m.group(3), errs, "ta"), one_decimal(m.group(5), errs, "tx"), one_decimal(m.group(6), errs, "te")
        if not (12 <= ta <= 25 and 80 <= tx <= 100 and te - ta >= 2):
            errs.append("temperatures outside the ranges")
        c, n = specific(errs, ma / 1000, meq / Rational(1000), ta, mx / Rational(1000), tx, te)
        answer(sample, errs, c, n, "cJ")
        return "calore specifico"
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
