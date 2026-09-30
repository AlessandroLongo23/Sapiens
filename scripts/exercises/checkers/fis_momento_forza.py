"""Checker for fis-momento-forza (specs/exercises/fis-momento-forza.md), written from the spec and the lesson
22-fis-momento-forza.md. Every problem is read back from its text:
- level 1: M = F b, with b converted from centimetres when the text gives centimetres;
- level 2: F = M / b or b = M / F;
- level 3: M = F d sin(alpha), with SymPy's exact sine; the value must not be within 2% of a step of a rounding boundary;
- level 4: each force's moment with its sign (counterclockwise positive: upwards on the right of O, downwards on the
  left), their sum, and the four options, each written as its absolute value and its sense;
- level 5: the couple, M = F b with b the diameter, or twice the arm of the cross wrench; or F = M / b.
The scene must hold the data of the text (forces, distances, angle) and a "?" where the text asks.
"""
import re

from sympy import Rational, pi, sin

from checkers._corpo_rigido import close, common, expect_value, match, num, prose, scene_of, shown, text_of, write

S2 = {"kind": "sig", "s": 2}
INT = {"kind": "int"}

CASE_RANGES = {
    1: {"m": (0.5, 0.7), "cm": (0.3, 0.5)},
    2: {"forza": (0.4, 0.6), "braccio": (0.4, 0.6)},
    4: {"centro": (0.5, 0.7), "estremo": (0.3, 0.5)},
    5: {"diametro": (0.3, 0.5), "raggio": (0.2, 0.4), "forza": (0.2, 0.4)},
}


def force_in_range(errs, F):
    if F % 5 or not 10 <= F <= 95:
        errs.append(f"force {F} outside 10..95 in steps of 5")


def dist_in_range(errs, b):
    if (b * 100) % 5 or not Rational(1, 10) <= b <= Rational(95, 100):
        errs.append(f"distance {b} outside 0,10..0,95 in steps of 0,05")


def check_single(errs, sample, F_text, b, b_text, ask=None, angle=None):
    d = scene_of(errs, sample)
    if not d:
        return
    if d["appoggi"] != [{"x": 0, "tipo": "perno"}] or d.get("punti") != [{"x": 0, "nome": "O"}]:
        errs.append("scene: pivot O not at the left end")
    if len(d["forze"]) != 1:
        errs.append("scene: one force")
        return
    f = d["forze"][0]
    if not close(f["x"], b) or f["valore"] != F_text or d["lunghezza"] <= float(b):
        errs.append(f"scene force {f} != text")
    if angle is None and abs(f["angolo"]) != 90:
        errs.append("scene: the force is not perpendicular")
    if angle is not None and (abs(f["angolo"]) != angle or f.get("arco") != f"{angle}°"):
        errs.append("scene: angle wrong")
    q = d["quote"]
    if len(q) != 1 or q[0]["da"] != 0 or not close(q[0]["a"], b) or q[0]["testo"] != b_text:
        errs.append(f"scene distance {q} != text")


def level1(sample, errs):
    s = prose(sample["problem"])
    for kind, tpl in (("m", "{M}"), ("cm", "{CM}")):
        g = match("Un'asta può ruotare intorno a un perno $O$. Una forza di {N}, perpendicolare all'asta, è applicata a " + tpl + " da $O$. Quanto vale il momento della forza rispetto a $O$?", s)
        if g:
            F, b = num(g[0]), num(g[1])
            if kind == "cm":
                b /= 100
            force_in_range(errs, F)
            dist_in_range(errs, b)
            expect_value(errs, sample, F * b, "Nm", S2)
            check_single(errs, sample, f"{F} N", b, f"{num(g[1])} cm" if kind == "cm" else text_of(b, "m", S2))
            return kind
    errs.append(f"level 1 text not recognised: {s!r}")


def level2(sample, errs):
    s = prose(sample["problem"])
    for tpl in ("{M}", "{CM}"):
        g = match("Una forza perpendicolare a un'asta è applicata a " + tpl + " dal perno $O$ intorno a cui l'asta può ruotare, e il suo momento rispetto a $O$ vale {NM}. Quanto vale la forza?", s)
        if g:
            b = num(g[0]) / (100 if tpl == "{CM}" else 1)
            M = num(g[1])
            dist_in_range(errs, b)
            if write(M, S2) != g[1]:
                errs.append("M not written with two figures")
            expect_value(errs, sample, M / b, "N", S2)
            check_single(errs, sample, "?", b, f"{num(g[0])} cm" if tpl == "{CM}" else text_of(b, "m", S2))
            return "forza"
    g = match("Una forza di {N}, perpendicolare a un'asta, ha un momento di {NM} rispetto al perno $O$ intorno a cui l'asta può ruotare. A che distanza da $O$ è applicata?", s)
    if g:
        F, M = num(g[0]), num(g[1])
        force_in_range(errs, F)
        b = M / F
        expect_value(errs, sample, b, "m", S2)
        d = scene_of(errs, sample)
        if d:
            f = d["forze"][0]
            if f["valore"] != f"{F} N" or d["quote"][0]["testo"] != "?":
                errs.append("scene: the force or the unknown distance wrong")
            # the drawing puts the force where the arm was before M was rounded: a step of 0,05 m whose moment
            # rounds to the M of the text
            x = Rational(str(f["x"]))
            if (x * 20).q != 1 or shown(F * x, S2) != M:
                errs.append("scene: the force is not at an arm that gives this moment")
        return "braccio"
    errs.append(f"level 2 text not recognised: {s!r}")


def level3(sample, errs):
    s = prose(sample["problem"])
    g = match("Un'asta può ruotare intorno a un perno $O$. A {M} da $O$ è applicata una forza di {N}, che forma un angolo di {A} con l'asta. Quanto vale il momento della forza rispetto a $O$?", s)
    if not g:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    d, F, a = num(g[0]), num(g[1]), int(g[2])
    dist_in_range(errs, d)
    force_in_range(errs, F)
    if a % 5 or not (15 <= a <= 75 or 105 <= a <= 165):
        errs.append(f"angle {a} outside the spec")
    exact = F * d * sin(pi * a / 180)
    truth = Rational(str(exact.evalf(30)))
    expect_value(errs, sample, truth, "Nm", S2, near_tie=0.02)
    check_single(errs, sample, f"{F} N", d, text_of(d, "m", S2), angle=a)
    return "acuto" if a < 90 else "ottuso"


def moment_latex(M):
    return rf"{write(abs(M), INT)}\,\text{{N}} \cdot \text{{m}}\ \text{{{'antiorario' if M > 0 else 'orario'}}}"


def level4(sample, errs):
    s = prose(sample["problem"])
    V = r"(verso l'alto|verso il basso)"
    Fq = r"\$F_(\d) = (" + r"\d+" + r")\\,\\text\{N\}\$ "
    Mq = r"\$(\d+\{,\}\d+)\\,\\text\{m\}\$"
    tail = r" Le forze sono perpendicolari all'asta\. Quanto vale il momento totale rispetto a \$O\$, e in che verso fa ruotare l'asta\?"
    m = re.fullmatch(r"Un'asta può ruotare intorno a un perno \$O\$ nel suo centro\. A destra di \$O\$, a " + Mq + ", agisce la forza " + Fq + V + r"; a sinistra di \$O\$, a " + Mq + ", la forza " + Fq + V + r"\." + tail, s)
    kind = "centro"
    if not m:
        m = re.fullmatch(r"Un'asta può ruotare intorno a un perno \$O\$ a un'estremità\. A " + Mq + r" da \$O\$ agisce la forza " + Fq + V + "; a " + Mq + r" da \$O\$, la forza " + Fq + V + r"\." + tail, s)
        kind = "estremo"
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    b1, i1, F1, v1, b2, i2, F2, v2 = m.groups()
    b1, b2, F1, F2 = num(b1), num(b2), Rational(F1), Rational(F2)
    if (i1, i2) != ("1", "2"):
        errs.append("forces not numbered 1, 2")
    for b in (b1, b2):
        if (b * 10) % 1 or not Rational(2, 10) <= b <= Rational(9, 10):
            errs.append(f"arm {b} outside 0,20..0,90 in steps of 0,10")
    force_in_range(errs, F1)
    force_in_range(errs, F2)
    up1, up2 = v1 == "verso l'alto", v2 == "verso l'alto"
    # F1 is on the right of O; F2 on the left (centre) or on the right (end)
    M1 = F1 * b1 * (1 if up1 else -1)
    M2 = F2 * b2 * ((-1 if up2 else 1) if kind == "centro" else (1 if up2 else -1))
    if kind == "estremo" and (up1 == up2 or b1 == b2):
        errs.append("at the end the forces must have opposite senses and different arms")
    if not M1.is_integer or not M2.is_integer:
        errs.append("moments not integers")
    M = M1 + M2
    if abs(M) < 2 or abs(M1) == abs(M2):
        errs.append("total moment too small, or equal moments")
    for field in ("answer", "choice"):
        ch = sample.get(field)
        if not ch or ch.get("kind") != "choice":
            errs.append(f"{field} not a choice")
            continue
        vals = [Rational(o["values"][0]) for o in ch["options"]]
        if len(vals) != 4 or len(set(vals)) != 4:
            errs.append(f"{field}: four distinct options needed")
        if vals[ch["correct"]] != M:
            errs.append(f"{field}: correct {vals[ch['correct']]} != {M}")
        if -M not in vals:
            errs.append(f"{field}: the opposite sense is missing")
        for o, v in zip(ch["options"], vals):
            if v == 0 or o["latex"] != moment_latex(v):
                errs.append(f"{field}: option {o['latex']!r} does not say {v}")
    d = scene_of(errs, sample)
    if d:
        O = d["appoggi"][0]["x"]
        want = [(O + float(b1), 90 if up1 else -90, f"{F1} N"), (O - float(b2) if kind == "centro" else float(b2), 90 if up2 else -90, f"{F2} N")]
        got = [(f["x"], f["angolo"], f["valore"]) for f in d["forze"]]
        if len(got) != 2 or any(not close(a[0], b[0]) or a[1:] != b[1:] for a, b in zip(got, want)):
            errs.append(f"scene forces {got} != {want}")
        if (kind == "centro") != (O > 0):
            errs.append("scene: pivot in the wrong place")
        texts = sorted(q["testo"] for q in d["quote"])
        if texts != sorted([text_of(b1, "m", S2), text_of(b2, "m", S2)]):
            errs.append(f"scene distances {texts}")
    return kind


def level5(sample, errs):
    s = prose(sample["problem"])
    g = match("Per girare un volante di diametro {M} un'automobilista applica ai due lati opposti due forze tangenti di {N} ciascuna, una verso l'alto e una verso il basso. Quanto vale il momento della coppia?", s)
    if g:
        d, F = num(g[0]), num(g[1])
        expect_value(errs, sample, F * d, "Nm", S2)
        sc = scene_of(errs, sample)
        if sc and (not close(sc["lunghezza"], d) or [f["valore"] for f in sc["forze"]] != [f"{F} N"] * 2 or sc["quote"][0]["testo"] != text_of(d, "m", S2)):
            errs.append("scene of the wheel wrong")
        return "diametro"
    g = match("Una chiave a croce ha i bracci lunghi {M} dal centro. Per svitare un bullone si spinge un'estremità verso l'alto e quella opposta verso il basso, con due forze di {N} perpendicolari ai bracci. Quanto vale il momento della coppia?", s)
    if g:
        r, F = num(g[0]), num(g[1])
        expect_value(errs, sample, F * 2 * r, "Nm", S2)
        sc = scene_of(errs, sample)
        if sc and (not close(sc["lunghezza"], 2 * r) or [f["valore"] for f in sc["forze"]] != [f"{F} N"] * 2 or sc["quote"][0]["testo"] != text_of(r, "m", S2)):
            errs.append("scene of the wrench wrong")
        return "raggio"
    g = match("Una coppia di forze ha il braccio di {M} e il momento di {NM}. Quanto vale l'intensità di ciascuna delle due forze?", s)
    if g:
        b, M = num(g[0]), num(g[1])
        expect_value(errs, sample, M / b, "N", S2)
        sc = scene_of(errs, sample)
        if sc and ([f["valore"] for f in sc["forze"]] != ["?", "?"] or sc["quote"][0]["testo"] != text_of(b, "m", S2)):
            errs.append("scene of the couple wrong")
        return "forza"
    errs.append(f"level 5 text not recognised: {s!r}")


def check_couple_scene(errs, sample):
    sc = sample.get("scene", {}).get("data", {})
    fs = sc.get("forze", [])
    L = sc.get("lunghezza", 0)
    if len(fs) != 2 or fs[0]["angolo"] != -fs[1]["angolo"] or abs(fs[0]["angolo"]) != 90:
        errs.append("the couple's forces are not opposite and perpendicular")
    elif not (close(fs[0]["x"], L) and close(fs[1]["x"], 0)) or not close(sc["appoggi"][0]["x"], L / 2):
        errs.append("the couple's forces are not at the ends, or the pivot not in the middle")


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
        if lvl == 5:
            check_couple_scene(errs, sample)
    except (ValueError, KeyError, TypeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
