"""Checker for numeri-interi-potenze, from specs/exercises/numeri-interi-potenze.md.

The problem LaTeX is parsed here from scratch with the usual priorities (powers, then \\cdot and :,
then + and -; a minus at the start of an expression or bracket is the opposite of the whole term that
follows, so -3^2 is -(3^2)), and evaluated with exact Python integers: every division must be exact,
0^0 is an error. params.expr is not used for the value, so a tree whose LaTeX says something else
is caught. The level constraints are read from the parsed LaTeX.
"""
import re

from verify import rat

CASE_RANGES = {
    1: {"pari": (0.30, 0.50), "dispari": (0.30, 0.50), "esponente 0": (0.05, 0.17), "esponente 1": (0.05, 0.17)},
    2: {"meno fuori": (0.30, 0.50), "meno davanti alla parentesi": (0.17, 0.33), "base -1": (0.27, 0.43)},
    3: {"prodotto": (0.20, 0.45), "quoziente": (0.20, 0.45), "potenza di potenza": (0.20, 0.45)},
    4: {"basi opposte": (0.35, 0.65), "stesso esponente": (0.35, 0.65)},
}

# Largest |base| for each exponent at level 1; largest final exponent per |base| at level 3.
L1_MAX = {0: 30, 1: 30, 2: 15, 3: 10, 4: 10}
L3_FINAL = {2: 10, 3: 8, 4: 6, 5: 5, 10: 4}

TOKEN = re.compile(r"\s*(\d+(?:\\,\d{3})*|\\cdot|\\\{|\\\}|[-+:()\[\]{}^])")
RANK = {"(": 0, "[": 1, "{": 2}
CLOSE = {"(": ")", "[": "]", "{": "}"}


def unwrap_lines(tex):
    """An aligned problem (one expression broken to fit a phone) back to one line: a new line may
    start only with a binary operator, after the indent."""
    m = re.fullmatch(r"\\begin\{aligned\}&(.*)\\end\{aligned\}", tex, re.S)
    if not m:
        return tex
    lines = m.group(1).split(r" \\ &\quad ")
    if len(lines) < 2 or any(not re.match(r"(\+|-|\\cdot|:) ", ln) for ln in lines[1:]):
        raise ValueError(f"bad line break in {tex!r}")
    return " ".join(lines)


def tokenize(s):
    out, i = [], 0
    s = s.strip()
    while i < len(s):
        m = TOKEN.match(s, i)
        if not m:
            raise ValueError(f"unexpected text at {s[i:i + 10]!r}")
        tok = m.group(1)
        if tok == "\\{":
            tok = "{"  # a graffa; exponent braces are told apart by the parser (they follow ^)
            out.append(("br", "{"))
        elif tok == "\\}":
            out.append(("br", "}"))
        elif tok in ("{", "}"):
            out.append(("eb", tok))
        elif tok[0].isdigit():
            out.append(("num", int(tok.replace("\\,", ""))))
        else:
            out.append(("op", tok))
        i = m.end()
    return out


class Parser:
    def __init__(self, s):
        self.toks = tokenize(s)
        self.i = 0

    def peek(self):
        return self.toks[self.i] if self.i < len(self.toks) else (None, None)

    def take(self):
        tok = self.peek()
        self.i += 1
        return tok

    def parse(self):
        x = self.expr()
        if self.i != len(self.toks):
            raise ValueError(f"trailing tokens {self.toks[self.i:]}")
        return x

    def expr(self):
        neg = False
        if self.peek() == ("op", "-"):
            self.take()
            neg = True
        x = self.term()
        if neg:
            x = {"t": "neg", "x": x}
        while self.peek() in (("op", "+"), ("op", "-")):
            op = self.take()[1]
            x = {"t": "op", "op": op, "l": x, "r": self.term()}
        return x

    def term(self):
        x = self.factor()
        while self.peek() in (("op", "\\cdot"), ("op", ":")):
            op = self.take()[1]
            x = {"t": "op", "op": "*" if op == "\\cdot" else ":", "l": x, "r": self.factor()}
        return x

    def factor(self):
        b = self.primary()
        if self.peek() == ("op", "^"):
            self.take()
            kind, v = self.take()
            if kind == "eb" and v == "{":
                kind2, e = self.take()
                if kind2 != "num" or self.take() != ("eb", "}"):
                    raise ValueError("bad exponent in braces")
                if e < 10:
                    raise ValueError("single-digit exponent in braces")
            elif kind == "num":
                if v >= 10:
                    raise ValueError("multi-digit exponent without braces")
                e = v
            else:
                raise ValueError("bad exponent")
            if self.peek() == ("op", "^"):
                raise ValueError("a^b^c without brackets")
            return {"t": "pow", "b": b, "e": e}
        return b

    def primary(self):
        kind, v = self.take()
        if kind == "num":
            return {"t": "num", "v": v}
        if (kind == "op" and v in ("(", "[")) or (kind == "br" and v == "{"):
            inner = self.expr()
            close = self.take()
            want = ("br", "}") if v == "{" else ("op", CLOSE[v])
            if close != want:
                raise ValueError(f"missing {CLOSE[v]}")
            return {"t": "br", "k": v, "x": inner}
        raise ValueError(f"unexpected token {v!r}")


def ev(n):
    t = n["t"]
    if t == "num":
        return n["v"]
    if t == "neg":
        return -ev(n["x"])
    if t == "br":
        return ev(n["x"])
    if t == "pow":
        b = ev(n["b"])
        if b == 0 and n["e"] == 0:
            raise ValueError("0^0")
        return b ** n["e"]
    a, b = ev(n["l"]), ev(n["r"])
    op = n["op"]
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op == "*":
        return a * b
    if b == 0 or a % b != 0:
        raise ValueError(f"division {a} : {b} not exact in Z")
    return a // b


def walk(n):
    yield n
    for k in ("x", "b", "l", "r"):
        if isinstance(n.get(k), dict):
            yield from walk(n[k])


def int_base(p):
    """The base of a power when it is an integer: 3, or (-3) written in tonde. None otherwise."""
    b = p["b"]
    if b["t"] == "num":
        return b["v"]
    if b["t"] == "br" and b["k"] == "(" and b["x"]["t"] == "neg" and b["x"]["x"]["t"] == "num":
        return -b["x"]["x"]["v"]
    return None


def inner_pow(p):
    """For a power of a power, the inner power: (2^3)^2 or [(-2)^3]^2."""
    b = p["b"]
    if b["t"] == "br" and b["x"]["t"] == "pow":
        return b["x"]
    return None


def rank(n):
    """Highest bracket written in n, -1 without brackets."""
    return max((RANK[m["k"]] for m in walk(n) if m["t"] == "br"), default=-1)


def terms(n):
    """Top-level terms of a sum, with their sign: [(sign, node)]; the unary minus counts as a sign."""
    if n["t"] == "op" and n["op"] in "+-":
        return terms(n["l"]) + [(n["op"], n["r"])]
    if n["t"] == "neg":
        return [("-", n["x"])]
    return [("+", n)]


def leftmost(n):
    while n["t"] == "op":
        n = n["l"]
    return n


def expr_shape(n):
    """Exponents and operators of params.expr, to tell that no line of the problem was lost."""
    t = n["t"]
    if t == "pow":
        return [("^", n["e"])] + expr_shape(n["b"])
    if t == "op":
        return expr_shape(n["l"]) + [("op", n["op"])] + expr_shape(n["r"])
    if t == "neg":
        return expr_shape(n["x"])
    if t == "g":
        return expr_shape(n["c"])
    return []


def tree_shape(n):
    t = n["t"]
    if t == "pow":
        return [("^", n["e"])] + tree_shape(n["b"])
    if t == "op":
        return tree_shape(n["l"]) + [("op", n["op"])] + tree_shape(n["r"])
    if t in ("neg", "br"):
        return tree_shape(n["x"])
    return []


def parse_int(latex):
    m = re.fullmatch(r"(-?)(\d+(?:\\,\d{3})*)", latex)
    if not m:
        return None
    v = int(m.group(2).replace("\\,", ""))
    return -v if m.group(1) else v


def check(sample):
    errs = []
    lvl = sample["level"]
    try:
        prob = unwrap_lines(sample["problem"])
        tree = Parser(prob).parse()
        truth = ev(tree)
    except Exception as ex:  # noqa: BLE001
        return [f"cannot parse or evaluate {prob!r}: {ex}"], None
    ans = sample["answer"]
    if ans.get("kind") != "number" or rat(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    expr = sample["params"].get("expr")
    if expr is not None and sorted(map(str, expr_shape(expr))) != sorted(map(str, tree_shape(tree))):
        errs.append("the problem does not show every power and operation of params.expr")
    if re.search(r"\+\s*-|-\s*-|\+\s*\+", prob):
        errs.append("double sign in problem")

    pows = [n for n in walk(tree) if n["t"] == "pow"]
    exps = [p["e"] for p in pows]
    ibases = [int_base(p) for p in pows]

    # Brackets: tonde inside quadre inside graffe; a bracket is either the base of a power or, at
    # level 6, the graffa around a sum.
    for n in walk(tree):
        if n["t"] == "br" and RANK[n["k"]] != rank(n["x"]) + 1:
            errs.append(f"bracket {n['k']} does not follow the order tonde, quadre, graffe")
    bases_ids = {id(p["b"]) for p in pows}
    for n in walk(tree):
        if n["t"] == "br" and id(n) not in bases_ids and not (lvl == 6 and n["k"] == "{"):
            errs.append("bracket that is not the base of a power")
        if n["t"] == "br" and id(n) in bases_ids and n["x"]["t"] not in ("neg", "pow"):
            errs.append("bracket base that is neither a negative number nor a power")
    if any(b == 0 for b in ibases):
        errs.append("base 0")
    if 1 in exps and not (lvl == 1 and len(pows) == 1):
        errs.append("exponent 1 written in the problem")
    if 0 in exps and lvl not in (1, 5):
        errs.append("exponent 0 outside levels 1 and 5")

    kind = None
    if lvl == 1:
        b = ibases[0] if len(pows) == 1 else None
        if tree["t"] != "pow" or b is None or b > -2 or tree["e"] > 4 or -b > L1_MAX.get(tree["e"], 0):
            errs.append("level 1: (-a)^n with a >= 2 in the bounds, n from 0 to 4")
        else:
            e = tree["e"]
            kind = "esponente 0" if e == 0 else "esponente 1" if e == 1 else "pari" if e % 2 == 0 else "dispari"
    elif lvl == 2:
        if tree["t"] == "neg" and tree["x"]["t"] == "pow" and int_base(tree["x"]) is not None:
            b, e = int_base(tree["x"]), tree["x"]["e"]
            if not 2 <= e <= 5 or abs(b) < 2:
                errs.append("level 2: exponent from 2 to 5, base at least 2")
            kind = "meno fuori" if b > 0 else "meno davanti alla parentesi"
        elif tree["t"] == "pow" and ibases == [-1] and 10 <= tree["e"] <= 120:
            kind = "base -1"
        else:
            errs.append("level 2: -a^n, -(-a)^n or (-1)^n with n from 10 to 120")
    elif lvl == 3:
        num_bases = {b for b in ibases if b is not None}
        if len(num_bases) != 1 or min(num_bases) >= -1:
            errs.append("level 3: one negative base only")
        else:
            a = min(num_bases)
            if tree["t"] == "pow" and inner_pow(tree):
                k, kind = inner_pow(tree)["e"] * tree["e"], "potenza di potenza"
            elif tree["t"] == "op" and tree["op"] in "*:" and len(pows) == 2 and all(p["t"] == "pow" for p in (tree["l"], tree["r"])):
                m, n = tree["l"]["e"], tree["r"]["e"]
                k, kind = (m + n, "prodotto") if tree["op"] == "*" else (m - n, "quoziente")
            else:
                k = None
                errs.append("level 3: a product, a quotient or a power of a power")
            if k is not None and (k < 2 or k > L3_FINAL.get(-a, 0) or truth != a ** k):
                errs.append(f"level 3: final exponent {k} out of bounds for base {a}")
    elif lvl == 4:
        if tree["t"] != "op" or tree["op"] not in "*:" or len(pows) != 2 or None in ibases:
            errs.append("level 4: two powers of integers, multiplied or divided")
        else:
            (b1, b2), (e1, e2) = ibases, exps
            if b1 == -b2 and e1 != e2:
                kind = "basi opposte"
            elif e1 == e2 and abs(b1) != abs(b2) and min(b1, b2) < 0:
                kind = "stesso esponente"
            else:
                errs.append("level 4: opposite bases, or the same exponent with a negative base")
        if abs(truth) > 10000:
            errs.append("level 4: result above 10 000")
    elif lvl == 5:
        ts = terms(tree)
        if rank(tree) > 0 or any(inner_pow(p) for p in pows):
            errs.append("level 5: no brackets besides the negative bases")
        if not 3 <= len(ts) <= 4:
            errs.append(f"level 5: {len(ts)} terms, expected 3 or 4")
        for _, x in ts:
            fs = [x] if x["t"] == "pow" else [x["l"], x["r"]] if x["t"] == "op" and x["op"] in "*:" else None
            if not fs or any(f["t"] != "pow" for f in fs):
                errs.append("level 5: each term is a power or a product or quotient of two powers")
        trap = any(s == "-" and leftmost(x)["t"] == "pow" and (int_base(leftmost(x)) or 0) > 0 and leftmost(x)["e"] % 2 == 0 and leftmost(x)["e"] > 0 for s, x in ts)
        if not trap:
            errs.append("level 5: no -a^n with a positive base and an even exponent")
        if not any(b is not None and b < -1 and e % 2 == 1 for b, e in zip(ibases, exps)):
            errs.append("level 5: no negative base with an odd exponent")
        if exps.count(0) > 1:
            errs.append("level 5: more than one exponent 0")
        if abs(truth) > 300:
            errs.append("level 5: result above 300")
    elif lvl == 6:
        ks = {n["k"] for n in walk(tree) if n["t"] == "br"}
        if not {"(", "[", "{"} <= ks:
            errs.append("level 6: tonde, quadre and graffe")
        if not any(inner_pow(p) for p in pows):
            errs.append("level 6: no power of a power")
        if abs(truth) > 1000:
            errs.append("level 6: result above 1000")
    else:
        errs.append(f"unknown level {lvl}")
    if lvl in CASE_RANGES and kind is not None and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')!r} but the problem is {kind!r}")

    ch = sample.get("choice")
    if ch is None:
        errs.append("no multiple-choice variant")
    else:
        opts = ch["options"]
        if len(opts) != 4:
            errs.append(f"{len(opts)} options")
        vals = []
        for o in opts:
            shown = parse_int(o["latex"])
            v = rat(o["values"][0])
            if shown is None or shown != v:
                errs.append(f"option {o['latex']} does not show {v}")
            vals.append(v)
        if len(set(vals)) != len(vals):
            errs.append("options not distinct")
        if [i for i, v in enumerate(vals) if v == truth] != [ch.get("correct")]:
            errs.append("choice.correct is wrong or not unique")
    if not sample.get("steps"):
        errs.append("no steps")
    return errs, kind
