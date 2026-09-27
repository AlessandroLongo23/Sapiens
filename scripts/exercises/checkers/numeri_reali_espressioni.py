"""Checker for numeri-reali-espressioni, from specs/exercises/numeri-reali-espressioni.md and lesson 75.

Written from the spec, not from the generator. The problem is read back from its LaTeX with a small
parser of its own (numbers, x, \\sqrt, \\sqrt[n], \\frac, parentheses, powers, \\cdot, ":" and
implicit products) into an exact SymPy expression; the answer is recomputed from that expression
(radsimp for levels 1-5, the linear equation or inequality solved for levels 6-7) and compared
exactly with answer.value, answer.values or the right option.

"Finished" form (the lesson's "Quando il risultato è finito"): an integer, or a sum of at most one
integer and radical terms k·ⁿ√R, or such a sum over an integer denominator d >= 2, with every
radicand free of n-th powers and not reducible to a smaller index, the radical terms all different,
no radical in a denominator, the numerator and d with no common factor, no coefficient 1 written.
The answer must be finished; in the multiple choice exactly one option is equal to the answer AND
finished. An option equal in value but not finished (√12 for 2√3, ⁶√128 for 2⁶√2) is a
distractor, and is reported as such.
"""
import re
from math import gcd

from sympy import Rational, Symbol, factorint, nsimplify, radsimp, root, sqrt, sympify
from sympy.core.cache import clear_cache

x = Symbol("x", real=True)

FORBIDDEN = [
    ("1x / 1sqrt", re.compile(r"(?<!\d)1\s*(?:x|\\sqrt)")),
    ("0x", re.compile(r"(?<!\d)0\s*x")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
    ("^{1}", re.compile(r"\^\{1\}|\^1(?!\d)")),
    ("zero term", re.compile(r"[+-]\s*0(?!\d)")),
]

CASE_RANGES = {
    1: {"quadratiche": (0.6, 0.9), "cubiche": (0.1, 0.4)},
    2: {"somma per differenza": (0.25, 0.55), "quadrato": (0.08, 0.35), "distributiva": (0.08, 0.35), "prodotto": (0.08, 0.35)},
    3: {"numeratore da dividere": (0.25, 0.55), "radicale e frazione": (0.15, 0.45), "binomio su monomio": (0.15, 0.45)},
    4: {"due frazioni": (0.2, 0.5), "frazione e termine": (0.2, 0.5), "binomio su binomio": (0.2, 0.5)},
    5: {"una base": (0.55, 0.85), "due basi": (0.15, 0.45)},
    6: {"radicali simili": (0.1, 0.4), "raccolto": (0.1, 0.35), "binomio": (0.4, 0.7)},
    7: {"coefficiente negativo": (0.4, 0.7), "coefficiente positivo": (0.3, 0.6)},
}

REL = {"=": "=", "<": "<", ">": ">", r"\le": "<=", r"\ge": ">="}


class ParseError(Exception):
    pass


# ---------------------------------------------------------------------------
# LaTeX -> SymPy

TOKEN = re.compile(r"\s*(\\sqrt|\\frac|\\cdot|\\left\(|\\right\)|\\le|\\ge|\\,|\d+|[x+\-()\[\]{}^:=<>])")


def tokenize(s):
    toks, i = [], 0
    s = s.strip()
    while i < len(s):
        m = TOKEN.match(s, i)
        if not m:
            raise ParseError(f"cannot read {s[i:i + 12]!r} in {s!r}")
        t = m.group(1)
        i = m.end()
        if t == r"\,":
            continue
        toks.append({"\\left(": "(", "\\right)": ")"}.get(t, t))
        while i < len(s) and s[i] == " ":
            i += 1
    return toks


class Parser:
    """expr := [+|-] term {(+|-) term}; term := factor {(\\cdot | : | juxtaposition) factor};
    factor := primary [^ int]; primary := int | x | \\sqrt[n]{expr} | \\frac{expr}{expr} | (expr) | {expr}.
    Records every radical (index, radicand) and every fraction denominator."""

    def __init__(self, s):
        self.t = tokenize(s)
        self.i = 0
        self.radicals = []
        self.dens = []

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else None

    def take(self, want=None):
        tok = self.peek()
        if tok is None or (want is not None and tok != want):
            raise ParseError(f"expected {want!r}, found {tok!r}")
        self.i += 1
        return tok

    def expr(self):
        sign = 1
        if self.peek() in ("+", "-"):
            sign = -1 if self.take() == "-" else 1
        v = sign * self.term()
        while self.peek() in ("+", "-"):
            op = self.take()
            t = self.term()
            v = v + t if op == "+" else v - t
        return v

    def term(self):
        v = self.factor()
        while True:
            tok = self.peek()
            if tok == r"\cdot":
                self.take()
                v = v * self.factor()
            elif tok == ":":
                self.take()
                v = v / self.factor()
            elif tok is not None and (tok.isdigit() or tok in ("x", r"\sqrt", r"\frac", "(", "{")):
                v = v * self.factor()
            else:
                return v

    def factor(self):
        v = self.primary()
        if self.peek() == "^":
            self.take()
            if self.peek() == "{":
                self.take()
                e = int(self.take())
                self.take("}")
            else:
                e = int(self.take())
            v = v**e
        return v

    def primary(self):
        tok = self.take()
        if tok.isdigit():
            return Rational(int(tok))
        if tok == "x":
            return x
        if tok == r"\sqrt":
            n = 2
            if self.peek() == "[":
                self.take()
                n = int(self.take())
                self.take("]")
            self.take("{")
            inner = self.expr()
            self.take("}")
            self.radicals.append((n, inner))
            return sqrt(inner) if n == 2 else root(inner, n)
        if tok == r"\frac":
            self.take("{")
            a = self.expr()
            self.take("}")
            start = self.i
            self.take("{")
            b = self.expr()
            self.take("}")
            self.dens.append((b, self.t[start + 1:self.i - 1]))
            return a / b
        if tok in ("(", "{"):
            v = self.expr()
            self.take(")" if tok == "(" else "}")
            return v
        raise ParseError(f"unexpected {tok!r}")


def parse(s):
    p = Parser(s)
    v = p.expr()
    if p.peek() is not None:
        raise ParseError(f"trailing {p.t[p.i:]} in {s!r}")
    return v, p


def parse_relation(s):
    """lhs REL rhs -> (lhs, rel, rhs, parsers)."""
    toks = tokenize(s)
    idx = [i for i, t in enumerate(toks) if t in ("=", "<", ">", r"\le", r"\ge")]
    if len(idx) != 1:
        raise ParseError(f"need exactly one relation in {s!r}")
    # split the source string at the relation symbol
    m = re.fullmatch(r"(.+?)\s*(=|<|>|\\le|\\ge)\s*(.+)", s.strip())
    if not m:
        raise ParseError(f"cannot split {s!r}")
    lv, lp = parse(m.group(1))
    rv, rp = parse(m.group(3))
    return lv, REL[m.group(2)], rv, (lp, rp)


def canon(v):
    return nsimplify(radsimp(v)) if v.is_number and v.is_rational else radsimp(v).expand()


def same(a, b):
    d = radsimp(a - b)
    if d == 0:
        return True
    try:
        return abs(float(d.evalf(50))) < 1e-30 and d.equals(0)
    except TypeError:
        return False


def value_str(s):
    if not isinstance(s, str) or not re.fullmatch(r"[0-9+\-*/() sqrt]+", s):
        raise ParseError(f"not an exact value string: {s!r}")
    return sympify(s)


# ---------------------------------------------------------------------------
# Finished form

TERM = re.compile(r"([+-]?)(\d*)(?:\\sqrt(?:\[(\d+)\])?\{(\d+)\})?")


def radical_errors(n, R):
    errs = []
    if n < 2 or R < 2:
        errs.append(f"radical index {n}, radicand {R}")
        return errs
    f = factorint(R)
    if any(e >= n for e in f.values()):
        errs.append(f"radicand {R} has an {n}-th power factor")
    g = n
    for e in f.values():
        g = gcd(g, e)
    if g > 1:
        errs.append(f"index {n} of radicand {R} can be reduced")
    return errs


def core(R, n):
    """R without its n-th power factors: the radicand after carrying the factors out."""
    c = 1
    for p, e in factorint(R).items():
        c *= p ** (e % n)
    return c


def finished_errors(tex):
    """Empty if tex is a finished result as the lesson defines it."""
    s = re.sub(r"\s+", "", tex)
    m = re.fullmatch(r"(-?)\\frac\{(.+)\}\{(\d+)\}", s)
    if m:
        num, den = m.group(2), int(m.group(3))
        if den < 2:
            return [f"denominator {den}"]
        if m.group(1) and num.startswith("-"):
            return ["two minus signs"]
    else:
        num, den = s, 1
    if "\\frac" in num:
        return [f"nested or non-integer fraction: {tex}"]
    pos, terms = 0, []
    while pos < len(num):
        t = TERM.match(num, pos)
        if not t or t.end() == pos or (pos > 0 and not t.group(1)):
            return [f"not a sum of terms k·root: {tex}"]
        sign, k, n, R = t.groups()
        if not k and not R:
            return [f"empty term in {tex}"]
        if k in ("0",) or (k and k.startswith("0")):
            return [f"zero coefficient in {tex}"]
        if k == "1" and R:
            return [f"coefficient 1 written in {tex}"]
        terms.append((int(k) if k else 1, int(n) if n else (2 if R else 0), int(R) if R else 0))
        pos = t.end()
    errs = []
    if sum(1 for _, n, _ in terms if n == 0) > 1:
        errs.append(f"two rational terms in {tex}")
    rads = [(n, R) for _, n, R in terms if n]
    if len(set(rads)) != len(rads):
        errs.append(f"similar radicals not added in {tex}")
    for n, R in rads:
        errs += radical_errors(n, R)
    if den > 1:
        g = den
        for k, _, _ in terms:
            g = gcd(g, k)
        if g > 1:
            errs.append(f"fraction not reduced in {tex}")
    return errs


def value_of(tex):
    v, _ = parse(tex)
    return v


# ---------------------------------------------------------------------------
# The problem

def problem_value(sample):
    """Value (levels 1-5), or (coefficient A, constant C, relation) of A x REL C (levels 6-7)."""
    prob = sample["problem"]
    if sample["level"] <= 5:
        v, p = parse(prob)
        if v.has(x):
            raise ParseError("x in an expression")
        return v, p
    lv, rel, rv, ps = parse_relation(prob)
    e = (lv - rv).expand()
    A = radsimp(e.coeff(x, 1))
    C = radsimp(-e.coeff(x, 0))
    if (e - A * x + C).expand().simplify() != 0:
        raise ParseError("not linear in x")
    return (A, C, rel), ps


def dens_of(parser):
    return [d for d, _ in parser.dens]


def level_errors(sample, parser, info):
    lvl = sample["level"]
    prob = sample["problem"]
    errs = []
    kind = None
    rads = parser.radicals if not isinstance(parser, tuple) else parser[0].radicals + parser[1].radicals
    if lvl == 1:
        idx = {n for n, _ in rads}
        if len(idx) != 1:
            errs.append("level 1: all radicals must have the same index")
        n = idx.pop() if idx else 2
        kind = "cubiche" if n == 3 else "quadratiche"
        if not 2 <= len(rads) <= 4:
            errs.append(f"level 1: {len(rads)} radicals")
        unsimpl = [R for _, R in rads if radical_errors(n, int(R))]
        if len(unsimpl) < 2:
            errs.append("level 1: at least two radicals to simplify")
        if any(int(R) > (250 if n == 3 else 200) for _, R in rads):
            errs.append("level 1: radicand too large")
        if parser.dens:
            errs.append("level 1: no fractions")
        cores = {core(int(R), n) for _, R in rads}
        if len(cores) != 1:
            errs.append("level 1: radicals must become similar")
    elif lvl == 2:
        if parser.dens or any(n != 2 for n, _ in rads):
            errs.append("level 2: square roots only, no fractions")
        if len({R for _, R in rads}) != 1:
            errs.append("level 2: one radicand")
        if "^2" not in prob:
            errs.append("level 2: needs the square of a binomial")
        # kind from the second product (after the top-level operator following the first square)
        second = prob.split(")^2", 1)[1][3:]
        if second.startswith("(") and second.endswith(")^2"):
            kind = "quadrato"
        elif not second.startswith("("):
            kind = "distributiva"
        else:
            a, b = re.fullmatch(r"\((.+)\)\((.+)\)", second).groups()
            kind = "somma per differenza" if radsimp((value_of(a) * value_of(b)).expand()).is_rational else "prodotto"
    elif lvl in (3, 4):
        dens = parser.dens
        if not dens:
            errs.append(f"level {lvl}: needs a fraction")
        radical_dens = [d for d, toks in dens if not d.is_rational]
        binomial = [d for d, toks in dens if not d.is_rational and ("+" in toks or "-" in toks)]
        if lvl == 3:
            if not radical_dens or binomial:
                errs.append("level 3: a monomial radical denominator and no binomial one")
            if len(dens) == 2:
                kind = "numeratore da dividere"
            elif re.search(r"\\frac\{\d+\}", prob):
                kind = "radicale e frazione"
            else:
                kind = "binomio su monomio"
        else:
            if not binomial:
                errs.append("level 4: needs a binomial denominator with a radical")
            if len(dens) == 2:
                kind = "due frazioni"
            elif re.fullmatch(r"\\frac\{\d+\}\{[^{}]*\\sqrt\{\d+\}[^{}]*\}.*", prob):
                kind = "frazione e termine"
            else:
                kind = "binomio su binomio"
    elif lvl == 5:
        idx = [n for n, _ in rads]
        if len(set(idx)) < 2 or not 2 <= len(idx) <= 3 or any(n not in (2, 3, 4, 6) for n in idx):
            errs.append(f"level 5: indices {idx}")
        primes = set()
        for n, R in rads:
            f = factorint(int(R))
            if len(f) != 1 or int(R) > 250:
                errs.append(f"level 5: radicand {R} is not a small prime power")
            primes |= set(f)
            if radical_errors(n, int(R)):
                errs.append(f"level 5: radical {n},{R} not simplified in the text")
        kind = "due basi" if len(primes) == 2 else "una base"
    elif lvl in (6, 7):
        A, C, rel = info
        if A.is_rational:
            errs.append(f"level {lvl}: coefficient of x must be irrational, got {A}")
        if A == 0:
            errs.append("coefficient zero")
        if lvl == 6:
            if rel != "=":
                errs.append("level 6: an equation")
            a0, b0 = radsimp(A).as_coeff_Add()
            if prob.startswith("("):
                kind = "raccolto"
            elif a0 == 0:
                kind = "radicali simili"
            else:
                kind = "binomio"
        else:
            if rel == "=":
                errs.append("level 7: an inequality")
            kind = "coefficiente negativo" if A.is_negative else "coefficiente positivo"
            # a difference: the sign has to be found
            a0, b0 = radsimp(A).as_coeff_Add()
            if a0 == 0 or (a0 > 0) == (b0.is_positive):
                errs.append(f"level 7: coefficient {A} must be a difference like k√r − m")
    return errs, kind


# ---------------------------------------------------------------------------

def nice_errors(tex, max_den, max_coef, what):
    """A finished result (a + b·√r)/d with d <= max_den and |a|, |b| <= max_coef, read from its LaTeX."""
    t = re.sub(r"\s+", "", tex)
    m = re.fullmatch(r"-?\\frac\{(.+)\}\{(\d+)\}", t)
    num, den = (m.group(1), int(m.group(2))) if m else (t, 1)
    if den > max_den:
        return [f"{what}: denominator {den} > {max_den}"]
    coefs = [int(g.group(2)) if g.group(2) else 1 for g in TERM.finditer(num) if g.group(0)]
    if any(c > max_coef for c in coefs):
        return [f"{what}: coefficients of {tex} too large"]
    return []


_CALLS = [0]


def check(sample):
    # SymPy's cache grows with every radical seen; 7,000 samples in one process run out of memory.
    _CALLS[0] += 1
    if _CALLS[0] % 100 == 0:
        clear_cache()
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    for name, rx in FORBIDDEN:
        if rx.search(prob):
            errs.append(f"problem contains forbidden '{name}': {prob}")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("steps or solution missing")
    try:
        info, parser = problem_value(sample)
    except (ParseError, ValueError) as e:
        return errs + [f"problem unreadable: {e}"], None
    lerrs, kind = level_errors(sample, parser, info)
    errs += lerrs
    if kind != sample.get("params", {}).get("case"):
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the problem is {kind!r}")
    ans = sample["answer"]

    if lvl <= 5:
        truth = radsimp(info)
        if truth == 0:
            errs.append("answer is 0")
        if ans.get("kind") != "expression":
            return errs + ["answer.kind must be expression"], kind
        want_form = "rationalized" if lvl in (3, 4) else "simplified"
        if ans.get("form") != want_form:
            errs.append(f"form {ans.get('form')} != {want_form}")
        if not same(value_str(ans["value"]), truth):
            errs.append(f"answer.value {ans['value']} != {truth}")
        try:
            if not same(value_of(ans["latex"]), truth):
                errs.append(f"answer.latex {ans['latex']} != {truth}")
        except ParseError as e:
            errs.append(f"answer.latex unreadable: {e}")
        fe = finished_errors(ans["latex"])
        if fe:
            errs.append(f"answer not finished: {fe}")
        if lvl in (2, 3, 4):
            errs += nice_errors(ans["latex"], {2: 1, 3: 6, 4: 6}[lvl], {2: 80, 3: 30, 4: 40}[lvl], "answer")
        if lvl == 1 and abs(truth.as_coeff_Mul()[0]) > 15:
            errs.append("level 1: coefficient > 15")
        if lvl == 5:
            m = re.fullmatch(r"(\d*)(?:\\sqrt(?:\[(\d+)\])?\{(\d+)\})?", ans["latex"])
            if not m or (m.group(1) and int(m.group(1)) > 30) or (m.group(3) and int(m.group(3)) > 1000):
                errs.append(f"level 5: answer {ans['latex']} out of range")
        choice_truth = ("value", truth)
    elif lvl == 6:
        A, C, rel = info
        truth = radsimp(C / A)
        if ans.get("kind") != "set" or len(ans.get("values", [])) != 1:
            return errs + ["answer must be a set with one value"], kind
        if not same(value_str(ans["values"][0]), truth):
            errs.append(f"answer {ans['values']} != {truth}")
        m = re.fullmatch(r"S = \\left\\\{ (.+) \\right\\\}", ans.get("latex", ""))
        if not m or not same(value_of(m.group(1)), truth) or finished_errors(m.group(1)):
            errs.append(f"answer.latex {ans.get('latex')} wrong or not finished")
        errs += nice_errors(m.group(1) if m else "", 4, 30, "solution")
        choice_truth = ("x =", truth)
    else:
        A, C, rel = info
        bound = radsimp(C / A)
        rel2 = rel if A.is_positive else {"<": ">", ">": "<", "<=": ">=", ">=": "<="}[rel]
        if ans.get("kind") != "choice":
            return errs + ["level 7 answer must be a choice"], kind
        choice_truth = ("rel", (rel2, bound))

    ch = ans if lvl == 7 else sample.get("choice")
    if ch is None:
        errs.append("no multiple-choice variant")
    else:
        errs += choice_errors(ch, choice_truth)
        if lvl == 7 and isinstance(ch.get("correct"), int) and 0 <= ch["correct"] < len(ch.get("options", [])):
            m = re.fullmatch(r"x \S+ (.+)", ch["options"][ch["correct"]]["latex"])
            errs += nice_errors(m.group(1) if m else "", 4, 30, "bound")
    return errs, kind


UNFINISHED = []


def option_meaning(latex, mode):
    """(relation, value, finished) of an option."""
    if mode == "value":
        return None, value_of(latex), not finished_errors(latex)
    if mode == "x =":
        m = re.fullmatch(r"x = (.+)", latex)
        if not m:
            raise ParseError(f"option {latex!r} is not 'x = ...'")
        return "=", value_of(m.group(1)), not finished_errors(m.group(1))
    m = re.fullmatch(r"x (<|>|\\le|\\ge) (.+)", latex)
    if not m:
        raise ParseError(f"option {latex!r} is not 'x REL ...'")
    return REL[m.group(1)], value_of(m.group(2)), not finished_errors(m.group(2))


def choice_errors(ch, truth):
    errs = []
    mode, t = truth
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("two options with the same text")
    right = []
    seen = []
    for i, o in enumerate(opts):
        try:
            rel, v, fin = option_meaning(o["latex"], mode)
        except ParseError as e:
            errs.append(str(e))
            continue
        # the option's own values must say the same thing as its text
        vals = o.get("values", [])
        try:
            if mode == "rel":
                if vals[0] != rel or not same(value_str(vals[1]), v):
                    errs.append(f"option values {vals} != text {o['latex']}")
            elif not same(value_str(vals[0]), v):
                errs.append(f"option values {vals} != text {o['latex']}")
        except (ParseError, IndexError, ValueError) as e:
            errs.append(f"option values unreadable: {vals} ({e})")
        key = (rel, radsimp(v), fin)
        if any(k[0] == key[0] and k[2] == key[2] and same(k[1], key[1]) for k in seen):
            errs.append(f"two options mean the same: {o['latex']}")
        seen.append(key)
        if mode == "rel":
            ok = rel == t[0] and same(v, t[1]) and fin
            eq = ok
        else:
            eq = same(v, t)
            ok = eq and fin
        if ok:
            right.append(i)
        elif eq:
            UNFINISHED.append(o["latex"])
    if len(right) != 1:
        errs.append(f"{len(right)} right options: {[o['latex'] for o in opts]}")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} but the right option is {right[0]}")
    return errs
