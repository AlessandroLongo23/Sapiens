"""Checker for chim-simboli-lewis (specs/exercises/chim-simboli-lewis.md), written from the spec and the lesson
58-chim-simboli-lewis.md, not from the generator.

The valence electrons are counted two ways that must agree: on the configuration (the electrons of the sublevels
with the largest n) and on the group (the group in groups 1 and 2, the group minus 10 from 13 to 18). The dots of a
Lewis symbol are laid one per side up to four, then in pairs. An ion of a main group has the electrons of the nearest
noble gas: the metals of groups 1, 2 and 13 lose their valence electrons, the non-metals of groups 15, 16 and 17 gain
what is missing to eight.
"""
import re

from checkers._chim3_b import (
    BY_NAME, BY_SYMBOL, NAMES, NOBLE, NOBLE_SYMBOL, art, cap, check_choice, check_number, common, core_of, expand, group_of, option_text,
    parse_cfg, parse_ion, period_of, prose_and_extra, real, valence,
)

CASE_RANGES = {
    5: {"catione": (0.42, 0.63), "anione": (0.37, 0.58)},
    6: {"catione": (0.42, 0.63), "anione": (0.37, 0.58)},
}

MAIN = (1, 2, 13, 14, 15, 16, 17, 18)
ION_ELEMENTS = {"Li", "Na", "K", "Rb", "Cs", "Mg", "Ca", "Sr", "Ba", "Al", "N", "P", "O", "S", "Se", "F", "Cl", "Br", "I"}
NOBLE_NAME = {2: "elio", 10: "neon", 18: "argon", 36: "kripton", 54: "xeno", 86: "radon"}


def named(text, errs):
    """'Lo zolfo' -> 16, checking the article."""
    name = re.sub(r"^(il |lo |l')", "", text.lower())
    if name not in BY_NAME:
        raise ValueError(f"unknown element {text!r}")
    if cap(art(name)) != text:
        errs.append(f"article: {text!r}")
    return BY_NAME[name]


def valence_from_cfg(cfg):
    n = max(int(name[0]) for name, k in cfg if k)
    return sum(k for name, k in cfg if int(name[0]) == n)


def from_config(sample, ch, prose, errs, level):
    m = re.fullmatch(r"(.+) ha configurazione \$(.+)\$\. Quanti elettroni di valenza ha\?", prose)
    if not m:
        raise ValueError(f"text not recognised: {prose!r}")
    z = named(m.group(1), errs)
    core, subs = parse_cfg(m.group(2))
    cfg = expand(core, subs)
    if cfg != real(z) or core != NOBLE_SYMBOL.get(core_of(z)):
        errs.append("not the real abbreviated configuration of the element")
    g, p = group_of(z), period_of(z)
    if g not in MAIN:
        errs.append("not a main-group element")
    has_d = any(name[1] == "d" for name, _ in subs)
    if level == 1 and (p not in (2, 3) or has_d):
        errs.append("level 1: periods 2 and 3")
    if level == 2 and (p not in (4, 5) or g < 13 or not has_d):
        errs.append("level 2: groups 13 to 18 of periods 4 and 5, with a full d")
    v = valence_from_cfg(cfg)
    if v != valence(z):
        errs.append(f"valence electrons: {v} from the configuration, {valence(z)} from the group")
    check_number(sample, ch, v, errs)
    return "d-pieno" if has_d else "semplice"


def level3(sample, ch, prose, errs):
    m = re.fullmatch(r"(.+) si trova nel gruppo \$(\d+)\$ della tavola periodica\. Quanti elettroni di valenza ha\?", prose)
    if not m:
        raise ValueError(f"level 3 text not recognised: {prose!r}")
    z = named(m.group(1), errs)
    g = int(m.group(2))
    if group_of(z) != g or g not in MAIN or not 2 <= period_of(z) <= 6:
        errs.append("level 3: the group given is not the element's, or the element is not in the spec")
    v = valence(z)
    if v != valence_from_cfg(real(z)):
        errs.append("valence electrons from the group and from the configuration disagree")
    check_number(sample, ch, v, errs)
    return "s" if g <= 2 else "p"


def dots(v):
    """Pairs and single dots of a Lewis symbol with v dots."""
    sides = [0, 0, 0, 0]
    for k in range(v):
        sides[k % 4] += 1
    return sides.count(2), sides.count(1)


def read_dots(text):
    m = re.fullmatch(r"(nessuna coppia|1 coppia|[2-4] coppie) e (nessun puntino singolo|1 puntino singolo|[2-4] puntini singoli)", text)
    if not m:
        raise ValueError(f"not a count of dots: {text!r}")
    a = 0 if m.group(1).startswith("nessuna") else int(m.group(1)[0])
    b = 0 if m.group(2).startswith("nessun") else int(m.group(2)[0])
    if not 1 <= a + b <= 4:
        raise ValueError(f"a symbol has from one to four sides taken: {text!r}")
    return a, b


def level4(sample, ch, prose, errs):
    m = re.fullmatch(r"(.+) si trova nel gruppo \$(\d+)\$\. Nel suo simbolo di Lewis quante coppie di puntini e quanti puntini singoli ci sono\?", prose)
    if not m:
        raise ValueError(f"level 4 text not recognised: {prose!r}")
    z = named(m.group(1), errs)
    g = int(m.group(2))
    if group_of(z) != g or g not in MAIN or not 2 <= period_of(z) <= 4:
        errs.append("level 4: main groups, periods 2 to 4")
    want = dots(valence(z))
    check_choice(ch, lambda o: read_dots(option_text(o["latex"])) == want, errs)
    return "fino-a-quattro" if valence(z) <= 4 else "coppie"


def ion_charge(z):
    """The charge of the ion with the electrons of the nearest noble gas, for the groups of the lesson's table."""
    g = group_of(z)
    v = valence(z)
    if g in (1, 2, 13):
        return v
    if g in (15, 16, 17):
        return v - 8
    raise ValueError(f"group {g} forms no simple ion in the lesson")


def level5(sample, ch, prose, errs):
    m = re.fullmatch(r"(.+) si trova nel gruppo \$(\d+)\$\. Quale ione forma per avere la configurazione di un gas nobile\?", prose)
    if not m:
        raise ValueError(f"level 5 text not recognised: {prose!r}")
    z = named(m.group(1), errs)
    sym = NAMES[z][0]
    if group_of(z) != int(m.group(2)) or sym not in ION_ELEMENTS:
        errs.append("level 5: the group is not the element's, or the element is not in the spec")
    q = ion_charge(z)
    if z - q not in NOBLE:
        errs.append("the ion has not the electrons of a noble gas")

    def right(o):
        s, c = parse_ion(o["latex"])
        if s != sym:
            raise ValueError("ion of another element")
        return c == q

    check_choice(ch, right, errs)
    return "catione" if q > 0 else "anione"


def level6(sample, ch, prose, errs):
    m = re.fullmatch(r"Quale gas nobile ha la stessa configurazione elettronica dello ione \$(.+)\$\?", prose)
    if not m:
        raise ValueError(f"level 6 text not recognised: {prose!r}")
    sym, q = parse_ion(m.group(1))
    z = BY_SYMBOL[sym]
    if sym not in ION_ELEMENTS or q != ion_charge(z):
        errs.append("level 6: not the ion of an element of the spec")
    n = z - q
    if n not in NOBLE:
        raise ValueError(f"an ion with {n} electrons has not the configuration of a noble gas")
    want = cap(art(NOBLE_NAME[n]))
    names = {cap(art(x)) for x in NOBLE_NAME.values()}
    for o in ch["options"]:
        if option_text(o["latex"]) not in names:
            errs.append(f"option {o['latex']!r} is not a noble gas")
    check_choice(ch, lambda o: option_text(o["latex"]) == want, errs)
    return "catione" if q > 0 else "anione"


LEVELS = {1: lambda s, c, p, e: from_config(s, c, p, e, 1), 2: lambda s, c, p, e: from_config(s, c, p, e, 2), 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    ch = common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if ch is None:
        return errs, None
    if (sample["answer"]["kind"] == "number") != (lvl in (1, 2, 3)):
        errs.append("levels 1, 2 and 3 have a number as the answer, the others a choice")
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
