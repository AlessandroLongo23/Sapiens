"""Checker for composizione-di-funzioni (specs/exercises/composizione-di-funzioni.md, lesson 44).

Written from the spec, not from the generator. Everything is read back from the text the student sees:
- level 1: the sets and the arrows of f and g are parsed from the problem, the composite is followed
  arrow by arrow, and f o g is refused because g lands outside the domain of f;
- levels 2-4: f(x) and g(x) are parsed from the LaTeX of the problem and composed with SymPy
  (substitution and expansion); every wrong option must be one of the mistakes the spec names;
- levels 5-6: SymPy solves y = f(x) for x, swaps the letters and checks f(f^{-1}(x)) = x;
- level 7: invertibility is decided from the counts of the arrows or from the facts of the lesson on
  each family (a x + b on R and on Z, the constant, k x^2 on R and on [0, +inf)); the point of the
  inverse's graph is (q, p), and exactly one option satisfies f(v) = u.
Every option's LaTeX is parsed and compared with its values.
"""
import re

from sympy import Poly, Rational, Symbol, expand, simplify, solve, sympify
from sympy.parsing.sympy_parser import implicit_multiplication_application, parse_expr, standard_transformations

from verify import FORBIDDEN

x = Symbol("x")
y = Symbol("y")
TRANSF = standard_transformations + (implicit_multiplication_application,)

CASE_RANGES = {
    1: {"gf": (0.6, 0.8), "fg": (0.2, 0.4)},
    2: {"gf": (0.4, 0.6), "fg": (0.4, 0.6)},
    3: {"gf": (0.3, 0.5), "fg": (0.2, 0.4), "ff": (0.2, 0.4)},
    4: {"gf": (0.6, 0.8), "fg": (0.2, 0.4)},
    7: {"punto": (0.28, 0.46), "biettiva": (0.09, 0.22), "iniettiva": (0.09, 0.22), "suriettiva": (0.09, 0.22), "nessuna": (0.09, 0.22)},
}

EXTRA_FORBIDDEN = [("1(", re.compile(r"(?<![\d.])1\("))]

INV_CODES = {"biettiva": "si-biettiva", "iniettiva": "no-non-suriettiva", "suriettiva": "no-non-iniettiva", "nessuna": "no-nessuna"}
INV_ORDER = ["biettiva", "iniettiva", "suriettiva", "nessuna"]
INV_WORDS = {
    "si-biettiva": r"\text{sì, è biettiva}",
    "no-non-suriettiva": r"\text{no: iniettiva, non suriettiva}",
    "no-non-iniettiva": r"\text{no: suriettiva, non iniettiva}",
    "no-nessuna": r"\text{no: né iniettiva né suriettiva}",
}
IMPOSSIBLE = "non-si-puo"


def tex(t):
    """A formula of the generator (polynomials, \\frac, \\cdot) read into SymPy."""
    s = t.strip().replace(r"\left", "").replace(r"\right", "").replace(r"\cdot", "*")
    while True:
        n = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", s)
        if n == s:
            break
        s = n
    s = re.sub(r"\^\{([^{}]*)\}", r"**(\1)", s).replace("^", "**")
    if "\\" in s or "{" in s or "}" in s:
        raise ValueError(f"unparsed LaTeX: {t!r}")
    return parse_expr(s, local_dict={"x": x, "y": y}, transformations=TRANSF)


def formula(problem, name):
    m = re.search(name + r"\(x\) = (.*?)(?:,\\quad| \\\\| \\end\{gathered\}| \\end\{array\}|$)", problem)
    if not m:
        raise ValueError(f"no {name}(x) in the problem")
    return tex(m.group(1))


def rat_list(xs):
    return [Rational(v) for v in xs]


def poly_params(p):
    return sum(Rational(c) * x**i for i, c in enumerate(p))


def same(a, b):
    return simplify(a - b) == 0


def expr_choice(ch, truth, errors, errs, need_expanded=False):
    """Four options, LaTeX = values, one right, the others among the named mistakes."""
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice needs 4 options, got {len(opts)}")
        return
    vals = []
    for o in opts:
        v = sympify(o["values"][0], locals={"x": x})
        try:
            shown = tex(o["latex"])
        except Exception as e:  # noqa: BLE001
            errs.append(f"option latex unreadable: {e}")
            return
        if not same(shown, v):
            errs.append(f"option latex {o['latex']!r} != value {o['values'][0]}")
        if need_expanded and ("(" in o["latex"] or not is_normal(o["latex"])):
            errs.append(f"option not an expanded ordered polynomial: {o['latex']}")
        vals.append(v)
    for i in range(4):
        for j in range(i + 1, 4):
            if same(vals[i], vals[j]):
                errs.append(f"options {i} and {j} are equal")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < 4 or not same(vals[idx], truth):
        errs.append("choice.correct is not the answer")
    if sum(1 for v in vals if same(v, truth)) != 1:
        errs.append("not exactly one right option")
    for i, v in enumerate(vals):
        if isinstance(idx, int) and i != idx and not any(same(v, e) for e in errors):
            errs.append(f"distractor {opts[i]['latex']} is not one of the named mistakes")


def is_normal(latex):
    """Powers of x strictly decreasing, as the lesson writes polynomials."""
    degs = []
    for term in re.split(r"(?<!^)\s[+-]\s", latex.strip()):
        m = re.search(r"x\^(\d+)", term)
        degs.append(int(m.group(1)) if m else (1 if "x" in term else 0))
    return all(a > b for a, b in zip(degs, degs[1:]))


def check_common(sample, errs):
    for name, rx in FORBIDDEN + EXTRA_FORBIDDEN:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden '{name}': {sample['problem']}")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")


# ---------------------------------------------------------------------------
# Level 1


def parse_set(problem, name):
    m = re.search(name + r" = \\\{(.*?)\\\}", problem)
    if not m:
        raise ValueError(f"no set {name}")
    return [s.strip() for s in m.group(1).split(r",\ ")]


def parse_arrows(problem, name):
    m = re.search(name + r": \\ (.*?)(?: \\\\|$)", problem)
    if not m:
        raise ValueError(f"no arrows of {name}")
    pairs = re.findall(r"(\w+) \\mapsto (\w+)", m.group(1))
    return dict(pairs)


def level1(sample, errs):
    pr, p = sample["problem"], sample["params"]
    A, B, C = parse_set(pr, "A"), parse_set(pr, "B"), parse_set(pr, "C")
    f, g = parse_arrows(pr, "f"), parse_arrows(pr, "g")
    if [A, B, C] != [p["A"], p["B"], p["C"]]:
        errs.append("sets in the problem differ from params")
    if sorted(f) != sorted(A) or any(v not in B for v in f.values()):
        errs.append("f is not a function from A to B")
    if sorted(g) != sorted(B) or any(v not in C for v in g.values()):
        errs.append("g is not a function from B to C")
    if set(g.values()) != set(C):
        errs.append("some element of C receives no arrow of g")
    if not 3 <= len(A) <= 4 or A != [str(i) for i in range(1, len(A) + 1)]:
        errs.append("A must be {1, ..., n} with 3 or 4 elements")
    if not 3 <= len(B) <= 5 or B != list("abcde")[: len(B)]:
        errs.append("B must be letters a.. with 3 to 5 elements")
    if not 2 <= len(C) <= 3 or any(c not in ("10", "20", "30", "40") for c in C):
        errs.append("C must be 2-3 of 10, 20, 30, 40")
    if set(A) & set(C):
        errs.append("A and C share elements: f o g could make sense")
    asked = "gf" if pr.rstrip().endswith(r"g \circ f = \ ? \end{gathered}") else "fg" if pr.rstrip().endswith(r"f \circ g = \ ? \end{gathered}") else None
    if asked != p.get("case"):
        errs.append(f"asked {asked}, params.case {p.get('case')}")
    comp = [g[f[a]] for a in A]
    if len(set(comp)) < 2:
        errs.append("constant composite")
    truth = comp if asked == "gf" else [IMPOSSIBLE]
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer.kind must be choice")
        return asked
    opts = ans["options"]
    keys = [tuple(o["values"]) for o in opts]
    if len(opts) != 4 or len(set(keys)) != 4:
        errs.append(f"4 distinct options needed: {keys}")
    for o in opts:
        if o["values"] == [IMPOSSIBLE]:
            if o["latex"] != r"\text{non si può calcolare}":
                errs.append("impossible option badly written")
            continue
        shown = re.findall(r"(\d+) \\mapsto (\d+)", o["latex"])
        if [a for a, _ in shown] != A or [v for _, v in shown] != o["values"]:
            errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        if any(v not in C for v in o["values"]):
            errs.append("option with a value outside C")
        if len(A) == 4 and not o["latex"].startswith(r"\begin{gathered}"):
            errs.append("4 arrows must go on two lines")
    idx = ans.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or list(keys[idx]) != truth:
        errs.append("choice.correct is not the answer")
    if (IMPOSSIBLE,) not in keys:
        errs.append("the option 'non si può calcolare' is missing")
    if asked == "fg" and tuple(comp) not in keys:
        errs.append("f o g asked: g o f (the order mistake) must be an option")
    ch = sample.get("choice")
    if ch is not None and (ch.get("correct") != idx or [o["values"] for o in ch["options"]] != [o["values"] for o in opts]):
        errs.append("choice differs from the answer")
    return asked


# ---------------------------------------------------------------------------
# Levels 2-4


def asked_of(problem):
    m = re.search(r"\((g|f) \\circ (f|g)\)\((-?\d+|x)\) = \\ \?", problem)
    if not m:
        raise ValueError("no question in the problem")
    return m.group(1) + m.group(2), m.group(3)


def level2(sample, errs):
    pr, p = sample["problem"], sample["params"]
    f, g = formula(pr, "f"), formula(pr, "g")
    if not same(f, poly_params(p["f"])) or not same(g, poly_params(p["g"])):
        errs.append("f, g in the problem differ from params")
    asked, at = asked_of(pr)
    if asked not in ("gf", "fg") or asked != p.get("case") or at != p.get("x"):
        errs.append("question differs from params")
    outer, inner = (g, f) if asked == "gf" else (f, g)
    v = int(at)
    if not -3 <= v <= 3:
        errs.append("x out of [-3, 3]")
    degs = sorted([Poly(f, x).degree(), Poly(g, x).degree()])
    if degs not in ([1, 1], [1, 2]):
        errs.append(f"degrees {degs}: one linear and x^2 + c, or two linear")
    for h in (f, g):
        P = Poly(h, x)
        if P.degree() == 2 and (P.coeff_monomial(x**2) != 1 or P.coeff_monomial(x) != 0):
            errs.append("the quadratic must be x^2 + c")
    mid = inner.subs(x, v)
    truth = outer.subs(x, mid)
    reversed_ = inner.subs(x, outer.subs(x, v))
    if truth == reversed_:
        errs.append("the two orders give the same value")
    if abs(truth) > 150 or abs(reversed_) > 150:
        errs.append("values over 150")
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    ch = sample.get("choice")
    if ch is not None:
        vals = [Rational(o["values"][0]) for o in ch["options"]]
        if any(o["latex"] != o["values"][0] for o in ch["options"]):
            errs.append("option latex differs from value")
        if len(vals) != 4 or len(set(vals)) != 4:
            errs.append("4 distinct options needed")
        idx = ch.get("correct")
        if not isinstance(idx, int) or vals[idx] != truth or vals.count(truth) != 1:
            errs.append("choice.correct is not the answer")
        named = {reversed_, f.subs(x, v) * g.subs(x, v), mid}
        if not named & (set(vals) - {truth}):
            errs.append("no distractor from the named mistakes")
    return asked


def named_formula_errors(outer, inner):
    """The mistakes of the spec for outer(inner(x)), expanded."""
    O, I = Poly(outer, x), Poly(inner, x)
    out = [expand(inner.subs(x, outer)), expand(outer * inner), expand(outer + inner)]
    if O.degree() == 2:
        k, pp, c = O.coeff_monomial(x**2), O.coeff_monomial(x), O.coeff_monomial(1)
        a, b = I.coeff_monomial(x), I.coeff_monomial(1)
        out.append(expand(k * (a**2 * x**2 + b**2) + pp * inner + c))  # (ax + b)^2 = a^2x^2 + b^2
        out.append(expand(k * inner**2 + pp * a * x + b + c))  # p(ax + b) = pax + b
        out.append(expand(k * (a * x - b) ** 2 + pp * inner + c))  # sign of the double product
    elif I.degree() == 2:
        a, b = O.coeff_monomial(x), O.coeff_monomial(1)
        lead = I.LC() * x**2
        out.append(expand(a * lead + (inner - lead) + b))  # only the first term multiplied
        out.append(expand(a * inner - b))
    else:
        a, b = O.coeff_monomial(x), O.coeff_monomial(1)
        c, d = I.coeff_monomial(x), I.coeff_monomial(1)
        out.append(a * c * x + d + b)  # constant of inner not multiplied
        out.append(a * c * x - a * d + b)  # sign
    return out


def level34(sample, errs):
    pr, p, lvl = sample["problem"], sample["params"], sample["level"]
    asked, at = asked_of(pr)
    if at != "x" or asked != p.get("case"):
        errs.append("question differs from params")
    f = formula(pr, "f")
    if not same(f, poly_params(p["f"])):
        errs.append("f in the problem differs from params")
    if asked == "ff":
        if "g(x)" in pr:
            errs.append("f o f shows g")
        g = f
    else:
        g = formula(pr, "g")
        if not same(g, poly_params(p["g"])):
            errs.append("g in the problem differs from params")
    outer, inner = {"gf": (g, f), "fg": (f, g), "ff": (f, f)}[asked]
    truth = expand(outer.subs(x, inner))
    df, dg = Poly(f, x).degree(), Poly(g, x).degree()
    if lvl == 3:
        if (df, dg) != (1, 1):
            errs.append("level 3: two linear functions")
        if asked == "ff" and abs(Poly(f, x).LC()) < 2:
            errs.append("f o f with |a| < 2")
        if max(abs(c) for c in Poly(truth, x).all_coeffs()) > 40:
            errs.append("coefficients over 40")
    else:
        if asked == "ff" or sorted([df, dg]) != [1, 2] or Poly(g, x).degree() != 2:
            errs.append("level 4: g of degree 2, f linear")
        if max(abs(c) for c in Poly(truth, x).all_coeffs()) > 60:
            errs.append("coefficients over 60")
    if asked != "ff" and same(truth, expand(inner.subs(x, outer))):
        errs.append("the two composites coincide")
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "expanded":
        errs.append("answer must be an expanded expression")
    else:
        if not same(sympify(ans["value"], locals={"x": x}), truth):
            errs.append(f"answer {ans['value']} != {truth}")
        if not same(tex(ans["latex"]), truth) or "(" in ans["latex"] or not is_normal(ans["latex"]):
            errs.append(f"answer latex {ans['latex']} not the expanded ordered composite")
    ch = sample.get("choice")
    if ch is not None:
        expr_choice(ch, truth, named_formula_errors(outer, inner), errs, need_expanded=True)
    return asked


# ---------------------------------------------------------------------------
# Levels 5-6


def level56(sample, errs):
    pr, p, lvl = sample["problem"], sample["params"], sample["level"]
    if not pr.startswith(r"f: \mathbb{R} \to \mathbb{R},\quad f(x) = "):
        errs.append("problem must be f: R -> R, f(x) = ...")
    f = formula(pr, "f")
    if not same(f, poly_params(p["f"])):
        errs.append("f in the problem differs from params")
    P = Poly(f, x)
    if P.degree() != 1:
        return errs.append("f is not linear")
    a, b = P.coeff_monomial(x), P.coeff_monomial(1)
    sol = solve(f.subs(x, y) - x, y)  # y = f^{-1}(x): solve f(y) = x
    if len(sol) != 1:
        return errs.append("f(y) = x has no single solution")
    truth = sol[0]
    if not same(f.subs(x, truth), x) or not same(truth.subs(x, f), x):
        errs.append("f o f^-1 is not the identity")
    if b == 0:
        errs.append("b = 0")
    if lvl == 5:
        if not (a.is_integer and b.is_integer and a != 1 and abs(a) <= 6 and abs(b) <= 9):
            errs.append(f"a = {a}, b = {b} out of spec")
        named = [(x + b) / a, x / a - b, 1 / (a * x + b), (-x - b) / a, a * x - b]
    else:
        if a.is_integer or not 2 <= a.q <= 5 or abs(a.p) > 5 or not (b / a).is_integer or abs(b) > 12:
            errs.append(f"a = {a}, b = {b} out of spec")
        m, c = 1 / a, -b / a
        if not c.is_integer:
            errs.append("inverse with a fractional constant")
        named = [m * x - b, m * x - c, a * x - a * b, -m * x + c, m * x + b]
    ans = sample["answer"]
    if ans.get("kind") != "expression":
        errs.append("answer.kind must be expression")
    else:
        if not same(sympify(ans["value"], locals={"x": x}), truth):
            errs.append(f"answer {ans['value']} != {truth}")
        if not same(tex(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
        if lvl == 5 and a < 0 and re.search(r"\\frac\{[^{}]*\}\{-", ans["latex"]):
            errs.append("negative denominator: the sign goes in the numerator")
    ch = sample.get("choice")
    if ch is not None:
        expr_choice(ch, truth, named, errs)


# ---------------------------------------------------------------------------
# Level 7


def classify_formula(f, dom, cod):
    P = Poly(f, x)
    d = P.degree()
    if d == 0:
        if dom == cod == "R":
            return "nessuna"  # everything goes to one number
    elif d == 1:
        a = P.coeff_monomial(x)
        if dom == cod == "R":
            return "biettiva"
        if dom == cod == "Z" and a.is_integer and P.coeff_monomial(1).is_integer:
            return "biettiva" if abs(a) == 1 else "iniettiva"  # b + 1 has preimage 1/a
    elif d == 2 and P.coeff_monomial(x) == 0 and P.coeff_monomial(1) == 0 and P.LC() > 0:
        if dom == "R" and cod == "R":
            return "nessuna"
        if dom == "R" and cod == "R+":
            return "suriettiva"
    raise ValueError(f"function {f} on {dom} -> {cod} not in the spec")


SETS = {r"\mathbb{R}": "R", r"[0, +\infty)": "R+", r"\mathbb{Z}": "Z"}


def level7(sample, errs):
    pr, p = sample["problem"], sample["params"]
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer.kind must be choice")
        return None
    opts = ans["options"]
    idx = ans.get("correct")
    if "sta sul grafico" in pr:
        f = formula(pr, "f")
        m = re.search(r"Il punto \$\((-?\d+), (-?\d+)\)\$ sta sul grafico di \$f\$", pr)
        if not m:
            errs.append("no point in the problem")
            return "punto"
        u, v = int(m.group(1)), int(m.group(2))
        if f.subs(x, u) != v:
            errs.append("the point is not on the graph of f")
        if u == v:
            errs.append("point on the bisector")
        if [str(u), str(v)] != p.get("point") or not same(f, poly_params(p["f"])):
            errs.append("problem differs from params")
        pts = []
        for o in opts:
            mm = re.fullmatch(r"\((-?\d+), (-?\d+)\)", o["latex"])
            if not mm or [mm.group(1), mm.group(2)] != o["values"]:
                errs.append(f"option latex {o['latex']!r} != values {o['values']}")
            pts.append(tuple(int(s) for s in o["values"]))
        if len(pts) != 4 or len(set(pts)) != 4:
            errs.append("4 distinct points needed")
        on_inverse = [pt for pt in pts if f.subs(x, pt[1]) == pt[0]]
        if on_inverse != [(v, u)]:
            errs.append(f"points on the graph of f^-1 among the options: {on_inverse}")
        if not isinstance(idx, int) or pts[idx] != (v, u):
            errs.append("choice.correct is not (q, p)")
        if p.get("case") != "punto":
            errs.append("params.case must be punto")
        return "punto"
    codes = [o["values"][0] for o in opts]
    if codes != [INV_CODES[k] for k in INV_ORDER] or any(INV_WORDS[o["values"][0]] != o["latex"] for o in opts):
        errs.append(f"options must be the four answers in order: {codes}")
    if "\\mapsto" in pr:
        A, B = parse_set(pr, "A"), parse_set(pr, "B")
        arrows = dict(re.findall(r"(\d+) \\mapsto (\w+)", pr))
        if sorted(arrows) != sorted(A) or any(v not in B for v in arrows.values()):
            errs.append("f is not a function from A to B")
        hits = [list(arrows.values()).count(b) for b in B]
        inj, surj = all(h <= 1 for h in hits), all(h >= 1 for h in hits)
        kind = "biettiva" if inj and surj else "iniettiva" if inj else "suriettiva" if surj else "nessuna"
    else:
        m = re.match(r"f: (.*?) \\to (.*?),\\quad f\(x\) = ", pr)
        if not m or m.group(1) not in SETS or m.group(2) not in SETS:
            errs.append("no f: D -> C in the problem")
            return None
        kind = classify_formula(formula(pr, "f"), SETS[m.group(1)], SETS[m.group(2)])
    if not isinstance(idx, int) or codes[idx] != INV_CODES[kind]:
        errs.append(f"correct option is not {kind}")
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but the function is {kind}")
    return kind


def check(sample):
    errs = []
    check_common(sample, errs)
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = level1(sample, errs)
    elif lvl == 2:
        kind = level2(sample, errs)
    elif lvl in (3, 4):
        kind = level34(sample, errs)
    elif lvl in (5, 6):
        level56(sample, errs)
    elif lvl == 7:
        kind = level7(sample, errs)
    else:
        errs.append(f"unknown level {lvl}")
    if lvl in (2, 3, 4, 5, 6) and sample.get("choice") is None:
        errs.append("missing multiple-choice variant")
    return errs, kind
