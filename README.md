# Just Music — visual proof

This branch deliberately proves the **presentation pipeline before the simulation**.

## What this is

A dependency-free cinematic 2D prototype for a story-driven music game. It uses:

- layered vector scenery instead of a 3D world
- oversized recurring-character illustrations
- camera/focus changes driven by story beats
- film grain, practical lighting, rain and depth
- an in-world fictional social feed
- release/demo artwork rendered by code
- procedural Web Audio ambience so the prototype has no audio asset dependency
- no paid APIs, packages, image hosts or build tools

This is **not** the final art style. It is a proof that the game can behave like a living music editorial rather than a management dashboard or default visual novel.

## Run

From the repository root:

```bash
cd prototype
python3 -m http.server 8080
```

Then open:

```
http://localhost:8080
```

You can also open `prototype/index.html` directly in a modern browser.

## Controls

- **Enter / Space** — advance the scene
- **Click the notification** — open the fictional social feed
- **Esc** — close the phone
- **▶** on the Glass House demo — toggle procedural ambience
- move the pointer — subtle set parallax

## Visual R&D rule

Do not build the career simulation until this presentation direction is accepted.

The next visual pass should replace the hand-authored vector character stand-ins with a reproducible, zero-cost AI-generated character/reference pipeline while preserving this same scene compositor and cinematography approach.
