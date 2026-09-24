"""Checker for insiemi-unione, from specs/exercises/insiemi-unione.md.

Unions are recomputed with Python sets, the sets described in words are enumerated from 1 to n,
counts come from |A ∪ B| = |A| + |B| - |A ∩ B| and, for the word problems, from the four zones of
the diagram (only A, only B, both, neither), which must add up to the total.
"""
from checkers.insiemi_comune import (
    base_errors,
    choice_errors,
    els,
    no_repeats,
    number_answer_errors,
    number_option_truth,
    prose,
    set_answer_errors,
    set_option_truth,
    set_tex,
)

CASE_RANGES = {
    1: {"in comune": (0.52, 0.68), "disgiunti": (0.13, 0.27), "uno incluso": (0.13, 0.27)},
    4: {"incluso": (0.37, 0.53), "universo": (0.22, 0.38), "vuoto": (0.17, 0.33)},
    5: {"unione": (0.42, 0.58), "intersezione": (0.22, 0.38), "B": (0.13, 0.27)},
    6: {"almeno uno": (0.22, 0.38), "nessuno": (0.22, 0.38), "entrambi": (0.13, 0.27), "entrambi con nessuno": (0.13, 0.27)},
}

# (A, B, both, neither) as the problems say them
CONTEXT_WORDS = [
    ("giocano a calcio", "giocano a pallavolo", "fanno tutti e due gli sport", "non fanno nessuno dei due sport"),
    ("studiano inglese", "studiano spagnolo", "studiano tutte e due le lingue", "non studiano nessuna delle due lingue"),
    ("fanno nuoto", "giocano a tennis", "fanno tutti e due gli sport", "non fanno nessuno dei due sport"),
    ("hanno un cane", "hanno un gatto", "hanno sia un cane sia un gatto", "non hanno né un cane né un gatto"),
    ("suonano la chitarra", "suonano il pianoforte", "suonano tutti e due gli strumenti", "non suonano nessuno dei due strumenti"),
]


def array(rows):
    return "\\begin{array}{l} " + " \\\\ ".join(rows) + " \\end{array}"


def described(d):
    """(elements, phrase) of a set described in words."""
    kind, k, n = d["kind"], int(d["k"]), int(d["n"])
    if kind == "div":
        return [x for x in range(1, k + 1) if k % x == 0], f"dei divisori di ${k}$"
    test = {"pari": lambda x: x % 2 == 0, "dispari": lambda x: x % 2 == 1, "mult": lambda x: x % k == 0}[kind]
    what = {"pari": "dei numeri pari", "dispari": "dei numeri dispari", "mult": f"dei multipli di ${k}$"}[kind]
    return [x for x in range(1, n + 1) if test(x)], f"{what} da $1$ a ${n}$"


def check(sample):
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    prob = sample["problem"]
    kind = None
    truth = None
    if lvl in (1, 3):
        names = ["A", "B"] + (["C"] if lvl == 3 else [])
        sets = [set(els(p[n])) for n in names]
        truth = set().union(*sets)
        rows = [f"A = {set_tex(sets[0])} \\qquad B = {set_tex(sets[1])}"] + ([f"C = {set_tex(sets[2])}"] if lvl == 3 else [])
        rows.append(" \\cup ".join(names) + " = \\ ?")
        if prob != array(rows):
            errs.append("problem does not show the sets and the union asked")
        if lvl == 1:
            A, B = sets
            kind = p.get("case")
            actual = "uno incluso" if (A <= B or B <= A) else "disgiunti" if not A & B else "in comune"
            if kind != actual:
                errs.append(f"case {kind} but the sets are {actual}")
        else:
            A, B, C = sets
            if len(truth) > 10:
                errs.append("more than 10 elements")
            if sum(1 for x in (A & B, B & C, A & C) if x) < 2:
                errs.append("need at least two overlapping pairs")
            if C <= A | B or A <= B | C:
                errs.append("a set that adds nothing")
    elif lvl == 2:
        A, pa = described(p["A"])
        B, pb = described(p["B"])
        truth = set(A) | set(B)
        if f"Siano $A$ l'insieme {pa} e $B$ l'insieme {pb}." not in prose(prob):
            errs.append("problem does not describe A and B as in params")
        if not set(A) & set(B) or set(A) <= set(B) or set(B) <= set(A) or len(truth) > 12:
            errs.append("level 2: overlapping sets, none inside the other, union up to 12")
    elif lvl == 4:
        v = p["variant"]
        kind = v
        A = set(els(p["A"]))
        if v == "incluso":
            B = set(els(p["B"]))
            truth = A | B
            if not A < B or prob != array([f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", "A \\cup B = \\ ?"]):
                errs.append("incluso: A must be a proper subset of B, shown in the problem")
        elif v == "universo":
            U = set(els(p["U"]))
            truth = A | U
            if not A < U or prob != array([f"U = {set_tex(U)} \\qquad A = {set_tex(A)}", "A \\cup U = \\ ?"]):
                errs.append("universo: A inside U, shown in the problem")
        elif v == "vuoto":
            truth = A
            if prob != array([f"A = {set_tex(A)}", "A \\cup \\emptyset = \\ ?"]):
                errs.append("vuoto: problem must show A and A ∪ ∅")
        else:
            errs.append(f"unknown variant {v}")
    elif lvl == 5:
        v = p["variant"]
        kind = v
        if v == "unione":
            a, b, i = int(p["a"]), int(p["b"]), int(p["i"])
            value = a + b - i
            shown = [f"|A| = {a}", f"|B| = {b}", f"|A \\cap B| = {i}", "|A \\cup B| = \\ ?"]
        elif v == "intersezione":
            a, b, u = int(p["a"]), int(p["b"]), int(p["u"])
            i = value = a + b - u
            shown = [f"|A| = {a}", f"|B| = {b}", f"|A \\cup B| = {u}", "|A \\cap B| = \\ ?"]
        elif v == "B":
            u, a, i = int(p["u"]), int(p["a"]), int(p["i"])
            b = value = u - a + i
            shown = [f"|A \\cup B| = {u}", f"|A| = {a}", f"|A \\cap B| = {i}", "|B| = \\ ?"]
        else:
            return errs + [f"unknown variant {v}"], None
        if not all(s in prob for s in shown):
            errs.append("problem does not show the data in params")
        if not (1 <= i < min(a, b)):
            errs.append(f"|A ∩ B| = {i} must be between 1 and min(|A|, |B|) - 1")
        errs += number_answer_errors(sample, value)
        errs += choice_errors(sample.get("choice"), number_option_truth(value))
        return errs, kind
    elif lvl == 6:
        v = p["variant"]
        kind = v
        total, a, b, both, none = (int(p[k]) for k in ("total", "a", "b", "both", "none"))
        only_a, only_b = a - both, b - both
        if min(only_a, only_b, both, none) < 0 or only_a + only_b + both + none != total:
            errs.append("the four zones of the diagram do not add up to the total")
        if both < 1 or total > 60:
            errs.append("numbers out of range")
        value = {"almeno uno": only_a + only_b + both, "nessuno": none, "entrambi": both, "entrambi con nessuno": both}.get(v)
        if value is None:
            return errs + [f"unknown variant {v}"], None
        if v == "almeno uno" and none == 0:
            errs.append("'almeno uno' with nobody outside: the answer is the total")
        if v == "entrambi" and none != 0:
            errs.append("'entrambi' needs everybody in at least one set")
        text = prose(prob)
        wa, wb, wboth, wnone = CONTEXT_WORDS[int(p["context"])]
        given = [f" {total} ", f" {a} {wa}", f" {b} {wb}"]
        if v in ("almeno uno", "nessuno"):
            given.append(f" {both} {wboth}")
        if v == "entrambi con nessuno":
            given.append(f" {none} {wnone}")
        question = {"nessuno": wnone, "entrambi": wboth, "entrambi con nessuno": wboth}.get(v, "almeno")
        if not all(g in text for g in given) or question not in text.split(".")[-1]:
            errs.append("problem does not state the data in params")
        given = {"entrambi": (total, a, b), "entrambi con nessuno": (total, a, b, none)}.get(v, (total, a, b, both))
        if value in given:
            errs.append("the answer is a number already in the text")
        errs += number_answer_errors(sample, value)
        errs += choice_errors(sample.get("choice"), number_option_truth(value))
        return errs, kind
    else:
        return errs + [f"unknown level {lvl}"], None
    errs += set_answer_errors(sample, truth)
    if not no_repeats(prob):
        errs.append("repeated elements in a listed set")
    errs += choice_errors(sample.get("choice"), set_option_truth(truth))
    return errs, kind
