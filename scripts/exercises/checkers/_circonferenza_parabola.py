"""Shared by the checkers of lessons 114-117 (circonferenza-equazione, circonferenza-rette, parabola-equazione,
parabola-rette): reading back the LaTeX the student sees, and the checks that do not depend on the level.

Nothing here knows how the generators build an exercise. A problem is a row of givens separated by \\quad: a
point `P(3, -1)`, a labelled equation `r\\colon 3x + 4y - 1 = 0`, a bare equation, a value `r = 4` or
`x_0 = -2`. An option is a text, a number or a radical, a point, an equation, a set of numbers, or several of
these separated by `,\\ `. `key` turns an option into something two writings of the same answer share, so the
checker can say which options equal the truth it has computed on its own.
"""
import re
from math import gcd

from sympy import Poly, Rational, Symbol, expand, factorint, sqrt, sympify

from verify import canon, exact

X, Y, M, Q = Symbol("x"), Symbol("y"), Symbol("m"), Symbol("q")

FORBIDDEN = [
    ("1x", re.compile(r"(?<![\d}_])1\s*[xy]")),
    ("0x", re.compile(r"(?<![\d}_])0\s*[xy]")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
    ("zero term", re.compile(r"[+-]\s*0(?!\d)")),
]


class TexError(Exception):
    pass


def number(tex):
    """-3, \\frac{1}{2}, -\\frac{5}{4}: an integer or a reduced fraction."""
    m = re.fullmatch(r"\s*(-?)\s*(?:(\d+)|\\frac\{(\d+)\}\{(\d+)\})\s*", tex)
    if not m:
        raise TexError(f"not a number: {tex!r}")
    if m.group(2):
        v = Rational(int(m.group(2)))
    else:
        n, d = int(m.group(3)), int(m.group(4))
        if d < 2 or gcd(n, d) != 1:
            raise TexError(f"fraction not reduced: {tex!r}")
        v = Rational(n, d)
    return -v if m.group(1) else v


def value(tex):
    """A number or a simplified radical: 3, 2\\sqrt{5}, \\frac{5\\sqrt{2}}{2}. The radicand is square-free."""
    s = tex.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d*)\\sqrt\{(\d+)\}\}\{(\d+)\}", s) or re.fullmatch(r"(-?)(\d*)\\sqrt\{(\d+)\}()", s)
    if not m:
        return number(s)
    k, r, d = int(m.group(2) or 1), int(m.group(3)), int(m.group(4) or 1)
    if m.group(2) == "1" or r < 2 or any(e > 1 for e in factorint(r).values()):
        raise TexError(f"radical not simplified: {tex!r}")
    if m.group(4) and (d < 2 or gcd(k, d) != 1):
        raise TexError(f"fraction not reduced: {tex!r}")
    return (-1 if m.group(1) else 1) * k * sqrt(r) / d


def expr(tex):
    """One side of an equation, a polynomial in x and y (and m, q): 3x - 4y + 8, \\frac{1}{4}x^2 - x, (x - 2)^2."""
    s = tex.strip().replace("\\left", "").replace("\\right", "")
    s = re.sub(r"\\frac\{(\d+)\}\{(\d+)\}", r"(\1/\2)", s)
    if not re.fullmatch(r"[0-9xymq+\-/()^ ]+", s):
        raise TexError(f"unexpected characters in {tex!r}")
    s = s.replace("^2", "**2")
    if "^" in s:
        raise TexError(f"power other than 2 in {tex!r}")
    s = re.sub(r"(?<=[0-9)])\s*(?=[a-z(])", "*", s)
    s = re.sub(r"(?<=[a-z])(?=[a-z])", "*", s)
    try:
        return expand(sympify(s, locals={"x": X, "y": Y, "m": M, "q": Q}, rational=True))
    except Exception as e:  # noqa: BLE001
        raise TexError(f"unreadable {tex!r}: {e}") from e


def equation(tex):
    """'3x - 4y + 8 = 0' -> the expression lhs - rhs."""
    if tex.count("=") != 1:
        raise TexError(f"not an equation: {tex!r}")
    lhs, rhs = tex.split("=")
    return expand(expr(lhs) - expr(rhs))


POINT = re.compile(r"([A-Z]'?)?(?:\((.+), (.+)\)|\\left\((.+), (.+)\\right\))")


def point(tex):
    """'P(3, -1)', '(2, 5)', 'F\\left(0, \\frac{1}{4}\\right)' -> (name, x, y)."""
    m = POINT.fullmatch(tex.strip())
    if not m:
        raise TexError(f"not a point: {tex!r}")
    a, b = (m.group(2), m.group(3)) if m.group(2) is not None else (m.group(4), m.group(5))
    x, y = number(a), number(b)
    if (m.group(2) is None) == (x.is_integer and y.is_integer):
        raise TexError(f"\\left( \\right) only with fractions: {tex!r}")
    return m.group(1) or "", x, y


class Problem:
    def __init__(self, tex):
        self.points, self.labelled, self.bare, self.given = {}, {}, [], {}
        for item in re.split(r"\s*\\quad\s*", tex.strip()):
            m = re.fullmatch(r"([a-z])\\colon (.+)", item)
            if m:
                self.labelled[m.group(1)] = m.group(2)
                continue
            m = re.fullmatch(r"(r|x_0) = (.+)", item)
            if m:
                self.given[m.group(1)] = number(m.group(2))
                continue
            if POINT.fullmatch(item) and "=" not in item:
                name, x, y = point(item)
                self.points[name] = (x, y)
                continue
            if "=" in item:
                self.bare.append(item)
                continue
            raise TexError(f"unreadable item {item!r}")


def curve(e):
    """An equation up to a non-zero factor: the polynomial divided by its leading coefficient."""
    p = Poly(e, X, Y)
    if p.is_zero:
        raise TexError("0 = 0")
    return expand(e / p.LC())


def quadratic(e, var, other):
    """e = 0 solved for `other` as a quadratic in `var`: other = a·var² + b·var + c -> (a, b, c)."""
    k = e.coeff(other, 1)
    if k == 0 or e.coeff(other, 2) != 0 or k.free_symbols:
        raise TexError(f"not solvable for {other}: {e}")
    f = expand(-(e - k * other) / k)
    p = Poly(f, var)
    if p.degree() != 2 or f.free_symbols - {var}:
        raise TexError(f"not a quadratic in {var}: {f}")
    return p.all_coeffs()


def circle(e):
    """x² + y² + ax + by + c = 0 (up to a factor) -> (α, β, α² + β² − c)."""
    p = Poly(e, X, Y)
    k = p.coeff_monomial(X**2)
    if k == 0 or p.coeff_monomial(Y**2) != k or p.coeff_monomial(X * Y) != 0 or p.total_degree() != 2:
        raise TexError(f"not a circle: {e}")
    a, b, c = p.coeff_monomial(X) / k, p.coeff_monomial(Y) / k, p.coeff_monomial(1) / k
    return -a / 2, -b / 2, a**2 / 4 + b**2 / 4 - c


def line(e):
    """ax + by + c = 0 -> (a, b, c)."""
    p = Poly(e, X, Y)
    if p.total_degree() != 1:
        raise TexError(f"not a line: {e}")
    return p.coeff_monomial(X), p.coeff_monomial(Y), p.coeff_monomial(1)


def text(words, sub=None):
    return ("text", words) if sub is None else ("text", words, sub)


def val(v):
    return ("val", canon(sympify(v)))


def pt(x, y):
    return ("pt", Rational(x), Rational(y))


def eq(e):
    return ("eq", curve(e))


def numbers(vs):
    return ("set", frozenset(Rational(v) for v in vs))


def key(tex):
    """What an option says, however it is written."""
    s = tex.strip()
    m = re.fullmatch(r"\\text\{([^{}]*)\}\s*(.*)", s)
    if m:
        words, rest = m.group(1).strip().rstrip(",").strip(), m.group(2).strip()
        return text(words, key(rest)) if rest else text(words)
    m = re.fullmatch(r"\\left\\\{ (.+) \\right\\\}", s)
    if m:
        vs = [number(v) for v in m.group(1).split(",\\ ")]
        if vs != sorted(vs) or len(set(vs)) != len(vs):
            raise TexError(f"set not sorted: {tex!r}")
        return numbers(vs)
    if ",\\ " in s:
        parts = [key(p) for p in s.split(",\\ ")]
        return frozenset(parts) if all(p[0] == "pt" for p in parts) else tuple(parts)
    if POINT.fullmatch(s) and "=" not in s:
        _, x, y = point(s)
        return pt(x, y)
    m = re.fullmatch(r"r = (.+)", s)
    if m:
        return val(value(m.group(1)))
    if "=" in s:
        return eq(equation(s))
    return val(value(s))


def explicit_line(tex):
    """'y = 2x - 3' -> (m, q); the form the answer of a tangent must have."""
    m = re.fullmatch(r"y = (.+)", tex.strip())
    if not m:
        raise TexError(f"not in the form y = mx + q: {tex!r}")
    f = expr(m.group(1))
    if f.free_symbols - {X} or Poly(f, X).degree() > 1:
        raise TexError(f"not a line: {tex!r}")
    return f.coeff(X, 1), f.coeff(X, 0)


def frame(sample, truth, n=4):
    """The checks every level shares: forbidden writings, steps, and the choice, whose options are read back
    from their LaTeX: `n` of them, all different, exactly one equal to `truth`, and that one marked."""
    errs = []
    for name, rx in FORBIDDEN:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden '{name}': {sample['problem']}")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    for st in [sample.get("solution", "")] + sample.get("steps", []):
        if re.search(r"\\begin\{(aligned|gathered|array)\}", st) and "\\text" in st:
            errs.append("environment with \\text in a step")
    ch = sample.get("choice")
    ans = sample.get("answer", {})
    if ch is None:
        return errs + ["no choice variant"]
    if ans.get("kind") == "choice" and ans != ch:
        errs.append("answer is a choice but differs from the choice variant")
    opts = ch.get("options", [])
    if len(opts) != n:
        errs.append(f"{len(opts)} options, expected {n}")
    keys = []
    for o in opts:
        for name, rx in FORBIDDEN:
            if rx.search(o["latex"]):
                errs.append(f"option contains forbidden '{name}': {o['latex']}")
        try:
            keys.append(key(o["latex"]))
        except TexError as e:
            errs.append(f"option unreadable: {e}")
            keys.append(None)
    if len(set(keys)) != len(keys):
        errs.append("options not distinct")
    values = [tuple(o["values"]) for o in opts]
    if len(set(values)) != len(values):
        errs.append("options with the same values")
    for o, k in zip(opts, keys):
        if isinstance(k, tuple) and k[0] == "val" and (len(o["values"]) != 1 or canon(exact(o["values"][0])) != k[1]):
            errs.append(f"option latex {o['latex']} != values {o['values']}")
        if isinstance(k, tuple) and k[0] == "pt" and [Rational(v) for v in o["values"]] != [k[1], k[2]]:
            errs.append(f"option latex {o['latex']} != values {o['values']}")
    right = [i for i, k in enumerate(keys) if k == truth]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} but the truth is option {right[0]}")
    return errs


def must_be_choice(sample):
    return [] if sample["answer"].get("kind") == "choice" else [f"answer.kind {sample['answer'].get('kind')}, expected choice"]


def number_answer(sample, truth):
    """A rational answer: kind number, the exact value."""
    ans = sample["answer"]
    if ans.get("kind") != "number":
        return [f"answer.kind {ans.get('kind')}, expected number"]
    if not re.fullmatch(r"-?\d+(/\d+)?", ans["value"]) or Rational(ans["value"]) != truth:
        return [f"answer {ans['value']} != {truth}"]
    return []


def length_answer(sample, truth):
    """A length: a number when rational, otherwise an expression in simplified form."""
    if truth.is_rational:
        return number_answer(sample, truth)
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "simplified":
        return ["irrational length must be an expression, form simplified"]
    errs = []
    if canon(exact(ans["value"])) != canon(truth):
        errs.append(f"answer {ans['value']} != {truth}")
    try:
        if canon(value(ans["latex"])) != canon(truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except TexError as e:
        errs.append(f"answer latex: {e}")
    return errs


def set_answer(sample, truth):
    ans = sample["answer"]
    if ans.get("kind") != "set":
        return [f"answer.kind {ans.get('kind')}, expected set"]
    vs = [Rational(v) for v in ans["values"]]
    errs = []
    if vs != sorted(vs):
        errs.append("answer values not sorted")
    if set(vs) != set(truth) or len(vs) != len(set(truth)):
        errs.append(f"answer {ans['values']} != {sorted(truth)}")
    try:
        if key(ans["latex"]) != numbers(truth):
            errs.append(f"answer latex {ans['latex']} != {sorted(truth)}")
    except TexError as e:
        errs.append(f"answer latex: {e}")
    return errs


def function_answer(sample, f, form, left="y"):
    """An answer y = f(x): the right-hand side as a SymPy expression in `value`, the whole equation in `latex`."""
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != form:
        return [f"answer must be an expression, form {form}"]
    errs = []
    try:
        if expand(sympify(ans["value"], locals={"x": X}, rational=True) - f) != 0:
            errs.append(f"answer {ans['value']} != {f}")
    except Exception as e:  # noqa: BLE001
        errs.append(f"answer value unreadable: {e}")
    try:
        m = re.fullmatch(rf"{left} = (.+)", ans["latex"])
        if not m or expand(expr(m.group(1)) - f) != 0:
            errs.append(f"answer latex {ans['latex']} != {left} = {f}")
    except TexError as e:
        errs.append(f"answer latex: {e}")
    return errs
