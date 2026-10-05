"""Shared checks for the generators of the chapter "La selezione" of informatica (lessons 56-59).

Written from the specs, not from src/lib/exercises/v2/inf-sel.ts. Programs are run by Python
(checkers/_inf_programmi.py). What is proper to this chapter:

- the task of an exercise is read from its words ("almeno 18", "compreso tra 1 e 10", "da 9 in su") and the
  reference program is run on the values those words decide, so a program that does not do what the task says
  fails;
- a condition written as in the flowcharts (E, O, NON) is evaluated here, for the levels whose options are texts;
- the boundary values a sample declares really are boundaries;
- programs among the options fit a phone, charts among the options have one selection.
"""
import re

from checkers._inf_programmi import choice_of, run_chart

MAX_COLUMNS = 34
MAX_ROWS = 9
MAX_CPP_COLUMNS = 39

# the words of the lesson that decide the boundary: the nearest value that satisfies them, the nearest that does not
WORDS = {
    "almeno": (">=", lambda k: (k, k - 1)),
    "più di": (">", lambda k: (k + 1, k)),
    "meno di": ("<", lambda k: (k - 1, k)),
    "al massimo": ("<=", lambda k: (k, k + 1)),
}
RULE = re.compile(r"(almeno|più di|meno di|al massimo) (?:al livello )?(\d+)")
TWO_TEXTS = re.compile(r'scrive "([^"]+)" se (.*?), altrimenti scrive "([^"]+)"')


def to_condition(text):
    """A condition written as in the flowcharts, as Python."""
    text = re.sub(r"\bE\b", "and", text)
    text = re.sub(r"\bO\b", "or", text)
    return re.sub(r"\bNON\b", "not", text)


def value(condition, env):
    """The truth value of a condition with the given variables; None when it is not a condition at all (=<, a = b)."""
    try:
        return bool(eval(compile(to_condition(condition), "condizione", "eval"), {"__builtins__": {}}, dict(env)))
    except Exception:  # noqa: BLE001 - a writing that does not exist is an option that is wrong
        return None


def reads(source):
    return re.findall(r"^leggi (\w+)", source, re.M)


def selections(source):
    return len(re.findall(r"^\s*se\s", source, re.M))


def task_of(sample):
    return sample["problem"]


def expect(errors, source, inputs, written, what):
    got = run_chart(source, inputs)
    if got != [str(w) for w in written]:
        errors.append(f"{what}: with {inputs} the reference writes {got}, the task says {written}")


def check_threshold(problem, source):
    """A two-way selection on one threshold: 'scrive "A" se ... almeno 18 ..., altrimenti scrive "B"'."""
    errors = []
    m = TWO_TEXTS.search(problem)
    rules = RULE.findall(m.group(2)) if m else []
    if not m or len(rules) != 1:
        return ["the task does not read as a threshold"]
    yes, _, no = m.groups()
    word, k = rules[0][0], int(rules[0][1])
    inside, outside = WORDS[word][1](k)
    expect(errors, source, [inside], [yes], "threshold")
    expect(errors, source, [outside], [no], "threshold")
    expect(errors, source, [inside + (inside - outside) * 7], [yes], "threshold")
    expect(errors, source, [outside - (inside - outside) * 7], [no], "threshold")
    return errors


def check_tariff(problem, source):
    """A two-way selection that writes one of two amounts: '...: 5 se ... meno di 12 ..., altrimenti 8'."""
    errors = []
    m = re.search(r": (\d+) se (.*?), altrimenti (\d+)", problem)
    rules = RULE.findall(m.group(2)) if m else []
    if not m or len(rules) != 1:
        return ["the task does not read as a tariff"]
    word, k = rules[0][0], int(rules[0][1])
    inside, outside = WORDS[word][1](k)
    expect(errors, source, [inside], [m.group(1)], "tariff")
    expect(errors, source, [outside], [m.group(3)], "tariff")
    expect(errors, source, [inside + (inside - outside) * 4], [m.group(1)], "tariff")
    expect(errors, source, [outside - (inside - outside) * 4], [m.group(3)], "tariff")
    return errors


def check_one_way(problem, source):
    """A one-way selection: 'se ... almeno 50 ... [scrive "sconto" e] toglie 10 ...; alla fine scrive'."""
    errors = []
    rules = RULE.findall(problem)
    change = re.search(r"(toglie|aggiunge) (\d+)", problem)
    message = re.search(r'scrive "([^"]+)" e ', problem)
    if len(rules) != 1 or not change:
        return ["the task does not read as a one-way selection"]
    word, k = rules[0][0], int(rules[0][1])
    delta = int(change.group(2)) * (-1 if change.group(1) == "toglie" else 1)
    inside, outside = WORDS[word][1](k)
    expect(errors, source, [inside], ([message.group(1)] if message else []) + [inside + delta], "one way")
    expect(errors, source, [outside], [outside], "one way")
    return errors


def check_remainder(problem, source):
    errors = []
    m = re.search(r"multiplo di (\d+)", problem)
    d = int(m.group(1)) if m else 2
    yes, no = ("multiplo", "non multiplo") if m else ("pari", "dispari")
    said = f'scrive "multiplo" se è un multiplo di {d}, altrimenti scrive "non multiplo"' if m else 'scrive "pari" se è pari, "dispari" se è dispari'
    if said not in problem:
        errors.append("the task does not read as a remainder")
    for n in (0, d, 3 * d, 7 * d):
        expect(errors, source, [n], [yes], "remainder")
    for n in (1, d + 1, 3 * d - 1, 7 * d + 1):
        expect(errors, source, [n], [no], "remainder")
    return errors


def check_larger(problem, source):
    errors = []
    pick = max if "maggiore" in problem else min
    for a, b in ((3, 7), (9, 2), (5, 5), (12, 11)):
        expect(errors, source, [a, b], [pick(a, b)], "larger")
    return errors


def check_compound(problem, source):
    """Two comparisons joined by "e" or by "oppure", or an interval, read from the words of the task."""
    errors = []
    m = TWO_TEXTS.search(problem)
    if not m:
        return ["the task does not read as a two-way selection"]
    yes, text, no = m.groups()
    said = lambda holds: [yes] if holds else [no]  # noqa: E731
    between = re.search(r"compreso tra (\d+) e (\d+), estremi inclusi", text)
    days = re.search(r"il giorno (\d) oppure il giorno (\d)", text)
    rules = [(w, int(k)) for w, k in RULE.findall(text)]
    if between:
        lo, hi = int(between.group(1)), int(between.group(2))
        for n in range(lo - 3, hi + 4):
            expect(errors, source, [n], said(lo <= n <= hi), "interval")
    elif days:
        d1, d2 = int(days.group(1)), int(days.group(2))
        for n in range(1, 8):
            expect(errors, source, [n], said(n in (d1, d2)), "one of two")
    elif len(rules) == 2:
        either = " oppure " in text
        (in1, out1), (in2, out2) = (WORDS[w][1](k) for w, k in rules)
        if len(reads(source)) == 2:
            for a, ta in ((in1, True), (out1, False)):
                for b, tb in ((in2, True), (out2, False)):
                    expect(errors, source, [a, b], said(ta or tb if either else ta and tb), "two comparisons")
        else:
            # one value, too low or too high
            for n, holds in ((in1, True), (in2, True), (out1, False), (out2, False)):
                expect(errors, source, [n], said(holds), "outside")
    else:
        errors.append("the task does not read as a compound condition")
    return errors


def check_bands(problem, source):
    """A cascade on thresholds: '"oro" da 90 in su, "argento" da 75 a 89, "niente" sotto 75' (or prices by age)."""
    errors = []
    label = r'(?:"([^"]+)"|(\d+))'
    found = 0
    for m in re.finditer(label + r" da (\d+)(?: anni)? in su", problem):
        t = int(m.group(3))
        expect(errors, source, [t], [m.group(1) or m.group(2)], "bands")
        expect(errors, source, [t + 9], [m.group(1) or m.group(2)], "bands")
        found += 1
    for m in re.finditer(label + r" da (\d+) a (\d+)", problem):
        for t in (int(m.group(3)), int(m.group(4))):
            expect(errors, source, [t], [m.group(1) or m.group(2)], "bands")
        found += 1
    for m in re.finditer(label + r" sotto (?:i )?(\d+)", problem):
        t = int(m.group(3))
        expect(errors, source, [t - 1], [m.group(1) or m.group(2)], "bands")
        expect(errors, source, [t - 3], [m.group(1) or m.group(2)], "bands")
        found += 1
    # one band for every way of the cascade: one open upwards, one open downwards, the others closed
    if found != selections(source) + 1 or len(re.findall(r"in su", problem)) != 1 or len(re.findall(r" sotto ", problem)) != 1:
        errors.append("the task does not read as the bands of the cascade")
    return errors


def check_sign(problem, source):
    errors = []
    m = re.search(r'scrive "([^"]+)" se è maggiore di zero, "([^"]+)" se è minore di zero, "([^"]+)" se è proprio zero', problem)
    if not m:
        return ["the task does not read as a sign"]
    for n, k in ((5, 1), (1, 1), (-1, 2), (-12, 2), (0, 3)):
        expect(errors, source, [n], [m.group(k)], "sign")
    return errors


def check_duel(problem, source):
    errors = []
    m = re.search(r'scrive "([^"]+)" se il maggiore è il primo numero letto, "([^"]+)" se è il secondo, "([^"]+)" se sono lo stesso numero', problem)
    if not m:
        return ["the task does not read as a comparison of two numbers"]
    for a, b in ((8, 3), (2, 9), (5, 5), (0, 1), (1, 0), (0, 0)):
        expect(errors, source, [a, b], [m.group(1 if a > b else 2 if a < b else 3)], "comparison")
    return errors


def is_boundary(source, inputs):
    """Moving one of the inputs by one changes what the program writes."""
    here = run_chart(source, inputs)
    for i in range(len(inputs)):
        for d in (-1, 1):
            moved = list(inputs)
            moved[i] += d
            if run_chart(source, moved) != here:
                return True
    return False


def check_edges(sample):
    params = sample["params"]
    errors = []
    for e in params.get("edge", []):
        if not is_boundary(params["source"], e):
            errors.append(f"{e} is not a boundary of the reference program")
    return errors


def check_written(sample):
    """The right option of a "che cosa scrive" is what the program shown writes on the input of the question."""
    params = sample["params"]
    choice = choice_of(sample)
    errors = []
    written = run_chart(params["source"], params["input"])
    if written is None or choice["options"][choice["correct"]]["values"][0] != "\n".join(written):
        errors.append("the right option is not what the program writes")
    if params["tests"] != [params["input"]]:
        errors.append("the question is not on the input of the sample")
    if " ".join(str(x) for x in params["input"]) not in sample["problem"].replace(" e poi ", " "):
        errors.append("the problem does not say the input")
    return errors


def check_options(sample):
    """Programs among the options fit a phone; charts among the options have one selection."""
    errors = []
    for o in choice_of(sample)["options"]:
        if "code" in o:
            rows = o["code"]["python"].rstrip("\n").split("\n")
            if len(rows) > MAX_ROWS or max(len(r) for r in rows) > MAX_COLUMNS:
                errors.append(f"a program among the options of {len(rows)} rows and {max(len(r) for r in rows)} columns")
            if max(len(r) for r in o["code"]["cpp"].split("\n")) > MAX_CPP_COLUMNS:
                errors.append("a program among the options with a row of more than 39 columns in C++")
        if "chart" in o and selections(o["chart"]) > 1:
            errors.append("a chart among the options with two selections")
    return errors


def check_open(sample, kind):
    """An open answer of the right kind, tried on every test of the sample, where not all the runs write the same."""
    answer = sample["answer"]
    params = sample["params"]
    if answer["kind"] != kind:
        return [f"the open answer is not a {kind}"]
    errors = []
    if len(answer["tests"]) != len(params["tests"]) or len(answer["tests"]) < 2:
        errors.append("the open answer is not tried on the tests of the sample")
    outputs = {run_chart(params["source"], t) and tuple(run_chart(params["source"], t)) for t in params["tests"]}
    if len(outputs) < 2:
        errors.append("the tests take one branch only")
    if not any(e in params["tests"] for e in params.get("edge", [])):
        errors.append("no boundary value among the tests")
    return errors


def all_options(sample, key):
    return all(key in o for o in choice_of(sample)["options"])


def one_of_four(choice, wanted, truth_of):
    """Exactly the right option has the value wanted, and the others have the other value (none is a non-condition)."""
    errors = []
    for i, o in enumerate(choice["options"]):
        v = truth_of(o["values"][0])
        if v is None:
            errors.append(f"option {i} is not a condition")
        elif (v == wanted) != (i == choice["correct"]):
            errors.append(f"option {i} is {v}, and {'is' if i == choice['correct'] else 'is not'} the right one")
    return errors


def check_said(sample, env, ask):
    """The problem says the value of every variable and which truth value is asked for."""
    errors = []
    for name, v in env.items():
        said = f"{name} è {'vera' if v else 'falsa'}" if isinstance(v, bool) else f'vale "{v}"' if isinstance(v, str) else f"{name} vale {v}"
        if said not in sample["problem"]:
            errors.append(f"the problem does not say that {said}")
    if f"è {'vera' if ask else 'falsa'}?" not in sample["problem"]:
        errors.append("the problem asks for the other truth value")
    return errors


def check_input_choice(sample):
    """Of four inputs, only the right one makes the program shown write the text asked for."""
    params = sample["params"]
    choice = choice_of(sample)
    errors = []
    target = params["target"]
    if target not in sample["problem"]:
        errors.append("the problem does not say the text")
    for i, o in enumerate(choice["options"]):
        hit = run_chart(params["source"], [int(x) for x in o["values"][0].split(",")]) == [target]
        if hit != (i == choice["correct"]):
            errors.append(f"option {i} {'writes' if hit else 'does not write'} the text asked for")
    return errors
