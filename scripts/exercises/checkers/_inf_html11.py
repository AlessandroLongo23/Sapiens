"""Fragments of HTML read for the checkers of the lessons on lists, tables and forms (inf_html_elenchi_tabelle.py,
inf_html_moduli.py).

A fragment is read as it is written, with Python's parser and no repair: an element is the child of the element
that is open when its tag starts, and a closing tag closes only the element it names when that is the one open. So a
fragment written badly keeps its bad shape (an inner list between two items, a cell outside its row), which is what
the checks look for. A browser would mend some of it; the questions are about how the code is written.
"""
from html.parser import HTMLParser

VOID = {"input", "br", "meta", "link", "img", "hr"}


class Node:
    def __init__(self, tag, attrs=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        # children are nodes and texts, in the order they are written
        self.children = []

    @property
    def nodes(self):
        return [c for c in self.children if isinstance(c, Node)]

    @property
    def text(self):
        """The text written directly inside the element, without that of its children."""
        return " ".join(c for c in self.children if isinstance(c, str))

    def find(self, tag):
        """Every element with that tag inside this one, at any depth, in the order of the code."""
        found = []
        for child in self.nodes:
            if child.tag == tag:
                found.append(child)
            found += child.find(tag)
        return found

    def __repr__(self):
        return f"<{self.tag} {self.attrs} {self.children}>"


class _Reader(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root = Node("")
        self.open = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.open[-1].children.append(node)
        if tag not in VOID:
            self.open.append(node)

    def handle_endtag(self, tag):
        if len(self.open) > 1 and self.open[-1].tag == tag:
            self.open.pop()

    def handle_data(self, data):
        if data.strip():
            self.open[-1].children.append(" ".join(data.split()))


def read(fragment):
    """The fragment as a tree: a node without a tag whose children are what the fragment holds at its top."""
    reader = _Reader()
    reader.feed(fragment)
    reader.close()
    return reader.root


def span(cell, name):
    """The colspan or rowspan of a cell: 1 when it is not written."""
    return int(cell.attrs.get(name, 1))


def places(rows):
    """Where the cells of a table go, as a browser places them: for each row of cells, the column each starts in.

    `rows` is a list of lists of cells (nodes). A cell takes the first free place of its row from the left, and with
    rowspan keeps it in the rows below. Returns (columns, width): the starting column of every cell, row by row, and
    how many columns the table has in all.
    """
    taken = {}
    columns = []
    width = 0
    for r, cells in enumerate(rows):
        at = 0
        starts = []
        for cell in cells:
            while taken.get((r, at)):
                at += 1
            starts.append(at)
            for dr in range(span(cell, "rowspan")):
                for dc in range(span(cell, "colspan")):
                    taken[(r + dr, at + dc)] = True
            at += span(cell, "colspan")
            width = max(width, at)
        columns.append(starts)
    return columns, width
