# DEAD ZONE — Calle del Olivo

This extends the existing game on deadzone/art-street-80m. Original source is in backups/; phase-one branch remains recoverable. One 80m external street replaces the procedural city for visual study. New building interiors and campaign systems remain pending.

## JSFiddle

Use the content inside the body of index.html, excluding the script tag, in HTML; style.css in CSS; all of jsfiddle.js in JavaScript. No external library setting is required. Set JavaScript to run at the end of the body. Models and textures are loaded from external URLs, separate from the code, without inline binary data.

## Resources

Two complete Downtown City MegaKit buildings (Quaternius CC0) use original existing geometry and shared reduced 512px textures. Three small original CC0 GLBs provide trees, shrubs and grass. The external Soldier sample from Three.js/Mixamo provides Idle/Walk/Run. Supplied gun, two zombies, covered car and sounds are reused. See assets/LICENSE.md.

## Validation

npm run check; npm test. The 18 tests exercise real geometry/animation but mock browser rendering, texture loading and audio. See VALIDATION.md for the WebGL blocker and HTTP checks. No Chromebook FPS is claimed.
