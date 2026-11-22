# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
|ChatGPT |not displayed, free plan |22.11.2026 | codebase analysis (Task 1) |none (analysis only) |
|ChatGPT |not displayed, free plan |22.11.2026 | improvement plan | none |
|ChatGPT |not displayed, free plan |22.11.2026 | feature extension (Task 2) |`app/src/booking.ts`, `rooms.ts`, `filter.ts`, `App.tsx`, `index.css` |
|ChatGPT |not displayed, free plan |22.11.2026 | refactoring (Task 3) |`App.tsx`, `index.css` |
|ChatGPT |not displayed, free plan |22.11.2026 | tests (Task 4) |`app/src/booking.test.ts`, `filter.test.ts`, `checkroom.test.ts` |

**The assistant wrote, or helped write, tests in `app/`:** yes

ChatGPT generated the three test files. I checked that the expected values come from the requirements and not from the code: 120 minutes is available and 121 is rejected (AC2, B1, B2), touching an existing booking is available and overlapping is rejected (AC4, B3, B4), capacity equal to the attendees is included and one below is excluded (F1, B5, B6), a blocked room is never available (F3), and the same times give different results for two rooms (F5).

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**
Nothing

Signed: Nurali
Date: 22.11.2026
