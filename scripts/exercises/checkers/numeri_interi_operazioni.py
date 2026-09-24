"""Checker for numeri-interi-operazioni, from specs/exercises/numeri-interi-operazioni.md.

Reads the problem LaTeX back to the ASCII form, checks it equals params.expr, parses it with its
own recursive-descent parser and evaluates it with exact Python integers (a division must be
exact). Then the rules of each level: the shape (two signed numbers, an algebraic sum, brackets
to remove, a product or quotient, an expression), the sizes, the case, the multiple choice. For
levels 4 and 6 it recomputes two mistakes independently, on the text: the brackets dropped as
written (a minus changes the first term only) and every chain done left to right.

Trees are tuples:
    ("n", v, signed) | ("sum", [(s, node), ...]) | ("prod", [node, ...], [op, ...]) | ("g", kind, sum)
"""
import re

CASE_RANGES = {
    1: {"concordi": (0.30, 0.50), "discordi": (0.50, 0.70)},
    2: {"meno-meno": (0.40, 0.60), "meno-piu": (0.40, 0.60)},
    3: {"semplice": (0.30, 0.50), "segni-doppi": (0.50, 0.70)},
    4: {"tonde": (0.40, 0.60), "quadre": (0.40, 0.60)},
    5: {"prodotto": (0.50, 0.70), "quoziente": (0.30, 0.50)},
    6: {"tonde": (0.20, 0.40), "quadre": (0.30, 0.50), "graffe": (0.20, 0.40)},
}

OPEN = {"(": ")", "[": "]", "{": "}"}
KIND = {"(": 0, "[": 1, "{": 2}
NAMES = ["tonde", "quadre", "graffe"]

# level: (max |literal|, max |intermediate|, max |result|, min numbers, max numbers, max brackets, heights)
EXPR = {4: (20, 100, 30, 4, 8, 2, (0, 1)), 6: (20, 200, 50, 5, 11, 4, (0, 1, 2))}


class NotExact(Exception):
    pass


def latex_to_ascii(tex):
    s = tex.replace("\\cdot", "*").replace("\\{", "{").replace("\\}", "}").replace(" ", "")
    if re.search(r"[^0-9+\-*:()\[\]{}]", s):
        raise ValueError(f"unexpected characters in {tex!r}")
    return s


def parse(s):
    pos = [0]

    def peek():
        return s[pos[0]] if pos[0] < len(s) else ""

    def expr():
        terms = []
        sign = 1
        if peek() == "-":
            pos[0] += 1
            sign = -1
        terms.append((sign, term()))
        while peek() in ("+", "-") and peek():
            o = s[pos[0]]
            pos[0] += 1
            terms.append((-1 if o == "-" else 1, term()))
        return ("sum", terms)

    def term():
        fs, ops = [factor()], []
        while peek() in ("*", ":") and peek():
            ops.append(s[pos[0]])
            pos[0] += 1
            fs.append(factor())
        return fs[0] if len(fs) == 1 else ("prod", fs, ops)

    def factor():
        m = re.match(r"\d+", s[pos[0]:])
        if m:
            pos[0] += len(m.group())
            return ("n", int(m.group()), False)
        m = re.match(r"\(([+-])(\d+)\)", s[pos[0]:])
        if m:
            pos[0] += len(m.group())
            v = int(m.group(2))
            return ("n", -v if m.group(1) == "-" else v, True)
        c = peek()
        if c not in OPEN:
            raise ValueError(f"unexpected {c!r} at {pos[0]} in {s}")
        pos[0] += 1
        inner = expr()
        if peek() != OPEN[c]:
            raise ValueError(f"unbalanced {c} in {s}")
        pos[0] += 1
        return ("g", c, inner)

    x = expr()
    if pos[0] != len(s):
        raise ValueError(f"trailing text in {s}")
    return x


def op(o, a, b, ops):
    if o == "+":
        r = a + b
    elif o == "-":
        r = a - b
    elif o == "*":
        r = a * b
    else:
        if b == 0 or a % b:
            raise NotExact(f"{a} : {b}")
        r = a // b
    if ops is not None:
        ops.append((o, a, b, r))
    return r


def evaluate(x, ops=None):
    t = x[0]
    if t == "n":
        return x[1]
    if t == "g":
        return evaluate(x[2], ops)
    if t == "prod":
        acc = evaluate(x[1][0], ops)
        for o, f in zip(x[2], x[1][1:]):
            acc = op(o, acc, evaluate(f, ops), ops)
        return acc
    acc = None
    for i, (s, y) in enumerate(x[1]):
        v = evaluate(y, ops)
        if i == 0:
            acc = s * v
        else:
            acc = op("+" if s > 0 else "-", acc, v, ops)
    return acc


# --- the two mistakes, computed on the text ---------------------------------


def tokens(s):
    """Numbers (the signed ones in parentheses kept whole), operators and brackets."""
    out = []
    i = 0
    while i < len(s):
        m = re.match(r"\(([+-])(\d+)\)", s[i:])
        if m:
            v = int(m.group(2))
            out.append(-v if m.group(1) == "-" else v)
            i += len(m.group())
            continue
        m = re.match(r"\d+", s[i:])
        if m:
            out.append(int(m.group()))
            i += len(m.group())
            continue
        out.append(s[i])
        i += 1
    return out


def eval_tokens(toks, ltr):
    """A flat run: operands possibly preceded by a unary minus (a sign left alone by a dropped bracket)."""
    vals, ops = [], []
    i = 0
    expect = True
    while i < len(toks):
        tk = toks[i]
        if expect:
            neg = 1
            while toks[i] in ("-", "+"):
                if toks[i] == "-":
                    neg = -neg
                i += 1
            vals.append(neg * toks[i])
            expect = False
        else:
            ops.append(tk)
            expect = True
        i += 1
    if ltr:
        acc = vals[0]
        for o, v in zip(ops, vals[1:]):
            acc = op(o, acc, v, None)
        return acc
    while any(o in "*:" for o in ops):
        k = next(j for j, o in enumerate(ops) if o in "*:")
        vals[k : k + 2] = [op(ops[k], vals[k], vals[k + 1], None)]
        del ops[k]
    acc = vals[0]
    for o, v in zip(ops, vals[1:]):
        acc = op(o, acc, v, None)
    return acc


def mistake_flat(asc):
    """Brackets erased from the text, signs left as they are."""
    toks = [tk for tk in tokens(asc) if tk not in ("(", ")", "[", "]", "{", "}")]
    try:
        return eval_tokens(toks, False)
    except NotExact:
        return None


def mistake_ltr(asc):
    """Every bracket computed left to right, then the rest left to right."""
    toks = tokens(asc)
    try:
        while True:
            opens = [j for j, tk in enumerate(toks) if tk in ("(", "[", "{")]
            if not opens:
                return eval_tokens(toks, True)
            j = opens[-1]
            k = next(m for m in range(j + 1, len(toks)) if toks[m] in (")", "]", "}"))
            toks[j : k + 1] = [eval_tokens(toks[j + 1 : k], True)]
    except NotExact:
        return None


# --- helpers ----------------------------------------------------------------


def walk(x):
    yield x
    if x[0] == "sum":
        for _, y in x[1]:
            yield from walk(y)
    elif x[0] == "prod":
        for y in x[1]:
            yield from walk(y)
    elif x[0] == "g":
        yield from walk(x[2])


def lits(x):
    return [y for y in walk(x) if y[0] == "n"]


def height(x):
    hs = [-1]
    for y in walk(x):
        if y is not x and y[0] == "g":
            hs.append(height(y[2]) + 1)
    return max(hs)


def term_values(x):
    return [s * evaluate(y) for s, y in x[1]]


def check_choice(ch, truth, signed, errs):
    if ch is None:
        errs.append("no choice")
        return
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options")
    keys = ["|".join(o.get("values", [])) for o in opts]
    if len(set(keys)) != len(keys):
        errs.append(f"choice options not distinct: {keys}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or keys[idx] != str(truth):
        errs.append(f"choice.correct does not point to {truth}")
    if keys.count(str(truth)) != 1:
        errs.append(f"{keys.count(str(truth))} options equal the truth")
    for o in opts:
        if len(o["values"]) != 1 or not re.fullmatch(r"-?\d+", o["values"][0]):
            errs.append(f"option {o['values']} is not an integer")
            continue
        v = int(o["values"][0])
        want = (f"+{v}" if v > 0 else str(v)) if signed else str(v)
        if o.get("latex") != want:
            errs.append(f"option latex {o.get('latex')!r} != {want!r}")


# --- levels -----------------------------------------------------------------


def two_numbers(x, lvl, errs):
    terms = x[1]
    if len(terms) != 2 or not all(y[0] == "n" and y[2] for _, y in terms):
        errs.append("need two numbers written with their sign in parentheses")
        return None
    a, b = terms[0][1][1], terms[1][1][1]
    if terms[0][0] != 1:
        errs.append("sign before the first number")
    if a == 0 or b == 0 or abs(a) > 25 or abs(b) > 25:
        errs.append(f"numbers {a}, {b} out of 1-25")
    if lvl == 1:
        if terms[1][0] != 1:
            errs.append("not an addition")
        if a * b < 0 and abs(a) == abs(b):
            errs.append("opposite addends")
        return "concordi" if a * b > 0 else "discordi"
    if terms[1][0] != -1:
        errs.append("not a subtraction")
    if a == b:
        errs.append("difference 0")
    return "meno-meno" if b < 0 else "meno-piu"


def algebraic_sum(x, errs):
    terms = x[1]
    if not 4 <= len(terms) <= 6 or not all(y[0] == "n" for _, y in terms):
        errs.append("need 4-6 numbers without brackets")
        return None
    first = terms[0][1]
    if first[2]:
        errs.append("first number in parentheses")
    doubles = sum(1 for _, y in terms[1:] if y[2])
    if doubles > 2:
        errs.append(f"{doubles} double signs, at most 2")
    for _, y in terms:
        if y[1] == 0 or abs(y[1]) > 20:
            errs.append(f"number {y[1]} out of 1-20")
    vals = term_values(x)
    neg = sum(1 for v in vals if v < 0)
    if neg < 2 or neg == len(vals):
        errs.append("need at least two negative terms and one positive")
    r = sum(vals)
    if r == 0 or abs(r) > 40:
        errs.append(f"result {r} out of 1-40 in absolute value")
    return "segni-doppi" if doubles else "semplice"


def rule_of_signs(x, errs):
    terms = x[1]
    p = terms[0][1] if len(terms) == 1 and terms[0][0] == 1 else None
    if p is None or p[0] != "prod" or not all(f[0] == "n" and f[2] for f in p[1]):
        errs.append("need a product or quotient of signed numbers")
        return None
    vals = [f[1] for f in p[1]]
    if not any(v < 0 for v in vals):
        errs.append("no negative number")
    if all(o == "*" for o in p[2]):
        if not 3 <= len(vals) <= 4:
            errs.append(f"{len(vals)} factors, need 3 or 4")
        if any(v == 0 or abs(v) > 9 for v in vals):
            errs.append("factor out of 1-9")
        if sum(1 for v in vals if abs(v) == 1) > 1:
            errs.append("more than one factor 1 or -1")
        prod = 1
        for v in vals:
            prod *= abs(v)
        if not 12 <= prod <= 300:
            errs.append(f"product {prod} out of 12-300")
        return "prodotto"
    if len(vals) != 2 or p[2] != [":"]:
        errs.append("a quotient is a single division")
        return None
    a, b = vals
    if not 2 <= abs(b) <= 12 or a % b or not 2 <= abs(a // b) <= 15:
        errs.append(f"division {a} : {b} out of spec")
    return "quoziente"


def expression(x, asc, lvl, value, errs):
    max_lit, max_val, max_res, min_n, max_n, max_br, heights = EXPR[lvl]
    ops = []
    evaluate(x, ops)
    if value == 0 or abs(value) > max_res:
        errs.append(f"result {value} out of 1-{max_res} in absolute value")
    for o, a, b, r in ops:
        if abs(r) > max_val:
            errs.append(f"intermediate {r} beyond {max_val}")
        if o == "*" and not 2 <= min(abs(a), abs(b)) <= 10:
            errs.append(f"product {a} * {b}: smaller factor out of 2-10")
        if o == ":" and (not 2 <= abs(b) <= 10 or a == 0):
            errs.append(f"division {a} : {b} out of spec")
    ls = lits(x)
    if any(y[1] == 0 or abs(y[1]) > max_lit for y in ls):
        errs.append(f"number out of 1-{max_lit}")
    if any(y[2] and y[1] > 0 for y in ls):
        errs.append("explicit + sign")
    if not min_n <= len(ls) <= max_n:
        errs.append(f"{len(ls)} numbers, expected {min_n}-{max_n}")
    brs = [y for y in walk(x) if y[0] == "g"]
    if len(brs) > max_br:
        errs.append(f"{len(brs)} brackets, at most {max_br}")
    for g in brs:
        inner = g[2]
        if len(inner[1]) < 2:
            errs.append("bracket without a sum inside")
        if inner[1][0][1][0] == "g":
            errs.append("bracket right after an open bracket")
        if KIND[g[1]] != height(inner) + 1:
            errs.append(f"bracket {g[1]} holds {height(inner) + 1} levels (tonde, then quadre, then graffe)")
    h = height(x)
    if h not in heights:
        errs.append(f"bracket height {h}")
    nodes = list(walk(x))
    has_prod = any(y[0] == "prod" for y in nodes)
    if not any(o in "+-" for o, *_ in ops):
        errs.append("no addition or subtraction")
    if lvl == 4:
        if has_prod:
            errs.append("products at level 4")
        if not any(y[0] == "sum" and any(s < 0 and z[0] == "g" for s, z in y[1]) for y in nodes):
            errs.append("no bracket preceded by a minus")
    else:
        if not has_prod:
            errs.append("no product or quotient")
        if not any(y[0] == "prod" and any(f[0] == "n" and f[1] < 0 for f in y[1]) for y in nodes):
            errs.append("no product with a negative number written in it")
        if mistake_ltr(asc) == value:
            errs.append("left to right gives the same value: priorities not tested")
    if mistake_flat(asc) == value:
        errs.append("dropping the brackets gives the same value: the rule is not tested")
    return NAMES[h] if 0 <= h <= 2 else None


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or solution")
    asc = latex_to_ascii(sample["problem"])
    if asc != p["expr"]:
        errs.append(f"problem {asc} != params.expr {p['expr']}")
    x = parse(asc)
    try:
        value = evaluate(x)
    except NotExact as e:
        return errs + [f"division not exact: {e}"], None
    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(value):
        errs.append(f"answer {ans.get('value')} != {value}")
    if lvl in (1, 2):
        kind = two_numbers(x, lvl, errs)
    elif lvl == 3:
        kind = algebraic_sum(x, errs)
    elif lvl == 5:
        kind = rule_of_signs(x, errs)
    elif lvl in EXPR:
        kind = expression(x, asc, lvl, value, errs)
    else:
        return errs + [f"unknown level {lvl}"], None
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but the exercise is {kind}")
    check_choice(sample.get("choice"), value, lvl in (1, 2, 5), errs)
    return errs, kind
