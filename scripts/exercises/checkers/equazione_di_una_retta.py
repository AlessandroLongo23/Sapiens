"""Checker for equazione-di-una-retta, written from specs/exercises/equazione-di-una-retta.md.

It reads the line (and the point, the given coordinate, the parameter k) from the LaTeX of the problem, recomputes
the answer with SymPy (Line, Point, solve), reads every option back from its LaTeX and compares it with its values,
checks that exactly one option is right, that the wrong ones are really wrong (a line written with other
coefficients but proportional to the answer counts as right, so it cannot be a distractor), the required form of
the answer (explicit form with reduced fractions, implicit form with integer coefficients, no common divisor and
a > 0) and the share of each case per level.
"""
import re

from sympy import Line, Point, Poly, Rational, gcd, solve, symbols, sympify

from verify import FORBIDDEN

X, Y, K = symbols("x y k")

CASE_RANGES = {
    1: {"tipo": (0.32, 0.48), "punto": (0.52, 0.68)},
    3: {"esplicita": (0.57, 0.73), "frazioni": (0.27, 0.43)},
    4: {"appartenenza": (0.42, 0.58), "coordinata": (0.42, 0.58)},
    5: {"interi": (0.32, 0.48), "frazionari": (0.52, 0.68)},
    6: {"verticale": (0.27, 0.40), "orizzontale": (0.27, 0.40), "origine": (0.27, 0.40)},
    7: {"esiste": (0.68, 0.82), "nessuno": (0.18, 0.32)},
}

FORBIDDEN_ALL = FORBIDDEN + [
    ("1y", re.compile(r"(?<![\d{])1\s*y")),
    ("0y", re.compile(r"(?<!\d)0\s*y")),
    ("1k", re.compile(r"(?<![\d{])1\s*k")),
    ("\\frac{0}", re.compile(r"\\d?frac\{0\}")),
    ("\\frac{..}{1}", re.compile(r"\\d?frac\{[^{}]*\}\{1\}")),
]


# ---------------------------------------------------------------------------
# Reading LaTeX

def tex_to_sympy(t):
    """A side of an equation as the generator writes it (3x - 2y + 4, \\frac{3}{2}x, \\frac{x}{2}, (k - 1)x) to SymPy."""
    s = t.strip()
    frac = re.compile(r"\\d?frac\{([^{}]*)\}\{([^{}]*)\}")
    while frac.search(s):
        s = frac.sub(r"((\1)/(\2))", s)
    s = s.replace(r"\cdot", "*").replace(r"\left(", "(").replace(r"\right)", ")")
    if "\\" in s or "{" in s:
        raise ValueError(f"unreadable: {t!r}")
    s = re.sub(r"(\d)\s*([xyk(])", r"\1*\2", s)
    s = re.sub(r"\)\s*([xyk(\d])", r")*\1", s)
    s = re.sub(r"([xyk])\s*([xyk(])", r"\1*\2", s)
    if not re.fullmatch(r"[0-9xyk+\-*/() ]+", s):
        raise ValueError(f"unexpected characters: {t!r}")
    return sympify(s, locals={"x": X, "y": Y, "k": K})


def equation(tex):
    parts = tex.split(" = ")
    if len(parts) != 2:
        raise ValueError(f"not an equation: {tex!r}")
    return tex_to_sympy(parts[0]) - tex_to_sympy(parts[1])


def value(t):
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        if gcd(int(m.group(2)), int(m.group(3))) != 1 or int(m.group(3)) < 2:
            raise ValueError(f"fraction not reduced: {t!r}")
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable value {t!r}")


def point(t):
    """(2, -1) or \\left(-\\frac{1}{2}, 3\\right), with the parentheses matching the content."""
    m = re.fullmatch(r"\\left\((.*), (.*)\\right\)", t) or re.fullmatch(r"\((.*), (.*)\)", t)
    if not m:
        raise ValueError(f"unreadable point {t!r}")
    x0, y0 = value(m.group(1)), value(m.group(2))
    frac = not (x0.is_integer and y0.is_integer)
    if frac != t.startswith("\\left("):
        raise ValueError(f"parentheses of {t!r}")
    return x0, y0


def abc(expr):
    """(a, b, c) of a x + b y + c, or None if not linear in x, y."""
    e = sympify(expr).expand()
    if not e.is_polynomial(X, Y):
        return None
    P = Poly(e, X, Y)
    if P.total_degree() > 1:
        return None
    return (P.coeff_monomial(X), P.coeff_monomial(Y), P.coeff_monomial(1))


def line_of(a, b, c):
    """A SymPy Line through two of its points."""
    if b != 0:
        return Line(Point(0, -c / b), Point(1, (-c - a) / b))
    return Line(Point(-c / a, 0), Point(-c / a, 1))


def same_line(u, v):
    return line_of(*u).equals(line_of(*v)) if not isinstance(u, Line) else u.equals(v)


def proportional(u, v):
    return line_of(*u).equals(line_of(*v))


def explicit_form_errors(tex):
    """y = m x + q with reduced fractions, m x first, no 1x, no zero terms."""
    errs = []
    if not re.fullmatch(r"y = -?(?:\\frac\{\d+\}\{\d+\})?(?:\d+)?x?(?: [+-] (?:\\frac\{\d+\}\{\d+\}|\d+))?", tex):
        errs.append(f"not an explicit form y = mx + q: {tex!r}")
    for n, d in re.findall(r"\\frac\{(\d+)\}\{(\d+)\}", tex):
        if gcd(int(n), int(d)) != 1 or int(d) < 2:
            errs.append(f"fraction {n}/{d} not reduced in {tex!r}")
    for name, rx in FORBIDDEN_ALL:
        if rx.search(tex):
            errs.append(f"{tex!r} contains {name}")
    return errs


def implicit_form_errors(tex):
    """a x + b y + c = 0 with integer coefficients, gcd 1, a > 0."""
    errs = []
    if not re.fullmatch(r"-?\d*x(?: [+-] \d*y)?(?: [+-] \d+)? = 0", tex):
        return [f"not an integer implicit form: {tex!r}"]
    a, b, c = abc(equation(tex))
    if a <= 0:
        errs.append(f"a <= 0 in {tex!r}")
    if gcd(gcd(a, b), c) != 1:
        errs.append(f"coefficients with a common divisor in {tex!r}")
    return errs


def check_options(opts, read, from_values, is_right, errs):
    """Reads every option, compares with its values; returns the list of 'right' flags."""
    right = []
    keys = []
    for o in opts:
        try:
            k = read(o["latex"])
            if k != from_values(o["values"]):
                errs.append(f"option latex {o['latex']!r} != values {o['values']}")
            keys.append(k)
            right.append(is_right(k))
        except (ValueError, TypeError, ZeroDivisionError, AttributeError) as e:
            errs.append(f"option {o.get('latex')!r}: {e}")
            keys.append(None)
            right.append(False)
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    if len(set(map(str, keys))) != len(keys):
        errs.append("options not distinct")
    if sum(right) != 1:
        errs.append(f"{sum(right)} options are right, expected 1: {[o['latex'] for o in opts]}")
    for o in opts:
        for name, rx in FORBIDDEN_ALL:
            if rx.search(o["latex"]):
                errs.append(f"option {o['latex']!r} contains {name}")
    return right


def choice_of(sample):
    """The multiple-choice form: the answer itself or the choice variant."""
    ans = sample["answer"]
    if ans.get("kind") == "choice":
        if sample.get("choice") is not None and sample["choice"] != ans:
            return None, "choice differs from the answer"
        return ans, None
    ch = sample.get("choice")
    if ch is None:
        return None, "missing choice variant"
    return ch, None


def correct_ok(ch, right, errs):
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(right) or not right[idx]:
        errs.append("choice.correct does not point to the right option")


# ---------------------------------------------------------------------------
# Levels

KIND_LABELS = {
    r"\text{orizzontale}": "orizzontale",
    r"\text{verticale}": "verticale",
    r"\text{bisettrice del I e III quadrante}": "bis13",
    r"\text{bisettrice del II e IV quadrante}": "bis24",
    r"\text{l'asse } x": "assex",
    r"\text{l'asse } y": "assey",
}


def kind_of(a, b, c):
    if a == 0:
        return "assex" if c == 0 else "orizzontale"
    if b == 0:
        return "assey" if c == 0 else "verticale"
    if c == 0 and a == -b:
        return "bis13"
    if c == 0 and a == b:
        return "bis24"
    return "altra"


def read_simple_line(t):
    """x = r or y = r (an option of level 1)."""
    m = re.fullmatch(r"([xy]) = (.*)", t)
    if not m:
        raise ValueError(f"unreadable {t!r}")
    return (m.group(1), value(m.group(2)))


def level1(sample, errs):
    prob = sample["problem"]
    ch, e = choice_of(sample)
    if e:
        return [e], None
    opts = ch["options"]
    m = re.fullmatch(r"A(.*)", prob)
    if m and "=" not in prob:
        x0, y0 = point(m.group(1))
        axis = re.search(r"parallela all'asse ([xy])\.", sample["prompt"]).group(1)
        truth = Line(Point(x0, y0), Point(x0, y0 + 1)) if axis == "y" else Line(Point(x0, y0), Point(x0 + 1, y0))
        if x0 == y0 or x0 == -y0:
            errs.append("level 1: x_A = ±y_A")

        def lineof(kv):
            v, r = kv
            return Line(Point(r, 0), Point(r, 1)) if v == "x" else Line(Point(0, r), Point(1, r))

        right = check_options(opts, read_simple_line, lambda v: (v[0], Rational(v[1])), lambda k: lineof(k).equals(truth), errs)
        correct_ok(ch, right, errs)
        if sample["solution"] != opts[ch["correct"]]["latex"]:
            errs.append("solution != right option")
        vals = {o["values"][0] + o["values"][1] for o in opts}
        # the x = 3 mistake: the same number with the other letter
        good = opts[ch["correct"]]["values"]
        other = ("y" if good[0] == "x" else "x") + good[1]
        if other not in vals:
            errs.append("level 1: the distractor with the letter swapped is missing")
        return errs, "punto"
    a, b, c = abc(equation(prob))
    truth = kind_of(a, b, c)
    if truth == "altra":
        errs.append(f"level 1: {prob} is not a special line")
    right = check_options(opts, lambda t: KIND_LABELS[t], lambda v: v[0], lambda k: k == truth, errs)
    correct_ok(ch, right, errs)
    if truth in ("verticale", "orizzontale"):
        wrong = "orizzontale" if truth == "verticale" else "verticale"
        if wrong not in {o["values"][0] for o in opts}:
            errs.append("level 1: the other direction (x = 3 is not horizontal) is missing")
    return errs, "tipo"


def level2(sample, errs):
    a, b, c = abc(equation(sample["problem"]))
    if not re.fullmatch(r"-?\d*x [+-] \d*y [+-] \d+ = 0", sample["problem"]):
        errs.append("level 2: problem not in the form ax + by + c = 0")
    if a <= 0 or b == 0 or c == 0 or gcd(gcd(a, b), c) != 1:
        errs.append(f"level 2: need a > 0, b, c != 0, gcd 1: {a}, {b}, {c}")
    if abs(a) > 7 or abs(b) > 6 or abs(c) > 9:
        errs.append("level 2: coefficients too large")
    ys = solve(a * X + b * Y + c, Y)
    truth = ys[0]
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "explicit":
        errs.append("level 2: answer must be an explicit expression")
    else:
        if sympify(ans["value"], locals={"x": X}) - truth != 0:
            errs.append(f"answer {ans['value']} != {truth}")
        errs += explicit_form_errors(ans["latex"])
        if ans["latex"] != sample["solution"]:
            errs.append("solution != answer latex")
        try:
            if equation(ans["latex"]).subs(Y, truth).expand() != 0:
                errs.append("answer latex is not the line")
        except ValueError as e:
            errs.append(str(e))
    ch, e = choice_of(sample)
    if e:
        return errs + [e], None

    def read(t):
        errs.extend(explicit_form_errors(t))
        return (Y - equation(t)).expand()

    right = check_options(ch["options"], read, lambda v: sympify(v[0], locals={"x": X}).expand(), lambda k: (k - truth).expand() == 0, errs)
    correct_ok(ch, right, errs)
    # the mistake of the lesson: only the x term divided by b
    if abs(b) != 1:
        wrong = (-a / b * X - c).expand()
        if not any((sympify(o["values"][0], locals={"x": X}) - wrong).expand() == 0 for o in ch["options"]):
            errs.append("level 2: the distractor 'only the x term divided' is missing")
    return errs, "b<0" if b < 0 else "b>0"


def level3(sample, errs):
    prob = sample["problem"]
    e = equation(prob)
    a, b, c = abc(e)
    if prob.startswith("y = "):
        kind = "esplicita"
        m, qq = -a / b, -c / b
        if m.is_integer and qq.is_integer:
            errs.append("level 3: explicit form without fractions")
        errs += explicit_form_errors(prob)
    else:
        kind = "frazioni"
        if "\\frac{x}" not in prob and "\\frac{y}" not in prob:
            errs.append("level 3: equation without fractions")
    if a == 0 or b == 0 or c == 0:
        errs.append("level 3: a zero coefficient")
    ch, err = choice_of(sample)
    if err:
        return errs + [err], None

    def read(t):
        errs.extend(implicit_form_errors(t))
        return abc(equation(t))

    right = check_options(ch["options"], read, lambda v: tuple(Rational(s) for s in v), lambda k: proportional(k, (a, b, c)), errs)
    correct_ok(ch, right, errs)
    if sample["solution"] != ch["options"][ch["correct"]]["latex"]:
        errs.append("solution != right option")
    return errs, kind


def level4(sample, errs):
    prob = sample["problem"]
    parts = prob.split(r" \quad ")
    a, b, c = abc(equation(parts[0]))
    if a == 0 or b == 0 or c == 0:
        errs.append("level 4: a zero coefficient")
    ch, err = choice_of(sample)
    if err:
        return errs + [err], None
    if len(parts) == 1:
        on = lambda k: a * k[0] + b * k[1] + c == 0  # noqa: E731
        right = check_options(ch["options"], point, lambda v: (Rational(v[0]), Rational(v[1])), on, errs)
        correct_ok(ch, right, errs)
        if sample["answer"].get("kind") != "choice":
            errs.append("level 4: membership is a choice")
        good = [point(o["latex"]) for o in ch["options"] if on(point(o["latex"]))]
        if good and good[0][0] != good[0][1] and (good[0][1], good[0][0]) not in [point(o["latex"]) for o in ch["options"]]:
            errs.append("level 4: the swapped point is missing")
        if good and sample["solution"] != ch["options"][ch["correct"]]["latex"]:
            errs.append("solution != right option")
        return errs, "appartenenza"
    m = re.fullmatch(r"([xy])_C = (.*)", parts[1])
    if not m or len(parts) != 2:
        return errs + [f"level 4: unreadable given {prob!r}"], None
    given, g = m.group(1), value(m.group(2))
    unk = Y if given == "x" else X
    sol = solve((a * X + b * Y + c).subs(X if given == "x" else Y, g), unk)
    if len(sol) != 1:
        return errs + ["level 4: no unique coordinate"], None
    truth = sol[0]
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != truth:
        errs.append(f"level 4: answer {ans.get('value')} != {truth}")
    if truth.q > 4:
        errs.append("level 4: denominator > 4")
    letter = "y" if given == "x" else "x"

    def read(t):
        mm = re.fullmatch(letter + r"_C = (.*)", t)
        if not mm:
            raise ValueError(f"unreadable {t!r}")
        return value(mm.group(1))

    right = check_options(ch["options"], read, lambda v: Rational(v[0]), lambda k: k == truth, errs)
    correct_ok(ch, right, errs)
    return errs, "coordinata"


def read_axes(t):
    m = re.fullmatch(r"A(.*),\\ B(.*)", t)
    if not m:
        raise ValueError(f"unreadable {t!r}")
    (xa, ya), (xb, yb) = point(m.group(1)), point(m.group(2))
    if ya != 0 or xb != 0:
        raise ValueError(f"A or B not on its axis: {t!r}")
    return (xa, yb)


def level5(sample, errs):
    a, b, c = abc(equation(sample["problem"]))
    if a == 0 or b == 0 or c == 0:
        errs.append("level 5: a zero coefficient")
    L = line_of(a, b, c)
    ax = L.intersection(Line(Point(0, 0), Point(1, 0)))[0]
    ay = L.intersection(Line(Point(0, 0), Point(0, 1)))[0]
    truth = (ax.x, ay.y)
    ch, err = choice_of(sample)
    if err:
        return errs + [err], None
    right = check_options(ch["options"], read_axes, lambda v: (Rational(v[0]), Rational(v[1])), lambda k: k == truth, errs)
    correct_ok(ch, right, errs)
    if truth[0] != truth[1] and (truth[1], truth[0]) not in [read_axes(o["latex"]) for o in ch["options"]]:
        errs.append("level 5: the swapped distractor (x = 0 for the x-axis) is missing")
    if any(v.q > 6 for v in truth):
        errs.append("level 5: denominator > 6")
    return errs, "interi" if all(v.is_integer for v in truth) else "frazionari"


SPECIAL = {
    r"\text{verticale: } x = ": "h",
    r"\text{orizzontale: } y = ": "k",
    r"\text{per l'origine: } y = ": "m",
}


def read_special(t):
    for head, kind in SPECIAL.items():
        if t.startswith(head):
            rest = t[len(head):]
            if kind == "m":
                if not rest.endswith("x"):
                    raise ValueError(f"unreadable {t!r}")
                body = rest[:-1]
                v = Rational(-1) if body == "-" else Rational(1) if body == "" else value(body)
                if body in ("1", "-1"):
                    raise ValueError(f"1x in {t!r}")
                return (kind, v)
            return (kind, value(rest))
    raise ValueError(f"unreadable {t!r}")


def special_line(k):
    kind, v = k
    if kind == "h":
        return (1, 0, -v)
    if kind == "k":
        return (0, 1, -v)
    if v == 0:
        raise ValueError("y = 0x")
    return (v, -1, 0)


def level6(sample, errs):
    a, b, c = abc(equation(sample["problem"]))
    zeros = [a == 0, b == 0, c == 0]
    if sum(zeros) != 1:
        return errs + ["level 6: exactly one of a, b, c must be zero"], None
    kind = "orizzontale" if a == 0 else "verticale" if b == 0 else "origine"
    want = {"orizzontale": "k", "verticale": "h", "origine": "m"}[kind]
    ch, err = choice_of(sample)
    if err:
        return errs + [err], None
    right = check_options(ch["options"], read_special, lambda v: (v[0], Rational(v[1])), lambda k: k[0] == want and proportional(special_line(k), (a, b, c)), errs)
    correct_ok(ch, right, errs)
    # a wrong option with the right line must have the wrong label: the line alone would be right
    for o in ch["options"]:
        try:
            k = read_special(o["latex"])
            if k[0] != want and proportional(special_line(k), (a, b, c)):
                errs.append(f"level 6: {o['latex']} is the same line with another label")
        except ValueError:
            pass
    if kind != "origine" and ("k" if want == "h" else "h") not in {o["values"][0] for o in ch["options"]}:
        errs.append("level 6: the other direction is missing")
    return errs, kind


QUESTIONS = {
    "Per quale valore di k la retta è orizzontale?": "orizzontale",
    "Per quale valore di k la retta è verticale?": "verticale",
    "Per quale valore di k la retta passa per l'origine?": "origine",
    "Per quale valore di k la retta passa per il punto A?": "punto",
}


def level7(sample, errs):
    parts = sample["problem"].split(r" \quad ")
    e = equation(parts[0])
    if K not in e.free_symbols:
        return errs + ["level 7: no k"], None
    P = Poly(e.expand(), X, Y)
    a, b, c = P.coeff_monomial(X), P.coeff_monomial(Y), P.coeff_monomial(1)
    if sum(K in t.free_symbols for t in (a, b, c)) != 1:
        errs.append("level 7: k must be in exactly one coefficient")
    q = QUESTIONS.get(sample["prompt"])
    if q is None:
        return errs + [f"level 7: unknown prompt {sample['prompt']!r}"], None
    if (q == "punto") != (len(parts) == 2):
        errs.append("level 7: the point goes with the 'punto' question")
    cond = {"orizzontale": a, "verticale": b, "origine": c}.get(q)
    if q == "punto":
        m = re.fullmatch(r"A(.*)", parts[1])
        x0, y0 = point(m.group(1))
        cond = e.subs({X: x0, Y: y0})
    cond = sympify(cond).expand()
    if cond == 0:
        return errs + ["level 7: every k works"], None
    sols = solve(cond, K) if K in cond.free_symbols else []
    # a value of k that gives no line (a = b = 0) does not count
    sols = [s for s in sols if not (sympify(a).subs(K, s) == 0 and sympify(b).subs(K, s) == 0)]
    truth = sols[0] if sols else None
    if len(sols) > 1:
        errs.append("level 7: more than one k")
    ans = sample["answer"]
    if truth is None:
        if ans.get("kind") != "choice":
            errs.append("level 7: no k, the answer must be the choice 'nessun valore'")
    else:
        if ans.get("kind") != "number" or Rational(ans["value"]) != truth:
            errs.append(f"level 7: answer {ans.get('value')} != {truth}")
        if truth.q > 2:
            errs.append("level 7: k with denominator > 2")
    ch, err = choice_of(sample)
    if err:
        return errs + [err], None

    def read(t):
        if t == r"\text{nessun valore di } k":
            return "none"
        mm = re.fullmatch(r"k = (.*)", t)
        if not mm:
            raise ValueError(f"unreadable {t!r}")
        return value(mm.group(1))

    right = check_options(ch["options"], read, lambda v: "none" if v == ["none"] else Rational(v[0]), lambda k: k == ("none" if truth is None else truth), errs)
    correct_ok(ch, right, errs)
    if truth is not None and "none" not in [o["values"][0] for o in ch["options"]]:
        errs.append("level 7: 'nessun valore di k' missing")
    return errs, "esiste" if truth is not None else "nessuno"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs = []
    lvl = sample["level"]
    for name, rx in FORBIDDEN_ALL:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden '{name}': {sample['problem']}")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    fn = LEVELS.get(lvl)
    if fn is None:
        return errs + [f"unknown level {lvl}"], None
    try:
        return fn(sample, errs)
    except (ValueError, TypeError, AttributeError, IndexError, KeyError, ZeroDivisionError) as e:
        return errs + [f"unreadable sample: {type(e).__name__}: {e}"], None
