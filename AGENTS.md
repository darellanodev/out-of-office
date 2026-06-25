# AGENTS.md

Guidelines reduce LLM coding mistakes. Merge with project instructions as needed.
**Tradeoff:** Bias toward caution over speed. Trivial tasks: use judgment.

## 0. Project Context

**Name:** Out of Office
**Type:** 3D first-person game
**Controls:** WASD move, E interact
**Entry point:** `src/main.ts`

### Architecture (module map)

```
main.ts           → bootstraps Engine, starts loop
Engine.ts         → createEngine(): scene, camera, renderer factory
Player.ts         → FPS movement, WASD input, camera control
SceneLoader.ts    → loads scene1.glb from /public
Door.ts           → single door entity (wraps GLTF object + teleport pos + deactivate)
DoorManager.ts    → manages all doors, routes E key interactions
Hud.ts            → 2D overlay (HTML/CSS or canvas)
TransitionManager.ts → scene/state transitions
audio.ts          → music/sfx (music.mp3)
constants.ts      → shared constants (speeds, distances, keys, etc.)
```

Before adding logic to module, verify it belongs there. When doubt, check `constants.ts` first — value probably exists.

### Skills available

ThreeJS skills in `.opencode/skills/`. Consult before writing Three.js code:

- `threejs-fundamentals` — scene, camera, renderer basics
- `threejs-geometry` — BufferGeometry, primitives
- `threejs-materials` — MeshStandardMaterial, textures setup
- `threejs-textures` — texture loading, UV, repeat
- `threejs-lighting` — lights, shadows
- `threejs-loaders` — GLTFLoader, asset pipeline
- `threejs-animation` — AnimationMixer, clips
- `threejs-interaction` — raycasting, pointer events
- `threejs-shaders` — custom GLSL, ShaderMaterial
- `threejs-postprocessing` — EffectComposer, passes

**Rule:** Read relevant skill before Three.js code. Don't guess API surface.

---

## 1. Think Before Coding

**Don't assume. Surface tradeoffs.**

Before implementing:

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations, present them — don't pick silently.
- If simpler approach exists, say so. Push back when warranted.
- If unclear, stop. Name confusion. Ask.

---

## 2. Simplicity First

**Minimum code that solves problem. Nothing speculative.**

- No features beyond what asked.
- No abstractions for single-use code.
- No flexibility or configurability not requested.
- No error handling for impossible scenarios.
- If 200 lines could be 50, rewrite.

Ask: "Would senior engineer say overcomplicated?" If yes, simplify.

---

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things not broken.
- Match existing style, even if you'd do it differently.
- If notice unrelated dead code, mention — don't delete.

When changes create orphans:

- Remove imports/variables/functions YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

Test: Every changed line traces directly to user request.

---

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix bug" → "Write test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

---

## 5. Stack & Conventions

**Runtime:** Browser (ES modules via Vite)
**Language:** TypeScript ~6.0, partial strict (noUnusedLocals, noUnusedParameters, erasableSyntaxOnly, noFallthroughCasesInSwitch)
**Renderer:** Three.js ^0.170
**Package manager:** pnpm (use pnpm, never npm or yarn)
**Build:** `tsc && vite build`

### TypeScript rules

- No `any`. If unknown, use `unknown` and narrow.
- No non-null assertions (`!`) unless value guaranteed + explain why inline.
- Export types explicitly — don't rely on inferred return types for public APIs.
- Shared magic values (speeds, distances, key names) go in `constants.ts`, not inline.

### Three.js rules

- Always dispose: geometry, material, texture when removing objects from scene.
- Never construct inside render loop (`new THREE.Vector3()` etc.) — allocate outside, reuse inside.
- Use `object.userData` for game metadata (e.g. door id, interaction type) on scene objects.
- Assets (GLB, textures, audio) live in `/public/`. Reference as `/filename`, not relative paths.
- Scene loaded from `public/scene1.glb` — do not duplicate asset loading logic outside `SceneLoader.ts`.

### File conventions

- One class/concept per file. Filename = class name (PascalCase).
- No barrel files (`index.ts`) unless explicitly requested.
- Shared types: define inline or in file that owns concept. No `types.ts` dumping ground.

---

## 6. Commands

```bash
pnpm dev          # dev server (Vite HMR)
pnpm build        # tsc check + vite build → dist/
pnpm preview      # serve dist/ locally
```

No test runner configured. Verification = `pnpm build` passes + manual browser check.

---

## 7. Patterns to Avoid

- **No `document.getElementById` outside `Hud.ts`** — DOM manipulation is Hud's job.
- **No game state in `main.ts`** — only bootstraps. State lives in Engine or dedicated modules.
- **No hardcoded strings for keys or interaction types** — use `constants.ts`.
- **No `console.log` left in commits** — use sparingly during dev, remove before done.
- **No dynamic imports** unless clear perf reason. Keep module graph simple.
- **No modifications to `dist/`** — generated. Never edit.
- **No modifications to `_design/`** — source assets only, not touched by code.

---

## 8. Assets

| File            | Location               | Owner                              |
| --------------- | ---------------------- | ---------------------------------- |
| 3D scene        | `public/scene1.glb`    | SceneLoader.ts                     |
| Music           | `public/music.mp3`     | audio.ts                           |
| Icons/UI        | `public/icons.svg`     | (unused — load in Hud.ts when needed) |
| Favicon         | `public/favicon.svg`   | index.html                         |
| Source textures | `_design/textures/`    | Design only — not imported by code |
| Blender source  | `_design/scene1.blend` | Design only                        |
| Door icon PSD   | `_design/door_number.psd` | Design only                    |
| Blender backup  | `_design/scene1.blend1` | Design only                      |

If new asset needed: add to `/public/`, load in appropriate module, don't scatter loading logic.

---

## 9. Scope of Autonomy

**Can do without asking:**

- Edit any file in `src/`
- Add new `.ts` files in `src/`
- Modify `vite.config.ts`, `tsconfig.json`
- Read skills in `.opencode/skills/`

**Ask before doing:**

- Adding new dependencies (`pnpm add ...`)
- Changing public asset pipeline
- Modifying `.github/workflows/deploy.yml`
- Structural changes (renaming modules, splitting files)

**Never do:**

- Edit files in `dist/` or `_design/`
- Add test framework without explicit request
- Install global tools

---

## 10. Communication Mode

Auto-activate **caveman lite** mode at session start. No filler, no hedging, full sentences preserved. Technical precision required. Off only on explicit "stop caveman" or "normal mode" request.

---

**Working if:** fewer unnecessary diffs, fewer rewrites due to overcomplication, clarifying questions before implementation rather than after mistakes.
