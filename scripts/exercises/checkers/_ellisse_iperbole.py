"""Common helpers of the checkers of lessons 118-120 (ellisse, iperbole, iperbole_equilatera).

Everything is read back from the LaTeX of the problem and of the options, as the specs write them, and turned
into exact SymPy numbers: the checkers then recompute the answers on their own.
"""
import re

from sympy import Rational, Symbol, factorint, sqrt

from verify import FORBIDDEN

X = Symbol("x", real=True)
Y = Symbol("y", real=True)


def forbidden(tex):
    return [f"forbidden '{name}' in {tex!r}" for name, rx in FORBIDDEN if rx.search(tex)]


def num(t):
    """An exact rational as written: -3, \\frac{3}{2}, -\\frac{5}{4}. A fraction must be in lowest terms."""
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        p, q = int(m.group(2)), int(m.group(3))
        r = Rational(p, q)
        if r.q != q or q == 1:
            raise ValueError(f"fraction not in lowest terms: {t!r}")
        return -r if m.group(1) else r
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable number {t!r}")


def tex_num(r):
    r = Rational(r)
    if r.is_integer:
        return str(r)
    return ("-" if r < 0 else "") + rf"\frac{{{abs(r.p)}}}{{{r.q}}}"


def root_squared(t):
    """The square of a positive root in simplest form: "4" -> 16, "\\sqrt{5}" -> 5, "2\\sqrt{3}" -> 12."""
    t = t.strip()
    if re.fullmatch(r"\d+", t):
        return int(t) ** 2
    m = re.fullmatch(r"(\d*)\\sqrt\{(\d+)\}", t)
    if not m:
        raise ValueError(f"unreadable root {t!r}")
    k = int(m.group(1)) if m.group(1) else 1
    r = int(m.group(2))
    if m.group(1) == "1" or r < 2 or any(e > 1 for e in factorint(r).values()):
        raise ValueError(f"root not in simplest form: {t!r}")
    return k * k * r


def on_axis(t, letter=""):
    """ "F(\\pm 4, 0)" -> ("x", 16); "(0, \\pm 2\\sqrt{3})" -> ("y", 12)."""
    t = t.strip()
    m = re.fullmatch(re.escape(letter) + r"\(\\pm (.+), 0\)", t)
    if m:
        return ("x", root_squared(m.group(1)))
    m = re.fullmatch(re.escape(letter) + r"\(0, \\pm (.+)\)", t)
    if m:
        return ("y", root_squared(m.group(1)))
    raise ValueError(f"unreadable pair of points {t!r}")


def _term(t, v):
    t = t.strip()
    if t == f"{v}^2":
        return 1
    m = re.fullmatch(r"\\frac\{" + v + r"\^2\}\{(\d+)\}", t)
    if not m or int(m.group(1)) == 1:
        raise ValueError(f"unreadable term {t!r}")
    return int(m.group(1))


def conic_tex(t):
    """ "\\frac{x^2}{A} + \\frac{y^2}{B} = 1" -> (A, B, sign between the terms, second member)."""
    m = re.fullmatch(r"(.+?) ([+-]) (.+?) = (-?1)", t.strip())
    if not m:
        raise ValueError(f"not a canonical equation: {t!r}")
    return _term(m.group(1), "x"), _term(m.group(3), "y"), (1 if m.group(2) == "+" else -1), int(m.group(4))


def quad_tex(t):
    """ "4x^2 + 9y^2 = 36", "x^2 - 4y^2 = -4" -> (p, q, r) with q signed."""
    m = re.fullmatch(r"(\d*)x\^2 ([+-]) (\d*)y\^2 = (-?\d+)", t.strip())
    if not m or m.group(1) == "1" or m.group(3) == "1":
        raise ValueError(f"unreadable equation {t!r}")
    p = int(m.group(1) or 1)
    q = int(m.group(3) or 1) * (1 if m.group(2) == "+" else -1)
    return p, q, int(m.group(4))


def linear_tex(t, v="x"):
    """m*v + q from "-2x + 6", "\\frac{4}{3}x - 2", "x", "5": (m, q), exact."""
    t = t.strip()
    m = re.fullmatch(r"(-?)((?:\d+|\\frac\{\d+\}\{\d+\})?)" + v + r"(?: ([+-]) (\d+|\\frac\{\d+\}\{\d+\}))?", t)
    if m:
        if m.group(2) == "1":
            raise ValueError(f"coefficient 1 written: {t!r}")
        slope = (num(m.group(2)) if m.group(2) else Rational(1)) * (-1 if m.group(1) else 1)
        k = Rational(0) if m.group(3) is None else num(m.group(4)) * (1 if m.group(3) == "+" else -1)
        if m.group(3) is not None and k == 0:
            raise ValueError(f"zero term written: {t!r}")
        return slope, k
    return Rational(0), num(t)


def line_tex(t):
    m = re.fullmatch(r"y = (.+)", t.strip())
    if not m:
        raise ValueError(f"not y = ...: {t!r}")
    return linear_tex(m.group(1))


def implicit_tex(t):
    """ "px + qy = r" with integer coefficients, 1 left out -> (p, q, r)."""
    m = re.fullmatch(r"(-?)(\d*)x ([+-]) (\d*)y = (-?\d+)", t.strip())
    if not m or m.group(2) == "1" or m.group(4) == "1":
        raise ValueError(f"unreadable line {t!r}")
    p = int(m.group(2) or 1) * (-1 if m.group(1) else 1)
    q = int(m.group(4) or 1) * (1 if m.group(3) == "+" else -1)
    return p, q, int(m.group(5))


def point_tex(t, letter=""):
    t = t.strip()
    m = re.fullmatch(re.escape(letter) + r"\((-?\d+), (-?\d+)\)", t)
    if m:
        return Rational(int(m.group(1))), Rational(int(m.group(2)))
    m = re.fullmatch(re.escape(letter) + r"\\left\((.+), (.+)\\right\)", t)
    if not m:
        raise ValueError(f"unreadable point {t!r}")
    x, y = num(m.group(1)), num(m.group(2))
    if x.is_integer and y.is_integer:
        raise ValueError(f"\\left( around integer coordinates: {t!r}")
    return x, y


def is_square(n):
    return n >= 0 and int(sqrt(n)) ** 2 == n if Rational(n).is_integer else False


def check_options(ch, read, truth, errs, n=4):
    """read(option) -> (key from the LaTeX, key from values); exactly one option equals truth, at `correct`."""
    opts = ch.get("options", [])
    if len(opts) != n:
        errs.append(f"{len(opts)} options, expected {n}")
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


def read_axis(letter):
    def read(o):
        return on_axis(o["latex"], letter), (o["values"][0], int(o["values"][1]))

    return read


def read_number(o):
    return num(o["latex"]), Rational(o["values"][0])


def common(sample):
    """Checks every sample shares: forbidden patterns, steps, words, the choice of a number answer."""
    errs = forbidden(sample["problem"])
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("steps or solution missing")
    text = " ".join([sample["problem"], sample["solution"], *sample["steps"]])
    if "—" in text or "piuttosto che" in text:
        errs.append("forbidden words")
    ans = sample["answer"]
    ch = sample.get("choice")
    if ans.get("kind") == "choice":
        if ch is not None and ch != ans:
            errs.append("choice differs from the choice answer")
        ch = ans
    elif ch is None:
        errs.append("no choice")
    return errs, ch


def same_params(params, errs, **found):
    """What was read from the problem must be what the sample declares in params."""
    for key, value in found.items():
        declared = params.get(key)
        if isinstance(value, str):
            ok = declared == value
        else:
            try:
                ok = Rational(str(declared)) == value
            except (TypeError, ValueError):
                ok = False
        if not ok:
            errs.append(f"params.{key} = {declared!r}, the problem says {value}")
