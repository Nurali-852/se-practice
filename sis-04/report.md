# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

## 1. Setup and starting point

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT|
| Assistant model | not displayed |
| Starting point | starter |
| Baseline commit | 0e86f8a |
| Language (ts or js) | ts |
| Vitest version | v3.2.7 |
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

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 0/0 | 22/22 | `Tests` line of the runs in 1.1 and 6.3 |
| Duplicated logic locations removed | 0 | 2 | counted in 5.3 (git diff of `src/App.tsx`) |
| Code structure: modules and their responsibilities | 1 file with logic: `App.tsx` holds the Room type, ROOMS, all availability rules and the UI | 4 parts: `rooms.ts` (data), `booking.ts` (AC1–AC5 rules, `checkRoom`), `filter.ts` (F1, F2), `App.tsx` (UI only) | `git ls-files app/src` before and after, read against 5.1 |
| Remaining limitation | The rules could not be tested at all: they lived inside `check()` in the component | F4 and F5 on the page are confirmed only by screenshots and manual use; all 22 tests call the modules and none renders the page | the three test files import only `./booking`, `./filter` and `./rooms`; no rendering library is in `package.json` |

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** ChatGPT, not displayed  
**Date:** 22.11.2026  
**Purpose:** Codebase analysis (Task 1): maintainability risks of the starter and a plan of small steps, no code.

**Prompt:**

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

**Output used:**

```text
Validation flow: In `check()`, the invalid start/end condition sets an error but does not immediately return. The function continues and can still display an availability result. […]
Stale availability result: Changing the selected room does not automatically refresh the previous result. This conflicts with F5. […]
| 4 | `src/App.tsx` — `check()` | The `blocked` state is separate from the selected room's actual blocked status. | The application can potentially report availability based on a manually controlled checkbox rather than room data. |
[…]
Step 3 — Implement room filtering. File: `src/filter.ts`. Create `filterRooms()`. Implement F1 […] Implement F2 […] Implement F3: blocked rooms must not be presented as available.
```

**Problems found:** The assistant put F3 (blocked rooms) into `filterRooms`, but F3 is about the availability result, so it belongs to `checkRoom`/`canBook` (AC3). It also described the `blocked` problem only as "potentially"; in `App.tsx` I confirmed it is certain, because `check()` reads the checkbox state and the `blocked` field of `ROOMS` is never used. Its list also contained weak items (for example `main.tsx`, which it itself called acceptable).  
**Changes made:** Wrote 3.1 from four risks that I located myself in `App.tsx`; modified the F3 step (recorded in 3.3) so that `filterRooms` does only F1 and F2.  
**Verified by:** Reading `src/App.tsx`: `else if (blocked) ok = false;`, `useState(false)` for `blocked`, no `return` after `setError(...)`, no `setResult(null)` in the room `onChange`. These were later confirmed by the `git diff` of `App.tsx` against the baseline commit.

### 8.2 Exchange 2

**Tool and model:** ChatGPT, not displayed  
**Date:** 22.11.2026  
**Purpose:** Implementation of the plan in four steps (booking rules, catalog and filter, `checkRoom`, `App.tsx`), tests first.

**Prompt:**

```text
Implement your plan in order, in ONE answer but as separate numbered steps. For every step give only the files for that step, tests first. I will apply, run and commit each step separately, so do not merge steps and do not rewrite files outside the step.

Step 1: src/booking.test.ts, then src/booking.ts with canBook({ start, end, now, blocked, bookings }): boolean. Move the rule ladder from check() in App.tsx WITHOUT changing behaviour (AC1 start < end and not in the past, AC2 max 120 minutes, AC3 blocked, AC4 overlap rejected but touching allowed, AC5 no mutation of bookings). Tests: AC1, AC2, AC3, AC4, AC5, B1 (exactly 120 -> true), B2 (121 -> false), B3 (touching -> true), B4 (overlapping -> false).

Step 2: src/rooms.ts with type Room = { id, name, capacity, equipment: string[], blocked, bookings: {start, end}[] }, const ROOMS with 4 fictional rooms (every field filled, one blocked), and EQUIPMENT built from ROOMS. Then src/filter.test.ts (a fixed catalog inside the file, do not import ROOMS) and src/filter.ts with filterRooms(rooms, { attendees, equipment }): F1 capacity >= attendees, F2 the room must have ALL selected equipment (every, not some), F4 empty result when nothing matches. Tests: F1, F2, F4, B5 (capacity equal to attendees is included), B6 (one below is excluded). Do NOT put the blocked rule in filterRooms.

Step 3: src/checkroom.test.ts (fixed catalog inside the file), then checkRoom(rooms, roomId, { start, end, now }): boolean added to src/booking.ts. It finds the room by id and calls canBook with THAT room's own blocked and bookings; unknown id returns false; no mutation. Tests: F3 (blocked room never available), F5 (same times, two rooms, different results), unknown id, INT (filterRooms then checkRoom on what it returned).

Step 4: rewrite src/App.tsx so it holds no room data and no rules, only imports from ./rooms, ./filter and ./booking. Remove the global "Room blocked" checkbox. Add an attendees input and one checkbox per equipment item, show only rooms from filterRooms (radio selection, blocked rooms stay listed with a "(blocked)" label), a clear empty-state message (F4), clear the old result and error when the room or filters change (F5), return after a start >= end error so no result is shown with it, and show the selected room's bookings. Also give small CSS additions for src/index.css and keep the 480px breakpoint.

Rules for all tests: Vitest, real modules, no mocks, no .skip/.only/.todo/test.each, one test per case, each title starts with its IDs as words (for example 'T04 B1 AC2: exactly 120 minutes is available'), expected values come from the requirements, not from the code.
```

**Output used:**

```text
export function checkRoom(
  rooms: readonly Room[],
  roomId: string,
  request: CheckRoomRequest
): boolean {
  const room = rooms.find((item) => item.id === roomId);
  if (!room) { return false; }
  return canBook({ ...request, blocked: room.blocked, bookings: room.bookings });
}
[…]
Important: There is deliberately no `blocked` condition in `filterRooms()`. Blocked rooms remain visible if they satisfy the user's filters. Their availability is handled separately in Step 3.
```

**Problems found:** In `rooms.ts` it imports `Interval` from `booking.ts` while `booking.ts` imports `Room` from `rooms.ts`, a circular type import.  
**Changes made:** kept as generated  
**Verified by:** `npx vitest run` in `app/`: 3 files, 22 tests passed (22);

### 8.3 Exchange 3

**Tool and model:** ChatGPT, not displayed  
**Date:** 22.11.2026  
**Purpose:** Review of the final `booking.ts`, `filter.ts` and `rooms.ts` against AC1–AC5 and F1–F5.

**Prompt:**

```text
Review my final src/booking.ts, src/filter.ts and checkRoom against AC1–AC5 and F1–F5. List only concrete defects with the line, no rewrite.
```

**Output used:**

```text
1. `src/booking.ts:26`**&#x20;— AC1:** `start > now` rejects a booking starting at exactly the current time. AC1 requires rejecting requests in the past, so a start equal to `now` should not be rejected for this reason.

No other concrete defects found in the supplied files:

- AC2–AC5: satisfied.
- F1–F2: satisfied by `filterRooms()`.
- F3: satisfied by `checkRoom()`.
- F4: satisfied; no matches produce an empty array.
- F5: cannot be verified from these files alone; it depends on how `App.tsx` handles room selection and availability-result state.
```

**Problems found:** The one defect it reported is a debatable reading of AC1, not a bug: the strict `start > now` rule comes from the starter (`!(s > n)` in the original `check()`), and the task says `canBook` must keep its behaviour, so changing it to `>=` would alter AC1 as it was before my refactoring. It could not judge F5 from the three files, which agrees with my own limitation in section 7 (F5 on the page is shown only by screenshots).  
**Changes made:** None. I rejected the suggestion and kept `start > now`.  
**Verified by:** Reading the baseline `check()` in `App.tsx` (`else if (!(s > n)) ok = false;`) and my test `T03 AC1: rejects a request starting in the past` (start 500, now 500 expects `false`), which would fail after the suggested change; `npx vitest run`: 22 passed (22).

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| pass=33 | none |

## 10. AI reflection (Task 6)

During this work, I gave the AI the project structure, acceptance criteria AC1–AC6, functional requirements F1–F5, and the main limitations: no login, external APIs, or database. I first asked for a plan without code so I could divide the work into smaller steps and implement them gradually.

The AI was useful for separating the application logic into different modules, such as booking validation, room filtering, and room data. However, its suggestions still needed to be checked. For example, I noticed that `start > now` rejects bookings starting exactly at the current time, even though AC1 only requires rejecting past times. This showed me that small details can affect the application's behaviour.

I personally checked whether each function followed its intended responsibility. Filtering should consider room capacity and all selected equipment, while availability checking should consider blocked rooms and their own bookings. I also paid attention to whether changing rooms could affect the availability result.

Tests helped me verify important boundary cases, especially bookings lasting 120 versus 121 minutes, overlapping versus touching time intervals, and room capacity being equal to or one place below the number of attendees. These checks helped protect the original requirements while moving the logic into separate files.

In the future, I would add UI tests to check room selection, filter changes, and empty states. Overall, AI helped me organize the code and find possible issues, but I still had to review its suggestions and make sure they matched the requirements.
