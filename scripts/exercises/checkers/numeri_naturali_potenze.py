"""Checker for numeri-naturali-potenze, from specs/exercises/numeri-naturali-potenze.md.

Parses the problem LaTeX (not the generator's params) and evaluates it with exact integers,
refusing anything outside N; then checks the shape each level asks for: one power (level 1), a
chain of powers with the same base (2), with the same exponent (3), with bases that are powers of
the same prime (4), an expression with powers and brackets (5).
"""
import re

from sympy import factorint

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

CASE_RANGES = {1: {"potenza": (0.50, 0.70), "zero-zero": (0.07, 0.20)}}

MAX_LIT, MAX_VAL, MAX_FACTOR, MAX_POW = 50, 300, 12, 125


def chain_factors(x):
    """A chain of powers joined by * and :, as [(base, exp, outer or None)] and the operators."""
    if x[0] == "op" and x[1] in "*:":
        fl, ol = chain_factors(x[2])
        fr, orr = chain_factors(x[3])
        if fl is None or fr is None or len(fr) != 1:
            return None, None
        return fl + fr, ol + [x[1]] + orr
    if x[0] == "pow" and x[1][0] == "n" and x[2][0] == "n":
        return [(x[1][1], x[2][1], None)], []
    if x[0] == "pow" and x[1][0] == "g" and x[1][2][0] == "pow" and x[2][0] == "n":
        inner = x[1][2]
        if inner[1][0] == "n" and inner[2][0] == "n":
            return [(inner[1][1], inner[2][1], x[2][1])], []
    return None, None


def check_level1(sample, errs):
    p = sample["params"]
    ans = sample["answer"]
    if sample["problem"] == "":
        # which power has no meaning: exactly 0^0 among four powers
        if ans.get("kind") != "choice":
            errs.append("answer must be a choice")
            return None
        undefined = []
        for o in ans["options"]:
            m = re.fullmatch(r"(\d+)\^(\d+)", o["values"][0])
            if not m or o["latex"] != o["values"][0]:
                errs.append(f"option {o} is not a power")
                continue
            b, e = int(m.group(1)), int(m.group(2))
            if b == 0 and e == 0:
                undefined.append(o["values"][0])
        if undefined != ["0^0"]:
            errs.append(f"options without meaning: {undefined}")
        check_choice_numbers(ans, "0^0", errs)
        if sample.get("choice") is not None:
            check_choice_numbers(sample["choice"], "0^0", errs)
        return "zero-zero"
    x = parse(latex_to_ascii(sample["problem"]))
    if x[0] != "pow" or x[1][0] != "n" or x[2][0] != "n":
        errs.append("level 1 problem must be a single power")
        return None
    b, e = x[1][1], x[2][1]
    if (p.get("base"), p.get("exponent")) != (str(b), str(e)):
        errs.append("params base/exponent != problem")
    v = evaluate(x)
    if ans.get("kind") != "number" or ans.get("value") != str(v):
        errs.append(f"answer {ans.get('value')} != {v}")
    kind = "esponente-0" if e == 0 else "esponente-1" if e == 1 else "base-0" if b == 0 else "base-1" if b == 1 else "base-10" if b == 10 else "potenza"
    if kind == "potenza" and v > 1024:
        errs.append(f"{b}^{e} = {v} > 1024")
    if kind == "base-10" and e > 6:
        errs.append("10^n with n > 6")
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but the power is {kind}")
    check_choice_numbers(sample.get("choice"), str(v), errs)
    return kind


def check_chain(sample, errs):
    lvl = sample["level"]
    asc = latex_to_ascii(sample["problem"])
    if asc != sample["params"].get("expr"):
        errs.append("problem != params.expr")
    x = parse(asc)
    facs, ops = chain_factors(x)
    if facs is None:
        errs.append(f"not a chain of powers: {asc}")
        return
    try:
        v = evaluate(x)
    except NotNatural as e:
        errs.append(f"a step leaves N: {e}")
        return
    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(v):
        errs.append(f"answer {ans.get('value')} != {v}")
    if v > 10000:
        errs.append(f"value {v} > 10000")
    if len(facs) < 2:
        errs.append("need at least two powers")
    bases = [b for b, _, _ in facs]
    if lvl == 2:
        if len(set(bases)) != 1:
            errs.append(f"bases {bases} are not all the same")
        if any(e * (o or 1) > 15 for _, e, o in facs):
            errs.append("exponent above 15")
    elif lvl == 3:
        exps = {e for _, e, _ in facs}
        if len(exps) != 1 or any(o is not None for _, _, o in facs) or len(set(bases)) != len(bases):
            errs.append("level 3 needs different bases with the same exponent")
        # the operation on the bases stays in N (the property can be used)
        acc = bases[0]
        for o, b in zip(ops, bases[1:]):
            if o == ":" and acc % b:
                errs.append("the quotient of the bases is not a natural number")
                break
            acc = acc * b if o == "*" else acc // b
        if acc < 2:
            errs.append("base of the result below 2")
        if any(b**e > 10000 for b, e, _ in facs):
            errs.append("a power above 10000")
    elif lvl == 4:
        primes = {tuple(factorint(b).keys()) for b in bases}
        if len(primes) != 1 or len(next(iter(primes))) != 1 or next(iter(primes))[0] not in (2, 3, 5):
            errs.append(f"bases {bases} are not powers of the same prime 2, 3 or 5")
        else:
            prime = next(iter(primes))[0]
            if all(b == prime for b in bases) or len(set(bases)) < 2:
                errs.append("no base to rewrite")
            if any(factorint(b)[prime] * e > 15 for b, e, _ in facs):
                errs.append("exponent in the common base above 15")
        if v > 1024:
            errs.append(f"value {v} > 1024")
    check_choice_numbers(sample.get("choice"), str(v), errs)


def check_expression(sample, errs):
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
        if r > MAX_VAL:
            errs.append(f"intermediate {r} > {MAX_VAL}")
        if o == "*" and not 2 <= min(a, b) <= MAX_FACTOR:
            errs.append(f"product {a} * {b} out of size")
        if o == ":" and not 2 <= b <= MAX_FACTOR:
            errs.append(f"divisor {b} out of size")
        if o in "+-" and b == 0:
            errs.append("adding or subtracting 0")
        if o == "^" and (r > MAX_POW or a < 2 or not 2 <= b <= 5):
            errs.append(f"power {a}^{b} out of size")
    lits = literals(x)
    if max(lits) > MAX_LIT or not 4 <= len(lits) <= 9:
        errs.append(f"numbers {lits}: at most {MAX_LIT}, from 4 to 9 of them")
    h, herrs = group_height(x)
    errs.extend(herrs)
    if h not in (0, 1):
        errs.append(f"bracket height {h}, expected tonde or quadre")
    nodes = list(walk(x))
    if not any(n[0] == "pow" for n in nodes):
        errs.append("no power")
    if not any(n[0] == "op" and n[1] in "*:" for n in nodes) or not any(n[0] == "op" and n[1] in "+-" for n in nodes):
        errs.append("needs both * or : and + or -")
    for n in nodes:
        if n[0] == "g" and top_terms(n[2]) < 2:
            errs.append("bracket without a sum or difference inside")
    if left_to_right(x, drop_brackets=True) == value:
        errs.append("without brackets the value is the same")
    check_choice_numbers(sample.get("choice"), str(value), errs)


def check(sample):
    errs = []
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or solution")
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = check_level1(sample, errs)
    elif lvl in (2, 3, 4):
        check_chain(sample, errs)
    elif lvl == 5:
        check_expression(sample, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
