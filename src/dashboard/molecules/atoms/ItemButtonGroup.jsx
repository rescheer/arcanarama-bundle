/* eslint-disable import/prefer-default-export */
import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

export default class ItemButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { name } = this.props;
    return (
      <Box sx={{ pb: '4px' }}>
        <ButtonGroup
          fullWidth
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button sx={{ width: 1 }}>
            {!name ? 'ERR::MISSING_NAME' : name}
          </Button>
          <Button aria-label="edit" sx={{ width: 50 }}>
            <Icon>edit</Icon>
          </Button>
          <Button aria-label="delete" sx={{ width: 50 }} color="error">
            <Icon>delete</Icon>
          </Button>
        </ButtonGroup>
      </Box>
    );
  }
}

ItemButtonGroup.propTypes = {
  name: PropTypes.string.isRequired,
};
