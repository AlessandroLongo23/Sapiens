"""Checker for inf-massimo-minimo-media (specs/exercises/inf-massimo-minimo-media.md).

Written from the spec. The largest, the smallest, the sum, the count and the mean are worked out here from the data
in `params` with Python's own `max`, `min`, `sum` and exact fractions, and compared with the right option and with
what the reference program writes when Python runs it (checkers/_inf_programmi.py):
- level 1: the maximum or the minimum of n data; level 3: of a sequence closed by a value, which is not a datum;
- level 2: the program starts from 0: it is wrong on the right option only, where it writes 0;
- level 4: the mean, as an exact fraction, or the quotient without remainder that the program writes;
- levels 5 and 6: the tests of the open answer, with the wanted value in the first place in one and in the last
  place in another.
"""
import re
from fractions import Fraction

from checkers._inf_iter import heads_and_width, is_for, is_while, open_tests
from checkers._inf_programmi import choice_of, common, run_chart

BEST = {"massimo": max, "minimo": min}
CASE_RANGES = {
    1: {"massimo": (0.4, 0.6), "minimo": (0.4, 0.6)},
    2: {"quale": (0.4, 0.6), "scrive": (0.4, 0.6)},
    3: {"giusto": (0.6, 0.8), "in-cima": (0.2, 0.4)},
    4: {"calcolo": (0.4, 0.6), "programma": (0.35, 0.55), "vuota": (0.02, 0.1)},
    5: {"massimo": (0.4, 0.6), "minimo": (0.4, 0.6)},
    6: {"massimo": (0.25, 0.42), "minimo": (0.25, 0.42), "somma-conto": (0.25, 0.42)},
}


def known(inputs):
    """The data of a run that reads its length first."""
    if inputs[0] != len(inputs) - 1 or inputs[0] < 1:
        raise ValueError(f"n is {inputs[0]} and the data are {len(inputs) - 1}")
    return inputs[1:]


def closed(inputs, end):
    """The data of a run closed by `end`, which must come last and only there."""
    if inputs[-1] != end or end in inputs[:-1]:
        raise ValueError(f"the sequence {inputs} is not closed by {end}")
    return inputs[:-1]


def first_and_last(sequences, best):
    """Whether the wanted value comes first in one sequence and last in another, with other data around."""
    first = any(len(d) > 1 and d[0] == best(d) and d.count(best(d)) == 1 for d in sequences)
    last = any(len(d) > 1 and d[-1] == best(d) and d.count(best(d)) == 1 for d in sequences)
    return first and last


def check(sample):
    errors = common(sample)
    p = sample["params"]
    level = sample["level"]
    case = p["case"]
    tests = p.get("tests", [])
    choice = choice_of(sample)
    right = choice["options"][choice["correct"]]
    errors += heads_and_width(sample, choice)
    shown = sample.get("code")

    if level == 1:
        data = known(tests[0])
        want = BEST[case](data)
        if not 4 <= len(data) <= 6 or len(set(data)) != len(data):
            errors.append("from 4 to 6 different data")
        if run_chart(p["source"], tests[0]) != [str(want)] or right["values"][0] != str(want):
            errors.append(f"the {case} is {want}")
        if not (shown and is_for(shown)):
            errors.append("the program is not shown with a for")
        if not re.search(rf"^{case} = \w+$", p["source"], re.M) or re.search(rf"^{case} = 0$", p["source"], re.M):
            errors.append("the program does not start from the first datum")

    if level == 2:
        best = BEST[p["which"]]
        if not re.search(rf"^{p['which']} = 0$", p["source"], re.M):
            errors.append("the program does not start from 0")
        if case == "scrive":
            data = known(tests[0])
            if run_chart(p["source"], tests[0]) != ["0"] or right["values"][0] != "0":
                errors.append("the program should write 0")
            if best(data) == 0 or str(best(data)) not in [o["values"][0] for o in choice["options"]]:
                errors.append("the value the program should find is not among the wrong options")
        else:
            n = tests[0][0]
            for i, o in enumerate(choice["options"]):
                data = [int(x) for x in o["values"][0].split(",")]
                if len(data) != n or [n, *data] not in tests:
                    errors.append(f"option {i} is not one of the sequences of the tests")
                wrong = run_chart(p["source"], [n, *data]) != [str(best(data))]
                if wrong != (i == choice["correct"]):
                    errors.append(f"option {i}: the program is {'wrong' if wrong else 'right'} on it")

    if level == 3:
        data = closed(tests[0], p["end"])
        want = BEST[p["which"]](data)
        got = run_chart(p["source"], tests[0])
        if not 3 <= len(data) <= 5:
            errors.append("from 3 to 5 data")
        if case == "giusto":
            if got != [str(want)] or right["values"][0] != str(want):
                errors.append(f"the {p['which']} is {want}")
        else:
            if got != [str(p["end"])] or right["values"][0] != str(p["end"]):
                errors.append("with the reading at the top the closing value wins")
            if run_chart(p["intended"], tests[0]) != [str(want)]:
                errors.append("the program meant does not find the value")
            if str(want) not in [o["values"][0] for i, o in enumerate(choice["options"]) if i != choice["correct"]]:
                errors.append("what the program should write is not among the wrong options")
        if not (shown and is_while(shown)):
            errors.append("a sequence closed by a value is read with a while")

    if level == 4:
        if case == "calcolo":
            data = p["data"]
            want = Fraction(sum(data), len(data))
            if (want * 100).denominator != 1:
                errors.append("a mean with more than two decimals")
            values = [Fraction(o["values"][0]) for o in choice["options"]]
            if values[choice["correct"]] != want or values.count(want) != 1:
                errors.append(f"the mean is {want}")
            if len(set(values)) != 4:
                errors.append("two options are the same number")
            label = str(float(want)).rstrip("0").rstrip(".").replace(".", ",")
            if right["latex"] != label:
                errors.append(f"the mean is written {right['latex']}, not {label}")
            if "source" in p or shown:
                errors.append("the count on paper has no program")
        else:
            data = closed(tests[0], 0)
            if "/" in p["source"].replace("//", ""):
                errors.append("the program uses the division /")
            if (case == "vuota") != (len(data) == 0):
                errors.append("only the empty case has no data")
            if data and sum(data) % len(data) != 0:
                errors.append("the sum is not a multiple of the count")
            want = str(sum(data) // len(data)) if data else "nessun dato"
            if run_chart(p["source"], tests[0]) != [want] or right["values"][0] != want:
                errors.append(f"the program writes {want}")

    if level == 5:
        best = BEST[case]
        sequences = [known(t) for t in tests]
        errors += open_tests(sample, [(t, [best(d)]) for t, d in zip(tests, sequences)])
        if not first_and_last(sequences, best):
            errors.append("a test with the wanted value first and one with it last are needed")
        if sample["answer"]["kind"] != "chart":
            errors.append("level 5 asks for a chart")
        if not all("code" in o and is_for(o["code"]) for o in choice["options"]):
            errors.append("level 5 offers programs with a for")

    if level == 6:
        sequences = [closed(t, p["end"]) for t in tests]
        if case == "somma-conto":
            want = [(t, [sum(d), len(d)]) for t, d in zip(tests, sequences)]
        else:
            want = [(t, [BEST[case](d)]) for t, d in zip(tests, sequences)]
        if not first_and_last(sequences, BEST.get(case, max)):
            errors.append("a test with the largest first and one with it last are needed")
        errors += open_tests(sample, want)
        if sample["answer"]["kind"] != "program" or not is_while(sample["answer"]["solution"]):
            errors.append("level 6 asks for a program, solved with a while")
        if not all("code" in o and is_while(o["code"]) for o in choice["options"]):
            errors.append("level 6 offers programs with a while")
        if sample["answer"]["start"]["python"].startswith("\n"):
            errors.append("the editor opens on an empty row")
    return errors, case
