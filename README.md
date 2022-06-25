<p align="center">
    <a href="https://github.com/TarkovTracker/tarkovdata/issues" alt="Issues">
      <img src="https://img.shields.io/github/issues/TarkovTracker/tarkovdata" />
    </a>
    <a href="https://github.com/TarkovTracker/tarkovdata/discussions" alt="Discussions">
        <img src="https://img.shields.io/github/discussions/TarkovTracker/tarkovdata" />
    </a>
    <a href="https://github.com/TarkovTracker/tarkovdata/commits/master" alt="Commits">
        <img src="https://img.shields.io/github/last-commit/TarkovTracker/tarkovdata" />
    </a>
    <a href="https://img.shields.io/github/contributors/TarkovTracker/tarkovdata" alt="Contributors">
        <img src="https://img.shields.io/github/contributors/TarkovTracker/tarkovdata" />
    </a>
</p>

# tarkovdata
tarkovdata is game information for [Escape From Tarkov](https://www.escapefromtarkov.com/) in easy to use formats to enable developing tools for assisting players. Everything here is contributed by the community (like you!) and maintained by developers of community tools like [Tarkov Tracker](https://tarkovtracker.io/), [Tarkov Guru](https://tarkov.guru/), [Tarkov.dev](https://tarkov.dev/), and [Tarkov Tools](https://tarkov-tools.com/) (defunct)

This repository is still growing, with plans for new sets of data including SVG maps, item properties, localization, and more. Some schemas of data will change over time as the data matures, but breaking schemas will be avoided except when needed for added value.

See [quests.json](quests.json) for Quest Data, including requirements, unlocks, and objectives

See [hideout.json](hideout.json) for Hideout Data, including station information, and requirements

See [items.en.json](items.en.json) for Item Names, in English, both short and long, with BSG UIDs

See [traders.json](traders.json) for Trader metadata

See [maps.json](maps.json) for Map metadata

See [item_presets.json](item_presets.json) for Weapon Preset configurations

See [ammunition.json](ammunition.json) for Ammunition metadata

## Contributing

For any contribution, please create a pull request with your changes. If your changes include schema changes, please open an issue in advance to discuss with current maintainers (we don't want you wasting work if the schema change doesn't fit). Our current policy is one approval by a maintainer then feel free to merge.

## CLI Tool

To help with some basic data management functions and eventually integrity checks on PRs, a CLI tool is included with the repository.

Provided you have node/npm installed, you can run `npm cli.js help` to list available commands. Commands like `node cli.js verify-quest-data` and `node cli.js verify-hideout-data` are important to check that no important mistakes were made when modifying the data. Commands like `node cli.js new-quest-id` can find the next consecutive quest ID to utilize for new quests, there are similar commmands for hideout & objectives.

If you would like to help keep the quest data up to date with changes, please submit a pull request to the master branch. Feel free to utilize the Github discussions feature to talk about data format and potential additions.
