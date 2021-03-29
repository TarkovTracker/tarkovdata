# Tarkov Data
The quest and hideout data for [Escape From Tarkov](https://www.escapefromtarkov.com/), contributed by the community and maintained by [Tarkov Tracker](https://tarkovtracker.io/).

See [quests.json](quests.json) for Quest Data

See [hideout.json](hideout.json) for Hideout Data

## SVG Maps

SVG maps are currently being worked on to use as basic indicators for quest locations. These aren't meant to be replacements for the fully labeled maps that the community has made, but as a blank canvas to overlay data programmatically. I've added the source files from Adobe Illustrator that I used to create them if anyone would like to help contribute them.

Some general guidelines for the maps:
- They should be entirely SVG drawn, no imported images
- They should be as close to the in-game maps as possible, when available
- They should not include labels
- They should not include every detail, but just major landmarks
- They should not split floors into separate spaces

See `maps` folder for SVG maps

## CLI Tool

I've created a simple CLI tool to do some basic data integrity checks.

Provided you have node/npm installed, you can run `npm cli.js help` to list available commands. Commands like `node cli.js verify-quest-data` and `node cli.js verify-hideout-data` are important to check that no important mistakes were made when modifying the data. Commands like `node cli.js new-quest-id` can find the next consecutive quest ID to utilize for new quests, there are similar commmands for hideout & objectives.

If you would like to help keep the quest data up to date with changes, please submit a pull request to the master branch. Feel free to utilize the Github discussions feature to talk about data format and potential additions.

Quest data syntax:

```javascript
{ 
  "id": 1, // Unique integer defining this quest
  "require": {
    "level": 10, // Level requirement to accept this quest
    "quest": [ 0, 2, [3, 4] ], // Array of quests that are required - sub-arrays are "one-of" optional requirements
  },
  "giver": "Prapor", // The quest giver's name
  "turnin": "Prapor", // Almost always the same as giver's name.
  "title": "Quest's Proper Name", // The proper name of the quest
  "wiki": "https://escapefromtarkov.gamepedia.com/Lend_lease_-_Part_1", // Wiki link
  "exp": 1000, // The amount of EXP rewarded for the quest
  "unlocks": ["Item name", "Another item name"], // Array of item names that a quest unlocks. Eventually this should be a separate data file with IDs
  "nokappa": true, // Optional flag to indicate if this quest is needed to unlock Collector
  "alternatives": [5, 6], // Array of quest IDs that if we complete will be 'failed'
  "reputation": [ // To go with leveling/trader unlocks guidance later on
  {
    "trader": "Prapor", // Name of the trader for the reputation change
    "rep": 0.03, // The amount of reputation change
  },
  {
    "trader": "Jaeger",
    "rep": -0.01,
  },
  "objectives": [ // An array of objectives to complete for the quest
    {
      "type": "find", // The "type" of objective it is - examples will be provided of each below. "find" is find in raid specific.
      "target": "Item Name", // The proper item name
      "number": 3, // The number of this item that need to be found in raid
      "location": "Any", // Either "Any" or the name of the map that this item specifically needs to be or is only found in.
      "id": 20, // A unique integer ID for this objective
    },
    {
      "type": "collect", // "collect" is a task where an item is needed but does not have to be found in raid status
      "target": "Item Name", // The proper item name
      "number": 3, // The number of this item that need to be procured
      "location": "Any", // Either "Any" or the name of the map that this item specifically needs to be or is only found in.
      "id": 21, // A unique integer ID for this objective
    },
    {
      "type": "pickup", // "pickup" is a task where a quest item needs to be picked up in raid, like a docs quest item.
      "target": "Docs Case Item Name", // The objective item's name
      "number": 1, // The number of this item that need to be picked up
      "location": "Any", // Either "Any" or the name of the map that this item specifically needs to be or is only found in.
      "id": 22, // A unique integer ID for this objective
    },
    {
      "type": "place", // "place" is for quests where you need to bring an item to put down (other than markers) for the quest
      "target": "SV-98 bolt-action sniper rifle", // The name of the item you need to place
      "number": 1, // The number of this item that need to be picked up
      "location": "Customs", // The name of the map you need to place the item in
      "id": 23, // A unique integer ID for this objective
    },
    {
      "type": "key", // "key" is to alert the user that a specific key is needed for one of the objectives
      "target": "Key Name", // The keys name
      "number": 1, 
      "location": "Customs", // The map that this key is needed for
      "id": 24, // A unique integer ID for this objective
    },
    {
      "type": "locate", // "locate" is for a quest objective that requires the player to move to a specific area, like the clothing stores in Interchange
      "target": "Location Name", // The name of the spot you need to go
      "number": 1, 
      "location": "Customs", // The map that you need to find this spot on
      "id": 25, // A unique integer ID for this objective
    },
    {
      "type": "kill", // "kill" is for either PMC or Scav kill objectives
      "target": "PMCs", // "PMCs", "Scavs", "Killa", or name of another boss that you need to kill
      "number": 5, 
      "location": "Customs", // The map that you need these kills on, or "Any" if its any map
      "with": [ // An array of specifics that these kills need to be done with
        "AKS-74U",
        "Between 20 and 08 hours",
      ],
      "id": 26, // A unique integer ID for this objective
    },
    {
      "type": "skill", // "skill" is for things like Vitality, or Sniper Rifle skills needed for a quest
      "target": "Vitality", // The name of the skill you need leveled - this can also be the name of a vendor to indicate you need a loyalty level with them
      "number": 5, // The skill level required for the objective
      "location": "Any", 
      "id": 27, // A unique integer ID for this objective
    },
    {
      "type": "reputation", // This is the example of a loyalty level skill objective
      "target": "Therapist",
      "number": 3, // The loyalty level required
      "location": "Any", 
      "id": 28, // A unique integer ID for this objective
    },
    {
      "type": "mark", // "mark" is for quest objectives that need to have a marker placed
      "target": "Safe road", // The name of the location you need to mark
      "number": 1, 
      "location": "Shoreline", // The name of the map you need to place the marker on
      "id": 29, // A unique integer ID for this objective
    },
    {
      "type": "mark", // "mark" is for quest objectives that need to have a marker placed
      "target": "Safe road", // The name of the location you need to mark
      "number": 1, 
      "location": "Shoreline", // The name of the map you need to place the marker on
      "id": 30, // A unique integer ID for this objective
    },
  ],
}
```
