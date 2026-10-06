"""Checker for equazioni-esponenziali, written from specs/exercises/equazioni-esponenziali.md.

It reads the equation from the LaTeX of the problem and checks the answer without solving by the lesson's
methods: every value of the answer must make the two members equal (40 digits), and the number of solutions must
be the number of sign changes of first member minus second member on a fine grid (the specification only allows
simple solutions, so each one is a sign change). The terms in `params` must say the same equation as the text.
Then the constraints of each level, the form of the answer, the three distractors (distinct, wrong, and among
them the mistake the level is about) and the multiple choice.
"""
from sympy import Integer, Rational, log

from checkers._esponenziali import check_choice, forbidden, is_zero, number_fn, rat, set_tex, sign_changes, to_expr, x

CASE_RANGES = {
    1: {"impossibile": (0.12, 0.28), "esponente negativo": (0.15, 0.40), "esponente positivo": (0.30, 0.60)},
    2: {"intera": (0.35, 0.75), "frazionaria": (0.25, 0.65)},
    3: {"due potenze": (0.35, 0.65), "un numero a secondo membro": (0.35, 0.65)},
    5: {"fattore negativo": (0.10, 0.40), "fattore positivo": (0.60, 0.90)},
    6: {"due soluzioni": (0.35, 0.65), "un valore da scartare": (0.35, 0.65)},
    7: {"due soluzioni": (0.40, 0.72), "un valore da scartare": (0.28, 0.60)},
}

N_RANGE = {2: (-4, 6), 3: (-3, 4), 5: (-2, 3), 10: (-3, 3)}
POWERS = {2: {2, 3, -1, -2}, 3: {2, 3, -1, -2}, 5: {2, -1, -2}}
COUNT = {1: (0, 1), 2: (1,), 3: (1,), 4: (2,), 5: (1,), 6: (1, 2), 7: (1, 2)}


def side(a, terms):
    out = Integer(0)
    for t in terms:
        e = sum(Integer(c) * x**i for i, c in enumerate(t["e"]))
        out += Integer(t["c"]) * Integer(a) ** (Integer(t["p"]) * e)
    return out


def same_function(u, v):
    f, g = number_fn(u), number_fn(v)
    for p in (-1.3, -0.4, 0.3, 0.9, 1.7):
        a, b = f(p), g(p)
        if abs(a - b) > 1e-9 * max(1.0, abs(a), abs(b)):
            return False
    return True


def exponent_of(a, value):
    """n with a^n = value, for a positive rational value, or None."""
    if value <= 0:
        return None
    n = round(float(log(value) / log(a)))
    return n if Integer(a) ** n == value else None


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    problem = sample["problem"]
    if problem.count("=") != 1:
        return [f"not one equation: {problem}"], None
    left, right = (to_expr(s) for s in problem.split("="))
    f = left - right
    a = p["a"]

    ans = sample["answer"]
    if ans.get("kind") != "set":
        return [f"answer.kind is {ans.get('kind')}, expected set"], None
    sol = [rat(v) for v in ans["values"]]
    if sol != sorted(sol) or len(set(sol)) != len(sol):
        errs.append("solutions not sorted or repeated")
    for v in sol:
        if not is_zero(f.subs(x, v)):
            errs.append(f"{v} does not solve {problem}")
    n_roots = sign_changes(f)
    if n_roots != len(sol):
        errs.append(f"{len(sol)} solutions given, {n_roots} sign changes")
    if len(sol) not in COUNT[lvl]:
        errs.append(f"level {lvl} with {len(sol)} solutions")
    if ans.get("latex") != set_tex(ans["values"]) or sample.get("solution") != set_tex(ans["values"]):
        errs.append("answer.latex or solution is not the set as the lesson writes it")
    if sample.get("prompt") != "Risolvi l'equazione.":
        errs.append("wrong prompt")
    if not sample.get("steps"):
        errs.append("no steps")
    errs += forbidden(problem)

    # the terms of params say the same equation
    lhs, rhs = p["lhs"], p["rhs"]
    if not same_function(side(a, lhs) - side(a, rhs), f):
        errs.append("params do not say the equation of the problem")

    case = p.get("case")
    if lvl == 1:
        if a not in (2, 3, 5, 10) or left != Integer(a) ** x:
            errs.append("level 1: first member must be a^x")
        if not right.is_number:
            errs.append("level 1: second member must be a number")
        elif right <= 0:
            if sol or case != "impossibile":
                errs.append("level 1: b <= 0 is impossible")
        else:
            n = exponent_of(a, right)
            lo, hi = N_RANGE[a]
            if n is None or not lo <= n <= hi:
                errs.append("level 1: b is not a power of a in the range")
            elif case != ("esponente negativo" if n < 0 else "esponente zero" if n == 0 else "esponente positivo"):
                errs.append("level 1: wrong case")
    else:
        if a not in (2, 3, 5):
            errs.append("base must be 2, 3 or 5")
    if lvl == 2:
        (t,) = lhs
        k, m = t["e"]
        if t["c"] != 1 or t["p"] != 1 or m == 0 or not -3 <= m <= 4 or abs(k) > 5 or (m == 1 and k == 0):
            errs.append("level 2: exponent m x + k out of the specification")
        n = exponent_of(a, right) if right.is_number else None
        if n is None or not N_RANGE[a][0] <= n <= N_RANGE[a][1]:
            errs.append("level 2: second member is not a power of a in the range")
        if sol and (sol[0].q > 4 or abs(sol[0].p) > 9):
            errs.append("level 2: solution out of range")
        if sol and case != ("intera" if sol[0].q == 1 else "frazionaria"):
            errs.append("level 2: wrong case")
    if lvl == 3:
        (t,), (u,) = lhs, rhs
        if t["p"] not in POWERS[a] or t["c"] != 1 or u["c"] != 1:
            errs.append("level 3: first base is not an allowed power")
        if case == "due potenze":
            if u["p"] not in POWERS[a] or u["p"] == t["p"] or u["e"][1] == 0:
                errs.append("level 3: second base is not another allowed power")
        elif case == "un numero a secondo membro":
            if not right.is_number or u["e"] != [1, 0] or u["p"] in (0, t["p"]) or not N_RANGE[a][0] <= u["p"] <= N_RANGE[a][1]:
                errs.append("level 3: second member out of the specification")
        else:
            errs.append("level 3: unknown case")
        if sol and (sol[0].q > 6 or abs(sol[0].p) > 12):
            errs.append("level 3: solution out of range")
    if lvl == 4:
        (t,) = lhs
        if len(t["e"]) != 3 or t["e"][2] != 1 or t["p"] != 1 or t["c"] != 1:
            errs.append("level 4: exponent must be x^2 + b x + c")
        n = exponent_of(a, right) if right.is_number else None
        if n is None or not -2 <= n <= 3:
            errs.append("level 4: second member out of range")
        if any(v.q != 1 or abs(v) > 5 for v in sol):
            errs.append("level 4: solutions must be integers between -5 and 5")
        if n is not None and case != ("secondo membro 1" if n == 0 else "secondo membro frazione" if n < 0 else "secondo membro intero"):
            errs.append("level 4: wrong case")
    if lvl == 5:
        if len(lhs) != 2 or any(t["p"] != 1 or abs(t["c"]) != 1 or t["e"][1] != 1 or not -2 <= t["e"][0] <= 3 for t in lhs):
            errs.append("level 5: two powers a^(x + k) expected")
        elif lhs[0]["e"][0] <= lhs[1]["e"][0]:
            errs.append("level 5: the larger exponent comes first")
        elif case != ("fattore negativo" if lhs[0]["c"] * a ** (lhs[0]["e"][0] - lhs[1]["e"][0]) + lhs[1]["c"] < 0 else "fattore positivo"):
            errs.append("level 5: wrong case")
        if not right.is_Integer or abs(right) > 2000:
            errs.append("level 5: second member must be an integer up to 2000")
        if any(v.q != 1 or not -2 <= v <= 4 for v in sol):
            errs.append("level 5: solution out of range")
    if lvl == 6:
        if [t["p"] for t in lhs] != [2, 1, 0] or lhs[0]["c"] != 1 or right != 0 or lhs[1]["c"] == 0:
            errs.append("level 6: (a^2)^x + s a^x + p = 0 expected")
        if case != ("due soluzioni" if len(sol) == 2 else "un valore da scartare"):
            errs.append("level 6: wrong case")
        s, pr = lhs[1]["c"], lhs[2]["c"]
        if s * s - 4 * pr <= 0:
            errs.append("level 6: the equation in t must have two distinct roots")
    if lvl == 7:
        if len(lhs) != 2 or lhs[0] != {"c": 1, "p": 1, "e": [0, 1]} or abs(lhs[1]["c"]) != 1 or lhs[1]["e"][1] != -1 or not right.is_Integer:
            errs.append("level 7: a^x ± a^(c - x) = N expected")
        if case != ("due soluzioni" if len(sol) == 2 else "un valore da scartare") or (len(sol) == 2) != (lhs[1]["c"] == 1):
            errs.append("level 7: wrong case")
    if lvl >= 4 and any(v.q != 1 for v in sol):
        errs.append("levels 4-7: integer solutions")

    # distractors: three, distinct, wrong, written as the lesson writes a set
    ds = p.get("distractors", [])
    truth_key = "|".join(ans["values"])
    dkeys = ["|".join(d["values"]) for d in ds]
    if len(ds) != 3 or len(set(dkeys + [truth_key])) != 4:
        errs.append("three distinct distractors expected")
    for d in ds:
        vals = [rat(v) for v in d["values"]]
        if vals != sorted(vals) or len(set(vals)) != len(vals):
            errs.append(f"distractor {d['values']} not sorted")
        if d["latex"] != set_tex(d["values"]):
            errs.append(f"distractor {d['values']} is written {d['latex']}")
        if vals and all(is_zero(f.subs(x, v)) for v in vals) and len(vals) == len(sol):
            errs.append(f"distractor {d['values']} is right")
    have = set(dkeys)
    # the mistake of the level must be among the options
    if lvl in (6, 7):
        s, pr = lhs[1]["c"], lhs[2]["c"] if lvl == 6 else None
        if lvl == 6:
            disc = s * s - 4 * pr
            r = int(round(disc**0.5))
            ts = sorted([Rational(-s - r, 2), Rational(-s + r, 2)])
        else:
            ts = sorted(Integer(a) ** v for v in sol) if len(sol) == 2 else None
        if ts and "|".join(str(t) for t in ts) not in have and len(sol) == 2:
            errs.append("the values of t are not among the distractors")
    if lvl == 4 and len(sol) == 2 and "|".join(str(v) for v in sorted(-w for w in sol)) not in have | {truth_key}:
        errs.append("level 4: the solutions with the opposite signs are not among the distractors")
    if lvl == 1 and sol and sol[0] != 0 and str(-sol[0]) not in have:
        errs.append("level 1: the opposite exponent is not among the distractors")

    ch = sample.get("choice")
    opts = check_choice(ch, truth_key, errs)
    for o in opts:
        if o.get("latex") != set_tex(o.get("values", [])):
            errs.append(f"option {o.get('values')} is written {o.get('latex')}")
    if opts and set("|".join(o["values"]) for o in opts) != set(dkeys + [truth_key]):
        errs.append("the options are not the answer and the three distractors")
    return errs, case
