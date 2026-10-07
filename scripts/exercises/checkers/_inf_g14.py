"""Shared checks of the generators of the lessons on JavaScript in the page (informatica, third year, lessons 96-98:
inf-script-client, inf-dom-eventi, inf-validazione-moduli).

Nothing in the pipeline runs JavaScript, so the fragments are read here: a small interpreter of the JavaScript those
lessons use (const and let, numbers and texts, if, for, while, functions, console.log, Number, the methods of a text)
and a small page (the HTML read with Python's parser, querySelector with selectors of tag, class, id and descendant,
textContent, classList, value, checked, createElement, append, addEventListener, and events fired from here). A
checker gives it the fragment the sample shows and reads what it writes or what the page is like afterwards.

It is written from what JavaScript does, not from the generators: a text plus a number is a text, a const cannot be
assigned again, a property of null stops the script, a script without defer sees only the elements above its tag.
What is not JavaScript (print, def, elif, and, a colon in place of the braces, a type before a name) is an error
here as it is in a browser.
"""
import math
import re
from html.parser import HTMLParser


class JSError(Exception):
    """The script stops: an error while it runs."""


class JSSyntax(JSError):
    """The script does not start: it is not written as JavaScript."""


class _Undefined:
    def __repr__(self):
        return "undefined"


UNDEF = _Undefined()
MAX_STEPS = 100_000

KEYWORDS = {"const", "let", "var", "function", "if", "else", "for", "while", "return", "true", "false", "null", "new", "typeof", "do", "break", "continue", "in", "of", "class"}

TOKEN = re.compile(
    r"""
    (?P<ws>[ \t\r]+) | (?P<nl>\n) | (?P<comment>//[^\n]*) | (?P<block>/\*.*?\*/)
  | (?P<num>\d+(?:\.\d+)?)
  | (?P<str>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')
  | (?P<id>[A-Za-z_$][\w$]*)
  | (?P<op>===|!==|==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|[-+*/%<>=!(){}\[\];,.:])
    """,
    re.X | re.S,
)


def tokenize(text):
    """The tokens of a script: (kind, value, whether a new line comes before)."""
    tokens = []
    at = 0
    newline = False
    while at < len(text):
        m = TOKEN.match(text, at)
        if not m:
            raise JSSyntax(f"unexpected character {text[at]!r}")
        at = m.end()
        kind = m.lastgroup
        if kind == "nl" or (kind in ("comment", "block") and "\n" in m.group()):
            newline = True
        if kind in ("ws", "nl", "comment", "block"):
            continue
        value = m.group()
        if kind == "num":
            value = float(value) if "." in value else int(value)
        elif kind == "str":
            value = re.sub(r"\\(.)", lambda e: {"n": "\n", "t": "\t"}.get(e.group(1), e.group(1)), value[1:-1])
        elif kind == "id" and value in KEYWORDS:
            kind = "kw"
        tokens.append((kind, value, newline))
        newline = False
    tokens.append(("eof", None, True))
    return tokens


class Parser:
    def __init__(self, text):
        self.tokens = tokenize(text)
        self.at = 0

    def peek(self):
        return self.tokens[self.at]

    def take(self):
        token = self.tokens[self.at]
        self.at += 1
        return token

    def is_(self, value, kinds=("op", "kw")):
        kind, v, _ = self.peek()
        return kind in kinds and v == value

    def eat(self, value):
        if self.is_(value):
            self.at += 1
            return True
        return False

    def expect(self, value):
        if not self.eat(value):
            raise JSSyntax(f"expected {value!r}, found {self.peek()[1]!r}")

    def name(self):
        kind, value, _ = self.take()
        if kind != "id":
            raise JSSyntax(f"expected a name, found {value!r}")
        return value

    def end(self):
        """The end of an instruction: a semicolon, or a new line, a closing brace, the end of the script."""
        if self.eat(";"):
            return
        kind, value, newline = self.peek()
        if kind == "eof" or newline or (kind == "op" and value == "}"):
            return
        raise JSSyntax(f"unexpected {value!r}")

    def program(self):
        body = []
        while self.peek()[0] != "eof":
            body.append(self.statement())
        declared(body)
        return body

    def block(self):
        self.expect("{")
        body = []
        while not self.is_("}"):
            if self.peek()[0] == "eof":
                raise JSSyntax("a brace is never closed")
            body.append(self.statement())
        self.expect("}")
        declared(body)
        return body

    def declaration(self):
        kind = self.take()[1]
        name = self.name()
        if self.eat("="):
            value = self.expression()
        elif kind == "const":
            raise JSSyntax("a const without a value")
        else:
            value = ("undefined",)
        return ("decl", kind, name, value)

    def statement(self):
        kind, value, _ = self.peek()
        if kind == "kw":
            if value in ("const", "let", "var"):
                node = self.declaration()
                self.end()
                return node
            if value == "function":
                self.take()
                name = self.name()
                self.expect("(")
                params = []
                while not self.is_(")"):
                    params.append(self.name())
                    if not self.eat(","):
                        break
                self.expect(")")
                return ("func", name, params, self.block())
            if value == "if":
                self.take()
                self.expect("(")
                cond = self.expression()
                self.expect(")")
                then = self.block()
                other = None
                if self.eat("else"):
                    other = [self.statement()] if self.is_("if") else self.block()
                return ("if", cond, then, other)
            if value == "while":
                self.take()
                self.expect("(")
                cond = self.expression()
                self.expect(")")
                return ("while", cond, self.block())
            if value == "for":
                self.take()
                self.expect("(")
                init = None
                if self.is_("let") or self.is_("var"):
                    init = self.declaration()
                elif not self.is_(";"):
                    init = ("expr", self.expression())
                self.expect(";")
                cond = None if self.is_(";") else self.expression()
                self.expect(";")
                update = None if self.is_(")") else self.expression()
                self.expect(")")
                return ("for", init, cond, update, self.block())
            if value == "return":
                self.take()
                k, v, newline = self.peek()
                result = None if k == "eof" or newline or (k == "op" and v in (";", "}")) else self.expression()
                self.end()
                return ("return", result)
            if value not in ("true", "false", "null"):
                raise JSSyntax(f"unexpected {value!r}")
        if kind == "op" and value == "{":
            return ("block", self.block())
        if kind == "op" and value == ";":
            self.take()
            return ("block", [])
        node = ("expr", self.expression())
        self.end()
        return node

    def expression(self):
        left = self.binary(0)
        kind, value, _ = self.peek()
        if kind == "op" and value in ("=", "+=", "-="):
            if left[0] not in ("id", "member", "index"):
                raise JSSyntax("invalid left-hand side in assignment")
            self.take()
            return ("assign", value, left, self.expression())
        return left

    LEVELS = [("||",), ("&&",), ("===", "!==", "==", "!="), ("<", ">", "<=", ">="), ("+", "-"), ("*", "/", "%")]

    def binary(self, level):
        if level == len(self.LEVELS):
            return self.unary()
        left = self.binary(level + 1)
        while self.peek()[0] == "op" and self.peek()[1] in self.LEVELS[level]:
            op = self.take()[1]
            left = ("bin", op, left, self.binary(level + 1))
        return left

    def unary(self):
        kind, value, _ = self.peek()
        if kind == "op" and value in ("!", "-", "+"):
            self.take()
            return ("un", value, self.unary())
        node = self.postfix()
        kind, value, newline = self.peek()
        if kind == "op" and value in ("++", "--") and not newline:
            if node[0] not in ("id", "member", "index"):
                raise JSSyntax("invalid operand of ++")
            self.take()
            return ("update", value, node)
        return node

    def postfix(self):
        node = self.primary()
        while True:
            if self.eat("."):
                kind, value, _ = self.take()
                if kind not in ("id", "kw"):
                    raise JSSyntax(f"unexpected {value!r} after a dot")
                node = ("member", node, value)
            elif self.is_("("):
                self.take()
                args = []
                while not self.is_(")"):
                    args.append(self.expression())
                    if not self.eat(","):
                        break
                self.expect(")")
                node = ("call", node, args)
            elif self.is_("["):
                self.take()
                index = self.expression()
                self.expect("]")
                node = ("index", node, index)
            else:
                return node

    def primary(self):
        kind, value, _ = self.take()
        if kind == "num":
            return ("lit", value)
        if kind == "str":
            return ("lit", value)
        if kind == "id":
            return ("id", value)
        if kind == "kw" and value in ("true", "false", "null"):
            return ("lit", {"true": True, "false": False, "null": None}[value])
        if kind == "op" and value == "(":
            node = self.expression()
            self.expect(")")
            return node
        if kind == "op" and value == "[":
            items = []
            while not self.is_("]"):
                items.append(self.expression())
                if not self.eat(","):
                    break
            self.expect("]")
            return ("array", items)
        raise JSSyntax(f"unexpected {value!r}")


def declared(body):
    """Two declarations of the same name in one block are an error before the script starts."""
    names = [node[2] if node[0] == "decl" else node[1] for node in body if node[0] in ("decl", "func")]
    kinds = {node[2]: node[1] for node in body if node[0] == "decl"}
    for name in set(names):
        if names.count(name) > 1 and kinds.get(name) in ("let", "const"):
            raise JSSyntax(f"{name} has already been declared")


# ---------------------------------------------------------------- values


class Host:
    """An object the page gives to the script: its properties are read and written by name."""

    def js_get(self, name):
        return UNDEF

    def js_set(self, name, value):
        pass


class Function:
    def __init__(self, name, params, body, scope):
        self.name, self.params, self.body, self.scope = name, params, body, scope


def is_number(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def tidy_number(x):
    if isinstance(x, float) and math.isfinite(x) and x == int(x):
        return int(x)
    return x


def to_number(v):
    if isinstance(v, bool):
        return 1 if v else 0
    if is_number(v):
        return v
    if v is None:
        return 0
    if isinstance(v, str):
        text = v.strip()
        if text == "":
            return 0
        if re.fullmatch(r"[+-]?(\d+\.?\d*|\.\d+)", text):
            return tidy_number(float(text))
        return math.nan
    return math.nan


def to_string(v):
    if isinstance(v, str):
        return v
    if isinstance(v, bool):
        return "true" if v else "false"
    if is_number(v):
        if isinstance(v, float) and math.isnan(v):
            return "NaN"
        v = tidy_number(v)
        return repr(v) if isinstance(v, float) else str(v)
    if v is None:
        return "null"
    if v is UNDEF:
        return "undefined"
    if isinstance(v, list):
        return ",".join(to_string(x) for x in v)
    if isinstance(v, Element):
        return "[object HTMLElement]"
    if isinstance(v, Function) or callable(v):
        return "function"
    return "[object Object]"


def truthy(v):
    if v is None or v is UNDEF or v is False:
        return False
    if is_number(v):
        return not (v == 0 or (isinstance(v, float) and math.isnan(v)))
    if isinstance(v, str):
        return v != ""
    return True


def kind_of(v):
    if isinstance(v, bool):
        return "boolean"
    if is_number(v):
        return "number"
    if isinstance(v, str):
        return "string"
    if v is None:
        return "null"
    if v is UNDEF:
        return "undefined"
    return "object"


def strict_equal(a, b):
    ka, kb = kind_of(a), kind_of(b)
    if ka != kb:
        return False
    if ka == "object":
        return a is b
    if ka == "number" and (a != a or b != b):
        return False
    return a == b


def loose_equal(a, b):
    ka, kb = kind_of(a), kind_of(b)
    if ka == kb:
        return strict_equal(a, b)
    if {ka, kb} == {"null", "undefined"}:
        return True
    if ka in ("null", "undefined") or kb in ("null", "undefined"):
        return False
    if ka == "object" or kb == "object":
        return to_string(a) == to_string(b)
    x, y = to_number(a), to_number(b)
    return x == y


def primitive(v):
    return v if kind_of(v) != "object" else to_string(v)


class Scope:
    def __init__(self, parent=None):
        self.names = {}
        self.parent = parent

    def find(self, name):
        scope = self
        while scope:
            if name in scope.names:
                return scope
            scope = scope.parent
        return None

    def declare(self, name, value, const=False):
        self.names[name] = [value, const]


class _Return(Exception):
    def __init__(self, value):
        self.value = value


class Interp:
    def __init__(self, given=None):
        self.top = Scope()
        self.steps = 0
        for name, value in (given or {}).items():
            self.top.declare(name, value)

    def step(self):
        self.steps += 1
        if self.steps > MAX_STEPS:
            raise JSError("the script never ends")

    def run(self, text):
        self.body(Parser(text).program(), self.top)

    def body(self, statements, scope):
        for node in statements:
            if node[0] == "func":
                scope.declare(node[1], Function(node[1], node[2], node[3], scope))
        for node in statements:
            self.execute(node, scope)

    def execute(self, node, scope):
        self.step()
        what = node[0]
        if what == "decl":
            scope.declare(node[2], self.value(node[3], scope), node[1] == "const")
        elif what == "func":
            pass
        elif what == "expr":
            self.value(node[1], scope)
        elif what == "block":
            self.body(node[1], Scope(scope))
        elif what == "if":
            if truthy(self.value(node[1], scope)):
                self.body(node[2], Scope(scope))
            elif node[3] is not None:
                self.body(node[3], Scope(scope))
        elif what == "while":
            while truthy(self.value(node[1], scope)):
                self.step()
                self.body(node[2], Scope(scope))
        elif what == "for":
            loop = Scope(scope)
            if node[1]:
                self.execute(node[1], loop)
            while node[2] is None or truthy(self.value(node[2], loop)):
                self.step()
                self.body(node[4], Scope(loop))
                if node[3]:
                    self.value(node[3], loop)
        elif what == "return":
            raise _Return(UNDEF if node[1] is None else self.value(node[1], scope))
        else:
            raise JSError(f"unknown statement {what}")

    def call(self, fn, args):
        self.step()
        if isinstance(fn, Function):
            scope = Scope(fn.scope)
            for i, name in enumerate(fn.params):
                scope.declare(name, args[i] if i < len(args) else UNDEF)
            try:
                self.body(fn.body, scope)
            except _Return as r:
                return r.value
            return UNDEF
        if callable(fn):
            return fn(*args)
        raise JSError("TypeError: not a function")

    def get(self, obj, name):
        if obj is None or obj is UNDEF:
            raise JSError(f"TypeError: Cannot read properties of {to_string(obj)} (reading '{name}')")
        if isinstance(obj, str):
            if name == "length":
                return len(obj)
            if name == "trim":
                return lambda *a: obj.strip(" \t\n\r")
            if name == "includes":
                return lambda *a: to_string(a[0] if a else UNDEF) in obj
            if name == "toUpperCase":
                return lambda *a: obj.upper()
            if name == "toLowerCase":
                return lambda *a: obj.lower()
            return UNDEF
        if isinstance(obj, list):
            return len(obj) if name == "length" else UNDEF
        if isinstance(obj, Host):
            return obj.js_get(name)
        return UNDEF

    def index(self, obj, key):
        if obj is None or obj is UNDEF:
            raise JSError(f"TypeError: Cannot read properties of {to_string(obj)}")
        if isinstance(obj, NodeList):
            obj = obj.items
        if isinstance(obj, (list, str)) and is_number(key):
            return obj[key] if isinstance(key, int) and 0 <= key < len(obj) else UNDEF
        return self.get(obj, to_string(key))

    def assign(self, target, value, scope):
        if target[0] == "id":
            found = scope.find(target[1])
            if not found:
                self.top.declare(target[1], value)
            elif found.names[target[1]][1]:
                raise JSError("TypeError: Assignment to constant variable.")
            else:
                found.names[target[1]][0] = value
            return
        obj = self.value(target[1], scope)
        if obj is None or obj is UNDEF:
            raise JSError(f"TypeError: Cannot set properties of {to_string(obj)}")
        name = target[2] if target[0] == "member" else to_string(self.value(target[2], scope))
        if isinstance(obj, Host):
            obj.js_set(name, value)

    def value(self, node, scope):
        what = node[0]
        if what == "lit":
            return node[1]
        if what == "undefined":
            return UNDEF
        if what == "id":
            found = scope.find(node[1])
            if not found:
                if node[1] == "undefined":
                    return UNDEF
                raise JSError(f"ReferenceError: {node[1]} is not defined")
            return found.names[node[1]][0]
        if what == "array":
            return [self.value(item, scope) for item in node[1]]
        if what == "member":
            return self.get(self.value(node[1], scope), node[2])
        if what == "index":
            return self.index(self.value(node[1], scope), self.value(node[2], scope))
        if what == "call":
            fn = self.value(node[1], scope)
            args = [self.value(arg, scope) for arg in node[2]]
            if not isinstance(fn, Function) and not callable(fn):
                raise JSError("TypeError: not a function")
            return self.call(fn, args)
        if what == "assign":
            value = self.value(node[3], scope)
            if node[1] != "=":
                value = self.operate(node[1][0], self.value(node[2], scope), value)
            self.assign(node[2], value, scope)
            return value
        if what == "update":
            old = to_number(self.value(node[2], scope))
            self.assign(node[2], tidy_number(old + (1 if node[1] == "++" else -1)), scope)
            return old
        if what == "un":
            v = self.value(node[2], scope)
            if node[1] == "!":
                return not truthy(v)
            n = to_number(v)
            return tidy_number(-n) if node[1] == "-" else n
        if what == "bin":
            op = node[1]
            if op == "&&":
                left = self.value(node[2], scope)
                return self.value(node[3], scope) if truthy(left) else left
            if op == "||":
                left = self.value(node[2], scope)
                return left if truthy(left) else self.value(node[3], scope)
            return self.operate(op, self.value(node[2], scope), self.value(node[3], scope))
        raise JSError(f"unknown expression {what}")

    def operate(self, op, a, b):
        if op == "===":
            return strict_equal(a, b)
        if op == "!==":
            return not strict_equal(a, b)
        if op == "==":
            return loose_equal(a, b)
        if op == "!=":
            return not loose_equal(a, b)
        a, b = primitive(a), primitive(b)
        if op == "+":
            if isinstance(a, str) or isinstance(b, str):
                return to_string(a) + to_string(b)
            return tidy_number(to_number(a) + to_number(b))
        if op in ("<", ">", "<=", ">="):
            if not (isinstance(a, str) and isinstance(b, str)):
                a, b = to_number(a), to_number(b)
                if a != a or b != b:
                    return False
            return {"<": a < b, ">": a > b, "<=": a <= b, ">=": a >= b}[op]
        x, y = to_number(a), to_number(b)
        if op == "-":
            return tidy_number(x - y)
        if op == "*":
            return tidy_number(x * y)
        if op == "/":
            if y == 0:
                return math.nan if x == 0 or x != x else math.copysign(math.inf, x)
            return tidy_number(x / y)
        if op == "%":
            return math.nan if y == 0 else tidy_number(math.fmod(x, y))
        raise JSError(f"unknown operator {op}")


# ---------------------------------------------------------------- the page

VOID = {"input", "meta", "link", "br", "img", "hr"}


class Element(Host):
    def __init__(self, page, tag, attrs=None):
        self.page = page
        self.tag = tag
        self.attrs = dict(attrs or {})
        self.children = []
        self.parent = None
        self.classes = (self.attrs.get("class") or "").split()
        self.value = self.attrs.get("value") or ""
        self.checked = "checked" in self.attrs
        self.listeners = {}
        self.order = None

    @property
    def text(self):
        return "".join(child if isinstance(child, str) else child.text for child in self.children)

    def elements(self):
        """This element's descendants, in the order of the document."""
        for child in self.children:
            if isinstance(child, Element):
                yield child
                yield from child.elements()

    def js_get(self, name):
        if name == "textContent":
            return self.text
        if name == "classList":
            return ClassList(self)
        if name == "id":
            return self.attrs.get("id") or ""
        if name == "value" and self.tag in ("input", "textarea", "select"):
            return self.value
        if name == "checked" and self.tag == "input":
            return self.checked
        if name == "append":
            return self.append
        if name == "addEventListener":
            return self.listen
        return UNDEF

    def js_set(self, name, value):
        if name == "textContent":
            self.children = [] if value is None else [to_string(value)]
        elif name == "value":
            self.value = to_string(value)
        elif name == "checked":
            self.checked = truthy(value)
        elif name == "id":
            self.attrs["id"] = to_string(value)

    def append(self, *nodes):
        for node in nodes:
            if isinstance(node, Element):
                if node.parent:
                    node.parent.children.remove(node)
                node.parent = self
                self.children.append(node)
            else:
                self.children.append(to_string(node))
        return UNDEF

    def listen(self, *args):
        if len(args) < 2:
            raise JSError("TypeError: 2 arguments required")
        kind, listener = args[0], args[1]
        if listener is None or listener is UNDEF:
            return UNDEF
        if isinstance(listener, Function) or callable(listener):
            self.listeners.setdefault(to_string(kind), []).append(listener)
            return UNDEF
        if kind_of(listener) == "object":
            return UNDEF
        raise JSError("TypeError: parameter 2 is not of type 'Object'")


class ClassList(Host):
    def __init__(self, element):
        self.element = element

    def js_get(self, name):
        classes = self.element.classes
        if name == "add":
            return lambda *names: [classes.append(to_string(n)) for n in names if to_string(n) not in classes] and UNDEF
        if name == "remove":
            return lambda *names: [classes.remove(to_string(n)) for n in names if to_string(n) in classes] and UNDEF
        if name == "toggle":

            def toggle(*names):
                n = to_string(names[0])
                if n in classes:
                    classes.remove(n)
                    return False
                classes.append(n)
                return True

            return toggle
        if name == "contains":
            return lambda *names: to_string(names[0]) in classes
        if name == "length":
            return len(classes)
        return UNDEF


class NodeList(Host):
    def __init__(self, items):
        self.items = items

    def js_get(self, name):
        return len(self.items) if name == "length" else UNDEF


class Event(Host):
    def __init__(self, kind):
        self.kind = kind
        self.prevented = False

    def js_get(self, name):
        if name == "preventDefault":

            def prevent(*_a):
                self.prevented = True
                return UNDEF

            return prevent
        if name == "type":
            return self.kind
        return UNDEF


COMPOUND = re.compile(r"([a-zA-Z][\w-]*)?((?:[.#][\w-]+)*)")


def compound(text):
    m = COMPOUND.fullmatch(text)
    if not m or not text:
        raise JSError(f"SyntaxError: '{text}' is not a valid selector")
    parts = re.findall(r"[.#][\w-]+", m.group(2))
    return m.group(1), [p[1:] for p in parts if p[0] == "."], [p[1:] for p in parts if p[0] == "#"]


def matches(element, part):
    tag, classes, ids = part
    return (tag is None or element.tag == tag.lower()) and all(c in element.classes for c in classes) and all(element.attrs.get("id") == i for i in ids)


class _Builder(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.page = page
        self.open = [page.root]

    def handle_starttag(self, tag, attrs):
        element = Element(self.page, tag, attrs)
        element.order = self.page.count
        self.page.count += 1
        element.parent = self.open[-1]
        self.open[-1].children.append(element)
        if tag not in VOID:
            self.open.append(element)

    def handle_endtag(self, tag):
        for depth in range(len(self.open) - 1, 0, -1):
            if self.open[depth].tag == tag:
                del self.open[depth:]
                return

    def handle_data(self, data):
        if data.strip():
            self.open[-1].children.append(data)


class Page(Host):
    """A page from a fragment of HTML, and the script that runs in it.

    `rows` is what the script wrote on the console; `error` is None, "syntax" when it never started or "runtime"
    when it stopped. With `visible` only the elements above that many start tags exist for the script: what a script
    without defer finds.
    """

    def __init__(self, html="", given=None):
        self.root = Element(self, "#document")
        self.count = 0
        _Builder(self).feed(html)
        self.visible = None
        self.rows = []
        self.error = None
        self.message = ""
        self.calls = 0
        names = {"document": self, "console": _Console(self), "Number": _Number()}
        names.update(given or {})
        self.interp = Interp(names)

    # what the script sees
    def js_get(self, name):
        if name == "querySelector":
            return lambda *a: self.first(to_string(a[0] if a else UNDEF), True)
        if name == "querySelectorAll":
            return lambda *a: NodeList(self.all(to_string(a[0] if a else UNDEF), True))
        if name == "createElement":
            return lambda *a: Element(self, to_string(a[0]).lower())
        return UNDEF

    def all(self, selector, scripted=False):
        parts = [compound(p) for p in selector.split()]
        if not parts:
            raise JSError("SyntaxError: an empty selector")
        found = []
        for element in self.root.elements():
            if scripted and self.visible is not None and element.order is not None and element.order >= self.visible:
                continue
            if not matches(element, parts[-1]):
                continue
            rest = parts[:-1]
            up = element.parent
            while rest and up is not None:
                if up.tag != "#document" and matches(up, rest[-1]):
                    rest = rest[:-1]
                up = up.parent
            if not rest:
                found.append(element)
        return found

    def first(self, selector, scripted=False):
        found = self.all(selector, scripted)
        return found[0] if found else None

    # what the checker does
    def run(self, script):
        try:
            self.interp.run(script)
        except JSSyntax as e:
            self.error, self.message = "syntax", str(e)
        except JSError as e:
            self.error, self.message = "runtime", str(e)
        except RecursionError:
            self.error, self.message = "runtime", "too much recursion"
        return self

    def fire(self, target, kind, times=1):
        """The event `kind` on an element (or on the first that matches a selector): the events, one for each time."""
        element = self.first(target) if isinstance(target, str) else target
        events = []
        for _ in range(times):
            event = Event(kind)
            for listener in list(element.listeners.get(kind, [])) if element else []:
                try:
                    self.interp.call(listener, [event])
                except JSError as e:
                    self.error, self.message = "runtime", str(e)
            events.append(event)
        return events

    def text(self, selector):
        element = self.first(selector)
        return None if element is None else element.text

    def texts(self, selector):
        return [element.text for element in self.all(selector)]

    def classes(self, selector):
        element = self.first(selector)
        return None if element is None else " ".join(sorted(element.classes))


class _Console(Host):
    def __init__(self, page):
        self.page = page

    def js_get(self, name):
        if name == "log":

            def log(*args):
                self.page.rows.append(" ".join(to_string(a) for a in args))
                return UNDEF

            return log
        return UNDEF


class _Number(Host):
    def __call__(self, *args):
        return to_number(args[0]) if args else 0

    def js_get(self, name):
        if name == "isInteger":
            return lambda *a: bool(a) and is_number(a[0]) and math.isfinite(a[0]) and a[0] == int(a[0])
        return UNDEF


def console(script, html="", given=None):
    """What a script writes on the console, row by row; "errore" when it stops, at any point, for an error."""
    page = Page(html, given).run(script)
    return "errore" if page.error else "\n".join(page.rows)


def shown(html, script, file="script.js"):
    """The fragment a sample shows for a page and its script: the HTML, an empty row, the name of the file, the script."""
    return f"{html.rstrip()}\n\n// {file}\n{script.rstrip()}\n"


def right_of(sample):
    choice = sample["answer"]
    return choice["options"][choice["correct"]]


def fragments_only(sample):
    """What every sample of these generators is: a multiple choice of four, with no program in the two languages."""
    errors = []
    if sample["answer"]["kind"] != "choice":
        errors.append("the answer is not a multiple choice")
    if "program" in sample["params"] or "code" in sample or "solutionCode" in sample:
        errors.append("a level of fragments has no program in the two languages")
    if not 2 <= len(sample["steps"]) <= 3:
        errors.append(f"{len(sample['steps'])} steps")
    prose = " ".join([sample["prompt"], sample["problem"], sample["solution"], *sample["steps"]] + [o.get("latex", "") + " " + o.get("text", "") for o in sample["answer"].get("options", [])])
    if re.search(r"semplicemente|\bbasta\b|\bonclick=", prose, re.I):
        errors.append("banned writing")
    if "$" in prose:
        errors.append("a dollar sign in a text would be read as a formula")
    return errors
