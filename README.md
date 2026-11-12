# Somewhere Else

**A free, open-source 3D place to be.** A log cabin in a rainy forest beside a quiet lake, running entirely in your browser — on desktop and on phones.

There are no quests, no enemies, no scores, no timers and no objectives. Just a person, a living world and the freedom to wander, touch things, and stay as long as you like.

> Every texture, tree, animal, sound effect and piece of music in Somewhere Else is generated at runtime from code in this repository. There are **no downloaded or third-party art/audio assets** — see [`ASSETS_LICENSES.md`](ASSETS_LICENSES.md).

---

## What's there

**Places** (walk between them along the trails, or use *Go to* in the pause menu)

| Place | What you can do |
|---|---|
| **Living room** | Light / let die the stone **fireplace** (flames, embers, flicker light, crackle, chimney smoke) · sit on the **sofa** or **armchair** · flick the **wall switches** (ceiling pendant, porch light) · pull the **floor-lamp** chain · turn on the **radio** (two generative stations) · strum the **guitar** · read the **clock** · open **drawers** · pick up books, mugs, a cushion, a bottle, firewood |
| **Kitchen** | Run the **tap** · open **drawers** and **cupboards** · pick up the kettle, mugs, cutting board, apples · light the **candle** on the dining table · sit at the table |
| **Bedroom** | **Lie down** on the bed (time drifts ~40× faster while you rest) · bedside **lamp** · **nightstand drawer** (a pocket watch and an old letter) · **wardrobe** doors · **chest** with a hinged lid · sit at the **desk** |
| **Porch** | **Rocking chair** that rocks while you sit · a carryable **oil lantern** (a real light source at night) · **wind chime** that rings in the wind · firewood stack |
| **Dock** | Sit on the bench or on the edge of the dock · climb into the bobbing **rowboat** · watch ducks, fish jumps and rain rings · **skip smooth stones** from the shore |
| **Tree house** | Climb the **ladder** · sit or lie down inside · **string lights** · a **telescope** pointed at the lake (zoom view) |
| **Forest clearing** | Light the **campfire** · sit on log benches · crawl into the **tent** to rest |

**The world**

- Day/night cycle (one day ≈ one hour) with a procedural sky: sun, moon, stars, Milky Way, moving clouds.
- Dynamic weather that drifts between clear, overcast, rain, storm (lightning + delayed thunder) and fog — or lock it in the menu.
- Rain streaks that stop under the roofs, ground splashes, ripples on the lake, wet darkening ground and roofs.
- Wind-driven foliage (pines, birch, grass, ferns, wildflowers) and curtains that billow when a window is open.
- Wildlife: deer (graze, look up, bolt if you rush them — crouch to get closer), a flock of birds, ducks, jumping fish, fireflies on dry nights, bird song, owls, crickets and frogs.
- Fully positional, procedurally synthesised sound. Indoors the rain becomes a muffled drum on the roof — opening windows and doors lets it back in.
- Physics: everything loose can be picked up, inspected (rotate it in your hands), dropped or thrown; it collides, tumbles, clatters and splashes with material-specific sounds.

## Controls

| Desktop | |
|---|---|
| `W A S D` / arrows | walk |
| `Shift` | run |
| `C` (toggle) or hold `Ctrl` | crouch |
| `Space` | jump · stand up |
| `E` | use / pick up / put down |
| Left click | throw what you hold |
| Hold `R` or right mouse | inspect (mouse rotates the object) |
| `Q` | drop |
| `F` | torch |
| `Esc` | pause · settings · places |

**Touch:** drag on the left half to walk, drag on the right half to look, **tap** anything to use it. On-screen buttons: Use, Jump, Crouch, Run, Torch, and Throw / Inspect / Drop while holding something. ☰ opens the menu.

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
npm run licenses   # verify every dependency licence is on the free allow-list
```

Requires Node 20.19+ (CI uses Node 22).

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds the site on every push to `main` (and `claude/**` branches) and publishes `dist/` with the official GitHub Pages actions. The build uses relative paths (`base: './'`), so it works at `https://<user>.github.io/<repo>/` or any static host.

If the first run stops at *configure-pages* or *deploy* with a "Pages not enabled" / environment-protection error, open **Settings → Pages**, set **Source: GitHub Actions**, then re-run the workflow (Actions → Deploy to GitHub Pages → *Run workflow*). If you deploy from a non-default branch, allow that branch under **Settings → Environments → github-pages**.

## Graphics & performance

The pause menu offers **Low / Medium / High / Ultra** (phones default to Low, desktops to High). Presets scale render resolution, shadow-map size, texture resolution, vegetation density, rain particle count, terrain resolution and planar lake reflections (High/Ultra). On top of that a **dynamic-resolution** controller lowers or raises the render scale every two seconds to hold a smooth frame rate. Static geometry is merged into a few draw calls per material, vegetation is instanced in spatial chunks so frustum culling works, and the world code is lazily loaded (and pre-fetched while you read the landing page).

## Architecture

```
index.html                 landing page, loading screen, in-world UI shell
src/main.js                landing controller (hero shader, ambience, ENTER WORLD)
src/landing/hero.js        raw-WebGL animated landing backdrop
src/world/World.js         renderer, scene assembly, main loop, dynamic resolution
src/world/core/            noise, procedural texture generator, settings, world layout
src/world/env/             terrain, sky + lighting, weather, lake, vegetation
src/world/build/           building kit, cabin (all rooms), dock/tree house/clearing, props
src/world/systems/         input, player controller, collisions, physics, interaction,
                           audio engine, generative radio, wildlife, UI
```

- **Rendering:** three.js `WebGLRenderer`, ACES tone mapping, sRGB output, PCF shadows following the player, image-based lighting regenerated from the procedural sky via PMREM whenever the sky changes.
- **Character:** a custom kinematic capsule controller (step-up, slopes, ceilings, ladders, wading, world bounds) against axis-aligned boxes + vertical cylinders, with exact triangle-accurate terrain height queries.
- **Physics:** cannon-es rigid bodies for every loose object, a heightfield for the ground around the cabin and lake, static boxes shared with the character colliders.
- **Audio:** Web Audio API graph with HRTF panners (equal-power on phones), procedural noise beds, synthesised one-shots, Karplus-Strong guitar and an FM-piano/pad generative radio.

See [`docs/TECHNOLOGY.md`](docs/TECHNOLOGY.md) for the research behind these choices.

## Licence

Code: [MIT](LICENSE). Fonts: SIL Open Font License 1.1. Full register: [`ASSETS_LICENSES.md`](ASSETS_LICENSES.md).
