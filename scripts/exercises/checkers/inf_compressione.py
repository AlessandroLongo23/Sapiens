"""Checker for inf-compressione (specs/exercises/inf-compressione.md).

Written from the spec and the lesson, not from the generator. Everything is read from the text of the problem and
worked out again here:
- level 1: the scene is sorted by the words it carries;
- level 2: the runs of the row are counted here, and the code written from them (or the row from the code);
- level 3: two bytes per run against one byte per pixel;
- level 4: original : compressed, original : ratio, 100 : ratio;
- level 5: the bits are the counts times the lengths of the codes; a sequence of bits is split with the codes of the
  text, which must be prefix-free;
- level 6: the table of the statements.
"""
import re
from itertools import groupby

from checkers._inf_sic import check_choice, check_sorted, check_statements, common

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in ["senza", "con", "decompressione", "nessuna"]},
    2: {"codifica": (0.42, 0.62), "decodifica": (0.38, 0.58)},
    3: {"byte": (0.42, 0.58), "conviene": (0.25, 0.50), "non conviene": (0.04, 0.25)},
    4: {"rapporto": (0.32, 0.48), "compressa": (0.27, 0.43), "percentuale": (0.07, 0.19), "risparmio": (0.07, 0.19)},
    5: {"bit": (0.47, 0.63), "leggi": (0.37, 0.53)},
    6: {"vera": (0.42, 0.58), "falsa": (0.42, 0.58)},
}

KINDS = {
    "senza": "Una compressione senza perdita",
    "con": "Una compressione con perdita",
    "decompressione": "Una decompressione",
    "nessuna": "Nessuna compressione",
}
KIND_WORDS = {
    "senza": ["identici, bit per bit", "colore esatto di ogni pixel", "ricostruire esattamente", "riavere il testo esatto"],
    "con": ["non ci sono più", "elimina i suoni", "blocchi quadrati", "percepisce meglio"],
    "decompressione": ["ne tira fuori", "ne ricava i campioni", "legge 3N10B3N e scrive", "ricalcola i colori"],
    "nessuna": ["i tre byte di ogni pixel", "così come sono stati misurati", "rinomina il file", "con gli stessi byte"],
}

# statement -> (true?, words it must carry)
STATEMENTS = {
    "t-originale": (True, "conservare l'originale"),
    "t-zip-foto": (True, "non le rimpicciolisce"),
    "t-due-volte": (True, "può allungare"),
    "t-testo": (True, "solo senza perdita"),
    "t-salvataggi": (True, "peggiora a ogni salvataggio"),
    "t-non-tutto": (True, "Nessuna compressione senza perdita riesce"),
    "t-qualita": (True, "lo decide chi salva"),
    "t-rapporto-minore": (True, "minore di 1"),
    "f-torna": (False, "si riottiene l'originale"),
    "f-wav": (False, "gli restituisce la qualità"),
    "f-sempre": (False, "accorcia qualunque riga"),
    "f-zip": (False, "ogni volta più piccolo"),
    "f-testo": (False, "se la perdita è piccola"),
    "f-percento": (False, "resta il 4%"),
    "f-senza-qualita": (False, "abbassa un poco la qualità"),
    "f-casuale": (False, "scelti a caso"),
    "f-frequente": (False, "il codice più lungo"),
}

MODEL = "Ogni pixel della riga occupa un byte; nella codifica RLE ogni sequenza occupa due byte, uno per il numero e uno per il colore."


def runs_of(row):
    return [(len(list(g)), letter) for letter, g in groupby(row)]


def encode(row):
    return "".join(f"{n}{letter}" for n, letter in runs_of(row))


def decode(code):
    if not re.fullmatch(r"(\d[BNRV])+", code):
        raise ValueError(f"not a code of pairs: {code!r}")
    return "".join(letter * int(n) for n, letter in re.findall(r"(\d)([BNRV])", code))


def level2(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(r"Una riga di pixel è scritta con le lettere dei colori: ([BNRV]+)\. Qual è la sua codifica RLE, con il numero prima della lettera\?", problem)
    if m:
        row, kind = m.group(1), "codifica"
        right = encode(row)
    else:
        m = re.fullmatch(r"La codifica RLE di una riga di pixel è ((?:\d[BNRV])+), con il numero prima della lettera\. Qual è la riga\?", problem)
        if not m:
            errs.append(f"level 2 text not recognised: {problem!r}")
            return None
        row, kind = decode(m.group(1)), "decodifica"
        right = row
        if encode(row) != m.group(1):
            errs.append("the code of the text has two neighbouring runs of the same colour")
    rs = runs_of(row)
    if not 3 <= len(rs) <= 5 or len(row) > 18 or any(n > 6 for n, _ in rs) or len({n for n, _ in rs}) < 2:
        errs.append(f"row out of the constraints: {row}")
    if params.get("row") != row or params.get("code") != encode(row):
        errs.append("params do not carry the row and its code")
    check_choice(sample, lambda o: o["latex"] == right, errs)
    return kind


def level3(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(rf"Una riga di pixel è ([BNRV]+)\. {re.escape(MODEL)} (Quanti byte occupa la codifica RLE della riga\?|Conviene codificare questa riga con RLE\?)", problem)
    if not m:
        errs.append(f"level 3 text not recognised: {problem!r}")
        return None
    row = m.group(1)
    count, n = len(runs_of(row)), len(row)
    size = 2 * count
    if not 2 <= count <= 9 or not 8 <= n <= 20 or size == n:
        errs.append(f"row out of the constraints: {row}")
    if (params.get("row"), params.get("runs"), params.get("bytes")) != (row, count, size):
        errs.append("params do not carry the row, its runs and the bytes")
    if m.group(2).startswith("Quanti"):
        check_choice(sample, lambda o: o["latex"] == f"{size} byte", errs)
        return "byte"

    def right(o):
        text = o["latex"]
        said = re.fullmatch(r"(Sì|No): la codifica occupa (\d+) byte, la riga (\d+)", text)
        if not said:
            return False  # the options without the two numbers are never right: the sizes differ
        yes, a, b = said.group(1) == "Sì", int(said.group(2)), int(said.group(3))
        return (a, b) == (size, n) and yes == (size < n)

    check_choice(sample, right, errs)
    return "conviene" if size < n else "non conviene"


def number_of(o, pattern):
    m = re.fullmatch(pattern, o["latex"])
    if not m or o["values"][0] != m.group(1):
        raise ValueError(f"option {o['latex']!r} is not {o['values'][0]}")
    return int(m.group(1))


def level4(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(r"(?:Una|Un) [a-z]+ non compress[ao] occupa \$(\d+)\$ (kB|MB|GB); dopo la compressione occupa \$(\d+)\$ (kB|MB|GB)\. Qual è il rapporto di compressione\?", problem)
    if m:
        original, compressed = int(m.group(1)), int(m.group(3))
        if m.group(2) != m.group(4) or original % compressed or original // compressed < 2:
            errs.append(f"{original} and {compressed} do not give a whole ratio")
        ratio = original // compressed
        if (params.get("original"), params.get("compressed"), params.get("ratio")) != (original, compressed, ratio):
            errs.append("params do not carry the sizes and the ratio")
        check_choice(sample, lambda o: number_of(o, r"\$(\d+) : 1\$") == ratio, errs)
        return "rapporto"
    m = re.fullmatch(r"Un file non compresso occupa \$(\d+)\$ (kB|MB|GB) e viene compresso con rapporto \$(\d+) : 1\$\. Quanto occupa il file compresso\?", problem)
    if m:
        original, unit, ratio = int(m.group(1)), m.group(2), int(m.group(3))
        if original % ratio:
            errs.append(f"{original} is not a multiple of {ratio}")
        compressed = original // ratio
        if (params.get("original"), params.get("compressed"), params.get("ratio")) != (original, compressed, ratio):
            errs.append("params do not carry the sizes and the ratio")
        check_choice(sample, lambda o: number_of(o, rf"\$(\d+)\$ {unit}") == compressed, errs)
        return "compressa"
    m = re.fullmatch(r"Un file viene compresso con rapporto \$(\d+) : 1\$\. Quale percentuale (dello spazio si risparmia|della dimensione originale occupa il file compresso)\?", problem)
    if not m:
        errs.append(f"level 4 text not recognised: {problem!r}")
        return None
    ratio = int(m.group(1))
    if 100 % ratio:
        errs.append(f"100 : {ratio} is not whole")
    left = 100 // ratio
    saved = m.group(2).startswith("dello")
    if params.get("ratio") != ratio:
        errs.append("params do not carry the ratio")
    check_choice(sample, lambda o: number_of(o, r"(?:Il |L')\$(\d+)\\%\$") == (100 - left if saved else left), errs)
    return "risparmio" if saved else "percentuale"


def codes_of(text, errs):
    """letter -> code, from 'B = 0, N = 10, R = 110, V = 111'; the codes must be prefix-free."""
    table = dict(re.findall(r"([BNRV]) = ([01]+)", text))
    codes = list(table.values())
    if len(table) != 4 or sorted(codes) != ["0", "10", "110", "111"]:
        errs.append(f"codes not recognised: {text!r}")
    if any(a != b and b.startswith(a) for a in codes for b in codes):
        errs.append("a code is the beginning of another")
    return table


def level5(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(r"Una riga di (\d+) pixel ha (.+)\. I colori sono scritti con i codici (.+)\. Quanti bit occupa la riga\?", problem)
    if m:
        table = codes_of(m.group(3), errs)
        counts = [(int(n), letter) for n, letter in re.findall(r"(\d+) pixel ([BNRV])", m.group(2))]
        if len(counts) != 4 or sum(n for n, _ in counts) != int(m.group(1)):
            errs.append("the counts do not add up to the pixels of the row")
        # the most frequent colour, alone, has the shortest code
        top = max(counts)
        if [n for n, _ in counts].count(top[0]) != 1 or table.get(top[1]) != "0":
            errs.append("the shortest code is not of the most frequent colour")
        bits = sum(n * len(table.get(letter, "")) for n, letter in counts)
        if params.get("bits") != bits:
            errs.append("params do not carry the bits")
        check_choice(sample, lambda o: number_of(o, r"(\d+) bit") == bits, errs)
        return "bit"
    m = re.fullmatch(r"I colori sono scritti con i codici (.+)\. Quali pixel corrispondono ai bit ([01]+)\?", problem)
    if not m:
        errs.append(f"level 5 text not recognised: {problem!r}")
        return None
    back = {code: letter for letter, code in codes_of(m.group(1), errs).items()}
    pixels, word = [], ""
    for bit in m.group(2):
        word += bit
        if word in back:
            pixels.append(back[word])
            word = ""
    if word:
        errs.append("the bits do not end with a whole code")
    if not 3 <= len(pixels) <= 5:
        errs.append(f"{len(pixels)} pixels")
    if params.get("pixels") != pixels or params.get("bits") != m.group(2):
        errs.append("params do not carry the bits and the pixels")
    check_choice(sample, lambda o: o["latex"] == ", ".join(pixels), errs)
    return "leggi"


def check(sample):
    errs = []
    if common(sample, errs) is None or errs:
        return errs, None
    lvl = sample["level"]
    kind = None
    try:
        if lvl == 1:
            kind = check_sorted(sample, "Che cosa è avvenuto?", KINDS, KIND_WORDS, errs)
        elif lvl == 2:
            kind = level2(sample, errs)
        elif lvl == 3:
            kind = level3(sample, errs)
        elif lvl == 4:
            kind = level4(sample, errs)
        elif lvl == 5:
            kind = level5(sample, errs)
        elif lvl == 6:
            kind = check_statements(sample, "sulla compressione", STATEMENTS, errs)
        else:
            errs.append(f"unknown level {lvl}")
    except ValueError as e:
        errs.append(str(e))
    if kind is not None and sample["params"].get("case") != kind:
        errs.append("wrong case in params")
    return errs, kind
