"""Checker for fis-leve (specs/exercises/fis-leve.md), written from the spec and the lesson 24-fis-leve.md.
- level 1: the kind of the lever, from the object's description (the spec's table of objects, copied here) or from the
  order of fulcrum, resistance and effort in the scene;
- level 2: advantageous if b_m > b_r, disadvantageous if b_m < b_r, indifferent if equal; a lever of the second kind
  always advantageous, of the third always disadvantageous (and the scene must agree with the kind);
- level 3: F_m b_m = F_r b_r; level 4: the arm b_m, or the fulcrum's distance from the resistance on a rod of length L
  (b_r + b_m = L); the answers exact integers with at most two significant figures;
- level 5: fixed pulley F = P, movable F = P/2, with its own weight F = (P + p)/2, rope pulled 2h.
"""
from sympy import Rational

from checkers._corpo_rigido import close, common, expect_value, expect_words, match, num, prose, scene_of, text_of

S2 = {"kind": "sig", "s": 2}
INT = {"kind": "int"}
KINDS = {"primo": "primo genere", "secondo": "secondo genere", "terzo": "terzo genere"}
GAINS = {"vantaggiosa": "vantaggiosa", "svantaggiosa": "svantaggiosa", "indifferente": "indifferente"}

# The objects of the lesson and their kind (spec, level 1): a few words of each description.
OBJECTS = [
    ("Nelle forbici", "primo"),
    ("Nell'altalena a bilico", "primo"),
    ("Con il piede di porco", "primo"),
    ("Nelle tenaglie", "primo"),
    ("La testa poggia sulla prima vertebra", "primo"),
    ("Nella carriola", "secondo"),
    ("Nello schiaccianoci", "secondo"),
    ("L'apribottiglie", "secondo"),
    ("Quando ti alzi sulle punte", "secondo"),
    ("Nelle pinzette", "terzo"),
    ("Nel braccio il fulcro è il gomito", "terzo"),
    ("La canna da pesca", "terzo"),
    ("Per sollevare la terra con la pala", "terzo"),
]

CASE_RANGES = {
    1: {"oggetto": (0.4, 0.6), "figura": (0.4, 0.6)},
    2: {"primo-vantaggiosa": (0.15, 0.35), "primo-svantaggiosa": (0.15, 0.35), "indifferente": (0.05, 0.2), "secondo": (0.12, 0.28), "terzo": (0.12, 0.28)},
    4: {"fulcro": (0.3, 0.5)},
    5: {"fissa": (0.12, 0.28), "mobile": (0.27, 0.43), "mobile-peso": (0.17, 0.33), "fune": (0.12, 0.28)},
}


def figs(r):
    r = Rational(r)
    s = str(r.p).rstrip("0") if r.q == 1 else None
    return len(s) if s is not None else 99


def kind_from_scene(d):
    """The kind from the order of the fulcrum, the resistance (F_r) and the effort (F_m) along the rod."""
    xf = d["appoggi"][0]["x"]
    fs = {f["sub"]: f for f in d["forze"]}
    xr, xm = fs["r"]["x"], fs["m"]["x"]
    between = lambda a, x, b: a < x < b or b < x < a  # noqa: E731
    if between(xr, xf, xm):
        kind = "primo"
    elif between(xf, xr, xm):
        kind = "secondo"
    elif between(xf, xm, xr):
        kind = "terzo"
    else:
        return None, None
    # the resistance downwards; the effort downwards in the first kind, upwards otherwise
    ok = fs["r"]["angolo"] == -90 and fs["m"]["angolo"] == (-90 if kind == "primo" else 90)
    return kind, (ok, abs(xr - xf), abs(xm - xf))


def level1(sample, errs):
    s = prose(sample["problem"])
    if s == "Nella leva della figura il triangolo è il fulcro, $F_r$ la forza resistente e $F_m$ la forza motrice. Di che genere è la leva?":
        d = scene_of(errs, sample)
        if not d:
            return None
        kind, info = kind_from_scene(d)
        if not kind or not info[0]:
            errs.append("scene: no lever of a known kind")
            return None
        expect_words(errs, sample, kind, KINDS, 3)
        return "figura"
    for start, kind in OBJECTS:
        if s.startswith(start) and s.endswith(" Di che genere è la leva?"):
            expect_words(errs, sample, kind, KINDS, 3)
            return "oggetto"
    errs.append(f"level 1 text not recognised: {s!r}")


def level2(sample, errs):
    s = prose(sample["problem"])
    g = match("In una leva di primo genere il braccio della forza motrice è di {CM} e il braccio della forza resistente è di {CM}. La leva è vantaggiosa, svantaggiosa o indifferente?", s)
    if g:
        bm, br = num(g[0]), num(g[1])
        gain = "vantaggiosa" if bm > br else "svantaggiosa" if bm < br else "indifferente"
        expect_words(errs, sample, gain, GAINS, 3)
        d = scene_of(errs, sample)
        if d:
            kind, info = kind_from_scene(d)
            if kind != "primo" or not info[0] or [q["testo"] for q in d["quote"]] != [text_of(br, "cm", INT), text_of(bm, "cm", INT)]:
                errs.append("scene does not show this lever")
            elif not close(info[1] / info[2], float(br / bm)):
                errs.append("scene arms not in the text's ratio")
        return "indifferente" if gain == "indifferente" else f"primo-{gain}"
    for kind, clause in (("secondo", "la forza resistente sta tra il fulcro e la forza motrice"), ("terzo", "la forza motrice sta tra il fulcro e la forza resistente")):
        if s == f"La leva della figura è di {KINDS[kind]}: {clause}. La leva è vantaggiosa, svantaggiosa o indifferente?":
            expect_words(errs, sample, "vantaggiosa" if kind == "secondo" else "svantaggiosa", GAINS, 3)
            d = scene_of(errs, sample)
            if d and kind_from_scene(d)[0] != kind:
                errs.append("scene of another kind")
            return kind
    errs.append(f"level 2 text not recognised: {s!r}")


def check_lever_scene(errs, sample, kind, br, bm, fr, fm, quotes=True, fulcrum=True):
    d = scene_of(errs, sample)
    if not d:
        return
    if not fulcrum:
        if d["appoggi"]:
            errs.append("scene shows the fulcrum that is asked")
        fs = {f["sub"]: f for f in d["forze"]}
        if fs["r"]["valore"] != fr or fs["m"]["valore"] != fm or not close(abs(fs["r"]["x"] - fs["m"]["x"]), (br + bm) / 100):
            errs.append("scene of the rod wrong")
        return
    k, info = kind_from_scene(d)
    if k != kind or not info[0]:
        errs.append(f"scene kind {k} != {kind}")
        return
    if not close(info[1], br / 100) or not close(info[2], bm / 100):
        errs.append("scene arms wrong")
    fs = {f["sub"]: f for f in d["forze"]}
    if fs["r"].get("valore") != fr or fs["m"].get("valore") != fm:
        errs.append(f"scene values {fs['r'].get('valore')} {fs['m'].get('valore')}")
    if quotes and sorted(q["testo"] for q in d["quote"]) != sorted([text_of(br, "cm", INT), text_of(bm, "cm", INT)]):
        errs.append("scene distances wrong")
    if not quotes and d["quote"]:
        errs.append("scene draws the unknown arm")


def arms_fit(errs, kind, br, bm):
    if kind == "secondo" and not bm > br or kind == "terzo" and not bm < br:
        errs.append(f"arms {br}, {bm} impossible for the {kind} kind")


def level3(sample, errs):
    s = prose(sample["problem"])
    g = match("In una leva di {W} genere il braccio della forza resistente è di {CM} e il braccio della forza motrice è di {CM}. La forza resistente vale {N}. Quale forza motrice tiene la leva in equilibrio?", s)
    if not g or g[0] not in KINDS:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    kind, br, bm, Fr = g[0], num(g[1]), num(g[2]), num(g[3])
    arms_fit(errs, kind, br, bm)
    Fm = Fr * br / bm
    if not Fm.is_integer or figs(Fm) > 2:
        errs.append(f"effort {Fm} not an integer with two figures")
    expect_value(errs, sample, Fm, "N", INT)
    check_lever_scene(errs, sample, kind, br, bm, text_of(Fr, "N", INT), "?")
    return kind


def level4(sample, errs):
    s = prose(sample["problem"])
    g = match("In una leva di {W} genere la forza resistente di {N} ha il braccio di {CM}. Quanto deve essere lungo il braccio della forza motrice perché basti una forza motrice di {N}?", s)
    if g and g[0] in KINDS:
        kind, Fr, br, Fm = g[0], num(g[1]), num(g[2]), num(g[3])
        bm = Fr * br / Fm
        arms_fit(errs, kind, br, bm)
        if not bm.is_integer or figs(bm) > 2:
            errs.append(f"arm {bm} not an integer with two figures")
        expect_value(errs, sample, bm, "cm", INT)
        check_lever_scene(errs, sample, kind, br, bm, text_of(Fr, "N", INT), text_of(Fm, "N", INT), quotes=False)
        return f"braccio-{kind}"
    g = match("Un'asta lunga {CM} è usata come leva di primo genere: a un'estremità c'è una forza resistente di {N}, all'altra si spinge con una forza motrice di {N}. A che distanza dalla forza resistente va messo il fulcro?", s)
    if g:
        L, Fr, Fm = num(g[0]), num(g[1]), num(g[2])
        # F_r b_r = F_m (L - b_r)
        br = Fm * L / (Fr + Fm)
        if not br.is_integer or figs(br) > 2:
            errs.append(f"arm {br} not an integer with two figures")
        expect_value(errs, sample, br, "cm", INT)
        check_lever_scene(errs, sample, "primo", br, L - br, text_of(Fr, "N", INT), text_of(Fm, "N", INT), quotes=False, fulcrum=False)
        return "fulcro"
    errs.append(f"level 4 text not recognised: {s!r}")


def level5(sample, errs):
    s = prose(sample["problem"])
    if sample.get("scene"):
        errs.append("unexpected scene")
    g = match("Con una carrucola fissa si tiene sollevato un secchio che pesa {N}. Con quale forza bisogna tirare la fune?", s)
    if g:
        expect_value(errs, sample, num(g[0]), "N", INT)
        return "fissa"
    g = match("Con una carrucola mobile di peso trascurabile si tiene sollevato un carico che pesa {N}. Con quale forza bisogna tirare la fune?", s)
    if g:
        expect_value(errs, sample, num(g[0]) / 2, "N", INT)
        return "mobile"
    g = match("Una carrucola mobile che pesa {N} regge un carico che pesa {N}. Con quale forza bisogna tirare la fune per tenere fermo il carico?", s)
    if g:
        expect_value(errs, sample, (num(g[0]) + num(g[1])) / 2, "N", INT)
        return "mobile-peso"
    g = match("Con una carrucola mobile si solleva un carico di {M}. Quanti metri di fune bisogna tirare?", s)
    if g:
        expect_value(errs, sample, 2 * num(g[0]), "m", S2)
        return "fune"
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
