/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// Ours
import ItemButtonGroup from './ItemButtonGroup';

function TabPanel(props) {
  const { children, tabId, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tabId !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {tabId === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  tabId: PropTypes.number.isRequired,
};

TabPanel.defaultProps = {
  children: {},
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function sortItemArray(props) {
  const sortedItems = {
    sponsor: [],
    giveaway: [],
    characterCard: [],
    other: [],
  };
  if (!props.utilityItemList) {
    // TODO: return something useful
    return sortedItems;
  }
  // Remove holes in array, just in case
  const filteredProps = props.utilityItemList.filter((n) => n);
  // Sort into type arrays within an object
  filteredProps.forEach((element) => {
    switch (element.type.toString()) {
      case 'sponsor':
        sortedItems.sponsor.push(
          <ItemButtonGroup
            key={element.itemName.toString()}
            name={element.title}
          />
        );
        break;
      case 'giveaway':
        sortedItems.giveaway.push(
          <ItemButtonGroup
            key={element.itemName.toString()}
            name={element.title}
          />
        );
        break;
      case 'characterCard':
        sortedItems.characterCard.push(
          <ItemButtonGroup
            key={element.itemName.toString()}
            name={element.title}
          />
        );
        break;
      default:
        sortedItems.other.push(
          <ItemButtonGroup
            key={element.itemName.toString()}
            name={element.title}
          />
        );
    }
  });
  return sortedItems;
}

export default function VerticalTabs(props) {
  const [tabId, setTabID] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabID(newValue);
  };

  const itemObject = sortItemArray(props);

  return (
    <Box
      sx={{
        display: 'flex',
        flexgrow: 1,
        height: 224,
      }}
    >
      <Tabs
        value={tabId}
        onChange={handleChange}
        aria-label="tabs"
        orientation="vertical"
        variant="scrollable"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Sponsors" {...a11yProps(0)} />
        <Tab label="Giveaways" {...a11yProps(1)} />
        <Tab label="Character Cards" {...a11yProps(2)} />
        <Tab label="Other" {...a11yProps(3)} />
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
