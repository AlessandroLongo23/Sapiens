"""turtle in Sapiens's Python editor: the commands of Python's turtle module, drawn on a canvas in the page
(src/components/codice/turtle.ts).

The module keeps the state and computes every position; each command becomes an operation for the page, which
animates it at the turtle's speed. The program itself does not wait for the drawing: it finishes at once, and the
page plays the operations back. There are no windows, keys or clicks: onkey, onclick and the like say so.

Operations, as JSON lists:
    ["new", id]                                   a turtle at (0, 0), heading east, pen down, black, width 1
    ["move", id, x, y, down]                      moves to (x, y), drawing when the pen is down
    ["turn", id, heading]                         turns to a heading in degrees, anticlockwise from east
    ["pen", id, pencolor, fillcolor, width]
    ["show", id, visible]
    ["shape", id, name]
    ["speed", id, speed]                          0 is instant, 1 to 10 slow to fast
    ["fillstart", id]
    ["fill", id, color, [[x, y], ...]]            the shape filled since fillstart, under the lines drawn since
    ["dot", id, x, y, size, color]
    ["write", id, x, y, text, align, font, color]
    ["stamp", id, x, y, heading, shape, pencolor, fillcolor, width]
    ["clear", id]                                 removes what this turtle drew
    ["bg", color]
    ["size", width, height]
    ["tracer", on]                                off: everything is drawn at once
"""

import math

import sapiens

__all__ = []

LIMIT = 100_000
SHAPES = ("arrow", "turtle", "circle", "square", "triangle", "classic")
SPEEDS = {"fastest": 0, "fast": 10, "normal": 6, "slow": 3, "slowest": 1}

_ops = []
_count = 0


def _op(*op):
    global _count
    _count += 1
    if _count > LIMIT:
        raise sapiens.Troppo()
    _ops.append(list(op))
    if len(_ops) >= 500:
        _flush()


def _flush():
    if _ops:
        batch = _ops[:]
        _ops.clear()
        sapiens.disegna(batch)


class TurtleGraphicsError(Exception):
    pass


class Vec2D(tuple):
    """A point or a vector of the plane, as in Python's turtle."""

    def __new__(cls, x, y):
        return tuple.__new__(cls, (x, y))

    def __add__(self, other):
        return Vec2D(self[0] + other[0], self[1] + other[1])

    def __sub__(self, other):
        return Vec2D(self[0] - other[0], self[1] - other[1])

    def __mul__(self, other):
        if isinstance(other, Vec2D):
            return self[0] * other[0] + self[1] * other[1]
        return Vec2D(self[0] * other, self[1] * other)

    def __rmul__(self, other):
        return Vec2D(self[0] * other, self[1] * other)

    def __neg__(self):
        return Vec2D(-self[0], -self[1])

    def __abs__(self):
        return math.hypot(self[0], self[1])

    def rotate(self, angle):
        a = math.radians(angle)
        c, s = math.cos(a), math.sin(a)
        return Vec2D(self[0] * c - self[1] * s, self[0] * s + self[1] * c)

    def __getnewargs__(self):
        return (self[0], self[1])

    def __repr__(self):
        return "(%.2f,%.2f)" % self


def _round(value):
    return round(value, 3)


class _Screen:
    def __init__(self):
        self._colormode = 1.0
        self._bg = "white"
        self._mode = "standard"

    # colours: names and "#rrggbb" go to the canvas as they are, tuples follow the colour mode
    def _color(self, args):
        if len(args) == 1:
            args = args[0]
        if isinstance(args, str):
            if args.startswith("#") and len(args) in (4, 7):
                return args
            return args.replace(" ", "").lower()
        try:
            r, g, b = args
        except (TypeError, ValueError):
            raise TurtleGraphicsError(f"bad color arguments: {args!r}") from None
        if self._colormode == 1.0:
            r, g, b = (round(255 * c) for c in (r, g, b))
        if not all(0 <= c <= 255 for c in (r, g, b)):
            raise TurtleGraphicsError(f"bad color sequence: {args!r}")
        return "#%02x%02x%02x" % (int(r), int(g), int(b))

    def colormode(self, cmode=None):
        if cmode is None:
            return self._colormode
        if cmode == 1.0:
            self._colormode = 1.0
        elif cmode == 255:
            self._colormode = 255
        else:
            raise TurtleGraphicsError("colormode must be 1.0 or 255")

    def bgcolor(self, *args):
        if not args:
            return self._bg
        self._bg = self._color(args)
        _op("bg", self._bg)

    def setup(self, width=640, height=480, startx=None, starty=None):
        # a fraction of the screen, as Python's turtle takes it, becomes a fraction of the default canvas
        width = width * 640 if isinstance(width, float) and width <= 1 else width
        height = height * 480 if isinstance(height, float) and height <= 1 else height
        _op("size", int(width), int(height))

    def screensize(self, canvwidth=None, canvheight=None, bg=None):
        if canvwidth is not None and canvheight is not None:
            self.setup(canvwidth, canvheight)
        if bg is not None:
            self.bgcolor(bg)

    def tracer(self, n=None, delay=None):
        if n is not None:
            _op("tracer", bool(n))

    def delay(self, delay=None):
        return 0

    def mode(self, mode=None):
        if mode is None:
            return self._mode
        if mode != "standard":
            raise TurtleGraphicsError("in Sapiens la tartaruga ha solo la modalità 'standard'")

    def clear(self):
        for t in _turtles:
            t.clear()

    clearscreen = clear

    def reset(self):
        for t in _turtles:
            t.reset()

    resetscreen = reset

    def turtles(self):
        return list(_turtles)

    def textinput(self, title, prompt):
        return input(f"{prompt} ")

    def numinput(self, title, prompt, default=None, minval=None, maxval=None):
        return float(input(f"{prompt} "))

    def title(self, titlestring):
        pass

    def update(self):
        pass

    def listen(self, xdummy=None, ydummy=None):
        pass

    def done(self):
        pass

    mainloop = exitonclick = bye = done

    def _events(self, *args, **kwargs):
        raise TurtleGraphicsError("nel browser la tartaruga non riceve tasti, clic e timer")

    onkey = onkeypress = onkeyrelease = onclick = onscreenclick = ontimer = _events
    window_width = lambda self: 640  # noqa: E731
    window_height = lambda self: 480  # noqa: E731


_screen = _Screen()
_turtles = []


def Screen():
    return _screen


class Turtle:
    def __init__(self, shape="classic", undobuffersize=None, visible=True):
        self._id = len(_turtles)
        _turtles.append(self)
        _op("new", self._id)
        self._defaults()
        if shape != "classic":
            self.shape(shape)
        if not visible:
            self.hideturtle()

    def _defaults(self):
        self._pos = Vec2D(0.0, 0.0)
        self._heading = 0.0
        self._down = True
        self._pencolor = "black"
        self._fillcolor = "black"
        self._width = 1
        self._visible = True
        self._shape = "classic"
        self._speed = 3
        self._fill = None

    # movement
    def _goto(self, end):
        end = Vec2D(float(end[0]), float(end[1]))
        self._pos = end
        if self._fill is not None:
            self._fill.append([_round(end[0]), _round(end[1])])
        _op("move", self._id, _round(end[0]), _round(end[1]), self._down)

    def forward(self, distance):
        self._goto(self._pos + Vec2D(distance, 0).rotate(self._heading))

    fd = forward

    def backward(self, distance):
        self.forward(-distance)

    bk = back = backward

    def _setheading(self, angle):
        self._heading = angle % 360
        _op("turn", self._id, _round(self._heading))

    def left(self, angle):
        self._setheading(self._heading + angle)

    lt = left

    def right(self, angle):
        self._setheading(self._heading - angle)

    rt = right

    def setheading(self, to_angle):
        self._setheading(to_angle)

    seth = setheading

    def goto(self, x, y=None):
        self._goto((x, y) if y is not None else x)

    setpos = setposition = goto

    def setx(self, x):
        self._goto((x, self._pos[1]))

    def sety(self, y):
        self._goto((self._pos[0], y))

    def home(self):
        self._goto((0, 0))
        self._setheading(0)

    def circle(self, radius, extent=None, steps=None):
        # the same polygon as Python's turtle draws
        if extent is None:
            extent = 360
        if steps is None:
            frac = abs(extent) / 360
            steps = 1 + int(min(11 + abs(radius) / 6.0, 59.0) * frac)
        w = extent / steps
        w2 = 0.5 * w
        length = 2.0 * radius * math.sin(math.radians(w2))
        if radius < 0:
            length, w, w2 = -length, -w, -w2
        self.left(w2)
        for _ in range(steps):
            self.forward(length)
            self.left(w)
        self.left(-w2)

    def teleport(self, x=None, y=None, *, fill_gap=False):
        down = self._down
        self._down = False
        self._goto((self._pos[0] if x is None else x, self._pos[1] if y is None else y))
        self._down = down

    # where the turtle is
    def position(self):
        return self._pos

    pos = position

    def xcor(self):
        return self._pos[0]

    def ycor(self):
        return self._pos[1]

    def heading(self):
        return self._heading

    def _point(self, x, y):
        if y is not None:
            return Vec2D(x, y)
        if isinstance(x, Turtle):
            return x._pos
        return Vec2D(*x)

    def distance(self, x, y=None):
        return abs(self._point(x, y) - self._pos)

    def towards(self, x, y=None):
        dx, dy = self._point(x, y) - self._pos
        return round(math.degrees(math.atan2(dy, dx)), 10) % 360

    # the pen
    def _pen(self):
        _op("pen", self._id, self._pencolor, self._fillcolor, self._width)

    def penup(self):
        self._down = False

    pu = up = penup

    def pendown(self):
        self._down = True

    pd = down = pendown

    def isdown(self):
        return self._down

    def pensize(self, width=None):
        if width is None:
            return self._width
        self._width = width
        self._pen()

    width = pensize

    def pencolor(self, *args):
        if not args:
            return self._pencolor
        self._pencolor = _screen._color(args)
        self._pen()

    def fillcolor(self, *args):
        if not args:
            return self._fillcolor
        self._fillcolor = _screen._color(args)
        self._pen()

    def color(self, *args):
        if not args:
            return self._pencolor, self._fillcolor
        if len(args) == 1:
            self._pencolor = self._fillcolor = _screen._color(args)
        elif len(args) == 2:
            self._pencolor, self._fillcolor = _screen._color(args[:1]), _screen._color(args[1:])
        else:
            self._pencolor = self._fillcolor = _screen._color(args)
        self._pen()

    def speed(self, speed=None):
        if speed is None:
            return self._speed
        speed = SPEEDS.get(speed, speed)
        self._speed = 0 if not 0.5 < speed < 10.5 else int(round(speed))
        _op("speed", self._id, self._speed)

    def filling(self):
        return self._fill is not None

    def begin_fill(self):
        self._fill = [[_round(self._pos[0]), _round(self._pos[1])]]
        _op("fillstart", self._id)

    def end_fill(self):
        if self._fill is not None and len(self._fill) > 2:
            _op("fill", self._id, self._fillcolor, self._fill)
        self._fill = None

    def dot(self, size=None, *color):
        if size is not None and not isinstance(size, (int, float)):
            color, size = (size, *color), None
        if size is None:
            size = max(self._width + 4, 2 * self._width)
        shade = _screen._color(color) if color else self._pencolor
        _op("dot", self._id, _round(self._pos[0]), _round(self._pos[1]), size, shade)

    def write(self, arg, move=False, align="left", font=("Arial", 8, "normal")):
        text = str(arg)
        _op("write", self._id, _round(self._pos[0]), _round(self._pos[1]), text, align, list(font), self._pencolor)
        if move:
            # about as wide as the text, without measuring it
            self.teleport(self._pos[0] + len(text) * font[1] * 0.6, self._pos[1])

    def stamp(self):
        _op("stamp", self._id, _round(self._pos[0]), _round(self._pos[1]), _round(self._heading), self._shape, self._pencolor, self._fillcolor, self._width)

    def clear(self):
        _op("clear", self._id)

    def reset(self):
        _op("clear", self._id)
        down = self._down
        self._down = False
        self._goto((0, 0))
        self._down = down
        self._setheading(0)
        self._defaults()
        self._pen()
        _op("show", self._id, True)
        _op("shape", self._id, "classic")

    # how the turtle looks
    def hideturtle(self):
        self._visible = False
        _op("show", self._id, False)

    ht = hideturtle

    def showturtle(self):
        self._visible = True
        _op("show", self._id, True)

    st = showturtle

    def isvisible(self):
        return self._visible

    def shape(self, name=None):
        if name is None:
            return self._shape
        if name not in SHAPES:
            raise TurtleGraphicsError(f"There is no shape named {name}")
        self._shape = name
        _op("shape", self._id, name)

    def getscreen(self):
        return _screen

    def _events(self, *args, **kwargs):
        raise TurtleGraphicsError("nel browser la tartaruga non riceve tasti, clic e timer")

    onclick = onrelease = ondrag = _events

    def undo(self):
        raise TurtleGraphicsError("undo non c'è nella tartaruga di Sapiens")


Pen = RawTurtle = RawPen = Turtle
_pen = None


def getpen():
    global _pen
    if _pen is None:
        _pen = Turtle()
    return _pen


getturtle = getpen


def _bind(name, target):
    def call(*args, **kwargs):
        return getattr(target(), name)(*args, **kwargs)

    call.__name__ = name
    globals()[name] = call
    __all__.append(name)


for _name in [n for n in vars(Turtle) if not n.startswith("_")]:
    _bind(_name, getpen)
for _name in [n for n in vars(_Screen) if not n.startswith("_")]:
    if _name not in globals():
        _bind(_name, Screen)

__all__ += ["Turtle", "Pen", "RawTurtle", "Screen", "Vec2D", "TurtleGraphicsError", "getpen", "getturtle"]
