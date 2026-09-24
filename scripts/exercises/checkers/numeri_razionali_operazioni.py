"""Checker for numeri-razionali-operazioni, from specs/exercises/numeri-razionali-operazioni.md.

params.expr is a small tree: leaves {t: "n", v: "p/q"} and nodes {t: add|sub|mul|div, a, b}. It is
evaluated here with SymPy's Rational, and rendered to LaTeX again from the spec's rules (negative
numbers in parentheses except the first term of a sum, sums in parentheses inside a product or a
quotient), so the problem shown is checked against the tree.
"""
import re
from math import gcd

from sympy import Rational

from verify import rat

FRAC_RE = re.compile(r"^(-?)\\frac\{(\d+)\}\{(\d+)\}$|^(-?\d+)$")

CASE_RANGES = {
    1: {"somma": (0.45, 0.75), "differenza": (0.25, 0.55)},
    2: {"somma": (0.45, 0.75), "differenza": (0.25, 0.55)},
    3: {"frazione negativa": (0.25, 0.55), "meno una negativa": (0.15, 0.45), "intero": (0.15, 0.45)},
    4: {"discordi": (0.35, 0.65), "negativi": (0.15, 0.45), "positivi": (0.05, 0.35)},
    5: {"frazioni": (0.55, 0.85), "intero": (0.15, 0.45)},
    6: {"parentesi": (0.35, 0.65), "precedenza": (0.35, 0.65)},
    7: {"somma": (0.25, 0.55), "resto": (0.45, 0.75)},
}

SUM = ("add", "sub")
PROD = ("mul", "div")


def ev(n):
    t = n["t"]
    if t == "n":
        return rat(n["v"])
    a, b = ev(n["a"]), ev(n["b"])
    if t == "add":
        return a + b
    if t == "sub":
        return a - b
    if t == "mul":
        return a * b
    if t == "div":
        if b == 0:
            raise ZeroDivisionError("division by zero")
        return a / b
    raise ValueError(f"unknown node {t}")


def num_tex(r):
    if r.q == 1:
        return f"{r.p}"
    return ("-" if r < 0 else "") + rf"\frac{{{abs(r.p)}}}{{{r.q}}}"


def tex(n, first=True):
    t = n["t"]
    if t == "n":
        r = rat(n["v"])
        if r < 0 and not first:
            return f"({r.p})" if r.q == 1 else rf"\left({num_tex(r)}\right)"
        return num_tex(r)
    sym = {"add": "+", "sub": "-", "mul": r"\cdot", "div": ":"}[t]
    if t in SUM:
        return f"{tex(n['a'], first)} {sym} {tex(n['b'], False)}"

    def side(m):
        return rf"\left({tex(m, True)}\right)" if m["t"] in SUM else tex(m, False)

    return f"{side(n['a'])} {sym} {side(n['b'])}"


def leaves(n):
    return [rat(n["v"])] if n["t"] == "n" else leaves(n["a"]) + leaves(n["b"])


def inner_values(n):
    if n["t"] == "n":
        return [rat(n["v"])]
    return inner_values(n["a"]) + inner_values(n["b"]) + [ev(n)]


def parse_num(latex):
    m = FRAC_RE.match(latex)
    if not m:
        return None
    if m.group(4) is not None:
        return Rational(int(m.group(4)))
    v = Rational(int(m.group(2)), int(m.group(3)))
    return -v if m.group(1) else v


def cross(x, y):
    """Some numerator shares a factor with the other fraction's denominator."""
    return gcd(abs(x.p), y.q) > 1 or gcd(abs(y.p), x.q) > 1


def check(sample):
    if sample["level"] == 7:
        return check_problem(sample)
    errs = []
    p = sample["params"]
    e = p["expr"]
    lvl = sample["level"]
    try:
        truth = ev(e)
        inner = inner_values(e)
    except Exception as ex:  # noqa: BLE001
        return [f"cannot evaluate: {ex}"], None
    if sample["problem"] != tex(e):
        errs.append(f"problem {sample['problem']} != tree {tex(e)}")
    ans = sample["answer"]
    if ans.get("kind") != "number" or rat(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    elif ans["value"] != (f"{truth.p}" if truth.q == 1 else f"{truth.p}/{truth.q}"):
        errs.append("answer not reduced")
    if truth == 0:
        errs.append("result is zero")
    if abs(truth.p) > 150 or truth.q > 60:
        errs.append(f"result {truth} too large")
    if any(abs(v.p) > 150 or v.q > 72 for v in inner):
        errs.append("intermediate value too large")
    if re.search(r"\+\s*-|-\s*-|\+\s*\+", sample["problem"]):
        errs.append("double sign in problem")
    ls = leaves(e)
    if any(v == 0 for v in ls):
        errs.append("zero operand")
    fracs = [v for v in ls if v.q != 1]
    two = e["t"] != "n" and e["a"]["t"] == "n" and e["b"]["t"] == "n"
    t = e["t"]
    kind = None
    if lvl in (1, 2, 3):
        if not two or t not in SUM:
            errs.append(f"level {lvl}: sum or difference of two numbers")
            return errs, None
        x, y = ls
        if lvl in (1, 2):
            kind = "somma" if t == "add" else "differenza"
            if len(fracs) != 2 or x < 0 or y < 0:
                errs.append(f"level {lvl}: two positive fractions")
        if lvl == 1:
            if x.q != y.q:
                errs.append("level 1: same denominator")
            raw = x.p + y.p if t == "add" else x.p - y.p
            if gcd(raw, x.q) == 1:
                errs.append("level 1: the result must need reducing")
            if truth.q == 1:
                errs.append("level 1: integer result")
            if x.q > 16:
                errs.append("level 1: denominator above 16")
        elif lvl == 2:
            if x.q == y.q:
                errs.append("level 2: different denominators")
            if truth <= 0:
                errs.append("level 2: result must be positive")
            if max(x.q, y.q) > 15 or x.q * y.q // gcd(x.q, y.q) > 60:
                errs.append("level 2: denominators up to 15, MCM up to 60")
        else:
            if len(fracs) == 2 and x < 0 < y and x.q != y.q:
                kind = "frazione negativa"
            elif len(fracs) == 2 and t == "sub" and y < 0 < x and x.q != y.q:
                kind = "meno una negativa"
            elif len(fracs) == 1 and x > 0 and y > 0 and ls[0 if ls[0].q == 1 else 1] <= 5:
                kind = "intero"
            else:
                errs.append(f"level 3: unexpected form {sample['problem']}")
    elif lvl in (4, 5):
        op = "mul" if lvl == 4 else "div"
        if not two or t != op:
            errs.append(f"level {lvl}: a {'product' if lvl == 4 else 'quotient'} of two numbers")
            return errs, None
        x, y = ls
        z = y if lvl == 4 else 1 / y
        if not cross(x, z):
            errs.append(f"level {lvl}: no cross simplification{' after the reciprocal' if lvl == 5 else ''}")
        if truth.q == 1:
            errs.append(f"level {lvl}: integer result")
        if any(abs(v.p) > 40 or v.q > 40 for v in ls):
            errs.append(f"level {lvl}: terms above 40")
        if lvl == 4:
            if len(fracs) != 2:
                errs.append("level 4: two fractions")
            negs = sum(1 for v in ls if v < 0)
            kind = {0: "positivi", 1: "discordi", 2: "negativi"}[negs]
        else:
            if not fracs:
                errs.append("level 5: at least one fraction")
            if abs(y) == 1:
                errs.append("level 5: divisor 1 or -1")
            kind = "frazioni" if len(fracs) == 2 else "intero"
    elif lvl == 6:
        if two or t == "n":
            errs.append("level 6: two operations")
            return errs, None
        sub = e["b"] if e["a"]["t"] == "n" else e["a"]
        other = e["a"] if sub is e["b"] else e["b"]
        if other["t"] != "n" or sub["a"]["t"] != "n" or sub["b"]["t"] != "n":
            errs.append("level 6: exactly three numbers")
        if t in PROD and sub["t"] in SUM:
            kind = "parentesi"
            if ev(sub) == 0:
                errs.append("level 6: the parenthesis is zero")
        elif t in SUM and sub["t"] in PROD:
            kind = "precedenza"
        else:
            errs.append("level 6: a sum and a product or quotient")
    else:
        errs.append(f"unknown level {lvl}")
    if kind is not None and p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but expression is {kind}")

    errs += check_choice(sample, truth)
    if not sample.get("steps"):
        errs.append("no steps")
    return errs, kind


def check_choice(sample, truth):
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no multiple-choice variant"]
    opts = ch["options"]
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    vals = []
    for o in opts:
        shown = parse_num(o["latex"])
        v = rat(o["values"][0])
        if shown is None or shown != v:
            errs.append(f"option {o['latex']} does not show {v}")
        vals.append(v)
    if len(set(vals)) != len(vals):
        errs.append("options not distinct")
    if [i for i, v in enumerate(vals) if v == truth] != [ch.get("correct")]:
        errs.append("choice.correct is wrong or not unique")
    return errs


# ---------------------------------------------------------------------------
# Level 7: word problems (spec, "Livello 7"). The answer is recomputed from params.x, params.y,
# params.case, params.ask and params.total; the text is read back from the \text{} lines.

ONE = Rational(1)
DENS = {2, 3, 4, 5, 6, 7, 8, 9, 10, 12}
# story: (min total, max total, step, keyword of the "resta" question, keyword of the "seconda" question)
STORIES = {
    "stipendio": (1200, 2400, 50, r"rest", r"spesa"),
    "libro": (96, 480, 1, r"resta", r"secondo giorno"),
    "viaggio": (300, 1200, 10, r"resta", r"secondo giorno"),
    "risparmi": (60, 360, 5, r"rest", r"videogioco"),
    "figurine": (240, 720, 1, r"vuota|mancano", r"ottobre"),
    "orto": (60, 360, 1, r"liber", r"zucchine"),
    "nuoto": (1000, 3000, 50, r"rana", r"dorso"),
    "scuola": (300, 1200, 1, r"piedi", r"bicicletta"),
}
# Words that say "of what is left": they must be in the text of a "resto" problem, and not in a "somma" one.
REST_WORDS = re.compile(r"che (le |gli )?rimane|che restano|che manca|che mancano|rimasta|degli altri")


def prose_of(problem):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", problem, re.S)
    body = m.group(1) if m else problem
    out = []
    for line in body.split(r" \\ "):
        t = re.fullmatch(r"\\text\{(.*)\}", line.strip(), re.S)
        if not t:
            return None
        out.append(t.group(1))
    return " ".join(out)


def check_problem(sample):
    errs = []
    p = sample["params"]
    kind, ask, story = p.get("case"), p.get("ask"), p.get("story")
    if story not in STORIES:
        return [f"unknown story {story}"], None
    if kind not in ("somma", "resto") or ask not in ("resta", "seconda"):
        return [f"unknown case {kind}/{ask}"], None
    lo, hi, step, kw_rest, kw_second = STORIES[story]
    x, y = rat(p["x"]), rat(p["y"])
    for f in (x, y):
        if not (0 < f <= Rational(3, 4)) or f.q not in DENS:
            errs.append(f"fraction {f}: at most 3/4, denominator in {sorted(DENS)}")
    if x == y:
        errs.append("same fraction twice")
    if kind == "somma":
        if ask != "resta":
            errs.append("somma asks what is left")
        if x.q == y.q:
            errs.append("somma: same denominator")
        if x.q * y.q // gcd(x.q, y.q) > 40:
            errs.append("somma: MCM above 40")
        truth = ONE - (x + y)
    else:
        left = ONE - x
        second = y * left
        truth = second if ask == "seconda" else left - second
    if truth <= 0 or truth.q > 60:
        errs.append(f"asked fraction {truth}: positive, denominator up to 60")
    total = p.get("total")
    if total is not None:
        t = int(total)
        if not (lo <= t <= hi) or t % step:
            errs.append(f"total {t} outside {lo}-{hi} step {step}")
        parts = [x * t, y * t] if kind == "somma" else [x * t, y * (ONE - x) * t]
        if any(not v.is_integer for v in parts):
            errs.append("a part of the total is not a whole number")
        truth = truth * t
        if not truth.is_integer:
            errs.append("answer with the total not an integer")
    ans = sample["answer"]
    shown = f"{truth.p}" if truth.q == 1 else f"{truth.p}/{truth.q}"
    if ans.get("kind") != "number" or ans.get("value") != shown:
        errs.append(f"answer {ans.get('value')} != {shown}")

    prose = prose_of(sample["problem"])
    if prose is None:
        errs.append("problem is not made of \\text lines")
    else:
        fx, fy = rf"$\frac{{{x.p}}}{{{x.q}}}$", rf"$\frac{{{y.p}}}{{{y.q}}}$"
        ix = prose.find(fx)
        if ix < 0 or prose.find(fy, ix + len(fx)) < 0:
            errs.append("the two fractions are not in the text, in order")
        plain = re.sub(r"\$[^$]*\$", "", prose)
        nums = re.findall(r"\d+", plain)
        if nums != ([str(total)] if total is not None else []):
            errs.append(f"numbers in the text {nums}, expected only the total")
        if bool(REST_WORDS.search(prose)) != (kind == "resto"):
            errs.append(f"text does not match case {kind}")
        if not prose.endswith("?"):
            errs.append("text does not end with a question")
        question = re.split(r"[.;:] ", prose)[-1]
        if not question.startswith("Quant" if total is not None else "Che frazione"):
            errs.append(f"question {question!r} does not match the total")
        right, other = (kw_rest, kw_second) if ask == "resta" else (kw_second, kw_rest)
        if not re.search(right, question) or re.search(other, question):
            errs.append(f"question {question!r} does not ask {ask}")
        if re.search(r"—|piuttosto che", prose):
            errs.append("forbidden wording")
    if sample.get("prompt") != "Risolvi il problema.":
        errs.append("prompt")
    errs += check_choice(sample, truth)
    if not sample.get("steps"):
        errs.append("no steps")
    return errs, kind
