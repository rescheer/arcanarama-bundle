/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mui/material/Icon';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// Ours
import ItemButton from './atoms/ItemButton';
import TabPanel from './atoms/TabPanel';

const { nodecg } = window;
const currentUtilityItem = nodecg.Replicant('currentUtilityItem');

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function VerticalTabs(props) {
  const [tabId, setTabID] = React.useState(0);

  const activeItemType = currentUtilityItem.value.type;
  const tabIcons = ['', '', '', ''];
  const setActiveTabIcon = () => {
    switch (activeItemType) {
      case 'sponsor':
        tabIcons[0] = 'visibility';
        break;
      case 'giveaway':
        tabIcons[1] = 'visibility';
        break;
      case 'characterCard':
        tabIcons[2] = 'visibility';
        break;
      default:
        tabIcons[3] = 'visibility';
        break;
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabID(newValue);
  };

  function sortItemArray() {
    const sortedItems = {
      sponsor: [],
      giveaway: [],
      characterCard: [],
      other: [],
    };
    if (!props.utilityItemList || props.utilityItemList === undefined) {
      return {
        sponsor: ['List Empty! Add items from Asset Manager'],
        giveaway: ['List Empty! Add items from Asset Manager'],
        characterCard: ['List Empty! Add items from Asset Manager'],
        other: ['List Empty! Add items from Asset Manager'],
      };
    }
    // Remove holes in array, just in case
    const filteredProps = props.utilityItemList.filter((n) => n);
    // Sort into type arrays within an object
    filteredProps.forEach((element) => {
      switch (element.type.toString()) {
        case 'sponsor':
          sortedItems.sponsor.push(
            <ItemButton
              {...props}
              key={element.itemName.toString()}
              itemName={element.title}
              element={element}
            />
          );
          break;
        case 'giveaway':
          sortedItems.giveaway.push(
            <ItemButton
              {...props}
              key={element.itemName.toString()}
              itemName={element.title}
              element={element}
            />
          );
          break;
        case 'characterCard':
          sortedItems.characterCard.push(
            <ItemButton
              {...props}
              key={element.itemName.toString()}
              itemName={element.title}
              element={element}
            />
          );
          break;
        default:
          sortedItems.other.push(
            <ItemButton
              {...props}
              key={element.itemName.toString()}
              itemName={element.title}
              element={element}
            />
          );
      }
    });
    return sortedItems;
  }

  const itemObject = sortItemArray();
  setActiveTabIcon();
  return (
    <Box
      sx={{
        display: 'flex',
        flexgrow: 1,
        // height: 224,
      }}
    >
      <Tabs
        value={tabId}
        onChange={handleTabChange}
        aria-label="tabs"
        orientation="vertical"
        // variant="scrollable"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab
          label="Sponsors"
          {...a11yProps(0)}
          iconPosition="start"
          icon={<Icon>{tabIcons[0]}</Icon>}
        />
        <Tab
          label="Giveaways"
          {...a11yProps(1)}
          iconPosition="start"
          icon={<Icon>{tabIcons[1]}</Icon>}
        />
        <Tab
          label="Character Cards"
          {...a11yProps(2)}
          iconPosition="start"
          icon={<Icon>{tabIcons[2]}</Icon>}
        />
        <Tab
          label="Other"
          {...a11yProps(3)}
          iconPosition="start"
          icon={<Icon>{tabIcons[3]}</Icon>}
        />
      </Tabs>
      <Box id="tabpanelbox" sx={{ width: '100%' }}>
        <TabPanel tabId={tabId} index={0}>
          {itemObject.sponsor}
        </TabPanel>
        <TabPanel tabId={tabId} index={1}>
          {itemObject.giveaway}
        </TabPanel>
        <TabPanel tabId={tabId} index={2}>
          {itemObject.characterCard}
        </TabPanel>
        <TabPanel tabId={tabId} index={3}>
          {itemObject.other}
        </TabPanel>
      </Box>
    </Box>
  );
}

VerticalTabs.propTypes = {
  utilityItemList: PropTypes.arrayOf(Object),
  currentUtilityItem: PropTypes.objectOf(String),
};

VerticalTabs.defaultProps = {
  utilityItemList: [],
  currentUtilityItem: {},
};
