"""Checker for fis-scalari-vettori (specs/exercises/fis-scalari-vettori.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/13-fis-scalari-vettori.md). The problem is
read back from its text; levels 2, 4 and 5 also read the scene, and check that it draws the data of the text and
not the answer (the displacement is only in the solution scene).
"""
import re

from sympy import Rational, sqrt

from checkers._vettori import check_choice, common, fmt_exact, num, parse_option, prose, scene_vectors

CASE_RANGES = {
    1: {"vettoriale": (0.40, 0.60), "scalare": (0.40, 0.60)},
    2: {k: (0.18, 0.32) for k in ["uguale", "opposto", "stessoVerso", "stessoModulo"]},
    3: {"modulo": (0.40, 0.60), "lunghezza": (0.40, 0.60)},
    4: {"distanza": (0.40, 0.60), "spostamento": (0.40, 0.60)},
    5: {"due tratti": (0.40, 0.60), "tre tratti": (0.40, 0.60)},
}

# Level 1: what each phrase is, from the lesson's lists (spostamento, velocità, accelerazione, forza are vectors;
# massa, tempo, temperatura, volume, densità, lunghezza di un percorso, area are scalars).
KIND = {
    "lo spostamento di un'auto": "vettoriale",
    "la velocità di un treno": "vettoriale",
    "la forza su una porta": "vettoriale",
    "l'accelerazione di una moto": "vettoriale",
    "lo spostamento di una nave": "vettoriale",
    "la forza del vento": "vettoriale",
    "la massa di uno zaino": "scalare",
    "la durata di una partita": "scalare",
    "la temperatura dell'aria": "scalare",
    "il volume di una bottiglia": "scalare",
    "la densità del ferro": "scalare",
    "la distanza percorsa": "scalare",
    "l'area di un campo": "scalare",
}


def level1(s, sample, errs):
    m = re.fullmatch(r"Quale di queste grandezze è (vettoriale|scalare)\?", s)
    if not m:
        errs.append(f"level 1 text: {s!r}")
        return None
    want = m.group(1)
    opts = [o["latex"] for o in sample["answer"]["options"]]
    phrases = []
    for o in opts:
        mm = re.fullmatch(r"\\text\{(.*)\}", o)
        if not mm or mm.group(1) not in KIND:
            errs.append(f"unknown option {o!r}")
            return want
        phrases.append(mm.group(1))
    good = [p for p in phrases if KIND[p] == want]
    if len(good) != 1:
        errs.append(f"{len(good)} options are {want}")
        return want
    check_choice(sample, errs, f"\\text{{{good[0]}}}")
    return want


QUESTIONS = {
    r"è uguale ad $\vec{a}$": "uguale",
    r"è l'opposto di $\vec{a}$": "opposto",
    r"ha la stessa direzione e lo stesso verso di $\vec{a}$, ma un modulo diverso": "stessoVerso",
    r"ha lo stesso modulo di $\vec{a}$, ma una direzione diversa": "stessoModulo",
}


def relation(a, w):
    """Which of the four questions w answers, with respect to a."""
    par = a[0] * w[1] - a[1] * w[0] == 0
    same_len = a[0] ** 2 + a[1] ** 2 == w[0] ** 2 + w[1] ** 2
    same_verso = par and a[0] * w[0] + a[1] * w[1] > 0
    out = set()
    if par and same_verso and same_len:
        out.add("uguale")
    if par and not same_verso and same_len:
        out.add("opposto")
    if par and same_verso and not same_len:
        out.add("stessoVerso")
    if same_len and not par:
        out.add("stessoModulo")
    return out


def level2(s, sample, errs):
    m = re.fullmatch(r"Nella figura, quale vettore (.*)\?", s)
    q = QUESTIONS.get(m.group(1)) if m else None
    if not q:
        errs.append(f"level 2 text: {s!r}")
        return None
    sc = sample.get("scene")
    if not sc or sc["type"] != "vettori-piano":
        errs.append("no scene")
        return q
    vecs = scene_vectors(sc)
    names = [w.get("nome") for _, _, w in vecs]
    if names != ["a", "b", "c", "d", "e"]:
        errs.append(f"scene vectors {names}")
        return q
    g = sc["data"]["griglia"]
    comps = {}
    for (x0, y0), (x1, y1), w in vecs:
        for x, y in ((x0, y0), (x1, y1)):
            if not (g["x0"] <= x <= g["x1"] and g["y0"] <= y <= g["y1"]) or x != int(x) or y != int(y):
                errs.append(f"vector {w['nome']} off the grid crossings")
        comps[w["nome"]] = (x1 - x0, y1 - y0)
    a = comps["a"]
    if a == (0, 0):
        errs.append("a is null")
    right = [n for n in "bcde" if q in relation(a, comps[n])]
    if len(right) != 1:
        errs.append(f"{len(right)} vectors answer {q}: {right}")
        return q
    opts = check_choice(sample, errs, f"\\vec{{{right[0]}}}")
    if sorted(opts) != [r"\vec{b}", r"\vec{c}", r"\vec{d}", r"\vec{e}"]:
        errs.append(f"options {opts}")
    return q


UNITS = {"N": "forza", "m": "spostamento", "km": "spostamento", "km/h": "velocità"}


def level3(s, sample, errs):
    m = re.fullmatch(
        r"In un disegno in scala \$1\\,\\text\{cm\} : (\d+)\\,\\text\{([^}]+)\}\$ (una forza|uno spostamento|una velocità) è rappresentat[oa] da una freccia lunga \$(\S+)\\,\\text\{cm\}\$\. Quanto vale il modulo (della forza|dello spostamento|della velocità)\?",
        s,
    )
    if m:
        k, unit, L = Rational(m.group(1)), m.group(2), num(m.group(4))
        if UNITS.get(unit) not in m.group(3) or UNITS[unit] not in m.group(5):
            errs.append("unit and quantity do not match")
        truth = L * k
        check_choice(sample, errs, f"{fmt_exact(truth)}\\,\\text{{{unit}}}")
        opts_ok(sample, errs, unit)
        return "modulo"
    m = re.fullmatch(
        r"Devi disegnare (una forza|uno spostamento|una velocità) di \$(\S+)\\,\\text\{([^}]+)\}\$ in scala \$1\\,\\text\{cm\} : (\d+)\\,\\text\{([^}]+)\}\$\. Quanto è lunga la freccia\?",
        s,
    )
    if m:
        M, unit, k = num(m.group(2)), m.group(3), Rational(m.group(4))
        if unit != m.group(5) or UNITS.get(unit) not in m.group(1):
            errs.append("units do not match")
        truth = M / k
        check_choice(sample, errs, f"{fmt_exact(truth)}\\,\\text{{cm}}")
        opts_ok(sample, errs, "cm")
        return "lunghezza"
    errs.append(f"level 3 text: {s!r}")
    return None


def opts_ok(sample, errs, unit):
    for o in sample["answer"]["options"]:
        v, u, extra = parse_option(o["latex"])
        if u != unit or extra:
            errs.append(f"option unit {o['latex']!r}")
        if num(v) <= 0 or fmt_exact(num(v)) != v:
            errs.append(f"option value {v!r}")


def level4(s, sample, errs):
    m = re.fullmatch(r"(Un ciclista|Un'auto|Un cane|Una barca) (percorre|corre per|naviga per) (.*), lungo (una strada dritta|una spiaggia dritta|un canale dritto)\. Quanto vale (lo spostamento|la distanza percorsa)\?", s)
    if not m:
        errs.append(f"level 4 text: {s!r}")
        return None
    legs = re.findall(r"\$(\d+)\\,\\text\{(km|m)\}\$ verso (est|ovest)", m.group(3))
    if len(legs) not in (2, 3) or len({u for _, u, _ in legs}) != 1:
        errs.append(f"legs {legs}")
        return None
    unit = legs[0][1]
    signed = [Rational(n) * (1 if d == "est" else -1) for n, _, d in legs]
    if any(signed[i] * signed[i + 1] > 0 for i in range(len(signed) - 1)):
        errs.append("two stretches in a row in the same verso")
    net, dist = sum(signed), sum(abs(x) for x in signed)
    if net == 0:
        errs.append("null displacement")
        return None
    # The scene: the stretches in order, one row each, from A; no displacement.
    sc = sample.get("scene")
    vecs = scene_vectors(sc) if sc else []
    if len(vecs) != len(signed):
        errs.append("the scene does not draw exactly the stretches")
    else:
        x = Rational(0)
        for ((x0, _), (x1, _), _w), sgn in zip(vecs, signed):
            if x0 != x or x1 - x0 != sgn:
                errs.append("scene stretch differs from the text")
            x = x1
    sol = sample.get("solutionScene")
    if not sol or not any(p == (0, 0) and q == (net, 0) for p, q, _ in scene_vectors(sol)):
        errs.append("the solution scene lacks the displacement")
    if m.group(5) == "lo spostamento":
        verso = "est" if net > 0 else "ovest"
        check_choice(sample, errs, f"{fmt_exact(abs(net))}\\,\\text{{{unit}}}\\ \\text{{verso {verso}}}")
        for o in sample["answer"]["options"]:
            v, u, extra = parse_option(o["latex"])
            if u != unit or extra not in ("verso est", "verso ovest") or num(v) <= 0:
                errs.append(f"option {o['latex']!r}")
        return "spostamento"
    check_choice(sample, errs, f"{fmt_exact(dist)}\\,\\text{{{unit}}}")
    opts_ok(sample, errs, unit)
    return "distanza"


DIRS = {"est": (1, 0), "ovest": (-1, 0), "nord": (0, 1), "sud": (0, -1)}


def level5(s, sample, errs):
    m = re.fullmatch(
        r"(.*) \$(\d+)\\,\\text\{(m|km)\}\$\. (.*) parte da \$A\$ e va per (.*), fino a \$B\$\. Quanto vale il modulo dello spostamento da \$A\$ a \$B\$\?",
        s,
    )
    if not m:
        errs.append(f"level 5 text: {s!r}")
        return None
    each, unit = Rational(m.group(2)), m.group(3)
    legs = re.findall(r"(\d+) (?:isolat[oi]|quadrat[oi]|quadrett[oi]) verso (est|ovest|nord|sud)", m.group(5))
    if len(legs) not in (2, 3):
        errs.append(f"legs {legs}")
        return None
    vs = [(int(n) * DIRS[d][0], int(n) * DIRS[d][1]) for n, d in legs]
    for i in range(len(vs) - 1):
        if vs[i][0] * vs[i + 1][0] + vs[i][1] * vs[i + 1][1] != 0:
            errs.append("two stretches in a row not perpendicular")
    dx, dy = sum(v[0] for v in vs), sum(v[1] for v in vs)
    s_mod = sqrt(dx * dx + dy * dy) * each
    if not s_mod.is_rational:
        errs.append(f"modulus {s_mod} not exact")
        return None
    sc = sample.get("scene")
    vecs = scene_vectors(sc) if sc else []
    if len(vecs) != len(vs):
        errs.append("the scene does not draw exactly the stretches")
    else:
        p = (Rational(0), Rational(0))
        for (a, b, _w), v in zip(vecs, vs):
            if a != p or (b[0] - a[0], b[1] - a[1]) != v:
                errs.append("scene stretch differs from the text")
            p = b
    sol = sample.get("solutionScene")
    if not sol or not any(p == (0, 0) and q == (dx, dy) for p, q, _ in scene_vectors(sol)):
        errs.append("the solution scene lacks the displacement")
    check_choice(sample, errs, f"{fmt_exact(s_mod)}\\,\\text{{{unit}}}")
    opts_ok(sample, errs, unit)
    return "due tratti" if len(vs) == 2 else "tre tratti"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    try:
        kind = LEVELS[lvl](prose(sample["problem"]), sample, errs)
    except ValueError as e:
        return errs + [str(e)], None
    return errs, kind
