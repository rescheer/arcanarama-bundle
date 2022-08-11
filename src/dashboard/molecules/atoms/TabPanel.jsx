/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

export default function TabPanel(props) {
  const { children, tabId, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tabId !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {tabId === index && (
        <Box
          sx={{
            pl: 1,
            pr: 1,
            color: 'black',
          }}
        >
          {children}
        </Box>
      )}
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
