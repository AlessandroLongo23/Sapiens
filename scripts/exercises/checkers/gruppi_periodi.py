"""Checker for gruppi-periodi (specs/exercises/gruppi-periodi.md), written from the spec and the lesson
57-gruppi-periodi.md, not from the generator.

The table is rebuilt from the atomic number (checkers/_chim3_b.py): period and group from the place of Z after the
last noble gas, the configuration from the rule of the diagonal with chromium and copper. The lesson's rules are
applied on their own as well and must agree: the period is the largest n of the configuration; the group is the s
electrons in the s block, 12 plus the p electrons in the p block, the s plus the d electrons in the d block.
"""
import re

from checkers._chim3_b import (
    BY_SYMBOL, NAMES, NOBLE, NOBLE_SYMBOL, block_of, check_choice, common, core_of, expand, group_of, option_text, parse_cfg, period_of,
    prose_and_extra, real,
)

CASE_RANGES = {
    1: {k: (0.12, 0.28) for k in ("lunghezza", "sottolivelli", "blocco", "d", "colonne")},
    2: {"dal-gruppo": (0.40, 0.60), "dalla-configurazione": (0.40, 0.60)},
    5: {"s": (0.12, 0.28), "p": (0.32, 0.48), "d": (0.32, 0.48)},
}

CAPACITY = {"s": 2, "p": 6, "d": 10, "f": 14}
MAIN = (1, 2, 13, 14, 15, 16, 17, 18)
D_BLOCK = set(range(21, 31)) | {39, 40, 43, 48}
# periods 2 to 5 without the exceptions to the rule of the diagonal
REGULAR = {z for z in range(3, 55) if z not in (24, 29, 41, 42, 44, 45, 46, 47)}


def fills(n):
    """The sublevels that fill along period n, read off the rule of the diagonal between two noble gases."""
    start = 0 if n == 1 else NOBLE[n - 2]
    return [name for name, _ in real(NOBLE[n - 1])[len(real(start)) if start else 0:]]


def position(cfg):
    """Period and group by the lesson's rules, from a configuration in the filling order."""
    n = max(int(name[0]) for name, k in cfg if k)
    occ = dict(cfg)
    last = cfg[-1][0]
    if last[1] == "s":
        return n, occ[f"{n}s"]
    if last[1] == "p":
        return n, 12 + occ[f"{n}p"]
    if last[1] == "d":
        return n, occ.get(f"{n}s", 0) + occ[last]
    raise ValueError("f block")


def level1(sample, ch, prose, errs):
    m = re.fullmatch(r"Quanti elementi ha il periodo \$(\d)\$ della tavola periodica\?", prose)
    if m:
        n = int(m.group(1))
        if not 1 <= n <= 6:
            errs.append("period out of range")
        want = NOBLE[n - 1] - (NOBLE[n - 2] if n > 1 else 0)
        if want != sum(CAPACITY[s[1]] for s in fills(n)):
            errs.append("period length and sublevels disagree")
        check_choice(ch, lambda o: o["latex"] == str(want), errs)
        return "lunghezza"
    m = re.fullmatch(r"Quali sottolivelli si riempiono lungo il periodo \$(\d)\$, nell'ordine\?", prose)
    if m:
        n = int(m.group(1))
        if not 2 <= n <= 6:
            errs.append("period out of range")
        want = fills(n)
        check_choice(ch, lambda o: o["latex"].split(",\\ ") == want, errs)
        return "sottolivelli"
    m = re.fullmatch(r"In quale blocco della tavola periodica si trova il gruppo \$(\d+)\$\?", prose)
    if m:
        g = int(m.group(1))
        if not 1 <= g <= 18:
            errs.append("group out of range")
        # a fourth-period element of that group tells the block
        want = block_of(18 + g)
        check_choice(ch, lambda o: o["latex"] == "\\text{Blocco }" + want, errs)
        return "blocco"
    m = re.fullmatch(r"Quale sottolivello si riempie negli elementi del blocco \$d\$ del periodo \$(\d)\$\?", prose)
    if m:
        n = int(m.group(1))
        if not 4 <= n <= 6:
            errs.append("period out of range")
        want = [s for s in fills(n) if s[1] == "d"]
        if len(want) != 1:
            errs.append("no d sublevel in that period")
        check_choice(ch, lambda o: o["latex"] == want[0], errs)
        return "d"
    m = re.fullmatch(r"Quante colonne occupa il blocco \$([spdf])\$ della tavola periodica\?", prose)
    if m:
        check_choice(ch, lambda o: o["latex"] == str(CAPACITY[m.group(1)]), errs)
        return "colonne"
    raise ValueError(f"level 1 text not recognised: {prose!r}")


def outer_tex(g):
    """The outer configuration of a main group from a third-period element of that group."""
    z = 10 + (g if g <= 2 else g - 10)
    if g not in MAIN or group_of(z) != g:
        raise ValueError(f"group {g} is not a main group")
    return "\\,".join(f"n{name[1]}^{k}" for name, k in real(z)[len(real(10)):])


def level2(sample, ch, prose, errs):
    m = re.fullmatch(r"Qual è la configurazione esterna degli elementi del gruppo \$(\d+)\$\?", prose)
    if m:
        g = int(m.group(1))
        if g not in MAIN:
            errs.append("not a main group")
        want = outer_tex(g)
        for o in ch["options"]:
            if not re.fullmatch(r"ns\^[12](\\,np\^[1-6])?", o["latex"]):
                errs.append(f"option {o['latex']!r} is not an outer configuration")
        check_choice(ch, lambda o: o["latex"] == want, errs)
        return "dal-gruppo"
    m = re.fullmatch(r"A quale gruppo appartengono gli elementi con configurazione esterna \$(.+)\$\?", prose)
    if not m:
        raise ValueError(f"level 2 text not recognised: {prose!r}")
    groups = [g for g in MAIN if outer_tex(g) == m.group(1)]
    if len(groups) != 1:
        raise ValueError(f"{m.group(1)!r} is not the outer configuration of a main group")
    check_choice(ch, lambda o: o["latex"] == str(groups[0]), errs)
    return "dalla-configurazione"


def place_question(prose, errs):
    m = re.fullmatch(r"Un elemento ha configurazione \$(.+)\$\. In quale periodo e in quale gruppo si trova\?", prose)
    if not m:
        raise ValueError(f"text not recognised: {prose!r}")
    core, subs = parse_cfg(m.group(1))
    cfg = expand(core, subs)
    z = sum(k for _, k in cfg)
    if cfg != real(z) or core != NOBLE_SYMBOL.get(core_of(z)):
        errs.append("not the real abbreviated configuration of an element")
    n, g = position(cfg)
    if (n, g) != (period_of(z), group_of(z)):
        errs.append(f"the lesson's rule gives period {n}, group {g}, but the element is in {period_of(z)}, {group_of(z)}")
    return z, n, g


def place_choice(ch, n, g, errs):
    def right(o):
        mm = re.fullmatch(r"Periodo (\d), gruppo (\d+)", option_text(o["latex"]))
        if not mm or not 1 <= int(mm.group(2)) <= 18:
            raise ValueError("not a place of the table")
        return (int(mm.group(1)), int(mm.group(2))) == (n, g)

    check_choice(ch, right, errs)


def level3(sample, ch, prose, errs):
    z, n, g = place_question(prose, errs)
    if not 2 <= n <= 5 or g not in MAIN:
        errs.append("level 3: s and p blocks, periods 2 to 5")
    place_choice(ch, n, g, errs)
    return block_of(z)


def level4(sample, ch, prose, errs):
    z, n, g = place_question(prose, errs)
    if z not in D_BLOCK:
        errs.append("level 4: an element of the d block of the spec")
    place_choice(ch, n, g, errs)
    return "d"


def level5(sample, ch, prose, errs):
    m = re.fullmatch(r"Qual è la configurazione elettronica dell'elemento del periodo \$(\d)\$ e del gruppo \$(\d+)\$\?", prose)
    if not m:
        raise ValueError(f"level 5 text not recognised: {prose!r}")
    n, g = int(m.group(1)), int(m.group(2))
    zs = [z for z in REGULAR if period_of(z) == n and group_of(z) == g]
    if len(zs) != 1:
        raise ValueError(f"no regular element in period {n}, group {g}")
    z = zs[0]
    want = real(z)
    core = NOBLE_SYMBOL[core_of(z)]

    def right(o):
        c, subs = parse_cfg(o["latex"])
        if c is None:
            raise ValueError("no noble gas in brackets")
        whole = expand(c, subs)
        if len({name for name, _ in whole}) != len(whole):
            return False
        if dict(whole) != dict(want):
            return False
        if c != core or whole != want:
            raise ValueError("right electrons, but not written as the lesson writes it")
        return True

    check_choice(ch, right, errs)
    if NAMES[z][1] not in " ".join(sample["steps"]):
        errs.append("the steps do not name the element")
    return block_of(z)


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    ch = common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if ch is None:
        return errs, None
    if sample["answer"]["kind"] != "choice":
        errs.append("the answer is a choice in every level")
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, ch, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the sample is {kind!r}")
    return errs, kind
