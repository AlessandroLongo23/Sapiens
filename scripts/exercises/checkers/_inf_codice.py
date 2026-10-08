"""Shared checks for the generators whose programs are written by hand in Python and in C++
(src/lib/exercises/v2/inf-codice.ts).

Independent of the generators. A generator says what each program writes with a function in TypeScript; here the
Python text of every program shown, asked for or offered as an option is run by Python itself, on the tests of the
sample, and what it prints is what the sample is checked against: the output it declares, the right option, the
wrong ones that must write something else.

A sample carries in `params`:
- `program`: the reference program in full, {"python": ..., "cpp": ...};
- `tests`: the lines typed at the keyboard, one list of texts per run ([[]] when it reads nothing);
- `expected`: what the generator says the reference writes on each test, line by line;
- `ask`: "output" when the right option is what the reference writes on the first test;
- `files`: the files the programs find beside them, name to content (optional);
- `case`: which case of the level the sample is.
An option that is a program carries it in full in `values`: [python, cpp]; its `code` is what it shows, the whole or
rows of it.

The C++ is not run unless asked, because compiling is slow:

    INF_CPP=1        compile with the compiler of the machine every distinct program and run it on the tests: it
                     must write what its Python writes
    INF_CPP_MAX=N    only the first N distinct programs of each level (0 or unset: all)
    INF_CXX=...      the compiler (clang++)
    INF_CPP_CACHE=…  where the compiled programs are kept, by the hash of their text (a folder of the system's
                     temporary directory)
"""
import builtins
import hashlib
import io
import os
import re
import shutil
import subprocess
import sys
import tempfile
from collections import defaultdict
from contextlib import redirect_stdout

BANNED = re.compile(r"—|piuttosto che")
MAX_LINES = 200_000
# rows of a program or of a fragment that is an option, and of one under the question, with the solution, in the editor
OPTION_WIDTH = 34
SHOWN_WIDTH = 42
# the program an open answer starts from: the editor numbers its rows, and at 390 px a row of 39 characters scrolls
START_WIDTH = 38
OPTION_ROWS = {"python": 10, "cpp": 16}
SHOWN_ROWS = {"python": 18, "cpp": 28}
LISTING_OPTION_ROWS = 10
LISTING_ROWS = 18
LANGUAGES = ("python", "cpp")

CPP = os.environ.get("INF_CPP") == "1"
CPP_MAX = int(os.environ.get("INF_CPP_MAX") or 0)
CXX = os.environ.get("INF_CXX", "clang++")
CACHE = os.environ.get("INF_CPP_CACHE") or os.path.join(tempfile.gettempdir(), "sapiens-inf-cpp")
# the distinct programs compiled so far for each (generator, level), and how many were run in all
_compiled = defaultdict(set)
cpp_runs = {"programs": 0, "skipped": 0}


class Endless(Exception):
    pass


class _Written(io.StringIO):
    """A file opened for writing: its text goes back among the files when it is closed."""

    def __init__(self, files, name, start=""):
        super().__init__()
        self.write(start)
        self._files, self._name = files, name

    def close(self):
        if not self.closed:
            self._files[self._name] = self.getvalue()
        super().close()


def run_python(code, inputs=(), files=None):
    """The lines a Python program prints for the lines typed; None when it stops for an error or never ends.

    `input()` takes the lines in order. `open()` sees only `files`, a dict of name to content, and never the disk.
    """
    pending = [str(x) for x in inputs]
    files = dict(files or {})

    def read(*_prompt):
        if not pending:
            raise EOFError
        return pending.pop(0)

    def opened(name, mode="r", *_a, **_k):
        if "b" in mode:
            raise ValueError("binary files are not checked")
        if "r" in mode and "+" not in mode:
            if name not in files:
                raise FileNotFoundError(name)
            return io.StringIO(files[name])
        return _Written(files, name, files.get(name, "") if "a" in mode else "")

    count = [0]

    def trace(frame, event, arg):
        if event == "line":
            count[0] += 1
            if count[0] > MAX_LINES:
                raise Endless()
        return trace

    env = {"input": read, "open": opened, "__builtins__": builtins, "__name__": "__main__"}
    buf = io.StringIO()
    old = sys.gettrace()
    try:
        with redirect_stdout(buf):
            sys.settrace(trace)
            exec(compile(code, "programma", "exec"), env)
    except BaseException:  # noqa: BLE001 - an error of the program, SystemExit and the endless loop alike
        return None
    finally:
        sys.settrace(old)
    return lines_of(buf.getvalue())


def lines_of(text):
    """What was printed, line by line, without the spaces at the end of a line."""
    rows = [row.rstrip() for row in text.split("\n")]
    while rows and not rows[-1]:
        rows.pop()
    return rows


def compile_cpp(source):
    """The path of the compiled program, kept by the hash of its text; (None, why) when it does not compile."""
    os.makedirs(CACHE, exist_ok=True)
    name = hashlib.sha256(source.encode()).hexdigest()[:24]
    exe = os.path.join(CACHE, name)
    failed = exe + ".err"
    if os.path.exists(exe):
        return exe, None
    if os.path.exists(failed):
        with open(failed, encoding="utf-8") as f:
            return None, f.read()
    with open(exe + ".cpp", "w", encoding="utf-8") as f:
        f.write(source)
    partial = f"{exe}.{os.getpid()}.tmp"
    done = subprocess.run([CXX, "-std=c++17", "-O0", "-w", "-o", partial, exe + ".cpp"], capture_output=True, text=True)
    if done.returncode != 0:
        why = done.stderr.strip().split("\n")[0][:200]
        with open(failed, "w", encoding="utf-8") as f:
            f.write(why)
        return None, why
    os.replace(partial, exe)
    return exe, None


def run_cpp(source, inputs=(), files=None):
    """The lines a C++ program prints for the lines typed; None when it does not compile, stops for an error or never ends."""
    exe, _why = compile_cpp(source)
    if not exe:
        return None
    where = tempfile.mkdtemp(prefix="run-", dir=CACHE) if files else CACHE
    try:
        for name, content in (files or {}).items():
            with open(os.path.join(where, name), "w", encoding="utf-8") as f:
                f.write(content)
        done = subprocess.run([exe], input="".join(f"{x}\n" for x in inputs), capture_output=True, text=True, timeout=5, cwd=where)
    except subprocess.TimeoutExpired:
        return None
    finally:
        if files:
            shutil.rmtree(where, ignore_errors=True)
    return lines_of(done.stdout) if done.returncode == 0 else None


def cpp_errors(sample, what, code, tests, files, by_python):
    """With INF_CPP=1: the C++ of a program writes on every test what its Python writes."""
    if not CPP:
        return []
    seen = _compiled[(sample["generatorId"], sample["level"])]
    name = hashlib.sha256(code["cpp"].encode()).hexdigest()
    if name not in seen:
        if CPP_MAX and len(seen) >= CPP_MAX:
            cpp_runs["skipped"] += 1
            return []
        seen.add(name)
        cpp_runs["programs"] += 1
    _exe, why = compile_cpp(code["cpp"])
    if why is not None:
        return [f"{what}: the C++ does not compile: {why}"]
    for typed, wanted in zip(tests, by_python):
        got = run_cpp(code["cpp"], typed, files)
        if got != wanted:
            return [f"{what}: with {typed} the C++ writes {got} and the Python {wanted}"]
    return []


def bare(code, language):
    """A program without its comments and with its texts emptied. Written here again, not taken from the site."""
    out = []
    i = 0
    while i < len(code):
        c = code[i]
        if (language == "python" and c == "#") or (language == "cpp" and code.startswith("//", i)):
            while i < len(code) and code[i] != "\n":
                i += 1
        elif language == "cpp" and code.startswith("/*", i):
            end = code.find("*/", i + 2)
            i = len(code) if end < 0 else end + 2
        elif c in "\"'":
            i += 1
            while i < len(code) and code[i] not in (c, "\n"):
                i += 2 if code[i] == "\\" else 1
            i += 1
            out.append('""')
        else:
            out.append(c)
            i += 1
    return "".join(out)


def _nested_python(text):
    open_loops = []
    for row in text.split("\n"):
        if not row.strip():
            continue
        indent = len(row) - len(row.lstrip())
        while open_loops and open_loops[-1] >= indent:
            open_loops.pop()
        if re.match(r"\s*(while|for)\b", row):
            if open_loops:
                return True
            open_loops.append(indent)
    return False


def has(need, code, language):
    """Whether a program we wrote has a construct an answer can be asked for (src/lib/exercises/v2/costrutti.ts).

    Read from programs laid out as the generators lay them out: a definition starts its row, a body is indented.
    """
    text = bare(code, language)
    found = lambda pattern: re.search(pattern, text, re.M) is not None
    if need == "ciclo":
        return found(r"^\s*(while|for)\b")
    if need == "while":
        return found(r"^\s*(while|do)\b")
    if need == "for":
        return found(r"^\s*for\b")
    if need == "selezione":
        return found(r"^\s*(if|switch|match)\b") or found(r"\belif\b")
    if need == "annidati":
        # in the C++ of a generator a loop in a function or in `main` is indented once, one inside it twice
        return _nested_python(text) if language == "python" else found(r"^ {8,}(while|for|do)\b")
    if need == "funzione":
        if language == "python":
            names = re.findall(r"^[ \t]*def[ \t]+(\w+)[ \t]*\(", text, re.M)
            return any(len(re.findall(rf"(?<![\w.]){name}\s*\(", text)) >= 2 for name in names)
        names = re.findall(r"^[A-Za-z_][\w:<>, \t*&]*?[ \t*&](\w+)[ \t]*\([^;{}()]*\)\s*\{", text, re.M)
        # a call is the name with its bracket on an indented row: inside a body, not where it is defined or announced
        return any(name != "main" and re.search(rf"^[ \t]+.*(?<![\w.]){name}\s*\(", text, re.M) for name in names)
    if need == "vettore":
        if language == "python":
            return found(r"(=|\(|,|\breturn|\bin)\s*\[") or found(r"\blist\s*\(") or found(r"\.split\s*\(")
        return found(r"\b(vector|array)\s*<") or found(r"\b(int|long|double|float|char|bool|string)\s+\w+\s*\[")
    raise ValueError(f"unknown construct {need}")


def tidy(text):
    """A text of code without the indentation its rows share, the empty rows around it and the spaces at the end of a row."""
    rows = [row.rstrip() for row in text.replace("\t", "    ").split("\n")]
    while rows and not rows[0]:
        rows.pop(0)
    while rows and not rows[-1]:
        rows.pop()
    indent = min((len(row) - len(row.lstrip()) for row in rows if row), default=0)
    return [row[indent:] for row in rows]


def part_of(part, whole):
    """Whether `part` is rows of `whole`, one after the other, but for the indentation they share."""
    rows = tidy(part)
    full = whole.rstrip("\n").split("\n")
    return any(tidy("\n".join(full[i : i + len(rows)])) == rows for i in range(len(full) - len(rows) + 1))


def width_errors(what, text, width, rows):
    errors = []
    shown = text.rstrip("\n").split("\n")
    if "\t" in text:
        errors.append(f"{what} has a tab")
    widest = max(len(row) for row in shown)
    if widest > width:
        errors.append(f"{what} has a row of {widest} characters, more than {width}")
    if len(shown) > rows:
        errors.append(f"{what} has {len(shown)} rows, more than {rows}")
    return errors


def choice_of(sample):
    return sample["answer"] if sample["answer"]["kind"] == "choice" else sample.get("choice")


def reference(sample):
    """What the reference program of a sample writes on each of its tests, run here by Python."""
    params = sample["params"]
    return [run_python(params["program"]["python"], typed, params.get("files")) for typed in params["tests"]]


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
    if not isinstance(choice.get("correct"), int) or not 0 <= choice["correct"] < len(options):
        return errors + ["the right option is not among the options"]
    if len({"|".join(o["values"]) for o in options}) != len(options):
        errors.append("two options are the same")
    for i, o in enumerate(options):
        if BANNED.search(" ".join([o.get("latex", ""), o.get("text", ""), o.get("listing", "")])):
            errors.append(f"option {i}: banned writing")
        if "listing" in o:
            errors += width_errors(f"option {i}", o["listing"], OPTION_WIDTH, LISTING_OPTION_ROWS)
            if not o["listing"].strip():
                errors.append(f"option {i}: an empty fragment")
    if "listing" in sample:
        errors += width_errors("the fragment shown", sample["listing"], SHOWN_WIDTH, LISTING_ROWS)
    if "solutionListing" in sample:
        errors += width_errors("the fragment of the solution", sample["solutionListing"], SHOWN_WIDTH, LISTING_ROWS)

    params = sample["params"]
    answer = sample["answer"]
    program = params.get("program")
    coded = [o for o in options if "code" in o]
    if program is None:
        if coded or "code" in sample or "solutionCode" in sample or answer["kind"] == "program":
            errors.append("a sample with programs has no reference program in params")
        return errors
    tests = params.get("tests")
    expected = params.get("expected")
    files = params.get("files")
    if not isinstance(tests, list) or not tests or not all(isinstance(t, list) and all(isinstance(x, str) for x in t) for t in tests):
        return errors + ["params.tests is not a list of lists of texts"]
    if not isinstance(expected, list) or len(expected) != len(tests):
        return errors + ["params.expected does not say what is written on each test"]

    # the reference: Python really writes what the generator says it writes
    by_python = [run_python(program["python"], typed, files) for typed in tests]
    if any(rows is None for rows in by_python):
        errors.append("the reference program stops for an error")
    elif by_python != [[row.rstrip() for row in rows] for rows in expected]:
        k = next(i for i, rows in enumerate(by_python) if rows != [row.rstrip() for row in expected[i]])
        errors.append(f"with {tests[k]} the reference writes {by_python[k]}, and the sample says {expected[k]}")
    errors += cpp_errors(sample, "the reference", program, tests, files, by_python)

    # what is shown with the question and with the solution is the reference, or rows of it
    for key, what in (("code", "the program shown"), ("solutionCode", "the program of the solution")):
        if key not in sample:
            continue
        for language in LANGUAGES:
            errors += width_errors(f"{what} in {language}", sample[key][language], SHOWN_WIDTH, SHOWN_ROWS[language])
            if not part_of(sample[key][language], program[language]):
                errors.append(f"{what} in {language} is not part of the reference program")

    right = options[choice["correct"]]
    if params.get("ask") == "output":
        if by_python[0] is not None and right["values"][0] != "\n".join(by_python[0]):
            errors.append(f"the right option is not what the program writes: {by_python[0]}")
        if coded:
            errors.append("a question on what a program writes has programs as options")

    # options that are programs: the right one writes what the reference does, the others something else
    if coded and len(coded) != len(options):
        errors.append("some options are programs and some are not")
    for i, o in enumerate(options):
        if "code" not in o:
            continue
        if len(o["values"]) != 2:
            errors.append(f"option {i}: a program carries its two texts in values")
            continue
        whole = {"python": o["values"][0], "cpp": o["values"][1]}
        for language in LANGUAGES:
            errors += width_errors(f"option {i} in {language}", o["code"][language], OPTION_WIDTH, OPTION_ROWS[language])
            if not part_of(o["code"][language], whole[language]):
                errors.append(f"option {i}: what it shows in {language} is not part of its program")
        written = [run_python(whole["python"], typed, files) for typed in tests]
        if any(rows is None for rows in written):
            errors.append(f"option {i}: its program stops for an error")
            continue
        if i == choice["correct"]:
            if whole != {"python": program["python"], "cpp": program["cpp"]}:
                errors.append("the right option is not the reference program")
            if written != by_python:
                errors.append("the right option does not write what the reference does")
        elif written == by_python:
            errors.append(f"option {i}: a wrong option writes what the right one does on every test")
        errors += cpp_errors(sample, f"option {i}", whole, tests, files, written)

    if answer["kind"] == "program":
        errors += answer_errors(sample, by_python)
    return errors


def answer_errors(sample, by_python):
    """A program to write: the solution is the reference and passes its tests, and what it asks for is asked well."""
    errors = []
    params = sample["params"]
    answer = sample["answer"]
    tests = params["tests"]
    if params.get("files"):
        errors.append("a program to write cannot read files")
    if answer["solution"] != params["program"]:
        errors.append("the solution is not the reference program")
    if len(answer["tests"]) < 2:
        errors.append("fewer than two tests")
    if len(answer["tests"]) != len(tests):
        errors.append("the tests of the answer are not those of params")
    for t, typed, rows in zip(answer["tests"], tests, by_python):
        if t["input"] != "".join(f"{x}\n" for x in typed):
            errors.append("a test of the answer does not type the lines of params")
        if rows is None or lines_of(t["output"]) != rows:
            errors.append(f"with {typed} the solution writes {rows}, and the test wants {lines_of(t['output'])}")
    for language in LANGUAGES:
        errors += width_errors(f"the solution in {language}", answer["solution"][language], SHOWN_WIDTH, SHOWN_ROWS[language])
        errors += width_errors(f"the {language} to start from", answer["start"][language], START_WIDTH, SHOWN_ROWS[language])
        if "scrivi qui" not in answer["start"][language]:
            errors.append(f"the {language} to start from has no place to write")
    # the program to start from must not already be the answer
    if tests and by_python[0] is not None and run_python(answer["start"]["python"], tests[0]) == by_python[0]:
        errors.append("the program to start from already passes")
    if CPP and compile_cpp(answer["start"]["cpp"])[1] is not None:
        errors.append(f"the C++ to start from does not compile: {compile_cpp(answer['start']['cpp'])[1]}")

    needs = answer.get("needs", [])
    for need in needs:
        try:
            for language in LANGUAGES:
                if not has(need, answer["solution"][language], language):
                    errors.append(f"the solution in {language} has no {need}")
                if has(need, answer["start"][language], language):
                    errors.append(f"the {language} to start from already has a {need}")
        except ValueError as e:
            errors.append(str(e))
    if needs:
        # what is asked for must be needed: the runs read something and do not all write the same
        if not all(t["input"] for t in answer["tests"]):
            errors.append("an answer that asks for a construct reads nothing")
        if len({t["output"] for t in answer["tests"]}) < 2:
            errors.append("an answer that asks for a construct writes the same on every run")
    # what the exercise names is asked for, and what is asked for is named
    problem = sample["problem"].lower()
    for word in ("while", "for"):
        if f"usa un ciclo {word}" in problem and word not in needs:
            errors.append(f"the exercise names a {word} and does not ask for it")
    if "funzione" in needs and "funzione" not in problem:
        errors.append("the answer must have a function and the exercise does not say so")
    if "vettore" in needs and not re.search(r"vettor|lista|array", problem):
        errors.append("the answer must have a vector and the exercise does not say so")
    return errors
