"""Checker for chim-atomi-molecole-ioni (specs/exercises/chim-atomi-molecole-ioni.md).

Written from the spec and lesson 27, not from the generator. The particle is read from the LaTeX and classified by
rules of its own: a charge makes an ion; one symbol alone is an atom; several atoms of one element a molecule of an
element; atoms of different elements a molecule of a compound. The ion formed by an atom follows from the electrons
lost (positive) or gained (negative); the names of the ions come from the lesson's tables; a substance is made of
isolated atoms (noble gases), of packed atoms (a metal alone), of ions (a metal, or the ammonium ion, with other
elements) or of molecules (the rest).
"""
import re

from checkers._chim_trasformazioni import ELEMENT_NAME, check_choice, common, count, formulas_in, option_text, plain_formula, prose_and_extra

CASE_RANGES = {
    1: {k: (0.17, 0.33) for k in ["atomo", "molecola di un elemento", "molecola di un composto", "ione"]},
    2: {"perde": (0.25, 0.60), "acquista": (0.40, 0.75)},
    5: {k: (0.17, 0.33) for k in ["atomi isolati", "atomi di un metallo", "molecole", "ioni"]},
}

KIND_TEXT = {
    "Un atomo": "atomo",
    "Una molecola di un elemento": "molecola di un elemento",
    "Una molecola di un composto": "molecola di un composto",
    "Uno ione": "ione",
}
MADE_TEXT = {"Atomi isolati": "atomi isolati", "Atomi impacchettati di un metallo": "atomi di un metallo", "Molecole": "molecole", "Ioni": "ioni"}
NOBLE = {"He", "Ne", "Ar", "Kr", "Xe"}
METALS = {"Na", "K", "Mg", "Ca", "Fe", "Al", "Cu", "Zn"}

MONO_ANION = {"F": "fluoruro", "Cl": "cloruro", "Br": "bromuro", "I": "ioduro", "O": "ossido", "S": "solfuro", "N": "nitruro"}
POLY = {("NH4", 1): "ammonio", ("OH", -1): "idrossido", ("NO3", -1): "nitrato", ("SO4", -2): "solfato", ("CO3", -2): "carbonato", ("HCO3", -1): "idrogenocarbonato", ("PO4", -3): "fosfato"}
SYMBOL = {v: k for k, v in ELEMENT_NAME.items()}


def classify(f, q):
    if q is not None:
        return "ione"
    c = count(f)
    if len(c) == 1:
        return "atomo" if sum(c.values()) == 1 else "molecola di un elemento"
    return "molecola di un composto"


def ion_name(f, q):
    if (f, q) in POLY:
        return "ione " + POLY[(f, q)]
    if q > 0:
        return "ione " + SYMBOL[f]
    return "ione " + MONO_ANION[f]


def made_of(f):
    c = count(f)
    if len(c) == 1:
        el = next(iter(c))
        if el in NOBLE:
            return "atomi isolati"
        if el in METALS:
            return "atomi di un metallo"
        return "molecole"
    if set(c) & METALS or "NH4" in f:
        return "ioni"
    return "molecole"


def electrons(n):
    return "un elettrone" if n == 1 else f"{n} elettroni"


def check(sample):
    errs = []
    common(sample, errs)
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected lines in the problem")
    lvl = sample["level"]
    ch = sample["answer"]
    fs = formulas_in(prose)

    if lvl == 1:
        if not re.fullmatch(r"Che cos'è la particella \$\\mathrm\{.*\}\$\?", prose) or len(fs) != 1:
            return errs + [f"text not recognised: {prose!r}"], None
        _, f, q = fs[0]
        kind = classify(f, q)
        check_choice(ch, lambda o: KIND_TEXT[option_text(o["latex"])] == kind and o["values"] == [kind], errs)
        return errs, kind

    if lvl == 2:
        m = re.fullmatch(r"Un atomo di (\w+) (perde|acquista) (un|\d) elettron[ei]\. Che ione si forma\?", prose)
        if not m:
            return errs + [f"text not recognised: {prose!r}"], None
        el = ELEMENT_NAME[m.group(1)]
        n = 1 if m.group(3) == "un" else int(m.group(3))
        if not 1 <= n <= 3:
            errs.append(f"{n} electrons")
        want = (el, n if m.group(2) == "perde" else -n)
        if (m.group(2) == "perde") != (el in METALS):
            errs.append(f"{el} {m.group(2)}: metals lose, non-metals gain")
        check_choice(ch, lambda o: plain_formula(o["latex"]) == want, errs)
        return errs, m.group(2)

    if lvl == 3:
        if not re.fullmatch(r"L'atomo da cui viene lo ione \$\\mathrm\{.*\}\$ ha perso o acquistato elettroni\? Quanti\?", prose) or len(fs) != 1:
            return errs + [f"text not recognised: {prose!r}"], None
        _, f, q = fs[0]
        if q is None or len(count(f)) != 1 or sum(count(f).values()) != 1:
            return errs + [f"not a simple ion: {f} {q}"], None
        want = f"Ha {'perso' if q > 0 else 'acquistato'} {electrons(abs(q))}"
        check_choice(ch, lambda o: option_text(o["latex"]) == want, errs)
        return errs, "catione" if q > 0 else "anione"

    if lvl == 4:
        if not re.fullmatch(r"Come si chiama lo ione \$\\mathrm\{.*\}\$\?", prose) or len(fs) != 1:
            return errs + [f"text not recognised: {prose!r}"], None
        _, f, q = fs[0]
        want = ion_name(f, q)
        check_choice(ch, lambda o: option_text(o["latex"]) == want, errs)
        kind = "poliatomico" if (f, q) in POLY else "catione" if q > 0 else "anione"
        return errs, kind

    if lvl == 5:
        m = re.fullmatch(r"Di che particelle è fatta la sostanza \$\\mathrm\{.*\}\$, ([\w' ]+)\?", prose)
        if not m or len(fs) != 1:
            return errs + [f"text not recognised: {prose!r}"], None
        f = fs[0][1]
        kind = made_of(f)
        check_choice(ch, lambda o: MADE_TEXT[option_text(o["latex"])] == kind and o["values"] == [kind], errs)
        return errs, kind

    return errs + [f"unknown level {lvl}"], None
