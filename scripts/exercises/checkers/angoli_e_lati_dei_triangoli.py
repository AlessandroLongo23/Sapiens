"""Checker for angoli-e-lati-dei-triangoli (specs/exercises/angoli-e-lati-dei-triangoli.md).

Written from the spec, not from the generator. Every answer is recomputed from what the student reads:
- level 1: the triangles are read back from the option LaTeX and classified again (isosceles means at
  least two congruent sides, so an equilateral triangle is isosceles too);
- level 2: the vertex correspondence is read from the problem (the name of the second triangle, or the
  congruent elements, for which every permutation of the vertices is tried);
- level 3: the criterion is decided from the three pairs of congruent elements;
- level 4: each proof is modelled with coordinates (random, satisfying the hypothesis): the steps and
  the thesis are measured, the three steps are classified with the criterion of level 3, and every
  wrong option is shown wrong (false justification, false statement, or no criterion);
- level 5: the triangle inequality on each triple, the interval |a - b| < x < a + b;
- levels 6-7: the missing angle from the sum of 180 degrees, with exact rationals.
"""
import math
import random
import re
from fractions import Fraction
from itertools import permutations

CASE_RANGES = {
    1: {"lati": (0.40, 0.60), "angoli": (0.40, 0.60)},
    3: {"primo": (0.17, 0.33), "secondo": (0.17, 0.33), "terzo": (0.17, 0.33), "lla": (0.10, 0.24), "aaa": (0.03, 0.14)},
    4: {"passo": (0.55, 0.78), "perche": (0.22, 0.45)},
    5: {"esiste": (0.25, 0.45), "non-esiste": (0.20, 0.40), "intervallo": (0.25, 0.45)},
    6: {"rettangolo": (0.20, 0.40), "somma": (0.60, 0.80)},
    7: {"vertice": (0.30, 0.50), "base": (0.30, 0.50), "ottuso": (0.10, 0.30)},
}


def choice_basics(ch, errs):
    if not ch:
        errs.append("no choice")
        return False
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    keys = [tuple(o.get("values", [])) for o in opts]
    if len(set(keys)) != len(keys):
        errs.append("options not distinct")
    lat = [o.get("latex", "") for o in opts]
    if len(set(lat)) != len(lat) or any(not t for t in lat):
        errs.append("option latex empty or repeated")
    c = ch.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append(f"correct index {c} out of range")
        return False
    return True


def one_true(ch, truths, errs, what):
    n = sum(1 for t in truths if t)
    if n != 1:
        errs.append(f"{what}: {n} options are right, expected 1")
    elif not truths[ch["correct"]]:
        errs.append(f"{what}: the marked option is wrong")


# ---------------------------------------------------------------------------
# Level 1


def exists(t):
    a, b, c = sorted(t)
    return a > 0 and c < a + b


def side_class(t):
    s = set(t)
    return {1: "equilatero", 2: "isoscele", 3: "scaleno"}[len(s)]


def angle_class(t):
    m = max(t)
    return "acutangolo" if m < 90 else "rettangolo" if m == 90 else "ottusangolo"


def read_triple(latex, unit):
    if unit == "cm":
        m = re.fullmatch(r"(\d+)\\text\{ cm\},\\ (\d+)\\text\{ cm\},\\ (\d+)\\text\{ cm\}", latex)
    else:
        m = re.fullmatch(r"(\d+)\^\\circ,\\ (\d+)\^\\circ,\\ (\d+)\^\\circ", latex)
    if not m:
        raise ValueError(f"unreadable triple {latex!r}")
    return [int(g) for g in m.groups()]


def check_level1(s, errs):
    m = re.fullmatch(r"\\text\{Quale di questi triangoli, dati i tre (lati|angoli), è (\w+)\?\}", s["problem"])
    if not m:
        errs.append("problem not in the expected form")
        return None
    by, target = m.groups()
    ch = s["answer"]
    if not choice_basics(ch, errs):
        return by
    tris = []
    for o in ch["options"]:
        t = read_triple(o["latex"], "cm" if by == "lati" else "deg")
        if [str(v) for v in t] != o["values"][1:] or o["values"][0] != by:
            errs.append(f"option values {o['values']} != latex {o['latex']}")
        tris.append(t)
    if len({tuple(sorted(t)) for t in tris}) != 4:
        errs.append("two options are the same triangle")
    if by == "lati":
        if target not in ("scaleno", "isoscele", "equilatero"):
            errs.append(f"unknown class {target}")
        for t in tris:
            if not exists(t) or min(t) < 2 or max(t) > 15:
                errs.append(f"sides {t} do not make a triangle or out of range")
        truths = [side_class(t) == target or (target == "isoscele" and side_class(t) == "equilatero") for t in tris]
    else:
        if target not in ("acutangolo", "rettangolo", "ottusangolo"):
            errs.append(f"unknown class {target}")
        for t in tris:
            if sum(t) != 180 or min(t) < 10:
                errs.append(f"angles {t} do not add to 180 or too small")
        truths = [angle_class(t) == target for t in tris]
    one_true(ch, truths, errs, "level 1")
    return by


# ---------------------------------------------------------------------------
# Levels 2 and 3: elements of two triangles

VERTEX = r"[A-Z]'?"


def split_tri(name):
    return re.findall(VERTEX, name)


def parse_element(t):
    """'\\hat{A}' or "\\hat{A}'" -> ('ang', 'A'); 'AB' or "A'B'" -> ('seg', ('A', 'B'))."""
    t = t.strip()
    m = re.fullmatch(r"\\hat\{([A-Z])\}('?)", t)
    if m:
        return ("ang", m.group(1) + m.group(2))
    vs = split_tri(t)
    if len(vs) == 2 and "".join(vs) == t and vs[0] != vs[1]:
        return ("seg", tuple(vs))
    raise ValueError(f"unreadable element {t!r}")


def parse_cong(t):
    parts = t.split(r"\cong")
    if len(parts) != 2:
        raise ValueError(f"not a congruence: {t!r}")
    return parse_element(parts[0]), parse_element(parts[1])


def holds(pair, m):
    """The congruence pair holds under the vertex map m (first triangle -> second)."""
    (k1, e1), (k2, e2) = pair
    if k1 != k2:
        return False
    if k1 == "ang":
        return m.get(e1) == e2
    if e1[0] not in m or e1[1] not in m:
        return False
    return {m[e1[0]], m[e1[1]]} == set(e2)


def criterion(pairs, T1):
    """pairs: congruences of elements of T1 with their images (already checked). Returns the criterion."""
    sides = [set(e) for (k, e), _ in pairs if k == "seg"]
    angs = [e for (k, e), _ in pairs if k == "ang"]
    if any(not (s <= set(T1)) for s in sides) or any(a not in T1 for a in angs):
        return None
    if len(sides) == 3 and len({frozenset(s) for s in sides}) == 3:
        return "terzo"
    if len(sides) == 2 and len(angs) == 1 and sides[0] != sides[1]:
        common = sides[0] & sides[1]
        return "primo" if common == {angs[0]} else "nessuno"
    if len(sides) == 1 and len(angs) == 2 and angs[0] != angs[1]:
        return "secondo" if set(angs) == sides[0] else "altro"
    if len(angs) == 3 and len(set(angs)) == 3:
        return "nessuno"
    return None


def givens_line(problem):
    body = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", problem, re.S)
    if not body:
        raise ValueError("problem is not an array")
    return [ln.strip() for ln in body.group(1).split(r" \\ ")]


def check_level2(s, errs):
    p = s["params"]
    ch = s["answer"]
    if not choice_basics(ch, errs):
        return None
    if p.get("sub") == "trova":
        m = re.fullmatch(r"\\begin\{array\}\{l\} \\text\{Sai che \$\\triangle ([A-Z]{3}) \\cong \\triangle ([A-Z]{3})\$\.\} \\\\ \\text\{Quale di queste congruenze è vera\?\} \\end\{array\}", s["problem"])
        if not m:
            errs.append("level 2 problem not in the expected form")
            return None
        T1, T2 = m.groups()
        if len(set(T1 + T2)) != 6:
            errs.append("repeated letters")
        if T2 == "".join(sorted(T2)):
            errs.append("the second triangle is written in alphabetical order: no trap")
        mp = dict(zip(T1, T2))
        truths = []
        for o in ch["options"]:
            pair = parse_cong(o["latex"])
            truths.append(holds(pair, mp))
            (k1, e1), (_, e2) = pair
            want = ["lato", "".join(sorted(e1)), "".join(sorted(e2))] if k1 == "seg" else ["angolo", e1, e2]
            if o["values"] != want:
                errs.append(f"option values {o['values']} != latex {o['latex']}")
        one_true(ch, truths, errs, "level 2 trova")
        return None
    lines = givens_line(s["problem"])
    m = re.fullmatch(r"\\text\{I triangoli \$([A-Z]{3})\$ e \$([A-Z]{3})\$ hanno:\}", lines[0])
    m2 = re.fullmatch(r"\\text\{Sono congruenti per il (primo|terzo) criterio\. Quale scrittura è giusta\?\}", lines[2]) if len(lines) == 3 else None
    if not m or not m2:
        errs.append("level 2 problem not in the expected form")
        return None
    T1, T2 = m.groups()
    pairs = [parse_cong(t) for t in lines[1].split(r",\quad ")]
    good = [q for q in permutations(T2) if all(holds(pr, dict(zip(T1, q))) for pr in pairs)]
    if len(good) != 1:
        errs.append(f"{len(good)} vertex orders fit the givens")
        return None
    if criterion(pairs, T1) != m2.group(1):
        errs.append(f"the givens do not give the {m2.group(1)} criterion")
    truths = []
    for o in ch["options"]:
        mm = re.fullmatch(r"\\triangle ([A-Z]{3}) \\cong \\triangle ([A-Z]{3})", o["latex"])
        if not mm or mm.group(1) != T1 or sorted(mm.group(2)) != sorted(T2) or o["values"] != [mm.group(2)]:
            errs.append(f"bad option {o['latex']}")
            truths.append(False)
            continue
        truths.append(tuple(mm.group(2)) == good[0])
    one_true(ch, truths, errs, "level 2 scrivi")
    if "".join(good[0]) != T2 and not any(o["values"] == [T2] for o in ch["options"]):
        errs.append("the alphabetical order is missing among the options")
    return None


CRITS = ["primo", "secondo", "terzo", "nessuno"]
CRIT_LATEX = [r"\text{primo criterio}", r"\text{secondo criterio}", r"\text{terzo criterio}", r"\text{nessun criterio}"]


def check_level3(s, errs):
    ch = s["answer"]
    if not choice_basics(ch, errs):
        return None
    if [o["latex"] for o in ch["options"]] != CRIT_LATEX or [o["values"] for o in ch["options"]] != [[c] for c in CRITS]:
        errs.append("the four criteria options are not the fixed ones")
    lines = givens_line(s["problem"])
    m = re.fullmatch(r"\\text\{I triangoli \$([A-Z]{3})\$ e \$((?:[A-Z]'?){3})\$ hanno:\}", lines[0]) if len(lines) == 2 else None
    if not m:
        errs.append("level 3 problem not in the expected form")
        return None
    T1, T2 = split_tri(m.group(1)), split_tri(m.group(2))
    if len(set(T1 + T2)) != 6:
        errs.append("repeated vertices")
    pairs = [parse_cong(t) for t in lines[1].split(r",\quad ")]
    mp = dict(zip(T1, T2))
    if len(pairs) != 3 or not all(holds(pr, mp) for pr in pairs):
        errs.append("the elements are not ordinatamente corresponding")
    if len({(k, frozenset(e) if k == "seg" else e) for (k, e), _ in pairs}) != 3:
        errs.append("repeated element")
    crit = criterion(pairs, T1)
    if crit not in CRITS:
        errs.append(f"elements outside the spec: {crit}")
        return None
    if CRITS[ch["correct"]] != crit:
        errs.append(f"marked {CRITS[ch['correct']]}, the elements give {crit}")
    kind = crit
    if crit == "nessuno":
        kind = "aaa" if all(k == "ang" for (k, _), _ in pairs) else "lla"
    return kind


# ---------------------------------------------------------------------------
# Level 4: proofs, with a coordinate model of each figure

WHYS = {"ipotesi", "vertice", "comune", "bisettrice", "supplementari", "base", "disegno", "tesi"}


def unit(a):
    return (math.cos(a), math.sin(a))


def add(p, q, k=1.0):
    return (p[0] + k * q[0], p[1] + k * q[1])


def model(tid, r):
    """Coordinates of the canonical points, random but satisfying the hypothesis."""
    if tid == "punto-medio-comune":
        a = unit(r.uniform(0.1, 1.2))
        c = unit(r.uniform(1.8, 2.9))
        ka, kc = r.uniform(1, 3), r.uniform(1, 3)
        O = (0.0, 0.0)
        return {"O": O, "A": (-ka * a[0], -ka * a[1]), "B": (ka * a[0], ka * a[1]), "C": (kc * c[0], kc * c[1]), "D": (-kc * c[0], -kc * c[1])}
    if tid == "secondo-criterio-punto-medio":
        A, B = (0.0, 0.0), (4.0, 0.0)
        M = (2.0, 0.0)
        C = add(A, unit(r.uniform(0.4, 1.3)), r.uniform(1, 3))
        D = (2 * M[0] - C[0], 2 * M[1] - C[1])
        return {"A": A, "B": B, "M": M, "C": C, "D": D}
    if tid == "aquilone":
        A, B = (0.0, 0.0), (4.0, 0.0)
        C = (r.uniform(0.5, 3.5), r.uniform(1, 3))
        return {"A": A, "B": B, "C": C, "D": (C[0], -C[1])}
    if tid == "teorema-isoscele":
        h, w = r.uniform(1.5, 4), r.uniform(1, 3)
        A, B, C = (0.0, h), (-w, 0.0), (w, 0.0)
        return {"A": A, "B": B, "C": C, "D": (0.0, 0.0)}
    if tid == "triangoli-sovrapposti":
        h, w, t = r.uniform(1.5, 4), r.uniform(1, 3), r.uniform(0.2, 0.8)
        A, B, C = (0.0, h), (-w, 0.0), (w, 0.0)
        return {"A": A, "B": B, "C": C, "D": add(A, (B[0] - A[0], B[1] - A[1]), t), "E": add(A, (C[0] - A[0], C[1] - A[1]), t)}
    if tid == "prolungamenti-base":
        h, w, d = r.uniform(1.5, 4), r.uniform(1, 3), r.uniform(0.5, 3)
        return {"A": (0.0, h), "B": (-w, 0.0), "C": (w, 0.0), "D": (-w - d, 0.0), "E": (w + d, 0.0)}
    raise ValueError(f"unknown template {tid}")


# Written again from the spec (the lesson's examples): hypothesis, thesis, the two triangles with their
# vertices in corresponding order, the three steps, the criterion, and what \hat{X} means in each figure.
TEMPLATES = {
    "punto-medio-comune": dict(roles="ABCDO", ipo=["seg:AO=seg:OB", "seg:CO=seg:OD"], tesi="seg:AC=seg:BD", tri=("AOC", "BOD"),
                               steps=[("seg:AO=seg:OB", "ipotesi"), ("seg:CO=seg:OD", "ipotesi"), ("ang:AOC=ang:BOD", "vertice")], crit=1, hat={}),
    "secondo-criterio-punto-medio": dict(roles="ABCDM", ipo=["seg:AM=seg:MB", "ang:MAC=ang:MBD"], tesi="seg:CM=seg:MD", tri=("AMC", "BMD"),
                                         steps=[("seg:AM=seg:MB", "ipotesi"), ("ang:MAC=ang:MBD", "ipotesi"), ("ang:AMC=ang:BMD", "vertice")], crit=2, hat={}),
    "aquilone": dict(roles="ABCD", ipo=["seg:AC=seg:AD", "seg:BC=seg:BD"], tesi="ang:CAB=ang:DAB", tri=("ABC", "ABD"),
                     steps=[("seg:AC=seg:AD", "ipotesi"), ("seg:BC=seg:BD", "ipotesi"), ("com:seg:AB", "comune")], crit=3, hat={}),
    "teorema-isoscele": dict(roles="ABCD", ipo=["seg:AB=seg:AC"], tesi="ang:B=ang:C", tri=("ABD", "ACD"),
                             steps=[("seg:AB=seg:AC", "ipotesi"), ("ang:BAD=ang:CAD", "bisettrice"), ("com:seg:AD", "comune")], crit=1,
                             hat={"B": "ABC", "C": "ACB"}),
    "triangoli-sovrapposti": dict(roles="ABCDE", ipo=["seg:AB=seg:AC", "seg:AD=seg:AE"], tesi="seg:BE=seg:CD", tri=("ABE", "ACD"),
                                  steps=[("seg:AB=seg:AC", "ipotesi"), ("seg:AE=seg:AD", "ipotesi"), ("com:ang:A", "comune")], crit=1,
                                  hat={"A": "BAC"}),
    "prolungamenti-base": dict(roles="ABCDE", ipo=["seg:AB=seg:AC", "seg:BD=seg:CE"], tesi="seg:AD=seg:AE", tri=("ABD", "ACE"),
                               steps=[("seg:AB=seg:AC", "ipotesi"), ("seg:BD=seg:CE", "ipotesi"), ("ang:ABD=ang:ACE", "supplementari")], crit=1,
                               hat={"D": "ADB", "E": "AEC"}),
}

ORD = ["primo", "secondo", "terzo"]
WHY_TEXT = {
    "ipotesi": "per ipotesi", "vertice": "opposti al vertice", "bisettrice": "per la bisettrice",
    "supplementari": "supplementari di angoli congruenti", "base": "angoli alla base dell'isoscele",
    "disegno": "si vede dal disegno", "tesi": "è la tesi",
}
WHY_OPTION = {
    "ipotesi": "per ipotesi", "vertice": "sono angoli opposti al vertice", "bisettrice": "per la definizione di bisettrice",
    "supplementari": "supplementari di angoli congruenti", "base": "angoli alla base dell'isoscele",
    "disegno": "si vede dal disegno", "tesi": "è la tesi",
}


def measure(el, pts, hat):
    kind, name = el.split(":")
    if kind == "seg":
        (x1, y1), (x2, y2) = pts[name[0]], pts[name[1]]
        return math.hypot(x2 - x1, y2 - y1)
    if len(name) == 1:
        name = hat[name]
    P, Q, R = pts[name[0]], pts[name[1]], pts[name[2]]
    a = math.atan2(P[1] - Q[1], P[0] - Q[0]) - math.atan2(R[1] - Q[1], R[0] - Q[0])
    a = abs(a) % (2 * math.pi)
    return min(a, 2 * math.pi - a)


def stmt_true(code, T, r):
    """Numerically, in five random models of the figure (canonical letters)."""
    if code.startswith("com:"):
        return True
    left, right = code.split("=")
    for _ in range(5):
        pts = model(T["id"], r)
        if abs(measure(left, pts, T["hat"]) - measure(right, pts, T["hat"])) > 1e-9:
            return False
    return True


def element_in(el, tri, hat):
    """(kind, vertices) of el as an element of the triangle tri, or None if el is not one of its elements."""
    kind, name = el.split(":")
    if kind == "seg":
        return ("seg", tuple(name)) if set(name) <= set(tri) and len(set(name)) == 2 else None
    if len(name) == 1:
        return ("ang", name) if name in tri else None
    if set(name) == set(tri) and len(set(name)) == 3:
        return ("ang", name[1])
    return None


def step_pair(code, T):
    """The step as a congruence between an element of the first triangle and one of the second."""
    t1, t2 = T["tri"]
    if code.startswith("com:"):
        el = code[4:]
        a, b = element_in(el, t1, T["hat"]), element_in(el, t2, T["hat"])
        return (a, b) if a and b else None
    left, right = code.split("=")
    a, b = element_in(left, t1, T["hat"]), element_in(right, t2, T["hat"])
    if a and b:
        return (a, b)
    a, b = element_in(right, t1, T["hat"]), element_in(left, t2, T["hat"])
    return (a, b) if a and b else None


def crit_of(codes, T):
    pairs = [step_pair(c, T) for c in codes]
    if any(p is None for p in pairs):
        return None
    mp = dict(zip(T["tri"][0], T["tri"][1]))
    if not all(holds(p, mp) for p in pairs):
        return None
    return criterion(pairs, list(T["tri"][0]))


def norm_stmt(code):
    if code.startswith("com:"):
        return code
    return "=".join(sorted(code.split("=")))


def canon_code(code, inv):
    return re.sub(r"[A-Z]", lambda m: inv.get(m.group(0), "?"), code)


def stmt_tex(code, lab):
    def el(e):
        kind, name = e.split(":")
        name = "".join(lab[c] for c in name)
        if kind == "seg":
            return name
        return rf"\hat{{{name}}}" if len(name) == 1 else rf"\widehat{{{name}}}"

    if code.startswith("com:"):
        return el(code[4:]) + r" \text{ in comune}"
    l, r = code.split("=")
    return f"{el(l)} \\cong {el(r)}"


def check_level4(s, errs):
    p = s["params"]
    tid = p.get("template")
    if tid not in TEMPLATES:
        errs.append(f"unknown template {tid}")
        return None
    T = dict(TEMPLATES[tid], id=tid)
    lab = p.get("labels", {})
    if sorted(lab) != sorted(T["roles"]) or len(set(lab.values())) != len(lab) or not all(re.fullmatch(r"[A-Z]", v) for v in lab.values()):
        errs.append(f"bad labels {lab}")
        return None
    inv = {v: k for k, v in lab.items()}
    r = random.Random(s["seed"])
    # The model satisfies the hypothesis; the steps and the thesis follow.
    for code in T["ipo"] + [T["tesi"]] + [c for c, _ in T["steps"]]:
        if not stmt_true(code, T, r):
            errs.append(f"model: {code} is false")
    if crit_of([c for c, _ in T["steps"]], T) != ORD[T["crit"] - 1]:
        errs.append(f"the steps of {tid} do not give the {ORD[T['crit'] - 1]} criterion")
    # What the student reads.
    prob = s["problem"]
    k = int(p.get("missing", 0)) - 1
    if not 0 <= k <= 2:
        errs.append("bad missing step")
        return None
    need = [rf"\text{{Per il {ORD[T['crit'] - 1]} criterio $\triangle {''.join(lab[c] for c in T['tri'][0])} \cong \triangle {''.join(lab[c] for c in T['tri'][1])}$",
            "Ipotesi: $" + r",\ ".join(stmt_tex(c, lab) for c in T["ipo"]) + "$", "Tesi: $" + stmt_tex(T["tesi"], lab) + "$"]
    for i, (code, why) in enumerate(T["steps"]):
        if i == k:
            continue
        if why == "supplementari":
            # Too wide for a phone on one line: the reason goes on a second line.
            line = rf"\begin{{array}}{{l}} {i + 1}.\ {stmt_tex(code, lab)}\text{{,}} \\ \quad \text{{{WHY_TEXT[why]}}} \end{{array}}"
        else:
            line = f"{i + 1}.\\ {stmt_tex(code, lab)}" + ("" if why == "comune" else f"\\text{{, {WHY_TEXT[why]}}}")
        need.append(line)
    for m in re.finditer(r"rispetto (ad?) \$([A-Z])", prob):
        if (m.group(1) == "ad") != (m.group(2) in "AH"):
            errs.append(f"'rispetto {m.group(1)} {m.group(2)}': ad only before A or H")
    for n in need:
        if n not in prob:
            errs.append(f"problem lacks {n!r}")
    ch = s["answer"]
    if not choice_basics(ch, errs):
        return p.get("sub")
    right_code, right_why = T["steps"][k]
    ipo = {norm_stmt(c) for c in T["ipo"]}
    others = [c for i, (c, _) in enumerate(T["steps"]) if i != k]
    if p.get("sub") == "passo":
        if f"{k + 1}.\\ \\ ?" not in prob:
            errs.append("the missing step is not marked")
        truths = []
        for o in ch["options"]:
            vals = o["values"]
            if len(vals) != 2 or vals[1] not in WHYS:
                errs.append(f"bad option values {vals}")
                truths.append(False)
                continue
            code, why = canon_code(vals[0], inv), vals[1]
            reason = r"\text{supplementari di} \\ \text{angoli congruenti}" if why == "supplementari" else rf"\text{{{WHY_TEXT.get(why)}}}"
            want = stmt_tex(code, lab) if why == "comune" else rf"\begin{{gathered}} {stmt_tex(code, lab)} \\ {reason} \end{{gathered}}"
            if o["latex"] != want:
                errs.append(f"option latex {o['latex']!r} != values {vals}")
            ok = norm_stmt(code) == norm_stmt(right_code) and why == right_why
            truths.append(ok)
            if ok:
                continue
            # A wrong option must be wrong for a reason the lesson names.
            reasons = []
            if why in ("disegno", "tesi"):
                reasons.append("not a justification")
            if norm_stmt(code) == norm_stmt(right_code) and why != right_why:
                reasons.append("wrong reason for the right statement")
            if why == "ipotesi" and norm_stmt(code) not in ipo:
                reasons.append("not in the hypothesis")
            if why == "comune" and not code.startswith("com:"):
                reasons.append("not common")
            if not stmt_true(code, T, r):
                reasons.append("false")
            if crit_of(others + [code], T) != ORD[T["crit"] - 1]:
                reasons.append("no criterion")
            if not reasons:
                errs.append(f"wrong option {vals} is not shown wrong")
        one_true(ch, truths, errs, "level 4 passo")
    elif p.get("sub") == "perche":
        if right_why in ("comune", "ipotesi"):
            errs.append(f"asked the reason of a step {right_why}: the answer is written in the problem")
        if f"{k + 1}.\\ {stmt_tex(right_code, lab)}\\text{{, perché?}}" not in prob:
            errs.append("the asked step is not in the problem")
        truths = []
        for o in ch["options"]:
            w = o["values"][0] if len(o["values"]) == 1 else None
            shown = r"\begin{gathered} \text{supplementari di} \\ \text{angoli congruenti} \end{gathered}" if w == "supplementari" else rf"\text{{{WHY_OPTION.get(w)}}}"
            if w not in WHY_OPTION or o["latex"] != shown:
                errs.append(f"bad reason option {o}")
            truths.append(w == right_why)
        one_true(ch, truths, errs, "level 4 perche")
    else:
        errs.append(f"unknown sub {p.get('sub')}")
    return p.get("sub")


# ---------------------------------------------------------------------------
# Level 5


def check_level5(s, errs):
    ch = s["answer"]
    if not choice_basics(ch, errs):
        return None
    prob = s["problem"]
    m = re.fullmatch(r"\\text\{Quale di queste terne (non )?può essere quella dei lati di un triangolo\?\}", prob)
    if m:
        sub = "non-esiste" if m.group(1) else "esiste"
        tris = []
        for o in ch["options"]:
            t = read_triple(o["latex"], "cm")
            if o["values"] != [str(v) for v in t]:
                errs.append(f"values {o['values']} != latex")
            if min(t) < 2 or max(t) > 20:
                errs.append(f"sides {t} out of range")
            tris.append(t)
        if len({tuple(sorted(t)) for t in tris}) != 4:
            errs.append("repeated triple")
        want = sub == "esiste"
        one_true(ch, [exists(t) == want for t in tris], errs, "level 5")
        # The traps of the lesson: a triple whose longest side equals the sum of the others.
        degenerate = sum(1 for t in tris if sorted(t)[2] == sorted(t)[0] + sorted(t)[1])
        if sub == "esiste" and degenerate == 0:
            errs.append("no degenerate triple among the wrong ones")
        return sub
    m = re.fullmatch(r"\\begin\{array\}\{l\} \\text\{Due lati di un triangolo sono lunghi \$(\d+)\$ cm e \$(\d+)\$ cm\.\} \\\\ \\text\{Quali lunghezze \$x\$ \(in cm\) può avere il terzo lato\?\} \\end\{array\}", prob)
    if not m:
        errs.append("level 5 problem not in the expected form")
        return None
    a, b = int(m.group(1)), int(m.group(2))
    if a == b:
        errs.append("equal sides")
    truths = []
    for o in ch["options"]:
        mm = re.fullmatch(r"(\d+) (<|\\leq) x (<|\\leq) (\d+)", o["latex"])
        if not mm or mm.group(2) != mm.group(3):
            errs.append(f"bad interval {o['latex']}")
            truths.append(False)
            continue
        lo, hi, strict = int(mm.group(1)), int(mm.group(4)), mm.group(2) == "<"
        if o["values"] != ["<" if strict else "<=", str(lo), str(hi)]:
            errs.append(f"values {o['values']} != latex {o['latex']}")
        truths.append(strict and lo == abs(a - b) and hi == a + b)
    one_true(ch, truths, errs, "level 5 intervallo")
    return "intervallo"


# ---------------------------------------------------------------------------
# Levels 6 and 7


def deg_latex(v):
    v = Fraction(v)
    if v.denominator == 1:
        return f"{v.numerator}^\\circ"
    if v.denominator == 2:
        return f"{v.numerator // 2}{{,}}5^\\circ"
    raise ValueError(f"not a half degree: {v}")


def check_number(s, truth, errs):
    ans = s["answer"]
    if ans.get("kind") != "number":
        errs.append("answer must be a number")
        return
    if Fraction(ans["value"]) != truth:
        errs.append(f"answer {ans['value']} != {truth}")
    if truth.denominator not in (1, 2) or not 0 < truth < 180:
        errs.append(f"angle {truth} not a positive half degree under 180")
    if deg_latex(truth) not in s["solution"]:
        errs.append("solution does not show the value")
    ch = s.get("choice")
    if choice_basics(ch, errs):
        vals = []
        for o in ch["options"]:
            v = Fraction(o["values"][0])
            if o["latex"] != deg_latex(v) or not 0 < v < 180:
                errs.append(f"option {o} not a valid angle")
            vals.append(v)
        one_true(ch, [v == truth for v in vals], errs, "numeric choice")


def check_level6(s, errs):
    prob = s["problem"]
    m = re.fullmatch(r"\\begin\{array\}\{l\} \\text\{Il triangolo \$ABC\$ è rettangolo in \$([ABC])\$ e \$\\hat\{([ABC])\} = (\d+)\^\\circ\$\.\} \\\\ \\hat\{([ABC])\} = \\ \? \\end\{array\}", prob)
    if m:
        rt, g, v, u = m.group(1), m.group(2), int(m.group(3)), m.group(4)
        if len({rt, g, u}) != 3 or not 10 <= v <= 80:
            errs.append("bad right triangle")
        check_number(s, Fraction(90 - v), errs)
        return "rettangolo"
    m = re.fullmatch(r"\\begin\{array\}\{l\} \\text\{In un triangolo \$ABC\$ si ha \$\\hat\{([ABC])\} = (\d+)\^\\circ\$ e \$\\hat\{([ABC])\} = (\d+)\^\\circ\$\.\} \\\\ \\hat\{([ABC])\} = \\ \? \\end\{array\}", prob)
    if not m:
        errs.append("level 6 problem not in the expected form")
        return None
    x, a, y, b, u = m.groups()
    a, b = int(a), int(b)
    if len({x, y, u}) != 3:
        errs.append("repeated vertex")
    c = 180 - a - b
    if min(a, b, c) < 10:
        errs.append(f"angles {a}, {b}, {c} too small")
    check_number(s, Fraction(c), errs)
    return "somma"


def check_level7(s, errs):
    prob = s["problem"]
    m = re.fullmatch(r"\\begin\{array\}\{l\} \\text\{Nel triangolo isoscele \$ABC\$ di base \$BC\$ l'angolo al vertice misura \$\\hat\{A\} = (\d+)\^\\circ\$\.\} \\\\ \\hat\{B\} = \\ \? \\end\{array\}", prob)
    if m:
        v = int(m.group(1))
        if not 20 <= v <= 160 or v == 60:
            errs.append(f"vertex {v} out of range")
        check_number(s, Fraction(180 - v, 2), errs)
        return "vertice"
    m = re.fullmatch(r"\\begin\{array\}\{l\} \\text\{Nel triangolo isoscele \$ABC\$ di base \$BC\$ l'angolo alla base \$\\hat\{B\}\$ misura \$(\d+)\^\\circ\$\.\} \\\\ \\hat\{A\} = \\ \? \\end\{array\}", prob)
    if m:
        b = int(m.group(1))
        if not 10 <= b <= 85 or b == 60:
            errs.append(f"base angle {b} out of range")
        check_number(s, Fraction(180 - 2 * b), errs)
        return "base"
    m = re.fullmatch(r"\\begin\{array\}\{l\} \\text\{In un triangolo isoscele un angolo misura \$(\d+)\^\\circ\$\.\} \\\\ \\text\{Quanto misura ciascuno degli altri due angoli\?\} \\end\{array\}", prob)
    if m:
        v = int(m.group(1))
        # The given angle can be a base angle only if it is acute: here it is not, so it is the vertex.
        if v < 90 or v >= 180:
            errs.append(f"angle {v} is not right or obtuse: the question would be ambiguous")
        check_number(s, Fraction(180 - v, 2), errs)
        return "ottuso"
    errs.append("level 7 problem not in the expected form")
    return None


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    lvl = sample.get("level")
    for f in ("prompt", "problem", "solution"):
        if not sample.get(f):
            errs.append(f"{f} empty")
    if not sample.get("steps"):
        errs.append("no steps")
    blob = " ".join([sample.get("problem", ""), sample.get("solution", "")] + sample.get("steps", []))
    for bad in ("undefined", "NaN", "null", "[object"):
        if bad in blob:
            errs.append(f"'{bad}' in the text")
    level_check = {1: check_level1, 2: check_level2, 3: check_level3, 4: check_level4, 5: check_level5, 6: check_level6, 7: check_level7}.get(lvl)
    if level_check is None:
        return [f"unknown level {lvl}"], None
    try:
        kind = level_check(sample, errs)
    except (ValueError, IndexError, TypeError, KeyError) as e:
        return errs + [f"unreadable sample: {e}"], None
    if lvl <= 5:
        ch = sample.get("choice")
        if ch is not None and ch != sample["answer"]:
            errs.append("choice differs from the answer at a multiple-choice level")
    return errs, kind
