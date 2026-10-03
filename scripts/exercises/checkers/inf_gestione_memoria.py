"""Checker for inf-gestione-memoria (specs/exercises/inf-gestione-memoria.md).

Written from the spec and the lesson, not from the generator. The numbers are read from the text and the result is
computed here with exact integers:
- levels 1, 2 and 3: pages = memory / page size, rounded up (level 1 must divide exactly, level 2 must not, level 3
  converts mebibytes with the factor 1024 that the text must state);
- level 4: memory assigned = pages times page size; unused = assigned minus requested;
- level 5: pages in the swap area = pages asked minus free frames, or frames left free = the opposite difference;
- level 6: the table of true and false statements below.
"""
import re
from fractions import Fraction

from checkers._inf_so import check_number, check_statements, common, measure, parse_num, prose_and_extra

CASE_RANGES = {
    4: {"assegnata": (0.40, 0.60), "inutilizzata": (0.40, 0.60)},
    5: {"swap": (0.57, 0.73), "liberi": (0.27, 0.43)},
    6: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

STATEMENTS = {
    "t1": (True, "qualunque frame libero"), "t2": (True, "stessa dimensione"), "t3": (True, "sta sulla memoria di massa"),
    "t4": (True, "vede una memoria tutta sua"), "t5": (True, "quando serve una pagina"), "t6": (True, "torna libera"),
    "t7": (True, "non può leggere"), "t8": (True, "rallenta"), "t9": (True, "tabella delle pagine"), "t10": (True, "sempre per eccesso"),
    "f1": (False, "parte della RAM"), "f2": (False, "aumenta la RAM"), "f3": (False, "frame vicini"), "f4": (False, "più grande"),
    "f5": (False, "viene chiuso"), "f6": (False, "in fretta come"), "f7": (False, "cancellando foto"), "f8": (False, "sempre nella RAM"),
    "f9": (False, "può scrivere nella memoria degli altri"), "f10": (False, "per difetto"),
}

REQUEST = r"(.+?) chiede al sistema (\$[^$]+\$) di memoria\. Le pagine sono di (\$[^$]+\$)\. "


def whole(v, what, errs):
    if v.denominator != 1:
        errs.append(f"{what} {v} is not whole")
    return int(v)


def ceil_div(a, b):
    return -(-a // b)


def pages_levels(sample, prose, errs, lvl):
    tail = r"Sapendo che \$1\\,\\text\{MiB\} = 1024\\,\\text\{KiB\}\$, quante pagine gli servono\?" if lvl == 3 else r"Quante pagine gli servono\?"
    m = re.fullmatch(REQUEST + tail, prose)
    if not m:
        errs.append(f"level {lvl} text not recognised: {prose!r}")
        return
    page = whole(measure(m.group(3), "KiB"), "page", errs)
    if page not in (4, 8, 16):
        errs.append(f"page of {page} KiB")
    if lvl == 3:
        mib = whole(measure(m.group(2), "MiB"), "memory", errs)
        if not 1 <= mib <= 64:
            errs.append(f"{mib} MiB out of 1..64")
        size = mib * 1024
    else:
        size = whole(measure(m.group(2), "KiB"), "memory", errs)
        if (size % page == 0) != (lvl == 1):
            errs.append(f"{size} KiB with pages of {page}: wrong kind of division for level {lvl}")
    pages = ceil_div(size, page)
    if lvl != 3 and not 3 <= pages <= 60:
        errs.append(f"{pages} pages out of 3..60")
    check_number(sample, Fraction(pages), "", errs)


def level4(sample, prose, errs):
    m = re.fullmatch(REQUEST + r"(Quanta memoria gli viene assegnata, contando le pagine intere\?|Quanti kibibyte restano inutilizzati nell'ultima pagina\?)", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    size = whole(measure(m.group(2), "KiB"), "memory", errs)
    page = whole(measure(m.group(3), "KiB"), "page", errs)
    if page not in (4, 8, 16) or size % page == 0:
        errs.append(f"{size} KiB with pages of {page}: need a division with a remainder")
    pages = ceil_div(size, page)
    if not 3 <= pages <= 40:
        errs.append(f"{pages} pages out of 3..40")
    assigned = m.group(4).startswith("Quanta")
    check_number(sample, Fraction(pages * page if assigned else pages * page - size), "KiB", errs)
    return "assegnata" if assigned else "inutilizzata"


def level5(sample, prose, errs):
    m = re.fullmatch(
        r"La RAM ha \$(\d+)\$ frame liberi\. Tre processi chiedono \$(\d+)\$, \$(\d+)\$ e \$(\d+)\$ pagine\. "
        r"(Quante pagine restano fuori dalla RAM e vanno nell'area di swap\?|Quando tutte le pagine sono nella RAM, quanti frame restano liberi\?)",
        prose,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    frames = int(m.group(1))
    asks = [int(m.group(i)) for i in (2, 3, 4)]
    if any(not 2 <= a <= 30 for a in asks):
        errs.append(f"pages asked {asks} out of 2..30")
    swap = m.group(5).startswith("Quante")
    diff = sum(asks) - frames if swap else frames - sum(asks)
    if not 1 <= diff <= 20:
        errs.append(f"difference {diff} out of 1..20: the question does not fit the numbers")
    check_number(sample, Fraction(diff), "", errs)
    return "swap" if swap else "liberi"


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    kind = None
    if lvl in (1, 2, 3):
        pages_levels(sample, prose, errs, lvl)
    elif lvl == 4:
        kind = level4(sample, prose, errs)
    elif lvl == 5:
        kind = level5(sample, prose, errs)
    elif lvl == 6:
        if sample["answer"].get("kind") != "choice":
            errs.append("answer is not a choice")
        else:
            kind = check_statements(sample, prose, "sulla gestione della memoria", STATEMENTS, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
