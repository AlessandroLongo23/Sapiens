"""Common pieces of the checkers of lessons 121-123 (funzioni-esponenziali, equazioni-esponenziali,
disequazioni-esponenziali), written from the three specifications in specs/exercises/.

It reads the LaTeX of a problem into a SymPy expression in x (powers with any exponent, fractions, products
written with \\cdot or by juxtaposition), writes again the sets of the options from their values (a set of
numbers, a union of intervals in the two notations of lesson 123) and counts the zeros of a function on a grid.
"""
import math
import re

from sympy import Rational, Symbol, lambdify, sympify

x = Symbol("x", real=True)

FORBIDDEN = [
    r"(?<![\d}])1\s*x",
    r"(?<![\d}])0\s*x",
    r"\+\s*-",
    r"-\s*-",
    r"\+\s*\+",
    r"\^\{1\}|\^1(?!\d)",
    r"\^\{0\}|\^0(?!\d)",
    r"[+-]\s*0(?!\d)",
    r"\\frac\{-",
]

OP_TEX = {"<": "<", ">": ">", "<=": r"\leq", ">=": r"\geq"}
OPPURE = r" \ \text{ oppure } \ "


def forbidden(tex):
    return [f"forbidden pattern {p!r} in {tex}" for p in FORBIDDEN if re.search(p, tex)]


def group(s, i):
    """The brace group starting at s[i] == '{': (content, index after it)."""
    if s[i] != "{":
        raise ValueError(f"expected a brace at {i} in {s!r}")
    depth = 0
    for k in range(i, len(s)):
        if s[k] == "{":
            depth += 1
        elif s[k] == "}":
            depth -= 1
            if depth == 0:
                return s[i + 1 : k], k + 1
    raise ValueError(f"unbalanced braces in {s!r}")


def to_python(tex):
    s = tex.replace(r"\left", "").replace(r"\right", "").replace(r"\cdot", "*").replace(r"\pi", "pi")
    # a decimal with the comma, 1{,}7, is the fraction 17/10
    s = re.sub(r"(\d+)\{,\}(\d+)", lambda m: f"(({int(m.group(1) + m.group(2))})/(1{'0' * len(m.group(2))}))", s)
    while r"\sqrt" in s:
        i = s.index(r"\sqrt")
        inner, k = group(s, i + 5)
        s = f"{s[:i]}sqrt({inner}){s[k:]}"
    while r"\frac" in s:
        i = s.index(r"\frac")
        num, j = group(s, i + 5)
        den, k = group(s, j)
        s = f"{s[:i]}(({num})/({den})){s[k:]}"
    while "^" in s:
        i = s.index("^")
        j = i + 1
        while s[j] == " ":
            j += 1
        if s[j] == "{":
            inner, k = group(s, j)
        else:
            inner, k = s[j], j + 1
        s = f"{s[:i]}**({inner}){s[k:]}"
    s = re.sub(r"(\d|\))\s*(x|\()", r"\1*\2", s)
    s = re.sub(r"x\s*\(", "x*(", s)
    if not re.fullmatch(r"(?:[0-9x+\-*/() ]|sqrt|pi)+", s):
        raise ValueError(f"unreadable expression {tex!r} -> {s!r}")
    return s


def to_expr(tex):
    """The expression written in LaTeX, with exact rationals."""
    return sympify(to_python(tex), locals={"x": x}, rational=True)


def rat(s):
    if not isinstance(s, str) or not re.fullmatch(r"-?\d+(/\d+)?", s):
        raise ValueError(f"not an exact rational: {s!r}")
    return Rational(s)


def rat_tex(r):
    r = Rational(r)
    if r.q == 1:
        return str(r.p)
    return f"{'-' if r.p < 0 else ''}\\frac{{{abs(r.p)}}}{{{r.q}}}"


def number_fn(expr):
    """A function of a float that gives the value of the expression, +-inf where it overflows."""
    f = lambdify(x, expr, "math")

    def g(v):
        try:
            return float(f(v))
        except OverflowError:
            return math.inf
        except ZeroDivisionError:
            return math.nan

    return g


# A grid that no rational with a small denominator falls on.
OFFSET = 0.0137


def grid(lo=-13.0, hi=13.0, step=1 / 32):
    n = int((hi - lo) / step)
    return [lo + OFFSET + i * step for i in range(n)]


def sign_changes(expr):
    f = number_fn(expr)
    vals = [f(v) for v in grid()]
    return sum(1 for u, w in zip(vals, vals[1:]) if (u > 0) != (w > 0))


def is_zero(expr):
    return abs(complex(expr.evalf(40))) < 1e-25


# ---------------------------------------------------------------------------
# Sets of numbers: S = \{1, 2\}, S = \emptyset


def set_tex(values):
    vals = sorted(rat(v) for v in values)
    if not vals:
        return r"S = \emptyset"
    return "S = \\{" + ", ".join(rat_tex(v) for v in vals) + "\\}"


# ---------------------------------------------------------------------------
# Unions of intervals: values such as "(-oo,2)", "[1,oo)", "[3,3]"


def parse_iv(v):
    m = re.fullmatch(r"([\[(])(-oo|-?\d+(?:/\d+)?),(oo|-?\d+(?:/\d+)?)([\])])", v)
    if not m:
        raise ValueError(f"unreadable interval {v!r}")
    lo = None if m.group(2) == "-oo" else Rational(m.group(2))
    hi = None if m.group(3) == "oo" else Rational(m.group(3))
    return lo, hi, m.group(1) == "[", m.group(4) == "]"


def member(ivs, v):
    """Whether the number v is in the union of the intervals."""
    for lo, hi, lc, hc in ivs:
        if lo is not None and (v < lo or (v == lo and not lc)):
            continue
        if hi is not None and (v > hi or (v == hi and not hc)):
            continue
        return True
    return False


def _is_point(iv):
    return iv[0] is not None and iv[0] == iv[1]


def _frac(r):
    return r is not None and r.q != 1


def _interval_tex(iv):
    lo, hi, lc, hc = iv
    a = r"-\infty" if lo is None else rat_tex(lo)
    b = r"+\infty" if hi is None else rat_tex(hi)
    if _frac(lo) or _frac(hi):
        return f"\\left{'[' if lc else ']'}{a}, {b}\\right{']' if hc else '['}"
    return f"{'[' if lc else chr(92) + 'mathopen{]}'}{a}, {b}{']' if hc else chr(92) + 'mathclose{[}'}"


def _piece_tex(iv):
    lo, hi, lc, hc = iv
    le = lambda c: r"\leq" if c else "<"  # noqa: E731
    if _is_point(iv):
        return f"x = {rat_tex(lo)}"
    if lo is None:
        return f"x {le(hc)} {rat_tex(hi)}"
    if hi is None:
        return f"x {chr(92) + 'geq' if lc else '>'} {rat_tex(lo)}"
    return f"{rat_tex(lo)} {le(lc)} x {le(hc)} {rat_tex(hi)}"


def is_all(ivs):
    return len(ivs) == 1 and ivs[0][0] is None and ivs[0][1] is None


def intervals_tex(values, notation):
    """The LaTeX of a union of intervals as the specification of disequazioni-esponenziali writes it."""
    ivs = [parse_iv(v) for v in values]
    special = not ivs or is_all(ivs) or all(_is_point(iv) for iv in ivs)
    if notation == "disequazioni" and not special:
        return OPPURE.join(_piece_tex(iv) for iv in ivs)
    if not ivs:
        return r"S = \emptyset"
    if is_all(ivs):
        return r"S = \mathbb{R}"
    if all(_is_point(iv) for iv in ivs):
        return "S = \\{" + ", ".join(rat_tex(iv[0]) for iv in ivs) + "\\}"
    wide = len(ivs) == 2 and any(_frac(iv[0]) or _frac(iv[1]) for iv in ivs)
    parts = []
    for i, iv in enumerate(ivs):
        t = _interval_tex(iv)
        s = r"\," + t if t.startswith(r"\mathopen") else t
        if i < len(ivs) - 1 and t.endswith(r"\mathclose{[}") and not wide:
            s += r"\,"
        parts.append(s)
    if wide:
        return f"\\begin{{gathered}} S = {parts[0]} \\\\ \\cup {parts[1]} \\end{{gathered}}"
    return "S = " + r" \cup ".join(parts)


def check_choice(choice, truth_key, errs, n=4):
    """A multiple choice: n distinct options, the right one where `correct` says."""
    if not choice or choice.get("kind") != "choice":
        errs.append("no multiple choice")
        return []
    opts = choice.get("options", [])
    keys = ["|".join(o.get("values", [])) for o in opts]
    if len(opts) != n:
        errs.append(f"{len(opts)} options, expected {n}")
    if len(set(keys)) != len(keys):
        errs.append("options not distinct")
    c = choice.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(keys) or keys[c] != truth_key:
        errs.append("choice.correct is wrong")
    if sum(1 for k in keys if k == truth_key) != 1:
        errs.append("not exactly one correct option")
    if len({o.get("latex") for o in opts}) != len(opts):
        errs.append("two options read the same")
    return opts
