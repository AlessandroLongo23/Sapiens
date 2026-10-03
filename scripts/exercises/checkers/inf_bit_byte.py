"""Checker for inf-bit-byte (specs/exercises/inf-bit-byte.md).

Written from the spec and the lesson, not from the generator. Every problem is read back from its text and the
answer is recomputed with exact rationals from the sizes of the units in bytes (decimal multiples by 1000, binary
multiples by 1024, 8 bits in a byte). The factors the text reminds ("Ricorda che 1 MB = 1000 kB") are checked
against the same table, and must be the ones the conversion needs.
"""
import re

from sympy import Rational

from checkers._inf_informazione import NUM, canonical, check_number, common, prose_and_extra

CASE_RANGES = {
    1: {"in-bit": (0.40, 0.60), "in-byte": (0.40, 0.60)},
    2: {"moltiplica": (0.40, 0.60), "dividi": (0.40, 0.60)},
    3: {"moltiplica": (0.40, 0.60), "dividi": (0.40, 0.60)},
    4: {"valori": (0.40, 0.60), "massimo": (0.40, 0.60)},
    6: {"dati": (0.25, 0.42), "minuti": (0.25, 0.42), "velocita": (0.25, 0.42)},
}

DECIMAL = ["B", "kB", "MB", "GB", "TB"]
BINARY = ["B", "KiB", "MiB", "GiB", "TiB"]
SIZE = {u: Rational(1000) ** i for i, u in enumerate(DECIMAL)}
SIZE.update({u: Rational(1024) ** i for i, u in enumerate(BINARY)})
BYTE = r"\$1\\,\\text\{B\} = 8\\,\\text\{bit\}\$"


def decimals(r):
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 12:
            return 99
    return k


def reminders(text, errs):
    """The factors of 'Ricorda che ...': [(larger unit, factor, smaller unit)], each checked against the table."""
    out = []
    for part in text.split(" e "):
        m = re.fullmatch(r"\$1\\,\\text\{(\w+)\} = (\d+)\\,\\text\{(\w+)\}\$", part)
        if not m or m.group(1) not in SIZE or m.group(3) not in SIZE:
            errs.append(f"reminder not recognised: {part!r}")
            continue
        big, f, small = m.group(1), int(m.group(2)), m.group(3)
        if SIZE[big] != f * SIZE[small]:
            errs.append(f"wrong reminder: 1 {big} is not {f} {small}")
        out.append((big, f, small))
    return out


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quanti (bit|byte) sono \$(" + NUM + r")\\,\\text\{(B|bit)\}\$\? Ricorda che " + BYTE + r"\.", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    given = canonical(m.group(2))
    if (m.group(1), m.group(3)) == ("bit", "B"):
        if not 2 <= given <= 125:
            errs.append(f"{given} B out of 2..125")
        check_number(sample, given * 8, errs, "bit")
        return "in-bit"
    if (m.group(1), m.group(3)) == ("byte", "bit"):
        if given % 8 or not 2 <= given / 8 <= 125:
            errs.append(f"{given} bit are not 2..125 whole bytes")
        check_number(sample, given / 8, errs, "B")
        return "in-byte"
    errs.append("the question asks for the unit it gives")
    return None


def conversion(sample, prose, family, factor, max_steps, errs):
    names = "|".join(["byte"] + family[1:])
    m = re.fullmatch(r"Quanti (" + names + r") sono \$(" + NUM + r")\\,\\text\{(\w+)\}\$\? Ricorda che (.+)\.", prose)
    if not m:
        errs.append(f"conversion text not recognised: {prose!r}")
        return None
    to = "B" if m.group(1) == "byte" else m.group(1)
    given, frm = canonical(m.group(2)), m.group(3)
    if frm not in family or to not in family or frm == to:
        errs.append(f"units {frm} and {to} are not two units of the family {family}")
        return None
    i, j = family.index(frm), family.index(to)
    steps = abs(i - j)
    if not 1 <= steps <= max_steps:
        errs.append(f"{steps} steps between {frm} and {to}")
    lo, hi = min(i, j), max(i, j)
    wanted = [(family[k], factor, family[k - 1]) for k in range(hi, lo, -1)]
    if reminders(m.group(4), errs) != wanted:
        errs.append(f"the reminders are not {wanted}")
    truth = given * SIZE[frm] / SIZE[to]
    small_count = min(given, truth)  # the number in the larger unit
    if decimals(small_count) > 2 or decimals(max(given, truth)) > 0:
        errs.append(f"numbers out of the spec: {given} {frm} = {truth} {to}")
    check_number(sample, truth, errs, to)
    return "moltiplica" if i > j else "dividi"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Un programma conserva (.+?) in (\d+) (bit|byte)(, come numero intero a partire da 0)?\. (Quanti valori diversi può distinguere|Qual è il valore più grande che può conservare)\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    count = int(m.group(2))
    if m.group(3) == "byte":
        if not 1 <= count <= 3:
            errs.append(f"{count} byte out of 1..3")
        n = 8 * count
    else:
        if not 3 <= count <= 16:
            errs.append(f"{count} bit out of 3..16")
        n = count
    largest = m.group(5).startswith("Qual")
    if largest != (m.group(4) is not None):
        errs.append("'a partire da 0' goes with the question about the largest value, and only with it")
    check_number(sample, 2**n - 1 if largest else 2**n, errs)
    return "massimo" if largest else "valori"


def level5(sample, prose, errs):
    m = re.fullmatch(r"(\w+) scarica (.+?) di \$(" + NUM + r")\\,\\text\{MB\}\$ con una connessione da \$(\d+)\\,\\text\{Mbit/s\}\$\. Quanti secondi servono\? Ricorda che " + BYTE + r"\.", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    D, v = canonical(m.group(3)), int(m.group(4))
    t = D * 8 / v
    if t.q != 1 or not 2 <= t <= 120 or D.q != 1:
        errs.append(f"{D} MB at {v} Mbit/s take {t} s: not a whole time in 2..120")
    check_number(sample, t, errs, "s")
    return "tempo"


def level6(sample, prose, errs):
    m = re.fullmatch(r"Quanti MB si scaricano in \$(\d+)\\,\\text\{s\}\$ con una connessione da \$(\d+)\\,\\text\{Mbit/s\}\$\? Ricorda che " + BYTE + r"\.", prose)
    if m:
        t, v = int(m.group(1)), int(m.group(2))
        D = Rational(v * t, 8)
        if D.q != 1 or not 2 <= t <= 120:
            errs.append(f"{v} Mbit/s for {t} s give {D} MB")
        check_number(sample, D, errs, "MB")
        return "dati"
    m = re.fullmatch(r"(\w+) scarica (.+?) di \$(" + NUM + r")\\,\\text\{GB\}\$ con una connessione da \$(\d+)\\,\\text\{Mbit/s\}\$\. Quanti minuti servono\? Ricorda che \$1\\,\\text\{GB\} = 1000\\,\\text\{MB\}\$ e " + BYTE + r"\.", prose)
    if m:
        gb, v = canonical(m.group(3)), int(m.group(4))
        minutes = gb * 1000 * 8 / v / 60
        if minutes.q != 1 or not 1 <= minutes <= 60 or decimals(gb) > 2:
            errs.append(f"{gb} GB at {v} Mbit/s take {minutes} min")
        check_number(sample, minutes, errs, "min")
        return "minuti"
    m = re.fullmatch(r"(\w+) vuole scaricare (.+?) di \$(" + NUM + r")\\,\\text\{MB\}\$ in \$(\d+)\\,\\text\{s\}\$\. Quale velocità serve, in megabit al secondo\? Ricorda che " + BYTE + r"\.", prose)
    if m:
        D, t = canonical(m.group(3)), int(m.group(4))
        v = D * 8 / t
        if v.q != 1 or not 2 <= t <= 120:
            errs.append(f"{D} MB in {t} s need {v} Mbit/s")
        check_number(sample, v, errs, "Mbit/s")
        return "velocita"
    errs.append(f"level 6 text not recognised: {prose!r}")
    return None


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl == 2:
        kind = conversion(sample, prose, DECIMAL, 1000, 2, errs)
    elif lvl == 3:
        kind = conversion(sample, prose, BINARY, 1024, 1, errs)
    elif lvl == 4:
        kind = level4(sample, prose, errs)
    elif lvl == 5:
        kind = level5(sample, prose, errs)
    elif lvl == 6:
        kind = level6(sample, prose, errs)
    else:
        errs.append(f"unknown level {lvl}")
        kind = None
    if kind is not None and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the exercise is {kind!r}")
    return errs, kind
