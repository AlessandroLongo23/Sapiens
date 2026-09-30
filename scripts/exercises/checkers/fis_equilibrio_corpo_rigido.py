"""Checker for fis-equilibrio-corpo-rigido (specs/exercises/fis-equilibrio-corpo-rigido.md), written from the spec and
the lesson 23-fis-equilibrio-corpo-rigido.md. Every problem is read back from its text and solved with the two
conditions of equilibrium, written here as a small linear system: the vertical forces add up to zero, and so do their
moments about the left end of the rod (counterclockwise positive), whatever the unknown is. The scene must hold the
data of the text: supports, forces with their values (a "?" for the unknown), distances.
"""
from sympy import Rational, Symbol, solve

from checkers._corpo_rigido import close, common, expect_value, match, num, prose, scene_of, text_of, write

S2 = {"kind": "sig", "s": 2}
INT = {"kind": "int"}

CASE_RANGES = {
    1: {"distanza": (0.45, 0.65), "peso": (0.35, 0.55)},
    3: {"appeso": (0.55, 0.75), "asta": (0.25, 0.45)},
    4: {"leggera-A": (0.4, 0.6), "leggera-B": (0.4, 0.6)},
    5: {"pesante-A": (0.4, 0.6), "pesante-B": (0.4, 0.6)},
}


def equilibrium(forces, unknown):
    """forces: (x, F) with F upwards positive, symbols allowed; the value of `unknown` that balances them."""
    eqs = [sum(F for _, F in forces), sum(F * x for x, F in forces)]
    sol = solve(eqs, dict=True)
    if len(sol) != 1 or unknown not in sol[0]:
        raise ValueError(f"no single solution: {sol}")
    return sol[0][unknown]


def two_fig(errs, r, what):
    if write(r, S2) is None or Rational(r) * 100 % 1 or len(write(r, S2).replace("{,}", "").lstrip("0")) != 2:
        errs.append(f"{what} {r} not written with two figures")


def forces_of(d):
    return [(f["x"], f["angolo"], f["valore"]) for f in d["forze"]]


INTRO = "Un'asta di peso trascurabile è appoggiata su un fulcro. "


def seesaw_scene(errs, sample, P1, P2, b1, b2, ask):
    d = scene_of(errs, sample)
    if not d:
        return
    fs = forces_of(d)
    xf = d["appoggi"][0]["x"]
    if [a["tipo"] for a in d["appoggi"]] != ["fulcro"] or len(fs) != 2:
        errs.append("scene: one fulcrum, two forces")
        return
    if not close(xf - fs[0][0], b1) or fs[0][2] != f"{P1} N" or fs[1][2] != ("?" if ask in ("peso", "reazione") else f"{P2} N"):
        errs.append(f"scene forces {fs}")
    q = [x["testo"] for x in d["quote"]]
    if q != [text_of(b1, "m", S2), "?" if ask == "distanza" else text_of(b2, "m", S2)]:
        errs.append(f"scene distances {q}")
    if ask != "distanza" and not close(fs[1][0] - xf, b2):
        errs.append("scene: the right weight is not at its distance")
    if any(f[1] != -90 for f in fs):
        errs.append("scene: weights not downwards")


def level1(sample, errs):
    s = prose(sample["problem"])
    g = match(INTRO + "A sinistra del fulcro, a {M}, è appeso un peso di {N}; a destra è appeso un peso di {N}. A che distanza dal fulcro va appeso il peso di destra perché l'asta stia in equilibrio in orizzontale?", s)
    x, R = Symbol("x"), Symbol("R")
    if g:
        b1, P1, P2 = num(g[0]), num(g[1]), num(g[2])
        sol = solve([R - P1 - P2, P1 * b1 - P2 * x], [x, R], dict=True)[0]
        b2 = sol[x]
        two_fig(errs, b2, "distance")
        expect_value(errs, sample, b2, "m", S2)
        seesaw_scene(errs, sample, P1, P2, b1, b2, "distanza")
        return "distanza"
    g = match(INTRO + "A sinistra del fulcro, a {M}, è appeso un peso di {N}. Quale peso bisogna appendere a destra, a {M} dal fulcro, perché l'asta stia in equilibrio in orizzontale?", s)
    if g:
        b1, P1, b2 = num(g[0]), num(g[1]), num(g[2])
        P2 = solve(P1 * b1 - x * b2, x)[0]
        if not P2.is_integer:
            errs.append("weight not an integer")
        expect_value(errs, sample, P2, "N", INT)
        seesaw_scene(errs, sample, P1, P2, b1, b2, "peso")
        return "peso"
    errs.append(f"level 1 text not recognised: {s!r}")


def level2(sample, errs):
    s = prose(sample["problem"])
    g = match(INTRO + "A sinistra del fulcro, a {M}, è appeso un peso di {N}; a destra, a {M} dal fulcro, è appeso il peso che tiene l'asta in equilibrio in orizzontale. Con quale forza il fulcro sostiene l'asta?", s)
    if not g:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    b1, P1, b2 = num(g[0]), num(g[1]), num(g[2])
    P2, R = Symbol("P2"), Symbol("R")
    # the fulcrum at 0, the left weight at -b1, the right one at b2
    forces = [(-b1, -P1), (b2, -P2), (0, R)]
    Rv = equilibrium(forces, R)
    P2v = equilibrium(forces, P2)
    if not P2v.is_integer or not Rv.is_integer:
        errs.append("weights not integers")
    expect_value(errs, sample, Rv, "N", INT)
    seesaw_scene(errs, sample, P1, P2v, b1, b2, "reazione")
    return "reazione"


def level3(sample, errs):
    s = prose(sample["problem"])
    F, P, R = Symbol("F"), Symbol("P"), Symbol("R")
    g = match("Un'asta omogenea lunga {M}, che pesa {N}, è appoggiata su un fulcro a {M} dall'estremità sinistra. Quale peso bisogna appendere all'estremità sinistra perché l'asta stia in equilibrio in orizzontale?", s)
    kind = "appeso"
    if g:
        L, Pv, a = num(g[0]), num(g[1]), num(g[2])
        truth = equilibrium([(0, -F), (L / 2, -Pv), (a, R)], F)
        values = ("?", f"{Pv} N")
    else:
        g = match("Un'asta omogenea lunga {M} è appoggiata su un fulcro a {M} dall'estremità sinistra, e sta in equilibrio in orizzontale con un peso di {N} appeso all'estremità sinistra. Quanto pesa l'asta?", s)
        if not g:
            errs.append(f"level 3 text not recognised: {s!r}")
            return None
        kind = "asta"
        L, a, Fv = num(g[0]), num(g[1]), num(g[2])
        truth = equilibrium([(0, -Fv), (L / 2, -P), (a, R)], P)
        values = (f"{Fv} N", "?")
    if not a < L / 2:
        errs.append("fulcrum not left of the centre")
    if not truth.is_integer or truth <= 0:
        errs.append(f"answer {truth} not a positive integer")
    expect_value(errs, sample, truth, "N", INT)
    d = scene_of(errs, sample)
    if d:
        fs = forces_of(d)
        if not close(d["lunghezza"], L) or not close(d["appoggi"][0]["x"], a) or len(fs) != 2:
            errs.append("scene: rod or fulcrum wrong")
        elif not (close(fs[0][0], 0) and close(fs[1][0], L / 2) and (fs[0][2], fs[1][2]) == values):
            errs.append(f"scene forces {fs}")
        if [q["testo"] for q in d["quote"]] != [text_of(a, "m", S2), text_of(L, "m", S2)]:
            errs.append("scene distances wrong")
    return kind


def beam(sample, errs, heavy):
    s = prose(sample["problem"])
    head = "Una trave omogenea lunga {M}, che pesa {N}," if heavy else "Una trave di peso trascurabile, lunga {M},"
    for where in ("A", "B"):
        g = match(head + " è appoggiata alle estremità $A$ e $B$. Sulla trave, a {M} da $A$, c'è un carico di {N}. Quanto vale la reazione dell'appoggio in $" + where + "$?", s)
        if g:
            break
    else:
        errs.append(f"level {sample['level']} text not recognised: {s!r}")
        return None
    if heavy:
        L, P, a, F = (num(x) for x in g)
    else:
        L, a, F = (num(x) for x in g)
        P = Rational(0)
    if not 0 < a < L or a == L / 2:
        errs.append("load outside the beam or in its middle")
    RA, RB = Symbol("RA"), Symbol("RB")
    forces = [(0, RA), (L, RB), (a, -F), (L / 2, -P)]
    truth = equilibrium(forces, RA if where == "A" else RB)
    if not truth.is_integer or truth <= 0:
        errs.append(f"reaction {truth} not a positive integer")
    expect_value(errs, sample, truth, "N", INT)
    d = scene_of(errs, sample)
    if d:
        fs = forces_of(d)
        want = [(float(a), -90, f"{F} N")] + ([(float(L) / 2, -90, f"{P} N")] if heavy else [])
        if len(fs) != len(want) or any(not close(x[0], y[0]) or x[1:] != y[1:] for x, y in zip(fs, want)):
            errs.append(f"scene forces {fs} != {want}")
        if [(x["x"], x["tipo"]) for x in d["appoggi"]] != [(0, "fulcro"), (float(L), "fulcro")]:
            errs.append("scene supports wrong")
        if [q["testo"] for q in d["quote"]] != [text_of(a, "m", S2), text_of(L, "m", S2)]:
            errs.append("scene distances wrong")
    return f"{'pesante' if heavy else 'leggera'}-{where}"


LEVELS = {1: level1, 2: level2, 3: level3, 4: lambda s, e: beam(s, e, False), 5: lambda s, e: beam(s, e, True)}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
