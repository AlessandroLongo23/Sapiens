"""Checker for inf-file-system (specs/exercises/inf-file-system.md).

Written from the spec and the lesson, not from the generator. Names and paths are read from the text:
- level 1: the extension is what follows the last dot of the name; the table below gives its type;
- level 2: the tree is rebuilt from the indentation of its lines and the path of the file is read from its ancestors;
- levels 3 and 4: the relative path is applied to the current folder one piece at a time (a name is appended, `..`
  removes the last folder);
- level 5: a move or a copy puts the file name after the destination folder, a renaming changes the last name, the
  original of a copy stays where it was;
- level 6: size of a folder = count times size, divided by 1000 (the text must state the factor); files that fit =
  free space divided by the size, rounded down.
Paths start with `/` and use the slash, or start with `C:\\` and use the backslash; none is longer than 28 characters.
"""
import re
from fractions import Fraction

from checkers._inf_so import check_choice, check_number, common, measure, option_text, prose_and_extra, untt

CASE_RANGES = {
    1: {"tipo": (0.68, 0.82), "estensione": (0.18, 0.32)},
    2: {"slash": (0.40, 0.60), "backslash": (0.40, 0.60)},
    3: {"slash": (0.40, 0.60), "backslash": (0.40, 0.60)},
    4: {"1 livelli": (0.55, 0.80), "2 livelli": (0.20, 0.45)},
    5: {k: (0.14, 0.26) for k in ["sposta", "rinomina", "copia", "originale", "sposta e rinomina"]},
    6: {"totale": (0.40, 0.60), "quanti": (0.40, 0.60)},
}

MAX_PATH = 28
TYPES = {
    "testo": ("Un documento di testo", ["txt", "odt", "docx", "pdf"]),
    "foglio": ("Un foglio di calcolo", ["ods", "xlsx"]),
    "presentazione": ("Una presentazione", ["odp", "pptx"]),
    "immagine": ("Un'immagine", ["jpg", "png", "gif"]),
    "audio": ("Un file audio", ["mp3", "wav"]),
    "video": ("Un video", ["mp4", "avi"]),
    "web": ("Una pagina web", ["html"]),
    "archivio": ("Un archivio compresso", ["zip"]),
    "programma": ("Un programma eseguibile", ["exe"]),
}
TT = r"\$\\texttt\{([^$]*)\}\$"


def plain(s):
    return s.replace("\\textbackslash{}", "\\")


def split_abs(path):
    """An absolute path as (style, segments); raises if it is not one."""
    if path.startswith("C:\\"):
        style, body, sep = "backslash", path[3:], "\\"
        if "/" in body:
            raise ValueError(f"mixed separators in {path!r}")
    elif path.startswith("/"):
        style, body, sep = "slash", path[1:], "/"
        if "\\" in body:
            raise ValueError(f"mixed separators in {path!r}")
    else:
        raise ValueError(f"{path!r} is not absolute")
    segs = body.split(sep) if body else []
    if any(x == "" for x in segs):
        raise ValueError(f"empty name in {path!r}")
    return style, segs


def join_abs(style, segs):
    return ("/" + "/".join(segs)) if style == "slash" else ("C:\\" + "\\".join(segs))


def check_paths(sample, truth, errs):
    def right(o):
        path = untt(o["latex"])
        if o["values"] != [path]:
            raise ValueError("path value does not match its text")
        if len(path) > MAX_PATH:
            raise ValueError(f"path of {len(path)} characters")
        return path == truth

    check_choice(sample["answer"], right, errs)


def level1(sample, prose, errs):
    m = re.fullmatch(r"Che tipo di file è " + TT + r"\?", prose)
    if m:
        ext = m.group(1).rsplit(".", 1)[1]
        found = [k for k, (_, exts) in TYPES.items() if ext in exts]
        if len(found) != 1:
            errs.append(f"extension {ext!r} unknown")
            return None

        def type_of(o):
            k = o["values"][0]
            if TYPES[k][0] != option_text(o["latex"]):
                raise ValueError(f"option {o['latex']!r} is not the type {k!r}")
            return k

        check_choice(sample["answer"], lambda o: type_of(o) == found[0], errs)
        return "tipo"
    m = re.fullmatch(r"Qual è l'estensione del file " + TT + r"\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    name = m.group(1)
    if name.count(".") != 2:
        errs.append(f"{name!r}: the question on the extension needs a name with two dots")
    truth = "." + name.rsplit(".", 1)[1]

    def ext_of(o):
        s = untt(o["latex"])
        if o["values"] != [s]:
            raise ValueError("value does not match its text")
        return s

    check_choice(sample["answer"], lambda o: ext_of(o) == truth, errs)
    return "estensione"


def level2(sample, prose, extra, errs):
    m = re.fullmatch(r"Nell'albero ogni nome sta dentro la cartella che lo precede con un rientro in meno\. Qual è il percorso assoluto del file " + TT + r"\?", prose)
    t = re.fullmatch(r"\\begin\{array\}\{l\} (.+) \\end\{array\}", extra[0]) if len(extra) == 1 else None
    if not m or not t:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    target = m.group(1)
    stack, paths = [], {}
    rows = t.group(1).split(" \\\\ ")
    if not 6 <= len(rows) <= 9:
        errs.append(f"tree of {len(rows)} lines")
    for k, row in enumerate(rows):
        depth = 0
        while row.startswith("\\quad "):
            depth, row = depth + 1, row[6:]
        name = untt(row)
        if depth > len(stack) or (k == 0) != (depth == 0):
            errs.append(f"line {k + 1} indented by {depth} after depth {len(stack) - 1}")
            return None
        stack = stack[:depth] + [name]
        if name in paths:
            errs.append(f"name {name!r} twice in the tree")
        paths[name] = list(stack)
    if target not in paths or "." not in target:
        errs.append(f"file {target!r} not in the tree")
        return None
    root, segs = paths[target][0], paths[target][1:]
    if root not in ("/", "C:\\"):
        errs.append(f"root {root!r}")
        return None
    style = "slash" if root == "/" else "backslash"
    check_paths(sample, join_abs(style, segs), errs)
    return style


def resolve(cur, rel_path):
    """The absolute path of a relative one from the folder `cur`, and how many `..` it starts with."""
    style, segs = split_abs(cur)
    pieces = rel_path.split("/" if style == "slash" else "\\")
    ups = 0
    for i, piece in enumerate(pieces):
        if piece == "..":
            if i != ups:
                raise ValueError("a .. after a name")
            ups += 1
            if not segs:
                raise ValueError("above the root")
            segs = segs[:-1]
        elif piece in ("", "."):
            raise ValueError(f"piece {piece!r}")
        else:
            segs = segs + [piece]
    return style, join_abs(style, segs), ups, len(pieces) - ups


def level34(sample, prose, errs, lvl):
    m = re.fullmatch(r"La cartella corrente è " + TT + r"\. Qual è il percorso assoluto di " + TT + r"\?", prose)
    if not m:
        errs.append(f"level {lvl} text not recognised: {prose!r}")
        return None
    try:
        style, truth, ups, names = resolve(plain(m.group(1)), plain(m.group(2)))
    except ValueError as e:
        errs.append(str(e))
        return None
    if lvl == 3 and (ups != 0 or names not in (2, 3)):
        errs.append(f"level 3 needs two or three names and no ..: {m.group(2)!r}")
    if lvl == 4 and (ups not in (1, 2) or not 1 <= names <= 3):
        errs.append(f"level 4 needs one or two .. and one to three names: {m.group(2)!r}")
    check_paths(sample, truth, errs)
    return style if lvl == 3 else f"{ups} livelli"


def level5(sample, prose, errs):
    stories = [
        ("sposta", r"Il file " + TT + r" viene spostato nella cartella " + TT + r"\. Qual è ora il suo percorso assoluto\?"),
        ("copia", r"Il file " + TT + r" viene copiato nella cartella " + TT + r"\. Qual è il percorso assoluto della copia\?"),
        ("originale", r"Il file " + TT + r" viene copiato nella cartella " + TT + r"\. Dopo la copia, qual è il percorso assoluto dell'originale\?"),
        ("rinomina", r"Il file " + TT + r" viene rinominato " + TT + r"\. Qual è ora il suo percorso assoluto\?"),
        ("sposta e rinomina", r"Il file " + TT + r" viene spostato nella cartella " + TT + r" e poi rinominato " + TT + r"\. Qual è ora il suo percorso assoluto\?"),
    ]
    for kind, pattern in stories:
        m = re.fullmatch(pattern, prose)
        if not m:
            continue
        try:
            style, src = split_abs(plain(m.group(1)))
            if kind == "rinomina":
                segs = src[:-1] + [m.group(2)]
            else:
                dst_style, dst = split_abs(plain(m.group(2)))
                if dst_style != style or dst == src[:-1]:
                    raise ValueError("destination in another notation, or the same folder")
                segs = src if kind == "originale" else dst + [m.group(3) if kind == "sposta e rinomina" else src[-1]]
        except ValueError as e:
            errs.append(str(e))
            return None
        new_name = segs[-1]
        if new_name.rsplit(".", 1)[-1] != src[-1].rsplit(".", 1)[-1]:
            errs.append("the new name changes the extension")
        check_paths(sample, join_abs(style, segs), errs)
        return kind
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


def level6(sample, prose, errs):
    m = re.fullmatch(r"Una cartella contiene \$(\d+)\$ (?:foto|documenti|brani) da (\$[^$]+\$) ciascuno\. Sapendo che \$1\\,\\text\{MB\} = 1000\\,\\text\{kB\}\$, quanti megabyte occupa la cartella\?", prose)
    if m:
        total = int(m.group(1)) * measure(m.group(2), "kB")
        check_number(sample, Fraction(total, 1000), "MB", errs)
        return "totale"
    m = re.fullmatch(r"Su una chiavetta restano (\$[^$]+\$) liberi\. Quanti video da (\$[^$]+\$) ciascuno ci stanno per intero\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    free, size = measure(m.group(1), "MB"), measure(m.group(2), "MB")
    if (free / size).denominator == 1:
        errs.append("the division has no remainder")
    check_number(sample, Fraction(int(free // size)), "", errs)
    return "quanti"


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    lvl = sample["level"]
    if lvl != 2 and extra:
        errs.append("unexpected non-prose lines")
    if lvl <= 5 and sample["answer"].get("kind") != "choice":
        errs.append("answer is not a choice")
        return errs, None
    kind = None
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl == 2:
        kind = level2(sample, prose, extra, errs)
    elif lvl in (3, 4):
        kind = level34(sample, prose, errs, lvl)
    elif lvl == 5:
        kind = level5(sample, prose, errs)
    elif lvl == 6:
        kind = level6(sample, prose, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
