/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Ours
import Keypad from './Keypad';

const Status = React.memo((props) => {
  // Props
  const {
    handleHpChange,
    inputValue,
    setInputValue,
    handleKeypadClick,
    currentHp,
  } = props;
  const KEYPAD_SIZE = 50;

  // States
  const [action, setAction] = React.useState('');

  // Handlers
  function handleActionClick(e, actionValue) {
    setAction(actionValue);
  }

  function handleCancelClick() {
    setInputValue('0');
    setAction('');
  }

  function handleConfirmClick() {
    handleHpChange(action);
    setAction('');
  }

  // Functions
  function splitIntoRows(fullArray, maxColumns) {
    const splitArray = [];

    if (maxColumns > 0) {
      fullArray.forEach((element, index) => {
        const rowNumber = Math.floor(index / maxColumns);
        if (!splitArray[rowNumber]) {
          splitArray[rowNumber] = [];
        }
        splitArray[rowNumber].push(element);
      });

      // This array will not change, so we can break this rule
      // eslint-disable-next-line react/no-array-index-key
      const result = splitArray.map((row, index) => <tr key={index}>{row}</tr>);

      return <tbody key="status-actions-body">{result}</tbody>;
    }
    return null;
  }

  const actionsObject = {
    hurtHp: {
      category: 'HP',
      buttonText: 'Hurt',
      friendlyName: 'Hurt HP',
      action: 'hurt',
      buttonColor: 'red',
      textColor: 'white',
      colSpan: 1,
      disabled: false,
    },
    tempHp: {
      category: 'HP',
      buttonText: 'Temp',
      friendlyName: 'Temp HP',
      action: 'temp',
      buttonColor: 'blue',
      textColor: 'white',
      colSpan: 1,
      disabled: false,
    },
    healHp: {
      category: 'HP',
      buttonText: 'Heal',
      friendlyName: 'Heal HP',
      action: 'heal',
      buttonColor: 'green',
      textColor: 'white',
      colSpan: 1,
      disabled: false,
    },
    setHp: {
      category: 'HP',
      buttonText: 'Set',
      friendlyName: 'Set HP',
      action: 'set',
      buttonColor: 'white',
      textColor: 'black',
      colSpan: 1,
      disabled: false,
    },
    setMaxHp: {
      category: 'HP',
      buttonText: 'Max',
      friendlyName: 'Max HP',
      action: 'max',
      buttonColor: 'pink',
      textColor: 'white',
      colSpan: 1,
      disabled: true,
    },
    rest: {
      category: 'Long',
      buttonText: 'Rest',
      friendlyName: 'Long Rest',
      action: 'rest',
      buttonColor: 'black',
      textColor: 'white',
      colSpan: 1,
      disabled: true,
    },
    conditions: {
      category: 'Toggle',
      buttonText: 'Conditions',
      friendlyName: 'Toggle Conditions',
      action: 'conditions',
      buttonColor: 'gray',
      textColor: 'white',
      colSpan: 2,
      disabled: true,
    },
    deathSaves: {
      category: 'Death',
      buttonText: 'Saves',
      friendlyName: 'Death Saves',
      action: 'saves',
      buttonColor: 'gray',
      textColor: 'white',
      colSpan: 1,
      disabled: currentHp > 0,
    },
  };
  const actionsObjectKeys = Object.keys(actionsObject);

  const actionsMap = actionsObjectKeys.map((actionKey) => {
    const actionObject = actionsObject[actionKey];
    const paperProps = {
      width: 1,
      height: 70,
      color: actionObject.textColor,
      backgroundColor: actionObject.buttonColor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      opacity: actionObject.disabled ? 0.5 : 1,
    };
    const BTN_CATEGORY_STYLE = 'button';
    const BTN_TEXT_STYLE = 'button';

    return (
      <td key={actionKey} colSpan={actionObject.colSpan}>
        <ButtonBase
          sx={{ width: 1 }}
          disabled={actionObject.disabled}
          onClick={(e) => handleActionClick(e, actionObject.action)}
        >
          <Paper elevation={actionObject.disabled ? 0 : 3} sx={paperProps}>
            <Typography variant={BTN_CATEGORY_STYLE}>
              {`${actionObject.category}`}

              <br />
              <Typography variant={BTN_TEXT_STYLE}>
                {actionObject.buttonText}
              </Typography>
            </Typography>
          </Paper>
        </ButtonBase>
      </td>
    );
  });

  const inputKeypad = (
    <>
      <Typography variant="h5" color="text.primary" sx={{ py: 1 }}>
        {`${inputValue}`}
        <Button
          variant="contained"
          color="error"
          value="Cancel"
          onClick={(e) => handleCancelClick(e)}
          sx={{ position: 'absolute', left: 8, width: '30%' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="info"
          value="Cancel"
          onClick={(e) => handleConfirmClick(e)}
          sx={{ position: 'absolute', right: 8, width: '30%' }}
        >
          Confirm
        </Button>
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
          margin: 0.25,
        }}
      />
    </>
  );

  const actionTable = (
    <table
      style={{
        width: '100%',
        tableLayout: 'fixed',
      }}
    >
      {splitIntoRows(actionsMap, 3)}
    </table>
  );

  let content;

  switch (action) {
    case 'heal':
    case 'hurt':
    case 'temp':
    case 'set':
    case 'max':
      content = inputKeypad;
      break;
    case 'rest':
      // content = restConfirmation;
      break;
    case 'conditions':
      // content = conditionList;
      break;
    case 'saves':
      // content = deathSaves;
      break;
    default:
      content = actionTable;
  }

  return (
    <Box key="status" sx={{ textAlign: 'center', padding: 1 }}>
      {content}
    </Box>
  );
});

export default Status;
