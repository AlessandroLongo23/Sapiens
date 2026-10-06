"""Checker for chim-tempo-dimezzamento (specs/exercises/chim-tempo-dimezzamento.md), written from the spec and the
lesson 55-chim-tempo-dimezzamento.md, not from the generator.

After n = t / t½ half-lives a sample is left with the fraction (1/2)^n; the time for a fraction N/N₀ is
t = t½ · log₂(N₀/N). A named radioisotope must carry the half-life of the spec's table. Results are rounded half up to
the figures the spec asks, never within 10⁻⁶ of a tie, and a time that would end with an ambiguous zero is not asked.
"""
import re

from sympy import Integer, Rational, log

from checkers._chim3_c import ambiguous_zero, check_choice, check_number, common, dec, exact_tex, prose_and_extra, real, sci, sig_tex

CASE_RANGES = {
    2: {"frazione": (0.40, 0.60), "masse": (0.40, 0.60)},
    4: {"percentuale": (0.40, 0.60), "frazione": (0.40, 0.60)},
    6: {"carbonio": (0.40, 0.60), "sorgente": (0.40, 0.60)},
}

# radioisotope -> (half-life as the lesson writes it, unit, significant figures)
HALF_LIVES = {
    "idrogeno-3": ("12{,}3", "anni", 3),
    "carbonio-14": ("5730", "anni", 3),
    "fluoro-18": ("110", "minuti", 2),
    "sodio-24": ("15{,}0", "ore", 3),
    "fosforo-32": ("14{,}3", "giorni", 3),
    "potassio-40": ("1{,}25 \\cdot 10^{9}", "anni", 3),
    "cobalto-60": ("5{,}27", "anni", 3),
    "stronzio-90": ("28{,}9", "anni", 3),
    "tecnezio-99m": ("6{,}0", "ore", 2),
    "iodio-131": ("8{,}0", "giorni", 2),
    "cesio-137": ("30", "anni", 2),
    "polonio-210": ("138", "giorni", 3),
    "radon-222": ("3{,}8", "giorni", 2),
    "radio-226": ("1600", "anni", 2),
    "uranio-238": ("4{,}5 \\cdot 10^{9}", "anni", 2),
}

NUM = r"(\d+(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?)"
MASS = r"\$" + NUM + r"\\,\\text\{(mg|g)\}\$"
UNITS = r"(anni|giorni|ore|minuti)"
ISO = r"([a-z]+-\d+m?)"
WORDS = {"un quarto": 2, "un ottavo": 3, "un sedicesimo": 4, "un trentaduesimo": 5}


def article(name):
    if re.match(r"io|z|x|s[^aeiou]", name):
        return "Lo "
    return "L'" if name[0] in "aeiou" else "Il "


def isotope(name, t_tex, unit, errs):
    """The half-life of a named radioisotope, checked against the table: (value, unit, figures)."""
    if name not in HALF_LIVES:
        raise ValueError(f"unknown radioisotope {name}")
    tex, u, sf = HALF_LIVES[name]
    if (t_tex, unit) != (tex, u):
        errs.append(f"{name} has a half-life of {tex} {u}, not {t_tex} {unit}")
    return sci(tex), u, sf


def halvings(ratio):
    """n such that ratio = 2^n, from 2 to 5."""
    for n in range(2, 6):
        if ratio == 2**n:
            return n
    raise ValueError(f"ratio {ratio} is not 4, 8, 16 or 32")


def time_tex(x, sf, unit):
    s = sig_tex(x, sf)
    return None if s is None else f"{s}\\ \\text{{{unit}}}"


def right_is(want):
    return lambda o: want is not None and o["latex"] == want


def level1(sample, prose, errs):
    m = re.fullmatch(r"Un campione contiene " + MASS + " di " + ISO + r", che ha un tempo di dimezzamento di \$" + NUM + r"\$ " + UNITS + r"\. Quanto " + ISO + r" resta dopo \$" + NUM + r"\$ " + UNITS + r"\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    m0, mu, name, t_half, u1, name2, t, u2 = m.groups()
    half, unit, _ = isotope(name, t_half, u1, errs)
    if name2 != name or u2 != unit:
        errs.append("isotope or unit changes inside the text")
    n = sci(t) / half
    if n not in (2, 3, 4, 5):
        errs.append(f"{n} half-lives: the spec wants a whole number from 2 to 5")
        return None
    left = sci(m0) / 2**n
    check_choice(sample["answer"], right_is(f"{exact_tex(left)}\\,\\text{{{mu}}}"), errs)
    return "resta"


def level2(sample, prose, errs):
    m = re.fullmatch(r"(Il |Lo |L')" + ISO + r" ha un tempo di dimezzamento di \$" + NUM + r"\$ " + UNITS + r"\. Dopo quanto tempo un campione (?:di " + MASS + " si riduce a " + MASS + r"|si riduce a (un [a-z]+) della quantità iniziale)\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    art, name, t_half, u, m0, mu0, m1, mu1, words = m.groups()
    if art != article(name):
        errs.append(f"wrong article for {name}")
    half, unit, sf = isotope(name, t_half, u, errs)
    if words:
        n, case = WORDS[words], "frazione"
    else:
        if mu0 != mu1:
            errs.append("the two masses have different units")
        n, case = halvings(sci(m0) / sci(m1)), "masse"
    want = time_tex(n * half, sf, unit)
    if want is None or ambiguous_zero(sig_tex(n * half, sf)):
        errs.append("the time is near a tie or ends with an ambiguous zero")
    check_choice(sample["answer"], right_is(want), errs)
    return case


def level3(sample, prose, errs):
    m = re.fullmatch(r"Di " + MASS + " di un radioisotopo ne restano " + MASS + r" dopo \$" + NUM + r"\$ " + UNITS + r"\. Quanto vale il suo tempo di dimezzamento\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    m0, mu0, m1, mu1, t, unit = m.groups()
    if mu0 != mu1:
        errs.append("the two masses have different units")
    n = halvings(sci(m0) / sci(m1))
    half = sci(t) / n
    # the half-life must be one of the table, written as the table writes it
    known = [tex for tex, u, _ in HALF_LIVES.values() if u == unit and sci(tex) == half]
    if not known:
        errs.append(f"{half} {unit} is not a half-life of the table")
        return None
    if ambiguous_zero(known[0]):
        errs.append("the half-life ends with an ambiguous zero")
    check_choice(sample["answer"], right_is(f"{known[0]}\\ \\text{{{unit}}}"), errs)
    return "dimezzamento"


def level4(sample, prose, errs):
    m = re.fullmatch(r"In un campione di un radioisotopo (?:è decaduto (il |l')\$" + NUM + r"\\,\\%\$|sono decaduti i \$\\frac\{(\d+)\}\{(\d+)\}\$) dei nuclei\. Quanti tempi di dimezzamento sono passati\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    art, pct, num, den = m.groups()
    if pct:
        if (art == "l'") != pct.startswith("8"):
            errs.append("wrong article before the percentage")
        left, case = 1 - dec(pct) / 100, "percentuale"
    else:
        left, case = 1 - Rational(int(num), int(den)), "frazione"
    n = halvings(1 / left)
    check_number(sample, n, errs)
    return case


def level5(sample, prose, errs):
    m = re.fullmatch(r"(Il |Lo |L')" + ISO + r" ha un tempo di dimezzamento di \$" + NUM + r"\$ " + UNITS + r"\. Quale percentuale di un campione resta dopo \$" + NUM + r"\$ " + UNITS + r"\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    art, name, t_half, u, t, u2 = m.groups()
    if art != article(name):
        errs.append(f"wrong article for {name}")
    half, unit, _ = isotope(name, t_half, u, errs)
    if u2 != unit:
        errs.append("the time has another unit")
    t = sci(t)
    if sig_tex(t, 2) is None or sci(sig_tex(t, 2)) != t:
        errs.append("the time does not have two significant figures")
    n = t / half
    if abs(n - round(n)) < Rational(8, 100) or not Rational(3, 10) <= n <= Rational(47, 10):
        errs.append(f"n = {float(n):.3f}: too close to a whole number, or outside 0,3-4,7")
    p = real(100 * Rational(1, 2) ** n)
    want = sig_tex(p, 2)
    if want is None or ambiguous_zero(want):
        errs.append("the percentage is near a tie or ends with an ambiguous zero")
        return None
    # the same answer with n rounded to three figures, as the solution does
    n3 = sig_tex(n, 3)
    if n3 is None or sig_tex(real(100 * Rational(1, 2) ** sci(n3)), 2) != want:
        errs.append("rounding n to three figures changes the answer")
    check_choice(sample["answer"], right_is(f"{want}\\,\\%"), errs)
    return "percentuale"


def level6(sample, prose, errs):
    m = re.fullmatch(r"In un (?:reperto di legno|frammento di osso|pezzo di carbone|frammento di tessuto) la frazione di carbonio-14 è il \$(\d+)\\,\\%\$ di quella di un organismo vivo\. Il carbonio-14 ha un tempo di dimezzamento di \$" + NUM + r"\$ " + UNITS + r"\. Qual è l'età del reperto\?", prose)
    if m:
        p, t_half, u = m.groups()
        name, case = "carbonio-14", "carbonio"
    else:
        m = re.fullmatch(r"(Il |Lo |L')" + ISO + r" ha un tempo di dimezzamento di \$" + NUM + r"\$ " + UNITS + r"\. Dopo quanto tempo resta il \$(\d+)\\,\\%\$ di un campione\?", prose)
        if not m:
            errs.append(f"level 6 text not recognised: {prose!r}")
            return None
        art, name, t_half, u, p = m.groups()
        case = "sorgente"
        if art != article(name):
            errs.append(f"wrong article for {name}")
        if name == "carbonio-14":
            errs.append("carbon-14 belongs to the dating case")
    half, unit, _ = isotope(name, t_half, u, errs)
    p = int(p)
    if not 4 <= p <= 92 or p % 10 == 0 or p in (25, 50):
        errs.append(f"percentage {p} outside the spec")
    ratio = Rational(100, p)
    n = real(log(ratio, 2))
    t = n * half
    s = sig_tex(t, 2)
    if s is None or ambiguous_zero(s):
        errs.append("the time is near a tie or ends with an ambiguous zero")
        return None
    # the same answer along the solution's road: the ratio and then n rounded to three figures
    r3, n3 = sig_tex(ratio, 3), sig_tex(n, 3)
    if r3 is None or n3 is None or sig_tex(real(log(sci(r3), 2)) * half, 2) != s or sig_tex(sci(n3) * half, 2) != s:
        errs.append("rounding the intermediate results to three figures changes the answer")
    check_choice(sample["answer"], right_is(f"{s}\\ \\text{{{unit}}}"), errs)
    return case


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if (sample["answer"].get("kind") == "number") != (lvl == 4):
        errs.append("only level 4 is answered with a number")
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind


assert Integer(1)  # sympy is the arithmetic of this checker
