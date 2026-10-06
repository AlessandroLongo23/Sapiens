"""Checker for funzioni-esponenziali, written from specs/exercises/funzioni-esponenziali.md.

Every level is answered again from the text of the exercise, not from the generator's parameters: the value of
f(k) by exact substitution, increasing or decreasing by comparing two values of each function, the largest of four
powers by their numerical values, the base from a^k = y, the asymptote and the image from the values of the
function far to the left and to the right, the domain by looking where the function has no value. Level 9, a
problem in words, is computed again from the numbers of the parameters, which must all be in the text. Then the
form of the options, the mistakes that must be among them, and the share of each case.

Levels 6 and 7 show graphs (checkers/_grafici.py): the formulas of the planes are read again here. At level 6 the
graph marked right is the graph of the function of the problem, the others are other functions, each far enough
from the rest to be told apart in a small drawing, and the mistakes of the specification are among them. At level
7 the function is read from the graph: the base from its two marked points, or the one of four functions that has
that graph.
"""
import math
import re

from sympy import Integer, Rational, nan, sympify, zoo

from checkers._esponenziali import check_choice, forbidden, number_fn, rat, rat_tex, to_expr, x
from checkers._grafici import asymptote, check_graph_options, check_plane

CASE_RANGES = {
    1: {"esponente negativo": (0.45, 0.65), "esponente zero": (0.04, 0.16), "esponente positivo": (0.25, 0.45)},
    4: {"ascissa negativa": (0.45, 0.70), "ascissa positiva": (0.30, 0.55)},
    6: {"a^x": (0.28, 0.46), "in su o in giù": (0.16, 0.32), "a destra o a sinistra": (0.18, 0.34), "ribaltata rispetto all'asse x": (0.03, 0.13), "ribaltata rispetto all'asse y": (0.03, 0.12)},
    7: {"la base": (0.32, 0.50), "in su o in giù": (0.20, 0.38), "a destra o a sinistra": (0.22, 0.40)},
    8: {"esponente fratto": (0.30, 0.55), "esponenziale a denominatore": (0.25, 0.50), "esponenziale a denominatore, esponente x - h": (0.12, 0.35)},
    9: {"aumento percentuale": (0.18, 0.42), "diminuzione percentuale": (0.08, 0.32), "raddoppio": (0.18, 0.42), "dimezzamento": (0.12, 0.35)},
}

KIND = {1: "number", 2: "choice", 3: "choice", 4: "number", 5: "choice", 6: "choice", 7: "choice", 8: "set", 9: "number"}
# Level 7 asks for a number when the graph is the one of a^x: the base.
READ_BASE = "la base"
GRAPH_BASES = {Rational(2), Rational(3), Rational(1, 2), Rational(1, 3)}
PLAIN_BASES = GRAPH_BASES | {Rational(4), Rational(1, 4)}
READ_BASES = PLAIN_BASES | {Rational(5), Rational(1, 5)}
WINDOWS_6 = {"a^x": [-4, 4, -3, 5], "in su o in giù": [-5, 5, -5, 5], "a destra o a sinistra": [-5, 5, -5, 5], "ribaltata rispetto all'asse x": [-4, 4, -4, 4], "ribaltata rispetto all'asse y": [-4, 4, -4, 4]}
WINDOWS_7 = {"la base": [-4, 4, -2, 6], "in su o in giù": [-5, 5, -4, 6], "a destra o a sinistra": [-5, 5, -2, 6]}


def graph_expr(form, base, d):
    """The function of a graph of levels 6 and 7, from what the parameters say."""
    return {
        "a^x": base**x,
        "la base": base**x,
        "in su o in giù": base**x + d,
        "a destra o a sinistra": base ** (x - d),
        "ribaltata rispetto all'asse x": -(base**x),
        "ribaltata rispetto all'asse y": base ** (-x),
    }.get(form)


def graph_mistakes(form, base, d):
    """The wrong readings that must be among the options: (name, function)."""
    return {
        "a^x": [("the reciprocal base", (1 / base) ** x)],
        "in su o in giù": [("the shift to the other side", base**x - d), ("the shift along x", base ** (x - d))],
        "a destra o a sinistra": [("the shift to the other side", base ** (x + d)), ("the shift along y", base**x + d)],
        "ribaltata rispetto all'asse x": [("the reflection in the other axis", base ** (-x))],
        "ribaltata rispetto all'asse y": [("the reflection in the other axis", -(base**x))],
    }.get(form, [])
BASES_1 = {Rational(n, d) for n, d in [(2, 1), (3, 1), (4, 1), (5, 1), (10, 1), (1, 2), (1, 3), (1, 4), (2, 3), (3, 2), (3, 4), (2, 5)]}


def items(problem):
    return [s.strip() for s in problem.split(r"\quad")]


def dom_tex(values):
    vals = sorted(rat(v) for v in values)
    if not vals:
        return r"D = \mathbb{R}"
    return "D = \\mathbb{R} \\setminus \\{" + ",\\ ".join(rat_tex(v) for v in vals) + "\\}"


def image_tex(value):
    if value == "(-oo,oo)":
        return r"\mathbb{R}"
    m = re.fullmatch(r"([\[(])(-oo|-?\d+),(oo|-?\d+)([\])])", value)
    if not m:
        raise ValueError(f"unreadable image {value!r}")
    lo, hi = m.group(2), m.group(3)
    if hi == "oo":
        return f"{'[' if m.group(1) == '[' else chr(92) + 'mathopen{]}'}{lo}, +\\infty\\mathclose{{[}}"
    return f"\\mathopen{{]}}-\\infty, {hi}{']' if m.group(4) == ']' else chr(92) + 'mathclose{[}'}"


def undefined(expr, v):
    val = expr.subs(x, v)
    return val in (zoo, nan) or val.has(zoo) or val.has(nan)


def prose(problem):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", problem)
    if not m:
        raise ValueError("a problem in words must be an array of text lines")
    lines = m.group(1).split(r" \\ ")
    out = []
    for line in lines:
        t = re.fullmatch(r"\\text\{(.*)\}", line)
        if not t:
            raise ValueError(f"not a text line: {line}")
        if len(t.group(1).replace("$", "").replace("\\", "")) > 46:
            raise ValueError(f"line too long: {line}")
        out.append(t.group(1))
    return " ".join(out)


def same(f, g):
    """Two functions with the same values at five points where both exist."""
    for v in (-7.3, -1.3, 0.37, 1.9, 6.1):
        a, b = f(v), g(v)
        if math.isfinite(a) and math.isfinite(b) and abs(a - b) > 1e-9 * max(1.0, abs(a), abs(b)):
            return False
        if math.isfinite(a) != math.isfinite(b):
            return False
    return True


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    problem = sample["problem"]
    prompt = sample.get("prompt", "")
    ans = sample["answer"]
    case = p.get("case")
    kind = "number" if lvl == 7 and case == READ_BASE else KIND[lvl]
    if ans.get("kind") != kind:
        return [f"answer.kind is {ans.get('kind')}, expected {kind}"], None
    if (lvl == 7) != bool(sample.get("scene")) or (lvl == 6) != bool(sample.get("solutionScene")):
        errs.append("a graph under the problem only at level 7, one with the solution only at level 6")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or no solution")
    if lvl != 9:
        errs += forbidden(problem)

    truth_key = None  # the values of the right option, joined
    must = []  # keys of mistakes that must be among the wrong options

    if lvl == 1:
        m = re.fullmatch(r"Calcola f\((-?\d)\)\.", prompt)
        f = re.fullmatch(r"f\(x\) = (.+)", problem)
        if not m or not f:
            return ["level 1: unreadable prompt or problem"], None
        k = int(m.group(1))
        expr = to_expr(f.group(1))
        base = expr.subs(x, 1)
        if base not in BASES_1 or expr != base**x:
            errs.append("level 1: f(x) must be a^x with a base of the list")
        if not -3 <= k <= 3 or k == 1:
            errs.append("level 1: k out of range")
        v = Rational(base) ** k
        if abs(v.p) > 1000 or v.q > 1000:
            errs.append("level 1: value too large")
        truth_key = str(v)
        if case != ("esponente negativo" if k < 0 else "esponente zero" if k == 0 else "esponente positivo"):
            errs.append("level 1: wrong case")
        if k < 0:
            must.append(str(-(Rational(base) ** (-k))))
        if Rational(p.get("base", "0")) != base or p.get("k") != k:
            errs.append("level 1: params do not say the exercise")
    elif lvl == 2:
        fs = items(problem)
        want_inc = {"Quale di queste funzioni è crescente?": True, "Quale di queste funzioni è decrescente?": False}.get(prompt)
        if want_inc is None or len(fs) != 4 or len(set(fs)) != 4:
            return ["level 2: unreadable prompt or not four functions"], None
        hits = []
        for ftex in fs:
            m = re.fullmatch(r"y = (.+)", ftex)
            g = number_fn(to_expr(m.group(1)))
            if (g(1.0) > g(0.0)) == want_inc:
                hits.append(ftex)
        if len(hits) != 1:
            return [f"level 2: {len(hits)} functions answer the question"], None
        if not any("^{-x}" in f for f in fs):
            errs.append("level 2: no function written with -x")
        right = ans["options"][ans["correct"]]
        if right["latex"] != hits[0]:
            errs.append("level 2: the right option is not the function that answers")
        if {o["latex"] for o in ans["options"]} != set(fs):
            errs.append("level 2: the options are not the four functions of the problem")
        truth_key = "|".join(right["values"])
        if case != ("crescente" if want_inc else "decrescente") + (", con -x" if "^{-x}" in hits[0] else ""):
            errs.append("level 2: wrong case")
    elif lvl == 3:
        ps = items(problem)
        want_max = {"Qual è il più grande di questi numeri?": True, "Qual è il più piccolo di questi numeri?": False}.get(prompt)
        if want_max is None or len(ps) != 4 or len(set(ps)) != 4:
            return ["level 3: unreadable prompt or not four powers"], None
        vals = {t: float(to_expr(t).evalf(30)) for t in ps}
        if len({t[: t.rindex("^")] for t in ps}) != 1:
            errs.append("level 3: the four powers must have the same base")
        ordered = sorted(ps, key=lambda t: vals[t])
        if any(b / a < 1.01 for a, b in zip([vals[t] for t in ordered], [vals[t] for t in ordered][1:])):
            errs.append("level 3: two powers are too close")
        if not any(r"\sqrt" in t or r"\pi" in t for t in ps):
            errs.append("level 3: no irrational exponent")
        best = ordered[-1] if want_max else ordered[0]
        right = ans["options"][ans["correct"]]
        if right["latex"] != best:
            errs.append("level 3: the right option is not the largest (or smallest) power")
        if {o["latex"] for o in ans["options"]} != set(ps):
            errs.append("level 3: the options are not the four powers of the problem")
        # the exponent written in the values must be the one of the LaTeX
        for o in ans["options"]:
            want = float((Rational(p["base"]) ** sympify(o["values"][0])).evalf(30))
            if abs(want - vals[o["latex"]]) > 1e-12 * max(1.0, abs(want)):
                errs.append(f"level 3: option {o['latex']} has values {o['values']}")
        base = to_expr(ps[0][: ps[0].rindex("^")])
        if Rational(p.get("base", "0")) != base:
            errs.append("level 3: params do not say the base")
        if case != f"{'base maggiore di 1' if base > 1 else 'base tra 0 e 1'}, {'il più grande' if want_max else 'il più piccolo'}":
            errs.append("level 3: wrong case")
        truth_key = "|".join(right["values"])
        must.append("|".join(next(o["values"] for o in ans["options"] if o["latex"] == (ordered[0] if want_max else ordered[-1]))))
    elif lvl == 4:
        m = re.fullmatch(r"P\\left\((-?\d), (.+)\\right\)", problem)
        if not m or prompt != "Trova la base a della funzione esponenziale y = a^x che passa per il punto P.":
            return ["level 4: unreadable prompt or point"], None
        k = int(m.group(1))
        v = Rational(to_expr(m.group(2)))
        a = rat(ans["value"])
        if k not in (-3, -2, -1, 2, 3):
            errs.append("level 4: abscissa out of the list")
        if a <= 0 or a == 1 or a**k != v:
            errs.append("level 4: the base does not give the point")
        if abs(v.p) > 1000 or v.q > 1000:
            errs.append("level 4: ordinate too large")
        truth_key = str(a)
        if case != ("ascissa negativa" if k < 0 else "ascissa positiva"):
            errs.append("level 4: wrong case")
        must.append(str(1 / a))
        if p.get("k") != k or Rational(p.get("value", "0")) != v:
            errs.append("level 4: params do not say the point")
    elif lvl == 5:
        m = re.fullmatch(r"y = (.+)", problem)
        ask = {"Qual è l'immagine della funzione?": "immagine", "Qual è l'asintoto orizzontale del grafico della funzione?": "asintoto"}.get(prompt)
        if not m or ask is None or ask != p.get("ask"):
            return ["level 5: unreadable prompt or function"], None
        g = number_fn(to_expr(m.group(1)))
        mine = (-1 if p["flipX"] else 1) * Rational(p["base"]) ** ((-x if "asse y" in p["form"] else x) - p["h"]) + p["k"]
        if not same(number_fn(mine), g):
            errs.append("level 5: params do not say the function")
        far = [v for v in (g(-60.0), g(60.0)) if math.isfinite(v) and abs(v) < 1e6]
        if len(far) != 1 or abs(far[0] - round(far[0])) > 1e-9:
            return ["level 5: no single horizontal asymptote with an integer height"], None
        L = round(far[0])
        ys = [g(v / 4) for v in range(-40, 41)]
        above = all(y > L for y in ys)
        below = all(y < L for y in ys)
        if above == below:
            return ["level 5: the graph is not on one side of its asymptote"], None
        truth_key = f"y|{L}" if ask == "asintoto" else (f"({L},oo)" if above else f"(-oo,{L})")
        if not str(case).startswith(ask + ": "):
            errs.append("level 5: wrong case")
        for o in ans["options"]:
            want = f"{o['values'][0]} = {o['values'][1]}" if ask == "asintoto" else image_tex(o["values"][0])
            if o["latex"] != want:
                errs.append(f"level 5: option {o['values']} is written {o['latex']}")
        if ask == "immagine" and L != 0:
            must.append("(0,oo)")
        if ask == "asintoto" and L != 0:
            must.append("y|0")
    elif lvl == 6:
        m = re.fullmatch(r"y = (.+)", problem)
        if not m or prompt != "Qual è il grafico della funzione?":
            return ["level 6: unreadable prompt or function"], None
        g = number_fn(to_expr(m.group(1)))
        form, d = p.get("form"), p.get("d")
        base = Rational(p.get("base", "0"))
        mine = graph_expr(form, base, d)
        if form not in WINDOWS_6 or mine is None or not same(number_fn(mine), g):
            return ["level 6: params do not say the function"], None
        if case != form:
            errs.append("level 6: wrong case")
        if base not in (PLAIN_BASES if form == "a^x" else GRAPH_BASES):
            errs.append("level 6: base out of the list")
        if form in ("in su o in giù", "a destra o a sinistra") and d not in (-3, -2, 2, 3):
            errs.append("level 6: a shift of 2 or 3 expected")
        planes = check_graph_options(ans, g, to_expr, errs)
        if any(pl and len(pl.points) > 1 for pl in planes):
            errs.append("level 6: a small graph has one marked point at most")
        if any(pl and list(pl.window) != WINDOWS_6[form] for pl in planes) or p.get("window") != WINDOWS_6[form]:
            errs.append("level 6: not the window of the specification")
        fns = [pl.curves[0] for pl in planes if pl]
        for name, e in graph_mistakes(form, base, d):
            if not any(same(number_fn(e), f) for f in fns):
                errs.append(f"level 6: {name} is not among the graphs")
        sol = check_plane(sample.get("solutionScene"), to_expr, errs, "solution graph")
        if sol and (not same(sol.curves[0], g) or not 1 <= len(sol.points) <= 2 or list(sol.window) != WINDOWS_6[form]):
            errs.append("level 6: the graph of the solution is not the graph of the function with its points")
        truth_key = m.group(1)
    elif lvl == 7:
        form, d = p.get("form"), p.get("d")
        base = Rational(p.get("base", "0"))
        if problem != "" or form not in WINDOWS_7 or case != form:
            return ["level 7: a problem beside the graph, or an unknown case"], None
        pl = check_plane(sample.get("scene"), to_expr, errs, "graph", points=2)
        if not pl:
            return errs, None
        f = pl.curves[0]
        if list(pl.window) != WINDOWS_7[form] or p.get("window") != WINDOWS_7[form]:
            errs.append("level 7: not the window of the specification")
        mine = graph_expr(form, base, d)
        if not same(number_fn(mine), f):
            errs.append("level 7: params do not say the function of the graph")
        # the two points say the base: one at distance 1 from the asymptote, the other one step aside, farther
        L = asymptote(f) or 0.0
        L = 0.0 if abs(L) < 1e-9 else L
        by_distance = sorted((abs(py - L), px) for px, py in pl.points)
        if len(by_distance) == 2 and (abs(by_distance[0][0] - 1) > 1e-9 or abs(by_distance[1][1] - by_distance[0][1]) != 1 or by_distance[1][0] < 2):
            errs.append("level 7: the two points do not say the base")
        if form == READ_BASE:
            a = rat(ans["value"])
            if prompt != "Il grafico è quello di una funzione esponenziale $y = a^x$. Trova la base $a$.":
                errs.append("level 7: wrong prompt")
            if a not in READ_BASES or not same(number_fn(a**x), f):
                errs.append("level 7: the base does not give the graph")
            if a != base or d != 0 or sample.get("solution") != f"a = {rat_tex(a)}":
                errs.append("level 7: params or solution do not say the base")
            truth_key = str(a)
            must.append(str(1 / a))
        else:
            if prompt != "Quale funzione ha questo grafico?":
                errs.append("level 7: wrong prompt")
            if base not in GRAPH_BASES or d not in (-3, -2, -1, 1, 2, 3):
                errs.append("level 7: base or shift out of the list")
            if (form == "in su o in giù") != (L != 0) or (L != 0 and L != d):
                errs.append("level 7: the asymptote does not say the case")
            fns = []
            for o in ans["options"]:
                m = re.fullmatch(r"y = (.+)", o.get("latex", ""))
                if not m or o.get("values") != [m.group(1)] or o.get("scene"):
                    return [f"level 7: unreadable option {o.get('latex')!r}"], None
                fns.append(number_fn(to_expr(m.group(1))))
            hits = [i for i, fn in enumerate(fns) if same(fn, f)]
            if hits != [ans.get("correct")]:
                errs.append(f"level 7: the functions with that graph are the options {hits}, the right one is {ans.get('correct')}")
            if any(same(fns[i], fns[j]) for i in range(len(fns)) for j in range(i + 1, len(fns))):
                errs.append("level 7: two options are the same function")
            for name, e in graph_mistakes(form, base, d):
                if not any(same(number_fn(e), fn) for fn in fns):
                    errs.append(f"level 7: {name} is not among the options")
            right = ans["options"][ans["correct"]] if isinstance(ans.get("correct"), int) and 0 <= ans["correct"] < len(ans["options"]) else {}
            truth_key = "|".join(right.get("values", []))
    elif lvl == 8:
        m = re.fullmatch(r"y = (.+)", problem)
        if not m or prompt != "Trova il dominio della funzione.":
            return ["level 8: unreadable prompt or function"], None
        expr = to_expr(m.group(1))
        if p.get("form") == "esponente":
            mine = Integer(p["a"]) ** (Integer(p["n"]) / (x - p["c"]))
        else:
            mine = Integer(p["n"]) / (Integer(p["a"]) ** (x - p["h"]) - Integer(p["a"]) ** Integer(p["m"]))
        if not same(number_fn(mine), number_fn(expr)):
            errs.append("level 8: params do not say the function")
        out = [rat(v) for v in ans["values"]]
        if len(out) != 1 or out[0].q != 1:
            errs.append("level 8: one integer left out expected")
        for v in out:
            if not undefined(expr, v):
                errs.append(f"level 8: the function has a value in {v}")
        probes = {Integer(i) for i in range(-12, 13)} | {rat(v) for d in p.get("distractors", []) for v in d["values"]}
        for v in probes - set(out):
            if undefined(expr, v):
                errs.append(f"level 8: the function has no value in {v}, which is not left out")
        if ans.get("latex") != dom_tex(ans["values"]) or sample.get("solution") != dom_tex(ans["values"]):
            errs.append("level 8: the domain is not written as the lesson writes it")
        truth_key = "|".join(ans["values"])
        must.append("")
        want_case = "esponente fratto" if "^{\\frac" in problem else "esponenziale a denominatore" if "^x" in problem else "esponenziale a denominatore, esponente x - h"
        if case != want_case:
            errs.append("level 8: wrong case")
    elif lvl == 9:
        try:
            story = prose(problem)
        except ValueError as e:
            return [f"level 9: {e}"], None
        C, t = p["C"], p["t"]
        kind = p.get("story")
        if kind in ("aumento", "diminuzione"):
            pc = p["p"]
            f = Rational(100 + pc if kind == "aumento" else 100 - pc, 100)
            v = C * f**t
            linear = C * Rational(100 + pc * t if kind == "aumento" else 100 - pc * t, 100)
            if linear.q == 1 and linear > 0:
                must.append(str(linear))
            need = [str(C), rf"${pc}\%$", f"{t} anni"]
            if t not in (2, 3) or pc not in (5, 10, 20, 25, 50):
                errs.append("level 9: percentage or years out of the list")
        elif kind in ("raddoppio", "dimezzamento"):
            T = p["T"]
            n = Rational(t, T)
            if n.q != 1 or not 2 <= n <= 5:
                return ["level 9: the time is not 2 to 5 periods"], None
            v = Rational(C) * 2**n if kind == "raddoppio" else Rational(C, 2**n)
            linear = Rational(C * 2 * n) if kind == "raddoppio" else Rational(C, 2 * n)
            if linear.q == 1 and linear != v:
                must.append(str(linear))
            need = [str(C), f"ogni {T} ore", f"dopo {t} ore"]
        else:
            return ["level 9: unknown story"], None
        for piece in need:
            if piece not in story:
                errs.append(f"level 9: {piece!r} is not in the text")
        want_case = {"aumento": "aumento percentuale", "diminuzione": "diminuzione percentuale", "raddoppio": "raddoppio", "dimezzamento": "dimezzamento"}[kind]
        if case != want_case:
            errs.append("level 9: wrong case")
        if Rational(v).q != 1:
            errs.append("level 9: the result must be an integer")
        truth_key = str(v)
        if sample.get("solution") != str(v) or prompt != "Risolvi il problema.":
            errs.append("level 9: wrong solution or prompt")

    # the answer and the options
    if kind == "number":
        if ans.get("value") != truth_key:
            errs.append(f"answer {ans.get('value')} != {truth_key}")
    if kind == "choice":
        right = ans["options"][ans["correct"]] if isinstance(ans.get("correct"), int) and 0 <= ans["correct"] < len(ans["options"]) else None
        if not right or "|".join(right["values"]) != truth_key:
            errs.append(f"the right option is not {truth_key}")
        if sample.get("choice") and sample["choice"] != ans:
            errs.append("choice differs from the answer")
        if lvl == 6:
            # four graphs: they have no LaTeX to compare, and the solution says the right one in words
            opts = ans["options"]
            if len({"|".join(o.get("values", [])) for o in opts}) != len(opts):
                errs.append("options not distinct")
            if not re.fullmatch(r"\\text\{La curva che (sale|scende) e passa per \}\(-?\d, -?\d\)(\\text\{ e \}\(-?\d, -?\d\))?", sample.get("solution", "")):
                errs.append("level 6: the solution does not say the right graph")
        else:
            if sample.get("solution") != (right or {}).get("latex"):
                errs.append("solution is not the right option")
            opts = check_choice(ans, truth_key, errs)
    else:
        ds = p.get("distractors", [])
        if len(ds) != 3:
            errs.append("three distractors expected")
        opts = check_choice(sample.get("choice"), truth_key, errs)
        if {"|".join(o["values"]) for o in opts} != {truth_key} | {"|".join(d["values"]) for d in ds}:
            errs.append("the options are not the answer and the three distractors")
        for o in opts:
            if lvl == 8:
                want = dom_tex(o["values"])
            else:
                want = rat_tex(rat(o["values"][0]))
            if o["latex"] != want:
                errs.append(f"option {o['values']} is written {o['latex']}")
    keys = {"|".join(o["values"]) for o in opts}
    for k in must:
        if k != truth_key and k not in keys:
            errs.append(f"the mistake {k!r} is not among the options")
    return errs, case
