"""Checker for chim-legge-proporzioni-multiple (specs/exercises/chim-legge-proporzioni-multiple.md).

Written from the spec and lesson 25, not from the generator. The masses (or the percentages) are read from the text;
the mass of the second element per gram of the first is computed for each compound, and the ratio second : first
must be the right option, within 2%, and no other option may be within 5% of it. Every compound must also be real: its
mass per gram (or its percentage) must match, within 0.5%, a compound of the two elements from the checker's own list,
with the atomic masses of lesson 01. At level 5 the formula of the first compound times the ratio gives the atoms of
the second element per atom of the first, and the right option is the only formula with that ratio.
"""
import re
from fractions import Fraction

from checkers._chim_trasformazioni import MASS, ELEMENT_NAME, check_choice, common, count, formulas_in, plain_formula, prose_and_extra

CASE_RANGES = {}

# compounds of each pair of elements (x, y): atoms of x, atoms of y
REAL = {
    ("C", "O"): [(1, 1), (1, 2)],
    ("N", "O"): [(2, 1), (1, 1), (2, 3), (1, 2), (2, 5)],
    ("S", "O"): [(1, 2), (1, 3)],
    ("H", "O"): [(2, 1), (2, 2)],
    ("Fe", "O"): [(1, 1), (2, 3)],
    ("P", "O"): [(2, 3), (2, 5)],
    ("Na", "O"): [(2, 1), (2, 2)],
    ("C", "H"): [(1, 4), (2, 6), (2, 4), (2, 2)],
}

NUM = r"(\d+(?:\{,\}\d+)?)"
G = r"\$" + NUM + r"\\,\\text\{g\}\$"


def num(s):
    return float(s.replace("{,}", "."))


def sig3(s):
    digits = s.replace("{,}", "").lstrip("0")
    return len(digits) == 3


def real_per_gram(x, y, k, errs, tol=0.005):
    """k grams of y per gram of x must be a real compound; returns its (a, b)."""
    for a, b in REAL[(x, y)]:
        if abs(k / (b * MASS[y] / (a * MASS[x])) - 1) < tol:
            return a, b
    errs.append(f"{k:.4f} g of {y} per g of {x} is no real compound")
    return None


def ratio_option(o):
    m = re.fullmatch(r"(\d) : (\d)", o["latex"])
    if not m or o["values"] != [f"{m.group(1)}:{m.group(2)}"]:
        raise ValueError(f"not a ratio: {o['latex']!r}")
    p, q = int(m.group(1)), int(m.group(2))
    if Fraction(p, q).numerator != p:
        raise ValueError(f"ratio not reduced: {p}:{q}")
    return p / q


def check_ratio(ch, r, errs):
    check_choice(ch, lambda o: abs(ratio_option(o) / r - 1) < 0.02, errs)
    for o in ch.get("options", []):
        v = ratio_option(o)
        if 0.02 <= abs(v / r - 1) < 0.05:
            errs.append(f"option {o['latex']} too close to {r:.3f}")


def check(sample):
    errs = []
    common(sample, errs)
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected lines in the problem")
    lvl = sample["level"]
    ch = sample["answer"]
    m0 = re.match(r"Due composti diversi sono fatti solo di (\w+) e (\w+)\. ", prose)
    if not m0:
        return errs + [f"text not recognised: {prose!r}"], None
    x, y = ELEMENT_NAME[m0.group(1)], ELEMENT_NAME[m0.group(2)]
    if (x, y) not in REAL:
        return errs + [f"no compounds of {x} and {y}"], None
    rest = prose[m0.end():]
    X, Y = m0.group(1), m0.group(2)
    Q = rf" In che rapporto stanno la massa di {Y} del secondo composto e quella del primo, per la stessa massa di {X}\?"
    kind = x + y

    if lvl == 1:
        m = re.fullmatch(rf"Nel primo {G} di {X} sono uniti a {G} di {Y}; nel secondo gli stessi {G} di {X} sono uniti a {G} di {Y}\.{Q}", rest)
        if not m or m.group(1) != m.group(3):
            return errs + [f"text not recognised: {rest!r}"], None
        m1 = m2 = num(m.group(1))
        y1, y2 = num(m.group(2)), num(m.group(4))
        data = [m.group(i) for i in (1, 2, 4)]
    elif lvl in (2, 5):
        if lvl == 2:
            m = re.fullmatch(rf"Nel primo {G} di {X} sono uniti a {G} di {Y}; nel secondo {G} di {X} sono uniti a {G} di {Y}\.{Q}", rest)
        else:
            m = re.fullmatch(rf"Il primo è \$\\mathrm\{{[^$]*\}}\$: {G} di {X} sono uniti a {G} di {Y}\. Nel secondo {G} di {X} sono uniti a {G} di {Y}\. Qual è la formula del secondo\?", rest)
        if not m:
            return errs + [f"text not recognised: {rest!r}"], None
        m1, y1, m2, y2 = (num(m.group(i)) for i in range(1, 5))
        data = [m.group(i) for i in range(1, 5)]
        if abs(m1 / m2 - 1) < 0.2:
            errs.append("the masses of the fixed element are almost the same")
    elif lvl == 3:
        m = re.fullmatch(rf"Un campione di {G} del primo contiene {G} di {X}; un campione di {G} del secondo contiene {G} di {X}\.{Q}", rest)
        if not m:
            return errs + [f"text not recognised: {rest!r}"], None
        t1, m1, t2, m2 = (num(m.group(i)) for i in range(1, 5))
        y1, y2 = t1 - m1, t2 - m2
        data = [m.group(2), m.group(4)]
        if y1 <= 0 or y2 <= 0:
            return errs + ["sample lighter than its element"], None
    elif lvl == 4:
        m = re.fullmatch(rf"Il primo contiene il \${NUM}\\%\$ di {X}, il secondo il \${NUM}\\%\$\.{Q}", rest)
        if not m:
            return errs + [f"text not recognised: {rest!r}"], None
        p1, p2 = num(m.group(1)), num(m.group(2))
        m1, y1, m2, y2 = p1, 100 - p1, p2, 100 - p2
        data = [m.group(1), m.group(2)]
    else:
        return errs + [f"unknown level {lvl}"], None

    for d in data:
        if not sig3(d):
            errs.append(f"{d} has not three significant figures")
    k1, k2 = y1 / m1, y2 / m2
    # rounded data: level 3 subtracts, so a looser tolerance there
    if lvl == 3:
        c1 = min(REAL[(x, y)], key=lambda ab: abs(k1 / (ab[1] * MASS[y] / (ab[0] * MASS[x])) - 1))
        c2 = min(REAL[(x, y)], key=lambda ab: abs(k2 / (ab[1] * MASS[y] / (ab[0] * MASS[x])) - 1))
        for k, c in ((k1, c1), (k2, c2)):
            if abs(k / (c[1] * MASS[y] / (c[0] * MASS[x])) - 1) > 0.03:
                errs.append(f"{k:.4f} is no real compound")
    elif lvl == 4:
        # a percentage with three figures: the part of the other element can have two, and the error adds up
        c1 = real_per_gram(x, y, k1, errs, 0.06 / y1 + 0.06 / m1)
        c2 = real_per_gram(x, y, k2, errs, 0.06 / y2 + 0.06 / m2)
    else:
        c1, c2 = real_per_gram(x, y, k1, errs), real_per_gram(x, y, k2, errs)
    if not c1 or not c2:
        return errs, kind
    if Fraction(c1[1], c1[0]) == Fraction(c2[1], c2[0]):
        errs.append("the two compounds are the same")
    r = k2 / k1
    exact = Fraction(c2[1], c2[0]) / Fraction(c1[1], c1[0])
    if abs(r / float(exact) - 1) > 0.02:
        errs.append(f"measured ratio {r:.3f} far from {exact}")

    if lvl < 5:
        check_ratio(ch, r, errs)
        return errs, kind

    first = formulas_in(rest)[0][1]
    fc = count(first)
    if Fraction(fc.get(y, 0), fc.get(x, 1)) != Fraction(c1[1], c1[0]) or set(fc) != {x, y}:
        errs.append(f"the first formula {first} does not match its data")
    want = Fraction(fc[y], fc[x]) * r

    def right(o):
        f, q = plain_formula(o["latex"])
        c = count(f)
        if q is not None or set(c) != {x, y} or o["values"] != [f]:
            raise ValueError(f"bad formula option {o['latex']!r}")
        v = c[y] / c[x]
        ok = abs(v / float(want) - 1) < 0.02
        if ok and (c[x], c[y]) not in REAL[(x, y)]:
            raise ValueError(f"{f} is not a real compound")
        return ok

    check_choice(ch, right, errs)
    return errs, kind
