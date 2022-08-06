'use strict';

const DEFAULT_UTIL_ID = "#utilSpindles";
const DEFAULT_UTIL_TITLE = "Default (Spindles)"

/**
** Replicant (persistent): utilityItemCollection
** Data Type: Object
** Keys: str - sponsor, giveaway, merch, characterCard, etc.
** Values: array containing utilityItem objects
*/
const utilityItemCollection = nodecg.Replicant('utilityItemCollection');
const currentUtility = nodecg.Replicant('currentUtility', {defaultValue: "#utilSpindles"});

const utilityContainer = document.getElementById('utilityContainer');

function openTab(evt, tab) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tab).style.display = "block";
      evt.currentTarget.className += " active";
}

function switchActiveUtilityItem(evt, item, title) {
    document.getElementById('currentItemValue').innerHTML = title;
    currentUtility.value = item;

    let i, tabContentButtons;
    tabContentButtons = document.getElementsByClassName('tabcontentbutton');
    for (i = 0; i < tabContentButtons.length; i++) {
        tabContentButtons[i].className = tabContentButtons[i].className.replace(" active", "");
    }
    evt.currentTarget.className += " active";
}

function createTabs(container, collection) {
    if (!collection){
        nodecg.log.warn('utilityItemCollection is empty, skipping tab creation.');
        //TODO: Print HTML warning user
        return;
    }
    
    // Tab Button Container
    const tabContainer = document.createElement('div');
    tabContainer.setAttribute('class', 'tab');

    // Tab Content Container
    const tabContentContainer = document.createElement('div');
   
    let firstElement = true;
    let firstElementID;
    for (const x in collection) {
        // Create Tabs for each type of item
        let tab = document.createElement('button');
        tab.setAttribute('class', 'tablinks');
        tab.setAttribute('onclick', 'openTab(event, \'' + x + '\')');
        tab.innerHTML = x + "s";
        if(firstElement) {
            tab.setAttribute('id', 'defaultTab');
            firstElement = false;
        }
        tabContainer.appendChild(tab);

        // Create tabContent divs for each type of item
        let tabContent = document.createElement('div');
        tabContent.setAttribute('id', x);
        tabContent.setAttribute('class', 'tabcontent');
        tabContentContainer.appendChild(tabContent);

        // Populate TabContent divs with buttons for each item
        let i;
        for (i = 0; i < collection[x].length; i++) {
            if (!collection[x].hasOwnProperty(i)) {
                continue;
            }

            let tabContentButton = document.createElement('button');
            tabContentButton.setAttribute('class', 'tabcontentbutton');
            tabContentButton.setAttribute('onclick', `switchActiveUtilityItem(event, \'${collection[x][i].imgID}\', \'${collection[x][i].title}\')`);
            tabContentButton.innerHTML = collection[x][i].name;
            tabContent.appendChild(tabContentButton);

        }
    }

    container.appendChild(tabContainer);
    container.appendChild(tabContentContainer);
    document.getElementById('defaultTab').click();
    return;
}

nodecg.readReplicant('utilityItemCollection', value => {
    createTabs(utilityContainer, value)
});