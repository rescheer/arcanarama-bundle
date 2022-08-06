'use strict';
var fs = require('fs');
var path = require('path');

module.exports = function (nodecg) {
	//nodecg.log.info('Hello, from your bundle\'s extension!');

	//--Replicants
	const currentUtility = nodecg.Replicant('currentUtility', {defaultValue: "#utilSpindles", persistent: false});

	//--utilityItem Array Replicants TODO: add placeholder defaultValues
	const sponsorList = nodecg.Replicant('sponsorList', {defaultValue: []});
	const giveawayList = nodecg.Replicant('giveawayList', {defaultValue: []});
	const characterCardList = nodecg.Replicant('characterCardList', {defaultValue: []});
	const miscList = nodecg.Replicant('miscList', {defaultValue: []});

	//--Classes
	class UtilityItem {
		constructor(name, title, shortDesc, url, imagePath, interval, duration) {
			this.name = name;
			this.title = title;
			this.shortDesc = shortDesc;
			this.url = url;
			this.imagePath = imagePath;
			this.interval = interval;
			this.duration = duration;
			this.buttonID = name + "Button";
			this.buttonSelector = "#" + name + "Button";
		}
	};

	const itemExample = new UtilityItem(
		"testItem",//name
		"Test Item",//title
		"A Test Item.",//shortDesc
		"",//URL
		"",//imagePath
		1000,//interval (sec)
		1//duration (sec)
	);
};
