"""Checker for chim-legame-idrogeno (specs/exercises/chim-legame-idrogeno.md), written from the spec and the lesson
73-chim-legame-idrogeno.md, not from the generator.

Every molecule is described here by its skeleton: the atoms that are not hydrogen, each with the hydrogens bonded to
it. From the skeleton come the two conditions of the lesson: a donor has a hydrogen bonded to F, O or N; an acceptor
has an atom of F, O or N, which in a neutral molecule carries one (N), two (O) or three (F) lone pairs. The boiling
temperatures are those of the lesson's table of the four groups and of its second example; the electrons are counted
with the atomic numbers of elementi.json. A base pair A-T has 2 hydrogen bonds, a pair G-C has 3.
"""
import re

from checkers._chim3_h import atoms, check_choice, check_number, choice_of, common, electrons, fx, plain, prose_and_extra, unfx

CASE_RANGES = {
    1: {"forma": (0.50, 0.70), "non-forma": (0.30, 0.50)},
    2: {"idrogeni": (0.40, 0.60), "coppie": (0.40, 0.60)},
    3: {"due-versi": (0.22, 0.38), "un-verso": (0.32, 0.48), "nessun-verso": (0.22, 0.38)},
    5: {"numeri": (0.40, 0.60), "sequenza": (0.40, 0.60)},
}

# formula -> the atoms that are not hydrogen, in the order of the formula, each with its hydrogens
SKELETON = {
    "H2O": [("O", 2)],
    "NH3": [("N", 3)],
    "HF": [("F", 1)],
    "CH3OH": [("C", 3), ("O", 1)],
    "CH3CH2OH": [("C", 3), ("C", 2), ("O", 1)],
    "CH4": [("C", 4)],
    "H2S": [("S", 2)],
    "HCl": [("Cl", 1)],
    "HBr": [("Br", 1)],
    "HI": [("I", 1)],
    "PH3": [("P", 3)],
    "AsH3": [("As", 3)],
    "SiH4": [("Si", 4)],
    "H2Se": [("Se", 2)],
    "H2Te": [("Te", 2)],
    "CH3OCH3": [("C", 3), ("O", 0), ("C", 3)],
    "CH3COCH3": [("C", 3), ("C", 0), ("O", 0), ("C", 3)],
    "C3H8": [("C", 3), ("C", 2), ("C", 3)],
}
LONE_PAIRS = {"N": 1, "O": 2, "F": 3}


def _totals(pairs):
    out = {}
    for s, n in pairs:
        if n:
            out[s] = out.get(s, 0) + n
    return out


for _f, _sk in SKELETON.items():
    assert _totals(atoms(_f)) == _totals([(s, 1) for s, _ in _sk] + [("H", n) for _, n in _sk]), _f

NAMES = {
    "H2O": "acqua", "NH3": "ammoniaca", "HF": "fluoruro di idrogeno", "CH3OH": "metanolo", "CH3CH2OH": "etanolo",
    "CH4": "metano", "H2S": "solfuro di idrogeno", "HCl": "cloruro di idrogeno", "HBr": "bromuro di idrogeno",
    "PH3": "fosfina", "SiH4": "silano", "CH3OCH3": "etere dimetilico", "CH3COCH3": "acetone", "C3H8": "propano",
}
FEMININE = {"fosfina"}
# the lesson's table of the two conditions, with ethanol (first figure) and acetone (example 4)
LEVEL2 = {"H2O", "NH3", "HF", "CH3OH", "CH3CH2OH", "CH4", "H2S", "CH3OCH3", "CH3COCH3"}
# the molecules of the lesson's interactive figure, with acetone
LEVEL3 = {"H2O", "NH3", "HF", "CH3OH", "CH3OCH3", "CH3COCH3", "CH4", "H2S"}
# boiling temperatures in degrees Celsius
BOILING = {
    "CH4": -162, "NH3": -33, "PH3": -88, "AsH3": -62, "H2O": 100, "H2S": -60, "H2Se": -41, "H2Te": -2,
    "HF": 20, "HCl": -85, "HBr": -67, "HI": -35, "CH3CH2OH": 78, "CH3OCH3": -25, "C3H8": -42,
}
# the pairs the spec lists for level 4, the one with hydrogen bonds first
BOILING_PAIRS = {
    ("H2O", "H2S"), ("H2O", "H2Se"), ("H2O", "H2Te"), ("H2O", "CH4"), ("NH3", "PH3"), ("NH3", "AsH3"), ("NH3", "CH4"),
    ("HF", "HCl"), ("HF", "HBr"), ("HF", "HI"), ("CH3CH2OH", "CH3OCH3"), ("CH3CH2OH", "C3H8"),
}


def donor_h(f):
    """Hydrogens bonded to F, O or N."""
    return sum(n for s, n in SKELETON[f] if s in LONE_PAIRS)


def acceptor_pairs(f):
    """Lone pairs on the atoms of F, O, N."""
    return sum(LONE_PAIRS[s] for s, _ in SKELETON[f] if s in LONE_PAIRS)


def bonds_itself(f):
    return donor_h(f) > 0 and acceptor_pairs(f) > 0


def with_article(f):
    name = NAMES[f]
    if name[0] in "aeiou":
        return "l'" + name
    return ("la " if name in FEMININE else "il ") + name


def of(f):
    return "d'acqua" if f == "H2O" else "di " + NAMES[f]


def formula_in(text):
    return unfx(text)


def level1(sample, prose, errs):
    cases = {
        "Tra le molecole di quale di queste sostanze si formano legami a idrogeno?": "forma",
        "Tra le molecole di quale di queste sostanze non si formano legami a idrogeno?": "non-forma",
    }
    if prose not in cases:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    kind = cases[prose]

    def right(o):
        m = re.fullmatch(r"\$(.+)\$, (.+)", plain(o["latex"]))
        f = formula_in(m.group(1))
        if NAMES[f] != m.group(2):
            raise ValueError(f"{f} is not {m.group(2)}")
        if o["values"] != [f]:
            raise ValueError(f"value {o['values']} is not the formula {f}")
        return bonds_itself(f) == (kind == "forma")

    check_choice(choice_of(sample), right, errs)
    check_number_kind(sample, False, errs)
    return kind


def check_number_kind(sample, is_open, errs):
    kind = sample.get("answer", {}).get("kind")
    if is_open and kind != "number":
        errs.append("this level gives its answer as a number")
    if not is_open and kind != "choice":
        errs.append("this level is a multiple choice only")


LEVEL2_TEXTS = [
    (r"Quanti atomi di idrogeno della molecola (.+), \$(.+)\$, sono legati a un atomo di fluoro, ossigeno o azoto\?", "idrogeni"),
    (r"Nella molecola (.+), \$(.+)\$, quanti atomi di idrogeno possono formare un legame a idrogeno con un'altra molecola\?", "idrogeni"),
    (r"Quante coppie solitarie ci sono in tutto sugli atomi di fluoro, ossigeno o azoto della molecola (.+), \$(.+)\$\?", "coppie"),
    (r"Nella molecola (.+), \$(.+)\$, quante coppie solitarie possono ricevere l'idrogeno di un'altra molecola in un legame a idrogeno\?", "coppie"),
]


def level2(sample, prose, errs):
    for pattern, kind in LEVEL2_TEXTS:
        m = re.fullmatch(pattern, prose)
        if m:
            break
    else:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    f = formula_in(m.group(2))
    if f not in LEVEL2:
        errs.append(f"{f} is not a molecule of level 2")
        return None
    if m.group(1) != of(f):
        errs.append(f"{m.group(1)!r} is not the name of {f}")
    want = donor_h(f) if kind == "idrogeni" else acceptor_pairs(f)
    check_number(sample, want, errs, must_be_open=True)
    if sample.get("solution") != str(want):
        errs.append(f"solution {sample.get('solution')} != {want}")
    return kind


def level3(sample, prose, errs):
    m = re.fullmatch(r"Una molecola (.+?), \$(.+?)\$, è vicina a una (.+?), \$(.+?)\$\. In quale verso si può formare un legame a idrogeno tra le due\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    a, b = formula_in(m.group(2)), formula_in(m.group(4))
    if a == b or a not in LEVEL3 or b not in LEVEL3:
        errs.append(f"{a} and {b} are not two different molecules of level 3")
        return None
    if m.group(1) != of(a) or m.group(3) != of(b):
        errs.append("a name does not match its formula")
    a_to_b = donor_h(a) > 0 and acceptor_pairs(b) > 0
    b_to_a = donor_h(b) > 0 and acceptor_pairs(a) > 0
    texts = {
        (True, True): "In tutti e due i versi",
        (True, False): f"Solo con {with_article(a)} come donatore",
        (False, True): f"Solo con {with_article(b)} come donatore",
        (False, False): "In nessuno dei due versi",
    }
    want = texts[(a_to_b, b_to_a)]
    ch = choice_of(sample)
    check_choice(ch, lambda o: plain(o["latex"]) == want, errs)
    if {plain(o["latex"]) for o in ch.get("options", [])} != set(texts.values()):
        errs.append("the options are not the four of the spec")
    check_number_kind(sample, False, errs)
    return "due-versi" if a_to_b and b_to_a else "un-verso" if a_to_b or b_to_a else "nessun-verso"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Quale delle due sostanze bolle a temperatura più alta, \$(.+?)\$ o \$(.+?)\$, e perché\?", prose) or re.fullmatch(
        r"Tra \$(.+?)\$ e \$(.+?)\$, quale sostanza ha la temperatura di ebollizione più alta, e perché\?", prose
    )
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    pair = [formula_in(m.group(1)), formula_in(m.group(2))]
    with_bonds = [f for f in pair if bonds_itself(f)]
    if len(with_bonds) != 1:
        errs.append(f"{len(with_bonds)} of the two substances form hydrogen bonds")
        return None
    hb = with_bonds[0]
    other = pair[1] if pair[0] == hb else pair[0]
    if (hb, other) not in BOILING_PAIRS:
        errs.append(f"{hb} and {other} are not a pair of the spec")
    if BOILING[hb] - BOILING[other] < 20:
        errs.append(f"{hb} does not boil clearly higher than {other}")
    want = f"${fx(hb)}$ perché forma legami a idrogeno"
    allowed = {
        want,
        f"${fx(other)}$ perché è più polare",
        f"${fx(hb)}$ perché i suoi legami covalenti sono più forti",
        f"${fx(other)}$ perché ha più elettroni" if electrons(other) > electrons(hb) else "Nessuna delle due: hanno gli stessi elettroni",
    }
    if electrons(other) < electrons(hb):
        errs.append(f"{other} has fewer electrons than {hb}")
    ch = choice_of(sample)
    check_choice(ch, lambda o: plain(o["latex"]) == want, errs)
    if {plain(o["latex"]) for o in ch.get("options", [])} != allowed:
        errs.append("the options are not the four of the spec")
    steps = " ".join(prose_and_extra(s)[0] for s in sample.get("steps", []))
    for f in (hb, other):
        if f"{fx(f)}$ bolle a ${BOILING[f]}\\,^\\circ" not in steps and f"{fx(f)}$ a ${BOILING[f]}\\,^\\circ" not in steps:
            errs.append(f"the steps do not give the boiling temperature of {f}")
    check_number_kind(sample, False, errs)
    return "ebollizione"


def level5(sample, prose, errs):
    m = re.fullmatch(
        r"Un tratto di DNA è lungo \$(\d+)\$ coppie di basi: \$(\d+)\$ sono coppie adenina-timina e \$(\d+)\$ guanina-citosina\. Quanti legami a idrogeno tengono uniti i due filamenti in quel tratto\?",
        prose,
    )
    if m:
        kind = "numeri"
        total, at, gc = (int(x) for x in m.groups())
        if total != at + gc:
            errs.append(f"{at} + {gc} pairs are not {total}")
        if at < 2 or gc < 2:
            errs.append("fewer than two pairs of a kind")
    else:
        m = re.fullmatch(
            r"Su un filamento di un tratto di DNA si leggono, in ordine, le basi \$\\mathrm\{([ATGC](?:\\,[ATGC])*)\}\$\. Ogni base è appaiata a una base dell'altro filamento\. Quanti legami a idrogeno tengono uniti i due filamenti in quel tratto\?",
            prose,
        )
        if not m:
            errs.append(f"level 5 text not recognised: {prose!r}")
            return None
        kind = "sequenza"
        bases = m.group(1).split("\\,")
        if not 4 <= len(bases) <= 8:
            errs.append(f"{len(bases)} bases")
        at = sum(1 for x in bases if x in "AT")
        gc = sum(1 for x in bases if x in "GC")
    if at == gc or at == 0 or gc == 0:
        errs.append("the swapped count would be right too, or a kind of pair is missing")
    want = 2 * at + 3 * gc
    check_number(sample, want, errs, must_be_open=True)
    if sample.get("solution") != str(want):
        errs.append(f"solution {sample.get('solution')} != {want}")
    if f"= {want}" not in " ".join(sample.get("steps", [])):
        errs.append("the steps do not reach the answer")
    return kind


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
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
