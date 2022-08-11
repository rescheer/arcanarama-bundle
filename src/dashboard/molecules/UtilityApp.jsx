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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: '#525f78' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          TabIndicatorProps={{ sx: { height: '6px' } }}
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Manual" {...a11yProps(0)} />
          <Tab label="Automatic" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <VerticalTabs {...props} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </Box>
  );
}
