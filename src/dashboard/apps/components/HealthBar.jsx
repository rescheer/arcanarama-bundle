/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const HealthBar = React.memo((props) => {
  const { currentHp, maxHp, tempHp, tempMax } = props;

  function normalize(val, maxValue, minResult, maxResult) {
    return ((val - minResult) / (maxValue - minResult)) * maxResult;
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <LinearProgress
        variant="buffer"
        value={normalize(currentHp, maxHp, 0, 100)}
        valueBuffer={normalize(tempHp, tempMax, 0, 100)}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '80%',
          maxWidth: 400,
          display: 'inline-block',
          top: 75,
          height: 20,
          backgroundColor: '#222',
          borderRadius: 5,
          borderStyle: 'outset',
          borderWidth: 3,
          borderColor: '#00bebe',
          '& .MuiLinearProgress-dashed': { display: 'none' },
          '& .MuiLinearProgress-bar1Buffer': {
            backgroundColor: `hsla(
                ${normalize(currentHp, maxHp, 0, 120)},
                50%,
                50%,
                1
              )`,
            transition: 'transform .4s linear, background-color .4s linear',
            borderRadius: 4,
            zIndex: 0,
          },
          '& .MuiLinearProgress-bar2Buffer': {
            borderRadius: 2,
            backgroundColor: '#0244f1',
            top: 0,
            height: 5,
            zIndex: 1,
          },
        }}
      />
      <br />
      <Typography
        variant="button"
        color="text.primary"
        sx={{
          position: 'relative',
          top: 45,
          fontSize: 40,
          textShadow: '2px 2px 4px black',
        }}
      >
        {currentHp}
        <Typography
          variant="button"
          sx={{
            position: 'absolute',
            top: 20,
            fontSize: 15,
            color: '#0244f1',
          }}
        >
          {tempHp > 0 ? `+${tempHp}` : ``}
        </Typography>
        <Typography
          variant="button"
          color="text.primary"
          sx={{ position: 'relative', top: -50, fontSize: 15 }}
        >
          <br />/{maxHp}
        </Typography>
      </Typography>
    </Box>
  );
});

export default HealthBar;
