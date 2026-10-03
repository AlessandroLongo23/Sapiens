"""Checker for word (specs/exercises/word.md), lesson "Struttura di un documento elettronico".

Written from the spec. The answer is rebuilt from the pieces of the story, read back from the text:
- level 1: the change is classified by its keywords (content, characters, paragraph, page);
- level 2: sheet, orientation and the four margins are read; the sheet sizes come from the table here; the side of
  the text area is the side of the sheet minus its two margins;
- level 3: the job is classified by its keywords (end of paragraph, line break, tab, page break);
- level 4: the lines before the title are counted and laid out on pages of the given height;
- level 5: the use is classified by its keywords (editable format, PDF, plain text).
"""
import re
from fractions import Fraction

from checkers._inf_documenti import NAME, check_labels, check_number, classify, common, parse_num

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in ["carattere", "paragrafo", "pagina", "contenuto"]},
    2: {k: (0.18, 0.32) for k in ["verticale-larghezza", "verticale-altezza", "orizzontale-larghezza", "orizzontale-altezza"]},
    3: {k: (0.18, 0.32) for k in ["paragrafo", "riga", "tabulazione", "pagina"]},
    4: {"invii": (0.50, 0.70), "interruzione": (0.30, 0.50)},
    5: {k: (0.25, 0.42) for k in ["modificabile", "pdf", "txt"]},
}

DOCS = ["la relazione di scienze", "la ricerca di storia", "il tema di italiano", "la tesina di geografia", "il curriculum", "la relazione di laboratorio", "il giornalino di classe", "la lettera al preside"]
DOC = "(" + "|".join(DOCS) + ")"

TOUCH_LABELS = {"La formattazione dei caratteri": "carattere", "La formattazione del paragrafo": "paragrafo", "Le impostazioni della pagina": "pagina", "Il contenuto": "contenuto"}
TOUCH_RULES = {
    "carattere": ["grassetto", "corsivo", "colorare", "punti", "tipo di carattere", "sottolineare"],
    "paragrafo": ["centrare", "giustificare", "interlinea", "rientrare", "spazio prima", "allineare"],
    "pagina": ["margin", "orizzontale", "formato A"],
    "contenuto": ["correggere", "aggiungere una", "cancellare", "sostituire"],
}

# sides of the upright sheet, in centimetres (ISO 216)
SHEETS = {"A4": (Fraction(21), Fraction(297, 10)), "A5": (Fraction(148, 10), Fraction(21)), "A3": (Fraction(297, 10), Fraction(42))}

MARK_LABELS = {"Un fine paragrafo": "paragrafo", "Un'interruzione di riga": "riga", "Una tabulazione": "tabulazione", "Un'interruzione di pagina": "pagina"}
MARK_RULES = {
    "paragrafo": ["nuovo capoverso", "chiudere il titolo", "chiudere un punto"],
    "riga": ["senza aprire un altro paragrafo", "restare un solo paragrafo", "che è un solo paragrafo"],
    "tabulazione": ["nello stesso punto della riga", "in colonna", "alla stessa distanza"],
    "pagina": ["pagina nuova", "pagina a sé", "pagina separata"],
}

FORMAT_LABELS = {"Un formato modificabile: .odt o .docx": "modificabile", "Il formato PDF (.pdf)": "pdf", "Il testo semplice (.txt)": "txt", "Una foto dello schermo (.jpg)": "immagine", "Un'immagine della pagina (.png)": "immagine"}
FORMAT_RULES = {
    "modificabile": ["continuare a scriverla", "a metà", "scrivendoci dentro", "a turno"],
    "pdf": ["uguale su ogni computer", "per la stampa", "pubblicare", "allegare"],
    "txt": ["senza alcuna formattazione", "senza grassetti", "soltanto i caratteri"],
}


def level1(sample, text, errs):
    m = re.fullmatch(NAME + " sta sistemando " + DOC + r" e decide di (.+)\. Che cosa sta cambiando\?", text)
    if not m:
        errs.append(f"level 1 text not recognised: {text!r}")
        return None
    kind = classify(m.group(3), TOUCH_RULES, errs)
    if kind:
        check_labels(sample, TOUCH_LABELS, kind, errs)
    return kind


def cm(s):
    m = re.fullmatch(r"\$(.+)\\,\\text\{cm\}\$", s)
    if not m:
        raise ValueError(f"not centimetres: {s!r}")
    return parse_num(m.group(1))


def level2(sample, text, errs):
    c = r"(\$[^$]+\$)"
    m = re.fullmatch(
        NAME + r" usa un foglio (A\d), che in verticale è largo " + c + " e alto " + c + r", e lo imposta in (verticale|orizzontale)\. "
        r"I margini sinistro e destro sono di " + c + " e di " + c + ", quelli superiore e inferiore di " + c + " e di " + c + r"\. "
        r"Quanti centimetri è (larga|alta) l'area del testo\?",
        text,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {text!r}")
        return None
    sheet, orient, asked = m.group(2), m.group(5), m.group(10)
    w, h = cm(m.group(3)), cm(m.group(4))
    if SHEETS.get(sheet) != (w, h):
        errs.append(f"sheet {sheet} is not {w} by {h}")
    left, right, top, bottom = (cm(m.group(i)) for i in (6, 7, 8, 9))
    for x in (left, right, top, bottom):
        if not (1 <= x <= Fraction(7, 2)) or (x * 2).denominator != 1:
            errs.append(f"margin {x} out of the spec")
    if orient == "orizzontale":
        w, h = h, w
    truth = w - left - right if asked == "larga" else h - top - bottom
    check_number(sample, truth, errs, "cm")
    return f"{orient}-{'larghezza' if asked == 'larga' else 'altezza'}"


def level3(sample, text, errs):
    m = re.fullmatch(NAME + " scrive " + DOC + r" e vuole (.+)\. Che cosa inserisce in quel punto\?", text)
    if not m:
        errs.append(f"level 3 text not recognised: {text!r}")
        return None
    kind = classify(m.group(3), MARK_RULES, errs)
    if kind:
        check_labels(sample, MARK_LABELS, kind, errs)
    return kind


def level4(sample, text, errs):
    m = re.fullmatch(
        r"Ogni pagina del documento di " + NAME + r" contiene \$(\d+)\$ righe, e il primo capitolo ne occupa \$(\d+)\$\. "
        r"Per far cominciare il secondo capitolo in cima alla pagina 2, \1 (preme Invio \$(\d+)\$ volte|inserisce un'interruzione di pagina) dopo il primo capitolo\. "
        r"Poi aggiunge \$(\d+)\$ righe al primo capitolo\. Su quale riga della pagina 2 si trova ora il titolo del secondo capitolo\?",
        text,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {text!r}")
        return None
    rows, first, added = int(m.group(2)), int(m.group(3)), int(m.group(6))
    if not (30 <= rows <= 45 and 2 <= added <= 9):
        errs.append(f"rows {rows} or added lines {added} out of the spec")
    if first + added > rows:
        errs.append("the first chapter no longer fits page 1")
    if m.group(5):
        empty = int(m.group(5))
        if first + empty != rows:
            errs.append(f"{empty} empty lines did not bring the title to the top of page 2")
        before = first + added + empty  # lines before the title
        page, row = divmod(before, rows)
        if page != 1:
            errs.append("the title is not on page 2")
        truth, kind = row + 1, "invii"
    else:
        truth, kind = 1, "interruzione"
    check_number(sample, truth, errs)
    return kind


def level5(sample, text, errs):
    m = re.fullmatch(NAME + r" deve (.+)\. In quale formato salva il file\?", text)
    if not m:
        errs.append(f"level 5 text not recognised: {text!r}")
        return None
    kind = classify(m.group(2), FORMAT_RULES, errs)
    if kind:
        check_labels(sample, FORMAT_LABELS, kind, errs)
        keys = sorted(o["values"][0] for o in sample["answer"]["options"])
        if keys != ["immagine", "modificabile", "pdf", "txt"]:
            errs.append(f"options {keys}: expected the three formats and one picture")
    return kind


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    text = common(sample, errs)
    if text is None:
        return errs, None
    fn = LEVELS.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    kind = fn(sample, text, errs)
    if kind is not None and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case = {sample.get('params', {}).get('case')!r} but the story is {kind!r}")
    return errs, kind
