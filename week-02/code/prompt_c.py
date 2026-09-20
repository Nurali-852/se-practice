import unittest


def is_num(x):
    # bool is a subclass of int, so it needs its own check
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def analyze_marks(marks, pass_mark=50):
    if isinstance(marks, str):
        raise ValueError("marks must be a list of numbers")
    marks = list(marks)
    if len(marks) == 0:
        raise ValueError("marks list is empty")

    if not is_num(pass_mark) or not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be a number from 0 to 100")

    for m in marks:
        if not is_num(m):
            raise ValueError(f"non-numeric mark: {m!r}")
        # NaN fails this comparison too, so it is rejected here
        if not 0 <= m <= 100:
            raise ValueError(f"mark out of range (0-100): {m}")

    n = len(marks)
    passed = sum(1 for m in marks if m >= pass_mark)

    return {
        "average": round(sum(marks) / n, 2),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(passed / n * 100, 2),
    }


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([75]),
            {"average": 75, "highest": 75, "lowest": 75, "pass_rate": 100.0},
        )
        self.assertEqual(analyze_marks([30])["pass_rate"], 0.0)

    def test_mark_equal_to_pass_mark(self):
        self.assertEqual(analyze_marks([50])["pass_rate"], 100.0)

    def test_decimals(self):
        self.assertEqual(
            analyze_marks([50.5, 49.5, 70.25]),
            {"average": 56.75, "highest": 70.25, "lowest": 49.5, "pass_rate": 66.67},
        )

    def test_custom_pass_mark(self):
        self.assertEqual(analyze_marks([40, 60, 80], 70)["pass_rate"], 33.33)
        self.assertEqual(analyze_marks([40, 60, 80], 40)["pass_rate"], 100.0)

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "abc", 70])
        with self.assertRaises(ValueError):
            analyze_marks([50, "60"])

    def test_bool_rejected(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, True])

    def test_below_zero(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, -1])

    def test_above_100(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 100.5])

    def test_bad_pass_mark(self):
        with self.assertRaises(ValueError):
            analyze_marks([50], 150)


if __name__ == "__main__":
    unittest.main()

"""
Explanation

The function first checks that the list isn't empty and that pass_mark is valid. Then it checks every mark, raising ValueError on the first bad value. After that it computes the average, max and min, and counts the marks that reach pass_mark to get the pass rate. The tests use only the built-in unittest, so no external libraries are needed. Run them with python filename.py.
"""