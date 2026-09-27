"""Checker for radicali-razionalizzazione, from specs/exercises/radicali-razionalizzazione.md and lesson 74.

Written from the spec, not from the generator. The fraction is read back from the problem LaTeX with a small
parser of its own (numbers, letters, \\frac, \\sqrt, \\sqrt[n], powers, brackets, implicit products); SymPy
computes its value with positive letters, and the answer must be equal to it exactly (a numeric difference
under 1e-40 at 60 digits, confirmed with radsimp or minimal_polynomial; with letters, at three sets of
rational values). The answer and the options are read back from their LaTeX too, and their form is checked
on the parse tree: no radical in a denominator, every radicand without factors to take out and with the
smallest index, the fraction reduced, the denominator positive, like radicals collected. The level and the
case are recomputed from the problem. In the multiple choice exactly one option has the right value in the
right form; an option with the right value in the wrong form ("6√3/3", "√12/4") is a real distractor and is
wrong for that reason.
"""
import re
from math import gcd as igcd

from sympy import (
    Add,
    Integer,
    Mul,
    Pow,
    Rational,
    Symbol,
    factorint,
    minimal_polynomial,
    radsimp,
    root,
    sqrt,
    sympify,
)

LETTERS = {c: Symbol(c, positive=True) for c in "abxy"}
T = Symbol("t")

CASE_RANGES = {
    1: {"radice sola": (0.40, 0.60), "numero davanti": (0.40, 0.60)},
    2: {"radicando da semplificare": (0.60, 0.80), "lettere": (0.20, 0.40)},
    4: {"due fattori primi": (0.50, 0.70), "lettere": (0.30, 0.50)},
    5: {"numero e radicale": (0.45, 0.65), "due radicali": (0.35, 0.55)},
    6: {"coefficiente davanti al radicale": (0.25, 0.42), "denominatore negativo": (0.25, 0.42), "radicale al numeratore": (0.25, 0.42)},
}


class ParseError(Exception):
    pass


# ---------------------------------------------------------------------------
# LaTeX -> tree. Nodes: ("num", n) ("sym", s) ("frac", a, b) ("root", n, a) ("add", [(sign, node)])
# ("mul", [nodes]) ("pow", node, k) ("par", node)

TOKEN = re.compile(r"\\frac|\\dfrac|\\sqrt|\\cdot|\\left\(|\\right\)|\d+|[a-z]|[-+(){}\[\]^]|\s+")


def tokenize(s):
    toks, i = [], 0
    while i < len(s):
        m = TOKEN.match(s, i)
        if not m:
            raise ParseError(f"unexpected {s[i:i + 10]!r} in {s!r}")
        t = m.group(0)
        i = m.end()
        if t.isspace():
            continue
        toks.append({"\\left(": "(", "\\right)": ")", "\\dfrac": "\\frac"}.get(t, t))
    return toks


class Parser:
    def __init__(self, toks):
        self.t = toks
        self.i = 0

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else None

    def take(self, want=None):
        tok = self.peek()
        if tok is None or (want is not None and tok != want):
            raise ParseError(f"expected {want!r}, found {tok!r}")
        self.i += 1
        return tok

    def expr(self):
        terms = []
        sign = 1
        if self.peek() in ("+", "-"):
            sign = -1 if self.take() == "-" else 1
        terms.append((sign, self.term()))
        while self.peek() in ("+", "-"):
            sign = -1 if self.take() == "-" else 1
            terms.append((sign, self.term()))
        return terms[0][1] if len(terms) == 1 and terms[0][0] == 1 else ("add", terms)

    def term(self):
        fs = [self.power()]
        while self.peek() is not None and self.peek() not in ("+", "-", ")", "}", "]"):
            if self.peek() == "\\cdot":
                self.take()
            fs.append(self.power())
        return fs[0] if len(fs) == 1 else ("mul", fs)

    def power(self):
        a = self.atom()
        if self.peek() == "^":
            self.take()
            if self.peek() == "{":
                self.take("{")
                k = self.take()
                self.take("}")
            else:
                k = self.take()
            if not k.isdigit():
                raise ParseError(f"exponent {k!r}")
            a = ("pow", a, int(k))
        return a

    def group(self):
        self.take("{")
        e = self.expr()
        self.take("}")
        return e

    def atom(self):
        tok = self.take()
        if tok.isdigit():
            return ("num", int(tok))
        if re.fullmatch(r"[a-z]", tok):
            if tok not in LETTERS:
                raise ParseError(f"letter {tok}")
            return ("sym", tok)
        if tok == "\\frac":
            return ("frac", self.group(), self.group())
        if tok == "\\sqrt":
            n = 2
            if self.peek() == "[":
                self.take("[")
                n = int(self.take())
                self.take("]")
            return ("root", n, self.group())
        if tok == "(":
            e = self.expr()
            self.take(")")
            return ("par", e)
        raise ParseError(f"unexpected token {tok!r}")


def parse(latex):
    p = Parser(tokenize(latex))
    e = p.expr()
    if p.peek() is not None:
        raise ParseError(f"trailing {p.peek()!r} in {latex!r}")
    return e


def value(n):
    k = n[0]
    if k == "num":
        return Integer(n[1])
    if k == "sym":
        return LETTERS[n[1]]
    if k == "frac":
        return value(n[1]) / value(n[2])
    if k == "root":
        return root(value(n[2]), n[1])
    if k == "add":
        return Add(*[s * value(t) for s, t in n[1]])
    if k == "mul":
        return Mul(*[value(f) for f in n[1]])
    if k == "pow":
        return value(n[1]) ** n[2]
    if k == "par":
        return value(n[1])
    raise ParseError(k)


def walk(n):
    yield n
    k = n[0]
    if k == "frac":
        yield from walk(n[1])
        yield from walk(n[2])
    elif k == "root":
        yield from walk(n[2])
    elif k == "add":
        for _, t in n[1]:
            yield from walk(t)
    elif k == "mul":
        for f in n[1]:
            yield from walk(f)
    elif k in ("pow", "par"):
        yield from walk(n[1])


def has_root(n):
    return any(x[0] == "root" for x in walk(n))


# ---------------------------------------------------------------------------
# Exact equality

SUBS = [
    {LETTERS["a"]: Rational(7, 3), LETTERS["b"]: Rational(11, 2), LETTERS["x"]: Rational(13, 5), LETTERS["y"]: Rational(5, 7)},
    {LETTERS["a"]: Rational(19, 4), LETTERS["b"]: Rational(3, 11), LETTERS["x"]: Rational(29, 3), LETTERS["y"]: Rational(17, 6)},
    {LETTERS["a"]: Integer(6), LETTERS["b"]: Rational(1, 3), LETTERS["x"]: Rational(2, 9), LETTERS["y"]: Integer(10)},
]


def zero_const(d):
    try:
        n = d.evalf(60)
    except Exception:  # noqa: BLE001
        return False
    if not n.is_real or abs(n) > Rational(1, 10**40):
        return False
    if radsimp(d).expand() == 0:
        return True
    return minimal_polynomial(d, T) == T


def equal(a, b):
    d = a - b
    if d.free_symbols:
        return all(zero_const(d.subs(s)) for s in SUBS)
    return zero_const(d)


# ---------------------------------------------------------------------------
# Form: rationalised and simplified


def monomial_parts(e):
    """Integer coefficient and {symbol: exponent} of a monomial with positive integer exponents, else None."""
    c, rest = e.as_coeff_Mul()
    if not c.is_Integer:
        return None
    exps = {}
    for f in Mul.make_args(rest):
        if f == 1:
            continue
        b, k = f.as_base_exp()
        if not (b.is_Symbol and k.is_Integer and k > 0):
            return None
        exps[b] = int(k)
    return int(c), exps


def outside_parts(node):
    """Integer coefficient, letters outside any radical and the radicals of a term, read on the tree
    (SymPy would merge x·√x into x^(3/2)). A fraction or a bracket makes the term unreadable here: None."""
    coef, lets, rads = 1, {}, []

    def go(n, k=1):
        nonlocal coef
        if n[0] == "num":
            coef *= n[1] ** k
        elif n[0] == "sym":
            lets[n[1]] = lets.get(n[1], 0) + k
        elif n[0] == "root":
            rads.append((n[1], str(value(n[2]).expand())))
        elif n[0] == "mul":
            for f in n[1]:
                go(f, k)
        elif n[0] == "pow":
            go(n[1], k * n[2])
        else:
            raise ParseError("not a monomial term")

    try:
        go(node)
    except ParseError:
        return None
    return coef, lets, tuple(sorted(rads))


def terms_of(node):
    """[(sign, term node)] of a sum, or of a single term."""
    return node[1] if node[0] == "add" else [(1, node)]


def form_errors(latex):
    try:
        tree = parse(latex)
    except ParseError as e:
        return [f"unreadable: {e}"]
    errs = []
    if re.search(r"(?<![\d])1\\sqrt|(?<![\d])1[a-z]|\\frac\{[^{}]*\}\{1\}|\+\s*-|-\s*-|\^\{?1\}?(?!\d)", latex):
        errs.append(f"explicit 1 or double sign: {latex}")
    for n in walk(tree):
        if n[0] == "root":
            idx, rad = n[1], value(n[2]).expand()
            if rad.is_Integer:
                f = factorint(int(rad))
                if int(rad) < 2:
                    errs.append(f"radicand {rad}: {latex}")
                exps = list(f.values())
            else:
                mp = monomial_parts(rad)
                if mp is None:
                    if not rad.is_Add:
                        errs.append(f"radicand {rad} not a monomial nor a sum: {latex}")
                    continue
                c, lets = mp
                exps = list(factorint(c).values()) + list(lets.values())
            if any(e >= idx for e in exps):
                errs.append(f"radical with a factor to take out: {latex}")
            g = idx
            for e in exps:
                g = igcd(g, e)
            if exps and g > 1:
                errs.append(f"radical with a reducible index: {latex}")
        if n[0] == "frac":
            num, den = n[1], n[2]
            if has_root(den):
                errs.append(f"radical in a denominator: {latex}")
                continue
            if any(x[0] == "frac" for x in walk(num)) or any(x[0] == "frac" for x in walk(den)):
                errs.append(f"fraction inside a fraction: {latex}")
            dv, nv = value(den).expand(), value(num).expand()
            parts = [outside_parts(t) for _, t in terms_of(num)]
            if any(p is None for p in parts):
                errs.append(f"numerator not a sum of monomial terms: {latex}")
                continue
            if dv.is_Integer:
                if dv <= 1:
                    errs.append(f"denominator {dv}: {latex}")
                g = int(dv)
                for c, _, _ in parts:
                    g = igcd(g, c)
                if g > 1:
                    errs.append(f"fraction not reduced (common factor {g}): {latex}")
            else:
                mp = monomial_parts(dv)
                if mp is not None:
                    dc, dl = mp
                    if dc <= 0:
                        errs.append(f"negative denominator: {latex}")
                    g = dc
                    common = {str(s) for s in dl}
                    for c, lets, _ in parts:
                        g = igcd(g, c)
                        common &= set(lets)
                    if g > 1 or common:
                        errs.append(f"fraction with letters not reduced: {latex}")
                else:
                    # a binomial denominator with letters (a - b): numerator must not contain it as a factor
                    q = (nv / dv).cancel()
                    if q.as_numer_denom()[1].expand() != dv and q.as_numer_denom()[1].expand() != -dv:
                        errs.append(f"fraction with a polynomial denominator not reduced: {latex}")
    # like radicals collected in the whole expression (outside fractions: numerator of the top fraction)
    top = tree[1] if tree[0] == "frac" else tree
    if top[0] == "add":
        seen = []
        for _, t in top[1]:
            p = outside_parts(t)
            if p is None:
                errs.append(f"term not a monomial: {latex}")
                continue
            key = (tuple(sorted(p[1].items())), p[2])
            if key in seen:
                errs.append(f"like terms not collected: {latex}")
            seen.append(key)
    return errs


# ---------------------------------------------------------------------------
# Problem structure: level and case, recomputed from the problem


def split_problem(problem):
    parts = re.split(r"\s*\\quad\s*", problem)
    return parts[0], parts[1:]


def mono_radicand(node):
    """Denominator k·root_n(R) or root_n(R): (k, n, R expression)."""
    if node[0] == "root":
        return 1, node[1], value(node[2])
    if node[0] == "mul" and len(node[1]) == 2 and node[1][0][0] == "num" and node[1][1][0] == "root":
        return node[1][0][1], node[1][1][1], value(node[1][1][2])
    return None


def binomial_terms(node):
    """Two terms of a binomial denominator: [(integer coefficient, radicand)], radicand 1 for a number."""
    if node[0] != "add" or len(node[1]) != 2:
        return None
    out = []
    for s, t in node[1]:
        v = value(t)
        c, rest = v.as_coeff_Mul()
        if rest == 1:
            out.append((s * int(c), 1))
        else:
            b, k = rest.as_base_exp()
            if k != Rational(1, 2):
                return None
            out.append((s * int(c), b))
    return out


def classify(level, problem):
    """(errors, case) from the problem's shape."""
    errs = []
    main, conds = split_problem(problem)
    tree = parse(main)
    if tree[0] != "frac":
        return [f"problem is not a fraction: {problem}"], None
    num, den = tree[1], tree[2]
    nv, dv = value(num), value(den)
    letters = bool((nv + dv).free_symbols)
    case = None
    if level <= 4:
        md = mono_radicand(den)
        if md is None:
            return [f"denominator is not k·root: {problem}"], None
        k, n, R = md
        if has_root(num):
            errs.append("radical in the numerator at levels 1-4")
        if R.is_Integer:
            f = factorint(int(R))
            exps = list(f.values())
            takes_out = any(e >= n for e in exps)
        else:
            mp = monomial_parts(R.expand())
            if mp is None:
                return [f"radicand {R} not a monomial"], None
            c, lets = mp
            f = factorint(c)
            exps = list(f.values()) + list(lets.values())
            takes_out = any(e >= n for e in exps)
        g = n
        for e in exps:
            g = igcd(g, e)
        if g > 1:
            errs.append(f"reducible index in the problem: {problem}")
        if level == 1:
            case = "numero davanti" if k > 1 else "radice sola"
            if n != 2 or takes_out or letters:
                errs.append("level 1: square root, square-free number")
            if nv > 30 or k > 5:
                errs.append("level 1: numbers too big")
        elif level == 2:
            if n != 2 or k != 1:
                errs.append("level 2: square root alone")
            if letters:
                case = "lettere"
            else:
                case = "radicando da semplificare"
                if not takes_out:
                    errs.append("level 2: nothing to take out of the radical")
                if R > 200:
                    errs.append(f"level 2: radicand {R} > 200")
        elif level == 3:
            if letters or k != 1 or not R.is_Integer or len(factorint(int(R))) != 1 or n not in (3, 4, 5) or takes_out:
                errs.append(f"level 3: b over the n-th root of a prime power, n from 3 to 5: {problem}")
            case = f"indice {n}"
            if R.is_Integer and R > 250:
                errs.append("level 3: radicand > 250")
        else:
            if n not in (3, 4, 5) or k != 1 or takes_out:
                errs.append(f"level 4: index 3 to 5, nothing to take out: {problem}")
            if letters:
                case = "lettere"
            else:
                case = "due fattori primi"
                if len(factorint(int(R))) != 2 or R > 400:
                    errs.append(f"level 4: two prime factors, radicand up to 400: {problem}")
        if conds:
            errs.append("conditions at levels 1-4")
        return errs, case
    bt = binomial_terms(den)
    if level in (5, 6):
        if letters or bt is None:
            return [f"level {level}: numeric binomial denominator: {problem}"], None
        (c1, r1), (c2, r2) = bt
        D = c1**2 * r1 - c2**2 * r2
        if D == 0:
            errs.append("denominator zero")
        num_radical = has_root(num)
        coef = any(r != 1 and abs(c) > 1 for c, r in bt)
        if level == 5:
            if D <= 0 or coef or num_radical or not nv.is_Integer:
                errs.append(f"level 5: integer over a ± √b or √a ± √b, positive after the product: {problem}")
            case = "due radicali" if r1 != 1 and r2 != 1 else "numero e radicale"
        else:
            kinds = [bool(coef), bool(D < 0), bool(num_radical)]
            if sum(kinds) != 1:
                errs.append(f"level 6: exactly one awkward feature, found {kinds}: {problem}")
            case = ["coefficiente davanti al radicale", "denominatore negativo", "radicale al numeratore"][kinds.index(True)] if any(kinds) else None
        if abs(D) > 30:
            errs.append(f"|a² - b| = {abs(D)} > 30")
        return errs, case
    # level 7: letters and a binomial with a square root
    if not letters or not has_root(den) or den[0] != "add":
        errs.append(f"level 7: binomial with letters: {problem}")
    case = None
    txt = main
    if re.search(r"\\sqrt\{[a-z] \+ \d+\}", txt):
        case = "cx/(√(x+k²) ∓ k)"
    elif re.fullmatch(r"\\frac\{[a-z] - \d+\}.*", txt):
        case = "(x-k²)/(√x ∓ k)"
    elif re.search(r"\\sqrt\{[a-z]\} [+-] \\sqrt\{[a-z]\}", txt):
        case = "(a-b)/(√a ∓ √b)" if num[0] in ("add", "mul") else "c/(√a ∓ √b)"
    else:
        case = "c/(√x ∓ k)"
    # a denominator that can vanish for positive letters needs its condition written next to it
    vanish = cond_needed(case, dv)
    if vanish is not None and vanish not in [c.replace(" ", "") for c in conds]:
        errs.append(f"missing condition {vanish}: {problem}")
    return errs, case


def cond_needed(case, dv):
    """The condition that must be written: the rationalised denominator is zero there, or None."""
    syms = sorted(dv.free_symbols, key=str)
    if len(syms) != (2 if case in ("(a-b)/(√a ∓ √b)", "c/(√a ∓ √b)") else 1):
        return "letters of the denominator do not match the model"
    if case in ("(a-b)/(√a ∓ √b)", "c/(√a ∓ √b)"):
        u, w = syms
        # c/(√a + √b) never vanishes, but its rationalised form (a - b) does: the condition is written anyway
        if case == "(a-b)/(√a ∓ √b)" and dv.subs(u, w) != 0:
            return None
        return f"{u}\\neq{w}"
    if case == "(x-k²)/(√x ∓ k)":
        (u,) = syms
        c, _ = dv.as_independent(u)
        return f"{u}\\neq{c**2}" if c < 0 else None
    if case == "c/(√x ∓ k)":
        (u,) = syms
        c, _ = dv.as_independent(u)
        return f"{u}\\neq{c**2}"
    return None


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    lvl = sample["level"]
    problem = sample["problem"]
    try:
        cerrs, case = classify(lvl, problem)
    except ParseError as e:
        return [f"problem unreadable: {e}"], None
    errs += cerrs
    if sample["params"].get("case") != case:
        errs.append(f"params.case {sample['params'].get('case')!r}, the problem is {case!r}")
    main, _ = split_problem(problem)
    truth = value(parse(main))
    letters = bool(truth.free_symbols)
    want_prompt = "Le lettere indicano numeri positivi" in sample.get("prompt", "")
    if letters != want_prompt:
        errs.append("prompt must say the letters are positive exactly when there are letters")

    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "rationalized":
        errs.append("answer must be an expression with form 'rationalized'")
        return errs, case
    try:
        av = sympify(ans["value"], locals=LETTERS)
    except Exception as e:  # noqa: BLE001
        return errs + [f"answer value unreadable: {e}"], case
    if not equal(av, truth):
        errs.append(f"answer {ans['value']} != problem {truth}")
    try:
        if not equal(value(parse(ans["latex"])), av):
            errs.append(f"answer latex {ans['latex']} != value {ans['value']}")
    except ParseError as e:
        errs.append(f"answer latex unreadable: {e}")
    errs += form_errors(ans["latex"])
    # nice numbers: the denominator of the result and its coefficients stay small
    for nums in re.findall(r"\d+", ans["latex"]):
        if int(nums) > 400:
            errs.append(f"number {nums} too big in the answer")
    sol = sample.get("solution", "")
    if not sol.endswith(ans["latex"]):
        errs.append("solution does not end with the answer")

    errs += check_steps(sample)
    errs += check_choice(sample, truth)
    return errs, case


STEP_TEXT = re.compile(r"\\text\{[^{}]*\}")


def check_steps(sample):
    """Every chain A = B = C of pure maths in the steps (between the words) must be true."""
    errs = []
    steps = sample.get("steps") or []
    if not steps:
        return ["no steps"]
    for st in steps:
        for piece in STEP_TEXT.split(st):
            piece = piece.strip().rstrip(",.")
            if "=" not in piece:
                continue
            sides = [s.strip() for s in piece.split("=")]
            if any(not s for s in sides):
                continue
            try:
                vals = [value(parse(s)) for s in sides]
            except (ParseError, ValueError, KeyError):
                errs.append(f"step does not parse: {piece}")
                continue
            for a, b in zip(vals, vals[1:]):
                if not equal(a, b):
                    errs.append(f"step with unequal members: {piece}")
                    break
    return errs


def check_choice(sample, truth):
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    right, same_value_wrong_form, vals, latexes = [], 0, [], []
    for i, o in enumerate(opts):
        lt = o.get("latex", "")
        latexes.append(lt)
        if len(o.get("values", [])) != 1:
            errs.append(f"option without exactly one value: {o}")
            vals.append(None)
            continue
        try:
            v = value(parse(lt))
        except ParseError as e:
            errs.append(f"option unreadable ({e}): {lt}")
            vals.append(None)
            continue
        try:
            given = sympify(o["values"][0], locals=LETTERS)
        except Exception as e:  # noqa: BLE001
            errs.append(f"option value unreadable: {e}")
            vals.append(None)
            continue
        if not equal(v, given):
            errs.append(f"option latex {lt} != value {o['values'][0]}")
        vals.append(v)
        if equal(v, truth):
            if form_errors(lt):
                same_value_wrong_form += 1
            else:
                right.append(i)
    if len(set(latexes)) != len(latexes):
        errs.append(f"options not distinct: {latexes}")
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            if vals[i] is not None and vals[j] is not None and equal(vals[i], vals[j]):
                if not (equal(vals[i], truth)):
                    errs.append(f"two wrong options with the same value: {latexes[i]}, {latexes[j]}")
    if same_value_wrong_form > 1:
        errs.append("more than one option with the right value in the wrong form")
    if len(right) != 1:
        errs.append(f"{len(right)} right options: {latexes}")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} but the right option is {right[0]}")
    return errs
