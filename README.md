# fair-split

**The problem:** a group eats out, everyone ordered different things, someone paid, and now the group chat is doing bad math. Splitting equally punishes the person who only had water.

**The solution:** a single-page tool where you list each person's items, add tax/tip once, and it calculates exactly who owes what — with tax and tip distributed proportionally to what each person actually consumed.

## Use it

Open `index.html` in any browser. Add people, add their items, set tax and tip, done. Works offline.

## How it's built

Vanilla HTML/CSS/JS, no dependencies, no build step. State lives in a single plain object; rendering is a small pure function. Proportional allocation avoids the classic rounding bug by assigning the leftover kobo/cents to the largest share.

## Contribute

- Add a "copy summary to clipboard" button formatted for group chats
- Support percentage-based OR fixed-amount tips
- Add a shareable URL that encodes the whole bill in the query string

---

Scaffolded by an automated weekly pipeline, then refined by hand — see the factory repo for how it works.
