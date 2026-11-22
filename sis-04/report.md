# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

## 1. Setup and starting point

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT|
| Assistant model | not displayed |
| Starting point | starter |
| Baseline commit | 0e86f8a |
| Language (ts or js) | ts |
| Vitest version | vitest/5.1.1 |
| Where I ran the tests | Local machine, VS Code terminal, Windows (win32-x64), Node v24.14.1 |

### 1.1 Baseline run

```text
RUN  v3.2.7 C:/Users/nural/Desktop/se-practice/sis-04/app

No test files found, exiting with code 1
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
index.html        — HTML entry, #root, loads /src/main.tsx  

package.json      — scripts dev/build/test (vitest run); React 18, Vite 5, Vitest  

tsconfig.json     — strict TypeScript, compiles src/ only  

vite.config.ts    — Vite with the React plugin  

src/main.tsx      — mounts <App /> in StrictMode, imports index.css  

src/App.tsx       — the whole app: Room type, ROOMS (2 rooms), toMinutes/fmt helpers, form state, check() with all AC rules inline, rendering  

src/index.css     — styles; at <=480px the form stacks in one column
```

### 2.2 The context message as sent

```text
I am extending a small React + TypeScript + Vite app, "Smart Campus Room Availability Checker".

Repository map:
index.html        — HTML entry, #root, loads /src/main.tsx  

package.json      — scripts dev/build/test (vitest run); React 18, Vite 5, Vitest  

tsconfig.json     — strict TypeScript, compiles src/ only  

vite.config.ts    — Vite with the React plugin  

src/main.tsx      — mounts <App /> in StrictMode, imports index.css  

src/App.tsx       — the whole app: Room type, ROOMS (2 rooms), toMinutes/fmt helpers, form state, check() with all AC rules inline, rendering  

src/index.css     — styles; at <=480px the form stacks in one column

Requirements to preserve (AC1–AC6):
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

New requirements:
Catalog of at least 4 fictional rooms, each with id, name, capacity, equipment list, blocked status, own bookings. Show only rooms that match the user's filters. The availability check must use the chosen room's bookings.
F1 Capacity filter: room capacity >= requested attendees.
F2 Equipment filter: the room must contain ALL selected items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result.

Constraints: no login, payments, live APIs or database; fictional data only.
Target modules: src/rooms.ts, src/filter.ts (filterRooms), src/booking.ts (canBook unchanged in behaviour, checkRoom(rooms, roomId, request)), App.tsx without room data or rules.

Task now: list maintainability risks, each with file/function reference, and propose a plan of small steps. Give a plan, not a full rewrite, and no code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | `blocked` is a page-level checkbox, not a property of the selected room, so a blocked room cannot be handled per room (AC3, F3) | `src/App.tsx`, `check()` and `useState(blocked)` | `check()` uses `else if (blocked) ok = false;` from the checkbox state; the `blocked` field of each entry in `ROOMS` is never read | High |
| 2 | All availability rules (AC1–AC4) live inside the React component, so they cannot be tested without rendering the page | `src/App.tsx`, `check()` | The whole rule ladder (`let ok = true; … else if (e - s > 120) …`) sits in `check()` next to `setResult`; there is no `canBook` and no test file | High |
| 3 | Changing the room does not clear the previous result, so an old "Available" stays on screen for another room (F5) | `src/App.tsx`, room `<select>` | `onChange={e => setRoomId(e.target.value)}` does not call `setResult(null)` | High |
| 4 | Room data and model are inside the UI file and too small for the new feature | `src/App.tsx`, `type Room` and `ROOMS` | `Room` has no `capacity` or `equipment`; `ROOMS` has only 2 rooms and is declared in `App.tsx` | Medium |

### 3.2 Improvement plan — before editing

1. Move the rule ladder from `check()` into `src/booking.ts` as `canBook({ start, end, now, blocked, bookings })` with unchanged behaviour. Write the AC1–AC5 and B1–B4 tests first and keep them green.
2. Move `Room` and `ROOMS` into `src/rooms.ts`; add `capacity` and `equipment` and at least four fictional rooms, each with its own bookings and `blocked` value.
3. Write the F1, F2, F4, B5 and B6 tests first, then add `filterRooms` in `src/filter.ts` (`every` for equipment).
4. Write the F3, F5 and INT tests first, then add `checkRoom` in `src/booking.ts`, which finds the room by id and calls `canBook` with that room's own `blocked` and `bookings`; an unknown id is not available.
5. Rewire `src/App.tsx`: remove the global "Room blocked" checkbox, add the attendees and equipment filters and the empty state, call `checkRoom`, reset the result when the room changes. Then remove the remaining duplicated validation, draw the diagrams and finish the report.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Step 3 of the plan: `filterRooms()` should also implement "F3: blocked rooms must not be presented as available" and return only rooms matching all filters | Modified | F3 is about the availability result, not about filtering by capacity and equipment. So `filterRooms` in `src/filter.ts` will only do F1 and F2, and F3 will be handled by `checkRoom`/`canBook` (AC3). My F3 test will call `checkRoom` with a blocked room and expect `false`. |

## 4. Feature extension (Task 2)

### 4.1 What I added

The catalog has 4 fictional rooms (A-101, B-204, C-305, D-410) with capacities from 12 to 40 and equipment chosen from Computers, Microphone, Projector, Smart Board and Whiteboard; D-410 is blocked. The filter is chosen on the page with a number field for attendees and one checkbox per equipment item. The room list shows only rooms that match both filters, and a room is picked with a radio button. Blocked rooms stay in the list with a "(blocked)" label but are never reported as available. When no room matches, the page shows "No rooms match your selected capacity and equipment filters. Try changing your filters." When the room, the filters or the times change, the old result and error are cleared, and the next check uses only the bookings of the selected room.

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees 15 with Projector and Whiteboard selected: only Room A-101 and Room B-204 are listed. |
| `evidence/filter-empty.png` | Attendees 50: no room matches and the empty-state message is shown. |
| `evidence/switch-a.png` | Room A-101 selected, current time 09:00, start 10:30, end 11:30: result Unavailable (it is booked 10:00–11:00). |
| `evidence/switch-b.png` | The same times with Room B-204 selected: result Available (no bookings). |
| `evidence/narrow.png` | The page at phone width in portrait: the form is one column and the room list and result stay readable. |

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | The `Room` type, the catalog `ROOMS` (4 fictional rooms) and the derived list `EQUIPMENT`; data only. |
| `src/booking.ts` | The availability rules: `canBook` (AC1–AC5) and `checkRoom`, which finds the chosen room and calls `canBook` with that room's own `blocked` and `bookings` (F3, F5). |
| `src/filter.ts` | `filterRooms`: capacity ≥ attendees (F1) and ALL selected equipment (F2). No availability rule. |
| `src/App.tsx` | The page: form state, filters, room list, empty state, feedback; imports the rules and holds no room data or rule of its own. |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Blocked rooms stay in the filtered list with a "(blocked)" label; `filterRooms` does not look at `blocked` | Hide blocked rooms inside `filterRooms` | F3 is about the availability result, so it belongs to `checkRoom`/`canBook` (AC3). The user sees why a room cannot be booked, and my F3 test checks `checkRoom` on a blocked room. |
| `checkRoom(rooms, roomId, request)` takes the whole catalog and calls `canBook` | `App.tsx` reads the room and passes its `blocked` and `bookings` to `canBook` itself | The page then has no rule of its own, and the F5 test can prove that the chosen room's data decides the result (two rooms, same times, different results). |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/App.tsx`, `check()`: the start-before-end condition was validated twice (`if (!(s < e)) setError(...)` and inside the `0 <= s && s < e && e <= 1440` rule) | The rule is only in `canBook` in `src/booking.ts`; `App.tsx` has one early return for the message |
| `src/App.tsx`: the blocked status existed in two places, the "Room blocked" checkbox and `blocked` in each `ROOMS` entry (the entry's value was never read) | One source: `room.blocked` in `src/rooms.ts`, read by `checkRoom` |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `T01 AC1: rejects a start time equal to the end time` (booking.test.ts; also T02 and T03) | start 600, end 600, now 500 -- `false` |
| AC2 | `T04 AC2: rejects a duration exceeding 120 minutes` (booking.test.ts) | start 600, end 721 -- `false` |
| AC3 | `T05 AC3: rejects a blocked room` (booking.test.ts) | blocked room, 600–660 -- `false` |
| AC4 | `T06 AC4: rejects overlapping bookings` and `T07 AC4: allows bookings that touch at endpoints` (booking.test.ts) | 620–680 against 600–660 -- `false`; 660–720 against 600–660 -- `true` |
| AC5 | `T08 AC5: does not mutate existing bookings` (booking.test.ts) | bookings array after `canBook` equals its copy from before |
| F1 | `T01 F1: includes rooms with sufficient capacity` (filter.test.ts) | 20 attendees -- rooms r1 and r2 |
| F2 | `T02 F2: requires all selected equipment items` (filter.test.ts) | Projector + Whiteboard -- only r1 |
| F3 | `T01 F3: never reports a blocked room as available` (checkroom.test.ts) | blocked room r1, 610–650 -- `false` |
| F4 | `T03 F4: returns an empty array when nothing matches` (filter.test.ts) | 100 attendees -- `[]` |
| F5 | `T02 F5: checks the selected room own bookings` (checkroom.test.ts) | same times: r2 (booked 600–660) -- `false`, r3 (no bookings) -- `true` |
| B1 | `T09 B1 AC2: allows exactly 120 minutes` (booking.test.ts) | 600–720 -- `true` |
| B2 | `T10 B2 AC2: rejects 121 minutes` (booking.test.ts) | 600–721 -- `false` |
| B3 | `T11 B3 AC4: allows a booking starting at an existing endpoint` (booking.test.ts) | 660–720 against 600–660 -- `true` |
| B4 | `T12 B4 AC4: rejects a booking that overlaps an existing interval` (booking.test.ts) | 650–710 against 600–660 -- `false` |
| B5 | `T04 B5 F1: includes a room when capacity equals attendees` (filter.test.ts) | 30 attendees, room with capacity 30 -- included |
| B6 | `T05 B6 F1: excludes a room when capacity is one below attendees` (filter.test.ts) | 21 attendees, room with capacity 20 -- excluded |
| INT | `T05 INT: filters rooms before checking the returned room` (checkroom.test.ts) | `filterRooms` (25 attendees, Whiteboard) -- r3, then `checkRoom` on r3 -- `true` |

### 6.2 Commands

```text
cd sis-04/app
npm install
npx vitest run
npm run build
```

### 6.3 Final run

```text
 RUN  v3.2.7 C:/Users/nural/Desktop/se-practice/sis-04/app

 ✓ src/filter.test.ts (5 tests) 3ms
 ✓ src/booking.test.ts (12 tests) 3ms
 ✓ src/checkroom.test.ts (5 tests) 3ms

 Test Files  3 passed (3)
      Tests  22 passed (22)
   Start at  20:56:53
   Duration  456ms (transform 85ms, setup 0ms, collect 145ms, tests 9ms, environment 0ms, prepare 363ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
