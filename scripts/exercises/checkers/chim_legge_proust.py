"""Checker for chim-legge-proust (specs/exercises/chim-legge-proust.md), written from the spec and the lesson
24-chim-legge-proust.md, not from the generator.

Its own table of the lesson's combining ratios (heavier element over lighter). The data are read back from the text:
- level 1: ratio = m_A / m_B to three significant figures, within 0,03 of the lesson's ratio;
- level 2: the other mass = m / r or m · r, to three significant figures, with the lesson's ratio;
- level 3: percentage = m_element / m_compound · 100 to three significant figures (and close to the lesson's
  composition), or mass = m_compound · p / 100, with p the lesson's composition to three figures;
- level 4: the second element needed by all the first is m_A / r (three figures); if there is more of it, it is in
  excess, else the first is, and the mass of the first that reacts is r · m_B (three figures); the leftover is the
  difference, with two decimals;
- level 5: the compound is the sum of the masses that react.
"""
import re

from sympy import Rational

from checkers._chim_leggi_ponderali import G, check_choice, common, mass_option, num, prose, round_sig

CASE_RANGES = {
    2: {"dal primo": (0.40, 0.60), "dal secondo": (0.40, 0.60)},
    3: {"percentuale": (0.40, 0.60), "massa": (0.40, 0.60)},
}

# compound → (heavier element, lighter element, symbol A, symbol B, m_A / m_B)
PAIRS = {
    "solfuro di rame": ("rame", "zolfo", "Cu", "S", Rational("3.96")),
    "solfuro di ferro": ("ferro", "zolfo", "Fe", "S", Rational("1.74")),
    "ossido di magnesio": ("magnesio", "ossigeno", "Mg", "O", Rational("1.52")),
    "acqua": ("ossigeno", "idrogeno", "O", "H", Rational("7.92")),
    "cloruro di sodio": ("cloro", "sodio", "Cl", "Na", Rational("1.54")),
    "diossido di carbonio": ("ossigeno", "carbonio", "O", "C", Rational("2.66")),
}
NUMBER = r"(\d+(?:\{,\}\d+)?)"
RATIO = r"\$m_\{\\mathrm\{([A-Za-z]+)\}\}/m_\{\\mathrm\{([A-Za-z]+)\}\} = " + NUMBER + r"\$"


def written(x):
    return x.replace(".", "{,}")


def options_are(sample, errs, pattern, value_of):
    for o in sample["answer"]["options"]:
        if not re.fullmatch(pattern, o["latex"]):
            errs.append(f"option {o['latex']!r} not of the expected form")
        elif o["values"] != [value_of(o["latex"])]:
            errs.append(f"option {o['latex']!r} has value {o['values']}")


def mass_options(sample, errs):
    def val(latex):
        v, extra = mass_option(latex)
        return v.replace("{,}", ".") + (f" {extra}" if extra else "")
    options_are(sample, errs, r"\d+(?:\{,\}\d+)?\\,\\text\{g(?: di [a-z]+)?\}", val)


def pair_of(compound, errs):
    p = PAIRS.get(compound)
    if not p:
        errs.append(f"unknown compound {compound!r}")
    return p


def ratio_given(m, p, errs):
    if (m.group(1), m.group(2)) != (p[2], p[3]) or num(m.group(3)) != p[4]:
        errs.append("the ratio in the text is not the lesson's")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un esperimento " + G + r" di ([a-z]+) si combinano completamente con " + G + r" di ([a-z]+) e formano (.+?)\. Quanto vale il rapporto di combinazione \$m_\{\\mathrm\{([A-Za-z]+)\}\}/m_\{\\mathrm\{([A-Za-z]+)\}\}\$\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    p = pair_of(m.group(5), errs)
    if not p:
        return None
    if (m.group(2), m.group(4), m.group(6), m.group(7)) != (p[0], p[1], p[2], p[3]):
        errs.append("elements or symbols do not match the compound")
    r = num(m.group(1)) / num(m.group(3))
    want = round_sig(r, 3)
    if want is None or abs(num(want) - p[4]) > Rational(3, 100):
        errs.append(f"ratio {want} far from the lesson's {p[4]}")
        return None
    options_are(sample, errs, NUMBER, lambda x: x.replace("{,}", "."))
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Nell?'?\s?(.+?) il rapporto di combinazione è " + RATIO + r"\. Quanti grammi di ([a-z]+) si combinano con " + G + r" di ([a-z]+)\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    p = pair_of(m.group(1), errs)
    if not p:
        return None
    ratio_given(re.search(RATIO, s), p, errs)
    want_el, mass, known = m.group(5), num(m.group(6)), m.group(7)
    if (known, want_el) == (p[0], p[1]):
        x, kind = mass / p[4], "dal primo"
    elif (known, want_el) == (p[1], p[0]):
        x, kind = mass * p[4], "dal secondo"
    else:
        errs.append("elements do not match the compound")
        return None
    want = round_sig(x, 3)
    if want is None:
        errs.append("answer at a rounding tie")
        return None
    mass_options(sample, errs)
    check_choice(sample["answer"], lambda o: mass_option(o["latex"]) == (want, ""), errs)
    return kind


def lesson_pc(p, el):
    return p[4] / (p[4] + 1) * 100 if el == p[0] else 100 / (p[4] + 1)


def level3(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Un campione di " + G + r" di (.+?) contiene " + G + r" di ([a-z]+)\. Qual è la percentuale in massa (?:del|dello|dell') ?([a-z]+) nel composto\?", s):
        p = pair_of(m.group(2), errs)
        if not p:
            return None
        el = m.group(4)
        if el not in p[:2] or m.group(5) != el:
            errs.append("element not in the compound")
            return None
        pc = num(m.group(3)) / num(m.group(1)) * 100
        want = round_sig(pc, 3)
        if want is None or abs(pc - lesson_pc(p, el)) > 1:
            errs.append(f"percentage {pc} far from the lesson's composition")
            return None
        options_are(sample, errs, NUMBER + r"\\%", lambda x: x[:-2].replace("{,}", "."))
        check_choice(sample["answer"], lambda o: o["latex"] == want + "\\%", errs)
        return "percentuale"
    if m := re.fullmatch(r"Nell?'?\s?(.+?) (?:il |lo |l')([a-z]+) è (?:il |l')\$" + NUMBER + r"\\%\$ della massa\. Quanti grammi di ([a-z]+) ci sono in " + G + r" di (.+?)\?", s):
        p = pair_of(m.group(1), errs)
        if not p:
            return None
        el = m.group(2)
        if el not in p[:2] or m.group(4) != el or m.group(6) != m.group(1):
            errs.append("element or compound do not match")
            return None
        pc = num(m.group(3))
        if round_sig(lesson_pc(p, el), 3) != m.group(3):
            errs.append(f"percentage {m.group(3)} is not the lesson's composition")
        article = re.search(r"è (il |l')\$", s).group(1)
        if (article == "l'") != m.group(3).startswith(("8", "11", "18")):
            errs.append("article of the percentage")
        want = round_sig(num(m.group(5)) * pc / 100, 3)
        mass_options(sample, errs)
        check_choice(sample["answer"], lambda o: mass_option(o["latex"]) == (want, ""), errs)
        return "massa"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def excess(s, errs, question):
    m = re.fullmatch(r"Si fanno reagire " + G + r" di ([a-z]+) con " + G + r" di ([a-z]+)\. Nell?'?\s?(.+?) il rapporto di combinazione è " + RATIO + r"\. " + question, s)
    if not m:
        errs.append(f"text not recognised: {s!r}")
        return None
    p = pair_of(m.group(5), errs)
    if not p:
        return None
    if (m.group(2), m.group(4)) != p[:2]:
        errs.append("elements do not match the compound")
    ratio_given(re.search(RATIO, s), p, errs)
    ma, mb = num(m.group(1)), num(m.group(3))
    for g in (m.group(1), m.group(3)):
        if not re.fullmatch(r"\d\{,\}\d\d", g):
            errs.append(f"mass {g} is not 1,00-9,99 g")
    need_b = ma / p[4]
    if need_b < mb:
        used_b = num(round_sig(need_b, 3))
        used_a, left, el = ma, mb - used_b, p[1]
    else:
        used_a = num(round_sig(mb * p[4], 3))
        used_b, left, el = mb, ma - used_a, p[0]
    if abs(need_b - mb) / mb < Rational(8, 100):
        errs.append("masses too close to the ratio")
    if left * 100 != int(left * 100) or left <= 0:
        errs.append(f"leftover {left} not in positive hundredths")
    return used_a, used_b, left, el


def two(x):
    s = str(int(x * 100)).rjust(3, "0")
    return s[:-2] + "{,}" + s[-2:]


def level4(sample, errs):
    r = excess(prose(sample["problem"]), errs, r"Quale elemento avanza, e quanto\?")
    if not r:
        return None
    _, _, left, el = r
    mass_options(sample, errs)
    for o in sample["answer"]["options"]:
        if not mass_option(o["latex"])[1]:
            errs.append(f"option {o['latex']!r} does not name the element")
    check_choice(sample["answer"], lambda o: mass_option(o["latex"]) == (two(left), f"di {el}"), errs)
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    compound = re.search(r"Quanti grammi di (.+?) si formano\?$", s)
    r = excess(s, errs, r"Quanti grammi di (?:.+?) si formano\?")
    if not r or not compound:
        return None
    used_a, used_b, _, _ = r
    mass_options(sample, errs)
    check_choice(sample["answer"], lambda o: mass_option(o["latex"]) == (two(used_a + used_b), ""), errs)
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    fn = LEVELS.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    try:
        kind = fn(sample, errs)
    except Exception as e:  # noqa: BLE001
        errs.append(f"checker error: {e!r}")
        kind = None
    return errs, kind
