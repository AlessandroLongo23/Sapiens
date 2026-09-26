"""Checker for relazioni-equivalenza-ordine (specs/exercises/relazioni-equivalenza-ordine.md).

Written from the spec, not from the generator. Every property is checked exhaustively on the pairs:
- finite relations (levels 1, 2, 4, 6, 7): the set A and the pairs are read back from the problem
  (the rows of the aligned block put together again) and compared with params; reflexive, symmetric,
  antisymmetric, transitive, total are decided by looking at every element, pair and triple;
- relations in words (level 3): each relation has its own predicate here, and a property is decided
  on every pair (and triple) of a window of N (0..30) or Z (-15..15), which contains the numbers of
  every counterexample;
- the classes (levels 4, 5) are recomputed from the pairs or from the remainders; the pairs to add
  (level 7) are the closure minus the relation, computed with Warshall's algorithm.
Then each of the four options is judged on its own: exactly one must be right, the one marked right.
"""
import re

from verify import FORBIDDEN

RN = r"\mathcal{R}"

CASE_RANGES = {
    1: {f"{p}-{t}": (0.06, 0.20) for p in ("rifl", "sim", "anti", "trans") for t in ("si", "no")},
    3: {f"{p}-{t}": (0.06, 0.20) for p in ("rifl", "sim", "anti", "trans") for t in ("si", "no")},
    4: {"quoziente": (0.50, 0.70), "classe": (0.30, 0.50)},
    5: {"classe": (0.32, 0.48), "appartiene": (0.14, 0.26), "quante": (0.10, 0.20), "rappresentante": (0.19, 0.31)},
    6: {c: (0.13, 0.27) for c in ("LT", "LP", "ST", "SP", "NO")},
    7: {"rifl": (0.10, 0.20), "sim": (0.19, 0.31), "trans": (0.24, 0.36), "equiv": (0.24, 0.36)},
}

SIGN_FORBIDDEN = [(n, rx) for n, rx in FORBIDDEN if n in ("+ -", "- -", "+ +")]


# ---------------------------------------------------------------------------
# Finite relations

def props(A, R):
    refl = all((a, a) in R for a in A)
    irrefl = all((a, a) not in R for a in A)
    sym = all((b, a) in R for (a, b) in R)
    anti = all(a == b or (b, a) not in R for (a, b) in R)
    trans = all((a, d) in R for (a, b) in R for (c, d) in R if b == c)
    total = all(a == b or (a, b) in R or (b, a) in R for a in A for b in A)
    return {"refl": refl, "irrefl": irrefl, "sym": sym, "anti": anti, "trans": trans, "total": total}


def closure(A, R):
    """Transitive closure (Warshall)."""
    S = set(R)
    for k in A:
        for i in A:
            if (i, k) in S:
                for j in A:
                    if (k, j) in S:
                        S.add((i, j))
    return S


def split_top(s):
    """Split at ', ' outside braces and parentheses."""
    out, depth, cur, i = [], 0, "", 0
    while i < len(s):
        if s[i] in "()":
            depth += 1 if s[i] == "(" else -1
            cur += s[i]
            i += 1
            continue
        if s.startswith(r"\{", i):
            depth += 1
            cur += r"\{"
            i += 2
            continue
        if s.startswith(r"\}", i):
            depth -= 1
            cur += r"\}"
            i += 2
            continue
        if depth == 0 and s.startswith(", ", i):
            out.append(cur)
            cur = ""
            i += 2
            continue
        cur += s[i]
        i += 1
    out.append(cur)
    return [x.strip() for x in out if x.strip()]


def el_key(t):
    """LaTeX element -> key: '3', 'a', '{}' for the empty set, '{1,2}' for a subset."""
    t = t.strip()
    if t == r"\emptyset":
        return "{}"
    m = re.fullmatch(r"\\\{(.*)\\\}", t)
    if m:
        return "{" + ",".join(x.strip() for x in m.group(1).split(",")) + "}"
    if not re.fullmatch(r"-?\d+|[a-e]", t):
        raise ValueError(f"unexpected element {t!r}")
    return t


def read_A(problem):
    m = re.search(r"A = \\\{(.*?)\\\}(?:,\\quad| \\\\ | \\end)", problem)
    if not m:
        raise ValueError("no A in the problem")
    return [el_key(x) for x in split_top(m.group(1))]


def read_R(problem):
    """The pairs of R as written, rows of the aligned block joined again."""
    m = re.search(r"(\\begin\{aligned\} )?\\mathcal\{R\} = (\\emptyset|\\\{(.*?)\\\})( \\end\{aligned\})?(?: \\\\ |$| \\end\{array\})", problem)
    if not m:
        raise ValueError("no R in the problem")
    if m.group(2) == r"\emptyset":
        return []
    body = m.group(3)
    aligned = bool(m.group(1))
    if aligned:
        rows = body.split(r", \\ &")
        if not rows[0].startswith("&"):
            raise ValueError("aligned R without & on the first row")
        rows[0] = rows[0][1:]
        if any("&" in r or r"\\" in r for r in rows):
            raise ValueError("malformed aligned rows")
        if any(len(re.findall(r"\(", r)) > 3 for r in rows):
            raise ValueError("more than three pairs on a row")
        body = r",\ ".join(rows)
    elif "&" in body or r"\\" in body:
        raise ValueError("line break outside aligned")
    items = body.split(r",\ ")
    pairs = []
    for it in items:
        mm = re.fullmatch(r"\((-?\w+), (-?\w+)\)", it.strip())
        if not mm:
            raise ValueError(f"bad pair {it!r}")
        pairs.append((mm.group(1), mm.group(2)))
    return pairs


def params_rel(p):
    A = list(p["A"])
    R = set()
    for k in p["R"]:
        a, b = k.split(":", 1)
        R.add((a, b))
    if len(R) != len(p["R"]):
        raise ValueError("repeated pairs in params.R")
    for a, b in R:
        if a not in A or b not in A:
            raise ValueError(f"pair ({a}, {b}) outside A")
    return A, R


def check_shown(sample, A, R, errs):
    try:
        shownA = read_A(sample["problem"])
        if shownA != A:
            errs.append(f"problem shows A = {shownA}, params {A}")
    except ValueError as e:
        errs.append(str(e))
    try:
        shownR = read_R(sample["problem"])
        if set(shownR) != R or len(shownR) != len(R):
            errs.append(f"problem shows R = {shownR}, params {sorted(R)}")
    except ValueError as e:
        errs.append(str(e))


# ---------------------------------------------------------------------------
# Relations in words (level 3)

def _mod(n):
    return (lambda a, b: a % n == b % n, f"lo stesso resto nella divisione per ${n}$")


WORDS = {
    "prodotto-positivo": ("Z", lambda a, b: a * b > 0, r"$a \cdot b > 0$"),
    "somma-pari": ("N", lambda a, b: (a + b) % 2 == 0, r"$a + b$ è pari"),
    "somma-dispari": ("N", lambda a, b: (a + b) % 2 == 1, r"$a + b$ è dispari"),
    "prodotto-pari": ("N", lambda a, b: (a * b) % 2 == 0, r"$a \cdot b$ è pari"),
    "prodotto-non-negativo": ("Z", lambda a, b: a * b >= 0, r"$a \cdot b \geq 0$"),
    "prodotto-negativo": ("Z", lambda a, b: a * b < 0, r"$a \cdot b < 0$"),
    "minore": ("N", lambda a, b: a < b, r"$a < b$"),
    "minore-uguale": ("N", lambda a, b: a <= b, r"$a \leq b$"),
    "maggiore": ("N", lambda a, b: a > b, r"$a > b$"),
    "maggiore-uguale": ("N", lambda a, b: a >= b, r"$a \geq b$"),
    "diverso": ("N", lambda a, b: a != b, r"$a \neq b$"),
    "ultima-cifra": ("N", lambda a, b: a % 10 == b % 10, "la stessa ultima cifra"),
    "valore-assoluto": ("Z", lambda a, b: abs(a) == abs(b), "$|a| = |b|$"),
    "divisore-n": ("N0", lambda a, b: b % a == 0, "è un divisore di"),
    "divisore-z": ("Z0", lambda a, b: b % a == 0, "è un divisore di"),
    "multiplo-n": ("N0", lambda a, b: a % b == 0, "è un multiplo di"),
}
for _n in (2, 3, 4, 5):
    WORDS[f"resto-{_n}"] = ("N",) + _mod(_n)
for _k in (2, 3):
    WORDS[f"volte-{_k}"] = ("N", (lambda k: lambda a, b: b == k * a)(_k), f"$b = {_k}a$")
for _k in (1, 2, 3):
    WORDS[f"vicini-{_k}"] = ("N", (lambda k: lambda a, b: abs(a - b) <= k)(_k), f"differiscono al massimo di ${_k}$")
for _t in (6, 8, 10, 12):
    WORDS[f"somma-{_t}"] = ("N", (lambda t: lambda a, b: a + b == t)(_t), f"$a + b = {_t}$")

INTRO = {
    "N": r"In $\mathbb{N}$",
    "Z": r"In $\mathbb{Z}$",
    "N0": "Tra i naturali diversi da zero",
    "Z0": "Tra gli interi diversi da zero",
}
WINDOW = {
    "N": list(range(0, 31)),
    "N0": list(range(1, 31)),
    "Z": list(range(-15, 16)),
    "Z0": [v for v in range(-15, 16) if v != 0],
}
_PROP_CACHE = {}


def word_props(code):
    if code not in _PROP_CACHE:
        dom, f, _ = WORDS[code]
        W = WINDOW[dom]
        R = {(a, b) for a in W for b in W if f(a, b)}
        _PROP_CACHE[code] = props(W, R)
    return _PROP_CACHE[code]


# ---------------------------------------------------------------------------
# Options

PROP_KEY = {"rifl": "refl", "sim": "sym", "anti": "anti", "trans": "trans"}


def judge_claim(v, prop, mem, dom_ok):
    """A "Sì"/"No: ..." option: right or wrong. mem(a, b) is membership on strings."""
    if v == ["si"]:
        return None  # decided by the caller
    t = v[0]
    xs = v[1:]
    if not all(dom_ok(x) for x in xs):
        raise ValueError(f"option with an element outside the set: {v}")
    if t == "rifl" and len(xs) == 2 and prop == "rifl":
        a, b = xs
        return a == b and not mem(a, a)
    if t == "sim" and len(xs) == 2 and prop == "sim":
        a, b = xs
        return mem(a, b) and not mem(b, a)
    if t == "anti" and len(xs) == 2 and prop == "anti":
        a, b = xs
        return a != b and mem(a, b) and mem(b, a)
    if t == "cappio" and len(xs) == 1 and prop == "anti":
        return False  # loops are allowed in an antisymmetric relation
    if t == "trans" and len(xs) == 3 and prop == "trans":
        a, b, c = xs
        return mem(a, b) and mem(b, c) and not mem(a, c)
    raise ValueError(f"option {v} does not fit property {prop}")


def claim_pairs(v):
    """The pairs an option names, in the order it writes them."""
    t, xs = v[0], v[1:]
    if t == "rifl":
        return [(xs[0], xs[1])]
    if t in ("sim", "anti"):
        return [(xs[0], xs[1]), (xs[1], xs[0])]
    if t == "cappio":
        return [(xs[0], xs[0])]
    if t == "trans":
        return [(xs[0], xs[1]), (xs[1], xs[2]), (xs[0], xs[2])]
    return []


def latex_pairs(latex):
    return [(a, b) for a, b in re.findall(r"\((-?\w+), (-?\w+)\)", latex)]


def latex_set(latex):
    """Elements of a listed set option, rows of a gathered joined again."""
    t = latex
    g = re.fullmatch(r"\\begin\{gathered\} \\Big\\\{(.*)\\Big\\\} \\end\{gathered\}", t)
    if g:
        rows = g.group(1).split(r" \\ ")
        if len(rows) < 2 or any(not r.endswith(",") for r in rows[:-1]):
            raise ValueError(f"rows not joined by commas: {latex}")
        t = r"\{" + " ".join(rows) + r"\}"
    m = re.fullmatch(r"\\\{(.*)\\\}", t)
    if not m:
        raise ValueError(f"not a listed set: {latex}")
    return [x.strip() for x in split_top(m.group(1))]


PROFILE_NAMES = {"R": "riflessiva", "S": "simmetrica", "A": "antisimmetrica", "T": "transitiva"}
CAT_TEXT = {
    "LT": "ordine largo totale",
    "LP": "ordine largo parziale",
    "ST": "ordine stretto totale",
    "SP": "ordine stretto parziale",
    "NO": "non è una relazione d'ordine",
}


def category(A, R):
    pr = props(A, R)
    if not (pr["anti"] and pr["trans"]) or not (pr["refl"] or pr["irrefl"]):
        return "NO"
    return ("L" if pr["refl"] else "S") + ("T" if pr["total"] else "P")


def rule_mem(rule, a, b):
    if rule in ("sube", "sub"):
        x = set(a[1:-1].split(",")) - {""}
        y = set(b[1:-1].split(",")) - {""}
        return x <= y if rule == "sube" else x < y
    x, y = int(a), int(b)
    return {
        "le": x <= y,
        "lt": x < y,
        "ge": x >= y,
        "gt": x > y,
        "div": y % x == 0,
        "divs": y % x == 0 and x != y,
        "absle": abs(x) <= abs(y),
    }[rule]


RULE_SHOWN = {
    "le": r"se $a \leq b$",
    "lt": r"se $a < b$",
    "ge": r"se $a \geq b$",
    "gt": r"se $a > b$",
    "div": r"se $a$ è un divisore di $b$}",
    "divs": r"se $a$ è un divisore di $b$ e $a \neq b$",
    "sube": r"se $X \subseteq Y$",
    "sub": r"se $X \subset Y$",
    "absle": r"se $|a| \leq |b|$",
}


# ---------------------------------------------------------------------------

def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    prob = sample["problem"]
    for name, rx in SIGN_FORBIDDEN:
        if rx.search(prob):
            errs.append(f"problem contains forbidden '{name}'")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    if RN not in prob:
        errs.append(r"problem does not name the relation \mathcal{R}")
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], None
    opts = ans["options"]
    if len(opts) != 4:
        errs.append("need 4 options")
    vals = [tuple(o["values"]) for o in opts]
    if len(set(vals)) != len(vals) or len({o["latex"] for o in opts}) != len(opts):
        errs.append("options not distinct")
    ch = sample.get("choice")
    if ch is None or ch.get("correct") != ans.get("correct") or [o["values"] for o in ch["options"]] != [o["values"] for o in opts]:
        errs.append("choice differs from the answer")

    right = []  # one bool per option
    kind = p.get("case")

    if lvl in (1, 2, 4, 6, 7) and not (lvl == 6 and p.get("rule")):
        A, R = params_rel(p)
        check_shown(sample, A, R, errs)
    elif lvl == 6:
        A, R = params_rel(p)
        try:
            if read_A(prob) != A:
                errs.append("problem shows another A")
        except ValueError as e:
            errs.append(str(e))
        rule = p["rule"]
        truth = {(a, b) for a in A for b in A if rule_mem(rule, a, b)}
        if truth != R:
            errs.append(f"params.R {sorted(R)} is not the rule {rule} on A")
        if RULE_SHOWN[rule] not in prob:
            errs.append(f"problem does not show the rule {rule}")

    if lvl == 1:
        prop = p["prop"]
        if not 3 <= len(A) <= 4 or not 3 <= len(R) <= 8:
            errs.append("A with 3-4 elements, R with 3-8 pairs")
        pr = props(A, R)
        truth = pr[PROP_KEY[prop]]
        mem = lambda a, b: (a, b) in R  # noqa: E731
        for o in opts:
            v = o["values"]
            if v == ["si"]:
                right.append(truth)
                if o["latex"] != r"\text{Sì}":
                    errs.append("Sì option with another text")
                continue
            right.append(judge_claim(v, prop, mem, lambda x: x in A))
            if latex_pairs(o["latex"]) != claim_pairs(v):
                errs.append(f"option text {o['latex']} does not match {v}")
            if not o["latex"].startswith(r"\text{No") and not o["latex"].startswith(r"\begin{gathered} \text{No"):
                errs.append("a counterexample option must start with No")
        want = f"{prop}-{'si' if truth else 'no'}"
        if kind != want:
            errs.append(f"case {kind}, expected {want}")
        if prop not in PROP_KEY or PROP_NAME_IT[prop] not in sample["prompt"]:
            errs.append("prompt does not name the property")
    elif lvl == 2:
        if not 3 <= len(A) <= 4 or not 3 <= len(R) <= 9:
            errs.append("A with 3-4 elements, R with 3-9 pairs")
        pr = props(A, R)
        truth = "".join(c for c, k in (("R", "refl"), ("S", "sym"), ("A", "anti"), ("T", "trans")) if pr[k])
        for o in opts:
            v = o["values"]
            code = "" if v == ["nessuna"] else "".join(v)
            if v != ["nessuna"] and (list(code) != [c for c in "RSAT" if c in code] or not code):
                raise ValueError(f"bad profile option {v}")
            right.append(code == truth)
            text = re.sub(r"\\begin\{gathered\}|\\end\{gathered\}|\\text\{|\}|\\\\", " ", o["latex"])
            names = [w.strip(" ,") for w in text.split() if w.strip(" ,")]
            expect = [PROFILE_NAMES[c] for c in code] if code else ["nessuna", "delle", "quattro"]
            if names != expect:
                errs.append(f"option {o['latex']} does not match {v}")
        if kind != (truth or "nessuna"):
            errs.append(f"case {kind}, profile {truth}")
    elif lvl == 3:
        code, prop = p["rel"], p["prop"]
        if code not in WORDS:
            return errs + [f"unknown relation {code}"], None
        dom, f, shown = WORDS[code]
        if p.get("dom") != dom:
            errs.append("wrong domain")
        flat = re.sub(r"\}\s*\\\\\s*\\text\{", " ", prob)
        if shown not in flat or INTRO[dom] not in flat:
            errs.append(f"problem does not show the relation {code}")
        truth = word_props(code)[PROP_KEY[prop]]
        W = WINDOW[dom]

        def mem(a, b):
            return f(int(a), int(b))

        for o in opts:
            v = o["values"]
            if v == ["si"]:
                right.append(truth)
                continue
            right.append(judge_claim(v, prop, mem, lambda x: re.fullmatch(r"-?\d+", x) and int(x) in W))
            if latex_pairs(o["latex"]) != claim_pairs(v):
                errs.append(f"option text {o['latex']} does not match {v}")
        want = f"{prop}-{'si' if truth else 'no'}"
        if kind != want:
            errs.append(f"case {kind}, expected {want}")
    elif lvl == 4:
        pr = props(A, R)
        if not (pr["refl"] and pr["sym"] and pr["trans"]):
            errs.append("level 4 relation is not an equivalence")
        if len(R) > 11 or not 3 <= len(A) <= 5:
            errs.append("3-5 elements, at most 11 pairs")
        classes = []
        for a in A:
            c = [x for x in A if (x, a) in R]
            if c not in classes:
                classes.append(c)
        ask = p["ask"]
        if ask == "classe":
            k = p["k"]
            target = [x for x in A if (x, k) in R]
            if f"[{k}] = \\ ?" not in prob:
                errs.append("problem does not ask for [k]")
        else:
            target = sorted(classes, key=lambda c: A.index(c[0]))
            if r"A/\mathcal{R} = \ ?" not in prob:
                errs.append("problem does not ask for A/R")
        for o in opts:
            v = o["values"]
            if v[0] == "Q":
                got = [c.split(",") for c in v[1:]]
                right.append(ask == "quoziente" and sorted(map(sorted, got)) == sorted(map(sorted, target)))
                inner = re.findall(r"\\\{([^{}\\]*)\\\}", o["latex"])
                if [[t.strip() for t in s.split(",")] for s in inner] != got:
                    errs.append(f"option {o['latex']} does not match {v}")
            else:
                got = v[1:]
                right.append(ask == "classe" and v[0] == "C" and sorted(got) == sorted(target))
                if latex_set(o["latex"]) != got:
                    errs.append(f"option {o['latex']} does not match {v}")
        if kind != ask:
            errs.append("case differs from ask")
    elif lvl == 5:
        variant, n, m, k = p["variant"], int(p["n"]), int(p["m"]), int(p["k"])
        if not 2 <= n <= 5:
            errs.append("n from 2 to 5")
        if f"divisione per ${n}$" not in re.sub(r"\}\s*\\\\\s*\\text\{", " ", prob):
            errs.append("problem does not show n")
        for o in opts:
            v = o["values"]
            if variant == "classe":
                if f"\\{{0, 1, 2, \\ldots, {m}\\}}" not in prob or f"[{k}] = \\ ?" not in prob:
                    errs.append("problem does not show A or [k]")
                truth = [x for x in range(0, m + 1) if x % n == k % n]
                right.append(v[0] == "C" and [int(x) for x in v[1:]] == truth)
                if [int(x) for x in latex_set(o["latex"])] != [int(x) for x in v[1:]]:
                    errs.append(f"option {o['latex']} does not match {v}")
            elif variant == "appartiene":
                if f"{k} \\in \\ ?" not in prob:
                    errs.append("problem does not show k")
                c = int(v[1])
                right.append(v[0] == "r" and c % n == k % n)
                if o["latex"] != f"[{c}]":
                    errs.append("class option text")
            elif variant == "quante":
                right.append(v[0] == "n" and int(v[1]) == n)
            elif variant == "rappresentante":
                if f"\\ ? \\in [{k}]" not in prob or not 0 <= k < n:
                    errs.append("problem does not show [r]")
                right.append(v[0] == "x" and int(v[1]) % n == k)
                if o["latex"] != v[1]:
                    errs.append("number option text")
            else:
                errs.append(f"unknown variant {variant}")
                right.append(False)
        if variant == "appartiene":
            names = {int(o["values"][1]) % n for o in opts}
            if len(names) != 4:
                errs.append("two options name the same class")
        if kind != variant:
            errs.append("case differs from variant")
    elif lvl == 6:
        if len(R) > 10:
            errs.append("at most 10 pairs")
        cat = category(A, R)
        for o in opts:
            c = o["values"][0]
            right.append(c == cat)
            if o["latex"] != f"\\text{{{CAT_TEXT[c]}}}":
                errs.append("category option text")
        if kind != cat:
            errs.append(f"case {kind}, category {cat}")
    elif lvl == 7:
        target = p["target"]
        if len(R) > 6:
            errs.append("at most 6 pairs")
        if target == "rifl":
            full = R | {(a, a) for a in A}
        elif target == "sim":
            full = R | {(b, a) for (a, b) in R}
        elif target == "trans":
            full = closure(A, R)
        elif target == "equiv":
            full = closure(A, R | {(b, a) for (a, b) in R} | {(a, a) for a in A})
        else:
            return errs + [f"unknown target {target}"], None
        add = full - R
        pr = props(A, full)
        need = {"rifl": ["refl"], "sim": ["sym"], "trans": ["trans"], "equiv": ["refl", "sym", "trans"]}[target]
        if not all(pr[x] for x in need):
            errs.append("closure does not have the property")
        if not 1 <= len(add) <= 5:
            errs.append(f"{len(add)} pairs to add, expected 1-5")
        for o in opts:
            v = o["values"]
            got = [tuple(x.split(":", 1)) for x in v[1:]]
            if v[0] != "P" or not got:
                raise ValueError(f"bad pairs option {v}")
            ok = set(got) == add and len(got) == len(add)
            # a wrong option must really fail: either the property is missing or some pair is not needed
            if not ok:
                bigger = R | set(got)
                has_prop = all(props(A, bigger)[x] for x in need)
                if has_prop and set(got) <= add:
                    errs.append(f"option {v} is a smaller valid answer")
            right.append(ok)
            shown = latex_set(o["latex"])
            if [tuple(x.split(", ")) for x in (s[1:-1] for s in shown)] != got:
                errs.append(f"option {o['latex']} does not match {v}")
        if {tuple(x.split(":", 1)) for x in p.get("add", [])} != add:
            errs.append("params.add differs from the closure")
        if TARGET_IT[target] not in sample["prompt"]:
            errs.append("prompt does not name the target")
        if kind != target:
            errs.append("case differs from target")
    else:
        return errs + [f"unknown level {lvl}"], None

    if len(right) == len(opts):
        if sum(1 for r in right if r) != 1:
            errs.append(f"{sum(1 for r in right if r)} right options")
        idx = ans.get("correct")
        if not isinstance(idx, int) or not 0 <= idx < len(opts) or not right[idx]:
            errs.append("correct index does not point to the right option")
    return errs, kind


PROP_NAME_IT = {"rifl": "riflessiva", "sim": "simmetrica", "anti": "antisimmetrica", "trans": "transitiva"}
TARGET_IT = {"rifl": "riflessiva", "sim": "simmetrica", "trans": "transitiva", "equiv": "di equivalenza"}
