"""Checker for definizione-funzione (specs/exercises/definizione-funzione.md).

Written from the spec, not from the generator. Everything is read back from the problem LaTeX and
compared with params:
- level 1: the sets A, B and the pairs of R; the relation is a function when every element of A is
  the first element of exactly one pair. Each option is a claim ("funzione", "x has two images",
  "x has no image", "y of B is the image of several elements / of none") that is evaluated on the
  pairs: exactly one option is right, and the options about B are true statements (the mistake of
  the lesson's warning is looking at B, not saying something false about it);
- levels 2-4: f(x) and the point are parsed into SymPy and f is evaluated exactly;
- level 5: the table row of x is parsed and the row of f(x) recomputed;
- level 6: f(x) = m x + k and the argument (a + h, -a, 2a, 3a) are parsed with the letter a and
  f(argument) is expanded by SymPy.
The multiple choice is checked everywhere: four distinct options, the LaTeX of each option saying
its value, one right option at the index given, and the mistake the spec requires among the
distractors.
"""
import re

from sympy import Rational, Symbol, expand, sympify
from sympy.parsing.sympy_parser import implicit_multiplication_application, parse_expr, standard_transformations

from verify import FORBIDDEN

x = Symbol("x")
a = Symbol("a")

CASE_RANGES = {
    1: {"funzione": (0.23, 0.43), "due-immagini": (0.23, 0.43), "senza-immagine": (0.23, 0.43)},
    2: {"negativo": (0.50, 0.70), "positivo": (0.30, 0.50)},
    4: {"primo-grado": (0.20, 0.40), "secondo-grado": (0.60, 0.80)},
    5: {"primo-grado": (0.30, 0.50), "secondo-grado": (0.50, 0.70)},
    6: {"shift": (0.40, 0.60), "opposite": (0.15, 0.35), "multiple": (0.15, 0.35)},
}

TRANSFORMS = standard_transformations + (implicit_multiplication_application,)


def tex2sym(t):
    """A formula of this generator (integers, fractions, x or a, powers, \\cdot) to SymPy."""
    s = t.strip()
    s = s.replace(r"\left(", "(").replace(r"\right)", ")").replace(r"\cdot", "*")
    s = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", s)
    s = s.replace("^", "**")
    if "\\" in s or "{" in s:
        raise ValueError(f"unparsed LaTeX: {t!r}")
    if not re.fullmatch(r"[0-9xa+\-*/() ]+", s):
        raise ValueError(f"unexpected characters in {t!r}")
    return parse_expr(s, local_dict={"x": x, "a": a}, transformations=TRANSFORMS)


def gathered_lines(problem):
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", problem, re.S)
    if not m:
        raise ValueError("problem is not a gathered block")
    body = m.group(1)
    # split at top-level \\ only (a nested gathered or array keeps its own rows)
    parts, depth, start, i = [], 0, 0, 0
    while i < len(body):
        if body.startswith(r"\begin{", i):
            depth += 1
        elif body.startswith(r"\end{", i):
            depth -= 1
        elif depth == 0 and body.startswith(r"\\", i):
            parts.append(body[start:i].strip())
            start = i + 2
            i += 2
            continue
        i += 1
    parts.append(body[start:].strip())
    return parts


def rat(s):
    if not isinstance(s, str) or not re.fullmatch(r"-?\d+(/\d+)?", s):
        raise ValueError(f"not an exact rational string: {s!r}")
    return Rational(s)


def choice_basics(ch, errs):
    """Four distinct options and a valid index; returns the options or None."""
    if not ch or ch.get("kind") != "choice":
        errs.append("no multiple choice")
        return None
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    keys = ["|".join(o["values"]) for o in opts]
    if len(set(keys)) != len(keys):
        errs.append(f"repeated options: {keys}")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("two options with the same LaTeX")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts):
        errs.append(f"choice.correct {idx} out of range")
        return None
    return opts


# ---------------------------------------------------------------------------
# Level 1


def option_text(code, arg):
    if code == "funzione":
        return r"\text{Sì, è una funzione}"
    if code == "due-immagini":
        return rf"\text{{No: }} {arg} \text{{ ha due immagini}}"
    if code == "senza-immagine":
        return rf"\text{{No: }} {arg} \text{{ non ha immagine}}"
    if code == "arrivo-piu":
        return rf"\begin{{gathered}} \text{{No: }} {arg} \text{{ è immagine}} \\ \text{{di più elementi}} \end{{gathered}}"
    if code == "arrivo-nessuno":
        return rf"\begin{{gathered}} \text{{No: }} {arg} \text{{ non è immagine}} \\ \text{{di nessun elemento}} \end{{gathered}}"
    return None


def check_relation(sample, errs):
    p = sample["params"]
    lines = gathered_lines(sample["problem"])
    if len(lines) != 2:
        return errs + [f"expected 2 lines, got {len(lines)}"], None
    m = re.fullmatch(r"A = \\\{(.*)\\\} \\quad B = \\\{(.*)\\\}", lines[0])
    if not m:
        return errs + [f"cannot read A and B from {lines[0]!r}"], None
    A = [int(v) for v in m.group(1).split(r",\ ")]
    B = m.group(2).split(r",\ ")
    if not lines[1].startswith("R = "):
        errs.append("second line is not R = ...")
    pairs = [(int(u), v) for u, v in re.findall(r"\((-?\d+), ([a-z])\)", lines[1])]
    if len(pairs) != len(re.findall(r"\(", lines[1])):
        errs.append("unreadable pair in R")
    if [str(v) for v in A] != p["A"] or B != p["B"] or [[str(u), v] for u, v in pairs] != p["pairs"]:
        errs.append("problem and params disagree on A, B or R")
    if not 3 <= len(A) <= 5 or any(not 0 <= v <= 6 for v in A) or A != sorted(set(A)):
        errs.append(f"A = {A}: 3-5 distinct numbers from 0 to 6, in order")
    if not 3 <= len(B) <= 4 or B != ["a", "b", "c", "d"][: len(B)]:
        errs.append(f"B = {B}: the letters a, b, c(, d)")
    if any(u not in A or v not in B for u, v in pairs):
        errs.append("a pair is not in A x B")
    if len(set(pairs)) != len(pairs):
        errs.append("repeated pair")
    if pairs != sorted(pairs):
        errs.append("pairs not in order")
    # Five pairs or more go on two lines inside the braces.
    two_lines = r"\begin{gathered}" in lines[1]
    if two_lines != (len(pairs) >= 5):
        errs.append(f"{len(pairs)} pairs {'on two lines' if two_lines else 'on one line'}")

    n_img = {u: sum(1 for w, _ in pairs if w == u) for u in A}
    n_pre = {v: len({u for u, w in pairs if w == v}) for v in B}
    bad = [u for u in A if n_img[u] != 1]
    if len(bad) > 1:
        errs.append(f"more than one faulty element: {bad}")
    if any(n > 2 for n in n_img.values()):
        errs.append("an element with more than two images")
    kind = "funzione" if not bad else ("senza-immagine" if n_img[bad[0]] == 0 else "due-immagini")
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but the relation is {kind}")

    ans = sample["answer"]
    opts = choice_basics(ans, errs)
    if opts is None:
        return errs, kind
    right = []
    for i, o in enumerate(opts):
        vals = o["values"]
        code, arg = vals[0], (vals[1] if len(vals) > 1 else None)
        if o["latex"] != option_text(code, arg):
            errs.append(f"option {vals} written {o['latex']!r}")
        if code == "funzione":
            ok = kind == "funzione"
        elif code in ("due-immagini", "senza-immagine"):
            u = int(arg)
            if u not in A:
                errs.append(f"option about {u}, not in A")
                continue
            ok = n_img[u] == (2 if code == "due-immagini" else 0)
        elif code in ("arrivo-piu", "arrivo-nessuno"):
            if arg not in B:
                errs.append(f"option about {arg}, not in B")
                continue
            true_of_b = n_pre[arg] >= 2 if code == "arrivo-piu" else n_pre[arg] == 0
            if not true_of_b:
                errs.append(f"option {vals} says something false about B")
            ok = False  # never the reason: the definition asks nothing of B
        else:
            errs.append(f"unknown option code {code}")
            continue
        if ok:
            right.append(i)
    if right != [ans["correct"]]:
        errs.append(f"right options {right}, answer says {ans['correct']}")
    if not any(o["values"][0].startswith("arrivo") for o in opts):
        errs.append("no distractor about the elements of B")
    if sample.get("choice") != ans:
        errs.append("choice differs from the answer")
    return errs, kind


# ---------------------------------------------------------------------------
# Levels 2-5


def read_f(line):
    m = re.fullmatch(r"f\(x\) = (.+)", line)
    if not m:
        raise ValueError(f"no f(x) in {line!r}")
    return tex2sym(m.group(1)), m.group(1)


def read_point(line):
    m = re.fullmatch(r"f\\left\((.+)\\right\) = \\ \?", line) or re.fullmatch(r"f\((.+)\) = \\ \?", line)
    if not m:
        raise ValueError(f"no f(...) = ? in {line!r}")
    return tex2sym(m.group(1)), m.group(1)


def f_params(p):
    return int(p["a"]) * x**2 + int(p["b"]) * x + int(p["c"])


def slips(fx, x0):
    """The two sign slips of the lesson, recomputed on the formula: the square of a negative number
    taken as negative (-2^2 = -4), and the product with a negative number taken as positive."""
    q2 = fx.coeff(x, 2)
    q1 = fx.coeff(x, 1)
    q0 = fx.subs(x, 0)
    return {
        "segno-quadrato": -q2 * x0**2 + q1 * x0 + q0,
        "segno-prodotto": q2 * x0**2 - q1 * x0 + q0,
    }


def check_value(sample, errs):
    p = sample["params"]
    lvl = sample["level"]
    lines = gathered_lines(sample["problem"])
    if len(lines) != 2:
        return errs + ["expected 2 lines"], None
    fx, ftex = read_f(lines[0])
    x0, xtex = read_point(lines[1])
    if expand(fx - f_params(p)) != 0:
        errs.append(f"problem shows f(x) = {fx}, params give {f_params(p)}")
    if x0 != rat(p["x"]):
        errs.append(f"problem point {x0} != params.x {p['x']}")
    if not x0.is_rational:
        return errs + ["point is not rational"], None
    truth = fx.subs(x, x0)
    ans = sample["answer"]
    if ans.get("kind") != "number" or rat(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != f({x0}) = {truth}")
    if rat(p["value"]) != truth:
        errs.append("params.value is wrong")
    q2, q1, q0 = fx.coeff(x, 2), fx.coeff(x, 1), fx.subs(x, 0)
    if fx.coeff(x, 3) != 0:
        errs.append("degree above 2")
    kind = None
    if lvl == 2:
        if q2 != 0 or not 2 <= abs(q1) <= 6 or q0 == 0 or abs(q0) > 9:
            errs.append(f"level 2: ax + b with 2 <= |a| <= 6, 0 < |b| <= 9, got {fx}")
        if not x0.is_integer or x0 == 0 or abs(x0) > 5:
            errs.append(f"level 2: x = {x0}, expected a nonzero integer in [-5, 5]")
        kind = "negativo" if x0 < 0 else "positivo"
    elif lvl == 3:
        if q2 == 0 or not -2 <= q2 <= 3 or abs(q1) > 5 or abs(q0) > 6 or (q1 == 0 and q0 == 0):
            errs.append(f"level 3: ax^2 + bx + c with small coefficients, got {fx}")
        if not x0.is_integer or not -3 <= x0 <= -1:
            errs.append(f"level 3: x = {x0}, expected -3, -2 or -1")
        if abs(truth) > 60:
            errs.append(f"level 3: f(x) = {truth} too large")
    elif lvl == 4:
        if x0.is_integer or x0.q > 5 or abs(x0.p) > 3:
            errs.append(f"level 4: x = {x0}, expected a fraction p/q with q <= 5")
        if q2 == 0 and (not 2 <= abs(q1) <= 6 or q0 == 0):
            errs.append(f"level 4: first degree ax + b with |a| >= 2, b != 0, got {fx}")
        if q2 != 0 and (q2 not in (1, 2, 3, -1) or q1 == 0 or abs(q1) > 4 or abs(q0) > 4):
            errs.append(f"level 4: second degree out of spec, got {fx}")
        if truth.q > 25 or abs(truth.p) > 60:
            errs.append(f"level 4: result {truth} not small")
        kind = "primo-grado" if q2 == 0 else "secondo-grado"
    for name, rx in FORBIDDEN:
        if rx.search(ftex):
            errs.append(f"f(x) contains forbidden '{name}': {ftex}")

    ch = sample.get("choice")
    opts = choice_basics(ch, errs)
    if opts is None:
        return errs, kind
    shown = []
    for o in opts:
        if len(o["values"]) != 1:
            errs.append(f"option {o['values']} is not one number")
            continue
        v = rat(o["values"][0])
        if tex2sym(o["latex"]) != v:
            errs.append(f"option latex {o['latex']!r} != value {v}")
        shown.append(v)
    right = [i for i, v in enumerate(shown) if v == truth]
    if right != [ch["correct"]]:
        errs.append(f"right options {right}, choice says {ch['correct']}")
    # The mistake of the lesson's warning, when it applies: never missing.
    s = slips(fx, x0)
    if x0 < 0 and q2 != 0 and s["segno-quadrato"] not in shown:
        errs.append("the -2^2 = -4 slip is not among the options")
    if x0 < 0 and q2 == 0 and s["segno-prodotto"] not in shown:
        errs.append("the sign slip of the product is not among the options")
    return errs, kind


def check_table(sample, errs):
    p = sample["params"]
    lines = gathered_lines(sample["problem"])
    if len(lines) != 2:
        return errs + ["expected 2 lines"], None
    fx, ftex = read_f(lines[0])
    if expand(fx - f_params(p)) != 0:
        errs.append(f"problem shows f(x) = {fx}, params give {f_params(p)}")
    m = re.fullmatch(r"\\begin\{array\}\{c\|c{5}\} x & (.*) \\\\ \\hline f\(x\) & (.*) \\end\{array\}", lines[1])
    if not m:
        return errs + [f"cannot read the table {lines[1]!r}"], None
    xs = [int(v) for v in m.group(1).split(" & ")]
    if m.group(2).split(" & ") != ["?"] * 5:
        errs.append("the row of f(x) is not five question marks")
    if [str(v) for v in xs] != p["xs"]:
        errs.append("table and params disagree on x")
    if len(xs) != 5 or xs != list(range(xs[0], xs[0] + 5)) or 0 not in xs or xs[0] >= 0:
        errs.append(f"x = {xs}: five consecutive integers with 0 and a negative")
    truth = [fx.subs(x, v) for v in xs]
    if [rat(v) for v in p["values"]] != truth:
        errs.append("params.values is wrong")
    if any(abs(v) > 30 for v in truth):
        errs.append("a value of the table beyond 30")
    q2, q1 = fx.coeff(x, 2), fx.coeff(x, 1)
    if q2 not in (0, 1, 2, -1) or (q2 == 0 and not 1 <= abs(q1) <= 4) or abs(q1) > 4 or abs(fx.subs(x, 0)) > 5:
        errs.append(f"f(x) = {fx} out of spec")
    for name, rx in FORBIDDEN:
        if rx.search(ftex):
            errs.append(f"f(x) contains forbidden '{name}': {ftex}")
    kind = "primo-grado" if q2 == 0 else "secondo-grado"

    ans = sample["answer"]
    opts = choice_basics(ans, errs)
    if opts is None:
        return errs, kind
    rows = []
    for o in opts:
        row = [rat(v) for v in o["values"]]
        if len(row) != 5:
            errs.append(f"option {o['values']} has not five values")
        written = [tex2sym(t) for t in o["latex"].split(r",\ ")]
        if written != row:
            errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        rows.append(row)
    right = [i for i, r in enumerate(rows) if r == truth]
    if right != [ans["correct"]]:
        errs.append(f"right rows {right}, answer says {ans['correct']}")
    s = [slips(fx, v) for v in xs]
    if q2 != 0:
        slipped = [s[i]["segno-quadrato"] if v < 0 else truth[i] for i, v in enumerate(xs)]
        if slipped not in rows:
            errs.append("the row with -2^2 = -4 is not among the options")
    elif q1 != 0:
        slipped = [s[i]["segno-prodotto"] if v < 0 else truth[i] for i, v in enumerate(xs)]
        if slipped not in rows:
            errs.append("the row with the sign slip of the product is not among the options")
    if sample.get("choice") != ans:
        errs.append("choice differs from the answer")
    return errs, kind


# ---------------------------------------------------------------------------
# Level 6


def check_letter(sample, errs):
    p = sample["params"]
    lines = gathered_lines(sample["problem"])
    if len(lines) != 2:
        return errs + ["expected 2 lines"], None
    fx, ftex = read_f(lines[0])
    m = re.fullmatch(r"f\((.+)\) = \\ \?", lines[1])
    if not m:
        return errs + [f"no f(...) = ? in {lines[1]!r}"], None
    arg = tex2sym(m.group(1))
    q2, q1, q0 = fx.coeff(x, 2), fx.coeff(x, 1), fx.subs(x, 0)
    if q2 != 0 or not 2 <= abs(q1) <= 5 or q0 == 0 or abs(q0) > 6:
        errs.append(f"f(x) = {fx}: mx + k with 2 <= |m| <= 5, 0 < |k| <= 6")
    if q1 != int(p["m"]) or q0 != int(p["k"]):
        errs.append("problem and params disagree on f")
    c1, c0 = arg.coeff(a, 1), arg.subs(a, 0)
    if c1 == 1 and c0 != 0 and abs(c0) <= 3:
        kind = "shift"
    elif c1 == -1 and c0 == 0:
        kind = "opposite"
    elif c1 in (2, 3) and c0 == 0:
        kind = "multiple"
    else:
        kind = None
        errs.append(f"argument {arg} out of spec")
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but the argument is {kind}")
    truth = expand(fx.subs(x, arg))
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "expanded":
        errs.append("answer must be an expanded expression")
    else:
        if expand(sympify(ans["value"], locals={"a": a}) - truth) != 0:
            errs.append(f"answer {ans['value']} != {truth}")
        if expand(tex2sym(ans["latex"]) - truth) != 0:
            errs.append(f"answer latex {ans['latex']!r} != {truth}")
        if "(" in ans["latex"]:
            errs.append("answer latex not expanded")
    for name, rx in FORBIDDEN:
        if rx.search(ftex):
            errs.append(f"f(x) contains forbidden '{name}': {ftex}")
    if re.search(r"(?<!\d)[01]a", sample["problem"] + " " + ans.get("latex", "")):
        errs.append("coefficient 1 or 0 written before a")

    ch = sample.get("choice")
    opts = choice_basics(ch, errs)
    if opts is None:
        return errs, kind
    shown = []
    for o in opts:
        v = expand(sympify(o["values"][0], locals={"a": a}))
        if expand(tex2sym(o["latex"]) - v) != 0:
            errs.append(f"option latex {o['latex']!r} != value {o['values'][0]}")
        if re.search(r"(?<!\d)[01]a|\(", o["latex"]):
            errs.append(f"option {o['latex']!r} badly written")
        shown.append(v)
    if len(set(shown)) != len(shown):
        errs.append("two options with the same value")
    right = [i for i, v in enumerate(shown) if expand(v - truth) == 0]
    if right != [ch["correct"]]:
        errs.append(f"right options {right}, choice says {ch['correct']}")
    # The warning of the lesson: f(a + h) confused with f(a) + h.
    if kind == "shift" and expand(fx.subs(x, a) + c0) not in shown:
        errs.append("f(a) + h is not among the options")
    if kind == "multiple" and expand(c1 * fx.subs(x, a)) not in shown:
        errs.append("k f(a) is not among the options")
    return errs, kind


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    lvl = sample["level"]
    try:
        if lvl == 1:
            return check_relation(sample, errs)
        if lvl in (2, 3, 4):
            return check_value(sample, errs)
        if lvl == 5:
            return check_table(sample, errs)
        if lvl == 6:
            return check_letter(sample, errs)
    except ValueError as e:
        return errs + [str(e)], None
    return errs + [f"unknown level {lvl}"], None
