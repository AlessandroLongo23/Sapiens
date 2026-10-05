"""Shared helpers for the checkers of the chapter "Linguaggi e primi programmi" of informatica (inf-linguaggi-
programmazione, inf-input-output, inf-variabili-tipi, inf-espressioni, inf-errori-debug), beside the common checks of
checkers/_inf_programmi.py.

Samples are written as text. A multiple choice of text options is checked by rebuilding, from a table written here,
which options are right: exactly one must be, and it must be the one marked.
"""
import re

from checkers._inf_programmi import choice_of, run_chart

NAMES = ["Giulia", "Marco", "Sara", "Luca", "Anna", "Matteo", "Elena", "Davide", "Chiara", "Tommaso", "Irene", "Pietro"]
MAX_ROW = 34
MAX_ROWS = 9


def check_choice(choice, is_right, errs):
    """Exactly one option satisfies `is_right`, and it is the one marked as correct."""
    try:
        flags = [bool(is_right(o)) for o in choice["options"]]
    except ValueError as e:
        errs.append(str(e))
        return
    if sum(flags) != 1:
        errs.append(f"{sum(flags)} right options")
    elif not flags[choice["correct"]]:
        errs.append("the option marked is not the right one")


def labelled(option, table):
    """The id of a text option, checked against the words the table wants in its label. Returns the table's entry."""
    oid = option["values"][0]
    if oid not in table:
        raise ValueError(f"unknown option {oid!r}")
    entry = table[oid]
    words = entry[-1]
    if words.lower() not in option["latex"].lower():
        raise ValueError(f"option {oid} does not say {words!r}")
    if option.get("text") != option["latex"]:
        raise ValueError(f"option {oid}: label and text differ")
    return entry


def check_statements(sample, about, table, errs):
    """A level of true and false statements. `table` maps the id of a statement to (truth, words it contains)."""
    m = re.fullmatch(rf"Quale di queste affermazioni {re.escape(about)} è (vera|falsa)\?", sample["problem"])
    if not m:
        errs.append(f"statement text not recognised: {sample['problem']!r}")
        return None
    want = m.group(1) == "vera"
    check_choice(sample["answer"], lambda o: labelled(o, table)[0] == want, errs)
    return m.group(1)


def narrow(code):
    rows = code["python"].rstrip("\n").split("\n")
    return len(rows) <= MAX_ROWS and all(len(r) <= MAX_ROW for r in rows)


def check_widths(sample, errs):
    """Every program shown, as the question, as an option or with the solution, fits a phone (counted on its Python)."""
    shown = [o["code"] for o in (choice_of(sample) or {}).get("options", []) if "code" in o]
    shown += [sample[k] for k in ("code", "solutionCode") if k in sample]
    if any(not narrow(c) for c in shown):
        errs.append("a program is too wide or too long for a phone")


def without_shown(sample):
    """The sample without the program or the chart under the question: for the levels where what is shown is not
    the reference but a program with a mistake, which the common checks would refuse."""
    return {k: v for k, v in sample.items() if k not in ("code", "chart")}


def text_only(sample, errs):
    if sample["answer"]["kind"] != "choice":
        errs.append("the answer is not a choice")
        return False
    if any("chart" in o or "code" in o for o in sample["answer"]["options"]):
        errs.append("an option is not a text")
        return False
    return True


def outputs(source, tests):
    return [run_chart(source, t) for t in tests]

