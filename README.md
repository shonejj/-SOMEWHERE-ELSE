# Somewhere Else

**A free, open-source 3D place to be.** A log cabin in a rainy forest beside a quiet lake, running entirely in your browser — on desktop and on phones.

There are no quests, no enemies, no scores, no timers and no objectives. Just a person, a living world and the freedom to wander, touch things, and stay as long as you like.

> Every texture, tree, animal, sound effect and piece of music in Somewhere Else is generated at runtime from code in this repository. There are **no downloaded or third-party art/audio assets** — see [`ASSETS_LICENSES.md`](ASSETS_LICENSES.md).

---

## What's there

Two places to be — choose one on the landing page (**Where to**) or travel between them from the pause menu (**Journeys**):

- **Pine Lake** — a log cabin in a rainy pine forest by a big lake, with a dock, a tree house and a campfire clearing.
- **Maple Hollow** — an autumn valley of red and gold maples, ginkgo and swaying bamboo: a tea house with tatami, a sunken hearth and sliding paper screens; a steaming hot spring; a koi pond under an arched vermilion bridge; stone lanterns that glow at night; a moon-viewing deck with a telescope; and a rope swing under a maple.

### Maple Hollow

| Place | What you can do |
|---|---|
| **Tea room** | Light the sunken hearth, **brew tea** in the hanging iron kettle (steam, a singing kettle, warm cups appear on the low table), sit cross-legged on cushions, lie on the futon, slide the paper doors, open the tansu drawers, light paper lanterns, switch the woven ceiling lamp |
| **Veranda** | Ring the glass wind bell, light the hanging red lantern, carry the bamboo broom; a bamboo water-clapper by the stone basin fills and clacks |
| **Hot spring** | Soak in the steaming water; wooden bucket and towel |
| **Koi bridge** | Scatter food and watch the koi gather and splash |
| **Bamboo grove** | Sit on a log among the swaying bamboo |
| **Moon-viewing deck** | Sit and watch the sky, or zoom the telescope on the moon and stars |
| **Maple swing** | A rope swing that swings higher the longer you sit |

### Pine Lake

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

**You**

- **First- or third-person** (V, or the View button): the third-person camera orbits behind your shoulder and pulls in so it never goes through walls; when you lie down it rises above you so you see yourself resting.
- **Pocket music player** (M, or ♪): eight original lo-fi tracks composed live in your browser — FM electric piano, upright bass, swung drums, vibraphone / plucked guitar / soft lead melodies, warm pads, vinyl crackle, tape wobble and reverb — with an optional rain-and-birds nature layer. It plays "in your ears", unaffected by where you are; you can see it in your hand while it's out.
- **Journal**: write in the notebook on the bedroom desk; entries are kept on your device. The nightstand drawer holds a letter you can read.
- **Guitar**: pick it up and click (or tap Strum) to play chords.
- **Diving**: while swimming, C dives down to the lake bed (fish, bubbles, a bright window to the sky overhead, muffled sound); Space surfaces. Light things float and bob; stones sink.

- **A full body built in code**: knitted sweater, belt, jeans and leather boots. Look down and you see yourself; your shadow walks, runs, crouches and sits with you. Legs use two-bone IK (walking and running gaits, crouching, sitting with knees bent, climbing the ladder), arms swing in opposition and hand over to the first-person hands when you reach for something.
- **Swimming**: wade into the lake and, once it's deeper than your chest, you float and swim (breaststroke hands in view, Shift to swim faster, Space to kick up). Feet, strokes, dives and thrown objects throw up water droplets and ripples.
- **First-person hands** with jointed fingers, skin and knitted sleeves. They stay out of the way until you look at something usable, then reach out: a pointing finger for switches, lamps and the radio, an open palm to push doors, windows and drawers, a grip to pick things up. Carried objects sit in your hand, and when you inspect something both hands come up to turn it over.
- Aiming is forgiving: small objects (a mug, a pine cone) are picked up when they're near the crosshair, not only when it's exactly on them, with a wider margin on touch screens.

**The world**

- Day/night cycle (one day ≈ one hour) with a procedural sky: sun, moon, stars, Milky Way, moving clouds.
- Dynamic weather that drifts between clear, overcast, rain, storm (lightning + delayed thunder) and fog — or lock it in the menu.
- Rain streaks that stop under the roofs; splashes on the ground **and on the roofs**; water dripping from the eaves and splashing below; puddles that form in the trails and mud with rain rings in them; rings and stippling across the whole lake; droplets beading and running down the window glass; wet, darker, glossier ground, decks and shingles.
- A clear lake: you can see the lake bed (with moving caustics) through shallow water, which deepens to dark green-blue; fresnel reflections (a true mirror reflection on High/Ultra), sun glints and a soft foam line at the shore.
- Lush, wind-driven nature: a dense GPU grass field that surrounds you wherever you walk, pines, birch and broadleaf oaks, bushes along the forest edges, ferns, thousands of wildflowers, reeds and cattails at the water's edge, lily pads (some flowering), mushrooms at the feet of trees, fallen mossy logs and stumps, moss on the tops of rocks, and leaves drifting on the wind.
- Curtains billow when a window is open.
- Wildlife: deer — does and an antlered buck — (graze, look up, bolt if you rush them — crouch to get closer), rabbits that nibble and hop away, a school of fish in the lake, koi in the hollow, mallards that tip forward to dabble, a flock of birds, butterflies over the meadow, dragonflies darting along the shore, ducks, jumping fish, fireflies on dry nights, bird song, owls, frogs and — only on dry nights — the odd cricket.
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
| `V` | first / third person |
| `M` | music player |
| `C` (swimming) / `Space` | dive / surface |
| Scroll (telescope) | zoom |
| `Esc` | pause · settings · places |

**Touch** (phones and tablets, detected automatically; also enabled the first time you touch the screen on a touch laptop): drag on the left half to walk, drag on the right half to look, **tap** anything to use it. On-screen buttons: Use, Jump, Crouch, Run, Torch, and Throw / Inspect / Drop while holding something. ☰ opens the menu.

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

`.github/workflows/deploy.yml` runs on every push to `main` (and `claude/**` branches): it installs dependencies, verifies every dependency licence, builds the site, and force-pushes `dist/` to the **`gh-pages`** branch. The build uses relative paths (`base: './'`), so it works at `https://<user>.github.io/<repo>/` or on any static host.

If the site is not live after the first run, open **Settings → Pages**, choose **Deploy from a branch → `gh-pages` / `(root)`**, and save. Every later push redeploys automatically.

## Graphics & performance

The pause menu offers **Low / Medium / High / Ultra** (phones default to Low; desktops are matched to the GPU the browser reports: Medium for integrated graphics, High for dedicated cards) and a **frame-rate cap** (30 · cool & quiet — the default on phones — / 60 / unlimited). Vegetation uses distance LOD: only trees, bushes and ferns near you are fully detailed and cast shadows; distant trees are billboard impostors rendered from the real trees at load time, which allowed roughly doubling the forest while cutting draw calls by ~90%. Shadows refresh every other frame below Ultra, the lake mirror refreshes every other frame without grass or particles, and nothing renders while the game is paused. Presets scale render resolution, grass density and radius, bloom (High/Ultra), shadow-map size, texture resolution, vegetation density, rain particle count, terrain resolution and planar lake reflections (High/Ultra). On top of that a **dynamic-resolution** controller lowers or raises the render scale every two seconds to hold a smooth frame rate. Static geometry is merged into a few draw calls per material, vegetation is instanced in spatial chunks so frustum culling works, and the world code is lazily loaded (and pre-fetched while you read the landing page).

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
