"""Checker for rette-parallele-tra-loro, from specs/exercises/rette-parallele-tra-loro.md and lesson 83.

Everything is read back from the LaTeX the student sees, with a small parser written here (integers, x, y, k,
brackets, \\frac and \\dfrac, \\cdot, juxtaposition), and recomputed with SymPy's geometry: `Line.is_parallel`,
`Line.is_perpendicular`, `Segment.perpendicular_bisector`, `Line.projection`, `solve` for the parameter k.
Two equations are the same line when their coefficients are proportional, so a distractor equal to the
answer multiplied by 2 counts as right (and fails the sample). Every option is parsed from its LaTeX and
compared with its `values`; exactly one must be right, and `correct` must point there.
"""
import re
from math import gcd

from sympy import Integer, Line, Point, Rational, Segment, Symbol, expand, solve, sympify

X, Y, K = Symbol("x"), Symbol("y"), Symbol("k")
SYMS = {"x": X, "y": Y, "k": K}

CASE_RANGES = {
    1: {"parallele": (0.23, 0.37), "perpendicolari": (0.28, 0.42), "incidenti": (0.14, 0.27), "coincidenti": (0.09, 0.21)},
    2: {"esplicita": (0.42, 0.58), "implicita": (0.42, 0.58)},
    3: {"parallela": (0.42, 0.58), "perpendicolare": (0.42, 0.58)},
    4: {"parallela": (0.32, 0.48), "perpendicolare": (0.52, 0.68)},
    5: {"implicita": (0.62, 0.78), "assi": (0.22, 0.38)},
    6: {"positivi": (0.28, 0.42), "negativi": (0.28, 0.42), "orizzontale": (0.10, 0.21), "verticale": (0.10, 0.21)},
    7: {"intera": (0.33, 0.47), "frazionaria": (0.33, 0.47), "assi": (0.14, 0.26)},
}

FORBIDDEN = [
    ("1x", re.compile(r"(?<![\d}])1\s*[xyk(]")),
    ("0x", re.compile(r"(?<![\d}])0\s*[xyk(]")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
    ("zero term", re.compile(r"[+-]\s*0(?![\d,])")),
]

POS_TEXT = {
    "parallele": r"\text{parallele e distinte}",
    "coincidenti": r"\text{coincidenti}",
    "perpendicolari": r"\text{perpendicolari}",
    "incidenti": r"\text{incidenti, non perpendicolari}",
}


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


def coeffs(e):
    """(a, b, c) of a linear equation a x + b y + c = 0, as SymPy Rationals."""
    e = expand(e)
    a, b = e.coeff(X), e.coeff(Y)
    c = e.subs({X: 0, Y: 0})
    if expand(e - a * X - b * Y - c) != 0 or any(v.free_symbols for v in (a, b, c)):
        raise TexError(f"not linear: {e}")
    if a == 0 and b == 0:
        raise TexError(f"not a line: {e}")
    return (a, b, c)


def as_line(abc):
    """A SymPy Line from a x + b y + c = 0."""
    a, b, c = abc
    if b != 0:
        return Line(Point(0, -c / b), Point(1, (-a - c) / b))
    return Line(Point(-c / a, 0), Point(-c / a, 1))


def same_line(u, v):
    a, b, c = u
    d, e, f = v
    return a * e - b * d == 0 and a * f - c * d == 0 and b * f - c * e == 0


def reduced_tri(abc):
    """The reduced integer triple of a line: gcd 1, a > 0 (or a = 0 and b > 0)."""
    a, b, c = [Rational(v) for v in abc]
    from sympy import ilcm

    L = ilcm(a.q, b.q, c.q)
    A, B, C = int(a * L), int(b * L), int(c * L)
    g = gcd(gcd(A, B), C)
    A, B, C = A // g, B // g, C // g
    if A < 0 or (A == 0 and B < 0):
        A, B, C = -A, -B, -C
    return (A, B, C)


def given(problem):
    """The givens of the problem, split at \\quad: points by name, lines by name (their LaTeX)."""
    points, lines = {}, {}
    for part in re.split(r"\\quad", problem):
        part = part.strip()
        m = re.fullmatch(r"([A-Z])\((-?\d+), (-?\d+)\)", part)
        if m:
            points[m.group(1)] = (Integer(m.group(2)), Integer(m.group(3)))
            continue
        m = re.fullmatch(r"([a-z])\\colon\\ (.+)", part)
        if m:
            lines[m.group(1)] = m.group(2).strip()
            continue
        raise TexError(f"unreadable given {part!r}")
    return points, lines


def point_option(tex):
    m = re.fullmatch(r"H(?:\\left)?\((.*?)(?:\\right)?\)", tex.strip())
    if not m:
        raise TexError(f"not a point H(...): {tex!r}")
    body = m.group(1)
    depth, cut = 0, None
    for i, ch in enumerate(body):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
        elif ch == "," and depth == 0:
            cut = i
    if cut is None:
        raise TexError(f"no comma in {tex!r}")
    return (parse(body[:cut]), parse(body[cut + 1 :]))


def fracs_reduced(tex):
    """Every \\frac{n}{d} of tex has gcd 1 and d > 1."""
    for n, d in re.findall(r"\\d?frac\{(\d+)\}\{(\d+)\}", tex):
        if gcd(int(n), int(d)) != 1 or int(d) < 2:
            return False
    return True


# ---------------------------------------------------------------------------
# Choice


def check_choice(ch, read, is_right, values_ok):
    errs = []
    if not ch:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    parsed = []
    for o in opts:
        try:
            v = read(o["latex"])
        except (TexError, ValueError, TypeError) as e:
            return errs + [f"option unreadable: {e}"]
        if not values_ok(v, o.get("values", []), o["latex"]):
            errs.append(f"option latex {o['latex']} != values {o.get('values')}")
        for name, rx in FORBIDDEN:
            if rx.search(o["latex"]):
                errs.append(f"option contains '{name}': {o['latex']}")
        if not fracs_reduced(o["latex"]):
            errs.append(f"fraction not reduced in option {o['latex']}")
        parsed.append(v)
    if len({o["latex"] for o in opts}) != len(opts) or len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("repeated options")
    right = [i for i, v in enumerate(parsed) if is_right(v)]
    if len(right) != 1:
        errs.append(f"{len(right)} options are right")
    if ch.get("correct") not in right:
        errs.append(f"correct {ch.get('correct')} is not the right option {right}")
    return errs


def read_number(tex):
    v = parse(tex)
    if not v.is_Rational:
        raise TexError(f"not a number: {tex!r}")
    return v


def values_number(v, values, tex):
    return len(values) == 1 and Rational(values[0]) == v


def read_line(tex):
    return coeffs(parse_eq(tex))


def values_line(v, values, tex):
    try:
        tri = tuple(int(s) for s in values)
    except ValueError:
        return False
    return len(tri) == 3 and same_line(v, tri) and tri == reduced_tri(tri)


def values_point(v, values, tex):
    return len(values) == 2 and all(Rational(s) == c for s, c in zip(values, v))


def explicit_form(tex):
    """y = m x + q (or y = q) with m and q reduced, or x = h. Returns the problem, or None if fine."""
    t = tex.strip()
    if re.fullmatch(r"x = -?(\d+|\\frac\{\d+\}\{\d+\})", t):
        return None
    if not t.startswith("y = "):
        return f"not explicit: {tex!r}"
    rhs = parse(t[4:])
    if rhs.has(Y):
        return f"y on the right: {tex!r}"
    if not fracs_reduced(t):
        return f"fraction not reduced: {tex!r}"
    return None


def implicit_form(tex, abc):
    """a x + b y + c = 0 with integer, coprime coefficients and a > 0; x = h / y = k for lines parallel to an axis."""
    a, b, c = abc
    t = tex.strip()
    if a == 0 or b == 0:
        if not re.fullmatch(r"[xy] = -?\d+", t):
            return f"axis-parallel line not as x = h / y = k: {tex!r}"
        return None
    if not t.endswith("= 0") or "frac" in t:
        return f"not implicit with integer coefficients: {tex!r}"
    if tuple(int(v) for v in (a, b, c)) != reduced_tri((a, b, c)):
        return f"implicit form not reduced: {tex!r}"
    return None


# ---------------------------------------------------------------------------
# Levels


def position(u, v):
    L1, L2 = as_line(u), as_line(v)
    if L1.is_parallel(L2):
        return "coincidenti" if same_line(u, v) else "parallele"
    return "perpendicolari" if L1.is_perpendicular(L2) else "incidenti"


def level1(sample):
    errs = []
    _, lines = given(sample["problem"])
    if set(lines) != {"r", "s"}:
        return [f"lines {sorted(lines)}"], None
    r, s = read_line(lines["r"]), read_line(lines["s"])
    pos = position(r, s)
    if re.match(r"[xy] = ", lines["s"]):
        errs.append(f"s written in explicit form: {lines['s']}")
    if lines["r"].replace(" ", "") == lines["s"].replace(" ", ""):
        errs.append("r and s written the same")
    for tex in lines.values():
        if any(abs(int(n)) > 30 for n in re.findall(r"\d+", tex)):
            errs.append(f"coefficient beyond 30 in {tex}")
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer is not a choice"], pos
    opts = ans["options"]
    texts = [o["latex"] for o in opts]
    if sorted(texts) != sorted(POS_TEXT.values()):
        errs.append(f"options {texts}")
    for o in opts:
        if POS_TEXT.get(o["values"][0]) != o["latex"]:
            errs.append(f"option {o['latex']} with values {o['values']}")
    if opts[ans["correct"]]["latex"] != POS_TEXT[pos]:
        errs.append(f"correct {opts[ans['correct']]['latex']}, sympy says {pos}")
    if sample.get("choice") != ans:
        errs.append("choice differs from answer")
    return errs, pos


def level2(sample):
    errs = []
    _, lines = given(sample["problem"])
    tex = lines["r"]
    r = read_line(tex)
    a, b, c = r
    if b == 0 or a == 0:
        return [f"r parallel to an axis: {tex}"], None
    m = -a / b
    if abs(m) == 1:
        errs.append(f"m = {m}")
    truth = -1 / m
    L = as_line(r)
    if not L.is_perpendicular(Line(Point(0, 0), Point(1, truth))):
        errs.append("sympy: truth not perpendicular")
    kind = "esplicita" if tex.startswith("y = ") else "implicita"
    if kind == "implicita" and (not tex.endswith("= 0") or c == 0):
        errs.append(f"implicit r badly written: {tex}")
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != truth:
        errs.append(f"answer {ans} != {truth}")
    errs += check_choice(sample.get("choice"), read_number, lambda v: v == truth, values_number)
    return errs, kind


def level3(sample):
    errs = []
    _, lines = given(sample["problem"])
    r, s = lines["r"], lines["s"]
    if not (r.startswith("y = ") and s.startswith("y = ")):
        return [f"lines not explicit: {r}, {s}"], None
    rr = parse(r[4:])
    mr = expand(rr).coeff(X)
    ms = parse(s[4:]).coeff(X)
    if not mr.has(K) or ms.has(K) or ms == 0:
        return [f"slopes {mr}, {ms}"], None
    prompt = sample["prompt"]
    rel = "parallela" if "parallela" in prompt else "perpendicolare" if "perpendicolare" in prompt else None
    if rel is None:
        return ["prompt without the relation"], None
    sol = solve(mr - ms, K) if rel == "parallela" else solve(mr * ms + 1, K)
    if len(sol) != 1:
        return [f"k solutions {sol}"], rel
    k = sol[0]
    if k == 0 or k.q > 15:
        errs.append(f"k = {k} out of spec")
    L1 = as_line(coeffs(expand(Y - rr.subs(K, k))))
    L2 = as_line(coeffs(expand(Y - parse(s[4:]))))
    if rel == "parallela" and not L1.is_parallel(L2):
        errs.append("sympy: not parallel")
    if rel == "perpendicolare" and not L1.is_perpendicular(L2):
        errs.append("sympy: not perpendicular")
    if rel == "parallela" and L1.equals(L2):
        errs.append("r coincides with s")
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != k:
        errs.append(f"answer {ans} != {k}")
    errs += check_choice(sample.get("choice"), read_number, lambda v: v == k, values_number)
    return errs, rel


def through(sample, name, need_negative):
    errs = []
    points, lines = given(sample["problem"])
    if set(points) != {name} or set(lines) != {"r"}:
        return [f"givens {sorted(points)}, {sorted(lines)}"], None, None, None, None
    P = points[name]
    r = read_line(lines["r"])
    L = as_line(r)
    if L.contains(Point(*P)):
        errs.append(f"{name} lies on r")
    if need_negative and not (P[0] < 0 or P[1] < 0):
        errs.append(f"{name} without negative coordinates")
    if not need_negative and not (P[0] >= 1 and P[1] >= 0):
        errs.append(f"{name} {P} not with x >= 1 and y >= 0")
    prompt = sample["prompt"]
    rel = "parallela" if "parallela" in prompt else "perpendicolare" if "perpendicolare" in prompt else None
    if rel is None:
        return errs + ["prompt without the relation"], None, None, None, None
    truth = L.parallel_line(Point(*P)) if rel == "parallela" else L.perpendicular_line(Point(*P))
    a, b, c = truth.coefficients
    return errs, rel, (a, b, c), r, lines["r"]


def level4(sample):
    errs, rel, truth, r, rtex = through(sample, "P", False)
    if rel is None:
        return errs, None
    if not rtex.startswith("y = "):
        errs.append(f"r not explicit: {rtex}")
    ans = sample["answer"]
    if ans.get("kind") != "expression":
        return errs + ["answer is not an expression"], rel
    a, b, c = truth
    rhs = -(a * X + c) / b
    if expand(sympify(ans["value"]) - rhs) != 0:
        errs.append(f"answer value {ans['value']} != {rhs}")
    if not same_line(read_line(ans["latex"]), truth):
        errs.append(f"answer latex {ans['latex']} is not the line")
    f = explicit_form(ans["latex"])
    if f:
        errs.append(f)
    errs += check_choice(sample.get("choice"), read_line, lambda v: same_line(v, truth), values_line)
    for o in sample.get("choice", {}).get("options", []):
        f = explicit_form(o["latex"])
        if f:
            errs.append(f"option {f}")
    return errs, rel


def level5(sample):
    errs, rel, truth, r, rtex = through(sample, "A", True)
    if rel is None:
        return errs, None
    axis = r[0] == 0 or r[1] == 0
    if not axis:
        if not rtex.endswith("= 0"):
            errs.append(f"r not implicit: {rtex}")
        prompt_ok = "forma implicita" in sample["prompt"]
        if not prompt_ok:
            errs.append("prompt does not ask for the implicit form")
    ans = sample["answer"]
    if ans.get("kind") != "choice" or sample.get("choice") != ans:
        errs.append("answer is not the choice")
    errs += check_choice(ans, read_line, lambda v: same_line(v, truth), values_line)
    for o in ans.get("options", []):
        try:
            f = implicit_form(o["latex"], read_line(o["latex"]))
        except TexError as e:
            f = str(e)
        if f:
            errs.append(f"option {f}")
    return errs, "assi" if axis else "implicita"


def level6(sample):
    errs = []
    points, lines = given(sample["problem"])
    if set(points) != {"A", "B"} or lines:
        return [f"givens {sorted(points)}"], None
    A, B = points["A"], points["B"]
    if A == B:
        return ["A = B"], None
    M = Point((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)
    if not (M.x.is_integer and M.y.is_integer):
        errs.append(f"midpoint {M} not integer")
    bis = Segment(Point(*A), Point(*B)).perpendicular_bisector()
    truth = bis.coefficients
    if A[1] == B[1]:
        kind = "orizzontale"
    elif A[0] == B[0]:
        kind = "verticale"
    else:
        kind = "negativi" if min(A + B) < 0 else "positivi"
    ans = sample["answer"]
    if kind == "orizzontale":
        if ans.get("kind") != "choice" or sample.get("choice") != ans:
            errs.append("vertical axis: answer is not the choice")
    else:
        if ans.get("kind") != "expression":
            return errs + ["answer is not an expression"], kind
        a, b, c = truth
        rhs = -(a * X + c) / b
        if expand(sympify(ans["value"]) - rhs) != 0:
            errs.append(f"answer value {ans['value']} != {rhs}")
        if not same_line(read_line(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} is not the axis")
        f = explicit_form(ans["latex"])
        if f:
            errs.append(f)
    ch = sample.get("choice")
    errs += check_choice(ch, read_line, lambda v: same_line(v, truth), values_line)
    for o in (ch or {}).get("options", []):
        f = explicit_form(o["latex"])
        if f:
            errs.append(f"option {f}")
    return errs, kind


def level7(sample):
    errs = []
    points, lines = given(sample["problem"])
    if set(points) != {"P"} or set(lines) != {"r"}:
        return [f"givens {sorted(points)}, {sorted(lines)}"], None
    P = Point(*points["P"])
    r = read_line(lines["r"])
    L = as_line(r)
    if L.contains(P):
        errs.append("P lies on r")
    H = L.projection(P)
    axis = r[0] == 0 or r[1] == 0
    kind = "assi" if axis else "intera" if H.x.is_integer and H.y.is_integer else "frazionaria"
    if kind == "frazionaria" and max(H.x.q, H.y.q) > 10:
        errs.append(f"H {H} with denominator over 10")
    if kind == "intera" and not lines["r"].startswith("y = "):
        errs.append("integer H with r not explicit")
    if kind == "frazionaria" and not lines["r"].endswith("= 0"):
        errs.append("fractional H with r not implicit")
    ans = sample["answer"]
    if ans.get("kind") != "choice" or sample.get("choice") != ans:
        errs.append("answer is not the choice")
    errs += check_choice(ans, point_option, lambda v: Point(*v) == H, values_point)
    return errs, kind


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs = []
    for name, rx in FORBIDDEN:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains '{name}': {sample['problem']}")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    for tex in [sample["solution"], *sample.get("steps", [])]:
        if re.search(r"\\begin\{", tex) and "\\text" in tex:
            errs.append(f"environment with text in a step: {tex}")
        if "—" in tex or "piuttosto che" in tex:
            errs.append(f"forbidden punctuation or words: {tex}")
    fn = LEVELS.get(sample["level"])
    if fn is None:
        return errs + [f"unknown level {sample['level']}"], None
    try:
        e, kind = fn(sample)
    except TexError as ex:
        return errs + [f"unreadable: {ex}"], None
    return errs + e, kind
