"""statistica-dati (Dati, frequenze e grafici), from specs/exercises/statistica-dati.md.

Written from the spec, not from the generator. Everything is read back from the text the student sees:
- level 1: the four phrases of the survey (popolazione, campione, unità, carattere) are rebuilt from this
  file's own table and the numbers P and n; the options must be exactly those four, the right one the role
  asked by the prompt;
- level 2: the kind of each character comes from this file's own list; the options are the four kinds;
- level 3: the list of data and the asked modality are parsed from the prose and counted again;
- level 4: the table is read back from the LaTeX, the question ("al massimo", "meno di", "almeno", count or
  percentage) from the prose, and the answer summed again;
- level 5: values, classes and the asked class are parsed from the prose and counted with a <= x < b; a
  value on each boundary of the asked class must be present;
- level 6: the table (frequencies with the total, or percentages) is read back and the angle recomputed;
- level 7: the angles are read back, must add up to 360, N comes from the prose; the answer is
  angle / 360 * N or angle / 360 * 100.
For the number levels the choice must have four distinct options, each written as its value (a count, a
decimal with the comma, a percentage, degrees), with exactly one equal to the truth.
"""
import re
from collections import Counter

from sympy import Rational

CASE_RANGES = {
    1: {r: (0.18, 0.32) for r in ["popolazione", "campione", "unita", "carattere"]},
    2: {k: (0.18, 0.32) for k in ["qualitativo", "ordinato", "discreto", "continuo"]},
    3: {c: (0.26, 0.41) for c in ["assoluta", "relativa", "percentuale"]},
    4: {c: (0.26, 0.41) for c in ["al massimo", "meno di", "almeno"]},
    5: {"assoluta": (0.52, 0.68), "percentuale": (0.32, 0.48)},
    6: {"assolute": (0.40, 0.60), "percentuali": (0.40, 0.60)},
    7: {"assoluta": (0.40, 0.60), "percentuale": (0.40, 0.60)},
}

# ---------------------------------------------------------------------------
# Level 1: key -> (popolazione, campione, unità, carattere); "#" is the article + number.

SURVEYS = {
    "scuola": ("# studenti della scuola", "# studenti estratti", "ogni studente della scuola", "il mezzo di trasporto"),
    "famiglie": ("le P famiglie del comune", "le n famiglie intervistate", "ogni famiglia del comune", "il numero di automobili"),
    "lampadine": ("le P lampadine prodotte", "le n lampadine provate", "ogni lampadina prodotta", "la durata della lampadina"),
    "palestra": ("# iscritti della palestra", "# iscritti scelti", "ogni iscritto della palestra", "gli allenamenti a settimana"),
    "biblioteca": ("# libri della biblioteca", "# libri controllati", "ogni libro della biblioteca", "il numero di prestiti"),
    "automobili": ("le P automobili vendute", "le n automobili scelte", "ogni automobile venduta", "il colore dell'automobile"),
    "lavoratori": ("le P persone che lavorano", "le n persone intervistate", "ogni persona che lavora", "il tempo di viaggio"),
    "frutteto": ("# alberi del frutteto", "# alberi scelti", "ogni albero del frutteto", "il numero di mele"),
    "cinema": ("# spettatori del mese", "# spettatori scelti", "ogni spettatore del mese", "il giudizio sui film"),
    "azienda": ("# dipendenti", "# dipendenti estratti", "ogni dipendente", "il titolo di studio"),
    "ospedale": ("# bambini nati", "# bambini scelti", "ogni bambino nato", "il peso alla nascita"),
    "supermercato": ("# scontrini", "# scontrini esaminati", "ogni scontrino", "l'importo dello scontrino"),
}
ROLES = ["popolazione", "campione", "unita", "carattere"]
QUESTION = {
    "popolazione": "popolazione",
    "campione": "campione",
    "unita": "unità statistica",
    "carattere": "carattere osservato",
}


def article(n):
    """'gli' before a number read with a vowel (otto..., undici...), 'i' otherwise."""
    s = str(n)
    return "gli" if s.startswith("8") or s.startswith("11") else "i"


def survey_phrases(key, P, n):
    pop, camp, unit, car = SURVEYS[key]
    pop = pop.replace("#", f"{article(P)} {P}").replace(" P ", f" {P} ")
    camp = camp.replace("#", f"{article(n)} {n}").replace(" n ", f" {n} ")
    return {"popolazione": pop, "campione": camp, "unita": unit, "carattere": car}


# ---------------------------------------------------------------------------
# Level 2: character -> kind, as the lesson classifies it.

QUAL = [
    "il colore degli occhi", "lo sport preferito", "il mezzo con cui arriva a scuola", "la materia preferita",
    "il numero di maglia nella squadra di calcio", "il gruppo sanguigno", "la lingua straniera che studia",
    "il numero di cellulare", "il CAP di casa", "il tipo di riscaldamento della casa",
    "la compagnia che fornisce la luce", "il colore", "la marca", "il tipo di carburante", "la targa",
    "il tempo atmosferico (sole, nuvole, pioggia)", "il ruolo in campo", "il numero di maglia", "la squadra",
    "il piede preferito", "la nazionalità", "il reparto in cui viene ricoverato",
    "il genere (romanzo, saggio, poesia)", "la lingua", "il codice ISBN", "il sistema operativo", "il CAP",
    "lo stato civile", "il prefisso telefonico", "il numero della camera",
]
ORD = [
    "il giudizio nell'ultima verifica (insufficiente, sufficiente, buono, ottimo)",
    "il livello di inglese (base, intermedio, avanzato)", "la taglia della maglietta (S, M, L, XL)",
    "quanto gli piace leggere (poco, abbastanza, molto)",
    "il titolo di studio più alto in famiglia (licenza media, diploma, laurea)",
    "la classe energetica della casa (A, B, C, D, E)", "il livello di allerta meteo (verde, giallo, arancione, rosso)",
    "il livello di dolore (lieve, moderato, forte)", "la gravità (lieve, media, grave)",
    "la fascia di prezzo (bassa, media, alta)", "il giudizio dei clienti (scarso, buono, ottimo)",
    "il titolo di studio (licenza media, diploma, laurea)",
    "il giudizio sul soggiorno (scarso, sufficiente, buono, ottimo)",
]
DISC = [
    "il numero di fratelli", "il numero di libri letti in un anno", "il numero di assenze nel primo quadrimestre",
    "il numero di animali in casa", "il numero di messaggi inviati ieri", "il numero di componenti",
    "il numero di automobili", "il numero di stanze della casa", "il numero di televisori", "il numero di porte",
    "il numero di posti", "il numero di clienti di un negozio", "il numero di incidenti in città",
    "il numero di chiamate a un centralino", "il numero di treni in ritardo", "il numero di gol segnati",
    "il numero di partite giocate", "il numero di cartellini gialli", "il numero di esami fatti",
    "il numero di visite nell'ultimo anno", "il numero di pagine", "il numero di prestiti in un anno",
    "il numero di capitoli", "il numero di fotocamere", "il numero di app installate", "il numero di figli",
    "il numero di viaggi fatti in un anno", "il numero di notti", "il numero di persone in camera",
]
CONT = [
    "l'altezza", "il peso", "il tempo sui 100 metri", "il tempo per arrivare a scuola", "la lunghezza del piede",
    "la superficie della casa", "l'acqua consumata in un anno", "la distanza della casa dal centro", "la lunghezza",
    "la velocità massima", "il consumo di carburante", "la temperatura massima", "la pioggia caduta",
    "la velocità massima del vento", "la distanza percorsa in una partita", "la temperatura corporea",
    "il tempo di attesa", "la pressione del sangue", "lo spessore", "la durata della batteria",
    "la diagonale dello schermo", "il tempo passato al telefono in un giorno", "la distanza percorsa per arrivare",
]
KIND_OF = {**{c: "qualitativo" for c in QUAL}, **{c: "ordinato" for c in ORD}, **{c: "discreto" for c in DISC}, **{c: "continuo" for c in CONT}}
NOT_QUANTITIES = {"il numero di maglia nella squadra di calcio", "il numero di cellulare", "il CAP di casa", "la targa", "il numero di maglia", "il codice ISBN", "il CAP", "il prefisso telefonico", "il numero della camera"}
KIND_TEXT = {
    "qualitativo": r"\text{qualitativo senza ordine}",
    "ordinato": r"\text{qualitativo con un ordine}",
    "discreto": r"\text{quantitativo discreto}",
    "continuo": r"\text{quantitativo continuo}",
}

# Levels 6 and 7: modality -> "di" + article, as the question names the sector.
PREP = {
    "calcio": "del calcio", "pallavolo": "della pallavolo", "basket": "del basket", "nuoto": "del nuoto", "tennis": "del tennis",
    "autobus": "dell'autobus", "auto": "dell'auto", "bici": "della bici", "treno": "del treno", "scooter": "dello scooter",
    "cioccolato": "del cioccolato", "fragola": "della fragola", "limone": "del limone", "pistacchio": "del pistacchio", "nocciola": "della nocciola",
    "pop": "del pop", "rock": "del rock", "rap": "del rap", "jazz": "del jazz", "classica": "della classica",
    "cane": "del cane", "gatto": "del gatto", "pesci": "dei pesci", "coniglio": "del coniglio", "criceto": "del criceto",
}

# ---------------------------------------------------------------------------
# Reading the LaTeX back

TEXT = re.compile(r"\\text\{((?:[^{}]|\{[^{}]*\})*)\}")
INNER = re.compile(r"\\begin\{array\}\{l\|c\}(.*?)\\end\{array\}", re.S)


def prose_of(problem):
    """The prose of the problem (all \\text groups outside the table, joined), and the table if any."""
    m = INNER.search(problem)
    tab = m.group(1) if m else None
    rest = INNER.sub(" ", problem)
    words = " ".join(TEXT.findall(rest))
    return re.sub(r"\s+", " ", words).strip(), tab


def cell(s):
    s = s.strip()
    m = TEXT.fullmatch(s)
    if m:
        return m.group(1)
    return s.replace(r"\%", "").replace(r"^\circ", "").strip()


def read_table(tab):
    """Header, rows and total ('' if none) of a two-column table."""
    parts = [r for r in re.split(r"\\\\", tab.replace(r"\hline", "")) if r.strip()]
    rows = [[cell(c) for c in r.split("&")] for r in parts]
    for r in rows:
        if len(r) != 2:
            raise ValueError(f"row with {len(r)} cells")
    head, body = rows[0], rows[1:]
    total = None
    if body and body[-1][0] == "Totale":
        total = body[-1][1]
        body = body[:-1]
    return head, body, total


def unmath(s):
    """Prose with $…$ removed around plain numbers and symbols."""
    return re.sub(r"\$([^$]*)\$", r"\1", s)


# ---------------------------------------------------------------------------
# Options

def value_latex(unit, r):
    """How an option writes its value: 7, 0{,}45, 45\\%, 126^\\circ."""
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 6:
            raise ValueError(f"{r} is not a finite decimal")
    digits = str(abs(int(r * 10**k))).rjust(k + 1, "0")
    s = ("-" if r < 0 else "") + (digits[:-k] + "{,}" + digits[-k:] if k else digits)
    return {"count": s, "rel": s, "pct": s + r"\%", "deg": s + r"^\circ"}[unit]


def valid(unit, r):
    if r <= 0:
        return False
    if unit == "count":
        return r.is_integer
    if unit == "rel":
        return r < 1 and (r * 1000).is_integer
    if unit == "pct":
        return r < 100 and r.is_integer
    return r < 360 and r.is_integer


def check_number_choice(sample, unit, truth):
    errs = []
    ch = sample.get("choice")
    if not ch:
        return ["no choice"]
    opts = ch["options"]
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    vals = []
    for o in opts:
        try:
            r = Rational(o["values"][0])
        except Exception:  # noqa: BLE001
            errs.append(f"bad option value {o['values']}")
            continue
        vals.append(r)
        if not valid(unit, r):
            errs.append(f"option {r} not a valid {unit}")
        elif o["latex"] != value_latex(unit, r):
            errs.append(f"option latex {o['latex']!r} does not say {r}")
    if len(set(vals)) != len(vals) or len({o["latex"] for o in opts}) != len(opts):
        errs.append("options not distinct")
    hits = [i for i, r in enumerate(vals) if r == truth]
    if len(hits) != 1:
        errs.append(f"{len(hits)} options equal the truth {truth}")
    elif ch.get("correct") != hits[0]:
        errs.append("choice.correct is wrong")
    return errs


def check_answer(sample, unit, truth):
    errs = []
    a = sample["answer"]
    if a.get("kind") != "number":
        return ["answer is not a number"]
    if Rational(a["value"]) != truth:
        errs.append(f"answer {a['value']} != truth {truth}")
    if sample["params"].get("unit") != unit:
        errs.append(f"unit {sample['params'].get('unit')} != {unit}")
    if not valid(unit, truth):
        errs.append(f"truth {truth} is not a valid {unit}")
    sol = sample.get("solution", "")
    if not sol.endswith(value_latex(unit, truth)):
        errs.append(f"solution {sol!r} does not end with the answer")
    return errs + check_number_choice(sample, unit, truth)


# ---------------------------------------------------------------------------
# Levels

def level1(s):
    p = s["params"]
    role = p["case"]
    P, n = int(p["P"]), int(p["n"])
    errs = []
    if role not in ROLES or p["survey"] not in SURVEYS:
        return [f"unknown role or survey {role} {p['survey']}"], None
    if n * 5 > P:
        errs.append(f"sample {n} more than a fifth of {P}")
    text, _ = prose_of(s["problem"])
    if not re.search(rf"\b{P}\b", text) or not re.search(rf"\b{n}\b", text):
        errs.append("P or n not in the text")
    if QUESTION[role] not in s["prompt"]:
        errs.append(f"prompt does not ask for {role}")
    phrases = survey_phrases(p["survey"], P, n)
    a = s["answer"]
    got = [o["latex"] for o in a["options"]]
    want = {rf"\text{{{phrases[r]}}}" for r in ROLES}
    if set(got) != want or len(got) != 4:
        errs.append(f"options {got} are not the four roles {want}")
    elif got[a["correct"]] != rf"\text{{{phrases[role]}}}":
        errs.append("correct option is not the asked role")
    if s.get("choice") != a:
        errs.append("choice differs from the answer")
    return errs, role


def level2(s):
    p = s["params"]
    car = p["character"]
    kind = KIND_OF.get(car)
    errs = []
    if kind is None:
        return [f"character not in the list: {car}"], None
    if p["case"] != kind:
        errs.append(f"case {p['case']} but {car} is {kind}")
    if (p.get("code") == "1") != (car in NOT_QUANTITIES):
        errs.append("code flag wrong")
    text, _ = prose_of(s["problem"])
    if car not in text:
        errs.append("character not in the text")
    a = s["answer"]
    got = [o["latex"] for o in a["options"]]
    if sorted(got) != sorted(KIND_TEXT.values()):
        errs.append(f"options {got}")
    elif got[a["correct"]] != KIND_TEXT[kind]:
        errs.append("correct option is not the kind")
    if s.get("choice") != a:
        errs.append("choice differs from the answer")
    return errs, kind


def level3(s):
    text, _ = prose_of(s["problem"])
    t = unmath(text)
    m = re.search(r"sono: (.*)\. Qual è la frequenza (assoluta|relativa|percentuale) della modalità (\S+)\?$", t)
    if not m:
        return [f"cannot read the problem: {t}"], None
    data = [x.strip() for x in m.group(1).split(",")]
    case, mod = m.group(2), m.group(3)
    N = len(data)
    counts = Counter(data)
    errs = []
    if N not in (20, 25):
        errs.append(f"N = {N}")
    if re.search(r"\b(\d+) (studenti|partite|famiglie|clienti)", t) and int(re.search(r"\b(\d+) (studenti|partite|famiglie|clienti)", t).group(1)) != N:
        errs.append("N in the text differs from the number of data")
    if not 3 <= len(counts) <= 5 or min(counts.values()) < 2:
        errs.append(f"modalities {dict(counts)}")
    if data != s["params"]["data"]:
        errs.append("data in the text differ from params")
    f = counts[mod]
    truth = {"assoluta": Rational(f), "relativa": Rational(f, N), "percentuale": Rational(100 * f, N)}[case]
    unit = {"assoluta": "count", "relativa": "rel", "percentuale": "pct"}[case]
    if s["params"]["case"] != case:
        errs.append("case differs from the question")
    return errs + check_answer(s, unit, truth), case


def level4(s):
    text, tab = prose_of(s["problem"])
    if tab is None:
        return ["no table"], None
    head, body, total = read_table(tab)
    mods = [int(a) for a, _ in body]
    f = {int(a): int(b) for a, b in body}
    N = sum(f.values())
    errs = []
    if total is None or int(total) != N:
        errs.append(f"total {total} != {N}")
    if head[1] != "f_a":
        errs.append("header")
    if mods != list(range(mods[0], mods[0] + len(mods))) or min(f.values()) < 1:
        errs.append(f"modalities {mods}")
    if N not in (20, 25, 40, 50):
        errs.append(f"N = {N}")
    if not re.search(rf"\b{N}\b", text):
        errs.append("N not in the text")
    t = unmath(text)
    m = re.search(r"(al massimo|meno di|almeno) (\d+)\b[^?]*\?$", t)
    if not m:
        return errs + [f"cannot read the question: {t}"], None
    rel, k = m.group(1), int(m.group(2))
    pct = "percentuale" in t
    if rel == "al massimo":
        chosen = [x for x in mods if x <= k]
    elif rel == "meno di":
        chosen = [x for x in mods if x < k]
    else:
        chosen = [x for x in mods if x >= k]
    if len(chosen) < 2 or len(chosen) == len(mods):
        errs.append(f"question {rel} {k} takes {len(chosen)} of {len(mods)} modalities")
    count = sum(f[x] for x in chosen)
    truth = Rational(100 * count, N) if pct else Rational(count)
    if s["params"]["case"] != rel:
        errs.append("case differs from the question")
    return errs + check_answer(s, "pct" if pct else "count", truth), rel


def level5(s):
    text, _ = prose_of(s["problem"])
    t = unmath(text)
    m = re.search(r"sono: (.*)\. Le classi sono (.*)\. Qual è la frequenza (assoluta|percentuale) della classe (\d+) \\vdash (\d+)\?$", t)
    if not m:
        return [f"cannot read the problem: {t}"], None
    data = [int(x) for x in m.group(1).split(",")]
    classes = [tuple(int(v) for v in c.split(r"\vdash")) for c in m.group(2).split(",")]
    case, a, b = m.group(3), int(m.group(4)), int(m.group(5))
    N = len(data)
    errs = []
    if N not in (20, 25):
        errs.append(f"N = {N}")
    widths = {hi - lo for lo, hi in classes}
    if len(classes) != 4 or len(widths) != 1 or any(classes[i][1] != classes[i + 1][0] for i in range(3)):
        errs.append(f"classes {classes}")
    if (a, b) not in classes:
        errs.append("asked class not among the classes")
    if any(not classes[0][0] <= x < classes[-1][1] for x in data):
        errs.append("a value outside the classes")
    if sum(sum(1 for x in data if lo <= x < hi) for lo, hi in classes) != N:
        errs.append("classes do not count every value once")
    if a not in data or b not in data:
        errs.append("no value on a boundary of the asked class")
    if [str(x) for x in data] != s["params"]["data"]:
        errs.append("data in the text differ from params")
    c = sum(1 for x in data if a <= x < b)
    pct = case == "percentuale"
    truth = Rational(100 * c, N) if pct else Rational(c)
    if s["params"]["case"] != case:
        errs.append("case differs from the question")
    return errs + check_answer(s, "pct" if pct else "count", truth), case


def asked_modality(text, names):
    hits = [n for n in names if re.search(rf"settore {re.escape(PREP[n])}\?", text)]
    return hits[0] if len(hits) == 1 else None


def level6(s):
    text, tab = prose_of(s["problem"])
    if tab is None:
        return ["no table"], None
    head, body, total = read_table(tab)
    names = [a for a, _ in body]
    vals = [int(b) for _, b in body]
    errs = []
    if not 3 <= len(names) <= 5 or min(vals) < 1:
        errs.append(f"rows {body}")
    mod = asked_modality(text, names)
    if mod is None:
        return errs + [f"cannot find the asked sector: {text}"], None
    pcts = head[1] == "Percentuale"
    if pcts:
        case = "percentuali"
        if total != "100" or sum(vals) != 100 or any(v % 5 for v in vals):
            errs.append(f"percentages {vals}")
        N = 100
    else:
        case = "assolute"
        N = sum(vals)
        if total is None or int(total) != N or 360 % N:
            errs.append(f"N = {N}, total {total}")
    f = vals[names.index(mod)]
    angle = Rational(360 * f, N)
    if angle == f or angle == Rational(100 * f, N):
        errs.append("angle equal to the frequency or the percentage")
    if s["params"]["case"] != case:
        errs.append("case differs from the table")
    return errs + check_answer(s, "deg", angle), case


def level7(s):
    text, tab = prose_of(s["problem"])
    if tab is None:
        return ["no table"], None
    head, body, total = read_table(tab)
    names = [a for a, _ in body]
    angles = [int(b) for _, b in body]
    errs = []
    if head[1] != "Angolo" or total is not None:
        errs.append("header or total")
    if sum(angles) != 360 or not 3 <= len(angles) <= 5 or min(angles) <= 0:
        errs.append(f"angles {angles}")
    nums = re.findall(r"\b(\d+) (?:studenti|clienti|ragazzi|famiglie)\b", text)
    if len(nums) != 1:
        return errs + ["cannot read N"], None
    N = int(nums[0])
    counts = [Rational(a * N, 360) for a in angles]
    if any(not c.is_integer for c in counts):
        errs.append("a sector with a non-integer count")
    mod = asked_modality(text, names)
    if mod is None:
        return errs + [f"cannot find the asked sector: {text}"], None
    angle = angles[names.index(mod)]
    pct = "percentuale" in text
    truth = Rational(angle * 100, 360) if pct else Rational(angle * N, 360)
    if truth == angle:
        errs.append("answer equal to the angle")
    case = "percentuale" if pct else "assoluta"
    if s["params"]["case"] != case:
        errs.append("case differs from the question")
    return errs + check_answer(s, "pct" if pct else "count", truth), case


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs = []
    texts = [sample.get("problem", ""), sample.get("prompt", ""), sample.get("solution", ""), *sample.get("steps", [])]
    if any("—" in v or "piuttosto che" in v for v in texts):
        errs.append("forbidden words")
    if not sample.get("steps"):
        errs.append("no steps")
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    e, kind = LEVELS[lvl](sample)
    return errs + e, kind
