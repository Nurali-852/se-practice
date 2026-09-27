# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Nurali Myrzaly
**Group:** Monday 16:00-19:00
**Date:** 20.09.2026

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | Claude|
| Exact model name | Sonnet 5|
| Implementation language | Python|
| Date of the runs | 20.09.2026|

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
(paste here, or write "n/a — used Python")
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Gave code with ready sample data, so for the input I should edit code
2. Created grading policy and applied letter format for each
3. Added feature that student can have multiple grades, cause there are multiple subjects that you can add or edit
4. Gave threshold for pass as (>=50)
5. Outputs and data are numbers which is correct, but it not only gives class stats, but also individual marks for subjects and performance as who is the best and who needs help.

**Questions it should have asked and did not:**

1. What type of input and output you expect?
2. What is the threshold for passing?
3. Do you need letter format grading policy?

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it
called:  
There is no function 'analyze_marks', instead it just imports statistic tools from built in library

**First impression before testing** (one sentence — you will compare this with section 6 later):  
Not suitable for testing because I have to manualy edit my code to input new data, but analyzes marks from sample, so it works

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. I have only one array for marks as intended, not extra array for each subject
2. Validation for marks that are out of range or are not valid type
3. Output clean and shows only class stats

**What B still leaves open:**

1. For the input I still have to edit the code
2. Thus not enough test cases to check

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | Yes|
| decimals | Yes|
| custom pass_mark | Yes|
| empty list | Yes|
| text value | Yes|
| below 0 / above 100 | Yes|

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes / no — if no, where do they disagree:

**Assumptions C stated explicitly before the code:**  
Assumptions

pass_rate is a percentage (0-100), and average and pass_rate are rounded to 2 decimals.
A mark equal to pass_mark counts as a pass (>=).
True/False are rejected as non-numeric, even though Python treats them as ints. NaN and infinity are also rejected.
pass_mark is validated the same way as the marks (a number from 0 to 100), and an invalid one raises ValueError.
marks can be any list, tuple or generator of numbers. A plain string is not treated as a list of marks and raises ValueError.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
"average", "highest", "lowest", and "pass_rate" in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation. pass_rate is a percentage (0-100), and average and pass_rate are rounded to 2 decimals, if .00 just drop it. A mark equal to pass_mark counts as a pass (>=). True/False, NaN and infinity are rejected. pass_mark is validated the same way as the marks (a number from 0 to 100), and an invalid one raises ValueError. marks can be any list, tuple or generator of numbers. A plain string is not treated as a list of marks and raises ValueError.
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list, text value, and marks below 0 or above 100.
```

**What I deliberately added that A, B and C did not have:**

1. True/False, NaN and infinity are rejected
2. pass_mark is validated the same way as the marks (a number from 0 to 100), and an invalid one raises ValueError
3. pass_rate is a percentage (0-100), and average and pass_rate are rounded to 2 decimals, if .00 just drop it

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**  
Assumptions that AI made from prompt C were correct way to specify output and validation so I just added that assumptions to prompt

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | | | | |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | | | | |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | | | | |
| 4 | `analyze_marks([], 50)` | raises ValueError | | | | |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | | | | |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | | | | |
| | **Totals** | | /6 | /6 | /6 | /6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A|all 6| ERROR for all cases cause there is no function that needed|
| B| all 6| PASS|
| C| all 6| PASS|
| D| all 6| PASS|

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
=== Student averages ===
Dana        92.75  A
Aigerim     86.25  B
Ruslan      86.00  B
Timur       73.75  C
Arman       62.50  C
Madina      53.75  D

=== Subject averages ===
Math     avg=74.17  max=95  min=45
Physics  avg=73.83  max=92  min=50
Kazakh   avg=77.67  max=91  min=62
English  avg=77.67  max=97  min=58

Best student:  Dana (92.75)
Worst student: Madina (53.75)

Class mean:   75.83
Class median: 78.5
Std dev:      15.19

=== Grade distribution ===
A: # (1)
B: ## (2)
C: ## (2)
D: # (1)
F:  (0)

=== Need help (mark < 50) ===
Madina -> Math
ERROR: code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
{'average': 57.0, 'highest': 88, 'lowest': 32, 'pass_rate': 60.0}
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks list is empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric value: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================
```

**Prompt C**

```
========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks list is empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_c.py)
========================================================================
```

**Prompt D**

```
========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100, highest=100, lowest=100, pass_rate=100
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: mark must be a number, got '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark must be between 0 and 100, got -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0| 2| 2| 2|
| Requirement coverage | 0| 2| 2| 2|
| Verifiability (tests) | 0| 2| 2| 2|
| Assumptions stated | 0| 1| 2| 2|
| Noise (2 = none) | 0| 1| 1| 2|
| **Total / 10** | 0| 8| 9| 10|

**Prompt length, in words:** A 7 words · B 49 words · C 84 words · D 157 words

**Words added per point gained** — B over A = 5.25, C over B = 35, D over C = 73. One line on what that ratio says: For every point even higher we need more words to specify our prompt

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
1. Prompt D scored the best, but it is because it has more specification and may be my sujective point of view. But for effectivenes I would choose Prompt C, because It states main request in 2 times less words and asks for all the assumptions made. In prompt D I just added those assumptions into specification. But in other cases I would just write like prompt C, and then looking at result just send new message whether I need to modify that one specific assumption.
2. Prompt B added role and specified function that I needed, it dramatically increased the score and AI almost perfect response in terms of effectivenese because small adjustment brought what I needed
3. Prompt A was pure noise, because it had no specification at all. So AI brought all things by itself starting from data type to outputing and extra info
Also, prompt C added some extra tests that I didn't write to check.
4. In prompt D I added to Prompt C assumptions that AI correctly made that aligned with required output and validation

```

**Word count:** 168

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.
2.
