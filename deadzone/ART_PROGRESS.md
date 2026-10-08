# Calle del Olivo — recovered art sector

Derived from phase-one commit e29b9109d3c8cf95b338222382e47776ca4bc853. The original game remains in backups/, and the phase-one branch is unchanged. Recovery source checkpoint: c982de80d705043679eb1c54b862faf4900a7ed0.

Implemented: one 80 m sector, two complete Quaternius buildings, collision bounds taken from loaded geometry, deterministic cracks and debris, foliage instances, external 512px PBR maps, directional shadows, Soldier human with Idle/Walk/Run blending and gun position following the actual hand. Existing combat, owner-based audio cleanup, A* budget, separate exploration/wave modes and versioned saves are retained. Old city layout is replaced solely for this art study; the prototype apartment is preserved in the phase-one branch. New building interiors are not implemented here.

Production resources remain separate: two small glTF descriptors referencing the original existing .bin geometry, shared reduced textures, three small original vegetation GLBs. No model binary is embedded in HTML or JS. No purchases, and no raw Mixamo files are republished.

18 logic tests pass in readable and delivery JS with real meshes/skeletons and mock renderer/DOM/audio. Runtime hand bone and Idle/Walk/Run checked. Textures/rendering/real audio are not exercised by those tests. Public preview was opened successfully. Console confirmed WebGL is disabled in the cloud browser (GL_VENDOR/GL_RENDERER = Disabled); Three.js could not create a context. No street screenshot or renderer performance measurement can be supplied from this environment. The local browser also failed with socket permission denied. Chromebook performance is unmeasured. Do not call the art direction visually approved.

HTTP verification: 29 published external art files return 200 and exactly match their local SHA-256 hashes. The two original building .bin URLs and the external Soldier GLB also return 200. Asset URLs are pinned to commit 47153cbc0a9692cc0bdb66f962e51c263641e655. See tests/http-validation.json.
