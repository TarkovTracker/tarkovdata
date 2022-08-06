var vorpal = require('vorpal')();

vorpal
	.command('check-collector', 'Checks quests.json for collector data')
	.action(function(args, callback) {
		checkCollectorRequirements(args)
		callback();
	});

vorpal
	.command('new-quest-objective-id', 'Checks quests.json for the next objective ID')
	.action(function(args, callback) {
		newObjectiveId(args)
		callback();
	});

vorpal
	.command('new-quest-id', 'Checks quests.json for the next quest ID')
	.action(function(args, callback) {
		newQuestId(args)
		callback();
	});

vorpal
	.command('new-hideout-objective-id', 'Checks hideout.json for the next hideout module objective ID')
	.action(function(args, callback) {
		newHideoutObjectiveId(args)
		callback();
	});

vorpal
	.command('new-hideout-id', 'Checks hideout.json for the next hideout module ID')
	.action(function(args, callback) {
		newHideoutId(args)
		callback();
	});

vorpal
	.command('verify-quest-data', 'Checks quests.json for common mistakes')
	.action(function(args, callback) {
		verifyQuestData(args)
		callback();
	});

vorpal
	.command('verify-hideout-data', 'Checks hideout.js for common mistakes')
	.action(function(args, callback) {
		verifyHideoutData(args)
		callback();
	});

vorpal
	.command('link-quests', 'Converts any titled require or alternative links to quest IDs')
	.action(function(args, callback) {
		linkQuests(args)
		callback();
	});

vorpal
	.command('find-quests', 'Tests against an array of quest names to find them in quest data')
	.action(function(args, callback) {
		findQuests(args)
		callback();
	});

vorpal
	.command('migrate-game-data', 'Custom migration to deal with game IDs plus custom IDs')
	.action(function(args, callback) {
		migrateQuests(args)
		callback();
	});

vorpal
	.command('migrate-hideout-items', 'Attempt to move hideout items to UUIDs')
	.action(function(args, callback) {
		migrateHideoutItems(args)
		callback();
	});

vorpal
	.command('rotate-interchange-map', 'Fixes interchange gps coords')
	.action(function(args, callback) {
		rotateInterchangeMap(args)
		callback();
	});

function rotateInterchangeMap(args) {
	var newQuests = require('./quests.json')
	var fs = require('fs')
	
	newQuests.forEach((quest, id) => {
		quest.objectives.forEach((objective) => {
			if (objective.location == 4 && 'gps' in objective) {
				const topPercent = 100 - objective.gps.leftPercent
				const leftPercent = objective.gps.topPercent
				objective.gps.topPercent = topPercent
				objective.gps.leftPercent = leftPercent
			}
		}, this)
	}, this)

	var questString = JSON.stringify(newQuests, null, 4)

	console.log(questString)

	fs.writeFileSync('quests.json', questString);
}


function migrateHideoutItems(args) {
	var fs = require('fs')
	var hideoutData = require('./hideout.json')
	var itemData = require('./items.en.json')

	var itemDictionary = Object.values(itemData).reduce((a, x) => ({ ...a, [x.name]: x }), {})

	hideoutData.modules.forEach((hideoutModule) => {
		hideoutModule.require.forEach((requirement) => {
			if (requirement.type == 'item') {
				if (itemDictionary[requirement.name]) {
					//console.log(`Replacing ${requirement.name} with ${itemDictionary[requirement.name].id}`)
					requirement.name = itemDictionary[requirement.name].id
				}else {
					console.log(`Couldn't find an item ID for ${requirement.name}`)
				}
			}
		})
	})

	var hideoutString = JSON.stringify(hideoutData, null, 4)

	fs.writeFileSync('hideout.json', hideoutString);
}

function migrateQuests(args) {
	var newQuests = require('./quests.json')
	var oldQuests = require('./oldquests.json')
	var fs = require('fs')
	
	newQuests.forEach((quest, id) => {
		// Set the gameId to the current quest id
		newQuests[id].gameId = quest.id
		newQuests[id].id = oldQuests[id].id
		if (quest.require && quest.require.quests) {
			newQuests[id].require.quests = oldQuests[id].require.quests
		}
	})

	var questString = JSON.stringify(newQuests, null, 4)

	console.log(questString)

	fs.writeFileSync('quests.json', questString);
}

function findQuests(args) {
	var newQuests = require('./quests.json')
	var testNames = require('./testdata.json')
	
	var questDictionaryTitle = debugQuests.reduce((a, x) => ({ ...a,
		[x.title.toLowerCase()]: x
	}), {})

	//console.log(testNames)

	testNames.forEach((name) => {
		if(questDictionaryTitle[name.toLowerCase()] == null) {
			console.log(`Couldn't find ${name}`)
		}
	})
}

function linkQuests(args) {
	var debugQuests = require('./quests.json')
	var questDictionaryTitle = debugQuests.reduce((a, x) => ({ ...a,
		[x.title.toLowerCase()]: x
	}), {})

	debugQuests.forEach((quest, questIndex) => {
		if ('quests' in quest.require) {
			quest.require.quests.forEach((requiredQuest, requiredIndex) => {
				if (Array.isArray(requiredQuest)) {
					// Required quest is a 'one-of' array
					quest.require.quests[requiredIndex].forEach((oneOfQuest, oneOfIndex) => {
						if (typeof oneOfQuest === 'string') {
							console.log(`Replacing ${oneOfQuest} with ${questDictionaryTitle[oneOfQuest.toLowerCase()].id}`)
							debugQuests[questIndex].require.quests[requiredIndex][oneOfIndex] = questDictionaryTitle[oneOfQuest.toLowerCase()].id
						}
						
					})
				}else if (typeof requiredQuest === 'string') {
					console.log(`Replacing ${requiredQuest} with ${questDictionaryTitle[requiredQuest.toLowerCase()].id}`)
					debugQuests[questIndex].require.quests[requiredIndex] = questDictionaryTitle[requiredQuest.toLowerCase()].id
				}
			})
		}
		if ('fail' in quest.require) {
			quest.require.fail.forEach((failedQuest, failedIndex) => {
				if (typeof failedQuest === 'string') {
					console.log(`Replacing ${failedQuest} with ${questDictionaryTitle[failedQuest.toLowerCase()].id}`)
					debugQuests[questIndex].require.fail[failedIndex] = questDictionaryTitle[failedQuest.toLowerCase()].id
				}
			})
		}
		if ('alternatives' in quest) {
			quest.alternatives.forEach((alternativeQuest, alternativeIndex) => {
				if (typeof alternativeQuest === 'string') {
					console.log(`Replacing ${alternativeQuest} with ${questDictionaryTitle[alternativeQuest.toLowerCase()].id}`)
					debugQuests[questIndex].alternatives[alternativeIndex] = questDictionaryTitle[alternativeQuest.toLowerCase()].id
				}
			})
		}
	})
	const fs = require('fs'); 
	fs.writeFileSync('./quests.json', JSON.stringify(debugQuests, null, 4) , 'utf-8');
}

function checkCollectorRequirements(args) {
	var collectorQuests = []
	var highestCollectorLevel = 0
	var debugQuests = require('./quests.json')

	var questDictionaryId = debugQuests.reduce((a, x) => ({ ...a,
		[x.id]: x
	}), {})

	// First, filter it down to every quest except collector, nokappa quests, and deprecated quests
	var allQuestsButCollector = debugQuests.filter(x => x.id != 195 && x.deprecated != true && x.nokappa !== true)

	console.log(`Collector currently requires ${allQuestsButCollector.length} quests`)

	// Next, get an array of all required quests
	var allRequiredQuests = allQuestsButCollector
		.reduce((acc, x) => acc.concat(x.require.quests), [])

	// Find all the leaf node quests (not required for anything except Collector)
	var finalQuests = allQuestsButCollector.filter(x => allRequiredQuests.indexOf(x.id) < 0)

	console.log(`There are ${finalQuests.length} leaf quests (no other quest except Collector requires them)`)

	// Find the maximum level value requirements for all of the collector required quests
	var highestCollectorLevel = Math.max(...allQuestsButCollector.filter(x => x.require.level).reduce((acc, x) => acc.concat(x.require.level), []))
	console.log(`The highest level quest required for Collector is ${highestCollectorLevel}`)

	console.log('Collector Required Leaf Quests:')
	console.log(finalQuests.reduce((acc, x) => acc.concat(x.title), []))

	// Select the quest with id 195 from debug quests (collector)
	var collectorQuest = questDictionaryId[195]
	// The final leaf nodes for collector
	var leafNodes = finalQuests.reduce((acc, x) => acc.concat(x.id), [])
	// Check if the require.quests array is equal to the collector required quests
	if (JSON.stringify(collectorQuest.require.quests) == JSON.stringify(leafNodes)) {
		console.log('Collector quest requirements appear correct')
	}else{
		console.log('Collector quest requirements appear incorrect')
		console.log('Collector Required Quests by ID:')
		console.log(finalQuests.reduce((acc, x) => acc.concat(x.id), []))
	}
}

function newHideoutId(args) {
	var debugHideout = require('./hideout.json')

	var highestHideoutID = 0
	for (var i = debugHideout.length - 1; i >= 0; i--) {
		if (debugHideout[i].id > highestHideoutID) {
			highestHideoutID = debugHideout[i].id
		}
	}
	console.log(`Next quest ID: ${highestHideoutID + 1}`)
}

function newHideoutObjectiveId(args) {
	var debugHideout = require('./hideout.json')

	var objectiveArray = debugHideout.modules
		.reduce((acc, x) => acc.concat(x.require), [])

	var highestObjectiveID = 0
	for (var i = objectiveArray.length - 1; i >= 0; i--) {
		if (objectiveArray[i].id > highestObjectiveID) {
			highestObjectiveID = objectiveArray[i].id
		}
	}
	console.log(`Next hideout objective ID: ${highestObjectiveID + 1}`)
}

function newQuestId(args) {
	var debugQuests = require('./quests.json')

	var highestQuestID = 0
	for (var i = debugQuests.length - 1; i >= 0; i--) {
		if (debugQuests[i].id > highestQuestID) {
			highestQuestID = debugQuests[i].id
		}
	}
	console.log(`Next quest ID: ${highestQuestID + 1}`)
}

function newObjectiveId(args) {
	var debugQuests = require('./quests.json')

	var objectiveArray = debugQuests
		.reduce((acc, x) => acc.concat(x.objectives), [])

	var highestObjectiveID = 0
	for (var i = objectiveArray.length - 1; i >= 0; i--) {
		if (objectiveArray[i].id > highestObjectiveID) {
			highestObjectiveID = objectiveArray[i].id
		}
	}
	console.log(`Next objective ID: ${highestObjectiveID + 1}`)
}

function verifyHideoutData(args) {
	// Find hideout IDs we may have duplicated (shouldn't happen)
	var debugHideout = require('./hideout.json')
	var result = Object.values(debugHideout.modules.reduce((c, v) => {
		let k = v.id;
		c[k] = c[k] || [];
		c[k].push(v);
		return c;
	}, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
	if (result.length > 0) {
		console.log("Duplicate hideout IDs:")
		console.log(result)
	}

	// Find hideout indexes we haven't filled IDs for

	// Get highest ID
	var missingModuleIDs = []
	var highestHideoutID = 0
	for (var i = debugHideout.modules.length - 1; i >= 0; i--) {
		if (debugHideout.modules[i].id > highestHideoutID) {
			highestHideoutID = debugHideout.modules[i].id
		}
	}
	var filledIDs = new Array(highestHideoutID).fill(false)
	for (var i = debugHideout.modules.length - 1; i >= 0; i--) {
		filledIDs[debugHideout.modules[i].id] = true
	}
	for (var i = filledIDs.length - 1; i >= 0; i--) {
		if (filledIDs[i] == false) {
			missingModuleIDs.push(i)
		}
	}
	if (missingModuleIDs.length > 0) {
		console.log("Missing Hideout IDs:")
		console.log(missingModuleIDs)
	}
	console.log(`Highest Hideout Module ID: ${highestHideoutID}`)

	// Find duplicated objective IDs (some may be intentional)
	var hideoutObjectives = []
	for (var i = debugHideout.modules.length - 1; i >= 0; i--) {
		for (var x = debugHideout.modules[i].require.length - 1; x >= 0; x--) {
			hideoutObjectives.push(debugHideout.modules[i].require[x])
		}
	}
	var result = Object.values(hideoutObjectives.reduce((c, v) => {
		let k = v.id;
		c[k] = c[k] || [];
		c[k].push(v);
		return c;
	}, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
	if (result.length > 0) {
		console.log("Duplicate objective IDs:")
		console.log(result)
	}

	// Check for objective IDs we haven't filled or deleted:
	// Get highest ID
	var missingHideoutObjectiveIDs = []
	var highestObjectiveID = 0
	for (var i = hideoutObjectives.length - 1; i >= 0; i--) {
		if (hideoutObjectives[i].id > highestObjectiveID) {
			highestObjectiveID = hideoutObjectives[i].id
		}
	}
	var filledIDs = new Array(highestObjectiveID + 1).fill(false)
	for (var i = hideoutObjectives.length - 1; i >= 0; i--) {
		filledIDs[hideoutObjectives[i].id] = true
	}
	for (var i = filledIDs.length - 1; i >= 0; i--) {
		if (filledIDs[i] == false) {
			missingHideoutObjectiveIDs.push(i)
			console.log("ID " + i + " not filled")
		}
	}
	if (missingHideoutObjectiveIDs.length > 0) {
		console.log("Missing Objective IDs:")
		console.log(missingHideoutObjectiveIDs)
	}
	console.log("Highest Objective ID: " + highestObjectiveID)
}

function verifyQuestData(args) {

	var debugQuests = require('./quests.json')

	var questDictionaryTitle = debugQuests.reduce((a, x) => ({ ...a,
		[x.title]: x
	}), {})
	var questDictionaryId = debugQuests.reduce((a, x) => ({ ...a,
		[x.id]: x
	}), {})


	var result = Object.values(debugQuests.reduce((c, v) => {
		let k = v.id;
		c[k] = c[k] || [];
		c[k].push(v);
		return c;
	}, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
	if (result.length > 0) {
		console.log("Duplicate quest IDs:")
		console.log(result)
	}

	// Find quests we haven't filled IDs for

	// Get highest ID
	var highestQuestID = 0
	var missingQuestIds = []
	for (var i = debugQuests.length - 1; i >= 0; i--) {
		if (debugQuests[i].id > highestQuestID) {
			highestQuestID = debugQuests[i].id
		}
	}
	var filledIDs = new Array(highestQuestID).fill(false)
	for (var i = debugQuests.length - 1; i >= 0; i--) {
		filledIDs[debugQuests[i].id] = true
	}
	for (var i = filledIDs.length - 1; i >= 0; i--) {
		if (filledIDs[i] == false) {
			missingQuestIds.push(i)
		}
	}
	if (missingQuestIds.length > 0) {
		console.log("Missing Quest IDs:")
		console.log(missingQuestIds)
	}
	console.log("Highest Quest ID: " + highestQuestID)

	// Find quests we may have duplicated titles of
	var result = Object.values(debugQuests.reduce((c, v) => {
		let k = v.title;
		c[k] = c[k] || [];
		c[k].push(v);
		return c;
	}, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
	if (result.length > 0) {
		console.log("Duplicate quest titles:")
		console.log(result)
	}

	// Find duplicated objective IDs (some may be intentional)
	var questObjectives = []
	for (var i = debugQuests.length - 1; i >= 0; i--) {
		for (var x = debugQuests[i].objectives.length - 1; x >= 0; x--) {
			questObjectives.push(debugQuests[i].objectives[x])
		}
	}
	var result = Object.values(questObjectives.reduce((c, v) => {
		let k = v.id;
		c[k] = c[k] || [];
		c[k].push(v);
		return c;
	}, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
	if (result.length > 0) {
		console.log("Duplicate objective IDs (some may be intentional):")
		console.log(result)
	}

	// Check for objective IDs we haven't filled or deleted:
	// Get highest ID
	var missingObjectiveIds = []
	var highestObjectiveID = 0
	for (var i = questObjectives.length - 1; i >= 0; i--) {
		if (questObjectives[i].id > highestObjectiveID) {
			highestObjectiveID = questObjectives[i].id
		}
	}
	var filledIDs = new Array(highestObjectiveID + 1).fill(false)
	for (var i = questObjectives.length - 1; i >= 0; i--) {
		filledIDs[questObjectives[i].id] = true
	}
	for (var i = filledIDs.length - 1; i >= 0; i--) {
		if (filledIDs[i] == false) {
			missingObjectiveIds.push(i)
			console.log("ID " + i + " not filled")
		}
	}
	if (missingObjectiveIds.length > 0) {
		console.log("Missing Quest IDs:")
		console.log(missingObjectiveIds)
	}
	console.log("Highest Objective ID: " + highestObjectiveID)

	//Check for undefined required quests
	var badRequirement = []
	for (var i = debugQuests.length - 1; i >= 0; i--) {
		if (!('giver' in debugQuests[i])) {
			console.log("ID " + i + " doesn't have giver")
		}
		if ('require' in debugQuests[i] && 'quests' in debugQuests[i].require) {
			for (var x = debugQuests[i].require.quests.length - 1; x >= 0; x--) {
				if (Array.isArray(debugQuests[i].require.quests[x])) {
					for (var y = debugQuests[i].require.quests[x].length - 1; y >= 0; y--) {
						if (questDictionaryId[debugQuests[i].require.quests[x][y]] == null) {
							badRequirement.push({
								quest: i,
								requirement: debugQuests[i].require.quests[x][y]
							})
						}
					}
				} else if (questDictionaryId[debugQuests[i].require.quests[x]] == null) {
					badRequirement.push({
						quest: i,
						requirement: debugQuests[i].require.quests[x]
					})
					console.log("ID " + i + " has undefined requirement " + debugQuests[i].require.quests[x])
				}
			}
		} else {
			badRequirement.push({
				quest: i,
				requirement: null
			})
			console.log("ID " + i + " doesn't have quest require")
		}
	}
	if (badRequirement.length > 0) {
		console.log("Broken quest data:")
		console.log(badRequirement)
	}
}

vorpal.parse(process.argv);