/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// Ours
import VerticalTabs from './atoms/VerticalTabs';
import TabPanel from './atoms/TabPanel';

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function UtilityApp(props) {
  const [tabId, setTabId] = React.useState(0);

  const handleTabChange = (event, newTabId) => {
    setTabId(newTabId);
  };

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: '#525f78' }}>
        <Tabs
          value={tabId}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          TabIndicatorProps={{ sx: { height: '6px' } }}
          variant="fullWidth"
          aria-label="full width tabs"
        >
          <Tab label="Manual" {...a11yProps(0)} />
          <Tab label="Automatic" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabId} index={0}>
        <VerticalTabs {...props} />
      </TabPanel>
      <TabPanel value={tabId} index={1}>
        TODO
      </TabPanel>
    </Box>
  );
}
