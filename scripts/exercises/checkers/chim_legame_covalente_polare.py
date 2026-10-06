"""Checker for chim-legame-covalente-polare (specs/exercises/chim-legame-covalente-polare.md), written from the spec
and the lesson 64-chim-legame-covalente-polare.md, not from the generator.

Electronegativities typed again in _chim3_e.py (Pauling, two decimals) and compared with those the problem gives; the
difference in exact arithmetic; the kind of bond from the thresholds of the lesson (below 0,4 pure, from 0,4 to 1,9
polar, above 1,9 ionic), with the pairs the spec leaves out refused (near a threshold, a metal and a non-metal below
2,0, two metals, two non-metals above 1,85); the partial charges from the greater electronegativity; the most or the
least polar of four bonds from the table of the problem; the facts about the dative bond (answer key below).
"""
import re

from sympy import Rational

from checkers._chim3_e import EL, BY_SYMBOL, chi, choice_answer, common, dec2, parse_bond, parse_dec2, unart, unprep
from checkers._fis_grandezze import option_text, prose_and_extra

CASE_RANGES = {
    2: {"puro": (0.20, 0.40), "polare": (0.30, 0.50), "ionico": (0.20, 0.40)},
    3: {"meno": (0.50, 0.70), "piu": (0.30, 0.50)},
    4: {"piu": (0.50, 0.70), "meno": (0.30, 0.50)},
}

PURE_MAX = Rational(35, 100)
POLAR_MIN = Rational(45, 100)
POLAR_MAX = Rational(185, 100)
IONIC_MIN = Rational(2)

KEY = {
    "In un legame dativo, da dove vengono i due elettroni della coppia in comune?": "Tutti e due dallo stesso atomo",
    "Che cosa deve avere l'atomo donatore di un legame dativo?": "Una coppia solitaria",
    "Che cosa deve avere l'atomo accettore di un legame dativo?": "Posto per due elettroni",
    "Nella formazione dello ione ammonio da ammoniaca e ione idrogeno, chi è il donatore?": "L'azoto",
    "Nella formazione dello ione ossonio da acqua e ione idrogeno, chi è l'accettore?": "Lo ione idrogeno",
    "Quante coppie solitarie ha l'azoto nello ione $\\mathrm{NH_4^+}$?": "0",
    "Quante coppie solitarie ha l'ossigeno nello ione $\\mathrm{H_3O^+}$?": "1",
    "Nello ione $\\mathrm{NH_4^+}$, com'è il legame dativo rispetto agli altri tre legami?": "Identico agli altri",
    "Quanti elettroni ha intorno l'azoto nello ione $\\mathrm{NH_4^+}$?": "8",
    "Nel composto che si forma tra $\\mathrm{BF_3}$ e $\\mathrm{NH_3}$, chi è l'accettore?": "Il boro",
    "Quanti elettroni ha intorno il boro in $\\mathrm{BF_3}$, prima di legarsi all'ammoniaca?": "6",
    "Come si può disegnare un legame dativo in una formula?": "Con una freccia dal donatore all'accettore",
    "Perché lo ione $\\mathrm{H^+}$ può fare da accettore in un legame dativo?": "Ha il primo livello vuoto",
    "Quanti legami dativi si formano quando una molecola d'acqua lega uno ione $\\mathrm{H^+}$?": "1",
}

GIVEN = r"L'elettronegatività (del \w+|dello \w+|dell'\w+) è \$(\d\{,\}\d\d)\$, quella (del \w+|dello \w+|dell'\w+) è \$(\d\{,\}\d\d)\$\."


def two_elements(m, errs):
    """The two elements of the opening sentence, with the electronegativities checked."""
    a = unprep(m.group(1), "del", "dello", "dell'")
    b = unprep(m.group(3), "del", "dello", "dell'")
    if parse_dec2(m.group(2)) != chi(a) or parse_dec2(m.group(4)) != chi(b):
        errs.append("electronegativities are not those of the table")
    if a == b:
        errs.append("the same element twice")
    return a, b


def classify(d):
    if d < Rational(4, 10):
        return "puro"
    return "polare" if d <= Rational(19, 10) else "ionico"


def safe(a, b, errs):
    """The pairs the spec allows: far from the thresholds, and classified rightly by the rule."""
    d = abs(chi(a) - chi(b))
    ma, mb = EL[a][4], EL[b][4]
    if ma and mb:
        errs.append("two metals: the rule does not apply")
    elif ma or mb:
        if d < IONIC_MIN:
            errs.append(f"a metal and a non-metal with a difference of {d}: left out by the spec")
    elif not (d <= PURE_MAX or POLAR_MIN <= d <= POLAR_MAX):
        errs.append(f"two non-metals with a difference of {d}: left out by the spec")
    return d


def level1(sample, prose, errs):
    m = re.fullmatch(GIVEN + r" Quanto vale la differenza di elettronegatività \$\\Delta\\chi\$ del legame tra i due atomi\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    a, b = two_elements(m, errs)
    d = safe(a, b, errs)
    if d == 0:
        errs.append("no difference")
    want = dec2(d)
    for o in sample["answer"]["options"]:
        parse_dec2(o["latex"])
    choice_answer(sample, lambda o: o["latex"] == want, errs)
    return "delta"


LABELS = {"puro": "Covalente puro", "polare": "Covalente polare", "ionico": "Ionico"}


def level2(sample, prose, errs):
    m = re.fullmatch(r"Nella molecola \$\\mathrm\{(\w+)_2\}\$ sono legati due atomi di (\w+), che ha elettronegatività \$(\d\{,\}\d\d)\$\. Che tipo di legame c'è tra i due atomi\?", prose)
    if m:
        name = m.group(2)
        if EL[name][0] != m.group(1) or parse_dec2(m.group(3)) != chi(name) or EL[name][4] or m.group(1) not in ("H", "N", "O", "F", "Cl", "Br", "I"):
            errs.append("not a molecule of one non-metal with its electronegativity")
        kind = "puro"
    else:
        m = re.fullmatch(GIVEN + r" Che tipo di legame c'è tra (.+) e (.+)\?", prose)
        if not m:
            errs.append(f"level 2 text not recognised: {prose!r}")
            return None
        a, b = two_elements(m, errs)
        if (unart(m.group(5)), unart(m.group(6))) != (a, b):
            errs.append("the question names other elements")
        kind = classify(safe(a, b, errs))
    texts = sorted(option_text(o["latex"]) for o in sample["answer"]["options"])
    if texts != sorted([*LABELS.values(), "Dativo"]):
        errs.append(f"options {texts}")
    choice_answer(sample, lambda o: option_text(o["latex"]) == LABELS[kind], errs)
    return kind


def level3(sample, prose, errs):
    m = re.fullmatch(GIVEN + r" Nel legame covalente polare tra i due atomi, su quale si trova la carica parziale \$\\delta\^([+-])\$\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    a, b = two_elements(m, errs)
    d = safe(a, b, errs)
    if EL[a][4] or EL[b][4] or classify(d) != "polare":
        errs.append("not a polar covalent bond between two non-metals")
    negative = a if chi(a) > chi(b) else b
    positive = b if negative == a else a
    target = negative if m.group(5) == "-" else positive

    def right(o):
        text = option_text(o["latex"])
        if text in ("Su tutti e due", "Su nessuno dei due"):
            return False
        return unprep(text, "sul", "sullo", "sull'") == target

    choice_answer(sample, right, errs)
    return "meno" if m.group(5) == "-" else "piu"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Quale di questi legami è il (più|meno) polare\? Usa le elettronegatività della tabella\.", prose)
    _, extra = prose_and_extra(sample["problem"])
    if not m or len(extra) != 1:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    table = {}
    for sym, value in re.findall(r"\\mathrm\{([A-Z][a-z]?)\} & (\d\{,\}\d\d)", extra[0]):
        if sym in table or parse_dec2(value) != chi(BY_SYMBOL[sym]):
            errs.append(f"row {sym} of the table wrong or repeated")
        table[sym] = parse_dec2(value)
    diffs = {}
    for o in sample["answer"]["options"]:
        x, y, order = parse_bond(o["latex"])
        if order != 1 or x not in table or y not in table or x == y:
            errs.append(f"option {o['latex']!r}: not a single bond between two elements of the table")
            return None
        if EL[BY_SYMBOL[x]][4] or EL[BY_SYMBOL[y]][4]:
            errs.append(f"option {o['latex']!r}: a metal")
        if table[x] > table[y]:
            errs.append(f"option {o['latex']!r}: the less electronegative atom goes first")
        safe(BY_SYMBOL[x], BY_SYMBOL[y], errs)
        diffs[o["latex"]] = abs(table[x] - table[y])
    if set(table) != {s for tex in diffs for s in parse_bond(tex)[:2]}:
        errs.append("the table has elements no bond uses")
    ordered = sorted(diffs.values())
    if len(ordered) != 4 or any(q - p < Rational(5, 100) for p, q in zip(ordered, ordered[1:])):
        errs.append("the four differences must be at least 0,05 apart")
    best = ordered[-1] if m.group(1) == "più" else ordered[0]
    choice_answer(sample, lambda o: diffs.get(o["latex"]) == best, errs)
    return "piu" if m.group(1) == "più" else "meno"


def level5(sample, prose, errs):
    if prose not in KEY:
        errs.append(f"level 5 question not in the key: {prose!r}")
        return None
    choice_answer(sample, lambda o: option_text(o["latex"]) == KEY[prose], errs)
    return "fatto"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra and lvl != 4:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
