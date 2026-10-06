"""Shared checks of the chapter "Funzioni e loro proprietà" (lessons 105-109).

Nothing here is copied from src/lib/exercises/v2/funzioni.ts. The pieces:
- a formula is read back from the LaTeX the student sees (tex_to_expr) and compared, value by value, with the
  SymPy string of the params (same_function);
- domain, zeros and sign are found by probing: the real roots of every polynomial that appears in the formula
  cut the line into points and open pieces, and the formula is evaluated exactly on each (set_by_probe);
- the options are read back from their LaTeX (intervals with reversed brackets, numbers, points) and must say
  what their `values` say.
"""
import re

from sympy import Abs, Poly, Rational, Symbol, preorder_traversal, sqrt
from sympy.parsing.sympy_parser import implicit_multiplication_application, parse_expr, standard_transformations

from verify import FORBIDDEN

x = Symbol("x", real=True)
TRANSFORMS = standard_transformations + (implicit_multiplication_application,)
LOCALS = {"x": x, "Abs": Abs, "sqrt": sqrt, "Rational": Rational}


def parse_py(s):
    if not isinstance(s, str) or not re.fullmatch(r"[0-9x+\-*/() ,A-Za-z]+", s):
        raise ValueError(f"not a formula: {s!r}")
    return parse_expr(s, local_dict=LOCALS)


def _group(s, i):
    """The {…} group that starts at s[i]: its content and the index after it."""
    if i >= len(s) or s[i] != "{":
        raise ValueError(f"expected a group at {i} in {s!r}")
    depth, j = 0, i
    while j < len(s):
        if s[j] == "{":
            depth += 1
        elif s[j] == "}":
            depth -= 1
            if depth == 0:
                return s[i + 1 : j], j + 1
        j += 1
    raise ValueError(f"unbalanced braces in {s!r}")


def _glue(out):
    """A factor written right after another one is multiplied: x\\sqrt{…}, 2\\lvert x \\rvert, (x - 1)\\sqrt{…}."""
    t = out.rstrip()
    return out + "*" if t and (t[-1].isalnum() or t[-1] == ")") else out


def tex_to_py(s):
    out, i = "", 0
    while i < len(s):
        if s.startswith("\\dfrac", i) or s.startswith("\\frac", i):
            i += 6 if s.startswith("\\dfrac", i) else 5
            a, i = _group(s, i)
            b, i = _group(s, i)
            out = _glue(out) + f"(({tex_to_py(a)})/({tex_to_py(b)}))"
        elif s.startswith("\\sqrt", i):
            a, i = _group(s, i + 5)
            out = _glue(out) + f"sqrt({tex_to_py(a)})"
        elif s.startswith("\\lvert", i):
            j = s.index("\\rvert", i)
            out = _glue(out) + f"Abs({tex_to_py(s[i + 6 : j])})"
            i = j + 6
        elif s.startswith("\\cdot", i):
            out += "*"
            i += 5
        elif s.startswith("\\left", i):
            i += 5
        elif s.startswith("\\right", i):
            i += 6
        elif s[i] == "^":
            if s[i + 1] == "{":
                a, i = _group(s, i + 1)
                out += f"**({a})"
            else:
                out += "**" + s[i + 1]
                i += 2
        elif s[i] == "\\":
            raise ValueError(f"unknown command in {s!r} at {i}")
        else:
            out += s[i]
            i += 1
    return out


def tex_to_expr(tex):
    return parse_expr(tex_to_py(tex.strip()), local_dict=LOCALS, transformations=TRANSFORMS)


_CONDITIONS = {}


def conditions(expr):
    """What must hold for the formula to exist: (base, "nonzero" | "nonneg" | "positive") for every division and
    every root of even index in it. Read once from the tree; 0 · √(-1) must not count as a value."""
    if expr not in _CONDITIONS:
        out = []
        for node in preorder_traversal(expr):
            if node.is_Pow and node.base.has(x):
                e = node.exp
                if not e.is_Rational:
                    raise ValueError(f"esponente non razionale in {expr}")
                even_root = e.q % 2 == 0
                if even_root:
                    out.append((node.base, "positive" if e < 0 else "nonneg"))
                elif e < 0:
                    out.append((node.base, "nonzero"))
        _CONDITIONS[expr] = out
    return _CONDITIONS[expr]


def value_at(expr, v):
    """The exact value of the formula at v, or None where it does not exist."""
    for base, kind in conditions(expr):
        b = value_at(base, v)
        if b is None or (kind == "nonzero" and b == 0) or (kind == "nonneg" and b < 0) or (kind == "positive" and b <= 0):
            return None
    val = expr.subs(x, v)
    if val.is_real is not True or val.is_finite is not True:
        return None
    return val


PROBES = [Rational(n, 6) for n in range(-61, 62, 11)] + [Rational(n) for n in (-7, -3, -1, 0, 1, 2, 5, 8)]


def same_function(a, b):
    for v in PROBES:
        va, vb = value_at(a, v), value_at(b, v)
        if (va is None) != (vb is None):
            return False
        if va is not None and (va - vb).simplify() != 0:
            return False
    return True


def critical_points(expr):
    """Real roots of every polynomial piece of the formula: where its domain, its zeros or its sign can change."""
    pts = set()

    def walk(e):
        if not e.has(x):
            return
        if e.is_polynomial(x):
            for r in Poly(e, x).real_roots():
                if not r.is_rational:
                    raise ValueError(f"irrational root in {e}")
                pts.add(Rational(r))
            return
        for a in e.args:
            walk(a)

    walk(expr)
    return sorted(pts)


def _end(v, inf):
    return inf if v is None else str(v)


def set_by_probe(pts, holds):
    """The set where `holds` is true, as interval values "(a,b]", given the points where it can change."""
    pieces = []  # (kind, lo, hi, on): alternately an open piece and a point
    los = [None] + pts
    for i, lo in enumerate(los):
        hi = pts[i] if i < len(pts) else None
        mid = (lo + hi) / 2 if lo is not None and hi is not None else (hi - 1 if lo is None and hi is not None else (lo + 1 if lo is not None else Rational(0)))
        pieces.append(("open", lo, hi, bool(holds(mid))))
        if hi is not None:
            pieces.append(("point", hi, hi, bool(holds(hi))))
    out, i = [], 0
    while i < len(pieces):
        if not pieces[i][3]:
            i += 1
            continue
        j = i
        while j + 1 < len(pieces) and pieces[j + 1][3]:
            j += 1
        a, b = pieces[i], pieces[j]
        out.append(f"{'[' if a[0] == 'point' else '('}{_end(a[1], '-oo')},{_end(b[2], 'oo')}{']' if b[0] == 'point' else ')'}")
        i = j + 1
    return out


def domain(expr):
    """Only the denominators and the radicands can cut the domain: their roots are the points to probe."""
    pts = sorted({p for base, _ in conditions(expr) for p in critical_points(base)})
    return set_by_probe(pts, lambda v: value_at(expr, v) is not None)


def sign_set(expr, sign):
    def holds(v):
        val = value_at(expr, v)
        return val is not None and (val > 0 if sign > 0 else val < 0)

    return set_by_probe(critical_points(expr), holds)


def zeros(expr):
    return [p for p in critical_points(expr) if value_at(expr, p) == 0]


# ---------------------------------------------------------------------------
# Reading the options


def number(t):
    """-3, \\frac{7}{2}, -\\frac{5}{2}, 0{,}25."""
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    m = re.fullmatch(r"(-?\d+)\{,\}(\d+)", t)
    if m:
        sign = -1 if m.group(1).startswith("-") else 1
        return Rational(int(m.group(1))) + sign * Rational(int(m.group(2)), 10 ** len(m.group(2)))
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable number {t!r}")


def _interval(t):
    t = t.strip().replace("\\left", "").replace("\\right", "").replace("\\mathopen{]}", "]").replace("\\mathclose{[}", "[").replace("\\,", "").strip()
    m = re.fullmatch(r"([\[\]])(.+), (.+?)([\[\]])", t)
    if not m:
        raise ValueError(f"not an interval {t!r}")
    lo, hi = m.group(2).strip(), m.group(3).strip()
    lo_v = None if lo == "-\\infty" else number(lo)
    hi_v = None if hi == "+\\infty" else number(hi)
    lo_c, hi_c = m.group(1) == "[", m.group(4) == "]"
    if (lo_v is None and lo_c) or (hi_v is None and hi_c):
        raise ValueError(f"infinity included in {t!r}")
    if lo_v is not None and hi_v is not None and lo_v >= hi_v:
        raise ValueError(f"ends out of order in {t!r}")
    return f"{'[' if lo_c else '('}{_end(lo_v, '-oo')},{_end(hi_v, 'oo')}{']' if hi_c else ')'}"


def intervals(latex):
    """A set of reals as the lessons write it, as the list of its interval values."""
    s = latex.strip()
    if s == "\\emptyset":
        return []
    if s == "\\mathbb{R}":
        return ["(-oo,oo)"]
    m = re.fullmatch(r"\\mathbb\{R\} \\setminus \\\{(.*)\\\}", s)
    if m:
        pts = [number(p) for p in m.group(1).split(",\\ ")]
        if pts != sorted(set(pts)):
            raise ValueError(f"points out of order in {latex!r}")
        ends = [None] + pts + [None]
        return [f"({_end(a, '-oo')},{_end(b, 'oo')})" for a, b in zip(ends, ends[1:])]
    g = re.fullmatch(r"\\begin\{gathered\} (.*) \\\\ \\cup\\, (.*) \\end\{gathered\}", s)
    if g:
        s = g.group(1) + " \\cup " + g.group(2)
    return [_interval(p) for p in s.split(" \\cup ")]


def point(latex):
    s = latex.strip().replace("\\left(", "(").replace("\\right)", ")")
    m = re.fullmatch(r"\((.+), (.+)\)", s)
    if not m:
        raise ValueError(f"not a point {latex!r}")
    return [number(m.group(1)), number(m.group(2))]


def choice_of(sample):
    """The multiple choice of the sample, with the checks every level shares; returns (choice, errors)."""
    errs = []
    ans = sample["answer"]
    ch = ans if ans["kind"] == "choice" else sample.get("choice")
    if not ch or ch.get("kind") != "choice":
        return None, ["manca la scelta multipla"]
    opts = ch["options"]
    if len(opts) != 4:
        errs.append("servono quattro opzioni")
    if not 0 <= ch["correct"] < len(opts):
        return None, errs + ["indice della risposta fuori posto"]
    keys = ["|".join(o["values"]) + "#" + ("" if o["values"] else o["latex"]) for o in opts]
    if len(set(keys)) != len(keys):
        errs.append("opzioni con gli stessi valori")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("opzioni scritte uguali")
    return ch, errs


def common(sample):
    errs = []
    for name, rx in FORBIDDEN:
        if name in ("zero term", "^{0}"):
            continue
        if rx.search(re.sub(r"\\text\{[^{}]*\}", " ", sample["problem"])):
            errs.append(f"scrittura vietata nel problema: {name}")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("mancano passaggi o soluzione")
    if not sample.get("prompt"):
        errs.append("manca la consegna")
    return errs


def function_of(sample, lead="f(x) = "):
    """The formula of the problem, read from its LaTeX and checked against params.fx."""
    problem = sample["problem"]
    if not problem.startswith(lead):
        raise ValueError(f"il problema non comincia con {lead!r}")
    seen = tex_to_expr(problem[len(lead) :])
    if not same_function(seen, parse_py(sample["params"]["fx"])):
        raise ValueError("la formula scritta è diversa da quella dei parametri")
    return seen


def plain(problem):
    """A word problem as the student reads it: (the sentence, with its formulas in LaTeX and no dollars; the
    formula lines under it)."""
    body = problem.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", body)
    rows = m.group(1).split(" \\\\ ") if m else [body]
    words, extra = [], []
    for row in rows:
        t = re.fullmatch(r"\\text\{(.*)\}", row)
        if t and not extra:
            words.append(t.group(1).replace("$", ""))
        else:
            extra.append(row)
    return " ".join(words), extra


def mirrored(dom):
    """The set of the opposites of a set given as interval values."""
    flip = {"(": ")", ")": "(", "[": "]", "]": "["}
    out = []
    for t in reversed(dom):
        lo, hi = t[1:-1].split(",")
        neg = lambda e: "oo" if e == "-oo" else "-oo" if e == "oo" else str(-Rational(e))  # noqa: E731
        out.append(f"{flip[t[-1]]}{neg(hi)},{neg(lo)}{flip[t[0]]}")
    return out


def inside(dom, v):
    for t in dom:
        lo, hi = t[1:-1].split(",")
        above = lo == "-oo" or v > Rational(lo) or (t[0] == "[" and v == Rational(lo))
        below = hi == "oo" or v < Rational(hi) or (t[-1] == "]" and v == Rational(hi))
        if above and below:
            return True
    return False
