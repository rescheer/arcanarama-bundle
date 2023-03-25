/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function Stats(props) {
  const { stats } = props;

  const STAT_NAME_STYLE = 'button';
  const STAT_MOD_STYLE = 'h4';
  const STAT_VALUE_STYLE = 'subtitle2';

  const statsTopRow = [];
  const statsBottomRow = [];

  const statNames = Object.keys(stats);
  statNames.forEach((stat, index) => {
    const name = stat.toUpperCase();
    const value = stats[stat];
    const mod = Math.floor((value - 10) / 2);
    const element = (
      <td key={name}>
        <ButtonBase sx={{ width: 1 }}>
          <Paper elevation={3} sx={{ width: 1 }}>
            <Typography variant={STAT_NAME_STYLE}>{name}</Typography>
            <Typography variant={STAT_MOD_STYLE}>
              {mod >= 0 ? `+${mod}` : `${mod}`}
            </Typography>
            <Typography variant={STAT_VALUE_STYLE}>{value}</Typography>
          </Paper>
        </ButtonBase>
      </td>
    );
    switch (Math.floor(index / 3)) {
      case 0:
        statsTopRow.push(element);
        break;
      case 1:
        statsBottomRow.push(element);
        break;
      default:
        break;
    }
  });

  return (
    <Box>
      <table style={{ width: '100%', tableLayout: 'fixed' }}>
        <tbody>
          <tr>{statsTopRow}</tr>
          <tr>{statsBottomRow}</tr>
        </tbody>
      </table>
    </Box>
  );
}
