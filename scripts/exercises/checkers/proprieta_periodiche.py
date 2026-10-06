"""Checker for proprieta-periodiche (specs/exercises/proprieta-periodiche.md), written from the spec and the lesson
59-proprieta-periodiche.md, not from the generator.

The effective nuclear charge as Z minus the inner electrons, counted from the configuration; the radius falls along a
period and grows down a group, the first ionisation energy the other way (checked on the data of the site's table);
a cation is smaller than its atom and an anion larger, and of isoelectronic ions the smallest has the most protons;
the pairs of neighbours whose ionisation energy falls; the valence electrons as the electrons removed before the
largest jump of the successive energies.
"""
import re

from checkers._chim3_d import (
    BY_NAME, BY_SYMBOL, IONS, MAIN_GROUPS, ORD, SUCCESSIVE, art, cap, check_number, dec, ion_of, monotonic, no_art, row_of, sym_of, the_choice,
)
from checkers._fis_grandezze import check_choice, option_text, prose_and_extra

CASE_RANGES = {
    2: {"periodo": (0.35, 0.65), "gruppo": (0.35, 0.65)},
    3: {"affermazione": (0.40, 0.60), "isoelettronici": (0.40, 0.60)},
    4: {"periodo": (0.35, 0.65), "gruppo": (0.35, 0.65)},
    5: {"2-13": (0.35, 0.65), "15-16": (0.35, 0.65)},
    6: {"valenza": (0.40, 0.60), "gruppo": (0.40, 0.60)},
}

SHELLS = {"s": 2, "p": 6, "d": 10, "f": 14}
NOBLE = {"He": 2, "Ne": 10, "Ar": 18}


def parse_config(tex):
    """[\\text{Ne}]\\,3s^2\\,3p^5 -> (core symbol, [(n, letter, electrons)])."""
    parts = tex.split("\\,")
    m = re.fullmatch(r"\[\\text\{(\w+)\}\]", parts[0])
    if not m:
        raise ValueError(f"no noble gas core in {tex!r}")
    subs = []
    for p in parts[1:]:
        mm = re.fullmatch(r"(\d)([spdf])\^(?:(\d)|\{(\d+)\})", p)
        if not mm:
            raise ValueError(f"sublevel not read: {p!r}")
        subs.append((int(mm.group(1)), mm.group(2), int(mm.group(3) or mm.group(4))))
    return m.group(1), subs


def level1(sample, ch, prose, errs):
    m = re.fullmatch(
        r"(.+) ha numero atomico \$Z = (\d+)\$ e configurazione elettronica \$(.+)\$\. Contando come schermo solo gli elettroni interni, quanto vale la carica nucleare efficace \$Z_\{eff\}\$ sentita dagli elettroni esterni\?",
        prose,
    )
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    el = BY_NAME[no_art(m.group(1))]
    z = int(m.group(2))
    if el["z"] != z:
        errs.append("wrong atomic number")
    core, subs = parse_config(m.group(3))
    total = NOBLE[core] + sum(k for _, _, k in subs)
    if total != z:
        errs.append(f"the configuration has {total} electrons, Z = {z}")
    # the same configuration as the site's table
    plain = f"[{core}] " + " ".join(f"{n}{l}{k}" for n, l, k in subs)
    if plain != el["config"]:
        errs.append(f"configuration {plain!r}, the table has {el['config']!r}")
    outer = max(n for n, _, _ in subs)
    if z > 20 or any(l not in "sp" for _, l, _ in subs):
        errs.append("element outside the level: Z up to 20, s and p only")
    inner = z - sum(k for n, _, k in subs if n == outer)
    zeff = z - inner
    check_number(sample, ch, zeff, errs)
    for o in ch["options"]:
        want = "0" if o["values"] == ["0"] else "+" + o["values"][0]
        if o["latex"] != want:
            errs.append(f"option {o['latex']!r} not written as a charge")
    return "zeff"


def trend(sample, ch, prose, errs, what):
    name = {"raggio": "il raggio atomico", "ionizzazione": "l'energia di prima ionizzazione"}[what]
    m = re.fullmatch(r"Quale di questi elementi del (.+) ha " + re.escape(name) + r" (maggiore|minore)\?", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    syms = [sym_of(o["latex"]) for o in ch["options"]]
    radius = what == "raggio"
    got = row_of(
        m.group(1), syms,
        (lambda e: e["radius"]) if radius else (lambda e: e["ionization"]),
        (1, 2, 13, 14, 15, 16, 17) if radius else MAIN_GROUPS,
        (1, 2, 14, 15, 16, 17) if radius else (1, 2, 15, 16, 17, 18),
        errs,
    )
    if not got:
        return None
    mode, els, vals = got
    # lesson 59: the radius falls along a period and grows down a group; the ionisation energy the other way
    rising = (mode == "gruppo") if radius else (mode == "periodo")
    if not monotonic(vals, 3 if radius else 20, rising, errs):
        return mode
    want_max = m.group(2) == "maggiore"
    right = els[-1] if rising == want_max else els[0]
    best = (max if want_max else min)(zip(vals, [e["symbol"] for e in els]))[1]
    if best != right["symbol"]:
        errs.append("rule and data disagree")
    check_choice(ch, lambda o: sym_of(o["latex"]) == right["symbol"], errs)
    return mode


def level3(sample, ch, prose, errs):
    if prose == "Quale di queste affermazioni è corretta?":
        seen = set()

        def true(o):
            m = re.fullmatch(r"(\\mathrm\{.+?\})\\text\{ è più (piccolo|grande) di \}(\\mathrm\{.+?\})", o["latex"])
            if not m:
                raise ValueError(f"statement not read: {o['latex']!r}")
            sym, q = ion_of(m.group(1))
            if sym_of(m.group(3)) != sym or IONS[sym][0] != q:
                raise ValueError("ion and atom do not match, or not the usual ion")
            seen.add(sym)
            # lesson 59: a cation is smaller than its atom, an anion larger; cross-checked on the radii
            smaller = q > 0
            if (IONS[sym][1] < BY_SYMBOL[sym]["radius"]) != smaller:
                raise ValueError(f"radii of {sym} against the rule")
            return (m.group(2) == "piccolo") == smaller

        check_choice(ch, true, errs)
        if len(seen) != 4:
            errs.append("the four statements are not about four elements")
        return "affermazione"
    m = re.fullmatch(r"Questi ioni hanno tutti \$(\d+)\$ elettroni\. Qual è il più (piccolo|grande)\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    n = int(m.group(1))
    ions = [ion_of(o["latex"]) for o in ch["options"]]
    for sym, q in ions:
        if BY_SYMBOL[sym]["z"] - q != n:
            errs.append(f"{sym} with charge {q} does not have {n} electrons")
        if IONS.get(sym, (None,))[0] != q:
            errs.append(f"{sym}: not its usual ion")
    zs = sorted(BY_SYMBOL[s]["z"] for s, _ in ions)
    if len(set(zs)) != 4:
        errs.append("repeated ion")
        return "isoelettronici"
    # same electrons: the more protons, the smaller the ion
    want_z = zs[-1] if m.group(2) == "piccolo" else zs[0]
    radii = sorted((IONS[s][1], BY_SYMBOL[s]["z"]) for s, _ in ions)
    if (radii[0][1] if m.group(2) == "piccolo" else radii[-1][1]) != want_z:
        errs.append("radii against the rule of the protons")
    check_choice(ch, lambda o: BY_SYMBOL[ion_of(o["latex"])[0]]["z"] == want_z, errs)
    return "isoelettronici"


def level5(sample, ch, prose, errs):
    if prose != "In quale di queste coppie di elementi vicini nello stesso periodo il primo ha l'energia di prima ionizzazione maggiore del secondo?":
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    kinds = []

    def inverted(o):
        m = re.fullmatch(r"(\w+) e (\w+)", option_text(o["latex"]))
        a, b = BY_NAME[m.group(1).lower()], BY_NAME[m.group(2)]
        if m.group(1) != cap(a["name"].lower()):
            raise ValueError("first name not capitalised")
        ia, ib = MAIN_GROUPS.index(a["group"]), MAIN_GROUPS.index(b["group"])
        if a["period"] != b["period"] or a["period"] not in (2, 3) or ib != ia + 1:
            raise ValueError(f"{o['latex']!r} is not a pair of neighbours of the second or third period")
        inv = a["ionization"] > b["ionization"]
        # lesson 59: the only falls are between groups 2 and 13 and between groups 15 and 16
        if inv != (a["group"] in (2, 15)):
            raise ValueError("data against the lesson's two exceptions")
        if inv:
            kinds.append("2-13" if a["group"] == 2 else "15-16")
        return inv

    check_choice(ch, inverted, errs)
    return kinds[0] if len(kinds) == 1 else None


NTH = ["prima", "seconda", "terza", "quarta", "quinta"]


def level6(sample, ch, prose, extra, errs):
    m = re.fullmatch(
        r"Un elemento del (\w+) periodo ha queste energie di ionizzazione successive, in kJ/mol\. (In quale gruppo della tavola periodica si trova\?|Quanti elettroni di valenza ha\?)",
        prose,
    )
    if not m or len(extra) != 1:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    t = re.fullmatch(r"\\begin\{array\}\{l\|r\} (.+) \\end\{array\}", extra[0])
    if not t:
        errs.append("table not read")
        return None
    rows = [r.split(" & ") for r in t.group(1).split(" \\\\ ")]
    if any(len(r) != 2 for r in rows):
        errs.append("table rows not read")
        return None
    xs = [int(dec(r[1])) for r in rows]
    if [r[0] for r in rows] != [f"\\text{{{w}}}" for w in NTH[: len(xs)]]:
        errs.append("table headings wrong")
    period = ORD[m.group(1)]
    who = [s for s, ys in SUCCESSIVE.items() if ys[: len(xs)] == xs and BY_SYMBOL[s]["period"] == period]
    if len(who) != 1:
        errs.append(f"the energies {xs} are not those of an element of that period")
        return None
    if any(b <= a for a, b in zip(xs, xs[1:])):
        errs.append("energies not increasing")
    diffs = [b - a for a, b in zip(xs, xs[1:])]
    ratios = [b / a for a, b in zip(xs, xs[1:])]
    k = diffs.index(max(diffs))
    if ratios.index(max(ratios)) != k:
        errs.append("largest difference and largest ratio in different places")
    valence = k + 1
    group = valence if valence <= 2 else 10 + valence
    if BY_SYMBOL[who[0]]["group"] != group:
        errs.append(f"{who[0]} is not in group {group}")
    ask_group = m.group(2).startswith("In quale gruppo")
    check_number(sample, ch, group if ask_group else valence, errs)
    for o in ch["options"]:
        if o["latex"] != o["values"][0] or not re.fullmatch(r"\d+", o["latex"]):
            errs.append(f"option {o['latex']!r} is not a whole number")
    return "gruppo" if ask_group else "valenza"


def check(sample):
    errs = []
    ch = the_choice(sample, errs)
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5, 6) or ch is None:
        return errs + [f"unknown level {lvl} or no choice"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra and lvl != 6:
        errs.append(f"unexpected lines {extra}")
    if (sample["answer"]["kind"] == "number") != (lvl in (1, 6)):
        errs.append("levels 1 and 6 have a number as the answer, the others a choice")
    try:
        if lvl == 1:
            kind = level1(sample, ch, prose, errs)
        elif lvl == 2:
            kind = trend(sample, ch, prose, errs, "raggio")
        elif lvl == 3:
            kind = level3(sample, ch, prose, errs)
        elif lvl == 4:
            kind = trend(sample, ch, prose, errs, "ionizzazione")
        elif lvl == 5:
            kind = level5(sample, ch, prose, errs)
        else:
            kind = level6(sample, ch, prose, extra, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind


__all__ = ["check", "CASE_RANGES", "art"]
