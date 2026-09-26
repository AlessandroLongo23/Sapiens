"""Checker for insiemi-differenza, from specs/exercises/insiemi-differenza.md.

Differences and complements are recomputed with Python sets; sets described by a property are
enumerated here from the conditions in params (the second set may be infinite: only membership of the
elements of the first one is tested); De Morgan identities are tested on every pair of subsets of a
three-element universe; word problems are rebuilt from the zones of the diagram, and the text of the
problem is rebuilt word by word from the context and the numbers.
"""
import re
from itertools import combinations

from checkers.insiemi_comune import (
    base_errors,
    choice_errors,
    cond_holds,
    els,
    no_repeats,
    number_answer_errors,
    number_option_truth,
    prop_tex,
    set_answer_errors,
    set_option_truth,
    set_tex,
)

CASE_RANGES = {
    1: {"in comune": (0.62, 0.78), "disgiunti": (0.09, 0.21), "incluso": (0.09, 0.21)},
    2: {"vuota": (0.09, 0.21), "non vuota": (0.79, 0.91)},
    3: {"formula": (0.26, 0.42), "complementare": (0.18, 0.32), "problema": (0.32, 0.50)},
    4: {"complementare": (0.52, 0.72), "intersezione": (0.28, 0.48)},
    5: {"identità": (0.26, 0.42), "unione": (0.24, 0.40), "intersezione": (0.24, 0.40)},
    6: {"solo": (0.18, 0.32), "uno solo": (0.13, 0.27), "nessuno": (0.13, 0.27), "entrambi": (0.13, 0.27), "solo con nessuno": (0.09, 0.21)},
    7: {"un solo": (0.22, 0.38), "solo": (0.18, 0.32), "esattamente due": (0.13, 0.27), "nessuno": (0.18, 0.32)},
}

# Two-set contexts: group, place, people, A does, B does, both, only A, only B, one of the two, neither, letters
CTX2 = [
    ("In una classe di", "In una classe", "studenti", "giocano a calcio", "fanno nuoto", "fanno tutti e due gli sport",
     "giocano a calcio ma non fanno nuoto", "fanno nuoto ma non giocano a calcio", "fanno un solo sport",
     "non fanno nessuno dei due sport", "C", "N"),
    ("In una classe di", "In una classe", "studenti", "suonano uno strumento", "cantano nel coro", "fanno tutte e due le cose",
     "suonano ma non cantano", "cantano ma non suonano", "fanno una sola delle due cose",
     "non fanno nessuna delle due cose", "S", "K"),
    ("In un gruppo di", "In un quartiere", "ragazzi", "hanno un cane", "hanno un gatto", "hanno sia un cane sia un gatto",
     "hanno un cane ma non un gatto", "hanno un gatto ma non un cane", "hanno uno solo dei due animali",
     "non hanno né un cane né un gatto", "K", "G"),
    ("In una scuola di lingue con", "In una scuola di lingue", "iscritti", "studiano inglese", "studiano tedesco",
     "studiano tutte e due le lingue", "studiano inglese ma non tedesco", "studiano tedesco ma non inglese",
     "studiano una sola delle due lingue", "non studiano nessuna delle due lingue", "I", "T"),
]

# Three-set contexts: group, people, the three sets, verb of the pairs, nouns, all three, only each, one, two, none
CTX3 = [
    ("In una classe di", "studenti", ("giocano a calcio", "fanno nuoto", "giocano a pallavolo"), "fanno",
     ("calcio", "nuoto", "pallavolo"), "fanno tutti e tre gli sport",
     ("fanno solo calcio", "fanno solo nuoto", "fanno solo pallavolo"), "fanno un solo sport",
     "fanno esattamente due sport", "non fanno nessuno dei tre sport"),
    ("In una scuola di lingue con", "iscritti", ("studiano inglese", "studiano francese", "studiano spagnolo"), "studiano",
     ("inglese", "francese", "spagnolo"), "studiano tutte e tre le lingue",
     ("studiano solo inglese", "studiano solo francese", "studiano solo spagnolo"), "studiano una sola lingua",
     "studiano esattamente due lingue", "non studiano nessuna delle tre lingue"),
    ("In una scuola di musica con", "allievi", ("suonano la chitarra", "suonano il pianoforte", "suonano la batteria"), "suonano",
     ("chitarra", "pianoforte", "batteria"), "suonano tutti e tre gli strumenti",
     ("suonano solo la chitarra", "suonano solo il pianoforte", "suonano solo la batteria"), "suonano un solo strumento",
     "suonano esattamente due strumenti", "non suonano nessuno dei tre strumenti"),
]


def array(rows):
    return "\\begin{array}{l} " + " \\\\ ".join(rows) + " \\end{array}"


def prose_of(tex):
    """The words of a word problem: every \\text{} line, joined; None if something else is in the problem."""
    bodies = re.findall(r"\\text\{([^{}]*)\}", tex)
    rest = re.sub(r"\\text\{[^{}]*\}", "", tex)
    rest = rest.replace("\\begin{array}{l}", "").replace("\\end{array}", "").replace("\\\\", "")
    if rest.strip():
        return None
    return " ".join(b.strip() for b in bodies)


# ---------------------------------------------------------------------------
# Expressions: codes like c(u(A,B)), evaluated on sets


def parse(code):
    pos = 0

    def node():
        nonlocal pos
        if code[pos] in "AB" and (pos + 1 == len(code) or code[pos + 1] in ",)"):
            pos += 1
            return ("set", code[pos - 1])
        op = code[pos]
        if code[pos + 1] != "(":
            raise ValueError(f"bad code {code}")
        pos += 2
        if op == "c":
            x = node()
            out = ("c", x)
        elif op in "uim":
            l = node()
            if code[pos] != ",":
                raise ValueError(f"bad code {code}")
            pos += 1
            r = node()
            out = (op, l, r)
        else:
            raise ValueError(f"bad operator in {code}")
        if code[pos] != ")":
            raise ValueError(f"bad code {code}")
        pos += 1
        return out

    tree = node()
    if pos != len(code):
        raise ValueError(f"trailing text in {code}")
    return tree


TEX = {"u": "\\cup", "i": "\\cap", "m": "\\setminus"}


def tex(e):
    if e[0] == "set":
        return e[1]
    if e[0] == "c":
        return f"\\overline{{{tex(e[1])}}}"

    def wrap(x):
        return f"({tex(x)})" if x[0] in TEX else tex(x)

    return f"{wrap(e[1])} {TEX[e[0]]} {wrap(e[2])}"


def ev(e, U, sets):
    if e[0] == "set":
        return sets[e[1]]
    if e[0] == "c":
        return U - ev(e[1], U, sets)
    l, r = ev(e[1], U, sets), ev(e[2], U, sets)
    return {"u": l | r, "i": l & r, "m": l - r}[e[0]]


SMALL_U = frozenset({1, 2, 3})
SUBSETS = [frozenset(c) for k in range(4) for c in combinations(sorted(SMALL_U), k)]


def table(e):
    """The expression on every pair of subsets of {1, 2, 3}: two expressions with the same table are
    equal for all sets (each Venn zone of two sets gets its own element)."""
    return tuple(frozenset(ev(e, SMALL_U, {"A": a, "B": b})) for a in SUBSETS for b in SUBSETS)


# ---------------------------------------------------------------------------
# Properties


def members(p, xs):
    """Elements of xs that satisfy the property (which may describe an infinite set)."""
    return {x for x in xs if all(cond_holds(c, x) for c in p["conds"])}


def finite_elements(p):
    out = [x for x in range(0, 301) if all(cond_holds(c, x) for c in p["conds"])]
    if not out or max(out) > 200:
        raise ValueError(f"property not finite: {prop_tex(p)}")
    return set(out)


def is_finite_kind(p):
    return len(p["conds"]) == 1 and (p["conds"][0]["t"] == "div" or (p["conds"][0]["t"] == "range" and p["conds"][0].get("hi") is not None))


# ---------------------------------------------------------------------------


def check(sample):
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    prob = sample["problem"]
    kind = p.get("case") or p.get("variant")
    for t in [sample.get("solution", "")] + list(sample.get("steps", [])):
        if "\\begin" in t:
            errs.append(f"environment in a solution line: {t}")
    truth = None
    if lvl == 1:
        A, B = set(els(p["A"])), set(els(p["B"]))
        if p["asked"] not in ("A-B", "B-A"):
            return errs + ["asked must be A-B or B-A"], None
        (X, Y, name) = (A, B, "A \\setminus B") if p["asked"] == "A-B" else (B, A, "B \\setminus A")
        truth = X - Y
        actual = "incluso" if X <= Y else "disgiunti" if not X & Y else "in comune"
        if kind != actual:
            errs.append(f"case {kind} but the sets are {actual}")
        if not all(2 <= len(s) <= 6 and s <= set(range(1, 13)) for s in (A, B)):
            errs.append("sets of 2-6 numbers from 1 to 12")
        if prob != array([f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", f"{name} = \\ ?"]):
            errs.append("problem does not show A, B and the difference asked")
    elif lvl == 2:
        pA, pB = p["A"], p["B"]
        if pA["dom"] != "N" or pB["dom"] != "N":
            errs.append("properties must be in N")
        (pX, pY, name) = (pA, pB, "A \\setminus B") if p["asked"] == "A-B" else (pB, pA, "B \\setminus A")
        if not is_finite_kind(pX):
            return errs + ["the first set of the difference must be finite (x < n, x <= n, divisors)"], kind
        X = finite_elements(pX)
        truth = X - members(pY, X)
        actual = "vuota" if not truth else "non vuota"
        if kind != actual:
            errs.append(f"case {kind} but the difference is {actual}")
        if truth and (not X & members(pY, X) or not 2 <= len(truth) <= 9):
            errs.append("a non-empty difference needs something removed and 2-9 elements left")
        if prob != array([f"A = {prop_tex(pA)} \\qquad B = {prop_tex(pB)}", f"{name} = \\ ?"]):
            errs.append("problem does not show the two properties and the difference asked")
    elif lvl == 3:
        v = p["variant"]
        if v == "formula":
            a, b, i = int(p["a"]), int(p["b"]), int(p["i"])
            x, name = (a, "A \\setminus B") if p["asked"] == "A-B" else (b, "B \\setminus A")
            value = x - i
            if not 1 <= i < min(a, b):
                errs.append("need 1 <= |A ∩ B| < |A|, |B|")
            if prob != array([f"|A| = {a} \\qquad |B| = {b} \\qquad |A \\cap B| = {i}", f"|{name}| = \\ ?"]):
                errs.append("problem does not show the data")
            given = (a, b, i)
        elif v == "complementare":
            n, a = int(p["u"]), int(p["a"])
            value = n - a
            if not 0 < a < n:
                errs.append("need 0 < |A| < |U|")
            if prob != array([f"|U| = {n} \\qquad |A| = {a}", "|\\overline{A}| = \\ ?"]):
                errs.append("problem does not show the data")
            given = (n, a)
        elif v == "problema":
            c = CTX2[int(p["context"])]
            a, b, both = int(p["a"]), int(p["b"]), int(p["both"])
            only_a, only_b = a - both, b - both
            value = only_a if p["which"] == "A" else only_b
            if min(only_a, only_b) < 2 or both < 2:
                errs.append("zones of the diagram too small")
            q = c[6] if p["which"] == "A" else c[7]
            want = f"{c[1]} {a} {c[2]} {c[3]}, {b} {c[4]} e {both} {c[5]}. Quanti {c[2]} {q}?"
            if prose_of(prob) != want:
                errs.append(f"problem text is not: {want}")
            given = (a, b, both)
        else:
            return errs + [f"unknown variant {v}"], None
        if value in given:
            errs.append("the answer is a number already in the text")
        if value < 1:
            errs.append("count below 1")
        errs += number_answer_errors(sample, value)
        errs += choice_errors(sample.get("choice"), number_option_truth(value))
        return errs, kind
    elif lvl == 4:
        U = set(els(p["U"]))
        if U != set(range(1, len(U) + 1)) or not 8 <= len(U) <= 12:
            errs.append("U must be {1, ..., n} with n from 8 to 12")
        A = set(els(p["A"]))
        if p["variant"] == "complementare":
            truth = U - A
            if not A < U or len(A) < 2 or len(truth) < 3:
                errs.append("A must be a proper part of U, leaving at least 3 elements")
            rows = [f"U = {set_tex(U)}", f"A = {set_tex(A)}", "\\overline{A} = \\ ?"]
        else:
            B = set(els(p["B"]))
            truth = A & (U - B)
            if truth != A - B:
                errs.append("A ∩ B̄ differs from A \\ B")
            if not (A | B) <= U or not truth or not A & B:
                errs.append("A, B inside U, overlapping, with A ∩ B̄ not empty")
            rows = [f"U = {set_tex(U)}", f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", "A \\cap \\overline{B} = \\ ?"]
        if prob != array(rows):
            errs.append("problem does not show U, the sets and the question")
    elif lvl == 5:
        if p["variant"] == "identità":
            lhs, rhs = parse(p["lhs"]), parse(p["rhs"])
            if table(lhs) != table(rhs):
                errs.append("params.rhs is not equal to lhs for all sets")
            if prob != f"{tex(lhs)} = \\ ?":
                errs.append("problem does not show the left side")
            if sample.get("solution") != f"{tex(lhs)} = {tex(rhs)}":
                errs.append("solution does not state the identity")
            tables = []

            def grade(o):
                e = parse(o["values"][0])
                if len(o["values"]) != 1 or o["latex"] != tex(e):
                    raise ValueError(f"option latex {o['latex']} != {tex(e)}")
                tables.append(table(e))
                return table(e) == table(lhs)

            errs += choice_errors(sample["answer"], grade)
            if sample.get("choice") != sample["answer"]:
                errs.append("choice differs from the answer")
            if len(set(tables)) != len(tables):
                errs.append("two options are the same set for all A and B")
            return errs, kind
        U, A, B = (set(els(p[k])) for k in ("U", "A", "B"))
        if U != set(range(1, len(U) + 1)) or not 8 <= len(U) <= 12 or not (A | B) < U or not A & B:
            errs.append("U = {1..n}, n 8-12; A and B overlapping, not covering U")
        if p["variant"] == "unione":
            truth, name = U - (A | B), "\\overline{A \\cup B}"
            law = (U - A) & (U - B)
            wrong_law = (U - A) | (U - B)
        elif p["variant"] == "intersezione":
            truth, name = U - (A & B), "\\overline{A \\cap B}"
            law = (U - A) | (U - B)
            wrong_law = (U - A) & (U - B)
        else:
            return errs + [f"unknown variant {p['variant']}"], None
        if law != truth:
            errs.append("De Morgan fails?")
        if wrong_law == truth:
            errs.append("the wrong law gives the same set: the exercise does not tell them apart")
        if prob != array([f"U = {set_tex(U)}", f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", f"{name} = \\ ?"]):
            errs.append("problem does not show U, A, B and the complement asked")
    elif lvl == 6:
        c = CTX2[int(p["context"])]
        total, a, b, both, none = (int(p[k]) for k in ("total", "a", "b", "both", "none"))
        oa, ob = a - both, b - both
        if min(oa, ob, both, none) < 2 or oa + ob + both + none != total or total > 60:
            errs.append("the four zones (each at least 2) do not add up to the total")
        v = p["variant"]
        mine = oa if p["which"] == "A" else ob
        only_q = c[6] if p["which"] == "A" else c[7]
        table6 = {
            "solo": (mine, only_q, False),
            "uno solo": (oa + ob, c[8], False),
            "nessuno": (none, c[9], False),
            "entrambi": (both, c[5], True),
            "solo con nessuno": (mine, only_q, True),
        }
        if v not in table6:
            return errs + [f"unknown variant {v}"], None
        value, q, backwards = table6[v]
        fourth = f"{none} {c[9]}" if backwards else f"{both} {c[5]}"
        want = f"{c[0]} {total} {c[2]}, {a} {c[3]}, {b} {c[4]} e {fourth}. Quanti {c[2]} {q}?"
        if prose_of(prob) != want:
            errs.append(f"problem text is not: {want}")
        given = (total, a, b, none if backwards else both)
        if value in given or value < 2:
            errs.append("the answer is in the text or below 2")
        errs += number_answer_errors(sample, value)
        errs += choice_errors(sample.get("choice"), number_option_truth(value))
        return errs, kind
    elif lvl == 7:
        c = CTX3[int(p["context"])]
        o = [int(v) for v in p["only"]]
        p01, p02, p12, t, none = (int(p[k]) for k in ("p01", "p02", "p12", "t", "none"))
        # the sets as zones: each zone gets its own people, then everything is counted again from the sets
        people = {}
        k = 0
        zones = {(0,): o[0], (1,): o[1], (2,): o[2], (0, 1): p01, (0, 2): p02, (1, 2): p12, (0, 1, 2): t, (): none}
        for z, count in zones.items():
            for _ in range(count):
                people[k] = set(z)
                k += 1
        S = [{q for q, m in people.items() if j in m} for j in range(3)]
        total = len(people)
        n = [len(s) for s in S]
        i01, i02, i12 = len(S[0] & S[1]), len(S[0] & S[2]), len(S[1] & S[2])
        i012 = len(S[0] & S[1] & S[2])
        if min(o) < 2 or min(p01, p02, p12) < 1 or t < 2 or none < 2 or total > 70:
            errs.append("zones out of range")
        v = p["variant"]
        w = int(p["which"])
        values = {
            "un solo": (sum(1 for m in people.values() if len(m) == 1), c[7]),
            "solo": (len(S[w] - S[(w + 1) % 3] - S[(w + 2) % 3]), c[6][w]),
            "esattamente due": (sum(1 for m in people.values() if len(m) == 2), c[8]),
            "nessuno": (sum(1 for m in people.values() if not m), c[9]),
        }
        if v not in values:
            return errs + [f"unknown variant {v}"], None
        value, q = values[v]
        x, y, z3 = c[4]
        want = (f"{c[0]} {total} {c[1]}, {n[0]} {c[2][0]}, {n[1]} {c[2][1]} e {n[2]} {c[2][2]}. "
                f"{i01} {c[3]} {x} e {y}, {i02} {x} e {z3}, {i12} {y} e {z3}, e {i012} {c[5]}. Quanti {c[1]} {q}?")
        if prose_of(prob) != want:
            errs.append(f"problem text is not: {want}")
        if value in (total, *n, i01, i02, i12, i012) or value < 2:
            errs.append("the answer is in the text or below 2")
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
