"""Checker for sistemi-cramer, from specs/exercises/sistemi-cramer.md and lesson 69.

Everything is recomputed from the LaTeX the student sees, with a small parser written here (numbers,
x, y, z, k, brackets, \\frac and \\dfrac, juxtaposition). Determinants come from SymPy's Matrix.det,
solutions from linsolve, the values of k from solve; a discussion is recomputed by substituting each
value of k that cancels D into the system and solving it again, so the degenerate case (every
coefficient zero) is judged by the equations and not by the table of determinants. Every choice
option is parsed back from its LaTeX, compared with its `values`, and exactly one must be right.
"""
import re

from sympy import EmptySet, FiniteSet, Integer, Matrix, Rational, Symbol, cancel, linsolve, solve, sympify

X, Y, Z, K = Symbol("x"), Symbol("y"), Symbol("z"), Symbol("k")
SYMS = {"x": X, "y": Y, "z": Z, "k": K}

CASE_RANGES = {
    4: {"impossibile": (0.20, 0.40), "indeterminato": (0.20, 0.40), "valore": (0.30, 0.50)},
    5: {"impossibile": (0.20, 0.40), "indeterminato": (0.12, 0.30), "tre casi": (0.25, 0.45), "degenere": (0.08, 0.22)},
}

FORBIDDEN = [
    ("1x", re.compile(r"(?<![\d}])1\s*[xyzk(]")),
    ("0x", re.compile(r"(?<![\d}])0\s*[xyzk(]")),
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
    return parse(lhs) - parse(rhs)


def env_body(tex, env):
    m = re.fullmatch(r"\s*\\begin\{" + env + r"\}(.*)\\end\{" + env + r"\}\s*", tex, re.S)
    if not m:
        raise TexError(f"not a {env}: {tex!r}")
    return [ln.strip() for ln in re.split(r"\\\\(?:\[\d+pt\])?", m.group(1))]


def system(tex):
    return [parse_eq(ln) for ln in env_body(tex, "cases")]


def matrix(tex):
    rows = [[parse(c) for c in ln.split("&")] for ln in env_body(tex, "vmatrix")]
    return Matrix(rows)


def coeffs(eq, unknowns):
    """Coefficients of the unknowns and the constant on the right of a linear equation eq = 0."""
    e = sympify(eq).expand()
    cs = [e.coeff(u) for u in unknowns]
    const = e.subs({u: 0 for u in unknowns})
    if any(c.has(*unknowns) for c in cs) or cancel(e - sum(c * u for c, u in zip(cs, unknowns)) - const) != 0:
        raise TexError(f"not linear: {eq}")
    return cs, -const


def solve_kind(eqs, unknowns):
    """('det', solution tuple) | ('imp', None) | ('ind', None)."""
    sol = linsolve(eqs, unknowns)
    if sol == EmptySet:
        return "imp", None
    (t,) = list(sol)
    if any(v.free_symbols & set(unknowns) for v in t):
        return "ind", None
    return "det", tuple(t)


def number(tex):
    v = parse(tex)
    if not v.is_Rational:
        raise TexError(f"not a number: {tex!r}")
    return Rational(v)


def tuple_of(tex):
    m = re.fullmatch(r"\\left\((.*)\\right\)", tex.strip())
    if not m:
        raise TexError(f"not a tuple: {tex!r}")
    parts, depth, cur = [], 0, ""
    for ch in m.group(1):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
        if ch == "," and depth == 0:
            parts.append(cur)
            cur = ""
        else:
            cur += ch
    parts.append(cur)
    return tuple(parse(p) for p in parts)


# ---------------------------------------------------------------------------
# Common checks


def check_choice(ch, truth_index_fn, read, compare_values):
    """4 options, distinct, each option's LaTeX equal to its values, exactly one right, `correct` on it."""
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
        except TexError as e:
            errs.append(f"option unreadable: {e}")
            return errs
        if not compare_values(v, o.get("values", [])):
            errs.append(f"option latex {o['latex']} != values {o.get('values')}")
        parsed.append(v)
    if len({o["latex"] for o in opts}) != len(opts) or len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("repeated options")
    right = [i for i, v in enumerate(parsed) if truth_index_fn(v)]
    if len(right) != 1:
        errs.append(f"{len(right)} options are right")
    if ch.get("correct") not in right:
        errs.append(f"correct {ch.get('correct')} is not the right option {right}")
    return errs


def same_tuple(a, b):
    return len(a) == len(b) and all(cancel(sympify(p) - sympify(q)) == 0 for p, q in zip(a, b))


def values_tuple(v, values):
    try:
        return same_tuple(v, [Rational(s) for s in values])
    except (TypeError, ValueError):
        return False


def values_number(v, values):
    return len(values) == 1 and Rational(values[0]) == v


# ---------------------------------------------------------------------------
# Levels


def check_det(sample, n):
    errs = []
    M = matrix(sample["problem"])
    if M.shape != (n, n):
        return [f"matrix {M.shape}"], None
    entries = list(M)
    if any(not e.is_Integer for e in entries):
        errs.append("non-integer entries")
    lim = 9 if n == 2 else 4
    if any(abs(e) > lim for e in entries):
        errs.append(f"entry beyond {lim}")
    if n == 2:
        if 0 in entries:
            errs.append("zero entry at level 1")
        if not any(e < 0 for e in entries):
            errs.append("no negative entry at level 1")
    else:
        if sum(1 for e in entries if e == 0) > 2:
            errs.append("more than two zeros")
    d = M.det()
    if n == 3 and (d == 0 or abs(d) > 150):
        errs.append(f"det {d} out of range")
    a = sample["answer"]
    if a.get("kind") != "number" or Rational(a["value"]) != d:
        errs.append(f"answer {a} != det {d}")
    errs += check_choice(sample.get("choice"), lambda v: v == d, number, values_number)
    return errs, None


NORMAL = re.compile(r"-?\d*x (?:[+-] \d*y )?= -?\d+|-?\d*y = -?\d+")


def check_solve(sample, n):
    errs = []
    unknowns = [X, Y, Z][:n]
    lines = env_body(sample["problem"], "cases")
    eqs = system(sample["problem"])
    if len(eqs) != n:
        return [f"{len(eqs)} equations"], None
    kind, sol = solve_kind(eqs, unknowns)
    if kind != "det":
        return [f"system is {kind}"], None
    lvl = sample["level"]
    if any(not v.is_Rational for v in sol):
        errs.append(f"solution {sol} not rational")
    if lvl == 2:
        for ln, eq in zip(lines, eqs):
            cs, c = coeffs(eq, unknowns)
            if not NORMAL.fullmatch(ln) or any(v == 0 or not v.is_Integer or abs(v) > 6 for v in cs):
                errs.append(f"level 2 line not in normal form with coefficients 1..6: {ln}")
            if abs(c) > 40:
                errs.append("constant beyond 40")
        if any(not v.is_Integer or abs(v) > 6 for v in sol):
            errs.append(f"solution {sol} not integers in [-6, 6]")
    elif lvl == 3:
        if all(NORMAL.fullmatch(ln) and "x" in ln and "y" in ln for ln in lines):
            errs.append("level 3 already in normal form")
        if any(Rational(v).q > 5 for v in sol):
            errs.append(f"solution {sol} with denominator beyond 5")
    elif lvl == 7:
        for eq in eqs:
            cs, c = coeffs(eq, unknowns)
            if any(not v.is_Integer or abs(v) > 3 for v in cs) or sum(1 for v in cs if v != 0) < 2:
                errs.append("level 7 coefficients")
            if abs(c) > 20:
                errs.append("constant beyond 20")
        if any(not v.is_Integer or abs(v) > 4 for v in sol):
            errs.append(f"solution {sol} not integers in [-4, 4]")
    a = sample["answer"]
    if a.get("kind") != "choice":
        return errs + ["answer is not a choice"], None
    errs += check_choice(a, lambda v: same_tuple(v, sol), tuple_of, values_tuple)
    return errs, None


PROMPT_KIND = {"Quale di questi sistemi è impossibile?": "imp", "Quale di questi sistemi è indeterminato?": "ind"}


def check_level4(sample):
    errs = []
    if sample["prompt"] in PROMPT_KIND:
        asked = PROMPT_KIND[sample["prompt"]]
        a = sample["answer"]
        kinds = []
        for o in a.get("options", []):
            eqs = system(o["latex"])
            k, _ = solve_kind(eqs, [X, Y])
            kinds.append(k)
            rows = [coeffs(e, [X, Y]) for e in eqs]
            want = ";".join(",".join(str(v) for v in cs + [c]) for cs, c in rows)
            if o["values"] != [want]:
                errs.append(f"option values {o['values']} != {want}")
            D = Matrix([cs for cs, _ in rows]).det()
            if (D == 0) != (k != "det"):
                errs.append("determinant and solutions disagree")
        other = "ind" if asked == "imp" else "imp"
        if sorted(kinds) != sorted([asked, other, other, "det"]):
            errs.append(f"option kinds {kinds}")
        errs += check_choice(a, lambda v: v == asked, lambda t: solve_kind(system(t), [X, Y])[0], lambda v, vals: True)
        return errs, "impossibile" if asked == "imp" else "indeterminato"
    if sample["prompt"] != "Trova il valore di k per cui il sistema non è determinato.":
        return [f"unknown prompt {sample['prompt']!r}"], None
    eqs = system(sample["problem"])
    rows = [coeffs(e, [X, Y]) for e in eqs]
    D = Matrix([cs for cs, _ in rows]).det()
    ks = solve(D, K)
    if len(ks) != 1:
        return [f"D = {D} has roots {ks}"], "valore"
    kv = ks[0]
    if sum(1 for cs, _ in rows for v in cs if v.has(K)) != 1 or any(c.has(K) for _, c in rows):
        errs.append("k must be exactly one coefficient")
    if solve_kind([e.subs(K, kv) for e in eqs], [X, Y])[0] == "det":
        errs.append("with that k the system is determinate")
    a = sample["answer"]
    if a.get("kind") != "number" or Rational(a["value"]) != kv:
        errs.append(f"answer {a} != {kv}")
    errs += check_choice(sample.get("choice"), lambda v: v == kv, number, values_number)
    return errs, "valore"


# Level 5: discussions


def truth_discussion(eqs):
    rows = [coeffs(e, [X, Y]) for e in eqs]
    A = Matrix([cs for cs, _ in rows])
    D = A.det().expand()
    if D == 0 or not D.has(K):
        raise TexError(f"D = {D}")
    roots = sorted(set(solve(D, K)))
    if any(not r.is_Integer for r in roots):
        raise TexError(f"roots {roots}")
    kind, sol = solve_kind(eqs, [X, Y])
    if kind != "det":
        raise TexError("generic system not determinate")
    cases = {}
    degenerate = False
    for r in roots:
        k, _ = solve_kind([e.subs(K, r) for e in eqs], [X, Y])
        if k == "det":
            raise TexError(f"k = {r} cancels D but the system is determinate")
        if all(c.subs(K, r) == 0 for c in A):
            degenerate = True
        cases[int(r)] = k
    return (frozenset(cases), sol, frozenset(cases.items())), degenerate


def parse_discussion(tex):
    lines = env_body(tex, "gathered")
    split = re.fullmatch(r"(.+)\\text\{:\}", lines[0])
    if split and len(lines) > 1:
        # a long condition, with the pair on the next line
        lines = [f"{split.group(1)}\\text{{: }} {lines[1]}"] + lines[2:]
    m = re.fullmatch(r"(.+)\\text\{: \} (\\left\(.*\\right\))", lines[0])
    if not m:
        raise TexError(f"first line {lines[0]!r}")
    cond = m.group(1).strip()
    if cond == "\\text{per ogni } k":
        excluded = set()
    elif re.fullmatch(r"k \\neq \\pm (\d+)", cond):
        v = int(re.fullmatch(r"k \\neq \\pm (\d+)", cond).group(1))
        excluded = {v, -v}
    else:
        excluded = set()
        for part in cond.split(",\\ "):
            mm = re.fullmatch(r"k \\neq (-?\d+)", part.strip())
            if not mm:
                raise TexError(f"condition {cond!r}")
            excluded.add(int(mm.group(1)))
    pair = tuple_of(m.group(2))
    cases = []
    for ln in lines[1:]:
        mm = re.fullmatch(r"k = (-?\d+)\\text\{: (impossibile|indeterminato)\}", ln)
        if not mm:
            raise TexError(f"case line {ln!r}")
        cases.append((int(mm.group(1)), "imp" if mm.group(2) == "impossibile" else "ind"))
    return frozenset(excluded), pair, frozenset(cases)


def same_discussion(a, b):
    return a[0] == b[0] and a[2] == b[2] and same_tuple(a[1], b[1])


def values_discussion(v, values):
    vals = list(values)
    allflag = bool(vals) and vals[0] == "per_ogni"
    if allflag:
        vals = vals[1:]
    if len(vals) < 2 or not vals[0].startswith("x=") or not vals[1].startswith("y="):
        return False
    pair = (sympify(vals[0][2:], locals={"k": K}), sympify(vals[1][2:], locals={"k": K}))
    cases = set()
    for c in vals[2:]:
        m = re.fullmatch(r"k=(-?\d+):(imp|ind)", c)
        if not m:
            return False
        cases.add((int(m.group(1)), m.group(2)))
    excluded = frozenset(r for r, _ in cases)
    if allflag != (len(excluded) == 0):
        return False
    return same_discussion(v, (excluded, pair, frozenset(cases)))


def check_level5(sample):
    errs = []
    eqs = system(sample["problem"])
    truth, degenerate = truth_discussion(eqs)
    # the first line of a discussion excludes exactly the values that get a line of their own
    kinds = {k for _, k in truth[2]}
    cat = "degenere" if degenerate else "tre casi" if len(kinds) == 2 else "indeterminato" if "ind" in kinds else "impossibile"
    if sample["params"].get("case") != cat:
        errs.append(f"case {sample['params'].get('case')} != {cat}")
    for num_den in truth[1]:
        n, d = cancel(num_den).as_numer_denom()
        if n.as_poly(K) is not None and n.as_poly(K).degree() > 1 or d.as_poly(K).degree() > 1:
            errs.append(f"generic solution {truth[1]} not of degree 1")
    a = sample["answer"]
    if a.get("kind") != "choice":
        return errs + ["answer is not a choice"], cat
    errs += check_choice(a, lambda v: same_discussion(v, truth), parse_discussion, values_discussion)
    sol = sample.get("solution", "")
    if "\\begin" in sol:
        errs.append("solution with an environment")
    return errs, cat


def check(sample):
    lvl = sample["level"]
    if not sample.get("steps"):
        return ["no steps"], None
    if not sample.get("solution"):
        return ["no solution"], None
    errs = [f"problem contains forbidden '{n}': {sample['problem']}" for n, rx in FORBIDDEN if rx.search(sample["problem"])]
    for t in [sample["solution"], *sample["steps"]]:
        if re.search(r"\\begin\{(aligned|gathered|array)\}", t):
            errs.append(f"environment in solution or steps: {t[:60]}")
    try:
        if lvl == 1:
            e, k = check_det(sample, 2)
        elif lvl in (2, 3):
            e, k = check_solve(sample, 2)
        elif lvl == 4:
            e, k = check_level4(sample)
        elif lvl == 5:
            e, k = check_level5(sample)
        elif lvl == 6:
            e, k = check_det(sample, 3)
        elif lvl == 7:
            e, k = check_solve(sample, 3)
        else:
            return [f"unknown level {lvl}"], None
    except TexError as ex:
        return errs + [f"unreadable: {ex}"], None
    return errs + e, k
