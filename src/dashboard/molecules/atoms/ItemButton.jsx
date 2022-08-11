import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';

const { nodecg } = window;
const currentUtilityItem = nodecg.Replicant('currentUtilityItem');

export default function ItemButton(props) {
  const { element } = props;
  const { itemName } = element;
  const activeItem = currentUtilityItem.value.itemName;

  let icon = '';
  if (itemName === activeItem) {
    icon = 'visibility';
  }

  const handleClick = () => {
    const newItem = element.itemName;
    if (activeItem !== newItem) {
      currentUtilityItem.value = element;
    }
  };

  return (
    <Box sx={{ pt: '8px' }}>
      <Button
        color="secondary"
        variant="contained"
        sx={{ width: 0.961, ml: 1 }}
        startIcon={<Icon>{icon}</Icon>}
        id={element.itemName}
        onClick={handleClick}
      >
        {!element.title ? 'ERR::MISSING_NAME' : element.title}
      </Button>
    </Box>
  );
}

ItemButton.propTypes = {
  element: PropTypes.objectOf(String).isRequired,
};
