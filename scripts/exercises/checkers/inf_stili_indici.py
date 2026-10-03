"""Checker for inf-stili-indici (specs/exercises/inf-stili-indici.md), lesson "Stili, titoli, tabelle e indici
automatici".

Written from the spec; every answer is rebuilt from the story read back from the text:
- level 1: chapter, part and part of the part are read; the asked piece decides the style;
- level 2: only the paragraphs with the modified style change;
- level 3: the index holds the titles with a title style up to the chosen level, never the hand-made ones;
- level 4: not updated, the index keeps the old title and page; updated, it has the new title and the page moved on
  by the pages added;
- level 5: the items are renumbered by building the list and inserting or removing;
- level 6: rows times columns, with the header row, or minus the cells lost in a merge.
"""
import re

from checkers._inf_documenti import NAME, check_choice, check_labels, check_number, common, option_text

CASE_RANGES = {
    1: {k: (0.14, 0.27) for k in ["Titolo 1", "Titolo 2", "Titolo 3", "Corpo del testo", "Didascalia"]},
    2: {"titolo1": (0.40, 0.60), "titolo2": (0.40, 0.60)},
    3: {k: (0.25, 0.42) for k in ["livello1", "livello2", "livello3"]},
    4: {"aggiornato": (0.40, 0.60), "non-aggiornato": (0.40, 0.60)},
    5: {"sale": (0.40, 0.60), "resta": (0.17, 0.33), "scende": (0.17, 0.33)},
    6: {"intestazione": (0.40, 0.60), "unione": (0.40, 0.60)},
}

STYLES = ["Titolo 1", "Titolo 2", "Titolo 3", "Corpo del testo", "Didascalia"]


def level1(sample, text, errs):
    m = re.fullmatch(
        r'Nella ricerca "(.+?)" di ' + NAME + r', "(.+?)" è un capitolo, "(.+?)" è una parte di quel capitolo e "(.+?)" è una parte di "(.+?)"\. Quale stile dà \2 (.+)\?',
        text,
    )
    if not m:
        errs.append(f"level 1 text not recognised: {text!r}")
        return None
    chapter, part, sub, target = m.group(3), m.group(4), m.group(5), m.group(7)
    if m.group(6) != part or len({chapter, part, sub}) != 3:
        errs.append("the outline of the document is not a chapter, a part and a part of the part")
    depth = {chapter: 1, part: 2, sub: 3}
    t = re.fullmatch(r'al titolo "(.+)"', target)
    b = re.fullmatch(r'al testo normale scritto sotto il titolo "(.+)"', target)
    c = re.fullmatch(r'alla riga con il numero e la descrizione di una figura, sotto il titolo "(.+)"', target)
    named = (t or b or c).group(1) if (t or b or c) else None
    if named not in depth:
        errs.append(f"asked piece not recognised: {target!r}")
        return None
    style = f"Titolo {depth[named]}" if t else "Corpo del testo" if b else "Didascalia"
    check_labels(sample, {s: s for s in STYLES}, style, errs)
    return style


def level2(sample, text, errs):
    m = re.fullmatch(
        r"Nel documento di " + NAME + r" ci sono \$(\d+)\$ titoli con lo stile Titolo 1, \$(\d+)\$ con lo stile Titolo 2 e \$(\d+)\$ titoli formattati a mano, senza stile, "
        r"che somigliano ai Titolo ([12])\. \1 modifica lo stile Titolo ([12]): .+\. Quanti titoli cambiano aspetto\?",
        text,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {text!r}")
        return None
    a, b, hand, j = int(m.group(2)), int(m.group(3)), int(m.group(4)), int(m.group(6))
    if m.group(5) != m.group(6):
        errs.append("the hand-made titles look like another style than the one modified")
    if a == b or not (3 <= a <= 9 and 4 <= b <= 14 and 1 <= hand <= 4):
        errs.append(f"counts {a}, {b}, {hand} out of the spec")
    with_style = {1: a, 2: b}
    check_number(sample, with_style[j], errs)
    return f"titolo{j}"


def level3(sample, text, errs):
    m = re.fullmatch(
        r"Il documento di " + NAME + r" ha \$(\d+)\$ titoli con lo stile Titolo 1, \$(\d+)\$ con lo stile Titolo 2 e \$(\d+)\$ con lo stile Titolo 3"
        r"(?:, più \$(\d+)\$ titoli scritti in grassetto senza uno stile di titolo)?\. L'indice automatico mostra i titoli fino al livello \$([123])\$\. Quante voci ha l'indice\?",
        text,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {text!r}")
        return None
    by_level = {1: int(m.group(2)), 2: int(m.group(3)), 3: int(m.group(4))}
    upto = int(m.group(6))
    entries = sum(n for lvl, n in by_level.items() if lvl <= upto)
    check_number(sample, entries, errs)
    return f"livello{upto}"


def level4(sample, text, errs):
    m = re.fullmatch(
        r"Nell'indice del documento di " + NAME + r', alla voce "(.+?)" corrisponde la pagina \$(\d+)\$\. \1 cambia quel titolo in "(.+?)" e aggiunge \$(\d+)\$ pagin[ae] prima di quel capitolo\. '
        r"(Poi aggiorna l'indice|Non aggiorna l'indice)\. Che cosa si legge ora nell'indice per quel capitolo\?",
        text,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {text!r}")
        return None
    old, page, new, added = m.group(2), int(m.group(3)), m.group(4), int(m.group(5))
    updated = m.group(6).startswith("Poi")
    if old == new or added < 1:
        errs.append("nothing changes")
    shown = (new, page + added) if updated else (old, page)

    def read(o):
        mm = re.fullmatch(r"(.+), pagina (\d+)", option_text(o["latex"]))
        title, p = mm.group(1), int(mm.group(2))
        if title not in (old, new) or p not in (page, page + added):
            raise ValueError("not one of the two titles with one of the two pages")
        key = ("vecchio" if title == old else "nuovo") + "|" + ("vecchia" if p == page else "nuova")
        if o["values"] != [key]:
            raise ValueError(f"values {o['values']} do not say {key}")
        return title, p

    check_choice(sample["answer"], lambda o: read(o) == shown, errs)
    return "aggiornato" if updated else "non-aggiornato"


def level5(sample, text, errs):
    one = r"(Figura|Tabella|nota)"
    m = re.fullmatch(
        r"Nel documento di " + NAME + r" ci sono \$(\d+)\$ (figure|tabelle|note a piè di pagina) numerate in automatico\. \1 "
        r"(?:ne inserisce (una nuova|\$\d+\$ nuove) tra la " + one + r" \$(\d+)\$ e la \5 \$(\d+)\$|elimina la " + one + r" \$(\d+)\$)\. "
        r"Che numero ha ora quella che era la " + one + r" \$(\d+)\$\?",
        text,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {text!r}")
        return None
    n = int(m.group(2))
    names = {"figure": "Figura", "tabelle": "Tabella", "note a piè di pagina": "nota"}
    used = m.group(5) or m.group(8)
    if names[m.group(3)] != used or m.group(10) != used:
        errs.append("the items are named in two ways")
    x = int(m.group(11))
    items = list(range(1, n + 1))  # the old numbers, in order
    if m.group(4):
        j = 1 if m.group(4) == "una nuova" else int(m.group(4).strip("$ nuove"))
        i = int(m.group(6))
        if int(m.group(7)) != i + 1 or not (1 <= i < n and 1 <= j <= 3):
            errs.append("bad insertion point")
        items[i:i] = [None] * j
    else:
        d = int(m.group(9))
        if d == x or not 1 <= d <= n:
            errs.append("the removed item is the one asked about")
            return None
        items.remove(d)
    if not (5 <= n <= 12 and 1 <= x <= n):
        errs.append(f"{n} items, asked {x}: out of the spec")
        return None
    now = items.index(x) + 1
    check_number(sample, now, errs)
    return "sale" if now > x else "scende" if now < x else "resta"


def level6(sample, text, errs):
    m = re.fullmatch(NAME + r" prepara una tabella con una riga di intestazione e una riga per ciascun[oa] de(?:i|lle) \$(\d+)\$ \w+; le colonne sono \$(\d+)\$\. Quante celle ha la tabella\?", text)
    if m:
        rows, cols = int(m.group(2)) + 1, int(m.group(3))
        check_number(sample, rows * cols, errs)
        return "intestazione"
    m = re.fullmatch(r"Una tabella di " + NAME + r" ha \$(\d+)\$ righe e \$(\d+)\$ colonne\. \1 unisce in una sola cella \$(\d+)\$ celle vicine della prima riga\. Quante celle ha ora la tabella\?", text)
    if not m:
        errs.append(f"level 6 text not recognised: {text!r}")
        return None
    rows, cols, merged = int(m.group(2)), int(m.group(3)), int(m.group(4))
    if not 2 <= merged <= cols:
        errs.append(f"{merged} cells cannot be merged in a row of {cols}")
    check_number(sample, rows * cols - merged + 1, errs)
    return "unione"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


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
