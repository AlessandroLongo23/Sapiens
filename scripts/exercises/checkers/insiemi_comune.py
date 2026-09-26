"""Shared helpers for the checkers of the "Insiemi e logica" generators.

Written from the specs (specs/exercises/prime-definizioni.md and siblings), not from the
TypeScript: its own LaTeX rendering of sets and statements, its own evaluation of ∈, ⊆, ⊂, =
and of ℕ, ℤ, ℚ membership. Elements are strings in params: "3", "-2", "a", "1/2".
"""
import re
from fractions import Fraction

# ---------------------------------------------------------------------------
# Elements and sets


def el(s):
    """"3" -> 3, "-2" -> -2, "1/2" -> Fraction, "a" -> "a"."""
    s = str(s)
    if re.fullmatch(r"-?\d+", s):
        return int(s)
    if re.fullmatch(r"-?\d+/\d+", s):
        return Fraction(s)
    if re.fullmatch(r"[a-z]", s):
        return s
    raise ValueError(f"bad element {s!r}")


def els(xs):
    return [el(v) for v in xs]


def _order(e):
    return (0, e, "") if not isinstance(e, str) else (1, 0, e)


def canon(xs):
    """Sorted list of distinct elements: numbers ascending, then letters."""
    return sorted(set(xs), key=_order)


def el_tex(e, raw=None):
    if isinstance(e, str):
        return e
    if isinstance(e, Fraction) and e.denominator != 1 and raw is not None and "/" in raw:
        p, q = raw.split("/")
        return f"-\\frac{{{p[1:]}}}{{{q}}}" if p.startswith("-") else f"\\frac{{{p}}}{{{q}}}"
    if isinstance(e, Fraction):
        return str(e.numerator) if e.denominator == 1 else (f"-\\frac{{{-e.numerator}}}{{{e.denominator}}}" if e < 0 else f"\\frac{{{e.numerator}}}{{{e.denominator}}}")
    return str(e)


def set_tex(xs):
    xs = canon(xs)
    if not xs:
        return "\\emptyset"
    return "\\{" + ", ".join(el_tex(e) for e in xs) + "\\}"


def list_tex(items, split=False):
    """Items between braces; split: two lines of a gathered, the first half (rounded up) on the first
    line ending with its comma, with \\Big braces. That is how a set too wide for the answer button of
    a phone is written."""
    if not split:
        return "\\{" + ", ".join(items) + "\\}"
    k = (len(items) + 1) // 2
    return ("\\begin{gathered} \\Big\\{" + ", ".join(items[:k]) + ", \\\\ " + ", ".join(items[k:])
            + "\\Big\\} \\end{gathered}")


def set_option_texes(xs):
    """The LaTeX an option with the set xs may have: on one line or, with at least 4 elements, on two."""
    xs = canon(xs)
    out = [set_tex(xs)]
    if len(xs) >= 4:
        out.append(list_tex([el_tex(e) for e in xs], split=True))
    return out


def is_sorted_distinct(values):
    return [str(v) for v in values] == [str(v) for v in canon(els(values))] and len(set(values)) == len(values)


# ---------------------------------------------------------------------------
# Statements

OPS = {"in": "\\in", "notin": "\\notin", "subeq": "\\subseteq", "sub": "\\subset", "nsubeq": "\\not\\subseteq", "eq": "=", "neq": "\\neq"}
NUMSETS = {"N": "\\mathbb{N}", "Z": "\\mathbb{Z}", "Q": "\\mathbb{Q}"}


def tok_value(t, sets):
    if t in NUMSETS:
        return ("num", t)
    if t.startswith("e:"):
        return ("el", el(t[2:]), t[2:])
    if t.startswith("s:"):
        return ("set", [el(v) for v in t[2:].split(",")] if len(t) > 2 else [])
    if t not in sets:
        raise ValueError(f"unknown set name {t!r}")
    return ("set", els(sets[t]))


def tok_tex(t, sets):
    v = tok_value(t, sets)
    if v[0] == "num":
        return NUMSETS[t]
    if v[0] == "el":
        return el_tex(v[1], v[2])
    if t.startswith("s:"):
        return set_tex(v[1])
    return t


def stmt_tex(op, l, r, sets):
    return f"{tok_tex(l, sets)} {OPS[op]} {tok_tex(r, sets)}"


def in_numset(e, name):
    if isinstance(e, str):
        return False
    f = Fraction(e)
    if name == "Q":
        return True
    if f.denominator != 1:
        return False
    return name == "Z" or f >= 0


def eval_stmt(op, l, r, sets):
    L, R = tok_value(l, sets), tok_value(r, sets)
    if op in ("in", "notin"):
        if L[0] != "el":
            t = False  # the sets of these exercises have numbers or letters as elements, not sets
        elif R[0] == "num":
            t = in_numset(L[1], R[1])
        elif R[0] == "set":
            t = L[1] in R[1]
        else:
            raise ValueError("in needs a set on the right")
        return t if op == "in" else not t
    if L[0] == "num" and R[0] == "num":
        rank = {"N": 0, "Z": 1, "Q": 2}
        a, b = rank[L[1]], rank[R[1]]
        return {"subeq": a <= b, "sub": a < b, "nsubeq": a > b, "eq": a == b, "neq": a != b}[op]
    if L[0] != "set" or R[0] != "set":
        raise ValueError(f"{op} needs two sets")
    a, b = set(L[1]), set(R[1])
    return {"subeq": a <= b, "sub": a < b, "nsubeq": not a <= b, "eq": a == b, "neq": a != b}[op]


# ---------------------------------------------------------------------------
# Common checks

FORBIDDEN = [
    ("empty braces", re.compile(r"\\\{\s*\\\}")),
    ("double comma", re.compile(r",\s*,")),
    ("comma after brace", re.compile(r"\\\{\s*,")),
    ("comma before brace", re.compile(r",\s*\\\}")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"(?<![a-z])-\s*-")),
    ("undefined", re.compile(r"undefined|NaN|null")),
]


def base_errors(sample):
    errs = []
    for k in ("prompt", "problem", "solution"):
        if not sample.get(k):
            errs.append(f"{k} empty")
    if not sample.get("steps"):
        errs.append("no steps")
    texts = [sample.get("problem", ""), sample.get("solution", "")] + list(sample.get("steps", []))
    ch = sample.get("choice") or (sample["answer"] if sample.get("answer", {}).get("kind") == "choice" else None)
    if ch:
        texts += [o.get("latex", "") for o in ch.get("options", [])]
    for name, rx in FORBIDDEN:
        for t in texts:
            if rx.search(t):
                errs.append(f"forbidden '{name}' in: {t}")
                break
    return errs


def prose(tex):
    """The problem with consecutive wrapped \\text{} lines joined, to search for a phrase."""
    return re.sub(r"(?<!\\)\} \\\\ \\text\{", " ", tex)


def listed_sets(tex):
    """Contents of every \\{ ... \\} in tex that is a plain list (no \\mid, no nested braces)."""
    out = []
    for m in re.finditer(r"\\\{([^{}]*?)\\\}", tex):
        body = m.group(1)
        if "\\mid" in body or "\\dots" in body:
            continue
        out.append([p.strip() for p in body.split(",")])
    return out


def no_repeats(tex):
    return all(len(set(items)) == len(items) for items in listed_sets(tex))


def choice_errors(ch, truth, count=4):
    """ch: a choice answer; truth(option) -> bool. Exactly one option true, at index correct."""
    errs = []
    if not ch or ch.get("kind") != "choice":
        return ["missing choice"]
    opts = ch.get("options", [])
    if len(opts) != count:
        errs.append(f"{len(opts)} options, expected {count}")
    latexes = [o.get("latex") for o in opts]
    values = [tuple(o.get("values", [])) for o in opts]
    if len(set(latexes)) != len(latexes):
        errs.append(f"options with the same latex: {latexes}")
    if len(set(values)) != len(values):
        errs.append(f"options with the same values: {values}")
    truths = []
    for o in opts:
        try:
            truths.append(bool(truth(o)))
        except Exception as e:  # noqa: BLE001
            errs.append(f"cannot grade option {o}: {e!r}")
            truths.append(None)
    if truths.count(True) != 1:
        errs.append(f"{truths.count(True)} correct options: {latexes} -> {truths}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or truths[idx] is not True:
        errs.append(f"choice.correct {idx} is not the correct option")
    return errs


def set_option_truth(truth_set):
    """Grades an option whose values are the elements of a set, checking its latex too."""
    t = set(truth_set)

    def grade(o):
        xs = els(o["values"])
        if not is_sorted_distinct(o["values"]):
            raise ValueError(f"option values not canonical: {o['values']}")
        if o["latex"] not in set_option_texes(xs):
            raise ValueError(f"option latex {o['latex']} != {set_tex(xs)} (on one or two lines)")
        return set(xs) == t

    return grade


def number_option_truth(value):
    def grade(o):
        if o["values"] != [o["latex"]] or not re.fullmatch(r"\d+", o["latex"]):
            raise ValueError(f"bad number option {o}")
        return int(o["latex"]) == value

    return grade


def number_answer_errors(sample, value):
    ans = sample["answer"]
    if ans.get("kind") != "number":
        return [f"answer.kind {ans.get('kind')}, expected number"]
    if ans.get("value") != str(value):
        return [f"answer {ans.get('value')} != {value}"]
    return []


def set_answer_errors(sample, truth):
    ans = sample["answer"]
    errs = []
    if ans.get("kind") != "set":
        return [f"answer.kind {ans.get('kind')}, expected set"]
    if ans.get("universal"):
        errs.append("universal set answer")
    vals = ans.get("values", [])
    if not is_sorted_distinct(vals):
        errs.append(f"answer values not sorted/distinct: {vals}")
    if set(els(vals)) != set(truth):
        errs.append(f"answer {vals} != {canon(truth)}")
    if not ans.get("latex", "").endswith(set_tex(truth)):
        errs.append(f"answer latex {ans.get('latex')} does not end with {set_tex(truth)}")
    return errs


def tf_truth(truth):
    """Vero/Falso options: values ["1"] and ["0"], latex \\text{Vero} / \\text{Falso}."""

    def grade(o):
        if (o["values"], o["latex"]) not in ((["1"], "\\text{Vero}"), (["0"], "\\text{Falso}")):
            raise ValueError(f"bad true/false option {o}")
        return (o["values"] == ["1"]) == truth

    return grade


# ---------------------------------------------------------------------------
# Characteristic properties {x ∈ ℕ | ...}, from params (numbers as strings)

REL = {"<": "<", "<=": "\\le", "=": "=", ">": ">", ">=": "\\ge"}


def _i(v):
    return None if v is None else int(v)


def cond_tex(c):
    t = c["t"]
    if t == "range":
        lo, hi = _i(c.get("lo")), _i(c.get("hi"))
        if lo is not None and hi is None:
            return f"x {'>' if c['loStrict'] else chr(92) + 'ge'} {lo}"
        left = "" if lo is None else f"{lo} {'<' if c['loStrict'] else chr(92) + 'le'} "
        right = "" if hi is None else f" {'<' if c['hiStrict'] else chr(92) + 'le'} {hi}"
        return f"{left}x{right}"
    if t == "pari":
        return "x \\text{ è pari}"
    if t == "dispari":
        return "x \\text{ è dispari}"
    if t == "mult":
        return f"x \\text{{ è multiplo di }} {_i(c['k'])}"
    if t == "div":
        return f"x \\text{{ è un divisore di }} {_i(c['n'])}"
    if t == "lin":
        a, b, k = _i(c["a"]), _i(c["b"]), _i(c["c"])
        ax = "x" if a == 1 else f"{a}x"
        bb = "" if b == 0 else (f" + {b}" if b > 0 else f" - {-b}")
        return f"{ax}{bb} {REL[c['rel']]} {k}"
    if t == "sq":
        return f"x^2 {REL[c['rel']]} {_i(c['c'])}"
    raise ValueError(f"unknown condition {c}")


def prop_tex(p):
    body = " \\text{ e } ".join(cond_tex(c) for c in p["conds"])
    return f"\\{{x \\in \\mathbb{{{p['dom']}}} \\mid {body}\\}}"


def prop_tex_split(p, before=""):
    """A property with two conditions on two lines of a gathered, broken before the "e"."""
    a, b = (cond_tex(c) for c in p["conds"])
    return (f"\\begin{{gathered}} {before}\\Big\\{{x \\in \\mathbb{{{p['dom']}}} \\mid {a} \\\\ "
            f"\\text{{e }} {b}\\Big\\}} \\end{{gathered}}")


def _rel(l, rel, r):
    return {"<": l < r, "<=": l <= r, "=": l == r, ">": l > r, ">=": l >= r}[rel]


def cond_holds(c, x):
    t = c["t"]
    if t == "range":
        lo, hi = _i(c.get("lo")), _i(c.get("hi"))
        ok_lo = lo is None or (x > lo if c["loStrict"] else x >= lo)
        ok_hi = hi is None or (x < hi if c["hiStrict"] else x <= hi)
        return ok_lo and ok_hi
    if t == "pari":
        return x % 2 == 0
    if t == "dispari":
        return x % 2 == 1
    if t == "mult":
        return x % _i(c["k"]) == 0
    if t == "div":
        return x != 0 and _i(c["n"]) % x == 0
    if t == "lin":
        return _rel(_i(c["a"]) * x + _i(c["b"]), c["rel"], _i(c["c"]))
    if t == "sq":
        return _rel(x * x, c["rel"], _i(c["c"]))
    raise ValueError(f"unknown condition {c}")


def prop_elements(p, bound=1000):
    """Elements of the property; raises if it is not bounded (reaches the search edge)."""
    lo = 0 if p["dom"] == "N" else -bound
    out = [x for x in range(lo, bound + 1) if all(cond_holds(c, x) for c in p["conds"])]
    if any(abs(x) > bound - 10 for x in out):
        raise ValueError(f"unbounded property {prop_tex(p)}")
    return out
