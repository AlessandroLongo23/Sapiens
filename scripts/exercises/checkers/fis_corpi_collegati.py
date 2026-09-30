"""Checker for fis-corpi-collegati (specs/exercises/fis-corpi-collegati.md), written from the spec and the lesson
55-fis-corpi-collegati.md, not from the generator.

Two carts m1 and m2 tied by a thread on a smooth floor, a force F on m1: a = F / (m1 + m2), and the thread pulls m2
with T = m2 a. A cart m1 on a table tied over a pulley to a hanging mass m2: a = (m2 - mu_d m1) g / (m1 + m2)
(mu_d = 0 on a smooth table), T = m2 (g - a). Atwood's machine with m1 < m2: a = (m2 - m1) g / (m1 + m2),
T = 2 m1 m2 g / (m1 + m2). g = 49/5 exactly, answers with two significant figures; the scene has the setup and the
masses of the text, and nothing else.
"""
import re

from sympy import Rational

from checkers._vettori import common, prose
from checkers._fis_forze_movimento import G, answer, data2, num, q

CASE_RANGES = {6: {"accelerazione": (0.40, 0.60), "tensione": (0.40, 0.60)}}
M = Rational(11, 10), Rational(99, 10)


def scene(sample, errs, kind, m1, m2, F=None):
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "corpi-collegati" or d.get("tipo") != kind:
        errs.append(f"scene is not corpi-collegati/{kind}")
        return
    if d.get("m1") != f"{m1.replace('{,}', ',')} kg" or d.get("m2") != f"{m2.replace('{,}', ',')} kg":
        errs.append("scene masses do not match")
    if F is not None and d.get("F") != f"{F} N":
        errs.append("scene force does not match")
    if set(d) - {"tipo", "m1", "m2", "F"}:
        errs.append(f"scene has more than the data: {sorted(d)}")


def towed(sample, errs, ask_t):
    s = prose(sample["problem"])
    tail = r"Quanto vale la tensione del filo\?" if ask_t else r"Quanto vale l'accelerazione dei carrelli\?"
    m = re.fullmatch(
        r"Due carrelli, di " + q("kg") + " e " + q("kg") + r", sono collegati da un filo su un piano orizzontale liscio\. Il carrello di " + q("kg") + r" è tirato da una forza orizzontale di " + q("N") + r"\. " + tail,
        s,
    )
    if not m or m.group(3) != m.group(1):
        errs.append(f"level {sample['level']} text not recognised: {s!r}")
        return None
    m1, m2 = data2(errs, m.group(1), "m1", *M), data2(errs, m.group(2), "m2", *M)
    if m1 == m2:
        errs.append("equal masses")
    F = data2(errs, m.group(4), "F", 11, 99)
    a = F / (m1 + m2)
    if ask_t:
        answer(sample, errs, m2 * a, "N")
    else:
        answer(sample, errs, a, "m/s2")
    scene(sample, errs, "traino", m.group(1), m.group(2), m.group(4))
    return "traino"


def table(sample, errs, ask_t, rough):
    s = prose(sample["problem"])
    noun = "Un blocco" if rough else "Un carrello"
    smooth = "" if rough else " liscio"
    intro = noun + r" di " + q("kg") + r" sta su un tavolo orizzontale" + smooth + r" ed è collegato da un filo, attraverso una carrucola sul bordo del tavolo, a un pesetto di " + q("kg") + r" che pende nel vuoto\. "
    if rough:
        tail = r"Tra blocco e tavolo \$\\mu_d = (0\{,\}\d\d)\$, e il blocco scivola\. Quanto vale l'accelerazione\?"
    else:
        tail = r"Quanto vale la tensione del filo\?" if ask_t else r"Quanto vale l'accelerazione del carrello\?"
    m = re.fullmatch(intro + tail, s)
    if not m:
        errs.append(f"level {sample['level']} text not recognised: {s!r}")
        return None
    m1, m2 = data2(errs, m.group(1), "m1", *M), data2(errs, m.group(2), "m2", *M)
    if m1 == m2:
        errs.append("equal masses")
    mu = num(m.group(3)) if rough else 0
    if rough:
        if not Rational(1, 10) <= mu <= Rational(6, 10):
            errs.append("mu_d outside 0.10-0.60")
        if m2 < Rational(12, 10) * mu * m1:
            errs.append("the hanging weight is not 1.2 times the friction")
    a = (m2 - mu * m1) * G / (m1 + m2)
    if ask_t:
        answer(sample, errs, m2 * (G - a), "N")
    else:
        answer(sample, errs, a, "m/s2", lo=Rational(2, 10) if rough else Rational(1, 10))
    scene(sample, errs, "tavolo", m.group(1), m.group(2))
    return "tavolo"


def atwood(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una macchina di Atwood porta due masse di " + q("kg") + " e " + q("kg") + r", lasciate libere da ferme\. (Quanto vale la tensione del filo|Quanto vale l'accelerazione delle masse)\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    m1, m2 = data2(errs, m.group(1), "m1", *M), data2(errs, m.group(2), "m2", *M)
    if not m1 < m2:
        errs.append("the lighter mass must come first")
    scene(sample, errs, "atwood", m.group(1), m.group(2))
    if "tensione" in m.group(3):
        answer(sample, errs, 2 * m1 * m2 * G / (m1 + m2), "N")
        return "tensione"
    answer(sample, errs, (m2 - m1) * G / (m1 + m2), "m/s2")
    return "accelerazione"


LEVELS = {
    1: lambda s, e: towed(s, e, False),
    2: lambda s, e: towed(s, e, True),
    3: lambda s, e: table(s, e, False, False),
    4: lambda s, e: table(s, e, True, False),
    5: lambda s, e: table(s, e, False, True),
    6: atwood,
}


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
