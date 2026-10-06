"""Common pieces of the checkers of lessons 124-127 (logaritmi-proprieta, funzioni-logaritmiche,
equazioni-logaritmiche, disequazioni-logaritmiche), written from the specifications in specs/exercises/.

A checker of these lessons says, for a sample, what the problem must read and, for every mistake the
specification names, what the option must show and be worth: the right answer is computed here with SymPy from
the data in `params`, and each mistake is made again here. `verify_sample` then compares all of it with the
sample: the text of the problem, the four options kept in `params.cands` (the right one first), the answer, the
multiple choice, and that no wrong option is worth the right answer.

Values are exact strings: a rational "3/2", a logarithm "log(7,3)-1" (argument, base), an interval "(2;4)",
"[-1;0)", "(-oo;log(7,3))", an expression in x and y for the options that are formulas.
"""
import re

from sympy import Rational, Symbol, log, oo, sympify

X = Symbol("x", positive=True)
Y = Symbol("y", positive=True)

# ---------------------------------------------------------------------------
# Numbers and their writing


def R(v):
    """An exact rational from an int or a string "p/q"."""
    if isinstance(v, bool) or not isinstance(v, (int, str)):
        raise ValueError(f"not an exact number: {v!r}")
    if isinstance(v, str) and not re.fullmatch(r"-?\d+(/\d+)?", v):
        raise ValueError(f"not an exact rational string: {v!r}")
    return Rational(v)


def rs(r):
    """The string of a rational: "3", "-1/2"."""
    r = Rational(r)
    return f"{r.p}" if r.q == 1 else f"{r.p}/{r.q}"


def rtex(r):
    r = Rational(r)
    if r.q == 1:
        return f"{r.p}"
    return f"{'-' if r < 0 else ''}\\frac{{{abs(r.p)}}}{{{r.q}}}"


def log_head(base):
    base = Rational(base)
    if base == 10:
        return r"\log"
    if base.q == 1 and base.p < 10:
        return rf"\log_{base.p}"
    return rf"\log_{{{rtex(base)}}}"


def log_tex(base, arg, paren=False):
    return f"{log_head(base)} {'(' + arg + ')' if paren else arg}"


def poly_tex(coeffs):
    """coeffs by increasing degree, written by decreasing powers: x^2 - 3x + 2."""
    out = ""
    for deg in range(len(coeffs) - 1, -1, -1):
        c = Rational(coeffs[deg])
        if c == 0:
            continue
        a = abs(c)
        mono = "" if deg == 0 else "x" if deg == 1 else f"x^{deg}"
        body = rtex(a) if deg == 0 else ("" if a == 1 else rtex(a)) + mono
        out = ("-" if c < 0 else "") + body if out == "" else out + (" - " if c < 0 else " + ") + body
    return out or "0"


def lin(m, n):
    """m x + n with the positive term first: 5 - x."""
    if m < 0 and n > 0:
        return f"{n} - {'' if m == -1 else -m}x"
    return poly_tex([n, m])


def pow_tex(base, n):
    base = Rational(base)
    b = f"{base.p}" if base.q == 1 else rf"\left({rtex(base)}\right)"
    return f"{b}^{n}" if 0 <= n < 10 else f"{b}^{{{n}}}"


def point_tex(px, py):
    px, py = Rational(px), Rational(py)
    if px.q != 1 or py.q != 1:
        return rf"\left({rtex(px)}, {rtex(py)}\right)"
    return f"({rtex(px)}, {rtex(py)})"


def text(s):
    return rf"\text{{{s}}}"


# ---------------------------------------------------------------------------
# Values

VAL = re.compile(r"(-?\d+(?:/\d+)?)|log\((\d+(?:/\d+)?),(\d+(?:/\d+)?)\)(?:([+-])(\d+(?:/\d+)?))?")


def val(s):
    """The SymPy value of "3/2" or "log(7,3)-1"."""
    m = VAL.fullmatch(s)
    if not m:
        raise ValueError(f"not a value: {s!r}")
    if m.group(1) is not None:
        return Rational(m.group(1))
    v = log(Rational(m.group(2))) / log(Rational(m.group(3)))
    if m.group(4):
        v += Rational(m.group(5)) * (1 if m.group(4) == "+" else -1)
    return v


def val_tex(s):
    m = VAL.fullmatch(s)
    if not m:
        raise ValueError(f"not a value: {s!r}")
    if m.group(1) is not None:
        return rtex(Rational(m.group(1)))
    head = log_tex(Rational(m.group(3)), rtex(Rational(m.group(2))))
    if m.group(4):
        return f"{head} {m.group(4)} {rtex(Rational(m.group(5)))}"
    return head


def log_str(base, arg, plus=0):
    """The string of log_base(arg) + plus."""
    plus = Rational(plus)
    head = f"log({rs(arg)},{rs(base)})"
    return head if plus == 0 else f"{head}{'+' if plus > 0 else '-'}{rs(abs(plus))}"


def expr(s):
    """An option that is a formula: logarithms, x and y, the four operations."""
    if not re.fullmatch(r"(?:log|[0-9xy+\-*/(), ])+", s):
        raise ValueError(f"not an expression: {s!r}")
    return sympify(s, locals={"x": X, "y": Y, "log": lambda a, b: log(a) / log(b)})


def number_of(s):
    """A float for any value string: a value, an expression (at x = 5.3, y = 1.7, where every option of these lessons is real)."""
    try:
        return float(val(s))
    except ValueError:
        return float(expr(s).subs({X: Rational(53, 10), Y: Rational(17, 10)}))


def set_cand(vals):
    """(latex, values) of a set of solutions given as value strings, sorted here."""
    vals = sorted(vals, key=lambda s: float(val(s)))
    if not vals:
        return (r"S = \emptyset", [])
    return (rf"S = \left\{{{', '.join(val_tex(v) for v in vals)}\right\}}", vals)


def num_cand(r):
    return (rtex(r), [rs(r)])


# ---------------------------------------------------------------------------
# Intervals: (lo, hi, lo closed, hi closed), ends as value strings or None

IV = re.compile(r"([\[(])([^;]+);([^;]+)([\])])")


def parse_iv(s):
    m = IV.fullmatch(s)
    if not m:
        raise ValueError(f"not an interval: {s!r}")
    lo = None if m.group(2) == "-oo" else m.group(2)
    hi = None if m.group(3) == "oo" else m.group(3)
    if (lo is None and m.group(1) == "[") or (hi is None and m.group(4) == "]"):
        raise ValueError(f"closed at infinity: {s!r}")
    return (lo, hi, m.group(1) == "[", m.group(4) == "]")


def iv_str(iv):
    lo, hi, lc, hc = iv
    return f"{'[' if lc else '('}{lo if lo is not None else '-oo'};{hi if hi is not None else 'oo'}{']' if hc else ')'}"


def _plain(s):
    return s is None or re.fullmatch(r"-?\d+", s) is not None


def iv_tex(iv):
    lo, hi, lc, hc = iv
    a = val_tex(lo) if lo is not None else r"-\infty"
    b = val_tex(hi) if hi is not None else r"+\infty"
    if not _plain(lo) or not _plain(hi):
        return rf"\left{'[' if lc else ']'}{a}, {b}\right{']' if hc else '['}"
    return f"{'[' if lc else chr(92) + 'mathopen{]}'}{a}, {b}{']' if hc else chr(92) + 'mathclose{[}'}"


def set_tex(ivs, name="S"):
    """The writing of a union of intervals, as the lessons write it."""
    if not ivs:
        return rf"{name} = \emptyset"
    if len(ivs) == 1 and ivs[0][0] is None and ivs[0][1] is None:
        return rf"{name} = \mathbb{{R}}"
    wide = len(ivs) == 2 and any(not _plain(iv[0]) or not _plain(iv[1]) for iv in ivs)
    parts = []
    for i, iv in enumerate(ivs):
        t = iv_tex(iv)
        s = r"\," + t if t.startswith(r"\mathopen") else t
        if i < len(ivs) - 1 and t.endswith(r"\mathclose{[}") and not wide:
            s += r"\,"
        parts.append(s)
    if wide:
        return rf"\begin{{gathered}} {name} = {parts[0]} \\ \cup {parts[1]} \end{{gathered}}"
    return f"{name} = " + r" \cup ".join(parts)


def iv_cand(ivs, name="S"):
    """(latex, values) of a union of intervals, sorted and with the empty ones dropped."""
    ivs = normal(ivs)
    return (set_tex(ivs, name), [iv_str(iv) for iv in ivs])


def _f(s, inf):
    return inf if s is None else float(val(s))


def normal(ivs):
    """Intervals sorted by their lower end, without the empty ones."""
    out = []
    for lo, hi, lc, hc in ivs:
        a, b = _f(lo, -float("inf")), _f(hi, float("inf"))
        if a > b + 1e-9 or (abs(a - b) < 1e-9 and not (lc and hc)):
            continue
        out.append((lo, hi, lc, hc))
    return sorted(out, key=lambda iv: _f(iv[0], -float("inf")))


def meet(A, B):
    """The common part of two unions of intervals."""
    out = []
    for a in A:
        for b in B:
            la, lb = _f(a[0], -float("inf")), _f(b[0], -float("inf"))
            ua, ub = _f(a[1], float("inf")), _f(b[1], float("inf"))
            if abs(la - lb) < 1e-9:
                lo, lc = a[0], a[2] and b[2]
            elif la > lb:
                lo, lc = a[0], a[2]
            else:
                lo, lc = b[0], b[2]
            if abs(ua - ub) < 1e-9:
                hi, hc = a[1], a[3] and b[3]
            elif ua < ub:
                hi, hc = a[1], a[3]
            else:
                hi, hc = b[1], b[3]
            out.append((lo, hi, lc, hc))
    return normal(out)


ALL = [(None, None, False, False)]


def above(v, closed=False):
    return [(v, None, closed, False)]


def below(v, closed=False):
    return [(None, v, False, closed)]


def between(a, b, ca=False, cb=False):
    return [(a, b, ca, cb)]


def outside(a, b, closed=False):
    return below(a, closed) + above(b, closed)


LARGE = {"<=", ">="}
FLIP = {"<": ">", ">": "<", "<=": ">=", ">=": "<="}
TOGGLE = {"<": "<=", ">": ">=", "<=": "<", ">=": ">"}
OP_TEX = {"<": "<", ">": ">", "<=": r"\leq", ">=": r"\geq"}


def ray(op, v):
    """x op v."""
    return above(v, op in LARGE) if op in (">", ">=") else below(v, op in LARGE)


def member(ivs, t):
    """Whether the float t is in the union of intervals."""
    for lo, hi, lc, hc in ivs:
        a, b = _f(lo, -float("inf")), _f(hi, float("inf"))
        if (a < t - 1e-12 or (lc and abs(a - t) < 1e-12)) and (t < b - 1e-12 or (hc and abs(b - t) < 1e-12)):
            return True
    return False


def probe(ivs, holds, extra=()):
    """Errors if the union `ivs` is not where `holds(t)` is true: tried between the ends, beside them and far away.
    `holds` gets a float and says whether the inequality of the problem is true there (False where it has no meaning).
    The ends themselves are tried by the checkers that know them exactly."""
    ends = sorted({float(val(e)) for iv in ivs for e in iv[:2] if e is not None} | set(extra))
    pts = []
    if not ends:
        pts = [-50.0, -1.0, 0.0, 0.5, 1.0, 3.0, 50.0]
    else:
        pts += [ends[0] - 40, ends[0] - 1, ends[0] - 1e-4, ends[-1] + 1e-4, ends[-1] + 1, ends[-1] + 40]
        for a, b in zip(ends, ends[1:]):
            pts += [a + 1e-4, (a + b) / 2, b - 1e-4]
    errs = []
    for t in pts:
        if any(abs(t - e) < 1e-6 for e in ends):
            continue
        if member(ivs, t) != bool(holds(t)):
            errs.append(f"at x = {t:.5g} the answer says {member(ivs, t)}, the problem {bool(holds(t))}")
    return errs[:3]


def key_of(values):
    """A numeric key of the values of an option, for comparing options by what they are worth."""
    out = []
    for v in values:
        if IV.fullmatch(v) and ";" in v:
            lo, hi, lc, hc = parse_iv(v)
            out.append((round(_f(lo, -1e300), 9), round(_f(hi, 1e300), 9), lc, hc))
        else:
            try:
                out.append(round(number_of(v), 9))
            except ValueError:
                out.append(v)  # a label: "positivo", "non esiste"
    return tuple(out)


# ---------------------------------------------------------------------------
# The sample against what the checker expects

FORBIDDEN = [r"(?<![\d}])1\s*x", r"(?<![\d}])0\s*x", r"\+\s*-", r"-\s*-", r"\+\s*\+", r"\^\{1\}|\^1(?!\d)", r"[+-]\s*0(?![\d{])", r"\\frac\{-"]


def verify_sample(sample, problem, expected, kind, solution=None, prompt=None):
    """`expected`: tag -> (latex, values) for the right answer ("giusta") and for every mistake of the form.
    `kind`: "number", "set" or "choice", the type of the answer. Returns the errors."""
    errs = []
    p = sample.get("params", {})
    if sample.get("problem") != problem:
        errs.append(f"problem {sample.get('problem')!r}, expected {problem!r}")
    if prompt is not None and sample.get("prompt") != prompt:
        errs.append(f"prompt {sample.get('prompt')!r}, expected {prompt!r}")
    for rx in FORBIDDEN:
        if re.search(rx, sample.get("problem", "")):
            errs.append(f"problem with forbidden pattern {rx}")
    if not sample.get("steps") or not all(isinstance(s, str) and s for s in sample["steps"]):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    if solution is not None and sample.get("solution") != solution:
        errs.append(f"solution {sample.get('solution')!r}, expected {solution!r}")

    cands = p.get("cands")
    if not isinstance(cands, list) or len(cands) != 4:
        return errs + ["params.cands must hold four options"]
    if [c.get("tag") for c in cands].count("giusta") != 1 or cands[0].get("tag") != "giusta":
        errs.append("the first option of params.cands must be the only right one")
    for c in cands:
        want = expected.get(c.get("tag"))
        if want is None:
            errs.append(f"option with unknown mistake {c.get('tag')!r}")
            continue
        if c.get("latex") != want[0]:
            errs.append(f"option {c.get('tag')}: latex {c.get('latex')!r}, expected {want[0]!r}")
        if c.get("values") != want[1]:
            errs.append(f"option {c.get('tag')}: values {c.get('values')!r}, expected {want[1]!r}")
    if errs:
        return errs
    try:
        keys = [key_of(c["values"]) for c in cands]
    except Exception as e:  # noqa: BLE001 - an unreadable value is an error of the option
        return errs + [f"unreadable option value: {e}"]
    if len(set(keys)) != 4:
        errs.append("two options are worth the same")
    if len({c["latex"] for c in cands}) != 4:
        errs.append("two options read the same")
    right = cands[0]

    ans = sample.get("answer", {})
    if ans.get("kind") != kind:
        errs.append(f"answer.kind {ans.get('kind')}, expected {kind}")
    elif kind == "number":
        if [ans.get("value")] != right["values"]:
            errs.append(f"answer {ans.get('value')!r} is not the right option {right['values']}")
    elif kind == "set":
        if ans.get("values") != right["values"] or ans.get("latex") != right["latex"]:
            errs.append(f"answer {ans.get('values')!r} is not the right option {right['values']}")
        if ans.get("universal"):
            errs.append("answer marked universal")
    choices = [c for c in ([ans] if kind == "choice" else []) + [sample.get("choice")] if c]
    if kind != "choice" and not sample.get("choice"):
        errs.append("no multiple choice")
    for ch in choices:
        opts = ch.get("options", [])
        if len(opts) != 4:
            errs.append("the choice must have four options")
            continue
        seen = sorted((o.get("latex"), tuple(o.get("values", []))) for o in opts)
        if seen != sorted((c["latex"], tuple(c["values"])) for c in cands):
            errs.append("the options of the choice are not those of params.cands")
        i = ch.get("correct")
        if not isinstance(i, int) or not 0 <= i < 4 or opts[i].get("latex") != right["latex"] or opts[i].get("values") != right["values"]:
            errs.append("choice.correct does not point to the right option")
    return errs
