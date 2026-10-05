"""Checker for inf-variabili-tipi (specs/exercises/inf-variabili-tipi.md).

Written from the spec. Every program is run by Python (checkers/_inf_programmi.py), and the answer is worked out a
second time from what the exercise says:
- level 1: the assignments are read one by one and the value is followed here; it is never negative;
- level 2: the two values and the assignments between them are read from the program and followed here; the options
  are the four pairs that can come out;
- level 3: a table of data and their type, and the rules that tell the type of a value from how it is written;
- level 4: with quotes the two values are joined, without they are added;
- levels 5 and 6: what the program must write is rebuilt from the words of the task, for every test; of the four
  charts or programs only the right one does (common checks); level 5 asks for a chart, level 6 for a program that
  starts from the readings.
"""
import re

from checkers._inf_primi import NAMES, check_choice, check_widths, labelled, outputs, text_only
from checkers._inf_programmi import choice_of, common, run_python

THIRD = (0.26, 0.41)
FIFTH = (0.14, 0.26)
CASE_RANGES = {
    1: {"due": (0.40, 0.60), "tre": (0.40, 0.60)},
    2: {"scambio": THIRD, "senza appoggio": THIRD, "al contrario": THIRD},
    3: {"descrizione": (0.47, 0.63), "valore": (0.37, 0.53)},
    4: {"numeri": (0.40, 0.60), "testi": (0.40, 0.60)},
    5: {k: FIFTH for k in ["prodotto", "aggiorna", "costante", "due passi", "scambio"]},
    6: {k: FIFTH for k in ["prodotto", "aggiorna", "costante", "due passi", "scambio"]},
}

TYPES = {
    "intero": ("Numero intero",),
    "virgola": ("Numero con la virgola",),
    "testo": ("Testo (stringa)",),
    "booleano": ("Booleano",),
}
# The words of a datum decide its type.
DATA = {
    "intero": ["numero di studenti", "quanti gol", "anno di nascita", "numero di pagine", "quante vite", "numero di piani", "quanti messaggi", "numero di giri"],
    "virgola": ["altezza di una persona", "prezzo di un quaderno", "media dei voti", "temperatura", "peso di un pacco", "distanza in chilometri", "tempo sui 100 metri", "capacità di una bottiglia"],
    "testo": ["nome di uno studente", "titolo di una canzone", "indirizzo", "colore preferito", "targa", "nome di una città", "messaggio", "codice fiscale"],
    "booleano": ["se uno studente", "se la luce", "se la partita", "se l'utente", "se un numero", "se la porta", "se il livello", "se oggi"],
}
SIDES = {"triangolo equilatero": 3, "quadrato": 4, "pentagono regolare": 5, "esagono regolare": 6}


def said(rows):
    return ", ".join(rows)


def rows_of(source):
    return [r.strip() for r in source.split("\n") if r.strip()]


def calc(a, sign, b):
    return a + b if sign == "+" else a - b if sign == "-" else a * b


def level1(sample, rows, right, errors):
    m = re.fullmatch(r"(\w+) = (\d+)", rows[0])
    if not m or rows[-1] != f"scrivi {m.group(1)}":
        errors.append("level 1 program not recognised")
        return None
    name, value = m.group(1), int(m.group(2))
    steps = rows[1:-1]
    for row in steps:
        s = re.fullmatch(rf"{name} = {name} ([+*-]) (\d+)", row)
        if not s:
            errors.append(f"not an update of {name}: {row}")
            return None
        value = calc(value, s.group(1), int(s.group(2)))
        if value < 0:
            errors.append("a negative value")
    if len(steps) not in (2, 3):
        errors.append(f"{len(steps)} assignments")
    if right["values"][0] != str(value):
        errors.append(f"the variable ends at {value}")
    return "due" if len(steps) == 2 else "tre"


def level2(sample, rows, choice, errors):
    first = re.fullmatch(r"(\w+) = (\d+)", rows[0])
    second = re.fullmatch(r"(\w+) = (\d+)", rows[1])
    if not first or not second:
        errors.append("level 2 program not recognised")
        return None
    a, b = first.group(1), second.group(1)
    va, vb = first.group(2), second.group(2)
    if va == vb:
        errors.append("the two values are the same")
    if rows[-2:] != [f"scrivi {a}", f"scrivi {b}"]:
        errors.append("level 2 writes the two variables in order")
    values = {a: va, b: vb}
    middle = rows[2:-2]
    for row in middle:
        m = re.fullmatch(r"(\w+) = (\w+)", row)
        if not m or m.group(2) not in values:
            errors.append(f"not a copy between variables: {row}")
            return None
        values[m.group(1)] = values[m.group(2)]
    got = [values[a], values[b]]
    right = choice["options"][choice["correct"]]
    if right["values"][0] != "\n".join(got) or right["latex"] != said(got):
        errors.append(f"the program writes {got}")
    if {o["values"][0] for o in choice["options"]} != {f"{p}\n{q}" for p in (va, vb) for q in (va, vb)}:
        errors.append("the options are not the four pairs")
    if f"il primo numero è {a} e il secondo è {b}" not in sample["problem"]:
        errors.append("the text does not say which number is which")
    if len(middle) == 3 and got == [vb, va]:
        return "scambio"
    if len(middle) == 2 and got == [vb, vb]:
        return "senza appoggio"
    if len(middle) == 2 and got == [va, va]:
        return "al contrario"
    errors.append("case not recognised")
    return None


def type_of_value(text):
    if re.fullmatch(r'"[^"]*"', text):
        return "testo"
    if re.fullmatch(r"(vero \(True in Python, true in C\+\+\)|falso \(False in Python, false in C\+\+\))", text):
        return "booleano"
    if re.fullmatch(r"-?\d+\.\d+", text):
        return "virgola"
    if re.fullmatch(r"-?\d+", text):
        return "intero"
    return None


def level3(sample, errors):
    if not text_only(sample, errors):
        return None
    problem = sample["problem"]
    m = re.fullmatch(r"Nel programma di (\w+) una variabile tiene (.+)\. Qual è il tipo giusto per quella variabile\?", problem)
    if m:
        found = [t for t, words in DATA.items() if any(w in m.group(2) for w in words)]
        kind = "descrizione"
    else:
        m = re.fullmatch(r"Nel programma di (\w+) una variabile riceve il valore (.+)\. Di che tipo è quel valore\?", problem)
        if not m:
            errors.append("level 3 text not recognised")
            return None
        found = [type_of_value(m.group(2))]
        kind = "valore"
    if m.group(1) not in NAMES:
        errors.append("unknown name")
    if len(found) != 1 or found[0] is None:
        errors.append(f"the datum fits {found}")
        return None

    def type_of(o):
        labelled(o, TYPES)
        return o["values"][0]

    check_choice(sample["answer"], lambda o: type_of(o) == found[0], errors)
    if {o["values"][0] for o in sample["answer"]["options"]} != set(TYPES):
        errors.append("level 3 offers the four types")
    if sample["params"].get("type") != found[0]:
        errors.append("params.type is not the type")
    return kind


def level4(sample, rows, right, errors):
    values = {}
    for row in rows[:-1]:
        m = re.fullmatch(r'(\w+) = ("?)(\d+)("?)', row)
        if not m or m.group(2) != m.group(4):
            errors.append("level 4 program not recognised")
            return None
        values[m.group(1)] = (m.group(3), bool(m.group(2)))
    m = re.fullmatch(r"scrivi (\w+) \+ (\w+)", rows[-1])
    if not m or m.group(1) not in values or m.group(2) not in values:
        errors.append("level 4 program not recognised")
        return None
    (x, tx), (y, ty) = values[m.group(1)], values[m.group(2)]
    if tx != ty:
        errors.append("a number and a text cannot be added")
        return None
    want = x + y if tx else str(int(x) + int(y))
    if right["values"][0] != want:
        errors.append(f"the program writes {want}")
    return "testi" if tx else "numeri"


def expected_of(task):
    """What the program of a task writes for the numbers read, from the words of the task. Returns (family, readings, function)."""
    if "scambia i valori delle due variabili" in task:
        return "scambio", 2, lambda t: [t[1], t[0]]
    if "il doppio di somma" in task:
        return "due passi", 2, lambda t: [(t[0] + t[1]) * 2]
    m = re.search(r"aggiunge a totale (\d+) euro di spedizione", task)
    if m:
        return "due passi", 2, lambda t: [t[0] * t[1] + int(m.group(1))]
    m = re.search(r", due numeri interi, (aggiunge|toglie) .+ e scrive il nuovo valore di ", task)
    if m:
        return "aggiorna", 2, (lambda t: [t[0] + t[1]]) if m.group(1) == "aggiunge" else (lambda t: [t[0] - t[1]])
    if re.search(r", due numeri interi, mette nella variabile \w+ .+ e scrive il valore di ", task):
        return "prodotto", 2, lambda t: [t[0] * t[1]]
    m = re.search(r"legge (.+), un numero intero, mette nella variabile \w+ (.+) e scrive il valore di ", task)
    if m:
        what, result = m.group(1), m.group(2)
        k = re.search(r"tra (\d+) anni", result)
        if k:
            return "costante", 1, lambda t: [t[0] + int(k.group(1))]
        k = re.search(r"sconto di (\d+) euro", result)
        if k:
            return "costante", 1, lambda t: [t[0] - int(k.group(1))]
        if result == "il perimetro":
            sides = [n for shape, n in SIDES.items() if what == f"il lato di un {shape}"]
            if len(sides) == 1:
                return "costante", 1, lambda t: [t[0] * sides[0]]
        if "settimane" in what and "giorni" in result:
            return "costante", 1, lambda t: [t[0] * 7]
        if "ore" in what and "minuti" in result:
            return "costante", 1, lambda t: [t[0] * 60]
    return None, 0, None


def calculation(sample, source, tests, choice, errors):
    family, n_reads, expected = expected_of(sample["problem"])
    if not family:
        errors.append("task not recognised")
        return None
    rows = rows_of(source)
    reads = [r for r in rows if r.startswith("leggi ")]
    if len(reads) != n_reads or any(len(t) != n_reads for t in tests):
        errors.append(f"{len(reads)} readings for a task of {n_reads}")
    if len(tests) < 2 or tests[0] == tests[1]:
        errors.append("two different tests are needed")
    if any(not isinstance(v, int) or v < 0 for t in tests for v in t):
        errors.append("a value read is not a whole number")
    written = outputs(source, tests)
    if any([str(v) for v in expected(t)] != w for t, w in zip(tests, written)):
        errors.append("the reference does not write what the task says")
    if f"Con {' e '.join(str(v) for v in tests[0])} deve scrivere {said([str(v) for v in expected(tests[0])])}." not in sample["problem"]:
        errors.append("the example of the text is not the first test")
    options = choice["options"]
    answer = sample["answer"]
    if sample["level"] == 5 and (answer["kind"] != "chart" or not all("chart" in o for o in options)):
        errors.append("level 5 asks for a chart and offers charts")
    if sample["level"] == 6:
        if answer["kind"] != "program" or not all("code" in o for o in options):
            errors.append("level 6 asks for a program and offers programs")
        else:
            if answer["start"]["python"].count("int(input())") != n_reads or answer["start"]["cpp"].count("cin >>") != n_reads:
                errors.append("the program to start from does not have the readings")
            if run_python(answer["start"]["python"], tests[0]) == written[0]:
                errors.append("the program to start from already passes")
    return family


def check(sample):
    errors = common(sample)
    check_widths(sample, errors)
    params = sample["params"]
    level = sample["level"]
    if level == 3:
        kind = level3(sample, errors)
    else:
        source = params["source"]
        rows = rows_of(source)
        if any(re.match(r"(se|finché|altrimenti)\b", r) for r in rows):
            errors.append("the program is not a sequence")
        choice = choice_of(sample)
        right = choice["options"][choice["correct"]]
        if level in (1, 2, 4):
            if "code" not in sample or sample["answer"]["kind"] != "choice":
                errors.append("the program is shown and the answer is a choice")
            if right["values"][0] != "\n".join(outputs(source, [[]])[0] or ["?"]):
                errors.append("the right option is not what the program writes")
        if level == 1:
            kind = level1(sample, rows, right, errors)
        elif level == 2:
            kind = level2(sample, rows, choice, errors)
        elif level == 4:
            kind = level4(sample, rows, right, errors)
        elif level in (5, 6):
            kind = calculation(sample, source, params["tests"], choice, errors)
        else:
            errors.append(f"unknown level {level}")
            kind = None
    if kind is not None and params.get("case") != kind:
        errors.append(f"params.case is {params.get('case')!r}, the exercise is {kind!r}")
    return errors, kind
