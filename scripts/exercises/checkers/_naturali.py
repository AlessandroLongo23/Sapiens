"""Helpers for the checkers of the natural-number generators (operazioni, mcm-mcd, potenze).

Written independently of src/lib/exercises/v2/naturali.ts: a recursive-descent parser for the
expressions (from the problem LaTeX and from params), an evaluator in exact integers that refuses
anything outside N, and evaluators that reproduce the students' mistakes only where the spec
needs them. Trees are tuples:

    ("n", v) | ("op", o, l, r) | ("pow", b, e) | ("g", kind, c)     kind in "([{"
"""
import re

OPEN = {"(": ")", "[": "]", "{": "}"}
KIND_HEIGHT = {"(": 0, "[": 1, "{": 2}


class NotNatural(Exception):
    pass


def join_lines(tex):
    """An expression too wide for a phone comes as \\begin{aligned}&line \\\\ &\\quad line\\end{aligned}:
    the lines joined back into one, after checking that every line after the first begins with an
    operator (+, -, \\cdot or :), so a break never splits a number or a power."""
    m = re.fullmatch(r"\\begin\{aligned\}(.*)\\end\{aligned\}", tex.strip(), re.S)
    if not m:
        return tex
    lines = [ln.strip() for ln in m.group(1).split("\\\\")]
    if len(lines) < 2:
        raise ValueError(f"aligned expression with one line: {tex!r}")
    out = []
    for i, ln in enumerate(lines):
        if not ln.startswith("&"):
            raise ValueError(f"line {i + 1} without & in {tex!r}")
        ln = ln[1:].strip()
        if i:
            if not ln.startswith("\\quad"):
                raise ValueError(f"line {i + 1} without \\quad in {tex!r}")
            ln = ln[len("\\quad"):].strip()
            if not re.match(r"(\+|-|\\cdot|:)", ln):
                raise ValueError(f"line {i + 1} does not begin with an operator: {ln!r}")
        out.append(ln)
    return " ".join(out)


def latex_to_ascii(tex):
    """LaTeX of an expression in N (on one line or on several, see join_lines) to the compact ASCII
    used in params: * : ^( ) [ ] { }."""
    s = re.sub(r"\^\{([^{}]*)\}", r"^(\1)", join_lines(tex))
    s = s.replace("\\cdot", "*").replace("\\{", "{").replace("\\}", "}").replace("\\,", "")
    s = s.replace(" ", "")
    if re.search(r"[^0-9+\-*:^()\[\]{}=]", s):
        raise ValueError(f"unexpected characters in {tex!r}")
    return s


def parse(s):
    pos = [0]

    def peek():
        return s[pos[0]] if pos[0] < len(s) else ""

    def take():
        c = s[pos[0]]
        pos[0] += 1
        return c

    def expr():
        x = term()
        while peek() in ("+", "-"):
            o = take()
            x = ("op", o, x, term())
        return x

    def term():
        x = factor()
        while peek() in ("*", ":"):
            o = take()
            x = ("op", o, x, factor())
        return x

    def factor():
        b = primary()
        if peek() == "^":
            take()
            if peek() == "(":
                take()
                e = expr()
                if take() != ")":
                    raise ValueError("missing ) in exponent")
            else:
                d = take()
                if not d.isdigit():
                    raise ValueError("bad exponent")
                e = ("n", int(d))
            return ("pow", b, e)
        return b

    def primary():
        c = peek()
        if c in OPEN:
            take()
            inner = expr()
            if take() != OPEN[c]:
                raise ValueError(f"unbalanced {c} in {s}")
            return ("g", c, inner)
        m = re.match(r"\d+", s[pos[0]:])
        if not m:
            raise ValueError(f"unexpected {c!r} at {pos[0]} in {s}")
        pos[0] += len(m.group())
        return ("n", int(m.group()))

    x = expr()
    if pos[0] != len(s):
        raise ValueError(f"trailing text in {s}")
    return x


def apply(o, a, b):
    if o == "+":
        return a + b
    if o == "-":
        if a < b:
            raise NotNatural(f"{a} - {b}")
        return a - b
    if o == "*":
        return a * b
    if o == ":":
        if b == 0 or a % b:
            raise NotNatural(f"{a} : {b}")
        return a // b
    raise ValueError(o)


def power(b, e):
    if b == 0 and e == 0:
        raise NotNatural("0^0")
    if e > 64:
        raise NotNatural("exponent too large")
    return b**e


def evaluate(x, ops=None):
    """Value in N with the usual rules; `ops` collects (op, a, b, result) for every operation."""
    t = x[0]
    if t == "n":
        return x[1]
    if t == "g":
        return evaluate(x[2], ops)
    if t == "pow":
        b, e = evaluate(x[1], ops), evaluate(x[2], None)
        r = power(b, e)
        if ops is not None:
            ops.append(("^", b, e, r))
        return r
    a, b = evaluate(x[2], ops), evaluate(x[3], ops)
    r = apply(x[1], a, b)
    if ops is not None:
        ops.append((x[1], a, b, r))
    return r


def value_or_none(f, *args):
    try:
        return f(*args)
    except NotNatural:
        return None


def left_to_right(x, drop_brackets=False):
    """The mistakes: every run of operations done left to right ignoring priorities
    (drop_brackets=False), or the usual priorities with the brackets removed (drop_brackets=True)."""

    def flat(y, vals, ops):
        if y[0] == "op":
            flat(y[2], vals, ops)
            ops.append(y[1])
            flat(y[3], vals, ops)
        elif y[0] == "g" and drop_brackets:
            flat(y[2], vals, ops)
        else:
            vals.append(ev(y))

    def ev(y):
        if y[0] == "n":
            return y[1]
        if y[0] == "g":
            return ev(y[2])
        if y[0] == "pow":
            return power(ev(y[1]), evaluate(y[2]))
        vals, ops = [], []
        flat(y, vals, ops)
        if not drop_brackets:
            acc = vals[0]
            for o, v in zip(ops, vals[1:]):
                acc = apply(o, acc, v)
            return acc
        # usual priorities on the flat list
        while any(o in "*:" for o in ops):
            i = next(k for k, o in enumerate(ops) if o in "*:")
            vals[i : i + 2] = [apply(ops[i], vals[i], vals[i + 1])]
            del ops[i]
        acc = vals[0]
        for o, v in zip(ops, vals[1:]):
            acc = apply(o, acc, v)
        return acc

    return value_or_none(ev, x)


def literals(x):
    t = x[0]
    if t == "n":
        return [x[1]]
    if t == "g":
        return literals(x[2])
    if t == "pow":
        return literals(x[1])
    return literals(x[2]) + literals(x[3])


def walk(x):
    yield x
    if x[0] == "g":
        yield from walk(x[2])
    elif x[0] == "pow":
        yield from walk(x[1])
        yield from walk(x[2])
    elif x[0] == "op":
        yield from walk(x[2])
        yield from walk(x[3])


def group_height(x):
    """Max bracket height inside x (-1 if none), where a bracket's height is 0 if it contains no
    bracket. Also returns errors for brackets whose symbol does not match their height."""
    errs = []

    def rec(y):
        if y[0] == "n":
            return -1
        if y[0] == "op":
            return max(rec(y[2]), rec(y[3]))
        if y[0] == "pow":
            return rec(y[1])  # exponent brackets are only display
        h = rec(y[2]) + 1
        if KIND_HEIGHT[y[1]] != h:
            errs.append(f"bracket {y[1]} has {h} levels inside (tonde, then quadre, then graffe)")
        return h

    return rec(x), errs


def top_terms(x):
    """Number of terms of a sum at the top level of x."""
    if x[0] == "op" and x[1] in "+-":
        return top_terms(x[2]) + 1
    return 1


def check_choice_numbers(ch, truth, errs, max_opts=4):
    """Choice with exactly 4 distinct natural-number options, one of them the truth."""
    if ch is None:
        errs.append("no choice")
        return
    opts = ch.get("options", [])
    if len(opts) != max_opts:
        errs.append(f"choice has {len(opts)} options")
    keys = ["|".join(o.get("values", [])) for o in opts]
    if len(set(keys)) != len(keys):
        errs.append(f"choice options not distinct: {keys}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or keys[idx] != truth:
        errs.append(f"choice.correct does not point to {truth}")
    if keys.count(truth) != 1:
        errs.append(f"{keys.count(truth)} options equal the truth")
    for o in opts:
        if not o.get("latex"):
            errs.append("option without latex")
