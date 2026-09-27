"""Checker for radicali-operazioni, from specs/exercises/radicali-operazioni.md.

Independent of the generator: the problem, the answer and every option are read back from their
LaTeX with a small parser, evaluated with SymPy (letters are positive symbols, odd roots of negative
numbers are real) and compared. The answer must have the problem's value (checked symbolically) and
be reduced: a sum of terms c · letters · ⁿ√(R · letters) with every exponent under the root smaller
than the index, the index not reducible, no two similar terms. A distractor must differ in value or,
with the same value, not be reduced. Level 4 is a choice: the factor carried inside the root, or the
largest (smallest) of four numbers.
"""
import random
import re
from math import gcd

from sympy import Integer, Rational, Symbol, factorint, simplify, sympify

from verify import FORBIDDEN  # noqa: F401  (shared helpers, as the README asks)

LETTERS = {c: Symbol(c, positive=True) for c in "abxy"}

CASE_RANGES = {
    1: {"prodotto intero": (0.18, 0.40), "prodotto": (0.18, 0.40), "quoziente": (0.12, 0.35), "indice 3": (0.10, 0.30)},
    2: {"indice 2": (0.60, 0.80), "indice 3": (0.20, 0.40)},
    3: {"indice 2": (0.55, 0.75), "indice 3": (0.25, 0.45)},
    4: {"dentro": (0.40, 0.60), "confronto": (0.40, 0.60)},
    5: {"indici diversi": (0.30, 0.50), "potenza": (0.20, 0.40), "radice di radicale": (0.20, 0.40)},
    6: {"numeri": (0.60, 0.80), "lettere": (0.08, 0.25), "indice 3": (0.08, 0.25)},
    7: {"quadrato": (0.25, 0.45), "somma per differenza": (0.15, 0.35), "prodotto": (0.15, 0.35), "quadrato e somma": (0.07, 0.25)},
}

# ---------------------------------------------------------------------------
# Parser: LaTeX -> tree

TOKEN = re.compile(r"\s*(\\sqrt|\\frac|\\left\(|\\right\)|\\cdot|\\quad|\d+|[a-z]|[{}\[\]()^+\-:])")


def tokenize(s):
    out, i = [], 0
    s = s.strip()
    while i < len(s):
        m = TOKEN.match(s, i)
        if not m:
            raise ValueError(f"cannot read {s[i:i + 12]!r} in {s!r}")
        tok = m.group(1)
        out.append({"\\left(": "(", "\\right)": ")"}.get(tok, tok))
        i = m.end()
    return out


class Parser:
    def __init__(self, s):
        self.t = tokenize(s)
        self.i = 0

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else None

    def take(self, want=None):
        tok = self.peek()
        if tok is None or (want is not None and tok != want):
            raise ValueError(f"expected {want!r}, found {tok!r}")
        self.i += 1
        return tok

    def done(self):
        if self.peek() is not None:
            raise ValueError(f"unexpected {self.peek()!r}")

    def expr(self):
        items = []
        sign = 1
        if self.peek() == "-":
            self.take()
            sign = -1
        items.append((sign, self.product()))
        while self.peek() in ("+", "-"):
            sign = 1 if self.take() == "+" else -1
            items.append((sign, self.product()))
        return ("add", items)

    def product(self):
        node = self.implicit()
        while self.peek() in ("\\cdot", ":"):
            op = self.take()
            node = ("mul", [node, self.implicit()]) if op == "\\cdot" else ("div", node, self.implicit())
        return node

    def starts_atom(self, tok):
        return tok is not None and (tok.isdigit() or re.fullmatch(r"[a-z]", tok) or tok in ("\\sqrt", "\\frac", "("))

    def implicit(self):
        parts = [self.postfix()]
        while self.starts_atom(self.peek()):
            parts.append(self.postfix())
        return parts[0] if len(parts) == 1 else ("mul", parts)

    def postfix(self):
        a = self.atom()
        if self.peek() == "^":
            self.take()
            if self.peek() == "{":
                self.take()
                e = self.expr()
                self.take("}")
            else:
                e = ("num", int(self.take()))
            a = ("pow", a, e)
        return a

    def atom(self):
        tok = self.take()
        if tok.isdigit():
            return ("num", int(tok))
        if re.fullmatch(r"[a-z]", tok):
            return ("sym", tok)
        if tok == "\\sqrt":
            n = 2
            if self.peek() == "[":
                self.take()
                n = int(self.take())
                self.take("]")
            self.take("{")
            body = self.expr()
            self.take("}")
            return ("root", n, body)
        if tok == "\\frac":
            self.take("{")
            a = self.expr()
            self.take("}")
            self.take("{")
            b = self.expr()
            self.take("}")
            return ("div", a, b)
        if tok == "(":
            e = self.expr()
            self.take(")")
            return ("paren", e)
        raise ValueError(f"unexpected token {tok!r}")


def parse(s):
    p = Parser(s)
    e = p.expr()
    p.done()
    return e


def ev(node):
    k = node[0]
    if k == "num":
        return Integer(node[1])
    if k == "sym":
        return LETTERS[node[1]]
    if k == "add":
        return sum(s * ev(x) for s, x in node[1])
    if k == "mul":
        out = Integer(1)
        for x in node[1]:
            out *= ev(x)
        return out
    if k == "div":
        return ev(node[1]) / ev(node[2])
    if k == "pow":
        return ev(node[1]) ** ev(node[2])
    if k == "paren":
        return ev(node[1])
    if k == "root":
        n, v = node[1], ev(node[2])
        if v.is_number and v < 0:
            if n % 2 == 0:
                raise ValueError("even root of a negative number")
            return -((-v) ** Rational(1, n))
        return v ** Rational(1, n)
    raise ValueError(k)


def value(latex):
    return ev(parse(latex))


POINTS = [{c: Rational(random.Random(k * 7 + i).randint(11, 97), random.Random(k * 13 + i).randint(5, 9)) for i, c in enumerate("abxy")} for k in range(2)]


def at(v, pt):
    return v.subs({LETTERS[c]: pt[c] for c in "abxy"})


def same_num(u, v):
    for pt in POINTS:
        d = abs((at(u, pt) - at(v, pt)).evalf(50))
        if d > Rational(1, 10**30) * max(1, abs(at(v, pt).evalf(50))):
            return False
    return True


def same_exact(u, v):
    return simplify(u - v) == 0


# ---------------------------------------------------------------------------
# Form: a sum of reduced terms


def factor_part(node, allow_neg=False):
    """A product of an integer and letter powers: (int, {letter: exp}) or None."""
    k = node[0]
    if k == "num":
        return node[1], {}
    if k == "sym":
        return 1, {node[1]: 1}
    if k == "pow" and node[1][0] == "sym":
        e = node[2]
        if e[0] == "add" and len(e[1]) == 1 and e[1][0][0] == 1 and e[1][0][1][0] == "num":
            e = e[1][0][1]
        if e[0] != "num" or e[1] < 2:
            return None
        return 1, {node[1][1]: e[1]}
    if k == "mul":
        c, ls = 1, {}
        for x in node[1]:
            f = factor_part(x)
            if f is None:
                return None
            c *= f[0]
            for l, e in f[1].items():
                if l in ls:
                    return None
                ls[l] = e
        return c, ls
    if allow_neg and k == "add" and len(node[1]) == 1:
        s, x = node[1][0]
        f = factor_part(x)
        return None if f is None else (s * f[0], f[1])
    return None


def term_of(sign, node, allow_neg_radicand=False):
    """sign · c · letters · root: dict or None if the node is not written as one term."""
    parts = node[1] if node[0] == "mul" else [node]
    roots = [x for x in parts if x[0] == "root"]
    rest = [x for x in parts if x[0] != "root"]
    if len(roots) > 1 or (roots and parts[-1][0] != "root"):
        return None
    c, ls = 1, {}
    if rest:
        f = factor_part(("mul", rest) if len(rest) > 1 else rest[0])
        if f is None:
            return None
        c, ls = f
        if len(rest) > 1 and rest[0][0] == "num" and rest[0][1] == 1:
            return None
        if rest[0][0] == "num" and rest[0][1] == 1 and (roots or ls):
            return None  # 1\sqrt{..}
    t = {"c": sign * c, "out": ls, "n": 1, "R": 1, "rin": {}}
    if roots:
        n, body = roots[0][1], roots[0][2]
        rp = factor_part(body[1][0][1]) if body[0] == "add" and len(body[1]) == 1 else None
        if rp is None:
            return None
        R = body[1][0][0] * rp[0]
        if R < 0 and not allow_neg_radicand:
            return None
        t.update(n=n, R=R, rin=rp[1])
    return t


def terms_of(latex, allow_neg_radicand=False):
    tree = parse(latex)
    out = []
    for sign, node in tree[1]:
        t = term_of(sign, node, allow_neg_radicand)
        if t is None:
            return None
        out.append(t)
    return out


def reduced_errors(latex):
    ts = terms_of(latex)
    if ts is None:
        return [f"{latex!r} is not a sum of terms c·ⁿ√R"]
    errs = []
    keys = set()
    for t in ts:
        if t["c"] == 0:
            errs.append("zero coefficient")
        if t["n"] == 1:
            key = ("rat", tuple(sorted(t["out"].items())))
        else:
            n, R = t["n"], t["R"]
            exps = list(factorint(R).values()) + list(t["rin"].values())
            if n < 2 or R < 1 or not exps:
                errs.append(f"bad radical in {latex!r}")
                continue
            if any(e >= n for e in exps):
                errs.append(f"factor left under the root in {latex!r}")
            g = n
            for e in exps:
                g = gcd(g, e)
            if g > 1:
                errs.append(f"index can be lowered in {latex!r}")
            key = (n, R, tuple(sorted(t["rin"].items())), tuple(sorted(t["out"].items())))
        if key in keys:
            errs.append(f"similar terms not summed in {latex!r}")
        keys.add(key)
    return errs


def is_reduced(latex):
    try:
        return not reduced_errors(latex)
    except ValueError:
        return False


# ---------------------------------------------------------------------------
# Problem shapes


def single(tree):
    return tree[1][0][1] if tree[0] == "add" and len(tree[1]) == 1 and tree[1][0][0] == 1 else None


def roots_in(node):
    k = node[0]
    if k in ("num", "sym"):
        return []
    if k == "add":
        return [r for _, x in node[1] for r in roots_in(x)]
    if k == "mul":
        return [r for x in node[1] for r in roots_in(x)]
    if k in ("div", "pow"):
        return roots_in(node[1]) + roots_in(node[2])
    if k == "paren":
        return roots_in(node[1])
    if k == "root":
        return [node] + roots_in(node[2])
    raise ValueError(k)


def kind_of(sample, tree):
    lvl = sample["level"]
    p = sample["problem"]
    if lvl == 1:
        rs = roots_in(tree)
        if rs and rs[0][1] == 3:
            return "indice 3"
        if ":" in p or "\\frac" in p:
            return "quoziente"
        return "prodotto intero" if sample["answer"]["latex"].isdigit() and "\\sqrt" in p and not re.search(r"\d\\sqrt", p) else "prodotto"
    if lvl == 2:
        return "indice 3" if "\\sqrt[3]" in p else "indice 2"
    if lvl == 3:
        return "indice 3" if "\\sqrt[3]" in p else "indice 2"
    if lvl == 5:
        if p.startswith("\\left("):
            return "potenza"
        rs = roots_in(tree)
        if any(roots_in(r[2]) for r in rs):
            return "radice di radicale"
        return "indici diversi"
    if lvl == 6:
        return "indice 3" if "\\sqrt[3]" in p else "lettere" if re.search(r"[a-z]\}", p) else "numeri"
    if lvl == 7:
        if p.count("\\left(") == 2:
            f1, f2 = re.findall(r"\\left\((.*?)\\right\)", p)
            parts = lambda f: sorted(t.lstrip("-") for t in re.split(r"\s[+-]\s", f))
            same = parts(f1) == parts(f2)
            return "somma per differenza" if same else "prodotto"
        return "quadrato" if p.endswith("^{2}") else "quadrato e somma"
    return None


def level_errors(sample, tree, truth):
    lvl = sample["level"]
    p = sample["problem"]
    errs = []
    rs = roots_in(tree)
    idx = {r[1] for r in rs}
    ans_terms = terms_of(sample["answer"]["latex"]) if sample["answer"].get("latex") else None
    if lvl == 1:
        if len(rs) != 2 or len(idx) != 1 or idx - {2, 3}:
            errs.append("level 1: two radicals with the same index 2 or 3")
        # the product (quotient) of the radicands is a perfect power or has nothing to carry out
        if ans_terms is None or len(ans_terms) != 1:
            errs.append("level 1: one term")
        else:
            n = rs[0][1]
            a, b = (value_of_radicand(r) for r in rs)
            P = a * b if (":" not in p and "\\frac" not in p) else Rational(a, b)
            if not P.is_integer:
                errs.append("level 1: the quotient of the radicands is not an integer")
            else:
                exps = list(factorint(int(P)).values())
                if not (all(e % n == 0 for e in exps) or all(e < n for e in exps)):
                    errs.append(f"level 1: the radicand {P} needs a factor carried out")
    elif lvl == 2:
        t = terms_of(p)
        if not t or len(t) != 1 or t[0]["n"] not in (2, 3) or t[0]["rin"] or t[0]["out"]:
            errs.append("level 2: one numeric radical of index 2 or 3")
        else:
            n, R = t[0]["n"], t[0]["R"]
            if not any(e >= n for e in factorint(R).values()):
                errs.append("level 2: nothing to carry out")
            if R > 400:
                errs.append("level 2: radicand > 400")
            if not sample["prompt"].startswith("Porta fuori"):
                errs.append("level 2 prompt")
    elif lvl == 3:
        t = terms_of(p)
        if not t or len(t) != 1 or t[0]["n"] not in (2, 3) or not t[0]["rin"]:
            errs.append("level 3: one radical with letters")
        else:
            n = t[0]["n"]
            if not any(e >= n for e in t[0]["rin"].values()):
                errs.append("level 3: no letter comes out")
            if ans_terms and ans_terms[0]["n"] == 1:
                errs.append("level 3: nothing left under the root")
        if "lettere sono positive" not in sample["prompt"]:
            errs.append("level 3: the prompt must say the letters are positive")
    elif lvl == 5:
        k = kind_of(sample, tree)
        if k == "indici diversi" and (len(rs) != 2 or len(idx) != 2):
            errs.append("level 5: two radicals with different indices")
        if k == "potenza" and not re.fullmatch(r"\\left\(.*\\right\)\^\{\d\}", p):
            errs.append("level 5: power of a radical")
        from math import lcm

        if k == "indici diversi" and lcm(*idx) > 6:
            errs.append("level 5: lcm of the indices > 6")
        if k == "radice di radicale":
            inner = [r for r in rs if roots_in(r[2])]
            if not inner or inner[0][1] * roots_in(inner[0][2])[0][1] > 6:
                errs.append("level 5: product of the indices > 6")
    elif lvl == 6:
        terms = tree[1]
        if len(terms) > 4 or len(terms) < (2 if "\\sqrt[3]" in p else 3):
            errs.append("level 6: three or four terms (two or three with index 3)")
        pt = []
        for s, node in terms:
            t = term_of(s, node, allow_neg_radicand=True)
            if t is None or t["n"] == 1:
                errs.append("level 6: every term is a radical")
                break
            pt.append(t)
        else:
            to_carry = sum(1 for t in pt if any(e >= t["n"] for e in list(factorint(abs(t["R"])).values())))
            if to_carry < 2:
                errs.append("level 6: at least two radicals to reduce")
            if ans_terms is not None and len(ans_terms) > 2:
                errs.append("level 6: at most two groups")
    elif lvl == 7:
        if "\\left(" not in p or not rs:
            errs.append("level 7: a product with radicals in parentheses")
        if ans_terms is not None and (len(ans_terms) > 2 or any(t["n"] not in (1, 2) for t in ans_terms)):
            errs.append("level 7: integer plus a square root")
    return errs


def value_of_radicand(root):
    return ev(root[2])


# ---------------------------------------------------------------------------


def check_options(opts, correct, truth, errs, reduced_needed=True):
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    if not isinstance(correct, int) or not 0 <= correct < len(opts):
        errs.append("choice.correct out of range")
        return
    latexes = [o["latex"] for o in opts]
    if len(set(latexes)) != len(latexes):
        errs.append("options with the same LaTeX")
    vals = []
    for o in opts:
        v = value(o["latex"])
        vals.append(v)
        given = sympify(o["values"][0], locals=LETTERS)
        if not same_num(v, given):
            errs.append(f"option {o['latex']!r} != its value {o['values'][0]!r}")
    right = []
    for i, v in enumerate(vals):
        good = same_num(v, truth) and (not reduced_needed or is_reduced(opts[i]["latex"]))
        if good:
            right.append(i)
    if right != [correct]:
        errs.append(f"right options {right}, choice.correct {correct}: {latexes}")
    if not same_exact(vals[correct], truth):
        errs.append("the right option is not exactly the problem's value")
    same_value = [i for i, v in enumerate(vals) if i != correct and same_num(v, truth)]
    if len(same_value) > 1:
        errs.append("more than one unreduced option equal to the answer")
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            if i != correct and j != correct and same_num(vals[i], vals[j]):
                errs.append(f"two distractors with the same value: {latexes[i]!r}, {latexes[j]!r}")


def check(sample):
    errs = []
    p = sample["problem"]
    lvl = sample["level"]
    for bad, rx in [("+ -", r"\+\s*-"), ("- -", r"-\s*-"), ("1\\sqrt", r"(?<!\d)1\\sqrt"), ("^{1}", r"\^\{1\}"), ("\\sqrt{1}", r"\\sqrt(\[\d\])?\{1\}")]:
        if re.search(rx, p):
            errs.append(f"problem contains {bad!r}")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("steps or solution missing")
    kind = None
    if lvl == 4:
        ans = sample["answer"]
        if ans.get("kind") != "choice":
            return ["level 4 answer must be a choice"], None
        opts = ans["options"]
        if "\\quad" in p:
            kind = "confronto"
            items = [s.strip() for s in p.split("\\quad")]
            if len(items) != 4:
                errs.append("comparison of four numbers")
            ivals = [value(s) for s in items]
            for s in items:
                t = terms_of(s)
                if not t or len(t) != 1 or t[0]["R"] < 1 or (t[0]["n"] == 1 and len(s) > 2) or not is_reduced(s):
                    errs.append(f"item {s!r} is not c·√s reduced")
            if sorted(o["latex"] for o in opts) != sorted(items):
                errs.append("options are not the numbers of the problem")
            largest = "maggiore" in sample["prompt"]
            if not largest and "minore" not in sample["prompt"]:
                errs.append("prompt must ask for the largest or the smallest")
            target = (max if largest else min)(ivals, key=lambda v: float(v))
            check_options(opts, ans["correct"], target, errs, reduced_needed=False)
            if len({float(v) for v in ivals}) != 4:
                errs.append("two equal numbers")
            # the trap: the extreme coefficient is not the answer, when it is unique
            coefs = [terms_of(s)[0]["c"] for s in items]
            ext = (max if largest else min)(coefs)
            idx = items.index(opts[ans["correct"]]["latex"]) if opts[ans["correct"]]["latex"] in items else -1
            if coefs.count(ext) == 1 and idx >= 0 and coefs[idx] == ext:
                errs.append("the answer is simply the extreme coefficient")
        else:
            kind = "dentro"
            t = terms_of(p)
            if not t or len(t) != 1 or t[0]["n"] not in (2, 3) or abs(t[0]["c"]) < 2 or not is_reduced(p):
                errs.append("level 4: one radical c·ⁿ√s with a coefficient")
            truth = value(p)
            check_options(opts, ans["correct"], truth, errs, reduced_needed=False)
            # every option has the factor inside: ±ⁿ√N, and the minus stays outside with an even index
            for o in opts:
                ot = terms_of(o["latex"], allow_neg_radicand=True)
                if not ot or len(ot) != 1 or abs(ot[0]["c"]) != 1 or ot[0]["out"] or ot[0]["n"] < 2:
                    errs.append(f"option {o['latex']!r} is not ±ⁿ√N")
                elif ot[0]["n"] % 2 == 0 and ot[0]["R"] < 0:
                    errs.append("negative radicand with even index")
                else:
                    N = abs(ot[0]["R"])
                    if round(N ** (1 / ot[0]["n"])) ** ot[0]["n"] == N:
                        errs.append(f"option {o['latex']!r} is a perfect power")
            if t and t[0]["c"] < 0 and t[0]["n"] % 2 == 0:
                right = opts[ans["correct"]]["latex"]
                if not right.startswith("-"):
                    errs.append("the minus must stay outside the square root")
        return errs, kind

    tree = parse(p)
    truth = ev(tree)
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "simplified":
        return errs + ["answer must be an expression with form 'simplified'"], None
    try:
        av = value(ans["latex"])
    except ValueError as e:
        return errs + [f"answer latex unreadable: {e}"], None
    if not same_exact(av, truth):
        errs.append(f"answer {ans['latex']!r} != problem value {truth}")
    if not same_num(sympify(ans["value"], locals=LETTERS), truth):
        errs.append(f"answer.value {ans['value']!r} != problem value")
    errs += reduced_errors(ans["latex"])
    errs += level_errors(sample, tree, truth)
    ch = sample.get("choice")
    if ch is None:
        errs.append("choice variant missing")
    else:
        check_options(ch["options"], ch["correct"], truth, errs)
        if ch["options"][ch["correct"]]["latex"] != ans["latex"]:
            errs.append("the right option is not written as the answer")
    kind = kind_of(sample, tree)
    return errs, kind
