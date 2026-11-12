# Technology research & decisions

This document records the survey of free and open-source options that informed Somewhere Else, and why each choice was made. Constraint: **everything must be free and open source** — no paid assets, subscriptions, API keys or proprietary runtimes — and it must run smoothly in Chrome on desktop and on phones.

## Rendering engine

| Option | Licence | Notes | Verdict |
|---|---|---|---|
| **three.js** | MIT | Most widely used WebGL/WebGPU library; huge addon set (water, sky, PMREM, instancing, BufferGeometryUtils); small core; tree-shakeable; mature WebGL2 path that works on almost every phone. | **Chosen** |
| Babylon.js | Apache-2.0 | Full engine with editor, PBR, physics plugins. Heavier bundle; more opinionated scene graph. | Strong alternative |
| PlayCanvas engine | MIT | Excellent mobile performance; best paired with the hosted (proprietary, freemium) editor. | Rejected (editor dependency) |
| Godot 4 web export | MIT | Great tooling, but WebAssembly export is large (30 MB+), slower to start, and WebGL-compat renderer is limited. | Rejected for load time |
| Unity / Unreal web | Proprietary | Not open source. | Excluded |

three.js r187 is used with the WebGL 2 renderer (`WebGLRenderer`) because it has the widest device support today; ACES Filmic tone mapping, sRGB output, PCF shadows, instanced meshes and PMREM image-based lighting are all built in.

## Physics

| Option | Licence | Notes | Verdict |
|---|---|---|---|
| **cannon-es** | MIT | Pure JS, tiny, simple API, heightfields, sleeping bodies; ideal for a few dozen props. | **Chosen** for loose objects |
| Rapier (`@dimforge/rapier3d-compat`) | Apache-2.0 | Fast Rust/WASM, deterministic, character controller included. ~1.5 MB WASM. | Great alternative; not needed at this scale |
| Ammo.js | zlib | Bullet port; large, awkward API. | Rejected |
| Jolt (JoltPhysics.js) | MIT | Very fast WASM; larger download. | Rejected for size |

The **character** uses a custom kinematic controller rather than a rigid body: it gives precise, comfortable first-person movement (step-up onto porches and stairs, slopes, ceilings, crouching, ladders, wading) with collision against axis-aligned boxes and tree-trunk cylinders, plus triangle-exact terrain height. Loose objects use cannon-es and share the same static boxes.

## Audio

| Option | Licence | Notes | Verdict |
|---|---|---|---|
| **Web Audio API** | Web standard | Native in all browsers; PannerNode with HRTF; biquad filters; oscillators; no download. | **Chosen** |
| Howler.js | MIT | Convenient sample playback; we have no samples. | Not needed |
| Tone.js | MIT | Lovely synthesis/sequencing toolkit (~300 KB). | Not needed – a small custom scheduler suffices |
| Resonance Audio | Apache-2.0 | Ambisonic room acoustics; heavier. | Not needed |

All sound is **synthesised**: filtered noise beds (rain, roof drumming, wind, leaves, lake), one-shots (footsteps per surface, creaking hinges, latches, drawer slides, impacts per material, splashes, thunder), animal calls (birds, owl, frogs, crickets, ducks), a Karplus–Strong guitar, and a generative FM electric-piano / pad radio. Indoors, outdoor ambience is low-passed and a roof-rain layer fades in, with the amount depending on how many windows and doors are open.

## 3D assets & textures

Free asset libraries surveyed:

| Library | Licence | Notes |
|---|---|---|
| Poly Haven (textures, HDRIs, models) | CC0 | Superb photoscanned quality; multi-MB per material. |
| ambientCG | CC0 | Large PBR texture library. |
| Kenney | CC0 | Stylised low-poly kits. |
| Quaternius | CC0 | Stylised animated animals and nature packs. |
| Sketchfab | mixed (CC-BY, CC0, paid) | Licence varies per model – needs per-item auditing. |

**Decision: generate everything procedurally.** Even CC0 libraries add tens of megabytes (hurting phones and first load), and per-file licence auditing is error-prone. Instead, `textures.js` builds tileable PBR-style albedo + normal maps (planks, logs, bark, stone, grass, dirt, shingles, fabrics, rug, quilt, water) with periodic gradient noise and Worley noise at load time; geometry for the cabin, furniture, trees and animals is built in code. The whole world downloads as ~160 KB of gzipped JavaScript, and the licence register is trivially complete.

## Animation

| Option | Licence | Notes |
|---|---|---|
| three.js `AnimationMixer` | MIT | Skeletal/keyframe playback for glTF assets. |
| Blender | GPL (tool only; output is yours) | Authoring for skeletal assets. |
| GSAP | Standard "no-charge" licence (not OSI) | Excluded – not open source. |

Because all models are procedural, animation is procedural too: critically-damped springs for doors, windows, lids and drawers; a gait cycle for the deer (walk + gallop); flapping/gliding birds; shader-driven wind for all foliage and curtains; GPU particle shaders for rain, embers, smoke and fireflies.

## Sky, weather and lighting

- Custom sky-dome shader (gradient, sun, moon, stars, milky way, fbm clouds whose coverage follows the weather) instead of the `Sky` addon, so overcast and storm skies look right.
- The sky is re-rendered into a PMREM environment map whenever it changes noticeably, so every PBR surface picks up correct ambient light for the time and weather.
- A single shadow-casting directional light (sun by day, moon by night) follows the player; interior lamps and fires are shadowless point lights to keep phones fast.
- High/Ultra use the three.js `Water` addon for a planar reflection of the lake; Low/Medium use an env-mapped, normal-mapped surface.

## Build & hosting

- **Vite** (MIT) for dev server and production builds; the world module is code-split and pre-fetched during the landing page.
- Fonts are self-hosted via **Fontsource** (OFL-1.1) – no requests to third-party font servers.
- **GitHub Pages** via the official GitHub Actions; `base: './'` keeps every path relative.
