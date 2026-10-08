# Calle del Olivo — recovered art sector

Derived from phase-one commit e29b9109d3c8cf95b338222382e47776ca4bc853. The original game remains in backups/, and the phase-one branch is unchanged. Recovery source checkpoint: c982de80d705043679eb1c54b862faf4900a7ed0.

Implemented: one 80 m sector, two complete Quaternius buildings, collision bounds taken from loaded geometry, deterministic cracks and debris, foliage instances, external 512px PBR maps, directional shadows, Soldier human with Idle/Walk/Run blending and gun position following the actual hand. Existing combat, owner-based audio cleanup, A* budget, separate exploration/wave modes and versioned saves are retained. Old city layout is replaced solely for this art study; the prototype apartment is preserved in the phase-one branch. New building interiors are not implemented here.

Production resources remain separate: two small glTF descriptors referencing the original existing .bin geometry, shared reduced textures, three small original vegetation GLBs. No model binary is embedded in HTML or JS. No purchases, and no raw Mixamo files are republished.

18 logic tests pass in readable and delivery JS with real meshes/skeletons and mock renderer/DOM/audio. Runtime hand bone and Idle/Walk/Run checked. Textures/rendering/real audio are not exercised by those tests. No WebGL screenshot yet; local browser socket denied, cloud browser cannot reach localhost. Chromebook performance is unmeasured. Do not call the art direction visually approved.
