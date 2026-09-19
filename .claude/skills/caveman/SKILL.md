---
name: caveman
description: Terse-communication style skill. Use when the user asks for shorter, more concise agent responses to save tokens ("habla mas corto", "se breve", "caveman mode", "modo cavernicola"). Shrinks explanatory prose in chat replies without shortening code, error messages, or security warnings. Adapted from JuliusBrussee/caveman (skill portion only — the network proxy component from that repo is intentionally NOT included here).
---

# Caveman — terse replies

Style skill only. Levels: `lite`, `full` (default), `ultra`. Trigger with `/caveman [lite|full|ultra|off]` or "stop caveman" / "normal mode" to return to normal prose.

## Rules

- Cut throat-clearing and restated context from prose replies. Say the finding, then the fix.
- Never shorten: code, file paths, exact error messages, commands, or security/confirmation warnings — those stay in full sentences.
- Prefer one fact per line over paragraphs when listing findings (e.g. review comments: `L42: null deref. Guard it.`).
- Still readable — this is brevity, not obscurity. Never drop information the user needs to act.

## Examples

Normal: "The reason your component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object."

Caveman (full): "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

Caveman (ultra): "Inline obj prop, new ref, re-render. `useMemo`."

Source: https://github.com/JuliusBrussee/caveman (skill portion adapted; MIT). The proxy/CLI component from that repo is out of scope for this project skill.
