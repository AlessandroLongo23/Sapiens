"""Checker for fis-baricentro (specs/exercises/fis-baricentro.md), written from the spec and the lesson
25-fis-baricentro.md.
- levels 1 and 2: x_G = sum(m x) / sum(m), with the positions read from the text (the first body at 0 and the second
  at L for two bodies), exact, two significant figures; the scene holds the bodies at their places;
- level 3: the kind of equilibrium of the body described (the spec's table, copied here);
- level 4: theta = atan(w / h) with SymPy, rounded to the degree, never within 0,05 degrees of a half;
- level 5: the plank tips when the moments about the edge are equal: s = P L / (2 (P + W)) with the weight at the end,
  x = P (L/2 - s) / W for a cat walking, which must stop before the end.
"""
from sympy import Rational, atan, pi

from checkers._corpo_rigido import close, common, expect_value, expect_words, match, num, prose, scene_of, text_of

S2 = {"kind": "sig", "s": 2}
INT = {"kind": "int"}

BODIES = [
    ("Una lampada è appesa al soffitto", "stabile"),
    ("Un righello è appeso a un chiodo per un foro vicino", "stabile"),
    ("Una pallina è ferma sul fondo di una scodella", "stabile"),
    ("Un cono è appoggiato su un tavolo sulla sua base", "stabile"),
    ("Un pendolo è fermo nella sua posizione più bassa", "stabile"),
    ("Una matita è in equilibrio sulla punta", "instabile"),
    ("Una pallina è ferma in cima a una cupola", "instabile"),
    ("Un cono è in equilibrio sulla punta", "instabile"),
    ("Un'asta sta ferma in verticale, fissata a un perno sotto il suo baricentro", "instabile"),
    ("Un righello è tenuto in equilibrio in verticale", "instabile"),
    ("Una ruota di bicicletta gira libera sul suo asse", "indifferente"),
    ("Una pallina è ferma su un tavolo orizzontale", "indifferente"),
    ("Un cono è appoggiato sul fianco", "indifferente"),
    ("Un righello è appeso a un chiodo per un foro nel suo centro", "indifferente"),
    ("Un cilindro è appoggiato sul fianco", "indifferente"),
]
EQS = {"stabile": "stabile", "instabile": "instabile", "indifferente": "indifferente"}

CASE_RANGES = {
    3: {"stabile": (0.25, 0.42), "instabile": (0.25, 0.42), "indifferente": (0.25, 0.42)},
    4: {"spigolo": (0.5, 0.7), "piano": (0.3, 0.5)},
    5: {"vaso": (0.5, 0.7), "gatto": (0.3, 0.5)},
}


def figs(r):
    r = Rational(r)
    if r.q == 1:
        return len(str(abs(r.p)).rstrip("0"))
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 12:
            return 99
    return len(str(int(r * 10**k)).lstrip("0"))


def two_fig(errs, r, what):
    if figs(r) > 2 or (Rational(r) * 100).q != 1:
        errs.append(f"{what} {r} not exact with two figures")


def masses_scene(errs, sample, bodies, L):
    d = scene_of(errs, sample)
    if not d:
        return
    got = [(m["x"], m["valore"]) for m in d.get("masse", [])]
    want = [(float(x), text_of(m, "kg", S2)) for x, m in bodies]
    if len(got) != len(want) or any(not close(a[0], b[0]) or a[1] != b[1] for a, b in zip(got, want)):
        errs.append(f"scene bodies {got} != {want}")
    if not close(d["lunghezza"], L) or d["forze"] or d["appoggi"]:
        errs.append("scene rod wrong")


def level1(sample, errs):
    s = prose(sample["problem"])
    g = match("Due corpi di massa {KG} e {KG} sono fissati alle estremità di un'asta di massa trascurabile lunga {M}. A che distanza dal corpo di {KG} si trova il baricentro?", s)
    if not g or g[3] != g[0]:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    m1, m2, L = num(g[0]), num(g[1]), num(g[2])
    if m1 == m2:
        errs.append("equal masses")
    xG = (m1 * 0 + m2 * L) / (m1 + m2)
    two_fig(errs, xG, "x_G")
    expect_value(errs, sample, xG, "m", S2)
    masses_scene(errs, sample, [(0, m1), (L, m2)], L)
    return "dal-pesante" if m1 > m2 else "dal-leggero"


def level2(sample, errs):
    import re

    s = prose(sample["problem"])
    head = "Su un'asta di massa trascurabile lunga $100\\,\\text{cm}$ sono fissati tre corpi, a distanze diverse dall'estremità sinistra: "
    tail = ". A che distanza dall'estremità sinistra si trova il baricentro?"
    if not s.startswith(head) or not s.endswith(tail):
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    items = re.findall(r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{kg\}\$ a \$(\d+)\\,\\text\{cm\}\$", s[len(head) : -len(tail)])
    if len(items) != 3:
        errs.append("three bodies expected")
        return None
    bodies = [(Rational(x), num(m)) for m, x in items]
    xs = [x for x, _ in bodies]
    if len(set(xs)) != 3 or any(not 0 <= x <= 100 or x % 10 for x in xs):
        errs.append("positions outside the spec")
    xG = sum(m * x for x, m in bodies) / sum(m for _, m in bodies)
    if not xG.is_integer or figs(xG) > 2 or xG == 0:
        errs.append(f"x_G {xG} not a whole number of centimetres with two figures")
    expect_value(errs, sample, xG, "cm", INT)
    masses_scene(errs, sample, [(x / 100, m) for x, m in bodies], 1)
    return "tre"


def level3(sample, errs):
    s = prose(sample["problem"])
    if not s.endswith(" In che tipo di equilibrio si trova?"):
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    for start, eq in BODIES:
        if s.startswith(start):
            expect_words(errs, sample, eq, EQS, 3)
            return eq
    errs.append(f"level 3 body not in the spec: {s!r}")


def level4(sample, errs):
    s = prose(sample["problem"])
    g = match("Una scatola omogenea larga {CM} e alta {CM} viene inclinata, appoggiata su uno spigolo della base. Oltre quale angolo di inclinazione, se la si lascia andare, la scatola si ribalta?", s)
    kind = "spigolo"
    if not g:
        g = match("Un blocco omogeneo largo {CM} e alto {CM} è appoggiato su un piano inclinato abbastanza ruvido perché non scivoli, con la larghezza lungo il piano. Qual è l'inclinazione più grande del piano per cui il blocco non si ribalta?", s)
        kind = "piano"
    if not g:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    w, h = num(g[0]), num(g[1])
    if w % 5 or h % 5 or not 10 <= w <= 60 or not 20 <= h <= 120:
        errs.append("sizes outside the spec (multiples of 5 cm)")
    if not Rational(1, 5) <= w / h < 1:
        errs.append("w / h outside the spec")
    deg = (atan(w / h) * 180 / pi).evalf(30)
    frac = float(deg) - int(deg)
    if abs(frac - 0.5) < 0.05:
        errs.append(f"{float(deg)} too close to a half degree")
    expect_value(errs, sample, Rational(round(float(deg))), "deg", INT)
    return kind


def level5(sample, errs):
    s = prose(sample["problem"])
    g = match("Un'asse omogenea lunga {M}, che pesa {N}, è appoggiata su un tavolo e sporge oltre il bordo. Sull'estremità che sporge c'è un vaso che pesa {N}. Di quanto può sporgere al massimo l'asse senza ribaltarsi?", s)
    if g:
        L, P, W = num(g[0]), num(g[1]), num(g[2])
        # about the edge: W s = P (L/2 - s)
        sm = P * L / (2 * (P + W))
        two_fig(errs, sm, "overhang")
        expect_value(errs, sample, sm, "m", S2)
        if sample.get("scene"):
            errs.append("the overhang would be drawn")
        return "vaso"
    g = match("Un'asse omogenea lunga {M}, che pesa {N}, sporge di {M} oltre il bordo di un tetto piano. Un gatto che pesa {N} cammina sull'asse verso l'estremità che sporge. Fino a che distanza oltre il bordo può arrivare prima che l'asse si ribalti?", s)
    if g:
        L, P, sv, W = num(g[0]), num(g[1]), num(g[2]), num(g[3])
        if not sv < L / 2:
            errs.append("the plank's centre is past the edge")
        x = P * (L / 2 - sv) / W
        if not Rational(1, 10) <= x < sv:
            errs.append("the cat reaches the end, or stops under 0,10 m")
        two_fig(errs, x, "distance")
        expect_value(errs, sample, x, "m", S2)
        d = scene_of(errs, sample)
        if d:
            if d["appoggi"] != [{"x": round(float(L - sv), 3), "tipo": "tavolo"}] or not close(d["lunghezza"], L):
                errs.append("scene: the edge is not where the text puts it")
            if [(f["x"], f["valore"]) for f in d["forze"]] != [(round(float(L) / 2, 3), text_of(P, "N", INT))]:
                errs.append("scene: the plank's weight wrong")
            if [q["testo"] for q in d["quote"]] != [text_of(sv, "m", S2), text_of(L, "m", S2)]:
                errs.append("scene distances wrong")
        return "gatto"
    errs.append(f"level 5 text not recognised: {s!r}")


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, IndexError, ZeroDivisionError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
