/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';

export default function SpellSlots(props) {
  const { spellSlots, isSpellcaster, setCurrentSpellSlots } = props;

  const [activeSlotLevel, setActiveSlotLevel] = React.useState(0);

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

      if (max > 0) {
        for (let i = 1; i < max + 1; i += 1) {
          const iconName =
            i <= curr ? 'label_important' : 'label_important_outline';
          icons.push(
            <Icon fontSize="inherit" key={`${level}-${i}`}>
              {iconName}
            </Icon>
          );
        }

        const slotProps =
          curr === 0 ? { width: 1, color: 'lightgray' } : { width: 1 };

        element = (
          <td key={level}>
            <ButtonBase
              sx={{ width: 1 }}
              disableRipple
              onClick={() => setActiveSlotLevel(level)}
            >
              <Paper elevation={3} sx={slotProps}>
                <Typography
                  variant={SLOT_LEVEL_STYLE}
                >{`Level ${level}`}</Typography>
                <Typography variant={SLOT_CURR_STYLE}>
                  {curr}
                  <Typography variant={SLOT_MAX_STYLE}>{`/${max}`}</Typography>
                </Typography>
                <Typography>{icons}</Typography>
              </Paper>
            </ButtonBase>
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

    const slotMenu = (
      <Box>
        <Typography variant="h5" textAlign="center">
          Level {activeSlotLevel}
        </Typography>
        <table
          style={{
            width: '100%',
            tableLayout: 'fixed',
          }}
        >
          <tbody>
            <tr>
              <td colSpan="2">
                <Button
                  variant="contained"
                  color="secondary"
                  disableRipple
                  sx={{ width: 1, height: 50 }}
                  onClick={() => {
                    if (spellSlots.current[activeSlotLevel - 1] > 0) {
                      const newSlots = spellSlots.current;
                      newSlots[activeSlotLevel - 1] -= 1;
                      setCurrentSpellSlots(newSlots);
                    }
                    setActiveSlotLevel(0);
                  }}
                >
                  Spend
                </Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button
                  variant="contained"
                  color="secondary"
                  disableRipple
                  sx={{ width: 0.9, height: 50, my: 2 }}
                  onClick={() => {
                    if (
                      spellSlots.current[activeSlotLevel - 1] <
                      spellSlots.max[activeSlotLevel - 1]
                    ) {
                      const newSlots = spellSlots.current;
                      newSlots[activeSlotLevel - 1] += 1;
                      setCurrentSpellSlots(newSlots);
                    }
                    setActiveSlotLevel(0);
                  }}
                >
                  Restore 1
                </Button>
              </td>
              <td>
                <Button
                  variant="contained"
                  color="secondary"
                  disableRipple
                  sx={{ width: 0.9, height: 50, my: 2 }}
                  onClick={() => {
                    if (
                      spellSlots.current[activeSlotLevel - 1] !==
                      spellSlots.max[activeSlotLevel - 1]
                    ) {
                      const newSlots = spellSlots.current;
                      newSlots[activeSlotLevel - 1] =
                        spellSlots.max[activeSlotLevel - 1];
                      setCurrentSpellSlots(newSlots);
                    }
                    setActiveSlotLevel(0);
                  }}
                >
                  Restore All
                </Button>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <Button
                  variant="contained"
                  color="error"
                  disableRipple
                  sx={{ width: 0.8, height: 50 }}
                  onClick={() => {
                    setActiveSlotLevel(0);
                  }}
                >
                  Cancel
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Box>
    );

    const spellSlotTable = (
      <table style={{ width: '100%', tableLayout: 'fixed' }}>
        <tbody>
          <tr>{slotsTopRow}</tr>
          <tr>{slotsMidRow}</tr>
          <tr>{slotsBottomRow}</tr>
        </tbody>
      </table>
    );

    return (
      <Box sx={{ padding: 1 }}>
        {activeSlotLevel ? slotMenu : spellSlotTable}
      </Box>
    );
  }

  return null;
}
