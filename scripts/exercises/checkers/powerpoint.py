"""Checker for powerpoint (specs/exercises/powerpoint.md), lesson "Progettare una presentazione".

Written from the spec; the answer is rebuilt from the pieces of the story:
- level 1: the options are sorted into purpose, bare topic, list, sentence about the speaker with the tables of
  the spec; the purpose must belong to the topic of the story;
- level 2: the time for speaking divided by the minutes per slide, rounded down;
- level 3: the title made of two titles of the outline joined by "e";
- level 4: the slide is classified by its keywords (opening, body, closing, to be removed);
- level 5: the minutes of a point, or the total length;
- level 6: the four titles are found in the table of outlines, which gives their order.
"""
import re
from fractions import Fraction

from checkers._inf_documenti import NAME, check_choice, check_labels, check_number, classify, common, option_text

CASE_RANGES = {
    2: {"esatta": (0.45, 0.68), "resto": (0.32, 0.55)},
    4: {k: (0.18, 0.32) for k in ["apertura", "sviluppo", "chiusura", "tolta"]},
    5: {"punto": (0.40, 0.60), "totale": (0.40, 0.60)},
}

# about what -> (the bare topic, the sentences that state a purpose)
TOPICS = {
    "sulla raccolta differenziata": ("La raccolta differenziata", ["In classe possiamo dimezzare i rifiuti con tre gesti", "Separare bene la carta fa risparmiare la scuola"]),
    "sui vulcani italiani": ("I vulcani italiani", ["I vulcani italiani sono sorvegliati giorno e notte", "Chi vive vicino a un vulcano deve conoscere il piano di emergenza"]),
    "sul sonno": ("Il sonno", ["Dormire abbastanza aiuta a ricordare ciò che si studia", "Il telefono a letto fa dormire peggio"]),
    "sulle api": ("Le api", ["Senza le api avremmo meno frutta", "Un prato fiorito a scuola aiuterebbe le api"]),
    "sull'acqua del rubinetto": ("L'acqua del rubinetto", ["L'acqua del rubinetto costa meno di quella in bottiglia", "Con una borraccia si butta via meno plastica"]),
    "sulla biblioteca della scuola": ("La biblioteca della scuola", ["La biblioteca dovrebbe restare aperta il pomeriggio", "In biblioteca si possono prendere in prestito anche i fumetti"]),
    "sulla bicicletta": ("La bicicletta", ["Venire a scuola in bici è più veloce di quanto si pensi", "Alla scuola serve una rastrelliera per le bici"]),
    "sulle password": ("Le password", ["Una password lunga protegge più di una corta", "Usare la stessa password ovunque è un rischio"]),
    "sugli acquedotti romani": ("Gli acquedotti romani", ["Gli acquedotti romani portavano l'acqua sfruttando la pendenza", "Alcuni acquedotti romani funzionano ancora oggi"]),
    "sul torneo di pallavolo": ("Il torneo di pallavolo", ["Il torneo di pallavolo ha bisogno di dieci volontari", "Per giocare al torneo bisogna iscriversi entro venerdì"]),
}
ABOUT_ME = ["Voglio prendere un bel voto", "Devo parlare per dieci minuti", "Voglio mostrare quanto ho studiato"]
LISTS = ["Tutto quello che so", "Tutte le notizie trovate", "Un elenco di dati"]

PACES = {"un minuto": Fraction(1), "un minuto e mezzo": Fraction(3, 2), "$2$ minuti": Fraction(2), "$3$ minuti": Fraction(3)}

TITLES = {
    "sui vulcani": ["Come nasce un vulcano", "Che cosa esce dal cratere", "I vulcani attivi in Italia", "Come si sorveglia un vulcano", "Che cosa fare in caso di allarme"],
    "sulle api": ["Come vive un alveare", "Che cosa mangiano le api", "Perché le api diminuiscono", "Come nasce il miele", "Che cosa possiamo fare noi"],
    "sul sonno": ["Quante ore dormiamo", "Che cosa succede mentre dormiamo", "Perché il telefono disturba il sonno", "Come dormire meglio", "I sogni"],
    "sull'acqua": ["Da dove arriva la nostra acqua", "Quanto costa un litro dal rubinetto", "Quanta plastica usiamo", "I controlli sull'acqua potabile", "La prova delle borracce"],
    "sulla biblioteca": ["Quanti libri ha la biblioteca", "Chi la usa oggi", "Gli orari di apertura", "Che cosa chiedono gli studenti", "La nostra proposta"],
    "sulla bicicletta": ["Quanti vengono a scuola in bici", "I percorsi più sicuri", "Dove lasciare la bici", "Quanto tempo si risparmia", "Che cosa chiediamo al Comune"],
}

PART_LABELS = {"Nell'apertura": "apertura", "Nello sviluppo": "sviluppo", "Nella chiusura": "chiusura", "In nessuna: va tolta": "tolta"}
PART_RULES = {
    "apertura": ["il titolo della presentazione", "di che cosa si parlerà", "pone la domanda"],
    "sviluppo": ["punti del discorso", "punto del discorso"],
    "chiusura": ["deve ricordare", "le fonti", "da domani"],
    "tolta": ["non hanno a che fare", "non serve allo scopo", "senza aggiungere niente"],
}

# the titles of an outline in their order: title slide, problem, what answers it, what to do
OUTLINES = [
    ["Meno plastica in 1B", "Quante bottigliette buttavamo a ottobre", "Che cosa è cambiato con le borracce", "Che cosa chiediamo alla scuola"],
    ["Una biblioteca aperta anche di pomeriggio", "Oggi la biblioteca chiude alle 13", "Che cosa cambierebbe con due ore in più", "La nostra richiesta al preside"],
    ["A scuola in bicicletta", "Oggi solo tre di noi vengono in bici", "Che cosa cambierebbe con una rastrelliera", "Che cosa chiediamo al Comune"],
    ["Un prato per le api", "Perché le api stanno diminuendo", "Come un prato fiorito le aiuta", "Dove seminarlo nel cortile della scuola"],
    ["Dormire per ricordare", "Quanto dormiamo oggi", "Che cosa cambia con un'ora in più", "Tre abitudini da provare stasera"],
    ["Password a prova di ladro", "Come si indovina una password corta", "Perché una password lunga resiste", "Come cambiare la tua password oggi"],
    ["I vulcani, sorvegliati speciali", "Perché un vulcano è pericoloso", "Come lo si tiene sotto controllo", "Che cosa fare se scatta un allarme"],
    ["Il torneo di pallavolo di maggio", "Come funzionava il torneo fino a oggi", "Che cosa cambia quest'anno", "Come iscriversi entro venerdì"],
]


def low(s):
    return s[0].lower() + s[1:]


def level1(sample, text, errs):
    m = re.fullmatch(NAME + r" prepara una presentazione (.+?), da fare (.+)\. Quale di queste frasi ne dice lo scopo, cioè quello che il pubblico deve ricordare alla fine\?", text)
    if not m or m.group(2) not in TOPICS:
        errs.append(f"level 1 text not recognised: {text!r}")
        return None
    about = m.group(2)
    topic, purposes = TOPICS[about]

    def kind(o):
        s = option_text(o["latex"])
        if s in purposes:
            k = "scopo"
        elif s == topic:
            k = "argomento"
        elif s in ABOUT_ME:
            k = "chi-presenta"
        elif any(s == f"{x} {about}" for x in LISTS):
            k = "elenco"
        else:
            raise ValueError(f"sentence {s!r} is none of the four kinds for this topic")
        if o["values"] != [k]:
            raise ValueError(f"values {o['values']} for a sentence of kind {k}")
        return k

    check_choice(sample["answer"], lambda o: kind(o) == "scopo", errs)
    try:
        if sorted(kind(o) for o in sample["answer"]["options"]) != ["argomento", "chi-presenta", "elenco", "scopo"]:
            errs.append("the options are not one of each kind")
    except ValueError:
        pass
    return "scopo"


def level2(sample, text, errs):
    m = re.fullmatch(
        NAME + r" ha \$(\d+)\$ minuti per la sua presentazione(?:, di cui \$(\d+)\$ vanno lasciati alle domande|, e non sono previste domande)\. "
        r"Dedica (.+?) a ogni slide\. Quante slide prepara al massimo\?",
        text,
    )
    if not m or m.group(4) not in PACES:
        errs.append(f"level 2 text not recognised: {text!r}")
        return None
    total, questions, pace = int(m.group(2)), int(m.group(3) or 0), PACES[m.group(4)]
    speak = total - questions
    slides = speak // pace  # Fraction // Fraction is the floor
    if not 4 <= slides <= 12:
        errs.append(f"{slides} slides: out of the spec")
    check_number(sample, slides, errs)
    return "esatta" if slides * pace == speak else "resto"


def level3(sample, text, errs):
    m = re.fullmatch(NAME_IN_OUTLINE, text)
    if not m or m.group(2) not in TITLES:
        errs.append(f"level 3 text not recognised: {text!r}")
        return None
    titles = TITLES[m.group(2)]
    doubles = {f"{a} e {low(b)}": [a, b] for a in titles for b in titles if a != b}
    used = []

    def is_double(o):
        s = option_text(o["latex"])
        if s in doubles:
            if o["values"] != doubles[s]:
                raise ValueError("values are not the two titles")
            used.extend(doubles[s])
            return True
        if s not in titles or o["values"] != [s]:
            raise ValueError(f"{s!r} is not a title of this outline")
        used.append(s)
        return False

    check_choice(sample["answer"], is_double, errs)
    if len(used) != len(set(used)):
        errs.append("a title is used twice")
    return "due-idee"


NAME_IN_OUTLINE = r"Nella scaletta di " + NAME + r" per la presentazione (.+?) ci sono questi quattro titoli\. Quale contiene più di un'idea e va diviso in due slide\?"


def level4(sample, text, errs):
    m = re.fullmatch(NAME + r" prepara una presentazione (.+?)\. Una slide (.+)\. In quale parte della presentazione sta\?", text)
    if not m or m.group(2) not in TOPICS:
        errs.append(f"level 4 text not recognised: {text!r}")
        return None
    kind = classify(m.group(3), PART_RULES, errs)
    if kind:
        check_labels(sample, PART_LABELS, kind, errs)
    return kind


def level5(sample, text, errs):
    m = re.fullmatch(
        NAME + r" ha \$(\d+)\$ minuti per la sua presentazione: ne dedica \$(\d+)\$ all'apertura e \$(\d+)\$ alla chiusura\. "
        r"Lo sviluppo ha \$(\d+)\$ punti, tutti della stessa durata\. Quanti minuti dura ogni punto\?",
        text,
    )
    if m:
        total, opening, closing, points = (int(m.group(i)) for i in (2, 3, 4, 5))
        each = Fraction(total - opening - closing, points)
        if each.denominator != 1:
            errs.append("the minutes of a point are not whole")
        check_number(sample, each, errs)
        return "punto"
    m = re.fullmatch(
        r"Nella presentazione di " + NAME + r" l'apertura dura \$(\d+)\$ minut[oi] e la chiusura \$(\d+)\$\. "
        r"Lo sviluppo ha \$(\d+)\$ punti di \$(\d+)\$ minuti ciascuno\. Quanti minuti dura la presentazione\?",
        text,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {text!r}")
        return None
    opening, closing, points, each = (int(m.group(i)) for i in (2, 3, 4, 5))
    check_number(sample, opening + closing + points * each, errs)
    return "totale"


def level6(sample, text, errs):
    m = re.fullmatch(
        NAME + r' ha scritto i titoli di quattro slide, alla rinfusa\. A: "(.+?)"\. B: "(.+?)"\. C: "(.+?)"\. D: "(.+?)"\. '
        r"In quale ordine vanno nella scaletta, dall'apertura alla chiusura\?",
        text,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {text!r}")
        return None
    letter = {m.group(i + 2): "ABCD"[i] for i in range(4)}
    outline = [o for o in OUTLINES if set(o) == set(letter)]
    if len(outline) != 1:
        errs.append("the four titles are not one outline of the spec")
        return None
    right = ", ".join(letter[t] for t in outline[0])

    def order(o):
        s = option_text(o["latex"])
        if sorted(s.split(", ")) != list("ABCD") or o["values"] != [s]:
            raise ValueError(f"{s!r} is not an order of the four letters")
        return s

    check_choice(sample["answer"], lambda o: order(o) == right, errs)
    return "ordine"


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
    if sample["answer"].get("kind") == "choice" and sample.get("solution") != sample["answer"]["options"][sample["answer"].get("correct", 0)]["latex"]:
        errs.append("solution is not the right option")
    return errs, kind
