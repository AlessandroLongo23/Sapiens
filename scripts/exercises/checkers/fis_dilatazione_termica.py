"""Checker for fis-dilatazione-termica (specs/exercises/fis-dilatazione-termica.md), written from the spec and the
lesson 66-fis-dilatazione-termica.md, not from the generator.

Δl = λ l0 Δt (l0 in metres, Δl asked in millimetres); t_f = t_i + Δl / (λ l0); λ = Δl / (l0 Δt); a full container
of liquid overflows by α V0 Δt (litres, asked in millilitres); a solid's volume grows by 3λ V0 Δt. The coefficients
must be those of the lesson's tables, and are given in the text.
"""
import re

from sympy import Rational

from checkers._fis_termologia import NUM, common, expect, parse, prose, q, sig_of

CASE_RANGES = {}

M = Rational(1, 10**6)
LAMBDA = {
    "d'alluminio": 23 * M,
    "d'ottone": 19 * M,
    "di rame": 17 * M,
    "d'acciaio": 12 * M,
    "di vetro": Rational(85, 10) * M,
    "di vetro pyrex": Rational(33, 10) * M,
}
ALPHA = {"d'acqua": (Rational(21, 10**5), 10, 40), "di mercurio": (Rational(18, 10**5), 0, 100)}
OF = r"(d'alluminio|d'ottone|di rame|d'acciaio|di vetro pyrex|di vetro)"
BAR = r"(Una sbarra|Un tubo|Un filo|Una bacchetta)"
COEF = r"\$\\(lambda|alpha) = (" + NUM + r")\\,\^\\circ\\text\{C\}\^\{-1\}\$"
SIG2 = ("sig", 2)
L2 = {Rational(n, 10) for n in (10, 15, 20, 25, 30, 40, 50, 60, 80)} | {Rational(n) for n in (12, 15, 18, 24, 25, 36, 45)}


def fem(errs, noun, *endings):
    f = noun.startswith("Una")
    if any((e == "a") != f for e in endings):
        errs.append("agreement")


def body(errs, noun, of):
    glass = of in ("di vetro", "di vetro pyrex")
    if glass != (noun == "Una bacchetta"):
        errs.append(f"{noun} {of}")


def coef(errs, sym, s, of):
    if sym != "lambda" or parse(s) != LAMBDA[of]:
        errs.append(f"coefficient {s} is not the table's for {of}")


def two_sig(errs, s, what):
    if sig_of(s) != 2 or re.fullmatch(r"\d0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    return parse(s)


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BAR + " " + OF + r" \(" + COEF + r"\) è lung([ao]) " + q("m") + " a " + q("C") + r"\. Di quanti millimetri si allunga se l([ao]) si scalda fino a " + q("C") + r"\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    noun, of = m.group(1), m.group(2)
    fem(errs, noun, m.group(5), m.group(8))
    body(errs, noun, of)
    coef(errs, m.group(3), m.group(4), of)
    l0 = two_sig(errs, m.group(6), "length")
    ti, tf = parse(m.group(7)), parse(m.group(9))
    dt = tf - ti
    if not (-20 <= ti <= 30 and 10 <= dt <= 200 and dt % 5 == 0):
        errs.append("temperatures out of range")
    dl = LAMBDA[of] * l0 * dt * 1000
    if not Rational(1, 10) <= dl <= 999:
        errs.append("lengthening out of range")
    expect(sample, errs, dl, "mm", SIG2)
    return "allungamento"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BAR + " " + OF + r" \(" + COEF + r"\) è lung([ao]) " + q("m") + " a " + q("C") + r"\. Scaldandol([ao]) si allunga di " + q("mm") + r"\. A quale temperatura è arrivat([ao])\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    noun, of = m.group(1), m.group(2)
    fem(errs, noun, m.group(5), m.group(8), m.group(10))
    body(errs, noun, of)
    coef(errs, m.group(3), m.group(4), of)
    l0 = parse(m.group(6))
    if l0 not in L2 or sig_of(m.group(6)) != 2:
        errs.append("length not one of the spec's")
    ti, dl = parse(m.group(7)), parse(m.group(9))
    if sig_of(m.group(9)) > 3:
        errs.append("lengthening with more than three figures")
    dt = dl / 1000 / (LAMBDA[of] * l0)
    if not (dt.is_integer and dt % 10 == 0 and 20 <= dt <= 200 and -10 <= ti <= 30):
        errs.append(f"Δt {dt} not a multiple of 10 in range")
    expect(sample, errs, ti + dt, "C", ("int",), signed=True)
    return "temperatura"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BAR + " " + OF + r" lung([ao]) " + q("m") + " a " + q("C") + r" viene scaldat([ao]) fino a " + q("C") + r", e si allunga di " + q("mm") + r"\. Quanto vale il coefficiente di dilatazione lineare\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    noun, of = m.group(1), m.group(2)
    fem(errs, noun, m.group(3), m.group(6))
    body(errs, noun, of)
    l0 = parse(m.group(4))
    if l0 not in L2 or sig_of(m.group(4)) != 2:
        errs.append("length not one of the spec's")
    ti, tf, dl = parse(m.group(5)), parse(m.group(7)), parse(m.group(8))
    if sig_of(m.group(8)) > 3:
        errs.append("lengthening with more than three figures")
    dt = tf - ti
    if not (10 <= ti <= 30 and dt % 10 == 0 and 20 <= dt <= 200):
        errs.append("temperatures out of range")
    lam = dl / 1000 / (l0 * dt)
    if lam != LAMBDA[of]:
        errs.append(f"λ {lam} is not the table's for {of}")
    expect(sample, errs, lam, "perC", SIG2)
    return "coefficiente"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un recipiente è pieno fino all'orlo di " + q("L") + r" (d'acqua|di mercurio) \(" + COEF + r"\) a " + q("C") + r"\. Lo si scalda fino a " + q("C") + r"\. Quanti millilitri di liquido traboccano\? Trascura la dilatazione del recipiente\.",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    V0 = two_sig(errs, m.group(1), "volume")
    alpha, lo, hi = ALPHA[m.group(2)]
    if m.group(3) != "alpha" or parse(m.group(4)) != alpha:
        errs.append("coefficient not the table's")
    ti, tf = parse(m.group(5)), parse(m.group(6))
    if not (lo <= ti and tf <= hi and tf - ti >= 5):
        errs.append("temperatures outside the liquid's range")
    expect(sample, errs, alpha * V0 * (tf - ti) * 1000, "mL", SIG2)
    return "liquido"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Una sfera|Un cubo|Un cilindro) " + OF + r" \(" + COEF + r"\) ha il volume di " + q("cm3") + " a " + q("C") + r"\. Di quanto aumenta il suo volume a " + q("C") + r"\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    of = m.group(2)
    coef(errs, m.group(3), m.group(4), of)
    V0 = two_sig(errs, m.group(5), "volume")
    ti, tf = parse(m.group(6)), parse(m.group(7))
    dt = tf - ti
    if not (10 <= ti <= 30 and dt % 10 == 0 and 50 <= dt <= 400 and 11 <= V0 <= 99):
        errs.append("data out of range")
    dV = 3 * LAMBDA[of] * V0 * dt
    if dV < Rational(1, 100):
        errs.append("volume change too small")
    expect(sample, errs, dV, "cm3", SIG2)
    return "solido"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
