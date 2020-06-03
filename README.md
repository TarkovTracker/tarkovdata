# Tarkov Tracker Quests
The quest data used for [Tarkov Tracker](https://tarkovtracker.io/).

If you would like to help keep the quest data up to date with changes, please submit a pull request to the master branch.

Quest data syntax:

```javascript
{ 
  "id": 1, // Unique integer defining this quest
  "require": {
    "level": 10, // Level requirement to accept this quest
    "quest": [ "A name of a quest", "Name of another quest" ], // An array of quest names that are required to be completed before accpeting this quest. This will eventually be changed to numerical IDs, but I haven't gotten to that yet.
  },
  "giver": "Prapor", // The quest giver's name
  "turnin": "Prapor", // Almost always the same as giver's name. Chemical Part 1 is the only situation where I wasn't sure if this was needed.
  "title": "Quest's Proper Name", // The proper name of the quest
  "wiki": "https://escapefromtarkov.gamepedia.com/Lend_lease_-_Part_1", // Quests dont currently have this, but if you can add a link to the wiki page for the quest, it would be helpful. I'd like to provide users a route to the wiki page for further guidance.
  "exp": 1000, // The amount of EXP rewarded for the quest, eventually will try to help people optimize leveling to 40 as an alternative to Kappa goal
  "unlocks": ["Item name", "Another item name"], // Array of item names that a quest unlocks - want to create a page to help people prioritize gear they want to unlock.
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
