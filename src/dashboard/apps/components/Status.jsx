/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Ours
import Keypad from './Keypad';

const Status = React.memo((props) => {
  const { handleHpChange, inputValue, setInputValue, handleKeypadClick } =
    props;
  const KEYPAD_SIZE = 50;
  const ACTION_BUTTON_PROPS = {
    height: 60,
    width: 80,
    my: 2,
  };

  const [action, setAction] = React.useState('');

  function handleActionClick(e) {
    const buttonValue = e.currentTarget.value;
    setAction(buttonValue);
  }

  function handleCancelClick() {
    setInputValue('0');
    setAction('');
  }

  function handleConfirmClick() {
    handleHpChange(action);
    setAction('');
  }

  const inputKeypad = (
    <>
      <Button
        variant="contained"
        color="error"
        value="Cancel"
        onClick={(e) => handleCancelClick(e)}
        sx={{ mx: 2, width: '35%' }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="info"
        value="Cancel"
        onClick={(e) => handleConfirmClick(e)}
        sx={{ mx: 2, width: '35%' }}
      >
        Confirm
      </Button>
      <Typography variant="h5" color="text.primary">
        {`${inputValue}`}
      </Typography>
      <Keypad
        tableWidth="50%"
        color="secondary"
        onClick={(e) => handleKeypadClick(e)}
        noRipple={false}
        buttonProps={{
          height: KEYPAD_SIZE,
          width: KEYPAD_SIZE,
          minWidth: 0,
          borderRadius: '50%',
          margin: 0.5,
        }}
      />
    </>
  );

  const actionTable = (
    <table style={{ width: '100%', tableLayout: 'fixed' }}>
      <tbody>
        <tr>
          <td>
            <Button
              variant="contained"
              color="error"
              size="small"
              value="hurt"
              onClick={(e) => handleActionClick(e)}
              sx={ACTION_BUTTON_PROPS}
            >
              Hurt
            </Button>
          </td>
          <td>
            <Button
              variant="contained"
              color="info"
              size="small"
              value="temp"
              onClick={(e) => handleActionClick(e)}
              sx={ACTION_BUTTON_PROPS}
            >
              TempHP
            </Button>
          </td>
          <td>
            <Button
              variant="contained"
              color="success"
              size="small"
              value="heal"
              onClick={(e) => handleActionClick(e)}
              sx={ACTION_BUTTON_PROPS}
            >
              Heal
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  );

  let content;
  let contentHeading;

  switch (action) {
    case 'heal':
    case 'hurt':
    case 'temp':
      content = inputKeypad;
      contentHeading = `${action.toUpperCase()} HP`;
      break;
    case 'condition':
      // content = conditionTable;
      break;
    default:
      content = actionTable;
  }

  return (
    <Box key="status" sx={{ textAlign: 'center' }}>
      <Typography variant="h6">{contentHeading}</Typography>
      {content}
    </Box>
  );
});

export default Status;