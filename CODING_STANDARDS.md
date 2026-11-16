# Coding standards

Judgement calls only, for the reviewer to enforce. Anything a machine can check lives in `tests/playthrough.mjs` instead and is listed at the bottom.

## Who the player is

- The player maintains a repo but may have no formal software training. Never assume they can read code.
- Explain a term on the page where it first appears, in plain words. The cheat sheet glossary is a backup, not the explanation.
- Any code the player must judge carries a plain-language line directly under it.

## Questions must teach

- Wrong answers must be plausible. If length, tone or wording gives the right answer away, rewrite the question.
- A question tests a rule the player was just given, applied to a case where the answer is not obvious.
- Feedback says why, for wrong answers and right ones. Wrong answers can be retried. Stamps are final.

## Showing the answer

- On a correct answer, the choices stay where they are. Ring the right one, blur the rest, and put the explanation below.
- The player's own correct find is marked as correct, even when the thing they found is a problem. Say what it is with a label, not with the colour.

## Colour and emphasis

- Green means the player was right, and nothing else. Amber is emphasis and things to tap. Red means a problem in the work.
- Never rely on colour alone. Pair it with an icon or a label.
- One or two highlights per block. Highlight the action, the verdict, the habit, or the term being defined. Never a full sentence longer than about five words.
- No highlights in answer options or hints. They give answers away.

## Wording

- Short sentences in sentence case.
- Use the terms in `GLOSSARY.md` for the game's own parts.
- Tokens are burned, never earned, paid or scored.
- Do not tell the player a feature is free or carries no penalty. Let them find that out.

## Enforced by the test, not by review

- No script errors, and no request to another host.
- No page overflows the screen at any tested size.
- A perfect run burns the expected total and earns the top rank.
- No em dashes in anything the repo ships or documents.
