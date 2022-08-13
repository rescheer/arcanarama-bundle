/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mui/material/Icon';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

// Ours
import ItemButton from './ItemButton';
import TabPanel from './TabPanel';

const { nodecg } = window;
const currentUtilityItem = nodecg.Replicant('currentUtilityItem');

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function VerticalTabs(props) {
  const [tabId, setTabId] = React.useState(0);

  const activeItemType = props.currentUtilityItem.type;

  const tabIcons = ['', '', '', ''];
  let defaultIcon;

  const setActiveTabIcon = () => {
    defaultIcon = '';
    switch (activeItemType) {
      case 'defaultItem':
        defaultIcon = 'visibility';
        break;
      case 'sponsor':
        tabIcons[0] = 'visibility';
        break;
      case 'giveaway':
        tabIcons[1] = 'visibility';
        break;
      case 'characterCard':
        tabIcons[2] = 'visibility';
        break;
      case 'other':
        tabIcons[3] = 'visibility';
        break;
      default:
        break;
    }
  };

  // TODO: Move this function up to App level and run onMount and onUpdate.
  // We should just pass the sorted list as a prop down to this component,
  // then have a new map function to create the ItemButton component children.
  function sortItemArray() {
    const sortedItems = {
      sponsor: [],
      giveaway: [],
      characterCard: [],
      defaultItem: {},
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
      switch (element.type) {
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
        case 'defaultItem':
          sortedItems.defaultItem = element;
          break;
        case 'other':
          sortedItems.other.push(
            <ItemButton
              {...props}
              key={element.itemName.toString()}
              itemName={element.title}
              element={element}
            />
          );
          break;
        default:
          break;
      }
    });
    return sortedItems;
  }

  // TODO: One sortItemArray is moved, we won't need this
  const itemObject = sortItemArray();

  setActiveTabIcon();

  const handleTabChange = (event, newTabId) => {
    setTabId(newTabId);
  };

  const handleDefaultClicked = () => {
    if (itemObject.defaultItem !== undefined) {
      currentUtilityItem.value = itemObject.defaultItem;
      setActiveTabIcon();
      defaultIcon = 'visibility';
    }
  };

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
        textColor="secondary"
        indicatorColor="secondary"
        TabIndicatorProps={{ sx: { width: '6px' } }}
        aria-label="tabs"
        orientation="vertical"
        // variant="scrollable"
        sx={{
          borderRight: 1,
          borderColor: 'primary',
          bgcolor: '#525f78',
          pt: 1,
        }}
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
        <TabPanel value={tabId} index={0}>
          <Button
            variant="contained"
            color="info"
            onClick={handleDefaultClicked}
            sx={{ m: 1, width: 0.961 }}
            startIcon={<Icon>{defaultIcon}</Icon>}
          >
            Default
          </Button>
          <Divider sx={{ ml: 2, mr: 2 }} />
          {itemObject.sponsor}
        </TabPanel>
        <TabPanel value={tabId} index={1}>
          <Button
            variant="contained"
            color="info"
            onClick={handleDefaultClicked}
            sx={{ m: 1, width: 0.961 }}
            startIcon={<Icon>{defaultIcon}</Icon>}
          >
            Default
          </Button>
          <Divider />
          {itemObject.giveaway}
        </TabPanel>
        <TabPanel value={tabId} index={2}>
          <Button
            variant="contained"
            color="info"
            onClick={handleDefaultClicked}
            sx={{ m: 1, width: 0.961 }}
            startIcon={<Icon>{defaultIcon}</Icon>}
          >
            Default
          </Button>
          <Divider />
          {itemObject.characterCard}
        </TabPanel>
        <TabPanel value={tabId} index={3}>
          <Button
            variant="contained"
            color="info"
            onClick={handleDefaultClicked}
            sx={{ m: 1, width: 0.961 }}
            startIcon={<Icon>{defaultIcon}</Icon>}
          >
            Default
          </Button>
          <Divider />
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
