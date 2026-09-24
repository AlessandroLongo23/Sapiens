"""Checker for numeri-naturali-operazioni, from specs/exercises/numeri-naturali-operazioni.md.

Level 1: parses both sides of the equality, checks it is true and recognises the property from the
shape of the two sides (exactly one property must match). Level 2: recomputes 0 : n, n : 0, 0 : 0
and the division with remainder. Levels 3-6: parses the problem LaTeX, checks it equals
params.expr, evaluates it in N with exact integers and checks sizes, brackets and priorities.
"""
import re

from checkers._naturali import (
    NotNatural,
    check_choice_numbers,
    evaluate,
    group_height,
    latex_to_ascii,
    left_to_right,
    literals,
    parse,
    top_terms,
    walk,
)

CASE_RANGES = {
    1: {
        "commutativa": (0.10, 0.25),
        "associativa": (0.10, 0.25),
        "dissociativa": (0.08, 0.22),
        "distributiva": (0.10, 0.25),
        "invariantiva": (0.08, 0.25),
        "neutro": (0.03, 0.15),
        "assorbente": (0.03, 0.15),
    },
    2: {"zero-diviso": (0.05, 0.16), "diviso-zero": (0.05, 0.16), "zero-zero": (0.05, 0.16), "resto": (0.60, 0.80)},
}

# level: (bracket kinds, max value, min numbers, max numbers)
EXPR = {3: (0, 150, 3, 6), 4: (1, 200, 4, 7), 5: (2, 200, 5, 9), 6: (3, 250, 6, 11)}
MAX_LIT = 60
MAX_FACTOR = 10


def num(x):
    return x[1] if x[0] == "n" else None


def flat(x, o):
    """Operands of a chain of the single operation o without brackets, else None."""
    if x[0] == "n":
        return [x[1]]
    if x[0] == "op" and x[1] == o:
        left, right = flat(x[2], o), flat(x[3], o)
        if left is not None and right is not None:
            return left + right
    return None


def combine(o, a, b):
    return a + b if o == "+" else a * b


def classify(L, R):
    found = set()
    for A, B in ((L, R), (R, L)):
        n = num(B)
        if n is not None and A[0] == "op":
            ops = (num(A[2]), num(A[3]))
            if A[1] == "+" and n in ops and 0 in ops and ops != (0, 0) and sorted(ops) == sorted((n, 0)):
                found.add("neutro")
            if A[1] == "*" and sorted(ops) == sorted((n, 1)) and n != 1:
                found.add("neutro")
    if num(R) == 0 and L[0] == "op" and L[1] == "*" and 0 in (num(L[2]), num(L[3])):
        found.add("assorbente")
    for o in "+*":
        fl, fr = flat(L, o), flat(R, o)
        if fl and fr and len(fl) >= 2 and len(fr) >= 2:
            if len(fl) == len(fr) and sorted(fl) == sorted(fr) and fl != fr:
                found.add("commutativa")
            if len(fl) == 3 and len(fr) == 2 and (fr == [fl[0], combine(o, fl[1], fl[2])] or fr == [combine(o, fl[0], fl[1]), fl[2]]):
                found.add("associativa")
            if len(fl) == 2 and len(fr) == 3 and (fl == [fr[0], combine(o, fr[1], fr[2])] or fl == [combine(o, fr[0], fr[1]), fr[2]]):
                found.add("dissociativa")
        # (a o b) o c = a o (b o c)
        if L[0] == "op" and L[1] == o and L[2][0] == "g" and R[0] == "op" and R[1] == o and R[3][0] == "g":
            inner_l, inner_r = L[2][2], R[3][2]
            if flat(inner_l, o) and flat(inner_r, o) and len(flat(inner_l, o)) == 2 and len(flat(inner_r, o)) == 2:
                a, b = flat(inner_l, o)
                b2, c2 = flat(inner_r, o)
                if num(R[2]) == a and b2 == b and num(L[3]) == c2:
                    found.add("associativa")
    # a * (b +- c) = a*b +- a*c
    if L[0] == "op" and L[1] == "*" and num(L[2]) is not None and L[3][0] == "g":
        inner = L[3][2]
        a = num(L[2])
        if inner[0] == "op" and inner[1] in "+-" and num(inner[2]) is not None and num(inner[3]) is not None:
            b, c = num(inner[2]), num(inner[3])
            if R[0] == "op" and R[1] == inner[1] and flat(R[2], "*") == [a, b] and flat(R[3], "*") == [a, c]:
                found.add("distributiva")
    # (a + b) : c = a : c + b : c
    if L[0] == "op" and L[1] == ":" and L[2][0] == "g" and num(L[3]) is not None:
        inner, c = L[2][2], num(L[3])
        if inner[0] == "op" and inner[1] == "+" and num(inner[2]) is not None and num(inner[3]) is not None:
            a, b = num(inner[2]), num(inner[3])
            if R == ("op", "+", ("op", ":", ("n", a), ("n", c)), ("op", ":", ("n", b), ("n", c))):
                found.add("distributiva")
    # a - b = (a + n) - (b + n);  a : b = (a * n) : (b * n)
    def pair(x, o):
        if x[0] == "op" and x[1] == o and num(x[2]) is not None and num(x[3]) is not None:
            return num(x[2]), num(x[3])
        return None

    ps, qs = pair(L, "-"), pair(R, "-")
    if ps and qs and qs[0] - ps[0] == qs[1] - ps[1] != 0:
        found.add("invariantiva")
    ps, qs = pair(L, ":"), pair(R, ":")
    if ps and qs and ps != qs and ps[0] * qs[1] == ps[1] * qs[0]:
        found.add("invariantiva")
    return found


def check_property(sample, errs):
    p = sample["params"]
    lhs, rhs = parse(p["lhs"]), parse(p["rhs"])
    if latex_to_ascii(sample["problem"]) != f"{p['lhs']}={p['rhs']}":
        errs.append(f"problem {sample['problem']!r} does not match params {p['lhs']}={p['rhs']}")
    try:
        if evaluate(lhs) != evaluate(rhs):
            errs.append("the equality is false")
    except NotNatural as e:
        errs.append(f"not in N: {e}")
    found = classify(lhs, rhs)
    if len(found) != 1:
        errs.append(f"properties recognised: {sorted(found)} (need exactly one)")
        return None
    prop = next(iter(found))
    if p.get("property") != prop:
        errs.append(f"params.property {p.get('property')} but the equality shows {prop}")
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer must be a choice")
    else:
        check_choice_numbers(ans, prop, errs)
    if sample.get("choice") is not None:
        check_choice_numbers(sample["choice"], prop, errs)
    return prop


def check_division(sample, errs):
    p = sample["params"]
    a, b = int(p["a"]), int(p["b"])
    if latex_to_ascii(sample["problem"]) != f"{a}:{b}":
        errs.append("problem does not match params")
    if b == 0 and a == 0:
        kind, truth = "zero-zero", "indeterminata"
    elif b == 0:
        kind, truth = "diviso-zero", "impossibile"
    elif a == 0:
        kind, truth = "zero-diviso", "0"
    else:
        q, r = divmod(a, b)
        kind, truth = "resto", f"{q}|{r}"
        if not 3 <= b <= 12 or q > 15:
            errs.append(f"division {a} : {b} out of size (divisor 3-12, quotient up to 15)")
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but the division is {kind}")
    if kind in ("zero-diviso", "diviso-zero") and not 2 <= max(a, b) <= 30:
        errs.append("number with the zero out of 2-30")
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer must be a choice")
    else:
        check_choice_numbers(ans, truth, errs)
    if sample.get("choice") is not None:
        check_choice_numbers(sample["choice"], truth, errs)
    return kind


def check_expression(sample, errs):
    lvl = sample["level"]
    kinds, max_val, min_n, max_n = EXPR[lvl]
    p = sample["params"]
    asc = latex_to_ascii(sample["problem"])
    if asc != p["expr"]:
        errs.append(f"problem {asc} != params.expr {p['expr']}")
    x = parse(asc)
    ops = []
    try:
        value = evaluate(x, ops)
    except NotNatural as e:
        errs.append(f"a step leaves N: {e}")
        return
    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(value):
        errs.append(f"answer {ans.get('value')} != {value}")
    if value < 1:
        errs.append("result must be at least 1")
    for o, a, b, r in ops:
        if r > max_val:
            errs.append(f"intermediate {r} > {max_val}")
        if o == "*" and not 2 <= min(a, b) <= MAX_FACTOR:
            errs.append(f"product {a} * {b}: smaller factor out of 2-{MAX_FACTOR}")
        if o == ":" and not 2 <= b <= MAX_FACTOR:
            errs.append(f"divisor {b} out of 2-{MAX_FACTOR}")
        if o in "+-" and b == 0:
            errs.append("adding or subtracting 0")
    lits = literals(x)
    if max(lits) > MAX_LIT:
        errs.append(f"number {max(lits)} > {MAX_LIT} in the text")
    if not min_n <= len(lits) <= max_n:
        errs.append(f"{len(lits)} numbers, expected {min_n}-{max_n}")
    h, herrs = group_height(x)
    errs.extend(herrs)
    if h != kinds - 1:
        errs.append(f"bracket height {h}, expected {kinds - 1}")
    nodes = list(walk(x))
    if not any(n[0] == "op" and n[1] in "*:" for n in nodes) or not any(n[0] == "op" and n[1] in "+-" for n in nodes):
        errs.append("needs both * or : and + or -")
    for n in nodes:
        if n[0] == "g" and top_terms(n[2]) < 2:
            errs.append("bracket without a sum or difference inside")
    if lvl == 3 and left_to_right(x) == value:
        errs.append("left to right gives the same value: priorities not tested")
    if lvl >= 4 and left_to_right(x, drop_brackets=True) == value:
        errs.append("without brackets the value is the same: brackets not tested")
    ch = sample.get("choice")
    check_choice_numbers(ch, str(value), errs)
    if ch:
        for o in ch.get("options", []):
            if len(o["values"]) != 1 or not re.fullmatch(r"\d+", o["values"][0]):
                errs.append(f"option {o['values']} is not a natural number")


def check(sample):
    errs = []
    lvl = sample["level"]
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or solution")
    kind = None
    if lvl == 1:
        kind = check_property(sample, errs)
    elif lvl == 2:
        kind = check_division(sample, errs)
    elif lvl in EXPR:
        check_expression(sample, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
