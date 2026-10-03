"""Checker for inf-codifica-caratteri (specs/exercises/inf-codifica-caratteri.md).

Written from the spec. Characters, codes and messages are read back from the text; the codes come from Python's
ord(), the bytes of a message from str.encode() ('ascii' or 'utf-8'), the bytes of a code point from the UTF-8
encoding of chr(code point).
"""
import re
from fractions import Fraction

from checkers._inf_codifica import NUM, check_number, check_options, common, option_text, parse_num, prose_and_extra

CASE_RANGES = {
    1: {"maiuscola": (0.33, 0.47), "minuscola": (0.33, 0.47), "cifra": (0.14, 0.26)},
    2: {"maiuscola": (0.33, 0.47), "minuscola": (0.33, 0.47), "cifra": (0.14, 0.26)},
    3: {"stessa lettera": (0.23, 0.37), "altra lettera": (0.63, 0.77)},
    4: {"frase": (0.42, 0.58), "documento": (0.42, 0.58)},
    6: {f"{k} byte": (0.18, 0.32) for k in (1, 2, 3, 4)},
}

CHAR = r"la (lettera maiuscola [A-Z]|lettera minuscola [a-z]|cifra [0-9])"


def family(c):
    return "maiuscola" if c.isupper() else "minuscola" if c.islower() else "cifra"


def read_char(desc):
    """"lettera maiuscola K" -> "K", checking that the words match the character."""
    c = desc[-1]
    words = desc[:-2]
    expected = "cifra" if c.isdigit() else f"lettera {family(c)}"
    if words != expected or not (c.isascii() and c.isalnum()):
        raise ValueError(f"character badly described: {desc!r}")
    return c


def known_and_asked(prose, errs):
    m = re.fullmatch(rf"Nel codice ASCII {CHAR} ha codice \$(\d+)\$\. Qual è il codice del{CHAR}\?", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    known, asked = read_char(m.group(1)), read_char(m.group(3))
    if ord(known) != int(m.group(2)):
        errs.append(f"the code given for {known!r} is wrong")
    return known, asked


def level1(sample, prose, extra, errs):
    r = known_and_asked(prose, errs)
    if r is None:
        return None
    known, asked = r
    if family(known) != family(asked) or known == asked:
        errs.append("level 1 needs two different characters of the same family")
    p = sample["params"]
    if (p.get("known"), p.get("asked")) != (known, asked):
        errs.append("params differ from the text")
    check_number(sample, ord(asked), errs)
    return family(asked)


def level2(sample, prose, extra, errs):
    m = re.fullmatch(
        r"Nel codice ASCII la lettera maiuscola A ha codice \$65\$, la lettera minuscola a ha codice \$97\$ e la cifra 0 ha codice \$48\$\. Quale carattere ha codice \$(\d+|[01]{3}\\,[01]{4}_2)\$\?",
        prose,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    shown = m.group(1)
    binary = shown.endswith("_2")
    n = int(shown[:-2].replace("\\,", ""), 2) if binary else int(shown)
    p = sample["params"]
    if p.get("code") != n or p.get("binary") != binary:
        errs.append("params differ from the text")
    c = chr(n)
    if not (c.isascii() and c.isalnum()):
        errs.append(f"code {n} is not a letter or a digit")
        return None

    def is_right(o):
        ch = o["values"][0]
        label = f"la cifra {ch}" if ch.isdigit() else f"{ch} {family(ch)}"
        if len(ch) != 1 or not (ch.isascii() and ch.isalnum()) or option_text(o["latex"]) != label:
            raise ValueError("option badly written")
        return ord(ch) == n

    check_options(sample["answer"], is_right, errs)
    return family(c)


def level3(sample, prose, extra, errs):
    r = known_and_asked(prose, errs)
    if r is None:
        return None
    known, asked = r
    if {family(known), family(asked)} != {"maiuscola", "minuscola"}:
        errs.append("level 3 needs an upper case and a lower case letter")
    p = sample["params"]
    if (p.get("known"), p.get("asked")) != (known, asked):
        errs.append("params differ from the text")
    check_number(sample, ord(asked), errs)
    kind = "stessa lettera" if known.lower() == asked.lower() else "altra lettera"
    if p.get("case") != kind:
        errs.append("params.case wrong")
    return kind


def message(prose, errs):
    m = re.search(r"Il messaggio, senza le virgolette, è: “([^”]+)”$", prose)
    if not m:
        errs.append("message not found")
        return None
    return m.group(1)


def level4(sample, prose, extra, errs):
    p = sample["params"]
    if prose.startswith("Un messaggio è salvato in ASCII, con un byte per carattere. Quanti byte occupa? "):
        phrase = message(prose, errs)
        if phrase is None:
            return None
        if p.get("phrase") != phrase:
            errs.append("params.phrase differs from the text")
        if "  " in phrase or phrase != phrase.strip():
            errs.append("double or outer spaces would be lost on the page")
        try:
            n = len(phrase.encode("ascii"))
        except UnicodeEncodeError:
            errs.append("the message is not ASCII")
            return "frase"
        check_number(sample, n, errs, "B")
        return "frase"
    m = re.fullmatch(
        rf"Un testo ha \$({NUM})\$ pagine; ogni pagina ha \$(\d+)\$ righe di \$(\d+)\$ caratteri, spazi compresi\. È salvato con un byte per carattere\. Quanti kB occupa\? Usa \$1\\,\\text\{{kB\}} = 1000\\,\\text\{{B\}}\$\.",
        prose,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    pages, rows, cols = int(parse_num(m.group(1))), int(m.group(2)), int(m.group(3))
    if (p.get("pages"), p.get("rows"), p.get("cols")) != (pages, rows, cols):
        errs.append("params differ from the text")
    if not (2 <= pages <= 120 and rows in (20, 25, 30, 40, 50) and cols in (50, 60, 70, 80)):
        errs.append("document out of range")
    check_number(sample, Fraction(pages * rows * cols, 1000), errs, "kB")
    return "documento"


def level5(sample, prose, extra, errs):
    start = "Un messaggio è salvato in UTF-8: le lettere accentate occupano 2 byte, tutti gli altri caratteri del messaggio 1 byte. Quanti byte occupa? "
    if not prose.startswith(start):
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    phrase = message(prose, errs)
    if phrase is None:
        return None
    if sample["params"].get("phrase") != phrase:
        errs.append("params.phrase differs from the text")
    if "  " in phrase or phrase != phrase.strip():
        errs.append("double or outer spaces would be lost on the page")
    accents = [c for c in phrase if not c.isascii()]
    # the rule stated in the problem must be true for this message
    if any(len(c.encode("utf-8")) != 2 or not c.isalpha() for c in accents):
        errs.append("a character that is not a 2-byte accented letter")
    if not 1 <= len(accents) <= 4:
        errs.append(f"{len(accents)} accented letters")
    check_number(sample, len(phrase.encode("utf-8")), errs, "B")
    return None


def level6(sample, prose, extra, errs):
    m = re.fullmatch(r"Un carattere ha punto di codice U\+([0-9A-F]{4,6})\. Quanti byte occupa in UTF-8\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    if sample["params"].get("cp") != m.group(1):
        errs.append("params.cp differs from the text")
    cp = int(m.group(1), 16)
    if cp > 0x10FFFF or 0xD800 <= cp <= 0xDFFF or cp < 0x20 or cp == 0x7F:
        errs.append(f"U+{m.group(1)} is not a character to ask about")
        return None
    n = len(chr(cp).encode("utf-8"))
    check_number(sample, n, errs)
    ch = sample.get("choice")
    if ch and sorted(o["values"][0] for o in ch.get("options", [])) != ["1", "2", "3", "4"]:
        errs.append("the options must be 1, 2, 3 and 4")
    return f"{n} byte"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    fn = LEVELS.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected formula line")
    kind = fn(sample, prose, extra, errs)
    return errs, kind
