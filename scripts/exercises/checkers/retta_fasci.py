"""Checker for retta-fasci, from specs/exercises/retta-fasci.md and lesson 86.

Everything is recomputed from the LaTeX the student sees, with a small parser written here (numbers, x, y,
k, m, q, brackets, \\frac, juxtaposition). A pencil is split into its generators by SymPy (the part without k
and the coefficient of k); the centre comes from linsolve, the lines from SymPy's Line and Point, the value of
k from solve. Every option is parsed back from its LaTeX into a line (or a point, a number, "nessuna retta",
"tutte le rette del fascio"), compared with its `values`, and exactly one must be the truth. The form of a line
is checked too: explicit answers y = mx + q with reduced fractions, implicit options with coprime integer
coefficients and the first one positive, horizontal and vertical lines as y = h and x = h.
"""
import re
from math import gcd

from sympy import EmptySet, Integer, Line, Point, Rational, Symbol, expand, linsolve, solve, sympify

X, Y, K = Symbol("x"), Symbol("y"), Symbol("k")
SYMS = {"x": X, "y": Y, "k": K, "m": Symbol("m"), "q": Symbol("q")}

CASE_RANGES = {
    1: {"verticale": (0.09, 0.22), "obliqua": (0.78, 0.91)},
    2: {"verticale": (0.09, 0.22), "implicita": (0.45, 0.65), "esplicita": (0.20, 0.38)},
    3: {"assi": (0.17, 0.33), "obliqui": (0.67, 0.83)},
    4: {"assi": (0.17, 0.33), "obliqui": (0.67, 0.83)},
    6: {"esclusa": (0.17, 0.33), "punto": (0.67, 0.83)},
    7: {"parallela": (0.27, 0.45), "perpendicolare": (0.27, 0.45), "esclusa": (0.09, 0.22), "verticale": (0.09, 0.22)},
}

FORBIDDEN = [
    ("1x", re.compile(r"(?<![\d}])1\s*[xyk(]")),
    ("0x", re.compile(r"(?<![\d}])0\s*[xyk(]")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
    ("zero term", re.compile(r"[+-]\s*0(?!\d)")),
]


class TexError(Exception):
    pass


# ---------------------------------------------------------------------------
# Parser


def tokenize(s):
    s = s.replace("\\left", "").replace("\\right", "")
    toks = []
    i = 0
    while i < len(s):
        ch = s[i]
        if ch.isspace():
            i += 1
            continue
        if ch == "\\":
            m = re.match(r"\\([a-zA-Z]+|.)", s[i:])
            name = m.group(1)
            i += len(m.group(0))
            if name in (",", " ", ";", "!"):
                continue
            if name in ("frac", "dfrac"):
                toks.append("\\frac")
            elif name == "cdot":
                toks.append("*")
            else:
                raise TexError(f"unsupported command \\{name} in {s!r}")
            continue
        if ch.isdigit():
            j = i
            while j < len(s) and s[j].isdigit():
                j += 1
            toks.append(s[i:j])
            i = j
            continue
        if ch in SYMS or ch in "+-()={}":
            toks.append(ch)
            i += 1
            continue
        raise TexError(f"unexpected {ch!r} in {s!r}")
    return toks


class Parser:
    def __init__(self, toks):
        self.t = toks
        self.i = 0

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else None

    def eat(self, want=None):
        tok = self.peek()
        if tok is None or (want is not None and tok != want):
            raise TexError(f"expected {want!r}, found {tok!r} in {self.t}")
        self.i += 1
        return tok

    def expr(self):
        sign = 1
        if self.peek() in ("+", "-"):
            sign = -1 if self.eat() == "-" else 1
        v = sign * self.term()
        while self.peek() in ("+", "-"):
            op = self.eat()
            t = self.term()
            v = v + t if op == "+" else v - t
        return v

    def term(self):
        v = self.atom()
        while True:
            tok = self.peek()
            if tok == "*":
                self.eat()
                v = v * self.atom()
            elif tok is not None and (tok in SYMS or tok in ("(", "\\frac")):
                v = v * self.atom()
            else:
                return v

    def atom(self):
        tok = self.peek()
        if tok is None:
            raise TexError("unexpected end")
        if tok.isdigit():
            self.eat()
            return Integer(tok)
        if tok in SYMS:
            self.eat()
            return SYMS[tok]
        if tok == "(":
            self.eat()
            v = self.expr()
            self.eat(")")
            return v
        if tok == "\\frac":
            self.eat()
            self.eat("{")
            n = self.expr()
            self.eat("}")
            self.eat("{")
            d = self.expr()
            self.eat("}")
            if d == 0:
                raise TexError("zero denominator")
            return n / d
        if tok == "-":
            self.eat()
            return -self.atom()
        raise TexError(f"unexpected token {tok!r}")


def parse(tex):
    p = Parser(tokenize(tex))
    v = p.expr()
    if p.peek() is not None:
        raise TexError(f"trailing {p.peek()!r} in {tex!r}")
    return v


def parse_eq(tex):
    if tex.count("=") != 1:
        raise TexError(f"not an equation: {tex!r}")
    lhs, rhs = tex.split("=")
    return expand(parse(lhs) - parse(rhs))


def point(tex):
    m = re.fullmatch(r"\s*[A-Z]?\s*(?:\\left)?\((.*),(.*?)(?:\\right)?\)\s*", tex)
    if not m:
        raise TexError(f"not a point: {tex!r}")
    return (parse(m.group(1)), parse(m.group(2)))


def rat(s):
    if not re.fullmatch(r"-?\d+(/\d+)?", str(s)):
        raise TexError(f"not a rational: {s!r}")
    return Rational(s)


# ---------------------------------------------------------------------------
# Lines: a line is the normalised triple (a, b, c) of ax + by + c = 0


def norm(a, b, c):
    a, b, c = (Rational(v) for v in (a, b, c))
    if a == 0 and b == 0:
        raise TexError("not a line")
    den = 1
    for v in (a, b, c):
        den = den * v.q // gcd(den, v.q)
    ints = [int(v * den) for v in (a, b, c)]
    g = gcd(gcd(abs(ints[0]), abs(ints[1])), abs(ints[2]))
    ints = [v // g for v in ints]
    lead = ints[0] if ints[0] != 0 else ints[1]
    if lead < 0:
        ints = [-v for v in ints]
    return tuple(ints)


def line_of_expr(e):
    """ax + by + c from a linear expression in x and y."""
    e = expand(e)
    a, b = e.coeff(X), e.coeff(Y)
    c = e.subs({X: 0, Y: 0})
    if any(v.free_symbols for v in (a, b, c)) or expand(e - a * X - b * Y - c) != 0:
        raise TexError(f"not linear: {e}")
    return norm(a, b, c)


def line_tex(tex):
    return line_of_expr(parse_eq(tex))


def sym_line(t):
    """SymPy Line through two points of ax + by + c = 0."""
    a, b, c = (Rational(v) for v in t)
    if b == 0:
        return Line(Point(-c / a, 0), Point(-c / a, 1))
    return Line(Point(0, -c / b), Point(1, (-c - a) / b))


def on(t, P):
    return t[0] * P[0] + t[1] * P[1] + t[2] == 0


def key_line(v):
    return tuple(int(n) for n in v.split(","))


def reduced_fracs(tex):
    return all(gcd(int(n), int(d)) == 1 and int(d) > 1 for n, d in re.findall(r"\\frac\{(\d+)\}\{(\d+)\}", tex))


def implicit_form_errors(tex):
    """x = h, y = h, or ax + by + c = 0 with coprime integers, first positive, both a and b nonzero."""
    t = line_tex(tex)
    if t[1] == 0:
        ok = re.fullmatch(r"x = -?(\d+|\\frac\{\d+\}\{\d+\})", tex)
    elif t[0] == 0:
        ok = re.fullmatch(r"y = -?(\d+|\\frac\{\d+\}\{\d+\})", tex)
    else:
        ok = tex.endswith("= 0") and "\\frac" not in tex and not tex.startswith("-") and line_of_expr(parse(tex[:-3])) == t
        if ok:
            e = expand(parse(tex[:-3]))
            ok = (e.coeff(X), e.coeff(Y), e.subs({X: 0, Y: 0})) == tuple(Integer(v) for v in t)
    return [] if ok and reduced_fracs(tex) else [f"line not in the lesson's implicit form: {tex!r}"]


def explicit_form_errors(tex):
    t = line_tex(tex)
    if t[1] == 0:
        ok = re.fullmatch(r"x = -?(\d+|\\frac\{\d+\}\{\d+\})", tex)
    else:
        ok = tex.startswith("y = ") and "y" not in tex[4:] and "\\cdot" not in tex and tex[4:].count("x") <= 1
    return [] if ok and reduced_fracs(tex) else [f"line not in explicit form y = mx + q: {tex!r}"]


# ---------------------------------------------------------------------------
# Options


def read_option(o, kind):
    tex = o["latex"]
    if tex == "\\text{nessuna retta}":
        return "nessuna"
    if tex == "\\text{tutte le rette del fascio}":
        return "tutte"
    if kind == "point":
        return point(tex)
    if kind == "number":
        return parse(tex)
    return line_tex(tex)


def values_of(o, kind):
    v = o["values"]
    if v in (["nessuna"], ["tutte"]):
        return v[0]
    if kind == "point":
        return tuple(rat(c) for c in v)
    if kind == "number":
        return rat(v[0])
    return key_line(v[0])


def check_choice(ch, truth, kind, style=None):
    errs = []
    if not ch:
        return ["no choice"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    try:
        read = [read_option(o, kind) for o in opts]
    except TexError as e:
        return [f"option not readable: {e}"]
    for o, r in zip(opts, read):
        if values_of(o, kind) != r:
            errs.append(f"option {o['latex']!r} does not say its values {o['values']}")
        if kind == "line" and isinstance(r, tuple):
            if style == "explicit":
                errs += explicit_form_errors(o["latex"])
            else:
                errs += implicit_form_errors(o["latex"])
    if len(set(read)) != len(read):
        errs.append(f"options not distinct: {[o['latex'] for o in opts]}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts):
        return errs + ["correct index out of range"]
    if read[idx] != truth:
        errs.append(f"correct option {opts[idx]['latex']!r}, truth {truth}")
    if sum(1 for r in read if r == truth) != 1:
        errs.append("not exactly one right option")
    return errs


# ---------------------------------------------------------------------------
# Pencils


def pencil(tex):
    """r, s (normalised triples of the generators: r + k s = 0) and the raw expression."""
    e = parse_eq(tex)
    if expand(e.diff(K, 2)) != 0:
        raise TexError("k not linear")
    s = expand(e.diff(K))
    r = expand(e.subs(K, 0))
    return r, s, e


def givens(problem):
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\\\ (.*) \\end\{gathered\}", problem)
    if not m:
        raise TexError(f"not two lines: {problem!r}")
    return m.group(1), m.group(2)


def centre(r, s):
    sol = linsolve([r, s], [X, Y])
    if sol == EmptySet:
        return None
    (t,) = list(sol)
    if any(v.free_symbols for v in t):
        return None
    return t


def small_int(v, n):
    return v.is_integer and abs(v) <= n


def check_proper(r, s, e):
    """Errors for a proper pencil with integer centre, and the centre."""
    errs = []
    C = centre(r, s)
    if C is None:
        return ["generators not incident"], None
    if expand(e.subs({X: C[0], Y: C[1]})) != 0:
        errs.append("the centre does not satisfy the pencil for every k")
    if not all(small_int(v, 4) for v in C):
        errs.append(f"centre {C} not integer in [-4, 4]")
    for g in (r, s):
        t = [g.coeff(X), g.coeff(Y), g.subs({X: 0, Y: 0})]
        if any(not v.is_integer or abs(v) > 9 for v in t):
            errs.append(f"generator {g} with coefficients over 9")
    return errs, C


def slope(t):
    return None if t[1] == 0 else Rational(-t[0], t[1])


# ---------------------------------------------------------------------------
# Levels


def level1(sample):
    errs = []
    m = re.fullmatch(r"C(\(.*?\)) \\quad A(\(.*?\))", sample["problem"])
    if not m:
        return ["problem not C(...) \\quad A(...)"], None
    C, A = point(m.group(1)), point(m.group(2))
    if not all(small_int(v, 5) for v in C) or not all(small_int(v, 8) for v in A):
        errs.append("points out of range")
    if C == A:
        return errs + ["A = C"], None
    L = Line(Point(*C), Point(*A))
    a, b, c = L.coefficients
    truth = norm(a, b, c)
    kind = "verticale" if A[0] == C[0] else "obliqua"
    if sample["params"].get("case") != kind:
        errs.append("params.case differs")
    ans = sample["answer"]
    if kind == "obliqua":
        errs += check_explicit_answer(ans, truth)
        errs += check_choice(sample.get("choice"), truth, "line", "explicit")
    else:
        if ans.get("kind") != "choice":
            errs.append("vertical case must be a choice")
        errs += check_choice(ans, truth, "line", "explicit")
        if not any(o["latex"] == "\\text{nessuna retta}" for o in ans["options"]):
            errs.append("vertical case without 'nessuna retta'")
    return errs, kind


def check_explicit_answer(ans, truth):
    errs = []
    if ans.get("kind") != "expression":
        return ["answer must be an expression"]
    tex = ans.get("latex", "")
    errs += explicit_form_errors(tex)
    if line_tex(tex) != truth:
        errs.append(f"answer {tex!r} is not the line {truth}")
    value = sympify(ans["value"], locals={"x": X})
    if line_of_expr(Y - value) != truth:
        errs.append(f"answer value {ans['value']!r} is not the line")
    if not tex.startswith("y = ") or expand(parse(tex[4:]) - value) != 0:
        errs.append("value and latex differ")
    return errs


def level2(sample):
    errs = []
    m = re.fullmatch(r"r: (.*) \\quad P(\(.*?\))", sample["problem"])
    if not m:
        return ["problem not r: ... \\quad P(...)"], None
    d = line_tex(m.group(1))
    P = point(m.group(2))
    if not all(small_int(v, 5) for v in P):
        errs.append("P out of range")
    if on(d, P):
        errs.append("P on r")
    L = sym_line(d).parallel_line(Point(*P))
    truth = norm(*L.coefficients)
    if not sym_line(truth).is_parallel(sym_line(d)) or not on(truth, P):
        errs.append("sympy parallel line wrong")
    kind = "verticale" if d[1] == 0 else ("esplicita" if m.group(1).startswith("y = ") else "implicita")
    if kind == "implicita":
        errs += implicit_form_errors(m.group(1))
    if kind != "verticale" and slope(d) not in SLOPES:
        errs.append(f"slope {slope(d)} not among the lesson's")
    if sample["params"].get("case") != kind:
        errs.append("params.case differs")
    if kind == "verticale":
        errs += check_choice(sample["answer"], truth, "line", "implicit")
    else:
        errs += check_explicit_answer(sample["answer"], truth)
        errs += check_choice(sample.get("choice"), truth, "line", "explicit")
    return errs, kind


SLOPES = {Rational(n) for n in (1, 2, 3, -1, -2, -3)} | {Rational(p, q) for p, q in ((1, 2), (-1, 2), (3, 2), (-3, 2), (1, 3), (-1, 3), (2, 3), (-2, 3))}


def axis_case(r, s):
    return "assi" if any(g.coeff(X) == 0 or g.coeff(Y) == 0 for g in (r, s)) else "obliqui"


def level3(sample):
    r, s, e = pencil(sample["problem"])
    errs, C = check_proper(r, s, e)
    if C is None:
        return errs, None
    errs += check_choice(sample["answer"], tuple(C), "point")
    kind = axis_case(r, s)
    if sample["params"].get("case") != kind:
        errs.append("params.case differs")
    return errs, kind


def level4(sample):
    r, s, e = pencil(sample["problem"])
    errs, C = check_proper(r, s, e)
    if C is None:
        return errs, None
    truth = line_of_expr(s)
    # s is not in the pencil: r + k s proportional to s would need r proportional to s
    ks = solve([e.coeff(X) * s.coeff(Y) - e.coeff(Y) * s.coeff(X)], K, dict=True)
    if ks:
        errs.append("the excluded line is reached for some k")
    if not on(truth, C):
        errs.append("excluded line not through the centre")
    errs += check_choice(sample["answer"], truth, "line", "implicit")
    kind = axis_case(r, s)
    if sample["params"].get("case") != kind:
        errs.append("params.case differs")
    return errs, kind


def level5(sample):
    errs = []
    r, s, e = pencil(sample["problem"])
    if centre(r, s) is not None:
        return ["generators incident: pencil not improper"], None
    tr, ts = line_of_expr(r), line_of_expr(s)
    if tr == ts:
        errs.append("generators coincide")
    sol = solve([e.coeff(X), e.coeff(Y)], K, dict=True)
    if len(sol) != 1:
        return errs + [f"coefficients vanish for {sol}"], None
    k = sol[0][K]
    rest = expand(e.subs(K, k))
    if rest == 0 or rest.free_symbols:
        errs.append(f"with k = {k} the equation is {rest} = 0")
    if not k.is_integer and k not in (Rational(-1, 2), Rational(-1, 3), Rational(1, 2), Rational(1, 3)):
        errs.append(f"k = {k} not simple")
    ans = sample["answer"]
    if ans.get("kind") != "number" or rat(ans["value"]) != k:
        errs.append(f"answer {ans.get('value')} != {k}")
    errs += check_choice(sample.get("choice"), k, "number")
    return errs, None


def level6(sample):
    first, second = givens(sample["problem"])
    r, s, e = pencil(first)
    errs, C = check_proper(r, s, e)
    if C is None:
        return errs, None
    A = point(second)
    if A == tuple(C):
        errs.append("A is the centre")
    if not all(small_int(v, 7) for v in A):
        errs.append("A out of range")
    at = expand(e.subs({X: A[0], Y: A[1]}))
    sol = solve(at, K)
    if sol:
        k = sol[0]
        truth = line_of_expr(e.subs(K, k))
        kind = "punto"
        if k == 0:
            errs.append("A on r")
        if Rational(k).q > 6:
            errs.append(f"k = {k} with denominator over 6")
    else:
        if s.subs({X: A[0], Y: A[1]}) != 0:
            return errs + ["no k and A not on the excluded line"], None
        truth = line_of_expr(s)
        kind = "esclusa"
    L = Line(Point(*C), Point(*A))
    if norm(*L.coefficients) != truth:
        errs.append("the line found is not CA")
    if sample["params"].get("case") != kind:
        errs.append("params.case differs")
    errs += check_choice(sample["answer"], truth, "line", "implicit")
    if kind == "esclusa" and not any(o["latex"] == "\\text{nessuna retta}" for o in sample["answer"]["options"]):
        errs.append("excluded case without 'nessuna retta'")
    return errs, kind


def level7(sample):
    first, second = givens(sample["problem"])
    r, s, e = pencil(first)
    errs, C = check_proper(r, s, e)
    if C is None:
        return errs, None
    if not second.startswith("d: "):
        return errs + ["second line is not d: ..."], None
    d = line_tex(second[3:])
    if on(d, C):
        errs.append("d through the centre")
    prompt = sample["prompt"]
    rel = "parallela" if "parallela alla retta d" in prompt else "perpendicolare" if "perpendicolare alla retta d" in prompt else None
    if rel is None or sample["params"].get("relation") != rel:
        return errs + ["relation not in the prompt"], None
    a, b = e.coeff(X), e.coeff(Y)
    cond = a * d[1] - b * d[0] if rel == "parallela" else a * d[0] + b * d[1]
    cond = expand(cond)
    sol = solve(cond, K)
    exl = line_of_expr(s)
    dl = sym_line(d)
    if sol:
        k = sol[0]
        truth = line_of_expr(e.subs(K, k))
        kind = "verticale" if truth[1] == 0 else rel
        if k == 0:
            errs.append("the answer is r (k = 0)")
    else:
        if cond != 0 and not cond.free_symbols:
            ok = dl.is_parallel(sym_line(exl)) if rel == "parallela" else dl.is_perpendicular(sym_line(exl))
            if not ok:
                return errs + ["no k and the excluded line has not the property"], None
            truth = exl
            kind = "esclusa"
        else:
            return errs + [f"condition {cond}"], None
    tl = sym_line(truth)
    if not (tl.is_parallel(dl) if rel == "parallela" else tl.is_perpendicular(dl)):
        errs.append("sympy: the answer has not the property")
    if not on(truth, C):
        errs.append("answer not through the centre")
    if sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')} but {kind}")
    if second[3:].startswith("y = ") or d[0] == 0 or d[1] == 0:
        pass
    else:
        errs += implicit_form_errors(second[3:])
    errs += check_choice(sample["answer"], truth, "line", "implicit")
    if kind in ("esclusa", "verticale") and not any(o["latex"] == "\\text{nessuna retta}" for o in sample["answer"]["options"]):
        errs.append("no 'nessuna retta' option")
    return errs, kind


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs = []
    for name, rx in FORBIDDEN:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden {name!r}: {sample['problem']}")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    if re.search(r"\\begin\{(aligned|gathered|array)\}", sample["solution"] + " ".join(sample["steps"])):
        errs.append("environment in the solution or the steps")
    fn = LEVELS.get(sample["level"])
    if fn is None:
        return errs + [f"unknown level {sample['level']}"], None
    try:
        more, kind = fn(sample)
    except TexError as e:
        return errs + [f"unreadable: {e}"], None
    return errs + more, kind
