"""Checker for numeri-razionali-espressioni, from specs/exercises/numeri-razionali-espressioni.md.

params.expr is a tree: n (number "p/q"), d (decimal "0,25"), pow, g (bracket with its kind k:
1 round, 2 square, 3 curly), sum (terms with sign s), ch (chain of products and quotients, left
to right), fr (fraction of fractions). It is evaluated here with SymPy Rationals, following the
order of operations of the lesson, and rendered to LaTeX again from the spec's conventions, so the
problem shown is checked against the tree.
"""
import re

from sympy import Integer, Rational

from verify import rat

MID = 36  # every intermediate value: |numerator| and denominator at most this
END = 30  # the result

CASE_RANGES = {
    1: {"priorità": (0.55, 0.85), "da sinistra": (0.15, 0.45)},
    2: {"meno": (0.25, 0.55), "fattore negativo": (0.15, 0.45), "entrambi": (0.15, 0.45)},
    3: {"esponente negativo": (0.55, 0.85), "esponente zero": (0.15, 0.45)},
    6: {"prodotto": (0.35, 0.65), "quoziente": (0.35, 0.65)},
}

DEC_RE = re.compile(r"^(\d+),(\d+)$")
FRAC_RE = re.compile(r"^(-?)\\frac\{(\d+)\}\{(\d+)\}$|^(-?\d+)$")
# Lines for the phone (spec, "Righe sul telefono"): a problem wider than LINE (estimated px at 18 px)
# is written as \begin{aligned}&line 1\\&\quad line 2\end{aligned}, a new line before a +, a -,
# a \cdot or a : of the outer level; each line within LINE.
LINE = 348
ALIGNED = re.compile(r"^\\begin\{aligned\}&(.*)\\end\{aligned\}$", re.S)


def dec(s):
    m = DEC_RE.match(s)
    if not m:
        raise ValueError(f"bad decimal {s!r}")
    return Rational(int(m.group(1) + m.group(2)), 10 ** len(m.group(2)))


def ev(n):
    t = n["t"]
    if t == "n":
        return rat(n["v"])
    if t == "d":
        return dec(n["s"])
    if t == "pow":
        b = ev(n["b"])
        if b == 0 and n["e"] <= 0:
            raise ZeroDivisionError("0 to exponent <= 0")
        return b ** Integer(n["e"])
    if t == "g":
        return ev(n["x"])
    if t == "sum":
        return sum((ev(u["x"]) if u["s"] == 1 else -ev(u["x"])) for u in n["terms"])
    if t == "ch":
        vals = [ev(i) for i in n["items"]]
        acc = vals[0]
        for op, v in zip(n["ops"], vals[1:]):
            if op == "*":
                acc = acc * v
            elif op == ":":
                if v == 0:
                    raise ZeroDivisionError("division by zero")
                acc = acc / v
            else:
                raise ValueError(f"bad op {op}")
        return acc
    if t == "fr":
        d = ev(n["d"])
        if d == 0:
            raise ZeroDivisionError("zero denominator")
        return ev(n["n"]) / d
    raise ValueError(f"unknown node {t}")


def kids(n):
    t = n["t"]
    if t == "pow":
        return [n["b"]]
    if t == "g":
        return [n["x"]]
    if t == "sum":
        return [u["x"] for u in n["terms"]]
    if t == "ch":
        return n["items"]
    if t == "fr":
        return [n["n"], n["d"]]
    return []


def walk(n):
    yield n
    for k in kids(n):
        yield from walk(k)


def depth(n):
    h = max([depth(k) for k in kids(n)] or [0])
    return h + 1 if n["t"] == "g" else h


def num_tex(r):
    """A number in the problem: \\dfrac, negatives always in parentheses."""
    a = abs(r)
    body = f"{a.p}" if a.q == 1 else rf"\dfrac{{{a.p}}}{{{a.q}}}"
    if r >= 0:
        return body
    return f"(-{a.p})" if a.q == 1 else rf"\left(-{body}\right)"


BRACKETS = {1: (r"\left(", r"\right)"), 2: (r"\left[", r"\right]"), 3: (r"\left\{", r"\right\}")}


def tex(n):
    t = n["t"]
    if t == "n":
        return num_tex(rat(n["v"]))
    if t == "d":
        return n["s"].replace(",", "{,}")
    if t == "pow":
        b = n["b"]
        if b["t"] == "n":
            r = rat(b["v"])
            if r > 0 and r.q == 1:
                base = f"{r.p}"
            elif r > 0:
                base = rf"\left({num_tex(r)}\right)"
            else:
                base = num_tex(r)
        else:
            base = tex(b)
        return f"{base}^{{{n['e']}}}"
    if t == "g":
        o, c = BRACKETS[n["k"]]
        return o + tex(n["x"]) + c
    if t == "sum":
        out = ""
        for i, u in enumerate(n["terms"]):
            out += ("-" if u["s"] < 0 else "") if i == 0 else (" - " if u["s"] < 0 else " + ")
            out += tex(u["x"])
        return out
    if t == "ch":
        out = tex(n["items"][0])
        for op, it in zip(n["ops"], n["items"][1:]):
            out += (r" \cdot " if op == "*" else " : ") + tex(it)
        return out
    if t == "fr":
        return rf"\dfrac{{{tex(n['n'])}}}{{{tex(n['d'])}}}"
    raise ValueError(t)


def est_width(latex):
    """Estimated width in px at 18 px, the spec's sum of the widths KaTeX gives to each part."""
    w = 0.0
    s = re.sub(r"\\(left|right)", "", latex)
    for rx, f in (
        (r"\\dfrac\{(\d+)\}\{(\d+)\}", lambda m: 10.9 * max(len(m.group(1)), len(m.group(2))) + 5.2),
        (r"\^\{(-?\d+)\}", lambda m: 8.7 * len(m.group(1))),
        (r" [+-] ", lambda m: 21.9),
        (r"\\cdot", lambda m: 19.2),
        (r" : ", lambda m: 18.1),
        (r"\\[{}]", lambda m: 10.4),
        (r"\{,\}", lambda m: 5),
        (r"-", lambda m: 12.3),
        (r"[()\[\]]", lambda m: 7.25),
        (r"\d", lambda m: 10.9),
    ):
        w += sum(f(m) for m in re.finditer(rx, s))
        s = re.sub(rx, "", s)
    return w


def unfold(problem):
    """The problem on one line, and the errors of its layout: an aligned block only when one line does
    not fit LINE, two or three lines, each within LINE, every line after the first starting with
    +, -, \\cdot or :, no \\left ... \\right pair cut."""
    errs = []
    m = ALIGNED.match(problem)
    if not m:
        if re.search(r"aligned|&|\\\\|\\quad", problem):
            errs.append(f"malformed layout: {problem}")
        if est_width(problem) > LINE:
            errs.append(f"problem wider than {LINE} px on one line")
        return problem, errs
    lines = m.group(1).split("\\\\&\\quad ")
    if not 2 <= len(lines) <= 3:
        errs.append(f"{len(lines)} lines")
    for i, ln in enumerate(lines):
        if re.search(r"aligned|&|\\\\|\\quad", ln):
            errs.append(f"malformed line {i + 1}: {ln}")
        if i > 0 and not re.match(r"([+-]|\\cdot|:) ", ln):
            errs.append(f"line {i + 1} does not start with +, -, \\cdot or :: {ln}")
        if ln.count("\\left") != ln.count("\\right"):
            errs.append(f"a \\left ... \\right pair is cut at line {i + 1}")
        if est_width(ln) > LINE:
            errs.append(f"line {i + 1} too wide for a phone: {ln}")
    flat = " ".join(lines)
    if est_width(flat) <= LINE:
        errs.append("problem split although it fits one line")
    return flat, errs


def parse_opt(latex):
    m = FRAC_RE.match(latex)
    if not m:
        return None
    if m.group(4) is not None:
        return Rational(int(m.group(4)))
    v = Rational(int(m.group(2)), int(m.group(3)))
    return -v if m.group(1) else v


def lcm_den(vals):
    from math import lcm

    out = 1
    for v in vals:
        out = lcm(out, int(v.q))
    return out


def general(e):
    """Constraints common to every level (spec, "Regole comuni")."""
    errs = []
    for n in walk(e):
        v = ev(n)
        t = n["t"]
        if abs(v.p) > MID or v.q > MID:
            errs.append(f"intermediate value {v} out of bounds")
        if t == "n" and v == 0:
            errs.append("zero written in the problem")
        if t not in ("n", "d") and v == 0:
            errs.append(f"a {t} part equals 0")
        if t == "g":
            if n["k"] != depth(n):
                errs.append(f"bracket kind {n['k']} at nesting {depth(n)}")
            if n["x"]["t"] != "sum":
                errs.append("bracket without a sum inside")
            if abs(v) == 1:
                errs.append("bracket worth 1 or -1")
        if t == "pow":
            b = ev(n["b"])
            if n["b"]["t"] not in ("n", "g"):
                errs.append("power base must be a number or a bracket")
            if n["e"] == 1:
                errs.append("exponent 1")
            if abs(b) == 1:
                errs.append("base 1 or -1")
            if n["b"]["t"] == "n" and (abs(b.p) > 5 or b.q > 5):
                errs.append(f"power base {b} too large")
        if t == "ch":
            if len(n["ops"]) != len(n["items"]) - 1:
                errs.append("chain ops/items mismatch")
            for it in n["items"]:
                if it["t"] in ("sum", "ch"):
                    errs.append("sum or chain directly inside a chain")
                if it["t"] == "n" and abs(ev(it)) == 1:
                    errs.append("factor 1 or -1")
            texts = [tex(it) for it in n["items"]]
            if len(set(texts)) != len(texts):
                errs.append("same factor twice in a chain")
        if t == "sum":
            for u in n["terms"]:
                if u["s"] not in (1, -1):
                    errs.append("bad sign")
                if u["x"]["t"] == "sum":
                    errs.append("sum directly inside a sum")
                if u["x"]["t"] == "n" and ev(u["x"]) < 0:
                    errs.append("negative number as a term: the sign goes outside")
            if all(u["x"]["t"] == "n" and ev(u["x"]).q == 1 for u in n["terms"]):
                errs.append("sum of integers only")
            if lcm_den([ev(u["x"]) for u in n["terms"]]) > MID:
                errs.append("common denominator too large")
        if t == "d" and not DEC_RE.match(n["s"]):
            errs.append(f"bad decimal {n['s']}")
    return errs


def is_pos_num(n):
    return n["t"] == "n" and ev(n) > 0


def check(sample):
    errs = []
    p = sample["params"]
    e = p["expr"]
    lvl = sample["level"]
    try:
        truth = ev(e)
        errs += general(e)
    except Exception as ex:  # noqa: BLE001
        return [f"cannot evaluate: {ex}"], None
    flat, layout = unfold(sample["problem"])
    errs += layout
    if flat != tex(e):
        errs.append(f"problem {flat} != tree {tex(e)}")
    ans = sample["answer"]
    if ans.get("kind") != "number" or rat(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    elif ans["value"] != (f"{truth.p}" if truth.q == 1 else f"{truth.p}/{truth.q}"):
        errs.append("answer not reduced")
    if truth == 0 or abs(truth.p) > END or truth.q > END:
        errs.append(f"result {truth} zero or too large")
    prob = sample["problem"]
    if re.search(r"\+\s*-|-\s*-|\+\s*\+|\^\{1\}|\d\.\d", prob):
        errs.append("double sign, exponent 1 or decimal point in problem")
    if lvl != 3 and re.search(r"\^\{0\}", prob):
        errs.append("exponent 0 outside level 3")

    allnodes = list(walk(e))
    cnt = lambda t: sum(1 for n in allnodes if n["t"] == t)  # noqa: E731
    pows = [n for n in allnodes if n["t"] == "pow"]
    nums = [ev(n) for n in allnodes if n["t"] == "n"]
    kind = None
    if lvl == 1:
        if cnt("g") or cnt("pow") or cnt("fr") or cnt("d") or any(v < 0 for v in nums):
            errs.append("level 1: positive numbers only, no brackets, powers, decimals")
        if truth <= 0:
            errs.append("level 1: positive result")
        if e["t"] == "sum" and len(e["terms"]) == 2:
            chains = [u["x"] for u in e["terms"] if u["x"]["t"] == "ch"]
            others = [u["x"] for u in e["terms"] if u["x"]["t"] == "n"]
            if len(chains) == 1 and len(others) == 1 and len(chains[0]["items"]) == 2 and all(i["t"] == "n" for i in chains[0]["items"]):
                kind = "priorità"
        elif e["t"] == "ch" and len(e["items"]) == 3 and e["ops"][0] == ":" and all(i["t"] == "n" for i in e["items"]):
            kind = "da sinistra"
        if kind is None:
            errs.append("level 1: a + b op c, or a : b op c")
    elif lvl == 2:
        if cnt("g") != 1 or cnt("pow") or cnt("fr") or cnt("d"):
            errs.append("level 2: exactly one bracket, no powers, decimals, fractions of fractions")
        ok = e["t"] == "sum" and len(e["terms"]) == 2 and is_pos_num(e["terms"][0]["x"]) and e["terms"][0]["s"] == 1 and e["terms"][1]["x"]["t"] == "ch"
        if ok:
            c = e["terms"][1]["x"]
            its = c["items"]
            ok = len(its) == 2 and sorted(i["t"] for i in its) == ["g", "n"]
        if not ok:
            errs.append("level 2: a ± (b ± c) op d")
        else:
            g = next(i for i in its if i["t"] == "g")
            if not all(is_pos_num(u["x"]) for u in g["x"]["terms"]) or len(g["x"]["terms"]) != 2:
                errs.append("level 2: the bracket holds two positive numbers")
            dneg = ev(next(i for i in its if i["t"] == "n")) < 0
            minus = e["terms"][1]["s"] < 0
            kind = "entrambi" if dneg and minus else "meno" if minus else "fattore negativo" if dneg else None
            if kind is None:
                errs.append("level 2: needs a minus in front or a negative factor")
    elif lvl == 3:
        if cnt("g") or cnt("fr") or cnt("d"):
            errs.append("level 3: no brackets, decimals, fractions of fractions")
        shape = e["t"] == "sum" and len(e["terms"]) == 2 and e["terms"][0]["s"] == 1 and all(u["x"]["t"] == "ch" and len(u["x"]["items"]) == 2 for u in e["terms"])
        if not shape:
            errs.append("level 3: two terms, each a product or quotient of two factors")
        else:
            for u in e["terms"]:
                for it in u["x"]["items"]:
                    if not (it["t"] == "pow" and it["b"]["t"] == "n") and not is_pos_num(it):
                        errs.append("level 3: factors are powers of numbers or positive numbers")
        exps = [n["e"] for n in pows]
        if len(pows) < 3:
            errs.append("level 3: at least three powers")
        if any(x not in (-2, -1, 0, 2, 3) for x in exps):
            errs.append(f"level 3: exponents {exps}")
        if not any(x < 0 for x in exps):
            errs.append("level 3: a negative exponent")
        if not any(ev(n["b"]) < 0 and n["e"] != 0 for n in pows):
            errs.append("level 3: a negative base with nonzero exponent")
        if exps.count(0) > 1:
            errs.append("level 3: at most one exponent 0")
        kind = "esponente zero" if 0 in exps else "esponente negativo"
    elif lvl == 4:
        ok = e["t"] == "fr" and all(s["t"] == "sum" and len(s["terms"]) == 2 and all(is_pos_num(u["x"]) for u in s["terms"]) for s in (e["n"], e["d"]))
        if not ok or cnt("g") or cnt("pow") or cnt("d"):
            errs.append("level 4: (a ± b) / (c ± d) with positive numbers")
        kind = "somme"
    elif lvl == 5:
        ok = e["t"] == "fr" and all(s["t"] == "sum" and len(s["terms"]) == 2 for s in (e["n"], e["d"]))
        if ok:
            for s in (e["n"], e["d"]):
                for u in s["terms"]:
                    x_ = u["x"]
                    if not (x_["t"] == "d" or is_pos_num(x_) or (x_["t"] == "pow" and x_["b"]["t"] == "n" and x_["e"] in (-1, -2))):
                        ok = False
        if not ok or cnt("g") or cnt("d") < 1 or not pows:
            errs.append("level 5: fraction of fractions with a decimal and a negative exponent")
        kind = "decimali e potenze"
    elif lvl == 6:
        ks = {n["k"] for n in allnodes if n["t"] == "g"}
        if ks != {1, 2, 3}:
            errs.append(f"level 6: round, square and curly brackets needed, got {ks}")
        pairs = []
        for n in allnodes:
            if n["t"] == "ch":
                for i in range(len(n["items"]) - 1):
                    a, b = n["items"][i], n["items"][i + 1]
                    if a["t"] == "pow" and b["t"] == "pow" and (i == 0 or n["ops"][i - 1] == "*") and ev(a["b"]) == ev(b["b"]):
                        pairs.append((a, b, n["ops"][i]))
        good = [pr for pr in pairs if pr[0]["b"]["t"] == "g"]
        if len(good) != 1:
            errs.append("level 6: one pair of powers with the same base, the first a bracket")
        else:
            a, b, op = good[0]
            s = a["e"] + b["e"] if op == "*" else a["e"] - b["e"]
            if s == 0 or abs(s) > 3:
                errs.append(f"level 6: exponent after the property {s}")
            kind = "prodotto" if op == "*" else "quoziente"
    else:
        errs.append(f"unknown level {lvl}")
    if kind is not None and p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but expression is {kind}")

    ch = sample.get("choice")
    if ch is None:
        errs.append("no multiple-choice variant")
    else:
        opts = ch["options"]
        if len(opts) != 4:
            errs.append(f"{len(opts)} options")
        vals = []
        for o in opts:
            shown = parse_opt(o["latex"])
            v = rat(o["values"][0])
            if shown is None or shown != v:
                errs.append(f"option {o['latex']} does not show {v}")
            vals.append(v)
        if len(set(vals)) != len(vals):
            errs.append("options not distinct")
        if [i for i, v in enumerate(vals) if v == truth] != [ch.get("correct")]:
            errs.append("choice.correct is wrong or not unique")
    wrong = [rat(w) for w in p.get("wrong", [])]
    if len(wrong) < 3 or truth in wrong or len(set(wrong)) != len(wrong):
        errs.append("params.wrong: at least three distinct values different from the answer")
    steps = sample.get("steps") or []
    if not steps:
        errs.append("no steps")
    else:
        a = abs(truth)
        final = ("-" if truth < 0 else "") + (f"{a.p}" if a.q == 1 else rf"\dfrac{{{a.p}}}{{{a.q}}}")
        if not steps[-1].endswith("= " + final):
            errs.append(f"last step does not end with the answer {final}")
    return errs, kind
