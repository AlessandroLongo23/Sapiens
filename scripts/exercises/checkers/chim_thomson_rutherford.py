"""Checker for chim-thomson-rutherford (specs/exercises/chim-thomson-rutherford.md), written from the spec and the lesson
41-chim-thomson-rutherford.md, not from the generator.

Dalton: a full, indivisible atom without charges. Thomson: a uniform sphere of positive charge with the electrons
inside. Rutherford: a tiny positive nucleus with almost all the mass, the electrons around it, the atom almost empty.
The gold foil: almost all alpha particles straight (the atom is empty), some deflected a lot (the positive charge in a
tiny nucleus), very few back (the nucleus has the mass); Thomson's model predicted them all nearly straight. A scale
model multiplies every length by the same number; volumes go with the cube of the radii. Exact arithmetic with sympy,
results rounded to two significant figures.
"""
import re

from sympy import Rational

from checkers._fis_calore import rounded, value
from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in ["Modello di Dalton", "Modello di Thomson", "Modello di Rutherford", "Nessuno dei tre"]},
    2: {k: (0.26, 0.40) for k in ["conclusione", "osservazione", "previsione"]},
}

MODELS = ["Modello di Dalton", "Modello di Thomson", "Modello di Rutherford", "Nessuno dei tre"]


def model_of(s):
    """The model a statement describes, by its key words; each statement must match exactly one rule."""
    rules = [
        (("indivisibile", "non contiene cariche", "non contiene particelle"), "Modello di Dalton"),
        (("in modo uniforme", "immersi in una sfera", "panettone"), "Modello di Thomson"),
        (("positiva è concentrata in un nucleo", "massa dell'atomo è nel nucleo", "come i pianeti", "quasi tutto vuoto"), "Modello di Rutherford"),
        (("elettroni stanno nel nucleo", "negativa è concentrata al centro", "intero ha carica positiva"), "Nessuno dei tre"),
    ]
    hits = [m for keys, m in rules if any(k in s for k in keys)]
    if len(hits) != 1:
        raise ValueError(f"statement not understood: {s!r}")
    return hits[0]


# observation -> the conclusion Rutherford drew from it
FOIL = {
    "Quasi tutte le particelle alfa attraversano la lamina senza deviare": "L'atomo è quasi tutto vuoto",
    "Alcune particelle alfa sono deviate di angoli grandi": "La carica positiva è concentrata in un nucleo piccolissimo",
    "Pochissime particelle alfa tornano indietro": "Il nucleo contiene quasi tutta la massa dell'atomo",
}
FALSE_CONCLUSIONS = {"Gli elettroni sono più pesanti delle particelle alfa", "La carica positiva è sparsa in tutto l'atomo", "Le particelle alfa hanno carica negativa"}
FALSE_OBSERVATIONS = {"Tutte le particelle alfa si fermano nella lamina", "Le particelle alfa sono attratte dagli atomi della lamina"}
THOMSON = "Passano quasi tutte dritte, con deviazioni piccolissime"
PREDICTIONS = {THOMSON, "Molte tornano indietro", "Si fermano tutte nella lamina", "Sono deviate tutte di angoli grandi"}

LEN = r"\$(\d\{,\}\d) \\cdot 10\^\{(-\d+)\}\\,\\text\{m\}\$"
OBJECTS = {"una capocchia di spillo": ("2{,}0\\,\\text{mm}", Rational(2, 10)), "una biglia": ("1{,}0\\,\\text{cm}", 1), "una pallina da ping pong": ("4{,}0\\,\\text{cm}", 4), "un'arancia": ("8{,}0\\,\\text{cm}", 8), "un pallone da calcio": ("22\\,\\text{cm}", 22)}


def low(s):
    return s[0].lower() + s[1:]


def level1(sample, prose, errs):
    m = re.fullmatch(r"In quale modello atomico (.+)\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    want = model_of(m.group(1))
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in MODELS:
            errs.append(f"unexpected option {o['latex']!r}")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
    return want


def level2(sample, prose, errs):
    opts = [option_text(o["latex"]) for o in sample["answer"]["options"]]
    if m := re.fullmatch(r"Nell'esperimento della lamina d'oro si osserva questo: (.+)\. Che cosa ne dedusse Rutherford\?", prose):
        obs = [k for k in FOIL if low(k) == m.group(1)]
        if len(obs) != 1:
            errs.append("unknown observation")
            return None
        for o in opts:
            if o not in set(FOIL.values()) | FALSE_CONCLUSIONS:
                errs.append(f"unexpected option {o!r}")
        check_choice(sample["answer"], lambda o: option_text(o["latex"]) == FOIL[obs[0]], errs)
        return "conclusione"
    if m := re.fullmatch(r"Quale osservazione dell'esperimento della lamina d'oro mostra che (.+)\?", prose):
        obs = [k for k, c in FOIL.items() if low(c) == m.group(1)]
        if len(obs) != 1:
            errs.append("unknown conclusion")
            return None
        for o in opts:
            if o not in set(FOIL) | FALSE_OBSERVATIONS:
                errs.append(f"unexpected option {o!r}")
        check_choice(sample["answer"], lambda o: option_text(o["latex"]) == obs[0], errs)
        return "osservazione"
    if prose == "Particelle alfa sono sparate contro una lamina d'oro sottilissima. Secondo il modello di Thomson, che cosa succede alle particelle alfa?":
        if set(opts) != PREDICTIONS:
            errs.append(f"unexpected options {opts}")
        check_choice(sample["answer"], lambda o: option_text(o["latex"]) == THOMSON, errs)
        return "previsione"
    errs.append(f"level 2 text not recognised: {prose!r}")
    return None


def radii(prose, tail, errs):
    m = re.fullmatch(r"Il raggio di un atomo è " + LEN + ", quello del suo nucleo " + LEN + r"\. " + tail, prose)
    if not m:
        return None
    ra = value(m.group(1)) * Rational(10) ** int(m.group(2))
    rn = value(m.group(3)) * Rational(10) ** int(m.group(4))
    if m.group(2) != "-10" or m.group(4) != "-15" or not Rational(1, 2) <= value(m.group(1)) <= Rational(5, 2):
        errs.append("radii out of range")
    return ra, rn


def level3(sample, prose, errs):
    r = radii(prose, r"Quante volte il raggio dell'atomo è più grande di quello del nucleo\?", errs)
    if r is None:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    want = rounded(r[0] / r[1], 2)
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return "rapporto"


def level5(sample, prose, errs):
    r = radii(prose, r"Quale frazione del volume dell'atomo occupa il nucleo\?", errs)
    if r is None:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    want = rounded((r[1] / r[0]) ** 3, 2)
    if want is None:
        errs.append("tie")
        return None
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return "volume"


def level4(sample, prose, errs):
    m = re.fullmatch(
        r"Il diametro di un atomo è \$(\d\{,\}\d \\cdot 10\^\{\d\})\$ volte quello del suo nucleo\. In un modello in scala il nucleo è (.+), con un diametro di \$(.+?)\$\. Quanto è grande il diametro dell'atomo nel modello\?",
        prose,
    )
    if not m or m.group(2) not in OBJECTS or OBJECTS[m.group(2)][0] != m.group(3):
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    ratio = value(m.group(1))
    metres = ratio * Rational(OBJECTS[m.group(2)][1]) / 100
    if metres >= Rational(9995, 10):
        want = rounded(metres / 1000, 2) + r"\,\text{km}"
    else:
        want = rounded(metres, 2) + r"\,\text{m}"
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return "scala"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
