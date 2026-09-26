"""Checker for insiemi-operazioni, from specs/exercises/insiemi-operazioni.md.

Intersections, differences, complements and expressions are recomputed with Python sets (the
expression tree is evaluated and re-rendered here); the Cartesian product with itertools.product;
the diagram problems from the four zones, which must add up to the total.
"""
from itertools import product

from checkers.insiemi_comune import (
    base_errors,
    choice_errors,
    els,
    list_tex,
    no_repeats,
    number_answer_errors,
    number_option_truth,
    prose,
    set_answer_errors,
    set_option_truth,
    set_tex,
)

CASE_RANGES = {
    1: {"in comune": (0.78, 0.92), "disgiunti": (0.08, 0.22)},
    2: {"in comune": (0.67, 0.83), "disgiunti": (0.06, 0.18), "incluso": (0.06, 0.18)},
    4: {"coppie": (0.60, 0.80), "quante": (0.20, 0.40)},
    6: {"solo A": (0.22, 0.38), "solo B": (0.13, 0.27), "uno solo": (0.18, 0.32), "nessuno": (0.18, 0.32)},
}

OPS = {"cup": "\\cup", "cap": "\\cap", "minus": "\\setminus"}
# (A, B, both) as the problems say them, then the four questions
CONTEXTS = [
    ("giocano a calcio", "fanno nuoto", "fanno tutti e due gli sport", {"solo A": "giocano solo a calcio", "solo B": "fanno solo nuoto", "uno solo": "fanno uno solo dei due sport", "nessuno": "non fanno nessuno dei due sport"}),
    ("studiano francese", "studiano tedesco", "studiano tutte e due le lingue", {"solo A": "studiano solo francese", "solo B": "studiano solo tedesco", "uno solo": "studiano una sola delle due lingue", "nessuno": "non studiano nessuna delle due lingue"}),
    ("leggono fumetti", "guardano serie TV", "fanno tutte e due le cose", {"solo A": "leggono solo fumetti", "solo B": "guardano solo serie TV", "uno solo": "fanno una sola delle due cose", "nessuno": "non fanno nessuna delle due cose"}),
    ("fanno yoga", "fanno pesi", "fanno tutte e due le attività", {"solo A": "fanno solo yoga", "solo B": "fanno solo pesi", "uno solo": "fanno una sola delle due attività", "nessuno": "non fanno nessuna delle due attività"}),
]


def array(rows):
    return "\\begin{array}{l} " + " \\\\ ".join(rows) + " \\end{array}"


def ex_tex(e):
    if e["t"] == "set":
        return e["name"]
    if e["t"] == "comp":
        return f"\\overline{{{ex_tex(e['x'])}}}"

    def wrap(x):
        return f"({ex_tex(x)})" if x["t"] == "bin" else ex_tex(x)

    return f"{wrap(e['l'])} {OPS[e['op']]} {wrap(e['r'])}"


def ex_eval(e, sets):
    if e["t"] == "set":
        return sets[e["name"]]
    if e["t"] == "comp":
        return sets["U"] - ex_eval(e["x"], sets)
    l, r = ex_eval(e["l"], sets), ex_eval(e["r"], sets)
    return {"cup": l | r, "cap": l & r, "minus": l - r}[e["op"]]


def pair_tex(p, braces):
    return f"\\{{{p[0]}, {p[1]}\\}}" if braces else f"({p[0]}, {p[1]})"


def check(sample):
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    prob = sample["problem"]
    kind = p.get("case") or p.get("variant")
    truth = None
    if lvl in (1, 2):
        A, B = set(els(p["A"])), set(els(p["B"]))
        if lvl == 1:
            truth, asked = A & B, "A \\cap B"
            actual = "disgiunti" if not A & B else "in comune"
        else:
            truth, asked = (A - B, "A \\setminus B") if p["asked"] == "A-B" else (B - A, "B \\setminus A")
            actual = "incluso" if A <= B else "disgiunti" if not A & B else "in comune"
            if p["asked"] not in ("A-B", "B-A"):
                errs.append("asked must be A-B or B-A")
        if kind != actual:
            errs.append(f"case {kind} but the sets are {actual}")
        if prob != array([f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", f"{asked} = \\ ?"]):
            errs.append("problem does not show A, B and the operation asked")
    elif lvl == 3:
        U, A = set(els(p["U"])), set(els(p["A"]))
        if U != set(range(1, len(U) + 1)) or not 8 <= len(U) <= 12 or not A < U:
            errs.append("U must be {1, ..., n}, n from 8 to 12, with A inside")
        if p["asked"] == "A":
            truth = U - A
            rows = [f"U = {set_tex(U)}", f"A = {set_tex(A)}", "\\overline{A} = \\ ?"]
        else:
            B = set(els(p["B"]))
            truth = U - B
            rows = [f"U = {set_tex(U)}", f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", "\\overline{B} = \\ ?"]
            if not B < U or A == B:
                errs.append("B must be inside U and different from A")
        if prob != array(rows):
            errs.append("problem does not show U, the sets and the complement asked")
    elif lvl == 4:
        if p["variant"] == "quante":
            X, Y = els(p["A"]), els(p["B"])
            value = len(list(product(X, Y)))
            if prob != array([f"A = {set_tex(X)} \\qquad B = {set_tex(Y)}", "|A \\times B| = \\ ?"]):
                errs.append("problem does not show A and B")
            errs += number_answer_errors(sample, value)
            errs += choice_errors(sample.get("choice"), number_option_truth(value))
            return errs, kind
        P, Q = els(p["P"]), els(p["Q"])
        X, Y, asked = (P, Q, "P \\times Q") if p["asked"] == "PxQ" else (Q, P, "Q \\times P")
        truth_pairs = {(str(x), str(y)) for x, y in product(X, Y)}
        if len(truth_pairs) > 6:
            errs.append("more than 6 pairs")
        if prob != array([f"P = {set_tex(P)} \\qquad Q = {set_tex(Q)}", f"{asked} = \\ ?"]):
            errs.append("problem does not show P, Q and the product asked")

        def grade(o):
            braces = [v.startswith("~") for v in o["values"]]
            if len(set(braces)) > 1:
                raise ValueError("mixed pairs and sets")
            pairs = [tuple(v.lstrip("~").split(":")) for v in o["values"]]
            # more than four pairs do not fit the answer button: two lines
            tex = list_tex([pair_tex(q, braces[0]) for q in pairs], split=len(pairs) > 4)
            if o["latex"] != tex:
                raise ValueError(f"latex {o['latex']} != {tex}")
            return not braces[0] and set(pairs) == truth_pairs and len(pairs) == len(truth_pairs)

        errs += choice_errors(sample["answer"], grade)
        return errs, kind
    elif lvl == 5:
        sets = {k: set(els(v)) for k, v in p["sets"].items()}
        e = p["expr"]
        truth = ex_eval(e, sets)
        if not truth:
            errs.append("empty result")
        if "U" in sets:
            rows = [f"U = {set_tex(sets['U'])}", f"A = {set_tex(sets['A'])} \\qquad B = {set_tex(sets['B'])}"]
            if not (sets["A"] | sets["B"]) < sets["U"]:
                errs.append("A and B must leave something of U outside")
        else:
            rows = [f"A = {set_tex(sets['A'])} \\qquad B = {set_tex(sets['B'])}", f"C = {set_tex(sets['C'])}"]
        if prob != array(rows + [f"{ex_tex(e)} = \\ ?"]):
            errs.append("problem does not show the sets and the expression")
        kind = None
    elif lvl == 6:
        total, a, b, both, none = (int(p[k]) for k in ("total", "a", "b", "both", "none"))
        if min(a - both, b - both, both, none) < 0 or (a - both) + (b - both) + both + none != total:
            errs.append("the four zones do not add up to the total")
        value = {"solo A": a - both, "solo B": b - both, "uno solo": a + b - 2 * both, "nessuno": none}.get(kind)
        if value is None:
            return errs + [f"unknown variant {kind}"], None
        wa, wb, wboth, questions = CONTEXTS[int(p["context"])]
        text = prose(prob)
        if not all(g in text for g in (f" {total} ", f" {a} {wa}", f" {b} {wb}", f" {both} {wboth}")) or questions[kind] + "?" not in text:
            errs.append("problem does not state the data and the question in params")
        if value in (total, a, b, both):
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
