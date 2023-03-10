/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Ours
import Keypad from './Keypad';

const HealthManager = React.memo((props) => {
  const { handleHpChange, handleTempHpChange, inputValue, handleKeypadClick } =
    props;

  const KEYPAD_SIZE = 45;

  return (
    <Box key="health" sx={{ flexGrow: 1, textAlign: 'center' }}>
      <Button
        variant="contained"
        color="error"
        size="small"
        value={-1}
        onClick={(e) => handleHpChange(e)}
        sx={{
          position: 'absolute',
          left: 0,
          top: 115,
          height: 40,
          width: 80,
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
          top: 115,
          height: 40,
          width: 80,
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
          top: 140,
          height: 40,
          width: 80,
        }}
      >
        TempHP
      </Button>
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

export default HealthManager;
