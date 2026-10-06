"""Checker for legame-ionico (specs/exercises/legame-ionico.md), written from the spec and the lesson
65-legame-ionico.md, not from the generator.

An ionic bond joins a metal and a non-metal (and here the difference of electronegativity is at least 1,9); the ion of a
main-group element has the charge its group gives; a formula is neutral with the smallest indices; the ions in a mass
are n · N_A · ions per formula unit; the lattice energy grows as q₊ · q₋ / d; the facts on the properties (key below).
"""
import re

from sympy import Rational

from checkers._chim3_f import (
    ANION_NAME,
    BY_NAME,
    BY_SYMBOL,
    IONIC_RADIUS,
    N_A,
    check_choice,
    chi,
    common,
    dec,
    ion_charge,
    ion_of,
    is_metal,
    is_non_metal,
    mass,
    neutral,
    no_art,
    option_text,
    parse_formula,
    parse_sci,
    prose_and_extra,
)

CASE_RANGES = {5: {"cariche": (0.30, 0.50), "distanza": (0.50, 0.70)}}

KEY = {
    "Perché un cristallo ionico colpito si spacca?": "Cariche uguali finiscono di fronte",
    "Il cloruro di sodio solido conduce la corrente elettrica?": "No: gli ioni sono bloccati",
    "In quali condizioni un composto ionico conduce la corrente?": "Fuso o sciolto in acqua",
    "Nel cloruro di sodio fuso, quali particelle trasportano la carica?": "Gli ioni",
    "Perché i composti ionici hanno punti di fusione alti?": "Ogni ione attrae tutti i vicini",
    "Di che cosa è fatto un cristallo di cloruro di sodio?": "Di ioni in un reticolo",
    "Che cosa indica la formula di un composto ionico?": "Il rapporto tra gli ioni",
    "Quanto vale il numero di coordinazione nel cloruro di sodio?": "6",
    "Che cosa succede agli elettroni quando si forma un legame ionico?": "Passano dal metallo al non metallo",
    "Che cos'è l'energia reticolare?": "L'energia liberata formando il solido dagli ioni",
    "A parità di cariche, quale reticolo ionico è più stabile?": "Quello con gli ioni più piccoli",
    "Un solido bianco fonde a temperatura alta, da solido non conduce e fuso conduce. Che cos'è?": "Un composto ionico",
    "Tra quali elementi si forma di solito un legame ionico?": "Un metallo e un non metallo",
    "Perché molti composti ionici si sciolgono in acqua?": "Le molecole d'acqua circondano gli ioni",
}


def pair_of(text):
    """'Sodio e cloro' -> ('Na', 'Cl'); 'Due atomi di cloro' -> ('Cl', 'Cl')."""
    m = re.fullmatch(r"Due atomi di (\w+)", text)
    if m:
        s = BY_NAME[m.group(1)]["symbol"]
        return s, s
    m = re.fullmatch(r"(\w+) e (\w+)", text)
    if not m:
        raise ValueError(f"not a pair: {text!r}")
    return BY_NAME[m.group(1).lower()]["symbol"], BY_NAME[m.group(2)]["symbol"]


def ionic(pair):
    a, b = pair
    return (is_metal(a) and is_non_metal(b)) or (is_metal(b) and is_non_metal(a))


def level1(sample, prose, errs):
    if prose != "Quale di queste coppie di elementi forma un legame ionico?":
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    for o in sample["answer"]["options"]:
        a, b = pair_of(option_text(o["latex"]))
        if ionic((a, b)) and abs(chi(a) - chi(b)) < Rational(19, 10):
            errs.append(f"ionic pair {a}-{b} below 1,9: the two criteria of the lesson disagree")
    check_choice(sample["answer"], lambda o: ionic(pair_of(option_text(o["latex"]))), errs)
    return "coppia"


def level2(sample, prose, errs):
    m = re.fullmatch(r"(.+) è nel gruppo \$(\d+)\$ della tavola periodica\. Quale ione forma in un composto ionico\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    el = BY_NAME[no_art(m.group(1))]
    sym = el["symbol"]
    if el["group"] != int(m.group(2)):
        errs.append(f"{sym} is in group {el['group']}, not {m.group(2)}")
    want = ion_charge(sym)
    for o in sample["answer"]["options"]:
        if ion_of(o["latex"])[0] != sym:
            errs.append(f"option {o['latex']!r} of another element")
    check_choice(sample["answer"], lambda o: ion_of(o["latex"]) == (sym, want), errs)
    return "metallo" if is_metal(sym) else "non-metallo"


def level3(sample, prose, errs):
    m = re.fullmatch(r"Qual è la formula del composto ionico formato dagli ioni \$(.+?)\$ e \$(.+?)\$\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    (c, qc), (a, qa) = ion_of(m.group(1)), ion_of(m.group(2))
    if qc <= 0 or qa >= 0:
        errs.append("the cation must come first, then the anion")
        return None
    if ion_charge(c) != qc or ion_charge(a) != qa:
        errs.append("the charges are not those of the groups")
    nc, na = neutral(c, qc, a, -qa)
    want = [(c, nc), (a, na)]
    for o in sample["answer"]["options"]:
        if [s for s, _ in parse_formula(o["latex"])] != [c, a]:
            errs.append(f"option {o['latex']!r}: not the cation followed by the anion")
    check_choice(sample["answer"], lambda o: parse_formula(o["latex"]) == want, errs)
    return "formula"


def level4(sample, prose, errs):
    m = re.fullmatch(
        r"Quanti ioni ci sono in tutto in \$(.+?)\\,\\text\{g\}\$ di (\w+) di (\w+), \$(.+?)\$\? "
        r"Le masse atomiche sono \$(.+?)\$ per \$\\mathrm\{(\w+)\}\$ e \$(.+?)\$ per \$\\mathrm\{(\w+)\}\$; "
        r"usa \$N_A = 6\{,\}02 \\cdot 10\^\{23\}\\,\\text\{mol\}\^\{-1\}\$\.",
        prose,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    grams = dec(m.group(1))
    formula = parse_formula(m.group(4))
    if len(formula) != 2:
        errs.append("not a binary compound")
        return None
    (c, nc), (a, na) = formula
    if not (is_metal(c) and is_non_metal(a)):
        errs.append("not a metal followed by a non-metal")
        return None
    if (nc, na) != neutral(c, ion_charge(c), a, -ion_charge(a)):
        errs.append(f"{m.group(4)} is not the neutral formula with the smallest indices")
    if m.group(2) != ANION_NAME[a] or m.group(3) != BY_SYMBOL[c]["name"].lower():
        errs.append(f"wrong name: {m.group(2)} di {m.group(3)}")
    if (m.group(6), m.group(8)) != (c, a) or dec(m.group(5)) != mass(c) or dec(m.group(7)) != mass(a):
        errs.append("the atomic masses in the text are not those of the table")
    molar = nc * mass(c) + na * mass(a)
    n = grams / molar
    truth = n * N_A * (nc + na)
    # the data have three figures: the right option is the truth rounded, the others are far from it
    def right(o):
        return abs(parse_sci(o["latex"])[0] / truth - 1) < Rational(6, 1000)

    for o in sample["answer"]["options"]:
        r = parse_sci(o["latex"])[0] / truth
        if Rational(6, 1000) <= abs(r - 1) < Rational(5, 100):
            errs.append(f"option {o['latex']!r} too close to the answer")
        value, mant, _ = parse_sci(o["latex"])
        if not (1 <= mant < 10) or len(re.sub(r"\D", "", o["latex"].split(" \\cdot")[0])) != 3:
            errs.append(f"option {o['latex']!r} not in scientific notation with three figures")
    check_choice(sample["answer"], right, errs)
    return f"ioni-{nc + na}"


def pair_from_formula(tex):
    (c, nc), (a, na) = parse_formula(tex)
    if (nc, na) != neutral(c, ion_charge(c), a, -ion_charge(a)):
        raise ValueError(f"{tex} is not a neutral formula")
    return c, a


def estimate(c, a):
    """Lesson 65: the lattice energy grows as the product of the charges over the distance between the centres."""
    return Rational(ion_charge(c) * -ion_charge(a), IONIC_RADIUS[c] + IONIC_RADIUS[a])


def level5(sample, prose, errs):
    m = re.fullmatch(r"Quale dei due composti ha l'energia reticolare maggiore, \$(.+?)\$ o \$(.+?)\$, e perché\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    f1, f2 = m.group(1), m.group(2)
    p1, p2 = pair_from_formula(f1), pair_from_formula(f2)
    e1, e2 = estimate(*p1), estimate(*p2)
    big, small = (f1, f2) if e1 > e2 else (f2, f1)
    pb, ps = (p1, p2) if e1 > e2 else (p2, p1)
    if max(e1, e2) / min(e1, e2) < Rational(105, 100):
        errs.append("the two estimates are too close")
    qb, qs = ion_charge(pb[0]) * -ion_charge(pb[1]), ion_charge(ps[0]) * -ion_charge(ps[1])
    if qb != qs:
        if qb < qs:
            errs.append("the larger estimate has the smaller charges: ambiguous")
        reason, kind = "cariche più alte", "cariche"
    else:
        # same charges: the pair must differ in one ion only, of the same group
        common_ions = set(pb) & set(ps)
        if len(common_ions) != 1:
            errs.append("with the same charges the compounds must share one ion")
        else:
            x, y = (set(pb) - common_ions).pop(), (set(ps) - common_ions).pop()
            if BY_SYMBOL[x]["group"] != BY_SYMBOL[y]["group"]:
                errs.append("the two different ions are not of the same group")
        reason, kind = "ioni più piccoli", "distanza"
    want = f"{big}\\text{{: {reason}}}"
    for o in sample["answer"]["options"]:
        if not re.fullmatch(r"\\mathrm\{\w+\}\\text\{: (cariche più alte|ioni più piccoli|ioni più grandi)\}", o["latex"]):
            errs.append(f"option {o['latex']!r} not recognised")
        elif not (o["latex"].startswith(big + "\\text") or o["latex"].startswith(small + "\\text")):
            errs.append(f"option {o['latex']!r} of another compound")
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return kind


def level6(sample, prose, errs):
    if prose not in KEY:
        errs.append(f"level 6 question not in the key: {prose!r}")
        return None
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == KEY[prose], errs)
    return "fatto"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if sample.get("answer", {}).get("kind") != "choice":
        return errs + ["answer is not a choice"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
