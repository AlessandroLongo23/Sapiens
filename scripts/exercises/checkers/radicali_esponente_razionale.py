"""Checker for radicali-esponente-razionale, from specs/exercises/radicali-esponente-razionale.md
and lesson 76 (Potenze con esponente razionale).

Written from the spec, not from the generator. Every formula the student sees (the problem, the
answer, each option) is read back with a small LaTeX parser for the lesson's notation (powers with
fractional or decimal exponents, \\sqrt[n]{...}, \\frac, \\cdot, ':', implicit products such as
a\\sqrt[12]{a^5}) and evaluated exactly with SymPy, with the letter a positive. A power with a negative
base and a non-integer exponent has no meaning (as the lesson says) and raises Undefined; an odd
root of a negative number is the real root. The answer must equal the value of the problem, be
written in the required form (radical with the smallest index and nothing to bring out, a
rationalised denominator, a radical or a power for level 1), and every distractor must be wrong.
"""
import re
from math import gcd

from sympy import Integer, Rational, Symbol, factorint, nsimplify, real_root, root, simplify, sympify

from verify import rat

A = Symbol("a", positive=True)

CASE_RANGES = {
    1: {"radicale": (0.40, 0.60), "potenza": (0.40, 0.60)},
    3: {"negativo": (0.30, 0.50), "frazione": (0.20, 0.40), "decimale": (0.20, 0.40)},
    4: {"prodotto": (0.50, 0.70), "quoziente": (0.30, 0.50)},
    5: {"prodotto e quoziente": (0.40, 0.60), "quoziente e prodotto": (0.40, 0.60)},
    6: {"prodotto": (0.40, 0.60), "annidati": (0.40, 0.60)},
    7: {"radicando negativo": (0.25, 0.45), "razionalizzare": (0.25, 0.45), "vero o falso": (0.20, 0.40)},
}

MEANINGLESS = r"\text{Non ha significato}"


class Undefined(Exception):
    """A power with a negative base and a non-integer exponent, or an even root of a negative."""


class ParseError(Exception):
    pass


# ---------------------------------------------------------------------------
# A parser for the lesson's notation

TOKEN = re.compile(
    r"\s*(\\sqrt|\\frac|\\cdot|\\left\(|\\right\)|\\left\[|\\right\]|\d+\{,\}\d+|\d+|a|[-+:^{}\[\]()])"
)


def tokenize(s):
    out, i = [], 0
    s = s.strip()
    while i < len(s):
        m = TOKEN.match(s, i)
        if not m:
            raise ParseError(f"cannot read {s[i:i + 12]!r} in {s!r}")
        out.append(m.group(1))
        i = m.end()
        while i < len(s) and s[i].isspace():
            i += 1
    return out


def power(b, e):
    if b.is_number and b < 0 and not e.is_integer:
        raise Undefined(f"({b})^({e})")
    return b**e


def nth_root(x, n):
    if x.is_number and x < 0:
        if n % 2 == 0:
            raise Undefined(f"even root of {x}")
        return -root(-x, n)
    return root(x, n)


class P:
    def __init__(self, s):
        self.t = tokenize(s)
        self.i = 0

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else None

    def eat(self, tok=None):
        c = self.peek()
        if c is None or (tok is not None and c != tok):
            raise ParseError(f"expected {tok!r}, found {c!r}")
        self.i += 1
        return c

    def parse(self):
        v = self.expr()
        if self.peek() is not None:
            raise ParseError(f"trailing {self.t[self.i:]}")
        return v

    def expr(self):
        v = self.term()
        while self.peek() in ("+", "-"):
            op = self.eat()
            w = self.term()
            v = v + w if op == "+" else v - w
        return v

    def term(self):
        neg = False
        if self.peek() == "-":
            self.eat()
            neg = True
        v = self.factor()
        while True:
            c = self.peek()
            if c == r"\cdot":
                self.eat()
                v = v * self.factor()
            elif c == ":":
                self.eat()
                v = v / self.factor()
            elif c is not None and (c in (r"\sqrt", r"\frac", "a", r"\left(", r"\left[", "(") or c[0].isdigit()):
                v = v * self.factor()
            else:
                break
        return -v if neg else v

    def group(self):
        self.eat("{")
        v = self.expr()
        self.eat("}")
        return v

    def factor(self):
        b = self.atom()
        if self.peek() == "^":
            self.eat()
            if self.peek() == "{":
                e = self.group()
            else:
                e = Integer(int(self.eat()))
            return power(b, e)
        return b

    def atom(self):
        c = self.eat()
        if c == "a":
            return A
        if "{,}" in c:
            i, f = c.split("{,}")
            return Rational(int(i + f), 10 ** len(f))
        if c[0].isdigit():
            return Integer(int(c))
        if c == r"\frac":
            n = self.group()
            d = self.group()
            return n / d
        if c == r"\sqrt":
            n = 2
            if self.peek() == "[":
                self.eat("[")
                n = int(self.eat())
                self.eat("]")
            return nth_root(self.group(), n)
        if c in (r"\left(", "("):
            v = self.expr()
            self.eat(r"\right)" if c == r"\left(" else ")")
            return v
        if c == r"\left[":
            v = self.expr()
            self.eat(r"\right]")
            return v
        if c == "{":
            v = self.expr()
            self.eat("}")
            return v
        raise ParseError(f"unexpected {c!r}")


def parse(s):
    return P(s).parse()


def same(x, y):
    """Exact equality for a > 0. SymPy keeps powers of a positive base in a canonical form, so equal
    values usually cancel at once; otherwise a 50-digit evaluation at three points of a separates
    different values, and simplify() confirms the equal ones."""
    d = x - y
    if d == 0:
        return True
    for t in (Rational(7, 3), Integer(5), Rational(237, 100)):
        if abs(complex(d.subs(A, t).evalf(50))) > 1e-30:
            return False
    return simplify(d) == 0 or all(nsimplify(simplify(d.subs(A, t))) == 0 for t in (Rational(7, 3), Integer(5)))


def sym_value(s):
    if not re.fullmatch(r"[0-9a*/()+\- ]+", s):
        raise ParseError(f"bad value string {s!r}")
    return sympify(s, locals={"a": A})


# ---------------------------------------------------------------------------
# Forms

SQRT = re.compile(r"\\sqrt(?:\[(\d+)\])?\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}")


def radical_ok(n, rad):
    """Nothing to bring out and the smallest index: radicand b^j with every prime exponent < n and
    gcd(n, exponents) = 1."""
    n = int(n or 2)
    if rad == "a":
        exps = [1]
    elif re.fullmatch(r"a\^\{(\d+)\}", rad):
        exps = [int(re.fullmatch(r"a\^\{(\d+)\}", rad).group(1))]
    elif re.fullmatch(r"\d+", rad):
        v = int(rad)
        if v < 2:
            return False
        exps = list(factorint(v).values())
    else:
        return False
    g = n
    for e in exps:
        if e >= n:
            return False
        g = gcd(g, e)
    return g == 1


def form_errors(latex, form):
    errs = []
    if form in ("simplified", "rationalized"):
        if "^{\\frac" in latex or "^{-" in latex:
            errs.append(f"power left in {latex!r}")
        for n, rad in SQRT.findall(latex):
            if not radical_ok(n, rad):
                errs.append(f"radical not simplified: \\sqrt[{n or 2}]{{{rad}}}")
        m = re.fullmatch(r"-?\\frac\{(.*)\}\{(\d+)\}", latex)
        if form == "rationalized":
            if not m or "\\sqrt" not in m.group(1):
                errs.append(f"not a rationalised fraction: {latex!r}")
        if latex.startswith("\\frac{1}{") or (m and "\\sqrt" in m.group(2)):
            errs.append(f"radical in the denominator: {latex!r}")
    elif form == "radical":
        if "\\sqrt" not in latex or "\\frac" in latex:
            errs.append(f"not a radical: {latex!r}")
    elif form == "power":
        if not re.fullmatch(r"(\d+|a)\^\{\\frac\{\d+\}\{\d+\}\}", latex):
            errs.append(f"not a power with a fractional exponent: {latex!r}")
    else:
        errs.append(f"unknown form {form!r}")
    return errs


# ---------------------------------------------------------------------------
# Rendering from params (written again from the spec)


def ftex(r):
    r = Rational(r)
    if r.q == 1:
        return str(r.p)
    return ("-" if r < 0 else "") + rf"\frac{{{abs(r.p)}}}{{{r.q}}}"


def rtex(n, rad):
    return rf"\sqrt{{{rad}}}" if n == 2 else rf"\sqrt[{n}]{{{rad}}}"


def btex(b, j, expand=True):
    if j == 1:
        return str(b)
    if b != "a" and expand:
        return str(int(b) ** j)
    return f"{b}^{{{j}}}"


# ---------------------------------------------------------------------------
# True or false


def statement_truth(values):
    kind = values[0]
    if kind == "root":
        n, x, rhs = int(values[1]), sym_value(values[2]), sym_value(values[3])
        if n % 2 == 0:
            return False
        return same(real_root(x, n), rhs)
    if kind == "pow":
        b, e, rhs = rat(values[1]), rat(values[2]), sym_value(values[3])
        if b < 0 and not e.is_integer:
            return False  # no meaning, so the equality is false
        return same(b**e, rhs)
    if kind == "pp":
        c, rhs = rat(values[1]), rat(values[2])
        return same((c**2) ** Rational(1, 2), rhs)
    if kind == "sum":
        x, y, rhs = rat(values[1]), rat(values[2]), rat(values[3])
        return same((x + y) ** Rational(1, 2), rhs)
    raise ParseError(f"unknown statement {values}")


def statement_tex(values):
    kind = values[0]
    if kind == "root":
        n, x = int(values[1]), values[2]
        return f"{rtex(n, x)} = -{x.lstrip('-')}^{{{ftex(Rational(1, n))}}}"
    if kind == "pow":
        b, e, rhs = rat(values[1]), rat(values[2]), values[3]
        head = f"({b})" if b < 0 else f"{b}"
        m = re.fullmatch(r"(\d+)\*\*\((\d+)/(\d+)\)", rhs)
        if m:
            # N^{m/n} = \sqrt[index]{N^{power}}: the value N**(p/k) is written \sqrt[k]{N^{p}}
            N, pp, k = m.groups()
            rtx = rtex(int(k), f"{N}^{{{pp}}}")
        else:
            rtx = ftex(rat(rhs))
        return f"{head}^{{{ftex(e)}}} = {rtx}"
    if kind == "pp":
        c = rat(values[1])
        return rf"\left[({c})^{{2}}\right]^{{\frac{{1}}{{2}}}} = {values[2]}"
    if kind == "sum":
        return rf"({values[1]} + {values[2]})^{{\frac{{1}}{{2}}}} = {values[3]}"
    raise ParseError(kind)


def check_true_false(sample, errs):
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["true-or-false must be a choice"]
    opts = ans["options"]
    if len(opts) != 4:
        errs.append("need 4 statements")
    truths = []
    for o in opts:
        try:
            truths.append(statement_truth(o["values"]))
            if statement_tex(o["values"]) != o["latex"]:
                errs.append(f"statement latex {o['latex']!r} != {statement_tex(o['values'])!r}")
        except Exception as e:  # noqa: BLE001
            errs.append(f"statement unreadable: {e!r}")
            truths.append(None)
    if truths.count(True) != 1:
        errs.append(f"{truths.count(True)} true statements")
    elif truths.index(True) != ans.get("correct"):
        errs.append("correct index is not the true statement")
    if len(set(tuple(o["values"]) for o in opts)) != len(opts):
        errs.append("repeated statement")
    fam = sample["params"].get("families", [])
    if len(set(fam)) != 4:
        errs.append(f"statements not from four families: {fam}")
    return errs


# ---------------------------------------------------------------------------


def truth_of(sample):
    """The exact value of the problem, read from the problem LaTeX."""
    return parse(sample["problem"])


def choice_errors(sample, truth, form):
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    idx = ch.get("correct")
    vals = []
    for i, o in enumerate(opts):
        if o["latex"] == MEANINGLESS:
            if o["values"] != ["nonsense"]:
                errs.append("meaningless option with a value")
            vals.append(None)
            continue
        try:
            shown = parse(o["latex"])
            given = sym_value(o["values"][0])
        except Exception as e:  # noqa: BLE001
            errs.append(f"option unreadable {o['latex']!r}: {e!r}")
            vals.append(None)
            continue
        if not same(shown, given):
            errs.append(f"option {o['latex']!r} != its value {o['values']}")
        vals.append(shown)
        right = same(shown, truth)
        if i == idx:
            if not right:
                errs.append(f"correct option {o['latex']!r} is wrong")
            if form:
                errs += form_errors(o["latex"], form)
        elif right:
            # equal in value: only allowed if it is not in the required form
            if not form or not form_errors(o["latex"], form):
                errs.append(f"distractor {o['latex']!r} is also right")
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            if vals[i] is not None and vals[j] is not None and same(vals[i], vals[j]):
                errs.append(f"options {opts[i]['latex']!r} and {opts[j]['latex']!r} have the same value")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("options with the same latex")
    if not isinstance(idx, int) or not 0 <= idx < len(opts):
        errs.append("correct index out of range")
    return errs


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    case = p.get("case")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or solution")
    if re.search(r"\+\s*-|-\s*-|\^\{1\}", sample["problem"]):
        errs.append(f"forbidden pattern in {sample['problem']!r}")

    if lvl == 7 and case == "vero o falso":
        return check_true_false(sample, errs), case

    ans = sample["answer"]
    try:
        truth = truth_of(sample)
    except Exception as e:  # noqa: BLE001
        return errs + [f"problem unreadable: {e!r}"], case

    form = None
    if ans["kind"] == "number":
        given = rat(ans["value"])
    elif ans["kind"] == "expression":
        given = sym_value(ans["value"])
        form = ans.get("form")
        try:
            if not same(parse(ans["latex"]), given):
                errs.append(f"answer latex {ans['latex']!r} != value {ans['value']}")
        except Exception as e:  # noqa: BLE001
            errs.append(f"answer latex unreadable: {e!r}")
        errs += form_errors(ans["latex"], form)
    else:
        return errs + [f"answer kind {ans['kind']} at level {lvl}"], case
    if not same(given, truth):
        errs.append(f"answer {ans['value']} != problem value {truth}")

    expected_kind = {1: "expression", 2: "number", 3: "number", 4: "expression", 5: "number", 6: "expression", 7: "expression"}
    if ans["kind"] != expected_kind.get(lvl):
        errs.append(f"answer kind {ans['kind']} at level {lvl}")
    if ans["kind"] == "number" and (abs(given.p) > 256 or given.q > 256):
        errs.append(f"result {given} too big")

    prob = sample["problem"]
    if lvl == 1:
        b, e = p["base"], rat(p["exp"])
        m, n = e.p, e.q
        if not (2 <= n <= 7 and 1 <= m <= 5 and m != n):
            errs.append(f"exponent {e} out of range")
        if b not in ("2", "3", "5", "6", "7", "10", "11", "a"):
            errs.append(f"base {b}")
        pw = f"{b}^{{{ftex(e)}}}"
        rd = rtex(n, btex(b, m, expand=False))
        want = (pw, rd, "radical") if case == "radicale" else (rd, pw, "power")
        if (prob, ans["latex"], form) != want:
            errs.append(f"level 1 {case}: {prob!r} -> {ans['latex']!r} ({form}), expected {want}")
    elif lvl == 2:
        A_, c, n, e = int(p["A"]), int(p["c"]), int(p["n"]), rat(p["exp"])
        if c**n != A_ or A_ > 256 or e <= 0 or e.is_integer or e.q != n:
            errs.append("level 2: A = c^n <= 256, positive non-integer exponent with denominator n")
        if prob != f"{A_}^{{{ftex(e)}}}":
            errs.append("level 2 problem != params")
        if not given.is_integer:
            errs.append("level 2 result not an integer")
        k = "numeratore 1" if e.p == 1 else "numeratore maggiore di 1"
        if case != k:
            errs.append(f"case {case} != {k}")
    elif lvl == 3:
        e = rat(p["exp"])
        if case == "negativo":
            if e >= 0 or e.is_integer or prob != f"{p['A']}^{{{ftex(e)}}}":
                errs.append("level 3 negativo: A^{-m/n}")
        elif case == "frazione":
            b = rat(p["base"])
            if b.q == 1 or b <= 0 or e.is_integer or prob != rf"\left({ftex(b)}\right)^{{{ftex(e)}}}":
                errs.append("level 3 frazione: (p/q)^{m/n}")
        elif case == "decimale":
            d = p.get("decimal", "")
            if "{,}" not in prob or prob != f"{p['A']}^{{{d}}}":
                errs.append("level 3 decimale: A^{0,d}")
            ip, fp = d.lstrip("-").split("{,}")
            dv = Rational(int(ip + fp), 10 ** len(fp)) * (-1 if d.startswith("-") else 1)
            if dv != e or e.is_integer:
                errs.append(f"decimal {d} != {e}")
        else:
            errs.append(f"unknown case {case}")
    elif lvl == 4:
        pp, rads, op = int(p["p"]), p["rads"], p["op"]
        if pp not in (2, 3, 5, 7) or len(rads) != 2 or rads[0]["n"] == rads[1]["n"]:
            errs.append("level 4: base 2, 3, 5 or 7, two different indices")
        for r in rads:
            if not (1 <= r["k"] < r["n"] <= 8) or gcd(r["k"], r["n"]) != 1 or pp ** r["k"] > 81:
                errs.append(f"level 4 radical {r}")
        sep = r" \cdot " if op == "mul" else " : "
        s = sep.join(rtex(r["n"], btex(pp, r["k"])) for r in rads)
        if prob != s:
            errs.append(f"level 4 problem {prob!r} != {s!r}")
        k = "prodotto" if op == "mul" else "quoziente"
        if case != k:
            errs.append(f"case {case} != {k}")
        ex = (sum if op == "mul" else lambda xs: xs[0] - xs[1])([Rational(r["k"], r["n"]) for r in rads])
        if not (0 < ex < 1) or ex.q > 12:
            errs.append(f"level 4 result exponent {ex}")
    elif lvl == 5:
        pp, pw, ts, ops = int(p["p"]), p["powers"], p["ts"], p["ops"]
        if len(set(pw)) != 3 or not any(t < 0 for t in ts):
            errs.append("level 5: three different bases, a negative exponent")
        ex = [Rational(t, a) for t, a in zip(ts, pw)]
        if any(x.is_integer for x in ex):
            errs.append("level 5: integer exponent in the text")
        sym_ops = [r"\cdot" if o == "mul" else ":" for o in ops]
        s = f"{pp**pw[0]}^{{{ftex(ex[0])}}} {sym_ops[0]} {pp**pw[1]}^{{{ftex(ex[1])}}} {sym_ops[1]} {pp**pw[2]}^{{{ftex(ex[2])}}}"
        if prob != s:
            errs.append(f"level 5 problem {prob!r} != {s!r}")
        k = "prodotto e quoziente" if ops[0] == "mul" else "quoziente e prodotto"
        if case != k or ops[0] == ops[1]:
            errs.append(f"case {case}, ops {ops}")
        if not given.is_rational:
            errs.append("level 5 result not rational")
    elif lvl == 6:
        if form != "simplified" or "a" not in ans["latex"]:
            errs.append("level 6: simplified radical in a")
        if case == "prodotto":
            rads = p["rads"]
            s = r" \cdot ".join(rtex(r["n"], btex("a", r["k"], False)) for r in rads)
            ex = sum(Rational(r["k"], r["n"]) for r in rads)
            if prob != s or len(rads) not in (2, 3) or not (1 < ex <= 3) or ex.is_integer:
                errs.append(f"level 6 prodotto: {prob!r}, exponent {ex}")
            if not ans["latex"].startswith("a"):
                errs.append("level 6 prodotto: integer part not outside")
        elif case == "annidati":
            n, u, m, v = (int(p[k]) for k in "numv")
            inner = ("a" if u == 1 else f"a^{{{u}}}") + rtex(m, btex("a", v, False))
            if prob != rtex(n, inner):
                errs.append(f"level 6 annidati: {prob!r}")
        else:
            errs.append(f"unknown case {case}")
    elif lvl == 7:
        if case == "radicando negativo":
            if not re.search(r"\\sqrt\[[35]\]\{-\d+\}", prob) or not ans["latex"].startswith("-"):
                errs.append("level 7: odd root of a negative, negative result")
            if not (truth.is_number and truth < 0):
                errs.append("level 7 negative radicand: result not negative")
        elif case == "razionalizzare":
            if form != "rationalized" or not re.fullmatch(r"\d+\^\{-(\\frac\{\d+\}\{\d+\}|\d+\{,\}\d+)\}", prob):
                errs.append(f"level 7 razionalizzare: {prob!r} ({form})")
        else:
            errs.append(f"unknown case {case}")

    errs += choice_errors(sample, truth, form)
    return errs, case
