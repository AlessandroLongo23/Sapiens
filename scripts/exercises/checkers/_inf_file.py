"""Shared by the checkers of the chapter on files (inf_file_testo.py, inf_file_csv.py).

checkers/_inf_codice.py runs a program and gives back what it prints; a program that writes a file is checked on
what the file holds at the end, so here the same run gives back the files too. `open()` sees only the files of the
sample, never the disk. With INF_CPP=1 the C++ is run in a folder of its own and the files it leaves are read back.
"""
import builtins
import io
import os
import shutil
import subprocess
import sys
import tempfile
from contextlib import redirect_stdout

from checkers._inf_codice import CACHE, CPP, compile_cpp, lines_of

MAX_LINES = 200_000


class _Out(io.StringIO):
    """A file opened for writing: its text goes back among the files when it is closed."""

    def __init__(self, files, name, start=""):
        super().__init__()
        self.write(start)
        self._files, self._name = files, name

    def close(self):
        if not self.closed:
            self._files[self._name] = self.getvalue()
        super().close()


def run_with_files(code, inputs=(), files=None):
    """What a Python program prints, line by line, and the files it leaves: (None, None) when it stops for an error."""
    pending = [str(x) for x in inputs]
    files = dict(files or {})

    def read(*_prompt):
        if not pending:
            raise EOFError
        return pending.pop(0)

    def opened(name, mode="r", *_a, **_k):
        if "b" in mode or "+" in mode:
            raise ValueError("only text files, read or written")
        if "r" in mode:
            if name not in files:
                raise FileNotFoundError(name)
            return io.StringIO(files[name])
        return _Out(files, name, files.get(name, "") if "a" in mode else "")

    count = [0]

    def trace(frame, event, arg):
        if event == "line":
            count[0] += 1
            if count[0] > MAX_LINES:
                raise RuntimeError("endless")
        return trace

    env = {"input": read, "open": opened, "__builtins__": builtins, "__name__": "__main__"}
    buf = io.StringIO()
    old = sys.gettrace()
    try:
        with redirect_stdout(buf):
            sys.settrace(trace)
            exec(compile(code, "programma", "exec"), env)
    except BaseException:  # noqa: BLE001 - an error of the program, SystemExit and the endless loop alike
        return None, None
    finally:
        sys.settrace(old)
    return lines_of(buf.getvalue()), files


def run_cpp_with_files(source, inputs=(), files=None):
    """The same for a C++ program, compiled with the compiler of the machine: (None, None) when it fails."""
    exe, _why = compile_cpp(source)
    if not exe:
        return None, None
    where = tempfile.mkdtemp(prefix="file-", dir=CACHE)
    try:
        for name, content in (files or {}).items():
            with open(os.path.join(where, name), "w", encoding="utf-8") as f:
                f.write(content)
        done = subprocess.run([exe], input="".join(f"{x}\n" for x in inputs), capture_output=True, text=True, timeout=5, cwd=where)
        after = {}
        for name in os.listdir(where):
            with open(os.path.join(where, name), encoding="utf-8") as f:
                after[name] = f.read()
    except (subprocess.TimeoutExpired, OSError, UnicodeDecodeError):
        return None, None
    finally:
        shutil.rmtree(where, ignore_errors=True)
    return (lines_of(done.stdout), after) if done.returncode == 0 else (None, None)


def file_errors(what, program, inputs, files, runs=1):
    """The files a program leaves after `runs` runs one after the other, each starting from the files of the one
    before: (files, errors). With INF_CPP=1 the C++ must leave the same files as the Python."""
    errors = []
    by_python = dict(files or {})
    for _ in range(runs):
        _printed, by_python = run_with_files(program["python"], inputs, by_python)
        if by_python is None:
            return None, [f"{what}: the Python stops for an error"]
    if CPP:
        by_cpp = dict(files or {})
        for _ in range(runs):
            _printed, by_cpp = run_cpp_with_files(program["cpp"], inputs, by_cpp)
            if by_cpp is None:
                errors.append(f"{what}: the C++ does not compile or stops")
                break
        if by_cpp is not None and by_cpp != by_python:
            errors.append(f"{what}: the C++ leaves {by_cpp} and the Python {by_python}")
    return by_python, errors


def rows_of(text):
    """The rows of a text file, without the line break that closes each."""
    return [] if text == "" else (text[:-1] if text.endswith("\n") else text).split("\n")
