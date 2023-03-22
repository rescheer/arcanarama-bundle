/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';

export default function SpellSlots(props) {
  const { spellSlots, isSpellcaster } = props;

  if (isSpellcaster) {
    const { max: maxSpellSlots, current: currentSpellSlots } = spellSlots;

    const SLOT_LEVEL_STYLE = 'button';
    const SLOT_CURR_STYLE = 'h4';
    const SLOT_MAX_STYLE = 'caption';

    const slotsTopRow = [];
    const slotsMidRow = [];
    const slotsBottomRow = [];

    maxSpellSlots.forEach((max, index) => {
      const level = index + 1;
      const curr = currentSpellSlots[index];
      let element = '';
      const icons = [];

      for (let i = 0; i < max; i += 1) {
        const iconName =
          i <= max ? 'label_important' : 'label_important_outline';
        icons.push(
          <Icon fontSize="inherit" key={`${level}-${i}`}>
            {iconName}
          </Icon>
        );
      }

      if (max > 0) {
        element = (
          <td key={level} className="td-border">
            <Typography
              variant={SLOT_LEVEL_STYLE}
            >{`Level ${level}`}</Typography>
            <Typography variant={SLOT_CURR_STYLE}>
              {curr}
              <Typography variant={SLOT_MAX_STYLE}>{`/${max}`}</Typography>
            </Typography>
            <Typography>{icons}</Typography>
          </td>
        );
      }
      switch (Math.floor(index / 3)) {
        case 0:
          slotsTopRow.push(element);
          break;
        case 1:
          slotsMidRow.push(element);
          break;
        case 2:
          slotsBottomRow.push(element);
          break;
        default:
          break;
      }
    });

    return (
      <Box>
        <table style={{ width: '100%', tableLayout: 'fixed' }}>
          <tbody>
            <tr>{slotsTopRow}</tr>
            <tr>{slotsMidRow}</tr>
            <tr>{slotsBottomRow}</tr>
          </tbody>
        </table>
      </Box>
    );
  }

  return null;
}
