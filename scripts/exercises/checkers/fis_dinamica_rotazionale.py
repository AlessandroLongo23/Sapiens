"""Checker for fis-dinamica-rotazionale (specs/exercises/fis-dinamica-rotazionale.md), written from the spec and the
lesson 88-fis-dinamica-rotazionale.md, not from the generator.

M_tot = I alpha; a force tangent to a disc has arm R and the disc I = m R^2 / 2; a force at the angle phi with the
door has moment r F sin(phi); a wheel stopped in the time t has alpha = -omega0 / t; a bucket m on a disc pulley M:
m g - T = m a and T R = (M R^2 / 2)(a / R); an Atwood machine with a disc pulley M: T1 - m1 g = m1 a,
m2 g - T2 = m2 a, T2 - T1 = M a / 2. The systems are solved here with sympy, not with the closed formulas.
g = 9,8 m/s^2. Answers rounded half up to two significant figures.
"""
import re

from sympy import Symbol, sin, solve

from checkers._fis_rotazioni import G, Q, Rational, answer, common, data2, pi, prose

I_U = "kg·m^2"

CASE_RANGES = {
    1: {"accelerazione": (0.40, 0.60), "momento": (0.40, 0.60)},
    4: {"frenata": (0.40, 0.60), "avvio": (0.40, 0.60)},
    5: {"accelerazione": (0.40, 0.60), "tensione": (0.40, 0.60)},
    6: {"accelerazione": (0.40, 0.60), "tensione": (0.40, 0.60)},
}


def level1(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch("Su una ruota con momento d'inerzia " + Q(I_U) + " agisce un momento totale di " + Q("N·m") + r"\. Quanto vale la sua accelerazione angolare\?", s):
        I, M = data2(errs, m.group(1), "I", 0.11, 9.9), data2(errs, m.group(2), "M", 0.5, 60)
        if M / I < Rational(1, 10):
            errs.append("acceleration under 0,1 rad/s^2")
        answer(sample, errs, M / I, "rad/s^2")
        return "accelerazione"
    m = re.fullmatch("Un volano con momento d'inerzia " + Q(I_U) + " deve prendere un'accelerazione angolare di " + Q("rad/s^2") + r"\. Quale momento totale serve\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    I, a = data2(errs, m.group(1), "I", 0.11, 9.9), data2(errs, m.group(2), "alpha", 0.5, 40)
    if I * a < Rational(1, 10):
        errs.append("moment under 0,1 N m")
    answer(sample, errs, I * a, "N·m")
    return "momento"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch("Un disco pieno di massa " + Q("kg") + " e raggio " + Q("m") + r" può ruotare senza attrito attorno al suo asse\. Una forza di " + Q("N") + r" agisce sul bordo, tangente al disco\. Quanto vale l'accelerazione angolare del disco\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    mass, R, F = data2(errs, m.group(1), "m", 0.5, 9.9), data2(errs, m.group(2), "R", 0.11, 0.99), data2(errs, m.group(3), "F", 1.1, 40)
    a = F * R / (mass * R**2 / 2)
    if a < Rational(1, 2):
        errs.append("acceleration under 0,5 rad/s^2")
    answer(sample, errs, a, "rad/s^2")
    return "disco"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch("Una porta ha momento d'inerzia " + Q(I_U) + r" rispetto ai cardini\. La spingi a " + Q("m") + " dai cardini con una forza di " + Q("N") + r", che forma un angolo di \$(\d+)\^\\circ\$ con il piano della porta\. Con quale accelerazione angolare parte la porta\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    I, r, F, phi = data2(errs, m.group(1), "I", 1.1, 9.9), data2(errs, m.group(2), "r", 0.31, 0.95), data2(errs, m.group(3), "F", 5, 60), int(m.group(4))
    if phi not in (30, 35, 40, 50, 55, 60, 65, 70):
        errs.append(f"angle {phi} not in the list")
    a = r * F * sin(pi * phi / 180) / I
    if a < Rational(1, 5):
        errs.append("acceleration under 0,2 rad/s^2")
    answer(sample, errs, a, "rad/s^2")
    sc = sample.get("scene")
    if not sc or sc.get("type") != "asta-forze":
        errs.append("scene asta-forze missing")
    else:
        d = sc["data"]
        f = d["forze"][0]
        comma = lambda tex: tex.replace("{,}", ",")
        if Rational(str(f["x"])) != r or f["angolo"] != phi or f["valore"] != comma(m.group(3)) + " N" or f["arco"] != f"{phi}°":
            errs.append("scene: the force is not the one of the text")
        if d["appoggi"] != [{"x": 0, "tipo": "perno"}]:
            errs.append("scene: the hinge is not at the left end")
        q = d["quote"][0]
        if q["da"] != 0 or Rational(str(q["a"])) != r or q["testo"] != comma(m.group(2)) + " m":
            errs.append("scene: the distance is not the one of the text")
        if Rational(str(d["lunghezza"])) < r:
            errs.append("scene: the force is beyond the door")
    return "porta"


def level4(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch("Una ruota con momento d'inerzia " + Q(I_U) + " gira a " + Q("rad/s") + r"\. Un freno la ferma in " + Q("s") + r" con accelerazione angolare costante\. Quanto vale, in modulo, il momento frenante\?", s):
        I, w0, t = data2(errs, m.group(1), "I", 0.11, 5.0), data2(errs, m.group(2), "omega0", 5, 60), data2(errs, m.group(3), "t", 1.1, 20)
        M = abs(I * (0 - w0) / t)
        if M < Rational(1, 20):
            errs.append("moment under 0,05 N m")
        answer(sample, errs, M, "N·m")
        return "frenata"
    m = re.fullmatch("Un motore applica un momento costante di " + Q("N·m") + " a un volano fermo, che ha momento d'inerzia " + Q(I_U) + r"\. Quale velocità angolare ha il volano dopo " + Q("s") + r"\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    M, I, t = data2(errs, m.group(1), "M", 0.5, 40), data2(errs, m.group(2), "I", 0.11, 5.0), data2(errs, m.group(3), "t", 1.1, 20)
    answer(sample, errs, M / I * t, "rad/s")
    return "avvio"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch("Un secchio di massa " + Q("kg") + " è appeso a una fune avvolta attorno a una carrucola, un disco pieno di massa " + Q("kg") + r" che ruota senza attrito attorno al suo asse\. Il secchio viene lasciato libero\. (Con quale accelerazione scende\?|Quanto vale la tensione della fune\?)", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    mb, Mp = data2(errs, m.group(1), "m", 0.5, 9.9), data2(errs, m.group(2), "M", 0.5, 9.9)
    a, T, R = Symbol("a"), Symbol("T"), Symbol("R", positive=True)
    sol = solve([mb * G - T - mb * a, T * R - (Mp * R**2 / 2) * (a / R)], [a, T], dict=True)[0]
    if sol[a] > Rational(93, 10):
        errs.append("too close to free fall")
    if m.group(3).startswith("Con quale"):
        answer(sample, errs, sol[a], "m/s^2")
        return "accelerazione"
    answer(sample, errs, sol[T], "N")
    return "tensione"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch("Una macchina di Atwood porta due masse di " + Q("kg") + " e " + Q("kg") + r"\. La carrucola è un disco pieno di massa " + Q("kg") + r", senza attrito sull'asse, e il filo non slitta\. (Quanto vale l'accelerazione delle due masse\?|Quanto vale la tensione del tratto di filo che regge la massa più pesante\?)", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    m1, m2, Mp = data2(errs, m.group(1), "m1", 0.5, 5.0), data2(errs, m.group(2), "m2", 0.5, 9.9), data2(errs, m.group(3), "M", 0.5, 5.0)
    if not Rational(12, 10) * m1 <= m2 <= 3 * m1:
        errs.append("the second mass is not between 1,2 and 3 times the first")
    a, T1, T2 = Symbol("a"), Symbol("T1"), Symbol("T2")
    sol = solve([T1 - m1 * G - m1 * a, m2 * G - T2 - m2 * a, T2 - T1 - Mp * a / 2], [a, T1, T2], dict=True)[0]
    if sol[a] < Rational(1, 5):
        errs.append("acceleration under 0,2 m/s^2")
    sc = sample.get("scene")
    comma = lambda tex: tex.replace("{,}", ",") + " kg"
    if not sc or sc.get("type") != "corpi-collegati" or sc["data"] != {"tipo": "atwood", "m1": comma(m.group(1)), "m2": comma(m.group(2))}:
        errs.append("scene corpi-collegati missing or not as in the text")
    if m.group(4).startswith("Quanto vale l'accelerazione"):
        answer(sample, errs, sol[a], "m/s^2")
        return "accelerazione"
    answer(sample, errs, sol[T2], "N")
    return "tensione"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
