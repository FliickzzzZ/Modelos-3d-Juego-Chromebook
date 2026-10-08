# DEAD ZONE — Phase 1

Continuation of the original JavaScript supplied by the author, using Three.js 0.160.1. The original scene generators, A* heap/search, weapons, zombie fallback/GLB animation, controls, waves, HUD and options have been retained and adapted.

## Recovery

`backups/original-v5.js` preserves the original attached JavaScript. `backups/original-v5.html` and `.css` preserve the pasted panels, with formatting normalized; the duplicated CSS is retained in the backup. No changes are made to main or existing assets.

## Run

Serve this directory over HTTP (for example `python -m http.server 8765`) and open `index.html`. Requires WebGL, Internet access, and permission for Pointer Lock. The first click enables sound. `game.js` is readable source; `jsfiddle.js` is its equivalent compact build. For JSFiddle, use the body markup without the local script element, CSS, and the entire compact JavaScript in their respective panels. Select JavaScript / No wrap - bottom of body; no external Three.js script is needed because the original dynamic imports remain.

Controls: WASD, Shift run, Space jump, Ctrl/C slower movement and lower camera, left click shoot, right click aim, R reload, P save, Escape pause, F7 gun orientation. The apartment is at x=10.1,z=10.1 with a west doorway. New Game starts the exploration prototype; Waves remains a separate mode. Continue resumes the current session or most recent valid save. Save slots are separate by mode, with autosave every 20 seconds of gameplay and on pause/pagehide. Legacy saves restore statistics and restart that wave as explicitly labelled in the load menu.

## Implemented

- Separate player transform and shoulder camera; ray-based camera collision and close-camera character hiding.
- Shots check world geometry from the reticle and again from the muzzle.
- Zombie groans are spatial, owner-bound and limited to two; death clips are separate. Death, pause and reset clean effects, including effects still awaiting decoding.
- A* budget of two searches per frame with delayed retries; maximum 12 active wave enemies without discarding pending spawns.
- Non-destructive GLB fitting on wrapper groups. In-place conversion recognizes actual root/hip names including numeric suffixes, keeps hip vertical translation and bone scales.
- Game-time reloads. Versioned, validated snapshots include active enemies, pending spawns, reload state, player transform and generated collision map.
- Cinematic menu framing using the real 3D scene and protagonist, accessible controls, options, save selection and credits.
- One open test apartment built within the existing city. Two Downtown City MegaKit glTF modules replace its walls. Other buildings remain the original procedural city; full sector streaming is not implemented.
- Runtime texture downscaling to 512 px for selected materials; original assets are unchanged. This reduces GPU residency after decoding, not initial download/decode memory.

## Temporary character and rights

Cesium Man from Khronos glTF Sample Assets, © 2017 Cesium, CC BY 4.0. Attribution is in the menu. Cesium logo/trademark is retained; no endorsement is claimed. The model uses its bundled skin and locomotion animation. Running changes playback speed; dedicated idle, crouch, aiming, reload and death clips are not implemented, and Mixamo has not been downloaded or retargeted. The weapon is temporarily mounted to the player transform, not calibrated to an animated hand socket.

Source: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CesiumMan

City: Quaternius Downtown City MegaKit, CC0 as stated in `../Ciudad/License_Standard.txt`. Existing author-supplied gun/zombie/audio assets remain referenced from the repository. No Fab resource was purchased or uploaded.

## Validation and limitations

`npm install` then `npm run check` and `npm test` (POSIX shell). Tests download temporary fixtures into an ignored directory. There are 18 logic tests against real Three.js geometry and real GLB rigs/animation clips. Renderer, DOM, audio nodes and network loading are mocked; textures are removed from test fixtures solely to parse skeletons in Node. The readable and compact source both pass. Tests cover wall occlusion, unobstructed hits, shoulder-camera collision, A* segment safety/budget, save restoration, reload pause, humanoid skin loading, zombie scale and sound ownership/cleanup.

WebGL rendering, actual speaker output, Mixamo compatibility, the new MegaKit visual layout and Chromebook FPS/memory are NOT verified. Browser validation was attempted but the available Playwright browser was missing and its official download failed. Only actual device testing can establish performance. Asset failures retain original procedural fallbacks and display status. The GLB character is a temporary test human, not the selected Fab survivor. Campaign missions, hunger/thirst, inventory, loot and sector streaming remain future phases.
