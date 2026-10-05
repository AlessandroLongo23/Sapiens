"""Shared checks for the generators of the programming lessons of informatica (src/lib/exercises/v2/inf-programmi.ts).

Independent of the generators: a program of an exercise is written in the language of the flowcharts, and here it is
translated to Python line by line and run by Python itself, not by the interpreter of the site. The Python the site
writes beside a chart is run too. What they print is what the answers are checked against.

A sample carries in `params`:
- `source`: the reference program, in the language of the flowcharts;
- `tests`: the lists of values its "leggi" take, one list per run ([[]] when it reads nothing).
"""
import builtins
import io
import re
import sys
from contextlib import redirect_stdout

BANNED = re.compile(r"—|piuttosto che")
MAX_LINES = 200_000


class Endless(Exception):
    pass


def to_python(source):
    """The program of a flowchart as Python: one line for one line."""
    out = []
    rows = [r for r in source.split("\n") if r.strip()]
    for i, raw in enumerate(rows):
        indent = raw[: len(raw) - len(raw.lstrip())]
        line = raw.strip()
        nxt = rows[i + 1] if i + 1 < len(rows) else ""
        deeper = len(nxt) - len(nxt.lstrip()) > len(indent)

        def expr(text):
            parts = re.split(r'("[^"]*")', text)
            for k in range(0, len(parts), 2):
                p = parts[k]
                p = re.sub(r"\bE\b", "and", p)
                p = re.sub(r"\bO\b", "or", p)
                p = re.sub(r"\bNON\b", "not", p)
                p = re.sub(r"\bdiv\b", "//", p)
                p = re.sub(r"\bmod\b", "%", p)
                p = re.sub(r"\bvero\b", "True", p)
                p = re.sub(r"\bfalso\b", "False", p)
                parts[k] = p
            return "".join(parts)

        m = re.match(r"leggi\s+([^\s:]+)(?:\s*:\s*(\w+))?$", line)
        if m:
            kind = {"intero": "int", "decimale": "float", "testo": "str"}.get(m.group(2) or "", "auto")
            out.append(f"{indent}{m.group(1)} = __read({kind!r})")
        elif line.startswith("scrivi "):
            out.append(f"{indent}print({expr(line[7:])})")
        elif re.match(r"finch[ée]\s", line):
            out.append(f"{indent}while {expr(line.split(None, 1)[1].rstrip(':'))}:")
            if not deeper:
                out.append(f"{indent}    pass")
        elif line.startswith("se "):
            out.append(f"{indent}if {expr(line[3:].rstrip(':'))}:")
            if not deeper:
                out.append(f"{indent}    pass")
        elif line.rstrip(":") == "altrimenti":
            out.append(f"{indent}else:")
            if not deeper:
                out.append(f"{indent}    pass")
        else:
            name, value = line.split("=", 1)
            out.append(f"{indent}{name.strip()} = {expr(value.strip())}")
    return "\n".join(out) + "\n"


def run_python(code, inputs=()):
    """The lines a Python program prints for the given typed lines; None when it stops for an error or never ends."""
    pending = [str(x) for x in inputs]

    def read(kind="auto"):
        if not pending:
            raise EOFError
        text = pending.pop(0)
        if kind == "str":
            return text
        if kind == "int":
            return int(text)
        if kind == "float":
            return float(text.replace(",", "."))
        return int(text) if re.fullmatch(r"-?\d+", text) else text

    count = [0]

    def trace(frame, event, arg):
        if event == "line":
            count[0] += 1
            if count[0] > MAX_LINES:
                raise Endless()
        return trace

    env = {"__read": read, "input": lambda *a: read("str"), "__builtins__": builtins}
    buf = io.StringIO()
    old = sys.gettrace()
    try:
        with redirect_stdout(buf):
            sys.settrace(trace)
            exec(compile(code, "programma", "exec"), env)
    except BaseException:
        return None
    finally:
        sys.settrace(old)
    text = buf.getvalue()
    return text.split("\n")[:-1] if text.endswith("\n") else text.split("\n") if text else []


def run_chart(source, inputs=()):
    return run_python(to_python(source), inputs)


def tidy(text):
    return "\n".join(line.rstrip() for line in text.split("\n")).strip("\n")


def choice_of(sample):
    return sample["answer"] if sample["answer"]["kind"] == "choice" else sample.get("choice")


def behaviour(option, tests):
    """What an option that is a program writes on every test: its chart, and its Python too when it has one."""
    by_chart = [run_chart(option["chart"] if "chart" in option else option["values"][0], t) for t in tests]
    if "code" in option:
        by_python = [run_python(option["code"]["python"], t) for t in tests]
        if by_python != by_chart:
            return "MISMATCH"
    return by_chart


def common(sample):
    """What every sample of these generators must have. Returns the list of errors."""
    errors = []
    if sample.get("format") != "text":
        errors.append("the sample is not written as text")
    prose = " ".join([sample["prompt"], sample["problem"], sample["solution"], *sample["steps"]])
    if BANNED.search(prose):
        errors.append("banned writing")
    if "\\text{" in prose:
        errors.append("LaTeX text in a sample written as text")
    choice = choice_of(sample)
    if not choice:
        return errors + ["no multiple choice"]
    options = choice["options"]
    if len(options) != 4:
        errors.append(f"{len(options)} options")
    if not 0 <= choice["correct"] < len(options):
        return errors + ["the right option is not among the options"]
    if len({"|".join(o["values"]) for o in options}) != len(options):
        errors.append("two options are the same")

    params = sample["params"]
    source = params.get("source")
    tests = params.get("tests", [[]])
    if source is None:
        return errors
    reference = [run_chart(source, t) for t in tests]
    if any(r is None for r in reference):
        errors.append("the reference program does not end")
    # the program shown with the question is the reference
    if "code" in sample and [run_python(sample["code"]["python"], t) for t in tests] != reference:
        errors.append("the Python shown does not write what the reference does")
    if "chart" in sample and [run_chart(sample["chart"], t) for t in tests] != reference:
        errors.append("the chart shown does not write what the reference does")

    # options that are programs: the right one behaves as the reference, the others do not
    if all("chart" in o or "code" in o for o in options):
        for i, o in enumerate(options):
            b = behaviour(o, tests)
            if b == "MISMATCH":
                errors.append(f"option {i}: its Python and its chart write different things")
            elif (b == reference) != (i == choice["correct"]):
                errors.append(f"option {i}: {'the right option does not behave as the reference' if i == choice['correct'] else 'a wrong option behaves as the reference'}")

    answer = sample["answer"]
    if answer["kind"] == "chart":
        for t in answer["tests"]:
            if run_chart(answer["solution"], t["inputs"]) != t["output"]:
                errors.append("the chart of the solution does not pass its test")
        if answer.get("start") and run_chart(answer["start"], answer["tests"][0]["inputs"]) == answer["tests"][0]["output"]:
            errors.append("the chart to start from already passes")
    if answer["kind"] == "program":
        if len(answer["tests"]) < 2:
            errors.append("fewer than two tests")
        for t in answer["tests"]:
            typed = t["input"].split("\n")[:-1] if t["input"] else []
            got = run_python(answer["solution"]["python"], typed)
            if got is None or tidy("\n".join(got)) != tidy(t["output"]):
                errors.append("the Python of the solution does not pass its test")
        for lang in ("python", "cpp"):
            if "scrivi qui" not in answer["start"][lang]:
                errors.append(f"the {lang} to start from has no place to write")
    if answer["kind"] in ("chart", "program"):
        errors += needs_errors(sample)
    return errors


# How each construct an answer may be asked for (src/lib/exercises/v2/costrutti.ts) shows in a solution we wrote: the
# line of a chart, of a Python program and of a C++ one. Written here again, not taken from the site.
CONSTRUCTS = {
    "ciclo": (r"^\s*finché ", r"^\s*(while|for) ", r"^\s*(while|for) \("),
    "selezione": (r"^\s*se ", r"^\s*if ", r"^\s*if \("),
    "while": (r"^\s*finché ", r"^\s*while ", r"^\s*while \("),
    "for": (None, r"^\s*for ", r"^\s*for \("),
    # in a solution we wrote the inner loop is indented under the outer one, and in C++ under `main` too
    "annidati": (r"^ {4,}finché ", r"^ {4,}(while|for) ", r"^ {8,}(while|for) \("),
}


def needs_errors(sample):
    """The constructs an open answer asks for: its own solution has them, and what the exercise names is asked."""
    errors = []
    answer = sample["answer"]
    needs = answer.get("needs", [])
    has = lambda pattern, text: pattern is not None and re.search(pattern, text, re.M) is not None
    for need in needs:
        if need not in CONSTRUCTS:
            errors.append(f"unknown construct {need}")
            continue
        chart, python, cpp = CONSTRUCTS[need]
        if answer["kind"] == "chart" and not has(chart, answer["solution"]):
            errors.append(f"the chart of the solution has no {need}")
        if answer["kind"] == "program":
            if not has(python, answer["solution"]["python"]) or not has(cpp, answer["solution"]["cpp"]):
                errors.append(f"the program of the solution has no {need}")
            if has(python, answer["start"]["python"]) or has(cpp, answer["start"]["cpp"]):
                errors.append(f"the program to start from already has a {need}")
    if needs:
        # what is asked for must be needed: the runs read something and do not all write the same
        tests = answer["tests"]
        if not all(t.get("inputs") or t.get("input") for t in tests):
            errors.append("an answer that asks for a construct reads nothing")
        if len({str(t["output"]) for t in tests}) < 2:
            errors.append("an answer that asks for a construct writes the same on every run")
    if answer["kind"] == "program":
        for word in ("while", "for"):
            if f"Usa un ciclo {word}" in sample["problem"] and word not in needs:
                errors.append(f"the exercise names a {word} and does not ask for it")
    return errors


def written(sample):
    """What the reference program writes on its first test, as the lines of a text option's value."""
    params = sample["params"]
    return run_chart(params["source"], params.get("tests", [[]])[0])
