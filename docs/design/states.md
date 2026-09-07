# States

Cap: 300 words. Every screen passes this list before it is done. Generated mockups never show these, which is why real products fail at them.

## The five

**Empty.** Nothing yet. Name what is missing, say how the first one arrives, give the action.

**Loading.** Including the Neon cold start, which is real and needs a skeleton rather than a spinner. A button that starts work spins in place instead. When the work was asked for in a modal, the modal holds open until it resolves, so nobody is left guessing whether it happened.

**Error.** The save failed. The record was changed by someone else while you typed. The network went away.

**Full.** Every slot taken, every seat used. A success for the business and a dead end for the person, so it needs a next step rather than an apology.

**Overflowing.** Sixteen rows where you expected three, names that wrap to two lines, a missing optional field, a record with no owner.

## The test

Design against the worst realistic day, not the tidiest one.

## Per screen

A table: screen, then a column per state with a line on how it is handled. Add a row when a screen ships.
