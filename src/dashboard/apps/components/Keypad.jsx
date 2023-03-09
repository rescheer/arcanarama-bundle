/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';

const Keypad = React.memo((props) => {
  const { tableWidth, buttonProps, color, onClick, noRipple } = props;

  const keypadButtons = [];
  for (let i = 1; i <= 9; i += 3) {
    keypadButtons.push(
      <tr key={i}>
        <td>
          <Button
            color={color}
            variant="contained"
            sx={buttonProps}
            onClick={onClick}
            value={i}
            disableRipple={noRipple}
          >
            {i}
          </Button>
        </td>
        <td>
          <Button
            color={color}
            variant="contained"
            sx={buttonProps}
            onClick={onClick}
            value={i + 1}
            disableRipple={noRipple}
          >
            {i + 1}
          </Button>
        </td>
        <td>
          <Button
            color={color}
            variant="contained"
            sx={buttonProps}
            onClick={onClick}
            value={i + 2}
            disableRipple={noRipple}
          >
            {i + 2}
          </Button>
        </td>
      </tr>
    );
  }
  keypadButtons.push(
    <tr key={color}>
      <td>
        <Button
          color="error"
          variant="contained"
          sx={buttonProps}
          onClick={onClick}
          value="clear"
          disableRipple={noRipple}
        >
          <Icon value="clear">clear</Icon>
        </Button>
      </td>
      <td>
        <Button
          color={color}
          variant="contained"
          sx={buttonProps}
          onClick={onClick}
          value={0}
          disableRipple={noRipple}
        >
          0
        </Button>
      </td>
      <td>
        <Button
          color="info"
          variant="contained"
          sx={buttonProps}
          onClick={onClick}
          value="backspace"
          disableRipple={noRipple}
        >
          <Icon value="backspace">backspace</Icon>
        </Button>
      </td>
    </tr>
  );

  return (
    <Box key="keypad" sx={{ textAlign: 'center' }}>
      <table
        style={{ marginLeft: 'auto', marginRight: 'auto', width: tableWidth }}
      >
        <tbody>{keypadButtons}</tbody>
      </table>
    </Box>
  );
});

export default Keypad;
