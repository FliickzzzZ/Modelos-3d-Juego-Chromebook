# Calle del Olivo — recovery checkpoint

Derived from phase-one commit e29b9109d3c8cf95b338222382e47776ca4bc853. Original source remains in backups/; phase-one branch remains unchanged.

Implemented in source: one 80 m sector; two complete Quaternius buildings; normalized live asset bounds; deterministic cracks and debris; foliage instances; asphalt/concrete/dirt base-color, normal and roughness maps; directional shadow map; Soldier human with Idle/Walk/Run blending; existing combat/audio/navigation/save systems retained.

The earlier binary upload failed before any asset was committed. Source currently refers to assets that still need publication. Do not describe this checkpoint as browser-ready.

18 logic tests pass with real geometry, real Three.js and real animation skeletons; browser renderer, DOM and audio are mocked. No screenshot of actual WebGL rendering has been verified. Local browser startup fails with socket permission denied; cloud browser cannot reach the local HTTP server. Chromebook performance unmeasured.

Next: publish resources as separate external files, verify HTTP dependencies, rerun checks, inspect the actual WebGL scene. No purchases and no raw Mixamo files uploaded.
