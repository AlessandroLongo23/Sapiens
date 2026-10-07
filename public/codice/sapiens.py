"""The runner of Sapiens's Python editor: runs a student's program inside Pyodide, in the worker of
src/components/codice/python.worker.ts, which loads this file with turtle.py and sapiens_grafici.py.

Everything the program shows goes through `emit(kind, text)`, a function of the page's side that returns False
when the console has had enough: 'out' and 'err' are printed text, 'in' a line typed at input(), 'image' a PNG of a
matplotlib figure in base64, 'turtle' a JSON list of drawing operations for the turtle's canvas.

input() cannot wait for the keyboard in a worker. A program that asks for a line nobody has typed yet stops with
'input'; once the line is typed it runs again from the start with every line typed so far, and the same seed for
random makes the second run repeat the first.

The program runs among the files of its project: colloca() writes them in PROGETTO before every run, in place of
whatever the run before left there, and raccogli() says what the program wrote. A rerun for a line typed at the
keyboard starts from the same files, so a program that reads and then appends does not append twice.
"""

import base64
import builtins
import gc
import importlib
import io
import json
import linecache
import os
import random
import re
import shutil
import sys
import time
import traceback

# matplotlib draws with Agg and shows its figures in the console (sapiens_grafici.py)
os.environ["MPLBACKEND"] = "module://sapiens_grafici"

FILE = "programma.py"
MAX_IMAGES = 20
# where a run's files are, and where the program runs: open("dati.txt") and `import modulo` look here
PROGETTO = "/progetto"
# a file the program wrote is given back to the editor up to this many bytes
MAX_FILE = 2_000_000

# printed text waits here for at most this long, so a loop of prints does not call the page once per print
PAUSE = 0.03

_emit = None
_images = 0
_buffer = []
_last = 0.0
_sleep = time.sleep
# the files of the project as colloca() wrote them, by path, and the folders there were
_prima = {}
_cartelle = set()


class Attesa(BaseException):
    """input() was called and no line is left: the run stops and waits for the keyboard."""


class Troppo(BaseException):
    """More output than the console takes."""


class _Uscita(io.TextIOBase):
    def __init__(self, kind):
        self.kind = kind

    def writable(self):
        return True

    def write(self, text):
        if text:
            if _buffer and _buffer[-1][0] == self.kind:
                _buffer[-1][1].append(text)
            else:
                _buffer.append((self.kind, [text]))
            if time.monotonic() - _last >= PAUSE:
                _svuota()
        return len(text)


def _svuota():
    """Sends the printed text that is waiting."""
    global _last
    pieces = _buffer[:]
    _buffer.clear()
    _last = time.monotonic()
    for kind, texts in pieces:
        if not _emit(kind, "".join(texts)):
            raise Troppo()


def _dormi(seconds):
    # what was printed and drawn before a pause is on the screen during the pause
    _svuota()
    _disegni_in_sospeso()
    _sleep(seconds)


def disegna(ops):
    """Sends turtle operations to the page."""
    if not _emit("turtle", json.dumps(ops, separators=(",", ":"))):
        raise Troppo()


def mostra_figure():
    """plt.show(): every open figure goes to the console as an image, then it is closed."""
    global _images
    pyplot = sys.modules.get("matplotlib.pyplot")
    if pyplot is None:
        return
    _svuota()
    for number in pyplot.get_fignums():
        if _images >= MAX_IMAGES:
            break
        buffer = io.BytesIO()
        pyplot.figure(number).savefig(buffer, format="png", dpi=100, bbox_inches="tight")
        _emit("image", base64.b64encode(buffer.getvalue()).decode("ascii"))
        _images += 1
    pyplot.close("all")


def _disegni_in_sospeso():
    turtle = sys.modules.get("turtle")
    if turtle is not None:
        turtle._flush()


def colloca(files):
    """Puts the files of the program's project (a JSON object, path to text) where the program runs, in place of
    those of the run before. The modules imported from there are forgotten, so a module that was changed is read
    again."""
    global _prima, _cartelle
    os.chdir("/")
    shutil.rmtree(PROGETTO, ignore_errors=True)
    os.makedirs(PROGETTO)
    _prima = {}
    for path, text in json.loads(files).items():
        folder = os.path.dirname(path)
        if folder:
            os.makedirs(f"{PROGETTO}/{folder}", exist_ok=True)
        # a folder with nothing in it yet
        if path.endswith("/"):
            continue
        # a picture is the data URL of its bytes
        data = base64.b64decode(text.split(",", 1)[1]) if re.match(r"data:[^,]*;base64,", text) else text.encode("utf-8")
        with open(f"{PROGETTO}/{path}", "wb") as file:
            file.write(data)
        _prima[path] = data
    _cartelle = {os.path.relpath(folder, PROGETTO) for folder, _, _ in os.walk(PROGETTO)}
    os.chdir(PROGETTO)
    # after the runner's own modules: a file called turtle.py does not take the turtle's place
    if PROGETTO not in sys.path:
        sys.path.insert(1, PROGETTO)
    for name, module in list(sys.modules.items()):
        if (getattr(module, "__file__", None) or "").startswith(PROGETTO + "/"):
            del sys.modules[name]
    importlib.invalidate_caches()


def raccogli():
    """What the run left in the project, as JSON: `written` are the files it made or changed, with their text (null
    for a file that is not text, or too long), and the new folders with nothing in them, whose path ends with a
    slash; `removed` are the files it deleted."""
    # a file the program never closed is written when the program's names are let go
    gc.collect()
    written, there = {}, set()
    for folder, folders, names in os.walk(PROGETTO):
        folders[:] = [name for name in folders if name != "__pycache__"]
        inside = os.path.relpath(folder, PROGETTO)
        if inside != "." and not folders and not names and inside not in _cartelle:
            written[inside + "/"] = ""
        for name in names:
            path = name if inside == "." else f"{inside}/{name}"
            there.add(path)
            if os.path.getsize(f"{folder}/{name}") > MAX_FILE:
                written[path] = None
                continue
            with open(f"{folder}/{name}", "rb") as file:
                data = file.read()
            if _prima.get(path) == data:
                continue
            try:
                text = data.decode("utf-8")
            except UnicodeDecodeError:
                text = None
            written[path] = None if text is None or "\0" in text else text
    return json.dumps({"written": written, "removed": [path for path in _prima if path not in there]})


def esegui(source, inputs, seed, emit, batch=False):
    global _emit, _images
    left = list(inputs.to_py())[::-1]

    def leggi(prompt=""):
        # what the turtle drew before the question is on the canvas while the student answers
        _disegni_in_sospeso()
        # the tests of an exercise compare what the program prints: the question of an input() is not part of it
        if not batch:
            sys.stdout.write(str(prompt))
        _svuota()
        if not left:
            # with no keyboard (the tests of an exercise) the input is over, as for a program fed by a file
            if batch:
                raise EOFError("EOF when reading a line")
            raise Attesa()
        line = left.pop()
        emit("in", line + "\n")
        return line

    _emit, _images = emit, 0
    _buffer.clear()
    saved = sys.stdout, sys.stderr, builtins.input
    sys.stdout, sys.stderr, builtins.input = _Uscita("out"), _Uscita("err"), leggi
    time.sleep = _dormi
    random.seed(seed)
    # every run starts with a new turtle and no figures left from the last one
    sys.modules.pop("turtle", None)
    if "matplotlib.pyplot" in sys.modules:
        sys.modules["matplotlib.pyplot"].close("all")
    # the traceback quotes the line of the program it points at
    linecache.cache[FILE] = (len(source), None, source.splitlines(True), FILE)
    try:
        try:
            exec(compile(source, FILE, "exec"), {"__name__": "__main__"})
        finally:
            _svuota()
            _disegni_in_sospeso()
        # a figure drawn and never shown is shown at the end, as a notebook would
        mostra_figure()
        return "ok"
    except Attesa:
        return "input"
    except Troppo:
        return "overflow"
    except SystemExit:
        return "ok"
    except BaseException as error:
        # only the frames of the program: the ones above are this file's and Pyodide's
        tb = error.__traceback__
        while tb is not None and tb.tb_frame.f_code.co_filename != FILE:
            tb = tb.tb_next
        try:
            sys.stderr.write("".join(traceback.format_exception(type(error), error, tb)))
            _svuota()
        except Troppo:
            pass
        return "error"
    finally:
        sys.stdout, sys.stderr, builtins.input = saved
        time.sleep = _sleep
