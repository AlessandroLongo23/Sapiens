"""Checker for inf-input-output (specs/exercises/inf-input-output.md).

Written from the spec. Every program is run by Python (checkers/_inf_programmi.py), not by the site's interpreter:
- level 1: two writings and no reading; the right option is what they write; the case (a calculation, a text, both)
  is read from the quotes of the second writing;
- level 2: the words typed are those of the text; the right option is what the program shown writes with them; the
  case is read from the program (the name of a variable in quotes, or not);
- levels 3, 4, 5: what the program must write is rebuilt here from the words of the task, for every test, and the
  reference must write it; the example of the text is the first test; of the four programs or charts only the right
  one does (common checks); level 4 asks for a chart and level 5 for a program that starts from the first reading.
"""
import re

from checkers._inf_primi import check_widths, outputs
from checkers._inf_programmi import choice_of, common, run_python

CASE_RANGES = {
    1: {"calcolo": (0.26, 0.41), "testo": (0.26, 0.41), "misto": (0.26, 0.41)},
    2: {"variabile": (0.52, 0.68), "virgolette": (0.32, 0.48)},
    **{n: {"saluto": (0.26, 0.41), "frase": (0.26, 0.41), "etichette": (0.26, 0.41)} for n in (3, 4, 5)},
}

WORD = re.compile(r"[^\W\d_]+")


def said(rows):
    return ", ".join(rows)


def expected_of(task):
    """What the program of a task writes for the words typed, from the words of the task. Returns (family, function)."""
    m = re.search(r'legge un nome e scrive due righe: nella prima "([^"]+)" seguito dal nome letto, nella seconda "([^"]+)"', task)
    if m:
        return "saluto", 1, lambda t: [f"{m.group(1)} {t[0]}", m.group(2)]
    m = re.search(r'legge un nome e un\S* \S+, e scrive in una sola riga il nome, il testo "([^"]+)" e ', task)
    if m:
        return "frase", 2, lambda t: [f"{t[0]} {m.group(1)} {t[1]}"]
    m = re.search(r'legge un nome e un\S* \S+, e scrive due righe: nella prima "Nome:" seguito dal nome, nella seconda "([^"]+)" seguito ', task)
    if m:
        return "etichette", 2, lambda t: [f"Nome: {t[0]}", f"{m.group(1)} {t[1]}"]
    return None, 0, None


def check(sample):
    errors = common(sample)
    check_widths(sample, errors)
    params = sample["params"]
    level = sample["level"]
    source = params["source"]
    tests = params["tests"]
    choice = choice_of(sample)
    right = choice["options"][choice["correct"]]
    rows = [r.strip() for r in source.split("\n") if r.strip()]
    if any(re.match(r"(se|finché|altrimenti)\b", r) for r in rows):
        errors.append("the program is not a sequence")
    reads = [r for r in rows if r.startswith("leggi ")]
    if any(not r.endswith(": testo") for r in reads):
        errors.append("a reading is not of a text")
    if any(not WORD.fullmatch(w) for t in tests for w in t) or any(len(t) != len(reads) for t in tests):
        errors.append("the words typed are not one for each reading")
    written = outputs(source, tests)

    if level == 1:
        if reads or len(rows) != 2 or not all(r.startswith("scrivi ") for r in rows):
            errors.append("level 1 is two writings")
        if right["values"][0] != "\n".join(written[0]) or right["latex"] != said(written[0]):
            errors.append("the right option is not what the program writes")
        if "code" not in sample:
            errors.append("the program is not shown")
        m = re.fullmatch(r'scrivi "([^"]*)", (.+)', rows[1])
        if not m:
            return errors + ["second writing not recognised"], None
        conto = r"\d+ [*+-] \d+"
        if re.fullmatch(conto, m.group(2)) and m.group(1) == "Totale:":
            kind = "calcolo"
        elif re.fullmatch(f'"{conto}"', m.group(2)) and m.group(1) == "Totale:":
            kind = "testo"
        elif re.fullmatch(conto, m.group(2)) and m.group(1) == m.group(2) + " =":
            kind = "misto"
        else:
            return errors + ["second writing not recognised"], None
        if params["case"] != kind:
            errors.append("params.case does not say what the program is")
        return errors, kind

    if level == 2:
        m = re.match(r"Alla tastiera si scrive (\S+)(?: e poi (\S+))?\. Che cosa scrive questo programma\?", sample["problem"])
        if not m or [w for w in m.groups() if w] != tests[0] or len(tests) != 1:
            errors.append("the words typed are not those of the text")
        if right["values"][0] != "\n".join(written[0]) or right["latex"] != said(written[0]):
            errors.append("the right option is not what the program writes")
        if "code" not in sample:
            errors.append("the program is not shown")
        names = [r.split()[1].rstrip(":") for r in reads]
        texts = re.findall(r'"([^"]*)"', "\n".join(r for r in rows if r.startswith("scrivi ")))
        kind = "virgolette" if any(n in texts for n in names) else "variabile"
        # with the names in quotes nothing of what was typed comes out
        if (kind == "virgolette") != (not any(w in " ".join(written[0]).split() for w in tests[0])):
            errors.append("the case does not match what is written")
        if params["case"] != kind:
            errors.append("params.case does not say what the program is")
        return errors, kind

    family, n_reads, expected = expected_of(sample["problem"])
    if not family:
        return errors + ["task not recognised"], None
    if len(reads) != n_reads:
        errors.append(f"{len(reads)} readings for a task of {n_reads}")
    if len(tests) < 2 or tests[0] == tests[1]:
        errors.append("two different tests are needed")
    if any(expected(t) != w for t, w in zip(tests, written)):
        errors.append("the reference does not write what the task says")
    example = " e, sotto, ".join(f"«{r}»" for r in expected(tests[0]))
    if f"Con {' e poi '.join(tests[0])} deve scrivere {example}." not in sample["problem"]:
        errors.append("the example of the text is not the first test")
    options = choice["options"]
    if level == 3 and (sample["answer"]["kind"] != "choice" or not all("code" in o for o in options)):
        errors.append("level 3 offers programs")
    if level == 4 and (sample["answer"]["kind"] != "chart" or not all("chart" in o for o in options)):
        errors.append("level 4 asks for a chart and offers charts")
    if level == 5:
        answer = sample["answer"]
        if answer["kind"] != "program" or not all("code" in o for o in options):
            errors.append("level 5 asks for a program and offers programs")
        else:
            if "nome = input()" not in answer["start"]["python"] or "cin >> nome;" not in answer["start"]["cpp"]:
                errors.append("the program to start from does not read the name")
            if run_python(answer["start"]["python"], tests[0]) == written[0]:
                errors.append("the program to start from already passes")
    if params["case"] != family:
        errors.append("params.case does not say what the task is")
    return errors, family
