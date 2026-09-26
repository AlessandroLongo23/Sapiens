"""Checker for geometria-perpendicolari-parallele, written from specs/exercises/geometria-perpendicolari-parallele.md.

Every datum is read back from the text of the problem (the \\text{} lines put together again), not
from the generator's tables, and compared with params. The eight angles are placed from the lesson's
description of its figure: 1 to 4 at the point on a, 5 to 8 at the point on b, counterclockwise from
the one above the line and right of t. From the position alone (line, above or below, right or left)
this module decides whether an angle is interior, how a pair is named (the lesson's "Posizione"
column) and, with a || b, whether two angles are congruent or supplementary. Triangles and polygons are
recomputed with SymPy from the numbers in the text. Then every option is judged on its own: exactly
one must be right, and it must be the one marked right; its LaTeX must say its value.
"""
import re

from sympy import Rational, Symbol, solve, sympify

X = Symbol("x")

CASE_RANGES = {
    1: {c: (0.25, 0.42) for c in ("nome", "posizione", "trova")},
    2: {"stesso-punto": (0.35, 0.51), "altro-punto": (0.49, 0.65)},
    3: {"parallele": (0.42, 0.58), "trappola": (0.18, 0.32), "vicine": (0.18, 0.32)},
    4: {"congruenti": (0.48, 0.72), "supplementari": (0.28, 0.52)},
    5: {"terzo": (0.14, 0.26), "non-esiste": (0.10, 0.20), "base": (0.10, 0.20), "vertice": (0.10, 0.20), "rettangolo": (0.10, 0.20), "proporzione": (0.14, 0.26)},
    6: {c: (0.18, 0.32) for c in ("da-interni", "adiacente", "altro", "interno")},
    7: {c: (0.14, 0.26) for c in ("somma", "lati", "regolare", "lati-regolare", "ultimo")},
}

NAMES = {
    "alterni-interni": "alterni interni",
    "alterni-esterni": "alterni esterni",
    "corrispondenti": "corrispondenti",
    "coniugati-interni": "coniugati interni",
    "coniugati-esterni": "coniugati esterni",
}
VERDICTS = {
    "si-congruenti": "Sì: sono congruenti",
    "si-supplementari": "Sì: sono supplementari",
    "no-congruenti": "No: non sono congruenti",
    "no-supplementari": "No: non sono supplementari",
    "non-si-puo": "Non si può stabilire",
}
NONE_TEXT = r"\text{Il triangolo non esiste}"

# ---------------------------------------------------------------------------
# The eight angles, from the lesson's description of the figure


def position(k):
    """(line, above, right) of angle k: counterclockwise from above-right, 1-4 on a, 5-8 on b."""
    line = "a" if k <= 4 else "b"
    r = (k - 1) % 4  # 0 above-right, 1 above-left, 2 below-left, 3 below-right
    return line, r in (0, 1), r in (0, 3)


def is_interior(k):
    line, above, _ = position(k)
    # a is above b: the strip between them is below a and above b.
    return (line == "a" and not above) or (line == "b" and above)


def pair_name(i, j):
    li, ai, ri = position(i)
    lj, aj, rj = position(j)
    if li == lj:
        return None
    ii, ij = is_interior(i), is_interior(j)
    if ri != rj:
        if ii and ij:
            return "alterni-interni"
        if not ii and not ij:
            return "alterni-esterni"
        return None
    if ii != ij:
        return "corrispondenti" if ai == aj else None
    return "coniugati-interni" if ii else "coniugati-esterni"


def congruent_if_parallel(i, j):
    """With a || b the angle above-right is congruent to the one below-left at both points."""
    _, ai, ri = position(i)
    _, aj, rj = position(j)
    return (ai == ri) == (aj == rj)


def from_words(v, line, side):
    for k in range(1, 9):
        l, a, r = position(k)
        if l == line and a == (v == "sopra") and r == (side == "destra"):
            return k
    return None


# ---------------------------------------------------------------------------
# Reading the problem


def text_groups(tex):
    out, i = [], 0
    while True:
        j = tex.find("\\text{", i)
        if j < 0:
            return out
        k, depth = j + 6, 1
        while depth:
            if tex[k] == "\\":
                k += 2
                continue
            depth += {"{": 1, "}": -1}.get(tex[k], 0)
            k += 1
        out.append(tex[j + 6 : k - 1])
        i = k


def prose(sample):
    return " ".join(text_groups(sample["problem"]))


DEG = r"\$(\d+)\^\\circ\$"
HAT = r"\$\\hat\{(\d)\}\$"


def need(rx, s, what):
    m = re.search(rx, s)
    if not m:
        raise ValueError(f"{what} not found in: {s}")
    return m


def angle_expr(tex):
    """(3x + 10)^\\circ or 4x^\\circ, as a SymPy expression."""
    m = re.fullmatch(r"\((.+)\)\^\\circ|(.+)\^\\circ", tex)
    body = m.group(1) or m.group(2)
    if re.search(r"(?<!\d)1x|(?<!\d)0x|\+ -|- -|[+-] 0(?!\d)", body):
        raise ValueError(f"badly written expression {tex}")
    return sympify(re.sub(r"(\d)x", r"\1*x", body), locals={"x": X})


# ---------------------------------------------------------------------------
# Truth per level. Each returns (truth, data read from the text, errors).


def level1(p, s):
    errs = []
    case = p["case"]
    if case == "posizione":
        if "\\hat" in s:
            errs.append("the description in words shows numbers")
        found = re.findall(r"l'angolo (sopra|sotto) \$(a|b)\$ a (destra|sinistra) di \$t\$", s)
        points = re.findall(r"Nel punto su \$(a|b)\$|nel punto su \$(a|b)\$", s)
        if len(found) != 2 or [x or y for x, y in points] != [found[0][1], found[1][1]]:
            return None, ["two angles in words expected"]
        i, j = (from_words(*f) for f in found)
        if [str(i), str(j)] != [p["i"], p["j"]]:
            errs.append(f"angles in words {i}, {j} != params {p['i']}, {p['j']}")
        return pair_name(i, j), errs
    if "numerati come nella lezione" not in s:
        errs.append("the numbering is not recalled")
    if case == "nome":
        m = need(r"coppia di angoli " + HAT + " e " + HAT, s, "pair")
        i, j = int(m.group(1)), int(m.group(2))
        if [str(i), str(j)] != [p["i"], p["j"]]:
            errs.append("pair differs from params")
        return pair_name(i, j), errs
    m = need(r"forma con " + HAT + r" una coppia di angoli ([a-z ]+)\?", s, "question")
    i, name = int(m.group(1)), m.group(2)
    ty = next((k for k, v in NAMES.items() if v == name), None)
    if str(i) != p["angle"] or ty != p["type"]:
        errs.append("question differs from params")
    js = [j for j in range(1, 9) if pair_name(i, j) == ty]
    if len(js) != 1:
        return None, errs + [f"{len(js)} angles form that pair"]
    return str(js[0]), errs


def level2(p, s):
    errs = []
    if "rette parallele" not in s:
        errs.append("the lines are not said parallel")
    m = need(r"Si sa che " + HAT + " misura " + DEG + r"\. Quanto misura " + HAT + r"\?", s, "data")
    i, g, j = int(m.group(1)), int(m.group(2)), int(m.group(3))
    if [str(i), str(g), str(j)] != [p["i"], p["given"], p["j"]]:
        errs.append("data differ from params")
    if i == j:
        errs.append("same angle")
    # As in the lesson's figure: angle 1 (above-right) is acute.
    _, a, r = position(i)
    if (a == r) != (g < 90):
        errs.append(f"angle {i} = {g} contradicts the lesson's figure")
    case = "stesso-punto" if position(i)[0] == position(j)[0] else "altro-punto"
    if p["case"] != case:
        errs.append("case differs")
    return str(g if congruent_if_parallel(i, j) else 180 - g), errs


def level3(p, s):
    errs = []
    m = need(r"Si sa che " + HAT + " misura " + DEG + " e " + HAT + " misura " + DEG + r"\. Le rette \$a\$ e \$b\$ sono parallele\?", s, "data")
    i, pv, j, qv = (int(m.group(k)) for k in range(1, 5))
    if [str(i), str(j), str(pv), str(qv)] != [p["i"], p["j"], p["p"], p["q"]]:
        errs.append("data differ from params")
    ty = pair_name(i, j)
    if ty is None or ty != p["type"]:
        return None, errs + [f"pair {i}, {j} is {ty}, params {p['type']}"]
    if 90 in (pv, qv):
        errs.append("right angle: congruent and supplementary at once")
    cong = ty.startswith("alterni") or ty == "corrispondenti"
    parallel = pv == qv if cong else pv + qv == 180
    if parallel:
        case = "parallele"
    elif (cong and pv + qv == 180) or (not cong and pv == qv):
        case = "trappola"
    else:
        case = "vicine"
        if abs((qv - pv) if cong else (pv + qv - 180)) > 12:
            errs.append("near case too far")
    if p["case"] != case:
        errs.append(f"case {p['case']} but data give {case}")
    truth = ("si-" if parallel else "no-") + ("congruenti" if cong else "supplementari")
    return truth, errs


def level4(p, s):
    errs = []
    m = need(r"Le rette \$a\$ e \$b\$ sono parallele e sono tagliate da una trasversale\. Due angoli ([a-z ]+) misurano \$([^$]+)\$ e \$([^$]+)\$\. Trova \$x\$\.", s, "data")
    ty = next((k for k, v in NAMES.items() if v == m.group(1)), None)
    if ty != p["type"]:
        errs.append("pair type differs")
    e1, e2 = angle_expr(m.group(2)), angle_expr(m.group(3))
    a, b, c, d = (Rational(p[k]) for k in "abcd")
    if (e1 - (a * X + b)).expand() != 0 or (e2 - (c * X + d)).expand() != 0:
        errs.append("expressions differ from params")
    cong = ty is not None and (ty.startswith("alterni") or ty == "corrispondenti")
    sol = solve(e1 - e2 if cong else e1 + e2 - 180, X)
    if len(sol) != 1 or not sol[0].is_integer:
        return None, errs + [f"solution {sol}"]
    x = sol[0]
    v1, v2 = e1.subs(X, x), e2.subs(X, x)
    if not (25 <= v1 <= 155 and 25 <= v2 <= 155) or 90 in (v1, v2):
        errs.append(f"angles {v1}, {v2} out of range")
    if not 5 <= x <= 40 or abs(b) > 100 or abs(d) > 100:
        errs.append("numbers out of range")
    if p["case"] != ("congruenti" if cong else "supplementari"):
        errs.append("case differs")
    return str(x), errs


def level5(p, s):
    errs = []
    case = p["case"]
    if case in ("terzo", "non-esiste"):
        m = need(r"In un triangolo \$ABC\$ l'angolo \$\\hat\{([ABC])\}\$ misura " + DEG + r" e l'angolo \$\\hat\{([ABC])\}\$ misura " + DEG + r"\. Quanto misura \$\\hat\{([ABC])\}\$\?", s, "data")
        u, pv, w, qv, v = m.group(1), int(m.group(2)), m.group(3), int(m.group(4)), m.group(5)
        if sorted([u, w, v]) != ["A", "B", "C"]:
            errs.append("vertices")
        if [str(pv), str(qv)] != [p["p"], p["q"]]:
            errs.append("data differ")
        r = 180 - pv - qv
        truth = str(r) if r > 0 else "none"
        if (case == "terzo") != (r > 0):
            errs.append("case differs from data")
        if case == "terzo" and r < 10:
            errs.append("third angle under 10")
        return truth, errs
    if case == "base":
        m = need(r"In un triangolo isoscele l'angolo al vertice misura " + DEG + r"\. Quanto misura ciascun angolo alla base\?", s, "data")
        v = int(m.group(1))
        return str(Rational(180 - v, 2)), errs
    if case == "vertice":
        m = need(r"In un triangolo isoscele un angolo alla base misura " + DEG + r"\. Quanto misura l'angolo al vertice\?", s, "data")
        return str(180 - 2 * int(m.group(1))), errs
    if case == "rettangolo":
        m = need(r"In un triangolo rettangolo un angolo acuto misura " + DEG + r"\. Quanto misura l'altro angolo acuto\?", s, "data")
        return str(90 - int(m.group(1))), errs
    if case == "proporzione":
        m = need(r"Gli angoli di un triangolo misurano \$([^$]+)\$, \$([^$]+)\$ e \$([^$]+)\$\. Quanto misura il (maggiore|minore) dei tre angoli\?", s, "data")
        exprs = [sympify(re.sub(r"(\d)x", r"\1*x", m.group(k)), locals={"x": X}) for k in (1, 2, 3)]
        if any(re.fullmatch(r"1x", m.group(k)) for k in (1, 2, 3)):
            errs.append("1x written")
        sol = solve(sum(exprs) - 180, X)
        vals = [e.subs(X, sol[0]) for e in exprs]
        if len(set(vals)) == 1:
            errs.append("equilateral: nothing to find")
        return str(max(vals) if m.group(4) == "maggiore" else min(vals)), errs
    return None, [f"unknown case {case}"]


def level6(p, s):
    errs = []
    case = p["case"]
    ext_rx = r"l'angolo esterno in \$([ABC])\$"
    if case in ("da-interni", "adiacente"):
        m = need(r"si ha \$\\hat\{([ABC])\} = (\d+)\^\\circ\$ e \$\\hat\{([ABC])\} = (\d+)\^\\circ\$\. Quanto misura " + ext_rx + r"\?", s, "data")
        g1, x1, g2, x2, V = m.group(1), int(m.group(2)), m.group(3), int(m.group(4)), m.group(5)
        others = {"A", "B", "C"} - {V}
        if {g1, g2} == others:
            truth, c = x1 + x2, "da-interni"
        elif g1 == V and g2 in others:
            truth, c = 180 - x1, "adiacente"
            if x1 + x2 >= 180:
                errs.append("no triangle")
        else:
            return None, ["vertices not as expected"]
    else:
        m = need(ext_rx + " misura " + DEG + r" e \$\\hat\{([ABC])\} = (\d+)\^\\circ\$\. Quanto misura \$\\hat\{([ABC])\}\$\?", s, "data")
        V, e, g, gv, asked = m.group(1), int(m.group(2)), m.group(3), int(m.group(4)), m.group(5)
        if g == V or (asked != V and len({V, g, asked}) != 3):
            return None, ["vertices not as expected"]
        if asked == V:
            truth, c = 180 - e, "interno"
        else:
            truth, c = e - gv, "altro"
        # the triangle must exist: the given non-adjacent angle smaller than the exterior one
        if gv >= e or e >= 180:
            errs.append("no triangle")
        x1, x2 = e, gv
    if c != case:
        errs.append(f"case {case} but text is {c}")
    u, w = int(p["u"]), int(p["w"])
    if min(u, w, 180 - u - w) < 15:
        errs.append("interior angle under 15")
    if truth in (x1, x2):
        errs.append("answer equals a datum")
    return str(truth), errs


def level7(p, s):
    errs = []
    case = p["case"]
    S = lambda n: (n - 2) * 180  # noqa: E731
    if case == "somma":
        m = need(r"Un poligono convesso ha (\d+) lati\. Quanto vale la somma dei suoi angoli interni\?", s, "data")
        n = int(m.group(1))
        if not 4 <= n <= 20:
            errs.append("n out of range")
        return str(S(n)), errs
    if case == "lati":
        m = need(r"La somma degli angoli interni di un poligono convesso è " + DEG + r"\. Quanti lati ha\?", s, "data")
        sol = solve((Symbol("n") - 2) * 180 - int(m.group(1)), Symbol("n"))
        if len(sol) != 1 or not sol[0].is_integer or sol[0] < 5:
            return None, [f"n = {sol}"]
        return str(sol[0]), errs
    if case == "regolare":
        m = need(r"Quanto misura ciascun angolo di un poligono regolare con (\d+) lati\?", s, "data")
        n = int(m.group(1))
        a = Rational(S(n), n)
        if not a.is_integer:
            errs.append("angle not an integer")
        return str(a), errs
    if case == "lati-regolare":
        m = need(r"Ogni angolo di un poligono regolare misura " + DEG + r"\. Quanti lati ha\?", s, "data")
        nn = Symbol("n")
        sol = solve(S(nn) - int(m.group(1)) * nn, nn)
        if len(sol) != 1 or not sol[0].is_integer or sol[0] < 3:
            return None, [f"n = {sol}"]
        return str(sol[0]), errs
    if case == "ultimo":
        m = need(r"Un (quadrilatero|pentagono|esagono) convesso ha (tre|quattro|cinque) angoli di (.+)\. Quanto misura il (quarto|quinto|sesto) angolo\?", s, "data")
        n = {"quadrilatero": 4, "pentagono": 5, "esagono": 6}[m.group(1)]
        if {"tre": 3, "quattro": 4, "cinque": 5}[m.group(2)] != n - 1 or {"quarto": 4, "quinto": 5, "sesto": 6}[m.group(4)] != n:
            errs.append("counts do not match the polygon")
        known = [int(v) for v in re.findall(DEG, m.group(3))]
        if len(known) != n - 1 or [str(k) for k in known] != p["known"]:
            errs.append("known angles differ")
        last = S(n) - sum(known)
        if any(v >= 180 or v < 40 for v in known + [last]):
            errs.append("not convex or angle under 40")
        return str(last), errs
    return None, [f"unknown case {case}"]


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}

# ---------------------------------------------------------------------------
# Options


def option_value(o, level, unit):
    """What an option says, read from its LaTeX; compared with its values."""
    tex = o["latex"]
    if tex == NONE_TEXT:
        return "none"
    m = re.fullmatch(r"\\text\{(.+)\}", tex)
    if m:
        for k, v in list(NAMES.items()) + list(VERDICTS.items()):
            if v == m.group(1):
                return k
        return None
    m = re.fullmatch(r"\\hat\{(\d)\}", tex)
    if m:
        return m.group(1)
    rx = {"deg": r"(\d+)\^\\circ", "x": r"x = (\d+)", "n": r"(\d+)"}.get(unit)
    m = re.fullmatch(rx, tex) if rx else None
    return m.group(1) if m else None


def judge_level3(p, v):
    """An option of level 3 is wrong for a reason the student can see: wrong verdict, or false arithmetic."""
    pv, qv = int(p["p"]), int(p["q"])
    ty = p["type"]
    cong = ty.startswith("alterni") or ty == "corrispondenti"
    return {
        "si-congruenti": pv == qv,
        "si-supplementari": pv + qv == 180,
        "no-congruenti": pv != qv,
        "no-supplementari": pv + qv != 180,
        "non-si-puo": False,
    }[v], cong


def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    s = prose(sample)
    if not s:
        return ["problem without text"], None
    truth, e = LEVELS[lvl](p, s)
    errs += e
    if truth is None:
        return errs or ["no truth"], p.get("case")
    ans = sample["answer"]
    choice_level = lvl in (1, 3) or (lvl == 5 and p.get("case") == "non-esiste")
    if choice_level:
        if ans.get("kind") != "choice":
            errs.append("answer should be a choice")
        if sample.get("choice") is not None and sample["choice"] != ans:
            errs.append("choice variant differs from the answer")
    else:
        if ans.get("kind") != "number" or ans.get("value") != truth:
            errs.append(f"answer {ans} != {truth}")
        if not re.fullmatch(r"\d+", truth) or int(truth) <= 0:
            errs.append(f"answer {truth} not a positive integer")
    ch = ans if ans.get("kind") == "choice" else sample.get("choice")
    if ch is None:
        return errs + ["no choice variant"], p.get("case")
    opts = ch["options"]
    # The "non esiste" case of level 5 has only degrees among its numbers.
    unit = p.get("unit", "deg" if lvl == 5 else None)
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    said = [option_value(o, lvl, unit) for o in opts]
    for o, v in zip(opts, said):
        if v is None or o["values"] != [v]:
            errs.append(f"option {o['latex']!r} does not say its values {o['values']}")
    if len(set(said)) != len(said) or len({o["latex"] for o in opts}) != len(opts):
        errs.append("options not distinct")
    right = [v == truth for v in said]
    if sum(right) != 1:
        errs.append(f"{sum(right)} right options")
    if not isinstance(ch.get("correct"), int) or not right[ch["correct"]]:
        errs.append("correct index points to a wrong option")
    if lvl == 3:
        # Every wrong option must be wrong in the verdict or false as arithmetic: never a right verdict
        # resting on a true but beside-the-point fact.
        par = truth.startswith("si-")
        for v in said:
            if v == truth or v is None:
                continue
            true_fact, _ = judge_level3(p, v)
            if v != "non-si-puo" and v.startswith("si-") != par:
                continue
            if v == "non-si-puo":
                continue
            if true_fact:
                errs.append(f"option {v} is also defensible")
    if lvl == 1 and p["case"] == "trova":
        line = position(int(p["angle"]))[0]
        if any(position(int(v))[0] == line for v in said if v):
            errs.append("options on the same line as the given angle")
    if unit == "deg" and p.get("case") == "somma":
        # a sum of angles: every option a multiple of 180°
        for v in said:
            if v and v.isdigit() and int(v) % 180:
                errs.append(f"sum option {v}° not a multiple of 180°")
    elif unit == "deg":
        for v in said:
            # 0° only as the third angle of a triangle whose two angles already make 180°
            if v and v.isdigit() and not (0 < int(v) < 360 or (v == "0" and p.get("case") == "non-esiste")):
                errs.append(f"option {v}° out of range")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or solution")
    return errs, p.get("case")
