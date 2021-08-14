## SVG Maps

This map data is meant to provide the community and community tools with the basics for creating new, source shared maps. These maps are meant to be SVGs, so friendly to utilize with on the web for things like overlaying quest locations, spawns, extracts and more. They are stil a work in progress, and final formats may be subject to change
Please open a discussion if you have any questions or want any direction on how you could contribute!

### How to utilize
Because the maps are SVGs, they should be easy to import in most application settings. The maps have been designed to have floors as SVG group elements (layers in Adobe Illustrator source files). This means you can selectively remove, hide, or chance opacity on those layers to swap to another floor. Additionally, each layer should contain sub-groups or layers which contain primarily one type of map feature (eg. 'roads', or 'rocks, or 'ramps'). You can selectively omit those as well if your application needs it.

### Metadata
Currently, there is some metadata information available for the SVGs. The [maps.json](../maps.json) file has an `svg` property for each map with an SVG representation. `file` is the filename of the appropriate SVG for that map. `floors` is an array of element IDs for the SVG groups. `defaultFloor` is the group or layer which users would generally want to be displayed by default.

In [quests.json](../quests.json) quests with fixed point objectives have a `gps` property. The `gps` property contains a `topPercent` (Y coordinate as a percentage) and `leftPercent` (X coordinate as a percentage) for coordinates. It also contains a `floor` property which specifies the SVG group or layer that the objective is intended to be displayed on.

More map metadata to be added - if you're interested in things like extractions, locked doors, etc, feel free to open a discussion to figure out a format, and PRs are always welcome!

### Map Creation Guidelines
- They should be entirely SVG drawn, no imported images
- They should be as close to the in-game maps as possible, when available
- They should not include labels
- They should not include every detail, but just landmarks and any detail that would be required to provide information like quests, extracts, etc.
- If the map requires multiple floors to be useful (Interchange), each floor should be a parent level group (layers in Adobe Illustrator)
- Please include any source file if available in addition to the final SVG
- Please utilize current color scheme for any new maps, if you want to utilize the maps with a different color scheme, coordinated colors can easily be replaced as a post-processing step.


