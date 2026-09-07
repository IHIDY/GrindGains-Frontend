# Site Theme — Color Reference

Dark-mode personal site built with Tailwind CSS (default palette, no custom
theme extension in `tailwind.config.js`). All colors below are standard
Tailwind color names/shades — use them as-is with `bg-`, `text-`, `border-`,
etc.

## Base / Surface (grays)

| Role | Class | Notes |
|---|---|---|
| Page background | `bg-gray-950` | body/root uses `rgb(17 24 39)` (≈ gray-900) in `index.css`; sections/nav/footer use `gray-950` |
| Card / section background | `bg-gray-900` | project cards, general panels |
| Secondary surface | `bg-gray-800`, `bg-gray-700` | nested/inner surfaces, hover states |
| Borders / dividers | `border-gray-800`, `border-gray-700`, `border-gray-600` | most common border is `gray-800` |
| Primary body text | `text-white`, `text-gray-100`, `text-gray-200` | headings and emphasized text |
| Secondary text | `text-gray-300`, `text-gray-400` | nav links, captions, muted copy |
| Disabled / faint text | `text-gray-500`, `text-gray-700` | placeholders, low-emphasis |

## Brand / Accent

| Role | Class |
|---|---|
| Primary action (buttons, links, CTAs) | `bg-blue-600` (default), `bg-blue-700` (hover) |
| Accent text / focus rings | `text-blue-400`, `text-blue-300`, `border-blue-500`, `ring-blue-500` |

Blue is the primary brand accent (nav CTA "Get in touch", buttons, links).

## Gradients (headline text & decorative cards)

Used with `bg-gradient-to-r`/`to-br`/`to-tr` + `bg-clip-text text-transparent`
for headline word highlights, or as flat gradient tiles on project cards.

**Headline/text gradients:**
- `from-blue-400 via-cyan-400 to-emerald-400` — hero name/title
- `from-blue-400 to-cyan-400` — About "builder"
- `from-cyan-400 to-emerald-400` — About "solver"
- `from-emerald-400 to-blue-400` — About "communicator"
- `from-pink-400 to-rose-400` — Projects dedication line
- `from-cyan-400 via-blue-500 to-purple-600` — Projects heading accent

**Decorative panel gradients:**
- Hero avatar frame: `from-gray-800 to-gray-700` (outer), overlay `from-blue-600/30 via-cyan-500/30 to-emerald-500/30`

**Project card cover palettes** (cycled by index in `ProjectCard.tsx`):
1. `from-blue-600 to-cyan-500`
2. `from-purple-600 to-pink-500`
3. `from-emerald-600 to-teal-500`
4. `from-orange-600 to-rose-500`
5. `from-indigo-600 to-sky-500`
6. `from-fuchsia-600 to-violet-500`

## Status / Semantic colors

| State | Classes |
|---|---|
| Error | `bg-red-900`, `bg-red-700`, `bg-red-600`, `text-red-400`, `border-red-800` |
| Success | `bg-green-700`, `bg-green-600` |
| Warning | `bg-yellow-900`, `text-yellow-400`, `border-yellow-800` |

## Misc

- `bg-black`, `border-white` appear rarely (edge-case overlays/outlines).
- No custom hex colors or CSS variables defined anywhere — everything is
  Tailwind's default palette.
- Font stack: system UI (`-apple-system, BlinkMacSystemFont, 'Segoe UI',
  Roboto, Oxygen, Ubuntu, sans-serif`), set in `src/index.css`.

## Quick summary for other agents

This is a **dark theme**: near-black/gray-900–950 backgrounds, white/gray-200
text, **blue** as the primary accent color, and **blue → cyan → emerald**
(plus a rotating multi-hue set: purple/pink, orange/rose, indigo/sky,
fuchsia/violet) as decorative gradients on headlines and project cards. Stick
to Tailwind's default gray scale for neutrals and blue-600/700 for primary
actions to stay consistent with the existing design.
