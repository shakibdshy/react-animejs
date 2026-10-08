# Display type scaled down for the blocks stage convention

The Hungry Tiger brand reference specifies display headlines at 195/101/65/29px and states that
they must never be "downsized into body territory". Every block on the `/blocks` page renders into
a bounded stage capped at `min(74vh, 640px)` — a convention 25 existing blocks follow, so a 195px
headline cannot fit without breaking it. We scale only the display sizes down by roughly 0.62
(195 → 120, 101 → 62, 65 → 40, 29 → 22) and deliberately leave small UI sizes at 11–18px, because
uniform scaling would render 13px button labels at roughly 8px.

Considered and rejected: authoring the page at 1440px and fitting it with a `transform: scale()`
measured by `ResizeObserver`, which would preserve the source numbers exactly but introduces the
only scaled-stage pattern in the codebase and makes the block architecturally unlike its 25
siblings; and rendering full-viewport sections in the page flow like the `ButterScroll` exception,
which preserves the type but breaks the gallery's stated purpose of copy-pasteable self-contained
units.

A future reader comparing this block against `hungry-tiger.design.md` will see a ~120px headline
where the reference says 195px. That is not a mistake — do not "fix" it.