# Week 01 — Manual vs AI: Comparison

**Name: Nurali Myrzaly**
**Group: Mon 16:00 - 19:00**
**Date: 14.09.2026**

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used |Python |Next.js and TypeScript |
| Time to first version that ran |10 min| 5 min|
| Time to all 4 test cases passing | 20 min| 5min|
| Number of attempts / prompts needed | 4| 3|
| Lines of code you actually wrote |27| 0|
| Did it handle invalid marks (case B)? |Yes| Yes|
| Did it handle an empty list (case D)? |Yes| Yes|
| Did it use the ≥ 50 pass threshold? |Yes| Yes|
| Output format matches the spec? |Yes| No|
| Can you explain every line of it? |Yes| No|

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` |Valid: 5 Average: 67.0 Highest: 92 Lowest: 23 Passing rate: 60.0% |Valid 5 Average 67.0 Highest 92 Lowest 23 Passing rate 60.0% | avg 67.00 · high 92 · low 23 · pass 60.0% |Partly (avg 2 dec) |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` |Valid: 5 Average: 71.6 Highest: 100 Lowest: 47 Passing rate: 80.0% |Valid 5 Average 71.6 Highest 100 Lowest 47 Passing rate 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% |Partly (avg 2 dec) |
| C | `10, 20, 30` |Valid: 3 Average: 20.0 Highest: 30 Lowest: 10 Passing rate: 0.0% |Valid 3 Average 20.0 Highest 30 Lowest 10 Passing rate 0.0% | avg 20.00 · high 30 · low 10 · pass 0.0% |Partly (avg 2 dec) |
| D | `abc, , xyz` |Failed the course |No valid marks found. Each mark must be 0–100. | clear message, no crash |Yes |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->

- AI chose tech stack and design by itself
- Charts, graphs
- Ability to delete some marks
- Separate block for failed students
- Single input

## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

- Output type: 2 dec. points for avg.
- Stacked all cases of inputs

## 5. The defect I asked Rocket to fix

**Prompt I used:**
remove part that shows failed students and other unneccessary stuff, give only info that I asked 4 parameters

**Result:** (fixed / partly fixed / broke something else) Removed all the unneccessary charts, but also removed block with the number of valid marks.

Huge mistake it removed ability to clear all the past inputs so every new input just adds up to existing stats. It ruins all the next cases.

Then I had to do another prompt to fix it.

**What this tells me:**
To be very precise and specific in my prompts. Cause I can miss important part of project just by not mentioning it. For example that I need new session for each new input.
---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?

<!-- Write your reflection below this line -->
**Answers**
1. All coding part and setting up frameworks. AI initialized all venvs and other things itself and send almost ready project, that just needed some adjustments for specific conditions and preferences. I didn't even spend time thinking about layout and style. AI made all the visual and also technical side of an web app.
2. Too much unneccessary parts like charts and also functions that i didn't ask for. For example ability to delete certain marks and making separate input logic for single mark and multiple.
3. If choosing between my work and AI. I would choose AI, cause its ready to use fully developed web app. When my work is just some piece of code that only does one function with no interface and visual.
4. For functionality and final image of a product. Beecause all monotonic coding job can be done by AI, but thinking about functionality human can say what other human wants in an app. And engineer should double check whether the function works or not, cause AI tend to miss some points or twist them if not specifically stated. It is normal for AI to make mistakes, because humans cannot create perfect prompt. Also final image not only visual it is how product works under different conditions. AI cannot think out of the box so there is always new ways to grow product that humans can think of their own experience or creativity.