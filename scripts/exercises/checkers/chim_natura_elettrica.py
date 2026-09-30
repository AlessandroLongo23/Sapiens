"""Checker for chim-natura-elettrica (specs/exercises/chim-natura-elettrica.md), written from the spec and the lesson
39-chim-natura-elettrica.md, not from the generator.

Charges of the same sign repel, opposite ones attract; rubbing moves electrons, and the two bodies end with equal and
opposite charges (glass with silk positive, plastic with wool, a balloon or a comb on hair negative); N = |Q| / e with
e = 1,60 · 10⁻¹⁹ C; two equal spheres that touch share the algebraic sum of their charges. Values are exact (sympy);
counts of electrons are rounded to two significant figures as the lesson does.
"""
import re

from sympy import Rational

from checkers._fis_calore import rounded, value
from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {
    1: {"segno": (0.40, 0.60), "forza": (0.40, 0.60)},
    2: {"conduttore": (0.40, 0.60), "isolante": (0.40, 0.60)},
    3: {"carica": (0.40, 0.60), "verso": (0.40, 0.60)},
    4: {"nC": (0.40, 0.60), "C": (0.40, 0.60)},
    5: {"carica": (0.40, 0.60), "elettroni": (0.40, 0.60)},
}

E = Rational(16, 10**20)
CONDUCTORS = {"rame", "ferro", "alluminio", "argento", "grafite", "acqua salata", "corpo umano"}
INSULATORS = {"vetro", "plastica", "gomma", "legno secco", "aria secca"}
# story -> (sign of the rubbed object, its name after "da"/"a", the cloth's)
RUBBING = {
    "Una bacchetta di vetro strofinata con un panno di seta": (1, ("dal vetro", "al vetro"), ("dalla seta", "alla seta"), "il panno di seta"),
    "Una bacchetta di plastica strofinata con un panno di lana": (-1, ("dalla plastica", "alla plastica"), ("dalla lana", "alla lana"), "il panno di lana"),
    "Un palloncino strofinato sui capelli": (-1, ("dal palloncino", "al palloncino"), ("dai capelli", "ai capelli"), "i capelli"),
    "Un pettine di plastica passato tra i capelli asciutti": (-1, ("dal pettine", "al pettine"), ("dai capelli", "ai capelli"), "i capelli"),
}
NC = r"\$([+-]?\d+\{,\}\d)\\,\\text\{nC\}\$"
E_TEXT = r"La carica elementare è \$e = 1\{,\}60 \\cdot 10\^\{-19\}\\,\\text\{C\}\$\."


def signed(s):
    """'+3{,}2' -> 16/5; '-12{,}0' -> -12."""
    v = value(s.lstrip("+-"))
    return -v if s.startswith("-") else v


def nc_text(x):
    """The lesson's writing of a charge in nC with one decimal: +3{,}2\\,\\text{nC}, 0{,}0 for zero."""
    x = Rational(x)
    t = abs(x) * 10
    if t.q != 1:
        raise ValueError(f"{x} nC has more than one decimal")
    t = int(t)
    body = f"{t // 10}{{,}}{t % 10}"
    return ("+" if x > 0 else "-" if x < 0 else "") + body + r"\,\text{nC}"


def level1(sample, prose, errs):
    m = re.fullmatch(
        r"Tre corpi \$A\$, \$B\$ e \$C\$ sono tutti elettrizzati\. \$A\$ ha carica (positiva|negativa); \$A\$ e \$B\$ si (attraggono|respingono), \$B\$ e \$C\$ si (attraggono|respingono)\. (Che carica ha \$C\$\?|Che cosa succede avvicinando \$A\$ e \$C\$\?)",
        prose,
    )
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    sa = 1 if m.group(1) == "positiva" else -1
    sb = sa if m.group(2) == "respingono" else -sa
    sc = sb if m.group(3) == "respingono" else -sb
    if m.group(4).startswith("Che carica"):
        want = "Positiva" if sc > 0 else "Negativa"
        allowed = {"Positiva", "Negativa", "Nessuna: è neutro", "Non si può stabilire"}
        kind = "segno"
    else:
        want = "Si respingono" if sa == sc else "Si attraggono"
        allowed = {"Si attraggono", "Si respingono", "Non si fanno forze", "Dipende dalla distanza"}
        kind = "forza"
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in allowed:
            errs.append(f"unexpected option {o['latex']!r}")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
    return kind


def level2(sample, prose, errs):
    m = re.fullmatch(r"Quale di questi materiali è (un conduttore|un isolante)\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    good, bad = (CONDUCTORS, INSULATORS) if m.group(1) == "un conduttore" else (INSULATORS, CONDUCTORS)
    for o in sample["answer"]["options"]:
        name = option_text(o["latex"]).lower()
        if name not in good | bad:
            errs.append(f"unknown material {name!r}")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]).lower() in good, errs)
    return "conduttore" if good is CONDUCTORS else "isolante"


def level3(sample, prose, errs):
    if m := re.fullmatch(r"(.+) acquista una carica di " + NC + r"\. Quale carica (acquista|acquistano) (.+)\?", prose):
        story, q, verb, cloth = m.group(1), signed(m.group(2)), m.group(3), m.group(4)
        if story not in RUBBING:
            errs.append(f"unknown story {story!r}")
            return None
        sign, _, _, cloth_name = RUBBING[story]
        if cloth != cloth_name or (verb == "acquistano") != (cloth == "i capelli"):
            errs.append("cloth or verb")
        if (q > 0) != (sign > 0):
            errs.append("the object's charge has the wrong sign for this pair")
        if not Rational(11, 10) <= abs(q) <= Rational(99, 10) or (abs(q) * 10) % 10 == 0:
            errs.append(f"charge {q} outside 1,1-9,9 nC or with a zero decimal")
        want = nc_text(-q)
        check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
        return "carica"
    if m := re.fullmatch(r"(.+) acquista una carica (positiva|negativa)\. Che cosa è successo durante lo strofinio\?", prose):
        story = m.group(1)
        if story not in RUBBING:
            errs.append(f"unknown story {story!r}")
            return None
        sign, obj, cloth, _ = RUBBING[story]
        if (m.group(2) == "positiva") != (sign > 0):
            errs.append("the object's charge has the wrong sign for this pair")
        # electrons leave the body that becomes positive
        want = f"Gli elettroni passano {obj[0]} {cloth[1]}" if sign > 0 else f"Gli elettroni passano {cloth[0]} {obj[1]}"
        check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
        return "verso"
    errs.append(f"level 3 text not recognised: {prose!r}")
    return None


def level4(sample, prose, errs):
    m = re.fullmatch(r"Un oggetto ha una carica di \$([+-])(\d+(?:\{,\}\d)?(?: \\cdot 10\^\{-\d+\})?)\\,\\text\{(nC|C)\}\$\. Quanti elettroni ha in più o in meno di quando era neutro\? " + E_TEXT, prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    q = value(m.group(2)) * (Rational(1, 10**9) if m.group(3) == "nC" else 1)
    mant = m.group(2).split(" ")[0]
    if len(mant.replace("{,}", "").lstrip("0")) != 2:
        errs.append(f"charge {m.group(2)} has not two significant figures")
    n = q / E
    want = rounded(n, 2)
    if want is None:
        errs.append("N on a rounding tie")
        return None
    more = m.group(1) == "-"
    target = want + r"\text{ in " + ("più" if more else "meno") + "}"
    check_choice(sample["answer"], lambda o: o["latex"] == target, errs)
    return m.group(3)


def level5(sample, prose, errs):
    m = re.fullmatch(
        r"Due sfere di metallo uguali, su supporti isolanti, hanno cariche \$Q_A = ([+-]\d+\{,\}0)\\,\\text\{nC\}\$ e \$Q_B = ([+-]\d+\{,\}0)\\,\\text\{nC\}\$\. Si fanno toccare e poi si separano\. (Quale carica ha ciascuna sfera\?|Quanti elettroni passano da una sfera all'altra\? " + E_TEXT + ")",
        prose,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    a, b = signed(m.group(1)), signed(m.group(2))
    if a == b or not (1 <= abs(a) <= 12 and 1 <= abs(b) <= 12):
        errs.append("charges out of range")
    final = (a + b) / 2
    if m.group(3).startswith("Quale"):
        want = nc_text(final)
        check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
        return "carica"
    n = abs(a - final) / Rational(10**9) / E
    want = rounded(n, 2)
    if want is None:
        errs.append("N on a rounding tie")
        return None
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return "elettroni"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
