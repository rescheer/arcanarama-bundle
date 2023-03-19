/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Ours
import Keypad from './Keypad';

const StatusManager = React.memo((props) => {
  const { handleHpChange, handleTempHpChange, inputValue, handleKeypadClick } =
    props;

  const KEYPAD_SIZE = 50;

  return (
    <Box key="health" sx={{ flexGrow: 1, textAlign: 'center' }}>
      <Typography
        variant="h5"
        color="text.primary"
        sx={{
          position: 'relative',
          top: 30,
          textAlign: 'center',
          borderStyle: 'outset',
          borderColor: '#00bebe',
        }}
      >
        <Button
          variant="contained"
          color="error"
          size="small"
          value={-1}
          onClick={(e) => handleHpChange(e)}
          sx={{
            position: 'absolute',
            left: 0,
            top: -48,
            height: 40,
            width: 60,
            zIndex: 10,
          }}
        >
          Hurt
        </Button>
        <Button
          variant="contained"
          color="success"
          size="small"
          value={1}
          onClick={(e) => handleHpChange(e)}
          sx={{
            position: 'absolute',
            right: 0,
            top: -48,
            height: 40,
            width: 60,
            zIndex: 10,
          }}
        >
          Heal
        </Button>
        <Button
          variant="contained"
          color="info"
          size="small"
          value={1}
          onClick={(e) => handleTempHpChange(e)}
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            top: -48,
            height: 40,
            width: 80,
          }}
        >
          TempHP
        </Button>
        {inputValue}
        <Keypad
          tableWidth="50%"
          color="secondary"
          onClick={(i, e) => handleKeypadClick(i, e)}
          noRipple={false}
          buttonProps={{
            height: KEYPAD_SIZE,
            width: KEYPAD_SIZE,
            minWidth: 0,
            borderRadius: '50%',
            margin: 0.5,
          }}
        />
      </Typography>
    </Box>
  );
});

export default StatusManager;
