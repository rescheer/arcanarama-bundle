/* eslint-disable react/prop-types */
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';

// Ours
import Status from './components/Status';
import HealthBar from './components/HealthBar';
import SpellSlots from './components/SpellSlots';
import Stats from './components/Stats';

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#2f3a4f',
    },
    secondary: {
      main: '#00bebe',
    },
    success: {
      main: '#40bf40',
    },
    info: {
      main: '#0244f1',
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(0, 0, 0, 0.7)',
    },
    background: {
      paper: '#009797',
    },
    divider: 'rgba(255, 255, 255, 0.3)',
  },
});

const accordianTheme = createTheme({
  palette: {
    primary: {
      main: '#2f3a4f',
    },
    secondary: {
      main: '#00bebe',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.9)',
      secondary: 'rgba(0, 0, 0, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.3)',
  },
});

export default function TrackerApp(props) {
  const { characters, appSetter, charSetter, activeCharId } = props;
  let character;

  // Config
  const BIO_YPOSITION = 2;
  // Accordion Props
  const ACC_DETAILS_PROPS = { bgcolor: '#7687a8', padding: 0 };
  const ACC_ROOT_PROPS = { bgcolor: '#525f78' };

  if (Object.hasOwn(characters, activeCharId)) {
    character = characters[activeCharId];
  } else {
    charSetter(undefined);
    appSetter('select');
  }

  const { fullName, avatarUrl, hp, ac, isSpellcaster, stats, spellSlots } =
    character.data;

  let currentAc = ac.base;
  ac.bonuses.forEach((bonus) => {
    currentAc += bonus;
  });

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('0');
  const [currentHp, setCurrentHpState] = React.useState(hp.current);
  const [maxHp, setMaxHpState] = React.useState(hp.max);
  const [tempHp, setTempHpState] = React.useState(hp.temp);
  const [tempMax, setTempMaxState] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentSpellSlots, setCurrentSpellSlotsState] = React.useState(
    spellSlots.current
  );

  const handleAccordionOpen = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // When another client changes the replicant, update states from it
  React.useEffect(() => {
    setCurrentHpState(characters[activeCharId].data.hp.current);
    setTempHpState(characters[activeCharId].data.hp.temp);
    setTempMaxState(characters[activeCharId].data.hp.tempMax);
    setMaxHpState(characters[activeCharId].data.hp.max);
    setCurrentSpellSlotsState(characters[activeCharId].data.spellSlots.current);
  }, [characters, activeCharId]);

  function setCurrentHp(newVal) {
    setCurrentHpState(newVal);
    characters[activeCharId].data.hp.current = newVal;
  }

  function setTempHp(newVal) {
    setTempHpState(newVal);
    characters[activeCharId].data.hp.temp = newVal;
  }

  function setMaxHp(newVal) {
    if (currentHp < newVal) {
      setMaxHpState(newVal);
      characters[activeCharId].data.hp.max = newVal;
    } else {
      setMaxHpState(newVal);
      characters[activeCharId].data.hp.max = newVal;
      setCurrentHp(newVal);
    }
  }

  function setTempMax(newVal) {
    setTempMaxState(newVal);
    characters[activeCharId].data.hp.tempMax = newVal;
  }

  function setCurrentSpellSlots(newVal) {
    setCurrentSpellSlotsState(newVal);
    characters[activeCharId].data.spellSlots.current = newVal;
  }

  function handleSettingsButtonClick() {
    setSettingsOpen(!settingsOpen);
  }

  function handleBackButtonClick() {
    if (settingsOpen) {
      setSettingsOpen(false);
    } else {
      charSetter(undefined);
      appSetter('select');
    }
  }

  function handleRefreshButtonClick() {
    if (character) {
      window.nodecg.sendMessage('character', {
        refresh: { ddbId: character.ddbId, player: character.player },
      });
      charSetter(undefined);
      appSetter('select');
    }
  }

  function handleResetButtonClick() {
    if (character) {
      window.nodecg.sendMessage('character', {
        reparse: { ddbId: character.ddbId },
      });
      charSetter(undefined);
      appSetter('select');
    }
  }

  function handleRemoveButtonClick() {
    if (character) {
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (confirm(`Remove ${character.data.fullName}?`)) {
        window.nodecg.sendMessage('character', {
          delete: { ddbId: character.ddbId },
        });
        charSetter(undefined);
        appSetter('select');
      }
    }
  }

  function handleKeypadClick(e) {
    const newValue = e.currentTarget.value;

    if (newValue) {
      switch (newValue) {
        case 'clear':
          if (inputValue !== '0') {
            setInputValue('0');
          }
          break;
        case 'backspace':
          if (inputValue.length > 1) {
            const newStr = inputValue.slice(0, inputValue.length - 1);
            setInputValue(newStr);
          } else {
            setInputValue('0');
          }
          break;
        default:
          if (inputValue === '0') {
            setInputValue(`${newValue}`);
          } else {
            setInputValue(`${inputValue}${newValue}`);
          }
          break;
      }
    }
  }

  function handleHpChange(action) {
    switch (action) {
      case 'heal':
      case 'hurt':
        {
          const multiplier = action === 'hurt' ? -1 : 1;
          let deltaHp = inputValue * multiplier;
          const oldHp = currentHp;
          let newHp = 0;

          // Process temp hp
          if (tempHp > 0 && deltaHp < 0) {
            if (Math.abs(deltaHp) > +tempHp) {
              setTempHp(0);
              deltaHp += +tempHp;
            } else {
              setTempHp(+tempHp + +deltaHp);
              deltaHp = 0;
            }
          }

          // Handle healing from negative HP
          if (+oldHp <= 0 && +deltaHp > 0) {
            newHp = +deltaHp;
          } else {
            newHp = +oldHp + +deltaHp;
          }

          if (newHp > maxHp) {
            setCurrentHp(maxHp);
          } else if (newHp <= 0) {
            setCurrentHp(newHp);
            // handle death
          } else {
            setCurrentHp(newHp);
          }
          setInputValue('0');
        }
        break;
      case 'temp':
        setTempMax(inputValue);
        setTempHp(inputValue);
        setInputValue('0');
        break;
      default:
        break;
    }
  }

  // Main Content
  const statusAccordion = (
    <Accordion
      sx={ACC_ROOT_PROPS}
      expanded={expanded === 'status'}
      onChange={handleAccordionOpen('status')}
    >
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
        <Typography variant="button">Status</Typography>
      </AccordionSummary>
      <AccordionDetails sx={ACC_DETAILS_PROPS}>
        <Status
          handleHpChange={(newVal) => handleHpChange(newVal)}
          setMaxHp={(newVal) => setMaxHp(newVal)}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleKeypadClick={(i, e) => handleKeypadClick(i, e)}
        />
      </AccordionDetails>
    </Accordion>
  );

  const spellCasterAccordion = isSpellcaster ? (
    <Accordion
      sx={ACC_ROOT_PROPS}
      expanded={expanded === 'spells'}
      onChange={handleAccordionOpen('spells')}
    >
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
        <Typography variant="button">Spell Slots</Typography>
      </AccordionSummary>
      <AccordionDetails sx={ACC_DETAILS_PROPS}>
        <SpellSlots
          spellSlots={spellSlots}
          isSpellcaster={isSpellcaster}
          setCurrentSpellSlots={(newVal) => setCurrentSpellSlots(newVal)}
        />
      </AccordionDetails>
    </Accordion>
  ) : null;

  const statsAccordion = (
    <Accordion
      sx={ACC_ROOT_PROPS}
      expanded={expanded === 'stats'}
      onChange={handleAccordionOpen('stats')}
    >
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
        <Typography variant="button">Stats</Typography>
      </AccordionSummary>
      <AccordionDetails sx={ACC_DETAILS_PROPS}>
        <Stats stats={stats} />
      </AccordionDetails>
    </Accordion>
  );

  const fullAccordions = (
    <ThemeProvider theme={accordianTheme}>
      {statusAccordion}
      {spellCasterAccordion}
      {statsAccordion}
    </ThemeProvider>
  );

  const settingsContent = (
    <Box textAlign="center">
      <Typography variant="h5" color="white">
        Settings
      </Typography>
      <hr />
      <Button
        variant="contained"
        onClick={(event) => handleRefreshButtonClick(event)}
      >
        Refresh
      </Button>
      <Typography variant="subtitle1" color="white">
        Redownload this character from D&D Beyond and reset to original values
      </Typography>
      <hr />
      <Button
        variant="contained"
        onClick={(event) => handleResetButtonClick(event)}
      >
        Reset
      </Button>
      <Typography variant="subtitle1" color="white">
        Reset this character to original values
      </Typography>
      <hr />
      <Button
        variant="contained"
        color="error"
        onClick={(event) => handleRemoveButtonClick(event)}
      >
        Remove
      </Button>
      <Typography variant="subtitle1" color="white">
        Remove this character from Autonorama
      </Typography>
    </Box>
  );

  return (
    <Box>
      <ThemeProvider theme={baseTheme}>
        <Box key="main">
          {!settingsOpen ? (
            <Button
              sx={{
                position: 'absolute',
                right: -3,
                mt: 1,
                mb: 1,
                py: 1,
                zIndex: 90,
              }}
              type="button"
              size="small"
              id="backButton"
              variant="contained"
              color="secondary"
              onClick={(event) => handleSettingsButtonClick(event)}
            >
              <Icon>settings</Icon>
            </Button>
          ) : null}
          <Button
            sx={{
              position: 'absolute',
              left: -3,
              mt: 1,
              mb: 1,
              py: 1,
              zIndex: 90,
            }}
            type="button"
            size="small"
            id="backButton"
            variant="contained"
            color="primary"
            onClick={(event) => handleBackButtonClick(event)}
          >
            <Icon>arrow_back</Icon>
          </Button>
          <Box sx={{ color: 'text.primary' }}>
            <img
              src={avatarUrl}
              alt="avatar"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                margin: 'auto',
                width: '25%',
                maxWidth: 100,
                borderRadius: '50%',
              }}
            />
            <Typography
              align="center"
              noWrap
              variant="h5"
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                top: BIO_YPOSITION + 43,
                textShadow: '2px 2px 4px black',
              }}
            >
              {fullName}
            </Typography>
          </Box>
          <HealthBar
            currentHp={currentHp}
            maxHp={maxHp}
            tempHp={tempHp}
            tempMax={tempMax}
            currentAc={currentAc}
          />
        </Box>
      </ThemeProvider>
      {settingsOpen ? settingsContent : fullAccordions}
    </Box>
  );
}
