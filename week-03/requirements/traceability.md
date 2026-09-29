# Traceability — use cases → stories → criteria

One row per use case. All six rows stay, even the ones with nothing behind them: an empty cell is a
finding you report, not a failure you hide. Use real IDs, comma-separated; write `none` where there
is nothing.

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | AC-01, AC-02, AC-03 | no|
| UC-02 Book room | US-02, US-08 | AC-04, AC-05, AC-06, AC-07, AC-08 |no |
| UC-03 Cancel booking | US-03 | AC-09, AC-10, AC-11 | no|
| UC-04 Block or unblock room | US-05, US-06 | none |no|
| UC-05 Review usage | US-07 | none | no|
| UC-06 Send confirmation | US-04 | none | no|

**Stories that belong to no use case:** none(list the US-nn IDs, or `none`)

**What the gaps tell you:** There is no gaps, every use scenario has use case. Not all UC has AC because as stated in assignment I incuded in prompt only 3 first points (one or two sentences — the long version goes in lab-report.md §8)
