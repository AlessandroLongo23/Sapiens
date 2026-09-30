"""Checker for chim-soluzioni-percentuale (specs/exercises/chim-soluzioni-percentuale.md), written from the spec and
the lesson 17-chim-soluzioni-percentuale.md, not from the generator.

% (m/m) = m_soluto / m_soluzione · 100 with m_soluzione = m_soluto + m_solvente; % (m/V) = grams of solute over
millilitres of solution · 100; % (V/V) = V_soluto / V_soluzione · 100. The percentages of levels 1-4 are exact and have
two significant figures; the masses of level 5 are exact. The solubility S is in grams per 100 g of water: at most
S · m_acqua / 100 dissolves, the rest stays on the bottom; a saturated solution has 100 S / (100 + S) % by mass, to
three significant figures. Exact arithmetic with sympy.
"""
import re

from sympy import Rational

from checkers._chim_stati_soluzioni import num, right_qty, rounded, setup
from checkers._fis_grandezze import fmt_dec

CASE_RANGES = {
    3: {"litri": (0.40, 0.60), "millilitri": (0.40, 0.60)},
    5: {"soluto": (0.50, 0.70), "solvente": (0.30, 0.50)},
    6: {"fondo": (0.40, 0.60), "satura": (0.40, 0.60)},
}

N = r"(\d+(?:\{,\}\d+)?)"
G = r"\$" + N + r"\\,\\text\{g\}\$"
ML = r"\$" + N + r"\\,\\text\{mL\}\$"
L = r"\$" + N + r"\\,\\text\{L\}\$"
C = r"\$(\d+)\\,\^\\circ\\text\{C\}\$"
PCT = r"\$" + N + r"\\%\$"
SOLUTE = r"([a-z ]+)"


def two_sig_exact(p, errs):
    """p must be exact with two significant figures; returns it as written."""
    w = rounded(p, 2)
    if w is None or num(w) != p:
        errs.append(f"percentage {p} is not exact with two significant figures")
        return None
    return w


def level1(sample, prose, errs):
    m = re.fullmatch(r"In " + G + r" di una soluzione acquosa ci sono " + G + r" di " + SOLUTE + r"\. Qual è la percentuale in massa del soluto\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    msol, ms = num(m.group(1)), num(m.group(2))
    w = two_sig_exact(100 * ms / msol, errs)
    if w:
        right_qty(sample, errs, w, "%")
    return "soluzione"


def level2(sample, prose, errs):
    m = re.fullmatch(r"Si sciolgono " + G + r" di " + SOLUTE + r" in " + G + r" d'acqua\. Qual è la percentuale in massa del soluto\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    ms, mw = num(m.group(1)), num(m.group(3))
    if ms.q != 1 or mw.q != 1:
        errs.append("masses are not whole grams")
    w = two_sig_exact(100 * ms / (ms + mw), errs)
    if w:
        right_qty(sample, errs, w, "%")
    return "solvente"


def level3(sample, prose, errs):
    m = re.fullmatch(r"Si preparano (" + ML + "|" + L + r") di soluzione acquosa con " + G + r" di " + SOLUTE + r"\. Qual è la percentuale massa su volume, \$\\%\\,\(m/V\)\$\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    litres = m.group(3) is not None
    V = num(m.group(3)) * 1000 if litres else num(m.group(2))
    ms = num(m.group(4))
    w = two_sig_exact(100 * ms / V, errs)
    if w:
        right_qty(sample, errs, w, "%")
    return "litri" if litres else "millilitri"


def level4(sample, prose, errs):
    m = re.fullmatch(r"In (una bottiglia di vino|una lattina di birra|un flacone di collutorio|una soluzione di alcol in acqua) da " + ML + r" ci sono " + ML + r" di etanolo\. Qual è la percentuale in volume dell'etanolo\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    V, vs = num(m.group(2)), num(m.group(3))
    if not vs < V:
        errs.append("more ethanol than solution")
    w = two_sig_exact(100 * vs / V, errs)
    if w:
        right_qty(sample, errs, w, "%")
    return "volume"


def level5(sample, prose, errs):
    m = re.fullmatch(r"Si vogliono preparare " + G + r" di soluzione di " + SOLUTE + r" al " + PCT + r" in massa\. (Quanta acqua serve\?|Quanti grammi di ([a-z ]+) servono\?)", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    msol, p = num(m.group(1)), num(m.group(3))
    ms = p * msol / 100
    solvent = m.group(4).startswith("Quanta")
    if not solvent and m.group(5) != m.group(2):
        errs.append("the solute asked is not the one of the solution")
    want = msol - ms if solvent else ms
    if (want * 10).q != 1:
        errs.append(f"{want} g has more than one decimal")
        return None
    right_qty(sample, errs, fmt_dec(want), "g")
    return "solvente" if solvent else "soluto"


# Solubilities (g in 100 g of water) of the lesson's tables, by substance and temperature; see the notes.
SOLUBILITY = {("cloruro di sodio", 20): "35{,}9", ("nitrato di potassio", 20): "31{,}6", ("nitrato di potassio", 40): "63{,}9",
              ("cloruro di potassio", 20): "34{,}0", ("cloruro di ammonio", 20): "37{,}2", ("solfato di rame", 20): "20{,}7"}


def level6(sample, prose, errs):
    head = r"A " + C + r" la solubilità del " + SOLUTE + r" è " + G + r" in \$100\\,\\text\{g\}\$ d'acqua\. "
    h = re.match(head, prose)
    if h and SOLUBILITY.get((h.group(2), int(h.group(1)))) != h.group(3):
        errs.append(f"solubility of {h.group(2)} at {h.group(1)} °C is not {h.group(3)}")
    m = re.fullmatch(head + r"Si mettono " + G + r" di " + SOLUTE + r" in " + G + r" d'acqua a " + C + r" e si mescola a lungo\. Quanti grammi restano sul fondo\?", prose)
    if m:
        S, added, mw = num(m.group(3)), num(m.group(4)), num(m.group(6))
        if m.group(5) != m.group(2) or m.group(7) != m.group(1):
            errs.append("solute or temperature changed in the text")
        bottom = added - S * mw / 100
        if bottom <= 0:
            errs.append("everything dissolves")
            return "fondo"
        right_qty(sample, errs, fmt_dec(bottom), "g")
        return "fondo"
    m = re.fullmatch(head + r"Qual è la percentuale in massa di una soluzione satura a questa temperatura\?", prose)
    if m:
        S = num(m.group(3))
        w = rounded(100 * S / (100 + S), 3)
        if w is None:
            errs.append("too close to a rounding boundary")
        else:
            right_qty(sample, errs, w, "%")
        return "satura"
    errs.append(f"level 6 text not recognised: {prose!r}")
    return None


def check(sample):
    errs, prose, _ = setup(sample)
    lvl = sample["level"]
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}.get(lvl)
    if not fn:
        errs.append(f"unknown level {lvl}")
        return errs, None
    return errs, fn(sample, prose, errs)
