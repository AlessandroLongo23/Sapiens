"""Checker for numeri-razionali-potenze, from specs/exercises/numeri-razionali-potenze.md.

params.expr is a small tree (pow, pp, neg, mul, div, sum). It is evaluated here with SymPy's
Rational ** int, which handles negative exponents by itself, and the tree is also rendered to LaTeX
independently of the generator, so the problem shown is checked against the tree.
"""
import re

from sympy import Integer, Rational

from verify import rat

FRAC_RE = re.compile(r"^(-?)\\frac\{(\d+)\}\{(\d+)\}$|^(-?\d+)$")

CASE_RANGES = {
    2: {"parentesi": (0.45, 0.75), "fuori": (0.25, 0.55)},
    3: {"esponente 0": (0.45, 0.75), "esponente 1": (0.25, 0.55)},
    5: {"prodotto": (0.20, 0.40), "quoziente": (0.20, 0.40), "potenza di potenza": (0.10, 0.30), "due operazioni": (0.10, 0.30)},
    6: {"basi reciproche": (0.45, 0.75), "somma": (0.25, 0.55)},
}


def ev(n):
    t = n["t"]
    if t == "pow":
        b = rat(n["b"])
        if b == 0:
            raise ValueError("zero base")
        return b ** Integer(n["e"])
    if t == "pp":
        return (rat(n["b"]) ** Integer(n["e1"])) ** Integer(n["e2"])
    if t == "neg":
        return -ev(n["x"])
    if t == "mul":
        return ev(n["a"]) * ev(n["b"])
    if t == "div":
        return ev(n["a"]) / ev(n["b"])
    if t == "sum":
        return sum((ev(x["x"]) if x["s"] == 1 else -ev(x["x"])) for x in n["terms"])
    raise ValueError(f"unknown node {t}")


def base_tex(b):
    if b.q == 1:
        return f"({b.p})" if b < 0 else f"{b.p}"
    sign = "-" if b < 0 else ""
    return rf"\left({sign}\frac{{{abs(b.p)}}}{{{b.q}}}\right)"


def tex(n):
    t = n["t"]
    if t == "pow":
        return f"{base_tex(rat(n['b']))}^{{{n['e']}}}"
    if t == "pp":
        b = rat(n["b"])
        inner = f"{base_tex(b)}^{{{n['e1']}}}"
        if b.q == 1 and b > 0:
            return rf"\left({inner}\right)^{{{n['e2']}}}"
        return rf"\left[{inner}\right]^{{{n['e2']}}}"
    if t == "neg":
        return "-" + tex(n["x"])
    if t == "mul":
        return tex(n["a"]) + r" \cdot " + tex(n["b"])
    if t == "div":
        return tex(n["a"]) + " : " + tex(n["b"])
    if t == "sum":
        out = ""
        for i, x in enumerate(n["terms"]):
            sign = ("-" if x["s"] < 0 else "") if i == 0 else (" - " if x["s"] < 0 else " + ")
            out += sign + tex(x["x"])
        return out
    raise ValueError(t)


def walk(n):
    yield n
    for k in ("x", "a", "b"):
        if isinstance(n.get(k), dict):
            yield from walk(n[k])
    for x in n.get("terms", []):
        yield from walk(x["x"])


def parse_num(latex):
    m = FRAC_RE.match(latex)
    if not m:
        return None
    if m.group(4) is not None:
        return Rational(int(m.group(4)))
    v = Rational(int(m.group(2)), int(m.group(3)))
    return -v if m.group(1) else v


def check(sample):
    errs = []
    p = sample["params"]
    e = p["expr"]
    lvl = sample["level"]
    try:
        truth = ev(e)
    except Exception as ex:  # noqa: BLE001
        return [f"cannot evaluate: {ex}"], None
    if sample["problem"] != tex(e):
        errs.append(f"problem {sample['problem']} != tree {tex(e)}")
    ans = sample["answer"]
    if ans.get("kind") != "number" or rat(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    elif ans["value"] != (f"{truth.p}" if truth.q == 1 else f"{truth.p}/{truth.q}"):
        errs.append("answer not reduced")
    if abs(truth.p) > 5000 or truth.q > 5000:
        errs.append("result too large")
    if re.search(r"\+\s*-|-\s*-|\+\s*\+", sample["problem"]):
        errs.append("double sign in problem")
    if lvl in (1, 2, 4, 5) and re.search(r"\^\{[01]\}", sample["problem"]):
        errs.append("exponent 0 or 1 written in the problem")
    if lvl == 6 and re.search(r"\^\{1\}", sample["problem"]):
        errs.append("exponent 1 written in the problem")
    pows = [n for n in walk(e) if n["t"] == "pow"]
    pps = [n for n in walk(e) if n["t"] == "pp"]
    bases = [rat(n["b"]) for n in pows]
    kind = None
    if lvl == 1:
        if e["t"] != "pow" or bases[0] <= 0 or bases[0].q == 1 or not 2 <= e["e"] <= 4:
            errs.append("level 1: (a/b)^n, a/b positive non-integer, n in 2..4")
    elif lvl == 2:
        if e["t"] == "pow" and bases[0] < 0 and bases[0].q != 1 and e["e"] >= 2:
            kind = "parentesi"
        elif e["t"] == "neg" and e["x"]["t"] == "pow" and bases[0] > 0 and bases[0].q != 1 and e["x"]["e"] >= 2:
            kind = "fuori"
        else:
            errs.append("level 2: (-a/b)^n or -(a/b)^n with n >= 2")
    elif lvl == 3:
        if len(pows) != 1 or pows[0]["e"] not in (0, 1) or e["t"] not in ("pow", "neg"):
            errs.append("level 3: single power with exponent 0 or 1")
        else:
            kind = f"esponente {pows[0]['e']}"
    elif lvl == 4:
        if e["t"] != "pow" or not -3 <= e["e"] <= -1:
            errs.append("level 4: single power with exponent -1..-3")
    elif lvl == 5:
        bs = {n["b"] for n in pows} | {n["b"] for n in pps}
        if len(bs) != 1 or e["t"] in ("sum", "neg"):
            errs.append("level 5: one base only, products/quotients/power of a power")
        exps = [n["e"] for n in pows] + [x for n in pps for x in (n["e1"], n["e2"])]
        if not any(x < 0 for x in exps):
            errs.append("level 5: at least one negative exponent")
        if len(pows) + len(pps) < 1 or (len(pows) < 2 and not pps):
            errs.append("level 5: needs two powers or a power of a power")
        if e["t"] == "pp":
            kind = "potenza di potenza"
        elif e["t"] == "mul" and len(pows) == 2:
            kind = "prodotto"
        elif e["t"] == "div" and len(pows) == 2:
            kind = "quoziente"
        elif e["t"] == "div" and e["a"]["t"] == "mul" and len(pows) == 3:
            kind = "due operazioni"
        else:
            errs.append("level 5: unexpected form")
    elif lvl == 6:
        if e["t"] == "sum":
            kind = "somma"
            if len(e["terms"]) != 3 or not any(n["e"] == 0 for n in pows) or not any(n["e"] < 0 for n in pows):
                errs.append("level 6 sum: three powers, one with exponent 0 and one negative")
        elif e["t"] in ("mul", "div") and len(pows) == 2:
            kind = "basi reciproche"
            a, b = bases
            if not (a * b == 1 or a + b == 0 or a * b == -1):
                errs.append("level 6: bases must be reciprocal or opposite")
            if a == b:
                errs.append("level 6: same base")
            for n, bb in zip(pows, bases):
                if bb < 0 and n["e"] % 2:
                    errs.append("level 6: negative base with odd exponent")
        else:
            errs.append("level 6: unexpected form")
    else:
        errs.append(f"unknown level {lvl}")
    if lvl in (2, 3, 5, 6):
        if p.get("case") != kind:
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
            shown = parse_num(o["latex"])
            v = rat(o["values"][0])
            if shown is None or shown != v:
                errs.append(f"option {o['latex']} does not show {v}")
            vals.append(v)
        if len(set(vals)) != len(vals):
            errs.append("options not distinct")
        if [i for i, v in enumerate(vals) if v == truth] != [ch.get("correct")]:
            errs.append("choice.correct is wrong or not unique")
    if not sample.get("steps"):
        errs.append("no steps")
    return errs, kind
