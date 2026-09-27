"""funzioni-quadratiche (La parabola), from specs/exercises/funzioni-quadratiche.md.

Written from the spec, not from the generator. The parabola (or the three points of level 7) is read
back from the LaTeX of the problem and compared with params; every answer is recomputed with SymPy
(vertex from -b/2a and substitution, points by substitution, solveset for the x axis, the sign of the
discriminant, linsolve for the parabola through three points); every option is read back from its
LaTeX, must say the same thing as its values, and exactly one option is right. Numbers are exact.
"""
import re

from sympy import Poly, Rational, S, Symbol, linsolve, solveset, symbols, sympify

from verify import FORBIDDEN, canon, exact, latex_value

X = Symbol("x", real=True)
A_, B_, C_ = symbols("a b c")

CASE_RANGES = {
    1: {"stretta": (0.25, 0.42), "larga": (0.25, 0.42), "vertice": (0.25, 0.42)},
    2: {"vertice": (0.65, 0.85), "asse": (0.15, 0.35)},
    4: {"appartiene": (0.6, 0.8), "asse y": (0.2, 0.4)},
    5: {"intere": (0.2, 0.4), "frazionarie": (0.12, 0.28), "irrazionali": (0.12, 0.28), "tangente": (0.08, 0.22), "nessuna": (0.08, 0.22)},
    6: {"taglia": (0.18, 0.32), "tangente": (0.18, 0.32), "sopra": (0.18, 0.32), "sotto": (0.18, 0.32)},
    7: {"asse y": (0.4, 0.6), "generici": (0.4, 0.6)},
}

POSITION_LATEX = {
    "taglia": r"\text{taglia l'asse } x \text{ in due punti}",
    "tangente": r"\text{è tangente all'asse } x",
    "sopra": r"\text{sta tutta sopra l'asse } x",
    "sotto": r"\text{sta tutta sotto l'asse } x",
}
POSITIONS = ["taglia", "tangente", "sopra", "sotto"]


# ---------------------------------------------------------------------------
# Reading LaTeX

def num(t):
    """An exact rational as written: -3, \\frac{3}{2}, -\\frac{5}{4}."""
    t = t.strip()
    m = re.fullmatch(r"(-?)\\d?frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable number {t!r}")


def poly_tex(t):
    """The right-hand side of y = ... (2x^2 - 3x + 1, -\\frac{1}{2}x^2 + 5) as a SymPy Poly in x."""
    s = t.strip()
    s = re.sub(r"\\d?frac\{(\d+)\}\{(\d+)\}", r"(\1/\2)", s)
    s = s.replace("x^2", "x**2")
    s = re.sub(r"(\d|\))\s*x", r"\1*x", s)
    if not re.fullmatch(r"[0-9x+\-*/() ]+", s):
        raise ValueError(f"unreadable polynomial {t!r}")
    return Poly(sympify(s, locals={"x": X}), X)


def parabola_tex(t):
    m = re.fullmatch(r"y = (.+)", t.strip())
    if not m:
        raise ValueError(f"not y = ...: {t!r}")
    P = poly_tex(m.group(1))
    if P.degree() != 2:
        raise ValueError(f"not a parabola: {t!r}")
    return [P.coeff_monomial(X**2), P.coeff_monomial(X), P.coeff_monomial(1)]


def point_tex(t, letter=""):
    t = t.strip()
    m = re.fullmatch(re.escape(letter) + r"\((-?\d+), (-?\d+)\)", t) or re.fullmatch(
        re.escape(letter) + r"\\left\((.+), (.+)\\right\)", t
    )
    if not m:
        raise ValueError(f"unreadable point {t!r}")
    x, y = num(m.group(1)), num(m.group(2))
    if m.group(0).find(r"\left") >= 0 and x.is_integer and y.is_integer:
        raise ValueError(f"\\left( around integer coordinates: {t!r}")
    return (x, y)


def value_list(values):
    return tuple(Rational(v) for v in values)


def f(abc, x):
    a, b, c = abc
    return a * x**2 + b * x + c


def forbidden(tex):
    return [f"forbidden '{name}' in {tex!r}" for name, rx in FORBIDDEN if rx.search(tex)]


# ---------------------------------------------------------------------------
# Options

def check_options(ch, read, truth, errs):
    """read(option) -> key from the LaTeX; the key must equal key of values; exactly one equals truth, at correct."""
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    keys = []
    for o in opts:
        try:
            k, kv = read(o)
        except Exception as e:  # noqa: BLE001 - any parse failure is an error of the option
            errs.append(f"option unreadable: {e}")
            return
        if k != kv:
            errs.append(f"option latex {o['latex']!r} says {k}, values say {kv}")
        keys.append(k)
    if len(set(keys)) != len(keys):
        errs.append(f"options not distinct: {[o['latex'] for o in opts]}")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("two options with the same text")
    right = [i for i, k in enumerate(keys) if k == truth]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} but the right option is {right[0]}")


# ---------------------------------------------------------------------------
# Levels

def check_level1(s, errs):
    p = s["params"]
    case = p.get("case")
    ch = s["answer"]
    if ch.get("kind") != "choice":
        errs.append("level 1 answer must be choice")
        return case
    if case in ("stretta", "larga"):
        parts = s["problem"].split(r" \quad ")
        if len(parts) != 4:
            errs.append("level 1: four parabolas expected in the problem")
            return case
        a_s = []
        for part in parts:
            a, b, c = parabola_tex(part)
            if b != 0 or c != 0:
                errs.append(f"not y = ax^2: {part!r}")
            a_s.append(a)
        if [str(a) for a in a_s] != [str(Rational(v)) for v in p["as"]]:
            errs.append(f"problem says {a_s}, params {p['as']}")
        if len({abs(a) for a in a_s}) != 4:
            errs.append("two parabolas with the same width")
        if any(not (Rational(1, 4) <= abs(a) <= 5) for a in a_s):
            errs.append(f"|a| out of [1/4, 5]: {a_s}")
        best = max(a_s, key=abs) if case == "stretta" else min(a_s, key=abs)
        signed = max(a_s) if case == "stretta" else min(a_s)
        if bool(p.get("trap")) != (signed != best):
            errs.append("params.trap wrong")

        def read(o):
            a, b, c = parabola_tex(o["latex"])
            return a, Rational(o["values"][0])

        if sorted(Rational(o["values"][0]) for o in ch["options"]) != sorted(a_s):
            errs.append("options are not the four parabolas of the problem")
        check_options(ch, read, best, errs)
        want = f"Quale di queste parabole è la più {case}?"
        if s["prompt"] != want:
            errs.append(f"prompt {s['prompt']!r}")
    elif case == "vertice":
        a, b, c = parabola_tex(s["problem"])
        if b != 0 or c == 0:
            errs.append("level 1 vertex: need y = ax^2 + c with c != 0")
        if str(a) != str(Rational(p["a"])) or str(c) != str(Rational(p["c"])):
            errs.append("params differ from the problem")
        truth = (Rational(0), c, "alto" if a > 0 else "basso")

        def read(o):
            m = re.fullmatch(r"(V.+),\\ \\text\{verso (l'alto|il basso)\}", o["latex"])
            if not m:
                raise ValueError(o["latex"])
            x, y = point_tex(m.group(1), "V")
            v = o["values"]
            return (x, y, "alto" if m.group(2) == "l'alto" else "basso"), (Rational(v[0]), Rational(v[1]), v[2])

        check_options(ch, read, truth, errs)
    else:
        errs.append(f"unknown case {case!r}")
    return case


def vertex_of(abc):
    a, b, c = abc
    xv = -b / (2 * a)
    return xv, f(abc, xv)


def check_vertex(s, errs):
    lvl = s["level"]
    p = s["params"]
    abc = parabola_tex(s["problem"])
    if [str(v) for v in abc] != [str(Rational(p[k])) for k in "abc"]:
        errs.append("params differ from the problem")
    a, b, c = abc
    if not all(v.is_integer for v in abc) or b == 0:
        errs.append("need integer coefficients with b != 0")
    xv, yv = vertex_of(abc)
    # the check of the lesson: y_V = -Δ/4a
    if yv != -(b**2 - 4 * a * c) / (4 * a):
        errs.append("y_V differs from -Δ/4a")
    if lvl == 2:
        if a not in (1, -1, 2, -2):
            errs.append(f"a = {a}")
        if not (xv.is_integer and yv.is_integer) or xv == 0:
            errs.append(f"vertex ({xv}, {yv}) must be integer with x_V != 0")
        if abs(b) > 12 or abs(c) > 30:
            errs.append("coefficients too large")
    else:
        if xv.is_integer:
            errs.append("level 3: x_V must be a fraction")
        if yv.q > 12 or abs(yv.p) > 99:
            errs.append(f"y_V = {yv} out of spec")
        if abs(b) > 9 or abs(c) > 9 or a not in (1, -1, 2, -2, 3):
            errs.append("coefficients out of spec")
    ch = s["answer"]
    case = p.get("case")
    if case == "asse":
        if lvl != 2:
            errs.append("axis only at level 2")

        def read(o):
            m = re.fullmatch(r"([xy]) = (.+)", o["latex"])
            return (m.group(1), num(m.group(2))), (o["values"][0], Rational(o["values"][1]))

        check_options(ch, read, ("x", xv), errs)
        if s["solution"] != f"x = {latex_num(xv)}":
            errs.append("solution is not the axis")
    else:
        def read(o):
            return point_tex(o["latex"], "V"), value_list(o["values"])

        check_options(ch, read, (xv, yv), errs)
        if not s["solution"].startswith("V"):
            errs.append("solution is not the vertex")
    if lvl == 3:
        want = "ordinata intera" if yv.is_integer else "ordinata frazionaria"
        if case != want:
            errs.append(f"case {case!r}, expected {want!r}")
        return None
    return case


def latex_num(r):
    if r.is_integer:
        return str(r)
    return ("-" if r < 0 else "") + rf"\frac{{{abs(r.p)}}}{{{r.q}}}"


def check_level4(s, errs):
    p = s["params"]
    abc = parabola_tex(s["problem"])
    a, b, c = abc
    if [str(v) for v in abc] != [str(Rational(p[k])) for k in "abc"]:
        errs.append("params differ from the problem")
    if a not in (1, -1, 2, -2) or b == 0 or c == 0 or abs(b) > 6 or abs(c) > 6:
        errs.append("coefficients out of spec")
    ch = s["answer"]
    case = p.get("case")

    def read(o):
        return point_tex(o["latex"]), value_list(o["values"])

    if case == "asse y":
        truth = (Rational(0), c)
        check_options(ch, read, truth, errs)
        # no other option may be on the y axis and on the parabola
        for o in ch["options"]:
            x, y = value_list(o["values"])
            if (x, y) != truth and x == 0 and f(abc, x) == y:
                errs.append("a distractor is the point on the y axis")
    elif case == "appartiene":
        on = [i for i, o in enumerate(ch["options"]) if f(abc, value_list(o["values"])[0]) == value_list(o["values"])[1]]
        if len(on) != 1:
            errs.append(f"{len(on)} options on the parabola")
            return case
        truth = value_list(ch["options"][on[0]]["values"])
        if truth[0] == 0 or abs(truth[0]) > 3 or abs(truth[1]) > 25:
            errs.append(f"point {truth} out of spec")
        check_options(ch, read, truth, errs)
    else:
        errs.append(f"unknown case {case!r}")
    return case


def roots_key(vals):
    return tuple(canon(v) for v in vals)


def read_roots(latex):
    if latex == r"\text{Nessuna intersezione}":
        return []
    m = re.fullmatch(r"x = (.+)", latex)
    if m:
        return [latex_value(m.group(1))]
    m = re.fullmatch(r"\\begin\{gathered\} x_1 = (.+) \\\\ x_2 = (.+) \\end\{gathered\}", latex) or re.fullmatch(
        r"x_1 = (.+),\\ x_2 = (.+)", latex
    )
    if not m:
        raise ValueError(f"unreadable roots {latex!r}")
    return [latex_value(m.group(1)), latex_value(m.group(2))]


def check_level5(s, errs):
    p = s["params"]
    abc = parabola_tex(s["problem"])
    a, b, c = abc
    if [str(v) for v in abc] != [str(Rational(p[k])) for k in "abc"]:
        errs.append("params differ from the problem")
    if b == 0 or c == 0 or not all(v.is_integer for v in abc) or abs(b) > 30 or abs(c) > 30:
        errs.append("coefficients out of spec")
    sol = solveset(f(abc, X), X, S.Reals)
    truth = sorted(sol, key=float) if sol != S.EmptySet else []
    ans = s["answer"]
    if ans.get("kind") != "set":
        errs.append("level 5 answer must be set")
        return None
    given = [exact(v) for v in ans["values"]]
    if roots_key(given) != roots_key(truth):
        errs.append(f"answer {ans['values']} != sympy {truth}")
    try:
        if roots_key(read_roots(ans["latex"])) != roots_key(truth):
            errs.append("answer.latex differs from the roots")
    except ValueError as e:
        errs.append(str(e))
    delta = b**2 - 4 * a * c
    if delta < 0:
        kind = "nessuna"
    elif delta == 0:
        kind = "tangente"
    elif all(r.is_rational for r in truth):
        kind = "intere" if all(r.is_integer for r in truth) else "frazionarie"
    else:
        kind = "irrazionali"
    if p.get("case") != kind:
        errs.append(f"case {p.get('case')!r}, the parabola is {kind!r}")
    for r in truth:
        if r.is_rational and (r.q > 4 or abs(r.p) > 9):
            errs.append(f"root {r} out of spec")
    ch = s.get("choice")
    if ch is None:
        errs.append("no choice")
        return kind
    radical = any(not canon(exact(v)).is_rational for o in ch["options"] for v in o["values"])

    def read(o):
        shown = read_roots(o["latex"])
        if len(shown) == 2 and radical != o["latex"].startswith(r"\begin{gathered}"):
            raise ValueError(f"two values {'with' if radical else 'without'} radicals on the wrong number of lines: {o['latex']!r}")
        vals = [exact(v) for v in o["values"]]
        if [float(v) for v in vals] != sorted(float(v) for v in vals):
            raise ValueError("values not sorted")
        return roots_key(shown), roots_key(vals)

    check_options(ch, read, roots_key(truth), errs)
    return kind


def check_level6(s, errs):
    p = s["params"]
    abc = parabola_tex(s["problem"])
    a, b, c = abc
    if [str(v) for v in abc] != [str(Rational(p[k])) for k in "abc"]:
        errs.append("params differ from the problem")
    if b == 0 or c == 0 or not all(v.is_integer for v in abc) or abs(a) > 12 or abs(b) > 30 or abs(c) > 30:
        errs.append("coefficients out of spec")
    d = b**2 - 4 * a * c
    pos = "taglia" if d > 0 else "tangente" if d == 0 else "sopra" if a > 0 else "sotto"
    # the same answer from the picture: the vertex above or below the axis, and the concavity
    xv, yv = vertex_of(abc)
    if d < 0 and (yv > 0) != (a > 0):
        errs.append("vertex on the wrong side")
    ch = s["answer"]
    if [o["latex"] for o in ch["options"]] != [POSITION_LATEX[k] for k in POSITIONS]:
        errs.append("options are not the four positions in order")

    def read(o):
        return [k for k in POSITIONS if POSITION_LATEX[k] == o["latex"]][0], o["values"][0]

    check_options(ch, read, pos, errs)
    if p.get("case") != pos:
        errs.append(f"case {p.get('case')!r}, the parabola {pos!r}")
    return pos


def check_level7(s, errs):
    p = s["params"]
    parts = s["problem"].split(r" \quad ")
    if len(parts) != 3:
        errs.append("three points expected")
        return None
    pts = [point_tex(t, L) for t, L in zip(parts, "ABC")]
    xs = [pt[0] for pt in pts]
    if len(set(xs)) != 3 or xs != sorted(xs):
        errs.append("abscissas not distinct and increasing")
    if any(not (v.is_integer and abs(v) <= 30) for pt in pts for v in pt) or any(abs(x) > 4 for x in xs):
        errs.append("coordinates out of spec")
    if [str(x) for x in xs] != [str(Rational(v)) for v in p["xs"]] or [str(pt[1]) for pt in pts] != [str(Rational(v)) for v in p["ys"]]:
        errs.append("params differ from the problem")
    sol = linsolve([A_ * x**2 + B_ * x + C_ - y for x, y in pts], [A_, B_, C_])
    (abc,) = list(sol)
    abc = [Rational(v) for v in abc]
    if abc[0] == 0:
        errs.append("the three points are on a line")
        return None
    if abc[0] not in (1, -1, 2, -2) or abs(abc[1]) > 6 or abs(abc[2]) > 6:
        errs.append(f"coefficients {abc} out of spec")
    truth = tuple(abc)
    ans = s["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "expanded":
        errs.append("level 7 answer must be an expanded expression")
        return None
    P = Poly(sympify(ans["value"], locals={"x": X}), X)
    if (P.coeff_monomial(X**2), P.coeff_monomial(X), P.coeff_monomial(1)) != truth:
        errs.append(f"answer {ans['value']} != {truth}")
    if tuple(parabola_tex(ans["latex"])) != truth:
        errs.append("answer.latex differs")
    errs += forbidden(ans["latex"])
    ch = s.get("choice")
    if ch is None:
        errs.append("no choice")
    else:
        for o in ch["options"]:
            errs += forbidden(o["latex"])

        def read(o):
            Q = Poly(sympify(o["values"][0], locals={"x": X}), X)
            if Q.degree() != 2:
                raise ValueError(f"option of degree {Q.degree()}")
            return tuple(parabola_tex(o["latex"])), (Q.coeff_monomial(X**2), Q.coeff_monomial(X), Q.coeff_monomial(1))

        check_options(ch, read, truth, errs)
        for o in ch["options"]:
            abc_o = parabola_tex(o["latex"])
            through = all(f(abc_o, x) == y for x, y in pts)
            if through != (tuple(abc_o) == truth):
                errs.append(f"option {o['latex']!r} through the points: {through}")
    if 0 in xs:
        i0 = xs.index(0)
        named = f"{'ABC'[i0]}(0, {pts[i0][1]})"
        if not any(st.startswith(r"\text{Il punto } " + named) for st in s["steps"]):
            errs.append(f"the steps do not start from the point {named} on the y axis")
        return "asse y"
    return "generici"


def check(sample):
    errs = []
    lvl = sample["level"]
    errs += forbidden(sample["problem"])
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("steps or solution missing")
    text = " ".join([sample["problem"], sample["solution"], *sample["steps"]])
    if "—" in text or "piuttosto che" in text:
        errs.append("forbidden words")
    ch = sample.get("choice")
    if sample["answer"].get("kind") == "choice" and ch is not None and ch != sample["answer"]:
        errs.append("choice differs from the choice answer")
    if lvl == 1:
        kind = check_level1(sample, errs)
    elif lvl in (2, 3):
        kind = check_vertex(sample, errs)
    elif lvl == 4:
        kind = check_level4(sample, errs)
    elif lvl == 5:
        kind = check_level5(sample, errs)
    elif lvl == 6:
        kind = check_level6(sample, errs)
    elif lvl == 7:
        kind = check_level7(sample, errs)
    else:
        return [f"unknown level {lvl}"], None
    if lvl in (1, 2, 4, 6, 7) and kind != sample["params"].get("case"):
        errs.append(f"case {sample['params'].get('case')!r} but the exercise is {kind!r}")
    return errs, kind
