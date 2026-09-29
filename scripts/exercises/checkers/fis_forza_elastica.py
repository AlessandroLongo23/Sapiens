"""Checker for fis-forza-elastica (specs/exercises/fis-forza-elastica.md), written from the spec and the lesson
18-fis-forza-elastica.md. The problem is read back from its text (and the table, on level 5); lengths in centimetres
are turned into metres, and F = k * stretch with the stretch l - l0; a hanging mass pulls with m * 9,8 N/kg. The
elastic constant is one of the spec's; data have two significant figures (lengths and constants are integers); the
answer is exact (k, a length) or rounded half up to two figures, never at a tie. On level 4 the scene draws the two
lengths of the text on a ruler long enough to read them.
"""
import re

from sympy import Rational

from checkers.forze_comune import common, expect, match, parse_num, prose, sig_figs

CASE_RANGES = {
    3: {"forza-cm": (0.40, 0.60), "allungamento-cm": (0.40, 0.60)},
    4: {"costante": (0.45, 0.65), "lunghezza": (0.35, 0.55)},
    6: {"grammi": (0.40, 0.60), "kg": (0.40, 0.60)},
}

KS = {10, 20, 25, 40, 50, 80, 100, 120, 150, 200, 250, 300, 400, 500}
G = Rational(98, 10)
S2, INT = ("sig", 2), ("int",)


def const(errs, s):
    k = parse_num(s)
    if k not in KS:
        errs.append(f"k = {k} not in the spec")
    return k


def two_sig(errs, s, what):
    if sig_figs(s) != 2:
        errs.append(f"{what} {s!r} has not two significant figures")
    return parse_num(s)


def level1(sample, errs):
    s = prose(sample["problem"])
    g = match("Una molla ha la costante elastica di {NM}. Quale forza serve per allungarla di {M}?", s)
    if not g:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    k, dl = const(errs, g[0]), two_sig(errs, g[1], "stretch")
    expect(errs, sample, k * dl, "N", S2)
    return "forza"


def level2(sample, errs):
    s = prose(sample["problem"])
    g = match("Una molla con la costante elastica di {NM} viene tirata con una forza di {N}. Di quanto si allunga?", s)
    if not g:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    k, F = const(errs, g[0]), two_sig(errs, g[1], "force")
    truth = F / k
    if not Rational(1, 100) <= truth < 1:
        errs.append(f"stretch {truth} m outside the spec")
    expect(errs, sample, truth, "m", S2)
    return "allungamento"


def level3(sample, errs):
    s = prose(sample["problem"])
    if g := match("Una molla ha la costante elastica di {NM}. Quale forza serve per allungarla di {CM}?", s):
        k, dl = const(errs, g[0]), two_sig(errs, g[1], "stretch")
        expect(errs, sample, k * dl / 100, "N", S2)
        return "forza-cm"
    if g := match("Una molla con la costante elastica di {NM} viene tirata con una forza di {N}. Di quanti centimetri si allunga?", s):
        k, F = const(errs, g[0]), two_sig(errs, g[1], "force")
        expect(errs, sample, F / k * 100, "cm", S2)
        return "allungamento-cm"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    if g := match("La figura mostra una molla a riposo, lunga {CM}, e la stessa molla con un corpo appeso che la tira con una forza di {N}: ora è lunga {CM}. Quanto vale la costante elastica?", s):
        l0, F, l = parse_num(g[0]), two_sig(errs, g[1], "force"), parse_num(g[2])
        if not (l0.is_integer and l.is_integer and l > l0):
            errs.append("lengths")
        k = F / ((l - l0) / 100)
        if k not in KS:
            errs.append(f"k = {k} not in the spec")
        sc = sample.get("scene") or {}
        d = sc.get("data", {})
        if sc.get("type") != "molla-righello" or d.get("l0") != l0 or d.get("l") != l or not l + 2 <= d.get("righello", 0) <= 30:
            errs.append(f"scene does not draw the lengths of the text: {d}")
        expect(errs, sample, k, "N/m", INT)
        return "costante"
    if g := match("Una molla lunga {CM} a riposo ha la costante elastica di {NM}. Quanto diventa lunga se la si tira con una forza di {N}?", s):
        l0, k, F = parse_num(g[0]), const(errs, g[1]), two_sig(errs, g[2], "force")
        if sample.get("scene"):
            errs.append("the final length would be drawn")
        expect(errs, sample, l0 + F / k * 100, "cm", INT)
        return "lunghezza"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    # the table is the last line of the problem; its own rows would split the prose lines, so it comes out first
    tables = re.findall(r" \\\\ (\\begin\{array\}\{c\|c\|c\|c\|c\}.*?\\end\{array\}) \\end\{array\}$", sample["problem"])
    s = prose(sample["problem"].replace(" \\\\ " + tables[0], "") if len(tables) == 1 else sample["problem"])
    if s != "Appendendo a una molla forze diverse si sono misurati questi allungamenti. Quanto vale la costante elastica?" or len(tables) != 1:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    math = tables
    m = re.fullmatch(r"\\begin\{array\}\{c\|c\|c\|c\|c\} F\\,\(\\text\{N\}\) & (.*) \\\\ \\hline \\Delta l\\,\(\\text\{cm\}\) & (.*) \\end\{array\}", math[0])
    if not m:
        errs.append(f"table not recognised: {math[0]!r}")
        return None
    Fs = [parse_num(x) for x in m.group(1).split(" & ")]
    dls = [parse_num(x) for x in m.group(2).split(" & ")]
    if len(Fs) != 4 or len(dls) != 4:
        errs.append("the table needs four columns")
        return None
    ks = {F / (dl / 100) for F, dl in zip(Fs, dls)}
    if len(ks) != 1:
        errs.append(f"the measures are not proportional: {ks}")
    k = ks.pop()
    if k not in KS:
        errs.append(f"k = {k} not in the spec")
    expect(errs, sample, k, "N/m", INT)
    return "tabella"


def level6(sample, errs):
    s = prose(sample["problem"])
    g = re.fullmatch(r"A una molla verticale con la costante elastica di \$(\d+)\\,\\text\{N/m\}\$ si appende un corpo di \$(.+?)\\,\\text\{(g|kg)\}\$\. Di quanti centimetri si allunga la molla\?", s)
    if not g:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    k = const(errs, g.group(1))
    m = parse_num(g.group(2)) / (1000 if g.group(3) == "g" else 1)
    if g.group(3) == "kg":
        two_sig(errs, g.group(2), "mass")
    elif not (50 <= m * 1000 <= 500 and (m * 1000) % 10 == 0):
        errs.append("grams outside 50-500")
    truth = m * G / k * 100
    if not 1 <= truth <= 60:
        errs.append(f"stretch {truth} cm outside 1-60")
    expect(errs, sample, truth, "cm", S2)
    return "grammi" if g.group(3) == "g" else "kg"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
