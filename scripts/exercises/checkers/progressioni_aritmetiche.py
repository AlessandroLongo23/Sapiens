"""progressioni-aritmetiche, from specs/exercises/progressioni-aritmetiche.md.

Written from the spec, not from the generator. Every number is read back from the LaTeX of the problem (the
list of terms, the row of givens, the sentence about the means, the sum with its dots), compared with params,
and the answer is recomputed with exact rationals: d as a difference, a_n = a_1 + (n - 1)d, the place by solving
for n, a_1 from two terms, d = (b - a)/(k + 1) for k means, the sum by adding the terms one by one.
"""
import re

from sympy import Rational

from checkers._successioni import basic, givens, lines, num, number_check, split_top, text_of

CASE_RANGES = {1: {"intera": (0.65, 0.85), "frazionaria": (0.15, 0.35)}}


def asked(line, name):
    if line != name + r" = \ ?":
        raise ValueError(f"expected {name} = ?, got {line!r}")


def index_of(name):
    m = re.fullmatch(r"[aS]_\{?(\d+)\}?", name)
    if not m:
        raise ValueError(f"no index in {name!r}")
    return int(m.group(1))


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
        diffs = {b - a for a, b in zip(xs, xs[1:])}
        if len(diffs) != 1 or 0 in diffs:
            errs.append("not an arithmetic progression")
        d = xs[1] - xs[0]
        if not xs[0].is_integer or abs(xs[0]) > 12:
            errs.append("first term out of spec")
        kind = "intera" if d.is_integer else "frazionaria"
        if kind != p.get("case"):
            errs.append("case differs")
        number_check(sample, d, errs)
    elif lvl == 2:
        g = givens(ls[0])
        a1, d = num(g["a_1"]), num(g["d"])
        target = [x for x in split_top(ls[1], " = ")][0]
        nn = index_of(target)
        asked(ls[1], target)
        if [str(a1), str(d), nn] != [p["a1"], p["d"], p["n"]]:
            errs.append("givens differ from params")
        if not (8 <= nn <= 40 and d.is_integer and d != 0 and abs(d) <= 9):
            errs.append("out of spec")
        number_check(sample, a1 + (nn - 1) * d, errs)
    elif lvl == 3:
        g = givens(ls[0])
        a1, d, v = num(g["a_1"]), num(g["d"]), num(g["a_n"])
        asked(ls[1], "n")
        if [str(a1), str(d), str(v)] != [p["a1"], p["d"], p["value"]]:
            errs.append("givens differ from params")
        nn = (v - a1) / d + 1
        if not (nn.is_integer and 8 <= nn <= 40 and 2 <= abs(d) <= 9):
            errs.append("place out of spec")
        number_check(sample, nn, errs)
    elif lvl == 4:
        g = givens(ls[0])
        (n1, v1), (n2, v2) = [(index_of(name), num(v)) for name, v in g.items()]
        asked(ls[1], "a_1")
        if [n1, n2, str(v1), str(v2)] != [p["k"], p["m"], p["ak"], p["am"]]:
            errs.append("givens differ from params")
        d = (v2 - v1) / (n2 - n1)
        if not (2 <= n1 <= 6 and 2 <= n2 - n1 <= 8 and d.is_integer and d != 0):
            errs.append("out of spec")
        number_check(sample, v1 - (n1 - 1) * d, errs)
    elif lvl == 5:
        m = re.fullmatch(r"Inserisci \$(\d+)\$ medi aritmetici tra \$(.+)\$ e \$(.+)\$\.", text_of(ls[0]))
        if not m:
            return errs + ["unreadable sentence"], None
        means, a, b = int(m.group(1)), num(m.group(2)), num(m.group(3))
        asked(ls[1], "d")
        if [means, str(a), str(b)] != [p["means"], p["a"], p["b"]]:
            errs.append("sentence differs from params")
        d = (b - a) / (means + 1)
        if not (2 <= means <= 6 and d != 0 and d.q <= 2 and a.is_integer and b.is_integer):
            errs.append("out of spec")
        number_check(sample, d, errs)
    elif lvl == 6:
        g = givens(ls[0])
        a1, d = num(g["a_1"]), num(g["d"])
        target = split_top(ls[1], " = ")[0]
        nn = index_of(target)
        asked(ls[1], target)
        if not target.startswith("S_") or [str(a1), str(d), nn] != [p["a1"], p["d"], p["n"]]:
            errs.append("givens differ from params")
        if not 8 <= nn <= 40:
            errs.append("n out of spec")
        number_check(sample, sum(a1 + i * d for i in range(nn)), errs)
    elif lvl == 7:
        m = re.fullmatch(r"S = (\d+) \+ (\d+) \+ (\d+) \+ \\dots \+ (\d+)", sample["problem"])
        if not m:
            return errs + ["unreadable sum"], None
        x1, x2, x3, last = (int(v) for v in m.groups())
        d = x2 - x1
        if x3 - x2 != d or d == 0 or (last - x1) % d or [x1, d, last] != [p["first"], p["d"], p["last"]]:
            errs.append("not the progression of params")
        count = (last - x1) // d + 1
        if not (8 <= count <= 40 and min(x1, last) >= 1):
            errs.append("out of spec")
        number_check(sample, sum(x1 + i * d for i in range(count)), errs)
    else:
        return [f"unknown level {lvl}"], None
    return errs, kind
