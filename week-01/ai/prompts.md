Published link: https://marksanalyser-mxq777.public.builtwithrocket.new  

**My prompts:**

1. Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.
2. remove part that shows failed students and other unneccessary stuff, give only info that I asked 4 parameters
3. Make it when I do next input all the previous inputs deletes automatically so it is new test each time (rolled back to fix after prompt 2*)

---

**Questions AI asked back:**

1. Who will be using this tool?  
Answer: Just me (teacher/educator) (A personal tool to quickly calculate class results)

2. How would you like to enter the student marks?  
Answer: Type them in manually

3. What mark should count as a pass?
Answer: 50% (default)

---
**Rocket's rewritten prompt:**

Thank you for your responses. Your final prompt score is 86%.

I have redrafted your prompt as under and will proceed to execute on the same.

Rocket Enhanced

A personal web tool for educators to process and analyse student marks. The teacher manually enters a list of marks, and the app instantly calculates and displays the class average, highest score, lowest score, and pass rate — using a 50% pass threshold.

Building with Next.js and TypeScript.

---

**Test cases**

**Case A**  
Input: 85, 23, 45, 90, 92  
Output: Total Students 5 marks entered  
Average Score 67.0 class mean  
Highest Score 92 top performer  
Lowest Score 23 needs attention  
Passed 3 / 5 60.0% pass rate  
Failed 2 40.0% fail rate  

**Case B**  
Input: 88, 47, -5, 101, abc, 73, 50, , 100  
Output: Total Students 5 marks entered  
Average Score 71.6 class mean  
Highest Score 100 top performer  
Lowest Score 47 needs attention  
Passed 4 / 5 80.0% pass rate  
Failed 1 20.0% fail rate  

**Case C**  
Input: 10, 20, 30  
Output: Total Students 3 marks entered  
Average Score 20.0 class mean  
Highest Score 30 top performer  
Lowest Score 10 needs attention  
Passed 0 / 3 0.0% pass rate  
Failed 3 100.0% fail rate 

**Case D**  
Input: abc, , xyz  
Output: No valid marks found. Each mark must be 0–100.

---
**What changed after 2nd prompt**  
**AI response:**   
What I did  
Removed charts (GradeDistributionChart, PassFailDonut), MarksRoster, and SummaryBanner from the page  
Simplified StatsGrid to show only the 4 requested cards: Average Score, Highest Score, Lowest Score, and Pass Rate  
Cleaned up page layout to a single-column view with just the input panel and stats grid

**Results:**  
Removed all the unneccessary charts, but also removed block with the number of valid marks.

Huge mistake it removed ability to clear all the past inputs so every new input just adds up to existing stats. It ruins all the next cases.

---
**After 3rd prompt**

It clears previous inputs automatically whenever I touch input bar