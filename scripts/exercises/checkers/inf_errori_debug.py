"""Checker for inf-errori-debug (specs/exercises/inf-errori-debug.md).

Written from the spec and the lesson, not from the generator:
- level 1: the situation is classified by when the error shows (the program does not start, it stops half way, it
  ends with a wrong result, it ends with the right one), and where the text gives numbers the result it calls wrong
  is worked out here;
- level 2: the message is recognised from a table of the messages of the lesson, with their language and meaning;
  the line is read from the message (after "line" in Python, the first number after the file in C++);
- levels 3 to 6: what the program should write is rebuilt from the words of the task, for every test, and the
  reference must write it. The program or the chart shown is the one with the mistake: it is run here, it must be
  wrong on the first test, and the text must say what it writes there. Of the four options only one writes what the
  task says (common checks, run on the sample without what is shown), and none writes what the wrong one does.
  Level 5 starts from the wrong chart, level 6 from the wrong program.
"""
import re

from checkers._inf_primi import NAMES, check_choice, check_widths, labelled, outputs, text_only, without_shown
from checkers._inf_programmi import behaviour, choice_of, common, run_chart, run_python

SEVENTH = (0.09, 0.20)
FAMILIES = ["sconto", "scatole", "perimetro", "resto", "scambio", "somma", "soglia"]
CASE_RANGES = {
    1: {"sintassi": (0.23, 0.37), "esecuzione": (0.18, 0.32), "logico": (0.23, 0.37), "nessuno": (0.09, 0.21)},
    2: {"significato": (0.52, 0.68), "riga": (0.32, 0.48)},
    **{n: {k: SEVENTH for k in FAMILIES} for n in (3, 4, 5, 6)},
}

KINDS = {
    "sintassi": ("errore di sintassi",),
    "esecuzione": ("errore in esecuzione",),
    "logico": ("errore logico",),
    "nessuno": ("non è un errore",),
}
# When the error shows decides its kind.
KIND_MARKS = {
    "sintassi": ["non parte", "non produce l'eseguibile", "Non viene eseguita nemmeno la prima istruzione"],
    "esecuzione": ["si blocca"],
    "logico": ["arriva in fondo senza messaggi"],
    "nessuno": ["risultato giusto", "proprio il risultato"],
}

MEANINGS = {
    "parentesi": ("parentesi tonda aperta non è stata chiusa",),
    "virgolette": ("virgolette di un testo non sono state chiuse",),
    "rientro": ("comincia con degli spazi",),
    "nome": ("nome è scritto male",),
    "zero": ("dividere per zero",),
    "conversione": ("non si può trasformare in un numero",),
    "puntoevirgola": ("Manca un punto e virgola",),
    "graffa": ("parentesi graffa aperta non è stata chiusa",),
}
# The messages of the lesson: language, what it means.
MESSAGES = [
    (r"SyntaxError: '\(' was never closed", "Python", "parentesi"),
    (r"SyntaxError: unterminated string literal", "Python", "virgolette"),
    (r"IndentationError: unexpected indent", "Python", "rientro"),
    (r"NameError: name '\w+' is not defined", "Python", "nome"),
    (r"ZeroDivisionError: division by zero", "Python", "zero"),
    (r"ValueError: invalid literal for int\(\) with base 10: '\w+'", "Python", "conversione"),
    (r"error: expected ';' at end of declaration", "C++", "puntoevirgola"),
    (r"error: use of undeclared identifier '\w+'", "C++", "nome"),
    (r"error: expected '\}'", "C++", "graffa"),
]


def said(rows):
    return ", ".join(str(r) for r in rows) if rows is not None else "si ferma con un errore"


def wrong_number(text, kind, errors):
    """Where a situation gives its numbers, the result it reports is wrong for a logical error and right for none."""
    stated = want = None
    if m := re.search(r"la media di (\d+) e (\d+)\. .* scrive (\d+)\.", text):
        stated, want = int(m.group(3)), (int(m.group(1)) + int(m.group(2))) / 2
    elif m := re.search(r"da (\d+) euro con uno sconto di (\d+) euro\. .* scrive (\d+)\.", text):
        stated, want = int(m.group(3)), int(m.group(1)) - int(m.group(2))
    elif m := re.search(r"sommare i numeri da 1 a (\d+)\. .* scrive (\d+), non (\d+)\.", text):
        n = int(m.group(1))
        stated, want = int(m.group(2)), n * (n + 1) // 2
        if int(m.group(3)) != want:
            errors.append("the sum the text calls right is not")
    elif m := re.search(r"di base (\d+) e altezza (\d+)\. .* scrive (\d+)[.,]", text):
        stated, want = int(m.group(3)), 2 * (int(m.group(1)) + int(m.group(2)))
    elif m := re.search(r"scatole da 6 si riempiono con (\d+) uova\. .* scrive (\d+), non (\d+)\.", text):
        stated, want = int(m.group(2)), int(m.group(1)) // 6
        if int(m.group(3)) != want:
            errors.append("the number of boxes the text calls right is not")
    if stated is None:
        if kind == "logico":
            errors.append("a logical error without its numbers")
        return
    if (stated == want) != (kind == "nessuno"):
        errors.append(f"the text reports {stated}, the right result is {want}")


def level1(sample, errors):
    m = re.fullmatch(r"(.+) Che tipo di errore è\?", sample["problem"])
    if not m:
        errors.append("level 1 text not recognised")
        return None
    text = m.group(1)
    if not any(n in text for n in NAMES):
        errors.append("no known name in the situation")
    found = [k for k, marks in KIND_MARKS.items() if any(w in text for w in marks)]
    if len(found) != 1:
        errors.append(f"the situation fits {found}")
        return None
    wrong_number(text, found[0], errors)

    def kind_of(o):
        labelled(o, KINDS)
        return o["values"][0]

    check_choice(sample["answer"], lambda o: kind_of(o) == found[0], errors)
    if {o["values"][0] for o in sample["answer"]["options"]} != set(KINDS):
        errors.append("level 1 offers the four kinds")
    return found[0]


def message_of(text, language, errors):
    found = [(lang, meaning) for pattern, lang, meaning in MESSAGES if re.fullmatch(pattern, text)]
    if len(found) != 1:
        errors.append(f"message not recognised: {text!r}")
        return None
    if found[0][0] != language:
        errors.append(f"a message of {found[0][0]} in a program in {language}")
    return found[0][1]


def level2(sample, errors):
    problem = sample["problem"]
    m = re.fullmatch(r"(\w+) esegue un programma in (Python|C\+\+) e legge questo messaggio: «(.+)»\. Che cosa è successo\?", problem)
    if m:
        meaning = message_of(m.group(3), m.group(2), errors)
        if meaning is None:
            return None

        def meaning_of(o):
            labelled(o, MEANINGS)
            return o["values"][0]

        check_choice(sample["answer"], lambda o: meaning_of(o) == meaning, errors)
        return "significato"
    m = re.fullmatch(r"(\w+) esegue un programma in Python e legge un messaggio che comincia con «File \"programma\.py\", line (\d+)» e finisce con «(.+)»\. In quale riga del programma il computer si è accorto dell'errore\?", problem)
    if m:
        row, language, message = int(m.group(2)), "Python", m.group(3)
    else:
        m = re.fullmatch(r"(\w+) compila un programma in C\+\+ e legge questo messaggio: «programma\.cpp:(\d+):(\d+): (.+)»\. In quale riga del programma il compilatore si è accorto dell'errore\?", problem)
        if not m:
            errors.append("level 2 text not recognised")
            return None
        row, language, message = int(m.group(2)), "C++", m.group(4)
        if int(m.group(3)) == row:
            errors.append("row and column are the same number")
    message_of(message, language, errors)

    def row_of(o):
        v = int(o["values"][0])
        if o["latex"] != f"Nella riga {v}" or v < 1:
            raise ValueError(f"option {o['latex']!r} is not row {v}")
        return v

    check_choice(sample["answer"], lambda o: row_of(o) == row, errors)
    return "riga"


def expected_of(task):
    """What the program should write for the values read, from the words of the task. Returns (family, readings, function)."""
    if "scrivere il prezzo scontato" in task and "uno sconto in percentuale" in task:
        return "sconto", 2, lambda t: [t[0] - t[0] * t[1] // 100]
    m = re.search(r"scrivere quante scatole da (\d+) si riempiono e, nella riga sotto, quante \w+ avanzano", task)
    if m:
        k = int(m.group(1))
        return "scatole", 1, lambda t: [t[0] // k, t[0] % k]
    if "di un rettangolo e scrivere il perimetro" in task:
        return "perimetro", 2, lambda t: [2 * (t[0] + t[1])]
    m = re.search(r"scrivere il resto dopo aver comprato (\d+) quaderni", task)
    if m:
        return "resto", 2, lambda t: [t[0] - t[1] * int(m.group(1))]
    if "scambiare i valori delle due variabili e scrivere prima a e poi b" in task:
        return "scambio", 2, lambda t: [t[1], t[0]]
    if "scrivere la somma dei numeri da 1 a n" in task:
        return "somma", 1, lambda t: [sum(range(1, t[0] + 1))]
    m = re.search(r'scrivere "([^"]+)" se è almeno (\d+), altrimenti "([^"]+)"', task)
    if m:
        k = int(m.group(2))
        return "soglia", 1, lambda t: [m.group(1) if t[0] >= k else m.group(3)]
    return None, 0, None


def broken(sample, errors):
    params = sample["params"]
    level = sample["level"]
    source, bug, tests = params["source"], params["bug"], params["tests"]
    m = re.fullmatch(r"Questo (programma|diagramma) dovrebbe (.+)\. Con (.+) scrive «(.+)», e dovrebbe scrivere «(.+)»\. (Quale (programma|diagramma) corregge l'errore\?|Correggi (il blocco sbagliato|la riga sbagliata)\.)", sample["problem"])
    if not m:
        errors.append("text not recognised")
        return None
    family, n_reads, expected = expected_of(m.group(2))
    if not family:
        errors.append("task not recognised")
        return None
    if any(len(t) != n_reads or any(not isinstance(v, int) or v < 0 for v in t) for t in tests):
        errors.append("the tests are not the whole numbers the task reads")
    if len(tests) < 2 or len({tuple(t) for t in tests}) != len(tests):
        errors.append("at least two different tests are needed")
    if family == "sconto" and any(t[0] * t[1] % 100 for t in tests):
        errors.append("a discount that is not a whole number of euro")
    if family == "soglia":
        k = int(re.search(r"se è almeno (\d+)", m.group(2)).group(1))
        if [k] not in tests or [k - 1] not in tests:
            errors.append("the tests do not try the threshold and the value before it")
    right = outputs(source, tests)
    if any([str(v) for v in expected(t)] != w for t, w in zip(tests, right)):
        errors.append("the reference does not write what the task says")
    wrong = outputs(bug, tests)
    if wrong[0] == right[0]:
        errors.append("the mistake does not show on the first test")
    if m.group(3) != " e ".join(str(v) for v in tests[0]) or m.group(4) != said(wrong[0]) or m.group(5) != said(right[0]):
        errors.append("the text does not say what is written on the first test")
    for text in [source, bug] + [o["values"][0] for o in choice_of(sample)["options"]]:
        if len(re.findall(r"^\s*(se|finché) ", text, re.M)) > 1:
            errors.append("more than one selection or loop")
    program = level in (3, 6)
    if (m.group(1) == "programma") != program:
        errors.append("the text does not name what is shown")
    if program:
        if "code" not in sample or [run_python(sample["code"]["python"], t) for t in tests] != wrong:
            errors.append("the program shown is not the one with the mistake")
    elif sample.get("chart") != bug or [run_chart(sample["chart"], t) for t in tests] != wrong:
        errors.append("the chart shown is not the one with the mistake")
    options = choice_of(sample)["options"]
    if not all(("code" in o) if program else ("chart" in o) for o in options):
        errors.append("the options are not programs" if program else "the options are not charts")
    elif any(behaviour(o, tests) == wrong for o in options):
        errors.append("an option does what the wrong program does")
    answer = sample["answer"]
    if level in (3, 4) and answer["kind"] != "choice":
        errors.append("levels 3 and 4 are a choice")
    if level == 5 and (answer["kind"] != "chart" or answer.get("start") != bug):
        errors.append("level 5 starts from the wrong chart")
    if level == 6:
        if answer["kind"] != "program":
            errors.append("level 6 asks for a program")
        elif [run_python(answer["start"]["python"], t) for t in tests] != wrong:
            errors.append("level 6 does not start from the wrong program")
    return family


def check(sample):
    level = sample["level"]
    if level in (1, 2):
        errors = common(sample)
        if not text_only(sample, errors):
            return errors, None
        kind = level1(sample, errors) if level == 1 else level2(sample, errors)
    elif level in (3, 4, 5, 6):
        # what is shown is the program with the mistake, not the reference
        errors = common(without_shown(sample))
        check_widths(sample, errors)
        kind = broken(sample, errors)
    else:
        return [f"unknown level {level}"], None
    if kind is not None and sample["params"].get("case") != kind:
        errors.append(f"params.case is {sample['params'].get('case')!r}, the exercise is {kind!r}")
    return errors, kind
