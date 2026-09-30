"""Checker for chim-equazione-generale-gas (specs/exercises/chim-equazione-generale-gas.md), written from the spec and
the lesson 33-chim-equazione-generale-gas.md, not from the generator.

For a fixed amount of gas p1 V1 / T1 = p2 V2 / T2, with T = t + 273 in kelvin and the pressures (and the volumes) in
the same unit. Normal conditions: 0 °C (273 K) and 1 atm = 760 mmHg = 101,3 kPa. The law of a situation is chosen
from what stays constant: the temperature (Boyle), the pressure (Charles), the volume (Gay-Lussac), nothing (the
general equation).
"""
import re

from checkers._chim_gas import answer, answer_int, common, options, quantity, sig_of, text, value
from checkers.chim_teoria_cinetica import words
from sympy import Rational

CASE_RANGES = {
    1: {"boyle": (0.17, 0.33), "charles": (0.17, 0.33), "gay": (0.17, 0.33), "generale": (0.17, 0.33)},
    5: {"mmHg": (0.40, 0.60), "kPa": (0.40, 0.60)},
}

LABELS = {"Legge di Boyle": "boyle", "Legge di Charles": "charles", "Legge di Gay-Lussac": "gay", "Equazione generale dei gas": "generale"}

# What stays constant in each situation of the spec, read from its words.
SITUATIONS = [
    (r"Lo stantuffo di una siringa tappata viene spinto piano piano, e l'aria dentro resta a .*", "boyle"),
    (r"Un sub espira una bolla d'aria a .* di profondità, e l'acqua ha la stessa temperatura dal fondo alla superficie\.", "boyle"),
    (r"Un gas in un cilindro immerso in una grande vasca d'acqua viene compresso lentamente da .*", "boyle"),
    (r"Un palloncino gonfio viene messo in un congelatore a .*", "charles"),
    (r"Un gas in un cilindro chiuso da un pistone libero di scorrere viene scaldato da .*", "charles"),
    (r"L'aria dentro una mongolfiera, aperta in basso verso l'atmosfera, viene scaldata dal bruciatore\.", "charles"),
    (r"Una bombola di gas lasciata al sole si scalda da .*", "gay"),
    (r"Una bomboletta spray chiusa finisce nel fuoco\.", "gay"),
    (r"La gomma di un'auto si scalda da .* durante un viaggio, senza cambiare volume\.", "gay"),
    (r"Un pallone sonda sale nell'atmosfera: la pressione e la temperatura dell'aria intorno diminuiscono\.", "generale"),
    (r"Un gas viene compresso da .* e intanto si scalda da .*", "generale"),
    (r"Una bolla sale dal fondo freddo di un lago verso la superficie, dove l'acqua è più calda\.", "generale"),
]

C = r"\$(-?\d+)\\,\^\\circ\\text\{C\}\$"
K = r"\$(\d+)\\,\\text\{K\}\$"


def level1(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"(.*) Quale legge descrive come cambia il gas\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    law = next((k for rx, k in SITUATIONS if re.fullmatch(rx, m.group(1))), None)
    if law is None:
        errs.append(f"unknown situation: {m.group(1)!r}")
        return None
    opts, c = options(sample, errs)
    if c is None:
        return None
    got = [LABELS.get(words(o)) for o in opts]
    if sorted(x or "" for x in got) != sorted(LABELS.values()):
        errs.append(f"options are not the four laws: {got}")
    if got[c] != law:
        errs.append(f"correct option {got[c]} != {law}")
    return law


def level2(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un gas occupa " + quantity("L") + " a " + quantity("atm") + " e " + K + r"\. Viene portato a " + quantity("atm") + " e " + K + r"\. Quale volume occupa\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    V1, p1, T1, p2, T2 = value(m.group(1)), value(m.group(2)), int(m.group(3)), value(m.group(4)), int(m.group(5))
    answer(sample, errs, p1 * V1 * T2 / (T1 * p2), 3, "L")
    return "volume"


def level3(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un gas occupa " + quantity("L") + r" a \$(\d+)\\,\\text\{kPa\}\$ e " + C + r"\. Viene compresso fino a \$(\d+)\\,\\text\{mL\}\$ e portato a " + C + r"\. Quale pressione ha\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    V1, p1, t1, V2, t2 = value(m.group(1)), value(m.group(2)), int(m.group(3)), value(m.group(4)) / 1000, int(m.group(5))
    if abs(t1) < 5 or abs(t2) < 5:
        errs.append("temperature near zero")
    answer(sample, errs, p1 * V1 * (t2 + 273) / ((t1 + 273) * V2), 3, "kPa")
    return "pressione"


def level4(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un gas occupa " + quantity("L") + " a " + quantity("atm") + " e " + C + r"\. Dopo una trasformazione occupa " + quantity("L") + " alla pressione di " + quantity("atm") + r"\. Quale temperatura ha, al grado Celsius\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    V1, p1, t1, V2, p2 = value(m.group(1)), value(m.group(2)), int(m.group(3)), value(m.group(4)), value(m.group(5))
    T2 = (t1 + 273) * p2 * V2 / (p1 * V1)
    fl = int(T2)
    frac = T2 - fl
    if abs(frac - Rational(1, 2)) < Rational(5, 100):
        errs.append("T2 too close to a half")
    answer_int(sample, errs, (fl + 1 if frac > Rational(1, 2) else fl) - 273, "C")
    return "temperatura"


def level5(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Si raccolgono \$(\d+)\\,\\text\{mL\}\$ di un gas a " + C + r" e alla pressione di \$(\d+(?:\{,\}\d)?)\\,\\text\{(mmHg|kPa)\}\$\. Quale volume occuperebbe lo stesso gas in condizioni normali \(\$0\\,\^\\circ\\text\{C\}\$ e \$1\\,\\text\{atm\}\$\)\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    V1, t1, p1, u = value(m.group(1)), int(m.group(2)), value(m.group(3)), m.group(4)
    if sig_of(m.group(1)) != 3 or sig_of(m.group(3)) not in (3, 4):
        errs.append("data figures")
    pn = Rational(760) if u == "mmHg" else Rational(1013, 10)
    answer(sample, errs, p1 * V1 * 273 / ((t1 + 273) * pn), 3, "mL")
    return u


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
