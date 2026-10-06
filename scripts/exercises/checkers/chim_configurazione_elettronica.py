"""Checker for chim-configurazione-elettronica (specs/exercises/chim-configurazione-elettronica.md), written from the
spec and the lesson 53-chim-configurazione-elettronica.md, not from the generator.

Every configuration is rebuilt here from the atomic number: the rule of the diagonal, chromium and copper as the two
exceptions, Hund's rule for the unpaired electrons, and for the ions the lesson's two rules (an anion goes on filling;
a cation loses the electrons of its outermost level, and a transition metal the 4s ones before the 3d ones). An option
is right when it holds the right electrons in every sublevel, and the right one must be written in the order the
sublevels fill.
"""
import re

from checkers._chim3_b import (
    BY_NAME, BY_SYMBOL, NAMES, NOBLE, NOBLE_SYMBOL, art, cap, check_choice, check_number, common, core_of, di, diagonal, expand,
    occupancy, parse_cfg, parse_ion, prose_and_extra, real, unpaired,
)

CASE_RANGES = {
    4: {"hund": (0.80, 0.98), "semplice": (0.02, 0.20)},
    5: {"regola": (0.72, 0.88), "eccezione": (0.12, 0.28)},
    6: {"principali": (0.40, 0.60), "transizione": (0.40, 0.60)},
}

EXCEPTIONS = {24, 29}
L5_Z = set(range(11, 39)) | set(range(49, 55))
MAIN_IONS = {("Li", 1), ("N", -3), ("O", -2), ("F", -1), ("Na", 1), ("Mg", 2), ("Al", 3), ("P", -3), ("S", -2), ("Cl", -1), ("K", 1), ("Ca", 2), ("Se", -2), ("Br", -1), ("Rb", 1), ("Sr", 2)}
TRANSITION_IONS = {("Sc", 3), ("Ti", 2), ("V", 2), ("V", 3), ("Cr", 2), ("Cr", 3), ("Mn", 2), ("Fe", 2), ("Fe", 3), ("Co", 2), ("Co", 3), ("Ni", 2), ("Cu", 1), ("Cu", 2), ("Zn", 2)}


def element(text, errs, prefix=di):
    """'del fosforo' -> 15, checking the article."""
    name = re.sub(r"^(del |dello |dell'|il |lo |l')", "", text.lower())
    if name not in BY_NAME:
        raise ValueError(f"unknown element {text!r}")
    if prefix(name) != text and cap(prefix(name)) != text:
        errs.append(f"article: {text!r}")
    return BY_NAME[name]


def right_cfg(want, in_order=True):
    """An option is right when its sublevels hold what `want` holds; the right one is also in the filling order."""
    target = occupancy(want)

    def is_right(o):
        core, subs = parse_cfg(o["latex"])
        whole = expand(core, subs)
        if len({name for name, _ in whole}) != len(whole):
            return False  # a sublevel written twice (the noble gas of the element's own period): not a configuration
        if occupancy(whole) != target:
            return False
        if in_order and [s for s in whole if s[1]] != [s for s in want if s[1]]:
            raise ValueError("right electrons, but not in the order the sublevels fill")
        return True

    return is_right


def sane_options(ch, errs):
    """Every option reads as a configuration, with no sublevel twice."""
    for o in ch["options"]:
        try:
            core, subs = parse_cfg(o["latex"])
            occupancy(subs)
            if core is not None and core not in NOBLE_SYMBOL.values():
                errs.append(f"option {o['latex']!r}: not a noble gas in brackets")
        except ValueError as e:
            errs.append(str(e))


def level1(sample, ch, prose, extra, errs):
    if prose != "Quanti elettroni ha in tutto un atomo con questa configurazione elettronica?" or len(extra) != 1:
        errs.append("level 1 text not recognised")
        return None
    core, subs = parse_cfg(extra[0])
    z = sum(k for _, k in subs)
    if core is not None or not 3 <= z <= 20 or subs != real(z):
        errs.append(f"level 1: not the full configuration of an element with Z from 3 to 20: {extra[0]}")
    check_number(sample, ch, z, errs)
    return "somma"


def asked(prose, pattern, errs):
    m = re.fullmatch(pattern, prose)
    if not m:
        raise ValueError(f"text not recognised: {prose!r}")
    z = element(m.group(1), errs)
    if int(m.group(2)) != z:
        errs.append(f"Z = {m.group(2)} is not the atomic number of {NAMES[z][1]}")
    return z


FULL_Q = r"Qual è la configurazione elettronica (.+) \(\$Z = (\d+)\$\)\?"
SHORT_Q = r"Qual è la configurazione elettronica abbreviata (.+) \(\$Z = (\d+)\$\)\?"


def level2(sample, ch, prose, extra, errs):
    z = asked(prose, FULL_Q, errs)
    if not 3 <= z <= 18:
        errs.append("level 2: Z from 3 to 18")
    sane_options(ch, errs)
    if any(parse_cfg(o["latex"])[0] for o in ch["options"]):
        errs.append("level 2: the configuration is written in full")
    check_choice(ch, right_cfg(real(z)), errs)
    return "fino-a-3p"


def level3(sample, ch, prose, extra, errs):
    z = asked(prose, FULL_Q, errs)
    if not 19 <= z <= 36 or z in EXCEPTIONS:
        errs.append("level 3: Z from 19 to 36, without chromium and copper")
    sane_options(ch, errs)
    if any(parse_cfg(o["latex"])[0] for o in ch["options"]):
        errs.append("level 3: the configuration is written in full")
    check_choice(ch, right_cfg(real(z)), errs)
    return "oltre-3p"


def level4(sample, ch, prose, extra, errs):
    m = re.fullmatch(r"(.+) ha questa configurazione elettronica\. Quanti elettroni spaiati ha nello stato fondamentale\?", prose)
    if not m or len(extra) not in (1, 2):
        raise ValueError(f"level 4 text not recognised: {prose!r}")
    z = element(m.group(1), errs, art)
    if not 1 <= z <= 36 or z in EXCEPTIONS:
        errs.append("level 4: Z from 1 to 36, without chromium and copper")
    core, subs = parse_cfg("\\,".join(extra))
    if core is not None or subs != real(z):
        errs.append(f"level 4: not the configuration of {NAMES[z][1]}")
    check_number(sample, ch, unpaired(real(z)), errs)
    name, k = real(z)[-1]
    return "hund" if name[1] != "s" and k < {"p": 6, "d": 10}[name[1]] else "semplice"


def level5(sample, ch, prose, extra, errs):
    z = asked(prose, SHORT_Q, errs)
    if z not in L5_Z:
        errs.append("level 5: Z from 11 to 38 or from 49 to 54")
    sane_options(ch, errs)
    want = real(z)
    core = NOBLE_SYMBOL[core_of(z)]
    is_right = right_cfg(want)

    def right(o):
        if not is_right(o):
            return False
        if parse_cfg(o["latex"])[0] != core:
            raise ValueError(f"right electrons, but the noble gas in brackets is not {core}")
        return True

    check_choice(ch, right, errs)
    return "eccezione" if z in EXCEPTIONS else "regola"


def ion_cfg(z, q):
    """The configuration of an ion, by the lesson's rules."""
    if q < 0:
        return diagonal(z - q)
    cfg = [list(s) for s in real(z)]
    for _ in range(q):
        # the outermost level: the largest n, and in it the sublevel written last
        top = max(int(name[0]) for name, k in cfg if k)
        last = [s for s in cfg if int(s[0][0]) == top and s[1]][-1]
        last[1] -= 1
    return [(name, k) for name, k in cfg if k]


def level6(sample, ch, prose, extra, errs):
    m = re.fullmatch(r"L'atomo di (.+) ha configurazione \$(.+)\$\. Qual è la configurazione dello ione \$(.+)\$\?", prose)
    if not m:
        raise ValueError(f"level 6 text not recognised: {prose!r}")
    if m.group(1) not in BY_NAME:
        raise ValueError(f"unknown element {m.group(1)!r}")
    z = BY_NAME[m.group(1)]
    sym, q = parse_ion(m.group(3))
    if BY_SYMBOL.get(sym) != z:
        errs.append("the ion is not of the element named")
    core, subs = parse_cfg(m.group(2))
    if expand(core, subs) != real(z) or (core or None) != (NOBLE_SYMBOL.get(core_of(z))):
        errs.append("the configuration given for the atom is not the real one")
    transition = 21 <= z <= 30
    if (sym, q) not in (TRANSITION_IONS if transition else MAIN_IONS):
        errs.append(f"ion {sym} {q:+d} is not in the spec")
    sane_options(ch, errs)
    want = ion_cfg(z, q)
    if sum(k for _, k in want) != z - q:
        errs.append("electron count of the ion")
    check_choice(ch, right_cfg(want, in_order=False), errs)
    return "transizione" if transition else "principali"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    ch = common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if ch is None:
        return errs, None
    if (sample["answer"]["kind"] == "number") != (lvl in (1, 4)):
        errs.append("levels 1 and 4 have a number as the answer, the others a choice")
    prose, extra = prose_and_extra(sample["problem"])
    try:
        kind = LEVELS[lvl](sample, ch, prose, extra, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the sample is {kind!r}")
    return errs, kind
