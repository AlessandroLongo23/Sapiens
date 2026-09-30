"""Checker for chim-principio-avogadro (specs/exercises/chim-principio-avogadro.md), written from the spec and the
lesson 34-chim-principio-avogadro.md, not from the generator.

Equal volumes of gases at the same temperature and pressure hold the same number of particles, so: the volumes of
gases that react and form stand as the coefficients of the balanced equation; N2 = N1 V2 / V1 for any two gases; the
masses of equal volumes stand as the relative molecular masses, M_x = M_ref m_x / m_ref. The formula of the only
product of two gases is found by counting the atoms of the molecules that react and sharing them among the molecules
formed. Molecular masses are recomputed from the table of lesson 01.
"""
import re
from collections import Counter

from checkers._chim_gas import answer, common, formula_mass, options, quantity, sig_of, text, value
from sympy import Rational

CASE_RANGES = {
    3: {"O_2": (0.25, 0.42), "N_2": (0.25, 0.42), "H_2": (0.25, 0.42)},
    4: {"O_2": (0.25, 0.42), "N_2": (0.25, 0.42), "H_2": (0.25, 0.42)},
}

F = r"\$\\mathrm\{([A-Za-z_0-9]+)\}\$"


def atoms(f):
    c = Counter()
    for el, n in re.findall(r"([A-Z][a-z]?)(?:_(\d+))?", f):
        c[el] += int(n) if n else 1
    return c


def parse_equation(eq):
    """'2\\,\\mathrm{CO} + \\mathrm{O_2} \\longrightarrow 2\\,\\mathrm{CO_2}' -> ({f: coeff} reactants, {f: coeff} products)."""
    left, right = eq.split(r" \longrightarrow ")
    side = []
    for part in (left, right):
        d = {}
        for t in part.split(" + "):
            m = re.fullmatch(r"(?:(\d+)\\,)?\\mathrm\{([A-Za-z_0-9]+)\}", t)
            if not m:
                raise ValueError(f"term {t!r}")
            d[m.group(2)] = int(m.group(1) or 1)
        side.append(d)
    return side


def level1(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Nella reazione \$(.*?)\$ tutti i gas sono alla stessa temperatura e pressione\.(?: L'acqua si forma come vapore\.)? Quanti litri di " + F + r" (si formano da|servono per ottenere|reagiscono con|si formano insieme a) " + quantity("L") + " di " + F + r"\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    reac, prod = parse_equation(m.group(1))
    for_atoms = Counter(), Counter()
    for d, c in ((reac, for_atoms[0]), (prod, for_atoms[1])):
        for f, k in d.items():
            for el, n in atoms(f).items():
                c[el] += n * k
    if for_atoms[0] != for_atoms[1]:
        errs.append("equation not balanced")
    coeff = {**reac, **prod}
    b, verb, V, a = m.group(2), m.group(3), value(m.group(4)), m.group(5)
    side = lambda f: "r" if f in reac else "p"
    want = {("r", "p"): "si formano da", ("p", "r"): "servono per ottenere", ("r", "r"): "reagiscono con", ("p", "p"): "si formano insieme a"}[(side(a), side(b))]
    if verb != want:
        errs.append(f"verb {verb!r} for {a} -> {b}")
    if coeff[a] == coeff[b]:
        errs.append("equal coefficients")
    if sig_of(m.group(4)) != 2:
        errs.append("volume without two significant figures")
    answer(sample, errs, V * coeff[b] / coeff[a], 2, "L")
    return side(a) + side(b)


def level2(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un recipiente di " + quantity("L") + r" contiene \$(\d\{,\}\d \\cdot 10\^\{\d+\})\$ particelle di " + F + r"\. Quante particelle di " + F + " ci sono in " + quantity("L") + " di " + F + r", alla stessa temperatura e pressione\?", s)
    if not m or m.group(4) != m.group(6) or m.group(3) == m.group(4):
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    V1, N1, V2 = value(m.group(1)), value(m.group(2)), value(m.group(5))
    if abs(V2 / V1 - 1) < Rational(3, 10):
        errs.append("volumes too close")
    answer(sample, errs, N1 * V2 / V1, 2, "n")
    return "particelle"


def level3(sample, errs):
    s = text(sample)
    m = re.fullmatch(
        r"Alla stessa temperatura e pressione, " + quantity("L") + r" di un gas sconosciuto (?:ha|hanno) una massa di " + quantity("g") + ", e " + quantity("L") + " di " + F + " una massa di " + quantity("g")
        + r"\. La massa molecolare relativa di " + F + r" è \$(\d+\{,\}\d\d)\$\. Quanto vale quella del gas sconosciuto\?",
        s,
    )
    if not m or m.group(1) != m.group(3) or m.group(4) != m.group(6):
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    mx, mr, ref, Mr = value(m.group(2)), value(m.group(5)), m.group(4), value(m.group(7))
    if Mr != formula_mass(ref):
        errs.append(f"M of {ref} is {Mr}, the table gives {formula_mass(ref)}")
    answer(sample, errs, Mr * mx / mr, 3, "n")
    return ref


def level4(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Alla stessa temperatura e pressione, un volume di un gas sconosciuto ha una massa \$(\d+(?:\{,\}\d+)?)\$ volte quella di un ugual volume di (ossigeno|azoto|idrogeno) " + F + r"\. Quale gas è\? Masse atomiche: .*", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    ratio, ref = value(m.group(1)), m.group(3)
    if {"ossigeno": "O_2", "azoto": "N_2", "idrogeno": "H_2"}[m.group(2)] != ref:
        errs.append("name of the reference")
    M = ratio * formula_mass(ref)
    opts, c = options(sample, errs)
    if c is None:
        return None
    forms = []
    for o in opts:
        mm = re.fullmatch(r"\\mathrm\{([A-Za-z_0-9]+)\}", o)
        if not mm:
            errs.append(f"option {o!r}")
            return None
        forms.append(mm.group(1))
    best = min(range(4), key=lambda i: abs(formula_mass(forms[i]) - M))
    if best != c:
        errs.append(f"closest gas {forms[best]} is not the correct option {forms[c]}")
    for i, f in enumerate(forms):
        if i != c and abs(formula_mass(f) - formula_mass(forms[c])) < 3:
            errs.append(f"distractor {f} too close in mass")
    if abs(formula_mass(forms[c]) - M) > Rational(1, 2):
        errs.append("the ratio does not give the mass of the answer")
    return ref


def formula_of(counts, order):
    return "".join(el + (f"_{counts[el]}" if counts[el] > 1 else "") for el in order if counts[el])


def level5(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Alla stessa temperatura e pressione, \$(\d+)\\,\\text\{L\}\$ di " + F + r" (?:reagisce|reagiscono) con \$(\d+)\\,\\text\{L\}\$ di " + F + r" e si formano \$(\d+)\\,\\text\{L\}\$ di un solo gas\. Qual è la formula delle sue molecole\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    va, a, vb, b, vp = int(m.group(1)), m.group(2), int(m.group(3)), m.group(4), int(m.group(5))
    total = Counter()
    for f, v in ((a, va), (b, vb)):
        for el, n in atoms(f).items():
            total[el] += n * v
    per = {}
    for el, n in total.items():
        if n % vp:
            errs.append("atoms not shared evenly")
            return None
        per[el] = n // vp
    opts, c = options(sample, errs)
    if c is None:
        return None
    mm = re.fullmatch(r"\\mathrm\{([A-Za-z_0-9]+)\}", opts[c])
    if not mm or atoms(mm.group(1)) != Counter(per):
        errs.append(f"correct option {opts[c]!r} is not {per}")
    for i, o in enumerate(opts):
        mo = re.fullmatch(r"\\mathrm\{([A-Za-z_0-9]+)\}", o)
        if not mo:
            errs.append(f"option {o!r}")
        elif i != c and atoms(mo.group(1)) == Counter(per):
            errs.append("a distractor equals the answer")
    return f"{a}+{b}"


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
