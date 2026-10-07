"""Checker for inf-font (specs/exercises/inf-font.md).

Written from the spec. Every level is a multiple choice. The numbers are read back from the text and from the CSS
fragment under it and compared with params; every answer is worked out again here.
"""
import re
from fractions import Fraction

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {"carattere": (0.20, 0.35), "glifo": (0.20, 0.35), "font": (0.12, 0.25), "famiglia": (0.12, 0.25), "corpo": (0.05, 0.14)},
    2: {"glifo": (0.15, 0.25), "font": (0.44, 0.56), "ingrandito": (0.24, 0.36)},
    3: {"larghezza": (0.44, 0.56), "gruppo": (0.19, 0.31), "uso": (0.19, 0.31)},
    4: {"distanza": (0.28, 0.44), "altezza": (0.34, 0.50), "spazio": (0.15, 0.30)},
    5: {"primo": (0.19, 0.31), "seguente": (0.38, 0.52), "generico": (0.23, 0.37)},
}

# level 1: what each situation is about, by words only that situation has
SITUATIONS = [
    ("carattere", "viaggia come un numero"),
    ("carattere", "la incolli in una chat"),
    ("carattere", "Che cosa ha quel codice"),
    ("glifo", "due disegni diversi della stessa lettera"),
    ("glifo", "Che cosa descrivono quei punti"),
    ("glifo", "Che cos’è quella griglia"),
    ("font", "Che cos’è quel file"),
    ("font", "con la larghezza di ciascuno"),
    ("famiglia", "Che cosa indica quel nome"),
    ("famiglia", "Che cosa hai scelto con quel nome"),
    ("corpo", "da 12 a 24 punti"),
]
TERMS = {"carattere": "un carattere", "glifo": "un glifo", "font": "un font", "famiglia": "una famiglia di caratteri", "corpo": "il corpo"}

GLYPHS = {(8, 8), (8, 16), (12, 24), (16, 16), (16, 24), (16, 32), (24, 24), (24, 48), (32, 32), (32, 64)}
COUNTS = {26, 52, 62, 95, 96, 100, 128, 200, 256}

# level 3
LOOKS = [
    ("serif", "piccoli tratti alle estremità"),
    ("serif", "Un font ha le grazie"),
    ("sans-serif", "estremità nette"),
    ("sans-serif", "non ha le grazie"),
    ("monospace", "la i e la M occupano la stessa larghezza"),
    ("monospace", "le colonne di un programma restano allineate"),
]
FIXED = {"il listato di un programma", "una tabella di numeri messi in colonna con gli spazi", "l’elenco dei file di una cartella, con le dimensioni in colonna", "un disegno fatto di caratteri, riga sotto riga"}

# level 5
GROUPS = {
    "serif": {"Georgia", "Times New Roman", "Palatino", "Garamond", "Cambria"},
    "sans-serif": {"Verdana", "Arial", "Helvetica", "Tahoma", "Calibri"},
    "monospace": {"Courier New", "Consolas", "Menlo", "Monaco", "Lucida Console"},
}
GENERIC = {"serif": "il font con le grazie scelto dal dispositivo", "sans-serif": "il font senza grazie scelto dal dispositivo", "monospace": "il font a spaziatura fissa scelto dal dispositivo"}
NONE = "nessuno: il testo non viene mostrato"


def same(params, errors, **expected):
    for key, v in expected.items():
        if params.get(key) != v:
            errors.append(f"params.{key} = {params.get(key)!r}, the text says {v!r}")


def right_amount(sample, truth, unit, errors):
    choice = choice_of(sample)
    for i, option in enumerate(choice["options"]):
        m = re.fullmatch(rf"(\d+(?:,\d+)?) {unit}", option["latex"])
        if not m:
            errors.append(f"option {i} is not an amount in {unit}: {option['latex']!r}")
            continue
        shown = Fraction(m.group(1).replace(",", "."))
        if Fraction(option["values"][0]) != shown:
            errors.append(f"option {i}: label and value differ")
        if (shown == truth) != (i == choice["correct"]):
            errors.append(f"option {i} ({option['latex']}): the right amount is {truth} {unit}")
    if sample["solution"] != choice["options"][choice["correct"]]["latex"]:
        errors.append("the solution is not the right option")


def right_label(sample, truth, errors):
    """The right option says `truth`, and no other does."""
    choice = choice_of(sample)
    labels = [o["latex"] for o in choice["options"]]
    if labels[choice["correct"]] != truth:
        errors.append(f"the right option is {labels[choice['correct']]!r}, it should be {truth!r}")
    if labels.count(truth) != 1:
        errors.append("the right label is not there exactly once")
    if sample["solution"] != truth:
        errors.append("the solution is not the right option")


def level1(sample, errors):
    p = sample["params"]
    about = [term for term, mark in SITUATIONS if mark in sample["problem"]]
    if len(about) != 1:
        return errors.append(f"the situation is about {about}: {sample['problem']!r}")
    letters = set(re.findall(r"(?:lettera|La|la|della) ([A-Z])\b", sample["problem"]))
    if letters != {p.get("letter")}:
        errors.append(f"the letters of the text are {letters}, params says {p.get('letter')!r}")
    same(p, errors, case=about[0])
    right_label(sample, TERMS[about[0]], errors)
    if not all(o["latex"] in TERMS.values() for o in choice_of(sample)["options"]):
        errors.append("an option is not a term of the lesson")


def level2(sample, errors):
    p = sample["params"]
    text = sample["problem"]
    m = re.fullmatch(r"In un font bitmap ogni glifo è una griglia di (\d+) × (\d+) pixel, a 1 bit per pixel\. Quanti byte occupa un glifo\?", text)
    if m:
        w, h = int(m.group(1)), int(m.group(2))
        same(p, errors, case="glifo", w=w, h=h)
        truth, unit = Fraction(w * h, 8), "B"
    else:
        m = re.fullmatch(r"Un font bitmap ha (\d+) glifi, ciascuno una griglia di (\d+) × (\d+) pixel a 1 bit per pixel\. Quanti byte occupano i glifi\?", text)
        if m:
            n, w, h = int(m.group(1)), int(m.group(2)), int(m.group(3))
            same(p, errors, case="font", w=w, h=h, n=n)
            if n not in COUNTS:
                errors.append("number of glyphs out of range")
            truth, unit = Fraction(n * w * h, 8), "B"
        else:
            m = re.fullmatch(r"Un font bitmap ha i glifi disegnati su una griglia di (\d+) × (\d+) pixel\. Una lettera viene mostrata alta (\d+) pixel, e il font non ha un disegno per quella dimensione\. Quanti pixel dello schermo occupa ogni pixel del disegno\?", text)
            if not m:
                return errors.append(f"level 2 text not recognised: {text!r}")
            w, h, tall = int(m.group(1)), int(m.group(2)), int(m.group(3))
            if tall % h or not 2 <= tall // h <= 8:
                return errors.append("the letter is not a whole number of times its drawing")
            same(p, errors, case="ingrandito", w=w, h=h, k=tall // h)
            truth, unit = Fraction((tall // h) ** 2), "pixel"
    if (w, h) not in GLYPHS:
        errors.append("glyph out of range")
    if truth.denominator != 1:
        errors.append("not a whole number")
    right_amount(sample, truth, unit, errors)


def level3(sample, errors):
    p = sample["params"]
    text = sample["problem"]
    case = p.get("case")
    m = re.fullmatch(r"In un font a spaziatura fissa ogni carattere è largo (\d+) pixel\. Quanto è larga la riga qui sotto\?", text)
    if m:
        row = sample.get("listing", "").rstrip("\n")
        c = int(m.group(1))
        same(p, errors, case="larghezza", row=row, c=c)
        if "\n" in row or not 6 <= len(row) <= 24 or not 6 <= c <= 12:
            errors.append("row or width out of range")
        return right_amount(sample, Fraction(len(row) * c), "pixel", errors)
    if text == "Per quale di questi testi serve un font a spaziatura fissa?":
        labels = [o["latex"] for o in choice_of(sample)["options"]]
        fixed = [label for label in labels if label in FIXED]
        if case != "uso" or len(fixed) != 1:
            return errors.append(f"one text for a monospaced font, not {fixed}")
        return right_label(sample, fixed[0], errors)
    about = [group for group, mark in LOOKS if mark in text]
    if len(about) != 1 or not text.endswith(" Con quale nome generico lo chiedi in una pagina web?"):
        return errors.append(f"level 3 text not recognised: {text!r}")
    same(p, errors, case="gruppo", group=about[0])
    right_label(sample, about[0], errors)


def level4(sample, errors):
    p = sample["params"]
    m = re.fullmatch(r"(p|li|h2) \{\n    font-size: (\d+)px;\n    line-height: (\d(?:\.\d+)?);\n\}\n", sample.get("listing", ""))
    if not m:
        return errors.append(f"the rule is not recognised: {sample.get('listing')!r}")
    size, lh = int(m.group(2)), Fraction(m.group(3))
    gap = size * lh
    if gap.denominator != 1 or not 10 <= size <= 40 or not Fraction(6, 5) <= lh <= 2:
        errors.append("size or line height out of range, or lines not a whole number of pixels apart")
    text = sample["problem"]
    if text == "Con la regola qui sotto, quanto distano le linee di base di due righe consecutive?":
        case, truth = "distanza", gap
    elif text == "Con la regola qui sotto, di quanti pixel la distanza tra due linee di base supera il corpo del carattere?":
        case, truth = "spazio", gap - size
    else:
        n = re.fullmatch(r"Con la regola qui sotto, quanto è alto un testo che occupa (\d+) righe\?", text)
        if not n:
            return errors.append(f"level 4 text not recognised: {text!r}")
        case, truth = "altezza", int(n.group(1)) * gap
        same(p, errors, n=int(n.group(1)))
        if not 2 <= int(n.group(1)) <= 8:
            errors.append("rows out of range")
    same(p, errors, case=case, size=size, lh=m.group(3), tag=m.group(1))
    right_amount(sample, truth, "pixel", errors)


def level5(sample, errors):
    p = sample["params"]
    m = re.fullmatch(r"(h1|p|body) \{\n    font-family: (.+?);\n\}\n", sample.get("listing", ""), re.S)
    t = re.fullmatch(r"Su un dispositivo sono installati questi font: (.+)\. Quale font usa il browser per l'elemento (h1|p|body), con la regola qui sotto\?", sample["problem"])
    if not m or not t or m.group(1) != t.group(2):
        return errors.append("level 5 rule or text not recognised")
    names = [name.strip() for name in m.group(2).split(",")]
    generic = names.pop()
    if generic not in GROUPS or len(names) != 3:
        return errors.append("three fonts and a generic name at the end")
    listed = []
    for name in names:
        quoted = name.startswith('"') and name.endswith('"')
        bare = name.strip('"')
        if (" " in bare) != quoted:
            errors.append(f"{name}: quotes go around a name with a space, and only there")
        listed.append(bare)
    if not set(listed) <= GROUPS[generic] or len(set(listed)) != 3:
        errors.append("the fonts of the list are not three of the group of its generic name")
    installed = t.group(1).split(", ")
    everything = set().union(*GROUPS.values())
    if not set(installed) <= everything or len(set(installed)) != len(installed) or not installed:
        errors.append("the fonts installed are not fonts of the spec")
    same(p, errors, list=listed, generic=generic, installed=installed, tag=m.group(1))
    found = [name for name in listed if name in installed]
    truth = found[0] if found else GENERIC[generic]
    case = "generico" if not found else "primo" if found[0] == listed[0] else "seguente"
    same(p, errors, case=case)
    right_label(sample, truth, errors)
    allowed = everything | set(GENERIC.values()) | {NONE}
    if not all(o["latex"] in allowed for o in choice_of(sample)["options"]):
        errors.append("an option is neither a font nor one of the two sentences")


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errors = common(sample)
    if "program" in sample["params"]:
        errors.append("a level of fragments has no program")
    check_level = LEVELS.get(sample["level"])
    if not check_level:
        return errors + [f"unknown level {sample['level']}"], None
    if choice_of(sample):
        check_level(sample, errors)
    return errors, sample["params"].get("case")
