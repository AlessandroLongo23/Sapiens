"""Checker for sottoinsiemi-ugualianza, from specs/exercises/sottoinsiemi-ugualianza.md.

Inclusions and equalities are evaluated with Python sets; subsets are counted with
itertools.combinations; statements are re-rendered and compared with the option LaTeX. Sets in
params are in the order the problem shows them, and the problem must show exactly that.
"""
from itertools import combinations

from checkers.insiemi_comune import (
    base_errors,
    choice_errors,
    el,
    el_tex,
    els,
    eval_stmt,
    number_answer_errors,
    number_option_truth,
    prop_elements,
    prop_tex,
    set_option_truth,
    set_tex,
    stmt_tex,
    tf_truth,
)

CASE_RANGES = {
    1: {"incluso": (0.28, 0.42), "uguali": (0.10, 0.20), "un elemento fuori": (0.28, 0.42), "al contrario": (0.10, 0.20)},
    2: {"vera": (0.35, 0.65), "falsa": (0.35, 0.65)},
    3: {"vera": (0.35, 0.65), "falsa": (0.35, 0.65)},  # ask; the relation is checked below
    4: {"tutti": (0.28, 0.42), "con k elementi": (0.23, 0.37), "proprio": (0.28, 0.42)},
    5: {"parola": (0.32, 0.48), "quadrato": (0.22, 0.38), "naturali": (0.22, 0.38)},
}


def in_order(xs):
    """A set written in the given order (the problem may show it unsorted)."""
    return "\\{" + ", ".join(el_tex(e) for e in xs) + "\\}"


def statement_grader(sets, ask, allowed_ops):
    def grade(o):
        op, l, r = o["values"]
        if op not in allowed_ops:
            raise ValueError(f"operator {op} not allowed here")
        if o["latex"] != stmt_tex(op, l, r, sets):
            raise ValueError(f"latex {o['latex']} != {stmt_tex(op, l, r, sets)}")
        if op in ("subeq", "sub", "nsubeq") and l.startswith("e:"):
            raise ValueError("inclusion with an element on the left makes no sense")
        return eval_stmt(op, l, r, sets) == (ask == "vera")

    return grade


def check(sample):
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    ans = sample["answer"]
    prob = sample["problem"]
    kind = None
    if lvl == 1:
        A, B = els(p["A"]), els(p["B"])
        kind = p.get("case")
        if prob != f"\\begin{{array}}{{l}} A = {in_order(A)} \\qquad B = {in_order(B)} \\\\ A \\subseteq B \\end{{array}}":
            errs.append("problem does not show A, B and A ⊆ B")
        if len(set(A)) != len(A) or len(set(B)) != len(B):
            errs.append("repeated elements")
        truth = set(A) <= set(B)
        expected = {"incluso": True, "uguali": True, "un elemento fuori": False, "al contrario": False}.get(kind)
        if expected is None or expected != truth:
            errs.append(f"case {kind} but A ⊆ B is {truth}")
        if kind == "uguali" and (set(A) != set(B) or A == B):
            errs.append("equal sets must be shown in a different order")
        if kind == "incluso" and set(A) == set(B):
            errs.append("case incluso with A = B")
        errs += choice_errors(ans, tf_truth(truth), count=2)
    elif lvl in (2, 3):
        ask = p["ask"]
        kind = ask
        sets = p["sets"]
        if f"Quale affermazione è {ask}?" not in prob:
            errs.append("problem does not ask the question in params.ask")
        for name, xs in sets.items():
            if f"{name} = {in_order(els(xs))}" not in prob:
                errs.append(f"problem does not show {name}")
            if len(set(xs)) != len(xs):
                errs.append("repeated elements")
        ops = ("in", "notin", "subeq") if lvl == 2 else ("subeq", "sub", "eq")
        errs += choice_errors(ans, statement_grader(sets, ask, ops))
        if lvl == 3:
            if sum(1 for o in ans.get("options", []) if o["values"][1] in ("N", "Z", "Q")) > 1:
                errs.append("more than one statement about N, Z, Q")
            A, B = set(els(sets["A"])), set(els(sets["B"]))
            rel = {"stretta": A < B, "uguali": A == B and els(sets["A"]) != els(sets["B"]), "al contrario": B < A}.get(p.get("case"))
            if not rel:
                errs.append(f"case {p.get('case')} does not match A and B")
    elif lvl == 4:
        A = els(p["A"])
        v = p["variant"]
        kind = v
        if prob != f"A = {set_tex(A)}":
            errs.append("problem does not show A")
        subsets = [set(c) for k in range(len(A) + 1) for c in combinations(A, k)]
        if v == "tutti":
            if not 2 <= len(A) <= 3:
                errs.append("A must have 2 or 3 elements")
            truth = len(subsets)
            errs += number_answer_errors(sample, truth)
            errs += choice_errors(sample.get("choice"), number_option_truth(truth))
        elif v == "con k elementi":
            k = int(p["k"])
            if not 3 <= len(A) <= 4 or not 1 <= k < len(A):
                errs.append("need |A| 3 or 4 and 1 <= k < |A|")
            if sample["prompt"] != f"Quanti sottoinsiemi di A hanno {f'{k} elementi' if k > 1 else 'un elemento'}?":
                errs.append("prompt does not say k")
            truth = sum(1 for s in subsets if len(s) == k)
            errs += number_answer_errors(sample, truth)
            errs += choice_errors(sample.get("choice"), number_option_truth(truth))
        elif v == "proprio":
            if sample["prompt"] != "Quale di questi insiemi è un sottoinsieme proprio di A?":
                errs.append("prompt does not ask for a proper subset")

            def grade(o):
                xs = set(els(o["values"]))
                if o["latex"] != set_tex(xs):
                    raise ValueError("latex does not match values")
                if not xs:
                    raise ValueError("the empty set is proper or improper depending on the book: not an option")
                return xs <= set(A) and xs != set(A)

            errs += choice_errors(ans, grade)
        else:
            errs.append(f"unknown variant {v}")
    elif lvl == 5:
        v = p["variant"]
        kind = v
        if v == "parola":
            w = p["word"]
            truth = set(w)
            if f"“{w}”" not in prob:
                errs.append("problem does not show the word")
            if len(truth) == len(w):
                errs.append("word without repeated letters")
        else:
            truth = set(prop_elements(p["prop"]))
            if prob != f"A = {prop_tex(p['prop'])}":
                errs.append("problem does not show the property")
        if sample["prompt"] != "Quale di questi insiemi è uguale ad A?":
            errs.append("prompt does not ask for equality")
        errs += choice_errors(ans, set_option_truth(truth))
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
