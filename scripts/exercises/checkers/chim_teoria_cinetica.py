"""Checker for chim-teoria-cinetica (specs/exercises/chim-teoria-cinetica.md), written from the spec and the lesson
29-chim-teoria-cinetica.md, not from the generator.

T = t + 273. The mean kinetic energy of the particles is proportional to the absolute temperature, so heating from t1
to t2 degrees Celsius multiplies it by (t2 + 273) / (t1 + 273). At the same temperature the mean kinetic energy is the
same for every gas, so v1 / v2 = sqrt(m2 / m1); among samples at different temperatures the fastest particles have the
largest sqrt(T / M).
"""
import re

from checkers._chim_gas import MASS, answer, answer_int, common, formula_mass, options, text, value
from sympy import Rational, sqrt

CASE_RANGES = {
    1: {"kelvin": (0.40, 0.60), "celsius": (0.40, 0.60)},
    2: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
    5: {"energia": (0.40, 0.60), "velocita": (0.40, 0.60)},
}

TRUE = {
    "Il volume delle particelle è trascurabile rispetto a quello del recipiente.",
    "Le particelle si muovono in linea retta tra un urto e l'altro.",
    "Tra un urto e l'altro le particelle non si attraggono.",
    "Negli urti l'energia cinetica totale delle particelle non cambia.",
    "L'energia cinetica media delle particelle è proporzionale alla temperatura assoluta.",
    "Tra una particella e l'altra c'è spazio vuoto.",
    "Le particelle non hanno tutte la stessa velocità.",
}
FALSE = {
    "Le particelle di un gas sono ferme.",
    "Tra una particella e l'altra c'è aria.",
    "Le particelle si attraggono con forze intense.",
    "Tutte le particelle hanno la stessa velocità.",
    "L'energia cinetica media è proporzionale alla temperatura in gradi Celsius.",
    "Negli urti le particelle perdono energia e si fermano.",
    "Le particelle occupano quasi tutto il volume del recipiente.",
    "Scaldando il gas le particelle diventano più grandi.",
}

C = r"\$(-?\d+)\\,\^\\circ\\text\{C\}\$"
K = r"\$(\d+)\\,\\text\{K\}\$"
F = r"\$\\mathrm\{([A-Za-z_0-9]+)\}\$"
M = r"\$(\d+\{,\}\d\d)\$"


def words(latex):
    """The plain text of a words option: its \\text{} pieces, lines joined with a space."""
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", latex)
    lines = m.group(1).split(r" \\ ") if m else [latex]
    out = []
    for line in lines:
        mm = re.fullmatch(r"\\text\{(.*)\}", line)
        if not mm:
            raise ValueError(f"not a words option: {latex!r}")
        out.append(mm.group(1))
    return " ".join(out)


def level1(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Quanto vale una temperatura di " + C + r" nella scala Kelvin\?", s):
        t = int(m.group(1))
        if not -200 <= t <= 400 or abs(t) < 5:
            errs.append("t out of range")
        answer_int(sample, errs, t + 273, "K")
        return "kelvin"
    if m := re.fullmatch(r"Quanto vale una temperatura di " + K + r" in gradi Celsius\?", s):
        T = int(m.group(1))
        if not 20 <= T <= 800 or abs(T - 273) < 5:
            errs.append("T out of range")
        answer_int(sample, errs, T - 273, "C")
        return "celsius"
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


def level2(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Quale affermazione è (vera|falsa) per il modello del gas ideale della teoria cinetico-molecolare\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    want, other = (TRUE, FALSE) if m.group(1) == "vera" else (FALSE, TRUE)
    opts, c = options(sample, errs)
    if c is None:
        return None
    texts = [words(o) for o in opts]
    for i, x in enumerate(texts):
        if i == c and x not in want:
            errs.append(f"correct option is not {m.group(1)}: {x!r}")
        if i != c and x not in other:
            errs.append(f"distractor is not in the other list: {x!r}")
    return m.group(1)


def level3(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un gas viene portato da " + C + " a " + C + r"\. Per quale numero viene moltiplicata l'energia cinetica media delle sue particelle\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    t1, t2 = int(m.group(1)), int(m.group(2))
    if abs(t1) < 5 or abs(t2) < 5:
        errs.append("a temperature too close to 0 degrees")
    k = Rational(t2 + 273, t1 + 273)
    answer(sample, errs, k, 3, "n")
    return "scalda" if k > 1 else "raffredda"


def masses(s, errs):
    """The masses written after "Masse relative:", checked against the table of lesson 01."""
    m = re.search(r"Masse relative: (.*)\.$", s)
    out = {}
    for f, x in re.findall(F + " " + M, m.group(1) if m else ""):
        out[f] = value(x)
        if abs(value(x) - formula_mass(f)) > Rational(1, 1000):
            errs.append(f"mass of {f} is {x}, the table gives {formula_mass(f)}")
    return out


def level4(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Due gas, " + F + " e " + F + r", sono alla stessa temperatura\. Quante volte le particelle di " + F + r" sono in media più veloci di quelle di " + F + r"\? Masse relative: .*", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    a, b = m.group(3), m.group(4)
    if {a, b} != {m.group(1), m.group(2)} or a == b:
        errs.append("gases")
    ms = masses(s, errs)
    if ms[a] >= ms[b]:
        errs.append("the first gas is not the lighter")
    r = sqrt(ms[b] / ms[a])
    if r < Rational(115, 100):
        errs.append("ratio too close to 1")
    answer(sample, errs, r, 2, "n")
    return "velocita"


def level5(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Quattro campioni di gas: (.*)\. In quale campione le particelle hanno (l'energia cinetica media più grande|la velocità media più grande)\? Masse relative: .*", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    samples = re.findall(F + " a " + K, m.group(1))
    if len(samples) != 4 or len({f for f, _ in samples}) != 4:
        errs.append(f"samples: {samples}")
        return None
    ms = masses(s, errs)
    energy = m.group(2).startswith("l'energia")
    score = {(f, int(T)): (Rational(int(T)) if energy else sqrt(Rational(int(T)) / ms[f])) for f, T in samples}
    ranked = sorted(score, key=lambda k: score[k], reverse=True)
    if score[ranked[1]] > score[ranked[0]] * Rational(95, 100):
        errs.append("no clear winner")
    opts, c = options(sample, errs)
    if c is None:
        return None
    got = []
    for o in opts:
        mm = re.fullmatch(r"\\mathrm\{([A-Za-z_0-9]+)\}\\text\{ a \}(\d+)\\,\\text\{K\}", o)
        if not mm:
            errs.append(f"option {o!r}")
            return None
        got.append((mm.group(1), int(mm.group(2))))
    if sorted(got) != sorted(score):
        errs.append("options are not the four samples")
    if got[c] != ranked[0]:
        errs.append(f"correct option {got[c]} != best {ranked[0]}")
    return "energia" if energy else "velocita"


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


__all__ = ["check", "CASE_RANGES", "MASS"]
