"""Shared helpers for the monomial checkers (monomi-grado, monomi-operazioni, monomi-mcm-mcd,
monomi-espressioni). Not a checker itself: no generator has the id "monomi-common".

The heart is a small parser from the LaTeX the student sees to an exact SymPy expression,
written from the textbook conventions and not from the generator code:

- a monomial written without parentheses is one factor: "12x^5 : 3x^2 \\cdot 2x" is
  (12x^5 : 3x^2) * 2x (juxtaposition binds tighter than \\cdot and :);
- \\cdot and : have the same precedence and go from left to right;
- ^ applies to the atom right before it; "^3" takes one digit, "^{...}" a whole expression;
- ( ), [ ], \\{ \\} group, with or without \\left \\right.

So every checker recomputes the answer from the problem text itself, and the answer and each
choice option are also parsed back from their LaTeX and compared with their SymPy value.
"""
import re

from sympy import Integer, Poly, Rational, Symbol, cancel, igcd, sympify

SYMS = {ch: Symbol(ch) for ch in "abcdefghijklmnopqrstuvwxyz"}


class ParseError(Exception):
    pass


def tokenize(s):
    toks = []
    i = 0
    while i < len(s):
        ch = s[i]
        if ch.isspace():
            i += 1
            continue
        if ch == "\\":
            m = re.match(r"\\([a-zA-Z]+|.)", s[i:])
            if not m:
                raise ParseError("dangling backslash")
            name = m.group(1)
            i += len(m.group(0))
            if name in ("left", "right", ",", ";", "!", " ", "quad", "qquad"):
                continue
            if name in ("{", "}"):
                toks.append("\\" + name)
            elif name in ("frac", "cdot"):
                toks.append("\\" + name)
            else:
                raise ParseError(f"unsupported command \\{name}")
            continue
        if ch.isdigit():
            if toks and toks[-1] == "^":
                toks.append(ch)
                i += 1
                continue
            j = i
            while j < len(s) and s[j].isdigit():
                j += 1
            toks.append(s[i:j])
            i = j
            continue
        if "a" <= ch <= "z" or ch in "()[]{}^+-:=":
            toks.append(ch)
            i += 1
            continue
        raise ParseError(f"unexpected character {ch!r}")
    return toks


CLOSE = {"(": ")", "[": "]", "\\{": "\\}"}


class _Parser:
    def __init__(self, toks, strict=False):
        self.t = toks
        self.i = 0
        # strict: every bracket and every quotient must give a nonzero monomial (espressioni)
        self.strict = strict
        self.issues = []

    def need_monomial(self, v, what):
        if self.strict and not is_monomial(v):
            self.issues.append(f"{what} is not a nonzero monomial: {v}")

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else None

    def eat(self, want=None):
        tok = self.peek()
        if tok is None or (want is not None and tok != want):
            raise ParseError(f"expected {want!r}, found {tok!r}")
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
        v = self.juxt()
        while self.peek() in ("\\cdot", ":"):
            op = self.eat()
            f = self.juxt()
            if op == ":":
                if f == 0:
                    raise ParseError("division by zero")
                v = v / f
                self.need_monomial(v, "quotient")
            else:
                v = v * f
        return v

    def starts_atom(self, tok):
        return tok is not None and (tok.isdigit() or ("a" <= tok <= "z" and len(tok) == 1) or tok in ("(", "[", "\\{", "\\frac"))

    def juxt(self):
        v = self.power()
        while self.starts_atom(self.peek()):
            if self.peek().isdigit() or self.peek() == "\\frac":
                raise ParseError("a number cannot follow another factor without an operator")
            v = v * self.power()
        return v

    def power(self):
        b = self.atom()
        if self.peek() == "^":
            self.eat()
            if self.peek() == "{":
                self.eat()
                e = self.expr()
                self.eat("}")
            else:
                tok = self.eat()
                if not tok.isdigit():
                    raise ParseError(f"bad exponent {tok!r}")
                e = Integer(tok)
            if not (e.is_Integer and e >= 0):
                raise ParseError(f"exponent {e} is not a natural number")
            b = b**e
        return b

    def atom(self):
        tok = self.peek()
        if tok is None:
            raise ParseError("unexpected end")
        if tok.isdigit():
            self.eat()
            return Integer(tok)
        if len(tok) == 1 and "a" <= tok <= "z":
            self.eat()
            return SYMS[tok]
        if tok == "\\frac":
            self.eat()
            self.eat("{")
            n = self.expr()
            self.eat("}")
            self.eat("{")
            d = self.expr()
            self.eat("}")
            if d == 0:
                raise ParseError("zero denominator")
            return n / d
        if tok in CLOSE:
            self.eat()
            v = self.expr()
            self.eat(CLOSE[tok])
            self.need_monomial(v, f"bracket {tok}")
            return v
        raise ParseError(f"unexpected token {tok!r}")


def parse_tokens(toks):
    p = _Parser(toks)
    v = p.expr()
    if p.peek() is not None:
        raise ParseError(f"trailing token {p.peek()!r}")
    return v


def parse(latex):
    """LaTeX of an expression with monomials -> exact SymPy expression."""
    return parse_tokens(tokenize(latex))


def parse_strict(latex):
    """Like parse, and also lists the brackets, quotients and whole expression whose value is not
    a nonzero monomial (in an expression with monomials every intermediate result is one)."""
    p = _Parser(tokenize(latex), strict=True)
    v = p.expr()
    if p.peek() is not None:
        raise ParseError(f"trailing token {p.peek()!r}")
    p.need_monomial(v, "result")
    return v, p.issues


def groups_with_sum(latex):
    """Number of brackets whose content is an algebraic sum (a binary + or - at their own depth)."""
    toks = tokenize(latex)
    stack = []
    count = 0
    prev = None
    for t in toks:
        if t in CLOSE:
            stack.append(False)
        elif t in (")", "]", "\\}"):
            if stack.pop():
                count += 1
        elif t in ("+", "-") and stack and prev not in CLOSE:
            stack[-1] = True
        prev = t
    return count


def parse_chain(latex):
    """"A = B = C" -> [A, B, C]."""
    toks = tokenize(latex)
    parts, cur = [], []
    for t in toks:
        if t == "=":
            parts.append(cur)
            cur = []
        else:
            cur.append(t)
    parts.append(cur)
    return [parse_tokens(p) for p in parts]


def val(s):
    """A SymPy value string from the sample, restricted to what a monomial or polynomial needs."""
    if not isinstance(s, str) or not re.fullmatch(r"[0-9a-z+\-*/() ]+", s):
        raise ValueError(f"not a simple expression string: {s!r}")
    return sympify(s, locals=SYMS)


def same(a, b):
    return cancel(a - b) == 0


def symbols_of(e):
    return sorted(e.free_symbols, key=lambda s: s.name)


def mono_parts(e):
    """(coefficient, {letter: exponent}) of a nonzero monomial, or None if e is not one."""
    e = cancel(e)
    if e == 0:
        return None
    if e.is_Rational:
        return Rational(e), {}
    syms = symbols_of(e)
    if not e.is_polynomial(*syms):
        return None
    P = Poly(e, *syms)
    terms = P.terms()
    if len(terms) != 1:
        return None
    monom, coeff = terms[0]
    if not coeff.is_Rational:
        return None
    return Rational(coeff), {s.name: k for s, k in zip(syms, monom) if k > 0}


def is_monomial(e):
    return mono_parts(e) is not None


FORBIDDEN = [
    ("1x", re.compile(r"(?<![\d}])1\s*[a-z]")),
    ("0x", re.compile(r"(?<![\d}])0\s*[a-z]")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
    ("^{1}", re.compile(r"\^\{1\}|\^1(?!\d)")),
    ("^{0}", re.compile(r"\^\{0\}|\^0(?!\d)")),
    ("zero term", re.compile(r"[+-]\s*0(?!\d)")),
    ("sign inside \\frac", re.compile(r"\\frac\{-")),
    ("1(", re.compile(r"(?<![\d}])1\s*\(")),
]


def forbidden(latex, where="problem"):
    return [f"{where} contains forbidden '{name}': {latex}" for name, rx in FORBIDDEN if rx.search(latex)]


_COEF = r"(?:\d+|\\frac\{\d+\}\{\d+\})"
_LIT = r"(?:[a-z](?:\^[2-9]|\^\{\d{2,}\})?)"
_MONO = re.compile(rf"(-?)({_COEF})?((?:{_LIT})*)")


def normal_form_errors(latex, where="answer"):
    """A monomial written in normal form: reduced coefficient first, no coefficient 1, letters in
    alphabetical order, each once."""
    m = _MONO.fullmatch(latex.strip())
    if not m:
        return [f"{where} is not a monomial in normal form: {latex}"]
    _, coef, lit = m.groups()
    errs = []
    if not coef and not lit:
        errs.append(f"{where} is empty")
    letters = re.findall(r"[a-z]", lit)
    if letters != sorted(letters) or len(set(letters)) != len(letters):
        errs.append(f"{where}: letters not in alphabetical order or repeated: {latex}")
    if coef:
        fm = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", coef)
        if fm:
            n, d = int(fm.group(1)), int(fm.group(2))
            if d < 2 or n == 0 or igcd(n, d) != 1:
                errs.append(f"{where}: fraction not reduced: {latex}")
        elif coef == "1" and lit:
            errs.append(f"{where}: explicit coefficient 1: {latex}")
        elif coef.startswith("0") and coef != "0":
            errs.append(f"{where}: leading zero: {latex}")
        elif coef == "0" and (lit or latex.strip() != "0"):
            errs.append(f"{where}: zero coefficient: {latex}")
    return errs


def poly_normal_form_errors(latex, where="answer"):
    """A sum of monomials in normal form, signs folded ("5ab - 3a"), no two similar terms."""
    s = latex.strip()
    parts = re.split(r"\s([+-])\s", s)
    terms = [parts[0]] + [("-" if parts[i] == "-" else "") + parts[i + 1] for i in range(1, len(parts), 2)]
    errs = []
    for t in terms:
        errs += normal_form_errors(t, where)
    if not errs and len(terms) > 1:
        lits = [re.sub(r"^-?" + _COEF + "?", "", t) for t in terms]
        if len(set(lits)) != len(lits):
            errs.append(f"{where}: similar terms not reduced: {latex}")
    return errs


def check_choice(sample, truth, number=False):
    """4 distinct options, exactly one equal to the truth, `correct` pointing at it; every option's
    LaTeX parses to its value and is written in normal form."""
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    vals = []
    for o in opts:
        if len(o.get("values", [])) != 1:
            errs.append(f"option without exactly one value: {o}")
            return errs
        v = val(o["values"][0])
        vals.append(v)
        lt = o.get("latex", "")
        if not lt:
            errs.append("option without latex")
            continue
        errs += forbidden(lt, "option")
        if number:
            if not (v.is_Integer and lt == str(v)):
                errs.append(f"numeric option {lt!r} / {v}")
        else:
            try:
                if not same(parse(lt), v):
                    errs.append(f"option latex {lt} != value {o['values'][0]}")
            except ParseError as e:
                errs.append(f"option latex does not parse ({e}): {lt}")
            errs += poly_normal_form_errors(lt, "option")
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            if same(vals[i], vals[j]):
                errs.append(f"choice options {i} and {j} are equal: {vals[i]}")
    matching = [i for i, v in enumerate(vals) if same(v, truth)]
    if len(matching) != 1:
        errs.append(f"{len(matching)} options equal the truth {truth}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not (0 <= idx < len(opts)) or not same(vals[idx], truth):
        errs.append(f"choice.correct {idx} does not point at the truth {truth}")
    return errs


_STEP = re.compile(r"^\\text\{[^{}]*\}\s*(.*)$", re.S)


def check_steps(sample, required=True):
    """Each step "\\text{label} A = B = C" with no other \\text is parsed, and all the members of
    each chain (separated by \\qquad) must be equal. Steps with more text are not parsed."""
    errs = []
    steps = sample.get("steps") or []
    if required and not steps:
        return ["no steps"]
    for st in steps:
        m = _STEP.match(st)
        body = m.group(1) if m else st
        if "\\text" in body or "=" not in body or body.lstrip().startswith("="):
            continue  # text in the middle, no equality, or a label such as "\\text{MCD} = 6x"
        for part in re.split(r"\\qquad", body):
            if "=" not in part:
                continue
            try:
                vals = parse_chain(part)
            except ParseError as e:
                errs.append(f"step does not parse ({e}): {part}")
                continue
            for a, b in zip(vals, vals[1:]):
                if not same(a, b):
                    errs.append(f"step with unequal members {a} != {b}: {part}")
                    break
    return errs


LEVEL = {"(": 1, "[": 2, "\\{": 3}


def bracket_errors(latex):
    """Round inside square inside curly: every bracket is one level above the highest one it
    contains. Returns the error list and the highest level used."""
    toks = tokenize(latex)
    stack = []  # [kind, max child level]
    top = 0
    errs = []
    for t in toks:
        if t in LEVEL:
            stack.append([t, 0])
        elif t in (")", "]", "\\}"):
            kind, inner = stack.pop()
            lvl = LEVEL[kind]
            if lvl != inner + 1:
                errs.append(f"bracket {kind} contains level {inner}: {latex}")
            top = max(top, lvl)
            if stack:
                stack[-1][1] = max(stack[-1][1], lvl)
    return errs, top
