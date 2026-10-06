"""Checker for chim-metalli-non-metalli (specs/exercises/chim-metalli-non-metalli.md), written from the spec and the
lesson 61-chim-metalli-non-metalli.md, not from the generator.

The class of an element from the family of the site's table; the facts of the lesson (answer key below); the metallic
character growing down a group and falling along a period, checked against the first ionisation energies; the
families by group (1 without hydrogen, 2, 3-12, 17, 18) and their outer configurations; the ion of a main group
(1+, 2+, 3+, 2-, 1-); the formula that makes the two ions' charges cancel, in the lowest terms.
"""
import re
from math import gcd

from checkers._chim3_d import BY_NAME, BY_SYMBOL, art, cap, group_charge, ion_of, klass, monotonic, no_art, row_of, sym_of, the_choice
from checkers._fis_grandezze import check_choice, option_text, prose_and_extra

CASE_RANGES = {
    1: {"metallo": (0.25, 0.42), "semimetallo": (0.25, 0.42), "non metallo": (0.25, 0.42)},
    3: {"periodo": (0.35, 0.65), "gruppo": (0.35, 0.65)},
    4: {"famiglia": (0.34, 0.50), "elemento": (0.34, 0.50), "configurazione": (0.10, 0.24)},
}

KEY = {
    "Che cosa vuol dire che un metallo è malleabile?": "Si lascia ridurre in lamine",
    "Che cosa vuol dire che un metallo è duttile?": "Si lascia tirare in fili",
    "Quale metallo è liquido a temperatura ambiente?": "Il mercurio",
    "Quale non metallo è liquido a temperatura ambiente?": "Il bromo",
    "Come si comporta un non metallo solido sotto un colpo di martello?": "Si rompe",
    "Nelle reazioni, che cosa tendono a fare gli atomi dei metalli?": "Perdono elettroni",
    "Con i metalli, che ioni formano i non metalli?": "Ioni negativi",
    "Com'è l'energia di ionizzazione dei metalli rispetto a quella dei non metalli?": "Più bassa",
    "Scaldando un metallo, come cambia la sua capacità di condurre la corrente?": "Conduce peggio",
    "Scaldando un semimetallo come il silicio, come cambia la sua capacità di condurre la corrente?": "Conduce meglio",
    "Un solido è lucente e fragile, e conduce poco la corrente. A quale classe appartiene?": "Ai semimetalli",
    "Un solido è lucente, conduce bene la corrente e sotto il martello si schiaccia. A quale classe appartiene?": "Ai metalli",
    "Che tipo di ossidi formano i metalli con l'ossigeno?": "Ossidi basici",
    "Che tipo di ossidi formano i non metalli con l'ossigeno?": "Ossidi acidi",
    "Quale di queste non è una proprietà dei metalli?": "Sono fragili",
    "Quale forma del carbonio, un non metallo, conduce la corrente?": "La grafite",
}

# lesson 61, "Le famiglie di elementi": family -> (name on the option, "un ...", "dei ...", outer configuration)
FAMILIES = {
    "alcalini": ("Metalli alcalini", "un metallo alcalino", "dei metalli alcalini", "ns^1"),
    "alcalino-terrosi": ("Metalli alcalino-terrosi", "un metallo alcalino-terroso", "dei metalli alcalino-terrosi", "ns^2"),
    "transizione": ("Metalli di transizione", "un metallo di transizione", "dei metalli di transizione", None),
    "alogeni": ("Alogeni", "un alogeno", "degli alogeni", r"ns^2\,np^5"),
    "gas-nobili": ("Gas nobili", "un gas nobile", "dei gas nobili, tranne l'elio", r"ns^2\,np^6"),
}


def family(sym):
    """The named family of an element, from its group (lesson 61), or None."""
    e = BY_SYMBOL[sym]
    g = e["group"]
    if g == 1 and sym != "H":
        return "alcalini"
    if g == 2:
        return "alcalino-terrosi"
    if g is not None and 3 <= g <= 12:
        return "transizione"
    if g == 17:
        return "alogeni"
    if g == 18:
        return "gas-nobili"
    return None


def name_sym(o):
    name = option_text(o["latex"])
    e = BY_NAME[name.lower()]
    if cap(e["name"].lower()) != name or o["values"] != [e["symbol"]]:
        raise ValueError(f"option {name!r} badly written")
    return e["symbol"]


def level1(sample, ch, prose, errs):
    m = re.fullmatch(r"Quale di questi elementi è un (metallo|semimetallo|non metallo)\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    for o in ch["options"]:
        if name_sym(o) in ("Po", "At"):
            errs.append("polonium and astatine are disputed: not in this level")
    check_choice(ch, lambda o: klass(name_sym(o)) == m.group(1), errs)
    return m.group(1)


def level2(sample, ch, prose, errs):
    if prose not in KEY:
        errs.append(f"level 2 question not in the key: {prose!r}")
        return None
    check_choice(ch, lambda o: option_text(o["latex"]) == KEY[prose], errs)
    return "fatto"


def level3(sample, ch, prose, errs):
    m = re.fullmatch(r"Quale di questi elementi del (.+) ha il carattere metallico più (forte|debole)\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    syms = [sym_of(o["latex"]) for o in ch["options"]]
    got = row_of(m.group(1), syms, lambda e: e["ionization"], (1, 2, 13, 14, 15, 16, 17), (1, 2, 14, 15, 16, 17), errs)
    if not got:
        return None
    mode, els, vals = got
    # the metallic character follows the ionisation energy upside down: the data must agree clearly
    if not monotonic(vals, 20, mode == "periodo", errs):
        return mode
    strongest = m.group(2) == "forte"
    # lesson 61: stronger to the left and to the bottom
    right = (els[0] if strongest else els[-1]) if mode == "periodo" else (els[-1] if strongest else els[0])
    check_choice(ch, lambda o: sym_of(o["latex"]) == right["symbol"], errs)
    return mode


def level4(sample, ch, prose, errs):
    m = re.fullmatch(r"A quale famiglia appartiene (.+)\?", prose)
    if m:
        fam = family(BY_NAME[no_art(m.group(1))]["symbol"])
        if fam is None:
            errs.append("the element has no named family")
            return None
        names = {v[0] for v in FAMILIES.values()}
        for o in ch["options"]:
            if option_text(o["latex"]) not in names:
                errs.append(f"option {o['latex']!r} is not a family")
        check_choice(ch, lambda o: option_text(o["latex"]) == FAMILIES[fam][0], errs)
        return "famiglia"
    m = re.fullmatch(r"Quale di questi elementi è (un .+)\?", prose)
    if m:
        fams = [k for k, v in FAMILIES.items() if v[1] == m.group(1)]
        if len(fams) != 1:
            errs.append(f"family not recognised: {m.group(1)!r}")
            return None
        check_choice(ch, lambda o: family(name_sym(o)) == fams[0], errs)
        return "elemento"
    m = re.fullmatch(r"Qual è la configurazione elettronica esterna (.+)\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    fams = [k for k, v in FAMILIES.items() if v[2] == m.group(1) and v[3]]
    if len(fams) != 1:
        errs.append(f"family not recognised: {m.group(1)!r}")
        return None
    configs = {v[3] for v in FAMILIES.values() if v[3]}
    for o in ch["options"]:
        if o["latex"] not in configs:
            errs.append(f"option {o['latex']!r} is not an outer configuration of a family")
    check_choice(ch, lambda o: o["latex"] == FAMILIES[fams[0]][3], errs)
    return "configurazione"


INTRO = {
    "è un metallo alcalino": lambda e: e["group"] == 1 and e["symbol"] != "H",
    "è un metallo alcalino-terroso": lambda e: e["group"] == 2,
    r"è un metallo del gruppo $13$": lambda e: e["group"] == 13 and klass(e["symbol"]) == "metallo",
    r"è un non metallo del gruppo $16$": lambda e: e["group"] == 16 and klass(e["symbol"]) == "non metallo",
    "è un alogeno": lambda e: e["group"] == 17,
}


def level5(sample, ch, prose, errs):
    m = re.fullmatch(r"(.+?) (è un .+)\. Quale ione forma di solito\?", prose)
    if not m or m.group(2) not in INTRO:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    e = BY_NAME[no_art(m.group(1))]
    if not INTRO[m.group(2)](e):
        errs.append(f"{e['symbol']} is not what the text says")
    q = group_charge(e["symbol"])

    def right(o):
        sym, charge = ion_of(o["latex"])
        if sym != e["symbol"] or o["values"] != [str(charge)]:
            raise ValueError(f"option {o['latex']!r} is not an ion of the element, or its value is wrong")
        return charge == q

    check_choice(ch, right, errs)
    return "catione" if q > 0 else "anione"


def parse_formula(tex):
    m = re.fullmatch(r"\\mathrm\{([A-Z][a-z]?)(?:_(\d))?([A-Z][a-z]?)(?:_(\d))?\}", tex)
    if not m:
        raise ValueError(f"not a binary formula: {tex!r}")
    if m.group(2) == "1" or m.group(4) == "1":
        raise ValueError("index 1 written")
    return m.group(1), int(m.group(2) or 1), m.group(3), int(m.group(4) or 1)


def level6(sample, ch, prose, errs):
    m = re.fullmatch(r"Che formula ha il composto tra (.+) e (.+)\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    metal, non = BY_NAME[no_art(m.group(1))], BY_NAME[no_art(m.group(2))]
    qm, qx = group_charge(metal["symbol"]), group_charge(non["symbol"])
    if qm <= 0 or qx >= 0 or klass(metal["symbol"]) != "metallo" or klass(non["symbol"]) != "non metallo":
        errs.append("not a metal with a non-metal")
        return None
    g = gcd(qm, -qx)
    want = (metal["symbol"], -qx // g, non["symbol"], qm // g)

    def right(o):
        f = parse_formula(o["latex"])
        if (f[0], f[2]) != (want[0], want[2]) or o["values"] != [f"{f[1]}:{f[3]}"]:
            raise ValueError(f"option {o['latex']!r}: other elements, or the metal not first, or wrong value")
        return f == want

    check_choice(ch, right, errs)
    return f"{qm}:{-qx}"


def check(sample):
    errs = []
    ch = the_choice(sample, errs)
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5, 6) or ch is None:
        return errs + [f"unknown level {lvl} or no choice"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    if sample["answer"]["kind"] != "choice":
        errs.append("every level is a multiple choice")
    try:
        kind = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}[lvl](sample, ch, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind


__all__ = ["check", "CASE_RANGES", "art"]
