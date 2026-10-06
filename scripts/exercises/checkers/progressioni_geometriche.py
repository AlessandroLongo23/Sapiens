"""progressioni-geometriche, from specs/exercises/progressioni-geometriche.md.

Written from the spec, not from the generator. Every number is read back from the LaTeX of the problem and
compared with params; the answers are recomputed with exact rationals: q as a ratio, a_n = a_1 q^(n-1) by
repeated multiplication, the behaviour from the first terms, the real roots of q^(m-k) = a_m/a_k with SymPy,
the place by multiplying until the term is reached, the sum by adding the terms, the percentage by multiplying
period after period.
"""
import re

from sympy import Rational, Symbol, real_roots

from checkers._successioni import basic, givens, label_check, lines, num, number_check, options_check, split_top, text_of

CASE_RANGES = {
    1: {"intera": (0.5, 0.7), "frazionaria": (0.3, 0.5)},
    3: {"crescente": (0.22, 0.38), "decrescente": (0.22, 0.38), "alterni": (0.22, 0.38), "costante": (0.05, 0.16)},
    4: {"una": (0.4, 0.6), "due": (0.4, 0.6)},
    7: {"capitale": (0.25, 0.42), "auto": (0.25, 0.42), "paese": (0.25, 0.42)},
}

BEHAVIOUR = {
    "crescente": r"\text{crescente}",
    "decrescente": r"\text{decrescente}",
    "costante": r"\text{costante}",
    "alterni": r"\text{a segni alterni}",
}

STORIES = {
    "capitale": (r"Un capitale di \$(\d+)\$ euro cresce del \$(\d+)\\%\$ all'anno, con interesse composto\.", r"Quanti euro vale dopo \$(\d+)\$ anni\?", 1),
    "auto": (r"Un'auto che vale \$(\d+)\$ euro perde ogni anno il \$(\d+)\\%\$ del suo valore\.", r"Quanti euro vale dopo \$(\d+)\$ anni\?", -1),
    "paese": (r"Un paese di \$(\d+)\$ abitanti cresce del \$(\d+)\\%\$ all'anno\.", r"Quanti abitanti ha dopo \$(\d+)\$ anni\?", 1),
}


def asked(line, name):
    if line != name + r" = \ ?":
        raise ValueError(f"expected {name} = ?, got {line!r}")


def index_of(name):
    m = re.fullmatch(r"[aS]_\{?(\d+)\}?", name)
    if not m:
        raise ValueError(f"no index in {name!r}")
    return int(m.group(1))


def geometric(a1, q, count):
    xs = [a1]
    while len(xs) < count:
        xs.append(xs[-1] * q)
    return xs


def ratio_option(o):
    """q = 3, q = -\\frac{1}{2}, q = \\pm 2: the set the text says and the set of the values."""
    m = re.fullmatch(r"q = (\\pm )?(.+)", o["latex"])
    v = num(m.group(2))
    shown = frozenset([v, -v]) if m.group(1) else frozenset([v])
    if m.group(1) and v <= 0:
        raise ValueError("± before a non-positive number")
    return shown, frozenset(Rational(x) for x in o["values"])


def check(sample):
    errs = basic(sample)
    lvl, p = sample["level"], sample["params"]
    ls = lines(sample["problem"])
    kind = None
    if lvl == 1:
        m = re.fullmatch(r"(.+),\\ \\dots", sample["problem"])
        xs = [num(x) for x in split_top(m.group(1), r",\ ")]
        if [str(x) for x in xs] != p["terms"] or len(xs) != 4:
            errs.append("terms differ from params")
        if any(x == 0 or not x.is_integer for x in xs) or len({b / a for a, b in zip(xs, xs[1:])}) != 1:
            errs.append("not a geometric progression of integers")
        q = xs[1] / xs[0]
        if q == 1:
            errs.append("ratio 1")
        kind = "intera" if q.is_integer else "frazionaria"
        number_check(sample, q, errs)
    elif lvl in (2, 6):
        g = givens(ls[0])
        a1, q = num(g["a_1"]), num(g["q"])
        target = split_top(ls[1], " = ")[0]
        nn = index_of(target)
        asked(ls[1], target)
        if target[0] != ("a" if lvl == 2 else "S") or [str(a1), str(q), nn] != [p["a1"], p["q"], p["n"]]:
            errs.append("givens differ from params")
        if not (4 <= nn <= 10 and q in (2, 3, -2, -3, Rational(1, 2), Rational(-1, 2)) and a1 != 0):
            errs.append("out of spec")
        xs = geometric(a1, q, nn)
        if max(abs(x) for x in xs) > 7000:
            errs.append("terms too large")
        number_check(sample, xs[-1] if lvl == 2 else sum(xs), errs)
    elif lvl == 3:
        g = givens(sample["problem"])
        a1, q = num(g["a_1"]), num(g["q"])
        if [str(a1), str(q)] != [p["a1"], p["q"]] or a1 == 0 or q == 0:
            errs.append("givens differ from params")
        xs = geometric(a1, q, 6)
        ups = {int(bool(b > a)) - int(bool(b < a)) for a, b in zip(xs, xs[1:])}
        kind = "alterni" if q < 0 else "costante" if ups == {0} else "crescente" if ups == {1} else "decrescente"
        label_check(sample, BEHAVIOUR, kind, errs)
    elif lvl == 4:
        g = givens(ls[0])
        (n1, v1), (n2, v2) = [(index_of(name), num(v)) for name, v in g.items()]
        asked(ls[1], "q")
        if [n1, n2, str(v1), str(v2)] != [p["k"], p["m"], p["ak"], p["am"]]:
            errs.append("givens differ from params")
        x = Symbol("x")
        roots = sorted(real_roots(x ** (n2 - n1) - v2 / v1))
        if not roots or not all(r.is_rational for r in roots) or abs(v2) > 5000 or not 1 <= n2 - n1 <= 4:
            errs.append(f"roots {roots} out of spec")
        kind = "due" if len(roots) == 2 else "una"
        ans = sample["answer"]
        if ans.get("kind") != "set" or [Rational(v) for v in ans.get("values", [])] != roots:
            errs.append(f"answer {ans.get('values')} != {roots}")
        want = r"\left\{ " + r",\ ".join(sample_latex(r) for r in roots) + r" \right\}"
        if ans.get("latex") != want:
            errs.append("answer.latex differs")
        options_check(sample["choice"], ratio_option, frozenset(roots), errs)
    elif lvl == 5:
        g = givens(ls[0])
        a1, q, v = num(g["a_1"]), num(g["q"]), num(g["a_n"])
        asked(ls[1], "n")
        if [a1, q, v] != [p["a1"], p["q"], p["value"]] or not (q.is_integer and q >= 2 and a1 != 0):
            errs.append("givens differ from params or out of spec")
        nn, term = 1, a1
        while abs(term) < abs(v) and nn < 60:
            term, nn = term * q, nn + 1
        if term != v or not 4 <= nn <= 11:
            errs.append("the number is not a term in the range of the spec")
        number_check(sample, nn, errs)
    elif lvl == 7:
        kind = p.get("case")
        first, second, sign = STORIES.get(kind, (None, None, 0))
        if first is None or len(ls) != 2:
            return errs + ["unknown story"], None
        m1, m2 = re.fullmatch(first, text_of(ls[0])), re.fullmatch(second, text_of(ls[1]))
        if not m1 or not m2:
            return errs + ["unreadable story"], kind
        c0, rate, years = int(m1.group(1)), sign * int(m1.group(2)), int(m2.group(1))
        lo, hi = {"auto": (8000, 32000), "paese": (1000, 9000), "capitale": (500, 9000)}[kind]
        if [c0, rate, years] != [p["c0"], p["p"], p["n"]] or years not in (2, 3) or not lo <= c0 <= hi:
            errs.append("story differs from params or out of spec")
        if rate not in {"capitale": (5, 10, 20), "auto": (-10, -20, -30), "paese": (5, 10, 20)}[kind]:
            errs.append("rate out of spec")
        value = Rational(c0)
        for _ in range(years):
            value += value * Rational(rate, 100)
        if not value.is_integer:
            errs.append("result not integer")
        number_check(sample, value, errs)
    else:
        return [f"unknown level {lvl}"], None
    if kind is not None and kind != p.get("case"):
        errs.append(f"case {p.get('case')!r} but the exercise is {kind!r}")
    return errs, kind


def sample_latex(r):
    r = Rational(r)
    if r.q == 1:
        return str(r.p)
    return ("-" if r < 0 else "") + r"\frac{" + str(abs(r.p)) + "}{" + str(r.q) + "}"
