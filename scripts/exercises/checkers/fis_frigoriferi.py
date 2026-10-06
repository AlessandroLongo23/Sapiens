"""Checker for fis-frigoriferi (specs/exercises/fis-frigoriferi.md), written from the spec and the lesson
117-fis-frigoriferi.md, not from the generator.

A refrigerator takes Q_f from the cold reservoir, receives the work W and gives Q_c = Q_f + W to the hot one. Its
coefficient of performance is Q_f / W, a heat pump's is Q_c / W; the highest ones, between the absolute temperatures
T_c and T_f, are T_f / (T_c - T_f) and T_c / (T_c - T_f). The heat to remove from water is c m Δt, plus L_f m to
freeze it. Exact arithmetic with sympy; the scene carries the data, never the answer.
"""
import re

from sympy import Rational

from checkers._fis_frigo_entropia import C_WATER, C_WATER_TEX, LF, LF_TEX, ZERO_C, answer, common, lab, no_trailing_zero, quantity, text, value

CASE_RANGES = {
    1: {"frigorifero": (0.23, 0.43), "congelatore": (0.23, 0.43), "condizionatore": (0.23, 0.43)},
    2: {"calori": (0.40, 0.60), "lavoro": (0.40, 0.60)},
    3: {"coefficiente": (0.40, 0.60), "lavoro": (0.40, 0.60)},
    4: {"frigorifero": (0.40, 0.60), "pompa": (0.40, 0.60)},
}

J, KG = quantity("J"), quantity("kg")
C = quantity("C", signed=True)
PURE = r"\$(\d\{,\}\d)\$"
ASK = r" Quanto vale il suo coefficiente di prestazione\?"
MAX = r" Qual è il massimo coefficiente di prestazione che può avere\?"


def three(errs, s, lo, hi, what):
    """An energy in joules, a whole number of three figures that does not end with a zero."""
    v = value(s)
    if not re.fullmatch(r"\d{3}", s) or not lo <= v <= hi:
        errs.append(f"{what} {s} outside {lo}-{hi}")
    no_trailing_zero(errs, s, what)
    return v


def ratio_ok(errs, qf, w):
    if not Rational(3, 2) <= qf / w <= 6:
        errs.append("Q_f / W outside 1,5-6")


def scene(sample, errs, name, hot=None, cold=None, work=None, temps=None):
    """Group 43's drawing of a machine between two reservoirs, run as a refrigerator, with the texts given."""
    sc = sample.get("scene") or {}
    if sc.get("type") != "macchina-termica":
        errs.append("no machine scene")
        return
    d = sc.get("data", {})
    devs = d.get("dispositivi")
    if not isinstance(devs, list) or len(devs) != 1:
        errs.append("scene: one device expected")
        return
    dev = devs[0]
    want = {
        "nome": name,
        "freddo": {"verso": "entra", "testo": f"Qf = {cold}" if cold else "Qf"},
        "caldo": {"verso": "esce", "testo": f"Qc = {hot}" if hot else "Qc"},
        "lavoro": {"verso": "entra", "testo": f"W = {work}" if work else "W"},
    }
    if dev != want:
        errs.append(f"scene device {dev!r} != {want!r}")
    if temps:
        if d.get("sorgenti") != {"calda": temps[0], "fredda": temps[1]}:
            errs.append(f"scene temperatures {d.get('sorgenti')!r}")
    elif "sorgenti" in d:
        errs.append("scene: temperatures not expected")


def level1(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"In un ciclo un (frigorifero|congelatore|condizionatore) toglie " + J + r" di calore (al suo interno|a una stanza), e il suo motore compie un lavoro di " + J + r"\." + ASK, s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    if (m.group(1) == "condizionatore") != (m.group(3) == "a una stanza"):
        errs.append("place does not fit the machine")
    qf, w = three(errs, m.group(2), 151, 999, "Q_f"), three(errs, m.group(4), 101, 399, "W")
    ratio_ok(errs, qf, w)
    answer(sample, errs, qf / w, 3, "none")
    scene(sample, errs, "frigorifero" if m.group(1) == "frigorifero" else "macchina", cold=f"{m.group(2)} J", work=f"{m.group(4)} J")
    return m.group(1)


def level2(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"In un ciclo un frigorifero toglie " + J + " di calore al suo interno e ne cede " + J + r" alla cucina\." + ASK, s):
        qf, qc = three(errs, m.group(1), 151, 999, "Q_f"), three(errs, m.group(2), 252, 999, "Q_c")
        w = qc - qf
        if not 101 <= w <= 399 or w % 10 == 0:
            errs.append(f"work {w} outside 101-399 or ending with a zero")
        else:
            ratio_ok(errs, qf, w)
            answer(sample, errs, qf / w, 3, "none")
        scene(sample, errs, "frigorifero", cold=f"{m.group(1)} J", hot=f"{m.group(2)} J")
        return "calori"
    if m := re.fullmatch(r"In un ciclo il motore di un frigorifero compie un lavoro di " + J + ", e il frigorifero cede " + J + r" di calore alla cucina\." + ASK, s):
        w, qc = three(errs, m.group(1), 101, 399, "W"), three(errs, m.group(2), 252, 999, "Q_c")
        qf = qc - w
        if not 151 <= qf <= 999 or qf % 10 == 0:
            errs.append(f"heat removed {qf} outside 151-999 or ending with a zero")
        else:
            ratio_ok(errs, qf, w)
            answer(sample, errs, qf / w, 3, "none")
        scene(sample, errs, "frigorifero", work=f"{m.group(1)} J", hot=f"{m.group(2)} J")
        return "lavoro"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"In un ciclo una pompa di calore prende " + J + " di calore dall'aria esterna, e il suo compressore compie un lavoro di " + J + r"\." + ASK, s):
        qf, w = three(errs, m.group(1), 151, 999, "Q_f"), three(errs, m.group(2), 101, 399, "W")
        ratio_ok(errs, qf, w)
        answer(sample, errs, (qf + w) / w, 3, "none")
        scene(sample, errs, "pompa", cold=f"{m.group(1)} J", work=f"{m.group(2)} J")
        return "coefficiente"
    if m := re.fullmatch(r"Una pompa di calore con coefficiente di prestazione " + PURE + r" deve cedere a una casa \$(\d\{,\}\d \\cdot 10\^\{[67]\})\\,\\text\{J\}\$ di calore\. Quanto lavoro deve compiere il suo compressore\?", s):
        cop, qc = value(m.group(1)), value(m.group(2))
        if not Rational(21, 10) <= cop <= Rational(59, 10) or m.group(1).endswith("0") or m.group(2)[3] == "0":
            errs.append("coefficient or heat outside the ranges")
        answer(sample, errs, qc / cop, 2, "J")
        if sample.get("scene"):
            errs.append("a scene where none is expected")
        return "lavoro"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Un frigorifero tiene l'interno a " + C + " in una stanza a " + C + r"\." + MAX, s):
        tf, tc = int(value(m.group(1))), int(value(m.group(2)))
        if not (-25 <= tf <= 8 and 18 <= tc <= 38 and tf != 0 and tc - tf >= 10):
            errs.append("temperatures outside the ranges")
        answer(sample, errs, Rational(tf + ZERO_C, tc - tf), 2, "none")
        scene(sample, errs, "frigorifero", temps=(f"{lab(tc)} °C", f"{lab(tf)} °C"))
        return "frigorifero"
    if m := re.fullmatch(r"Una pompa di calore tiene una casa a " + C + " quando fuori ci sono " + C + r"\." + MAX, s):
        tc, tf = int(value(m.group(1))), int(value(m.group(2)))
        if not (-15 <= tf <= 8 and 18 <= tc <= 24 and tf != 0 and tc - tf >= 10):
            errs.append("temperatures outside the ranges")
        answer(sample, errs, Rational(tc + ZERO_C, tc - tf), 2, "none")
        scene(sample, errs, "pompa", temps=(f"{lab(tc)} °C", f"{lab(tf)} °C"))
        return "pompa"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def mass(errs, s):
    """0,11-0,99 kg or 1,1-4,9 kg, two significant figures, no final zero."""
    v = value(s)
    ok = re.fullmatch(r"0\{,\}[1-9][1-9]", s) or (re.fullmatch(r"[1-4]\{,\}[1-9]", s))
    if not ok:
        errs.append(f"mass {s} outside the ranges")
    return v


def coefficient(errs, s):
    v = value(s)
    if not re.fullmatch(r"[2-4]\{,\}[1-9]", s):
        errs.append(f"coefficient {s} outside 2,1-4,9")
    return v


def level5(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un frigorifero con coefficiente di prestazione " + PURE + " raffredda " + KG + " di acqua da " + C + " a " + C + r"\. Quanto lavoro compie il suo motore\? Per l'acqua " + C_WATER_TEX + r"\.", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    cop, kg = coefficient(errs, m.group(1)), mass(errs, m.group(2))
    t1, t2 = value(m.group(3)), value(m.group(4))
    if not (18 <= t1 <= 35 and 2 <= t2 <= 8):
        errs.append("temperatures outside the ranges")
    answer(sample, errs, C_WATER * kg * (t1 - t2) / cop, 2, "J")
    return None


def level6(sample, errs):
    s = text(sample)
    m = re.fullmatch(
        r"Un congelatore con coefficiente di prestazione " + PURE + " trasforma " + KG + " di acqua a " + C + r" in ghiaccio a \$0\\,\^\\circ\\text\{C\}\$\. Quanto lavoro compie il suo motore\? Per l'acqua "
        + C_WATER_TEX + " e " + LF_TEX + r"\.",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    cop, kg, t1 = coefficient(errs, m.group(1)), mass(errs, m.group(2)), value(m.group(3))
    if not 10 <= t1 <= 30:
        errs.append("temperature outside 10-30")
    answer(sample, errs, (C_WATER * kg * t1 + LF * kg) / cop, 2, "J")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if lvl in (5, 6) and sample.get("scene"):
        errs.append("a scene where none is expected")
    return errs, kind
