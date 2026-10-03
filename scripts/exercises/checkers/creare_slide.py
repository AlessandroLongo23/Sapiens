"""Checker for creare-slide (specs/exercises/creare-slide.md), lesson "Slide efficaci: testo, immagini e grafici".

Written from the spec; the answer is rebuilt from the pieces of the story:
- levels 1 and 2: lines, points and the two colours of each slide are read and judged with the three rules of the
  lesson (at most 6 lines, at least 24 points, one light and one dark colour);
- level 3: the option that shows the idea comes from the table of the spec; the others are sorted into whole table,
  chart with everything, decoration;
- level 4: the side of the screen times the share of the slide;
- level 5: the job is classified by its keywords (master, single slide, animation, transition);
- level 6: the origin of the image is classified by its keywords (own work, CC BY licence, permission needed).
"""
import re
from fractions import Fraction

from checkers._inf_documenti import NAME, check_choice, check_labels, check_number, classify, common, option_text

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in ["righe", "punti", "contrasto", "nessuna"]},
    4: {"larghezza": (0.40, 0.60), "altezza": (0.40, 0.60)},
    5: {k: (0.18, 0.32) for k in ["schema", "slide", "animazione", "transizione"]},
    6: {k: (0.25, 0.42) for k in ["propria", "licenza", "permesso"]},
}

SHADE = {"bianco": "chiaro", "giallo chiaro": "chiaro", "celeste": "chiaro", "grigio chiaro": "chiaro", "nero": "scuro", "blu scuro": "scuro", "verde scuro": "scuro", "grigio scuro": "scuro"}
RULES = r"\$6\$ righe di testo al massimo, almeno \$24\$ punti, testo e sfondo uno chiaro e uno scuro"
FLAW_LABELS = {"Troppe righe di testo": "righe", "Caratteri troppo piccoli": "punti", "Contrasto insufficiente": "contrasto", "Nessuna: le rispetta tutte": "nessuna"}


def flaws(lines, points, text, back):
    """The rules a slide breaks."""
    out = []
    if lines > 6:
        out.append("righe")
    if points < 24:
        out.append("punti")
    if SHADE[text] == SHADE[back]:
        out.append("contrasto")
    return out


def level1(sample, text, errs):
    m = re.fullmatch(r"Una slide di " + NAME + r" ha il titolo e \$(\d+)\$ righe di testo di \$(\d+)\$ punti, (.+?) su sfondo (.+?)\. Le regole: " + RULES + r"\. Quale regola non rispetta\?", text)
    if not m or m.group(4) not in SHADE or m.group(5) not in SHADE:
        errs.append(f"level 1 text not recognised: {text!r}")
        return None
    broken = flaws(int(m.group(2)), int(m.group(3)), m.group(4), m.group(5))
    if len(broken) > 1:
        errs.append(f"the slide breaks {len(broken)} rules: {broken}")
        return None
    kind = broken[0] if broken else "nessuna"
    check_labels(sample, FLAW_LABELS, kind, errs)
    return kind


def level2(sample, text, errs):
    m = re.fullmatch(NAME + r" confronta quattro slide\. Quale rispetta tutte e tre le regole: " + RULES + r"\?", text)
    if not m:
        errs.append(f"level 2 text not recognised: {text!r}")
        return None
    broken = []

    def read(o):
        mm = re.fullmatch(r"(\d+) righe, (\d+) punti, (.+) su (.+)", option_text(o["latex"]))
        lines, points, colour, back = int(mm.group(1)), int(mm.group(2)), mm.group(3), mm.group(4)
        if o["values"] != [f"{lines}|{points}|{colour}|{back}"]:
            raise ValueError("values do not match the text")
        f = flaws(lines, points, colour, back)
        broken.append(tuple(f))
        return not f

    check_choice(sample["answer"], read, errs)
    if sorted(broken) != [(), ("contrasto",), ("punti",), ("righe",)]:
        errs.append(f"the slides should break no rule, and one rule each of the three: {sorted(broken)}")
    if sample.get("solution") != sample["answer"]["options"][sample["answer"].get("correct", 0)]["latex"]:
        errs.append("solution is not the right option")
    return "una-sola"


# the idea of the slide -> what shows it
IDEAS = {
    "In un mese le bottigliette buttate sono dimezzate": "Un grafico con due barre: ottobre e novembre",
    "La biblioteca è più frequentata il mercoledì": "Un grafico a barre dei giorni, con il mercoledì colorato",
    "Metà della classe viene a scuola a piedi": "Un grafico a torta con la fetta di chi viene a piedi colorata",
    "Il cratere dell'Etna è a più di tremila metri": "Una foto grande del cratere, con la quota scritta sopra",
    "Il torneo si gioca sabato in palestra": "Una foto grande della palestra, con il giorno scritto sopra",
    "Dalla prima alla terza le ore di sonno calano": "Un grafico con tre barre: prima, seconda, terza",
    "La mensa butta un terzo del pane": "Una foto grande del pane avanzato in un giorno",
    "Una password corta si indovina in fretta": "Un grafico con due barre: password corta e password lunga",
}
DECORATIONS = ["La foto di un tramonto sul mare", "Il disegno di un gufo con gli occhiali", "Il disegno di un razzo che decolla", "Il disegno di una stretta di mano", "Il disegno di una lampadina accesa", "La foto di un cielo stellato", "Una cornice di fiori colorati", "Il disegno di un omino che pensa"]


def level3(sample, text, errs):
    m = re.fullmatch(r'Il titolo di una slide di ' + NAME + r' è "(.+)"\. Che cosa conviene mettere sotto il titolo\?', text)
    if not m or m.group(2) not in IDEAS:
        errs.append(f"level 3 text not recognised: {text!r}")
        return None
    shows = IDEAS[m.group(2)]

    def kind(o):
        s = option_text(o["latex"])
        if s == shows:
            k = "idea"
        elif s.startswith("La tabella "):
            k = "tabella"
        elif s.startswith("Un grafico ") and " per ogni " in s:
            k = "tutto"
        elif s in DECORATIONS:
            k = "decorazione"
        else:
            raise ValueError(f"{s!r} is none of the four kinds for this slide")
        if o["values"] != [k]:
            raise ValueError(f"values {o['values']} for an option of kind {k}")
        return k

    check_choice(sample["answer"], lambda o: kind(o) == "idea", errs)
    try:
        if sorted(kind(o) for o in sample["answer"]["options"]) != ["decorazione", "idea", "tabella", "tutto"]:
            errs.append("the options are not one of each kind")
    except ValueError:
        pass
    if sample.get("solution") != sample["answer"]["options"][sample["answer"].get("correct", 0)]["latex"]:
        errs.append("solution is not the right option")
    return "idea"


SCREENS = [(1280, 720), (1920, 1080), (2560, 1440), (3840, 2160)]
SHARES = {"tutta la": Fraction(1), "metà della": Fraction(1, 2), "un terzo della": Fraction(1, 3), "un quarto della": Fraction(1, 4), "due terzi della": Fraction(2, 3), "tre quarti della": Fraction(3, 4)}


def level4(sample, text, errs):
    m = re.fullmatch(
        r"Lo schermo su cui " + NAME + r" proietta ha \$(\d+)\$ pixel in larghezza e \$(\d+)\$ in altezza\. .+? deve occupare (.+?) (larghezza|altezza) della slide\. "
        r"Quanti pixel di (larghezza|altezza) deve avere almeno, per non essere ingrandita\?",
        text,
    )
    if not m or m.group(4) not in SHARES:
        errs.append(f"level 4 text not recognised: {text!r}")
        return None
    w, h, dim = int(m.group(2)), int(m.group(3)), m.group(5)
    if (w, h) not in SCREENS:
        errs.append(f"screen {w} x {h} is not in the spec")
    if m.group(6) != dim:
        errs.append("the question asks the other dimension")
    need = (w if dim == "larghezza" else h) * SHARES[m.group(4)]
    if need.denominator != 1:
        errs.append(f"{need} pixels: not a whole number")
        return None
    check_number(sample, need, errs)
    return dim


TOOL_LABELS = {"Sullo schema delle diapositive": "schema", "Sulla singola slide": "slide", "Su un'animazione": "animazione", "Su una transizione": "transizione"}
TOOL_RULES = {
    "schema": ["tutte le slide", "tutta la presentazione"],
    "slide": ["quarta slide", "terza slide", "ultima slide"],
    "animazione": ["uno alla volta", "solo quando ne parla", "solo dopo un clic"],
    "transizione": ["da una slide alla successiva", "in quella che viene dopo", "a ogni cambio di slide"],
}


def level5(sample, text, errs):
    m = re.fullmatch(NAME + r" prepara una presentazione (.+?) e vuole (.+)\. Su che cosa lavora\?", text)
    if not m:
        errs.append(f"level 5 text not recognised: {text!r}")
        return None
    kind = classify(m.group(3), TOOL_RULES, errs)
    if kind:
        check_labels(sample, TOOL_LABELS, kind, errs)
    return kind


USE_LABELS = {"Sì, senza chiedere: è opera sua": "propria", "Sì, citando autore e licenza": "licenza", "Solo con il permesso dell'autore": "permesso", "Sì: è in rete, quindi è di tutti": "rete"}
USE_RULES = {
    "propria": ["da sé"],
    "licenza": ["licenza CC BY", "Creative Commons CC BY"],
    "permesso": ["tutti i diritti riservati", "non indica alcuna licenza", "non ne permette il riuso"],
}


def level6(sample, text, errs):
    m = re.fullmatch(r"Per la sua presentazione " + NAME + r" vuole usare (.+?), (.+)\. Può usarla\?", text)
    if not m:
        errs.append(f"level 6 text not recognised: {text!r}")
        return None
    kind = classify(m.group(3), USE_RULES, errs)
    if kind:
        check_labels(sample, USE_LABELS, kind, errs)
    return kind


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
