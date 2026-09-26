"""Checker for disequazioni-primo-grado, written from specs/exercises/disequazioni-primo-grado.md.

Levels 1-6: it reads the problem from its LaTeX (an inequality in x, or at level 1 an interval or a
disuguaglianza), solves it with SymPy's solveset over the reals, reads back every option from its LaTeX
(intervals written \\mathopen{]} / \\mathclose{[}, or \\left] \\right[ around a fraction, S = \\mathbb{R},
S = \\emptyset, or a disuguaglianza) and compares it with the option's values and with the truth. It checks
the distractors the spec asks for (the sign not turned, the endpoint included the wrong way, the other
case between R and the empty set), the steps and the constraints of each level.

Level 7: it recomputes the answer of the word problem from the data of the story, counting whole numbers
one by one, and checks the multiple choice.
"""
import re

from sympy import EmptySet, Interval, Rational, S, expand, ilcm, oo, solveset, sympify
from sympy import Ge, Gt, Le, Lt

from verify import FORBIDDEN, x

CASE_RANGES = {
    1: {"intervallo": (0.38, 0.62), "disuguaglianza": (0.38, 0.62)},
    3: {"negativo": (0.60, 0.80), "positivo": (0.20, 0.40)},
    4: {"negativo": (0.20, 0.80), "positivo": (0.20, 0.80)},
    5: {"negativo": (0.15, 0.85), "positivo": (0.15, 0.85)},
    6: {"sempre": (0.32, 0.48), "impossibile": (0.32, 0.48), "determinata": (0.14, 0.26)},
    7: {s: (0.13, 0.27) for s in ("spesa", "voto", "tariffe", "conviene", "risparmio")},
}

RELS = {r"\le": Le, r"\ge": Ge, "<": Lt, ">": Gt}
REL_OF = {"<": Lt, "<=": Le, ">": Gt, ">=": Ge}

# ---------------------------------------------------------------------------
# Reading LaTeX

FRAC = re.compile(r"\\frac\{([^{}]*)\}\{([^{}]*)\}")


def expr_of(tex):
    """A side of the inequality: 4(x + 1) - 3, \\frac{x - 2}{3} - \\frac{x + 1}{2}, -(x - 2)."""
    s = FRAC.sub(r"((\1)/(\2))", tex.strip())
    if not re.fullmatch(r"[0-9x+\-*/() ]+", s):
        raise ValueError(f"unreadable side {tex!r}")
    s = re.sub(r"(\d)\s*x", r"\1*x", s)
    s = re.sub(r"(\d)\s*\(", r"\1*(", s)
    s = re.sub(r"\)\s*\(", r")*(", s)
    s = re.sub(r"x\s*\(", r"x*(", s)
    return sympify(s, locals={"x": x})


def parse_inequality(tex):
    parts = re.split(r" (\\le|\\ge|<|>) ", tex)
    if len(parts) != 3:
        raise ValueError(f"not one inequality: {tex!r}")
    return expr_of(parts[0]), parts[1], expr_of(parts[2])


def value(t):
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        v = Rational(int(m.group(2)), int(m.group(3)))
        if v.q == 1 or v.p != int(m.group(2)):
            raise ValueError(f"fraction not reduced {t!r}")
        return -v if m.group(1) else v
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable value {t!r}")


OPEN = r"(\[|\\mathopen\{\]\}|\\left\[|\\left\])"
CLOSE = r"(\]|\\mathclose\{\[\}|\\right\]|\\right\[)"
END = r"(-\\infty|\+\\infty|-?\d+|-?\\frac\{\d+\}\{\d+\})"
INTERVAL = re.compile(OPEN + END + ", " + END + CLOSE)


def read_interval(tex):
    """('I', lo, loIn, hi, hiIn), lo/hi None for an infinite end. Checks the bracket forms."""
    m = INTERVAL.fullmatch(tex)
    if not m:
        raise ValueError(f"not an interval: {tex!r}")
    op, a, b, cl = m.groups()
    big = op.startswith(r"\left")
    if big != cl.startswith(r"\right"):
        raise ValueError(f"\\left without \\right: {tex!r}")
    frac = r"\frac" in a or r"\frac" in b
    if frac != big:
        raise ValueError(f"brackets {'grown' if big else 'plain'} with {'a fraction' if frac else 'integers'}: {tex!r}")
    lo_in = op in ("[", r"\left[")
    hi_in = cl in ("]", r"\right]")
    if a == r"+\infty" or b == r"-\infty":
        raise ValueError(f"infinity at the wrong end: {tex!r}")
    lo = None if a == r"-\infty" else value(a)
    hi = None if b == r"+\infty" else value(b)
    if lo is not None and hi is not None and lo >= hi:
        raise ValueError(f"empty interval {tex!r}")
    # [-\infty or +\infty] is read as written: a distractor of level 1, never a set (to_set gives None)
    return ("I", lo, lo_in, hi, hi_in)


def read_inequality_set(tex):
    """A disuguaglianza in x alone: -1 \\le x < 3, x > 2."""
    m = re.fullmatch(r"(\S+) (\\le|<) x (\\le|<) (\S+)", tex)
    if m:
        lo, hi = value(m.group(1)), value(m.group(4))
        if lo >= hi:
            raise ValueError(f"empty {tex!r}")
        return ("I", lo, m.group(2) == r"\le", hi, m.group(3) == r"\le")
    m = re.fullmatch(r"x (\\le|\\ge|<|>) (\S+)", tex)
    if not m:
        raise ValueError(f"not a disuguaglianza: {tex!r}")
    v, r = value(m.group(2)), m.group(1)
    if r in (">", r"\ge"):
        return ("I", v, r == r"\ge", None, False)
    return ("I", None, False, v, r == r"\le")


def read_set(tex):
    """An option or a final step: S = \\mathbb{R}, S = \\emptyset, S = <interval>, or a bare interval."""
    t = tex.strip()
    if t.startswith("S = "):
        t = t[4:]
        if t == r"\mathbb{R}":
            return ("R",)
        if t == r"\emptyset":
            return ("E",)
    return read_interval(t)


def from_values(vals):
    if vals == ["R"]:
        return ("R",)
    if vals == ["E"]:
        return ("E",)
    if len(vals) != 4 or vals[1] not in ("0", "1") or vals[3] not in ("0", "1"):
        raise ValueError(f"bad values {vals}")
    lo = None if vals[0] == "-oo" else Rational(vals[0])
    hi = None if vals[2] == "+oo" else Rational(vals[2])
    return ("I", lo, vals[1] == "1", hi, vals[3] == "1")


def to_set(k):
    """The SymPy set of a key; None for a writing that is not a set ([-\\infty)."""
    if k[0] == "R":
        return S.Reals
    if k[0] == "E":
        return EmptySet
    _, lo, lo_in, hi, hi_in = k
    if (lo is None and lo_in) or (hi is None and hi_in):
        return None
    return Interval(-oo if lo is None else lo, oo if hi is None else hi, left_open=not lo_in, right_open=not hi_in)


def key_of_set(st):
    if st == S.Reals:
        return ("R",)
    if st == EmptySet:
        return ("E",)
    if not isinstance(st, Interval):
        raise ValueError(f"solution is not an interval: {st}")
    lo = None if st.start == -oo else st.start
    hi = None if st.end == oo else st.end
    return ("I", lo, lo is not None and not st.left_open, hi, hi is not None and not st.right_open)


def verso_flip(k):
    """The other half-line from the same endpoint, included the same way."""
    if k[0] != "I":
        return None
    _, lo, lo_in, hi, hi_in = k
    if lo is not None and hi is None:
        return ("I", None, False, lo, lo_in)
    if lo is None and hi is not None:
        return ("I", hi, hi_in, None, False)
    return None


def bracket_flip(k):
    if k[0] != "I":
        return None
    _, lo, lo_in, hi, hi_in = k
    if lo is not None and hi is None:
        return ("I", lo, not lo_in, None, False)
    if lo is None and hi is not None:
        return ("I", None, False, hi, not hi_in)
    return None


# ---------------------------------------------------------------------------
# The choice


def check_options(ch, truth_key, reader):
    errs, keys = [], []
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    truth = to_set(truth_key)
    for o in opts:
        try:
            k = reader(o["latex"])
        except ValueError as e:
            k = None
            errs.append(str(e))
        try:
            vk = from_values(o["values"])
        except ValueError as e:
            errs.append(str(e))
            vk = None
        if k is not None and vk != k:
            errs.append(f"option latex {o['latex']} != values {o['values']}")
        keys.append(k)
    if len(set(keys)) != len(keys):
        errs.append("choice options not distinct")
    right = [i for i, k in enumerate(keys) if k is not None and to_set(k) is not None and to_set(k) == truth]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth")
    if ch.get("correct") not in right or len(right) != 1:
        errs.append("choice.correct is wrong")
    return errs, keys


# ---------------------------------------------------------------------------
# Levels 1-6


def check_level1(sample):
    errs = []
    p = sample["params"]
    problem = sample["problem"]
    try:
        truth = read_interval(problem)
        direction = "disuguaglianza"
        reader = read_inequality_set
    except ValueError:
        truth = read_inequality_set(problem)
        direction = "intervallo"
        reader = read_interval
    if p.get("direction") != direction:
        errs.append(f"params.direction {p.get('direction')} but the problem asks for {direction}")
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], direction
    e, keys = check_options(ans, truth, reader)
    errs += e
    _, lo, lo_in, hi, hi_in = truth
    ends = [v for v in (lo, hi) if v is not None]
    if any(not v.is_integer or abs(v) > 10 for v in ends):
        errs.append(f"endpoints {ends} not integers up to 10")
    if lo is not None and hi is not None:
        combos = {("I", lo, a, hi, b) for a in (True, False) for b in (True, False)}
        if set(keys) != combos:
            errs.append("bounded interval: the options must be the four brackets")
        if hi - lo > 10:
            errs.append("bounded interval longer than 10")
    else:
        if bracket_flip(truth) not in keys:
            errs.append("missing the endpoint included the wrong way")
        if direction == "disuguaglianza":
            v = lo if lo is not None else hi
            want = {("I", v, True, None, False), ("I", v, False, None, False), ("I", None, False, v, True), ("I", None, False, v, False)}
            if set(keys) != want:
                errs.append("half-line: the options must be the four signs")
    try:
        if reader(sample["solution"]) != truth:
            errs.append("solution differs from the truth")
    except ValueError as e:
        errs.append(f"solution: {e}")
    return errs, direction


def side_of_params(terms):
    out = 0
    for t in terms:
        k, a, b, d = (int(t[c]) for c in "kabd")
        out += Rational(k, d) * (a * x + b)
    return expand(out)


def check_inequality(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    problem = sample["problem"]
    for name, rx in FORBIDDEN:
        if rx.search(problem):
            errs.append(f"problem contains forbidden '{name}': {problem}")
    L, rel, R = parse_inequality(problem)
    truth_set = solveset(RELS[rel](L, R), x, S.Reals)
    truth = key_of_set(truth_set)

    # params say the same inequality
    if expand(side_of_params(p["lhs"]) - L) != 0 or expand(side_of_params(p["rhs"]) - R) != 0:
        errs.append("params differ from the text")
    if RELS[rel] is not REL_OF.get(p.get("rel")):
        errs.append("params.rel differs from the text")
    try:
        if from_values(p["set"]) != truth:
            errs.append(f"params.set {p['set']} != truth {truth}")
    except ValueError as e:
        errs.append(str(e))

    D = expand(L - R)
    A = D.coeff(x, 1)
    if D.coeff(x, 2) != 0:
        errs.append("not of first degree")

    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], None
    e, keys = check_options(ans, truth, read_set)
    errs += e
    if any(k is not None and to_set(k) is None for k in keys):
        errs.append("an option includes an infinite end (only level 1 has that mistake)")
    if truth[0] == "I":
        if lvl != 6 or A != 0:
            if verso_flip(truth) not in keys:
                errs.append("missing the sign turned the wrong way")
        if lvl in (2, 3) and bracket_flip(truth) not in keys:
            errs.append("missing the endpoint included the wrong way")
        if lvl == 6 and not {("R",), ("E",)} <= set(keys):
            errs.append("level 6 interval: R and the empty set must be options")
    else:
        other = ("E",) if truth[0] == "R" else ("R",)
        if other not in keys:
            errs.append("missing the other case between R and the empty set")

    # solution and last step
    for where, tex in (("solution", sample.get("solution", "")), ("last step", (sample.get("steps") or [""])[-1])):
        try:
            if read_set(tex) != truth:
                errs.append(f"{where} {tex} != truth")
        except ValueError as e:
            errs.append(f"{where}: {e}")
    steps = sample.get("steps") or []
    # the coefficient of x after multiplying by the MCM of the denominators, as the steps divide by it
    M = ilcm(1, 1, *[int(d) for d in re.findall(r"\\frac\{[^{}]*\}\{(\d+)\}", problem)])
    As = A * M
    if truth[0] == "I" and As < 0 and not any("cambia il verso" in s for s in steps):
        errs.append("steps do not say the sign turns")
    if truth[0] == "I" and As > 1 and not any("positivo, e il verso resta" in s for s in steps):
        errs.append("steps do not say the sign stays")

    # levels
    endpoint = None
    if truth[0] == "I":
        endpoint = truth[1] if truth[1] is not None else truth[3]
    int10 = endpoint is not None and endpoint.is_integer and abs(endpoint) <= 10
    has_frac = r"\frac" in problem
    has_paren = "(" in problem
    rx = R.coeff(x, 1) != 0
    lx = L.coeff(x, 1) != 0
    kind = None
    if lvl in (2, 3, 4, 5) and truth[0] != "I":
        errs.append("levels 2-5 need an interval")
    if lvl == 2:
        if has_frac or has_paren or rx or A <= 1:
            errs.append("level 2: ax + b ⋈ c with a from 2 to 9")
        if not int10:
            errs.append(f"level 2: integer endpoint up to 10, got {endpoint}")
    elif lvl == 3:
        if has_frac or has_paren or rx or A == 0:
            errs.append("level 3: ax + b ⋈ c")
        B = -D.coeff(x, 0)
        if A > 0 and B >= 0:
            errs.append("level 3: a positive coefficient needs a negative right side")
        kind = "negativo" if A < 0 else "positivo"
        if not int10:
            errs.append(f"level 3: integer endpoint up to 10, got {endpoint}")
    elif lvl == 4:
        if has_frac or not has_paren or not rx or not lx:
            errs.append("level 4: parentheses and x on both sides, no denominators")
        kind = "negativo" if A < 0 else "positivo"
        if not int10:
            errs.append(f"level 4: integer endpoint up to 10, got {endpoint}")
    elif lvl == 5:
        dens = {int(d) for d in re.findall(r"\\frac\{[^{}]*\}\{(\d+)\}", problem)}
        if len(dens) < 2 or max(dens) > 6:
            errs.append(f"level 5: at least two different denominators up to 6, got {dens}")
        kind = "negativo" if A < 0 else "positivo"
        if endpoint is None or endpoint.q > 5 or abs(endpoint.p) > 60:
            errs.append(f"level 5: endpoint p/q with q up to 5, got {endpoint}")
    elif lvl == 6:
        kind = "determinata" if A != 0 else ("sempre" if truth == ("R",) else "impossibile")
        if p.get("kind") != kind:
            errs.append(f"params.kind {p.get('kind')} but the inequality is {kind}")
        if A != 0 and not int10:
            errs.append("level 6 interval: integer endpoint up to 10")
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind


# ---------------------------------------------------------------------------
# Level 7


def truth_problem(p):
    n = lambda k: int(p[k])  # noqa: E731
    story = p.get("story")
    if story == "spesa":
        xs = [k for k in range(0, 1001) if n("Z") + n("p") * k <= n("B")]
        return max(xs) if xs else None
    if story == "voto":
        g = [int(v) for v in p["grades"].split(",")]
        xs = [k for k in range(0, 11) if Rational(sum(g) + k, len(g) + 1) >= n("m")]
        return min(xs) if xs else None
    if story == "tariffe":
        xs = [k for k in range(0, 1001) if n("f") + n("r") * k < n("F")]
        return max(xs) if xs else None
    if story == "conviene":
        xs = [k for k in range(0, 1001) if n("f2") + n("r2") * k < n("f1") + n("r1") * k]
        return min(xs) if xs else None
    if story == "risparmio":
        xs = [k for k in range(0, 1001) if n("A") + n("r") * k >= n("target")]
        return min(xs) if xs else None
    return None


GIVEN = {
    "spesa": ("B", "Z", "p"),
    "voto": ("m",),
    "tariffe": ("F", "f", "r"),
    "conviene": ("f1", "r1", "f2", "r2"),
    "risparmio": ("r", "target"),
}


def check_problem(sample):
    errs = []
    p = sample["params"]
    story = p.get("story")
    if story not in GIVEN:
        return [f"unknown story {story}"], None
    truth = truth_problem(p)
    if truth is None or truth <= 0:
        return ["no positive whole answer"], story
    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(truth):
        errs.append(f"answer {ans.get('value')} != {truth}")
    text = " ".join(re.findall(r"\\text\{([^{}]*)\}", sample["problem"]))
    nums = set(re.findall(r"\d+", text))
    for k in GIVEN[story]:
        if str(p[k]) not in nums:
            errs.append(f"{k} = {p[k]} not in the text")
    if story == "voto":
        g = p["grades"].split(",")
        if any(v not in nums for v in g) or truth > 10:
            errs.append("voto: grades missing from the text or answer over 10")
    if story == "risparmio" and int(p["A"]) and p["A"] not in nums:
        errs.append("risparmio: starting savings missing from the text")
    ch = sample.get("choice")
    if not ch:
        errs.append("no choice")
    else:
        vals = [o["values"] for o in ch["options"]]
        if len(vals) != 4 or len({tuple(v) for v in vals}) != 4:
            errs.append("choice needs four distinct options")
        if any(len(v) != 1 or not re.fullmatch(r"\d+", v[0]) or o["latex"] != v[0] for v, o in zip(vals, ch["options"])):
            errs.append("choice options must be whole numbers")
        right = [i for i, v in enumerate(vals) if v == [str(truth)]]
        if len(right) != 1 or ch.get("correct") != right[0]:
            errs.append("choice.correct is wrong")
    if re.search("—|piuttosto che", sample["problem"]):
        errs.append("forbidden words in the text")
    return errs, story


def check(sample):
    lvl = sample.get("level")
    if lvl == 1:
        return check_level1(sample)
    if lvl == 7:
        return check_problem(sample)
    return check_inequality(sample)
