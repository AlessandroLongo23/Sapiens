"""successioni-numeriche, from specs/exercises/successioni-numeriche.md.

Written from the spec, not from the generator. The sequence is read back from the LaTeX of the problem and
compared with params; every answer is recomputed with SymPy: a term by substitution, a recursive one by
iterating the law, the place of a number by solving the equation over the naturals, monotony from the sign of
a_(n+1) - a_n on the first 200 indices, boundedness from the limits of the terms of even and of odd place.
"""
import re

from sympy import Rational, Symbol, limit, oo, simplify, solve

from checkers._successioni import basic, k as K, label_check, lines, n, num, number_check, tex_expr  # noqa: F401

CASE_RANGES = {
    1: {"lineare": (0.22, 0.38), "quadratica": (0.22, 0.38), "fratta": (0.32, 0.48)},
    2: {"prodotto": (0.5, 0.7), "fratta": (0.3, 0.5)},
    3: {"un termine": (0.6, 0.8), "due termini": (0.2, 0.4)},
    4: {"lineare": (0.3, 0.5), "quadratica": (0.5, 0.7)},
    5: {"crescente": (0.22, 0.38), "decrescente": (0.22, 0.38), "non monotona": (0.22, 0.38), "costante": (0.05, 0.16)},
    6: {"limitata": (0.18, 0.32), "inferiormente": (0.18, 0.32), "superiormente": (0.18, 0.32), "nessuna": (0.18, 0.32)},
}

MONOTONY = {
    "crescente": r"\text{crescente}",
    "decrescente": r"\text{decrescente}",
    "costante": r"\text{costante}",
    "non monotona": r"\text{non monotona}",
}
BOUNDS = {
    "limitata": r"\text{limitata}",
    "inferiormente": r"\text{limitata solo inferiormente}",
    "superiormente": r"\text{limitata solo superiormente}",
    "nessuna": r"\begin{gathered} \text{non limitata né superiormente} \\ \text{né inferiormente} \end{gathered}",
}


def general_term(line):
    m = re.fullmatch(r"a_n = (.+)", line)
    if not m:
        raise ValueError(f"not a_n = ...: {line!r}")
    return tex_expr(m.group(1))


def asked_index(line):
    m = re.fullmatch(r"a_\{(\d+)\} = \\ \?", line)
    if not m:
        raise ValueError(f"not a_{{k}} = ?: {line!r}")
    return int(m.group(1))


def from_coefs(cs):
    return sum(Rational(c) * n**i for i, c in enumerate(cs))


def check_term(s, errs):
    p = s["params"]
    ls = lines(s["problem"])
    if len(ls) != 2:
        errs.append("expected two lines")
        return None
    expr, idx = general_term(ls[0]), asked_index(ls[1])
    if idx != p["k"]:
        errs.append("index differs from params.k")
    if s["level"] == 1:
        want = from_coefs(p["num"]) / (from_coefs(p["den"]) if p["den"] else 1)
        if not 3 <= idx <= 10:
            errs.append("index outside 3..10")
        kind = "fratta" if p["den"] else ("quadratica" if len(p["num"]) == 3 else "lineare")
        if kind == "fratta" and simplify(want).is_polynomial(n):
            errs.append("the fraction simplifies")
    else:
        sign = (-1) ** (n + p["shift"])
        g = p["p"] * n + p["c"]
        want = sign * g if p["case"] == "prodotto" else sign / g
        kind = p["case"]
        if "(-1)^" not in ls[0]:
            errs.append("no (-1)^n in the problem")
        if any(g.subs(n, i) <= 0 for i in range(1, 12)) and kind == "fratta":
            errs.append("denominator not positive")
    if any(expr.subs(n, i) != want.subs(n, i) for i in range(1, 13)):
        errs.append("the problem is not the sequence of params")
    number_check(s, expr.subs(n, idx), errs)
    return kind


def check_recursive(s, errs):
    p = s["params"]
    ls = lines(s["problem"])
    m = re.fullmatch(r"\\begin\{cases\} (.+) \\\\ (.+) \\end\{cases\}", ls[0])
    if not m or len(ls) != 2:
        errs.append("expected the cases and the question")
        return None
    idx = asked_index(ls[1])
    start, law = m.group(1), m.group(2)
    A, B = Symbol("A"), Symbol("B")
    one = re.fullmatch(r"a_1 = (-?\d+)", start)
    two = re.fullmatch(r"a_1 = (-?\d+), \\quad a_2 = (-?\d+)", start)
    if one:
        lm = re.fullmatch(r"a_\{n\+1\} = (.+)", law)
        f = tex_expr(lm.group(1).replace("a_n", "A"), {"A": A})
        xs = [Rational(one.group(1))]
        while len(xs) < idx:
            xs.append(f.subs(A, xs[-1]))
        kind = "un termine"
        if f.subs(A, xs[0]) == xs[0]:
            errs.append("constant sequence")
        if max(abs(x) for x in xs) > 500:
            errs.append("terms over 500")
        if [p.get("a1"), p.get("k")] != [int(xs[0]), idx] or f != p["p"] * A + p["r"]:
            errs.append("the problem is not the sequence of params")
    elif two:
        lm = re.fullmatch(r"a_\{n\+2\} = (.+)", law)
        f = tex_expr(lm.group(1).replace("a_{n+1}", "B").replace("a_n", "A"), {"A": A, "B": B})
        xs = [Rational(two.group(1)), Rational(two.group(2))]
        while len(xs) < idx:
            xs.append(f.subs({A: xs[-2], B: xs[-1]}))
        kind = "due termini"
        if [p.get("a1"), p.get("a2"), p.get("k")] != [int(xs[0]), int(xs[1]), idx] or f != A + B:
            errs.append("the problem is not the sequence of params")
    else:
        errs.append(f"unreadable first terms {start!r}")
        return None
    if not 3 <= idx <= 7:
        errs.append("index outside 3..7")
    number_check(s, xs[idx - 1], errs)
    return kind


def check_place(s, errs):
    p = s["params"]
    ls = lines(s["problem"])
    if len(ls) != 3 or ls[2] != r"n = \ ?":
        errs.append("expected three lines ending with n = ?")
        return None
    expr = general_term(ls[0])
    m = re.fullmatch(r"a_n = (-?\d+)", ls[1])
    value = int(m.group(1))
    if expr != from_coefs(p["coefs"]) or value != p["value"]:
        errs.append("the problem is not the sequence of params")
    x = Symbol("x", real=True)
    roots = solve(expr.subs(n, x) - value, x)
    naturals = [r for r in roots if r.is_integer and r >= 1]
    if len(naturals) != 1:
        errs.append(f"{len(naturals)} natural indices")
        return None
    kind = "quadratica" if len(roots) == 2 else "lineare"
    if kind == "quadratica" and not all(r.is_integer for r in roots):
        errs.append("roots not integer")
    number_check(s, naturals[0], errs)
    return kind


def terms(expr, count=200):
    return [expr.subs(n, i) for i in range(1, count + 1)]


def monotony(expr):
    xs = terms(expr)
    signs = {int(bool(b > a)) - int(bool(b < a)) for a, b in zip(xs, xs[1:])}
    if signs == {1}:
        return "crescente"
    if signs == {-1}:
        return "decrescente"
    return "costante" if signs == {0} else "non monotona"


def bounds(expr):
    m = Symbol("m", integer=True, positive=True)
    ends = [limit(simplify(expr.subs(n, 2 * m)), m, oo), limit(simplify(expr.subs(n, 2 * m + 1)), m, oo)]
    up, down = all(e != oo for e in ends), all(e != -oo for e in ends)
    return "limitata" if up and down else "inferiormente" if down else "superiormente" if up else "nessuna"


def from_family(p):
    """The sequence the params describe, as the spec lists the families of levels 5 and 6."""
    fam, c = p.get("family"), p.get("c")
    if fam == "lineare":
        return p["p"] * n + c
    if fam == "fratta":
        return (p["p"] * n + c) / n
    if fam == "quadratica":
        return p["a"] * n**2 + p["b"] * n + c
    if fam == "costante":
        return Rational(c) + 0 * n
    if fam == "alterna":
        return (-1) ** n * {"c": c, "n": n, "n^2": n**2, "pn": (c + 1) * n, "1/n": 1 / n}[p["g"]]
    raise ValueError(f"unknown family {fam!r}")


def check_behaviour(s, errs):
    expr = general_term(s["problem"])
    want = from_family(s["params"])
    if any(expr.subs(n, i) != want.subs(n, i) for i in range(1, 13)):
        errs.append("the problem is not the sequence of params")
    if s["level"] == 5:
        truth = monotony(expr)
        label_check(s, MONOTONY, truth, errs)
        # a difference that is zero at one index would make "non decrescente" the honest answer
        xs = terms(expr, 40)
        if truth == "non monotona" and "(-1)" not in s["problem"] and any(a == b for a, b in zip(xs, xs[1:])):
            errs.append("two equal consecutive terms")
    else:
        truth = bounds(expr)
        label_check(s, BOUNDS, truth, errs)
    return truth


def check(sample):
    errs = basic(sample)
    lvl = sample["level"]
    if lvl in (1, 2):
        kind = check_term(sample, errs)
    elif lvl == 3:
        kind = check_recursive(sample, errs)
    elif lvl == 4:
        kind = check_place(sample, errs)
    elif lvl in (5, 6):
        kind = check_behaviour(sample, errs)
    else:
        return [f"unknown level {lvl}"], None
    if kind != sample["params"].get("case"):
        errs.append(f"case {sample['params'].get('case')!r} but the exercise is {kind!r}")
    return errs, kind
