"""Checker for calore (specs/exercises/calore.md), written from the spec and the lesson 67-calore.md, not from the
generator.

Q = c m Δt with the specific heats of the lesson's table (given in the text); a mass in grams is divided by 1000; the
heat given off is asked without its sign; t_f = t_i + Q / (c m); c = Q / (m Δt); a pot and its water add their heat
capacities, C = c_p m_p + c_a m_a; the specific heat of water is 1 kcal/(kg·°C), so 1 kcal warms 1 kg of water by
1 °C.
"""
import re

from sympy import Rational

from checkers._fis_termologia import common, expect, parse, prose, q, sig_of

CASE_RANGES = {
    1: {"grammi": (0.40, 0.60), "chilogrammi": (0.40, 0.60)},
    2: {"riscaldamento": (0.40, 0.60), "raffreddamento": (0.40, 0.60)},
    5: {"capacita": (0.40, 0.60), "calore": (0.40, 0.60)},
    6: {"etichetta": (0.40, 0.60), "acqua": (0.40, 0.60)},
}

C = {"acqua": 4186, "alcol etilico": 2440, "olio d'oliva": 1970, "alluminio": 897, "vetro": 840, "ferro": 449, "rame": 385, "piombo": 129}
NAME = "(" + "|".join(re.escape(k) for k in C) + ")"
CTEX = r"\(\$c = (\d+)\\,\\text\{J/\(kg\}\\cdot\{\}\^\\circ\\text\{C\)\}\$\)"
SIG2 = ("sig", 2)
GRAMS = {120, 150, 180, 200, 250, 300, 350, 400, 450, 500, 750}


def two_sig(errs, s, what):
    if sig_of(s) != 2 or re.fullmatch(r"\d0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    return parse(s)


def spec_heat(errs, name, s):
    if int(s) != C[name]:
        errs.append(f"c {s} is not the table's for {name}")
    return Rational(C[name])


def mass_kg(errs, s):
    m = two_sig(errs, s, "mass")
    if not Rational(11, 100) <= m <= Rational(99, 10):
        errs.append("mass out of range")
    return m


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Quanto calore serve per scaldare \$(\d+(?:\{,\}\d+)?)\\,\\text\{(kg|g)\}\$ d'acqua " + CTEX + " da " + q("C") + " a " + q("C") + r"\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    if m.group(2) == "g":
        if int(m.group(1)) not in GRAMS:
            errs.append("grams not in the spec's list")
        mass = parse(m.group(1)) / 1000
    else:
        mass = two_sig(errs, m.group(1), "mass")
    spec_heat(errs, "acqua", m.group(3))
    ti, tf = parse(m.group(4)), parse(m.group(5))
    if not (5 <= ti <= 30 and tf <= 100 and tf - ti >= 10):
        errs.append("temperatures out of range")
    expect(sample, errs, 4186 * mass * (tf - ti), "J", SIG2)
    return "grammi" if m.group(2) == "g" else "chilogrammi"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un campione di " + NAME + " " + CTEX + r" ha la massa di " + q("kg") + r"\. Quanto calore (assorbe|cede) passando da " + q("C") + " a " + q("C") + r"\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    name = m.group(1)
    if name == "acqua":
        errs.append("water at level 2")
    c = spec_heat(errs, name, m.group(2))
    mass = mass_kg(errs, m.group(3))
    ti, tf = parse(m.group(5)), parse(m.group(6))
    cooling = m.group(4) == "cede"
    if cooling != (tf < ti):
        errs.append("the verb does not match the temperatures")
    lo, hi = min(ti, tf), max(ti, tf)
    if not (5 <= lo <= 40 and hi - lo >= 10 and hi <= (70 if name in ("olio d'oliva", "alcol etilico") else 250)):
        errs.append("temperatures out of range")
    Q = c * mass * (hi - lo)
    if Q < 10:
        errs.append("heat under 10 J")
    expect(sample, errs, Q, "J", SIG2)
    return "raffreddamento" if cooling else "riscaldamento"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un campione di " + NAME + " " + CTEX + r" ha la massa di " + q("kg") + r" ed è a " + q("C") + r"\. Riceve " + q("kJ") + r" di calore\. A quale temperatura arriva\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    name = m.group(1)
    c = spec_heat(errs, name, m.group(2))
    mass = mass_kg(errs, m.group(3))
    ti = parse(m.group(4))
    Q = two_sig(errs, m.group(5), "heat") * 1000
    dt = Q / (c * mass)
    if not (10 <= ti <= 30 and 5 <= dt <= (50 if name in ("olio d'oliva", "alcol etilico") else 150)):
        errs.append("temperatures out of range")
    if (dt - int(dt)) == Rational(1, 2):
        errs.append("Δt is a tie")
    expect(sample, errs, ti + dt, "C", ("int",), signed=True)
    return "temperatura"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un campione di massa " + q("kg") + r" riceve " + q("kJ") + r" di calore e passa da " + q("C") + " a " + q("C") + r"\. Quanto vale il calore specifico del suo materiale\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass = mass_kg(errs, m.group(1))
    if sig_of(m.group(2)) != 2:
        errs.append("heat not with two figures")
    Q = parse(m.group(2)) * 1000
    ti, tf = parse(m.group(3)), parse(m.group(4))
    dt = tf - ti
    if not (10 <= ti <= 30 and 10 <= dt <= 80):
        errs.append("temperatures out of range")
    c = Q / (mass * dt)
    # the heat comes from a material of the table, rounded to two figures
    if not any(abs(c - v) <= Rational(v, 10) for v in C.values()):
        errs.append(f"c {float(c)} far from every material of the table")
    expect(sample, errs, c, "c", SIG2)
    return "calore-specifico"


def level5(sample, errs):
    s = prose(sample["problem"])
    head = r"Una pentola di (alluminio|ferro|rame) " + CTEX + r" ha la massa di " + q("kg") + r" e contiene " + q("kg") + r" d'acqua " + CTEX + r"\."
    if m := re.fullmatch(head + r" Quanto vale la capacità termica della pentola con l'acqua\?", s):
        dt = None
    elif m := re.fullmatch(head + r" Quanto calore serve per scaldare di " + q("C") + r" la pentola con l'acqua\?", s):
        dt = parse(m.group(6))
        if not 20 <= dt <= 80:
            errs.append("Δt out of range")
    else:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    cp = spec_heat(errs, m.group(1), m.group(2))
    mp, mw = two_sig(errs, m.group(3), "pot mass"), two_sig(errs, m.group(4), "water mass")
    spec_heat(errs, "acqua", m.group(5))
    if not (mp < 1 and 1 < mw <= 5):
        errs.append("masses out of range")
    Ctot = cp * mp + 4186 * mw
    if dt is None:
        expect(sample, errs, Ctot, "JC", SIG2)
        return "capacita"
    expect(sample, errs, Ctot * dt, "J", SIG2)
    return "calore"


def level6(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Sull'etichetta di (uno snack|uno yogurt|una barretta di cioccolato|un panino) c'è scritto " + q("kcal") + r"\. Quanti chilogrammi d'acqua potrebbe scaldare di " + q("C") + r", se tutta l'energia andasse nell'acqua\?", s):
        E, dt = parse(m.group(2)), parse(m.group(3))
        if not (80 <= E <= 600 and E % 10 == 0 and 10 <= dt <= 80):
            errs.append("data out of range")
        expect(sample, errs, E / dt, "kg", SIG2)
        return "etichetta"
    if m := re.fullmatch(r"Quante chilocalorie servono per scaldare " + q("kg") + r" d'acqua da " + q("C") + " a " + q("C") + r"\?", s):
        mass = two_sig(errs, m.group(1), "mass")
        ti, tf = parse(m.group(2)), parse(m.group(3))
        if not (5 <= ti <= 30 and tf <= 100 and tf - ti >= 10):
            errs.append("temperatures out of range")
        expect(sample, errs, mass * (tf - ti), "kcal", SIG2)
        return "acqua"
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
