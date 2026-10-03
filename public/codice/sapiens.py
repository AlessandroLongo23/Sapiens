"""The runner of Sapiens's Python editor: runs a student's program inside Pyodide, in the worker of
src/components/codice/python.worker.ts, which loads this file with turtle.py and sapiens_grafici.py.

Everything the program shows goes through `emit(kind, text)`, a function of the page's side that returns False
when the console has had enough: 'out' and 'err' are printed text, 'in' a line typed at input(), 'image' a PNG of a
matplotlib figure in base64, 'turtle' a JSON list of drawing operations for the turtle's canvas.

input() cannot wait for the keyboard in a worker. A program that asks for a line nobody has typed yet stops with
'input'; once the line is typed it runs again from the start with every line typed so far, and the same seed for
random makes the second run repeat the first.
"""

import base64
import builtins
import io
import json
import linecache
import os
import random
import sys
import time
import traceback

# matplotlib draws with Agg and shows its figures in the console (sapiens_grafici.py)
os.environ["MPLBACKEND"] = "module://sapiens_grafici"

FILE = "programma.py"
MAX_IMAGES = 20

# printed text waits here for at most this long, so a loop of prints does not call the page once per print
PAUSE = 0.03

_emit = None
_images = 0
_buffer = []
_last = 0.0
_sleep = time.sleep


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
