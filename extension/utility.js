'use strict';

const nodecg = require('./util/nodecg-api-context').get();

/**
** Replicant (persistent)
** Keys: str - sponsor, giveaway, merch, characterCard, etc.
** Values: array containing utilityItem objects
*/
const utilityItemCollection = nodecg.Replicant('utilityItemCollection', {defaultValue: {}});


//--Classes
class UtilityItem {
    constructor(name, title, type, shortDesc, url, imagePath, interval, duration) {
        this.name = name;
        this.title = title;
        this.type = type;
        this.shortDesc = shortDesc;
        this.url = url;
        this.imagePath = imagePath;
        this.interval = interval;
        this.duration = duration;
        this.buttonID = '#' + name + 'Button';
        this.imgID = '#' + name + 'Img';
    }
};

function updateUtilityItem(oldData, newData) {

}

function addUtilityItem(data) {

}

function removeUtilityItem(data) {

}

const itemExample = new UtilityItem(
    "testItem",//name
    "Test Item",//title
    "Test",//type
    "A Test Item.",//shortDesc
    "",//URL
    "",//imagePath
    1000,//interval (sec)
    1//duration (sec)
);

const itemExampleTwo = new UtilityItem(
    "testItem2",//name
    "Test Item 2",//title
    "Test2",//type
    "A second Test Item.",//shortDesc
    "",//URL
    "",//imagePath
    1000,//interval (sec)
    1//duration (sec)
);

const itemExampleThree = new UtilityItem(
    "testItem3",//name
    "Test Item 3",//title
    "Test2",//type
    "A second Test Item.",//shortDesc
    "",//URL
    "",//imagePath
    1000,//interval (sec)
    1//duration (sec)
);

utilityItemCollection.value[itemExample.type] = [itemExample];
utilityItemCollection.value[itemExampleTwo.type] = [itemExampleTwo, itemExampleThree];