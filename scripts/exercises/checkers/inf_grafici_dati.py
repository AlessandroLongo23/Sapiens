"""Checker for inf-grafici-dati (specs/exercises/inf-grafici-dati.md).

Written from the spec, not from the generator. The situations are made of pieces; `params` names the pieces, this
file has its own table of them (what the data are, which chart they call for, which defect a chart has), checks that
the piece named is the one written in the problem, and rebuilds the answer from the table:
- level 1: the table of the problem is read back; series are its number columns, categories its rows;
- level 2: the data piece and the purpose must call for the same chart, which is the answer;
- level 3: the data piece and the chart used give the defect (or none);
- level 4: the two values and the start of the axis are read from the text and the ratio of the drawn heights, or
  the real percentage, is computed.
"""
import re
from fractions import Fraction

from checkers._inf_foglio_dati import check_choice, check_number, common, option_value, parse_problem, plain, shape

CASE_RANGES = {
    1: {k: (0.10, 0.24) for k in ["serie", "categorie", "colonne", "legenda", "asse", "altezza"]},
    2: {k: (0.18, 0.32) for k in ["colonne", "linee", "torta", "dispersione"]},
    3: {k: (0.18, 0.32) for k in ["non-totale", "troppe-fette", "senza-ordine", "nessuno"]},
    4: {"apparente": (0.48, 0.72), "reale": (0.28, 0.52)},
}

NAMES = ["Anna", "Luca", "Sara", "Marco", "Giulia", "Paolo", "Elena", "Davide", "Chiara", "Pietro", "Irene", "Matteo", "Marta", "Simone", "Nadia", "Omar"]

# What the data of level 2 are, by piece: (chart they call for, the words that say it, how many).
# colonne: values of separate categories to compare; linee: one quantity at successive times; torta: the few parts
# of a total; dispersione: two quantities measured on each case.
DATA = {
    "c1": ("colonne", "il numero di iscritti a # corsi pomeridiani della scuola", (3, 8)),
    "c2": ("colonne", "i punti finali delle # squadre di un torneo", (3, 8)),
    "c3": ("colonne", "i libri presi in prestito in un mese da # classi", (3, 8)),
    "c4": ("colonne", "le calorie di # merendine diverse", (3, 8)),
    "c5": ("colonne", "l'altezza di # montagne italiane", (3, 8)),
    "c6": ("colonne", "il prezzo dello stesso zaino in # negozi", (3, 8)),
    "c7": ("colonne", "il numero di abitanti di # città della regione", (3, 8)),
    "c8": ("colonne", "i gol segnati in una stagione da # giocatori", (3, 8)),
    "l1": ("linee", "la temperatura esterna misurata ogni ora per # ore", (6, 60)),
    "l2": ("linee", "l'altezza di una pianta misurata ogni settimana per # settimane", (6, 60)),
    "l3": ("linee", "il numero di visitatori di un museo in ognuno degli ultimi # mesi", (6, 60)),
    "l4": ("linee", "il prezzo della benzina rilevato ogni lunedì per # settimane", (6, 60)),
    "l5": ("linee", "i passi contati dal telefono in ognuno degli ultimi # giorni", (6, 60)),
    "l6": ("linee", "il livello di un fiume misurato ogni giorno per # giorni", (6, 60)),
    "l7": ("linee", "gli iscritti alla scuola in ognuno degli ultimi # anni", (6, 60)),
    "l8": ("linee", "la carica della batteria del telefono letta ogni mezz'ora per # ore", (6, 60)),
    "t1": ("torta", "la paghetta del mese divisa in # voci di spesa", (3, 5)),
    "t2": ("torta", "gli studenti della classe divisi tra # mezzi per venire a scuola", (3, 5)),
    "t3": ("torta", "le 24 ore di una giornata divise tra # attività", (3, 5)),
    "t4": ("torta", "i voti dell'elezione dei rappresentanti divisi tra # candidati", (3, 5)),
    "t5": ("torta", "la memoria occupata del telefono divisa tra # tipi di file", (3, 5)),
    "t6": ("torta", "il costo di una gita diviso tra # voci di spesa", (3, 5)),
    "d1": ("dispersione", "le ore di studio e il voto della verifica di # compagni", (8, 50)),
    "d2": ("dispersione", "l'altezza e il numero di scarpe di # persone", (8, 50)),
    "d3": ("dispersione", "la potenza e il consumo di # modelli di auto", (8, 50)),
    "d4": ("dispersione", "la temperatura e il numero di gelati venduti in # giorni diversi", (8, 50)),
    "d5": ("dispersione", "la massa appesa e l'allungamento di una molla in # prove", (8, 50)),
    "d6": ("dispersione", "la superficie e il prezzo di # appartamenti", (8, 50)),
}

PURPOSES = {
    "colonne": ["Vuole confrontare i valori tra loro.", "Vuole far vedere a colpo d'occhio chi ha il valore più grande e chi il più piccolo."],
    "linee": ["Vuole mostrare come cambia il valore con il passare del tempo.", "Vuole far vedere l'andamento nel tempo: quando sale e quando scende."],
    "torta": ["Vuole mostrare quanto pesa ogni parte sul totale.", "Vuole far vedere che parte del totale spetta a ogni voce."],
    "dispersione": ["Vuole capire se le due grandezze sono legate tra loro.", "Vuole vedere se, quando cresce una grandezza, cresce anche l'altra."],
}

# The data of level 3, by piece: what kind of data they are.
#   'valori': values of separate categories that are not parts of a total (a pie is wrong, a line is wrong)
#   'parti': the parts of a total (a pie is right if the slices are few, at most 6; wrong from 12 on)
#   'tempo': one quantity at successive times (a line is right)
KIND3 = {
    "n1": ("valori", "la temperatura massima di # città in un giorno d'estate"),
    "n2": ("valori", "l'altezza di # compagni di classe"),
    "n3": ("valori", "il prezzo di # modelli di telefono"),
    "n4": ("valori", "il voto medio di # classi nella stessa verifica"),
    "n5": ("valori", "la velocità massima di # automobili"),
    "n6": ("valori", "la durata della batteria di # telefoni"),
    "f1": ("parti", "le vendite di una gelateria divise tra # gusti"),
    "f2": ("parti", "gli studenti di una scuola divisi tra le sue # classi"),
    "f3": ("parti", "la spesa dell'anno di una famiglia divisa tra # voci"),
    "f4": ("parti", "gli abitanti di una provincia divisi tra i suoi # comuni"),
    "f5": ("parti", "i libri di una biblioteca divisi tra # generi"),
    "s1": ("valori", "il numero di studenti che preferiscono ciascuno di # sport"),
    "s2": ("valori", "i punti finali delle # squadre di un torneo"),
    "s3": ("valori", "il numero di abitanti di # città"),
    "s4": ("valori", "i gelati venduti in un giorno per ciascuno di # gusti"),
    "s5": ("valori", "il prezzo dello stesso zaino in # negozi"),
    "s6": ("valori", "le calorie di # merendine diverse"),
    "k1": ("parti", "gli studenti di una classe divisi tra # mezzi per venire a scuola"),
    "k2": ("tempo", "la temperatura esterna misurata ogni ora per # ore"),
    "k3": ("valori", "i punti finali delle # squadre di un torneo"),
    "k4": ("parti", "la paghetta del mese divisa in # voci di spesa"),
    "k5": ("tempo", "gli iscritti alla scuola in ognuno degli ultimi # anni"),
    "k6": ("valori", "il prezzo di # modelli di telefono"),
    "k7": ("valori", "la temperatura massima di # città in un giorno d'estate"),
    "k8": ("tempo", "il livello di un fiume misurato ogni giorno per # giorni"),
}

DEFECTS = {
    "non-totale": "Torta, ma i dati non sono parti di un totale",
    "troppe-fette": "Torta con troppe fette",
    "senza-ordine": "Linea tra categorie senza ordine",
    "nessuno": "Nessun difetto",
}


def defect_of(kind, chart, n):
    """The defect of `chart` used for data of a kind with n items; None when the spec does not say."""
    if chart == "torta":
        if kind == "valori":
            return "non-totale"
        if kind == "parti":
            return "nessuno" if n <= 6 else "troppe-fette" if n >= 12 else None
        return None
    if chart == "linee":
        return "nessuno" if kind == "tempo" else "senza-ordine" if kind == "valori" else None
    if chart == "colonne":
        return "nessuno" if kind == "valori" else None
    return None


def level1(sample, errs):
    items = parse_problem(sample["problem"])
    if shape(items) != ["text", "sheet", "text"]:
        errs.append(f"layout {shape(items)}")
        return None
    sheet = items[1][1]
    ns, nc = len(sheet.header) - 1, len(sheet.rows)
    if not (2 <= ns <= 3 and 3 <= nc <= 5):
        errs.append(f"{ns} series and {nc} categories: 2-3 and 3-5 expected")
    numbers = [c for r in sheet.rows for c in r[1:]]
    if not all(isinstance(c, int) for c in numbers) or len(set(numbers)) != len(numbers):
        errs.append("the numbers of the table must be whole and all different")
        return None
    if not all(3 <= c <= 30 for c in numbers):
        errs.append("the numbers of the table must be from 3 to 30")
    cats = [r[0] for r in sheet.rows]
    series = sheet.header[1:]
    if len(set(cats)) != nc or not all(isinstance(c, str) for c in cats):
        errs.append("categories must be different texts")
    last = "ABCD"[ns] + str(nc + 1)
    text = plain(items[2][1])
    intro = f"Con le celle da A1 a {last} si crea un grafico a colonne: la colonna A dà le categorie e ogni altra colonna del foglio è una serie di dati. "
    if not text.startswith(intro):
        errs.append(f"the chart is not described as the spec says: {text!r}")
        return None
    q = text[len(intro):]
    if q == "Quante serie di dati ha il grafico?":
        check_number(sample, ns, errs)
        return "serie"
    if q == "Quante categorie ci sono sull'asse orizzontale?":
        check_number(sample, nc, errs)
        return "categorie"
    if q == "Quante colonne vengono disegnate in tutto nel grafico?":
        check_number(sample, ns * nc, errs)
        return "colonne"
    m = re.fullmatch(r"A quale valore arriva, sull'asse verticale, la colonna della serie (.+?) per la categoria (.+?)\?", q)
    if m:
        if m.group(1) not in series or m.group(2) not in cats:
            errs.append("the series or the category asked is not in the table")
            return None
        check_number(sample, sheet.rows[cats.index(m.group(2))][1 + series.index(m.group(1))], errs)
        return "altezza"
    if q in ("Quali nomi compaiono nella legenda del grafico?", "Quali etichette compaiono lungo l'asse orizzontale?"):
        legend = "legenda" in q
        right = ", ".join(series if legend else cats)
        check_choice(sample["answer"], lambda o: option_value(o) == ("text", right), errs)
        return "legenda" if legend else "asse"
    errs.append(f"question not recognised: {q!r}")
    return None


def piece_text(template, n):
    return template.replace("#", str(n))


def level2(sample, errs):
    items = parse_problem(sample["problem"])
    if shape(items) != ["text"]:
        errs.append("level 2 is prose only")
        return None
    text = plain(items[0][1])
    p = sample["params"]
    if p.get("data") not in DATA:
        errs.append(f"unknown data piece {p.get('data')!r}")
        return None
    chart, template, (lo, hi) = DATA[p["data"]]
    n = p.get("n")
    if not isinstance(n, int) or not lo <= n <= hi:
        errs.append(f"{n} items for a {chart} piece: from {lo} to {hi} expected")
    m = re.fullmatch(r"(\w+) ha raccolto in un foglio di calcolo (.+?)\. (Vuole .+?\.) Quale grafico è il più adatto\?", text)
    if not m:
        errs.append(f"level 2 text not recognised: {text!r}")
        return None
    if m.group(1) not in NAMES:
        errs.append(f"unknown name {m.group(1)!r}")
    if m.group(2) != piece_text(template, n):
        errs.append("the data written are not the piece named in params")
    if m.group(3) not in PURPOSES[chart]:
        errs.append(f"the purpose {m.group(3)!r} is not one of a {chart} chart")
    names = {f"Grafico a {c}" for c in PURPOSES}
    got = {option_value(o)[1] for o in sample["answer"]["options"]}
    if got != names:
        errs.append(f"options {got}: the four charts expected")
    check_choice(sample["answer"], lambda o: option_value(o) == ("text", f"Grafico a {chart}"), errs)
    return chart


def level3(sample, errs):
    items = parse_problem(sample["problem"])
    if shape(items) != ["text"]:
        errs.append("level 3 is prose only")
        return None
    text = plain(items[0][1])
    p = sample["params"]
    if p.get("data") not in KIND3:
        errs.append(f"unknown data piece {p.get('data')!r}")
        return None
    kind, template = KIND3[p["data"]]
    n = p.get("n")
    m = re.fullmatch(r"(\w+) ha rappresentato con un grafico a (torta|linee|colonne) (.+?)\. Qual è il difetto del grafico\?", text)
    if not m or not isinstance(n, int):
        errs.append(f"level 3 text not recognised: {text!r}")
        return None
    if m.group(1) not in NAMES:
        errs.append(f"unknown name {m.group(1)!r}")
    if m.group(3) != piece_text(template, n):
        errs.append("the data written are not the piece named in params")
    defect = defect_of(kind, m.group(2), n)
    if defect is None:
        errs.append(f"{kind} data with {n} items in a {m.group(2)} chart: the spec gives no verdict")
        return None
    got = {option_value(o)[1] for o in sample["answer"]["options"]}
    if got != set(DEFECTS.values()):
        errs.append(f"options {got}: the three defects and 'Nessun difetto' expected")
    for o in sample["answer"]["options"]:
        if DEFECTS.get(o["values"][0]) != option_value(o)[1]:
            errs.append(f"option {o['latex']!r}: values do not match the text")
    check_choice(sample["answer"], lambda o: option_value(o) == ("text", DEFECTS[defect]), errs)
    return defect


def level4(sample, errs):
    items = parse_problem(sample["problem"])
    if shape(items) != ["text"]:
        errs.append("level 4 is prose only")
        return None
    text = plain(items[0][1])
    m = re.fullmatch(
        r"Un grafico a colonne confronta (.+?): (\S+) ha (\d+) e (\S+) ha (\d+)\. L'asse verticale non parte da zero, ma da (\d+)\. "
        r"(?:Sul grafico, quante volte la colonna di (\S+) è alta rispetto a quella di (\S+)\?"
        r"|Sul grafico la colonna di (\S+) è alta (\d+) volte quella di (\S+)\. Di quale percentuale il valore di (\S+) supera davvero quello di (\S+)\?)",
        text,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {text!r}")
        return None
    small, v1, big, v2, a = m.group(2), int(m.group(3)), m.group(4), int(m.group(5)), int(m.group(6))
    if not 0 < a < v1 < v2:
        errs.append(f"axis from {a}, values {v1} and {v2}: 0 < start < smaller < larger expected")
        return None
    ratio = Fraction(v2 - a, v1 - a)
    percent = Fraction(100 * (v2 - v1), v1)
    if ratio.denominator != 1 or not 2 <= ratio <= 6:
        errs.append(f"drawn heights in the ratio {ratio}: a whole number from 2 to 6 expected")
    if percent.denominator != 1 or percent > 50:
        errs.append(f"real difference {percent} per cent: a whole number up to 50 expected")
    if m.group(7):
        if (m.group(7), m.group(8)) != (big, small):
            errs.append("the question swaps the two columns")
        check_number(sample, int(ratio), errs)
        return "apparente"
    if (m.group(9), m.group(11), m.group(12), m.group(13)) != (big, small, big, small) or int(m.group(10)) != ratio:
        errs.append("the question does not match the data")
    check_number(sample, int(percent), errs)
    return "reale"


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample["level"]
    try:
        if lvl == 1:
            kind = level1(sample, errs)
        elif lvl == 2:
            kind = level2(sample, errs)
        elif lvl == 3:
            kind = level3(sample, errs)
        elif lvl == 4:
            kind = level4(sample, errs)
        else:
            return errs + [f"unknown level {lvl}"], None
    except ValueError as e:
        return errs + [f"problem unreadable: {e}"], None
    ans = sample["answer"]
    if ans.get("kind") == "choice" and sample.get("solution") != ans["options"][ans["correct"]]["latex"]:
        errs.append("solution is not the right option")
    return errs, kind
