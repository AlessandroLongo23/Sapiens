"""Common checks for the exercises that show a Cartesian plane (src/lib/exercises/v2/piano.ts), written from
scripts/exercises/README.md, "Esercizi con i grafici".

A plane is a scene of type `piano-cartesiano`: a window, curves given by their formulas in LaTeX, marked points.
The formulas are read again here, with the reader of LaTeX of the chapter's checker (`to_expr`), not with the one
that draws them. What is checked: the graph marked as right is the graph of the function of the problem; every
other graph is another function, and far enough from the others, as the window shows them, to be told apart in a
small drawing; the marked points are on the curve, inside the window, with whole coordinates; a horizontal
asymptote that is not the x axis is drawn dashed, and only that; the curve is in the window.
"""
import math
import re

from sympy import Symbol, lambdify

PIANO = "piano-cartesiano"
x = Symbol("x", real=True)

# How far two graphs must be to be told apart in a small drawing: somewhere by 15% of the height of the window,
# and by 8% of it over at least 6 of the 41 abscissas the window is read at. Heights are cut at the window's edges:
# what happens outside is not seen.
SAMPLES = 41
FAR = 0.15
NEAR = 0.08
WIDE = 6
# A curve is in the window when it is seen over a fifth of its width.
SEEN = 0.2
# A marked point, an asymptote: this far from the edge at least.
MARGIN = 0.5


def number_fn(expr):
    """A function of a float that gives the value of the expression, +-inf where it overflows, nan where it has none."""
    f = lambdify(x, expr, "math")

    def g(v):
        try:
            return float(f(v))
        except OverflowError:
            return math.inf
        except (ZeroDivisionError, ValueError):
            return math.nan

    return g


class Plane:
    """A plane read again: `curves` are the solid functions, `dashed` the dashed lines as ("y", c), ("x", c) or
    ("f", function)."""

    def __init__(self, scene, to_expr):
        if not isinstance(scene, dict) or scene.get("type") != PIANO:
            raise ValueError("not a piano-cartesiano scene")
        if not isinstance(scene.get("alt"), str) or len(scene["alt"].strip()) < 10:
            raise ValueError("the plane has no alternative text")
        data = scene.get("data") or {}
        if "svg" in data:
            raise ValueError("a generator does not draw: no svg in the data")
        w = data.get("finestra")
        if not isinstance(w, list) or len(w) != 4 or not all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in w) or not (w[0] < w[1] and w[2] < w[3]):
            raise ValueError(f"unreadable window {w!r}")
        self.window = tuple(float(v) for v in w)
        self.curves = []
        self.formulas = []
        self.dashed = []
        curves = data.get("curve")
        if not isinstance(curves, list) or not curves:
            raise ValueError("the plane has no curve")
        for c in curves:
            formula = c.get("formula") if isinstance(c, dict) else None
            if not isinstance(formula, str):
                raise ValueError(f"unreadable curve {c!r}")
            m = re.fullmatch(r"\s*([xy])\s*=\s*(.+?)\s*", formula)
            if not m:
                raise ValueError(f"the formula {formula!r} is not y = f(x) nor x = c")
            expr = to_expr(m.group(2))
            dashed = c.get("tratto") in ("tratteggiato", "punteggiato")
            if c.get("tratto") not in (None, "tratteggiato", "punteggiato"):
                raise ValueError(f"unknown stroke {c.get('tratto')!r}")
            if m.group(1) == "x":
                if expr.free_symbols or not dashed:
                    raise ValueError(f"{formula!r}: a vertical line is dashed and has a number at the right")
                self.dashed.append(("x", float(expr)))
            elif dashed:
                self.dashed.append(("y", float(expr)) if not expr.free_symbols else ("f", number_fn(expr)))
            else:
                self.curves.append(number_fn(expr))
                self.formulas.append(m.group(2))
        self.points = []
        for p in data.get("punti", []):
            if not isinstance(p, dict) or not all(isinstance(p.get(k), (int, float)) and not isinstance(p.get(k), bool) for k in ("x", "y")):
                raise ValueError(f"unreadable point {p!r}")
            self.points.append((p["x"], p["y"]))

    def xs(self):
        x0, x1, _, _ = self.window
        return [x0 + (x1 - x0) * i / (SAMPLES - 1) for i in range(SAMPLES)]


def _cut(y, window):
    if math.isnan(y):
        return y
    return min(window[3], max(window[2], y))


def apart(f, g, window):
    """Whether two graphs are told apart in the window: see FAR, NEAR and WIDE above."""
    x0, x1, y0, y1 = window
    most, wide = 0.0, 0
    for i in range(SAMPLES):
        v = x0 + (x1 - x0) * i / (SAMPLES - 1)
        a, b = _cut(f(v), window), _cut(g(v), window)
        if math.isnan(a) and math.isnan(b):
            continue
        d = 1.0 if math.isnan(a) != math.isnan(b) else abs(a - b) / (y1 - y0)
        most = max(most, d)
        if d >= NEAR:
            wide += 1
    return most >= FAR and wide >= WIDE


def same_fn(f, g, window=(-6.0, 6.0, 0.0, 0.0)):
    """The same function: the same values at abscissas no lattice point falls on."""
    x0, x1 = window[0], window[1]
    for i in range(9):
        v = x0 + (x1 - x0) * (i + 0.37) / 9
        a, b = f(v), g(v)
        if math.isfinite(a) != math.isfinite(b):
            return False
        if math.isfinite(a) and abs(a - b) > 1e-9 * max(1.0, abs(a), abs(b)):
            return False
    return True


def asymptote(f):
    """The height of the horizontal asymptote of f, when it has one on one side only; None otherwise."""
    far = [v for v in (f(-60.0), f(60.0)) if math.isfinite(v) and abs(v) < 1e6]
    close = [v for v, w in ((f(-60.0), f(-50.0)), (f(60.0), f(50.0))) if math.isfinite(v) and math.isfinite(w) and abs(v - w) < 1e-9]
    if len(far) == 1 and len(close) == 1:
        return far[0]
    return None


def check_plane(scene, to_expr, errs, name, points=None, lattice=True):
    """A plane with one solid function: the curve is seen, its points are on it and readable, its asymptote is
    drawn. `points`: how many marked points it must have (None: any). Returns the Plane, or None when unreadable."""
    try:
        plane = Plane(scene, to_expr)
    except (ValueError, TypeError, KeyError, SyntaxError) as e:
        errs.append(f"{name}: {e}")
        return None
    if len(plane.curves) != 1:
        errs.append(f"{name}: {len(plane.curves)} solid curves, expected 1")
        return None
    f = plane.curves[0]
    x0, x1, y0, y1 = plane.window
    seen = sum(1 for v in plane.xs() if math.isfinite(f(v)) and y0 <= f(v) <= y1)
    if seen < SEEN * SAMPLES:
        errs.append(f"{name}: the curve is in the window at {seen} of {SAMPLES} abscissas only")
    if points is not None and len(plane.points) != points:
        errs.append(f"{name}: {len(plane.points)} marked points, expected {points}")
    if len(set(plane.points)) != len(plane.points):
        errs.append(f"{name}: a point is marked twice")
    for px, py in plane.points:
        v = f(float(px))
        if not math.isfinite(v) or abs(v - py) > 1e-9 * max(1.0, abs(py)):
            errs.append(f"{name}: the point ({px}, {py}) is not on the curve")
        if not (x0 + MARGIN <= px <= x1 - MARGIN and y0 + MARGIN <= py <= y1 - MARGIN):
            errs.append(f"{name}: the point ({px}, {py}) is out of the window or on its edge")
        if lattice and (px != round(px) or py != round(py)):
            errs.append(f"{name}: the point ({px}, {py}) cannot be read on the grid")
    L = asymptote(f)
    want = [] if L is None or abs(L) < 1e-12 else [("y", L)]
    got = [(k, v) for k, v in plane.dashed]
    if len(got) != len(want) or any(k != "y" or abs(v - want[0][1]) > 1e-9 for k, v in got):
        errs.append(f"{name}: the dashed lines are {[(k, v) for k, v in got if k != 'f']}, the asymptote is {'y = ' + str(L) if want else 'the x axis or none'}")
    if want and not (y0 + MARGIN <= L <= y1 - MARGIN):
        errs.append(f"{name}: the asymptote y = {L} is out of the window or on its edge")
    return plane


def check_graph_options(choice, truth, to_expr, errs, n=4, points=None):
    """A multiple choice whose options are graphs. `truth` is the function of the problem, as a function of a
    float. Returns the planes of the options (None for one that is unreadable)."""
    if not choice or choice.get("kind") != "choice":
        errs.append("no multiple choice")
        return []
    opts = choice.get("options", [])
    if len(opts) != n:
        errs.append(f"{len(opts)} options, expected {n}")
    planes = []
    for i, o in enumerate(opts):
        name = f"graph {i + 1}"
        if not isinstance(o.get("scene"), dict):
            errs.append(f"{name}: the option is not a graph")
            planes.append(None)
            continue
        if o.get("latex"):
            errs.append(f"{name}: a graph has no LaTeX")
        if not isinstance(o.get("text"), str) or len(o["text"].strip()) < 10 or o["text"] != o["scene"].get("alt"):
            errs.append(f"{name}: the text for a screen reader is missing or is not the one of the drawing")
        plane = check_plane(o["scene"], to_expr, errs, name, points)
        if plane and o.get("values") != [plane.formulas[0]]:
            errs.append(f"{name}: values {o.get('values')} do not say the function drawn, {plane.formulas[0]}")
        planes.append(plane)
    good = [p for p in planes if p]
    if len({p.window for p in good}) > 1:
        errs.append("the graphs do not have the same window")
    if len({o.get("text") for o in opts}) != len(opts):
        errs.append("two graphs are described with the same words")
    c = choice.get("correct")
    if not isinstance(c, int) or isinstance(c, bool) or not 0 <= c < len(opts):
        errs.append("choice.correct is out of range")
        return planes
    for i, p in enumerate(planes):
        if not p:
            continue
        is_truth = same_fn(p.curves[0], truth, p.window)
        if i == c and not is_truth:
            errs.append(f"graph {i + 1} is marked right, but it is not the graph of the function")
        if i != c and is_truth:
            errs.append(f"graph {i + 1} is marked wrong, but it is the graph of the function")
        for j in range(i + 1, len(planes)):
            if planes[j] and not apart(p.curves[0], planes[j].curves[0], p.window):
                errs.append(f"graphs {i + 1} and {j + 1} look the same in the window")
    return planes
