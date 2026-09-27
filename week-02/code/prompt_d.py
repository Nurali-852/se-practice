import math


def _validate_number(value, name="mark"):
    """Return value if it is a real number from 0 to 100, else raise ValueError."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{name} must be a number, got {value!r}")
    if not math.isfinite(value):
        raise ValueError(f"{name} must be finite, got {value!r}")
    if not 0 <= value <= 100:
        raise ValueError(f"{name} must be between 0 and 100, got {value!r}")
    return value


def _tidy(x):
    """Round to 2 decimals; drop the decimals if the result is whole."""
    x = round(x, 2)
    return int(x) if x == int(x) else x


def analyze_marks(marks, pass_mark=50):
    if isinstance(marks, (str, bytes)):
        raise ValueError("marks must be a list, tuple or generator of numbers, not a string")
    try:
        values = list(marks)
    except TypeError:
        raise ValueError("marks must be an iterable of numbers") from None

    if not values:
        raise ValueError("marks must not be empty")

    _validate_number(pass_mark, "pass_mark")
    for m in values:
        _validate_number(m)

    passed = sum(1 for m in values if m >= pass_mark)

    return {
        "average": _tidy(sum(values) / len(values)),
        "highest": max(values),
        "lowest": min(values),
        "pass_rate": _tidy(passed / len(values) * 100),
    }


# ---------------------------- tests ----------------------------
import unittest


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([75]),
            {"average": 75, "highest": 75, "lowest": 75, "pass_rate": 100},
        )

    def test_decimals(self):
        self.assertEqual(
            analyze_marks([55.5, 60.25, 70.75]),
            {"average": 62.17, "highest": 70.75, "lowest": 55.5, "pass_rate": 100},
        )

    def test_custom_pass_mark(self):
        self.assertEqual(analyze_marks([40, 60, 80], 70)["pass_rate"], 33.33)

    def test_mark_equal_to_pass_mark_passes(self):
        self.assertEqual(analyze_marks([50, 49], 50)["pass_rate"], 50)

    def test_tuple_and_generator(self):
        self.assertEqual(analyze_marks((40, 60, 80))["average"], 60)
        self.assertEqual(analyze_marks(m for m in [40, 60, 80])["highest"], 80)

    def test_boundaries_accepted(self):
        r = analyze_marks([0, 100])
        self.assertEqual((r["lowest"], r["highest"]), (0, 100))

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "abc"])
        with self.assertRaises(ValueError):
            analyze_marks(["50"])

    def test_plain_string_rejected(self):
        with self.assertRaises(ValueError):
            analyze_marks("123")

    def test_below_zero_or_above_100(self):
        for bad in ([-1], [101], [50, -0.1], [50, 100.5]):
            with self.assertRaises(ValueError):
                analyze_marks(bad)

    def test_bool_nan_inf_rejected(self):
        for bad in ([True], [False], [float("nan")], [float("inf")], [float("-inf")]):
            with self.assertRaises(ValueError):
                analyze_marks(bad)

    def test_invalid_pass_mark(self):
        for bad in (-1, 101, "50", None, True, float("nan"), float("inf")):
            with self.assertRaises(ValueError):
                analyze_marks([50], bad)


if __name__ == "__main__":
    unittest.main()

"""
Explanation

Validation: one helper checks every mark and pass_mark. It rejects non-numbers, bool, NaN, infinity, and anything outside 0–100.
Input handling: strings and bytes are rejected up front so "123" isn't read as three marks. Everything else is converted to a list, which lets generators work and makes the empty check easy. Non-iterables raise ValueError too.
Output: average and pass_rate are rounded to 2 decimals, and whole values come back as ints (60, not 60.0). A mark counts as a pass when >= pass_mark.
Highest and lowest: these are returned exactly as given.
"""